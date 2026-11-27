import test from 'node:test';
import assert from 'node:assert/strict';
import {
 HISTORICO_CHAMPIONS,ULTIMO_ANO_CHAMPIONS_HISTORICO,
 TOTAIS_CHAMPIONS_HISTORICOS,totalChampionsHistoricas,
} from '../src/dados/championsHistorica.js';
import {competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {acervoInicial,galeriaClube} from '../src/historia/historiaFutebol.js';

const taca=clube=>galeriaClube({},clube).tacas.find(t=>t.nome==='Champions League');

test('71 edições seguidas de 1956 a 2026 sem campeão de 2027',()=>{
 assert.equal(ULTIMO_ANO_CHAMPIONS_HISTORICO,2026);
 assert.equal(HISTORICO_CHAMPIONS.length,71);
 assert.deepEqual(HISTORICO_CHAMPIONS.map(e=>e.ano),Array.from({length:71},(_,i)=>2026-i));
 assert.ok(HISTORICO_CHAMPIONS.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1));
 assert.equal(HISTORICO_CHAMPIONS[0].campeoes[0].clube,'PSG');
 assert.equal(HISTORICO_CHAMPIONS[1].campeoes[0].clube,'PSG');
 assert.equal(HISTORICO_CHAMPIONS.at(-1).campeoes[0].clube,'Real Madrid');
 assert.equal(HISTORICO_CHAMPIONS.find(e=>e.ano===1991).campeoes[0].clube,'Estrela Vermelha');
 assert.equal(HISTORICO_CHAMPIONS.find(e=>e.ano===1986).campeoes[0].clube,'Steaua Bucareste');
 assert.equal(HISTORICO_CHAMPIONS.find(e=>e.ano===1970).campeoes[0].clube,'Feyenoord');
 assert.ok(!HISTORICO_CHAMPIONS.some(e=>e.ano>=2027));
});

test('ranking europeu completo: 71 títulos de 24 campeões, do Real Madrid aos não jogáveis',()=>{
 const g=galeriaCompeticao({},'Champions League');
 assert.equal(g.edicoes.length,0);
 assert.equal(g.historicas.length,71);
 assert.equal(g.ultima.ano,2026);
 assert.equal(g.ultima.historica,true);
 assert.equal(g.ultima.clube,'PSG');
 assert.equal(g.ranking.length,24);
 assert.equal(g.ranking.reduce((a,t)=>a+t.inicial,0),71);
 assert.deepEqual(g.ranking.slice(0,4).map(t=>t.inicial),[15,7,6,6]);
 for(const [clube,q] of Object.entries({
  'Real Madrid':15,Milan:7,'Bayern de Munique':6,Liverpool:6,Barcelona:5,Ajax:4,
  'Inter de Milão':3,'Manchester United':3,PSG:2,Porto:2,Benfica:2,
  'Nottingham Forest':2,'Steaua Bucareste':1,'Estrela Vermelha':1,Celtic:1,
 })) {
  assert.equal(totalChampionsHistoricas(clube),q,clube);
  assert.equal(g.ranking.find(t=>t.clube===clube)?.inicial,q,clube);
 }
 assert.equal(Object.keys(TOTAIS_CHAMPIONS_HISTORICOS).length,24);
 assert.ok(!g.ranking.some(t=>t.clube==='Arsenal'),'vice-campeão não conta');
});

test('acervo nos nomes do catálogo (PSG, Inter e Bayern), inclusive campeões não jogáveis',()=>{
 for(const [clube,q] of [['PSG',2],['Inter de Milão',3],['Bayern de Munique',6],
  ['Real Madrid',15],['Nottingham Forest',2],['Celtic',1],['Steaua Bucareste',1],
  ['Estrela Vermelha',1],['Marseille',1]])assert.equal(taca(clube)?.inicial,q,clube);
 assert.equal(acervoInicial('Celtic').conhecido,true);
 assert.equal(acervoInicial('PSG').tacas.filter(t=>t.nome==='Champions League').length,1);
 assert.equal(taca('Arsenal')?.inicial,0);
 assert.equal(galeriaCompeticao({},'UEFA Champions League').nome,'Champions League');
 assert.equal(galeriaCompeticao({},'Copa dos Campeões Europeus').historicas.length,71);
 assert.equal(galeriaCompeticao({},'Liga dos Campeões').historicas.length,71);
 assert.ok(competicoesDisponiveis({}).includes('Champions League'));
});

test('carreira adiciona só uma edição, nunca altera saves ou palmarés real',()=>{
 const c={lista:[{ano:2031,nome:'UEFA Champions League',clube:'Real Madrid',tipo:'continental'}],
  temporadas:[{ano:2031,clube:'Real Madrid',torneios:[
   {nome:'Champions League',campeao:'Real Madrid',tipo:'continental'},
  ]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Champions League');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.edicoes[0].ano,2031);
 assert.equal(g.ultima.ano,2031);
 assert.equal(g.historicas.length,71);
 assert.equal(g.ranking.find(t=>t.clube==='Real Madrid').inicial,15);
 assert.equal(g.ranking.find(t=>t.clube==='Real Madrid').simulacao,1);
 assert.equal(g.ranking.find(t=>t.clube==='Real Madrid').total,16);
 assert.equal(g.ranking.reduce((a,t)=>a+t.simulacao,0),1);
 assert.equal(galeriaClube(c,'Real Madrid').tacas.find(t=>t.nome==='Champions League').total,16);
 assert.deepEqual(c,antes);
 assert.equal(galeriaCompeticao({},'Libertadores').historicas.length,66);
 assert.equal(galeriaCompeticao({},'Copa Sul-Americana').historicas.length,25);
});

test('save legado do PSG com uma Champions antiga não cria título adicional falso',()=>{
 const c={estadoClubes:{PSG:{palmares:{continental:1}}}};
 const antes=structuredClone(c);
 const t=galeriaClube(c,'PSG').tacas.find(t=>t.nome==='Champions League');
 assert.equal(t.inicial,2,'PSG possui títulos reais em 2025 e 2026');
 assert.equal(t.legado||0,0,'total antigo do save não deve inflar o palmarés');
 assert.equal(t.total,2);
 assert.deepEqual(c,antes);
});
