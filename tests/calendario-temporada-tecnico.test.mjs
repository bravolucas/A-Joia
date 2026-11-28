import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../src/treinador/tecnico.js';

function carreira(clube='Flamengo',pais='Brasil',liga='brasileirao'){
 const c=T.iniciarCarreiraTecnico({nome:'Calendário contínuo',ano:2030,idade:40,aposentado:true,legado:{pontos:500},temporadas:[]});
 c.tecnico={...c.tecnico,clube,pais,liga,clubeInicialEscolhido:true,elenco:85,diretoria:95,torcida:80,modoTreinadorRapido:true};
 return T.iniciarCalendarioTecnico(c,null,()=>.4);
}
const jogosDisputados=c=>(c.tecnico.calendarioRecentes||[]).length;

test('calendário contínuo começa a temporada sem simular nenhum jogo',()=>{
 const c=carreira();
 assert.equal(c.tecnico.fase,'calendario');
 assert.equal(c.tecnico.temporadaPausada.indice,0);
 assert.equal(c.tecnico.temporadaPausada.confrontos.length,0);
 assert.equal(c.tecnico.temporadaPausada.datas.length,c.tecnico.temporadaPausada.calendario.length);
 // datas crescentes e dentro do período da liga
 const d=c.tecnico.temporadaPausada.datas;assert.ok(d.every((x,i)=>!i||x>d[i-1]));
 assert.ok(T.proximoCompromissoTecnico(c.tecnico));
 assert.ok(c.tecnico.copasEmJogo?.campeonatos.length>0,'copas entram no mesmo calendário desde o início');
});

test('pular e jogar avançam exatamente uma partida; estratégia escolhida fica registrada',()=>{
 let c=carreira();
 for(let i=0;i<6;i++){
  const antes=jogosDisputados(c),prox=T.proximoCompromissoTecnico(c.tecnico);
  const liga=prox.tipo==='liga'&&!prox.adversario.folga;
  c=T.avancarCalendarioTecnico(c,liga?{modo:'jogar',estrategia:'atacar'}:{modo:'pular'},()=>.4);
  assert.equal(jogosDisputados(c),antes+1);
  if(liga){assert.equal(c.tecnico.temporadaPausada.confrontos.at(-1).intervencao,'atacar');assert.equal(c.tecnico.calendarioRecentes[0].estrategia,'atacar');}
  // o save sobrevive a serializar e recarregar no meio da temporada
  c=JSON.parse(JSON.stringify(c));
 }
});

test('simular até uma data não para no caminho e devolve o jogo naquele dia',()=>{
 let c=carreira();
 const alvo=c.tecnico.temporadaPausada.datas[15];
 c=T.avancarCalendarioTecnico(c,{modo:'ate',data:alvo},()=>.4);
 assert.equal(c.tecnico.fase,'calendario');
 assert.ok(T.proximoCompromissoTecnico(c.tecnico).data>=alvo);
 assert.equal(c.tecnico.temporadaPausada.indice,15);
 // as outras ligas do mundo andaram junto com o calendário
 const ligas=Object.values(c.tecnico.temporadaPausada.mundo.ligas);
 assert.ok(ligas.length>5&&ligas.some(l=>l.classificacao[0].jogos>0));
});

for(const [clube,pais,liga] of [['Flamengo','Brasil','brasileirao'],['Arsenal','Inglaterra','inglaterra']])
test(`temporada inteira pelo calendário fecha liga, copas e mundo (${clube})`,()=>{
 let c=carreira(clube,pais,liga);
 c=T.avancarCalendarioTecnico(c,{modo:'ate',data:Infinity},()=>.4);
 const t=c.tecnico,a=t.temporadas.at(-1);
 assert.equal(t.fase,'resultado');
 assert.equal(t.copasEmJogo,null);
 assert.equal(t.temporadaPausada,null);
 assert.equal(a.jogos,a.confrontos.filter(j=>!j.folga).length);
 assert.ok(a.torneios.length>0);
 assert.ok(a.torneios.every(x=>x.faseUsuario&&x.faseUsuario!=='Em disputa'),a.torneios.map(x=>x.faseUsuario).join());
 for(const x of a.torneios.filter(x=>x.campeao===clube))assert.ok(a.titulosConquistados.includes(x.nome));
 assert.ok(Object.keys(a.classificacoesMundo).length>10);
 assert.equal(t.temporadas.length,1);
});

test('pedido de demissão no meio do calendário registra a temporada interrompida',()=>{
 let c=carreira();
 c=T.avancarCalendarioTecnico(c,{modo:'ate',data:c.tecnico.temporadaPausada.datas[5]},()=>.4);
 const d=T.pedirDemissaoTecnico(c,()=>.4);
 assert.equal(d.tecnico.temporadaPausada,null);assert.equal(d.tecnico.copasEmJogo,null);
 assert.equal(d.tecnico.temporadas.at(-1).interrompida,true);
 assert.equal(d.tecnico.temporadas.at(-1).jogos,5);
});
