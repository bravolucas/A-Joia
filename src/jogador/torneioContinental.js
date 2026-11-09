import {estatisticasDecisao} from './decisaoDeJogo.js';
import {NACIONALIDADES,CONFEDERACAO_POR_NACAO} from '../dados/data.js';
import {registrarJogoElenco} from './elencoSelecao.js';
const hash=s=>[...String(s)].reduce((a,v)=>Math.imul(a^v.charCodeAt(0),16777619)>>>0,2166136261);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const naMarca=mini=>['penalti','defesa'].includes(mini);
/** Materializa a campanha já sorteada, sem novo sorteio global ou vitória adicional. */
export function registrarCampanhaContinental(c,t){
 if(!t?.convocado||!t.elenco||t.partidas)return;
 const seed=`${c.codigo}:${c.ano}:${t.nome}`,conf=CONFEDERACAO_POR_NACAO[c.nac];
 let pool=NACIONALIDADES.filter(n=>n.id!==c.nac&&CONFEDERACAO_POR_NACAO[n.id]===conf);if(!pool.length)pool=NACIONALIDADES.filter(n=>n.id!==c.nac);
 const livres=[...pool],adversario=i=>{if(!livres.length)livres.push(...pool);const n=livres.splice(hash(seed+':adv:'+i)%livres.length,1)[0];return{tipo:'selecao',id:n.id,nome:n.label,label:n.label,forca:n.forcaSelecao};};
 const passou=(t.fase||0)>0||t.final,partidas=[];
 const jogo=(fase,res,i)=>{const base=hash(seed+':placar:'+i),baixo=base%2;return{fase,adv:adversario(i),res,gp:res==='V'?baixo+1+(base>>>5)%2:res==='D'?baixo:baixo,gc:res==='D'?baixo+1+(base>>>8)%2:baixo,gols:0,assist:0};};
 ['V',passou?'V':'D',passou?'E':'D'].forEach((res,i)=>partidas.push(jogo(0,res,i)));
 for(let f=1;f<=Math.min(3,t.fase||0);f++)partidas.push(jogo(f,!t.final&&f===t.fase?'D':'V',partidas.length));
 t.finalAdversario=t.final?adversario(partidas.length):null;
 if(t.final&&t.resultado!=='Final'){
  const j=jogo(4,t.campeao?'V':'D',partidas.length);j.adv=t.finalAdversario;partidas.push(j);
 }
 const ordem=[...partidas].sort((a,b)=>hash(seed+a.adv.id)-hash(seed+b.adv.id));
 let gols=clamp(t.gols||0,0,partidas.reduce((s,j)=>s+j.gp,0)),assist=clamp(t.assist||0,0,partidas.reduce((s,j)=>s+j.gp,0)-gols);
 while(gols>0)for(const j of ordem)if(gols>0&&j.gols<j.gp){j.gols++;gols--;}
 while(assist>0)for(const j of ordem)if(assist>0&&j.assist<j.gp-j.gols){j.assist++;assist--;}
 for(const j of partidas)registrarJogoElenco(t.elenco,j,{titular:t.titular,ano:c.ano});
 t.partidas=partidas;t.jogos=partidas.length;t.gols=partidas.reduce((n,j)=>n+j.gols,0);t.assist=partidas.reduce((n,j)=>n+j.assist,0);
}
export function registrarFinalContinental(t,m,acertou){
 if(!t?.elenco||!t.partidas||t.partidas.some(j=>j.fase===4))return;
 const disputa=naMarca(m.mini),gp=disputa?0:acertou?1:0,gc=disputa?0:acertou?0:1;
 const stats=estatisticasDecisao(m,acertou);const j={fase:4,adv:t.finalAdversario||m.adversario,gp,gc,res:acertou?'V':'D',penaltis:disputa,gols:stats.gols||(acertou&&['falta','cabeceio'].includes(m.mini)?1:0),assist:stats.assist||(acertou&&['passe','cruzamento'].includes(m.mini)?1:0)};
 registrarJogoElenco(t.elenco,j,{titular:t.titular,ano:t.ano});t.partidas.push(j);t.gols+=j.gols;t.assist+=j.assist;t.jogos=t.partidas.length;
}
