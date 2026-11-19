import React,{useMemo,useState} from 'react';
import {consultarRecordesFutebol} from './recordesFutebol.js';
import LinkEntidade from './LinkEntidade.jsx';
import {NACIONALIDADES} from '../dados/data.js';
import './RecordesFutebol.css';

const numero=n=>Number.isFinite(n)?n.toLocaleString('pt-BR'):'—';
const tipoEquipe=nome=>NACIONALIDADES.some(x=>x.label===nome||x.id===nome)?'selecao':'clube';
function Valor({registro,real=false}){
 if(!registro)return <span className="rf-sem-dado">Não cadastrado</span>;
 return <div className="rf-valor">
  <strong>{numero(registro.valor)}{registro.unidade||''}</strong>
  <small>{!real&&registro.atletaId!=null
    ?<LinkEntidade tipo="jogador" id={String(registro.atletaId)} nome={registro.atleta||'Jogador'}/>
    :registro.equipe?<LinkEntidade tipo={tipoEquipe(registro.equipe)} nome={registro.equipe}/>:registro.atleta||'Registro'}{registro.ano!=null?' · '+registro.ano:''}</small>
  {registro.destaque&&<small>{registro.destaque}</small>}
  {real&&registro.cobertura==='recorte'&&<small>Somente o período documentado no acervo — não é recorde absoluto.</small>}
  {real&&registro.fonte&&<a href={registro.fonte} target="_blank" rel="noopener noreferrer">Ver fonte · {registro.data||'histórico'}</a>}
 </div>;
}
/** Visual comparativo, reutilizado diretamente nos três perfis do Arquivo Vivo. */
export default function RecordesFutebol({c,tipo,nome,temporadas=c?.temporadas||[]}){
 const [filtro,F]=useState('Todos');
 const dados=useMemo(()=>consultarRecordesFutebol(c,tipo,nome,temporadas),[c,tipo,nome,temporadas]);
 const itens=dados.recordes.filter(r=>filtro==='Todos'||r.categoria===filtro);
 const filtros=['Todos','Carreira','Temporada','Campanhas','Títulos','Partidas','Sequências',...(dados.recordes.some(x=>x.categoria==='Treinador')?['Treinador']:[])];
 const eventos=(c?.recordesEventos||[]).filter(e=>e.tipo===tipo&&e.entidade===nome).slice(-12).reverse();
 return <section className="rf-painel" aria-label={'Recordes de '+nome}>
  <div className="rf-topo"><div><span className="hf-eyebrow">ARQUIVO VIVO / RECORDES</span>
   <h3>Recordes de {nome}</h3></div><span className="rf-periodo">{dados.desde?'Save desde '+dados.desde:'Acervo histórico e save'}</span></div>
  <p className="hf-nota">As marcas reais e as deste universo são mostradas separadamente. Só há comparações onde existem dados verificáveis; partidas e temporadas não registradas não são inventadas.</p>
  <div className="rf-filtros" role="group" aria-label="Categorias de recordes">
   {filtros.map(s=><button key={s} type="button" aria-pressed={filtro===s} onClick={()=>F(s)}>{s}</button>)}
  </div>
  {itens.length?<div className="rf-tabela-scroll"><table className="rf-tabela">
    <thead><tr><th scope="col">Recorde</th><th scope="col">Futebol real</th><th scope="col">Neste save</th></tr></thead>
    <tbody>{itens.map(r=><tr key={r.id}><th scope="row"><strong>{r.rotulo}</strong><small>{r.categoria} · {r.status}</small></th>
      <td><Valor registro={r.real} real/></td><td><Valor registro={r.simulado}/></td></tr>)}</tbody>
   </table></div>:<p className="hf-vazio">{filtro==='Todos'?'Nenhum recorde disponível para esta entidade. A tabela será preenchida quando surgirem resultados arquivados.':'Nenhuma marca registrada nesta categoria.'}</p>}
  {!!eventos.length&&<div className="rf-eventos" aria-label="Quebras de recordes desta carreira">
    <h4>Recordes quebrados na carreira</h4>
    <ol>{eventos.map(e=><li key={e.id}>
      <span className="rf-ano">{e.ano}</span>
      <div><strong>{e.titulo}</strong><small>{e.detalhe}</small>
      {e.atletaId!=null&&<small><LinkEntidade tipo="jogador" id={String(e.atletaId)} nome={e.atleta||'Jogador'}/></small>}
      {e.fonte&&<a href={e.fonte} target="_blank" rel="noreferrer">Referência histórica</a>}</div>
    </li>)}</ol>
  </div>}
  </section>;
}
