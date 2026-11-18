import {geradorTecnico} from '../treinador/momentosTecnico.js';

/** Anota a participação simulada do atleta em cada partida da campanha.
 * Gols e assistências nunca excedem os gols válidos do time. Pênaltis de
 * desempate não contam como gols. O registro persiste no resultado e no histórico.
 */
export function anotarEstatisticasCopaJogador(camp,card){
 const jogo=camp?.resultado?.jogo;
 if(!jogo||camp.resultado.penaltisPendentes||jogo.estatisticasJogador)return camp;
 const rng=geradorTecnico(`${camp.seed}|atleta|${camp.etapa}|${jogo.casa}|${jogo.fora}`);
 const pos=card?.posicaoJogador||'MEI';
 const ovr=Number(card?.ovrDepois??card?.ovr??75);
 const probGol=pos==='GOL'?.001:['ZAG','LAT','VOL'].includes(pos)?.07:pos==='ATA'?.35:.19;
 const probAssist=pos==='GOL'?.001:['ZAG','LAT','VOL'].includes(pos)?.12:.23;
 const bonus=Math.max(.7,Math.min(1.45,ovr/82));
 const partes=jogo.partidas?.length?jogo.partidas:[jogo];
 const stats=partes.map((p,i)=>{
  const golsTime=p.casa===camp.usuario?p.golsCasa:p.golsFora;
  let gols=0,assist=0;
  for(let n=0;n<golsTime;n++){
   if(rng()<probGol*bonus)gols++;
   else if(rng()<probAssist*bonus)assist++;
  }
  return {gols,assist,amarelo:rng()<.13,vermelho:rng()<.012,
   golsAnulados:pos==='GOL'?0:(rng()<.045?1:0),
   ...(pos==='GOL'?{defesas:Math.round(2+rng()*5)}:{})};
 });
 const total={gols:0,assist:0,cartoesAmarelos:0,cartoesVermelhos:0,golsAnulados:0};
 for(let i=0;i<partes.length;i++){
  const s=stats[i];partes[i].estatisticasJogador=s;
  total.gols+=s.gols;total.assist+=s.assist;total.cartoesAmarelos+=Number(s.amarelo);
  total.cartoesVermelhos+=Number(s.vermelho);total.golsAnulados+=s.golsAnulados;
  if(Number.isFinite(s.defesas))total.defesas=(total.defesas||0)+s.defesas;
 }
 jogo.estatisticasJogador=total;
 // registrarMata/avancarLiga fazem cópias rasas: atualizar os registros já
 // criados para que o histórico continue exibindo a mesma atuação.
 const atualizar=arr=>{
  if(!Array.isArray(arr))return;
  for(let i=arr.length-1;i>=0;i--){
   const j=arr[i];
   if(j.casa===jogo.casa&&j.fora===jogo.fora&&j.golsCasa===jogo.golsCasa&&j.golsFora===jogo.golsFora){
    j.estatisticasJogador=structuredClone(total);
    if(partes.length===2)j.partidas=structuredClone(partes);
    break;
   }
  }
 };
 atualizar(camp.jogosUsuario);
 atualizar(camp.jogosLiga);
 for(const fase of camp.fases||[])atualizar(fase.jogos);
 for(const grupo of camp.grupos||[])atualizar(grupo.jogos);
 return camp;
}
