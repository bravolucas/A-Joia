/* Momentos da carreira de treinador: finais decididas pelo jogador, parada no meio
   da temporada, ano sem clube, Copa do Mundo com a seleção, personagens que voltam,
   técnico rival e metas de carreira. Tudo aqui é determinístico a partir do save. */
import { NACIONALIDADES } from '../dados/data.js';

const limitar = (n, min, max) => Math.max(min, Math.min(max, n));
export const hashTecnico = s => [...String(s)].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
/** Gerador reproduzível: o mesmo texto sempre produz a mesma sequência. */
export function geradorTecnico(semente) {
  let estado = hashTecnico(semente) || 1;
  return () => ((estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0) / 4294967296);
}

/* ---------- Finais ---------- */
export const FINAIS_TECNICO = [
  { id: 'atacar', nome: 'Pressão desde o início', descricao: 'Ir para cima e decidir cedo. Rende mais quando seu time é superior.' },
  { id: 'controlar', nome: 'Jogo controlado', descricao: 'Ter a bola, errar pouco e esperar o momento.' },
  { id: 'segurar', nome: 'Fechar e contra-atacar', descricao: 'Defender bem e sair rápido. Rende mais quando o rival é superior.' },
];
export function chanceFinalTecnico(final, opcaoId, moral = 50) {
  const diff = (final.forcaUsuario ?? 70) - (final.forcaAdv ?? 70);
  const base = 0.5 + diff * 0.02 + ((moral ?? 50) - 50) * 0.002;
  const ajuste = opcaoId === 'atacar' ? (diff >= 0 ? 0.06 : -0.03) : opcaoId === 'segurar' ? (diff < 0 ? 0.07 : -0.04) : 0.02;
  return Math.round(limitar(base + ajuste, 0.15, 0.85) * 100) / 100;
}
/** Encontra a final de um torneio em que o time do usuário está. */
export function finalDoUsuarioTecnico(torneio, lado) {
  const fase = torneio?.fases?.at(-1);
  if (fase?.fase !== 'Final') return null;
  const jogo = fase?.jogos?.find(j => !j.bye && (j.casa === lado || j.fora === lado));
  if (!jogo) return null;
  return { nome: torneio.nome, tipo: torneio.tipo, lado, adversario: jogo.casa === lado ? jogo.fora : jogo.casa, campoNeutro: !!jogo.campoNeutro };
}
/** Troca o jogo da final pelo resultado decidido na tela e acerta campeão e fase. */
export function aplicarResultadoFinalTecnico(torneio, final, venceu, rng) {
  const vencedorNome = venceu ? final.lado : final.adversario;
  const penaltis = rng() < 0.28;
  const gv = penaltis ? Math.floor(rng() * 3) : 1 + Math.floor(rng() * 3);
  const gp = penaltis ? gv : Math.floor(rng() * gv);
  const fases = (torneio.fases || []).map((f, i, todas) => i < todas.length - 1 ? f : { ...f, jogos: f.jogos.map(j => {
    if (j.bye || (j.casa !== final.lado && j.fora !== final.lado)) return j;
    const casaVence = j.casa === vencedorNome;
    return { casa: j.casa, fora: j.fora, fase: j.fase, rodada: j.rodada, campoNeutro: j.campoNeutro, golsCasa: casaVence ? gv : gp, golsFora: casaVence ? gp : gv,
      vencedor: vencedorNome, penaltis, decididaPeloTreinador: true };
  }) });
  const placar = penaltis ? `${gv} x ${gp} (pênaltis)` : `${venceu ? gv : gp} x ${venceu ? gp : gv}`;
  return { torneio: { ...torneio, fases, campeao: vencedorNome, faseUsuario: venceu ? 'Campeão' : 'Final', finalPendente: false,
    jogosUsuario: [...(torneio.grupos || []).flatMap(g=>(g.jogos||[]).filter(j=>j.casa===final.lado||j.fora===final.lado)), ...fases.flatMap(f => f.jogos.filter(j => j.casa === final.lado || j.fora === final.lado || j.bye === final.lado))] }, placar, penaltis };
}

/* ---------- Parada no meio da temporada ---------- */
export function paradasDoRitmoTecnico(ritmo, total) {
  if (!total || total < 6) return [];
  if (ritmo === 'expresso') return [];
  if (ritmo === 'intenso') return [Math.round(total / 3), Math.round(total * 2 / 3)];
  return [Math.round(total / 2)];
}
export const OPCOES_PARADA_TECNICO = {
  normal: [
    { id: 'apertar', nome: 'Apertar o ritmo', descricao: 'Time +3 até o fim da temporada. Moral −4.', forca: 3, moral: -4 },
    { id: 'rodar', nome: 'Rodar o elenco', descricao: 'Moral +6. Time −1 até o fim da temporada.', forca: -1, moral: 6 },
    { id: 'manter', nome: 'Manter o que funciona', descricao: 'Sem mudanças. Diretoria +2.', diretoria: 2 },
  ],
  crise: [
    { id: 'responsabilidade', nome: 'Assumir a responsabilidade', descricao: 'Diretoria +10. Moral −3.', diretoria: 10, moral: -3 },
    { id: 'reforcos', nome: 'Pedir reforços', descricao: 'Time +3 até o fim. Diretoria −5.', forca: 3, diretoria: -5 },
    { id: 'defender', nome: 'Defender o trabalho', descricao: 'Moral +6. A diretoria pode comprar a ideia… ou não.', moral: 6, aposta: true },
  ],
  // Clássico contra o técnico rival: vale para este jogo; vencer anima a torcida (+5), perder pesa (−5).
  rival: [
    { id: 'atacar', nome: 'Ir para cima', descricao: 'Estilo ofensivo neste jogo: mais gols e mais riscos.' },
    { id: 'proteger', nome: 'Jogo de xadrez', descricao: 'Estilo defensivo: mais empates, menos sustos.' },
    { id: 'provocar', nome: 'Provocar na coletiva', descricao: 'Moral +5 antes do jogo. Se perder, a torcida cobra em dobro (−10).', moral: 5 },
  ],
};

/* ---------- Ano sem clube ---------- */
export const ANO_SEM_CLUBE_TECNICO = [
  { id: 'curso', nome: 'Curso de treinador', descricao: 'OVR +1 permanente (até +5 por carreira). Reputação −1: você some do noticiário.' },
  { id: 'comentarista', nome: 'Comentarista de TV', descricao: 'Reputação +3 e R$ 480 mil no seu saldo. Você continua em evidência.' },
  { id: 'estagio', nome: 'Estágio no exterior', descricao: 'Reputação +1 e portas abertas para propostas de outros países.' },
  { id: 'esperar', nome: 'Esperar o telefone tocar', descricao: 'Sem custo, mas a reputação cai 2 pontos.' },
];

/* ---------- Personagens que voltam ---------- */
const PERFIS_CONTRATACAO = {
  'craque-jovem|craque': { idade: 29, tipo: 'craque' }, 'craque-jovem|jovem': { idade: 19, tipo: 'promessa' },
  'rival|contratar': { idade: 26, tipo: 'craque' }, 'veterano|veterano': { idade: 34, tipo: 'veterano' },
  'emprestimo|emprestar': { idade: 24, tipo: 'emprestado' }, 'olheiro|aposta': { idade: 20, tipo: 'promessa' },
  'dupla|dupla': { idade: 30, tipo: 'craque' },
};
const nivelDoNome = nome => { const m = String(nome).match(/nível (\d+)/); return m ? Number(m[1]) : null; };
const nomeDoJogador = nome => String(nome).replace(/^(Contratar|Trazer)\s+/, '').replace(/\s*·.*$/, '').trim();
/** Registra o jogador fictício contratado numa carta da pré-temporada. */
export function registrarPersonagemTecnico(t, cartaId, opcao) {
  const perfil = PERFIS_CONTRATACAO[`${cartaId}|${opcao.id}`];
  const nivel = nivelDoNome(opcao.nome);
  if (!perfil || !nivel) return t.personagens || [];
  const nome = /Aposta jovem/.test(opcao.nome) ? `${nomeDoJogador(opcao.nome).replace('Aposta jovem', 'Garoto')} ${['Lima', 'Souza', 'Nunes', 'Prado'][hashTecnico(t.clube + t.ano) % 4]}` : nomeDoJogador(opcao.nome);
  const lista = t.personagens || [];
  if (lista.some(p => p.nome === nome && p.status === 'ativo')) return lista;
  const potencial = perfil.tipo === 'promessa' ? Math.min(99, nivel + 8 + hashTecnico(nome) % 6) : nivel;
  return [...lista, { id: `${t.clube}|${t.ano}|${nome}`, nome, nivel, potencial, idade: perfil.idade, tipo: perfil.tipo, clube: t.clube, desde: t.ano, status: 'ativo', historia: [`${t.ano}: chegou ao ${t.clube}`] }].slice(-24);
}
/** Um ano passa para os personagens: evoluem, são vendidos, voltam de empréstimo ou se aposentam. */
export function evoluirPersonagensTecnico(t) {
  const noticias = [], base = t.elenco ?? 60;
  let verba = 0;
  const personagens = (t.personagens || []).map(p => {
    if (p.status !== 'ativo') return p;
    const r = geradorTecnico(`${p.id}|${t.ano}`);
    const idade = p.idade + 1;
    let nivel = p.nivel;
    if (idade <= 23) nivel = Math.min(p.potencial, nivel + 1 + Math.floor(r() * 4));
    else if (idade >= 31) nivel = Math.max(40, nivel - 2 - Math.floor(r() * 3));
    const atual = { ...p, idade, nivel, historia: [...(p.historia || [])] };
    if (p.tipo === 'emprestado') { noticias.push(`${p.nome} terminou o empréstimo e voltou ao clube de origem.`); return { ...atual, status: 'devolvido', historia: [...atual.historia, `${t.ano}: fim do empréstimo`] }; }
    if (p.clube !== t.clube) { noticias.push(`${p.nome} seguiu no ${p.clube} depois da sua saída.`); return { ...atual, status: 'ficou', historia: [...atual.historia, `${t.ano}: ficou no ${p.clube}`] }; }
    if (idade >= 35 || (idade >= 33 && r() < 0.4)) { noticias.push(`${p.nome} pendurou as chuteiras aos ${idade} anos. Uma despedida emocionante no ${p.clube}.`); return { ...atual, status: 'aposentado', historia: [...atual.historia, `${t.ano}: aposentou-se`] }; }
    if (p.tipo === 'promessa' && idade >= 21 && nivel >= base + 4 && r() < 0.45) {
      const valor = Math.round(nivel * nivel / 4.5);
      verba += valor;
      noticias.push(`${p.nome}, aquela aposta de ${p.idade - (t.ano - p.desde)} anos, foi vendido para a Europa. Verba +R$ ${valor.toLocaleString('pt-BR')} mil.`);
      return { ...atual, status: 'vendido', historia: [...atual.historia, `${t.ano}: vendido por R$ ${valor} mil`] };
    }
    if (nivel > p.nivel + 2) noticias.push(`${p.nome} evoluiu e já é nível ${nivel}.`);
    return atual;
  });
  const destaque = personagens.filter(p => p.status === 'ativo' && p.clube === t.clube && p.nivel >= base + 5).length ? 1 : 0;
  return { personagens, noticias, verba, bonusForca: destaque };
}
export const personagemDestaqueTecnico = t => (t.personagens || []).filter(p => p.status === 'ativo' && p.clube === t.clube).sort((a, b) => b.nivel - a.nivel)[0] || null;

/* ---------- Técnico rival ---------- */
const NOMES_RIVAIS = ['Otávio Lemos', 'Martín Aguirre', 'Renato Falcão', 'Hugo Castellano', 'Jorge Bittencourt', 'Sérgio Valadares', 'Paolo Ricci', 'Klaus Bremer', 'Álvaro Ruiz', 'Edu Marins', 'Fábio Cunha', 'Lionel Dupont'];
export function definirRivalTecnico(t, clubesLiga) {
  const atual = t.rivalTecnico;
  if (atual && clubesLiga.some(x => x.nome === atual.clube) && atual.clube !== t.clube) return atual;
  const outro = clubesLiga.filter(x => x.nome !== t.clube).sort((a, b) => b.elenco - a.elenco || a.nome.localeCompare(b.nome))[0];
  if (!outro) return null;
  // O rival dos tempos de jogador também virou técnico: o duelo continua no banco.
  const antigo = t.memoriaJogador?.rival?.nome;
  if (antigo) return { nome: antigo, clube: outro.nome, desde: t.ano, v: 0, e: 0, d: 0, titulosDele: 0, rivalDeGeracao: true };
  return { nome: NOMES_RIVAIS[hashTecnico(outro.nome) % NOMES_RIVAIS.length], clube: outro.nome, desde: t.ano, v: 0, e: 0, d: 0, titulosDele: 0 };
}
export function atualizarRivalTecnico(rival, temporada) {
  if (!rival) return null;
  const jogos = [...(temporada.confrontos || []).filter(j => j.nome === rival.clube && j.resultado),
    ...(temporada.torneios || []).flatMap(x => x.jogosUsuario || []).filter(j => !j.bye && (j.casa === rival.clube || j.fora === rival.clube) && j.vencedor !== undefined)
      .map(j => ({ resultado: j.vencedor === rival.clube ? 'D' : j.vencedor ? 'V' : 'E' }))];
  const contar = r => jogos.filter(j => j.resultado === r).length;
  const campeaoLiga = temporada.classificacao?.[0]?.nome === rival.clube;
  const copasDele = (temporada.torneios || []).filter(x => x.campeao === rival.clube).length;
  return { ...rival, v: rival.v + contar('V'), e: rival.e + contar('E'), d: rival.d + contar('D'), titulosDele: rival.titulosDele + (campeaoLiga ? 1 : 0) + copasDele,
    ultimo: { ano: temporada.ano, v: contar('V'), e: contar('E'), d: contar('D'), campeao: campeaoLiga } };
}

/* ---------- Copa do Mundo com a seleção ---------- */
export const anoDeCopaTecnico = ano => ano % 4 === 2;
export function conviteSelecaoTecnico(c, t, ovr) {
  if (!anoDeCopaTecnico(t.ano)) return null;
  const nacao = NACIONALIDADES.find(n => n.id === c?.nac) || NACIONALIDADES.find(n => n.id === 'BRA');
  if (!nacao?.forcaSelecao) return null;
  if ((t.reputacao ?? 0) < 62 || ovr < 58 || (t.temporadas?.length || 0) < 2) return null;
  return { ano: t.ano, nac: nacao.id, selecao: nacao.label, forca: nacao.forcaSelecao, status: 'pendente' };
}
function partidaSelecao(a, b, rng, mataMata) {
  const d = a.forca - b.forca;
  const pV = limitar(0.4 + d * 0.025, 0.08, 0.82), pE = mataMata ? 0 : 0.25;
  const r = rng();
  let res = r < pV ? 'V' : r < pV + pE ? 'E' : 'D';
  let penaltis = false;
  if (mataMata && res === 'D' && rng() < 0.3) { res = rng() < 0.5 ? 'V' : 'D'; penaltis = true; }
  const gv = penaltis ? Math.floor(rng() * 3) : 1 + Math.floor(rng() * 3), gp = penaltis ? gv : Math.floor(rng() * gv);
  const [ga, gb] = res === 'E' ? [gp, gp] : res === 'V' ? [gv, gp] : [gp, gv];
  return { casa: a.nome, fora: b.nome, golsCasa: ga, golsFora: gb, vencedor: res === 'E' ? null : res === 'V' ? a.nome : b.nome, penaltis };
}
/** Copa do Mundo da seleção comandada pelo treinador: grupo de 4 e mata-mata de 16. */
export function simularCopaSelecaoTecnico(convite, ovr, semente) {
  const rng = geradorTecnico(semente);
  const forca = limitar(convite.forca + Math.round((ovr - 60) * 0.1), 50, 99);
  const eu = { nome: convite.selecao, forca };
  const outras = NACIONALIDADES.filter(n => n.id !== convite.nac && n.forcaSelecao).map(n => ({ nome: n.label, forca: n.forcaSelecao }));
  const sortear = (min, max, usados) => { const pool = outras.filter(x => x.forca >= min && x.forca <= max && !usados.has(x.nome)); const x = pool[Math.floor(rng() * pool.length)] || outras.find(o => !usados.has(o.nome)); usados.add(x.nome); return x; };
  const usados = new Set();
  const grupo = [eu, sortear(84, 95, usados), sortear(74, 84, usados), sortear(55, 75, usados)];
  const tabela = new Map(grupo.map(x => [x.nome, { nome: x.nome, pontos: 0, golsPro: 0, golsContra: 0, vitorias: 0 }]));
  const jogosGrupo = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const jogo = { ...partidaSelecao(grupo[i], grupo[j], rng, false), fase: 'Fase de grupos', rodada: 1 };
    jogosGrupo.push(jogo);
    const a = tabela.get(jogo.casa), b = tabela.get(jogo.fora);
    a.golsPro += jogo.golsCasa; a.golsContra += jogo.golsFora; b.golsPro += jogo.golsFora; b.golsContra += jogo.golsCasa;
    if (!jogo.vencedor) { a.pontos++; b.pontos++; } else { const w = tabela.get(jogo.vencedor); w.pontos += 3; w.vitorias++; }
  }
  const classificacao = [...tabela.values()].sort((a, b) => b.pontos - a.pontos || (b.golsPro - b.golsContra) - (a.golsPro - a.golsContra) || b.golsPro - a.golsPro);
  const forcas = Object.fromEntries([eu, ...outras].map(x => [x.nome, x.forca]));
  const torneio = { nome: 'Copa do Mundo', tipo: 'copaMundo', selecao: convite.selecao, participantes: 32, forcas,
    grupos: [{ grupo: 'A', jogos: jogosGrupo, classificacao }], fases: [], campeao: null, faseUsuario: 'Eliminado na fase de grupos', jogosUsuario: jogosGrupo.filter(j => j.casa === eu.nome || j.fora === eu.nome) };
  if (classificacao.findIndex(x => x.nome === eu.nome) > 1) return torneio;
  const nomesFase = ['Oitavas de final', 'Quartas de final', 'Semifinal', 'Final'];
  const faixas = [[74, 86], [80, 90], [84, 95], [86, 99]];
  for (let f = 0; f < 4; f++) {
    const adv = sortear(faixas[f][0], faixas[f][1], usados);
    const jogo = { ...partidaSelecao(eu, adv, rng, true), fase: nomesFase[f], rodada: f + 1 };
    torneio.fases.push({ fase: nomesFase[f], rodada: f + 1, jogos: [jogo] });
    torneio.jogosUsuario.push(jogo);
    if (jogo.vencedor !== eu.nome) { torneio.faseUsuario = nomesFase[f] === 'Final' ? 'Final' : `Eliminado: ${nomesFase[f].toLowerCase()}`; torneio.campeao = f === 3 ? adv.nome : null; return torneio; }
  }
  torneio.campeao = eu.nome; torneio.faseUsuario = 'Campeão';
  return torneio;
}

/* ---------- Metas de carreira ---------- */
export function metasCarreiraTecnico(t = {}, paisDoClube = () => null, tipoTitulo = () => null) {
  const temporadas = t.temporadas || [];
  const titulosTemp = temporadas.map(a => ({ a, titulos: Array.isArray(a.titulosConquistados) ? a.titulosConquistados : a.campeao ? ['liga'] : [] }));
  const paises = new Set(titulosTemp.filter(x => x.titulos.some(n => tipoTitulo(n) !== 'copaMundo')).map(x => paisDoClube(x.a.clube)).filter(Boolean));
  const triplice = titulosTemp.some(({ a, titulos }) => a.campeao && (a.torneios || []).some(x => x.tipo === 'copa' && x.campeao === a.clube) && (a.torneios || []).some(x => x.tipo === 'continental' && x.campeao === a.clube));
  const acessoTitulo = temporadas.some((a, i) => a.acesso && temporadas.slice(i + 1).some(b => b.clube === a.clube && b.campeao && !/(?:2|serieB)$/i.test(b.liga || '')));
  const copa = titulosTemp.some(x => x.titulos.some(n => tipoTitulo(n) === 'copaMundo'));
  const continental = titulosTemp.some(({ a }) => (a.torneios || []).some(x => x.tipo === 'continental' && x.campeao === a.clube));
  const totalTitulos = titulosTemp.reduce((n, x) => n + x.titulos.length, 0);
  const vitorias = temporadas.reduce((n, a) => n + (a.vitorias || 0), 0);
  const clubes = new Set(temporadas.map(a => a.clube).filter(Boolean)).size;
  const salvou = temporadas.some(a => a.objetivo === 'Evitar rebaixamento' && a.cumpriuObjetivo && !a.rebaixado);
  return [
    { id: 'tres-paises', nome: 'Campeão em três países', descricao: 'Ganhe títulos com clubes de três países.', feito: paises.size >= 3, progresso: `${Math.min(3, paises.size)}/3` },
    { id: 'triplice', nome: 'Tríplice coroa', descricao: 'Liga, copa nacional e copa continental na mesma temporada.', feito: triplice },
    { id: 'acesso-titulo', nome: 'Do acesso ao título', descricao: 'Suba de divisão e depois seja campeão da primeira com o mesmo clube.', feito: acessoTitulo },
    { id: 'copa-mundo', nome: 'Campeão do mundo', descricao: 'Ganhe a Copa do Mundo comandando uma seleção.', feito: copa },
    { id: 'continental', nome: 'Rei do continente', descricao: 'Conquiste uma Libertadores, Champions ou outra copa continental.', feito: continental },
    { id: 'salvacao', nome: 'Missão salvar', descricao: 'Cumpra a meta de evitar o rebaixamento.', feito: salvou },
    { id: 'dez-titulos', nome: 'Colecionador', descricao: 'Chegue a 10 títulos como treinador.', feito: totalTitulos >= 10, progresso: `${Math.min(10, totalTitulos)}/10` },
    { id: 'cem-vitorias', nome: 'Cem vitórias', descricao: 'Vença 100 jogos de liga.', feito: vitorias >= 100, progresso: `${Math.min(100, vitorias)}/100` },
    { id: 'cinco-clubes', nome: 'Rodado', descricao: 'Trabalhe em cinco clubes diferentes.', feito: clubes >= 5, progresso: `${Math.min(5, clubes)}/5` },
  ];
}
/** Guarda o ano em que cada meta foi cumprida pela primeira vez. */
export function registrarMetasTecnico(t, metas, ano) {
  const feitas = { ...(t.metasConcluidas || {}) };
  for (const m of metas) if (m.feito && !feitas[m.id]) feitas[m.id] = ano;
  return feitas;
}
