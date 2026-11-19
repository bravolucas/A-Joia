import React,{useState} from 'react';
import {TacaCompeticao} from './trofeus.jsx';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import primeiro from '../../arte/premiacoes/bola-de-ouro-1-lugar.webp';
import segundo from '../../arte/premiacoes/bola-de-ouro-2-lugar.webp';
import terceiro from '../../arte/premiacoes/bola-de-ouro-3-lugar.webp';
import './CerimoniaBola.css';

/** Cena de premiação. Os resultados são recebidos, nunca recalculados aqui. */
export const CENAS_BOLA_DE_OURO={
 1:{imagem:primeiro,titulo:'MELHOR DO MUNDO!',legenda:'A noite da consagração'},
 2:{imagem:segundo,titulo:'TÃO PERTO DO SONHO.',legenda:'O respeito de todo o futebol'},
 3:{imagem:terceiro,titulo:'ENTRE OS GIGANTES.',legenda:'Uma temporada para a história'},
};
const CONFETES=Array.from({length:22},(_,i)=>({
 left:String((i*47)%101)+'%',delay:String(.65+(i%6)*.18)+'s',
 duracao:String(2.4+(i%4)*.37)+'s',
 deslocamento:String((i%2?1:-1)*(10+i*3))+'px',
 giro:String((i%2?1:-1)*(180+i*29))+'deg',
 cor:['#f4d77b','#ffffff','#ddaf47','#e7a34f'][i%4]
}));

export default function CerimoniaBola({nome,posicao,finalistas=[],ano,children}){
 const [repeticao,repetir]=useState(0);
 const colocado=Number(posicao),venceu=colocado===1,podio=[1,2,3].includes(colocado);
 const cena=CENAS_BOLA_DE_OURO[colocado];
 const linhas=Array.isArray(finalistas)?finalistas.slice(0,3):[];
 const vencedor=linhas[0]?.nome,clubeJogador=linhas.find(p=>p.voce)?.clube;
 const emocao=venceu?'Seu nome no topo. A taça é sua, e esta noite entra para a história.'
  :podio?'Os aplausos reconhecem sua temporada. '+(vencedor?vencedor+' fica com a taça.':'O troféu fica em outras mãos.')+' Um lugar entre os melhores do mundo.'
  :'Uma temporada reconhecida no palco do futebol mundial.';
 return <section className={'cb-bola '+(venceu?'cb-vencedor':colocado===2?'cb-vice':'cb-terceiro')}
  aria-label={venceu?'Vencedor da Bola de Ouro':'Uma noite no pódio da Bola de Ouro'}
  data-resultado-bola={venceu?'vencedor':'finalista'}
  data-animacao-bola={cena?'cinematografica':'classica'}>
  <span className="cb-eyebrow"><LinkEntidade tipo="premio" nome="Bola de Ouro"/> · {ano}</span>
  <div className="cb-cinema" key={colocado+'-'+repeticao}>
   {cena?<img className="cb-cinema-foto" src={cena.imagem} alt={'Cena cinematográfica da Bola de Ouro: '+colocado+'º lugar'} loading="eager" decoding="async"/>:
    <div className="cb-cinema-alternativa"><TacaCompeticao nome="Bola de Ouro" tipo="bolaOuro" size={118}/></div>}
   <div className="cb-cinema-cortina" aria-hidden="true"><small>A JOIA APRESENTA</small><span>BOLA DE OURO</span></div>
   <div className="cb-cinema-holofote" aria-hidden="true"/>
   <div className="cb-cinema-flash" aria-hidden="true"/>
   {venceu&&<div className="cb-cinema-confetes" aria-hidden="true">{CONFETES.map((c,i)=><i key={i} style={{
    '--cb-x':c.left,'--cb-atraso':c.delay,'--cb-duracao':c.duracao,
    '--cb-dx':c.deslocamento,'--cb-giro':c.giro,'--cb-papel':c.cor
   }}/>)}</div>}
   <div className="cb-cinema-informacao" aria-live="off">
    <span className="cb-cinema-selo">CERIMÔNIA · {ano}</span>
    <strong>{podio?colocado+'º LUGAR':'BOLA DE OURO'}</strong>
    <span>{cena?.legenda||'O futebol celebra seus craques'}</span>
   </div>
  </div>
  <div className="cb-cena-acoes">
   <h1>{cena?.titulo||'A NOITE DA BOLA DE OURO'}</h1>
   {cena&&<button type="button" className="cb-rever" onClick={()=>repetir(n=>n+1)} aria-label="Repetir animação da cerimônia">↻ Rever cena</button>}
  </div>
  <h2>{podio?colocado+'º MELHOR DO MUNDO':vencedor||'Resultado da cerimônia'}</h2>
  <p className="cb-nome"><LinkEntidade tipo="jogador" id="voce" nome={nome}/>{clubeJogador&&<small> · <LinkEntidade tipo="clube" nome={clubeJogador}/></small>}</p>
  <p className="cb-emocao">{emocao}</p>
  {children||(linhas.length===3?<ol className="cb-ranking" aria-label="Top 3 da Bola de Ouro">{linhas.map((p,i)=><li key={p.jogadorId??p.id??i} className={p.voce?'cb-eu':''}><b>{i+1}º</b><span><LinkEntidade tipo="jogador" id={p.voce?'voce':p.jogadorId??p.id} nome={p.nome}/><small><LinkEntidade tipo="clube" nome={p.clube||''}>{p.clube||'Clube não registrado'}</LinkEntidade>{p.voce?' · Você':''}</small></span></li>)}</ol>:<p className="cb-ausente">O top 3 completo não foi registrado nesta temporada.</p>)}
 </section>;
}
