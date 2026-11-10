import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {IDADE_MAXIMA_TECNICO,idadeTecnico,carreiraTecnicoEncerrada} from './longevidadeTecnico.js';
export {IDADE_MAXIMA_TECNICO,idadeTecnico,carreiraTecnicoEncerrada} from './longevidadeTecnico.js';
import {registrarAnoHistoria} from '../historia/historiaFutebol.js';
import {resumoCampanhaCopa} from './copasEscolha.js';
import {prepararCopasTecnico,aplicarCopaTecnico,estadualAutomaticoTecnico} from './copasCarreiraTecnico.js';
import {vagaTecnico,nomeVaga,calcularVagasRapidas,idContinental,classificacoesHistoricas} from '../competicoes/regrasCopasRapidas.js';
import { SELECOES_TECNICO, propostasSelecoesTecnico, simularAnoSelecaoTecnico, equipeTituloTecnico } from './selecoesTecnico.js';
import {legadoNarrativo} from '../jogador/jornadaJogador.js';
import {bonusForcaLoja,creditarSalarioTecnico,comprarItemLojaTecnico} from "./lojaTecnico.js";
import {aplicarPretemporadaRapida,planoPretemporadaRapida,renovarVerbaPretemporada} from './pretemporadaRapida.js';
import { vinculoAtivoTecnico, riscosIdolatriaTecnico, registrarRupturasTecnico } from './idolatriaTecnico.js';
import { FORMACOES_TECNICO, perfilTaticoTecnico, riscoEstiloTecnico } from './taticasTecnico.js';
import { CLUBES, CLASSICOS } from '../dados/data.js';
import { EVENTOS_CONTEXTO_TECNICO } from './eventosTecnico.js';
import { competicaoDoTitulo } from '../comum/tacas.js';
import { simularCopaNacionalTecnico, simularCopaContinentalTecnico, classificarVagasContinentalTecnico } from './competicoesTecnico.js';
import { atualizarLigasMundoTecnico, simularClassificacoesMundoTecnico } from './classificacoesMundoTecnico.js';
import { FINAIS_TECNICO, chanceFinalTecnico, finalDoUsuarioTecnico, aplicarResultadoFinalTecnico, paradasDoRitmoTecnico, OPCOES_PARADA_TECNICO,
  ANO_SEM_CLUBE_TECNICO, evoluirPersonagensTecnico, definirRivalTecnico, atualizarRivalTecnico,
  metasCarreiraTecnico, registrarMetasTecnico, geradorTecnico } from './momentosTecnico.js';
export { FINAIS_TECNICO, chanceFinalTecnico, OPCOES_PARADA_TECNICO, ANO_SEM_CLUBE_TECNICO } from './momentosTecnico.js';
// Continuação da mesma carreira, sem alterar o histórico do atleta.
export const ESTILOS_TECNICO = [
  { id: 'ofensivo', nome: 'Ofensivo', descricao: 'Mais gols e menos empates. Favorece equipes superiores, mas expõe as mais fracas.' },
  { id: 'equilibrado', nome: 'Equilibrado', descricao: 'Consistência ao longo da temporada.' },
  { id: 'defensivo', nome: 'Defensivo', descricao: 'Menos gols e mais empates. Ajuda a resistir a rivais superiores, mas reduz a vantagem contra os mais fracos.' },
];
const limitar = (n, min, max) => Math.max(min, Math.min(max, n));
const sorteio = () => Math.random();
export const DECISOES_TECNICO = [
  { id: 'reforcos', titulo: 'Mercado de transferências', texto: 'A diretoria quer saber sua prioridade.', opcoes: [
    { id: 'pedir', nome: 'Pedir reforços', detalhe: 'Elenco +8 · diretoria -6', elenco: 8, diretoria: -6 },
    { id: 'base', nome: 'Apostar na base', detalhe: 'Elenco +3 · diretoria +5', elenco: 3, diretoria: 5 },
    { id: 'manter', nome: 'Manter o grupo', detalhe: 'Moral +5 · diretoria +2', moral: 5, diretoria: 2 }
  ] },
  { id: 'vestiario', titulo: 'Clima no vestiário', texto: 'O elenco questiona a intensidade dos treinos.', opcoes: [
    { id: 'intenso', nome: 'Cobrar mais intensidade', detalhe: 'Elenco +5 · moral -6', elenco: 5, moral: -6 },
    { id: 'dialogo', nome: 'Conversar com o grupo', detalhe: 'Moral +8 · diretoria +2', moral: 8, diretoria: 2 },
    { id: 'descanso', nome: 'Reduzir a carga', detalhe: 'Moral +5 · elenco -2', moral: 5, elenco: -2 }
  ] },
  { id: 'craque', titulo: 'O craque quer privilégios', texto: 'O principal jogador ameaça pedir transferência.', opcoes: [
    { id: 'apoiar', nome: 'Dar liberdade ao craque', detalhe: 'Moral +7 · diretoria -5', moral: 7, diretoria: -5 },
    { id: 'cobrar', nome: 'Exigir disciplina', detalhe: 'Diretoria +5 · moral -7', diretoria: 5, moral: -7 },
    { id: 'negociar', nome: 'Conversar reservadamente', detalhe: 'Resultado incerto', moral: 3, risco: 0.45, riscoMoral: -8, riscoDiretoria: -4 }
  ] },
  { id: 'classico', titulo: 'Semana de clássico', texto: 'A imprensa exige uma vitória contra o rival.', opcoes: [
    { id: 'atacar', nome: 'Prometer vitória', detalhe: 'Moral +5 · pressão maior', moral: 5, risco: 0.5, riscoDiretoria: -9 },
    { id: 'prudente', nome: 'Diminuir expectativas', detalhe: 'Diretoria +3 · moral -2', diretoria: 3, moral: -2 },
    { id: 'foco', nome: 'Blindar o elenco', detalhe: 'Elenco +3 · moral +2', elenco: 3, moral: 2 }
  ] },
  { id: 'lesoes', titulo: 'Departamento médico em alerta', texto: 'Os jogadores reclamam de desgaste.', opcoes: [
    { id: 'rodizio', nome: 'Rodar o elenco', detalhe: 'Moral +5 · elenco -3', moral: 5, elenco: -3 },
    { id: 'arriscar', nome: 'Manter os titulares', detalhe: 'Elenco +5 · risco de queda de moral', elenco: 5, risco: 0.55, riscoMoral: -9 },
    { id: 'preparacao', nome: 'Reforçar preparação física', detalhe: 'Elenco +3 · diretoria -3', elenco: 3, diretoria: -3 }
  ] },
  { id: 'diretoria', titulo: 'Ultimato da diretoria', texto: 'Os dirigentes cobram uma resposta à pressão.', opcoes: [
    { id: 'ambicioso', nome: 'Prometer classificação', detalhe: 'Diretoria +7 · risco de cobrança', diretoria: 7, risco: 0.5, riscoDiretoria: -12 },
    { id: 'realista', nome: 'Defender o projeto', detalhe: 'Diretoria +2 · moral +2', diretoria: 2, moral: 2 },
    { id: 'confrontar', nome: 'Exigir apoio público', detalhe: 'Moral +6 · diretoria -8', moral: 6, diretoria: -8 }
  ] },
  { id: 'jovem', titulo: 'Uma promessa pede espaço', texto: 'Um jovem da base impressiona nos treinos.', opcoes: [
    { id: 'titular', nome: 'Promover a titular', detalhe: 'Elenco +5 · risco de pressão', elenco: 5, risco: 0.4, riscoMoral: -5 },
    { id: 'gradual', nome: 'Integrar aos poucos', detalhe: 'Elenco +2 · moral +3', elenco: 2, moral: 3 },
    { id: 'emprestar', nome: 'Emprestar para evoluir', detalhe: 'Diretoria +4 · elenco -2', diretoria: 4, elenco: -2 }
  ] }
];
export const QUANTIDADE_DECISOES_TECNICO = 4;
const idadeAtualTecnico=c=>Number.isFinite(c?.idade)?c.idade:idadeTecnico(c?.tecnico);
export function aposentarTecnico(c){
 if(!c?.tecnico||c.tecnico.aposentado)return c;
 const novo=structuredClone(c),t=novo.tecnico;
 const pendencias={andamento:t.andamento||t.temporadaPausada||null,copas:t.copasEmJogo||null,finais:t.finaisPendentes||[]};
 novo.tecnico={...t,idade:idadeAtualTecnico(c),aposentado:true,fase:'aposentado',aposentadoria:{idade:idadeAtualTecnico(c),ano:t.ano,motivo:'voluntaria',pendencias},copasEmJogo:null,finaisPendentes:[],andamento:null,temporadaPausada:null,paradaPendente:null,intervencaoPendente:null,conviteSelecao:null,propostas:[]};
 return registrarHistoriaTecnico(novo);
}
/** Rescisão voluntária: preserva o que foi jogado e não resolve partidas pendentes. */
export function pedirDemissaoTecnico(c,rng){
 const atual=c?.tecnico;
 if(!atual)throw new Error('Carreira de treinador não iniciada.');
 if(carreiraTecnicoEncerrada(atual,idadeAtualTecnico(c)))throw new Error('A carreira de treinador já foi encerrada.');
 if(atual.desempregado&&atual.ultimaSaida?.motivo==='pedido-demissao')return c;
 if(!atual.clube||atual.demitido||atual.desempregado||(!atual.clubeInicialEscolhido&&atual.opcoesInicio?.length))throw new Error('Você precisa estar empregado para pedir demissão.');
 const novo=registrarHistoriaTecnico(structuredClone(c)),t=novo.tecnico,clube=t.clube;
 const andamento=t.andamento||t.temporadaPausada,confrontos=andamento?.confrontos||[];
 const quantidade=(campo,resultado)=>Number.isFinite(andamento?.[campo])?andamento[campo]:confrontos.filter(j=>j.resultado===resultado).length;
 const vitorias=quantidade('vitorias','V'),empates=quantidade('empates','E'),derrotas=quantidade('derrotas','D'),jogos=vitorias+empates+derrotas;
 const parcial=jogos>0&&['pretemporada','parada'].includes(t.fase);
 const saida={motivo:'pedido-demissao',clube,tipoEquipe:t.tipoEquipe||'clube',ano:t.ano,idade:idadeAtualTecnico(c),jogos:parcial?jogos:0,pendencias:{andamento:parcial?{jogos,rodadas:andamento.rodadas??andamento.indice??null}:null,copas:(t.copasEmJogo?.campeonatos||[]).map(x=>({nome:x.nome,fase:x.faseUsuario||null})),finais:(t.finaisPendentes||[]).map(x=>({nome:x.nome,adversario:x.adversario||null}))}};
 if(parcial){
  const minha=andamento.classificacao?.find(x=>x.meuClube);
  const registro={ano:t.ano,clube,liga:t.liga,tipoEquipe:t.tipoEquipe||'clube',jogos,vitorias,empates,derrotas,pontos:3*vitorias+empates,posicao:minha?.posicao??null,objetivo:objetivoTecnico(t).nome,interrompida:true,pediuDemissao:true,confrontos,classificacao:andamento.classificacao||[],titulosConquistados:[],torneios:[]};
  t.temporadas=[...(t.temporadas||[]),registro];t.vitorias=(t.vitorias||0)+vitorias;t.empates=(t.empates||0)+empates;t.derrotas=(t.derrotas||0)+derrotas;
  const total=andamento.calendario?.filter(x=>!x.folga).length||38;
  t.carteiraTecnico=creditarSalarioTecnico(t,t.ano,t.salario??salarioTecnico(t),Math.min(12,Math.ceil(jogos/total*12)));
  // O ciclo incompleto segue a mesma passagem anual de uma saída forçada no meio da temporada.
  novo.idade=idadeAtualTecnico(c)+1;novo.ano=c.ano+1;t.idade=novo.idade;t.ano++;
 }
 novo.tecnico={...t,clube:null,clubeReferencia:clube,tipoEquipe:null,selecao:null,classificacaoSelecao:null,pais:null,liga:null,salario:0,desempregado:true,demitido:false,clubeInicialEscolhido:true,fase:'resultado',anosDesempregado:0,ultimaSaida:saida,saidasVoluntarias:[...(t.saidasVoluntarias||[]),saida],andamento:null,temporadaPausada:null,paradaPendente:null,intervencaoPendente:null,reuniaoPendente:false,copasEmJogo:null,finaisPendentes:[],conviteSelecao:null,ultimaFinal:null,ultimaNegociacao:null,promessaContrato:null,contratoCurto:null,participantesLiga:null,personagens:[],noticiasElenco:[],rivalTecnico:null,retornoIdolo:false,decisoes:[],cartas:[],efeitosPendentes:[],efeitosRecebidos:[],ajusteTurno:null,planoRapido:null,propostas:[],propostasCoerentesVersao:3};
 if(t.modoTreinadorRapido)novo.tecnico.verbaRapida=undefined;
 novo.tecnico.propostas=gerarPropostasTecnico(novo.tecnico,rng||geradorTecnico(`${saida.ano}|${clube}|pedido-demissao|${novo.tecnico.saidasVoluntarias.length}`)).filter(p=>p.nome!==clube);
 return novo;
}
function registrarHistoriaTecnico(c){
 const t=c?.tecnico,a=t?.temporadas?.at(-1);if(!a||t.fase!=='resultado'||t.tipoEquipe==='selecao'||t.copasEmJogo||t.finaisPendentes?.length)return c;
 const novo={...c};registrarAnoHistoria(novo,{...a});return novo;
}
const NOMES_COMPETICOES_TECNICO = { brasileirao: 'Brasileirão', serieB: 'Brasileirão Série B', argentina: 'Liga Profesional', portugal: 'Liga Portugal', portugal2: 'Liga Portugal 2', espanha: 'La Liga', espanha2: 'LaLiga 2', inglaterra: 'Premier League', inglaterra2: 'Championship', italia: 'Serie A', italia2: 'Serie B (Itália)', alemanha: 'Bundesliga', alemanha2: '2. Bundesliga', franca: 'Ligue 1', franca2: 'Ligue 2', arabia: 'Saudi Pro League', holanda: 'Eredivisie', mls: 'MLS', turquia: 'Süper Lig', sulamericano: 'Campeonato Sul-Americano' };
export function competicaoTemporadaTecnico(a = {}) {
  if (a.competicao) return a.competicao;
  if (a.liga?.startsWith('selecao:')) return `Calendário internacional · ${a.liga.split(':')[1]}`;
  const liga = a.liga || CLUBES.find(clube => clube.nome === a.clube)?.liga;
  return NOMES_COMPETICOES_TECNICO[liga] || (liga ? String(liga) : 'Campeonato nacional');
}
export const titulosConquistadosTecnico = (t) => (t?.temporadas || []).flatMap(a => (Array.isArray(a.titulosConquistados) && a.titulosConquistados.length ? a.titulosConquistados : (a.campeao ? [competicaoTemporadaTecnico(a)] : [])).map(nome => ({ ano: a.ano, clube: equipeTituloTecnico(a, nome), nome, tipo: competicaoDoTitulo(nome).tipo })));
export const TODAS_CARTAS_TECNICO = [...DECISOES_TECNICO, ...EVENTOS_CONTEXTO_TECNICO];
export function elegivelTecnico(carta, t) {
  switch (carta.contexto) {
    case 'inicio': return (t.temporadas?.length || 0) <= 2;
    case 'crise': return (t.diretoria ?? 60) < 52 || (t.moral ?? 50) < 40 || (t.temporadas?.at(-1)?.posicao ?? 1) >= 15;
    case 'lider': return (t.temporadas?.at(-1)?.posicao ?? 20) <= 4 || (t.titulos || 0) >= 1;
    case 'prestigio': return (t.reputacao ?? 25) >= 65 || (t.titulos || 0) >= 2;
    case 'experiente': return (t.temporadas?.length || 0) >= 4;
    default: return true;
  }
}
export function sortearCartasTecnico(t = {}, rng = sorteio) {
  // Compatibilidade com chamadas antigas que passavam somente o gerador aleatório.
  if (typeof t === 'function') { rng = t; t = {}; }
  const recentes = new Set((t.historicoCartas || []).slice(-16));
  const candidatas = TODAS_CARTAS_TECNICO.filter(x => elegivelTecnico(x, t));
  const novas = candidatas.filter(x => !recentes.has(x.id));
  const pool = novas.length >= QUANTIDADE_DECISOES_TECNICO ? novas : candidatas;
  const cartas = [...pool];
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }
  return cartas.slice(0, QUANTIDADE_DECISOES_TECNICO).map(x => x.id);
}
export function cartaAtualTecnico(t) {
  const ids = t.cartas || DECISOES_TECNICO.slice(0, QUANTIDADE_DECISOES_TECNICO).map(x => x.id);
  return TODAS_CARTAS_TECNICO.find(x => x.id === ids[t.decisoes?.length || 0]) || null;
}
export function tomarDecisaoTecnico(c, opcaoId, rng = sorteio) {
  if (!c?.tecnico || c.tecnico.fase !== 'pretemporada') throw new Error('Decisão indisponível.');
  const t = c.tecnico;
  if(carreiraTecnicoEncerrada(t,idadeAtualTecnico(c)))throw new Error('Carreira de treinador encerrada.');
  const carta = cartaAtualTecnico(t);
  if (!carta) throw new Error('Todas as decisões já foram tomadas.');
  const op = carta.opcoes.find(x => x.id === opcaoId);
  if (!op) throw new Error('Opção inválida.');
  const riscoAtivado = !!op.risco && rng() < op.risco;
  const resultado = riscoAtivado ? 'A aposta trouxe consequências inesperadas.' : 'O plano foi recebido como esperado.';
  const impacto = { elenco: (op.elenco || 0), torcida: (op.moral || 0) + (riscoAtivado ? (op.riscoMoral || 0) : 0), moral: (op.moral || 0) + (riscoAtivado ? op.riscoMoral || 0 : 0), diretoria: (op.diretoria || 0) + (riscoAtivado ? op.riscoDiretoria || 0 : 0) };
  // Uma fração do impacto permanece no início do próximo ano, para decisões acumulativas.
  const heranca = Object.fromEntries(Object.entries(impacto).map(([k, v]) => [k, Math.trunc(v * 0.4)]));
  return { ...c, tecnico: {
    ...t, elenco: limitar((t.elenco ?? 50) + (op.elenco || 0), 10, 99),
    moral: limitar((t.moral ?? 50) + (op.moral || 0) + (riscoAtivado ? op.riscoMoral || 0 : 0), 10, 95),
    diretoria: limitar((t.diretoria ?? 60) + (op.diretoria || 0) + (riscoAtivado ? op.riscoDiretoria || 0 : 0), 0, 100),
    torcida: limitar((t.torcida ?? 55) + Math.round(impacto.torcida * 0.5), 0, 100),
    efeitosPendentes: [...(t.efeitosPendentes || []), { carta: carta.id, opcao: op.id, heranca, aplicarEm: t.ano + 1 }],
    decisoes: [...(t.decisoes || []), { carta: carta.id, opcao: op.id, nome: op.nome, resultado, riscoAtivado }]
  }};
}
export function calcularOvrTecnico(t) {
  // OVR é habilidade profissional; aprovação e confiança são avaliações locais.
  const temporadas = t.temporadas || [];
  const experiencia = Math.min(12, temporadas.length * 2);
  const titulos = Math.min(12, (t.titulos || 0) * 4);
  const aproveitamento = (t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0) > 0
    ? (3 * (t.vitorias || 0) + (t.empates || 0)) / (3 * ((t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0))) : 0.45;
  const desempenho = Math.round((aproveitamento - 0.45) * 22);
  return limitar(Math.round(30 + (t.reputacao || 25) * 0.36 + experiencia + titulos + desempenho + Math.min(5,t.formacaoLoja||0)), 25, 99);
}
const contarTitulosTemporadaTecnico = temporada => Array.isArray(temporada?.titulosConquistados) && temporada.titulosConquistados.length
  ? temporada.titulosConquistados.length
  : temporada?.campeao ? 1 : 0;

export function historicoProfissionalTecnico(t = {}) {
  const temporadas = t.temporadas || [];
  const clubes = [];
  for (const temporada of temporadas) {
    const clube = temporada.clube || 'Sem clube';
    let registro = clubes.find(x => x.nome === clube);
    if (!registro) {
      registro = { nome: clube, temporadas: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, titulos: 0, demissoes: 0, melhorPosicao: null, anos: [] };
      clubes.push(registro);
    }
    registro.temporadas++;
    registro.jogos += (temporada.vitorias || 0) + (temporada.empates || 0) + (temporada.derrotas || 0);
    registro.vitorias += temporada.vitorias || 0;
    registro.empates += temporada.empates || 0;
    registro.derrotas += temporada.derrotas || 0;
    registro.titulos += titulosConquistadosTecnico({temporadas:[temporada]}).filter(x=>x.clube===clube).length;
    for(const titulo of titulosConquistadosTecnico({temporadas:[temporada]}).filter(x=>x.clube!==clube)){
      let n=clubes.find(x=>x.nome===titulo.clube);
      if(!n){n={nome:titulo.clube,temporadas:0,jogos:0,vitorias:0,empates:0,derrotas:0,titulos:0,demissoes:0,melhorPosicao:null,anos:[]};clubes.push(n);}
      n.titulos++;if(!n.anos.includes(temporada.ano))n.anos.push(temporada.ano);
    }
    registro.demissoes += !temporada.pediuDemissao&&(temporada.interrompida||temporada.demitido)?1:0;
    if (Number.isFinite(temporada.posicao)) registro.melhorPosicao = registro.melhorPosicao === null ? temporada.posicao : Math.min(registro.melhorPosicao, temporada.posicao);
    registro.anos.push(temporada.ano);
  }
  const jogos = temporadas.reduce((n, x) => n + (x.vitorias || 0) + (x.empates || 0) + (x.derrotas || 0), 0);
  const vitorias = temporadas.reduce((n, x) => n + (x.vitorias || 0), 0);
  const empates = temporadas.reduce((n, x) => n + (x.empates || 0), 0);
  const derrotas = temporadas.reduce((n, x) => n + (x.derrotas || 0), 0);
  return { clubes, temporadas: temporadas.length, jogos, vitorias, empates, derrotas,
    aproveitamento: jogos ? Math.round((vitorias * 3 + empates) / (jogos * 3) * 100) : 0,
    titulos: temporadas.reduce((total, temporada) => total + contarTitulosTemporadaTecnico(temporada), 0),
    demissoes: temporadas.filter(x => !x.pediuDemissao&&(x.interrompida||x.demitido)).length,
    reunioes: (t.reunioes || []).length };
}
export function painelEstabilidadeTecnico(t = {}) {
  const objetivo = objetivoTecnico(t);
  const perfil = perfilClubeTecnico(t);
  const pressao = riscoDemissaoTecnico(t);
  const promessa = t.promessaContrato?.clube === t.clube ? t.promessaContrato : null;
  const ult = (t.temporadas || []).at(-1);
  return {
    objetivo: objetivo.nome,
    perfil: perfil.perfil, expectativa: perfil.expectativa,
    posicaoMeta: objetivo.posicao,
    promessa: promessa ? { posicaoMaxima: promessa.posicaoMaxima, descricao: 'Terminar entre os 4 primeiros' } : null,
    torcida: limitar(t.torcida ?? 55, 0, 100),
    diretoria: limitar(t.diretoria ?? 60, 0, 100),
    pressao: pressao.pressao,
    situacao: t.demitido ? 'Demitido' : t.desempregado ? 'Sem clube' : pressao.situacao,
    ultimaTemporada: ult ? { posicao: ult.posicao, cumpriuObjetivo: !!ult.cumpriuObjetivo, promessaDescumprida: !!ult.promessaDescumprida } : null
  };
}
export function riscoDemissaoTecnico(t) {
  const torcida = t.torcida ?? 55;
  const diretoria = t.diretoria ?? 60;
  const pressao = limitar(Math.round((100 - diretoria) * 0.58 + (100 - torcida) * 0.42), 0, 100);
  return { pressao, situacao: pressao >= 75 ? 'Crítica' : pressao >= 55 ? 'Instável' : pressao >= 35 ? 'Em observação' : 'Segura' };
}
export const OBJETIVOS_TECNICO = [
  { id: 'campeao', nome: 'Ser campeão', posicao: 1 },
  { id: 'titulo', nome: 'Disputar o título', posicao: 2 },
  { id: 'continental', nome: 'Conquistar vaga continental', posicao: 6 },
  { id: 'meio', nome: 'Terminar na metade de cima', posicao: 10 },
  { id: 'permanencia', nome: 'Evitar rebaixamento', posicao: 16 }
];
export function perfilClubeTecnico(t = {}) {
  const cadastro = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const forca = cadastro?.elenco ?? t.elenco ?? 50;
  const liga = t.liga || t.ligasMundo?.[t.clube] || cadastro?.liga || null;
  const segundaDivisao = !!liga && /(?:2|serieB)$/i.test(liga);
  const perfil = forca >= 82 ? 'elite' : forca >= 69 ? 'competitivo' : forca >= 57 ? 'intermediario' : 'reconstrucao';
  const expectativa = perfil === 'elite' ? 'Cobrança por títulos e desempenho imediato' :
    perfil === 'competitivo' ? 'Buscar as primeiras posições' :
    perfil === 'intermediario' ? 'Consolidar campanha competitiva' : 'Construir elenco e evitar crise';
  return { perfil, forca, liga, segundaDivisao, expectativa };
}
/** Posição do clube na liga pela força-base do elenco (1 = mais forte). */
export function rankingForcaLigaTecnico(t = {}) {
  const perfil = perfilClubeTecnico(t);
  if (!perfil.liga) return { rank: null, total: 1, forcas: [] };
  const rivais = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (t.ligasMundo?.[x.nome] || x.liga) === perfil.liga).map(x => x.elenco);
  return { rank: rivais.filter(f => f > perfil.forca).length + 1, total: rivais.length + 1, forcas: rivais };
}
export function objetivoTecnico(t) {
  if(t.tipoEquipe==='selecao') return {id:'selecao',nome:t.ano%4===2?'Avançar na Copa do Mundo':'Conquistar uma vaga na Copa',posicao:2};
  const perfil = perfilClubeTecnico(t);
  let i = perfil.perfil === 'elite' ? 1 : perfil.perfil === 'competitivo' ? 2 : perfil.perfil === 'intermediario' ? 3 : 4;
  // Com a liga conhecida, a meta segue o tamanho do elenco entre os rivais (a mesma régua da previsão).
  const { rank, total } = rankingForcaLigaTecnico(t);
  if (rank) i = rank === 1 && perfil.perfil === 'elite' ? 0 : rank <= 3 ? 1 : rank <= Math.ceil(total * 0.3) ? 2 : rank <= Math.ceil(total * 0.65) ? 3 : 4;
  // Estreia como treinador: a diretoria dá tempo ao novato, mesmo num clube grande.
  if (!(t.temporadas?.length) && i < 2) i = 2;
  return OBJETIVOS_TECNICO[i];
}
/** Previsão para a temporada: força atual comparada às forças-base dos rivais da liga. */
export function previsaoTemporadaTecnico(t = {}) {
  if(t.tipoEquipe==='selecao'){const forca=Math.round(forcaClubeTecnico(t));return {forca,media:75,total:SELECOES_TECNICO.length,rank:SELECOES_TECNICO.filter(n=>n.elenco>forca).length+1,rotulo:forca>=85?'Seleção candidata a títulos':forca>=73?'Projeto internacional competitivo':'Construir uma geração',tom:forca>=85?'alto':forca>=73?'medio':'baixo'};}
  const { forcas } = rankingForcaLigaTecnico(t);
  const forca = Math.round(forcaClubeTecnico(t));
  const total = forcas.length + 1, rank = forcas.filter(f => f > forca).length + 1;
  const media = forcas.length ? Math.round(forcas.reduce((n, f) => n + f, 0) / forcas.length) : forca;
  const rotulo = rank === 1 ? 'Favorito ao título' : rank <= 3 ? 'Candidato ao título' : rank <= Math.ceil(total * 0.3) ? 'Briga por vaga continental'
    : rank <= Math.ceil(total * 0.65) ? 'Meio de tabela' : 'Luta contra o rebaixamento';
  return { rank, total, forca, media, rotulo, tom: rank <= 3 ? 'alto' : rank <= Math.ceil(total * 0.65) ? 'medio' : 'baixo' };
}
export function vinculosComoJogador(c) {
  const porClube = new Map();
  for (const temporada of c?.temporadas || []) {
    if (!temporada?.clube) continue;
    const anterior = porClube.get(temporada.clube) || { clube: temporada.clube, temporadas: 0, jogos: 0, titulos: 0, nota: 0 };
    anterior.temporadas++;
    anterior.jogos += temporada.jogos || 0;
    anterior.titulos += (temporada.titulos || []).length;
    anterior.nota += temporada.nota || 0;
    porClube.set(temporada.clube, anterior);
  }
  return [...porClube.values()].map(v => {
    const torcida = c?.torcida?.[v.clube] ?? 0;
    const idolatria = torcida >= 75 || (v.temporadas >= 5 && v.titulos >= 2);
    const afinidade = limitar(Math.round(v.temporadas * 8 + v.titulos * 7 + torcida * 0.35 + (idolatria ? 20 : 0)), 0, 100);
    return { ...v, torcida, idolatria, afinidade };
  }).sort((a,b) => b.afinidade - a.afinidade);
}
export function opcoesInicioTecnico(c) {
  const vinculos = vinculosComoJogador(c);
  const reputacao = limitar(Math.round(25 + (c.legado?.pontos || 0) / 22), 25, 85);
  const teto = calcularOvrTecnico({ reputacao }) + 18;
  const elegiveis = vinculos.filter(v => v.torcida >= 90 && v.temporadas >= 4 && v.titulos >= 2).slice(0, 2);
  const opcoes = elegiveis.map(v => {
    const dados = CLUBES_CONVITES_TECNICO.find(x => x.nome === v.clube);
    // Clube grande dá ao ídolo novato só um contrato de um ano: a meta precisa vir.
    return { ...v, pais:dados?.pais, liga:dados?.liga, elenco:dados?.elenco, salario:dados?.salario, contratoCurto: (dados?.elenco ?? 0) >= CONTRATO_CURTO_ELENCO, motivo: v.idolatria ? 'Ídolo do clube' : 'Ex-jogador com vínculo forte' };
  });
  const pais = CLUBES_CONVITES_TECNICO.find(x => x.nome === c.clubeNome)?.pais || 'Brasil';
  const candidatos = CLUBES_CONVITES_TECNICO.filter(x => x.elenco <= teto && x.exigencia <= reputacao + 8 && !opcoes.some(o => o.clube === x.nome));
  const rng = geradorTecnico(`${c.nome}|${c.ano}|inicio-tecnico`);
  const ordem = candidatos.map(x => ({...x, ordem: rng() + (x.pais === pais ? 1 : 0)})).sort((a,b) => b.ordem-a.ordem);
  for (const x of ordem) {
    if (opcoes.length >= 3) break;
    opcoes.push({clube:x.nome,pais:x.pais,liga:x.liga,elenco:x.elenco,salario:x.salario,afinidade:0,menor:true,motivo:'Projeto compatível com seu nível'});
  }
  return opcoes;
}
export const CONTRATO_CURTO_ELENCO = 80;
/** O que a carreira de jogador deixa para o banco: o rival de geração vira técnico rival e um ex-parceiro vira auxiliar. */
export function memoriaJogadorTecnico(c) {
  const duplas = (c?.jornada?.duplas || []).filter(d => d?.nome).sort((a, b) => (b.conexao || 0) - (a.conexao || 0) || (b.temporadas || 0) - (a.temporadas || 0));
  const parceiro = duplas[0];
  const mentor = c?.jornada?.mentor;
  const auxiliar = parceiro ? { nome: parceiro.nome, clube: parceiro.clube, origem: 'dupla' } : mentor?.nome ? { nome: mentor.nome, clube: mentor.clube || mentor.clubeAtual || null, origem: 'mentor' } : null;
  return { rival: c?.rival?.nome ? { nome: c.rival.nome } : null, auxiliar };
}
export function iniciarNoClubeIdolo(c, clube) {
  if (!c?.tecnico || c.tecnico.temporadas.length || c.tecnico.fase !== 'pretemporada') throw new Error('Escolha disponível somente no início da carreira.');
  const opcao = (c.tecnico.opcoesInicio || []).find(x => x.clube === clube);
  if (!opcao) throw new Error('Clube sem vínculo suficiente.');
  const dadosClube = CLUBES_CONVITES_TECNICO.find(x => x.nome === clube);
  const idoloMaximo=vinculosComoJogador(c).some(v=>v.clube===clube&&v.torcida>=90&&v.temporadas>=4&&v.titulos>=2);
  const nivelCompativel=dadosClube&&dadosClube.elenco<=calcularOvrTecnico(c.tecnico)+18&&dadosClube.exigencia<=c.tecnico.reputacao+8;
  if(!idoloMaximo&&!nivelCompativel) throw new Error('Clube incompatível com seu nível e sua história.');
  return { ...c, tecnico: { ...c.tecnico, clube, pais: dadosClube?.pais || c.tecnico.pais, liga: dadosClube?.liga || c.tecnico.liga, elenco: dadosClube?.elenco || c.tecnico.elenco, salario: dadosClube?.salario || c.tecnico.salario, torcida: limitar(55 + Math.round(opcao.afinidade * 0.35), 0, 100),
    diretoria: limitar(60 + Math.round(opcao.afinidade * 0.15), 0, 100), clubeInicialEscolhido: true, retornoIdolo: !!opcao.idolatria,
    contratoCurto: opcao.contratoCurto ? { clube, ano: c.tecnico.ano } : null } };
}
const PAIS_LIGA_TECNICO = { brasileirao: 'Brasil', serieB: 'Brasil', argentina: 'Argentina', portugal: 'Portugal', portugal2: 'Portugal', espanha: 'Espanha', espanha2: 'Espanha', inglaterra: 'Inglaterra', inglaterra2: 'Inglaterra', italia: 'Itália', italia2: 'Itália', alemanha: 'Alemanha', alemanha2: 'Alemanha', franca: 'França', franca2: 'França', arabia: 'Arábia Saudita', holanda: 'Países Baixos', mls: 'Estados Unidos', turquia: 'Turquia', sulamericano: 'América do Sul' };
export const CLUBES_CONVITES_TECNICO = CLUBES.map(x => ({
  nome: x.nome, pais: PAIS_LIGA_TECNICO[x.liga] || x.liga, liga: x.liga,
  exigencia: limitar(Math.round(25 + (x.forca - 45) * 1.12), 25, 94),
  elenco: x.forca, salario: Math.max(5, Math.round(x.forca * x.forca / 85))
}));
/** Metas da carreira com o país de cada clube e o tipo de cada taça. */
export const metasDoTecnico = t => metasCarreiraTecnico(t, nome => CLUBES_CONVITES_TECNICO.find(x => x.nome === nome)?.pais, nome => competicaoDoTitulo(nome).tipo);
/** Legado completo: a carreira de jogador e a de treinador lado a lado, com uma régua única. */
export const NIVEIS_LEGADO_COMPLETO = [
  { min: 0, nome: 'Uma vida no futebol', icone: '⚽' },
  { min: 250, nome: 'Nome respeitado', icone: '🎖️' },
  { min: 550, nome: 'Referência dentro e fora do campo', icone: '⭐' },
  { min: 900, nome: 'Lenda em duas eras', icone: '🏆' },
  { min: 1400, nome: 'A Joia eterna', icone: '💎' },
];
export function legadoCompletoTecnico(c) {
  const t = c?.tecnico || {};
  const temporadasJ = c?.temporadas || [];
  const titulosJ = (c?.lista || []).filter(x => !['bolaOuro', 'botaOuro'].includes(x.tipo)).length;
  const pontosJ = Math.round(c?.legado?.pontos ?? 0);
  const jogador = { temporadas: temporadasJ.length, gols: c?.totais?.gols ?? 0, assist: c?.totais?.assist ?? 0, titulos: titulosJ, bolaOuro: c?.titulos?.bolaOuro ?? 0,
    clubes: new Set(temporadasJ.map(x => x.clube).filter(Boolean)).size, pontos: pontosJ, nivel: c?.legado?.nivel?.nome || null };
  const temporadasT = t.temporadas || [];
  const titulosT = titulosConquistadosTecnico(t);
  const metas = metasDoTecnico(t);
  const pesoTitulo = nome => { const tipo = competicaoDoTitulo(nome).tipo; return tipo === 'copaMundo' ? 45 : tipo === 'continental' ? 18 : tipo === 'liga' ? 9 : 4; };
  const vitorias = temporadasT.reduce((n, a) => n + (a.vitorias || 0), 0);
  const pontosT = Math.round(titulosT.reduce((n, x) => n + pesoTitulo(x.nome || x), 0) + metas.filter(m => m.feito).length * 15 + vitorias * 0.2 + temporadasT.length * 2);
  const treinador = { temporadas: temporadasT.length, vitorias, titulos: titulosT.length, metas: metas.filter(m => m.feito).length, totalMetas: metas.length,
    clubes: new Set(temporadasT.map(x => x.clube).filter(Boolean)).size, pontos: pontosT };
  const total = pontosJ + pontosT;
  const nivel = [...NIVEIS_LEGADO_COMPLETO].reverse().find(n => total >= n.min);
  const proximo = NIVEIS_LEGADO_COMPLETO.find(n => n.min > total) || null;
  // Os mesmos clubes nas duas fases da vida contam a história de quem voltou para casa.
  const clubesDuasEras = [...new Set(temporadasJ.map(x => x.clube))].filter(n => temporadasT.some(a => a.clube === n));
  return { jogador, treinador, total, nivel, proximo, clubesDuasEras };
}
const comMetas = t => ({ ...t, metasConcluidas: registrarMetasTecnico(t, metasDoTecnico(t), t.temporadas?.at(-1)?.ano ?? t.ano) });
export function salarioTecnico(t) {
  const clube = [...CLUBES_CONVITES_TECNICO,...SELECOES_TECNICO].find(x => x.nome === t.clube);
  const base = clube?.salario ?? 12;
  return Math.round(base * (0.65 + limitar(t.reputacao ?? 40, 10, 99) / 140));
}
export function gerarPropostasTecnico(t, rng = sorteio) {
  const reputacao = limitar(t.reputacao ?? 40, 10, 99);
  const clubesPassados = new Set((t.temporadas || []).map(x => x.clube));
  const vinculosJogador = new Map((t.vinculosJogador || []).map(x => [x.clube, vinculoAtivoTecnico(t,x.clube)]));
  const clubesMundo = CLUBES_CONVITES_TECNICO.map(x => ({
    ...x,
    liga: x.nome === t.clube ? (t.liga || t.ligasMundo?.[x.nome] || x.liga) : (t.ligasMundo?.[x.nome] || x.liga),
  }));
  const clubeAtual = clubesMundo.find(x => x.nome === t.clube);
  const referencia=clubesMundo.find(c=>c.nome===(t.clube||t.clubeReferencia))||clubesMundo.find(c=>c.nome===t.temporadas?.at(-1)?.clube);
  const anterior=t.temporadas?.at(-1),boa=!!(anterior?.cumpriuObjetivo||anterior?.campeao||(Number.isFinite(anterior?.posicao)&&anterior.posicao<=4));
  // Quem acabou de ser campeão é visto acima da reputação acumulada e não recebe convites muito abaixo do seu nível.
  const campeaoAnt=!!(anterior?.campeao||(anterior?.titulosConquistados||[]).length);
  const repEfetiva=reputacao+(campeaoAnt?15:boa?6:0);
  const pisoNivel=t.clube&&!t.desempregado?(campeaoAnt?8:boa?14:99):99;
  const nivel=referencia?.elenco??t.elenco??50,pais=referencia?.pais||t.pais;
  const tetoNivel=nivel+(anterior?.campeao?14:boa?10:anterior?.posicao>=15?0:6)+(reputacao>=85&&(t.temporadas?.length||0)>=4?Math.min(20,5+(t.titulos||0)*2):0);
  const ovr=calcularOvrTecnico(t);
  const internacional=((t.temporadas?.length||0)>=2&&ovr>=55&&reputacao>=55&&boa)||((t.temporadas?.length||0)>=3&&ovr>=60&&reputacao>=65)||!!t.estagioExterior;
  const tetoOvr=ovr+18+(boa?6:0);
  const elegiveis = clubesMundo.filter(x => x.nome !== t.clube && (repEfetiva >= x.exigencia || (vinculosJogador.get(x.nome)?.idolatria && repEfetiva >= x.exigencia - 16)))
    .filter(x=>(x.elenco<=tetoOvr||vinculosJogador.get(x.nome)?.idolatria)&&(!referencia||x.elenco<=tetoNivel||vinculosJogador.get(x.nome)?.idolatria)&&(!pais||x.pais===pais||internacional||vinculosJogador.get(x.nome)?.idolatria))
    .filter(x=>!referencia||x.elenco>=nivel-pisoNivel||vinculosJogador.get(x.nome)?.idolatria)
    .map(x => {
      const mesmoPais = !!clubeAtual && x.pais === clubeAtual.pais;
      const retorno = clubesPassados.has(x.nome);
      const vinculo = vinculosJogador.get(x.nome);
      const rompido=(t.rupturasIdolo||[]).some(r=>r.clube===x.nome);
      const bonusIdolo = rompido?0:vinculo?.idolatria ? 0.32 : (vinculo?.temporadas || 0) >= 3 ? 0.17 : 0;
      const rival = (CLASSICOS || []).some(derby => {
        const nomes = Array.isArray(derby) ? derby : [derby.a, derby.b, derby.casa, derby.fora, derby.clube1, derby.clube2];
        return nomes.includes(x.nome) && nomes.includes(t.clube);
      });
      const chance = limitar(0.38 + (repEfetiva - x.exigencia) / 160 + (mesmoPais ? 0.15 : -0.06)
        + (retorno ? 0.12 : 0) + bonusIdolo - (rival ? 0.30 : 0) + ((t.temporadas || []).length >= 4 ? 0.08 : 0), 0.06, 0.90);
      const motivo=vinculo?.idolatria?'Retorno de ídolo':retorno?'Clube que conhece seu trabalho':x.elenco>nivel+3&&boa?'Interesse pela boa campanha':x.pais===pais&&x.elenco<nivel-4?'Projeto de reconstrução no seu país':x.pais===pais?'Projeto compatível no seu país':`Projeto internacional compatível com OVR ${ovr}${boa?' e sua boa campanha':''}`;
      const coerencia=(x.pais===pais?40:0)+(x.liga===(t.liga||referencia?.liga)?12:0)+Math.max(0,20-Math.abs(x.elenco-(nivel+(boa?4:0)))*1.2)+(vinculo?.idolatria?30:0)+(retorno?10:0)+(pais==='Brasil'&&x.pais==='Portugal'?10:0)-(rival?15:0);
      return { ...x, chance, rival, retorno, motivo,coerencia, objetivo: objetivoTecnico({ ...t, clube: x.nome, liga: x.liga, elenco: x.elenco }).nome };
    });
  const ligasRecentes=new Set((t.propostas||[]).map(p=>p.liga));
  const recentes = new Set([...(t.propostas||[]).map(p=>p.nome), ...(t.ofertasRecentes||[]).slice(-9)]);
  const selecionados=elegiveis.filter(x=>rng()<x.chance).map(x=>({...x,prioridade:Math.log(Math.max(1e-9,Math.min(.999999,rng())))/Math.max(.001,x.chance*(1+x.coerencia/80)*(recentes.has(x.nome)?.12:1)*(ligasRecentes.has(x.liga)?.75:1))})).sort((a,b)=>b.prioridade-a.prioridade||a.nome.localeCompare(b.nome,'pt-BR'));
  const ofertas=selecionados.slice(0,1);
  if(internacional){
    const exterior=selecionados.filter(x=>x.pais!==pais&&x.elenco>=Math.max(35,nivel-20));
    for(const x of exterior){if(ofertas.length>=3)break;if(!ofertas.some(p=>p.liga===x.liga||p.pais===x.pais))ofertas.push(x);}
  }
  for(const x of selecionados){if(ofertas.length>=3)break;if(!ofertas.some(p=>p.nome===x.nome)&&!ofertas.some(p=>p.liga===x.liga))ofertas.push(x);}
  for(const x of selecionados){if(ofertas.length>=3)break;if(!ofertas.some(p=>p.nome===x.nome))ofertas.push(x);}
  // O clube do coração lembra do ídolo: depois de um bom trabalho em outro lugar, o convite chega (no 2º ano e a cada três).
  const nTemp=(t.temporadas||[]).length;
  const idolo=boa&&nTemp>=2&&nTemp%3===2?elegiveis.find(x=>vinculosJogador.get(x.nome)?.idolatria&&!clubesPassados.has(x.nome)&&!(t.rupturasIdolo||[]).some(r=>r.clube===x.nome)):null;
  if(idolo){const i=ofertas.findIndex(p=>p.nome===idolo.nome);if(i>=0)ofertas.splice(i,1);if(ofertas.length>=3)ofertas.pop();ofertas.unshift({...idolo,motivo:'Convite do clube onde você é ídolo',conviteIdolo:true});}
  return [...ofertas.map(p=>({...p,tipo:'clube'})), ...propostasSelecoesTecnico(t, ovr, rng)];
}
export function atualizarPropostasCoerentesTecnico(c){
 const t=c?.tecnico;
 if(!t||t.propostasCoerentesVersao===3)return c;
 if(!t.temporadas?.length&&!t.clubeInicialEscolhido&&t.fase==='pretemporada'){
   const opcoesInicio=opcoesInicioTecnico(c), dados=CLUBES_CONVITES_TECNICO.find(x=>x.nome===opcoesInicio[0]?.clube);
   return {...c,tecnico:{...t,opcoesInicio,...(dados?{clube:dados.nome,pais:dados.pais,liga:dados.liga,elenco:dados.elenco,salario:dados.salario}:{}),propostasCoerentesVersao:3}};
 }
 if(t.fase!=='resultado')return c;
 let estado=[...(String(t.clube)+'|'+t.ano)].reduce((n,x)=>Math.imul(n^x.charCodeAt(0),16777619)>>>0,2166136261);
 const rng=()=>((estado=(Math.imul(estado,1664525)+1013904223)>>>0)/4294967296);
 return {...c,tecnico:{...t,propostasCoerentesVersao:3,conviteSelecao:null,propostas:gerarPropostasTecnico(t,rng)}};
}
export const ENTREVISTAS_TECNICO = [
  { id: 'prudente', nome: 'Aceitar o projeto', multiplicador: 1, bonusDiretoria: 8, bonusTorcida: 0, exigenciaExtra: 0, risco: 0 },
  { id: 'salario', nome: 'Negociar salário maior (+20%)', multiplicador: 1.2, bonusDiretoria: -5, bonusTorcida: 0, exigenciaExtra: 6, risco: 0.18 },
  { id: 'ambicioso', nome: 'Prometer grandes resultados (+10%)', multiplicador: 1.1, bonusDiretoria: 10, bonusTorcida: 6, exigenciaExtra: 2, risco: 0.12 }
];
export function negociarContratoTecnico(c, clube, estrategia = 'prudente', rng = sorteio) {
  if(c?.tecnico?.copasEmJogo)throw new Error('Conclua as copas antes de negociar.');
  c = concluirFinaisPendentesTecnico(c);
  const t = c?.tecnico;
  if (!t || (t.fase !== 'resultado' && !t.desempregado)) throw new Error('Negociação indisponível nesta fase.');
  const proposta = (t.propostas || []).find(p => p.nome === clube);
  const opcao = ENTREVISTAS_TECNICO.find(x => x.id === estrategia);
  if (!proposta || !opcao) throw new Error('Proposta ou estratégia inválida.');
  const reputacao = limitar(t.reputacao ?? 40, 10, 99);
  const risco = limitar(opcao.risco + Math.max(0, proposta.exigencia + opcao.exigenciaExtra - reputacao) / 100, 0, 0.9);
  if (rng() < risco) {
    return { ...c, tecnico: { ...t, propostas: t.propostas.filter(p => p.nome !== clube),
      ultimaNegociacao: { clube, estrategia, aceita: false, motivo: 'A diretoria recusou suas condições.' } } };
  }
  const contratado = aceitarPropostaTecnico(c, clube);
  const novo = contratado.tecnico;
  return { ...contratado, tecnico: { ...novo,
    salario: Math.round(proposta.salario * opcao.multiplicador),
    diretoria: limitar(novo.diretoria + opcao.bonusDiretoria, 0, 100),
    torcida: limitar(novo.torcida + opcao.bonusTorcida, 0, 100),
    promessaContrato: estrategia === 'ambicioso' ? { clube, posicaoMaxima: 4, temporada: t.ano } : null,
    ultimaNegociacao: { clube, estrategia, aceita: true } } };
}
export function aceitarPropostaTecnico(c, clube) {
  if(c?.tecnico?.copasEmJogo)throw new Error('Conclua as copas antes de trocar de trabalho.');
  c = concluirFinaisPendentesTecnico(c);
  const t = c.tecnico;
  if (!t || (t.fase !== 'resultado' && !t.desempregado)) throw new Error('Propostas só podem ser aceitas entre temporadas.');
  const proposta = (t.propostas || []).find(x => x.nome === clube);
  if (!proposta) throw new Error('Proposta indisponível.');
  const ruptura=riscosIdolatriaTecnico(t,proposta.nome).length>0;
  const nacional = proposta.tipo === 'selecao';
  return { ...c, tecnico: { ...t, ...(t.modoTreinadorRapido?{verbaRapida:undefined,planoRapido:null}:{}), rupturasIdolo:registrarRupturasTecnico(t,proposta.nome), clube: proposta.nome, tipoEquipe: nacional ? 'selecao' : 'clube', selecao: nacional ? proposta.nac : null, classificacaoSelecao: proposta.classificacaoSelecao || null, rivalTecnico: nacional || t.tipoEquipe==='selecao' ? null : t.rivalTecnico, conviteSelecao: null, personagens: nacional || t.tipoEquipe==='selecao' ? [] : t.personagens, participantesLiga: null, contratoCurto: null, clubeReferencia: nacional ? null : proposta.nome, pais: proposta.pais, liga: proposta.liga, elenco: proposta.elenco, ofertasRecentes: [...(t.ofertasRecentes||[]),...(t.propostas||[]).map(p=>p.nome)].slice(-18),
    moral: 50, diretoria: proposta.rival || ruptura ? 48 : 65, torcida: proposta.rival || ruptura ? 35 : 55,
    demitido: false, desempregado: false, ultimaSaida:null, anosDesempregado: 0, estagioExterior: false, promessaContrato: null, retornoIdolo: !!vinculoAtivoTecnico(t,proposta.nome)?.idolatria, propostas: [], salario: proposta.salario } };
}
export function passarAnoDesempregado(c, rng = sorteio, escolha = 'esperar') {
  if(c?.tecnico?.copasEmJogo)throw new Error('Conclua as copas antes de avançar.');
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Só é possível aguardar entre temporadas.');
  c = concluirFinaisPendentesTecnico(c);
  const t = c.tecnico;
  if(carreiraTecnicoEncerrada(t,idadeAtualTecnico(c)))throw new Error('Carreira de treinador encerrada.');
  if (!t.demitido && !t.desempregado) throw new Error('O treinador ainda tem contrato.');
  const op = ANO_SEM_CLUBE_TECNICO.find(x => x.id === escolha) || ANO_SEM_CLUBE_TECNICO.at(-1);
  const carteira = t.carteiraTecnico || { saldo: 0, pagamentos: [], compras: [] };
  const extras = op.id === 'curso' ? { formacaoLoja: Math.min(5, (t.formacaoLoja || 0) + 1), reputacao: limitar(t.reputacao - 1, 10, 99) }
    : op.id === 'comentarista' ? { reputacao: limitar(t.reputacao + 3, 10, 99), carteiraTecnico: { ...carteira, saldo: carteira.saldo + 480, pagamentos: [...carteira.pagamentos, { chave: `${t.ano}|TV`, ano: t.ano, clube: 'TV', valor: 480, meses: 12 }] } }
    : op.id === 'estagio' ? { reputacao: limitar(t.reputacao + 1, 10, 99), estagioExterior: true }
    : { reputacao: limitar(t.reputacao - 2, 10, 99) };
  const proximo = { ...t, idade:(idadeAtualTecnico(c))+1, ano: t.ano + 1, desempregado: true, demitido: false, clube: null,
    pais: null, salario: 0, propostas: [], ...extras, anoSabatico: [...(t.anoSabatico || []), { ano: t.ano, escolha: op.id, nome: op.nome }],
    anosDesempregado: (t.anosDesempregado || 0) + 1 };
  return { ...c, idade: idadeAtualTecnico(c) + 1, ano: c.ano + 1, tecnico: {
    ...proximo, propostasCoerentesVersao:3, propostas: gerarPropostasTecnico(proximo, rng)
  }};
}
export function iniciarCarreiraTecnico(c) {
  if (!c?.aposentado) throw new Error('O jogador precisa se aposentar primeiro.');
  if (c.tecnico) return c;
  const legado = c.legado?.pontos || 0;
  const reputacao = limitar(Math.round(25 + (Number.isFinite(legado) ? legado : 0) / 22), 25, 85);
  const vinculosJogador = vinculosComoJogador(c);
  const opcoesInicio = opcoesInicioTecnico(c);
  const clubeInicial = opcoesInicio[0]?.clube || CLUBES_CONVITES_TECNICO.slice().sort((a,b)=>a.elenco-b.elenco)[0].nome;
  const dadosClubeInicial = CLUBES_CONVITES_TECNICO.find(x => x.nome === clubeInicial);
  const afinidadeInicial = opcoesInicio[0]?.afinidade || 0;
  const memoriaJogador = memoriaJogadorTecnico(c);
  return { ...c, tecnico: {
    idadeInicio: c.idade, idade:c.idade, anoInicio:c.ano, ano: c.ano, vagasInicio:c.vagasInternacionaisClubes||null,vagasInicioAno:c.vagasInternacionaisAno||null, clube: clubeInicial, vinculosJogador, opcoesInicio, clubeInicialEscolhido: false, memoriaJogador,
    herancaJogador:{rotulos:legadoNarrativo(c),reputacaoInicial:reputacao,explicacao:'Seu legado de jogador orienta a reputação inicial. Afinidade pode abrir portas, mas o nível esportivo continua limitando os convites.'},
    reputacao, pais: dadosClubeInicial?.pais || 'Brasil', salario: dadosClubeInicial?.salario || 12, desempregado: false, anosDesempregado: 0, estilo: 'equilibrado', temporadas: [], vitorias: 0, empates: 0,
    derrotas: 0, titulos: 0, elenco: dadosClubeInicial?.elenco || 50, moral: memoriaJogador.auxiliar ? 53 : 50, diretoria: limitar(60 + Math.round(afinidadeInicial * 0.15), 0, 100), torcida: limitar(55 + Math.round(afinidadeInicial * 0.35), 0, 100), decisoes: [], demitido: false, propostas: [], historicoCartas: [], cartas: sortearCartasTecnico({ reputacao, temporadas: [], diretoria: 60, moral: 50 }), fase: 'pretemporada'
  }};
}
export function definirEstiloTecnico(c, estilo) {
  if (!ESTILOS_TECNICO.some(x => x.id === estilo)) throw new Error('Estilo inválido.');
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  validarMudancaTatica(c.tecnico);
  return { ...c, tecnico: { ...c.tecnico, estilo } };
}
function validarMudancaTatica(t){
 if(!t||t.fase!=='pretemporada'||t.demitido||t.desempregado||t.andamento?.jogos||t.andamento?.rodadas||carreiraTecnicoEncerrada(t))throw new Error('Altere a tática antes do início da temporada, enquanto estiver empregado.');
}
export function definirFormacaoTecnico(c,formacao){
 if(!FORMACOES_TECNICO.some(f=>f.id===formacao))throw new Error('Formação inválida.');
 validarMudancaTatica(c?.tecnico);
 return {...c,tecnico:{...c.tecnico,formacao}};
}
export function probabilidadesTecnico(t = {}) {
  const forca = limitar(forcaClubeTecnico(t), 10, 99);
  const moral = limitar(t.moral ?? 50, 10, 95);
  const reputacao = limitar(t.reputacao ?? 40, 10, 99);
  const bonusEstilo = t.estilo === 'equilibrado' ? 0.015 : t.estilo === 'ofensivo' ? 0.025 : -0.015;
  const vitoria = limitar(0.16 + (forca - 35) * 0.0075 + (moral - 50) * 0.0015 +
    (reputacao - 50) * 0.001 + bonusEstilo, 0.16, 0.69);
  const empate = t.estilo === 'defensivo' ? 0.29 : t.estilo === 'ofensivo' ? 0.18 : 0.24;
  return { vitoria, empate: Math.min(empate, 0.94 - vitoria), derrota: Math.max(0.06, 1 - vitoria - empate) };
}
export function forcaClubeTecnico(t = {}) {
  return limitar((t.elenco ?? CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.elenco ?? 50) + bonusForcaLoja(t) + (t.ajusteTurno?.forca || 0),10,99);
}
function classificacoesMundoDaTemporada(t, liga, classificacao, rng) {
  return simularClassificacoesMundoTecnico({
    clubes: CLUBES_CONVITES_TECNICO,
    ligasMundo: t.ligasMundo,
    ligaTreinador: liga,
    clubeTreinador: t.clube,
    forcaTreinador: forcaClubeTecnico(t),
    classificacaoTreinador: classificacao,
    rng,
  });
}
const DIVISOES_TECNICO = [
  { baixo: 'serieB', cima: 'brasileirao', vagas: 4 },
  { baixo: 'inglaterra2', cima: 'inglaterra', vagas: 3 },
  { baixo: 'espanha2', cima: 'espanha', vagas: 3 },
  { baixo: 'italia2', cima: 'italia', vagas: 3 },
  { baixo: 'alemanha2', cima: 'alemanha', vagas: 2 },
  { baixo: 'franca2', cima: 'franca', vagas: 2 },
  { baixo: 'portugal2', cima: 'portugal', vagas: 2 },
];
function atualizarLigasMundoDaTemporada(t, liga, classificacoesMundo) {
  return atualizarLigasMundoTecnico({
    clubes: CLUBES_CONVITES_TECNICO,
    classificacoesMundo,
    ligasMundo: t.ligasMundo,
    clubeTreinador: t.clube,
    ligaTreinador: liga,
    divisoes: DIVISOES_TECNICO,
  });
}
function movimentoDivisaoTecnico(liga, posicao, total) {
  const piramide = DIVISOES_TECNICO.find(x => x.baixo === liga || x.cima === liga);
  if (!piramide || total < 10) return null;
  if (liga === piramide.cima && posicao > total - piramide.vagas) return { tipo: 'rebaixado', de: liga, para: piramide.baixo };
  if (liga === piramide.baixo && posicao <= piramide.vagas) return { tipo: 'acesso', de: liga, para: piramide.cima };
  return null;
}
export function calendarioLigaTecnico(t = {}) {
  const clube = [...CLUBES_CONVITES_TECNICO,...SELECOES_TECNICO].find(x => x.nome === t.clube);
  const liga = t.liga || clube?.liga;
  // Carreiras antigas podem apontar para um clube removido sem guardar a liga.
  // Nesse caso, mantenha o calendário de compatibilidade em vez de tratar o
  // banco inteiro como uma divisão nacional.
  if (!liga) return null;
  const clubesBase = CLUBES_CONVITES_TECNICO.filter(x => !liga || (t.ligasMundo?.[x.nome] || x.liga) === liga)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  // Congela a composição da liga durante a temporada; saves antigos continuam
  // usando a lista original caso ainda não tenham um elenco de participantes.
  const nomesPersistidos = !t.ligasMundo && t.participantesLiga && t.participantesLiga.liga === liga ? t.participantesLiga.nomes : null;
  const participantes = Array.isArray(nomesPersistidos) && nomesPersistidos.length >= 2
    ? nomesPersistidos.map(nome => CLUBES_CONVITES_TECNICO.find(x => x.nome === nome) ||
        { nome, elenco: nome === t.clube ? forcaClubeTecnico(t) : 50 })
    : clubesBase.slice();
  if (!participantes.some(x => x.nome === t.clube)) {
    // O clube do treinador substitui o participante mais fraco da nova divisão.
    if (participantes.length >= 2) {
      const maisFraco = participantes.reduce((menor, atual, indice, lista) => atual.elenco < lista[menor].elenco ? indice : menor, 0);
      participantes.splice(maisFraco, 1);
    }
    participantes.unshift({ nome: t.clube || 'Meu clube', elenco: forcaClubeTecnico(t) });
  }
  if (participantes.length < 2) return null;
  // Método de círculo: ligas ímpares recebem uma vaga de folga por rodada.
  const times = [...participantes];
  if (times.length % 2) times.push(null);
  const tamanho = times.length;
  const rodadas = [];
  for (let r = 0; r < tamanho - 1; r++) {
    const jogos = [];
    for (let i = 0; i < tamanho / 2; i++) {
      const a = times[i], b = times[tamanho - 1 - i];
      if (!a || !b) continue;
      const casa = (r + i) % 2 === 0 ? a : b;
      const fora = casa === a ? b : a;
      jogos.push({ casa: casa.nome, fora: fora.nome });
    }
    rodadas.push(jogos);
    times.splice(1, 0, times.pop());
  }
  return [...rodadas, ...rodadas.map(jogos => jogos.map(j => ({ casa: j.fora, fora: j.casa })))];
}
export function calendarioAdversariosTecnico(t = {}) {
  const liga = calendarioLigaTecnico(t);
  if (liga) return liga.map((jogos, i) => {
    const nomeMeuClube = t.clube || 'Meu clube';
    const partida = jogos.find(j => j.casa === nomeMeuClube || j.fora === nomeMeuClube);
    if (!partida) return { rodada: i + 1, nome: 'Folga', forca: 0, casa: false, folga: true };
    const nome = partida.casa === nomeMeuClube ? partida.fora : partida.casa;
    return { rodada: i + 1, nome, forca: CLUBES_CONVITES_TECNICO.find(x => x.nome === nome)?.elenco ?? 50,
      casa: partida.casa === nomeMeuClube };
  });
  const clube = [...CLUBES_CONVITES_TECNICO,...SELECOES_TECNICO].find(x => x.nome === t.clube);
  const ligaAtual = t.liga || clube?.liga;
  const candidatos = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (!ligaAtual || (t.ligasMundo?.[x.nome] || x.liga) === ligaAtual))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  if (!candidatos.length) return Array.from({ length: 38 }, (_, i) => ({ rodada: i + 1, nome: 'Adversário', forca: 50, casa: i % 2 === 0 }));
  return Array.from({ length: 38 }, (_, i) => {
    const rival = candidatos[i % candidatos.length];
    return { rodada: i + 1, nome: rival.nome, forca: rival.elenco, casa: i < 19 };
  });
}
export function probabilidadesConfrontoTecnico(t, adversario) {
  const tatica=perfilTaticoTecnico(t);
  const bruta = forcaClubeTecnico(t) + tatica.ajuste - (adversario?.forca ?? 50);
  // Favoritismo enorme rende menos: o pequeno se fecha e o gigante não vence sempre.
  const diferenca = bruta > 12 ? 12 + (bruta - 12) * 0.6 : bruta;
  const mando = adversario?.casa ? 0.035 : -0.035;
  const risco=riscoEstiloTecnico(tatica.estilo,diferenca);
  const bonusMoral=limitar(((t.moral??50)-50)*.001,-.025,.025);
  const vitoria = limitar(0.40 + diferenca * 0.0065 + mando + risco + bonusMoral, 0.16, 0.70);
  const empateBase=limitar(0.27-Math.abs(diferenca)*.002,0.16,0.27);
  const empate=Math.min(1-vitoria-.06,Math.max(.1,empateBase+(tatica.estilo==='defensivo'?.05:tatica.estilo==='ofensivo'?-.05:0)));
  return { vitoria, empate, derrota: 1 - vitoria - empate };
}

export function placarTecnico(resultado, rng = sorteio, estilo = 'equilibrado') {
  if (resultado === 'E') { const gols = Math.floor(rng() * (estilo === 'defensivo' ? 2 : estilo === 'ofensivo' ? 4 : 3)); return { pro: gols, contra: gols }; }
  const vencedor = 1 + Math.floor(rng() * (estilo === 'defensivo' ? 2 : estilo === 'ofensivo' ? 4 : 3));
  const perdedor = Math.floor(rng() * vencedor);
  return resultado === 'V' ? { pro: vencedor, contra: perdedor } : { pro: perdedor, contra: vencedor };
}
export function registrarGolsTecnico(linha, pro, contra) {
  linha.golsPro = (linha.golsPro || 0) + pro;
  linha.golsContra = (linha.golsContra || 0) + contra;
  linha.saldoGols = linha.golsPro - linha.golsContra;
}
export function simularRodadaRivaisTecnico(t, classificacaoAnterior, adversario, resultado, rng = sorteio, rodada = 1, placarTreinador = null) {
  const linhas = classificacaoAnterior.map(x => ({ ...x }));
  const calendario = calendarioLigaTecnico(t);
  const partidas = calendario?.[rodada - 1];
  if (partidas) {
    for (const partida of partidas) {
      const casa = linhas.find(x => x.nome === partida.casa);
      const fora = linhas.find(x => x.nome === partida.fora);
      if (!casa || !fora) continue;
      const envolveTreinador = casa.meuClube || fora.meuClube;
      const forcaCasa = CLUBES_CONVITES_TECNICO.find(x => x.nome === casa.nome)?.elenco ?? t.elenco ?? 50;
      const forcaFora = CLUBES_CONVITES_TECNICO.find(x => x.nome === fora.nome)?.elenco ?? t.elenco ?? 50;
      const chanceCasa = limitar(0.42 + (forcaCasa - forcaFora) * 0.007, 0.16, 0.69);
      const r = envolveTreinador ? null : rng();
      const desfecho = envolveTreinador
        ? (casa.meuClube ? resultado : resultado === 'V' ? 'D' : resultado === 'D' ? 'V' : 'E')
        : r < chanceCasa ? 'V' : r < chanceCasa + 0.25 ? 'E' : 'D';
      if (envolveTreinador) {
        const rival = casa.meuClube ? fora : casa;
        const placar = placarTreinador || placarTecnico(resultado, rng);
        registrarGolsTecnico(rival, placar.contra, placar.pro);
        rival.jogos++;
        if (resultado === 'E') { rival.empates++; rival.pontos++; }
        else if (resultado === 'V') rival.derrotas++;
        else { rival.vitorias++; rival.pontos += 3; }
      } else {
        const placar = placarTecnico(desfecho, rng);
        registrarGolsTecnico(casa, placar.pro, placar.contra);
        registrarGolsTecnico(fora, placar.contra, placar.pro);
        casa.jogos++; fora.jogos++;
        if (desfecho === 'V') { casa.vitorias++; fora.derrotas++; casa.pontos += 3; }
        else if (desfecho === 'E') { casa.empates++; fora.empates++; casa.pontos++; fora.pontos++; }
        else { fora.vitorias++; casa.derrotas++; fora.pontos += 3; }
      }
    }
    return linhas;
  }
  // Compatibilidade com ligas de tamanho diferente ou carreiras antigas.
  const rivalDireto = linhas.find(x => !x.meuClube && x.nome === adversario);
  if (rivalDireto) {
    const placar = placarTreinador || placarTecnico(resultado, rng);
    registrarGolsTecnico(rivalDireto, placar.contra, placar.pro);
    rivalDireto.jogos++;
    if (resultado === 'V') rivalDireto.derrotas++;
    else if (resultado === 'E') { rivalDireto.empates++; rivalDireto.pontos++; }
    else { rivalDireto.vitorias++; rivalDireto.pontos += 3; }
  }
  // Alterna a folga nas ligas de quantidade ímpar, evitando favorecer sempre o mesmo clube.
  const rivais = linhas.filter(x => !x.meuClube && x.nome !== adversario);
  if (rivais.length % 2 === 1) rivais.splice((rodada - 1) % rivais.length, 1);
  for (let i = 0; i + 1 < rivais.length; i += 2) {
    const a = rivais[i], b = rivais[i + 1];
    const forcaA = CLUBES_CONVITES_TECNICO.find(x => x.nome === a.nome)?.elenco ?? 50;
    const forcaB = CLUBES_CONVITES_TECNICO.find(x => x.nome === b.nome)?.elenco ?? 50;
    const chanceA = limitar(0.38 + (forcaA - forcaB) * 0.007, 0.16, 0.68);
    const r = rng();
    const desfecho = r < chanceA ? 'V' : r < chanceA + 0.25 ? 'E' : 'D';
    const placar = placarTecnico(desfecho, rng);
    registrarGolsTecnico(a, placar.pro, placar.contra);
    registrarGolsTecnico(b, placar.contra, placar.pro);
    if (r < chanceA) { a.vitorias++; b.derrotas++; a.pontos += 3; }
    else if (r < chanceA + 0.25) { a.empates++; b.empates++; a.pontos++; b.pontos++; }
    else { b.vitorias++; a.derrotas++; b.pontos += 3; }
    a.jogos++; b.jogos++;
  }
  return linhas;
}
export function tabelaClassificacaoTecnico(t, andamento, rng = sorteio) {
  const jogos = andamento?.jogos || 0;
  const clube = [...CLUBES_CONVITES_TECNICO,...SELECOES_TECNICO].find(x => x.nome === t.clube);
  const liga = t.liga || clube?.liga;
  // A classificação precisa conter exatamente os clubes do calendário.
  // Após acesso/rebaixamento, o clube do treinador pode substituir outro participante.
  const partidas = calendarioLigaTecnico(t);
  const nomesParticipantes = partidas
    ? [...new Set(partidas.flatMap(rodada => rodada.flatMap(jogo => [jogo.casa, jogo.fora])))]
    : null;
  const rivais = (nomesParticipantes
    ? nomesParticipantes.filter(nome => nome !== t.clube).map(nome =>
      CLUBES_CONVITES_TECNICO.find(x => x.nome === nome) || { nome, elenco: 50 })
    : CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (!liga || (t.ligasMundo?.[x.nome] || x.liga) === liga)))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    .slice(0, nomesParticipantes ? undefined : 19);
  const pontos = andamento?.pontos || 0;
  const linhas = [{ nome: t.clube || 'Meu clube', jogos, pontos, vitorias: andamento?.vitorias || 0,
    empates: andamento?.empates || 0, derrotas: andamento?.derrotas || 0, golsPro: andamento?.golsPro || 0, golsContra: andamento?.golsContra || 0, saldoGols: (andamento?.golsPro || 0) - (andamento?.golsContra || 0), meuClube: true }];
  for (const rival of rivais) {
    const forca = rival.elenco;
    // Rivais fortes precisam disputar o título com pontuações competitivas.
    const expectativa = limitar(0.29 + (forca - 45) * 0.007, 0.21, 0.61);
    const empates = Math.min(jogos, Math.round(jogos * 0.24));
    const variacao = jogos >= 30 && t.simulacaoExpressa ? Math.round((rng() + rng() + rng() - 1.5) * 10) : 0;
    const vitorias = Math.max(0, Math.min(jogos - empates, Math.round(jogos * expectativa) + variacao));
    const derrotas = jogos - vitorias - empates;
    linhas.push({ nome: rival.nome, jogos, pontos: vitorias * 3 + empates, vitorias, empates, derrotas, golsPro: 0, golsContra: 0, saldoGols: 0, meuClube: false });
  }
  return ordenarClassificacaoTecnico(linhas);
}
export function zonaClassificacaoTecnico(posicao, total = 20) {
  if (posicao === 1) return 'campeao';
  if (posicao <= 4) return 'continental';
  if (posicao > total - 4) return 'rebaixamento';
  return 'meio';
}
export function ordenarClassificacaoTecnico(linhas) {
  return [...linhas].sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias ||
    b.saldoGols - a.saldoGols || a.nome.localeCompare(b.nome, 'pt-BR'))
    .map((x, i, todos) => ({ ...x, posicao: i + 1, zona: zonaClassificacaoTecnico(i + 1, todos.length) }));
}
export const ETAPAS_TEMPORADA_TECNICO = [10, 19, 29, 38];
function etapasCalendarioTecnico(t, calendario) {
  const total = calendario?.length || 38;
  if (total === 38) return ETAPAS_TEMPORADA_TECNICO;
  const etapas = [...new Set(ETAPAS_TEMPORADA_TECNICO.map(x => Math.max(1, Math.ceil(total * x / 38))))];
  if (etapas.at(-1) !== total) etapas.push(total);
  return etapas;
}
export const OPCOES_REUNIAO_TECNICO = [
  { id: 'responsabilidade', nome: 'Assumir responsabilidade', descricao: 'Confiança +12 · moral -4; compromete-se a reagir.' },
  { id: 'reforcos', nome: 'Exigir reforços', descricao: 'Elenco +5 · confiança -6 · torcida +3.' },
  { id: 'defesa', nome: 'Defender o trabalho', descricao: 'Moral +6 · risco de perder confiança da diretoria.' }
];
export function reuniaoEmergenciaTecnico(c, escolha, rng = sorteio) {
  const t = c?.tecnico;
  if (!t || t.fase !== 'pretemporada' || !t.reuniaoPendente || !t.andamento) throw new Error('Nenhuma reunião de emergência disponível.');
  if (!OPCOES_REUNIAO_TECNICO.some(x => x.id === escolha)) throw new Error('Resposta inválida.');
  let diretoria = t.diretoria, torcida = t.torcida, moral = t.moral, elenco = t.elenco;
  if (escolha === 'responsabilidade') { diretoria += 12; moral -= 4; }
  if (escolha === 'reforcos') { diretoria -= 6; elenco += 5; torcida += 3; }
  if (escolha === 'defesa') { moral += 6; diretoria += rng() < 0.4 ? 5 : -9; }
  const nova = { ...t, diretoria: limitar(diretoria, 0, 100), torcida: limitar(torcida, 0, 100),
    moral: limitar(moral, 10, 95), elenco: limitar(elenco, 10, 95),
    reuniaoPendente: false, reunioes: [...(t.reunioes || []), { ano: t.ano, rodada: t.andamento.rodadas ?? t.andamento.jogos, escolha }] };
  return { ...c, tecnico: nova };
}
export function simularEtapaTecnico(c, rng = sorteio) {
  const t = c?.tecnico;
  if (!t || t.fase !== 'pretemporada') throw new Error('Etapa indisponível.');
  if(carreiraTecnicoEncerrada(t,idadeAtualTecnico(c)))throw new Error('Carreira de treinador encerrada.');
  if ((t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) throw new Error('Conclua as decisões antes de jogar.');
  if (t.reuniaoPendente) throw new Error('Responda à reunião com a diretoria antes de avançar.');
  const anterior = t.andamento || { jogos: 0, rodadas: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0, avaliacoes: [] };
  const calendario = anterior.calendario || calendarioAdversariosTecnico(t);
  const totalRodadas = calendario?.length || 38;
  const rodadasAnteriores = anterior.rodadas ?? anterior.jogos;
  const limite = etapasCalendarioTecnico(t, calendario).find(n => n > rodadasAnteriores);
  if (!limite) throw new Error('Temporada já concluída.');
  // Copia cada partida para não alterar saves anteriores por referência.
  const confrontos = (anterior.confrontos || []).map(jogo => ({ ...jogo }));
  let v = anterior.vitorias, e = anterior.empates, d = anterior.derrotas;
  for (let i = rodadasAnteriores; i < limite; i++) {
    const adversario = calendario?.[i] || { rodada: i + 1, nome: 'Adversário', forca: 50, casa: i % 2 === 0 };
    if (adversario.folga) {
      confrontos.push({ ...adversario });
      continue;
    }
    const { vitoria: pVitoria, empate: pEmpate } = probabilidadesConfrontoTecnico(t, adversario);
    const r = rng();
    const resultado = r < pVitoria ? 'V' : r < pVitoria + pEmpate ? 'E' : 'D';
    if (resultado === 'V') v++; else if (resultado === 'E') e++; else d++;
    const placar = placarTecnico(resultado, rng, t.estilo);
    confrontos.push({ ...adversario, estilo: perfilTaticoTecnico(t).estilo, formacao: perfilTaticoTecnico(t).formacao, resultado, golsPro: placar.pro, golsContra: placar.contra });
  }
  const pontos = v * 3 + e;
  const jogosDisputados = confrontos.filter(j => !j.folga).length;
  const aproveitamento = jogosDisputados ? pontos / (jogosDisputados * 3) : 0;
  const expectativa = objetivoTecnico(t).posicao;
  const ruim = aproveitamento < (expectativa <= 4 ? 0.44 : expectativa <= 8 ? 0.35 : 0.25);
  const otimo = aproveitamento > (expectativa <= 4 ? 0.72 : 0.62);
  const ajuste = otimo ? 6 : ruim ? -9 : 1;
  const diretoria = limitar((t.diretoria ?? 60) + ajuste, 0, 100);
  const torcida = limitar((t.torcida ?? 55) + (otimo ? 7 : ruim ? -8 : 1), 0, 100);
  const pressao = riscoDemissaoTecnico({ ...t, diretoria, torcida }).pressao;
  const demitido = (diretoria < 18 || pressao >= 85) && limite < totalRodadas;
  const reuniaoPendente = !demitido && limite < totalRodadas && (pressao >= 55 || diretoria <= 45);
  const avaliacao = { rodada: limite, pontos, aproveitamento: Math.round(aproveitamento * 100),
    situacao: demitido ? 'Demitido durante a temporada' : ruim ? 'Diretoria insatisfeita' : otimo ? 'Diretoria satisfeita' : 'Diretoria acompanha os resultados',
    diretoria, torcida, pressao };
  const andamento = { jogos: jogosDisputados, rodadas: limite, calendario, confrontos, vitorias: v, empates: e, derrotas: d, pontos,
    avaliacoes: [...anterior.avaliacoes, avaliacao] };
  // Saves anteriores à introdução dos placares preservam resultados e recebem gols coerentes.
  for (const jogo of confrontos) {
    if (!Number.isFinite(jogo.golsPro) || !Number.isFinite(jogo.golsContra)) {
      const placar = placarTecnico(jogo.resultado, rng);
      jogo.golsPro = placar.pro;
      jogo.golsContra = placar.contra;
    }
  }
  // Mantém os resultados dos rivais entre etapas; saves antigos iniciam pela tabela estimada.
  const base = anterior.classificacao || tabelaClassificacaoTecnico(t, { jogos: anterior.jogos, pontos: anterior.pontos, vitorias: anterior.vitorias, empates: anterior.empates, derrotas: anterior.derrotas });
  let classificacao = base;
  for (let rodada = rodadasAnteriores; rodada < limite; rodada++) {
    classificacao = simularRodadaRivaisTecnico(t, classificacao, confrontos[rodada]?.nome, confrontos[rodada]?.resultado, rng, rodada + 1, { pro: confrontos[rodada]?.golsPro, contra: confrontos[rodada]?.golsContra });
  }
  const golsPro = confrontos.reduce((n, j) => n + (j.golsPro || 0), 0);
  const golsContra = confrontos.reduce((n, j) => n + (j.golsContra || 0), 0);
  classificacao = classificacao.map(x => x.meuClube ? { ...x, jogos: jogosDisputados, pontos, vitorias: v, empates: e, derrotas: d, golsPro, golsContra, saldoGols: golsPro - golsContra } : x);
  andamento.classificacao = ordenarClassificacaoTecnico(classificacao);
  if (demitido) {
    const posicao = andamento.classificacao.find(x => x.meuClube)?.posicao || 18;
    const temporada = { ano: t.ano, clube: t.clube, ...(CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga || t.liga ? { liga: CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga || t.liga } : {}), objetivo: objetivoTecnico(t).nome,
      cumpriuObjetivo: false, posicao, pontos, vitorias: v, empates: e, derrotas: d,
      jogos: jogosDisputados, interrompida: true, demitido: true, confrontos, classificacao: andamento.classificacao, avaliacoes: andamento.avaliacoes };
    const novo = { ...t, idade:idadeAtualTecnico(c)+1, carteiraTecnico:creditarSalarioTecnico(t,t.ano,t.salario??salarioTecnico(t),Math.max(1,Math.ceil(jogosDisputados/totalRodadas*12))), diretoria, torcida, demitido: true, reuniaoPendente: false, andamento: null,
      propostasCoerentesVersao:3, fase: 'resultado', temporadas: [...t.temporadas, temporada],
      vitorias: t.vitorias + v, empates: t.empates + e, derrotas: t.derrotas + d,
      propostas: gerarPropostasTecnico({ ...t, diretoria, torcida, clube: null,clubeReferencia:t.clube,temporadas:[...t.temporadas,temporada] }, rng),
      promessaContrato: null, ano: t.ano + 1 };
    return { ...c, idade: idadeAtualTecnico(c) + 1, ano: c.ano + 1, tecnico: novo };
  }
  if (limite < totalRodadas) return { ...c, tecnico: { ...t, diretoria, torcida, andamento, reuniaoPendente } };
  // Finalizar usando os resultados já disputados, sem sortear partidas novamente.
  return finalizarTemporadaTecnico(c, { ...andamento, diretoria, torcida }, rng);
}
export const INTERVENCOES_TECNICO=[
 {id:'manter',nome:'Manter o plano',descricao:'Confie no estilo preparado para a temporada.'},
 {id:'atacar',nome:'Buscar a vitória',descricao:'Estilo ofensivo neste jogo: mais gols e mais riscos.'},
 {id:'proteger',nome:'Proteger a equipe',descricao:'Estilo defensivo neste jogo: menos gols e mais empates.'}
];
export function definirAcompanhamentoTecnico(c,ativo){
 validarMudancaTatica(c?.tecnico);
 return {...c,tecnico:{...c.tecnico,acompanharJogo:!!ativo}};
}
export function responderIntervencaoTecnico(c,chave,escolha,rng=sorteio){
 const t=c?.tecnico,p=t?.intervencaoPendente;
 // Cliques repetidos ou callbacks de uma tela antiga não simulam outra temporada.
 if(t?.fase!=='intervencao'||!p||p.chave!==chave)return c;
 if(!INTERVENCOES_TECNICO.some(x=>x.id===escolha))throw new Error('Intervenção inválida.');
 if(!t.temporadaPausada||t.temporadaPausada.ano!==t.ano||t.temporadaPausada.clube!==t.clube)throw new Error('Temporada pendente incompatível.');
 return simularTemporadaTecnico({...c,tecnico:{...t,fase:'pretemporada',temporadaPausada:{...t.temporadaPausada,escolha}}},rng);
}
export function simularTemporadaTecnico(c, rng = sorteio, opcoes = {}) {
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  if (c.tecnico.fase !== 'pretemporada') throw new Error('Conclua a temporada anterior antes de simular.');
  if(c.tecnico.aposentado||(idadeAtualTecnico(c))>=IDADE_MAXIMA_TECNICO)throw new Error('Carreira de treinador encerrada aos 85 anos ou por aposentadoria.');
  const pausa=c.tecnico.temporadaPausada;
  if(pausa&&!pausa.escolha)throw new Error('Escolha uma intervenção para continuar.');
  const t = {...c.tecnico,copasEscolhaHabilitadas:c.tecnico.copasEscolhaHabilitadas||!!opcoes.copasInterativas,temporadaPausada:null,intervencaoPendente:null};
  if ((t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) throw new Error('Tome as decisões da temporada antes de simular.');
  if (t.andamento?.rodadas || t.andamento?.jogos) throw new Error('Temporada em andamento: avance pelas etapas.');
  if (t.tipoEquipe === 'selecao') {
    const resultado = simularAnoSelecaoTecnico(t, calcularOvrTecnico(t), forcaClubeTecnico(t), rng, opcoes);
    const novo = {...t, ...resultado, idade:idadeAtualTecnico(c)+1, carteiraTecnico:creditarSalarioTecnico(t,t.ano,t.salario??salarioTecnico(t))};
    novo.propostas = gerarPropostasTecnico(novo,rng);
    return {...c, idade:idadeAtualTecnico(c)+1,ano:c.ano+1,tecnico:comMetas(novo)};
  }
  const ligaAtual = t.liga || CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga;
  const participantesLiga = calendarioLigaTecnico({ ...t, liga: ligaAtual });
  const nomesLiga = participantesLiga ? [...new Set(participantesLiga.flatMap(r => r.flatMap(j => [j.casa, j.fora])))] : null;
  const calendario = pausa?.calendario || calendarioAdversariosTecnico({ ...t, liga: ligaAtual });
  let {vitorias=0,empates=0,derrotas=0,golsPro=0,golsContra=0}=pausa||{};
  let classificacao = pausa?structuredClone(pausa.classificacao):tabelaClassificacaoTecnico({ ...t, liga: ligaAtual }, { jogos: 0 });
  const confrontos = pausa?structuredClone(pausa.confrontos):[];
  const chaveJogo=calendario.map((j,i)=>({...j,indice:i})).filter(j=>!j.folga&&j.indice>=Math.floor(calendario.length/2)).sort((a,b)=>b.forca-a.forca||a.indice-b.indice)[0];
  // Paradas da temporada (só na tela do jogo): metade no ritmo normal, dois terços no intenso, nenhuma no expresso.
  const paradas = opcoes.interativo && !t.copasEscolhaHabilitadas ? paradasDoRitmoTecnico(c.ritmo, calendario.length) : [];
  const clubesLiga = CLUBES_CONVITES_TECNICO.filter(x => (t.ligasMundo?.[x.nome] || x.liga) === ligaAtual);
  const rivalInicial = definirRivalTecnico(t, clubesLiga);
  // Clássico contra o técnico rival: o último encontro na liga vira um momento próprio (fora do ritmo expresso).
  const rodadaClassico = opcoes.interativo && !t.copasEscolhaHabilitadas && c.ritmo !== 'expresso' && rivalInicial
    ? calendario.map((j, i) => (!j.folga && j.nome === rivalInicial.clube ? i : -1)).filter(i => i >= 0).at(-1) ?? -1 : -1;
  let classico = pausa?.classico || null;
  const pausaComum = { ...(classico ? { classico } : {}), ...(pausa?.classicoFeito ? { classicoFeito: true } : {}) };
  for (let rodada = pausa?.indice ?? 0; rodada < calendario.length; rodada++) {
    const adversario = calendario[rodada];
    if (adversario.folga) {
      confrontos.push({ ...adversario });
      classificacao = simularRodadaRivaisTecnico({ ...t, liga: ligaAtual }, classificacao, null, null, rng, rodada + 1);
      continue;
    }
    if (paradas.includes(rodada) && !(pausa?.paradasFeitas || []).includes(rodada)) {
      const jogosAte = confrontos.filter(j => !j.folga).length, pontosAte = vitorias * 3 + empates;
      const tabela = ordenarClassificacaoTecnico(classificacao.map(x => x.meuClube ? { ...x, jogos: jogosAte, pontos: pontosAte, vitorias, empates, derrotas, golsPro, golsContra, saldoGols: golsPro - golsContra } : x));
      const minha = tabela.find(x => x.meuClube);
      const objetivoAtual = objetivoTecnico({ ...t, liga: ligaAtual });
      const crise = (minha?.posicao || tabela.length) > objetivoAtual.posicao + 3 || riscoDemissaoTecnico(t).pressao >= 55;
      const chave = `${t.clube}|${t.ano}|parada|${rodada}`;
      return { ...c, tecnico: { ...t, fase: 'parada',
        paradaPendente: { chave, rodada, total: calendario.length, jogos: jogosAte, pontos: pontosAte, vitorias, empates, derrotas, golsPro, golsContra,
          posicao: minha?.posicao || tabela.length, objetivo: objetivoAtual.nome, objetivoPosicao: objetivoAtual.posicao, crise, tabela: tabela.slice(0, 5), minha },
        temporadaPausada: { tipo: 'parada', ano: t.ano, clube: t.clube, indice: rodada, calendario: structuredClone(calendario), confrontos, classificacao, vitorias, empates, derrotas, golsPro, golsContra,
          paradasFeitas: [...(pausa?.paradasFeitas || []), rodada], ...pausaComum, ...(classico ? { classico } : {}) } } };
    }
    if (rodada === rodadaClassico && !pausa?.classicoFeito && !(pausa?.tipo === 'rival' && pausa.indice === rodada)) {
      const jogosAte = confrontos.filter(j => !j.folga).length, pontosAte = vitorias * 3 + empates;
      const tabela = ordenarClassificacaoTecnico(classificacao.map(x => x.meuClube ? { ...x, jogos: jogosAte, pontos: pontosAte, vitorias, empates, derrotas, golsPro, golsContra, saldoGols: golsPro - golsContra } : x));
      const minha = tabela.find(x => x.meuClube), dele = tabela.find(x => x.nome === rivalInicial.clube);
      const chave = `${t.clube}|${t.ano}|classico|${rodada}`;
      return { ...c, tecnico: { ...t, fase: 'parada',
        paradaPendente: { chave, tipo: 'rival', rodada: rodada + 1, total: calendario.length, jogos: jogosAte, pontos: pontosAte, posicao: minha?.posicao || tabela.length,
          rival: { nome: rivalInicial.nome, clube: rivalInicial.clube, rivalDeGeracao: !!rivalInicial.rivalDeGeracao, v: rivalInicial.v, e: rivalInicial.e, d: rivalInicial.d, posicao: dele?.posicao, pontos: dele?.pontos },
          casa: !!adversario.casa, forca: Math.round(forcaClubeTecnico(t)), forcaAdv: adversario.forca, tabela: tabela.slice(0, 5), minha },
        temporadaPausada: { tipo: 'rival', ano: t.ano, clube: t.clube, indice: rodada, calendario: structuredClone(calendario), confrontos, classificacao, vitorias, empates, derrotas, golsPro, golsContra,
          paradasFeitas: [...(pausa?.paradasFeitas || [])], ...(classico ? { classico } : {}), classicoFeito: true } } };
    }
    if(t.acompanharJogo&&!t.copasEscolhaHabilitadas&&!pausa&&rodada===chaveJogo?.indice){
      const chave=`${t.clube}|${t.ano}|${rodada}`;
      return {...c,tecnico:{...t,fase:'intervencao',intervencaoPendente:{chave,adversario,rodada:rodada+1,pontos:vitorias*3+empates,jogos:confrontos.filter(j=>!j.folga).length},
        temporadaPausada:{ano:t.ano,clube:t.clube,indice:rodada,calendario:structuredClone(calendario),confrontos,classificacao,vitorias,empates,derrotas,golsPro,golsContra}}};
    }
    const intervencao=pausa&&pausa.tipo!=='parada'&&rodada===pausa.indice?pausa.escolha:null;
    const estiloJogo=intervencao==='atacar'?'ofensivo':intervencao==='proteger'?'defensivo':t.estilo;
    const planoJogo={...t,liga:ligaAtual,estilo:estiloJogo};
    const odds = probabilidadesConfrontoTecnico(planoJogo, adversario);
    const sorteioResultado = rng();
    const resultado = sorteioResultado < odds.vitoria ? 'V' : sorteioResultado < odds.vitoria + odds.empate ? 'E' : 'D';
    if (resultado === 'V') vitorias++;
    else if (resultado === 'E') empates++;
    else derrotas++;
    const placar = placarTecnico(resultado, rng, estiloJogo);
    golsPro += placar.pro;
    golsContra += placar.contra;
    confrontos.push({ ...adversario, estilo: perfilTaticoTecnico(planoJogo).estilo, formacao: perfilTaticoTecnico(planoJogo).formacao, ...(intervencao?{intervencao}:{}), resultado, golsPro: placar.pro, golsContra: placar.contra });
    if (pausa?.tipo === 'rival' && rodada === pausa.indice) classico = { rodada: rodada + 1, rival: rivalInicial?.nome, clube: adversario.nome, escolha: pausa.escolha, resultado, golsPro: placar.pro, golsContra: placar.contra };
    classificacao = simularRodadaRivaisTecnico({ ...t, liga: ligaAtual }, classificacao, adversario.nome, resultado, rng, rodada + 1, placar);
  }
  const pontos = vitorias * 3 + empates;
  const jogosDisputados = confrontos.filter(j => !j.folga).length;
  classificacao = ordenarClassificacaoTecnico(classificacao.map(x => x.meuClube
    ? { ...x, jogos: jogosDisputados, pontos, vitorias, empates, derrotas, golsPro, golsContra, saldoGols: golsPro - golsContra }
    : x));
  const posicao = classificacao.find(x => x.meuClube)?.posicao || classificacao.length;
  const campeao = posicao === 1;
  const objetivo = objetivoTecnico({ ...t, liga: ligaAtual });
  const vinculoAtual = vinculoAtivoTecnico(t,t.clube);
  const idoloEmCasa = !!vinculoAtual?.idolatria;
  const cumpriuObjetivo = posicao <= objetivo.posicao;
  const promessaDescumprida = !!(t.promessaContrato && t.promessaContrato.clube === t.clube && posicao > t.promessaContrato.posicaoMaxima);
  const movimento = movimentoDivisaoTecnico(ligaAtual, posicao, classificacao.length);
  const ligaSeguinte = movimento?.para || ligaAtual;
  const classificacoesMundo = classificacoesMundoDaTemporada({ ...t, liga: ligaAtual }, ligaAtual, classificacao, rng);
  const progressaoMundo = atualizarLigasMundoDaTemporada({ ...t, liga: ligaAtual }, ligaAtual, classificacoesMundo);
  const temporada = {
    ano: t.ano, clube: t.clube, liga: ligaAtual, idoloEmCasa,
    objetivo: objetivo.nome, cumpriuObjetivo, promessaDescumprida, estilo: t.estilo, formacao: perfilTaticoTecnico(t).formacao,
    decisoes: t.decisoes, jogos: jogosDisputados, vitorias, empates, derrotas, pontos, posicao, campeao,
    classificacao, classificacoesMundo,
    ...(progressaoMundo.movimentos.length ? { movimentosMundo: progressaoMundo.movimentos } : {}),
    confrontos, golsPro, golsContra, paradas: t.paradasTemporada || [], ...(classico ? { classico } : {}),
    ...(movimento?.tipo === 'rebaixado' ? { rebaixado: { de: movimento.de, para: movimento.para } } : {}),
    ...(movimento?.tipo === 'acesso' ? { acesso: { de: movimento.de, para: movimento.para } } : {})
  };
  const copasPorLiga = {
    brasileirao: 'Copa do Brasil', serieB: 'Copa do Brasil',
    argentina: 'Copa Argentina', portugal: 'Taça de Portugal', portugal2: 'Taça de Portugal',
    arabia: "King's Cup", holanda: 'KNVB Beker', mls: 'MLS Cup', turquia: 'Türkiye Kupası',
    espanha: 'Copa del Rey', espanha2: 'Copa del Rey', inglaterra: 'FA Cup', inglaterra2: 'FA Cup',
    italia: 'Coppa Italia', italia2: 'Coppa Italia', alemanha: 'DFB-Pokal', franca: 'Coupe de France', franca2: 'Coupe de France'
  };
  const continentaisPorLiga = {
    brasileirao: 'Copa Libertadores', serieB: null, argentina: 'Copa Libertadores', sulamericano: 'Copa Libertadores',
    portugal: 'UEFA Champions League', portugal2: null, espanha: 'UEFA Champions League', espanha2: null,
    inglaterra: 'UEFA Champions League', inglaterra2: null, italia: 'UEFA Champions League', italia2: null,
    alemanha: 'UEFA Champions League', franca: 'UEFA Champions League', franca2: null,
    alemanha2: null, arabia: 'AFC Champions League Elite', holanda: 'UEFA Champions League', mls: 'CONCACAF Champions Cup', turquia: 'UEFA Champions League'
  };
  const bonusTecnico = ((t.moral ?? 50) - 50) * 0.06 + 1;
  const tatica=perfilTaticoTecnico(t);
  const torneios = [];
  const copaNome = copasPorLiga[ligaAtual];
  if (copaNome) torneios.push(simularCopaNacionalTecnico({
    clubes: CLUBES_CONVITES_TECNICO, nomeUsuario: t.clube, pais: t.pais,
    forcaUsuario: forcaClubeTecnico(t), nome: copaNome, bonusTecnico, tatica,
    formato: t.regrasCompeticoes?.[copaNome]?.formato || {}, rng
  }));
  const torneioAnterior = t.temporadas?.at(-1);
  const vagaCompartilhada=vagaTecnico(t);
  const continentalNome = vagaCompartilhada?(['libertadores','champions'].includes(vagaCompartilhada.competicao)?continentaisPorLiga[ligaAtual]||nomeVaga(vagaCompartilhada.competicao):nomeVaga(vagaCompartilhada.competicao)):continentaisPorLiga[ligaAtual];
  const configuracaoContinental = t.regrasCompeticoes?.[continentalNome] || {};
  const formatoContinental = configuracaoContinental.formato || {};
  const vagasAnteriores=torneioAnterior?.vagasInternacionaisProxima||calcularVagasRapidas({ano:t.ano-1,classificacoesMundo:classificacoesHistoricas(torneioAnterior,t.ligasMundo),torneios:torneioAnterior?.torneios,ligasMundo:t.ligasMundo});
  const participantesQualificados = configuracaoContinental.qualificacao ? classificarVagasContinentalTecnico({clubes:CLUBES_CONVITES_TECNICO,classificacoesMundo:torneioAnterior?.classificacoesMundo||{},pais:t.pais,limite:formatoContinental.totalParticipantes??16,regra:configuracaoContinental.qualificacao}) : !torneioAnterior ? [] : CLUBES_CONVITES_TECNICO.filter(clube=>vagasAnteriores[clube.nome]?.competicao===idContinental(continentalNome));
  if(!configuracaoContinental.qualificacao&&participantesQualificados.some(x=>x.nome===t.clube)){
    participantesQualificados.splice(0,participantesQualificados.length,...ampliarParticipantesInternacionais(participantesQualificados,idContinental(continentalNome),t.ano,CLUBES_CONVITES_TECNICO));
    const notas=new Map(participantesQualificados.map(x=>[x.nome,(x.forca??x.elenco??60)+rng()*12]));
    participantesQualificados.sort((a,b)=>notas.get(b.nome)-notas.get(a.nome));
  }
  // O limite do quadro não pode eliminar a vaga que o clube do usuário já conquistou.
  if(!configuracaoContinental.qualificacao&&participantesQualificados.some(x=>x.nome===t.clube))participantesQualificados.sort((a,b)=>(b.nome===t.clube)-(a.nome===t.clube));
  if(!configuracaoContinental.qualificacao&&participantesQualificados.length>=2){
    const limite=Math.min(16,2**Math.floor(Math.log2(participantesQualificados.length)));
    participantesQualificados.splice(limite);
    if(!configuracaoContinental.formato){formatoContinental.totalParticipantes=limite;formatoContinental.grupos=limite>=4?limite/4:0;}
  }
  if (continentalNome && participantesQualificados.some(clube => clube.nome === t.clube)) {
    const continental = simularCopaContinentalTecnico({
      clubes: CLUBES_CONVITES_TECNICO, nomeUsuario: t.clube, pais: t.pais,
      forcaUsuario: forcaClubeTecnico(t), nome: continentalNome,
      participantesQualificados, bonusTecnico, tatica, formato: formatoContinental, rng
    });
    if (continental) torneios.push(continental);
  }
  const copasEmJogo=t.copasEscolhaHabilitadas?prepararCopasTecnico(t,forcaClubeTecnico(t)):null;
  if(copasEmJogo)torneios.splice(0,torneios.length,...copasEmJogo.campeonatos.map(resumoCampanhaCopa));
  else {const estadual=estadualAutomaticoTecnico(t,forcaClubeTecnico(t));if(estadual)torneios.push(estadual);}
  temporada.torneios = torneios;
  // Finais em que o clube chegou viram decisão do treinador na tela; até lá, a taça fica em aberto.
  const finaisPendentes = opcoes.interativo&&!copasEmJogo ? torneios.filter(x=>x.tipo!=='estadual').map(x => finalDoUsuarioTecnico(x, t.clube)).filter(Boolean).map(f => ({ ...f, ano: t.ano,
    forcaUsuario: Math.round(forcaClubeTecnico(t)), forcaAdv: CLUBES_CONVITES_TECNICO.find(x => x.nome === f.adversario)?.elenco ?? 70, dado: rng() })) : [];
  for (const x of torneios) if (finaisPendentes.some(f => f.nome === x.nome)) { x.finalPendente = true; x.faseUsuario = 'Final'; x.campeao = null; }
  temporada.titulosConquistados = [
    ...(campeao ? [competicaoTemporadaTecnico(temporada)] : []),
    ...torneios.filter(x => x.campeao === t.clube).map(x => x.nome)
  ];
  temporada.vagasInternacionaisProxima=calcularVagasRapidas({ano:t.ano,classificacoesMundo,torneios,ligasMundo:t.ligasMundo});
  const rivalTecnico = atualizarRivalTecnico(rivalInicial, temporada);
  if (rivalTecnico?.ultimo) temporada.rival = { nome: rivalTecnico.nome, clube: rivalTecnico.clube, ...rivalTecnico.ultimo };
  // Errar a meta por pouco custa menos do que desabar na tabela.
  const custoMeta = cumpriuObjetivo ? 8 : -Math.min(24, 8 + 3 * (posicao - objetivo.posicao));
  // Em clube gigante, ficar sem o título por dois anos seguidos vira crise.
  const gigante = objetivo.id === 'campeao' && !campeao;
  const jejum = gigante && t.temporadas?.at(-1)?.clube === t.clube && t.temporadas.at(-1).objetivo === objetivo.nome && !t.temporadas.at(-1).cumpriuObjetivo;
  if (gigante) temporada.cobrancaGigante = jejum ? 'jejum' : 'vice';
  const novaConfianca = limitar((t.diretoria ?? 60) + custoMeta + (posicao <= 4 && !gigante ? 5 : posicao >= 15 ? -8 : 0) - (jejum ? 8 : 0)
    + (idoloEmCasa && !cumpriuObjetivo ? -4 : 0) - (promessaDescumprida ? 12 : 0), 0, 100);
  const variacaoTorcida = (campeao ? 18 : gigante ? (jejum ? -12 : -4) : posicao <= 4 ? 10 : cumpriuObjetivo ? 5 : posicao >= 17 ? -23 : -12)
    + (idoloEmCasa && !cumpriuObjetivo ? -9 : idoloEmCasa && cumpriuObjetivo ? 4 : 0) - (promessaDescumprida ? 7 : 0)
    + (movimento?.tipo === 'rebaixado' ? -6 : movimento?.tipo === 'acesso' ? 6 : 0)
    + (classico ? (classico.resultado === 'V' ? 5 : classico.resultado === 'D' ? (classico.escolha === 'provocar' ? -10 : -5) : 0) : 0);
  const novaTorcida = limitar((t.torcida ?? 55) + variacaoTorcida, 0, 100);
  const situacaoCargo = riscoDemissaoTecnico({ ...t, diretoria: novaConfianca, torcida: novaTorcida });
  const contratoCurto = t.contratoCurto?.clube === t.clube && t.contratoCurto.ano === t.ano;
  if (contratoCurto) temporada.contratoCurto = cumpriuObjetivo ? 'renovado' : 'encerrado';
  const demitido = novaConfianca < 20 || (novaConfianca < 40 && novaTorcida < 35) || situacaoCargo.pressao >= 82 || (contratoCurto && !cumpriuObjetivo);
  temporada.demitido = demitido;
  const mentor=c.jornada?.mentor;
  if(mentor?.promovido&&c.idade<49&&(temporada.confrontos||[]).some(j=>j.nome===mentor.clubeAtual))temporada.reencontroMentor={nome:mentor.nome,clube:mentor.clubeAtual,texto:'Seu primeiro orientador está registrado no banco adversário. Duas trajetórias se encontram.',ficticio:true};
  temporada.filosofia=t.filosofia||null;
  const primeiraDivisao = !/(?:2|serieB)$/i.test(ligaAtual || '');
  const reputacaoNova = limitar((t.reputacao ?? 50) + (campeao ? (primeiraDivisao ? 16 : 8) : cumpriuObjetivo ? 4 : -3)
    + torneios.filter(x => x.campeao === t.clube).reduce((n, x) => n + (x.tipo === 'continental' ? 12 : x.tipo==='estadual'?1:5), 0), 10, 99);
  const propostas = gerarPropostasTecnico({ ...t, clube: demitido ? null : t.clube,clubeReferencia:t.clube,temporadas:[...t.temporadas,temporada],titulos:(t.titulos||0)+temporada.titulosConquistados.length, liga: ligaSeguinte,
    ligasMundo: progressaoMundo.ligasMundo, reputacao: reputacaoNova }, rng);
  const conviteSelecao = null;
  return registrarHistoriaTecnico({ ...c, idade: idadeAtualTecnico(c) + 1, ano: c.ano + 1, tecnico: comMetas({
    ...t, idade:idadeAtualTecnico(c)+1, carteiraTecnico:creditarSalarioTecnico(t,t.ano,t.salario??salarioTecnico(t)), ano: t.ano + 1, liga: ligaSeguinte,
    copasEmJogo, finaisPendentes, conviteSelecao, ofertasRecentes:[...(t.ofertasRecentes||[]),...(t.propostas||[]).map(p=>p.nome)].slice(-18), rivalTecnico, temporadaPausada: null, paradaPendente: null, ultimaFinal: null, contratoCurto: null,
    ligasMundo: progressaoMundo.ligasMundo,
    participantesLiga: ligaSeguinte === ligaAtual && nomesLiga
      ? { liga: ligaAtual, nomes: nomesLiga } : null,
    propostasCoerentesVersao:3, fase: 'resultado', temporadas: [...t.temporadas, temporada],
    vitorias: (t.vitorias ?? 0) + vitorias, empates: (t.empates ?? 0) + empates, derrotas: (t.derrotas ?? 0) + derrotas,
    titulos: (t.titulos ?? 0) + temporada.titulosConquistados.length, demitido, propostas,
    promessaContrato: null, objetivoAtual: objetivo.nome, reputacao: reputacaoNova,
    diretoria: novaConfianca, torcida: novaTorcida
  })});
}

/** Resposta à parada da temporada: aplica o efeito e continua de onde parou. */
export function responderParadaTecnico(c, chave, escolha, rng = sorteio) {
  const t = c?.tecnico, p = t?.paradaPendente;
  if (t?.fase !== 'parada' || !p || p.chave !== chave) return c;
  const op = OPCOES_PARADA_TECNICO[p.tipo === 'rival' ? 'rival' : p.crise ? 'crise' : 'normal'].find(o => o.id === escolha);
  if (!op) throw new Error('Escolha inválida.');
  if (p.tipo === 'rival') return simularTemporadaTecnico({ ...c, tecnico: { ...t, fase: 'pretemporada', paradaPendente: null,
    moral: limitar((t.moral ?? 50) + (op.moral || 0), 10, 95), temporadaPausada: { ...t.temporadaPausada, escolha: op.id } } }, rng, { interativo: true });
  const deuCerto = op.aposta ? geradorTecnico(chave)() < 0.4 : null;
  const diretoria = (op.diretoria || 0) + (op.aposta ? (deuCerto ? 5 : -9) : 0);
  const registro = { rodada: p.rodada, total: p.total, posicao: p.posicao, pontos: p.pontos, escolha: op.id, nome: op.nome, crise: p.crise, ...(op.aposta ? { apostaDeuCerto: deuCerto } : {}) };
  const novo = { ...t, fase: 'pretemporada', paradaPendente: null,
    ajusteTurno: { forca: limitar((t.ajusteTurno?.forca || 0) + (op.forca || 0), -4, 6) },
    moral: limitar((t.moral ?? 50) + (op.moral || 0), 10, 95), diretoria: limitar((t.diretoria ?? 60) + diretoria, 0, 100),
    paradasTemporada: [...(t.paradasTemporada || []), registro], temporadaPausada: { ...t.temporadaPausada, escolha: op.id } };
  return simularTemporadaTecnico({ ...c, tecnico: novo }, rng, { interativo: true });
}

/** Final decidida pelo treinador: a escolha muda a chance; o sorteio já está guardado no save. */
export function resolverFinalTecnico(c, nome, opcaoId) {
  const t = c?.tecnico, f = (t?.finaisPendentes || []).find(x => x.nome === nome);
  if (!f) return c;
  const op = FINAIS_TECNICO.find(o => o.id === opcaoId) || FINAIS_TECNICO[1];
  const chance = chanceFinalTecnico(f, op.id, t.moral);
  const venceu = f.dado < chance;
  const temporadas = [...t.temporadas];
  const idx = temporadas.map((a, i) => ({ a, i })).filter(({ a }) => a.ano === f.ano && (a.torneios || []).some(x => x.nome === f.nome)).at(-1)?.i ?? temporadas.length - 1;
  const a = { ...temporadas[idx] };
  let placar = '';
  a.torneios = (a.torneios || []).map(x => { if (x.nome !== f.nome) return x; const r = aplicarResultadoFinalTecnico(x, f, venceu, geradorTecnico(`${f.ano}|${f.nome}|${f.lado}|placar`)); placar = r.placar; return r.torneio; });
  if (venceu) a.titulosConquistados = [...(a.titulosConquistados || []), f.nome];
  a.finais = [...(a.finais || []), { nome: f.nome, tipo: f.tipo, adversario: f.adversario, lado: f.lado, escolha: op.id, escolhaNome: op.nome, chance, venceu, placar }];
  let correcao = {};
  if(a.tipoEquipe==='selecao'){
    const jogos=a.torneios.flatMap(x=>x.jogosUsuario||[]),v=jogos.filter(x=>x.vencedor===a.clube).length,e=jogos.filter(x=>!x.vencedor).length,d=jogos.length-v-e;
    correcao={vitorias:(t.vitorias||0)+v-a.vitorias,empates:(t.empates||0)+e-a.empates,derrotas:(t.derrotas||0)+d-a.derrotas};
    a.vitorias=v;a.empates=e;a.derrotas=d;a.jogos=jogos.length;a.pontos=v*3+e;
    if(venceu)a.cumpriuObjetivo=true;
  }
  if(a.tipoEquipe!=='selecao')a.vagasInternacionaisProxima=calcularVagasRapidas({ano:a.ano,classificacoesMundo:a.classificacoesMundo,torneios:a.torneios,ligasMundo:t.ligasMundo});
  temporadas[idx] = a;
  const restantes = t.finaisPendentes.filter(x => x.nome !== nome);
  const ganho = venceu ? (f.tipo === 'continental' ? 12 : f.tipo === 'copaMundo' ? 15 : 5) : 1;
  const novo = { ...t, ...correcao, temporadas, finaisPendentes: restantes, titulos: (t.titulos || 0) + (venceu ? 1 : 0),
    reputacao: limitar((t.reputacao ?? 40) + ganho, 10, 99), torcida: f.tipo === 'copaMundo' ? t.torcida : limitar((t.torcida ?? 55) + (venceu ? 6 : -3), 0, 100),
    ultimaFinal: { nome: f.nome, tipo: f.tipo, adversario: f.adversario, lado: f.lado, escolha: op.nome, chance, venceu, placar, ano: f.ano, dado: f.dado } };
  if (!restantes.length && !novo.desempregado) novo.propostas = gerarPropostasTecnico({ ...novo, clube: novo.demitido ? null : novo.clube, clubeReferencia: a.clube }, geradorTecnico(`${f.ano}|${a.clube}|propostas-final`));
  return registrarHistoriaTecnico({ ...c, tecnico: comMetas(novo) });
}
/** Saves antigos ou atalhos: finais ainda abertas são decididas com o jogo controlado. */
export function concluirFinaisPendentesTecnico(c) {
  let atual = c;
  for (const f of c?.tecnico?.finaisPendentes || []) atual = resolverFinalTecnico(atual, f.nome, 'controlar');
  return atual;
}

/** Convite para comandar a seleção na Copa do Mundo, entre uma temporada e outra. */
export function responderConviteSelecaoTecnico(c, aceitar, opcoes = {}) {
  const t = c?.tecnico, conv = t?.conviteSelecao;
  if (!conv || conv.status !== 'pendente' || t.fase !== 'resultado') return c;
  if (!aceitar) return { ...c, tecnico: { ...t, conviteSelecao: { ...conv, status: 'recusado' } } };
  const proposta = SELECOES_TECNICO.find(x=>x.nac===conv.nac);
  if (!proposta) return {...c,tecnico:{...t,conviteSelecao:null}};
  return aceitarPropostaTecnico({...c,tecnico:{...t,propostas:[...(t.propostas||[]),proposta]}},proposta.nome);
}
function finalizarTemporadaTecnico(c, andamento, rng = sorteio) {
  const t = c.tecnico;
  const { vitorias, empates, derrotas, pontos } = andamento;
  const classificacao = andamento.classificacao || tabelaClassificacaoTecnico(t, andamento);
  const ligaAtual = t.liga || CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga;
  const classificacoesMundo = classificacoesMundoDaTemporada(t, ligaAtual, classificacao, rng);
  const progressaoMundo = atualizarLigasMundoDaTemporada(t, ligaAtual, classificacoesMundo);
  const posicao = classificacao.find(x => x.meuClube)?.posicao || 18;
  const campeao = posicao === 1;
  const objetivo = objetivoTecnico(t);
  const idoloEmCasa = !!vinculoAtivoTecnico(t,t.clube)?.idolatria;
  const cumpriuObjetivo = posicao <= objetivo.posicao;
  const promessaDescumprida = !!(t.promessaContrato?.clube === t.clube && posicao > t.promessaContrato.posicaoMaxima);
  const novaConfianca = limitar(andamento.diretoria + (cumpriuObjetivo ? 8 : -14) + (posicao <= 4 ? 5 : posicao >= 15 ? -8 : 0)
    + (idoloEmCasa && !cumpriuObjetivo ? -4 : 0) - (promessaDescumprida ? 12 : 0), 0, 100);
  const novaTorcida = limitar(andamento.torcida + (campeao ? 18 : posicao <= 4 ? 10 : cumpriuObjetivo ? 5 : posicao >= 17 ? -23 : -12)
    + (idoloEmCasa && !cumpriuObjetivo ? -9 : idoloEmCasa && cumpriuObjetivo ? 4 : 0) - (promessaDescumprida ? 7 : 0), 0, 100);
  const demitido = novaConfianca < 20 || (novaConfianca < 40 && novaTorcida < 35) ||
    riscoDemissaoTecnico({ ...t, diretoria: novaConfianca, torcida: novaTorcida }).pressao >= 82;
  const temporada = { ano: t.ano, clube: t.clube, objetivo: objetivo.nome, cumpriuObjetivo,
    promessaDescumprida, idoloEmCasa, estilo: t.estilo, formacao: perfilTaticoTecnico(t).formacao, decisoes: t.decisoes,
    jogos: vitorias + empates + derrotas, vitorias, empates, derrotas, pontos, posicao, campeao, classificacao, classificacoesMundo,
    ...(progressaoMundo.movimentos.length ? { movimentosMundo: progressaoMundo.movimentos } : {}),
    confrontos: andamento.confrontos || [], avaliacoes: andamento.avaliacoes };
  temporada.demitido = demitido;
  const proximo = { ...t, idade:idadeAtualTecnico(c)+1, carteiraTecnico:creditarSalarioTecnico(t,t.ano,t.salario??salarioTecnico(t)), ano: t.ano + 1, fase: 'resultado', andamento: null,
    ligasMundo: progressaoMundo.ligasMundo,
    temporadas: [...t.temporadas, temporada], reuniaoPendente: false, vitorias: t.vitorias + vitorias,
    empates: t.empates + empates, derrotas: t.derrotas + derrotas,
    titulos: t.titulos + (campeao ? 1 : 0), demitido, promessaContrato: null,
    objetivoAtual: objetivo.nome, diretoria: novaConfianca, torcida: novaTorcida,
    reputacao: limitar(t.reputacao + (campeao ? 9 : posicao <= 4 ? 5 : posicao >= 15 ? -5 : 1), 10, 99) };
  proximo.propostasCoerentesVersao=3;
  proximo.propostas = gerarPropostasTecnico({ ...proximo, clube: demitido ? null : t.clube,clubeReferencia:t.clube }, rng);
  return registrarHistoriaTecnico({ ...c, idade: idadeAtualTecnico(c) + 1, ano: c.ano + 1, tecnico: proximo });
}
export function proximaTemporadaTecnico(c) {
  if(c?.tecnico?.copasEmJogo)throw new Error('Conclua as copas antes de avançar.');
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Nenhum resultado pendente.');
  c = concluirFinaisPendentesTecnico(c);
  c=structuredClone(c);
  const t = c.tecnico;
  const ultima=t.temporadas?.at(-1);if(ultima&&ultima.tipoEquipe!=='selecao')registrarAnoHistoria(c,{...ultima});
  if (t.demitido || t.desempregado) throw new Error('Aceite uma proposta antes de começar a próxima temporada.');
  if(carreiraTecnicoEncerrada(t,idadeAtualTecnico(c)))throw new Error('Carreira de treinador encerrada aos 85 anos ou por aposentadoria.');
  const historicoCartas = [...(t.historicoCartas || []), ...(t.cartas || [])].slice(-32);
  const vencidos = (t.efeitosPendentes || []).filter(e => e.aplicarEm <= t.ano&&(!e.clube||e.clube===t.clube));
  const pendentes = (t.efeitosPendentes || []).filter(e => e.aplicarEm > t.ano);
  const soma = (atributo) => vencidos.reduce((acc, e) => acc + (e.heranca?.[atributo] || 0), 0);
  // Os bônus de uma temporada não se acumulam para sempre: a força volta para perto
  // da base do clube (35% do ganho fica, de −6 a +8) e diretoria, torcida e moral
  // esquecem parte do passado — o título de ontem não garante o emprego amanhã.
  const base = (t.tipoEquipe === 'selecao' ? SELECOES_TECNICO.find(x=>x.nac===t.selecao) : CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube))?.elenco ?? t.elenco ?? 50;
  const herdado = limitar(Math.round(((t.elenco ?? base) - base) * 0.3), -6, 5);
  const proximo = { ...t, ...(t.modoTreinadorRapido?{verbaRapida:renovarVerbaPretemporada(t)}:{}), historicoCartas, decisoes: [], andamento: null, reuniaoPendente: false, fase: 'pretemporada', ultimaNegociacao: null,
    efeitosPendentes: pendentes, efeitosRecebidos: vencidos, ajusteTurno: null, paradasTemporada: [], conviteSelecao: null,
    elenco: limitar(base + herdado + soma('elenco'), 10, 99),
    moral: limitar(Math.round(55 + ((t.moral ?? 50) - 55) * 0.7) + 2 + soma('moral'), 10, 95),
    diretoria: limitar(Math.round(60 + ((t.diretoria ?? 60) - 60) * 0.75) + soma('diretoria'), 0, 100),
    torcida: limitar(Math.round(55 + ((t.torcida ?? 55) - 55) * 0.85) + Math.round(soma('torcida') * 0.5), 0, 100) };
  // Os jogadores fictícios contratados envelhecem, evoluem, são vendidos ou se aposentam.
  const ano = t.tipoEquipe === 'selecao' ? {personagens:[],noticias:[]} : evoluirPersonagensTecnico(proximo);
  proximo.personagens = ano.personagens;
  proximo.noticiasElenco = ano.noticias;
  if (ano.bonusForca) proximo.elenco = limitar(proximo.elenco + ano.bonusForca, 10, 99);
  if (ano.verba && proximo.verbaRapida != null) proximo.verbaRapida += ano.verba;
  return { ...c, tecnico: { ...proximo, cartas: sortearCartasTecnico(proximo) } };
}

/** Escolha interna imparcial para eventos não exibidos no fluxo expresso. */
export function escolherOpcaoAutomaticaTecnico(opcoes, rng = sorteio) {
  if (!Array.isArray(opcoes) || opcoes.length === 0) throw new Error('Evento sem alternativas.');
  const valor = rng();
  const indice = Math.min(opcoes.length - 1, Math.max(0, Math.floor(valor * opcoes.length)));
  return opcoes[indice].id;
}

/** Fluxo expresso sem decisões de pré-temporada. Mantém saves antigos compatíveis. */
export function escolherPretemporadaRapidaTecnico(c,chave,opcaoId,rng=sorteio,opcoes={}){
 if(!c?.tecnico||c.tecnico.fase!=='pretemporada'||carreiraTecnicoEncerrada(c.tecnico))return c;
 const atual=aplicarPretemporadaRapida(c,chave,opcaoId,1);
 if(atual===c)return c;
 const plano=planoPretemporadaRapida(atual.tecnico,1);
 return plano.respostas.length===plano.cartas.length?jogarTemporadaExpressaTecnico(atual,null,rng,opcoes):atual;
}
export function jogarTemporadaExpressaTecnico(c, opcaoId, rng = sorteio, opcoes = {}) {
  if (!c?.tecnico || c.tecnico.fase !== 'pretemporada') throw new Error('Temporada indisponível.');
  if (carreiraTecnicoEncerrada(c.tecnico)) throw new Error('Carreira de treinador encerrada.');
  if (c.tecnico.temporadas.length === 0 && !c.tecnico.clubeInicialEscolhido && c.tecnico.opcoesInicio?.length) throw new Error('Escolha o clube inicial.');
  let atual = c;
  // No ritmo intenso, uma decisão visível pode influenciar cada temporada.
  // As etapas restantes são administrativas e resolvidas pela comissão.
  if (opcaoId != null) {
    const carta = cartaAtualTecnico(atual.tecnico);
    if (!carta) throw new Error('Não há decisão disponível nesta temporada.');
    atual = tomarDecisaoTecnico(atual, opcaoId, rng);
  }
  const feitas = atual.tecnico.decisoes || [];
  if (feitas.length < QUANTIDADE_DECISOES_TECNICO) {
    const restantes = Array.from({ length: QUANTIDADE_DECISOES_TECNICO - feitas.length }, () => ({
      carta: 'simulacao_expressa', opcao: 'neutra', nome: 'Comissão técnica',
      resultado: 'Etapa administrativa resolvida pela comissão.',
      riscoAtivado: false
    }));
    atual = { ...atual, tecnico: { ...atual.tecnico, decisoes: [...feitas, ...restantes] } };
  }
  // Saves antigos com rodadas em andamento são concluídos sem reiniciar resultados.
  if (atual.tecnico.andamento?.rodadas || atual.tecnico.andamento?.jogos) {
    while (atual.tecnico.fase === 'pretemporada') {
      if (atual.tecnico.reuniaoPendente) atual = reuniaoEmergenciaTecnico(atual, 'responsabilidade', rng);
      atual = simularEtapaTecnico(atual, rng);
    }
    return atual;
  }
  return simularTemporadaTecnico(atual, rng, opcoes);
}

export function comprarMelhoriaTecnico(c,id){
 if(!c?.tecnico)throw new Error('Carreira de treinador indisponível.');
 return comprarItemLojaTecnico(c,id,calcularOvrTecnico(c.tecnico),forcaClubeTecnico(c.tecnico));
}

/** Escolhas de copa só atualizam a campanha guardada; nunca simulam outra liga. */
export function resolverCopaEscolhaTecnico(c,chave,opcao){
 const novo=aplicarCopaTecnico(c,chave,opcao);if(novo===c)return c;
 if(!novo.tecnico.copasEmJogo){novo.tecnico=comMetas({...novo.tecnico,propostas:gerarPropostasTecnico(novo.tecnico,geradorTecnico(`${novo.tecnico.ano}|${novo.tecnico.clube}|copas-encerradas`))});}
 return registrarHistoriaTecnico(novo);
}
