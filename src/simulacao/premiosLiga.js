/**
 * Prêmios da temporada por liga: seleção do campeonato (4-3-3), revelação
 * (até 21 anos), artilheiro e melhor técnico. Calculados com os números de
 * cada atleta naquela liga (porCompeticao) e a campanha dos clubes.
 */
import {LIGAS} from '../dados/data.js';
import {setorJogador} from './forcaEquipe.js';

/** Seleção do campeonato em 4-3-3: goleiro, lateral direito, dois zagueiros, lateral esquerdo, três meias e três atacantes. */
const FORMACAO = [['GOL', ['GOL'], 1], ['LD', ['LD', 'MD'], 1], ['ZAG', ['ZAG'], 2], ['LE', ['LE', 'ME'], 1], ['MEI', ['VOL', 'MC', 'MEI'], 3], ['ATA', ['PE', 'PD', 'ATA', 'SA'], 3]];
/** Nota de desempenho na liga, por setor. */
export function notaPremio({setor, jogos = 0, gols = 0, assist = 0, cleanSheets = 0}) {
  if (jogos < 8) return 0;
  if (setor === 'GOL') return cleanSheets * 2 + jogos * 0.4;
  if (setor === 'DEF') return cleanSheets * 0.6 + gols * 3 + assist * 2 + jogos * 0.5;
  if (setor === 'MEI') return gols * 2.5 + assist * 2.5 + jogos * 0.35;
  return gols * 3 + assist * 1.5 + jogos * 0.25;
}

export function premiosDaTemporada(anterior = {}, a, {jogadores = [], antesPorId = new Map(), tecnicos = {}, desempenhos = new Map(), usuario = null, tecnicoUsuario = null} = {}) {
  const todos = {...(anterior || {})};
  const doAno = {};
  for (const [liga, t] of Object.entries(a?.classificacoesMundo || {})) {
    const nomeLiga = LIGAS[liga]?.nome;
    if (!nomeLiga || !t?.classificacao?.length || ['serieC', 'serieD'].includes(liga)) continue;
    const candidatos = [];
    for (const p of jogadores) {
      const s = (p.porCompeticao || []).find(x => x.nome === nomeLiga);
      if (!s?.jogos) continue;
      const clube = antesPorId.get(String(p.id))?.clubeNome || p.clubeTemporada || p.clubeNome;
      candidatos.push({id: p.id, nome: p.nome, posicao: p.posicao, setor: setorJogador(p), idade: (p.idade ?? 30) - 1, clube, jogos: s.jogos, gols: s.gols || 0, assist: s.assist || 0, cleanSheets: s.cleanSheets || 0});
    }
    const meu = usuario && (a.porCompeticao || []).find(x => x.nome === nomeLiga);
    if (meu?.jogos) candidatos.push({id: 'voce', voce: true, nome: usuario.nome || 'Você', posicao: usuario.posicao, setor: setorJogador({posicao: usuario.posicao}), idade: usuario.idade, clube: usuario.clube,
      jogos: meu.jogos, gols: meu.gols || 0, assist: meu.assist || 0, cleanSheets: meu.cleanSheets || 0});
    for (const x of candidatos) x.nota = Math.round(notaPremio(x) * 10) / 10;
    const ordem = [...candidatos].sort((x, y) => y.nota - x.nota || y.jogos - x.jogos);
    const usados = new Set();
    const xi = FORMACAO.flatMap(([, posicoes, n]) => {
      const escolhidos = ordem.filter(x => posicoes.includes(x.posicao) && x.nota > 0 && !usados.has(x.id)).slice(0, n);
      escolhidos.forEach(x => usados.add(x.id));
      return escolhidos;
    });
    const revelacao = ordem.find(x => x.idade <= 21 && x.nota > 0) || null;
    const artilheiro = [...candidatos].sort((x, y) => y.gols - x.gols || x.jogos - y.jogos)[0] || null;
    // Melhor técnico: o campeão, salvo campanha muito acima do esperado de outro clube.
    const campeao = t.classificacao[0]?.nome;
    const surpresa = t.classificacao.slice(1, 6).map(x => x.nome).filter(n => (desempenhos.get(n) ?? 0) >= 0.45)[0];
    const clubeTecnico = surpresa || campeao;
    const nomeTecnico = tecnicoUsuario?.clube === clubeTecnico ? tecnicoUsuario.nome : tecnicos[clubeTecnico]?.nome;
    const enxuto = x => x && {id: x.id, nome: x.nome, posicao: x.posicao, clube: x.clube, jogos: x.jogos, gols: x.gols, assist: x.assist, nota: x.nota, ...(x.voce ? {voce: true} : {})};
    doAno[nomeLiga] = {campeao, xi: xi.map(enxuto), revelacao: enxuto(revelacao), artilheiro: enxuto(artilheiro),
      tecnico: nomeTecnico ? {nome: nomeTecnico, clube: clubeTecnico, motivo: surpresa ? 'Campanha acima do esperado' : 'Campeão', ...(tecnicoUsuario?.clube === clubeTecnico ? {voce: true} : {})} : null};
  }
  if (Object.keys(doAno).length) todos[a.ano] = doAno;
  // Guarda as 15 temporadas mais recentes.
  const anos = Object.keys(todos).map(Number).sort((x, y) => y - x).slice(0, 15);
  return Object.fromEntries(anos.map(ano => [ano, todos[ano]]));
}
