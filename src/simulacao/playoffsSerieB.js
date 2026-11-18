/**
 * Campeonato Brasileiro Série B (regulamento de 2026 em diante).
 * Após 38 rodadas, 1º e 2º sobem; 3º x 6º e 4º x 5º disputam
 * dois jogos. O 3º/4º manda a volta e avança se o agregado empatar.
 * Não há prorrogação, pênaltis ou gol fora de casa.
 *
 * Recebe classificação já ordenada e sorteador injetado para que a
 * passagem de temporada produza sempre um único resultado persistível.
 */
const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));

function poisson(media, rng) {
  const limite = Math.exp(-media);
  let tentativas = 0, produto = 1;
  do {
    tentativas += 1;
    produto *= limitar(Number(rng()), 0, 0.9999999999);
  } while (produto > limite && tentativas < 35);
  return tentativas - 1;
}

function partida(casa, fora, forcas, rng, fase) {
  const nivelCasa = Number(forcas[casa]) || 55;
  const nivelFora = Number(forcas[fora]) || 55;
  const golsCasa = poisson(limitar(1.55 + (nivelCasa - nivelFora) * 0.032, 0.25, 4.2), rng);
  const golsFora = poisson(limitar(1.10 + (nivelFora - nivelCasa) * 0.03, 0.20, 3.7), rng);
  return { fase, casa, fora, golsCasa, golsFora };
}

export function resolverPlayoffsSerieB(classificacao, forcas = {}, rng = Math.random) {
  if (!Array.isArray(classificacao) || classificacao.length !== 20) return null;
  const nomes = classificacao.map(linha => linha?.nome);
  if (nomes.some(nome => typeof nome !== 'string' || !nome) || new Set(nomes).size !== 20) return null;

  const confrontos = [[2, 5], [3, 4]].map(([melhorIndice, piorIndice], indice) => {
    const melhor = nomes[melhorIndice], pior = nomes[piorIndice];
    const ida = partida(pior, melhor, forcas, rng, 'ida');
    const volta = partida(melhor, pior, forcas, rng, 'volta');
    const golsMelhor = ida.golsFora + volta.golsCasa;
    const golsPior = ida.golsCasa + volta.golsFora;
    const empateAgregado = golsMelhor === golsPior;
    const classificado = golsMelhor >= golsPior ? melhor : pior;
    return {
      chave: indice + 1,
      confronto: `${melhorIndice + 1}º x ${piorIndice + 1}º`,
      melhorCampanha: melhor,
      adversario: pior,
      mandanteVolta: melhor,
      jogos: [ida, volta],
      agregado: { [melhor]: golsMelhor, [pior]: golsPior },
      classificado,
      criterio: empateAgregado ? 'melhor-campanha' : 'saldo-agregado',
    };
  });

  return {
    regulamento: 'serie-b-2026',
    faseRegular: 38,
    acessoDireto: nomes.slice(0, 2),
    confrontos,
    promovidos: [...nomes.slice(0, 2), ...confrontos.map(c => c.classificado)],
  };
}
