import { comissaoAtivaGestao, propostaComissaoTecnico } from './comissaoTecnico.js';
/* Base de gestão do treinador. Valores em R$ mil; salários por mês.
   O gerador é próprio, para não consumir a aleatoriedade da simulação existente. */
import { CLUBES } from '../dados/data.js';
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));
const mediaElenco=g=>g.elenco.reduce((n,j)=>n+j.qualidade,0)/Math.max(1,g.elenco.length);
const NOMES=['André','Bruno','Caio','Daniel','Eduardo','Felipe','Gabriel','Henrique','Igor','João','Lucas','Matheus'];
const SOBRENOMES=['Almeida','Barbosa','Costa','Dias','Esteves','Ferreira','Gomes','Lima','Mendes','Oliveira','Pereira','Silva'];
export const SETORES_ELENCO = [{id:'GOL',nome:'Goleiros',quantidade:3},{id:'DEF',nome:'Defesa',quantidade:8},{id:'MEI',nome:'Meio-campo',quantidade:8},{id:'ATA',nome:'Ataque',quantidade:5}];
function gerador(semente){
 let n=2166136261;for(const c of String(semente))n=Math.imul(n^c.charCodeAt(0),16777619);
 return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
}
function jogador(rng,id,setor,forca){
 const idade=18+Math.floor(rng()*17);
 const qualidade=limitar(Math.round(forca-7+rng()*14),30,95);
 return {id,nome:`${NOMES[Math.floor(rng()*NOMES.length)]} ${SOBRENOMES[Math.floor(rng()*SOBRENOMES.length)]}`,setor,idade,qualidade,
  potencial:limitar(qualidade+Math.max(0,28-idade)+Math.floor(rng()*5),qualidade,99),
  contrato:1+Math.floor(rng()*4),salario:Math.max(3,Math.round(qualidade**2/220)),
  valor:Math.max(100,Math.round(qualidade**3/180*(idade<24?1.2:idade>30?.7:1))),origem:'elenco'};
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
  const expirados=g.elenco.filter(j=>j.contrato<=1);
  const base=g.elenco.reduce((n,j)=>n+j.qualidade,0)/Math.max(1,g.elenco.length);
  // A estrutura do clube sustenta a base mesmo após saídas de contrato.
  const referenciaBase=Math.max(base,g.forcaMercado ?? base);
  g.elenco=g.elenco.filter(j=>j.contrato>1).map(j=>{
   const idade=j.idade+1;
   const qualidade=limitar(j.qualidade+(idade<24?1:idade>32?-1:0)+(idade<30?treino:0),30,j.potencial);
   return {...j,idade,qualidade,contrato:j.contrato-1,valor:Math.max(100,Math.round(j.valor*(idade>30?.94:1.02)))};
  });
  for(const j of expirados)g.movimentos.push({tipo:'fim-contrato',jogador:j.id,nome:j.nome,valor:0,ano});
  const rng=gerador(`${g.clube}|${ano}|reposicao-v1`);
  for(const setor of SETORES_ELENCO){
   const faltam=Math.max(0,setor.quantidade-g.elenco.filter(j=>j.setor===setor.id).length);
   for(let i=0;i<faltam;i++){
    const jovem=jogador(rng,`${g.clube}:base:${ano}:${setor.id}:${i}`,setor.id,Math.max(30,referenciaBase-7));
    jovem.idade=18+Math.floor(rng()*3);jovem.contrato=3;jovem.origem='base';
    jovem.qualidade=Math.min(95,jovem.qualidade+observacao);
    jovem.salario=Math.max(3,Math.round(jovem.qualidade**2/220));
    jovem.valor=Math.max(100,Math.round(jovem.qualidade**3/180*1.2));
    jovem.potencial=Math.min(99,jovem.qualidade+10);g.elenco.push(jovem);
    g.movimentos.push({tipo:'base',jogador:jovem.id,nome:jovem.nome,valor:0,ano});
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
  const g=t.fase==='pretemporada'?atualizarGestaoAnual(t.gestao,t.ano):structuredClone(t.gestao);
  g.forcaMercado ??= Number(t.elenco)||50;return g;
 }
 const forca=limitar(Number(t.elenco)||CLUBES.find(c=>c.nome===t.clube)?.forca||50,30,95);
 const rng=gerador(`${t.clube}|${t.ano}|gestao-v1`);const elenco=[];
 for(const setor of SETORES_ELENCO)for(let i=0;i<setor.quantidade;i++)elenco.push(jogador(rng,`${t.clube}:${setor.id}:${i}`,setor.id,forca));
 const folha=elenco.reduce((n,j)=>n+j.salario,0);
 return {versao:1,clube:t.clube,ano:t.ano,forcaMercado:forca,orcamentoInicial:Math.round((forca-25)**2*8),saldo:Math.round((forca-25)**2*8),tetoSalarial:Math.ceil(folha*1.25),elenco,movimentos:[]};
}
export function resumoGestaoTecnico(g){
 const setores=SETORES_ELENCO.map(s=>{const jogadores=g.elenco.filter(j=>j.setor===s.id);return {...s,jogadores:jogadores.length,media:jogadores.length?Math.round(jogadores.reduce((n,j)=>n+j.qualidade,0)/jogadores.length):0};});
 const folhaJogadores=g.elenco.reduce((n,j)=>n+j.salario,0);
 const folhaComissao=comissaoAtivaGestao(g).reduce((n,p)=>n+p.salario,0);
 const folha=folhaJogadores+folhaComissao;
 return {folhaJogadores,folhaComissao,setores,jogadores:g.elenco.length,folha,tetoSalarial:g.tetoSalarial,espacoSalarial:g.tetoSalarial-folha,saldo:g.saldo};
}
export function gerarMercadoTecnico(t){
 const g=criarGestaoTecnico(t);const rng=gerador(`${g.clube}|${g.ano}|mercado-v1`);
 return SETORES_ELENCO.flatMap(s=>Array.from({length:3},(_,i)=>({...jogador(rng,`mercado:${g.clube}:${g.ano}:${s.id}:${i}`,s.id,g.forcaMercado),origem:'mercado'}))).filter(j=>!g.movimentos.some(m=>m.ano===g.ano&&m.jogador===j.id&&(m.tipo==='compra'||m.tipo==='venda')));
}
function validarJanela(t){
 if(!t?.clube||t.demitido||t.desempregado)throw new Error('Você precisa estar empregado para administrar o elenco.');
 if(t.fase!=='pretemporada'||t.andamento?.jogos||t.andamento?.rodadas)throw new Error('Negociações disponíveis apenas antes do início da temporada.');
 if((t.temporadas?.length||0)>=30)throw new Error('A carreira de treinador já foi encerrada.');
}
export function contratarJogadorTecnico(c,id){
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 if(g.elenco.some(j=>j.id===id))throw new Error('Esse jogador já está no elenco.');
 const alvo=gerarMercadoTecnico(t).find(j=>j.id===id);if(!alvo)throw new Error('Jogador indisponível no mercado.');
 if(g.elenco.length>=30)throw new Error('O elenco já tem 30 jogadores.');
 if(g.saldo<alvo.valor)throw new Error('Orçamento insuficiente para esta contratação.');
 if(resumoGestaoTecnico(g).folha+alvo.salario>g.tetoSalarial)throw new Error('A contratação ultrapassa o teto salarial.');
 return {...c,tecnico:{...t,gestao:{...g,saldo:g.saldo-alvo.valor,elenco:[...g.elenco,{...alvo,contrato:3}],movimentos:[...g.movimentos,{tipo:'compra',jogador:id,nome:alvo.nome,valor:alvo.valor,ano:g.ano}]}}};
}
export function venderJogadorTecnico(c,id){
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);const alvo=g.elenco.find(j=>j.id===id);
 if(!alvo)throw new Error('Jogador não encontrado no elenco.');
 const minimo={GOL:2,DEF:4,MEI:4,ATA:2};
 if(g.elenco.filter(j=>j.setor===alvo.setor).length<=minimo[alvo.setor])throw new Error('A venda deixaria o setor sem jogadores suficientes.');
 const valor=Math.round(alvo.valor*.8);
 return {...c,tecnico:{...t,gestao:{...g,saldo:g.saldo+valor,elenco:g.elenco.filter(j=>j.id!==id),movimentos:[...g.movimentos,{tipo:'venda',jogador:id,nome:alvo.nome,valor,ano:g.ano}]}}};
}

/** Proposta exibida na confirmação; valores em R$ mil. */
export function propostaRenovacaoTecnico(j){
 const salario=Math.ceil(j.salario*1.1);
 return {salario,luvas:salario*2,contrato:3};
}
export function renovarJogadorTecnico(c,id){
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 const alvo=g.elenco.find(j=>j.id===id);
 if(!alvo)throw new Error('Jogador não encontrado no elenco.');
 if(alvo.contrato>2)throw new Error('A renovação fica disponível nos últimos dois anos de contrato.');
 if(g.movimentos.some(m=>m.tipo==='renovacao'&&m.jogador===id&&m.ano===g.ano))throw new Error('Esse contrato já foi renovado nesta janela.');
 const proposta=propostaRenovacaoTecnico(alvo);
 if(g.saldo<proposta.luvas)throw new Error('Orçamento insuficiente para pagar as luvas.');
 if(resumoGestaoTecnico(g).folha-alvo.salario+proposta.salario>g.tetoSalarial)throw new Error('A renovação ultrapassa o teto salarial.');
 return {...c,tecnico:{...t,gestao:{...g,saldo:g.saldo-proposta.luvas,
  elenco:g.elenco.map(j=>j.id===id?{...j,salario:proposta.salario,contrato:proposta.contrato}:j),
  movimentos:[...g.movimentos,{tipo:'renovacao',jogador:id,nome:alvo.nome,valor:proposta.luvas,salario:proposta.salario,ano:g.ano}]}}};
}

export function contratarComissaoTecnico(c,id){
 const t=c?.tecnico;validarJanela(t);const g=criarGestaoTecnico(t);
 const ativos=comissaoAtivaGestao(g),proposta=propostaComissaoTecnico(g,id);
 if(ativos.some(p=>p.id===id))throw new Error('Este cargo já está contratado nesta temporada.');
 if(g.saldo<proposta.custo)throw new Error('Orçamento insuficiente para o contrato da comissão.');
 if(resumoGestaoTecnico(g).folha+proposta.salario>g.tetoSalarial)throw new Error('A contratação ultrapassa o teto salarial.');
 return {...c,tecnico:{...t,gestao:{...g,saldo:g.saldo-proposta.custo,
  comissao:[...ativos,{id,ano:g.ano,salario:proposta.salario,custo:proposta.custo}],
  movimentos:[...g.movimentos,{tipo:'comissao',cargo:id,nome:proposta.nome,valor:proposta.custo,ano:g.ano}]}}};
}

/** Materializa saves antigos sem recriar a gestão a cada acesso. */
export function prepararGestaoTecnico(c){
 const t=c?.tecnico;
 if(!t?.clube||t.modoTreinadorRapido||t.demitido||t.desempregado||t.fase!=='pretemporada')return c;
 const gestao=criarGestaoTecnico(t);
 const virada=t.gestao?.versao===1&&t.gestao.clube===t.clube&&gestao.ano>t.gestao.ano;
 const delta=virada?mediaElenco(gestao)-mediaElenco(t.gestao):0;
 return {...c,tecnico:{...t,gestao,elenco:limitar((Number(t.elenco)||50)+delta,10,95)}};
}
export function negociarElencoTecnico(c,tipo,id){
 try {
  if(!['compra','venda','renovacao','comissao'].includes(tipo))throw new Error('Operação inválida.');
  const novo=tipo==='compra'?contratarJogadorTecnico(c,id):tipo==='venda'?venderJogadorTecnico(c,id):tipo==='comissao'?contratarComissaoTecnico(c,id):renovarJogadorTecnico(c,id);
  const delta=mediaElenco(novo.tecnico.gestao)-mediaElenco(criarGestaoTecnico(c.tecnico));
  return {...novo,tecnico:{...novo.tecnico,elenco:limitar((Number(c.tecnico.elenco)||50)+delta,10,95),avisoGestao:{texto:tipo==='compra'?'Contratação concluída.':tipo==='venda'?'Venda concluída.':tipo==='comissao'?'Comissão contratada.':'Contrato renovado.',erro:false}}};
 } catch(erro){return {...c,tecnico:{...c.tecnico,avisoGestao:{texto:erro.message,erro:true}}};}
}
