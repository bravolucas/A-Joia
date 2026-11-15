import {LIGAS,NACIONALIDADES} from '../dados/data.js';
import {decisaoCopa} from './copasEscolha.js';
import {jogosDaCampanha} from '../competicoes/jogosCampanha.js';
const numero=v=>Number.isFinite(v)?v:null;
export const anoPainelTecnico=t=>t.copasEmJogo?.ano??t.andamento?.ano??t.temporadaPausada?.ano??t.ano;
export const nomeLigaPainel=t=>t.tipoEquipe==='selecao'?'Seleção nacional':LIGAS[t.liga]?.nome||'Competições do clube';
export function campanhaPainelTecnico(t={}){
 const parcial=t.andamento||t.temporadaPausada;
 const a=parcial?{...parcial,ano:anoPainelTecnico(t),clube:t.clube}:t.temporadas?.at(-1);
 if(!a)return null;
 const confrontos=(a.confrontos||[]).filter(j=>!j.folga),placares=confrontos.filter(j=>Number.isFinite(j.golsPro)&&Number.isFinite(j.golsContra));
 const contadores=[a.vitorias,a.empates,a.derrotas],jogos=numero(a.jogos)??(contadores.every(Number.isFinite)?contadores.reduce((s,v)=>s+v,0):confrontos.length||null);
 const completa=jogos!==null&&placares.length===jogos;
 return {...a,parcial:!!parcial,jogos,golsPro:numero(a.golsPro)??(completa?placares.reduce((s,j)=>s+j.golsPro,0):null),golsContra:numero(a.golsContra)??(completa?placares.reduce((s,j)=>s+j.golsContra,0):null),forma:placares.slice(-5).map(j=>({resultado:j.resultado|| (j.golsPro>j.golsContra?'V':j.golsPro<j.golsContra?'D':'E'),adversario:j.nome,pro:j.golsPro,contra:j.golsContra}))};
}
export function competicoesPainelTecnico(t={}){
 return t.copasEmJogo?.campeonatos||t.temporadas?.at(-1)?.torneios||[];
}
export function jogosPainelTecnico(t={}){
 const a=campanhaPainelTecnico(t),clube=a?.clube||t.clube,liga=LIGAS[a?.liga||t.liga]?.nome||'Liga';
 const jogos=(a?.confrontos||[]).filter(j=>!j.folga&&j.nome&&Number.isFinite(j.golsPro)&&Number.isFinite(j.golsContra)).map((j,i)=>({id:`liga-${i}`,competicao:liga,casa:j.casa?clube:j.nome,fora:j.casa?j.nome:clube,golsCasa:j.casa?j.golsPro:j.golsContra,golsFora:j.casa?j.golsContra:j.golsPro,rodada:j.rodada??i+1,ano:a.ano}));
 for(const cp of competicoesPainelTecnico(t))for(const [i,j] of (cp.grupos?.length||cp.jogosLiga?.length||cp.fases?.length?jogosDaCampanha(cp.finalPendente?{...cp,fases:cp.fases?.slice(0,-1)}:cp):(cp.jogosUsuario||[]).flatMap(j=>j.partidas?.length?j.partidas:[j])).entries())if((j.casa===(cp.usuario||clube)||j.fora===(cp.usuario||clube))&&Number.isFinite(j.golsCasa)&&Number.isFinite(j.golsFora))jogos.push({...j,id:`${cp.nome}-${i}`,competicao:cp.nome,ano:cp.ano??a?.ano??anoPainelTecnico(t)});
 return jogos;
}
export function proximoJogoPainel(t={}){
 const cp=t.copasEmJogo?.campeonatos?.[t.copasEmJogo.indice];
 if(!cp||t.copasEmJogo.pausa)return null;
 const d=decisaoCopa(cp);return d?{clube:cp.usuario,adversario:d.adversario,competicao:cp.nome,fase:d.fase,ano:cp.ano}:null;
}
export function elencoPainelTecnico(c={}){
 const t=c.tecnico||{},mundo=c.mundo?.jogadores||[],porId=new Map(mundo.map(p=>[String(p.id),p]));
 const g=t.gestao,origem=g?.clube===t.clube&&g.elenco?.length?g.elenco.map(p=>({...porId.get(String(p.mundoId)),...p,ovr:p.qualidade??p.ovr})):mundo.filter(p=>!p.aposentado&&(t.tipoEquipe==='selecao'?p.nac===(t.selecao||t.nac||NACIONALIDADES.find(n=>n.label===t.clube)?.id):p.clubeNome===t.clube));
 return origem.map(p=>({...p,posicao:p.posicao||p.setor||'—',ovr:numero(p.ovr??p.qualidade),idade:numero(p.idade)})).sort((a,b)=>(b.ovr??0)-(a.ovr??0)||(a.nome||'').localeCompare(b.nome||'','pt-BR'));
}
export function anosEstatisticasPainel(c={}){
 const u=c.tecnico?.universo||c.universo;
 return [...new Set(u?.anos||[])].sort((a,b)=>b-a);
}
export function atletasEstatisticasPainel(c={},ano){
 const t=c.tecnico||{},u=t.universo||c.universo,nac=t.selecao||t.nac||NACIONALIDADES.find(n=>n.label===t.clube)?.id;
 if(!Number.isFinite(+ano))return [];
 const linhas=[];
 for(const p of Object.values(u?.atletas||{})){
  if(p.voce)continue;
  const r=p.historico?.findLast(a=>(Array.isArray(a)?a[0]:a.ano)===+ano);if(!r)continue;
  const a=Array.isArray(r)?{ano:r[0],clube:r[1],jogos:r[2],gols:r[3],assist:r[4],defesas:r[5]}:r;
  if(t.tipoEquipe==='selecao'?p.nac!==nac:a.clube!==t.clube)continue;
  linhas.push({id:p.id,nome:p.nome,posicao:p.posicao,clube:a.clube,...a});
 }
 return linhas.sort((a,b)=>(b.gols||0)-(a.gols||0)||(b.assist||0)-(a.assist||0)||(a.nome||'').localeCompare(b.nome||'','pt-BR'));
}
