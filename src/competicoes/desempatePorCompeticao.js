/** Critérios de desempate na fase eliminatória. A decisão é por edição/fase,
 * não depende do mecanismo visual ou do modo de carreira.
 * Não contar gols da prorrogação no critério de gols fora de casa.
 */
const normalizar = nome => String(nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase();
export function regraDesempateCopa({nome='',ano=2026,tamanho=2}={}){
 const n=normalizar(nome),final=Number(tamanho)===2;
 // CONCACAF 2026: agregado, gols fora em tempo regulamentar, prorrogação, pênaltis.
 if(/concacaf.*(champions|campeones|campeoes)/.test(n))
  return {golsFora:!final,prorrogacao:true};
 // Copa do Brasil, incluindo a final única de 2026: pênaltis diretos.
 if(/copa do brasil/.test(n))return {golsFora:false,prorrogacao:false};
 // CONMEBOL Libertadores/Sudamericana: mata-mata de 2 jogos vai direto aos pênaltis;
 // final única usa tempo extra.
 if(/libertadores|sul-americana|sudamericana/.test(n)&&!/recopa/.test(n))
  return {golsFora:false,prorrogacao:final};
 // Recopa CONMEBOL: prorrogação após empate agregado.
 if(/recopa/.test(n))return {golsFora:false,prorrogacao:true};
 // Argentina e França optam por pênaltis diretos nas fases comuns de copa.
 if(/copa argentina/.test(n))return {golsFora:false,prorrogacao:false};
 if(/coupe de france/.test(n))return {golsFora:false,prorrogacao:final};
 return {golsFora:false,prorrogacao:true};
}
/** A é o mandante da ida. No agregado empatado, a equipe com mais gols
 * como visitante em TEMPO REGULAMENTAR classifica-se pela regra da CONCACAF.
 */
export function vencedorPorGolsFora(ida,volta,competicao={}){
 if(!regraDesempateCopa(competicao).golsFora)return null;
 if(!ida||!volta||ida.casa!==volta.fora||ida.fora!==volta.casa)return null;
 const golsA=Number(ida.golsCasa)+Number(volta.golsFora);
 const golsB=Number(ida.golsFora)+Number(volta.golsCasa);
 if(golsA!==golsB)return null;
 if(volta.golsFora>ida.golsFora)return ida.casa;
 if(ida.golsFora>volta.golsFora)return ida.fora;
 return null;
}
