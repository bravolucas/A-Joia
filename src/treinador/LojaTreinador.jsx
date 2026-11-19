import {carreiraTecnicoEncerrada} from './longevidadeTecnico.js';
import React, { useState } from 'react';
import { ITENS_LOJA_TECNICO, CATEGORIAS_LOJA_TECNICO, carteiraTecnico, bonusForcaLoja, precoItemLojaTecnico } from './lojaTecnico.js';
import { formatarVerbaRapida } from './pretemporadaRapida.js';
import { calcularOvrTecnico, forcaClubeTecnico, salarioTecnico } from './tecnico.js';
import './LojaTreinador.css';

export default function LojaTreinador({ c, onComprar }) {
  const t=c.tecnico, carteira=carteiraTecnico(t), [selecionado,setSelecionado]=useState(null), [aviso,setAviso]=useState('');
  const salario=t.salario??salarioTecnico(t), preco=item=>precoItemLojaTecnico(item,salario);
  const podeComprar=t.fase==='pretemporada'&&!t.demitido&&!t.desempregado&&!t.andamento?.rodadas&&!t.andamento?.jogos&&!carreiraTecnicoEncerrada(t)&&(t.clubeInicialEscolhido||!t.opcoesInicio?.length);
  const impedimento=item=>!podeComprar?'Disponível antes de iniciar a temporada':carteira.compras.some(x=>x.id===item.id&&x.ano===t.ano)?'Já comprado nesta temporada':item.unicaNaCarreira&&carteira.compras.some(x=>x.id===item.id)?'Já feita na carreira':item.ovr&&((t.formacaoLoja||0)>=5||calcularOvrTecnico(t)>=99)?'Limite de OVR atingido':item.forca&&forcaClubeTecnico(t)>=99?'Força máxima atingida':carteira.saldo<preco(item)?'Saldo insuficiente':null;
  const comprar=()=>{try{onComprar(selecionado.id);setAviso(`${selecionado.nome}: compra concluída.`);setSelecionado(null);}catch(e){setAviso(e.message);}};
  return <div className="lt">
    <div className="lt-saldo"><span>Saldo pessoal</span><strong>{formatarVerbaRapida(carteira.saldo)}</strong><small>{t.demitido||t.desempregado?'Sem contrato ativo':`Salário: ${formatarVerbaRapida(t.salario??salarioTecnico(t))}/mês`}</small></div>
    <p>O salário entra ao encerrar a campanha: até 12 pagamentos mensais. Campanhas interrompidas recebem o proporcional. Este saldo é seu e não usa o orçamento do clube.</p>
    <div className="lt-bonus"><span>Força extra nesta temporada <b>+{bonusForcaLoja(t)}</b></span><span>OVR obtido em cursos <b>+{t.formacaoLoja||0}/5</b></span></div>
    {aviso&&<p role="status" className="lt-aviso">{aviso}</p>}
    {selecionado?<section className="lt-confirmar"><h3>Confirmar {selecionado.nome.toLowerCase()}?</h3><p>{selecionado.descricao}</p><dl><div><dt>Preço</dt><dd>{formatarVerbaRapida(preco(selecionado))}</dd></div><div><dt>Saldo após a compra</dt><dd>{formatarVerbaRapida(carteira.saldo-preco(selecionado))}</dd></div></dl><button className="lt-comprar" onClick={comprar} disabled={!!impedimento(selecionado)}>Confirmar compra</button><button className="lt-voltar" onClick={()=>setSelecionado(null)}>Cancelar</button></section>:<div className="lt-categorias">{CATEGORIAS_LOJA_TECNICO.map(cat=><section key={cat.id} className="lt-categoria" aria-label={cat.nome}><h3 className="lt-categoria-titulo">{cat.nome}</h3><p className="lt-categoria-texto">{cat.descricao}</p><div className="lt-itens">{ITENS_LOJA_TECNICO.filter(item=>item.categoria===cat.id).map(item=><article key={item.id}><h3>{item.nome}</h3><p>{item.descricao}</p><div><strong>{formatarVerbaRapida(preco(item))}</strong><button disabled={!!impedimento(item)} onClick={()=>{setSelecionado(item);setAviso('');}}>{impedimento(item)||'Ver melhoria'}</button></div></article>)}</div></section>)}</div>}
    <p className="lt-nota">Preços em meses do seu salário. Bônus de força valem só para o clube e a temporada da compra. Um exemplar de cada melhoria por temporada; formação soma até +5 OVR na carreira.</p>
    {carteira.pagamentos.length>0&&<p className="lt-nota">Último salário recebido: {formatarVerbaRapida(carteira.pagamentos.at(-1).valor)} pela temporada {carteira.pagamentos.at(-1).ano}.</p>}
  </div>;
}
