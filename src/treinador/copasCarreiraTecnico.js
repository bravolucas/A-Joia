import {criarAgenda,selecionarAgenda,chaveAgenda,avancarPausa} from '../competicoes/calendarioCopas.js';
import {eCampeaoPrincipal,criarMundialAnual,criarMundial32} from '../competicoes/mundialRapido.js';
import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {criarCampanhaCopa,escolherCopa,continuarCopa,decisaoCopa,simularCampanhaCopa,resumoCampanhaCopa} from './copasEscolha.js';
import {clubesParaCopas,vagaTecnico,nomeVaga,regiaoDaLiga,COPAS_NACIONAIS,calcularVagasRapidas} from '../competicoes/regrasCopasRapidas.js';
import {primeiraLiga} from '../competicoes/vagasInternacionais.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
export function prepararCopasTecnico(t,forca){
 const clubes=clubesParaCopas(t.ligasMundo),clube=clubes.find(c=>c.nome===t.clube);if(!clube||t.tipoEquipe==='selecao')return null;
 const campeonatos=[],regional=participantesEstadual(clube),criar=o=>criarCampanhaCopa({usuario:t.clube,forcaUsuario:forca,ano:t.ano,...o});
 if(regional)campeonatos.push(criar({nome:regional.nome,tipo:'estadual',clubes:regional.clubes,formato:'estadual',estado:regional.estado,interativoEstadual:true}));
 const copa=COPAS_NACIONAIS[primeiraLiga(t.liga||clube.liga)];if(copa){const pool=clubes.filter(c=>c.pais===clube.pais);campeonatos.push(criar({nome:copa,tipo:'copa',clubes:pool,formato:'mata',entrada:copa==='Copa do Brasil'?(clube.forca>=80?'principal':clube.forca>=65?'pre':'preliminar'):'principal'}));}
 const vaga=vagaTecnico(t);if(vaga){const regiao=regiaoDaLiga(clube.liga),anterior=t.temporadas?.at(-1),vagas=anterior?.vagasInternacionaisProxima||(t.vagasInicioAno===t.ano?t.vagasInicio:null)||calcularVagasRapidas({ano:t.ano-1,classificacoesMundo:anterior?.classificacoesMundo,torneios:anterior?.torneios,ligasMundo:t.ligasMundo}),pool=clubes.filter(c=>c.nome===t.clube||vagas[c.nome]?.competicao===vaga.competicao);pool.splice(0,pool.length,...ampliarParticipantesInternacionais(pool,vaga.competicao,t.ano,clubes));campeonatos.push(criar({nome:nomeVaga(vaga.competicao),tipo:'continental',clubes:pool,formato:regiao==='europa'?'liga':'grupos',entrada:vaga.entrada}));}
 const mundial=criarMundial32({usuario:t.clube,forcaUsuario:forca,ano:t.ano,historico:(t.temporadas||[]),seed:`tecnico|${t.clube}`});if(mundial)campeonatos.push(mundial);
 for(const cp of campeonatos)cp.regiao=regiaoDaLiga(clube.liga);
 return criarAgenda(campeonatos,{ano:t.ano,clube:t.clube,liga:{nome:t.liga==='brasileirao'?'Brasileirão':t.liga==='serieB'?'Brasileirão Série B':'Campeonato nacional',europa:regiaoDaLiga(clube.liga)==='europa',brasil:clube.pais==='Brasil'}});
}
export function chaveCopaTecnico(t){if(t.copasEmJogo?.pausa)return chaveAgenda(t.copasEmJogo);const c=t.copasEmJogo?.campeonatos[t.copasEmJogo.indice];return c?(decisaoCopa(c)?.chave||`${c.seed}|resultado|${c.etapa}`):null;}
export function aplicarCopaTecnico(c,chave,opcao){
 const t=c?.tecnico,p=t?.copasEmJogo;if(!p||chaveCopaTecnico(t)!==chave)return c;
 if(p.pausa){if(opcao!=='continuar')return c;const proximo=avancarPausa(p),temporadas=t.temporadas.map(a=>a.ano===p.ano&&a.clube===p.clube?{...a,...(p.pausa.id==='fim'?{ligaCelebrada:true}:{}),...(!proximo?{vagasInternacionaisProxima:calcularVagasRapidas({ano:p.ano,classificacoesMundo:a.classificacoesMundo,torneios:a.torneios,ligasMundo:t.ligasMundo})}:{})}:a);return {...c,tecnico:{...t,temporadas,copasEmJogo:proximo}};}
 const cp=p.campeonatos[p.indice];let nova=opcao==='continuar'?continuarCopa(cp):escolherCopa(cp,chave,opcao);if(nova===cp)return c;
 const copas=structuredClone(p);copas.campeonatos[p.indice]=nova;
 let tecnico={...t,copasEmJogo:copas};
 if(nova.fase==='fim'&&!nova.resultado){
  const temporadas=[...t.temporadas],idx=temporadas.findIndex(a=>a.ano===p.ano&&a.clube===p.clube),temporada={...temporadas[idx]};
  temporada.torneios=(temporada.torneios||[]).filter(x=>x.nome!==nova.nome).concat({...resumoCampanhaCopa(nova),celebrado:nova.campeao===p.clube});
  const ganhou=nova.campeao===p.clube,ja=(temporada.titulosConquistados||[]).includes(nova.nome);
  if(ganhou&&!ja){temporada.titulosConquistados=[...(temporada.titulosConquistados||[]),nova.nome];tecnico={...tecnico,titulos:(t.titulos||0)+1,reputacao:Math.min(99,t.reputacao+(nova.tipo==='estadual'?1:nova.tipo==='continental'?8:4)),diretoria:Math.min(100,(t.diretoria||0)+4),torcida:Math.min(100,(t.torcida||0)+5)};}
  if(temporada.tipoEquipe==='selecao'){
   const jogos=temporada.torneios.flatMap(x=>x.jogosUsuario||[]),v=jogos.filter(j=>j.vencedor===temporada.clube).length,e=jogos.filter(j=>!j.vencedor).length,d=jogos.length-v-e;
   tecnico={...tecnico,vitorias:(tecnico.vitorias||0)+v-(temporada.vitorias||0),empates:(tecnico.empates||0)+e-(temporada.empates||0),derrotas:(tecnico.derrotas||0)+d-(temporada.derrotas||0)};
   temporada.jogos=jogos.length;temporada.vitorias=v;temporada.empates=e;temporada.derrotas=d;temporada.pontos=v*3+e;
   if(ganhou||nova.tipo==='copaMundo'&&nova.posicaoInicial<=2)temporada.cumpriuObjetivo=true;
  }
  temporadas[idx]=temporada;tecnico.temporadas=temporadas;
  if(nova.repescagemSulamericana){const base=clubesParaCopas(t.ligasMundo),clubes=ampliarParticipantesInternacionais(base.filter(x=>regiaoDaLiga(x.liga)==='sul'),'sulamericana',t.ano,base);copas.campeonatos.push(criarCampanhaCopa({nome:'Copa Sul-Americana',tipo:'continental',usuario:p.clube,forcaUsuario:nova.forcaUsuario,clubes,ano:p.ano,formato:'mata',entrada:'pre',seed:`${nova.seed}|repescagem` }));}
  if(temporada.tipoEquipe!=='selecao'&&eCampeaoPrincipal(nova)&&!copas.campeonatos.some(x=>x.tipo==='mundial'&&x.nome==='Copa Intercontinental FIFA'))copas.campeonatos.push(criarMundialAnual(nova));
  if(copas.calendarioVersao){copas.concluidas.push(p.indice);tecnico.copasEmJogo=selecionarAgenda(copas);}else copas.indice++;
  if(!tecnico.copasEmJogo||(!copas.calendarioVersao&&copas.indice>=copas.campeonatos.length)){tecnico.copasEmJogo=null;temporada.vagasInternacionaisProxima=calcularVagasRapidas({ano:p.ano,classificacoesMundo:temporada.classificacoesMundo,torneios:temporada.torneios,ligasMundo:t.ligasMundo});}
 }else if(opcao==='continuar'&&copas.calendarioVersao)tecnico.copasEmJogo=selecionarAgenda(copas);
 if(!tecnico.copasEmJogo&&tecnico.temporadas.at(-1)?.avaliacaoSelecaoPendente){
  const temporadas=[...tecnico.temporadas],a={...temporadas.at(-1),avaliacaoSelecaoPendente:false},base=a.baseAvaliacaoSelecao;
  const diretoria=Math.max(0,Math.min(100,base.diretoria+(a.cumpriuObjetivo?5:-10))),torcida=Math.max(0,Math.min(100,base.torcida+(a.cumpriuObjetivo?5:-6)));
  temporadas[temporadas.length-1]=a;tecnico={...tecnico,temporadas,diretoria,torcida,demitido:diretoria<20,reputacao:Math.max(10,Math.min(99,tecnico.reputacao+(a.cumpriuObjetivo?3:-3)))};
 }
 return {...c,tecnico};
}
export function estadualAutomaticoTecnico(t,forca){const clube=clubesParaCopas(t.ligasMundo).find(c=>c.nome===t.clube),regional=participantesEstadual(clube);return regional?resumoCampanhaCopa(simularCampanhaCopa({nome:regional.nome,tipo:'estadual',usuario:t.clube,forcaUsuario:forca,ano:t.ano,clubes:regional.clubes,formato:'estadual',estado:regional.estado,interativoEstadual:true})):null;}
