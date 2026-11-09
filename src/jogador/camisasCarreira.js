import {CLUBES} from '../dados/data.js';
const copiar=x=>structuredClone(x);
const hash=s=>[...String(s)].reduce((n,v)=>Math.imul(n^v.charCodeAt(0),16777619)>>>0,2166136261);
const valido=(n,max=99)=>Number.isInteger(Number(n))&&Number(n)>=1&&Number(n)<=max;
const atual=c=>c.emprestimo?.destino||c.clubeNome;
const nomes=['Caio Nunes','Rafael Costa','André Vidal','Mateo Duarte','Davi Reis','Bruno Lemos','Gabriel Alves','Nicolas Monteiro','Samuel Rocha','Enzo Vieira','Felipe Moura','Daniel Torres','João Almeida','Lucas Moreira','Pedro Freitas','Vitor Ribeiro','Henrique Dias','Miguel Azevedo','Gustavo Mendes','Arthur Barros','Diego Teixeira','Eduardo Martins','Thiago Carvalho','Leonardo Melo'];
const faixa=max=>Array.from({length:max},(_,i)=>i+1);
function elencoDoClube(c,nome){
 const nums=faixa(35).sort((a,b)=>hash(`${c.codigo}:${nome}:${a}`)-hash(`${c.codigo}:${nome}:${b}`));
 return nums.slice(0,24).map((numero,i)=>({id:`camisa:${nome}:${i}`,nome:nomes[(hash(nome)+i)%nomes.length],numero,ficticio:true}));
}
export function iniciarCamisas(c,{novo=false}={}){
 c.numeroFavorito=valido(c.numeroFavorito)?Number(c.numeroFavorito):valido(c.numero)?Number(c.numero):10;
 if(c.camisas?.versao===2){c.camisas.clubes=c.camisas.clubes||{};return c.camisas;}
 c.camisas={versao:2,clubes:{},selecaoCriadaNova:novo||!(c.selecao?.convocacoes>0)};
 if(!novo&&c.flags?.baseEscolhida&&atual(c)){
  const nome=atual(c),numero=valido(c.numero)?Number(c.numero):10,elenco=elencoDoClube(c,nome);
  const dono=elenco.find(p=>p.numero===numero);if(dono)dono.numero=faixa(99).find(n=>n!==numero&&!elenco.some(p=>p.numero===n));
  c.camisas.clubes[nome]={nome,numero,elenco,escolhido:true,chegada:0,ano:c.ano};
 }
 return c.camisas;
}
export function prepararCamisaClube(c,nome=atual(c),{novaChegada=false}={}){
 const camisas=iniciarCamisas(c);let kit=camisas.clubes[nome];
 if(!kit){const elenco=elencoDoClube(c,nome),livre=faixa(99).find(n=>!elenco.some(p=>p.numero===n));kit=camisas.clubes[nome]={nome,numero:livre,elenco,escolhido:false,chegada:0,ano:c.ano};}
 if(novaChegada){kit.escolhido=false;kit.chegada=(kit.chegada||0)+1;kit.ano=c.ano;}
 c.numero=kit.numero;return kit;
}
export function prepararCamisaSelecao(c,jogadores=[],{preservarNumero=null}={}){
 const camisas=iniciarCamisas(c);let kit=camisas.selecao;
 if(!kit||kit.nac!==c.nac){
  const legado=valido(preservarNumero,26)||((c.selecao?.convocacoes||0)>0&&!camisas.selecaoCriadaNova);
  const numero=legado&&valido(preservarNumero||c.numeroSelecao||c.numero,26)?Number(preservarNumero||c.numeroSelecao||c.numero):null;
  kit=camisas.selecao={nome:c.nac,nac:c.nac,numero,elenco:[],escolhido:legado,ano:c.ano,chegada:0};
 }
 if(jogadores.length){
  const antigos=new Map(kit.elenco.map(p=>[p.id,p])),usados=new Set(),mantidos=new Map();
  for(const p of jogadores){const n=antigos.get(p.id)?.numero;if(valido(n,26)&&n!==kit.numero&&!usados.has(n)){mantidos.set(p.id,n);usados.add(n);}}
  kit.elenco=jogadores.map((p,i)=>{let numero=mantidos.get(p.id)||null;const reservar=kit.escolhido||i<18;
   if(!numero&&reservar){numero=faixa(26).find(n=>n!==kit.numero&&!usados.has(n));if(numero)usados.add(numero);}
   return{id:p.id,nome:p.nome,numero,ficticio:p.ficticio!==false};});
 }
 if(!valido(kit.numero,26)||kit.elenco.some(p=>p.numero===kit.numero))kit.numero=faixa(26).find(n=>!kit.elenco.some(p=>p.numero===n))||26;
 c.numeroSelecao=kit.numero;return kit;
}
export function sincronizarCamisasSelecao(c,elenco){
 if(!elenco)return;const kit=prepararCamisaSelecao(c,elenco.jogadores),usados=new Set([kit.numero]);
 const fixos=new Map(kit.elenco.filter(p=>p.numero&&p.numero!==kit.numero).map(p=>[p.id,p.numero]));
 for(const p of elenco.jogadores){const n=fixos.get(p.id);if(n&&!usados.has(n)){p.numero=n;usados.add(n);}else p.numero=null;}
 for(const p of elenco.jogadores)if(!p.numero){p.numero=faixa(26).find(n=>!usados.has(n));usados.add(p.numero);}
 elenco.usuario.numero=kit.numero;
}
export function camisaInfo(c,alvo='clube'){
 const cc={...c,camisas:c.camisas?copiar(c.camisas):undefined};iniciarCamisas(cc);const kit=alvo==='selecao'?prepararCamisaSelecao(cc):prepararCamisaClube(cc);
 const max=alvo==='selecao'?26:99,ocupados=new Map(kit.elenco.filter(p=>p.numero).map(p=>[p.numero,p])),favorito=cc.numeroFavorito;
 const moral=c.moral??65,prestigio=alvo==='selecao'?Math.min(100,(c.selecao?.convocacoes||0)*6+(c.fama||0)*.4):(c.torcida?.[atual(c)]??30);
 const podePedir=moral>=80&&prestigio>=75;
 return {...kit,alvo,max,favorito,favoritoRetirado:(kit.retirados||[]).includes(favorito),livres:faixa(max).filter(n=>!ocupados.has(n)&&!(kit.retirados||[]).includes(n)),ocupante:ocupados.get(favorito)||null,podePedir,moral,prestigio:Math.round(prestigio),regra:alvo==='selecao'?'Seleção: números de 1 a 26.':'Clube: números de 1 a 99.',requisito:'Para pedir um favorito ocupado: moral 80 e prestígio 75.'};
}
export function escolherCamisa(c0,numero,alvo='clube'){
 const c=copiar(c0),info=camisaInfo(c,alvo);numero=Number(numero);
 if(!valido(numero,info.max))throw Error(`Escolha um número entre 1 e ${info.max}.`);
 iniciarCamisas(c);const kit=alvo==='selecao'?prepararCamisaSelecao(c):prepararCamisaClube(c);
 if((kit.retirados||[]).includes(numero))throw Error('Este número foi aposentado pelo clube.');
 if(kit.escolhido&&kit.numero!==numero&&c.lojaAnoEmCurso===c.ano)throw Error('Peça a troca de número entre temporadas.');
 const dono=kit.elenco.find(p=>p.numero===numero);
 if(dono){if(numero!==info.favorito||!info.podePedir)throw Error('Este número está ocupado. Escolha um livre ou conquiste prestígio para pedir seu favorito.');dono.numero=faixa(info.max).find(n=>n!==numero&&!kit.elenco.some(p=>p.numero===n)&&!(kit.retirados||[]).includes(n));if(!dono.numero)throw Error('Não há número livre para negociar esta troca.');}
 kit.numero=numero;kit.escolhido=true;kit.escolhidoEm=c.ano;
 if(alvo==='selecao'){c.numeroSelecao=numero;for(const e of [c.jornada?.elencoSelecao,c.jornada?.elencoContinental])if(e)sincronizarCamisasSelecao(c,e);}
 else{c.numero=numero;if(c.jornada?.ultimaMudanca?.primeiroDia)c.jornada.ultimaMudanca.primeiroDia.numero=numero;if(!(c.temporadas||[]).length){for(const m of c.jornada?.memorias||[])if(m.id==='primeiro:contrato'&&m.clube===atual(c))m.numero=numero;const m=c.jornada?.primeiros?.contrato;if(m?.clube===atual(c))m.numero=numero;}}
 c.camisas.historico=[...(c.camisas.historico||[]),{ano:c.ano,alvo,clube:alvo==='selecao'?c.nac:atual(c),numero,favorito:numero===c.numeroFavorito,pedido:!!dono}].slice(-80);
 return c;
}
export function numeroSelecaoDe(c){return valido(c.numeroSelecao,26)?Number(c.numeroSelecao):valido(c.numero,26)?Number(c.numero):10;}
export function pedidoFavoritoDisponivel(c,alvo='clube'){const i=camisaInfo(c,alvo);return i.favorito<=i.max&&!i.favoritoRetirado&&i.numero!==i.favorito&&(!i.ocupante||i.podePedir);}

export function aposentarDonoCamisa(c,numero,{retirarNumero=false}={}){const kit=prepararCamisaClube(c),dono=kit.elenco.find(p=>p.numero===numero);if(dono){kit.aposentados=[...(kit.aposentados||[]),{...dono,ano:c.ano}];kit.elenco=kit.elenco.filter(p=>p.id!==dono.id);}if(retirarNumero)kit.retirados=[...new Set([...(kit.retirados||[]),numero])];return kit;}
