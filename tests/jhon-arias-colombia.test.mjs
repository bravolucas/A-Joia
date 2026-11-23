import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,JOGADORES_REAIS_BASE,NACIONALIDADES} from '../src/dados/data.js';
import {metadadosAtletaReal} from '../src/dados/metadadosAtletasReais.js';
import {gerarMundoJogadores,gerarElenco} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {corrigirNacionalidadeHistoricaJhonArias} from '../src/dados/corrigirNacionalidadeAtletasReais.js';
import {AJUSTE_FORTALEZA,AJUSTE_ELENCO_FORTALEZA,corrigirEquilibrioClubes} from '../src/dados/equilibrioClubes.js';
import {normalizarSave} from '../src/completo/save.js';

test('Palmeiras: Jhon Arias é colombiano independentemente da seed do mundo',()=>{
 const registros=JOGADORES_REAIS_BASE.filter(x=>x.nome==='Jhon Arias'&&x.time==='Palmeiras');
 assert.equal(registros.length,1,'não duplicar Jhon Arias no catálogo');
 assert.equal(registros[0].ovr,93,'preservar força já configurada');
 assert.equal(registros[0].posicao,'PD','preservar posição já configurada');
 const info=metadadosAtletaReal('Jhon Arias','Palmeiras');
 assert.deepEqual({...info},{nac:'COL',nascimento:'1997-09-21'});
 assert.equal(NACIONALIDADES.find(x=>x.id==='COL')?.label,'Colômbia');
 for(const seed of ['arias-colombia-a','arias-colombia-b']){
  const mundo=gerarMundoJogadores(geradorTecnico(seed));
  const registrados=mundo.jogadores.filter(x=>x.nome==='Jhon Arias'&&x.clubeOrigem==='Palmeiras');
  assert.equal(registrados.length,1);
  assert.equal(registrados[0].nac,'COL');
  assert.equal(registrados[0].idade,28);
  const palmeiras=CLUBES.find(c=>c.nome==='Palmeiras');
  const elenco=gerarElenco(palmeiras,mundo);
  assert.equal(elenco.find(x=>x.nome==='Jhon Arias')?.nac,'COL');
 }
});

test('corrigir save antigo preserva atleta, estatísticas, transferências e ídolos genéricos',()=>{
 const j={id:78,nome:'Jhon Arias',nac:'BRA',clubeOrigem:'Palmeiras',
  clubeNome:'Fluminense',idade:33,ovr:91,carreira:{jogos:80,gols:18},
  movimentos:[{de:'Palmeiras',para:'Fluminense',ano:2030}]};
 const outro={id:79,nome:'Jhon Arias',nac:'BRA',clubeOrigem:'Outro time',clubeNome:'Palmeiras'};
 const estado={ajustesCadastro:{[AJUSTE_FORTALEZA]:true,[AJUSTE_ELENCO_FORTALEZA]:true},
  mundo:{calibracaoFortalezaElenco:'2026-v2',jogadores:[j,outro]},
  tecnico:{gestao:{clube:'Fluminense',elenco:[{id:'espelho',mundoId:78,nac:'BRA',qualidade:91}]}},
  elenco:[{id:'m78',nome:'Jhon Arias',nac:'BRA'}]};
 const original=JSON.stringify(estado);
 const migrado=corrigirEquilibrioClubes(estado);
 assert.equal(migrado.mundo.jogadores[0].nac,'COL');
 assert.equal(migrado.mundo.jogadores[1].nac,'BRA');
 assert.equal(migrado.mundo.jogadores[0].clubeNome,'Fluminense','não devolver ao Palmeiras após transferência');
 assert.equal(migrado.mundo.jogadores[0].carreira.jogos,80);
 assert.deepEqual(migrado.mundo.jogadores[0].movimentos,j.movimentos);
 assert.equal(migrado.tecnico.gestao.elenco[0].nac,'COL');
 assert.equal(migrado.elenco[0].nac,'COL');
 assert.equal(JSON.stringify(estado),original,'não modificar arquivo de save original');
 assert.strictEqual(corrigirNacionalidadeHistoricaJhonArias(migrado),migrado,'migração idempotente');
});

test('modo completo normaliza nacionalidade em mundo separado da carreira',()=>{
 const j={id:8,nome:'Jhon Arias',nac:'BRA',clubeNome:'Palmeiras',clubeOrigem:'Palmeiras'};
 const estado=normalizarSave({
  versao:1,carreira:{nome:'Jogador criado',attrs:{velocidade:60}},
  mundo:{jogadores:[j],calibracaoFortalezaElenco:'2026-v2'},
  temporadas:[],
 });
 assert.equal(estado.mundo.jogadores[0].nac,'COL');
 assert.equal(estado.carreira.nome,'Jogador criado');
});
