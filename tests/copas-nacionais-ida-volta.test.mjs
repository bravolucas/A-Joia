import test from 'node:test';
import assert from 'node:assert/strict';
import {temIdaVolta} from '../src/competicoes/regrasIdaVolta.js';
import {simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';

const confrontos=[
 {nome:'Copa del Rey',ano:2026,dobro:true},
 {nome:'Coppa Italia',ano:2026,dobro:true},
 {nome:'Taça de Portugal',ano:2026,dobro:true},
 {nome:'Taça de Portugal',ano:2027,dobro:false},
 {nome:'FA Cup',ano:2026,dobro:false}
];
for(const {nome,ano,dobro} of confrontos)test(`ida/volta em ${nome} · ${ano}`,()=>{
 assert.equal(temIdaVolta({nome,ano,tamanho:16}),false);
 assert.equal(temIdaVolta({nome,ano,tamanho:8}),false);
 assert.equal(temIdaVolta({nome,ano,tamanho:4}),dobro);
 assert.equal(temIdaVolta({nome,ano,tamanho:2}),false);
 const clubes=Array.from({length:16},(_,i)=>({nome:`ClubeTeste${i}`,forca:60+i}));
 const c=simularCampanhaCopa({nome,ano,tipo:'copa',usuario:clubes[0].nome,
  forcaUsuario:clubes[0].forca,clubes,formato:'mata',seed:`regulamento-${nome}-${ano}`});
 assert.equal(c.fase,'fim');
 assert.equal(c.fases.length,4);
 for(const f of c.fases){
  const esperadas=f.fase==='Semifinal'&&dobro?2:1;
  for(const j of f.jogos)assert.equal(j.partidas?.length||1,esperadas,`Formato incorreto em ${f.fase}`);
 }
 assert.equal(jogosDaCampanha(c).length,dobro?17:15);
});
