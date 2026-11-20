import {torneiosDoHistorico} from '../competicoes/sorteio.js';
import {primeiraLiga} from '../competicoes/vagasInternacionais.js';
import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {anoTemporadaCarreira,COMPS_PAIS} from '../dados/data.js';
import {idContinental,calcularVagasRapidas,clubesParaCopas,COPAS_NACIONAIS} from '../competicoes/regrasCopasRapidas.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
import {clubesDoMundo} from '../simulacao/mundoVivo.js';
import {criarCampanhaCopa,decisaoCopa,registrarPlacarCopa,continuarCopa,resumoCampanhaCopa,chancePenaltis} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
export function prepararCopaPersistente(c,card,tipo,forcaUsuario){
 if(!card.copasPersistentesVersao)return null;
 card.campanhasCompletas ||= {};
 if(!card.campanhasCompletas[tipo]){
  const clubes=clubesDoMundo(c,clubesParaCopas(c.ligas)),eu=clubes.find(x=>x.nome===c.clube.nome),regional=tipo==='estadual'?participantesEstadual(c.clube):null;
  const continental=tipo==='continental',comp=idContinental(card.continentalPendente?.nome);
  const vagas=continental&&c.vagasInternacionaisAno===anoTemporadaCarreira(c)?c.vagasInternacionaisClubes:continental?calcularVagasRapidas({ano:(anoTemporadaCarreira(c)-1),ligasMundo:c.ligas,seed:c.codigo||c.nome}):null;
  const pool=continental?ampliarParticipantesInternacionais(clubes.filter(x=>vagas[x.nome]?.competicao===comp),comp,anoTemporadaCarreira(c),clubes):regional?regional.clubes.map(x=>clubes.find(p=>p.nome===x.nome)||x):clubes.filter(x=>x.pais===eu?.pais);
  const ligaContinental=continental&&card.continentalPendente?.formato!=='grupo';
  const limite=continental?(ligaContinental?36:32):tipo==='copinha'?32:tipo==='estadual'?8:16;
  const participantes=[eu||c.clube,...pool.filter(x=>x.nome!==c.clube.nome).sort((a,b)=>b.forca-a.forca).slice(0,limite-1)];
  const nome=(continental?card.continentalPendente.nome:null)||regional?.nome||(tipo==='copinha'?'Copa São Paulo de Futebol Júnior':COPAS_NACIONAIS[primeiraLiga(c.clube.liga)]||COMPS_PAIS[c.clube.liga]?.copa||'Copa Nacional');
  const camp=criarCampanhaCopa({historico:torneiosDoHistorico(c.temporadas),nome,tipo:tipo==='copaNacional'?'copa':tipo,usuario:c.clube.nome,forcaUsuario,clubes:participantes,ano:anoTemporadaCarreira(c),entrada:continental?card.continentalPendente?.entrada||'principal':'principal',formato:continental?(ligaContinental?'liga':'grupos'):tipo==='estadual'?'estadual':tipo==='copinha'?'grupos':'mata',seed:`${c.codigo||c.nome}|${c.idade}|completo|${tipo}`,interativoEstadual:true});
  if(tipo==='estadual'||continental)camp.manual=camp.calendario.flatMap((js,i)=>js.some(j=>j.casa===c.clube.nome||j.fora===c.clube.nome)?[i]:[]);
  camp.idaVolta=tipo==='copaNacional'||continental;
  card.campanhasCompletas[tipo]=camp;
 }
 const atual=card.campanhasCompletas[tipo];
 atual.forcaUsuario=forcaUsuario;atual.forcas[atual.usuario]=forcaUsuario;
 return decisaoCopa(atual);
}
export function registrarJogoPersistente(card,tipo,{casa,fora,golsCasa,golsFora}){
 const camp=card.campanhasCompletas[tipo],d=decisaoCopa(camp);
 if(!d)return null;
 if(![golsCasa,golsFora].every(n=>Number.isInteger(n)&&n>=0)||![casa,fora].includes(camp.usuario)||![casa,fora].includes(d.adversario)||casa===fora)throw new Error('Partida incompatível com a chave.');
 const jogo={casa,fora,golsCasa,golsFora};
 card.pernasCopas ||= {};
 if(!d.grupo&&!d.final&&camp.idaVolta){
  if(!card.pernasCopas[tipo]){card.pernasCopas[tipo]=jogo;return {ida:true,decisao:d};}
  const ida=card.pernasCopas[tipo];
  if(casa!==ida.fora||fora!==ida.casa)throw new Error('Adversário da volta difere da ida.');
  jogo.casa=ida.casa;jogo.fora=ida.fora;jogo.golsCasa=ida.golsCasa+golsFora;jogo.golsFora=ida.golsFora+golsCasa;jogo.partidas=[ida,{casa,fora,golsCasa,golsFora}];
 }
 const empate=jogo.golsCasa===jogo.golsFora;
 if(!d.grupo&&empate){const rng=geradorTecnico(`${d.chave}|${jogo.golsCasa}|penaltis-completo`);jogo.vencedor=rng()<chancePenaltis(camp.forcaUsuario,camp.forcas[d.adversario])?camp.usuario:d.adversario;jogo.penaltis=true;}
 const proxima=continuarCopa(registrarPlacarCopa(camp,d.chave,jogo));
 delete card.pernasCopas[tipo];card.campanhasCompletas[tipo]=proxima;
 const resumo=resumoCampanhaCopa(proxima);
 card.torneios=[...(card.torneios||[]).filter(t=>t.nome!==resumo.nome),resumo];
 return {campanha:proxima,decisao:decisaoCopa(proxima),resumo};
}
