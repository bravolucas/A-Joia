import test from 'node:test';
import assert from 'node:assert/strict';
import {iniciarCarreiraTecnico,iniciarNoClubeIdolo,definirAcompanhamentoTecnico,jogarTemporadaExpressaTecnico,responderIntervencaoTecnico,definirEstiloTecnico} from '../tecnico.js';
const seed=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
function carreira(){
 let c=iniciarCarreiraTecnico({nome:'Teste',idade:40,ano:2040,clubeNome:'Santos',aposentado:true,legado:{pontos:600},temporadas:[{clube:'Santos',ano:2037},{clube:'Santos',ano:2038},{clube:'Santos',ano:2039}],totais:{gols:100}});
 return iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
}
test('pausa persiste progresso e manter plano preserva todos os resultados anteriores',()=>{
 const c=carreira(),antes=structuredClone(c),rng=seed(12);
 const completo=jogarTemporadaExpressaTecnico(c,null,seed(12));
 const pausado=jogarTemporadaExpressaTecnico(definirAcompanhamentoTecnico(c,true),null,rng);
 assert.deepEqual(c,antes);assert.equal(pausado.tecnico.fase,'intervencao');
 assert.equal(pausado.tecnico.temporadas.length,0);assert.equal(pausado.idade,c.idade);assert.equal(pausado.tecnico.ano,c.tecnico.ano);
 const p=pausado.tecnico.intervencaoPendente,snapshot=pausado.tecnico.temporadaPausada;
 assert.ok(snapshot.confrontos.length>0);assert.equal(snapshot.confrontos.length,snapshot.indice);
 assert.equal(snapshot.confrontos.filter(j=>!j.folga).length,p.jogos);
 assert.equal(snapshot.calendario[snapshot.indice].nome,p.adversario.nome);
 const recarregado=JSON.parse(JSON.stringify(pausado)),copia=structuredClone(recarregado);
 const fim=responderIntervencaoTecnico(recarregado,p.chave,'manter',rng);
 assert.deepEqual(recarregado,copia);
 assert.equal(fim.tecnico.fase,'resultado');assert.equal(fim.tecnico.temporadas.length,1);assert.equal(fim.idade,c.idade+1);
 const temporada=fim.tecnico.temporadas[0];
 assert.deepEqual(temporada.confrontos.slice(0,snapshot.indice),snapshot.confrontos);
 assert.equal(temporada.confrontos.filter(j=>j.intervencao).length,1);
 const semIntervencao=JSON.parse(JSON.stringify(temporada),(k,v)=>k==='intervencao'?undefined:v);
 assert.deepEqual(semIntervencao,completo.tecnico.temporadas[0]);
 assert.equal(fim.tecnico.temporadaPausada,null);assert.equal(fim.tecnico.intervencaoPendente,null);
 assert.equal(responderIntervencaoTecnico(fim,p.chave,'atacar'),fim);
 assert.throws(()=>definirEstiloTecnico(pausado,'ofensivo'),/antes do início/);
});
test('intervenção muda apenas o plano do confronto escolhido e rejeita escolhas inválidas',()=>{
 const c=definirAcompanhamentoTecnico(carreira(),true);
 const pausado=jogarTemporadaExpressaTecnico(c,null,seed(17)),p=pausado.tecnico.intervencaoPendente;
 assert.equal(responderIntervencaoTecnico(pausado,'chave-antiga','atacar'),pausado);
 assert.throws(()=>responderIntervencaoTecnico(pausado,p.chave,'invalida'),/inválida/);
 for(const [op,estilo] of [['atacar','ofensivo'],['proteger','defensivo']]){
  const fim=responderIntervencaoTecnico(pausado,p.chave,op,seed(40));
  const jogos=fim.tecnico.temporadas[0].confrontos.filter(j=>!j.folga);
  assert.equal(jogos.find(j=>j.intervencao===op).estilo,estilo);
  assert.ok(jogos.filter(j=>!j.intervencao).every(j=>j.estilo==='equilibrado'));
  assert.equal(fim.tecnico.estilo,'equilibrado');
  assert.equal(new Set(fim.tecnico.temporadas[0].confrontos.map(j=>j.rodada)).size,fim.tecnico.temporadas[0].confrontos.length);
 }
});
