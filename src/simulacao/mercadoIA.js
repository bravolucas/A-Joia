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
