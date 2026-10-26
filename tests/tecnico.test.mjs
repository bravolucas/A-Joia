import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, definirEstiloTecnico, tomarDecisaoTecnico, cartaAtualTecnico, sortearCartasTecnico, objetivoTecnico, calcularOvrTecnico, riscoDemissaoTecnico, gerarPropostasTecnico, salarioTecnico, passarAnoDesempregado, aceitarPropostaTecnico, TODAS_CARTAS_TECNICO, elegivelTecnico, QUANTIDADE_DECISOES_TECNICO, simularTemporadaTecnico, proximaTemporadaTecnico } from '../tecnico.js';

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

test('objetivos dependem da reputação e força do elenco', () => {
  assert.equal(objetivoTecnico({ reputacao: 30, elenco: 45 }).id, 'permanencia');
  assert.equal(objetivoTecnico({ reputacao: 90, elenco: 80 }).id, 'titulo');
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
  assert.ok(!gerarPropostasTecnico(iniciante).some(p => p.nome === 'Gigante Mundial'));
  const consagrado = { reputacao: 99, temporadas: Array(10).fill({}), titulos: 5, vitorias: 300, empates: 40, derrotas: 40, clube: 'Outro' };
  assert.ok(gerarPropostasTecnico(consagrado).some(p => p.nome === 'Gigante Mundial'));
});

test('ofertas dependem do sorteio e do OVR, sem garantir clubes grandes', () => {
  const consagrado = { reputacao: 99, temporadas: Array(10).fill({ clube: 'Projeto Emergente' }), titulos: 5, vitorias: 300, empates: 40, derrotas: 40, clube: 'Outro' };
  assert.equal(gerarPropostasTecnico(consagrado, () => 0.99).length, 0);
  assert.ok(gerarPropostasTecnico(consagrado, () => 0).length > 0);
  assert.ok(salarioTecnico({ ...consagrado, clube: 'Gigante Mundial' }) > salarioTecnico({ ...consagrado, clube: 'Clube do Interior' }));
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
  c = aceitarPropostaTecnico(c, c.tecnico.propostas[0].nome);
  assert.equal(c.tecnico.desempregado, false);
  assert.equal(proximaTemporadaTecnico(c).tecnico.fase, 'pretemporada');
});
