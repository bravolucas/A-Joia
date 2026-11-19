import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,LIGAS,nomeDosTitulos} from '../src/dados/data.js';
import {HISTORICO_LIGAS,edicoesLigasHistoricas,totalLigaHistorica} from '../src/dados/ligasHistoricas.js';
import {galeriaCompeticao,competicoesDisponiveis} from '../src/historia/competicoesHistoricas.js';
import {galeriaClube} from '../src/historia/historiaFutebol.js';

test('todas as ligas reais do catálogo têm acervo documental, inclusive séries C e D',()=>{
 const oficiais=Object.values(LIGAS).filter(l=>l.nome!=='Outras Ligas Sul-Americanas').map(l=>l.nome);
 assert.equal(oficiais.length,21);
 assert.deepEqual(Object.keys(HISTORICO_LIGAS).sort(),oficiais.sort());
 assert.ok(competicoesDisponiveis({}).includes('Brasileirão Série C'));
 assert.ok(competicoesDisponiveis({}).includes('Brasileirão Série D'));
 assert.ok(!competicoesDisponiveis({}).includes('Outras Ligas Sul-Americanas'));
});
test('cada edição histórica tem campeão real, ano único, fonte e cobertura explícita',()=>{
 for(const [nome,liga] of Object.entries(HISTORICO_LIGAS)){
  assert.ok(liga.fonte.startsWith('https://'),nome);
  assert.ok(['recorte','completa'].includes(liga.cobertura),nome);
  assert.ok(liga.edicoes.length>0,nome);
  const anos=liga.edicoes.map(e=>e.ano);
  assert.equal(new Set(anos).size,anos.length,nome);
  assert.deepEqual(anos,[...anos].sort((a,b)=>b-a),nome);
  assert.ok(liga.edicoes.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1),nome);
  assert.ok(galeriaCompeticao({},nome).historicas.length===liga.edicoes.length,nome);
 }
});
test('edições confirmadas de 2026 e torneios pendentes não são inventados',()=>{
 const campeao=(liga,ano)=>edicoesLigasHistoricas(liga).find(e=>e.ano===ano)?.campeoes[0].clube;
 assert.equal(campeao('Brasileirão Série B',2026),'Novorizontino');
 assert.equal(campeao('Brasileirão Série C',2026),'Maringá');
 assert.equal(campeao('Brasileirão Série D',2026),'Uberlândia');
 assert.equal(campeao('Premier League',2026),'Arsenal');
 assert.equal(campeao('La Liga',2026),'Barcelona');
 assert.equal(campeao('Serie A',2026),'Inter de Milão');
 assert.equal(campeao('Bundesliga',2026),'Bayern de Munique');
 assert.equal(campeao('Liga Portugal',2026),'Porto');
 assert.equal(campeao('Eredivisie',2026),'PSV');
 assert.equal(campeao('MLS',2025),'Inter Miami');
 assert.equal(campeao('Liga Profesional',2026),'Boca Juniors');
 assert.equal(campeao('Brasileirão',2026),undefined);
 assert.equal(campeao('MLS',2026),undefined);
 assert.equal(campeao('Eredivisie',2020),undefined);
 assert.equal(campeao('Serie A',2005),undefined);
});
test('temporada e ano civil são diferenciados e rankings não recebem títulos estimados',()=>{
 assert.equal(edicoesLigasHistoricas('Premier League')[0].edicao,'2025/26');
 assert.equal(edicoesLigasHistoricas('MLS')[0].edicao,'2025');
 const ranking=galeriaCompeticao({},'Championship');
 assert.equal(ranking.ranking.find(r=>r.clube==='Coventry City').inicial,1);
 assert.equal(ranking.ranking.find(r=>r.clube==='Leeds United').inicial,2);
 assert.equal(totalLigaHistorica('Brasileirão Série B','Coritiba'),3);
 assert.equal(galeriaCompeticao({},'Brasileirão Série B').historicas.length,45);
 assert.equal(galeriaCompeticao({},'Premier League').historicas.length,34);
 assert.match(galeriaCompeticao({},'La Liga').notaHistorica,/recorte parcial/);
});
test('clubes exibem títulos comprovados mesmo quando não fazem parte do elenco jogável',()=>{
 assert.equal(galeriaClube({},'Novorizontino').tacas.find(t=>t.nome==='Brasileirão Série B').inicial,1);
 const perfil=galeriaClube({},'Blackburn Rovers');
 assert.equal(perfil.tacas.find(t=>t.nome==='Premier League').inicial,1);
 assert.equal(perfil.tacas.find(t=>t.nome==='Premier League').anosHistoricos[0],1995);
 assert.equal(galeriaClube({},'Arsenal').tacas.find(t=>t.nome==='Premier League').inicial,14);
 assert.ok(galeriaClube({},'Palmeiras').tacas.find(t=>t.nome==='Brasileirão').anosHistoricos.includes(2023));
 assert.equal(nomeDosTitulos('serieB').liga,'Brasileirão Série B');
 assert.equal(nomeDosTitulos('serieC').liga,'Brasileirão Série C');
 assert.equal(nomeDosTitulos('serieD').liga,'Brasileirão Série D');
});
test('campeões de carreira se somam sem mutação do acervo ou do save',()=>{
 const c={temporadas:[{ano:2030,clube:'Novorizontino',ligaId:'serieB',campeaoLiga:true}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Brasileirão Série B');
 assert.equal(g.edicoes[0].ano,2030);
 assert.equal(g.ranking.find(t=>t.clube==='Novorizontino').inicial,1);
 assert.equal(g.ranking.find(t=>t.clube==='Novorizontino').simulacao,1);
 assert.deepEqual(c,antes);
 assert.equal(edicoesLigasHistoricas('Brasileirão Série B')[0].ano,2026);
});
