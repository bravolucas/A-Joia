import React,{useEffect,useId,useRef} from 'react';
import {createPortal} from 'react-dom';
import atlas from '../../arte/colecoes/apresentacoes-oficiais.webp';
import {escudoDe} from './arte.js';
import {PadraoCamisa} from './VisualFutebol.jsx';
import {uniformeDe,tintaUniforme} from '../dados/uniformes.js';
import {bloquearRolagem} from './bloqueioRolagem.js';
import './ApresentacaoOficial.css';
const TEMAS=[{id:'imprensa',nome:'A primeira foto oficial',texto:'Os flashes registram o começo deste capítulo.'},{id:'estadio',nome:'O estádio recebe você',texto:'Uma nova camisa diante de milhares de sonhos.'},{id:'noite',nome:'Uma noite para guardar',texto:'A torcida faz da chegada uma celebração.'},{id:'ct',nome:'O primeiro dia em casa',texto:'Da porta do CT ao seu novo vestiário.'}];
const hash=s=>[...String(s)].reduce((n,l)=>(Math.imul(n,31)+l.charCodeAt(0))>>>0,7);
export function temaApresentacao({clube,nome,idade,fama=0,cena}){if(cena)return Math.max(0,TEMAS.findIndex(t=>t.id===cena));const n=hash(clube?.nome+nome);if((clube?.forca||0)>=85||fama>=75)return n%2?1:2;if(idade<=19&&fama<40)return 3;return n%3===0?3:0;}
const dinheiro=n=>!n?'Sem custo':`€ ${n>=1000?(n/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mi':Math.round(n).toLocaleString('pt-BR')+' mil'}`;
export function CenaApresentacao({clube,nome,numero,indice=0}){
 const id=useId().replace(/:/g,''),u=uniformeDe(clube?.nome,clube?.cor),tinta=tintaUniforme(u),sob=String(nome||'').trim().split(/\s+/).at(-1).toUpperCase();
 return <svg className="ao-fotografia" viewBox="0 0 1000 500" role="img" aria-label={`Jogador e dirigente seguram a camisa ${numero} de ${nome}`} data-cenario={TEMAS[indice].id}>
 <defs><clipPath id={`ao-foto-${id}`}><rect width="1000" height="500"/></clipPath><clipPath id={`ao-tecido-${id}`}><path d="M402 201 450 189Q507 199 563 189L612 202 657 310 627 330 610 303 613 491H409L407 304 378 330 354 310Z"/></clipPath></defs>
 <image href={atlas} x={-(indice%2)*1000} y={-Math.floor(indice/2)*500} width="2000" height="1000" clipPath={`url(#ao-foto-${id})`} preserveAspectRatio="none"/>
 <g clipPath={`url(#ao-tecido-${id})`} style={{mixBlendMode:'multiply'}}><rect width="1000" height="500" fill={u.base}/><g transform="translate(350 180)"><PadraoCamisa u={u} width={310} height={320}/></g></g>
 <g className="ao-estampa" fill={tinta} stroke={tinta==='#19232b'?'#fff9':'#18201b99'} paintOrder="stroke" textAnchor="middle"><text x="509" y="272" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="23" textLength={Math.min(178,sob.length*17)} lengthAdjust="spacingAndGlyphs" strokeWidth="1">{sob}</text><text x="509" y="411" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="125" strokeWidth="2">{numero}</text></g>
 </svg>;
}
export default function ApresentacaoOficial(props){
 const {clube,nome,numero,idade,posicao,contrato,valor,deOnde,onConcluir}=props,indice=temaApresentacao(props),tema=TEMAS[indice],ref=useRef(null),fim=useRef(onConcluir);fim.current=onConcluir;
 useEffect(()=>{const anterior=document.activeElement,liberar=bloquearRolagem(document.body);ref.current?.querySelector('button')?.focus();const teclado=e=>{if(e.key==='Escape')fim.current?.();if(e.key==='Tab'){const bs=[...ref.current.querySelectorAll('button')],primeiro=bs[0],ultimo=bs.at(-1);if(e.shiftKey&&document.activeElement===primeiro){e.preventDefault();ultimo.focus();}else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primeiro.focus();}}};document.addEventListener('keydown',teclado);return()=>{liberar();document.removeEventListener('keydown',teclado);anterior?.focus({preventScroll:true});};},[]);
 return createPortal(<div className="ao-overlay apresentacao-grande" role="dialog" aria-modal="true" aria-label={`Apresentação no ${clube?.nome}`} ref={ref}><section className={`ao ao-${tema.id}`}><header><span>UMA NOVA HISTÓRIA</span><button onClick={onConcluir} aria-label="Pular apresentação">Pular →</button></header><div className="ao-palco"><CenaApresentacao clube={clube} nome={nome} numero={numero} indice={indice}/><span className="ao-ao-vivo">● APRESENTAÇÃO OFICIAL</span>{[0,1,2].map(i=><i key={i} className="ao-flash" style={{animationDelay:`${.8+i*.6}s`}}/>)}</div><div className="ao-legenda"><small>{tema.nome}</small><h2>{escudoDe(clube?.nome)&&<img src={escudoDe(clube.nome)} alt=""/>}{clube?.nome}</h2><h3>{nome} <span>#{numero}</span></h3><p>{posicao} · {idade} anos{deOnde?.nome?` · chega do ${deOnde.nome}`:''}</p><div className="ao-termos"><span>Transferência<b>{dinheiro(valor)}</b></span><span>Contrato<b>{contrato?.anos||1} temporada(s)</b></span><span>Salário/ano<b>{dinheiro(contrato?.salario)}</b></span></div><p className="ao-frase">{tema.texto}</p><button className="ao-continuar" onClick={onConcluir}>Vestir a camisa →</button></div></section></div>,document.body);
}
