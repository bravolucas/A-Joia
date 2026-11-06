import test from 'node:test';
import assert from 'node:assert/strict';
import {gerarCenaPasse} from '../lib.js';

test('cenas de passe mantêm companheiros e adversários separados, inclusive nos extremos do sorteio',()=>{
  const original=Math.random;
  try{
    for(const valor of [0,.25,.5,.75,.999999]){
      Math.random=()=>valor;
      const cena=gerarCenaPasse(),atletas=[...cena.companheiros,...cena.adversarios];
      assert.ok(cena.companheiros.length>=2&&cena.companheiros.length<=4);
      assert.ok(cena.adversarios.length>=2&&cena.adversarios.length<=4);
      for(let i=0;i<atletas.length;i++)for(let j=i+1;j<atletas.length;j++){
        assert.ok(Math.hypot(atletas[i].x-atletas[j].x,atletas[i].y-atletas[j].y)>=40,'participantes precisam ocupar posições distintas e legíveis');
      }
      assert.ok(atletas.every(a=>a.x>=28&&a.x<=292&&a.y>=34&&a.y<=160));
    }
  }finally{Math.random=original;}
});
