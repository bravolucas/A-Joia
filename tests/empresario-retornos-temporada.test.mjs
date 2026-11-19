import test from 'node:test';
import assert from 'node:assert/strict';
import {
 criarJogador,contratoPadrao,jogarTemporada,fecharTemporada,valorTransferencia,
 sinalizarInteresse,receberRetornosEmpresario,catalogoMercadoJogador,diagnosticoMercadoJogador
} from '../src/jogador/rapido.js';
import {analisarClubeEmpresario,respostaClubeEmpresario} from '../src/jogador/mercadoEmpresario.js';

function atleta(codigo='RETORNO-ANO'){
 const c=criarJogador({nome:'Atleta de Teste',nac:'BRA',posicao:'ATA',origem:'base',
  personalidade:'ascensao',pe:'destro',numero:9,codigo});
 for(const a of Object.keys(c.attrs)){c.attrs[a]=78;c.potencial[a]=Math.max(78,c.potencial[a]);}
 c.clubeNome='Santos';c.idade=24;c.flags.baseEscolhida=true;
 c.contrato=contratoPadrao(c,'Santos');
 return c;
}

test('sondagem usa exatamente o preço cobrado no mercado efetivo',()=>{
 const c=atleta('VALOR-SONDAGEM');
 for(const alvo of ['Flamengo','Real Madrid','Newcastle']){
  const data=diagnosticoMercadoJogador(c,alvo);
  assert.equal(data.custo,valorTransferencia(c,alvo),alvo);
 }
 c.contrato.restantes=0;
 assert.equal(diagnosticoMercadoJogador(c,'Newcastle').custo,0);
});

test('respostas automáticas chegam na virada da temporada e ficam salvas',()=>{
 const c=atleta('AUTO-EMPRESARIO');
 const clubes=catalogoMercadoJogador(c).filter(cl=>cl.nome!=='Santos').slice(0,2);
 let comSondagem=c;
 for(const cl of clubes)comSondagem=sinalizarInteresse(comSondagem,cl.nome);
 assert.equal(comSondagem.sondagensEmpresario.filter(s=>s.status==='aguardando').length,2);
 const {c:depoisDeJogar,card}=jogarTemporada(comSondagem);
 const {c:final,card:fechamento}=fecharTemporada(depoisDeJogar,card);
 assert.equal(final.sondagensEmpresario.length,2);
 assert.ok(final.sondagensEmpresario.every(s=>['positivo','negativo'].includes(s.status)));
 assert.equal(final.ultimaDevolutivaEmpresario.total,2);
 assert.equal(final.ultimaDevolutivaEmpresario.ano,final.ano);
 assert.ok(fechamento.destaques.some(x=>x.includes('empresário retornou')));
 assert.equal(comSondagem.sondagensEmpresario[0].status,'aguardando','save original não foi alterado');
 assert.throws(()=>receberRetornosEmpresario(final),/Nenhuma sondagem/);
});

test('caixa insuficiente, concorrência forte e nível muito baixo restringem respostas positivas',()=>{
 const c=atleta('RISCO-MERCADO');
 const clube=catalogoMercadoJogador(c).find(x=>x.nome==='Real Madrid');
 const mundo={jogadores:[{nome:'Camisa 9',posicao:'ATA',ovr:96,idade:25,clubeNome:'Real Madrid'}],
  caixaClubes:{'Real Madrid':100}};
 let positivas=0;
 for(let i=0;i<50;i++){
  const candidato={...c,codigo:'POUCO-CAIXA-'+i,mundo};
  const analise=analisarClubeEmpresario(candidato,clube,78);
  assert.equal(analise.semVerba,true);
  assert.equal(analise.posicaoOcupada,true);
  if(respostaClubeEmpresario(candidato,clube,78).status==='positivo')positivas++;
 }
 assert.ok(positivas<=3,'sem caixa e com titular melhor a tendência deve ser recusa');
});
