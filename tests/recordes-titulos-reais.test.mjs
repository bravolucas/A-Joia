import test from 'node:test';
import assert from 'node:assert/strict';
import {recordesReaisTitulosCompeticao} from '../src/historia/recordesTitulosReais.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

const buscar=(nome,id)=>recordesReaisTitulosCompeticao('competicao',nome).find(r=>r.id===id);
test('Copa do Mundo: acervo de titulos reais aponta Brasil com cinco titulos',()=>{
 const marca=buscar('Copa do Mundo','titulosTotal');
 assert.equal(marca.atleta,'Brasil');
 assert.equal(marca.valor,5);
 assert.equal(marca.cobertura,'completa');
 assert.ok(marca.fonte.startsWith('https://'));
 assert.equal(buscar('Copa do Mundo','titulosConsecutivos').valor,2);
});
test('Champions League: recordes de titulos refletem campeoes documentados',()=>{
 const madrid=buscar('Champions League','titulosTotal');
 assert.equal(madrid.atleta,'Real Madrid');
 assert.equal(madrid.valor,15);
 assert.equal(madrid.cobertura,'completa');
 assert.equal(buscar('Conference League','titulosTotal').valor,1);
 assert.equal(buscar('Conference League','titulosConsecutivos'),undefined);
});
test('Brasileirao de 1971 e copas nacionais sao rotulados como recortes',()=>{
 const recorte=buscar('Brasileirão','titulosTotal');
 assert.ok(recorte.valor>0);
 assert.equal(recorte.cobertura,'recorte');
 assert.ok(recorte.data.includes('1971'));
 const copa=buscar('Copa do Brasil','titulosTotal');
 assert.equal(copa.atleta,'Cruzeiro');
 assert.equal(copa.valor,6);
 assert.ok(recordesReaisTitulosCompeticao('competicao','Copa fictícia').length===0);
});
test('comparacao visual nao trata periodos parciais como recordes reais superados',()=>{
 const c={universo:{edicoes:[{ano:2028,nome:'Brasileirão',tipo:'liga',
  campeao:'Palmeiras',classificacao:[],jogos:{nomes:[],partidas:[]}}]}};
 const parcial=consultarRecordesFutebol(c,'competicao','Brasileirão').recordes.find(r=>r.id==='titulosTotal');
 assert.equal(parcial.real.cobertura,'recorte');
 assert.equal(parcial.simulado.valor,1);
 assert.equal(parcial.status,'Referência de período documentado');
 const mundial=consultarRecordesFutebol({},'competicao','Copa do Mundo');
 assert.equal(mundial.recordes.find(r=>r.id==='titulosTotal').real.valor,5);
});
