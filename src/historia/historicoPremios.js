import {expandirConquista,conquistasDoCadastroMundo,conquistasDoJogador,nomePremio} from '../simulacao/historicoConquistas.js';

/** Usa os mesmos nomes do catálogo, inclusive quando o save usa chaves antigas. */
export const chavePremio=s=>nomePremio(String(s||'').trim()).normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim();

/** Vencedores documentados: não fabrica premiações retroativas. */
export function vencedoresPremios(c={}) {
 const universo=c.tecnico?.universo||c.universo||{};
 const mapa=new Map();
 const registrar=(id,nome,registros)=>{
  if(id==null)return;
  for(const r of registros||[]){
   const premio=expandirConquista(r);
   if(!premio||premio.categoria!=='premio')continue;
   const titulo=nomePremio(premio.tipo||premio.nome);
   const chave=[chavePremio(titulo),premio.ano,String(id),premio.clube||''].join('|');
   if(!mapa.has(chave))mapa.set(chave,{...premio,nome:titulo,jogadorId:String(id),jogadorNome:nome||'Jogador'});
  }
 };
 // Alguns registros usam o identificador apenas como chave do dicionário.
 for(const [id,p] of Object.entries(universo.atletas||{}))registrar(p?.id??id,p?.nome,p?.conquistas);
 // Só examina atletas que efetivamente têm premiações, sem percorrer históricos completos de todos.
 for(const p of c.mundo?.jogadores||[])if(p?.premiacoesIndividuais?.length){
  registrar(p.id,p.nome,conquistasDoCadastroMundo(p));
 }
 if(c.nome)registrar('voce',c.nome,conquistasDoJogador(c,'voce'));
 return [...mapa.values()].sort((a,b)=>(b.ano??0)-(a.ano??0)||a.nome.localeCompare(b.nome,'pt-BR'));
}
