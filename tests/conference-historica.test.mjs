import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORICO_CONFERENCE,ULTIMO_ANO_CONFERENCE_HISTORICO,TOTAIS_CONFERENCE_HISTORICOS} from '../src/dados/conferenceHistorica.js';
import {galeriaCompeticao,competicoesDisponiveis} from '../src/historia/competicoesHistoricas.js';
import {galeriaClube,acervoInicial} from '../src/historia/historiaFutebol.js';

test('cinco anos de 2022 a 2026, cinco clubes, nenhum vencedor antecipado',()=>{
 assert.equal(ULTIMO_ANO_CONFERENCE_HISTORICO,2026);
 assert.deepEqual(HISTORICO_CONFERENCE.map(e=>[e.ano,e.campeoes[0].clube]),[
  [2026,'Crystal Palace'],[2025,'Chelsea'],[2024,'Olympiacos'],
  [2023,'West Ham'],[2022,'Roma'],
 ]);
 assert.ok(!HISTORICO_CONFERENCE.some(e=>e.ano>=2027));
 assert.equal(Object.keys(TOTAIS_CONFERENCE_HISTORICOS).length,5);
});
test('ranking independente de Champions e Europa, inclui Olympiacos não jogável',()=>{
 const g=galeriaCompeticao({},'Conference League');
 assert.equal(g.edicoes.length,0);
 assert.equal(g.historicas.length,5);
 assert.equal(g.ranking.length,5);
 assert.equal(g.ranking.reduce((s,c)=>s+c.inicial,0),5);
 assert.ok(g.ranking.every(c=>c.inicial===1&&c.total===1));
 assert.equal(g.ultima.clube,'Crystal Palace');
 assert.equal(g.ultima.historica,true);
 assert.equal(galeriaClube({},'Olympiacos').tacas.find(t=>t.nome==='Conference League')?.inicial,1);
 assert.equal(acervoInicial('Olympiacos').conhecido,true);
 assert.equal(galeriaClube({},'Chelsea').tacas.find(t=>t.nome==='Champions League')?.inicial,2);
 assert.equal(galeriaClube({},'Chelsea').tacas.find(t=>t.nome==='Europa League')?.inicial,2);
 assert.equal(galeriaClube({},'Chelsea').tacas.find(t=>t.nome==='Conference League')?.inicial,1);
 assert.equal(galeriaCompeticao({},'Champions League').historicas.length,71);
 assert.equal(galeriaCompeticao({},'Europa League').historicas.length,55);
 assert.ok(competicoesDisponiveis({}).includes('Conference League'));
});
test('aliases e saves: simulação soma uma vez, sem regravar histórico ou edições reais',()=>{
 for(const nome of ['UEFA Conference League','UEFA Europa Conference League','Liga Conferência'])
  assert.equal(galeriaCompeticao({},nome).historicas.length,5);
 const c={lista:[{ano:2035,nome:'UEFA Europa Conference League',clube:'Roma',tipo:'continental'}],
 temporadas:[{ano:2035,clube:'Roma',torneios:[{nome:'Conference League',campeao:'Roma',tipo:'continental'}]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Conference League');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.ultima.ano,2035);
 assert.equal(g.ranking.find(t=>t.clube==='Roma').total,2);
 assert.equal(g.ranking.find(t=>t.clube==='Roma').simulacao,1);
 assert.equal(g.ranking.reduce((s,t)=>s+t.simulacao,0),1);
 assert.equal(galeriaClube(c,'Roma').tacas.find(t=>t.nome==='Conference League').total,2);
 assert.deepEqual(c,antes);
});

test('Conference e Champions permanecem separadas quando Chelsea conquista as duas no mesmo ano',()=>{
 const c={temporadas:[{ano:2037,clube:'Chelsea',torneios:[
  {nome:'Champions League',campeao:'Chelsea',tipo:'continental'},
  {nome:'Conference League',campeao:'Chelsea',tipo:'continental'},
  {nome:'UEFA Conference League',campeao:'Chelsea',tipo:'continental'},
 ]}]};
 const antes=structuredClone(c);
 const champions=galeriaCompeticao(c,'Champions League');
 const conference=galeriaCompeticao(c,'Conference League');
 assert.equal(champions.edicoes.length,1);
 assert.equal(conference.edicoes.length,1,'aliases não duplicam a mesma edição da Conference');
 assert.equal(champions.ranking.find(x=>x.clube==='Chelsea').inicial,2);
 assert.equal(champions.ranking.find(x=>x.clube==='Chelsea').total,3);
 assert.equal(conference.ranking.find(x=>x.clube==='Chelsea').inicial,1);
 assert.equal(conference.ranking.find(x=>x.clube==='Chelsea').total,2);
 assert.equal(galeriaClube(c,'Chelsea').tacas.find(x=>x.nome==='Conference League').total,2);
 assert.deepEqual(c,antes);
});
