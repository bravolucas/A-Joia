import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE7} from '../src/dados/acervoClubesHistoricosLote7.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('os 20 clubes atuais do catalogo da Serie B possuem fichas historicas',()=>{
 const times=CLUBES.filter(c=>c.liga==='serieB');
 assert.equal(times.length,20);
 for(const time of times){
  const ficha=acervoClubeHistoricoDe(time.nome);
  assert.ok(ficha,time.nome+' ainda sem ficha historica');
  assert.ok(ficha.atletas.length,time.nome+' com ficha vazia');
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(t=>t.nome===time.nome)?.cobertura,'parcial_documentado');
 }
});
test('novo lote de 7 clubes da Serie B referencia atletas, marcos e fontes reais',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE7).length,7);
 assert.ok(Object.keys(ACERVO_CLUBES_HISTORICOS).length>=101);
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE7)){
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  for(const jogador of c.atletas){
   assert.ok(jogador.nome&&jogador.posicao&&jogador.descricao);
   assert.match(jogador.fonte,/^https:\/\//);
   for(const k of ['jogos','gols'])
    assert.ok(jogador[k]===null||(Number.isInteger(jogador[k])&&jogador[k]>0));
  }
  for(const marco of c.marcos)assert.ok(marco.fonte.startsWith('https://')&&marco.titulo&&marco.descricao);
  assert.equal(c.recordes.length,0,'recortes de uma temporada nao podem virar marcas de carreira automaticamente');
 }
 assert.equal(acervoClubeHistoricoDe('Botafogo-SP').atletas.length,2);
 assert.ok(acervoClubeHistoricoDe('Vila Nova').marcos.some(x=>x.ano===1996));
 assert.ok(acervoClubeHistoricoDe('São Bernardo').marcos.some(x=>x.ano===2025));
});
