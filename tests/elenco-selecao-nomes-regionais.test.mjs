import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador} from '../src/jogador/rapido.js';
import {atualizarElencoSelecao} from '../src/jogador/elencoSelecao.js';
import {atualizarGeracaoSelecao} from '../src/jogador/jornadaJogador.js';
import {gerarNomeRegional,origemNomes} from '../src/simulacao/nomesRegionais.js';
import {NACIONALIDADES} from '../src/dados/data.js';

const jogador=nac=>{
 const c=criarJogador({nome:'Atleta usuário',nac,posicao:'ATA',
  personalidade:'disciplinado',origem:'base',pe:'destro',numero:9,
  ritmo:'equilibrado',codigo:'NOMES-SELECAO-2026'});
 c.ano=2030;c.idade=25;
 return c;
};
const pares=nome=>String(nome).split(/\s+/);

test('nomes recém-criados usam o pool linguístico da nacionalidade em 83 seleções',()=>{
 assert.equal(NACIONALIDADES.length,83);
 for(const {id:nac} of NACIONALIDADES){
  const c=jogador(nac),e=atualizarElencoSelecao(c);
  assert.equal(e.nac,nac);
  assert.equal(e.jogadores.length,25,nac);
  assert.equal(new Set(e.jogadores.map(p=>p.id)).size,25,nac);
  assert.equal(new Set(e.jogadores.map(p=>p.nome)).size,25,nac);
  // Testa o nome próprio contra o mesmo catálogo de origem, sem precisar
  // conhecer internamente os arrays de cada idioma ou o número de sobrenomes.
  const catalogo=new Set(Array.from({length:100},(_,i)=>
    pares(gerarNomeRegional(nac,()=>i/100))[0]));
  for(const p of e.jogadores){
   assert.ok(catalogo.has(pares(p.nome)[0]),
    `${nac} (origem ${origemNomes(nac)}): nome regional inválido ${p.nome}`);
   assert.equal(p.ficticio,true);
   assert.ok(p.id.startsWith(`convocado:${nac}:`));
  }
 }
});

test('convocações inglesa, japonesa e coreana não usam a antiga lista fixa brasileira',()=>{
 for(const [nac,nomesEsperados] of [
  ['ENG',['Jack','Harry','Oliver','Charlie','Alfie','Reece','Callum','Mason','Kai','Declan']],
  ['JAP',['Haruto','Ren','Yuto','Daiki','Takumi']],
  ['COR',['Min-jun','Ji-hoon','Seo-jun','Hyun-woo','Jae-hyun']],
 ]){
  const e=atualizarElencoSelecao(jogador(nac));
  assert.ok(e.jogadores.every(p=>nomesEsperados.some(nome=>p.nome.startsWith(nome+' '))),
   nac+' recebeu nome próprio fora do pool regional');
 }
});

test('novo save gera mesmos nomes e métricas com mesma identidade, sem sorteio adicional',()=>{
 const a=atualizarElencoSelecao(jogador('ENG'));
 const b=atualizarElencoSelecao(jogador('ENG'));
 const selecionar=e=>e.jogadores.map(({id,nome,ovr,nascimento,posicao})=>({id,nome,ovr,nascimento,posicao}));
 assert.deepEqual(selecionar(a),selecionar(b));
 assert.deepEqual(a.jogadores.map(x=>x.estatisticas),b.jogadores.map(x=>x.estatisticas));
});

test('nomes de antigos convocados não mudam na progressão para o próximo ano',()=>{
 const c=jogador('ENG'),e=atualizarElencoSelecao(c);
 const jogadorAntigo=e.jogadores[0],id=jogadorAntigo.id;
 jogadorAntigo.nome='Antigo Nome Legado';
 const antes={id,nascimento:jogadorAntigo.nascimento,posicao:jogadorAntigo.posicao};
 c.ano=2031;c.idade=26;
 const atualizado=atualizarElencoSelecao(c),preservado=atualizado.jogadores.find(p=>p.id===id);
 assert.ok(preservado,'atleta antigo ainda deve estar disponível');
 assert.equal(preservado.nome,'Antigo Nome Legado');
 assert.equal(preservado.nascimento,antes.nascimento);
 assert.equal(preservado.posicao,antes.posicao);
 const repetido=atualizarElencoSelecao(c);
 assert.deepEqual(repetido,atualizado);
});


test('XI de geração na jornada tem nomes regionais únicos em todas as seleções',()=>{
 for(const {id:nac} of NACIONALIDADES){
  const c=jogador(nac),j=atualizarGeracaoSelecao(c);
  assert.equal(j.length,11,nac);
  assert.equal(new Set(j.map(p=>p.nome)).size,11,nac);
  assert.equal(new Set(j.map(p=>p.id)).size,11,nac);
  const nomesProprios=new Set(Array.from({length:100},(_,i)=>
   pares(gerarNomeRegional(nac,()=>i/100))[0]));
  for(const p of j){
   assert.ok(nomesProprios.has(pares(p.nome)[0]),`XI ${nac}: ${p.nome}`);
   assert.ok(p.id.startsWith(`selecao:${nac}:`));
  }
 }
});

test('jornada mantém colegas antigos e não muda as idades/IDs na renovação',()=>{
 const c=jogador('JAP');
 let xi=atualizarGeracaoSelecao(c);
 const antigo=xi[0],nomeOriginal='Nome Legado da Copa',nascimento=antigo.nascimento;
 c.jornada.geracao.find(p=>p.id===antigo.id).nome=nomeOriginal;
 c.ano=2031;c.idade=26;
 xi=atualizarGeracaoSelecao(c);
 assert.equal(xi.find(p=>p.id===antigo.id)?.nome,nomeOriginal);
 assert.equal(xi.find(p=>p.id===antigo.id)?.nascimento,nascimento);
 assert.deepEqual(atualizarGeracaoSelecao(c),xi);
});

test('goleadores criados em elencos e na jornada compartilham origem cultural, sem duplicar IDs',()=>{
 const c=jogador('MAR');
 const chamada=atualizarGeracaoSelecao(c);
 const elenco=atualizarElencoSelecao(c);
 const nomes=new Set(Array.from({length:100},(_,i)=>
   pares(gerarNomeRegional('MAR',()=>i/100))[0]));
 assert.ok(chamada.every(p=>nomes.has(pares(p.nome)[0])));
 assert.ok(elenco.jogadores.every(p=>nomes.has(pares(p.nome)[0])));
 assert.equal(new Set(elenco.jogadores.map(p=>p.id)).size,25);
});
