import {regiaoDaLiga} from '../competicoes/regrasCopasRapidas.js';
import {simularClassificacoesMundoTecnico} from '../treinador/classificacoesMundoTecnico.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {compactarJogos, jogosDaEdicao} from '../simulacao/mundoVivo.js';

function placaresRegistrados(edicao) {
  if (Array.isArray(edicao?.jogos)) return edicao.jogos;
  return jogosDaEdicao(edicao).map(({rodada, casa, fora, golsCasa, golsFora}) =>
    ({rodada, casa, fora, golsCasa, golsFora}));
}

export function criarCalendarioLigasRapido(equipes, codigo, ano) {
  return {
    ano,
    seed: `${codigo}|${ano}|ligas-rapido`,
    equipes: equipes.map(({nome, liga, elenco, ataque, defesa}) => ({nome, liga, elenco, ataque, defesa})),
    ligas: {},
  };
}

function simularLigas(estado, clubes, progresso, jogosAnteriores) {
  return simularClassificacoesMundoTecnico({
    clubes, ano: estado.ano, progresso, jogosAnteriores,
    rng: geradorTecnico(estado.seed),
    rngLigaRodada: (liga, rodada) => geradorTecnico(`${estado.seed}|${liga}|${rodada}`),
  });
}

export function avancarCalendarioLigasRapido(estado, data) {
  const ligas = {...estado.ligas};
  for (const europa of [true, false]) {
    const inicio = europa ? -4 : 1.5;
    const fim = europa ? 5.8 : 12.05;
    const progresso = Math.max(0, Math.min(1, (data - inicio) / (fim - inicio)));
    if (!progresso) continue;
    const clubes = estado.equipes.filter(clube =>
      (regiaoDaLiga(clube.liga) === 'europa') === europa &&
      (ligas[clube.liga]?.progresso ?? 0) < progresso);
    if (!clubes.length) continue;
    const ligasEmCurso = new Set(clubes.map(clube => clube.liga));
    const jogosAnteriores = Object.fromEntries([...ligasEmCurso].map(liga =>
      [liga, placaresRegistrados(ligas[liga])]));
    const simuladas = simularLigas(estado, clubes, progresso, jogosAnteriores);
    for (const [liga, edicao] of Object.entries(simuladas)) {
      const jogos = edicao.origem === 'simulacao-global' ? compactarJogos(edicao.jogos) : edicao.jogos;
      ligas[liga] = {...edicao, progresso, jogos};
    }
  }
  return {...estado, ligas};
}

export function finalizarCalendarioLigasRapido(estado) {
  if (!Object.keys(estado.ligas).length) return simularLigas(estado, estado.equipes, 1);
  const {ligas} = avancarCalendarioLigasRapido(estado, Infinity);
  return Object.fromEntries(Object.entries(ligas).map(([liga, {progresso, ...edicao}]) =>
    [liga, {...edicao, jogos: placaresRegistrados(edicao)}]));
}
