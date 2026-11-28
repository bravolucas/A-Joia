import test from 'node:test';import assert from 'node:assert/strict';
import {normalizarAparencia} from '../src/comum/aparenciaCinematica.js';
import {grauGrisalho,camadaCabelo} from '../src/comum/cabeloCinematico.js';
test('escolha capilar é persistente e opcional em saves antigos',()=>{
 assert.deepEqual(normalizarAparencia({tom:'bronze',cabelo:'loiro'}),{versao:1,modelo:'a',tom:'bronze',cabelo:'loiro'});
 assert.equal(normalizarAparencia({cabelo:'inválido'}).cabelo,undefined);
 assert.equal(normalizarAparencia({cabelo:'original'}).cabelo,undefined);
});
test('grisalhamento usa idade e faixas limitadas',()=>{
 assert.deepEqual([16,35,43,51,59,67,75,85].map(grauGrisalho),[0,0,1,2,3,4,5,5]);
 assert.equal(grauGrisalho(undefined),0);
});
test('máscara localizada exclui pele clara, tecido, troféu e transparência',()=>{
 const w=720,h=768,p=new Uint8ClampedArray(w*h*4),at=(x,y)=>(y*w+x)*4;
 p.set([40,30,25,255],at(345,35));p.set([190,135,100,255],at(345,36));p.set([20,48,147,255],at(346,35));p.set([40,30,25,255],at(345,300));p.set([40,30,25,0],at(347,35));
 const out=camadaCabelo(p,w,h,'jogador-neutro',{cabelo:'loiro'},0);
 assert.ok(out[at(345,35)]>40);assert.equal(out[at(345,35)+3],255);
 for(const [x,y]of[[345,36],[346,35],[345,300],[347,35]])assert.equal(out[at(x,y)+3],0);
 assert.equal(camadaCabelo(p,w,h,'bola-ouro-b',{cabelo:'loiro'},5).some(Boolean),false);
 assert.equal(camadaCabelo(p,w,h,'jogador-neutro',{},0).some(Boolean),false);
});
