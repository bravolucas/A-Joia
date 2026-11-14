import test from 'node:test';
import assert from 'node:assert/strict';
import {criarCampanhaCopa,decisaoCopa,registrarPlacarCopa,continuarCopa,resumoCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';
const clubes=Array.from({length:32},(_,i)=>({nome:`Clube ${i}`,forca:60+i}));
function campanha(formato='grupos',times=clubes){return criarCampanhaCopa({nome:'Torneio',usuario:times[0].nome,forcaUsuario:60,clubes:times,formato,ano:2030,seed:'COPA-PERSISTENTE',interativoEstadual:true});}
function resultado(c,meus=0,outros=5){const d=decisaoCopa(c);const casa=d.casa?c.usuario:d.adversario,fora=d.casa?d.adversario:c.usuario;return registrarPlacarCopa(c,d.chave,{casa,fora,golsCasa:d.casa?meus:outros,golsFora:d.casa?outros:meus});}
function perderGrupos(c){while(c.fase!=='fim'){assert.ok(decisaoCopa(c)?.grupo);c=continuarCopa(resultado(c));}return c;}
test('eliminação no grupo não interrompe os outros grupos nem o título',()=>{
 const c=perderGrupos(campanha());
 assert.equal(c.grupos.length,8);
 assert.ok(c.grupos.every(g=>g.jogos.length===12&&g.classificacao.every(t=>t.jogos===6)));
 assert.ok(c.campeao&&c.vice&&c.campeao!==c.usuario);
 assert.equal(c.fases.at(-1).fase,'Final');
 assert.equal(jogosDaCampanha(resumoCampanhaCopa(c)).length,96+15);
 for(const fase of c.fases)for(const j of fase.jogos)assert.ok(j.vencedor);
});
test('eliminação na fase de liga conclui playoffs e final com classificados reais',()=>{
 const times=Array.from({length:36},(_,i)=>({nome:`Clube ${i}`,forca:i?99:1}));
 let c=campanha('liga',times);c.forcaUsuario=1;
 while(c.fase==='liga'){const d=decisaoCopa(c);if(!d)break;c=continuarCopa(resultado(c,0,50));}
 assert.equal(c.fase,'fim');assert.ok(c.posicaoInicial>24);assert.ok(c.campeao&&c.vice);
 const elegiveis=new Set(c.classificacao.slice(0,24).map(t=>t.nome));
 for(const fase of c.fases)for(const j of fase.jogos){assert.ok(elegiveis.has(j.casa));assert.ok(elegiveis.has(j.fora));}
 assert.equal(c.fases[0].jogos.length,8);
});
test('estadual continua com os quatro classificados após eliminação',()=>{
 const c=perderGrupos(campanha('estadual',clubes.slice(0,8)));
 assert.ok(c.posicaoInicial>4);assert.ok(c.campeao&&c.vice);
 assert.equal(c.fases.reduce((n,f)=>n+f.jogos.length,0),3);
});
test('placar ao vivo é imutável, validado e não pode ser aplicado duas vezes',()=>{
 const c=campanha('mata',clubes.slice(0,16)),antes=JSON.stringify(c),d=decisaoCopa(c);
 const novo=resultado(c,4,0);
 assert.equal(JSON.stringify(c),antes);assert.equal(novo.jogosUsuario[0].golsCasa,4);
 assert.equal(registrarPlacarCopa(novo,d.chave,{casa:c.usuario,fora:d.adversario,golsCasa:9,golsFora:0}),novo);
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{casa:c.usuario,fora:'Intruso',golsCasa:1,golsFora:0}));
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{casa:c.usuario,fora:d.adversario,golsCasa:1.5,golsFora:0}));
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{casa:c.usuario,fora:d.adversario,golsCasa:0,golsFora:0}));
 const retomado=JSON.parse(JSON.stringify(c));assert.deepEqual(resultado(c,4,0),resultado(retomado,4,0));
});
test('arquivo expande ida e volta e não conta o agregado como outra partida',()=>{
 const pernas=[{casa:'A',fora:'B',golsCasa:1,golsFora:0},{casa:'B',fora:'A',golsCasa:2,golsFora:0}];
 const c={fases:[{fase:'Semifinal',jogos:[{casa:'A',fora:'B',golsCasa:1,golsFora:2,partidas:pernas}]}]};
 assert.equal(jogosDaCampanha(c).length,2);assert.equal(jogosDaCampanha(c).reduce((n,j)=>n+j.golsCasa+j.golsFora,0),3);
});

import {prepararCopaPersistente,registrarJogoPersistente} from '../src/completo/copasPersistentes.js';
import {CLUBES} from '../src/dados/data.js';
test('copa do modo completo guarda ida, volta e os outros confrontos até o campeão',()=>{
 const c={nome:'Jogador',idade:24,clube:CLUBES.find(c=>c.nome==='Santos')},card={copasPersistentesVersao:1};
 let d=prepararCopaPersistente(c,card,'copaNacional',80);
 const adversario=d.adversario;
 assert.equal(registrarJogoPersistente(card,'copaNacional',{casa:'Santos',fora:adversario,golsCasa:1,golsFora:0}).ida,true);
 const salvo=JSON.parse(JSON.stringify(card));
 let r=registrarJogoPersistente(salvo,'copaNacional',{casa:adversario,fora:'Santos',golsCasa:4,golsFora:0});
 assert.equal(r.decisao,null);assert.ok(r.resumo.campeao&&r.resumo.campeao!=='Santos');
 const jogos=jogosDaCampanha(r.resumo),meus=jogos.filter(j=>[j.casa,j.fora].includes('Santos'));
 assert.equal(meus.length,2);assert.equal(jogos.length,29);
 assert.deepEqual(meus.map(j=>[j.golsCasa,j.golsFora]),[[1,0],[4,0]]);
 assert.equal(salvo.torneios[0].campeao,r.resumo.campeao);
 assert.equal(card.pernasCopas.copaNacional.golsCasa,1);
});
test('carreira antiga não recebe uma chave nova no meio da competição',()=>{
 const c={idade:24,clube:CLUBES.find(c=>c.nome==='Santos')},card={};
 assert.equal(prepararCopaPersistente(c,card,'copaNacional',80),null);
 assert.equal(card.campanhasCompletas,undefined);
});
for(const [clube,nome,formato] of [['Santos','Libertadores','grupo'],['Real Madrid','Champions League','suico']])test(`calendário persistente de ${nome} conserva grupos e campeão após eliminação`,()=>{
 const c={nome:'Continental',idade:25,clube:CLUBES.find(c=>c.nome===clube)},card={copasPersistentesVersao:1,continentalPendente:{nome,formato}};
 let d=prepararCopaPersistente(c,card,'continental',1),n=0;
 while(d?.grupo){const casa=d.casa?clube:d.adversario,fora=d.casa?d.adversario:clube;const r=registrarJogoPersistente(card,'continental',{casa,fora,golsCasa:d.casa?0:50,golsFora:d.casa?50:0});d=r.decisao;n++;}
 assert.equal(d,null);const t=card.torneios[0];assert.ok(t.campeao&&t.vice);assert.equal(n,formato==='grupo'?6:8);
 assert.ok(t.grupos.length);assert.ok(jogosDaCampanha(t).filter(j=>[j.casa,j.fora].includes(clube)).length===n);
 assert.equal(t.fases.at(-1).jogos[0].partidas,undefined);
 for(const fase of t.fases.slice(0,-1))assert.ok(fase.jogos.every(j=>j.partidas?.length===2));
});

import {registrarMundoVivo,jogosDaEdicao} from '../src/simulacao/mundoVivo.js';
import {estatisticasDasPartidas} from '../src/simulacao/estatisticasMundo.js';
test('arquivo e estatísticas do mundo incluem grupos e as duas pernas sem duplicar gols',()=>{
 const pernas=[{casa:'Santos',fora:'Flamengo',golsCasa:1,golsFora:0},{casa:'Flamengo',fora:'Santos',golsCasa:2,golsFora:0}];
 const torneio={nome:'Copa de verificação',tipo:'copa',campeao:'Flamengo',vice:'Santos',grupos:[{grupo:'Grupo A',classificacao:[{nome:'Santos',pontos:3},{nome:'Flamengo',pontos:0}],jogos:[{casa:'Santos',fora:'Flamengo',golsCasa:2,golsFora:1}]}],fases:[{fase:'Final',jogos:[{casa:'Santos',fora:'Flamengo',golsCasa:1,golsFora:2,partidas:pernas,vencedor:'Flamengo'}]}]};
 const antes={jogadores:['Santos','Flamengo'].flatMap((clube,i)=>['GOL','ATA'].map((posicao,j)=>({id:i*2+j,nome:`Atleta ${i}-${j}`,posicao,ovr:70,clubeNome:clube,carreira:{}})))};
 const a={ano:2030,clube:'Outro',torneios:[torneio]},mundo=estatisticasDasPartidas(structuredClone(antes),antes,a,'arquivo');
 assert.equal(mundo.jogadores.reduce((n,p)=>n+p.gols,0),6);
 assert.ok(mundo.jogadores.every(p=>p.jogos===3));
 const c={codigo:'arquivo-copas',mundo};registrarMundoVivo(c,a,{antesMundo:antes});
 const edicao=c.universo.edicoes.find(e=>e.nome===torneio.nome);
 assert.deepEqual(edicao.grupos[0].classificacao,torneio.grupos[0].classificacao);assert.equal(edicao.campeao,'Flamengo');assert.equal(jogosDaEdicao(edicao).length,3);
 assert.equal(jogosDaEdicao(edicao).reduce((n,p)=>n+p.golsCasa+p.golsFora,0),6);
});
test('rodadas de folga não exigem uma partida inexistente em grupo com número ímpar',()=>{
 const c=perderGrupos(campanha('grupos',clubes.slice(0,3)));
 assert.equal(c.jogosUsuario.length,4);assert.ok(c.campeao&&c.vice);
});
test('placar agregado não pode contradizer os resultados das duas pernas',()=>{
 const c=campanha('mata',clubes.slice(0,16)),d=decisaoCopa(c);
 assert.throws(()=>registrarPlacarCopa(c,d.chave,{casa:c.usuario,fora:d.adversario,golsCasa:9,golsFora:0,partidas:[{casa:c.usuario,fora:d.adversario,golsCasa:1,golsFora:0},{casa:d.adversario,fora:c.usuario,golsCasa:0,golsFora:1}]}),/Agregado/);
});
