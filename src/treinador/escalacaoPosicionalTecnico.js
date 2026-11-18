import {FORMACAO_433} from '../dados/data.js';
import {escalarVagasAptas} from '../simulacao/escalacaoApta.js';
import {normalizarPosicao} from '../simulacao/profundidadeElenco.js';

/**
 * Posições individuais por formação (11 vagas reais, em ordem de escalação).
 * 4-4-2: meio-campo em losango; 3-5-2: 3 zagueiros, 2 volantes,
 * 2 meias centrais e 1 meia ofensivo. Os totais por setor reproduzem os
 * pesos táticos existentes e não mudam o modelo probabilístico da partida.
 */
export const FORMACOES_POSICIONAIS_TECNICO=Object.freeze({
 '4-3-3':Object.freeze([...FORMACAO_433]),
 '4-4-2':Object.freeze(['GOL','LD','ZAG','ZAG','LE','VOL','MC','MC','MEI','ATA','ATA']),
 '3-5-2':Object.freeze(['GOL','ZAG','ZAG','ZAG','VOL','VOL','MC','MC','MEI','ATA','ATA']),
});

const disponivel=j=>j&&!j.aposentado&&!j.indisponivel&&!j.suspenso&&
 !(typeof j.lesao==='object'&&j.lesao?.jogosRestantes>0);
const identidade=j=>String(j.mundoId??j.id);
const over=j=>Number.isFinite(j.ovr)?j.ovr:Number.isFinite(j.qualidade)?j.qualidade:0;

/**
 * Onze individualizado por posição, com banco de no máximo sete atletas
 * incluindo um goleiro reserva quando houver. NÃO gera jogadores,
 * NÃO improvisa sem aptidão e NÃO grava a escalação no estado do treinador.
 * Atletas históricos sem posição comprovável ficam no banco, não viram
 * automaticamente laterais ou centroavantes.
 */
export function escalarOnzePosicionalTecnico(elenco=[],formacao='4-4-2'){
 const idFormacao=Object.hasOwn(FORMACOES_POSICIONAIS_TECNICO,formacao)?formacao:'4-4-2';
 const vagas=FORMACOES_POSICIONAIS_TECNICO[idFormacao];
 const atletas=[],identidades=new Set();
 for(const atleta of Array.isArray(elenco)?elenco:[]){
  if(!disponivel(atleta)||atleta.id==null)continue;
  const id=identidade(atleta);
  if(identidades.has(id))continue;
  identidades.add(id);
  atletas.push(atleta);
 }
 const correspondencias=escalarVagasAptas(atletas,vagas);
 const titulares=correspondencias.map((j,i)=>({
   posicao:vagas[i],
   jogador:j?{...j}:null,
   secundaria:!!j?.secundaria,
 }));
 const titularesIds=new Set(titulares.filter(t=>t.jogador).map(t=>identidade(t.jogador)));
 const candidatos=atletas.filter(j=>!titularesIds.has(identidade(j)))
  .sort((a,b)=>over(b)-over(a)||identidade(a).localeCompare(identidade(b)));
 const goleiroReserva=candidatos.find(j=>normalizarPosicao(j.posicao)==='GOL');
 const banco=(goleiroReserva?[goleiroReserva,...candidatos.filter(j=>j!==goleiroReserva)]:candidatos)
  .slice(0,7);
 return {formacao:idFormacao,titulares,banco,vagasAbertas:titulares.filter(t=>!t.jogador).length};
}
