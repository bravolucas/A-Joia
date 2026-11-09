import test from 'node:test';
import assert from 'node:assert/strict';
import {criarGestaoTecnico,resumoGestaoTecnico,gerarMercadoTecnico,contratarJogadorTecnico,venderJogadorTecnico} from '../src/treinador/mercadoTecnico.js';
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
 for(const patch of [{fase:'resultado'},{desempregado:true},{andamento:{rodadas:1}},{idade:85}]){
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

test('integração preserva força numérica, confirma transações e retorna erros seguros',async()=>{
 const {prepararGestaoTecnico,negociarElencoTecnico}=await import('../src/treinador/mercadoTecnico.js');
 const c=prepararGestaoTecnico(cenario()),antes=structuredClone(c);
 const alvo=gerarMercadoTecnico(c.tecnico)[0];
 const novo=negociarElencoTecnico(c,'compra',alvo.id);
 assert.equal(typeof novo.tecnico.elenco,'number');assert.equal(novo.tecnico.avisoGestao.erro,false);
 assert.deepEqual(c,antes);
 assert.deepEqual(gerarMercadoTecnico(novo.tecnico),gerarMercadoTecnico(c.tecnico).filter(j=>j.id!==alvo.id));
 const falha=negociarElencoTecnico(novo,'compra',alvo.id);
 assert.equal(falha.tecnico.avisoGestao.erro,true);assert.deepEqual(falha.tecnico.gestao,novo.tecnico.gestao);
 assert.deepEqual(prepararGestaoTecnico(c),c);
});

test('renovação cobra luvas, ajusta folha e preserva atleta na virada anual',async()=>{
 const {renovarJogadorTecnico,propostaRenovacaoTecnico,prepararGestaoTecnico}=await import('../src/treinador/mercadoTecnico.js');
 const c=prepararGestaoTecnico(cenario()),antes=structuredClone(c);
 const alvo=c.tecnico.gestao.elenco.find(j=>j.contrato===1),p=propostaRenovacaoTecnico(alvo);
 const novo=renovarJogadorTecnico(c,alvo.id),g=novo.tecnico.gestao;
 assert.deepEqual(c,antes);
 assert.equal(g.saldo,c.tecnico.gestao.saldo-p.luvas);
 assert.equal(g.elenco.find(j=>j.id===alvo.id).contrato,3);
 assert.equal(resumoGestaoTecnico(g).folha,resumoGestaoTecnico(c.tecnico.gestao).folha-alvo.salario+p.salario);
 const reload=prepararGestaoTecnico(JSON.parse(JSON.stringify(novo)));
 assert.deepEqual(reload,novo);
 const anual=prepararGestaoTecnico({...reload,tecnico:{...reload.tecnico,ano:2031}});
 assert.equal(anual.tecnico.gestao.elenco.find(j=>j.id===alvo.id).contrato,2);
 assert.equal(anual.tecnico.gestao.elenco.find(j=>j.id===alvo.id).salario,p.salario);
 assert.equal(anual.tecnico.gestao.movimentos.filter(m=>m.tipo==='renovacao').length,1);
});
test('renovação recusa prazo longo, repetição, falta de verba, teto e janela fechada',async()=>{
 const {renovarJogadorTecnico,prepararGestaoTecnico}=await import('../src/treinador/mercadoTecnico.js');
 const c=prepararGestaoTecnico(cenario()),g=c.tecnico.gestao;
 const alvo=g.elenco.find(j=>j.contrato===1);
 assert.throws(()=>renovarJogadorTecnico(c,g.elenco.find(j=>j.contrato>=3).id),/últimos dois/);
 assert.throws(()=>renovarJogadorTecnico(c,'inexistente'),/não encontrado/);
 for(const [patch,erro] of [[{saldo:0},/Orçamento/],[{tetoSalarial:resumoGestaoTecnico(g).folha},/teto salarial/],[{movimentos:[{tipo:'renovacao',ano:g.ano,jogador:alvo.id}]},/já foi renovado/]]){
  assert.throws(()=>renovarJogadorTecnico({...c,tecnico:{...c.tecnico,gestao:{...g,...patch}}},alvo.id),erro);
 }
 assert.throws(()=>renovarJogadorTecnico({...c,tecnico:{...c.tecnico,fase:'resultado'}},alvo.id),/antes do início/);
 assert.throws(()=>renovarJogadorTecnico({...c,tecnico:{...c.tecnico,desempregado:true}},alvo.id),/empregado/);
});

test('virada reflete a evolução do elenco na força uma única vez, sem afetar ofertas',async()=>{
 const {prepararGestaoTecnico}=await import('../src/treinador/mercadoTecnico.js');
 const c=prepararGestaoTecnico(cenario()),g=c.tecnico.gestao;
 const media=g=>g.elenco.reduce((n,j)=>n+j.qualidade,0)/g.elenco.length;
 const alvo={...c,tecnico:{...c.tecnico,ano:2031}};
 const novo=prepararGestaoTecnico(alvo);
 assert.ok(Math.abs(novo.tecnico.elenco-(c.tecnico.elenco+media(novo.tecnico.gestao)-media(g)))<1e-10);
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(novo))),novo);
 assert.deepEqual(gerarMercadoTecnico(novo.tecnico),gerarMercadoTecnico(alvo.tecnico));
 assert.equal(c.tecnico.gestao.ano,2030);
});

test('reposição de 30 anos mantém o nível estrutural do clube sem créditos ou efeitos repetidos',async()=>{
 const {prepararGestaoTecnico,negociarElencoTecnico}=await import('../src/treinador/mercadoTecnico.js');
 for(const comissao of [false,true]){
  let c=prepararGestaoTecnico(cenario());const inicial=c.tecnico.elenco;
  for(let ano=1;ano<=30;ano++){
   if(comissao)for(const cargo of ['auxiliar','preparador','olheiro'])c=negociarElencoTecnico(c,'comissao',cargo);
   const antes=structuredClone(c);
   const proximo=prepararGestaoTecnico({...c,tecnico:{...c.tecnico,ano:c.tecnico.ano+1}});
   assert.deepEqual(c,antes);c=proximo;
   const g=c.tecnico.gestao,r=resumoGestaoTecnico(g);
   assert.equal(g.elenco.length,24);assert.equal(new Set(g.elenco.map(j=>j.id)).size,24);
   assert.ok(g.saldo>=0);assert.ok(r.folha<=g.tetoSalarial);
   assert.ok(g.elenco.every(j=>j.qualidade<=j.potencial));
   assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(c))),c);
  }
  assert.ok(c.tecnico.elenco>=inicial-10,'a base não deve colapsar por repor atletas com sua própria média decrescente');
  assert.ok(c.tecnico.elenco<=inicial+5,'a comissão não deve gerar crescimento ilimitado sem reforços');
 }
});
