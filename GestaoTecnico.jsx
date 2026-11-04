import React, {useEffect, useRef, useState} from 'react';
import {CamisaPremium} from './VisualFutebol.jsx';
import {CARGOS_COMISSAO_TECNICO,comissaoAtivaGestao,propostaComissaoTecnico} from './comissaoTecnico.js';
import {criarGestaoTecnico,resumoGestaoTecnico,gerarMercadoTecnico,propostaRenovacaoTecnico,negociarElencoTecnico} from './mercadoTecnico.js';
import './GestaoTecnico.css';
const dinheiro=v=>`R$ ${Math.abs(v)>=1000?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:2})+' mi':v.toLocaleString('pt-BR',{maximumFractionDigits:0})+' mil'}`;
const dinheiroExato=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v*1000);
const posicoes={GOL:'Goleiros',DEF:'Defesa',MEI:'Meio-campo',ATA:'Ataque'};
const numeros={GOL:1,DEF:4,MEI:8,ATA:9};
function Camisa({j,clube}){return <div className="gm-shirt"><CamisaPremium nome={clube} cor={j.setor==='GOL'?'#7857a8':'#18674f'} numero={numeros[j.setor]} /><strong className="gm-rating"><small>FORÇA</small>{j.qualidade}</strong></div>;}
export default function GestaoTecnico({t,onNegociar}){
 const [aba,setAba]=useState('mercado'),[setor,setSetor]=useState('indicacoes'),[selecao,setSelecao]=useState(null),[ultimo,setUltimo]=useState(null);
 const raiz=useRef(null),titulo=useRef(null),retorno=useRef(null),feedback=useRef(null);
 const g=criarGestaoTecnico(t),r=resumoGestaoTecnico(g),mercado=gerarMercadoTecnico(t);
 const fragil=[...r.setores].sort((a,b)=>a.media-b.media)[0];
 const disponivel=j=>g.elenco.length<30&&j.valor<=g.saldo&&j.salario<=r.espacoSalarial;
 const mediaSetor=j=>r.setores.find(s=>s.id===j.setor)?.media||0;
 const indicacoes=[...mercado].sort((a,b)=>Number(disponivel(b))-Number(disponivel(a))||(b.qualidade-mediaSetor(b))-(a.qualidade-mediaSetor(a))||a.valor-b.valor).slice(0,3);
 const jogadores=aba==='mercado'?(setor==='indicacoes'?indicacoes:mercado.filter(j=>j.setor===setor)):g.elenco.filter(j=>j.setor===setor);
 const trocar=(nova,pos)=>{setAba(nova);setSetor(pos||(nova==='mercado'?'indicacoes':'GOL'));setSelecao(null);setUltimo(null);};
 const selecionar=(tipo,j,e)=>{retorno.current=`${tipo}:${j.id}`;setUltimo(null);setSelecao({tipo,j});};
 const cancelar=()=>{setSelecao(null);requestAnimationFrame(()=>[...(raiz.current?.querySelectorAll('[data-gm-action]')||[])].find(el=>el.dataset.gmAction===retorno.current)?.focus());};
 useEffect(()=>{if(selecao)titulo.current?.focus();},[selecao?.tipo,selecao?.j.id]);
 useEffect(()=>{if(ultimo&&g.movimentos.length>ultimo.antes)feedback.current?.focus();},[g.movimentos.length]);
 const sucesso=ultimo&&g.movimentos.length>ultimo.antes&&!t.avisoGestao?.erro;
 const executar=()=>{onNegociar?.(selecao.tipo,selecao.j.id);setUltimo({...selecao,antes:g.movimentos.length});setSelecao(null);};
 let previsao=null,rg=r,forca=Number(t.elenco)||50,custo=0;
 if(selecao){
  previsao=negociarElencoTecnico({tecnico:{...t,gestao:g}},selecao.tipo,selecao.j.id);
  rg=resumoGestaoTecnico(previsao.tecnico.gestao||g);forca=previsao.tecnico.elenco??forca;custo=g.saldo-rg.saldo;
 }
 const confirmacoes={compra:['Confirmar contratação','Cancelar contratação','Contratar jogador'],venda:['Confirmar venda','Cancelar venda','Confirmar venda'],renovacao:['Confirmar renovação','Cancelar renovação','Confirmar renovação'],comissao:['Confirmar contratação','Cancelar contratação','Confirmar comissão']};
 const contrato=selecao?.tipo==='renovacao'?propostaRenovacaoTecnico(selecao.j):null;
 const melhor=selecao?.j.setor?g.elenco.filter(j=>j.setor===selecao.j.setor).sort((a,b)=>b.qualidade-a.qualidade)[0]:null;
 return <div className="gm" ref={raiz}>
  <div className="gm-header">
   <div className="gm-wallet" aria-label="Dinheiro disponível"><div><span>PARA CONTRATAR</span><strong>{dinheiro(g.saldo)}</strong></div><div><span>ESPAÇO PARA SALÁRIOS</span><strong>{dinheiro(r.espacoSalarial)}<small>/mês</small></strong></div></div>
   <details className="gm-finances"><summary>Ver detalhes das finanças</summary><p>Salários atuais: {dinheiro(r.folha)}/mês · Limite: {dinheiro(g.tetoSalarial)}/mês. O orçamento paga transferências e luvas; os salários precisam caber no limite mensal.</p></details>
   <nav className="gm-tabs" aria-label="Gestão do clube">{[['mercado','Mercado'],['elenco',`Elenco (${g.elenco.length})`],['comissao','Comissão técnica']].map(([id,nome])=><button key={id} aria-pressed={aba===id} onClick={()=>trocar(id)}>{nome}</button>)}</nav>
  </div>
  <div className="gm-content">
   {ultimo&&t.avisoGestao&&<div ref={feedback} tabIndex={-1} role={t.avisoGestao.erro?'alert':'status'} className={`gm-feedback ${t.avisoGestao.erro?'gm-error':''}`}>{t.avisoGestao.texto}</div>}
   {sucesso&&<div className="gm-receipt"><strong>{ultimo.tipo==='compra'?`${ultimo.j.nome} chegou ao seu time!`:ultimo.tipo==='venda'?`${ultimo.j.nome} foi vendido.`:'Tudo certo. Seu planejamento foi atualizado.'}</strong>{ultimo.tipo==='compra'&&<button onClick={()=>trocar('elenco',ultimo.j.setor)}>Ver no elenco →</button>}</div>}
   {selecao?<section className="gm-deal" role="group" aria-label={confirmacoes[selecao.tipo][2]}>
    <button className="gm-back" onClick={cancelar}>← Voltar aos jogadores</button>
    <h3 tabIndex={-1} ref={titulo}>{selecao.tipo==='compra'?'Seu próximo reforço?':selecao.tipo==='venda'?'Vale a pena vender?':selecao.tipo==='renovacao'?'Manter no time':'Reforçar a comissão'}</h3>
    <div className="gm-deal-player">{selecao.j.setor&&<Camisa j={selecao.j} clube={t.clube}/>}<div><h4>{selecao.j.nome}</h4><p>{posicoes[selecao.j.setor]||selecao.j.descricao}{selecao.j.idade?` · ${selecao.j.idade} anos`:''}</p>{selecao.j.setor&&<span>Potencial {selecao.j.potencial} · {dinheiro(selecao.j.salario)}/mês</span>}</div></div>
    {selecao.tipo==='compra'&&melhor&&<div className="gm-comparison"><h4>Compare com seu elenco</h4>{[[melhor.nome+' · melhor do setor',melhor.qualidade],[selecao.j.nome,selecao.j.qualidade]].map(([nome,valor],i)=><div key={i}><span>{nome}<b>{valor}</b></span><div className="gm-bar"><i style={{width:`${valor}%`}}/></div></div>)}<p>{selecao.j.qualidade>melhor.qualidade?'Chega com mais qualidade que seu melhor jogador neste setor.':selecao.j.qualidade===melhor.qualidade?'Chega no mesmo nível do seu destaque neste setor.':'É uma opção para compor o elenco. Seu melhor jogador do setor é mais forte.'}</p></div>}
    {contrato&&<p>Contrato de 3 anos. Luvas: {dinheiro(contrato.luvas)} · Novo salário: {dinheiro(contrato.salario)}/mês.</p>}
    {selecao.tipo==='compra'&&<p>Contrato de 3 anos. O jogador entra no elenco após a confirmação.</p>}
    {selecao.tipo==='comissao'&&<p>Pagamento agora: {dinheiro(selecao.j.custo)} pelos 12 meses. Válido até o fim de {g.ano}, sem renovação automática.</p>}
    {selecao.tipo==='venda'&&<p>O jogador deixa o time. Você recebe {dinheiro(Math.round(selecao.j.valor*.8))} e libera {dinheiro(selecao.j.salario)}/mês em salários.</p>}
    {previsao.tecnico.avisoGestao?.erro?<div className="gm-blocked"><strong>{previsao.tecnico.avisoGestao.texto}</strong>{selecao.tipo==='compra'&&<button onClick={()=>trocar('elenco',selecao.j.setor)}>Ver meu elenco para liberar espaço →</button>}</div>:<div className="gm-impact"><h4>Como fica o seu time</h4><div><span>{custo<0?'Você recebe':'Você paga'}</span><strong>{dinheiroExato(Math.abs(custo))}</strong></div><div><span>Dinheiro após o negócio</span><strong>{dinheiroExato(rg.saldo)}</strong></div><div><span>Salários livres depois</span><strong>{dinheiroExato(rg.espacoSalarial)}/mês</strong></div>{selecao.j.setor&&selecao.tipo!=='renovacao'&&<div><span>Força do elenco</span><strong>{(Number(t.elenco)||50).toFixed(1)} → {forca.toFixed(1)}</strong></div>}</div>}
    <div className="gm-deal-actions">{!previsao.tecnico.avisoGestao?.erro&&<span className="gm-deal-summary">{custo<0?'Receber':'Pagar'} {dinheiroExato(Math.abs(custo))} · Saldo: {dinheiroExato(rg.saldo)}</span>}<button className="gm-primary" disabled={!!previsao.tecnico.avisoGestao?.erro} onClick={executar}>{confirmacoes[selecao.tipo][0]}</button><button className="gm-secondary" onClick={cancelar}>{confirmacoes[selecao.tipo][1]}</button></div>
   </section>:<>
    {aba!=='comissao'?<>
     <div className="gm-intro"><div><span className="gm-eyebrow">{aba==='mercado'?'MERCADO ABERTO':'SEU TIME'}</span><h3>{aba==='mercado'?'Quem vai reforçar seu time?':'Escolha uma posição para organizar'}</h3><p>{aba==='mercado'?'Escolha um jogador para comparar e ver o custo antes de contratar.':'Venda para abrir espaço ou renove para manter seus jogadores.'}</p></div></div>
     {aba==='mercado'&&<button className="gm-need" onClick={()=>setSetor(fragil.id)}><span><small>OLHO DO TREINADOR</small><strong>{fragil.nome} é seu setor com menor força</strong></span><b>Buscar reforço →</b></button>}
     <div className="gm-positions" aria-label="Filtrar por posição">{aba==='mercado'&&<button aria-pressed={setor==='indicacoes'} onClick={()=>setSetor('indicacoes')}>★ Indicações</button>}{r.setores.map(s=><button key={s.id} aria-label={`Filtrar ${s.nome}`} aria-pressed={setor===s.id} onClick={()=>setSetor(s.id)}>{s.nome}<small>{aba==='elenco'?`${s.jogadores} jogadores`:`Seu time: ${s.media}`}</small></button>)}</div>
     {aba==='elenco'&&g.elenco.some(j=>j.setor===setor&&j.contrato===1)&&<p className="gm-contract-note">Os contratos destacados vencem ao fim da temporada. Renove para manter o jogador.</p>}
     <div className="gm-cards">{jogadores.map(j=>{
      const comparacao=j.qualidade-mediaSetor(j);
      const impedimento=g.elenco.length>=30?'Elenco cheio: 30 jogadores':j.valor>g.saldo?`Faltam ${dinheiro(j.valor-g.saldo)} para contratar`:`Faltam ${dinheiro(j.salario-r.espacoSalarial)}/mês no limite salarial`;
      return <article className="gm-card" key={j.id}><div className="gm-card-top"><Camisa j={j} clube={t.clube}/><div><span className="gm-eyebrow">{posicoes[j.setor]} · {j.idade} anos</span><h4>{j.nome}</h4><span className="gm-tag">{aba==='mercado'?(comparacao>2?'Acima da média do setor':comparacao>=0?'No nível do setor':'Opção para o elenco'):j.contrato===1?'Contrato vencendo':`Contrato: ${j.contrato} anos`}</span></div></div><div className="gm-card-price"><div><small>{aba==='mercado'?'PARA CONTRATAR':'VOCÊ RECEBE NA VENDA'}</small><strong>{dinheiro(aba==='mercado'?j.valor:Math.round(j.valor*.8))}</strong></div><span>{dinheiro(j.salario)}/mês</span></div>{aba==='mercado'&&!disponivel(j)&&<span className="gm-afford">{impedimento}</span>}<button className="gm-primary" data-gm-action={`${aba==='mercado'?'compra':'venda'}:${j.id}`} aria-label={`${aba==='mercado'?'Contratar':'Vender'} ${j.nome}`} onClick={e=>selecionar(aba==='mercado'?'compra':'venda',j,e)}>{aba==='mercado'?'Contratar':'Vender'}<span>→</span></button>{aba==='elenco'&&j.contrato<=2&&<button className="gm-renew" data-gm-action={`renovacao:${j.id}`} aria-label={`Renovar contrato de ${j.nome}`} onClick={e=>selecionar('renovacao',j,e)}>Renovar contrato</button>}</article>;
     })}</div>{!jogadores.length&&<p className="gm-empty">Nenhum jogador disponível nesta posição. Escolha outra acima.</p>}
    </>:<><div className="gm-intro"><span className="gm-eyebrow">NOS BASTIDORES</span><h3>Quem vai ajudar você?</h3><p>Uma vaga por função. Veja o custo e o efeito antes de contratar.</p></div><div className="gm-cards">{CARGOS_COMISSAO_TECNICO.map(cargo=>{
     const ativo=comissaoAtivaGestao(g).find(p=>p.id===cargo.id),p=propostaComissaoTecnico(g,cargo.id);
     return <article className="gm-card gm-staff" key={cargo.id}><span className="gm-staff-icon" aria-hidden="true">{cargo.id==='auxiliar'?'▣':cargo.id==='olheiro'?'◎':'↗'}</span><h4>{cargo.nome}</h4><p>{cargo.descricao}</p><div className="gm-card-price"><div><small>CONTRATO DA TEMPORADA</small><strong>{dinheiro(ativo?.custo??p.custo)}</strong></div><span>{dinheiro(ativo?.salario??p.salario)}/mês na folha</span></div><button className="gm-primary" data-gm-action={`comissao:${cargo.id}`} disabled={!!ativo} aria-label={`Contratar ${cargo.nome}`} onClick={e=>selecionar('comissao',p,e)}>{ativo?'Contratado até '+ativo.ano:'Ver contratação'}</button></article>;
    })}</div></>}
   </>}
  </div>
 </div>;
}
