import test from 'node:test';
import assert from 'node:assert/strict';
import { duracaoContratoIA, fatorMobilidadeVeteranoIA } from '../src/simulacao/mercadoIA.js';
import { simularTemporadaMundo } from '../src/comum/lib.js';

test('atletas até 32 anos conservam a mobilidade de mercado anterior', () => {
  for (const idade of [18, 25, 32]) {
    assert.equal(fatorMobilidadeVeteranoIA(idade, 'ATA'), 1);
    assert.equal(fatorMobilidadeVeteranoIA(idade, 'GOL'), 1);
  }
});

test('mobilidade diminui gradualmente; goleiros têm mais oportunidades', () => {
  assert.ok(fatorMobilidadeVeteranoIA(35, 'ATA') < 1);
  assert.ok(fatorMobilidadeVeteranoIA(37, 'ATA') < fatorMobilidadeVeteranoIA(35, 'ATA'));
  assert.ok(fatorMobilidadeVeteranoIA(37, 'GOL') > fatorMobilidadeVeteranoIA(37, 'ATA'));
  assert.equal(fatorMobilidadeVeteranoIA(40, 'ATA'), 0.36);
  assert.equal(fatorMobilidadeVeteranoIA(40, 'GOL'), 0.52);
});

test('contratos novos e renovações são menores na reta final de carreira', () => {
  assert.equal(duracaoContratoIA(27, 'ATA'), 3);
  assert.equal(duracaoContratoIA(35, 'ATA'), 2);
  assert.equal(duracaoContratoIA(38, 'ATA'), 1);
  assert.equal(duracaoContratoIA(37, 'GOL'), 2);
  assert.equal(duracaoContratoIA(40, 'GOL'), 1);
});

test('veterano livre contratado pela IA não recebe acordo irreal de três anos', () => {
  const clube = { nome: 'Clube Contratante', liga: 'brasileirao', forca: 80 };
  const atleta = {
    id: 1, nome: 'Veterano Livre', idade: 38, ovr: 80, posicao: 'ATA',
    nac: 'BRA', clubeNome: null, contrato: 0, aposentado: false,
    carreira: { gols: 0, assist: 0, jogos: 0, temporadas: 0 },
  };
  const mundo = { jogadores: [atleta], temporada: 0, cadastroElencos: 1 };
  const origem = structuredClone(mundo);
  const proximo = simularTemporadaMundo(mundo, () => 0, {
    clubes: [clube], ano: 2027, registrarPremio: false,
  });
  const contratado = proximo.jogadores.find(j => j.id === 1);
  assert.equal(contratado.idade, 39);
  assert.equal(contratado.clubeNome, clube.nome);
  assert.equal(contratado.contrato, 1);
  assert.equal(contratado.movimentos.at(-1).para, clube.nome);
  assert.deepEqual(mundo, origem, 'o save de origem não pode ser modificado');
});

test('veterano livre jamais é contratado automaticamente pelo clube do técnico', () => {
  const clube = { nome: 'Meu Clube', liga: 'brasileirao', forca: 80 };
  const mundo = { jogadores: [{
    id: 1, nome: 'Atleta Livre', idade: 38, ovr: 80, posicao: 'ATA',
    nac: 'BRA', clubeNome: null, contrato: 0, aposentado: false,
  }], temporada: 0, cadastroElencos: 1 };
  const proximo = simularTemporadaMundo(mundo, () => 0, {
    clubes: [clube], clubeControlado: 'Meu Clube', ano: 2027,
    registrarPremio: false,
  });
  assert.equal(proximo.jogadores.find(j => j.id === 1).clubeNome, null);
});


test('save legado sem contrato recebe prazo curto de veterano ao ser inicializado', () => {
  const clube = { nome: 'Meu Clube', liga: 'brasileirao', forca: 80 };
  const veterano = {
    id: 45, nome: 'Veterano Legado', idade: 35, ovr: 80,
    potencial: 84, picoIdade: 28, posicao: 'ATA', nac: 'BRA',
    clubeNome: clube.nome, liga: clube.liga, aposentado: false,
    carreira: { gols: 0, assist: 0, jogos: 0, temporadas: 0 },
    // contrato ausente em saves mais antigos
  };
  const mundo = { jogadores: [veterano], cadastroElencos: 1, temporada: 0 };
  const origem = structuredClone(mundo);
  const futuro = simularTemporadaMundo(mundo, () => 0.99, {
    clubes: [clube], clubeControlado: clube.nome, ano: 2027,
    registrarPremio: false,
  });
  const atualizado = futuro.jogadores.find(j => j.id === 45);
  assert.ok(atualizado, 'atleta do save deve permanecer no mundo');
  assert.equal(atualizado.idade, 36);
  assert.equal(atualizado.contrato, 2, 'veterano sem contrato não deve receber três anos');
  assert.deepEqual(mundo, origem, 'o save original não pode ser reescrito');
});
