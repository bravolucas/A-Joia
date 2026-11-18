/** Lê o arquivo compacto sem acoplar o histórico ao motor de simulação. */
function jogosDaEdicao(edicao) {
  if (Array.isArray(edicao?.jogos)) return edicao.jogos;
  const {nomes=[],partidas=[]}=edicao?.jogos||{};
  return partidas.map(([a,b,golsCasa,golsFora,rodada,v,penaltis])=>({
    casa:nomes[a],fora:nomes[b],golsCasa,golsFora,rodada,
    vencedor:v==null?null:nomes[v],penaltis:!!penaltis
  }));
}

/** Leitura do arquivo de partidas do save. Não cria placares nem números ausentes. */
const valido = j => !!j?.casa && !!j?.fora && Number.isFinite(j.golsCasa) && Number.isFinite(j.golsFora);
const numero = n => Number.isFinite(n) ? n : null;
const idJogo = (ano, competicao, j, i) => [ano, competicao, j.casa, j.fora, j.rodada ?? j.fase ?? i, i].join('|');

export function partidasHistoricas(c = {}) {
  const u = c.tecnico?.universo || c.universo || {};
  const partidas = [];
  for (const edicao of u.edicoes || []) {
    for (const [i, j] of jogosDaEdicao(edicao).entries()) {
      if (!valido(j)) continue;
      partidas.push({
        ...j, id: idJogo(edicao.ano, edicao.nome, j, i),
        ano: edicao.ano, competicao: edicao.nome,
        fase: typeof j.rodada === 'string' ? j.rodada : j.fase || null,
      });
    }
  }
  return partidas;
}

/** Uma partida só vale uma vez, inclusive quando o campeonato já foi arquivado. */
export function resumoConfrontosClubes(c, {clube, adversario = '', competicao = '', ano = ''} = {}) {
  if (!clube) return {jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0,aproveitamento:0,partidas:[],porCompeticao:[]};
  const partidas = partidasHistoricas(c).filter(j =>
    (j.casa === clube || j.fora === clube) &&
    (!adversario || (j.casa === adversario || j.fora === adversario)) &&
    (!competicao || j.competicao === competicao) &&
    (!ano || String(j.ano) === String(ano))
  );
  const resumo = {jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0};
  const porCompeticao = new Map();
  for (const j of partidas) {
    const a = j.casa === clube ? j.golsCasa : j.golsFora;
    const b = j.casa === clube ? j.golsFora : j.golsCasa;
    const r = a > b ? 'vitorias' : a < b ? 'derrotas' : 'empates';
    for (const alvo of [resumo, porCompeticao.get(j.competicao) || (() => {
      const v = {competicao:j.competicao,jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0};
      porCompeticao.set(j.competicao,v);return v;
    })()]) {
      alvo.jogos++;alvo.golsPro += a;alvo.golsContra += b;alvo[r]++;
    }
  }
  return {...resumo,aproveitamento:resumo.jogos ? Math.round(100*(3*resumo.vitorias+resumo.empates)/(3*resumo.jogos)) : 0,
    partidas:[...partidas].reverse(),porCompeticao:[...porCompeticao.values()].sort((a,b)=>b.jogos-a.jogos)};
}

/** Transforma estatísticas individuais reais da partida em registros compactos.
 * Saves que só têm agregados anuais permanecem sem dados adversário a adversário. */
export function partidasDetalhadasUsuario(card = {}) {
  const ano = card.ano, clube = card.clube?.nome || card.clube;
  if (!clube || !Number.isFinite(ano)) return [];
  const liga = card.ligaNome || card.ligaId || 'Liga';
  const jogos = [];
  const salvar = (j, competicao, origem, indice, stats) => {
    if (!valido(j) || !competicao) return;
    jogos.push({
      id: [ano,origem,competicao,indice].join('|'),ano,competicao,
      clube, adversario:j.casa === clube ? j.fora : j.casa,
      casa:j.casa,fora:j.fora,golsCasa:j.golsCasa,golsFora:j.golsFora,
      rodada:j.rodada ?? null,fase:j.fase || null,
      participou:stats.participou,
      gols:numero(stats.gols),assistencias:numero(stats.assistencias),
      defesas:numero(stats.defesas),cleanSheets:numero(stats.cleanSheets),nota:numero(stats.nota),
    });
  };
  for (const [i,j] of (card.jogosLista||[]).entries()) {
    if (!j?.adversario) continue;
    const golsMeu = numero(j.golsMeu), golsAdv = numero(j.golsAdv);
    if (golsMeu === null || golsAdv === null) continue;
    const participou = !j.suspenso && !j.descansou && !j.naoEscalado;
    salvar({casa:j.casa?clube:j.adversario,fora:j.casa?j.adversario:clube,
      golsCasa:j.casa?golsMeu:golsAdv,golsFora:j.casa?golsAdv:golsMeu,
      rodada:j.rodada??j.numero??i+1},liga,'liga',i,{
      participou,gols:participou?j.golsMinha:0,assistencias:participou?j.assistMinha:0,
      defesas:participou?j.defesas:0,cleanSheets:participou?j.cleanSheets:0,nota:participou?j.nota:null
    });
  }
  for (const [i,j] of (card.partidasCompeticoes||[]).entries()) {
    if (j?.selecao || !j.competicao) continue;
    salvar(j,j.competicao,'copa',i,{
      participou:j.naoEscalado?false:true,gols:j.gols,assistencias:j.assist,
      defesas:j.defesas,cleanSheets:j.cleanSheets,nota:j.nota
    });
  }
  return jogos;
}

export function registrarPartidasDetalhadasUsuario(universo, card) {
  const novos = partidasDetalhadasUsuario(card);
  if (!novos.length) return universo;
  const anteriores = universo.partidasAtletas?.voce || [];
  const ids = new Set(anteriores.map(j=>j.id));
  const inseridos = novos.filter(j=>!ids.has(j.id));
  if (!inseridos.length) return universo;
  return {...universo,partidasAtletas:{...(universo.partidasAtletas||{}),voce:[...anteriores,...inseridos]}};
}

export function partidasDoAtleta(c, jogadorId = 'voce') {
  const u = c.tecnico?.universo || c.universo || {};
  const arquivo = u.partidasAtletas?.[String(jogadorId)] || [];
  const diretas = String(jogadorId)==='voce'
    ? (c.temporadas||[]).flatMap(partidasDetalhadasUsuario) : [];
  const mapa = new Map();
  // Preferir os registros já gravados: uma temporada não deve ser contada duas vezes.
  for (const j of [...diretas,...arquivo]) if (j?.clube && j?.adversario) mapa.set(j.id,j);
  return [...mapa.values()].sort((a,b)=>a.ano-b.ano);
}

export function resumoConfrontosAtleta(c, {jogadorId = 'voce', adversario = '', competicao = '', ano = ''} = {}) {
  const partidas = partidasDoAtleta(c,jogadorId).filter(j =>
    j.participou !== false &&
    (!adversario || j.adversario === adversario) &&
    (!competicao || j.competicao === competicao) &&
    (!ano || String(j.ano) === String(ano)));
  const total = {jogos:partidas.length,gols:0,assistencias:0,defesas:0,cleanSheets:0,notas:0,notasDisponiveis:0};
  const porCompeticao = new Map();
  for (const j of partidas) {
    let s=porCompeticao.get(j.competicao);
    if (!s){s={competicao:j.competicao,jogos:0,gols:0,assistencias:0,defesas:0,cleanSheets:0};porCompeticao.set(j.competicao,s);}
    s.jogos++;
    for (const k of ['gols','assistencias','defesas','cleanSheets']) if (Number.isFinite(j[k])) {s[k]+=j[k];total[k]+=j[k];}
    if (Number.isFinite(j.nota)){total.notas+=j.nota;total.notasDisponiveis++;}
  }
  return {...total,notaMedia:total.notasDisponiveis ? Math.round(total.notas/total.notasDisponiveis*100)/100 : null,
    partidas:[...partidas].reverse(),porCompeticao:[...porCompeticao.values()].sort((a,b)=>b.jogos-a.jogos)};
}
