import test from 'node:test';
import assert from 'node:assert/strict';
import { registrarHistoricoTemporada, lerHistoricoTemporadas, registrarPremioIndividual, lerPremiosIndividuais, lerMovimentacoesJogador, creditarTitulosAtleta, lerTitulosAtleta, LIMITE_HISTORICO_TEMPORADAS } from '../src/simulacao/historicoJogadorMundo.js';
import {LIGAS} from '../src/dados/data.js';
import { registrarPremioCalendario } from '../src/completo/mundoTemporada.js';
import { estatisticasDasPartidas } from '../src/simulacao/estatisticasMundo.js';
import { completarCarenciasMundo, simularTemporadaMundo } from '../src/comum/lib.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const clubes = [
  { nome: 'Equipe A', liga: 'brasileirao', forca: 70 },
  { nome: 'Equipe B', liga: 'brasileirao', forca: 68 },
];

test('registra estatísticas e evolução sem alterar o atleta e converte para leitura', () => {
  const jogador = { id: 1, ovr: 76, jogos: 34, gols: 11, assist: 5, nota: 7.42 };
  const antes = structuredClone(jogador);
  const historico = registrarHistoricoTemporada(jogador, {
    temporada: 1, ano: 2027, clube: 'Equipe A',
    liga: 'brasileirao', idadeInicial: 21, ovrInicial: 72,
  });
  assert.deepEqual(jogador, antes);
  const [registro] = lerHistoricoTemporadas({ historicoTemporadas: historico });
  assert.deepEqual(registro, {
    temporada: 1, ano: 2027, clube: 'Equipe A', liga: 'brasileirao',
    idadeInicial: 21, ovrInicial: 72, ovrFinal: 76, jogos: 34,
    gols: 11, assistencias: 5, nota: 7.42,
  });
});

test('reprocessar temporada substitui registro e mantém limite de armazenamento', () => {
  const jogador = { ovr: 80, jogos: 30, gols: 10, assist: 3, nota: 7 };
  for (let temporada = 1; temporada <= 45; temporada++) {
    jogador.historicoTemporadas = registrarHistoricoTemporada(jogador, {
      temporada, clube: 'Equipe A', idadeInicial: 20, ovrInicial: 75,
    });
  }
  assert.equal(jogador.historicoTemporadas.length, LIMITE_HISTORICO_TEMPORADAS);
  assert.equal(jogador.historicoTemporadas[0][0], 16);
  jogador.gols = 13;
  jogador.historicoTemporadas = registrarHistoricoTemporada(jogador, {
    temporada: 45, clube: 'Equipe A', idadeInicial: 21, ovrInicial: 80,
  });
  assert.equal(jogador.historicoTemporadas.length, LIMITE_HISTORICO_TEMPORADAS);
  assert.equal(lerHistoricoTemporadas(jogador).at(-1).gols, 13);
  assert.deepEqual(lerHistoricoTemporadas({}), []);
});

test('motor anual gera histórico vinculado ao próprio atleta e não modifica o save de origem', () => {
  const jogadores = completarCarenciasMundo([], clubes, geradorTecnico('jogadores-historicos'));
  const mundo = { jogadores, temporada: 0, cadastroElencos: true };
  const antes = structuredClone(mundo);
  const resultado = simularTemporadaMundo(mundo, geradorTecnico('historico-ano-1'), {
    clubes, ano: 2027,
  });
  assert.deepEqual(mundo, antes);
  assert.equal(resultado.temporada, 1);
  for (const antigo of jogadores) {
    const atualizado = resultado.jogadores.find(j => j.id === antigo.id);
    assert.ok(atualizado, String(antigo.id));
    const historico = lerHistoricoTemporadas(atualizado);
    assert.equal(historico.length, 1);
    assert.equal(historico[0].temporada, 1);
    assert.equal(historico[0].ano, 2027);
    assert.equal(historico[0].clube, antigo.clubeNome);
    assert.equal(historico[0].idadeInicial, antigo.idade);
    assert.equal(historico[0].ovrInicial, antigo.ovr);
    assert.equal(historico[0].jogos, atualizado.jogos);
    assert.equal(historico[0].gols, atualizado.gols);
  }
});

test('histórias seguem o ID individual mesmo após cinco ciclos de mercado e envelhecimento', () => {
  let mundo = { jogadores: completarCarenciasMundo([], clubes, geradorTecnico('vida-propria')), temporada: 0 };
  const primeiroId = mundo.jogadores[0].id;
  for (let ano = 0; ano < 5; ano++) {
    mundo = simularTemporadaMundo(mundo, geradorTecnico('vida-ano-' + ano), {
      clubes, ano: 2027 + ano,
    });
  }
  const jogador = mundo.jogadores.find(j => j.id === primeiroId);
  assert.ok(jogador);
  const historico = lerHistoricoTemporadas(jogador);
  assert.deepEqual(historico.map(r => r.temporada), [1, 2, 3, 4, 5]);
  assert.equal(new Set(historico.map(r => r.temporada)).size, 5);
  assert.equal(historico.reduce((total, r) => total + r.jogos, 0), jogador.carreira.jogos);
});

test('prêmios são idempotentes por temporada e por tipo, limitados a 30 registros', () => {
 const jogador={id:7};
 for(let temporada=1;temporada<=35;temporada++){
   jogador.premiacoesIndividuais=registrarPremioIndividual(jogador,{
     temporada,ano:2026+temporada,tipo:'bola-de-ouro',clube:'Equipe A',
   });
 }
 assert.equal(jogador.premiacoesIndividuais.length,30);
 assert.equal(lerPremiosIndividuais(jogador)[0].temporada,6);
 jogador.premiacoesIndividuais=registrarPremioIndividual(jogador,{
   temporada:35,ano:2061,tipo:'bola-de-ouro',clube:'Equipe B',
 });
 assert.equal(lerPremiosIndividuais(jogador).length,30);
 assert.equal(lerPremiosIndividuais(jogador).at(-1).clube,'Equipe B');
 assert.deepEqual(lerPremiosIndividuais({}),[]);
});

test('Bola de Ouro do calendário pertence ao ID vencedor, não a um homônimo', () => {
 const mundo={temporada:2,anoCalendario:2028,historicoBolaDeOuro:[],jogadores:[
  {id:'atleta-a',nome:'Mesmo Nome',carreira:{bolasDeOuro:0}},
  {id:'atleta-b',nome:'Mesmo Nome',carreira:{bolasDeOuro:0}},
 ]};
 const antes=structuredClone(mundo);
 const proximo=registrarPremioCalendario(mundo,{id:'atleta-b',nome:'Mesmo Nome',clube:'Equipe B',gols:8,assist:4,ovr:88});
 assert.deepEqual(mundo,antes);
 assert.equal(lerPremiosIndividuais(proximo.jogadores[0]).length,0);
 assert.equal(lerPremiosIndividuais(proximo.jogadores[1]).length,1);
 assert.equal(lerPremiosIndividuais(proximo.jogadores[1])[0].ano,2028);
 assert.equal(proximo.jogadores[1].carreira.bolasDeOuro,1);
 assert.equal(registrarPremioCalendario(proximo,{id:'atleta-b',nome:'Mesmo Nome'}),proximo);
});

test('simulação anual vincula o prêmio a somente um atleta do próprio universo', () => {
 const mundo={jogadores:completarCarenciasMundo([],clubes,geradorTecnico('bola-de-ouro-mundo')),temporada:0};
 const resultado=simularTemporadaMundo(mundo,geradorTecnico('premio-mundo'),{clubes,ano:2027});
 const vencedores=resultado.jogadores.filter(p=>lerPremiosIndividuais(p).length>0);
 assert.equal(vencedores.length,1);
 assert.equal(vencedores[0].carreira.bolasDeOuro,1);
 assert.equal(lerPremiosIndividuais(vencedores[0])[0].temporada,1);
 assert.equal(resultado.historicoBolaDeOuro.length,1);
 assert.equal(resultado.historicoBolaDeOuro[0].nome,vencedores[0].nome);
 assert.equal(resultado.historicoBolaDeOuro[0].id,vencedores[0].id);
 assert.equal(resultado.historicoBolaDeOuro[0].clube,lerPremiosIndividuais(vencedores[0])[0].clube);
});

test('leitura de movimentações filtra dados legados e conserva origem e destino', () => {
 const jogador={movimentos:[
  {tipo:'transferencia',ano:2028,temporada:2,de:'Equipe A',para:'Equipe B',valor:null},
  {tipo:'fim-contrato',ano:2029,de:'Equipe B',para:null,valor:0},
  {tipo:'base',ano:2026},
 ]};
 const res=lerMovimentacoesJogador(jogador);
 assert.equal(res.length,2);
 assert.deepEqual(res[0],{temporada:2,ano:2028,tipo:'transferencia',de:'Equipe A',para:'Equipe B',valor:null});
 assert.deepEqual(res[1],{temporada:null,ano:2029,tipo:'fim-contrato',de:'Equipe B',para:null,valor:0});
 assert.deepEqual(lerMovimentacoesJogador({}),[]);
});

test('placares definitivos atualizam o histórico sazonal e preservam os dados de origem', () => {
 const antes={jogadores:completarCarenciasMundo([],clubes,geradorTecnico('historico-placares')),temporada:0};
 const projecao=simularTemporadaMundo(antes,geradorTecnico('projecao-placares'),{clubes,ano:2027});
 const card={ano:2027,classificacoesMundo:{brasileirao:{jogos:[
  {casa:'Equipe A',fora:'Equipe B',golsCasa:3,golsFora:1},
 ]}}};
 const snapshot=structuredClone(projecao);
 const resultado=estatisticasDasPartidas(projecao,antes,card,'placares-historico');
 assert.deepEqual(projecao,snapshot,'o recálculo não pode modificar a projeção de origem');
 const recalculados=resultado.jogadores.filter(p=>p.origemEstatisticas==='partidas');
 assert.ok(recalculados.length>0);
 for(const p of recalculados){
  const original=antes.jogadores.find(j=>j.id===p.id);
  const registro=lerHistoricoTemporadas(p).at(-1);
  assert.equal(registro.temporada,1);
  assert.equal(registro.clube,original.clubeNome);
  assert.equal(registro.idadeInicial,original.idade);
  assert.equal(registro.ovrInicial,original.ovr);
  assert.equal(registro.jogos,p.jogos);
  assert.equal(registro.gols,p.gols);
  assert.equal(registro.assistencias,p.assist);
 }
 assert.deepEqual(estatisticasDasPartidas(projecao,antes,card,'placares-historico'),resultado);
});

test('título coletivo exige partida na competição e no clube campeão', () => {
 const competicao='Brasileirão';
 const jogador={
  clubeNome:'Equipe B',clubeTemporada:'Equipe A',
  historicoTemporadas:[[1,2027,'Equipe A','brasileirao',20,67,69,4,2,0,7]],
  carreira:{titulos:0},
  porCompeticao:[{nome:competicao,jogos:4},{nome:'Copa do Brasil',jogos:0}],
 };
 const campeoes=[
  {clube:'Equipe A',nome:competicao,tipo:'liga',ano:2027},
  {clube:'Equipe A',nome:'Copa do Brasil',tipo:'copa',ano:2027},
  {clube:'Equipe B',nome:'Outra competição',tipo:'copa',ano:2027},
 ];
 const anterior=structuredClone(jogador);
 const premiado=creditarTitulosAtleta(jogador,campeoes,1);
 assert.deepEqual(jogador,anterior);
 assert.equal(premiado.carreira.titulos,1);
 assert.deepEqual(lerTitulosAtleta(premiado),[{temporada:1,ano:2027,tipo:'liga',nome:competicao,clube:'Equipe A'}]);
 assert.equal(creditarTitulosAtleta(premiado,campeoes,1),premiado,'duplicidade não deve criar cópia ou título');
 assert.deepEqual(lerTitulosAtleta(creditarTitulosAtleta({...jogador,porCompeticao:[]},campeoes,1)),[]);
});

test('títulos de calendário seguem só jogadores que disputaram a competição no campeão', () => {
 const antes={jogadores:completarCarenciasMundo([],clubes,geradorTecnico('titulos-placares')),temporada:0};
 const projetado=simularTemporadaMundo(antes,geradorTecnico('titulos-ano'),{clubes,ano:2027});
 const liga=LIGAS.brasileirao.nome;
 const card={ano:2027,classificacoesMundo:{brasileirao:{jogos:[
  {casa:'Equipe A',fora:'Equipe B',golsCasa:1,golsFora:0},
 ]}},campeoesCalendarioMundo:[
   {clube:'Equipe A',nome:liga,tipo:'liga',ano:2027},
   {clube:'Equipe A',nome:'Copa do Brasil',tipo:'copa',ano:2027},
 ]};
 const resultado=estatisticasDasPartidas(projetado,antes,card,'titulos-historico');
 const comTitulo=resultado.jogadores.filter(j=>lerTitulosAtleta(j).length>0);
 assert.ok(comTitulo.length>0);
 for(const p of comTitulo){
  assert.equal(p.clubeTemporada,'Equipe A');
  assert.equal(p.carreira.titulos,1);
  assert.equal(lerTitulosAtleta(p)[0].nome,liga);
  assert.ok(p.porCompeticao.some(comp=>comp.nome===liga&&comp.jogos>0));
 }
 assert.ok(resultado.jogadores.filter(j=>j.clubeTemporada==='Equipe B').every(j=>lerTitulosAtleta(j).length===0));
 assert.deepEqual(estatisticasDasPartidas(projetado,antes,card,'titulos-historico'),resultado);
});

test('Bola de Ouro do calendário usa ano da temporada, não o próximo ano já avançado', () => {
 const temporada=2, anoTemporada=2028;
 const mundo={
  temporada,anoCalendario:2029,
  jogadores:[
   {id:1,nome:'Atleta Campeão',carreira:{bolasDeOuro:0},
    historicoTemporadas:[[2,anoTemporada,'Equipe A','brasileirao',24,82,85,36,20,6,8.1]]},
  ],
 };
 const resultado=registrarPremioCalendario(mundo,{
  id:1,nome:'Atleta Campeão',clube:'Equipe A',ovr:85,gols:20,assist:6,
 });
 assert.equal(lerPremiosIndividuais(resultado.jogadores[0])[0].ano,anoTemporada);
 assert.equal(mundo.jogadores[0].premiacoesIndividuais,undefined);
});
