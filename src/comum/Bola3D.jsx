import React, { useEffect, useRef } from 'react';
import Zdog from 'zdog';

/* Bola de futebol em pseudo-3D (Zdog, MIT). Gira enquanto o jogo calcula algo;
   com movimento reduzido, fica parada numa pose bonita. */
export default function Bola3D({ size = 72, girando = true, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const raio = 22;
    const ilustracao = new Zdog.Illustration({ element: canvas, zoom: (size * 2) / 64, rotate: { x: -0.35, y: 0.6 } });
    new Zdog.Shape({ addTo: ilustracao, stroke: raio * 2, color: '#F4F4F5' });
    // Gomos pretos: um no polo e cinco ao redor de cada hemisfério, encostados na superfície.
    const gomo = (rx, ry) => {
      const ancora = new Zdog.Anchor({ addTo: ilustracao, rotate: { x: rx, y: ry } });
      new Zdog.Polygon({ addTo: ancora, sides: 5, radius: 6.2, translate: { z: raio + 0.4 }, stroke: 1.6, fill: true, color: '#18181B' });
    };
    gomo(0, 0); gomo(Math.PI, 0);
    for (let i = 0; i < 5; i++) { gomo(Zdog.TAU / 6, (Zdog.TAU / 5) * i); gomo(-Zdog.TAU / 6, (Zdog.TAU / 5) * i + Zdog.TAU / 10); }
    const reduzido = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let quadro = 0;
    const animar = () => {
      ilustracao.rotate.y += 0.035;
      ilustracao.rotate.x += 0.008;
      ilustracao.updateRenderGraph();
      quadro = requestAnimationFrame(animar);
    };
    if (girando && !reduzido) animar(); else ilustracao.updateRenderGraph();
    return () => cancelAnimationFrame(quadro);
  }, [size, girando]);
  return <canvas ref={ref} width={size * 2} height={size * 2} style={{ width: size, height: size }} className={className} aria-hidden="true" />;
}
