import React,{useMemo,useState} from 'react';
import {partidasHistoricas,partidasDoAtleta,resumoConfrontosClubes,resumoConfrontosAtleta} from './historicoConfrontos.js';

const valor=n=>Number.isFinite(n)?n.toLocaleString('pt-BR'):typeof n==='string'?n:'—';
const resumoVazio='Nenhuma partida individual disponível para estes filtros. As estatísticas só aparecem quando há placares registrados.';

/** Consulta o mesmo arquivo de resultados por clube, rival, competição e ano. */
export default function HistoricoConfrontos({c}){
 const [modo,M]=useState('clubes'),[clube,C]=useState(''),[atleta,P]=useState('voce'),[buscaAtleta,BA]=useState(''),[clubeAtuacao,CA]=useState(''),[local,L]=useState(''),[adversario,A]=useState(''),[competicao,K]=useState(''),[ano,Y]=useState('');
 const arquivo=useMemo(()=>partidasHistoricas(c),[c.universo,c.tecnico?.universo]);
 const clubes=useMemo(()=>[...new Set(arquivo.flatMap(j=>[j.casa,j.fora]))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[arquivo]);
 const preferido=c.tecnico?.clube||c.clubeNome||c.clube?.nome||'';
 const clubeAtual=clubes.includes(clube)?clube:clubes.includes(preferido)?preferido:clubes[0]||'';
 const u=c.tecnico?.universo||c.universo||{};
 const atletas=useMemo(()=>{
  const disponiveis=new Set(Object.keys(u.partidasAtletas||{}));
  if((c.temporadas||[]).some(t=>t.jogosLista?.length||t.partidasCompeticoes?.length))disponiveis.add('voce');
  for(const [id,p] of Object.entries(u.atletas||{}))
    if(p.historico?.some(t=>Array.isArray(t)?t[10]?.length:t.porCompeticao?.length))disponiveis.add(id);
  return [...disponiveis].map(id=>({id,nome:id==='voce'?(c.nome||u.atletas?.voce?.nome||'Seu jogador'):(u.atletas?.[id]?.nome||'Jogador '+id)}))
    .sort((a,b)=>(b.id==='voce')-(a.id==='voce')||a.nome.localeCompare(b.nome,'pt-BR'));
 },[u,c.temporadas,c.nome]);
 const atletasFiltrados=atletas.filter(p=>p.id===atleta||!buscaAtleta||p.nome.toLocaleLowerCase('pt-BR').includes(buscaAtleta.toLocaleLowerCase('pt-BR'))).slice(0,80);
 const atletaAtual=atletas.some(p=>p.id===atleta)?atleta:atletas[0]?.id||'voce';
 const individuais=useMemo(()=>partidasDoAtleta(c,atletaAtual),[c,atletaAtual]);
 const clubesAtuacao=[...new Set(individuais.map(j=>j.clube).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const clubeDefendido=clubesAtuacao.includes(clubeAtuacao)?clubeAtuacao:'';
 const universoPartidas=modo==='clubes'?arquivo.filter(j=>[j.casa,j.fora].includes(clubeAtual)):individuais;
 const adversarios=[...new Set(universoPartidas.map(j=>modo==='clubes'?(j.casa===clubeAtual?j.fora:j.casa):j.adversario).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const competicoes=[...new Set(universoPartidas.map(j=>j.competicao).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const anos=[...new Set(universoPartidas.map(j=>j.ano).filter(Number.isFinite))].sort((a,b)=>b-a);
 const rivalAtivo=adversarios.includes(adversario)?adversario:'',compAtiva=competicoes.includes(competicao)?competicao:'',anoAtivo=anos.some(n=>String(n)===ano)?ano:'';
 const opcoes={adversario:rivalAtivo,competicao:compAtiva,ano:anoAtivo,clube:clubeDefendido,local};
 const resultado=modo==='clubes'?resumoConfrontosClubes(c,{...opcoes,clube:clubeAtual}):resumoConfrontosAtleta(c,{...opcoes,jogadorId:atletaAtual});
 const trocarModo=x=>{M(x);A('');K('');Y('');CA('');L('');};
 const limpar=()=>{A('');K('');Y('');CA('');L('');};
 return <section className="mv-painel" aria-label="Histórico de confrontos">
  <span className="hf-eyebrow">MEMÓRIA DE CADA PARTIDA</span>
  <h2>Histórico de confrontos</h2>
  <p className="hf-nota">Consulte resultados registrados no universo desta carreira. Alterações de clube, treinadores e temporadas não apagam o retrospecto.</p>
  <div className="hf-filtros">
   <label>Tipo de consulta<select aria-label="Tipo de consulta" value={modo} onChange={e=>trocarModo(e.target.value)}>
    <option value="clubes">Clube × Clube</option><option value="jogadores">Jogador × Clube</option>
   </select></label>
   {modo==='clubes'?<label>Clube<select aria-label="Clube do confronto" value={clubeAtual} onChange={e=>{C(e.target.value);limpar();}}>{clubes.map(x=><option key={x}>{x}</option>)}</select></label>
   :<><label>Buscar jogador<input type="search" aria-label="Buscar jogador do confronto" value={buscaAtleta} onChange={e=>BA(e.target.value)} placeholder="Digite o nome do jogador…"/></label><label>Jogador<select aria-label="Jogador do confronto" value={atletaAtual} onChange={e=>{P(e.target.value);limpar();}}>{atletasFiltrados.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select></label></>}
   {modo==='jogadores'&&<>
    <label>Atuando pelo clube<select aria-label="Clube defendido pelo jogador" value={clubeDefendido} onChange={e=>CA(e.target.value)}>
     <option value="">Todos os clubes</option>{clubesAtuacao.map(x=><option key={x}>{x}</option>)}
    </select></label>
    <label>Local da partida<select aria-label="Local do confronto" value={local} onChange={e=>L(e.target.value)}>
     <option value="">Casa e fora</option><option value="casa">Em casa</option><option value="fora">Fora de casa</option>
    </select></label>
   </>}
   <label>Adversário<select aria-label="Adversário do confronto" value={rivalAtivo} onChange={e=>A(e.target.value)}>
    <option value="">Todos os adversários</option>{adversarios.map(x=><option key={x}>{x}</option>)}
   </select></label>
   <label>Competição<select aria-label="Competição do confronto" value={compAtiva} onChange={e=>K(e.target.value)}>
    <option value="">Todas as competições</option>{competicoes.map(x=><option key={x}>{x}</option>)}
   </select></label>
   <label>Temporada<select aria-label="Ano do confronto" value={anoAtivo} onChange={e=>Y(e.target.value)}>
    <option value="">Toda a carreira</option>{anos.map(x=><option key={x} value={String(x)}>{x}</option>)}
   </select></label>
  </div>
  {modo==='clubes'?<div className="hf-numeros" aria-label="Resumo entre clubes">
   {[[resultado.jogos,'Jogos'],[resultado.vitorias,'Vitórias'],[resultado.empates,'Empates'],[resultado.derrotas,'Derrotas'],[resultado.golsPro,'Gols marcados'],[resultado.golsContra,'Gols sofridos'],[resultado.aproveitamento+'%','Aproveitamento']].map(([n,label])=><article key={label}><strong>{valor(n)}</strong><span>{label}</span></article>)}
  </div>:<div className="hf-numeros" aria-label="Resumo individual">
   {[[resultado.jogos,'Jogos'],[resultado.vitorias,'Vitórias'],[resultado.empates,'Empates'],[resultado.derrotas,'Derrotas'],[resultado.gols,'Gols'],[resultado.assistencias,'Assistências'],[resultado.defesas,'Defesas'],[resultado.cleanSheets,'Jogos sem sofrer gols'],[resultado.aproveitamento+'%','Aproveitamento'],[resultado.notaMedia,'Nota média']].map(([n,label])=><article key={label}><strong>{valor(n)}</strong><span>{label}</span></article>)}
  </div>}
  {resultado.porCompeticao.length>0&&<div className="hf-tabela-scroll"><table className="hf-tabela">
   <caption>Retrospecto por competição</caption><thead><tr><th>Competição</th><th>Jogos</th>{modo==='clubes'?<><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th></>:<><th>V</th><th>E</th><th>D</th><th>Gols</th><th>Ast.</th><th>Defesas</th><th>SG</th></>}</tr></thead>
   <tbody>{resultado.porCompeticao.map(x=><tr key={x.competicao}><th>{x.competicao}</th><td>{x.jogos}</td>{modo==='clubes'?<><td>{x.vitorias}</td><td>{x.empates}</td><td>{x.derrotas}</td><td>{x.golsPro}</td><td>{x.golsContra}</td></>:<><td>{x.vitorias}</td><td>{x.empates}</td><td>{x.derrotas}</td><td>{x.gols}</td><td>{x.assistencias}</td><td>{x.defesas}</td><td>{x.cleanSheets}</td></>}</tr>)}</tbody>
  </table></div>}
  <h3>Partidas registradas</h3>
  {resultado.partidas.length?<div className="hf-tabela-scroll"><table className="hf-tabela">
   <thead><tr><th>Ano</th><th>Competição</th><th>Confronto</th><th>Placar</th>{modo==='jogadores'&&<><th>Gols</th><th>Ast.</th><th>Defesas</th><th>Nota</th></>}</tr></thead>
   <tbody>{resultado.partidas.map(j=><tr key={j.id}><td>{j.ano}</td><td>{j.competicao}{j.fase&&<small>{j.fase}</small>}{j.origem==='distribuicao-simulada'&&<small>Distribuição simulada</small>}</td><th>{j.casa} × {j.fora}</th><td>{j.golsCasa} × {j.golsFora}</td>{modo==='jogadores'&&<><td>{valor(j.gols)}</td><td>{valor(j.assistencias)}</td><td>{valor(j.defesas)}</td><td>{valor(j.nota)}</td></>}</tr>)}</tbody>
  </table></div>:<p className="hf-nota">{modo==='jogadores'?resumoVazio:'Ainda não há resultados registrados para estes filtros.'}</p>}
  <p className="hf-nota">Dados detalhados são preservados como registrados. No Modo Rápido, novas temporadas podem distribuir os totais simulados entre partidas, identificados como distribuição simulada; jogos antigos não são inventados. Os dados acompanham este save.</p>
 </section>;
}
