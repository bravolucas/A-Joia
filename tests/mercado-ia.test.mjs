import test from 'node:test';
import assert from 'node:assert/strict';
import { destinosTransferenciaIA } from '../src/simulacao/mercadoIA.js';
import { simularTemporadaMundo, completarCarenciasMundo } from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const clubes = [
  {nome:'Clube de Origem',liga:'brasileirao',forca:66},
  {nome:'Clube Controlado',liga:'brasileirao',forca:80},
  {nome:'Clube Alternativo',liga:'inglaterra',forca:82},
  {nome:'Clube Segunda',liga:'inglaterra2',forca:80},
  {nome:'Clube Sem Recursos',liga:'brasileirao',forca:81},
  {nome:'Clube Lotado',liga:'brasileirao',forca:81},
];
const jogador={
  id:1,nome:'Atleta da Base',posicao:'ATA',nac:'BRA',
  idade:23,ovr:80,potencial:80,picoIdade:29,
  clubeNome:'Clube de Origem',clubeOrigem:'Clube de Origem',
  liga:'brasileirao',traco:'ambicioso',carreira:{
    gols:0,assist:0,jogos:0,temporadas:0,titulos:0,bolasDeOuro:0,premios:0,
  },
};
const ocupacao=new Map([['Clube Lotado',30]]),perfis={'Clube Sem Recursos':{financas:10}};
test('a IA nunca seleciona o clube administrado pelo usuário e respeita capacidade e finanças',()=>{
 const destinos=destinosTransferenciaIA(jogador,clubes,ocupacao,perfis,{
  clubeControlado:'Clube Controlado',toleranciaOvr:6,
  forcaMinima:67,apenasPrimeiraDivisao:true,
 });
 assert.deepEqual(destinos.map(c=>c.nome),['Clube Alternativo']);
 assert.deepEqual(destinosTransferenciaIA(jogador,clubes,ocupacao,perfis,{
  clubeControlado:'Clube Alternativo',toleranciaOvr:6,
  forcaMinima:67,apenasPrimeiraDivisao:true,
 }).map(c=>c.nome),['Clube Controlado']);
});

test('o salto de carreira não escolhe um clube mais fraco ou da segunda divisão',()=>{
 const candidatos=destinosTransferenciaIA({...jogador,ovr:78},[
  {nome:'Clube de Origem',forca:66,liga:'brasileirao'},
  {nome:'Clube mais fraco',forca:70,liga:'brasileirao'},
  {nome:'Clube promoção',forca:80,liga:'brasileirao'},
  {nome:'Clube segunda divisão',forca:80,liga:'inglaterra2'},
 ],new Map(),{},{
  forcaMinima:67,toleranciaOvr:10,apenasPrimeiraDivisao:true,
 });
 assert.deepEqual(candidatos.map(c=>c.nome),['Clube mais fraco','Clube promoção']);
 // O filtro de progressão exige força estritamente superior à do clube atual,
 // não que ela necessariamente supere a nota individual do jogador.
 assert.ok(candidatos.every(c=>c.forca>66));
});

test('simulação anual não contrata para clube controlado mesmo se for o único destino viável',()=>{
 const mundo={jogadores:[jogador],temporada:0};
 const elenco=[
  {nome:'Clube de Origem',liga:'brasileirao',forca:66},
  {nome:'Clube Controlado',liga:'brasileirao',forca:80},
 ];
 const origem=structuredClone(mundo);
 const r=simularTemporadaMundo(mundo,()=>0,{clubes:elenco,clubeControlado:'Clube Controlado',ano:2027});
 assert.equal(r.jogadores.find(j=>j.id===1).clubeNome,'Clube de Origem');
 assert.equal(r.jogadores.find(j=>j.id===1).movimentos,undefined);
 assert.deepEqual(mundo,origem);
 const semControle=simularTemporadaMundo(mundo,()=>0,{clubes:elenco,ano:2027});
 assert.equal(semControle.jogadores.find(j=>j.id===1).clubeNome,'Clube Controlado');
 assert.equal(semControle.jogadores.find(j=>j.id===1).movimentos.at(-1).tipo,'transferencia');
});

test('nostálgico não volta automaticamente ao clube controlado',()=>{
 const universo={jogadores:[{
  ...jogador,idade:28,ovr:75,potencial:75,picoIdade:30,
  clubeNome:'Clube de Origem',clubeOrigem:'Clube Controlado',
  traco:'nostalgico',
 }],temporada:0};
 const res=simularTemporadaMundo(universo,()=>0,{clubes:[
  {nome:'Clube de Origem',liga:'brasileirao',forca:75},
  {nome:'Clube Controlado',liga:'brasileirao',forca:75},
 ],clubeControlado:'Clube Controlado',ano:2027});
 assert.equal(res.jogadores.find(j=>j.id===1).clubeNome,'Clube de Origem');
});

test('mercado em 15 temporadas nunca invade o clube do técnico nem altera o mundo de origem',()=>{
 const lista=[
  {nome:'Meu Clube',liga:'brasileirao',forca:80},
  {nome:'Equipe Norte',liga:'brasileirao',forca:70},
  {nome:'Equipe Sul',liga:'brasileirao',forca:75},
  {nome:'Equipe Leste',liga:'brasileirao',forca:84},
 ];
 let mundo={jogadores:completarCarenciasMundo([],lista,geradorTecnico('mercado-base')),temporada:0,cadastroElencos:1};
 for(let ano=0;ano<15;ano++){
  const antes=structuredClone(mundo);
  mundo=simularTemporadaMundo(mundo,geradorTecnico('mercado-ano-'+ano),{
   clubes:lista,ano:2027+ano,clubeControlado:'Meu Clube',
  });
  assert.deepEqual(antes.temporada,ano);
  assert.deepEqual(mundo.temporada,ano+1);
  assert.deepEqual(antes.jogadores,structuredClone(antes.jogadores));
  assert.ok(mundo.jogadores.every(j=>(j.movimentos||[]).every(m=>m.tipo!=='transferencia'||m.para!=='Meu Clube')),
   'IA não pode contratar automaticamente para o clube do treinador');
 }
});
