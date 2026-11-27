import test from 'node:test';
import assert from 'node:assert/strict';
import {simularSelecoesMundo,completarHistoricoCopasMundo} from '../src/simulacao/copasExternasMundo.js';

const usuario={codigo:'TESTE-COPAS-QUADRIENAIS',nac:'BRA'};
const copa=(ano,extra={})=>({ano,nome:'Copa do Mundo',tipo:'copaMundo',nac:'BRA',
  label:'Brasil',fim:true,convocado:true,campeao:false,etapa:'mata',
  jogos:[{fase:0,adv:{label:'França'},gp:0,gc:1,res:'D'}],...extra});
const mundial=(c,ano)=>simularSelecoesMundo(c,{ano,copa:copa(ano)}).find(t=>t.nome==='Copa do Mundo');

test('modo rápido simula Copa em todos os anos quadrienais, mesmo com campanha do jogador já encerrada',()=>{
 for(const ano of [2026,2030,2034,2038,2042,2046,2050]){
  const t=mundial(usuario,ano);
  assert.ok(t,`Copa ${ano} não foi simulada`);
  assert.equal(t.ano,ano);
  assert.equal(t.tipo,'copaMundo');
  assert.equal(t.participantes,48);
  assert.ok(t.campeao,`Copa ${ano} sem campeão`);
  assert.notEqual(t.campeao,'Brasil','uma seleção já eliminada não pode vencer outra simulação');
  assert.deepEqual(mundial(usuario,ano),t,'a simulação deve ser determinística');
 }
 for(const ano of [2027,2028,2029,2031,2032,2033]){
  assert.equal(simularSelecoesMundo(usuario,{ano}).some(t=>t.nome==='Copa do Mundo'),false);
 }
});

test('vitória do jogador na final torna sua seleção campeã sem sortear vencedor externo',()=>{
 const a={ano:2034,copa:copa(2034,{campeao:true,fase:4,
  jogos:[{fase:4,adv:{label:'Argentina'},gp:2,gc:1,res:'V'}]})};
 const t=simularSelecoesMundo(usuario,a).filter(t=>t.nome==='Copa do Mundo');
 assert.equal(t.length,1);
 assert.equal(t[0].campeao,'Brasil');
 assert.equal(t[0].vice,'Argentina');
 assert.equal(t[0].origem,'campanha-jogador');
 assert.equal(t[0].jogosUsuario.length,1);
});

test('derrota real na final registra a seleção adversária como campeã',()=>{
 const a={ano:2030,copa:copa(2030,{fase:4,
  jogos:[{fase:4,adv:{label:'França'},gp:0,gc:2,res:'D'}]})};
 const t=simularSelecoesMundo(usuario,a).filter(t=>t.nome==='Copa do Mundo');
 assert.equal(t.length,1);
 assert.equal(t[0].campeao,'França');
 assert.equal(t[0].vice,'Brasil');
});

test('recupera campeões das Copas puladas em saves antigos sem duplicar ou alterar campanha pessoal',()=>{
 const temporadas=[2026,2030,2034,2038].map(ano=>({
  ano,copa:copa(ano),selecao:{tipo:'copaMundo',jogos:1,gols:1},
  titulos:[],jogos:31,gols:14
 }));
 const c={...usuario,temporadas,historiaFutebol:{anos:[2026,2027,2030,2034,2038],
  titulos:[{ano:2030,nome:'Copa do Mundo',tipo:'copaMundo',clube:'Alemanha'}]}};
 const antes=structuredClone(c),reparado=completarHistoricoCopasMundo(c);
 assert.deepEqual(c,antes,'não altera o save original em memória');
 assert.deepEqual(reparado.temporadas,temporadas,'preserva todas as partidas e métricas');
 const edicoes=reparado.historiaFutebol.titulos.filter(t=>t.nome==='Copa do Mundo');
 assert.deepEqual(edicoes.map(t=>t.ano).sort(),[2026,2030,2034,2038]);
 assert.equal(edicoes.find(t=>t.ano===2030).clube,'Alemanha','não substitui vencedores confirmados');
 assert.equal(completarHistoricoCopasMundo(reparado),reparado,'reparo não deve duplicar registros');
});

test('save legado com taça pessoal mas sem card da Copa mantém a seleção campeã',()=>{
 const c={...usuario,temporadas:[{ano:2034,titulos:[{tipo:'copaMundo',nome:'Copa do Mundo'}]}],
  historiaFutebol:{anos:[2034],titulos:[]}};
 const reparado=completarHistoricoCopasMundo(c);
 assert.deepEqual(reparado.historiaFutebol.titulos,[{
  ano:2034,nome:'Copa do Mundo',tipo:'copaMundo',clube:'Brasil'
 }]);
});

test('sem convocação pessoal o calendário internacional não pula a edição',()=>{
 const cup=simularSelecoesMundo(usuario,{ano:2042,selecao:null,copa:null})
  .filter(t=>t.nome==='Copa do Mundo');
 assert.equal(cup.length,1);
 assert.ok(cup[0].campeao);
});

test('final legada com adversário em texto preserva campeão e suporta lista de jogos incompleta',()=>{
 const antigo={ano:2046,copa:copa(2046,{campeao:false,
  jogos:[{fase:4,adv:'Uruguai',res:'D',gp:0,gc:1}]})};
 const resultado=simularSelecoesMundo(usuario,antigo).filter(t=>t.nome==='Copa do Mundo');
 assert.equal(resultado.length,1);
 assert.equal(resultado[0].campeao,'Uruguai');
 const incompleto={ano:2050,copa:copa(2050,{campeao:true,jogos:{}})};
 const reparado=simularSelecoesMundo(usuario,incompleto).find(t=>t.nome==='Copa do Mundo');
 assert.equal(reparado.campeao,'Brasil');
 assert.deepEqual(reparado.jogosUsuario,[]);
});

test('save antigo com título na ficha de seleção recompõe a Copa sem refazer partidas',()=>{
 const c={...usuario,temporadas:[{ano:2042,selecao:{tipo:'copaMundo',campeao:true},gols:11,jogos:30}],
  historiaFutebol:{anos:[2042],titulos:[]}};
 const reparado=completarHistoricoCopasMundo(c);
 assert.equal(reparado.historiaFutebol.titulos[0].clube,'Brasil');
 assert.equal(reparado.temporadas[0].jogos,30);
});
