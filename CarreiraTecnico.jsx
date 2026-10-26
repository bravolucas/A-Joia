import React from 'react';
import { ESTILOS_TECNICO, DECISOES_TECNICO } from './tecnico.js';

export default function CarreiraTecnico({ c, onEstilo, onDecisao, onJogar, onAvancar, onSair, onLegado }) {
  const t = c.tecnico;
  const ultima = t.temporadas[t.temporadas.length - 1];
  const decisao = DECISOES_TECNICO[t.decisoes?.length || 0];
  return <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4 rp-entra">
    <div className="rp-painel p-5 text-center">
      <p className="text-[#EBC557] text-xs font-bold tracking-[.2em] uppercase">A JOIA · Segunda carreira</p>
      <h1 className="display text-xl mt-3 text-white">À beira do campo</h1>
      <p className="text-[#C9D3CE] mt-2">{c.nome} · {c.idade} anos</p>
      <p className="text-[#7FE3BC] mt-1 font-bold">{t.clube} · Temporada {t.ano}</p>
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div><strong className="block text-xl text-[#EBC557]">{t.reputacao}</strong><span className="text-xs text-[#8FA39A]">Reputação</span></div>
        <div><strong className="block text-xl text-white">{t.temporadas.length}</strong><span className="text-xs text-[#8FA39A]">Temporadas</span></div>
        <div><strong className="block text-xl text-white">{t.titulos}</strong><span className="text-xs text-[#8FA39A]">Títulos</span></div>
      </div>
    </div>
    {t.fase === 'pretemporada' ? <>
      <section className="rp-painel p-4">
        <h2 className="text-lg font-bold text-white mb-3">Escolha seu estilo de jogo</h2>
        <div className="flex flex-col gap-2">{ESTILOS_TECNICO.map(e =>
          <button key={e.id} onClick={() => onEstilo(e.id)} aria-pressed={t.estilo === e.id} className={`rp-opcao p-3 text-left ${t.estilo === e.id ? 'sel' : ''}`}>
            <strong className="block text-white">{e.nome}</strong><span className="text-sm text-[#C9D3CE]">{e.descricao}</span>
          </button>)}</div>
      </section>
      <section className="rp-painel p-4">
        <h2 className="text-lg font-bold text-white">Decisões da temporada</h2>
        <p className="text-sm text-[#8FA39A] mt-1">Elenco {t.elenco} · Moral {t.moral} · Diretoria {t.diretoria}</p>
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
      <button onClick={onAvancar} className="rp-btn rp-prim w-full mt-4">Próxima temporada</button>
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
