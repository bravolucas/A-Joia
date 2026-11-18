/**
 * Acervo de conquistas dos atletas.
 * As súmulas anuais e os dados do elenco usam formatos compactos diferentes;
 * o arquivo unifica fontes verificáveis sem transformar títulos do clube em
 * títulos automáticos de todos os seus jogadores.
 */
const somenteNumero = n => Number.isFinite(n) ? Math.trunc(n) : null;
const texto = n => String(n ?? '').trim();
export const premioIndividual = tipo =>
  /bola.?de?.?ouro|bolaouro|bota.?de?.?ouro|botaouro|yashin|artilh|melhor.?jog|melhor.?da|revela[cç][aã]o|pr[eê]mio|premio|luva.?de?.?ouro|golden.?boot|golden.?ball/i.test(texto(tipo));
const nomePremio = tipo => ({
  'bola-de-ouro':'Bola de Ouro','bolaOuro':'Bola de Ouro',
  'botaOuro':'Bota de Ouro','bota-de-ouro':'Bota de Ouro',
  'yashin':'Troféu Yashin','artilheiro':'Artilheiro',
  'melhor-jogador':'Melhor jogador','revelacao':'Revelação'
})[texto(tipo)] || texto(tipo).replace(/[-_]/g,' ');

export function registroConquista(ano,categoria,nome,clube,tipo=''){
  const identificador=texto(nome),temporada=somenteNumero(ano);
  if(!identificador||!['titulo','premio'].includes(categoria))return null;
  return [temporada,categoria,identificador,texto(clube),texto(tipo)];
}
export function expandirConquista(x){
  if(Array.isArray(x)){
    if(x.length<4)return null;
    const [ano,categoria,nome,clube,tipo='']=x;
    return registroConquista(ano,categoria,nome,clube,tipo)
      ? {ano:somenteNumero(ano),categoria,nome,clube,tipo} : null;
  }
  if(!x || typeof x!=='object')return null;
  const tipo=texto(x.tipo),categoria=x.categoria|| (premioIndividual(tipo||x.nome)?'premio':'titulo');
  return expandirConquista(registroConquista(x.ano,categoria,x.nome,x.clube,tipo));
}
export function combinarConquistas(...colecoes){
  const mapa=new Map();
  for(const itens of colecoes)for(const item of itens||[]){
    const linha=expandirConquista(item);
    if(!linha)continue;
    const key=[linha.ano,linha.categoria,linha.nome.toLowerCase(),linha.clube.toLowerCase()].join('|');
    if(!mapa.has(key))mapa.set(key,registroConquista(linha.ano,linha.categoria,linha.nome,linha.clube,linha.tipo));
  }
  return [...mapa.values()].sort((a,b)=>(b[0]??0)-(a[0]??0)||a[2].localeCompare(b[2],'pt-BR'));
}

export function conquistasDoCadastroMundo(jogador){
  if(!jogador)return [];
  const titulos=(jogador.titulosConquistados||[]).filter(r=>Array.isArray(r)&&r.length>=5)
    .map(([,ano,tipo,nome,clube])=>registroConquista(ano,'titulo',nome,clube,tipo));
  const premios=(jogador.premiacoesIndividuais||[]).filter(r=>Array.isArray(r)&&r.length>=4)
    .map(([,ano,tipo,clube])=>registroConquista(ano,'premio',nomePremio(tipo),clube,tipo));
  return combinarConquistas(titulos,premios);
}

export function conquistasDaTemporadaUsuario(card){
  if(!card||!Number.isFinite(card.ano))return [];
  const clube=typeof card.clube==='string'?card.clube:card.clube?.nome||'';
  return combinarConquistas((card.titulos||[]).filter(t=>t&&typeof t==='object')
    .map(t=>registroConquista(card.ano,premioIndividual(t.tipo||t.nome)?'premio':'titulo',
      texto(t.nome),(/selecao|copaMundo/i.test(t.tipo)?card.selecao?.nome||clube:clube),t.tipo)));
}

export function conquistasDoJogador(c={},jogadorId='voce'){
  const id=String(jogadorId),u=c.tecnico?.universo||c.universo||{};
  const atleta=u.atletas?.[id],jogador=id==='voce'?null:(c.mundo?.jogadores||[]).find(p=>String(p.id)===id);
  const existentes=atleta?.conquistas||[];
  const cadastro=conquistasDoCadastroMundo(jogador);
  const usuario=id==='voce'?
    [...(c.lista||[]).map(t=>{
      const clubePremio=t.clube==='Individual'
        ? (c.temporadas||[]).find(ano=>ano.ano===t.ano)?.clube||t.clube
        : t.clube;
      return registroConquista(t.ano,premioIndividual(t.tipo||t.nome)?'premio':'titulo',
        t.nome,clubePremio,t.tipo);
    }),...(c.temporadas||[]).flatMap(conquistasDaTemporadaUsuario)] : [];
  // Compatibilidade com saves anteriores ao arquivo de conquistas: um título
  // do clube só pode ser creditado quando há jogos do próprio atleta na copa.
  const legado=(atleta?.historico||[]).flatMap(linha=>{
    const ano=Array.isArray(linha)?linha[0]:linha.ano;
    const clube=Array.isArray(linha)?linha[1]:linha.clube;
    const titulos=Array.isArray(linha)?linha[7]:linha.titulos;
    const comps=Array.isArray(linha)?linha[10]:linha.porCompeticao;
    if(!Array.isArray(titulos)||!Array.isArray(comps))return [];
    const disputadas=new Set(comps.filter(x=>(Array.isArray(x)?x[1]:x.jogos)>0)
      .map(x=>Array.isArray(x)?x[0]:x.nome));
    return titulos.filter(nome=>disputadas.has(nome))
      .map(nome=>registroConquista(ano,'titulo',nome,clube,'registro-de-participacao'));
  });
  return combinarConquistas(existentes,cadastro,usuario,legado)
    .map(expandirConquista);
}
export function resumoConquistas(c={},jogadorId='voce'){
  const todas=conquistasDoJogador(c,jogadorId);
  const titulos=todas.filter(x=>x.categoria==='titulo');
  const premios=todas.filter(x=>x.categoria==='premio');
  const porAno=new Map();
  for(const item of todas){
    const key=item.ano ?? 'Sem ano';
    if(!porAno.has(key))porAno.set(key,[]);
    porAno.get(key).push(item);
  }
  return {todas,titulos,premios,porAno:[...porAno].map(([ano,itens])=>({ano,itens}))};
}
