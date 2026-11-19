import test from 'node:test';
import assert from 'node:assert/strict';
import {regraDesempateCopa,vencedorPorGolsFora} from '../src/competicoes/desempatePorCompeticao.js';
import {prepararCopaPersistente,registrarJogoPersistente} from '../src/completo/copasPersistentes.js';
import {CLUBES} from '../src/dados/data.js';

test('o mesmo empate recebe soluções diferentes por regulamento e fase',()=>{
 const a=(nome,tamanho=16)=>regraDesempateCopa({nome,ano:2026,tamanho});
 assert.deepEqual(a('Copa do Brasil'),{golsFora:false,prorrogacao:false});
 assert.deepEqual(a('Copa do Brasil',2),{golsFora:false,prorrogacao:false});
 assert.deepEqual(a('Copa Libertadores'),{golsFora:false,prorrogacao:false});
 assert.deepEqual(a('Copa Libertadores',2),{golsFora:false,prorrogacao:true});
 assert.deepEqual(a('CONCACAF Champions Cup'),{golsFora:true,prorrogacao:true});
 assert.deepEqual(a('CONCACAF Champions Cup',2),{golsFora:false,prorrogacao:true});
 assert.deepEqual(a('UEFA Champions League'),{golsFora:false,prorrogacao:true});
 assert.deepEqual(a('CONMEBOL Recopa',2),{golsFora:false,prorrogacao:true});
});

test('Concacaf: gols fora no tempo regulamentar decidem agregado empatado',()=>{
 const ida={casa:'A',fora:'B',golsCasa:1,golsFora:0};
 const volta={casa:'B',fora:'A',golsCasa:2,golsFora:1};
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'CONCACAF Champions Cup',ano:2026,tamanho:16}),'A');
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'Copa Libertadores',ano:2026,tamanho:16}),null);
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'CONCACAF Champions Cup',ano:2026,tamanho:2}),null);
 const ida2={casa:'A',fora:'B',golsCasa:2,golsFora:1};
 const volta2={casa:'B',fora:'A',golsCasa:1,golsFora:0};
 assert.equal(vencedorPorGolsFora(ida2,volta2,{nome:'CONCACAF Champions Cup',ano:2026,tamanho:16}),'B');
});

test('Modo Jogador completo: empate agregado na Copa do Brasil vai aos pênaltis, sem prorrogação',()=>{
 const clube=CLUBES.find(x=>x.nome==='Santos');
 assert.ok(clube);
 const c={nome:'Atleta',idade:24,clube};
 const card={copasPersistentesVersao:1};
 const primeira=prepararCopaPersistente(c,card,'copaNacional',80);
 assert.ok(primeira);
 const adversario=primeira.adversario;
 const camp=card.campanhasCompletas.copaNacional;
 camp.ano=2026;
 assert.equal(camp.nome,'Copa do Brasil');
 const ida=registrarJogoPersistente(card,'copaNacional',{casa:'Santos',fora:adversario,golsCasa:1,golsFora:0});
 assert.equal(ida.ida,true);
 const final=registrarJogoPersistente(card,'copaNacional',{casa:adversario,fora:'Santos',golsCasa:1,golsFora:0});
 const confronto=final.resumo.jogosUsuario[0];
 assert.equal(confronto.golsCasa,1);
 assert.equal(confronto.golsFora,1);
 assert.equal(confronto.partidas.length,2);
 assert.equal(confronto.prorrogacao,undefined);
 assert.equal(confronto.penaltis,true);
 assert.ok(['Santos',adversario].includes(confronto.vencedor));
 assert.equal(card.pernasCopas.copaNacional,undefined);
});
