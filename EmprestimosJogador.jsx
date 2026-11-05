import React,{useState} from 'react';
import {ofertasEmprestimo,iniciarEmprestimo} from './rapido.js';
import {escudoDe} from './arte.js';
import './EmprestimosJogador.css';
export default function EmprestimosJogador({c,onAceitar}){
 const [aberto,A]=useState(false),[anos,S]=useState(1),[erro,E]=useState('');
 if(c.emprestimo)return <div className="ej-ativo"><b>Empréstimo · {c.emprestimo.destino}</b><span>{c.emprestimo.restantes??1} temporada(s) restante(s) · retorno ao {c.clubeNome}</span></div>;
 const ofertas=ofertasEmprestimo(c);
 return <section className="ej" aria-label="Pedir empréstimo"><button className="ej-abrir" aria-expanded={aberto} onClick={()=>A(!aberto)}><span><b>Quer mais espaço para jogar?</b><small>Peça para sair por empréstimo</small></span><span aria-hidden="true">{aberto?'−':<svg viewBox="0 0 20 20" width="18" height="18"><path d="M4 16 16 4M5 4h11v11" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>}</span></button>{aberto&&<div className="ej-painel"><h2>Um novo campo. O mesmo vínculo.</h2><p>Escolha uma ou duas temporadas. O contrato atual precisa cobrir o período; ao final, você volta ao {c.clubeNome}.</p><div className="ej-duracao" aria-label="Duração do empréstimo">{[1,2].map(a=><button key={a} disabled={(c.contrato?.restantes??0)<a} aria-pressed={anos===a} onClick={()=>S(a)}>{a} {a===1?'temporada':'temporadas'}</button>)}</div><div className="ej-lista">{ofertas.map(x=><article key={x.nome}>{escudoDe(x.nome)&&<img src={escudoDe(x.nome)} alt=""/>}<div><h3>{x.nome}</h3><span>Força {x.forca} · oportunidade de disputar espaço</span></div><button onClick={()=>{try{const novo=iniciarEmprestimo(c,x.nome,anos);onAceitar(novo);A(false);}catch(e){E(e.message);}}}>Aceitar · {anos} {anos===1?'ano':'anos'}</button></article>)}</div>{!ofertas.length&&<p>Nenhuma proposta compatível disponível nesta janela. Você pode tentar na próxima temporada.</p>}<p role="status">{erro}</p></div>}</section>;
}
