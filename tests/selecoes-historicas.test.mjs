import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORICO_SELECOES,competicoesHistoricasSelecoes,totalTitulosHistoricosSelecao,historicoDaSelecao,nomeSelecaoHistorica} from '../src/dados/selecoesHistoricas.js';
import {campeoesRegistrados,competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {normalizarEntidade,paginaEntidade,empilharPagina} from '../src/historia/navegacaoEntidades.js';

test('todas as seleções têm acervo real independente do save',()=>{
 assert.deepEqual(competicoesHistoricasSelecoes.sort(),[
 'Copa Africana de Nações','Copa América','Copa da Ásia','Copa das Nações da Oceania',
 'Copa do Mundo','Copa Ouro','Eurocopa'].sort());
 const completo=galeriaCompeticao({},'Copa do Mundo');
 assert.equal(completo.nome,'Copa do Mundo');
 assert.equal(completo.selecao,true);
 assert.equal(completo.edicoes.length,0);
 assert.equal(completo.historicas.length,23);
 assert.equal(completo.historicas[0].ano,2026);
 assert.equal(completo.historicas[0].campeoes[0].clube,'Espanha');
 assert.equal(completo.ultima.clube,'Espanha');
 assert.equal(completo.ranking.find(x=>x.clube==='Brasil').inicial,5);
 assert.equal(completo.ranking.find(x=>x.clube==='Alemanha').inicial,4);
 assert.equal(completo.ranking.find(x=>x.clube==='Espanha').inicial,2);
 assert.equal(totalTitulosHistoricosSelecao('Copa do Mundo','Argentina'),3);
 assert.ok(competicoesDisponiveis({}).includes('Copa do Mundo'));
});
test('Copa América contabiliza duas edições de 1959 sem misturar os campeões',()=>{
 const g=galeriaCompeticao({},'Copa América');
 assert.equal(g.historicas.length,48);
 const edicoes=g.historicas.filter(x=>x.ano===1959);
 assert.equal(edicoes.length,2);
 assert.deepEqual(edicoes.map(x=>x.campeoes[0].clube).sort(),['Argentina','Uruguai']);
 assert.deepEqual(edicoes.map(x=>x.edicao).sort(),['1959-I','1959-II']);
 assert.equal(totalTitulosHistoricosSelecao('Copa América','Argentina'),16);
 assert.equal(totalTitulosHistoricosSelecao('Copa América','Uruguai'),15);
});
test('mais seis competições de seleções mantêm títulos históricos reais',()=>{
 const esperado={'Eurocopa':['Espanha',17],'Copa Africana de Nações':['Marrocos',35],
  'Copa da Ásia':['Catar',18],'Copa Ouro':['México',18],
  'Copa das Nações da Oceania':['Nova Zelândia',11]};
 for(const [nome,[ultimo,total]] of Object.entries(esperado)){
   const g=galeriaCompeticao({},nome);
   assert.equal(g.selecao,true,nome);
   assert.equal(g.historicas.length,total,nome);
   assert.equal(g.historicas[0].campeoes[0].clube,ultimo,nome);
   assert.ok(g.ranking.every(x=>x.total>0),nome);
 }
 assert.equal(nomeSelecaoHistorica('West Germany'),'Alemanha');
 assert.equal(nomeSelecaoHistorica('USA'),'Estados Unidos');
 assert.equal(HISTORICO_SELECOES['Copa Africana de Nações'][0].nota.includes('TAS'),true);
});
test('perfil da seleção mostra Copa do Mundo histórica e títulos simulados separados',()=>{
 const registrados={tecnico:{temporadas:[{ano:2034,tipoEquipe:'selecao',clube:'Brasil',
  torneios:[{nome:'Copa do Mundo',tipo:'copaMundo',campeao:'Brasil',selecao:'Brasil'}],
  titulosConquistados:['Copa do Mundo']}]}};
 const g=galeriaCompeticao(registrados,'Copa do Mundo');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.edicoes[0].ano,2034);
 assert.equal(g.edicoes[0].clube,'Brasil');
 assert.equal(g.ranking.find(x=>x.clube==='Brasil').total,6);
 assert.equal(historicoDaSelecao('Brasil').filter(x=>x.competicao==='Copa do Mundo').length,5);
 assert.equal(normalizarEntidade({tipo:'selecao',nome:'Brasil'}).tipo,'selecao');
 assert.equal(paginaEntidade({tipo:'selecao',nome:'Brasil'}).aba,'selecoes');
 const pilha=empilharPagina([paginaEntidade({tipo:'competicao',nome:'Copa do Mundo'})],
  paginaEntidade({tipo:'selecao',nome:'Brasil'}));
 assert.equal(pilha.at(-2).competicao,'Copa do Mundo');
});
test('simulação de seleções mundial é capturada, mas não converte mundial de clubes em Copa',()=>{
 const c={temporadas:[{ano:2030,clube:'Palmeiras',torneiosMundo:[
  {nome:'Copa do Mundo',tipo:'copaMundo',campeao:'França'},
  {nome:'Copa do Mundo de Clubes',tipo:'mundial',campeao:'Palmeiras'}
 ]}]};
 const antes=structuredClone(c);
 const copa=campeoesRegistrados(c);
 assert.ok(copa.some(x=>x.nome==='Copa do Mundo'&&x.clube==='França'&&x.selecao));
 assert.ok(copa.some(x=>x.nome==='Copa do Mundo de Clubes'&&x.clube==='Palmeiras'&&!x.selecao));
 assert.deepEqual(c,antes);
});
