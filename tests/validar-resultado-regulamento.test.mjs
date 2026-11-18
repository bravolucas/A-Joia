import test from 'node:test';
import assert from 'node:assert/strict';
import {criarCampanhaCopa,decisaoCopa,registrarPlacarCopa} from '../src/treinador/copasEscolha.js';

function campanha(nome){
 const clubes=Array.from({length:16},(_,i)=>({nome:'Clube '+i,forca:65+i}));
 return criarCampanhaCopa({nome,tipo:'continental',usuario:clubes[0].nome,
  forcaUsuario:clubes[0].forca,clubes,ano:2026,formato:'mata',seed:'regulamento-validacao'});
}
test('Concacaf: registro ao vivo preserva o vencedor real por gols fora',()=>{
 const c=campanha('CONCACAF Champions Cup'),d=decisaoCopa(c),a=c.usuario,b=d.adversario;
 const ida={casa:a,fora:b,golsCasa:2,golsFora:1},volta={casa:b,fora:a,golsCasa:1,golsFora:0};
 const placar={casa:a,fora:b,golsCasa:2,golsFora:2,partidas:[ida,volta],
  vencedor:b,criterio:'gols-fora',agregado:true};
 const ok=registrarPlacarCopa(c,d.chave,placar);
 assert.equal(ok.jogosUsuario[0].vencedor,b);
 assert.equal(ok.jogosUsuario[0].criterio,'gols-fora');
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{...placar,vencedor:a}),/gols fora/);
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{...placar,penaltis:true}),/gols fora/);
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{...placar,vencedor:undefined}),/gols fora/);
});
test('Concacaf: proíbe declarar gols fora quando não há vantagem',()=>{
 const c=campanha('CONCACAF Champions Cup'),d=decisaoCopa(c),a=c.usuario,b=d.adversario;
 const ida={casa:a,fora:b,golsCasa:1,golsFora:0},volta={casa:b,fora:a,golsCasa:1,golsFora:0};
 const placar={casa:a,fora:b,golsCasa:1,golsFora:1,partidas:[ida,volta],
  vencedor:a,criterio:'gols-fora',agregado:true};
 assert.throws(()=>registrarPlacarCopa(c,d.chave,placar),/não corresponde/);
});
test('Libertadores não usa gols fora para definir empates agregados',()=>{
 const c=campanha('Copa Libertadores'),d=decisaoCopa(c),a=c.usuario,b=d.adversario;
 const ida={casa:a,fora:b,golsCasa:2,golsFora:1},volta={casa:b,fora:a,golsCasa:1,golsFora:0};
 const placar={casa:a,fora:b,golsCasa:2,golsFora:2,partidas:[ida,volta],
  vencedor:a,penaltis:true,agregado:true};
 const ok=registrarPlacarCopa(c,d.chave,placar);
 assert.equal(ok.jogosUsuario[0].vencedor,a);
 assert.equal(ok.jogosUsuario[0].penaltis,true);
});
