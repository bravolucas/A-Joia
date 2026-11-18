import React,{useMemo,useState} from 'react';
import {conquistasDoCadastroMundo,expandirConquista,nomePremio,resumoConquistas} from '../simulacao/historicoConquistas.js';

const padrao=['Bola de Ouro','Bota de Ouro','Troféu Yashin','Melhor jogador','Artilheiro','Revelação'];
const canonico=s=>nomePremio(String(s||'').trim());
const chave=s=>canonico(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim();
export function premiacoesDoSave(c={}){
 const universo=c.tecnico?.universo||c.universo||{};
 const resultados=new Map();
 const incluir=(id,nome,registros)=>{
  for(const reg of registros||[]){
   const item=expandirConquista(reg);
   if(!item||item.categoria!=='premio')continue;
   const k=[String(id),item.ano,chave(item.nome),item.clube].join('|');
   if(!resultados.has(k))resultados.set(k,{...item,nome:canonico(item.nome),jogadorId:String(id),jogador:nome||'Jogador'});
  }
 };
 for(const [id,p] of Object.entries(universo.atletas||{}))incluir(id,p.nome,p.conquistas);
 // Os atletas do mundo podem guardar troféus em um formato compacto diferente.
 for(const p of c.mundo?.jogadores||[]){
  if(!p.premiacoesIndividuais?.length)continue;
  incluir(p.id,p.nome,conquistasDoCadastroMundo(p));
 }
 if(c.temporadas?.length||c.lista?.length)incluir('voce',c.nome,resumoConquistas(c,'voce').premios);
 return [...resultados.values()].sort((a,b)=>(b.ano??0)-(a.ano??0)||a.jogador.localeCompare(b.jogador,'pt-BR'));
}
export default function PremiosHistoricos({c,nome,onPremio,onJogador,onClube}){
 const registros=useMemo(()=>premiacoesDoSave(c),[c]);
 const nomes=useMemo(()=>[...new Set([...padrao,...registros.map(x=>x.nome)])].sort((a,b)=>a.localeCompare(b,'pt-BR')),[registros]);
 const atual=nome||'Bola de Ouro',selecionados=registros.filter(x=>chave(x.nome)===chave(atual));
 const ranking=useMemo(()=>{
  const mapa=new Map();
  for(const item of selecionados){
   const key=item.jogadorId;
   const r=mapa.get(key)||{...item,total:0};
   r.total++;
   mapa.set(key,r);
  }
  return [...mapa.values()].sort((a,b)=>b.total-a.total||a.jogador.localeCompare(b.jogador,'pt-BR')).slice(0,12);
 },[selecionados]);
 return <section className="fm27-awards" aria-label="Histórico dos prêmios">
  <header className="fm27-section-header"><div><span className="fm27-eyebrow">A JOIA / ARQUIVO VIVO / PREMIAÇÕES</span><h2>{atual}</h2><p>Vencedores registrados no universo desta carreira, por edição e por atleta.</p></div><span className="fm27-counter">{selecionados.length} registros</span></header>
  <label className="fm27-award-filter">Premiação<select aria-label="Premiação do histórico" value={atual} onChange={e=>onPremio(e.target.value)}>{!nomes.includes(atual)&&<option>{atual}</option>}{nomes.map(n=><option key={n}>{n}</option>)}</select></label>
  <div className="fm27-kpis fm27-kpis-narrow"><div className="fm27-kpi"><strong>{selecionados.length}</strong><span>Premiações documentadas</span></div><div className="fm27-kpi"><strong>{ranking.length}</strong><span>Atletas diferentes no registro</span></div></div>
  <div className="fm27-panel-heading"><h3>Vencedores por temporada</h3></div>
  {selecionados.length?<div className="fm27-data-scroll"><table className="fm27-data"><thead><tr><th>Ano</th><th>Jogador</th><th>Clube</th></tr></thead><tbody>{selecionados.map((r,i)=><tr key={r.jogadorId+'|'+r.ano+'|'+i}><td>{r.ano??'—'}</td><td><button className="ajoia-entity-link" onClick={()=>onJogador(r.jogadorId)}>{r.jogador}</button></td><td>{r.clube?<button className="ajoia-entity-link" onClick={()=>onClube(r.clube)}>{r.clube}</button>:'—'}</td></tr>)}</tbody></table></div>:<p className="fm27-empty">Este prêmio ainda não possui vencedores registrados no save. Nenhum vencedor será inventado.</p>}
  {ranking.length>0&&<><div className="fm27-panel-heading"><h3>Maiores vencedores</h3></div><ol className="hf-ranking">{ranking.map((r,i)=><li key={r.jogadorId}><b>{i+1}</b><span><button className="ajoia-entity-link" onClick={()=>onJogador(r.jogadorId)}>{r.jogador}</button><small>{r.clube||'Sem clube registrado'}</small></span><em>{r.total}×</em></li>)}</ol></>}
 </section>;
}
