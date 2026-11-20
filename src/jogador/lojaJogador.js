export const MELHORIAS_JOGADOR = [
  {id:'equipamento',descontinuado:true,nome:'Equipamento profissional',icone:'⚽',categoria:'Treino',custo:500,desc:'Evolução 3% mais rápida.',evolucao:1.03},
  {id:'finalizador',descontinuado:true,nome:'Treinador de finalização',icone:'🎯',categoria:'Treino',custo:900,desc:'Produção de gols +4%.',golsMult:1.04,somenteLinha:true},
  {id:'criador',descontinuado:true,nome:'Treinador de criação',icone:'⚽',categoria:'Treino',custo:900,desc:'Produção de assistências +5%.',assistMult:1.05,somenteLinha:true},
  {id:'treino-goleiro',descontinuado:true,nome:'Preparador de goleiros',icone:'🧤',categoria:'Treino',custo:800,desc:'Até +2 p.p. na chance estimada de defender lances decisivos.',defesa:.02,somenteGoleiro:true},
  {id:'bola-parada-pro',nome:'Especialista em bolas paradas',icone:'🥅',categoria:'Treino',custo:1100,desc:'Precisão extra em pênaltis e faltas decisivas.',penalti:.015,falta:.015,somenteLinha:true},
  {id:'recuperacao-pro',descontinuado:true,nome:'Rotina de recuperação',icone:'🩺',categoria:'Saúde',custo:700,desc:'Risco de lesão 5% menor.',lesaoMult:.95},
  {id:'media-training',descontinuado:true,nome:'Media training',icone:'📸',categoria:'Carreira',custo:800,desc:'+1 de fama e +1 de estado mental por temporada.',famaAno:1,moralAno:1},
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
  {id:'up-classico',nome:'UP de clássico',icone:'⚔️',custo:130,desc:'O clássico decisivo entra na sua temporada e, se você decidir, a torcida dá +5 extra.',classicoGarantido:1,torcidaClassico:5,familia:'classico',duracao:1},
  {id:'up-selecao',nome:'UP de vitrine na seleção',icone:'🏳️',custo:160,desc:'Jogos assistidos pela comissão técnica: referência de OVR da convocação 1 ponto menor nesta temporada.',selecaoCorte:1,familia:'selecao',duracao:1,idadeMin:18},
  {id:'up-olheiro',nome:'UP de olheiro pessoal',icone:'🔭',custo:120,desc:'Um olheiro divulga seus números: +1 proposta na janela e +2 clubes observando.',ofertasExtra:1,interesseExtra:2,familia:'mercado',duracao:1,idadeMin:18},
  {id:'up-ciclo-fisico',nome:'Ciclo de preparação física',icone:'🩺',custo:350,desc:'Risco de lesão 15% menor durante três temporadas.',lesaoMult:.85,familia:'fisico',duracao:3},
].map(i=>({...i,categoria:'UPs temporários',temporario:true}));
/*
 * Staff pessoal (como no FM): departamentos com níveis 1 a 3. Só o nível mais
 * alto conta, e subir de nível custa apenas o novo degrau. O preço acompanha o
 * salário, com um piso para que o nível 1 caiba no primeiro contrato.
 */
const NIVEIS=[{fator:.5,min:4},{fator:1.5,min:60},{fator:4,min:500}];
const departamento=(id,nome,icone,niveis)=>niveis.map((n,i)=>({id:`${id}-${i+1}`,departamento:id,nivel:i+1,nome:`${nome} · nível ${i+1}`,icone,categoria:'Staff pessoal',custo:NIVEIS[i].min,precoSalario:NIVEIS[i],requer:i?`${id}-${i}`:null,...n}));
export const DEPARTAMENTOS_JOGADOR=[
 ...departamento('dep-saude','Saúde e recuperação','🩺',[
  {desc:'Fisioterapeuta de plantão. Risco de lesão 5% menor.',lesaoMult:.95},
  {desc:'Fisioterapia particular e recuperação em casa. Risco de lesão 12% menor e cura lesão crônica.',lesaoMult:.88,curaCronica:true},
  {desc:'Departamento médico próprio. Risco de lesão 20% menor e cura lesão crônica.',lesaoMult:.8,curaCronica:true}]),
 ...departamento('dep-fisico','Preparação física','🏃',[
  {desc:'Personal trainer nas férias. Declínio físico 4% mais lento.',declinio:.96},
  {desc:'Preparador físico particular. Declínio físico 8% mais lento.',declinio:.92},
  {desc:'Equipe de alto rendimento. Declínio físico 13% mais lento.',declinio:.87}]),
 ...departamento('dep-tecnico','Treino técnico','⚽',[
  {desc:'Treinos extras orientados. Evolução 3% mais rápida.',evolucao:1.03},
  {desc:'Treinador técnico particular. Evolução 6% mais rápida.',evolucao:1.06},
  {desc:'Centro de treinamento próprio. Evolução 10% mais rápida.',evolucao:1.1}]),
 ...departamento('dep-mente','Mente','🧠',[
  {desc:'Psicólogo do esporte quinzenal. +1 de moral por temporada e quedas 15% menores.',moralAno:1,moralQueda:.85},
  {desc:'Psicólogo semanal. +2 de moral por temporada e quedas 30% menores.',moralAno:2,moralQueda:.7},
  {desc:'Coach mental integrado à rotina. +3 de moral por temporada e metade das quedas.',moralAno:3,moralQueda:.5}]),
 ...departamento('dep-analise','Análise de desempenho','📊',[
  {desc:'Vídeos dos seus jogos. +0,02 na nota, +2% de gols e assistências.',notaBonus:.02,golsMult:1.02,assistMult:1.02,defesa:.01},
  {desc:'Analista particular. +0,04 na nota, +3% de gols e assistências.',notaBonus:.04,golsMult:1.03,assistMult:1.03,defesa:.015},
  {desc:'Núcleo de dados próprio. +0,07 na nota, +5% de gols e assistências.',notaBonus:.07,golsMult:1.05,assistMult:1.05,defesa:.02}]),
 ...departamento('dep-imagem','Imagem e carreira','📸',[
  {desc:'Assessor de redes sociais. +1 de fama por temporada.',famaAno:1},
  {desc:'Assessoria de imagem. +2 de fama por temporada.',famaAno:2},
  {desc:'Agência de imagem completa. +3 de fama por temporada.',famaAno:3}]),
];

/* Itens ligados aos sistemas da carreira. Ações de uso único não ocupam espaço de UP. */
export const ACOES_CARREIRA_JOGADOR=[
 {id:'treino-posicao',nome:'Treino específico de posição',icone:'🧭',categoria:'Treino',custo:40,precoSalario:{fator:.6,min:40},consumivel:true,desc:'Sessões individuais na nova função. Encurta a adaptação em 1 temporada (se faltar só uma, corta pela metade a perda de OVR).'},
 {id:'mentor-tecnico',nome:'Mentor técnico',icone:'🎓',categoria:'Treino',custo:50,precoSalario:{fator:.6,min:50},consumivel:true,desc:'Um especialista acompanha a assinatura técnica mais avançada: conta 1 temporada extra no progresso (uma vez por assinatura).'},
 {id:'acao-torcida',nome:'Ação com a torcida',icone:'🤝',categoria:'Carreira',custo:8,precoSalario:{fator:.25,min:8},consumivel:true,desc:'Autógrafos, visita a escolas e projeto no bairro. +6 de torcida no clube atual (uma vez por temporada, fora de empréstimo).'},
 {id:'advogado-contrato',nome:'Advogado de contrato',icone:'⚖️',categoria:'Carreira',custo:20,precoSalario:{fator:.4,min:20},consumivel:true,desc:'Inclui no contrato atual uma cláusula de tempo de jogo: se você jogar bem abaixo do papel prometido, a multa de saída cai para 40%.'},
 {id:'longevidade',nome:'Programa de longevidade',icone:'🧬',categoria:'Saúde',custo:80,precoSalario:{fator:1.5,min:80},idadeMin:30,desc:'Sono, nutrição e carga monitorados para o fim da carreira. Declínio físico 10% mais lento.',declinio:.9},
];
export const precoItemJogador=(c,item)=>{if(!item)return Infinity;const p=item.precoSalario;if(!p)return item.custo;const sal=Math.max(10,Number(c?.contrato?.salario)||10);return Math.max(p.min,Math.round(sal*p.fator));};

/* Tetos da soma dos efeitos de loja: compra é escolha, não atalho. */
export const TETOS_LOJA={lesaoMult:{min:.65,rotulo:'Risco de lesão'},declinio:{min:.8,rotulo:'Declínio físico'},evolucao:{max:1.2,rotulo:'Evolução'},notaBonus:{max:.15,rotulo:'Nota'},golsMult:{max:1.2,rotulo:'Gols'},assistMult:{max:1.25,rotulo:'Assistências'},moralAno:{max:6,rotulo:'Moral por temporada'},moralQueda:{min:.5,rotulo:'Quedas de moral'},famaAno:{max:5,rotulo:'Fama por temporada'},torcidaAno:{max:4,rotulo:'Torcida por temporada'},shareAdd:{max:.05,rotulo:'Participação'}};
export function limitarEfeitoLoja(chave,valor){const t=TETOS_LOJA[chave];if(!t)return valor;if(t.min!=null&&valor<t.min)return t.min;if(t.max!=null&&valor>t.max)return t.max;return valor;}

export const upJogadorDe=id=>UPS_JOGADOR.find(i=>i.id===id);
export const upsAtivosJogador=(c,ano=c.ano)=>(c.upsTemporarios||[]).filter(x=>x.inicio<=ano&&ano<x.fim&&upJogadorDe(x.id));
export function impedimentoLojaJogador(c,item,emTemporada=false){
 if(!item)return 'Item indisponível';
 if(c.aposentado)return 'Carreira de jogador encerrada';
 if(emTemporada||c.lojaAnoEmCurso===c.ano)return 'Compre entre temporadas';
 if(item.somenteGoleiro&&c.posicao!=='GOL')return 'Exclusivo para goleiros';
 if(item.somenteLinha&&c.posicao==='GOL')return 'Exclusivo para jogadores de linha';
 if(!item.temporario&&(c.investimentos||[]).includes(item.id))return 'Adquirido';
 if(item.descontinuado)return 'Fora de linha';
 if(item.idadeMin&&c.idade<item.idadeMin)return `A partir dos ${item.idadeMin} anos`;
 if(item.requer&&!(c.investimentos||[]).includes(item.requer))return 'Requer o nível anterior';
 if(item.consumivel){const m=requisitoAcao(c,item.id);if(m)return m;}
 const ativos=upsAtivosJogador(c);
 if(item.temporario&&ativos.some(x=>upJogadorDe(x.id).familia===item.familia))return 'Já há um UP deste tipo ativo';
 if(item.temporario&&ativos.length>=3)return 'Limite de 3 UPs ativos';
 if((c.patrimonio||0)<precoItemJogador(c,item))return 'Saldo insuficiente';
 return null;
}
export function comprarUpJogador(c,id,emTemporada=false){
 const item=upJogadorDe(id),motivo=impedimentoLojaJogador(c,item,emTemporada);
 if(motivo)return {c,ok:false,motivo};
 return {ok:true,c:{...c,patrimonio:Math.round((c.patrimonio-precoItemJogador(c,item))*1000)/1000,upsTemporarios:[...(c.upsTemporarios||[]),{id,inicio:c.ano,fim:c.ano+item.duracao,custo:precoItemJogador(c,item)}]}};
}

/* ---------- ações de uso único ---------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const progressoAssinatura=a=>(a?.anos?.length||0)+(a?.mentor||0);
function assinaturaParaMentor(c,assinaturas){
 const j=c.jornada||{};
 return assinaturas.map(s=>({s,n:progressoAssinatura(j.assinaturas?.[s.id])})).filter(({s,n})=>n>=1&&n<s.meta&&!j.assinaturas?.[s.id]?.mentor).sort((a,b)=>b.n/b.s.meta-a.n/a.s.meta)[0]?.s||null;
}
let ASSINATURAS_REF=[];
export const registrarAssinaturasLoja=lista=>{ASSINATURAS_REF=lista;};
export function requisitoAcao(c,id){
 const clube=c.emprestimo?.destino||c.clubeNome,j=c.jornada||{};
 if(id==='treino-posicao'){const t=j.transicao;if(!(t?.restantes>0))return 'Sem troca de posição em andamento';if(t.treinoEspecifico)return 'Já usado nesta adaptação';}
 if(id==='mentor-tecnico'&&!assinaturaParaMentor(c,ASSINATURAS_REF))return 'Nenhuma assinatura em desenvolvimento';
 if(id==='acao-torcida'){if(c.emprestimo)return 'Indisponível durante empréstimo';if(c.flags?.acaoTorcidaAno===c.ano)return 'Já feita nesta temporada';}
 if(id==='advogado-contrato'){const k=c.contrato;if(!k||k.clube!==c.clubeNome||!k.papel)return 'Sem papel garantido no contrato';if(k.clausulaTempoJogo)return 'Cláusula já incluída';}
 return null;
}
/** Aplica uma ação de uso único sobre uma cópia já preparada do jogador. */
export function aplicarAcaoCarreira(c,id){
 const j=c.jornada=c.jornada||{},clube=c.emprestimo?.destino||c.clubeNome;
 if(id==='treino-posicao'){const t=j.transicao;t.treinoEspecifico=true;if(t.restantes>=2)t.restantes--;else t.penalidade=Math.floor((t.penalidade||0)/2);}
 if(id==='mentor-tecnico'){const s=assinaturaParaMentor(c,ASSINATURAS_REF);j.assinaturas=j.assinaturas||{};const a=j.assinaturas[s.id]||{anos:[]};j.assinaturas[s.id]={...a,mentor:1};}
 if(id==='acao-torcida'){c.flags=c.flags||{};c.flags.acaoTorcidaAno=c.ano;c.torcida=c.torcida||{};c.torcida[clube]=clamp(Math.round((c.torcida[clube]??30)+6),0,100);}
 if(id==='advogado-contrato')c.contrato={...c.contrato,clausulaTempoJogo:true};
 return c;
}

/** Item recomendado para cada alerta do perfil (próximos passos). */
const POR_ALERTA={'Moral baixa':['dep-mente'],'Torcida ainda desconfiada':['acao-torcida'],'Seleção à vista':['up-selecao'],'Último ano de contrato':['up-olheiro'],'Contrato no fim':['up-olheiro'],'Tempo de jogo abaixo do prometido':['advogado-contrato','up-olheiro'],'Pouco espaço no elenco':['up-olheiro'],'Adaptando-se à nova função':['treino-posicao'],'Hora de se reinventar?':['longevidade'],'Assinatura técnica disponível':[]};
/** Sugestões da loja para o momento: até 3 itens disponíveis (o saldo pode faltar). */
export function sugestoesDoMomento(c,catalogo,alertas=[],impedir){
 const proximoNivel=dep=>{const n=Math.max(0,...(c.investimentos||[]).filter(x=>x.startsWith(dep+'-')).map(x=>Number(x.split('-').at(-1))||0));return n<3?`${dep}-${n+1}`:null;};
 const ids=[];
 for(const a of alertas)for(const id of POR_ALERTA[a.titulo]||[])ids.push({id:id.startsWith('dep-')?proximoNivel(id):id,motivo:a.titulo});
 if((c.jornada?.transicao?.restantes>0))ids.push({id:'treino-posicao',motivo:'Adaptação à nova função'});
 if(ASSINATURAS_REF.length&&assinaturaParaMentor(c,ASSINATURAS_REF))ids.push({id:'mentor-tecnico',motivo:'Assinatura em desenvolvimento'});
 const vistos=new Set(),out=[];
 for(const x of ids){if(!x.id||vistos.has(x.id))continue;vistos.add(x.id);const item=catalogo.find(i=>i.id===x.id);if(!item)continue;const m=impedir(item);if(m&&m!=='Saldo insuficiente')continue;out.push({item,motivo:x.motivo});if(out.length===3)break;}
 return out;
}
