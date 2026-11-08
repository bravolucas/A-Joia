import React from 'react';
const valor=x=>x??'—';
function Linha({d}){return <tr><th scope="row"><span style={{color:d.cor}}>{d.icone} {d.nome}</span></th><td>{valor(d.jogos)}</td><td>{valor(d.gols)}</td><td>{valor(d.assist)}</td><td>{valor(d.cleanSheets)}</td><td>{valor(d.nota)}</td></tr>;}
export default function TabelaCompeticoesTemporada({temporada}){
 const clubes=temporada.porCompeticao||[],selecao=temporada.selecaoTemporada;
 return <section className="resumo-competicoes" aria-label="Números por competição"><h3>Números por competição</h3><table><caption>Clube e seleção separados</caption><thead><tr><th scope="col">Competição</th><th scope="col">J</th><th scope="col">G</th><th scope="col">A</th><th scope="col">CS</th><th scope="col">Nota</th></tr></thead><tbody>{clubes.map((d,i)=><Linha key={d.id||i} d={d}/>)}</tbody>{selecao&&<tbody><tr><th colSpan="6" className="resumo-selecao">Seleção · à parte dos números de clube</th></tr><Linha d={selecao}/></tbody>}</table><small>J: jogos · G: gols · A: assistências · CS: jogos sem sofrer gol. —: dado não registrado.</small></section>;
}
