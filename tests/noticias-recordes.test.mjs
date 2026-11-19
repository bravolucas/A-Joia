import test from 'node:test';
import assert from 'node:assert/strict';
import {detectarQuebrasRecordesFutebol,escoposRecordesDaTemporada,guardarQuebrasRecordesFutebol} from '../src/historia/noticiasRecordes.js';

const linha=(ano,clube,gols,jogos=30)=>[ano,clube,jogos,gols,2,null,null,[],null,0,[]];
const arquivo=(historico,nome='Rival do save')=>({
 nome:'Meu Jogador',nac:'BRA',universo:{desde:2027,atletas:{'5':{id:'5',nome,historico}},edicoes:[]}
});
const opts={ano:2028,escopos:[{tipo:'clube',nome:'Santos'}]};
test('primeira estatistica do save sem referencia historica nao dispara manchete',()=>{
 const novos=detectarQuebrasRecordesFutebol({},arquivo([linha(2028,'Santos',7)]),opts);
 assert.deepEqual(novos,[]);
});
test('recordes simulados quebrados aparecem uma vez, com marca anterior, autor e ano',()=>{
 const antes=arquivo([linha(2027,'Santos',10)]);
 const depois=arquivo([linha(2027,'Santos',10),linha(2028,'Santos',15)]);
 const eventos=detectarQuebrasRecordesFutebol(antes,depois,opts);
 assert.ok(eventos.some(x=>x.metrica==='golsCarreira'&&x.valor===25&&x.anterior===10));
 assert.ok(eventos.some(x=>x.metrica==='golsTemporada'&&x.anterior===10));
 assert.ok(eventos.every(x=>x.ano===2028&&x.entidade==='Santos'&&x.titulo&&x.detalhe));
 assert.deepEqual(JSON.parse(JSON.stringify(eventos)),eventos,'eventos de recordes devem sobreviver ao JSON sem perda de campos');
 assert.deepEqual(detectarQuebrasRecordesFutebol(depois,depois,opts),[]);
 const salvo=guardarQuebrasRecordesFutebol({recordesEventos:eventos},eventos);
 assert.equal(salvo.recordesEventos.length,eventos.length);
});
test('recorde real so gera noticia ao ser igualado ou superado por um novo resultado',()=>{
 const depois=arquivo([linha(2028,'Barcelona',673,39)],'Rival');
 const eventos=detectarQuebrasRecordesFutebol({},depois,{
  ano:2028,escopos:[{tipo:'clube',nome:'Barcelona'}]});
 const marca=eventos.find(x=>x.metrica==='golsCarreira');
 assert.equal(marca.historico,true);
 assert.equal(marca.valor,673);assert.equal(marca.anterior,672);
 assert.ok(marca.fonte.includes('barcelona'));
 assert.ok(!detectarQuebrasRecordesFutebol(depois,depois,{
  ano:2028,escopos:[{tipo:'clube',nome:'Barcelona'}]}).length);
});
test('sem alcance ou ano errado nao cria noticia e deduplicacao preserva saves',()=>{
 const base=arquivo([linha(2028,'Santos',45)]);
 assert.deepEqual(detectarQuebrasRecordesFutebol({},base,{ano:2027,escopos:opts.escopos}),[]);
 assert.deepEqual(guardarQuebrasRecordesFutebol({},[]),{recordesEventos:[]});
 const e=detectarQuebrasRecordesFutebol(arquivo([linha(2027,'Santos',3)]),base,{
  ano:2028,escopos:[{tipo:'clube',nome:'Santos'},{tipo:'clube',nome:'Santos'}]});
 assert.equal(new Set(e.map(x=>x.id)).size,e.length);
});
test('escopos priorizam clube, pais e competicoes efetivamente disputadas',()=>{
 const e=escoposRecordesDaTemporada({nac:'BRA'},{
  clube:'Santos',ligaNome:'Brasileirão',porCompeticao:[{nome:'Copa do Brasil',jogos:4},{nome:'Champions League',jogos:0}]
 });
 assert.deepEqual(e,[{tipo:'clube',nome:'Santos'},{tipo:'selecao',nome:'Brasil'},
  {tipo:'competicao',nome:'Brasileirão'},{tipo:'competicao',nome:'Copa do Brasil'}]);
});
