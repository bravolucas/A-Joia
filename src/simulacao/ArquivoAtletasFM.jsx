import React,{useMemo,useState} from 'react';
import {historicoAtleta} from './mundoVivo.js';
import {resumoConquistas} from './historicoConquistas.js';
import {resumoConfrontosAtleta,partidasDoAtleta} from './historicoConfrontos.js';
import {escudoDe} from '../comum/arte.js';

const n=x=>Number.isFinite(x)?x.toLocaleString('pt-BR'):'—';
const texto=x=>String(x||'').toLocaleLowerCase('pt-BR');
const total=(linhas,campo)=>linhas.reduce((s,t)=>s+(Number(t[campo])||0),0);
const seTemNumero=(linhas,campo)=>linhas.some(t=>Number.isFinite(t[campo]));
const tituloAno=(ano,clube)=>[ano??'Ano não registrado',clube||'Sem clube'].filter(Boolean).join(' · ');
function NumerosCarreira({linhas,conquistas}){
 const dados=[
  [n(total(linhas,'jogos')),'Jogos'],[n(total(linhas,'gols')),'Gols'],
  [n(total(linhas,'assist')),'Assistências'],
  [seTemNumero(linhas,'defesas')?n(total(linhas,'defesas')):'—','Defesas'],
  [conquistas.titulos.length,'Títulos'],[conquistas.premios.length,'Prêmios'],
 ];
 return <div className="fm27-kpis" aria-label="Estatísticas de carreira">
  {dados.map(([v,rotulo])=><div className="fm27-kpi" key={rotulo}><strong>{v}</strong><span>{rotulo}</span></div>)}
 </div>;
}
function TabelaCarreira({linhas,conquistas}){
 if(!linhas.length)return <p className="fm27-empty">As estatísticas por temporada serão exibidas conforme a carreira avançar.</p>;
 return <div className="fm27-data-scroll"><table className="fm27-data">
  <thead><tr><th>Temporada</th><th>Clube</th><th>Jogos</th><th>Gols</th><th>Ast.</th><th>Defesas</th><th>Títulos / prêmios</th></tr></thead>
  <tbody>{[...linhas].reverse().map((r,i)=>{
   const registros=conquistas.todas.filter(x=>x.ano===r.ano&&(!x.clube||x.clube===r.clube||x.categoria==='premio'));
   return <tr key={String(r.ano)+'|'+r.clube+'|'+i}>
    <td><strong>{r.ano??'—'}</strong></td><td className="fm27-club-cell"><img src={escudoDe(r.clube)} alt=""/>{r.clube||'Sem clube'}</td>
    <td>{n(r.jogos)}</td><td>{n(r.gols)}</td><td>{n(r.assist)}</td><td>{n(r.defesas)}</td>
    <td className="fm27-season-honours">{registros.length?registros.map((x,j)=><span key={j} className="fm27-mini-honour" title={x.categoria==='premio'?'Prêmio individual':'Título coletivo'}>{x.categoria==='premio'?'★':'◆'} {x.nome}</span>):'—'}</td>
   </tr>;
  })}</tbody>
 </table></div>;
}
function ListaConquistas({registros,categoria}){
 const lista=categoria==='todas'?registros:registros.filter(x=>x.categoria===categoria);
 if(!lista.length)return <p className="fm27-empty">Ainda não há {categoria==='premio'?'premiações individuais':'conquistas'} documentadas neste save.</p>;
 return <div className="fm27-honours-list">{lista.map((x,i)=><article key={[x.ano,x.categoria,x.nome,x.clube,i].join('|')} className="fm27-honour">
  <span className={'fm27-honour-symbol '+(x.categoria==='premio'?'is-award':'')}>{x.categoria==='premio'?'★':'🏆'}</span>
  <div><strong>{x.nome}</strong><span>{x.categoria==='premio'?'Prêmio individual':'Título coletivo'} · {tituloAno(x.ano,x.clube)}</span></div>
  <b>{x.ano??'—'}</b>
 </article>)}</div>;
}
function RetrospectoJogador({c,p,onConfrontos}){
 const dados=resumoConfrontosAtleta(c,{jogadorId:p.id});
 const adversarios=useMemo(()=>{
  const mapa=new Map();
  for(const j of partidasDoAtleta(c,p.id)){
   if(j.participou===false)continue;
   const a=mapa.get(j.adversario)||{nome:j.adversario,jogos:0,gols:0,assistencias:0};
   a.jogos++;a.gols+=Number(j.gols)||0;a.assistencias+=Number(j.assistencias)||0;
   mapa.set(j.adversario,a);
  }
  return [...mapa.values()].sort((a,b)=>b.jogos-a.jogos).slice(0,12);
 },[c,p.id]);
 return <>
  <div className="fm27-panel-heading"><div><h3>Retrospecto por adversário</h3><p>Somente jogos com resultados registrados no arquivo da carreira.</p></div>
   {onConfrontos&&<button className="fm27-action" onClick={()=>onConfrontos(p.id)}>Abrir análise completa</button>}
  </div>
  <div className="fm27-kpis fm27-kpis-narrow">
   {[[dados.jogos,'Partidas'],[dados.vitorias,'Vitórias'],[dados.empates,'Empates'],[dados.derrotas,'Derrotas'],[dados.gols,'Gols'],[dados.assistencias,'Assist.']].map(([v,label])=>
    <div className="fm27-kpi" key={label}><strong>{n(v)}</strong><span>{label}</span></div>)}
  </div>
  {adversarios.length?<div className="fm27-data-scroll"><table className="fm27-data">
   <thead><tr><th>Adversário</th><th>Jogos</th><th>Gols</th><th>Assistências</th></tr></thead>
   <tbody>{adversarios.map(x=><tr key={x.nome}><td>{x.nome}</td><td>{x.jogos}</td><td>{x.gols}</td><td>{x.assistencias}</td></tr>)}</tbody>
  </table></div>:<p className="fm27-empty">Os confrontos detalhados aparecerão quando existirem partidas registradas.</p>}
 </>;
}

/** Arquivo persistente de atletas. Layout inspirado na navegação em tela cheia do FM27. */
export default function ArquivoAtletasFM({c,onConfrontos}){
 const u=c.tecnico?.universo||c.universo||{};
 const [busca,B]=useState(''),[clube,C]=useState(''),[id,I]=useState(null),[aba,A]=useState('resumo');
 const [categoria,Q]=useState('todas');
 const todos=useMemo(()=>{
  const mapa=new Map(Object.values(u.atletas||{}).map(p=>[String(p.id),{...p,id:String(p.id)}]));
  for(const p of c.mundo?.jogadores||[]){
   const atual=mapa.get(String(p.id));
   if(p.aposentado&&!atual)continue;
   mapa.set(String(p.id),{...atual,id:String(p.id),nome:p.nome,posicao:p.posicao,nac:p.nac,
    clube:p.clubeNome,aposentado:!!p.aposentado,contrato:p.contrato,movimentos:p.movimentos||[],
    historico:atual?.historico||[]});
  }
  if((c.temporadas||[]).length&&!mapa.has('voce'))mapa.set('voce',{
   id:'voce',voce:true,nome:c.nome||'Seu jogador',posicao:c.posicao,nac:c.nac,
   clube:c.clubeNome||c.clube?.nome,aposentado:!!c.aposentado,
   historico:c.temporadas.map(t=>({ano:t.ano,clube:t.clube,jogos:t.jogos,gols:t.gols,assist:t.assist,defesas:t.defesas,cleanSheets:t.cleanSheets,titulos:(t.titulos||[]).map(x=>x.nome),porCompeticao:t.porCompeticao||[]}))
  });
  return [...mapa.values()];
 },[u,c.mundo,c.temporadas,c.nome,c.posicao,c.nac,c.clubeNome,c.aposentado]);
 const clubes=useMemo(()=>[...new Set(todos.flatMap(p=>[p.clube,...historicoAtleta(p).map(x=>x.clube)]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[todos]);
 const filtrados=useMemo(()=>todos.filter(p=>(!busca||texto(p.nome).includes(texto(busca)))&&(!clube||p.clube===clube||historicoAtleta(p).some(x=>x.clube===clube)))
    .sort((a,b)=>Number(!!b.voce)-Number(!!a.voce)||a.nome.localeCompare(b.nome,'pt-BR')),[todos,busca,clube]);
 const selecionado=filtrados.find(p=>p.id===id)||filtrados[0]||null;
 const linhas=useMemo(()=>selecionado?historicoAtleta(selecionado):[],[selecionado]);
 const conquistas=useMemo(()=>selecionado?resumoConquistas(c,selecionado.id):{todas:[],titulos:[],premios:[]},[c,selecionado?.id]);
 const selecionar=novo=>{I(novo);A('resumo');Q('todas');};
 return <section className="fm27-archive" aria-label="Arquivo de jogadores">
  <header className="fm27-section-header">
   <div><span className="fm27-eyebrow">A JOIA / CENTRO DE DADOS / JOGADORES</span><h2>Histórico de jogadores</h2>
    <p>Carreiras, estatísticas, títulos e distinções preservados temporada após temporada.</p></div>
   <span className="fm27-counter">{filtrados.length.toLocaleString('pt-BR')} atletas</span>
  </header>
  <div className="fm27-browser">
   <aside className="fm27-roster" aria-label="Selecionar jogador">
    <div className="fm27-roster-filters">
     <label>Buscar atleta<input aria-label="Buscar jogador" type="search" value={busca} onChange={e=>B(e.target.value)} placeholder="Nome do jogador…"/></label>
     <label>Clube<select value={clube} onChange={e=>C(e.target.value)} aria-label="Filtrar pelo clube">
       <option value="">Todos os clubes</option>{clubes.map(nome=><option key={nome} value={nome}>{nome}</option>)}
      </select></label>
    </div>
    <div className="fm27-roster-list mv-atletas">
     {filtrados.slice(0,120).map(p=><button key={p.id} className={'fm27-roster-item '+(selecionado?.id===p.id?'is-selected':'')} data-atleta={String(p.id)} type="button" onClick={()=>selecionar(p.id)}>
      <span className="fm27-roster-avatar">{(p.nome||'?').slice(0,1).toUpperCase()}</span>
      <span className="fm27-roster-copy"><strong>{p.nome||'Sem nome'}{p.voce?' · Você':''}</strong><small>{p.posicao||'Jogador'} · {p.clube||'Livre'}{p.aposentado?' · Aposentado':''}</small></span>
     </button>)}
     {filtrados.length>120&&<p className="fm27-list-hint">Refine a pesquisa para consultar mais jogadores.</p>}
     {!filtrados.length&&<p className="fm27-list-hint">Nenhum jogador encontrado.</p>}
    </div>
   </aside>
   <main className="fm27-player-main">
    {!selecionado?<div className="fm27-empty">Selecione um jogador para abrir a ficha.</div>:<article className="fm27-player-sheet" aria-label={`Ficha de ${selecionado.nome}`}>
     <div className="fm27-player-hero">
      <div className="fm27-identity-symbol"><img src={escudoDe(selecionado.clube)} alt="" /></div>
      <div className="fm27-player-identity">
       <span className="fm27-eyebrow">FICHA DE CARREIRA {selecionado.voce?' / SEU JOGADOR':''}</span>
       <h3>{selecionado.nome}</h3><p>{selecionado.posicao||'Jogador'} · {selecionado.clube||'Sem clube'} · {selecionado.nac||'Nacionalidade não informada'}</p>
      </div>
      <span className={'fm27-player-state '+(selecionado.aposentado?'is-retired':'')}>{selecionado.aposentado?'Aposentado':'Em atividade'}</span>
     </div>
     {(Number.isInteger(selecionado.contrato)||selecionado.movimentos?.length>0)&&
      <section className="fm27-contract-strip" aria-label="Contratos e movimentações">
       {Number.isInteger(selecionado.contrato)&&!selecionado.aposentado&&<p>Contrato: {selecionado.clube?`${selecionado.contrato} temporada(s)`:'Livre'}</p>}
       {selecionado.movimentos?.length>0&&<details><summary>Movimentações da carreira ({selecionado.movimentos.length})</summary>
        <ul aria-label={`Movimentações de ${selecionado.nome}`}>{selecionado.movimentos.map((m,i)=><li key={i}>
         {m.ano??m.temporada??'—'} · {m.tipo==='renovacao'?'Contrato renovado':`${m.de||'Sem clube'} → ${m.para||'Sem clube'}`}
        </li>)}</ul>
       </details>}
      </section>}
     <nav className="fm27-subtabs" aria-label="Seções do jogador">
      {[['resumo','Visão geral'],['carreira','Carreira'],['conquistas','Conquistas'],['confrontos','Adversários']].map(([key,label])=>
       <button type="button" key={key} aria-current={aba===key?'page':undefined} onClick={()=>A(key)}>{label}</button>)}
     </nav>
     <div className="fm27-player-body">
      {aba==='resumo'&&<>
       <NumerosCarreira linhas={linhas} conquistas={conquistas}/>
       <div className="fm27-dashboard-columns">
        <article className="fm27-panel"><div className="fm27-panel-heading"><div><h3>Trajetória</h3><p>Últimas temporadas registradas</p></div></div>
         {linhas.length?<div className="fm27-timeline">{[...linhas].reverse().slice(0,7).map((x,i)=>
          <div className="fm27-timeline-row" key={i}><time>{x.ano}</time><img src={escudoDe(x.clube)} alt=""/><span><strong>{x.clube}</strong><small>{n(x.jogos)} jogos · {n(x.gols)} gols · {n(x.assist)} assistências</small></span></div>)}</div>
          :<p className="fm27-empty">Sem histórico de temporadas concluídas.</p>}
        </article>
        <article className="fm27-panel"><div className="fm27-panel-heading"><div><h3>Vitrine de conquistas</h3><p>{conquistas.titulos.length} títulos · {conquistas.premios.length} prêmios individuais</p></div>
           <button className="fm27-text-button" onClick={()=>A('conquistas')}>Ver todas</button></div>
          <ListaConquistas registros={conquistas.todas.slice(0,5)} categoria="todas"/>
        </article>
       </div>
      </>}
      {aba==='carreira'&&<><div className="fm27-panel-heading"><div><h3>Carreira por temporada</h3><p>Dados registrados no save, sem completar anos ausentes artificialmente.</p></div></div><TabelaCarreira linhas={linhas} conquistas={conquistas}/></>}
      {aba==='conquistas'&&<>
       <div className="fm27-panel-heading"><div><h3>Conquistas e distinções</h3><p>Troféus coletivos e premiações individuais vinculados ao atleta.</p></div></div>
       <div className="fm27-segmented" role="group" aria-label="Filtrar conquistas">{[['todas','Todas'],['titulo','Títulos'],['premio','Prêmios']].map(([value,label])=>
         <button key={value} aria-pressed={categoria===value} onClick={()=>Q(value)}>{label}{value==='titulo'? ` (${conquistas.titulos.length})`:value==='premio'?` (${conquistas.premios.length})`:''}</button>)}</div>
       <ListaConquistas registros={conquistas.todas} categoria={categoria}/>
      </>}
      {aba==='confrontos'&&<RetrospectoJogador c={c} p={selecionado} onConfrontos={onConfrontos}/>}
     </div>
    </article>}
   </main>
  </div>
  <p className="fm27-archive-footnote">O arquivo mantém apenas conquistas documentadas. Registros antigos com participação comprovada podem ser recuperados, mas resultados ausentes não são inventados.</p>
 </section>;
}
