import test from 'node:test';
import assert from 'node:assert/strict';
import { selecionarFaixas, rngSemente, resumirAmostras, contarOutrosTitulos } from '../scripts/auditar-dificuldade-treinador.mjs';

test('auditoria da dificuldade escolhe equipes fraca, média e forte na mesma liga', () => {
  const clubes = [
    { nome: 'C', liga: 'brasileirao', elenco: 90 },
    { nome: 'A', liga: 'brasileirao', elenco: 50 },
    { nome: 'D', liga: 'brasileirao', elenco: 72 },
    { nome: 'B', liga: 'brasileirao', elenco: 60 },
    { nome: 'X', liga: 'espanha', elenco: 100 },
  ];
  const faixas = selecionarFaixas(clubes, 'brasileirao');
  assert.deepEqual(faixas.map(x => x.faixa), ['fraco','medio','forte']);
  assert.deepEqual(faixas.map(x => x.nome), ['A','B','C']);
  assert.deepEqual(faixas.map(x => x.elenco), [50,60,90]);
  assert.throws(() => selecionarFaixas(clubes,'espanha'), /três clubes/);
});

test('amostragem da auditoria reproduz a mesma sequência por semente', () => {
  const a=rngSemente(2026),b=rngSemente(2026),c=rngSemente(2027);
  const primeiro=Array.from({length:100},()=>a());
  assert.deepEqual(primeiro,Array.from({length:100},()=>b()));
  assert.notDeepEqual(primeiro.slice(0,4),Array.from({length:4},()=>c()));
  assert.ok(primeiro.every(v=>v>=0&&v<1));
});

test('auditoria conta copa separada do título da liga pelo nome exibido', () => {
  const temporada = {
    liga: 'brasileirao',
    campeao: true,
    titulosConquistados: ['Brasileirão', 'Copa do Brasil', 'Libertadores'],
  };
  assert.equal(contarOutrosTitulos(temporada), 2);
  assert.equal(contarOutrosTitulos({...temporada,titulosConquistados:['Brasileirão']}),0);
  assert.equal(contarOutrosTitulos({...temporada,titulosConquistados:[]}),0);
  assert.equal(contarOutrosTitulos({...temporada,titulosConquistados:['Copa do Brasil']}),1);
});

test('resumo reporta posições, títulos e demissões sem inventar conclusão', () => {
  const s=resumirAmostras([
    {posicao:1,pontos:82,campeaoLiga:true,demitido:false,outrosTitulos:2},
    {posicao:4,pontos:65,campeaoLiga:false,demitido:false,outrosTitulos:1},
    {posicao:19,pontos:28,campeaoLiga:false,demitido:true,outrosTitulos:0},
    {posicao:16,pontos:31,campeaoLiga:false,demitido:true,outrosTitulos:0},
  ]);
  assert.equal(s.amostras,4);
  assert.equal(s.titulosLiga,1);
  assert.equal(s.percentualTitulosLiga,25);
  assert.equal(s.percentualDemissoes,50);
  assert.equal(s.mediaPontos,51.5);
  assert.equal(s.mediaPosicao,10);
  assert.deepEqual(s.posicoes,{minimo:1,p50:4,p90:16,maximo:19});
  assert.equal(s.mediaOutrosTitulos,0.75);
  assert.throws(()=>resumirAmostras([]),/Nenhuma temporada/);
});
