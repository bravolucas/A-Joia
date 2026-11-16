import test from 'node:test';
import assert from 'node:assert/strict';
import { completarCarenciasMundo } from '../src/comum/lib.js';
import { jogadorDaGestao, mercadoDoMundo, atualizarProjecaoGestao } from '../src/simulacao/elencoUnificado.js';
import { elencoClubeTecnico } from '../src/treinador/mercadoTecnico.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const clubes=[
 {nome:'Equipe A',liga:'brasileirao',forca:68},
 {nome:'Equipe B',liga:'brasileirao',forca:69},
];
const criar=()=>completarCarenciasMundo([],clubes,geradorTecnico('integracao-mercado'));

test('revelações da base são convertidas para gestão com contrato, salário e valor válidos',()=>{
 const jogadores=criar();
 for(const p of jogadores){
   const j=jogadorDaGestao(p);
   assert.equal(j.mundoId,p.id);
   assert.equal(j.qualidade,p.ovr);
   assert.ok(j.contrato>0);
   assert.ok(j.salario>0);
   assert.ok(j.valor>0);
   assert.ok(['GOL','DEF','MEI','ATA'].includes(j.setor));
 }
});

test('consulta ao clube mantém identidade e permite avaliar os atletas da base no mercado',()=>{
 const mundo={jogadores:criar()};
 const c={mundo,tecnico:{gestao:{clube:'Equipe A',elenco:[]}}};
 const elenco=elencoClubeTecnico(c,'Equipe B');
 assert.equal(elenco.length,22);
 for(const j of elenco){
   const original=mundo.jogadores.find(p=>p.id===j.id);
   assert.ok(original);
   assert.equal(j.mundoId,original.id);
   assert.equal(j.clubeVendedor,'Equipe B');
   assert.equal(j.valor,original.valor);
 }
});

test('mercado unificado não oferece jogadores do próprio clube e não duplica atletas',()=>{
 const mundo={jogadores:criar()};
 const gestao={clube:'Equipe A',ano:2030,forcaMercado:68,movimentos:[]};
 const ofertas=mercadoDoMundo(mundo,gestao);
 assert.ok(ofertas.length>0);
 assert.ok(ofertas.every(j=>j.clubeVendedor==='Equipe B'));
 assert.equal(new Set(ofertas.map(j=>j.mundoId)).size,ofertas.length);
});

test('projeção do treinador inclui novos jovens sem perder seus identificadores',()=>{
 const mundo={jogadores:criar()};
 const c={mundo,tecnico:{clube:'Equipe A',gestao:{clube:'Equipe A',ano:2030,forcaMercado:68,cadastroUnificado:1,elenco:[],movimentos:[]}}};
 const atualizado=atualizarProjecaoGestao(c);
 const elenco=atualizado.tecnico.gestao.elenco;
 assert.equal(elenco.length,22);
 assert.deepEqual(elenco.map(j=>j.mundoId).sort((a,b)=>a-b),mundo.jogadores.filter(j=>j.clubeNome==='Equipe A').map(j=>j.id).sort((a,b)=>a-b));
 assert.equal(c.tecnico.gestao.elenco.length,0);
});
