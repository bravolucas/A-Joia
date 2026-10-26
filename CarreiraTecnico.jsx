import React, { useState } from 'react';
import { ESTILOS_TECNICO, OPCOES_REUNIAO_TECNICO, calcularOvrTecnico, painelEstabilidadeTecnico, historicoProfissionalTecnico, cartaAtualTecnico } from './tecnico.js';
import { RITMOS_TECNICO, ritmoTecnico } from './tecnicoRapido.js';

export default function CarreiraTecnico({ c, onEscolha, onSair, onLegado }) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const t = c.tecnico, historico = historicoProfissionalTecnico(t), estabilidade = painelEstabilidadeTecnico(t);
  const inicial = !t.temporadas.length && !t.clubeInicialEscolhido && t.opcoesInicio?.length > 0;
  const semClube = t.demitido || t.desempregado;
  const carta = t.fase === 'pretemporada' && !t.andamento ? cartaAtualTecnico(t) : null;
  async function escolher(acao) {
    if (ocupado) return;
    setOcupado(true); setErro('');
    try { await onEscolha(acao); } catch (e) { setErro(e.message || 'Não foi possível avançar. Seu progresso foi mantido.'); }
    finally { setOcupado(false); }
  }
  const botao = (titulo, detalhe, acao) => <button key={`${acao.tipo}-${acao.id || acao.nome || titulo}`} disabled={ocupado} onClick={() => escolher(acao)} className="rp-opcao p-4 text-left disabled:opacity-50"><strong className="block text-white">{titulo}</strong>{detalhe && <span className="block text-sm text-[#8FA39A] mt-1">{detalhe}</span>}</button>;
  return <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4" aria-busy={ocupado}>
    <header className="rp-painel p-5">
      <p className="text-xs text-[#EBC557] uppercase tracking-widest">A JOIA · Carreira de treinador</p>
      <h1 className="display text-xl text-white mt-2">{c.nome} · {c.idade} anos</h1>
      <p className="text-[#7FE3BC] mt-1">{semClube ? 'À procura de um clube' : t.clube} · {t.ano}</p>
      <div className="grid grid-cols-4 gap-2 mt-4 text-center">{[['OVR', calcularOvrTecnico(t)], ['Jogos', historico.jogos], ['Aprov.', `${historico.aproveitamento}%`], ['Títulos', historico.titulos]].map(([label, valor]) => <div key={label}><strong className="block text-xl text-white">{valor}</strong><span className="text-xs text-[#8FA39A]">{label}</span></div>)}</div>
    </header>
    <fieldset className="flex flex-wrap gap-2" disabled={ocupado}><legend className="text-xs text-[#8FA39A] mb-2">Decisões a cada {ritmoTecnico(t).anos} temporada(s) · crises interrompem o avanço</legend>{RITMOS_TECNICO.map(r => <button key={r.id} aria-pressed={ritmoTecnico(t).id === r.id} className={`rp-opcao px-3 py-2 ${ritmoTecnico(t).id === r.id ? 'sel' : ''}`} onClick={() => escolher({ tipo: 'ritmo', id: r.id })}>{r.nome}</button>)}</fieldset>
    {erro && <p role="alert" className="text-[#F0A99E]">{erro}</p>}
    <section className="rp-painel p-4 flex flex-col gap-3" aria-label="Próxima decisão">
      <h2 className="font-bold text-lg text-[#EBC557]">{inicial ? 'Sua história abre portas' : t.reuniaoPendente ? 'A diretoria pede uma resposta' : semClube ? 'Seu próximo desafio' : t.fase === 'resultado' ? 'Qual será o próximo capítulo?' : 'Seu projeto no banco'}</h2>
      <p className="text-sm text-[#8FA39A]">Escolha e acompanhe a trajetória. A comissão cuida das demais decisões; os resultados aparecem abaixo.</p>
      {t.ultimaNegociacao?.aceita === false && <p role="status" className="text-[#F0A99E]">{t.ultimaNegociacao.clube}: {t.ultimaNegociacao.motivo}</p>}
      {inicial ? t.opcoesInicio.map(v => botao(v.clube, `${v.idolatria ? '★ Ídolo · ' : ''}${v.temporadas} temporadas como jogador · ${v.titulos} títulos`, { tipo: 'clube', nome: v.clube }))
        : t.reuniaoPendente ? OPCOES_REUNIAO_TECNICO.map(o => botao(o.nome, o.descricao, { tipo: 'reuniao', id: o.id }))
        : <>
          {(t.fase === 'resultado' || semClube) && (t.propostas || []).map(p => botao(`Assinar com ${p.nome}`, `${p.pais} · ${p.objetivo} · R$ ${p.salario} mil/mês`, { tipo: 'proposta', nome: p.nome }))}
          {semClube ? botao('Aguardar oportunidades', 'Avançar um ano no mercado de treinadores.', { tipo: 'esperar' })
            : t.fase === 'resultado' ? botao(`Permanecer no ${t.clube}`, `Simular até ${ritmoTecnico(t).anos} temporada(s).`, { tipo: 'continuar' })
            : t.andamento ? botao('Retomar campanha', `Progresso preservado: ${t.andamento.jogos} jogos disputados.`, { tipo: 'continuar' })
            : carta && t.temporadas.length > 0 ? <><h3 className="text-white font-bold">{carta.titulo}</h3><p className="text-sm text-[#C9D3CE]">{carta.texto}</p>{carta.opcoes.map(o => botao(o.nome, o.detalhe, { tipo: 'decisao', id: o.id }))}</>
            : ESTILOS_TECNICO.map(e => botao(e.nome, `${e.descricao} Escolher e iniciar campanha.`, { tipo: 'estilo', id: e.id }))}
        </>}
      {ocupado && <p role="status">Simulando sua trajetória…</p>}
    </section>
    <section className="rp-painel p-4" aria-label="Trajetória como treinador">
      <h2 className="text-white font-bold mb-3">Sua trajetória no banco</h2>
      {!t.temporadas.length && <p className="text-sm text-[#8FA39A]">O próximo capítulo começa aqui. Seu legado como jogador está preservado.</p>}
      <ol className="flex flex-col gap-3">{t.temporadas.map((a, i) => <li key={`${a.ano}-${i}`} className="border-l-2 border-[#EBC557]/40 pl-3"><p className="text-white font-bold">{a.ano} · {a.clube} {a.campeao ? '🏆' : ''}</p><p className="text-sm text-[#C9D3CE]">{a.posicao}º · {a.pontos} pontos · {a.vitorias}V {a.empates}E {a.derrotas}D</p><p className="text-xs text-[#8FA39A]">{a.interrompida ? `Demitido após ${a.jogos} jogos` : a.demitido ? 'Demitido ao fim da temporada' : a.cumpriuObjetivo ? 'Meta cumprida' : 'Meta não cumprida'}</p></li>)}</ol>
    </section>
    <details className="rp-painel p-4"><summary className="cursor-pointer text-[#EBC557]">Detalhes da campanha</summary>
      <p className="text-sm text-[#C9D3CE] mt-3">{estabilidade.expectativa} · {estabilidade.objetivo}</p>
      <p className="text-sm text-[#8FA39A]">Torcida {estabilidade.torcida}/100 · Diretoria {estabilidade.diretoria}/100 · {estabilidade.situacao}</p>
      {estabilidade.promessa && <p className="text-sm text-[#EBC557]">{estabilidade.promessa.descricao}</p>}
      <div className="overflow-x-auto mt-3"><table className="w-full text-xs text-[#C9D3CE]"><caption>Classificação da campanha mais recente</caption><thead><tr><th>Pos.</th><th>Clube</th><th>Pts</th><th>J</th><th>SG</th></tr></thead><tbody>{(t.andamento?.classificacao || t.temporadas.at(-1)?.classificacao || []).map(x => <tr key={x.nome} className={x.meuClube ? 'text-[#EBC557]' : ''}><td>{x.posicao}</td><td>{x.nome}</td><td>{x.pontos}</td><td>{x.jogos}</td><td>{x.saldoGols}</td></tr>)}</tbody></table></div>
      <p className="text-xs text-[#8FA39A] mt-3">Decisões da campanha atual ou mais recente</p>{(t.decisoes || []).map((d, i) => <p key={i} className="text-xs text-[#C9D3CE]">{d.automatica ? 'Comissão' : 'Você'}: {d.nome} · {d.resultado}</p>)}
    </details>
    <button onClick={onLegado} className="rp-btn rp-sec">Rever legado como jogador</button>
    <button onClick={onSair} className="text-sm text-[#8FA39A] py-2">Voltar ao menu</button>
  </div>;
}
