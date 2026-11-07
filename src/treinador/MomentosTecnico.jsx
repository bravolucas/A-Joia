/* Telas dos momentos da carreira de treinador: finais, parada da temporada,
   convite da seleção, resumo do ano, demissão, ano sem clube, rival e metas. */
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Escudo, Bandeira, JanelaTreinador } from './uiTreinador.jsx';
import { TacaCompeticao } from '../comum/trofeus.jsx';
import Bola3D from '../comum/Bola3D.jsx';
import { CENARIOS } from '../comum/arte.js';
import { competicaoDoTitulo } from '../comum/tacas.js';
import { FINAIS_TECNICO, chanceFinalTecnico, OPCOES_PARADA_TECNICO, ANO_SEM_CLUBE_TECNICO } from './momentosTecnico.js';
import './MomentosTecnico.css';

const semMovimento = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const festejar = cores => { if (!semMovimento()) confetti({ particleCount: 130, spread: 85, origin: { y: .45 }, colors: cores, zIndex: 130 }); };
const pct = n => `${Math.round(n * 100)}%`;
/** Escudo para clubes; bandeira para seleções. */
function Emblema({ nome, selecao, size = 44 }) {
  return selecao ? <span className="mt-flag" style={{ width: size, height: size }}><Bandeira pais={nome} /></span> : <Escudo nome={nome} size={size} />;
}

/* ---------- Final ---------- */
export function PopUpFinal({ final, moral, onEscolher, ocupado }) {
  const selecao = final.tipo === 'copaMundo';
  const diff = (final.forcaUsuario ?? 0) - (final.forcaAdv ?? 0);
  return <JanelaTreinador titulo={`Final · ${final.nome}`} onFechar={() => {}} classe="mt-modal">
    <div className="mt-final" style={{ backgroundImage: `linear-gradient(#0d0f0ecc,#0d0f0ef7 70%),url(${CENARIOS.estadioMobile})` }}>
      <span className="mt-eyebrow">A FINAL · {final.ano}</span>
      <div className="mt-cup"><TacaCompeticao tipo={final.tipo === 'copaMundo' ? 'copaMundo' : competicaoDoTitulo(final.nome).tipo} nome={final.nome} size={92} /></div>
      <h3>{final.nome}</h3>
      <div className="mt-versus">
        <div><Emblema nome={final.lado} selecao={selecao} size={54} /><strong>{final.lado}</strong><span>força {final.forcaUsuario}</span></div>
        <b>x</b>
        <div><Emblema nome={final.adversario} selecao={selecao} size={54} /><strong>{final.adversario}</strong><span>força {final.forcaAdv}</span></div>
      </div>
      <p className="mt-hint">{diff >= 3 ? 'Seu time é favorito. Ir para cima pode decidir cedo.' : diff <= -3 ? 'O rival é mais forte. Um plano fechado equilibra o jogo.' : 'Jogo parelho. Os detalhes vão decidir.'}{final.campoNeutro ? ' Campo neutro.' : ''}</p>
      <div className="ct-decisions mt-options">{FINAIS_TECNICO.map(op => {
        const chance = chanceFinalTecnico(final, op.id, moral);
        return <button key={op.id} disabled={ocupado} onClick={() => onEscolher(op.id)} aria-label={`${op.nome}: ${pct(chance)} de chance de título`}>
          <strong>{op.nome}</strong><span>{op.descricao}</span>
          <span className="mt-bar" aria-hidden="true"><i style={{ width: pct(chance) }} /></span>
          <b>{pct(chance)} de chance de título</b>
        </button>;
      })}</div>
    </div>
  </JanelaTreinador>;
}

export function PopUpResultadoFinal({ uf, onFechar }) {
  const [revelado, setRevelado] = useState(semMovimento());
  useEffect(() => { if (revelado) return; const id = setTimeout(() => setRevelado(true), 1500); return () => clearTimeout(id); }, [revelado]);
  useEffect(() => { if (revelado && uf.venceu) festejar(['#D8B44A', '#FFF2BE', '#FFFFFF']); }, [revelado, uf.venceu]);
  const selecao = uf.tipo === 'copaMundo';
  return <JanelaTreinador titulo="Resultado da final" onFechar={revelado ? onFechar : () => setRevelado(true)} classe="mt-modal">
    <div className={`mt-result ${revelado ? (uf.venceu ? 'mt-win' : 'mt-loss') : ''}`}>
      <span className="mt-eyebrow">{uf.nome} · sua escolha: {uf.escolha}</span>
      <div className="mt-versus mt-versus-small">
        <div><Emblema nome={uf.lado} selecao={selecao} size={40} /><strong>{uf.lado}</strong></div><b>x</b><div><Emblema nome={uf.adversario} selecao={selecao} size={40} /><strong>{uf.adversario}</strong></div>
      </div>
      <div className="mt-meter" role="img" aria-label={`Chance de título ${pct(uf.chance)}`}>
        <i className="mt-meter-win" style={{ width: pct(uf.chance) }}><span>Título {pct(uf.chance)}</span></i>
        <span className={`mt-meter-mark ${revelado ? 'parou' : ''}`} style={{ left: revelado ? pct(Math.min(.98, Math.max(.02, uf.dado ?? (uf.venceu ? uf.chance / 2 : (1 + uf.chance) / 2)))) : '0%' }} />
      </div>
      {revelado ? <>
        <h3>{uf.venceu ? 'CAMPEÃO!' : 'Vice-campeão'}</h3>
        <p className="mt-score">{uf.lado} {uf.placar} {uf.adversario}</p>
        <p>{uf.venceu ? 'A estratégia funcionou e a taça vai para a sua galeria.' : 'Faltou pouco. A campanha fica na história mesmo sem a taça.'}</p>
        <button className="ct-primary" onClick={onFechar}>Continuar<span aria-hidden="true">→</span></button>
      </> : <><div className="mt-ball"><Bola3D size={84} /></div><h3 className="mt-wait">Decidindo…</h3><button className="ct-primary" onClick={() => setRevelado(true)}>Ver agora</button></>}
    </div>
  </JanelaTreinador>;
}

/* ---------- Parada da temporada ---------- */
export function PainelParada({ p, onEscolher, ocupado }) {
  if (p.tipo === 'rival') return <PainelClassico p={p} onEscolher={onEscolher} ocupado={ocupado} />;
  const ops = OPCOES_PARADA_TECNICO[p.crise ? 'crise' : 'normal'];
  return <>
    {p.crise && <div className="vf-hero-diretoria" style={{ backgroundImage: `url(${CENARIOS.diretoriaMobile})` }} />}
    <h2>{p.crise ? 'Reunião de emergência' : `Parada na rodada ${p.rodada}`}</h2>
    <p>{p.crise ? `A diretoria quer respostas: ${p.posicao}º lugar, longe da meta (${p.objetivo.toLowerCase()}).` : `${p.posicao}º lugar com ${p.pontos} pontos em ${p.jogos} jogos. Meta: ${p.objetivo.toLowerCase()}.`}</p>
    <div className="mt-table" aria-label="Classificação parcial">
      {p.tabela.map(l => <div key={l.nome} className={l.meuClube ? 'mt-me' : ''}><span>{l.posicao}</span><strong>{l.nome}</strong><span>{l.pontos} pts</span></div>)}
      {p.minha && p.minha.posicao > p.tabela.length && <div className="mt-me"><span>{p.minha.posicao}</span><strong>{p.minha.nome}</strong><span>{p.minha.pontos} pts</span></div>}
    </div>
    <div className="ct-decisions">{ops.map(op => <button key={op.id} disabled={ocupado} onClick={() => onEscolher(op.id)}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div>
  </>;
}

/* ---------- Clássico contra o técnico rival ---------- */
function PainelClassico({ p, onEscolher, ocupado }) {
  const r = p.rival;
  return <>
    <span className="mt-eyebrow">RODADA {p.rodada} · CLÁSSICO</span>
    <h2>Clássico contra {r.nome}</h2>
    <p>{p.casa ? 'Em casa' : 'Fora de casa'} contra o {r.clube}. O técnico rival {r.v + r.e + r.d ? `tem ${r.d}V ${r.e}E ${r.v}D contra você` : 'nunca enfrentou você'}. A torcida só fala desse jogo.</p>
    <div className="mt-versus mt-derby">
      <div><Escudo nome={p.minha?.nome} size={44} /><strong>{p.minha?.nome}</strong><span>{p.posicao}º · força {p.forca}</span></div>
      <b>x</b>
      <div><Escudo nome={r.clube} size={44} /><strong>{r.clube}</strong><span>{r.posicao ? `${r.posicao}º · ` : ''}força {p.forcaAdv}</span></div>
    </div>
    <div className="ct-decisions">{OPCOES_PARADA_TECNICO.rival.map(op => <button key={op.id} disabled={ocupado} onClick={() => onEscolher(op.id)}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div>
  </>;
}
const textoClassico = k => `${k.resultado === 'V' ? 'vitória' : k.resultado === 'D' ? 'derrota' : 'empate'} por ${k.golsPro} x ${k.golsContra}`;

/* ---------- Caminho nas copas ---------- */
function CaminhoCopa({ torneio: x, lado }) {
  const jogos = (x.jogosUsuario || []).filter(j => !j.bye);
  return <details className="mt-path">
    <summary><TacaCompeticao tipo={x.tipo === 'copaMundo' ? 'copaMundo' : x.tipo || competicaoDoTitulo(x.nome).tipo} nome={x.nome} size={26} /><strong>{x.nome}</strong><span className={x.faseUsuario === 'Campeão' ? 'mt-v' : ''}>{x.faseUsuario}</span></summary>
    {jogos.length ? <div className="mt-games">{jogos.map((j, i) => {
      const adv = j.casa === lado ? j.fora : j.casa;
      return <div key={i}><span>{(j.fase || `Jogo ${i + 1}`).replace('Fase de grupos · ', '')}</span><Escudo nome={j.casa} size={20} /><strong>{j.golsCasa ?? '–'} x {j.golsFora ?? '–'}</strong><Escudo nome={j.fora} size={20} /><em className={j.vencedor === lado ? 'mt-v' : j.vencedor ? 'mt-d' : ''}>{adv}{j.penaltis ? ' · pên.' : ''}</em></div>;
    })}</div> : <p className="mt-note">Sem jogos registrados.</p>}
  </details>;
}

/* ---------- Seleção ---------- */
export function PopUpConvite({ conv, onResponder, ocupado }) {
  return <JanelaTreinador titulo="Convite da seleção" onFechar={() => onResponder(false)} classe="mt-modal">
    <div className="ct-event-content mt-invite">
      <span className="mt-eyebrow">COPA DO MUNDO {conv.ano}</span>
      <span className="mt-flag mt-flag-big"><Bandeira pais={conv.selecao} /></span>
      <h3>{conv.selecao} quer você no comando</h3>
      <p>A federação viu o seu trabalho e oferece a seleção para a Copa do Mundo. Você comanda o time no torneio e volta ao seu clube depois. Força da seleção: {conv.forca}.</p>
      <button className="ct-primary" disabled={ocupado} onClick={() => onResponder(true)}>Aceitar e disputar a Copa<span aria-hidden="true">→</span></button>
      <button className="mt-secondary" disabled={ocupado} onClick={() => onResponder(false)}>Agradecer e ficar só no clube</button>
    </div>
  </JanelaTreinador>;
}

export function PopUpCopaSelecao({ torneio, onFechar }) {
  const eu = torneio.selecao, campeao = torneio.faseUsuario === 'Campeão';
  useEffect(() => { if (campeao) festejar(['#D8B44A', '#22C55E', '#FFFFFF']); }, [campeao]);
  return <JanelaTreinador titulo="Copa do Mundo" onFechar={onFechar} classe="mt-modal">
    <div className="ct-event-content">
      <span className="mt-eyebrow">CAMPANHA COM {eu?.toUpperCase()}</span>
      <h3>{campeao ? 'Campeão do mundo!' : torneio.faseUsuario}</h3>
      <div className="mt-games">{(torneio.jogosUsuario || []).map((j, i) => <div key={i}><span>{j.fase}</span><span className="mt-flag"><Bandeira pais={j.casa} /></span><strong>{j.golsCasa} x {j.golsFora}</strong><span className="mt-flag"><Bandeira pais={j.fora} /></span><em className={j.vencedor === eu ? 'mt-v' : j.vencedor ? 'mt-d' : ''}>{j.casa === eu ? j.fora : j.casa}{j.penaltis ? ' · pên.' : ''}</em></div>)}</div>
      <button className="ct-primary" onClick={onFechar}>Continuar<span aria-hidden="true">→</span></button>
    </div>
  </JanelaTreinador>;
}

/* ---------- Resumo da temporada ---------- */
export function PopUpResumo({ temporada: a, metasNovas = [], rival, onFechar }) {
  const tabela = a.classificacao || [];
  const minha = tabela.find(x => x.meuClube);
  const top = tabela.slice(0, 5);
  return <JanelaTreinador titulo={`Resumo da temporada ${a.ano}`} onFechar={onFechar} classe="mt-modal">
    <div className="ct-event-content mt-summary">
      <div className="ct-event-club"><Escudo nome={a.clube} size={30} /><strong>{a.clube}</strong></div>
      <p className={a.cumpriuObjetivo ? 'ct-positive' : 'ct-warning'}>Meta: {a.objetivo} · {a.cumpriuObjetivo ? 'cumprida' : 'não cumprida'}</p>
      <div className="mt-table">{top.map(l => <div key={l.nome} className={l.meuClube ? 'mt-me' : ''}><span>{l.posicao}</span><strong>{l.nome}</strong><span>{l.pontos} pts</span></div>)}
        {minha && minha.posicao > top.length && <div className="mt-me"><span>{minha.posicao}</span><strong>{minha.nome}</strong><span>{minha.pontos} pts</span></div>}</div>
      {a.contratoCurto === 'renovado' && <p className="mt-note">✍️ Contrato de um ano cumprido: a diretoria renovou com você.</p>}
      {(a.torneios || []).length > 0 && <div className="mt-cups" aria-label="Caminho nas copas">{a.torneios.map(x => <CaminhoCopa key={x.nome} torneio={x} lado={x.tipo === 'copaMundo' ? x.selecao : a.clube} />)}</div>}
      {a.classico && <p className="mt-note">⚔️ Clássico contra {a.classico.rival} ({a.classico.clube}): {textoClassico(a.classico)}.</p>}
      {a.cobrancaGigante && <p className="mt-note">{a.cobrancaGigante === 'jejum' ? '🔥 Segundo ano sem título: a cobrança no clube grande ficou pesada.' : '👀 Em clube grande, só o título conta. A diretoria cobra.'}</p>}
      {(a.paradas || []).length > 0 && <p className="mt-note">Paradas: {a.paradas.map(p => `rodada ${p.rodada} — ${p.nome}${p.apostaDeuCerto === false ? ' (a diretoria não comprou)' : ''}`).join(' · ')}</p>}
      {(a.finais || []).length > 0 && <p className="mt-note">Finais: {a.finais.map(f => `${f.nome}: ${f.venceu ? 'título' : 'vice'} (${f.escolhaNome})`).join(' · ')}</p>}
      {a.rival && <p className="mt-note">Duelo com {a.rival.nome} ({a.rival.clube}): {a.rival.v}V {a.rival.e}E {a.rival.d}D{a.rival.campeao ? ' · ele foi campeão' : ''}{rival ? ` · no total ${rival.v}V ${rival.e}E ${rival.d}D` : ''}</p>}
      {metasNovas.length > 0 && <div className="mt-goals-new">{metasNovas.map(m => <span key={m.id}>🏅 Meta cumprida: {m.nome}</span>)}</div>}
      <button className="ct-primary" onClick={onFechar}>Continuar<span aria-hidden="true">→</span></button>
    </div>
  </JanelaTreinador>;
}

/* ---------- Demissão e ano sem clube ---------- */
export function PopUpDemissao({ temporada: a, t, onFechar }) {
  return <JanelaTreinador titulo="Fim de ciclo" onFechar={onFechar} classe="mt-modal">
    <div className="ct-event-content mt-fired">
      <div className="vf-hero-diretoria" style={{ backgroundImage: `url(${CENARIOS.diretoriaMobile})` }} />
      <span className="mt-eyebrow">{a.interrompida ? 'NO MEIO DA TEMPORADA' : `FIM DA TEMPORADA ${a.ano}`}</span>
      <h3>Você foi demitido</h3>
      <div className="ct-event-club"><Escudo nome={a.clube} size={30} /><strong>{a.clube}</strong></div>
      <div className="mt-fired-stats">{[[`${a.posicao}º`, 'posição'], [`${t.diretoria ?? 0}%`, 'diretoria'], [`${t.torcida ?? 0}%`, 'torcida']].map(([v, r]) => <div key={r}><strong>{v}</strong><span>{r}</span></div>)}</div>
      <p>Meta: {a.objetivo}. {a.contratoCurto === 'encerrado' ? 'O contrato de um ano terminou sem a meta e não foi renovado.' : a.cumpriuObjetivo ? 'A meta veio, mas a relação desgastou.' : 'O resultado ficou longe do combinado e a diretoria decidiu encerrar o trabalho.'} A carreira continua: há propostas, e você também pode tirar um ano para se preparar.</p>
      <button className="ct-primary" onClick={onFechar}>Seguir em frente<span aria-hidden="true">→</span></button>
    </div>
  </JanelaTreinador>;
}

export function AnoSabatico({ onEscolher, ocupado, temPropostas }) {
  return <div className="mt-sabbatical">
    <h3>{temPropostas ? 'Ou tire um ano fora do banco' : 'Um ano fora do banco'}</h3>
    <div className="ct-decisions">{ANO_SEM_CLUBE_TECNICO.map(op => <button key={op.id} disabled={ocupado} onClick={() => onEscolher(op.id)}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div>
  </div>;
}

/* ---------- Painel ---------- */
export function PrevisaoTemporada({ prev }) {
  if (!prev?.rank) return null;
  return <div className={`mt-forecast mt-forecast-${prev.tom}`}>
    <strong>{prev.rotulo}</strong>
    <span>Força {prev.forca} · {prev.rank}º elenco de {prev.total} · média da liga {prev.media}</span>
  </div>;
}
export function RivalTecnico({ rival }) {
  if (!rival) return null;
  return <p className="mt-rival"><Escudo nome={rival.clube} size={18} /><span>Rival: <strong>{rival.nome}</strong> ({rival.clube}) · {rival.v}V {rival.e}E {rival.d}D{rival.titulosDele ? ` · ${rival.titulosDele} título${rival.titulosDele > 1 ? 's' : ''} dele` : ''}</span></p>;
}
export function NoticiasElenco({ noticias = [], destaque }) {
  if (!noticias.length && !destaque) return null;
  return <div className="mt-news">
    {destaque && <p>⭐ Seu destaque: <strong>{destaque.nome}</strong>, {destaque.idade} anos, nível {destaque.nivel}.</p>}
    {noticias.map((n, i) => <p key={i}>📰 {n}</p>)}
  </div>;
}
export function MetasCarreira({ metas, concluidas = {} }) {
  const feitas = metas.filter(m => m.feito).length;
  return <details className="mt-goals">
    <summary>Metas da carreira · {feitas}/{metas.length}</summary>
    <ul>{metas.map(m => <li key={m.id} className={m.feito ? 'feita' : ''}><span aria-hidden="true">{m.feito ? '🏅' : '○'}</span><div><strong>{m.nome}</strong><small>{m.descricao}{m.progresso && !m.feito ? ` · ${m.progresso}` : ''}{concluidas[m.id] ? ` · ${concluidas[m.id]}` : ''}</small></div></li>)}</ul>
  </details>;
}

/* ---------- Legado completo: jogador + treinador ---------- */
export function LegadoCompleto({ legado: l, aberto = false }) {
  if (!l) return null;
  const linhas = (pares) => pares.map(([v, r]) => <div key={r}><strong>{v}</strong><span>{r}</span></div>);
  return <details className="mt-goals mt-legacy" open={aberto}>
    <summary>{l.nivel.icone} Legado completo · {l.nivel.nome}</summary>
    <div className="mt-legacy-body">
      <div className="mt-legacy-total"><strong>{l.total}</strong><span>pontos de legado{l.proximo ? ` · faltam ${l.proximo.min - l.total} para “${l.proximo.nome}”` : ''}</span></div>
      <div className="mt-legacy-cols">
        <section aria-label="Como jogador"><h4>⚽ Jogador · {l.jogador.pontos} pts</h4>{l.jogador.nivel && <p>{l.jogador.nivel}</p>}
          <div className="mt-legacy-grid">{linhas([[l.jogador.temporadas, 'temporadas'], [l.jogador.gols, 'gols'], [l.jogador.titulos, 'títulos'], [l.jogador.clubes, 'clubes'], ...(l.jogador.bolaOuro ? [[l.jogador.bolaOuro, 'Bola de Ouro']] : [])])}</div></section>
        <section aria-label="Como treinador"><h4>📋 Treinador · {l.treinador.pontos} pts</h4><p>{l.treinador.metas}/{l.treinador.totalMetas} metas da carreira</p>
          <div className="mt-legacy-grid">{linhas([[l.treinador.temporadas, 'temporadas'], [l.treinador.vitorias, 'vitórias'], [l.treinador.titulos, 'títulos'], [l.treinador.clubes, 'clubes']])}</div></section>
      </div>
      {l.clubesDuasEras.length > 0 && <p className="mt-note">💚 Nas duas eras: {l.clubesDuasEras.join(', ')}.</p>}
    </div>
  </details>;
}

