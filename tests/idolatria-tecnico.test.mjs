import test from 'node:test';
import assert from 'node:assert/strict';
import {aceitarPropostaTecnico,negociarContratoTecnico,gerarPropostasTecnico} from '../src/treinador/tecnico.js';
import {riscosIdolatriaTecnico,vinculoAtivoTecnico} from '../src/treinador/idolatriaTecnico.js';
const proposta=nome=>({nome,pais:'Brasil',liga:'brasileirao',elenco:70,salario:30,exigencia:50});
const carreira=()=>({torcida:{Santos:95},temporadas:[{clube:'Santos',titulos:['Brasileirão']}],tecnico:{clube:'Flamengo',ano:2030,fase:'resultado',reputacao:60,temporadas:[],vinculosJogador:[{clube:'Santos',idolatria:true,afinidade:95,temporadas:5}],propostas:[proposta('Palmeiras'),proposta('Santos')]}});
test('assinar rival de um antigo ídolo rompe benefícios sem apagar história',()=>{
 const c=carreira(),antes=structuredClone(c);
 assert.deepEqual(riscosIdolatriaTecnico(c.tecnico,'Palmeiras').map(v=>v.clube),['Santos']);
 const novo=aceitarPropostaTecnico(c,'Palmeiras');assert.deepEqual(c,antes);
 assert.equal(vinculoAtivoTecnico(novo.tecnico,'Santos').idolatria,false);
 assert.deepEqual(novo.tecnico.vinculosJogador,c.tecnico.vinculosJogador);
 assert.deepEqual(novo.temporadas,c.temporadas);assert.deepEqual(novo.torcida,c.torcida);
 assert.equal(novo.tecnico.torcida,35);assert.equal(novo.tecnico.diretoria,48);
 assert.equal(novo.tecnico.rupturasIdolo.length,1);
 const recarregado=JSON.parse(JSON.stringify(novo));
 const retorno=aceitarPropostaTecnico({...recarregado,tecnico:{...recarregado.tecnico,ano:2031,propostas:[proposta('Santos')]}},'Santos');
 assert.equal(retorno.tecnico.retornoIdolo,false);assert.equal(retorno.tecnico.rupturasIdolo.length,1);
 assert.equal(riscosIdolatriaTecnico(retorno.tecnico,'Palmeiras').length,0);
});
test('proposta recusada ou projeto sem rivalidade não rompe idolatria',()=>{
 const c=carreira();const normal=aceitarPropostaTecnico(c,'Santos');
 assert.equal(normal.tecnico.retornoIdolo,true);assert.deepEqual(normal.tecnico.rupturasIdolo,[]);
 const recusado=negociarContratoTecnico({...c,tecnico:{...c.tecnico,reputacao:10,propostas:[{...proposta('Palmeiras'),exigencia:99}]}},'Palmeiras','salario',()=>0);
 assert.equal(recusado.tecnico.ultimaNegociacao.aceita,false);
 assert.equal(vinculoAtivoTecnico(recusado.tecnico,'Santos').idolatria,true);
 assert.equal(recusado.tecnico.rupturasIdolo,undefined);
});
test('rompimento remove vantagem nos convites de retorno',()=>{
 const t={...carreira().tecnico,reputacao:90,titulos:3,temporadas:Array(4).fill({clube:'Flamengo'})},rompido={...t,rupturasIdolo:[{clube:'Santos',rival:'Palmeiras',ano:2030}]};
 function convite(t){for(let n=1;n<500;n++){let s=n;const rng=()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);const p=gerarPropostasTecnico(t,rng).find(p=>p.nome==='Santos');if(p)return p;}}
 const a=convite(t),b=convite(rompido);assert.ok(a&&b);assert.ok(a.chance>b.chance);
});
