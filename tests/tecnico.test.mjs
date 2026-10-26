import { CLUBES } from '../data.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, definirEstiloTecnico, tomarDecisaoTecnico, cartaAtualTecnico, sortearCartasTecnico, objetivoTecnico, perfilClubeTecnico, probabilidadesTecnico, calendarioAdversariosTecnico, calendarioLigaTecnico, probabilidadesConfrontoTecnico, tabelaClassificacaoTecnico, ordenarClassificacaoTecnico, zonaClassificacaoTecnico, placarTecnico, calcularOvrTecnico, riscoDemissaoTecnico, painelEstabilidadeTecnico, historicoProfissionalTecnico, gerarPropostasTecnico, salarioTecnico, vinculosComoJogador, opcoesInicioTecnico, iniciarNoClubeIdolo, passarAnoDesempregado, negociarContratoTecnico, aceitarPropostaTecnico, TODAS_CARTAS_TECNICO, elegivelTecnico, QUANTIDADE_DECISOES_TECNICO, simularTemporadaTecnico, simularEtapaTecnico, reuniaoEmergenciaTecnico, ETAPAS_TEMPORADA_TECNICO, proximaTemporadaTecnico } from '../tecnico.js';

const atleta = { nome: 'Teste', idade: 40, ano: 2045, clubeNome: 'Clube A', aposentado: true, legado: { pontos: 700 }, temporadas: [{ ano: 2044 }], totais: { gols: 300 } };
test('somente aposentados podem iniciar carreira técnica', () => {
  assert.throws(() => iniciarCarreiraTecnico({ ...atleta, aposentado: false }));
});
test('mantém histórico do atleta e evita reinicialização', () => {
  const c = iniciarCarreiraTecnico(atleta);
  assert.equal(c.temporadas, atleta.temporadas);
  assert.equal(c.totais, atleta.totais);
  assert.equal(iniciarCarreiraTecnico(c), c);
});
test('tática, temporada, resultado e avanço são persistentes', () => {
  const c = definirEstiloTecnico(iniciarCarreiraTecnico(atleta), 'defensivo');
  assert.throws(() => simularTemporadaTecnico(c));
  let d = c;
  for (let i = 0; i < QUANTIDADE_DECISOES_TECNICO; i++) {
    const carta = cartaAtualTecnico(d.tecnico);
    d = tomarDecisaoTecnico(d, carta.opcoes[0].id, () => 0.1);
  }
  assert.equal(d.tecnico.decisoes.length, 4);
  assert.equal(cartaAtualTecnico(d.tecnico), null);
  assert.throws(() => tomarDecisaoTecnico(d, 'base'));
  const r = simularTemporadaTecnico(d, () => 0.1);
  assert.equal(r.tecnico.temporadas.length, 1);
  assert.equal(r.tecnico.temporadas[0].vitorias, 38);
  assert.equal(r.tecnico.fase, 'resultado');
  assert.throws(() => simularTemporadaTecnico(r));
  const n = proximaTemporadaTecnico(r);
  assert.equal(n.tecnico.fase, 'pretemporada');
  assert.equal(n.tecnico.temporadas.length, 1);
  assert.equal(n.idade, 41);
});

test('sorteia quatro eventos diferentes por temporada', () => {
  const cartas = sortearCartasTecnico(() => 0.5);
  assert.equal(cartas.length, 4);
  assert.equal(new Set(cartas).size, 4);
});

test('banco amplo e cartas relevantes ao contexto', () => {
  assert.ok(TODAS_CARTAS_TECNICO.length >= 60);
  const novato = { temporadas: [], reputacao: 25, diretoria: 70, moral: 60 };
  assert.equal(elegivelTecnico(TODAS_CARTAS_TECNICO.find(x => x.id === 'ultimato'), novato), false);
  assert.equal(elegivelTecnico(TODAS_CARTAS_TECNICO.find(x => x.id === 'boicote'), novato), false);
  const crise = { ...novato, diretoria: 20 };
  assert.equal(elegivelTecnico(TODAS_CARTAS_TECNICO.find(x => x.id === 'boicote'), crise), true);
  const veterano = { ...novato, reputacao: 85, temporadas: Array(6).fill({posicao: 3}) };
  assert.equal(elegivelTecnico(TODAS_CARTAS_TECNICO.find(x => x.id === 'mentor'), veterano), true);
});
test('evita repetir as últimas 16 cartas quando há alternativas', () => {
  const t = { temporadas: [], reputacao: 35, diretoria: 60, moral: 60 };
  const primeiras = sortearCartasTecnico(t, () => 0.3);
  const seguintes = sortearCartasTecnico({ ...t, historicoCartas: primeiras }, () => 0.3);
  assert.equal(seguintes.filter(id => primeiras.includes(id)).length, 0);
});

test('consequências de decisões atravessam temporadas e não duplicam', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, cartas: ['reforcos','vestiario','craque','classico'] } };
  for (const opcao of ['pedir','dialogo','apoiar','prudente']) c = tomarDecisaoTecnico(c, opcao, () => 0.99);
  const pendentes = c.tecnico.efeitosPendentes;
  assert.equal(pendentes.length, 4);
  c = simularTemporadaTecnico(c, () => 0.1);
  const antes = c.tecnico.elenco;
  c = proximaTemporadaTecnico(c);
  assert.equal(c.tecnico.efeitosPendentes.length, 0);
  assert.equal(c.tecnico.efeitosRecebidos.length, 4);
  assert.ok(c.tecnico.elenco > antes);
});

test('objetivos seguem força do clube, sem exigir reputação elevada', () => {
  assert.equal(objetivoTecnico({ reputacao: 30, elenco: 45 }).id, 'permanencia');
  assert.equal(objetivoTecnico({ reputacao: 90, elenco: 80 }).id, 'continental');
  assert.equal(objetivoTecnico({ reputacao: 20, elenco: 85 }).id, 'titulo');
});
test('demissão exige mudança de clube, preservando o histórico', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, fase: 'resultado', demitido: true,
    propostas: [{ nome: 'Clube do Interior', elenco: 42 }] } };
  assert.throws(() => proximaTemporadaTecnico(c));
  c = aceitarPropostaTecnico(c, 'Clube do Interior');
  assert.equal(c.tecnico.demitido, false);
  assert.equal(c.tecnico.clube, 'Clube do Interior');
  assert.equal(proximaTemporadaTecnico(c).tecnico.fase, 'pretemporada');
});

test('OVR técnico independe da aprovação local e cresce com experiência', () => {
  const base = { reputacao: 60, torcida: 90, diretoria: 90, temporadas: [], titulos: 0 };
  assert.equal(calcularOvrTecnico(base), calcularOvrTecnico({ ...base, torcida: 10, diretoria: 10 }));
  assert.ok(calcularOvrTecnico({ ...base, temporadas: Array(6).fill({}), titulos: 2 }) > calcularOvrTecnico(base));
});
test('torcida e diretoria baixas aumentam pressão e OVR filtra clubes', () => {
  assert.ok(riscoDemissaoTecnico({ torcida: 10, diretoria: 15 }).pressao > riscoDemissaoTecnico({ torcida: 90, diretoria: 90 }).pressao);
  const iniciante = { reputacao: 25, temporadas: [], titulos: 0, clube: 'Outro' };
  assert.ok(gerarPropostasTecnico(iniciante, () => 0).every(p => p.exigencia <= calcularOvrTecnico(iniciante)));
  const consagrado = { reputacao: 99, temporadas: Array(10).fill({}), titulos: 5, vitorias: 300, empates: 40, derrotas: 40, clube: 'Outro' };
  assert.ok(gerarPropostasTecnico(consagrado, () => 0).every(p => CLUBES.some(clube => clube.nome === p.nome)));
});

test('ofertas dependem do sorteio e do OVR, sem garantir clubes grandes', () => {
  const consagrado = { reputacao: 99, temporadas: Array(10).fill({ clube: 'Projeto Emergente' }), titulos: 5, vitorias: 300, empates: 40, derrotas: 40, clube: 'Outro' };
  assert.equal(gerarPropostasTecnico(consagrado, () => 0.99).length, 0);
  assert.ok(gerarPropostasTecnico(consagrado, () => 0).length > 0);
  assert.ok(salarioTecnico({ ...consagrado, clube: 'Real Madrid' }) > salarioTecnico({ ...consagrado, clube: 'Guarani' }));
});
test('desemprego avança o calendário e permite retornar após proposta', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, fase: 'resultado', demitido: true } };
  const idade = c.idade;
  c = passarAnoDesempregado(c, () => 0);
  assert.equal(c.idade, idade + 1);
  assert.equal(c.tecnico.desempregado, true);
  assert.equal(c.tecnico.salario, 0);
  assert.ok(c.tecnico.propostas.length > 0);
  assert.ok(c.tecnico.propostas.every(p => CLUBES.some(clube => clube.nome === p.nome)));
  c = aceitarPropostaTecnico(c, c.tecnico.propostas[0].nome);
  assert.equal(c.tecnico.desempregado, false);
  assert.equal(proximaTemporadaTecnico(c).tecnico.fase, 'pretemporada');
});

test('idolatria e tempo no clube abrem portas para iniciar carreira técnica', () => {
  const atletaIdolo = { ...atleta, aposentado: true, clubeNome: 'Clube B', torcida: { 'Clube A': 91, 'Clube B': 30 },
    temporadas: Array.from({ length: 6 }, (_, i) => ({ ano: 2020 + i, clube: 'Clube A', jogos: 30, titulos: i < 3 ? [{ tipo: 'liga' }] : [] })) };
  const vinculo = vinculosComoJogador(atletaIdolo)[0];
  assert.equal(vinculo.clube, 'Clube A');
  assert.equal(vinculo.idolatria, true);
  assert.ok(opcoesInicioTecnico(atletaIdolo).some(x => x.clube === 'Clube A'));
  let c = iniciarCarreiraTecnico(atletaIdolo);
  c = iniciarNoClubeIdolo(c, 'Clube A');
  assert.equal(c.tecnico.clube, 'Clube A');
  assert.ok(c.tecnico.torcida > 55);
  assert.equal(c.tecnico.retornoIdolo, true);
  assert.throws(() => iniciarNoClubeIdolo(c, 'Clube Desconhecido'));
});

test('ícone de ídolo é registrado e aumenta cobrança após meta não cumprida', () => {
  const idolo = { ...atleta, aposentado: true, clubeNome: 'Clube A', torcida: { 'Clube A': 95 },
    temporadas: Array(5).fill({ clube: 'Clube A', jogos: 28, titulos: [{ tipo: 'liga' }] }) };
  const normal = { ...idolo, torcida: { 'Clube A': 20 }, temporadas: [{ clube: 'Clube A', jogos: 28 }] };
  const montar = (a) => {
    let c = iniciarCarreiraTecnico(a);
    c = { ...c, tecnico: { ...c.tecnico, cartas: ['reforcos','vestiario','craque','classico'], diretoria: 70, torcida: 70 } };
    for (const opcao of ['pedir','dialogo','apoiar','prudente']) c = tomarDecisaoTecnico(c, opcao, () => 0.99);
    return simularTemporadaTecnico(c, () => 0.99);
  };
  const a = montar(idolo), b = montar(normal);
  assert.equal(a.tecnico.temporadas.at(-1).idoloEmCasa, true);
  assert.equal(b.tecnico.temporadas.at(-1).idoloEmCasa, false);
  assert.ok(a.tecnico.torcida < b.tecnico.torcida);
});

test('mercado de técnicos usa clubes reais e preserva a identidade do cadastro', () => {
  const clubes = gerarPropostasTecnico({ reputacao: 99, temporadas: Array(12).fill({}), titulos: 8, vitorias: 350, empates: 30, derrotas: 30, clube: 'Outro' }, () => 0);
  assert.ok(clubes.length > 0);
  for (const clube of clubes) {
    const original = CLUBES.find(x => x.nome === clube.nome);
    assert.ok(original);
    assert.equal(clube.elenco, original.forca);
  }
});

test('entrevista prudente contrata, salário negociado e promessa tem consequência', () => {
  const proposta = { nome: 'Guarani', pais: 'Brasil', elenco: 55, salario: 20, exigencia: 35 };
  const base = { ...iniciarCarreiraTecnico(atleta), tecnico: {
    ...iniciarCarreiraTecnico(atleta).tecnico, fase: 'resultado', propostas: [proposta]
  }};
  const prudente = negociarContratoTecnico(base, 'Guarani', 'prudente', () => 0.99);
  assert.equal(prudente.tecnico.clube, 'Guarani');
  assert.equal(prudente.tecnico.salario, 20);
  assert.equal(prudente.tecnico.promessaContrato, null);
  const rejeitada = negociarContratoTecnico(base, 'Guarani', 'salario', () => 0);
  assert.equal(rejeitada.tecnico.ultimaNegociacao.aceita, false);
  assert.equal(rejeitada.tecnico.propostas.length, 0);
  const ambicioso = negociarContratoTecnico(base, 'Guarani', 'ambicioso', () => 0.99);
  assert.equal(ambicioso.tecnico.salario, 22);
  assert.equal(ambicioso.tecnico.promessaContrato.posicaoMaxima, 4);
  assert.throws(() => negociarContratoTecnico(base, 'Clube Inventado'));
});

test('painel de estabilidade separa meta do clube e promessa do treinador', () => {
  const t = { clube: 'Guarani', reputacao: 65, elenco: 60, torcida: 35, diretoria: 45,
    promessaContrato: { clube: 'Guarani', posicaoMaxima: 4 }, temporadas: [] };
  const p = painelEstabilidadeTecnico(t);
  assert.equal(p.objetivo, objetivoTecnico(t).nome);
  assert.equal(p.promessa.posicaoMaxima, 4);
  assert.equal(p.torcida, 35);
  assert.equal(p.diretoria, 45);
  assert.ok(p.pressao > painelEstabilidadeTecnico({ ...t, torcida: 90, diretoria: 90 }).pressao);
  assert.equal(painelEstabilidadeTecnico({ ...t, clube: 'Outro' }).promessa, null);
  assert.equal(painelEstabilidadeTecnico({ ...t, demitido: true }).situacao, 'Demitido');
});
test('novo clube não herda promessa feita à diretoria anterior', () => {
  const c = iniciarCarreiraTecnico(atleta);
  const comOferta = { ...c, tecnico: { ...c.tecnico, fase: 'resultado',
    promessaContrato: { clube: 'Clube Antigo', posicaoMaxima: 4 },
    propostas: [{ nome: 'Guarani', pais: 'Brasil', elenco: 55, salario: 20, exigencia: 30 }] } };
  const novo = aceitarPropostaTecnico(comOferta, 'Guarani');
  assert.equal(novo.tecnico.promessaContrato, null);
});

test('temporada em etapas registra avaliações intermediárias e evita sorteio duplicado', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }) } };
  for (const rodada of ETAPAS_TEMPORADA_TECNICO) {
    c = simularEtapaTecnico(c, () => 0.4);
    if (rodada < 38) {
      assert.equal(c.tecnico.andamento.jogos, rodada);
      assert.equal(c.tecnico.andamento.avaliacoes.length, ETAPAS_TEMPORADA_TECNICO.indexOf(rodada) + 1);
      assert.throws(() => simularTemporadaTecnico(c, () => 0.4));
    }
  }
  assert.equal(c.tecnico.fase, 'resultado');
  assert.equal(c.tecnico.temporadas.at(-1).vitorias + c.tecnico.temporadas.at(-1).empates + c.tecnico.temporadas.at(-1).derrotas, 38);
  assert.equal(c.tecnico.temporadas.at(-1).avaliacoes.length, 4);
});
test('sequência desastrosa pode causar demissão antes da rodada 38', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }), diretoria: 19, torcida: 12 } };
  c = simularEtapaTecnico(c, () => 0.99);
  assert.equal(c.tecnico.demitido, true);
  assert.equal(c.tecnico.fase, 'resultado');
  assert.equal(c.tecnico.temporadas.at(-1).interrompida, true);
  assert.equal(c.tecnico.temporadas.at(-1).jogos, 10);
});

test('reunião de emergência bloqueia avanço e permite recuperar confiança', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }), diretoria: 48, torcida: 40 } };
  c = simularEtapaTecnico(c, () => 0.99);
  assert.equal(c.tecnico.reuniaoPendente, true);
  assert.equal(c.tecnico.fase, 'pretemporada');
  assert.throws(() => simularEtapaTecnico(c, () => 0.5));
  assert.throws(() => reuniaoEmergenciaTecnico(c, 'invalida'));
  const anterior = c.tecnico.diretoria;
  c = reuniaoEmergenciaTecnico(c, 'responsabilidade');
  assert.equal(c.tecnico.reuniaoPendente, false);
  assert.equal(c.tecnico.diretoria, anterior + 12);
  assert.equal(c.tecnico.reunioes.length, 1);
  c = simularEtapaTecnico(c, () => 0.4);
  assert.equal(c.tecnico.andamento.jogos, 19);
});

test('histórico do treinador agrupa clubes, títulos e demissões sem misturar estatísticas do atleta', () => {
  const c = iniciarCarreiraTecnico(atleta);
  const temporadas = [
    { ano: 2045, clube: 'Corinthians', vitorias: 20, empates: 10, derrotas: 8, campeao: true, posicao: 1 },
    { ano: 2046, clube: 'Corinthians', vitorias: 12, empates: 8, derrotas: 10, interrompida: true, demitido: true, posicao: 15 },
    { ano: 2047, clube: 'Guarani', vitorias: 10, empates: 12, derrotas: 16, posicao: 13 }
  ];
  const resumo = historicoProfissionalTecnico({ ...c.tecnico, temporadas, reunioes: [{}, {}] });
  assert.equal(resumo.jogos, 106);
  assert.equal(resumo.vitorias, 42);
  assert.equal(resumo.titulos, 1);
  assert.equal(resumo.demissoes, 1);
  assert.equal(resumo.clubes.length, 2);
  assert.equal(resumo.clubes[0].temporadas, 2);
  assert.equal(resumo.clubes[0].demissoes, 1);
  assert.equal(resumo.reunioes, 2);
  assert.equal(c.totais.gols, atleta.totais.gols);
});

test('objetivos são definidos pelo perfil do clube e não pela fama do treinador', () => {
  const forte = CLUBES.reduce((a, b) => b.forca > a.forca ? b : a);
  const fraco = CLUBES.reduce((a, b) => b.forca < a.forca ? b : a);
  const elite = perfilClubeTecnico({ clube: forte.nome, reputacao: 20 });
  const pequeno = perfilClubeTecnico({ clube: fraco.nome, reputacao: 99 });
  assert.equal(elite.forca, forte.forca);
  assert.equal(pequeno.forca, fraco.forca);
  assert.equal(objetivoTecnico({ clube: forte.nome, reputacao: 20 }).id,
    objetivoTecnico({ clube: forte.nome, reputacao: 99 }).id);
  assert.equal(objetivoTecnico({ clube: fraco.nome, reputacao: 20 }).id,
    objetivoTecnico({ clube: fraco.nome, reputacao: 99 }).id);
  const oferta = gerarPropostasTecnico({ ...iniciarCarreiraTecnico(atleta).tecnico, reputacao: 99 }, () => 0)[0];
  if (oferta) assert.equal(oferta.objetivo, objetivoTecnico({ clube: oferta.nome }).nome);
});

test('força do elenco influencia chance de vitória sem tornar título automático', () => {
  const fraco = probabilidadesTecnico({ elenco: 42, moral: 50, reputacao: 60, estilo: 'equilibrado' });
  const medio = probabilidadesTecnico({ elenco: 65, moral: 50, reputacao: 60, estilo: 'equilibrado' });
  const forte = probabilidadesTecnico({ elenco: 90, moral: 50, reputacao: 60, estilo: 'equilibrado' });
  assert.ok(fraco.vitoria < medio.vitoria && medio.vitoria < forte.vitoria);
  assert.ok(forte.vitoria < 0.70);
  assert.ok(fraco.derrota > forte.derrota);
  for (const p of [fraco, medio, forte]) assert.ok(Math.abs(p.vitoria + p.empate + p.derrota - 1) < 1e-9);
  assert.ok(probabilidadesTecnico({ elenco: 65, moral: 85 }).vitoria > probabilidadesTecnico({ elenco: 65, moral: 20 }).vitoria);
});

test('calendário de confrontos mantém 38 rodadas, adversários reais e mando de campo', () => {
  const clube = CLUBES[0];
  const calendario = calendarioAdversariosTecnico({ clube: clube.nome, elenco: clube.forca });
  assert.equal(calendario.length, 38);
  assert.ok(calendario.every((j, i) => j.rodada === i + 1 && j.nome !== clube.nome));
  assert.ok(calendario.every(j => CLUBES.some(x => x.nome === j.nome)));
  assert.equal(calendario[0].casa, !calendario[19].casa);
});
test('jogar em casa e enfrentar adversário fraco aumentam chance de vitória', () => {
  const t = { elenco: 65, moral: 50, reputacao: 60, estilo: 'equilibrado' };
  const facil = probabilidadesConfrontoTecnico(t, { forca: 40, casa: true });
  const dificil = probabilidadesConfrontoTecnico(t, { forca: 85, casa: false });
  assert.ok(facil.vitoria > dificil.vitoria);
  assert.ok(Math.abs(facil.vitoria + facil.empate + facil.derrota - 1) < 1e-9);
});
test('confrontos persistem entre as etapas sem repetir resultados', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }) } };
  c = simularEtapaTecnico(c, () => 0.4);
  const primeira = c.tecnico.andamento.confrontos.map(x => ({ ...x }));
  assert.equal(primeira.length, 10);
  c = simularEtapaTecnico(c, () => 0.4);
  assert.deepEqual(c.tecnico.andamento.confrontos.slice(0, 10), primeira);
  assert.equal(c.tecnico.andamento.confrontos.length, 19);
});

test('tabela classifica por pontos e vitórias, destacando o clube treinado', () => {
  const clube = CLUBES[0];
  const t = { clube: clube.nome, elenco: clube.forca };
  const tabela = tabelaClassificacaoTecnico(t, { jogos: 10, pontos: 19, vitorias: 6, empates: 1, derrotas: 3 });
  assert.ok(tabela.length > 1);
  assert.equal(tabela.filter(x => x.meuClube).length, 1);
  assert.ok(tabela.every(x => x.jogos === 10 && x.vitorias + x.empates + x.derrotas === 10));
  assert.ok(tabela.every((x, i) => x.posicao === i + 1));
  assert.ok(tabela.every((x, i) => !i || tabela[i - 1].pontos >= x.pontos));
});
test('posição da etapa corresponde à tabela e permanece no andamento', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }) } };
  c = simularEtapaTecnico(c, () => 0.4);
  const tabela = c.tecnico.andamento.classificacao;
  assert.equal(tabela.find(x => x.meuClube).pontos, c.tecnico.andamento.pontos);
  assert.equal(tabela.find(x => x.meuClube).jogos, 10);
});

test('liga evolui por resultados dos rivais sem recalcular rodadas anteriores', () => {
  const clube = CLUBES.find(x => CLUBES.filter(y => y.liga === x.liga).length >= 20);
  if (!clube) return;
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, clube: clube.nome, elenco: clube.forca, decisoes: Array(4).fill({ id: 'teste' }) } };
  c = simularEtapaTecnico(c, () => 0.4);
  const tabela = c.tecnico.andamento.classificacao;
  assert.equal(tabela.length, 20);
  assert.ok(tabela.every(x => x.jogos === 10));
  const totalPontos = tabela.reduce((n, x) => n + x.pontos, 0);
  assert.ok(totalPontos <= 10 * 10 * 3);
  c = simularEtapaTecnico(c, () => 0.4);
  assert.ok(c.tecnico.andamento.classificacao.every(x => x.jogos === 19));
  assert.equal(c.tecnico.andamento.classificacao.find(x => x.meuClube).pontos, c.tecnico.andamento.pontos);
});

test('liga de 20 clubes possui 380 jogos únicos por turno e returno invertido', () => {
  const clube = CLUBES.find(x => CLUBES.filter(y => y.liga === x.liga).length === 20);
  if (!clube) return;
  const calendario = calendarioLigaTecnico({ clube: clube.nome });
  assert.equal(calendario.length, 38);
  const ida = new Set();
  for (let r = 0; r < 38; r++) {
    assert.equal(calendario[r].length, 10);
    assert.equal(new Set(calendario[r].flatMap(j => [j.casa, j.fora])).size, 20);
    for (const j of calendario[r]) {
      const chave = [j.casa, j.fora].sort().join('|');
      if (r < 19) { assert.ok(!ida.has(chave)); ida.add(chave); }
      else assert.ok(ida.has(chave));
    }
  }
  assert.equal(ida.size, 190);
  for (let r = 0; r < 19; r++) {
    const volta = calendario[r + 19];
    for (const j of calendario[r]) assert.ok(volta.some(v => v.casa === j.fora && v.fora === j.casa));
  }
});

test('desempate por vitórias e saldo de gols e marcação de zonas', () => {
  const tabela = ordenarClassificacaoTecnico([
    { nome: 'C', pontos: 10, vitorias: 3, saldoGols: 1 },
    { nome: 'B', pontos: 10, vitorias: 4, saldoGols: 0 },
    { nome: 'A', pontos: 10, vitorias: 4, saldoGols: 3 }
  ]);
  assert.deepEqual(tabela.map(x => x.nome), ['A', 'B', 'C']);
  assert.equal(zonaClassificacaoTecnico(1, 20), 'campeao');
  assert.equal(zonaClassificacaoTecnico(4, 20), 'continental');
  assert.equal(zonaClassificacaoTecnico(17, 20), 'rebaixamento');
  assert.equal(zonaClassificacaoTecnico(10, 20), 'meio');
});

test('placares respeitam vitória, empate e derrota', () => {
  for (const resultado of ['V', 'E', 'D']) {
    const p = placarTecnico(resultado, () => 0.5);
    assert.ok(p.pro >= 0 && p.contra >= 0);
    assert.equal(Math.sign(p.pro - p.contra), resultado === 'V' ? 1 : resultado === 'D' ? -1 : 0);
  }
});
test('saldo de gols da classificação corresponde aos confrontos registrados', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(4).fill({ id: 'teste' }) } };
  c = simularEtapaTecnico(c, () => 0.4);
  const partidas = c.tecnico.andamento.confrontos;
  const time = c.tecnico.andamento.classificacao.find(x => x.meuClube);
  assert.equal(time.golsPro, partidas.reduce((n, j) => n + j.golsPro, 0));
  assert.equal(time.golsContra, partidas.reduce((n, j) => n + j.golsContra, 0));
  assert.equal(time.saldoGols, time.golsPro - time.golsContra);
});

test('carreira continua por duas temporadas sem perder histórico ou duplicar jogos', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(QUANTIDADE_DECISOES_TECNICO).fill({ id: 'teste' }), diretoria: 95, torcida: 95, elenco: 90, reputacao: 90 } };
  for (let temporada = 0; temporada < 2; temporada++) {
    for (const marco of ETAPAS_TEMPORADA_TECNICO) {
      c = simularEtapaTecnico(c, () => 0.01);
      if (marco < 38) {
        assert.equal(c.tecnico.andamento.jogos, marco);
        assert.equal(c.tecnico.andamento.confrontos.length, marco);
      }
    }
    assert.equal(c.tecnico.fase, 'resultado');
    assert.equal(c.tecnico.temporadas.length, temporada + 1);
    assert.equal(c.tecnico.temporadas.at(-1).confrontos.length, 38);
    const final = c.tecnico.temporadas.at(-1);
    assert.equal(final.vitorias + final.empates + final.derrotas, 38);
    assert.equal(final.pontos, final.vitorias * 3 + final.empates);
    assert.equal(final.classificacao.find(x => x.meuClube).pontos, final.pontos);
    assert.equal(final.classificacao.find(x => x.meuClube).saldoGols,
      final.confrontos.reduce((n, jogo) => n + jogo.golsPro - jogo.golsContra, 0));
    assert.equal(new Set(final.classificacao.map(x => x.posicao)).size, final.classificacao.length);
    assert.ok(final.classificacao.every(x => x.jogos === 38));
    if (temporada === 0) {
      assert.equal(c.tecnico.demitido, false);
      c = proximaTemporadaTecnico(c);
      assert.equal(c.tecnico.andamento, null);
      assert.equal(c.tecnico.decisoes.length, 0);
      c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(QUANTIDADE_DECISOES_TECNICO).fill({ id: 'teste' }) } };
    }
  }
  assert.equal(c.tecnico.temporadas.length, 2);
  assert.equal(historicoProfissionalTecnico(c.tecnico).jogos, 76);
  assert.equal(c.tecnico.temporadas[0].confrontos.length, 38);
});

test('save JSON no meio da temporada retoma sem repetir partidas', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(QUANTIDADE_DECISOES_TECNICO).fill({ id: 'teste' }), diretoria: 95, torcida: 95, elenco: 90 } };
  c = simularEtapaTecnico(c, () => 0.01);
  const anterior = JSON.stringify(c);
  const salvo = JSON.parse(anterior);
  const retomado = simularEtapaTecnico(salvo, () => 0.01);
  assert.equal(JSON.stringify(c), anterior);
  assert.equal(retomado.tecnico.andamento.jogos, 19);
  assert.equal(retomado.tecnico.andamento.confrontos.length, 19);
  assert.deepEqual(retomado.tecnico.andamento.confrontos.slice(0, 10), c.tecnico.andamento.confrontos);
  assert.equal(retomado.tecnico.andamento.classificacao.find(x => x.meuClube).jogos, 19);
});
test('save antigo sem placares é migrado sem alterar o objeto original', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = { ...c, tecnico: { ...c.tecnico, decisoes: Array(QUANTIDADE_DECISOES_TECNICO).fill({ id: 'teste' }), diretoria: 95, torcida: 95, elenco: 90 } };
  c = simularEtapaTecnico(c, () => 0.01);
  const antigo = JSON.parse(JSON.stringify(c));
  antigo.tecnico.andamento.confrontos.forEach(j => { delete j.golsPro; delete j.golsContra; });
  const snapshot = JSON.stringify(antigo);
  const retomado = simularEtapaTecnico(antigo, () => 0.01);
  assert.equal(JSON.stringify(antigo), snapshot);
  assert.ok(retomado.tecnico.andamento.confrontos.every(j => Number.isFinite(j.golsPro) && Number.isFinite(j.golsContra)));
  assert.equal(retomado.tecnico.andamento.confrontos.length, 19);
  const time = retomado.tecnico.andamento.classificacao.find(x => x.meuClube);
  assert.equal(time.saldoGols, time.golsPro - time.golsContra);
});
