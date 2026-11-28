import {ajustarEvolucaoObservada, prepararProjetosClubes} from '../src/simulacao/planejamentoLigasRapidas.js';
import {prepararPartidasDeCopa} from '../src/jogador/ligasCalendarioRapido.js';
import {formacaoTecnico, prepararDecisoesLigas} from '../src/jogador/decisoesLigasRapidas.js';
import {jogosDaEdicao} from '../src/simulacao/mundoVivo.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,LIGAS} from '../src/dados/data.js';
import {avancarCopaAutomatica,criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {criarMundialAnual,criarMundial32,eCampeaoPrincipal} from '../src/competicoes/mundialRapido.js';
import {dataCopa,criarAgenda,rotuloData} from '../src/competicoes/calendarioCopas.js';
import {temaCopa} from '../src/competicoes/temasCopas.js';
import {criarJogador,jogarTemporada,aplicarMomento,fecharTemporada} from '../src/jogador/rapido.js';
import {prepararCopasJogador,chaveCopaJogador,escolherCopaJogador,concluirEventoJogador,proximoCompromissoJogador,avancarCalendarioJogador} from '../src/jogador/copasJogador.js';
import * as T from '../src/treinador/tecnico.js';
import {chaveCopaTecnico} from '../src/treinador/copasCarreiraTecnico.js';
const brasil=CLUBES.filter(x=>['brasileirao','serieB'].includes(x.liga));
function proximo(cp){const d=decisaoCopa(cp);return d?escolherCopa(cp,d.chave,d.penaltis?'canto':'pressionar'):continuarCopa(cp);}
test('mata-mata possui confrontos de todos os clubes e adversários seguintes são sobreviventes da chave',()=>{
 for(let s=0;s<60;s++){let c=criarCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:'Flamengo',forcaUsuario:95,clubes:brasil,ano:2030,formato:'mata',seed:'CHAVE-'+s});for(let i=0;c.fase!=='fim'&&i<40;i++){const antes=c;c=proximo(c);if(c.adversario&&!c.resultado)assert.ok(!c.eliminados.includes(c.adversario.nome));if(c.fases.length>antes.fases.length){const fase=c.fases.at(-1);assert.equal(new Set(fase.jogos.flatMap(j=>[j.casa,j.fora])).size,fase.jogos.length*2);}}assert.equal(c.fase,'fim');assert.ok(c.campeao);assert.ok(c.vice);}
});
test('finais nacionais favorecem sobreviventes fortes sem apagar a possibilidade de zebra',()=>{
 const adversarios=[];let campeoesFracos=0;
 for(let s=0;s<160;s++){let c=criarCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:'Flamengo',forcaUsuario:99,clubes:brasil,ano:2030,formato:'mata',seed:'BALANCO-'+s});for(let i=0;c.fase!=='fim'&&i<50;i++){const d=decisaoCopa(c);if(d?.final&&!d.penaltis)adversarios.push(d.forcaAdv);c=proximo(c);}if(CLUBES.find(x=>x.nome===c.campeao)?.forca<75)campeoesFracos++;}
 assert.ok(adversarios.length>50);assert.ok(adversarios.reduce((a,b)=>a+b,0)/adversarios.length>=76);assert.ok(adversarios.filter(x=>x<65).length/adversarios.length<.08);assert.ok(campeoesFracos<40);
 // An underdog remains able to beat a favorite; no forced result or minimum strength in finals.
 const pool=[{nome:'Favorito',forca:90},{nome:'Zebra',forca:55}];let zebras=0;for(let i=0;i<100;i++){const cp=simularCampanhaCopa({nome:'Teste',usuario:'Favorito',forcaUsuario:90,clubes:pool,ano:i,formato:'mata'});if(cp.campeao==='Zebra')zebras++;}assert.ok(zebras>0);
});
test('Libertadores e Champions classificam no mesmo ano para a Intercontinental; competições secundárias não',()=>{
 for(const [nome,usuario] of [['Libertadores','Flamengo'],['Champions League','Real Madrid']]){const vencedor={nome,usuario,campeao:usuario,forcaUsuario:95,ano:2030,seed:'MUNDO-'+nome};assert.ok(eCampeaoPrincipal(vencedor));let c=criarMundialAnual(vencedor);assert.equal(c.tipo,'mundial');assert.equal(c.ano,2030);assert.equal(c.participantes,6);assert.equal(c.roteiroMundial.length,nome==='Libertadores'?3:1);assert.ok(dataCopa(c)>12);for(let i=0;c.fase!=='fim'&&i<30;i++)c=proximo(c);assert.equal(c.fase,'fim');assert.ok(c.campeao);}
 for(const nome of ['Copa Sul-Americana','Europa League','Conference League'])assert.equal(eCampeaoPrincipal({nome,usuario:'A',campeao:'A'}),false);
});
test('Mundial de 32 clubes ocorre em junho/julho, exige título anterior e respeita a propriedade do clube',()=>{
 const base={usuario:'Santos',forcaUsuario:85,ano:2029,seed:'32',historico:[{ano:2027,clube:'Santos',nome:'Libertadores'}]},c=criarMundial32(base);assert.ok(c);assert.equal(c.pool.length,32);assert.equal(c.totalRodadas,3);assert.ok(dataCopa(c)>=6&&dataCopa(c)<8);assert.equal(criarMundial32({...base,usuario:'Ponte Preta'}),null);assert.equal(criarMundial32({...base,ano:2030}),null);assert.equal(criarMundial32({...base,historico:[{ano:2029,clube:'Santos',nome:'Libertadores'}]}),null);
});
for(const clube of ['Mirassol','Flamengo','Real Madrid'])test(`jogador ${clube}: agenda cronológica, reload, eventos, fechamento uma vez`,()=>{
 let c=criarJogador({nome:'Calendário',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'AGENDA-'+clube});c.clubeNome=clube;c.flags.baseEscolhida=true;c.idade=18;
 const r=jogarTemporada(c);let card=prepararCopasJogador(r.c,r.card),data=-99,passos=0;assert.ok(card.calendarioCopas);if(clube!=='Real Madrid')assert.equal(card.estadualEmJogo.tipo,'estadual');assert.throws(()=>fecharTemporada(r.c,card),/calendário/);
 while(card.calendarioCopas&&passos++<250){const p=card.calendarioCopas;assert.ok(p.dataAtual>=data);data=p.dataAtual;if(p.pausa?.tipo==='momento')card=concluirEventoJogador(aplicarMomento(card,true));else if(p.pausa?.tipo==='selecao')card=concluirEventoJogador({...card,copa:{...card.copa,fim:true}});else{const cp=p.campeonatos[p.indice],d=decisaoCopa(cp),chave=chaveCopaJogador(card),op=d?d.penaltis?'canto':'controlar':'continuar',novo=escolherCopaJogador(card,chave,op);assert.deepEqual(novo,escolherCopaJogador(structuredClone(card),chave,op));assert.equal(escolherCopaJogador(novo,chave,op),novo);card=novo;}}
 assert.equal(card.calendarioCopas,null);assert.equal(card.estadualEmJogo,null);assert.ok(passos<250);assert.equal(new Set(card.titulos.map(x=>x.nome)).size,card.titulos.length);const fim=fecharTemporada(r.c,card);assert.equal(fim.c.temporadas.length,1);assert.equal(fecharTemporada(fim.c,card).c,fim.c);
});
test('treinador vê estadual antes da liga, intercala copas e não repete idade ou contagem',()=>{
 let c=T.iniciarCarreiraTecnico({nome:'Técnico',ano:2030,idade:40,aposentado:true,legado:{pontos:500},temporadas:[]});c.tecnico={...c.tecnico,clube:'Flamengo',pais:'Brasil',liga:'brasileirao',clubeInicialEscolhido:true,decisoes:Array(4).fill({}),elenco:90,acompanharJogo:true};c=T.simularTemporadaTecnico(c,()=>.4,{copasInterativas:true,interativo:true});assert.equal(c.tecnico.fase,'resultado');let p=c.tecnico.copasEmJogo;assert.equal(p.campeonatos[p.indice].tipo,'estadual');let data=-99,passos=0;const idade=c.idade;
 while(c.tecnico.copasEmJogo&&passos++<250){p=c.tecnico.copasEmJogo;assert.ok(p.dataAtual>=data);data=p.dataAtual;const cp=p.campeonatos[p.indice],d=decisaoCopa(cp);c=T.resolverCopaEscolhaTecnico(c,chaveCopaTecnico(c.tecnico),d?d.penaltis?'canto':'pressionar':'continuar');}
 assert.equal(c.tecnico.copasEmJogo,null);assert.equal(c.idade,idade);assert.equal(c.tecnico.temporadas.length,1);assert.ok(c.tecnico.temporadas[0].vagasInternacionaisProxima);
});
test('temas diferenciam competições e meses europeus atravessam o ano corretamente',()=>{const nomes=['Libertadores','Copa Sul-Americana','Champions League','Europa League','Conference League','Copa do Brasil','Copa Intercontinental FIFA'];assert.equal(new Set(nomes.map(nome=>temaCopa({nome}).id)).size,nomes.length);assert.equal(rotuloData(-3,2030),'SET 2029');assert.equal(rotuloData(1.2,2030),'JAN 2030');});
test('treinador campeão continental recebe campanha mundial no mesmo ano e não avança outra temporada',async()=>{
 const {aplicarCopaTecnico}=await import('../src/treinador/copasCarreiraTecnico.js');let cp;
 for(let seed=0;seed<100&&!cp;seed++){let p=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:99,clubes:brasil,ano:2030,formato:'mata',seed:`MUNDO-TECNICO-${seed}`});for(let i=0;p.fase!=='fim'&&i<40;i++){const d=decisaoCopa(p);if(d?.final&&!d.penaltis){if(escolherCopa(p,d.chave,'pressionar').campeao==='Flamengo')cp=p;break;}p=proximo(p);}}
 assert.ok(cp);let c={ano:2031,idade:41,tecnico:{ano:2031,clube:'Flamengo',titulos:0,reputacao:70,diretoria:60,torcida:60,temporadas:[{ano:2030,clube:'Flamengo',torneios:[],titulosConquistados:[]}],copasEmJogo:criarAgenda([cp],{ano:2030,clube:'Flamengo'})}};
 c=aplicarCopaTecnico(c,chaveCopaTecnico(c.tecnico),'pressionar');c=aplicarCopaTecnico(c,chaveCopaTecnico(c.tecnico),'continuar');assert.ok(c.tecnico.copasEmJogo.campeonatos.some(x=>x.tipo==='mundial'));assert.equal(c.tecnico.copasEmJogo.ano,2030);
 for(let i=0;c.tecnico.copasEmJogo&&i<40;i++){const p=c.tecnico.copasEmJogo,cp=p.campeonatos[p.indice],d=decisaoCopa(cp);c=aplicarCopaTecnico(c,chaveCopaTecnico(c.tecnico),d?d.penaltis?'canto':'pressionar':'continuar');}
 assert.equal(c.tecnico.copasEmJogo,null);assert.equal(c.ano,2031);assert.equal(c.idade,41);assert.equal(c.tecnico.temporadas.length,1);assert.ok(c.tecnico.temporadas[0].torneios.some(x=>x.tipo==='mundial'&&x.jogosUsuario.length>0));assert.equal(c.tecnico.temporadas[0].titulosConquistados.filter(n=>n==='Libertadores').length,1);
});
test('save anterior sem chave mantém o adversário visível e continua com outros sobreviventes',()=>{
 let cp=criarCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:'Flamengo',forcaUsuario:99,clubes:brasil,ano:2030,formato:'mata',seed:'MIGRAR-CHAVE'});const adversario=cp.adversario.nome;delete cp.quadroMata;delete cp.sobreviventes;delete cp.reservados;const d=decisaoCopa(cp),novo=escolherCopa(cp,d.chave,'pressionar');assert.deepEqual([novo.resultado.jogo.casa,novo.resultado.jogo.fora].sort(),[cp.usuario,adversario].sort(),'o rival da ida permanece o mesmo independentemente do mando');assert.equal(novo.resultado.jogoIda,true);assert.ok(novo.quadroMata.length>1);let c=novo;for(let i=0;c.fase!=='fim'&&i<40;i++)c=proximo(c);assert.ok(c.campeao);assert.notEqual(c.faseUsuario,'Sem adversário elegível');
});

test('Modo Rápido preserva calendário, súmulas e estatísticas após retomar a temporada', () => {
 const c=criarJogador({nome:'Calendário',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'LIGAS-EXTERNAS'});
 c.clubeNome='Flamengo';
 c.flags.baseEscolhida=true;
 const lote=jogarTemporada(c).card.classificacoesMundo;
 let {card}=jogarTemporada(c,{copasInterativas:true});
 assert.equal(card.classificacoesMundo.inglaterra,undefined);
 assert.equal(card.calendarioLigasExternas.ligas.inglaterra.progresso<1,true);
 assert.equal(card.calendarioLigasExternas.ligas.argentina,undefined);
 let parcial;
 for(let passos=0;card.calendarioCopas&&passos<400;passos++){
  const p=card.calendarioCopas;
  // Calendário contínuo: as rodadas do Flamengo entram nas mesmas datas das copas.
  if(proximoCompromissoJogador(card)?.tipo==='liga'){
   const l=card.ligaPropria;
   if(l.indice===Math.floor(l.rodadas.length/2)&&!parcial){
    parcial=card.calendarioLigasExternas.ligas.argentina;
    assert.ok(parcial.classificacao.every(t=>t.jogos>0&&t.jogos<lote.argentina.classificacao[0].jogos));
    card=JSON.parse(JSON.stringify(card));
   }
   card=avancarCalendarioJogador(card,{modo:'pular'});continue;
  }
  if(p.pausa?.id==='metade'){
   parcial=card.calendarioLigasExternas.ligas.argentina;
   assert.ok(parcial.classificacao.every(t=>t.jogos>0&&t.jogos<lote.argentina.classificacao[0].jogos));
   card=JSON.parse(JSON.stringify(card));
  }
  if(p.pausa?.tipo==='momento')card=concluirEventoJogador(aplicarMomento(card,true));
  else if(p.pausa?.tipo==='selecao')card=concluirEventoJogador({...card,copa:{...card.copa,fim:true}});
  else{
   const decisao=decisaoCopa(p.campeonatos[p.indice]);
   card=escolherCopaJogador(card,chaveCopaJogador(card),decisao?decisao.penaltis?'canto':'controlar':'continuar');
  }
 }
 assert.ok(parcial);
 assert.equal(card.calendarioCopas,null);
 assert.equal(card.calendarioLigasExternas,undefined);
 const jogosDaLiga=card.classificacoesMundo.argentina.jogos;
 assert.ok(jogosDaLiga.length>0&&jogosDaLiga.every(j=>j.sumula?.every(Boolean)));
 assert.ok(jogosDaLiga.some(j=>j.sumula.some(f=>f.ausencias.includes('lesão'))));
 assert.ok(jogosDaLiga.some(j=>j.sumula.some(f=>f.ausencias.includes('suspensão'))));
 for(const {sumula} of jogosDaLiga)for(const ficha of sumula){
  const ids=ficha.minutos.filter((_,i)=>i%2===0);
  assert.equal(new Set(ids).size,ids.length);
  assert.equal(ficha.minutos.filter((_,i)=>i%2===1).reduce((total,m)=>total+m,0),ficha.titulares*90);
  assert.ok(ficha.ausencias.every((valor,i)=>i%2===0||valor==='poupado no início'||!ids.includes(ficha.ausencias[i-1])));
 }
 const {jogos: jogosLocais}=card.classificacoesMundo.brasileirao;
 assert.ok(jogosLocais.some(j=>j.casa!=='Flamengo'&&j.fora!=='Flamengo'&&j.sumula));
 assert.ok(jogosLocais.every(j=>(j.casa!=='Flamengo'&&j.fora!=='Flamengo')||!j.sumula));
 const {c:fim}=fecharTemporada(c,card);
 const projeto=fim.mundo.projetosClubes['River Plate'];
 assert.ok(projeto.historico[0].folha>0&&projeto.historico[0].teto>0);
 assert.equal(projeto.historico[0].ano,card.ano);
 const edicao=fim.universo.edicoes.find(e=>e.nome===LIGAS.argentina.nome);
 assert.deepEqual(jogosDaEdicao(edicao).map(j=>j.sumula),jogosDaLiga.map(j=>j.sumula));
 const jogosPorAtleta=new Map();
 for(const {sumula} of jogosDaLiga)for(const ficha of sumula){
  for(let i=0;i<ficha.minutos.length;i+=2){
   const id=ficha.minutos[i];
   jogosPorAtleta.set(id,(jogosPorAtleta.get(id)||0)+1);
  }
 }
 for(const atleta of fim.mundo.jogadores){
  const jogos=atleta.porCompeticao?.find(t=>t.nome===LIGAS.argentina.nome)?.jogos||0;
  assert.equal(jogos,jogosPorAtleta.get(atleta.id)||0);
 }
 for(const liga of Object.keys(lote).filter(liga=>liga!=='brasileirao')){
  assert.deepEqual(card.classificacoesMundo[liga].jogos.map(({casa,fora,rodada})=>[casa,fora,rodada]),
   lote[liga].jogos.map(({casa,fora,rodada})=>[casa,fora,rodada]));
 }
});


test('janela cobre desfalque com empréstimo e técnico ameaçado muda o esquema da equipe',()=>{
 const clubes=Array.from({length:8},(_,i)=>({nome:`Clube ${i}`,liga:'teste',elenco:80-i*2}));
 const [favorito,cedente]=clubes.map(c=>c.nome);
 const elencos={
  [favorito]:[{id:1,nome:'Titular',setor:'ATA',ovr:75},{id:2,nome:'Reserva',setor:'ATA',ovr:64}],
  [cedente]:Array.from({length:6},(_,i)=>({id:i+10,nome:`Atacante ${i}`,setor:'ATA',ovr:75-i})),
 };
 const tecnico={id:'tecnico-anterior',nome:'Treinador anterior',formacao:'4-3-3'};
 const estado={ano:2030,seed:'janela',elencos,tecnicos:{[favorito]:tecnico},
  periodos:{teste:{inicio:1.5,fim:12.05}}};
 const memoria={1:{lesionadoAte:19,minutos:1400}};
 const tabela=new Map(clubes.map((c,i)=>[c.nome,{nome:c.nome,jogos:16,pontos:i*3,saldoGols:0}]));
 const r=prepararDecisoesLigas(estado,memoria);
 r.iniciarRodada('teste',clubes,17,30,tabela);
 assert.notEqual(formacaoTecnico(r.tecnicos[favorito]),'4-3-3');
 assert.equal(r.decisoes.teste.filter(e=>e.tipo==='tecnico'&&e.clube===favorito).length,1);
 assert.ok(r.elencos[favorito].some(p=>p.id===10&&p.emprestado));
 assert.ok(r.elencos[cedente].every(p=>p.id!==10));
 assert.equal(estado.elencos[cedente].length,6);
 const salvo=prepararDecisoesLigas(JSON.parse(JSON.stringify({...estado,...r})),memoria);
 salvo.iniciarRodada('teste',clubes,18,30,tabela);
 assert.equal(salvo.decisoes.teste.filter(e=>e.tipo==='emprestimo').length,1);
 assert.equal(salvo.elencos[favorito].filter(p=>p.id===10).length,1);
 memoria[10]={minutos:90};
 salvo.iniciarRodada('teste',clubes,19,30,tabela);
 memoria[10].minutos=310;
 salvo.iniciarRodada('teste',clubes,21,30,tabela);
 salvo.iniciarRodada('teste',clubes,22,30,tabela);
 const historia=salvo.decisoes.teste.filter(e=>e.historia&&e.clube===favorito);
 assert.deepEqual(historia.map(e=>e.etapa),['contratacao','estreia','sequencia']);
 assert.equal(new Set(historia.map(e=>e.historia)).size,1);
});


test('copa usa lesão da liga, acumula minutos e separa os cartões por competição',()=>{
 const equipe={nome:'Clube A',liga:'teste',elenco:70,ataque:70,defesa:70};
 const estado={seed:'copa-e-liga',equipes:[equipe,{...equipe,nome:'Clube B'}],periodos:{teste:{inicio:1,fim:11}},
  elencos:{'Clube A':[{id:1,setor:'ATA',ovr:90},{id:2,setor:'ATA',ovr:80},{id:3,setor:'ATA',ovr:70}]},
  memoria:{1:{lesionadoAte:3},2:{suspenso:true,minutos:90,carga:30,rodada:1}}};
 const preparo=prepararPartidasDeCopa(estado,8,'Copa');
 const placar=preparo.partida({nome:'Clube A',forca:70},{nome:'Clube B',forca:70},()=>({golsCasa:1,golsFora:0}));
 assert.deepEqual(placar.sumula[0].ausencias,[1,'lesão']);
 assert.ok(placar.sumula[0].minutos.filter((_,i)=>i%2===0).includes(2));
 assert.equal(preparo.memoria[2].suspenso,true);
 assert.ok(preparo.memoria[2].minutos>estado.memoria[2].minutos);
 assert.ok(preparo.memoria[2].carga>estado.memoria[2].carga);
 assert.equal(estado.memoria[2].disciplina,undefined);
});

test('os outros grupos jogam na mesma rodada e o mata-mata automático guarda cada perna separadamente',()=>{
 const clubes=Array.from({length:8},(_,i)=>({nome:`Equipe ${i}`,forca:70+i}));
 const copa=criarCampanhaCopa({nome:'Libertadores',tipo:'continental',usuario:'Equipe 0',forcaUsuario:70,
  clubes,ano:2030,formato:'grupos',seed:'calendario-grupos',agendaIA:true});
 let chamadas=[];
 const partidaIA=(a,b,jogar)=>{chamadas.push([a.nome,b.nome]);return jogar(a,b);};
 const primeira=escolherCopa(copa,decisaoCopa(copa).chave,'controlar',partidaIA);
 assert.equal(Object.values(primeira.jogosOutrosGrupos).flat().length,2);
 assert.equal(chamadas.length,3);
 assert.ok(Object.values(primeira.jogosOutrosGrupos).flat().every(j=>j.rodada===1));

 const fase={...copa,fase:'mata',tamanho:4,
  pendenteIA:{ordem:['Equipe 1','Equipe 2','Equipe 3','Equipe 4'],playoff:false,entradaUsuario:false}};
 chamadas=[];
 const ida=avancarCopaAutomatica(fase,partidaIA);
 assert.equal(ida.fases.length,0);
 assert.equal(ida.idaIA.length,2);
 const mandosIda=chamadas;
 chamadas=[];
 const volta=avancarCopaAutomatica(JSON.parse(JSON.stringify(ida)),partidaIA);
 assert.ok(dataCopa(ida)>dataCopa(fase));
 assert.deepEqual(chamadas,mandosIda.map(([a,b])=>[b,a]));
 assert.equal(volta.fases[0].jogos.length,2);
 assert.ok(volta.fases[0].jogos.every(j=>j.partidas.length===2&&j.vencedor));
 assert.equal(volta.pendenteIA.ordem.length,2);
});


test('minutos observados aceleram o jovem e acesso abre projeto que dura três temporadas',()=>{
 const jovem={idade:20,ovr:65,potencial:78,picoIdade:28,posicao:'ATA'};
 const veterano={...jovem,idade:35};
 assert.ok(ajustarEvolucaoObservada(jovem,4,{minutos:1800,saldo:1200},20)>
  ajustarEvolucaoObservada(jovem,4,{minutos:90,saldo:0},20));
 assert.equal(ajustarEvolucaoObservada(veterano,-2,{minutos:0,saldo:0},20),-3);
 assert.equal(ajustarEvolucaoObservada(jovem,4,undefined,undefined),4);
 const clubes=[{nome:'Promovido'}],jogadores=[{...jovem,clubeNome:'Promovido',salario:10}];
 const perfis={Promovido:{historico:[{ano:2029,movimento:'acesso'}]}};
 const primeiro=prepararProjetosClubes({jogadores},clubes,perfis,2030,{Promovido:240});
 assert.equal(primeiro.Promovido.objetivo,'permanência');
 assert.equal(primeiro.Promovido.ate,2032);
 assert.ok(primeiro.Promovido.teto>primeiro.Promovido.folha);
 const segundo=prepararProjetosClubes({jogadores,projetosClubes:primeiro},clubes,{},2031,{Promovido:100});
 assert.equal(segundo.Promovido.desde,2030);
 assert.equal(segundo.Promovido.objetivo,'permanência');
});
