/** Conserva os placares antes de descartar o estado transitório da rodada. */
export function registrarRodadaTemporada(card, historico = []) {
  const jogos = new Map((card.jogosLiga || []).map(j => [`${j.rodada}|${j.casa}|${j.fora}`, j]));
  for (const j of historico) {
    if (!j.casa || !j.fora || !Number.isInteger(j.golsCasa) || !Number.isInteger(j.golsFora)) continue;
    jogos.set(`${j.rodada}|${j.casa}|${j.fora}`, { ...j });
  }
  card.jogosLiga = [...jogos.values()];
}

/** As seleções têm contagem própria e nunca entram nos totais do clube. */
export function estatisticasReaisTemporada(card, jogos) {
  const presentes = jogos.filter(j => !j.suspenso && !j.descansou && !j.naoEscalado);
  const liga = presentes.reduce((s, j) => ({
    jogos: s.jogos + 1, gols: s.gols + (j.golsMinha || 0), assist: s.assist + (j.assistMinha || 0),
    defesas: s.defesas + (j.defesas || 0), cleanSheets: s.cleanSheets + (j.cleanSheets || 0),
  }), { jogos: 0, gols: 0, assist: 0, defesas: 0, cleanSheets: 0 });
  const porCompeticaoReal = { liga };
  for (const id of ['copaNacional', 'estadual', 'copinhaCarreira', 'continental', 'mundial']) {
    const s = card.statsCompeticoes?.[id];
    if (s) porCompeticaoReal[id === 'copinhaCarreira' ? 'copinha' : id] = { ...s };
  }
  const total = Object.values(porCompeticaoReal).reduce((s, v) => {
    for (const k of ['jogos', 'gols', 'assist', 'defesas', 'cleanSheets']) s[k] += v[k] || 0;
    return s;
  }, { jogos: 0, gols: 0, assist: 0, defesas: 0, cleanSheets: 0 });
  return { ...total, porCompeticaoReal, origemEstatisticas: 'partidas' };
}
