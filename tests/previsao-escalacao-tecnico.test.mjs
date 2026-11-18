import test from 'node:test';
import assert from 'node:assert/strict';
import {preverEscalacaoTecnico} from '../src/treinador/previsaoEscalacaoTecnico.js';

const clube=(formacao='4-4-2')=>({tecnico:{clube:'Santos',formacao,modoTreinadorRapido:true}});
const POSICOES=['GOL','LD','ZAG','ZAG','LE','VOL','MC','MC','MEI','ATA','ATA'];
const EXTRAS=['GOL','ZAG','VOL','MC','PD','PE','ATA','GOL'];
const elenco=()=>{
 const e=[...POSICOES,...EXTRAS].map((posicao,i)=>({
  id:'j'+i,nome:'Jogador '+i,clubeNome:'Santos',posicao,
  ovr:i<11?80+i%3:65+i%3,idade:22,aposentado:false,
 }));
 // Terceiro meia pode atuar na lateral direita, mas SOMENTE com aptidão.
 e.find(j=>j.id==='j14').posicoesSecundarias=[{posicao:'LD',apto:true}];
 return e;
};

test('prévia 4-4-2 apresenta onze jogadores e sete reservas com posições específicas',()=>{
 const e=elenco(),antes=structuredClone(e);
 const p=preverEscalacaoTecnico(clube(),e);
 assert.equal(p.formacao,'4-4-2');
 assert.equal(p.titulares.length,11);
 assert.equal(p.vagasAbertas,0);
 assert.equal(p.banco.length,7);
 assert.deepEqual(p.titulares.map(j=>j.setor),POSICOES);
 const todos=[...p.titulares,...p.banco].map(j=>j.id);
 assert.equal(new Set(todos).size,todos.length);
 assert.equal(p.titulares[1].id,'j1'); // lateral-direito de fato
 assert.ok(p.banco.some(j=>j.posicao==='GOL'),'preserva goleiro suplente');
 assert.deepEqual(e,antes);
});

test('11 atletas no clube não significa XI válido: vaga LE não pode ser coberta por zagueiro',()=>{
 const e=elenco(),le=e.find(j=>j.posicao==='LE');
 le.suspenso=true;
 const p=preverEscalacaoTecnico(clube(),e);
 assert.equal(p.vagasAbertas,1);
 assert.equal(p.titulares.find(j=>j.setor==='LE').id,null);
 assert.ok(p.banco.every(j=>j.id!=='j4'));
 const extras=e.filter(j=>j.id!=='j4');
 extras.find(j=>j.id==='j13').posicoesSecundarias=['LE'];
 assert.equal(preverEscalacaoTecnico(clube(),extras).vagasAbertas,1);
});

test('meia entra na lateral apenas se aptidão secundária for explícita',()=>{
 const e=elenco();
 e.find(j=>j.id==='j1').indisponivel=true; // sem LD principal
 let p=preverEscalacaoTecnico(clube(),e);
 assert.equal(p.vagasAbertas,0);
 const lateral=p.titulares.find(j=>j.setor==='LD');
 assert.equal(lateral.id,'j14');assert.equal(lateral.secundaria,true);
 const semAptidao=elenco();
 semAptidao.find(j=>j.id==='j1').indisponivel=true;
 semAptidao.find(j=>j.id==='j14').posicoesSecundarias=['LD'];
 p=preverEscalacaoTecnico(clube(),semAptidao);
 assert.equal(p.vagasAbertas,1);
 assert.equal(p.titulares.find(j=>j.setor==='LD').id,null);
});

test('lesões e suspensão excluem titulares e reservas; IDs repetidos são ignorados',()=>{
 const e=elenco();
 e.find(j=>j.id==='j0').suspenso=true;
 e.find(j=>j.id==='j10').lesao={jogosRestantes:2};
 e.find(j=>j.id==='j14').indisponivel=true;
 const antes=structuredClone(e);
 const p=preverEscalacaoTecnico(clube(),[...e,e[0],e[1]]);
 const banidos=new Set(['j0','j10','j14']);
 assert.equal(p.indisponiveis,3);
 const ids=[...p.titulares,...p.banco].filter(j=>j.id!==null).map(j=>j.id);
 assert.ok(ids.every(id=>!banidos.has(id)));
 assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(e,antes);
});

test('4-3-3, 4-4-2, 3-5-2 usam onze slots exatos, sem bônus ou fantasia',()=>{
 const e=elenco();
 for(const formacao of ['4-3-3','4-4-2','3-5-2']){
  const p=preverEscalacaoTecnico(clube(formacao),e);
  assert.equal(p.formacao,formacao);
  assert.equal(p.titulares.length,11);
  assert.equal(p.vagasAbertas,0);
  assert.ok(p.titulares.every(j=>j.id===null||e.some(a=>a.id===j.id&&a.ovr===j.ovr)));
  assert.equal(p.titulares.filter(j=>j.setor==='GOL').length,1);
  assert.equal(p.titulares.filter(j=>['LD','LE','ZAG'].includes(j.setor)).length,Number(formacao[0]));
  assert.equal(p.titulares.filter(j=>j.setor==='ATA').length,formacao==='4-3-3'?1:2);
 }
});

test('sem clube, seleção e elenco vazio não fabricam nomes',()=>{
 assert.equal(preverEscalacaoTecnico({},elenco()),null);
 assert.equal(preverEscalacaoTecnico({tecnico:{clube:'Santos'}},[]),null);
 assert.equal(preverEscalacaoTecnico({tecnico:{clube:'Brasil',tipoEquipe:'selecao'}},elenco()),null);
});
