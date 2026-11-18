import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,LIGAS,ANO_INICIO} from '../src/dados/data.js';
import {estadoInicialClubes,girarLigas} from '../src/comum/lib.js';
import {prepararMundoTemporada,clubesDoCompleto,ligasDoCompleto,creditarCampeoesCalendario,registrarPremioCalendario} from '../src/completo/mundoTemporada.js';
import {estatisticasDasPartidas} from '../src/simulacao/estatisticasMundo.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';
import {registrarAnoHistoria} from '../src/historia/historiaFutebol.js';
const carreira=()=>({codigo:'MUNDO-COMPLETO',idade:24,clube:CLUBES.find(c=>c.nome==='Santos'),estadoClubes:estadoInicialClubes()});
let pronto;
function fixture(){
 if(!pronto){const c=carreira(),jogosLiga=[{rodada:1,casa:'Santos',fora:'Flamengo',golsCasa:2,golsFora:1}],classificacao=[{nome:'Santos',posicao:1,pontos:3},{nome:'Flamengo',posicao:2,pontos:0}],t={nome:'Copa do Brasil',tipo:'copa',campeao:'Santos',vice:'Flamengo',fases:[{fase:'Final',jogos:jogosLiga}]};pronto={c,entrada:{jogosLiga,classificacao,campeaoLiga:true,torneios:[t]},card:prepararMundoTemporada(c,{jogosLiga,classificacao,campeaoLiga:true,torneios:[t]},null)};}
 return structuredClone(pronto);
}
test('outras ligas guardam todos os confrontos e a liga jogada preserva seus resultados',()=>{
 const {card,entrada}=fixture();assert.deepEqual(card.classificacoesMundo.brasileirao.jogos,entrada.jogosLiga);assert.deepEqual(card.classificacoesMundo.brasileirao.classificacao,entrada.classificacao);
 for(const [liga,t] of Object.entries(card.classificacoesMundo)){if(liga==='brasileirao')continue;const n=t.classificacao.length;assert.equal(t.jogos.length,n*(n-1));assert.ok(t.classificacao.every(x=>x.jogos===(n-1)*2));assert.equal(t.classificacao.reduce((a,b)=>a+b.golsPro,0),t.classificacao.reduce((a,b)=>a+b.golsContra,0));}
 assert.equal(card.ano,ANO_INICIO+8);assert.ok(card.classificacoesMundo.inglaterra);
});
test('copa efetivamente jogada não ganha segundo sorteio nem clube controlado joga outro continental',()=>{
 const {card}=fixture();assert.equal(card.torneiosMundo.some(t=>t.nome==='Copa do Brasil'),false);
 assert.equal(card.campeoesCalendarioMundo.find(t=>t.nome==='Copa do Brasil').clube,'Santos');
 for(const t of card.torneiosMundo.filter(t=>t.tipo==='continental'))assert.ok(jogosDaCampanha(t).every(j=>j.casa!=='Santos'&&j.fora!=='Santos'));
});
test('retomada reproduz o calendário e preparar novamente não simula uma segunda vez',()=>{
 const {c,card,entrada}=fixture(),antes=JSON.stringify(c),input=JSON.stringify(entrada);
 assert.deepEqual(prepararMundoTemporada(c,entrada,null),card);assert.equal(JSON.stringify(c),antes);assert.equal(JSON.stringify(entrada),input);
 assert.equal(prepararMundoTemporada(c,card,null),card);
});
test('modo anual preserva a projeção própria sem inventar seus placares antigos',()=>{
 const c=carreira(),card=prepararMundoTemporada(c,{posLiga:5,campeaoLiga:false,copaNacional:{nome:'Copa Nacional',resultado:'Eliminado'}},null);
 assert.equal(card.classificacoesMundo.brasileirao,undefined);assert.ok(card.classificacoesMundo.espanha.jogos.length);assert.equal(card.campeoesCalendarioMundo.some(t=>t.nome===LIGAS.brasileirao.nome),false);
});
test('títulos e história usam o mesmo campeão da classificação e da chave',()=>{
 const {c,card}=fixture(),estado=creditarCampeoesCalendario(c.estadoClubes,card);
 for(const tipo of ['liga','copa'])assert.equal(estado.Santos.palmares[tipo],c.estadoClubes.Santos.palmares[tipo]+1);
 c.campeoesDaTemporada=card.campeoesCalendarioMundo;registrarAnoHistoria(c,card,{modo:'completo'});
 assert.ok(c.historiaFutebol.titulos.find(t=>t.nome===LIGAS.brasileirao.nome).voce);
 const antes=JSON.stringify(c.historiaFutebol);registrarAnoHistoria(c,card,{modo:'completo'});assert.equal(JSON.stringify(c.historiaFutebol),antes);
});
test('divisões atuais entram no cadastro do calendário seguinte',()=>{
 const c=carreira();const outro=CLUBES.find(x=>x.liga==='serieB');c.estadoClubes.Santos.liga='serieB';c.estadoClubes[outro.nome].liga='brasileirao';c.clube={...c.clube,liga:'serieB'};
 assert.equal(ligasDoCompleto(c).Santos,'serieB');const lista=clubesDoCompleto(c,null);assert.equal(lista.find(x=>x.nome==='Santos').liga,'serieB');assert.equal(lista.find(x=>x.nome===outro.nome).liga,'brasileirao');
});
test('acesso e rebaixamento seguem tabelas completas apesar da força ou do sorteio',()=>{
 const estado=estadoInicialClubes(),nomes=liga=>Object.entries(estado).filter(([,c])=>c.liga===liga).map(([nome])=>({nome}));
 const cima=nomes('brasileirao'),baixo=nomes('serieB');
 const vencedores=[baixo[0].nome,baixo[1].nome,baixo[5].nome,baixo[4].nome];
 const r=girarLigas(estado,null,{brasileirao:{classificacao:cima},serieB:{classificacao:baixo,playoffAcesso:{promovidos:vencedores}}});
 for(const x of cima.slice(-4))assert.equal(r.estado[x.nome].liga,'serieB');
 for(const nome of vencedores)assert.equal(r.estado[nome].liga,'brasileirao');
 assert.equal(r.estado[baixo[2].nome].liga,'serieB');
 assert.equal(r.estado[baixo[3].nome].liga,'serieB');
 assert.equal(Object.values(r.estado).filter(c=>c.liga==='brasileirao').length,cima.length);
});
const elenco=clube=>Object.entries({GOL:2,DEF:6,MEI:5,ATA:5}).flatMap(([setor,n])=>Array.from({length:n},(_,i)=>({id:`${clube}-${setor}-${i}`,nome:`${clube} ${setor} ${i}`,clubeNome:clube,posicao:setor==='DEF'?'ZAG':setor==='MEI'?'MC':setor,ovr:i?40:95,carreira:{gols:10,assist:10,jogos:10},gols:99,assist:99,jogos:99})));
test('gols e presenças do usuário ficam na partida certa e reservas não herdam projeções',()=>{
 const antes={jogadores:[...elenco('Santos'),...elenco('Flamengo')]},jogos=[{rodada:1,casa:'Santos',fora:'Flamengo',golsCasa:1,golsFora:0},{rodada:2,casa:'Flamengo',fora:'Santos',golsCasa:0,golsFora:1}];
 const card={ano:2030,ligaId:'brasileirao',clube:'Santos',posicao:'ATA',classificacoesMundo:{brasileirao:{jogos}},porCompeticao:[{nome:LIGAS.brasileirao.nome,gols:1,assist:0}],jogosLista:[{numero:1,casa:true,adversario:'Flamengo',golsMeu:1,golsAdv:0,golsMinha:0},{numero:2,casa:false,adversario:'Flamengo',golsMeu:1,golsAdv:0,golsMinha:1}]};
 const m=estatisticasDasPartidas(structuredClone(antes),antes,card,'test',{zerarSemPartidas:true});
 assert.equal(m.jogadores.filter(p=>p.clubeNome==='Santos').reduce((n,p)=>n+p.gols,0),1);
 assert.equal(m.jogadores.reduce((n,p)=>n+p.jogos,0),42);
 const banco=m.jogadores.filter(p=>p.jogos===0);assert.ok(banco.length);assert.ok(banco.every(p=>p.gols===0&&p.carreira.gols===10));
});
test('prêmio usa identidade do vencedor real e não confunde atletas de mesmo nome',()=>{
 const mundo={temporada:2,historicoBolaDeOuro:[{temporada:1,nome:'Anterior'}],jogadores:[{id:1,nome:'Igual',carreira:{bolasDeOuro:0}},{id:2,nome:'Igual',carreira:{bolasDeOuro:0}}]},r=registrarPremioCalendario(mundo,{id:2,nome:'Igual',clube:'Santos',gols:5,assist:3});
 assert.equal(r.jogadores[0].carreira.bolasDeOuro,0);assert.equal(r.jogadores[1].carreira.bolasDeOuro,1);assert.equal(r.historicoBolaDeOuro[1].id,2);assert.equal(mundo.historicoBolaDeOuro.length,1);assert.equal(registrarPremioCalendario(r,{id:2,nome:'Igual'}),r);
});
import {prepararCopaPersistente} from '../src/completo/copasPersistentes.js';
test('copa de clube da segunda divisão mantém o país e não é simulada outra vez',()=>{
 const c=carreira();c.clube=CLUBES.find(c=>c.liga==='inglaterra2');
 const card={copasPersistentesVersao:1};prepararCopaPersistente(c,card,'copaNacional',70);
 assert.equal(card.campanhasCompletas.copaNacional.nome,'FA Cup');
 const mundo=prepararMundoTemporada(c,{copaNacional:{nome:'Copa Nacional',titulo:false}},null);
 assert.equal(mundo.torneiosMundo.some(t=>t.nome==='FA Cup'),false);
});
test('tabela da segunda divisão vale mesmo quando a elite ainda usa a projeção anual',()=>{
 const estado=estadoInicialClubes(),baixo=Object.entries(estado).filter(([,c])=>c.liga==='serieB').map(([nome])=>({nome}));
 const vencedores=[baixo[0].nome,baixo[1].nome,baixo[5].nome,baixo[4].nome];
 const r=girarLigas(estado,{nome:'Santos',liga:'brasileirao'}, {serieB:{classificacao:baixo,playoffAcesso:{promovidos:vencedores}}});
 for(const nome of vencedores)assert.equal(r.estado[nome].liga,'brasileirao');
 assert.equal(r.estado.Santos.liga,'brasileirao');
});
import {vagasProximaTemporada,aplicarVagaTemporada} from '../src/completo/mundoTemporada.js';
test('vagas continentais usam a temporada anterior do clube, inclusive após transferência',()=>{
 const {c,card}=fixture(),vagas=vagasProximaTemporada(c,card),primeiro=card.classificacoesMundo.inglaterra.classificacao[0].nome;
 assert.equal(vagas[primeiro].competicao,'champions');
 const proxima={...c,idade:c.idade+1,clube:CLUBES.find(x=>x.nome===primeiro),vagasInternacionaisAno:card.ano+1,vagasLigasSimuladas:Object.keys(card.classificacoesMundo),vagasInternacionaisClubes:vagas};
 assert.equal(aplicarVagaTemporada(proxima,{}).continentalPendente.nome,'Champions League');
 proxima.vagasInternacionaisClubes={};assert.equal(aplicarVagaTemporada(proxima,{continentalPendente:{nome:'Sorteado'}}).continentalPendente,null);
});
import {scoreJogadorMundo} from '../src/comum/lib.js';
test('o ranking usa a liga defendida na temporada, mesmo depois de uma transferência',()=>{
 const jogador={ovr:80,gols:20,assist:10,nota:8,liga:'serieB',ligaTemporada:'inglaterra'};
 assert.equal(scoreJogadorMundo(jogador),scoreJogadorMundo({...jogador,liga:'inglaterra',ligaTemporada:undefined}));
});

test('projeção atual não reaproveita a divisão por competição do ano anterior',()=>{
 const antes={jogadores:[{id:1,clubeNome:'Santos',liga:'brasileirao',porCompeticao:[{nome:'Premier League',jogos:20,gols:10}]}]};
 const depois={jogadores:[{...antes.jogadores[0],jogos:30,gols:5,assist:2}]},original=JSON.stringify(depois);
 const r=estatisticasDasPartidas(depois,antes,{ano:2030},'legado',{clubesLegados:['Santos']}).jogadores[0];
 assert.equal(r.porCompeticao,undefined);assert.equal(r.gols,5);assert.equal(r.jogos,30);assert.equal(r.origemEstatisticas,'projecao-legada');assert.equal(JSON.stringify(depois),original);
});
import {artilhariaLiga} from '../src/comum/lib.js';
test('artilharia de save sem divisão por competição usa a liga e o clube defendidos',()=>{
 const mundo={temporada:2,jogadores:[{nome:'Transferido',liga:'inglaterra',ligaTemporada:'brasileirao',clubeNome:'Arsenal',clubeTemporada:'Santos',jogos:30,gols:12,assist:3,temporadaEstatisticas:2}]};
 assert.equal(artilhariaLiga(mundo,'brasileirao',null,'')[0].clube,'Santos');assert.deepEqual(artilhariaLiga(mundo,'inglaterra',null,''),[]);
});
import {ajustarCardNovoClube} from '../src/completo/mundoTemporada.js';
test('transferência antes da estreia troca a liga e remove a chave pertencente ao clube anterior',()=>{
 const c=carreira();c.clube=CLUBES.find(c=>c.nome==='Arsenal');
 const card={copasPersistentesVersao:1,ligaNome:'Brasileirão',continentalPendente:{nome:'Libertadores',formato:'grupo'},campanhasCompletas:{continental:{usuario:'Santos'}},pernasCopas:{},torneios:[]},antes=JSON.stringify(card),novo=ajustarCardNovoClube(c,card);
 assert.equal(novo.ligaId,'inglaterra');assert.equal(novo.ligaNome,LIGAS.inglaterra.nome);assert.equal(novo.ligaMult,LIGAS.inglaterra.mult);assert.equal(novo.continentalPendente.nome,'Champions League');assert.equal(novo.campanhasCompletas,undefined);assert.equal(JSON.stringify(card),antes);
});
test('transferência antes da estreia respeita a vaga continental do clube de destino',()=>{
 const c=carreira();c.clube=CLUBES.find(c=>c.nome==='Arsenal');c.vagasInternacionaisAno=ANO_INICIO+c.idade-16;c.vagasLigasSimuladas=['inglaterra'];c.vagasInternacionaisClubes={};
 assert.equal(ajustarCardNovoClube(c,{continentalPendente:{nome:'Libertadores'}}).continentalPendente,null);
});
test('registro da liga usa seu cadastro atual mesmo quando o card trouxe um nome antigo',()=>{
 const c=carreira();const card=prepararMundoTemporada(c,{ligaNome:'Premier League',ligaMult:99},null);
 assert.equal(card.ligaNome,LIGAS.brasileirao.nome);assert.equal(card.ligaMult,LIGAS.brasileirao.mult);
});

import {sortearAdversario} from '../src/comum/lib.js';
test('sorteio continental funciona sem ano explícito em clubes de continentes diferentes',()=>{
 for(const nome of ['Santos','Arsenal']){
  const c={idade:24,clube:CLUBES.find(x=>x.nome===nome)};
  const adversario=sortearAdversario(c,'continental');assert.equal(typeof adversario,'string');assert.ok(adversario.length);assert.notEqual(adversario,nome);
 }
});
