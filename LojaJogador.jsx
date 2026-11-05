import React,{useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import Icone from './Icone.jsx';
import {ARTE} from './arte.js';
import vestiarioLoja from './arte/loja/vestiario-premium.webp';
import {CATALOGO_LOJA_JOGADOR,formatarValor} from './rapido.js';
import {impedimentoLojaJogador,upsAtivosJogador,upJogadorDe} from './lojaJogador.js';
import {bloquearRolagem} from './bloqueioRolagem.js';
import './LojaJogador.css';

const categorias=['Todos','UPs temporários','Treino','Saúde','Carreira','Estilo de vida','Meus itens'];
const normalizar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const beneficios={psicologo:'+3 mental/ano · quedas pela metade',personal:'20% menos risco de lesão',nutri:'12% menos declínio',fisio:'Trata lesão crônica · −10% risco',imagem:'+3 fama por ano',analista:'+0,08 na nota média',ct:'+8% na evolução',instituto:'+2 torcida/ano · legado social',origem:'+20 torcida no clube de origem',carro:'+4 fama',mansao:'+6 fama',iate:'+8 fama',equipamento:'+3% na evolução',finalizador:'+4% nos gols',criador:'+5% nas assistências','treino-goleiro':'Até +2 p.p. em defesas','bola-parada-pro':'Mais precisão em pênaltis e faltas','recuperacao-pro':'5% menos risco de lesão','media-training':'+1 fama e mental por ano','projeto-social':'+1 torcida/ano · legado social'};
function fotoItem(i){
 if(i.id==='psicologo'||i.id==='up-cabeca')return ARTE.vestiario;
 if(i.id==='carro')return ARTE.carro;
 if(i.id==='mansao'||i.id==='iate')return ARTE.mansao;
 if(i.categoria==='Saúde'||/fisio|fisico|recuperacao|cabeca/.test(i.id))return ARTE.fisio;
 if(i.categoria==='Carreira'||/vitrine/.test(i.id))return ARTE.coletiva;
 if(/social|origem|instituto/.test(i.id))return ARTE.torcida;
 return ARTE.treino;
}
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
   <header className="lj-header" style={{'--lj-hero':`url(${vestiarioLoja})`}}><div className="lj-identidade"><span className="lj-eyebrow">A JOIA / PERFORMANCE CLUB</span><h2 id={titulo}>Loja do jogador</h2><p>Seu talento. Seu próximo nível.</p></div><div className="lj-wallet"><span>Seu saldo</span><strong key={c.patrimonio}>{formatarValor(c.patrimonio||0)}</strong></div><button onClick={onFechar} aria-label="Fechar loja">×</button></header>
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
      <div className="lj-arte" aria-hidden="true"><img src={fotoItem(i)} alt="" loading="lazy"/><span className="lj-icone"><Icone e={i.icone} size={22}/></span></div>
      <div className="lj-info"><span className="lj-tipo">{i.temporario?'IMPULSO':i.categoria}</span><h3>{i.nome}</h3><p title={i.desc}>{beneficios[i.id]||i.desc}</p><span className={`lj-duracao ${i.temporario?'lj-temporario':''}`}>{tempo}</span>{i.luxo&&<small>Manutenção {formatarValor(Math.round(i.custo*.06))}/ano</small>}</div>
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
