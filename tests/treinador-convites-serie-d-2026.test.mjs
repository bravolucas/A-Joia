import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import {
  opcoesInicioTecnico, gerarPropostasTecnico,
  CLUBES_CONVITES_TECNICO,
} from '../src/treinador/tecnico.js';

test('treinador não recebe proposta inicial de clube da Série D não jogável', () => {
  for (let i = 0; i < 12; i++) {
    const atleta = {
      nome: `Tecnico ${i}`, ano: 2026, clubeNome: 'Santos', idade: 40,
      temporadas: [], legado: { pontos: 150 + i * 30 }, torcida: {},
    };
    const propostas = opcoesInicioTecnico(atleta);
    assert.ok(propostas.length > 0);
    assert.ok(propostas.every(p => p.liga !== 'serieD' && p.liga !== 'fora-piramide'));
  }
});

test('mercado de treinadores ignora Série D, mas reconhece quando seus clubes sobem à Série C', () => {
  const atleta = {
    clube: 'Santos', liga: 'brasileirao', clubeReferencia: 'Santos',
    reputacao: 95, elenco: 72, ano: 2027, temporadas: [{ ano: 2026, clube: 'Santos',
      liga: 'brasileirao', posicao: 1, campeao: true, cumpriuObjetivo: true }],
    vinculosJogador: [], propostas: [], idade: 45,
    ligasMundo: { ABC: 'serieC', ASA: 'serieC', 'Goiatuba': 'serieC' },
  };
  const propostas = gerarPropostasTecnico(atleta, () => 0.2);
  assert.ok(propostas.every(p => p.liga !== 'serieD' && p.liga !== 'fora-piramide'));
  const cadastrados = CLUBES_CONVITES_TECNICO.filter(c => c.liga === 'serieD');
  assert.ok(cadastrados.some(c => c.nome === 'ABC'));
  assert.equal(CLUBES.find(c => c.nome === 'ABC')?.liga, 'serieD',
    'clube promovido não muda o cadastro global; muda apenas o save');
});
