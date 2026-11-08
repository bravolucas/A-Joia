import test from 'node:test';
import assert from 'node:assert/strict';
import { anosSeguidosNoClube, ANOS_FIDELIDADE, aplicarMomento, contextoMomento, criarJogador, aposentar, simularCarreiraAutomatica } from '../src/jogador/rapido.js';
import { extrairConquistasMuseu } from '../src/museu/museu.js';
import { iniciarCarreiraTecnico, memoriaJogadorTecnico } from '../src/treinador/tecnico.js';
import { definirRivalTecnico } from '../src/treinador/momentosTecnico.js';

test('fidelidade conta só anos seguidos no mesmo clube, sem empréstimo', () => {
  const c = { temporadas: [{ clube: 'Bahia' }, { clube: 'Santos' }, { clube: 'Santos', emprestado: true }, { clube: 'Santos' }, { clube: 'Santos' }] };
  assert.equal(anosSeguidosNoClube(c, 'Santos'), 2);
  assert.equal(anosSeguidosNoClube(c, 'Bahia'), 0);
  assert.equal(ANOS_FIDELIDADE, 4);
});

test('clássico jogado vira destaque e não mexe em títulos', () => {
  const card = { titulos: [], destaques: [], pendente: { tipo: 'classico', titulo: 'Clássico contra o Vitória', adversario: { tipo: 'clube', nome: 'Vitória' }, mini: 'penalti' } };
  const ok = aplicarMomento(card, true);
  assert.equal(ok.titulos.length, 0);
  assert.equal(ok.classico.acertou, true);
  assert.match(ok.destaques.at(-1), /Vitória/);
  const c = criarJogador({ nome: 'Clássico', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 9, ritmo: 'normal', codigo: 'CLASSICO' });
  assert.equal(contextoMomento(c, card.pendente).contexto.fase, 'Clássico');
});

test('carreiras automáticas: teto suave, clássicos e fidelidade aparecem', () => {
  const picos = [];
  let classicos = 0, fieis = 0;
  for (let i = 0; i < 24; i++) {
    const c = simularCarreiraAutomatica({ nome: 'T' + i, nac: 'BRA', posicao: ['ATA', 'MEI', 'ZAG', 'GOL'][i % 4], personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'MELHORIAS' + i });
    picos.push(Math.max(...c.temporadas.map(t => t.ovr || 0)));
    classicos += c.temporadas.filter(t => (t.momentos || []).some(m => m.tipo === 'classico')).length;
    fieis += c.temporadas.filter(t => t.fidelidade).length;
  }
  picos.sort((a, b) => a - b);
  assert.ok(picos[picos.length >> 1] <= 90, `mediana ${picos[picos.length >> 1]}`);
  assert.ok(classicos > 0 && fieis > 0, `${classicos} clássicos, ${fieis} anos de fidelidade`);
});

test('museu guarda uma camisa por clube defendido; ídolo só com torcida', () => {
  const c = { museuId: 'x', nome: 'Camisa', lista: [], torcida: { Santos: 80, Bahia: 40 }, totais: {}, titulos: {},
    temporadas: [{ clube: 'Bahia', ano: 2026, numero: 7 }, { clube: 'Santos', ano: 2027, numero: 10 }, { clube: 'Santos', ano: 2028, numero: 10 }] };
  const camisas = extrairConquistasMuseu(c).filter(r => r.categoria === 'camisas');
  assert.deepEqual(camisas.map(x => x.nome).sort(), ['Bahia', 'Santos']);
  assert.equal(camisas.find(x => x.nome === 'Santos').historia.idolo, true);
  assert.ok(!camisas.find(x => x.nome === 'Bahia').historia.idolo);
  assert.deepEqual(camisas.find(x => x.nome === 'Santos').historia.anos, [2027, 2028]);
  assert.ok(extrairConquistasMuseu(c).some(r => r.id === 'idolo'));
});

test('memória de jogador vai para o banco: auxiliar e rival de geração', () => {
  const j = { ...aposentar({ ...criarJogador({ nome: 'Memória', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'MEMORIA' }), idade: 38 }) };
  j.rival = { ...(j.rival || {}), nome: 'Ivo Rival' };
  j.jornada = { ...(j.jornada || {}), duplas: [{ nome: 'Beto Parceiro', clube: 'Bahia', conexao: 3, temporadas: 4 }] };
  const m = memoriaJogadorTecnico(j);
  assert.equal(m.auxiliar.nome, 'Beto Parceiro');
  const c = iniciarCarreiraTecnico(j);
  assert.equal(c.tecnico.memoriaJogador.rival.nome, 'Ivo Rival');
  assert.equal(c.tecnico.moral, 53);
  const r = definirRivalTecnico(c.tecnico, [{ nome: 'Flamengo', elenco: 86 }, { nome: 'Bahia', elenco: 71 }]);
  assert.equal(r.nome, 'Ivo Rival');
  assert.equal(r.rivalDeGeracao, true);
});
