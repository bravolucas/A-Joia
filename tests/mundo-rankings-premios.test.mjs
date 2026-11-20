import test from 'node:test';
import assert from 'node:assert/strict';
import {preencherVagasTecnicos,novoTecnico,pontosTreinador,avaliarTecnicoClube} from '../src/simulacao/tecnicosMundo.js';
import {premiosDaTemporada,notaPremio} from '../src/simulacao/premiosLiga.js';
import {rankingDaFamilia,rankingTreinadores} from '../src/historia/rankings.js';
import {manchetesDoJogador,aplicarManchetesJogador,manchetesDoTecnico} from '../src/jogador/manchetesJogador.js';
import * as R from '../src/jogador/rapido.js';

test('mercado de técnicos: demitido vai para a lista de livres; vaga de clube grande puxa técnico em alta de clube menor',()=>{
 const grande={nome:'Grande',liga:'brasileirao',forca:85},pequeno={nome:'Pequeno',liga:'brasileirao',forca:70};
 const emAlta={...novoTecnico(pequeno,2028,'s'),qualidade:84};
 let demitido=null;for(let i=0;!demitido&&i<20;i++)demitido=avaliarTecnicoClube({...novoTecnico(grande,2026,'s'),desde:2026},{clube:grande,ano:2030,desempenho:-.8,movimento:'rebaixamento',semente:'x'+i}).demitido;
 assert.ok(demitido?.passagens?.some(p=>p.clube==='Grande'),'demissão registra a passagem');
 let puxou=0;
 for(let i=0;i<20;i++){
  const r=preencherVagasTecnicos({tecnicos:{Pequeno:emAlta},livres:[{...demitido,qualidade:60}],vagas:['Grande'],clubes:new Map([['Grande',grande],['Pequeno',pequeno]]),desempenhos:new Map([['Pequeno',.4]]),ano:2030,semente:'m'+i});
  assert.ok(r.tecnicos.Grande&&r.tecnicos.Pequeno,'nenhum clube fica sem técnico');
  if(r.tecnicos.Grande.nome===emAlta.nome){puxou++;assert.notEqual(r.tecnicos.Pequeno.nome,emAlta.nome);assert.ok(r.movimentos.some(m=>m.de==='Pequeno'));}
 }
 assert.ok(puxou>=8,`técnico em alta contratado ${puxou}/20`);
 assert.ok(pontosTreinador({qualidade:70,titulos:[{nome:'Champions League'}]})>pontosTreinador({qualidade:70,titulos:[{nome:'Campeonato Paulista'}]}));
});

test('prêmios da liga: seleção 4-3-3 por posição, revelação até 21 anos, artilheiro e técnico do campeão',()=>{
 const pos=['GOL','LD','ZAG','ZAG','LE','VOL','MC','MEI','PE','PD','ATA','ATA','ZAG','MC'];
 const jogadores=pos.map((p,i)=>({id:i,nome:`J${i}`,posicao:p,idade:i===10?21:28,clubeNome:i%2?'A':'B',porCompeticao:[{nome:'Brasileirão',jogos:30,gols:p==='ATA'?20-i:2,assist:3,cleanSheets:p==='GOL'?12:0}]}));
 const a={ano:2030,classificacoesMundo:{brasileirao:{classificacao:[{nome:'A'},{nome:'B'}]}},porCompeticao:[{nome:'Brasileirão',jogos:30,gols:25,assist:4}]};
 const p=premiosDaTemporada({},a,{jogadores,tecnicos:{A:{nome:'Treinador A'}},usuario:{nome:'Você',posicao:'ATA',idade:20,clube:'A'}})[2030]['Brasileirão'];
 assert.equal(p.xi.length,11);assert.deepEqual(p.xi.map(x=>x.posicao).slice(0,5),['GOL','LD','ZAG','ZAG','LE']);
 assert.equal(p.artilheiro.nome,'Você');assert.ok(p.xi.some(x=>x.voce));assert.equal(p.revelacao.nome,'Você');
 assert.equal(p.tecnico.nome,'Treinador A');assert.equal(notaPremio({setor:'ATA',jogos:3,gols:5}),0,'poucos jogos não premiam');
});

const jogo=(casa,fora,gc,gf,i)=>[casa,fora,gc,gf,i];
test('ranking continental: pontos por jogo e títulos, janela de temporadas e variação de posição',()=>{
 const ed=(ano,campeao,vice,jogos)=>({ano,nome:'Libertadores',campeao,vice,jogos:{nomes:['A','B','C'],partidas:jogos}});
 const c={universo:{edicoes:[ed(2029,'B','A',[jogo(0,1,0,1,1),jogo(1,2,1,0,2)]),ed(2030,'A','C',[jogo(0,1,2,0,1),jogo(0,2,1,1,2)])]}};
 const r=rankingDaFamilia(c,'conmebol');assert.deepEqual(r.anos,[2029,2030]);
 const linha=n=>r.linhas.find(x=>x.nome===n);
 assert.equal(linha('A').posicao,1);assert.equal(linha('A').anterior,2);assert.equal(linha('B').anterior,1);
 assert.equal(linha('A').porAno[2030],2+1+4);
 const t=rankingTreinadores({nome:'Você',tecnico:{clube:'Santos',reputacao:80,temporadas:[{ano:2030,clube:'Santos',titulosConquistados:['Libertadores']}]},universo:{tecnicos:{X:{nome:'Rival',qualidade:60,titulos:[]}}}});
 assert.equal(t[0].voce,true);
});

test('manchetes do jogador mexem na torcida e na moral com limite; técnico recebe manchetes informativas',()=>{
 const c={nome:'Craque',posicao:'ATA',torcida:{Corinthians:50},moral:60};
 const card={clube:'Corinthians',jogos:30,gols:3,nota:6.0,titulos:[],jogosLista:[{adversario:'Palmeiras',golsMinha:1},{adversario:'Santos',golsMinha:0},{adversario:'Botafogo',golsMinha:2}]};
 const m=manchetesDoJogador(c,card);assert.ok(m.some(x=>x.tipo==='classico'));assert.ok(m.some(x=>x.tipo==='crise'));
 aplicarManchetesJogador(c,card,(cc,d)=>{cc.moral+=d;});
 assert.ok(Math.abs(c.torcida.Corinthians-50)<=10);assert.ok(c.moral<60);assert.ok(card.manchetes.length>=2);
 assert.ok(manchetesDoTecnico('Técnico',{clube:'Santos',titulosConquistados:['Copa do Brasil'],cumpriuObjetivo:true}).some(x=>/Copa do Brasil/.test(x.texto)));
});

test('carreira: linha do tempo do clube guarda técnico e artilheiro; prêmios e livres no arquivo',()=>{
 let c=R.criarJogador({nome:'Linha',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'LINHA-TEMPO'});c.clubeNome='Santos';c.flags.baseEscolhida=true;
 const r=R.jogarTemporada(c);r.card.pendente=null;r.card.filaMomentos=[];const f=R.fecharTemporada(r.c,r.card);c=f.c;
 const h=c.universo.clubes.Palmeiras.historico.at(-1);assert.ok(h.tecnico);assert.ok(h.artilheiro?.gols>0);
 assert.ok(Object.values(c.universo.premiosLigas)[0]['Brasileirão'].xi.length===11);
 assert.ok(Array.isArray(c.universo.tecnicosLivres));assert.ok(Array.isArray(f.card.manchetes));
});
