import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORICO_COPA_INTERCONTINENTAL,totalCopaIntercontinentalHistoricas,HISTORICO_MUNDIAL_CLUBES_FIFA,totalMundialClubesFifaHistoricas,HISTORICO_COPA_INTERCONTINENTAL_FIFA,totalCopaIntercontinentalFifaHistoricas} from '../src/dados/mundiaisHistoricos.js';
import {competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {acervoInicial,galeriaClube} from '../src/historia/historiaFutebol.js';
import {chaveCompeticao} from '../src/comum/arteCompeticoes.js';
import {nomeCanonico} from '../src/historia/historiaFutebol.js';
import {TACAS_MUSEU,competenciaMuseu} from '../src/museu/museu.js';

test('Copa Intercontinental clássica tem 43 edições e distingue ano oficial de disputa',()=>{
 assert.equal(HISTORICO_COPA_INTERCONTINENTAL.length,43);
 assert.equal(HISTORICO_COPA_INTERCONTINENTAL[0].ano,2004);
 assert.equal(HISTORICO_COPA_INTERCONTINENTAL.at(-1).ano,1960);
 assert.ok(!HISTORICO_COPA_INTERCONTINENTAL.some(e=>[1975,1978].includes(e.ano)));
 assert.ok(HISTORICO_COPA_INTERCONTINENTAL.some(e=>e.ano===1974));
 assert.equal(totalCopaIntercontinentalHistoricas('Boca Juniors'),3);
 assert.equal(totalCopaIntercontinentalHistoricas('Milan'),3);
 assert.equal(totalCopaIntercontinentalHistoricas('Nacional'),3);
 assert.equal(totalCopaIntercontinentalHistoricas('Peñarol'),3);
 assert.equal(totalCopaIntercontinentalHistoricas('Real Madrid'),3);
});

test('Mundial de Clubes FIFA mantém 2000, 2005–2023 e a edição expandida de 2025',()=>{
 assert.equal(HISTORICO_MUNDIAL_CLUBES_FIFA.length,21);
 assert.equal(HISTORICO_MUNDIAL_CLUBES_FIFA[0].ano,2025);
 assert.equal(HISTORICO_MUNDIAL_CLUBES_FIFA[0].campeoes[0].clube,'Chelsea');
 assert.equal(HISTORICO_MUNDIAL_CLUBES_FIFA.at(-1).ano,2000);
 assert.ok(!HISTORICO_MUNDIAL_CLUBES_FIFA.some(e=>[2001,2002,2003,2004,2024,2026].includes(e.ano)));
 assert.equal(totalMundialClubesFifaHistoricas('Real Madrid'),5);
 assert.equal(totalMundialClubesFifaHistoricas('Barcelona'),3);
 assert.equal(totalMundialClubesFifaHistoricas('Chelsea'),2);
 assert.equal(totalMundialClubesFifaHistoricas('Corinthians'),2);
 assert.equal(totalMundialClubesFifaHistoricas('Bayern de Munique'),2);
});

test('Copa Intercontinental FIFA tem só as duas edições concluídas, sem antecipar 2026',()=>{
 assert.deepEqual(HISTORICO_COPA_INTERCONTINENTAL_FIFA.map(e=>[e.ano,e.campeoes[0].clube]),[[2025,'PSG'],[2024,'Real Madrid']]);
 assert.equal(totalCopaIntercontinentalFifaHistoricas('Real Madrid'),1);
 assert.equal(totalCopaIntercontinentalFifaHistoricas('PSG'),1);
 assert.equal(totalCopaIntercontinentalFifaHistoricas('Chelsea'),0);
});

test('as três galerias e os rankings não misturam campeões nem contagens',()=>{
 const classic=galeriaCompeticao({},'Copa Intercontinental');
 const mundial=galeriaCompeticao({},'Mundial de Clubes FIFA');
 const fifa=galeriaCompeticao({},'Copa Intercontinental FIFA');
 assert.equal(classic.historicas.length,43);
 assert.equal(mundial.historicas.length,21);
 assert.equal(fifa.historicas.length,2);
 assert.equal(classic.ranking.find(t=>t.clube==='Boca Juniors').inicial,3);
 assert.equal(mundial.ranking.find(t=>t.clube==='Chelsea').inicial,2);
 assert.equal(fifa.ranking.find(t=>t.clube==='PSG').inicial,1);
 assert.equal(mundial.ranking.find(t=>t.clube==='PSG'),undefined);
 assert.equal(fifa.ranking.find(t=>t.clube==='Chelsea'),undefined);
 assert.equal(mundial.ultima.ano,2025);
 assert.equal(mundial.ultima.clube,'Chelsea');
 assert.equal(fifa.ultima.clube,'PSG');
 assert.match(classic.notaHistorica,/Não houve edições em 1975 e 1978/);
 assert.match(classic.notaHistorica,/1974.*1975/);
 assert.match(classic.notaHistorica,/1977.*março\/agosto de 1978/);
 assert.match(mundial.notaHistorica,/formato expandido em 2025/);
 assert.match(fifa.notaHistorica,/16\/12\/2026/);
});

test('galeria do clube exibe três taças mundiais distintas, sem total legado misturado',()=>{
 const madrid=galeriaClube({},'Real Madrid');
 assert.equal(madrid.tacas.find(t=>t.nome==='Copa Intercontinental')?.inicial,3);
 assert.equal(madrid.tacas.find(t=>t.nome==='Mundial de Clubes FIFA')?.inicial,5);
 assert.equal(madrid.tacas.find(t=>t.nome==='Copa Intercontinental FIFA')?.inicial,1);
 assert.equal(madrid.tacas.some(t=>t.nome==='Mundial de Clubes'&&t.inicial>0),false);
 const chelsea=galeriaClube({},'Chelsea');
 assert.equal(chelsea.tacas.find(t=>t.nome==='Mundial de Clubes FIFA')?.inicial,2);
 assert.equal(chelsea.tacas.some(t=>t.nome==='Copa Intercontinental FIFA'&&t.inicial>0),false);
 const boca=acervoInicial('Boca Juniors');
 assert.equal(boca.tacas.find(t=>t.nome==='Copa Intercontinental')?.inicial,3);
});

test('catálogo e aliases de imagem preservam o nome de cada torneio',()=>{
 const disponiveis=competicoesDisponiveis({});
 for(const nome of ['Copa Intercontinental','Mundial de Clubes FIFA','Copa Intercontinental FIFA'])assert.ok(disponiveis.includes(nome),nome);
 assert.equal(chaveCompeticao('Copa Intercontinental'),'copa-intercontinental');
 assert.equal(chaveCompeticao('Copa Intercontinental FIFA'),'copa-intercontinental-fifa');
 assert.equal(chaveCompeticao('Mundial de Clubes FIFA'),'mundial-de-clubes');
 assert.equal(nomeCanonico('Mundial de Clubes'),'Mundial de Clubes FIFA');
 assert.equal(competenciaMuseu('Mundial de Clubes').nome,'Mundial de Clubes FIFA');
 assert.equal(TACAS_MUSEU.filter(t=>t.nome==='Mundial de Clubes FIFA').length,1);
});

test('totais documentais fecham com as edições de cada um dos três acervos',()=>{
 const soma=ranking=>ranking.reduce((s,t)=>s+t.inicial,0);
 assert.equal(soma(galeriaCompeticao({},'Copa Intercontinental').ranking),43);
 assert.equal(soma(galeriaCompeticao({},'Mundial de Clubes FIFA').ranking),21);
 assert.equal(soma(galeriaCompeticao({},'Copa Intercontinental FIFA').ranking),2);
});
