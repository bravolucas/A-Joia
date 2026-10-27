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
      <div className="flex justify-center flex-wrap gap-4 my-6" style={{filter:'drop-shadow(0 0 24px #D8B44A80)'}}>{(temporada.titulosConquistados?.length ? temporada.titulosConquistados : [competicaoTemporadaTecnico(temporada)]).map(nome => <TacaCompeticao key={nome} tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={temporada.titulosConquistados?.length > 1 ? 95 : 142}/>)}</div>
      <div className="flex flex-col gap-2 items-center">{(temporada.titulosConquistados?.length ? temporada.titulosConquistados : [competicaoTemporadaTecnico(temporada)]).map(nome => <p key={nome} className="text-[#F4D67A] font-bold text-lg">🏆 {nome}</p>)}</div>
      <div className="flex items-center justify-center gap-3 mt-3"><Escudo nome={temporada.clube} size={35}/><span className="text-white font-bold text-lg">{temporada.clube}</span></div>
      <p className="text-[#B6C2BA] text-sm mt-3">{temporada.posicao}º na liga · {temporada.pontos} pontos · {temporada.vitorias} vitórias</p>
      <button autoFocus onClick={onFechar} className="rp-btn rp-ouro w-full mt-7">Continuar carreira</button>
    </div>
  </div>,document.body);
}

export default function CarreiraTecnico({ c, onDecisao, onAvancar, onAvancarESimular, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
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
  const conquistasUltima = ultima ? (Array.isArray(ultima.titulosConquistados) ? ultima.titulosConquistados : (ultima.campeao ? [competicaoTemporadaTecnico(ultima)] : [])) : [];
  const chaveTitulo = conquistasUltima.length ? String(ultima.ano)+'|'+ultima.clube : null;
  const mostrarTitulo = t.fase === 'resultado' && chaveTitulo && tituloVisto !== chaveTitulo;
  useEffect(() => { if (t.fase === 'resultado') setSimulando(false); }, [t.fase, temporadas.length]);
  const escolher = id => {
    if (simulando) return;
    setSimulando(true);
    try {
      const resultado = onDecisao(id);
      // Suporta callbacks sincronos e assincronos sem travar os botoes apos falhas.
      if (resultado && typeof resultado.then === 'function') {
        Promise.resolve(resultado).catch(() => setSimulando(false));
      }
    } catch (erro) {
      setSimulando(false);
      throw erro;
    }
  };
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
    {t.fase === 'pretemporada' && !encerrada && !primeira && !semClube && <section className="rp-painel p-5 text-center">
      <div className="text-[#D8B44A] text-xs uppercase font-bold tracking-[.2em]">Carreira de treinador · {t.ano}</div>
      <div className="mt-4 flex justify-center gap-2 flex-wrap"><span className="rounded-full bg-white/10 px-3 py-1 text-[#C9D3CE] text-xs">Temporada {temporadas.length + 1} de {LIMITE_TEMPORADAS_TECNICO}</span><span className="rounded-full bg-[#D8B44A]/15 px-3 py-1 text-[#F4D67A] text-xs">Simulação expressa</span></div>
      <div className="flex items-center justify-center gap-3 mt-5"><Escudo nome={t.clube} size={60}/><div className="text-left"><h2 className="text-white text-xl font-black">{t.clube}</h2><p className="text-[#8FA39A] text-sm">{competicaoTemporadaTecnico({clube:t.clube,liga:t.liga})}</p></div></div>
      <div className="grid grid-cols-3 gap-2 mt-5 text-center"><div className="rounded-xl bg-white/5 p-3"><strong className="text-white text-lg block">{t.reputacao ?? 50}</strong><span className="text-[#8FA39A] text-[11px]">Reputação</span></div><div className="rounded-xl bg-white/5 p-3"><strong className="text-white text-lg block">{t.diretoria ?? 60}%</strong><span className="text-[#8FA39A] text-[11px]">Diretoria</span></div><div className="rounded-xl bg-white/5 p-3"><strong className="text-white text-lg block">{t.torcida ?? 55}%</strong><span className="text-[#8FA39A] text-[11px]">Torcida</span></div></div>
      <p className="text-[#C9D3CE] text-sm mt-5">Simule o campeonato inteiro em um toque. Resultados, classificação e propostas aparecem ao final da temporada.</p>
      <button disabled={simulando} onClick={() => escolher(null)} className="rp-btn rp-ouro w-full mt-6 text-lg disabled:opacity-50">{simulando ? 'Simulando campeonato…' : '▶ Simular temporada '+t.ano}</button>
      {simulando && <p role="status" className="text-[#EBC557] text-sm mt-4">Calculando partidas e classificação…</p>}
    </section>}
    {t.fase === 'resultado' && <section className="rp-painel p-5">
      <span className="text-[#D8B44A] text-xs font-bold uppercase">Fim da temporada {ultima?.ano}</span>
      {ultima?.demitido && <div role="status" className="mt-3 rounded-xl border border-red-400/30 bg-red-950/30 p-3 text-left"><strong className="text-red-200 text-sm block">Fim de contrato · Demissão</strong><p className="text-red-100/80 text-xs mt-1">A diretoria decidiu encerrar seu trabalho. Analise as propostas disponíveis ou aguarde novas oportunidades.</p></div>}
      <h2 className="text-white text-2xl font-bold mt-2">{(ultima?.titulosConquistados?.length || ultima?.campeao) ? '🏆 Temporada com títulos!' : ultima?.posicao+'º lugar no campeonato'}</h2>
      <p className="text-[#C9D3CE] text-sm mt-2">{ultima?.clube} · {competicaoTemporadaTecnico(ultima)} · {ultima?.pontos} pontos</p>
      {ultima?.titulosConquistados?.length > 0 && <div className="mt-4 grid grid-cols-2 gap-2">{ultima.titulosConquistados.map(nome => <div key={nome} className="rounded-xl border border-[#D8B44A]/30 bg-[#D8B44A]/10 p-3 flex flex-col items-center gap-2 text-center"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={60}/><strong className="text-[#F4D67A] text-xs">{nome}</strong></div>)}</div>}
      <div className="grid grid-cols-3 gap-2 text-center mt-4">{[['Vitórias',ultima?.vitorias],['Empates',ultima?.empates],['Derrotas',ultima?.derrotas]].map(([nome,valor]) => <div key={nome} className="rounded-xl bg-white/5 p-3"><strong className="text-white text-xl block">{valor}</strong><span className="text-[#8FA39A] text-xs">{nome}</span></div>)}</div>
      {ultima?.classificacao?.length > 0 && <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
        <div className="px-3 py-3 bg-white/5 text-white font-bold text-sm">Classificação final · {competicaoTemporadaTecnico(ultima)}</div>
        <div className="grid grid-cols-[2rem_1fr_2.2rem_2.2rem_2.2rem] gap-2 px-3 py-2 text-[10px] text-[#8FA39A] uppercase"><span>#</span><span>Clube</span><span className="text-right">J</span><span className="text-right">V</span><span className="text-right">Pts</span></div>
        <div className="max-h-80 overflow-y-auto">{ultima.classificacao.map(linha => <div key={linha.nome} className={`grid grid-cols-[2rem_1fr_2.2rem_2.2rem_2.2rem] gap-2 items-center px-3 py-2 border-t border-white/5 text-xs ${linha.meuClube ? 'bg-[#D8B44A]/15 text-[#F4D67A] font-bold' : 'text-[#C9D3CE]'}`}>
          <span>{linha.posicao}</span><span className="flex items-center gap-2 min-w-0"><Escudo nome={linha.nome} size={20}/><span className="truncate">{linha.nome}</span></span><span className="text-right">{linha.jogos}</span><span className="text-right">{linha.vitorias}</span><span className="text-right font-bold">{linha.pontos}</span>
        </div>)}</div>
      </div>}
      <p className="text-[#8FA39A] text-sm mt-3">Objetivo: {ultima?.objetivo} · {ultima?.cumpriuObjetivo ? 'Cumprido' : 'Não cumprido'}</p>
      {encerrada ? <div className="mt-5 rounded-xl border border-[#D8B44A]/40 p-4 text-center"><h3 className="text-[#EBC557] font-bold text-xl">Fim da carreira de treinador</h3><p className="text-[#C9D3CE] text-sm mt-2">30 temporadas completas. Confira todas as suas taças na vitrine abaixo.</p></div> : <>
        {t.ultimaNegociacao && !t.ultimaNegociacao.aceita && <p className="text-[#F0A99E] text-sm mt-3">{t.ultimaNegociacao.motivo}</p>}
        {(t.propostas || []).length > 0 && <div className="mt-5"><h3 className="text-white font-bold mb-2">Propostas para a próxima temporada</h3><div className="flex flex-col gap-2">{t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome,'prudente')} className="rp-opcao p-3 flex items-center gap-3 text-left"><Escudo nome={p.nome}/><span><strong className="text-white block">{p.nome}</strong><span className="text-[#8FA39A] text-xs">{p.pais} · R$ {p.salario} mil/mês</span></span></button>)}</div></div>}
        {!semClube ? <button onClick={onAvancarESimular || onAvancar} className="rp-btn rp-ouro w-full mt-4">▶ Simular {t.ano} · {t.clube}</button> : <button onClick={onEsperar} className="rp-btn rp-sec w-full mt-4">Aguardar propostas</button>}
      </>}
    </section>}
    <section className="rp-painel p-4"><h2 className="text-white font-bold text-lg">Histórico ano após ano</h2><div className="mt-3 flex flex-col gap-2">{[...temporadas].reverse().map((a,i) => <div key={a.ano+'-'+i} className="flex items-center gap-3 border-b border-white/10 py-2"><span className="text-[#D8B44A] font-bold text-sm w-12">{a.ano}</span><Escudo nome={a.clube} size={31}/><div className="flex-1 min-w-0"><p className="text-white text-sm font-bold truncate">{a.clube}</p><p className="text-[#8FA39A] text-xs">{a.posicao}º lugar · {a.pontos} pts</p>{a.classificacao?.length > 0 && <details className="mt-1"><summary className="text-[#D8B44A] text-xs cursor-pointer">Ver classificação de {a.ano}</summary><div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/10">{a.classificacao.map(l => <div key={l.nome} className={`flex gap-2 justify-between px-2 py-1 border-b border-white/5 text-[11px] ${l.meuClube ? 'text-[#F4D67A] font-bold' : 'text-[#C9D3CE]'}`}><span className="truncate">{l.posicao}º {l.nome}</span><span className="shrink-0">{l.pontos} pts</span></div>)}</div></details>}</div>{(Array.isArray(a.titulosConquistados) ? a.titulosConquistados : (a.campeao ? [competicaoTemporadaTecnico(a)] : [])).length > 0 && <div className="flex flex-col gap-1 shrink-0">{(Array.isArray(a.titulosConquistados) ? a.titulosConquistados : [competicaoTemporadaTecnico(a)]).map(nome => <div key={nome} className="flex items-center gap-1" title={nome}><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={28}/><span className="text-[#F4D67A] text-[10px] font-bold max-w-24 leading-tight">{nome}</span></div>)}</div>}</div>)}</div>{temporadas.length===0 && <p className="text-[#8FA39A] text-sm">Sua primeira temporada aparecerá aqui.</p>}</section>
    {(encerrada || titulos.length > 0) && <section className="rp-painel p-5"><h2 className="text-[#EBC557] text-xl font-bold">🏆 Vitrine de títulos</h2><p className="text-[#8FA39A] text-sm mt-1">{titulos.length} conquistas em {temporadas.length} temporadas · {historico.jogos} partidas</p><div className="grid grid-cols-3 gap-3 mt-5">{titulos.length ? titulos.map((titulo,i) => <div key={i} className="flex flex-col items-center text-center gap-2 rounded-xl bg-white/5 p-3"><TacaCompeticao tipo={titulo.tipo} nome={titulo.nome} size={57}/><strong className="text-white text-xs">{titulo.nome}</strong><span className="text-[#8FA39A] text-xs">{titulo.ano} · {titulo.clube}</span></div>) : <p className="text-[#8FA39A] text-sm col-span-3">Nenhum título conquistado.</p>}</div></section>}
    <button onClick={onLegado} className="rp-btn rp-sec">Ver legado como jogador</button>
    <button onClick={onSair} className="text-[#8FA39A] text-sm py-2">Voltar ao menu · progresso salvo</button>
  </div>;
}
