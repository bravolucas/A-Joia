import test from 'node:test';
import assert from 'node:assert/strict';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

const recordes=c=>consultarRecordesFutebol(c,'competicao','Premier League').recordes;
const marca=(r,id)=>r.find(x=>x.id===id);
test('recordes oficiais da Premier League estão disponíveis sem depender de save',()=>{
 const linhas=recordes({});
 for(const [id,valor] of Object.entries({
  pontosEdicao:100,vitoriasTabelaEdicao:32,golsTabelaEdicao:106,
  saldoTabelaEdicao:79,invictoTabelaEdicao:38,vitoriasSeguidas:18,
  golsPartida:11,goleadaPartida:9,golsEquipePartida:9,golsAtletaPartida:5
 })){
  assert.equal(marca(linhas,id)?.real?.valor,valor,id);
  assert.equal(marca(linhas,id)?.simulado,null);
  assert.ok(marca(linhas,id)?.real?.fonte.startsWith('https://www.premierleague.com/'));
 }
 assert.equal(marca(linhas,'golsAtletaPartida').real.atleta,'Andrew Cole');
});
test('recorde de tabela de uma edição não soma jogos de outras temporadas',()=>{
 const c={universo:{edicoes:[
  {ano:2028,nome:'Premier League',tipo:'liga',classificacao:[
   {nome:'Chelsea',jogos:38,pontos:101,vitorias:33,golsPro:108,
    saldoGols:80,derrotas:0}],jogos:{nomes:[],partidas:[]}},
  {ano:2029,nome:'Premier League',tipo:'liga',classificacao:[
   {nome:'Chelsea',jogos:38,pontos:90,vitorias:27,golsPro:90,
    saldoGols:50,derrotas:1}],jogos:{nomes:[],partidas:[]}}
 ]}};
 const antes=JSON.stringify(c),r=recordes(c);
 for(const [id,valor] of Object.entries({
  pontosEdicao:101,vitoriasTabelaEdicao:33,golsTabelaEdicao:108,
  saldoTabelaEdicao:80,invictoTabelaEdicao:38
 })){
  assert.equal(marca(r,id).simulado.valor,valor,id);
  assert.equal(marca(r,id).real.valor,
   ({pontosEdicao:100,vitoriasTabelaEdicao:32,golsTabelaEdicao:106,
    saldoTabelaEdicao:79,invictoTabelaEdicao:38})[id]);
 }
 assert.equal(marca(r,'pontosEdicao').status,'Superado no save');
 assert.equal(marca(r,'invictoTabelaEdicao').status,'Igualado no save');
 assert.equal(JSON.stringify(c),antes);
});
