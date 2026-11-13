import {CLUBES} from '../dados/data.js';
import {geradorTecnico} from './momentosTecnico.js';
const limitar=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
/** Cobrança relativa à liga; a força comprada pelo treinador não rebaixa as metas. */
export function exigenciaClubeTecnico(t={}){
 const clube=CLUBES.find(c=>c.nome===t.clube),liga=t.liga||t.ligasMundo?.[t.clube]||clube?.liga;
 const forca=clube?.forca??t.elenco??50,rivais=CLUBES.filter(c=>(t.ligasMundo?.[c.nome]||c.liga)===liga),rank=rivais.length?1+rivais.filter(c=>c.forca>forca&&c.nome!==t.clube).length:null;
 const segunda=/(?:2|serieB)$/i.test(liga||''),gigante=!segunda&&forca>=90,candidato=!!rank&&rank<=3&&forca>=75,grande=!segunda&&(candidato||forca>=82&&(!rank||rank<=Math.max(4,Math.ceil(rivais.length*.25)))),meta=gigante||rank===1&&grande?1:grande?2:segunda&&!!rank&&rank<=3?2:rank&&rank<=Math.ceil(rivais.length*.3)?6:rank&&rank<=Math.ceil(rivais.length*.65)?10:16;
 return {liga,rank,forca,gigante,grande,meta,perfil:gigante?'gigante':grande?'grande':segunda&&!!rank&&rank<=3?'acesso':meta===6?'continental':meta===10?'estabilidade':'permanencia',descricao:gigante?'Disputar o título. Fora do top 2, risco alto; a Champions pode garantir a permanência.':grande?'Disputar o título e terminar no top 4. Fora dele, risco alto de demissão.':segunda&&!!rank&&rank<=3?'Conquistar o acesso; ficar longe da zona de promoção ameaça o cargo.':meta===6?'Buscar vaga continental e evitar terminar muito abaixo da meta.':meta===10?'Terminar na metade de cima e apresentar evolução.':'Evitar o rebaixamento; campanha segura vale mais que taças.'};
}
export function avaliarDiretoriaTemporada(t,a,{pendente=false}={}){
 const politica=exigenciaClubeTecnico({...t,clube:a.clube,liga:a.liga||t.liga}),base=a.avaliacaoDiretoria?.base||{diretoria:t.diretoria??60,torcida:t.torcida??55,contratoCurto:t.contratoCurto??null,promessaContrato:t.promessaContrato??null};
 if(pendente)return {pendente:true,base,politica,diretoria:base.diretoria,torcida:base.torcida,demitido:false,risco:0,motivo:'A diretoria aguarda o encerramento das copas.'};
 const titulos=a.titulosConquistados||[],champions=titulos.some(n=>/champions league/i.test(n)&&!/afc/i.test(n)),continental=titulos.some(n=>/champions league|libertadores/i.test(n)),liga=a.posicao===1,promessa=base.promessaContrato?.clube===a.clube&&a.posicao>base.promessaContrato.posicaoMaxima;
 const anteriores=(t.temporadas||[]).filter(x=>x.clube===a.clube&&x.ano<a.ano&&!x.interrompida),reincidente=anteriores.at(-1)?.cumpriuObjetivo===false;
 let risco=0,motivo='A campanha atende às expectativas da diretoria.';
 if(a.rebaixado){risco=politica.grande?1:.85;motivo='Rebaixamento e fracasso no projeto esportivo.';}
 else if(politica.gigante&&a.posicao>=3){risco=a.posicao>4?.98:.9;motivo='O clube exige disputar o título; a colocação ficou abaixo do mínimo.';}
 else if(politica.grande&&a.posicao>4){risco=a.posicao>6?.95:.8;motivo='O clube grande terminou fora do top 4.';}
 else if(politica.gigante&&a.posicao===2&&!titulos.length){risco=.3;motivo='Vice-campeonato sem taças: a diretoria cobra uma reação.';}
 else if(a.posicao>politica.meta){const distancia=a.posicao-politica.meta;risco=limitar(.12+distancia*.09+(reincidente?.18:0),0,.85);motivo='A temporada terminou abaixo da meta esportiva.';}
 if(promessa){risco=Math.min(1,risco+.15);motivo+=' A promessa do contrato também foi descumprida.';}
 const salvoPelaChampions=champions&&!a.rebaixado;
 if(salvoPelaChampions){risco=0;motivo='A conquista da Champions League garantiu a permanência.';}
 else if(continental){risco*=.25;motivo+=' O título continental reduziu a pressão.';}
 else if(titulos.length&&!liga){risco*=.85;}
 if(base.contratoCurto?.clube===a.clube&&base.contratoCurto.ano===a.ano&&!a.cumpriuObjetivo&&!salvoPelaChampions){risco=1;motivo='A meta do contrato de uma temporada não foi cumprida.';}
 const cumpriu=!!a.cumpriuObjetivo||salvoPelaChampions,delta=cumpriu?8:-(10+Math.min(30,Math.max(0,a.posicao-politica.meta)*5));
 const diretoria=limitar(base.diretoria+delta-(a.idoloEmCasa&&!cumpriu?4:0)+(liga?10:continental?18:0)-(promessa?8:0)),torcida=limitar(base.torcida-(a.idoloEmCasa&&!cumpriu?9:0)+(liga?18:continental?15:cumpriu?5:-15));
 const crise=diretoria<20||diretoria<40&&torcida<35,demitido=!salvoPelaChampions&&(crise||geradorTecnico(`${a.ano}|${a.clube}|diretoria-v2`)()<risco);
 return {pendente:false,base,politica,diretoria,torcida,demitido,risco,motivo,cumpriuObjetivo:cumpriu,salvoPelaChampions};
}
/** Finaliza uma única vez, depois de todas as competições; mantém o cargo aberto até lá. */
export function reavaliarDiretoriaTecnico(c){
 const t=c?.tecnico,a=t?.temporadas?.at(-1);if(!a||a.tipoEquipe==='selecao'||!a.avaliacaoDiretoria?.pendente||t.copasEmJogo||t.finaisPendentes?.length)return c;
 const avaliacao=avaliarDiretoriaTemporada(t,a),temporadas=[...t.temporadas];temporadas[temporadas.length-1]={...a,avaliacaoDiretoria:avaliacao,...(avaliacao.base.contratoCurto?.clube===a.clube&&avaliacao.base.contratoCurto.ano===a.ano?{contratoCurto:avaliacao.cumpriuObjetivo?'renovado':'encerrado'}:{}),demitido:avaliacao.demitido,cumpriuObjetivo:avaliacao.cumpriuObjetivo};
 return {...c,tecnico:{...t,temporadas,demitido:avaliacao.demitido,diretoria:avaliacao.diretoria,torcida:avaliacao.torcida}};
}
