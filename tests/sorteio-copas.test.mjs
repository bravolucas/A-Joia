import test from 'node:test';
import assert from 'node:assert/strict';
import {montarPotes,sortearGrupos,sortearFaseLiga,chaveUefa,sortearOitavasConmebol,coeficientesClubes,detentorDoTitulo,paisDoSorteio} from '../src/competicoes/sorteio.js';
import {criarCampanhaCopa,simularCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,chancesCopa} from '../src/treinador/copasEscolha.js';
import {temProrrogacao,golsEsperados} from '../src/competicoes/motorPartida.js';
import {clubesParaCopas,calcularVagasRapidas} from '../src/competicoes/regrasCopasRapidas.js';
import {ampliarParticipantesInternacionais} from '../src/competicoes/clubesInternacionais.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const vagas=calcularVagasRapidas({ano:2029});
const classificadosChampions=ampliarParticipantesInternacionais(clubesParaCopas().filter(c=>vagas[c.nome]?.competicao==='champions'||c.nome==='Real Madrid'),'champions',2030,clubesParaCopas());
const europeus=ampliarParticipantesInternacionais(clubesParaCopas().filter(c=>['inglaterra','espanha','italia','alemanha','franca','portugal','holanda','turquia'].includes(c.liga)),'champions',2030,clubesParaCopas());
const sulamericanos=ampliarParticipantesInternacionais(clubesParaCopas().filter(c=>['brasileirao','argentina','sulamericano'].includes(c.liga)),'libertadores',2030,clubesParaCopas());

test('fase de liga: 2 rivais por pote, sem rival do mesmo país, no máximo 2 do mesmo país, 4 em casa e 8 rodadas',()=>{
 for(let s=0;s<15;s++){
  const c=criarCampanhaCopa({nome:'Champions League',usuario:'Real Madrid',forcaUsuario:90,clubes:classificadosChampions,ano:2030,formato:'liga',seed:`liga|${s}`});
  const pais=n=>paisDoSorteio(c.times.find(t=>t.nome===n)),pote=n=>c.sorteios[0].potes.findIndex(p=>p.includes(n));
  assert.equal(c.totalRodadas,8);
  for(const rodada of c.calendario){const ns=rodada.flatMap(j=>[j.casa,j.fora]);assert.equal(new Set(ns).size,36,'cada clube joga uma vez por rodada');}
  for(const t of c.times){
   const jogos=c.calendario.flat().filter(j=>[j.casa,j.fora].includes(t.nome)),rivais=jogos.map(j=>j.casa===t.nome?j.fora:j.casa);
   assert.equal(jogos.length,8);assert.equal(new Set(rivais).size,8);
   assert.equal(jogos.filter(j=>j.casa===t.nome).length,4,'metade em casa');
   for(let p=0;p<4;p++)assert.equal(rivais.filter(r=>pote(r)===p).length,2,`${t.nome}: dois do pote ${p+1}`);
   assert.ok(rivais.every(r=>pais(r)!==pais(t.nome)),'nunca do mesmo país');
   const porPais={};for(const r of rivais)porPais[pais(r)]=(porPais[pais(r)]||0)+1;assert.ok(Object.values(porPais).every(n=>n<=2));
  }
 }
});

test('Conference: 6 potes, um rival de cada, 6 rodadas',()=>{
 const c=criarCampanhaCopa({nome:'Conference League',usuario:'Real Madrid',forcaUsuario:90,clubes:europeus,ano:2030,formato:'liga'});
 assert.equal(c.totalRodadas,6);assert.equal(c.sorteios[0].potes.length,6);assert.deepEqual(c.sorteios[0].adversarios.map(x=>x.pote),[1,2,3,4,5,6]);
});

test('grupos da Libertadores: potes pelo ranking, um clube de cada pote e países separados',()=>{
 for(let s=0;s<20;s++){
  const c=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sulamericanos,ano:2030,formato:'grupos',seed:`lib|${s}`});
  const {potes,grupos}=c.sorteios[0];assert.equal(grupos.length,8);
  const contagem={};for(const n of potes.flat()){const p=paisDoSorteio(c.pool.find(t=>t.nome===n));contagem[p]=(contagem[p]||0)+1;}
  for(const g of grupos){
   assert.equal(g.times.length,4);assert.deepEqual(g.times.map(n=>potes.findIndex(p=>p.includes(n))).sort(),[0,1,2,3]);
   const porPais={};for(const n of g.times){const p=paisDoSorteio(c.pool.find(t=>t.nome===n));porPais[p]=(porPais[p]||0)+1;}
   for(const [p,n] of Object.entries(porPais))assert.ok(n<=Math.max(1,Math.ceil(contagem[p]/8)),`${p} repetido no grupo ${g.letra}`);
  }
  assert.ok(c.times.map(t=>t.nome).includes('Flamengo'));assert.ok(grupos.some(g=>g.letra===c.letraGrupo));
 }
});

test('oitavas da CONMEBOL: líder contra segundo de outro grupo, líder decide em casa',()=>{
 const pares=sortearOitavasConmebol(['A1','B1','C1','D1'],['A2','B2','C2','D2'],{rng:geradorTecnico('o'),grupoDe:n=>n[0]});
 for(const [s,l] of pares){assert.ok(l.endsWith('1')&&s.endsWith('2'));assert.notEqual(s[0],l[0]);}
 const c=simularCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sulamericanos,ano:2030,formato:'grupos',seed:'lib-mata'});
 const oitavas=c.fases.find(f=>f.fase==='Oitavas de final');assert.ok(oitavas);
 for(const j of oitavas.jogos){const volta=j.partidas?.[1];if(!volta)continue;assert.ok(c.ranqueGeral.indexOf(volta.casa)<c.ranqueGeral.indexOf(volta.fora),'melhor campanha manda a volta');}
});

test('mata-mata UEFA: 1º e 2º só podem se cruzar na final; playoff 9º–24º',()=>{
 const tab=Array.from({length:36},(_,i)=>({nome:`P${i+1}`}));
 for(let s=0;s<20;s++){
  const {playoff,sementes}=chaveUefa(tab,geradorTecnico(`u${s}`));
  assert.equal(sementes.indexOf('P1')<4,sementes.indexOf('P2')>=4);
  const pos=n=>Number(n.slice(1));
  for(const [o,c] of playoff){assert.ok(pos(c)>=9&&pos(c)<=16&&pos(o)>=17&&pos(o)<=24);}
  const k=sementes.indexOf('P1');assert.ok([15,16].includes(pos(playoff[k][1])),'1º espera o vencedor do confronto 15/16 × 17/18');
 }
});

test('chave fixa: os vencedores seguem no próprio trilho até a final',()=>{
 const c=simularCampanhaCopa({nome:'Champions League',usuario:'Real Madrid',forcaUsuario:90,clubes:europeus,ano:2030,formato:'liga',seed:'trilho'});
 const ordem=['Oitavas de final','Quartas de final','Semifinal','Final'].map(f=>c.fases.find(x=>x.fase===f));assert.ok(ordem.every(Boolean));
 for(let i=1;i<ordem.length;i++){
  const antes=ordem[i-1].jogos.map(j=>j.vencedor);
  for(const j of ordem[i].jogos){const a=antes.indexOf(j.casa),b=antes.indexOf(j.fora);assert.equal(Math.floor(a/2),Math.floor(b/2),`${ordem[i].fase}: vizinhos de chave`);}
 }
});

test('Mundial de Clubes: confederações separadas nos grupos (UEFA até dois) e 1A × 2B nas oitavas',async()=>{
 const {criarMundial32}=await import('../src/competicoes/mundialRapido.js');
 const c=criarMundial32({usuario:'Flamengo',forcaUsuario:86,ano:2029,historico:[{clube:'Flamengo',ano:2027,nome:'Libertadores'}],seed:'mundial'});
 const {grupos}=c.sorteios[0];
 for(const g of grupos){const porConf={};for(const n of g.times){const p=paisDoSorteio(c.pool.find(t=>t.nome===n),'mundial');if(p)porConf[p]=(porConf[p]||0)+1;}for(const [p,n] of Object.entries(porConf))assert.ok(n<=(p==='UEFA'?2:1)||p==='UEFA'&&n<=3,`${p} ${n}`);}
 let x=c;for(let i=0;x.fase!=='fim'&&i<40;i++){const d=decisaoCopa(x);x=d?escolherCopa(x,d.chave,d.penaltis?'canto':'controlar'):continuarCopa(x);}
 const oitavas=x.fases.find(f=>f.fase==='Oitavas de final');if(oitavas){const g=l=>x.grupos.find(y=>y.grupo===`Grupo ${l}`).classificacao;assert.ok(oitavas.jogos.some(j=>[j.casa,j.fora].includes(g('A')[0].nome)&&[j.casa,j.fora].includes(g('B')[1].nome)));}
 assert.ok(x.grupos.every(g=>g.jogos.length===6),'um turno nos grupos do Mundial');
});

test('coeficiente vivo: campanhas recentes sobem o clube de pote; detentor abre o pote 1',()=>{
 const historico=[{nome:'Libertadores',ano:2029,campeao:'Bolívar',fases:[{fase:'Final',jogos:[{casa:'Bolívar',fora:'Palmeiras',golsCasa:2,golsFora:1,vencedor:'Bolívar'}]}],grupos:[]}];
 assert.ok(coeficientesClubes(historico,{competicao:'Libertadores',ano:2030}).Bolívar>0);
 assert.equal(detentorDoTitulo(historico,'Libertadores',2030),'Bolívar');
 const c=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sulamericanos,ano:2030,formato:'grupos',seed:'detentor',historico});
 if(c.pool.some(t=>t.nome==='Bolívar'))assert.ok(c.sorteios[0].potes[0].includes('Bolívar'));
});

test('copas nacionais sorteiam cada fase: favoritos podem se cruzar cedo',()=>{
 const times=Array.from({length:16},(_,i)=>({nome:`T${i}`,forca:90-i}));let cruzou=0;
 for(let s=0;s<40;s++){const c=simularCampanhaCopa({nome:'FA Cup',tipo:'copa',usuario:'T15',forcaUsuario:75,clubes:times,ano:2030,formato:'mata',seed:`fa|${s}`});const f=c.fases[0];if(f.jogos.some(j=>Number(j.casa.slice(1))<4&&Number(j.fora.slice(1))<4))cruzou++;}
 assert.ok(cruzou>0,'sem chaveamento fixo do mais forte contra o mais fraco');
});

test('motor: mando de campo pesa, prorrogação segue o regulamento',()=>{
 assert.ok(chancesCopa(80,80,'controlar',false,null,1).vitoria>chancesCopa(80,80,'controlar',false,null,-1).vitoria);
 assert.ok(golsEsperados(80,80,{mando:1}).a>golsEsperados(80,80).a);
 assert.equal(temProrrogacao({nome:'Libertadores',idaVolta:true}),false);
 assert.equal(temProrrogacao({nome:'Libertadores',final:true}),true);
 assert.equal(temProrrogacao({nome:'Champions League',idaVolta:true}),true);
 assert.equal(temProrrogacao({nome:'Copa do Brasil',final:true,idaVolta:true}),false);
 assert.equal(temProrrogacao({nome:'Paulista',tipo:'estadual'}),false);
 assert.equal(temProrrogacao({nome:'FA Cup'}),true);
});

test('sorteios são reproduzíveis com a mesma semente',()=>{
 const a=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sulamericanos,ano:2030,formato:'grupos',seed:'repete'}),b=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sulamericanos,ano:2030,formato:'grupos',seed:'repete'});
 assert.deepEqual(a.sorteios,b.sorteios);
 const potes=montarPotes([{nome:'x',forca:1},{nome:'y',forca:9}],2);assert.deepEqual(potes.map(p=>p[0].nome),['y','x']);
 const g=sortearGrupos([[{nome:'a',pais:'B'},{nome:'b',pais:'B'}],[{nome:'c',pais:'B'},{nome:'d',pais:'A'}]],{rng:geradorTecnico('g'),pais:t=>t.pais});assert.equal(g.grupos.length,2);
 assert.equal(sortearFaseLiga(montarPotes(Array.from({length:12},(_,i)=>({nome:`Z${i}`,pais:`P${i%5}`})),4),{rng:geradorTecnico('z')}).rodadas.length,8);
});

test('Copa do Mundo: 48 seleções pelas cotas, sedes no pote 1, 12 grupos e 16 avos com os melhores terceiros',async()=>{
 const {classificadosCopaDoMundo,COTAS_COPA_48}=await import('../src/competicoes/copaDoMundo.js');
 const {SELECOES_TECNICO}=await import('../src/treinador/selecoesTecnico.js');
 const r=classificadosCopaDoMundo(2026,{selecoes:SELECOES_TECNICO,garantidas:['JAM']});
 assert.equal(r.classificadas.length,48);assert.equal(new Set(r.classificadas.map(n=>n.nac)).size,48);
 for(const sede of ['EUA','MEX','CAN','JAM'])assert.ok(r.classificadas.some(n=>n.nac===sede),sede);
 const por={};for(const n of r.classificadas)por[n.confederacao]=(por[n.confederacao]||0)+1;
 for(const [conf,cota] of Object.entries(COTAS_COPA_48))assert.ok(por[conf]>=cota&&por[conf]<=cota+2,`${conf}: ${por[conf]}`);
 const pool=r.classificadas.map(n=>({...n,forca:n.elenco}));
 const c=simularCampanhaCopa({nome:'Copa do Mundo',tipo:'copaMundo',usuario:'Jamaica',forcaUsuario:65,clubes:pool,ano:2026,formato:'copa48',seed:'copa48'});
 assert.deepEqual(['Estados Unidos','México','Canadá'].filter(n=>c.sorteios[0].potes[0].includes(n)),['Estados Unidos','México','Canadá']);
 assert.equal(c.grupos.length,12);assert.ok(c.grupos.every(g=>g.jogos.length===6));
 for(const g of c.sorteios[0].grupos){const por={};for(const n of g.times){const k=pool.find(x=>x.nome===n).confederacao;por[k]=(por[k]||0)+1;}for(const [k,n] of Object.entries(por))assert.ok(n<=(k==='UEFA'?2:1),`${g.letra}: ${k}`);}
 const r32=c.fases.find(f=>f.fase==='16 avos de final');assert.equal(r32.jogos.length,16);
 const vivos=r32.jogos.flatMap(j=>[j.casa,j.fora]);assert.equal(new Set(vivos).size,32);
 const grupoDe=n=>c.grupos.find(g=>g.classificacao.some(x=>x.nome===n)).grupo;
 assert.ok(r32.jogos.every(j=>grupoDe(j.casa)!==grupoDe(j.fora)),'sem reencontro do grupo nos 16 avos');
 const terceiros=c.grupos.map(g=>g.classificacao[2].nome).filter(n=>vivos.includes(n));assert.equal(terceiros.length,8);
 assert.deepEqual(c.fases.map(f=>f.fase).slice(-5),['16 avos de final','Oitavas de final','Quartas de final','Semifinal','Final']);
});
