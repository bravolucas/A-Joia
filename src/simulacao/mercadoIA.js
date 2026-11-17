import { LIGAS } from '../dados/data.js';

/**
 * Clubes que podem receber contratações geradas pela IA.
 *
 * O clube administrado pelo usuário nunca é selecionado automaticamente:
 * compras e vendas desse clube passam exclusivamente pela central de
 * transferências. O filtro não modifica perfis nem elencos.
 */
export function destinosTransferenciaIA(
  jogador, clubes, ocupacao, perfis = {}, {
    clubeControlado = null,
    limiteElenco = 30,
    toleranciaOvr = 6,
    forcaMinima = -Infinity,
    apenasPrimeiraDivisao = false,
  } = {},
) {
  if (!jogador || !Array.isArray(clubes)) return [];
  return clubes.filter(clube => {
    if (!clube?.nome || !Number.isFinite(clube.forca) ||
        clube.nome === jogador.clubeNome || clube.nome === clubeControlado) return false;
    if ((ocupacao?.get(clube.nome) ?? 0) >= limiteElenco) return false;
    if ((perfis?.[clube.nome]?.financas ?? 50) <= 15) return false;
    if (Math.abs(clube.forca - jogador.ovr) > toleranciaOvr) return false;
    if (clube.forca < forcaMinima) return false;
    if (apenasPrimeiraDivisao && LIGAS[clube.liga]?.promocao) return false;
    return true;
  });
}

/**
 * Jogadores de campo perdem mobilidade no mercado depois dos 32 anos.
 * Goleiros mantêm mais oportunidades pelo ciclo esportivo mais longo.
 * Para atletas até 32 anos, conserva exatamente a chance anterior.
 */
export function fatorMobilidadeVeteranoIA(idade, posicao) {
  const anos = Math.max(0, (Number.isFinite(idade) ? idade : 32) - 32);
  return posicao === 'GOL'
    ? Math.max(0.52, 1 - anos * 0.06)
    : Math.max(0.36, 1 - anos * 0.08);
}

/**
 * Ao contratar/renovar, veteranos recebem acordos mais curtos.
 * O campo contrato já faz parte do cadastro; não altera o esquema dos saves.
 */
export function duracaoContratoIA(idade, posicao) {
  const limite = posicao === 'GOL' ? 37 : 35;
  if (Number.isFinite(idade) && idade >= limite + 3) return 1;
  if (Number.isFinite(idade) && idade >= limite) return 2;
  return 3;
}
