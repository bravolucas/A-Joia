/* Peças visuais compartilhadas pelas telas do treinador. */
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NACIONALIDADES } from '../dados/data.js';
import { escudoDe, bandeiraDe } from '../comum/arte.js';
import { bloquearRolagem } from "../comum/bloqueioRolagem.js";

export function Escudo({ nome, size = 32, estado }) {
  const nacao=NACIONALIDADES.find(n=>n.label===nome);
  const src = nacao ? bandeiraDe(nacao.id) : escudoDe(nome,{estado});
  return src ? <img src={src} alt="" className="joia-escudo object-contain shrink-0" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="shrink-0 flex items-center justify-center rounded-full bg-white/10" style={{ width: size, height: size }}>⚽</span>;
}

export function Bandeira({ pais }) {
  const src = bandeiraDe(NACIONALIDADES.find(n => n.label === pais || n.id === pais)?.id || pais);
  return src ? <img src={src} alt={pais} className="w-5 h-4 rounded-sm object-cover" /> : <span aria-label={pais || 'País'}>🌎</span>;
}

export function JanelaTreinador({ titulo, onFechar, children, classe = '' }) {
  const painel = useRef(null);
  const focoAnterior = useRef(document.activeElement);
  const fechar = useRef(onFechar);
  fechar.current = onFechar;
  useEffect(() => {
    const anterior = focoAnterior.current;
    const liberarRolagem = bloquearRolagem(document.body);
    painel.current?.querySelector('button')?.focus();
    const teclado = e => {
      if (e.key === 'Escape') fechar.current();
      if (e.key !== 'Tab') return;
      const itens = [...(painel.current?.querySelectorAll('button:not(:disabled), [href], input, select, summary, [tabindex="0"]') || [])];
      const primeiro = itens[0], ultimo = itens.at(-1);
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo?.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro?.focus(); }
    };
    document.addEventListener('keydown', teclado);
    return () => { liberarRolagem(); document.removeEventListener('keydown', teclado); anterior?.focus(); };
  }, []);
  return createPortal(<div className="ct-overlay" onClick={onFechar}>
    <section ref={painel} role="dialog" aria-modal="true" aria-label={titulo} className={`ct-modal ${classe}`} onClick={e => e.stopPropagation()}>
      <header className="ct-modal-header"><h2>{titulo}</h2><button type="button" aria-label="Fechar janela" onClick={onFechar}>×</button></header>
      {children}
    </section>
  </div>, document.body);
}

