import React from 'react';
import {JanelaTreinador,Escudo} from './uiTreinador.jsx';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import {PLANOS_COPA,PLANOS_PENALTIS,chancesCopa,chancePenaltis,decisaoCopa} from './copasEscolha.js';
import './CopaEscolha.css';
const pct=n=>`${Math.round(n*100)}%`;
export default function CopaEscolha({campanha:c,chave,onEscolher,ocupado,onMinimizar,modoJogador=false}){
 const d=decisaoCopa(c),r=c.resultado,penaltis=d?.penaltis,final=d?.final||r?.final;
 return <JanelaTreinador titulo={`Copa em jogo · ${c.nome}`} onFechar={onMinimizar} classe="cce-modal">
  <div className="cce-corpo"><div className="cce-topo"><TacaCompeticao nome={c.nome} tipo={c.tipo} size={48}/><div><small>TEMPORADA {c.ano}</small><h2>{c.nome}</h2><p>{d?.fase||r?.fase}</p></div></div>
   {d&&<><div className="cce-confronto"><div><Escudo nome={c.usuario} size={38}/><strong>{c.usuario}</strong><span>Força {d.forcaUsuario}</span></div><b>×</b><div><Escudo nome={d.adversario} size={38}/><strong>{d.adversario}</strong><span>Força {d.forcaAdv}</span></div></div>
    {c.fase==='liga'&&<p className="cce-info">Tabela única · {c.times.length} clubes · {c.totalRodadas} jogos. Duas decisões suas; os demais jogos são simulados. 1º–8º: oitavas. 9º–24º: playoff. 25º em diante: eliminado.</p>}
    <div className={`cce-pressao ${final?'cce-final':''}`}>{penaltis?'EMPATE · DECISÃO NOS PÊNALTIS':final?'FINAL · PRESSÃO MÁXIMA':'SUA ESCOLHA PODE MUDAR A CAMPANHA'}</div>
    <div className="cce-opcoes">{(penaltis?PLANOS_PENALTIS:PLANOS_COPA).map(op=>{const p=chancesCopa(d.forcaUsuario,d.forcaAdv,op.id,final);return <button key={op.id} disabled={ocupado} onClick={()=>onEscolher(chave,op.id)}><strong>{modoJogador&&!penaltis?({pressionar:'Jogar para cima',controlar:'Valorizar a posse',contra:'Explorar os espaços'}[op.id]):op.nome}</strong><span>{op.texto}</span>{penaltis?<b>{pct(chancePenaltis(d.forcaUsuario,d.forcaAdv,op.id,final))} {final?'de chance de título':'para passar'}</b>:<div className="cce-chances"><i>Vitória {pct(p.vitoria)}</i><i>Empate {pct(p.empate)}</i><i>Derrota {pct(p.derrota)}</i></div>}</button>;})}</div>
    {penaltis&&<p className="cce-info">{final?'A taça será decidida na marca. A pressão reduz a vantagem do favorito.':'Um empate no mata-mata abre uma disputa própria. A força dos dois times continua contando.'}</p>}
   </>}
   {r&&!r.penaltisPendentes&&<div className={`cce-resultado ${r.venceu?'cce-venceu':r.empate?'cce-empatou':'cce-perdeu'}`} role="status"><div className="cce-roleta" aria-hidden="true">{['VITÓRIA','EMPATE','DERROTA'].map((nome,i)=><span key={nome} className={(r.jogo.vencedor?r.venceu?0:2:1)===i?'cce-ativo':''}>{nome}</span>)}</div><h3>{r.jogo.penaltis?r.venceu?(c.campeao===c.usuario?'CAMPEÃO NOS PÊNALTIS!':'PASSOU NOS PÊNALTIS!'):c.vice===c.usuario?'VICE-CAMPEÃO NOS PÊNALTIS':'ELIMINADO NOS PÊNALTIS':r.venceu?c.campeao===c.usuario?'CAMPEÃO!':'VITÓRIA!':r.empate?'EMPATE':'DERROTA'}</h3><p>{r.jogo.casa} <strong>{r.jogo.golsCasa} × {r.jogo.golsFora}</strong> {r.jogo.fora}{r.jogo.penaltis?' · pênaltis':''}</p><small>{c.fase==='fim'?c.faseUsuario:'Resultado registrado. A campanha continua.'}</small></div>}
   {!r&&c.fase==='fim'&&<div className="cce-resultado"><h3>Campanha encerrada</h3><p>{c.faseUsuario}</p></div>}
   {c.classificacao?.length>0&&<details className="cce-tabela"><summary>Ver classificação · {c.classificacao.find(x=>x.meuClube)?.posicao}º</summary>{c.classificacao.filter((x,i)=>i<8||x.meuClube).map(x=><div key={x.nome} className={x.meuClube?'cce-eu':''}><span>{x.posicao}º</span><strong>{x.nome}</strong><span>{x.jogos}J</span><b>{x.pontos} pts</b></div>)}</details>}
  </div>
  {((r&&!r.penaltisPendentes)||(!r&&c.fase==='fim'))&&<footer className="cce-rodape"><button disabled={ocupado} className="ct-primary" onClick={()=>onEscolher(chave,'continuar')}>{c.fase==='fim'?'Concluir campanha':'Continuar campanha'} <span>→</span></button></footer>}
 </JanelaTreinador>;
}
