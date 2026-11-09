import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,transferir,iniciarEmprestimo,ofertasEmprestimo,carregarRapido} from '../src/jogador/rapido.js';
import {iniciarCamisas,prepararCamisaClube,aposentarDonoCamisa,prepararCamisaSelecao,sincronizarCamisasSelecao,camisaInfo,escolherCamisa} from '../src/jogador/camisasCarreira.js';
import {definirPlanoEspaco,prepararProjetoTemporada,fecharProjetoTemporada,projetoDoClube,patamarCarreira,retrospectivaCarreira} from '../src/jogador/projetosCarreira.js';
import {perfilAdversario,ajustePlanoAdversario,PERFIS_ADVERSARIO} from '../src/competicoes/perfilAdversario.js';
const atleta=()=>{const c=criarJogador({nome:'Lucas',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',numeroFavorito:10,codigo:'CAMISAS'});c.clubeNome='Santos';c.flags.baseEscolhida=true;prepararCamisaClube(c,'Santos',{novaChegada:true});return c;};
test('favorito não reserva camisa; escolha livre preserva origem e não permite número ocupado',()=>{
 const c=atleta(),antes=structuredClone(c),info=camisaInfo(c),ocupado=info.elenco[0].numero;
 assert.equal(c.numeroFavorito,10);assert.equal(info.escolhido,false);assert.throws(()=>escolherCamisa(c,ocupado));
 const n=info.livres.find(n=>n!==10),novo=escolherCamisa(c,n);assert.equal(novo.numero,n);assert.equal(novo.numeroFavorito,10);assert.equal(novo.camisas.clubes.Santos.escolhido,true);assert.deepEqual(c,antes);assert.throws(()=>escolherCamisa(c,100));
});
test('favorito ocupado exige moral e prestígio; pedido troca o dono sem duplicar números',()=>{
 const c=atleta();c.numeroFavorito=c.camisas.clubes.Santos.elenco[0].numero;c.moral=79;c.torcida.Santos=100;assert.throws(()=>escolherCamisa(c,c.numeroFavorito));c.moral=90;c.torcida.Santos=74;assert.throws(()=>escolherCamisa(c,c.numeroFavorito));c.torcida.Santos=90;
 const n=escolherCamisa(c,c.numeroFavorito),kit=n.camisas.clubes.Santos;assert.equal(n.numero,n.numeroFavorito);assert.equal(new Set([kit.numero,...kit.elenco.map(p=>p.numero)]).size,25);assert.equal(n.camisas.historico.at(-1).pedido,true);
});
test('migração mantém número efetivo e histórico dos saves antigos',()=>{
 const c=atleta();delete c.camisas;delete c.numeroFavorito;c.numero=77;c.temporadas=[{numero:9}];iniciarCamisas(c);assert.equal(c.numero,77);assert.equal(c.numeroFavorito,77);assert.equal(c.camisas.clubes.Santos.escolhido,true);assert.equal(c.temporadas[0].numero,9);
});
test('seleção tem escolha independente, limite 26 e elenco estável sem duplicatas',()=>{
 let c=atleta();c=escolherCamisa(c,camisaInfo(c).livres.at(-1));const clube=c.numero;
 const e={jogadores:Array.from({length:25},(_,i)=>({id:'s'+i,nome:'Seleção '+i})),usuario:{}};prepararCamisaSelecao(c,e.jogadores);assert.equal(c.camisas.selecao.escolhido,false);assert.throws(()=>escolherCamisa(c,99,'selecao'));
 const numero=camisaInfo(c,'selecao').livres.find(n=>n!==clube);c=escolherCamisa(c,numero,'selecao');sincronizarCamisasSelecao(c,e);assert.equal(c.numero,clube);assert.equal(e.usuario.numero,numero);assert.equal(new Set([numero,...e.jogadores.map(p=>p.numero)]).size,26);assert.ok(e.jogadores.every(p=>p.numero>=1&&p.numero<=26));const antes=structuredClone(e);sincronizarCamisasSelecao(c,e);assert.deepEqual(e,antes);
});
test('transferência e empréstimo reabrem escolha apenas no destino',()=>{
 const c=atleta();const escolhido=escolherCamisa(c,camisaInfo(c).livres[0]);const numero=escolhido.numero;transferir(escolhido,'Ponte Preta');assert.equal(escolhido.camisas.clubes['Ponte Preta'].escolhido,false);assert.equal(escolhido.camisas.clubes.Santos.numero,numero);
 const loan=atleta();loan.contrato.restantes=3;const destino=ofertasEmprestimo(loan)[0].nome;const emprestado=iniciarEmprestimo(loan,destino,1);assert.equal(emprestado.camisas.clubes[destino].escolhido,false);assert.equal(emprestado.clubeNome,'Santos');
});
test('postura tem efeito real e preparação idempotente com bônus limitados',()=>{
 const c=definirPlanoEspaco(atleta(),'aprender');prepararProjetoTemporada(c);assert.ok(c.mod.evolucao>=1.08&&c.mod.evolucao<=1.12);assert.ok(c.mod.shareAdd<0);const antes=structuredClone(c);prepararProjetoTemporada(c);assert.deepEqual(c,antes);assert.throws(()=>definirPlanoEspaco(c,'competir'));
 const risco=definirPlanoEspaco(atleta(),'responsabilidade');prepararProjetoTemporada(risco);const equilibrado=definirPlanoEspaco(atleta(),'competir');prepararProjetoTemporada(equilibrado);assert.ok(risco.mod.shareAdd>equilibrado.mod.shareAdd);assert.ok(risco.mod.shareAdd<=.1);
});
test('fechamento constrói confiança, reputação e capítulo uma vez a partir de fatos',()=>{
 const c=definirPlanoEspaco(atleta(),'responsabilidade'),k={ano:c.ano,clube:c.clubeNome,posicao:'ATA',jogos:30,gols:12,assist:7,nota:7.4,momentos:[{acertou:true,tipo:'copa',decisaoJogo:{acao:'passe',nome:'Apoio'}}]};fecharProjetoTemporada(c,k);assert.equal(k.protagonismo.confiancaDepois,58);assert.ok(k.reputacaoEstilo.some(x=>x.id==='criador'&&x.pontos===7));const antes=structuredClone(c);fecharProjetoTemporada(c,k);assert.deepEqual(c,antes);c.ano++;fecharProjetoTemporada(c,{...k,ano:c.ano,nota:6});assert.equal(c.jornada.espacoClubes.Santos.confianca,46);
});
test('patamares e retrospectiva usam trajetória registrada sem reescrever temporadas',()=>{
 const c=atleta();assert.equal(patamarCarreira(c).id,'primeiro');c.totais.jogos=110;assert.equal(patamarCarreira(c).id,'consolidado');c.fama=80;assert.equal(patamarCarreira(c).id,'estrela');c.idade=34;assert.equal(patamarCarreira(c).id,'veterano');
 c.temporadas=[{clube:'Ponte Preta',ano:2026,jogos:12,numero:27,titulos:[]},{clube:'Santos',ano:2027,jogos:45,titulos:[{tipo:'liga'}]},{clube:'Mirassol',ano:2028,jogos:9,titulos:[]}];const caps=retrospectivaCarreira(c);assert.equal(caps.length,3);assert.equal(caps[0].clube,'Ponte Preta');assert.match(caps[0].texto,/27/);assert.equal(caps[1].clube,'Santos');assert.equal(caps[2].clube,'Mirassol');assert.deepEqual(projetoDoClube('Santos',2026),projetoDoClube('Santos',2027));
});
test('perfil simulado do adversário é estável e dá vantagens pequenas a planos compatíveis',()=>{assert.deepEqual(perfilAdversario('Santos',2026),perfilAdversario('Santos',2027));for(const p of PERFIS_ADVERSARIO){assert.equal(ajustePlanoAdversario(p.bons[0],p),2);assert.equal(ajustePlanoAdversario(p.ruins[0],p),-2);}});
test('troca fora da chegada não altera número durante temporada já iniciada',()=>{let c=atleta();c=escolherCamisa(c,camisaInfo(c).livres[0]);c.lojaAnoEmCurso=c.ano;assert.throws(()=>escolherCamisa(c,camisaInfo(c).livres.find(n=>n!==c.numero)),/entre temporadas/);});
test('camisa do primeiro contrato acompanha escolha sem modificar registros anteriores',()=>{let c=atleta();const m={id:'primeiro:contrato',clube:c.clubeNome,numero:c.numero};c.jornada.memorias=[m];c.jornada.primeiros={contrato:structuredClone(m)};const n=camisaInfo(c).livres.at(-1);c=escolherCamisa(c,n);assert.equal(c.jornada.memorias[0].numero,n);assert.equal(c.jornada.primeiros.contrato.numero,n);});
test('confiança em zero não volta artificialmente para cinquenta no ano seguinte',()=>{const c=definirPlanoEspaco(atleta(),'competir');c.jornada.espacoClubes.Santos.confianca=0;const k={ano:c.ano,clube:'Santos',jogos:20,gols:0,assist:0,nota:6,momentos:[]};fecharProjetoTemporada(c,k);assert.equal(k.protagonismo.confiancaAntes,0);assert.equal(k.protagonismo.confiancaDepois,0);});

test('aposentadoria do dono libera camisa; homenagem aposentando número impede pedidos futuros',()=>{const c=atleta(),n=c.camisas.clubes.Santos.elenco[0].numero;aposentarDonoCamisa(c,n);assert.ok(camisaInfo(c).livres.includes(n));aposentarDonoCamisa(c,n,{retirarNumero:true});assert.ok(!camisaInfo(c).livres.includes(n));c.numeroFavorito=n;c.moral=100;c.torcida.Santos=100;assert.throws(()=>escolherCamisa(c,n),/aposentado/);});

test('save legado já em uma Copa mantém a camisa nacional sem nova escolha no meio do torneio',()=>{const c=atleta();delete c.camisas;delete c.numeroFavorito;c.numero=99;const elenco={usuario:{numero:26},jogadores:Array.from({length:25},(_,i)=>({id:'legado'+i,nome:'Colega '+i,numero:i+1}))};const salvo={v:1,etapa:'copa',c,card:{copa:{jogos:[{res:'V'}],elenco}}};const anterior=globalThis.localStorage;globalThis.localStorage={getItem:()=>JSON.stringify(salvo)};try{const s=carregarRapido();assert.ok(s);assert.equal(s.c.numero,99);assert.equal(s.c.numeroSelecao,26);assert.equal(s.c.camisas.selecao.escolhido,true);assert.equal(new Set([s.card.copa.elenco.usuario.numero,...s.card.copa.elenco.jogadores.map(p=>p.numero)]).size,26);}finally{globalThis.localStorage=anterior;}});
