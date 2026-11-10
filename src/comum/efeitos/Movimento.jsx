import React, {useEffect, useRef} from 'react';
import {LazyMotion, domAnimation, MotionConfig, m, useAnimationControls, useReducedMotion} from 'motion/react';

const curva = [.22, 1, .36, 1];

export function MovimentoProvider({children}) {
  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>;
}

// Anima a superfície, sem remontar o conteúdo ou reiniciar decisões/minigames.
// Sem transform no ancestral: diálogos e elementos fixos conservam suas coordenadas.
export function RevelacaoTela({children, identidade, as = 'div', className = '', ...props}) {
  const controle = useAnimationControls();
  const reduzir = useReducedMotion();
  const Elemento = m[as];
  useEffect(() => {
    if (reduzir) { controle.set({opacity: 1}); return; }
    controle.set({opacity: .45});
    controle.start({opacity: 1, transition: {duration: .28, ease: curva}});
    return () => controle.stop();
  }, [identidade, reduzir, controle]);
  return <Elemento {...props} className={`joia-revelacao ${className}`} animate={controle}>{children}</Elemento>;
}

// Implementação própria inspirada nos efeitos Blur Text e Spotlight Card do React Bits.
// Texto completo continua disponível ao leitor de tela durante toda a revelação.
export function TextoRevelado({texto, className = ''}) {
  const reduzir = useReducedMotion();
  return <span className={`joia-texto ${className}`}><span className="joia-sr-only">{texto}</span><span aria-hidden="true">{texto.split(' ').map((palavra, i) => <React.Fragment key={`${i}-${palavra}`}><m.span style={{display: 'inline-block'}} initial={reduzir ? false : {opacity: 0, y: 12, filter: 'blur(6px)'}} animate={{opacity: 1, y: 0, filter: 'blur(0px)'}} transition={{duration: reduzir ? 0 : .5, delay: reduzir ? 0 : i * .07, ease: curva}}>{palavra}</m.span>{' '}</React.Fragment>)}</span></span>;
}

export function CartaoLuz({children, as = 'div', className = '', onPointerMove, onPointerLeave, ...props}) {
  const ref = useRef(null);
  const reduzir = useReducedMotion();
  const Elemento = as;
  const mover = e => {
    onPointerMove?.(e);
    if (reduzir || e.pointerType !== 'mouse') return;
    const el = ref.current, rect = el.getBoundingClientRect();
    el.style.setProperty('--luz-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--luz-y', `${e.clientY - rect.top}px`);
    el.dataset.luz = 'ativa';
  };
  return <Elemento {...props} ref={ref} className={`joia-luz ${className}`} onPointerMove={mover} onPointerLeave={e => {if(ref.current) delete ref.current.dataset.luz; onPointerLeave?.(e);}}>{children}</Elemento>;
}

// Campo e fachos de luz decorativos: CSS, sem canvas/WebGL ou loop JavaScript.
export function LuzEstadio() {
  return <div className="joia-estadio" aria-hidden="true"><i className="joia-facho joia-facho-a"/><i className="joia-facho joia-facho-b"/><div className="joia-linhas-campo"><i/><b/><span/></div><div className="joia-faceta joia-faceta-a"/><div className="joia-faceta joia-faceta-b"/></div>;
}
