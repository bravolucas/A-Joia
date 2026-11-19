import {CLUBES} from '../dados/data.js';
import {avaliarClubeNoMundo,setorJogador} from './forcaEquipe.js';
import {diagnosticarElenco,normalizarPosicao} from './profundidadeElenco.js';
const chave=id=>String(id);
const idMundo=j=>j.mundoId??j.id;
export const metadadosGestao=g=>{const {elenco,mercado,...meta}=g;return meta;};
const ativos=(mundo,clube)=>mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===clube);
const financeiro=p=>({contrato:Number.isInteger(p.contrato)?p.contrato:2+(String(p.id).length%3),salario:p.salario??Math.max(3,Math.round(p.ovr**2/220)),valor:p.valor??Math.max(100,Math.round(p.ovr**3/180*(p.idade<24?1.2:p.idade>30?.7:1)))});
export function jogadorDaGestao(p,anterior){return {...p,id:anterior?.id??p.idLegadoGestao??p.id,mundoId:p.id,setor:setorJogador(p),qualidade:p.ovr,...financeiro(p),origem:p.origem||'elenco'};}
export function mercadoDoMundo(mundo,g){
 const usados=new Set(g.movimentos.filter(m=>m.ano===g.ano&&['compra','venda'].includes(m.tipo)).map(m=>chave(m.mundoId??m.jogador)));
 return ['GOL','DEF','MEI','ATA'].flatMap(setor=>mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome!==g.clube&&setorJogador(p)===setor&&!usados.has(chave(p.id))).sort((a,b)=>Math.abs(a.ovr-g.forcaMercado)-Math.abs(b.ovr-g.forcaMercado)||chave(a.id).localeCompare(chave(b.id))).slice(0,3).map(p=>({...jogadorDaGestao(p),id:p.id,clubeVendedor:p.clubeNome||null,valor:p.clubeNome?financeiro(p).valor:financeiro(p).salario*2,origem:'mercado'})));
}
/** Migração explícita: o elenco administrado prevalece; atletas do cadastro antigo
 * permanecem disponíveis, com suas identidades e histórias, sem inventar vendas. */
export function conectarElencoMundo(c,g,{legado=false}={}){
 if(!c.mundo?.jogadores)return {...c,tecnico:{...c.tecnico,gestao:g}};
 let mundo={...c.mundo,jogadores:c.mundo.jogadores.map(({qualidade,mundoId,...p})=>({...p,...financeiro(p)})),cadastroElencos:1};
 if(!g.cadastroUnificado&&legado){
  // Legados sem nacionalidade não viram brasileiros por ausência de dados.
  // O campo desconhecido permanece null, sem alterar atletas já importados.
  const importados=g.elenco.map(j=>({...j,idLegadoGestao:j.id,id:j.mundoId??`gestao:${g.clube}:${g.ano}:${j.id}`,ovr:j.qualidade,posicao:j.posicao||({GOL:'GOL',DEF:'ZAG',MEI:'MC',ATA:'ATA'}[j.setor]),nac:j.nac||null,clubeNome:g.clube,clubeOrigem:g.clube,liga:c.tecnico.liga||CLUBES.find(p=>p.nome===g.clube)?.liga,picoIdade:28,aposentado:false,carreira:{jogos:0,gols:0,assist:0,temporadas:0},...j.carreira&&{carreira:j.carreira}}));
  for(const p of importados)delete p.qualidade;
  const ids=new Set(importados.map(p=>chave(p.id)));
  mundo.jogadores=mundo.jogadores.filter(p=>!ids.has(chave(p.id))).map(p=>p.clubeNome===g.clube&&!p.aposentado?{...p,clubeNome:null,contrato:0,migracaoCadastro:{ano:g.ano,clube:g.clube}}:p).concat(importados);
  g={...g,elenco:g.elenco.map((j,i)=>({...j,mundoId:importados[i].id}))};
 }
 const anteriores=new Map(g.elenco.filter(j=>j.mundoId!==undefined).map(j=>[chave(j.mundoId),j]));
 g={...g,cadastroUnificado:1,elenco:ativos(mundo,g.clube).map(p=>jogadorDaGestao(p,anteriores.get(chave(p.id))))};
 g.mercado=mercadoDoMundo(mundo,g);
 mundo.gestoesClubes={...mundo.gestoesClubes,[g.clube]:metadadosGestao(g)};
 const forcasMundo={...c.tecnico.forcasMundo};
 if(!Object.keys(forcasMundo).length)for(const cl of CLUBES)forcasMundo[cl.nome]=avaliarClubeNoMundo({...c,mundo},cl).forca;
 const clube=CLUBES.find(cl=>cl.nome===g.clube)||{nome:g.clube,forca:g.forcaMercado};forcasMundo[g.clube]=avaliarClubeNoMundo({...c,mundo},clube).forca;
 return {...c,mundo,tecnico:{...c.tecnico,gestao:g,forcasMundo}};
}
/**
 * A IA aceita compras quando há orçamento e espaço, ou quando consegue
 * liberar excedentes sem prejudicar a cobertura mínima por posição.
 * Não elimina jogadores do cadastro: excedentes viram agentes livres.
 */
export function destinoDaVenda(c,j){
 const g=c.tecnico.gestao,porClube=new Map(),preco=Math.round(j.valor*.8);
 const qualidade=Number.isFinite(j.qualidade)?j.qualidade:j.ovr;
 for(const p of c.mundo.jogadores){
  if(p.aposentado||!p.clubeNome)continue;
  if(!porClube.has(p.clubeNome))porClube.set(p.clubeNome,[]);
  porClube.get(p.clubeNome).push(p);
 }
 const posicao=normalizarPosicao(j.posicao);
 const candidatos=CLUBES.flatMap(cl=>{
  if(cl.nome===g.clube)return [];
  const perfil=c.tecnico.universo?.clubes?.[cl.nome]||c.universo?.clubes?.[cl.nome];
  if((perfil?.financas??50)<=15)return [];
  const saldoSalvo=c.mundo.gestoesClubes?.[cl.nome]?.saldo;
  const saldo=Number.isFinite(saldoSalvo)?saldoSalvo:
   Math.max(0,Math.round((cl.forca-25)**2*8)+(c.mundo.receitasMercado?.[cl.nome]||0));
  if(saldo<preco)return [];
  const elenco=porClube.get(cl.nome)||[];
  const necessidades=diagnosticarElenco(elenco,{contarSecundarias:true});
  const dispensarIds=[],reserva=[...elenco];
  const chegada={...j,posicao:j.posicao,aposentado:false,clubeNome:cl.nome};
  // Saves antigos podem ter clubes acima do limite: abrem quantas vagas
  // forem necessárias, sem perder cobertura e sem remover identidades.
  while(reserva.length>=30){
   const excedente=reserva
    .filter(p=>(p.ovr??0)<=qualidade+5)
    .sort((a,b)=>(a.ovr??0)-(b.ovr??0)||String(a.id).localeCompare(String(b.id)))
    .find(p=>diagnosticarElenco([...reserva.filter(outro=>outro!==p),chegada],
      {contarSecundarias:true}).totalFaltante<=necessidades.totalFaltante);
   if(!excedente)return [];
   dispensarIds.push(excedente.id);
   reserva.splice(reserva.indexOf(excedente),1);
  }
  const carencia=posicao?(necessidades.faltantes[posicao]||0):0;
  const afinidade=Math.abs(cl.forca-qualidade);
  const prioridade=carencia*100+Math.max(0,26-elenco.length)*2-afinidade*3-dispensarIds.length*9;
  return [{cl,prioridade,dispensarIds}];
 }).sort((a,b)=>b.prioridade-a.prioridade||a.cl.nome.localeCompare(b.cl.nome));
 const escolhido=candidatos[0];
 if(!escolhido)throw new Error('Nenhum clube apresentou proposta viável nesta janela.');
 return {...escolhido.cl,liga:c.tecnico.ligasMundo?.[escolhido.cl.nome]||escolhido.cl.liga,
  dispensarIds:escolhido.dispensarIds};
}
/** Uma negociação altera o mesmo atleta, sem recriá-lo nem perder estatísticas. */
export function aplicarNegociacaoMundo(c,g,{tipo,alvo,destino}={}){
 if(!g.cadastroUnificado)return {...c,tecnico:{...c.tecnico,gestao:g}};
 const clube=g.clube,ano=g.ano,id=alvo&&idMundo(alvo),venda=tipo==='venda';
 const elenco=new Map(g.elenco.map(j=>[chave(idMundo(j)),j]));
 let encontrado=!alvo;
 const jogadores=c.mundo.jogadores.map(p=>{
  const j=elenco.get(chave(p.id));let novo=j?{...p,ovr:j.qualidade,idade:j.idade,contrato:j.contrato,salario:j.salario,valor:j.valor,clubeNome:clube,liga:c.tecnico.liga||p.liga}:p;
  if(venda&&destino?.dispensarIds?.some(x=>chave(x)===chave(p.id))&&p.clubeNome===destino.nome){
   novo={...novo,clubeNome:null,contrato:0,
    movimentos:[...(p.movimentos||[]),{ano,tipo:'dispensa',de:destino.nome,para:null,valor:0}]};
  }
  if(alvo&&chave(p.id)===chave(id)){
   encontrado=true;const para=venda?destino.nome:clube;
   const movimento={ano,tipo,de:p.clubeNome||null,para,valor:venda?Math.round(alvo.valor*.8):tipo==='compra'?alvo.valor:0};
   novo={...novo,clubeNome:para,liga:venda?destino.liga:(c.tecnico.liga||CLUBES.find(cl=>cl.nome===clube)?.liga),contrato:tipo==='renovacao'?novo.contrato:tipo==='compra'||venda?3:novo.contrato,movimentos:[...(p.movimentos||[]),movimento]};
  }
  return novo;
 });
 if(!encontrado)throw new Error('O jogador não está mais disponível no cadastro do mundo.');
 const mundo={...c.mundo,jogadores,gestoesClubes:{...c.mundo.gestoesClubes},receitasMercado:{...c.mundo.receitasMercado}};
 if(alvo&&['compra','venda'].includes(tipo)){
  const original=c.mundo.jogadores.find(p=>chave(p.id)===chave(id)),outro=venda?destino.nome:original.clubeNome;
  const quantia=venda?-Math.round(alvo.valor*.8):alvo.valor;
  if(outro){if(mundo.gestoesClubes[outro])mundo.gestoesClubes[outro]={...mundo.gestoesClubes[outro],saldo:mundo.gestoesClubes[outro].saldo+quantia};else mundo.receitasMercado[outro]=(mundo.receitasMercado[outro]||0)+quantia;}
 }
 g={...g,mercado:mercadoDoMundo(mundo,g)};
 mundo.gestoesClubes[g.clube]=metadadosGestao(g);
 const forcasMundo={...c.tecnico.forcasMundo};
 for(const nome of new Set([clube,destino?.nome,alvo?.clubeVendedor].filter(Boolean))){const cl=CLUBES.find(p=>p.nome===nome);if(cl)forcasMundo[nome]=avaliarClubeNoMundo({...c,mundo},cl).forca;}
 return atualizarProjecaoGestao({...c,mundo,tecnico:{...c.tecnico,gestao:g,forcasMundo}});
}
export function atualizarProjecaoGestao(c){
 const t=c.tecnico,g=t?.gestao;if(!g?.cadastroUnificado||!c.mundo?.jogadores)return c;
 // Uma gestão de um emprego anterior não pode sobrescrever o novo clube.
 if(g.clube!==t.clube)return c;
 const antigos=new Map(g.elenco.map(j=>[chave(idMundo(j)),j]));
 const gestao={...g,elenco:ativos(c.mundo,g.clube).map(p=>jogadorDaGestao(p,antigos.get(chave(p.id))))};
 gestao.mercado=mercadoDoMundo(c.mundo,gestao);
 return {...c,tecnico:{...t,gestao}};
}
