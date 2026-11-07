import {CLUBES,LIGAS} from '../dados/data.js';
const METRICAS=['gols','assist','nota'];
const nomeMetrica={gols:'gols',assist:'assistências',nota:'nota média'};
const valido=r=>r&&Number.isFinite(r.ano)&&Number.isFinite(r.jogos)&&r.jogos>=10&&r.clube;
function inserir(base,chave,r,metrica){
 const valor=r[metrica];if(!Number.isFinite(valor)||valor<0)return false;
 base[chave]=base[chave]||{};const antigo=base[chave][metrica];
 if(antigo&&antigo.valor>=valor)return false;
 base[chave][metrica]={valor,atleta:r.atleta,clube:r.clube,liga:r.liga,ano:r.ano,voce:!!r.voce};return antigo||true;
}
function registrar(b,r){for(const m of METRICAS){inserir(b.clubes,`c:${r.clube}`,r,m);if(r.liga)inserir(b.ligas,`l:${r.liga}`,r,m);inserir(b.mundo,'observado',r,m);}}
/** Somente resultados disponíveis, nunca registros históricos do futebol real. */
export function atualizarRecordesUniverso(c,card,mundoAntes){
 c.jornada=c.jornada||{};let b=c.jornada.recordesUniverso;
 if(b?.ultimoAno===card.ano)return;
 if(!b){b={desde:card.ano,clubes:{},ligas:{},mundo:{}};
  for(const t of c.temporadas||[]){const r={...t,clube:t.clube,liga:t.ligaId,atleta:c.nome,voce:true};if(valido(r)){b.desde=Math.min(b.desde,t.ano);registrar(b,r);}}
 }
 const anteriores=new Map((mundoAntes?.jogadores||[]).map(p=>[p.id,p]));
 for(const p of c.mundo?.jogadores||[]){
  const antes=anteriores.get(p.id);if(!antes||antes.aposentado)continue;
  // O motor pode transferir o atleta após a temporada; os números pertencem ao clube anterior.
  const clube=antes.clubeNome,liga=CLUBES.find(x=>x.nome===clube)?.liga||antes.liga;
  const r={...p,clube,liga,atleta:p.nome,ano:card.ano};if(valido(r))registrar(b,r);
 }
 const eu={...card,clube:card.clube,liga:card.ligaId,atleta:c.nome,voce:true},novos=[];
 if(valido(eu))for(const [escopo,mapa,chave,nome]of [['clube',b.clubes,`c:${card.clube}`,card.clube],['liga',b.ligas,`l:${card.ligaId}`,LIGAS[card.ligaId]?.nome||card.ligaNome],['universo',b.mundo,'observado','universo observado']])for(const metrica of METRICAS){
  const anterior=mapa[chave]?.[metrica],mudou=inserir(mapa,chave,eu,metrica);
  if(mudou&&anterior&&eu[metrica]>anterior.valor)novos.push({escopo,metrica,nome,valor:eu[metrica],anterior:{...anterior},ano:card.ano,titulo:`Nova marca de ${nomeMetrica[metrica]} no ${nome}`,texto:`${eu[metrica]} em ${card.ano}; antes, ${anterior.valor} de ${anterior.atleta} (${anterior.ano}). Comparação entre temporadas disponíveis nesta simulação.`});
 }
 b.ultimoAno=card.ano;c.jornada.recordesUniverso=b;card.recordesUniverso=novos;
}
export function consultarRecordesUniverso(c){
 const b=c.jornada?.recordesUniverso;if(!b)return null;
 const ultimo=c.temporadas?.at(-1),clube=ultimo?.clube||c.emprestimo?.destino||c.clubeNome,liga=ultimo?.ligaId||CLUBES.find(x=>x.nome===clube)?.liga;
 return{desde:b.desde,clube:{nome:clube,marcas:b.clubes[`c:${clube}`]||{}},liga:{nome:LIGAS[liga]?.nome||liga||'Liga',marcas:b.ligas[`l:${liga}`]||{}},universo:{nome:'Universo observado',marcas:b.mundo.observado||{}}};
}
