import {conectarElencoMundo,aplicarNegociacaoMundo,destinoDaVenda,jogadorDaGestao,converterGestaoEconomia,migrarEconomiaMundo,precoPedidoMundo,metadadosGestao} from '../simulacao/elencoUnificado.js';
import {VERSAO_ECONOMIA,valorMercadoEuro,salarioMensalEuro,verbaTransferenciasEuro} from '../simulacao/economia.js';
import {carreiraTecnicoEncerrada} from './longevidadeTecnico.js';
import { comissaoAtivaGestao, propostaComissaoTecnico } from './comissaoTecnico.js';
/* Base de gestão do treinador. Valores em € mil; salários por mês.
   O gerador é próprio, para não consumir a aleatoriedade da simulação existente. */
import { CLUBES, LIGAS } from '../dados/data.js';
import {sorteioTransferencia,escolherEstavel} from '../simulacao/transferenciasMundo.js';
import {diagnosticarElenco} from '../simulacao/profundidadeElenco.js';
import {nacionalidadeNovoAtletaLiga} from '../simulacao/nacionalidadesLiga.js';
import {gerarNomeRegional} from '../simulacao/nomesRegionais.js';
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));
const mediaElenco=g=>g.elenco.reduce((n,j)=>n+j.qualidade,0)/Math.max(1,g.elenco.length);
const NOMES=['André','Bruno','Caio','Daniel','Eduardo','Felipe','Gabriel','Henrique','Igor','João','Lucas','Matheus'];
const SOBRENOMES=['Almeida','Barbosa','Costa','Dias','Esteves','Ferreira','Gomes','Lima','Mendes','Oliveira','Pereira','Silva'];
export const SETORES_ELENCO = [{id:'GOL',nome:'Goleiros',quantidade:3},{id:'DEF',nome:'Defesa',quantidade:8},{id:'MEI',nome:'Meio-campo',quantidade:8},{id:'ATA',nome:'Ataque',quantidade:5}];
function gerador(semente){
 let n=2166136261;for(const c of String(semente))n=Math.imul(n^c.charCodeAt(0),16777619);
 return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
}
const ligaDoClube=(clube,liga)=>liga||CLUBES.find(c=>c.nome===clube)?.liga;
/** Recalcula salário e valor (€ mil) de um atleta da gestão na liga do clube. */
const comFinancas=(j,liga)=>({...j,salario:salarioMensalEuro({...j,liga}),valor:valorMercadoEuro({...j,liga})});
function jogador(rng,id,setor,forca,liga){
 const idade=18+Math.floor(rng()*17);
 const qualidade=limitar(Math.round(forca-7+rng()*14),30,95);
 return comFinancas({id,nome:`${NOMES[Math.floor(rng()*NOMES.length)]} ${SOBRENOMES[Math.floor(rng()*SOBRENOMES.length)]}`,setor,idade,qualidade,
  potencial:limitar(qualidade+Math.max(0,28-idade)+Math.floor(rng()*5),qualidade,99),
  contrato:1+Math.floor(rng()*4),origem:'elenco'},liga);
}
/** Aplica cada virada uma única vez. O ano processado acompanha o save. */
export function atualizarGestaoAnual(gestao, anoAlvo){
 const g=structuredClone(gestao);
 if(!Number.isInteger(anoAlvo)||!Number.isInteger(g.ano)||anoAlvo<=g.ano)return g;
 if(anoAlvo-g.ano>40)throw new Error('Intervalo de gestão inválido.');
 for(let ano=g.ano+1;ano<=anoAlvo;ano++){
  const equipe=comissaoAtivaGestao(g);
  const treino=equipe.some(p=>p.id==='preparador')?1:0;
  const observacao=equipe.some(p=>p.id==='olheiro')?2:0;
  if(g.cadastroUnificado)g.bonusBase=observacao;
  if(!g.cadastroUnificado){
  const expirados=g.elenco.filter(j=>j.contrato<=1);
  const base=g.elenco.reduce((n,j)=>n+j.qualidade,0)/Math.max(1,g.elenco.length);
  // A estrutura do clube sustenta a base mesmo após saídas de contrato.
  const referenciaBase=Math.max(base,g.forcaMercado ?? base);
  g.elenco=g.elenco.filter(j=>j.contrato>1).map(j=>{
   const idade=j.idade+1;
   const qualidade=limitar(j.qualidade+(idade<24?1:idade>32?-1:0)+(idade<30?treino:0),30,j.potencial);
   const novo={...j,idade,qualidade,contrato:j.contrato-1};
   return {...novo,valor:valorMercadoEuro({...novo,liga:ligaDoClube(g.clube,g.liga)})};
  });
  for(const j of expirados)g.movimentos.push({tipo:'fim-contrato',jogador:j.id,nome:j.nome,valor:0,ano});
  const rng=gerador(`${g.clube}|${ano}|reposicao-v1`);
  for(const setor of SETORES_ELENCO){
   const faltam=Math.max(0,setor.quantidade-g.elenco.filter(j=>j.setor===setor.id).length);
   for(let i=0;i<faltam;i++){
    let jovem=jogador(rng,`${g.clube}:base:${ano}:${setor.id}:${i}`,setor.id,Math.max(30,referenciaBase-7));
    jovem.idade=18+Math.floor(rng()*3);jovem.contrato=3;jovem.origem='base';
    jovem.qualidade=Math.min(95,jovem.qualidade+observacao);
    jovem.potencial=Math.min(99,jovem.qualidade+10);
    jovem=comFinancas(jovem,ligaDoClube(g.clube,g.liga));g.elenco.push(jovem);
    g.movimentos.push({tipo:'base',jogador:jovem.id,nome:jovem.nome,valor:0,ano});
   }
  }
  }
  const aporte=Math.round(g.orcamentoInicial*.7);
  const saldo=g.saldo+Math.min(aporte,Math.max(0,g.orcamentoInicial*2-g.saldo));
  g.movimentos.push({tipo:'verba',valor:saldo-g.saldo,ano});g.saldo=saldo;
  g.tetoSalarial=Math.max(g.tetoSalarial,Math.ceil(g.elenco.reduce((n,j)=>n+j.salario,0)*1.25));
  for(const p of equipe)g.movimentos.push({tipo:'fim-comissao',cargo:p.id,valor:0,ano});
  if(g.comissao)g.comissao=[];
  g.ano=ano;
 }
 return g;
}
export function criarGestaoTecnico(t){
 if(!t?.clube)throw new Error('Escolha um clube antes de administrar o elenco.');
 if(t.gestao?.versao===1&&t.gestao.clube===t.clube){
  // Saves da economia antiga (R$ mil) são convertidos para euros uma única vez.
  const liga=ligaDoClube(t.clube,t.liga);
  let salva=t.gestao;
  if(salva.economia!==VERSAO_ECONOMIA){
   const elenco=salva.cadastroUnificado?salva.elenco:salva.elenco.map(j=>comFinancas(j,liga));
   salva={...converterGestaoEconomia(salva,salva.elenco.map(j=>({...j,liga})),liga),elenco};
  }
  const g=t.fase==='pretemporada'?atualizarGestaoAnual({...salva,liga},t.ano):structuredClone({...salva,liga});
  g.forcaMercado ??= Number(t.elenco)||50;g.forcaReferencia ??= g.forcaMercado;return g;
 }
 const forca=limitar(Number(t.elenco)||CLUBES.find(c=>c.nome===t.clube)?.forca||50,30,95);
 const liga=ligaDoClube(t.clube,t.liga);
 const rng=gerador(`${t.clube}|${t.ano}|gestao-v1`);const elenco=[];
 for(const setor of SETORES_ELENCO)for(let i=0;i<setor.quantidade;i++)elenco.push(jogador(rng,`${t.clube}:${setor.id}:${i}`,setor.id,forca,liga));
 const folha=elenco.reduce((n,j)=>n+j.salario,0),verba=verbaTransferenciasEuro(elenco);
 return {versao:1,economia:VERSAO_ECONOMIA,clube:t.clube,liga,ano:t.ano,forcaReferencia:forca,forcaMercado:forca,orcamentoInicial:verba,saldo:verba,tetoSalarial:Math.ceil(folha*1.25),elenco,movimentos:[]};
}
export function resumoGestaoTecnico(g){
 const setores=SETORES_ELENCO.map(s=>{const jogadores=g.elenco.filter(j=>j.setor===s.id);return {...s,jogadores:jogadores.length,media:jogadores.length?Math.round(jogadores.reduce((n,j)=>n+j.qualidade,0)/jogadores.length):0};});
 const folhaJogadores=g.elenco.reduce((n,j)=>n+j.salario,0);
 const folhaComissao=comissaoAtivaGestao(g).reduce((n,p)=>n+p.salario,0);
 const folha=folhaJogadores+folhaComissao;
 return {folhaJogadores,folhaComissao,setores,jogadores:g.elenco.length,folha,tetoSalarial:g.tetoSalarial,espacoSalarial:g.tetoSalarial-folha,saldo:g.saldo};
}
export function gerarMercadoTecnico(t){
 const g=criarGestaoTecnico(t);if(g.cadastroUnificado)return g.mercado||[];const rng=gerador(`${g.clube}|${g.ano}|mercado-v1`);
 return SETORES_ELENCO.flatMap(s=>Array.from({length:3},(_,i)=>({...jogador(rng,`mercado:${g.clube}:${g.ano}:${s.id}:${i}`,s.id,g.forcaMercado,g.liga),origem:'mercado'}))).filter(j=>!g.movimentos.some(m=>m.ano===g.ano&&m.jogador===j.id&&(m.tipo==='compra'||m.tipo==='venda')));
}
/** Elencos reais do cadastro; a consulta não cria atletas nem altera o save. */
export function elencoClubeTecnico(c,clube){
 const g=c.tecnico?.gestao;
 if(clube===g?.clube)return g.elenco;
 return (c.mundo?.jogadores||[]).filter(p=>!p.aposentado&&(p.clubeNome||'')===clube).map(p=>({...jogadorDaGestao(p),id:p.id,clubeVendedor:p.clubeNome||null,...precoPedidoMundo(c.mundo,p,g?.forcaMercado),origem:'mercado'}));
}
function alvoContratacao(c,g,id){
 if(!g.cadastroUnificado)return gerarMercadoTecnico(c.tecnico).find(j=>j.id===id);
 const p=c.mundo?.jogadores.find(p=>!p.aposentado&&p.clubeNome!==g.clube&&String(p.id)===String(id));
 if(!p||p.emprestimo||g.movimentos.some(m=>m.ano===g.ano&&['compra','venda','emprestimo-entrada'].includes(m.tipo)&&String(m.mundoId??m.jogador)===String(p.id)))return null;
 return {...jogadorDaGestao(p),id:p.id,clubeVendedor:p.clubeNome||null,...precoPedidoMundo(c.mundo,p,g.forcaMercado),origem:'mercado'};
}
function validarJanela(t){
 if(!t?.clube||t.demitido||t.desempregado)throw new Error('Você precisa estar empregado para administrar o elenco.');
 if(t.fase!=='pretemporada'||t.andamento?.jogos||t.andamento?.rodadas||t.copasEmJogo||t.temporadaPausada)throw new Error('Negociações disponíveis apenas antes do início da temporada.');
 if(carreiraTecnicoEncerrada(t))throw new Error('A carreira de treinador já foi encerrada.');
}
export function contratarJogadorTecnico(c,id){
 c=prepararGestaoTecnico(c);
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 if(g.elenco.some(j=>j.id===id))throw new Error('Esse jogador já está no elenco.');
 const alvo=alvoContratacao(c,g,id);if(!alvo)throw new Error('Jogador indisponível no mercado.');
 if(alvo.negociavel===false)throw new Error(`O ${alvo.clubeVendedor} não negocia um titular com um clube de menor porte.`);
 if(g.elenco.length>=30)throw new Error('O elenco já tem 30 jogadores.');
 if(g.saldo<alvo.valor)throw new Error('Orçamento insuficiente para esta contratação.');
 if(resumoGestaoTecnico(g).folha+alvo.salario>g.tetoSalarial)throw new Error('A contratação ultrapassa o teto salarial.');
 const gestao={...g,saldo:g.saldo-alvo.valor,elenco:[...g.elenco,{...alvo,contrato:3}],movimentos:[...g.movimentos,{tipo:'compra',jogador:id,mundoId:alvo.mundoId,nome:alvo.nome,valor:alvo.valor,moeda:'EUR',ano:g.ano}]};
 return aplicarNegociacaoMundo(c,gestao,{tipo:'compra',alvo});
}
export function venderJogadorTecnico(c,id){
 c=prepararGestaoTecnico(c);
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);const alvo=g.elenco.find(j=>j.id===id);
 if(!alvo)throw new Error('Jogador não encontrado no elenco.');
 if(alvo.emprestimo)throw new Error('Atleta emprestado: ele volta ao clube dono ao fim da temporada.');
 const minimo={GOL:2,DEF:4,MEI:4,ATA:2};
 if(g.elenco.filter(j=>j.setor===alvo.setor).length<=minimo[alvo.setor])throw new Error('A venda deixaria o setor sem jogadores suficientes.');
 const valor=Math.round(alvo.valor*.8);
 const destino=g.cadastroUnificado?destinoDaVenda(c,alvo):null;
 const gestao={...g,saldo:g.saldo+valor,elenco:g.elenco.filter(j=>j.id!==id),movimentos:[...g.movimentos,{tipo:'venda',jogador:id,mundoId:alvo.mundoId,nome:alvo.nome,valor,moeda:'EUR',ano:g.ano,...(destino?{destino:destino.nome}:{})}]};
 return aplicarNegociacaoMundo(c,gestao,{tipo:'venda',alvo,destino});
}

/** Proposta exibida na confirmação; valores em € mil. */
export function propostaRenovacaoTecnico(j,anos=3){
 if(!Number.isInteger(anos)||anos<1||anos>5)throw new Error('Escolha um contrato de 1 a 5 anos.');
 const salario=Math.ceil(j.salario*1.1);
 return {salario,luvas:salario*2,contrato:anos};
}
export function renovarJogadorTecnico(c,id,anos=3){
 c=prepararGestaoTecnico(c);
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 const alvo=g.elenco.find(j=>j.id===id);
 if(!alvo)throw new Error('Jogador não encontrado no elenco.');
 if(alvo.contrato>2)throw new Error('A renovação fica disponível nos últimos dois anos de contrato.');
 if(g.movimentos.some(m=>m.tipo==='renovacao'&&m.jogador===id&&m.ano===g.ano))throw new Error('Esse contrato já foi renovado nesta janela.');
 const proposta=propostaRenovacaoTecnico(alvo,anos);
 if(g.saldo<proposta.luvas)throw new Error('Orçamento insuficiente para pagar as luvas.');
 if(resumoGestaoTecnico(g).folha-alvo.salario+proposta.salario>g.tetoSalarial)throw new Error('A renovação ultrapassa o teto salarial.');
 const gestao={...g,saldo:g.saldo-proposta.luvas,
  elenco:g.elenco.map(j=>j.id===id?{...j,salario:proposta.salario,contrato:proposta.contrato}:j),
  movimentos:[...g.movimentos,{tipo:'renovacao',jogador:id,nome:alvo.nome,valor:proposta.luvas,moeda:'EUR',salario:proposta.salario,contrato:proposta.contrato,ano:g.ano}]};
 return aplicarNegociacaoMundo(c,gestao,{tipo:'renovacao',alvo});
}

export function contratarComissaoTecnico(c,id){
 c=prepararGestaoTecnico(c);
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 const ativos=comissaoAtivaGestao(g),proposta=propostaComissaoTecnico(g,id);
 if(ativos.some(p=>p.id===id))throw new Error('Este cargo já está contratado nesta temporada.');
 if(g.saldo<proposta.custo)throw new Error('Orçamento insuficiente para o contrato da comissão.');
 if(resumoGestaoTecnico(g).folha+proposta.salario>g.tetoSalarial)throw new Error('A contratação ultrapassa o teto salarial.');
 const gestao={...g,saldo:g.saldo-proposta.custo,
  comissao:[...ativos,{id,ano:g.ano,salario:proposta.salario,custo:proposta.custo}],
  movimentos:[...g.movimentos,{tipo:'comissao',cargo:id,nome:proposta.nome,valor:proposta.custo,moeda:'EUR',ano:g.ano}]};
 return aplicarNegociacaoMundo(c,gestao);
}

/** Materializa saves antigos sem recriar a gestão a cada acesso. */
export function prepararGestaoTecnico(c){
 const t=c?.tecnico;
 if(!t?.clube||t.tipoEquipe==='selecao'||t.demitido||t.desempregado||t.fase!=='pretemporada')return c;
 if(c.mundo?.jogadores&&c.mundo.economia!==VERSAO_ECONOMIA)c={...c,mundo:migrarEconomiaMundo(c.mundo)};
 const salva=c.mundo?.gestoesClubes?.[t.clube];
 const referencia=salva&&t.gestao?.clube!==t.clube?{...t,gestao:{...salva,elenco:c.mundo.jogadores.filter(p=>!p.aposentado&&p.clubeNome===t.clube).map(p=>jogadorDaGestao(p))}}:t;
 const gestao=criarGestaoTecnico(referencia);
 if(c.mundo&&!salva&&(!t.gestao?.cadastroUnificado||t.gestao.clube!==t.clube))gestao.saldo+=c.mundo.receitasMercado?.[t.clube]||0;
 const virada=t.gestao?.versao===1&&t.gestao.clube===t.clube&&gestao.ano>t.gestao.ano;
 const delta=virada?mediaElenco(gestao)-mediaElenco(t.gestao):0;
 gestao.ajusteNumerico=t.gestao?.clube===t.clube?(t.gestao.ajusteNumerico||0)+delta:0;
 if(salva&&t.gestao?.clube!==t.clube)gestao.forcaReferencia=Number(t.elenco)||gestao.forcaReferencia;
 const novo={...c,tecnico:{...t,gestao,elenco:limitar((Number(t.elenco)||50)+delta,10,95)}};
 if(!c.mundo?.jogadores)return novo;
 const legado=!!t.gestao&&!t.gestao.cadastroUnificado&&t.gestao.clube===t.clube;
 let unido=conectarElencoMundo(novo,gestao,{legado});
 const g=unido.tecnico.gestao;
 if(g.baseIntegradaAno!==g.ano){
  const rng=gerador(`${g.clube}|${g.ano}|base-unificada`),novos=[];
  // Só promove atletas para cobrir carências reais por posição (22 vagas
  // mínimas), nunca para deixar todo elenco artificialmente em 24 ou 30.
  if(!legado){
   const faltantes=diagnosticarElenco(unido.mundo.jogadores,
     {clubeNome:g.clube,contarSecundarias:true}).faltantes;
   const liga=t.liga||CLUBES.find(cl=>cl.nome===g.clube)?.liga;
   for(const [posicao,quantidade] of Object.entries(faltantes)){
    const setor=posicao==='GOL'?'GOL':['LD','LE','ZAG'].includes(posicao)?'DEF':
     ['VOL','MC','MEI'].includes(posicao)?'MEI':'ATA';
    for(let i=0;i<quantidade;i++){
     const jovem=jogador(rng,`base:${g.clube}:${g.ano}:${posicao}:${i}`,setor,Math.max(30,g.forcaMercado-7),liga);
     const nac=nacionalidadeNovoAtletaLiga(liga,rng);
     jovem.qualidade=Math.min(95,jovem.qualidade+(g.bonusBase||0));
     const potencialJovem=Math.min(99,jovem.qualidade+10);
     const financas={qualidade:jovem.qualidade,idade:18,potencial:potencialJovem,contrato:3,liga};
     jovem.salario=salarioMensalEuro(financas);
     novos.push({...jovem,nome:gerarNomeRegional(nac,rng),idade:18,economia:VERSAO_ECONOMIA,
      potencial:potencialJovem,valor:valorMercadoEuro(financas),
      ovr:jovem.qualidade,posicao,nac,clubeNome:g.clube,clubeOrigem:g.clube,
      liga,picoIdade:28,contrato:3,origem:'base',aposentado:false,
      jogos:0,gols:0,assist:0,carreira:{jogos:0,gols:0,assist:0,temporadas:0}});
    }
   }
  }
  const elenco=[...g.elenco,...novos.map(p=>jogadorDaGestao(p))],atual={...g,elenco,baseIntegradaAno:g.ano,...(!legado&&!salva&&(!t.gestao?.cadastroUnificado||t.gestao.clube!==t.clube)?{tetoSalarial:Math.ceil(elenco.reduce((n,j)=>n+j.salario,0)*1.25)}:{})};
  unido=conectarElencoMundo({...unido,mundo:{...unido.mundo,jogadores:[...unido.mundo.jogadores,...novos]}},atual);
 }
 return sincronizarOfertasTecnico(unido);
}
/* ===================== OFERTAS E EMPRÉSTIMOS =====================
   Inspirado no Football Manager: na janela da pré-temporada, clubes que podem
   pagar e precisam do perfil fazem propostas pelos seus atletas. Colocar um
   jogador na lista de transferências atrai mais ofertas, mas com valores menores.
   Decisões estáveis por janela: recarregar o jogo não sorteia de novo. */
const MINIMO_SETOR={GOL:2,DEF:4,MEI:4,ATA:2};
const idAtleta=j=>String(j.mundoId??j.id);
const ligaAtual=(t,nome,padrao)=>t.ligasMundo?.[nome]||padrao;

/** Propostas da IA pelos atletas do elenco nesta janela (sem status). */
export function gerarOfertasTecnico(c){
 const t=c.tecnico,g=t?.gestao;
 if(!g?.cadastroUnificado||!c.mundo?.jogadores||t.tipoEquipe==='selecao')return [];
 const listados=new Set((g.listaTransferencia||[]).map(String));
 const media=g.elenco.reduce((n,j)=>n+j.qualidade,0)/Math.max(1,g.elenco.length);
 const ocupacao=new Map();for(const p of c.mundo.jogadores)if(!p.aposentado&&p.clubeNome)ocupacao.set(p.clubeNome,(ocupacao.get(p.clubeNome)||0)+1);
 const forcaClube=Number(t.elenco)||g.forcaMercado||60;
 const caixa=cl=>c.mundo.caixaClubes?.[cl.nome]??Math.round(valorMercadoEuro({ovr:cl.forca,idade:26,liga:cl.liga,contrato:3})*25*.2);
 const ofertas=[];
 for(const j of g.elenco){
  if(j.emprestimo)continue;
  const id=idAtleta(j),listado=listados.has(id);
  const destaque=Math.max(0,Math.min(.25,(j.qualidade-media)*.03));
  const promessa=j.idade<=23&&(j.potencial??j.qualidade)-j.qualidade>=6?.08:0;
  if(sorteioTransferencia(g.ano,g.clube,id,'interesse')>=(listado?.9:.1+destaque+promessa))continue;
  const jovemSemEspaco=j.idade<=22&&j.qualidade<media-2;
  const emprestimo=jovemSemEspaco&&sorteioTransferencia(g.ano,g.clube,id,'tipo')<.6;
  const candidatos=CLUBES.map(cl=>({...cl,liga:ligaAtual(t,cl.nome,cl.liga)})).filter(cl=>cl.nome!==g.clube&&!LIGAS[cl.liga]?.naoJogavel&&(ocupacao.get(cl.nome)||0)<30&&(emprestimo
   ?cl.forca<=forcaClube-3&&cl.forca>=j.qualidade-6
   :cl.forca>=j.qualidade-10&&cl.forca<=j.qualidade+8&&caixa(cl)*.6>=j.valor*.7));
  for(let n=0;n<(listado?2:1)&&candidatos.length;n++){
   const cl=escolherEstavel(candidatos,g.ano,id,'clube',n);candidatos.splice(candidatos.indexOf(cl),1);
   const s=sorteioTransferencia(g.ano,id,cl.nome,'valor');
   // Sondagens espontâneas pagam ágio para convencer; atletas listados atraem ofertas abaixo do valor.
   const valor=emprestimo?0:Math.min(Math.floor(caixa(cl)*.6),Math.round(j.valor*(listado?.7+.3*s:.95+.35*s)));
   ofertas.push({id:`${g.ano}|${id}|${cl.nome}`,mundoId:id,nome:j.nome,setor:j.setor,idade:j.idade,qualidade:j.qualidade,
    clube:cl.nome,liga:cl.liga,tipo:emprestimo?'emprestimo':'definitiva',valor,valorMercado:j.valor,
    ...(emprestimo?{salarioPago:sorteioTransferencia(g.ano,id,cl.nome,'salario')<.5?100:50}:{}),status:'pendente'});
  }
 }
 return ofertas.sort((a,b)=>b.valor-a.valor||a.nome.localeCompare(b.nome,'pt-BR')).slice(0,12);
}
/** Mantém decisões já tomadas e acrescenta novas ofertas da mesma janela. */
export function sincronizarOfertasTecnico(c,{apenas=null}={}){
 const t=c?.tecnico,g=t?.gestao;
 if(!g?.cadastroUnificado||t.fase!=='pretemporada')return c;
 // As propostas espontâneas chegam uma vez por janela; depois, só listar um atleta atrai novas.
 if(g.ofertas?.ano===g.ano&&!apenas)return c;
 const atuais=g.ofertas?.ano===g.ano?g.ofertas.itens:[];
 const novas=gerarOfertasTecnico(c).filter(o=>!atuais.some(a=>a.id===o.id)&&(!apenas||String(o.mundoId)===String(apenas)));
 if(!novas.length&&g.ofertas?.ano===g.ano)return c;
 return comGestao(c,{...g,ofertas:{ano:g.ano,itens:[...atuais,...novas]}});
}
/** Ofertas que ainda podem ser respondidas: atleta no elenco e proposta em aberto. */
export function ofertasPendentesTecnico(g){
 if(!g?.ofertas||g.ofertas.ano!==g.ano)return [];
 const ids=new Set(g.elenco.map(idAtleta));
 return g.ofertas.itens.filter(o=>o.status==='pendente'&&ids.has(String(o.mundoId)));
}
/** Atualiza a gestão do técnico e a cópia guardada no mundo. */
const comGestao=(c,g)=>({...c,tecnico:{...c.tecnico,gestao:g},...(c.mundo?.gestoesClubes?.[g.clube]?{mundo:{...c.mundo,gestoesClubes:{...c.mundo.gestoesClubes,[g.clube]:metadadosGestao(g)}}}:{})});
const comOferta=(g,id,mudar)=>({...g,ofertas:{...g.ofertas,itens:g.ofertas.itens.map(o=>o.id===id?mudar(o):o)}});

/** Coloca ou tira o atleta da lista de transferências (atrai ofertas nesta janela). */
export function alternarListaTecnico(c,id){
 c=prepararGestaoTecnico(c);const t=c.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 const j=g.elenco.find(x=>idAtleta(x)===String(id)||x.id===id);if(!j)throw new Error('Jogador não encontrado no elenco.');
 if(j.emprestimo)throw new Error('Atleta emprestado não pode ser listado.');
 const lista=new Set((g.listaTransferencia||[]).map(String)),chaveJ=idAtleta(j);
 if(lista.has(chaveJ))lista.delete(chaveJ);else lista.add(chaveJ);
 return lista.has(chaveJ)?sincronizarOfertasTecnico(comGestao(c,{...g,listaTransferencia:[...lista]}),{apenas:chaveJ}):comGestao(c,{...g,listaTransferencia:[...lista]});
}

/** Aceitar, recusar ou contrapropor (pedido de +15% ou +30%) uma oferta. */
export function responderOfertaTecnico(c,idOferta,acao,pedido=1.15){
 c=prepararGestaoTecnico(c);const t=c.tecnico;validarJanela(t);let g=criarGestaoTecnico(t);
 const o=ofertasPendentesTecnico(g).find(x=>x.id===idOferta);if(!o)throw new Error('Esta oferta não está mais disponível.');
 if(acao==='recusar'){g=comOferta(g,o.id,x=>({...x,status:'recusada'}));return aplicarNegociacaoMundo(c,g);}
 if(acao==='contraproposta'){
  if(o.tipo!=='definitiva')throw new Error('Empréstimos não aceitam contraproposta de valor.');
  if(o.contraproposta)throw new Error('O clube já respondeu à sua contraproposta.');
  const fator=pedido>=1.3?1.3:1.15,listado=(g.listaTransferencia||[]).map(String).includes(String(o.mundoId));
  const aceita=sorteioTransferencia(g.ano,o.id,'contraproposta',fator)<(fator>=1.3?.3:.6)-(listado?.15:0);
  g=comOferta(g,o.id,x=>aceita?{...x,valor:Math.round(x.valor*fator),contraproposta:'aceita'}:{...x,status:'retirada',contraproposta:'recusada'});
  return {...aplicarNegociacaoMundo(c,g),respostaOferta:aceita?'aceita':'recusada'};
 }
 if(acao!=='aceitar')throw new Error('Resposta inválida.');
 const j=g.elenco.find(x=>idAtleta(x)===String(o.mundoId));
 if(!j)throw new Error('Jogador não encontrado no elenco.');
 if(g.elenco.filter(x=>x.setor===j.setor).length<=MINIMO_SETOR[j.setor])throw new Error('A saída deixaria o setor sem jogadores suficientes.');
 const base=CLUBES.find(cl=>cl.nome===o.clube);if(!base)throw new Error('Clube da proposta não encontrado.');
 const destino={...base,liga:ligaAtual(t,base.nome,base.liga),dispensarIds:[]};
 const definitiva=o.tipo==='definitiva';
 g=comOferta(g,o.id,x=>({...x,status:'aceita'}));
 g={...g,ofertas:{...g.ofertas,itens:g.ofertas.itens.map(x=>x.status==='pendente'&&String(x.mundoId)===String(o.mundoId)?{...x,status:'encerrada'}:x)},
  listaTransferencia:(g.listaTransferencia||[]).filter(x=>String(x)!==String(o.mundoId)),
  saldo:g.saldo+(definitiva?o.valor:0),elenco:g.elenco.filter(x=>x!==j),
  movimentos:[...g.movimentos,{tipo:definitiva?'venda':'emprestimo-saida',jogador:j.id,mundoId:j.mundoId,nome:j.nome,valor:definitiva?o.valor:0,moeda:'EUR',ano:g.ano,destino:o.clube}]};
 return aplicarNegociacaoMundo(c,g,{tipo:definitiva?'venda':'emprestimo-saida',alvo:j,destino,valor:definitiva?o.valor:0});
}

/** Pede por empréstimo um jovem fora do time titular de outro clube (sem taxa; o salário entra na folha). */
export function pedirEmprestimoTecnico(c,id){
 c=prepararGestaoTecnico(c);const t=c.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 if(!g.cadastroUnificado)throw new Error('Empréstimos exigem o cadastro unificado do mundo.');
 const alvo=alvoContratacao(c,g,id);if(!alvo)throw new Error('Jogador indisponível no mercado.');
 if(!alvo.emprestavel)throw new Error('O clube só empresta jovens que não são titulares.');
 if(g.elenco.length>=30)throw new Error('O elenco já tem 30 jogadores.');
 if(resumoGestaoTecnico(g).folha+alvo.salario>g.tetoSalarial)throw new Error('O empréstimo ultrapassa o teto salarial.');
 const gestao={...g,elenco:[...g.elenco,{...alvo,emprestimo:{dono:alvo.clubeVendedor}}],
  movimentos:[...g.movimentos,{tipo:'emprestimo-entrada',jogador:id,mundoId:alvo.mundoId,nome:alvo.nome,valor:0,moeda:'EUR',ano:g.ano,origem:alvo.clubeVendedor}]};
 return aplicarNegociacaoMundo(c,gestao,{tipo:'emprestimo-entrada',alvo});
}

export function negociarElencoTecnico(c,tipo,id,anos=3){
 try {
  const extras={lista:()=>alternarListaTecnico(c,id),emprestimo:()=>pedirEmprestimoTecnico(c,id),
   'oferta-aceitar':()=>responderOfertaTecnico(c,id,'aceitar'),'oferta-recusar':()=>responderOfertaTecnico(c,id,'recusar'),
   'oferta-contra':()=>responderOfertaTecnico(c,id,'contraproposta',anos)};
  if(!['compra','venda','renovacao','comissao',...Object.keys(extras)].includes(tipo))throw new Error('Operação inválida.');
  const {respostaOferta,...novo}=extras[tipo]?extras[tipo]():tipo==='compra'?contratarJogadorTecnico(c,id):tipo==='venda'?venderJogadorTecnico(c,id):tipo==='comissao'?contratarComissaoTecnico(c,id):renovarJogadorTecnico(c,id,anos);
  const listado=tipo==='lista'&&(novo.tecnico.gestao.listaTransferencia||[]).map(String).includes(String(id));
  const textos={compra:'Contratação concluída.',venda:'Venda concluída.',comissao:'Comissão contratada.',renovacao:'Contrato renovado.',
   lista:listado?'Jogador colocado na lista de transferências. Veja as ofertas recebidas.':'Jogador retirado da lista de transferências.',
   emprestimo:'Empréstimo acertado até o fim da temporada.','oferta-aceitar':'Negócio fechado.','oferta-recusar':'Oferta recusada.',
   'oferta-contra':respostaOferta==='aceita'?'O clube aceitou sua contraproposta. Confirme para fechar o negócio.':'O clube recusou a contraproposta e retirou a oferta.'};
  const delta=mediaElenco(novo.tecnico.gestao)-mediaElenco(criarGestaoTecnico(c.tecnico));
  novo.tecnico.gestao.ajusteNumerico=(c.tecnico.gestao?.ajusteNumerico||0)+delta;
  return {...novo,tecnico:{...novo.tecnico,elenco:limitar((Number(c.tecnico.elenco)||50)+delta,10,95),avisoGestao:{texto:textos[tipo],erro:false}}};
 } catch(erro){return {...c,tecnico:{...c.tecnico,avisoGestao:{texto:erro.message,erro:true}}};}
}
