import React from 'react';
import {TacaCompeticao} from './trofeus.jsx';
import './CerimoniaBola.css';
export default function CerimoniaBola({nome,posicao,finalistas=[],ano,children}){
 const venceu=posicao===1,podio=posicao>=1&&posicao<=3,linhas=finalistas.slice(0,3),vencedor=linhas[0]?.nome;
 return <section className={`cb-bola ${venceu?'cb-vencedor':posicao===2?'cb-vice':'cb-terceiro'}`} aria-label={venceu?'Vencedor da Bola de Ouro':'Uma noite no pódio da Bola de Ouro'} data-resultado-bola={venceu?'vencedor':'finalista'}>
  <span className="cb-eyebrow">BOLA DE OURO · {ano}</span>
  <h1>{venceu?'MELHOR DO MUNDO!':posicao===2?'TÃO PERTO DO SONHO.':podio?'ENTRE OS GIGANTES.':'A NOITE DA BOLA DE OURO'}</h1>
  <div className="cb-palco">{venceu?<TacaCompeticao nome="Bola de Ouro" tipo="bolaOuro" size={160}/>:<><span className="cb-luz"/><strong>{podio?`${posicao}º`:'★'}</strong><span className="cb-sem-taca">{podio?'Um nome no pódio. Um sonho que continua.':'O futebol escolheu seu melhor jogador.'}</span></>}</div>
  <h2>{podio?`${posicao}º MELHOR DO MUNDO`:vencedor||'Resultado da cerimônia'}</h2><p className="cb-nome">{nome}</p>
  <p className="cb-emocao">{venceu?'Seu nome no topo. A taça é sua, e esta noite entra para a história.':podio?`Os aplausos reconhecem sua temporada. ${vencedor?`${vencedor} fica com a taça.`:'O troféu fica em outras mãos.'} Estar entre os três melhores é enorme; chegar tão perto também deixa a vontade de ter ido além.`:'Uma temporada reconhecida no palco do futebol mundial.'}</p>
  {children||(linhas.length===3?<ol className="cb-ranking" aria-label="Top 3 da Bola de Ouro">{linhas.map((p,i)=><li key={i} className={p.voce?'cb-eu':''}><b>{i+1}º</b><span>{p.nome}<small>{p.clube||'Clube não registrado'}{p.voce?' · Você':''}</small></span></li>)}</ol>:<p className="cb-ausente">O top 3 completo não foi registrado nesta temporada.</p>)}
 </section>;
}
