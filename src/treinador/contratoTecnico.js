/**
 * Contrato do técnico em euros (€ mil por mês): salário-base pelo porte do clube,
 * bônus por colocação e títulos, reajuste após conquistas e cláusula de saída
 * em caso de rebaixamento. Funções puras.
 */
import {salarioMensalEuro} from '../simulacao/economia.js';
import {competicaoDoTitulo} from '../comum/tacas.js';

export const VERSAO_SALARIO_TECNICO = 2;

/** Técnico de clube: cerca de 80% do salário de um atleta do nível do elenco. */
export const salarioBaseClubeTecnico = ({forca = 60, liga} = {}) =>
  Math.max(2, Math.round(salarioMensalEuro({ovr: forca, liga}) * 0.8));
/** Seleções pagam menos que gigantes europeus: referência de liga italiana, 60%. */
export const salarioBaseSelecaoTecnico = forca =>
  Math.max(2, Math.round(salarioMensalEuro({ovr: forca, liga: 'italia'}) * 0.6));

/** Desconto salarial ao exigir cláusula de saída sem desgaste em caso de rebaixamento. */
export const DESCONTO_CLAUSULA_REBAIXAMENTO = 0.1;
/** Indenização paga ao acionar a cláusula: três salários mensais. */
export const MESES_INDENIZACAO_REBAIXAMENTO = 3;

/**
 * Bônus da temporada, em meses de salário:
 * título nacional 3 · copa nacional/estadual 1 · continental 3 · Mundial 2 ·
 * top 4 da liga 1 · objetivo cumprido 0,5.
 */
export function bonusTemporadaTecnico(salario, temporada = {}) {
  if (!(salario > 0) || temporada.tipoEquipe === 'selecao') return {valor: 0, itens: []};
  const itens = [];
  if (temporada.campeao) itens.push(['Título da liga', 3]);
  for (const nome of temporada.titulosConquistados || []) {
    const tipo = competicaoDoTitulo(nome)?.tipo;
    if (tipo === 'liga' || tipo === 'segunda') continue;
    itens.push([nome, tipo === 'continental' ? 3 : tipo === 'mundial' ? 2 : 1]);
  }
  if (!temporada.campeao && Number.isFinite(temporada.posicao) && temporada.posicao <= 4) itens.push(['Top 4 da liga', 1]);
  if (temporada.cumpriuObjetivo) itens.push(['Objetivo da diretoria', 0.5]);
  const valor = Math.round(itens.reduce((n, [, meses]) => n + meses, 0) * salario);
  return {valor, itens: itens.map(([motivo, meses]) => ({motivo, meses, valor: Math.round(meses * salario)}))};
}

/** Reajuste ao renovar com o mesmo clube depois de títulos (até +25%). */
export function reajusteTituloTecnico(salario, temporada = {}) {
  if (!(salario > 0)) return salario;
  const titulos = (temporada.campeao ? 1 : 0) + (temporada.titulosConquistados || []).filter(n => competicaoDoTitulo(n)?.tipo === 'continental').length;
  return titulos ? Math.round(salario * (1 + Math.min(0.25, titulos * 0.12))) : salario;
}

/**
 * Converte uma única vez saves antigos: salário e carteira passam para a escala
 * em euros, preservando quantos meses de salário o saldo representa.
 */
export function migrarSalarioTecnico(t, salarioNovoBase) {
  if (!t || t.versaoSalario === VERSAO_SALARIO_TECNICO) return t;
  const antigo = Number(t.salario) || 0;
  const fator = antigo > 0 && salarioNovoBase > 0 ? salarioNovoBase / antigo : 1;
  const carteira = t.carteiraTecnico;
  return {...t, versaoSalario: VERSAO_SALARIO_TECNICO,
    ...(antigo > 0 && salarioNovoBase > 0 ? {salario: salarioNovoBase} : {}),
    ...(carteira ? {carteiraTecnico: {...carteira, saldo: Math.round((carteira.saldo || 0) * fator), fatorConversao: fator}} : {})};
}
