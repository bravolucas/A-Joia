import {jogosDaEdicao} from '../src/simulacao/mundoVivo.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES,LIGAS} from '../src/dados/data.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {criarMundialAnual,criarMundial32,eCampeaoPrincipal} from '../src/competicoes/mundialRapido.js';
import {dataCopa,criarAgenda,rotuloData} from '../src/competicoes/calendarioCopas.js';
import {temaCopa} from '../src/competicoes/temasCopas.js';
import {criarJogador,jogarTemporada,aplicarMomento,fecharTemporada} from '../src/jogador/rapido.js';
import {prepararCopasJogador,chaveCopaJogador,escolherCopaJogador,concluirEventoJogador} from '../src/jogador/copasJogador.js';
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

test('Modo Rápido disputa ligas externas pela data e termina com os mesmos placares do lote', () => {
 const c=criarJogador({nome:'Calendário',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'LIGAS-EXTERNAS'});
 c.clubeNome='Flamengo';
 c.flags.baseEscolhida=true;
 const lote=jogarTemporada(c).card.classificacoesMundo;
 let {card}=jogarTemporada(c,{copasInterativas:true});
 assert.equal(card.classificacoesMundo.inglaterra,undefined);
 assert.equal(card.calendarioLigasExternas.ligas.inglaterra.progresso<1,true);
 assert.equal(card.calendarioLigasExternas.ligas.argentina,undefined);
 let parcial;
 for(let passos=0;card.calendarioCopas&&passos<250;passos++){
  const p=card.calendarioCopas;
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
  assert.deepEqual(card.classificacoesMundo[liga],lote[liga]);
 }
});
