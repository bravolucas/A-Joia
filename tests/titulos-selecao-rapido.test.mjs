// Copa do Mundo e continental de seleções contam para a seleção, nunca para o clube.
import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,fecharTemporada,titulosDoClube,titulosDaSelecao,ehTituloSelecao} from '../src/jogador/rapido.js';

function temporadaCampeaDaCopa(){
 const c=criarJogador({nome:'Campeão do Mundo',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'COPA-SELECAO'});
 c.flags.baseEscolhida=true;c.clubeNome='Santos';c.idade=24;c.desafioAno=c.ano;
 const t=jogarTemporada(c);t.card.pendente=null;t.card.filaMomentos=[];t.card.copa=null;
 t.card.titulos=[{tipo:'copaMundo',nome:'Copa do Mundo'}];
 return t;
}

test('separação de títulos: seleção fora da conta do clube',()=>{
 const ts=[{tipo:'liga',nome:'Brasileirão'},{tipo:'copaMundo',nome:'Copa do Mundo'},{tipo:'continentalSelecao',nome:'Copa América'},{tipo:'bolaOuro',nome:'Bola de Ouro'}];
 assert.deepEqual(titulosDoClube(ts).map(t=>t.tipo),['liga']);
 assert.deepEqual(titulosDaSelecao(ts).map(t=>t.tipo),['copaMundo','continentalSelecao']);
 assert.ok(ehTituloSelecao('copaMundo')&&!ehTituloSelecao('continental'));
});

test('Copa do Mundo fica registrada para a seleção, não para o clube',()=>{
 const t=temporadaCampeaDaCopa();
 const f=fecharTemporada(t.c,t.card);
 const copa=f.c.lista.find(x=>x.tipo==='copaMundo');
 assert.equal(copa.clube,'Brasil');
 assert.equal(f.c.lista.filter(x=>x.clube==='Santos').length,0);
 assert.equal(f.c.titulos.copaMundo,1);
});

test('clube não paga bônus de título nem ganha torcida de título pela Copa do Mundo',()=>{
 const com=temporadaCampeaDaCopa(),sem=temporadaCampeaDaCopa();sem.card.titulos=[];
 const a=fecharTemporada(com.c,com.card),b=fecharTemporada(sem.c,sem.card);
 // bônus contratual idêntico: o título da seleção não entra no pagamento do clube
 assert.equal(a.card.ganhos?.bonus??a.card.ganhos,b.card.ganhos?.bonus??b.card.ganhos);
 // torcida do clube: no máximo o pequeno orgulho (+2), nunca os +7 de um título do clube
 assert.ok((a.c.torcida.Santos??0)-(b.c.torcida.Santos??0)<=2);
});
