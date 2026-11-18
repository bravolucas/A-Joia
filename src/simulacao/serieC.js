import { ordenarTabelaBrasileira } from './desempateBrasileiro.js';

/**
 * Campeonato Brasileiro Série C.
 * 2026: 20 clubes, turno único, 8 avançam, 2 rebaixados.
 * 2027: 24 clubes, turno único, 8 avançam, 2 rebaixados.
 * 2028+: 28 clubes em dois grupos de 14, ida e volta, 6 rebaixados.
 *
 * Os quadrangulares de acesso têm dois grupos de 4, seis rodadas cada.
 * Os dois líderes de cada grupo sobem (4 acessos); os líderes disputam
 * a final em ida e volta. Os placares e a composição ficam persistíveis.
 */
export function regulamentoSerieC(ano = 2026) {
  if (ano <= 2026) return { ano, participantes: 20, formato: 'grupo-unico', rodadas: 19, descenso: 2, acesso: 4 };
  if (ano === 2027) return { ano, participantes: 24, formato: 'grupo-unico', rodadas: 23, descenso: 2, acesso: 4 };
  return { ano, participantes: 28, formato: 'dois-grupos', rodadas: 26, descenso: 6, acesso: 4 };
}

function confrontosCirculo(nomes, turnoEVolta = false) {
  const ordem = [...nomes];
  const posicaoInicial = new Map(nomes.map((nome, indice) => [nome, indice]));
  if (ordem.length % 2) ordem.push(null);
  const rodadas = [];
  for (let rodada = 0; rodada < ordem.length - 1; rodada++) {
    const confrontos = [];
    for (let i = 0; i < ordem.length / 2; i++) {
      const a = ordem[i], b = ordem[ordem.length - 1 - i];
      if (!a || !b) continue;
      // Orientação circular de todos os pares: numa liga par cada clube
      // recebe 9/10 (20 times), 11/12 (24) ou 13/13 (28 com volta) mandos.
      // Alterar o mandante pela paridade da rodada gerava 18/1 em 2026.
      const tamanhoReal = nomes.length;
      const distancia = (posicaoInicial.get(b) - posicaoInicial.get(a) + tamanhoReal) % tamanhoReal;
      const aManda = distancia < tamanhoReal / 2 ||
        (distancia === tamanhoReal / 2 && posicaoInicial.get(a) < tamanhoReal / 2);
      const casa = aManda ? a : b;
      const fora = aManda ? b : a;
      confrontos.push({ casa, fora, rodada: rodada + 1 });
    }
    rodadas.push(confrontos);
    ordem.splice(1, 0, ordem.pop());
  }
  if (!turnoEVolta) return rodadas;
  const volta = rodadas.map((jogos, i) => jogos.map(jogo => ({
    casa: jogo.fora, fora: jogo.casa, rodada: rodadas.length + i + 1,
  })));
  return [...rodadas, ...volta];
}

/**
 * Calendário público da Série C: compartilha a distribuição equilibrada de
 * mandos com o motor do campeonato e com as carreiras do Modo Treinador.
 * Recebe os nomes de um grupo já definido, sem selecionar adversários.
 */
export function calendarioSerieCClubes(nomes = [], idaVolta = false) {
  if (!Array.isArray(nomes) || nomes.length < 2 ||
      nomes.some(nome => typeof nome !== 'string' || !nome) ||
      new Set(nomes).size !== nomes.length) return [];
  return confrontosCirculo(nomes, idaVolta);
}

function poisson(media, rng) {
  let produto = 1, vezes = 0, limite = Math.exp(-Math.max(0.1, Math.min(4.5, media)));
  do {
    produto *= Math.min(0.999999999, Math.max(0.000000001, Number(rng()) || 0));
    vezes++;
  } while (produto > limite && vezes < 16);
  return vezes - 1;
}

function jogarTabela(clubes, idaVolta, rng, fase) {
  const forcas = Object.fromEntries(clubes.map(c => [c.nome, Number(c.elenco ?? c.forca) || 55]));
  const rodadas = confrontosCirculo(clubes.map(c => c.nome), idaVolta);
  const jogos = rodadas.flat().map(jogo => {
    const diferenca = (forcas[jogo.casa] - forcas[jogo.fora]) * .03;
    return {
      ...jogo, fase,
      golsCasa: poisson(1.45 + diferenca, rng),
      golsFora: poisson(1.05 - diferenca, rng),
    };
  });
  const tabela = new Map(clubes.map(c => [c.nome, {
    nome: c.nome, jogos: 0, pontos: 0, vitorias: 0, empates: 0, derrotas: 0,
    golsPro: 0, golsContra: 0, saldoGols: 0,
  }]));
  for (const jogo of jogos) {
    const casa = tabela.get(jogo.casa), fora = tabela.get(jogo.fora);
    if (!casa || !fora) throw new Error('Partida com clube fora da tabela da Série C');
    casa.jogos++; fora.jogos++;
    casa.golsPro += jogo.golsCasa; casa.golsContra += jogo.golsFora;
    fora.golsPro += jogo.golsFora; fora.golsContra += jogo.golsCasa;
    if (jogo.golsCasa > jogo.golsFora) { casa.vitorias++; fora.derrotas++; casa.pontos += 3; }
    else if (jogo.golsCasa < jogo.golsFora) { fora.vitorias++; casa.derrotas++; fora.pontos += 3; }
    else { casa.empates++; fora.empates++; casa.pontos++; fora.pontos++; }
  }
  for (const linha of tabela.values()) linha.saldoGols = linha.golsPro - linha.golsContra;
  const classificacao = ordenarTabelaBrasileira([...tabela.values()], jogos)
    .map((linha, i) => ({ ...linha, posicao: i + 1 }));
  return { rodadas: rodadas.length, jogos, classificacao };
}

function gruposDeAcesso(classificacao, clubes) {
  const porNome = new Map(clubes.map(c => [c.nome, c]));
  // CBF 2026/2027: grupo B = 1º, 4º, 5º, 8º; grupo C = 2º, 3º, 6º, 7º.
  return [
    { nome: 'B', participantes: [0, 3, 4, 7].map(i => porNome.get(classificacao[i].nome)) },
    { nome: 'C', participantes: [1, 2, 5, 6].map(i => porNome.get(classificacao[i].nome)) },
  ];
}

function finalSerieC(liderB, liderC, clubes, rng, mandanteVolta = liderC) {
  const porNome = new Map(clubes.map(c => [c.nome, Number(c.elenco ?? c.forca) || 55]));
  const placar = (casa, fora, fase) => {
    const diff = (porNome.get(casa) - porNome.get(fora)) * .03;
    return {
      casa, fora, fase, golsCasa: poisson(1.45 + diff, rng),
      golsFora: poisson(1.05 - diff, rng),
    };
  };
  const mandanteIda = mandanteVolta === liderB ? liderC : liderB;
  const ida = placar(mandanteIda, mandanteVolta, 'ida');
  const volta = placar(mandanteVolta, mandanteIda, 'volta');
  const golsB = (ida.casa === liderB ? ida.golsCasa : ida.golsFora) +
    (volta.casa === liderB ? volta.golsCasa : volta.golsFora);
  const golsC = (ida.casa === liderC ? ida.golsCasa : ida.golsFora) +
    (volta.casa === liderC ? volta.golsCasa : volta.golsFora);
  const empate = golsB === golsC;
  const campeao = empate ? (rng() < .5 ? liderB : liderC) : golsB > golsC ? liderB : liderC;
  return {
    jogos: [ida, volta], mandanteVolta, agregado: { [liderB]: golsB, [liderC]: golsC },
    campeao, vice: campeao === liderB ? liderC : liderB,
    criterio: empate ? 'penaltis' : 'saldo-agregado',
  };
}

/**
 * Executa um torneio inteiro; não altera os clubes recebidos nem as divisões.
 * Para temporadas 2028+, a composição dos grupos usa distribuição técnica por
 * nível (substituível por sorteio/regionalização oficiais quando disponíveis).
 */
export function simularSerieC({ clubes = [], ano = 2026, rng = Math.random } = {}) {
  const regras = regulamentoSerieC(ano);
  if (clubes.length !== regras.participantes || new Set(clubes.map(c => c?.nome)).size !== regras.participantes ||
    clubes.some(c => typeof c?.nome !== 'string' || !c.nome)) {
    throw new Error(`Série C ${ano} exige ${regras.participantes} clubes distintos.`);
  }
  let primeiraFase, classificacao, rebaixados, times = clubes;
  if (regras.formato === 'grupo-unico') {
    const unico = jogarTabela(times, false, rng, 'primeira-fase');
    primeiraFase = { formato: regras.formato, grupos: [{ nome: 'A', ...unico }] };
    classificacao = unico.classificacao;
    rebaixados = classificacao.slice(-2).map(x => x.nome);
  } else {
    // Competição nacional de 2028: 2 grupos com 14 e ida/volta.
    const porNivel = [...times].sort((a, b) =>
      (Number(b.elenco ?? b.forca) || 55) - (Number(a.elenco ?? a.forca) || 55) ||
      a.nome.localeCompare(b.nome, 'pt-BR'));
    const a = [], b = [];
    porNivel.forEach((c, i) => ((i % 4 === 0 || i % 4 === 3) ? a : b).push(c));
    const ga = jogarTabela(a, true, rng, 'primeira-fase-A');
    const gb = jogarTabela(b, true, rng, 'primeira-fase-B');
    primeiraFase = { formato: regras.formato, grupos: [{ nome: 'A', ...ga }, { nome: 'B', ...gb }] };
    // Os quatro de cada grupo avançam; os três últimos de cada um caem.
    classificacao = [ga.classificacao[0], gb.classificacao[0], ga.classificacao[1], gb.classificacao[1],
      ga.classificacao[2], gb.classificacao[2], ga.classificacao[3], gb.classificacao[3]];
    rebaixados = [...ga.classificacao.slice(-3), ...gb.classificacao.slice(-3)].map(x => x.nome);
  }
  const chaves = gruposDeAcesso(classificacao, times).map(chave => ({
    nome: chave.nome,
    ...jogarTabela(chave.participantes, true, rng, 'quadrangular-' + chave.nome),
  }));
  const promovidos = chaves.flatMap(chave => chave.classificacao.slice(0, 2).map(x => x.nome));
  // A volta da final cabe ao clube de melhor campanha nas duas fases.
  const campanha = nome => {
    const regular = primeiraFase.grupos.flatMap(g => g.classificacao).find(x => x.nome === nome);
    const quadrangular = chaves.flatMap(g => g.classificacao).find(x => x.nome === nome);
    return [regular, quadrangular].reduce((soma, linha) => ({
      pontos: soma.pontos + (linha?.pontos || 0),
      vitorias: soma.vitorias + (linha?.vitorias || 0),
      saldo: soma.saldo + (linha?.saldoGols || 0),
      gols: soma.gols + (linha?.golsPro || 0),
    }), { pontos: 0, vitorias: 0, saldo: 0, gols: 0 });
  };
  const liderB = chaves[0].classificacao[0].nome, liderC = chaves[1].classificacao[0].nome;
  const b = campanha(liderB), c = campanha(liderC);
  const melhorCampanhaB = b.pontos !== c.pontos ? b.pontos > c.pontos
    : b.vitorias !== c.vitorias ? b.vitorias > c.vitorias
    : b.saldo !== c.saldo ? b.saldo > c.saldo
    : b.gols !== c.gols ? b.gols > c.gols
    : liderB.localeCompare(liderC, 'pt-BR') < 0;
  const final = finalSerieC(liderB, liderC, times, rng, melhorCampanhaB ? liderB : liderC);
  return {
    liga: 'serieC', ano, regulamento: regras, primeiraFase,
    classificacao: primeiraFase.grupos.length === 1 ? classificacao : null,
    quadrangulares: chaves, promovidos, rebaixados, final,
    campeao: final.campeao, vice: final.vice,
  };
}
