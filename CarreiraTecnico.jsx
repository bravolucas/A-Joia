import React from 'react';
import { ESTILOS_TECNICO, cartaAtualTecnico, objetivoTecnico, salarioTecnico, calcularOvrTecnico, riscoDemissaoTecnico, QUANTIDADE_DECISOES_TECNICO } from './tecnico.js';

export default function CarreiraTecnico({ c, onEstilo, onDecisao, onJogar, onAvancar, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
  const t = c.tecnico;
  const ultima = t.temporadas[t.temporadas.length - 1];
  const decisao = cartaAtualTecnico(t);
  const risco = riscoDemissaoTecnico(t);
  const indicador = (titulo, valor) => <div className="flex flex-col gap-1">
    <div className="flex justify-between text-sm"><span className="text-[#C9D3CE]">{titulo}</span><strong className="text-white">{valor}/100</strong></div>
    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-label={titulo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={valor}>
      <div className="h-full rounded-full transition-all" style={{ width: `${valor}%`, background: valor < 35 ? '#E36B5B' : valor < 60 ? '#EBC557' : '#7FE3BC' }} />
    </div>
  </div>;
  return <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4 rp-entra">
    <div className="rp-painel p-5 text-center">
      <p className="text-[#EBC557] text-xs font-bold tracking-[.2em] uppercase">A JOIA · Segunda carreira</p>
      <h1 className="display text-xl mt-3 text-white">À beira do campo</h1>
      <p className="text-[#C9D3CE] mt-2">{c.nome} · {c.idade} anos</p>
      <p className="text-[#7FE3BC] mt-1 font-bold">{t.clube || "Sem clube"} · Temporada {t.ano}</p>
      <p className="text-[#C9D3CE] text-sm mt-3">Objetivo da diretoria: <strong className="text-white">{objetivoTecnico(t).nome}</strong></p>
      <div className="rp-painel p-3 mt-3 text-left flex flex-col gap-3">
        <div className="flex justify-between items-center"><span className="font-bold text-[#EBC557]">OVR Técnico</span><strong className="font-stat text-2xl text-white">{calcularOvrTecnico(t)}</strong></div>
        {indicador('Aprovação da torcida', t.torcida ?? 55)}
        {indicador('Confiança da diretoria', t.diretoria ?? 60)}
        <p className="text-xs text-[#8FA39A]">Situação no cargo: <strong className="text-white">{risco.situacao}</strong> · Pressão {risco.pressao}/100</p>
      </div>
      <p className="text-[#8FA39A] text-xs mt-1">{t.pais || "Mercado internacional"} · {t.clube ? `R$ ${salarioTecnico(t)} mil/mês` : "Sem contrato"}</p>
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div><strong className="block text-xl text-[#EBC557]">{t.reputacao}</strong><span className="text-xs text-[#8FA39A]">Reputação</span></div>
        <div><strong className="block text-xl text-white">{t.temporadas.length}</strong><span className="text-xs text-[#8FA39A]">Temporadas</span></div>
        <div><strong className="block text-xl text-white">{t.titulos}</strong><span className="text-xs text-[#8FA39A]">Títulos</span></div>
      </div>
    </div>
    {t.temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0 && <section className="rp-painel p-4 flex flex-col gap-2"><h2 className="font-bold text-[#EBC557]">Comece onde você fez história</h2><p className="text-sm text-[#C9D3CE]">Sua trajetória como jogador abriu portas. Escolha um clube com vínculo afetivo para iniciar como técnico.</p>{t.opcoesInicio.map(v => <button key={v.clube} onClick={() => onEscolherClubeInicial(v.clube)} className="rp-opcao p-3 text-left"><strong className="block text-white">{v.clube} {v.idolatria ? '★ Ídolo' : ''}</strong><span className="text-sm text-[#8FA39A]">{v.temporadas} temporadas · {v.titulos} títulos · Afinidade {v.afinidade}/100</span></button>)}</section>}
    {t.desempregado ? <section className="rp-painel p-4 flex flex-col gap-3">
      <h2 className="font-bold text-white">Mercado de treinadores</h2>
      <p className="text-sm text-[#C9D3CE]">{t.anosDesempregado || 0} ano(s) sem clube. Oportunidades dependem do OVR e da trajetória.</p>
      {(t.propostas || []).map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome)} className="rp-opcao p-3 text-left"><strong className="block text-white">{p.nome} · {p.pais}</strong><span className="text-sm text-[#8FA39A]">OVR mínimo {p.exigencia} · R$ {p.salario} mil/mês</span></button>)}
      <button onClick={onEsperar} className="rp-btn rp-sec">Aguardar mais uma temporada</button>
    </section> : t.fase === 'pretemporada' ? <>
      <section className="rp-painel p-4">
        <h2 className="text-lg font-bold text-white mb-3">Escolha seu estilo de jogo</h2>
        <div className="flex flex-col gap-2">{ESTILOS_TECNICO.map(e =>
          <button key={e.id} onClick={() => onEstilo(e.id)} aria-pressed={t.estilo === e.id} className={`rp-opcao p-3 text-left ${t.estilo === e.id ? 'sel' : ''}`}>
            <strong className="block text-white">{e.nome}</strong><span className="text-sm text-[#C9D3CE]">{e.descricao}</span>
          </button>)}</div>
      </section>
      <section className="rp-painel p-4">
        <h2 className="text-lg font-bold text-white">Decisões da temporada · {t.decisoes.length}/{QUANTIDADE_DECISOES_TECNICO}</h2>
        <p className="text-sm text-[#8FA39A] mt-1">Elenco {t.elenco} · Moral {t.moral} · Diretoria {t.diretoria}</p>
        {t.decisoes.length > 0 && <p className="text-sm text-[#EBC557] mt-2">{t.decisoes[t.decisoes.length - 1].resultado}</p>}
        {decisao ? <div className="mt-3 flex flex-col gap-2">
          <h3 className="font-bold text-[#EBC557]">{decisao.titulo}</h3>
          <p className="text-sm text-[#C9D3CE]">{decisao.texto}</p>
          {decisao.opcoes.map(op => <button key={op.id} onClick={() => onDecisao(op.id)} className="rp-opcao p-3 text-left">
            <strong className="block text-white">{op.nome}</strong>
            <span className="text-sm text-[#8FA39A]">{op.detalhe}</span>
          </button>)}
        </div> : <p className="text-[#7FE3BC] mt-3">Decisões concluídas. Sua equipe está pronta.</p>}
      </section>
      <button disabled={!!decisao} onClick={onJogar} className="rp-btn rp-ouro p-3">Simular temporada {t.ano}</button>
    </> : <section className="rp-painel p-5">
      <p className="text-[#EBC557] uppercase tracking-wider text-xs">Fim de temporada · {ultima.ano}</p>
      <h2 className="text-2xl font-bold mt-2 text-white">{ultima.campeao ? '🏆 Campeão!' : `${ultima.posicao}º lugar`}</h2>
      <p className="text-[#C9D3CE] mt-2">{ultima.pontos} pontos · {ultima.vitorias} vitórias · {ultima.empates} empates · {ultima.derrotas} derrotas</p>
      <p className="text-sm text-[#C9D3CE] mt-2">Meta: {ultima.objetivo} — <strong>{ultima.cumpriuObjetivo ? 'cumprida' : 'não cumprida'}</strong></p>
      {t.demitido && <p className="text-[#F0A99E] font-bold mt-3">Você foi demitido. Aceite uma proposta ou aguarde oportunidades.</p>}
      {(t.propostas || []).length > 0 && <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-white font-bold">Propostas de trabalho</h3>
        {t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome)} className="rp-opcao p-3 text-left">
          <strong className="block text-white">{p.nome} · {p.pais}</strong>
          <span className="text-[#8FA39A] text-sm">OVR mínimo {p.exigencia} · R$ {p.salario} mil/mês · {p.objetivo}{p.rival ? ' · Rival do antigo clube' : ''}</span>
        </button>)}
      </div>}
      {t.demitido && <button onClick={onEsperar} className="rp-btn rp-sec w-full mt-3">Ficar desempregado e aguardar propostas</button>}
      {!t.demitido && <button onClick={onAvancar} className="rp-btn rp-prim w-full mt-4">Permanecer e iniciar próxima temporada</button>}
    </section>}
    <section className="rp-painel p-4">
      <h2 className="font-bold text-white mb-2">Histórico como técnico</h2>
      {t.temporadas.length === 0 ? <p className="text-sm text-[#8FA39A]">Sua história no banco começa agora.</p> :
        <div className="flex flex-col gap-2">{[...t.temporadas].reverse().slice(0, 8).map(a =>
          <div key={a.ano} className="flex justify-between gap-3 text-sm border-b border-white/10 pb-2"><span>{a.ano} · {a.clube}</span><span>{a.posicao}º · {a.pontos} pts</span></div>)}</div>}
    </section>
    <button onClick={onLegado} className="rp-btn rp-sec">Rever legado como jogador</button>
    <button onClick={onSair} className="text-sm text-[#8FA39A] py-3">Voltar ao menu (progresso salvo)</button>
  </div>;
}
