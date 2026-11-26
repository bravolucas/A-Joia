import {resolverOuReusarPlayoffsSerieB} from '../simulacao/playoffsSerieB.js';
import {ordenarTabelaBrasileira} from '../simulacao/desempateBrasileiro.js';
import {simularSerieC, regulamentoSerieC} from '../simulacao/serieC.js';
import {progredirBrasilInferior} from '../simulacao/progressaoBrasilInferior.js';

import {sortearPlacar} from '../competicoes/motorPartida.js';

const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));

function criarTabela(clubes) {
  return new Map(clubes.map(clube => [clube.nome, {
    nome: clube.nome,
    jogos: 0,
    pontos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0,
    saldoGols: 0,
  }]));
}

function registrarPartida(tabela, casa, fora, golsCasa, golsFora) {
  const a = tabela.get(casa.nome);
  const b = tabela.get(fora.nome);
  a.jogos++;
  b.jogos++;
  a.golsPro += golsCasa;
  a.golsContra += golsFora;
  b.golsPro += golsFora;
  b.golsContra += golsCasa;
  a.saldoGols = a.golsPro - a.golsContra;
  b.saldoGols = b.golsPro - b.golsContra;
  if (golsCasa > golsFora) {
    a.vitorias++;
    a.pontos += 3;
    b.derrotas++;
  } else if (golsCasa < golsFora) {
    b.vitorias++;
    b.pontos += 3;
    a.derrotas++;
  } else {
    a.empates++;
    b.empates++;
    a.pontos++;
    b.pontos++;
  }
}

function ordenarTabela(linhas, jogos = [], liga = null) {
  const jaClassificada = linhas.every(linha => Number.isFinite(linha.posicao));
  const ordenadas = jaClassificada
    ? [...linhas].sort((a, b) => a.posicao - b.posicao)
    : (liga === 'serieB' || liga === 'brasileirao')
      ? ordenarTabelaBrasileira(linhas, jogos)
      : [...linhas].sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias ||
          b.saldoGols - a.saldoGols || b.golsPro - a.golsPro || a.nome.localeCompare(b.nome, 'pt-BR'));
  return ordenadas.map((linha, indice) => ({ ...linha, posicao: jaClassificada ? linha.posicao : indice + 1 }));
}

export function simularPlacarDeLiga(casa, fora, formaCasa = 0, formaFora = 0, rng = Math.random) {
  const forcaCasa = Number(casa.elenco ?? casa.forca ?? 50);
  const forcaFora = Number(fora.elenco ?? fora.forca ?? 50);
  const ataqueCasa = casa.ataque ?? forcaCasa;
  const defesaCasa = casa.defesa ?? forcaCasa;
  const ataqueFora = fora.ataque ?? forcaFora;
  const defesaFora = fora.defesa ?? forcaFora;
  const momento = (formaCasa - formaFora) * 0.16;
  const {golsA, golsB} = sortearPlacar({
    a: limitar(1.35 + (ataqueCasa - defesaFora) * 0.035 + momento, 0.25, 3.5),
    b: limitar(1.12 + (ataqueFora - defesaCasa) * 0.03 - momento, 0.2, 3.2),
  }, rng);
  return {golsCasa: golsA, golsFora: golsB};
}

export function registrarFormaDaLiga(forma, {casa, fora, golsCasa, golsFora}) {
  const saldo = limitar((golsCasa - golsFora) / 2, -1, 1);
  forma.set(casa, (forma.get(casa) ?? 0) * 0.75 + saldo * 0.25);
  forma.set(fora, (forma.get(fora) ?? 0) * 0.75 - saldo * 0.25);
}

export function simularLigaMundo(clubes, rng = Math.random, liga = clubes[0]?.liga, {
  progresso = 1, jogosAnteriores = [], rngRodada, disputarPartida,
} = {}) {
  const tabela = criarTabela(clubes), jogos = [...jogosAnteriores], forma = new Map();
  const base = [...clubes], primeiroTurno = [];
  if (base.length % 2) base.push(null);
  const rodadas = Math.max(0, base.length - 1);
  const ateRodada = Math.floor(2 * rodadas * progresso + 1e-9);
  const ultimaRodada = jogos.at(-1)?.rodada ?? 0;

  for (const jogo of jogos) {
    const {casa, fora, golsCasa, golsFora} = jogo;
    registrarPartida(tabela, {nome: casa}, {nome: fora}, golsCasa, golsFora);
    registrarFormaDaLiga(forma, jogo);
  }

  const disputar = (casa, fora, rodada, sorteio) => {
    const formaCasa = forma.get(casa.nome), formaFora = forma.get(fora.nome);
    const placar = disputarPartida
      ? disputarPartida(casa, fora, rodada, formaCasa, formaFora, sorteio)
      : simularPlacarDeLiga(casa, fora, formaCasa, formaFora, sorteio);
    const {golsCasa, golsFora} = placar;
    registrarPartida(tabela, casa, fora, golsCasa, golsFora);
    const jogo = {rodada, casa: casa.nome, fora: fora.nome, ...placar};
    jogos.push(jogo);
    registrarFormaDaLiga(forma, jogo);
  };

  for (let rodada = 1; rodada <= rodadas && rodada <= ateRodada; rodada++) {
    const confrontos = [];
    const sorteio = rodada > ultimaRodada ? rngRodada?.(rodada) ?? rng : null;
    for (let i = 0; i < base.length / 2; i++) {
      const a = base[i], b = base[base.length - 1 - i];
      if (!a || !b) continue;
      // O clube fixo alterna por rodada. Os demais alternam conforme giram.
      const [casa, fora] = (i === 0 ? rodada - 1 : i) % 2 === 0 ? [a, b] : [b, a];
      confrontos.push({casa, fora});
      if (sorteio) disputar(casa, fora, rodada, sorteio);
    }
    primeiroTurno.push(confrontos);
    base.splice(1, 0, base.pop());
  }
  for (let rodada = Math.max(rodadas, ultimaRodada) + 1; rodada <= ateRodada; rodada++) {
    const sorteio = rngRodada?.(rodada) ?? rng;
    for (const {casa, fora} of primeiroTurno[rodada - rodadas - 1]) disputar(fora, casa, rodada, sorteio);
  }
  return {classificacao: ordenarTabela([...tabela.values()], jogos, liga), jogos};
}

/**
 * Produz as tabelas da temporada para todas as ligas cadastradas.
 * A liga do treinador usa a classificação já disputada pelo modo treinador;
 * as demais ligas simulam todos os confrontos em ida e volta.
 */
export function simularClassificacoesMundoTecnico({
  clubes = [],
  ligasMundo = {},
  ligaTreinador,
  clubeTreinador,
  forcaTreinador,
  classificacaoTreinador,
  jogosTreinador = [],
  ano = 2026,
  rng = Math.random,
  progresso = 1,
  jogosAnteriores = {},
  rngLigaRodada,
  disputarPartida,
}) {
  const clubesUnicos = [...new Map(clubes.filter(clube => clube?.nome).map(clube => [clube.nome, clube])).values()];
  const porLiga = new Map();
  for (const clube of clubesUnicos) {
    if (clube.nome === clubeTreinador) continue;
    const liga = ligasMundo[clube.nome] || clube.liga || 'sem-liga';
    if (!porLiga.has(liga)) porLiga.set(liga, []);
    porLiga.get(liga).push(clube);
  }
  if (ligaTreinador) {
    if (!porLiga.has(ligaTreinador)) porLiga.set(ligaTreinador, []);
    porLiga.get(ligaTreinador).push({ nome: clubeTreinador, liga: ligaTreinador, elenco: forcaTreinador ?? 50 });
  }

  const resultado = {};
  for (const [liga, participantes] of porLiga) {
    // A Série D serve como banco de clubes para acesso; não fingir uma liga
    // de pontos corridos com 23 times quando a competição real tem 96.
    if (liga === 'serieD' && liga !== ligaTreinador) continue;
    if (liga === 'serieC' && liga === ligaTreinador &&
        Array.isArray(classificacaoTreinador) && classificacaoTreinador.length &&
        participantes.length === regulamentoSerieC(ano).participantes) {
      const regulamento = regulamentoSerieC(ano);
      const clubesEsperados = regulamento.formato === 'dois-grupos' ? 14 : regulamento.participantes;
      if (classificacaoTreinador.length !== clubesEsperados ||
          !classificacaoTreinador.every(linha => linha.jogos === regulamento.rodadas)) {
        resultado[liga] = {
          liga, origem: 'serie-c-pendente', classificacao: classificacaoTreinador,
          jogos: jogosTreinador, ano, fase: 'primeira-fase-incompleta',
        };
        continue;
      }
      const edicaoSerieC = simularSerieC({
        clubes: participantes, ano, rng,
        faseJogada: { classificacao: classificacaoTreinador, jogos: jogosTreinador },
      });
      resultado[liga] = {
        liga, origem: 'serie-c-treinador',
        classificacao: edicaoSerieC.classificacao || edicaoSerieC.primeiraFase.grupos.flatMap(g =>
          g.classificacao.map(linha => ({ ...linha, grupo: g.nome }))),
        jogos: edicaoSerieC.primeiraFase.grupos.flatMap(g => g.jogos),
        edicaoSerieC,
      };
      continue;
    }
    if (liga === ligaTreinador && Array.isArray(classificacaoTreinador) && classificacaoTreinador.length) {
      resultado[liga] = {
        liga,
        origem: 'temporada-treinador',
        classificacao: ordenarTabela(classificacaoTreinador.map(linha => ({
          nome: linha.nome,
          jogos: linha.jogos ?? 0,
          pontos: linha.pontos ?? 0,
          vitorias: linha.vitorias ?? 0,
          empates: linha.empates ?? 0,
          derrotas: linha.derrotas ?? 0,
          golsPro: linha.golsPro ?? 0,
          golsContra: linha.golsContra ?? 0,
          saldoGols: linha.saldoGols ?? ((linha.golsPro ?? 0) - (linha.golsContra ?? 0)),
          posicao: linha.posicao,
        }))),
      };
      continue;
    }
    const ordenados = [...participantes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    if (liga === 'serieC') {
      if (progresso < 1) continue;
      const esperados = regulamentoSerieC(ano).participantes;
      if (ordenados.length !== esperados) {
        // Saves legados podem ainda não ter recebido todos os acessos da D.
        // Não inventar 38/46/54 rodadas de uma liga com regulamento inválido.
        resultado[liga] = {
          liga, origem: 'serie-c-pendente', classificacao: [], jogos: [],
          ano, participantesAtuais: ordenados.length, participantesEsperados: esperados,
        };
        continue;
      }
      const edicaoSerieC = simularSerieC({ clubes: ordenados, ano, rng });
      resultado[liga] = {
        liga, origem: 'serie-c-cbf',
        classificacao: edicaoSerieC.classificacao || edicaoSerieC.primeiraFase.grupos.flatMap(g =>
          g.classificacao.map(linha => ({ ...linha, grupo: g.nome }))),
        jogos: edicaoSerieC.primeiraFase.grupos.flatMap(g => g.jogos),
        edicaoSerieC,
      };
      continue;
    }
    resultado[liga] = { liga, origem: 'simulacao-global', ...simularLigaMundo(ordenados, rng, liga, {
      progresso, jogosAnteriores: jogosAnteriores[liga], disputarPartida,
      rngRodada: rngLigaRodada && (rodada => rngLigaRodada(liga, rodada)),
    }) };
  }
  return resultado;
}

/** Aplica os acessos e rebaixamentos já usados pela carreira do treinador. */
export function atualizarLigasMundoTecnico({
  clubes = [],
  classificacoesMundo = {},
  ligasMundo = {},
  clubeTreinador,
  ligaTreinador,
  divisoes = [],
  ano = 2026,
  rng = Math.random,
}) {
  const atribuicoes = Object.fromEntries(clubes
    .filter(clube => clube?.nome)
    .map(clube => [clube.nome, ligasMundo[clube.nome] || clube.liga])
    .filter(([, liga]) => !!liga));
  for (const [nome, liga] of Object.entries(ligasMundo)) {
    if (!atribuicoes[nome] && liga) atribuicoes[nome] = liga;
  }
  if (clubeTreinador && ligaTreinador) atribuicoes[clubeTreinador] = ligaTreinador;
  const ligasOriginais = { ...atribuicoes };
  const movimentos = [];
  const forcas = Object.fromEntries(clubes.map(clube => [clube.nome, clube.elenco ?? clube.forca ?? 55]));
  const playoffsSerieB = resolverOuReusarPlayoffsSerieB(classificacoesMundo.serieB?.classificacao, forcas, rng, classificacoesMundo.serieB?.playoffs);
  if (playoffsSerieB) {
    classificacoesMundo.serieB = { ...classificacoesMundo.serieB, playoffs: playoffsSerieB };
  }

  for (const divisao of divisoes) {
    const tabelaCima = classificacoesMundo[divisao.cima]?.classificacao || [];
    const tabelaBaixo = classificacoesMundo[divisao.baixo]?.classificacao || [];
    const vagas = Math.max(0, Math.min(Number(divisao.vagas) || 0, tabelaCima.length, tabelaBaixo.length));
    if (!vagas) continue;
    const rebaixados = tabelaCima.slice(-vagas);
    const promovidos = divisao.baixo === 'serieB' && divisao.cima === 'brasileirao' && playoffsSerieB
      ? playoffsSerieB.promovidos.map(nome => ({ nome }))
      : tabelaBaixo.slice(0, vagas);
    for (let i = 0; i < vagas; i++) {
      const rebaixado = rebaixados[i];
      const promovido = promovidos[i];
      if (!rebaixado?.nome || !promovido?.nome) continue;
      atribuicoes[rebaixado.nome] = divisao.baixo;
      atribuicoes[promovido.nome] = divisao.cima;
      movimentos.push({
        clube: rebaixado.nome,
        tipo: 'rebaixamento',
        de: divisao.cima,
        para: divisao.baixo,
      }, {
        clube: promovido.nome,
        tipo: 'acesso',
        de: divisao.baixo,
        para: divisao.cima,
      });
    }
  }

  // Os acessos da Série C vêm dos quadrangulares; a movimentação C-D
  // usa o mesmo motor do Modo Completo, com participantes do ano corrente.
  const edicaoC = classificacoesMundo.serieC?.edicaoSerieC;
  const serieCJaConfigurada = divisoes.some(divisao =>
    divisao.cima === 'serieB' && divisao.baixo === 'serieC');
  const progressoBrasilInferior = serieCJaConfigurada ? { validado: false, movimentos: [], alteracoes: {} }
    : progredirBrasilInferior({
      ligasAtuais: ligasOriginais,
      edicaoSerieC: edicaoC,
      classificacaoB: classificacoesMundo.serieB?.classificacao,
      forcas,
      ano,
      rng,
    });
  if (progressoBrasilInferior.validado) {
    Object.assign(atribuicoes, progressoBrasilInferior.alteracoes);
    movimentos.push(...progressoBrasilInferior.movimentos);
  }

  return { ligasMundo: atribuicoes, movimentos, playoffsSerieB, progressoBrasilInferior };
}

/** Reavalia a tabela quando um lance jogável altera um placar já registrado. */
export function classificacaoDosJogos(jogos,nomes){
 const clubes=nomes.map(nome=>({nome})),tabela=criarTabela(clubes);
 for(const j of jogos)registrarPartida(tabela,{nome:j.casa},{nome:j.fora},j.golsCasa,j.golsFora);
 return ordenarTabela([...tabela.values()]);
}
