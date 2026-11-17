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


test('posição secundária com aptidão explícita cobre lacuna sem duplicar atletas', () => {
  const base = Object.entries(MINIMOS_ELENCO).flatMap(([posicao,n]) =>
    Array.from({length:n},() => ({posicao})));
  const indice = base.findIndex(p=>p.posicao==='LE');
  base.splice(indice,1);
  base.push({posicao:'LD',posicoesSecundarias:[{posicao:'LE',apto:true}]});
  assert.equal(base.length,22);
  assert.equal(diagnosticarElenco(base).faltantes.LE,1);
  const resultado=diagnosticarElenco(base,{contarSecundarias:true});
  assert.equal(resultado.completo,true);
  assert.equal(resultado.contagem.LD,2);
  assert.equal(resultado.contagem.LE,2);
  assert.equal(Object.values(resultado.contagem).reduce((a,b)=>a+b,0),22);
});

test('não assume aptidão sem evidência, nem impõe limite numérico arbitrário', () => {
  const elenco=[
    {posicao:'LD',posicoesSecundarias:['LE']},
    {posicao:'LD'},
    // O terceiro LD só é usado como LE se houver aptidão comprovada.
    {posicao:'LD',posicoesSecundarias:[{posicao:'LE',proficiencia:75}]},
  ];
  assert.equal(diagnosticarElenco(elenco,{contarSecundarias:true}).contagem.LE,0);
  assert.equal(diagnosticarElenco(elenco,{contarSecundarias:true,proficienciaMinima:70}).contagem.LE,1);
  assert.equal(diagnosticarElenco(elenco,{contarSecundarias:true,proficienciaMinima:80}).contagem.LE,0);
  assert.equal(diagnosticarElenco(elenco,{contarSecundarias:true}).contagem.LD,2);
});

test('reposicionamento não altera objeto do atleta e não depende da ordem de preenchimento', () => {
  const jogadores=[
    {id:1,posicao:'LD',posicoesSecundarias:[{posicao:'LE',apta:true}]},
    {id:2,posicao:'LD'},
    {id:3,posicao:'LE'},
  ];
  const anterior=structuredClone(jogadores);
  const a=diagnosticarElenco(jogadores,{contarSecundarias:true});
  const b=diagnosticarElenco(jogadores.slice().reverse(),{contarSecundarias:true});
  assert.equal(a.contagem.LD,2);
  assert.equal(a.contagem.LE,1);
  assert.deepEqual(a.faltantes,b.faltantes);
  assert.deepEqual(jogadores,anterior);
});
