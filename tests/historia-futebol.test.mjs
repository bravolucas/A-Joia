import test from 'node:test';
import assert from 'node:assert/strict';
import {galeriaClube,registrarAnoHistoria,registrarEstatisticasCompeticoes,estatisticasHistoricas,registrarAtletasObservados,lideresObservados,eventosConhecidos} from '../src/historia/historiaFutebol.js';
const taca=(c,nome)=>galeriaClube(c,'Corinthians').tacas.find(t=>t.nome===nome);
test('Corinthians soma 1 Libertadores inicial e a edição da carreira apenas uma vez',()=>{
 const c={temporadas:[{ano:2030,clube:'Corinthians',titulos:[{nome:'Libertadores',tipo:'continental'}],torneios:[{nome:'Libertadores',tipo:'continental',campeao:'Corinthians'}]}],lista:[{ano:2030,clube:'Corinthians',nome:'Libertadores',tipo:'continental'}]};
 assert.equal(taca(c,'Libertadores').total,2);assert.deepEqual(taca(c,'Libertadores').anos,[2030]);assert.deepEqual(galeriaClube(JSON.parse(JSON.stringify(c)),'Corinthians'),galeriaClube(c,'Corinthians'));
});
test('Atlético ganha primeira Champions sem perder as três Europa Leagues; Sevilla não vira heptacampeão da Champions',()=>{
 const c={lista:[{ano:2031,clube:'Atlético Madrid',nome:'Champions League',tipo:'continental'}]};const g=galeriaClube(c,'Atlético Madrid');assert.equal(g.tacas.find(t=>t.nome==='Champions League').total,1);assert.equal(g.tacas.find(t=>t.nome==='Europa League').total,3);assert.equal(g.primeiros[0].ano,2031);
 const s=galeriaClube({},'Sevilla');assert.equal(s.tacas.find(t=>t.nome==='Europa League').total,7);assert.ok(!s.tacas.some(t=>t.nome==='Champions League'&&t.total));
});
test('totais absolutos do modo estendido não são somados outra vez',()=>{
 const c={estadoClubes:{Corinthians:{palmares:{liga:7,copa:3,continental:2,mundial:2}}},lista:[{ano:2030,clube:'Corinthians',nome:'Libertadores',tipo:'continental'}]};assert.equal(taca(c,'Libertadores').total,2);
 delete c.lista;assert.equal(taca(c,'Libertadores').total,2);assert.equal(taca(c,'Libertadores').legado,1);
});
test('registro anual é idempotente, registra outros clubes e faz prevalecer a copa efetivamente jogada',()=>{
 const c={codigo:'HISTORIA',temporadas:[],lista:[]},a={ano:2030,clube:'Atlético Madrid',ligaId:'espanha',torneios:[{nome:'Champions League',tipo:'continental',campeao:'Atlético Madrid'}],titulos:[{nome:'Champions League',tipo:'continental'}]};
 registrarAnoHistoria(c,a);const antes=JSON.stringify(c);registrarAnoHistoria(c,a);assert.equal(JSON.stringify(c),antes);assert.equal(c.historiaFutebol.titulos.filter(t=>t.ano===2030&&t.nome==='Champions League').length,1);assert.equal(c.historiaFutebol.titulos.find(t=>t.nome==='Champions League').clube,'Atlético de Madrid');assert.ok(c.historiaFutebol.titulos.some(t=>t.clube!==a.clube));assert.ok(a.feitosHistoricos.some(t=>t.nome==='Champions League'));
 registrarAnoHistoria(c,{...a,ano:2031});assert.equal(c.historiaFutebol.anos.length,2);
});
test('distribuição por competição conserva jogos, gols e assistências sem transformar placares do time em gols pessoais',()=>{
 const c={posicao:'ATA'},a={jogos:42,gols:17,assist:8,ligaNome:'LaLiga',torneios:[{nome:'Champions League',jogosUsuario:Array(10).fill({golsCasa:0,golsFora:0})}]};registrarEstatisticasCompeticoes(c,a);
 for(const k of ['jogos','gols','assist'])assert.equal(a.porCompeticao.reduce((s,t)=>s+t[k],0),a[k]);const antes=JSON.stringify(a);registrarEstatisticasCompeticoes(c,a);assert.equal(JSON.stringify(a),antes);
});
test('saves antigos ficam parciais; números de seleção usam os acumuladores existentes',()=>{
 const c={nac:'BRA',selecao:{jogos:150,gols:80,assist:20},temporadas:[{ano:2028,clube:'Santos',jogos:30,gols:12,assist:9},{ano:2029,clube:'Real Madrid',jogos:40,gols:20,assist:10,porCompeticao:[{nome:'Champions League',jogos:10,gols:5,assist:2}]}]};
 const d=estatisticasHistoricas(c);assert.equal(d.incompleto,true);assert.equal(d.competicoes[0].gols,5);assert.equal(d.selecao.gols,80);assert.equal(d.referencias.find(x=>x.id==='bra-gols').estado,'Superou na simulação');assert.equal(d.clubes.find(x=>x.nome==='Santos').gols,12);assert.equal(d.competicoes[0].temDefesas,false);
});
test('ranking de atletas acumula sem duplicação anual e respeita o país e a métrica',()=>{
 const c={nome:'Você',nac:'BRA',historiaFutebol:{desde:2030},mundo:{jogadores:[{id:'a',nome:'Rival',nac:'BRA',gols:20,assist:5,jogos:30},{id:'b',nome:'Outro',nac:'ARG',gols:50,assist:30,jogos:40}]}},a={ano:2030,clube:'Santos',gols:10,assist:12,jogos:32};registrarAtletasObservados(c,a);const antes=JSON.stringify(c);registrarAtletasObservados(c,a);assert.equal(JSON.stringify(c),antes);assert.equal(lideresObservados(c,{nac:'BRA'})[0].nome,'Rival');assert.equal(lideresObservados(c,{nac:'BRA',metrica:'assist'})[0].nome,'Você');
});
test('modo completo recupera títulos por temporada com ano derivado da idade',()=>{
 const c={temporadas:[{idade:20,clube:'Corinthians',titulosLista:['Libertadores']}]};assert.equal(eventosConhecidos(c)[0].ano,2029);assert.equal(taca(c,'Libertadores').total,2);
});

test('goleiro registra defesas simuladas de forma estável e mantém totais por competição',async()=>{
 const {simularDefesas}=await import('../src/historia/historiaFutebol.js');const c={posicao:'GOL',codigo:'DEFESAS',attrs:{defesa:85}},a={ano:2030,clube:'Santos',jogos:40,gols:0,assist:1,ligaNome:'Brasileirão',torneios:[{nome:'Libertadores',jogosUsuario:Array(8).fill({})}]};simularDefesas(c,a);assert.ok(a.defesas>40);const total=a.defesas;simularDefesas(c,a);assert.equal(a.defesas,total);registrarEstatisticasCompeticoes(c,a);assert.equal(a.porCompeticao.reduce((s,t)=>s+t.defesas,0),total);
 const b={ano:2030,clube:'Santos',jogos:40};simularDefesas(c,b);assert.equal(b.defesas,total);const atacante={jogos:40};simularDefesas({posicao:'ATA'},atacante);assert.equal(atacante.defesas,undefined);
});
test('partida sem gol da equipe não produz gols nem assistências do atleta na copa',()=>{
 const card={clube:'Santos',jogos:40,gols:30,assist:12,ligaNome:'Brasileirão',torneios:[{nome:'Libertadores',jogosUsuario:Array(6).fill({casa:'Santos',fora:'Rival',golsCasa:0,golsFora:1})}]};registrarEstatisticasCompeticoes({posicao:'ATA'},card);const cp=card.porCompeticao.find(t=>t.nome==='Libertadores');assert.equal(cp.gols,0);assert.equal(cp.assist,0);assert.equal(card.porCompeticao.reduce((s,t)=>s+t.gols,0),30);
});

test('rótulos do modo completo não duplicam o mesmo campeonato',()=>{
 const c={temporadas:[{idade:20,clube:'Corinthians',campeaoLiga:true,ligaNome:'Brasileirão',ligaId:'brasileirao',continental:{titulo:true,nome:'Libertadores'},copaNacional:{titulo:true,nome:'Copa do Brasil'},titulosLista:['Campeão Brasileirão','Campeão da Libertadores','Campeão da Copa Nacional']}]};const g=galeriaClube(c,'Corinthians');assert.equal(g.tacas.find(t=>t.nome==='Brasileirão').total,8);assert.equal(g.tacas.find(t=>t.nome==='Libertadores').total,2);assert.equal(g.tacas.find(t=>t.nome==='Copa do Brasil').total,4);assert.equal(g.eventos.length,3);
});

test('a segunda temporada não apaga os acumulados dos atletas',()=>{
 const c={nome:'Atleta',nac:'BRA',codigo:'CONTINUIDADE',temporadas:[]};const a={ano:2030,clube:'Santos',jogos:30,gols:10,assist:4};registrarAnoHistoria(c,a);registrarAtletasObservados(c,a);const b={...a,ano:2031};registrarAnoHistoria(c,b);registrarAtletasObservados(c,b);assert.equal(c.historiaFutebol.atletas.voce.gols,20);assert.equal(c.historiaFutebol.atletas.voce.assist,8);
});

test('título da Série B do modo completo não vira um Brasileirão de primeira divisão',()=>{
 const c={temporadas:[{idade:22,clube:'Santos',ligaNome:'Brasileirão Série B',campeaoLiga:true,titulosLista:['Campeão Brasileirão Série B']}]};const g=galeriaClube(c,'Santos');assert.equal(g.tacas.find(t=>t.nome==='Brasileirão').total,8);assert.equal(g.tacas.find(t=>t.nome==='Brasileirão Série B').total,1);assert.equal(g.eventos.length,1);
});
