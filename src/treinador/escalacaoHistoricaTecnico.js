import {elencoPainelTecnico} from './painelTecnico.js';
import {escalarOnzePosicionalTecnico} from './escalacaoPosicionalTecnico.js';

const id=j=>String(j?.mundoId??j?.id);
const numero=v=>Number.isFinite(v)?v:null;
const resumo=j=>({
 id:id(j),nome:j.nome||'Atleta sem nome',
 posicao:j.posicao||'—',ovr:numero(j.ovr??j.qualidade),
});

/**
 * Registra apenas a folha de jogo (11 vagas + até 7 reservas).
 *
 * Cada registro guarda nome e ID da época, permitindo rever a partida mesmo
 * após transferências ou aposentadoria. Não embute o mundo nem o atleta inteiro
 * no histórico. Sem elenco comprovável retorna null: não cria novos jogadores.
 */
export function escalacaoHistoricaTecnico(c={},t=c?.tecnico) {
 if(!t?.clube||t.tipoEquipe==='selecao')return null;
 const elenco=elencoPainelTecnico({...c,tecnico:t});
 if(!elenco.length)return null;
 const previsao=escalarOnzePosicionalTecnico(elenco,t.formacao);
 const titulares=previsao.titulares.map(({posicao,jogador,secundaria})=>({
  vaga:posicao,jogador:jogador?{...resumo(jogador),...(secundaria?{secundaria:true}:{})}:null,
 }));
 const banco=previsao.banco.map(resumo);
 return {
  versao:1,clube:t.clube,formacao:previsao.formacao,
  titulares,banco,vagasAbertas:previsao.vagasAbertas,
 };
}
