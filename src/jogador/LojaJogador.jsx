import Personalizacao from '../comum/Personalizacao.jsx';
import React,{useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import Icone from '../comum/Icone.jsx';
import {ARTE} from '../comum/arte.js';
import mobilidade from '../../arte/loja/mobilidade.webp';
import estiloVida from '../../arte/loja/estilo-vida.webp';
import vestiarioLoja from '../../arte/loja/vestiario-premium.webp';
import {CATALOGO_LOJA_JOGADOR,formatarValor,resumoEfeitosLoja,caminhoSelecao} from './rapido.js';
import {impedimentoLojaJogador,upsAtivosJogador,upJogadorDe,precoItemJogador,sugestoesDoMomento} from './lojaJogador.js';
import {proximosPassos} from './perfilJogador.js';
import {posicoesCompativeis} from './posicoesCarreira.js';
import {bloquearRolagem} from '../comum/bloqueioRolagem.js';
import './LojaJogador.css';

const categorias=['Todos','Staff pessoal','UPs temporários','Treino','Saúde','Adaptação','Carreira','Vida pessoal','Estilo de vida','Meus itens'];
/** Texto de um efeito somado: negativo é bom para lesão, declínio e quedas de moral. */
export function textoEfeito(e){
 if(e.mult){const pct=Math.round((e.valor-1)*100);return `${pct>0?'+':''}${pct}%`;}
 if(e.chave==='notaBonus')return `+${e.valor.toFixed(2).replace('.',',')}`;
 if(e.chave==='shareAdd')return `+${Math.round(e.valor*100)} p.p.`;
 return `+${Math.round(e.valor*10)/10}`;
}
function previaItem(c,item){
 if(item.consumivel)return [];
 const antes=resumoEfeitosLoja(c),depois=resumoEfeitosLoja(c,item);
 return depois.filter((d,k)=>d.valor!==antes[k].valor).map((d,k)=>({rotulo:d.rotulo,de:textoEfeito(antes.find(a=>a.chave===d.chave)),para:textoEfeito(d),teto:d.noTeto}));
}
const normalizar=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
const beneficios={'kit-sono':'3% menos risco de lesão','recuperacao-casa':'5% menos risco de lesão','chef-particular':'5% menos declínio','academia-casa':'+2% na evolução','curso-idioma-pessoal':'−50% na queda do 1º ano fora · +2 moral','consultoria-adaptacao':'−30% na queda do 1º ano fora','familia-perto':'−30% na queda do 1º ano fora · +3 moral',psicologo:'+3 mental/ano · quedas pela metade',personal:'20% menos risco de lesão',nutri:'12% menos declínio',fisio:'Trata lesão crônica · −10% risco',imagem:'+3 fama por ano',analista:'+0,08 na nota média',ct:'+8% na evolução',instituto:'+2 torcida/ano · legado social',origem:'+20 torcida no clube de origem',carro:'+4 fama',mansao:'+6 fama',iate:'+8 fama',equipamento:'+3% na evolução',finalizador:'+4% nos gols',criador:'+5% nas assistências','treino-goleiro':'Até +2 p.p. em defesas','bola-parada-pro':'Mais precisão em pênaltis e faltas','recuperacao-pro':'5% menos risco de lesão','media-training':'+1 fama e mental por ano','projeto-social':'+1 torcida/ano · legado social'};
function fotoItem(i){
 if(i.id==='psicologo'||i.id==='up-cabeca')return ARTE.mental;
 if(i.id==='carro')return ARTE.carro;
 if(i.id==='mansao'||i.id==='iate')return ARTE.mansao;
 if(/social|origem|instituto/.test(i.id))return ARTE.torcida;
 if(i.id==='equipamento'||i.id==='bola-parada-pro'||/^up-(gols|assist|penalti|falta|passe|defesa)$/.test(i.id))return ARTE.equipamentos;
 if(i.categoria==='Saúde'||/fisio|fisico|recuperacao|cabeca/.test(i.id))return ARTE.fisio;
 if(i.categoria==='Carreira'||/vitrine/.test(i.id))return ARTE.coletiva;
 return ARTE.treino;
}
function rotuloBloqueio(motivo){
 if(motivo==='Saldo insuficiente')return 'Sem saldo';
 if(motivo==='Exclusivo para goleiros')return 'Para goleiros';
 if(motivo==='Exclusivo para jogadores de linha')return 'Para linha';
 if(motivo==='Limite de 3 UPs ativos')return 'Limite de UPs';
 if(motivo==='Já há um UP deste tipo ativo')return 'UP já ativo';
 if(motivo==='Compre entre temporadas')return 'Entre temporadas';
 return motivo;
}
export default function LojaJogador({c,etapa,onComprar,onFechar}){
 const [soSaldo,SS]=useState(false),[ordem,OR]=useState('recomendados');
 const [categoria,setCategoria]=useState('Todos'),[busca,setBusca]=useState(''),[aviso,setAviso]=useState(null),[ultimaCompra,setUltimaCompra]=useState(null);
 const painel=useRef(null),fechar=useRef(onFechar),origem=useRef(document.activeElement),titulo=useId();fechar.current=onFechar;
 const entreTemporadas=['evento','negociacao','resumo','coletiva','traco'].includes(etapa),ativos=upsAtivosJogador(c);
 useEffect(()=>{
  const liberar=bloquearRolagem(document.body);
  painel.current?.querySelector('button')?.focus();
  const teclado=e=>{
   if(e.key==='Escape')fechar.current();
   if(e.key!=='Tab')return;
   const botoes=[...painel.current.querySelectorAll('button:not(:disabled),input,select')];
   const primeiro=botoes[0],ultimo=botoes.at(-1);
   if(!botoes.includes(document.activeElement)){e.preventDefault();primeiro?.focus();}
   else if(e.shiftKey&&document.activeElement===primeiro){e.preventDefault();ultimo?.focus();}
   else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primeiro?.focus();}
  };
  document.addEventListener('keydown',teclado);
  return()=>{liberar();document.removeEventListener('keydown',teclado);origem.current?.focus({preventScroll:true});};
 },[]);
 const ativo=i=>ativos.find(x=>x.id===i.id);
 const comprado=i=>i.temporario?!!ativo(i):(c.investimentos||[]).includes(i.id);
 const impedimento=i=>impedimentoLojaJogador(c,i,!entreTemporadas);
 const preco=i=>precoItemJogador(c,i);
 const recomendar=CATALOGO_LOJA_JOGADOR.filter(i=>!impedimento(i)&&preco(i)<=(c.patrimonio||0)).sort((a,b)=>{const score=i=>(i.temporario?2:0)+(c.posicao==='GOL'&&/goleiro|defesa|reflex/.test(i.id)?5:0)+(['ME','MD','ALE','ALD','MC','MEI'].includes(c.posicao)&&/assist|passe|criador/.test(i.id)?4:0)+(c.idade>=30&&/fisio|recuper|nutri/.test(i.id)?4:0)+(c.idade<24&&/evolucao|ct|equipamento/.test(i.id)?3:0);return score(b)-score(a)||preco(a)-preco(b);}).slice(0,3).map(i=>i.id);
 const topoDep=dep=>Math.max(0,...(c.investimentos||[]).map(x=>CATALOGO_LOJA_JOGADOR.find(i=>i.id===x)).filter(i=>i?.departamento===dep).map(i=>i.nivel));
 const visivelDep=i=>!i.departamento||i.nivel===topoDep(i.departamento)||i.nivel===topoDep(i.departamento)+1;
 const lista=CATALOGO_LOJA_JOGADOR.filter(i=>(!i.descontinuado||comprado(i))&&visivelDep(i)&&(categoria==='Todos'||categoria==='Meus itens'&&comprado(i)||i.categoria===categoria)&&(!soSaldo||!impedimento(i))&&normalizar(`${i.nome} ${i.desc}`).includes(normalizar(busca))).sort((a,b)=>ordem==='menor'?preco(a)-preco(b):ordem==='maior'?preco(b)-preco(a):categoria==='Todos'?(recomendar.includes(b.id)?1:0)-(recomendar.includes(a.id)?1:0):0);
 const [momento]=useState(()=>sugestoesDoMomento(c,CATALOGO_LOJA_JOGADOR,proximosPassos(c,{caminho:caminhoSelecao(c),possiveis:posicoesCompativeis(c)}),i=>impedimentoLojaJogador(c,i,!entreTemporadas)));
 const inicio=categoria==='Todos'&&!busca;
 const efeitos=resumoEfeitosLoja(c).filter(e=>e.ativo);
 const comprar=i=>{
  try{
   onComprar(i.id);
   setUltimaCompra(i.id);
   setAviso({texto:i.consumivel?`${i.nome}: feito.`:i.temporario?`${i.nome} ativado por ${i.duracao} ${i.duracao===1?'temporada':'temporadas'}.`:`${i.nome} adquirido.`,erro:false});
  }catch(e){setAviso({texto:e.message,erro:true});}
 };
 return createPortal(<div className="lj-overlay" onClick={onFechar}>
  <section className="lj" role="dialog" aria-modal="true" aria-labelledby={titulo} ref={painel} onClick={e=>e.stopPropagation()}>
   <header className="lj-header" style={{'--lj-hero':`url(${vestiarioLoja})`}}><div className="lj-identidade"><span className="lj-eyebrow">A JOIA / SUA VIDA NO FUTEBOL</span><h2 id={titulo}>Loja do jogador</h2><p>Do primeiro salário ao sonho de craque.</p></div><div className="lj-wallet"><span>Seu saldo</span><strong key={c.patrimonio}>{formatarValor(c.patrimonio||0)}</strong></div><button onClick={onFechar} aria-label="Fechar loja">×</button></header>
   <div className="lj-filtros">
    <label><span className="sr-only">Buscar melhoria</span><input type="search" placeholder="Treinos, conforto ou um sonho pessoal?" value={busca} onChange={e=>setBusca(e.target.value)}/></label>
    <div className="lj-categorias" aria-label="Categorias da loja">{categorias.map(nome=><button key={nome} aria-pressed={categoria===nome} onClick={()=>setCategoria(nome)}>{nome}</button>)}</div>
    <div className="lj-toolbar"><button aria-pressed={soSaldo} onClick={()=>SS(!soSaldo)}>Só o que posso comprar</button><label><span className="sr-only">Ordenar itens</span><select aria-label="Ordenar itens" value={ordem} onChange={e=>OR(e.target.value)}><option value="recomendados">Para seu momento</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select></label></div>
    <div className="lj-resumo"><span>UPs ativos <b>{ativos.length}/3</b></span><span>{lista.length} {lista.length===1?'opção':'opções'}</span></div>
    <p role="status" className={`lj-feedback ${aviso?.erro?'lj-feedback-erro':''}`} title={aviso?.texto}>{aviso?.texto||''}</p>
   </div>
   <div className="lj-content"><Personalizacao/>
    {!entreTemporadas&&<p className="lj-aviso">As compras abrem entre temporadas.</p>}
    {inicio&&momento.length>0&&<section className="lj-momento" aria-label="Para o seu momento"><h3>Para o seu momento</h3><div>{momento.map(({item,motivo})=>{const m=impedimento(item);return <article key={item.id}><span className="lj-icone"><Icone e={item.icone} size={20}/></span><span><small>{motivo}</small><strong>{item.nome}</strong></span><button className="lj-comprar" disabled={!!m} onClick={()=>comprar(item)} aria-label={m?`${m}: ${item.nome}`:`Comprar ${item.nome} por ${formatarValor(preco(item))}`}><span>{m?rotuloBloqueio(m):'Comprar'}</span><strong>{formatarValor(preco(item))}</strong></button></article>;})}</div></section>}
    {inicio&&<section className="lj-efeitos" aria-label="Seus efeitos ativos"><h3>Seus efeitos ativos</h3>{!efeitos.length&&<p>Nenhum efeito de loja ativo ainda.</p>}<ul>{efeitos.map(e=><li key={e.chave} className={e.noTeto?'lj-no-teto':''}><span>{e.rotulo}</span><b>{textoEfeito(e)}</b>{e.noTeto&&<small>no teto</small>}</li>)}</ul></section>}
    <div className="lj-grid">{lista.map(i=>{
     const tem=comprado(i),motivo=impedimento(i),duracao=ativo(i),adquirido=tem?(i.temporario?'Ativo':'Adquirido'):null;
     const previa=!tem&&!impedimento(i)?previaItem(c,i):[];
     const tempo=i.consumivel?'Uso único':duracao?`${duracao.fim-c.ano} ${duracao.fim-c.ano===1?'temporada restante':'temporadas restantes'}`:i.temporario?`${i.duracao} ${i.duracao===1?'temporada':'temporadas'}`:'Permanente';
     return <article key={i.id} className={`${tem?'lj-item-adquirido':''} ${ultimaCompra===i.id?'lj-item-novo':''}`}>
      <div className="lj-arte" aria-hidden="true">{i.fotoExtra!=null?<svg viewBox={`${(i.fotoExtra%2)*3+.012} ${Math.floor(i.fotoExtra/2)*1.5+.012} 2.976 1.476`} preserveAspectRatio="xMidYMid slice"><image href={mobilidade} width="6" height="3" preserveAspectRatio="none"/></svg>:i.foto!=null||['carro','mansao','iate'].includes(i.id)?<svg viewBox={`${((i.foto??({carro:1,mansao:2,iate:4})[i.id])%2)*3+.012} ${Math.floor((i.foto??({carro:1,mansao:2,iate:4})[i.id])/2)*2+.012} 2.976 1.976`} preserveAspectRatio="xMidYMid slice"><image href={estiloVida} width="6" height="6" preserveAspectRatio="none"/></svg>:<img src={fotoItem(i)} alt="" loading="lazy"/>}<span className="lj-icone"><Icone e={i.icone} size={22}/></span></div>
      <div className="lj-info"><span className="lj-tipo">{recomendar.includes(i.id)?'PARA SEU MOMENTO · ':''}{i.temporario?'IMPULSO':i.consumivel?'AÇÃO':i.categoria}</span><h3>{i.nome}</h3><p title={i.desc}>{beneficios[i.id]||i.desc}</p><span className={`lj-duracao ${i.temporario?'lj-temporario':''}`}>{tempo}</span><small>{i.categoria==='Pessoal'||i.luxo?'Conquista pessoal · sem OVR direto':i.somenteGoleiro?'Exclusivo para goleiros':i.somenteLinha?'Para jogadores de linha':'Compatível com sua posição'}</small>{i.luxo&&<small>Manutenção {formatarValor(Math.round(i.custo*.06))}/ano</small>}{previa.length>0&&<ul className="lj-previa" aria-label="Antes e depois">{previa.map(p=><li key={p.rotulo}>{p.rotulo}: {p.de} → <b>{p.para}</b>{p.teto?' (teto)':''}</li>)}</ul>}</div>
      <button className="lj-comprar" disabled={!!motivo} onClick={()=>comprar(i)} title={motivo||`Comprar ${i.nome}`} aria-label={tem?`${adquirido}: ${i.nome}`:motivo?`${motivo}: ${i.nome}`:`Comprar ${i.nome} por ${formatarValor(preco(i))}`}>
       {tem?<><span aria-hidden="true">✓</span><span>{adquirido}</span></>:<><span>{motivo?rotuloBloqueio(motivo):'Comprar'}</span><strong>{formatarValor(preco(i))}</strong></>}
      </button>
     </article>;
    })}</div>
    {!lista.length&&<p className="lj-vazio">Nenhum item encontrado. Tente outra categoria ou busca.</p>}
   </div>
   <footer className="lj-footer">Staff pessoal sobe de nível pagando só o novo degrau · efeitos somados têm teto · até 3 UPs ativos</footer>
  </section>
 </div>,document.body);
}
