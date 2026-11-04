import {chaveCompeticao} from './arteCompeticoes.js';
import {competicaoDoTitulo} from './tacas.js';
const NOMES_CURTOS={'libertadores':'Libertadores','champions-league':'Champions League','champions-asiatica':'Champions da Ásia','concacaf-champions':'Champions CONCACAF','brasileirao':'Brasileirão','brasileirao-serie-b':'Série B (Brasil)'};
/** Agrupa a apresentação sem alterar os registros originais da carreira. */
export function agruparConquistasTecnico(titulos=[]){
 const grupos=new Map();
 for(const titulo of titulos){
  const nome=String(titulo.nome||'').replace(/^Campe[ãa]o (d[oa]s?|de) /i,'').replace(/\s+\d{4}(\/\d{2,4})?$/,'').trim().replace(/\s+/g,' ');
  if(!nome)continue;
  const tipo=titulo.tipo||competicaoDoTitulo(nome).tipo;
  const id=tipo+'|'+chaveCompeticao(nome);
  if(!grupos.has(id))grupos.set(id,{id,nome,nomeCurto:NOMES_CURTOS[chaveCompeticao(nome)]||nome,tipo,quantidade:0,conquistas:[]});
  const grupo=grupos.get(id);grupo.quantidade++;grupo.conquistas.push({...titulo});
 }
 return [...grupos.values()].map(g=>({...g,conquistas:g.conquistas.sort((a,b)=>(Number(b.ano)||0)-(Number(a.ano)||0)||String(a.clube||'').localeCompare(String(b.clube||''),'pt-BR'))})).sort((a,b)=>b.quantidade-a.quantidade||a.nome.localeCompare(b.nome,'pt-BR'));
}
