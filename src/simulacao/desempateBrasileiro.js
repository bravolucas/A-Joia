/**
 * Desempate do Campeonato Brasileiro (art. 12 do REC Série B 2026).
 * Ordem: pontos, vitórias, saldo, gols pró, confronto direto (somente
 * se exatamente dois clubes seguem empatados), vermelhos e amarelos.
 *
 * Para saves legados sem cartões registrados, a ordenação alfabética
 * estável é usada como último recurso técnico. Não inventamos cartões
 * retroativos nem um sorteio supostamente oficial sem estado persistido.
 */
export function ordenarTabelaBrasileira(linhas = [], jogos = []) {
  const dados = Array.isArray(linhas) ? linhas : [];
  const partidas = Array.isArray(jogos) ? jogos : [];
  const numero = (valor) => Number.isFinite(Number(valor)) ? Number(valor) : 0;
  const chave = (linha) => [
    numero(linha.pontos), numero(linha.vitorias),
    numero(linha.saldoGols ?? (numero(linha.golsPro) - numero(linha.golsContra))),
    numero(linha.golsPro),
  ].join('|');
  const grupos = new Map();
  for (const linha of dados) grupos.set(chave(linha), (grupos.get(chave(linha)) || 0) + 1);
  const direto = (a, b) => {
    if (chave(a) !== chave(b) || grupos.get(chave(a)) !== 2) return 0;
    const encontros = partidas.filter(j =>
      (j.casa === a.nome && j.fora === b.nome) ||
      (j.casa === b.nome && j.fora === a.nome));
    // O REC considera o placar agregado dos dois jogos, sem gol fora.
    if (encontros.length !== 2 || !encontros.every(j =>
      Number.isFinite(j.golsCasa) && Number.isFinite(j.golsFora))) return 0;
    let golsA = 0, golsB = 0;
    for (const jogo of encontros) {
      if (jogo.casa === a.nome) {
        golsA += jogo.golsCasa; golsB += jogo.golsFora;
      } else {
        golsB += jogo.golsCasa; golsA += jogo.golsFora;
      }
    }
    return golsB - golsA;
  };
  const disciplina = (a, b, chaveCampo) => {
    if (!Number.isFinite(a[chaveCampo]) || !Number.isFinite(b[chaveCampo])) return 0;
    return a[chaveCampo] - b[chaveCampo];
  };
  return [...dados].sort((a, b) =>
    numero(b.pontos) - numero(a.pontos) ||
    numero(b.vitorias) - numero(a.vitorias) ||
    numero(b.saldoGols ?? (numero(b.golsPro) - numero(b.golsContra))) -
      numero(a.saldoGols ?? (numero(a.golsPro) - numero(a.golsContra))) ||
    numero(b.golsPro) - numero(a.golsPro) ||
    direto(a, b) ||
    disciplina(a, b, 'cartoesVermelhos') ||
    disciplina(a, b, 'cartoesAmarelos') ||
    String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR')
  );
}
