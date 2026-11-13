// Uma única avaliação para os três modos. Não consome sorteios nem altera o save.
const limitar = (n, min, max) => Math.max(min, Math.min(max, n));
const numero = (n, padrao = 0) => Number.isFinite(n) ? n : padrao;
const arredondar = n => Math.round(n * 10) / 10 || 0;
export const SETORES_FORCA = { GOL: 1, DEF: 4, MEI: 3, ATA: 3 };
export function setorJogador(j = {}) {
  if (SETORES_FORCA[j.setor]) return j.setor;
  if (j.posicao === 'GOL') return 'GOL';
  if (['ZAG', 'LD', 'LE', 'LAT', 'ALE', 'ALD'].includes(j.posicao)) return 'DEF';
  return ['VOL', 'MC', 'MEI'].includes(j.posicao) ? 'MEI' : 'ATA';
}
export function qualidadeJogador(j = {}) {
  const fase = limitar(numero(j.forma), -3, 3) * .4;
  return limitar(numero(j.qualidade, numero(j.ovr, 50)) + fase, 10, 99);
}
function disponivel(j) { return !j.aposentado && !j.indisponivel && !j.suspenso && !(typeof j.lesao === 'object' && j.lesao?.jogosRestantes > 0); }
/** Sem elenco completo, as vagas desconhecidas mantêm a referência do clube.
 * Um craque acrescenta qualidade ao seu setor; jamais substitui os outros dez. */
export function avaliarForcaEquipe({ base = 60, elenco = [], usuario, participacao = 1, fase = 0, estrutura = 0, mercado = 0, bonus = 0, completo = false } = {}) {
  base = limitar(numero(base, 60), 10, 99);
  const referencia = limitar(base + numero(mercado), 10, 99);
  const jogadores = elenco.filter(disponivel);
  const setores = {}, setoresSemUsuario = {};
  let profundidade = 0, impactoUsuario = 0;
  for (const [setor, vagas] of Object.entries(SETORES_FORCA)) {
    const candidatos = jogadores.filter(j => setorJogador(j) === setor).map(qualidadeJogador).sort((a,b) => b-a);
    const titulares = Array.from({length:vagas}, (_,i) => candidatos[i] ?? (completo ? Math.max(10, referencia - 18) : referencia));
    const reservas = candidatos.slice(vagas, vagas + Math.max(1, Math.ceil(vagas/2)));
    const media = titulares.reduce((a,b)=>a+b,0)/vagas;
    setoresSemUsuario[setor] = media;
    let contribuicao = 0;
    if (usuario && setorJogador(usuario) === setor && disponivel(usuario)) {
      const share = limitar(numero(participacao, 1), 0, 1);
      // A presença do atleta corresponde ao tempo efetivamente utilizado, inclusive quando forçado a jogar abaixo do nível.
      const substituido = titulares.at(-1);
      contribuicao = (qualidadeJogador(usuario) - substituido) * share;
      titulares[titulares.length - 1] += contribuicao;
      impactoUsuario = contribuicao * .22;
    }
    const novo = titulares.reduce((a,b)=>a+b,0)/vagas;
    setores[setor] = arredondar(novo);
    profundidade += (reservas.length ? reservas.reduce((a,b)=>a+b,0)/reservas.length - media : completo ? -12 : 0) * vagas / 11;
  }
  const mediaTitulares = Object.entries(SETORES_FORCA).reduce((s,[setor,vagas])=>s+setoresSemUsuario[setor]*vagas,0)/11;
  const equilibrio = Math.min(...Object.values(setoresSemUsuario)) - mediaTitulares;
  // Reservas e desequilíbrio têm peso menor que os titulares. A fase é limitada e reversível.
  const semUsuario = limitar(mediaTitulares + profundidade * .12 + equilibrio * .12 + limitar(numero(fase),-1.5,1.5) + limitar(numero(estrutura),-3,3) + numero(bonus),10,99);
  const forca = limitar(semUsuario + impactoUsuario,10,99);
  const ataque=limitar(semUsuario+.7*(setores.ATA-mediaTitulares)+.3*(setores.MEI-mediaTitulares),10,99);
  const defesa=limitar(semUsuario+.3*(setores.GOL-mediaTitulares)+.55*(setores.DEF-mediaTitulares)+.15*(setores.MEI-mediaTitulares),10,99);
  return { ataque:arredondar(ataque),defesa:arredondar(defesa),forca: arredondar(forca), semUsuario: arredondar(semUsuario), impactoUsuario: arredondar(forca-semUsuario), setores, profundidade: arredondar(profundidade), fase: arredondar(limitar(numero(fase),-1.5,1.5)), base, mercado: numero(mercado), estrutura: numero(estrutura) };
}
export function avaliarClubeNoMundo(c = {}, clube = {}, opcoes = {}) {
  const perfil = (c.universo || c.tecnico?.universo)?.clubes?.[clube.nome] || {};
  const elenco = opcoes.elenco || (c.mundo?.jogadores || []).filter(j => j.clubeNome === clube.nome && !j.aposentado);
  return avaliarForcaEquipe({ completo:!!c.mundo?.elencosCompletos, base: clube.forca ?? clube.elenco ?? 60, elenco, fase: perfil.fase, mercado: perfil.mercado, estrutura: perfil.estrutura, ...opcoes });
}
