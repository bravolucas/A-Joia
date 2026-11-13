import { extrairConquistasMuseu, mesclarMuseu, museuVazio } from '../src/museu/museu.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { SELECOES_TECNICO, propostasSelecoesTecnico, simularAnoSelecaoTecnico, CONTINENTAIS_TECNICO } from '../src/treinador/selecoesTecnico.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';
import * as T from '../src/treinador/tecnico.js';
import { cartaPretemporadaRapida } from '../src/treinador/pretemporadaRapida.js';
const experiencia={reputacao:88,temporadas:Array.from({length:6},(_,i)=>({ano:2020+i,clube:'Bahia',cumpriuObjetivo:true,posicao:4})),titulos:3,vitorias:150,empates:40,derrotas:35,pais:'Brasil',clube:'Bahia',ano:2031,elenco:75,fase:'resultado'};
const carreira=()=>({nome:'Teste',ano:2031,idade:45,tecnico:{...experiencia}});
function assumir(nac){const c=carreira();c.tecnico.propostas=[SELECOES_TECNICO.find(n=>n.nac===nac)];return T.aceitarPropostaTecnico(c,c.tecnico.propostas[0].nome);}
test('mercado internacional inclui países distintos fora de ano de Copa, respeitando nível',()=>{
 const nomes=new Set();for(let i=0;i<400;i++){for(const p of propostasSelecoesTecnico({...experiencia,ano:2025+i},78,geradorTecnico(i))){nomes.add(p.nome);assert.ok(p.exigencia<=88);assert.ok(p.elenco<=95);}}
 assert.ok(nomes.size>20);assert.ok(nomes.has('Portugal'));assert.ok(nomes.has('Japão'));assert.deepEqual(propostasSelecoesTecnico({...experiencia,temporadas:[]},45,()=>0),[]);
 assert.ok(propostasSelecoesTecnico(experiencia,60,()=>.1).every(p=>p.elenco<85));
});
test('aceitar seleção encerra vínculo de clube; aceitar clube encerra seleção',()=>{
 let c=assumir('POR');assert.equal(c.tecnico.clube,'Portugal');assert.equal(c.tecnico.selecao,'POR');assert.equal(c.tecnico.tipoEquipe,'selecao');assert.equal(c.tecnico.clubeReferencia,null);
 c.tecnico.propostas=[T.CLUBES_CONVITES_TECNICO.find(x=>x.nome==='Bahia')];c=T.aceitarPropostaTecnico(c,'Bahia');assert.equal(c.tecnico.tipoEquipe,'clube');assert.equal(c.tecnico.selecao,null);
});
test('cada confederação tem competição continental própria e somente adversários da região',()=>{
 for(const [nac,ano] of [['POR',2032],['BRA',2032],['JAP',2031],['MAR',2031],['MEX',2031],['NZL',2032]]){
 const c=assumir(nac),t={...c.tecnico,ano};const r=simularAnoSelecaoTecnico(t,78,85,geradorTecnico(nac));const a=r.temporadas.at(-1),base=SELECOES_TECNICO.find(n=>n.nac===nac),copa=a.torneios.find(x=>x.nome===CONTINENTAIS_TECNICO[base.confederacao]);assert.ok(copa,nac);
 assert.ok(copa.fases.flatMap(f=>f.jogos).every(j=>[j.casa,j.fora].every(nome=>SELECOES_TECNICO.find(n=>n.nome===nome).confederacao===base.confederacao)));
 assert.ok(a.torneios.some(x=>x.tipo==='eliminatorias'));
 }
});
test('vaga conquistada nas eliminatórias habilita Copa; eliminação não inventa participação',()=>{
 let c=assumir('ESP'),r;for(let i=0;i<100;i++){r=simularAnoSelecaoTecnico({...c.tecnico,ano:2029},85,99,geradorTecnico(i));if(r.classificacaoSelecao.classificado)break;}
 assert.equal(r.classificacaoSelecao.copa,2030);assert.ok(r.classificacaoSelecao.classificado);
 const copa=simularAnoSelecaoTecnico({...c.tecnico,...r,ano:2030},85,99,geradorTecnico('copa'));assert.ok(copa.temporadas.at(-1).torneios.some(x=>x.tipo==='copaMundo'));
 const fora=simularAnoSelecaoTecnico({...c.tecnico,ano:2030,classificacaoSelecao:{nac:'ESP',copa:2030,classificado:false}},85,99,()=>.5);assert.ok(!fora.temporadas.at(-1).torneios.some(x=>x.tipo==='copaMundo'));
});
test('temporada de seleção integra fluxo expresso, salário e histórico sem liga de clube',()=>{
 let c=assumir('POR');c=T.proximaTemporadaTecnico(c);const carta=cartaPretemporadaRapida(c.tecnico);assert.ok(['convocacao','entrosamento','observacao','lideranca-selecao','bola-parada','recuperacao'].includes(carta.id));
 c=T.escolherPretemporadaRapidaTecnico(c,carta.chave,carta.opcoes[0].id,geradorTecnico('ano'));assert.equal(c.tecnico.fase,'resultado');assert.equal(c.tecnico.temporadas.at(-1).clube,'Portugal');assert.ok(c.tecnico.carteiraTecnico.pagamentos.length);assert.equal(c.tecnico.temporadas.at(-1).classificacoesMundo,undefined);
});
test('taça de seleção em save antigo não pertence ao clube; histórico e total preservados',()=>{
 const t={temporadas:[{ano:2030,clube:'Bahia',titulosConquistados:['Copa do Brasil','Copa do Mundo'],torneios:[{nome:'Copa do Mundo',selecao:'Portugal',campeao:'Portugal'}]}]};
 const titulos=T.titulosConquistadosTecnico(t);assert.deepEqual(titulos.map(x=>x.clube),['Bahia','Portugal']);const h=T.historicoProfissionalTecnico(t);assert.equal(h.titulos,2);assert.equal(h.clubes.find(x=>x.nome==='Bahia').titulos,1);assert.equal(h.clubes.find(x=>x.nome==='Portugal').titulos,1);
});
test('finais de seleção têm lado correto e salvamento não duplica taça',()=>{
 let r,c=assumir('POR');for(let i=0;i<100;i++){r=simularAnoSelecaoTecnico({...c.tecnico,ano:2032},80,99,geradorTecnico(i),{interativo:true});if(r.finaisPendentes.length)break;}
 assert.ok(r.finaisPendentes.length);const f=r.finaisPendentes[0];assert.equal(f.lado,'Portugal');c={...c,tecnico:{...c.tecnico,...r,finaisPendentes:r.finaisPendentes.map(x=>({...x,dado:0}))}};c=T.resolverFinalTecnico(c,f.nome,'controlar');assert.equal(T.titulosConquistadosTecnico(c.tecnico).at(-1).clube,'Portugal');const again=T.resolverFinalTecnico(JSON.parse(JSON.stringify(c)),f.nome,'controlar');assert.equal(again.tecnico.titulos,c.tecnico.titulos);
});
test('início respeita OVR; somente ídolo máximo abre exceção',()=>{
 const jogador={nome:'Novato',ano:2030,idade:40,aposentado:true,clubeNome:'Real Madrid',legado:{pontos:0},torcida:{'Real Madrid':80},temporadas:Array.from({length:4},()=>({clube:'Real Madrid',titulos:['La Liga']}))};
 const c=T.iniciarCarreiraTecnico(jogador);assert.ok(c.tecnico.opcoesInicio.length);assert.ok(!c.tecnico.opcoesInicio.some(x=>x.clube==='Real Madrid'));assert.ok(c.tecnico.opcoesInicio.every(x=>x.elenco<=T.calcularOvrTecnico(c.tecnico)+18));
 const idolo=T.iniciarCarreiraTecnico({...jogador,torcida:{'Real Madrid':95}});assert.ok(idolo.tecnico.opcoesInicio.some(x=>x.clube==='Real Madrid'));
 assert.throws(()=>T.iniciarNoClubeIdolo({...c,tecnico:{...c.tecnico,opcoesInicio:[{clube:'Real Madrid'}]}},'Real Madrid'));
});
test('clubes variam entre sorteios sem ultrapassar teto esportivo',()=>{
 const times=new Set();for(let i=0;i<60;i++)for(const p of T.gerarPropostasTecnico({...experiencia,vinculosJogador:[]},geradorTecnico(i)).filter(x=>x.tipo==='clube')){times.add(p.nome);assert.ok(p.elenco<=T.calcularOvrTecnico(experiencia)+24);}
 assert.ok(times.size>25,`${times.size} clubes`);
});

test('museu corrige atribuição antiga sem duplicar a quantidade',()=>{
 const c={nome:'Teste',museuId:'selecao-museu',tecnico:{temporadas:[{ano:2030,clube:'Bahia',titulosConquistados:['Copa do Mundo'],torneios:[{nome:'Copa do Mundo',selecao:'Portugal',campeao:'Portugal'}]}]}};
 const itens=extrairConquistasMuseu(c),taca=itens.find(x=>x.papel==='Treinador'&&x.categoria==='tacas');assert.equal(taca.clube,'Portugal');
 const antigo=mesclarMuseu(museuVazio(),[{...taca,clube:'Bahia'}]),corrigido=mesclarMuseu(antigo,itens);const fonte=corrigido.tacas[taca.id].fontes[taca.fonte];assert.equal(fonte.clube,'Portugal');assert.equal(fonte.quantidade,1);
});
