import React,{useState} from 'react';
import {Janela} from './JornadaUI.jsx';
import {CamisaPremium} from '../comum/VisualFutebol.jsx';
import {CLUBES,NACIONALIDADES} from '../dados/data.js';
import {camisaInfo,numeroSelecaoDe} from './camisasCarreira.js';
import {PLANOS_ESPACO,quadroTitularidade,patamarCarreira,reputacaoDeEstilo,retrospectivaCarreira} from './projetosCarreira.js';
import './ProgressaoCarreiraUI.css';
export function ChegadaCarreira({c,alvo='clube',precisaNumero=true,onNumero,onPlano}){
 const [todos,T]=useState(false),[aviso,V]=useState('');const info=camisaInfo(c,alvo),q=quadroTitularidade(c),nome=alvo==='selecao'?NACIONALIDADES.find(n=>n.id===c.nac)?.label||c.nac:info.nome;
 const escolher=n=>{try{onNumero(n,alvo);V('');}catch(e){V(e.message);}};
 const livres=todos?info.livres:info.livres.slice(0,18);
 return <Janela titulo={precisaNumero?`Sua camisa · ${nome}`:`Seu espaço · ${nome}`} classe="car-chegada" onFechar={undefined}>
  <div className="car-chegada-topo"><CamisaPremium nome={alvo==='clube'?nome:null} cor={CLUBES.find(x=>x.nome===nome)?.cor||'#217e52'} numero={precisaNumero?null:info.numero} sobrenome={String(c.nome||'Atleta').toUpperCase().split(' ').at(-1)}/><div><small>UM NOVO VESTIÁRIO</small><h2>{precisaNumero?'Escolha um número livre':'Como vai conquistar seu espaço?'}</h2><p>{precisaNumero?info.regra:`${q.projeto.nome}. ${q.projeto.texto}`}</p><b>Número favorito: {info.favorito}</b></div></div>
  {precisaNumero?<><p className="car-aviso">{info.favoritoRetirado?`A camisa ${info.favorito} foi aposentada neste clube. Escolha outra para esta passagem.`:info.favorito>info.max?`Seu favorito não é permitido aqui. Guarde-o para o clube.`:info.ocupante?`A ${info.favorito} está com ${info.ocupante.nome}. ${info.requisito}`:`Seu favorito ${info.favorito} está livre.`}</p>
   {info.favorito<=info.max&&!info.favoritoRetirado&&<button className="car-favorito" disabled={!!info.ocupante&&!info.podePedir} onClick={()=>escolher(info.favorito)}>{info.ocupante?'Pedir':'Escolher'} a camisa {info.favorito} ★<small>{info.ocupante?`Moral ${info.moral}/80 · prestígio ${info.prestigio}/75`:'Seu número favorito está disponível'}</small></button>}
   <div className="car-numeros" aria-label="Números livres">{livres.map(n=><button key={n} onClick={()=>escolher(n)} aria-label={`Escolher camisa ${n}`}>{n}</button>)}</div>{!todos&&info.livres.length>18&&<button className="car-mais" onClick={()=>T(true)}>Ver todos os números livres</button>}
   <small className="car-legenda">Os demais números estão reservados no elenco simulado. Escolher um número salva e segue.</small>
  </>:<div className="car-planos">{PLANOS_ESPACO.map(p=><button key={p.id} onClick={()=>{try{onPlano(p.id);}catch(e){V(e.message);}}}><strong>{p.nome}</strong><span>{p.texto}</span></button>)}</div>}
  {aviso&&<p role="alert">{aviso}</p>}
 </Janela>;
}
export function PainelProgressaoCarreira({c,onNumero}){
 const [aviso,V]=useState('');const q=quadroTitularidade(c),p=patamarCarreira(c),r=reputacaoDeEstilo(c),info=camisaInfo(c),nacional=c.numeroSelecao,infoNacional=nacional?camisaInfo(c,'selecao'):null;
 return <section className={`car-painel car-patamar-${p.id}`} aria-label="Seu lugar no futebol"><div className="car-fase"><span>{p.nome}</span><b>{q.papel}</b></div><p>{p.texto}</p><details><summary>Espaço, projeto e camisas</summary><h3>{q.projeto.nome}</h3><p>{q.projeto.texto}</p><small>{q.projeto.vantagem} {q.projeto.limite}</small><p>{q.plano} · referência de {q.projecao} jogos, sujeita a forma e lesões.</p><label>Confiança no clube: {q.confianca}/100<meter min="0" max="100" value={q.confianca}/></label><p>Clube: camisa {info.numero} · favorito {info.favorito}{nacional?` · seleção: ${numeroSelecaoDe(c)}`:''}</p>
  {info.numero!==info.favorito&&!info.favoritoRetirado&&<button disabled={(!!info.ocupante&&!info.podePedir)||c.lojaAnoEmCurso===c.ano} onClick={()=>{try{onNumero(info.favorito,'clube');V(`Camisa ${info.favorito} conquistada. Seu favorito agora é seu número no clube.`);}catch(e){V(e.message);}}}>Pedir meu número favorito<small>{info.ocupante?info.requisito:'Está livre. Pode pedir entre temporadas.'}</small></button>}
  {infoNacional&&infoNacional.favorito<=26&&infoNacional.numero!==infoNacional.favorito&&<button disabled={(!!infoNacional.ocupante&&!infoNacional.podePedir)||c.lojaAnoEmCurso===c.ano} onClick={()=>{try{onNumero(infoNacional.favorito,"selecao");V(`Camisa ${infoNacional.favorito} escolhida na seleção.`);}catch(e){V(e.message);}}}>Pedir meu favorito na seleção<small>{infoNacional.ocupante?`${infoNacional.requisito} Moral ${infoNacional.moral} · prestígio ${infoNacional.prestigio}`:"Está livre. Pode pedir entre temporadas."}</small></button>}
  {r.length>0&&<div className="car-reputacao"><h3>Sua reputação em campo</h3>{r.slice(0,3).map(x=><p key={x.id}><b>{x.nome}</b><span>{x.pontos}/100</span><meter min="0" max="100" value={x.pontos}/></p>)}<small>Construída pelos jogos e decisões registrados; não concede OVR automaticamente.</small></div>}
 </details>{aviso&&<p role="status">{aviso}</p>}</section>;
}
export function RetrospectivaCarreira({c}){
 const caps=retrospectivaCarreira(c);return <section className="car-retrospectiva" aria-label="Sua carreira em três capítulos"><h2>Três capítulos. Uma história sua.</h2>{caps.map((x,i)=><article key={x.id}><span>0{i+1}</span><div><small>{x.ano} · {x.titulo}</small><h3>{x.clube}</h3><p>{x.texto}</p></div></article>)}</section>;
}
