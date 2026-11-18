import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {prepararCamisaClube} from '../src/jogador/camisasCarreira.js';
import {gerarNomeRegional} from '../src/simulacao/nomesRegionais.js';

const hash=s=>[...String(s)].reduce((a,v)=>Math.imul(a^v.charCodeAt(0),16777619)>>>0,2166136261);
const carreira=clubeNome=>({codigo:'CAMISA-CULTURAL',clubeNome,ano:2030,
 numero:10,numeroFavorito:10,temporadas:[{ano:2029,numero:9}]});
const primeiroNome=nome=>String(nome).split(/\s+/)[0];
const amostra=nac=>new Set(Array.from({length:200},(_,i)=>
 primeiroNome(gerarNomeRegional(nac,()=>i/200))));

const LIGAS_NAC={
 brasileirao:'BRA',serieB:'BRA',argentina:'ARG',
 inglaterra:'ENG',inglaterra2:'ENG',espanha:'ESP',espanha2:'ESP',
 italia:'ITA',italia2:'ITA',alemanha:'ALE',alemanha2:'ALE',
 franca:'FRA',franca2:'FRA',portugal:'POR',portugal2:'POR',
 holanda:'HOL',arabia:'ARS',mls:'EUA',turquia:'TUR',sulamericano:'INT',
};

test('os 24 nomes do painel de camisas respeitam origem das 20 ligas e não se repetem',()=>{
 for(const [liga,nac] of Object.entries(LIGAS_NAC)){
  const cl=CLUBES.find(x=>x.liga===liga);
  assert.ok(cl,'Liga sem clube para teste: '+liga);
  const c=carreira(cl.nome),kit=prepararCamisaClube(c,cl.nome);
  assert.equal(kit.elenco.length,24,cl.nome);
  assert.equal(new Set(kit.elenco.map(x=>x.nome)).size,24,cl.nome);
  const pool=amostra(nac);
  for(const p of kit.elenco){
   assert.ok(pool.has(primeiroNome(p.nome)),
    `${cl.nome} (${liga}) recebeu nome fora do catálogo ${nac}: ${p.nome}`);
   assert.equal(p.ficticio,true);
  }
 }
});

test('números, IDs, ordem e flags fictícias permanecem idênticos ao algoritmo legado',()=>{
 for(const cl of CLUBES.filter((x,i)=>i%23===0).slice(0,15)){
  const c=carreira(cl.nome),kit=prepararCamisaClube(c,cl.nome);
  const nums=Array.from({length:35},(_,i)=>i+1)
   .sort((a,b)=>hash(`${c.codigo}:${cl.nome}:${a}`)-hash(`${c.codigo}:${cl.nome}:${b}`))
   .slice(0,24);
  assert.deepEqual(kit.elenco.map(x=>x.numero),nums);
  assert.deepEqual(kit.elenco.map(x=>x.id),
   nums.map((_,i)=>`camisa:${cl.nome}:${i}`));
  assert.deepEqual(kit.elenco.map(x=>x.ficticio),Array(24).fill(true));
  assert.deepEqual(c.temporadas,[{ano:2029,numero:9}]);
 }
});

test('novo kit é determinístico, mas nomes do save antigo nunca são substituídos',()=>{
 const c=carreira('Manchester City'),primeiro=prepararCamisaClube(c,'Manchester City');
 const clone=carreira('Manchester City'),segundo=prepararCamisaClube(clone,'Manchester City');
 assert.deepEqual(primeiro.elenco,segundo.elenco);
 primeiro.elenco[0].nome='Nome Brasileiro Legado';
 const anterior=structuredClone(primeiro);
 assert.deepEqual(prepararCamisaClube(c,'Manchester City'),anterior);
 assert.equal(c.camisas.clubes['Manchester City'].elenco[0].nome,'Nome Brasileiro Legado');
 assert.deepEqual(JSON.parse(JSON.stringify(c.camisas)),c.camisas);
});

test('clube sem liga conhecida usa origem neutra, nunca o catálogo brasileiro obrigatório',()=>{
 const c=carreira('Clube Fictício Sem Liga');
 const kit=prepararCamisaClube(c,c.clubeNome);
 assert.equal(kit.elenco.length,24);
 const neutros=amostra('INT');
 assert.ok(kit.elenco.every(p=>neutros.has(primeiroNome(p.nome))));
});
