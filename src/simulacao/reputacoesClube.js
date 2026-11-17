/**
 * Oito dimensões de reputação para o universo persistente.
 *
 * Estes índices são indicadores informativos, não substituem o campo numérico
 * `reputacao` usado no cálculo da força ou o saldo simplificado `financas`.
 * Essa separação protege saves antigos e impede efeitos de mercado sem testes.
 *
 * Os únicos bônus por conquista dependem dos eventos tipados e registrados
 * no histórico; nomes de torneios não são interpretados como títulos.
 */
export const EIXOS_REPUTACAO_CLUBE = Object.freeze([
  'nacional', 'continental', 'mundial', 'historica',
  'financeira', 'formadora', 'institucional', 'atratividade',
]);
export const NOMES_REPUTACAO_CLUBE = Object.freeze({
  nacional: 'Nacional',
  continental: 'Continental',
  mundial: 'Mundial',
  historica: 'Histórica',
  financeira: 'Financeira',
  formadora: 'Formadora',
  institucional: 'Institucional',
  atratividade: 'Atratividade',
});
const limitar = (n, a = 0, b = 99) => Math.max(a, Math.min(b, n));
const numero = (n, padrao) => Number.isFinite(n) ? n : padrao;
const decimal = n => Math.round(n * 10) / 10;

export function reputacoesIniciaisClube(perfil = {}) {
  const base = limitar(numero(perfil.reputacao, 55));
  const financas = limitar(numero(perfil.financas, 50));
  const estrutura = limitar(numero(perfil.estrutura, 0), -3, 3);
  const iniciais = {
    nacional: base,
    continental: base * .7,
    mundial: base * .55,
    historica: base,
    financeira: financas,
    formadora: 48 + estrutura * 4,
    institucional: base * .7 + financas * .3,
    atratividade: base * .6 + financas * .4,
  };
  const salvas = perfil.reputacoes && typeof perfil.reputacoes === 'object' &&
    !Array.isArray(perfil.reputacoes) ? perfil.reputacoes : {};
  return Object.fromEntries(EIXOS_REPUTACAO_CLUBE.map(eixo =>
    [eixo, decimal(limitar(numero(salvas[eixo], iniciais[eixo])))]));
}

/** Uma evolução por temporada; repetir a chamada não modifica o perfil. */
export function evoluirReputacoesClube(perfil = {}, {
  campanha = null, titulos = [], movimento = null, financas = null,
  estrutura = null, atletasFormados = 0,
} = {}) {
  const antes = reputacoesIniciaisClube(perfil);
  const base = limitar(numero(perfil.reputacao, 55));
  const fin = limitar(numero(financas, numero(perfil.financas, 50)));
  const est = limitar(numero(estrutura, numero(perfil.estrutura, 0)), -3, 3);
  const formados = limitar(numero(atletasFormados, 0), 0, 8);
  const possuiClassificacao = Number.isFinite(campanha?.posicao) &&
    Number.isFinite(campanha?.total) && campanha.total > 1 &&
    campanha.posicao >= 1 && campanha.posicao <= campanha.total;
  const desempenho = possuiClassificacao
    ? 1 - 2 * (campanha.posicao - 1) / (campanha.total - 1)
    : 0;
  const confirmados = Array.isArray(titulos)
    ? titulos.filter(t => t && typeof t === 'object' && typeof t.nome === 'string')
    : [];
  const categorias = tipo => confirmados.filter(t => t.tipo === tipo).length;
  const nacionais = categorias('liga') + categorias('copa');
  const continentais = categorias('continental');
  const mundiais = categorias('mundial') + categorias('copaMundo');
  const total = confirmados.length;
  const acesso = movimento === 'acesso' ? 1 : 0;
  const queda = movimento === 'rebaixamento' ? 1 : 0;
  const nacional = limitar(antes.nacional * .9 + (base + desempenho * 14) * .1 +
    nacionais * 1.8 + continentais * .7 + acesso * .8 - queda * 1.3);
  const continental = limitar(antes.continental * .95 + nacional * .05 +
    continentais * 4 + mundiais * 2);
  const mundial = limitar(antes.mundial * .975 + continental * .025 + mundiais * 7);
  const historica = limitar(antes.historica * .995 + base * .005 +
    total * .7 + continentais * 1.4 + mundiais * 3);
  const financeira = limitar(antes.financeira * .7 + fin * .3);
  const formadora = limitar(antes.formadora * .92 +
    (45 + est * 5 + formados * 2) * .08);
  const institucional = limitar(antes.institucional * .93 +
    (base * .6 + fin * .4) * .07 + acesso * 1.5 - queda * 2 + nacionais * .7);
  const atratividade = limitar(antes.atratividade * .88 +
    (nacional * .55 + continental * .15 + financeira * .3) * .12);
  const depois = {
    nacional, continental, mundial, historica, financeira,
    formadora, institucional, atratividade,
  };
  return Object.fromEntries(EIXOS_REPUTACAO_CLUBE.map(eixo => [eixo, decimal(depois[eixo])]));
}
