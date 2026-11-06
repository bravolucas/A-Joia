import {POSICOES} from './data.js';
import {calcOVR} from './lib.js';

const limitar=(n,a=40,b=99)=>Math.max(a,Math.min(b,Math.round(n)));
const copiar=x=>JSON.parse(JSON.stringify(x));
export const IDENTIDADES_POSICAO={
 GOL:{nome:'Guardião',descricao:'Leitura do cobrador, defesas e reposição iniciam a jogada.',assinatura:'paredao',feito:'primeira-defesa'},
 ZAG:{nome:'Última linha',descricao:'Antecipe o passe, ganhe a disputa e construa a saída.',assinatura:'antecipador',feito:'primeira-recuperacao'},
 VOL:{nome:'Equilíbrio',descricao:'Proteja a defesa e encontre o primeiro passe vertical.',assinatura:'antecipador',feito:'primeira-recuperacao'},
 LD:{nome:'Corredor direito',descricao:'Apoie por fora, cruze e recomponha pelo lado direito.',assinatura:'cruzador',feito:'primeiro-cruzamento'},
 LE:{nome:'Corredor esquerdo',descricao:'Dê amplitude, cruze e feche seu lado na defesa.',assinatura:'cruzador',feito:'primeiro-cruzamento'},
 ALD:{nome:'Ala de chegada',descricao:'Ataque o corredor direito e encontre quem entra na área.',assinatura:'cruzador',feito:'primeiro-cruzamento'},
 ALE:{nome:'Ala de chegada',descricao:'Ganhe a linha de fundo pela esquerda sem esquecer a recomposição.',assinatura:'cruzador',feito:'primeiro-cruzamento'},
 MD:{nome:'Construtor pela direita',descricao:'Conecte lateral e ataque, com passe, cruzamento e cobertura.',assinatura:'vertical',feito:'primeira-assistencia'},
 ME:{nome:'Construtor pela esquerda',descricao:'Receba aberto, crie por dentro e ajude a proteger o corredor.',assinatura:'vertical',feito:'primeira-assistencia'},
 MC:{nome:'Motor do meio',descricao:'Controle o ritmo, ofereça linha de passe e participe das duas fases.',assinatura:'vertical',feito:'primeira-assistencia'},
 MEI:{nome:'Último passe',descricao:'Encontre o espaço entre as linhas e sirva quem ataca a área.',assinatura:'vertical',feito:'primeira-assistencia'},
 PE:{nome:'Desequilíbrio pela esquerda',descricao:'Alterne o drible por fora, o cruzamento e a entrada para finalizar.',assinatura:'cruzador',feito:'primeiro-gol'},
 PD:{nome:'Desequilíbrio pela direita',descricao:'Abra o campo ou corte para dentro para criar e finalizar.',assinatura:'cruzador',feito:'primeiro-gol'},
 SA:{nome:'Segundo homem',descricao:'Jogue atrás do centroavante, aproximando criação e finalização.',assinatura:'decisivo',feito:'primeiro-gol'},
 ATA:{nome:'Referência de área',descricao:'Ataque o espaço, finalize e decida as oportunidades do time.',assinatura:'decisivo',feito:'primeiro-gol'},
};
const ROTAS={ATA:['SA','MEI','PE','PD'],SA:['ATA','MEI','PE','PD'],PE:['PD','ME','MEI','MC','ALE','LE','SA','ATA'],PD:['PE','MD','MEI','MC','ALD','LD','SA','ATA'],MEI:['MC','SA','ME','MD'],MC:['VOL','MEI','ME','MD'],VOL:['MC','ZAG','LD','LE'],ZAG:['VOL','LD','LE'],LD:['ALD','MD','PD','LE','ZAG','VOL'],LE:['ALE','ME','PE','LD','ZAG','VOL'],ALD:['LD','MD','ALE','MC'],ALE:['LE','ME','ALD','MC'],MD:['ME','MC','MEI','PD','ALD','LD'],ME:['MD','MC','MEI','PE','ALE','LE'],GOL:[]};
const LADOS=[['PE','PD'],['ME','MD'],['ALE','ALD'],['LE','LD']];
const bruta=(c,p=c.posicao,attrs=c.attrs)=>calcOVR({...attrs,fintas:3,pernaRuim:3},p);
export function penalidadePosicao(c){return c.jornada?.transicao?.restantes>0?c.jornada.transicao.penalidade:0;}
export function posicoesCompativeis(c){
 if(c.aposentado||c.posicao==='GOL')return [];
 const a=c.attrs||{},ultima=c.jornada?.ultimaTroca;
 if(c.jornada?.transicao?.restantes>0||ultima&&c.ano-ultima.ano<2)return [];
 const ult=c.temporadas?.at(-1),gols=ult?.gols||0;
 return (ROTAS[c.posicao]||[]).filter(p=>{
  if(['ZAG','VOL'].includes(p)&&(a.defesa<52||a.fisico<50))return false;
  if(['MEI','MC'].includes(p)&&a.passe<54)return false;
  if(['PE','PD'].includes(c.posicao)&&p==='MC'&&c.idade<29)return false;
  if(['PE','PD'].includes(c.posicao)&&['LE','LD','ALE','ALD'].includes(p)&&a.defesa<55)return false;
  if(c.posicao==='ATA'&&p==='MEI'&&(c.idade<29||a.passe<58))return false;
  if(['LD','LE'].includes(c.posicao)&&['PD','PE'].includes(p)&&gols<5&&a.finalizacao<64)return false;
  if(c.posicao==='ZAG'&&['LE','LD'].includes(p)&&a.velocidade<58)return false;
  if(c.posicao==='ZAG'&&p==='VOL'&&a.passe<58)return false;
  if(['PE','PD'].includes(p)&&['ATA','SA'].includes(c.posicao)&&a.velocidade<60)return false;
  return true;
 }).map(p=>preverMudancaPosicao(c,p));
}
export function preverMudancaPosicao(c,destino){
 const trocaLado=LADOS.some(par=>par.includes(c.posicao)&&par.includes(destino));
 const duracao=trocaLado||['LE','LD','ALE','ALD','ME','MD','PE','PD'].some(p=>p===c.posicao)&&['LE','LD','ALE','ALD','ME','MD','PE','PD'].includes(destino)?1:2;
 const penalidade=trocaLado&&c.pe==='ambidestro'?1:2;
 const chave=['ZAG','VOL'].includes(destino)?'defesa':['ATA','SA'].includes(destino)?'finalizacao':'passe';
 const attrs={...c.attrs,[chave]:Math.min(99,c.attrs[chave]+1)};
 const ovrBase=bruta(c,destino),ovrAntes=bruta(c)-penalidadePosicao(c);
 const motivo=c.idade>=30&&['MEI','MC','VOL','ZAG'].includes(destino)?'Recuar para usar leitura e passe, com menos dependência de arrancada.':trocaLado?'Mudar o corredor: novos ângulos de passe e finalização.':['MD','ME','PD','PE','ALE','ALD'].includes(destino)?'Aproveitar sua chegada, produção ofensiva e jogo pelo corredor.':'Explorar atributos próximos em uma função compatível.';
 return{destino,nome:POSICOES.find(p=>p.id===destino)?.label||destino,origem:c.posicao,duracao,penalidade,ovrAntes,ovrInicio:limitar(ovrBase-penalidade),ovrAdaptado:ovrBase,ovrPossivel:bruta(c,destino,attrs),ganho:chave,motivo};
}
export function mudarPosicao(c0,destino){
 if(c0.lojaAnoEmCurso===c0.ano)throw new Error('Mude de posição entre temporadas.');
 const proposta=posicoesCompativeis(c0).find(p=>p.destino===destino);
 if(!proposta)throw new Error('Esta troca não é compatível ou sua adaptação ainda está em curso.');
 const c=copiar(c0);c.jornada=c.jornada||{};
 c.jornada.posicaoInicial=c.jornada.posicaoInicial||c.posicao;
 c.jornada.transicao={...proposta,inicio:c.ano,restantes:proposta.duracao,jogos:0};
 c.jornada.ultimaTroca={ano:c.ano,de:c.posicao,para:destino};
 c.jornada.trocas=[...(c.jornada.trocas||[]),c.jornada.ultimaTroca];
 c.posicao=destino;
 return c;
}
export function fecharAdaptacaoPosicao(c,card){
 const t=c.jornada?.transicao;if(!t||t.restantes<=0)return;
 t.jogos+=card.jogos||0;t.restantes--;
 card.mudancaPosicao={...t};
 if(t.restantes===0){
  const antes=c.attrs[t.ganho];
  if(t.jogos>=20)c.attrs[t.ganho]=limitar(Math.max(c.attrs[t.ganho],Math.min(c.potencial?.[t.ganho]??99,c.attrs[t.ganho]+1)));
  card.destaques.push(`Adaptado a ${c.posicao}: a penalidade temporária terminou${c.attrs[t.ganho]>antes?` · +1 ${t.ganho}`:''}.`);
 }
}
export function sugestaoVeterano(c){return c.idade>=30?posicoesCompativeis(c).find(p=>['MEI','MC','VOL','ZAG'].includes(p.destino)):null;}
export function reinventarVeterano(c0,estilo){
 if(c0.aposentado||c0.idade<30||c0.lojaAnoEmCurso===c0.ano)throw new Error('A reinvenção abre entre temporadas a partir dos 30 anos.');
 if(c0.jornada?.veterano&&c0.ano-c0.jornada.veterano.ano<3)throw new Error('Seu novo estilo precisa de três temporadas antes de outra reinvenção.');
 const ganhos={leitura:{passe:2},mentor:{passe:1,defesa:1},posicionamento:{defesa:2}}[estilo];
 if(!ganhos||c0.posicao==='GOL'&&estilo==='mentor')throw new Error('Estilo indisponível.');
 const c=copiar(c0),aplicados={};
 for(const [a,n]of Object.entries(ganhos)){const alvo=Math.min(99,c.potencial?.[a]??99,c.attrs[a]+n);aplicados[a]=Math.max(0,alvo-c.attrs[a]);}
 if(!Object.values(aplicados).some(n=>n>0)||c.attrs.velocidade<42)throw new Error('Seus limites de atributos não permitem esta troca.');
 c.attrs.velocidade-=2;for(const[a,n]of Object.entries(aplicados))c.attrs[a]+=n;
 c.jornada=c.jornada||{};c.jornada.veterano={estilo,ano:c.ano,ganhos:aplicados,custoVelocidade:2};return c;
}
