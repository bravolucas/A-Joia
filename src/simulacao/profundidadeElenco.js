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

/**
 * Sem uma informação de aptidão explícita, uma posição secundária em texto
 * é apenas um rótulo: não é prova de que o jogador consiga cobrir a vaga.
 * Valores numéricos só contam se o consumidor definir o mínimo (0..100).
 * Isso evita inventar um limiar de proficiência não definido no game design.
 */
function podeCobrirSecundaria(jogador, entrada, minimo) {
  const rotulo = typeof entrada === 'string' ? entrada : entrada?.posicao ?? entrada?.id;
  const posicao = normalizarPosicao(rotulo);
  if (!posicao) return null;
  if (typeof entrada === 'object' && (entrada.apto === true || entrada.apta === true)) return posicao;
  const habilidades = jogador.proficienciaPosicoes || jogador.proficiencias || {};
  const nivel = typeof entrada === 'object'
    ? entrada.proficiencia ?? entrada.nivel ?? habilidades[rotulo] ?? habilidades[posicao]
    : habilidades[rotulo] ?? habilidades[posicao];
  return Number.isFinite(minimo) && Number.isFinite(nivel) && nivel >= minimo ? posicao : null;
}

export function diagnosticarElenco(jogadores = [], {
  clubeNome = null, contarSecundarias = false, proficienciaMinima = null,
} = {}) {
  const posicoes = Object.keys(MINIMOS_ELENCO);
  const contagem = Object.fromEntries(posicoes.map(pos => [pos, 0]));
  const atletas = jogadores.filter(j =>
    j && !j.aposentado && (clubeNome === null || j.clubeNome === clubeNome)
  );
  const principais = atletas.map(j => normalizarPosicao(j.posicao));
  for (const pos of principais) if (pos) contagem[pos]++;

  if (contarSecundarias) {
    // Associação de atletas com vagas disponíveis, sem contar ninguém duas
    // vezes. Permite mover um atleta versátil para liberar sua posição principal
    // a outro jogador quando isso aumenta a cobertura total do elenco.
    const elegiveis = atletas.map((j, i) => [
      principais[i],
      ...(Array.isArray(j.posicoesSecundarias) ? j.posicoesSecundarias : [])
        .map(entrada => podeCobrirSecundaria(j, entrada, proficienciaMinima)),
    ].filter((pos, i, todas) => pos && todas.indexOf(pos) === i));
    const porPosicao = Object.fromEntries(posicoes.map(pos => [pos, []]));
    const tentar = (indice, tentadas) => {
      for (const pos of elegiveis[indice]) {
        if (tentadas.has(pos)) continue;
        tentadas.add(pos);
        const titulares = porPosicao[pos];
        if (titulares.length < MINIMOS_ELENCO[pos]) {
          titulares.push(indice);
          return true;
        }
        for (let slot=0;slot<titulares.length;slot++) {
          if (tentar(titulares[slot], tentadas)) {
            titulares[slot] = indice;
            return true;
          }
        }
      }
      return false;
    };
    for (let i=0;i<atletas.length;i++) tentar(i,new Set());
    for (const [pos,indices] of Object.entries(porPosicao)) {
      for (const indice of indices) {
        const principal = principais[indice];
        if (principal !== pos) {
          if (principal) contagem[principal]--;
          contagem[pos]++;
        }
      }
    }
  }
  const faltantes = Object.fromEntries(
    Object.entries(MINIMOS_ELENCO).map(([pos, minimo]) => [pos, Math.max(0, minimo-contagem[pos])])
  );
  const totalFaltante = Object.values(faltantes).reduce((a,b) => a+b, 0);
  return { contagem, faltantes, totalFaltante, totalAtivo: atletas.length, completo: totalFaltante === 0 };
}
