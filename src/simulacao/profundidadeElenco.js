/**
 * Regras compartilhadas de profundidade mínima de elenco.
 * Diagnóstico puro: não modifica atletas nem gera jogadores.
 */
export const MINIMOS_ELENCO = Object.freeze({
  GOL: 3, LD: 2, LE: 2, ZAG: 4,
  VOL: 2, MC: 2, MEI: 1, PD: 2, PE: 2, ATA: 2,
});

export const TOTAL_MINIMO_ELENCO = Object.values(MINIMOS_ELENCO)
  .reduce((total, quantidade) => total + quantidade, 0);

const ALIASES = Object.freeze({
  GK: 'GOL', G: 'GOL',
  DC: 'ZAG', DFC: 'ZAG', CB: 'ZAG',
  RB: 'LD', LB: 'LE',
  DM: 'VOL', CDM: 'VOL',
  CM: 'MC', CAM: 'MEI', AM: 'MEI',
  RW: 'PD', LW: 'PE',
  ST: 'ATA', CF: 'ATA', SA: 'ATA',
});
export function normalizarPosicao(posicao) {
  if (typeof posicao !== 'string') return null;
  const valor = posicao.trim().toUpperCase();
  return MINIMOS_ELENCO[valor] ? valor : (ALIASES[valor] || null);
}

export function diagnosticarElenco(jogadores = [], { clubeNome = null, contarSecundarias = false } = {}) {
  const contagem = Object.fromEntries(Object.keys(MINIMOS_ELENCO).map(pos => [pos, 0]));
  const usados = new Set();
  const atletas = jogadores.filter(j =>
    j && !j.aposentado && (clubeNome === null || j.clubeNome === clubeNome)
  );
  // Cada atleta só conta uma vez, priorizando sua posição principal.
  for (let indice = 0; indice < atletas.length; indice++) {
    const jogador = atletas[indice];
    const pos = normalizarPosicao(jogador.posicao);
    if (pos) { contagem[pos]++; usados.add(indice); }
  }
  if (contarSecundarias) {
    // Somente atletas sem posição principal reconhecida entram por posição secundária.
    // Não contabilizar o mesmo atleta duas vezes para cumprir a cobertura.
    for (let indice = 0; indice < atletas.length; indice++) {
      if (usados.has(indice)) continue;
      const secundarias = atletas[indice].posicoesSecundarias || [];
      for (const secundaria of secundarias) {
        const pos = normalizarPosicao(secundaria);
        if (pos && contagem[pos] < MINIMOS_ELENCO[pos]) {
          contagem[pos]++;
          usados.add(indice);
          break;
        }
      }
    }
  }
  const faltantes = Object.fromEntries(
    Object.entries(MINIMOS_ELENCO).map(([pos, minimo]) => [pos, Math.max(0, minimo - contagem[pos])])
  );
  const totalFaltante = Object.values(faltantes).reduce((a, b) => a + b, 0);
  return {
    contagem, faltantes, totalFaltante,
    totalAtivo: atletas.length,
    completo: totalFaltante === 0,
  };
}
