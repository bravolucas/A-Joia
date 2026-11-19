import React,{useMemo,useState} from 'react';
import {LIGAS} from '../dados/data.js';
import {Escudo} from './uiTreinador.jsx';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import {valorTransferencia,tipoTransferencia} from '../simulacao/historicoTransferencias.js';
import {filtrarCentral,ligaDoClube} from './centralTransferencias.js';
import './CentralTransferencias.css';

const TIPOS=[['todos','Todos os tipos'],['transferencia','Transferências'],['emprestimo','Empréstimos'],['livre','Sem custos']];
export default function CentralTransferencias({c}){
 const t=c.tecnico,lista=useMemo(()=>c.mundo?.transferencias||[],[c.mundo]);
 const anos=useMemo(()=>[...new Set(lista.map(x=>x.ano??x.temporada))].filter(v=>v!==undefined).sort((a,b)=>b-a),[lista]);
 const ligas=useMemo(()=>[...new Set(lista.flatMap(x=>[ligaDoClube(x.de,t.ligasMundo),ligaDoClube(x.para,t.ligasMundo)]))].filter(l=>l&&LIGAS[l]).sort((a,b)=>LIGAS[a].nome.localeCompare(LIGAS[b].nome,'pt-BR')),[lista,t.ligasMundo]);
 const [temporada,T]=useState('todas'),[liga,L]=useState('todas'),[tipo,P]=useState('todos'),[busca,B]=useState(''),[meuClube,M]=useState(false),[limite,setLimite]=useState(40);
 const filtrada=useMemo(()=>filtrarCentral(lista,{temporada,liga,tipo,busca,clube:meuClube?t.clube:null,ligasMundo:t.ligasMundo}),[lista,temporada,liga,tipo,busca,meuClube,t.clube,t.ligasMundo]);
 const maiores=useMemo(()=>[...filtrada].filter(x=>x.valor>0&&x.tipo==='transferencia').sort((a,b)=>b.valor-a.valor).slice(0,5),[filtrada]);
 const total=filtrada.reduce((n,x)=>n+(x.tipo==='transferencia'?x.valor||0:0),0);
 return <section className="ctm-panel ctr" aria-label="Central de transferências">
  <div className="ctm-panel-heading"><div><span className="ctm-eyebrow">MERCADO DO MUNDO</span><h2>Central de transferências</h2><p>Negócios das últimas temporadas: atleta, origem, destino e valor. Cada movimento também fica no histórico do jogador.</p></div></div>
  {!lista.length?<p className="ctr-vazio">As transferências aparecem aqui depois da primeira janela simulada nesta versão.</p>:<>
   <div className="ctm-metrics"><article><span>Negócios</span><strong>{filtrada.length.toLocaleString('pt-BR')}</strong></article><article><span>Movimentado em transferências</span><strong className="ctr-dinheiro">{valorTransferencia(total,'EUR')}</strong></article></div>
   {maiores.length>0&&<div className="ctr-maiores"><h3>Maiores negócios</h3><ol>{maiores.map((x,i)=><li key={`${x.id}-${x.temporada}-${i}`}><b>{i+1}</b><span><LinkEntidade tipo="jogador" id={x.id} nome={x.nome}/><small>{x.de} → {x.para}</small></span><strong>{valorTransferencia(x.valor,x.moeda)}</strong></li>)}</ol></div>}
   <div className="ctr-filtros">
    <label>Buscar<input type="search" value={busca} onChange={e=>B(e.target.value)} placeholder="Atleta ou clube"/></label>
    <label>Ano<select value={temporada} onChange={e=>T(e.target.value)}><option value="todas">Todos</option>{anos.map(a=><option key={a} value={a}>{a}</option>)}</select></label>
    <label>Liga<select value={liga} onChange={e=>L(e.target.value)}><option value="todas">Todas</option>{ligas.map(l=><option key={l} value={l}>{LIGAS[l].nome}</option>)}</select></label>
    <label>Tipo<select value={tipo} onChange={e=>P(e.target.value)}>{TIPOS.map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
    {t.clube&&<label className="ctr-check"><input type="checkbox" checked={meuClube} onChange={e=>M(e.target.checked)}/>Só o {t.clube}</label>}
   </div>
   <div className="ctm-table-scroll"><table className="ctm-table ctr-tabela"><caption>{filtrada.length} negócios encontrados</caption>
    <thead><tr><th scope="col">Atleta</th><th scope="col">Origem → destino</th><th scope="col">Tipo</th><th scope="col">Valor</th><th scope="col">Ano</th></tr></thead>
    <tbody>{filtrada.slice(0,limite).map((x,i)=><tr key={`${x.id}-${x.temporada}-${x.tipo}-${i}`}>
     <td data-rotulo="Atleta"><strong><LinkEntidade tipo="jogador" id={x.id} nome={x.nome}/></strong><small>{x.posicao} · {x.idade} anos · OVR {x.ovr}</small></td>
     <td data-rotulo="Origem → destino"><span className="ctr-rota"><span><Escudo nome={x.de||''} size={20}/><LinkEntidade tipo="clube" nome={x.de||''}>{x.de||'Sem clube'}</LinkEntidade></span><i aria-hidden="true">→</i><span><Escudo nome={x.para||''} size={20}/><LinkEntidade tipo="clube" nome={x.para||''}>{x.para||'Sem clube'}</LinkEntidade></span></span></td>
     <td data-rotulo="Tipo">{x.tipo==='livre'?'Sem custos':tipoTransferencia(x.tipo)}</td>
     <td data-rotulo="Valor"><strong>{x.tipo==='transferencia'?valorTransferencia(x.valor,x.moeda):'—'}</strong></td>
     <td data-rotulo="Ano">{x.ano??'—'}</td></tr>)}</tbody></table></div>
   {filtrada.length>limite&&<button type="button" className="ctr-mais" onClick={()=>setLimite(n=>n+40)}>Mostrar mais negócios</button>}
  </>}
 </section>;
}
