import {conquistasDoCadastroMundo,expandirConquista,nomePremio,resumoConquistas} from '../simulacao/historicoConquistas.js';

export const canonico=s=>nomePremio(String(s||'').trim());
export const chave=s=>canonico(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim();
export function premiacoesDoSave(c={}){
 const universo=c.tecnico?.universo||c.universo||{};
 const resultados=new Map();
 const incluir=(id,nome,registros)=>{
  for(const reg of registros||[]){
   const item=expandirConquista(reg);
   if(!item||item.categoria!=='premio')continue;
   const k=[String(id),item.ano,chave(item.nome),item.clube].join('|');
   if(!resultados.has(k))resultados.set(k,{...item,nome:canonico(item.nome),jogadorId:String(id),jogador:nome||'Jogador'});
  }
 };
 for(const [id,p] of Object.entries(universo.atletas||{}))incluir(id,p.nome,p.conquistas);
 // Os atletas do mundo podem guardar troféus em um formato compacto diferente.
 for(const p of c.mundo?.jogadores||[]){
  if(!p.premiacoesIndividuais?.length)continue;
  incluir(p.id,p.nome,conquistasDoCadastroMundo(p));
 }
 if(c.temporadas?.length||c.lista?.length)incluir('voce',c.nome,resumoConquistas(c,'voce').premios);
 return [...resultados.values()].sort((a,b)=>(b.ano??0)-(a.ano??0)||a.jogador.localeCompare(b.jogador,'pt-BR'));
}
