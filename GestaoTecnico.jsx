import React, { useState } from 'react';
import { criarGestaoTecnico, resumoGestaoTecnico, gerarMercadoTecnico } from './mercadoTecnico.js';

const dinheiro = valor => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor * 1000);
export default function GestaoTecnico({ t, onNegociar }) {
  const [aba, setAba] = useState('elenco');
  const [setor, setSetor] = useState('');
  const [venda, setVenda] = useState(null);
  const g = criarGestaoTecnico(t), resumo = resumoGestaoTecnico(g);
  const jogadores = (aba === 'elenco' ? g.elenco : gerarMercadoTecnico(t)).filter(j => !setor || j.setor === setor);
  const negociar = (tipo, id) => { onNegociar?.(tipo, id); setVenda(null); };
  return <div className="ct-management">
    <p>Janela aberta · {g.ano}. Prepare o elenco antes de simular. As contratações têm contrato de 3 anos.</p>
    <div className="ct-management-budget"><div><span>ORÇAMENTO</span><strong>{dinheiro(g.saldo)}</strong></div><div><span>FOLHA MENSAL / TETO</span><strong>{dinheiro(resumo.folha)} / {dinheiro(g.tetoSalarial)}</strong></div></div>
    <div className="ct-management-sectors">{resumo.setores.map(s => <span key={s.id}>{s.nome}: {s.jogadores} · OVR {s.media}</span>)}</div>
    <div className="ct-management-tools"><button className="ct-primary" aria-pressed={aba === 'elenco'} onClick={() => { setAba('elenco'); setVenda(null); }}>Elenco ({g.elenco.length}/30)</button><button className="ct-primary" aria-pressed={aba === 'mercado'} onClick={() => { setAba('mercado'); setVenda(null); }}>Mercado</button><label>Setor <select value={setor} onChange={e => { setSetor(e.target.value); setVenda(null); }}><option value="">Todos</option>{resumo.setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></label></div>
    {t.avisoGestao && <p role={t.avisoGestao.erro ? 'alert' : 'status'} className="ct-warning">{t.avisoGestao.texto}</p>}
    {venda && <div className="ct-management-confirm" role="group" aria-label="Confirmar venda"><strong>Vender {venda.nome} por {dinheiro(Math.round(venda.valor * .8))}?</strong><p>O jogador sai do elenco e libera espaço na folha salarial.</p><button className="ct-primary" onClick={() => negociar('venda', venda.id)}>Confirmar venda</button><button onClick={() => setVenda(null)}>Cancelar venda</button></div>}
    <div className="ct-management-list">{jogadores.map(j => {
      const motivo = g.elenco.length >= 30 ? 'Elenco cheio' : j.valor > g.saldo ? 'Sem orçamento' : j.salario > resumo.espacoSalarial ? 'Teto salarial' : '';
      return <article key={j.id}><div><strong>{j.nome}</strong><span>{j.setor} · {j.idade} anos · OVR {j.qualidade} · Potencial {j.potencial}</span><span>{dinheiro(j.salario)}/mês · {aba === 'mercado' ? 'Contrato: 3 anos' : `Contrato: ${j.contrato} ano(s)`}</span><span>{aba === 'mercado' ? 'Compra' : 'Venda'}: {dinheiro(aba === 'mercado' ? j.valor : Math.round(j.valor * .8))}</span></div><button className="ct-primary" disabled={aba === 'mercado' && !!motivo} onClick={() => aba === 'mercado' ? negociar('compra', j.id) : setVenda(j)} aria-label={`${aba === 'mercado' ? 'Contratar' : 'Vender'} ${j.nome}`}>{aba === 'elenco' ? 'Vender' : motivo || 'Contratar'}</button></article>;
    })}{!jogadores.length && <p>Nenhum jogador disponível neste setor.</p>}</div>
    <p>Ao final do contrato, o atleta sai e a base repõe as vagas. O orçamento de transferências é separado do teto salarial.</p>
  </div>;
}
