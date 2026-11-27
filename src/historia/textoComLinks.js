/* Links automáticos em texto livre (notícias, recordes, destaques), como no FM:
   todo nome conhecido de clube, jogador, seleção, competição ou prêmio vira um
   destino do Arquivo Vivo. Só liga o que tem página certa: jogador apenas com ID
   único (homônimos ficam em texto), competições apenas as que o Arquivo conhece. */
import {CLUBES,NACIONALIDADES} from '../dados/data.js';
import {competicoesDisponiveis} from './competicoesHistoricas.js';
import {nomeCanonico} from './historiaFutebol.js';

/* Nomes de clube que também são palavras ou lugares comuns em frases. Continuam
   clicáveis onde o dado é estruturado (tabela, ficha), só não são adivinhados no texto. */
export const CLUBES_AMBIGUOS=new Set(['Confiança','Vitória','Nacional','Floresta','Gama','Treze','Altos','Retrô','Remo','Bahia','Ceará','Goiás','Maranhão','Manaus','Sport']);
const PREMIOS=['Bola de Ouro','Bota de Ouro','Troféu Yashin'];
const APELIDOS_COMPETICAO=['Sul-Americana','Paulistão','Carioca','Mineiro','Gaúcho','Champions','Liga dos Campeões','Mundial de Clubes','Europa League','Conference League'];

// O Modo Rápido clona a carreira a cada ação: a chave é a carreira + temporada, não o objeto.
const cache=new Map();
const chaveIndice=c=>{if(!c||typeof c!=='object')return 'vazio';const js=c.mundo?.jogadores||[];
 return [c.codigo||c.id||'',c.nome||'',c.ano??c.tecnico?.ano??'',(c.temporadas||[]).length,js.length,js[0]?.id??'',c.tecnico?.universo?Object.keys(c.tecnico.universo.atletas||{}).length:0].join('|');};
const escapar=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

/** Índice de nomes navegáveis para esta carreira: [{texto,tipo,nome,id}]. */
export function indiceEntidades(c){
 const chave=chaveIndice(c);
 if(cache.has(chave))return cache.get(chave);
 const mapa=new Map();
 const por=(texto,destino)=>{if(texto&&texto.length>=3&&!mapa.has(texto))mapa.set(texto,{texto,...destino});};
 const comps=new Set(competicoesDisponiveis(c||{}));
 for(const nome of comps)por(nome,{tipo:'competicao',nome});
 for(const apelido of APELIDOS_COMPETICAO){const canon=nomeCanonico(apelido);if(comps.has(canon))por(apelido,{tipo:'competicao',nome:canon});}
 for(const nome of PREMIOS)por(nome,{tipo:'premio',nome});
 // jogadores: só nomes compostos e sem homônimo no save (o ID decide a página)
 const idsPorNome=new Map();
 const anotar=(nome,id)=>{const n=String(nome||'').trim();if(!n||id==null)return;if(!idsPorNome.has(n))idsPorNome.set(n,new Set());idsPorNome.get(n).add(String(id));};
 const atletas=[...(c?.mundo?.jogadores||[]),...Object.values(c?.universo?.atletas||{}),...Object.values(c?.tecnico?.universo?.atletas||{})];
 for(const p of atletas)if(p&&!p.voce)anotar(p.nome,p.id);
 if(c?.nome&&!c.tecnico)anotar(c.nome,'voce');
 const clubes=new Set(CLUBES.map(x=>x.nome));
 // o rival de geração é citado o tempo todo: o ID dele vale mesmo com homônimos
 if(c?.rival?.nome&&c.rival.id!=null)por(String(c.rival.nome),{tipo:'jogador',nome:String(c.rival.nome),id:String(c.rival.id)});
 for(const [n,set] of idsPorNome)if(set.size===1&&/\s/.test(n)&&!clubes.has(n))por(n,{tipo:'jogador',nome:n,id:[...set][0]});
 for(const nome of clubes)if(!CLUBES_AMBIGUOS.has(nome))por(nome,{tipo:'clube',nome});
 for(const n of NACIONALIDADES)if(n.label)por(n.label,{tipo:'selecao',nome:n.label});
 const lista=[...mapa.values()].sort((a,b)=>b.texto.length-a.texto.length);
 const regex=lista.length?new RegExp(`(?<![\\p{L}\\p{N}])(?:${lista.map(e=>escapar(e.texto)).join('|')})(?![\\p{L}\\p{N}])`,'gu'):null;
 const indice={regex,porTexto:mapa};
 if(cache.size>=4)cache.delete(cache.keys().next().value);
 cache.set(chave,indice);
 return indice;
}

/** Quebra o texto em pedaços: strings soltas e {texto,tipo,nome,id} para cada nome achado.
    `pessoas` ([{nome,id,tipo?}]) diz exatamente quem é quem quando o dado tem ID:
    resolve homônimos que o índice, sozinho, deixaria sem link. */
export function segmentarTexto(texto,c,{ignorar=[],pessoas=[]}={}){
 const s=texto==null?'':String(texto);
 if(!s)return [];
 const conhecidas=(pessoas||[]).filter(p=>p?.nome&&p.id!=null).sort((a,b)=>String(b.nome).length-String(a.nome).length);
 if(conhecidas.length){
  const re=new RegExp(`(?<![\\p{L}\\p{N}])(?:${conhecidas.map(p=>escapar(String(p.nome))).join('|')})(?![\\p{L}\\p{N}])`,'gu');
  const out=[];let ultimo=0;
  for(let m;(m=re.exec(s));){
   const p=conhecidas.find(x=>String(x.nome)===m[0]);
   out.push(...segmentarTexto(s.slice(ultimo,m.index),c,{ignorar}));
   out.push({texto:m[0],tipo:p.tipo||'jogador',nome:String(p.nome),id:String(p.id)});ultimo=m.index+m[0].length;
  }
  out.push(...segmentarTexto(s.slice(ultimo),c,{ignorar}));
  return out;
 }
 const {regex,porTexto}=indiceEntidades(c);
 if(!regex)return [s];
 const pular=new Set(ignorar.filter(Boolean));
 const out=[];let ultimo=0;regex.lastIndex=0;
 for(let m;(m=regex.exec(s));){
  const e=porTexto.get(m[0]);if(!e||pular.has(m[0]))continue;
  if(m.index>ultimo)out.push(s.slice(ultimo,m.index));
  out.push(e);ultimo=m.index+m[0].length;
 }
 if(ultimo<s.length)out.push(s.slice(ultimo));
 return out;
}
