import {NACIONALIDADES} from '../dados/data.js';
import {consultarRecordesFutebol} from './recordesFutebol.js';

const nomePais=id=>NACIONALIDADES.find(n=>n.id===id||n.label===id)?.label||id||null;
const deduplicar=lista=>[...new Map(lista.filter(x=>x?.nome).map(x=>[x.tipo+'|'+x.nome,x])).values()];
/** Escopo pequeno: clube do usuario e competicoes em que participou.
 * Outros clubes sao calculados sob demanda no Arquivo Vivo. */
export function escoposRecordesDaTemporada(c={},a={}){
 const clube=a.clube?.nome||a.clube||a.clubeNome;
 const pais=a.tipoEquipe==='selecao'?clube:nomePais(c.nac||c.nacionalidade);
 const comp=[a.ligaNome,...(a.porCompeticao||[]).filter(x=>(x.jogos||0)>0).sort((x,y)=>(y.jogos||0)-(x.jogos||0)).map(x=>x.nome)];
 if(a.selecao?.convocado)comp.push(a.selecao.nome||a.selecao.competicao);
 return deduplicar([
  ...(clube&&a.tipoEquipe!=='selecao'?[{tipo:'clube',nome:clube}]:[]),
  ...(pais?[{tipo:'selecao',nome:pais}]:[]),
  ...comp.filter(Boolean).map(nome=>({tipo:'competicao',nome}))
 ]).slice(0,8);
}
const prioridade=e=>(e.historico?100:0)+(e.atletaId==='voce'?25:0)+
  (['golsCarreira','golsTemporada','jogosCarreira','golsAtletaPartida'].includes(e.metrica)?10:0);
/** Compara dois snapshots do mesmo save sem mutacao. Sem baseline no save nao
 * produz noticias, exceto ao igualar ou superar marca real verificavel. */
export function detectarQuebrasRecordesFutebol(antes={},depois={},{
 ano,escopos=[],temporadasAntes=antes.temporadas||[],
 temporadasDepois=depois.temporadas||[],limite=6
}={}){
 if(!Number.isFinite(ano)||!Array.isArray(escopos))return [];
 const candidatos=[];
 for(const {tipo,nome} of deduplicar(escopos)){
  const anterior=consultarRecordesFutebol(antes,tipo,nome,temporadasAntes);
  const atual=consultarRecordesFutebol(depois,tipo,nome,temporadasDepois);
  const antigos=new Map(anterior.recordes.map(r=>[r.id,r]));
  for(const r of atual.recordes){
   const novo=r.simulado,velho=antigos.get(r.id)?.simulado;
   if(!novo||!Number.isFinite(novo.valor)||novo.valor<=0||novo.ano!==ano)continue;
   // Um recorte documental nao autoriza manchete de recorde mundial quebrado.
   const real=r.real?.cobertura==='recorte'?null:r.real;
   const superouReal=!!real&&novo.valor>real.valor&&(velho?.valor??0)<=real.valor;
   const igualouReal=!!real&&novo.valor===real.valor&&(velho?.valor??0)<real.valor;
   const superouSave=!!velho&&novo.valor>velho.valor;
   if(!superouReal&&!igualouReal&&!superouSave)continue;
   const historico=superouReal||igualouReal;
   const tipoMarca=superouReal?'superou':igualouReal?'igualou':'quebrou';
   const protagonista=novo.atleta||((r.categoria==='Partidas'||r.categoria==='Sequências')?nome:'Um atleta');
   const titulo=historico?
    protagonista+' '+tipoMarca+' recorde histórico de '+r.rotulo.toLowerCase():
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
