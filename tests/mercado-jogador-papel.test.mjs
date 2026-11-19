import {analisarClubeEmpresario,respostaClubeEmpresario,viraPropostaSondagem} from '../src/jogador/mercadoEmpresario.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,iniciarNegociacao,ajustarNegociacao,fecharNegociacao,contratoPadrao,papelEsperado,papelMaximo,shareGarantido,
 interesseMercado,sinalizarInteresse,receberRetornosEmpresario,catalogoMercadoJogador,diagnosticoMercadoJogador,gerarOfertas,segundoEvento,janelaExtra,PAPEIS_CONTRATO} from '../src/jogador/rapido.js';

const atleta=(ovr=80,clube='Flamengo',codigo='PAPEL')=>{const c=criarJogador({nome:'Papel',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo});
 for(const a of Object.keys(c.attrs)){c.attrs[a]=ovr;c.potencial[a]=Math.max(ovr,c.potencial[a]);}c.clubeNome=clube;c.idade=24;c.flags.baseEscolhida=true;c.contrato=contratoPadrao(c,clube);return c;};

test('contrato traz o tempo de jogo esperado e o clube só promete até um nível acima',()=>{
 const reserva=atleta(50,'Real Madrid','PAPEL-R'),estrela=atleta(99,'Confiança','PAPEL-E');
 assert.equal(papelEsperado(reserva),'reserva');assert.equal(papelMaximo(reserva),'rotacao');
 assert.equal(papelMaximo(estrela),'intocavel');
 assert.equal(contratoPadrao(estrela,'Confiança').papel,'titular');
 let n=iniciarNegociacao(reserva,{clube:'Real Madrid'});
 n={...n,paciencia:100};n=ajustarNegociacao(n,'papel',1);assert.equal(n.termos.papel,'rotacao');
 n=ajustarNegociacao({...n,paciencia:100},'papel',1);assert.equal(n.termos.papel,'rotacao','acima do máximo é recusado');
 assert.match(n.historico.at(-1),/Recusaram/);
 assert.equal(PAPEIS_CONTRATO.length,4);
});

test('papel negociado garante minutos no clube e aparece na temporada',()=>{
 const c=atleta(55,'Real Madrid','PAPEL-SHARE');
 const sem=jogarTemporada({...c,contrato:{...c.contrato,papel:'reserva'}}).card;
 const com=jogarTemporada({...c,contrato:{...c.contrato,papel:'intocavel'}}).card;
 assert.equal(shareGarantido({...c,contrato:{...c.contrato,papel:'intocavel'}}),.97);
 assert.ok(com.share>sem.share&&com.jogos>sem.jogos,'Intocável joga muito mais');
 assert.equal(shareGarantido({...c,contrato:{...c.contrato,papel:'titular',clube:'Santos'}}),0,'promessa vale só no clube do contrato');
 const {contrato}=fecharNegociacao(c,{...iniciarNegociacao(c,{clube:'Real Madrid'}),termos:{...contratoPadrao(c,'Real Madrid'),papel:'rotacao'}});
 assert.equal(contrato.papel,'rotacao');
});

test('janela de propostas abre também fora dos anos de decisão',()=>{
 let abriu=0;
 for(let i=0;i<40;i++){const c={...atleta(80,'Santos','JANELA-'+i),ritmo:'normal',temporadas:[{ano:2025,clube:'Santos',jogos:30,gols:10,assist:5,nota:7.4}]};if(segundoEvento(c,null))abriu++;}
 assert.ok(abriu>=10,`propostas em anos sem decisão (${abriu}/40)`);
});

test('empresário permite procurar qualquer clube jogável e obter devolutiva, sem oferta automática',()=>{
 const c=atleta(78,'Santos','EMPRESARIO');
 const interesses=interesseMercado(c),catalogo=catalogoMercadoJogador(c);
 assert.ok(interesses.length>=2);
 assert.ok(catalogo.length>interesses.length);
 assert.ok(catalogo.some(x=>x.liga==='inglaterra2'),'inclui também divisões inferiores');
 const alvo=catalogo.find(x=>x.nome!=='Santos'&&!interesses.some(o=>o.clube===x.nome));
 assert.ok(alvo,'permite sondar quem ainda não acompanha o atleta');
 const sondado=sinalizarInteresse(c,alvo.nome);
 assert.equal(sondado.sondagensEmpresario[0].status,'aguardando');
 assert.equal(sondado.torcida.Santos,(c.torcida.Santos??30)-2);
 assert.equal(c.sondagensEmpresario,undefined,'não altera save de entrada');
 assert.throws(()=>sinalizarInteresse(sondado,alvo.nome),/já procurou/);
 assert.throws(()=>sinalizarInteresse(c,'Clube Inexistente'),/não encontrado/);
 assert.throws(()=>sinalizarInteresse(c,'Santos'),/já tem contrato/);
 const retornado=receberRetornosEmpresario(sondado);
 assert.ok(['positivo','negativo'].includes(retornado.sondagensEmpresario[0].status));
 assert.ok(retornado.sondagensEmpresario[0].texto.length>=30);
 assert.deepEqual(receberRetornosEmpresario(sondado).sondagensEmpresario,retornado.sondagensEmpresario,'resposta determinística');
 assert.equal(sondado.sondagensEmpresario[0].status,'aguardando','retorno não altera save anterior');
 assert.throws(()=>receberRetornosEmpresario(retornado),/Nenhuma sondagem/);
});

test('avaliação usa caixa real do mundo e a concorrência na posição',()=>{
 const c=atleta(80,'Santos','CAIXA-EMPRESARIO'),flamengo=catalogoMercadoJogador(c).find(x=>x.nome==='Flamengo');
 const alterado={...c,mundo:{jogadores:[
  {nome:'Titular forte',clubeNome:'Flamengo',posicao:'ATA',ovr:94,idade:26},
  {nome:'Meia',clubeNome:'Flamengo',posicao:'MEI',ovr:96,idade:27}
 ],caixaClubes:{Flamengo:30}}};
 const info=analisarClubeEmpresario(alterado,flamengo,80);
 assert.equal(info.concorrencia,'Alta');
 assert.equal(info.melhor.nome,'Titular forte');
 assert.equal(info.caixa,30);
 assert.equal(info.caixaConhecido,true);
 assert.equal(info.semVerba,true,'caixa não cobre contratação');
 assert.deepEqual(diagnosticoMercadoJogador(alterado,'Flamengo').melhor?.nome,'Titular forte');
 const semTitular={...alterado,mundo:{jogadores:[],caixaClubes:{Flamengo:500000}}};
 const favoravel=analisarClubeEmpresario(semTitular,flamengo,80);
 assert.equal(favoravel.posicaoOcupada,false);
 assert.equal(favoravel.qualidadeConcorrente,null,'sem jogador não existe concorrente de OVR zero');
 assert.equal(favoravel.concorrencia,'Sem referência');
 assert.equal(favoravel.semVerba,false);
});

test('sondagens improváveis tendem a recusa; recusa não entra nas ofertas do ano',()=>{
 const c=atleta(46,'Santos','NIVEL-SINALIZADO'),real=catalogoMercadoJogador(c).find(x=>x.nome==='Real Madrid');
 let negativas=0;
 for(let i=0;i<30;i++)if(respostaClubeEmpresario({...c,codigo:'NIVEL-SONDAGEM-'+i},real,46).status==='negativo')negativas++;
 assert.ok(negativas>=27,'atleta muito abaixo do clube quase sempre recebe resposta negativa');
 const s=sinalizarInteresse(c,'Real Madrid');
 s.sondagensEmpresario[0]={...s.sondagensEmpresario[0],status:'negativo'};
 const ofertas=gerarOfertas(s,4);
 assert.ok(!ofertas.some(o=>o.clube==='Real Madrid'));
 const probabilidades=Array.from({length:30},(_,i)=>viraPropostaSondagem({...c,codigo:'SONDAGEM-'+i},'Real Madrid'));
 assert.ok(probabilidades.some(Boolean)&&probabilidades.some(x=>!x),'sinal verde não assegura proposta');
});

test('ofertas formais não são criadas com caixa comprovadamente insuficiente',()=>{
 const c=atleta(80,'Santos','CAIXA-SEM-PROPOSTAS');
 const clubes=catalogoMercadoJogador(c).filter(x=>x.nome!=='Santos');
 c.mundo={jogadores:[],caixaClubes:Object.fromEntries(clubes.map(x=>[x.nome,0]))};
 assert.equal(gerarOfertas(c,5).length,0,'nenhum destino pode pagar a transferência');
 // A lista de observadores ainda pode existir sem implicar contratação imediata.
 assert.ok(interesseMercado(c).length>=2);
});
