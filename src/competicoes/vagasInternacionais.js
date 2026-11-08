/** Base de acesso por edição; bônus UEFA (EPS) podem ser informados, nunca sorteados. */
export const TORNEIOS_INTERNACIONAIS={libertadores:'Libertadores',sulamericana:'Copa Sul-Americana',champions:'Champions League',europa:'Europa League',conference:'Conference League',asia:'Champions Asiática',concacaf:'Concacaf'};
const EUROPEIAS={inglaterra:[4,1,1],espanha:[4,1,1],italia:[4,1,1],alemanha:[4,1,1],franca:[4,1,1],portugal:[2,1,1],holanda:[3,1,1],turquia:[2,1,1]};
export const primeiraLiga=liga=>liga==='serieB'?'brasileirao':String(liga||'').replace(/2$/,'');
const nomeDe=x=>typeof x==='string'?x:x?.nome;
export function vagasInternacionais({liga,tabela=[],ano=2026,campeaoCopa,viceCopa,campeoesContinentais=[],campeaoEuropa,campeaoConference,campeaoCopaLiga,vagasExtrasChampions=0}={}){
 const base=primeiraLiga(liga),nomes=tabela.map(nomeDe).filter(Boolean),vagas={};
 const colocar=(nome,competicao,entrada,motivo)=>{if(nome&&!vagas[nome])vagas[nome]={competicao,entrada,motivo,ano:ano+1};};
 const preencher=(competicao,total,grupos,motivo)=>{let n=Object.values(vagas).filter(x=>x.competicao===competicao).length,diretos=Object.values(vagas).filter(x=>x.competicao===competicao&&x.entrada!=='pre').length;for(const nome of nomes){if(n>=total)break;if(vagas[nome])continue;const entrada=diretos<grupos?'principal':'pre';colocar(nome,competicao,entrada,motivo);n++;if(entrada==='principal')diretos++;}};
 if(['brasileirao','argentina','sulamericano'].includes(base)){
  const brasil=base==='brasileirao',ligaSlots=brasil?(ano>=2026?5:6):5,diretas=brasil?4:3;
  const extras=[...new Set(campeoesContinentais.filter(Boolean))];
  for(const nome of extras)colocar(nome,'libertadores','principal','Campeão continental');
  // Os quatro primeiros do Brasileiro não podem ser rebaixados para uma pré-fase por serem vice da copa.
  for(const nome of nomes.slice(0,diretas))colocar(nome,'libertadores','principal','Posição na liga');
  const copa=campeaoCopa?1:0,vice=brasil&&ano>=2026&&viceCopa?1:0;
  if(campeaoCopa)colocar(campeaoCopa,'libertadores','principal','Campeão da copa nacional');
  if(vice)colocar(viceCopa,'libertadores','pre','Vice da Copa do Brasil · edição 2026+');
  preencher('libertadores',ligaSlots+copa+vice+extras.length,diretas+copa+extras.length,'Posição na liga / redistribuição de vaga');
  let sula=0;for(const nome of nomes)if(!vagas[nome]&&sula<(brasil?6:6)){colocar(nome,'sulamericana','principal','Próximo clube na liga sem vaga na Libertadores');sula++;}
 }else if(['arabia','mls'].includes(base)){
  const comp=base==='arabia'?'asia':'concacaf';for(const n of nomes.slice(0,4))colocar(n,comp,'principal','Posição na liga');if(campeaoCopa)colocar(campeaoCopa,comp,'principal','Campeão da copa nacional');
 }else if(EUROPEIAS[base]){
  const [cl,el,conf]=EUROPEIAS[base],extra=Math.max(0,Math.min(1,Math.floor(vagasExtrasChampions))),diretos=['inglaterra','espanha','italia','alemanha'].includes(base)?cl+extra:base==='franca'?3:base==='holanda'?2:1;
  const extras=[...new Set([...campeoesContinentais,campeaoEuropa].filter(Boolean))];for(const nome of extras)colocar(nome,'champions','principal','Campeão europeu com acesso à Champions');
  for(const nome of nomes.slice(0,cl+extra))colocar(nome,'champions',nomes.indexOf(nome)<diretos?'principal':'pre','Posição na liga');
  preencher('champions',cl+extra+extras.filter(n=>!nomes.slice(0,cl+extra).includes(n)).length,diretos+extras.filter(n=>!nomes.slice(0,cl+extra).includes(n)).length,'Redistribuição de vaga continental');
  if(campeaoCopa)colocar(campeaoCopa,'europa','principal','Campeão da copa nacional');
  preencher('europa',el+(campeaoCopa?1:0),99,'Posição na liga / copa nacional');
  if(campeaoConference&&!vagas[campeaoConference])colocar(campeaoConference,'europa','principal','Campeão da Conference');
  if(campeaoCopaLiga)colocar(campeaoCopaLiga,'conference','pre','Campeão da copa da liga');
  preencher('conference',conf,0,'Posição na liga');
 }
 return vagas;
}
export function dadosVaga(vaga){return vaga?`${TORNEIOS_INTERNACIONAIS[vaga.competicao]||vaga.competicao}${vaga.entrada==='pre'?' · fase preliminar':''}`:null;}
