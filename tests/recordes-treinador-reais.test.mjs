import test from 'node:test';
import assert from 'node:assert/strict';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';
import {detectarQuebrasRecordesFutebol} from '../src/historia/noticiasRecordes.js';

const marca=(c,id)=>consultarRecordesFutebol(c,'competicao','Premier League').recordes.find(r=>r.id===id);
const temporada=(ano)=>({
 ano,clube:'Manchester United',tipoEquipe:'clube',liga:'inglaterra',
 ligaNome:'Premier League',jogos:38,vitorias:24,empates:10,derrotas:4,
 pontos:82,titulosConquistados:[]
});
const perfil=(total)=>({nome:'Técnica',tecnico:{temporadas:Array.from({length:total},(_,i)=>temporada(2027+i))}});
test('Premier League exibe recordes verificados de técnico mesmo sem save',()=>{
 const jogos=marca({},'tecnicoJogos');
 const vitorias=marca({},'tecnicoVitorias');
 const pontos=marca({},'tecnicoPontos');
 const anos=marca({},'tecnicoTemporadas');
 const titulos=marca({},'tecnicoTitulos');
 assert.equal(jogos.real.valor,828);
 assert.equal(jogos.real.atleta,'Arsène Wenger');
 assert.equal(vitorias.real.valor,528);
 assert.equal(vitorias.real.atleta,'Sir Alex Ferguson');
 assert.equal(pontos.real.valor,1752);
 assert.equal(anos.real.valor,22);
 assert.equal(titulos.real.valor,13);
 assert.equal(vitorias.simulado,null);
 for(const r of [jogos,vitorias,pontos,anos,titulos])
  assert.ok(r.real.fonte.startsWith('https://www.premierleague.com/'));
});
test('recordes históricos de técnico e marca simulada são comparáveis por competição',()=>{
 const c=perfil(23),original=JSON.stringify(c);
 const v=marca(c,'tecnicoVitorias'),j=marca(c,'tecnicoJogos'),
  t=marca(c,'tecnicoTemporadas');
 assert.equal(v.simulado.valor,552);
 assert.equal(v.status,'Superado no save');
 assert.equal(j.simulado.valor,874);
 assert.equal(j.status,'Superado no save');
 assert.equal(t.simulado.valor,23);
 assert.equal(t.status,'Superado no save');
 assert.equal(JSON.stringify(c),original);
});
test('nova temporada que supera Ferguson gera notícia histórica com fonte',()=>{
 const antes=perfil(22),depois=perfil(23);
 const eventos=detectarQuebrasRecordesFutebol(antes,depois,{
  ano:2049,escopos:[{tipo:'competicao',nome:'Premier League'}],limite:20
 });
 const marcaVitorias=eventos.find(x=>x.metrica==='tecnicoVitorias');
 assert.equal(marcaVitorias.historico,true);
 assert.equal(marcaVitorias.anterior,528);
 assert.equal(marcaVitorias.valor,552);
 assert.ok(marcaVitorias.fonte.includes('premierleague.com'));
 assert.deepEqual(detectarQuebrasRecordesFutebol(depois,depois,{
  ano:2049,escopos:[{tipo:'competicao',nome:'Premier League'}]
 }),[]);
});

test('UEFA exibe recordes de Ancelotti sem inventar jogos por copa ausentes do save',()=>{
 const escopo='Champions League';
 const consulta=c=>consultarRecordesFutebol(c,'competicao',escopo).recordes;
 const real=consulta({});
 assert.equal(real.find(x=>x.id==='tecnicoJogos').real.valor,218);
 assert.equal(real.find(x=>x.id==='tecnicoVitorias').real.valor,124);
 assert.equal(real.find(x=>x.id==='tecnicoTitulos').real.valor,5);
 const c={nome:'Técnica',tecnico:{temporadas:Array.from({length:6},(_,i)=>({
  ano:2028+i,clube:'Milan',liga:'italia',ligaNome:'Serie A',tipoEquipe:'clube',
  jogos:38,vitorias:25,empates:10,derrotas:3,
  titulosConquistados:['UEFA Champions League'],
  torneios:[{nome:'UEFA Champions League',campeao:'Milan'}]
 }))}};
 const atual=consulta(c);
 assert.equal(atual.find(x=>x.id==='tecnicoTitulos').simulado.valor,6);
 assert.equal(atual.find(x=>x.id==='tecnicoTitulos').status,'Superado no save');
 assert.equal(atual.find(x=>x.id==='tecnicoJogos').simulado,null);
 assert.equal(atual.find(x=>x.id==='tecnicoVitorias').simulado,null);
});
