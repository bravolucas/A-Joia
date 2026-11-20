import test from 'node:test';
import assert from 'node:assert/strict';
import {consultarRecordesFutebol,prepararIndiceAtletasRecordes} from '../src/historia/recordesFutebol.js';
import {detectarQuebrasRecordesFutebol} from '../src/historia/noticiasRecordes.js';

const linha=(ano,clube,gols,comp='Brasileirão')=>[
 ano,clube,38,gols,8,null,null,[],null,0,[[comp,32,gols-2,7,0,0]]
];
const fixture=()=>({nome:'Você',nac:'BRA',universo:{desde:2027,atletas:{
 '10':{id:'10',nome:'Rival',historico:[
  linha(2027,'Santos',16),linha(2028,'Milan',25,'UEFA Champions League')
 ]},
 '11':{id:'11',nome:'Outro',historico:[
  linha(2028,'Santos',18),linha(2029,'Santos',21)
 ]},
 voce:{id:'voce',nome:'Você',historico:[
  linha(2028,'Santos',19,'Brasileirão'),linha(2029,'Chelsea',28,'Champions League')
 ]}
 },edicoes:[]}});

const casos=[
 {tipo:'clube',nome:'Santos'}, {tipo:'clube',nome:'Milan'},
 {tipo:'clube',nome:'Chelsea'}, {tipo:'clube',nome:'Sem elenco'},
 {tipo:'competicao',nome:'Brasileirão'},
 {tipo:'competicao',nome:'Champions League'},
 {tipo:'competicao',nome:'UEFA Champions League'},
 {tipo:'competicao',nome:'Copa do Brasil'}
];
test('indice temporario preserva todas as metricas de clube e torneio do save',()=>{
 const c=fixture(),antes=JSON.stringify(c);
 const indice=prepararIndiceAtletasRecordes(c,casos);
 for(const {tipo,nome} of casos)
  assert.deepEqual(
   consultarRecordesFutebol(c,tipo,nome,[],indice),
   consultarRecordesFutebol(c,tipo,nome,[]),
   'Resultado diferente para '+tipo+' / '+nome
  );
 assert.equal(JSON.stringify(c),antes);
});
test('escopos aliases de Champions compartilham dados sem duplicar jogadores',()=>{
 const c=fixture();
 const indice=prepararIndiceAtletasRecordes(c,casos);
 assert.equal(indice.grupos.get('competicao|championsleague').size,2);
 assert.equal(indice.grupos.get('clube|santos').size,3);
 const dados=consultarRecordesFutebol(c,'competicao','Liga dos Campeões',[],indice);
 assert.equal(dados.recordes.find(x=>x.id==='golsCarreira').simulado.valor,26);
});
test('cada snapshot usa seu proprio indice sem misturar saves',()=>{
 const antes=fixture(),depois=structuredClone(antes);
 depois.universo.atletas['11'].historico.push(linha(2030,'Santos',29));
 const escopos=[{tipo:'clube',nome:'Santos'},{tipo:'competicao',nome:'Brasileirão'}];
 const antigo=prepararIndiceAtletasRecordes(antes,escopos);
 const novo=prepararIndiceAtletasRecordes(depois,escopos);
 assert.equal(consultarRecordesFutebol(antes,'clube','Santos',[],antigo)
  .recordes.find(x=>x.id==='golsCarreira').simulado.valor,39);
 assert.equal(consultarRecordesFutebol(depois,'clube','Santos',[],novo)
  .recordes.find(x=>x.id==='golsCarreira').simulado.valor,68);
});
test('manchetes multi-escopo continuam equivalentes ao resultado de consulta direta',()=>{
 const antes=fixture(),depois=structuredClone(antes);
 depois.universo.atletas['11'].historico.push(linha(2030,'Santos',29));
 const escopos=[{tipo:'clube',nome:'Santos'},{tipo:'competicao',nome:'Brasileirão'}];
 const eventos=detectarQuebrasRecordesFutebol(antes,depois,{ano:2030,escopos,limite:30});
 assert.ok(eventos.some(x=>x.metrica==='golsCarreira'&&x.entidade==='Santos'));
 assert.ok(eventos.every(x=>x.ano===2030));
 assert.deepEqual(detectarQuebrasRecordesFutebol(depois,depois,{ano:2030,escopos}),[]);
});
test('indice lida com centenas de atletas e vinte anos sem alterar o arquivo',()=>{
 const c=fixture(),original=JSON.stringify(c);
 for(let j=0;j<600;j++)c.universo.atletas['extra-'+j]={
  id:'extra-'+j,nome:'Atleta '+j,
  historico:Array.from({length:20},(_,i)=>linha(2030+i,i%2?'Santos':'Milan',(i+j)%20+1,i%2?'Brasileirão':'Serie A'))
 };
 const indice=prepararIndiceAtletasRecordes(c,casos);
 for(const {tipo,nome} of casos)
  assert.deepEqual(consultarRecordesFutebol(c,tipo,nome,[],indice),
   consultarRecordesFutebol(c,tipo,nome,[]));
 assert.equal(Object.keys(c.universo.atletas).length,603);
 assert.ok(original.length>100);
});
