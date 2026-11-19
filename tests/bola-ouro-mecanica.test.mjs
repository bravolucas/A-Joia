import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreBolaDeOuro,scoreJogadorMundo,rankingBolaDeOuro,
  pesoTitulosBolaDeOuro,simularTemporadaMundo,completarCarenciasMundo} from '../src/comum/lib.js';
import {criarJogador,jogarTemporada,fecharTemporada} from '../src/jogador/rapido.js';
import {registrarPremioCalendario} from '../src/completo/mundoTemporada.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

test('títulos contam por importância, sem contar prêmios individuais como taças',()=>{
 const titulos=['liga','continental','copaMundo','estadual','bolaOuro'].map(tipo=>({tipo}));
 assert.equal(pesoTitulosBolaDeOuro(titulos),6.2);
 assert.equal(pesoTitulosBolaDeOuro([[3,2030,'continental','Champions','Clube']]),2);
 assert.equal(pesoTitulosBolaDeOuro(null),0);
});

test('goleiro e defensor podem competir pelo rendimento defensivo',()=>{
 const base={ovr:88,gols:0,assist:1,nota:8.2,ligaMult:1,jogos:40,titulos:2};
 const semDefesas=scoreBolaDeOuro({...base,posicao:'GOL'});
 const goleiro=scoreBolaDeOuro({...base,posicao:'GOL',defesas:150,cleanSheets:20});
 const defensor=scoreBolaDeOuro({...base,posicao:'ZAG'});
 assert.ok(goleiro>semDefesas+25);
 assert.ok(defensor>scoreBolaDeOuro({...base,posicao:'ATA'}));
});

test('atleta da IA recebe bônus apenas por títulos que realmente conquistou na temporada',()=>{
 const jogador={ovr:88,liga:'inglaterra',posicao:'ATA',gols:20,assist:9,nota:8,jogos:36,
   temporadaEstatisticas:3,titulosConquistados:[[2,2028,'continental','Champions','Clube'],
   [3,2029,'liga','Premier League','Clube'],[3,2029,'continental','Champions','Clube']]};
 const pontos=scoreJogadorMundo(jogador);
 const semTitulos=scoreJogadorMundo({...jogador,titulosConquistados:[]});
 assert.equal(pontos-semTitulos,27);
});

test('jogador com menos de dez partidas não ganha Bola de Ouro só pelo overall',()=>{
 const mundo={temporada:1,jogadores:[{id:1,nome:'Concorrente',clubeNome:'Clube',
   liga:'inglaterra',posicao:'ATA',ovr:82,gols:18,assist:5,nota:8,jogos:35}]};
 const eu={clube:'Clube',posicao:'ATA',ovr:99,gols:30,assist:7,nota:9,
   ligaMult:1,jogos:9};
 const ranking=rankingBolaDeOuro(mundo,eu,'Jogador Teste',3);
 assert.equal(ranking.length,1);
 assert.equal(ranking[0].nome,'Concorrente');
});

test('prêmio não é registrado antecipadamente quando o calendário ainda será recalculado',()=>{
 const clubes=[{nome:'Equipe A',liga:'brasileirao',forca:72},
   {nome:'Equipe B',liga:'brasileirao',forca:70}];
 const mundo={temporada:0,jogadores:completarCarenciasMundo([],clubes,geradorTecnico('bo-antes'))};
 const simulado=simularTemporadaMundo(mundo,geradorTecnico('bo-ano'),{
   clubes,ano:2028,registrarPremio:false,
 });
 assert.deepEqual(simulado.historicoBolaDeOuro||[],[]);
 assert.ok(simulado.jogadores.every(j=>(j.premiacoesIndividuais||[]).length===0));
 const candidatos=rankingBolaDeOuro(simulado,null,'',0);
 const final=registrarPremioCalendario(simulado,candidatos[0]?{...candidatos[0],ano:2028}:null);
 assert.equal(final.historicoBolaDeOuro.length,1);
 assert.equal(final.historicoBolaDeOuro[0].nome,candidatos[0].nome);
 assert.equal(final.historicoBolaDeOuro[0].ano,2028);
 assert.equal(registrarPremioCalendario(final,candidatos[0]),final);
});

test('Modo Rápido: registro mundial e rival usam um único campeão por temporada',()=>{
 const c=criarJogador({nome:'Teste Premiação',nac:'BRA',posicao:'ATA',
   personalidade:'equilibrado',origem:'base',pe:'destro',numero:9,
   ritmo:'equilibrado',codigo:'BO-REGRESSAO-2026'});
 const t=jogarTemporada(c),f=fecharTemporada(t.c,t.card);
 const vencedores=(f.c.mundo.historicoBolaDeOuro||[])
   .filter(x=>x.temporada===f.c.mundo.temporada);
 assert.equal(vencedores.length,1);
 assert.equal(vencedores[0].nome,f.card.bola.top[0]?.nome);
 assert.equal(vencedores[0].ano,f.card.ano);
 const premiadosMundo=f.c.mundo.jogadores.filter(j=>(j.premiacoesIndividuais||[])
   .some(r=>r[0]===f.c.mundo.temporada&&r[2]==='bola-de-ouro'));
 const euGanhou=f.card.bola.pos===1;
 const rivalGanhou=f.c.rival?.nome===vencedores[0].nome;
 assert.equal(premiadosMundo.length,euGanhou||rivalGanhou?0:1);
 assert.equal(f.c.rival.titulos.bolaOuro,rivalGanhou?1:0);
 assert.equal(f.c.titulos.bolaOuro,euGanhou?1:0);
 assert.equal(f.card.rival?.bola,
   f.card.bola.top.findIndex(p=>p.nome===f.c.rival.nome)>=0
     ? f.card.bola.top.findIndex(p=>p.nome===f.c.rival.nome)+1
     : f.card.rival?.bola);
 const repetido=fecharTemporada(f.c,f.card);
 assert.equal(repetido.c.mundo.historicoBolaDeOuro.length,f.c.mundo.historicoBolaDeOuro.length);
});
