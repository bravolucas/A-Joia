import test from 'node:test';
import assert from 'node:assert/strict';
import {
  partidasHistoricas,resumoConfrontosClubes,partidasDetalhadasUsuario,
  partidasDistribuidasModoRapido,registrarPartidasDetalhadasUsuario,
  partidasDoAtleta,resumoConfrontosAtleta
} from '../src/simulacao/historicoConfrontos.js';

const edicoes=[
  {ano:2027,nome:'Brasileirão',jogos:{nomes:['Fortaleza','Palmeiras','Santos'],
    partidas:[[0,1,2,1,1,null,0],[1,0,0,0,20,null,0],[2,1,1,3,2,null,0]]}},
  {ano:2028,nome:'Copa do Brasil',jogos:[{casa:'Fortaleza',fora:'Palmeiras',golsCasa:1,golsFora:3,rodada:'Final'}]},
];
const universo={edicoes};
test('clubes: retrospecto geral, por competição e adversário usa placares arquivados',()=>{
 const c={universo};
 assert.equal(partidasHistoricas(c).length,4);
 const geral=resumoConfrontosClubes(c,{clube:'Fortaleza',adversario:'Palmeiras'});
 assert.deepEqual([geral.jogos,geral.vitorias,geral.empates,geral.derrotas,geral.golsPro,geral.golsContra],[3,1,1,1,3,4]);
 assert.equal(geral.porCompeticao.length,2);
 const copa=resumoConfrontosClubes(c,{clube:'Fortaleza',adversario:'Palmeiras',competicao:'Copa do Brasil'});
 assert.deepEqual([copa.jogos,copa.derrotas,copa.golsContra],[1,1,3]);
 assert.equal(resumoConfrontosClubes(c,{clube:'Fortaleza',ano:2027}).jogos,2);
 assert.equal(resumoConfrontosClubes(c,{clube:'Fortaleza',adversario:'Santos'}).jogos,0);
});
test('jogador: só jogos efetivos são contabilizados e dados indisponíveis não são criados',()=>{
 const card={ano:2027,clube:'Fortaleza',ligaNome:'Brasileirão',jogosLista:[
  {adversario:'Palmeiras',casa:true,golsMeu:2,golsAdv:1,golsMinha:1,assistMinha:0,defesas:3,cleanSheets:0,nota:8.5},
  {adversario:'Santos',casa:false,golsMeu:0,golsAdv:2,suspenso:true},
  {adversario:'Palmeiras',casa:false,golsMeu:0,golsAdv:0,golsMinha:0,assistMinha:1}
 ]};
 const eventos=partidasDetalhadasUsuario(card);
 assert.equal(eventos.length,3);
 const salvo=registrarPartidasDetalhadasUsuario(universo,card);
 const repetido=registrarPartidasDetalhadasUsuario(salvo,card);
 assert.equal(repetido.partidasAtletas.voce.length,3);
 const s=resumoConfrontosAtleta({universo:repetido},{adversario:'Palmeiras'});
 assert.deepEqual([s.jogos,s.gols,s.assistencias,s.defesas],[2,1,1,3]);
 assert.equal(s.notaMedia,8.5);
 assert.equal(resumoConfrontosAtleta({universo:repetido},{adversario:'Santos'}).jogos,0);
 assert.equal(partidasDoAtleta({universo:repetido}).length,3);
});
test('modo rápido: gera uma única vez atuações coerentes com os placares, sem ultrapassar gols do time',()=>{
 const card={ano:2027,clube:'Fortaleza',porCompeticao:[
  {nome:'Brasileirão',jogos:2,gols:7,assist:9,defesas:8,cleanSheets:2,origem:'distribuicao-simulada'}
 ]};
 const reg=partidasDistribuidasModoRapido(universo,card);
 assert.equal(reg.length,2);
 assert.ok(reg.every(j=>j.origem==='distribuicao-simulada'));
 assert.ok(reg.every(j=>j.gols<= (j.casa==='Fortaleza'?j.golsCasa:j.golsFora)));
 assert.ok(reg.every(j=>j.assistencias+j.gols<= (j.casa==='Fortaleza'?j.golsCasa:j.golsFora)));
 assert.ok(reg.every(j=>!j.cleanSheets || (j.casa==='Fortaleza'?j.golsFora:j.golsCasa)===0));
 assert.equal(reg.reduce((s,j)=>s+j.defesas,0),8);
 const salvo=registrarPartidasDetalhadasUsuario(universo,card);
 assert.equal(salvo.partidasAtletas.voce.length,2);
 assert.equal(registrarPartidasDetalhadasUsuario(salvo,card).partidasAtletas.voce.length,2);
 const legado={ano:2025,clube:'Fortaleza',jogos:40,gols:25,assist:8,porCompeticao:[{nome:'Brasileirão',jogos:40,gols:25,assist:8}]};
 assert.equal(registrarPartidasDetalhadasUsuario(universo,legado).partidasAtletas,undefined);
});
test('saves antigos sem arquivo de jogos permanecem legíveis',()=>{
 const r=resumoConfrontosClubes({}, {clube:'Fortaleza'});
 assert.equal(r.jogos,0);
 assert.deepEqual(partidasDoAtleta({},'voce'),[]);
 assert.equal(resumoConfrontosAtleta({},{jogadorId:'voce'}).jogos,0);
});

test('jogadores do mundo consultam partidas por adversário a partir dos totais salvos',()=>{
 const arquivo={universo:{...universo,atletas:{'42':{
  id:'42',nome:'Atacante do Fortaleza',historico:[
   [2027,'Fortaleza',2,2,0,5,1,[],null,0,[['Brasileirão',2,2,0,5,1]]]
  ]
 }}}};
 const jogos=partidasDoAtleta(arquivo,'42');
 assert.equal(jogos.length,2);
 assert.equal(jogos.reduce((n,j)=>n+j.gols,0),2);
 assert.ok(jogos.every(j=>j.gols <= (j.casa===j.clube?j.golsCasa:j.golsFora)));
 assert.equal(resumoConfrontosAtleta(arquivo,{jogadorId:'42',adversario:'Palmeiras'}).jogos,2);
 assert.equal(resumoConfrontosAtleta(arquivo,{jogadorId:'42',adversario:'Santos'}).jogos,0);
});
