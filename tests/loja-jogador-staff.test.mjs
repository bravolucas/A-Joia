import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,comprarInvestimento,resumoEfeitosLoja,multaEfetiva,caminhoSelecao,interesseMercado} from '../src/jogador/rapido.js';
import {comprarUpJogador,precoItemJogador,impedimentoLojaJogador,sugestoesDoMomento,progressoAssinatura,DEPARTAMENTOS_JOGADOR} from '../src/jogador/lojaJogador.js';
import {CATALOGO_LOJA_JOGADOR} from '../src/jogador/rapido.js';
import '../src/jogador/jornadaJogador.js';

const base=(extra={})=>({...criarJogador({nome:'Staff',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:9,ritmo:'normal',codigo:'LOJA-STAFF'}),patrimonio:50000,...extra});
const efeito=(c,k)=>resumoEfeitosLoja(c).find(e=>e.chave===k).valor;
const item=id=>CATALOGO_LOJA_JOGADOR.find(i=>i.id===id);

test('staff sobe por níveis, cobra só o degrau e conta apenas o nível mais alto',()=>{
 let c=base();
 assert.equal(impedimentoLojaJogador(c,item('dep-saude-2')),'Requer o nível anterior');
 const r1=comprarInvestimento(c,'dep-saude-1');assert.ok(r1.ok);c=r1.c;
 assert.equal(efeito(c,'lesaoMult'),.95);
 const antes=c.patrimonio,r2=comprarInvestimento(c,'dep-saude-2');assert.ok(r2.ok);c=r2.c;
 assert.equal(antes-c.patrimonio,precoItemJogador(c,item('dep-saude-2')));
 assert.equal(efeito(c,'lesaoMult'),.88,'o nível 1 não se soma ao nível 2');
 assert.equal(DEPARTAMENTOS_JOGADOR.length,18);
});

test('preço do staff acompanha o salário com piso acessível',()=>{
 const jovem=base({contrato:{clube:'Santos',salario:13}}),estrela=base({contrato:{clube:'Santos',salario:9000}});
 assert.equal(precoItemJogador(jovem,item('dep-mente-1')),7);
 assert.equal(precoItemJogador(estrela,item('dep-mente-1')),4500);
 assert.equal(precoItemJogador(jovem,item('dep-mente-3')),500);
});

test('efeitos somados respeitam os tetos',()=>{
 let c=base({investimentos:['personal','fisio','recuperacao-pro','kit-sono','recuperacao-casa','dep-saude-3']});
 c=comprarUpJogador(c,'up-fisio').c;
 assert.equal(efeito(c,'lesaoMult'),.65);
 assert.ok(resumoEfeitosLoja(c).find(e=>e.chave==='lesaoMult').noTeto);
 c=base({investimentos:['ct','equipamento','academia-casa','dep-tecnico-3']});c=comprarUpJogador(c,'up-evolucao').c;
 assert.equal(efeito(c,'evolucao'),1.2);
});

test('ações de uso único: torcida, adaptação de posição e advogado de contrato',()=>{
 let c=base();c.contrato={...c.contrato,clube:c.clubeNome,papel:'titular'};
 const t0=c.torcida[c.clubeNome]??30,r=comprarInvestimento(c,'acao-torcida');assert.ok(r.ok);
 assert.equal(r.c.torcida[c.clubeNome],t0+6);assert.ok(!r.c.investimentos.includes('acao-torcida'));
 assert.equal(comprarInvestimento(r.c,'acao-torcida').ok,false,'uma vez por temporada');
 c.jornada={transicao:{restantes:2,penalidade:4}};
 const p=comprarInvestimento(c,'treino-posicao');assert.ok(p.ok);assert.equal(p.c.jornada.transicao.restantes,1);
 assert.equal(comprarInvestimento(p.c,'treino-posicao').ok,false);
 const a=comprarInvestimento(c,'advogado-contrato');assert.ok(a.ok);assert.equal(a.c.contrato.clausulaTempoJogo,true);
 const k=a.c.contrato,cheio=k.multa;
 assert.equal(multaEfetiva({...a.c,temporadas:[{clube:k.clube,share:.9}]}),cheio);
 assert.ok(multaEfetiva({...a.c,temporadas:[{clube:k.clube,share:.3}]})<cheio);
});

test('mentor técnico soma uma temporada na assinatura em andamento',()=>{
 const c=base({jornada:{assinaturas:{decisivo:{anos:[2030]}}}});
 const r=comprarInvestimento(c,'mentor-tecnico');assert.ok(r.ok);
 assert.equal(progressoAssinatura(r.c.jornada.assinaturas.decisivo),2);
 assert.equal(comprarInvestimento(r.c,'mentor-tecnico').ok,false);
});

test('UPs de seleção e olheiro mexem na convocação e no mercado',()=>{
 const c=base({idade:22}),sel=comprarUpJogador(c,'up-selecao').c;
 assert.equal(caminhoSelecao(sel).corte,caminhoSelecao(c).corte-1);
 assert.equal(comprarUpJogador({...c,idade:17},'up-selecao').ok,false);
 const olho=comprarUpJogador(c,'up-olheiro').c;
 assert.ok(interesseMercado(olho).length>=interesseMercado(c).length);
});

test('sugestões do momento seguem os alertas do perfil',()=>{
 const c=base({moral:20});
 const s=sugestoesDoMomento(c,CATALOGO_LOJA_JOGADOR,[{titulo:'Moral baixa'},{titulo:'Torcida ainda desconfiada'}],i=>impedimentoLojaJogador(c,i));
 assert.deepEqual(s.map(x=>x.item.id),['dep-mente-1','acao-torcida']);
});
