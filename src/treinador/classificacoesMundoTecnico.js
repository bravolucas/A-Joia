import {resolverOuReusarPlayoffsSerieB} from '../simulacao/playoffsSerieB.js';
import {ordenarTabelaBrasileira} from '../simulacao/desempateBrasileiro.js';
import {simularSerieC, regulamentoSerieC} from '../simulacao/serieC.js';
import {progredirBrasilInferior} from '../simulacao/progressaoBrasilInferior.js';

const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));

function sortearPoisson(media, rng) {
  const limite = Math.exp(-limitar(media, 0.05, 5));
  let produto = 1;
  let gols = 0;
  do {
    gols++;
    produto *= rng();
  } while (produto > limite && gols < 12);
  return gols - 1;
}

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

function simularPartida(casa, fora, tabela, rng, jogos, rodada) {
  const ataqueCasa=casa.ataque??Number(casa.elenco??casa.forca??50),defesaCasa=casa.defesa??Number(casa.elenco??casa.forca??50);
  const ataqueFora=fora.ataque??Number(fora.elenco??fora.forca??50),defesaFora=fora.defesa??Number(fora.elenco??fora.forca??50);
  const golsCasa = sortearPoisson(limitar(1.35 + (ataqueCasa-defesaFora) * 0.035, 0.25, 3.5), rng);
  const golsFora = sortearPoisson(limitar(1.12 + (ataqueFora-defesaCasa) * 0.03, 0.2, 3.2), rng);
  registrarPartida(tabela, casa, fora, golsCasa, golsFora);
  jogos?.push({rodada,casa:casa.nome,fora:fora.nome,golsCasa,golsFora});
}

export function simularLigaMundo(clubes, rng = Math.random, liga = clubes[0]?.liga) {
  const tabela = criarTabela(clubes), jogos = [], primeiroTurno = [];
  const base = [...clubes];
  if(base.length<2)return {classificacao:ordenarTabela([...tabela.values()], jogos, liga),jogos};
  if(base.length%2)base.push(null);
  const rodadas=base.length-1;
  for(let rodada=0;rodada<rodadas;rodada++){
    for(let i=0;i<base.length/2;i++){
      const a=base[i],b=base[base.length-1-i];if(!a||!b)continue;
      const casa=(rodada+i)%2===0?a:b,fora=casa===a?b:a;
      primeiroTurno.push({casa,fora,rodada:rodada+1});
      simularPartida(casa,fora,tabela,rng,jogos,rodada+1);
    }
    base.splice(1,0,base.pop());
  }
  for(const j of primeiroTurno)simularPartida(j.fora,j.casa,tabela,rng,jogos,j.rodada+rodadas);
  return {classificacao:ordenarTabela([...tabela.values()], jogos, liga),jogos};
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
  ano = 2026,
  rng = Math.random,
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
    if (liga === 'serieC' && ordenados.length === regulamentoSerieC(ano).participantes) {
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
    resultado[liga] = { liga, origem: 'simulacao-global', ...simularLigaMundo(ordenados, rng, liga) };
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
