import {LIGAS} from '../dados/data.js';

/** Lê o arquivo compacto sem acoplar o histórico ao motor de simulação. */
function jogosDaEdicao(edicao) {
  if (Array.isArray(edicao?.jogos)) return edicao.jogos;
  const {nomes=[],partidas=[]}=edicao?.jogos||{};
  return partidas.map(([a,b,golsCasa,golsFora,rodada,v,penaltis])=>({
    casa:nomes[a],fora:nomes[b],golsCasa,golsFora,rodada,
    vencedor:v==null?null:nomes[v],penaltis:!!penaltis
  }));
}

/** Leitura do arquivo de partidas do save. Não cria placares nem números ausentes. */
const valido = j => !!j?.casa && !!j?.fora && Number.isFinite(j.golsCasa) && Number.isFinite(j.golsFora);
const numero = n => Number.isFinite(n) ? n : null;
const idJogo = (ano, competicao, j, i) => [ano, competicao, j.casa, j.fora, j.rodada ?? j.fase ?? i, i].join('|');

export function partidasHistoricas(c = {}) {
  const u = c.tecnico?.universo || c.universo || {};
  const partidas = [];
  for (const edicao of u.edicoes || []) {
    for (const [i, j] of jogosDaEdicao(edicao).entries()) {
      if (!valido(j)) continue;
      partidas.push({
        ...j, id: idJogo(edicao.ano, edicao.nome, j, i),
        ano: edicao.ano, competicao: edicao.nome,
        fase: typeof j.rodada === 'string' ? j.rodada : j.fase || null,
      });
    }
  }
  // Durante a temporada do treinador, os confrontos concluídos já existem
  // no save. Mostrá-los imediatamente não exige avançar a carreira.
  const t=c.tecnico;
  if(t){
    const emJogo=t.andamento||t.temporadaPausada;
    const finalizada=t.temporadas?.at(-1);
    const origem=emJogo||finalizada;
    const ano=emJogo?(emJogo.ano??t.ano):finalizada?.ano;
    const clube=emJogo?t.clube:finalizada?.clube;
    const liga=emJogo?t.liga:finalizada?.liga;
    if(Number.isFinite(ano)&&clube&&!u.anos?.includes(ano)){
      const nomeLiga=LIGAS[liga]?.nome||liga||'Liga';
      for(const [i,j] of (origem?.confrontos||[]).entries()){
        if(j?.folga||!j?.nome||!Number.isFinite(j.golsPro)||!Number.isFinite(j.golsContra))continue;
        const casa=j.casa?clube:j.nome,fora=j.casa?j.nome:clube;
        const golsCasa=j.casa?j.golsPro:j.golsContra,golsFora=j.casa?j.golsContra:j.golsPro;
        // Evitar dupla contagem se um arquivo parcial já trouxe o jogo.
        if(partidas.some(p=>p.ano===ano&&p.competicao===nomeLiga&&p.casa===casa&&p.fora===fora&&p.rodada===(j.rodada??i+1)))continue;
        partidas.push({id:['etapa',ano,nomeLiga,casa,fora,j.rodada??i+1].join('|'),
          ano,competicao:nomeLiga,casa,fora,golsCasa,golsFora,rodada:j.rodada??i+1,
          fase:'Liga',origem:'temporada-em-andamento'});
      }
    }
  }
  return partidas;
}

/** Uma partida só vale uma vez, inclusive quando o campeonato já foi arquivado. */
export function resumoConfrontosClubes(c, {clube, adversario = '', competicao = '', ano = ''} = {}) {
  if (!clube) return {jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0,aproveitamento:0,partidas:[],porCompeticao:[]};
  const partidas = partidasHistoricas(c).filter(j =>
    (j.casa === clube || j.fora === clube) &&
    (!adversario || (j.casa === adversario || j.fora === adversario)) &&
    (!competicao || j.competicao === competicao) &&
    (!ano || String(j.ano) === String(ano))
  );
  const resumo = {jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0};
  const porCompeticao = new Map();
  for (const j of partidas) {
    const a = j.casa === clube ? j.golsCasa : j.golsFora;
    const b = j.casa === clube ? j.golsFora : j.golsCasa;
    const r = a > b ? 'vitorias' : a < b ? 'derrotas' : 'empates';
    for (const alvo of [resumo, porCompeticao.get(j.competicao) || (() => {
      const v = {competicao:j.competicao,jogos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0};
      porCompeticao.set(j.competicao,v);return v;
    })()]) {
      alvo.jogos++;alvo.golsPro += a;alvo.golsContra += b;alvo[r]++;
    }
  }
  return {...resumo,aproveitamento:resumo.jogos ? Math.round(100*(3*resumo.vitorias+resumo.empates)/(3*resumo.jogos)) : 0,
    partidas:[...partidas].reverse(),porCompeticao:[...porCompeticao.values()].sort((a,b)=>b.jogos-a.jogos)};
}

/** Transforma estatísticas individuais reais da partida em registros compactos.
 * Saves que só têm agregados anuais permanecem sem dados adversário a adversário. */
export function partidasDetalhadasUsuario(card = {}) {
  const ano = card.ano, clube = card.clube?.nome || card.clube;
  if (!clube || !Number.isFinite(ano)) return [];
  const liga = card.ligaNome || card.ligaId || 'Liga';
  const jogos = [];
  const salvar = (j, competicao, origem, indice, stats) => {
    if (!valido(j) || !competicao || (j.casa!==clube && j.fora!==clube)) return;
    jogos.push({
      id: [ano,origem,competicao,clube,indice].join('|'),ano,competicao,
      clube, adversario:j.casa === clube ? j.fora : j.casa,
      casa:j.casa,fora:j.fora,golsCasa:j.golsCasa,golsFora:j.golsFora,
      rodada:j.rodada ?? null,fase:j.fase || null,
      participou:stats.participou,
      gols:numero(stats.gols),assistencias:numero(stats.assistencias),
      defesas:numero(stats.defesas),cleanSheets:numero(stats.cleanSheets),nota:numero(stats.nota),
    });
  };
  for (const [i,j] of (card.jogosLista||[]).entries()) {
    if (!j?.adversario) continue;
    const golsMeu = numero(j.golsMeu), golsAdv = numero(j.golsAdv);
    if (golsMeu === null || golsAdv === null) continue;
    const participou = !j.suspenso && !j.descansou && !j.naoEscalado;
    salvar({casa:j.casa?clube:j.adversario,fora:j.casa?j.adversario:clube,
      golsCasa:j.casa?golsMeu:golsAdv,golsFora:j.casa?golsAdv:golsMeu,
      rodada:j.rodada??j.numero??i+1},liga,'liga',i,{
      participou,gols:participou?j.golsMinha:0,assistencias:participou?j.assistMinha:0,
      defesas:participou?j.defesas:0,cleanSheets:participou?j.cleanSheets:0,nota:participou?j.nota:null
    });
  }
  for (const [i,j] of (card.partidasCompeticoes||[]).entries()) {
    if (j?.selecao || !j.competicao) continue;
    salvar(j,j.competicao,'copa',i,{
      participou:!(j.naoEscalado||j.suspenso||j.descansou||j.participou===false),gols:j.gols,assistencias:j.assist,
      defesas:j.defesas,cleanSheets:j.cleanSheets,nota:j.nota
    });
  }
  return jogos;
}

/** No Modo Rápido o motor gera totais anuais. Para NOVAS temporadas, distribui
 * atuações apenas entre partidas com placar salvo, respeitando os gols do clube.
 * Esta simulação é identificada como tal, nunca apresentada como súmula real. */
export function partidasDistribuidasModoRapido(universo, card) {
  if (!Number.isFinite(card?.ano) || !card?.clube || !Array.isArray(card.porCompeticao)) return [];
  const edicoes=(universo.edicoes||[]).filter(e=>e.ano===card.ano);
  const arquivo=partidasHistoricas({universo:{edicoes:edicoes}});
  const clube=typeof card.clube==='string'?card.clube:card.clube.nome;
  const hash=valor=>{let h=2166136261;for(const letra of String(valor)){h=Math.imul(h^letra.charCodeAt(0),16777619);}return h>>>0;};
  const distribuir=(total,lista,capacidade)=>{
    let resto=Math.max(0,Math.round(total||0));
    const saida=lista.map(()=>0);
    while(resto>0){
      let mudou=false;
      for(let i=0;i<lista.length&&resto>0;i++){
        if(saida[i]<(capacidade?.[i]??Infinity)){saida[i]++;resto--;mudou=true;}
      }
      if(!mudou)break;
    }
    return saida;
  };
  const registros=[];
  for(const comp of card.porCompeticao){
    const jogos=arquivo.filter(j=>j.competicao===comp.nome&&(j.casa===clube||j.fora===clube));
    if(!jogos.length)continue;
    const ordenados=[...jogos].sort((a,b)=>hash(card.ano+'|'+comp.nome+'|'+a.id)-hash(card.ano+'|'+comp.nome+'|'+b.id));
    const atuacoes=ordenados.slice(0,Math.min(ordenados.length,Math.max(0,Math.round(comp.jogos||0))));
    if(!atuacoes.length)continue;
    const golsTime=atuacoes.map(j=>j.casa===clube?j.golsCasa:j.golsFora);
    const gols=distribuir(comp.gols,atuacoes,golsTime);
    const assistencias=distribuir(comp.assist,atuacoes,golsTime.map((n,i)=>Math.max(0,n-gols[i])));
    const defesas=distribuir(comp.defesas,atuacoes);
    const cleanSheets=distribuir(comp.cleanSheets,atuacoes,atuacoes.map(j=>(j.casa===clube?j.golsFora:j.golsCasa)===0?1:0));
    atuacoes.forEach((j,i)=>registros.push({
      id:[card.ano,'simulado',comp.nome,j.id].join('|'),
      ano:card.ano,competicao:comp.nome,clube,
      adversario:j.casa===clube?j.fora:j.casa,casa:j.casa,fora:j.fora,
      golsCasa:j.golsCasa,golsFora:j.golsFora,rodada:j.rodada,
      fase:j.fase,participou:true,gols:gols[i],assistencias:assistencias[i],
      defesas:Number.isFinite(comp.defesas)?defesas[i]:null,
      cleanSheets:Number.isFinite(comp.cleanSheets)?cleanSheets[i]:null,
      nota:null,origem:'distribuicao-simulada'
    }));
  }
  return registros;
}

export function registrarPartidasDetalhadasUsuario(universo, card) {
  const detalhadas = partidasDetalhadasUsuario(card);
  const novos = detalhadas.length ? detalhadas : partidasDistribuidasModoRapido(universo,card);
  if (!novos.length) return universo;
  const anteriores = universo.partidasAtletas?.voce || [];
  const ids = new Set(anteriores.map(j=>j.id));
  const inseridos = novos.filter(j=>!ids.has(j.id));
  if (!inseridos.length) return universo;
  return {...universo,partidasAtletas:{...(universo.partidasAtletas||{}),voce:[...anteriores,...inseridos]}};
}

export function partidasDoAtleta(c, jogadorId = 'voce') {
  const u = c.tecnico?.universo || c.universo || {};
  const arquivo = u.partidasAtletas?.[String(jogadorId)] || [];
  const diretas = String(jogadorId)==='voce'
    ? (c.temporadas||[]).flatMap(partidasDetalhadasUsuario) : [];
  const mapa = new Map();
  // Preferir os registros já gravados: uma temporada não deve ser contada duas vezes.
  for (const j of [...diretas,...arquivo]) if (j?.clube && j?.adversario) mapa.set(j.id,j);
  if(!mapa.size && String(jogadorId)!=='voce'){
    // Atletas do mundo já guardam totais por competição em cada ano.
    // Repartição sob demanda é determinística e usa só placares arquivados;
    // não replica milhões de registros de partidas no armazenamento do celular.
    for(const linha of u.atletas?.[String(jogadorId)]?.historico||[]){
      const ano=Array.isArray(linha)?linha[0]:linha.ano;
      const clube=Array.isArray(linha)?linha[1]:linha.clube;
      const comps=Array.isArray(linha)?linha[10]:linha.porCompeticao;
      if(!Array.isArray(comps)||!clube)continue;
      const porCompeticao=comps.map(t=>Array.isArray(t)?{
        nome:t[0],jogos:t[1],gols:t[2],assist:t[3],defesas:t[4],cleanSheets:t[5]
      }:t);
      for(const j of partidasDistribuidasModoRapido(u,{ano,clube,porCompeticao}))
        mapa.set(j.id,j);
    }
  }
  return [...mapa.values()].sort((a,b)=>a.ano-b.ano);
}

export function resumoConfrontosAtleta(c, {jogadorId = 'voce', adversario = '', competicao = '', ano = ''} = {}) {
  const partidas = partidasDoAtleta(c,jogadorId).filter(j =>
    j.participou !== false &&
    (!adversario || j.adversario === adversario) &&
    (!competicao || j.competicao === competicao) &&
    (!ano || String(j.ano) === String(ano)));
  const total = {jogos:partidas.length,gols:0,assistencias:0,defesas:0,cleanSheets:0,notas:0,notasDisponiveis:0};
  const porCompeticao = new Map();
  for (const j of partidas) {
    let s=porCompeticao.get(j.competicao);
    if (!s){s={competicao:j.competicao,jogos:0,gols:0,assistencias:0,defesas:0,cleanSheets:0};porCompeticao.set(j.competicao,s);}
    s.jogos++;
    for (const k of ['gols','assistencias','defesas','cleanSheets']) if (Number.isFinite(j[k])) {s[k]+=j[k];total[k]+=j[k];}
    if (Number.isFinite(j.nota)){total.notas+=j.nota;total.notasDisponiveis++;}
  }
  return {...total,notaMedia:total.notasDisponiveis ? Math.round(total.notas/total.notasDisponiveis*100)/100 : null,
    partidas:[...partidas].reverse(),porCompeticao:[...porCompeticao.values()].sort((a,b)=>b.jogos-a.jogos)};
}
