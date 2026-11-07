import test from 'node:test';
import assert from 'node:assert/strict';
import {perfilTaticoTecnico} from '../src/treinador/taticasTecnico.js';
import {definirEstiloTecnico,definirFormacaoTecnico,probabilidadesConfrontoTecnico,placarTecnico,forcaClubeTecnico} from '../src/treinador/tecnico.js';
const estado=()=>({tecnico:{clube:'Santos',elenco:65,fase:'pretemporada',temporadas:[]}});
test('formações valorizam os setores e mantêm compatibilidade sem gestão',()=>{
 assert.deepEqual(perfilTaticoTecnico({}),{estilo:'equilibrado',formacao:'4-4-2',ajuste:0});
 const t=estado().tecnico;t.gestao={clube:t.clube,elenco:['GOL','DEF','MEI','ATA'].flatMap(setor=>Array.from({length:6},()=>({setor,qualidade:setor==='ATA'?90:50})))};
 const antes=structuredClone(t);
 assert.ok(perfilTaticoTecnico({...t,formacao:'4-3-3'}).ajuste>0);
 assert.ok(probabilidadesConfrontoTecnico({...t,formacao:'4-3-3'},{forca:65,casa:true}).vitoria>probabilidadesConfrontoTecnico({...t,formacao:'4-4-2'},{forca:65,casa:true}).vitoria);
 assert.deepEqual(t,antes);
 assert.equal(perfilTaticoTecnico({...t,formacao:'4-4-2'}).ajuste,0);
 t.gestao.elenco.forEach(j=>j.qualidade=j.setor==='MEI'?90:50);
 assert.ok(perfilTaticoTecnico({...t,formacao:'3-5-2'}).ajuste>0);
 assert.ok(perfilTaticoTecnico({...t,formacao:'4-3-3'}).ajuste<0);
 assert.equal(perfilTaticoTecnico({...antes,gestao:{...antes.gestao,clube:'Outro'}}).ajuste,0);
});
test('estilos têm riscos contextuais, probabilidades válidas e ritmos distintos',()=>{
 const odds=(elenco,estilo)=>probabilidadesConfrontoTecnico({elenco,estilo},{forca:65,casa:true});
 assert.ok(odds(85,'ofensivo').vitoria>odds(85,'equilibrado').vitoria);
 assert.ok(odds(45,'ofensivo').vitoria<odds(45,'equilibrado').vitoria);
 assert.ok(odds(45,'defensivo').vitoria>odds(45,'equilibrado').vitoria);
 assert.ok(odds(85,'defensivo').vitoria<odds(85,'equilibrado').vitoria);
 assert.ok(odds(65,'defensivo').empate>odds(65,'ofensivo').empate);
 for(const elenco of [10,50,95])for(const estilo of ['ofensivo','defensivo','equilibrado']){
  const p=odds(elenco,estilo);assert.ok(Object.values(p).every(n=>n>=0&&n<=1));assert.ok(Math.abs(p.vitoria+p.empate+p.derrota-1)<1e-10);
  for(const resultado of ['V','E','D']){const placar=placarTecnico(resultado,()=>.9,estilo);assert.equal(Math.sign(placar.pro-placar.contra),resultado==='V'?1:resultado==='D'?-1:0);}
 }
 assert.ok(placarTecnico('V',()=>.9,'ofensivo').pro>placarTecnico('V',()=>.9,'defensivo').pro);
 assert.equal(forcaClubeTecnico({clube:'Santos',elenco:40}),40);
});
test('tática persiste sem mutar entrada e bloqueia alterações durante a temporada',()=>{
 const c=estado(),antes=structuredClone(c);
 const novo=definirEstiloTecnico(definirFormacaoTecnico(c,'3-5-2'),'defensivo');
 assert.deepEqual(c,antes);assert.equal(novo.tecnico.formacao,'3-5-2');assert.equal(novo.tecnico.estilo,'defensivo');
 assert.deepEqual(JSON.parse(JSON.stringify(novo)),novo);
 for(const patch of [{fase:'resultado'},{andamento:{rodadas:1}},{desempregado:true},{temporadas:Array(30).fill({})}]){
  const invalido={tecnico:{...c.tecnico,...patch}};assert.throws(()=>definirEstiloTecnico(invalido,'ofensivo'));assert.throws(()=>definirFormacaoTecnico(invalido,'4-3-3'));
 }
 assert.throws(()=>definirFormacaoTecnico(c,'0-0-10'),/inválida/);
});
