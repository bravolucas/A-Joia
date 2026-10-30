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

function ordenarTabela(linhas) {
  const jaClassificada = linhas.every(linha => Number.isFinite(linha.posicao));
  return [...linhas].sort((a, b) => jaClassificada ? a.posicao - b.posicao :
    b.pontos - a.pontos ||
    b.saldoGols - a.saldoGols ||
    b.golsPro - a.golsPro ||
    b.vitorias - a.vitorias ||
    a.nome.localeCompare(b.nome, 'pt-BR')
  ).map((linha, indice) => ({ ...linha, posicao: jaClassificada ? linha.posicao : indice + 1 }));
}

function simularPartida(casa, fora, tabela, rng) {
  const diferenca = Number(casa.elenco ?? casa.forca ?? 50) - Number(fora.elenco ?? fora.forca ?? 50);
  const golsCasa = sortearPoisson(limitar(1.35 + diferenca * 0.012, 0.25, 3.1), rng);
  const golsFora = sortearPoisson(limitar(1.12 - diferenca * 0.009, 0.2, 2.8), rng);
  registrarPartida(tabela, casa, fora, golsCasa, golsFora);
}

function simularLiga(clubes, rng) {
  if (clubes.length < 2) return ordenarTabela([...criarTabela(clubes).values()]);
  const tabela = criarTabela(clubes);
  const base = [...clubes];
  if (base.length % 2) base.push(null);
  const tamanho = base.length;
  const jogosPrimeiroTurno = tamanho - 1;
  const porNome = new Map(clubes.map(clube => [clube.nome, clube]));

  for (let rodada = 0; rodada < jogosPrimeiroTurno; rodada++) {
    for (let indice = 0; indice < tamanho / 2; indice++) {
      const primeiro = base[indice];
      const segundo = base[tamanho - 1 - indice];
      if (!primeiro || !segundo) continue;
      const casa = (rodada + indice) % 2 === 0 ? primeiro : segundo;
      const fora = casa === primeiro ? segundo : primeiro;
      simularPartida(casa, fora, tabela, rng);
    }
    base.splice(1, 0, base.pop());
  }

  // O returno repete os confrontos com mando invertido.
  const participantes = [...tabela.keys()].map(nome => porNome.get(nome));
  // O returno repete os confrontos com mando invertido.
  for (let i = 0; i < participantes.length; i++) {
    for (let j = i + 1; j < participantes.length; j++) {
      const a = participantes[i];
      const b = participantes[j];
      simularPartida(b, a, tabela, rng);
    }
  }

  return ordenarTabela([...tabela.values()]);
}

/**
 * Produz as tabelas da temporada para todas as ligas cadastradas.
 * A liga do treinador usa a classificação já disputada pelo modo treinador;
 * as demais ligas simulam todos os confrontos em ida e volta.
 */
export function simularClassificacoesMundoTecnico({
  clubes = [],
  ligaTreinador,
  clubeTreinador,
  forcaTreinador,
  classificacaoTreinador,
  rng = Math.random,
}) {
  const clubesUnicos = [...new Map(clubes.filter(clube => clube?.nome).map(clube => [clube.nome, clube])).values()];
  const porLiga = new Map();
  for (const clube of clubesUnicos) {
    if (clube.nome === clubeTreinador) continue;
    const liga = clube.liga || 'sem-liga';
    if (!porLiga.has(liga)) porLiga.set(liga, []);
    porLiga.get(liga).push(clube);
  }
  if (ligaTreinador) {
    if (!porLiga.has(ligaTreinador)) porLiga.set(ligaTreinador, []);
    porLiga.get(ligaTreinador).push({ nome: clubeTreinador, liga: ligaTreinador, elenco: forcaTreinador ?? 50 });
  }

  const resultado = {};
  for (const [liga, participantes] of porLiga) {
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
    resultado[liga] = { liga, origem: 'simulacao-global', classificacao: simularLiga(ordenados, rng) };
  }
  return resultado;
}
