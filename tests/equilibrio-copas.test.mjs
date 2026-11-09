import test from 'node:test';
import assert from 'node:assert/strict';
import {adversarioCopaPorFase,criarCampanhaCopa,simularCampanhaCopa,chancesCopa,chancePenaltis,decisaoCopa,escolherCopa} from '../src/treinador/copasEscolha.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {contextoMomento,criarJogador} from '../src/jogador/rapido.js';
const times=Array.from({length:32},(_,i)=>({nome:`Clube ${i}`,forca:92-i,estado:'SP'}));

test('favoritos têm vantagem clara, mas uma zebra ainda pode ganhar o confronto',()=>{
 const p=chancesCopa(90,70,'controlar');const avanco=p.vitoria+p.empate*chancePenaltis(90,70);
 assert.ok(avanco>.8&&avanco<.95);assert.ok(chancesCopa(70,90).vitoria>0);
 const iguais=chancesCopa(80,80);assert.ok(Math.abs(iguais.vitoria-iguais.derrota)<1e-10);
});

test('momentos resumidos ficam mais difíceis por fase, com zebras raras e reprodução estável',()=>{
 const medias=[];let zebras=0;
 for(const fase of ['Oitavas','Quartas','Semifinal','Final']){
  let soma=0;
  for(let i=0;i<600;i++){
   const seed=`momentos|${i}`,r=adversarioCopaPorFase(times,fase,geradorTecnico(seed));soma+=r.forca;
   if(fase==='Final'&&r.forca<80)zebras++;
   assert.deepEqual(r,adversarioCopaPorFase(times,fase,geradorTecnico(seed)));
  }
  medias.push(soma/600);
 }
 assert.ok(medias.every((x,i)=>!i||x>medias[i-1]),medias.join(','));assert.ok(zebras>0&&zebras<60,`zebras: ${zebras}`);
});

test('classificação europeia mantém favoritos com frequência sem duplicar os 36 participantes',()=>{
 const pool=Array.from({length:64},(_,i)=>({nome:`Europeu ${i}`,forca:i<24?94-i*.5:76-(i-24)*.5}));let favoritos=0;
 for(let i=0;i<100;i++){
  const c=criarCampanhaCopa({nome:'Champions League',usuario:pool[0].nome,forcaUsuario:94,clubes:pool,ano:2030,formato:'liga',seed:`qualificacao|${i}`});
  assert.equal(c.times.length,36);assert.equal(new Set(c.times.map(x=>x.nome)).size,36);
  favoritos+=c.times.filter(x=>pool.slice(0,8).some(t=>t.nome===x.nome)).length;
 }
 assert.ok(favoritos>780,`favoritos incluídos: ${favoritos}/800`);
});

test('progressão de força nas copas nacionais, continentais, estaduais e mundiais vem dos sobreviventes',()=>{
 for(const [nome,tipo,formato] of [['FA Cup','copa','mata'],['Libertadores','continental','grupos'],['Champions League','continental','liga'],['Europa League','continental','liga'],['Conference League','continental','liga'],['Paulista','estadual','estadual'],['Mundial','mundial','grupos']]){
  const etapas={};let zebras=0;
  for(let i=0;i<120;i++){
   const c=simularCampanhaCopa({nome,tipo,formato,usuario:times[0].nome,forcaUsuario:92,clubes:times,ano:2030,seed:`copas|${nome}|${i}`});
   for(const f of c.fases){if(!['Quartas de final','Semifinal','Final'].includes(f.fase))continue;const forcas=f.jogos.flatMap(j=>[j.casa,j.fora]).filter(Boolean).map(n=>c.forcas[n]);const e=etapas[f.fase]??={soma:0,n:0};e.soma+=forcas.reduce((a,b)=>a+b,0);e.n+=forcas.length;}
   if(c.forcas[c.campeao]<80)zebras++;
  }
  const semi=etapas.Semifinal,final=etapas.Final;assert.ok(final.soma/final.n>semi.soma/semi.n,`${nome}: final mais forte em média`);
  assert.ok(zebras<20,`${nome}: zebras campeãs ${zebras}/120`);
 }
});

test('final resumida mantém adversário já salvo e filtra os participantes da competição',()=>{
 const c=criarJogador({nome:'Equilíbrio',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'COPA-EQUILIBRIO'});c.clubeNome='Real Madrid';
 c.vagasInternacionaisAno=c.ano;c.vagasInternacionaisClubes={Arsenal:{competicao:'champions'},Liverpool:{competicao:'champions'},Barcelona:{competicao:'europa'}};
 const momento={tipo:'continental',titulo:'Final da Champions League'};
 const antes=JSON.stringify(c),r=contextoMomento(c,momento);assert.notEqual(r.adversario.nome,'Barcelona');assert.deepEqual(r,contextoMomento(c,momento));assert.equal(JSON.stringify(c),antes);
 const salvo={tipo:'clube',nome:'Bodø/Glimt',forca:74};assert.deepEqual(contextoMomento(c,{...momento,adversario:salvo}).adversario,salvo);
 const cp=criarCampanhaCopa({nome:'Copa',usuario:times[0].nome,forcaUsuario:92,clubes:times,ano:2030,formato:'mata'}),d=decisaoCopa(cp),a=escolherCopa(cp,d.chave,'controlar');assert.deepEqual(a,escolherCopa(JSON.parse(JSON.stringify(cp)),d.chave,'controlar'));
});

test('modo completo usa a fase ao escolher rivais e respeita país e estadual',async()=>{
 const {sortearAdversario}=await import('../src/comum/lib.js');const {CLUBES}=await import('../src/dados/data.js');
 const clube=CLUBES.find(x=>x.nome==='Flamengo'),c={clube},medias=[];
 const original=Math.random;
 try{
  for(const fase of [0,1,2,3]){Math.random=geradorTecnico(`completo|${fase}`);let soma=0;for(let i=0;i<400;i++){const nome=sortearAdversario(c,'copaNacional',fase),adv=CLUBES.find(x=>x.nome===nome);assert.ok(['brasileirao','serieB'].includes(adv.liga));assert.notEqual(nome,clube.nome);soma+=adv.forca;}medias.push(soma/400);}
  assert.ok(medias.at(-1)>medias[0]+1.5,medias.join(','));
  for(let i=0;i<30;i++){const nome=sortearAdversario(c,'estadual',1);assert.equal(CLUBES.find(x=>x.nome===nome).estado,clube.estado);}
 }finally{Math.random=original;}
});
