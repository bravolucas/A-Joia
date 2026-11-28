import {prepararDecisoesLigas} from './decisoesLigasRapidas.js';
import {prepararPartidasLigasRapidas} from './escalacoesLigasRapido.js';
import {regiaoDaLiga} from '../competicoes/regrasCopasRapidas.js';
import {simularClassificacoesMundoTecnico,simularLigaMundo,simularPlacarDeLiga} from '../treinador/classificacoesMundoTecnico.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {compactarJogos, jogosDaEdicao} from '../simulacao/mundoVivo.js';

function placaresRegistrados(edicao) {
  if (Array.isArray(edicao?.jogos)) return edicao.jogos;
  return jogosDaEdicao(edicao).map(({vencedor, penaltis, ...jogo}) => jogo);
}

export function criarCalendarioLigasRapido(equipes, codigo, ano, elencos = {}, tecnicos = {}) {
  return {
    ano, codigo, partilharCopas: true,
    seed: `${codigo}|${ano}|ligas-rapido`,
    equipes: equipes.map(({nome, liga, elenco, ataque, defesa}) => ({nome, liga, elenco, ataque, defesa})),
    ligas: {},
    elencos,
    tecnicos,
    periodos: Object.fromEntries([...new Set(equipes.map(x => x.liga))].map(liga =>
      [liga, regiaoDaLiga(liga) === 'europa' ? {inicio:-4, fim:5.8} : {inicio:1.5, fim:12.05}])),
  };
}

function simularLigas(estado, clubes, progresso, jogosAnteriores, disputarPartida, iniciarRodada) {
  return simularClassificacoesMundoTecnico({
    clubes, ano: estado.ano, progresso, jogosAnteriores, disputarPartida, iniciarRodada,
    rng: geradorTecnico(estado.seed),
    rngLigaRodada: (liga, rodada) => geradorTecnico(`${estado.seed}|${liga}|${rodada}`),
  });
}

const AJUSTES_ESTRATEGIA = {atacar: {ataque: 4, defesa: -3}, proteger: {ataque: -3, defesa: 4}};
function comEstrategia(time, estrategia) {
  const ajuste = AJUSTES_ESTRATEGIA[estrategia];
  if (!ajuste) return time;
  const forca = Number(time.elenco ?? time.forca ?? 50);
  return {...time, ataque: (time.ataque ?? forca) + ajuste.ataque, defesa: (time.defesa ?? forca) + ajuste.defesa};
}

/** Rodadas do clube na liga, na mesma ordem de confrontos do motor das ligas (sem simular placares). */
export function rodadasDoClube(estado, clube, liga) {
  const participantes = estado.equipes.filter(x => x.liga === liga).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const {jogos} = simularLigaMundo(participantes, () => .5, liga, {disputarPartida: () => ({golsCasa: 0, golsFora: 0})});
  const total = Math.max(0, 2 * (participantes.length + participantes.length % 2 - 1));
  const periodo = estado.periodos?.[liga] ?? {inicio: 1.5, fim: 12.05};
  // A rodada r entra no avanço quando o progresso da liga alcança r/total.
  const data = r => periodo.inicio + (r / total) * (periodo.fim - periodo.inicio);
  return jogos.filter(j => j.casa === clube || j.fora === clube)
    .map(j => ({rodada: j.rodada, data: data(j.rodada), casa: j.casa === clube, adversario: j.casa === clube ? j.fora : j.casa}));
}

export function avancarCalendarioLigasRapido(estado, data) {
  const ligas = {...estado.ligas};
  const memoria = Object.fromEntries(Object.entries(estado.memoria ?? {}).map(([id, dados]) => [id, {...dados}]));
  const {tecnicos, elencos, decisoes, iniciarRodada} = prepararDecisoesLigas(estado, memoria);
  const partidas = prepararPartidasLigasRapidas(elencos, estado.seed, {}, tecnicos, memoria);
  // Jogos do clube do atleta: a estratégia escolhida no calendário pesa no placar.
  const disputar = estado.usuario
    ? (casa, fora, rodada, formaCasa, formaFora, sorteio) => {
        if (casa.nome !== estado.usuario && fora.nome !== estado.usuario) return partidas.disputar(casa, fora, rodada, formaCasa, formaFora, sorteio);
        const ajustar = time => time.nome === estado.usuario ? comEstrategia(time, estado.estrategias?.[rodada]) : time;
        return simularPlacarDeLiga(ajustar(casa), ajustar(fora), formaCasa, formaFora, sorteio);
      }
    : partidas.disputar;
  const noticias = [];
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
    const simuladas = simularLigas(estado, clubes, progresso, jogosAnteriores, disputar, iniciarRodada);
    for (const [liga, edicao] of Object.entries(simuladas)) {
      const anterior = ligas[liga];
      const novos = edicao.jogos.slice(jogosAnteriores[liga].length);
      if (novos.length) {
        const eventos = (decisoes[liga] || []).filter(e => e.rodada >= novos[0].rodada);
        noticias.push(...eventos.map(e => ({liga, texto:e.texto, prioridade:e.tipo==='consequencia'?4:3})));
        const lider = edicao.classificacao[0];
        if (lider && anterior?.classificacao[0]?.jogos > 0 && lider.nome !== anterior.classificacao[0].nome) {
          noticias.push({liga, texto:`${lider.nome} assumiu a liderança com ${lider.pontos} pontos.`, prioridade:2});
        }
        const destaque = novos.reduce((a, b) => Math.abs(b.golsCasa - b.golsFora) >= Math.abs(a.golsCasa - a.golsFora) ? b : a);
        if (destaque.golsCasa === destaque.golsFora) {
          noticias.push({liga, texto:`${destaque.casa} e ${destaque.fora} empataram em ${destaque.golsCasa} a ${destaque.golsFora} na rodada ${destaque.rodada}.`, prioridade:1});
        } else {
          const vencedor = destaque.golsCasa > destaque.golsFora ? destaque.casa : destaque.fora;
          const linha = edicao.classificacao.find(t => t.nome === vencedor);
          if (linha) noticias.push({liga, texto:`${destaque.casa} ${destaque.golsCasa} × ${destaque.golsFora} ${destaque.fora}. ${vencedor} terminou o avanço em ${linha.posicao}º, com ${linha.pontos} pontos.`,
            prioridade:1 + Math.abs(destaque.golsCasa - destaque.golsFora) / 20});
        }
      }
      const jogos = edicao.origem === 'simulacao-global' ? compactarJogos(edicao.jogos) : edicao.jogos;
      ligas[liga] = {...edicao, progresso, jogos, ...(decisoes[liga]?.length?{decisoes:decisoes[liga]}:{})};
    }
  }
  return {...estado, ligas, memoria, elencos, tecnicos, decisoes,
    noticias: noticias.length ? noticias.sort((a,b) => b.prioridade - a.prioridade).slice(0,3) : estado.noticias ?? []};
}

export function finalizarCalendarioLigasRapido(estado) {
  const {ligas} = avancarCalendarioLigasRapido(estado, Infinity);
  return Object.fromEntries(Object.entries(ligas).map(([liga, {progresso, ...edicao}]) =>
    [liga, {...edicao, jogos: placaresRegistrados(edicao)}]));
}


export function prepararPartidasDeCopa(estado, data, competicao) {
  const memoria = structuredClone(estado.memoria ?? {});
  const equipes = new Map(estado.equipes.map(p => [p.nome, p]));
  const contagens = new Map();
  for (const {liga} of estado.equipes) contagens.set(liga, (contagens.get(liga) ?? 0) + 1);
  const rodadaDe = equipe => {
    const periodo = estado.periodos?.[equipe.liga];
    if (!periodo) return 0;
    const n = contagens.get(equipe.liga);
    const total = 2 * (n + n % 2 - 1);
    return (data - periodo.inicio) / (periodo.fim - periodo.inicio) * total;
  };
  const {jogar} = prepararPartidasLigasRapidas(estado.elencos, estado.seed, {}, estado.tecnicos, memoria);
  const partida = (a, b, simular) => {
    const casa = equipes.get(a.nome) ?? a, fora = equipes.get(b.nome) ?? b;
    const ajustar = (original, base, time) => ({...original, forca: original.forca +
      ((time.ataque ?? 0) + (time.defesa ?? 0) - (base.ataque ?? 0) - (base.defesa ?? 0)) / 2});
    return jogar(casa, fora, rodadaDe(casa), rodadaDe(fora),
      (x,y) => simular(ajustar(a,casa,x), ajustar(b,fora,y)), competicao);
  };
  return {memoria, partida};
}
