import test from 'node:test';import assert from 'node:assert/strict';
import {campeoesRegistrados,competicoesDisponiveis,galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
const carreira=()=>({nac:'BRA',lista:[{ano:2030,nome:'Libertadores',clube:'Corinthians',tipo:'continental'}],temporadas:[{ano:2030,clube:'Corinthians',liga:'brasileirao',vencedorLiga:'Flamengo',torneios:[{nome:'Copa Libertadores',campeao:'Corinthians',tipo:'continental'},{nome:'Copa do Brasil',campeao:'Palmeiras',tipo:'copa'}]}],historiaFutebol:{titulos:[{ano:2030,nome:'Copa Libertadores',clube:'Corinthians'}]}});
test('campeões por edição conciliam aliases e repetição, sem mudar o save nem inventar títulos do vice',()=>{
 const c=carreira(),antes=structuredClone(c),g=galeriaCompeticao(c,'Copa Libertadores');assert.equal(g.edicoes.length,1);assert.equal(g.edicoes[0].clube,'Corinthians');assert.equal(g.ranking.find(t=>t.clube==='Corinthians').total,2);assert.equal(g.ultima.ano,2030);assert.ok(!g.edicoes.some(e=>e.clube==='Palmeiras'));assert.deepEqual(c,antes);
 assert.equal(galeriaCompeticao(c,'Brasileirão').edicoes[0].clube,'Flamengo');assert.equal(galeriaCompeticao(c,'Copa do Brasil').edicoes[0].clube,'Palmeiras');
});
test('torneio pendente não antecipa campeão mesmo havendo resultado antigo no mesmo ano',()=>{
 const c=carreira();c.temporadas[0].torneios[0].finalPendente=true;assert.equal(galeriaCompeticao(c,'Libertadores').edicoes.length,0);
});
test('títulos de seleção do treinador e jogador aparecem em seu próprio torneio',()=>{
 const c=carreira();c.tecnico={temporadas:[{ano:2034,tipoEquipe:'selecao',clube:'Portugal',titulosConquistados:['Copa do Mundo'],torneios:[{nome:'Copa do Mundo',tipo:'copaMundo',selecao:'Portugal',campeao:'Portugal'}]}]};c.lista.push({ano:2030,nome:'Copa do Mundo',clube:'Brasil',tipo:'copaMundo'});const g=galeriaCompeticao(c,'Copa do Mundo');assert.deepEqual(g.edicoes.map(e=>[e.ano,e.clube]),[[2034,'Portugal'],[2030,'Brasil']]);assert.equal(g.selecao,true);assert.ok(g.ranking.every(t=>t.inicial===0));
});
test('modo completo com técnico contratado aceita temporadas externas e mantém acervo sem anos fictícios',()=>{
 const c={tecnico:{nome:'Treinador contratado',temporadas:3}};const ts=[{ano:2030,clube:'Corinthians',liga:'brasileirao',campeaoLiga:false,posLiga:5,continental:{nome:'Libertadores',titulo:true}}];assert.equal(galeriaCompeticao(c,'Libertadores',ts).edicoes[0].clube,'Corinthians');const g=galeriaCompeticao(c,'Champions League',ts);assert.equal(g.edicoes.length,0);assert.ok(g.ranking.some(t=>t.clube==='Real Madrid'&&t.inicial>0));assert.ok(competicoesDisponiveis(c,ts).includes('Libertadores'));assert.ok(campeoesRegistrados(c,ts).every(e=>e.ano===2030));
});
