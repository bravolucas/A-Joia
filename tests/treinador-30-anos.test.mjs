import test from 'node:test';
import assert from 'node:assert/strict';
import { criarJogador, jogarTemporada, fecharTemporada, aposentar } from '../rapido.js';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, cartaAtualTecnico, tomarDecisaoTecnico, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico, carreiraTecnicoEncerrada, LIMITE_TEMPORADAS_TECNICO, titulosConquistadosTecnico, calendarioAdversariosTecnico, calendarioLigaTecnico } from '../tecnico.js';

test('vitrine de titulos e encerramento obrigatorio apos 30 temporadas', () => {
  let c = criarJogador({ nome:'Trinta anos', nac:'BRA', posicao:'ATA', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, ritmo:'equilibrado', codigo:'TREINADOR30' });
  for(let i=0;i<18;i++){const r=jogarTemporada(c);c=fecharTemporada(r.c,r.card).c;}
  c=iniciarCarreiraTecnico(aposentar(c));
  if(c.tecnico.opcoesInicio?.length)c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
  for(let i=0;i<LIMITE_TEMPORADAS_TECNICO;i++){
    // Evitar demissão para exercitar o limite de duração.
    c={...c,tecnico:{...c.tecnico,diretoria:100,torcida:100,elenco:95,moral:95}};
    const carta=cartaAtualTecnico(c.tecnico);
    c=jogarTemporadaExpressaTecnico(c,carta.opcoes[0].id,()=>0.01);
    assert.equal(c.tecnico.temporadas.length,i+1);
    if(i<29){assert.equal(c.tecnico.demitido,false);c=proximaTemporadaTecnico(c);}
  }
  assert.equal(carreiraTecnicoEncerrada(c.tecnico),true);
  assert.equal(c.tecnico.temporadas.length,30);
  assert.equal(titulosConquistadosTecnico(c.tecnico).length,c.tecnico.temporadas.filter(t=>t.campeao).length);
  assert.throws(()=>proximaTemporadaTecnico(c),/30 temporadas/);
});

test('save antigo: escolha visivel deve ser aplicada mesmo apos decisao parcial', () => {
  let c = criarJogador({ nome:'Retorno', nac:'BRA', posicao:'ATA', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, ritmo:'equilibrado', codigo:'RETORNO' });
  for (let i=0; i<18; i++) { const r=jogarTemporada(c); c=fecharTemporada(r.c,r.card).c; }
  c=iniciarCarreiraTecnico(aposentar(c));
  if (c.tecnico.opcoesInicio?.length) c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
  const primeira=cartaAtualTecnico(c.tecnico);
  c=tomarDecisaoTecnico(c,primeira.opcoes[0].id,()=>0.5);
  const segunda=cartaAtualTecnico(c.tecnico);
  const escolhida=segunda.opcoes.at(-1).id;
  c=jogarTemporadaExpressaTecnico(c,escolhida,()=>0.5);
  assert.equal(c.tecnico.temporadas.length,1);
  assert.equal(c.tecnico.temporadas[0].decisoes[1].opcao,escolhida);
});

test('calendario do treinador aceita clube legado sem nome e preserva 38 rodadas', () => {
  const calendario = calendarioAdversariosTecnico({clube:null, liga:'brasileirao', elenco:50});
  assert.equal(calendario.length,38);
  assert.ok(calendario.every(jogo => jogo.nome && typeof jogo.casa === 'boolean'));
});

test('simulacao expressa suporta save antigo sem atributo de elenco', () => {
  let c = criarJogador({nome:'Legado',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:9,ritmo:'equilibrado',codigo:'LEGADO'});
  for(let i=0;i<18;i++){const r=jogarTemporada(c);c=fecharTemporada(r.c,r.card).c;}
  c=iniciarCarreiraTecnico(aposentar(c));
  if(c.tecnico.opcoesInicio?.length)c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
  const carta=cartaAtualTecnico(c.tecnico);
  c={...c,tecnico:{...c.tecnico,elenco:undefined}};
  c=jogarTemporadaExpressaTecnico(c,carta.opcoes[0].id,()=>0.5);
  assert.equal(c.tecnico.temporadas.length,1);
  assert.equal(c.tecnico.temporadas[0].vitorias+c.tecnico.temporadas[0].empates+c.tecnico.temporadas[0].derrotas,38);
});

test('save legado sem contadores preserva estatisticas numericas apos temporada', () => {
  let c = criarJogador({nome:'Historico',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:9,ritmo:'equilibrado',codigo:'HISTORICO'});
  for(let i=0;i<18;i++){const r=jogarTemporada(c);c=fecharTemporada(r.c,r.card).c;}
  c=iniciarCarreiraTecnico(aposentar(c));
  if(c.tecnico.opcoesInicio?.length)c=iniciarNoClubeIdolo(c,c.tecnico.opcoesInicio[0].clube);
  c={...c,tecnico:{...c.tecnico,reputacao:undefined,diretoria:undefined,vitorias:undefined,empates:undefined,derrotas:undefined,titulos:undefined}};
  const carta=cartaAtualTecnico(c.tecnico);
  c=jogarTemporadaExpressaTecnico(c,carta.opcoes[0].id,()=>0.5);
  for(const chave of ['reputacao','diretoria','vitorias','empates','derrotas','titulos']) assert.ok(Number.isFinite(c.tecnico[chave]),chave);
  assert.equal(c.tecnico.vitorias+c.tecnico.empates+c.tecnico.derrotas,38);
});

test('inicio da carreira de treinador ignora pontuacao de legado invalida', () => {
  let c=criarJogador({nome:'Legado Invalido',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:9,ritmo:'equilibrado',codigo:'LEGADOINVALIDO'});
  for(let i=0;i<18;i++){const r=jogarTemporada(c);c=fecharTemporada(r.c,r.card).c;}
  c=aposentar(c);
  c={...c,legado:{...(c.legado||{}),pontos:'valor invalido'}};
  c=iniciarCarreiraTecnico(c);
  assert.ok(Number.isFinite(c.tecnico.reputacao));
  assert.ok(c.tecnico.reputacao>=25 && c.tecnico.reputacao<=85);
});

test('calendario de liga completa tem turno e returno sem confrontos duplicados', () => {
  const clube = 'Corinthians';
  const calendario = calendarioLigaTecnico({clube});
  assert.ok(calendario, 'Liga com 20 clubes deve produzir tabela completa');
  assert.equal(calendario.length, 38);
  const jogos = calendario.flat();
  assert.equal(jogos.length, 380);
  const confrontos = new Set(jogos.map(j => j.casa + '|' + j.fora));
  assert.equal(confrontos.size, 380, 'Cada confronto com mando deve acontecer uma vez');
  const rodadas = calendarioAdversariosTecnico({clube});
  assert.equal(rodadas.length,38);
  assert.equal(rodadas.filter(j => j.casa).length,19);
  assert.equal(rodadas.filter(j => !j.casa).length,19);
});

test('clube legado fora da lista substitui um participante sem gerar liga de 21 clubes', () => {
  const clube = 'Clube de Save Antigo';
  const calendario = calendarioLigaTecnico({clube, liga:'brasileirao', elenco:55});
  assert.ok(calendario, 'Clube legado deve integrar calendario de 20 participantes');
  assert.equal(calendario.length,38);
  assert.equal(calendario.flat().length,380);
  const jogosClube = calendario.flat().filter(j=>j.casa===clube||j.fora===clube);
  assert.equal(jogosClube.length,38);
  assert.equal(jogosClube.filter(j=>j.casa===clube).length,19);
});

test('simulacao direta dispensa carta de pretemporada e preserva classificacao no save', () => {
  let c = criarJogador({ nome:'Direto', nac:'BRA', posicao:'ATA', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, codigo:'DIRETO-TESTE' });
  c = iniciarCarreiraTecnico(aposentar(c));
  if (c.tecnico.opcoesInicio?.length) c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  c = jogarTemporadaExpressaTecnico(c, null, () => 0.43);
  assert.equal(c.tecnico.fase, 'resultado');
  assert.equal(c.tecnico.temporadas.length, 1);
  const ultima = c.tecnico.temporadas[0];
  assert.equal(ultima.vitorias + ultima.empates + ultima.derrotas, 38);
  assert.equal(ultima.pontos, ultima.vitorias * 3 + ultima.empates);
  assert.ok(Array.isArray(ultima.classificacao));
  assert.equal(ultima.classificacao.filter(x => x.meuClube).length, 1);
  assert.equal(ultima.classificacao.find(x => x.meuClube).posicao, ultima.posicao);
  const restaurado = JSON.parse(JSON.stringify(c));
  assert.deepEqual(restaurado.tecnico.temporadas[0].classificacao, ultima.classificacao);
});

test('duas temporadas consecutivas sem cartas visiveis preservam historico e jogador', () => {
  let c = criarJogador({ nome:'Continuidade', nac:'BRA', posicao:'ATA', personalidade:'equilibrado', origem:'base', pe:'destro', numero:9, codigo:'FLUXO-DIRETO' });
  c = iniciarCarreiraTecnico(aposentar(c));
  if (c.tecnico.opcoesInicio?.length) c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  const carreiraJogador = JSON.stringify(c.temporadas);
  c = jogarTemporadaExpressaTecnico(c, null, () => 0.43);
  const primeira = JSON.parse(JSON.stringify(c.tecnico.temporadas[0]));
  c = { ...c, tecnico: { ...c.tecnico, demitido: false, desempregado: false, diretoria: 95, torcida: 95 } };
  c = jogarTemporadaExpressaTecnico(proximaTemporadaTecnico(c), null, () => 0.43);
  assert.equal(c.tecnico.temporadas.length, 2);
  assert.deepEqual(c.tecnico.temporadas[0], primeira);
  assert.equal(c.tecnico.temporadas[1].ano, primeira.ano + 1);
  assert.equal(JSON.stringify(c.temporadas), carreiraJogador);
});
