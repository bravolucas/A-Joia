import test from 'node:test';
import assert from 'node:assert/strict';
import {vencedoresPremios,vencedoresPremiosComHistorico,chavePremio} from '../src/historia/historicoPremios.js';
import {CATALOGO_PREMIOS,HISTORICO_REAL_PREMIOS} from '../src/historia/premiosHistoricosReais.js';

test('histórico de premiações encontra atletas pelo id mesmo sem id redundante no registro',()=>{
 const jogo={
  universo:{atletas:{
   'at-42':{nome:'Jogador A',conquistas:[[2027,'premio','Bola de Ouro','Fortaleza','bolaOuro']]}
  }},
  mundo:{jogadores:[
   {id:'at-42',nome:'Jogador A',premiacoesIndividuais:[[1,2027,'bolaOuro','Fortaleza']]},
   {id:'at-98',nome:'Jogadora B',premiacoesIndividuais:[[1,2028,'bolaOuro','Corinthians']]}
  ]}
 };
 const lista=vencedoresPremios(jogo);
 assert.equal(lista.length,2);
 assert.deepEqual(lista.map(x=>x.jogadorId),['at-98','at-42']);
 assert.equal(lista[1].jogadorNome,'Jogador A');
 assert.equal(lista[1].clube,'Fortaleza');
});

test('não inventa premiações e respeita variações de grafia',()=>{
 assert.deepEqual(vencedoresPremios({}),[]);
 assert.equal(chavePremio('Bola de Ouro'),chavePremio('bola-de-ouro'));
 assert.equal(chavePremio('Troféu Yashin'),chavePremio('Trofeu Yashin'));
});

test('acervo real tem séries documentadas até 2026, inclusive vencedores empatados',()=>{
 assert.equal(HISTORICO_REAL_PREMIOS.length,152);
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Bola de Ouro').length,70);
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Bota de Ouro').length,57);
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Troféu Yashin').length,7);
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Melhor jogador').length,10);
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Revelação').length,8);
 assert.equal(HISTORICO_REAL_PREMIOS.find(x=>x.nome==='Bola de Ouro'&&x.ano===2026).jogadorNome,'Harry Kane');
 assert.equal(HISTORICO_REAL_PREMIOS.find(x=>x.nome==='Troféu Yashin'&&x.ano===2026).jogadorNome,'Unai Simón');
 assert.equal(HISTORICO_REAL_PREMIOS.filter(x=>x.nome==='Bota de Ouro'&&x.ano===2014).length,2);
 assert.ok(!HISTORICO_REAL_PREMIOS.some(x=>x.nome==='Bota de Ouro'&&x.ano>=1992&&x.ano<=1996));
 assert.ok(!HISTORICO_REAL_PREMIOS.some(x=>['Bola de Ouro','Troféu Yashin','Revelação'].includes(x.nome)&&x.ano===2020));
 assert.ok(!CATALOGO_PREMIOS.includes('Artilheiro'));
});

test('prêmio salvo substitui edição real do mesmo ano sem substituir outros anos',()=>{
 const jogo={universo:{atletas:{'a-1':{nome:'Craque Simulado',conquistas:[
  [2026,'premio','Bola de Ouro','Fortaleza','bolaOuro']
 ]}}}};
 const todos=vencedoresPremiosComHistorico(jogo);
 const ano=todos.filter(x=>x.nome==='Bola de Ouro'&&x.ano===2026);
 assert.equal(ano.length,1);
 assert.equal(ano[0].jogadorNome,'Craque Simulado');
 assert.equal(ano[0].origem,'simulacao');
 assert.equal(todos.find(x=>x.nome==='Bola de Ouro'&&x.ano===2025).jogadorNome,'Ousmane Dembélé');
 assert.equal(todos.find(x=>x.nome==='Troféu Yashin'&&x.ano===2026).jogadorNome,'Unai Simón');
 assert.equal(vencedoresPremios(jogo).length,1);
});

test('Artilheiro genérico é ocultado do arquivo de distinções, sem apagar os demais prêmios',()=>{
 const jogo={universo:{atletas:{'a-1':{nome:'Craque',conquistas:[
  [2030,'premio','Artilheiro','Fortaleza','artilheiro'],
  [2030,'premio','Revelação','Fortaleza','revelacao']
 ]}}}};
 const simulados=vencedoresPremios(jogo);
 assert.equal(simulados.length,2);
 const premiacoes=vencedoresPremiosComHistorico(jogo);
 assert.ok(!premiacoes.some(x=>x.nome==='Artilheiro'));
 assert.equal(premiacoes.filter(x=>x.nome==='Revelação'&&x.ano===2030).length,1);
 assert.equal(premiacoes.find(x=>x.nome==='Revelação'&&x.ano===2030).origem,'simulacao');
});

test('Hall da Fama usa ano civil, não o número ordinal da temporada',()=>{
 const jogo={mundo:{temporada:5,anoCalendario:2031,jogadores:[],historicoBolaDeOuro:[
  {temporada:2,id:'antigo-7',nome:'Vencedor Aposentado',clube:'Roma'}
 ]}};
 const premiacoes=vencedoresPremiosComHistorico(jogo);
 const linha=premiacoes.find(x=>x.jogadorNome==='Vencedor Aposentado');
 assert.equal(linha.ano,2027);
 assert.equal(linha.origem,'simulacao');
 assert.ok(!premiacoes.some(x=>x.jogadorNome==='Vencedor Aposentado'&&x.ano===2));
});
