import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico, carreiraTecnicoEncerrada, LIMITE_TEMPORADAS_TECNICO } from '../tecnico.js';
import { desenhoDaTaca } from '../tacas.js';

const atleta = { nome: 'Teste expresso', idade: 39, ano: 2040, clubeNome: 'Santos', aposentado: true, legado: { pontos: 600 }, temporadas: [{ ano: 2037, clube: 'Santos' }, { ano: 2038, clube: 'Santos' }, { ano: 2039, clube: 'Santos' }], totais: { gols: 150 } };
const sorteio = () => 0.5;

test('simulação expressa preserva a carreira do jogador e não exige decisões', () => {
  let c = iniciarCarreiraTecnico(atleta);
  assert.ok(c.tecnico.opcoesInicio.length > 0);
  c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  const original = c.temporadas;
  const ano = c.tecnico.ano;
  c = jogarTemporadaExpressaTecnico(c, null, sorteio);
  assert.equal(c.temporadas, original);
  assert.equal(c.tecnico.fase, 'resultado');
  assert.equal(c.tecnico.temporadas.length, 1);
  assert.equal(c.tecnico.temporadas[0].ano, ano);
  assert.equal(c.tecnico.ano, ano + 1);
  assert.equal(c.tecnico.temporadas[0].decisoes.length, 4);
  assert.ok(c.tecnico.temporadas[0].decisoes.every(d => d.opcao === 'neutra'));
  assert.equal(c.tecnico.temporadas[0].classificacao.find(x => x.meuClube).posicao, c.tecnico.temporadas[0].posicao);
});

test('limite de 30 temporadas impede simulação adicional', () => {
  const c = iniciarCarreiraTecnico(atleta);
  const cheio = { ...c, tecnico: { ...c.tecnico, temporadas: Array.from({ length: LIMITE_TEMPORADAS_TECNICO }, (_, i) => ({ ano: 2040 + i })) } };
  assert.equal(carreiraTecnicoEncerrada(cheio.tecnico), true);
  assert.throws(() => jogarTemporadaExpressaTecnico(cheio, null, sorteio), /encerrada/);
  assert.throws(() => proximaTemporadaTecnico({ ...cheio, tecnico: { ...cheio.tecnico, fase: 'resultado' } }), /30 temporadas/);
});

test('nomes de taças do treinador usam desenhos específicos', () => {
  assert.deepEqual(desenhoDaTaca('continental', 'Copa Libertadores'), desenhoDaTaca('continental', 'Libertadores'));
  assert.deepEqual(desenhoDaTaca('continental', 'UEFA Champions League'), desenhoDaTaca('continental', 'Champions League'));
  assert.deepEqual(desenhoDaTaca('liga', 'Campeonato Brasileiro Série A'), desenhoDaTaca('liga', 'Brasileirão'));
  assert.deepEqual(desenhoDaTaca('segunda', 'Campeonato Brasileiro Série B'), desenhoDaTaca('segunda', 'Brasileirão Série B'));
});

test('30 temporadas expressas acumulam histórico e encerram a carreira', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  const anoInicial = c.tecnico.ano;
  for (let i = 0; i < LIMITE_TEMPORADAS_TECNICO; i++) {
    c = jogarTemporadaExpressaTecnico(c, null, () => 0.48);
    assert.equal(c.tecnico.temporadas.length, i + 1);
    assert.equal(c.tecnico.temporadas[i].ano, anoInicial + i);
    assert.equal(c.tecnico.temporadas[i].vitorias + c.tecnico.temporadas[i].empates + c.tecnico.temporadas[i].derrotas, 38);
    assert.equal(c.tecnico.temporadas[i].classificacao.find(x => x.meuClube).posicao, c.tecnico.temporadas[i].posicao);
    const linhas = c.tecnico.temporadas[i].classificacao;
    if (linhas.length === 20) {
      assert.ok(linhas.every(x => x.jogos === 38), 'todos os clubes precisam completar 38 jogos');
      assert.equal(linhas.reduce((total, x) => total + x.vitorias, 0),
        linhas.reduce((total, x) => total + x.derrotas, 0), 'vitórias e derrotas da liga devem coincidir');
      assert.equal(linhas.reduce((total, x) => total + x.golsPro, 0),
        linhas.reduce((total, x) => total + x.golsContra, 0), 'gols marcados e sofridos devem coincidir');
    }
    if (i < LIMITE_TEMPORADAS_TECNICO - 1) {
      // A demissão é desativada neste teste para isolar o limite de temporadas.
      c = proximaTemporadaTecnico({ ...c, tecnico: { ...c.tecnico, demitido: false, desempregado: false } });
    }
  }
  assert.equal(c.tecnico.ano, anoInicial + LIMITE_TEMPORADAS_TECNICO);
  assert.equal(c.tecnico.temporadas.length, 30);
  assert.equal(carreiraTecnicoEncerrada(c.tecnico), true);
  assert.throws(() => jogarTemporadaExpressaTecnico({ ...c, tecnico: { ...c.tecnico, fase: 'pretemporada' } }, null, sorteio), /encerrada/);
});

test('a vitrine de treinador reúne títulos reais do histórico sem alterar o legado de jogador', async () => {
  const { titulosConquistadosTecnico } = await import('../tecnico.js');
  const c = iniciarCarreiraTecnico(atleta);
  const tecnico = { ...c.tecnico, temporadas: [
    { ano: 2040, clube: 'Santos', liga: 'brasileirao', campeao: true, titulosConquistados: ['Brasileirão', 'Copa do Brasil'] },
    { ano: 2041, clube: 'Santos', liga: 'brasileirao', campeao: false, titulosConquistados: [] },
    { ano: 2042, clube: 'Santos', liga: 'brasileirao', campeao: true }
  ] };
  const titulos = titulosConquistadosTecnico(tecnico);
  assert.deepEqual(titulos.map(t => t.nome), ['Brasileirão', 'Copa do Brasil', 'Brasileirão']);
  assert.deepEqual(titulos.map(t => t.ano), [2040, 2040, 2042]);
  assert.equal(c.temporadas.length, atleta.temporadas.length);
});

test('tabela de clube promovido usa os mesmos participantes do calendário', async () => {
  const { CLUBES_CONVITES_TECNICO, calendarioLigaTecnico, tabelaClassificacaoTecnico } = await import('../tecnico.js');
  const candidato = CLUBES_CONVITES_TECNICO.find(x => x.liga === 'serieB');
  assert.ok(candidato, 'precisa existir um clube da Série B');
  const t = { clube: candidato.nome, liga: 'brasileirao', elenco: candidato.elenco };
  const calendario = calendarioLigaTecnico(t);
  assert.ok(calendario, 'a divisão de destino precisa ter calendário completo');
  const nomesCalendario = [...new Set(calendario[0].flatMap(j => [j.casa, j.fora]))].sort();
  const classificacao = tabelaClassificacaoTecnico(t, { jogos: 0 });
  assert.equal(classificacao.length, 20);
  assert.deepEqual(classificacao.map(x => x.nome).sort(), nomesCalendario);
});

test('participantes persistidos são usados no calendário da mesma divisão', async () => {
  const { calendarioLigaTecnico, CLUBES_CONVITES_TECNICO } = await import('../tecnico.js');
  const clube = CLUBES_CONVITES_TECNICO.find(x => x.liga === 'brasileirao');
  const nomes = CLUBES_CONVITES_TECNICO.filter(x => x.liga === 'brasileirao').slice(0, 20).map(x => x.nome);
  assert.equal(nomes.length, 20);
  const t = { clube: clube.nome, liga: 'brasileirao', participantesLiga: { liga: 'brasileirao', nomes } };
  const calendario = calendarioLigaTecnico(t);
  assert.deepEqual([...new Set(calendario[0].flatMap(j => [j.casa, j.fora]))].sort(), [...nomes].sort());
  const outraDivisao = calendarioLigaTecnico({ ...t, liga: 'serieB' });
  assert.ok(outraDivisao);
  assert.notDeepEqual([...new Set(outraDivisao[0].flatMap(j => [j.casa, j.fora]))].sort(), [...nomes].sort());
});

test('histórico por clube e geral contam taças de ligas e copas', async () => {
  const { historicoProfissionalTecnico } = await import('../tecnico.js');
  const historico = historicoProfissionalTecnico({ temporadas: [
    { ano: 2040, clube: 'Santos', campeao: true, titulosConquistados: ['Brasileirão', 'Copa do Brasil'] },
    { ano: 2041, clube: 'Santos', campeao: false, titulosConquistados: [] },
    { ano: 2042, clube: 'Santos', campeao: true }
  ] });
  assert.equal(historico.titulos, 3);
  assert.equal(historico.clubes[0].titulos, 3);
});
