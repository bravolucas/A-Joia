import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
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

test('todos os 18 clubes da MLS têm perfis individuais com recortes documentados', () => {
  const clubes = CLUBES.filter(clube => clube.liga === 'mls');
  assert.equal(clubes.length, 18);
  for (const {nome} of clubes) {
    const ficha = ACERVO_CLUBES_LOTE38[nome];
    assert.ok(ficha.atletas.length >= 1, nome);
    assert.ok(ficha.marcos.length >= 1, nome);
    for (const atleta of ficha.atletas) {
      assert.match(atleta.fonte, /^https:\/\//);
      assert.match(atleta.periodo, /20\d{2}/);
      assert.equal(atleta.jogos, null);
      assert.equal(atleta.gols, null);
    }
  }
  const messi = ACERVO_CLUBES_LOTE38['Inter Miami'].atletas.find(a => a.nome === 'Lionel Messi');
  assert.match(messi.descricao, /temporada regular de 2024.*final da MLS Cup de 2025/);
});

test('todos os 18 clubes neerlandeses têm perfil individual e os recortes de gols são preservados', () => {
  const clubes = CLUBES.filter(clube => clube.liga === 'holanda');
  assert.equal(clubes.length, 18);
  for (const {nome} of clubes) assert.ok(coberturaHistoricaDe('clube', nome).atletasDocumentados > 0, nome);
  const pavlidisAZ = ACERVO_CLUBES_LOTE38.AZ.atletas[0];
  const pavlidisWillem = ACERVO_CLUBES_LOTE38['Willem II'].atletas[0];
  assert.equal(pavlidisAZ.nome, pavlidisWillem.nome);
  assert.notEqual(pavlidisAZ.fonte, pavlidisWillem.fonte);
  assert.match(pavlidisAZ.descricao, /29 gols na edição/);
  assert.equal(pavlidisAZ.gols, null);
  assert.match(pavlidisWillem.descricao, /33 gols em 82 jogos pelo clube/);
  const immers = ACERVO_CLUBES_LOTE38['ADO Den Haag'].atletas[0];
  assert.equal(immers.jogos, 259);
  assert.equal(immers.gols, 49);
});

test('as duas divisões portuguesas têm perfis e distinguem as passagens do mesmo atleta', () => {
  const clubes = CLUBES.filter(clube => ['portugal', 'portugal2'].includes(clube.liga));
  assert.equal(clubes.length, 26);
  for (const {nome} of clubes) assert.ok(coberturaHistoricaDe('clube', nome).atletasDocumentados > 0, nome);
  const casaPia = ACERVO_CLUBES_LOTE38['Casa Pia'].atletas[0];
  const rioAve = ACERVO_CLUBES_LOTE38['Rio Ave'].atletas[0];
  assert.equal(casaPia.nome, rioAve.nome);
  assert.notEqual(casaPia.periodo, rioAve.periodo);
  assert.notEqual(casaPia.fonte, rioAve.fonte);
  const horta = ACERVO_CLUBES_LOTE38.Braga.atletas[0];
  assert.match(horta.descricao, /fevereiro de 2025.*410 jogos e 134 gols/);
  assert.equal(horta.gols, null);
});

test('os 35 clubes das divisões francesas têm perfis e preservam o escopo das fontes', () => {
  const clubes = CLUBES.filter(clube => ['franca', 'franca2'].includes(clube.liga));
  assert.equal(clubes.length, 35);
  for (const {nome} of clubes) assert.ok(coberturaHistoricaDe('clube', nome).atletasDocumentados > 0, nome);
  const corredor = acervoClubeHistoricoDe('Rodez').atletas[0];
  assert.match(corredor.descricao, /19 gols e oito assistências somando todas as competições da temporada/);
  assert.equal(corredor.gols, null);
  const redStar = acervoClubeHistoricoDe('Red Star').atletas;
  assert.match(redStar.find(a => a.nome === 'Merwan Ifnaoui').descricao, /melhor jogador do Championnat National/);
  assert.match(redStar.find(a => a.nome === 'Quentin Beunardeau').descricao, /melhor goleiro do Championnat National/);
});

test('a primeira divisão alemã tem perfis e os aliases compartilham os mesmos atletas', () => {
  const clubes = CLUBES.filter(clube => clube.liga === 'alemanha');
  assert.equal(clubes.length, 18);
  for (const {nome} of clubes) assert.ok(coberturaHistoricaDe('clube', nome).atletasDocumentados > 0, nome);

  const hamburgo = acervoClubeHistoricoDe('Hamburgo');
  const hsv = acervoClubeHistoricoDe('Hamburger SV');
  assert.equal(hamburgo.atletas, hsv.atletas);
  assert.equal(acervoClubeHistoricoDe('Köln').atletas, acervoClubeHistoricoDe('FC Köln').atletas);
  assert.match(hsv.atletas[0].descricao, /30 gols em 30 partidas.*edição inaugural/);
  assert.equal(hsv.atletas[0].gols, null);
  assert.match(acervoClubeHistoricoDe('Elversberg').atletas[0].descricao, /18 gols na segunda divisão/);
});
