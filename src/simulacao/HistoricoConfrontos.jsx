import React,{useMemo,useState} from 'react';
import {partidasHistoricas,partidasDoAtleta,resumoConfrontosClubes,resumoConfrontosAtleta} from './historicoConfrontos.js';
import {rivaisClassicos} from './classicos.js';
import {escudoDe} from '../comum/arte.js';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import './Confrontos.css';

const numero=n=>Number.isFinite(n)?n.toLocaleString('pt-BR'):typeof n==='string'?n:'—';
const ordenar=(lista)=>[...new Set(lista.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
const pct=(v,t)=>t?Math.round(100*v/t):0;
/** Gols do lado analisado e do adversário numa partida. */
const placarDe=(j,lado)=>{const casa=j.casa===lado;return {pro:casa?j.golsCasa:j.golsFora,contra:casa?j.golsFora:j.golsCasa};};
const resultadoDe=(j,lado)=>{const {pro,contra}=placarDe(j,lado);return pro>contra?'V':pro<contra?'D':'E';};

function BarraResultados({v,e,d}){
 const t=v+e+d;
 return <div className="cf-barra" aria-label={`${v} vitórias, ${e} empates e ${d} derrotas`}>
  <div className="cf-barra-trilho">{t>0?<><i className="cf-v" style={{flexGrow:v}}/><i className="cf-e" style={{flexGrow:e}}/><i className="cf-d" style={{flexGrow:d}}/></>:<i className="cf-vazio"/>}</div>
  <div className="cf-barra-legenda"><span><b>{v}</b> vitórias · {pct(v,t)}%</span><span><b>{e}</b> empates · {pct(e,t)}%</span><span><b>{d}</b> derrotas · {pct(d,t)}%</span></div>
 </div>;
}
function Forma({partidas,lado,individual}){
 const ultimos=partidas.slice(0,5);
 if(!ultimos.length)return null;
 return <div className="cf-forma" aria-label="Últimos jogos">{ultimos.map(j=>{const r=resultadoDe(j,individual?j.clube:lado);return <span key={j.id} className={`cf-forma-${r}`} title={`${j.ano} · ${j.casa} ${j.golsCasa}×${j.golsFora} ${j.fora}`}>{r}</span>;})}</div>;
}
function Destaques({partidas,lado}){
 if(!partidas.length)return null;
 const com=partidas.map(j=>({j,...placarDe(j,lado)}));
 const maior=com.filter(x=>x.pro>x.contra).sort((a,b)=>(b.pro-b.contra)-(a.pro-a.contra)||b.pro-a.pro)[0];
 const pior=com.filter(x=>x.pro<x.contra).sort((a,b)=>(b.contra-b.pro)-(a.contra-a.pro)||b.contra-a.contra)[0];
 const gols=com.sort((a,b)=>(b.pro+b.contra)-(a.pro+a.contra))[0];
 const cartao=(titulo,x)=>x&&<article className="cf-destaque"><small>{titulo}</small><strong>{x.j.casa} {x.j.golsCasa} × {x.j.golsFora} {x.j.fora}</strong><span>{x.j.ano} · {x.j.competicao}</span></article>;
 return <div className="cf-destaques">{cartao('Maior vitória',maior)}{cartao('Maior derrota',pior)}{cartao('Jogo com mais gols',gols)}</div>;
}
function Partidas({linhas,lado,individual}){
 const [limite,L]=useState(20);
 if(!linhas.length)return <p className="fm27-empty">Nenhuma partida disponível para os filtros escolhidos. Dados ausentes não serão inventados.</p>;
 return <><ol className="cf-partidas" aria-label="Resultados dos confrontos">{linhas.slice(0,limite).map(j=>{const ref=individual?j.clube:lado,r=resultadoDe(j,ref);return <li key={j.id} className={`cf-r-${r}`}>
  <span className="cf-quando"><b>{j.ano}</b><small><LinkEntidade tipo="competicao" nome={j.competicao}/>{j.fase||typeof j.rodada==='number'?` · ${typeof j.rodada==='number'?`Rodada ${j.rodada}`:j.fase||j.rodada}`:''}</small></span>
  <span className="cf-jogo"><span className="cf-time"><LinkEntidade tipo="clube" nome={j.casa}/><img src={escudoDe(j.casa)} alt=""/></span><b className="cf-placar">{j.golsCasa} – {j.golsFora}</b><span className="cf-time cf-fora"><img src={escudoDe(j.fora)} alt=""/><LinkEntidade tipo="clube" nome={j.fora}/></span></span>
  {individual&&<span className="cf-individual">{j.gols?`⚽ ${j.gols}`:''}{j.assistencias?` 🎯 ${j.assistencias}`:''}{Number.isFinite(j.nota)?` · nota ${j.nota}`:''}</span>}
 </li>;})}</ol>
 {linhas.length>limite&&<button type="button" className="cf-mais" onClick={()=>L(x=>x+20)}>Mostrar mais partidas ({linhas.length-limite})</button>}</>;
}
function ResumoCompeticoes({linhas,individual}){
 if(!linhas.length)return null;
 return <div className="fm27-data-scroll"><table className="fm27-data" aria-label="Retrospecto por competição">
  <thead><tr><th>Competição</th><th>J</th><th>V</th><th>E</th><th>D</th>{individual?<><th>Gols</th><th>Assist.</th></>:<><th>GP</th><th>GC</th></>}</tr></thead>
  <tbody>{linhas.map(x=><tr key={x.competicao}><td><LinkEntidade tipo="competicao" nome={x.competicao}/></td><td>{x.jogos}</td><td>{x.vitorias}</td><td>{x.empates}</td><td>{x.derrotas}</td>
   {individual?<><td>{x.gols}</td><td>{x.assistencias}</td></>:<><td>{x.golsPro}</td><td>{x.golsContra}</td></>}</tr>)}</tbody>
 </table></div>;
}
/** Rivais mais enfrentados (clássicos primeiro), para abrir um cara a cara com um toque. */
function Rivais({partidas,lado,individual,onEscolher}){
 const lista=useMemo(()=>{
  const mapa=new Map(),classicos=new Set(individual?[]:rivaisClassicos(lado));
  for(const j of partidas){
   const rival=individual?j.adversario:(j.casa===lado?j.fora:j.casa),ref=individual?j.clube:lado,r=resultadoDe(j,ref);
   const x=mapa.get(rival)||{nome:rival,jogos:0,V:0,E:0,D:0,gols:0,classico:classicos.has(rival)};
   x.jogos++;x[r]++;x.gols+=Number(j.gols)||0;mapa.set(rival,x);
  }
  return [...mapa.values()].sort((a,b)=>b.classico-a.classico||b.jogos-a.jogos).slice(0,10);
 },[partidas,lado,individual]);
 if(!lista.length)return null;
 return <section className="cf-rivais" aria-label="Rivais mais enfrentados"><h4>{individual?'Adversários mais enfrentados':'Rivais mais enfrentados'}</h4>
  <ul>{lista.map(x=><li key={x.nome}><button type="button" onClick={()=>onEscolher(x.nome)}>
   <img src={escudoDe(x.nome)} alt=""/><span><strong>{x.nome}</strong>{x.classico&&<em>Clássico</em>}<small>{x.jogos} jogos · {x.V}V {x.E}E {x.D}D{individual&&x.gols?` · ${x.gols} gols`:''}</small></span>
   <i className="cf-mini" aria-hidden="true"><b className="cf-v" style={{flexGrow:x.V}}/><b className="cf-e" style={{flexGrow:x.E}}/><b className="cf-d" style={{flexGrow:x.D}}/></i>
  </button></li>)}</ul></section>;
}

/** Confrontos no formato cara a cara: escolha os dois lados e veja o retrospecto completo. */
export default function HistoricoConfrontos({c,jogadorInicial=null}){
 const [modo,M]=useState(jogadorInicial?'jogadores':'clubes');
 const [clube,C]=useState(''),[atleta,P]=useState(jogadorInicial||'voce');
 const [buscaAtleta,BA]=useState(''),[clubeAtuacao,CA]=useState('');
 const [local,L]=useState(''),[adversario,A]=useState(''),[competicao,K]=useState(''),[ano,Y]=useState(''),[aba,T]=useState('partidas');
 const u=c.tecnico?.universo||c.universo||{};
 const arquivo=useMemo(()=>partidasHistoricas(c),[c]);
 const clubes=useMemo(()=>ordenar(arquivo.flatMap(j=>[j.casa,j.fora])),[arquivo]);
 const preferido=c.tecnico?.clube||c.clubeNome||c.clube?.nome||'';
 const clubeAtual=clubes.includes(clube)?clube:clubes.includes(preferido)?preferido:clubes[0]||'';
 const atletas=useMemo(()=>{
  const ids=new Set(Object.keys(u.partidasAtletas||{}));
  if((c.temporadas||[]).length)ids.add('voce');
  for(const id of Object.keys(u.atletas||{}))ids.add(id);
  return [...ids].map(id=>({id,nome:id==='voce'?(c.nome||u.atletas?.voce?.nome||'Seu jogador'):(u.atletas?.[id]?.nome||'Jogador '+id)}))
   .sort((a,b)=>(b.id==='voce')-(a.id==='voce')||a.nome.localeCompare(b.nome,'pt-BR'));
 },[u,c.temporadas,c.nome]);
 const jogadoresFiltrados=atletas.filter(p=>p.id===atleta||!buscaAtleta||p.nome.toLocaleLowerCase('pt-BR').includes(buscaAtleta.toLocaleLowerCase('pt-BR'))).slice(0,100);
 const atletaAtual=atletas.some(p=>p.id===atleta)?atleta:atletas[0]?.id||'voce';
 const nomeAtleta=atletas.find(p=>p.id===atletaAtual)?.nome||'Jogador';
 const individual=modo==='jogadores';
 const individuais=useMemo(()=>individual?partidasDoAtleta(c,atletaAtual):[],[c,individual,atletaAtual]);
 const clubesAtuacao=useMemo(()=>ordenar(individuais.map(j=>j.clube)),[individuais]);
 const clubeDefendido=clubesAtuacao.includes(clubeAtuacao)?clubeAtuacao:'';
 const universo=individual?individuais.filter(j=>j.participou!==false):arquivo.filter(j=>j.casa===clubeAtual||j.fora===clubeAtual);
 const rivais=ordenar(universo.map(j=>individual?j.adversario:(j.casa===clubeAtual?j.fora:j.casa)));
 const comps=ordenar(universo.map(j=>j.competicao));
 const anos=[...new Set(universo.map(j=>j.ano).filter(Number.isFinite))].sort((a,b)=>b-a).map(String);
 const rivalAtivo=rivais.includes(adversario)?adversario:'';
 const compAtiva=comps.includes(competicao)?competicao:'';
 const anoAtivo=anos.includes(ano)?ano:'';
 const filtros={adversario:rivalAtivo,competicao:compAtiva,ano:anoAtivo};
 const resumo=individual?resumoConfrontosAtleta(c,{...filtros,jogadorId:atletaAtual,clube:clubeDefendido,local})
  :resumoConfrontosClubes(c,{...filtros,clube:clubeAtual});
 // Rivais da lista: mesmos filtros de competição e temporada, sem o adversário.
 const semRival=individual?resumoConfrontosAtleta(c,{...filtros,adversario:'',jogadorId:atletaAtual,clube:clubeDefendido,local}).partidas
  :resumoConfrontosClubes(c,{...filtros,adversario:'',clube:clubeAtual}).partidas;
 const zerar=()=>{A('');K('');Y('');CA('');L('');};
 const mudarModo=valor=>{M(valor);zerar();};
 const lado=individual?nomeAtleta:clubeAtual;
 const ativos=[rivalAtivo,compAtiva,anoAtivo,clubeDefendido,local].filter(Boolean).length;
 return <section className="fm27-confronts cf-confrontos" aria-label="Histórico de confrontos">
  <header className="cf-cabecalho"><div><span className="fm27-eyebrow">A JOIA / CENTRO DE DADOS / CONFRONTOS</span><h2>Cara a cara</h2></div>
   <nav className="fm27-segmented fm27-confront-switch" aria-label="Tipo de confronto">
    <button aria-pressed={!individual} onClick={()=>mudarModo('clubes')}>Clube × Clube</button>
    <button aria-pressed={individual} onClick={()=>mudarModo('jogadores')}>Jogador × Clube</button>
   </nav></header>
  <div className="cf-duelo" aria-label="Escolha dos lados">
   <div className="cf-lado">
    {individual?<><span className="cf-avatar" aria-hidden="true">{nomeAtleta.slice(0,1)}</span>
     <input type="search" aria-label="Buscar jogador do confronto" value={buscaAtleta} onChange={e=>BA(e.target.value)} placeholder="Buscar jogador…"/>
     <select aria-label="Jogador do confronto" value={atletaAtual} onChange={e=>{P(e.target.value);zerar();}}>{jogadoresFiltrados.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></>
    :<><img src={escudoDe(clubeAtual)} alt=""/><select aria-label="Clube" value={clubeAtual} onChange={e=>{C(e.target.value);zerar();}}>{clubes.map(x=><option key={x}>{x}</option>)}</select></>}
   </div>
   <b className="cf-vs">×</b>
   <div className="cf-lado">
    {rivalAtivo?<img src={escudoDe(rivalAtivo)} alt=""/>:<span className="cf-avatar" aria-hidden="true">?</span>}
    <select aria-label="Adversário" value={rivalAtivo} onChange={e=>A(e.target.value)}><option value="">Todos os adversários</option>{rivais.map(x=><option key={x}>{x}</option>)}</select>
   </div>
  </div>
  <div className="cf-filtros" aria-label="Filtros do confronto">
   <label><span>Competição</span><select aria-label="Competição" value={compAtiva} onChange={e=>K(e.target.value)}><option value="">Todas</option>{comps.map(x=><option key={x}>{x}</option>)}</select></label>
   <label><span>Temporada</span><select aria-label="Temporada" value={anoAtivo} onChange={e=>Y(e.target.value)}><option value="">Todas</option>{anos.map(x=><option key={x}>{x}</option>)}</select></label>
   {individual&&<><label><span>Clube defendido</span><select aria-label="Clube defendido" value={clubeDefendido} onChange={e=>CA(e.target.value)}><option value="">Todos</option>{clubesAtuacao.map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span>Mando</span><select aria-label="Mando de campo" value={local} onChange={e=>L(e.target.value)}><option value="">Casa e fora</option><option value="casa">Em casa</option><option value="fora">Fora</option></select></label></>}
   {ativos>0&&<button className="fm27-reset" onClick={zerar}>Limpar ({ativos})</button>}
  </div>
  <div className="cf-placar-geral">
   <div className="cf-titulo"><h3>{lado||'Sem resultados'}{rivalAtivo?` × ${rivalAtivo}`:''}</h3><p>{compAtiva||'Todas as competições'} · {anoAtivo||'Histórico completo'}</p><Forma partidas={resumo.partidas} lado={clubeAtual} individual={individual}/></div>
   <div className="cf-numeros">
    {[[resumo.jogos,'Jogos'],[individual?resumo.gols:resumo.golsPro,individual?'Gols':'Gols pró'],[individual?resumo.assistencias:resumo.golsContra,individual?'Assistências':'Gols contra'],[`${resumo.aproveitamento}%`,'Aproveitamento'],...(individual&&resumo.notaMedia!=null?[[resumo.notaMedia,'Nota média']]:[])].map(([v,l])=>
     <div key={l}><strong>{numero(v)}</strong><span>{l}</span></div>)}
   </div>
   <BarraResultados v={resumo.vitorias} e={resumo.empates} d={resumo.derrotas}/>
  </div>
  {!individual&&<Destaques partidas={resumo.partidas} lado={clubeAtual}/>}
  <div className="cf-colunas">
   <div className="cf-principal">
    <nav className="cf-abas" aria-label="Detalhes do confronto">{[['partidas',`Partidas (${resumo.partidas.length})`],['competicoes','Por competição']].map(([k,l])=><button key={k} type="button" aria-pressed={aba===k} onClick={()=>T(k)}>{l}</button>)}</nav>
    {aba==='partidas'?<Partidas key={[lado,rivalAtivo,compAtiva,anoAtivo].join('|')} linhas={resumo.partidas} lado={clubeAtual} individual={individual}/>:<ResumoCompeticoes linhas={resumo.porCompeticao} individual={individual}/>}
   </div>
   {!rivalAtivo&&<Rivais partidas={semRival} lado={clubeAtual} individual={individual} onEscolher={A}/>}
  </div>
  <p className="fm27-archive-footnote">Estatísticas distribuídas por simulação são identificadas nas partidas. Temporadas antigas sem placares não são reconstruídas.</p>
 </section>;
}
