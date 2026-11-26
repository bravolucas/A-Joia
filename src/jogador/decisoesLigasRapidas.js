import {novoTecnico} from '../simulacao/tecnicosMundo.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';

export const ESTILOS = {
  '4-3-3': {vagas: {GOL:1, DEF:4, MEI:3, ATA:3}, ataque: 1, defesa: 0, rodagem: 1},
  '4-4-2': {vagas: {GOL:1, DEF:4, MEI:4, ATA:2}, ataque: 0, defesa: 1, rodagem: .8},
  '5-3-2': {vagas: {GOL:1, DEF:5, MEI:3, ATA:2}, ataque: -1, defesa: 2, rodagem: 1.2},
  '3-4-3': {vagas: {GOL:1, DEF:3, MEI:4, ATA:3}, ataque: 2, defesa: -1, rodagem: 1.4},
};
const formacoes = Object.keys(ESTILOS);

export function formacaoTecnico(tecnico) {
  if (!tecnico) return '4-3-3';
  if (ESTILOS[tecnico.formacao]) return tecnico.formacao;
  return formacoes[Math.floor(geradorTecnico(tecnico.id ?? tecnico.nome)() * formacoes.length)];
}

export function prepararDecisoesLigas(estado, memoria) {
  const tecnicos = {...estado.tecnicos};
  const semente = estado.codigo ?? estado.seed;
  const elencos = {...estado.elencos};
  const decisoes = {...estado.decisoes};
  const iniciarRodada = (liga, clubes, rodada, totalRodadas, tabela) => {
    if (!estado.elencos || !totalRodadas) return;
    for (const clube of clubes) {
      if (elencos[clube.nome]?.length) {
        tecnicos[clube.nome] ??= novoTecnico({...clube, forca:clube.elenco}, estado.ano - 1, semente);
      }
    }
    const inicio = estado.periodos?.[liga]?.inicio;
    const fim = estado.periodos?.[liga]?.fim;
    // A janela abre em janeiro nos calendários europeus e em julho nos demais.
    const data = inicio + (fim - inicio) * rodada / totalRodadas;
    const janela = inicio < 0 ? data >= 1 && data < 2 : data >= 7 && data < 8;

    const eventos = [...(decisoes[liga] || [])];
    for (const e of eventos.filter(x=>x.tipo==='emprestimo'&&Number.isFinite(x.minutosInicio))) {
      const minutos = (memoria[e.atleta]?.minutos ?? 0) - e.minutosInicio;
      const estreou = eventos.some(x=>x.historia===e.historia&&x.etapa==='estreia');
      const impacto = estreou && minutos >= 270 && rodada >= e.rodada+4;
      const etapa = impacto ? 'sequencia' : 'estreia';
      if (minutos <= 0 || eventos.some(x=>x.historia===e.historia&&x.etapa===etapa)) continue;
      eventos.push({tipo:'consequencia', clube:e.clube, historia:e.historia, etapa, rodada,
        texto:impacto
          ? `${e.nome} chegou a ${minutos} minutos por ${e.clube} desde o empréstimo.`
          : `${e.nome} estreou por ${e.clube} e já soma ${minutos} minutos pelo novo clube.`});
    }
    decisoes[liga] = eventos;

    const avaliarCargo = rodada >= 9 && rodada % 4 === 1;
    if (!janela && !avaliarCargo) return;
    const ordemPorForca = [...clubes].sort((a,b) => b.elenco - a.elenco);
    const ordemAtual = [...tabela.values()].sort((a,b) => b.pontos - a.pontos || b.saldoGols - a.saldoGols);

    for (const [esperado, clube] of ordemPorForca.entries()) {
      const nome = clube.nome;
      if (!elencos[nome]?.length) continue;
      const tecnico = tecnicos[nome];
      const atual = ordemAtual.findIndex(t => t.nome === nome);
      if (avaliarCargo && ordemAtual[atual].jogos >= 8 &&
          atual - esperado >= Math.max(4, clubes.length / 3) &&
          !eventos.some(e => e.tipo === 'tecnico' && e.clube === nome)) {
        const troca = novoTecnico({...clube, forca:clube.elenco}, estado.ano, semente);
        const alternativas = formacoes.filter(f => f !== formacaoTecnico(tecnico));
        troca.formacao = alternativas[Math.floor(geradorTecnico(troca.id)() * alternativas.length)];
        tecnicos[nome] = troca;
        eventos.push({tipo:'tecnico', rodada, clube:nome, tecnico, troca,
          texto:`${nome} contratou ${troca.nome} após cair para ${atual + 1}º. A equipe passa do ${formacaoTecnico(tecnico)} para o ${troca.formacao}.`});
      }

      if (!janela) continue;
      if (!eventos.some(e => e.tipo === 'observacao' && e.origem === nome)) {
        const jovem = elencos[nome].find(p => p.idade <= 22 && p.idade > 0 && !p.emprestado &&
          (memoria[p.id]?.forma ?? 0) >= 3 && (memoria[p.id]?.minutos ?? 0) >= 36 * (rodada - 1));
        const interessado = jovem && ordemPorForca.slice(0, esperado).find(outro => outro.elenco >= clube.elenco + 4 &&
          (elencos[outro.nome] || []).filter(p => p.setor === jovem.setor && p.ovr >= jovem.ovr).length <
            ESTILOS[formacaoTecnico(tecnicos[outro.nome])].vagas[jovem.setor] + 1);
        if (interessado) eventos.push({tipo:'observacao', rodada, clube:interessado.nome, origem:nome, atleta:jovem.id,
          texto:`${interessado.nome} passou a observar ${jovem.nome}, jovem que ganhou minutos e vem em boa fase no ${nome}.`});
      }
      if (eventos.some(e => e.tipo === 'emprestimo' && e.clube === nome)) continue;
      const lesionado = [...elencos[nome]].sort((a,b) => b.ovr - a.ovr).find(p =>
        (memoria[p.id]?.lesionadoAte ?? 0) >= rodada + 1 &&
        (memoria[p.id]?.minutos ?? 0) >= 90 * (rodada - 1) * .4 &&
        elencos[nome].filter(x => x.setor === p.setor && (memoria[x.id]?.lesionadoAte ?? 0) < rodada).length <=
          ESTILOS[formacaoTecnico(tecnicos[nome])].vagas[p.setor]);
      if (!lesionado) continue;
      let candidato, origem;
      for (const outro of ordemPorForca) {
        if (outro.nome === nome) continue;
        const entrada = (elencos[outro.nome] || []).filter(p => p.setor === lesionado.setor &&
          !p.emprestado && (memoria[p.id]?.lesionadoAte ?? 0) < rodada && !memoria[p.id]?.suspenso);
        // O cedente preserva titulares e uma opção de banco no setor.
        if (entrada.length <= ESTILOS[formacaoTecnico(tecnicos[outro.nome])].vagas[lesionado.setor] + 1) continue;
        for (const p of entrada) {
          if ((memoria[p.id]?.minutos ?? 0) >= 30 * (rodada - 1) || p.ovr < lesionado.ovr - 12) continue;
          if (!candidato || p.ovr > candidato.ovr) { candidato = p; origem = outro.nome; }
        }
      }
      if (!candidato) continue;
      elencos[origem] = elencos[origem].filter(p => p.id !== candidato.id);
      elencos[nome] = [...elencos[nome], {...candidato, emprestado:true}];
      eventos.push({tipo:'emprestimo', rodada, clube:nome, origem, atleta:candidato.id, nome:candidato.nome, historia:`${nome}|${candidato.id}|${rodada}`, etapa:'contratacao',
        minutosInicio:memoria[candidato.id]?.minutos??0, texto:`${nome} recebeu ${candidato.nome} por empréstimo de ${origem} até o fim da liga para cobrir a lesão de ${lesionado.nome}.`});
    }
    decisoes[liga] = eventos;
  };
  return {tecnicos, elencos, decisoes, iniciarRodada};
}
