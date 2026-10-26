import React from 'react';
import { TacaCompeticao } from './trofeus.jsx';
import { cartaAtualTecnico, historicoProfissionalTecnico, objetivoTecnico, LIMITE_TEMPORADAS_TECNICO, carreiraTecnicoEncerrada, titulosConquistadosTecnico } from './tecnico.js';

export default function CarreiraTecnico({ c, onDecisao, onAvancar, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
  const t = c.tecnico;
  const ultima = (t.temporadas || []).at(-1);
  const primeira = t.temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0;
  const semClube = t.demitido || t.desempregado;
  const carta = cartaAtualTecnico(t);
  const historico = historicoProfissionalTecnico(t);
  const encerrada = carreiraTecnicoEncerrada(t);
  const titulos = titulosConquistadosTecnico(t);
  return <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
    <header className="rp-painel p-5 text-center">
      <p className="text-[#EBC557] text-xs uppercase tracking-widest font-bold">A JOIA · Carreira de treinador</p>
      <h1 className="display text-2xl text-white mt-2">{semClube ? 'Aguardando um novo desafio' : t.clube}</h1>
      <p className="text-[#C9D3CE] text-sm mt-2">{c.nome} · {t.ano} · {t.pais || 'Brasil'}</p>
      {!semClube && <p className="text-[#8FA39A] text-xs mt-2">Objetivo: {objetivoTecnico(t).nome}</p>}
    </header>
    {primeira && <section className="rp-painel p-4">
      <h2 className="text-white font-bold text-lg">Seu primeiro clube</h2>
      <p className="text-[#C9D3CE] text-sm mt-1 mb-3">Sua carreira como jogador abriu estas portas. Escolha onde começar.</p>
      <div className="flex flex-col gap-2">{t.opcoesInicio.map(op => <button key={op.clube} onClick={() => onEscolherClubeInicial(op.clube)} className="rp-opcao p-3 text-left">
        <strong className="text-white block">{op.clube}{op.idolatria ? ' ★ Ídolo' : ''}</strong>
        <span className="text-[#8FA39A] text-xs">Afinidade {op.afinidade}/100</span>
      </button>)}</div>
    </section>}
    {t.fase === 'pretemporada' && !encerrada && !primeira && !semClube && <section className="rp-painel p-5">
      <p className="text-[#EBC557] uppercase text-xs font-bold">Uma decisão · Uma temporada</p>
      <h2 className="text-white text-xl font-bold mt-2">{carta?.titulo || 'Pronto para a próxima temporada?'}</h2>
      <p className="text-[#C9D3CE] text-sm mt-2">{carta?.texto || 'A temporada será simulada de uma vez.'}</p>
      <div className="flex flex-col gap-2 mt-4">{(carta?.opcoes || [{ id: null, nome: 'Simular temporada' }]).map(op => <button key={op.id || 'simular'} onClick={() => onDecisao(op.id)} className="rp-opcao p-4 text-left">
        <strong className="text-white block">{op.nome}</strong>
        {op.detalhe && <span className="text-[#8FA39A] text-sm">{op.detalhe}</span>}
      </button>)}</div>
      <p className="text-[#8FA39A] text-xs mt-3">Sua escolha influencia os resultados. A temporada inteira é simulada automaticamente.</p>
    </section>}
    {t.fase === 'resultado' && <section className="rp-painel p-5">
      {encerrada && <div className="rp-painel p-4 text-center mb-4"><p className="text-[#EBC557] font-bold">🏆 Fim de carreira</p><h2 className="text-white text-xl font-bold mt-2">30 temporadas no comando!</h2><p className="text-[#C9D3CE] text-sm mt-2">Sua trajetória como treinador está completa. Confira a vitrine de conquistas abaixo.</p></div>}
      {ultima && <>
        <p className="text-[#EBC557] uppercase text-xs font-bold">Resumo da temporada · {ultima.ano}</p>
        <h2 className="text-white text-3xl font-bold mt-2">{ultima.campeao ? '🏆 Campeão!' : ultima.posicao + 'º lugar'}</h2>
        <p className="text-[#C9D3CE] mt-2">{ultima.clube} · {ultima.pontos} pontos</p>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">{[['Vitórias',ultima.vitorias],['Empates',ultima.empates],['Derrotas',ultima.derrotas]].map(([nome,valor]) => <div key={nome} className="rp-painel p-3"><strong className="block text-white text-xl">{valor}</strong><span className="text-[#8FA39A] text-xs">{nome}</span></div>)}</div>
        {ultima.campeao && <div className="rp-painel p-4 mt-4 flex items-center gap-3"><TacaCompeticao tipo="liga" nome={ultima.competicao || ultima.liga || 'Campeonato nacional'} size={58}/><div><p className="text-[#EBC557] font-bold">🏆 Título conquistado!</p><p className="text-white text-sm">{ultima.competicao || ultima.liga || 'Campeonato nacional'} · {ultima.clube}</p></div></div>}
        <p className="text-[#C9D3CE] text-sm mt-3">Meta {ultima.cumpriuObjetivo ? 'cumprida' : 'não cumprida'} · {ultima.objetivo}</p>
        {ultima.demitido && <p className="text-[#F0A99E] text-sm mt-2">Você foi demitido. Escolha seu próximo destino.</p>}
      </>}
      {t.ultimaNegociacao && !t.ultimaNegociacao.aceita && <p className="text-[#F0A99E] text-sm mt-3">{t.ultimaNegociacao.motivo}</p>}
      {!encerrada && (t.propostas || []).length > 0 && <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-white font-bold">Propostas de clubes</h3>
        {t.propostas.map(p => <button key={p.nome} onClick={() => onAceitarProposta(p.nome,'prudente')} className="rp-opcao p-3 text-left"><strong className="text-white block">{p.nome}</strong><span className="text-[#8FA39A] text-xs">{p.pais} · R$ {p.salario} mil/mês · {p.objetivo}</span></button>)}
      </div>}
      {!encerrada && !semClube && <button onClick={onAvancar} className="rp-btn rp-ouro w-full mt-4">Continuar no {t.clube}</button>}
      {!encerrada && semClube && <button onClick={onEsperar} className="rp-btn rp-sec w-full mt-4">Aguardar propostas</button>}
    </section>}
    <section className="rp-painel p-4">
      <h2 className="text-white font-bold">Sua trajetória como treinador</h2>
      <p className="text-[#8FA39A] text-sm mt-2">{t.temporadas.length}/{LIMITE_TEMPORADAS_TECNICO} temporadas · {historico.jogos} jogos · {historico.titulos} títulos</p>
      {(encerrada || titulos.length > 0) && <div className="rp-painel p-4 mt-4"><h3 className="text-[#EBC557] font-bold">🏆 Vitrine de títulos</h3><p className="text-[#C9D3CE] text-sm mt-1">{titulos.length} conquistas como treinador</p><div className="grid grid-cols-3 gap-3 mt-4">{titulos.length ? titulos.map((titulo,i) => <div key={i} className="text-center flex flex-col items-center gap-1"><TacaCompeticao tipo={titulo.tipo} nome={titulo.nome} size={52}/><span className="text-white text-xs font-bold">{titulo.nome}</span><span className="text-[#8FA39A] text-xs">{titulo.ano} · {titulo.clube}</span></div>) : <p className="text-[#8FA39A] text-sm col-span-3">Nenhum título conquistado.</p>}</div></div>}
      <div className="mt-3 flex flex-col gap-2">{[...t.temporadas].reverse().slice(0,8).map((a,i) => <p key={a.ano+'-'+i} className="text-[#C9D3CE] text-sm border-b border-white/10 pb-2">{a.ano} · {a.clube} · {a.posicao}º lugar{a.campeao ? ' 🏆' : ''}</p>)}</div>
    </section>
    <button onClick={onLegado} className="rp-btn rp-sec">Rever carreira como jogador</button>
    <button onClick={onSair} className="text-[#8FA39A] text-sm py-2">Voltar ao menu · progresso salvo</button>
  </div>;
}
