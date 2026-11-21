import {CLUBES,LIGAS} from '../dados/data.js';
import {valorMercadoEuro,verbaTransferenciasEuro} from '../simulacao/economia.js';

/* Mercado do empresário do Modo Jogador. Somente leitura no catálogo;
   sondagens e respostas são gravadas no save por rapido.js. */
const PAIS_DA_LIGA = {
 brasileirao:'Brasil',serieB:'Brasil',serieC:'Brasil',serieD:'Brasil',
 inglaterra:'Inglaterra',inglaterra2:'Inglaterra',
 espanha:'Espanha',espanha2:'Espanha',
 italia:'Itália',italia2:'Itália',
 alemanha:'Alemanha',alemanha2:'Alemanha',
 franca:'França',franca2:'França',
 portugal:'Portugal',portugal2:'Portugal',
 holanda:'Países Baixos',turquia:'Turquia',argentina:'Argentina',
 arabia:'Arábia Saudita',mls:'Estados Unidos',
};
const limitar=(n,min,max)=>Math.max(min,Math.min(max,n));
const numero=(v,padrao)=>(v===null||v===undefined||v==='')?padrao:Number.isFinite(Number(v))?Number(v):padrao;
const indiceEstavel=texto=>{
 let h=2166136261;
 for(const ch of String(texto))h=Math.imul(h^ch.charCodeAt(0),16777619);
 return (h>>>0)/4294967296;
};

export function catalogoClubesEmpresario(c,clubes=CLUBES){
 const ligas=c?.tecnico?.ligasMundo||c?.ligas||{};
 return clubes.map(clube=>{
  const liga=ligas[clube.nome]||clube.liga;
  return {...clube,liga,pais:PAIS_DA_LIGA[liga]||'Outros',ligaNome:LIGAS[liga]?.nome||liga};
 }).filter(clube=>!LIGAS[clube.liga]?.naoJogavel)
   .sort((a,b)=>a.pais.localeCompare(b.pais,'pt-BR')||a.ligaNome.localeCompare(b.ligaNome,'pt-BR')||b.forca-a.forca||a.nome.localeCompare(b.nome,'pt-BR'));
}

/* A base mundial preserva jogadores reais, newgens, transferências e o caixa
   efetivo do save. Sem caixa disponível, a verba é estimada e identificada. */
/* rapido.js registra aqui o preço real de transferência; importar direto criaria
   um ciclo entre os módulos. Sem registro, usa a régua do mundo pelo contrato. */
let custoTransferencia=(c,clube,ovr)=>(c.contrato?.restantes??0)>0?Math.max(50,Math.round(valorMercadoEuro({ovr,idade:c.idade,liga:clube.liga,contrato:c.contrato?.restantes})/50)*50):0;
export function registrarCustoTransferencia(fn){custoTransferencia=fn;}
export function analisarClubeEmpresario(c,clube,ovr){
 if(!clube?.nome||!LIGAS[clube.liga]||LIGAS[clube.liga].naoJogavel)throw new Error('Clube indisponível nesta carreira.');
 const mundo=c?.mundo||{},elenco=(mundo.jogadores||[]).filter(j=>!j.aposentado&&j.clubeNome===clube.nome);
 const concorrentes=elenco.filter(j=>j.posicao===c.posicao).sort((a,b)=>(b.ovr??b.qualidade??0)-(a.ovr??a.qualidade??0));
 const melhor=concorrentes[0]||null,qualidadeConcorrente=numero(melhor?.ovr??melhor?.qualidade,null);
 const posicaoOcupada=qualidadeConcorrente!==null&&qualidadeConcorrente>=ovr+3;
 // Mesmo custo que a negociação real do Modo Jogador usa (valorTransferencia,
 // registrada pelo rapido.js): a sondagem nunca mostra outro preço.
 const custo=custoTransferencia(c,clube,ovr);
 const verbaDerivada=verbaTransferenciasEuro(elenco.map(j=>({
  valor:valorMercadoEuro({ovr:j.ovr??j.qualidade,idade:j.idade,liga:clube.liga,potencial:j.potencial,contrato:j.contrato}),
 })));
 const caixaReal=mundo.caixaClubes?.[clube.nome];
 const caixaConhecido=Number.isFinite(caixaReal)&&caixaReal>=0;
 const financas=numero(c.universo?.clubes?.[clube.nome]?.financas,50);
 const caixa=caixaConhecido?caixaReal:Math.round((elenco.length?verbaDerivada:valorMercadoEuro({ovr:clube.forca,idade:26,liga:clube.liga})*5)*limitar(financas/55,0.3,1.65));
 const investimentoMaximo=Math.round(caixa*0.6);
 const semVerba=custo>0&&custo>investimentoMaximo;
 const distancia=ovr-clube.forca;
 const concorrencia=qualidadeConcorrente===null?'Sem referência':qualidadeConcorrente>=ovr+3?'Alta':qualidadeConcorrente>=ovr-2?'Disputada':'Espaço possível';
 return {distancia,melhor,qualidadeConcorrente,concorrencia,posicaoOcupada,custo,caixa,caixaConhecido,investimentoMaximo,semVerba,ligaNome:LIGAS[clube.liga].nome,pais:PAIS_DA_LIGA[clube.liga]||'Outros'};
}

export function respostaClubeEmpresario(c,clube,ovr){
 const a=analisarClubeEmpresario(c,clube,ovr);
 let chance=0.52+a.distancia*0.035;
 if(a.distancia<=-15)chance=Math.min(chance,0.02);
 else if(a.distancia<=-8)chance*=0.2;
 else if(a.distancia<=-4)chance*=0.55;
 if(a.qualidadeConcorrente!==null){
  const diferenca=a.qualidadeConcorrente-ovr;
  if(diferenca>=8)chance*=0.18;
  else if(diferenca>=3)chance*=0.45;
  else if(diferenca<=-4)chance+=0.12;
 }
 if(a.semVerba)chance*=0.06;
 const ult=c.temporadas?.at(-1);
 if(ult?.jogos>=10&&ult.nota>=7.3)chance+=0.06;
 if(numero(c.fama,0)>=45)chance+=0.04;
 if(c.idade<=21)chance+=0.05;
 if(c.idade>=34)chance-=0.08;
 // Obstáculos graves continuam quase eliminatórios, mesmo com ótima fama.
 if(a.distancia<=-12||a.semVerba)chance=Math.min(chance,0.02);
 else if(a.posicaoOcupada&&a.qualidadeConcorrente-ovr>=8)chance=Math.min(chance,0.08);
 chance=limitar(chance,0.005,0.88);
 const sorteio=indiceEstavel([c.codigo||c.nome,c.ano,clube.nome,'retorno-empresario-v2'].join('|'));
 const positiva=sorteio<chance;
 let motivo;
 if(positiva)motivo='O clube gostou do seu perfil e está aberto a conversar, mas ainda não apresentou uma proposta formal.';
 else if(a.semVerba)motivo='A diretoria não dispõe de verba suficiente para bancar a transferência neste momento.';
 else if(a.distancia<=-5)motivo='A comissão técnica considera seu nível atual abaixo do exigido para o elenco.';
 else if(a.posicaoOcupada)motivo='O clube já conta com um jogador mais forte na sua posição e não prioriza a contratação.';
 else motivo='O clube avaliou a sondagem, mas optou por outras prioridades nesta janela.';
 return {status:positiva?'positivo':'negativo',motivo,analise:{...a,melhor:a.melhor?{nome:a.melhor.nome,ovr:a.qualidadeConcorrente}:null}};
}

/* Interesse positivo cria a possibilidade de proposta; não a garante. */
export function viraPropostaSondagem(c,clube){
 return indiceEstavel([c.codigo||c.nome,c.ano,clube,'proposta-sondagem-v2'].join('|'))<0.68;
}
