import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import {
  iniciarCarreiraTecnico, simularTemporadaTecnico,
  QUANTIDADE_DECISOES_TECNICO,
} from '../src/treinador/tecnico.js';

const rng = seed => () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;

for (const ano of [2026, 2028]) {
  test(`Modo Treinador na Série C em ${ano}: acesso, título e liga seguinte refletem a fase final`, () => {
    const clube = 'Guarani';
    const atleta = {
      nome: 'Carreira Série C', idade: 40, ano, aposentado: true, clubeNome: clube,
      legado: { pontos: 700 }, temporadas: [], totais: { gols: 140 },
    };
    const inicio = iniciarCarreiraTecnico(atleta);
    const ligasMundo = ano >= 2028 ? Object.fromEntries(CLUBES.filter(c => c.liga === 'serieD')
      .slice(0, 8).map(c => [c.nome, 'serieC'])) : {};
    const pronto = { ...inicio, tecnico: {
      ...inicio.tecnico,
      clube, liga: 'serieC', pais: 'Brasil', ano, elenco: 56,
      ligasMundo, diretoria: 95, torcida: 95,
      decisoes: Array.from({ length: QUANTIDADE_DECISOES_TECNICO }, () => ({
        carta: 'auditoria-serie-c', opcao: 'neutra',
      })),
    } };
    const fim = simularTemporadaTecnico(pronto, rng(ano + 1700));
    const temporada = fim.tecnico.temporadas.at(-1);
    const edicao = temporada.classificacoesMundo?.serieC?.edicaoSerieC;
    assert.ok(edicao, `quadrangulares ausentes da carreira ${ano}`);
    assert.equal(temporada.classificacoesMundo.serieC.origem, 'serie-c-treinador');
    assert.equal(edicao.regulamento.participantes, ano === 2026 ? 20 : 28);
    assert.equal(temporada.jogos, ano === 2026 ? 19 : 26);
    assert.ok(edicao.promovidos.length === 4);
    assert.equal(temporada.campeao, edicao.campeao === clube,
      'líder da primeira fase não recebe título da Série C automaticamente');
    assert.equal(Boolean(temporada.acesso), edicao.promovidos.includes(clube),
      'o acesso depende do quadrangular, não da posição inicial');
    assert.equal(fim.tecnico.liga, edicao.promovidos.includes(clube) ? 'serieB' : 'serieC');
    assert.equal(fim.tecnico.ligasMundo[clube], fim.tecnico.liga);
  });
}
