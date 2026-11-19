import {expandirConquista,conquistasDoCadastroMundo,conquistasDoJogador,nomePremio} from '../simulacao/historicoConquistas.js';
import {idJogadorPorNome} from './navegacaoEntidades.js';
import {HISTORICO_REAL_PREMIOS} from './premiosHistoricosReais.js';

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
 // O Hall da Fama do Modo Completo arquiva vencedores mesmo após aposentadoria.
 // Mantém o vencedor registrado sem forçar link quando não há identidade inequívoca.
 for(const linha of c.mundo?.historicoBolaDeOuro||[]){
  const vencedor=String(linha?.nome||'').trim();
  if(!vencedor)continue;
  const id=linha.jogadorId??linha.id??idJogadorPorNome(c,vencedor);
  // 'temporada' no Hall da Fama é ordinal (1, 2...), não o ano civil.
  // Nos saves atuais, anoCalendario já aponta para o ano seguinte ao último simulado.
  const anoRegistrado=Number(linha.ano),temporada=Number(linha.temporada);
  const anoAtual=Number(c.mundo?.anoCalendario),temporadaAtual=Number(c.mundo?.temporada);
  const ano=Number.isInteger(anoRegistrado)&&anoRegistrado>=1900?anoRegistrado
   :Number.isInteger(anoAtual)&&anoAtual>=1900&&Number.isInteger(temporada)
     &&Number.isInteger(temporadaAtual)&&temporadaAtual>=temporada
    ?anoAtual-(temporadaAtual-temporada)-1:null;
  const clube=String(linha.clube||'');
  const chave=[chavePremio('Bola de Ouro'),ano,String(id??vencedor),clube].join('|');
  if(!mapa.has(chave))mapa.set(chave,{
   ano,categoria:'premio',nome:'Bola de Ouro',clube,tipo:'bola-de-ouro',
   jogadorId:id==null?null:String(id),jogadorNome:vencedor,
  });
 }
 return [...mapa.values()].sort((a,b)=>(b.ano??0)-(a.ano??0)||a.nome.localeCompare(b.nome,'pt-BR'));
}


/**
 * Palmarés mostrado no Arquivo Vivo: vencedores reais anteriores + vencedores
 * efetivamente registrados pelo jogo. Um prêmio ganho no save ocupa o ano
 * correspondente sem alterar o banco histórico e sem inventar conquistas.
 * Prêmios genéricos de artilharia seguem nas estatísticas das competições,
 * mas não constam mais no catálogo global de distinções individuais.
 */
export function vencedoresPremiosComHistorico(c={}) {
 const simulados=vencedoresPremios(c).filter(x=>chavePremio(x.nome)!=='artilheiro')
  .map(x=>({...x,origem:'simulacao'}));
 const anosDoSave=new Set(simulados.filter(x=>Number.isFinite(x.ano))
  .map(x=>chavePremio(x.nome)+'|'+x.ano));
 const reais=HISTORICO_REAL_PREMIOS.filter(x=>!anosDoSave.has(chavePremio(x.nome)+'|'+x.ano));
 return [...simulados,...reais].sort((a,b)=>(b.ano??0)-(a.ano??0)
  ||a.nome.localeCompare(b.nome,'pt-BR')||a.jogadorNome.localeCompare(b.jogadorNome,'pt-BR'));
}
