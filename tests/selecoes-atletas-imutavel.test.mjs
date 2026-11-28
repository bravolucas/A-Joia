// O arquivo de seleções da temporada anterior não pode ser alterado ao registrar o ano novo.
import test from 'node:test';
import assert from 'node:assert/strict';
import {registrarSelecoesDoAno} from '../src/simulacao/selecoesAtletas.js';

const jogadores=Array.from({length:26},(_,i)=>({id:i+1,nome:'Atleta '+i,nac:'BRA',posicao:i===0?'GOL':['ZAG','MEI','ATA'][i%3],ovr:80-i%10}));
const torneio=ano=>({nome:'Copa América',tipo:'continentalSelecao',campeao:'Brasil',vice:'Argentina',
 fases:[{fase:'Final',jogos:[{casa:'Brasil',fora:'Argentina',golsCasa:3,golsFora:1}]}]});

test('registrar um ano novo não altera os registros do ano anterior',()=>{
 const ano1=registrarSelecoesDoAno({}, {ano:2026,torneiosMundo:[torneio(2026)]}, jogadores);
 const congelado=JSON.stringify(ano1);
 const ano2=registrarSelecoesDoAno(ano1, {ano:2027,torneiosMundo:[torneio(2027)]}, jogadores);
 assert.equal(JSON.stringify(ano1),congelado,'o arquivo de 2026 foi alterado');
 const algum=Object.values(ano2.Brasil?.atletas||{}).find(r=>r.anos.includes(2026)&&r.anos.includes(2027));
 assert.ok(algum,'deveria haver atleta com 2026 e 2027');assert.ok(algum.jogos>=2);
});

test('refazer o mesmo ano a partir do mesmo arquivo dá o mesmo resultado',()=>{
 const base=registrarSelecoesDoAno({}, {ano:2026,torneiosMundo:[torneio(2026)]}, jogadores);
 const a=registrarSelecoesDoAno(base,{ano:2027,torneiosMundo:[torneio(2027)]},jogadores);
 const b=registrarSelecoesDoAno(base,{ano:2027,torneiosMundo:[torneio(2027)]},jogadores);
 assert.deepEqual(a,b);
});

import {clonarEstado} from '../src/simulacao/clonarEstado.js';
test('cópias da carreira compartilham o arquivo histórico em vez de duplicá-lo',()=>{
 const universo={versao:1,atletas:{a:{id:'a'}},edicoes:[{ano:2026}]};
 const estado={c:{nome:'X',universo,tecnico:{universo},mundo:{jogadores:[{id:1}]}}};
 const copia=clonarEstado(estado);
 assert.equal(copia.c.universo,universo,'universo do jogador duplicado');
 assert.equal(copia.c.tecnico.universo,universo,'universo do técnico duplicado');
 assert.notEqual(copia.c.mundo,estado.c.mundo,'o estado mutável precisa ser copiado');
});
