import {CLASSICOS} from './data.js';
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));
const hash=s=>[...s].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619)>>>0,2166136261);
export const formatarVerbaRapida=n=>n>=1000?`R$ ${(n/1000).toLocaleString('pt-BR',{maximumFractionDigits:2})} mi`:`R$ ${n.toLocaleString('pt-BR')} mil`;
const dinheiro=formatarVerbaRapida;
export const verbaPretemporada=t=>t.verbaRapida??limitar((!t.modoTreinadorRapido&&t.gestao?.clube===t.clube?t.gestao.saldo:undefined)??Math.round(((t.elenco||50)-25)**2*2),500,5000);
export const renovarVerbaPretemporada=t=>{const saldo=verbaPretemporada(t);return saldo+Math.min(350,Math.max(0,6000-saldo));};
const rivalDe=t=>{const clubes=[...new Set(CLASSICOS.filter(par=>Array.isArray(par)&&par.includes(t.clube)).flat().filter(n=>n!==t.clube))];return clubes[hash(`${t.clube}|${t.ano}|rival`)%clubes.length];};
const ids=['craque-jovem','esquema','venda-base','rival','veterano','preparacao','capitao','diretoria','emprestimo','renovacao'];
export function planoPretemporadaRapida(t,quantidade=1){
 if(t.planoRapido?.ano===t.ano&&t.planoRapido.clube===t.clube)return t.planoRapido;
 const recentes=new Set((t.historicoRapido||[]).slice(-4));
 const elegiveis=ids.filter(id=>(id!=='rival'||rivalDe(t))&&!recentes.has(id));
 const ordem=elegiveis.sort((a,b)=>hash(`${t.clube}|${t.ano}|${a}`)-hash(`${t.clube}|${t.ano}|${b}`));
 return {ano:t.ano,clube:t.clube,cartas:ordem.slice(0,limitar(quantidade,1,2)),respostas:[]};
}
export function cartaPretemporadaRapida(t,quantidade=1){
 const plano=planoPretemporadaRapida(t,quantidade),indice=plano.respostas.length,id=plano.cartas[indice];
 if(!id)return null;
 const nivel=limitar(Math.round(t.elenco||50),30,90),craque=Math.min(95,nivel+10),jovem=Math.min(90,nivel+2),custo=Math.round(craque*craque/6),rival=rivalDe(t);
 const nomes=['Diego Moura','Caio Andrade','Rafael Tavares','Bruno Sales','Lucas Freitas','André Rocha'];
 const jogador=nomes[hash(`${t.clube}|${t.ano}|jogador`)%nomes.length];
 const op=(id,nome,descricao,efeitos={},custo=0,futuro={})=>({id,nome,descricao,efeitos,custo,futuro});
 const manter=op('manter','Manter o grupo','Sem gasto. Moral +2.',{moral:2});
 const cartas={
  'craque-jovem':{titulo:'Um craque agora ou uma promessa?',texto:'A diretoria libera uma contratação. Qual é sua aposta?',opcoes:[op('craque',`${jogador} · nível ${craque}`,`Craque de 29 anos. Time +5 agora.`,{elenco:5},custo),op('jovem',`Aposta jovem · nível ${jovem}`,`19 anos, potencial ${Math.min(99,jovem+12)}. Time +2 agora e +3 no próximo ano.`,{elenco:2},Math.round(custo*.4),{elenco:3}),manter]},
  esquema:{titulo:'Qual será a cara do time?',texto:'Escolha o plano que será usado na temporada.',opcoes:[{...op('atacar','4-3-3 · atacar','Mais gols, menos empates e maior risco contra times fortes.'),formacao:'4-3-3',estilo:'ofensivo'},{...op('proteger','3-5-2 · proteger','Menos gols e mais empates. Ajuda a resistir a adversários superiores.'),formacao:'3-5-2',estilo:'defensivo'},{...op('equilibrar','4-4-2 · equilíbrio','Mantenha um time equilibrado, sem custo.'),formacao:'4-4-2',estilo:'equilibrado'}]},
  'venda-base':{titulo:'Uma oferta pelo garoto da base',texto:'Um clube quer levar sua promessa de 19 anos. Vender fortalece o caixa, mas reduz as opções em campo.',opcoes:[op('vender',`Vender por ${dinheiro(900)}`,'Verba +R$ 900 mil. Time −3 nesta temporada.',{elenco:-3},-900),op('segurar',`Segurar o garoto · nível ${jovem}`,'Time +1 agora e +2 no próximo ano.',{elenco:1},0,{elenco:2})]},
  rival:{titulo:'Uma oportunidade no rival',texto:`${jogador} quer sair do ${rival}. A contratação pode ajudar em campo e agitar a torcida. Jogador fictício.`,opcoes:[op('contratar',`Trazer ${jogador} · nível ${Math.min(95,nivel+7)}`,'Time +4 e torcida +5. A chegada exige ajuste no vestiário: moral −2.',{elenco:4,torcida:5,moral:-2},Math.round(custo*.7)),manter]},
  veterano:{titulo:'Experiência para decidir jogos?',texto:'Um veterano de 34 anos está livre no mercado.',opcoes:[op('veterano',`${jogador} · nível ${Math.min(95,nivel+5)}`,'Time +4 e moral +2 agora. No próximo ano, time −2.',{elenco:4,moral:2},Math.round(custo*.3),{elenco:-2}),op('base','Dar espaço à base','Time +1 agora e +2 no próximo ano.',{elenco:1},0,{elenco:2})]},
  preparacao:{titulo:'Como preparar a temporada?',texto:'O grupo precisa de uma prioridade antes da estreia.',opcoes:[op('intenso','Preparação intensa','Time +3, moral −3.',{elenco:3,moral:-3},250),op('leve','Preparação leve','Moral +6. Sem custo.',{moral:6})]},
  capitao:{titulo:'Quem lidera o vestiário?',texto:'Um jovem está ganhando espaço, mas o capitão ainda tem influência.',opcoes:[op('jovem','Renovar a liderança','Time +2, moral −2. Dê espaço à nova geração.',{elenco:2,moral:-2}),op('lider','Confiar no capitão','Moral +5 e diretoria +2.',{moral:5,diretoria:2})]},
  diretoria:{titulo:'Mais verba ou mais autonomia?',texto:'A diretoria quer definir a relação com você neste ano.',opcoes:[op('verba','Pedir investimento','Verba +R$ 700 mil. Diretoria −5: a cobrança aumenta.',{diretoria:-5},-700),op('autonomia','Trabalhar com o que tem','Diretoria +5 e moral +2. Sem gasto.',{diretoria:5,moral:2})]},
  emprestimo:{titulo:'Um reforço por empréstimo',texto:'Você pode trazer um jogador de 24 anos por uma temporada.',opcoes:[op('emprestar',`${jogador} · nível ${Math.min(95,nivel+6)}`,'Time +3 agora. O reforço sai no próximo ano: time −3.',{elenco:3},350,{elenco:-3}),manter]},
  renovacao:{titulo:'Seu destaque quer ficar',texto:'O principal jogador pede uma decisão sobre seu futuro.',opcoes:[op('renovar',`Renovar · nível ${Math.min(95,nivel+5)}`,'Moral +4 e time +2.',{moral:4,elenco:2},300),op('negociar','Negociar a saída','Verba +R$ 800 mil. Time −3 e moral −2.',{elenco:-3,moral:-2},-800)]}
 };
 const carta=cartas[id];
 const opcoes=carta.opcoes.map(o=>({...o,descricao:o.descricao.replace(/([Tt]ime|[Mm]oral|[Tt]orcida|[Dd]iretoria) \+(\d+)/g,(texto,nome,numero)=>{
  const atributo=/time/i.test(nome)?'elenco':nome.toLowerCase();
  const teto=atributo==='elenco'?95:100,valor=Math.min(Number(numero),Math.max(0,teto-(t[atributo]??50)));
  return `${nome} +${valor}${valor<Number(numero)?` (limite ${teto})`:''}`;
 })}));
 return {...carta,opcoes,id,chave:`${t.clube}|${t.ano}|${indice}|${id}`,indice:indice+1,total:plano.cartas.length,verba:verbaPretemporada(t)};
}
export function aplicarPretemporadaRapida(c,chave,opcaoId,quantidade=1){
 const t=c?.tecnico;if(!t||t.fase!=='pretemporada'||t.demitido||t.desempregado)throw new Error('Pré-temporada indisponível.');
 const carta=cartaPretemporadaRapida(t,quantidade);if(!carta||carta.chave!==chave)return c;
 const op=carta.opcoes.find(o=>o.id===opcaoId);if(!op)throw new Error('Escolha inválida.');
 if(op.custo>carta.verba)throw new Error('Verba insuficiente.');
 const plano=planoPretemporadaRapida(t,quantidade),resposta={carta:carta.id,opcao:op.id,nome:op.nome,resultado:op.descricao,impacto:{...op.efeitos},custo:op.custo};
 const novo={...t,modoTreinadorRapido:true,acompanharJogo:false,verbaRapida:carta.verba-op.custo,planoRapido:{...plano,respostas:[...plano.respostas,resposta]},historicoRapido:[...(t.historicoRapido||[]),carta.id].slice(-12),decisoes:[...(t.decisoes||[]),resposta]};
 for(const [atributo,valor] of Object.entries(op.efeitos))novo[atributo]=limitar((t[atributo]??50)+valor,atributo==='elenco'?10:0,atributo==='elenco'?95:100);
 if(op.estilo)novo.estilo=op.estilo;if(op.formacao)novo.formacao=op.formacao;
 if(Object.keys(op.futuro).length)novo.efeitosPendentes=[...(t.efeitosPendentes||[]),{carta:carta.id,opcao:op.id,heranca:op.futuro,clube:t.clube,aplicarEm:t.ano+1}];
 return {...c,tecnico:novo};
}
