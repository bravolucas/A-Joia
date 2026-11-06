// Narrativa apoiada exclusivamente em decisões e resultados registrados no save.
const variante=(chave,n)=>[...String(chave)].reduce((v,l)=>(v*31+l.charCodeAt(0))>>>0,7)%n;
export function narrarEco(e,card){
 const mesmo=e.clube===card.clube;
 const abertura=`Em ${e.origem}, você escolheu “${e.escolha}” no ${e.clube}.`;
 const porEixo={
  vinculo:mesmo?['Você continua na casa onde fez essa escolha. A identificação ganha mais um capítulo.','O vínculo construído naquela época volta à conversa no clube.']:['O clube mudou, mas aquela decisão continua no seu histórico.','A passagem terminou; a escolha faz parte da história deixada naquela casa.'],
  preparo:card.jogos>=20?['A rotina daquela época volta à lembrança após uma temporada de participação frequente.','Depois de uma temporada com espaço em campo, você relembra a preparação escolhida.']:['Com menos jogos nesta temporada, aquela preparação vira um ponto de reflexão.','A escolha volta à conversa em uma temporada de participação mais limitada.'],
  pressao:mesmo?['Você segue no clube onde tomou uma posição firme. A decisão continua registrada.','Aquela posição faz parte da sua história com o clube atual.']:['Em outro clube, você olha para a decisão que marcou a passagem anterior.','A mudança de camisa abre um capítulo depois daquela posição.'],
  trajetoria:card.titulos?.length?['Agora, uma temporada com conquistas dá outro contexto à lembrança.','Na temporada em que conquistou títulos, uma escolha antiga volta à memória.']:['A carreira seguiu, e aquela escolha reaparece como lembrança do caminho.','Nem toda decisão termina em taça; essa também faz parte da sua trajetória.']
 };
 const op=porEixo[e.eixo]||porEixo.trajetoria;
 return `${abertura} ${op[variante(e.id+':'+card.ano,op.length)]}`;
}
export function descreverMemoriaRival(m){
 if(m.confronto)return `${m.ano} · ${m.clube} · ${m.acertou===true?'você decidiu o lance':m.acertou===false?'sua oportunidade escapou':'confronto registrado'}`;
 const troca=typeof m.transferencia==='string'?m.transferencia:m.transferencia?.para?`${m.transferencia.de?m.transferencia.de+' → ':''}${m.transferencia.para}`:null;
 return `${m.ano} · ${m.clube}${troca?` · mudança: ${troca}`:''}${m.premio?` · ${m.premio}º na Bola de Ouro`:''} · ${m.gols||0} gols / ${m.assist||0} assistências`;
}
export function noticiaRival(c,card,memorias){
 const r=card.rival;if(!r)return null;
 const anterior=[...memorias].reverse().find(m=>!m.confronto&&m.ano<card.ano);
 const nome=c.rival?.nome||'Seu rival';
 if(anterior&&anterior.clube!==r.clube)return{tipo:'rival',titulo:`${nome} muda de cenário`,detalhe:`${anterior.clube} → ${r.clube}. A rivalidade acompanha a trajetória registrada de vocês.`};
 const premio=r.bola>0&&r.bola<=20?r.bola:null;
 if(anterior?.premio&&premio&&premio<anterior.premio)return{tipo:'rival',titulo:`${nome} sobe na disputa`,detalhe:`De ${anterior.premio}º em ${anterior.ano} para ${premio}º na Bola de Ouro em ${card.ano}.`};
 return null;
}
