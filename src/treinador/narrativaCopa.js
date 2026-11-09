const ROTAS={
 inverter:{path:'M65 125 L140 150 L275 50 L300 110',pontos:[[65,125],[140,150],[275,50],[300,110]],texto:'Inversão para mudar o lado da jogada'},
 entrelinhas:{path:'M65 125 L145 110 L220 85 L275 110',pontos:[[65,125],[145,110],[220,85],[275,110]],texto:'Passes verticais entre os setores'},
 apoio:{path:'M65 125 L130 80 L160 135 L65 125',pontos:[[65,125],[130,80],[160,135]],texto:'Apoios curtos para circular a bola'}
};
export function rotaEstrategiaCopa(id){
 if(['inverter','amplitude','duelo-pontas','cruzamentos'].includes(id))return ROTAS.inverter;
 if(['entrelinhas','profundidade','pressao-alta','transicao-rapida','vertical','inicio-forte','ritmo-alto'].includes(id))return ROTAS.entrelinhas;
 return ROTAS.apoio;
}
/** O placar é o resultado da partida inteira, não o destino de uma cobrança. */
export function resultadoVisualCopa(resultado,usuario){
 const j=resultado?.jogo;if(!j)return null;
 const casa=j.casa===usuario,pro=casa?j.golsCasa:j.golsFora,contra=casa?j.golsFora:j.golsCasa;
 const estado=j.penaltis?(resultado.venceu?'vitoria':'derrota'):pro>contra?'vitoria':pro<contra?'derrota':'empate';
 const titulo={vitoria:'VITÓRIA',empate:'EMPATE',derrota:'DERROTA'}[estado];
 return {estado,titulo,pro,contra,casa:j.casa,fora:j.fora,golsCasa:j.golsCasa,golsFora:j.golsFora,descricao:resultado.penaltisPendentes?'Empate no jogo. A vaga será decidida nos pênaltis.':estado==='vitoria'?'Seu time venceu a partida.':estado==='empate'?'A partida terminou empatada.':'Seu time foi superado nesta partida.'};
}
