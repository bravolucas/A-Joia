import test from 'node:test';import assert from 'node:assert/strict';
import{criarJogador,jogarTemporada,aplicarMomento,fecharTemporada}from'../rapido.js';
import{atualizarRecordesUniverso,consultarRecordesUniverso}from'../recordesUniverso.js';
import{prepararElencoSelecao,prepararElencoCopa,registrarJogoElenco}from'../elencoSelecao.js';
const clone=x=>JSON.parse(JSON.stringify(x));
function atleta(nac='BRA',posicao='ATA',codigo='CONTINENTAL'){const c=criarJogador({nome:'Lucas Continental',nac,posicao,origem:'base',personalidade:'ascensao',pe:'destro',numero:9,ritmo:'normal',codigo});c.idade=24;c.ano=2028;c.flags.baseEscolhida=true;for(const a of Object.keys(c.attrs)){c.attrs[a]=90;c.potencial[a]=95;}return c;}
test('campanhas continentais têm adversários, placares e estatísticas que fecham, inclusive final por minigame',()=>{
 let finais=0,convocados=0;
 for(const nac of ['BRA','ARG','ENG','ESP'])for(let i=0;i<15;i++){
  let{c,card}=jogarTemporada(atleta(nac,'ATA',`CONT-${nac}-${i}`));while(card.pendente){if(card.pendente.tipo==='selecao')finais++;card=aplicarMomento(card,i%2===0);}
  const t=card.selecao;if(!t?.convocado)continue;convocados++;
  assert.ok(t.partidas.length>=3&&t.partidas.length<=7);assert.equal(t.jogos,t.partidas.length);assert.equal(t.gols,t.partidas.reduce((n,j)=>n+j.gols,0));assert.equal(t.assist,t.partidas.reduce((n,j)=>n+j.assist,0));
  for(const j of t.partidas){assert.notEqual(j.adv.id,nac);assert.equal(j.elenco.jogadores.reduce((n,p)=>n+p.gols,0),j.gp);assert.equal(j.elenco.jogadores.reduce((n,p)=>n+p.minutos,0),990);assert.equal(j.elenco.jogadores.filter(p=>p.titular).length,11);}
  assert.equal(t.elenco.usuario.estatisticasContinentais.gols,t.gols);assert.equal(t.elenco.usuario.estatisticas.jogos,0);const f=fecharTemporada(c,card);assert.equal(f.c.jornada.elencoSelecao.usuario.estatisticasContinentais.gols,t.gols);const salvo=clone(f.c);assert.deepEqual(fecharTemporada(f.c,f.card).c,salvo);
 }
 assert.ok(convocados>30);assert.ok(finais>0);
});
test('goleiro mantém zero gols e estatísticas de Copas e continentais não se misturam',()=>{
 const c=atleta('BRA','GOL'),e=prepararElencoSelecao(c,c.ano,'continentalSelecao','Copa América'),j={fase:0,adv:{id:'ARG'},gp:2,gc:0,res:'V',gols:0,assist:0};registrarJogoElenco(e,j);assert.equal(e.usuario.estatisticas.gols,0);assert.equal(e.usuario.estatisticas.jogos,0);assert.equal(e.usuario.estatisticasContinentais.jogos,1);assert.equal(e.usuario.estatisticasContinentais.semSofrer,1);c.jornada.elencoSelecao=e;c.ano=2030;const copa=prepararElencoCopa(c);assert.equal(copa.usuario.estatisticasContinentais.jogos,1);registrarJogoElenco(copa,{fase:0,adv:{id:'ARG'},gp:0,gc:1,res:'D',gols:0,assist:0});assert.equal(copa.usuario.estatisticas.jogos,1);assert.equal(copa.usuario.estatisticasContinentais.jogos,1);
});
test('recorde pertence ao clube em que a temporada foi jogada, não ao destino da transferência',()=>{
 const c=atleta(),antes={jogadores:[{id:1,clubeNome:'Santos',liga:'brasileirao',aposentado:false}]};c.mundo={jogadores:[{id:1,nome:'Rival observado',clubeNome:'Milan',jogos:30,gols:40,assist:10,nota:8}]};const card={ano:2028,clube:'Santos',ligaId:'brasileirao',jogos:30,gols:10,assist:5,nota:7};atualizarRecordesUniverso(c,card,antes);const b=c.jornada.recordesUniverso;assert.equal(b.clubes['c:Santos'].gols.valor,40);assert.equal(b.clubes['c:Milan'],undefined);assert.equal(b.clubes['c:Santos'].gols.atleta,'Rival observado');
});
test('marcas locais precedem universo e não se repetem ao fechar novamente',()=>{
 const c=atleta();c.clubeNome='Santos';c.temporadas=[{ano:2027,clube:'Santos',ligaId:'brasileirao',jogos:30,gols:10,assist:5,nota:7}];c.mundo={jogadores:[]};const card={ano:2028,clube:'Santos',ligaId:'brasileirao',jogos:30,gols:15,assist:9,nota:8};atualizarRecordesUniverso(c,card,{jogadores:[]});assert.deepEqual([...new Set(card.recordesUniverso.map(r=>r.escopo))],['clube','liga','universo']);assert.equal(consultarRecordesUniverso(c).clube.marcas.gols.valor,15);const salvo=clone(c);atualizarRecordesUniverso(c,card,{jogadores:[]});assert.deepEqual(c,salvo);
});
test('aposentados de anos anteriores e temporadas curtas não criam novas marcas de nota',()=>{
 const c=atleta();c.mundo={jogadores:[{id:1,nome:'Aposentado',jogos:40,gols:100,assist:99,nota:10}]};const card={ano:2028,clube:'Santos',ligaId:'brasileirao',jogos:2,gols:1,assist:0,nota:10};atualizarRecordesUniverso(c,card,{jogadores:[{id:1,aposentado:true,clubeNome:'Santos'}]});assert.deepEqual(c.jornada.recordesUniverso.mundo,{});assert.deepEqual(card.recordesUniverso,[]);
});

test('posturas oferecem pistas imperfeitas, com as três direções e sem tornar defesa automática',async()=>{
 const{lerPosturaCobrador}=await import('../leituraGoleiro.js');let certeiras=0;const posturas=new Set();for(let i=0;i<300;i++){const p=lerPosturaCobrador(i);if(p.pista===p.alvo)certeiras++;posturas.add(p.pista);assert.ok(p.descricao);assert.ok(p.tendencia);}assert.equal(certeiras,240);assert.equal(posturas.size,3);
});
test('metas booleanas do museu também têm progresso explícito e IDs desconhecidos não são inventados',async()=>{
 const{progressoFeitoMuseu}=await import('../museu.js');const c=atleta();assert.deepEqual(progressoFeitoMuseu(c,'memoria-convocacao'),{atual:0,meta:1});c.jornada.primeiros.convocacao={ano:2028,clube:'Seleção'};assert.deepEqual(progressoFeitoMuseu(c,'memoria-convocacao'),{atual:1,meta:1});assert.equal(progressoFeitoMuseu(c,'nao-existe'),null);
});
test('recusar capitania impede atribuição automática na mesma temporada',async()=>{
 const{sortearEvento,resolverEvento}=await import('../rapido.js');const c=atleta();c.clubeNome='Santos';c.idade=28;c.ano=2027;c.torcida.Santos=90;c.temporadas=[2024,2025,2026].map(ano=>({ano,clube:'Santos',jogos:30,gols:10,assist:5,nota:7,ovr:75,titulos:[]}));const ev=sortearEvento(c,{somente:'capitao'});const r=resolverEvento(c,ev,'recusar');assert.equal(r.c.jornada.recusaCapitania.ano,2027);let sim=jogarTemporada(r.c);while(sim.card.pendente)sim.card=aplicarMomento(sim.card,true);const f=fecharTemporada(sim.c,sim.card);assert.notEqual(f.c.jornada.capitao?.clube,'Santos');
});
