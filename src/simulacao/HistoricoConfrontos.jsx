import React,{useMemo,useState} from 'react';
import {partidasHistoricas,partidasDoAtleta,resumoConfrontosClubes,resumoConfrontosAtleta} from './historicoConfrontos.js';
import {escudoDe} from '../comum/arte.js';

const numero=n=>Number.isFinite(n)?n.toLocaleString('pt-BR'):typeof n==='string'?n:'—';
const ordenar=(lista)=>[...new Set(lista.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
function SelectFiltro({titulo,valor,onChange,opcoes,todos}){
 return <label>{titulo}<select value={valor} onChange={e=>onChange(e.target.value)} aria-label={titulo}>
  <option value="">{todos}</option>{opcoes.map(s=><option key={s} value={String(s)}>{s}</option>)}
 </select></label>;
}
function ResumoCompeticoes({linhas,individual}){
 if(!linhas.length)return <p className="fm27-empty">Não existem competições registradas para esta seleção.</p>;
 return <div className="fm27-data-scroll"><table className="fm27-data" aria-label="Retrospecto por competição">
  <thead><tr><th>Competição</th><th>J</th><th>V</th><th>E</th><th>D</th>
   {individual?<><th>Gols</th><th>Assist.</th><th>Defesas</th></>:<><th>GP</th><th>GC</th></>}
  </tr></thead>
  <tbody>{linhas.map(x=><tr key={x.competicao}>
   <td>{x.competicao}</td><td>{x.jogos}</td><td>{x.vitorias}</td><td>{x.empates}</td><td>{x.derrotas}</td>
   {individual?<><td>{x.gols}</td><td>{x.assistencias}</td><td>{x.defesas}</td></>:<><td>{x.golsPro}</td><td>{x.golsContra}</td></>}
  </tr>)}</tbody>
 </table></div>;
}
function Partidas({linhas,individual}){
 if(!linhas.length)return <p className="fm27-empty">Nenhuma partida disponível para os filtros escolhidos. Dados ausentes não serão inventados.</p>;
 return <div className="fm27-data-scroll"><table className="fm27-data" aria-label="Resultados dos confrontos">
  <thead><tr><th>Ano</th><th>Competição</th><th>Mandante</th><th>Placar</th><th>Visitante</th>
   {individual&&<><th>Gols</th><th>Assist.</th><th>Defesas</th><th>Nota</th></>}
  </tr></thead>
  <tbody>{linhas.map(j=><tr key={j.id}>
   <td>{j.ano}</td><td>{j.competicao}<small className="fm27-cell-sub">{j.fase||j.rodada?typeof j.rodada==='number'?`Rodada ${j.rodada}`:j.fase||j.rodada:null}</small>
    {j.origem==='distribuicao-simulada'&&<small className="fm27-cell-sub">Estatísticas distribuídas</small>}</td>
   <td className="fm27-club-cell"><img src={escudoDe(j.casa)} alt=""/>{j.casa}</td>
   <td><b className="fm27-score">{j.golsCasa} – {j.golsFora}</b></td>
   <td className="fm27-club-cell"><img src={escudoDe(j.fora)} alt=""/>{j.fora}</td>
   {individual&&<><td>{numero(j.gols)}</td><td>{numero(j.assistencias)}</td><td>{numero(j.defesas)}</td><td>{numero(j.nota)}</td></>}
  </tr>)}</tbody>
 </table></div>;
}
export default function HistoricoConfrontos({c,jogadorInicial=null}){
 const [modo,M]=useState(jogadorInicial?'jogadores':'clubes');
 const [clube,C]=useState(''),[atleta,P]=useState(jogadorInicial||'voce');
 const [buscaAtleta,BA]=useState(''),[clubeAtuacao,CA]=useState('');
 const [local,L]=useState(''),[adversario,A]=useState(''),[competicao,K]=useState(''),[ano,Y]=useState('');
 const u=c.tecnico?.universo||c.universo||{};
 const arquivo=useMemo(()=>partidasHistoricas(c),[c]);
 const clubes=useMemo(()=>ordenar(arquivo.flatMap(j=>[j.casa,j.fora])),[arquivo]);
 const preferido=c.tecnico?.clube||c.clubeNome||c.clube?.nome||'';
 const clubeAtual=clubes.includes(clube)?clube:clubes.includes(preferido)?preferido:clubes[0]||'';
 const atletas=useMemo(()=>{
  const ids=new Set(Object.keys(u.partidasAtletas||{}));
  if((c.temporadas||[]).length)ids.add('voce');
  for(const [id,p] of Object.entries(u.atletas||{}))
   if((p.historico||[]).some(t=>Array.isArray(t)?t[10]?.length:t.porCompeticao?.length))ids.add(id);
  return [...ids].map(id=>({id,nome:id==='voce'?(c.nome||u.atletas?.voce?.nome||'Seu jogador'):(u.atletas?.[id]?.nome||'Jogador '+id)}))
   .sort((a,b)=>(b.id==='voce')-(a.id==='voce')||a.nome.localeCompare(b.nome,'pt-BR'));
 },[u,c.temporadas,c.nome]);
 const jogadoresFiltrados=atletas.filter(p=>p.id===atleta||!buscaAtleta||p.nome.toLocaleLowerCase('pt-BR').includes(buscaAtleta.toLocaleLowerCase('pt-BR'))).slice(0,100);
 const atletaAtual=atletas.some(p=>p.id===atleta)?atleta:atletas[0]?.id||'voce';
 const nomeAtleta=atletas.find(p=>p.id===atletaAtual)?.nome||'Jogador';
 const individuais=useMemo(()=>modo==='jogadores'?partidasDoAtleta(c,atletaAtual):[],[c,modo,atletaAtual]);
 const clubesAtuacao=useMemo(()=>ordenar(individuais.map(j=>j.clube)),[individuais]);
 const clubeDefendido=clubesAtuacao.includes(clubeAtuacao)?clubeAtuacao:'';
 const universe=modo==='clubes'?arquivo.filter(j=>j.casa===clubeAtual||j.fora===clubeAtual):individuais;
 const rivais=ordenar(universe.map(j=>modo==='clubes'?(j.casa===clubeAtual?j.fora:j.casa):j.adversario));
 const comps=ordenar(universe.map(j=>j.competicao));
 const anos=[...new Set(universe.map(j=>j.ano).filter(Number.isFinite))].sort((a,b)=>b-a).map(String);
 const rivalAtivo=rivais.includes(adversario)?adversario:'';
 const compAtiva=comps.includes(competicao)?competicao:'';
 const anoAtivo=anos.includes(ano)?ano:'';
 const filtros={adversario:rivalAtivo,competicao:compAtiva,ano:anoAtivo};
 const individual=modo==='jogadores';
 const resumo=individual?resumoConfrontosAtleta(c,{...filtros,jogadorId:atletaAtual,clube:clubeDefendido,local})
  :resumoConfrontosClubes(c,{...filtros,clube:clubeAtual});
 const zerar=()=>{A('');K('');Y('');CA('');L('');};
 const mudarModo=valor=>{M(valor);zerar();};
 const destaque=individual?nomeAtleta:clubeAtual;
 return <section className="fm27-confronts" aria-label="Histórico de confrontos">
  <header className="fm27-section-header">
   <div><span className="fm27-eyebrow">A JOIA / CENTRO DE DADOS / CONFRONTOS</span>
    <h2>Retrospecto de partidas</h2>
    <p>Histórico acumulado por jogador ou clube, com filtros por adversário, competição e temporada.</p></div>
   <span className="fm27-counter">Arquivo do save</span>
  </header>
  <nav className="fm27-segmented fm27-confront-switch" aria-label="Tipo de confronto">
   <button aria-pressed={!individual} onClick={()=>mudarModo('clubes')}>Clube × Clube</button>
   <button aria-pressed={individual} onClick={()=>mudarModo('jogadores')}>Jogador × Clube</button>
  </nav>
  <div className="fm27-match-layout">
   <aside className="fm27-match-filters" aria-label="Filtros do confronto">
    <h3>Parâmetros de consulta</h3>
    {individual?<><label>Buscar jogador<input type="search" aria-label="Buscar jogador do confronto" value={buscaAtleta} onChange={e=>BA(e.target.value)} placeholder="Nome do atleta…"/></label>
     <label>Jogador<select aria-label="Jogador do confronto" value={atletaAtual} onChange={e=>{P(e.target.value);zerar();}}>
      {jogadoresFiltrados.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
     </select></label>
     <SelectFiltro titulo="Clube defendido" valor={clubeDefendido} onChange={CA} opcoes={clubesAtuacao} todos="Todos os clubes"/>
     <SelectFiltro titulo="Mando de campo" valor={local} onChange={L} opcoes={['casa','fora']} todos="Casa e fora"/>
    </>:<label>Clube<select aria-label="Clube" value={clubeAtual} onChange={e=>{C(e.target.value);zerar();}}>
      {clubes.map(x=><option key={x}>{x}</option>)}
    </select></label>}
    <SelectFiltro titulo="Adversário" valor={rivalAtivo} onChange={A} opcoes={rivais} todos="Todos os adversários"/>
    <SelectFiltro titulo="Competição" valor={compAtiva} onChange={K} opcoes={comps} todos="Todas as competições"/>
    <SelectFiltro titulo="Temporada" valor={anoAtivo} onChange={Y} opcoes={anos} todos="Todas as temporadas"/>
    <button className="fm27-reset" onClick={zerar}>Limpar filtros</button>
   </aside>
   <div className="fm27-match-content">
    <div className="fm27-match-title">
     <div className="fm27-match-crest">{!individual&&destaque?<img src={escudoDe(destaque)} alt=""/>: <span>★</span>}</div>
     <div><span className="fm27-eyebrow">{individual?'DESEMPENHO INDIVIDUAL':'CONFRONTOS DO CLUBE'}</span>
      <h3>{destaque||'Sem resultados'}{rivalAtivo?` × ${rivalAtivo}`:''}</h3>
      <p>{compAtiva||'Todas as competições'} · {anoAtivo||'Histórico completo'}</p></div>
    </div>
    <div className="fm27-kpis fm27-confront-kpis">
     {[[resumo.jogos,'Jogos'],[resumo.vitorias,'Vitórias'],[resumo.empates,'Empates'],[resumo.derrotas,'Derrotas'],
       [individual?resumo.gols:resumo.golsPro,individual?'Gols':'Gols pró'],
       [individual?resumo.assistencias:resumo.golsContra,individual?'Assistências':'Gols contra'],
       [`${resumo.aproveitamento}%`,'Aproveitamento']].map(([v,label])=>
       <div className="fm27-kpi" key={label}><strong>{numero(v)}</strong><span>{label}</span></div>)}
    </div>
    {individual&&<div className="fm27-extra-stats">
     <span>Defesas <b>{numero(resumo.defesas)}</b></span>
     <span>Jogos sem sofrer gols <b>{numero(resumo.cleanSheets)}</b></span>
     <span>Nota média <b>{numero(resumo.notaMedia)}</b></span>
    </div>}
    <div className="fm27-panel-heading"><div><h3>Resumo por competição</h3><p>Comparação dos registros em cada torneio</p></div></div>
    <ResumoCompeticoes linhas={resumo.porCompeticao} individual={individual}/>
    <div className="fm27-panel-heading fm27-results-heading"><div><h3>Partidas registradas</h3><p>{resumo.partidas.length} jogos com placar arquivado</p></div></div>
    <Partidas linhas={resumo.partidas} individual={individual}/>
    <p className="fm27-archive-footnote">As estatísticas distribuídas por simulação são identificadas nas partidas. Temporadas antigas sem placares disponíveis não são reconstruídas artificialmente.</p>
   </div>
  </div>
 </section>;
}
