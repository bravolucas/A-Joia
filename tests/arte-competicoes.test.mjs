import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverImagemCompeticao, slugCompeticao } from '../arteCompeticoes.js';

const imagens = {
  libertadores: '/arte/competicoes/libertadores.webp',
  'champions-league': '/arte/competicoes/champions-league.webp',
  'champions-asiatica': '/arte/competicoes/champions-asiatica.webp',
  'concacaf-champions': '/arte/competicoes/concacaf-champions.webp',
  'copa-do-rei': '/arte/competicoes/copa-do-rei.webp',
  'copa-da-franca': '/arte/competicoes/copa-da-franca.webp',
  'liga-saudita': '/arte/competicoes/liga-saudita.webp',
  mls: '/arte/competicoes/mls.webp',
  brasileirao: '/arte/competicoes/brasileirao.webp',
  'brasileirao-serie-b': '/arte/competicoes/brasileirao-serie-b.webp',
  'taca-de-portugal': '/arte/competicoes/taca-de-portugal.webp'
};

test('normaliza os nomes de competicao usados na vitrine do treinador', () => {
  assert.equal(slugCompeticao('Copa Libertadores'), 'copa-libertadores');
  assert.equal(slugCompeticao('Türkiye Kupası'), 'turkiye-kupasi');
});

test('resolve nomes oficiais e aliases para as imagens de taça correspondentes', () => {
  const casos = [
    ['Copa Libertadores', 'libertadores'],
    ['UEFA Champions League', 'champions-league'],
    ['AFC Champions League Elite', 'champions-asiatica'],
    ['CONCACAF Champions Cup', 'concacaf-champions'],
    ['Copa del Rey', 'copa-do-rei'],
    ['Coupe de France', 'copa-da-franca'],
    ['Saudi Pro League', 'liga-saudita'],
    ['MLS Cup', 'mls'],
    ['Campeonato Brasileiro Série A', 'brasileirao'],
    ['Campeonato Brasileiro Série B', 'brasileirao-serie-b'],
    ['Taça de Portugal', 'taca-de-portugal']
  ];
  for (const [nome, arquivo] of casos) {
    assert.equal(resolverImagemCompeticao(nome, imagens), imagens[arquivo], nome);
  }
});

test('nao usa a imagem de outra taça quando o torneio não tem arquivo', () => {
  assert.equal(resolverImagemCompeticao("King's Cup", imagens), null);
  assert.equal(resolverImagemCompeticao('Copa da Turquia', imagens), null);
});
