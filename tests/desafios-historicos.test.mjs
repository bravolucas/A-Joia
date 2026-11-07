import test from 'node:test';
import assert from 'node:assert/strict';
import {DESAFIOS_HISTORICOS,CHAVE_DESAFIOS,estadoInicialDesafios,iniciarDesafioHistorico,atualizarDesafioHistorico,carregarDesafiosHistoricos,salvarDesafiosHistoricos} from '../src/desafios/desafiosHistoricos.js';
import {jogarTemporadaExpressaTecnico} from '../src/treinador/tecnico.js';
test('missões usam uma temporada e preservam catálogo e estado anterior',()=>{
 const base=estadoInicialDesafios(),antes=structuredClone(base),catalogo=structuredClone(DESAFIOS_HISTORICOS);
 for(const d of DESAFIOS_HISTORICOS){
  const s=iniciarDesafioHistorico(base,d.id);assert.equal(s.ativo.c.tecnico.clube,d.clube);assert.equal(s.ativo.c.tecnico.ano,d.ano);
  assert.equal(s.ativo.c.tecnico.gestao.saldo,d.orcamento);assert.equal(s.tentativas[d.id],1);
  assert.throws(()=>iniciarDesafioHistorico(s,d.id),/Conclua/);
  const c=jogarTemporadaExpressaTecnico(s.ativo.c,null,()=>.5),final=atualizarDesafioHistorico(s,c);
  assert.equal(final.ativo.contabilizado,true);assert.equal(c.tecnico.temporadas.length,1);
  assert.equal(atualizarDesafioHistorico(final,c),final);
  assert.equal(iniciarDesafioHistorico(final,d.id).tentativas[d.id],2);
 }
 assert.deepEqual(base,antes);assert.deepEqual(DESAFIOS_HISTORICOS,catalogo);
});
test('objetivo registra conclusão uma vez e tentativas malsucedidas preservam conquistas',()=>{
 const s=iniciarDesafioHistorico(estadoInicialDesafios(),'santos-2002');
 const c=structuredClone(s.ativo.c);c.tecnico.fase='resultado';c.tecnico.temporadas=[{ano:2002,posicao:4,pontos:65}];
 const ganhou=atualizarDesafioHistorico(s,c);assert.equal(ganhou.ativo.sucesso,true);assert.equal(ganhou.concluidos['santos-2002'].posicao,4);
 const proximo=iniciarDesafioHistorico(ganhou,'santos-2002'),perdeu=structuredClone(proximo.ativo.c);
 perdeu.tecnico.fase='resultado';perdeu.tecnico.temporadas=[{ano:2002,posicao:5,pontos:60}];
 const fim=atualizarDesafioHistorico(proximo,perdeu);assert.equal(fim.ativo.sucesso,false);assert.deepEqual(fim.concluidos,ganhou.concluidos);
 c.tecnico.temporadas[0].interrompida=true;assert.equal(atualizarDesafioHistorico(s,c).ativo.sucesso,false);
});
test('save independente não escreve na carreira nem no museu e recupera JSON inválido',()=>{
 const dados=new Map([['ajoia_rapido_v1','carreira original'],['ajoia_museu_v1','museu original']]);
 const storage={getItem:k=>dados.get(k),setItem:(k,v)=>dados.set(k,v)};
 const s=iniciarDesafioHistorico(estadoInicialDesafios(),'flamengo-2019');
 assert.equal(salvarDesafiosHistoricos(s,storage),true);assert.deepEqual(carregarDesafiosHistoricos(storage),s);
 assert.equal(dados.get('ajoia_rapido_v1'),'carreira original');assert.equal(dados.get('ajoia_museu_v1'),'museu original');
 dados.set(CHAVE_DESAFIOS,'JSON inválido');assert.deepEqual(carregarDesafiosHistoricos(storage),estadoInicialDesafios());
 assert.equal(salvarDesafiosHistoricos(s,{setItem(){throw new Error('sem espaço');}}),false);
});
