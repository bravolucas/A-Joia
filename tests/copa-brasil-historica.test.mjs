import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORICO_COPA_BRASIL,TOTAIS_COPA_BRASIL_HISTORICOS,ULTIMO_ANO_COPA_BRASIL_HISTORICO,totalCopaBrasilHistoricas} from '../src/dados/copaBrasilHistorica.js';
import {competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {galeriaClube,acervoInicial,nomeCanonico} from '../src/historia/historiaFutebol.js';

const taça=clube=>galeriaClube({},clube).tacas.find(t=>t.nome==='Copa do Brasil');

test('37 finais consecutivas de 1989 a 2025, sem inventar campeão de 2026',()=>{
 assert.equal(ULTIMO_ANO_COPA_BRASIL_HISTORICO,2025);
 assert.equal(HISTORICO_COPA_BRASIL.length,37);
 assert.deepEqual(HISTORICO_COPA_BRASIL.map(e=>e.ano),Array.from({length:37},(_,i)=>2025-i));
 assert.ok(HISTORICO_COPA_BRASIL.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1));
 assert.equal(HISTORICO_COPA_BRASIL[0].campeoes[0].clube,'Corinthians');
 assert.equal(HISTORICO_COPA_BRASIL.at(-1).campeoes[0].clube,'Grêmio');
 assert.equal(HISTORICO_COPA_BRASIL.find(e=>e.ano===2004).campeoes[0].clube,'Santo André');
 assert.equal(HISTORICO_COPA_BRASIL.find(e=>e.ano===2005).campeoes[0].clube,'Paulista');
 assert.equal(HISTORICO_COPA_BRASIL.find(e=>e.ano===2019).campeoes[0].clube,'Athletico-PR');
 assert.ok(!HISTORICO_COPA_BRASIL.some(e=>e.ano>=2026));
});
test('ranking real completo: 37 conquistas por 17 equipes',()=>{
 const g=galeriaCompeticao({},'Copa do Brasil');
 assert.equal(g.edicoes.length,0);
 assert.equal(g.historicas.length,37);
 assert.equal(g.ranking.length,17);
 assert.equal(g.ranking.reduce((s,c)=>s+c.inicial,0),37);
 assert.deepEqual(g.ranking.slice(0,3).map(c=>c.inicial),[6,5,5]);
 assert.equal(g.ranking[0].clube,'Cruzeiro');
 assert.equal(g.ultima.ano,2025);
 assert.equal(g.ultima.clube,'Corinthians');
 assert.equal(g.ultima.historica,true);
 for(const [clube,n] of Object.entries({
  Cruzeiro:6,'Grêmio':5,Flamengo:5,Palmeiras:4,Corinthians:4,
  'Atlético-MG':2,Internacional:1,'Sport Recife':1,'Santo André':1,Paulista:1,
  'Vasco da Gama':1,'Athletico-PR':1,'São Paulo':1,
 })){
  assert.equal(totalCopaBrasilHistoricas(clube),n,clube);
  assert.equal(g.ranking.find(r=>r.clube===clube)?.inicial,n,clube);
 }
 assert.equal(Object.keys(TOTAIS_COPA_BRASIL_HISTORICOS).length,17);
 assert.ok(!g.ranking.some(x=>x.clube==='Brasiliense'));
});
test('clube jogável e dois campeões não jogáveis, sem confundir ligas e torneios continentais',()=>{
 for(const [clube,n] of [['Corinthians',4],['Cruzeiro',6],['Grêmio',5],
  ['Criciúma',1],['Santo André',1],['Paulista',1],['Sport Recife',1]])
  assert.equal(taça(clube)?.inicial,n,clube);
 assert.equal(acervoInicial('Santo André').conhecido,true);
 assert.equal(acervoInicial('Paulista').conhecido,true);
 assert.equal(galeriaClube({},'Corinthians').tacas.filter(t=>t.nome==='Copa do Brasil').length,1);
 assert.equal(nomeCanonico('Copa Brasil'),'Copa do Brasil');
 assert.equal(nomeCanonico('Copa do Brasil'),'Copa do Brasil');
 assert.equal(galeriaCompeticao({},'Copa Brasil').historicas.length,37);
 assert.equal(galeriaCompeticao({},'Libertadores').historicas.length,66);
 assert.equal(galeriaCompeticao({},'Copa Sul-Americana').historicas.length,24);
 assert.equal(galeriaCompeticao({},'Champions League').historicas.length,71);
 assert.equal(galeriaCompeticao({},'Europa League').historicas.length,55);
 assert.equal(galeriaCompeticao({},'Conference League').historicas.length,5);
 assert.ok(competicoesDisponiveis({}).includes('Copa do Brasil'));
});
test('conquista simulada não altera acervo real nem histórico do save',()=>{
 const c={lista:[{ano:2031,nome:'Copa Brasil',clube:'Corinthians',tipo:'copa'}],
 temporadas:[{ano:2031,clube:'Corinthians',torneios:[{
  nome:'Copa do Brasil',campeao:'Corinthians',tipo:'copa'
 }]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Copa do Brasil');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.ultima.ano,2031);
 assert.equal(g.ranking.find(x=>x.clube==='Corinthians').inicial,4);
 assert.equal(g.ranking.find(x=>x.clube==='Corinthians').simulacao,1);
 assert.equal(g.ranking.find(x=>x.clube==='Corinthians').total,5);
 assert.equal(g.ranking.reduce((s,x)=>s+x.simulacao,0),1);
 assert.equal(g.historicas.length,37);
 assert.equal(galeriaClube(c,'Corinthians').tacas.find(t=>t.nome==='Copa do Brasil').total,5);
 assert.deepEqual(c,antes);
});
