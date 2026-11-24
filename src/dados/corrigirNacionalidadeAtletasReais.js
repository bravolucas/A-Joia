/**
 * Migração pontual, determinística e idempotente de uma identidade real.
 *
 * Em versões anteriores, Jhon Arias não possuía nacionalidade declarada e
 * podia receber BRA por inferência a partir da liga do Palmeiras.
 * Corrigir somente a identidade que estreou no mundo com clubeOrigem Palmeiras.
 *
 * Preserva IDs, estatísticas, liga, transferências, histórico, ordem dos atletas,
 * as escolhas do jogador e qualquer save com nacionalidade já correta.
 */
const ehJhonAriasPalmeiras = jogador => jogador?.nome==='Jhon Arias'
 && jogador?.clubeOrigem==='Palmeiras' && (jogador.nac==='BRA'||jogador.nac==null);

export function corrigirNacionalidadeHistoricaJhonArias(c){
 if(!Array.isArray(c?.mundo?.jogadores))return c;
 const alterados=new Set();
 const jogadores=c.mundo.jogadores.map(j=>{
  if(!ehJhonAriasPalmeiras(j))return j;
  alterados.add(String(j.id));
  return {...j,nac:'COL'};
 });
 if(!alterados.size)return c;
 const atualizarElenco=lista=>Array.isArray(lista)?lista.map(j=>
   alterados.has(String(j.mundoId??j.id).replace(/^m(?=\d+$)/,''))
    ?{...j,nac:'COL'}:j
 ):lista;
 let out={...c,mundo:{...c.mundo,jogadores}};
 if(Array.isArray(c.elenco))out.elenco=atualizarElenco(c.elenco);
 if(Array.isArray(c.tecnico?.gestao?.elenco))
  out.tecnico={...c.tecnico,gestao:{...c.tecnico.gestao,
   elenco:atualizarElenco(c.tecnico.gestao.elenco)}};
 return out;
}
