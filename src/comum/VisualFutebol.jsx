import React, { useId, useEffect, useRef, useState } from 'react';
import { escudoDe, CENARIOS } from './arte.js';
import {GeometriaCampo} from './CenarioMini.jsx';

import goleiroMergulho from '../../arte/personagens/goleiros-quatro-poses.webp';
import camisaReal from '../../arte/personagens/camisa-realista-base.webp';
import {uniformeDe,tintaUniforme} from '../dados/uniformes.js';
import goleiroReal from '../../arte/personagens/goleiro.webp';
import jogadorReal from '../../arte/personagens/jogador.webp';
import adversarioReal from '../../arte/personagens/adversario.webp';
import apresentacaoReal from '../../arte/personagens/apresentacao.webp';
import dirigenteReal from '../../arte/personagens/dirigente.webp';

// Recortes fotográficos originais; coordenadas e animações dos minigames preservadas.
export function JogadorCampo({ x=0, y=0, escala=1, numero=10, goleiro=false, adversario=false, esticado=false, direcao=1, defendeu=false, exibirNumero=true }) {
  useEffect(()=>{if(goleiro){const imagem=new Image();imagem.src=goleiroMergulho;}},[goleiro]);
  const recorteId=`goleiro-${useId().replace(/:/g,'')}`,recorteX=direcao<0?0:887,recorteY=defendeu?443.5:0;
  const voando=goleiro&&esticado;
  const foto=goleiro?(voando?goleiroMergulho:goleiroReal):adversario?adversarioReal:jogadorReal;
  return <g transform={`translate(${x} ${y}) scale(${escala})`} className="vf-atleta" aria-hidden="true">
    {!voando&&<ellipse cx="0" cy="1" rx="17" ry="3" fill="#000" opacity=".3"/>}
    {voando?<svg data-pose={defendeu?'defesa':'mergulho'} data-lado={direcao<0?'esquerda':'direita'} x="-56" y="-68" width="112" height="65" viewBox={`${recorteX} ${recorteY} 887 443.5`} overflow="hidden" style={{overflow:'hidden'}} data-recorte="pose-unica" preserveAspectRatio="xMidYMid meet"><defs><clipPath id={recorteId} clipPathUnits="userSpaceOnUse"><rect x={recorteX} y={recorteY} width="887" height="443.5"/></clipPath></defs><g clipPath={`url(#${recorteId})`}><image href={goleiroMergulho} width="1774" height="887"/></g></svg>:<image data-pose="espera" href={foto} x="-30" y="-88" width="60" height="90" preserveAspectRatio="xMidYMax meet"/>}
    {!goleiro&&exibirNumero&&<g><circle cx="17" cy="-55" r="6" fill={adversario?'#28435e':'#103e2c'} stroke="#e2d1a0" strokeWidth=".6"/><text x="17" y="-52.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="800" fill="#fff4d1">{numero}</text></g>}
  </g>;
}

export function PadraoCamisa({u,width=180,height=190}){
 const s=u.secundaria,w=width,h=height;
 if(u.padrao==='listras'||u.padrao==='tricolor')return <g>{Array.from({length:7},(_,i)=><React.Fragment key={i}><rect x={i*w/3-w} width={w/6} height={h} fill={s}/>{u.padrao==='tricolor'&&<rect x={i*w/3-w+w/6} width={w/30} height={h} fill={u.detalhe}/>}</React.Fragment>)}</g>;
 if(u.padrao==='horizontais')return <g>{Array.from({length:6},(_,i)=><React.Fragment key={i}><rect y={i*h/3} width={w} height={h/6} fill={s}/>{u.detalhe!==s&&<rect y={i*h/3+h/6} width={w} height={h/45} fill={u.detalhe}/>}</React.Fragment>)}</g>;
 if(u.padrao==='diagonal')return <path d={`M${w*.77} 0H${w}L${w*.17} ${h}H0Z`} fill={s}/>;
 if(u.padrao==='metades')return <rect x={w/2} width={w/2} height={h} fill={s}/>;
 if(u.padrao==='monaco')return <path d={`M${w} ${h*.3}V${h}H0V${h*.7}Z`} fill={s}/>;
 if(u.padrao==='central')return <rect x={w*.35} width={w*.3} height={h} fill={s}/>;
 if(u.padrao==='faixa')return <g><rect y={h*.4} width={w} height={h*.2} fill={s}/>{u.detalhe!==s&&<rect y={h*.51} width={w} height={h*.07} fill={u.detalhe}/>}</g>;
 if(u.padrao==='v')return <path d={`M0 ${h*.27} ${w/2} ${h*.52} ${w} ${h*.27}`} fill="none" stroke={s} strokeWidth={h*.07}/>;
 if(u.padrao==='cruz')return <g><rect x={w*.43} width={w*.14} height={h} fill={s}/><rect y={h*.36} width={w} height={h*.13} fill={s}/></g>;
 if(u.padrao==='xadrez')return <g>{Array.from({length:48},(_,i)=>{const x=i%6,y=Math.floor(i/6);return(x+y)%2===0?<rect key={i} x={x*w/6} y={y*h/8} width={w/6} height={h/8} fill={s}/>:null;})}</g>;
 return null;
}
export function CamisaPremium({ nome, cor = '#147356', numero = 10, sobrenome, soletrar=false, className = '', uniforme, emblema }) {
 const id=useId().replace(/:/g,''),u=uniforme||uniformeDe(nome,cor),tinta=tintaUniforme(u),escudo=emblema||escudoDe(nome);
 return <svg viewBox="0 0 180 190" className={`vf-camisa ${className}`} aria-hidden="true" data-uniforme={u.padrao} data-cor-camisa={u.base}>
  <defs><mask id={`camisa-foto-${id}`} style={{maskType:'alpha'}}><image href={camisaReal} x="0" y="0" width="180" height="190" preserveAspectRatio="none"/></mask></defs>
  <image className="vf-tecido-real" href={camisaReal} width="180" height="190" preserveAspectRatio="none"/>
  <g mask={`url(#camisa-foto-${id})`} style={{mixBlendMode:'multiply'}}><rect width="180" height="190" fill={u.base}/><PadraoCamisa u={u}/></g>
  {escudo&&!sobrenome&&<image className="vf-escudo-camisa" href={escudo} x="109" y="42" width="20" height="23"/>}
  {sobrenome&&<text x="90" y="55" textAnchor="middle" fill={tinta} stroke={tinta==='#19232b'?'#fff9':'#15251d99'} strokeWidth="1.1" paintOrder="stroke" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="800" textLength={Math.min(94,sobrenome.length*7)} lengthAdjust="spacingAndGlyphs">{soletrar?[...sobrenome].map((letra,i)=><tspan key={`${i}-${letra}`} style={{animation:'ccTinta .3s ease both'}}>{letra}</tspan>):sobrenome}</text>}
  {numero!=null&&<text x="90" y="137" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="69" fill={tinta} stroke={tinta==='#19232b'?'#fff9':'#15251d99'} strokeWidth="2" paintOrder="stroke">{numero}</text>}
 </svg>;
}

export function MedalhaFeito({ id, className = '' }) {
  const uid=useId().replace(/:/g,'');
  const mapa={'memoria-contrato':'16','memoria-estreia':'JOGO','primeiro-gol':'GOL','primeira-assistencia':'PAS','primeira-defesa':'DEF','primeira-recuperacao':'INT','primeiro-cruzamento':'CRZ','memoria-convocacao':'PAÍS','memoria-estreia-selecao':'EST','jogador-reinventado':'⇄','dupla-marcante':'2','assinatura-tecnica':'★','lider-vestiario':'CAP','primeira-taca':'taça','dez-tacas':'10','triplice':'3','cem-gols':'100','quinhentos-gols':'500','cem-assistencias':'100','quinhentos-jogos':'500','vinte-temporadas':'20','bola-ouro':'★','campeao-mundo':'mundo','idolo':'♥','cinco-clubes':'5','treinador-campeao':'prancheta','trinta-treinador':'30'};
  const simbolo=mapa[id]||(String(id).startsWith('tecnico-')?'TÉC':'◆');
  return <svg viewBox="0 0 120 140" className={`vf-medalha ${className}`} aria-hidden="true">
    <defs><linearGradient id={`ouro${uid}`} x2="1" y2="1"><stop stopColor="#fff2b3"/><stop offset=".35" stopColor="#bd8b36"/><stop offset=".52" stopColor="#f2d785"/><stop offset="1" stopColor="#6d491c"/></linearGradient></defs>
    <path d="M35 5 55 5 75 44 53 50ZM66 5H86L66 50 44 44Z" fill="#1f7555" stroke="#c9b06d"/>
    <path d="M60 35 107 55 101 101 60 128 19 101 13 55Z" fill={`url(#ouro${uid})`} stroke="#fff2ba70" strokeWidth="2"/>
    <path d="M60 43 98 60 93 96 60 118 27 96 22 60Z" fill="#17271e" stroke="#d9bd79"/>
    <path d="M31 90Q22 74 35 61M89 90Q98 74 85 61" fill="none" stroke="#cead65" strokeWidth="2"/>
    {simbolo==='taça'?<path d="M46 61H74L70 81 60 88 50 81ZM46 65H38Q36 80 50 80M74 65H82Q84 80 70 80M60 88V97M48 98H72" fill="none" stroke="#f0d38b" strokeWidth="3"/>:simbolo==='mundo'?<g fill="none" stroke="#f0d38b" strokeWidth="2"><circle cx="60" cy="77" r="20"/><ellipse cx="60" cy="77" rx="9" ry="20"/><path d="M40 77H80M44 66H76M44 88H76"/></g>:simbolo==='prancheta'?<g fill="none" stroke="#f0d38b" strokeWidth="2.5"><rect x="43" y="57" width="34" height="42" rx="4"/><path d="M53 55H67V62H53ZM49 73H70M49 82H61M49 91H70"/></g>:<text x="60" y="88" textAnchor="middle" fill="#f0d38b" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize={simbolo.length>2?23:34}>{simbolo}</text>}
    <circle cx="60" cy="110" r="2" fill="#e6ca80"/>
  </svg>;
}

export function RetratoApresentacao({ x=0, y=0, dirigente=false }) {
  return <g transform={`translate(${x} ${y})`} aria-hidden="true">
    <image className="vf-retrato-real" href={dirigente?dirigenteReal:apresentacaoReal} x="-70" y="-46" width="140" height="206" preserveAspectRatio="xMidYMax meet"/>
  </g>;
}

export function useCenario(nome) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches);
  useEffect(() => {
    const media=window.matchMedia('(max-width: 640px)');
    const atualizar=()=>setMobile(media.matches);media.addEventListener('change',atualizar);
    return ()=>media.removeEventListener('change',atualizar);
  }, []);
  return CENARIOS[mobile ? `${nome}Mobile` : nome] || CENARIOS[nome];
}
export function SuperficieMini({ children, largura=320, altura=210 }) {
  const ref=useRef(null);const [escala,setEscala]=useState(1);
  useEffect(()=>{
    const e=ref.current;if(!e)return;
    const atualizar=()=>setEscala(Math.min(e.clientWidth/largura,e.clientHeight/altura));atualizar();
    const obs=new ResizeObserver(atualizar);obs.observe(e);return()=>obs.disconnect();
  },[largura,altura]);
  return <div ref={ref} className="vf-superficie" style={{position:'relative',width:'100%',maxWidth:480,aspectRatio:`${largura}/${altura}`,margin:'0 auto',overflow:'hidden',borderRadius:14}}><div className="arena-coordenadas" style={{position:'absolute',left:'50%',top:'50%',width:largura,height:altura,transform:`translate(-50%,-50%) scale(${escala})`,transformOrigin:'center'}}>{children}</div></div>;
}
export function CampoPremium({ largura=320, altura=210, gol, passe=false, impacto=false }) {
  return <svg width={largura} height={altura} viewBox={`0 0 ${largura} ${altura}`} className="absolute inset-0 arena-svg" aria-hidden="true"><GeometriaCampo largura={largura} altura={altura} gol={gol} passe={passe} impacto={impacto}/></svg>;
}
