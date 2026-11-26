import {jogosDaCampanha} from '../competicoes/jogosCampanha.js';
import {salarioMensalEuro} from './economia.js';
import {SETORES_FORCA, setorJogador} from './forcaEquipe.js';

export function participacaoNasSumulas(classificacoes = {}, copas = []) {
  const atletas = new Map(), jogosPorClube = new Map();
  const partidas = [...Object.values(classificacoes).map(edicao=>edicao.jogos||[]), ...copas.map(jogosDaCampanha)];
  for (const jogos of partidas) for (const jogo of jogos) {
    jogo.sumula?.forEach((ficha, lado) => {
      if (!ficha) return;
      const clube = lado === 0 ? jogo.casa : jogo.fora;
      const saldo = (jogo.golsCasa - jogo.golsFora) * (lado === 0 ? 1 : -1);
      jogosPorClube.set(clube, (jogosPorClube.get(clube) ?? 0) + 1);
      for (let i = 0; i < ficha.minutos.length; i += 2) {
        const id = ficha.minutos[i], minutos = ficha.minutos[i + 1];
        const linha = atletas.get(id) ?? {minutos:0, saldo:0};
        linha.minutos += minutos;
        linha.saldo += Math.sign(saldo) * minutos;
        atletas.set(id, linha);
      }
    });
  }
  return {atletas,jogosPorClube};
}

export function ajustarEvolucaoObservada(p, variacao, participacao, partidas) {
  if (!partidas) return variacao;
  const minutos = participacao?.minutos ?? 0;
  const uso = Math.min(1,minutos/(90*partidas));
  const fase = minutos ? participacao.saldo/minutos : 0;
  if (p.idade <= p.picoIdade) {
    const ganho = Math.round(variacao*(.5+uso*.7) + (uso>.35?fase:0));
    return Math.min(Math.max(0, (p.potencial??99)-p.ovr),Math.max(0,ganho));
  }
  return variacao - (p.posicao!=='GOL'&&uso<.25?1:0);
}

export function prepararProjetosClubes(mundo, clubes, perfis, ano, caixa, clubeDoAtleta) {
  const projetos = {}, elencos = new Map();
  for (const p of mundo.jogadores) {
    if (!p.clubeNome || p.aposentado) continue;
    if (!elencos.has(p.clubeNome)) elencos.set(p.clubeNome,[]);
    elencos.get(p.clubeNome).push(p);
  }
  for (const clube of clubes) {
    const nome=clube.nome, elenco=elencos.get(nome)||[];
    if(nome===clubeDoAtleta)continue;
    const anterior=mundo.projetosClubes?.[nome];
    const anteriorNaLiga=perfis[nome]?.historico?.at(-1);
    const movimento=anteriorNaLiga?.ano===ano-1?anteriorNaLiga.movimento:null;
    const folha=elenco.reduce((total,p)=>total+(p.salario??salarioMensalEuro(p)),0);
    const objetivo=movimento==='acesso'?'permanência':movimento==='rebaixamento'?'recuperação':
      anterior?.ate>=ano?anterior.objetivo:
      elenco.filter(p=>p.idade<=22).length>=elenco.length*.35&&elenco.length?'formação':'competitividade';
    const iniciou=!!movimento||anterior?.ate<ano||!anterior;
    projetos[nome]={objetivo,desde:iniciou?ano:anterior.desde,ate:iniciou?ano+2:anterior.ate,
      historico:anterior?.historico??[], folha, teto:Math.ceil(Math.max(folha,anterior?.teto*.9||0)*1.08+(caixa[nome]||0)/240),
      caixaInicial:caixa[nome]||0, renovacoes:0, compras:0, vendas:0,
      setores:Object.fromEntries(Object.keys(SETORES_FORCA).map(setor=>[setor,elenco.filter(p=>setorJogador(p)===setor).length]))};
  }
  return projetos;
}

export function finalizarProjetosClubes(projetos, caixa, ano, jogadores) {
  const folhas = new Map();
  for (const p of jogadores) {
    if (!p.clubeNome || p.aposentado) continue;
    folhas.set(p.clubeNome,(folhas.get(p.clubeNome)??0)+(p.salario??salarioMensalEuro(p)));
  }
  return Object.fromEntries(Object.entries(projetos).map(([nome,p])=>{
    const {historico,setores,...projeto}=p;
    projeto.folha=folhas.get(nome)??0;
    const registro={ano,objetivo:p.objetivo,folha:projeto.folha,teto:p.teto,caixa:caixa[nome]??0,
      renovacoes:p.renovacoes,compras:p.compras,vendas:p.vendas};
    return [nome,{...projeto,historico:[...historico.slice(-9),registro]}];
  }));
}
