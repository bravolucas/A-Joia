import test from 'node:test';
import assert from 'node:assert/strict';
import {prepararGestaoTecnico,criarGestaoTecnico,gerarMercadoTecnico,contratarJogadorTecnico,venderJogadorTecnico,renovarJogadorTecnico,negociarElencoTecnico} from '../src/treinador/mercadoTecnico.js';
import {simularTemporadaMundo,gerarMundoJogadores} from '../src/comum/lib.js';
import {atualizarProjecaoGestao} from '../src/simulacao/elencoUnificado.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {forcaClubeTecnico,proximaTemporadaTecnico} from '../src/treinador/tecnico.js';
import {avaliarClubeNoMundo} from '../src/simulacao/forcaEquipe.js';
import {CLUBES} from '../src/dados/data.js';
function base(){return {nome:'Treinador',idade:45,ano:2030,mundo:gerarMundoJogadores(geradorTecnico('unificado')),tecnico:{clube:'Avaí',liga:'brasileirao',elenco:65,ano:2030,fase:'pretemporada',temporadas:[],personagens:[],reputacao:50,moral:50,diretoria:60,torcida:50}};}
function pronto(){return prepararGestaoTecnico(base());}
const atleta=(c,id)=>c.mundo.jogadores.find(p=>String(p.id)===String(id));
test('elenco vem do mundo, identidades e dados são preservados e preparação é idempotente',()=>{
 const c=base(),antes=structuredClone(c),r=prepararGestaoTecnico(c);
 assert.deepEqual(c,antes);assert.equal(r.tecnico.gestao.cadastroUnificado,1);
 for(const j of r.tecnico.gestao.elenco){const p=atleta(r,j.mundoId);assert.equal(p.nome,j.nome);assert.equal(p.ovr,j.qualidade);assert.equal(p.clubeNome,'Avaí');}
 assert.deepEqual(prepararGestaoTecnico(r),r);
 assert.ok(r.tecnico.gestao.elenco.every(j=>j.contrato>0));
});
test('compra move o mesmo atleta, conserva estatísticas e credita o vendedor',()=>{
 const c=pronto(),a=gerarMercadoTecnico(c.tecnico).find(p=>p.clubeVendedor),antes=structuredClone(c);
 const p=atleta(c,a.mundoId),r=contratarJogadorTecnico(c,a.id);
 assert.deepEqual(c,antes);assert.equal(atleta(r,a.mundoId).clubeNome,'Avaí');assert.deepEqual(atleta(r,a.mundoId).carreira,p.carreira);
 assert.equal(r.mundo.jogadores.filter(p=>p.id===a.mundoId).length,1);assert.equal(r.mundo.receitasMercado[a.clubeVendedor],a.valor);
 assert.equal(r.tecnico.gestao.saldo,c.tecnico.gestao.saldo-a.valor);assert.ok(!gerarMercadoTecnico(r.tecnico).some(p=>p.mundoId===a.mundoId));
 assert.equal(atleta(r,a.mundoId).movimentos.at(-1).de,a.clubeVendedor);
 assert.equal(r.tecnico.forcasMundo[a.clubeVendedor],avaliarClubeNoMundo(r,CLUBES.find(cl=>cl.nome===a.clubeVendedor)).forca);
});
test('venda mantém jogador vivo em um destino real e não permite recomprar na mesma janela',()=>{
 const c=pronto(),j=c.tecnico.gestao.elenco.find(j=>j.setor==='DEF'),r=venderJogadorTecnico(c,j.id),p=atleta(r,j.mundoId);
 assert.ok(p&&!p.aposentado&&p.clubeNome!=='Avaí');assert.ok(CLUBES.some(cl=>cl.nome===p.clubeNome));
 assert.equal(p.movimentos.at(-1).tipo,'venda');assert.equal(r.tecnico.gestao.saldo,c.tecnico.gestao.saldo+Math.round(j.valor*.8));
 assert.ok(!r.tecnico.gestao.elenco.some(p=>p.mundoId===j.mundoId));assert.ok(!gerarMercadoTecnico(r.tecnico).some(p=>p.mundoId===j.mundoId));
 assert.equal(prepararGestaoTecnico(r).tecnico.gestao.elenco.length,r.tecnico.gestao.elenco.length);
});
test('renovação atualiza o contrato canônico e recarga JSON preserva identidade',()=>{
 const c=pronto(),j=c.tecnico.gestao.elenco.find(j=>j.contrato<=2);assert.ok(j);
 const r=renovarJogadorTecnico(c,j.id),p=atleta(r,j.mundoId);
 assert.equal(p.contrato,3);assert.equal(p.salario,Math.ceil(j.salario*1.1));
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(r))),r);
 assert.throws(()=>renovarJogadorTecnico(r,j.id));
});
test('migração conserva legado, não apaga atletas antigos e nunca fabrica suas estatísticas',()=>{
 const c=base();c.tecnico.gestao=criarGestaoTecnico(c.tecnico);const g=structuredClone(c.tecnico.gestao),ids=c.mundo.jogadores.map(p=>p.id),r=prepararGestaoTecnico(c);
 assert.deepEqual(r.tecnico.gestao.elenco.map(p=>[p.id,p.nome,p.qualidade,p.contrato]),g.elenco.map(p=>[p.id,p.nome,p.qualidade,p.contrato]));
 for(const id of ids)assert.ok(atleta(r,id));
 for(const j of r.tecnico.gestao.elenco){assert.equal(atleta(r,j.mundoId).nome,j.nome);assert.equal(atleta(r,j.mundoId).carreira.jogos,0);}
 assert.deepEqual(prepararGestaoTecnico(r),r);
});
test('virada envelhece e decrementa uma vez, libera expirados e repõe a base uma vez',()=>{
 const c=pronto(),j=c.tecnico.gestao.elenco[0];c.mundo.jogadores=c.mundo.jogadores.map(p=>p.id===j.mundoId?{...p,contrato:1,idade:25}:p);
 const retido=c.tecnico.gestao.elenco.find(p=>p.id!==j.id&&p.contrato>1&&p.idade<32);assert.ok(retido);
 const m=simularTemporadaMundo(c.mundo,geradorTecnico('ano'),{clubeControlado:'Avaí',ano:2030});
 assert.equal(m.jogadores.find(p=>p.id===j.mundoId).clubeNome,null);
 const r=prepararGestaoTecnico(atualizarProjecaoGestao({...c,mundo:m,tecnico:{...c.tecnico,ano:2031}}));
 const p=atleta(r,retido.mundoId);assert.equal(p.idade,retido.idade+1);assert.equal(p.contrato,retido.contrato-1);
 assert.equal(r.tecnico.gestao.elenco.find(p=>p.mundoId===retido.mundoId).idade,p.idade);
 assert.ok(r.tecnico.gestao.elenco.some(p=>p.setor===j.setor));assert.deepEqual(prepararGestaoTecnico(r),r);
 assert.ok(m.jogadores.every(p=>typeof p.id==='string'||Number.isFinite(p.id)));
});
test('trocar e retornar ao clube preserva compras, contratos e orçamento',()=>{
 let c=pronto();const a=gerarMercadoTecnico(c.tecnico)[0];c=contratarJogadorTecnico(c,a.id);const g=c.tecnico.gestao;
 c=prepararGestaoTecnico({...c,tecnico:{...c.tecnico,clube:'Flamengo',elenco:80}});
 c=prepararGestaoTecnico({...c,tecnico:{...c.tecnico,clube:'Avaí',elenco:65}});
 assert.equal(c.tecnico.gestao.saldo,g.saldo);assert.ok(c.tecnico.gestao.elenco.some(j=>j.mundoId===a.mundoId));
});
test('preparar próximo ano não retira a força de uma contratação já contada no elenco',()=>{
 let c=pronto();c=negociarElencoTecnico(c,'compra',gerarMercadoTecnico(c.tecnico)[0].id);assert.equal(c.tecnico.avisoGestao.erro,false);
 c={...c,tecnico:{...c.tecnico,fase:'resultado',ano:2031}};const antes=forcaClubeTecnico(c.tecnico),r=proximaTemporadaTecnico(c);
 assert.equal(forcaClubeTecnico(r.tecnico),antes);
});

test('receita de uma venda anterior está no caixa quando o treinador assume o vendedor',()=>{
 let c=pronto();const a=gerarMercadoTecnico(c.tecnico).find(p=>p.clubeVendedor);c=contratarJogadorTecnico(c,a.id);
 const t={...c.tecnico,clube:a.clubeVendedor,elenco:65};const esperado=criarGestaoTecnico(t).saldo+a.valor;
 c=prepararGestaoTecnico({...c,tecnico:t});assert.equal(c.tecnico.gestao.saldo,esperado);
});
test('arquivo anterior não muda durante negociação e janela fecha quando a copa começou',()=>{
 const c=pronto(),a=gerarMercadoTecnico(c.tecnico)[0];c.universo={versao:1,atletas:{[a.mundoId]:{id:a.mundoId,nome:a.nome,historico:[{ano:2029,clube:a.clubeVendedor,jogos:22,gols:3}]}}};
 const antes=structuredClone(c.universo),r=contratarJogadorTecnico(c,a.id);assert.deepEqual(r.universo,antes);
 assert.throws(()=>contratarJogadorTecnico({...c,tecnico:{...c.tecnico,copasEmJogo:{campeonatos:[]}}},a.id),/antes do início/);
});

test('preparador melhora o mesmo atleta canônico uma vez, sem duplicar a evolução anual',()=>{
 const c=pronto(),j=c.tecnico.gestao.elenco[0];const mundo={...c.mundo,jogadores:c.mundo.jogadores.map(p=>p.id===j.mundoId?{...p,idade:20,ovr:60,potencial:90,picoIdade:28,contrato:3}:p)};
 const antes=structuredClone(mundo),sem=simularTemporadaMundo(mundo,geradorTecnico('treino'),{clubeControlado:'Avaí'}),com=simularTemporadaMundo(mundo,geradorTecnico('treino'),{clubeControlado:'Avaí',treinoClube:1});
 assert.deepEqual(mundo,antes);const a=sem.jogadores.find(p=>p.id===j.mundoId),b=com.jogadores.find(p=>p.id===j.mundoId);
 assert.equal(b.idade,21);assert.equal(b.contrato,2);assert.equal(b.ovr,a.ovr+1);
});

test('jogador livre conserva carreira, mas não repete gols e competições do ano anterior',()=>{
 const p={id:1,nome:'Livre',idade:25,ovr:65,posicao:'ATA',clubeNome:null,contrato:0,aposentado:false,carreira:{jogos:22,gols:9,assist:2},porCompeticao:[{nome:'Brasileirão',jogos:22,gols:9,assist:2}],gols:9,jogos:22,assist:2};
 const mundo={cadastroElencos:1,temporada:1,jogadores:[p]},r=simularTemporadaMundo(mundo,()=>.99),atual=r.jogadores[0];
 assert.deepEqual(atual.carreira,p.carreira);assert.deepEqual(atual.porCompeticao,[]);assert.equal(atual.jogos,0);assert.equal(atual.gols,0);assert.equal(atual.temporadaEstatisticas,2);assert.equal(p.porCompeticao[0].gols,9);
});
