import test from 'node:test';
import assert from 'node:assert/strict';
import {recordesTreinador} from '../src/historia/recordesTreinador.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';
import {detectarQuebrasRecordesFutebol} from '../src/historia/noticiasRecordes.js';

const marca=(lista,id)=>lista.find(x=>x.id===id)?.simulado;
const temporada=(ano,clube,vitorias,empates,derrotas,titulosConquistados=[],extra={})=>({
 ano,clube,liga:'brasileirao',tipoEquipe:'clube',jogos:vitorias+empates+derrotas,
 vitorias,empates,derrotas,pontos:3*vitorias+empates,titulosConquistados,...extra
});
const fixture=()=>({nome:'Lucas',tecnico:{universo:{anos:[2027,2028],edicoes:[]},temporadas:[
 temporada(2027,'Santos',22,9,7,['Brasileirão']),
 temporada(2028,'Santos',25,8,5,['Brasileirão','Copa do Brasil']),
 temporada(2029,'Flamengo',20,10,8,['Copa do Brasil']),
 temporada(2030,'Brasil',7,0,0,['Copa do Mundo'],{liga:'selecao:CONMEBOL',tipoEquipe:'selecao'})
]}});

test('treinador: só soma temporadas arquivadas para o clube, sem transferência ou seleções',()=>{
 const c=fixture(),orig=JSON.stringify(c);
 const santos=recordesTreinador(c,'clube','Santos');
 assert.equal(marca(santos,'tecnicoTemporadas').valor,2);
 assert.equal(marca(santos,'tecnicoJogos').valor,76);
 assert.equal(marca(santos,'tecnicoVitorias').valor,47);
 assert.equal(marca(santos,'tecnicoPontos').valor,158);
 assert.equal(marca(santos,'tecnicoVitoriasAno').valor,25);
 assert.equal(marca(santos,'tecnicoPontosAno').valor,83);
 assert.equal(marca(santos,'tecnicoTitulos').valor,3);
 assert.equal(marca(santos,'tecnicoTitulosAno').valor,2);
 assert.equal(marca(santos,'tecnicoAproveitamento').valor,69.3);
 assert.equal(JSON.stringify(c),orig);
 assert.equal(recordesTreinador(c,'clube','Flamengo').length,0);
});
test('treinador: nacionalidade e ligas mantêm escopos separados',()=>{
 const c=fixture();c.tecnico.universo.anos=[2027,2028,2029,2030];
 assert.equal(marca(recordesTreinador(c,'selecao','Brasil'),'tecnicoJogos').valor,7);
 assert.equal(marca(recordesTreinador(c,'selecao','Brasil'),'tecnicoTitulos').valor,1);
 assert.equal(recordesTreinador(c,'selecao','Argentina').length,0);
 assert.equal(marca(recordesTreinador(c,'competicao','Brasileirão'),'tecnicoTemporadas').valor,3);
 assert.equal(marca(recordesTreinador(c,'competicao','Brasileirão'),'tecnicoTitulos').valor,2);
 assert.equal(recordesTreinador(c,'competicao','Copa do Brasil').length,0);
});
test('treinador: temporada com placares incongruentes nao fabrica jogos ou pontos',()=>{
 const c={nome:'Lucas',tecnico:{temporadas:[
 {ano:2030,clube:'Santos',tipoEquipe:'clube',jogos:38,vitorias:22,empates:7,derrotas:4,
  liga:'brasileirao',titulosConquistados:['Copa do Brasil']}
 ]}};
 const r=recordesTreinador(c,'clube','Santos');
 assert.equal(marca(r,'tecnicoJogos'),undefined);
 assert.equal(marca(r,'tecnicoVitorias'),undefined);
 assert.equal(marca(r,'tecnicoTemporadas').valor,1);
 assert.equal(marca(r,'tecnicoTitulos').valor,1);
});
test('apresentação unifica recordes de treinador ao Arquivo Vivo sem substituir os coletivos',()=>{
 const c=fixture(),dados=consultarRecordesFutebol(c,'clube','Santos');
 assert.equal(marca(dados.recordes,'tecnicoVitorias').valor,47);
 assert.equal(marca(dados.recordes,'tecnicoAproveitamento').unidade,'%');
 assert.equal(dados.recordes.find(x=>x.id==='tecnicoVitorias').real,null);
});
test('notícias de treinador são geradas somente depois de arquivar a nova temporada',()=>{
 const antes=fixture();antes.tecnico.universo.anos=[2027];
 const depois=fixture();depois.tecnico.universo.anos=[2027,2028];
 const escopos=[{tipo:'clube',nome:'Santos'}];
 const e=detectarQuebrasRecordesFutebol(antes,depois,{ano:2028,escopos});
 assert.ok(e.some(x=>x.metrica==='tecnicoVitorias'&&x.valor===47&&x.anterior===22));
 assert.ok(e.every(x=>x.ano===2028));
 assert.deepEqual(detectarQuebrasRecordesFutebol(depois,depois,{ano:2028,escopos}),[]);
});

test('metas, acesso, rebaixamento e demissao sao contabilizados apenas quando documentados',()=>{
 const c={nome:'Técnica',tecnico:{temporadas:[
  temporada(2027,'Santos',20,10,8,['Brasileirão','Brasileirão'],{acesso:{de:'B',para:'A'},cumpriuObjetivo:true}),
  temporada(2028,'Santos',12,10,16,[],{rebaixado:{de:'A',para:'B'},demitido:true,cumpriuObjetivo:false}),
  temporada(2029,'Flamengo',24,8,6,[],{cumpriuObjetivo:true})
 ]}};
 const santos=recordesTreinador(c,'clube','Santos');
 assert.equal(marca(santos,'tecnicoAcessos').valor,1);
 assert.equal(marca(santos,'tecnicoRebaixamentos').valor,1);
 assert.equal(marca(santos,'tecnicoDemissoes').valor,1);
 assert.equal(marca(santos,'tecnicoMetas').valor,1);
 assert.equal(marca(santos,'tecnicoTitulos').valor,1);
 const flamengo=recordesTreinador(c,'clube','Flamengo');
 assert.equal(marca(flamengo,'tecnicoDemissoes'),undefined);
 assert.equal(marca(flamengo,'tecnicoMetas').valor,1);
});
