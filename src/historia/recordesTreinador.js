import {LIGAS} from '../dados/data.js';

/**
 * Marcos do técnico controlado pelo jogador, calculados somente das
 * campanhas efetivamente encerradas e arquivadas. Não atribuir estatísticas
 * do clube ao treinador anterior ou a outros técnicos da simulação.
 */
export const METRICAS_TREINADOR=Object.freeze([
 {id:'tecnicoJogos',rotulo:'Mais jogos dirigidos por um treinador',categoria:'Treinador'},
 {id:'tecnicoVitorias',rotulo:'Mais vitórias como treinador',categoria:'Treinador'},
 {id:'tecnicoPontos',rotulo:'Mais pontos conquistados como treinador',categoria:'Treinador'},
 {id:'tecnicoAproveitamento',rotulo:'Aproveitamento acumulado como treinador (mín. 20 jogos)',categoria:'Treinador'},
 {id:'tecnicoTemporadas',rotulo:'Mais temporadas comandadas',categoria:'Treinador'},
 {id:'tecnicoVitoriasAno',rotulo:'Mais vitórias em uma temporada como treinador',categoria:'Treinador'},
 {id:'tecnicoPontosAno',rotulo:'Mais pontos em uma temporada como treinador',categoria:'Treinador'},
 {id:'tecnicoTitulos',rotulo:'Mais títulos conquistados como treinador',categoria:'Treinador'},
 {id:'tecnicoTitulosAno',rotulo:'Mais títulos em um ano como treinador',categoria:'Treinador'},
 {id:'tecnicoAcessos',rotulo:'Acessos de divisão como treinador',categoria:'Treinador'},
 {id:'tecnicoRebaixamentos',rotulo:'Rebaixamentos como treinador',categoria:'Treinador'},
 {id:'tecnicoMetas',rotulo:'Metas de temporada cumpridas',categoria:'Treinador'},
 {id:'tecnicoDemissoes',rotulo:'Demissões registradas como treinador',categoria:'Treinador'}
]);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const mesmo=(a,b)=>norm(a)===norm(b);
const nomeLiga=a=>a.ligaNome||a.competicao||LIGAS[a.liga]?.nome||a.liga;
const inteiro=x=>Number.isInteger(x)&&x>=0?x:null;
const equipeDe=a=>typeof a.clube==='string'?a.clube:a.clube?.nome;
const listaTitulos=a=>Array.isArray(a.titulosConquistados)&&a.titulosConquistados.length
 ?a.titulosConquistados:Array.isArray(a.titulosLista)&&a.titulosLista.length
 ?a.titulosLista.map(x=>typeof x==='string'?x:x?.nome).filter(Boolean)
 :a.campeao?[nomeLiga(a)]:[];
const tituloIgual=(a,b)=>mesmo(a,b)||(
 (norm(a)==='championsleague'||norm(a)==='uefachampionsleague')&&norm(b)==='ligadoscampeoes'
);
function recorte(a,tipo,nome){
 if(tipo==='clube')return a.tipoEquipe!=='selecao'&&mesmo(equipeDe(a),nome);
 if(tipo==='selecao')return a.tipoEquipe==='selecao'&&mesmo(equipeDe(a),nome);
 if(tipo==='competicao')return a.tipoEquipe!=='selecao'&&tituloIgual(nomeLiga(a),nome);
 return false;
}
function atualizar(m,id,valor,base){
 if(!Number.isFinite(valor)||valor<=0)return;
 const velho=m.get(id);
 if(!velho||valor>velho.valor||valor===velho.valor&&base.ano<velho.ano)
  m.set(id,{...base,valor});
}
/**
 * Nao usar dados em andamento para anunciar novos recordes antes da
 * consolidacao do ano. Para saves sem Arquivo Vivo, o historico de
 * temporadas encerradas continua consultavel sem alterar nada.
 */
export function recordesTreinador(c={},tipo='clube',nome=''){
 const t=c.tecnico;
 if(!t?.temporadas?.length)return [];
 const arquivo=t.universo||c.universo||{};
 const fechados=Array.isArray(arquivo.anos)?new Set(arquivo.anos):null;
 const linhas=t.temporadas.filter(a=>Number.isFinite(a?.ano)&&
  (!fechados||fechados.has(a.ano))&&recorte(a,tipo,nome));
 if(!linhas.length)return [];
 const mapa=new Map(),treinador=c.nome||t.nome||'Você',primeira=linhas[0];
 const base=a=>({ano:a.ano,atleta:treinador,destaque:equipeDe(a)+' · '+(nomeLiga(a)||'temporada'),origem:'save'});
 let jogos=0,vitorias=0,pontos=0,temporadas=0,titulos=0,acessos=0,rebaixamentos=0,metas=0,demissoes=0,ultimo=primeira;
 for(const a of linhas){
  const j=inteiro(a.jogos),v=inteiro(a.vitorias),e=inteiro(a.empates),d=inteiro(a.derrotas);
  const completos=v!==null&&e!==null&&d!==null&&(j===null||v+e+d===j);
  // O numero de partidas deve ser congruente com vitórias, empates e derrotas.
  if(completos){
   const anoJogos=j??v+e+d;
   jogos+=anoJogos;vitorias+=v;pontos+=v*3+e;
   atualizar(mapa,'tecnicoVitoriasAno',v,base(a));
   atualizar(mapa,'tecnicoPontosAno',v*3+e,base(a));
  }
  const trofeus=[...new Map(listaTitulos(a).filter(Boolean).map(x=>[norm(x),x])).values()];
  const doEscopo=tipo==='competicao'?trofeus.filter(x=>tituloIgual(x,nome)):[...trofeus];
  titulos+=doEscopo.length;
  atualizar(mapa,'tecnicoTitulosAno',doEscopo.length,base(a));
  if(a.tipoEquipe!=='selecao'&&a.acesso)acessos++;
  if(a.tipoEquipe!=='selecao'&&a.rebaixado)rebaixamentos++;
  if(a.cumpriuObjetivo===true)metas++;
  if(a.demitido===true)demissoes++;
  temporadas++;if(a.ano>ultimo.ano)ultimo=a;
 }
 const fim=base(ultimo);
 atualizar(mapa,'tecnicoJogos',jogos,fim);
 atualizar(mapa,'tecnicoVitorias',vitorias,fim);
 atualizar(mapa,'tecnicoPontos',pontos,fim);
 atualizar(mapa,'tecnicoTemporadas',temporadas,fim);
 atualizar(mapa,'tecnicoTitulos',titulos,fim);
 atualizar(mapa,'tecnicoAcessos',acessos,fim);
 atualizar(mapa,'tecnicoRebaixamentos',rebaixamentos,fim);
 atualizar(mapa,'tecnicoMetas',metas,fim);
 atualizar(mapa,'tecnicoDemissoes',demissoes,fim);
 if(jogos>=20)atualizar(mapa,'tecnicoAproveitamento',Math.round((pontos/(jogos*3))*10000)/100,
  {...fim,unidade:'%',destaque:treinador+' · '+jogos+' jogos encerrados'});
 return METRICAS_TREINADOR.filter(x=>mapa.has(x.id)).map(x=>({
  ...x,real:null,simulado:mapa.get(x.id),status:'Recorde do treinador neste save'
 }));
}
