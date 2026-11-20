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
 const copa=recordesTreinador(c,'competicao','Copa do Brasil');
 assert.equal(marca(copa,'tecnicoTitulos').valor,2);
 assert.equal(marca(copa,'tecnicoJogos'),undefined);
 assert.equal(marca(copa,'tecnicoPontos'),undefined);
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

test('campanha do treinador não vira partida de jogador por engano',()=>{
 const c=fixture();
 const perfil=consultarRecordesFutebol(c,'clube','Santos',c.tecnico.temporadas);
 assert.equal(perfil.recordes.find(r=>r.id==='jogosCarreira'),undefined);
 assert.equal(perfil.recordes.find(r=>r.id==='golsCarreira'),undefined);
 assert.equal(marca(perfil.recordes,'tecnicoJogos').valor,76);
});
test('ficha do treinador agrega passagens por clubes e seleções sem misturar atletas',()=>{
 const c=fixture();c.tecnico.universo.anos=[2027,2028,2029,2030];
 const perfil=consultarRecordesFutebol(c,'treinador','Lucas');
 assert.equal(marca(perfil.recordes,'tecnicoJogos').valor,121);
 assert.equal(marca(perfil.recordes,'tecnicoTemporadas').valor,4);
 assert.equal(marca(perfil.recordes,'tecnicoTitulos').valor,5);
 assert.ok(perfil.recordes.every(r=>r.categoria==='Treinador'));
});

test('copa continental usa alias sem transportar pontos ou acesso do campeonato nacional',()=>{
 const c={nome:'Treinadora',tecnico:{universo:{anos:[2030],edicoes:[]},temporadas:[
  temporada(2030,'Santos',22,10,6,['Brasileirão','UEFA Champions League'],
   {torneios:[{nome:'UEFA Champions League',faseUsuario:'Campeão',campeao:'Santos'}],
    acesso:{de:'B',para:'A'},demitido:true,cumpriuObjetivo:true})
 ]}};
 const copa=recordesTreinador(c,'competicao','Champions League');
 assert.equal(marca(copa,'tecnicoTitulos').valor,1);
 assert.equal(marca(copa,'tecnicoTemporadas').valor,1);
 for(const id of ['tecnicoJogos','tecnicoPontos','tecnicoVitorias','tecnicoAcessos',
   'tecnicoMetas','tecnicoDemissoes'])assert.equal(marca(copa,id),undefined);
 const liga=recordesTreinador(c,'competicao','Brasileirão');
 assert.equal(marca(liga,'tecnicoJogos').valor,38);
 assert.equal(marca(liga,'tecnicoAcessos').valor,1);
});
test('participação em copa sem título não fabrica vitórias de mata-mata',()=>{
 const c={nome:'Treinador',tecnico:{temporadas:[
  temporada(2031,'Santos',15,10,13,[],{torneios:[
   {nome:'Copa do Brasil',faseUsuario:'Eliminado nas oitavas',jogosUsuario:[{casa:'Santos',fora:'Palmeiras',golsCasa:0,golsFora:1}]}
  ]})
 ]}};
 const copa=recordesTreinador(c,'competicao','Copa do Brasil');
 assert.equal(marca(copa,'tecnicoTemporadas').valor,1);
 assert.equal(marca(copa,'tecnicoJogos'),undefined);
 assert.equal(marca(copa,'tecnicoTitulos'),undefined);
});

test('temporada mista não credita título da seleção ao clube nem jogos da liga à seleção',()=>{
 const c={nome:'Treinador',tecnico:{universo:{anos:[2028],edicoes:[]},temporadas:[
  temporada(2028,'Santos',20,10,8,['Brasileirão','Copa do Mundo'],{
   torneios:[{nome:'Copa do Mundo',selecao:'Brasil',campeao:'Brasil'}],
   cumpriuObjetivo:true
  })
 ]}};
 assert.equal(marca(recordesTreinador(c,'clube','Santos'),'tecnicoTitulos').valor,1);
 const brasil=recordesTreinador(c,'selecao','Brasil');
 assert.equal(marca(brasil,'tecnicoTitulos').valor,1);
 assert.equal(marca(brasil,'tecnicoJogos'),undefined);
 assert.equal(marca(brasil,'tecnicoMetas'),undefined);
 const copa=recordesTreinador(c,'competicao','Copa do Mundo');
 assert.equal(marca(copa,'tecnicoTitulos').valor,1);
 assert.equal(marca(copa,'tecnicoPontos'),undefined);
 assert.equal(marca(recordesTreinador(c,'treinador','Treinador'),'tecnicoTitulos').valor,2);
});

test('marco de vitórias do técnico atravessa clubes sem inflar números por equipe',()=>{
 const antes=fixture();antes.tecnico.universo.anos=[2027,2028];
 const depois=fixture();depois.tecnico.universo.anos=[2027,2028,2029];
 const e=detectarQuebrasRecordesFutebol(antes,depois,{
  ano:2029,escopos:[{tipo:'treinador',nome:'Lucas'}]
 });
 const marco=e.find(x=>x.metrica==='tecnicoVitorias');
 assert.equal(marco.valor,67);
 assert.equal(marco.marco,50);
 assert.equal(marco.tipo,'treinador');
 assert.ok(marco.titulo.includes('marco de 50'));
});
