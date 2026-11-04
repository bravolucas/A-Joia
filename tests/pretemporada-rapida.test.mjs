import test from 'node:test';
import assert from 'node:assert/strict';
import {planoPretemporadaRapida,cartaPretemporadaRapida,aplicarPretemporadaRapida} from '../pretemporadaRapida.js';
import {iniciarCarreiraTecnico,escolherPretemporadaRapidaTecnico,proximaTemporadaTecnico,gerarPropostasTecnico,CLUBES_CONVITES_TECNICO} from '../tecnico.js';
const carreira=(ritmo='normal')=>{const c=iniciarCarreiraTecnico({nome:'Teste rápido',idade:40,ano:2030,aposentado:true,clubeNome:'Santos',temporadas:[],totais:{},legado:{pontos:600}});return {...c,ritmo,tecnico:{...c.tecnico,clubeInicialEscolhido:true,elenco:70,verbaRapida:3000}};};
test('uma escolha simula a temporada; intenso exige no máximo duas, sem duplicação',()=>{
 for(const ritmo of ['normal','expresso','intenso']){
  let c=carreira(ritmo),chaveAntiga;
  for(let n=0;n<(ritmo==='intenso'?2:1);n++){
   const carta=cartaPretemporadaRapida(c.tecnico,ritmo==='intenso'?2:1);assert.ok(carta);assert.ok(carta.total<=2);
   const antes=structuredClone(c),op=carta.opcoes.find(o=>o.custo<=carta.verba);
   const novo=escolherPretemporadaRapidaTecnico(c,carta.chave,op.id,()=>.4);assert.deepEqual(c,antes);
   assert.equal(escolherPretemporadaRapidaTecnico(novo,carta.chave,op.id,()=>.4),novo);
   c=JSON.parse(JSON.stringify(novo));chaveAntiga=carta.chave;
  }
  assert.equal(c.tecnico.fase,'resultado');assert.equal(c.tecnico.temporadas.length,1);assert.equal(c.tecnico.ano,2031);
  assert.equal(c.tecnico.acompanharJogo,false);assert.equal(c.tecnico.modoTreinadorRapido,true);
  assert.equal(escolherPretemporadaRapidaTecnico(c,chaveAntiga,'manter'),c);
 }
});
test('variações estáveis, dinheiro e efeitos futuros são aplicados uma vez no mesmo clube',()=>{
 const c=carreira(),antes=structuredClone(c);
 assert.deepEqual(planoPretemporadaRapida(c.tecnico,2),planoPretemporadaRapida(c.tecnico,2));
 const jovem={...c,tecnico:{...c.tecnico,planoRapido:{ano:2030,clube:'Santos',cartas:['craque-jovem'],respostas:[]}}};
 const carta=cartaPretemporadaRapida(jovem.tecnico),op=carta.opcoes.find(o=>o.id==='jovem');
 const novo=aplicarPretemporadaRapida(jovem,carta.chave,op.id);
 assert.equal(novo.tecnico.elenco,72);assert.equal(novo.tecnico.verbaRapida,3000-op.custo);
 assert.equal(novo.tecnico.efeitosPendentes[0].heranca.elenco,3);assert.deepEqual(c,antes);
 const proximo=proximaTemporadaTecnico({...novo,tecnico:{...novo.tecnico,fase:'resultado',ano:2031}});
 assert.equal(proximo.tecnico.elenco,75);
 assert.equal(proximo.tecnico.efeitosPendentes.length,0);
 const outro=proximaTemporadaTecnico({...novo,tecnico:{...novo.tecnico,clube:'Flamengo',fase:'resultado',ano:2031}});
 assert.equal(outro.tecnico.elenco,72);
 const pobre={...jovem,tecnico:{...jovem.tecnico,verbaRapida:0}};
 assert.throws(()=>aplicarPretemporadaRapida(pobre,carta.chave,'craque'),/Verba/);
});
test('venda, rival e esquema têm efeitos reais e cartas não repetem as quatro recentes',()=>{
 const c=carreira();
 for(const id of ['venda-base','rival','esquema']){
  const base={...c,tecnico:{...c.tecnico,planoRapido:{ano:2030,clube:'Santos',cartas:[id],respostas:[]}}},carta=cartaPretemporadaRapida(base.tecnico);
  const novo=aplicarPretemporadaRapida(base,carta.chave,carta.opcoes[0].id);
  if(id==='venda-base'){assert.equal(novo.tecnico.verbaRapida,3900);assert.equal(novo.tecnico.elenco,67);}
  if(id==='rival'){assert.match(carta.texto,/São Paulo|Corinthians|Palmeiras/);assert.equal(novo.tecnico.elenco,74);}
  if(id==='esquema'){assert.equal(novo.tecnico.formacao,'4-3-3');assert.equal(novo.tecnico.estilo,'ofensivo');}
 }
 const recentes=['craque-jovem','venda-base','esquema','rival'];
 assert.ok(planoPretemporadaRapida({...c.tecnico,historicoRapido:recentes},2).cartas.every(id=>!recentes.includes(id)));
});
test('convites respeitam o patamar local e explicam o interesse',()=>{
 const atual=CLUBES_CONVITES_TECNICO.find(c=>c.nome==='Confiança');
 const t={clube:'Confiança',pais:'Brasil',liga:'serieB',elenco:atual.elenco,reputacao:60,temporadas:[{clube:'Confiança',liga:'serieB',posicao:12,cumpriuObjetivo:false}]};
 const propostas=gerarPropostasTecnico(t,()=>0);
 assert.ok(propostas.length>0);assert.ok(propostas.every(p=>p.pais==='Brasil'&&p.elenco<=atual.elenco+6&&p.motivo));
 assert.ok(!propostas.some(p=>['Real Madrid','Paris Saint-Germain','Manchester City'].includes(p.nome)));
 const desempregado={...t,clube:null,pais:null,desempregado:true};
 assert.ok(gerarPropostasTecnico(desempregado,()=>0).every(p=>p.pais==='Brasil'));
});

test('moral afeta confrontos; convites legados são migrados uma única vez',async()=>{
 const {probabilidadesConfrontoTecnico,atualizarPropostasCoerentesTecnico}=await import('../tecnico.js');
 const t=carreira().tecnico;
 assert.ok(probabilidadesConfrontoTecnico({...t,moral:80},{forca:70,casa:true}).vitoria>probabilidadesConfrontoTecnico({...t,moral:30},{forca:70,casa:true}).vitoria);
 const c={...carreira(),tecnico:{...t,fase:'resultado',propostas:[{nome:'Real Madrid'}]}};
 const antes=structuredClone(c),novo=atualizarPropostasCoerentesTecnico(c);
 assert.deepEqual(c,antes);assert.ok(novo.tecnico.propostas.every(p=>p.motivo&&Number.isFinite(p.coerencia)));
 assert.equal(atualizarPropostasCoerentesTecnico(novo),novo);
 assert.deepEqual(atualizarPropostasCoerentesTecnico(c),novo);
 const semOfertas={...c,tecnico:{...c.tecnico,propostas:[]}};assert.equal(atualizarPropostasCoerentesTecnico(semOfertas),semOfertas);
});

test('aporte não confisca receita de venda e as dez variações aparecem ao longo da carreira',async()=>{
 const {renovarVerbaPretemporada}=await import('../pretemporadaRapida.js');
 assert.equal(renovarVerbaPretemporada({verbaRapida:6900}),6900);
 assert.equal(renovarVerbaPretemporada({verbaRapida:100}),450);
 let t={clube:'Santos',ano:2030,historicoRapido:[]};const vistas=new Set();
 for(let i=0;i<30;i++){const plano=planoPretemporadaRapida(t,1);vistas.add(plano.cartas[0]);t={...t,ano:t.ano+1,historicoRapido:[...t.historicoRapido,plano.cartas[0]]};}
 assert.equal(vistas.size,10);
});

test('carreiras rápidas de 30 temporadas preservam limites, recarga e até duas decisões',async()=>{
 const {negociarContratoTecnico,passarAnoDesempregado}=await import('../tecnico.js');
 for(const ritmo of ['normal','intenso']){
  let c=carreira(ritmo),n=73,passos=0;const rng=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
  while(c.tecnico.temporadas.length<30&&passos++<150){
   if(c.tecnico.fase==='resultado'){
    if(c.tecnico.demitido||c.tecnico.desempregado){
     if(!c.tecnico.propostas.length){c=passarAnoDesempregado(c,rng);continue;}
     c=negociarContratoTecnico(c,c.tecnico.propostas[0].nome,'prudente',rng);
     if(!c.tecnico.ultimaNegociacao?.aceita)continue;
    }
    c=proximaTemporadaTecnico(c);
   }
   const antes=c.tecnico.temporadas.length,q=ritmo==='intenso'?2:1;
   for(let i=0;i<q;i++){
    const carta=cartaPretemporadaRapida(c.tecnico,q),opcoes=carta.opcoes.filter(o=>o.custo<=carta.verba);
    const op=opcoes[Math.floor(rng()*opcoes.length)];
    c=escolherPretemporadaRapidaTecnico(c,carta.chave,op.id,rng);c=JSON.parse(JSON.stringify(c));
    assert.ok(c.tecnico.verbaRapida>=0);assert.ok(c.tecnico.elenco>=10&&c.tecnico.elenco<=95);
   }
   assert.equal(c.tecnico.temporadas.length,antes+1);
   assert.equal(c.tecnico.temporadas.at(-1).decisoes.filter(d=>d.carta!=='simulacao_expressa').length,q);
   assert.equal(c.tecnico.gestao,undefined);
  }
  assert.equal(c.tecnico.temporadas.length,30);
 }
});
