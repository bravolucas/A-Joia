import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,fecharTemporada,aplicarMomento,ovrDe,transferir,gerarOfertas,comSemente,sortearEvento,resolverEvento,caminhoSelecao,aposentar,iniciarEmprestimo,ofertasEmprestimo} from '../rapido.js';
import {posicoesCompativeis,mudarPosicao,reinventarVeterano,fecharAdaptacaoPosicao} from '../posicoesCarreira.js';
import {iniciarJornada,fecharJornada,registrarEscolhaJornada,prepararJornada,ativarAssinatura,registrarTransferenciaJornada,cenaDespedida,memoriaTorcida,definirPreferenciaMercado,projetoOferta,legadoNarrativo} from '../jornadaJogador.js';
import {extrairConquistasMuseu,mesclarMuseu,museuVazio,validarMuseu,progressoFeitoMuseu} from '../museu.js';
import {iniciarCarreiraTecnico} from '../tecnico.js';
import {planoPretemporadaRapida,cartaPretemporadaRapida,aplicarPretemporadaRapida} from '../pretemporadaRapida.js';

const copia=x=>JSON.parse(JSON.stringify(x));
function atleta(posicao='ATA'){
 const c=criarJogador({nome:'Jornada Teste',nac:'BRA',posicao,personalidade:'ascensao',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'JORNADA-TESTE'});
 c.idade=30;c.ano=2040;c.clubeNome='Santos';c.primeiroClube='Santos';c.flags.baseEscolhida=true;
 for(const a of Object.keys(c.attrs)){c.attrs[a]=76;c.potencial[a]=90;}
 c.contrato={clube:'Santos',restantes:4,anos:4,salario:1200,multa:10000};c.torcida={Santos:70};return c;
}
function card(c,extra={}){return {ano:c.ano,idade:c.idade,posicao:c.posicao,numero:c.numero,clube:c.emprestimo?.destino||c.clubeNome,ligaId:'brasileirao',jogos:30,gols:c.posicao==='GOL'?0:12,assist:8,nota:7.4,share:.8,titulos:[],momentos:[],destaques:[],ovr:76,ovrDepois:76,...extra};}

test('rotas compatíveis mudam a função, preservam atributos e excluem goleiro de linha',()=>{
 const c=atleta(),antes=copia(c),opcoes=posicoesCompativeis(c);
 assert.ok(opcoes.some(p=>p.destino==='MEI'));assert.ok(!opcoes.some(p=>p.destino==='ZAG'));
 const novo=mudarPosicao(c,'MEI');assert.equal(novo.posicao,'MEI');assert.equal(c.posicao,'ATA');assert.deepEqual(c,antes);
 assert.deepEqual(novo.attrs,c.attrs);assert.equal(novo.jornada.transicao.restantes,2);assert.equal(ovrDe(novo),opcoes.find(p=>p.destino==='MEI').ovrInicio);
 assert.deepEqual(posicoesCompativeis(atleta('GOL')),[]);assert.throws(()=>mudarPosicao(atleta('GOL'),'ATA'));
});
test('a adaptação termina e o jogador pode recuar novamente depois do prazo',()=>{
 let c=mudarPosicao(atleta(),'MEI');const penalizado=ovrDe(c);
 fecharAdaptacaoPosicao(c,card(c));assert.equal(c.jornada.transicao.restantes,1);assert.equal(ovrDe(c),penalizado);
 c.ano++;fecharAdaptacaoPosicao(c,card(c));assert.equal(c.jornada.transicao.restantes,0);assert.ok(ovrDe(c)>=penalizado+2);
 assert.equal(posicoesCompativeis(c).length,0);c.ano++;assert.ok(posicoesCompativeis(c).some(p=>p.destino==='MC'));
 c=mudarPosicao(c,'MC');assert.equal(c.posicao,'MC');assert.equal(c.jornada.trocas.length,2);
});
test('trocar de lado, lateral ofensivo e zagueiro passador têm caminhos distintos',()=>{
 for(const [de,para]of [['PE','PD'],['PD','PE'],['LE','LD'],['LD','MD'],['LD','PD'],['ZAG','VOL'],['ALE','ME'],['ALD','MD']])assert.ok(posicoesCompativeis(atleta(de)).some(p=>p.destino===para),`${de} → ${para}`);
 const c=atleta('ZAG');c.attrs.passe=45;assert.ok(!posicoesCompativeis(c).some(p=>p.destino==='VOL'));
 const lateral=atleta('LD');lateral.attrs.finalizacao=45;assert.ok(!posicoesCompativeis(lateral).some(p=>p.destino==='PD'));lateral.temporadas=[{gols:6}];assert.ok(posicoesCompativeis(lateral).some(p=>p.destino==='PD'));
});
test('mudança não reclassifica temporadas antigas nem permite trocar durante a campanha',()=>{
 const c=atleta();c.temporadas=[card(c,{ano:2039})];const n=mudarPosicao(c,'MEI');assert.equal(n.temporadas[0].posicao,'ATA');
 n.lojaAnoEmCurso=n.ano;assert.throws(()=>mudarPosicao(n,'MC'));
});
test('reinvenção veterana tem custo real, teto de atributos e cooldown',()=>{
 const c=atleta('MC'),n=reinventarVeterano(c,'leitura');assert.equal(n.attrs.velocidade,c.attrs.velocidade-2);assert.equal(n.attrs.passe,c.attrs.passe+2);assert.throws(()=>reinventarVeterano(n,'leitura'));
 const teto=atleta('MC');teto.attrs.passe=90;teto.potencial.passe=90;assert.throws(()=>reinventarVeterano(teto,'leitura'));
 const jovem=atleta();jovem.idade=22;assert.throws(()=>reinventarVeterano(jovem,'leitura'));
});
test('escolha gera um eco posterior, uma vez, sem outra decisão',()=>{
 const c=atleta(),evento={id:'grupo',titulo:'Confiar no grupo'},op={id:'coletivo',label:'Ajudar o grupo'};
 registrarEscolhaJornada(c,evento,op,'Você se colocou à disposição.');registrarEscolhaJornada(c,evento,op,'Você se colocou à disposição.');assert.equal(c.jornada.ecos.length,1);
 const e=c.jornada.ecos[0];c.ano=e.ano;const k=card(c);fecharJornada(c,k);assert.ok(k.jornada.noticias.some(n=>n.tipo==='eco'));assert.equal(c.jornada.ecos.length,0);
 const antes=copia(c);fecharJornada(c,k);assert.deepEqual(c,antes);
});
test('repetir a resolução de um contrato não repete a aquisição ou memórias',()=>{
 const c=atleta();c.flags.baseEscolhida=false;c.temporadas=[];
 const e=sortearEvento(c,{somente:'base'}),r=resolverEvento(c,e,e.opcoes[0].id),depois=resolverEvento(r.c,e,e.opcoes[0].id);
 assert.deepEqual(depois.c,r.c);assert.ok(r.c.jornada.primeiros.contrato);assert.ok(r.c.jornada.mentor.ficticio);
});
test('assinaturas exigem temporadas distintas e só uma afeta a preparação',()=>{
 const c=atleta('ME');
 for(let i=0;i<3;i++){const k=card(c);fecharJornada(c,k);c.temporadas.push(k);c.ano++;}
 assert.equal(c.jornada.assinaturas.vertical.anos.length,3);assert.ok(c.jornada.assinaturas.cruzador.anos.length>=3);
 const n=ativarAssinatura(c,'vertical');n.mod={};prepararJornada(n);assert.equal(n.mod.assistMult,1.03);assert.equal(n.mod.golsMult,undefined);
 const antes=copia(n.mod);prepararJornada(n);assert.deepEqual(n.mod,antes);
 assert.throws(()=>ativarAssinatura(n,'aereo'));
});
test('entrosamento e assinatura têm teto e não alteram o resultado por repetir preparação',()=>{
 const c=atleta('VOL');c.jornada.duplas=[{id:'d',clube:'Santos',conexao:100,aposentado:false}];c.jornada.assinaturaAtiva='antecipador';c.jornada.capitao={clube:'Santos'};prepararJornada(c);assert.ok(c.mod.notaBonus<=.14);const m=c.mod.notaBonus;prepararJornada(c);assert.equal(c.mod.notaBonus,m);
});
test('novo país cria adaptação finita e reencontro tem efeitos limitados',()=>{
 const c=atleta(),t={ano:c.ano,de:'Santos',para:'Milan',tipo:'venda',valor:1000};c.clubeNome='Milan';c.torcida.Milan=30;c.jornada.duplas=[{id:'d',nome:'Caio Nunes',clube:'Milan',conexao:3,temporadas:2,ficticio:true}];
 const moral=c.moral;registrarTransferenciaJornada(c,t);assert.equal(c.moral,moral+5);assert.equal(c.torcida.Milan,33);assert.equal(c.jornada.adaptacao.restantes,1);
 registrarTransferenciaJornada(c,t);assert.equal(c.moral,moral+5);assert.equal(c.torcida.Milan,33);
 fecharJornada(c,card(c,{clube:'Milan'}));assert.equal(c.jornada.adaptacao.restantes,0);
});
test('adaptação internacional sem parceiro termina em no máximo duas temporadas',()=>{
 const c=atleta();c.clubeNome='Milan';registrarTransferenciaJornada(c,{ano:c.ano,de:'Santos',para:'Milan',tipo:'venda'});assert.equal(c.jornada.adaptacao.restantes,2);
 fecharJornada(c,card(c,{clube:'Milan'}));c.ano++;fecharJornada(c,card(c,{clube:'Milan'}));assert.equal(c.jornada.adaptacao.restantes,0);
 c.ano++;c.mod={};prepararJornada(c);assert.ok((c.mod.notaBonus||0)>=0);
});
test('duplas têm identidade e trajetória própria que sobrevive à troca do jogador',()=>{
 const c=atleta('MC');for(let i=0;i<3;i++){const k=card(c);fecharJornada(c,k);c.temporadas.push(k);c.ano++;}
 const d=copia(c.jornada.duplas[0]);assert.ok(d.temporadas>=2);assert.ok(d.rota.length);transferir(c,'Milan');assert.equal(c.jornada.duplas[0].nome,d.nome);assert.equal(c.jornada.duplas[0].clube,d.clube);
});
test('despedidas refletem base, títulos, conflito e fim de contrato',()=>{
 const c=atleta();c.temporadas=[card(c,{ano:2038}),card(c,{ano:2039})];const t={de:'Santos',para:'Milan',ano:2040,valor:1000};
 assert.equal(cenaDespedida(c,t).tipo,'base');
 c.lista=[2027,2028,2029].map(ano=>({clube:'Santos',nome:'Brasileirão',tipo:'liga',ano}));assert.equal(cenaDespedida(c,t).tipo,'estadio');
 assert.equal(cenaDespedida(c,t,'forcada').tipo,'ruptura');assert.equal(cenaDespedida(c,{...t,tipo:'traicao'}).tipo,'ruptura');
 c.lista=[];c.primeiroClube='Vasco da Gama';assert.equal(cenaDespedida(c,{...t,valor:0}).tipo,'imprensa');assert.equal(cenaDespedida(c,{...t,tipo:'emprestimo'}).tipo,'emprestimo');
});
test('primeiros feitos valorizam defesa, interceptação e cruzamento e são idempotentes no museu',()=>{
 for(const [pos,mini,id]of [['GOL','defesa','primeira-defesa'],['ZAG','interceptacao','primeira-recuperacao'],['ALE','cruzamento','primeiro-cruzamento']]){
  const c=atleta(pos),k=card(c,{momentos:[{mini,acertou:true}]});fecharJornada(c,k);assert.ok(c.jornada.primeiros[id]);
  const registros=extrairConquistasMuseu(c);assert.ok(registros.some(r=>r.id===id));const m=mesclarMuseu(museuVazio(),registros);assert.deepEqual(mesclarMuseu(m,registros),m);
 }
});
test('saves antigos usam o primeiro ano registrado e não uma estreia inventada no presente',()=>{
 const c=atleta();delete c.jornada;c.temporadas=[card(c,{ano:2030,gols:1})];iniciarJornada(c);const k=card(c);fecharJornada(c,k);assert.equal(c.jornada.primeiros['primeiro-gol'].ano,2030);assert.ok(!k.jornada.memorias.some(m=>m.id==='primeiro:primeiro-gol'));
});
test('capitão depende de tempo e confiança e deixa de dar bônus em outro clube',()=>{
 const c=atleta('MC');c.temporadas=[card(c,{ano:2038}),card(c,{ano:2039})];fecharJornada(c,card(c));assert.equal(c.jornada.capitao.clube,'Santos');
 const novo=atleta('MC');novo.torcida.Santos=20;novo.temporadas=c.temporadas;fecharJornada(novo,card(novo));assert.equal(novo.jornada.capitao,null);
 c.clubeNome='Milan';c.ano++;c.mod={};prepararJornada(c);assert.equal(c.mod.notaBonus||0,0);
});
test('lembranças da torcida só citam títulos e retornos registrados',()=>{
 const c=atleta();assert.ok(!memoriaTorcida(c).includes('campeão'));c.lista=[{nome:'Copa do Brasil',tipo:'copa',ano:2038,clube:'Santos'}];assert.match(memoriaTorcida(c),/Copa do Brasil 2038/);
 c.temporadas=[card(c,{ano:2038})];c.transferencias=[{de:'Milan',para:'Santos',ano:2040}];assert.match(memoriaTorcida(c),/retorno em 2040/);
});
test('projetos de oferta são estáveis e a preferência não garante contrato',()=>{
 const c=atleta('MC'),original=copia(c),a=definirPreferenciaMercado(c,'titulos');assert.equal(c.jornada.preferencia,'jogar');assert.equal(a.jornada.preferencia,'titulos');
 const ops=comSemente(c.codigo,'teste-ofertas',()=>gerarOfertas(a,3));for(const o of ops){assert.ok(o.projeto.jogos[0]<=o.projeto.jogos[1]);assert.ok(o.projeto.salario>0);assert.ok(o.projeto.anos>=1);}
 assert.deepEqual(c,original);assert.deepEqual(projetoOferta(c,'Milan'),projetoOferta(c,'Milan'));
});
test('régua da seleção usa o mesmo corte e fatores da convocação',()=>{
 const c=atleta();const a=caminhoSelecao(c);assert.equal(a.corte,82);c.flags.selecaoFria=2;c.foco='vitrine';assert.equal(caminhoSelecao(c).corte,84);c.idade=17;assert.equal(caminhoSelecao(c).elegivel,false);
});
test('camisas preservam anos, números e memória ao atualizar e importar a coleção',()=>{
 const c=atleta();c.torcida.Santos=90;c.temporadas=[card(c,{ano:2038,numero:11})];let m=mesclarMuseu(museuVazio(),extrairConquistasMuseu(c));const antigo=copia(m);
 c.temporadas.push(card(c,{ano:2039,numero:10}));m=mesclarMuseu(m,extrairConquistasMuseu(c));const item=Object.values(m.camisas)[0],f=Object.values(item.fontes)[0];assert.deepEqual(f.historia.anos,[2038,2039]);assert.deepEqual(f.historia.numeros,[11,10]);
 const r=validarMuseu(m);assert.deepEqual(Object.values(Object.values(r.camisas)[0].fontes)[0].historia.anos,[2038,2039]);
 assert.equal(progressoFeitoMuseu(c,'cem-gols').meta,100);assert.ok(antigo.camisas);
});
test('fechamento completo conserva os novos registros e impede repetir a mesma temporada',()=>{
 const c=atleta('MD');let r=jogarTemporada(c);for(let i=0;r.card.pendente&&i<15;i++)r.card=aplicarMomento(r.card,true);const f=fecharTemporada(r.c,r.card);assert.equal(f.card.posicao,'MD');assert.ok(f.card.jornada);assert.equal(f.c.temporadas.length,1);
 const deNovo=fecharTemporada(f.c,f.card);assert.deepEqual(deNovo.c,f.c);assert.equal(deNovo.c.temporadas.length,1);
});
test('empréstimo informa plano e fecha relatório com jogos efetivamente disputados',()=>{
 let c=atleta('MC');const destino=ofertasEmprestimo(c)[0];assert.ok(destino);c=iniciarEmprestimo(c,destino.nome,1);assert.ok(c.emprestimo.projeto.jogos.length===2);assert.equal(c.emprestimo.ovrInicio,ovrDe(c));
 let r=jogarTemporada(c);while(r.card.pendente)r.card=aplicarMomento(r.card,true);const f=fecharTemporada(r.c,r.card);assert.equal(f.c.emprestimo,null);assert.equal(f.c.jornada.relatoriosEmprestimo[0].jogos,f.card.jogos);assert.equal(f.c.jornada.ultimaMudanca.tipo,'retornoEmprestimo');
});
test('legado e herança do treinador são explicáveis sem garantir um gigante',()=>{
 const c=atleta();c.temporadas=[card(c)];const fim=aposentar(c),tecnico=iniciarCarreiraTecnico(fim);assert.ok(legadoNarrativo(c).every(x=>x.motivo));assert.ok(tecnico.tecnico.herancaJogador.rotulos.length);assert.ok(tecnico.tecnico.reputacao<=85);
});
test('novas filosofias e dilemas ocupam uma única decisão e efeitos futuros ficam no clube correto',()=>{
 let t={clube:'Santos',ano:2040,elenco:70,moral:60,torcida:60,diretoria:60,fase:'pretemporada',verbaRapida:5000,temporadas:[],planoRapido:{ano:2040,clube:'Santos',cartas:['filosofia'],respostas:[]}};
 const c={...atleta(),tecnico:t},carta=cartaPretemporadaRapida(t);assert.equal(carta.total,1);const n=aplicarPretemporadaRapida(c,carta.chave,'transicao');assert.equal(n.tecnico.filosofia,'transicao');assert.equal(n.tecnico.estilo,'ofensivo');assert.equal(n.tecnico.efeitosPendentes[0].clube,'Santos');assert.equal(planoPretemporadaRapida(n.tecnico).respostas.length,1);
});
