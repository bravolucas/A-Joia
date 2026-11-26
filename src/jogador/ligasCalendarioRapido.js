import {prepararDecisoesLigas} from './decisoesLigasRapidas.js';
import {prepararPartidasLigasRapidas} from './escalacoesLigasRapido.js';
import {regiaoDaLiga} from '../competicoes/regrasCopasRapidas.js';
import {simularClassificacoesMundoTecnico} from '../treinador/classificacoesMundoTecnico.js';
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

export function avancarCalendarioLigasRapido(estado, data) {
  const ligas = {...estado.ligas};
  const memoria = Object.fromEntries(Object.entries(estado.memoria ?? {}).map(([id, dados]) => [id, {...dados}]));
  const {tecnicos, elencos, decisoes, iniciarRodada} = prepararDecisoesLigas(estado, memoria);
  const {disputar} = prepararPartidasLigasRapidas(elencos, estado.seed, {}, tecnicos, memoria);
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
        noticias.push(...eventos.map(e => ({liga, texto:e.texto, prioridade:3})));
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
      ligas[liga] = {...edicao, progresso, jogos};
    }
  }
  return {...estado, ligas, memoria, elencos, tecnicos, decisoes,
    noticias: noticias.length ? noticias.sort((a,b) => b.prioridade - a.prioridade).slice(0,3) : estado.noticias ?? []};
}

export function finalizarCalendarioLigasRapido(estado) {
  const {ligas, decisoes} = avancarCalendarioLigasRapido(estado, Infinity);
  return Object.fromEntries(Object.entries(ligas).map(([liga, {progresso, ...edicao}]) =>
    [liga, {...edicao, jogos: placaresRegistrados(edicao), ...(decisoes[liga]?.length ? {decisoes:decisoes[liga]} : {})}]));
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
