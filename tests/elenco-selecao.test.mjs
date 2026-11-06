import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,jogarCopa,opcoesCopa,aplicarMomento,fecharTemporada} from '../rapido.js';
import {atualizarElencoSelecao,prepararElencoCopa,registrarJogoElenco,forcaElencoCopa,consolidarElencoCopa} from '../elencoSelecao.js';
import {compararMarcasCopas} from '../recordesHistoricos.js';
import {extrairConquistasMuseu,progressoFeitoMuseu} from '../museu.js';
const copiar=x=>JSON.parse(JSON.stringify(x));
function atleta(posicao='ATA',codigo='ELENCO'){
 const c=criarJogador({nome:'Lucas Copa',nac:'BRA',posicao,personalidade:'ascensao',origem:'base',pe:'destro',numero:11,ritmo:'normal',codigo});c.idade=25;c.ano=2030;c.clubeNome='Santos';c.flags.baseEscolhida=true;for(const k of Object.keys(c.attrs)){c.attrs[k]=92;c.potencial[k]=95;}return c;
}
test('26 vagas únicas em todas as posições e renovação preserva os atletas elegíveis',()=>{
 for(const posicao of ['GOL','ZAG','VOL','MC','MEI','ME','MD','LD','LE','ALE','ALD','PE','PD','SA','ATA']){
  const c=atleta(posicao),e=atualizarElencoSelecao(c),todos=[e.usuario,...e.jogadores];assert.equal(todos.length,26);assert.equal(new Set(todos.map(p=>p.numero)).size,26);assert.equal(new Set(todos.map(p=>p.id)).size,26);assert.equal(new Set(todos.map(p=>p.nome)).size,26);
  const antes=copiar(e);assert.deepEqual(atualizarElencoSelecao(c),antes);
  const id=e.jogadores[0].id;e.jogadores[0].nascimento=1990;c.ano=2034;c.idade=29;const novo=atualizarElencoSelecao(c);assert.ok(!novo.jogadores.some(p=>p.id===id));assert.ok(novo.aposentados.some(p=>p.id===id));assert.ok(novo.jogadores.some(p=>antes.jogadores.slice(1).some(a=>a.id===p.id)));
 }
});
test('mudança de função e de seleção não repete IDs ou herda estatísticas do país anterior',()=>{
 const c=atleta();atualizarElencoSelecao(c);c.posicao='MC';const e=atualizarElencoSelecao(c);assert.equal(new Set(e.jogadores.map(p=>p.id)).size,25);e.usuario.estatisticas.gols=9;c.nac='ARG';assert.equal(atualizarElencoSelecao(c).usuario.estatisticas.gols,0);
});
test('placares, assistências, minutos e escalação fecham tanto para titular quanto reserva',()=>{
 for(const titular of [true,false])for(const posicao of ['GOL','ZAG','MC','ATA'])for(const gp of [0,1,4,9]){
  const e=prepararElencoCopa(atleta(posicao)),j={fase:0,adv:{id:'ARG'},gp,gc:1,res:'V',gols:posicao==='GOL'?0:Math.min(gp,1),assist:gp>1?1:0};
  registrarJogoElenco(e,j,{titular});const l=j.elenco.jogadores;
  assert.equal(l.filter(p=>p.titular).length,11);assert.ok(l.filter(p=>!p.titular).length<=5);assert.equal(l.reduce((s,p)=>s+p.minutos,0),990);assert.equal(l.reduce((s,p)=>s+p.gols,0),gp);assert.ok(l.reduce((s,p)=>s+p.assist,0)<=gp);assert.ok(j.elenco.gols.every(g=>g.marcadorId!==g.assistenteId));assert.equal(l.find(p=>p.id==='usuario').gols,j.gols);
  const antes=copiar(e);registrarJogoElenco(e,j,{titular});assert.deepEqual(e,antes);
 }
});
test('desempate por pênaltis não vira gol e a força coletiva tem teto',()=>{
 const e=prepararElencoCopa(atleta()),j={fase:4,adv:{id:'ARG'},gp:0,gc:0,res:'V',penaltis:true,gols:0,assist:0};registrarJogoElenco(e,j);assert.equal(e.usuario.estatisticas.gols,0);assert.equal(j.elenco.gols.length,0);for(const p of e.jogadores)p.ovr=99;assert.equal(forcaElencoCopa(e,60),1.5);
});
test('preparar elenco não insere convocação ou estatísticas antes de ser convocado',()=>{
 const c=atleta(),antes=copiar(c);const e=prepararElencoCopa(c);assert.deepEqual(c,antes);consolidarElencoCopa(c,{copa:{elenco:e,fim:true,convocado:false}});assert.deepEqual(c,antes);
});
test('Copa real do motor registra os mesmos gols e jogos e salva uma única vez',()=>{
 for(let i=0;i<20;i++){
  let {c,card}=jogarTemporada(atleta('ATA',`ELENCO-${i}`));while(card.pendente)card=aplicarMomento(card,true);
  for(let passo=0;card.copa&&!card.copa.fim&&passo<12;passo++){
   if(card.pendente){card=aplicarMomento(card,true);continue;}
   const o=opcoesCopa(c,card);card=jogarCopa(c,card,o.opcoes[0].id).card;
  }
  if(!card.copa.convocado)continue;
  const e=card.copa.elenco,eu=e.usuario.estatisticas;
  assert.equal(eu.gols,card.copa.gols);assert.equal(eu.assist,card.copa.assist);assert.equal(eu.jogos,card.copa.jogos.length);
  for(const j of card.copa.jogos)assert.equal(j.elenco.jogadores.reduce((n,p)=>n+p.gols,0),j.gp);
  const f=fecharTemporada(c,card),antes=copiar(f.c.jornada.elencoSelecao);assert.deepEqual(fecharTemporada(f.c,f.card).c.jornada.elencoSelecao,antes);
 }
});
test('referência histórica só conta Copas masculinas registradas, deduplica o card e diferencia empate/superação',()=>{
 const c=atleta();c.temporadas=[{ano:2030,selecao:{tipo:'copaMundo',gols:10}},{ano:2032,selecao:{tipo:'continentalSelecao',gols:100}},{ano:2034,selecao:{tipo:'copaMundo',gols:6}}];
 let a=compararMarcasCopas(c,c.temporadas.at(-1));assert.equal(a[0].atual,16);assert.equal(a[0].anoIgualou,2034);assert.equal(a[0].anoSuperou,null);assert.equal(a[1].atual,10);
 a=compararMarcasCopas(c,{ano:2038,selecao:{tipo:'copaMundo',gols:13}});assert.equal(a[0].atual,29);assert.equal(a[0].anoSuperou,2038);assert.equal(a[1].anoIgualou,2038);assert.equal(progressoFeitoMuseu(c,'marca-klose').atual,16);assert.equal(extrairConquistasMuseu(c).find(x=>x.id==='marca-klose').ano,2034);
});

test('final decidida no minigame registra o autor do lance sem contar desempate no placar',()=>{
 for(const [mini,gols,assist,gp] of [['falta',1,0,1],['passe',0,1,1],['interceptacao',0,0,1],['penalti',0,0,0]]){
  const c=atleta(),r=jogarTemporada(c),card=r.card,k=card.copa;k.fim=false;k.fase=4;k.etapa='mata';k.titular=true;k.convocado=true;k.gols=0;k.assist=0;k.craque=0;k.jogos=[];k.adversario={id:'ARG',label:'Argentina',forca:86};k.elenco=prepararElencoCopa(c);
  card.pendente={tipo:'selecao',mini,ordem:1,total:1,lance:{gp:0,gc:0,disputa:mini==='penalti'}};card.filaMomentos=[];
  const f=aplicarMomento(card,true),j=f.copa.jogos.at(-1);assert.equal(j.gp,gp);assert.equal(f.copa.elenco.usuario.estatisticas.gols,gols);assert.equal(f.copa.elenco.usuario.estatisticas.assist,assist);assert.equal(j.elenco.gols.length,gp);assert.equal(f.copa.fim,true);
 }
});

test('núcleo antigo sem posição é incorporado ao elenco sem apagar os companheiros',()=>{
 const c=atleta();c.jornada.geracaoNac='BRA';c.jornada.geracao=[0,1,2].map(i=>({id:`legado:${i}`,nome:`Parceiro ${i}`,nascimento:2005+i,ficticio:true}));const e=prepararElencoCopa(c);for(const p of c.jornada.geracao)assert.ok(e.jogadores.some(x=>x.id===p.id&&x.nome===p.nome));assert.equal(e.jogadores.length,25);
});
