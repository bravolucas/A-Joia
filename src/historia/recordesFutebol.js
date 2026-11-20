import {NACIONALIDADES} from '../dados/data.js';
import {REFERENCIAS_RECORDES_FUTEBOL} from '../dados/recordesFutebolReais.js';
import {recordesReaisTitulosCompeticao} from './recordesTitulosReais.js';
import {recordesTreinador} from './recordesTreinador.js';

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
 {id:'goleadaPartida',rotulo:'Maior diferença de gols',categoria:'Partidas'},
 {id:'golsEquipePartida',rotulo:'Mais gols marcados por uma equipe em uma partida',categoria:'Partidas'},
 {id:'golsEquipeEdicao',rotulo:'Mais gols de uma equipe em uma edição (jogos arquivados)',categoria:'Temporada'},
 {id:'vitoriasEquipeEdicao',rotulo:'Mais vitórias de uma equipe em uma edição (jogos arquivados)',categoria:'Temporada'},
 {id:'invencibilidade',rotulo:'Maior sequência invicta registrada na edição',categoria:'Sequências'},
 {id:'vitoriasSeguidas',rotulo:'Mais vitórias consecutivas registradas na edição',categoria:'Sequências'},
 {id:'pontosEdicao',rotulo:'Mais pontos em uma edição de liga',categoria:'Campanhas'},
 {id:'vitoriasTabelaEdicao',rotulo:'Mais vitórias em uma edição de liga',categoria:'Campanhas'},
 {id:'golsTabelaEdicao',rotulo:'Mais gols em uma edição de liga (classificação)',categoria:'Campanhas'},
 {id:'saldoTabelaEdicao',rotulo:'Maior saldo de gols em uma edição de liga',categoria:'Campanhas'},
 {id:'invictoTabelaEdicao',rotulo:'Mais jogos em campanha invicta de liga',categoria:'Campanhas'},
 {id:'titulosTotal',rotulo:'Maior número de títulos conquistados',categoria:'Títulos'},
 {id:'titulosAno',rotulo:'Mais títulos em uma temporada',categoria:'Títulos'},
 {id:'titulosConsecutivos',rotulo:'Mais títulos consecutivos na mesma competição',categoria:'Títulos'},
 {id:'vicesTotal',rotulo:'Mais vice-campeonatos no universo',categoria:'Títulos'}
]);
const numeros=['jogos','gols','assist','defesas','cleanSheets'];
const n=x=>Number.isFinite(x)&&x>=0?x:0;
const canon=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const eIgual=(a,b)=>canon(a)===canon(b);
const ligaAlias={ligadoscampeoes:'championsleague',uefachampionsleague:'championsleague',
 copadomundofifa:'copadomundo',fifaworldcup:'copadomundo',premierleagueinglesa:'premierleague'};
const competicaoIgual=(a,b)=>((x,y)=>(ligaAlias[x]||x)===(ligaAlias[y]||y))(canon(a),canon(b));
const chaveCompeticao=x=>ligaAlias[canon(x)]||canon(x);
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
 return partidas.map(p=>({casa:nomes[p[0]],fora:nomes[p[1]],golsCasa:p[2],golsFora:p[3],rodada:p[4]}));
}
/** Apenas placares existentes. Em seleções, ignora ligas de clubes. */
function medirPartidas(mapa,arquivo,tipo,nome){
 for(const edicao of arquivo.edicoes||[]){
  if(tipo==='competicao'&&!competicaoIgual(edicao.nome,nome))continue;
  if(tipo==='selecao'&&edicao.tipo==='liga')continue;
  const partidas=partidasDaEdicao(edicao);
  const series=new Map();
  for(const j of partidas){
   if(!j?.casa||!j?.fora||!Number.isFinite(j.golsCasa)||!Number.isFinite(j.golsFora))continue;
   const envolvidos=tipo==='competicao'||eIgual(j.casa,nome)||eIgual(j.fora,nome);
   if(!envolvidos)continue;
   const descricao=j.casa+' '+j.golsCasa+' × '+j.golsFora+' '+j.fora;
   const comum={ano:edicao.ano,competicao:edicao.nome,destaque:descricao,origem:'save'};
   if(tipo==='competicao'){
    atualizar(mapa,'golsPartida',{...comum,valor:j.golsCasa+j.golsFora});
    atualizar(mapa,'goleadaPartida',{...comum,valor:Math.abs(j.golsCasa-j.golsFora)});
   }
   const participantes=tipo==='competicao'?[j.casa,j.fora]:[eIgual(j.casa,nome)?j.casa:j.fora];
   for(const equipe of participantes){
    const proprio=eIgual(j.casa,equipe)?j.golsCasa:j.golsFora;
    const contra=eIgual(j.casa,equipe)?j.golsFora:j.golsCasa;
    const p=series.get(equipe)||{gols:0,vitorias:0,partidas:[]};
    p.gols+=proprio;
    if(proprio>contra)p.vitorias++;
    p.partidas.push({rodada:j.rodada,proprio,contra,destaque:descricao});
    series.set(equipe,p);
    atualizar(mapa,'golsEquipePartida',{...comum,atleta:equipe,valor:proprio});
    if(tipo!=='competicao'){
     if(proprio>contra)atualizar(mapa,'maiorVitoria',{...comum,valor:proprio-contra});
     if(contra>proprio)atualizar(mapa,'maiorDerrota',{...comum,valor:contra-proprio});
    }
   }
  }
  for(const [equipe,p]of series){
   if(tipo==='competicao'){
    atualizar(mapa,'golsEquipeEdicao',{valor:p.gols,atleta:equipe,ano:edicao.ano,
     competicao:edicao.nome,origem:'save',destaque:'Gols nos confrontos arquivados'});
    atualizar(mapa,'vitoriasEquipeEdicao',{valor:p.vitorias,atleta:equipe,ano:edicao.ano,
     competicao:edicao.nome,origem:'save',destaque:'Vitórias nos confrontos arquivados'});
   }
   // Sequencias exigem rodadas inteiras, sem ambiguidade e consecutivas.
   // Resultados sem ordinal confiavel nao entram e uma lacuna reinicia a serie.
   const validas=p.partidas.filter(j=>Number.isInteger(j.rodada)&&j.rodada>0)
    .sort((a,b)=>a.rodada-b.rodada);
   let anterior=null,invicto=0,vitorias=0;
   for(let i=0;i<validas.length;i++){
    const jogo=validas[i];
    if(jogo.rodada===anterior)continue;
    if(anterior!==null&&jogo.rodada!==anterior+1){invicto=0;vitorias=0;}
    anterior=jogo.rodada;
    if(jogo.proprio>jogo.contra){invicto++;vitorias++;}
    else if(jogo.proprio===jogo.contra){invicto++;vitorias=0;}
    else {invicto=0;vitorias=0;}
    const comum={ano:edicao.ano,atleta:equipe,competicao:edicao.nome,
     destaque:equipe+' · rodada '+jogo.rodada,origem:'save'};
    atualizar(mapa,'invencibilidade',{...comum,valor:invicto});
    atualizar(mapa,'vitoriasSeguidas',{...comum,valor:vitorias});
   }
  }
 }
}

/** Tabelas oficiais do universo e edicoes com campeao/vice registrado.
 * Os dados de ligas utilizam apenas a classificacao salva; jogos parciais
 * nao sao convertidos em totais supostamente oficiais. */
function medirCampanhasETitulos(mapa,arquivo,tipo,nome){
 const titulos=new Map(),vices=new Map(),porAno=new Map(),edicoesPorCompeticao=new Map();
 const vistos=new Set(),vicesVistos=new Set();
 for(const edicao of arquivo.edicoes||[]){
  if(!edicao||!Number.isFinite(edicao.ano)||!edicao.nome)continue;
  if(tipo==='competicao'&&!competicaoIgual(edicao.nome,nome))continue;
  if(tipo==='selecao'&&edicao.tipo==='liga')continue;
  const comum={ano:edicao.ano,competicao:edicao.nome,origem:'save'};
  if(edicao.tipo==='liga'&&Array.isArray(edicao.classificacao)&&tipo!=='selecao'){
   for(const linha of edicao.classificacao){
    if(!linha?.nome||(tipo==='clube'&&!eIgual(linha.nome,nome)))continue;
    const equipe={...comum,atleta:linha.nome,equipe:linha.nome};
    for(const [campo,id]of [['pontos','pontosEdicao'],['vitorias','vitoriasTabelaEdicao'],
     ['golsPro','golsTabelaEdicao'],['saldoGols','saldoTabelaEdicao']]){
     if(Number.isFinite(linha[campo])&&linha[campo]>0)
      atualizar(mapa,id,{...equipe,valor:linha[campo],destaque:'Classificacao de '+edicao.nome});
    }
    // Regra rigorosa: nao concluir invencibilidade sem jogos e derrotas
    // registrados na classificacao oficial desta edicao.
    if(Number.isFinite(linha.jogos)&&linha.jogos>0&&linha.derrotas===0)
     atualizar(mapa,'invictoTabelaEdicao',{...equipe,valor:linha.jogos,
      destaque:'Campanha sem derrotas · '+edicao.nome});
   }
  }
  // Apenas uma edicao por temporada e competicao.
  const chaveEdicao=edicao.ano+'|'+chaveCompeticao(edicao.nome);
  if(edicao.campeao&&!vistos.has(chaveEdicao)){
   vistos.add(chaveEdicao);
   const campeao=edicao.campeao;
   const relevante=tipo==='competicao'||eIgual(campeao,nome);
   if(relevante){
    const key=canon(campeao);
    const atual=titulos.get(key)||{valor:0,ano:null,atleta:campeao};
    titulos.set(key,{...atual,valor:atual.valor+1,ano:edicao.ano});
    const anoChave=key+'|'+edicao.ano;
    const anual=porAno.get(anoChave)||{valor:0,ano:edicao.ano,atleta:campeao};
    porAno.set(anoChave,{...anual,valor:anual.valor+1});
   }
   if(!edicoesPorCompeticao.has(chaveCompeticao(edicao.nome)))
    edicoesPorCompeticao.set(chaveCompeticao(edicao.nome),{nome:edicao.nome,edicoes:[]});
   edicoesPorCompeticao.get(chaveCompeticao(edicao.nome)).edicoes.push({ano:edicao.ano,campeao});
  }
  if(edicao.vice&&!vicesVistos.has(chaveEdicao)){
   vicesVistos.add(chaveEdicao);
   const vice=edicao.vice;
   if(tipo==='competicao'||eIgual(vice,nome)){
    const key=canon(vice),atual=vices.get(key)||{valor:0,atleta:vice};
    vices.set(key,{...atual,valor:atual.valor+1,ano:edicao.ano});
   }
  }
 }
 for(const reg of titulos.values())
  atualizar(mapa,'titulosTotal',{...reg,equipe:reg.atleta,origem:'save'});
 // O numero de titulos em um ano so faz sentido para uma equipe, nao para
 // uma competicao que por definicao produz apenas um campeao por edicao.
 if(tipo!=='competicao')for(const reg of porAno.values())
  atualizar(mapa,'titulosAno',{...reg,equipe:reg.atleta,origem:'save'});
 for(const reg of vices.values())
  atualizar(mapa,'vicesTotal',{...reg,equipe:reg.atleta,origem:'save'});
 for(const {nome:competicao,edicoes}of edicoesPorCompeticao.values()){
  edicoes.sort((a,b)=>a.ano-b.ano);
  let anterior=null,anoAnterior=null,serie=0;
  for(const edicao of edicoes){
   const intervalo=/^(copadomundo|copaamerica|eurocopa|mundialdeclubes)$/.test(canon(competicao))?4:1;
   if(anterior&&eIgual(anterior,edicao.campeao)&&edicao.ano===anoAnterior+intervalo)serie++;
   else serie=1;
   anterior=edicao.campeao;anoAnterior=edicao.ano;
   if(serie<2)continue;
   if(tipo!=='competicao'&&!eIgual(edicao.campeao,nome))continue;
   atualizar(mapa,'titulosConsecutivos',{valor:serie,ano:edicao.ano,
    atleta:edicao.campeao,equipe:edicao.campeao,competicao,origem:'save',
    destaque:'Edicoes consecutivas da mesma competicao'});
  }
 }
}

/**
 * Indice descartavel dos atletas nos escopos consultados no fechamento do ano.
 * Reduz varias leituras completas do Arquivo Vivo a uma passagem por snapshot.
 * Nunca fica em cache global nem e serializado, evitando vazamento entre saves.
 */
export function prepararIndiceAtletasRecordes(c={},escopos=[]){
 const grupos=new Map(),procuradosClube=new Map(),procuradosCompeticao=new Map();
 const chave=(tipo,nome)=>tipo+'|'+(tipo==='competicao'?chaveCompeticao(nome):canon(nome));
 for(const escopo of escopos){
  if(!escopo?.nome||!['clube','competicao'].includes(escopo.tipo))continue;
  const id=chave(escopo.tipo,escopo.nome);
  if(grupos.has(id))continue;
  const mapa=new Map();
  grupos.set(id,mapa);
  (escopo.tipo==='clube'?procuradosClube:procuradosCompeticao).set(
   escopo.tipo==='clube'?canon(escopo.nome):chaveCompeticao(escopo.nome),mapa);
 }
 let temUsuario=false;
 if(!grupos.size)return {grupos,temUsuario};
 for(const p of Object.values(arquivoDe(c).atletas||{})){
  if(!p?.historico?.length)continue;
  if(String(p.id)==='voce')temUsuario=true;
  const adicionar=(mapa,linha)=>{
   if(!mapa.has(p))mapa.set(p,[]);
   mapa.get(p).push(linha);
  };
  for(const raw of p.historico){
   const linha=linhaAtleta(raw);
   const clube=procuradosClube.get(canon(linha.clube));
   if(clube)adicionar(clube,linha);
   for(const registro of linha.porCompeticao||[]){
    const competicao=procuradosCompeticao.get(chaveCompeticao(registro.nome));
    if(competicao)adicionar(competicao,{...registro,ano:linha.ano,clube:linha.clube});
   }
  }
 }
 return {grupos,temUsuario};
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
export function consultarRecordesFutebol(c={},tipo='clube',nome='',temporadas=c?.temporadas||[],indiceAtletas=null){
 if(!['clube','selecao','competicao','treinador'].includes(tipo))return {tipo,nome,recordes:[],desde:null};
 if(tipo==='treinador')return {tipo,nome,recordes:recordesTreinador(c,tipo,nome),
  desde:c.tecnico?.temporadas?.[0]?.ano??null,cobertura:'Somente resultados documentados deste treinador no save.'};
 const arquivo=arquivoDe(c),mapa=new Map();
 if(tipo==='clube'||tipo==='competicao'){
  const grupo=indiceAtletas?.grupos?.get(tipo+'|'+
   (tipo==='competicao'?chaveCompeticao(nome):canon(nome)));
  let temUsuario=indiceAtletas?.temUsuario||false;
  if(grupo){
   for(const [p,linhas] of grupo)
    medirAtleta(mapa,{id:p.id,nome:p.nome||'Jogador'},linhas);
  }else{
   for(const p of Object.values(arquivo.atletas||{})){
    if(!p?.historico?.length)continue;
    if(String(p.id)==='voce')temUsuario=true;
    const linhas=selecionarPorEscopo(p.historico.map(linhaAtleta),tipo,nome);
    medirAtleta(mapa,{id:p.id,nome:p.nome||'Jogador'},linhas);
   }
  }
  // Saves anteriores ao Arquivo Vivo e carreira ainda não arquivada.
  // Modo Treinador guarda campanhas com jogos e vitórias, NÃO jogos do
  // atleta. Nunca computar temporadas do técnico como partidas do jogador.
  const temporadasAtleta=c.tecnico?(c.temporadas||[]):temporadas;
  if(!temUsuario&&temporadasAtleta?.length){
   medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},
    selecionarPorEscopo(temporadasAtleta,tipo,nome));
  }
  if(tipo==='competicao'&&competicaoIgual(nome,'Copa do Mundo'))
   medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},
    participacoesDaSelecao(c,'',nome,temporadas));
 }else{
  medirAtleta(mapa,{id:'voce',nome:c.nome||'Você'},participacoesDaSelecao(c,nome,null,temporadas));
 }
 medirPartidas(mapa,arquivo,tipo,nome);
 medirCampanhasETitulos(mapa,arquivo,tipo,nome);
 medirAtuacoes(mapa,arquivo,tipo,nome,c?.nome||'Você');
 const referencias=REFERENCIAS_RECORDES_FUTEBOL.filter(r=>
  r.tipo===tipo&&(tipo==='competicao'?competicaoIgual(r.nome,nome):eIgual(r.nome,nome)));
 const historicas=new Map([...referencias,...recordesReaisTitulosCompeticao(tipo,nome)].map(r=>[r.id,r]));
 const recordes=METRICAS_RECORDES.filter(m=>mapa.has(m.id)||historicas.has(m.id)).map(m=>{
  const real=historicas.get(m.id)||null,simulado=mapa.get(m.id)||null;
  const comparavel=real?.cobertura!=='recorte';
  const ultrapassou=!!real&&comparavel&&!!simulado&&simulado.valor>real.valor;
  const igualou=!!real&&comparavel&&!!simulado&&simulado.valor===real.valor;
  return {id:m.id,rotulo:m.rotulo,categoria:m.categoria,real,simulado,
   status:real?.cobertura==='recorte'?'Referência de período documentado':ultrapassou?'Superado no save':igualou?'Igualado no save':real?'Recorde real preservado':'Recorde do save'};
 });
 return {tipo,nome,recordes:[...recordes,...recordesTreinador(c,tipo,nome)],desde:arquivo.desde??temporadas?.[0]?.ano??null,
  cobertura:'Referências reais auditadas e partidas/temporadas armazenadas neste save. Lacunas não são preenchidas por estimativas.'};
}
