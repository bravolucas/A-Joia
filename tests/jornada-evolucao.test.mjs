import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador} from '../rapido.js';
import {atualizarGeracaoSelecao,reagirReencontro,contextoReencontro,celebracaoMomento,fecharJornada,registrarTransferenciaJornada} from '../jornadaJogador.js';
const atleta=()=>{const c=criarJogador({nome:'Memória',nac:'BRA',posicao:'MC',personalidade:'ascensao',origem:'base',pe:'destro',codigo:'EVOLUCAO'});c.ano=2040;c.idade=30;c.clubeNome='Santos';c.torcida={Santos:70,Milan:60};return c;};
const card=c=>({ano:c.ano,idade:c.idade,posicao:c.posicao,clube:c.clubeNome,jogos:30,gols:4,assist:8,nota:7.4,titulos:[],momentos:[],destaques:[],ovrDepois:76});
test('seleção mantém onze funções, preserva nomes e substitui somente quem envelheceu',()=>{
 const c=atleta(),a=atualizarGeracaoSelecao(c);assert.equal(a.length,11);assert.equal(new Set(a.map(x=>x.id)).size,11);assert.equal(new Set(a.map(x=>x.nome)).size,11);assert.equal(a.filter(x=>x.posicao==='ZAG').length,2);
 const b=atualizarGeracaoSelecao(c,2041);assert.deepEqual(b.map(x=>x.id),a.map(x=>x.id));
 c.jornada.geracao[0].nascimento=2000;const antes=c.jornada.geracao[0].id,d=atualizarGeracaoSelecao(c,2042);assert.equal(d.length,11);assert.ok(!d.some(x=>x.id===antes));assert.equal(c.jornada.exGeracao[0].id,antes);assert.ok(d.every(x=>x.idade>=18&&x.idade<=37));
 const snapshot=JSON.stringify(c.jornada);atualizarGeracaoSelecao(c,2042);assert.equal(JSON.stringify(c.jornada),snapshot);
});
test('geração antiga de três nomes é ampliada sem apagar seus vínculos; troca de país reinicia núcleo',()=>{
 const c=atleta();c.jornada.geracaoNac='BRA';c.jornada.geracao=[0,1,2].map(i=>({id:`antigo${i}`,nome:`Companheiro ${i}`,nascimento:2015,ficticio:true}));
 const a=atualizarGeracaoSelecao(c);assert.equal(a.length,11);assert.ok(a.some(x=>x.id==='antigo0'));c.nac='ARG';assert.ok(atualizarGeracaoSelecao(c).every(x=>x.id.startsWith('selecao:ARG:')));
});
test('reação ao ex-clube é opcional, tem efeito concreto e não pode ser repetida em outra decisão no mesmo ano',()=>{
 const c=atleta();c.temporadas=[{ano:2038,clube:'Milan',jogos:20,titulos:[]}];const m={adversario:{tipo:'clube',nome:'Milan'}};
 assert.equal(contextoReencontro(c,m).temporadas,1);const novo=reagirReencontro(c,m,'respeito');assert.equal(novo.torcida.Milan,62);assert.equal(c.torcida.Milan,60);assert.equal(reagirReencontro(novo,m,'foco'),novo);
 assert.equal(reagirReencontro(c,{adversario:{nome:'Flamengo'}},'foco'),c);assert.equal(contextoReencontro(c,{adversario:{tipo:'selecao',nome:'Milan'}}),null);
 const foco=reagirReencontro(c,m,'foco');assert.equal(foco.moral,c.moral+2);assert.equal(foco.torcida.Milan,c.torcida.Milan);
});
test('parceiro participa de títulos, confrontos e aposentadoria sem duplicar memórias',()=>{
 const c=atleta();c.jornada.duplas=[{id:'p1',nome:'Caio Nunes',clube:'Santos',nascimento:2010,temporadas:2,conexao:2,reencontros:0,rota:[{ano:2039,clube:'Santos'}]}];const a=card(c);a.titulos=[{nome:'Brasileirão',tipo:'liga'}];fecharJornada(c,a);assert.ok(c.jornada.memorias.some(m=>m.titulo==='Uma taça em parceria'));
 c.ano++;c.jornada.duplas[0].clube='Milan';const b=card(c);b.momentos=[{adversario:{nome:'Milan'},acertou:true,mini:'passe'}];fecharJornada(c,b);assert.ok(c.jornada.memorias.some(m=>m.titulo==='Amigos, agora adversários'));
 c.ano=2048;fecharJornada(c,card(c));assert.equal(c.jornada.duplas[0].aposentado,true);const n=c.jornada.memorias.length;fecharJornada(c,card(c));assert.equal(c.jornada.memorias.length,n);
});
test('chegada guarda o parceiro da cena e aplicar transferência duas vezes não repete bônus',()=>{
 const c=atleta();c.jornada.duplas=[{id:'p',nome:'Davi Monteiro',clube:'Milan',conexao:3,temporadas:4,nascimento:2010}];const t={ano:c.ano,de:'Santos',para:'Milan',tipo:'venda'};registrarTransferenciaJornada(c,t);assert.equal(t.reencontro.nome,'Davi Monteiro');assert.equal(t.reencontro.temporadas,4);const moral=c.moral;registrarTransferenciaJornada(c,t);assert.equal(c.moral,moral);
});
test('celebrações distinguem defesa, parceria, estreia, título e respeito ao clube antigo',()=>{
 const c=atleta();assert.equal(celebracaoMomento(c,{mini:'defesa'}).tipo,'defesa');assert.equal(celebracaoMomento(c,{mini:'cruzamento'}).tipo,'parceria');assert.equal(celebracaoMomento(c,{mini:'penalti'}).tipo,'estreia');c.totais.gols=30;assert.equal(celebracaoMomento(c,{tipo:'copa',mini:'falta'}).tipo,'titulo');c.temporadas=[{clube:'Milan'}];assert.equal(celebracaoMomento(c,{mini:'falta',adversario:{nome:'Milan'}}).tipo,'reencontro');
});
