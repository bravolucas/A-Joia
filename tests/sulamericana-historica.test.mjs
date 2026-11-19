import test from 'node:test';
import assert from 'node:assert/strict';
import {
 HISTORICO_SULAMERICANA,ULTIMO_ANO_SULAMERICANA_HISTORICO,
 TOTAIS_SULAMERICANA_HISTORICOS,totalSulAmericanaHistoricas,
} from '../src/dados/sulamericanaHistorica.js';
import {competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {acervoInicial,galeriaClube} from '../src/historia/historiaFutebol.js';

const taca=clube=>galeriaClube({},clube).tacas.find(t=>t.nome==='Copa Sul-Americana');

test('24 edições reais consecutivas, 2002–2025, sem antecipar 2026',()=>{
 assert.equal(ULTIMO_ANO_SULAMERICANA_HISTORICO,2025);
 assert.equal(HISTORICO_SULAMERICANA.length,24);
 assert.deepEqual(HISTORICO_SULAMERICANA.map(e=>e.ano),Array.from({length:24},(_,i)=>2025-i));
 assert.ok(HISTORICO_SULAMERICANA.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1));
 assert.equal(HISTORICO_SULAMERICANA[0].campeoes[0].clube,'Lanús');
 assert.equal(HISTORICO_SULAMERICANA.at(-1).campeoes[0].clube,'San Lorenzo');
 assert.equal(HISTORICO_SULAMERICANA.find(e=>e.ano===2016).campeoes[0].clube,'Chapecoense');
 assert.equal(HISTORICO_SULAMERICANA.find(e=>e.ano===2006).campeoes[0].clube,'Pachuca');
 assert.ok(!HISTORICO_SULAMERICANA.some(e=>e.ano>=2026));
});

test('ranking mundial conta 24 taças de 18 clubes, inclusive os não jogáveis',()=>{
 const g=galeriaCompeticao({},'Copa Sul-Americana');
 assert.equal(g.historicas.length,24);
 assert.equal(g.edicoes.length,0);
 assert.equal(g.ultima.clube,'Lanús');
 assert.equal(g.ultima.ano,2025);
 assert.equal(g.ultima.historica,true);
 assert.equal(g.ranking.length,18);
 assert.equal(g.ranking.reduce((s,t)=>s+t.inicial,0),24);
 assert.equal(Object.values(TOTAIS_SULAMERICANA_HISTORICOS).filter(x=>x===2).length,6);
 for(const nome of ['Boca Juniors','Independiente','Athletico-PR','Independiente del Valle','LDU de Quito','Lanús'])
  assert.equal(g.ranking.find(t=>t.clube===nome)?.inicial,2,nome);
 for(const nome of ['Pachuca','Cienciano','Arsenal de Sarandí','Independiente Santa Fe'])
  assert.equal(g.ranking.find(t=>t.clube===nome)?.inicial,1,nome);
 assert.ok(!g.ranking.some(t=>t.clube==='Atlético-MG'),'vice não recebe título');
 assert.equal(totalSulAmericanaHistoricas('Real Madrid'),0);
});

test('vitrines dos clubes e aliases usam o mesmo torneio, sem confundir com Libertadores',()=>{
 assert.ok(competicoesDisponiveis({}).includes('Copa Sul-Americana'));
 assert.equal(taca('Lanús')?.inicial,2);
 assert.equal(taca('Athletico-PR')?.inicial,2);
 assert.equal(taca('Pachuca')?.inicial,1);
 assert.equal(taca('Chapecoense')?.inicial,1);
 assert.equal(acervoInicial('Independiente Santa Fe').conhecido,true);
 assert.equal(galeriaCompeticao({},'Copa Sudamericana').nome,'Copa Sul-Americana');
 assert.equal(galeriaCompeticao({},'Sul-Americana').historicas.length,24);
 assert.equal(galeriaCompeticao({},'Libertadores').historicas.length,66);
 assert.equal(galeriaCompeticao({},'Libertadores').ranking.find(t=>t.clube==='Athletico-PR'),undefined);
});

test('carreira simulada adiciona uma conquista apenas e jamais altera save ou histórico real',()=>{
 const c={lista:[{ano:2030,nome:'Copa Sudamericana',clube:'Lanús',tipo:'continental'}],
  temporadas:[{ano:2030,clube:'Lanús',torneios:[{nome:'Copa Sul-Americana',campeao:'Lanús',tipo:'continental'}]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Copa Sul-Americana');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.edicoes[0].ano,2030);
 assert.equal(g.ranking.find(t=>t.clube==='Lanús').total,3);
 assert.equal(g.ranking.find(t=>t.clube==='Lanús').simulacao,1);
 assert.equal(g.ranking.reduce((s,t)=>s+t.simulacao,0),1);
 assert.equal(g.historicas.length,24);
 assert.equal(g.ultima.ano,2030);
 assert.deepEqual(c,antes);
 assert.equal(galeriaClube(c,'Lanús').tacas.find(t=>t.nome==='Copa Sul-Americana').total,3);
});
