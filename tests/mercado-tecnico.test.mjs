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

test('virada anual envelhece, encerra contratos e repõe setores sem mutação',()=>{
 const c=cenario();const g=criarGestaoTecnico(c.tecnico);const antes=structuredClone(g);
 const retido=g.elenco.find(j=>j.contrato>1);assert.ok(retido);
 const expirado=g.elenco.find(j=>j.contrato===1);assert.ok(expirado);
 const novo=criarGestaoTecnico({...c.tecnico,ano:2031,gestao:g});
 assert.deepEqual(g,antes);assert.equal(novo.ano,2031);
 assert.equal(novo.elenco.find(j=>j.id===retido.id).idade,retido.idade+1);
 assert.equal(novo.elenco.find(j=>j.id===retido.id).contrato,retido.contrato-1);
 assert.ok(!novo.elenco.some(j=>j.id===expirado.id));
 assert.deepEqual(resumoGestaoTecnico(novo).setores.map(s=>s.jogadores),[3,8,8,5]);
 assert.equal(new Set(novo.elenco.map(j=>j.id)).size,novo.elenco.length);
 assert.equal(novo.movimentos.filter(m=>m.tipo==='verba').length,1);
 assert.deepEqual(criarGestaoTecnico({...c.tecnico,ano:2031,gestao:novo}),novo);
});
test('orçamento é renovado uma única vez por ano e não antecipa a pré-temporada',()=>{
 const c=cenario();const g=criarGestaoTecnico(c.tecnico);
 assert.deepEqual(criarGestaoTecnico({...c.tecnico,fase:'resultado',ano:2031,gestao:g}),g);
 const avancado=criarGestaoTecnico({...c.tecnico,ano:2033,gestao:g});
 assert.equal(avancado.movimentos.filter(m=>m.tipo==='verba').length,3);
 assert.ok(avancado.saldo<=g.orcamentoInicial*2);
 assert.deepEqual(criarGestaoTecnico({...c.tecnico,ano:2033,gestao:JSON.parse(JSON.stringify(avancado))}),avancado);
});
test('comprar e vender bloqueia recompra da mesma oferta na janela',()=>{
 const c=cenario();const alvo=gerarMercadoTecnico(c.tecnico)[0];
 const comprado=contratarJogadorTecnico(c,alvo.id);const vendido=venderJogadorTecnico(comprado,alvo.id);
 assert.ok(!gerarMercadoTecnico(vendido.tecnico).some(j=>j.id===alvo.id));
 assert.throws(()=>contratarJogadorTecnico(vendido,alvo.id),/indisponível/);
 const proximo={...vendido.tecnico,ano:2031};assert.equal(gerarMercadoTecnico(proximo).length,12);
});

test('limite de aporte preserva saldo acumulado com vendas',()=>{
 const c=cenario();const g=criarGestaoTecnico(c.tecnico);g.saldo=g.orcamentoInicial*3;
 const novo=criarGestaoTecnico({...c.tecnico,ano:2031,gestao:g});
 assert.equal(novo.saldo,g.saldo);
 assert.equal(novo.movimentos.find(m=>m.tipo==='verba').valor,0);
});
