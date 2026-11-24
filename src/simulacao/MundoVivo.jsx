import React,{useId,useMemo,useState} from 'react';
import {jogosDaEdicao,historicoAtleta} from './mundoVivo.js';
import {agruparPartidasCompeticao} from './partidasCompeticao.js';
import {avaliarClubeNoMundo} from './forcaEquipe.js';
import {EIXOS_REPUTACAO_CLUBE,NOMES_REPUTACAO_CLUBE} from './reputacoesClube.js';
import {CLUBES} from '../dados/data.js';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import PremiosTemporada from '../historia/PremiosTemporada.jsx';
import LinhaDoTempoClube from '../historia/LinhaDoTempoClube.jsx';
const universo=c=>c.tecnico?.universo||c.universo;
const sinal=n=>n>0?`+${n}`:String(n);
export function EvolucaoClube({c,nome}){
 const u=universo(c),p=u?.clubes?.[nome];
 const cl=CLUBES.find(x=>x.nome===nome)||{nome,forca:60},atual=avaliarClubeNoMundo(c,cl);
 return <section className="mv-painel" aria-label={`Evolução do ${nome}`}><span className="hf-eyebrow">UM CLUBE EM MOVIMENTO</span><h3>O momento do <LinkEntidade tipo="clube" nome={nome}/></h3><div className="hf-numeros"><article><strong>{atual.forca}</strong><span>força do elenco</span></article><article><strong>{p?.reputacao??cl.forca}</strong><span>reputação</span></article><article><strong>{p?.financas??50}/100</strong><span>saúde financeira</span></article></div><p className="hf-nota">A força acompanha a qualidade dos jogadores, o equilíbrio dos setores e a fase. Reputação e estrutura mudam mais devagar.</p>{u?.tecnicos?.[nome]&&<p className="hf-nota">Técnico: <strong>{u.tecnicos[nome].nome}</strong> · no cargo desde {u.tecnicos[nome].desde}</p>}
 {p?.reputacoes&&<section aria-label="Oito dimensões de reputação do clube"><h4>Reputação em oito dimensões</h4><dl style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:'0.6rem'}}>{EIXOS_REPUTACAO_CLUBE.map(eixo=><div key={eixo}><dt>{NOMES_REPUTACAO_CLUBE[eixo]}</dt><dd><strong>{Number.isFinite(p.reputacoes[eixo])?p.reputacoes[eixo]:'—'}</strong><small>/99</small></dd></div>)}</dl><p className="hf-nota">Indicadores calculados a partir das temporadas registradas. Não alteram, por enquanto, a força do elenco nem o dinheiro do clube.</p></section>}
 <h4 className="lt-titulo-secao">Linha do tempo</h4><LinhaDoTempoClube historico={historicoAtleta(p||{})}/></section>;
}
export function ImpactoJogador({avaliacao}){
 if(!avaliacao)return null;
 return <section className="mv-impacto" aria-label="Seu impacto no time"><strong>Você muda este time</strong><span>Sem você: {avaliacao.semUsuario} · Com você: {avaliacao.forca}</span><b>{sinal(avaliacao.impactoUsuario)} de força com sua participação</b><small>Goleiro {avaliacao.setores.GOL} · Defesa {avaliacao.setores.DEF} · Meio {avaliacao.setores.MEI} · Ataque {avaliacao.setores.ATA}</small></section>;
}
export function ArquivoAtletas({c}){
 const u=universo(c),[busca,B]=useState(''),[clube,C]=useState(''),[id,I]=useState(null);
 const todos=useMemo(()=>{const mapa=new Map(Object.entries(u?.atletas||{}).filter(([,p])=>p&&typeof p==='object').map(([chave,p])=>[String(p.id??chave),{...p,id:String(p.id??chave)}]));for(const p of c.mundo?.jogadores||[]){const anterior=mapa.get(String(p.id));if(p.aposentado&&!anterior)continue;mapa.set(String(p.id),{...anterior,id:String(p.id),nome:p.nome,posicao:p.posicao,nac:p.nac,clube:p.clubeNome,aposentado:p.aposentado,contrato:p.contrato,movimentos:p.movimentos||[],historico:anterior?.historico||[]});}return [...mapa.values()];},[u,c.mundo]);
 // Ordenação e lista de clubes não dependem do texto digitado: evitar
 // reordenar milhares de atletas e remontar o filtro a cada tecla.
 const ordenados=useMemo(()=>[...todos].sort((a,b)=>Number(!!b.voce)-Number(!!a.voce)||a.nome.localeCompare(b.nome,'pt-BR')),[todos]);
 const clubes=useMemo(()=>[...new Set(todos.flatMap(p=>[p.clube,...historicoAtleta(p).map(a=>a.clube)]))].filter(Boolean).sort(),[todos]);
 const lista=useMemo(()=>{const termo=busca.toLocaleLowerCase('pt-BR');return ordenados.filter(p=>(!termo||p.nome.toLocaleLowerCase('pt-BR').includes(termo))&&(!clube||p.clube===clube||historicoAtleta(p).some(a=>a.clube===clube)));},[ordenados,busca,clube]);
 const p=todos.find(x=>x.id===id);
 return <section aria-label="Arquivo de jogadores"><span className="hf-eyebrow">AS CARREIRAS DESTE MUNDO</span><h2>Jogadores e suas histórias</h2><p className="hf-nota">Partidas, gols, assistências e números principais dos goleiros. Os registros começam na primeira temporada concluída com este arquivo; anos antigos não são estimados.</p><div className="hf-filtros"><label>Buscar jogador<input type="search" value={busca} onChange={e=>B(e.target.value)} placeholder="Nome do jogador…"/></label><label>Clube da trajetória<select value={clube} onChange={e=>C(e.target.value)}><option value="">Todos os clubes</option>{clubes.map(n=><option key={n}>{n}</option>)}</select></label></div>
 {p&&<article className="mv-ficha" aria-label={`Ficha de ${p.nome}`}><button className="mv-voltar" onClick={()=>I(null)}>Fechar ficha ×</button><h3><LinkEntidade tipo="jogador" id={p.id} nome={p.nome}/>{p.voce?' · Você':''}</h3><p>{p.posicao} · <LinkEntidade tipo="clube" nome={p.clube||''}>{p.clube||'Sem clube'}</LinkEntidade>{p.aposentado?' · Aposentado':''}</p>{Number.isInteger(p.contrato)&&!p.aposentado&&<p>Contrato: {p.clube?`${p.contrato} temporada(s)`:'Livre'}</p>}{p.movimentos?.length>0&&<ul aria-label={`Movimentações de ${p.nome}`}>{p.movimentos.map((m,i)=><li key={i}>{m.ano} · {m.tipo==='renovacao'?'Contrato renovado':`${m.de||'Sem clube'} → ${m.para||'Sem clube'}`}</li>)}</ul>}<div className="hf-tabela-scroll"><table className="hf-tabela"><thead><tr><th>Ano / clube</th><th>J</th><th>Gols</th><th>Ast.</th>{p.posicao==='GOL'&&<><th>Defesas</th><th>SG</th></>}<th>Conquistas e movimentos</th></tr></thead><tbody>{[...historicoAtleta(p)].reverse().map(a=><tr key={a.ano}><th>{a.ano}<small><LinkEntidade tipo="clube" nome={a.clube}/></small></th><td>{a.jogos}</td><td>{a.gols}</td><td>{a.assist}</td>{p.posicao==='GOL'&&<><td>{a.defesas??'—'}</td><td>{a.cleanSheets??'—'}</td></>}<td>{a.titulos.length?a.titulos.map((nome,i)=><React.Fragment key={i}>{i>0?' · ':''}<LinkEntidade tipo="competicao" nome={nome}/></React.Fragment>):'—'}{a.destino&&<small>Transferência para {a.destino}</small>}{a.aposentou&&<small>Aposentadoria</small>}</td></tr>)}</tbody></table></div></article>}
 <p className="hf-nota">{lista.length} jogador{lista.length===1?'':'es'} encontrado{lista.length===1?'':'s'}{lista.length>60?' · Refine a busca para encontrar outros nomes.':''}</p><ul className="mv-atletas">{lista.slice(0,60).map(p=><li key={p.id}><button data-atleta={String(p.id)} onClick={()=>I(p.id)}><strong>{p.nome}{p.voce?' · Você':''}</strong><span>{p.posicao} · {p.clube||'Sem clube'}{p.aposentado?' · Aposentado':''}</span><small>{historicoAtleta(p).reduce((s,a)=>s+a.jogos,0)} jogos · {historicoAtleta(p).reduce((s,a)=>s+a.gols,0)} gols · {historicoAtleta(p).reduce((s,a)=>s+a.assist,0)} assistências</small></button></li>)}</ul>{!todos.length&&<p className="hf-vazio">Os jogadores terão suas temporadas registradas ao avançar a carreira.</p>}</section>;
}
export function EdicoesCompeticao({c,nome}){
 const u=universo(c),edicoes=useMemo(()=>(u?.edicoes||[]).filter(e=>e.nome===nome).sort((a,b)=>b.ano-a.ano),[u,nome]);
 const [ano,A]=useState(null),[equipe,E]=useState(''),[grupo,G]=useState('');
 const [jogosAbertos,JA]=useState(false),[etapa,ET]=useState(''),[pagina,PA]=useState(0);
 const idPainelJogos=useId();
 const edicao=edicoes.find(e=>e.ano===Number(ano))||edicoes[0];
 const grupoAtual=edicao?.grupos?.find(g=>g.grupo===grupo)||edicao?.grupos?.[0];
 const classificacao=grupoAtual?.classificacao||edicao?.classificacao;
 const jogos=useMemo(()=>jogosDaEdicao(edicao),[edicao]);
 const partidasFiltradas=useMemo(()=>jogos.filter(j=>!equipe||[j.casa,j.fora].includes(equipe)),[jogos,equipe]);
 const gruposPartidas=useMemo(()=>agruparPartidasCompeticao(edicao,partidasFiltradas),[edicao,partidasFiltradas]);
 const grupoPartidas=gruposPartidas.find(g=>g.chave===etapa)||gruposPartidas[0];
 const indicePartidas=gruposPartidas.findIndex(g=>g.chave===grupoPartidas?.chave);
 const porPagina=20,totalPaginas=Math.max(1,Math.ceil((grupoPartidas?.partidas.length||0)/porPagina));
 const paginaAtual=Math.min(pagina,totalPaginas-1);
 const mudarGrupo=chave=>{ET(chave);PA(0)};
 const partidasVisiveis=grupoPartidas?.partidas.slice(paginaAtual*porPagina,(paginaAtual+1)*porPagina)||[];
 const destaques=useMemo(()=>Object.values(u?.atletas||{}).flatMap(p=>{
  const linha=p.historico.find(a=>(Array.isArray(a)?a[0]:a.ano)===edicao?.ano);
  if(!linha)return [];
  const a=historicoAtleta({historico:[linha]})[0],t=a.porCompeticao?.find(t=>t.nome===nome);
  return t?[{...t,id:p.id,nome:p.nome,clube:a.clube}]:[];
 }),[u,edicao,nome]);
 if(!edicao)return null;
 return <section className="mv-painel" aria-label="Edições da competição"><h3>Por dentro da temporada</h3><div className="hf-filtros"><label>Edição<select value={edicao.ano} onChange={e=>{A(e.target.value);E('');G('');JA(false);ET('');PA(0);}}>{edicoes.map(e=><option key={e.ano}>{e.ano}</option>)}</select></label></div>
 {edicao.grupos?.length>1&&<label className="hf-filtros">Classificação do grupo<select value={grupoAtual.grupo} onChange={e=>G(e.target.value)}>{edicao.grupos.map(g=><option key={g.grupo}>{g.grupo}</option>)}</select></label>}
 {classificacao?.length>0&&<div className="hf-tabela-scroll"><table className="hf-tabela"><thead><tr><th>Pos.</th><th>Clube</th><th>J</th><th>Pts</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th></tr></thead><tbody>{classificacao.map((t,i)=><tr key={t.nome}><td>{t.posicao||i+1}º</td><th><LinkEntidade tipo="clube" nome={t.nome}/></th>{['jogos','pontos','vitorias','empates','derrotas','golsPro','golsContra'].map(k=><td key={k}>{t[k]??'—'}</td>)}</tr>)}</tbody></table></div>}
 <PremiosTemporada premios={u?.premiosLigas?.[edicao.ano]?.[nome]} ano={edicao.ano}/>
 {destaques.length>0&&<div className="mv-lideres">{[['gols','Artilheiros'],['assist','Assistências'],['defesas','Defesas']].map(([campo,titulo])=>{const lista=destaques.filter(p=>p[campo]>0).sort((a,b)=>b[campo]-a[campo]||a.nome.localeCompare(b.nome)).slice(0,5);return lista.length>0&&<article key={campo}><h4>{titulo}</h4><ol>{lista.map(p=><li key={p.id}><span><LinkEntidade tipo="jogador" id={p.id} nome={p.nome}/><small><LinkEntidade tipo="clube" nome={p.clube}/></small></span><b>{p[campo]}</b></li>)}</ol></article>;})}</div>}
 {jogos.length>0?<section className="mv-arquivo-jogos" aria-label="Arquivo de partidas desta edição">
   <button type="button" className="mv-jogos-toggle" aria-expanded={jogosAbertos} aria-controls={idPainelJogos}
     onClick={()=>{JA(aberto=>!aberto);ET('');PA(0);}}>
     <span><strong>TODOS OS JOGOS</strong><small>{jogos.length} partidas registradas · {edicao.tipo==='liga'?'organizadas por rodada':'organizadas por fase'}</small></span>
     <span aria-hidden="true">{jogosAbertos?'−':'+'}</span>
   </button>
   {jogosAbertos&&<div id={idPainelJogos} className="mv-partidas-aba" role="region" aria-label="Partida por partida">
     <header><h4>Partida por partida</h4><p>Selecione {edicao.tipo==='liga'?'a rodada':'a fase'} para consultar os placares desta edição.</p></header>
     <div className="mv-partidas-filtros"><label>Filtrar pelo clube
       <select value={equipe} onChange={e=>{E(e.target.value);ET('');PA(0);}}>
         <option value="">Todos os clubes</option>
         {[...new Set(jogos.flatMap(j=>[j.casa,j.fora]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(n=><option key={n}>{n}</option>)}
       </select>
     </label></div>
     {grupoPartidas?<><nav className="mv-partidas-navegacao" aria-label={edicao.tipo==='liga'?'Navegar por rodada':'Navegar por fase'}>
       <button type="button" onClick={()=>mudarGrupo(gruposPartidas[Math.max(0,indicePartidas-1)].chave)} disabled={indicePartidas<=0} aria-label="Rodada ou fase anterior">‹ Anterior</button>
       <label>{edicao.tipo==='liga'?'Rodada':'Fase'}
         <select aria-label={edicao.tipo==='liga'?'Rodada':'Fase'} value={grupoPartidas.chave} onChange={e=>mudarGrupo(e.target.value)}>
           {gruposPartidas.map(g=><option key={g.chave} value={g.chave}>{g.rotulo} · {g.partidas.length} {g.partidas.length===1?'jogo':'jogos'}</option>)}
         </select>
       </label>
       <button type="button" onClick={()=>mudarGrupo(gruposPartidas[Math.min(gruposPartidas.length-1,indicePartidas+1)].chave)} disabled={indicePartidas>=gruposPartidas.length-1} aria-label="Próxima rodada ou fase">Próxima ›</button>
     </nav>
     <p className="mv-partidas-contador" aria-live="polite">{grupoPartidas.rotulo} · {grupoPartidas.partidas.length} {grupoPartidas.partidas.length===1?'partida':'partidas'}</p>
     <ol className="mv-jogos">{partidasVisiveis.map((j,i)=><li key={[grupoPartidas.chave,paginaAtual,i,j.casa,j.fora].join('|')}>
       <small>{j.fase|| (typeof j.rodada==='number'?'Rodada '+j.rodada:typeof j.rodada==='string'?j.rodada:grupoPartidas.rotulo)}</small>
       <span><LinkEntidade tipo="clube" nome={j.casa}/></span><b>{j.golsCasa} × {j.golsFora}</b><span><LinkEntidade tipo="clube" nome={j.fora}/></span>
       {j.penaltis&&<small>Pênaltis · {j.vencedor}</small>}
     </li>)}</ol>
     {totalPaginas>1&&<div className="mv-partidas-paginacao">
       <button type="button" disabled={!paginaAtual} onClick={()=>PA(n=>n-1)}>Partidas anteriores</button>
       <span>Página {paginaAtual+1} de {totalPaginas}</span>
       <button type="button" disabled={paginaAtual+1>=totalPaginas} onClick={()=>PA(n=>n+1)}>Próximas partidas</button>
     </div>}</>:<p className="hf-vazio">Nenhuma partida registrada para o clube selecionado nesta edição.</p>}
   </div>}
 </section>:<p className="hf-nota">Esta edição preserva a classificação registrada; os placares individuais não estavam disponíveis.</p>}</section>;
}

const ICONES_NOTICIA={voce:'⭐',titulo:'🏆',zebra:'⚡',liga:'🥇',mercado:'💶',tecnico:'🔁',queda:'⬇️'};
/** Manchetes do mundo simulado: campeões, zebras, mercado e trocas de técnico. */
export function NoticiasMundo({c,limite=0,compacto=false}){
 const u=universo(c),lista=u?.noticias||[];
 const anos=[...new Set(lista.map(n=>n.ano))].sort((a,b)=>b-a),[ano,setAno]=useState(anos[0]);
 if(!lista.length)return <p className="hf-vazio">As manchetes aparecem ao fim da primeira temporada simulada.</p>;
 const doAno=lista.filter(n=>n.ano===(compacto?anos[0]:ano)),itens=limite?doAno.slice(0,limite):doAno;
 return <section className={compacto?'mv-noticias mv-noticias-compacto':'mv-noticias'} aria-label="Notícias do mundo">
  {!compacto&&<><span className="hf-eyebrow">O MUNDO NÃO PARA</span><h3>Manchetes da temporada</h3>
   {anos.length>1&&<label className="mv-noticias-ano">Temporada<select value={ano} onChange={e=>setAno(Number(e.target.value))}>{anos.map(a=><option key={a} value={a}>{a}</option>)}</select></label>}</>}
  <ul>{itens.map((n,i)=><li key={i} data-tipo={n.tipo}><span aria-hidden="true">{ICONES_NOTICIA[n.tipo]||'📰'}</span><p>{n.texto}{n.torcida?<small className={n.torcida>0?'mv-reacao-boa':'mv-reacao-ruim'}> · torcida {n.torcida>0?'+':''}{n.torcida}</small>:null}</p></li>)}</ul>
 </section>;
}
/** Técnico atual de um clube da IA. */
export function tecnicoDoClube(c,nome){return universo(c)?.tecnicos?.[nome]||null;}
