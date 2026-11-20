import {NACIONALIDADES} from '../dados/data.js';
import {consultarRecordesFutebol,prepararIndiceAtletasRecordes} from './recordesFutebol.js';

const nomePais=id=>NACIONALIDADES.find(n=>n.id===id||n.label===id)?.label||id||null;
const deduplicar=lista=>[...new Map(lista.filter(x=>x?.nome).map(x=>[x.tipo+'|'+x.nome,x])).values()];
/** Escopo pequeno: clube do usuario e competicoes em que participou.
 * Outros clubes sao calculados sob demanda no Arquivo Vivo. */
export function escoposRecordesDaTemporada(c={},a={}){
 const clube=a.clube?.nome||a.clube||a.clubeNome;
 const pais=a.tipoEquipe==='selecao'?clube:nomePais(c.nac||c.nacionalidade);
 const comp=[a.ligaNome,
  ...(a.porCompeticao||[]).filter(x=>(x.jogos||0)>0)
   .sort((x,y)=>(y.jogos||0)-(x.jogos||0)).map(x=>x.nome),
  // O Modo Treinador registra copas em torneios, nao em porCompeticao.
  ...(a.torneios||[]).filter(x=>x?.nome&&(x.faseUsuario||x.jogosUsuario?.length||x.campeao===clube))
   .map(x=>x.nome)];
 if(a.selecao?.convocado)comp.push(a.selecao.nome||a.selecao.competicao);
 return deduplicar([
  ...(clube&&a.tipoEquipe!=='selecao'?[{tipo:'clube',nome:clube}]:[]),
  ...(c.tecnico&&(c.nome||c.tecnico.nome)
    ?[{tipo:'treinador',nome:c.nome||c.tecnico.nome}]:[]),
  ...(pais?[{tipo:'selecao',nome:pais}]:[]),
  ...(a.torneios||[]).filter(x=>x?.selecao&&
   (x.faseUsuario||x.jogosUsuario?.length||x.campeao===x.selecao))
   .map(x=>({tipo:'selecao',nome:x.selecao})),
  ...comp.filter(Boolean).map(nome=>({tipo:'competicao',nome}))
 ]).slice(0,8);
}
const prioridade=e=>(e.historico?100:0)+(e.atletaId==='voce'?25:0)+
  (['golsCarreira','golsTemporada','jogosCarreira','golsAtletaPartida'].includes(e.metrica)?10:0)+
  (['tecnicoVitorias','tecnicoTitulos'].includes(e.metrica)?35:
   ['tecnicoJogos','tecnicoVitoriasAno','tecnicoAproveitamento'].includes(e.metrica)?20:0);
/** Acumulados do mesmo recordista crescem naturalmente a cada ano.
 * Anunciar apenas marcos relevantes, mudanças de líder ou superação real. */
const MARCOS_ACUMULADOS={
 jogosCarreira:[50,100,200,500,750,1000],golsCarreira:[25,50,100,200,300,500,1000],
 assistCarreira:[25,50,100,200,300],defesasCarreira:[50,100,200,500,1000],
 semSofrerCarreira:[25,50,100,200,500],titulosTotal:[2,5,10,20,30],
 vicesTotal:[2,5,10,20],tecnicoJogos:[50,100,200,500,1000],
 tecnicoVitorias:[25,50,100,200,500],tecnicoPontos:[100,250,500,1000,2000],
 tecnicoTemporadas:[5,10,20,30],tecnicoTitulos:[2,5,10,20],
 tecnicoAcessos:[2,5,10],tecnicoMetas:[5,10,20,30],
 tecnicoRebaixamentos:[],tecnicoDemissoes:[],tecnicoAproveitamento:[]
};
const identidade=r=>r?.atletaId!=null?String(r.atletaId):String(r?.atleta||'');
const marcoCruzado=(id,antes,depois)=>[...(MARCOS_ACUMULADOS[id]||[])]
 .filter(n=>antes<n&&depois>=n).at(-1)||null;
/** Compara dois snapshots do mesmo save sem mutacao. Sem baseline no save nao
 * produz noticias, exceto ao igualar ou superar marca real verificavel. */
export function detectarQuebrasRecordesFutebol(antes={},depois={},{
 ano,escopos=[],temporadasAntes=antes.temporadas||[],
 temporadasDepois=depois.temporadas||[],limite=6
}={}){
 if(!Number.isFinite(ano)||!Array.isArray(escopos))return [];
 const candidatos=[],unicos=deduplicar(escopos);
 const indiceAntes=prepararIndiceAtletasRecordes(antes,unicos);
 const indiceDepois=prepararIndiceAtletasRecordes(depois,unicos);
 for(const {tipo,nome} of unicos){
  const anterior=consultarRecordesFutebol(antes,tipo,nome,temporadasAntes,indiceAntes);
  const atual=consultarRecordesFutebol(depois,tipo,nome,temporadasDepois,indiceDepois);
  const antigos=new Map(anterior.recordes.map(r=>[r.id,r]));
  for(const r of atual.recordes){
   const novo=r.simulado,velho=antigos.get(r.id)?.simulado;
   if(!novo||!Number.isFinite(novo.valor)||novo.valor<=0||novo.ano!==ano)continue;
   // Um recorte documental nao autoriza manchete de recorde mundial quebrado.
   const real=r.real?.cobertura==='recorte'?null:r.real;
   const superouReal=!!real&&novo.valor>real.valor&&(velho?.valor??0)<=real.valor;
   const igualouReal=!!real&&novo.valor===real.valor&&(velho?.valor??0)<real.valor;
   const superouSave=!!velho&&novo.valor>velho.valor;
   const mesmoRecordista=!!velho&&identidade(novo)===identidade(velho);
   const marco=superouSave&&mesmoRecordista
    ?marcoCruzado(r.id,velho.valor,novo.valor):null;
   if(!superouReal&&!igualouReal&&(!superouSave||
     (mesmoRecordista&&Object.hasOwn(MARCOS_ACUMULADOS,r.id)&&!marco)))continue;
   const historico=superouReal||igualouReal;
   const tipoMarca=superouReal?'superou':igualouReal?'igualou':'quebrou';
   const protagonista=novo.atleta||((r.categoria==='Partidas'||r.categoria==='Sequências')?nome:'Um atleta');
   const titulo=historico?
    protagonista+' '+tipoMarca+' recorde histórico de '+r.rotulo.toLowerCase():
    marco?protagonista+' alcança marco de '+marco+' em '+r.rotulo.toLowerCase()+' · '+nome:
    'Novo recorde de '+r.rotulo.toLowerCase()+' em '+nome;
   const anteriorValor=historico?real.valor:velho.valor;
   const detalhe=protagonista+': '+novo.valor+' ('+nome+', '+ano+'). '+
    (historico?'Referência real: '+real.atleta+', '+real.valor+'.':
     'Marca anterior do save: '+(velho.atleta||'atleta')+', '+velho.valor+'.');
   candidatos.push({
    id:[ano,tipo,nome,r.id,novo.atletaId||novo.atleta||'registro'].join('|'),
    ano,tipo,entidade:nome,metrica:r.id,rotulo:r.rotulo,
    atleta:novo.atleta||protagonista,atletaId:novo.atletaId||null,
    valor:novo.valor,anterior:anteriorValor,anteriorAtleta:historico?real.atleta:velho.atleta,
    ...(marco&&!historico?{marco}:{}),
    historico,igualou:igualouReal,fonte:historico?real.fonte:null,
    titulo,detalhe,prioridade:prioridade({historico,atletaId:novo.atletaId,metrica:r.id})
   });
  }
 }
 const ids=new Set();
 return candidatos.sort((a,b)=>b.prioridade-a.prioridade||a.id.localeCompare(b.id)).filter(e=>{
  if(ids.has(e.id))return false;ids.add(e.id);return true;
 }).slice(0,Math.max(0,limite));
}
export function guardarQuebrasRecordesFutebol(depois,novos=[]){
 const anteriores=depois.recordesEventos||[],ids=new Set(anteriores.map(e=>e.id));
 const adicionados=novos.filter(e=>e?.id&&!ids.has(e.id));
 return {...depois,recordesEventos:[...anteriores,...adicionados].slice(-80)};
}
