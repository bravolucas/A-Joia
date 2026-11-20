import React,{useMemo,useState} from 'react';
import {historicoAtleta} from './mundoVivo.js';
import {resumoConquistas} from './historicoConquistas.js';
import {resumoConfrontosAtleta,partidasDoAtleta} from './historicoConfrontos.js';
import {escudoDe} from '../comum/arte.js';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import MiniaturaConquista from '../comum/MiniaturaConquista.jsx';
import {historicoTransferenciasAtleta,tipoTransferencia,valorTransferencia} from './historicoTransferencias.js';
import {setorJogador} from './forcaEquipe.js';
import {NACIONALIDADES} from '../dados/data.js';
import './PesquisaJogadores.css';

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
    <td><strong>{r.ano??'—'}</strong></td><td className="fm27-club-cell"><img src={escudoDe(r.clube)} alt=""/><LinkEntidade tipo="clube" nome={r.clube||""}>{r.clube||"Sem clube"}</LinkEntidade></td>
    <td>{n(r.jogos)}</td><td>{n(r.gols)}</td><td>{n(r.assist)}</td><td>{n(r.defesas)}</td>
    <td className="fm27-season-honours">{registros.length?registros.map((x,j)=><span key={j} className="fm27-mini-honour" title={x.categoria==='premio'?'Prêmio individual':'Título coletivo'}><MiniaturaConquista nome={x.nome} categoria={x.categoria} size={20}/> <LinkEntidade tipo={x.categoria==='premio'?'premio':'competicao'} nome={x.nome}/></span>):'—'}</td>
   </tr>;
  })}</tbody>
 </table></div>;
}
function ListaConquistas({registros,categoria}){
 const lista=categoria==='todas'?registros:registros.filter(x=>x.categoria===categoria);
 if(!lista.length)return <p className="fm27-empty">Ainda não há {categoria==='premio'?'premiações individuais':'conquistas'} documentadas neste save.</p>;
 return <div className="fm27-honours-list">{lista.map((x,i)=><article key={[x.ano,x.categoria,x.nome,x.clube,i].join('|')} className="fm27-honour">
  <span className={'fm27-honour-symbol '+(x.categoria==='premio'?'is-award':'')}><MiniaturaConquista nome={x.nome} categoria={x.categoria} size={38}/></span>
  <div><strong><LinkEntidade tipo={x.categoria==='premio'?'premio':'competicao'} nome={x.nome}/></strong><span>{x.categoria==='premio'?'Prêmio individual':'Título coletivo'} · {x.ano??'Ano não registrado'} · <LinkEntidade tipo="clube" nome={x.clube||''}/></span></div>
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
   <tbody>{adversarios.map(x=><tr key={x.nome}><td><LinkEntidade tipo="clube" nome={x.nome}/></td><td>{x.jogos}</td><td>{x.gols}</td><td>{x.assistencias}</td></tr>)}</tbody>
  </table></div>:<p className="fm27-empty">Os confrontos detalhados aparecerão quando existirem partidas registradas.</p>}
 </>;
}

const SETORES=[['','Todas'],['GOL','Goleiros'],['DEF','Defensores'],['MEI','Meio-campo'],['ATA','Atacantes']];
const ORDENS=[['relevancia','Relevância'],['gols','Gols na carreira'],['jogos','Jogos'],['titulos','Títulos'],['jovens','Mais jovens'],['nome','Nome']];
const POR_PAGINA=40;
const iniciais=nome=>String(nome||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();

/** Pesquisa de jogadores do save, no estilo da busca do FM: filtros, ordenação e ficha ao lado. */
export default function ArquivoAtletasFM({c,onConfrontos,jogadorInicial=null}){
 const u=c.tecnico?.universo||c.universo||{};
 const [busca,B]=useState(''),[clube,C]=useState(''),[id,I]=useState(jogadorInicial),[aba,A]=useState(jogadorInicial?'carreira':'resumo');
 const [categoria,Q]=useState('todas'),[setor,S]=useState(''),[situacao,SI]=useState(''),[nac,N]=useState(''),[ordem,O]=useState('relevancia'),[limite,LI]=useState(POR_PAGINA);
 const [fichaAberta,F]=useState(!!jogadorInicial);
 const todos=useMemo(()=>{
  const mapa=new Map(Object.entries(u.atletas||{}).filter(([,p])=>p&&typeof p==='object').map(([chave,p])=>[String(p.id??chave),{...p,id:String(p.id??chave)}]));
  for(const p of c.mundo?.jogadores||[]){
   const atual=mapa.get(String(p.id));
   if(p.aposentado&&!atual)continue;
   mapa.set(String(p.id),{...atual,id:String(p.id),nome:p.nome,posicao:p.posicao,nac:p.nac,idade:p.idade,ovr:p.ovr,
    clube:p.clubeNome,aposentado:!!p.aposentado,contrato:p.contrato,movimentos:p.movimentos?.length?p.movimentos:atual?.movimentos||[],
    historicoTemporadas:p.historicoTemporadas?.length?p.historicoTemporadas:atual?.historicoTemporadas||[],
    historico:atual?.historico||[]});
  }
  if(c.nome){
   const existente=mapa.get('voce')||{};
   mapa.set('voce',{
    ...existente,id:'voce',voce:true,nome:c.nome||existente.nome||'Seu jogador',
    posicao:c.posicao||existente.posicao,nac:c.nac||existente.nac,idade:c.idade,
    clube:c.clubeNome||c.clube?.nome||existente.clube,aposentado:!!c.aposentado,
    movimentos:c.transferencias?.length?c.transferencias:existente.movimentos?.length?existente.movimentos:c.movimentos||c.jogador?.movimentos||[],
    historico:existente.historico?.length?existente.historico:(c.temporadas||[]).map(t=>({ano:t.ano,clube:t.clube,jogos:t.jogos,gols:t.gols,assist:t.assist,defesas:t.defesas,cleanSheets:t.cleanSheets,titulos:(t.titulos||[]).map(x=>x.nome),porCompeticao:t.porCompeticao||[]}))
   });
  }
  // Totais de carreira calculados uma vez para filtrar e ordenar.
  return [...mapa.values()].map(p=>{const h=historicoAtleta(p);return {...p,setor:setorJogador(p),totJogos:total(h,'jogos'),totGols:total(h,'gols'),totTitulos:h.reduce((s,l)=>s+(l.titulos?.length||0),0)};});
 },[u,c.mundo,c.temporadas,c.nome,c.posicao,c.nac,c.clubeNome,c.aposentado,c.idade]);
 const clubes=useMemo(()=>[...new Set(todos.flatMap(p=>[p.clube,...historicoAtleta(p).map(x=>x.clube)]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[todos]);
 const nacs=useMemo(()=>[...new Set(todos.map(p=>p.nac).filter(Boolean))].map(id=>({id,label:NACIONALIDADES.find(x=>x.id===id)?.label||id})).sort((a,b)=>a.label.localeCompare(b.label,'pt-BR')),[todos]);
 const filtrados=useMemo(()=>{
  const q=texto(busca).trim(),porClube=clube&&clubes.includes(clube)?clube:'';
  const lista=todos.filter(p=>(!q||texto(p.nome).includes(q))&&(!setor||p.setor===setor)&&(!nac||p.nac===nac)
   &&(!situacao||(situacao==='ativos'?!p.aposentado:p.aposentado))
   &&(!porClube||p.clube===porClube||historicoAtleta(p).some(x=>x.clube===porClube)));
  const cmp={
   relevancia:(a,b)=>Number(!!b.voce)-Number(!!a.voce)||Number(!!a.aposentado)-Number(!!b.aposentado)||(b.ovr||0)-(a.ovr||0)||b.totGols-a.totGols,
   gols:(a,b)=>b.totGols-a.totGols,jogos:(a,b)=>b.totJogos-a.totJogos,titulos:(a,b)=>b.totTitulos-a.totTitulos||b.totJogos-a.totJogos,
   jovens:(a,b)=>(a.idade??99)-(b.idade??99)||(b.ovr||0)-(a.ovr||0),nome:()=>0,
  }[ordem];
  return lista.sort((a,b)=>cmp(a,b)||a.nome.localeCompare(b.nome,'pt-BR'));
 },[todos,busca,clube,clubes,setor,nac,situacao,ordem]);
 const selecionado=id?todos.find(p=>p.id===id)||null:filtrados[0]||null;
 const linhas=useMemo(()=>selecionado?historicoAtleta(selecionado):[],[selecionado]);
 const conquistas=useMemo(()=>selecionado?resumoConquistas(c,selecionado.id):{todas:[],titulos:[],premios:[]},[c,selecionado?.id]);
 const transferencias=useMemo(()=>selecionado?historicoTransferenciasAtleta(selecionado,linhas):[],[selecionado,linhas]);
 const selecionar=novo=>{I(novo);A('resumo');Q('todas');F(true);};
 const filtrosAtivos=[busca,clube,setor,situacao,nac].filter(Boolean).length;
 const limpar=()=>{B('');C('');S('');SI('');N('');LI(POR_PAGINA);};
 return <section className={'fm27-archive pj-pesquisa'+(fichaAberta?' pj-com-ficha':'')} aria-label="Arquivo de jogadores">
  <header className="pj-cabecalho">
   <div><span className="fm27-eyebrow">A JOIA / CENTRO DE DADOS / JOGADORES</span><h2>Pesquisa de jogadores</h2></div>
   <span className="fm27-counter">{filtrados.length.toLocaleString('pt-BR')} de {todos.length.toLocaleString('pt-BR')} atletas</span>
  </header>
  <div className="pj-filtros" aria-label="Filtros da pesquisa">
   <label className="pj-busca"><span>Buscar</span><input aria-label="Buscar jogador" type="search" value={busca} onChange={e=>{B(e.target.value);LI(POR_PAGINA);}} placeholder="Nome do jogador…"/></label>
   <div className="pj-chips" role="group" aria-label="Posição">{SETORES.map(([v,l])=><button key={v||'todas'} type="button" aria-pressed={setor===v} onClick={()=>{S(v);LI(POR_PAGINA);}}>{l}</button>)}</div>
   <div className="pj-selects">
    <label><span>Situação</span><select aria-label="Situação do jogador" value={situacao} onChange={e=>SI(e.target.value)}><option value="">Todos</option><option value="ativos">Em atividade</option><option value="aposentados">Aposentados</option></select></label>
    <label><span>Nacionalidade</span><select aria-label="Nacionalidade" value={nac} onChange={e=>N(e.target.value)}><option value="">Todas</option>{nacs.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
    <label><span>Clube</span><input aria-label="Filtrar pelo clube" list="pj-clubes" value={clube} onChange={e=>C(e.target.value)} placeholder="Qualquer clube"/><datalist id="pj-clubes">{clubes.map(nome=><option key={nome} value={nome}/>)}</datalist></label>
    <label><span>Ordenar por</span><select aria-label="Ordenar jogadores" value={ordem} onChange={e=>O(e.target.value)}>{ORDENS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
   </div>
   {filtrosAtivos>0&&<button type="button" className="pj-limpar" onClick={limpar}>Limpar filtros ({filtrosAtivos})</button>}
  </div>
  <div className="pj-corpo">
   <div className="pj-resultados" aria-label="Resultados da pesquisa">
    <div className="pj-linha pj-titulos" aria-hidden="true"><span>Jogador</span><span>Clube</span><span>Idade</span><span>J</span><span>G</span><span>Tít.</span></div>
    <div className="mv-atletas">{filtrados.slice(0,limite).map(p=><button key={p.id} type="button" data-atleta={String(p.id)} className={'pj-linha'+(selecionado?.id===p.id?' is-selected':'')+(p.voce?' pj-voce':'')} onClick={()=>selecionar(p.id)}>
     <span className="pj-jogador"><i aria-hidden="true">{iniciais(p.nome)}</i><span><strong>{p.nome||'Sem nome'}{p.voce?' · Você':''}</strong><small>{p.posicao||'—'} · {NACIONALIDADES.find(x=>x.id===p.nac)?.label||p.nac||'—'}{p.aposentado?' · Aposentado':Number.isFinite(p.ovr)?` · OVR ${p.ovr}`:''}</small></span></span>
     <span className="pj-clube">{p.clube?<><img src={escudoDe(p.clube)} alt=""/>{p.clube}</>:'Livre'}</span>
     <span data-rotulo="Idade">{p.aposentado?'—':p.idade??'—'}</span><span data-rotulo="Jogos">{n(p.totJogos)}</span><span data-rotulo="Gols">{n(p.totGols)}</span><span data-rotulo="Títulos">{n(p.totTitulos)}</span>
    </button>)}</div>
    {filtrados.length>limite&&<button type="button" className="pj-mais" onClick={()=>LI(x=>x+POR_PAGINA)}>Mostrar mais {Math.min(POR_PAGINA,filtrados.length-limite)} de {(filtrados.length-limite).toLocaleString('pt-BR')}</button>}
    {!filtrados.length&&<p className="fm27-list-hint">Nenhum jogador encontrado com esses filtros.</p>}
   </div>
   <main className="fm27-player-main pj-ficha">
    {fichaAberta&&<button type="button" className="pj-voltar" onClick={()=>F(false)}>← Voltar aos resultados</button>}
    {!selecionado?<div className="fm27-empty">Selecione um jogador para abrir a ficha.</div>:<article className="fm27-player-sheet" aria-label={`Ficha de ${selecionado.nome}`}>
     <div className="fm27-player-hero">
      <div className="fm27-identity-symbol"><img src={escudoDe(selecionado.clube)} alt="" /></div>
      <div className="fm27-player-identity">
       <span className="fm27-eyebrow">FICHA DE CARREIRA {selecionado.voce?' / SEU JOGADOR':''}</span>
       <h3>{selecionado.nome}</h3><p>{selecionado.posicao||'Jogador'} · <LinkEntidade tipo="clube" nome={selecionado.clube||""}>{selecionado.clube||"Sem clube"}</LinkEntidade> · {NACIONALIDADES.find(x=>x.id===selecionado.nac)?.label||selecionado.nac||'Nacionalidade não informada'}{!selecionado.aposentado&&Number.isFinite(selecionado.idade)?` · ${selecionado.idade} anos`:''}{Number.isFinite(selecionado.ovr)&&!selecionado.aposentado?` · OVR ${selecionado.ovr}`:''}</p>
      </div>
      <span className={'fm27-player-state '+(selecionado.aposentado?'is-retired':'')}>{selecionado.aposentado?'Aposentado':'Em atividade'}</span>
     </div>
     {Number.isInteger(selecionado.contrato)&&!selecionado.aposentado&&
      <section className="fm27-contract-strip" aria-label="Contrato atual">
       <p>Contrato: {selecionado.clube?`${selecionado.contrato} temporada(s)`:'Livre'}</p>
      </section>}
     <nav className="fm27-subtabs" aria-label="Seções do jogador">
      {[['resumo','Visão geral'],['carreira','Carreira'],['transferencias','Transferências'],['conquistas','Conquistas'],['confrontos','Adversários']].map(([key,label])=>
       <button type="button" key={key} aria-current={aba===key?'page':undefined} onClick={()=>A(key)}>{label}</button>)}
     </nav>
     <div className="fm27-player-body">
      {aba==='resumo'&&<>
       <NumerosCarreira linhas={linhas} conquistas={conquistas}/>
       <div className="fm27-dashboard-columns">
        <article className="fm27-panel"><div className="fm27-panel-heading"><div><h3>Trajetória</h3><p>Últimas temporadas registradas</p></div></div>
         {linhas.length?<div className="fm27-timeline">{[...linhas].reverse().slice(0,7).map((x,i)=>
          <div className="fm27-timeline-row" key={i}><time>{x.ano}</time><img src={escudoDe(x.clube)} alt=""/><span><strong><LinkEntidade tipo="clube" nome={x.clube}/></strong><small>{n(x.jogos)} jogos · {n(x.gols)} gols · {n(x.assist)} assistências</small></span></div>)}</div>
          :<p className="fm27-empty">Sem histórico de temporadas concluídas.</p>}
        </article>
        <article className="fm27-panel"><div className="fm27-panel-heading"><div><h3>Vitrine de conquistas</h3><p>{conquistas.titulos.length} títulos · {conquistas.premios.length} prêmios individuais</p></div>
           <button className="fm27-text-button" onClick={()=>A('conquistas')}>Ver todas</button></div>
          <ListaConquistas registros={conquistas.todas.slice(0,5)} categoria="todas"/>
        </article>
       </div>
      </>}
      {aba==='carreira'&&<><div className="fm27-panel-heading"><div><h3>Carreira por temporada</h3><p>Dados registrados no save, sem completar anos ausentes artificialmente.</p></div></div><TabelaCarreira linhas={linhas} conquistas={conquistas}/></>}
      {aba==='transferencias'&&<>
       <div className="fm27-panel-heading"><div><h3>Histórico de transferências</h3><p>Origem, destino e valor de cada movimentação registrada. Sem estimar valores ausentes.</p></div></div>
       {transferencias.length?<div className="fm27-data-scroll"><table className="fm27-data fm27-transfers">
        <thead><tr><th>Ano</th><th>Operação</th><th>Clube de origem</th><th>Clube de destino</th><th>Valor</th></tr></thead>
        <tbody>{transferencias.map((m,i)=><tr key={[m.ano,m.tipo,m.de,m.para,i].join('|')}>
         <td>{m.ano??'—'}</td><td>{tipoTransferencia(m.tipo)}{m.fonte==='temporadas'&&<small className="fm27-transfer-note">Modalidade não registrada</small>}</td>
         <td><LinkEntidade tipo="clube" nome={m.de||''}>{m.de||'Sem clube'}</LinkEntidade></td>
         <td><LinkEntidade tipo="clube" nome={m.para||''}>{m.para||'Sem clube'}</LinkEntidade></td>
         <td><strong>{valorTransferencia(m.valor,m.moeda)}</strong></td>
        </tr>)}</tbody>
       </table></div>:<p className="fm27-empty">Não há transferências registradas para este atleta. Mudanças de clube só aparecem quando comprovadas pelo histórico.</p>}
      </>}
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
