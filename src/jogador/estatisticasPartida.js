/** Estatísticas individuais verificáveis de uma única partida.
 * Nunca inferir cartão, defesa ou gol anulado a partir do placar.
 */
export function eventosIndividuaisPartida(jogo={}){
 if(jogo.suspenso||jogo.descansou||jogo.naoEscalado)return [{id:'ausente',rotulo:jogo.suspenso?'Suspenso':jogo.descansou?'Poupado':'Não entrou em campo',valor:null}];
 const gols=Number(jogo.golsMinha??jogo.gols??0)||0;
 const assist=Number(jogo.assistMinha??jogo.assist??0)||0;
 const varJogador=(jogo.eventos||[]).filter(e=>e.tipo==='var'&&e.meu===true).length;
 const anulados=Number(jogo.golsAnulados??jogo.golAnulado??varJogador)||0;
 const amarelos=Number(jogo.cartoesAmarelos??(jogo.amarelo?1:0))||0;
 const vermelhos=Number(jogo.cartoesVermelhos??(jogo.vermelho?1:0))||0;
 const defesas=Number(jogo.defesas??0)||0;
 const itens=[
  {id:'gol',rotulo:gols===1?'Gol':'Gols',valor:gols,icone:'⚽'},
  {id:'assist',rotulo:assist===1?'Assistência':'Assistências',valor:assist,icone:'🎯'},
  {id:'amarelo',rotulo:amarelos===1?'Cartão amarelo':'Cartões amarelos',valor:amarelos,icone:'🟨'},
  {id:'vermelho',rotulo:vermelhos===1?'Cartão vermelho':'Cartões vermelhos',valor:vermelhos,icone:'🟥'},
  {id:'anulado',rotulo:anulados===1?'Gol anulado':'Gols anulados',valor:anulados,icone:'📺'},
  {id:'defesas',rotulo:defesas===1?'Defesa':'Defesas',valor:defesas,icone:'🧤'}
 ];
 return itens.filter(x=>x.valor>0);
}
