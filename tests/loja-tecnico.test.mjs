import test from 'node:test';
import assert from 'node:assert/strict';
import {carteiraTecnico,creditarSalarioTecnico,bonusForcaLoja} from '../src/treinador/lojaTecnico.js';
import {iniciarCarreiraTecnico,comprarMelhoriaTecnico,calcularOvrTecnico,forcaClubeTecnico,escolherPretemporadaRapidaTecnico,gerarPropostasTecnico,proximaTemporadaTecnico,passarAnoDesempregado,simularEtapaTecnico} from '../src/treinador/tecnico.js';
import {cartaPretemporadaRapida,aplicarPretemporadaRapida} from '../src/treinador/pretemporadaRapida.js';
const base=()=>{
  const c=iniciarCarreiraTecnico({nome:'Teste',idade:40,ano:2030,aposentado:true,clubeNome:'Santos',temporadas:[],totais:{},legado:{pontos:600}});
  return {...c,ritmo:'intenso',tecnico:{...c.tecnico,clubeInicialEscolhido:true,elenco:70,salario:100,verbaRapida:3000,carteiraTecnico:{saldo:3000,pagamentos:[],compras:[]}}};
};
test('salário anual entra uma vez, não consome verba e desemprego não paga',()=>{
  const c=base(),carta=cartaPretemporadaRapida(c.tecnico),op=carta.opcoes.find(o=>o.custo<=carta.verba);
  const fim=escolherPretemporadaRapidaTecnico(c,carta.chave,op.id,()=>.4);
  assert.equal(fim.tecnico.propostasCoerentesVersao,2);
  assert.equal(carteiraTecnico(fim.tecnico).saldo,4200);
  assert.equal(carteiraTecnico(fim.tecnico).pagamentos[0].valor,1200);
  assert.equal(creditarSalarioTecnico({...fim.tecnico,clube:c.tecnico.clube},2030,100),fim.tecnico.carteiraTecnico);
  const avancado=proximaTemporadaTecnico({...fim,tecnico:{...fim.tecnico,demitido:false}});
  assert.equal(carteiraTecnico(avancado.tecnico).saldo,4200);
  const desempregado=passarAnoDesempregado({...fim,tecnico:{...fim.tecnico,demitido:true}},()=>.5);
  assert.equal(carteiraTecnico(desempregado.tecnico).saldo,4200);
  assert.equal(carteiraTecnico(c.tecnico).saldo,3000);
});
test('compras debitam uma vez, são salvas e bônus expira por ano e clube',()=>{
  const c=base(),novo=comprarMelhoriaTecnico(c,'preparacao');
  assert.equal(novo.tecnico.carteiraTecnico.saldo,2700);
  assert.equal(novo.tecnico.verbaRapida,3000);
  assert.equal(forcaClubeTecnico(novo.tecnico),73);
  assert.equal(novo.tecnico.elenco,70);
  assert.equal(comprarMelhoriaTecnico(novo,'preparacao'),novo);
  const salvo=JSON.parse(JSON.stringify(novo));assert.equal(bonusForcaLoja(salvo.tecnico),3);
  assert.equal(bonusForcaLoja({...salvo.tecnico,ano:2031}),0);
  assert.equal(bonusForcaLoja({...salvo.tecnico,clube:'Flamengo'}),0);
  assert.throws(()=>comprarMelhoriaTecnico({...c,tecnico:{...c.tecnico,fase:'resultado'}},'analise'),/antes/);
  assert.throws(()=>comprarMelhoriaTecnico({...c,tecnico:{...c.tecnico,carteiraTecnico:{saldo:0,compras:[],pagamentos:[]}}},'analise'),/insuficiente/);
});
test('cursos melhoram OVR de forma permanente, com limite e sem compra no máximo',()=>{
  let c=base();const inicial=calcularOvrTecnico(c.tecnico);
  for(let i=0;i<5;i++){c=comprarMelhoriaTecnico({...c,tecnico:{...c.tecnico,ano:2030+i}},'licenca');}
  assert.equal(calcularOvrTecnico(c.tecnico),inicial+5);
  assert.equal(c.tecnico.carteiraTecnico.saldo,0);
  assert.throws(()=>comprarMelhoriaTecnico({...c,tecnico:{...c.tecnico,ano:2040}},'licenca'),/Limite/);
  const maximo={...base(),tecnico:{...base().tecnico,reputacao:99,titulos:20,vitorias:500,empates:0,derrotas:0,temporadas:Array(12).fill({})}};
  assert.equal(calcularOvrTecnico(maximo.tecnico),99);
  assert.throws(()=>comprarMelhoriaTecnico(maximo,'licenca'),/máximo/);
});
test('save antigo com primeira decisão concluída não recebe uma segunda',()=>{
  const c=base();c.tecnico.planoRapido={ano:2030,clube:c.tecnico.clube,cartas:['craque-jovem','esquema'],respostas:[]};
  const carta=cartaPretemporadaRapida(c.tecnico);
  const parcial=aplicarPretemporadaRapida(c,carta.chave,'jovem');
  assert.equal(cartaPretemporadaRapida(parcial.tecnico),null);
  assert.equal(carteiraTecnico({...parcial.tecnico,carteiraTecnico:undefined}).saldo,0);
});
test('treinador experiente recebe ligas diferentes sem saltar para superclubes',()=>{
  const t={...base().tecnico,reputacao:85,elenco:70,temporadas:Array(5).fill({clube:'Santos',posicao:3,cumpriuObjetivo:true}),vitorias:100,empates:30,derrotas:30};
  const ofertas=gerarPropostasTecnico(t,()=>0);
  assert.equal(ofertas.length,3);assert.equal(new Set(ofertas.map(p=>p.liga)).size,3);
  assert.ok(ofertas.some(p=>p.pais!=='Brasil'));
  assert.ok(ofertas.every(p=>p.elenco<=84&&p.motivo));
  const crise=gerarPropostasTecnico({...t,reputacao:45,temporadas:[{clube:'Santos',posicao:18}]},()=>0);
  assert.ok(crise.every(p=>p.pais==='Brasil'&&p.elenco<=84));
});

test('demissão em campanha interrompida paga apenas os meses trabalhados',()=>{
 const c=base();c.tecnico={...c.tecnico,diretoria:0,torcida:0,decisoes:Array(4).fill({}),elenco:40};
 const fim=simularEtapaTecnico(c,()=>.99);
 assert.equal(fim.tecnico.demitido,true);
 const pagamento=carteiraTecnico(fim.tecnico).pagamentos[0];
 assert.ok(pagamento.meses>0&&pagamento.meses<12);
 assert.equal(pagamento.valor,100*pagamento.meses);
 assert.equal(carteiraTecnico(fim.tecnico).saldo,3000+pagamento.valor);
});
