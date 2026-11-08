import {nomeVaga} from '../competicoes/regrasCopasRapidas.js';
import {celebracoesTemporada} from './celebracoesTemporada.js';
import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import {agruparConquistasTecnico} from '../treinador/conquistasTecnico.js';
import {bloquearRolagem} from '../comum/bloqueioRolagem.js';
import {escudoDe,bandeiraDe} from '../comum/arte.js';
import {NACIONALIDADES} from '../dados/data.js';
import './FechamentoTemporada.css';

/** A carreira já foi fechada; esta tela apenas apresenta o registro salvo. */
export default function FechamentoTemporada({c,card,onContinuar,celebracaoIndice=0,onCelebracao}){
 const ref=useRef(null),trava=useRef(false),[indice,I]=useState(0);
 const ordem=['copaMundo','continentalSelecao','continental','mundial','liga','segunda','copa','estadual','bolaOuro','botaOuro'];
 const grupos=agruparConquistasTecnico(card.titulos||[]).sort((a,b)=>ordem.indexOf(a.tipo)-ordem.indexOf(b.tipo)),historico=agruparConquistasTecnico(c.lista||[]),selecionado=grupos[indice]||grupos[0],ganhou=grupos.length>0;
 const carreira=selecionado&&historico.find(g=>g.id===selecionado.id),n=carreira?.quantidade||selecionado?.quantidade||0;
 const eventos=celebracoesTemporada(card),evento=eventos[celebracaoIndice];
 const avancar=()=>{onCelebracao?.(celebracaoIndice+1);};
 const continuar=()=>{if(trava.current)return;trava.current=true;onContinuar();};
 useEffect(()=>{const el=ref.current,anterior=document.activeElement;el.showModal();const liberar=bloquearRolagem(document.body);return()=>{el.close();liberar();anterior?.focus({preventScroll:true});};},[]);
 const antes=card.ovrAntes??card.ovr??card.ovrDepois,depois=card.ovrDepois??card.ovr,delta=depois-antes;
 const nacional=selecionado&&['copaMundo','continentalSelecao'].includes(selecionado.tipo),nomeEquipe=nacional?NACIONALIDADES.find(n=>n.id===c.nac)?.label||c.nac:card.clube,emblema=nacional?bandeiraDe(c.nac):escudoDe(card.clube);
 const premio=selecionado&&['bolaOuro','botaOuro'].includes(selecionado.tipo);
 const ganhouTipo=(tipo,nome)=>(card.titulos||[]).some(t=>t.tipo===tipo&&(!nome||t.nome===nome));
 const campanha=campanhaDaTemporada(card,ganhouTipo);
 const destaques=(card.destaques||[]);
 const extras=[...(card.jornada?.mensagens||[]).map(m=>`${m.de}: ${m.texto}`),...(card.jornada?.noticias||[]).slice(0,3).map(m=>`${m.titulo}: ${m.detalhe}`),...destaques.slice(3)];
 const fatos=[
  card.bola?.pos<=10&&{icone:'⚽',texto:`Bola de Ouro: ${card.bola.pos}º`},
  card.artilharia&&card.gols>0&&{icone:'⚽',texto:`${card.gols} gols${ganhouTipo('botaOuro')?' · Bota de Ouro':''}`},
  Number.isFinite(card.torcida)&&{icone:'📣',texto:`Torcida ${card.torcida}${card.torcidaDelta?` (${card.torcidaDelta>0?'+':''}${card.torcidaDelta})`:''}`},
  card.lesao&&{icone:'🩹',texto:`Lesão: ${card.lesao}`},
  card.fidelidade&&{icone:'🏠',texto:`${card.fidelidade}º ano seguido no clube`},
 ].filter(Boolean);
 return createPortal(<dialog ref={ref} className={`ft-modal ${evento?'ft-apresentacao':''} ${ganhou?'ft-campeao':''}`} aria-label={evento?`Resultado da temporada ${card.ano} · ${evento.tipo==='bolaOuro'?'Bola de Ouro':evento.tipo==='titulo'?'Título conquistado':evento.titulo}`:`Fim da temporada ${card.ano}`} onCancel={e=>{e.preventDefault();evento?avancar():continuar();}}>
  {evento?<><header className="ft-cabecalho"><span>TEMPORADA {card.ano}</span><strong>{celebracaoIndice+1} de {eventos.length}</strong></header><ResultadoTemporada key={evento.id} evento={evento} card={card} c={c}/><footer><button onClick={avancar}>{celebracaoIndice+1<eventos.length?'Próximo resultado':'Ver resumo da temporada'} <span>→</span></button></footer></>:<>
  <header className="ft-cabecalho"><span>TEMPORADA {card.ano}</span><strong>{ganhou?'Uma conquista para a sua história':'Temporada concluída'}</strong></header>
  <div className="ft-corpo">
   <section className={`ft-palco ${selecionado?'':'ft-palco-curto'}`} aria-label="Conquistas da temporada">
    <div className="ft-clube">{emblema&&<img src={emblema} alt={nacional?`Bandeira de ${nomeEquipe}`:''}/>}<span>{nomeEquipe}</span></div>
    {selecionado?<><h1>{premio?'É SEU!':'CAMPEÃO!'}</h1><div className="ft-taca" key={selecionado.id}><div className="ft-halo"/>{Array.from({length:12},(_,i)=><i key={i} className="ft-papel" style={{'--i':i}}/>)}<TacaCompeticao nome={selecionado.nome} tipo={selecionado.tipo} size={112}/><b aria-label={`${n} conquistas na carreira`}>×{n}</b></div><h2>{selecionado.nome}</h2><p className="ft-anos">{carreira?.conquistas?.map(x=>x.ano).filter(Boolean).filter((a,i,v)=>v.indexOf(a)===i).sort((a,b)=>a-b).join(' · ')||card.ano}</p>{grupos.length>1&&<div className="ft-titulos" aria-label="Todas as conquistas desta temporada">{grupos.map((g,i)=><button key={g.id} aria-pressed={indice===i} onClick={()=>I(i)}>{g.nome}<small>×{historico.find(h=>h.id===g.id)?.quantidade||g.quantidade}</small></button>)}</div>}</>
     :<div className="ft-sem-taca"><strong>{card.acesso?'ACESSO!':card.rebaixado?'REBAIXADO':'SEM TÍTULOS NESTE ANO'}</strong><p>{card.acesso?`O ${card.clube} sobe para ${card.acesso.para}.`:card.rebaixado?`O ${card.clube} vai jogar ${card.rebaixado.para}.`:'Veja abaixo como foi cada competição.'}</p></div>}
    <div className="ft-campanha-lista" aria-label="Campanha nas competições">{campanha.map(x=><div key={x.nome} className={`ft-comp ft-${x.tom}`}>
     <TacaCompeticao nome={x.nome} tipo={x.tipo} size={24}/><span><strong>{x.nome}</strong>{x.detalhe&&<small>{x.detalhe}</small>}</span><b>{x.res}</b></div>)}</div>
    {card.tabelaLiga?.length>0&&<MiniTabela card={card}/>}
   </section>
   <section className="ft-resumo" aria-label="Resumo da temporada">
    <h2>Seus números</h2>
    <div className="ft-numeros">{[['Jogos',card.jogos],['Gols',card.gols],['Assistências',card.assist]].map(([rotulo,valor])=><div key={rotulo}><strong>{valor??0}</strong><span>{rotulo}</span></div>)}</div>
    <div className="ft-evolucao"><div><span>OVR</span><strong>{antes}<i>→</i>{depois}</strong><small>{delta>0?'+':''}{delta} na temporada</small></div><div><span>Nota</span><strong>{Number.isFinite(card.nota)?card.nota.toFixed(1):'—'}</strong><small>{card.status||'Temporada registrada'}</small></div></div>
    {fatos.length>0&&<div className="ft-fatos">{fatos.map(f=><span key={f.texto}><i aria-hidden="true">{f.icone}</i>{f.texto}</span>)}</div>}
    {card.selecao?.convocado&&<p className="ft-internacional">Seleção · {card.selecao.jogos||0} jogos · {card.selecao.gols||0} gols · {card.selecao.assist||0} assistências</p>}
    {destaques.length>0&&<><h2 className="ft-sub">O que marcou o ano</h2><ul className="ft-destaques">{destaques.slice(0,3).map((t,i)=><li key={i}>{t}</li>)}</ul></>}
    {card.jornada?.mensagens?.[0]&&<aside className="ft-mensagem"><small>{card.jornada.mensagens[0].de}{card.jornada.mensagens[0].ficticio?' · personagem fictício':''}</small><p>{card.jornada.mensagens[0].texto}</p></aside>}
    {extras.length>0&&<details className="ft-campanha"><summary>Mais acontecimentos ({extras.length})</summary>{extras.map((t,i)=><p key={i}>{t}</p>)}</details>}
   </section>
  </div>
  <footer><button onClick={continuar}>Continuar carreira <span>→</span></button><small>Temporada registrada. Vamos ao próximo capítulo.</small></footer>
 </>}
 </dialog>,document.body);
}

/** Cada competição do ano com o resultado já à vista. */
export function campanhaDaTemporada(card,ganhouTipo=(tipo,nome)=>(card.titulos||[]).some(t=>t.tipo===tipo&&(!nome||t.nome===nome))){
 const tom=res=>/Campeão|Acesso/i.test(res)?'ouro':/Rebaixado/i.test(res)?'ruim':/Vice|Final|Semi/i.test(res)?'bom':'neutro';
 const lista=[];
 if(card.ligaNome){
  const campeao=card.posLiga===1;
  const res=campeao?'Campeão':card.posLiga?`${card.posLiga}º lugar`:'—';
  const detalhe=[card.totalLiga?`${card.posLiga||'—'}º de ${card.totalLiga}`:null,card.acesso?`Acesso para ${card.acesso.para}`:null,card.rebaixado?`Rebaixado para ${card.rebaixado.para}`:null,!campeao&&card.tabelaLiga?.[0]?`Campeão: ${card.tabelaLiga[0]}`:null].filter(Boolean).join(' · ');
  lista.push({nome:card.ligaNome,tipo:'liga',res:card.rebaixado?'Rebaixado':card.acesso&&!campeao?'Acesso':res,detalhe});
 }
 if(card.estadual?.nome)lista.push({nome:card.estadual.nome,tipo:'estadual',res:card.estadual.fase,detalhe:card.estadual.formato});
 if(card.vagaProximaTemporada)lista.push({nome:`Vaga internacional · ${card.ano+1}`,tipo:'continental',res:nomeVaga(card.vagaProximaTemporada.competicao),detalhe:(card.vagaProximaTemporada.entrada==='pre'?'Fase preliminar · ':'')+card.vagaProximaTemporada.motivo});
 if(card.copaNac?.nome){const res=ganhouTipo('copa',card.copaNac.nome)?'Campeão':card.copaNac.fase;lista.push({nome:card.copaNac.nome,tipo:'copa',res:res==='Campeão'||res==='Vice-campeão'?res:`Caiu: ${String(res).replace(/^Eliminado:\s*/i,'').toLowerCase()}`});}
 if(card.continental?.nome){const res=ganhouTipo('continental')?'Campeão':card.continental.faseNome;lista.push({nome:card.continental.nome,tipo:'continental',res:res==='Campeão'||res==='Vice-campeão'||res==='Final'?res:`Caiu: ${String(res).replace(/^Eliminado:\s*/i,'').toLowerCase()}`});}
 if(card.mundialRes)lista.push({nome:'Mundial de Clubes',tipo:'mundial',res:card.mundialRes});
 if(card.selecao?.nome)lista.push({nome:card.selecao.nome,tipo:/copa do mundo/i.test(card.selecao.nome)?'copaMundo':'continentalSelecao',res:card.selecao.convocado?(card.selecao.resultado||'Convocado'):'Fora da lista'});
 return lista.map(x=>({...x,tom:tom(x.res)}));
}

function MiniTabela({card}){
 const ordem=card.tabelaLiga,minha=ordem.indexOf(card.clube);
 const idx=[...new Set([0,1,2,...(minha>2?[minha-1,minha]:[]),...(minha>=0&&minha<ordem.length-1&&minha>2?[minha+1]:[])])].filter(i=>i>=0&&i<ordem.length);
 return <ol className="ft-tabela" aria-label={`Classificação final · ${card.ligaNome}`}>{idx.map((i,k)=><React.Fragment key={i}>{k>0&&i-idx[k-1]>1&&<li className="ft-pula" aria-hidden="true">⋯</li>}<li className={i===minha?'ft-eu':''}><span>{i+1}º</span>{escudoDe(ordem[i])&&<img src={escudoDe(ordem[i])} alt=""/>}<strong>{ordem[i]}</strong></li></React.Fragment>)}</ol>;
}

function ResultadoTemporada({evento:e,card,c}){
 const premio=e.tipo==='bolaOuro',titulo=e.tipo==='titulo',positivo=e.tipo!=='rebaixamento';
 const nacional=['copaMundo','continentalSelecao'].includes(e.taca),equipe=nacional?NACIONALIDADES.find(n=>n.id===c.nac)?.label||c.nac:card.clube,escudo=nacional?bandeiraDe(c.nac):escudoDe(card.clube);
 return <section className={`ft-resultado ft-resultado-${e.tipo}`} aria-label="Resultado exclusivo">
  <span className="ft-resultado-kicker">{premio?'RECONHECIMENTO MUNDIAL':titulo?'TÍTULO CONQUISTADO':'DESTINO DA TEMPORADA'}</span>
  <h1>{premio?e.posicao===1?'MELHOR DO MUNDO!':`${e.posicao}º MELHOR DO MUNDO`:e.titulo==='REBAIXADO'?'REBAIXADO':titulo?'CAMPEÃO!':'ACESSO!'}</h1>
  <div className="ft-resultado-arte">{(titulo||premio)?<div className="ft-taca"><div className="ft-halo"/>{positivo&&Array.from({length:12},(_,i)=><i key={i} className="ft-papel" style={{'--i':i}}/>)}<TacaCompeticao nome={e.titulo} tipo={e.taca} size={190}/>{premio&&<b>{e.posicao}º</b>}</div>:<span className="ft-divisao-simbolo" aria-hidden="true">{positivo?'↗':'↘'}</span>}</div>
  <h2>{premio?'Bola de Ouro':titulo?e.titulo:e.destino}</h2>
  <div className="ft-clube">{escudo&&<img src={escudo} alt={nacional?`Bandeira de ${equipe}`:''}/>}<span>{premio?c.nome:equipe}</span></div>
  <p>{premio?(e.posicao===1?'Seu nome no topo do futebol mundial.':'Você está entre os três melhores jogadores do mundo.'):titulo?'Uma nova taça na sua história.':positivo?`O ${equipe} conquistou a subida de divisão.`:`O ${equipe} caiu de divisão. É hora de reconstruir.`}</p>
 </section>;
}
