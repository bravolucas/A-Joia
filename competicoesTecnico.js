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

function criarPartida(casa, fora, clubeUsuario, bonusTecnico, rng, desempatar = false) {
  const bonusCasa = casa.nome === clubeUsuario ? bonusTecnico : 0;
  const bonusFora = fora.nome === clubeUsuario ? bonusTecnico : 0;
  const diferenca = forca(casa) + bonusCasa - forca(fora) - bonusFora;
  const golsCasa = poisson(limitar(1.35 + diferenca * 0.012, 0.3, 2.8), rng);
  const golsFora = poisson(limitar(1.12 - diferenca * 0.009, 0.25, 2.4), rng);
  let vencedor = golsCasa > golsFora ? casa : golsFora > golsCasa ? fora : null;
  let penaltis = null;
  if (desempatar && !vencedor) {
    const chanceCasa = limitar(0.5 + diferenca * 0.003, 0.3, 0.7);
    vencedor = rng() < chanceCasa ? casa : fora;
    penaltis = vencedor === casa ? 'Casa' : 'Fora';
  }
  return { casa: casa.nome, fora: fora.nome, golsCasa, golsFora, vencedor: vencedor?.nome || null, penaltis };
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

function escolherParticipantes(clubes, nomeUsuario, limite = 16) {
  const distintos = [...new Map(clubes.map(c => [c.nome, c])).values()];
  const ordenados = distintos.sort((a, b) => forca(b) - forca(a) || a.nome.localeCompare(b.nome, 'pt-BR'));
  const usuario = ordenados.find(c => c.nome === nomeUsuario);
  const selecionados = ordenados.slice(0, limite);
  if (usuario && !selecionados.some(c => c.nome === nomeUsuario)) selecionados[selecionados.length - 1] = usuario;
  return selecionados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function jogarEliminatoria(clubes, nomeUsuario, bonusTecnico, rng) {
  let rodada = embaralhar(clubes, rng), fases = [];
  const nomesFase = ['Oitavas de final', 'Quartas de final', 'Semifinal', 'Final'];
  while (rodada.length > 1) {
    const jogos = [];
    for (let i = 0; i < rodada.length; i += 2) {
      const a = rodada[i], b = rodada[i + 1];
      if (!b) { jogos.push({ bye: a.nome, vencedor: a.nome }); continue; }
      const jogo = criarPartida(a, b, nomeUsuario, bonusTecnico, rng, true);
      jogos.push(jogo);
    }
    const fase = nomesFase[Math.max(0, 4 - Math.ceil(Math.log2(rodada.length)))];
    jogos.forEach(jogo => { if (!jogo.bye) jogo.fase = fase; });
    const vencedores = jogos.map(j => rodada.find(c => c.nome === j.vencedor));
    fases.push({ fase, jogos });
    rodada = vencedores.filter(Boolean);
  }
  const campeao = rodada[0]?.nome || null;
  const jornadaUsuario = fases.find(f => f.jogos.some(j => j.casa === nomeUsuario || j.fora === nomeUsuario || j.bye === nomeUsuario));
  const eliminado = fases.find(f => f.jogos.some(j => (j.casa === nomeUsuario || j.fora === nomeUsuario) && j.vencedor !== nomeUsuario));
  const faseUsuario = campeao === nomeUsuario ? 'Campeão' : eliminado?.fase || (jornadaUsuario ? 'Classificado' : 'Não participou');
  return { campeao, fases, faseUsuario, jogosUsuario: fases.flatMap(f => f.jogos.filter(j => j.casa === nomeUsuario || j.fora === nomeUsuario || j.bye === nomeUsuario)) };
}

export function simularCopaNacionalTecnico({ clubes, nomeUsuario, pais, forcaUsuario, nome, bonusTecnico = 0, rng = sorteio }) {
  const participantes = escolherParticipantes(clubes.filter(c => c.pais === pais).map(c =>
    c.nome === nomeUsuario ? { ...c, elenco: forcaUsuario } : c), nomeUsuario, 16);
  if (participantes.length < 8 || !participantes.some(c => c.nome === nomeUsuario)) {
    return { nome, tipo: 'copa', campeao: null, faseUsuario: 'Não classificado', fases: [], jogosUsuario: [] };
  }
  return { nome, tipo: 'copa', participantes: participantes.length, ...jogarEliminatoria(participantes, nomeUsuario, bonusTecnico, rng) };
}

function regiaoContinental(pais) {
  if (['Brasil', 'Argentina', 'América do Sul'].includes(pais)) return 'sul-america';
  if (['Portugal', 'Espanha', 'Inglaterra', 'Itália', 'Alemanha', 'França', 'Países Baixos', 'Turquia'].includes(pais)) return 'europa';
  if (pais === 'Arábia Saudita') return 'asia';
  if (pais === 'Estados Unidos') return 'concacaf';
  return null;
}

export function simularCopaContinentalTecnico({ clubes, nomeUsuario, pais, forcaUsuario, nome, bonusTecnico = 0, rng = sorteio }) {
  const regiao = regiaoContinental(pais);
  if (!regiao) return null;
  const elegiveis = clubes.filter(c => regiaoContinental(c.pais) === regiao && !/(?:2|serieB)$/i.test(c.liga))
    .map(c => c.nome === nomeUsuario ? { ...c, elenco: forcaUsuario } : c);
  const participantes = escolherParticipantes(elegiveis, nomeUsuario, 16);
  if (participantes.length !== 16 || !participantes.some(c => c.nome === nomeUsuario)) return null;

  const sorteados = embaralhar(participantes, rng);
  const grupos = Array.from({ length: 4 }, (_, i) => sorteados.slice(i * 4, i * 4 + 4));
  const jogosGrupo = [];
  const classificados = [];
  grupos.forEach((grupo, indice) => {
    const tabela = new Map(grupo.map(c => [c.nome, { ...c, pontos: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0 }]));
    const jogos = [];
    for (let i = 0; i < grupo.length; i++) for (let j = i + 1; j < grupo.length; j++) {
      for (const [casa, fora] of [[grupo[i], grupo[j]], [grupo[j], grupo[i]]]) {
        const jogo = { ...criarPartida(casa, fora, nomeUsuario, bonusTecnico, rng), fase: `Fase de grupos · Grupo ${String.fromCharCode(65 + indice)}` };
        jogos.push(jogo); registrarJogo(tabela, jogo);
      }
    }
    const classificacao = classificarGrupo([...tabela.values()], jogos, rng);
    jogosGrupo.push({ grupo: String.fromCharCode(65 + indice), jogos, classificacao: classificacao.map(({ nome:n, pontos, golsPro, golsContra, vitorias }) => ({ nome:n, pontos, golsPro, golsContra, vitorias })) });
    classificados.push(...classificacao.slice(0, 2));
  });

  const eliminatoria = jogarEliminatoria(classificados, nomeUsuario, bonusTecnico, rng);
  const faseGrupoUsuario = jogosGrupo.find(g => g.classificacao.some(x => x.nome === nomeUsuario));
  const passouGrupos = !!faseGrupoUsuario && faseGrupoUsuario.classificacao.findIndex(x => x.nome === nomeUsuario) < 2;
  const faseUsuario = eliminatoria.faseUsuario === 'Não participou' ? (passouGrupos ? 'Eliminado na fase de grupos' : 'Eliminado na fase de grupos') : eliminatoria.faseUsuario;
  return { nome, tipo: 'continental', participantes: participantes.length, grupos: jogosGrupo,
    fases: eliminatoria.fases, campeao: eliminatoria.campeao, faseUsuario,
    jogosUsuario: [...jogosGrupo.flatMap(g => g.jogos.filter(j => j.casa === nomeUsuario || j.fora === nomeUsuario)),
      ...eliminatoria.jogosUsuario] };
}
