import test from 'node:test';
import assert from 'node:assert/strict';
import {ANO_INICIO,anoTemporadaCarreira,anoRegistroTemporada,CLUBES} from '../src/dados/data.js';
import {ANO_INICIAL,criarJogador} from '../src/jogador/rapido.js';
import {normalizarSave} from '../src/completo/save.js';
import {prepararCopaPersistente} from '../src/completo/copasPersistentes.js';
import {aplicarVagaTemporada} from '../src/completo/mundoTemporada.js';

test('nova carreira rápida começa em 2026 em todas as origens',()=>{
 assert.equal(ANO_INICIO,2026);assert.equal(ANO_INICIAL,ANO_INICIO);
 for(const origem of ['base','varzea','herdeiro','prodigio']){
  const c=criarJogador({nome:'Ano Inicial',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem,codigo:'ANO-2026'});
  assert.equal(c.ano,2026);assert.equal(c.idade,16);assert.equal(c.temporadas.length,0);
 }
});
test('save antigo preserva calendário, rótulos e anos explícitos sem mutar o original',()=>{
 const s={carreira:{idade:24},temporadas:[{idade:16,temporadaLabel:'2025/2026'},{idade:17},{idade:18,ano:2040}]},antes=structuredClone(s);
 const r=normalizarSave(s);assert.equal(r.carreira.anoInicio,2025);assert.equal(anoTemporadaCarreira(r.carreira),2033);
 assert.deepEqual(r.temporadas.map(t=>t.ano),[2025,2026,2040]);assert.deepEqual(normalizarSave(r),r);assert.deepEqual(s,antes);
});
test('nova carreira completa mantém 2026 ao salvar, recarregar e avançar a idade',()=>{
 const s=normalizarSave({carreira:{anoInicio:ANO_INICIO,idade:16},temporadas:[]});
 const r=normalizarSave(JSON.parse(JSON.stringify(s)));assert.equal(anoTemporadaCarreira(r.carreira),2026);
 r.carreira.idade++;assert.equal(anoTemporadaCarreira(r.carreira),2027);
 assert.equal(anoRegistroTemporada(r.carreira,{idade:16}),2026);assert.equal(anoRegistroTemporada(r.carreira,{idade:16,temporadaLabel:'2025/2026'}),2025);
});
test('copas e vagas do completo usam o ano do save novo ou legado',()=>{
 for(const anoInicio of [2025,2026]){
  const c={anoInicio,idade:16,clube:CLUBES.find(c=>c.nome==='Santos'),vagasInternacionaisAno:anoInicio,vagasLigasSimuladas:['brasileirao'],vagasInternacionaisClubes:{}};
  const card={copasPersistentesVersao:1,continentalPendente:{nome:'Libertadores'}};
  prepararCopaPersistente(c,card,'estadual',65);assert.equal(card.campanhasCompletas.estadual.ano,anoInicio);
  assert.equal(aplicarVagaTemporada(c,card).continentalPendente,null);
 }
});
