import React,{useRef,useState} from 'react';
import {QuadroMini} from '../comum/CenarioMini.jsx';
import {prepararDecisaoJogo,resolverDecisaoJogo} from './decisaoDeJogo.js';
import './DecisaoDeJogo.css';
function Lance({cena,res}){
 const defensivo=cena.perfil!=='ataque',origem=defensivo?'180 40':'180 155';
 const destino=res?(defensivo?(res.acertou?'245 120':'180 191'):(res.acertou?'180 12':'175 95')):origem;
 const caminho=res?.acao==='passe'&&res.acertou?'M180 155 Q235 130 245 65 Q215 15 180 12':`M${origem} Q${defensivo?'145 95':'140 100'} ${destino}`;
 const reduzir=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 return <svg className="dj-campo" viewBox="0 0 360 200" aria-label="Diagrama do lance" role="img">
  <defs><linearGradient id="dj-relva" x2="0" y2="1"><stop stopColor="#153f32"/><stop offset="1" stopColor="#0c2723"/></linearGradient></defs>
  <rect x="8" y="3" width="344" height="194" rx="15" fill="url(#dj-relva)"/><path d="M22 15H338V186H22ZM22 100H338M126 15V55H234V15M126 186V148H234V186" fill="none" stroke="#9ac9b0" strokeOpacity=".25"/><circle cx="180" cy="100" r="29" fill="none" stroke="#9ac9b040"/><path d="M156 15V5H204V15M156 186V196H204V186" fill="none" stroke="#d9d5b5" strokeWidth="2"/>
  {[[175,95],[90,65],[270,115]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="9" fill="#c27564"/><circle cx={x} cy={y} r="15" fill="none" stroke="#c2756435"/></g>)}
  <circle cx="245" cy="65" r="10" fill="#72d3b5"/><text x="245" y="69" textAnchor="middle" fill="#071c17" fontSize="10" fontWeight="800">7</text>
  <circle cx="180" cy={defensivo?128:155} r="13" fill="#f1d99b"/><text x="180" y={defensivo?132:159} textAnchor="middle" fill="#14261e" fontSize="8" fontWeight="800">VOCÊ</text>
  {res&&<path className="dj-rota" d={caminho} fill="none" stroke={res.acertou?'#c6edd5':'#e6a797'} strokeWidth="2" strokeDasharray="5 5"/>}
  {res&& !reduzir?<circle r="5" fill="#fff7dc" stroke="#153c2f"><animateMotion dur=".8s" path={caminho} fill="freeze"/></circle>:<circle cx={Number(destino.split(' ')[0])} cy={Number(destino.split(' ')[1])} r="5" fill="#fff7dc" stroke="#153c2f"/>}
  <text x="29" y="178" fill="#a3c2b5" fontSize="8">{res?'SUA JOGADA':'LEIA O ESPAÇO'}</text>
 </svg>;
}
export default function DecisaoDeJogo({c,momento,cabecalho,onRegistrar,onFim}){
 const cena=prepararDecisaoJogo(c,momento),[res,R]=useState(momento.decisaoJogo||null),trava=useRef(!!momento.decisaoJogo),finalizou=useRef(false);
 const escolher=id=>{if(trava.current)return;trava.current=true;const r=resolverDecisaoJogo(c,momento,id);R(r);onRegistrar?.(r);};
 return <QuadroMini className="dj-quadro"><div>{cabecalho}</div><section className={`dj-painel ${res?'dj-resolvido':''}`} aria-label="Lance que decide">
  <header><span>UMA LEITURA. UMA DECISÃO.</span><b>{cena.titulo}</b><p>{cena.texto}</p></header>
  <Lance cena={cena} res={res}/>
  {!res?<div className="dj-escolhas">{cena.opcoes.map((op,i)=><button key={op.id} onClick={()=>escolher(op.id)}><span className="dj-numero">0{i+1}</span><span><strong>{op.nome}</strong><small>{op.texto}</small></span><em>{op.risco}</em></button>)}</div>:<><div className={`dj-resultado ${res.acertou?'dj-acertou':'dj-falhou'}`} role="status"><span>{res.nome} · {Math.round(res.chance*100)}% de chance</span><strong>{res.acertou?(cena.perfil==='ataque'?'JOGADA DECISIVA!':'ATAQUE NEUTRALIZADO!'):'O RIVAL LEVOU A MELHOR'}</strong><p>{res.texto}</p></div><button className="dj-continuar" onClick={()=>{if(finalizou.current)return;finalizou.current=true;onFim(res.acertou);}}>Continuar a decisão →</button></>}
 </section></QuadroMini>;
}
