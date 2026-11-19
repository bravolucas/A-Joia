import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {completarCarenciasMundo,gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {diagnosticarElenco,TOTAL_MINIMO_ELENCO} from '../src/simulacao/profundidadeElenco.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {prepararGestaoTecnico,venderJogadorTecnico} from '../src/treinador/mercadoTecnico.js';

const carreira={jogos:0,gols:0,assist:0,temporadas:0};
function inicial(){
 return {nome:'Treinador',ano:2030,mundo:gerarMundoJogadores(geradorTecnico('mercado-lotado')),
  tecnico:{clube:'Avaí',liga:'brasileirao',elenco:65,ano:2030,
   fase:'pretemporada',temporadas:[],reputacao:50,moral:50,diretoria:60,torcida:50}};
}

test('o treinador não promove jovens apenas para lotar 24 vagas quando o elenco já tem cobertura',()=>{
 const c=inicial();
 const antes=c.mundo.jogadores.filter(p=>p.clubeNome==='Avaí'&&!p.aposentado);
 assert.equal(diagnosticarElenco(antes,{contarSecundarias:true}).totalFaltante,0);
 const preparado=prepararGestaoTecnico(c);
 const depois=preparado.mundo.jogadores.filter(p=>p.clubeNome==='Avaí'&&!p.aposentado);
 assert.equal(depois.length,antes.length);
 assert.ok(depois.length>=TOTAL_MINIMO_ELENCO);
 assert.deepEqual(prepararGestaoTecnico(preparado),preparado);
});

test('venda para clube lotado libera só excedente, preserva atletas e não estoura 30',()=>{
 const c=prepararGestaoTecnico(inicial()),original=structuredClone(c);
 const comprador=CLUBES.find(cl=>cl.nome==='Santos');
 assert.ok(comprador);
 const elencoTeste=completarCarenciasMundo([],[comprador],geradorTecnico('comprador-lotado'))
  .map((p,i)=>({...p,id:'comprador:'+i,idade:23,ovr:35,contrato:3}));
 assert.equal(elencoTeste.length,TOTAL_MINIMO_ELENCO);
 const extras=Array.from({length:8},(_,i)=>({
  ...elencoTeste.find(p=>p.posicao==='ATA'),
  id:'reserva-excedente:'+i,ovr:20,idade:23,contrato:3,carreira:{...carreira},
 }));
 c.mundo={...c.mundo,
  jogadores:[...c.mundo.jogadores.filter(p=>p.clubeNome!==comprador.nome),...elencoTeste,...extras],
  gestoesClubes:{...c.mundo.gestoesClubes,[comprador.nome]:{saldo:1000000}},
 };
 c.tecnico={...c.tecnico,universo:{clubes:Object.fromEntries(CLUBES.map(cl=>[
  cl.nome,{financas:cl.nome===comprador.nome?80:0},
 ]))}};
 const origem=structuredClone(c);
 const alvo=c.tecnico.gestao.elenco.find(j=>j.setor==='DEF');
 const novo=venderJogadorTecnico(c,alvo.id);
 assert.deepEqual(c,origem,'a venda não deve alterar o save de entrada');
 const apos=novo.mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===comprador.nome);
 assert.equal(apos.length,30);
 assert.equal(apos.filter(p=>String(p.id)===String(alvo.mundoId)).length,1);
 const dispensado=novo.mundo.jogadores.find(p=>p.clubeNome===null&&String(p.id).startsWith('reserva-excedente:'));
 assert.ok(dispensado,'o excedente vira agente livre');
 assert.equal(dispensado.contrato,0);
 assert.equal(dispensado.movimentos.at(-1).tipo,'dispensa');
 assert.ok(dispensado.carreira);
 assert.equal(diagnosticarElenco(apos,{contarSecundarias:true}).totalFaltante,0);
 assert.equal(novo.tecnico.gestao.saldo,origem.tecnico.gestao.saldo+Math.round(alvo.valor*.8));
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(novo))),novo);
 assert.deepEqual(original.tecnico.gestao.elenco,origem.tecnico.gestao.elenco);
});

test('aposentadoria não gera substituto quando clube já possui excedentes',()=>{
 const clube={nome:'Clube de Teste',liga:'brasileirao',forca:65};
 const base=completarCarenciasMundo([],[clube],geradorTecnico('plantel-completo'));
 assert.equal(base.length,TOTAL_MINIMO_ELENCO);
 const atacante=base.find(p=>p.posicao==='ATA');
 const reservas=Array.from({length:8},(_,i)=>({
  ...atacante,id:'extra:'+i,idade:i===0?40:22,
  ovr:50,potencial:70,picoIdade:27,carreira:{...carreira},contrato:3,
 }));
 const mundo={jogadores:[...base,...reservas],cadastroElencos:1,temporada:0};
 const ids=new Set(mundo.jogadores.map(j=>String(j.id))),antes=structuredClone(mundo);
 const proximo=simularTemporadaMundo(mundo,()=>.99,{
  clubes:[clube],clubeControlado:clube.nome,ano:2030,registrarPremio:false,
 });
 assert.deepEqual(mundo,antes);
 assert.equal(proximo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===clube.nome).length,29);
 assert.equal(proximo.jogadores.filter(p=>!ids.has(String(p.id))).length,0);
 assert.equal(diagnosticarElenco(proximo.jogadores,{clubeNome:clube.nome,contarSecundarias:true}).totalFaltante,0);
});

test('se aposentadoria causa déficit real, surge apenas o necessário e com ID novo',()=>{
 const clube={nome:'Clube de Teste',liga:'brasileirao',forca:65};
 const base=completarCarenciasMundo([],[clube],geradorTecnico('elenco-justo'));
 const goleiro=base.find(p=>p.posicao==='GOL');
 const velho=base.map(p=>p.id===goleiro.id?{...p,idade:40,contrato:3}:p);
 const ids=new Set(base.map(p=>String(p.id)));
 const proximo=simularTemporadaMundo({jogadores:velho,cadastroElencos:1,temporada:0},
  ()=>.99,{clubes:[clube],clubeControlado:clube.nome,registrarPremio:false});
 assert.equal(proximo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===clube.nome).length,TOTAL_MINIMO_ELENCO);
 assert.equal(proximo.jogadores.filter(p=>!ids.has(String(p.id))).length,1);
 assert.equal(diagnosticarElenco(proximo.jogadores,{clubeNome:clube.nome,contarSecundarias:true}).totalFaltante,0);
});


test('três vendas consecutivas na mesma janela seguem possíveis com comprador lotado',()=>{
 let c=prepararGestaoTecnico(inicial());
 const comprador=CLUBES.find(cl=>cl.nome==='Santos');
 const titulares=completarCarenciasMundo([],[comprador],geradorTecnico('comprador-tres-vendas'))
  .map((p,i)=>({...p,id:'comprador-multi:'+i,idade:24,ovr:40,contrato:3}));
 const extra=Array.from({length:8},(_,i)=>({
  ...titulares.find(p=>p.posicao==='ATA'),
  id:'reserva-multi:'+i,idade:21,ovr:30,contrato:3,carreira:{...carreira},
 }));
 c={...c,mundo:{...c.mundo,
  jogadores:[...c.mundo.jogadores.filter(p=>p.clubeNome!==comprador.nome),...titulares,...extra],
  gestoesClubes:{...c.mundo.gestoesClubes,[comprador.nome]:{saldo:1000000}}},
  tecnico:{...c.tecnico,universo:{clubes:Object.fromEntries(CLUBES.map(cl=>[
   cl.nome,{financas:cl.nome===comprador.nome?80:0}
  ]))}}
 };
 const atletas=c.tecnico.gestao.elenco.filter(j=>j.setor==='DEF').slice(0,3);
 assert.equal(atletas.length,3);
 const idsIniciais=c.mundo.jogadores.map(p=>String(p.id));
 assert.equal(new Set(idsIniciais).size,idsIniciais.length);
 const saldoInicial=c.tecnico.gestao.saldo;
 const valorTotal=atletas.reduce((s,j)=>s+Math.round(j.valor*.8),0);
 for(const [indice,alvo] of atletas.entries()){
  const anterior=structuredClone(c);
  c=venderJogadorTecnico(c,alvo.id);
  assert.deepEqual(anterior.mundo.jogadores.find(p=>String(p.id)===String(alvo.mundoId)).clubeNome,'Avaí');
  assert.equal(c.tecnico.gestao.elenco.some(j=>String(j.mundoId)===String(alvo.mundoId)),false);
  assert.equal(c.mundo.jogadores.find(p=>String(p.id)===String(alvo.mundoId)).clubeNome,comprador.nome);
  assert.equal(c.mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===comprador.nome).length,30);
  assert.equal(c.mundo.jogadores.filter(p=>p.clubeNome===null&&String(p.id).startsWith('reserva-multi:')).length,indice+1);
  assert.equal(c.mundo.jogadores.length,anterior.mundo.jogadores.length);
 }
 assert.equal(c.tecnico.gestao.saldo,saldoInicial+valorTotal);
 assert.equal(new Set(c.mundo.jogadores.map(p=>String(p.id))).size,c.mundo.jogadores.length);
 assert.equal(diagnosticarElenco(c.mundo.jogadores,{clubeNome:comprador.nome,contarSecundarias:true}).totalFaltante,0);
 assert.deepEqual(prepararGestaoTecnico(c),c);
});
