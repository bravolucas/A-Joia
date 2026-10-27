import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { TacaCompeticao } from './trofeus.jsx';
import { escudoDe, bandeiraDe } from './arte.js';
import { competicaoDoTitulo } from './tacas.js';
import {
  cartaAtualTecnico, historicoProfissionalTecnico, objetivoTecnico,
  LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico,
  competicaoTemporadaTecnico, calcularOvrTecnico, salarioTecnico,
  OPCOES_REUNIAO_TECNICO
} from './tecnico.js';

function Escudo({ nome, size = 32 }) {
  const src = escudoDe(nome);
  return src
    ? <img src={src} alt="" className="object-contain shrink-0" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="shrink-0 flex items-center justify-center rounded-full bg-white/10" style={{ width: size, height: size }}>⚽</span>;
}

function Bandeira({ pais }) {
  const src = bandeiraDe(pais);
  return src ? <img src={src} alt={pais} className="w-5 h-4 rounded-sm object-cover" /> : <span aria-label={pais || 'País'}>🌎</span>;
}

function PopUpTitulo({ temporada, titulo, indice, total, onFechar }) {
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confetti({ particleCount: 150, spread: 85, origin: { y: .48 }, colors: ['#D8B44A', '#FFF2BE', '#FFFFFF'] });
    const esc = e => { if (e.key === 'Escape') onFecharRef.current(); };
    document.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = anterior; document.removeEventListener('keydown', esc); };
  }, [temporada.ano, indice]);
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-label="Título conquistado" style={{ background: 'rgba(2,8,7,.94)' }}>
    <div className="w-full max-w-sm rounded-3xl border border-[#D8B44A]/50 text-center px-6 py-7" style={{ background: 'radial-gradient(ellipse at 50% 15%, #65521F 0%, #19231E 50%, #0D1512 100%)', boxShadow: '0 0 70px #D8B44A30' }}>
      <div className="text-[#EBC557] font-black tracking-[.22em] text-xs uppercase">A JOIA · Temporada {temporada.ano}</div>
      <h2 className="display text-4xl text-white mt-2">CAMPEÃO!</h2>
      <div className="flex justify-center my-6"><TacaCompeticao tipo={competicaoDoTitulo(titulo).tipo} nome={titulo} size={142} /></div>
      <p className="text-[#F4D67A] font-bold text-xl">{titulo}</p>
      {total > 1 && <p className="text-[#9BAEA3] text-xs mt-2">Conquista {indice + 1} de {total}</p>}
      <div className="flex items-center justify-center gap-3 mt-3"><Escudo nome={temporada.clube} size={35} /><span className="text-white font-bold text-lg">{temporada.clube}</span></div>
      <p className="text-[#B6C2BA] text-sm mt-3">{temporada.posicao}º na liga · {temporada.pontos} pontos · {temporada.vitorias} vitórias</p>
      <button autoFocus onClick={onFechar} className="rp-btn rp-ouro w-full mt-7">{indice + 1 < total ? 'Próximo troféu' : 'Continuar carreira'}</button>
    </div>
  </div>, document.body);
}

function linhaHistorico(a, ativa) {
  const titulos = a.titulosConquistados || (a.campeao ? [competicaoTemporadaTecnico(a)] : []);
  return <>
    <div className="flex items-center gap-3 min-w-0">
      <span className="cp-ovr rounded-full w-11 h-11 flex items-center justify-center text-white text-xs font-black shrink-0">{a.ano}</span>
      <Escudo nome={a.clube} size={34} />
      <span className="min-w-0 flex-1">
        <strong className="block text-[15px] text-white truncate">{a.clube}</strong>
        <span className="block text-xs text-[#A1A1AA] truncate">{competicaoTemporadaTecnico(a)}</span>
      </span>
      <span className="text-right shrink-0"><strong className="block text-white text-sm">{a.posicao}º</strong><span className="text-[11px] text-[#A1A1AA]">{a.pontos} pts</span></span>
    </div>
    {titulos.length > 0 && <div className="flex items-center flex-wrap gap-2 mt-3 pl-[58px]">{titulos.map(nome => <span key={nome} className="inline-flex items-center gap-1.5 rounded-full bg-[#322918] border border-[#E3B949]/20 px-2 py-1 text-[11px] text-[#F0D27B]"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={17} />{nome}</span>)}</div>}
    {ativa && <span className="sr-only">temporada selecionada</span>}
  </>;
}

export default function CarreiraTecnico({ c, onDecisao, onSimularTemporada, onAvancar, onAvancarESimular, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado, onReuniao, onJogar }) {
  const t = c.tecnico;
  const temporadas = t.temporadas || [];
  const ultima = temporadas.at(-1);
  const primeira = temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0;
  const semClube = t.demitido || t.desempregado;
  const encerrada = carreiraTecnicoEncerrada(t);
  const carta = t.fase === 'pretemporada' && !encerrada ? cartaAtualTecnico(t) : null;
  const historico = historicoProfissionalTecnico(t);
  const titulos = titulosConquistadosTecnico(t);
  const [titulosVistos, setTitulosVistos] = useState({ chave: null, quantidade: 0 });
  const [simulando, setSimulando] = useState(false);
  const [temporadaAberta, setTemporadaAberta] = useState(null);
  const [historicoExpandido, setHistoricoExpandido] = useState(false);
  const [negociacaoFalhou, setNegociacaoFalhou] = useState(null);
  const atualRef = useRef(null);
  const conquistasUltima = ultima ? (Array.isArray(ultima.titulosConquistados) ? ultima.titulosConquistados : (ultima.campeao ? [competicaoTemporadaTecnico(ultima)] : [])) : [];
  const chaveTitulo = conquistasUltima.length ? `${temporadas.length}|${ultima.ano}|${ultima.clube}|${conquistasUltima.join('|')}` : null;
  const indiceTitulo = titulosVistos.chave === chaveTitulo ? titulosVistos.quantidade : 0;
  const mostrarTitulo = t.fase === 'resultado' && !!chaveTitulo && indiceTitulo < conquistasUltima.length;
  const decisaoFeita = (t.decisoes || []).some(d => d.opcao && d.opcao !== 'neutra');
  const decisaoRegistrada = [...(t.decisoes || [])].reverse().find(d => d.opcao && d.opcao !== 'neutra');
  const rating = calcularOvrTecnico(t);
  const idadeTecnico = (t.idadeInicio || c.idade || 0) + temporadas.length;
  const objetivo = objetivoTecnico(t);

  useEffect(() => {
    if (t.fase === 'resultado') setSimulando(false);
    setNegociacaoFalhou(t.ultimaNegociacao?.aceita === false ? t.ultimaNegociacao.clube : null);
    if (temporadaAberta != null && !temporadas.some(a => String(a.ano) === String(temporadaAberta))) setTemporadaAberta(null);
  }, [t.fase, t.ano, temporadas.length, t.ultimaNegociacao?.clube, t.ultimaNegociacao?.aceita]);

  const simular = opcaoId => {
    if (simulando || primeira || encerrada) return;
    setSimulando(true);
    try {
      if (opcaoId && onDecisao) onDecisao(opcaoId);
      onSimularTemporada?.();
    } catch (erro) {
      setSimulando(false);
      throw erro;
    }
  };

  const proximaTemporada = () => {
    setNegociacaoFalhou(null);
    if (onAvancar) onAvancar();
    else onAvancarESimular?.();
  };

  const mostrarDecisao = t.fase === 'pretemporada' && !primeira && !encerrada && !t.reuniaoPendente;

  return <main className="cp w-full max-w-3xl mx-auto px-3 sm:px-5 py-4 sm:py-7 rp-entra">
    {mostrarTitulo && <PopUpTitulo temporada={ultima} titulo={conquistasUltima[indiceTitulo]} indice={indiceTitulo} total={conquistasUltima.length} onFechar={() => setTitulosVistos({ chave: chaveTitulo, quantidade: indiceTitulo + 1 })} />}

    <header className="cp-card p-4 sm:p-5 mb-3">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="cp-ovr rounded-2xl w-[68px] h-[72px] flex flex-col items-center justify-center shrink-0 shadow-lg">
          <span className="text-[10px] font-black tracking-widest">OVR</span><strong className="text-3xl leading-none">{rating}</strong>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA]"><Bandeira pais={t.pais || 'Brasil'} /><span className="uppercase tracking-[.16em] font-bold">Carreira de treinador</span></div>
          <h1 className="text-white text-xl sm:text-2xl font-black truncate mt-1">{c.nome}</h1>
          <div className="flex items-center gap-1.5 text-sm text-[#D4D4D8] truncate mt-0.5"><Escudo nome={semClube ? 'Sem clube' : t.clube} size={20} /><span className="truncate">{semClube ? 'Sem clube' : t.clube}</span></div>
        </div>
        <div className="text-right shrink-0"><strong className="block text-white text-2xl leading-none">{idadeTecnico}</strong><span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">anos</span></div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/[.07] text-center">
        {[[historico.jogos, 'jogos'], [historico.vitorias, 'vitórias'], [titulos.length, 'títulos'], [`${t.diretoria ?? 60}%`, 'diretoria']].map(([valor, rotulo]) => <div key={rotulo}><strong className="block text-white text-base sm:text-lg">{valor}</strong><span className="text-[10px] text-[#A1A1AA] uppercase tracking-wide">{rotulo}</span></div>)}
      </div>
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/[.07] text-xs text-[#A1A1AA]">
        <span>Temporada {t.ano} · {temporadas.length}/{LIMITE_TEMPORADAS_TECNICO}</span>
        <span className="text-[#F0C968]">R$ {salarioTecnico(t)} mil/mês</span>
      </div>
    </header>

    <section ref={atualRef} className="cp-card overflow-hidden mb-3" aria-live="polite">
      <div className="px-4 sm:px-5 py-3 border-b border-white/[.07] flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[.18em] font-black text-[#A1A1AA]">{primeira ? 'Próximo capítulo' : t.fase === 'resultado' ? 'Temporada concluída' : 'Decisão da temporada'}</span>
        <span className="rounded-full bg-white/[.06] px-3 py-1 text-xs font-bold text-white">{t.ano} · intensa</span>
      </div>

      {primeira ? <div className="p-4 sm:p-5">
        <h2 className="text-white text-lg sm:text-xl font-bold">Onde sua carreira como treinador começa?</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">Escolha um clube ligado à sua trajetória como jogador.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">{t.opcoesInicio.map(op => <button key={op.clube} onClick={() => onEscolherClubeInicial?.(op.clube)} className="cp-card p-3 flex items-center gap-3 text-left hover:border-white/30 transition">
          <Escudo nome={op.clube} size={44} /><span className="min-w-0 flex-1"><strong className="block text-white text-sm truncate">{op.clube}</strong><span className="block text-xs text-[#A1A1AA] mt-1">{op.idolatria ? 'Seu clube do coração' : 'Clube da sua carreira'} · vínculo {op.afinidade}/100</span></span><span className="text-white">→</span>
        </button>)}</div>
      </div> : mostrarDecisao ? <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3"><Escudo nome={t.clube} size={42} /><div className="min-w-0"><h2 className="text-white font-bold truncate">{t.clube}</h2><p className="text-xs text-[#A1A1AA] truncate">{competicaoTemporadaTecnico({ clube: t.clube, liga: t.liga })} · meta: {objetivo.nome}</p></div></div>
        <h3 className="text-white text-lg sm:text-xl font-bold leading-snug">{carta?.titulo || 'A comissão prepara a temporada'}</h3>
        <p className="text-sm text-[#A1A1AA] leading-relaxed mt-1">{carta?.texto || 'Simule a temporada para descobrir como seu trabalho será avaliado.'}</p>
        {carta && <div className="grid grid-cols-1 gap-2 mt-4">{carta.opcoes.map((op, i) => <button key={op.id} type="button" disabled={simulando} onClick={() => simular(op.id)} className="cp-card w-full p-3.5 flex items-center gap-3 text-left hover:border-white/35 hover:bg-white/[.025] disabled:opacity-50 transition">
          <span className="w-8 h-8 rounded-full bg-white/[.07] text-[#FACC15] flex items-center justify-center font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
          <span className="min-w-0 flex-1"><strong className="block text-white text-sm sm:text-base">{op.nome}</strong><span className="block text-xs text-[#A1A1AA] mt-0.5">{op.detalhe}</span></span><span className="text-[#A1A1AA] text-lg">→</span>
        </button>)}</div>}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {[['Elenco', `${t.elenco ?? 50}`], ['Torcida', `${t.torcida ?? 55}`], ['Objetivo', `${objetivo.posicao}º`]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#0D0D0F] py-2"><strong className="block text-white text-sm">{value}</strong><span className="text-[10px] text-[#A1A1AA]">{label}</span></div>)}
        </div>
        {!carta && <button type="button" disabled={simulando} onClick={() => simular()} className="cp-pill cp-branca w-full mt-4">{simulando ? 'Simulando…' : 'Simular temporada'}</button>}
        {simulando && <p role="status" className="text-xs text-[#A1A1AA] text-center mt-3">Simulando a temporada…</p>}
      </div> : t.reuniaoPendente ? <div className="p-4 sm:p-5">
        <h2 className="text-white text-lg font-bold">A diretoria pediu uma resposta</h2><p className="text-sm text-[#A1A1AA] mt-1">Escolha como conduzir a conversa antes da próxima etapa.</p>
        <div className="grid gap-2 mt-4">{OPCOES_REUNIAO_TECNICO.map(op => <button key={op.id} onClick={() => { onReuniao?.(op.id); onJogar?.(); }} className="cp-card p-3 text-left hover:border-white/30"><strong className="block text-white text-sm">{op.nome}</strong><span className="text-xs text-[#A1A1AA]">{op.descricao}</span></button>)}</div>
      </div> : t.fase === 'resultado' ? <div className="p-4 sm:p-5">
        {ultima && <>
          <div className="flex items-center gap-3"><Escudo nome={ultima.clube} size={48} /><div><h2 className="text-white text-xl font-bold">{ultima.clube}</h2><p className="text-sm text-[#A1A1AA]">{ultima.ano} · {competicaoTemporadaTecnico(ultima)}</p></div><span className="ml-auto text-right"><strong className="block text-3xl text-white">{ultima.posicao}º</strong><span className="text-[10px] text-[#A1A1AA]">LUGAR</span></span></div>
          <div className="grid grid-cols-4 gap-2 mt-4">{[['Pontos', ultima.pontos], ['Vitórias', ultima.vitorias], ['Empates', ultima.empates], ['Derrotas', ultima.derrotas]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#0D0D0F] py-2 text-center"><strong className="block text-white text-lg">{value}</strong><span className="text-[10px] text-[#A1A1AA]">{label}</span></div>)}</div>
          <div className="rounded-xl bg-[#0D0D0F] px-3 py-2 mt-3 text-sm text-[#D4D4D8]">Meta: {ultima.objetivo} · <strong className={ultima.cumpriuObjetivo ? 'text-emerald-300' : 'text-amber-300'}>{ultima.cumpriuObjetivo ? 'atingida' : 'não atingida'}</strong></div>
          {!!conquistasUltima.length && <div className="flex flex-wrap gap-2 mt-3">{conquistasUltima.map(nome => <span key={nome} className="inline-flex items-center gap-2 rounded-full bg-[#322918] border border-[#E3B949]/25 px-3 py-1.5 text-xs text-[#F0D27B]"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={22} />{nome}</span>)}</div>}
        </>}
        {semClube && <div className="rounded-xl border border-red-400/20 bg-red-950/20 p-3 mt-4"><strong className="text-red-200">{t.demitido ? 'Você foi demitido' : 'Você está sem clube'}</strong><p className="text-sm text-red-100/70 mt-1">{t.demitido ? 'Novas propostas podem abrir o próximo capítulo.' : 'Aguarde convites para voltar à beira do campo.'}</p></div>}
        {!!t.propostas?.length && <div className="mt-4"><h3 className="text-white font-bold text-sm">{semClube ? 'Escolha seu próximo clube' : 'Propostas recebidas'}</h3><div className="grid gap-2 mt-2">{t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta?.(p.nome, 'prudente')} className="cp-card p-3 flex items-center gap-3 text-left hover:border-white/30"><Escudo nome={p.nome} size={40} /><span className="min-w-0 flex-1"><strong className="block text-white text-sm truncate">{p.nome}</strong><span className="block text-xs text-[#A1A1AA] mt-0.5">{p.pais} · objetivo: {p.objetivo}</span></span><span className="text-xs text-[#D4D4D8] shrink-0">R$ {p.salario} mil/mês</span><span className="text-white">→</span></button>)}</div></div>}
        {negociacaoFalhou && <p role="status" className="text-sm text-amber-200 mt-3">A diretoria de {negociacaoFalhou} recusou a proposta. Escolha outra opção.</p>}
        {semClube && !t.propostas?.length && <button onClick={onEsperar} className="cp-pill cp-branca w-full mt-4">Aguardar propostas</button>}
        {!encerrada && !semClube && <button onClick={proximaTemporada} className="cp-pill cp-branca w-full mt-4">Próxima temporada <span aria-hidden="true">→</span></button>}
        {encerrada && <div className="rounded-xl bg-[#322918] p-3 mt-4 text-center"><strong className="text-[#F0D27B]">Fim da carreira de treinador</strong><p className="text-xs text-[#A1A1AA] mt-1">{LIMITE_TEMPORADAS_TECNICO} temporadas concluídas.</p></div>}
      </div> : <div className="p-5 text-sm text-[#A1A1AA]">Carreira indisponível.</div>}
    </section>

    <section className="cp-card overflow-hidden">
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b border-white/[.07]">
        <div><h2 className="text-white font-bold">Sua trajetória</h2><p className="text-xs text-[#A1A1AA] mt-0.5">Temporadas, clubes e conquistas em ordem.</p></div>
        <span className="text-xs text-[#A1A1AA]">{temporadas.length} anos</span>
      </div>
      <div className="p-3 sm:p-4">
        {temporadas.length === 0 && <p className="text-center text-sm text-[#A1A1AA] py-5">Sua carreira vai aparecer aqui depois da primeira temporada.</p>}
        <div className="grid gap-2">{(historicoExpandido ? temporadas : temporadas.slice(-8)).map(a => {
          const aberta = String(temporadaAberta) === String(a.ano);
          return <div key={a.ano} className="cp-card overflow-hidden">
            <button type="button" aria-expanded={aberta} onClick={() => setTemporadaAberta(aberta ? null : a.ano)} className="w-full p-3 text-left hover:bg-white/[.025] transition">{linhaHistorico(a, aberta)}</button>
            {aberta && <div className="border-t border-white/[.07] px-3 pb-3 pt-2 ml-3 text-xs text-[#A1A1AA]">
              <div>{a.vitorias} vitórias · {a.empates} empates · {a.derrotas} derrotas · {a.pontos} pontos</div>
              <div className="mt-1">Meta: {a.objetivo} · {a.cumpriuObjetivo ? 'atingida' : 'não atingida'}</div>
              {a.classificacao?.length > 0 && <details className="mt-2"><summary className="cursor-pointer text-[#D4D4D8]">Ver classificação final</summary><div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-white/[.07]">{a.classificacao.map(l => <div key={l.nome} className={'grid grid-cols-[2rem_1fr_3rem_3rem] gap-2 px-3 py-1.5 border-b border-white/[.05] last:border-0 '+(l.meuClube ? 'text-[#F0D27B] font-bold' : 'text-[#A1A1AA]')}><span>{l.posicao}</span><span className="truncate">{l.nome}</span><span className="text-right">{l.vitorias}V</span><span className="text-right">{l.pontos} pts</span></div>)}</div></details>}
            </div>}
          </div>;
        })}</div>
        {temporadas.length > 8 && <button onClick={() => setHistoricoExpandido(v => !v)} className="w-full py-3 text-xs font-bold text-[#D4D4D8]">{historicoExpandido ? 'Mostrar últimas 8 temporadas' : `Ver todas as ${temporadas.length} temporadas`}</button>}
      </div>
      {(titulos.length > 0 || encerrada) && <details className="border-t border-white/[.07] px-4 py-3">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-2"><span className="text-white text-sm font-bold">Vitrine de títulos</span><span className="text-xs text-[#A1A1AA]">{titulos.length} conquistas</span></summary>
        <div className="grid grid-cols-2 gap-2 mt-3">{titulos.map((titulo, i) => <div key={`${titulo.ano}-${titulo.nome}-${i}`} className="cp-card flex items-center gap-2 p-2"><TacaCompeticao tipo={titulo.tipo} nome={titulo.nome} size={34} /><span className="min-w-0"><strong className="block text-xs text-[#F0D27B] truncate">{titulo.nome}</strong><span className="text-[10px] text-[#A1A1AA]">{titulo.ano} · {titulo.clube}</span></span></div>)}</div>
      </details>}
    </section>

    <footer className="flex items-center justify-between gap-3 mt-3 px-1">
      <button onClick={onLegado} className="text-xs text-[#A1A1AA] hover:text-white">Ver legado como jogador</button>
      <button onClick={onSair} className="text-xs text-[#A1A1AA] hover:text-white">Voltar ao menu</button>
    </footer>
  </main>;
}
