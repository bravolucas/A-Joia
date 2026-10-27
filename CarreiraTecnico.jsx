import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { TacaCompeticao } from './trofeus.jsx';
import { escudoDe, bandeiraDe } from './arte.js';
import { competicaoDoTitulo } from './tacas.js';
import { cartaAtualTecnico, historicoProfissionalTecnico, objetivoTecnico, LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico, competicaoTemporadaTecnico, calcularOvrTecnico, salarioTecnico } from './tecnico.js';

function Escudo({ nome, size = 42 }) {
  const src = escudoDe(nome);
  return src ? <img src={src} alt={nome} style={{width:size,height:size,objectFit:'contain'}} /> : <div className="rounded-full bg-white/10 flex items-center justify-center text-xl" style={{width:size,height:size}}>⚽</div>;
}
function Bandeira({ pais, size = 20 }) {
  const src = bandeiraDe(pais);
  return src ? <img src={src} alt={pais} className="inline-block object-cover" style={{width:size,height:size*.75,borderRadius:3}} /> : <span aria-label={pais || 'País'}>🌎</span>;
}
function PopUpTitulo({ temporada, titulo, indice, total, onFechar }) {
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confetti({particleCount:150,spread:85,origin:{y:.48},colors:['#D8B44A','#FFF2BE','#FFFFFF']});
    const esc = e => { if(e.key === 'Escape') onFecharRef.current(); };
    document.addEventListener('keydown',esc);
    return () => { document.body.style.overflow = anterior; document.removeEventListener('keydown',esc); };
  }, [temporada.ano, indice]);
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true" aria-label="Título conquistado" style={{background:'rgba(2,8,7,.94)'}}>
    <div className="w-full max-w-sm rounded-3xl border border-[#D8B44A]/50 text-center px-6 py-7 relative overflow-hidden" style={{background:'radial-gradient(ellipse at 50% 15%, #65521F 0%, #19231E 50%, #0D1512 100%)',boxShadow:'0 0 70px #D8B44A30'}}>
      <div className="text-[#EBC557] font-black tracking-[.22em] text-xs uppercase">A JOIA · Temporada {temporada.ano}</div>
      <h2 className="display text-4xl text-white mt-2">CAMPEÃO!</h2>
      <div className="flex justify-center my-6" style={{filter:'drop-shadow(0 0 24px #D8B44A80)'}}><TacaCompeticao tipo={competicaoDoTitulo(titulo).tipo} nome={titulo} size={142}/></div>
      <p className="text-[#F4D67A] font-bold text-xl">{titulo}</p>
      {total > 1 && <p className="text-[#9BAEA3] text-xs mt-2">Conquista {indice + 1} de {total}</p>}
      <div className="flex items-center justify-center gap-3 mt-3"><Escudo nome={temporada.clube} size={35}/><span className="text-white font-bold text-lg">{temporada.clube}</span></div>
      <p className="text-[#B6C2BA] text-sm mt-3">{temporada.posicao}º na liga · {temporada.pontos} pontos · {temporada.vitorias} vitórias</p>
      <button autoFocus onClick={onFechar} className="rp-btn rp-ouro w-full mt-7">{indice + 1 < total ? 'Próximo troféu' : 'Continuar carreira'}</button>
    </div>
  </div>,document.body);
}

export default function CarreiraTecnico({ c, onDecisao, onSimularTemporada, onAvancar, onAvancarESimular, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
  const t = c.tecnico;
  const temporadas = t.temporadas || [];
  const ultima = temporadas.at(-1);
  const primeira = temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0;
  const semClube = t.demitido || t.desempregado;
  const encerrada = carreiraTecnicoEncerrada(t);
  const carta = (t.decisoes || []).length === 0 ? cartaAtualTecnico(t) : null;
  const historico = historicoProfissionalTecnico(t);
  const titulos = titulosConquistadosTecnico(t);
  const [titulosVistos, setTitulosVistos] = useState({ chave: null, quantidade: 0 });
  const [simulando, setSimulando] = useState(false);
  const [anoEmFoco, setAnoEmFoco] = useState(null);
  const [timelineAberta, setTimelineAberta] = useState(true);
  const timelineAtualRef = useRef(null);
  const conquistasUltima = ultima ? (Array.isArray(ultima.titulosConquistados) ? ultima.titulosConquistados : (ultima.campeao ? [competicaoTemporadaTecnico(ultima)] : [])) : [];
  const chaveTitulo = conquistasUltima.length ? String(temporadas.length)+'|'+String(ultima.ano)+'|'+ultima.clube+'|'+conquistasUltima.join('|') : null;
  const indiceTitulo = titulosVistos.chave === chaveTitulo ? titulosVistos.quantidade : 0;
  const mostrarTitulo = t.fase === 'resultado' && !!chaveTitulo && indiceTitulo < conquistasUltima.length;
  const decisaoEscolhida = (t.decisoes || []).some(d => d.opcao !== 'neutra');
  const decisaoRegistrada = (t.decisoes || []).find(d => d.opcao !== 'neutra');
  const rating = calcularOvrTecnico(t);
  const idadeTecnico = (t.idadeInicio || c.idade || 0) + temporadas.length;
  const temporadasExibidas = timelineAberta ? temporadas : temporadas.slice(-8);
  const temporadaEmFoco = anoEmFoco == null ? null : temporadas.find(a => String(a.ano) === String(anoEmFoco));
  const estatisticaNaTemporada = indice => {
    const ate = temporadas.slice(0, indice + 1);
    const acumulado = atributo => ate.reduce((soma, a) => soma + (a[atributo] || 0), 0);
    return calcularOvrTecnico({
      ...t,
      temporadas: ate,
      vitorias: acumulado('vitorias'),
      empates: acumulado('empates'),
      derrotas: acumulado('derrotas'),
      titulos: ate.filter(a => a.campeao).length
    });
  };
  useEffect(() => {
    if (t.fase === 'resultado') setSimulando(false);
    setAnoEmFoco(null);
    if (timelineAtualRef.current) timelineAtualRef.current.scrollIntoView({ block: 'nearest' });
  }, [t.fase, t.ano, temporadas.length]);
  const escolher = id => {
    if (simulando || !onDecisao) return;
    onDecisao(id);
  };
  const simular = () => {
    if (simulando) return;
    setSimulando(true);
    try {
      const resultado = onSimularTemporada ? onSimularTemporada() : onDecisao?.(null);
      if (resultado && typeof resultado.then === 'function') {
        Promise.resolve(resultado).catch(() => setSimulando(false));
      }
    } catch (erro) {
      setSimulando(false);
      throw erro;
    }
  };
  return <main className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 rp-entra">
    {mostrarTitulo && <PopUpTitulo temporada={ultima} titulo={conquistasUltima[indiceTitulo]} indice={indiceTitulo} total={conquistasUltima.length} onFechar={() => setTitulosVistos({chave:chaveTitulo,quantidade:indiceTitulo+1})}/>}
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(330px,410px)_minmax(0,1fr)] gap-3 items-start">
      <aside className="flex flex-col gap-3 min-w-0">
        <section className="rounded-2xl overflow-hidden border border-white/10 bg-[#101412]">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-2xl flex flex-col items-center justify-center text-white" style={{width:72,height:78,background:'linear-gradient(145deg,#F99B37,#D96518)',boxShadow:'0 8px 28px #D9651830'}}>
                <span className="text-[9px] font-black tracking-[.16em] opacity-80">OVR</span><strong className="text-3xl leading-none">{rating}</strong>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <Bandeira pais={t.pais || 'Brasil'} size={18}/>
                  <span className="rounded-full bg-[#B3263E] text-white px-2 py-0.5 text-[10px] font-black tracking-wide">TREINADOR</span>
                </div>
                <h1 className="text-white text-xl sm:text-2xl font-black leading-tight truncate mt-1">{c.nome}</h1>
                <p className="flex items-center gap-1.5 text-[#D7DDD9] font-semibold text-sm truncate mt-1"><Escudo nome={semClube ? 'Sem clube' : t.clube} size={22}/>{semClube ? 'Sem clube' : t.clube}</p>
              </div>
              <div className="text-right pt-1 shrink-0"><span className="block text-[10px] text-[#89928D]">IDADE</span><strong className="text-white text-2xl leading-none">{idadeTecnico}</strong><span className="block text-[10px] text-[#89928D] mt-2">SALÁRIO</span><strong className="text-[#F0B95A] text-xs">R$ {salarioTecnico(t)} mil</strong></div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-5 pt-3 border-t border-white/10 text-center">
              <div><strong className="block text-white text-xl leading-none">{historico.jogos}</strong><span className="text-[#89928D] text-[10px] uppercase tracking-wide">jogos</span></div>
              <div><strong className="block text-white text-xl leading-none">{historico.vitorias}</strong><span className="text-[#89928D] text-[10px] uppercase tracking-wide">vitórias</span></div>
              <div><strong className="block text-white text-xl leading-none">{titulos.length}</strong><span className="text-[#89928D] text-[10px] uppercase tracking-wide">títulos</span></div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-center min-h-20">
              {titulos.length ? <div className="flex items-center gap-3"><TacaCompeticao tipo={titulos[titulos.length-1].tipo} nome={titulos[titulos.length-1].nome} size={42}/><div><strong className="block text-[#E7C66C] text-xs">{titulos[titulos.length-1].nome}</strong><span className="text-[#89928D] text-[10px]">última conquista · {titulos[titulos.length-1].ano}</span></div></div> : <div className="flex flex-col items-center gap-1 text-[#616B65]"><span className="text-2xl leading-none">🏆</span><span className="text-[10px] font-bold tracking-[.16em] uppercase">Vitrine vazia</span></div>}
            </div>
          </div>
          <div className="px-4 py-2.5 bg-[#0B0E0D] border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-[#89928D]">Temporada {t.ano} · {temporadas.length}/{LIMITE_TEMPORADAS_TECNICO}</span>
            <span className="text-[#E0B957] font-bold">DIRETORIA {t.diretoria ?? 60}%</span>
          </div>
        </section>

        <section className="rounded-2xl overflow-hidden border border-white/10 bg-[#101412] min-h-[400px]">
          {temporadaEmFoco ? <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3"><span className="text-[#A7B0AB] text-[10px] uppercase font-black tracking-[.18em]">Temporada do histórico</span><button onClick={() => setAnoEmFoco(null)} className="text-[#F1BB57] text-xs font-bold">Voltar ao presente</button></div>
            <div className="flex items-center gap-3 mt-4"><Escudo nome={temporadaEmFoco.clube} size={48}/><div><h2 className="text-white text-2xl font-black">{temporadaEmFoco.ano}</h2><p className="text-[#A6B0AA] text-xs">{temporadaEmFoco.clube} · {competicaoTemporadaTecnico(temporadaEmFoco)}</p></div></div>
            <h3 className="text-white text-xl font-bold mt-5">{temporadaEmFoco.campeao ? '🏆 Campeão da temporada' : temporadaEmFoco.posicao+'º lugar'}</h3>
            <p className="text-[#A6B0AA] text-sm mt-1">{temporadaEmFoco.pontos} pontos · {temporadaEmFoco.vitorias}V {temporadaEmFoco.empates}E {temporadaEmFoco.derrotas}D</p>
            {!!temporadaEmFoco.titulosConquistados?.length && <div className="flex flex-wrap gap-2 mt-4">{temporadaEmFoco.titulosConquistados.map(nome => <div key={nome} className="flex items-center gap-2 rounded-xl bg-[#1A201D] px-3 py-2"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={32}/><span className="text-[#E8C66A] text-xs font-bold">{nome}</span></div>)}</div>}
            {temporadaEmFoco.classificacao?.length > 0 && <div className="mt-5 overflow-hidden rounded-xl border border-white/10"><div className="bg-[#191E1B] px-3 py-2 text-white text-xs font-bold">Classificação final</div><div className="max-h-72 overflow-y-auto">{temporadaEmFoco.classificacao.map(l => <div key={l.nome} className={'grid grid-cols-[2rem_1fr_2.5rem_2.5rem] gap-2 px-3 py-2 border-t border-white/5 text-xs '+(l.meuClube ? 'text-[#F1C65A] bg-[#E6B73B]/10 font-bold' : 'text-[#B8C1BC]')}><span>{l.posicao}</span><span className="truncate">{l.nome}</span><span className="text-right">{l.vitorias}</span><span className="text-right">{l.pontos}</span></div>)}</div></div>}
          </div> : primeira ? <div className="p-4 sm:p-5">
            <div className="text-[#A7B0AB] text-[10px] uppercase font-black tracking-[.18em]">Oferta inicial</div>
            <h2 className="text-white text-xl font-black mt-1">Escolha onde sua carreira continua</h2>
            <p className="text-[#929C96] text-xs mt-1">Os clubes que você idolatra como jogador aparecem primeiro.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">{t.opcoesInicio.map(op => <button key={op.clube} onClick={() => onEscolherClubeInicial(op.clube)} className="rounded-2xl border border-white/10 bg-[#171C19] hover:bg-[#202722] p-3 min-h-36 text-center transition"><span className="block text-[#8E9892] text-[10px]">Assinar com</span><strong className="block text-white text-sm leading-tight mt-0.5">{op.clube}</strong><div className="flex justify-center my-3"><Escudo nome={op.clube} size={54}/></div><span className="inline-flex items-center gap-1 text-[10px] text-[#ACB5B0]"><span className="text-[#DBB54C]">🏆</span>{op.idolatria ? 'Clube de coração' : 'Vínculo como jogador'}</span><span className="block text-[#8F9993] text-[10px] mt-1">Afinidade {op.afinidade}/100</span></button>)}</div>
          </div> : t.fase === 'pretemporada' && !encerrada ? <div className="p-4 sm:p-5">
            <div className="text-[#A7B0AB] text-[10px] uppercase font-black tracking-[.18em]">Temporada {t.ano} · decisão intensa</div>
            <div className="flex items-center gap-3 mt-3 pb-3 border-b border-white/10"><Escudo nome={t.clube} size={38}/><div className="min-w-0"><h2 className="text-white text-lg font-black truncate">{t.clube}</h2><p className="text-[#AEB8B2] text-xs truncate">{competicaoTemporadaTecnico({clube:t.clube,liga:t.liga})}</p></div><span className="ml-auto rounded-full bg-[#B3263E] text-white text-[10px] font-black px-2 py-1">ANO {temporadas.length+1}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">{[['Elenco',t.elenco ?? 50],['Torcida',t.torcida ?? 55],['Meta',objetivoTecnico(t).posicao+'º']].map(([label,value]) => <div key={label} className="rounded-lg border border-white/5 bg-[#0B0E0D] py-2"><strong className="block text-white text-sm">{value}</strong><span className="text-[#8A948E] text-[9px] uppercase">{label}</span></div>)}</div>
            {(t.decisoes || []).length ? <div className="mt-5 rounded-xl border border-[#E4B74A]/40 bg-[#3B3019]/25 p-3"><div className="text-[#E7C66C] text-[10px] font-black uppercase tracking-[.15em]">Plano registrado</div><h3 className="text-white font-bold mt-1">{decisaoRegistrada?.nome || 'Plano de temporada'}</h3><p className="text-[#A6B0AA] text-xs mt-1">{decisaoRegistrada?.resultado || 'Uma decisão já foi registrada para esta temporada.'}</p><p className="text-[#929C96] text-[11px] mt-3">Avance pela linha do tempo para simular o ano.</p></div> : carta ? <div className="mt-5">
              <div className="text-[#E6C66D] text-[10px] font-black tracking-[.18em] uppercase">Decisão da temporada</div><h3 className="text-white font-bold text-lg mt-1">{carta.titulo}</h3><p className="text-[#A0ABA4] text-xs mt-1">{carta.texto}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">{carta.opcoes.map(op => <button type="button" key={op.id} onClick={() => escolher(op.id)} className="rounded-2xl border border-white/10 bg-[#171C19] hover:border-[#D8B44A]/50 hover:bg-[#202722] p-3 text-left min-h-28 transition"><span className="flex items-center justify-between"><span className="text-[#E7BD50] text-xl">{op.id === 'pedir' ? '↗' : op.id === 'base' ? '⌂' : op.id === 'proteger' ? '🛡' : '⚽'}</span><span className="text-[9px] uppercase tracking-wider text-[#78837D]">Escolher</span></span><strong className="block text-white text-sm mt-2 leading-tight">{op.nome}</strong><span className="block text-[#9BA69F] text-[10px] leading-snug mt-1">{op.detalhe}</span></button>)}</div>
              <button type="button" onClick={simular} className="w-full mt-3 rounded-xl border border-white/10 bg-[#0B0E0D] text-[#ACB5B0] text-xs py-2.5 hover:text-white">Pular decisão e simular esta temporada</button>
            </div> : <div className="mt-5 rounded-xl border border-white/10 p-4 text-center text-[#A6B0AA] text-sm">A decisão desta temporada já foi processada.</div>}
            {simulando && <p role="status" className="text-[#EBC557] text-xs mt-3 text-center">Simulando a temporada…</p>}
          </div> : t.fase === 'resultado' ? <div className="p-4 sm:p-5">
            <div className="text-[#A7B0AB] text-[10px] uppercase font-black tracking-[.18em]">Resultado da temporada</div>
            {ultima && <><div className="flex items-center gap-3 mt-3 pb-3 border-b border-white/10"><Escudo nome={ultima.clube} size={42}/><div><h2 className="text-white text-2xl font-black">{ultima.ano}</h2><p className="text-[#A6B0AA] text-xs">{ultima.clube} · {competicaoTemporadaTecnico(ultima)}</p></div></div><h3 className="text-white text-xl font-bold mt-4">{(ultima.titulosConquistados?.length || ultima.campeao) ? '🏆 Temporada com título!' : ultima.posicao+'º lugar no campeonato'}</h3><p className="text-[#ACB5B0] text-sm mt-1">{ultima.pontos} pontos · {ultima.vitorias}V {ultima.empates}E {ultima.derrotas}D</p>
              {!!ultima.titulosConquistados?.length && <div className="flex flex-wrap gap-2 mt-4">{ultima.titulosConquistados.map(nome => <div key={nome} className="flex items-center gap-2 rounded-xl border border-[#D5AC45]/25 bg-[#2B2416] px-3 py-2"><TacaCompeticao tipo={competicaoDoTitulo(nome).tipo} nome={nome} size={40}/><span className="text-[#F0CE67] text-[11px] font-bold">{nome}</span></div>)}</div>}
              <div className="grid grid-cols-3 gap-2 mt-4">{[['Vitórias',ultima.vitorias],['Empates',ultima.empates],['Derrotas',ultima.derrotas]].map(([label,value]) => <div key={label} className="rounded-xl bg-[#171C19] p-2 text-center"><strong className="block text-white text-lg">{value}</strong><span className="text-[#8B968F] text-[9px] uppercase">{label}</span></div>)}</div><div className="mt-3 rounded-lg bg-[#0B0E0D] p-3 text-[#A8B1AC] text-xs">Meta: {ultima.objetivo} · {ultima.cumpriuObjetivo ? 'cumprida' : 'não cumprida'}</div></>}
            {semClube && <div role="status" className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 p-3"><strong className="block text-red-200 text-sm">{t.demitido ? 'Demissão' : 'Sem clube'}</strong><p className="text-red-100/75 text-xs mt-1">{t.demitido ? 'A diretoria decidiu encerrar seu trabalho.' : 'Você está no mercado de treinadores.'}</p></div>}
            {(t.propostas || []).length > 0 && <div className="mt-4"><div className="text-white font-bold text-sm">Ofertas de trabalho</div><div className="grid grid-cols-2 gap-2 mt-2">{t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome,'prudente')} className="rounded-2xl border border-white/10 bg-[#171C19] hover:bg-[#202722] p-3 text-center transition"><span className="block text-[#8F9993] text-[10px]">Assinar com</span><strong className="block text-white text-sm mt-1">{p.nome}</strong><div className="flex justify-center my-2"><Escudo nome={p.nome} size={45}/></div><span className="block text-[#A0AAA4] text-[10px]">{p.pais} · R$ {p.salario} mil/mês</span><span className="block text-[#D9B652] text-[10px] mt-1">Meta {p.objetivo}</span></button>)}</div></div>}
            {!encerrada && !semClube && <p className="text-[#919B95] text-xs mt-4 text-center">Clique no próximo ano na linha do tempo para continuar.</p>}
            {!encerrada && semClube && <button onClick={onEsperar} className="w-full rounded-xl border border-white/10 bg-[#0B0E0D] text-[#B0B9B4] text-xs py-2.5 mt-4">Aguardar novas propostas</button>}
            {encerrada && <div className="mt-4 rounded-xl border border-[#E3B949]/30 bg-[#322918]/30 p-3 text-center"><strong className="text-[#EBC557]">Fim da carreira como treinador</strong><p className="text-[#9BA69F] text-xs mt-1">{LIMITE_TEMPORADAS_TECNICO} temporadas concluídas. A vitrine completa está no perfil.</p></div>}
          </div> : <div className="p-4 text-center text-[#AAB3AE]">Carreira indisponível.</div>}
        </section>

        {(encerrada || titulos.length > 0) && <details open={encerrada} className="rounded-2xl border border-white/10 bg-[#101412] p-4">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-2"><span className="text-[#EBC557] font-bold">🏆 Vitrine de títulos</span><span className="text-[#A7B0AB] text-xs">{titulos.length} conquistas · {historico.jogos} jogos</span></summary>
          <div className="grid grid-cols-3 gap-2 mt-4">{titulos.length ? titulos.map((titulo,i) => <div key={i} className="flex flex-col items-center text-center gap-1 rounded-xl bg-[#171C19] p-2"><TacaCompeticao tipo={titulo.tipo} nome={titulo.nome} size={44}/><strong className="text-white text-[10px] leading-tight">{titulo.nome}</strong><span className="text-[#919B95] text-[9px]">{titulo.ano} · {titulo.clube}</span></div>) : <p className="text-[#8FA39A] text-sm col-span-3">Nenhum título conquistado.</p>}</div>
        </details>}
        <button onClick={onLegado} className="w-full rounded-xl border border-white/10 bg-[#111714] text-[#ADB7B1] text-xs py-3">Ver legado como jogador</button>
        <button onClick={onSair} className="text-[#89928D] hover:text-white text-xs py-1">Voltar ao menu · progresso salvo</button>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-[#101412] overflow-hidden min-w-0">
        <div className="px-4 sm:px-5 py-4 border-b border-white/10 bg-[#0C100E]">
          <div className="flex items-center justify-between gap-3">
            <div><span className="text-[#9CA7A0] text-[10px] font-black uppercase tracking-[.2em]">Modo treinador · ritmo intenso</span><h2 className="text-white text-xl font-black mt-1">Temporada a temporada</h2></div>
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[#AFB8B3] text-xs font-bold">{temporadas.length} / {LIMITE_TEMPORADAS_TECNICO}</span>
          </div>
          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_2.8rem_2.5rem_3rem] gap-2 mt-4 px-2 text-[9px] font-black text-[#707B74] uppercase tracking-wider"><span>Ano</span><span>Clube / competição</span><span className="text-right">OVR</span><span className="text-right">Pos</span><span className="text-right">Pts</span></div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-3 pb-4">
          {temporadasExibidas.map((a,visibleIndex) => {
            const i = timelineAberta ? visibleIndex : temporadas.length - temporadasExibidas.length + visibleIndex;
            const titulosAno = Array.isArray(a.titulosConquistados) ? a.titulosConquistados : (a.campeao ? [competicaoTemporadaTecnico(a)] : []);
            const foco = String(a.ano) === String(anoEmFoco);
            return <button type="button" key={a.ano+'-'+i} onClick={() => setAnoEmFoco(a.ano)} aria-pressed={foco} className={'w-full grid grid-cols-[3.25rem_minmax(0,1fr)_2.8rem_2.5rem_3rem] gap-2 items-center px-2 py-2 border-b border-white/5 text-left transition '+(foco ? 'bg-[#D7AA3B]/15' : 'hover:bg-white/[.035]')}>
              <span className="rounded-full bg-[#232A26] text-[#B9C2BD] text-[10px] font-black px-1.5 py-1 text-center">{a.ano}</span>
              <span className="flex items-center gap-2 min-w-0"><Escudo nome={a.clube} size={27}/><span className="min-w-0 flex-1"><strong className="block text-white text-xs truncate">{a.clube}</strong><span className="block text-[#8B9690] text-[9px] truncate">{competicaoTemporadaTecnico(a)} · {a.campeao ? 'Campeão' : a.posicao+'º lugar'}</span>{titulosAno.length>0 && <span className="flex items-center gap-1 mt-0.5 text-[#E5C15D]"><TacaCompeticao tipo={competicaoDoTitulo(titulosAno[0]).tipo} nome={titulosAno[0]} size={15}/><span className="text-[9px] truncate">{titulosAno[0]}</span></span>}</span></span>
              <span className="text-right text-[#E0A844] text-xs font-black">{estatisticaNaTemporada(i)}</span><span className="text-right text-[#C0C8C3] text-xs">{a.posicao}º</span><span className="text-right text-white text-xs font-bold">{a.pontos}</span>
            </button>;
          })}
          {temporadas.length > 8 && <button type="button" onClick={() => setTimelineAberta(!timelineAberta)} className="w-full py-2 text-[#B6C3BB] text-[11px] font-bold hover:text-white">{timelineAberta ? 'Mostrar só as 8 últimas' : 'Ver as '+temporadas.length+' temporadas'}</button>}
          {temporadas.length === 0 && <div className="px-3 py-7 text-center"><p className="text-[#707B74] text-sm">A linha do tempo da sua carreira aparecerá aqui.</p><p className="text-[#9BA69F] text-xs mt-1">Escolha seu primeiro clube para começar.</p></div>}
          {t.fase === 'pretemporada' && <button ref={timelineAtualRef} type="button" disabled={primeira || encerrada || simulando} onClick={() => simular()} className="w-full grid grid-cols-[3.25rem_minmax(0,1fr)_2.8rem_2.5rem_3rem] gap-2 items-center px-2 py-2.5 border-b border-white/5 text-left bg-[#171D19] hover:bg-[#1D251F] disabled:opacity-50">
            <span className="rounded-full bg-[#B3263E] text-white text-[10px] font-black px-1.5 py-1 text-center">{t.ano}</span>
            <span className="flex items-center gap-2 min-w-0"><Escudo nome={t.clube} size={27}/><span className="min-w-0"><strong className="block text-white text-xs truncate">{primeira ? 'Escolhendo clube' : t.clube}</strong><span className="block text-[#D2B757] text-[9px] truncate">{primeira ? 'Clube inicial' : decisaoEscolhida ? 'Decisão registrada · toque para simular' : 'Decisão da temporada · toque para simular'}</span></span></span>
            <span className="text-right text-[#E0A844] text-xs font-black">{rating}</span><span className="text-right text-[#AEB8B2] text-xs">—</span><span className="text-right text-[#AEB8B2] text-xs">—</span>
          </button>}
          {t.fase === 'resultado' && !encerrada && <button ref={timelineAtualRef} type="button" disabled={semClube} onClick={() => onAvancar ? onAvancar() : onAvancarESimular?.()} className="w-full grid grid-cols-[3.25rem_minmax(0,1fr)_2.8rem_2.5rem_3rem] gap-2 items-center px-2 py-2.5 border-b border-white/5 text-left bg-[#171D19] hover:bg-[#1D251F] disabled:opacity-45">
            <span className="rounded-full bg-[#B3263E] text-white text-[10px] font-black px-1.5 py-1 text-center">{t.ano}</span>
            <span className="flex items-center gap-2 min-w-0"><Escudo nome={t.clube} size={27}/><span className="min-w-0"><strong className="block text-white text-xs truncate">{semClube ? 'Sem clube' : t.clube}</strong><span className="block text-[#D2B757] text-[9px] truncate">{semClube ? 'Aguardando proposta' : encerrada ? 'Carreira encerrada' : 'Iniciar a próxima temporada'}</span></span></span>
            <span className="text-right text-[#E0A844] text-xs font-black">{rating}</span><span className="text-right text-[#AEB8B2] text-xs">—</span><span className="text-right text-[#AEB8B2] text-xs">—</span>
          </button>}
          {temporadas.length > 0 && <div className="flex items-center justify-between gap-2 px-2 pt-3 text-[9px] text-[#707B74]"><span>{historico.vitorias} V · {historico.empates} E · {historico.derrotas} D</span><span>Ano após ano · até {LIMITE_TEMPORADAS_TECNICO} temporadas</span></div>}
        </div>
      </section>
    </div>
  </main>;

}