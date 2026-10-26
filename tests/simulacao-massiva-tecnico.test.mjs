import test from 'node:test';
import assert from 'node:assert/strict';
import {
  iniciarCarreiraTecnico, iniciarNoClubeIdolo, tomarDecisaoTecnico,
  cartaAtualTecnico, simularEtapaTecnico, reuniaoEmergenciaTecnico,
  proximaTemporadaTecnico, passarAnoDesempregado, negociarContratoTecnico,
  QUANTIDADE_DECISOES_TECNICO, ETAPAS_TEMPORADA_TECNICO,
  tabelaClassificacaoTecnico, historicoProfissionalTecnico
} from '../tecnico.js';

function rngSequencia(semente) {
  let estado = semente >>> 0;
  return () => {
    estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}
function preparar(c, rng) {
  let atual = c;
  if (!atual.tecnico.clubeInicialEscolhido && !atual.tecnico.temporadas.length) {
    const opcao = atual.tecnico.opcoesInicio?.[0];
    if (opcao) atual = iniciarNoClubeIdolo(atual, opcao.clube);
  }
  for (let i = atual.tecnico.decisoes.length; i < QUANTIDADE_DECISOES_TECNICO; i++) {
    const carta = cartaAtualTecnico(atual.tecnico);
    assert.ok(carta, 'carta deve estar disponível');
    atual = tomarDecisaoTecnico(atual, carta.opcoes[Math.floor(rng() * carta.opcoes.length)].id, rng);
  }
  return atual;
}
test('simulação massiva: 80 carreiras, diferentes legados, estilos, resultados e salvamentos', () => {
  const estatisticas = { temporadas: 0, jogos: 0, demissoes: 0, reunioes: 0, desemprego: 0, propostas: 0 };
  for (let indice = 1; indice <= 80; indice++) {
    const rng = rngSequencia(indice * 7919);
    const atleta = { nome: 'Treinador ' + indice, idade: 40, ano: 2045, clubeNome: 'Clube A',
      aposentado: true, legado: { pontos: (indice % 8) * 150 }, temporadas: [{ ano: 2044 }], totais: { gols: indice * 3 } };
    let c = iniciarCarreiraTecnico(atleta);
    for (let ano = 0; ano < 5; ano++) {
      if (c.tecnico.fase === 'resultado') {
        if (c.tecnico.demitido || c.tecnico.desempregado) {
          const proposta = c.tecnico.propostas?.[0];
          if (proposta && indice % 3 !== 0) {
            const negociado = negociarContratoTecnico(c, proposta.nome, 'prudente', rng);
            if (negociado.tecnico.ultimaNegociacao?.aceita) {
              c = negociado;
              estatisticas.propostas++;
              c = proximaTemporadaTecnico(c);
            } else c = passarAnoDesempregado(negociado, rng);
          } else {
            c = passarAnoDesempregado(c, rng);
            estatisticas.desemprego++;
          }
        } else c = proximaTemporadaTecnico(c);
      }
      if (c.tecnico.fase !== 'pretemporada') continue;
      c = preparar(c, rng);
      for (const rodada of ETAPAS_TEMPORADA_TECNICO) {
        c = simularEtapaTecnico(c, rng);
        assert.equal(c.tecnico.andamento?.jogos ?? c.tecnico.temporadas.at(-1)?.jogos ?? 38, rodada);
        const a = c.tecnico.andamento || { ...c.tecnico.temporadas.at(-1), jogos: c.tecnico.temporadas.at(-1)?.jogos ?? 38, confrontos: c.tecnico.temporadas.at(-1)?.confrontos || [] };
        assert.equal(a.vitorias + a.empates + a.derrotas, a.jogos);
        assert.equal(a.pontos, 3 * a.vitorias + a.empates);
        assert.equal(a.confrontos.length, a.jogos);
        for (const jogo of a.confrontos) {
          assert.ok(Number.isInteger(jogo.golsPro) && jogo.golsPro >= 0);
          assert.ok(Number.isInteger(jogo.golsContra) && jogo.golsContra >= 0);
          assert.equal(jogo.resultado, jogo.golsPro > jogo.golsContra ? 'V' : jogo.golsPro === jogo.golsContra ? 'E' : 'D');
        }
        const tabela = tabelaClassificacaoTecnico(c.tecnico, a);
        assert.ok(Array.isArray(tabela));
        if (c.tecnico.reuniaoPendente) {
          estatisticas.reunioes++;
          c = reuniaoEmergenciaTecnico(c, ['responsabilidade', 'reforcos', 'defesa'][indice % 3], rng);
        }
        if (c.tecnico.fase === 'resultado') break;
      }
      const save = JSON.parse(JSON.stringify(c));
      assert.deepEqual(save.tecnico.temporadas, c.tecnico.temporadas);
      c = save;
      if (c.tecnico.fase === 'resultado') {
        estatisticas.temporadas++;
        const ultima = c.tecnico.temporadas.at(-1);
        assert.ok(ultima);
        estatisticas.jogos += ultima.jogos ?? (ultima.vitorias + ultima.empates + ultima.derrotas);
        if (ultima.demitido || ultima.interrompida) estatisticas.demissoes++;
        assert.ok(historicoProfissionalTecnico(c.tecnico).jogos >= 0);
      }
    }
  }
  assert.ok(estatisticas.temporadas >= 100, JSON.stringify(estatisticas));
  assert.ok(estatisticas.jogos >= 1000, JSON.stringify(estatisticas));
});
