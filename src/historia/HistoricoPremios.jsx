import React,{useMemo,useState} from 'react';
import {vencedoresPremiosComHistorico,chavePremio} from './historicoPremios.js';
import {CATALOGO_PREMIOS,FONTES_HISTORICO_PREMIOS} from './premiosHistoricosReais.js';
import LinkEntidade from './LinkEntidade.jsx';

export default function HistoricoPremios({c,premioInicial='',onPremio}){
 const vencedores=useMemo(()=>vencedoresPremiosComHistorico(c),[c]);
 const opcoes=useMemo(()=>[...new Set([...CATALOGO_PREMIOS,...vencedores.map(x=>x.nome)])]
  .filter(x=>chavePremio(x)!=='artilheiro')
  .sort((a,b)=>a.localeCompare(b,'pt-BR')),[vencedores]);
 const [escolha,E]=useState(premioInicial||'Bola de Ouro');
 const premio=opcoes.find(x=>chavePremio(x)===chavePremio(escolha))
  ||opcoes.find(x=>chavePremio(x)===chavePremio(premioInicial))||'Bola de Ouro';
 const registros=vencedores.filter(x=>chavePremio(x.nome)===chavePremio(premio));
 const fontes=FONTES_HISTORICO_PREMIOS[premio];
 const reais=registros.filter(x=>x.origem==='real').length;
 return <section className="hf-premios" aria-label="Histórico de premiações">
   <span className="hf-eyebrow">A JOIA / ARQUIVO DE DISTINÇÕES</span>
   <h2>Histórico de prêmios</h2>
   <p className="hf-nota">Palmarés real de cada premiação e vencedores registrados nesta carreira. Quando o save simula a mesma edição, prevalece o vencedor da carreira.</p>
   <div className="hf-filtros"><label>Prêmio<select value={premio} onChange={e=>{E(e.target.value);onPremio?.(e.target.value);}} aria-label="Prêmio histórico">
     {opcoes.map(x=><option key={x}>{x}</option>)}
   </select></label></div>
   <header className="hf-identidade"><div><span className="hf-eyebrow">PALMARÉS INDIVIDUAL</span><h2>{premio}</h2><p>{registros.length} vencedores ({reais} históricos reais; {registros.length-reais} da carreira)</p></div></header>
   {fontes&&<p className="hf-nota">Referência histórica: <a href={fontes.url} target="_blank" rel="noopener noreferrer">{fontes.rotulo}</a>. Os registros reais são informativos, não conquistas atribuídas automaticamente aos atletas do save.</p>}
   {registros.length?<div className="fm27-data-scroll"><table className="fm27-data"><thead><tr><th>Ano</th><th>Jogador</th><th>Clube</th><th>Origem</th></tr></thead>
     <tbody>{registros.map((x,i)=><tr key={[x.ano,x.jogadorId,x.jogadorNome,i].join('|')}><td>{x.ano??'—'}</td>
       <td>{x.jogadorId?<LinkEntidade tipo="jogador" id={x.jogadorId} nome={x.jogadorNome}/>:x.jogadorNome}</td>
       <td><LinkEntidade tipo="clube" nome={x.clube||''}>{x.clube||'Sem clube registrado'}</LinkEntidade></td>
       <td>{x.origem==='real'?'Histórico real':'Carreira simulada'}</td></tr>)}</tbody>
   </table></div>:<p className="hf-vazio">Não há vencedores documentados para este prêmio.</p>}
 </section>;
}
