import test from 'node:test';
import assert from 'node:assert/strict';
import {PLANOS_PRETEMPORADA} from '../src/jogador/planosPretemporada.js';
import {criarJogador,CARTAS_PRETEMPORADA,opcoesPretemporada,textoCarta,ganhosDaCarta,efeitosDaCarta,jogarTemporada} from '../src/jogador/rapido.js';

const base=posicao=>criarJogador({nome:'Pré-temporada',nac:'BRA',posicao,personalidade:'ascensao',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'PREP-REAL-TESTE'});
const efeitosReais=['gols','assist','nota','minutos','lesao','moral','desafio','forcaTime','declinio'];

test('planos são treinos de futebol, com função e benefício calculável',()=>{
  assert.ok(PLANOS_PRETEMPORADA.length>=35);
  assert.equal(new Set(PLANOS_PRETEMPORADA.map(x=>x.id)).size,PLANOS_PRETEMPORADA.length);
  assert.equal(new Set(CARTAS_PRETEMPORADA.map(x=>x.id)).size,CARTAS_PRETEMPORADA.length);
  assert.ok(PLANOS_PRETEMPORADA.every(x=>x.planoReal&&['tecnica','leitura','fisico','recuperacao','mental'].includes(x.grupo)));
  for(const plano of PLANOS_PRETEMPORADA){
    assert.ok(plano.desc&&plano.nome,plano.id);
    assert.ok(Object.values(plano.ganhos||{}).some(n=>n!==0)||efeitosReais.some(k=>!!plano[k]),plano.id);
    assert.ok(!plano.fama&&!plano.torcida&&!plano.ofertas,'treino não deveria ser ação publicitária: '+plano.id);
  }
});

test('opções oferecidas são esportivas, diferentes e respeitam posição e idade',()=>{
  for(const pos of ['GOL','ZAG','ALE','MC','MEI','ATA']){
    const c=base(pos);
    const a=opcoesPretemporada(c),b=opcoesPretemporada(structuredClone(c));
    assert.deepEqual(a,b);
    assert.equal(a.length,3);
    assert.equal(new Set(a.map(x=>x.grupo)).size,3);
    for(const x of a){
      assert.ok(x.planoReal,x.id);
      assert.ok(!x.posicoes||x.posicoes.includes(pos),x.id);
      assert.ok(!x.minIdade||x.minIdade<=c.idade,x.id);
      assert.ok(efeitosDaCarta(x,pos).length||Object.keys(ganhosDaCarta(x,pos)).length,x.id);
    }
  }
});

test('versão de goleiro substitui efeitos de gol e assistência impossíveis',()=>{
  for(const plano of PLANOS_PRETEMPORADA.filter(x=>!x.posicoes||x.posicoes.includes('GOL'))){
    const v=textoCarta(plano,'GOL');
    assert.ok(!v.gols,'Goleiro não pode receber multiplicador de gols de linha: '+plano.id);
    assert.ok(!v.assist,'Treino de linha não pode aumentar assistências do goleiro: '+plano.id);
  }
});

test('lesão e participação variam com o plano escolhido, e ficam no histórico do ano',()=>{
  const c=base('ATA');
  const prevenir=jogarTemporada({...c,pretemporada:{ano:c.ano,id:'prepPrevencao'}}).card;
  const intensivo=jogarTemporada({...c,pretemporada:{ano:c.ano,id:'prepPotencia'}}).card;
  assert.equal(prevenir.pretemporada.id,'prepPrevencao');
  assert.equal(intensivo.pretemporada.id,'prepPotencia');
  assert.ok(prevenir.pretemporada.riscoLesao<intensivo.pretemporada.riscoLesao);
  assert.ok(intensivo.pretemporada.efeitos.some(x=>x.includes('risco base de lesão')));
  assert.ok(prevenir.pretemporada.efeitos.some(x=>x.includes('risco base de lesão')));
});
