import test from 'node:test';
import assert from 'node:assert/strict';
import {FORMACAO_433} from '../src/dados/data.js';
import {FORMACOES_TECNICO} from '../src/treinador/taticasTecnico.js';
import {setorJogador} from '../src/simulacao/forcaEquipe.js';
import {FORMACOES_POSICIONAIS_TECNICO,escalarOnzePosicionalTecnico} from '../src/treinador/escalacaoPosicionalTecnico.js';

const base=formacao=>FORMACOES_POSICIONAIS_TECNICO[formacao]
  .map((posicao,i)=>({id:'j'+i,nome:'Atleta '+i,posicao,ovr:87-i,nac:'BRA',
    clubeNome:'Santos',idade:25,aposentado:false}));

test('os três esquemas descrevem onze posições exatas e os mesmos pesos setoriais do treinador',()=>{
 assert.deepEqual(FORMACOES_POSICIONAIS_TECNICO['4-3-3'],FORMACAO_433);
 for(const formacao of FORMACOES_TECNICO){
  const vagas=FORMACOES_POSICIONAIS_TECNICO[formacao.id];
  assert.equal(vagas.length,11);
  const contagem={GOL:0,DEF:0,MEI:0,ATA:0};
  for(const posicao of vagas)contagem[setorJogador({posicao})]++;
  assert.deepEqual(contagem,formacao.pesos);
  const r=escalarOnzePosicionalTecnico(base(formacao.id),formacao.id);
  assert.equal(r.titulares.length,11);
  assert.equal(r.vagasAbertas,0);
  assert.deepEqual(r.titulares.map(j=>j.posicao),vagas);
  assert.equal(new Set(r.titulares.map(j=>j.jogador.id)).size,11);
  assert.ok(r.titulares.every(j=>j.posicao===j.jogador.posicao));
 }
});

test('lateral apto como secundária cobre LE, sem duplicar jogador em LD',()=>{
 const atletas=base('4-3-3');
 const lateral=atletas.find(j=>j.posicao==='LE');
 lateral.posicao='LD';
 lateral.posicoesSecundarias=[{posicao:'LE',apto:true}];
 const anterior=structuredClone(atletas);
 const r=escalarOnzePosicionalTecnico(atletas,'4-3-3');
 assert.equal(r.vagasAbertas,0);
 assert.equal(r.titulares.find(j=>j.posicao==='LE').jogador.id,lateral.id);
 assert.equal(r.titulares.find(j=>j.posicao==='LE').secundaria,true);
 assert.notEqual(r.titulares.find(j=>j.posicao==='LD').jogador.id,lateral.id);
 assert.equal(new Set(r.titulares.map(j=>j.jogador.id)).size,11);
 assert.deepEqual(atletas,anterior);
});

test('string, nível numérico e aptidão falsa não criam lateral-esquerdo',()=>{
 for(const extras of [['LE'],[{posicao:'LE',nivel:99}],[{posicao:'LE',apto:false}]]){
  const atletas=base('4-3-3');
  const lateral=atletas.find(j=>j.posicao==='LE');
  lateral.posicao='LD';
  lateral.posicoesSecundarias=extras;
  const r=escalarOnzePosicionalTecnico(atletas,'4-3-3');
  assert.equal(r.vagasAbertas,1);
  assert.equal(r.titulares.find(j=>j.posicao==='LE').jogador,null);
  assert.ok(r.titulares.every(j=>!j.jogador||!j.jogador.improvisado));
 }
});

test('lesão, suspensão e aposentadoria retiram titulares sem contratar fantasmas',()=>{
 const e=base('4-4-2');
 e[1].suspenso=true;
 e[5].lesao={jogosRestantes:3};
 e[9].aposentado=true;
 const anterior=structuredClone(e);
 const r=escalarOnzePosicionalTecnico(e,'4-4-2');
 assert.equal(r.vagasAbertas,3);
 const ids=r.titulares.filter(j=>j.jogador).map(j=>j.jogador.id);
 assert.ok(!ids.includes(e[1].id)&&!ids.includes(e[5].id)&&!ids.includes(e[9].id));
 assert.equal(r.titulares.length,11);
 assert.deepEqual(e,anterior);
});

test('banco preserva um goleiro reserva e não repete IDs do onze',()=>{
 const e=[...base('3-5-2'),
  {id:'g2',posicao:'GOL',ovr:52},
  ...Array.from({length:11},(_,i)=>({id:'b'+i,posicao:'MC',ovr:80+i}))];
 const c=structuredClone(e);
 const r=escalarOnzePosicionalTecnico(e,'3-5-2');
 assert.equal(r.banco.length,7);
 assert.ok(r.banco.some(j=>j.id==='g2'),'o segundo goleiro deve estar entre os reservas');
 const ids=r.titulares.filter(j=>j.jogador).map(j=>j.jogador.id).concat(r.banco.map(j=>j.id));
 assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(e,c);
});

test('IDs repetidos do cadastro não são duas pessoas e sem formação conhecida usa padrão 4-4-2',()=>{
 const e=base('4-4-2');
 const r=escalarOnzePosicionalTecnico([...e,{...e[0],ovr:99}], 'formacao-antiga');
 assert.equal(r.formacao,'4-4-2');
 assert.equal(r.titulares.length,11);
 assert.equal(r.vagasAbertas,0);
 assert.equal(new Set(r.titulares.map(j=>j.jogador.id)).size,11);
 assert.deepEqual(escalarOnzePosicionalTecnico([],null).banco,[]);
});
