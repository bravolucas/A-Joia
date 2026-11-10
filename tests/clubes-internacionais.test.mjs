import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {CLUBES_EUROPEUS_EXTRAS} from '../src/competicoes/clubesEuropeusExtras.js';
import {CLUBES_SULAMERICANOS_EXTRAS,extrasInternacionais,classificacaoInternacionalSul,ampliarParticipantesInternacionais,clubeInternacional} from '../src/competicoes/clubesInternacionais.js';
import {calcularVagasRapidas,clubesParaCopas} from '../src/competicoes/regrasCopasRapidas.js';
import {prepararCopasTecnico} from '../src/treinador/copasCarreiraTecnico.js';
import {prepararCopasJogador} from '../src/jogador/copasJogador.js';
import {criarJogador} from '../src/jogador/rapido.js';
import {sortearAdversario,clubeAtual} from '../src/comum/lib.js';
import {adversarioCopaPorFase} from '../src/treinador/copasEscolha.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

test('adversários extras reais são únicos e não entram em carreira nem copas nacionais',()=>{
 const todos=[...CLUBES_SULAMERICANOS_EXTRAS,...CLUBES_EUROPEUS_EXTRAS];assert.equal(CLUBES_SULAMERICANOS_EXTRAS.length,58);assert.equal(CLUBES_EUROPEUS_EXTRAS.length,162);assert.equal(new Set(todos.map(c=>c.nome)).size,todos.length);
 for(const c of todos){assert.equal(c.extra,true);assert.equal(c.naoJogavel,true);assert.ok(c.forca>=45&&c.forca<=80);assert.ok(!CLUBES.some(x=>x.nome===c.nome));assert.ok(!clubesParaCopas().some(x=>x.nome===c.nome));}
 assert.equal(new Set(CLUBES_SULAMERICANOS_EXTRAS.map(c=>c.pais)).size,8);
});
test('as edições sul-americanas têm vagas por país e um único torneio por clube',()=>{
 for(const ano of [2026,2027,2030]){const vagas=classificacaoInternacionalSul(ano-1,CLUBES),lib=extrasInternacionais('libertadores',ano,CLUBES),sula=extrasInternacionais('sulamericana',ano,CLUBES);assert.ok(lib.length>=24);assert.ok(sula.length>=20);assert.ok(!lib.some(c=>sula.some(x=>x.nome===c.nome)));assert.deepEqual(lib,extrasInternacionais('libertadores',ano,CLUBES));
  for(const pais of ['Bolívia','Peru','Venezuela','Uruguai','Paraguai','Equador','Chile','Colômbia'])assert.ok(lib.some(c=>c.pais===pais),pais);
  for(const c of [...lib,...sula])assert.equal(vagas[c.nome].competicao,lib.includes(c)?'libertadores':'sulamericana');
 }
 assert.notDeepEqual(extrasInternacionais('libertadores',2026,CLUBES).map(c=>c.nome),extrasInternacionais('libertadores',2027,CLUBES).map(c=>c.nome));
});
test('tradicionais europeus participam e mudam de competição conforme a edição',()=>{
 const nomes=['Panathinaikos','Genk','Royal Antwerp','Aberdeen','BATE Borisov','Dinamo Minsk','Austria Viena'];for(const n of nomes)assert.ok(clubeInternacional(n),n);
 const comps=['champions','europa','conference'];const pools=comps.map(comp=>extrasInternacionais(comp,2026,CLUBES));const todos=pools.flat();assert.equal(new Set(todos.map(c=>c.nome)).size,todos.length);assert.ok(pools.every(p=>p.length>=40));
 assert.notDeepEqual(extrasInternacionais('champions',2026).map(c=>c.nome),extrasInternacionais('champions',2027).map(c=>c.nome));
 const ampliado=ampliarParticipantesInternacionais([...pools[0]],'champions',2026,CLUBES);assert.equal(ampliado.length,pools[0].length);
});
test('vagas compartilhadas refletem as federações sul-americanas sem afetar vagas brasileiras',()=>{
 const vagas=calcularVagasRapidas({ano:2025});assert.ok(vagas['Bolívar']);assert.ok(vagas['Universitario de Deportes']);assert.ok(vagas['Deportivo Táchira']);assert.ok(Object.keys(vagas).filter(n=>CLUBES.some(c=>c.nome===n&&c.liga==='brasileirao')).length>=10);
 const propria=classificacaoInternacionalSul(2025,CLUBES);for(const [nome,vaga] of Object.entries(propria))assert.deepEqual(vagas[nome],vaga);
});
test('jogador e treinador recebem o mesmo catálogo internacional nas campanhas',()=>{
 const c=criarJogador({nome:'Continente Vivo',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'CLUBES-EXTRAS'});c.clubeNome='Flamengo';c.ano=2026;c.vagasInternacionaisAno=2026;c.vagasInternacionaisClubes={...calcularVagasRapidas({ano:2025}),Flamengo:{competicao:'libertadores',entrada:'principal',ano:2026}};
 const card={ano:2026,clube:'Flamengo',ovr:90,share:.8,titulos:[],destaques:[]};const preparado=prepararCopasJogador(c,card);const cp=preparado.calendarioCopas.campeonatos.find(x=>x.tipo==='continental');assert.ok(cp.pool.some(x=>x.pais==='Peru'));assert.ok(cp.pool.some(x=>x.pais==='Bolívia'));
 const agenda=prepararCopasTecnico({clube:'Flamengo',liga:'brasileirao',ano:2026,temporadas:[],vagasInicioAno:2026,vagasInicio:c.vagasInternacionaisClubes},90);const tc=agenda.campeonatos.find(x=>x.tipo==='continental');assert.deepEqual(new Set(tc.pool.map(x=>x.nome)),new Set(cp.pool.map(x=>x.nome)));
});
test('modo completo sorteia novos adversários e usa sua força real no jogo',()=>{
 const c={clube:CLUBES.find(c=>c.nome==='Flamengo'),ano:2026};const vistos=new Set();const anterior=Math.random,rng=geradorTecnico('novos-adversarios');try{Math.random=rng;for(let i=0;i<250;i++)vistos.add(sortearAdversario(c,'continental'));}finally{Math.random=anterior;}
 assert.ok([...vistos].some(n=>clubeInternacional(n)?.pais==='Peru'));assert.ok([...vistos].some(n=>clubeInternacional(n)?.pais==='Bolívia'));
 assert.equal(clubeAtual({},'Bolívar').forca,74);assert.equal(clubeAtual({},'Panathinaikos').forca,75);
});
test('catálogo ampliado mantém finais mais fortes, com espaço para zebras',()=>{
 const base=CLUBES.filter(x=>['brasileirao','argentina','sulamericano'].includes(x.liga));const times=ampliarParticipantesInternacionais(base,'libertadores',2026,CLUBES);let inicial=0,final=0,zebras=0;
 for(let i=0;i<150;i++){inicial+=adversarioCopaPorFase(times,'Oitavas',geradorTecnico(`extra|${i}`)).forca;const rival=adversarioCopaPorFase(times,'Final',geradorTecnico(`extra|${i}`));final+=rival.forca;if(rival.forca<75)zebras++;}
 assert.ok(final>inicial+150*2,`${inicial/150} → ${final/150}`);assert.ok(zebras>0&&zebras<60,`${zebras} zebras`);
});
