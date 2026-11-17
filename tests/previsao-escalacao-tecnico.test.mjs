import test from 'node:test';
import assert from 'node:assert/strict';
import {preverEscalacaoTecnico} from '../src/treinador/previsaoEscalacaoTecnico.js';

const clube=(formacao='4-4-2')=>({tecnico:{clube:'Santos',formacao,modoTreinadorRapido:true}});
const elenco=()=>{
 let indice=0;
 const jogadores=(posicao,n,ovr)=>Array.from({length:n},()=>{
  const id=++indice;return {id,nome:'Jogador '+id,clubeNome:'Santos',posicao,
   ovr:ovr+(id%3),idade:21+(id%10),aposentado:false};
 });
 const e=[...jogadores('GOL',3,72),...jogadores('ZAG',3,74),
  ...jogadores('MC',7,80),...jogadores('ATA',5,79)];
 // Sem quarto defensor principal: o meia pode atuar na zaga se apto.
 e.find(j=>j.posicao==='MC').posicoesSecundarias=[{posicao:'ZAG',apto:true}];
 return e;
};

test('prévia escala 11 atletas reais com banco único e sem alterar o cadastro',()=>{
 const e=elenco(),antes=structuredClone(e);
 const p=preverEscalacaoTecnico(clube(),e);
 assert.equal(p.formacao,'4-4-2');
 assert.equal(p.titulares.length,11);
 assert.equal(p.titulares.filter(j=>j.id!==null).length,11);
 assert.equal(p.vagasAbertas,0);
 const todos=[...p.titulares,...p.banco].map(j=>j.id);
 assert.equal(new Set(todos).size,todos.length);
 assert.ok(p.titulares.some(j=>j.secundaria&&j.setor==='DEF'));
 assert.ok(p.titulares.every(j=>j.nome.startsWith('Jogador ')));
 assert.ok(p.banco.length>0&&p.banco.length<=7);
 assert.deepEqual(e,antes);
});

test('quarto defensor sem aptidão torna a vaga visivelmente aberta, sem jogador inventado',()=>{
 const e=elenco().map(j=>({...j,...(j.posicoesSecundarias?{posicoesSecundarias:['ZAG']}: {})}));
 const p=preverEscalacaoTecnico(clube(),e);
 assert.equal(p.titulares.length,11);
 assert.equal(p.vagasAbertas,1);
 assert.equal(p.titulares.filter(j=>j.id===null).length,1);
 assert.equal(new Set(p.titulares.filter(j=>j.id!==null).map(j=>j.id)).size,10);
 assert.ok(p.banco.every(j=>j.id!==null));
});

test('indisponíveis não aparecem em titulares ou reservas; IDs de legado duplicados são deduplicados',()=>{
 const e=elenco();
 e.find(j=>j.posicao==='GOL').suspenso=true;
 e.find(j=>j.posicao==='ATA').lesao={jogosRestantes:2};
 e.find(j=>j.posicao==='MC').indisponivel=true;
 const eClonado=structuredClone(e);
 const p=preverEscalacaoTecnico(clube(),[...e,e[0],e[1]]);
 const banidos=new Set(e.filter(j=>j.suspenso||j.indisponivel||j.lesao?.jogosRestantes>0).map(j=>String(j.id)));
 assert.equal(p.indisponiveis,3);
 const nomes=[...p.titulares,...p.banco].filter(j=>j.id!==null);
 assert.ok(nomes.every(j=>!banidos.has(j.id)));
 assert.equal(new Set(nomes.map(j=>j.id)).size,nomes.length);
 assert.deepEqual(e,eClonado);
});

test('recomputa as vagas por formação e mantém exatamente 11, sem bônus sobre OVR original',()=>{
 const e=elenco();
 for(const formacao of ['4-3-3','4-4-2','3-5-2']){
   const p=preverEscalacaoTecnico(clube(formacao),e);
   assert.equal(p.formacao,formacao);
   assert.equal(p.titulares.length,11);
   assert.ok(p.titulares.every(j=>j.id===null||e.some(a=>String(a.id)===j.id&&a.ovr===j.ovr)));
   assert.equal(p.titulares.filter(j=>j.setor==='GOL').length,1);
   assert.equal(p.titulares.filter(j=>j.setor==='DEF').length,Number(formacao[0]));
   assert.equal(p.titulares.filter(j=>j.setor==='ATA').length,Number(formacao.at(-1)));
 }
});

test('sem clube, sem elenco e seleções não fabricam prévias de jogadores',()=>{
 assert.equal(preverEscalacaoTecnico({},elenco()),null);
 assert.equal(preverEscalacaoTecnico({tecnico:{clube:'Santos'}},[]),null);
 assert.equal(preverEscalacaoTecnico({tecnico:{clube:'Brasil',tipoEquipe:'selecao'}},elenco()),null);
});
