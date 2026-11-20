import React,{useMemo,useState} from 'react';
import {rankingDaFamilia,rankingTreinadores,FAMILIAS_RANKING} from './rankings.js';
import {escudoDe} from '../comum/arte.js';
import LinkEntidade from './LinkEntidade.jsx';
import './RankingsMundo.css';

const n=x=>Number.isFinite(x)?x.toLocaleString('pt-BR'):'—';
function Variacao({atual,anterior}){
 if(anterior==null)return <span className="rk-var rk-novo" title="Entrou no ranking">novo</span>;
 const d=anterior-atual;
 return <span className={`rk-var ${d>0?'rk-sobe':d<0?'rk-desce':''}`} title={d?`${Math.abs(d)} posições`:'Manteve a posição'}>{d>0?`▲${d}`:d<0?`▼${-d}`:'='}</span>;
}

/** Rankings vivos: clubes por confederação, seleções e treinadores. */
export default function RankingsMundo({c}){
 const [aba,setAba]=useState('uefa'),[limite,setLimite]=useState(30);
 const dados=useMemo(()=>aba==='treinadores'?null:rankingDaFamilia(c,aba),[c,aba]);
 const tecnicos=useMemo(()=>aba==='treinadores'?rankingTreinadores(c):[],[c,aba]);
 const selecao=aba==='fifa';
 return <section className="rk-rankings" aria-label="Rankings do mundo">
  <header><span className="hf-eyebrow">ARQUIVO VIVO / RANKINGS</span><h2>Rankings</h2>
   <p>{aba==='treinadores'?'Títulos ponderados (continentais valem mais) e nível de cada técnico, inclusive o seu.':selecao?'Nível do elenco somado aos resultados dos últimos quatro anos em Copas e torneios continentais.':'Pontos nos torneios continentais das últimas cinco temporadas: vitória 2, empate 1, campeão +4, vice +2. Definem os potes dos sorteios.'}</p></header>
  <div className="rk-abas" role="tablist" aria-label="Tipo de ranking">{[...Object.entries(FAMILIAS_RANKING).map(([id,f])=>[id,f.nome]),['treinadores','Treinadores']].map(([id,nome])=>
   <button key={id} type="button" role="tab" aria-selected={aba===id} onClick={()=>{setAba(id);setLimite(30);}}>{nome}</button>)}</div>
  {aba==='treinadores'?(tecnicos.length?<div className="hf-tabela-scroll"><table className="hf-tabela rk-tabela"><thead><tr><th>#</th><th className="rk-nome">Treinador</th><th className="rk-opcional">Títulos</th><th className="rk-opcional">Nível</th><th>Pontos</th></tr></thead>
   <tbody>{tecnicos.slice(0,limite).map(t=><tr key={t.id||t.nome} className={t.voce?'rk-voce':''}><td>{t.posicao}</td><td className="rk-nome"><strong>{t.nome}{t.voce?' · Você':''}</strong>
    <small>{t.situacao==='Sem clube'?'Sem clube':<LinkEntidade tipo="clube" nome={t.situacao}/>}{t.titulos?.length>0?` · ${[...new Set(t.titulos.map(x=>x.nome))].slice(0,2).join(' · ')}${t.titulos.length>2?'…':''}`:''}</small></td>
    <td className="rk-opcional">{t.titulos?.length||0}</td><td className="rk-opcional">{n(t.qualidade)}</td><td><b>{n(t.pontos)}</b></td></tr>)}</tbody></table></div>
   :<p className="hf-vazio">O ranking de treinadores aparece após a primeira temporada simulada.</p>)
  :dados?.linhas?.length?<div className="hf-tabela-scroll"><table className="hf-tabela rk-tabela"><thead><tr><th>#</th><th></th><th className="rk-nome">{selecao?'Seleção':'Clube'}</th>{dados.anos.map(a=><th key={a} className="rk-ano">{a}</th>)}<th>Pontos</th></tr></thead>
   <tbody>{dados.linhas.slice(0,limite).map(x=><tr key={x.nome}><td>{x.posicao}</td><td><Variacao atual={x.posicao} anterior={x.anterior}/></td>
    <td className="rk-nome"><span className="rk-equipe">{!selecao&&<img src={escudoDe(x.nome)} alt=""/>}<LinkEntidade tipo={selecao?'selecao':'clube'} nome={x.nome}/></span></td>
    {dados.anos.map(a=><td key={a} className="rk-ano">{x.porAno[a]?n(x.porAno[a]):'—'}</td>)}<td><b>{n(x.pontos)}</b></td></tr>)}</tbody></table></div>
  :<p className="hf-vazio">O ranking é formado a partir das edições disputadas neste save. Volte após a primeira temporada.</p>}
  {(aba==='treinadores'?tecnicos.length:dados?.linhas?.length||0)>limite&&<button type="button" className="rk-mais" onClick={()=>setLimite(x=>x+30)}>Mostrar mais</button>}
 </section>;
}
