import test from 'node:test';import assert from 'node:assert/strict';
import {simularAnoSelecaoTecnico} from '../src/treinador/selecoesTecnico.js';
import {chaveCopaTecnico} from '../src/treinador/copasCarreiraTecnico.js';
import {decisaoCopa} from '../src/treinador/copasEscolha.js';
import {resolverCopaEscolhaTecnico} from '../src/treinador/tecnico.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
const base={nome:'Teste',idade:45,ano:2030,tecnico:{ano:2030,clube:'Brasil',selecao:'BRA',tipoEquipe:'selecao',liga:'selecao:CONMEBOL',elenco:90,reputacao:85,diretoria:60,torcida:55,titulos:0,vitorias:0,empates:0,derrotas:0,temporadas:[],decisoes:[],classificacaoSelecao:{nac:'BRA',copa:2030,classificado:true}}};
test('Mundial é jogável desde a primeira partida, guarda 3 jogos de grupo e retoma sem repetir',()=>{
 const r=simularAnoSelecaoTecnico(base.tecnico,85,95,geradorTecnico('copa'),{interativo:true,copasInterativas:true});let c={...structuredClone(base),tecnico:{...base.tecnico,...r}},cp=c.tecnico.copasEmJogo.campeonatos[0];assert.equal(cp.nome,'Copa do Mundo');assert.equal(cp.totalRodadas,3);assert.equal(cp.pool.length,32);assert.equal(cp.jogosUsuario.length,0);assert.equal(cp.campeao,null);assert.deepEqual(r.finaisPendentes,[]);assert.equal(c.tecnico.titulos,0);assert.equal(r.diretoria,60);assert.equal(r.temporadas.at(-1).cumpriuObjetivo,false);
 const chave=chaveCopaTecnico(c.tecnico),primeiro=resolverCopaEscolhaTecnico(c,chave,'controlar');assert.equal(primeiro.tecnico.copasEmJogo.campeonatos[0].jogosUsuario.length,1);assert.deepEqual(resolverCopaEscolhaTecnico(JSON.parse(JSON.stringify(primeiro)),chave,'controlar'),JSON.parse(JSON.stringify(primeiro)));
 c=primeiro;for(let i=0;c.tecnico.copasEmJogo&&i<80;i++){const p=c.tecnico.copasEmJogo,cp=p.campeonatos[p.indice],d=decisaoCopa(cp);c=resolverCopaEscolhaTecnico(JSON.parse(JSON.stringify(c)),chaveCopaTecnico(c.tecnico),p.pausa?'continuar':d?(d.penaltis?'canto':'controlar'):'continuar');}
 assert.equal(c.tecnico.copasEmJogo,null);assert.equal(c.tecnico.temporadas.at(-1).avaliacaoSelecaoPendente,false);const a=c.tecnico.temporadas.at(-1),copa=a.torneios.find(x=>x.tipo==='copaMundo');assert.ok(copa.jogosUsuario.length>=3);assert.equal(a.jogos,copa.jogosUsuario.length);assert.equal(a.vitorias+a.empates+a.derrotas,a.jogos);assert.equal(c.tecnico.vitorias,a.vitorias);assert.equal(copa.selecao,'Brasil');assert.ok(c.tecnico.titulos<=1);
});
test('seleção sem vaga não recebe uma Copa fictícia',()=>{const t={...base.tecnico,classificacaoSelecao:{nac:'BRA',copa:2030,classificado:false}};const r=simularAnoSelecaoTecnico(t,85,95,geradorTecnico('fora'),{copasInterativas:true});assert.equal(r.copasEmJogo,null);assert.ok(!r.temporadas.at(-1).torneios.some(x=>x.tipo==='copaMundo'));});
