import {CLUBES} from '../dados/data.js';
import {avaliarClubeNoMundo,setorJogador} from './forcaEquipe.js';
const chave=id=>String(id);
const idMundo=j=>j.mundoId??j.id;
export const metadadosGestao=g=>{const {elenco,mercado,...meta}=g;return meta;};
const ativos=(mundo,clube)=>mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===clube);
const financeiro=p=>({contrato:Number.isInteger(p.contrato)?p.contrato:2+(String(p.id).length%3),salario:p.salario??Math.max(3,Math.round(p.ovr**2/220)),valor:p.valor??Math.max(100,Math.round(p.ovr**3/180*(p.idade<24?1.2:p.idade>30?.7:1)))});
export function jogadorDaGestao(p,anterior){return {...p,id:anterior?.id??p.idLegadoGestao??p.id,mundoId:p.id,setor:setorJogador(p),qualidade:p.ovr,...financeiro(p),origem:p.origem||'elenco'};}
export function mercadoDoMundo(mundo,g){
 const usados=new Set(g.movimentos.filter(m=>m.ano===g.ano&&['compra','venda'].includes(m.tipo)).map(m=>chave(m.mundoId??m.jogador)));
 return ['GOL','DEF','MEI','ATA'].flatMap(setor=>mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome!==g.clube&&setorJogador(p)===setor&&!usados.has(chave(p.id))).sort((a,b)=>Math.abs(a.ovr-g.forcaMercado)-Math.abs(b.ovr-g.forcaMercado)||chave(a.id).localeCompare(chave(b.id))).slice(0,3).map(p=>({...jogadorDaGestao(p),clubeVendedor:p.clubeNome||null,valor:p.clubeNome?financeiro(p).valor:financeiro(p).salario*2,origem:'mercado'})));
}
/** Migração explícita: o elenco administrado prevalece; atletas do cadastro antigo
 * permanecem disponíveis, com suas identidades e histórias, sem inventar vendas. */
export function conectarElencoMundo(c,g,{legado=false}={}){
 if(!c.mundo?.jogadores)return {...c,tecnico:{...c.tecnico,gestao:g}};
 let mundo={...c.mundo,jogadores:c.mundo.jogadores.map(({qualidade,mundoId,...p})=>({...p,...financeiro(p)})),cadastroElencos:1};
 if(!g.cadastroUnificado&&legado){
  const importados=g.elenco.map(j=>({...j,idLegadoGestao:j.id,id:j.mundoId??`gestao:${g.clube}:${g.ano}:${j.id}`,ovr:j.qualidade,posicao:j.posicao||({GOL:'GOL',DEF:'ZAG',MEI:'MC',ATA:'ATA'}[j.setor]),nac:j.nac||'BRA',clubeNome:g.clube,clubeOrigem:g.clube,liga:c.tecnico.liga||CLUBES.find(p=>p.nome===g.clube)?.liga,picoIdade:28,aposentado:false,carreira:{jogos:0,gols:0,assist:0,temporadas:0},...j.carreira&&{carreira:j.carreira}}));
  for(const p of importados)delete p.qualidade;
  const ids=new Set(importados.map(p=>chave(p.id)));
  mundo.jogadores=mundo.jogadores.filter(p=>!ids.has(chave(p.id))).map(p=>p.clubeNome===g.clube&&!p.aposentado?{...p,clubeNome:null,contrato:0,migracaoCadastro:{ano:g.ano,clube:g.clube}}:p).concat(importados);
  g={...g,elenco:g.elenco.map((j,i)=>({...j,mundoId:importados[i].id}))};
 }
 const anteriores=new Map(g.elenco.filter(j=>j.mundoId!==undefined).map(j=>[chave(j.mundoId),j]));
 g={...g,cadastroUnificado:1,elenco:ativos(mundo,g.clube).map(p=>jogadorDaGestao(p,anteriores.get(chave(p.id))))};
 g.mercado=mercadoDoMundo(mundo,g);
 mundo.gestoesClubes={...mundo.gestoesClubes,[g.clube]:metadadosGestao(g)};
 return {...c,mundo,tecnico:{...c.tecnico,gestao:g}};
}
export function destinoDaVenda(c,j){
 const g=c.tecnico.gestao,ocupacao=new Map();for(const p of c.mundo.jogadores)if(!p.aposentado&&p.clubeNome)ocupacao.set(p.clubeNome,(ocupacao.get(p.clubeNome)||0)+1);
 const destino=CLUBES.filter(cl=>cl.nome!==g.clube&&(ocupacao.get(cl.nome)||0)<30&&(c.tecnico.universo?.clubes?.[cl.nome]?.financas??50)>15&&(c.mundo.gestoesClubes?.[cl.nome]?.saldo??(Math.round((cl.forca-25)**2*8)+(c.mundo.receitasMercado?.[cl.nome]||0)))>=Math.round(j.valor*.8)).sort((a,b)=>Math.abs(a.forca-j.qualidade)-Math.abs(b.forca-j.qualidade)||a.nome.localeCompare(b.nome))[0];
 if(!destino)throw new Error('Nenhum clube pode receber este jogador nesta janela.');return {...destino,liga:c.tecnico.ligasMundo?.[destino.nome]||destino.liga};
}
/** Uma negociação altera o mesmo atleta, sem recriá-lo nem perder estatísticas. */
export function aplicarNegociacaoMundo(c,g,{tipo,alvo,destino}={}){
 if(!g.cadastroUnificado)return {...c,tecnico:{...c.tecnico,gestao:g}};
 const clube=g.clube,ano=g.ano,id=alvo&&idMundo(alvo),venda=tipo==='venda';
 const elenco=new Map(g.elenco.map(j=>[chave(idMundo(j)),j]));
 let encontrado=!alvo;
 const jogadores=c.mundo.jogadores.map(p=>{
  const j=elenco.get(chave(p.id));let novo=j?{...p,ovr:j.qualidade,idade:j.idade,contrato:j.contrato,salario:j.salario,valor:j.valor,clubeNome:clube,liga:c.tecnico.liga||p.liga}:p;
  if(alvo&&chave(p.id)===chave(id)){
   encontrado=true;const para=venda?destino.nome:clube;
   const movimento={ano,tipo,de:p.clubeNome||null,para,valor:venda?Math.round(alvo.valor*.8):tipo==='compra'?alvo.valor:0};
   novo={...novo,clubeNome:para,liga:venda?destino.liga:(c.tecnico.liga||CLUBES.find(cl=>cl.nome===clube)?.liga),contrato:tipo==='renovacao'?3:tipo==='compra'||venda?3:novo.contrato,movimentos:[...(p.movimentos||[]),movimento]};
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
