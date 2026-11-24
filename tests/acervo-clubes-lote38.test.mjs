import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {ACERVO_CLUBES_LOTE38} from '../src/dados/acervoClubesHistoricosLote38.js';

test('162 novas fichas documentam as últimas lacunas do catálogo principal', () => {
  const nomes = new Set(CLUBES.map(clube => clube.nome));
  assert.equal(Object.keys(ACERVO_CLUBES_LOTE38).length, 162);
  for (const [nome, ficha] of Object.entries(ACERVO_CLUBES_LOTE38)) {
    assert.ok(nomes.has(nome), nome);
    assert.ok(ficha.marcos.some(marco => /^https:\/\/www\.rsssf\.com\/tables.\/\w+\d{4}\.html#\w+$/.test(marco.fonte)), nome);
    assert.ok(ficha.marcos.every(marco => !marco.titulo.includes('undefined') && Number.isInteger(marco.ano)), nome);
    assert.equal(ficha.recordes.length, 0);
  }
  for (const nome of nomes) assert.equal(coberturaHistoricaDe('clube', nome).cobertura, 'parcial_documentado', nome);
});

test('nomes alternativos do mesmo clube compartilham as fontes e os marcos', () => {
  assert.equal(ACERVO_CLUBES_LOTE38.Hamburgo.marcos, ACERVO_CLUBES_LOTE38['Hamburger SV'].marcos);
  assert.equal(ACERVO_CLUBES_LOTE38.Köln.marcos, ACERVO_CLUBES_LOTE38['FC Köln'].marcos);
});

test('classificação da conferência e resultado da final da MLS mantêm seus recortes', () => {
  const miami = ACERVO_CLUBES_LOTE38['Inter Miami'].marcos;
  assert.ok(miami.some(m => m.titulo === '1º lugar · MLS · fase regular · Conferência Leste 2024' && /74 pontos/.test(m.descricao)));
  assert.ok(miami.some(m => m.ano === 2025 && m.titulo === 'Campeão da MLS Cup' && /3 a 1/.test(m.descricao)));
  assert.ok(ACERVO_CLUBES_LOTE38['Vancouver Whitecaps'].marcos.some(m => m.ano === 2025 && m.titulo === 'Finalista da MLS Cup'));
});
