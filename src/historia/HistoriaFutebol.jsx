import {clubesComHistoricoEstadual,feitoEstadualHistoricoValido} from '../dados/estaduaisHistoricos.js';
import {CLUBES_REGIONAIS_EXTRAS} from '../competicoes/estaduaisRapidos.js';
import {EvolucaoClube,EdicoesCompeticao,NoticiasMundo} from '../simulacao/MundoVivo.jsx';
import ArquivoAtletasFM from '../simulacao/ArquivoAtletasFM.jsx';
import HistoricoConfrontos from '../simulacao/HistoricoConfrontos.jsx';
import {competicoesDisponiveis,galeriaCompeticao} from './competicoesHistoricas.js';
import {BotaoMuseuPessoal} from '../museu/MuseuPessoal.jsx';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {CLUBES,NACIONALIDADES} from '../dados/data.js';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import {escudoDe,bandeiraDe} from '../comum/arte.js';
import {bloquearRolagem} from '../comum/bloqueioRolagem.js';
import {galeriaClube,estatisticasHistoricas,lideresObservados} from './historiaFutebol.js';
import './HistoriaFutebol.css';
import './ArquivoFM.css';
import LinkEntidade from './LinkEntidade.jsx';
import HistoricoPremios from './HistoricoPremios.jsx';
import RecordesFutebol from './RecordesFutebol.jsx';
import GaleriaSelecoes from './GaleriaSelecoes.jsx';
import PalcoIdolos from './PalcoIdolos.jsx';
import RankingsMundo from './RankingsMundo.jsx';
import {nomeSelecaoHistorica} from '../dados/selecoesHistoricas.js';
import {EVENTO_ENTIDADE,empilharPagina,paginaEntidade} from './navegacaoEntidades.js';
import {historicoProfissionalTecnico,titulosConquistadosTecnico} from '../treinador/tecnico.js';


export function GaleriaClube({c,nome,temporadas,onCompeticao}){
 const g=useMemo(()=>galeriaClube(c,nome,temporadas),[c,nome,temporadas]);
 return <section className="hf-galeria" aria-label={`Galeria do ${nome}`}>
  <header className="hf-identidade"><img src={escudoDe(nome)} alt=""/><div><span className="hf-eyebrow">A HISTÓRIA DA CAMISA</span><h2>{nome}</h2><p>{g.total} títulos no acervo · {g.conhecido?'Base histórica cadastrada':'Base histórica estimada'}</p></div></header>
  <p className="hf-nota">Acervo inicial do jogo + conquistas desta carreira. Cada taça da simulação aparece com seu ano.</p>
  {g.primeiros.length>0&&<div className="hf-primeiros">{g.primeiros.map(t=><p key={t.nome}><b>Uma página inédita</b><span>Primeira {t.nome} · {t.ano}{t.suas.includes(t.ano)?' · Você fez parte dessa conquista.':''}</span></p>)}</div>}
  <div className="hf-vitrine">{g.tacas.filter(t=>t.total>0).map(t=><article key={t.nome} className="hf-taca"><TacaCompeticao nome={t.nome} tipo={t.tipo} size={76}/><strong>{t.total}×</strong><h3>{onCompeticao?<button className="hf-competicao-link" title="Ver campeões desta competição" onClick={()=>onCompeticao(t.nome)}>{t.nome}</button>:<BotaoHistoria className="hf-competicao-link" c={c} temporadas={temporadas} competicao={t.nome}>{t.nome}</BotaoHistoria>}</h3><small>{t.inicial} no acervo inicial{t.anos.length?` · +${t.anos.length} nesta carreira`:''}{t.legado?` · ${t.legado} do save anterior`:''}</small>{t.anos.length>0&&<p>{[...t.anos].sort((a,b)=>a-b).join(' · ')}</p>}{t.anosHistoricos?.length>0&&<details className="hf-historico-estadual"><summary>Títulos até 2024 · {t.inicial}</summary><p>{[...new Map(t.anosHistoricos.map(ano=>[ano,t.anosHistoricos.filter(a=>a===ano).length]))].map(([ano,q])=>`${ano}${q>1?` (${q} títulos)`:''}`).join(' · ')}</p>{t.fontes?.map((fonte,i)=><a key={fonte} href={fonte} target="_blank" rel="noreferrer">Fonte {i+1}</a>)}</details>}</article>)}{g.total===0&&<p className="hf-vazio">Este clube ainda não possui títulos registrados no acervo ou nesta carreira.</p>}</div>
  <EvolucaoClube c={c} nome={nome}/><PalcoIdolos c={c} tipo="clube" nome={nome}/><RecordesFutebol c={c} tipo="clube" nome={nome} temporadas={temporadas}/><h3 className="hf-subtitulo">Capítulos da simulação</h3>
  {g.eventos.length?<ol className="hf-linha">{g.eventos.map(e=><li key={`${e.ano}|${e.nome}`}><time>{e.ano}</time><span><b><LinkEntidade tipo="competicao" nome={e.nome}/></b><small>{e.voce?'Conquistado com você':'Campeão na simulação'}</small></span></li>)}</ol>:<p className="hf-vazio">Nenhum título com ano registrado nesta carreira ainda.</p>}
 </section>;
}
function TabelaEstatisticas({linhas,tipo}){return <div className="hf-tabela-scroll"><table className="hf-tabela"><thead><tr><th>Competição / equipe</th><th><abbr title="Jogos">J</abbr></th><th>Gols</th><th><abbr title="Assistências">Ast.</abbr></th><th><abbr title="Jogos sem sofrer gols">SG</abbr></th><th>Defesas</th></tr></thead><tbody>{linhas.map(t=><tr key={t.nome}><th scope="row"><LinkEntidade tipo={tipo} nome={t.nome}/></th><td>{t.jogos}</td><td>{t.gols}</td><td>{t.assist}</td><td>{t.cleanSheets||'—'}</td><td>{t.temDefesas?t.defesas:'—'}</td></tr>)}</tbody></table></div>;}
export function MarcosIndividuais({c,temporadas,clube}){
 const todas=temporadas||c.temporadas||[],dados=useMemo(()=>estatisticasHistoricas(c,clube?todas.filter(t=>t.clube===clube):todas),[c,todas,clube]);
 const decisoes=todas.reduce((s,t)=>s+(t.defesasDecisivas||0),0);
 return <section className="hf-marcos" aria-label="Histórico individual"><span className="hf-eyebrow">OS NÚMEROS DA SUA HISTÓRIA</span><h2>{clube?'Sua passagem pelo clube':'Sua carreira, competição por competição'}</h2>
  <BotaoMuseuPessoal c={c} temporadas={todas} modo={c.clube?.nome?'completo':'rapido'}/>
  <div className="hf-numeros"><article><strong>{dados.selecao.jogos}</strong><span>jogos por <LinkEntidade tipo="selecao" nome={dados.selecao.nome}/></span></article><article><strong>{dados.selecao.gols}</strong><span>gols pela seleção</span></article><article><strong>{dados.selecao.assist}</strong><span>assistências pela seleção</span></article>{c.posicao==='GOL'&&<article><strong>{decisoes}</strong><span>defesas decisivas registradas</span></article>}</div>
  {dados.competicoes.length?<TabelaEstatisticas linhas={dados.competicoes} tipo="competicao"/>:<p className="hf-vazio">A divisão por competição começa a aparecer após concluir uma temporada registrada.</p>}
  {dados.incompleto&&<p className="hf-nota">Parte do save antigo não separava os números por competição. Esses anos não foram preenchidos com estimativas retroativas.</p>}
  {todas.some(t=>t.porCompeticao?.some(x=>x.origem==='distribuicao-simulada'))&&<p className="hf-nota">Os totais anuais do jogador são distribuídos entre as competições disputadas pela simulação.</p>}
  <h3 className="hf-subtitulo">Clubes que você defendeu</h3>{dados.clubes.length>0&&<TabelaEstatisticas linhas={dados.clubes} tipo="clube"/>}
  {!clube&&todas.some(t=>t.feitosHistoricos?.length>0)&&<><h3 className="hf-subtitulo">Feitos que marcaram sua carreira</h3><ol className="hf-linha">{todas.flatMap(t=>(t.feitosHistoricos||[]).filter(feitoEstadualHistoricoValido).map(f=><li key={`${t.ano}|${f.id}`}><time>{t.ano}</time><span><b>{f.titulo}</b><small>{f.texto}</small></span></li>))}</ol></>}
  {!clube&&<><h3 className="hf-subtitulo">Em busca das marcas históricas</h3><div className="hf-referencias">{dados.referencias.map(r=><article key={r.id}><small>{r.estado}</small><h4>{r.nome}</h4><strong>{r.atual} <span>/ {r.valor}</span></strong><p>{r.atleta} · referência de {r.data}</p><progress aria-label={r.nome} value={Math.min(r.atual,r.valor)} max={r.valor}/><a href={r.fonte} target="_blank" rel="noreferrer">Consultar fonte</a></article>)}</div><p className="hf-nota">Referências reais datadas. Igualar uma marca na carreira não altera a história do futebol real. Defesas e assistências sem referência verificável ficam nos registros da simulação.</p></>}
 </section>;
}
function RecordesSimulacao({c}){
 const [nac,N]=useState(c.nac||c.nacionalidade||''),[metrica,M]=useState('gols'),lideres=lideresObservados(c,{nac,metrica});
 return <section className="hf-recordes"><span className="hf-eyebrow">CADA SAVE TEM SEUS PROTAGONISTAS</span><h2>Recordistas deste universo</h2><p className="hf-nota">Números acumulados dos atletas observados em clubes, desde {c.historiaFutebol?.desde||'o início do registro'}. O filtro reúne jogadores da nacionalidade escolhida; não é um ranking de gols por seleções.</p><div className="hf-filtros"><label>Nacionalidade<select aria-label="Nacionalidade" value={nac} onChange={e=>N(e.target.value)}><option value="">Todas</option>{NACIONALIDADES.map(x=><option value={x.id} key={x.id}>{x.label}</option>)}</select></label><label>Recorde<select aria-label="Recorde" value={metrica} onChange={e=>M(e.target.value)}><option value="gols">Mais gols</option><option value="assist">Mais assistências</option><option value="jogos">Mais jogos</option><option value="defesas">Mais defesas</option><option value="defesasDecisivas">Mais defesas decisivas</option></select></label></div><ol className="hf-ranking">{lideres.map((p,i)=><li key={p.id}><b>{i+1}</b><span><strong><LinkEntidade tipo="jogador" id={p.voce?'voce':p.id} nome={p.nome}/>{p.voce?' · Você':''}</strong><small><LinkEntidade tipo="clube" nome={p.clube}/></small></span><em>{p[metrica]}</em></li>)}</ol>{!lideres.length&&<p className="hf-vazio">Ainda não há dados registrados para este recorte.</p>}</section>;
}
function CentralRecordes({c,temporadas,clube,selecao,competicao}){
 const [tipo,T]=useState('clube');
 const [selecionados,S]=useState({clube,selecao,competicao});
 const opcoes=tipo==='clube'
  ?[...new Set([...CLUBES,...CLUBES_REGIONAIS_EXTRAS].map(x=>x.nome))]
  :tipo==='selecao'?NACIONALIDADES.map(x=>x.label)
  :competicoesDisponiveis(c,temporadas);
 const nome=selecionados[tipo]||({clube,selecao,competicao})[tipo]||opcoes[0]||'';
 return <section className="hf-central-recordes" aria-label="Central de recordes do futebol">
   <h2>Livro de recordes</h2>
   <p className="hf-nota">Pesquise uma entidade e acompanhe as marcas reais ao lado das novas marcas conquistadas neste universo.</p>
   <div className="hf-filtros">
    <label>Categoria<select value={tipo} onChange={e=>T(e.target.value)}>
      <option value="clube">Clubes</option><option value="selecao">Seleções</option><option value="competicao">Competições</option>
    </select></label>
    <label>Pesquisar recordes de<select value={nome} onChange={e=>S(x=>({...x,[tipo]:e.target.value}))}>
      {!opcoes.includes(nome)&&<option value={nome}>{nome}</option>}
      {opcoes.map(x=><option key={x} value={x}>{x}</option>)}
    </select></label>
   </div>
   <RecordesFutebol c={c} tipo={tipo} nome={nome} temporadas={temporadas}/>
   <RecordesSimulacao c={c}/>
  </section>;
}
function EmblemaCampeao({nome,selecao}){const n=NACIONALIDADES.find(n=>nomeSelecaoHistorica(n.label)===nomeSelecaoHistorica(nome)||n.id===nome);const src=selecao?(n?bandeiraDe(n.id):null):escudoDe(nome);return src?<img className="hf-emblema-campeao" src={src} alt=""/>:selecao?<span aria-hidden="true" className="hf-emblema-campeao">🌐</span>:null;}
export function GaleriaCompeticoes({c,temporadas,nome,onCompeticao,onClube,onSelecao}){
 const opcoes=useMemo(()=>competicoesDisponiveis(c,temporadas),[c,temporadas]),dados=useMemo(()=>galeriaCompeticao(c,nome,temporadas),[c,nome,temporadas]);
 return <section aria-label="Campeões das competições" className="hf-competicoes"><div className="hf-filtros"><label>Competição<select aria-label="Competição do histórico" value={dados.nome} onChange={e=>onCompeticao(e.target.value)}>{!opcoes.includes(dados.nome)&&<option>{dados.nome}</option>}{opcoes.map(n=><option key={n}>{n}</option>)}</select></label></div>
 <header className="hf-identidade"><TacaCompeticao nome={dados.nome} size={70}/><div><span className="hf-eyebrow">A HISTÓRIA DA COMPETIÇÃO</span><h2>{dados.nome}</h2><p>{dados.historicas.length} edições históricas documentadas · {dados.edicoes.length} nesta carreira</p></div></header>
 {dados.ultima&&<article className="hf-campeao-atual"><EmblemaCampeao nome={dados.ultima.clube} selecao={dados.selecao}/><div><small>{dados.ultima.historica?'ÚLTIMO CAMPEÃO HISTÓRICO':'ÚLTIMO CAMPEÃO DA CARREIRA'} · {dados.ultima.ano}</small><strong>{dados.selecao?<LinkEntidade tipo="selecao" nome={dados.ultima.clube}/>:<LinkEntidade tipo="clube" nome={dados.ultima.clube}/>}</strong>{dados.ultima.voce&&<span>Conquistado com você</span>}</div></article>}
 <EdicoesCompeticao c={c} nome={dados.nome}/><RecordesFutebol c={c} tipo="competicao" nome={dados.nome} temporadas={temporadas}/><h3 className="hf-subtitulo">Campeões por edição</h3><p className="hf-nota">Resultados registrados nesta carreira. Edições sem vencedor salvo ficam fora da lista.</p>
 {dados.edicoes.length?<ol className="hf-linha hf-campeoes">{dados.edicoes.map(e=><li key={e.ano}><time>{e.ano}</time><EmblemaCampeao nome={e.clube} selecao={dados.selecao}/><span>{dados.selecao?<LinkEntidade tipo="selecao" nome={e.clube}/>:<button onClick={()=>onClube(e.clube)}>{e.clube}</button>}<small>{e.voce?'Conquistado com você':'Campeão na simulação'}</small></span></li>)}</ol>:<p className="hf-vazio">Ainda não há campeão com ano registrado para esta competição.</p>}
 {dados.historicas.length>0&&<details className="hf-historico-estadual hf-historico-competicao" open={dados.selecao||undefined}><summary>Histórico até {dados.historicas[0].ano} · {dados.historicas.length} edições documentadas</summary>{dados.notaHistorica&&<p className="hf-nota">{dados.notaHistorica}</p>}<ol className="hf-linha" aria-label={dados.selecao?`Campeões históricos da ${dados.nome}`:['Libertadores','Copa Sul-Americana','Champions League','Europa League','Conference League','Copa do Brasil'].includes(dados.nome)?`Campeões históricos da ${dados.nome}`:'Campeões estaduais anteriores à carreira'}>{dados.historicas.map(e=><li key={e.edicao||e.ano}><time>{e.edicao||e.ano}</time><span>{e.campeoes.map(t=><button key={t.clube} onClick={()=>dados.selecao?onSelecao?.(t.clube):onClube(t.clube)}>{t.clube}{t.quantidade>1?` · ${t.quantidade} títulos`:''}</button>)}</span></li>)}</ol></details>}
 <h3 className="hf-subtitulo">Maiores campeões do acervo</h3><p className="hf-nota">{dados.selecao?`Ranking dos campeões oficiais de ${dados.nome}, separado dos títulos conquistados neste save. Os vencedores antigos também podem ser consultados por seleção.`:['Libertadores','Copa Sul-Americana','Champions League','Europa League','Conference League','Copa do Brasil'].includes(dados.nome)?`Ranking dos campeões reais de ${dados.nome==='Libertadores'?'1960':dados.nome==='Copa Sul-Americana'?'2002':dados.nome==='Champions League'?'1956':dados.nome==='Europa League'?'1972':dados.nome==='Copa do Brasil'?'1989':'2022'} a ${['Champions League','Europa League','Conference League'].includes(dados.nome)?'2026':'2025'}, incluindo campeões sem elenco jogável, somado às conquistas desta carreira. O histórico real não é alterado pela simulação.`:'Base histórica cadastrada + títulos desta carreira. Os estaduais incluem os anos históricos documentados até 2024. As demais competições mantêm o acervo inicial cadastrado. Equipes sem base histórica cadastrada aparecem com suas conquistas registradas na simulação.'}</p>
 {dados.ranking.length?<ol className="hf-ranking hf-ranking-campeoes">{dados.ranking.map((t,i)=><li key={t.clube}><b>{i+1}</b><EmblemaCampeao nome={t.clube} selecao={dados.selecao}/><span>{dados.selecao?<LinkEntidade tipo="selecao" nome={t.clube}/>:<button onClick={()=>onClube(t.clube)}>{t.clube}</button>}<small>{t.inicial} na base · {t.simulacao} nesta carreira{t.legado?` · ${t.legado} sem ano no save`:''}</small></span><em>{t.total}×</em></li>)}</ol>:<p className="hf-vazio">As primeiras conquistas registradas formarão este ranking.</p>}
 </section>;
}
function PerfilTreinador({c,nome}){
 const tecnico=c.tecnico||{},temporadas=Array.isArray(tecnico.temporadas)?tecnico.temporadas:[];
 const resumo=historicoProfissionalTecnico(tecnico);
 const titulos=titulosConquistadosTecnico(tecnico);
 const atual=nome||c.nome||tecnico.nome||'Seu treinador';
 const abreviar=n=>Number.isFinite(n)?n.toLocaleString('pt-BR'):'—';
 return <section className="hf-marcos fm27-coach-profile" aria-label="Histórico do treinador">
   <span className="hf-eyebrow">ARQUIVO VIVO / TREINADORES</span><h2>{atual}</h2>
   <p className="hf-nota">Acompanhamento da carreira no banco, com temporadas, clubes e títulos preservados no save.</p>
   {tecnico.clube&&<div className="hf-identidade"><img src={escudoDe(tecnico.clube)} alt=""/>
     <div><span className="hf-eyebrow">CLUBE ATUAL</span><h3><LinkEntidade tipo={tecnico.tipoEquipe==='selecao'?'selecao':'clube'} nome={tecnico.clube}/></h3></div></div>}
   <div className="fm27-kpis">
    {[[resumo.temporadas,'Temporadas'],[resumo.jogos,'Jogos'],[resumo.vitorias,'Vitórias'],
      [resumo.aproveitamento+'%','Aproveitamento'],[titulos.length,'Títulos']].map(([valor,rotulo])=>
      <div className="fm27-kpi" key={rotulo}><strong>{valor}</strong><span>{rotulo}</span></div>)}
   </div>
   <h3 className="hf-subtitulo">Passagens pelos clubes</h3>
   {resumo.clubes.length?<div className="fm27-data-scroll"><table className="fm27-data">
     <thead><tr><th>Clube</th><th>Temporadas</th><th>Jogos</th><th>Vitórias</th><th>Títulos</th><th>Melhor posição</th></tr></thead>
     <tbody>{resumo.clubes.map(cl=><tr key={cl.nome}>
       <td className="fm27-club-cell"><img src={escudoDe(cl.nome)} alt=""/><LinkEntidade tipo={NACIONALIDADES.some(n=>n.label===cl.nome)?'selecao':'clube'} nome={cl.nome}/></td>
       <td>{cl.temporadas}</td><td>{cl.jogos}</td><td>{cl.vitorias}</td><td>{cl.titulos}</td>
       <td>{cl.melhorPosicao?cl.melhorPosicao+'º':'—'}</td>
     </tr>)}</tbody></table></div>:<p className="hf-vazio">Ainda não há clubes registrados como treinador.</p>}
   <h3 className="hf-subtitulo">Temporada por temporada</h3>
   {temporadas.length?<div className="fm27-data-scroll"><table className="fm27-data">
    <thead><tr><th>Ano</th><th>Clube</th><th>Jogos</th><th>V–E–D</th><th>Posição</th><th>Conquistas</th></tr></thead>
    <tbody>{[...temporadas].reverse().map((t,i)=>{
     const premiacoes=titulos.filter(x=>x.ano===t.ano&&x.clube===t.clube);
     const jogos=Number.isFinite(t.jogos)?t.jogos:(t.vitorias||0)+(t.empates||0)+(t.derrotas||0);
     return <tr key={[t.ano,t.clube,i].join('|')}><td>{t.ano??'—'}</td>
      <td><LinkEntidade tipo={t.tipoEquipe==='selecao'?'selecao':'clube'} nome={t.clube||''}>{t.clube||'Sem clube'}</LinkEntidade></td>
      <td>{abreviar(jogos)}</td><td>{[t.vitorias,t.empates,t.derrotas].map(abreviar).join('–')}</td>
      <td>{Number.isFinite(t.posicao)?t.posicao+'º':'—'}</td>
      <td>{premiacoes.length?premiacoes.map((titulo,i)=><React.Fragment key={i}>{i>0?' · ':''}
        <LinkEntidade tipo="competicao" nome={titulo.nome}/></React.Fragment>):'—'}</td>
     </tr>;
    })}</tbody></table></div>:<p className="hf-vazio">A primeira temporada concluída será arquivada aqui.</p>}
   <RecordesFutebol c={c} tipo="treinador" nome={atual} temporadas={temporadas}/>
 </section>;
}
export function HistoriaDialog({c,nome,temporadas,onFechar,competicaoInicial,entradaInicial}){
 const ref=useRef(null),[busca,B]=useState('');
 const clubePadrao=nome||c.tecnico?.clube||c.clubeNome||c.clube?.nome||'Corinthians';
 const compPadrao=competicaoInicial||'Champions League';
 const selecaoPadrao=NACIONALIDADES.find(n=>n.id===(c.tecnico?.selecao||c.nac||c.nacionalidade))?.label||'Brasil';
 const nomeEhSelecao=nome&&((c.tecnico?.tipoEquipe==='selecao'&&c.tecnico?.clube===nome)||NACIONALIDADES.some(n=>n.label===nome));
 const inicial=entradaInicial?paginaEntidade(entradaInicial,{clube:clubePadrao,competicao:compPadrao}):
   competicaoInicial?paginaEntidade({tipo:'competicao',nome:competicaoInicial},{clube:clubePadrao}):
   paginaEntidade({tipo:nomeEhSelecao?'selecao':'clube',nome:nomeEhSelecao?nome:clubePadrao},{competicao:compPadrao,selecao:selecaoPadrao});
 const [pilha,SetPilha]=useState(()=>[inicial]);
 const pagina=pilha.at(-1)||inicial;
 const aba=pagina.aba,clube=pagina.clube||clubePadrao,competicao=pagina.competicao||compPadrao,selecao=pagina.selecao||selecaoPadrao;
 const irPagina=proxima=>{SetPilha(p=>empilharPagina(p,proxima));};
 const irEntidade=destino=>irPagina(paginaEntidade(destino,{clube,competicao,selecao}));
 const mudarAba=id=>{
   if(id==='clubes')irEntidade({tipo:'clube',nome:clube});
   else if(id==='selecoes')irEntidade({tipo:'selecao',nome:selecao});
   else if(id==='competicoes')irEntidade({tipo:'competicao',nome:competicao});
   else if(id==='premios')irEntidade({tipo:'premio',nome:pagina.premio||'Bola de Ouro'});
   else irPagina({...pagina,aba:id,jogadorId:id==='confrontos'?pagina.jogadorId:'',
      nome:id==='treinadores'?(c.tecnico?.nome||c.nome||'Seu treinador'):''});
 };
 useEffect(()=>{const el=ref.current,antes=document.activeElement;el.showModal();const liberar=bloquearRolagem(document.body);
   return()=>{el.close();liberar();antes?.focus?.({preventScroll:true});};},[]);
 useEffect(()=>{
   const ouvir=e=>{if(!ref.current?.open)return;const p=paginaEntidade(e.detail,{clube,competicao,selecao});if(p)irPagina(p);};
   window.addEventListener(EVENTO_ENTIDADE,ouvir);
   return()=>window.removeEventListener(EVENTO_ENTIDADE,ouvir);
 },[clube,competicao,selecao]);
 useEffect(()=>{ref.current?.querySelector('.hf-corpo')?.scrollTo({top:0});},[pagina]);
 const clubes=[...new Map([...CLUBES,...CLUBES_REGIONAIS_EXTRAS,
   ...clubesComHistoricoEstadual().map(nome=>({nome}))].map(c=>[c.nome,c])).values()]
   .filter(x=>!busca||x.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')));
 const localizacao=aba==='atletas'?'Jogador':aba==='clubes'?clube:aba==='competicoes'?competicao:
   aba==='premios'?pagina.premio:aba==='selecoes'?selecao:aba==='confrontos'?'Confrontos':aba==='treinadores'?pagina.nome:aba==='noticias'?'Notícias do mundo':aba==='rankings'?'Rankings':'Arquivo Vivo';
 return createPortal(<dialog ref={ref} className="hf-dialog fm27-historico" aria-label="História do futebol"
  onCancel={e=>{e.preventDefault();onFechar();}}>
   <header className="hf-cabecalho"><div><span className="hf-eyebrow">A JOIA · ARQUIVO VIVO</span>
    <h1>Histórias que ficam.</h1></div><button type="button" onClick={onFechar} aria-label="Fechar história">×</button></header>
   <nav className="hf-abas" aria-label="Seções da história">
    {[['clubes','Clubes'],['selecoes','Seleções'],['competicoes','Competições'],['confrontos','Confrontos'],
      ['carreira','Sua carreira'],['atletas','Jogadores'],['premios','Prêmios'],
      ['treinadores','Treinadores'],['recordes','Recordes'],['rankings','Rankings'],['noticias','Notícias']].map(([id,label])=>
     <button type="button" key={id} aria-pressed={aba===id} onClick={()=>mudarAba(id)}>{label}</button>)}
   </nav>
   <div className="hf-nav-tools"><button type="button" className="hf-nav-back"
     disabled={pilha.length<=1} onClick={()=>SetPilha(p=>p.length>1?p.slice(0,-1):p)}>← Voltar</button>
     <span className="hf-nav-location">{localizacao}</span></div>
   <div className="hf-corpo">
    {aba==='clubes'?<><div className="hf-busca">
     <label>Encontre um clube<input type="search" placeholder="Buscar clube…" value={busca} onChange={e=>B(e.target.value)}/></label>
     <select aria-label="Clube da galeria" value={clube} onChange={e=>irEntidade({tipo:'clube',nome:e.target.value})}>
      {!clubes.some(x=>x.nome===clube)&&<option value={clube}>{clube}</option>}
      {clubes.map(x=><option key={x.nome}>{x.nome}</option>)}</select>
     <div className="hf-sugestoes">{clubes.slice(0,6).map(x=>
      <button aria-pressed={clube===x.nome} key={x.nome} onClick={()=>irEntidade({tipo:'clube',nome:x.nome})}>{x.nome}</button>)}</div>
     {!clubes.length&&<small>Nenhum clube encontrado.</small>}</div>
     <GaleriaClube c={c} nome={clube} temporadas={temporadas}
       onCompeticao={nome=>irEntidade({tipo:'competicao',nome})}/></>:
     aba==='selecoes'?<GaleriaSelecoes c={c} temporadas={temporadas} nome={selecao}
       onSelecao={nome=>irEntidade({tipo:'selecao',nome})}/>:
     aba==='competicoes'?<GaleriaCompeticoes c={c} temporadas={temporadas} nome={competicao}
       onCompeticao={nome=>irEntidade({tipo:'competicao',nome})}
       onClube={nome=>irEntidade({tipo:'clube',nome})}
       onSelecao={nome=>irEntidade({tipo:'selecao',nome})}/>:
     aba==='confrontos'?<HistoricoConfrontos key={pagina.jogadorId||'clubes'} c={c} jogadorInicial={pagina.jogadorId||null}/>:
     aba==='noticias'?<NoticiasMundo c={c}/>:
     aba==='rankings'?<RankingsMundo c={c}/>:
     aba==='carreira'?<MarcosIndividuais c={c} temporadas={temporadas}/>:
     aba==='atletas'?<ArquivoAtletasFM key={pagina.jogadorId||'todos'} c={c} jogadorInicial={pagina.jogadorId||null}
       onConfrontos={id=>irEntidade({tipo:'confrontos',id,nome:'Confrontos'})}/>:
     aba==='premios'?<HistoricoPremios key={pagina.premio||'premios'} c={c}
       premioInicial={pagina.premio} onPremio={nome=>irEntidade({tipo:'premio',nome})}/>:
     aba==='treinadores'?<PerfilTreinador c={c} nome={pagina.nome}/>:
     <CentralRecordes c={c} temporadas={temporadas} clube={clube} selecao={selecao} competicao={competicao}/>}
   </div>
   <footer><button type="button" onClick={onFechar}>Voltar ao jogo</button></footer>
 </dialog>,document.body);
}
export default function BotaoHistoria({c,nome,temporadas,children,className='',competicao}){const [aberto,A]=useState(false);return <><button type="button" className={`hf-abrir ${className}`} aria-label={competicao?undefined:nome?`Ver história do ${nome}`:'Abrir história do futebol'} title={competicao?'Ver campeões desta competição':undefined} onClick={()=>A(true)}>{children||'História do futebol'}</button>{aberto&&<HistoriaDialog c={c} nome={nome} temporadas={temporadas} competicaoInicial={competicao} onFechar={()=>A(false)}/>}</>;}
