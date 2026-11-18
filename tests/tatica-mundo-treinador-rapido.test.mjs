import test from 'node:test';
import assert from 'node:assert/strict';
import {elencoTaticoRapidoDoMundo} from '../src/treinador/elencoRapidoMundo.js';
import {perfilTaticoTecnico} from '../src/treinador/taticasTecnico.js';
import {alocarSetoresTecnico,qualidadeTaticaApta} from '../src/treinador/alocacaoSetoresTecnico.js';
import {probabilidadesConfrontoTecnico,simularEtapaTecnico,QUANTIDADE_DECISOES_TECNICO} from '../src/treinador/tecnico.js';

const jogadoresClube=()=>{
 const grupo=(posicao,n,ovr)=>Array.from({length:n},(_,i)=>({
   id:posicao+i,clubeNome:'Santos',aposentado:false,posicao,ovr,idade:24,nac:'BRA',
 }));
 const titulares=[...grupo('GOL',1,75),...grupo('ZAG',3,70),
   ...grupo('MC',5,58),...grupo('ATA',3,91)];
 titulares.find(j=>j.id==='MC0').posicoesSecundarias=[{posicao:'ZAG',apto:true}];
 const mundo={jogadores:[
   ...titulares,
   {...titulares[0],id:'GOL0'}, // duplicata do cadastro, não vira outro jogador
   {...titulares[1],id:'aposentado',aposentado:true},
   {...titulares[2],id:'rival',clubeNome:'Palmeiras'},
 ]};
 return mundo;
};
const tecnico=(formacao='4-4-2')=>({
 clube:'Santos',liga:'brasileirao',modoTreinadorRapido:true,
 formacao,estilo:'equilibrado',elenco:65,moral:55,diretoria:60,
 torcida:55,reputacao:45,fase:'pretemporada',ano:2030,
 temporadas:[],vitorias:0,empates:0,derrotas:0,titulos:0,
 decisoes:Array.from({length:QUANTIDADE_DECISOES_TECNICO},(_,i)=>({id:i})),
});
test('elenco tático do mundo é somente leitura e preserva atletas reais únicos do clube',()=>{
 const mundo=jogadoresClube(),antes=structuredClone(mundo);
 const elenco=elencoTaticoRapidoDoMundo(mundo,'Santos');
 assert.equal(elenco.length,12);
 assert.equal(new Set(elenco.map(j=>j.id)).size,12);
 assert.ok(elenco.every(j=>j.id!=='aposentado'&&j.id!=='rival'));
 assert.ok(elenco.some(j=>j.posicoesSecundarias?.[0]?.apto));
 assert.ok(elenco.every(j=>!Object.hasOwn(j,'carreira')));
 assert.deepEqual(mundo,antes);
 assert.deepEqual(elencoTaticoRapidoDoMundo(null,'Santos'),[]);
 assert.deepEqual(elencoTaticoRapidoDoMundo(mundo,null),[]);
});

test('secundária apta cobre a quarta vaga DEF, mas suspensos não atuam e não duplicam',()=>{
 const mundo=jogadoresClube(),elenco=elencoTaticoRapidoDoMundo(mundo,'Santos');
 const vagas={GOL:1,DEF:4,MEI:4,ATA:2};
 let titulares=alocarSetoresTecnico(elenco,vagas);
 assert.equal(titulares.filter(Boolean).length,11);
 assert.equal(new Set(titulares.map(j=>j.jogador.id)).size,11);
 assert.equal(titulares.filter(j=>j?.setor==='DEF'&&j.secundaria).length,1);
 const flex=mundo.jogadores.find(j=>j.id==='MC0');
 flex.suspenso=true;
 titulares=alocarSetoresTecnico(elencoTaticoRapidoDoMundo(mundo,'Santos'),vagas);
 assert.ok(titulares.some(j=>j===null));
 assert.ok(!titulares.filter(Boolean).some(j=>j.jogador.id==='MC0'));
 flex.suspenso=false;flex.lesao={jogosRestantes:2};
 assert.ok(alocarSetoresTecnico(elencoTaticoRapidoDoMundo(mundo,'Santos'),vagas).some(j=>j===null));
});

test('Modo Treinador Rápido usa dados do clube somente quando fornecidos, nunca escreve no save',()=>{
 const mundo=jogadoresClube(),antes=structuredClone(mundo);
 const t=tecnico('4-3-3'),original=structuredClone(t),adversario={forca:65,casa:true};
 const elenco=elencoTaticoRapidoDoMundo(mundo,t.clube);
 const neutro=perfilTaticoTecnico(t);
 const comElenco=perfilTaticoTecnico(t,elenco);
 assert.equal(neutro.ajuste,0);
 assert.notEqual(comElenco.ajuste,0);
 const pAntes=probabilidadesConfrontoTecnico(t,adversario);
 const pDepois=probabilidadesConfrontoTecnico(t,adversario,elenco);
 assert.notEqual(pAntes.vitoria,pDepois.vitoria);
 assert.ok(Math.abs(Object.values(pDepois).reduce((a,b)=>a+b,0)-1)<1e-10);
 assert.deepEqual(mundo,antes);
 assert.deepEqual(t,original);
 assert.ok(!Object.hasOwn(t,'elencoMundoRapido'));
});

test('sem mundo, o cálculo de probabilidade permanece idêntico ao legado',()=>{
 const t=tecnico('3-5-2'),adv={forca:70,casa:false};
 assert.deepEqual(probabilidadesConfrontoTecnico(t,adv),
   probabilidadesConfrontoTecnico(t,adv,elencoTaticoRapidoDoMundo(null,'Santos')));
});

test('partidas do modo rápido não persistem cópia dos atletas mundiais no treinador',()=>{
 const mundo=jogadoresClube(),antes=structuredClone(mundo);
 const t=tecnico();
 const c={nome:'Teste',codigo:'COACH-READONLY',idade:40,ano:2030,aposentado:true,mundo,tecnico:t};
 const original=structuredClone(c);
 const proximo=simularEtapaTecnico(c,()=>0.41);
 assert.ok(proximo.tecnico.andamento?.jogos>0||proximo.tecnico.fase==='resultado');
 assert.ok(!Object.hasOwn(proximo.tecnico,'elencoMundoRapido'));
 assert.ok(!Object.hasOwn(proximo.tecnico,'elencoTatico'));
 assert.deepEqual(c,original);
 assert.deepEqual(mundo,antes);
 assert.ok(proximo.mundo?.jogadores?.length>=mundo.jogadores.length);
});
