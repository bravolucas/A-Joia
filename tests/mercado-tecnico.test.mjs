import test from 'node:test';
import assert from 'node:assert/strict';
import {criarGestaoTecnico,resumoGestaoTecnico,gerarMercadoTecnico,contratarJogadorTecnico,venderJogadorTecnico} from '../mercadoTecnico.js';
const cenario=()=>({nome:'Teste',tecnico:{clube:'Santos',elenco:65,ano:2030,fase:'pretemporada',temporadas:[]}});
test('geração determinística, setores e compatibilidade com save antigo',()=>{
 const c=cenario(),antes=structuredClone(c),a=criarGestaoTecnico(c.tecnico);
 assert.deepEqual(a,criarGestaoTecnico(c.tecnico));assert.deepEqual(c,antes);assert.equal(a.elenco.length,24);
 assert.deepEqual(resumoGestaoTecnico(a).setores.map(s=>s.jogadores),[3,8,8,5]);
 assert.equal(new Set(a.elenco.map(j=>j.id)).size,24);
 assert.deepEqual(a,criarGestaoTecnico({...c.tecnico,gestao:JSON.parse(JSON.stringify(a))}));
});
test('compra debita valor, respeita salário e não modifica a entrada',()=>{
 const c=cenario(),antes=structuredClone(c);const alvo=gerarMercadoTecnico(c.tecnico)[0];const novo=contratarJogadorTecnico(c,alvo.id);
 assert.deepEqual(c,antes);assert.equal(novo.tecnico.gestao.elenco.length,25);
 assert.equal(novo.tecnico.gestao.saldo,criarGestaoTecnico(c.tecnico).saldo-alvo.valor);
 assert.throws(()=>contratarJogadorTecnico(novo,alvo.id),/já está/);
 const pobre=cenario();pobre.tecnico.gestao={...criarGestaoTecnico(pobre.tecnico),saldo:0};assert.throws(()=>contratarJogadorTecnico(pobre,alvo.id),/Orçamento/);
 const teto=cenario();teto.tecnico.gestao={...criarGestaoTecnico(teto.tecnico),tetoSalarial:0};assert.throws(()=>contratarJogadorTecnico(teto,alvo.id),/teto salarial/);
});
test('venda libera folha, credita saldo e preserva mínimo de goleiros',()=>{
 const c=cenario();const g=criarGestaoTecnico(c.tecnico);const alvo=g.elenco.find(j=>j.setor==='GOL');
 const novo=venderJogadorTecnico(c,alvo.id);
 assert.equal(novo.tecnico.gestao.saldo,g.saldo+Math.round(alvo.valor*.8));
 assert.equal(resumoGestaoTecnico(novo.tecnico.gestao).folha,resumoGestaoTecnico(g).folha-alvo.salario);
 assert.throws(()=>venderJogadorTecnico(novo,novo.tecnico.gestao.elenco.find(j=>j.setor==='GOL').id),/setor/);
 assert.throws(()=>venderJogadorTecnico(novo,alvo.id),/não encontrado/);
});
test('troca de clube recria gestão; janela fecha durante jogos e desemprego',()=>{
 const c=cenario();const g=criarGestaoTecnico(c.tecnico);
 const outro=criarGestaoTecnico({...c.tecnico,clube:'Flamengo',gestao:g});assert.equal(outro.clube,'Flamengo');assert.notDeepEqual(outro.elenco,g.elenco);
 for(const patch of [{fase:'resultado'},{desempregado:true},{andamento:{rodadas:1}},{temporadas:Array(30).fill({})}]){
  const st={...c,tecnico:{...c.tecnico,...patch}};assert.throws(()=>contratarJogadorTecnico(st,gerarMercadoTecnico(c.tecnico)[0].id));
 }
});
