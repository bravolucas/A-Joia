import {useState} from 'react';
import {LIGAS} from '../dados/data.js';
import {jogosDaEdicao} from './mundoVivo.js';

export default function LigasEmDisputa({estado}) {
  const [ligaEscolhida, escolherLiga] = useState('');
  const ligas = Object.keys(estado?.ligas || {});
  if (!ligas.length) return null;
  const liga = ligas.includes(ligaEscolhida) ? ligaEscolhida : ligas[0];
  const edicao = estado.ligas[liga];
  const jogos = jogosDaEdicao(edicao);
  const rodada = jogos.at(-1)?.rodada;
  const resultados = jogos.filter(jogo => jogo.rodada === rodada);
  return (
    <details className="glass rounded-md border border-white/10 p-3 text-xs">
      <summary className="cursor-pointer font-bold">Outras ligas em andamento</summary>
      <label className="mt-3 flex items-center gap-2">
        Campeonato
        <select className="rounded bg-zinc-900 p-1" value={liga} onChange={e => escolherLiga(e.target.value)}>
          {ligas.map(id => <option key={id} value={id}>{LIGAS[id]?.nome || id}</option>)}
        </select>
      </label>
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
            <h3 className="font-bold">Resultados da rodada {rodada}</h3>
            <ul>{resultados.map(jogo => (
              <li key={jogo.casa}>{jogo.casa} {jogo.golsCasa} × {jogo.golsFora} {jogo.fora}</li>
            ))}</ul>
          </> : <p>Aguardando a primeira rodada.</p>}
        </div>
      </div>
    </details>
  );
}
