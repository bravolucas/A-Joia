import test from 'node:test';
import assert from 'node:assert/strict';
import {idaEVolta} from '../src/competicoes/formatoMataMata.js';
import {simularCampanhaCopa,criarCampanhaCopa,decisaoCopa,escolherCopa,idaVoltaNaFase} from '../src/treinador/copasEscolha.js';
import {simularCopaNacionalTecnico,simularCopaContinentalTecnico} from '../src/treinador/competicoesTecnico.js';
import {CLUBES} from '../src/dados/data.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const clubes=pais=>CLUBES.filter(c=>pais.includes(c.liga)).map(c=>({...c,elenco:c.forca}));

test('regra de formato segue os regulamentos atuais',()=>{
 assert.equal(idaEVolta({nome:'Libertadores',tipo:'continental',tamanho:16}),true);
 assert.equal(idaEVolta({nome:'Libertadores',tipo:'continental',tamanho:2}),false,'final única');
 assert.equal(idaEVolta({nome:'Champions League',tipo:'continental',tamanho:4}),true);
 assert.equal(idaEVolta({nome:'Copa Sul-Americana',tipo:'continental',tamanho:2,preliminar:true}),true,'preliminar em dois jogos');
 assert.equal(idaEVolta({nome:'Copa do Brasil',tipo:'copa',tamanho:64}),false);
 assert.equal(idaEVolta({nome:'Copa do Brasil',tipo:'copa',tamanho:32}),true);
 assert.equal(idaEVolta({nome:'Copa do Brasil',tipo:'copa',tamanho:2}),true,'final da Copa do Brasil em dois jogos');
 assert.equal(idaEVolta({nome:'Copa del Rey',tipo:'copa',tamanho:4}),true);
 assert.equal(idaEVolta({nome:'Copa del Rey',tipo:'copa',tamanho:8}),false);
 assert.equal(idaEVolta({nome:'FA Cup',tipo:'copa',tamanho:4}),false);
 assert.equal(idaEVolta({nome:'Campeonato Paulista',tipo:'estadual',tamanho:2}),true);
 assert.equal(idaEVolta({nome:'Mundial de Clubes',tipo:'mundial',tamanho:4}),false);
 assert.equal(idaEVolta({nome:'Copa do Mundo',tipo:'copaMundo',tamanho:8}),false);
});

test('motor interativo: chaves da IA e confronto do usuário em ida e volta, final única na Libertadores',()=>{
 const c=simularCampanhaCopa({nome:'Libertadores',tipo:'continental',usuario:'Flamengo',forcaUsuario:86,clubes:clubes(['brasileirao','argentina','sulamericano']),ano:2030,formato:'mata'});
 const mata=c.fases.filter(f=>f.fase!=='Final');assert.ok(mata.length);
 for(const f of mata)for(const j of f.jogos){assert.equal(j.partidas?.length,2,`${f.fase} ${j.casa}×${j.fora}`);
  const [ida,volta]=j.partidas;assert.equal(ida.casa,volta.fora);assert.equal(ida.fora,volta.casa);
  const casaAgg=j.casa===ida.casa?ida.golsCasa+volta.golsFora:ida.golsFora+volta.golsCasa;assert.equal(casaAgg,j.golsCasa);}
 const final=c.fases.find(f=>f.fase==='Final');if(final)assert.ok(final.jogos.every(j=>!j.partidas),'final em jogo único');
});

test('Copa do Brasil: dois jogos a partir de 32 clubes, inclusive na final; FA Cup segue em jogo único',()=>{
 const cb=simularCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:'Flamengo',forcaUsuario:99,clubes:clubes(['brasileirao','serieB','serieC']),ano:2030,formato:'mata',entrada:'preliminar'});
 for(const f of cb.fases){const dois=['Pré-oitavas','Oitavas de final','Quartas de final','Semifinal','Final'].includes(f.fase);for(const j of f.jogos)assert.equal(!!j.partidas,dois,`${f.fase}`);}
 const fa=simularCampanhaCopa({nome:'FA Cup',tipo:'copa',usuario:'Arsenal',forcaUsuario:90,clubes:clubes(['inglaterra','inglaterra2']),ano:2030,formato:'mata'});
 assert.ok(fa.fases.every(f=>f.jogos.every(j=>!j.partidas)));
});

test('empate no agregado do usuário vai para os pênaltis com os dois jogos preservados',()=>{
 let achou=false;
 for(let i=0;i<60&&!achou;i++){
  let c=criarCampanhaCopa({nome:'Champions League',tipo:'continental',usuario:'Real Madrid',forcaUsuario:80,clubes:clubes(['espanha','inglaterra','italia','alemanha','franca']),ano:2030,formato:'mata',seed:'agregado-'+i});
  for(let k=0;k<6&&c.fase!=='fim'&&!achou;k++){const d=decisaoCopa(c);if(!d)break;assert.ok(idaVoltaNaFase(c)||c.tamanho===2);c=escolherCopa(c,d.chave,'controlar');
   if(c.resultado?.penaltisPendentes){achou=true;assert.equal(c.resultado.jogo.partidas.length,2);const p=decisaoCopa(c);c=escolherCopa(c,p.chave,'canto');assert.equal(c.resultado.jogo.partidas.length,2);assert.equal(c.resultado.jogo.penaltis,true);}
   else if(c.resultado){const {continuarCopa}=await_continuar;c=continuarCopa(c);}}
 }
 assert.ok(achou,'algum confronto empatou no agregado');
});
const await_continuar=await import('../src/treinador/copasEscolha.js');

test('simulação automática antiga: Copa do Brasil em ida e volta',async()=>{
 const {CLUBES_CONVITES_TECNICO}=await import('../src/treinador/tecnico.js');const rng=geradorTecnico('antigo');
 const cb=simularCopaNacionalTecnico({clubes:CLUBES_CONVITES_TECNICO,nomeUsuario:'Flamengo',pais:'Brasil',forcaUsuario:85,nome:'Copa do Brasil',rng});
 const jogos=(cb.fases||[]).flatMap(f=>f.jogos||[]);assert.ok(jogos.some(j=>j.partidas?.length===2),'Copa do Brasil com jogos de ida e volta');
});
