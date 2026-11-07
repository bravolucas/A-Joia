import React, { useId, useEffect, useRef, useState } from 'react';
import { escudoDe, CENARIOS } from './arte.js';
import {GeometriaCampo} from './CenarioMini.jsx';

import goleiroMergulho from '../../arte/personagens/goleiro-mergulho.webp';
import goleiroReal from '../../arte/personagens/goleiro.webp';
import jogadorReal from '../../arte/personagens/jogador.webp';
import adversarioReal from '../../arte/personagens/adversario.webp';
import apresentacaoReal from '../../arte/personagens/apresentacao.webp';
import dirigenteReal from '../../arte/personagens/dirigente.webp';

// Recortes fotográficos originais; coordenadas e animações dos minigames preservadas.
export function JogadorCampo({ x=0, y=0, escala=1, numero=10, goleiro=false, adversario=false, esticado=false, direcao=1, exibirNumero=true }) {
  useEffect(()=>{if(goleiro){const imagem=new Image();imagem.src=goleiroMergulho;}},[goleiro]);
  const voando=goleiro&&esticado;
  const foto=goleiro?(voando?goleiroMergulho:goleiroReal):adversario?adversarioReal:jogadorReal;
  return <g transform={`translate(${x} ${y}) scale(${escala})`} className="vf-atleta" aria-hidden="true">
    {!voando&&<ellipse cx="0" cy="1" rx="17" ry="3" fill="#000" opacity=".3"/>}
    <image data-pose={voando?'mergulho':'espera'} href={foto} x={voando?-56:-30} y={voando?-68:-88} width={voando?112:60} height={voando?65:90} transform={voando&&direcao<0?'scale(-1 1)':undefined} preserveAspectRatio="xMidYMax meet"/>
    {!goleiro&&exibirNumero&&<g><circle cx="17" cy="-55" r="6" fill={adversario?'#28435e':'#103e2c'} stroke="#e2d1a0" strokeWidth=".6"/><text x="17" y="-52.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="800" fill="#fff4d1">{numero}</text></g>}
  </g>;
}

export function CamisaPremium({ nome, cor = '#147356', numero = 10, sobrenome, soletrar=false, className = '' }) {
  const id=useId().replace(/:/g,'');
  const escudo=escudoDe(nome);
  const hex=cor.replace('#','');const expandido=hex.length===3?hex.split('').map(c=>c+c).join(''):hex;
  const rgb=parseInt(expandido,16);const claro=((rgb>>16&255)*.299+(rgb>>8&255)*.587+(rgb&255)*.114)>170;
  const tinta=claro?'#15251d':'#fff5df';
  return <svg viewBox="0 0 180 190" className={`vf-camisa ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id={`tecido${id}`}><stop stopColor="#000" stopOpacity=".45"/><stop offset=".25" stopColor="#fff" stopOpacity=".16"/><stop offset=".5" stopColor="#fff" stopOpacity="0"/><stop offset=".8" stopColor="#fff" stopOpacity=".18"/><stop offset="1" stopColor="#000" stopOpacity=".5"/></linearGradient>
      <pattern id={`fios${id}`} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0V3" stroke="#fff" strokeOpacity=".08" strokeWidth=".5"/></pattern>
      <clipPath id={`corte${id}`}><path d="M58 16 28 30 8 68 35 83 44 65 42 171Q90 183 138 171L136 65 145 83 172 68 152 30 122 16Q90 40 58 16Z"/></clipPath>
    </defs>
    <ellipse cx="90" cy="179" rx="52" ry="6" fill="#0005"/>
    <g clipPath={`url(#corte${id})`}><path d="M0 0H180V190H0Z" fill={cor}/><path d="M0 0H180V190H0Z" fill={`url(#tecido${id})`}/><path d="M0 0H180V190H0Z" fill={`url(#fios${id})`}/><path d="M43 40 49 163M137 40 131 163M50 149Q90 158 130 149" fill="none" stroke="#000" strokeOpacity=".17" strokeWidth="3"/><path d="M48 42 58 62M132 42 122 62" stroke="#fff" strokeOpacity=".18" strokeWidth="4"/></g>
    <path d="M58 16Q90 45 122 16L115 14Q90 31 65 14ZM10 66 36 80M144 80 170 66" fill="none" stroke="#eed99e" strokeWidth="4"/>
    {escudo && !sobrenome && <image href={escudo} x="106" y="48" width="22" height="25"/>}
    {sobrenome && <text x="90" y="65" textAnchor="middle" fill={tinta} stroke={claro?"#ffffff33":"#0003"} strokeWidth=".5" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800" textLength={Math.min(92,sobrenome.length*8)} lengthAdjust="spacingAndGlyphs">{soletrar?[...sobrenome].map((letra,i)=><tspan key={`${i}-${letra}`} style={{animation:'ccTinta .3s ease both'}}>{letra}</tspan>):sobrenome}</text>}
    <text x="90" y="133" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="57" fill={tinta} stroke={claro?"#ffffff33":"#0004"} strokeWidth="1">{numero}</text>
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
