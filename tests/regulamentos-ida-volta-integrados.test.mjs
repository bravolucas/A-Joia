import test from 'node:test';
import assert from 'node:assert/strict';
import {temIdaVolta,regulamentoConhecidoIdaVolta} from '../src/competicoes/regrasIdaVolta.js';
import {regraDesempateCopa,vencedorPorGolsFora} from '../src/competicoes/desempatePorCompeticao.js';
import {simularCopaNacionalTecnico,simularCopaContinentalTecnico} from '../src/treinador/competicoesTecnico.js';
import {prepararCopaPersistente,registrarJogoPersistente} from '../src/completo/copasPersistentes.js';
import {CLUBES} from '../src/dados/data.js';

const regra=(nome,tamanho,ano=2026)=>temIdaVolta({nome,tamanho,ano});

test('regulamentos não confundem duas partidas com uma partida por fase',()=>{
 const casos=[
 ['Copa do Brasil',2026,64,false],['Copa do Brasil',2026,32,true],
 ['Copa do Brasil',2026,16,true],['Copa do Brasil',2026,8,true],
 ['Copa do Brasil',2026,4,true],['Copa do Brasil',2026,2,false],
 ['Copa do Brasil',2025,32,true],['Copa do Brasil',2025,2,true],
 ['Copa Libertadores',2026,16,true],['Copa Libertadores',2026,2,false],
 ['Copa Sul-Americana',2026,8,true],['Copa Sul-Americana',2026,2,false],
 ['UEFA Champions League',2026,8,true],['UEFA Champions League',2026,2,false],
 ['UEFA Europa League',2026,4,true],['UEFA Europa League',2026,2,false],
 ['UEFA Conference League',2026,16,true],['UEFA Conference League',2026,2,false],
 ['CONCACAF Champions Cup',2026,16,true],['CONCACAF Champions Cup',2026,4,true],
 ['CONCACAF Champions Cup',2026,2,false],
 ['AFC Champions League Elite',2026,16,true],['AFC Champions League Elite',2026,8,false],
 ['AFC Champions League Elite',2026,4,false],['AFC Champions League Elite',2026,2,false],
 ['CONMEBOL Recopa',2026,2,true],['Supercopa do Brasil',2026,2,false],
 ['Copa del Rey',2026,8,false],['Copa del Rey',2026,4,true],['Copa del Rey',2026,2,false],
 ['Coppa Italia',2026,4,true],['Coppa Italia',2026,2,false],
 ['Taça de Portugal',2026,4,true],['Taça de Portugal',2027,4,false],
 ['FA Cup',2026,4,false],['Copa Argentina',2026,4,false],['DFB-Pokal',2026,4,false],
 ['Coupe de France',2026,4,false],['KNVB Beker',2026,4,false],
 ['Türkiye Kupası',2026,4,false],["King's Cup",2026,4,false],['MLS Cup',2026,4,false],
 ['Copa do Mundo',2026,32,false],['Copa Intercontinental FIFA',2026,2,false]
 ];
 for(const [nome,ano,tamanho,esperado] of casos){
  assert.equal(regra(nome,tamanho,ano),esperado,`${nome} edição ${ano} com ${tamanho} equipes`);
  assert.ok(regulamentoConhecidoIdaVolta(nome),`${nome} sem regulamento reconhecido`);
 }
 assert.equal(regulamentoConhecidoIdaVolta('Torneio regional fictício'),false);
 assert.equal(regra('Torneio regional fictício',4),false);
});
const rngDe=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const torneio=(nome,ano,formato={})=>{
 const clubes=Array.from({length:16},(_,i)=>({nome:`Equipe ${i+1}`,pais:'Brasil',forca:50+i*2}));
 return simularCopaNacionalTecnico({
  clubes,nomeUsuario:'Equipe 1',pais:'Brasil',forcaUsuario:56,nome,
  formato:{...formato,ano},rng:rngDe(1337)
 });
};
test('treinador: sinalizador genérico não cria ida/volta na FA Cup nem na final da Copa do Brasil',()=>{
 const fa=torneio('FA Cup',2026,{mataMataIdaVolta:true,finalIdaVolta:true});
 assert.ok(fa.fases.every(f=>f.jogos.every(j=>!j.partidas)));
 const brasil=torneio('Copa do Brasil',2026,{mataMataIdaVolta:true,finalIdaVolta:true});
 assert.ok(brasil.fases.slice(0,-1).every(f=>f.jogos.every(j=>j.partidas?.length===2)));
 assert.ok(!brasil.fases.at(-1).jogos[0].partidas,'2026 tem final única');
 const antigo=torneio('Copa do Brasil',2025,{});
 assert.equal(antigo.fases.at(-1).jogos[0].partidas?.length,2,'final anterior a 2026 com ida e volta');
});
test('treinador: Concacaf usa ida/volta até semifinal, AFC Elite só nas oitavas',()=>{
 const clubes=Array.from({length:16},(_,i)=>({nome:`Equipe ${i+1}`,pais:'Brasil',forca:50+i*2}));
 const base={clubes,nomeUsuario:'Equipe 1',pais:'Brasil',forcaUsuario:63,
  participantesQualificados:clubes,formato:{totalParticipantes:16,grupos:0,ano:2026,mataMataIdaVolta:true},rng:rngDe(123)};
 const conc=simularCopaContinentalTecnico({...base,nome:'CONCACAF Champions Cup'});
 assert.ok(conc.fases.slice(0,-1).every(f=>f.jogos.every(j=>j.partidas?.length===2)));
 assert.equal(conc.fases.at(-1).jogos[0].partidas,undefined);
 const asia=simularCopaContinentalTecnico({...base,nome:'AFC Champions League Elite',rng:rngDe(123)});
 assert.ok(asia.fases[0].jogos.every(j=>j.partidas?.length===2));
 assert.ok(asia.fases.slice(1).every(f=>f.jogos.every(j=>!j.partidas)));
});
const ingles=()=>CLUBES.find(c=>c.liga==='inglaterra');
test('modo completo: copa nacional inglesa não cria ida/volta indevida',()=>{
 const clube=ingles();assert.ok(clube,'necessário clube da liga inglesa');
 const c={nome:'Atleta',idade:25,clube},card={copasPersistentesVersao:1};
 const d=prepararCopaPersistente(c,card,'copaNacional',77);
 assert.ok(d);
 assert.equal(card.campanhasCompletas.copaNacional.nome,'FA Cup');
 const r=registrarJogoPersistente(card,'copaNacional',{
  casa:clube.nome,fora:d.adversario,golsCasa:0,golsFora:6
 });
 assert.equal(r.ida,undefined);
 assert.equal(card.pernasCopas.copaNacional,undefined);
 assert.equal(r.resumo.jogosUsuario.length,1);
 assert.equal(r.resumo.jogosUsuario[0].partidas,undefined);
});
test('modo completo: um jogo de volta já iniciado em save antigo é preservado',()=>{
 const clube=ingles();assert.ok(clube);
 const c={nome:'Save anterior',idade:25,clube},card={copasPersistentesVersao:1};
 const d=prepararCopaPersistente(c,card,'copaNacional',77);
 assert.ok(d);
 card.pernasCopas={copaNacional:{casa:clube.nome,fora:d.adversario,golsCasa:1,golsFora:0}};
 const r=registrarJogoPersistente(card,'copaNacional',{
  casa:d.adversario,fora:clube.nome,golsCasa:4,golsFora:0
 });
 assert.equal(r.ida,undefined);
 assert.equal(r.resumo.jogosUsuario[0].partidas.length,2);
 assert.equal(card.pernasCopas.copaNacional,undefined);
});

test('desempate real: CONMEBOL/CBF vão direto aos pênaltis; UEFA e Recopa usam prorrogação',()=>{
 for(const nome of ['Copa do Brasil','Copa Libertadores','Copa Sul-Americana','Copa Argentina']){
  assert.equal(regraDesempateCopa({nome,tamanho:8,ano:2026}).prorrogacao,false,nome);
 }
 assert.equal(regraDesempateCopa({nome:'Copa do Brasil',tamanho:2,ano:2026}).prorrogacao,false);
 assert.equal(regraDesempateCopa({nome:'Copa Libertadores',tamanho:2,ano:2026}).prorrogacao,true);
 assert.equal(regraDesempateCopa({nome:'CONMEBOL Recopa',tamanho:2,ano:2026}).prorrogacao,true);
 assert.equal(regraDesempateCopa({nome:'UEFA Champions League',tamanho:16,ano:2026}).prorrogacao,true);
 assert.equal(regraDesempateCopa({nome:'CONCACAF Champions Cup',tamanho:8,ano:2026}).golsFora,true);
});
test('Concacaf: gols fora desempata sem contar prorrogação; outros torneios ignoram essa regra',()=>{
 const ida={casa:'A',fora:'B',golsCasa:0,golsFora:0};
 const volta={casa:'B',fora:'A',golsCasa:1,golsFora:1};
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'CONCACAF Champions Cup',tamanho:8}), 'A');
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'Copa Libertadores',tamanho:8}),null);
 assert.equal(vencedorPorGolsFora(ida,volta,{nome:'UEFA Champions League',tamanho:8}),null);
 const idaB={casa:'A',fora:'B',golsCasa:2,golsFora:1};
 const voltaB={casa:'B',fora:'A',golsCasa:1,golsFora:0};
 assert.equal(vencedorPorGolsFora(idaB,voltaB,{nome:'CONCACAF Champions Cup',tamanho:8}),'B');
 const idaIgual={casa:'A',fora:'B',golsCasa:1,golsFora:0};
 const voltaIgual={casa:'B',fora:'A',golsCasa:1,golsFora:0};
 assert.equal(vencedorPorGolsFora(idaIgual,voltaIgual,{nome:'CONCACAF Champions Cup',tamanho:8}),null);
});
