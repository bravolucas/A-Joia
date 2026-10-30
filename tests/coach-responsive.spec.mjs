import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../rapido.js';
import { iniciarCarreiraTecnico } from '../tecnico.js';

const cenarios = [
  {
    id: 'acesso',
    ano: 2043,
    clube: 'Confiança',
    liga: 'serieB',
    temporada: {
      posicao: 2,
      pontos: 65,
      vitorias: 19,
      empates: 8,
      derrotas: 11,
      acesso: { de: 'serieB', para: 'brasileirao' },
    },
    dialogo: 'Acesso de divisão',
    titulo: 'ACESSO!',
  },
  {
    id: 'titulo',
    ano: 2043,
    clube: 'Confiança',
    liga: 'serieB',
    temporada: {
      posicao: 1,
      pontos: 72,
      vitorias: 22,
      empates: 6,
      derrotas: 10,
      campeao: true,
      titulosConquistados: ['Copa do Brasil'],
    },
    dialogo: 'Título conquistado',
    titulo: 'CAMPEÃO!',
  },
  {
    id: 'rebaixamento',
    ano: 2043,
    clube: 'Confiança',
    liga: 'brasileirao',
    temporada: {
      posicao: 18,
      pontos: 34,
      vitorias: 8,
      empates: 10,
      derrotas: 20,
      rebaixado: { de: 'brasileirao', para: 'serieB' },
    },
    dialogo: 'Rebaixamento',
    titulo: 'REBAIXADO',
  },
];

function criarSave(cenario) {
  let c = criarJogador({
    nome: 'Teste responsivo técnico',
    nac: 'BRA',
    posicao: 'ATA',
    personalidade: 'equilibrado',
    origem: 'base',
    pe: 'destro',
    numero: 10,
    ritmo: 'normal',
    codigo: `QA-${cenario.id}`,
  });
  c = aposentar({ ...c, idade: 40 });
  c = iniciarCarreiraTecnico(c);
  const partida = {
    ano: c.tecnico.ano,
    clube: c.tecnico.clube,
    liga: c.tecnico.liga,
    objetivo: 'Evitar rebaixamento',
    cumpriuObjetivo: true,
    ...cenario.temporada,
  };
  c.tecnico = {
    ...c.tecnico,
    ano: c.tecnico.ano + 1,
    clube: cenario.clube,
    liga: cenario.liga,
    clubeInicialEscolhido: true,
    fase: 'resultado',
    temporadas: [partida],
    propostas: [],
    rebaixado: undefined,
    desempregado: false,
    demitido: false,
  };
  return { v: 1, etapa: 'tecnico', c };
}

for (const width of [390, 1366]) {
  for (const cenario of cenarios) {
    test(`pop-up de ${cenario.id} no treinador em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const erros = [];
      page.on('pageerror', erro => erros.push(erro.message));
      await page.goto('http://127.0.0.1:4173/A-Joia/');
      await page.evaluate(save => localStorage.setItem('ajoia_rapido_v1', JSON.stringify(save)), criarSave(cenario));
      await page.reload();

      await expect(page.getByRole('button', { name: /Continuar · Teste responsivo técnico/ })).toBeVisible();
      await page.getByRole('button', { name: /Continuar · Teste responsivo técnico/ }).click();
      await expect(page.getByRole('dialog', { name: cenario.dialogo })).toBeVisible();
      await expect(page.getByRole('heading', { name: cenario.titulo })).toBeVisible();
      if (cenario.id === 'titulo') await expect(page.locator('[role="dialog"] img[src*="copa-do-brasil"]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      expect(erros).toEqual([]);
      await page.screenshot({ path: `test-results/treinador-${cenario.id}-${width}.png`, fullPage: true });
    });
  }
}

test('campanhas de copa exibem grupos e todas as partidas do mata-mata', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const save = criarSave({
    id: 'copas',
    clube: 'Confiança',
    liga: 'serieB',
    temporada: {
      posicao: 8,
      pontos: 50,
      vitorias: 14,
      empates: 8,
      derrotas: 16,
      torneios: [{
        nome: 'Copa Libertadores',
        tipo: 'continental',
        faseUsuario: 'Semifinal',
        jogosUsuario: [{ fase: 'Fase de grupos · Grupo A', casa: 'Confiança', fora: 'River Plate', golsCasa: 2, golsFora: 1 }],
        grupos: [{
          grupo: 'A',
          classificacao: [
            { nome: 'Confiança', pontos: 13, golsPro: 12, golsContra: 4, vitorias: 4 },
            { nome: 'River Plate', pontos: 10, golsPro: 9, golsContra: 6, vitorias: 3 }
          ],
          jogos: [{ fase: 'Fase de grupos · Grupo A', casa: 'Confiança', fora: 'River Plate', golsCasa: 2, golsFora: 1 }]
        }],
        fases: [{
          fase: 'Semifinal',
          rodada: 3,
          jogos: [{ fase: 'Semifinal', rodada: 3, casa: 'Confiança', fora: 'Boca Juniors', golsCasa: 1, golsFora: 1, penaltis: 'Casa', vencedor: 'Confiança' }]
        }]
      }]
    }
  });
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(value => localStorage.setItem('ajoia_rapido_v1', JSON.stringify(value)), save);
  await page.reload();
  await page.getByRole('button', { name: /Continuar · Teste responsivo técnico/ }).click();
  await page.locator('summary').filter({ hasText: 'Copa Libertadores' }).click();
  await expect(page.getByText('Grupo A · tabela e partidas')).toBeVisible();
  await page.getByText('Grupo A · tabela e partidas').click();
  await expect(page.getByText('River Plate', { exact: true }).first()).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Semifinal' }).last().click();
  await expect(page.getByText('Boca Juniors', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});
