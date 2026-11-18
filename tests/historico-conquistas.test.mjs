import test from 'node:test';
import assert from 'node:assert/strict';
import {
  conquistasDoCadastroMundo,conquistasDaTemporadaUsuario,
  conquistasDoJogador,resumoConquistas,combinarConquistas,premioIndividual
} from '../src/simulacao/historicoConquistas.js';
import {registrarMundoVivo} from '../src/simulacao/mundoVivo.js';

test('títulos e prêmios individuais mantêm ano, clube e categoria',()=>{
 const p={id:50,nome:'Jogador',titulosConquistados:[
  [1,2030,'continental','Libertadores','Fortaleza'],
  [2,2031,'liga','Brasileirão','Flamengo']
 ],premiacoesIndividuais:[[1,2030,'bola-de-ouro','Fortaleza']]};
 const conquistas=conquistasDoCadastroMundo(p);
 assert.equal(conquistas.length,3);
 assert.equal(conquistas.filter(x=>x[1]==='premio').length,1);
 assert.equal(conquistas.filter(x=>x[1]==='titulo').length,2);
 assert.equal(conquistas.find(x=>x[1]==='premio')[2],'Bola de Ouro');
 assert.ok(premioIndividual('bolaOuro'));
 assert.equal(combinarConquistas(conquistas,conquistas).length,3);
});

test('conquistas do usuário são deduplicadas ao juntar lista e temporadas',()=>{
 const c={lista:[
  {ano:2030,clube:'Fortaleza',nome:'Libertadores',tipo:'continental'},
  {ano:2030,clube:'Individual',nome:'Bola de Ouro',tipo:'bolaOuro'}
 ],temporadas:[{
  ano:2030,clube:'Fortaleza',titulos:[
   {nome:'Libertadores',tipo:'continental'},
   {nome:'Bola de Ouro',tipo:'bolaOuro'}
  ]
 }]};
 const resumo=resumoConquistas(c,'voce');
 assert.equal(resumo.titulos.length,1);
 assert.equal(resumo.premios.length,1);
 assert.equal(resumo.todas.length,2);
 assert.equal(conquistasDaTemporadaUsuario(c.temporadas[0]).length,2);
});

test('um título de clube legado não vira conquista sem participação comprovada',()=>{
 const atleta={id:'91',historico:[
  [2030,'Fortaleza',25,10,5,0,0,['Libertadores','Copa do Brasil'],null,0,[
   ['Libertadores',0,0,0,0,0],['Copa do Brasil',4,2,1,0,0]
  ]]
 ]};
 const conquistas=conquistasDoJogador({universo:{atletas:{'91':atleta}}},'91');
 assert.deepEqual(conquistas.map(x=>x.nome),['Copa do Brasil']);
});

test('arquivo preserva os títulos e prêmios do jogador após sua transferência',()=>{
 const p={id:1,nome:'Atleta 1',posicao:'ATA',nac:'BRA',clubeNome:'Milan',jogos:25,gols:8,assist:4,
  porCompeticao:[{nome:'Libertadores',jogos:5,gols:2,assist:1}],
  titulosConquistados:[[1,2030,'continental','Libertadores','Fortaleza']],
  premiacoesIndividuais:[[1,2030,'bola-de-ouro','Fortaleza']]};
 const c={codigo:'premios',nome:'Protagonista',posicao:'ATA',mundo:{jogadores:[p]},historiaFutebol:{titulos:[]}};
 const antes={jogadores:[{id:1,clubeNome:'Fortaleza',liga:'brasileirao'}]};
 const a={ano:2030,clube:'Fortaleza',ligaId:'brasileirao',jogos:25,gols:8,assist:4,
  classificacoesMundo:{}};
 registrarMundoVivo(c,a,{antesMundo:antes});
 const gravado=c.universo.atletas['1'];
 assert.equal(gravado.conquistas.length,2);
 assert.equal(gravado.historico.length,1);
 assert.deepEqual(gravado.historico[0][7],['Libertadores']);
 const aposentado={...c,mundo:{jogadores:[]}};
 const resumo=resumoConquistas(aposentado,'1');
 assert.equal(resumo.titulos[0].clube,'Fortaleza');
 assert.equal(resumo.premios[0].nome,'Bola de Ouro');
 assert.equal(resumo.titulos.length,1);
 assert.equal(resumo.premios.length,1);
});

test('gravação de títulos do usuário preserva conquistas da temporada no save',()=>{
 const c={codigo:'premios-user',nome:'Craque',posicao:'ATA',mundo:{jogadores:[]},historiaFutebol:{titulos:[]}};
 const a={ano:2030,clube:'Santos',ligaId:'brasileirao',jogos:25,gols:12,assist:7,
  classificacoesMundo:{},titulos:[
   {tipo:'liga',nome:'Brasileirão'},{tipo:'botaOuro',nome:'Bota de Ouro'}
  ]};
 registrarMundoVivo(c,a);
 const todos=resumoConquistas(c,'voce');
 assert.equal(todos.titulos.length,1);
 assert.equal(todos.premios.length,1);
 const antigo=c.universo.atletas.voce;
 registrarMundoVivo(c,a);
 assert.deepEqual(c.universo.atletas.voce,antigo);
});
