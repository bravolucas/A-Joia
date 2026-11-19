import React,{useEffect,useMemo,useRef,useState} from 'react';
import {bandeiraDe} from '../comum/arte.js';
import {grupoSelecao} from './elencoSelecao.js';
import {roteiroConvocacao} from './convocacaoCinema.js';
import './ConvocacaoCinematografica.css';

const PALETAS={
 BRA:['#e8c74f','#1f8c61'],ARG:['#9eddfa','#eef4ff'],FRA:['#446ddd','#edecf4'],
 ENG:['#d54c5c','#f1f1f1'],ESP:['#d54846','#e6b43e'],POR:['#a83b49','#399578'],
 ALE:['#d4b45c','#e5e5e5'],ITA:['#4eae7a','#e8e8e8'],URU:['#7cc9ef','#eaf6ff'],
 HOL:['#e77e39','#f2f0e7'],BEL:['#efca56','#cb4044'],CRO:['#db4d61','#f8f8f5'],
 EUA:['#e54a58','#efefff'],MEX:['#4da27d','#f7f5ee'],JAP:['#dd4e65','#f5f5f4'],
 COL:['#ecd152','#3f67b9'],CHI:['#d85a61','#edf0f7'],SUI:['#c74f54','#f4f4f4']
};
const rotuloGrupo=p=>({GOL:'GOLEIROS',DEF:'DEFENSORES',MEI:'MEIO-CAMPISTAS',ATA:'ATACANTES'})[grupoSelecao(p)]||'CONVOCADOS';
const legendaEtapa=['A transmissão vai começar.','O selecionador inicia a leitura.','Novos nomes aparecem na lista.','A coletiva segue em silêncio.','As últimas vagas estão sendo anunciadas.'];
const DURACOES=[1100,2250,3350,4550,6250];

/**
 * Reproduz apenas a APRESENTAÇÃO de um resultado persistido (r.venceu).
 * Nenhum efeito esportivo ou financeiro é calculado nesta cena.
 */
export default function ConvocacaoCinematografica({jogador,copa,resultado,revelado=false,onRevelar}){
 const [fase,setFase]=useState(revelado?5:0);
 const callback=useRef(onRevelar);
 useEffect(()=>{callback.current=onRevelar;},[onRevelar]);
 const venc=!!resultado?.venceu;
 const nomeSelecao=copa?.label||'Seleção nacional';
 const nac=copa?.nac||jogador?.nac;
 const flag=bandeiraDe(nac);
 const paleta=PALETAS[nac]||['#d4b768','#4f769f'];
 const roteiro=useMemo(()=>roteiroConvocacao(copa?.elenco,jogador,venc),[copa?.elenco,jogador?.nome,jogador?.posicao,venc]);
 const passo=revelado?5:fase;
 const anunciados=passo===0?[]:passo===5?roteiro.anunciados:roteiro.anteriores.slice(0,passo);
 const atual=anunciados.at(-1);
 const grupo=atual?rotuloGrupo(atual.posicao):'LISTA FINAL';
 useEffect(()=>{
  if(revelado){setFase(5);return undefined;}
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
   setFase(5);callback.current?.();return undefined;
  }
  const t=DURACOES.map((ms,i)=>setTimeout(()=>{
   setFase(i+1);
   if(i===DURACOES.length-1)callback.current?.();
  },ms));
  return()=>t.forEach(clearTimeout);
 },[revelado]);
 const cor=passo===5?(venc?'positiva':'negativa'):'expectativa';
 const placar=!passo?'Em instantes':passo<5&&atual?atual.nome:passo===5&&venc?jogador?.nome:passo===5?'Lista encerrada':'Aguardando a lista';
 const fala=passo<5?(atual?grupo+': '+atual.nome:legendaEtapa[0]):venc?'E, para a última vaga... '+jogador?.nome+'!':'Esses são os convocados para a competição.';
 return <div className={'cc-raiz cc-resultado-'+cor} style={{'--cc-principal':paleta[0],'--cc-secundaria':paleta[1]}}
   data-cena-convocacao="" data-etapa={passo} data-convocado={passo===5?String(venc):'pendente'}
   aria-label={'Cerimônia oficial de convocação da '+nomeSelecao}>
  <header className="cc-abertura">
   <div className="cc-abertura-identidade">
    {flag?<img src={flag} alt={'Bandeira de '+nomeSelecao}/>:<span aria-hidden="true">🌍</span>}
    <span><small>CONVOCAÇÃO OFICIAL</small><strong>{nomeSelecao}</strong></span>
   </div>
   <div className="cc-abertura-copa"><small>SELEÇÃO NACIONAL</small><strong>{copa?.nome||'Copa do Mundo'} · {copa?.ano}</strong></div>
  </header>
  <div className="cc-cenario">
   <div className="cc-luzes" aria-hidden="true"><i/><i/><i/></div>
   <div className="cc-faixas" aria-hidden="true">
    <span>{flag?<img src={flag} alt=""/>:'✦'}</span>
    <span>{nomeSelecao}</span>
    <span>{copa?.ano}</span>
   </div>
   <div className="cc-tela">
    <div className="cc-tela-topo">{flag&&<img src={flag} alt=""/>}<div><small>FEDERAÇÃO NACIONAL</small><strong>{nomeSelecao}</strong></div></div>
    <div className="cc-tela-corpo" aria-live="off">
     <span>{passo===5&&!venc?'ANÚNCIO CONCLUÍDO':passo===5?'O ÚLTIMO NOME':'JOGADORES CONVOCADOS'}</span>
     <strong key={passo} className={passo===5?'cc-nome-final':'cc-nome-corrente'}>{placar}</strong>
     <small>{passo===5?(venc?'SEU NOME FOI ANUNCIADO':'SEU NOME NÃO FOI ANUNCIADO'):grupo}</small>
    </div>
    <div className="cc-tela-rodape"><i/><span>LISTA OFICIAL · {copa?.ano}</span><i/></div>
   </div>
   <div className="cc-tecnico" aria-label="Técnico lendo os nomes diante da imprensa">
    <svg viewBox="0 0 280 245" aria-hidden="true" focusable="false">
     <path d="M55 228 Q56 157 98 151 L120 144 161 145 191 160 Q217 186 217 228Z" fill="#242f43"/>
     <path d="M117 144 L139 221 162 144 152 133 129 132Z" fill="#f3ece3"/>
     <path d="M135 145 L145 145 152 222 139 230 129 221Z" fill="#735d7c"/>
     <path d="M110 157 L131 190 119 211 92 157 M170 157 L151 190 162 211 189 158" stroke="#69728b" strokeWidth="5" fill="none"/>
     <ellipse cx="140" cy="107" rx="40" ry="49" fill="#c99b7f"/>
     <path d="M98 99 Q94 50 141 49 Q182 50 181 99 L167 86 143 78 111 83Z" fill="#687380"/>
     <path d="M118 111 h14 m21 0 h13" stroke="#26323c" strokeWidth="4" strokeLinecap="round"/>
     <path d="M134 132 q9 7 18 0" stroke="#7d4d4a" strokeWidth="3" strokeLinecap="round" fill="none" className="cc-boca"/>
     <path d="M0 204 H280 V245 H0Z" fill="#17243a" stroke="#bca36c" strokeWidth="2"/>
     <path d="M65 198 Q75 185 110 191 L128 205 H88Z" fill="#bd8a73"/>
     <rect x="164" y="180" width="59" height="31" rx="3" fill="#ece5d2" transform="rotate(-8 164 180)"/>
     <path d="M202 198 L220 150 M219 149 L228 144" stroke="#778a9d" strokeWidth="4" strokeLinecap="round"/>
     <rect x="212" y="142" width="19" height="8" rx="4" fill="#2e3544"/>
    </svg>
    <span>SELECIONADOR</span>
   </div>
   <div className="cc-atleta" aria-hidden="true">
    <svg viewBox="0 0 240 265" focusable="false">
     <defs><linearGradient id="cc-camisa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#384c65"/><stop offset="1" stopColor="#111c30"/></linearGradient></defs>
     <path d="M12 265 Q20 192 64 168 L118 166 172 169 Q223 195 231 265Z" fill="url(#cc-camisa)"/>
     <path d="M78 169 L112 193 145 171" fill="none" stroke="var(--cc-principal)" strokeWidth="6"/>
     <path d="M99 169 L102 146 144 144 148 171" fill="#946b52"/>
     <ellipse cx="122" cy="99" rx="50" ry="61" fill="#ac7d62"/>
     <path d="M70 112 Q58 35 120 33 Q178 36 174 104 L160 82 Q132 60 76 90Z" fill="#181923"/>
     <path d="M96 104 L112 104 M137 104 L154 104" stroke="#211f22" strokeWidth="4" strokeLinecap="round"/>
     <path d="M105 144 q16 8 32 0" stroke="#653e3a" strokeWidth="3" fill="none"/>
     <path d="M77 253 Q75 198 99 161 L110 145 121 154 108 192 115 232" fill="#b78b72" stroke="#835b4c" strokeWidth="3"/>
     <path d="M157 252 Q173 204 151 165 L135 145 124 154 135 191 133 231" fill="#bd9479" stroke="#875f50" strokeWidth="3"/>
    </svg>
   </div>
   <div className="cc-imprensa" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
   <div className="cc-coletiva-legenda" aria-live="polite"><small>AO VIVO · {nomeSelecao.toUpperCase()}</small><strong key={passo}>{fala}</strong></div>
   {passo===5&&venc&&<div className="cc-festa" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{'--cc-x':String(i*47%100)+'%','--cc-d':String(i%6*.15)+'s'}}/>)}</div>}
   {passo===5&&<div className={'cc-carimbo '+(venc?'cc-carimbo-sim':'cc-carimbo-nao')} role="status">
    <strong>{venc?'CONVOCADO!':'FORA DA LISTA'}</strong>
    <span>{venc?'Seu sonho de disputar a Copa continua.':'Desta vez, o técnico escolheu outros jogadores.'}</span>
   </div>}
  </div>
  <div className="cc-rodape">
   <section className="cc-lista" aria-label="Nomes anunciados pelo treinador">
    <strong>NOMES ANUNCIADOS <small>{anunciados.length}/5</small></strong>
    <ol>{anunciados.map((p,i)=><li key={p.id??p.nome??i} className={p.voce?'cc-seu-nome':''}><span>{p.posicao||'JOG'}</span>{p.nome}</li>)}</ol>
    {passo<5&&<p><span className="cc-batimento" aria-hidden="true">◆</span> Aguardando os próximos nomes...</p>}
   </section>
   <section className="cc-emocao">
    <small>{passo===5?'RESULTADO OFICIAL':'A EXPECTATIVA CRESCE'}</small>
    <h2>{passo===5?(venc?'Você vai para a Copa!':'O sonho fica para a próxima.'): 'Seu nome será chamado?'}</h2>
    <p>{passo===5?(resultado?.texto||'A lista está definida.'):(passo===4?'O selecionador se prepara para anunciar a última vaga.':'A cada nome anunciado, aumenta a expectativa de vestir a camisa da seleção.')}</p>
   </section>
  </div>
 </div>;
}
