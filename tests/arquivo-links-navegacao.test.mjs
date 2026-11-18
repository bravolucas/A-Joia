import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chave,premiacoesDoSave} from '../src/historia/premiosHistoricos.js';

test('premiações têm atleta por id estável e não duplicam fontes do mundo',()=>{
 const c={
  universo:{atletas:{
   'p-123':{id:'p-123',nome:'João Teste',conquistas:[[2027,'premio','Bola de Ouro','Flamengo','bolaOuro']]},
   'sem-premio':{id:'sem-premio',nome:'Sem Conquistas',conquistas:[]}
  }},
  mundo:{jogadores:[
   {id:'p-123',nome:'João Teste',premiacoesIndividuais:[[0,2027,'bolaOuro','Flamengo']]},
   {id:'p-456',nome:'Marta Teste',premiacoesIndividuais:[[1,2028,'bolaOuro','Corinthians']]}
  ]},
  nome:'Meu Atleta',lista:[{ano:2029,nome:'Bota de Ouro',tipo:'botaOuro',clube:'Individual'}],
  temporadas:[{ano:2029,clube:'Santos',titulos:[]}]
 };
 const todos=premiacoesDoSave(c);
 assert.equal(todos.length,3);
 assert.deepEqual(todos.map(x=>x.jogadorId),['voce','p-456','p-123']);
 assert.equal(todos[0].clube,'Santos');
 assert.equal(todos[1].nome,'Bola de Ouro');
 assert.equal(todos[2].ano,2027);
 assert.ok(!todos.some(x=>x.jogador==='Sem Conquistas'));
});

test('variantes de grafia do prêmio referenciam o mesmo perfil',()=>{
 assert.equal(chave('Bola de Ouro'),chave('bola-de-ouro'));
 assert.equal(chave('Troféu Yashin'),chave('Trofeu Yashin'));
 assert.deepEqual(premiacoesDoSave({}),[]);
});

test('perfis usam navegação interna e seletor de atleta por identificador',()=>{
 const dialog=readFileSync(new URL('../src/historia/HistoriaFutebol.jsx',import.meta.url),'utf8');
 const atletas=readFileSync(new URL('../src/simulacao/ArquivoAtletasFM.jsx',import.meta.url),'utf8');
 const confrontos=readFileSync(new URL('../src/simulacao/HistoricoConfrontos.jsx',import.meta.url),'utf8');
 assert.match(dialog,/function rotaInicialDe/);
 assert.match(dialog,/voltar=\(\)=>/);
 for(const tipo of ['jogador','clube','competicao','premio'])assert.ok(dialog.includes("rotaInicial.tipo==='"+tipo+"'"));
 assert.match(atletas,/jogadorInicial/);
 assert.match(atletas,/onJogador\?\.\(novo\)/);
 assert.match(confrontos,/onCompeticao\?\.\(j.competicao\)/);
});
