import React, { useState } from 'react';
import { ITENS_LOJA_TECNICO, carteiraTecnico, bonusForcaLoja } from './lojaTecnico.js';
import { formatarVerbaRapida } from './pretemporadaRapida.js';
import { calcularOvrTecnico, forcaClubeTecnico, salarioTecnico } from './tecnico.js';
import './LojaTreinador.css';

export default function LojaTreinador({ c, onComprar }) {
  const t=c.tecnico, carteira=carteiraTecnico(t), [selecionado,setSelecionado]=useState(null), [aviso,setAviso]=useState('');
  const podeComprar=t.fase==='pretemporada'&&!t.demitido&&!t.desempregado&&!t.andamento?.rodadas&&!t.andamento?.jogos&&(t.temporadas?.length||0)<30&&(t.clubeInicialEscolhido||!t.opcoesInicio?.length);
  const impedimento=item=>!podeComprar?'Disponível antes de iniciar a temporada':carteira.compras.some(x=>x.id===item.id&&x.ano===t.ano)?'Já comprado nesta temporada':item.ovr&&((t.formacaoLoja||0)>=5||calcularOvrTecnico(t)>=99)?'Limite de OVR atingido':item.forca&&forcaClubeTecnico(t)>=99?'Força máxima atingida':carteira.saldo<item.preco?'Saldo insuficiente':null;
  const comprar=()=>{try{onComprar(selecionado.id);setAviso(`${selecionado.nome}: compra concluída.`);setSelecionado(null);}catch(e){setAviso(e.message);}};
  return <div className="lt">
    <div className="lt-saldo"><span>Saldo pessoal</span><strong>{formatarVerbaRapida(carteira.saldo)}</strong><small>{t.demitido||t.desempregado?'Sem contrato ativo':`Salário: ${formatarVerbaRapida(t.salario??salarioTecnico(t))}/mês`}</small></div>
    <p>O salário entra ao encerrar a campanha: até 12 pagamentos mensais. Campanhas interrompidas recebem o proporcional. Este saldo é seu e não usa o orçamento do clube.</p>
    <div className="lt-bonus"><span>Força extra nesta temporada <b>+{bonusForcaLoja(t)}</b></span><span>OVR obtido em cursos <b>+{t.formacaoLoja||0}/5</b></span></div>
    {aviso&&<p role="status" className="lt-aviso">{aviso}</p>}
    {selecionado?<section className="lt-confirmar"><h3>Confirmar {selecionado.nome.toLowerCase()}?</h3><p>{selecionado.descricao}</p><dl><div><dt>Preço</dt><dd>{formatarVerbaRapida(selecionado.preco)}</dd></div><div><dt>Saldo após a compra</dt><dd>{formatarVerbaRapida(carteira.saldo-selecionado.preco)}</dd></div></dl><button className="lt-comprar" onClick={comprar} disabled={!!impedimento(selecionado)}>Confirmar compra</button><button className="lt-voltar" onClick={()=>setSelecionado(null)}>Cancelar</button></section>:<div className="lt-itens">{ITENS_LOJA_TECNICO.map(item=><article key={item.id}><h3>{item.nome}</h3><p>{item.descricao}</p><div><strong>{formatarVerbaRapida(item.preco)}</strong><button disabled={!!impedimento(item)} onClick={()=>{setSelecionado(item);setAviso('');}}>{impedimento(item)||'Ver melhoria'}</button></div></article>)}</div>}
    <p className="lt-nota">Bônus de força valem só para o clube e a temporada da compra. Um exemplar de cada melhoria por temporada; cursos somam até +5 OVR na carreira.</p>
    {carteira.pagamentos.length>0&&<p className="lt-nota">Último salário recebido: {formatarVerbaRapida(carteira.pagamentos.at(-1).valor)} pela temporada {carteira.pagamentos.at(-1).ano}.</p>}
  </div>;
}
