import test from 'node:test';
import assert from 'node:assert/strict';
import {
 HISTORICO_EUROPA_LEAGUE,ULTIMO_ANO_EUROPA_HISTORICO,
 TOTAIS_EUROPA_LEAGUE_HISTORICOS,totalEuropaLeagueHistoricas,
} from '../src/dados/europaLeagueHistorica.js';
import {competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {acervoInicial,galeriaClube} from '../src/historia/historiaFutebol.js';

const taca=(clube,nome)=>galeriaClube({},clube).tacas.find(t=>t.nome===nome);

test('55 finais consecutivas desde 1972 a 2026, sem 2027 nem Copa das Feiras',()=>{
 assert.equal(ULTIMO_ANO_EUROPA_HISTORICO,2026);
 assert.equal(HISTORICO_EUROPA_LEAGUE.length,55);
 assert.deepEqual(HISTORICO_EUROPA_LEAGUE.map(e=>e.ano),Array.from({length:55},(_,i)=>2026-i));
 assert.ok(HISTORICO_EUROPA_LEAGUE.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1));
 assert.equal(HISTORICO_EUROPA_LEAGUE[0].campeoes[0].clube,'Aston Villa');
 assert.equal(HISTORICO_EUROPA_LEAGUE.find(e=>e.ano===2025).campeoes[0].clube,'Tottenham');
 assert.equal(HISTORICO_EUROPA_LEAGUE.find(e=>e.ano===2016).campeoes[0].clube,'Sevilla');
 assert.equal(HISTORICO_EUROPA_LEAGUE.find(e=>e.ano===1988).campeoes[0].clube,'Leverkusen');
 assert.equal(HISTORICO_EUROPA_LEAGUE.at(-1).campeoes[0].clube,'Tottenham');
 assert.ok(!HISTORICO_EUROPA_LEAGUE.some(e=>e.ano>=2027));
});
test('ranking da Copa UEFA/EUROPA League tem 55 conquistas de 31 vencedores',()=>{
 const g=galeriaCompeticao({},'Europa League');
 assert.equal(g.edicoes.length,0);
 assert.equal(g.historicas.length,55);
 assert.equal(g.ultima.clube,'Aston Villa');
 assert.equal(g.ultima.historica,true);
 assert.equal(g.ranking.length,31);
 assert.equal(g.ranking.reduce((s,x)=>s+x.inicial,0),55);
 assert.equal(g.ranking[0].clube,'Sevilla');
 assert.equal(g.ranking[0].inicial,7);
 for(const [clube,valor] of Object.entries({
  Sevilla:7,Tottenham:3,Juventus:3,'Inter de Milão':3,
  'Atlético de Madrid':3,Liverpool:3,'Real Madrid':2,
  'Borussia Mönchengladbach':2,'Eintracht Frankfurt':2,
  'IFK Göteborg':2,'Zenit São Petersburgo':1,'CSKA Moscou':1,'Aston Villa':1,
 })) {
  assert.equal(totalEuropaLeagueHistoricas(clube),valor,clube);
  assert.equal(g.ranking.find(r=>r.clube===clube)?.inicial,valor,clube);
 }
 assert.equal(Object.keys(TOTAIS_EUROPA_LEAGUE_HISTORICOS).length,31);
 assert.ok(!g.ranking.some(r=>r.clube==='Freiburg'),'vice de 2026 não é campeão');
});
test('identidades de clube, aliases e outras copas ficam separados',()=>{
 assert.ok(competicoesDisponiveis({}).includes('Europa League'));
 for(const [clube,valor] of [['Sevilla',7],['Porto',2],['Tottenham',3],
  ['Inter de Milão',3],['IFK Göteborg',2],['Atalanta',1],['Aston Villa',1]])
  assert.equal(taca(clube,'Europa League')?.inicial,valor,clube);
 assert.equal(acervoInicial('Anderlecht').conhecido,true);
 assert.equal(taca('Real Madrid','Champions League')?.inicial,15);
 assert.equal(taca('Real Madrid','Europa League')?.inicial,2);
 assert.equal(taca('Sevilla','Champions League')?.inicial,0);
 for(const alias of ['Copa da UEFA','UEFA Cup','UEFA Europa League','Liga Europa'])
  assert.equal(galeriaCompeticao({},alias).historicas.length,55,alias);
 assert.equal(galeriaCompeticao({},'Champions League').historicas.length,71);
 assert.equal(galeriaCompeticao({},'Libertadores').historicas.length,66);
 assert.equal(galeriaCompeticao({},'Copa Sul-Americana').historicas.length,24);
});
test('carreira preservada: final simulada é contada uma vez, sem mexer na história real',()=>{
 const c={lista:[{ano:2031,nome:'Copa da UEFA',clube:'Sevilla',tipo:'continental'}],
 temporadas:[{ano:2031,clube:'Sevilla',torneios:[{
 nome:'Europa League',campeao:'Sevilla',tipo:'continental'
 }]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Europa League');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.ultima.ano,2031);
 assert.equal(g.ranking.find(r=>r.clube==='Sevilla').total,8);
 assert.equal(g.ranking.find(r=>r.clube==='Sevilla').simulacao,1);
 assert.equal(g.ranking.reduce((s,r)=>s+r.simulacao,0),1);
 assert.equal(g.historicas.length,55);
 assert.equal(galeriaClube(c,'Sevilla').tacas.find(t=>t.nome==='Europa League').total,8);
 assert.deepEqual(c,antes);
});

test('saves legados de Sevilla não transformam Europa League real em conquista duplicada',()=>{
 const c={estadoClubes:{Sevilla:{palmares:{liga:1,copa:5,continental:7,mundial:0}}}};
 const antes=structuredClone(c);
 const real=galeriaClube(c,'Sevilla').tacas.find(t=>t.nome==='Europa League');
 assert.equal(real.inicial,7);
 assert.equal(real.total,7);
 assert.equal(real.legado||0,0);
 assert.equal(taca('Aston Villa','Champions League')?.inicial,1);
 assert.equal(taca('Aston Villa','Europa League')?.inicial,1);
 assert.deepEqual(c,antes);
});
