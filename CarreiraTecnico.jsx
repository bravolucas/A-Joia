import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { TacaCompeticao } from './trofeus.jsx';
import { escudoDe } from './arte.js';
import { competicaoDoTitulo } from './tacas.js';
import { cartaAtualTecnico, historicoProfissionalTecnico, objetivoTecnico, LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico, competicaoTemporadaTecnico } from './tecnico.js';

function Escudo({ nome, size = 42 }) {
  const src = escudoDe(nome);
  return src ? <img src={src} alt={nome} style={{width:size,height:size,objectFit:'contain'}} /> : <div className="rounded-full bg-white/10 flex items-center justify-center text-xl" style={{width:size,height:size}}>⚽</div>;
}
function PopUpTitulo({ temporada, onFechar }) {
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confetti({particleCount:150,spread:85,origin:{y:.48},colors:['#D8B44A','#FFF2BE','#FFFFFF']});
    const esc = e => { if(e.key === 'Escape') onFecharRef.current(); };
    document.addEventListener('keydown',esc);
    return () => { document.body.style.overflow = anterior; document.removeEventListener('keydown',esc); };
  }, [temporada.ano]);
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-label="Título conquistado" style={{background:'rgba(2,8,7,.94)'}}>
    <div className="w-full max-w-sm rounded-3xl border border-[#D8B44A]/50 text-center px-6 py-7 relative overflow-hidden" style={{background:'radial-gradient(ellipse at 50% 15%, #65521F 0%, #19231E 50%, #0D1512 100%)',boxShadow:'0 0 70px #D8B44A30'}}>
      <div className="text-[#EBC557] font-black tracking-[.22em] text-xs uppercase">A JOIA · Temporada {temporada.ano}</div>
      <h2 className="display text-4xl text-white mt-2">CAMPEÃO!</h2>
      <div className="flex justify-center my-6" style={{filter:'drop-shadow(0 0 24px #D8B44A80)'}}><TacaCompeticao preferirTaca tipo={competicaoDoTitulo(competicaoTemporadaTecnico(temporada)).tipo} nome={competicaoTemporadaTecnico(temporada)} size={142}/></div>
      <p className="text-[#F4D67A] font-bold text-lg">{competicaoTemporadaTecnico(temporada)}</p>
      <div className="flex items-center justify-center gap-3 mt-3"><Escudo nome={temporada.clube} size={35}/><span className="text-white font-bold text-lg">{temporada.clube}</span></div>
      <p className="text-[#B6C2BA] text-sm mt-3">{temporada.pontos} pontos · {temporada.vitorias} vitórias</p>
      <button autoFocus onClick={onFechar} className="rp-btn rp-ouro w-full mt-7">Continuar carreira</button>
    </div>
  </div>,document.body);
}

export default function CarreiraTecnico({ c, onDecisao, onAvancar, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
  const t = c.tecnico;
  const temporadas = t.temporadas || [];
  const ultima = temporadas.at(-1);
  const primeira = temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0;
  const semClube = t.demitido || t.desempregado;
  const encerrada = carreiraTecnicoEncerrada(t);
  const carta = cartaAtualTecnico(t);
  const historico = historicoProfissionalTecnico(t);
  const titulos = titulosConquistadosTecnico(t);
  const [tituloVisto, setTituloVisto] = useState(null);
  const [simulando, setSimulando] = useState(false);
  const chaveTitulo = ultima?.campeao ? String(ultima.ano)+'|'+ultima.clube : null;
  const mostrarTitulo = t.fase === 'resultado' && chaveTitulo && tituloVisto !== chaveTitulo;
  useEffect(() => { if (t.fase === 'resultado') setSimulando(false); }, [t.fase, temporadas.length]);
  const escolher = id => { if(simulando) return; setSimulando(true); onDecisao(id); };
  return <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
    {mostrarTitulo && <PopUpTitulo temporada={ultima} onFechar={() => setTituloVisto(chaveTitulo)}/>}
    <header className="rp-painel p-5">
      <div className="text-center text-[#D8B44A] uppercase tracking-[.2em] text-[11px] font-bold">A JOIA · Modo Treinador</div>
      <div className="flex gap-4 items-center mt-4"><Escudo nome={t.clube} size={64}/><div className="min-w-0"><h1 className="display text-2xl text-white">{semClube ? 'Sem clube' : t.clube}</h1><p className="text-[#C9D3CE] text-sm">{c.nome} · {t.pais || 'Brasil'}</p></div></div>
      <div className="grid grid-cols-3 gap-2 mt-5 text-center border-t border-white/10 pt-4">
        <div><strong className="text-white text-xl block">{t.ano}</strong><span className="text-[#8FA39A] text-xs">Próximo ano</span></div>
        <div><strong className="text-white text-xl block">{temporadas.length}/{LIMITE_TEMPORADAS_TECNICO}</strong><span className="text-[#8FA39A] text-xs">Temporadas</span></div>
        <div><strong className="text-[#D8B44A] text-xl block">{titulos.length}</strong><span className="text-[#8FA39A] text-xs">Títulos</span></div>
      </div>
    </header>
    {primeira && <section className="rp-painel p-5"><h2 className="text-white font-bold text-xl">Escolha seu primeiro clube</h2><p className="text-[#8FA39A] text-sm my-2">A continuação da sua carreira como jogador começa aqui.</p><div className="flex flex-col gap-2 mt-3">{t.opcoesInicio.map(op => <button key={op.clube} onClick={() => onEscolherClubeInicial(op.clube)} className="rp-opcao p-3 flex items-center gap-3 text-left"><Escudo nome={op.clube}/><span><strong className="text-white block">{op.clube}</strong><span className="text-[#8FA39A] text-xs">{op.idolatria ? 'Seu clube de coração · ' : ''}Afinidade {op.afinidade}/100</span></span></button>)}</div></section>}
    {t.fase === 'pretemporada' && !encerrada && !primeira && !semClube && <section className="rp-painel p-5">
      <div className="flex items-center justify-between"><span className="text-[#D8B44A] text-xs uppercase font-bold">Temporada {t.ano}</span><span className="text-[#8FA39A] text-xs">1 decisão → 1 ano</span></div>
      <h2 className="text-white font-bold text-xl mt-3">{carta?.titulo || 'Preparar a temporada'}</h2>
      <p className="text-[#C9D3CE] text-sm mt-2">{carta?.texto || 'Escolha uma estratégia para a próxima temporada.'}</p>
      <div className="flex flex-col gap-2 mt-4">{(carta?.opcoes || []).map((op,i) => <button key={op.id} disabled={simulando} onClick={() => escolher(op.id)} className="rp-opcao p-4 flex gap-3 text-left disabled:opacity-50"><span className="text-[#D8B44A] font-bold">{i+1}.</span><span><strong className="text-white block">{op.nome}</strong>{op.detalhe && <span className="text-[#8FA39A] text-xs">{op.detalhe}</span>}</span></button>)}</div>
      {simulando && <p role="status" className="text-[#EBC557] text-sm mt-4 text-center">Simulando a temporada completa…</p>}
    </section>}
    {t.fase === 'resultado' && <section className="rp-painel p-5">
      <span className="text-[#D8B44A] text-xs font-bold uppercase">Fim da temporada {ultima?.ano}</span>
      <h2 className="text-white text-2xl font-bold mt-2">{ultima?.campeao ? '🏆 Campeão!' : ultima?.posicao+'º lugar no campeonato'}</h2>
      <p className="text-[#C9D3CE] text-sm mt-2">{ultima?.clube} · {competicaoTemporadaTecnico(ultima)} · {ultima?.pontos} pontos</p>
      <div className="grid grid-cols-3 gap-2 text-center mt-4">{[['Vitórias',ultima?.vitorias],['Empates',ultima?.empates],['Derrotas',ultima?.derrotas]].map(([nome,valor]) => <div key={nome} className="rounded-xl bg-white/5 p-3"><strong className="text-white text-xl block">{valor}</strong><span className="text-[#8FA39A] text-xs">{nome}</span></div>)}</div>
      <p className="text-[#8FA39A] text-sm mt-3">Objetivo: {ultima?.objetivo} · {ultima?.cumpriuObjetivo ? 'Cumprido' : 'Não cumprido'}</p>
      {encerrada ? <div className="mt-5 rounded-xl border border-[#D8B44A]/40 p-4 text-center"><h3 className="text-[#EBC557] font-bold text-xl">Fim da carreira de treinador</h3><p className="text-[#C9D3CE] text-sm mt-2">30 temporadas completas. Confira todas as suas taças na vitrine abaixo.</p></div> : <>
        {t.ultimaNegociacao && !t.ultimaNegociacao.aceita && <p className="text-[#F0A99E] text-sm mt-3">{t.ultimaNegociacao.motivo}</p>}
        {(t.propostas || []).length > 0 && <div className="mt-5"><h3 className="text-white font-bold mb-2">Propostas para a próxima temporada</h3><div className="flex flex-col gap-2">{t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome,'prudente')} className="rp-opcao p-3 flex items-center gap-3 text-left"><Escudo nome={p.nome}/><span><strong className="text-white block">{p.nome}</strong><span className="text-[#8FA39A] text-xs">{p.pais} · R$ {p.salario} mil/mês</span></span></button>)}</div></div>}
        {!semClube ? <button onClick={onAvancar} className="rp-btn rp-ouro w-full mt-4">Continuar no {t.clube} → {t.ano}</button> : <button onClick={onEsperar} className="rp-btn rp-sec w-full mt-4">Aguardar propostas</button>}
      </>}
    </section>}
    <section className="rp-painel p-4"><h2 className="text-white font-bold text-lg">Histórico ano após ano</h2><div className="mt-3 flex flex-col gap-2">{[...temporadas].reverse().map((a,i) => <div key={a.ano+'-'+i} className="flex items-center gap-3 border-b border-white/10 py-2"><span className="text-[#D8B44A] font-bold text-sm w-12">{a.ano}</span><Escudo nome={a.clube} size={31}/><div className="flex-1 min-w-0"><p className="text-white text-sm font-bold truncate">{a.clube}</p><p className="text-[#8FA39A] text-xs">{a.posicao}º lugar · {a.pontos} pts</p></div>{a.campeao && <div title={competicaoTemporadaTecnico(a)}><TacaCompeticao preferirTaca tipo={competicaoDoTitulo(competicaoTemporadaTecnico(a)).tipo} nome={competicaoTemporadaTecnico(a)} size={37}/></div>}</div>)}</div>{temporadas.length===0 && <p className="text-[#8FA39A] text-sm">Sua primeira temporada aparecerá aqui.</p>}</section>
    {(encerrada || titulos.length > 0) && <section className="rp-painel p-5"><h2 className="text-[#EBC557] text-xl font-bold">🏆 Vitrine de títulos</h2><p className="text-[#8FA39A] text-sm mt-1">{titulos.length} conquistas em {temporadas.length} temporadas · {historico.jogos} partidas</p><div className="grid grid-cols-3 gap-3 mt-5">{titulos.length ? titulos.map((titulo,i) => <div key={i} className="flex flex-col items-center text-center gap-2 rounded-xl bg-white/5 p-3"><TacaCompeticao preferirTaca tipo={titulo.tipo} nome={titulo.nome} size={57}/><strong className="text-white text-xs">{titulo.nome}</strong><span className="text-[#8FA39A] text-xs">{titulo.ano} · {titulo.clube}</span></div>) : <p className="text-[#8FA39A] text-sm col-span-3">Nenhum título conquistado.</p>}</div></section>}
    <button onClick={onLegado} className="rp-btn rp-sec">Ver legado como jogador</button>
    <button onClick={onSair} className="text-[#8FA39A] text-sm py-2">Voltar ao menu · progresso salvo</button>
  </div>;
}
