import React,{useMemo,useState} from 'react';
import {NACIONALIDADES} from '../dados/data.js';
import {bandeiraDe} from '../comum/arte.js';
import {campeoesRegistrados} from './competicoesHistoricas.js';
import {competicoesHistoricasSelecoes,historicoDaSelecao,HISTORICO_SELECOES,nomeSelecaoHistorica} from '../dados/selecoesHistoricas.js';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import LinkEntidade from './LinkEntidade.jsx';
import RecordesFutebol from './RecordesFutebol.jsx';

const nomePais=nome=>nomeSelecaoHistorica(nome);
export function nomesSelecoesHistoricas(){
 const nomes=Object.values(HISTORICO_SELECOES).flatMap(edicoes=>edicoes.flatMap(e=>e.campeoes.map(x=>x.clube)));
 return [...new Set([...NACIONALIDADES.map(n=>n.label),...nomes])].sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
/** Palmarés de seleções: dados reais x universo simulado sempre separados. */
export default function GaleriaSelecoes({c={},nome,temporadas,onSelecao}){
 const pais=nomePais(nome);
 const [busca,B]=useState('');
 const opcoes=useMemo(()=>nomesSelecoesHistoricas().filter(n=>n.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))),[busca]);
 const reais=useMemo(()=>historicoDaSelecao(pais),[pais]);
 const simulados=useMemo(()=>campeoesRegistrados(c,temporadas)
  .filter(e=>e.selecao&&nomePais(e.clube)===pais),[c,temporadas,pais]);
 const competicoes=[...new Set([...competicoesHistoricasSelecoes,...simulados.map(e=>e.nome)])];
 const palmares=competicoes.map(nome=>{
  const historicos=reais.filter(x=>x.competicao===nome);
  const doSave=simulados.filter(x=>x.nome===nome);
  return {nome,historicos,doSave,total:historicos.length+doSave.length};
 }).filter(g=>g.total>0||g.nome==='Copa do Mundo');
 const bandeira=NACIONALIDADES.find(n=>nomePais(n.label)===pais);
 const soma=palmares.reduce((n,x)=>n+x.total,0);
 return <section className="hf-selecoes fm27-archive" aria-label={'Histórico da seleção '+pais}>
   <div className="hf-busca">
     <label>Buscar seleção<input type="search" value={busca} onChange={e=>B(e.target.value)} placeholder="Buscar país…"/></label>
     <select aria-label="Selecionar seleção" value={pais}
       onChange={e=>onSelecao(e.target.value)}>
       {!opcoes.includes(pais)&&<option value={pais}>{pais}</option>}
       {opcoes.map(n=><option key={n} value={n}>{n}</option>)}
     </select>
   </div>
   <header className="hf-identidade">
    {bandeira?<img src={bandeiraDe(bandeira.id)} alt=""/>:<span aria-hidden="true" className="hf-bandeira-historica">🌐</span>}
    <div><span className="hf-eyebrow">ARQUIVO VIVO / SELEÇÕES</span><h2>{pais}</h2>
    <p>{reais.length} títulos reais documentados · {simulados.length} conquistas na carreira · {soma} no acervo exibido</p></div>
   </header>
   <p className="hf-nota">Os títulos oficiais anteriores ao save são históricos; conquistas de temporadas simuladas aparecem separadamente. A Copa do Mundo e os torneios continentais fazem parte do mesmo acervo de seleções.</p>
   <div className="hf-vitrine">{palmares.map(g=><article className={g.total?"hf-taca":"hf-taca hf-vazia"} key={g.nome}>
      <TacaCompeticao nome={g.nome} size={76}/><strong>{g.total}×</strong>
      <h3><LinkEntidade tipo="competicao" nome={g.nome}/></h3>
      <small>{g.historicos.length} títulos reais · +{g.doSave.length} nesta carreira</small>
      {g.historicos.length>0?<p>{g.historicos.map(x=>x.edicao||x.ano).join(' · ')}</p>:<p>Sem títulos oficiais nesta competição.</p>}
      {g.doSave.length>0&&<p>Na simulação: {g.doSave.map(x=>x.ano).join(' · ')}</p>}
     </article>)}</div>
   {!palmares.length&&<p className="hf-vazio">Ainda não há títulos registrados para esta seleção.</p>}
   <RecordesFutebol c={c} tipo="selecao" nome={pais}/>
   <h3 className="hf-subtitulo">Títulos oficiais por edição</h3>
   {reais.length?<ol className="hf-linha hf-campeoes">{reais.map((e,i)=><li key={e.competicao+'|'+e.edicao+'|'+i}>
      <time>{e.edicao||e.ano}</time><span><b><LinkEntidade tipo="competicao" nome={e.competicao}/></b>
      <small>Campeão histórico · {pais}</small></span>
   </li>)}</ol>:<p className="hf-vazio">Esta seleção ainda não possui título histórico cadastrado.</p>}
   <h3 className="hf-subtitulo">Conquistas neste universo</h3>
   {simulados.length?<ol className="hf-linha hf-campeoes">{simulados.map((e,i)=><li key={e.nome+'|'+e.ano+'|'+i}>
    <time>{e.ano}</time><span><b><LinkEntidade tipo="competicao" nome={e.nome}/></b>
    <small>Campeão na simulação{e.voce?' · Com você':''}</small></span>
   </li>)}</ol>:<p className="hf-vazio">A seleção ainda não conquistou competições neste save.</p>}
   {pais==='Marrocos'&&<p className="hf-nota">Copa Africana de Nações 2025: resultado reconhecido pela CAF, ainda sob recurso no TAS em novembro de 2026.</p>}
 </section>;
}
