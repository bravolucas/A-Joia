import test from 'node:test';
import assert from 'node:assert/strict';
import {anoPainelTecnico,campanhaPainelTecnico,jogosPainelTecnico,elencoPainelTecnico,atletasEstatisticasPainel,anosEstatisticasPainel} from '../src/treinador/painelTecnico.js';
test('central usa o ano da campanha ainda em andamento',()=>{assert.equal(anoPainelTecnico({ano:2027,copasEmJogo:{ano:2026}}),2026);assert.equal(anoPainelTecnico({ano:2027}),2027);});
test('estatísticas de gols são derivadas só quando os placares estão completos',()=>{
 const t={clube:'Santos',ano:2026,temporadas:[{ano:2026,clube:'Santos',vitorias:1,empates:1,derrotas:0,confrontos:[{nome:'Flamengo',golsPro:2,golsContra:1,resultado:'V'},{nome:'Palmeiras',golsPro:1,golsContra:1,resultado:'E'}]}]};
 assert.equal(campanhaPainelTecnico(t).jogos,2);assert.equal(campanhaPainelTecnico(t).golsPro,3);assert.equal(campanhaPainelTecnico(t).golsContra,2);
 t.temporadas[0].confrontos.pop();assert.equal(campanhaPainelTecnico(t).golsPro,null);assert.equal(campanhaPainelTecnico({}),null);
});
test('calendário respeita mandos e conta as duas partidas, sem contar o agregado como terceiro jogo',()=>{
 const t={clube:'Santos',liga:'brasileirao',temporadas:[{ano:2026,clube:'Santos',confrontos:[{nome:'Flamengo',casa:false,golsPro:1,golsContra:2}],torneios:[{nome:'Copa do Brasil',fases:[{fase:'Final',jogos:[{casa:'Santos',fora:'Cruzeiro',golsCasa:3,golsFora:2,agregado:true,partidas:[{casa:'Santos',fora:'Cruzeiro',golsCasa:2,golsFora:0},{casa:'Cruzeiro',fora:'Santos',golsCasa:2,golsFora:1}]}]}]}]}]};
 const jogos=jogosPainelTecnico(t);assert.equal(jogos.length,3);assert.deepEqual([jogos[0].casa,jogos[0].fora,jogos[0].golsCasa,jogos[0].golsFora],['Flamengo','Santos',2,1]);assert.deepEqual(jogos.slice(1).map(j=>j.golsCasa),[2,2]);
});
test('elenco prioriza o cadastro ativo e não muda os dados ao consultar',()=>{
 const c={tecnico:{clube:'Santos',gestao:{clube:'Santos',elenco:[{id:'g1',mundoId:1,nome:'Atleta',setor:'ATA',qualidade:75,idade:21,contrato:3}]}},mundo:{jogadores:[{id:1,nome:'Atleta',posicao:'ATA',clubeNome:'Santos',ovr:72},{id:2,nome:'Outro',clubeNome:'Flamengo'}]}},antes=structuredClone(c);
 const e=elencoPainelTecnico(c);assert.equal(e.length,1);assert.equal(e[0].ovr,75);assert.equal(e[0].contrato,3);assert.deepEqual(c,antes);
});
test('estatísticas históricas ficam com o clube e o ano em que o atleta jogou',()=>{
 const c={tecnico:{clube:'Santos',universo:{anos:[2026,2027],atletas:{a:{id:'a',nome:'Pedro',posicao:'ATA',nac:'BRA',clube:'Flamengo',historico:[[2026,'Santos',30,12,7,null,null,[]],[2027,'Flamengo',20,8,4,null,null,[]]]},g:{id:'g',nome:'Goleiro',posicao:'GOL',nac:'BRA',clube:'Santos',historico:[[2026,'Santos',35,0,1,140,12,[]]]}}}}},antes=structuredClone(c);
 const lista=atletasEstatisticasPainel(c,2026);assert.equal(lista.length,2);assert.equal(lista[0].gols,12);assert.equal(lista.find(p=>p.posicao==='GOL').defesas,140);assert.equal(atletasEstatisticasPainel(c,2027).length,0);assert.deepEqual(anosEstatisticasPainel(c),[2027,2026]);assert.deepEqual(c,antes);
});
test('calendário de save antigo usa jogos do usuário e não revela final pendente',()=>{
 const t={clube:'Santos',temporadas:[{ano:2026,clube:'Santos',torneios:[{nome:'Copa antiga',jogosUsuario:[{casa:'Santos',fora:'Cruzeiro',golsCasa:1,golsFora:0}]},{nome:'Copa pendente',finalPendente:true,fases:[{fase:'Final',jogos:[{casa:'Santos',fora:'Flamengo',golsCasa:3,golsFora:0}]}]}]}]};
 assert.equal(jogosPainelTecnico(t).length,1);assert.equal(jogosPainelTecnico(t)[0].competicao,'Copa antiga');
});
