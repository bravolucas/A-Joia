import test from 'node:test';
import assert from 'node:assert/strict';
import {afeicaoClube,afeicaoSelecao,statusIdolo,idolosDoClube,idolosDaSelecao,rankingIdolos,CRITERIOS_IDOLOS} from '../src/historia/idolos.js';
import {registrarSelecoesDoAno} from '../src/simulacao/selecoesAtletas.js';
import {registrarMercadoDoAno} from '../src/simulacao/tecnicosMundo.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';
import {ehClassico,rivaisClassicos} from '../src/simulacao/classicos.js';
import {lendasDe} from '../src/historia/lendasHistoricas.js';

const base={temporadas:0,titulos:0,gols:0,assist:0,golsClassicos:0,jogos:0,bandeira:false,rival:false};
test('afeição: tempo de casa, títulos, gols e clássicos sobem; ir para o rival derruba',()=>{
 const lenda={...base,temporadas:8,titulos:6,gols:180,assist:60,golsClassicos:12,jogos:400,bandeira:true};
 assert.ok(afeicaoClube(lenda)>=75);assert.equal(statusIdolo(afeicaoClube(lenda)).id,'lenda');
 assert.ok(afeicaoClube({...lenda,rival:true,bandeira:false})<afeicaoClube(lenda)-25);
 assert.equal(statusIdolo(10),null);assert.equal(statusIdolo(80,'selecao').nome,'Lenda da seleção');
 assert.ok(afeicaoClube({...base,temporadas:2,jogos:60,gols:5,vinculoTorcida:100})>afeicaoClube({...base,temporadas:2,jogos:60,gols:5}));
 assert.ok(afeicaoSelecao({jogos:80,gols:40,assist:10,titulos:2,temporadas:10})>=75);
});

const linha=(ano,clube,jogos,gols,extra={})=>[ano,clube,jogos,gols,0,null,null,extra.titulos||[],extra.destino||null,extra.aposentou?1:0,[['Liga',jogos,gols,0,0,0,extra.jc||0,extra.gc||0]]];
const save={nome:'Teste',temporadas:[],universo:{atletas:{
 '1':{id:1,nome:'Camisa Dez',posicao:'MEI',clube:'Corinthians',historico:[linha(2030,'Corinthians',40,15,{titulos:['Liga'],jc:4,gc:3}),linha(2031,'Corinthians',42,18,{jc:4,gc:2,aposentou:true})]},
 '2':{id:2,nome:'Vira-casaca',posicao:'ATA',clube:'Palmeiras',historico:[linha(2030,'Corinthians',45,40,{jc:4,gc:6,destino:'Palmeiras'}),linha(2031,'Palmeiras',40,20)]},
 '3':{id:3,nome:'Goleiro Fiel',posicao:'GOL',clube:'Corinthians',historico:[[2030,'Corinthians',38,0,0,0,20,[],null,0,[]]]},
},selecoes:{Brasil:{atletas:{'1':{id:1,nome:'Camisa Dez',posicao:'MEI',jogos:12,gols:6,assist:3,titulos:[{nome:'Copa América',ano:2031}],anos:[2030,2031]}}}},
mercadoClubes:{Corinthians:{maiorVenda:{nome:'Vira-casaca',id:2,valor:42500,ano:2031,clube:'Palmeiras'}}}}};

test('palco do clube: rankings por critério, gols em clássicos e quem foi para o rival',()=>{
 assert.ok(ehClassico('Corinthians','Palmeiras'));assert.ok(rivaisClassicos('Corinthians').includes('Palmeiras'));
 const l=idolosDoClube(save,'Corinthians');assert.deepEqual(l.map(x=>x.nome).slice(0,1),['Camisa Dez']);
 const vira=l.find(x=>x.nome==='Vira-casaca');assert.equal(vira.rival,true);assert.equal(vira.golsClassicos,6);
 const crit=id=>CRITERIOS_IDOLOS.clube.find(x=>x.id===id);
 assert.equal(rankingIdolos(l,crit('gols'))[0].nome,'Vira-casaca');
 assert.equal(rankingIdolos(l,crit('classicos'))[0].nome,'Vira-casaca');
 assert.equal(rankingIdolos(l,crit('conquistas'))[0].nome,'Camisa Dez');
 assert.deepEqual(rankingIdolos(l,crit('paredoes')).map(x=>x.nome),['Goleiro Fiel']);
 assert.ok(l.find(x=>x.nome==='Camisa Dez').bandeira);
 assert.ok(lendasDe('Santos').includes('Pelé'));
});

test('palco da seleção e recordes de seleção, clássicos e mercado',()=>{
 const s=idolosDaSelecao(save,'Brasil');assert.equal(s[0].nome,'Camisa Dez');assert.equal(s[0].titulos,1);
 const rc=consultarRecordesFutebol(save,'clube','Corinthians'),r=id=>rc.recordes.find(x=>x.id===id)?.simulado;
 assert.equal(r('golsClassicosCarreira').valor,6);assert.equal(r('golsClassicosCarreira').atleta,'Vira-casaca');
 assert.equal(r('maiorVenda').valor,42.5);assert.match(r('maiorVenda').destaque,/Palmeiras/);
 const rs=consultarRecordesFutebol(save,'selecao','Brasil'),q=id=>rs.recordes.find(x=>x.id===id)?.simulado;
 assert.equal(q('jogosSelecao').valor,12);assert.equal(q('golsSelecao').atleta,'Camisa Dez');
});

test('números por seleção vêm dos jogos dos torneios; mercado guarda maior venda e compra',()=>{
 const jogadores=Array.from({length:30},(_,i)=>({id:i,nome:`J${i}`,nac:'BRA',posicao:i===0?'GOL':i<10?'ZAG':'ATA',ovr:90-i}));
 const a={ano:2030,torneiosMundo:[{nome:'Copa América',tipo:'continentalSelecao',selecao:true,campeao:'Brasil',fases:[{fase:'Final',jogos:[{casa:'Brasil',fora:'Argentina',golsCasa:3,golsFora:1,vencedor:'Brasil'}]}]}]};
 const r=registrarSelecoesDoAno({},a,jogadores,'t'),br=Object.values(r.Brasil.atletas);
 assert.equal(br.length,11);assert.equal(br.reduce((s,x)=>s+x.gols,0),3);assert.ok(br.every(x=>x.titulos.length===1));
 assert.deepEqual(registrarSelecoesDoAno({},a,jogadores,'t'),r);
 const m=registrarMercadoDoAno({},[{tipo:'transferencia',valor:9000,nome:'A',id:1,de:'X',para:'Y',ano:2030},{tipo:'transferencia',valor:5000,nome:'B',id:2,de:'X',para:'Z',ano:2030},{tipo:'emprestimo',valor:0,nome:'C',de:'X',para:'Y'}],2030);
 assert.equal(m.X.maiorVenda.nome,'A');assert.equal(m.Y.maiorCompra.valor,9000);assert.equal(m.Z.maiorCompra.nome,'B');
});
