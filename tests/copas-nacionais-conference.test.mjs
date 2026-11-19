import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMPS_PAIS,CLUBES,LIGAS} from '../src/dados/data.js';
import {HISTORICO_COPAS_NACIONAIS,edicoesCopasNacionaisHistoricas,totalCopaNacionalHistorica} from '../src/dados/copasNacionaisHistoricas.js';
import {galeriaCompeticao,competicoesDisponiveis} from '../src/historia/competicoesHistoricas.js';
import {galeriaClube,nomeCanonico} from '../src/historia/historiaFutebol.js';
import {chaveCompeticao,resolverImagemCompeticao} from '../src/comum/arteCompeticoes.js';
import {desenhoDaTaca,svgDaTaca} from '../src/comum/tacas.js';

const campeao=(c,ano)=>edicoesCopasNacionaisHistoricas(c).find(x=>x.ano===ano)?.campeoes[0].clube;
test('todas as 11 copas nacionais do catálogo têm campeões reais cadastrados',()=>{
 const canonicas=[...new Set(Object.values(COMPS_PAIS).map(c=>nomeCanonico(c.copa)))];
 assert.equal(canonicas.length,11);
 assert.deepEqual(Object.keys(HISTORICO_COPAS_NACIONAIS).sort(),canonicas.sort());
 for(const nome of canonicas){
  const g=galeriaCompeticao({},nome);
  assert.ok(g.historicas.length>0,nome);
  assert.ok(competicoesDisponiveis({}).includes(nome),nome);
  assert.match(g.notaHistorica,/recorte/,nome);
 }
 assert.ok(galeriaCompeticao({},'Copa do Brasil').historicas.length>=37);
});
test('fontes, anos e vencedor único são validados sem alterar o save',()=>{
 for(const [nome,x] of Object.entries(HISTORICO_COPAS_NACIONAIS)){
  assert.ok(x.fonte.startsWith('https://'),nome);
  assert.ok(x.edicoes.every(a=>a.campeoes.length===1&&a.campeoes[0].quantidade===1&&Number.isInteger(a.ano)),nome);
  assert.equal(new Set(x.edicoes.map(e=>e.ano)).size,x.edicoes.length,nome);
 }
 const c={temporadas:[{ano:2036,clube:'Arsenal',torneios:[{nome:'FA Cup',campeao:'Arsenal'}]}]};
 const before=structuredClone(c),g=galeriaCompeticao(c,'FA Cup');
 assert.equal(g.edicoes[0].ano,2036);assert.equal(g.historicas[0].ano,2026);
 assert.equal(g.ranking.find(t=>t.clube==='Arsenal').simulacao,1);
 assert.deepEqual(c,before);
});
test('campeões das 11 copas na temporada encerrada em 2026 e decisões em aberto',()=>{
 assert.equal(campeao('FA Cup',2026),'Manchester City');
 assert.equal(campeao('Copa del Rey',2026),'Real Sociedad');
 assert.equal(campeao('Coppa Italia',2026),'Inter de Milão');
 assert.equal(campeao('DFB-Pokal',2026),'Bayern de Munique');
 assert.equal(campeao('Coupe de France',2026),'Lens');
 assert.equal(campeao('Taça de Portugal',2026),'Torreense');
 assert.equal(campeao('KNVB Beker',2026),'AZ');
 assert.equal(campeao('Türkiye Kupası',2026),'Trabzonspor');
 assert.equal(campeao("King's Cup",2026),'Al-Hilal');
 assert.equal(campeao('US Open Cup',2026),'St. Louis CITY SC');
 assert.equal(campeao('Copa Argentina',2025),'Independiente Rivadavia');
 assert.equal(campeao('Copa Argentina',2026),undefined);
 assert.equal(campeao('KNVB Beker',2020),undefined);
 assert.equal(campeao('US Open Cup',2020),undefined);
 assert.equal(campeao('US Open Cup',2021),undefined);
 assert.equal(campeao('Copa Argentina',2021),undefined);
});
test('clubes não jogáveis aparecem no ranking e na vitrine com o título exato',()=>{
 for(const [clube,copa,ano] of [
  ['Torreense','Taça de Portugal',2026],
  ['Wigan Athletic','FA Cup',2013],
  ['Independiente Rivadavia','Copa Argentina',2025],
  ['Lens','Coupe de France',2026],
  ['St. Louis CITY SC','US Open Cup',2026]]) {
  const perfil=galeriaClube({},clube);
  const t=perfil.tacas.find(t=>t.nome===copa);
  assert.ok(t&&t.anosHistoricos.includes(ano),clube);
  assert.equal(galeriaCompeticao({},copa).historicas[0].campeoes[0].clube===clube,ano===2026&&copa!=='Copa Argentina');
 }
 assert.equal(totalCopaNacionalHistorica('FA Cup','Arsenal'),7);
 assert.ok(galeriaClube({},'Galatasaray').tacas.some(t=>t.nome==='Türkiye Kupası'));
 assert.equal(galeriaClube({},'Galatasaray').tacas.filter(t=>t.nome==='Türkiye Kupası').length,1);
});
test('alias turco e Conference League preservam identidade, asset e fallback',()=>{
 assert.equal(nomeCanonico('Copa da Turquia'),'Türkiye Kupası');
 assert.equal(chaveCompeticao('UEFA Conference League'),'conference-league');
 assert.equal(chaveCompeticao('UEFA Europa Conference League'),'conference-league');
 assert.equal(chaveCompeticao('Liga Conferência'),'conference-league');
 assert.equal(resolverImagemCompeticao('UEFA Europa Conference League',{'conference-league':'trofeu.svg'}),'trofeu.svg');
 assert.equal(desenhoDaTaca('continental','Conference League').metal,'prata');
 assert.deepEqual(desenhoDaTaca('continental','Conference League'),desenhoDaTaca('continental','UEFA Europa Conference League'));
 assert.ok(svgDaTaca('continental','Conference League').startsWith('<svg'));
 const svg=readFileSync(new URL('../arte/competicoes/conference-league.svg',import.meta.url),'utf8');
 assert.match(svg,/<svg[^>]+viewBox=/);
 assert.match(svg,/Conference League/);
 assert.ok((svg.match(/stroke="url\(#rib/g)||[]).length>=32);
 assert.match(svg,/role="img"/);
});
