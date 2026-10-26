import React from 'react';
import { ESTILOS_TECNICO, ENTREVISTAS_TECNICO, OPCOES_REUNIAO_TECNICO, ETAPAS_TEMPORADA_TECNICO, cartaAtualTecnico, objetivoTecnico, salarioTecnico, calcularOvrTecnico, painelEstabilidadeTecnico, historicoProfissionalTecnico, QUANTIDADE_DECISOES_TECNICO } from './tecnico.js';

export default function CarreiraTecnico({ c, onEstilo, onDecisao, onReuniao, onJogar, onAvancar, onAceitarProposta, onEscolherClubeInicial, onEsperar, onSair, onLegado }) {
  const t = c.tecnico;
  const ultima = (t.temporadas || []).at(-1);
  const decisao = cartaAtualTecnico(t);
  const aguardandoDecisoes = (t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO;
  const aguardandoClubeInicial = t.temporadas.length === 0 && !t.clubeInicialEscolhido && (t.opcoesInicio || []).length > 0;
  const estabilidade = painelEstabilidadeTecnico(t);
  const historico = historicoProfissionalTecnico(t);
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
      <section className="rp-painel p-3 mt-3 text-left" aria-label="Metas e estabilidade no cargo">
        <h2 className="text-[#EBC557] font-bold text-sm">Metas e estabilidade</h2>
        <p className="text-[#8FA39A] text-xs mt-1">{estabilidade.expectativa}</p>
        <p className="text-[#C9D3CE] text-sm mt-2">Objetivo da diretoria: <strong className="text-white">{estabilidade.objetivo}</strong></p>
        <p className="text-[#8FA39A] text-xs mt-1">Meta: terminar até a {estabilidade.posicaoMeta}ª posição</p>
        {estabilidade.promessa && <div className="mt-2 border-l-2 border-[#EBC557] pl-3"><p className="text-[#EBC557] text-sm font-bold">Promessa contratual ativa</p><p className="text-[#C9D3CE] text-sm">{estabilidade.promessa.descricao}</p><p className="text-[#8FA39A] text-xs">Descumprir reduz a confiança da diretoria e a aprovação da torcida.</p></div>}
        {estabilidade.ultimaTemporada && <p className="text-[#8FA39A] text-xs mt-2">Última temporada: {estabilidade.ultimaTemporada.posicao}º lugar · Meta {estabilidade.ultimaTemporada.cumpriuObjetivo ? 'cumprida' : 'não cumprida'}{estabilidade.ultimaTemporada.promessaDescumprida ? ' · Promessa quebrada' : ''}</p>}
      </section>
      <div className="rp-painel p-3 mt-3 text-left flex flex-col gap-3">
        <div className="flex justify-between items-center"><span className="font-bold text-[#EBC557]">OVR Técnico</span><strong className="font-stat text-2xl text-white">{calcularOvrTecnico(t)}</strong></div>
        {indicador('Aprovação da torcida', estabilidade.torcida)}
        {indicador('Confiança da diretoria', estabilidade.diretoria)}
        <p className="text-xs text-[#8FA39A]">Situação no cargo: <strong className="text-white">{estabilidade.situacao}</strong> · Pressão {estabilidade.pressao}/100</p>
      </div>
      <p className="text-[#8FA39A] text-xs mt-1">{t.pais || "Mercado internacional"} · {t.clube ? `R$ ${t.salario ?? salarioTecnico(t)} mil/mês` : "Sem contrato"}</p>
      <div className="grid grid-cols-3 gap-2 mt-5">
        <div><strong className="block text-xl text-[#EBC557]">{t.reputacao}</strong><span className="text-xs text-[#8FA39A]">Reputação</span></div>
        <div><strong className="block text-xl text-white">{t.temporadas.length}</strong><span className="text-xs text-[#8FA39A]">Temporadas</span></div>
        <div><strong className="block text-xl text-white">{t.titulos}</strong><span className="text-xs text-[#8FA39A]">Títulos</span></div>
      </div>
    </div>
    {aguardandoClubeInicial && <section className="rp-painel p-4 flex flex-col gap-2"><h2 className="font-bold text-[#EBC557]">Comece onde você fez história</h2><p className="text-sm text-[#C9D3CE]">Sua trajetória como jogador abriu portas. Escolha um clube com vínculo afetivo para iniciar como técnico.</p>{t.opcoesInicio.map(v => <button key={v.clube} onClick={() => onEscolherClubeInicial(v.clube)} className="rp-opcao p-3 text-left"><strong className="block text-white">{v.clube} {v.idolatria ? '★ Ídolo' : ''}</strong><span className="text-sm text-[#8FA39A]">{v.temporadas} temporadas · {v.titulos} títulos · Afinidade {v.afinidade}/100</span></button>)}</section>}
    {t.ultimaNegociacao && !t.ultimaNegociacao.aceita && <p role="status" className="rp-painel p-3 text-[#F0A99E] text-sm">{t.ultimaNegociacao.clube}: {t.ultimaNegociacao.motivo}</p>}
    {t.desempregado ? <section className="rp-painel p-4 flex flex-col gap-3">
      <h2 className="font-bold text-white">Mercado de treinadores</h2>
      <p className="text-sm text-[#C9D3CE]">{t.anosDesempregado || 0} ano(s) sem clube. Oportunidades dependem do OVR e da trajetória.</p>
      {(t.propostas || []).map(p => <div key={p.nome} className="rp-painel p-3"><strong className="block text-white">{p.nome} · {p.pais}</strong><span className="text-sm text-[#8FA39A]">OVR mínimo {p.exigencia} · R$ {p.salario} mil/mês · Meta: {p.objetivo}</span><div className="flex flex-wrap gap-2 mt-2">{ENTREVISTAS_TECNICO.map(e => <button key={e.id} onClick={() => onAceitarProposta(p.nome, e.id)} className="rp-opcao p-2 text-xs">{e.nome}</button>)}</div></div>)}
      <button onClick={onEsperar} className="rp-btn rp-sec">Aguardar mais uma temporada</button>
    </section> : t.fase === 'pretemporada' ? <>
      {!aguardandoClubeInicial && <section className="rp-painel p-4">
        <h2 className="text-lg font-bold text-white mb-3">Escolha seu estilo de jogo</h2>
        <div className="flex flex-col gap-2">{ESTILOS_TECNICO.map(e =>
          <button key={e.id} onClick={() => onEstilo(e.id)} aria-pressed={t.estilo === e.id} className={`rp-opcao p-3 text-left ${t.estilo === e.id ? 'sel' : ''}`}>
            <strong className="block text-white">{e.nome}</strong><span className="text-sm text-[#C9D3CE]">{e.descricao}</span>
          </button>)}</div>
      </section>}
      {!aguardandoClubeInicial && <section className="rp-painel p-4">
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
      </section>}
      {t.andamento && <section className="rp-painel p-4" aria-label="Acompanhamento da temporada">
        <h2 className="text-white font-bold">Temporada em andamento</h2>
        <p className="text-[#C9D3CE] text-sm mt-1">Rodada {t.andamento.jogos}/38 · {t.andamento.pontos} pontos · {t.andamento.vitorias}V {t.andamento.empates}E {t.andamento.derrotas}D</p>
        <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#7FE3BC]" style={{width: `${t.andamento.jogos / 38 * 100}%`}} /></div>
        {(t.andamento.confrontos || []).length > 0 && <div className="mt-3">
          <h3 className="text-[#EBC557] text-sm font-bold">Últimos confrontos</h3>
          <div className="flex flex-col gap-1 mt-2">{t.andamento.confrontos.slice(-5).reverse().map(j => <p key={j.rodada} className="text-[#C9D3CE] text-xs">Rodada {j.rodada} · {j.nome} ({j.casa ? 'casa' : 'fora'}) · <strong className={j.resultado === 'V' ? 'text-[#7FE3BC]' : j.resultado === 'D' ? 'text-[#F0A99E]' : 'text-white'}>{j.resultado === 'V' ? 'Vitória' : j.resultado === 'E' ? 'Empate' : 'Derrota'}{Number.isFinite(j.golsPro) ? ` · ${j.golsPro}–${j.golsContra}` : ''}</strong></p>)}</div>
        </div>}
        {(t.andamento.classificacao || []).length > 0 && <div className="mt-3">
          <h3 className="text-[#EBC557] text-sm font-bold">Classificação</h3>
          <div className="overflow-x-auto mt-2"><table className="w-full text-xs text-[#C9D3CE]">
            <thead><tr className="text-[#8FA39A]"><th className="text-left py-1">#</th><th className="text-left">Clube</th><th>PTS</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th></tr></thead>
            <tbody>{t.andamento.classificacao.map(x => <tr key={x.nome} className={x.meuClube ? 'text-[#EBC557] font-bold bg-white/5' : x.zona === 'rebaixamento' ? 'border-t border-white/5 text-[#F0A99E]' : x.zona === 'continental' || x.zona === 'campeao' ? 'border-t border-white/5 text-[#7FE3BC]' : 'border-t border-white/5'}>
              <td className="py-1">{x.posicao}</td><td>{x.nome}</td><td className="text-center">{x.pontos}</td><td className="text-center">{x.jogos}</td><td className="text-center">{x.vitorias}</td><td className="text-center">{x.empates}</td><td className="text-center">{x.derrotas}</td><td className="text-center">{x.saldoGols ?? '—'}</td>
            </tr>)}</tbody>
          </table></div>
        </div>}
        <h3 className="text-[#EBC557] text-sm font-bold mt-3">Avaliações da diretoria</h3>
        <div className="flex flex-col gap-2 mt-2">{t.andamento.avaliacoes.map(a => <p key={a.rodada} className="text-[#C9D3CE] text-xs">Rodada {a.rodada}: {a.situacao} · {a.aproveitamento}% de aproveitamento · Pressão {a.pressao}/100</p>)}</div>
      </section>}
      {t.reuniaoPendente && <section className="rp-painel p-4 border border-[#EBC557]/40" aria-label="Reunião de emergência com a diretoria">
        <h2 className="text-[#EBC557] font-bold">Reunião de emergência</h2>
        <p className="text-[#C9D3CE] text-sm mt-2">A diretoria exige explicações pela campanha. Sua resposta pode recuperar a confiança ou agravar a crise.</p>
        <div className="flex flex-col gap-2 mt-3">{OPCOES_REUNIAO_TECNICO.map(op => <button key={op.id} onClick={() => onReuniao(op.id)} className="rp-opcao p-3 text-left"><strong className="text-white block">{op.nome}</strong><span className="text-[#8FA39A] text-sm">{op.descricao}</span></button>)}</div>
      </section>}
      <button disabled={aguardandoClubeInicial || aguardandoDecisoes || !!t.reuniaoPendente} title={aguardandoClubeInicial ? 'Escolha o clube inicial antes de jogar' : t.reuniaoPendente ? 'Responda à reunião da diretoria' : aguardandoDecisoes ? 'Conclua as decisões da pré-temporada' : undefined} onClick={onJogar} className="rp-btn rp-ouro p-3">{t.andamento ? `Avançar até a rodada ${ETAPAS_TEMPORADA_TECNICO.find(n => n > t.andamento.jogos) || 38}` : 'Iniciar campeonato (10 rodadas)'}</button>
    </> : <section className="rp-painel p-5">
      <p className="text-[#EBC557] uppercase tracking-wider text-xs">Fim de temporada · {ultima.ano}</p>
      <h2 className="text-2xl font-bold mt-2 text-white">{ultima.campeao ? '🏆 Campeão!' : `${ultima.posicao}º lugar`}</h2>
      <p className="text-[#C9D3CE] mt-2">{ultima.pontos} pontos · {ultima.vitorias} vitórias · {ultima.empates} empates · {ultima.derrotas} derrotas</p>
      <p className="text-sm text-[#C9D3CE] mt-2">Meta: {ultima.objetivo} — <strong>{ultima.cumpriuObjetivo ? 'cumprida' : 'não cumprida'}</strong></p>
      {ultima.interrompida && <p className="text-[#F0A99E] text-sm mt-2">Demissão antecipada após {ultima.jogos} rodadas.</p>}
      {(ultima.avaliacoes || []).length > 0 && <div className="mt-3 flex flex-col gap-1">{ultima.avaliacoes.map(a => <p key={a.rodada} className="text-[#8FA39A] text-xs">Rodada {a.rodada}: {a.situacao} · Pressão {a.pressao}/100</p>)}</div>}
      {ultima.promessaDescumprida && <p className="text-[#F0A99E] text-sm font-bold mt-2">Promessa contratual não cumprida: confiança e aprovação sofreram penalidades.</p>}
      {t.demitido && <p className="text-[#F0A99E] font-bold mt-3">Você foi demitido. Aceite uma proposta ou aguarde oportunidades.</p>}
      {(t.propostas || []).length > 0 && <div className="mt-4 flex flex-col gap-2">
        <h3 className="text-white font-bold">Propostas de trabalho</h3>
        {t.propostas.map(p => <div key={p.nome} className="rp-painel p-3">
          <strong className="block text-white">{p.nome} · {p.pais}</strong>
          <span className="text-[#8FA39A] text-sm">OVR mínimo {p.exigencia} · R$ {p.salario} mil/mês · {p.objetivo}{p.rival ? ' · Rival do antigo clube' : ''}</span>
          <div className="flex flex-wrap gap-2 mt-2">{ENTREVISTAS_TECNICO.map(e => <button key={e.id} onClick={() => onAceitarProposta(p.nome, e.id)} className="rp-opcao p-2 text-xs">{e.nome}</button>)}</div>
        </div>)}
      </div>}
      {t.demitido && <button onClick={onEsperar} className="rp-btn rp-sec w-full mt-3">Ficar desempregado e aguardar propostas</button>}
      {!t.demitido && <button onClick={onAvancar} className="rp-btn rp-prim w-full mt-4">Permanecer e iniciar próxima temporada</button>}
    </section>}
    <section className="rp-painel p-4" aria-label="Histórico profissional como treinador">
      <h2 className="font-bold text-white mb-2">Carreira como técnico</h2>
      <p className="text-[#8FA39A] text-xs mb-3">Estatísticas exclusivas do banco de reservas; seu legado como jogador permanece separado.</p>
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
        <div><strong className="block text-white text-xl">{historico.jogos}</strong><span className="text-[#8FA39A] text-xs">Jogos</span></div>
        <div><strong className="block text-[#7FE3BC] text-xl">{historico.aproveitamento}%</strong><span className="text-[#8FA39A] text-xs">Aproveitamento</span></div>
        <div><strong className="block text-[#EBC557] text-xl">{historico.titulos}</strong><span className="text-[#8FA39A] text-xs">Títulos</span></div>
        <div><strong className="block text-white text-lg">{historico.vitorias}V</strong><span className="text-[#8FA39A] text-xs">Vitórias</span></div>
        <div><strong className="block text-white text-lg">{historico.empates}E</strong><span className="text-[#8FA39A] text-xs">Empates</span></div>
        <div><strong className="block text-white text-lg">{historico.demissoes}</strong><span className="text-[#8FA39A] text-xs">Demissões</span></div>
      </div>
      {historico.clubes.length > 0 && <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-[#EBC557] text-sm font-bold">Clubes comandados</h3>
        {historico.clubes.map(clube => <div key={clube.nome} className="border-b border-white/10 pb-2">
          <strong className="text-white text-sm">{clube.nome}</strong>
          <p className="text-[#8FA39A] text-xs">{clube.temporadas} temporada(s) · {clube.jogos} jogos · {clube.vitorias} vitórias · {clube.titulos} título(s){clube.demissoes ? ` · ${clube.demissoes} demissão(ões)` : ''}</p>
        </div>)}
      </div>}
      {t.temporadas.length === 0 ? <p className="text-sm text-[#8FA39A]">Sua história no banco começa agora.</p> :
        <div className="flex flex-col gap-2">
          <h3 className="text-[#EBC557] text-sm font-bold">Temporadas</h3>
          {[...t.temporadas].reverse().map((a, i) =>
            <div key={`${a.ano}-${a.clube}-${i}`} className="border-b border-white/10 pb-2 text-sm">
              <div className="flex justify-between gap-2"><span className="text-white">{a.ano} · {a.clube}</span><span className="text-[#C9D3CE]">{a.posicao}º · {a.pontos} pts</span></div>
              <p className="text-[#8FA39A] text-xs mt-1">{a.vitorias}V {a.empates}E {a.derrotas}D{a.campeao ? ' · 🏆 Campeão' : ''}{a.demitido || a.interrompida ? ' · Demitido' : ''}{a.interrompida ? ` após ${a.jogos} rodadas` : ''}</p>
            </div>)}
        </div>}
    </section>
    <button onClick={onLegado} className="rp-btn rp-sec">Rever legado como jogador</button>
    <button onClick={onSair} className="text-sm text-[#8FA39A] py-3">Voltar ao menu (progresso salvo)</button>
  </div>;
}
