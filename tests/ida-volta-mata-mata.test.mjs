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

test('ida e volta são duas decisões separadas, com continuidade no save e mandos invertidos',()=>{
 let c=criarCampanhaCopa({nome:'Libertadores',tipo:'continental',usuario:'Flamengo',forcaUsuario:86,clubes:clubes(['brasileirao','argentina','sulamericano']),ano:2030,formato:'mata',seed:'decisoes-independentes'});
 const ida=decisaoCopa(c);assert.equal(ida.perna,'ida');assert.ok(ida.chave.includes('ida'));
 c=escolherCopa(c,ida.chave,'controlar');
 assert.equal(c.resultado.jogoIda,true);assert.ok(c.pernaIda);assert.equal(c.jogosUsuario.length,0,'não encerra a chave depois da ida');
 assert.equal(c.resultado.jogo.partidas,undefined,'não simula uma volta escondida');
 assert.equal(decisaoCopa(c),null,'mostra primeiro o resultado da ida');
 const golIda=JSON.parse(JSON.stringify(c.resultado.jogo)),salvo=JSON.parse(JSON.stringify(c));
 c=await_continuar.continuarCopa(salvo);
 const volta=decisaoCopa(c);assert.equal(volta.perna,'volta');assert.notEqual(volta.chave,ida.chave);
 assert.deepEqual({...volta.idaAnterior,etapa:undefined,escolha:undefined}, {...golIda,etapa:undefined,escolha:undefined});
 assert.equal(volta.casa,!ida.casa,'mando de campo invertido');
 assert.equal(c.jogosUsuario.length,0);
 c=escolherCopa(c,volta.chave,'pressionar');
 assert.equal(c.resultado.jogo.partidas.length,2);
 assert.equal(c.resultado.jogoExibido.etapa,'Volta');
 assert.deepEqual(c.resultado.jogo.partidas[0].casa,c.resultado.jogo.partidas[1].fora);
 assert.deepEqual(c.resultado.jogo.partidas[0].fora,c.resultado.jogo.partidas[1].casa);
 const [p1,p2]=c.resultado.jogo.partidas;
 const gols=(p,time)=>p.casa===time?p.golsCasa:p.golsFora;
 assert.equal(c.resultado.jogo.golsCasa,gols(p1,c.usuario)+gols(p2,c.usuario));
 assert.equal(c.resultado.jogo.golsFora,gols(p1,volta.adversario)+gols(p2,volta.adversario));
 if(c.resultado.penaltisPendentes){
  assert.equal(c.jogosUsuario.length,0);
  const d=decisaoCopa(c);assert.equal(d.penaltis,true);c=escolherCopa(c,d.chave,'canto');
 }
 assert.equal(c.jogosUsuario.length,1,'apenas após a volta a chave é encerrada');
 assert.equal(c.pernaIda,undefined,'estado transitório removido');
 assert.equal(c.jogosUsuario[0].partidas.length,2);
});

test('empate no agregado do usuário vai para os pênaltis apenas depois da volta, preservando as partidas',()=>{
 let achou=false;
 for(let i=0;i<60&&!achou;i++){
  let c=criarCampanhaCopa({nome:'Champions League',tipo:'continental',usuario:'Real Madrid',forcaUsuario:80,clubes:clubes(['espanha','inglaterra','italia','alemanha','franca']),ano:2030,formato:'mata',seed:'agregado-'+i});
  for(let k=0;k<18&&c.fase!=='fim'&&!achou;k++){
   const d=decisaoCopa(c);
   if(!d){c=await_continuar.continuarCopa(c);continue;}
   c=escolherCopa(c,d.chave,d.penaltis?'canto':'controlar');
   if(d.perna==='ida')assert.equal(c.resultado.penaltisPendentes,false,'ida empatada não abre pênaltis');
   if(c.resultado?.penaltisPendentes){
    achou=true;assert.equal(d.perna,'volta');assert.equal(c.resultado.jogo.partidas.length,2);
    const p=decisaoCopa(c);c=escolherCopa(c,p.chave,'canto');
    assert.equal(c.resultado.jogo.partidas.length,2);assert.equal(c.resultado.jogo.penaltis,true);
   }else if(c.resultado)c=await_continuar.continuarCopa(c);
  }
 }
 assert.ok(achou,'algum confronto empatou no agregado');
});
const await_continuar=await import('../src/treinador/copasEscolha.js');

test('simulação automática antiga: Copa do Brasil em ida e volta',async()=>{
 const {CLUBES_CONVITES_TECNICO}=await import('../src/treinador/tecnico.js');const rng=geradorTecnico('antigo');
 const cb=simularCopaNacionalTecnico({clubes:CLUBES_CONVITES_TECNICO,nomeUsuario:'Flamengo',pais:'Brasil',forcaUsuario:85,nome:'Copa do Brasil',rng});
 const jogos=(cb.fases||[]).flatMap(f=>f.jogos||[]);assert.ok(jogos.some(j=>j.partidas?.length===2),'Copa do Brasil com jogos de ida e volta');
});
