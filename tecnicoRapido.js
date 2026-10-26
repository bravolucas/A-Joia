import { cartaAtualTecnico, tomarDecisaoTecnico, simularEtapaTecnico, proximaTemporadaTecnico, iniciarNoClubeIdolo, negociarContratoTecnico, reuniaoEmergenciaTecnico, definirEstiloTecnico, passarAnoDesempregado } from './tecnico.js';

export const RITMOS_TECNICO = [{ id: 'intenso', nome: 'Intenso', anos: 1 }, { id: 'normal', nome: 'Normal', anos: 2 }, { id: 'expresso', nome: 'Expresso', anos: 3 }];
export const ritmoTecnico = t => RITMOS_TECNICO.find(r => r.id === t.ritmoRapido) || RITMOS_TECNICO[1];

// O controlador só recebe carreiras técnicas. Cada ano mantém o motor e os registros originais.
export function avancarTecnicoRapido(c, acao, rng = Math.random) {
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  let out = structuredClone(c);
  let t = out.tecnico;
  if (acao.tipo === 'ritmo') {
    if (!RITMOS_TECNICO.some(r => r.id === acao.id)) throw new Error('Ritmo inválido.');
    t.ritmoRapido = acao.id;
    return out;
  }
  let restantes = t.anosRestantesRapido || ritmoTecnico(t).anos;
  if (acao.tipo === 'clube') out = iniciarNoClubeIdolo(out, acao.nome);
  else if (acao.tipo === 'proposta') {
    out = negociarContratoTecnico(out, acao.nome, 'prudente', rng);
    if (!out.tecnico.ultimaNegociacao?.aceita) return out;
    out = proximaTemporadaTecnico(out);
    restantes = ritmoTecnico(out.tecnico).anos;
  } else if (acao.tipo === 'reuniao') out = reuniaoEmergenciaTecnico(out, acao.id, rng);
  else if (acao.tipo === 'esperar') return passarAnoDesempregado(out, rng);
  else if (acao.tipo === 'estilo') out = definirEstiloTecnico(out, acao.id);
  else if (acao.tipo === 'decisao') out = tomarDecisaoTecnico(out, acao.id, rng);
  else if (acao.tipo !== 'continuar') throw new Error('Ação inválida.');
  t = out.tecnico;
  if (t.demitido || t.desempregado) throw new Error('Escolha um novo clube.');
  if (!t.clubeInicialEscolhido && !t.temporadas.length && t.opcoesInicio?.length) throw new Error('Escolha o clube inicial.');
  // Quatro cartas antigas deixam de ser uma barreira. A comissão resolve as restantes,
  // com consequências e registro explícito, sem atribuir essas escolhas ao usuário.
  while (restantes > 0) {
    if (out.tecnico.fase === 'resultado') out = proximaTemporadaTecnico(out);
    while (cartaAtualTecnico(out.tecnico)) {
      const carta = cartaAtualTecnico(out.tecnico);
      const opcao = carta.opcoes[Math.min(carta.opcoes.length - 1, Math.floor(rng() * carta.opcoes.length))];
      out = tomarDecisaoTecnico(out, opcao.id, rng);
      out.tecnico.decisoes.at(-1).automatica = true;
    }
    while (out.tecnico.fase === 'pretemporada' && !out.tecnico.reuniaoPendente) out = simularEtapaTecnico(out, rng);
    if (out.tecnico.reuniaoPendente) break;
    restantes--;
    if (out.tecnico.demitido || out.tecnico.desempregado) { restantes = 0; break; }
  }
  out.tecnico.anosRestantesRapido = restantes;
  out.tecnico.fluxoRapido = 1;
  return out;
}
