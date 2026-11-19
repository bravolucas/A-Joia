import test from 'node:test';
import assert from 'node:assert/strict';
import {prepararGestaoTecnico,negociarElencoTecnico,ofertasPendentesTecnico,gerarOfertasTecnico,elencoClubeTecnico} from '../src/treinador/mercadoTecnico.js';
import {gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

const base=(clube='Flamengo',liga='brasileirao',elenco=86)=>{
 let m=gerarMundoJogadores(geradorTecnico('ofertas'));m=simularTemporadaMundo({...m,anoCalendario:2029},geradorTecnico('ofertas|sim'),{ano:2029});
 return prepararGestaoTecnico({nome:'Treinador',idade:45,ano:2030,mundo:m,tecnico:{clube,liga,elenco,ano:2030,fase:'pretemporada',temporadas:[],personagens:[],reputacao:50,moral:50,diretoria:60,torcida:50}});
};
const atleta=(c,id)=>c.mundo.jogadores.find(p=>String(p.id)===String(id));

test('clubes da IA fazem ofertas realistas e estáveis pelos atletas do treinador',()=>{
 const c=base(),g=c.tecnico.gestao,ofertas=ofertasPendentesTecnico(g);
 assert.equal(g.ofertas.ano,g.ano);
 for(const o of ofertas){
  assert.notEqual(o.clube,g.clube);assert.ok(['definitiva','emprestimo'].includes(o.tipo));
  if(o.tipo==='definitiva'){assert.ok(o.valor>0);assert.ok(o.valor<=o.valorMercado*1.31,'proposta espontânea com ágio limitado');}
 }
 assert.deepEqual(prepararGestaoTecnico(JSON.parse(JSON.stringify(c))),c,'recarregar não sorteia novas ofertas');
 assert.deepEqual(gerarOfertasTecnico(c),gerarOfertasTecnico(c));
});

test('listar atrai ofertas abaixo do valor; aceitar vende, credita e registra a transferência',()=>{
 let c=base();const g=c.tecnico.gestao,j=g.elenco.find(x=>x.setor==='MEI'&&x.idade>=24);
 c=negociarElencoTecnico(c,'lista',j.mundoId);assert.equal(c.tecnico.avisoGestao.erro,false);
 assert.ok(c.tecnico.gestao.listaTransferencia.includes(String(j.mundoId)));
 assert.deepEqual(c.mundo.gestoesClubes[g.clube].listaTransferencia,c.tecnico.gestao.listaTransferencia);
 const ofertas=ofertasPendentesTecnico(c.tecnico.gestao).filter(o=>String(o.mundoId)===String(j.mundoId));
 assert.ok(ofertas.length>=1,'jogador listado recebe proposta');
 const o=ofertas.find(x=>x.tipo==='definitiva');assert.ok(o);assert.ok(o.valor<=j.valor,'lista de transferências deprecia o preço');
 const saldo=c.tecnico.gestao.saldo;c=negociarElencoTecnico(c,'oferta-aceitar',o.id);
 assert.equal(c.tecnico.avisoGestao.texto,'Negócio fechado.');assert.equal(c.tecnico.gestao.saldo,saldo+o.valor);
 const p=atleta(c,j.mundoId);assert.equal(p.clubeNome,o.clube);assert.deepEqual(p.movimentos.at(-1),{ano:g.ano,tipo:'venda',de:g.clube,para:o.clube,valor:o.valor,moeda:'EUR'});
 assert.equal(c.mundo.transferencias.at(-1).para,o.clube);assert.equal(c.mundo.transferencias.at(-1).valor,o.valor);
 assert.ok(!ofertasPendentesTecnico(c.tecnico.gestao).some(x=>String(x.mundoId)===String(j.mundoId)),'outras ofertas pelo mesmo atleta encerram');
});

test('recusar encerra a oferta e contraproposta tem uma única resposta',()=>{
 let c=base();const ofertas=ofertasPendentesTecnico(c.tecnico.gestao);assert.ok(ofertas.length);
 const r=negociarElencoTecnico(c,'oferta-recusar',ofertas[0].id);
 assert.ok(!ofertasPendentesTecnico(r.tecnico.gestao).some(o=>o.id===ofertas[0].id));
 const definitiva=ofertas.find(o=>o.tipo==='definitiva');assert.ok(definitiva);
 const contra=negociarElencoTecnico(c,'oferta-contra',definitiva.id,1.15),depois=contra.tecnico.gestao.ofertas.itens.find(o=>o.id===definitiva.id);
 if(depois.contraproposta==='aceita'){assert.equal(depois.valor,Math.round(definitiva.valor*1.15));assert.equal(depois.status,'pendente');
  assert.equal(negociarElencoTecnico(contra,'oferta-contra',definitiva.id,1.3).tecnico.avisoGestao.erro,true);}
 else assert.equal(depois.status,'retirada');
});

test('empréstimo de entrada: jovem reserva chega sem taxa e volta ao dono após a temporada',()=>{
 let c=base();const g=c.tecnico.gestao;
 const clubes=[...new Set(c.mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome&&p.clubeNome!==g.clube).map(p=>p.clubeNome))];
 let alvo=null;for(const cl of clubes){alvo=elencoClubeTecnico(c,cl).find(j=>j.emprestavel&&j.salario<300);if(alvo)break;}
 assert.ok(alvo,'há jovens reservas emprestáveis');
 const saldo=g.saldo;c=negociarElencoTecnico(c,'emprestimo',alvo.id);assert.equal(c.tecnico.avisoGestao.erro,false,c.tecnico.avisoGestao.texto);
 assert.equal(c.tecnico.gestao.saldo,saldo,'sem taxa');
 const p=atleta(c,alvo.id);assert.equal(p.clubeNome,g.clube);assert.equal(p.emprestimo.dono,alvo.clubeVendedor);
 assert.equal(c.tecnico.gestao.elenco.find(j=>String(j.mundoId)===String(alvo.id)).emprestimo.dono,alvo.clubeVendedor);
 assert.equal(negociarElencoTecnico(c,'lista',alvo.id).tecnico.avisoGestao.erro,true,'emprestado não pode ser listado');
 const depois=simularTemporadaMundo(c.mundo,geradorTecnico('volta'),{ano:2030,clubeControlado:g.clube});
 const volta=depois.jogadores.find(x=>String(x.id)===String(alvo.id));
 if(!volta.aposentado){assert.equal(volta.clubeNome,alvo.clubeVendedor);assert.equal(volta.emprestimo,undefined);assert.equal(volta.movimentos.at(-1).tipo,'retornoEmprestimo');}
});

test('titular de clube bem maior não é negociável e o preço pedido tem ágio sobre o valor',()=>{
 const c=base('Confiança','serieC',51);
 const grande=elencoClubeTecnico(c,'Real Madrid');assert.ok(grande.length);
 assert.ok(grande.some(j=>j.titular&&j.negociavel===false));
 const r=negociarElencoTecnico(c,'compra',grande.find(j=>j.negociavel===false).id);
 assert.equal(r.tecnico.avisoGestao.erro,true);assert.match(r.tecnico.avisoGestao.texto,/não negocia/);
 assert.ok(grande.every(j=>j.valor>=j.valorMercado));
});
