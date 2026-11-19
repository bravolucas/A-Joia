import test from 'node:test';
import assert from 'node:assert/strict';
import {gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {sorteioTransferencia,podarCentral,LIMITE_CENTRAL_TRANSFERENCIAS,renovarCaixaClubes} from '../src/simulacao/transferenciasMundo.js';
import {filtrarCentral} from '../src/treinador/centralTransferencias.js';

const simular=(temporadas,semente='central')=>{
 let m=gerarMundoJogadores(geradorTecnico(semente));m.cadastroElencos=1;const rng=geradorTecnico(semente+'|sim');
 for(let i=0;i<temporadas;i++)m=simularTemporadaMundo({...m,anoCalendario:2026+i},rng,{ano:2026+i});
 return m;
};

test('mercado da IA registra negócios com valor, tipo e caixa dos clubes',()=>{
 const m=simular(2),t=m.transferencias;
 assert.ok(t.length>100,'janelas movimentam o mundo');
 assert.ok(t.length<=LIMITE_CENTRAL_TRANSFERENCIAS);
 const definitivas=t.filter(x=>x.tipo==='transferencia');
 assert.ok(definitivas.length>0&&definitivas.every(x=>x.valor>0&&x.moeda==='EUR'&&x.de&&x.para&&x.de!==x.para));
 assert.ok(t.some(x=>x.tipo==='emprestimo'),'jovens saem emprestados');
 assert.ok(Math.max(...definitivas.map(x=>x.valor))<=260000,'nenhuma venda acima de € 260 mi');
 for(const x of definitivas.slice(0,50)){
  const p=m.jogadores.find(j=>j.id===x.id);assert.ok(p,'atleta da central existe no mundo');
  assert.ok((p.movimentos||[]).some(mv=>mv.para===x.para&&mv.valor===x.valor&&mv.moeda==='EUR'),'negócio salvo no histórico do atleta');
 }
 assert.ok(Object.values(m.caixaClubes).every(Number.isFinite));
});

test('empréstimos terminam com retorno ao clube dono na temporada seguinte',()=>{
 const m=simular(3,'emprestimos');
 const ida=m.transferencias.filter(x=>x.tipo==='emprestimo');assert.ok(ida.length);
 const voltas=m.transferencias.filter(x=>x.tipo==='retornoEmprestimo');assert.ok(voltas.length,'há retornos');
 for(const v of voltas){const i=ida.find(x=>x.id===v.id&&x.temporada===v.temporada-1);if(i){assert.equal(v.de,i.para);assert.equal(v.para,i.de);}}
 const emprestados=m.jogadores.filter(p=>p.emprestimo&&!p.aposentado);
 assert.ok(emprestados.every(p=>p.emprestimo.dono&&p.emprestimo.dono!==p.clubeNome&&p.emprestimo.ateTemporada>m.temporada-1));
});

test('mercado do mundo é reproduzível com a mesma semente',()=>{
 const a=simular(2,'repetir'),b=simular(2,'repetir');
 assert.deepEqual(a.transferencias,b.transferencias);assert.deepEqual(a.caixaClubes,b.caixaClubes);
});

test('sorteio estável, poda por temporada e caixa com teto',()=>{
 assert.equal(sorteioTransferencia(2030,7,'x'),sorteioTransferencia(2030,7,'x'));
 assert.notEqual(sorteioTransferencia(2030,7,'x'),sorteioTransferencia(2030,8,'x'));
 const lista=[1,2,3,4,5].map(temporada=>({temporada}));assert.deepEqual(podarCentral(lista,5).map(x=>x.temporada),[3,4,5]);
 const caixa=renovarCaixaClubes({A:1900},new Map([['A',1000],['B',500]]));assert.equal(caixa.A,2000);assert.equal(caixa.B,500);
});

test('filtros da central: ano, tipo, liga, clube e busca',()=>{
 const lista=[
  {ano:2030,temporada:2,nome:'Ana Silva',de:'Flamengo',para:'Palmeiras',tipo:'transferencia',valor:5000},
  {ano:2030,temporada:2,nome:'Bruno Costa',de:'Real Madrid',para:'Getafe',tipo:'emprestimo',valor:0},
  {ano:2029,temporada:1,nome:'Caio Lima',de:'Santos',para:'Flamengo',tipo:'livre',valor:0},
 ];
 assert.deepEqual(filtrarCentral(lista,{temporada:2029}).map(x=>x.nome),['Caio Lima']);
 assert.deepEqual(filtrarCentral(lista,{tipo:'emprestimo'}).map(x=>x.nome),['Bruno Costa']);
 assert.deepEqual(filtrarCentral(lista,{clube:'Flamengo'}).map(x=>x.nome),['Ana Silva','Caio Lima']);
 assert.deepEqual(filtrarCentral(lista,{busca:'getafe'}).map(x=>x.nome),['Bruno Costa']);
 assert.deepEqual(filtrarCentral(lista,{liga:'espanha'}).map(x=>x.nome),['Bruno Costa']);
});
