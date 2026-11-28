import test from 'node:test';import assert from 'node:assert/strict';
import {marcasDaPose,limparEscudoApresentacao} from '../src/comum/marcasCinematicas.js';
test('marcas calibradas por pose e número de 1 a 99',()=>{
 const a=marcasDaPose('vitoria',11,true);assert.equal(a.numero.valor,11);assert.equal(a.escudo.length,4);
 assert.equal(marcasDaPose('vitoria',100,true).numero,undefined);
 assert.equal(marcasDaPose('vitoria',10,false).escudo,undefined);
 assert.equal(marcasDaPose('apresentacao-camisa',11,true).limparEscudo,true);
 assert.equal(marcasDaPose('apresentacao-camisa',11,true).numero,undefined);
 for(const id of ['bola-ouro-a','gala-aplausos','treinador-prancheta','reabilitacao'])assert.deepEqual(marcasDaPose(id,10,true),{});
});
test('limpeza local do escudo preserva pixels fora do recorte',()=>{
 const w=720,h=768,p=new Uint8ClampedArray(w*h*4),c=new Uint8ClampedArray(p.length);
 for(let y=227;y<270;y++)for(let x=300;x<392;x++)p.set(x>=350?[210,170,30,255]:[20,48,147,255],(y*w+x)*4);
 limparEscudoApresentacao(p,c,w,h);
 assert.deepEqual([...c.slice((248*w+370)*4,(248*w+370)*4+4)],[20,48,147,255]);
 assert.equal(c[(248*w+300)*4+3],0);assert.equal(c[(10*w+370)*4+3],0);
});
