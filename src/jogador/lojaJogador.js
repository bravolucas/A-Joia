export const MELHORIAS_JOGADOR = [
  {id:'equipamento',nome:'Equipamento profissional',icone:'⚽',categoria:'Treino',custo:500,desc:'Evolução 3% mais rápida.',evolucao:1.03},
  {id:'finalizador',nome:'Treinador de finalização',icone:'🎯',categoria:'Treino',custo:900,desc:'Produção de gols +4%.',golsMult:1.04,somenteLinha:true},
  {id:'criador',nome:'Treinador de criação',icone:'⚽',categoria:'Treino',custo:900,desc:'Produção de assistências +5%.',assistMult:1.05,somenteLinha:true},
  {id:'treino-goleiro',nome:'Preparador de goleiros',icone:'🧤',categoria:'Treino',custo:800,desc:'Até +2 p.p. na chance estimada de defender lances decisivos.',defesa:.02,somenteGoleiro:true},
  {id:'bola-parada-pro',nome:'Especialista em bolas paradas',icone:'🥅',categoria:'Treino',custo:1100,desc:'Precisão extra em pênaltis e faltas decisivas.',penalti:.015,falta:.015,somenteLinha:true},
  {id:'recuperacao-pro',nome:'Rotina de recuperação',icone:'🩺',categoria:'Saúde',custo:700,desc:'Risco de lesão 5% menor.',lesaoMult:.95},
  {id:'media-training',nome:'Media training',icone:'📸',categoria:'Carreira',custo:800,desc:'+1 de fama e +1 de estado mental por temporada.',famaAno:1,moralAno:1},
  {id:'projeto-social',nome:'Projeto social no clube',icone:'🤝',categoria:'Carreira',custo:1500,desc:'+1 de torcida por temporada e legado social.',torcidaAno:1,social:true},
];
export const UPS_JOGADOR = [
  {id:'up-gols',nome:'UP de finalização',icone:'🎯',custo:120,desc:'Produção de gols +15%.',golsMult:1.15,familia:'gols',duracao:1,somenteLinha:true},
  {id:'up-assist',nome:'UP de criação',icone:'⚽',custo:120,desc:'Produção de assistências +18%.',assistMult:1.18,familia:'assist',duracao:1,somenteLinha:true},
  {id:'up-nota',nome:'UP de desempenho',icone:'📊',custo:100,desc:'+0,12 na nota da temporada, respeitando o limite do jogo.',notaBonus:.12,familia:'nota',duracao:1},
  {id:'up-fisio',nome:'UP de proteção física',icone:'🩺',custo:180,desc:'Risco de lesão 30% menor.',lesaoMult:.7,familia:'fisico',duracao:1},
  {id:'up-ritmo',nome:'UP de ritmo de jogo',icone:'🔥',custo:140,desc:'Até +3 p.p. na participação em jogos, respeitando o limite do elenco.',shareAdd:.03,familia:'ritmo',duracao:1},
  {id:'up-evolucao',nome:'UP de evolução',icone:'🏋️',custo:200,desc:'Evolução 15% mais rápida. O treino conquistado permanece.',evolucao:1.15,familia:'evolucao',duracao:1},
  {id:'up-penalti',nome:'UP de pênaltis',icone:'🎯',custo:150,desc:'Até +4 p.p. na chance estimada dos pênaltis decisivos.',penalti:.04,familia:'penalti',duracao:1,somenteLinha:true},
  {id:'up-falta',nome:'UP de faltas',icone:'🥅',custo:150,desc:'Até +4 p.p. na chance estimada das faltas decisivas.',falta:.04,familia:'falta',duracao:1,somenteLinha:true},
  {id:'up-passe',nome:'UP de passes decisivos',icone:'⚽',custo:150,desc:'Até +4 p.p. na chance estimada de uma assistência decisiva.',passe:.04,familia:'passe',duracao:1,somenteLinha:true},
  {id:'up-defesa',nome:'UP de reflexos',icone:'🧤',custo:150,desc:'Até +4 p.p. na chance estimada das defesas decisivas.',defesa:.04,familia:'defesa',duracao:1,somenteGoleiro:true},
  {id:'up-cabeca',nome:'UP de confiança',icone:'🧠',custo:90,desc:'+5 de estado mental no fechamento da campanha.',moralAno:5,familia:'cabeca',duracao:1},
  {id:'up-vitrine',nome:'UP de exposição',icone:'📸',custo:110,desc:'+3 de fama no fechamento da campanha.',famaAno:3,familia:'vitrine',duracao:1},
  {id:'up-ciclo-evolucao',nome:'Ciclo de evolução',icone:'🏋️',custo:400,desc:'Evolução 8% mais rápida durante três temporadas.',evolucao:1.08,familia:'evolucao',duracao:3},
  {id:'up-ciclo-fisico',nome:'Ciclo de preparação física',icone:'🩺',custo:350,desc:'Risco de lesão 15% menor durante três temporadas.',lesaoMult:.85,familia:'fisico',duracao:3},
].map(i=>({...i,categoria:'UPs temporários',temporario:true}));
export const upJogadorDe=id=>UPS_JOGADOR.find(i=>i.id===id);
export const upsAtivosJogador=(c,ano=c.ano)=>(c.upsTemporarios||[]).filter(x=>x.inicio<=ano&&ano<x.fim&&upJogadorDe(x.id));
export function impedimentoLojaJogador(c,item,emTemporada=false){
 if(!item)return 'Item indisponível';
 if(c.aposentado)return 'Carreira de jogador encerrada';
 if(emTemporada||c.lojaAnoEmCurso===c.ano)return 'Compre entre temporadas';
 if(item.somenteGoleiro&&c.posicao!=='GOL')return 'Exclusivo para goleiros';
 if(item.somenteLinha&&c.posicao==='GOL')return 'Exclusivo para jogadores de linha';
 if(!item.temporario&&(c.investimentos||[]).includes(item.id))return 'Adquirido';
 const ativos=upsAtivosJogador(c);
 if(item.temporario&&ativos.some(x=>upJogadorDe(x.id).familia===item.familia))return 'Já há um UP deste tipo ativo';
 if(item.temporario&&ativos.length>=3)return 'Limite de 3 UPs ativos';
 if((c.patrimonio||0)<item.custo)return 'Saldo insuficiente';
 return null;
}
export function comprarUpJogador(c,id,emTemporada=false){
 const item=upJogadorDe(id),motivo=impedimentoLojaJogador(c,item,emTemporada);
 if(motivo)return {c,ok:false,motivo};
 return {ok:true,c:{...c,patrimonio:c.patrimonio-item.custo,upsTemporarios:[...(c.upsTemporarios||[]),{id,inicio:c.ano,fim:c.ano+item.duracao,custo:item.custo}]}};
}
