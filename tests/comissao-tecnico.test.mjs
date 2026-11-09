import test from 'node:test';
import assert from 'node:assert/strict';
import {criarGestaoTecnico,prepararGestaoTecnico,contratarComissaoTecnico,resumoGestaoTecnico,contratarJogadorTecnico,gerarMercadoTecnico} from '../src/treinador/mercadoTecnico.js';
import {propostaComissaoTecnico,comissaoAtivaGestao} from '../src/treinador/comissaoTecnico.js';
import {perfilTaticoTecnico} from '../src/treinador/taticasTecnico.js';
import {probabilidadesConfrontoTecnico} from '../src/treinador/tecnico.js';
import {mediasPartidaCopaTecnico} from '../src/treinador/competicoesTecnico.js';
const carreira=()=>prepararGestaoTecnico({tecnico:{clube:'Santos',ano:2030,elenco:65,fase:'pretemporada',temporadas:[]}});
test('comissão cobra uma vez, ocupa folha e persiste sem mutar o save',()=>{
 const c=carreira(),antes=structuredClone(c),p=propostaComissaoTecnico(c.tecnico.gestao,'auxiliar');
 const novo=contratarComissaoTecnico(c,'auxiliar'),g=novo.tecnico.gestao;
 assert.deepEqual(c,antes);assert.equal(g.saldo,c.tecnico.gestao.saldo-p.custo);
 assert.equal(resumoGestaoTecnico(g).folha,resumoGestaoTecnico(c.tecnico.gestao).folha+p.salario);
 assert.equal(resumoGestaoTecnico(g).folhaComissao,p.salario);
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(novo))),novo);
 assert.throws(()=>contratarComissaoTecnico(novo,'auxiliar'),/já está contratado/);
 for(const [patch,mensagem] of [[{saldo:0},/Orçamento/],[{tetoSalarial:resumoGestaoTecnico(c.tecnico.gestao).folha},/teto salarial/]]){
  assert.throws(()=>contratarComissaoTecnico({...c,tecnico:{...c.tecnico,gestao:{...c.tecnico.gestao,...patch}}},'auxiliar'),mensagem);
 }
 const limite={...novo,tecnico:{...novo.tecnico,gestao:{...g,tetoSalarial:resumoGestaoTecnico(g).folha}}};
 assert.throws(()=>contratarJogadorTecnico(limite,gerarMercadoTecnico(limite.tecnico)[0].id),/teto salarial/);
 for(const patch of [{fase:'intervencao'},{fase:'resultado'},{desempregado:true},{andamento:{rodadas:1}},{idade:85}])assert.throws(()=>contratarComissaoTecnico({...c,tecnico:{...c.tecnico,...patch}},'auxiliar'));
 assert.throws(()=>contratarComissaoTecnico(c,'invalido'),/inválido/);
});
test('auxiliar aumenta força na liga e nas copas, sem bônus em outro clube ou ano',()=>{
 const c=carreira(),novo=contratarComissaoTecnico(c,'auxiliar');
 const a=perfilTaticoTecnico(c.tecnico),b=perfilTaticoTecnico(novo.tecnico);
 assert.equal(b.ajuste,a.ajuste+1);
 assert.ok(probabilidadesConfrontoTecnico(novo.tecnico,{forca:65,casa:true}).vitoria>probabilidadesConfrontoTecnico(c.tecnico,{forca:65,casa:true}).vitoria);
 const rival={nome:'Rival',elenco:65};
 const copa=t=>mediasPartidaCopaTecnico({nome:'Santos',elenco:65,planoTatico:perfilTaticoTecnico(t)},rival,'Santos');
 assert.equal(copa(novo.tecnico).diferenca,copa(c.tecnico).diferenca+1);
 assert.equal(perfilTaticoTecnico({...novo.tecnico,ano:2031}).ajuste,a.ajuste);
 assert.equal(perfilTaticoTecnico({...novo.tecnico,clube:'Flamengo'}).ajuste,0);
});
test('efeitos anuais respeitam potencial, reforçam base e expiram sem renovação ou cobrança',()=>{
 const c=carreira(),g=c.tecnico.gestao;
 const equipado=contratarComissaoTecnico(contratarComissaoTecnico(c,'preparador'),'olheiro');
 const comum=criarGestaoTecnico({...c.tecnico,ano:2031}),novo=criarGestaoTecnico({...equipado.tecnico,ano:2031});
 for(const j of comum.elenco){
  const evoluido=novo.elenco.find(x=>x.id===j.id);assert.ok(evoluido);
  const anterior=g.elenco.find(x=>x.id===j.id);
  if(anterior){assert.equal(evoluido.qualidade,Math.min(j.potencial,j.qualidade+(j.idade<30?1:0)));}
  else {assert.equal(evoluido.qualidade,Math.min(95,j.qualidade+2));}
 }
 assert.equal(comissaoAtivaGestao(novo).length,0);
 assert.equal(novo.movimentos.filter(m=>m.tipo==='comissao').length,2);
 assert.equal(novo.movimentos.filter(m=>m.tipo==='fim-comissao').length,2);
 assert.deepEqual(criarGestaoTecnico({...c.tecnico,ano:2031,gestao:novo}),novo);
 const proximo={...equipado,tecnico:{...equipado.tecnico,ano:2031,gestao:novo}};
 assert.doesNotThrow(()=>contratarComissaoTecnico(proximo,'preparador'));
});
