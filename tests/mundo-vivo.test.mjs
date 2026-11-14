import test from 'node:test';
import assert from 'node:assert/strict';
import {avaliarForcaEquipe,avaliarClubeNoMundo} from '../src/simulacao/forcaEquipe.js';
import {registrarMundoVivo,jogosDaEdicao,compactarJogos,forcasDoMundo,historicoAtleta} from '../src/simulacao/mundoVivo.js';
import {simularLigaMundo} from '../src/treinador/classificacoesMundoTecnico.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {serializarCarreira,lerCarreira} from '../src/simulacao/arquivoSave.js';
import {estatisticasDasPartidas} from '../src/simulacao/estatisticasMundo.js';
import {forcaEfetivaClube,gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {criarGestaoTecnico} from '../src/treinador/mercadoTecnico.js';
import {forcaClubeTecnico} from '../src/treinador/tecnico.js';
const plantel=(q=60)=>Object.entries({GOL:3,DEF:8,MEI:8,ATA:5}).flatMap(([setor,n])=>Array.from({length:n},(_,i)=>({id:`${setor}${i}`,setor,qualidade:q,idade:25})));
test('craque, reserva, ausência e atleta fraco têm efeitos proporcionais ao tempo em campo',()=>{
 const base={base:60,elenco:plantel()},craque={posicao:'ATA',ovr:95};
 const titular=avaliarForcaEquipe({...base,usuario:craque}),reserva=avaliarForcaEquipe({...base,usuario:craque,participacao:.2}),ausente=avaliarForcaEquipe({...base,usuario:craque,participacao:0});
 assert.ok(titular.forca>reserva.forca&&reserva.forca>ausente.forca);assert.equal(ausente.forca,avaliarForcaEquipe(base).forca);assert.ok(titular.forca<80);
 assert.ok(avaliarForcaEquipe({...base,usuario:{posicao:'ATA',ovr:40}}).forca<ausente.forca);
 assert.equal(avaliarForcaEquipe({...base,usuario:{...craque,indisponivel:true}}).impactoUsuario,0);
 assert.equal(titular.setores.DEF,ausente.setores.DEF);assert.ok(titular.setores.ATA>ausente.setores.ATA);
});
test('má contratação não ganha força por quantidade; perder titular afeta setor e reservas',()=>{
 const e=plantel(75),base=avaliarForcaEquipe({base:75,elenco:e,completo:true});
 const ruim=avaliarForcaEquipe({base:75,elenco:[...e,{setor:'ATA',qualidade:30}],completo:true});
 assert.equal(ruim.forca,base.forca);
 const craque=[...e,{setor:'ATA',qualidade:95}],bom=avaliarForcaEquipe({base:75,elenco:craque,completo:true});assert.ok(bom.forca>base.forca);
 const semDefesa=avaliarForcaEquipe({base:75,elenco:e.filter(p=>p.setor!=='DEF'),completo:true});assert.ok(semDefesa.forca<base.forca-4);
 assert.ok(Math.abs(avaliarForcaEquipe({base:75,fase:-99}).forca-75)<=1.5);
});
test('modo completo inclui jogador e treinador usa escalação sem premiar contratação ruim',()=>{
 const cl={nome:'Teste',forca:60},c={clube:cl,elenco:plantel().map(p=>({...p,ovr:p.qualidade})),posicao:'ATA',attrs:{velocidade:95,finalizacao:95,passe:95,drible:95,defesa:95,fisico:95},titularidade:100};
 assert.ok(forcaEfetivaClube(c,cl)>forcaEfetivaClube(c,cl,{participacao:0}));
 const t={clube:'Santos',elenco:65,ano:2030,fase:'pretemporada'};t.gestao=criarGestaoTecnico(t);const f=forcaClubeTecnico(t);
 assert.equal(forcaClubeTecnico({...t,gestao:{...t.gestao,elenco:[...t.gestao.elenco,{setor:'ATA',qualidade:30}]}}),f);
});
test('liga registra cada par em ambos os mandos e tabela fecha com os placares',()=>{
 const clubes=['A','B','C','D','E'].map(nome=>({nome,elenco:65})),s=simularLigaMundo(clubes,geradorTecnico('liga'));
 assert.equal(s.jogos.length,20);assert.equal(new Set(s.jogos.map(j=>j.casa+'|'+j.fora)).size,20);
 assert.equal(s.classificacao.reduce((n,t)=>n+t.golsPro,0),s.classificacao.reduce((n,t)=>n+t.golsContra,0));
 for(const t of s.classificacao){assert.equal(t.jogos,8);assert.equal(t.pontos,t.vitorias*3+t.empates);}
 assert.deepEqual(jogosDaEdicao({jogos:compactarJogos(s.jogos)}).map(j=>[j.casa,j.fora,j.golsCasa,j.golsFora]),s.jogos.map(j=>[j.casa,j.fora,j.golsCasa,j.golsFora]));
});
test('arquivo anual é idempotente, guarda colocações e transferências no clube correto',()=>{
 const c={codigo:'arquivo',nome:'Teste',posicao:'ATA',mundo:{jogadores:[{id:1,nome:'Atleta',posicao:'ATA',nac:'BRA',clubeNome:'Milan',jogos:30,gols:12,assist:4}]},historiaFutebol:{titulos:[{ano:2030,nome:'Copa do Brasil',clube:'Santos'}]}};
 const antes={jogadores:[{id:1,clubeNome:'Santos',liga:'brasileirao'}]},a={ano:2030,clube:'Santos',ligaId:'brasileirao',posLiga:2,jogos:30,gols:10,assist:5,classificacoesMundo:{brasileirao:{classificacao:[{nome:'Flamengo',posicao:1},{nome:'Santos',posicao:2}]}}};
 registrarMundoVivo(c,a,{antesMundo:antes});const salvo=JSON.stringify(c);registrarMundoVivo(c,a,{antesMundo:antes});assert.equal(JSON.stringify(c),salvo);
 assert.equal(historicoAtleta(c.universo.atletas['1'])[0].clube,'Santos');assert.equal(historicoAtleta(c.universo.atletas['1'])[0].destino,'Milan');assert.equal(c.universo.clubes.Santos.historico[0].posicao,2);
 assert.deepEqual(lerCarreira(serializarCarreira(c)),JSON.parse(salvo));
});
test('estatísticas principais do mundo conservam gols dos placares e nunca dão gol ao goleiro',()=>{
 const antes={jogadores:['A','B'].flatMap((clube,idx)=>plantel().map((p,i)=>({...p,id:idx*100+i,nome:`${clube}${i}`,posicao:p.setor==='GOL'?'GOL':p.setor==='DEF'?'ZAG':p.setor==='MEI'?'MC':'ATA',ovr:65,clubeNome:clube,carreira:{jogos:0,gols:0,assist:0}})))};
 const depois=structuredClone(antes),card={ano:2030,classificacoesMundo:{brasileirao:{jogos:[{casa:'A',fora:'B',golsCasa:3,golsFora:1}]}}};
 const m=estatisticasDasPartidas(depois,antes,card,'teste');assert.equal(m.jogadores.reduce((s,p)=>s+(p.gols||0),0),4);assert.equal(m.jogadores.reduce((s,p)=>s+(p.jogos||0),0),22);assert.equal(m.jogadores.filter(p=>p.posicao==='GOL').reduce((s,p)=>s+(p.gols||0),0),0);
 assert.ok(m.jogadores.reduce((s,p)=>s+(p.assist||0),0)<=4);assert.deepEqual(estatisticasDasPartidas(depois,antes,card,'teste'),m);
});
test('evolução de atletas e forças é determinística e isolada entre saves',()=>{
 const a=gerarMundoJogadores(geradorTecnico('origem')),b=gerarMundoJogadores(geradorTecnico('origem'));assert.deepEqual(a,b);
 assert.deepEqual(simularTemporadaMundo(a,geradorTecnico('ano')),simularTemporadaMundo(b,geradorTecnico('ano')));
 const c={mundo:a},antes=structuredClone(c);forcasDoMundo(c);assert.deepEqual(c,antes);
 const cl={nome:'Santos',forca:65};assert.equal(avaliarClubeNoMundo({},cl).forca,65);
});
test('o craque aumenta os resultados esperados da equipe ao longo de várias temporadas',()=>{
 const base=avaliarForcaEquipe({base:60,elenco:plantel()}),craque=avaliarForcaEquipe({base:60,elenco:plantel(),usuario:{posicao:'ATA',ovr:95}});
 let golsBase=0,golsCraque=0;
 for(let ano=0;ano<200;ano++)for(const [perfil,tipo]of [[base,'base'],[craque,'craque']]){
  const s=simularLigaMundo([{nome:'Meu time',elenco:perfil.forca,ataque:perfil.ataque,defesa:perfil.defesa},{nome:'Rival',elenco:60}],geradorTecnico(`comparacao|${ano}`));
  const gols=s.classificacao.find(t=>t.nome==='Meu time').golsPro;if(tipo==='base')golsBase+=gols;else golsCraque+=gols;
 }
 assert.ok(golsCraque>golsBase*1.08,`${golsCraque} gols com o craque / ${golsBase} sem ele`);
});
test('virada do treinador não soma de novo a força de um elenco já avaliado',async()=>{
 const {proximaTemporadaTecnico}=await import('../src/treinador/tecnico.js');
 const t={clube:'Santos',liga:'brasileirao',elenco:65,ano:2030,idade:50,fase:'resultado',temporadas:[],diretoria:60,moral:50,torcida:50,personagens:[],forcasMundo:{Santos:90}};t.gestao=criarGestaoTecnico(t);
 const antes=forcaClubeTecnico(t),novo=proximaTemporadaTecnico({idade:50,ano:2030,tecnico:t});
 assert.equal(novo.tecnico.elenco,65);assert.equal(forcaClubeTecnico(novo.tecnico),antes);
});
test('artilharia usa os gols da liga e o clube defendido, mesmo após transferência ou aposentadoria',async()=>{
 const {artilhariaLiga}=await import('../src/comum/lib.js');
 const mundo={temporada:2,jogadores:[{nome:'Artilheiro',liga:'italia',clubeNome:'Milan',clubeTemporada:'Santos',aposentado:true,temporadaEstatisticas:2,gols:30,assist:9,porCompeticao:[{nome:'Brasileirão',gols:12,assist:4},{nome:'Copa do Brasil',gols:18,assist:5}]}]};
 const r=artilhariaLiga(mundo,'brasileirao');assert.equal(r[0].gols,12);assert.equal(r[0].clube,'Santos');assert.equal(artilhariaLiga({...mundo,temporada:3},'brasileirao').length,0);
});
test('cópia rápida preserva o contrato JSON e isola dados mutáveis, compartilhando somente o arquivo imutável',async()=>{
 const {clonarEstado}=await import('../src/simulacao/clonarEstado.js');
 const attrs={passe:70},c={attrs,picoAttrs:attrs,indefinido:undefined,numero:NaN,zero:-0,lista:[undefined,Infinity],data:new Date('2030-01-01T00:00:00Z'),universo:{versao:1,anos:[2030]}};
 const novo=clonarEstado(c);assert.deepEqual(novo,JSON.parse(JSON.stringify(c)));assert.equal(novo.universo,c.universo);
 novo.attrs.passe=90;assert.equal(novo.picoAttrs.passe,70);assert.equal(c.attrs.passe,70);
});
