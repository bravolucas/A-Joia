/**
 * Projeção somente leitura do elenco mundial para o cálculo tático do treinador rápido.
 *
 * Não copia o mundo para c.tecnico nem gera substitutos / jogadores fictícios.
 * Mantém IDs do cadastro unificado; dois registros com mesmo ID nunca podem
 * criar dois titulares. A indisponibilidade será filtrada pelo matcher de setores.
 */
export function elencoTaticoRapidoDoMundo(mundo, clube) {
 if (!clube || !Array.isArray(mundo?.jogadores)) return [];
 const usados = new Set();
 const elenco = [];
 for (const p of mundo.jogadores) {
   if (!p || p.clubeNome !== clube || p.aposentado || p.id == null) continue;
   const id = String(p.id);
   if (usados.has(id)) continue;
   usados.add(id);
   elenco.push({
     id:p.id, posicao:p.posicao, ovr:p.ovr,
     ...(Array.isArray(p.posicoesSecundarias)?{posicoesSecundarias:p.posicoesSecundarias}:{}),
     ...(p.suspenso?{suspenso:p.suspenso}:{}),
     ...(p.indisponivel?{indisponivel:p.indisponivel}:{}),
     ...(p.lesao?{lesao:p.lesao}:{}),
   });
 }
 return elenco;
}
