/** Playoff de acesso do Brasileiro Série B (CBF, regulamento 2026, arts. 5 e 13).
 * 3º x 6º e 4º x 5º, em dois jogos. A melhor campanha decide o mando da volta
 * e o desempate, caso pontos e saldo de gols sejam iguais. Não há pênaltis.
 * O sorteio é recebido por parâmetro para preservar a semente da carreira.
 */
const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));
function poisson(lambda, rng) {
  const corte = Math.exp(-lambda);
  let produto = 1, gols = -1;
  do { gols++; produto *= rng(); } while (produto > corte && gols < 12);
  return gols;
}
function placarAutomatico(casa, fora, forcas, rng) {
  const a = Number(forcas[casa]) || 55;
  const b = Number(forcas[fora]) || 55;
  return {
    golsCasa: poisson(limitar(1.38 + (a - b) * 0.036, 0.18, 4.2), rng),
    golsFora: poisson(limitar(1.08 + (b - a) * 0.036, 0.16, 4.0), rng),
  };
}
/** @returns {null|{versao:number,acessoDireto:string[],promovidos:string[],confrontos:object[],jogos:object[]}} */
export function resolverPlayoffSerieB({ classificacao, forcas = {}, rng = Math.random, simularJogo = null } = {}) {
  if (!Array.isArray(classificacao) || classificacao.length < 6 ||
      new Set(classificacao.map(l => l?.nome).filter(Boolean)).size !== classificacao.length) return null;
  const participantes = [classificacao[2], classificacao[3], classificacao[4], classificacao[5]];
  const confrontos = [];
  for (const [superior, inferior] of [[participantes[0], participantes[3]], [participantes[1], participantes[2]]]) {
    const mandos = [[inferior.nome, superior.nome], [superior.nome, inferior.nome]];
    const jogos = mandos.map(([casa, fora], i) => {
      const placar = simularJogo
        ? simularJogo(casa, fora, i + 1, superior.nome, inferior.nome)
        : placarAutomatico(casa, fora, forcas, rng);
      const golsCasa = Math.max(0, Math.trunc(Number(placar?.golsCasa) || 0));
      const golsFora = Math.max(0, Math.trunc(Number(placar?.golsFora) || 0));
      return { rodada: i + 1, fase: 'Playoff de acesso', casa, fora, golsCasa, golsFora };
    });
    const pontos = { [superior.nome]: 0, [inferior.nome]: 0 };
    const gols = { [superior.nome]: 0, [inferior.nome]: 0 };
    for (const j of jogos) {
      gols[j.casa] += j.golsCasa;
      gols[j.fora] += j.golsFora;
      if (j.golsCasa > j.golsFora) pontos[j.casa] += 3;
      else if (j.golsFora > j.golsCasa) pontos[j.fora] += 3;
      else { pontos[j.casa]++; pontos[j.fora]++; }
    }
    const maiorPontos = pontos[superior.nome] - pontos[inferior.nome];
    const maiorSaldo = gols[superior.nome] - gols[inferior.nome];
    const vencedor = maiorPontos > 0 || (maiorPontos === 0 && maiorSaldo >= 0)
      ? superior.nome : inferior.nome;
    confrontos.push({
      superior: superior.nome, inferior: inferior.nome, mandanteVolta: superior.nome,
      jogos, pontos, agregado: gols, vencedor,
      criterio: maiorPontos !== 0 ? 'pontos' : maiorSaldo !== 0 ? 'saldo de gols' : 'melhor campanha',
    });
  }
  const acessoDireto = classificacao.slice(0, 2).map(l => l.nome);
  return {
    versao: 2026, formato: '3º x 6º / 4º x 5º (ida e volta)',
    acessoDireto, confrontos,
    promovidos: [...acessoDireto, ...confrontos.map(c => c.vencedor)],
    jogos: confrontos.flatMap(c => c.jogos),
  };
}
