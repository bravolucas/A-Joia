import test from 'node:test';
import assert from 'node:assert/strict';
import {FORMACAO_433} from '../src/dados/data.js';
import {MINIMOS_ELENCO,diagnosticarElenco} from '../src/simulacao/profundidadeElenco.js';
import {escalarVagasAptas,podeAtuarNaVaga} from '../src/simulacao/escalacaoApta.js';
import {gerarElenco,escalacaoProvavel,evoluirElenco} from '../src/comum/lib.js';

const versatil=()=>FORMACAO_433.map((posicao,i)=>({
 id:'atleta-'+i,nome:'Atleta '+i,nac:'BRA',posicao,idade:25,ovr:80-i,clubeNome:'Time Teste',aposentado:false,
})).map((p,i)=>{
 if(p.posicao==='LE')return {...p,posicao:'LD',posicoesSecundarias:[{posicao:'LE',apto:true}],ovr:68};
 return p;
});

test('lateral apto ocupa LE sem improviso, mantendo outro LD e 11 atletas exclusivos',()=>{
 const elenco=versatil();
 const antes=structuredClone(elenco);
 const r=escalacaoProvavel(elenco);
 assert.equal(r.titulares.length,11);
 assert.equal(new Set(r.titulares.map(j=>j.id)).size,11);
 assert.deepEqual(r.titulares.map(j=>j.vaga),FORMACAO_433);
 assert.equal(r.titulares.find(j=>j.vaga==='LE').secundaria,true);
 assert.equal(r.titulares.find(j=>j.vaga==='LE').improvisado,undefined);
 assert.equal(r.titulares.find(j=>j.vaga==='LD').posicao,'LD');
 assert.equal(r.banco.length,0);
 assert.deepEqual(elenco,antes);
});

test('apenas aptidão explícita é aproveitada, rótulos e proficiência sem critério não bastam',()=>{
 assert.equal(podeAtuarNaVaga({posicao:'LD',posicoesSecundarias:['LE']},'LE'),false);
 assert.equal(podeAtuarNaVaga({posicao:'LD',posicoesSecundarias:[{posicao:'LE',nivel:90}]},'LE'),false);
 assert.equal(podeAtuarNaVaga({posicao:'LD',posicoesSecundarias:[{posicao:'LE',apto:false}]},'LE'),false);
 assert.equal(podeAtuarNaVaga({posicao:'LD',posicoesSecundarias:[{posicao:'LE',apto:true}]},'LE'),true);
 const semAptidao=versatil().map(j=>j.posicoesSecundarias?{...j,posicoesSecundarias:['LE']}:j);
 const escalados=escalacaoProvavel(semAptidao);
 assert.equal(escalados.titulares.length,11);
 assert.equal(escalados.titulares.find(j=>j.vaga==='LE').improvisado,true);
 assert.equal(escalados.titulares.filter(j=>j.secundaria).length,0);
});

test('correspondência global resolve duas vagas concorrentes sem duplicar polivalente',()=>{
 const jogadores=[
  {id:'A',posicao:'LD',ovr:83,posicoesSecundarias:[{posicao:'LE',apto:true}]},
  {id:'B',posicao:'LD',ovr:66},
  {id:'C',posicao:'MC',ovr:81,posicoesSecundarias:[{posicao:'VOL',apto:true}]},
  {id:'D',posicao:'VOL',ovr:79},
 ];
 const vagas=['LD','LE','VOL','MC'];
 const escalados=escalarVagasAptas(jogadores,vagas);
 assert.equal(escalados.filter(Boolean).length,4);
 assert.equal(new Set(escalados.map(j=>j.id)).size,4);
 assert.equal(escalados.find(j=>j.vaga==='LE').id,'A');
 assert.equal(escalados.find(j=>j.vaga==='LD').id,'B');
 assert.ok(escalados.every(j=>!j.improvisado));
 assert.deepEqual(escalarVagasAptas(jogadores,vagas),escalados);
});

test('elenco persistente com 22 vagas qualificadas não cria titulares fantasmas ao carregar',()=>{
 const jogadores=Object.entries(MINIMOS_ELENCO).flatMap(([posicao,n])=>
   Array.from({length:n},(_,i)=>({id:posicao+i,nome:'Jogador '+posicao+i,
     posicao,ovr:77,idade:25,clubeNome:'Time Teste',nac:'BRA'})));
 // Dois LE inexistentes na posição principal: ambos podem ser cobertos
 // por laterais adaptados que tenham aptidão secundária explícita.
 for(const le of jogadores.filter(j=>j.posicao==='LE')){
   le.posicao='LD';le.posicoesSecundarias=[{posicao:'LE',apto:true}];
 }
 assert.equal(diagnosticarElenco(jogadores,{clubeNome:'Time Teste',contarSecundarias:true}).totalFaltante,0);
 const elenco=gerarElenco({nome:'Time Teste',liga:'brasileirao',forca:75},{jogadores},null);
 assert.equal(elenco.filter(j=>j.doMundo).length,22);
 assert.ok(elenco.every(j=>j.doMundo||j.daBase||j.id?.startsWith('e')));
 // A formação 4-3-3 exige dois MEI, enquanto o mínimo do mundo exige um.
 // Esse único complemento é legítimo; os demais são de 2 a 4 jovens da base.
 const novos=elenco.filter(j=>!j.doMundo);
 assert.ok(novos.length>=3&&novos.length<=5,'Somente o MEI faltante e 2–4 jovens da base podem ser criados');
 assert.equal(novos.filter(j=>j.posicao==='MEI'&&!j.daBase).length,1,'Completa o segundo MEI da formação');
 assert.equal(novos.filter(j=>j.posicao==='LE'&&!j.daBase).length,0,'Não duplica lateral apto da base mundial');
 const titulares=escalacaoProvavel(elenco);
 assert.equal(titulares.titulares.length,11);
 assert.equal(new Set(titulares.titulares.map(j=>j.id)).size,11);
 assert.ok(titulares.titulares.every(j=>!j.improvisado));
 // Jovens extras podem surgir naturalmente como LE e ganhar a vaga principal.
 // Portanto a aptidão mundial é verificada isolando apenas atletas persistidos.
 const titularesMundo=escalacaoProvavel(elenco.filter(j=>j.doMundo));
 assert.equal(titularesMundo.titulares.length,11);
 assert.equal(new Set(titularesMundo.titulares.map(j=>j.id)).size,11);
 assert.ok(titularesMundo.titulares.every(j=>!j.improvisado));
 assert.equal(titularesMundo.titulares.find(j=>j.vaga==='LE')?.secundaria,true);
});

test('aptidão sincroniza ao evoluir e não altera o objeto original do mundo',()=>{
 const originais=[{id:1,nome:'Jovem',posicao:'LD',idade:22,ovr:70,
   posicoesSecundarias:[{posicao:'LE',apto:true}],clubeNome:'Time Teste',aposentado:false}];
 const copia=structuredClone(originais);
 const elenco=evoluirElenco([],{nome:'Time Teste'},{jogadores:originais});
 assert.deepEqual(elenco[0].posicoesSecundarias,[{posicao:'LE',apto:true}]);
 assert.equal(podeAtuarNaVaga(elenco[0],'LE'),true);
 const atualizado=evoluirElenco(elenco,{nome:'Time Teste'},{jogadores:originais});
 assert.deepEqual(atualizado[0].posicoesSecundarias,[{posicao:'LE',apto:true}]);
 assert.deepEqual(originais,copia);
});


test('lesões e suspensões removem atletas da escalação e do banco, sem gerar atletas fantasmas',()=>{
 const elenco=versatil();
 const lesionado=elenco.find(j=>j.posicao==='ZAG');
 const suspenso=elenco.find(j=>j.posicao==='PD');
 lesionado.lesao={jogosRestantes:2};
 suspenso.suspenso=true;
 const antes=structuredClone(elenco);
 const r=escalacaoProvavel(elenco);
 const IDs=r.titulares.concat(r.banco).map(j=>j.id);
 assert.equal(r.titulares.length,9,'sem substitutos, escala apenas atletas disponíveis');
 assert.equal(new Set(IDs).size,IDs.length);
 assert.ok(!IDs.includes(lesionado.id));
 assert.ok(!IDs.includes(suspenso.id));
 assert.ok(r.titulares.every(j=>!j.aposentado&&!j.indisponivel&&!j.suspenso));
 assert.deepEqual(elenco,antes,'indisponibilidade não altera o cadastro');

 // Recuperou-se: volta a concorrer sem haver perda de posição secundária.
 lesionado.lesao={jogosRestantes:0};
 suspenso.suspenso=false;
 const recuperado=escalacaoProvavel(elenco);
 assert.equal(recuperado.titulares.length,11);
 assert.equal(new Set(recuperado.titulares.map(j=>j.id)).size,11);
 assert.equal(recuperado.titulares.find(j=>j.vaga==='LE')?.secundaria,true);
});

test('jogador do usuário suspenso não é escalado, e substituto apto não é improvisado',()=>{
 const jogadores=versatil();
 // O companheiro apto ocupa LE, o jogador do usuário não pode atuar suspenso.
 const eu={nome:'Usuário',posicao:'ATA',idade:23,ovr:99,suspenso:true,titularidade:100};
 const escalados=escalacaoProvavel(jogadores,eu);
 assert.equal(escalados.voceTitular,false);
 assert.equal(escalados.titulares.length,11);
 assert.ok(escalados.titulares.every(j=>j.id!=='EU'));
 assert.ok(escalados.banco.every(j=>j.id!=='EU'));
 assert.equal(escalados.titulares.find(j=>j.vaga==='LE')?.improvisado,undefined);

 // Uma suspensão encerrada permite o retorno do próprio usuário à seleção.
 const recuperado=escalacaoProvavel(jogadores,{...eu,suspenso:false});
 assert.ok(recuperado.titulares.some(j=>j.id==='EU')||recuperado.banco.some(j=>j.id==='EU'));
});

test('lesões não fazem gerar jogadores novos no cadastro persistente ao escalar',()=>{
 const jogadores=versatil();
 const lesionado=jogadores.find(j=>j.posicao==='LE') ?? jogadores.find(j=>j.posicoesSecundarias?.length);
 lesionado.indisponivel=true;
 const ids=new Set(jogadores.map(j=>j.id));
 const antes=structuredClone(jogadores);
 const selecionados=escalacaoProvavel(jogadores);
 const todos=[...selecionados.titulares,...selecionados.banco];
 assert.ok(todos.every(j=>ids.has(j.id)));
 assert.deepEqual(jogadores,antes);
 assert.ok(todos.every(j=>j.id!==lesionado.id));
});
