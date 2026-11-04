import React, { useEffect, useRef } from 'react';
import { desafiosDaTemporada, ovrDe } from './rapido.js';
import './DesafioTemporada.css';

const riscos = { baixo: 'Risco baixo', medio: 'Risco médio', alto: 'Tudo ou nada' };
const pontos = n => `${n > 0 ? '+' : ''}${n}`;
export default function DesafioTemporada({ c, resultado, onEscolher, onContinuar }) {
  const raiz = useRef(null);
  useEffect(() => {
    if (!resultado) return;
    raiz.current?.focus({ preventScroll: true });
    raiz.current?.scrollIntoView({ block: 'start' });
  }, [resultado]);
  return <section ref={raiz} tabIndex={-1} className="dt" aria-label={`Desafio da temporada ${c.ano}`}>
    <header className="dt-header"><span>DESAFIO DA TEMPORADA</span><span>{resultado ? 'Concluído' : `Nível atual ${ovrDe(c)}`}</span></header>
    {resultado ? <>
      <div className="dt-resultado" role="status">
        <span className="dt-etapa">SUA ESCOLHA</span><h2>{resultado.nome}</h2>
        <div className="dt-evolucao"><div><span>Antes</span><strong>{resultado.ovrAntes}</strong></div><span aria-hidden="true">→</span><div><span>Agora</span><strong>{resultado.ovrDepois}</strong></div><b className={resultado.d < 0 ? 'dt-perda' : ''}>{pontos(resultado.d)} OVR</b></div>
        <p>{resultado.txt}</p>
        {resultado.efeitos?.length > 0 && <ul className="dt-efeitos">{resultado.efeitos.filter(e => !/OVR$/.test(e.txt)).map(e => <li key={e.txt}>{e.txt}</li>)}</ul>}
      </div>
      <footer className="dt-footer"><button onClick={onContinuar}>Continuar para o treino <span aria-hidden="true">→</span></button><p>O resultado já foi salvo. Agora prepare a temporada.</p></footer>
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
