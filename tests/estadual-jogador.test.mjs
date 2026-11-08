import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,fecharTemporada} from '../src/jogador/rapido.js';
import {prepararEstadualJogador,chaveEstadualJogador,escolherEstadualJogador} from '../src/jogador/estadualJogador.js';
import {decisaoCopa} from '../src/treinador/copasEscolha.js';
function atleta(clube){const c=criarJogador({nome:'Paulista',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,codigo:'PAULISTA-'+clube});c.clubeNome=clube;c.flags.baseEscolhida=true;return c;}
for(const clube of ['Mirassol','Ponte Preta'])test(`${clube}: disputa inicial obrigatória, reload, conclusão e título único`,()=>{
 const r=jogarTemporada(atleta(clube)),antes=structuredClone(r),k=prepararEstadualJogador(r.c,r.card);assert.deepEqual(r,antes);assert.ok(k.estadualEmJogo);assert.ok(decisaoCopa(k.estadualEmJogo));assert.equal(k.estadualEmJogo.rodada,0);assert.equal(k.estadual.nome,'Campeonato Paulista');assert.ok(!k.titulos.some(t=>t.tipo==='estadual'));assert.throws(()=>fecharTemporada(r.c,k),/estadual/);
 let card=k,passos=0;while(card.estadualEmJogo&&passos++<40){const d=decisaoCopa(card.estadualEmJogo),chave=chaveEstadualJogador(card),op=d?d.penaltis?'canto':'controlar':'continuar',salvo=JSON.parse(JSON.stringify(card)),novo=escolherEstadualJogador(card,chave,op);assert.deepEqual(JSON.parse(JSON.stringify(novo)),JSON.parse(JSON.stringify(escolherEstadualJogador(salvo,chave,op))));assert.equal(escolherEstadualJogador(novo,chave,op),novo);card=novo;}
 assert.equal(card.estadualEmJogo,null);assert.equal(card.estadual.disputado,true);assert.ok(card.estadual.jogos.length>0);assert.ok(card.titulos.filter(t=>t.tipo==='estadual').length<=1);assert.equal(prepararEstadualJogador(r.c,card),card);
 card={...card,pendente:null,filaMomentos:[]};const f=fecharTemporada(r.c,card);assert.equal(f.c.temporadas.length,1);assert.equal(fecharTemporada(f.c,card).c,f.c);
});
test('estadual não é reaberto em temporada encerrada nem em clube estrangeiro',()=>{const c=atleta('Mirassol'),r=jogarTemporada(c);assert.equal(prepararEstadualJogador({...r.c,temporadas:[{ano:r.card.ano}]},r.card),r.card);const e=atleta('Real Madrid'),re=jogarTemporada(e);assert.equal(prepararEstadualJogador(re.c,re.card),re.card);});
