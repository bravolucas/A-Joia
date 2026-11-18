import {escalarOnzePosicionalTecnico} from './escalacaoPosicionalTecnico.js';

const elegivel=j=>!!j&&!j.aposentado&&!j.indisponivel&&!j.suspenso&&
 !(typeof j.lesao==='object'&&j.lesao?.jogosRestantes>0);
const ovr=j=>Number.isFinite(j?.ovr)?j.ovr:Number.isFinite(j?.qualidade)?j.qualidade:0;
const id=j=>String(j?.mundoId??j?.id);

/**
 * Prévia do elenco real por posição EXATA, não apenas por setor.
 * Ex.: dois ZAG não cobrem automaticamente LD e LE; precisa haver
 * aptidão principal ou secundária comprovada. Os slots sem candidato
 * permanecem "Vaga em aberto" mesmo que o clube tenha muitos atletas.
 * Não modifica o elenco mundial nem a carreira do treinador.
 */
export function preverEscalacaoTecnico(c={},elencoPainel=[]) {
 const tecnico=c.tecnico||{};
 if(!tecnico.clube||tecnico.tipoEquipe==='selecao'||!Array.isArray(elencoPainel)||!elencoPainel.length)return null;
 const unicos=[],vistos=new Set();
 for(const j of elencoPainel){
  if(!j||j.id==null)continue;
  const chave=id(j);
  if(vistos.has(chave))continue;
  vistos.add(chave);
  unicos.push(j);
 }
 const disponiveis=unicos.filter(elegivel);
 const previa=escalarOnzePosicionalTecnico(unicos,tecnico.formacao);
 const titulares=previa.titulares.map(({posicao,jogador,secundaria},i)=>jogador?{
  id:id(jogador),nome:jogador.nome||'Atleta sem nome',
  posicao:jogador.posicao||'—',setor:posicao,
  ovr:ovr(jogador),secundaria,vaga:i+1,
 }:{vaga:i+1,id:null,nome:null,setor:posicao});
 const banco=previa.banco.map(j=>({
  id:id(j),nome:j.nome||'Atleta sem nome',posicao:j.posicao||'—',ovr:ovr(j),
 }));
 return {
  formacao:previa.formacao,titulares,banco,
  indisponiveis:unicos.length-disponiveis.length,
  vagasAbertas:previa.vagasAbertas,
  totalDisponiveis:disponiveis.length,
 };
}
