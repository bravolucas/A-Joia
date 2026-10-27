import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { TacaCompeticao } from './trofeus.jsx';
import { escudoDe, bandeiraDe } from './arte.js';
import { competicaoDoTitulo } from './tacas.js';
import {
  historicoProfissionalTecnico, objetivoTecnico,
  LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico,
  competicaoTemporadaTecnico, salarioTecnico,
  OPCOES_REUNIAO_TECNICO
} from './tecnico.js';

function Escudo({ nome, size = 32 }) {
  const src = escudoDe(nome);
  return src ? <img src={src} alt="" className="object-contain shrink-0" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="shrink-0 flex items-center justify-center rounded-full bg-white/10" style={{ width: size, height: size }}>⚽</span>;
}

function Bandeira({ pais }) {
  const src = bandeiraDe(pais);
  return src ? <img src={src} alt={pais} className="w-5 h-4 rounded-sm object-cover" /> : <span aria-label={pais || 'País'}>🌎</span>;
}

function PopUpTitulo({ temporada, titulo, indice, total, onFechar }) {
  const fechar = useRef(onFechar);
  fechar.current = onFechar;
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confetti({ particleCount: 150, spread: 85, origin: { y: .48 }, colors: ['#D8B44A', '#FFF2BE', '#FFFFFF'] });
    const esc = e => { if (e.key === 'Escape') fechar.current(); };
    document.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', esc); };
  }, [temporada.ano, indice]);
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-label="Título conquistado" style={{ background: 'rgba(5,5,6,.88)', backdropFilter: 'blur(7px)' }}>
    <div className="cp-card w-full max-w-sm text-center px-6 py-7 border-[#CA8A04]/50" style={{ background: 'radial-gradient(ellipse at 50% 10%, #382F19, #161618 70%)' }}>
      <div className="text-[#FACC15] font-black tracking-[.2em] text-xs uppercase">A JOIA · Temporada {temporada.ano}</div>
      <h2 className="text-4xl font-black text-white mt-2">CAMPEÃO!</h2>
      <div className="flex justify-center my-5"><TacaCompeticao tipo={competicaoDoTitulo(titulo).tipo} nome={titulo} size={136} /></div>
      <p className="text-[#FDE68A] font-bold text-xl">{titulo}</p>
      {total > 1 && <p className="text-[#A1A1AA] text-xs mt-2">Conquista {indice + 1} de {total}</p>}
      <div className="flex items-center justify-center gap-3 mt-3"><Escudo nome={temporada.clube} size={34} /><span className="text-white font-bold">{temporada.clube}</span></div>
      <p className="text-[#D4D4D8] text-sm mt-3">{temporada.posicao}º na liga · {temporada.pontos} pontos · {temporada.vitorias} vitórias</p>
      <button autoFocus onClick={onFechar} className="cp-pill cp-branca w-full mt-6">{indice + 1 < total ? 'Próximo troféu' : 'Continuar carreira'}</button>
    </div>
  </div>, document.body);
}

function PopUpDivisao({ temporada, movimento, onFechar }) {
  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (movimento.tipo === 'acesso') confetti({ particleCount: 90, spread: 70, origin: { y: .5 }, colors: ['#22C55E', '#FFFFFF', '#D8B44A'] });
    const esc = e => { if (e.key === 'Escape') onFechar(); };
    document.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', esc); };
  }, [temporada.ano, movimento.tipo]);
  const acesso = movimento.tipo === 'acesso';
  const nomeDestino = competicaoTemporadaTecnico({ liga: movimento.para });
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-label={acesso ? 'Acesso de divisão' : 'Rebaixamento'} style={{ background: 'rgba(5,5,6,.88)', backdropFilter: 'blur(7px)' }}>
    <div className={'cp-card w-full max-w-sm text-center px-6 py-7 '+(acesso ? 'border-emerald-500/40' : 'border-red-500/40')} style={{ background: acesso ? 'radial-gradient(ellipse at 50% 10%, #173527, #161618 70%)' : 'radial-gradient(ellipse at 50% 10%, #3A2020, #161618 70%)' }}>
      <div className={'font-black tracking-[.2em] text-xs uppercase '+(acesso ? 'text-emerald-300' : 'text-red-300')}>A JOIA · Temporada {temporada.ano}</div>
      <div className="text-6xl my-4">{acesso ? '⬆️' : '⬇️'}</div>
      <h2 className="text-3xl font-black text-white">{acesso ? 'ACESSO!' : 'REBAIXADO'}</h2>
      <div className="flex items-center justify-center gap-3 mt-4"><Escudo nome={temporada.clube} size={34} /><span className="text-white font-bold">{temporada.clube}</span></div>
      <p className={'text-base font-semibold mt-3 '+(acesso ? 'text-emerald-200' : 'text-red-200')}>{acesso ? 'Sobe para ' + nomeDestino : 'Cai para ' + nomeDestino}</p>
      <p className="text-[#D4D4D8] text-sm mt-2">{temporada.posicao}º lugar · {temporada.pontos} pontos</p>
      <button autoFocus onClick={onFechar} className="cp-pill cp-branca w-full mt-6">Continuar carreira</button>
    </div>
  </div>, document.body);
}

function CampanhasTemporada({ torneios = [] }) {
  if (!torneios.length) return null;
  return <div className="mt-3">
    <h3 className="text-[10px] uppercase tracking-wider font-black text-[#A1A1AA] mb-1.5">Copas da temporada</h3>
    <div className="grid gap-1.5">{torneios.map((torneio, indice) => <details key={`${torneio.nome}-${indice}`} className="rounded-xl border border-white/[.07] bg-black/10">
      <summary className="cursor-pointer list-none flex items-center gap-2 p-2">
        <TacaCompeticao tipo={torneio.tipo || competicaoDoTitulo(torneio.nome).tipo} nome={torneio.nome} size={28} />
        <strong className="min-w-0 flex-1 truncate text-[11px] text-white">{torneio.nome}</strong>
        <span className={`text-[10px] font-bold ${torneio.faseUsuario === 'Campeão' ? 'text-[#FDE68A]' : 'text-[#A1A1AA]'}`}>{torneio.faseUsuario}</span>
      </summary>
      <div className="px-2 pb-2">{(torneio.jogosUsuario || []).map((jogo, jogoIdx) => <div key={`${jogo.fase}-${jogoIdx}`} className="flex items-center justify-between gap-2 border-t border-white/[.05] py-1 text-[9px] text-[#A1A1AA]">
        <span className="min-w-0 flex-1 truncate">{jogo.fase || 'Partida'}</span>
        <span className="shrink-0 truncate text-right">{jogo.casa} {jogo.golsCasa}–{jogo.golsFora} {jogo.fora}{jogo.penaltis ? ` · pênaltis: ${jogo.penaltis}` : ''}</span>
      </div>)}</div>
    </details>)}</div>
  </div>;
}

function LinhaTemporada({ a, ativa, aberta, onClick }) {
  const titulos = Array.isArray(a.titulosConquistados) ? a.titulosConquistados : a.campeao ? [competicaoTemporadaTecnico(a)] : [];
  return <div className={'border-b border-white/[.06] '+(ativa ? 'bg-white/[.035]' : '')}>
    <button type="button" aria-expanded={aberta} onClick={onClick} className="w-full grid grid-cols-[3.3rem_minmax(0,1fr)_2.6rem_2.7rem] gap-2 items-center px-3 py-2 text-left hover:bg-white/[.04] transition">
      <span className={'rounded-full text-[11px] font-black px-1.5 py-1 text-center '+(ativa ? 'bg-white text-[#111113]' : 'bg-[#27272A] text-[#D4D4D8]')}>{a.ano}</span>
      <span className="flex items-center gap-2 min-w-0"><Escudo nome={a.clube} size={28} /><span className="min-w-0"><strong className="block text-white text-xs truncate">{a.clube}</strong><span className="block text-[10px] text-[#A1A1AA] truncate">{competicaoTemporadaTecnico(a)}</span>{titulos.length > 0 && <span className="block text-[9px] text-[#FACC15] truncate mt-0.5">🏆 {titulos.join(' · ')}</span>}</span></span>
      <span className="text-right text-[#D4D4D8] text-xs">{a.posicao}º</span><span className="text-right text-white text-xs font-bold">{a.pontos}</span>
    </button>
    {aberta && <div className="px-3 pb-3 pl-[4.25rem] text-[11px] text-[#A1A1AA]">
      <div>{a.vitorias}V · {a.empates}E · {a.derrotas}D · {a.pontos} pontos</div>
      <div className="mt-1">Meta: {a.objetivo} · {a.cumpriuObjetivo ? 'atingida' : 'não atingida'}</div>\n      <CampanhasTemporada torneios={a.torneios} />
      {a.classificacao?.length > 0 && <details className="mt-2"><summary className="cursor-pointer text-[#D4D4D8]">Ver classificação</summary><div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-white/[.07]">{a.classificacao.map(l => <div key={l.nome} className={'grid grid-cols-[2rem_1fr_2.5rem_3rem] gap-2 px-2 py-1 border-b border-white/[.05] last:border-0 '+(l.meuClube ? 'text-[#FACC15] font-bold' : 'text-[#A1A1AA]')}><span>{l.posicao}</span><span className="truncate">{l.nome}</span><span className="text-right">{l.vitorias}V</span><span className="text-right">{l.pontos} pts</span></div>)}</div></details>}
    </div>}
  </div>;
}

export default function CarreiraTecnico({ c, onSimularTemporada, onAvancar, onAvancarESimular, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado, onReuniao, onJogar }) {
  const t = c.tecnico;
  const temporadas = t.temporadas || [];
  const ultima = temporadas.at(-1);
  const primeira = !temporadas.length && !t.clubeInicialEscolhido && !!t.opcoesInicio?.length;
  const semClube = t.demitido || t.desempregado;
  const encerrada = carreiraTecnicoEncerrada(t);
  const historico = historicoProfissionalTecnico(t);
  const titulos = titulosConquistadosTecnico(t);
  const [eventosVistos, setEventosVistos] = useState({ chave: null, quantidade: 0 });
  const [simulando, setSimulando] = useState(false);
  const [aberta, setAberta] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [erroProposta, setErroProposta] = useState(null);
  const atualRef = useRef(null);
  const idade = (t.idadeInicio || c.idade || 0) + temporadas.length;
  const objetivo = objetivoTecnico(t);
  const conquistasUltima = ultima ? (Array.isArray(ultima.titulosConquistados) ? ultima.titulosConquistados : ultima.campeao ? [competicaoTemporadaTecnico(ultima)] : []) : [];
  const eventosUltima = [
    ...conquistasUltima.map(nome => ({ tipo: 'titulo', nome })),
    ...(ultima?.rebaixado ? [{ tipo: 'rebaixado', movimento: ultima.rebaixado }] : []),
    ...(ultima?.acesso ? [{ tipo: 'acesso', movimento: ultima.acesso }] : [])
  ];
  const chaveEvento = eventosUltima.length ? `${temporadas.length}|${ultima.ano}|${ultima.clube}|${eventosUltima.map(x => x.nome || x.tipo).join('|')}` : null;
  const indiceEvento = eventosVistos.chave === chaveEvento ? eventosVistos.quantidade : 0;
  const eventoAtual = t.fase === 'resultado' && indiceEvento < eventosUltima.length ? eventosUltima[indiceEvento] : null;
  const temporadasVisiveis = mostrarTodas ? temporadas : temporadas.slice(-12);

  useEffect(() => {
    if (t.fase === 'resultado') setSimulando(false);
    setErroProposta(t.ultimaNegociacao?.aceita === false ? t.ultimaNegociacao.clube : null);
    if (aberta != null && !temporadas.some(a => String(a.ano) === String(aberta))) setAberta(null);
  }, [t.fase, t.ano, temporadas.length, t.ultimaNegociacao?.clube, t.ultimaNegociacao?.aceita]);

  const simular = id => {
    if (simulando || primeira || encerrada) return;
    setSimulando(true);
    try {
      onSimularTemporada?.();
    } catch (erro) {
      setSimulando(false);
      throw erro;
    }
  };
  const escolherClubeInicial = nome => {
    if (simulando) return;
    setSimulando(true);
    try {
      onEscolherClubeInicial?.(nome);
      onSimularTemporada?.();
    } catch (erro) {
      setSimulando(false);
      throw erro;
    }
  };
  const continuar = () => {
    setErroProposta(null);
    if (onAvancarESimular) onAvancarESimular();
    else {
      onAvancar?.();
      onSimularTemporada?.();
    }
  };
  const iniciarProposta = (nome, estrategia = 'prudente') => {
    setErroProposta(null);
    onAceitarProposta?.(nome, estrategia);
  };

  const faseResultado = t.fase === 'resultado';
  const faseTemporada = t.fase === 'pretemporada' && !primeira && !encerrada && !t.reuniaoPendente;
  const titulosDestaque = titulos.at(-1);
  const temporadasCards = temporadasVisiveis;

  return <main className="cp w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 rp-entra">
    {eventoAtual?.tipo === 'titulo' && <PopUpTitulo temporada={ultima} titulo={eventoAtual.nome} indice={eventosUltima.slice(0, indiceEvento + 1).filter(x => x.tipo === 'titulo').length - 1} total={conquistasUltima.length} onFechar={() => setEventosVistos({ chave: chaveEvento, quantidade: indiceEvento + 1 })} />}
    {(eventoAtual?.tipo === 'rebaixado' || eventoAtual?.tipo === 'acesso') && <PopUpDivisao temporada={ultima} movimento={eventoAtual.movimento} onFechar={() => setEventosVistos({ chave: chaveEvento, quantidade: indiceEvento + 1 })} />}

    <section className="cp-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,430px)_minmax(0,1fr)]">
        <div className="min-w-0 border-b lg:border-b-0 lg:border-r border-white/[.08]">
          <header className="px-4 sm:px-5 pt-4 pb-3">
            <div className="flex items-start gap-3">
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]"><Bandeira pais={t.pais || 'Brasil'} /><span className="font-bold uppercase tracking-wider">Treinador</span></div>
                <h1 className="text-white text-xl font-black truncate mt-1">{c.nome}</h1>
                <div className="flex items-center gap-1.5 text-sm text-[#D4D4D8] truncate mt-0.5"><Escudo nome={semClube ? 'Sem clube' : t.clube} size={21} /><span className="truncate">{semClube ? 'Sem clube' : t.clube}</span></div>
              </div>
              <div className="shrink-0 text-right"><strong className="block text-white text-2xl leading-none">{idade}</strong><span className="text-[9px] uppercase tracking-wide text-[#A1A1AA]">idade</span><div className="text-xs font-bold text-[#FACC15] mt-2">R$ {salarioTecnico(t)} mil</div><span className="text-[9px] uppercase text-[#A1A1AA]">salário/mês</span></div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-white/[.07] text-center">
              {[[historico.jogos, 'jogos'], [historico.vitorias, 'vitórias'], [titulos.length, 'títulos']].map(([valor, rotulo]) => <div key={rotulo}><strong className="block text-white text-base">{valor}</strong><span className="text-[9px] text-[#A1A1AA] uppercase tracking-wide">{rotulo}</span></div>)}
            </div>
            <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/[.07] text-[10px] text-[#A1A1AA]"><span>Ano {t.ano} · {temporadas.length}/{LIMITE_TEMPORADAS_TECNICO}</span><span>Diretoria {t.diretoria ?? 60}%</span></div>
            {titulosDestaque && <div className="flex items-center gap-2 mt-2 rounded-xl bg-[#FACC15]/[.07] px-2.5 py-2"><TacaCompeticao tipo={titulosDestaque.tipo} nome={titulosDestaque.nome} size={27} /><span className="min-w-0"><strong className="block text-[10px] text-[#FDE68A] truncate">{titulosDestaque.nome}</strong><span className="block text-[9px] text-[#A1A1AA]">último título · {titulosDestaque.ano}</span></span></div>}
          </header>

          <section className="border-t border-white/[.08] px-4 sm:px-5 py-4" aria-live="polite">
            {primeira ? <>
              <h2 className="text-white text-base font-bold">Oferta inicial</h2><p className="text-xs text-[#A1A1AA] mt-1">Escolha onde sua carreira como treinador começa. Seus vínculos como jogador vêm primeiro.</p>
              <div className="grid grid-cols-2 gap-2 mt-3">{t.opcoesInicio.map(op => <button key={op.clube} disabled={simulando} onClick={() => escolherClubeInicial(op.clube)} className="cp-card min-h-[124px] p-2.5 text-center hover:border-white/30 disabled:opacity-50 transition"><span className="block text-[9px] text-[#A1A1AA]">Começar no</span><strong className="block text-xs leading-tight text-white mt-1">{op.clube}</strong><span className="flex justify-center my-2"><Escudo nome={op.clube} size={42} /></span><span className="block text-[9px] text-[#A1A1AA]">{op.idolatria ? 'Clube do coração' : `Vínculo ${op.afinidade}/100`}</span></button>)}</div>
              {simulando && <p role="status" className="text-[10px] text-[#A1A1AA] text-center mt-2">Simulando a temporada…</p>}
            </> : faseTemporada ? <>
              <h2 className="text-white text-base font-bold">Temporada {t.ano}</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">{t.clube} · {competicaoTemporadaTecnico({ clube: t.clube, liga: t.liga })}</p>
              <p className="text-xs text-[#A1A1AA] mt-4">Simule o ano e confira a campanha, os títulos e as propostas ao fim da temporada.</p>
              <button disabled={simulando} onClick={() => simular()} className="cp-pill cp-branca w-full mt-3">{simulando ? 'Simulando temporada…' : 'Simular temporada'}</button>
              {simulando && <p role="status" className="text-[10px] text-[#A1A1AA] text-center mt-2">Calculando temporada…</p>}
            </> : t.reuniaoPendente ? <>
              <h2 className="text-white text-base font-bold">Conversa com a diretoria</h2><p className="text-xs text-[#A1A1AA] mt-1">Escolha sua resposta para continuar.</p><div className="grid gap-2 mt-3">{OPCOES_REUNIAO_TECNICO.map(op => <button key={op.id} onClick={() => { onReuniao?.(op.id); onJogar?.(); }} className="cp-card p-2.5 text-left hover:border-white/30"><strong className="block text-xs text-white">{op.nome}</strong><span className="text-[10px] text-[#A1A1AA]">{op.descricao}</span></button>)}</div>
            </> : faseResultado ? <>
              {ultima && <><div className="flex items-center gap-2"><Escudo nome={ultima.clube} size={38} /><div className="min-w-0 flex-1"><h2 className="text-white text-base font-bold truncate">{ultima.clube}</h2><p className="text-[10px] text-[#A1A1AA]">Temporada {ultima.ano} · {competicaoTemporadaTecnico(ultima)}</p></div><div className="text-right"><strong className="block text-white text-2xl leading-none">{ultima.posicao}º</strong><span className="text-[9px] text-[#A1A1AA]">LUGAR</span></div></div>
                <div className="grid grid-cols-4 gap-1.5 mt-3">{[['PTS', ultima.pontos], ['V', ultima.vitorias], ['E', ultima.empates], ['D', ultima.derrotas]].map(([label, value]) => <div key={label} className="rounded-lg bg-[#0D0D0F] py-1.5 text-center"><strong className="block text-sm text-white">{value}</strong><span className="text-[9px] text-[#A1A1AA]">{label}</span></div>)}</div>
                <div className="mt-2 text-[10px] text-[#D4D4D8]">Meta: {ultima.objetivo} · <span className={ultima.cumpriuObjetivo ? 'text-emerald-300' : 'text-amber-300'}>{ultima.cumpriuObjetivo ? 'atingida' : 'não atingida'}</span></div>
                {!!conquistasUltima.length && <div className="grid gap-1.5 mt-3">{conquistasUltima.map(nome => <div key={nome} className="flex items-center gap-2 rounded-xl bg-[#FACC15]/[.07] border border-[#FACC15]/20 p-2"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={31} /><strong className="text-xs text-[#FDE68A]">{nome}</strong></div>)}</div>}\n                <CampanhasTemporada torneios={ultima.torneios || []} />
                {ultima.rebaixado && <p className="mt-3 rounded-xl border border-red-500/25 bg-red-950/25 p-2 text-xs font-semibold text-red-200">Rebaixado · {competicaoTemporadaTecnico({ liga: ultima.rebaixado.para })}</p>}
                {ultima.acesso && <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-950/25 p-2 text-xs font-semibold text-emerald-200">Acesso · {competicaoTemporadaTecnico({ liga: ultima.acesso.para })}</p>}</>}
              {semClube && <div className="mt-3 rounded-xl border border-red-400/20 bg-red-950/20 p-2.5"><strong className="text-xs text-red-200">{t.demitido ? 'Você foi demitido' : 'Sem clube'}</strong><p className="text-[10px] text-red-100/70 mt-1">{t.demitido ? 'Escolha uma proposta para continuar.' : 'Aguarde novos convites.'}</p></div>}
              {!!t.propostas?.length && <><h3 className="text-white text-xs font-bold mt-3">{semClube ? 'Propostas de trabalho' : 'Janela de transferências'}</h3><p className="text-[10px] text-[#A1A1AA] mt-1">Escolha uma proposta ou continue no clube.</p><div className="grid grid-cols-2 gap-2 mt-2">{t.propostas.map(p => <button key={p.nome} onClick={() => iniciarProposta(p.nome)} className="cp-card min-h-[112px] p-2 text-center hover:border-white/30 transition"><span className="block text-[9px] text-[#A1A1AA]">Assinar com</span><strong className="block text-xs text-white mt-0.5 truncate">{p.nome}</strong><span className="flex justify-center my-1.5"><Escudo nome={p.nome} size={36} /></span><span className="block text-[9px] text-[#A1A1AA] truncate">{p.pais} · meta {p.objetivo}</span></button>)}</div></>}
              {erroProposta && <p role="status" className="text-[10px] text-amber-200 mt-2">A proposta de {erroProposta} foi recusada. Escolha outra opção.</p>}
              {semClube && !t.propostas?.length && <button onClick={onEsperar} className="cp-pill cp-contorno w-full mt-3">Aguardar propostas</button>}
              {!encerrada && !semClube && <button onClick={continuar} className="cp-pill cp-branca w-full mt-3">Ficar no {t.clube}</button>}
              {encerrada && <p className="text-center text-xs text-[#FDE68A] mt-3">Carreira encerrada após {LIMITE_TEMPORADAS_TECNICO} temporadas.</p>}
            </> : <p className="text-xs text-[#A1A1AA]">Carreira indisponível.</p>}
          </section>
        </div>

        <section className="min-w-0" aria-label="Trajetória como treinador">
          <header className="px-3 sm:px-4 py-4 border-b border-white/[.08]">
            <div className="flex items-start justify-between gap-3"><div><span className="text-[9px] uppercase tracking-[.18em] text-[#A1A1AA] font-black">Modo treinador · intenso</span><h2 className="text-white text-base font-bold mt-1">Trajetória</h2></div><span className="text-[10px] text-[#A1A1AA]">{temporadas.length}/{LIMITE_TEMPORADAS_TECNICO} temporadas</span></div>
            <div className="grid grid-cols-[3.3rem_minmax(0,1fr)_2.6rem_2.7rem] gap-2 px-3 mt-3 text-[9px] font-black uppercase tracking-wider text-[#71717A]"><span>Ano</span><span>Clube / competição</span><span className="text-right">Pos.</span><span className="text-right">Pts.</span></div>
          </header>
          <div className="px-2 pb-2 max-h-[72vh] lg:max-h-[680px] overflow-y-auto">
            {temporadasCards.map((a, visibleIndex) => {
              const i = mostrarTodas ? visibleIndex : temporadas.length - temporadasCards.length + visibleIndex;
              return <LinhaTemporada key={`${a.ano}-${i}`} a={a} ativa={aberta == null && i === temporadas.length - 1} aberta={String(aberta) === String(a.ano)} onClick={() => setAberta(String(aberta) === String(a.ano) ? null : a.ano)} />;
            })}
            {t.fase === 'pretemporada' && <div ref={atualRef} className="grid grid-cols-[3.3rem_minmax(0,1fr)_2.6rem_2.7rem] gap-2 items-center px-3 py-2 border-b border-white/[.06] bg-white/[.035]">
              <span className="rounded-full bg-white text-[#111113] text-[11px] font-black px-1.5 py-1 text-center">{t.ano}</span><span className="flex items-center gap-2 min-w-0"><Escudo nome={primeira ? 'Sem clube' : t.clube} size={28} /><span className="min-w-0"><strong className="block text-xs text-white truncate">{primeira ? 'Escolhendo clube' : t.clube}</strong><span className="block text-[9px] text-[#A1A1AA] truncate">{primeira ? 'Oferta inicial' : 'Temporada em andamento'}</span></span></span><span className="text-right text-xs text-[#A1A1AA]">—</span><span className="text-right text-xs text-[#A1A1AA]">—</span>
            </div>}
            {!temporadas.length && <div className="px-4 py-7 text-center text-xs text-[#71717A]">As temporadas concluídas aparecerão aqui.</div>}
            {temporadas.length > 12 && <button onClick={() => setMostrarTodas(v => !v)} className="w-full py-2 text-[10px] text-[#D4D4D8]">{mostrarTodas ? 'Mostrar as 12 mais recentes' : `Ver as ${temporadas.length} temporadas`}</button>}
            {temporadas.length > 0 && <div className="flex items-center justify-between px-3 py-2 text-[9px] text-[#71717A]"><span>{historico.vitorias}V · {historico.empates}E · {historico.derrotas}D</span><span>Até {LIMITE_TEMPORADAS_TECNICO} temporadas</span></div>}
          </div>
          {titulos.length > 0 && <details className="border-t border-white/[.08] px-3 py-2.5"><summary className="cursor-pointer list-none flex items-center justify-between"><span className="text-xs font-bold text-[#FDE68A]">Vitrine de títulos</span><span className="text-[10px] text-[#A1A1AA]">{titulos.length} conquistas</span></summary><div className="grid grid-cols-2 gap-2 mt-3">{titulos.map((x, i) => <div key={`${x.ano}-${x.nome}-${i}`} className="cp-card flex items-center gap-2 p-2"><TacaCompeticao tipo={x.tipo} nome={x.nome} size={30} /><span className="min-w-0"><strong className="block text-[10px] text-[#FDE68A] truncate">{x.nome}</strong><span className="text-[9px] text-[#A1A1AA]">{x.ano} · {x.clube}</span></span></div>)}</div></details>}
        </section>
      </div>
      <footer className="flex items-center justify-between gap-3 border-t border-white/[.08] px-4 py-2 text-[10px]"><button onClick={onLegado} className="text-[#A1A1AA] hover:text-white">Ver legado como jogador</button><button onClick={onSair} className="text-[#A1A1AA] hover:text-white">Voltar ao menu</button></footer>
    </section>
  </main>;
}
