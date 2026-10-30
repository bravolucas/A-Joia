export const slugCompeticao = (nome) => (nome || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/ı/g, "i")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const ALIASES = Object.freeze({
  'copa-libertadores': 'libertadores',
  'conmebol-libertadores': 'libertadores',
  'uefa-champions-league': 'champions-league',
  'afc-champions-league-elite': 'champions-asiatica',
  'concacaf-champions-cup': 'concacaf-champions',
  'copa-del-rey': 'copa-do-rei',
  'copa-rei': 'copa-do-rei',
  'coupe-de-france': 'copa-da-franca',
  'taca-portugal': 'taca-de-portugal',
  'saudi-pro-league': 'liga-saudita',
  'mls-cup': 'mls',
  'brasileirao-serie-a': 'brasileirao',
  'campeonato-brasileiro-serie-a': 'brasileirao',
  'campeonato-brasileiro-serie-b': 'brasileirao-serie-b'
});

export function resolverImagemCompeticao(nome, arquivos = {}) {
  const chave = slugCompeticao(nome);
  const canonica = ALIASES[chave] || chave;
  const alternativas = Object.keys(ALIASES).filter(k => ALIASES[k] === canonica);
  return arquivos[chave] || arquivos[canonica] || alternativas.map(k => arquivos[k]).find(Boolean) || null;
}
