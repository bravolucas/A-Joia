const limitar = (n, min, max) => Math.max(min, Math.min(max, n));
const sorteio = () => Math.random();
const forca = (clube) => Number(clube?.forca ?? clube?.elenco ?? 50);

function embaralhar(lista, rng) {
  const out = [...lista];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function poisson(media, rng) {
  const limite = Math.exp(-limitar(media, 0.05, 5));
  let produto = 1, gols = 0;
  do { gols++; produto *= rng(); } while (produto > limite && gols < 12);
  return gols - 1;
}

function criarPartida(casa, fora, clubeUsuario, bonusTecnico, rng, desempatar = false, opcoes = {}) {
  const bonusCasa = casa.nome === clubeUsuario ? bonusTecnico : 0;
  const bonusFora = fora.nome === clubeUsuario ? bonusTecnico : 0;
  const diferenca = forca(casa) + bonusCasa - forca(fora) - bonusFora;
  const mediaCasa = opcoes.campoNeutro ? limitar(1.235 + diferenca * 0.0105, 0.275, 2.6)
    : limitar(1.35 + diferenca * 0.012, 0.3, 2.8);
  const mediaFora = opcoes.campoNeutro ? limitar(1.235 - diferenca * 0.0105, 0.275, 2.6)
    : limitar(1.12 - diferenca * 0.009, 0.25, 2.4);
  let golsCasa = poisson(mediaCasa, rng);
  let golsFora = poisson(mediaFora, rng);
  let prorrogacao = null;
  if (desempatar && opcoes.prorrogacao && golsCasa === golsFora) {
    prorrogacao = { golsCasa: poisson(mediaCasa / 3, rng), golsFora: poisson(mediaFora / 3, rng),
      placar90: { golsCasa, golsFora } };
    golsCasa += prorrogacao.golsCasa;
    golsFora += prorrogacao.golsFora;
  }
  let vencedor = golsCasa > golsFora ? casa : golsFora > golsCasa ? fora : null;
  let penaltis = null;
  if (desempatar && !vencedor) {
    const chanceCasa = limitar(0.5 + diferenca * 0.003, 0.3, 0.7);
    vencedor = rng() < chanceCasa ? casa : fora;
    penaltis = vencedor === casa ? 'Casa' : 'Fora';
  }
  return { casa: casa.nome, fora: fora.nome, golsCasa, golsFora, vencedor: vencedor?.nome || null, penaltis,
    ...(opcoes.campoNeutro ? { campoNeutro: true } : {}), ...(prorrogacao ? { prorrogacao } : {}) };
}

function registrarJogo(tabela, jogo) {
  const casa = tabela.get(jogo.casa), fora = tabela.get(jogo.fora);
  casa.jogos++; fora.jogos++;
  casa.golsPro += jogo.golsCasa; casa.golsContra += jogo.golsFora;
  fora.golsPro += jogo.golsFora; fora.golsContra += jogo.golsCasa;
  if (jogo.golsCasa > jogo.golsFora) { casa.pontos += 3; casa.vitorias++; fora.derrotas++; }
  else if (jogo.golsCasa < jogo.golsFora) { fora.pontos += 3; fora.vitorias++; casa.derrotas++; }
  else { casa.pontos++; fora.pontos++; casa.empates++; fora.empates++; }
}

function classificarGrupo(clubes, jogos, rng) {
  const empatados = new Map();
  for (const c of clubes) {
    empatados.set(c.nome, { pontos: 0, saldo: 0, gols: 0 });
  }
  const porPontos = new Map();
  for (const c of clubes) {
    const pts = c.pontos;
    if (!porPontos.has(pts)) porPontos.set(pts, []);
    porPontos.get(pts).push(c);
  }
  for (const grupo of porPontos.values()) {
    if (grupo.length < 2) continue;
    const nomes = new Set(grupo.map(c => c.nome));
    for (const jogo of jogos) {
      if (!nomes.has(jogo.casa) || !nomes.has(jogo.fora)) continue;
      const a = empatados.get(jogo.casa), b = empatados.get(jogo.fora);
      a.gols += jogo.golsCasa; b.gols += jogo.golsFora;
      a.saldo += jogo.golsCasa - jogo.golsFora; b.saldo += jogo.golsFora - jogo.golsCasa;
      if (jogo.golsCasa > jogo.golsFora) a.pontos += 3;
      else if (jogo.golsCasa < jogo.golsFora) b.pontos += 3;
      else { a.pontos++; b.pontos++; }
    }
  }
  const lotes = new Map(clubes.map(c => [c.nome, rng()]));
  return [...clubes].sort((a, b) => b.pontos - a.pontos ||
    empatados.get(b.nome).pontos - empatados.get(a.nome).pontos ||
    empatados.get(b.nome).saldo - empatados.get(a.nome).saldo ||
    (b.golsPro - b.golsContra) - (a.golsPro - a.golsContra) ||
    b.golsPro - a.golsPro || lotes.get(a.nome) - lotes.get(b.nome));
}

function dividirEmGrupos(clubes, quantidade) {
  const grupos = Array.from({ length: quantidade }, () => []);
  clubes.forEach((clube, indice) => grupos[indice % quantidade].push(clube));
  return grupos;
}

function calendarioDeGrupo(clubes, turnos) {
  const participantes = [...clubes];
  if (participantes.length % 2) participantes.push(null);
  const tamanho = participantes.length;
  const primeiraVolta = [];
  for (let rodada = 0; rodada < tamanho - 1; rodada++) {
    const partidas = [];
    for (let indice = 0; indice < tamanho / 2; indice++) {
      const primeiro = participantes[indice];
      const segundo = participantes[tamanho - 1 - indice];
      if (!primeiro || !segundo) continue;
      const casa = (rodada + indice) % 2 === 0 ? primeiro : segundo;
      partidas.push({ casa, fora: casa === primeiro ? segundo : primeiro });
    }
    primeiraVolta.push(partidas);
    participantes.splice(1, 0, participantes.pop());
  }
  const calendario = [];
  for (let turno = 0; turno < turnos; turno++) {
    const jogos = turno % 2 === 0 ? primeiraVolta : primeiraVolta.map(partidas =>
      partidas.map(jogo => ({ casa: jogo.fora, fora: jogo.casa })));
    calendario.push(...jogos);
  }
  return calendario;
}

const LIGAS_PRIMEIRA_DIVISAO = new Set([
  'brasileirao', 'argentina', 'sulamericano', 'portugal', 'espanha', 'inglaterra',
  'italia', 'alemanha', 'franca', 'holanda', 'turquia', 'arabia', 'mls'
]);

function regiaoContinental(pais) {
  if (['Brasil', 'Argentina', 'América do Sul'].includes(pais)) return 'sul-america';
  if (['Portugal', 'Espanha', 'Inglaterra', 'Itália', 'Alemanha', 'França', 'Países Baixos', 'Turquia'].includes(pais)) return 'europa';
  if (pais === 'Arábia Saudita') return 'asia';
  if (pais === 'Estados Unidos') return 'concacaf';
  return null;
}

/**
 * Define a lista continental a partir da classificação doméstica encerrada.
 * A distribuição é um critério provisório por posição entre as ligas modeladas;
 * as vagas oficiais precisam ser fornecidas por configuração específica da edição.
 * A lista disponível de clubes não contém todos os países de AFC/Concacaf;
 * por isso, exige representantes de pelo menos dois países e não fabrica
 * participantes de outras ligas.
 */
/**
 * Aplica cotas explícitas de uma edição: posições finais por liga, na ordem
 * declarada, e participantes extras informados pela regra da competição.
 * Não calcula cotas por força do elenco nem infere vagas ausentes.
 */
export function classificarVagasPorRegraTecnico({ clubes = [], classificacoesMundo = {}, vagasPorLiga = {}, participantesExtras = [], limite }) {
  const clubesPorNome = new Map(clubes.filter(c => c?.nome).map(c => [c.nome, c]));
  const selecionados = [];
  const nomesIncluidos = new Set();
  const incluir = clube => {
    if (!clube || nomesIncluidos.has(clube.nome)) return;
    nomesIncluidos.add(clube.nome);
    selecionados.push(clube);
  };

  for (const [liga, vagas] of Object.entries(vagasPorLiga || {})) {
    const tabela = classificacoesMundo?.[liga]?.classificacao || [];
    for (const posicao of (Array.isArray(vagas) ? vagas : [vagas])) {
      if (!Number.isInteger(posicao) || posicao < 1) continue;
      const linha = tabela.find((item, indice) => (Number(item?.posicao) || indice + 1) === posicao);
      incluir(clubesPorNome.get(linha?.nome));
    }
  }

  for (const participante of participantesExtras || []) {
    incluir(clubesPorNome.get(typeof participante === 'string' ? participante : participante?.nome));
  }

  return Number.isInteger(limite) && limite >= 0 ? selecionados.slice(0, limite) : selecionados;
}

export function classificarVagasContinentalTecnico({ clubes = [], classificacoesMundo = {}, pais, limite = 16, regra = null }) {
  if (regra?.vagasPorLiga) {
    return classificarVagasPorRegraTecnico({
      clubes,
      classificacoesMundo,
      vagasPorLiga: regra.vagasPorLiga,
      participantesExtras: regra.participantesExtras,
      limite: regra.limite ?? limite
    });
  }
  const regiao = regiaoContinental(pais);
  if (!regiao || !Number.isInteger(limite) || limite < 2) return [];
  const clubesPorNome = new Map(clubes.filter(c => c?.nome).map(c => [c.nome, c]));
  const candidatos = [];
  const nomesIncluidos = new Set();
  const paises = new Set();

  for (const [liga, tabela] of Object.entries(classificacoesMundo || {})) {
    if (!LIGAS_PRIMEIRA_DIVISAO.has(liga)) continue;
    for (const [indice, linha] of (tabela?.classificacao || []).entries()) {
      const clube = clubesPorNome.get(linha?.nome);
      if (!clube || nomesIncluidos.has(clube.nome) || regiaoContinental(clube.pais) !== regiao) continue;
      nomesIncluidos.add(clube.nome);
      paises.add(clube.pais);
      const jogos = Number(linha.jogos) || 0;
      const golsPro = Number(linha.golsPro) || 0;
      const golsContra = Number(linha.golsContra) || 0;
      candidatos.push({
        ...clube,
        posicaoDomestica: Number(linha.posicao) || indice + 1,
        aproveitamento: jogos ? (Number(linha.pontos) || 0) / (jogos * 3) : 0,
        saldoPorJogo: jogos ? (golsPro - golsContra) / jogos : 0,
      });
    }
  }

  if (paises.size < 2) return [];
  return candidatos.sort((a, b) => a.posicaoDomestica - b.posicaoDomestica ||
    b.aproveitamento - a.aproveitamento || b.saldoPorJogo - a.saldoPorJogo ||
    a.liga.localeCompare(b.liga, 'pt-BR') || a.nome.localeCompare(b.nome, 'pt-BR')
  ).slice(0, limite).map(({ posicaoDomestica, aproveitamento, saldoPorJogo, ...clube }) => clube);
}

function nomeFaseEliminatoria(quantidadeClubes) {
  const nomes = {
    2: 'Final',
    4: 'Semifinal',
    8: 'Quartas de final',
    16: 'Oitavas de final',
    32: '16 avos de final',
    64: '32 avos de final',
    128: '64 avos de final'
  };
  return nomes[quantidadeClubes] || `Fase preliminar · ${quantidadeClubes} clubes`;
}

function criarConfrontoIdaVolta(casa, fora, nomeUsuario, bonusTecnico, rng) {
  const ida = criarPartida(casa, fora, nomeUsuario, bonusTecnico, rng);
  const volta = criarPartida(fora, casa, nomeUsuario, bonusTecnico, rng);
  const golsCasa = ida.golsCasa + volta.golsFora;
  const golsFora = ida.golsFora + volta.golsCasa;
  let vencedor = golsCasa > golsFora ? casa.nome : golsFora > golsCasa ? fora.nome : null;
  let penaltis = null;
  if (!vencedor) {
    const diferenca = forca(casa) + (casa.nome === nomeUsuario ? bonusTecnico : 0)
      - forca(fora) - (fora.nome === nomeUsuario ? bonusTecnico : 0);
    vencedor = rng() < limitar(0.5 + diferenca * 0.003, 0.3, 0.7) ? casa.nome : fora.nome;
    penaltis = vencedor === casa.nome ? 'Casa' : 'Fora';
  }
  // O vencedor pertence ao confronto; os resultados de cada partida permanecem intactos.
  return { casa: casa.nome, fora: fora.nome, golsCasa, golsFora, vencedor, penaltis,
    agregado: true, partidas: [{ ...ida, etapa: 'Ida' }, { ...volta, etapa: 'Volta' }] };
}

function jogarEliminatoria(clubes, nomeUsuario, bonusTecnico, rng, formato = {}) {
  let rodada = embaralhar(clubes, rng), fases = [];
  while (rodada.length > 1) {
    const fase = nomeFaseEliminatoria(rodada.length);
    const rodadaNumero = fases.length + 1;
    const tamanhoProximaChave = 2 ** Math.floor(Math.log2(rodada.length));
    const classificadosDiretos = rodada.length === tamanhoProximaChave
      ? []
      : rodada.slice(0, 2 * tamanhoProximaChave - rodada.length);
    const timesQueJogam = rodada.slice(classificadosDiretos.length);
    const jogos = classificadosDiretos.map(clube => ({
      bye: clube.nome, vencedor: clube.nome, fase, rodada: rodadaNumero
    }));
    for (let i = 0; i < timesQueJogam.length; i += 2) {
      const casa = timesQueJogam[i], fora = timesQueJogam[i + 1];
      if (!fora) {
        jogos.push({ bye: casa.nome, vencedor: casa.nome, fase, rodada: rodadaNumero });
        continue;
      }
      const idaVolta = rodada.length === 2 ? formato.finalIdaVolta === true : formato.mataMataIdaVolta === true;
      const confronto = idaVolta ? criarConfrontoIdaVolta(casa, fora, nomeUsuario, bonusTecnico, rng)
        : criarPartida(casa, fora, nomeUsuario, bonusTecnico, rng, true, {
          campoNeutro: rodada.length === 2 && formato.finalCampoNeutro === true,
          prorrogacao: rodada.length === 2 && formato.finalProrrogacao === true
        });
      jogos.push({ ...confronto, fase, rodada: rodadaNumero });
    }
    const vencedores = jogos.map(jogo => rodada.find(clube => clube.nome === jogo.vencedor)).filter(Boolean);
    fases.push({ fase, rodada: rodadaNumero, jogos });
    rodada = vencedores;
  }
  const campeao = rodada[0]?.nome || null;
  const jornadaUsuario = fases.find(f => f.jogos.some(j => j.casa === nomeUsuario || j.fora === nomeUsuario || j.bye === nomeUsuario));
  const eliminado = fases.find(f => f.jogos.some(j => (j.casa === nomeUsuario || j.fora === nomeUsuario) && j.vencedor !== nomeUsuario));
  const faseUsuario = campeao === nomeUsuario ? 'Campeão' : eliminado?.fase || (jornadaUsuario ? 'Classificado' : 'Não participou');
  return { campeao, fases, faseUsuario, jogosUsuario: fases.flatMap(f => f.jogos.filter(j => j.casa === nomeUsuario || j.fora === nomeUsuario || j.bye === nomeUsuario)) };
}

export function simularCopaNacionalTecnico({ clubes, nomeUsuario, pais, forcaUsuario, nome, bonusTecnico = 0, formato = {}, rng = sorteio }) {
  // A copa usa todos os clubes cadastrados para o país. A força não corta a
  // lista nem inclui o clube do treinador por fora; o elenco só afeta os placares.
  const participantes = [...new Map(clubes.filter(c => c.pais === pais).map(c =>
    [c.nome, c.nome === nomeUsuario ? { ...c, elenco: forcaUsuario } : c])).values()];
  if (participantes.length < 2 || !participantes.some(c => c.nome === nomeUsuario)) {
    return { nome, tipo: 'copa', participantes: 0, campeao: null, faseUsuario: 'Não classificado', fases: [], jogosUsuario: [] };
  }
  return { nome, tipo: 'copa', participantes: participantes.length, ...jogarEliminatoria(participantes, nomeUsuario, bonusTecnico, rng, formato) };
}

export function simularCopaContinentalTecnico({ clubes, nomeUsuario, pais, forcaUsuario, nome, bonusTecnico = 0, participantesQualificados = [], formato = {}, rng = sorteio }) {
  const totalParticipantes = formato.totalParticipantes ?? 16;
  const quantidadeGrupos = formato.grupos ?? 4;
  const classificadosPorGrupo = formato.classificadosPorGrupo ?? 2;
  const turnos = formato.turnos ?? 2;
  if (!Number.isInteger(totalParticipantes) || totalParticipantes < 2 ||
      !Array.isArray(participantesQualificados) || participantesQualificados.length !== totalParticipantes ||
      participantesQualificados.some(c => typeof c?.nome !== 'string' || !c.nome.trim()) ||
      new Set(participantesQualificados.map(c => c.nome)).size !== totalParticipantes ||
      !participantesQualificados.some(c => c.nome === nomeUsuario)) return null;
  if (!Number.isInteger(quantidadeGrupos) || quantidadeGrupos < 0 ||
      !Number.isInteger(turnos) || turnos < 1 ||
      (quantidadeGrupos > 0 && (!Number.isInteger(classificadosPorGrupo) || classificadosPorGrupo < 1 ||
        quantidadeGrupos > Math.floor(totalParticipantes / 2) ||
        classificadosPorGrupo > Math.floor(totalParticipantes / quantidadeGrupos) ||
        quantidadeGrupos * classificadosPorGrupo < 2))) return null;
  const cadastro = new Map((clubes || []).map(c => [c.nome, c]));
  const participantes = [...new Map(participantesQualificados.map(c => {
    const cadastroClube = cadastro.get(c.nome) || c;
    return [c.nome, { ...cadastroClube, ...c,
      elenco: c.nome === nomeUsuario ? (forcaUsuario ?? c.elenco ?? c.forca) : (c.elenco ?? c.forca ?? cadastroClube.elenco) }];
  })).values()];

  const sorteados = embaralhar(participantes, rng);
  const grupos = quantidadeGrupos ? dividirEmGrupos(sorteados, quantidadeGrupos) : [];
  if (grupos.some(grupo => grupo.length < 2)) return null;
  const jogosGrupo = [];
  const classificados = [];
  if (!quantidadeGrupos) classificados.push(...participantes);
  grupos.forEach((grupo, indice) => {
    const tabela = new Map(grupo.map(c => [c.nome, { ...c, pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0 }]));
    const jogos = [];
    const rodadasGrupo = calendarioDeGrupo(grupo, turnos);
    rodadasGrupo.forEach((partidas, rodadaIdx) => partidas.forEach(({ casa, fora }) => {
      const jogo = { ...criarPartida(casa, fora, nomeUsuario, bonusTecnico, rng),
        fase: `Fase de grupos · Grupo ${String.fromCharCode(65 + indice)}`, rodada: rodadaIdx + 1 };
      jogos.push(jogo); registrarJogo(tabela, jogo);
    }));
    const classificacao = classificarGrupo([...tabela.values()], jogos, rng);
    jogosGrupo.push({ grupo: String.fromCharCode(65 + indice), jogos, classificacao: classificacao.map(({ nome:n, pontos, golsPro, golsContra, vitorias }) => ({ nome:n, pontos, golsPro, golsContra, vitorias })) });
    classificados.push(...classificacao.slice(0, classificadosPorGrupo));
  });

  const eliminatoria = jogarEliminatoria(classificados, nomeUsuario, bonusTecnico, rng, {
    mataMataIdaVolta: nome === 'Copa Libertadores',
    finalCampoNeutro: nome === 'Copa Libertadores', finalProrrogacao: nome === 'Copa Libertadores', ...formato
  });
  const faseUsuario = eliminatoria.faseUsuario === 'Não participou' && grupos.length
    ? 'Eliminado na fase de grupos' : eliminatoria.faseUsuario;
  return { nome, tipo: 'continental', participantes: participantes.length, grupos: jogosGrupo,
    fases: eliminatoria.fases, campeao: eliminatoria.campeao, faseUsuario,
    jogosUsuario: [...jogosGrupo.flatMap(g => g.jogos.filter(j => j.casa === nomeUsuario || j.fora === nomeUsuario)),
      ...eliminatoria.jogosUsuario] };
}
