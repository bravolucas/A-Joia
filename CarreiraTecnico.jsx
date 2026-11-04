import {agruparConquistasTecnico} from './conquistasTecnico.js';
import VitrineConquistas,{ResumoConquistas} from './VitrineConquistas.jsx';
import { riscosIdolatriaTecnico, vinculoAtivoTecnico } from './idolatriaTecnico.js';
import { FORMACOES_TECNICO, perfilTaticoTecnico } from './taticasTecnico.js';
import Lottie from './Lottie.jsx';
import GestaoTecnico from './GestaoTecnico.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './CarreiraTecnico.css';
import confetti from 'canvas-confetti';
import { TacaCompeticao } from './trofeus.jsx';
import { NACIONALIDADES } from './data.js';
import { escudoDe, bandeiraDe, CENARIOS } from './arte.js';
import { competicaoDoTitulo } from './tacas.js';
import {
  historicoProfissionalTecnico, objetivoTecnico,
  LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico,
  competicaoTemporadaTecnico, salarioTecnico, calcularOvrTecnico, cartaAtualTecnico,
  INTERVENCOES_TECNICO, ESTILOS_TECNICO, OPCOES_REUNIAO_TECNICO
} from './tecnico.js';

function Escudo({ nome, size = 32 }) {
  const src = escudoDe(nome);
  return src ? <img src={src} alt="" className="object-contain shrink-0" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="shrink-0 flex items-center justify-center rounded-full bg-white/10" style={{ width: size, height: size }}>⚽</span>;
}

function Bandeira({ pais }) {
  const src = bandeiraDe(NACIONALIDADES.find(n => n.label === pais || n.id === pais)?.id || pais);
  return src ? <img src={src} alt={pais} className="w-5 h-4 rounded-sm object-cover" /> : <span aria-label={pais || 'País'}>🌎</span>;
}

function PopUpTitulo({ temporada, titulo, indice, total, onFechar }) {
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti({ particleCount: 120, spread: 80, origin: { y: .48 }, colors: ['#D8B44A', '#FFF2BE', '#FFFFFF'], zIndex: 120 });
  }, [temporada.ano, indice]);
  const liga = titulo === competicaoTemporadaTecnico(temporada);
  return <JanelaTreinador titulo="Título conquistado" onFechar={onFechar} classe="ct-celebration ct-champion">
    <div className="ct-champion-hero">
      <span className="ct-champion-season">TEMPORADA {temporada.ano}</span>
      <h2>CAMPEÃO!</h2>
      <div className="ct-champion-cup"><Lottie nome="taca" className="absolute inset-0 pointer-events-none" /><span className="ct-champion-halo" aria-hidden="true" /><TacaCompeticao tipo={competicaoDoTitulo(titulo).tipo} nome={titulo} size={184} /></div>
      <span className="ct-champion-label">UMA NOVA TAÇA NA SUA HISTÓRIA</span>
      <h3>{titulo}</h3>
      <div className="ct-event-club"><Escudo nome={temporada.clube} size={28} /><strong>{temporada.clube}</strong></div>
    </div>
    <div className="ct-champion-footer">
      {liga ? <div className="ct-champion-stats">{[[temporada.posicao + 'º', 'POSIÇÃO'], [temporada.pontos, 'PONTOS'], [temporada.vitorias, 'VITÓRIAS']].map(([valor, rotulo]) => <div key={rotulo}><strong>{valor}</strong><span>{rotulo}</span></div>)}</div> : <p className="ct-champion-message">O trabalho virou conquista. Mais um título para o legado do seu treinador.</p>}
      {total > 1 && <div className="ct-champion-progress"><span>Conquista {indice + 1} de {total}</span><span className="ct-champion-dots" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i === indice ? 'ativa' : ''} />)}</span></div>}
      <button onClick={onFechar} className="ct-primary ct-champion-continue">{indice + 1 < total ? 'Próximo troféu' : 'Continuar carreira'}<span aria-hidden="true">→</span></button>
    </div>
  </JanelaTreinador>;
}

function PopUpDivisao({ temporada, movimento, tipo, onFechar }) {
  const acesso = (tipo || movimento.tipo) === 'acesso';
  useEffect(() => {
    if (acesso && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti({ particleCount: 90, spread: 70, origin: { y: .5 }, colors: ['#22C55E', '#FFFFFF', '#D8B44A'], zIndex: 120 });
  }, [temporada.ano, acesso]);
  return <JanelaTreinador titulo={acesso ? 'Acesso de divisão' : 'Rebaixamento'} onFechar={onFechar} classe={`ct-celebration ${acesso ? 'ct-celebration-green' : 'ct-celebration-red'}`}>
    <div className="ct-event-content ct-celebration-body" style={{backgroundImage:`linear-gradient(#17171b66,#17171bf5 65%),url(${CENARIOS.estadioMobile})`,backgroundSize:"cover",backgroundPosition:"center"}}><span className="ct-eyebrow">Temporada {temporada.ano}</span>
      <span className="ct-movement" aria-hidden="true">{acesso ? '↗' : '↘'}</span><h2>{acesso ? 'ACESSO!' : 'REBAIXADO'}</h2>
      <div className="ct-event-club"><Escudo nome={temporada.clube} size={38} /><strong>{temporada.clube}</strong></div>
      <h3>{acesso ? 'Sobe para ' : 'Cai para '}{competicaoTemporadaTecnico({ liga: movimento.para })}</h3>
      <p>{temporada.posicao}º lugar · {temporada.pontos} pontos</p>
      <button onClick={onFechar} className="ct-primary">Continuar carreira<span aria-hidden="true">→</span></button>
    </div>
  </JanelaTreinador>;
}

function PlacarCompeticao({ jogo }) {
  if (jogo.bye) return <div className="flex items-center justify-between gap-2 border-t border-white/[.05] py-1 text-[9px] text-[#A1A1AA]"><span>{jogo.fase || 'Classificado direto'}</span><span>{jogo.bye} avança sem adversário</span></div>;
  if (jogo.agregado && jogo.partidas?.length) return <div className="border-t border-white/[.08] py-1">
    {jogo.partidas.map((partida, indice) => <div key={indice}>
      <div className="text-[8px] uppercase text-[#71717A] mt-1">{partida.etapa || (indice === 0 ? 'Ida' : 'Volta')}</div>
      <PlacarCompeticao jogo={partida} />
    </div>)}
    <div className="text-[9px] text-[#D4D4D8] py-1">
      Agregado: {jogo.casa} {jogo.golsCasa}–{jogo.golsFora} {jogo.fora}
      <span className="block font-semibold text-white">Classificado: {jogo.vencedor}{jogo.penaltis ? ' · nos pênaltis' : ''}</span>
    </div>
  </div>;
  const placar = Number.isFinite(jogo.golsCasa) && Number.isFinite(jogo.golsFora) ? `${jogo.golsCasa}–${jogo.golsFora}` : '—';
  return <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 border-t border-white/[.05] py-1 text-[9px] text-[#A1A1AA]">
    <span className={jogo.vencedor === jogo.casa ? 'truncate text-right text-white font-semibold' : 'truncate text-right'}>{jogo.casa || '—'}</span>
    <strong className="text-white tabular-nums">{placar}{jogo.campoNeutro && <span className="block text-[8px] text-[#A1A1AA] font-normal">Campo neutro</span>}{jogo.prorrogacao && <span className="block text-[8px] text-[#A1A1AA] font-normal">Após prorrogação · 90 min: {jogo.prorrogacao.placar90.golsCasa}–{jogo.prorrogacao.placar90.golsFora}</span>}{jogo.penaltis ? <span className="block text-[8px] text-[#A1A1AA] font-normal">pênaltis</span> : null}</strong>
    <span className={jogo.vencedor === jogo.fora ? 'truncate text-white font-semibold' : 'truncate'}>{jogo.fora || '—'}</span>
  </div>;
}

function CampanhasTemporada({ torneios = [] }) {
  if (!torneios.length) return null;
  return <div className="mt-3">
    <h3 className="text-[10px] uppercase tracking-wider font-black text-[#A1A1AA] mb-1.5">Copas da temporada</h3>
    <div className="grid gap-1.5">{torneios.map((torneio, indice) => {
      const clubeUsuario = (torneio.jogosUsuario || []).flatMap(jogo => [jogo.casa, jogo.fora]).find(Boolean);
      return <details key={`${torneio.nome}-${indice}`} className="rounded-xl border border-white/[.07] bg-black/10">
      <summary className="cursor-pointer list-none flex items-center gap-2 p-2">
        <TacaCompeticao tipo={torneio.tipo || competicaoDoTitulo(torneio.nome).tipo} nome={torneio.nome} size={28} />
        <strong className="min-w-0 flex-1 truncate text-[11px] text-white">{torneio.nome}</strong>
        <span className={`text-[10px] font-bold ${torneio.faseUsuario === 'Campeão' ? 'text-[#FDE68A]' : 'text-[#A1A1AA]'}`}>{torneio.faseUsuario}</span>
      </summary>
      <div className="px-2 pb-2">
        {torneio.grupos?.map(grupo => <details key={`grupo-${grupo.grupo}`} className="mt-1 rounded-lg border border-white/[.06] bg-black/15">
          <summary className="cursor-pointer px-2 py-1.5 text-[9px] font-bold text-[#D4D4D8]">Grupo {grupo.grupo} · tabela e partidas</summary>
          {grupo.classificacao?.length > 0 && <div className="overflow-x-auto px-2 pb-1"><div className="grid min-w-[250px] grid-cols-[1.5rem_minmax(6rem,1fr)_2rem_3.4rem_2rem] gap-1 border-b border-white/[.08] py-1 text-[8px] uppercase text-[#71717A]"><span>#</span><span>Clube</span><span className="text-right">Pts</span><span className="text-right">SG</span><span className="text-right">V</span></div>{grupo.classificacao.map((clube, posicao) => <div key={clube.nome} className={`grid min-w-[250px] grid-cols-[1.5rem_minmax(6rem,1fr)_2rem_3.4rem_2rem] gap-1 py-1 text-[9px] ${clube.nome === clubeUsuario ? 'font-bold text-[#FDE68A]' : 'text-[#A1A1AA]'}`}><span>{posicao + 1}</span><span className="truncate">{clube.nome}</span><span className="text-right">{clube.pontos}</span><span className="text-right">{(clube.golsPro || 0) - (clube.golsContra || 0)}</span><span className="text-right">{clube.vitorias}</span></div>)}</div>}
          <div className="px-2 pb-2">{(grupo.jogos || []).map((jogo, i) => <PlacarCompeticao key={`grupo-${grupo.grupo}-${i}`} jogo={jogo} />)}</div>
        </details>)}
        {torneio.fases?.map((fase, faseIdx) => <details key={`fase-${fase.rodada || faseIdx}-${fase.fase}`} className="mt-1 rounded-lg border border-white/[.06] bg-black/15">
          <summary className="cursor-pointer px-2 py-1.5 text-[9px] font-bold text-[#D4D4D8]">{fase.fase || 'Mata-mata'}</summary>
          <div className="px-2 pb-2">{(fase.jogos || []).map((jogo, jogoIdx) => <PlacarCompeticao key={`fase-${faseIdx}-${jogoIdx}`} jogo={jogo} />)}</div>
        </details>)}
        {!torneio.grupos?.length && !torneio.fases?.length && (torneio.jogosUsuario || []).map((jogo, jogoIdx) => <PlacarCompeticao key={`usuario-${jogoIdx}`} jogo={jogo} />)}
      </div>
      </details>;
    })}</div>
  </div>;
}
function ClassificacoesMundo({ classificacoes = {}, ligaAtual, clubeAtual }) {
  const ligas = Object.entries(classificacoes)
    .filter(([liga, dados]) => liga !== ligaAtual && dados?.classificacao?.length)
    .sort((a, b) => competicaoTemporadaTecnico({ liga: a[0] }).localeCompare(competicaoTemporadaTecnico({ liga: b[0] }), 'pt-BR'));
  if (!ligas.length) return null;
  return <details className="mt-2 rounded-lg border border-white/[.07] bg-black/10">
    <summary className="cursor-pointer px-2 py-1.5 text-[9px] font-bold text-[#D4D4D8]">Classificações das outras ligas ({ligas.length})</summary>
    <div className="px-2 pb-2">
      {ligas.map(([liga, dados]) => <details key={liga} className="mt-1 rounded-md border border-white/[.06] bg-black/15">
        <summary className="cursor-pointer px-2 py-1.5 text-[9px] font-semibold text-[#A1A1AA]">{competicaoTemporadaTecnico({ liga })}</summary>
        <div className="max-h-48 overflow-y-auto px-2 pb-1">
          <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_2rem_2rem_3rem] gap-1 border-b border-white/[.08] py-1 text-[8px] uppercase text-[#71717A]"><span>#</span><span>Clube</span><span className="text-right">J</span><span className="text-right">V</span><span className="text-right">Pts</span></div>
          {dados.classificacao.map((clube, indice) => <div key={clube.nome} className={`grid grid-cols-[1.5rem_minmax(0,1fr)_2rem_2rem_3rem] gap-1 py-1 text-[9px] ${clube.nome === clubeAtual ? 'font-bold text-[#FDE68A]' : 'text-[#A1A1AA]'}`}><span>{clube.posicao || indice + 1}</span><span className="truncate">{clube.nome}</span><span className="text-right">{clube.jogos ?? '—'}</span><span className="text-right">{clube.vitorias ?? '—'}</span><span className="text-right">{clube.pontos ?? '—'}</span></div>)}
        </div>
      </details>)}
    </div>
  </details>;
}
function JanelaTreinador({ titulo, onFechar, children, classe = '' }) {
  const painel = useRef(null);
  const focoAnterior = useRef(document.activeElement);
  const fechar = useRef(onFechar);
  fechar.current = onFechar;
  useEffect(() => {
    const anterior = focoAnterior.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
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
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', teclado); anterior?.focus(); };
  }, []);
  return createPortal(<div className="ct-overlay" onClick={onFechar}>
    <section ref={painel} role="dialog" aria-modal="true" aria-label={titulo} className={`ct-modal ${classe}`} onClick={e => e.stopPropagation()}>
      <header className="ct-modal-header"><h2>{titulo}</h2><button type="button" aria-label="Fechar janela" onClick={onFechar}>×</button></header>
      {children}
    </section>
  </div>, document.body);
}

function CartaoClube({ nome, liga, pais, rotulo, detalhe, onClick, disabled, atual = false }) {
  return <button type="button" className={`ct-offer ${atual ? 'ct-offer-stay' : ''}`} onClick={onClick} disabled={disabled}>
    <span className="ct-offer-label">{rotulo}</span><strong>{nome}</strong>
    <span className="ct-offer-crest"><Escudo nome={nome} size={64} /></span>
    <span className="ct-offer-league">{competicaoTemporadaTecnico({ clube: nome, liga })}</span>
    <span className="ct-offer-country"><Bandeira pais={pais} /><span>{pais || 'Brasil'}</span></span>
    {detalhe && <span className="ct-offer-detail">{detalhe}</span>}
  </button>;
}

function LinhaTemporada({ a, idade, ativa, aberta, onClick }) {
  const titulos = Array.isArray(a.titulosConquistados) ? a.titulosConquistados : a.campeao ? [competicaoTemporadaTecnico(a)] : [];
  return <div className={`ct-season ${ativa ? 'ct-season-latest' : ''}`}>
    <button type="button" aria-expanded={aberta} onClick={onClick} className="ct-timeline-row ct-season-button" aria-label={`Temporada ${a.ano}, ${a.clube}, ${a.posicao}º lugar`}>
      <span className="ct-age">{idade}</span>
      <span className="ct-season-club"><Escudo nome={a.clube} size={23} /><strong>{a.clube}</strong>{titulos.length > 0 && <span title={titulos.join(' · ')} aria-label={titulos.join(' · ')}>🏆</span>}{a.acesso && <span title="Acesso">↑</span>}{a.rebaixado && <span title="Rebaixamento">↓</span>}</span>
      <span className="ct-position">{a.posicao}º</span><span className="ct-number">{a.pontos}</span><span className="ct-number">{a.vitorias}</span><span className="ct-number">{titulos.length}</span>
    </button>
    {aberta && <div className="ct-season-details">
      <div className="ct-detail-title"><strong>{competicaoTemporadaTecnico(a)}</strong><span>{a.ano}</span></div>
      <p>{a.vitorias}V · {a.empates}E · {a.derrotas}D · {a.pontos} pontos</p>
      <p>Meta: {a.objetivo} · <span className={a.cumpriuObjetivo ? 'ct-positive' : 'ct-warning'}>{a.cumpriuObjetivo ? 'atingida' : 'não atingida'}</span></p>
      {a.confrontos?.filter(j => j.intervencao).map(j => <p key={`intervencao-${j.rodada}`}>Jogo importante: {j.nome} · {j.golsPro} × {j.golsContra} · {INTERVENCOES_TECNICO.find(op => op.id === j.intervencao)?.nome}</p>)}
      <CampanhasTemporada torneios={a.torneios} />
      {a.classificacao?.length > 0 && <details className="ct-league-details"><summary>Ver classificação</summary><div className="ct-standings">{a.classificacao.map(l => <div key={l.nome} className={l.meuClube ? 'ct-positive' : ''}><span>{l.posicao}</span><strong>{l.nome}</strong><span>{l.vitorias}V</span><span>{l.pontos} pts</span></div>)}</div></details>}
      <ClassificacoesMundo classificacoes={a.classificacoesMundo} ligaAtual={a.liga} clubeAtual={a.clube} />
    </div>}
  </div>;
}

export default function CarreiraTecnico({ c, onSimularTemporada, onAvancar, onAvancarESimular, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado, onReuniao, onJogar, onNegociarElenco, onEstilo, onFormacao, onAcompanhamento, onIntervir, rotuloLegado = '← Ver legado como jogador' }) {
  const t = c.tecnico;
  const temporadas = t.temporadas || [];
  const ultima = temporadas.at(-1);
  const primeira = !temporadas.length && !t.clubeInicialEscolhido && !!t.opcoesInicio?.length;
  const semClube = t.demitido || t.desempregado;
  const encerrada = carreiraTecnicoEncerrada(t);
  const historico = historicoProfissionalTecnico(t);
  const titulos = titulosConquistadosTecnico(t);
  const gruposConquistas = agruparConquistasTecnico(titulos);
  const [conquistaSelecionada,setConquistaSelecionada] = useState(null);
  const abrirConquistas=id=>{setConquistaSelecionada(id);setVitrineAberta(true);};
  const [eventosVistos, setEventosVistos] = useState({ chave: null, quantidade: 0 });
  const [simulando, setSimulando] = useState(false);
  const [aberta, setAberta] = useState(null);
  const [vitrineAberta, setVitrineAberta] = useState(false);
  const [decisaoAberta, setDecisaoAberta] = useState(false);
  const [propostaPendente, setPropostaPendente] = useState(null);
  const [gestaoAberta, setGestaoAberta] = useState(false);
  const [erroProposta, setErroProposta] = useState(null);
  const [erroSimulacao, setErroSimulacao] = useState(null);
  const temporizador = useRef(null);
  const atualRef = useRef(null);
  const idadeInicio = t.idadeInicio || (c.idade - temporadas.length);
  const idade = c.idade || idadeInicio + temporadas.length;
  const objetivo = objetivoTecnico(t);
  const ovr = calcularOvrTecnico(t);
  const carta = cartaAtualTecnico(t);
  const conquistasUltima = ultima ? (Array.isArray(ultima.titulosConquistados) ? ultima.titulosConquistados : ultima.campeao ? [competicaoTemporadaTecnico(ultima)] : []) : [];
  const eventosUltima = [
    ...conquistasUltima.map(nome => ({ tipo: 'titulo', nome })),
    ...(ultima?.rebaixado ? [{ tipo: 'rebaixado', movimento: ultima.rebaixado }] : []),
    ...(ultima?.acesso ? [{ tipo: 'acesso', movimento: ultima.acesso }] : []),
    ...(ultima?.demitido ? [{ tipo: 'demissao' }] : [])
  ];
  const chaveEvento = eventosUltima.length ? `${temporadas.length}|${ultima.ano}|${ultima.clube}|${eventosUltima.map(x => x.nome || x.tipo).join('|')}` : null;
  const indiceEvento = eventosVistos.chave === chaveEvento ? eventosVistos.quantidade : 0;
  const eventoAtual = !simulando && t.fase === 'resultado' && indiceEvento < eventosUltima.length ? eventosUltima[indiceEvento] : null;
  const fecharEvento = () => setEventosVistos({ chave: chaveEvento, quantidade: indiceEvento + 1 });

  useEffect(() => {
    const fundoAnterior = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#09090B';
    return () => { document.body.style.backgroundColor = fundoAnterior; clearTimeout(temporizador.current); };
  }, []);
  useEffect(() => {
    if (t.fase === 'resultado') { setSimulando(false); setDecisaoAberta(false); }
    setErroProposta(t.ultimaNegociacao?.aceita === false ? t.ultimaNegociacao.clube : null);
  }, [t.fase, temporadas.length, t.ultimaNegociacao]);
  useEffect(() => {
    atualRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [temporadas.length]);

  const executar = acao => {
    if (simulando) return;
    setErroSimulacao(null);
    setSimulando(true);
    temporizador.current = setTimeout(() => {
      try { acao(); }
      catch { setErroSimulacao('Não foi possível concluir a temporada. Tente novamente.'); }
      finally { setSimulando(false); }
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650);
  };
  const simular = opcao => {
    if (primeira || encerrada || simulando) return;
    setDecisaoAberta(false);
    executar(() => onSimularTemporada?.(opcao));
  };
  const escolherClubeInicial = nome => executar(() => { onEscolherClubeInicial?.(nome); });
  const continuar = () => {
    setErroProposta(null);
    executar(() => { if (onAvancar) { onAvancar(); } else onAvancarESimular?.(); });
  };
  const iniciarProposta = (nome, confirmado=false) => {
    if(!confirmado && riscosIdolatriaTecnico(t,nome).length){setPropostaPendente(nome);return;}
    setPropostaPendente(null);
    setErroProposta(null);
    executar(() => { onAceitarProposta?.(nome, 'prudente'); });
  };
  const faseResultado = t.fase === 'resultado';
  const faseTemporada = t.fase === 'pretemporada' && !primeira && !encerrada && !t.reuniaoPendente;
  const futuras = Math.max(0, LIMITE_TEMPORADAS_TECNICO - temporadas.length - (encerrada ? 0 : 1));
  const cadencia = c.ritmo === 'intenso' ? 1 : c.ritmo === 'expresso' ? 3 : 2;
  const mostrarDecisao = carta && temporadas.length % cadencia === 0;
  const clubeAtual = primeira || semClube ? 'Sem clube' : t.clube;

  return <div className="ct" aria-label="Carreira de treinador">
    {propostaPendente && <JanelaTreinador titulo="Decisão de legado" onFechar={() => setPropostaPendente(null)}><div className="ct-event-content"><h3>Assinar com {propostaPendente}?</h3><p>Você é ídolo em {riscosIdolatriaTecnico(t,propostaPendente).map(v=>v.clube).join(', ')}. Assinar com este rival rompe esse vínculo: você perde os benefícios de ídolo nas futuras propostas e retornos desses clubes. O novo projeto também começa com menos apoio da diretoria e da torcida. Seu histórico e suas conquistas permanecem.</p><button className="ct-primary" disabled={simulando} onClick={()=>iniciarProposta(propostaPendente,true)}>Confirmar transferência</button><button className="ct-primary" onClick={()=>setPropostaPendente(null)}>Manter meu legado</button></div></JanelaTreinador>}
    {gestaoAberta && faseTemporada && !semClube && <JanelaTreinador titulo="Elenco e mercado" classe="ct-market-modal" onFechar={() => setGestaoAberta(false)}><GestaoTecnico t={t} onNegociar={onNegociarElenco} /></JanelaTreinador>}
    {eventoAtual?.tipo === 'titulo' && <PopUpTitulo temporada={ultima} titulo={eventoAtual.nome} indice={eventosUltima.slice(0, indiceEvento + 1).filter(x => x.tipo === 'titulo').length - 1} total={conquistasUltima.length} onFechar={fecharEvento} />}
    {(eventoAtual?.tipo === 'rebaixado' || eventoAtual?.tipo === 'acesso') && <PopUpDivisao temporada={ultima} movimento={eventoAtual.movimento} tipo={eventoAtual.tipo} onFechar={fecharEvento} />}
    {eventoAtual?.tipo === 'demissao' && <JanelaTreinador titulo="Fim de ciclo" onFechar={fecharEvento}><div className="ct-event-content"><div className="vf-hero-diretoria" style={{backgroundImage:`url(${CENARIOS.diretoriaMobile})`}} /><span className="ct-event-symbol">↗</span><h3>Você foi demitido</h3><p>A diretoria do {ultima.clube} decidiu encerrar seu trabalho. Sua carreira continua: confira os próximos convites.</p><button className="ct-primary" onClick={fecharEvento}>Ver propostas</button></div></JanelaTreinador>}
    {vitrineAberta && <JanelaTreinador titulo="Conquistas como treinador" onFechar={() => setVitrineAberta(false)} classe="ct-trophy-modal"><VitrineConquistas grupos={gruposConquistas} total={titulos.length} selecionada={conquistaSelecionada} onSelecionar={setConquistaSelecionada}/></JanelaTreinador>}
    {decisaoAberta && carta && <JanelaTreinador titulo="Decisão de carreira" onFechar={() => setDecisaoAberta(false)}><div className="ct-event-content"><div className="vf-hero-diretoria" style={{backgroundImage:`url(${carta.contexto === "inicio" ? CENARIOS.treinoMobile : CENARIOS.diretoriaMobile})`}} /><span className="ct-eyebrow">{t.clube} · {t.ano}</span><h3>{carta.titulo}</h3><p>{carta.texto}</p><div className="ct-decisions">{carta.opcoes.map(op => <button key={op.id} onClick={() => simular(op.id)}><strong>{op.nome}</strong><span>{op.detalhe}</span>{op.risco > 0 && <small>Risco: {Math.round(op.risco * 100)}%</small>}</button>)}</div></div></JanelaTreinador>}

    <div className="ct-board" aria-busy={simulando}>
      <section className="ct-profile" aria-label="Ficha do treinador">
        <header className="ct-identity">
          <div className={`ct-rating ${ovr >= 80 ? 'ct-rating-gold' : ovr >= 70 ? 'ct-rating-silver' : ''}`}><span>OVR</span><strong>{ovr}</strong></div>
          <div className="ct-person">
            <div className="ct-badges"><span><Bandeira pais={c.nac || 'BRA'} />{c.nac || 'BRA'}</span><span className="ct-role">TREINADOR</span></div>
            <h1>{c.nome}</h1><div className="ct-current-club"><Escudo nome={clubeAtual} size={22} /><strong>{clubeAtual}</strong></div>
          </div>
          <div className="ct-contract"><div><span>IDADE</span><strong>{idade}</strong></div><div><span>SALÁRIO</span><strong>R$ {semClube || primeira ? 0 : (t.salario ?? salarioTecnico(t))}<small>mil</small></strong></div></div>
        </header>
        <div className="ct-stats">{[[historico.jogos, 'JOGOS', '▣'], [historico.vitorias, 'VITÓRIAS', '✦'], [titulos.length, 'TÍTULOS', '♜']].map(([valor, rotulo, icone]) => <div key={rotulo}><span>{rotulo}</span><strong><i aria-hidden="true">{icone}</i>{valor}</strong></div>)}</div>
        <ResumoConquistas grupos={gruposConquistas} total={titulos.length} onAbrir={abrirConquistas}/>
        {!primeira && vinculoAtivoTecnico(t,t.clube)?.idolatria && <p className="ct-warning">Ídolo da torcida · Mais apoio nos retornos, mas maior cobrança por resultados.</p>}
        {(t.rupturasIdolo||[]).length>0 && <p className="ct-warning">Legado: vínculo de ídolo rompido com {t.rupturasIdolo.map(r=>r.clube).join(', ')} após assinar com um rival.</p>}
        <div className="ct-actions" aria-live="polite">
          {encerrada ? <><h2>Uma carreira para a história</h2><p>Carreira encerrada após {LIMITE_TEMPORADAS_TECNICO} temporadas. Reveja suas campanhas e conquistas.</p><div className="ct-career-total"><strong>{historico.aproveitamento}%</strong><span>de aproveitamento · {historico.clubes.length} clubes</span></div><button className="ct-primary" onClick={() => abrirConquistas(null)}>Ver conquistas</button></>
          : primeira ? <><h2>Oferta inicial</h2><p>Os primeiros clubes querem você no comando. Escolha onde sua carreira como treinador começa.</p><div className="ct-offers">{t.opcoesInicio.map(op => <CartaoClube key={op.clube} nome={op.clube} pais={t.pais} rotulo="Começar no" detalhe={op.idolatria ? 'Clube do coração' : 'Vínculo como jogador'} disabled={simulando} onClick={() => escolherClubeInicial(op.clube)} />)}</div></>
          : t.reuniaoPendente ? <><div className="vf-hero-diretoria" style={{backgroundImage:`url(${CENARIOS.diretoriaMobile})`}} /><h2>Conversa com a diretoria</h2><p>A pressão aumentou. Sua resposta define os próximos passos.</p><div className="ct-decisions">{OPCOES_REUNIAO_TECNICO.map(op => <button key={op.id} disabled={simulando} onClick={() => executar(() => { onReuniao?.(op.id); onJogar?.(); })}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div></>
          : t.fase === 'intervencao' && t.intervencaoPendente ? <><h2>Jogo importante</h2><p>Rodada {t.intervencaoPendente.rodada} · {t.intervencaoPendente.jogos} jogos disputados · {t.intervencaoPendente.pontos} pontos</p><div className="ct-season-preview"><Escudo nome={t.intervencaoPendente.adversario.nome} size={52} /><div><strong>{t.intervencaoPendente.adversario.nome}</strong><span>{t.intervencaoPendente.adversario.casa ? 'Em casa' : 'Fora de casa'} · Força {t.intervencaoPendente.adversario.forca}</span></div></div><p>Escolha o plano para esta partida. Depois dela, a temporada continua com a sua tática habitual.</p><div className="ct-decisions">{INTERVENCOES_TECNICO.map(op => <button key={op.id} disabled={simulando} onClick={() => executar(() => onIntervir?.(t.intervencaoPendente.chave, op.id))}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div></>
          : faseTemporada ? <><h2>Temporada {t.ano}</h2><p>O {t.clube} conta com você. Meta da temporada: {objetivo.nome.toLowerCase()}.</p><div className="ct-season-preview"><Escudo nome={t.clube} size={52} /><div><strong>{competicaoTemporadaTecnico({ clube: t.clube, liga: t.liga })}</strong><span>Diretoria {t.diretoria ?? 60}% · Torcida {t.torcida ?? 55}%</span></div></div><fieldset className="ct-tactics"><legend>Plano de jogo</legend><label className="ct-follow-match"><span>Acompanhar jogo importante</span><input type="checkbox" checked={!!t.acompanharJogo} disabled={simulando || !!t.andamento?.jogos || !!t.andamento?.rodadas} onChange={e => onAcompanhamento?.(e.target.checked)} /></label><p>Opcional: pause uma vez, antes de um dos adversários mais fortes da segunda metade da liga.</p><label>Formação<select aria-label="Formação" value={perfilTaticoTecnico(t).formacao} disabled={simulando || !!t.andamento?.jogos || !!t.andamento?.rodadas} onChange={e => onFormacao?.(e.target.value)}>{FORMACOES_TECNICO.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}</select></label><p>{FORMACOES_TECNICO.find(f => f.id === perfilTaticoTecnico(t).formacao)?.descricao}</p><label>Estilo<select aria-label="Estilo" value={perfilTaticoTecnico(t).estilo} disabled={simulando || !!t.andamento?.jogos || !!t.andamento?.rodadas} onChange={e => onEstilo?.(e.target.value)}>{ESTILOS_TECNICO.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select></label><p>{ESTILOS_TECNICO.find(e => e.id === perfilTaticoTecnico(t).estilo)?.descricao}</p><small>Vale para a liga e as copas disputadas nesta temporada. A força do elenco e a qualidade do adversário continuam decisivas.</small></fieldset><button disabled={simulando} className="ct-primary" onClick={() => setGestaoAberta(true)}>Elenco e mercado</button><button disabled={simulando} className="ct-primary" onClick={() => mostrarDecisao ? setDecisaoAberta(true) : simular()}>{mostrarDecisao ? 'Tomar decisão e simular' : 'Simular temporada'}<span aria-hidden="true">→</span></button></>
          : faseResultado ? <><h2>{semClube ? 'Propostas de trabalho' : 'Janela de transferências'}</h2><p>{semClube ? 'Um ciclo terminou. Escolha um novo projeto para continuar sua carreira.' : 'Chegaram ofertas depois da última temporada. Você pode aceitar uma ou ficar no clube.'}</p><div className="ct-offers">{t.propostas?.map(p => <CartaoClube key={p.nome} nome={p.nome} liga={p.liga} pais={p.pais} rotulo="Assinar com" detalhe={riscosIdolatriaTecnico(t,p.nome).length ? 'Rival de um clube onde você é ídolo' : (t.rupturasIdolo||[]).some(r=>r.clube===p.nome)?'Retorno sem benefícios de ídolo':vinculoAtivoTecnico(t,p.nome)?.idolatria?'Retorno de ídolo':null} disabled={simulando} onClick={() => iniciarProposta(p.nome)} />)}{!semClube && <CartaoClube nome={t.clube} liga={t.liga} pais={t.pais} rotulo="Ficar no" atual disabled={simulando} onClick={continuar} />}</div>{semClube && !t.propostas?.length && <button disabled={simulando} onClick={() => executar(() => onEsperar?.())} className="ct-primary">Aguardar propostas<span aria-hidden="true">→</span></button>}{ultima && <div className="ct-last-result"><span>Última temporada · {ultima.ano}</span><strong>{ultima.posicao}º lugar · {ultima.pontos} pontos</strong><span>{ultima.vitorias}V · {ultima.empates}E · {ultima.derrotas}D</span></div>}</>
          : <p>Carreira indisponível.</p>}
          {simulando && <div className="ct-simulating" role="status"><span className="ct-spinner" /><strong>Preparando a próxima temporada…</strong></div>}
          {erroProposta && <p role="status" className="ct-warning">A proposta de {erroProposta} foi recusada. Escolha outra opção.</p>}
          {erroSimulacao && <p role="alert" className="ct-warning">{erroSimulacao}</p>}
        </div>
      </section>

      <section className="ct-timeline" aria-label="Trajetória como treinador">
        <div className="ct-timeline-heading ct-timeline-row"><span>IDADE</span><span>CLUBE</span><span>POS</span><span>PTS</span><span>VIT</span><span>TAÇAS</span></div>
        <div className="ct-timeline-body">
          {temporadas.map((a, i) => <LinhaTemporada key={`${a.ano}-${i}`} a={a} idade={idadeInicio + i} ativa={i === temporadas.length - 1} aberta={aberta === i} onClick={() => setAberta(aberta === i ? null : i)} />)}
          {!encerrada && <div ref={atualRef} className="ct-timeline-row ct-current-row"><span className="ct-age">{idade}</span><span className="ct-season-club"><span className="ct-unknown">?</span><strong>{simulando ? 'Simulando temporada…' : primeira || faseResultado ? 'Escolhendo clube…' : 'Decisão de carreira…'}</strong></span><span className="ct-position">—</span><span /><span /><span /></div>}
          {Array.from({ length: futuras }, (_, i) => <div key={`futura-${i}`} className="ct-timeline-row ct-future" aria-hidden="true"><span>{idade + i + 1}</span><span /><span /><span /><span /><span /></div>)}
        </div>
        <footer className="ct-timeline-total"><Bandeira pais={t.pais || 'Brasil'} /><strong>{temporadas.length}/{LIMITE_TEMPORADAS_TECNICO} temporadas</strong><span>{historico.aproveitamento}% aproveitamento</span></footer>
      </section>
    </div>
    <footer className="ct-footer"><button type="button" onClick={onLegado}>{rotuloLegado}</button><button type="button" onClick={onSair}>Voltar ao início</button></footer>
  </div>;
}
