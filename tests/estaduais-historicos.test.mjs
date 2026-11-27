import test from 'node:test';
import assert from 'node:assert/strict';
import { HISTORICO_ESTADUAIS, edicoesEstaduaisHistoricas } from '../src/dados/estaduaisHistoricos.js';

const CAMPEOES = {
  AC: { 2025: 'Independência', 2026: 'Santa Cruz-AC' },
  AP: { 2025: 'Trem', 2026: 'Santos-AP' },
  DF: { 2025: 'Gama', 2026: 'Gama' },
  ES: { 2025: 'Rio Branco-ES', 2026: 'Porto Vitória' },
  MA: { 2025: 'Maranhão', 2026: 'IAPE' },
  MT: { 2025: 'Primavera-MT', 2026: 'Mixto' },
  MS: { 2025: 'Operário-MS', 2026: 'Operário-MS' },
  PB: { 2025: 'Sousa', 2026: 'Botafogo-PB' },
  PI: { 2025: 'Piauí-PI', 2026: 'Piauí-PI' },
  RN: { 2025: 'América-RN', 2026: 'América-RN' },
  RO: { 2025: 'Porto Velho', 2026: 'Guaporé-RO' },
  RR: { 2025: 'GAS', 2026: 'GAS' },
  TO: { 2025: 'Araguaína', 2026: 'Tocantinópolis' },
  SE: { 2025: 'Confiança', 2026: 'Sergipe' },
  SP: { 2025: 'Corinthians', 2026: 'Palmeiras' },
  RJ: { 2025: 'Flamengo', 2026: 'Flamengo' },
  MG: { 2025: 'Atlético-MG', 2026: 'Cruzeiro' },
  RS: { 2025: 'Internacional', 2026: 'Grêmio' },
  PR: { 2025: 'Operário-PR', 2026: 'Operário-PR' },
  BA: { 2025: 'Bahia', 2026: 'Bahia' },
  CE: { 2025: 'Ceará', 2026: 'Fortaleza' },
  PE: { 2025: 'Sport Recife', 2026: 'Sport Recife' },
  SC: { 2025: 'Avaí', 2026: 'Barra-SC' },
  GO: { 2025: 'Vila Nova', 2026: 'Goiás' },
  PA: { 2025: 'Remo', 2026: 'Paysandu' },
  AM: { 2025: 'Amazonas FC', 2026: 'Nacional-AM' },
  AL: { 2025: 'CRB', 2026: 'CRB' },
};

test('acervo estadual cobre os 27 estados e DF até 2026', () => {
  assert.equal(Object.keys(HISTORICO_ESTADUAIS).length, 27);
  for (const [uf, registro] of Object.entries(HISTORICO_ESTADUAIS)) {
    assert.equal(registro.ate, 2026, uf);
    assert.ok(registro.fontes.some(url => url.includes('veja-todos-os-campeoes-estaduais-do-brasil-em-2025')), uf);
    assert.ok(registro.fontes.some(url => url.includes('quebras-de-jejuns-titulos-ineditos')), uf);
  }
});

test('campeões de 2025 e 2026 correspondem às listas publicadas pelo ge', () => {
  for (const [uf, anos] of Object.entries(CAMPEOES)) {
    const registro = HISTORICO_ESTADUAIS[uf];
    for (const [anoTexto, clube] of Object.entries(anos)) {
      const ano = Number(anoTexto);
      assert.ok(registro.clubes[clube]?.includes(ano), `${uf} ${ano}: ${clube} ausente`);
      const edicao = edicoesEstaduaisHistoricas(registro.nome).find(item => item.ano === ano);
      assert.ok(edicao?.campeoes.some(item => item.clube === clube), `${registro.nome} ${ano}: campeão não aparece na edição`);
    }
  }
});

test('anos históricos anteriores são preservados ao atualizar o corte documental', () => {
  assert.ok(HISTORICO_ESTADUAIS.AC.clubes['Independência'].includes(2024));
  assert.ok(HISTORICO_ESTADUAIS.SP.clubes['Palmeiras'].includes(2024));
  assert.ok(HISTORICO_ESTADUAIS.RN.clubes['América-RN'].includes(2024));
});
