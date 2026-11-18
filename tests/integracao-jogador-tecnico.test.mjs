import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {
  criarJogador, jogarTemporada, fecharTemporada, aposentar,
  aposentadoriaForcada, podeAposentar, noticiasDaTemporada,
  retrospectoRivalidade, ovrDe
} from '../src/jogador/rapido.js';
import {
  iniciarCarreiraTecnico, iniciarNoClubeIdolo, cartaAtualTecnico,
  tomarDecisaoTecnico, simularEtapaTecnico, reuniaoEmergenciaTecnico,
  proximaTemporadaTecnico, QUANTIDADE_DECISOES_TECNICO,
  ETAPAS_TEMPORADA_TECNICO, historicoProfissionalTecnico
} from '../src/treinador/tecnico.js';

const posicoes = ['GOL','ZAG','LD','LE','VOL','MC','MEI','PD','PE','SA','ATA'];
const perfis = ['equilibrado','festeiro','disciplinado'];
function criar(i) {
  return criarJogador({ nome: 'Integração ' + i, nac: 'BRA', posicao: posicoes[i % posicoes.length],
    personalidade: perfis[i % perfis.length], origem: 'base', pe: i % 2 ? 'canhoto' : 'destro',
    numero: (i % 20) + 1, ritmo: 'equilibrado', codigo: 'INTEGRACAO' + i });
}
// O comportamento local sem variáveis de ambiente continua executando as 32 carreiras.
// No CI, quatro partições complementares distribuem as mesmas 32 carreiras em runners.
const TOTAL_CARREIRAS = 32;
const PARTES_CI = Number(process.env.A_JOIA_INTEGRACAO_PARTES || 1);
const PARTE_CI = Number(process.env.A_JOIA_INTEGRACAO_PARTE || 1);
if (!Number.isInteger(PARTES_CI) || !Number.isInteger(PARTE_CI) ||
    PARTES_CI < 1 || TOTAL_CARREIRAS % PARTES_CI !== 0 ||
    PARTE_CI < 1 || PARTE_CI > PARTES_CI) {
  throw new Error('Partição de carreiras inválida.');
}
const INDICES_CARREIRAS = Array.from({ length: TOTAL_CARREIRAS }, (_, i) => i)
  .filter(i => i % PARTES_CI === PARTE_CI - 1);
test(`carreiras de jogador até aposentadoria e transição para técnico — ${INDICES_CARREIRAS.length}/32 (parte ${PARTE_CI}/${PARTES_CI})`, () => {
  let totalTemporadas = 0, totalJogosTecnico = 0;
  for (const i of INDICES_CARREIRAS) {
    let c = criar(i);
    const primeiroAno = c.ano;
    for (let temporada = 0; c.idade < 40 && temporada < 30; temporada++) {
      const anterior = c;
      const { c: simulado, card } = jogarTemporada(c);
      assert.ok(card && Number.isFinite(card.jogos));
      const resultado = fecharTemporada(simulado, card);
      c = JSON.parse(JSON.stringify(resultado.c));
      totalTemporadas++;
      assert.equal(c.ano, anterior.ano + 1);
      assert.equal(c.temporadas.length, temporada + 1);
      assert.ok(Array.isArray(noticiasDaTemporada(c, resultado.card)));
      const rivalidade = retrospectoRivalidade(c);
      assert.equal(rivalidade.anos.length, c.temporadas.filter(t => t.rival).length);
    }
    assert.equal(c.idade, 40);
    assert.ok(c.ano > primeiroAno);
    assert.ok(podeAposentar(c));
    assert.ok(aposentadoriaForcada(c));
    const registroJogador = structuredClone(c.temporadas);
    c = aposentar(c);
    assert.equal(c.aposentado, true);
    assert.ok(c.legado && Number.isFinite(c.legado.pontos));
    c = iniciarCarreiraTecnico(c);
    assert.deepEqual(c.temporadas, registroJogador);
    assert.equal(c.tecnico.temporadas.length, 0);
    if (c.tecnico.opcoesInicio?.length) c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
    for (let j = 0; j < QUANTIDADE_DECISOES_TECNICO; j++) {
      const carta = cartaAtualTecnico(c.tecnico);
      assert.ok(carta);
      c = tomarDecisaoTecnico(c, carta.opcoes[0].id, () => 0.9);
    }
    for (const rodada of ETAPAS_TEMPORADA_TECNICO) {
      c = simularEtapaTecnico(c, () => 0.4);
      assert.equal(c.tecnico.andamento?.jogos ?? c.tecnico.temporadas.at(-1)?.jogos ?? 38, rodada);
      if (c.tecnico.reuniaoPendente) c = reuniaoEmergenciaTecnico(c, 'responsabilidade', () => 0.9);
      if (c.tecnico.fase === 'resultado') break;
    }
    assert.equal(c.tecnico.fase, 'resultado');
    assert.equal(c.tecnico.temporadas.length, 1);
    assert.deepEqual(c.temporadas, registroJogador);
    assert.ok(historicoProfissionalTecnico(c.tecnico).jogos > 0);
    totalJogosTecnico += c.tecnico.temporadas[0].jogos ?? 38;
    assert.ok(Number.isFinite(ovrDe(c)));
  }
  // O limiar proporcional preserva a exigência global original sem enfraquecê-la.
  // No CI, o agregador também verifica todos os índices 0..31 e o limiar GLOBAL.
  assert.equal(INDICES_CARREIRAS.length * PARTES_CI, TOTAL_CARREIRAS);
  assert.ok(totalTemporadas > 300 * INDICES_CARREIRAS.length / TOTAL_CARREIRAS);
  assert.ok(totalJogosTecnico >= 320 * INDICES_CARREIRAS.length / TOTAL_CARREIRAS);
  if(PARTES_CI>1){
    mkdirSync('resultados-auditoria',{recursive:true});
    writeFileSync(`resultados-auditoria/integracao-parte-${PARTE_CI}.json`,JSON.stringify({
      tipo:'integracao-jogador-tecnico-v1',total:TOTAL_CARREIRAS,
      partes:PARTES_CI,parte:PARTE_CI,indices:INDICES_CARREIRAS,
      temporadas:totalTemporadas,jogosTecnico:totalJogosTecnico,
    },null,2));
  }
});
