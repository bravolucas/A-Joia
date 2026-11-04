import React, { useEffect, useRef, useState } from 'react';
import { desafiosDaTemporada, ovrDe } from './rapido.js';
import './DesafioTemporada.css';

const riscos = { baixo: 'Risco baixo', medio: 'Risco médio', alto: 'Tudo ou nada' };
const pontos = n => `${n > 0 ? '+' : ''}${n}`;
const DURACAO_REVELACAO = 1800;
function useRevelacao(resultado) {
  const inicio = resultado?.animacaoInicio;
  const [reduzir, setReduzir] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [pulado, setPulado] = useState(null);
  const [frame, setFrame] = useState({ inicio: null, progresso: 1 });
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const atualizar = () => setReduzir(media.matches);
    media.addEventListener('change', atualizar);
    return () => media.removeEventListener('change', atualizar);
  }, []);
  const progresso = !inicio || reduzir || pulado === inicio ? 1
    : frame.inicio === inicio ? frame.progresso : Math.min(1, Math.max(0, (Date.now() - inicio) / DURACAO_REVELACAO));
  useEffect(() => {
    if (!inicio || reduzir || pulado === inicio) return undefined;
    let raf;
    const animar = () => {
      const p = Math.min(1, Math.max(0, (Date.now() - inicio) / DURACAO_REVELACAO));
      setFrame({ inicio, progresso: p });
      if (p < 1) raf = requestAnimationFrame(animar);
    };
    raf = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(raf);
  }, [inicio, reduzir, pulado]);
  return { progresso, revelar: () => setPulado(inicio) };
}

function RevelacaoDesafio({ resultado, progresso }) {
  const chances = resultado.chances || [];
  if (!chances.length) return null;
  const idx = resultado.idx ?? 0;
  const alvo = (chances.slice(0, idx).reduce((n, c) => n + c.p, 0) + chances[idx].p / 2) * 100;
  const posicao = progresso >= 1 ? alvo : ((300 + alvo) * (1 - (1 - progresso) ** 3)) % 100;
  return <div className={`dt-sorteio ${progresso >= 1 ? 'dt-revelado' : ''}`}>
    <div className="dt-sorteio-titulo"><span role="status">{progresso < 1 ? 'Revelando resultado…' : 'Resultado confirmado'}</span><span>{progresso < 1 ? 'Acompanhe a indicação' : `${Math.round(chances[idx].p * 100)}% de chance`}</span></div>
    <div className="dt-trilho" aria-hidden="true"><div className="dt-faixas">{chances.map((c,i) => <span key={i} style={{ flex: c.p }} className={c.d > 0 ? 'dt-faixa-ganho' : c.d < 0 ? 'dt-faixa-perda' : 'dt-faixa-neutra'} />)}</div><span className="dt-indicador" style={{ left: `${posicao}%` }} /></div>
    <div className="dt-sorteio-legenda">{chances.map((c,i) => <span key={i} className={progresso >= 1 && i === idx ? 'dt-faixa-escolhida' : ''}>{pontos(c.d)} OVR <b>{Math.round(c.p * 100)}%</b></span>)}</div>
  </div>;
}

export default function DesafioTemporada({ c, resultado, onEscolher, onContinuar }) {
  const raiz = useRef(null);
  const { progresso, revelar } = useRevelacao(resultado);
  const animando = progresso < 1;
  const contagem = Math.max(0, (progresso - .55) / .45);
  const nivel = resultado ? Math.round(resultado.ovrAntes + (resultado.ovrDepois - resultado.ovrAntes) * (1 - (1 - contagem) ** 3)) : 0;
  useEffect(() => {
    if (!resultado) return;
    raiz.current?.focus({ preventScroll: true });
    raiz.current?.scrollIntoView({ block: 'start' });
  }, [resultado]);
  return <section ref={raiz} tabIndex={-1} className="dt" aria-label={`Desafio da temporada ${c.ano}`}>
    <header className="dt-header"><span>DESAFIO DA TEMPORADA</span><span>{resultado ? (animando ? 'Revelando…' : 'Concluído') : `Nível atual ${ovrDe(c)}`}</span></header>
    {resultado ? <>
      <div className="dt-resultado">
        <span className="dt-etapa">SUA ESCOLHA</span><h2>{resultado.nome}</h2>
        <RevelacaoDesafio resultado={resultado} progresso={progresso} />
        <div className={`dt-evolucao ${!animando ? 'dt-evolucao-final' : ''}`}><div><span>Antes</span><strong>{resultado.ovrAntes}</strong></div><span aria-hidden="true">→</span><div><span>{animando ? 'Evolução' : 'Agora'}</span><strong data-testid="desafio-ovr-atual" aria-live="off">{nivel}</strong></div><b className={resultado.d < 0 ? 'dt-perda' : ''}>{animando ? '…' : `${pontos(resultado.d)} OVR`}</b></div>
        <div className="dt-detalhes" style={{ visibility: animando ? 'hidden' : 'visible' }} aria-hidden={animando}>
          <p>{resultado.txt}</p>
          {resultado.efeitos?.length > 0 && <ul className="dt-efeitos">{resultado.efeitos.filter(e => !/OVR$/.test(e.txt)).map(e => <li key={e.txt}>{e.txt}</li>)}</ul>}
        </div>
      </div>
      <footer className="dt-footer"><button onClick={animando ? revelar : onContinuar}>{animando ? 'Revelar resultado' : 'Continuar para o treino'} <span aria-hidden="true">→</span></button><p>{animando ? 'Você pode acompanhar a animação ou revelar agora.' : 'O resultado já foi salvo. Agora prepare a temporada.'}</p></footer>
    </> : <>
      <h2>Como você quer evoluir?</h2><p className="dt-intro">Escolha uma abordagem. Compare as chances de ganhar ou perder pontos de nível.</p>
      <div className="dt-opcoes">{desafiosDaTemporada(c).map(o => <button key={o.id} onClick={() => onEscolher(o.id)} aria-label={`Escolher ${o.nome}`}>
        <span className="dt-risco">{riscos[o.faixa]}</span><strong>{o.nome}</strong><span className="dt-descricao">{o.texto}</span>
        <span className="dt-chances">{o.chances.map((x,i) => <span key={i} className={x.d < 0 ? 'dt-chance-perda' : x.d > 0 ? 'dt-chance-ganho' : ''}>{pontos(x.d)} OVR <b>{Math.round(x.p * 100)}%</b></span>)}</span>
        <span className="dt-escolher">Escolher esta abordagem <span aria-hidden="true">→</span></span>
      </button>)}</div>
      <button className="dt-recusar" onClick={() => onEscolher(null)}>Não arriscar este ano</button>
    </>}
  </section>;
}
