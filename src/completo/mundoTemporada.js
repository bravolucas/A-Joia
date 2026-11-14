import {COPAS_NACIONAIS,calcularVagasRapidas,nomeVaga} from '../competicoes/regrasCopasRapidas.js';
import {primeiraLiga} from '../competicoes/vagasInternacionais.js';
import {ANO_INICIO,CLUBES,LIGAS,nomeDosTitulos} from '../dados/data.js';
import {clubesDoMundo} from '../simulacao/mundoVivo.js';
import {simularClassificacoesMundoTecnico} from '../treinador/classificacoesMundoTecnico.js';
import {simularMundo,nomeCanonico} from '../historia/historiaFutebol.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {creditarTitulo} from '../comum/lib.js';

export function ligasDoCompleto(c){
 return {...Object.fromEntries(Object.entries(c.estadoClubes||{}).filter(([,v])=>v?.liga).map(([nome,v])=>[nome,v.liga])),...(c.ligas||{}),...(c.clube?{[c.clube.nome]:c.clube.liga}:{})};
}
export function clubesDoCompleto(c,mundo){
 const ligas=ligasDoCompleto(c);
 return clubesDoMundo({...c,mundo,ligas},CLUBES.map(cl=>({...cl,liga:ligas[cl.nome]||cl.liga})));
}
/** Calendários externos são simulados uma vez; os placares do usuário prevalecem. */
export function prepararMundoTemporada(c,card,mundo){
 if(card.calendarioMundoVersao===1)return card;
 const ano=card.ano??ANO_INICIO+c.idade-16,ligaId=card.ligaId||c.clube.liga,clube=c.clube.nome;
 const ligas=ligasDoCompleto(c),clubes=clubesDoCompleto(c,mundo);
 const classificacoesMundo=simularClassificacoesMundoTecnico({clubes:clubes.filter(cl=>cl.liga!==ligaId&&!LIGAS[cl.liga]?.naoJogavel),ligasMundo:ligas,rng:geradorTecnico(`${c.codigo||c.nome}|${ano}|ligas-completo`)});
 if(card.classificacao?.length)classificacoesMundo[ligaId]={liga:ligaId,origem:'partidas-jogador',classificacao:card.classificacao.map(t=>({...t})),jogos:(card.jogosLiga||[]).map(j=>({...j}))};
 const nomes=nomeDosTitulos(ligaId);
 const competicoesPreservadas=[COPAS_NACIONAIS[primeiraLiga(ligaId)],nomes.copa,card.copaNacional?.nome,card.continental?.nome,card.continentalPendente?.nome].filter(Boolean);
 const novo={...card,ano,ligaId,clube,ligaNome:LIGAS[ligaId]?.nome||card.ligaNome,ligaMult:LIGAS[ligaId]?.mult??card.ligaMult,calendarioMundoVersao:1,classificacoesMundo,torneiosMundo:[],competicoesPreservadas};
 simularMundo({...c,mundo,ligas},novo,{preservarTorneios:true});
 const campeoes=new Map();
 const inserir=t=>{if(t.clube&&t.nome)campeoes.set(nomeCanonico(t.nome),{...t,ano,nome:nomeCanonico(t.nome)});};
 for(const [liga,t] of Object.entries(classificacoesMundo))inserir({nome:LIGAS[liga]?.nome||liga,tipo:'liga',liga,clube:t.classificacao[0]?.nome});
 for(const t of [...novo.torneiosMundo,...(novo.torneios||[])])if(t.campeao&&!t.finalPendente)inserir({nome:t.nome,tipo:t.tipo,clube:t.campeao});
 for(const [campo,tipo]of [['copaNacional','copa'],['continental','continental'],['mundial','mundial']])if(novo[campo]?.titulo)inserir({nome:novo[campo].nome||nomes[tipo],tipo,clube});
 if(novo.campeaoLiga===true&&!classificacoesMundo[ligaId])inserir({nome:novo.ligaNome,tipo:'liga',liga:ligaId,clube});
 novo.campeoesCalendarioMundo=[...campeoes.values()];
 return novo;
}
export function creditarCampeoesCalendario(estado,card){
 return (card.campeoesCalendarioMundo||[]).reduce((s,t)=>['liga','copa','continental','mundial'].includes(t.tipo)?creditarTitulo(s,t.clube,t.tipo):s,estado);
}
/** O prêmio usa o ranking recalculado após distribuir as estatísticas dos jogos. */
export function registrarPremioCalendario(mundo,vencedor){
 if(!mundo||!vencedor||mundo.historicoBolaDeOuro?.some(t=>t.temporada===mundo.temporada))return mundo;
 const registro={temporada:mundo.temporada,nome:vencedor.nome,clube:vencedor.clube,ovr:vencedor.ovr,gols:vencedor.gols,assist:vencedor.assist,...(vencedor.voce?{voce:true}:{id:vencedor.id})};
 const historicoBolaDeOuro=[...(mundo.historicoBolaDeOuro||[]).filter(t=>t.temporada!==mundo.temporada),registro].slice(-30);
 return {...mundo,historicoBolaDeOuro,jogadores:mundo.jogadores.map(p=>vencedor.id!=null&&p.id===vencedor.id&&!vencedor.voce?{...p,carreira:{...p.carreira,bolasDeOuro:(p.carreira?.bolasDeOuro||0)+1}}:p)};
}

export function vagasProximaTemporada(c,card){
 return calcularVagasRapidas({ano:card.ano,classificacoesMundo:card.classificacoesMundo,torneios:[...(card.torneiosMundo||[]),...(card.torneios||[])],ligasMundo:ligasDoCompleto(c),seed:c.codigoMundo||c.codigo||c.nome});
}
export function aplicarVagaTemporada(c,card){
 const ano=ANO_INICIO+c.idade-16;
 if(c.vagasInternacionaisAno!==ano||!c.vagasLigasSimuladas?.includes(c.clube.liga))return card;
 const vaga=c.vagasInternacionaisClubes?.[c.clube.nome];
 return {...card,continental:null,continentalPendente:vaga?{nome:nomeVaga(vaga.competicao),formato:['champions','europa','conference'].includes(vaga.competicao)?'liga':'grupo',entrada:vaga.entrada}:null};
}

/** Um empréstimo antes da primeira partida não pode carregar a chave do clube anterior. */
export function ajustarCardNovoClube(c,card){
 if(!card)return card;
 const liga=LIGAS[c.clube.liga],novo={...card,ligaId:c.clube.liga,ligaNome:liga?.nome,ligaMult:liga?.mult};
 delete novo.campanhasCompletas;delete novo.pernasCopas;delete novo.torneios;
 if(card.continentalPendente||card.continental){
  novo.continental=null;
  novo.continentalPendente=liga?.continental?{nome:liga.continental,formato:['Champions League','Europa League','Conference League'].includes(liga.continental)?'liga':'grupo'}:null;
 }
 return aplicarVagaTemporada(c,novo);
}
