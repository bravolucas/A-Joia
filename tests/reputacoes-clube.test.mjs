import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EIXOS_REPUTACAO_CLUBE, NOMES_REPUTACAO_CLUBE,
  reputacoesIniciaisClube, evoluirReputacoesClube,
} from '../src/simulacao/reputacoesClube.js';

test('oito indicadores são distintos e nenhum save legado precisa de migração obrigatória', () => {
  const antigo = Object.freeze({reputacao: 74, financas: 61, estrutura: 1});
  const reputacoes = reputacoesIniciaisClube(antigo);
  assert.deepEqual(Object.keys(reputacoes), EIXOS_REPUTACAO_CLUBE);
  assert.equal(EIXOS_REPUTACAO_CLUBE.length, 8);
  assert.equal(reputacoes.nacional, 74);
  assert.equal(reputacoes.financeira, 61);
  assert.ok(reputacoes.formadora > 0);
  assert.ok(EIXOS_REPUTACAO_CLUBE.every(k => NOMES_REPUTACAO_CLUBE[k]));
  assert.equal(antigo.reputacoes, undefined);
});

test('apenas troféus registrados e tipados impulsionam reputação continental e mundial', () => {
  const clube = {reputacao: 76, financas: 50, estrutura: 0};
  const base = {campanha: {posicao: 2, total: 20}, financas: 50, estrutura: 0};
  const semTitulo = evoluirReputacoesClube(clube, base);
  const comTitulo = evoluirReputacoesClube(clube, {...base, titulos:[
    {nome: 'Copa Continental registrada', tipo:'continental'},
    {nome: 'Mundial registrado', tipo:'mundial'},
  ]});
  assert.ok(comTitulo.continental > semTitulo.continental);
  assert.ok(comTitulo.mundial > semTitulo.mundial);
  assert.ok(comTitulo.historica > semTitulo.historica);
  assert.deepEqual(evoluirReputacoesClube(clube, {...base, titulos:['Mundial não tipado']}), semTitulo);
  assert.equal(clube.reputacoes, undefined);
});

test('título, acesso e rebaixamento deixam efeitos diferentes sem sorteios', () => {
  const clube = {reputacao: 70, financas: 50, estrutura: 0};
  const base = {campanha:{posicao: 8, total: 20}};
  const normal = evoluirReputacoesClube(clube, base);
  const acesso = evoluirReputacoesClube(clube, {...base, movimento:'acesso'});
  const queda = evoluirReputacoesClube(clube, {...base, movimento:'rebaixamento'});
  const campeao = evoluirReputacoesClube(clube, {...base, titulos:[{tipo:'liga',nome:'Liga'}]});
  assert.ok(acesso.institucional > normal.institucional);
  assert.ok(queda.institucional < normal.institucional);
  assert.ok(campeao.nacional > normal.nacional);
  assert.deepEqual(evoluirReputacoesClube(clube,base),normal);
});

test('saves com valores incompletos ou inválidos permanecem seguros após 50 temporadas', () => {
  let perfil = {reputacao: 65, financas: 1000, estrutura: -20, reputacoes:{nacional:NaN,mundial:10000}};
  for (let ano = 2030; ano < 2080; ano++) {
    const reputacoes = evoluirReputacoesClube(perfil, {
      campanha:{posicao:ano%2?19:2,total:20},
      movimento:ano%2?'rebaixamento':'acesso',
      financas:ano%2?2:95, estrutura:ano%2?-3:3,
      atletasFormados:ano%4,
    });
    assert.deepEqual(Object.keys(reputacoes),EIXOS_REPUTACAO_CLUBE);
    assert.ok(Object.values(reputacoes).every(n=>Number.isFinite(n)&&n>=0&&n<=99));
    perfil = {...perfil,reputacoes};
  }
  assert.equal(perfil.reputacao,65,'reputação legada usada no motor não deve ser sobrescrita');
});
