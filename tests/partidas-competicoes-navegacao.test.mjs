import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compactarJogos,jogosDaEdicao} from '../src/simulacao/mundoVivo.js';
import {agruparPartidasCompeticao} from '../src/simulacao/partidasCompeticao.js';

const j=(rodada,casa,fora,fase=null)=>({rodada,casa,fora,golsCasa:2,golsFora:1,...(fase?{fase}:{})});

test('liga: jogos organizados por rodada numérica independentemente da ordem salva',()=>{
 const partidas=[j(3,'A','B'),j(1,'C','D'),j(2,'B','C'),j(1,'A','C'),j(3,'D','A')];
 const grupos=agruparPartidasCompeticao({tipo:'liga'},partidas);
 assert.deepEqual(grupos.map(g=>g.rotulo),['Rodada 1','Rodada 2','Rodada 3']);
 assert.deepEqual(grupos.map(g=>g.partidas.length),[2,1,2]);
 assert.equal(grupos.flatMap(g=>g.partidas).length,partidas.length);
});

test('copa: grupos, oitavas, quartas, semi e final permanecem organizados por fase',()=>{
 const partidas=[j(1,'A','B','Final'),j(3,'E','F','Fase de grupos · Grupo B'),
  j(2,'C','D','Oitavas de final'),j(2,'A','B','Quartas de final'),
  j(1,'C','E','Fase de grupos · Grupo A'),j(3,'E','C','Semifinal')];
 const grupos=agruparPartidasCompeticao({tipo:'copa'},partidas);
 assert.deepEqual(grupos.map(g=>g.rotulo),['Fase de grupos','Oitavas de final','Quartas de final','Semifinal','Final']);
 assert.deepEqual(grupos.map(g=>g.partidas.length),[2,1,1,1,1]);
});

test('playoffs de liga não se misturam às rodadas de pontos corridos',()=>{
 const partidas=[j(1,'A','B'),j(39,'C','D','playoff-3v6-ida'),
  j(40,'D','C','playoff-3v6-volta'),j(25,'E','F','quadrangular-Q1')];
 const grupos=agruparPartidasCompeticao({tipo:'liga'},partidas);
 assert.equal(grupos.find(x=>x.rotulo==='Playoffs de acesso')?.partidas.length,2);
 assert.equal(grupos.find(x=>x.rotulo==='Quadrangulares')?.partidas.length,1);
 assert.equal(grupos.find(x=>x.rotulo==='Rodada 1')?.partidas.length,1);
});

test('saves compactos antigos continuam legíveis e fase desconhecida não é adivinhada',()=>{
 const antigo={tipo:'copa',jogos:{nomes:['A','B'],partidas:[[0,1,2,1,4,null,0]]}};
 const jogos=jogosDaEdicao(antigo);
 assert.equal(jogos[0].fase,undefined);
 assert.equal(agruparPartidasCompeticao(antigo,jogos)[0].rotulo,'Etapa 4');
 assert.equal(agruparPartidasCompeticao({tipo:'liga'},jogos)[0].rotulo,'Rodada 4');
});

test('novos registros compactos conservam fase e placar, sem duplicação',()=>{
 const orig=[j(2,'C','D','Semifinal'),j(1,'A','B','Final')];
 orig[0].vencedor='D';orig[0].penaltis=true;
 const compacto=compactarJogos(orig);
 const edicao={tipo:'copa',jogos:compacto};
 const refeito=jogosDaEdicao(edicao);
 assert.equal(refeito[0].fase,'Semifinal');
 assert.equal(refeito[0].rodada,2);
 assert.equal(refeito[0].vencedor,'D');
 assert.equal(refeito[0].penaltis,true);
 assert.deepEqual(refeito.map(x=>[x.golsCasa,x.golsFora]),[[2,1],[2,1]]);
 assert.deepEqual(agruparPartidasCompeticao(edicao,refeito).map(x=>x.rotulo),['Semifinal','Final']);
});

test('liga sem rodada documentada não recebe rodada inventada; lista vazia não quebra',()=>{
 assert.deepEqual(agruparPartidasCompeticao({tipo:'liga'},[]),[]);
 assert.equal(agruparPartidasCompeticao({tipo:'liga'},[j(null,'A','B')])[0].rotulo,'Rodada não registrada');
 assert.equal(agruparPartidasCompeticao({tipo:'copa'},[j(null,'A','B')])[0].rotulo,'Fase não registrada');
});

test('arquivo de edições oculta jogos por padrão atrás de TODOS OS JOGOS',()=>{
 const ui=readFileSync(new URL('../src/simulacao/MundoVivo.jsx',import.meta.url),'utf8');
 assert.match(ui,/TODOS OS JOGOS/);
 assert.match(ui,/useState\(false\),\[etapa,ET\]/);
 assert.match(ui,/jogosAbertos&&<div/);
 assert.match(ui,/agruparPartidasCompeticao/);
 assert.match(ui,/partidasVisiveis/);
 assert.match(ui,/porPagina=20/);
});
