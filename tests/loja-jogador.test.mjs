import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,CATALOGO_LOJA_JOGADOR,comprarInvestimento,jogarTemporada,fecharTemporada,chanceMomento,chancePenalti} from '../rapido.js';
import {comprarUpJogador,upsAtivosJogador} from '../lojaJogador.js';
const base=()=>({...criarJogador({nome:'Loja',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'LOJA-UP'}),patrimonio:50000});
test('catálogo tem 34 opções únicas, incluindo 14 UPs e 20 permanentes',()=>{
 assert.equal(CATALOGO_LOJA_JOGADOR.length,34);assert.equal(new Set(CATALOGO_LOJA_JOGADOR.map(x=>x.id)).size,34);
 assert.equal(CATALOGO_LOJA_JOGADOR.filter(x=>x.temporario).length,14);
 assert.ok(CATALOGO_LOJA_JOGADOR.every(x=>x.custo>0&&x.desc&&x.categoria));
});
test('compra desconta uma vez sem alterar atributos e respeita saldo e posição',()=>{
 const c=base(),antes=structuredClone(c),r=comprarUpJogador(c,'up-gols');
 assert.equal(r.ok,true);assert.equal(r.c.patrimonio,c.patrimonio-120);assert.deepEqual(r.c.attrs,c.attrs);assert.deepEqual(c,antes);
 assert.equal(comprarUpJogador(r.c,'up-gols').ok,false);
 assert.equal(comprarUpJogador({...c,patrimonio:0},'up-gols').ok,false);
 assert.equal(comprarUpJogador(c,'up-defesa').ok,false);
 assert.equal(comprarUpJogador({...c,posicao:'GOL'},'up-gols').ok,false);
 assert.equal(comprarUpJogador({...c,posicao:'GOL'},'up-defesa').ok,true);
 assert.equal(comprarUpJogador({...c,aposentado:true},'up-gols').ok,false);
});
test('três UPs no máximo e bloqueio de famílias sobrepostas',()=>{
 let c=base();for(const id of ['up-evolucao','up-gols','up-nota'])c=comprarUpJogador(c,id).c;
 assert.equal(upsAtivosJogador(c).length,3);assert.equal(comprarUpJogador(c,'up-fisio').ok,false);
 assert.equal(comprarUpJogador(comprarUpJogador(base(),'up-ciclo-evolucao').c,'up-evolucao').ok,false);
});
test('duração acompanha temporadas, sobrevive a recarga e permite renovar só ao expirar',()=>{
 const c=base(),r=comprarUpJogador(c,'up-ciclo-fisico').c;
 assert.equal(upsAtivosJogador(JSON.parse(JSON.stringify(r))).length,1);
 assert.equal(upsAtivosJogador({...r,ano:r.ano+2}).length,1);
 const expirado={...r,ano:r.ano+3};assert.equal(upsAtivosJogador(expirado).length,0);assert.equal(comprarUpJogador(expirado,'up-ciclo-fisico').ok,true);
});
test('UP participa da simulação, bloqueia compra no meio do ano e expira ao fechar',()=>{
 const c=base();c.attrs=Object.fromEntries(Object.keys(c.attrs).map(k=>[k,85]));c.potencial=Object.fromEntries(Object.keys(c.attrs).map(k=>[k,95]));
 const up=comprarUpJogador(c,'up-gols').c;
 const sem=jogarTemporada(structuredClone(c)),com=jogarTemporada(up);
 assert.ok(sem.card.gols>0);
 assert.equal(com.card.gols,Math.round(sem.card.gols*1.15));assert.equal(com.card.jogos,sem.card.jogos);
 assert.equal(comprarUpJogador(com.c,'up-nota').ok,false);
 assert.equal(comprarInvestimento(com.c,'personal').ok,false);
 const fim=fecharTemporada(com.c,com.card);
 assert.equal(upsAtivosJogador(fim.c).length,0);assert.equal(comprarUpJogador(fim.c,'up-gols').ok,true);
 assert.ok(!fim.c.investimentos.includes('up-gols'));
});
test('precisão temporária aumenta chances e desaparece depois da validade',()=>{
 const c=base(),up=comprarUpJogador(c,'up-penalti').c;
 assert.ok(chancePenalti(up)>chancePenalti(c));
 assert.equal(chancePenalti({...up,ano:up.ano+1}),chancePenalti({...c,ano:c.ano+1}));
 const goleiro={...c,posicao:'GOL'},reflexo=comprarUpJogador(goleiro,'up-defesa').c;
 assert.ok(chanceMomento(reflexo,'defesa')>chanceMomento(goleiro,'defesa'));
 const novo=comprarInvestimento(c,'equipamento');assert.equal(novo.ok,true);assert.equal(comprarInvestimento(novo.c,'equipamento').ok,false);
});
