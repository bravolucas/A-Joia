import {FORMACOES_TECNICO} from './taticasTecnico.js';
import {alocarSetoresTecnico} from './alocacaoSetoresTecnico.js';

const elegivel=j=>!!j&&!j.aposentado&&!j.indisponivel&&!j.suspenso&&
 !(typeof j.lesao==='object'&&j.lesao?.jogosRestantes>0);
const ovr=j=>Number.isFinite(j?.ovr)?j.ovr:Number.isFinite(j?.qualidade)?j.qualidade:0;
const id=j=>String(j?.mundoId??j?.id);

/**
 * Previsão transparente do onze e banco com o elenco JÁ presente no painel.
 * Não escala atletas de outros clubes, não contrata substitutos e não escreve
 * IDs / listas redundantes no save. Não é registro histórico de uma partida.
 */
export function preverEscalacaoTecnico(c={},elencoPainel=[]) {
 const tecnico=c.tecnico||{};
 if(!tecnico.clube||tecnico.tipoEquipe==='selecao'||!Array.isArray(elencoPainel)||!elencoPainel.length)return null;
 const formacao=FORMACOES_TECNICO.find(f=>f.id===tecnico.formacao)||FORMACOES_TECNICO[1];
 const unicos=[],vistos=new Set();
 for(const j of elencoPainel){
   if(!j||j.id==null)continue;
   const chave=id(j);
   if(vistos.has(chave))continue;
   vistos.add(chave);
   unicos.push(j);
 }
 const disponiveis=unicos.filter(elegivel);
 const alocados=alocarSetoresTecnico(disponiveis,formacao.pesos);
 const titulares=alocados.map((alocado,i)=>alocado?{
   id:id(alocado.jogador),nome:alocado.jogador.nome||'Atleta sem nome',
   posicao:alocado.jogador.posicao||'—',setor:alocado.setor,
   ovr:ovr(alocado.jogador),secundaria:alocado.secundaria,
   vaga:i+1,
 }:{vaga:i+1,id:null,nome:null,setor:Object.entries(formacao.pesos).flatMap(([s,n])=>Array(n).fill(s))[i]});
 const convocados=new Set(titulares.filter(j=>j.id!==null).map(j=>j.id));
 const banco=disponiveis.filter(j=>!convocados.has(id(j))).sort((a,b)=>ovr(b)-ovr(a)||id(a).localeCompare(id(b)))
   .slice(0,7).map(j=>({id:id(j),nome:j.nome||'Atleta sem nome',posicao:j.posicao||'—',ovr:ovr(j)}));
 const indisponiveis=unicos.filter(j=>!elegivel(j)).length;
 return {formacao:formacao.id,titulares,banco,indisponiveis,
   vagasAbertas:titulares.filter(j=>j.id===null).length,
   totalDisponiveis:disponiveis.length};
}
