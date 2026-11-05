import React,{useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import Icone from './Icone.jsx';
import {CATALOGO_LOJA_JOGADOR,formatarValor} from './rapido.js';
import {impedimentoLojaJogador,upsAtivosJogador,upJogadorDe} from './lojaJogador.js';
import {bloquearRolagem} from './bloqueioRolagem.js';
import './LojaJogador.css';

const categorias=['Todos','UPs temporários','Treino','Saúde','Carreira','Estilo de vida','Meus itens'];
const normalizar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
function rotuloBloqueio(motivo){
 if(motivo==='Saldo insuficiente')return 'Sem saldo';
 if(motivo==='Exclusivo para goleiros')return 'Para goleiros';
 if(motivo==='Exclusivo para jogadores de linha')return 'Para linha';
 if(motivo==='Limite de 3 UPs ativos')return 'Limite de UPs';
 if(motivo==='Já há um UP deste tipo ativo')return 'UP já ativo';
 if(motivo==='Compre entre temporadas')return 'Entre temporadas';
 return motivo;
}
export default function LojaJogador({c,etapa,onComprar,onFechar}){
 const [categoria,setCategoria]=useState('Todos'),[busca,setBusca]=useState(''),[aviso,setAviso]=useState(null),[ultimaCompra,setUltimaCompra]=useState(null);
 const painel=useRef(null),fechar=useRef(onFechar),origem=useRef(document.activeElement),titulo=useId();fechar.current=onFechar;
 const entreTemporadas=['evento','negociacao','resumo','coletiva','traco'].includes(etapa),ativos=upsAtivosJogador(c);
 useEffect(()=>{
  const liberar=bloquearRolagem(document.body);
  painel.current?.querySelector('button')?.focus();
  const teclado=e=>{
   if(e.key==='Escape')fechar.current();
   if(e.key!=='Tab')return;
   const botoes=[...painel.current.querySelectorAll('button:not(:disabled),input')];
   const primeiro=botoes[0],ultimo=botoes.at(-1);
   if(!botoes.includes(document.activeElement)){e.preventDefault();primeiro?.focus();}
   else if(e.shiftKey&&document.activeElement===primeiro){e.preventDefault();ultimo?.focus();}
   else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primeiro?.focus();}
  };
  document.addEventListener('keydown',teclado);
  return()=>{liberar();document.removeEventListener('keydown',teclado);origem.current?.focus({preventScroll:true});};
 },[]);
 const ativo=i=>ativos.find(x=>x.id===i.id);
 const comprado=i=>i.temporario?!!ativo(i):(c.investimentos||[]).includes(i.id);
 const impedimento=i=>impedimentoLojaJogador(c,i,!entreTemporadas);
 const lista=CATALOGO_LOJA_JOGADOR.filter(i=>(categoria==='Todos'||categoria==='Meus itens'&&comprado(i)||i.categoria===categoria)&&normalizar(`${i.nome} ${i.desc}`).includes(normalizar(busca)));
 const comprar=i=>{
  try{
   onComprar(i.id);
   setUltimaCompra(i.id);
   setAviso({texto:i.temporario?`${i.nome} ativado por ${i.duracao} ${i.duracao===1?'temporada':'temporadas'}.`:`${i.nome} adquirido.`,erro:false});
  }catch(e){setAviso({texto:e.message,erro:true});}
 };
 return createPortal(<div className="lj-overlay" onClick={onFechar}>
  <section className="lj" role="dialog" aria-modal="true" aria-labelledby={titulo} ref={painel} onClick={e=>e.stopPropagation()}>
   <header className="lj-header"><h2 id={titulo}>Loja do jogador</h2><div className="lj-wallet"><span>Seu saldo</span><strong key={c.patrimonio}>{formatarValor(c.patrimonio||0)}</strong></div><button onClick={onFechar} aria-label="Fechar loja">×</button></header>
   <div className="lj-filtros">
    <label><span className="sr-only">Buscar melhoria</span><input type="search" placeholder="O que você quer melhorar?" value={busca} onChange={e=>setBusca(e.target.value)}/></label>
    <div className="lj-categorias" aria-label="Categorias da loja">{categorias.map(nome=><button key={nome} aria-pressed={categoria===nome} onClick={()=>setCategoria(nome)}>{nome}</button>)}</div>
    <div className="lj-resumo"><span>UPs ativos <b>{ativos.length}/3</b></span><span>{lista.length} {lista.length===1?'opção':'opções'}</span></div>
    <p role="status" className={`lj-feedback ${aviso?.erro?'lj-feedback-erro':''}`} title={aviso?.texto}>{aviso?.texto||''}</p>
   </div>
   <div className="lj-content">
    {!entreTemporadas&&<p className="lj-aviso">As compras abrem entre temporadas.</p>}
    <div className="lj-grid">{lista.map(i=>{
     const tem=comprado(i),motivo=impedimento(i),duracao=ativo(i),adquirido=tem?(i.temporario?'Ativo':'Adquirido'):null;
     const tempo=duracao?`${duracao.fim-c.ano} ${duracao.fim-c.ano===1?'temporada restante':'temporadas restantes'}`:i.temporario?`${i.duracao} ${i.duracao===1?'temporada':'temporadas'}`:'Permanente';
     return <article key={i.id} className={`${tem?'lj-item-adquirido':''} ${ultimaCompra===i.id?'lj-item-novo':''}`}>
      <span className="lj-icone" aria-hidden="true"><Icone e={i.icone} size={24}/></span>
      <div className="lj-info"><h3>{i.nome}</h3><p>{i.desc}</p><span className={`lj-duracao ${i.temporario?'lj-temporario':''}`}>{tempo}</span>{i.luxo&&<small>Manutenção {formatarValor(Math.round(i.custo*.06))}/ano</small>}</div>
      <button className="lj-comprar" disabled={!!motivo} onClick={()=>comprar(i)} title={motivo||`Comprar ${i.nome}`} aria-label={tem?`${adquirido}: ${i.nome}`:motivo?`${motivo}: ${i.nome}`:`Comprar ${i.nome} por ${formatarValor(i.custo)}`}>
       {tem?<><span aria-hidden="true">✓</span><span>{adquirido}</span></>:<><span>{motivo?rotuloBloqueio(motivo):'Comprar'}</span><strong>{formatarValor(i.custo)}</strong></>}
      </button>
     </article>;
    })}</div>
    {!lista.length&&<p className="lj-vazio">Nenhum item encontrado. Tente outra categoria ou busca.</p>}
   </div>
   <footer className="lj-footer">Compra direta · até 3 UPs ativos · duração em temporadas</footer>
  </section>
 </div>,document.body);
}
