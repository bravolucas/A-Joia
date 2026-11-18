import test from 'node:test';
import assert from 'node:assert/strict';
import {gerarMundoJogadores} from '../src/comum/lib.js';
import {JOGADORES_REAIS_BASE} from '../src/dados/data.js';
import {metadadosAtletaReal} from '../src/dados/metadadosAtletasReais.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const buscar=(m,j)=>m.jogadores.find(x=>x.nome===j.nome&&x.clubeNome===j.time);

test('jogadores reais identificados têm identidade do catálogo e metadados verificáveis sem estimativas',()=>{
 const mundo=gerarMundoJogadores(geradorTecnico('real-proveniencia'));
 for(const [nome,time] of [['Lionel Messi','Inter Miami'],['Lamine Yamal','Barcelona'],['Jude Bellingham','Real Madrid']]){
  const atleta=mundo.jogadores.find(p=>p.nome===nome&&p.clubeNome===time);
  assert.ok(atleta);
  assert.equal(atleta.origemCadastroReal,true);
  assert.notEqual(atleta.idadeEstimada,true);
  assert.notEqual(atleta.nacionalidadeEstimada,true);
 }
});

test('dados biográficos incompletos são explicitamente assinalados sem inventar fontes',()=>{
 const naoVerificado=JOGADORES_REAIS_BASE.find(j=>!metadadosAtletaReal(j.nome,j.time)&&!j.nac);
 assert.ok(naoVerificado,'catálogo deve conter identidade ainda sem metadados');
 const seed='real-semantica-provisoria';
 const mundo=gerarMundoJogadores(geradorTecnico(seed));
 const atleta=buscar(mundo,naoVerificado);
 assert.ok(atleta);
 assert.equal(atleta.origemCadastroReal,true);
 assert.equal(atleta.idadeEstimada,true);
 assert.equal(atleta.nacionalidadeEstimada,true);
 assert.ok(Number.isInteger(atleta.idade),'idade estimada continua funcional');
 assert.ok(typeof atleta.nac==='string'&&atleta.nac.length>0,'nacionalidade provisória permanece funcional');
 assert.equal(metadadosAtletaReal(atleta.nome,atleta.clubeNome),null);
});

test('atletas gerados procedurais não são identificados como pessoas reais',()=>{
 const mundo=gerarMundoJogadores(geradorTecnico('real-procedurais'));
 const procedurais=mundo.jogadores.filter(p=>!JOGADORES_REAIS_BASE.some(j=>j.nome===p.nome&&j.time===p.clubeNome));
 assert.ok(procedurais.length>100);
 assert.ok(procedurais.every(p=>p.origemCadastroReal!==true));
 assert.ok(procedurais.every(p=>p.idadeEstimada!==true&&p.nacionalidadeEstimada!==true));
});

test('marcadores de procedência não consomem RNG extra, alteram dados de outros atletas ou quebram o JSON',()=>{
 const seed='real-compatibilidade';
 const original=structuredClone(JOGADORES_REAIS_BASE);
 const primeiro=gerarMundoJogadores(geradorTecnico(seed));
 const segundo=gerarMundoJogadores(geradorTecnico(seed));
 assert.deepEqual(primeiro,segundo);
 assert.deepEqual(JOGADORES_REAIS_BASE,original);
 const serializado=JSON.parse(JSON.stringify(primeiro));
 assert.deepEqual(serializado,primeiro);
 assert.equal(new Set(primeiro.jogadores.map(p=>String(p.id))).size,primeiro.jogadores.length);
});
