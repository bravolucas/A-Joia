import {expandirConquista,conquistasDoCadastroMundo,conquistasDoJogador} from '../simulacao/historicoConquistas.js';
/** Vencedores documentados: o arquivo nunca inventa premiações retroativas. */
export function vencedoresPremios(c={}) {
 const universo=c.tecnico?.universo||c.universo||{};
 const mapa=new Map();
 const registrar=(id,nome,registros)=>{
  for(const r of registros||[]){
   const premio=expandirConquista(r);
   if(!premio||premio.categoria!=='premio')continue;
   const chave=[premio.nome,premio.ano,id].join('|').toLocaleLowerCase('pt-BR');
   if(!mapa.has(chave))mapa.set(chave,{...premio,jogadorId:String(id),jogadorNome:nome||'Jogador'});
  }
 };
 for(const p of Object.values(universo.atletas||{})) {
   if(p?.id!=null)registrar(p.id,p.nome,p.conquistas||[]);
 }
 for(const p of c.mundo?.jogadores||[]) {
   if(p?.id!=null)registrar(p.id,p.nome,conquistasDoCadastroMundo(p));
 }
 if(c.nome)registrar('voce',c.nome,conquistasDoJogador(c,'voce'));
 return [...mapa.values()].sort((a,b)=>(b.ano??0)-(a.ano??0)||a.nome.localeCompare(b.nome,'pt-BR'));
}
