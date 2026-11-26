import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE17} from '../src/dados/acervoClubesHistoricosLote17.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 17 cadastra clubes reais do jogo com referências documentais',()=>{
 const nomes=['Konyaspor','Kocaelispor','Gençlerbirliği','Al-Nassr'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE17).sort(),nomes.sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'identidade ausente em data.js: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha,'ficha ausente: '+nome);
  assert.ok(ficha.atletas.length>0,'atletas: '+nome);
  assert.ok(ficha.marcos.length>0,'marcos: '+nome);
  assert.equal(ficha.recordes.length,0,'não declarar recordes não comprovados');
  for(const atleta of ficha.atletas){
   assert.equal(atleta.jogos,null);
   assert.equal(atleta.gols,null);
   assert.ok(atleta.fonte.startsWith('https://'));
  }
  for(const marco of ficha.marcos) assert.ok(marco.fonte.startsWith('https://'));
 }
});
