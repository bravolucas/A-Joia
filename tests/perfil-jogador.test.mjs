import test from 'node:test';
import assert from 'node:assert/strict';
import {papelReal,papelPrometido,satisfacaoTempoDeJogo,nivelMoral,torcidasDoJogador,proximosPassos} from '../src/jogador/perfilJogador.js';

const base=(extra={})=>({clubeNome:'Santos',idade:24,moral:65,torcida:{Santos:40,Vasco:80},contrato:{clube:'Santos',anos:4,restantes:3,salario:500,multa:9000,papel:'titular'},temporadas:[{ano:2030,clube:'Santos',share:0.88,jogos:40}],jornada:{},...extra});

test('papel real vem da participação na última temporada no clube atual',()=>{
 assert.equal(papelReal(base()).id,'titular');
 assert.equal(papelReal(base({temporadas:[{ano:2030,clube:'Santos',share:0.3}]})).id,'reserva');
 assert.equal(papelReal(base({temporadas:[{ano:2030,clube:'Vasco',share:0.9}]})),null);
 assert.equal(papelPrometido(base()).id,'titular');
});

test('tempo de jogo abaixo do prometido gera insatisfação e alerta',()=>{
 const c=base({temporadas:[{ano:2030,clube:'Santos',share:0.3}]});
 assert.equal(satisfacaoTempoDeJogo(c).nivel,'insatisfeito');
 const p=proximosPassos(c);
 assert.ok(p.some(x=>x.titulo==='Tempo de jogo abaixo do prometido'&&x.acao.mercado));
 assert.equal(satisfacaoTempoDeJogo(base()).nivel,'satisfeito');
});

test('contrato no último ano e moral baixa viram próximos passos priorizados',()=>{
 const c=base({moral:20,contrato:{...base().contrato,restantes:1}});
 const p=proximosPassos(c);
 assert.equal(p[0].titulo,'Último ano de contrato');
 assert.ok(p.some(x=>x.titulo==='Moral baixa'));
 assert.ok(p.length<=4);
});

test('escala de moral e torcidas ordenadas',()=>{
 assert.equal(nivelMoral(90).nome,'Excelente');
 assert.equal(nivelMoral(10).nome,'Muito baixa');
 assert.deepEqual(torcidasDoJogador(base()).map(t=>t.clube),['Vasco','Santos']);
});

test('seleção perto do corte sugere a aba de desenvolvimento',()=>{
 const p=proximosPassos(base(),{caminho:{elegivel:true,ovr:80,corte:84}});
 assert.ok(p.some(x=>x.titulo==='Seleção à vista'&&x.acao.aba==='desenvolvimento'));
});
