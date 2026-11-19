import React,{useMemo,useState} from 'react';
import {catalogoMercadoJogador,diagnosticoMercadoJogador,ovrDe} from './rapido.js';
import {formatarEuro} from '../simulacao/economia.js';
import {escudoDe} from '../comum/arte.js';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import './MercadoEmpresario.css';

const LIMIT=12;
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export default function MercadoEmpresario({c,onAcao,interesses=[]}){
 const [pais,P]=useState('todos'),[liga,L]=useState('todas'),[busca,B]=useState('');
 const [pagina,G]=useState(1),[selecionado,S]=useState(''),[aviso,V]=useState('');
 const catalogo=useMemo(()=>catalogoMercadoJogador(c),[c]);
 const paises=useMemo(()=>[...new Set(catalogo.map(x=>x.pais))].sort((a,b)=>a.localeCompare(b,'pt-BR')),[catalogo]);
 const ligas=useMemo(()=>[...new Map(catalogo.filter(x=>pais==='todos'||x.pais===pais).map(x=>[x.liga,{id:x.liga,nome:x.ligaNome}])).values()].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR')),[catalogo,pais]);
 const filtrados=useMemo(()=>catalogo.filter(x=>(pais==='todos'||x.pais===pais)&&(liga==='todas'||x.liga===liga)&&normalize(x.nome).includes(normalize(busca))),[catalogo,pais,liga,busca]);
 const totalPaginas=Math.max(1,Math.ceil(filtrados.length/LIMIT)),pagAtual=Math.min(pagina,totalPaginas);
 const visiveis=filtrados.slice((pagAtual-1)*LIMIT,pagAtual*LIMIT);
 const alvo=catalogo.find(x=>x.nome===selecionado);
 const analise=useMemo(()=>alvo?diagnosticoMercadoJogador(c,alvo.nome):null,[c,alvo?.nome]);
 const sondagens=c.sondagensEmpresario||[];
 const sondagensAno=sondagens.filter(s=>s.ano===c.ano);
 const pendentes=sondagensAno.filter(s=>s.status==='aguardando');
 const statusDe=nome=>sondagensAno.find(s=>s.clube===nome)?.status;
 const avisar=(tipo,valor)=>{
  try{onAcao(tipo,valor);V(tipo==='retornos'?'O empresário trouxe as respostas dos clubes.':tipo==='negociarSondagem'?'O empresário verificou as propostas da janela.':'Seu empresário recebeu o pedido de sondagem.');}
  catch(e){V(e?.message||'Não foi possível enviar a solicitação.');}
 };
 const mudarPais=valor=>{P(valor);L('todas');G(1);S('');};
 const mudarLiga=valor=>{L(valor);G(1);S('');};
 const indisponivel=c.idade<18||!!c.emprestimo;
 const estadoRotulo={aguardando:'Aguardando resposta',positivo:'Aberto a negociar',negativo:'Resposta negativa'};
 return <section className="me-painel" aria-label="Mercado de clubes do empresário">
  <header className="me-cabecalho"><div><span className="me-sobretitulo">CARREIRA · MERCADO</span><h3>Explorar clubes</h3><p>Pesquise países, ligas e equipes. Você pode pedir ao empresário que procure qualquer clube jogável, mesmo que ele ainda não conheça você.</p></div><span className="me-contador">{catalogo.length} clubes</span></header>
  {indisponivel&&<p className="me-alerta">As sondagens ficam disponíveis a partir dos 18 anos, quando você não estiver emprestado.</p>}
  <div className="me-filtros">
   <label>País<select aria-label="Selecionar país" value={pais} onChange={e=>mudarPais(e.target.value)}><option value="todos">Todos os países</option>{paises.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <label>Liga<select aria-label="Selecionar liga" value={liga} onChange={e=>mudarLiga(e.target.value)}><option value="todas">Todas as ligas</option>{ligas.map(x=><option key={x.id} value={x.id}>{x.nome}</option>)}</select></label>
   <label>Buscar clube<input aria-label="Buscar clube" value={busca} onChange={e=>{B(e.target.value);G(1);}} placeholder="Nome do clube..."/></label>
  </div>
  <p className="me-resultados">{filtrados.length} clubes encontrados · OVR do seu jogador: <strong>{ovrDe(c)}</strong></p>
  <div className="me-lista">
   {visiveis.map(clube=>{
    const status=statusDe(clube.nome);
    return <button type="button" key={clube.nome} className={'me-clube '+(selecionado===clube.nome?'me-selecionado':'')} onClick={()=>{S(clube.nome);V('');}} aria-pressed={selecionado===clube.nome}>
      {escudoDe(clube.nome)?<img alt="" src={escudoDe(clube.nome)} loading="lazy"/>:<span className="me-escudo-fallback">{clube.nome.slice(0,2).toUpperCase()}</span>}
      <span className="me-clube-texto"><strong>{clube.nome}</strong><small>{clube.ligaNome} · {clube.pais}</small></span><span className="me-forca">Força {clube.forca}</span>
      {status&&<span className={'me-estado me-'+status}>{estadoRotulo[status]}</span>}
      <span className="me-seta" aria-hidden="true">›</span>
    </button>;
   })}
   {!visiveis.length&&<p className="me-vazio">Não encontramos clubes com esses filtros.</p>}
  </div>
  {totalPaginas>1&&<nav className="me-paginacao" aria-label="Páginas dos clubes"><button type="button" disabled={pagAtual<=1} onClick={()=>{G(pagAtual-1);S('');}}>Anterior</button><span>{pagAtual} de {totalPaginas}</span><button type="button" disabled={pagAtual>=totalPaginas} onClick={()=>{G(pagAtual+1);S('');}}>Próxima</button></nav>}
  {alvo&&analise&&<article className="me-detalhe">
   <header><div className="me-alvo-nome">{escudoDe(alvo.nome)&&<img src={escudoDe(alvo.nome)} alt=""/>}<div><h4><LinkEntidade tipo="clube" nome={alvo.nome}/></h4><small>{alvo.pais} · {alvo.ligaNome}</small></div></div><span>Força {alvo.forca}</span></header>
   <div className="me-dados">
    <div><small>Seu nível / clube</small><strong>{ovrDe(c)} / {alvo.forca}</strong><span>{analise.distancia>=0?'Nível competitivo':analise.distancia>=-5?'Desafio possível':'Salto exigente'}</span></div>
    <div><small>Disputa na posição</small><strong>{analise.concorrencia}</strong><span>{analise.melhor?analise.melhor.nome+' · OVR '+analise.qualidadeConcorrente:'Sem titular identificado no elenco'}</span></div>
    <div><small>Custo de transferência</small><strong>{analise.custo?formatarEuro(analise.custo):'Sem taxa'}</strong><span>Verba para uma contratação: {formatarEuro(analise.investimentoMaximo)} {analise.caixaConhecido?'(caixa do save)':'(estimativa)'}</span></div>
   </div>
   <p className="me-incerteza">Esses fatores ajudam o empresário a avaliar a sondagem. A decisão cabe ao clube: nenhum resultado é garantido.</p>
   {alvo.nome===c.clubeNome?<span className="me-proprio">Você já defende este clube.</span>:statusDe(alvo.nome)?<div className="me-acoes-retorno"><span className={'me-estado me-'+statusDe(alvo.nome)}>{estadoRotulo[statusDe(alvo.nome)]}</span>{statusDe(alvo.nome)==='positivo'&&<button className="me-sondar" type="button" onClick={()=>avisar('negociarSondagem',alvo.nome)}>Consultar proposta formal</button>}</div>:<button className="me-sondar" disabled={indisponivel} type="button" onClick={()=>avisar('interesse',alvo.nome)}>Pedir ao empresário para sondar este clube</button>}
  </article>}
  <div className="me-retornos">
   <header><div><h4>Conversas do empresário</h4><small>Respostas desta temporada e histórico recente</small></div>{pendentes.length>0&&<button type="button" className="me-retornar" onClick={()=>avisar('retornos')}>Receber retorno ({pendentes.length})</button>}</header>
   {!sondagens.length&&<p className="me-vazio">Você ainda não procurou clubes. Escolha uma equipe acima e peça a primeira sondagem.</p>}
   {sondagens.slice(-12).reverse().map((s,i)=><article key={s.ano+'-'+s.clube+'-'+i} className="me-conversa"><div><strong><LinkEntidade tipo="clube" nome={s.clube}/></strong><small>Temporada {s.ano} · {estadoRotulo[s.status]||'Sondagem'}</small></div><p>{s.texto}</p></article>)}
  </div>
  {!!interesses.length&&<details className="me-observadores"><summary>Clubes que já acompanham você ({interesses.length})</summary>{interesses.map(s=><p key={s.clube}><LinkEntidade tipo="clube" nome={s.clube}/> · {s.liga} · {s.nivel}</p>)}</details>}
  {aviso&&<p role="status" className="me-aviso">{aviso}</p>}
 </section>;
}
