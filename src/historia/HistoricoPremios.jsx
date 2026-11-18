import React,{useMemo,useState} from 'react';
import {vencedoresPremios,chavePremio} from './historicoPremios.js';
import LinkEntidade from './LinkEntidade.jsx';
const CLASSICOS=['Bola de Ouro','Bota de Ouro','Troféu Yashin','Melhor jogador','Artilheiro','Revelação'];
export default function HistoricoPremios({c,premioInicial='',onPremio}){
 const vencedores=useMemo(()=>vencedoresPremios(c),[c]);
 const opcoes=useMemo(()=>[...new Set([...CLASSICOS,...vencedores.map(x=>x.nome)])].sort((a,b)=>a.localeCompare(b,'pt-BR')),[vencedores]);
 const [escolha,E]=useState(premioInicial||'Bola de Ouro');
 const premio=opcoes.find(x=>chavePremio(x)===chavePremio(escolha))||opcoes.find(x=>chavePremio(x)===chavePremio(premioInicial))||'Bola de Ouro';
 const registros=vencedores.filter(x=>chavePremio(x.nome)===chavePremio(premio));
 return <section className="hf-premios" aria-label="Histórico de premiações">
   <span className="hf-eyebrow">A JOIA / ARQUIVO DE DISTINÇÕES</span>
   <h2>Histórico de prêmios</h2>
   <p className="hf-nota">Lista dos vencedores identificados nos dados salvos desta carreira. Edições sem vencedor documentado não são inventadas.</p>
   <div className="hf-filtros"><label>Prêmio<select value={premio} onChange={e=>{E(e.target.value);onPremio?.(e.target.value);}} aria-label="Prêmio histórico">
     {opcoes.map(x=><option key={x}>{x}</option>)}
   </select></label></div>
   <header className="hf-identidade"><div><span className="hf-eyebrow">PALMARÉS INDIVIDUAL</span><h2>{premio}</h2><p>{registros.length} premiações identificadas no save</p></div></header>
   {registros.length?<div className="fm27-data-scroll"><table className="fm27-data"><thead><tr><th>Ano</th><th>Jogador</th><th>Clube</th></tr></thead>
     <tbody>{registros.map((x,i)=><tr key={[x.ano,x.jogadorId,i].join('|')}><td>{x.ano??'—'}</td>
       <td><LinkEntidade tipo="jogador" id={x.jogadorId} nome={x.jogadorNome}/></td>
       <td><LinkEntidade tipo="clube" nome={x.clube||''}>{x.clube||'Sem clube registrado'}</LinkEntidade></td></tr>)}</tbody>
   </table></div>:<p className="hf-vazio">Este save ainda não registra vencedores do prêmio selecionado.</p>}
 </section>;
}
