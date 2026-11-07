// Auditoria reproduzível, sem ler ou escrever saves. Execute: node scripts/auditar-gestao.mjs
import assert from 'node:assert/strict';
import {prepararGestaoTecnico,negociarElencoTecnico,resumoGestaoTecnico} from '../src/treinador/mercadoTecnico.js';
import {DESAFIOS_HISTORICOS,iniciarDesafioHistorico,estadoInicialDesafios} from '../src/desafios/desafiosHistoricos.js';
import {jogarTemporadaExpressaTecnico,proximaTemporadaTecnico,negociarContratoTecnico,passarAnoDesempregado} from '../src/treinador/tecnico.js';
const seed=n=>()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
const resultado={gestao:[],desafios:[],carreiras:[]};
for(const forca of [40,65,85])for(const comissao of [false,true]){
 let c=prepararGestaoTecnico({tecnico:{clube:'Santos',ano:2030,elenco:forca,fase:'pretemporada',temporadas:[]}}),custos=0;
 const marcos=[];
 for(let ano=0;ano<=30;ano++){
  const g=c.tecnico.gestao,r=resumoGestaoTecnico(g);
  assert.equal(g.elenco.length,24);assert.equal(new Set(g.elenco.map(j=>j.id)).size,24);
  assert.ok(g.saldo>=0);assert.ok(r.folha<=g.tetoSalarial);
  assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(c))),c);
  if([0,5,10,20,30].includes(ano))marcos.push({ano,forca:+c.tecnico.elenco.toFixed(1),saldo:g.saldo,folha:r.folha});
  if(ano===30)break;
  if(comissao)for(const cargo of ['auxiliar','preparador','olheiro']){
   const novo=negociarElencoTecnico(c,'comissao',cargo);assert.equal(novo.tecnico.avisoGestao.erro,false);custos+=c.tecnico.gestao.saldo-novo.tecnico.gestao.saldo;c=novo;
  }
  c=prepararGestaoTecnico({...c,tecnico:{...c.tecnico,ano:c.tecnico.ano+1}});
 }
 resultado.gestao.push({forcaInicial:forca,comissao,custos,marcos});
}
for(const d of DESAFIOS_HISTORICOS){let sucessos=0,posicoes=0;
 for(let n=1;n<=100;n++){
  const c=iniciarDesafioHistorico(estadoInicialDesafios(),d.id).ativo.c;
  const t=jogarTemporadaExpressaTecnico(c,null,seed(n)).tecnico.temporadas[0];
  if(t.posicao<=d.posicao)sucessos++;posicoes+=t.posicao;
 }
 resultado.desafios.push({id:d.id,tentativas:100,sucessos,posicaoMedia:posicoes/100});
}
// Carreiras completas: demissões, novas propostas e viradas usam o fluxo real.
for(const d of DESAFIOS_HISTORICOS){
 let c=iniciarDesafioHistorico(estadoInicialDesafios(),d.id).ativo.c;
 const rng=seed(73);let espera=0;const clubes=new Set();
 while(c.tecnico.temporadas.length<30&&espera<60){
  if(c.tecnico.fase==='resultado'){
   if(c.tecnico.demitido||c.tecnico.desempregado){
    if(!c.tecnico.propostas.length){c=passarAnoDesempregado(c,rng);espera++;continue;}
    c=negociarContratoTecnico(c,c.tecnico.propostas[0].nome,'prudente',rng);
    if(!c.tecnico.ultimaNegociacao?.aceita)continue;
   }
   c=prepararGestaoTecnico(proximaTemporadaTecnico(c));
  }
  clubes.add(c.tecnico.clube);const quantidade=c.tecnico.temporadas.length;
  c=jogarTemporadaExpressaTecnico(c,null,rng);
  assert.equal(c.tecnico.temporadas.length,quantidade+1);
  c=JSON.parse(JSON.stringify(c));
 }
 assert.equal(c.tecnico.temporadas.length,30);
 resultado.carreiras.push({inicio:d.clube,temporadas:30,clubes:clubes.size,anosSemClube:espera});
}
console.log(JSON.stringify(resultado,null,2));
