import {NACIONALIDADES} from '../dados/data.js';
import {REFERENCIAS_RECORDES_FUTEBOL} from '../dados/recordesFutebolReais.js';

/** Recordes calculados dos fatos arquivados, sem novos sorteios nem alterar o save. */
export const METRICAS_RECORDES = Object.freeze([
 {id:'jogosCarreira',rotulo:'Mais partidas na carreira',categoria:'Carreira',campo:'jogos'},
 {id:'golsCarreira',rotulo:'Mais gols na carreira',categoria:'Carreira',campo:'gols'},
 {id:'assistCarreira',rotulo:'Mais assistências na carreira',categoria:'Carreira',campo:'assist'},
 {id:'defesasCarreira',rotulo:'Mais defesas na carreira',categoria:'Carreira',campo:'defesas'},
 {id:'semSofrerCarreira',rotulo:'Mais jogos sem sofrer gols',categoria:'Carreira',campo:'cleanSheets'},
 {id:'jogosTemporada',rotulo:'Mais partidas em uma temporada',categoria:'Temporada',campo:'jogos'},
 {id:'golsTemporada',rotulo:'Mais gols em uma temporada',categoria:'Temporada',campo:'gols'},
 {id:'assistTemporada',rotulo:'Mais assistências em uma temporada',categoria:'Temporada',campo:'assist'},
 {id:'defesasTemporada',rotulo:'Mais defesas em uma temporada',categoria:'Temporada',campo:'defesas'},
 {id:'semSofrerTemporada',rotulo:'Mais jogos sem sofrer gols em uma temporada',categoria:'Temporada',campo:'cleanSheets'},
 {id:'maiorVitoria',rotulo:'Maior vitória',categoria:'Partidas'},
 {id:'maiorDerrota',rotulo:'Maior derrota',categoria:'Partidas'},
 {id:'golsPartida',rotulo:'Mais gols em uma partida',categoria:'Partidas'},
 {id:'golsAtletaPartida',rotulo:'Mais gols de um jogador em uma partida',categoria:'Partidas'},
 {id:'assistAtletaPartida',rotulo:'Mais assistências de um jogador em uma partida',categoria:'Partidas'},
 {id:'defesasAtletaPartida',rotulo:'Mais defesas de um jogador em uma partida',categoria:'Partidas'},
 {id:'goleadaPartida',rotulo:'Maior diferença de gols',categoria:'Partidas'}
]);
const numeros=['jogos','gols','assist','defesas','cleanSheets'];
const n=x=>Number.isFinite(x)&&x>=0?x:0;
const canon=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const eIgual=(a,b)=>canon(a)===canon(b);
const ligaAlias={ligadoscampeoes:'championsleague',uefachampionsleague:'championsleague',
 copadomundofifa:'copadomundo',fifaworldcup:'copadomundo',premierleagueinglesa:'premierleague'};
const competicaoIgual=(a,b)=>((x,y)=>(ligaAlias[x]||x)===(ligaAlias[y]||y))(canon(a),canon(b));
const paisId=nac=>{
 const encontrado=NACIONALIDADES.find(p=>p.id===nac||eIgual(p.label,nac));
 return encontrado?.label||nac||'';
};
function linhaAtleta(linha){
 if(!Array.isArray(linha))return linha||{};
 return {ano:linha[0],clube:linha[1],jogos:linha[2],gols:linha[3],assist:linha[4],
  defesas:linha[5],cleanSheets:linha[6],
  porCompeticao:(linha[10]||[]).map(t=>Array.isArray(t)
   ?{nome:t[0],jogos:t[1],gols:t[2],assist:t[3],defesas:t[4],cleanSheets:t[5]}
   :t)};
}
const arquivoDe=c=>c?.tecnico?.universo||c?.universo||{};
function atualizar(mapa,id,candidato){
 if(!candidato||!Number.isFinite(candidato.valor)||candidato.valor<=0)return;
 const anterior=mapa.get(id);
 if(!anterior||candidato.valor>anterior.valor||candidato.valor===anterior.valor&&
     Number(candidato.ano||99999)<Number(anterior.ano||99999))mapa.set(id,candidato);
}
function medirAtleta(mapa,atleta,linhas){
 if(!linhas.length)return;
 const totais=Object.fromEntries(numeros.map(campo=>[campo,0]));
 let ultima=null;
 for(const linha of linhas){
  if(Number.isFinite(linha.ano)&&(ultima===null||linha.ano>ultima))ultima=linha.ano;
  for(const campo of numeros){
   if(!Number.isFinite(linha[campo])||linha[campo]<0)continue;
   totais[campo]+=linha[campo];
   const id=campo==='cleanSheets'?'semSofrerTemporada':campo+'Temporada';
   atualizar(mapa,id,{valor:linha[campo],atleta:atleta.nome,atletaId:atleta.id,ano:linha.ano,clube:linha.clube,origem:'save'});
  }
 }
 for(const campo of numeros){
  const id=campo==='cleanSheets'?'semSofrerCarreira':campo+'Carreira';
  atualizar(mapa,id,{valor:totais[campo],atleta:atleta.nome,atletaId:atleta.id,ano:ultima,origem:'save'});
 }
}
function selecionarPorEscopo(linhas,tipo,nome){
 if(tipo==='clube')return linhas.filter(t=>eIgual(t.clube,nome));
 if(tipo!=='competicao')return [];
 return linhas.flatMap(t=>(t.porCompeticao||[]).map(r=>({...r,ano:t.ano,clube:t.clube})))
  .filter(r=>competicaoIgual(r.nome,nome));
}
function participacoesDaSelecao(c,nome,competicao,temporadas=c?.temporadas||[]){
 const meuPais=paisId(c?.nac||c?.nacionalidade);
 if(!eIgual(meuPais,nome)&&!competicao)return [];
 const linhas=[];
 // No Modo Completo, selecaoTemporada resume varias competicoes do ano.
 // O historico detalhado e a fonte autoritativa para separar Copa/continental.
 const eventosDetalhados=(c?.selecao?.historico||[]).filter(r=>
  (r.comp==='copa'||r.comp==='continental')&&Number.isFinite(r.ano));
 if(eventosDetalhados.length&&(temporadas||[]).some(t=>t.selecaoTemporada)){
  const anos=new Set((temporadas||[]).map(t=>t.ano));
  return eventosDetalhados.filter(r=>anos.has(r.ano)&&(!competicao||
    competicaoIgual(r.nomeComp|| (r.comp==='copa'?'Copa do Mundo':''),competicao)))
   .map(r=>({ano:r.ano,clube:meuPais,jogos:r.jogos,gols:r.gols,assist:r.assist,
     defesas:r.defesas,cleanSheets:r.cleanSheets}));
 }
 for(const t of temporadas||[]){
  // O modo completo arquiva o evento como selecaoTemporada; o rapido usa selecao.
  for(const r of [t.selecao,t.amistososSelecao,t.selecaoTemporada]){
   if(!r?.convocado&&!Number.isFinite(r?.jogos))continue;
   const nomeTorneio=r.tipo==='copaMundo'||r.comp==='copaMundo'?'Copa do Mundo':
     r.tipo==='continentalSelecao'?r.nome||'Continental de seleções':
     r.nomeComp||r.nome||r.competicao||'Amistosos';
   if(competicao&&!competicaoIgual(nomeTorneio,competicao))continue;
   if(!competicao&&!eIgual(meuPais,nome))continue;
   linhas.push({ano:t.ano,clube:meuPais,jogos:r.jogos,gols:r.gols,assist:r.assist,
    defesas:r.defesas,cleanSheets:r.cleanSheets});
  }
  // Compatibilidade: saves antigos guardavam gols de Copa em t.copa.
  if(competicao&&competicaoIgual(competicao,'Copa do Mundo')&&!t.selecao?.convocado&&!t.selecaoTemporada&&t.copa?.convocado){
   linhas.push({ano:t.ano,clube:meuPais,jogos:t.copa.jogos,gols:t.copa.gols,
    assist:t.copa.assist,defesas:t.copa.defesas,cleanSheets:t.copa.cleanSheets});
  }
 }
 return linhas;
}
function partidasDaEdicao(e){
 if(Array.isArray(e.jogos))return e.jogos;
 const {nomes=[],partidas=[]}=e.jogos||{};
 return partidas.map(p=>({casa:nomes[p[0]],fora:nomes[p[1]],golsCasa:p[2],golsFora:p[3]}));
}
/** Apenas placares existentes. Em seleções, ignora ligas de clubes. */
function medirPartidas(mapa,arquivo,tipo,nome){
 for(const edicao of arquivo.edicoes||[]){
  if(tipo==='competicao'&&!competicaoIgual(edicao.nome,nome))continue;
  if(tipo==='selecao'&&edicao.tipo==='liga')continue;
  if(tipo!=='competicao'&&!Array.isArray(edicao.jogos)&&
      !edicao.jogos?.nomes?.some(x=>eIgual(x,nome)))continue;
  for(const j of partidasDaEdicao(edicao)){
   if(!Number.isFinite(j.golsCasa)||!Number.isFinite(j.golsFora))continue;
   const envolvidos=tipo==='competicao'||eIgual(j.casa,nome)||eIgual(j.fora,nome);
   if(!envolvidos)continue;
   const descricao=j.casa+' '+j.golsCasa+' × '+j.golsFora+' '+j.fora;
   const comum={ano:edicao.ano,competicao:edicao.nome,destaque:descricao,origem:'save'};
   if(tipo==='competicao'){
    atualizar(mapa,'golsPartida',{...comum,valor:j.golsCasa+j.golsFora});
    atualizar(mapa,'goleadaPartida',{...comum,valor:Math.abs(j.golsCasa-j.golsFora)});
   }else{
    const meus=eIgual(j.casa,nome)?j.golsCasa:j.golsFora;
    const outro=eIgual(j.casa,nome)?j.golsFora:j.golsCasa;
    if(meus>outro)atualizar(mapa,'maiorVitoria',{...comum,valor:meus-outro});
    if(outro>meus)atualizar(mapa,'maiorDerrota',{...comum,valor:outro-meus});
   }
  }
 }
}
/** Atuações individuais arquivadas por partida: sem preencher estatisticas ausentes. */
function medirAtuacoes(mapa,arquivo,tipo,nome,atletaNome){
 if(tipo==='selecao')return;
 for(const partida of arquivo.partidasAtletas?.voce||[]){
  if(!partida?.participou)continue;
  if(tipo==='clube'&&!eIgual(partida.clube,nome))continue;
  if(tipo==='competicao'&&!competicaoIgual(partida.competicao,nome))continue;
  for(const [campo,id]of [['gols','golsAtletaPartida'],['assistencias','assistAtletaPartida'],['defesas','defesasAtletaPartida']]){
   const valor=partida[campo];
   if(!Number.isFinite(valor)||valor<=0)continue;
   atualizar(mapa,id,{valor,ano:partida.ano,atleta:atletaNome||'Você',atletaId:'voce',
    clube:partida.clube,competicao:partida.competicao,
    destaque:partida.clube+' × '+partida.adversario+' · '+partida.competicao,origem:'save'});
  }
 }
}
/** Formato estável: não grava nada, portanto reabrir, importar ou voltar não duplica marcas. */
export function consultarRecordesFutebol(c={},tipo='clube',nome='',temporadas=c?.temporadas||[]){
 if(!['clube','selecao','competicao'].includes(tipo))return {tipo,nome,recordes:[],desde:null};
 const arquivo=arquivoDe(c),mapa=new Map();
 if(tipo==='clube'||tipo==='competicao'){
  const atletas=Object.values(arquivo.atletas||{});
  let temUsuario=false;
  for(const p of atletas){
   if(!p?.historico?.length)continue;
   if(String(p.id)==='voce')temUsuario=true;
   const linhas=selecionarPorEscopo(p.historico.map(linhaAtleta),tipo,nome);
   medirAtleta(mapa,{id:p.id,nome:p.nome||'Jogador'},linhas);
  }
  // Saves anteriores ao Arquivo Vivo e carreira ainda não arquivada.
  if(!temUsuario&&temporadas?.length){
   medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},
    selecionarPorEscopo(temporadas,tipo,nome));
  }
  if(tipo==='competicao'&&competicaoIgual(nome,'Copa do Mundo'))
   medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},
    participacoesDaSelecao(c,'',nome,temporadas));
 }else{
  medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},participacoesDaSelecao(c,nome,null,temporadas));
 }
 medirPartidas(mapa,arquivo,tipo,nome);
 medirAtuacoes(mapa,arquivo,tipo,nome,c?.nome||'Você');
 const referencias=REFERENCIAS_RECORDES_FUTEBOL.filter(r=>
  r.tipo===tipo&&(tipo==='competicao'?competicaoIgual(r.nome,nome):eIgual(r.nome,nome)));
 const historicas=new Map(referencias.map(r=>[r.id,r]));
 const recordes=METRICAS_RECORDES.filter(m=>mapa.has(m.id)||historicas.has(m.id)).map(m=>{
  const real=historicas.get(m.id)||null,simulado=mapa.get(m.id)||null;
  const ultrapassou=!!real&&!!simulado&&simulado.valor>real.valor;
  const igualou=!!real&&!!simulado&&simulado.valor===real.valor;
  return {id:m.id,rotulo:m.rotulo,categoria:m.categoria,real,simulado,
   status:ultrapassou?'Superado no save':igualou?'Igualado no save':real?'Recorde real preservado':'Recorde do save'};
 });
 return {tipo,nome,recordes,desde:arquivo.desde??temporadas?.[0]?.ano??null,
  cobertura:'Referências reais auditadas e partidas/temporadas armazenadas neste save. Lacunas não são preenchidas por estimativas.'};
}
