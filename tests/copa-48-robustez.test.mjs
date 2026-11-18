import test from 'node:test';
import assert from 'node:assert/strict';
import {simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';
import {SELECOES_TECNICO} from '../src/treinador/selecoesTecnico.js';

const clubes=SELECOES_TECNICO.slice(0,48).map(t=>({...t,forca:t.elenco}));

for(const [semente,forcaUsuario] of [['copa-1',85],['copa-2',65],['copa-3',30],['copa-4',2]]){
 test(`Copa 48 mantém regulamento, grupos distintos e final por último: ${semente}`,()=>{
  const camp=simularCampanhaCopa({nome:'Copa do Mundo',tipo:'copaMundo',usuario:clubes[0].nome,forcaUsuario,clubes,ano:2030,formato:'selecao48',seed:semente});
  assert.equal(camp.fase,'fim');
  assert.equal(camp.grupos.length,12);
  assert.equal(camp.melhoresTerceiros.length,8);
  assert.equal(camp.grupos.flatMap(g=>g.classificacao).length,48);
  assert.equal(new Set(camp.grupos.flatMap(g=>g.classificacao.map(t=>t.nome))).size,48);
  const mapa=new Map(camp.grupos.flatMap(g=>g.classificacao.map(t=>[t.nome,g.grupo])));
  const primeiros=camp.fases.find(f=>f.fase==='16 avos de final')?.jogos||[];
  assert.equal(primeiros.length,16);
  assert.equal(new Set(primeiros.flatMap(j=>[j.casa,j.fora])).size,32);
  for(const jogo of primeiros)assert.notEqual(mapa.get(jogo.casa),mapa.get(jogo.fora),'Repetiu adversário do mesmo grupo na fase de 32');
  assert.equal(camp.fases.at(-1)?.fase,'Final');
  assert.equal(camp.fases.find(f=>f.fase==='Disputa de terceiro lugar')?.jogos.length,1);
  assert.equal(jogosDaCampanha(camp).length,104);
  assert(camp.campeao&&camp.vice&&camp.terceiroLugar);
  assert.notEqual(camp.campeao,camp.vice);
  assert.notEqual(camp.campeao,camp.terceiroLugar);
 });
}
test('Copa do Brasil 2026 salva os 2 placares por confronto e final única',()=>{
 const times=Array.from({length:16},(_,i)=>({nome:`Clube ${i+1}`,forca:67+i}));
 const c=simularCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:times[0].nome,
  forcaUsuario:times[0].forca,clubes:times,formato:'mata',ano:2026,seed:'ida-volta-cbf-2026'});
 assert.equal(c.fase,'fim');
 assert.equal(c.fases.length,4);
 const finais=c.fases.find(f=>f.fase==='Final');
 assert.equal(finais?.jogos.length,1);
 assert.equal(finais.jogos[0].partidas?.length||0,0);
 for(const fase of c.fases.filter(f=>f.fase!=='Final')){
  assert(fase.jogos.every(j=>j.partidas?.length===2),'Faltou jogo de volta');
  for(const jogo of fase.jogos){
   assert.equal(jogo.golsCasa,jogo.partidas[0].golsCasa+jogo.partidas[1].golsFora);
   assert.equal(jogo.golsFora,jogo.partidas[0].golsFora+jogo.partidas[1].golsCasa);
  }
 }
 assert.equal(jogosDaCampanha(c).length,29);
});
