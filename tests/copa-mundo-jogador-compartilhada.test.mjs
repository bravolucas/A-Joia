import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';
import {iniciarCopaCompartilhada,escolherCopaCompartilhada,chaveCopaCompartilhada} from '../src/jogador/copaSelecaoCompartilhada.js';
import {decisaoCopa} from '../src/treinador/copasEscolha.js';

const origem=()=>{
 const c=criarJogador({nome:'Copa Persistente',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'COPA-48-2030'});
 c.ano=2030;c.idade=24;
 return {c,card:{ano:2030,jogos:35,gols:11,assist:6,share:.8,clube:'Flamengo',posicao:'ATA',
  selecao:{convocado:true,resultado:'Convocado',gols:0,assist:0},titulos:[],destaques:[],
  copa:{ano:2030,nome:'Copa do Mundo',tipo:'copaMundo',nac:'BRA',label:'Brasil',fs:83,ovr:89,
   corte:77,titular:true,convocado:true,etapa:'grupos',fase:0,elenco:{jogadores:[]},
   efeitos:{moral:0,fama:0,fria:0},jogos:[],gols:0,assist:0,fim:false}}};
};
test('Copa do Mundo do jogador reutiliza a mesma campanha de 48 seleções e 12 grupos',()=>{
 const {c,card}=origem(),novo=iniciarCopaCompartilhada(c,card),cp=novo.copaCompartilhada;
 assert.ok(cp,'campanha compartilhada não criada');
 assert.equal(cp.formato,'copa48');
 assert.equal(cp.participantes,48);
 assert.equal(cp.gruposSorteados.length,12);
 assert.equal(cp.gruposSorteados.filter(g=>g.times.includes('Brasil')).length,1);
 assert.ok(cp.sorteios.some(s=>s.tipo==='grupos'));
 assert.deepEqual(iniciarCopaCompartilhada(c,novo),novo,'não ressortear campanha em andamento');
});
test('estratégias, pênaltis, salvamento e resumo não duplicam títulos',()=>{
 const {c,card}=origem();let estado=iniciarCopaCompartilhada(c,card);
 for(let i=0;i<90&&!estado.copa.fim;i++){
  const cp=estado.copaCompartilhada,d=decisaoCopa(cp),chave=chaveCopaCompartilhada(estado);
  const op=cp.resultado?'continuar':d?.penaltis?'canto':d?'controlar':null;
  assert.ok(op,'etapa sem decisão: '+cp.fase);
  const prox=escolherCopaCompartilhada(estado,chave,op);
  assert.notEqual(prox,estado,'campanha não avançou');
  estado=prox;
 }
 assert.equal(estado.copa.fim,true,'Copa não terminou em 90 etapas');
 assert.ok(estado.torneios.some(t=>t.nome==='Copa do Mundo'));
 assert.ok(estado.copa.jogos.length>=3);
 assert.equal(estado.selecao.jogos,estado.copa.jogos.length);
 assert.equal(estado.selecao.gols,estado.copaEstatisticas?.gols||0);
 const repetido=escolherCopaCompartilhada(estado,chaveCopaCompartilhada(estado),'continuar');
 assert.equal(repetido,estado,'campanha concluída não deve ser atualizada novamente');
 assert.ok(estado.titulos.filter(t=>t.nome==='Copa do Mundo').length<=1);
});

test('carreira automatica nao cria uma segunda Copa interativa',()=>{
 const {c}=origem();const r=jogarTemporada(c);
 assert.equal(r.card.copaCompartilhada,undefined,'modo automatico deve conservar o fluxo anterior');
 assert.ok(r.card.copa,'a Copa legacy continua gerada');
});
test('convocacao e saves legados nao ressorteiam partidas existentes',()=>{
 const {c,card}=origem();
 const pendente={...card,copa:{...card.copa,convocado:false,etapa:'convocacao'}};
 assert.equal(iniciarCopaCompartilhada(c,pendente),pendente);
 const legado={...card,copa:{...card.copa,jogos:[{fase:0,adv:{label:'Alemanha'},gp:1,gc:0}]}};
 assert.equal(iniciarCopaCompartilhada(c,legado),legado);
 const sorteada=iniciarCopaCompartilhada(c,card);
 assert.equal(iniciarCopaCompartilhada(c,sorteada),sorteada);
});

test('Copas consecutivas de 2026, 2030 e 2034 preservam edição e sorteio distintos',()=>{
 const {c,card}=origem(),assinaturas=new Set();
 for(const ano of [2026,2030,2034]){
  const atleta={...c,ano},temporada={...card,ano,copa:{...card.copa,ano}};
  const campanha=iniciarCopaCompartilhada(atleta,temporada).copaCompartilhada;
  assert.equal(campanha.ano,ano);
  assert.equal(campanha.participantes,48);
  assert.equal(campanha.gruposSorteados.length,12);
  assinaturas.add(campanha.seed);
 }
 assert.equal(assinaturas.size,3);
});
