import { CARGOS_COMISSAO_TECNICO, comissaoAtivaGestao, propostaComissaoTecnico } from './comissaoTecnico.js';
import React, { useState } from 'react';
import { criarGestaoTecnico, resumoGestaoTecnico, gerarMercadoTecnico, propostaRenovacaoTecnico } from './mercadoTecnico.js';

const dinheiro = valor => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor * 1000);
export default function GestaoTecnico({ t, onNegociar }) {
  const [aba, setAba] = useState('elenco');
  const [setor, setSetor] = useState('');
  const [venda, setVenda] = useState(null);
  const [renovacao, setRenovacao] = useState(null);
  const [comissao, setComissao] = useState(null);
  const g = criarGestaoTecnico(t), resumo = resumoGestaoTecnico(g);
  const vencendo = g.elenco.filter(j => j.contrato === 1).length;
  const jogadores = (aba === 'elenco' ? g.elenco : gerarMercadoTecnico(t)).filter(j => !setor || j.setor === setor);
  const negociar = (tipo, id) => { onNegociar?.(tipo, id); setVenda(null); setRenovacao(null); setComissao(null); };
  return <div className="ct-management">
    <p>Janela aberta · {g.ano}. Prepare o elenco antes de simular. As contratações têm contrato de 3 anos.</p>
    <div className="ct-management-budget"><div><span>ORÇAMENTO</span><strong>{dinheiro(g.saldo)}</strong></div><div><span>FOLHA MENSAL / TETO</span><strong>{dinheiro(resumo.folha)} / {dinheiro(g.tetoSalarial)}</strong></div></div>
    {vencendo > 0 && <p className="ct-warning">{vencendo} contrato(s) vencem ao fim desta temporada. Renove antes de simular para manter esses atletas.</p>}
    <p>Força do elenco: <strong>{Math.round(t.elenco || 50)}</strong>. Compras, vendas e evolução anual dos atletas influenciam a equipe na simulação.</p>
    <div className="ct-management-sectors">{resumo.setores.map(s => <span key={s.id}>{s.nome}: {s.jogadores} · OVR {s.media}</span>)}</div>
    <div className="ct-management-tools"><button className="ct-primary" aria-pressed={aba === 'elenco'} onClick={() => { setAba('elenco'); setVenda(null); setRenovacao(null); setComissao(null); }}>Elenco ({g.elenco.length}/30)</button><button className="ct-primary" aria-pressed={aba === 'mercado'} onClick={() => { setAba('mercado'); setVenda(null); setRenovacao(null); setComissao(null); }}>Mercado</button><button className="ct-primary" aria-pressed={aba === 'comissao'} onClick={() => { setAba('comissao'); setVenda(null); setRenovacao(null); setComissao(null); }}>Comissão técnica</button>{aba !== 'comissao' && <label>Setor <select value={setor} onChange={e => { setSetor(e.target.value); setVenda(null); setRenovacao(null); setComissao(null); }}><option value="">Todos</option>{resumo.setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}</select></label>}</div>
    {t.avisoGestao && <p role={t.avisoGestao.erro ? 'alert' : 'status'} className="ct-warning">{t.avisoGestao.texto}</p>}
    {venda && <div className="ct-management-confirm" role="group" aria-label="Confirmar venda"><strong>Vender {venda.nome} por {dinheiro(Math.round(venda.valor * .8))}?</strong><p>O jogador sai do elenco e libera espaço na folha salarial.</p><button className="ct-primary" onClick={() => negociar('venda', venda.id)}>Confirmar venda</button><button onClick={() => setVenda(null)}>Cancelar venda</button></div>}
    {renovacao && <div className="ct-management-confirm" role="group" aria-label="Confirmar renovação"><strong>Renovar com {renovacao.nome} por 3 anos?</strong><p>Novo salário: {dinheiro(propostaRenovacaoTecnico(renovacao).salario)}/mês (+10%, arredondado). Luvas: {dinheiro(propostaRenovacaoTecnico(renovacao).luvas)}, descontadas do orçamento.</p><button className="ct-primary" onClick={() => negociar('renovacao', renovacao.id)}>Confirmar renovação</button><button onClick={() => setRenovacao(null)}>Cancelar renovação</button></div>}
    {aba === 'comissao' && <><p>Contrato até o fim de {g.ano}, sem renovação automática. Os 12 salários são pagos agora e o valor mensal também ocupa espaço no teto da folha.</p><p>Folha dos jogadores: {dinheiro(resumo.folhaJogadores)}/mês · Comissão: {dinheiro(resumo.folhaComissao)}/mês.</p>
    {comissao && <div className="ct-management-confirm" role="group" aria-label="Confirmar comissão"><strong>Contratar {comissao.nome}?</strong><p>{comissao.descricao}</p><p>Pagamento agora: {dinheiro(comissao.custo)}. Espaço na folha: {dinheiro(comissao.salario)}/mês. Válido até o fim de {g.ano}.</p><button className="ct-primary" onClick={() => negociar('comissao', comissao.id)}>Confirmar contratação</button><button onClick={() => setComissao(null)}>Cancelar contratação</button></div>}
    <div className="ct-management-list">{CARGOS_COMISSAO_TECNICO.map(cargo => {
      const ativo=comissaoAtivaGestao(g).find(p=>p.id===cargo.id),p=propostaComissaoTecnico(g,cargo.id);
      const motivo=p.custo>g.saldo?'Sem orçamento':p.salario>resumo.espacoSalarial?'Teto salarial':'';
      return <article key={cargo.id}><div><strong>{cargo.nome}</strong><span>{cargo.descricao}</span><span>{ativo?`Contratado até o fim de ${ativo.ano} · Pago: ${dinheiro(ativo.custo)} · ${dinheiro(ativo.salario)}/mês na folha`:`Contrato: ${dinheiro(p.custo)} · ${dinheiro(p.salario)}/mês na folha`}</span></div><button className="ct-primary" aria-label={`Contratar ${cargo.nome}`} disabled={!!ativo||!!motivo} onClick={()=>setComissao(p)}>{ativo?'Contratado':motivo||'Contratar'}</button></article>;
    })}</div></>}
    {aba !== 'comissao' && <div className="ct-management-list">{jogadores.map(j => {
      const motivo = g.elenco.length >= 30 ? 'Elenco cheio' : j.valor > g.saldo ? 'Sem orçamento' : j.salario > resumo.espacoSalarial ? 'Teto salarial' : '';
      const proposta = propostaRenovacaoTecnico(j);
      const motivoRenovacao = proposta.luvas > g.saldo ? 'Sem orçamento para luvas' : proposta.salario - j.salario > resumo.espacoSalarial ? 'Teto salarial' : '';
      return <article key={j.id}><div><strong>{j.nome}</strong><span>{j.setor} · {j.idade} anos · OVR {j.qualidade} · Potencial {j.potencial}</span><span>{dinheiro(j.salario)}/mês · {aba === 'mercado' ? 'Contrato: 3 anos' : `Contrato: ${j.contrato} ano(s)`}</span>{aba === 'elenco' && j.contrato === 1 && <span className="ct-contract-expiring">Vence ao fim da temporada</span>}<span>{aba === 'mercado' ? 'Compra' : 'Venda'}: {dinheiro(aba === 'mercado' ? j.valor : Math.round(j.valor * .8))}</span></div><div className="ct-management-player-actions">{aba === 'elenco' && j.contrato <= 2 && <button className="ct-primary" disabled={!!motivoRenovacao} title={motivoRenovacao || 'Ver proposta de renovação'} aria-label={`Renovar contrato de ${j.nome}`} onClick={() => { setVenda(null); setRenovacao(j); }}>Renovar</button>}<button className="ct-primary" disabled={aba === 'mercado' && !!motivo} onClick={() => aba === 'mercado' ? negociar('compra', j.id) : (setRenovacao(null), setVenda(j))} aria-label={`${aba === 'mercado' ? 'Contratar' : 'Vender'} ${j.nome}`}>{aba === 'elenco' ? 'Vender' : motivo || 'Contratar'}</button></div></article>;
    })}{!jogadores.length && <p>Nenhum jogador disponível neste setor.</p>}</div>}
    <p>Você pode renovar nos últimos dois anos de contrato. Ao final do contrato sem renovação, o atleta sai e a base repõe as vagas. O orçamento de transferências é separado do teto salarial.</p>
  </div>;
}
