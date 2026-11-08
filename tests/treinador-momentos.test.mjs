import test from 'node:test';
import assert from 'node:assert/strict';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import * as T from '../src/treinador/tecnico.js';
import { cartaPretemporadaRapida } from '../src/treinador/pretemporadaRapida.js';
import { simularCopaSelecaoTecnico, finalDoUsuarioTecnico, evoluirPersonagensTecnico, chanceFinalTecnico } from '../src/treinador/momentosTecnico.js';

const carreira = (clube = 'Bahia', ritmo = 'normal') => {
  let c = T.iniciarCarreiraTecnico(aposentar({ ...criarJogador({ nome: 'Momentos', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo, codigo: 'MOMENTOS-' + clube }), idade: 38 }));
  const d = T.CLUBES_CONVITES_TECNICO.find(x => x.nome === clube);
  c = { ...c, ritmo, tecnico: { ...c.tecnico, clube, liga: d.liga, pais: d.pais, elenco: d.elenco, clubeInicialEscolhido: true, reputacao: 60 } };
  return c;
};
// Responde clássicos contra o técnico rival até a temporada fechar ou parar numa parada comum.
const passarClassicos = (c, escolha = 'atacar') => { while (c.tecnico.fase === 'parada' && c.tecnico.paradaPendente?.tipo === 'rival') c = T.responderParadaTecnico(c, c.tecnico.paradaPendente.chave, escolha); return c; };
const jogar = (c, opcoes) => { const carta = cartaPretemporadaRapida(c.tecnico, 1); return T.escolherPretemporadaRapidaTecnico(c, carta.chave, carta.opcoes.at(-1).id, undefined, opcoes); };

test('força volta para perto da base do clube a cada ano', () => {
  let c = carreira('Bahia');
  c = { ...c, tecnico: { ...c.tecnico, elenco: 90, fase: 'resultado', temporadas: [{}] } };
  const prox = T.proximaTemporadaTecnico(c);
  assert.equal(prox.tecnico.elenco, 71 + 5); // base 71 + no máximo 5 herdados
  assert.ok(prox.tecnico.diretoria <= c.tecnico.diretoria);
});

test('sem a tela, a temporada roda inteira; com a tela, para no meio do ritmo normal', () => {
  const direto = jogar(carreira());
  assert.equal(direto.tecnico.fase, 'resultado');
  const interativo = jogar(carreira(), { interativo: true });
  assert.equal(interativo.tecnico.fase, 'parada');
  const p = interativo.tecnico.paradaPendente;
  assert.equal(p.rodada, Math.round(p.total / 2));
  assert.notEqual(p.tipo, 'rival');
  const fim = passarClassicos(T.responderParadaTecnico(interativo, p.chave, T.OPCOES_PARADA_TECNICO[p.crise ? 'crise' : 'normal'][0].id));
  assert.equal(fim.tecnico.fase, 'resultado');
  assert.equal(fim.tecnico.temporadas[0].paradas.length, 1);
  assert.equal(fim.tecnico.temporadas[0].confrontos.slice(0, p.rodada).length, p.rodada);
  // Clique repetido com a chave antiga não simula de novo.
  assert.equal(T.responderParadaTecnico(fim, p.chave, 'apertar'), fim);
  assert.equal(jogar(carreira('Bahia', 'expresso'), { interativo: true }).tecnico.fase, 'resultado');
  const intenso = jogar(carreira('Bahia', 'intenso'), { interativo: true });
  const segunda = passarClassicos(T.responderParadaTecnico(intenso, intenso.tecnico.paradaPendente.chave, T.OPCOES_PARADA_TECNICO[intenso.tecnico.paradaPendente.crise ? 'crise' : 'normal'][1].id));
  assert.equal(segunda.tecnico.fase, 'parada');
  assert.ok(segunda.tecnico.paradaPendente.rodada > intenso.tecnico.paradaPendente.rodada);
});

test('final pendente: a escolha muda a chance, o sorteio fica guardado e a taça entra uma vez', () => {
  const f = { nome: 'Copa do Brasil', tipo: 'copa', lado: 'Bahia', adversario: 'Flamengo', ano: 2030, forcaUsuario: 72, forcaAdv: 86, dado: 0.2 };
  assert.ok(chanceFinalTecnico(f, 'segurar') > chanceFinalTecnico(f, 'atacar'));
  let c = carreira();
  const torneio = { nome: 'Copa do Brasil', tipo: 'copa', campeao: null, finalPendente: true, faseUsuario: 'Final', fases: [{ fase: 'Final', jogos: [{ casa: 'Bahia', fora: 'Flamengo', golsCasa: 0, golsFora: 1, vencedor: 'Flamengo' }] }] };
  c = { ...c, tecnico: { ...c.tecnico, fase: 'resultado', titulos: 0, temporadas: [{ ano: 2030, clube: 'Bahia', titulosConquistados: [], torneios: [torneio] }], finaisPendentes: [f] } };
  assert.deepEqual(finalDoUsuarioTecnico(torneio, 'Bahia').adversario, 'Flamengo');
  const fim = T.resolverFinalTecnico(c, 'Copa do Brasil', 'segurar');
  assert.equal(fim.tecnico.ultimaFinal.venceu, true);
  assert.equal(fim.tecnico.titulos, 1);
  assert.deepEqual(fim.tecnico.temporadas[0].titulosConquistados, ['Copa do Brasil']);
  assert.equal(fim.tecnico.temporadas[0].torneios[0].campeao, 'Bahia');
  assert.equal(T.resolverFinalTecnico(fim, 'Copa do Brasil', 'atacar'), fim);
  const perdeu = T.resolverFinalTecnico({ ...c, tecnico: { ...c.tecnico, finaisPendentes: [{ ...f, dado: 0.99 }] } }, 'Copa do Brasil', 'atacar');
  assert.equal(perdeu.tecnico.titulos, 0);
  assert.equal(perdeu.tecnico.temporadas[0].torneios[0].faseUsuario, 'Final');
  // Avançar sem decidir resolve a final com o jogo controlado.
  assert.equal(T.proximaTemporadaTecnico(c).tecnico.finaisPendentes?.length ?? 0, 0);
});

test('Copa do Mundo da seleção: convite, campanha e ninguém passa da semifinal para a "final" errada', () => {
  const fases = {};
  for (let i = 0; i < 300; i++) { const x = simularCopaSelecaoTecnico({ ano: 2030, nac: 'BRA', selecao: 'Brasil', forca: 88 }, 70, 's' + i); fases[x.faseUsuario] = (fases[x.faseUsuario] || 0) + 1; if (x.fases.at(-1)?.fase !== 'Final') assert.equal(finalDoUsuarioTecnico(x, 'Brasil'), null); }
  assert.ok((fases['Campeão'] || 0) < 60, JSON.stringify(fases));
  let c = carreira();
  c = { ...c, tecnico: { ...c.tecnico, fase: 'resultado', titulos: 0, temporadas: [{ ano: 2030, clube: 'Bahia', titulosConquistados: [], torneios: [] }], conviteSelecao: { ano: 2030, nac: 'BRA', selecao: 'Brasil', forca: 88, status: 'pendente' } } };
  assert.equal(T.responderConviteSelecaoTecnico(c, false).tecnico.conviteSelecao.status, 'recusado');
  const aceito = T.concluirFinaisPendentesTecnico(T.responderConviteSelecaoTecnico(c, true, { interativo: true }));
  const copa = aceito.tecnico.temporadas[0].torneios.find(x => x.tipo === 'copaMundo');
  assert.ok(copa);
  assert.equal(aceito.tecnico.clube, 'Bahia');
  assert.equal(T.titulosConquistadosTecnico(aceito.tecnico).length, aceito.tecnico.titulos);
});

test('ano sem clube tem escolhas com efeitos diferentes', () => {
  const base = carreira();
  const c = { ...base, tecnico: { ...base.tecnico, fase: 'resultado', demitido: true, reputacao: 50, formacaoLoja: 0, propostas: [] } };
  assert.equal(T.passarAnoDesempregado(c, () => .5, 'curso').tecnico.formacaoLoja, 1);
  assert.equal(T.passarAnoDesempregado(c, () => .5, 'comentarista').tecnico.reputacao, 53);
  assert.equal(T.passarAnoDesempregado(c, () => .5, 'estagio').tecnico.estagioExterior, true);
  assert.equal(T.passarAnoDesempregado(c, () => .5).tecnico.reputacao, 48);
});

test('personagens evoluem e metas da carreira são registradas', () => {
  const t = { clube: 'Bahia', ano: 2031, elenco: 71, personagens: [{ id: 'x', nome: 'Garoto Lima', nivel: 70, potencial: 84, idade: 19, tipo: 'promessa', clube: 'Bahia', desde: 2030, status: 'ativo' }, { id: 'y', nome: 'Pedro Bastos', nivel: 76, potencial: 76, idade: 34, tipo: 'veterano', clube: 'Bahia', desde: 2030, status: 'ativo' }] };
  const ano = evoluirPersonagensTecnico(t);
  assert.ok(ano.personagens[0].nivel > 70);
  assert.equal(ano.personagens[1].status, 'aposentado');
  assert.ok(ano.noticias.some(n => n.includes('Pedro Bastos')));
  const metas = T.metasDoTecnico({ temporadas: [{ clube: 'Bahia', vitorias: 120, campeao: true, titulosConquistados: ['Brasileirão'], objetivo: 'Evitar rebaixamento', cumpriuObjetivo: true }] });
  assert.equal(metas.find(m => m.id === 'cem-vitorias').feito, true);
  assert.equal(metas.find(m => m.id === 'tres-paises').feito, false);
});

test('clássico contra o técnico rival: pausa própria, escolha vale para o jogo e entra no resumo', () => {
  let c = jogar(carreira('Flamengo'), { interativo: true });
  const p0 = c.tecnico.paradaPendente;
  c = T.responderParadaTecnico(c, p0.chave, T.OPCOES_PARADA_TECNICO[p0.crise ? 'crise' : 'normal'][0].id);
  assert.equal(c.tecnico.fase, 'parada');
  const p = c.tecnico.paradaPendente;
  assert.equal(p.tipo, 'rival');
  assert.ok(p.rival.clube && p.rival.nome);
  const fim = T.responderParadaTecnico(c, p.chave, 'provocar');
  assert.equal(fim.tecnico.fase, 'resultado');
  const a = fim.tecnico.temporadas.at(-1);
  assert.equal(a.classico.clube, p.rival.clube);
  assert.equal(a.classico.escolha, 'provocar');
  assert.equal(a.confrontos[p.rodada - 1].nome, p.rival.clube);
  assert.equal(a.vitorias + a.empates + a.derrotas, a.jogos);
  assert.equal(T.responderParadaTecnico(fim, p.chave, 'atacar'), fim);
  // Sem a tela não há pausa de clássico.
  assert.equal(jogar(carreira('Flamengo')).tecnico.temporadas.at(-1).classico, undefined);
});

test('estreia no clube do coração grande: contrato de um ano e opção de começar por baixo', () => {
  const jogador = { ...aposentar({ ...criarJogador({ nome: 'Ídolo', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'IDOLO-CURTO' }), idade: 38 }),
    temporadas: Array.from({ length: 6 }, (_, i) => ({ ano: 2020 + i, clube: 'Flamengo', jogos: 40, titulos: ['Brasileirão'], nota: 7.5 })), torcida: { Flamengo: 90 } };
  const c = T.iniciarCarreiraTecnico(jogador);
  const fla = c.tecnico.opcoesInicio.find(o => o.clube === 'Flamengo');
  assert.equal(fla.contratoCurto, true);
  const menor = c.tecnico.opcoesInicio.find(o => o.menor);
  assert.ok(menor, 'há um projeto menor no mesmo país');
  const noFla = T.iniciarNoClubeIdolo(c, 'Flamengo');
  assert.deepEqual(noFla.tecnico.contratoCurto, { clube: 'Flamengo', ano: c.tecnico.ano });
  // Meta não cumprida no contrato curto: não renova.
  const t = { ...noFla.tecnico, elenco: 40 };
  const carta = cartaPretemporadaRapida(t, 1);
  const fim = T.escolherPretemporadaRapidaTecnico({ ...noFla, tecnico: t }, carta.chave, carta.opcoes[0].id);
  const a = fim.tecnico.temporadas[0];
  assert.equal(a.contratoCurto, a.cumpriuObjetivo ? 'renovado' : 'encerrado');
  if (!a.cumpriuObjetivo) assert.equal(fim.tecnico.demitido, true);
  assert.equal(fim.tecnico.contratoCurto, null);
  const noMenor = T.iniciarNoClubeIdolo(c, menor.clube);
  assert.equal(noMenor.tecnico.contratoCurto, null);
});

test('convite do clube do coração chega depois de um bom trabalho em outro lugar', () => {
  const temporadas = [{ ano: 2030, clube: 'Bahia', cumpriuObjetivo: true, posicao: 3, titulosConquistados: [] }, { ano: 2031, clube: 'Bahia', cumpriuObjetivo: true, posicao: 3, titulosConquistados: [] }];
  const t = { clube: 'Bahia', liga: 'brasileirao', pais: 'Brasil', reputacao: 60, ano: 2032, temporadas, vinculosJogador: [{ clube: 'Flamengo', idolatria: true, temporadas: 6, afinidade: 90 }] };
  const ofertas = T.gerarPropostasTecnico(t, () => 0.99);
  assert.equal(ofertas[0].nome, 'Flamengo');
  assert.equal(ofertas[0].conviteIdolo, true);
});

test('cartas que batem no teto dão lugar a outras', async () => {
  const { cartaNoLimiteRapida, planoPretemporadaRapida } = await import('../src/treinador/pretemporadaRapida.js');
  for (let ano = 2030; ano < 2060; ano++) {
    const t = { clube: 'Real Madrid', ano, elenco: 99, moral: 95, torcida: 100, diretoria: 100 };
    const carta = cartaPretemporadaRapida(t, 1);
    assert.equal(cartaNoLimiteRapida(t, carta), false, `${ano}: ${carta.id}`);
    assert.ok(planoPretemporadaRapida(t).cartas.length === 1);
  }
});

test('legado completo soma jogador e treinador', () => {
  const c = { totais: { gols: 200, assist: 50 }, legado: { pontos: 500, nivel: { nome: 'Estrela internacional' } }, titulos: { bolaOuro: 1 }, lista: [{ nome: 'Brasileirão' }],
    temporadas: [{ clube: 'Bahia' }, { clube: 'Flamengo' }],
    tecnico: { temporadas: [{ ano: 2040, clube: 'Bahia', vitorias: 20, campeao: true, titulosConquistados: ['Brasileirão', 'Copa Libertadores'] }] } };
  const l = T.legadoCompletoTecnico(c);
  assert.equal(l.jogador.pontos, 500);
  assert.equal(l.treinador.titulos, 2);
  assert.ok(l.treinador.pontos >= 27);
  assert.equal(l.total, l.jogador.pontos + l.treinador.pontos);
  assert.deepEqual(l.clubesDuasEras, ['Bahia']);
});
