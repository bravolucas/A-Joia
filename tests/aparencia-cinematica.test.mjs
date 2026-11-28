import test from 'node:test';import assert from 'node:assert/strict';
import {normalizarAparencia,camadaAparencia,pixelPele,combinarCamadas} from '../src/comum/aparenciaCinematica.js';
test('saves antigos e valores inválidos preservam modelo original',()=>{
 assert.deepEqual(normalizarAparencia(),{versao:1,modelo:'a',tom:'original'});
 assert.equal(normalizarAparencia({modelo:'b',tom:'inválido'}).tom,'original');
 assert.deepEqual(normalizarAparencia({tom:'bronze'}),{versao:1,modelo:'a',tom:'bronze'});
});
test('tom muda a pele sem afetar tecido azul, terno, branco ou transparência',()=>{
 const p=new Uint8ClampedArray([190,135,100,255,20,48,147,255,22,24,27,255,240,240,240,255,190,135,100,0]);
 const a=camadaAparencia(p,5,1,'jogador-neutro',{tom:'escuro'});
 assert.ok(a[0]<190&&a[3]===255);assert.deepEqual([...a.slice(4)],Array(16).fill(0));
 assert.equal(pixelPele(20,48,147,255),false);
 assert.deepEqual([...camadaAparencia(p,5,1,'jogador-neutro',{})],Array(20).fill(0));
});
test('ouro do troféu protegido e variante b não alterada',()=>{
 const p=new Uint8ClampedArray(720*768*4);p.set([190,135,100,255],(70*720+360)*4);p.set([190,135,100,255],(210*720+375)*4);
 const r=camadaAparencia(p,720,768,'bola-ouro-a',{tom:'bronze'});
 assert.equal(r[(70*720+360)*4+3],255);assert.equal(r[(210*720+375)*4+3],0);
 assert.equal(camadaAparencia(p,720,768,'bola-ouro-b',{tom:'escuro'}).some(Boolean),false);
});
test('camadas combinadas mantêm pixels não sobrepostos',()=>{assert.deepEqual([...combinarCamadas(new Uint8ClampedArray([1,2,3,255,0,0,0,0]),new Uint8ClampedArray([0,0,0,0,4,5,6,255]))],[1,2,3,255,4,5,6,255])});
