import test from 'node:test';
import assert from 'node:assert/strict';
import {escalacaoHistoricaTecnico} from '../src/treinador/escalacaoHistoricaTecnico.js';
import {jogosPainelTecnico} from '../src/treinador/painelTecnico.js';
import {simularEtapaTecnico,QUANTIDADE_DECISOES_TECNICO} from '../src/treinador/tecnico.js';

const POSICOES=['GOL','LD','ZAG','ZAG','LE','VOL','MC','MEI','PD','ATA','PE'];
const jogadores=()=>[
 ...POSICOES.map((posicao,i)=>({
   id:'titular-'+i,nome:'Jogador original '+i,posicao,ovr:70+i,
   clubeNome:'Santos',nac:'BRA',idade:24,
 })),
 {id:'reserva-gol',nome:'Goleiro reserva',posicao:'GOL',ovr:59,clubeNome:'Santos',idade:20},
 ...Array.from({length:8},(_,i)=>({id:'reserva-'+i,nome:'Reserva '+i,
   posicao:'MC',ovr:65-i,clubeNome:'Santos',idade:20})),
 {id:'rival',nome:'Jogador rival',posicao:'ATA',ovr:99,clubeNome:'Palmeiras'},
];
const carreira=(formacao='4-3-3')=>({
 nome:'Teste',codigo:'FOLHA-HISTORICA',idade:40,ano:2030,aposentado:true,
 mundo:{jogadores:jogadores()},
 tecnico:{
  clube:'Santos',liga:'brasileirao',modoTreinadorRapido:true,
  formacao,estilo:'equilibrado',elenco:68,moral:55,diretoria:60,torcida:55,
  reputacao:45,fase:'pretemporada',ano:2030,temporadas:[],
  vitorias:0,empates:0,derrotas:0,titulos:0,
  decisoes:Array.from({length:QUANTIDADE_DECISOES_TECNICO},(_,i)=>({id:i})),
 },
});

test('a folha histórica guarda onze atletas reais por posição e banco sem duplicações',()=>{
 const c=carreira(),antes=structuredClone(c);
 const folha=escalacaoHistoricaTecnico(c);
 assert.equal(folha.versao,1);assert.equal(folha.clube,'Santos');
 assert.equal(folha.formacao,'4-3-3');
 assert.equal(folha.titulares.length,11);assert.equal(folha.vagasAbertas,0);
 assert.equal(folha.banco.length,7);
 assert.ok(folha.banco.some(j=>j.id==='reserva-gol'));
 const jogadores=folha.titulares.filter(j=>j.jogador).map(j=>j.jogador);
 const ids=[...jogadores.map(j=>j.id),...folha.banco.map(j=>j.id)];
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(!ids.includes('rival'));
 assert.equal(folha.titulares.find(j=>j.vaga==='ATA').jogador.nome,'Jogador original 9');
 assert.ok(folha.titulares.every(j=>j.jogador?.ovr!=null));
 assert.deepEqual(c,antes);
});

test('nome e clube históricos sobrevivem a transferências, aposentadoria e JSON save',()=>{
 const c=carreira(),folha=structuredClone(escalacaoHistoricaTecnico(c));
 c.mundo.jogadores.find(j=>j.id==='titular-9').clubeNome='Real Madrid';
 c.mundo.jogadores.find(j=>j.id==='titular-9').nome='Nome Novo';
 c.mundo.jogadores.find(j=>j.id==='titular-9').aposentado=true;
 assert.equal(folha.clube,'Santos');
 assert.equal(folha.titulares.find(j=>j.vaga==='ATA').jogador.nome,'Jogador original 9');
 assert.deepEqual(JSON.parse(JSON.stringify(folha)),folha);
 assert.ok(!JSON.stringify(folha).includes('Real Madrid'));
});

test('suspensões, falta de elenco e saves legados não geram atletas fantasmas',()=>{
 const c=carreira(),goleiro=c.mundo.jogadores.find(j=>j.id==='titular-0');
 goleiro.suspenso=true;
 const folha=escalacaoHistoricaTecnico(c);
 assert.equal(folha.vagasAbertas,0,'o goleiro reserva cobre a vaga, sem improvisação');
 assert.equal(folha.titulares[0].jogador.id,'reserva-gol');
 c.mundo.jogadores.find(j=>j.id==='reserva-gol').lesao={jogosRestantes:2};
 const incompleto=escalacaoHistoricaTecnico(c);
 assert.equal(incompleto.vagasAbertas,1);
 assert.equal(incompleto.titulares[0].jogador,null);
 assert.equal(escalacaoHistoricaTecnico({tecnico:c.tecnico,mundo:{jogadores:[]}}),null);
 assert.equal(escalacaoHistoricaTecnico({tecnico:{...c.tecnico,tipoEquipe:'selecao'},mundo:c.mundo}),null);
});

test('calendário preserva escalação do jogo e omite o campo para save antigo',()=>{
 const c=carreira(),folha=escalacaoHistoricaTecnico(c);
 const jogo={rodada:1,nome:'Palmeiras',casa:true,resultado:'V',
  golsPro:2,golsContra:1,escalacao:folha};
 const t={...c.tecnico,andamento:{ano:2030,jogos:1,rodadas:1,
  confrontos:[jogo],vitorias:1,empates:0,derrotas:0,pontos:3}};
 const linhas=jogosPainelTecnico(t);
 assert.equal(linhas.length,1);
 assert.deepEqual(linhas[0].escalacao,folha);
 const antigo=jogosPainelTecnico({...t,andamento:{...t.andamento,
  confrontos:[{...jogo,escalacao:undefined}]}});
 assert.equal(antigo.length,1);
 assert.ok(!Object.hasOwn(antigo[0],'escalacao'));
});

test('simular etapa grava nomes no confronto sem reescrever elenco ou títulos',()=>{
 const c=carreira(),antes=structuredClone(c.mundo);
 const proximo=simularEtapaTecnico(c,()=>0.41);
 const jogos=proximo.tecnico.andamento?.confrontos||
  proximo.tecnico.temporadas?.at(-1)?.confrontos||[];
 const comEscalacao=jogos.filter(j=>!j.folga);
 assert.ok(comEscalacao.length>0);
 for(const j of comEscalacao){
  assert.equal(j.escalacao.titulares.length,11);
  assert.ok(j.escalacao.titulares.some(p=>p.jogador?.nome==='Jogador original 9'));
  assert.equal(j.escalacao.formacao,'4-3-3');
 }
 assert.deepEqual(c.mundo,antes);
 assert.ok(!Object.hasOwn(c.tecnico,'folhaJogo'));
});
