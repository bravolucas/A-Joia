import { iniciarCarreiraTecnico } from './tecnico.js';
import { prepararGestaoTecnico } from './mercadoTecnico.js';
export const CHAVE_DESAFIOS='ajoia_desafios_v1';
export const DESAFIOS_HISTORICOS=[
 {id:'santos-2002',nome:'A força dos meninos',clube:'Santos',ano:2002,liga:'brasileirao',pais:'Brasil',forca:72,orcamento:2000,posicao:4,objetivo:'Terminar entre os 4 primeiros',contexto:'Inspirado no Santos campeão brasileiro de 2002. Nesta missão, leve um elenco jovem ao topo da tabela.',dificuldade:'Intermediário'},
 {id:'leicester-2016',nome:'A zebra inglesa',clube:'Leicester City',ano:2016,liga:'inglaterra',pais:'Inglaterra',forca:78,orcamento:1500,posicao:1,objetivo:'Conquistar a liga',contexto:'Inspirado no título inglês do Leicester em 2016. Enfrente os favoritos com um orçamento curto.',dificuldade:'Difícil'},
 {id:'flamengo-2019',nome:'Rubro-negro no topo',clube:'Flamengo',ano:2019,liga:'brasileirao',pais:'Brasil',forca:82,orcamento:3000,posicao:1,objetivo:'Conquistar a liga',contexto:'Inspirado no Flamengo de 2019. Transforme a força do elenco em título nacional.',dificuldade:'Acessível'}
];
export const estadoInicialDesafios=()=>({v:1,ativo:null,concluidos:{},tentativas:{}});
export function iniciarDesafioHistorico(estado,id){
 const d=DESAFIOS_HISTORICOS.find(d=>d.id===id);if(!d)throw new Error('Desafio inválido.');
 if(estado.ativo&&!estado.ativo.contabilizado)throw new Error('Conclua ou encerre a tentativa atual.');
 let c=iniciarCarreiraTecnico({nome:'Treinador de desafios',idade:40,ano:d.ano,nac:'BRA',ritmo:'expresso',aposentado:true,clubeNome:d.clube,temporadas:[],totais:{},legado:{pontos:880}});
 c={...c,tecnico:{...c.tecnico,clube:d.clube,pais:d.pais,liga:d.liga,elenco:d.forca,verbaRapida:d.orcamento,reputacao:65,clubeInicialEscolhido:true,opcoesInicio:[],ligasMundo:{[d.clube]:d.liga},diretoria:85,torcida:75}};
 c=prepararGestaoTecnico(c);c.tecnico.gestao.saldo=d.orcamento;c.tecnico.gestao.orcamentoInicial=d.orcamento;
 if(d.id==='santos-2002')c.tecnico.gestao.elenco=c.tecnico.gestao.elenco.map((j,i)=>({...j,idade:18+i%5,potencial:Math.min(99,Math.max(j.potencial,j.qualidade+10)),valor:Math.round(j.qualidade**3/180*1.2)}));
 return {...estado,ativo:{id,c,contabilizado:false},tentativas:{...estado.tentativas,[id]:(estado.tentativas[id]||0)+1}};
}
export function atualizarDesafioHistorico(estado,c){
 if(!estado.ativo||estado.ativo.contabilizado)return estado;
 const d=DESAFIOS_HISTORICOS.find(d=>d.id===estado.ativo.id),temporada=c?.tecnico?.temporadas?.[0];
 if(!d||c.tecnico.clube!==d.clube)throw new Error('Carreira incompatível com o desafio.');
 const terminou=c.tecnico.fase==='resultado'&&temporada?.ano===d.ano;
 const sucesso=!!(terminou&&!temporada.interrompida&&temporada.posicao<=d.posicao);
 return {...estado,ativo:{...estado.ativo,c,contabilizado:!!terminou,sucesso},concluidos:sucesso?{...estado.concluidos,[d.id]:{posicao:Math.min(estado.concluidos[d.id]?.posicao??Infinity,temporada.posicao),pontos:Math.max(estado.concluidos[d.id]?.pontos||0,temporada.pontos)}}:estado.concluidos};
}
export function carregarDesafiosHistoricos(storage=globalThis.localStorage){
 try{const s=JSON.parse(storage.getItem(CHAVE_DESAFIOS));if(s?.v===1&&s.concluidos&&s.tentativas&&(!s.ativo||(DESAFIOS_HISTORICOS.some(d=>d.id===s.ativo.id)&&s.ativo.c?.tecnico)))return s;}catch{}
 return estadoInicialDesafios();
}
export function salvarDesafiosHistoricos(estado,storage=globalThis.localStorage){
 try{storage.setItem(CHAVE_DESAFIOS,JSON.stringify(estado));return true;}catch{return false;}
}
