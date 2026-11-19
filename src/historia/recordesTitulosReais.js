/**
 * Recordistas de títulos a partir de campeões reais JÁ DOCUMENTADOS no jogo.
 * Não preenche temporadas ausentes, não soma competições distintas e nunca
 * altera estatísticas do universo simulado. Fontes ficam nos dados de origem.
 */
import {HISTORICO_LIGAS} from '../dados/ligasHistoricas.js';
import {HISTORICO_COPAS_NACIONAIS} from '../dados/copasNacionaisHistoricas.js';
import {HISTORICO_SELECOES} from '../dados/selecoesHistoricas.js';
import {HISTORICO_LIBERTADORES} from '../dados/libertadoresHistorica.js';
import {HISTORICO_CHAMPIONS} from '../dados/championsHistorica.js';
import {HISTORICO_EUROPA_LEAGUE} from '../dados/europaLeagueHistorica.js';
import {HISTORICO_CONFERENCE} from '../dados/conferenceHistorica.js';
import {HISTORICO_SULAMERICANA} from '../dados/sulamericanaHistorica.js';
import {HISTORICO_COPA_BRASIL} from '../dados/copaBrasilHistorica.js';
import {HISTORICO_ESTADUAIS,edicoesEstaduaisHistoricas} from '../dados/estaduaisHistoricos.js';

const normalizar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const alias={uefachampionsleague:'championsleague',ligadoscampeoes:'championsleague',
 copalibertadores:'libertadores',uefaeuropaleague:'europaleague',
 uefaconferenceleague:'conferenceleague',uefaeuropaconferenceleague:'conferenceleague',
 copasulamericana:'sulamericana',copadobrasil:'copabrasil',
 copadomundofifa:'copadomundo',fifaworldcup:'copadomundo'};
const chave=nome=>alias[normalizar(nome)]||normalizar(nome);
const FONTES_SELECOES={
 copadomundo:'https://www.fifa.com/en/tournaments/mens/worldcup/articles/world-cup-champions-1982-2026-italy-argentina-germany-brazil-france-spain',
 eurocopa:'https://www.uefa.com/uefaeuro/history/winners/',
 copaamerica:'https://copaamerica.com/pt/noticias/todas-as-edicoes-conmebol-copa-america-campeoes-sedes-melhores-jogadores',
 copaafricanadenacoes:'https://www.cafonline.com/afcon2025/news/before-morocco-2025-the-champions-who-built-afcon-s-legacy/',
 copadaasia:'https://www.the-afc.com/en/national/afc_asian_cup/news/the_continents_pride_and_joy%C2%A0.html',
 copaouro:'https://www.concacaf.com/news/jimenez-y-alvarez-guian-a-mexico-a-su-decimo-titulo-de-copa-oro'
};
const REFERENCIAS_CONTINENTAIS=[
 ['Libertadores',HISTORICO_LIBERTADORES,'https://cdn.conmebol.com/wp-content/uploads/2025/12/CL-2026-Manual-de-Clubes-POR-2.pdf'],
 ['Champions League',HISTORICO_CHAMPIONS,'https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--all-time-european-cup-honours-board/'],
 ['Europa League',HISTORICO_EUROPA_LEAGUE,'https://www.uefa.com/uefaeuropaleague/history/winners/'],
 ['Conference League',HISTORICO_CONFERENCE,'https://www.uefa.com/uefaconferenceleague/news/02a5-20ba66bce46d-a5d5586eeda6-1000--which-teams-have-won-the-conference-league/'],
 ['Copa Sul-Americana',HISTORICO_SULAMERICANA,'https://www.conmebol.com/sudamericana/'],
 ['Copa do Brasil',HISTORICO_COPA_BRASIL,'https://www.cbf.com.br/']
];
function entradasHistoricas(){
 const entradas=[
  ...Object.values(HISTORICO_LIGAS).map(r=>({...r})),
  ...Object.values(HISTORICO_COPAS_NACIONAIS).map(r=>({...r})),
  ...Object.entries(HISTORICO_SELECOES).map(([nome,edicoes])=>({
    nome,edicoes,fonte:FONTES_SELECOES[chave(nome)]||null,cobertura:'completa'})),
  ...REFERENCIAS_CONTINENTAIS.map(([nome,edicoes,fonte])=>({
    nome,edicoes,fonte,cobertura:'completa'})),
  ...Object.values(HISTORICO_ESTADUAIS).map(r=>({
    nome:r.nome,edicoes:edicoesEstaduaisHistoricas(r.nome),
    fonte:r.fontes?.[1]||r.fontes?.[0]||null,cobertura:'recorte'}))
 ];
 const resultado=new Map();
 for(const entrada of entradas){
  const id=chave(entrada.nome);
  // O acervo continental completo prevalece sobre eventual amostra de copa.
  if(!resultado.has(id)||resultado.get(id).cobertura==='recorte'&&entrada.cobertura==='completa')
   resultado.set(id,entrada);
 }
 return resultado;
}
const HISTORICOS=entradasHistoricas();
const comparar=(a,b)=>b.valor-a.valor||a.atleta.localeCompare(b.atleta,'pt-BR');
/** Mostra líderes apenas no recorte efetivamente documentado; cobertura
 * parcial nunca e tratada como recorde oficial absoluto. */
export function recordesReaisTitulosCompeticao(tipo,nome){
 if(tipo!=='competicao')return [];
 const registro=HISTORICOS.get(chave(nome));
 if(!registro?.edicoes?.length||!registro.fonte)return [];
 const contagens=new Map(),ordem=[...registro.edicoes].sort((a,b)=>a.ano-b.ano||String(a.edicao||'').localeCompare(String(b.edicao||'')));
 let sequencia=0,ultimaEquipe=null,maxSequencia=null;
 for(const edicao of ordem){
  const campeoes=edicao.campeoes||[];
  for(const item of campeoes){
   if(!item?.clube)continue;
   const quantidade=Number.isInteger(item.quantidade)&&item.quantidade>0?item.quantidade:1;
   const id=normalizar(item.clube);
   const anterior=contagens.get(id)||{atleta:item.clube,valor:0,ano:edicao.ano};
   contagens.set(id,{...anterior,valor:anterior.valor+quantidade,ano:edicao.ano});
  }
  // Empates no título ou duas edições no mesmo ano não são convertidos em
  // uma série artificial. Para séries, uma edição precisa ter um campeão só.
  const campeao=campeoes.length===1?campeoes[0]?.clube:null;
  if(!campeao){ultimaEquipe=null;sequencia=0;continue;}
  sequencia=ultimaEquipe===normalizar(campeao)?sequencia+1:1;
  ultimaEquipe=normalizar(campeao);
  if(sequencia>=2&&(!maxSequencia||sequencia>maxSequencia.valor))
   maxSequencia={atleta:campeao,valor:sequencia,ano:edicao.ano};
 }
 const primeiro=ordem[0]?.ano,ultimo=ordem.at(-1)?.ano;
 const base={tipo,nome,fonte:registro.fonte,data:'Acervo '+primeiro+'–'+ultimo,
  cobertura:registro.cobertura==='completa'?'completa':'recorte',
  observacao:registro.observacao||registro.nota||''};
 const maior=[...contagens.values()].sort(comparar)[0];
 return [
  ...(maior?[{...base,id:'titulosTotal',...maior,equipe:maior.atleta}]:[]),
  ...(maxSequencia?[{...base,id:'titulosConsecutivos',...maxSequencia,equipe:maxSequencia.atleta}]:[])
 ];
}
