import React, {useEffect, useId, useRef, useState} from 'react';
import estadio from './arte/cenarios/estadio-premium.webp';

// O gol e as linhas partem da mesma linha de fundo. A arquibancada nunca
// participa das coordenadas jogáveis, independentemente do tamanho da trave.
export function GeometriaCampo({largura=320, altura=210, gol, passe=false, impacto=false}) {
  const id=useId().replace(/:/g,'');
  const base=gol ? gol.y+gol.h : 90;
  const horizonte=passe?0:Math.max(15,base*.38);
  const centro=gol?gol.x+gol.w/2:largura/2;
  const areaY=base+(altura-base)*.52;
  const profundidade=gol?Math.max(5,gol.w*.055):0;
  return <g className="arena-campo" data-horizonte={horizonte} data-linha-gol={gol?base:undefined}>
    <defs>
      <linearGradient id={`relva-${id}`} x2="0" y2="1"><stop stopColor="#34754b"/><stop offset="1" stopColor="#123e2a"/></linearGradient>
      <linearGradient id={`bancada-${id}`} x2="0" y2="1"><stop stopColor="#071c24"/><stop offset="1" stopColor="#173037"/></linearGradient>
      <radialGradient id={`foco-${id}`} cx="50%" cy="0%" r="90%"><stop stopColor="#f0f3bc" stopOpacity=".18"/><stop offset="1" stopColor="#081d17" stopOpacity="0"/></radialGradient>
      <pattern id={`relva-fios-${id}`} width="7" height="6" patternUnits="userSpaceOnUse"><path d="m1 5 1-2m3 1 1-2" stroke="#c0d593" strokeWidth=".45" opacity=".13"/></pattern>
      <pattern id={`torcida-${id}`} width="11" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1.1" fill="#ddd8b7" opacity=".5"/><circle cx="7" cy="6" r="1.2" fill="#578a84"/><path d="M0 9H11" stroke="#06171d" strokeWidth="3"/></pattern>
      <pattern id={`malha-${id}`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5V5" stroke="#e8f3e0" strokeOpacity=".38" fill="none" strokeWidth=".5"/></pattern>
      <clipPath id={`arquibancada-${id}`}><rect width={largura} height={horizonte}/></clipPath>
      <clipPath id={`piso-${id}`}><rect y={horizonte} width={largura} height={altura-horizonte}/></clipPath>
    </defs>
    <rect width={largura} height={altura} fill={`url(#bancada-${id})`}/>
    {!passe&&<><rect y="4" width={largura} height={horizonte-7} fill={`url(#torcida-${id})`}/><path d={`M0 ${horizonte-6}H${largura}`} stroke="#aacbc3" strokeOpacity=".25" strokeWidth="2"/><rect y={horizonte-5} width={largura} height="5" fill="#071c22"/>{[.08,.32,.68,.92].map(x=><path key={x} d={`M${largura*x} 4h17`} stroke="#d9ede1" strokeWidth="1.6" strokeLinecap="round"/>)}</>}
    <rect className="arena-gramado" y={horizonte} width={largura} height={altura-horizonte} fill={`url(#relva-${id})`}/>
    {!passe&&<>
      <g clipPath={`url(#arquibancada-${id})`}><svg width={largura} height={horizonte} viewBox="0 0 1280 480" preserveAspectRatio="xMidYMax slice"><image href={estadio} width="1280" height="853"/></svg><rect width={largura} height={horizonte} fill="#06171e" opacity=".25"/></g>
      <g clipPath={`url(#piso-${id})`}><svg y={horizonte} width={largura} height={altura-horizonte} viewBox="0 480 1280 373" preserveAspectRatio="none"><image href={estadio} width="1280" height="853"/></svg><rect y={horizonte} width={largura} height={altura-horizonte} fill={`url(#relva-${id})`} opacity=".32"/></g>
    </>}
    {Array.from({length:9},(_,i)=>{const y=horizonte+(altura-horizonte)*(i/9)**1.65,proximo=horizonte+(altura-horizonte)*((i+1)/9)**1.65;return <rect key={i} y={y} width={largura} height={(proximo-y)/2} fill="#cee9ac" opacity=".045"/>;})}
    <rect y={horizonte} width={largura} height={altura-horizonte} fill={`url(#relva-fios-${id})`}/>
    <rect width={largura} height={altura} fill={`url(#foco-${id})`}/>
    {passe?<g fill="none" stroke="#d1e3c0" strokeOpacity=".5" strokeWidth="1">
      <path d={`M23 13H${largura-23}L${largura-9} ${altura-10}H9Z`}/><path d={`M17 ${altura*.48}H${largura-17}`}/><ellipse cx={largura/2} cy={altura*.48} rx="37" ry="24"/><circle cx={largura/2} cy={altura*.48} r="1.5" fill="#dcebd0"/>
      <path d={`M${largura*.3} 13  ${largura*.27} 48H${largura*.73}L${largura*.7} 13M${largura*.36} 13 ${largura*.35} 27H${largura*.65}L${largura*.64} 13`}/>
    </g>:gol&&<g fill="none" stroke="#d5e5c6" strokeOpacity=".65" strokeWidth=".9">
      <path data-testid="linha-de-fundo" d={`M0 ${base}H${largura}`}/>
      <path d={`M${centro-gol.w*.76} ${base} ${centro-gol.w*.98} ${areaY}H${centro+gol.w*.98}L${centro+gol.w*.76} ${base}`}/>
      <path d={`M${gol.x-9} ${base} ${gol.x-15} ${base+(areaY-base)*.36}H${gol.x+gol.w+15}L${gol.x+gol.w+9} ${base}`}/>
      <ellipse cx={centro} cy={base+(areaY-base)*.7} rx="1.8" ry=".9" fill="#d5e5c6"/>
      <path d={`M${centro-20} ${areaY} Q${centro} ${areaY+17} ${centro+20} ${areaY}`}/>
    </g>}
    {gol&&<g className="arena-gol" data-base={base}>
      <path d={`M${gol.x} ${base} ${gol.x+profundidade} ${base-profundidade/2}H${gol.x+gol.w-profundidade}L${gol.x+gol.w} ${base}Z`} fill="#04140d" opacity=".3"/>
      <rect x={gol.x+profundidade} y={gol.y+profundidade*.6} width={gol.w-profundidade*2} height={gol.h-profundidade} fill="#0a211b" fillOpacity=".42"/>
      <rect className={impacto?'arena-rede-impacto':undefined} x={gol.x+profundidade} y={gol.y+profundidade*.6} width={gol.w-profundidade*2} height={gol.h-profundidade} fill={`url(#malha-${id})`}/>
      <path d={`M${gol.x} ${gol.y} ${gol.x+profundidade} ${gol.y+profundidade*.6}V${base-profundidade/2}L${gol.x} ${base}ZM${gol.x+gol.w} ${gol.y} ${gol.x+gol.w-profundidade} ${gol.y+profundidade*.6}V${base-profundidade/2}L${gol.x+gol.w} ${base}ZM${gol.x} ${gol.y}H${gol.x+gol.w}L${gol.x+gol.w-profundidade} ${gol.y+profundidade*.6}H${gol.x+profundidade}Z`} fill={`url(#malha-${id})`} stroke="#c8dbca" strokeWidth=".4"/>
      <path d={`M${gol.x} ${base}V${gol.y}H${gol.x+gol.w}V${base}`} fill="none" stroke="#061b16" strokeOpacity=".45" strokeWidth={gol.w>200?5:3.5} transform="translate(1 1)"/>
      <path d={`M${gol.x} ${base}V${gol.y}H${gol.x+gol.w}V${base}`} fill="none" stroke="#f0f5e9" strokeWidth={gol.w>200?3.2:2} strokeLinejoin="round"/>
    </g>}
  </g>;
}

export function QuadroMini({children,className=''}) {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current,header=el?.closest('.rp')?.querySelector(':scope > header');
    const medir=()=>el?.style.setProperty('--mini-cabecalho',`${header?.getBoundingClientRect().height||80}px`);
    medir();const observer=new ResizeObserver(medir);if(header)observer.observe(header);
    window.scrollTo({top:0,behavior:'instant'});
    return()=>observer.disconnect();
  },[]);
  return <div ref={ref} className={`arena-quadro ${className}`}>{children}</div>;
}

export function BolaTrajeto({origem, destino, ativo=false, curva=0, elevacao=20, raio=6}) {
  const [p,setP]=useState(0);
  const ox=origem.x,oy=origem.y,dx=destino.x,dy=destino.y;
  useEffect(()=>{
    if(!ativo){setP(0);return;}
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');let frame;
    const concluir=()=>{if(media.matches){cancelAnimationFrame(frame);setP(1);}};
    if(media.matches){setP(1);return;}
    setP(0);const inicio=performance.now();
    const animar=agora=>{const t=Math.min(1,(agora-inicio)/720);setP(t);if(t<1)frame=requestAnimationFrame(animar);};
    frame=requestAnimationFrame(animar);media.addEventListener('change',concluir);
    return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',concluir);};
  },[ativo,ox,oy,dx,dy,curva,elevacao]);
  const t=ativo?p:0, x=ox+(dx-ox)*t+Math.sin(t*Math.PI)*curva;
  const solo=oy+(dy-oy)*t,y=solo-Math.sin(t*Math.PI)*elevacao,r=raio*(1-.5*t);
  return <g className="arena-bola" data-progresso={t} data-x={x} data-y={y} aria-hidden="true">
    <ellipse cx={x} cy={solo+4} rx={r*1.25} ry={r*.35} fill="#06140b" opacity=".35"/>
    <g transform={`translate(${x} ${y}) rotate(${t*540})`}><circle r={r} fill="#f3f1df" stroke="#163b2b" strokeWidth=".7"/><path d={`M0 ${-r*.55} ${r*.5} ${-r*.15} ${r*.3} ${r*.45} ${-r*.3} ${r*.45} ${-r*.5} ${-r*.15}Z`} fill="#1a3026"/><path d={`M0 ${-r}V${-r*.55}M${r*.93} ${-r*.3} ${r*.5} ${-r*.15}M${r*.6} ${r*.8} ${r*.3} ${r*.45}M${-r*.6} ${r*.8} ${-r*.3} ${r*.45}`} stroke="#263b2d" strokeWidth=".6"/></g>
  </g>;
}
