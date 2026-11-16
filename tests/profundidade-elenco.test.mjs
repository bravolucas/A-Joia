import test from 'node:test';
import assert from 'node:assert/strict';
import { MINIMOS_ELENCO, TOTAL_MINIMO_ELENCO, normalizarPosicao, diagnosticarElenco } from '../src/simulacao/profundidadeElenco.js';

test('mínimos do elenco cobrem 22 atletas e dez posições', () => {
  assert.equal(TOTAL_MINIMO_ELENCO, 22);
  assert.equal(Object.keys(MINIMOS_ELENCO).length, 10);
});
test('elenco vazio detecta todas as carências', () => {
  const diagnostico = diagnosticarElenco([]);
  assert.equal(diagnostico.totalFaltante, 22);
  assert.equal(diagnostico.faltantes.GOL, 3);
  assert.equal(diagnostico.faltantes.ZAG, 4);
  assert.equal(diagnostico.completo, false);
});
test('diagnóstico não considera aposentados nem atletas de outro clube', () => {
  const elenco = [{posicao:'GOL',clubeNome:'A'},{posicao:'GOL',clubeNome:'B'},{posicao:'GOL',clubeNome:'A',aposentado:true}];
  assert.equal(diagnosticarElenco(elenco,{clubeNome:'A'}).faltantes.GOL, 2);
});
test('SA conta como centroavante e nomes alternativos são reconhecidos', () => {
  assert.equal(normalizarPosicao('sa'),'ATA');
  assert.equal(normalizarPosicao('RW'),'PD');
  assert.equal(normalizarPosicao('desconhecida'),null);
});
test('não duplica atletas com posições secundárias', () => {
  const elenco = [{posicao:'LD', posicoesSecundarias:['LE','MC']}];
  const d = diagnosticarElenco(elenco,{contarSecundarias:true});
  assert.equal(d.contagem.LD,1);
  assert.equal(d.contagem.LE,0);
  assert.equal(d.totalFaltante,21);
});
test('um plantel no mínimo de cada posição é completo', () => {
  const elenco=Object.entries(MINIMOS_ELENCO).flatMap(([posicao,n])=>Array.from({length:n},()=>({posicao})));
  assert.equal(diagnosticarElenco(elenco).completo,true);
});
