/** Presentation only: the season and awards have already been recorded. */
export function celebracoesTemporada(card = {}) {
 const vistos=new Set();
 const eventos=(card.titulos||[]).filter(t=>!['bolaOuro','botaOuro'].includes(t.tipo)&&!(card.ligaCelebrada&&['liga','segunda'].includes(t.tipo))&&!card.torneios?.some(cp=>cp.nome===t.nome&&cp.campeao===card.clube&&cp.celebrado)).filter(t=>{const k=t.tipo+'|'+t.nome;if(vistos.has(k))return false;vistos.add(k);return true;}).map(t=>({id:`titulo:${t.tipo}:${t.nome}`,tipo:'titulo',titulo:t.nome,taca:t.tipo}));
 if(card.acesso)eventos.push({id:'acesso',tipo:'acesso',titulo:'ACESSO!',destino:card.acesso.para});
 if(card.rebaixado)eventos.push({id:'rebaixamento',tipo:'rebaixamento',titulo:'REBAIXADO',destino:card.rebaixado.para});
 if(Number.isInteger(card.bola?.pos)&&card.bola.pos>=1&&card.bola.pos<=3)eventos.push({id:'bolaOuro',tipo:'bolaOuro',titulo:'Bola de Ouro',posicao:card.bola.pos,taca:'bolaOuro'});
 return eventos;
}
