import React from 'react';
import LinkEntidade from './LinkEntidade.jsx';
import './PremiosTemporada.css';

const LINHAS=[['ATA',['PE','PD','ATA','SA']],['MEI',['VOL','MC','MEI']],['DEF',['LD','MD','ZAG','LE','ME']],['GOL',['GOL']]];
const ORDEM_DEF=['LE','ME','ZAG','LD','MD'];
function Jogador({p}){
 return <li className={p.voce?'pt-voce':''}><span className="pt-camisa" aria-hidden="true">{p.posicao}</span>
  <strong>{p.voce?(p.nome+' · Você'):<LinkEntidade tipo="jogador" id={String(p.id)} nome={p.nome}/>}</strong>
  <small>{p.clube} · {p.posicao==='GOL'?`${p.jogos} jogos`:`${p.gols} G · ${p.assist} A`}</small></li>;
}
/** Prêmios da temporada de uma liga: seleção do campeonato em campo, revelação, artilheiro e melhor técnico. */
export default function PremiosTemporada({premios,ano}){
 if(!premios?.xi?.length)return null;
 const linhas=LINHAS.map(([id,pos])=>[id,premios.xi.filter(p=>pos.includes(p.posicao)).sort((a,b)=>id==='DEF'?ORDEM_DEF.indexOf(a.posicao)-ORDEM_DEF.indexOf(b.posicao):0)]);
 const cartao=(titulo,x,detalhe)=>x&&<article className={'pt-cartao'+(x.voce?' pt-voce':'')}><small>{titulo}</small><strong>{x.voce||!x.id?x.nome+(x.voce?' · Você':''):<LinkEntidade tipo="jogador" id={String(x.id)} nome={x.nome}/>}</strong><span>{detalhe}</span></article>;
 return <section className="pt-premios" aria-label={`Prêmios da temporada ${ano}`}>
  <h4>Prêmios da temporada {ano}</h4>
  <div className="pt-campo" aria-label="Seleção do campeonato">{linhas.map(([id,lista])=><ul key={id} className={`pt-linha pt-${id}`}>{lista.map(p=><Jogador key={p.id} p={p}/>)}</ul>)}</div>
  <div className="pt-cartoes">
   {cartao('Artilheiro',premios.artilheiro,premios.artilheiro&&`${premios.artilheiro.gols} gols · ${premios.artilheiro.clube}`)}
   {cartao('Revelação',premios.revelacao,premios.revelacao&&`${premios.revelacao.posicao} · ${premios.revelacao.clube}`)}
   {premios.tecnico&&<article className={'pt-cartao'+(premios.tecnico.voce?' pt-voce':'')}><small>Melhor técnico</small><strong>{premios.tecnico.nome}{premios.tecnico.voce?' · Você':''}</strong><span><LinkEntidade tipo="clube" nome={premios.tecnico.clube}/> · {premios.tecnico.motivo}</span></article>}
  </div>
 </section>;
}
