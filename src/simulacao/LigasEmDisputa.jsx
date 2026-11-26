import SumulaLiga from './SumulaLiga.jsx';
import {Fragment,useState} from 'react';
import {LIGAS} from '../dados/data.js';
import {jogosDaEdicao} from './mundoVivo.js';

export default function LigasEmDisputa({estado}) {
  const [ligaEscolhida, escolherLiga] = useState('');
  const [rodadaEscolhida, escolherRodada] = useState(null);
  const [clube, escolherClube] = useState('');
  const ligas = Object.keys(estado?.ligas || {});
  if (!ligas.length) return null;
  const liga = ligas.includes(ligaEscolhida) ? ligaEscolhida : ligas[0];
  const edicao = estado.ligas[liga];
  const jogos = jogosDaEdicao(edicao);
  const rodadas = [...new Set(jogos.map(jogo => jogo.rodada))];
  const rodada = rodadas.includes(rodadaEscolhida) ? rodadaEscolhida : rodadas.at(-1);
  const resultados = jogos.filter(jogo => clube
    ? jogo.casa === clube || jogo.fora === clube
    : jogo.rodada === rodada);
  const atletas = new Map(edicao.classificacao.flatMap(({nome}) => (estado.elencos?.[nome] || [])
    .map(p => [String(p.id), p.nome])));
  return (
    <Fragment>
    {estado.noticias?.length > 0 && <section className="glass my-2 rounded-md border border-white/10 p-3 text-xs" aria-label="Resumo do avanço">
      <h3 className="font-bold">Resumo do avanço</h3>
      <ul>{estado.noticias.map(({liga: id, texto}) => <li key={texto}><strong>{LIGAS[id]?.nome || id}</strong> · {texto}</li>)}</ul>
    </section>}
    <details className="glass rounded-md border border-white/10 p-3 text-xs">
      <summary className="cursor-pointer font-bold">Outras ligas em andamento</summary>
      <label className="mt-3 flex items-center gap-2">
        Campeonato
        <select className="rounded bg-zinc-900 p-1" value={liga} onChange={e => { escolherLiga(e.target.value); escolherRodada(null); escolherClube(''); }}>
          {ligas.map(id => <option key={id} value={id}>{LIGAS[id]?.nome || id}</option>)}
        </select>
      </label>
      {edicao.decisoes?.some(e=>e.historia) && <details className="mt-3">
        <summary className="cursor-pointer font-bold">Histórias da temporada</summary>
        <ul>{edicao.decisoes.filter(e=>e.historia&&(!clube||e.clube===clube)).map(e=>
          <li key={`${e.historia}|${e.etapa}`}>Rodada {e.rodada} · {e.texto}</li>)}</ul>
      </details>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <table className="w-full text-left">
          <caption className="text-left font-bold">Classificação</caption>
          <thead><tr><th>Clube</th><th>J</th><th>Pts</th></tr></thead>
          <tbody>{edicao.classificacao.map(time => (
            <tr key={time.nome}><td>{time.posicao}. {time.nome}</td><td>{time.jogos}</td><td>{time.pontos}</td></tr>
          ))}</tbody>
        </table>
        <div>
          {rodada ? <>
            <label className="flex items-center gap-2">
              Clube
              <select className="rounded bg-zinc-900 p-1" value={clube} onChange={e => escolherClube(e.target.value)}>
                <option value="">Todos</option>
                {edicao.classificacao.map(({nome}) => <option key={nome}>{nome}</option>)}
              </select>
            </label>
            {!clube && <label className="flex items-center gap-2">
              Rodada
              <select className="rounded bg-zinc-900 p-1" value={rodada} onChange={e => escolherRodada(rodadas[e.target.selectedIndex])}>
                {rodadas.map(id => <option key={id} value={id}>{id}</option>)}
              </select>
            </label>}
            <ul>{resultados.map(jogo => (
              <li key={`${jogo.rodada}-${jogo.casa}`}>{clube && `Rodada ${jogo.rodada} · `}{jogo.casa} {jogo.golsCasa} × {jogo.golsFora} {jogo.fora}<SumulaLiga jogo={jogo} atletas={atletas}/></li>
            ))}</ul>
          </> : <p>Aguardando a primeira rodada.</p>}
        </div>
      </div>
    </details>
    </Fragment>
  );
}
