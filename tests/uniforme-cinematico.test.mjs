import test from 'node:test';
import assert from 'node:assert/strict';
import {tecidoAzul,roupaAdaptavel,camadaUniforme} from '../src/comum/uniformeCinematico.js';
test('recolore tecido azul sem mexer na pele, preto, branco ou transparência',()=>{
 const p=new Uint8ClampedArray([20,48,147,255,190,135,100,255,10,10,10,255,240,240,240,255,20,48,147,0]);
 const r=camadaUniforme(p,5,1,'vitoria',{base:'#cc2233',padrao:'lisa'});
 assert.ok(r[0]>r[2]);assert.equal(r[3],255);
 assert.deepEqual([...r.slice(4)],Array(16).fill(0));
 assert.equal(tecidoAzul(190,135,100,255),false);
});
test('ternos, técnico e aposentadoria não recebem filtro esportivo',()=>{
 for(const id of ['gala-aplausos','bola-ouro-a','treinador-prancheta','despedida-chuteiras']){
 assert.equal(roupaAdaptavel(id),false);
 assert.deepEqual([...camadaUniforme(new Uint8ClampedArray([20,48,147,255]),1,1,id,{base:'#f00'})],[0,0,0,0]);
 }
});
test('padrão horizontal altera duas faixas somente dentro da camisa',()=>{
 const p=new Uint8ClampedArray(720*768*4);for(const y of [150,190])p.set([20,48,147,255],(y*720+350)*4);
 const r=camadaUniforme(p,720,768,'vitoria',{base:'#cc2233',secundaria:'#111111',padrao:'horizontais'});
 assert.ok(r[(150*720+350)*4]>r[(190*720+350)*4]);
});
