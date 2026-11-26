import React,{useEffect,useMemo,useRef,useState} from 'react';
import {bandeiraDe} from '../comum/arte.js';
import {grupoSelecao} from './elencoSelecao.js';
import {roteiroConvocacao} from './convocacaoCinema.js';
import personagem from '../../arte/jornada/convocacao-personagem.webp';
import './ConvocacaoSelecaoCinema.css';

const PALETAS={
 BRA:['#e9ce58','#26945b'],ARG:['#8ed4ef','#eef6fb'],FRA:['#3972d2','#e9ebf7'],
 ENG:['#d14556','#eef2fa'],ESP:['#c84447','#e7bd4a'],POR:['#b12e3d','#2ca177'],
 ALE:['#ecce63','#e8e9ed'],ITA:['#368d62','#ebf2e9'],URU:['#99d4f2','#e3effa'],
 HOL:['#e67e39','#fcf0d7'],BEL:['#f0cb58','#c34b4b'],CRO:['#dd4650','#f6f6f1'],
 EUA:['#c64d61','#ecf0f5'],MEX:['#3d9464','#f0f4ec'],JAP:['#dc5260','#eaeaea']
};
const GRUPOS={GOL:'Goleiros',DEF:'Defensores',MEI:'Meio-campistas',ATA:'Atacantes'};
const TITULOS=['A transmissão começou','O técnico abre o envelope','A lista avança por posições','Falta a última vaga','O resultado está definido','Uma noite inesquecível'];
const TEMPOS=[1000,2300,3500,4800,5950];


export default function ConvocacaoSelecaoCinema({jogador,copa,resultado,revelado=false,onRevelar}){
 const [fase,S]=useState(revelado?5:0);
 const finalizado=useRef(!!revelado),callback=useRef(onRevelar);
 useEffect(()=>{callback.current=onRevelar;},[onRevelar]);
 const venceu=!!resultado?.venceu;
 const nacionalidade=copa?.nac||jogador?.nac||'';
 const nomePais=copa?.label||'Seleção nacional';
 const bandeira=bandeiraDe(nacionalidade);
 const [corA,corB]=PALETAS[nacionalidade]||['#d6b968','#587aa0'];
 const lista=useMemo(()=>roteiroConvocacao(copa?.elenco,jogador,venceu),[copa?.elenco,jogador?.nome,jogador?.posicao,venceu]);
 const passo=revelado?5:fase;
 const nomes=passo===0?[]:passo>=5?lista.anunciados:passo===4?lista.iniciais:lista.iniciais.slice(0,passo);
 const revelacao=passo>=4;
 const status=passo===5?(venceu?'convocado':'fora'):'aguardando';
 const grupo=GRUPOS[grupoSelecao(jogador?.posicao||'ATA')]||'Atletas';
 useEffect(()=>{
  if(revelado){S(5);return undefined;}
  if(typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
   S(5);
   if(!finalizado.current){finalizado.current=true;callback.current?.();}
   return undefined;
  }
  const listaTimers=TEMPOS.map((ms,i)=>setTimeout(()=>S(i+1),ms));
  const concluido=setTimeout(()=>{
   S(5);
   if(!finalizado.current){finalizado.current=true;callback.current?.();}
  },7400);
  return()=>{listaTimers.forEach(clearTimeout);clearTimeout(concluido);};
 },[revelado]);
 return <section className={'cs-cinema cs-'+status} style={{'--cs-cor':corA,'--cs-cor2':corB}}
  aria-label={'Convocação da '+nomePais} data-convocacao-cinema="" data-fase={passo} data-resultado={status}>
  <header className="cs-cabecalho">
   <span className="cs-marca">A JOIA <small>CARREIRA INTERNACIONAL</small></span>
   <div className="cs-selecao">{bandeira&&<img src={bandeira} alt="" draggable="false"/>}<span><small>SELEÇÃO NACIONAL</small><b>{nomePais}</b></span></div>
   <span className="cs-edicao">{copa?.nome||'Copa do Mundo'} <b>{copa?.ano}</b></span>
  </header>
  <div className="cs-visor" data-cena={passo<5?'espera':venceu?'estadio':'tunel'}>
   <div className="cs-cenario" aria-hidden="true"/>
   <div className="cs-personagem" aria-hidden="true" style={{backgroundImage:`url(${personagem})`}}/>
   {passo<=3&&<div className="cs-tv" data-canal="selecao">
    <div className="cs-tv-federacao">{bandeira&&<img src={bandeira} alt=""/>}<div><small>AO VIVO · FEDERAÇÃO NACIONAL</small><b>{nomePais}</b></div></div>
    {passo<=1?
     <div className="cs-tv-boletim"><span>CONVOCAÇÃO OFICIAL</span><strong>{copa?.nome||'Copa do Mundo'}</strong><small>O selecionador anuncia os convocados</small></div>
     :<div className="cs-tv-lista"><strong>{grupo.toUpperCase()}</strong><ul>{nomes.map((p,i)=><li key={p.id||p.nome||i}><em>{p.posicao}</em>{p.nome}</li>)}</ul><span>{passo===3?'ÚLTIMA VAGA...':'LISTA EM ANDAMENTO'}</span></div>}
   </div>}
   <div className="cs-iluminacao" aria-hidden="true"/>
   {passo===5&&venceu&&<div className="cs-confetes" aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{'--x':(i*47%97)+'%','--d':(i%7*.11)+'s'}}/>)}</div>}
   {revelacao&&<div className={'cs-banner '+(venceu?'cs-banner-vitoria':'cs-banner-tristeza')} role="status">
    <small>{venceu?'ÚLTIMO NOME ANUNCIADO':'LISTA FINAL ENCERRADA'}</small>
    <strong>{passo===4?'...':venceu?'CONVOCADO!':'FORA DA LISTA'}</strong>
    {passo===5&&<span>{venceu?jogador?.nome||'Você':'O técnico escolheu outros nomes'}</span>}
   </div>}
  </div>
  <div className="cs-faixa-status">
   <div className="cs-etapa"><span>{String(passo+1).padStart(2,'0')} / 06</span><strong>{passo===5?(venceu?'Seu sonho foi realizado':'O sonho fica para a próxima'):TITULOS[passo]}</strong></div>
   <div className="cs-progresso" aria-hidden="true">{Array.from({length:6},(_,i)=><i key={i} className={i<=passo?'cs-ativo':''}/>)}</div>
  </div>
  <div className="cs-legenda" aria-live="polite">
   {passo>=5
    ?<p>{resultado?.texto||(venceu?'Seu nome está entre os convocados.':'Seu nome não apareceu na lista final.')}</p>
    :<p>{passo===0?'Você espera pela transmissão. Uma Copa do Mundo pode mudar tudo.':passo===1?'O técnico começa a leitura dos nomes.':passo===2?'Os nomes surgem no telão. A expectativa aumenta.':passo===3?'As últimas vagas estão sendo anunciadas.':'O silêncio antes do resultado.'}</p>}
  </div>
 </section>;
}
