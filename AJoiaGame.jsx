import React, { useState, useMemo, useEffect } from "react";
import { montarSave, salvarLocal, carregarLocal, apagarLocal, listarSaves, existeAlgumSave, baixarSave, lerArquivoSave, formatarData, normalizarSave, SLOTS } from "./save.js";
import { ANO_INICIO, APELIDOS_TORCIDA, ATTR_SLOTS, CAMINHOS_POS_CARREIRA, CATEGORIAS_HISTORICO, CLUBES, COMPS_PAIS, COSMETICOS, CRITERIOS_MEMORAVEL, DECISOES_JOGO, EIXOS_APROVACAO, EMPRESARIOS, ESTADUAIS, FAN_MSGS_NEG, FAN_MSGS_POS, FASES_COPA_MUNDO, FASES_COPINHA, FASES_POR_COMPETICAO, LANCES_POR_POSICAO, LENDAS, LIGAS, LOJA_ITENS, MARCOS_ESPECIAIS, METAS_COMPETICAO, NACIONALIDADES, NIVEIS, NIVEIS_INSIGNIA, NUM_ATTRS, OFERTAS_PATROCINIO, ORIGENS, PALMARES_HISTORICO, PAPEIS_TATICOS, PEDIDOS_DIRETORIA, PEDIDOS_TECNICO, PERSONALIDADES, PESO_OSTENTACAO, POSICOES, POSTURAS_JOGO, POS_GRUPO, PREPARACOES_SEMANA, REGRAS_CARTAO, RESPOSTAS_FA, RESPOSTAS_HATER, RIVAIS_PREMIO, ROTINAS_FISICAS, TIPOS_MARCO, TIPOS_NOTICIA, TIPOS_RELACAO, TONS_COLETIVA, TRAITS_DISPONIVEIS, multEfeitoInsignia, nomeDosTitulos, palmaresInicialDe, somaEfeitoInsignia } from "./data.js";
import { agregarPorCompeticao, ajustarMeta, ajustesDoContexto, analisarJogos, aplicarCartao, aplicarEfeitoCosmetico, aplicarEfeitosVestiario, aplicarLesao, aplicarPreparacaoSemana, artilhariaLiga, attrsIniciais, atualizarTraits, avaliarApelido, avaliarConvocacao, avaliarMetaIndividual, avaliarMetasCompeticao, avaliarPermanenciaTecnico, avaliarPremios, bonusParceria, bonusTraitsMataMata, calcOVR, calcularSucessoDecisivo, calcularSucessoFalta, canticoDoApelido, categorizarEvento, chanceFaseCopaMundo, chanceFaseGenerica, checarMarcosEspeciais, clamp, clampR, clubeAtual, competicaoSelecaoDoAno, concorrentesSelecao, creditarTitulo, descreverMetaPromessa, detectarJogosMemoraveis, distribuirRodadasNaJanela, distribuirTitulosDoMundo, dividirPorCompeticao, efeitosOstentacao, emojiClube, empresarioPorId, encaixeNoEstilo, escalacaoProvavel, escolherRivalDoMundo, estadoInicialClubes, estiloTecnico, evoluirAtributos, evoluirElenco, faixaValor, forcaEfetivaClube, formatarDinheiro, gerarContextoLance, gerarElenco, gerarMetaIndividual, gerarMetasCompeticao, gerarMundoJogadores, gerarNoticias, gerarPlacar, gerarPromessaTecnico, gerarRecordeClube, gerarRelacoesVestiario, gerarTecnico, gerarTecnicoSelecao, girarLigas, imagemPost, janelasPorLiga, labelFaseCopaMundo, labelFaseGenerica, ligasOrdenadas, logHist, marcasDeGolAtingidas, melhoresEPioresConfrontos, nacDe, nivelDaInsignia, nivelFragilidade, noticia, ovrHexGradiente, palmaresDoClube, patrocinadoresDisponiveis, pick, poisson, pontosCampanhaCopa, poolRivalPorOvr, potencialDaOrigem, precoAjustado, promessaPorId, rand, rankingBolaDeOuro, rankingPorPosicao, registrarConfrontos, registrarMarco, resumoConfronto, riscoLesao, rodarEventoClube, salarioClube, scoreInteresseClube, seguidoresBase, simularSelecao, simularTemporada, simularTemporadaMundo, sortearAdversario, sortearCartoes, sortearConcorrente, sortearPorInteresse, sortearRival, statsNoClube, statsSelecao, statusNoTime, statusSelecao, temporadaLabel, tierDoTeste, tierInfo, tierTorcida, tipoResultadoFalta, todosEmpresarios, todosJogosCarreira, valorDeMercado, valorMundo, veredito } from "./lib.js";
import { AttrBarDelta, AttrRadar, BallIcon, Button, CalendarioTemporadaPopup, Card, ClubDot, Confetti, CountUp, CurvaEvolucao, Diamond, FichaPartida, FreeKickMini, GoalMini, JogadorCard, LeitorNoticia, PasseMini, PlayerFutCard, PopupOverlay, SilhuetaJogador, Sparkle, TimingBar, TrophyIcon } from "./components.jsx";

export default function AJoiaGame() {
  const [stage, setStage] = useState("intro");
  const [introFase, setIntroFase] = useState("splash");
  const [zoomingIntro, setZoomingIntro] = useState(false);
  useEffect(() => {
    if (stage !== "intro" || introFase !== "splash") return;
    const t1 = setTimeout(() => setZoomingIntro(true), 1800);
    const t2 = setTimeout(() => setIntroFase("form"), 2350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage, introFase]);
  const [nome, setNome] = useState("");
  const [posicao, setPosicao] = useState(null);
  const [nacionalidade, setNacionalidade] = useState("BRA");
  const [personalidade, setPersonalidade] = useState(null);
  const [pernaDominante, setPernaDominante] = useState("destro");
  const [clubeCoracao, setClubeCoracao] = useState(null);
  const [modo, setModo] = useState("classico");
  const [origem, setOrigem] = useState(null);

  const [ordemLendas, setOrdemLendas] = useState([]);
  const [idxLenda, setIdxLenda] = useState(0);
  const [potencial, setPotencial] = useState({});
  const [roubos, setRoubos] = useState({});
  const [trocaUsada, setTrocaUsada] = useState(false);

  // teste de base
  const [testeTentativas, setTesteTentativas] = useState([]);
  const [testeTentativaAtual, setTesteTentativaAtual] = useState(null);
  const [testeFaltas, setTesteFaltas] = useState([]);
  const [testeFaltaAtual, setTesteFaltaAtual] = useState(null);
  const [testePasses, setTestePasses] = useState([]);
  const [testePasseAtual, setTestePasseAtual] = useState(null);
  const [testeFase, setTesteFase] = useState("penalti");
  const [testeReflexo, setTesteReflexo] = useState([]);
  const [testeResultado, setTesteResultado] = useState(null);
  const [copinhaResultado, setCopinhaResultado] = useState(null);
  const [copinhaFaseIdx, setCopinhaFaseIdx] = useState(0);
  const [copinhaTentativa, setCopinhaTentativa] = useState(null);
  const [propostasIniciais, setPropostasIniciais] = useState([]);
  const [clubeSelecionadoInicial, setClubeSelecionadoInicial] = useState(null);
  const [numerosBloqueados, setNumerosBloqueados] = useState(() => new Set());
  const [numeroEscolhidoInicial, setNumeroEscolhidoInicial] = useState(null);

  const [carreira, setCarreira] = useState(null);
  const [temporadas, setTemporadas] = useState([]);
  const [decisao, setDecisao] = useState(null);
  const [decisaoResultado, setDecisaoResultado] = useState(null);
  const [pendingSponsor, setPendingSponsor] = useState(null);
  const [pendingLegendFollow, setPendingLegendFollow] = useState(null);
  const [treinoDesafio, setTreinoDesafio] = useState(null);
  const [treinoResultado, setTreinoResultado] = useState(null);
  const [itensCompradosAberto, setItensCompradosAberto] = useState(false);
  const [respostaFa, setRespostaFa] = useState(null);
  const [pendingAbordagem, setPendingAbordagem] = useState(false);
  const [pendingExpectativa, setPendingExpectativa] = useState(null);
  const [pendingTecnico, setPendingTecnico] = useState(null);
  const [pendingColetiva, setPendingColetiva] = useState(false);
  const [pendingTierUpgrade, setPendingTierUpgrade] = useState(null);
  const [pendingCompeticao, setPendingCompeticao] = useState(null);
  const [competicaoFila, setCompeticaoFila] = useState([]);
  const [competicaoIndice, setCompeticaoIndice] = useState(0);
  const [competicaoCtx, setCompeticaoCtx] = useState(null);
  const [competicaoResultado, setCompeticaoResultado] = useState(null);
  const [copaMundoTentativa, setCopaMundoTentativa] = useState(null);
  const [lojaCategoriaAberta, setLojaCategoriaAberta] = useState(null);
  const [pendingTrocaNumero, setPendingTrocaNumero] = useState(null);
  const [perfilInvestimento, setPerfilInvestimento] = useState("moderado");
  const [tabelaExpandida, setTabelaExpandida] = useState(false);
  const [jogosExpandido, setJogosExpandido] = useState(false);
  const [modoSimulacao, setModoSimulacao] = useState("completa");
  const [pendingLanceJogo, setPendingLanceJogo] = useState(null);
  const [lanceMiniResultado, setLanceMiniResultado] = useState(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [jogadorCardAberto, setJogadorCardAberto] = useState(false);
  const [filtroHistorico, setFiltroHistorico] = useState("todos");
  const [resultadoAcao, setResultadoAcao] = useState(null);
  const [acoesPopupAberto, setAcoesPopupAberto] = useState(false);
  const [treinoPopupAberto, setTreinoPopupAberto] = useState(false);
  const [centralMedicaAberta, setCentralMedicaAberta] = useState(false);
  const [negociacaoContratoAtual, setNegociacaoContratoAtual] = useState(null);
  const [popupTemporada, setPopupTemporada] = useState(null);
  const [popupClube, setPopupClube] = useState(null);
  const [abaLegado, setAbaLegado] = useState("coletivos");
  const [popupPremio, setPopupPremio] = useState(null);
  const [resultadoInvestimento, setResultadoInvestimento] = useState(null);
  const [contratoMenuAberto, setContratoMenuAberto] = useState(false);
  const [tecnicoMenuAberto, setTecnicoMenuAberto] = useState(false);
  const [conversaBanco, setConversaBanco] = useState(null);
  const [empresarioMenuAberto, setEmpresarioMenuAberto] = useState(false);
  const [mundo, setMundo] = useState(null);
  const [mundoAba, setMundoAba] = useState("bola");
  const [caminhoPos, setCaminhoPos] = useState(null);
  const [elencoAberto, setElencoAberto] = useState(false);
  const [inboxFiltro, setInboxFiltro] = useState("todas");
  const [vestiarioAberto, setVestiarioAberto] = useState(false);
  const [savesAberto, setSavesAberto] = useState(false);
  const [avisoSave, setAvisoSave] = useState(null);
  const [temSave, setTemSave] = useState(false);
  const [fichaJogo, setFichaJogo] = useState(null);
  const [noticiaAberta, setNoticiaAberta] = useState(null);
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [calendarioMesAberto, setCalendarioMesAberto] = useState(0);
  const [resumoCarreiraAberto, setResumoCarreiraAberto] = useState(false);
  const premiosIndividuaisAgrupados = useMemo(() => {
    const grupos = {};
    temporadas.forEach((t) => t.premios.forEach((p) => { if (p.doJogador) { if (!grupos[p.nome]) grupos[p.nome] = []; grupos[p.nome].push({ ano: t.temporadaLabel, clube: t.clube }); } }));
    return grupos;
  }, [temporadas]);
  const titulosColetivosAgrupados = useMemo(() => {
    const grupos = {};
    temporadas.forEach((t) => t.titulosLista.forEach((tit) => { if (!grupos[tit]) grupos[tit] = []; grupos[tit].push({ ano: t.temporadaLabel, clube: t.clube }); }));
    return grupos;
  }, [temporadas]);
  const [popupHistoricoAberto, setPopupHistoricoAberto] = useState(false);
  const [awardsPopup, setAwardsPopup] = useState(null);
  const [posTemporada, setPosTemporada] = useState(null);
  const [janela, setJanela] = useState(null);
  const [fim, setFim] = useState(null);
  const [aba, setAba] = useState("carreira");

  const slotsVazios = ATTR_SLOTS.filter((s) => potencial[s.id] === undefined);
  const lendaAtual = ordemLendas[idxLenda];
  const draftCompleto = slotsVazios.length === 0;

  function confirmarOrigem() {
    if (!origem) return;
    const pot = potencialDaOrigem(origem, posicao);
    setPotencial(pot);
    irParaTeste();
  }
  function roubarAtributo(slotId) {
    setPotencial((a) => ({ ...a, [slotId]: lendaAtual.stats[slotId] }));
    setRoubos((r) => ({ ...r, [slotId]: lendaAtual.nome }));
    setIdxLenda((i) => i + 1);
  }
  function trocaAsCegas() { if (trocaUsada || modo !== "classico") return; setTrocaUsada(true); setIdxLenda((i) => i + 1); }

  const ovrPotencial = useMemo(() => {
    if (Object.keys(potencial).length === 0 || !posicao) return null;
    return calcOVR({ velocidade: 50, finalizacao: 50, passe: 50, drible: 50, defesa: 50, fisico: 50, fintas: 2, pernaRuim: 2, ...potencial }, posicao);
  }, [potencial, posicao]);

  function irParaTeste() { setTesteTentativas([]); setTesteFaltas([]); setTesteFaltaAtual(null); setTestePasses([]); setTestePasseAtual(null); setTesteReflexo([]); setTesteFase("penalti"); setTesteResultado(null); setStage("teste"); }
  function iniciarCopinha() {
    setCopinhaFaseIdx(0);
    setCopinhaTentativa(null);
    setCopinhaResultado(null);
  }
  function baterPenaltiCopinha(zona) {
    const chance = clamp((potencialFinal.finalizacao + potencialFinal.pernaRuim * 3) / 155 + 0.3, 0.28, 0.82);
    const gol = Math.random() < chance;
    const tipo = gol ? "Gol" : Math.random() < 0.6 ? "Defesa" : "Pra fora";
    setCopinhaTentativa({ zona, gol, tipo });
  }
  function continuarCopinha() {
    const passou = copinhaTentativa.gol;
    const faseAtual = FASES_COPINHA[copinhaFaseIdx];
    setCopinhaTentativa(null);
    if (!passou) {
      setCopinhaResultado({ label: `Eliminado n${faseAtual.startsWith("Fase") ? "a" : "as"} ${faseAtual}`, texto: `A caminhada na Copinha pela base do ${clubeSelecionadoInicial?.nome} parou aqui, mas a experiência não se perde.`, bonus: copinhaFaseIdx * 2 });
    } else if (copinhaFaseIdx >= FASES_COPINHA.length - 1) {
      setCopinhaResultado({ label: "CAMPEÃO da Copa São Paulo de Futebol Júnior!", texto: `Levantou a taça mais cobiçada da base brasileira pela base do ${clubeSelecionadoInicial?.nome} — seu nome já corre nos jornais.`, bonus: 10, titulo: true });
    } else {
      setCopinhaFaseIdx((i) => i + 1);
    }
  }

  const potencialFinal = useMemo(() => ({ velocidade: 50, finalizacao: 50, passe: 50, drible: 50, defesa: 50, fisico: 50, fintas: 2, pernaRuim: 2, ...potencial }), [potencial]);

  function baterTesteBase(zona) {
    const chance = clamp(potencialFinal.finalizacao / 155 + 0.16, 0.12, 0.58);
    const gol = Math.random() < chance;
    const tipo = gol ? "Gol" : Math.random() < 0.6 ? "Defesa" : "Pra fora";
    setTesteTentativaAtual({ zona, gol, tipo });
  }
  function continuarTesteBase() {
    const nova = [...testeTentativas, testeTentativaAtual];
    setTesteTentativas(nova);
    setTesteTentativaAtual(null);
    if (nova.length >= 3) setTesteFase("falta");
  }
  function baterTesteFalta(zona) {
    const chance = clamp((potencialFinal.finalizacao * 0.65 + potencialFinal.drible * 0.35) / 155 + 0.12, 0.1, 0.5);
    const gol = Math.random() < chance;
    const tipo = tipoResultadoFalta(gol, zona);
    setTesteFaltaAtual({ zona, gol, tipo });
  }
  function continuarTesteFalta() {
    const nova = [...testeFaltas, testeFaltaAtual];
    setTesteFaltas(nova);
    setTesteFaltaAtual(null);
    if (nova.length >= 3) setTesteFase("passe");
  }
  function resolverTestePasse(r, companheiro, cena) {
    setTestePasseAtual({ r, companheiro, cena });
  }
  function continuarTestePasse() {
    const nova = [...testePasses, testePasseAtual];
    setTestePasses(nova);
    setTestePasseAtual(null);
    if (nova.length >= 3) setTesteFase("reflexo");
  }
  function baterTesteReflexo(acerto) {
    const nova = [...testeReflexo, { acerto }];
    setTesteReflexo(nova);
    if (nova.length >= 3) {
      const acertosPenalti = testeTentativas.filter((t) => t.gol).length;
      const acertosFalta = testeFaltas.filter((t) => t.gol).length;
      const acertosPasse = testePasses.filter((t) => t.r.gol).length;
      const acertosReflexo = nova.filter((t) => t.acerto).length;
      const total = acertosPenalti + acertosFalta + acertosPasse + acertosReflexo;
      // A peneira lapida o potencial: mandar bem numa habilidade eleva um pouco o teto dela
      setPotencial((pot) => {
        const p = { ...pot };
        const bump = (attr, acertos) => { p[attr] = clampR((p[attr] ?? 64) + acertos * 2, 55, 94); };
        bump("finalizacao", acertosPenalti + Math.round(acertosFalta / 2));
        bump("drible", acertosFalta);
        bump("passe", acertosPasse);
        bump("defesa", acertosReflexo);
        return p;
      });
      const tier = tierDoTeste(total);
      const pool = CLUBES.filter((c) => (c.liga === "brasileirao" || c.liga === "serieB") && c.forca >= tier.min && c.forca <= tier.max);
      const escolhidos = []; const p2 = [...pool];
      while (escolhidos.length < 3 && p2.length) escolhidos.push(p2.splice(rand(0, p2.length - 1), 1)[0]);
      setPropostasIniciais(escolhidos);
      setTesteResultado({ acertosPenalti, acertosFalta, acertosPasse, acertosReflexo, total, tier });
      setTesteFase("feito");
    }
  }

  function gerarTabelaLiga(clube, posLigaJogador) {
  const clubesDaLiga = CLUBES.filter((c) => c.liga === clube.liga);
  const n = Math.max(clubesDaLiga.length, posLigaJogador);
  const outros = clubesDaLiga.filter((c) => c.nome !== clube.nome).map((cl) => ({ clube: cl, pontos: Math.round(clamp(cl.forca * 0.9 + rand(-15, 15), 20, 100)) })).sort((a, b) => b.pontos - a.pontos);
  const posFinal = clampR(posLigaJogador, 1, n);
  const linhaJogador = { clube, pontos: null, jogador: true };
  outros.splice(Math.min(posFinal - 1, outros.length), 0, linhaJogador);
  return outros.map((o, i) => ({ ...o, posicao: i + 1 }));
}

function gerarBloqueadosNumero() { const s = new Set(); while (s.size < 18) s.add(rand(1, 28)); return s; }
  function escolherClubeInicial(c) { setClubeSelecionadoInicial(c); setNumerosBloqueados(gerarBloqueadosNumero()); }
  function confirmarNumeroInicial(n) { setNumeroEscolhidoInicial(n); iniciarCopinha(); }

  function iniciarCarreira(clubeEscolhido, numero) {
    const attrsIni = attrsIniciais(potencialFinal);
    const persona = PERSONALIDADES.find((p) => p.id === personalidade) || PERSONALIDADES[3];
    const c = {
      attrs: attrsIni, attrsAnteriores: { ...attrsIni }, potencial: potencialFinal, posicao, personalidade, nacionalidade, clubeCoracao, pernaDominante, origem: origem?.id,
      idade: 16, clube: clubeEscolhido, forma: 0, anoNoClube: 0,
      gols: 0, assist: 0, melhorEmCampo: 0, titulos: 0, bolasDeOuro: 0, premiosIndividuais: 0, copasDoMundo: 0,
      picoOvr: calcOVR(attrsIni, posicao), anosDesdeCopa: rand(0, 3), fama: (personalidade === "midiatico" ? 25 : 12) + (copinhaResultado?.bonus || 0),
      torcidaPorClube: { [clubeEscolhido.nome]: 40 }, cofre: 0, extrato: [], patrocinio: null, posses: [], staff: {}, investimentosClube: {}, pontosCopa: 0,
      camisaPorClube: { [clubeEscolhido.nome]: [numero] }, titulosPorClube: {}, titulosSelecao: [], clubesInteresse: [], contrato: null,
      seguidores: Math.round(seguidoresBase(calcOVR(attrsIni, posicao))),
      desgaste: 0, energia: 100, abordagem: null, focoTreino: null, treinouPesado: false, emprestimo: false, clubeOrigemEmprestimo: null,
      historico: [], titulosLista: [], rivalPosicao: pick(poolRivalPorOvr(calcOVR(attrsIni, posicao))), rivalBolasDeOuro: 0, tecnicoConfianca: 60, relacaoDiretoria: 40, calorMidia: 20, expectativa: null, posicoesAprendidas: [posicao], empresarioUsado: {}, papelTatico: "padrao", cosmeticosDesbloqueados: [], postSocialFeito: false,
      entrosamento: 20, elencoMoral: 60, titularidade: 100, concorrente: sortearConcorrente(clubeEscolhido), relacaoPatrocinadores: 50, traits: [], streaksTraits: {},
      empresario: { id: "iniciante", restantes: 3 },
    };
    if (origem?.aplicar) origem.aplicar(c);
    if (origem) logHist(c, `Origem: ${origem.nome}. ${origem.perk}`);
    c.marcos = []; c.statsPorClube = {}; c.recordesClube = { [clubeEscolhido.nome]: gerarRecordeClube(clubeEscolhido) };
    registrarMarco(c, "estreia", `Estreou como profissional pelo ${clubeEscolhido.nome}, aos 16 anos, vestindo a camisa ${numero}.`);
    // A campanha na Copa São Paulo entra na história desde o primeiro dia
    if (copinhaResultado) {
      logHist(c, `🌟 Copa São Paulo de Futebol Júnior pelo ${clubeEscolhido.nome}: ${copinhaResultado.label}. ${copinhaResultado.texto}`);
      registrarMarco(c, copinhaResultado.titulo ? "titulo" : "estreia", `Copa São Paulo: ${copinhaResultado.label} com a camisa do ${clubeEscolhido.nome}.`, "Copinha");
      c.copinhaCampanha = { label: copinhaResultado.label, texto: copinhaResultado.texto, clube: clubeEscolhido.nome, titulo: !!copinhaResultado.titulo };
      c.inbox = [{ ...noticia("destaque", `Copa São Paulo: ${copinhaResultado.label}`, `${copinhaResultado.texto} Foi a primeira vitrine da sua carreira, com a camisa do ${clubeEscolhido.nome}.`, 2), idade: 16, temporada: "Base" }];
    }
    // cria o mundo de jogadores que vai viver em paralelo à sua carreira
    const novoMundo = gerarMundoJogadores();
    setMundo(novoMundo);
    const rivalReal = escolherRivalDoMundo(novoMundo, calcOVR(attrsIni, posicao));
    if (rivalReal) { c.rivalPosicao = rivalReal.nome; c.rivalId = rivalReal.id; }
    c.elenco = gerarElenco(clubeEscolhido, novoMundo, posicao);
    c.concorrente = sortearConcorrente(clubeEscolhido, c.elenco, posicao);
    c.tecnico = gerarTecnico(clubeEscolhido);
    c.relacoes = gerarRelacoesVestiario(c.elenco, posicao, 16);
    setCarreira(c);
    setTemporadas([]); setFim(null); setStage("carreira"); setAba("carreira");
  }

  function getTorcida(c, clubeNome) { return c.torcidaPorClube?.[clubeNome] ?? 40; }
  function setTorcidaClube(c, clubeNome, delta) {
    const atual = getTorcida(c, clubeNome);
    c.torcidaPorClube = { ...c.torcidaPorClube, [clubeNome]: clampR(atual + delta, 0, 100) };
  }

  function jogarTemporada(clubeNovo, tipoTransfer, duracao, numero, contrato) {
    let c = { ...carreira };
    if (clubeNovo) {
      const ligaAntiga = c.clube.liga;
      const clubeAntigoNome = c.clube.nome;
      if (tipoTransfer === "emprestimo") { c.clubeOrigemEmprestimo = c.clube; c.emprestimo = true; c.emprestimoAnosRestantes = duracao || 1; logHist(c, `Emprestado ao ${clubeNovo.nome} (${LIGAS[clubeNovo.liga].nome}) por ${duracao || 1} temporada(s).`); }
      else { c.emprestimo = false; c.clubeOrigemEmprestimo = null; logHist(c, `Transferido para o ${clubeNovo.nome} (${LIGAS[clubeNovo.liga].nome}).`); }
      // Estrutura do Clube é investimento local — ao sair, o que foi construído lá fica lá (reseta pro jogador)
      if (clubeAntigoNome !== clubeNovo.nome) {
        const tinhaEstrutura = (c.posses || []).some((p) => p.categoria === "Estrutura do Clube" && p.clubeDono === clubeAntigoNome);
        if (tinhaEstrutura) {
          c.posses = (c.posses || []).filter((p) => !(p.categoria === "Estrutura do Clube" && p.clubeDono === clubeAntigoNome));
          c.investimentosClube = { ...(c.investimentosClube || {}), [clubeAntigoNome]: 0 };
          logHist(c, `Os investimentos de estrutura feitos no ${clubeAntigoNome} ficam por lá — força extra zerada com a saída.`);
        }
      }
      c.clube = clubeNovo; c.anoNoClube = 0;
      c.elenco = gerarElenco(clubeNovo, mundo, c.posicao);
      c.recordesClube = { ...(c.recordesClube || {}), [clubeNovo.nome]: (c.recordesClube || {})[clubeNovo.nome] || gerarRecordeClube(clubeNovo) };
      registrarMarco(c, "transferencia", `${tipoTransfer === "emprestimo" ? "Emprestado ao" : "Assinou com o"} ${clubeNovo.nome} (${LIGAS[clubeNovo.liga].nome}).`, clubeNovo.nome);
      c.entrosamento = clampR(15 + somaEfeitoInsignia(c, "entrosamentoNovo"), 0, 100); c.titularidade = 100; c.concorrente = sortearConcorrente(clubeNovo, c.elenco, c.posicao);
      c.tecnico = gerarTecnico(clubeNovo);
      c.relacoes = gerarRelacoesVestiario(c.elenco, c.posicao, c.idade);
      c.tecnicoConfianca = clampR(55 + encaixeNoEstilo(c) * 1.2, 25, 85);
      logHist(c, `No novo clube quem manda é ${c.tecnico.nome} (${estiloTecnico(c.tecnico.estilo).nome}).`);
      if (clubeNovo.liga !== ligaAntiga) {
        const novoRival = sortearRival(calcOVR(c.attrs, c.posicao, c.papelTatico), c.rivalPosicao);
        c.rivalPosicao = novoRival; c.rivalBolasDeOuro = Math.max(0, Math.round((c.rivalBolasDeOuro || 0) * 0.4));
        logHist(c, `Na nova liga, ${novoRival} desponta como seu novo rival direto na briga por prêmios.`);
      }
      if (contrato) { c.contrato = { ...contrato, restantes: contrato.anos }; logHist(c, `Assinou contrato de ${contrato.anos} anos (salário $${formatarDinheiro(contrato.salario)}, multa $${formatarDinheiro(contrato.multa)}, bônus $${formatarDinheiro(contrato.bonusGol)}/gol).`); }
      if (c.torcidaPorClube[clubeNovo.nome] === undefined) c.torcidaPorClube = { ...c.torcidaPorClube, [clubeNovo.nome]: 40 };
      if (numero) { c.camisaPorClube = { ...c.camisaPorClube, [clubeNovo.nome]: [...new Set([...(c.camisaPorClube?.[clubeNovo.nome] || []), numero])] }; logHist(c, `Passou a vestir a camisa ${numero} no ${clubeNovo.nome}.`); }
      if (!(c.clubeCoracao && clubeNovo.nome === c.clubeCoracao.nome)) { c.seguidores = Math.round((c.seguidores || 10000) * 0.93); logHist(c, "A saída pesou com uma parte da torcida — perdeu alguns seguidores (recuperáveis)."); }
    }
    setJanela(null); setPosTemporada(null); setCarreira(c); setTreinoPopupAberto(false); setAcoesPopupAberto(false); setResultadoAcao(null);
    setPosTemporada({ ok: true, ...gerarBloqueios() });
  }
  function iniciarTemporada() {
    setPendingAbordagem(true);
  }
  function escolherAbordagem(tipo) {
    let c = { ...carreira };
    c.attrsAnteriores = { ...c.attrs };
    c.noitadasTemporada = 0;
    c.copinhaJogadaTemporada = false;
    c.abordagem = tipo;
    c.postSocialFeito = false;
    c.tecnicoAcoesTemporada = 0;
    // O técnico propõe um pacto pra temporada (nem toda temporada tem)
    c.promessaTecnico = Math.random() < 0.6 ? gerarPromessaTecnico(c) : null;
    c.expectativa = gerarMetaIndividual(c);
    c.metasCompeticao = gerarMetasCompeticao(c);
    setCarreira(c);
    setPendingAbordagem(false);
    const roll = Math.random();
    if (roll < 0.32) setDecisao(pick(DECISOES_JOGO));
    else if (roll < 0.44) setPendingSponsor(pick(patrocinadoresDisponiveis(c)));
    else if (roll < 0.56) setPendingLegendFollow(pick(LENDAS).nome);
    else if (roll < 0.68) setPendingTecnico(pick(PEDIDOS_TECNICO));
    else if (roll < 0.8) setPendingColetiva(true);
    else resolverTemporada(c, {});
  }
  function negociarMeta(delta) {
    const c = { ...carreira };
    c.expectativa = ajustarMeta(c.expectativa, delta);
    setCarreira(c);
  }
  function resolverColetiva(tom) {
    const c = { ...carreira };
    c.fama = clamp(c.fama + (tom.efeito.fama || 0), 0, 100);
    c.calorMidia = clampR((c.calorMidia ?? 20) + (tom.efeito.calorMidia || 0), 0, 100);
    c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + (tom.efeito.tecnicoConfianca || 0), 0, 100);
    c.elencoMoral = clampR((c.elencoMoral ?? 60) + (tom.efeito.elenco || 0), 0, 100);
    c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + (tom.efeito.diretoria || 0), 0, 100);
    if (tom.efeito.torcida) setTorcidaClube(c, c.clube.nome, tom.efeito.torcida);
    logHist(c, `Coletiva de imprensa: ${tom.label.toLowerCase()}.`);
    setCarreira(c);
    setPendingColetiva(false);
    resolverTemporada(c, {});
  }
  function postarSocial(tipo) {
    const c = { ...carreira };
    if (c.postSocialFeito) return;
    let texto;
    if (tipo === "treino") {
      const critica = (c.calorMidia ?? 20) >= 60;
      c.fama = clamp(c.fama + (critica ? 2 : 5), 0, 100);
      c.calorMidia = clampR((c.calorMidia ?? 20) + (critica ? 10 : 4), 0, 100);
      texto = critica ? "Postou um story do treino, mas com o calor da mídia já alto isso virou crítica — o assunto pegou mal." : "Postou um story do treino — repercussão positiva, fama sobe um pouco.";
    } else if (tipo === "familia") {
      c.energia = clampR((c.energia ?? 100) + rand(15, 25), 0, c.energiaMax ?? 100);
      c.fama = clamp(c.fama - rand(2, 4), 0, 100);
      texto = "Postou um momento em família — recarregou energia, mas ficou um pouco fora dos holofotes.";
    } else if (tipo === "resposta") {
      const critica = (c.calorMidia ?? 20) >= 50;
      if (critica) {
        c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - rand(4, 8), 0, 100);
        c.calorMidia = clampR((c.calorMidia ?? 20) + rand(6, 12), 0, 100);
        texto = "Respondeu a crítica publicamente — pareceu na defensiva, a diretoria não gostou e a polêmica só cresceu.";
      } else {
        c.fama = clamp(c.fama + rand(3, 6), 0, 100);
        c.calorMidia = clampR((c.calorMidia ?? 20) - rand(3, 6), 0, 100);
        texto = "Respondeu a crítica com classe — repercussão positiva, esfriou a polêmica.";
      }
    } else if (tipo === "patrocinado") {
      if (c.fama < 35 || (c.seguidores || 0) < 200000) return;
      const valor = Math.round(c.fama * rand(4, 8));
      c.cofre += valor;
      c.extrato = [...c.extrato, { idade: c.idade, tipo: "Post patrocinado", valor }];
      c.calorMidia = clampR((c.calorMidia ?? 20) + rand(3, 7), 0, 100);
      texto = `Fechou um post patrocinado — +$${formatarDinheiro(valor)} na conta, mas parece um pouco mais comercial pra torcida.`;
    } else if (tipo === "elogio") {
      setTorcidaClube(c, c.clube.nome, rand(3, 6));
      c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + rand(3, 6), 0, 100);
      texto = `Elogiou publicamente o ${c.clube.nome} e a torcida — sobe um pouco a relação com o clube e a diretoria.`;
    } else return;
    c.postSocialFeito = true;
    logHist(c, `📱 ${texto}`);
    setCarreira(c);
    setResultadoAcao({ titulo: "Post publicado", texto, icone: "📱" });
  }
  function provocarRival() {
    const c = { ...carreira };
    c.calorMidia = clampR((c.calorMidia ?? 20) + rand(10, 18), 0, 100);
    c.fama = clamp(c.fama + rand(2, 5), 0, 100);
    logHist(c, `🔥 Provocou ${c.rivalPosicao} nas redes — a mídia esportiva entrou em polvorosa.`);
    setCarreira(c);
  }
  function amenizarRival() {
    const c = { ...carreira };
    c.calorMidia = clampR((c.calorMidia ?? 20) - rand(10, 16), 0, 100);
    c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + rand(1, 4), 0, 100);
    logHist(c, `🕊️ Elogiou ${c.rivalPosicao} publicamente — esfriou a rivalidade e agradou a comissão técnica.`);
    setCarreira(c);
  }
  function resolverPedidoTecnico(opt) {
    const c = { ...carreira };
    c.energia = clampR((c.energia ?? 100) + (opt.energia || 0), 0, 100);
    c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + (opt.confianca || 0), 0, 100);
    logHist(c, `${pendingTecnico.titulo}: ${opt.txt}`);
    setCarreira(c);
    setPendingTecnico(null);
    resolverTemporada(c, {});
  }
  function resolverLegendFollow(seguirDeVolta) {
    const c = { ...carreira };
    if (seguirDeVolta) { c.seguidores = Math.round((c.seguidores || 10000) * 1.06 + 20000); logHist(c, `${pendingLegendFollow} começou a te seguir — você seguiu de volta.`); }
    else { c.seguidores = Math.round((c.seguidores || 10000) * 1.02); logHist(c, `${pendingLegendFollow} começou a te seguir.`); }
    setCarreira(c); setPendingLegendFollow(null);
    resolverTemporada(c, {});
  }
  function escolherOfertaTransferencia(op) {
    const ovr = calcOVR(carreira.attrs, carreira.posicao);
    const emp = carreira.empresario ? empresarioPorId(carreira.empresario.id) : EMPRESARIOS[0];
    const salarioBase = salarioClube(op.clube, ovr) * (op.salarioMult || 1) * (emp.salarioMult ?? 1);
    const anos = (base) => clampR(base + (emp.anosBonus || 0), 1, 6);
    const mm = emp.multaMult ?? 1;
    const pacotes = [
      { anos: anos(2), salario: Math.round(salarioBase * 0.82), multa: Math.round(salarioBase * 2.5 * mm), bonusGol: 2, label: "Contrato curto" },
      { anos: anos(3), salario: Math.round(salarioBase), multa: Math.round(salarioBase * 5 * mm), bonusGol: 3, label: "Contrato padrão" },
      { anos: anos(5), salario: Math.round(salarioBase * 1.3), multa: Math.round(salarioBase * 10 * mm), bonusGol: 5, label: "Contrato longo" },
    ];
    setJanela({ tipo: "contrato", opEscolhida: op, pacotes, empNome: emp.nome });
  }
  function confirmarContrato(pacote) {
    setJanela((j) => ({ tipo: "numeroTransfer", opEscolhida: { ...j.opEscolhida, contrato: pacote }, bloqueados: gerarBloqueadosNumero() }));
  }
  function confirmarNumeroTransfer(n) {
    const op = janela.opEscolhida;
    jogarTemporada(op.clube, op.tipo, op.duracao, n, op.contrato);
  }
  function resolverOfertaPatrocinio(aceitar) {
    const c = { ...carreira };
    if (aceitar) {
      const persona = PERSONALIDADES.find((p) => p.id === c.personalidade) || PERSONALIDADES[3];
      const valor = Math.round(c.fama * (persona?.famaMult || 1) * rand(6, 12) * pendingSponsor.valorMult);
      c.cofre += valor; c.extrato = [...c.extrato, { idade: c.idade, tipo: `Patrocínio (${pendingSponsor.marca})`, valor }];
      c.relacaoPatrocinadores = clampR((c.relacaoPatrocinadores ?? 50) + rand(4, 8), 0, 100);
      logHist(c, `Fechou patrocínio com ${pendingSponsor.marca} (+$${formatarDinheiro(valor)}).`);
    } else {
      c.relacaoPatrocinadores = clampR((c.relacaoPatrocinadores ?? 50) - rand(2, 5), 0, 100);
      logHist(c, `Recusou proposta de patrocínio da ${pendingSponsor.marca}.`);
    }
    setCarreira(c); setPendingSponsor(null);
    resolverTemporada(c, {});
  }
  function comprarItem(item) {
    const c = { ...carreira };
    const { custo, manutencao } = precoAjustado(item, c);
    if (c.cofre < custo) return;
    if (item.categoria === "Estrutura do Clube" && (c.posses || []).some((p) => p.id === item.id && p.clubeDono === c.clube.nome)) return; // já adquirido e travado nesse clube
    c.cofre -= custo;
    c.extrato = [...c.extrato, { idade: c.idade, tipo: `Compra: ${item.nome}`, valor: -custo }];
    item = { ...item, custo, manutencao };
    if (item.tipo === "staff") {
      c.staff = { ...c.staff, [item.id]: true };
      c.staffContratos = { ...(c.staffContratos || {}), [item.id]: { restantes: item.duracaoTemporadas || 2, manutencao, custo } };
      logHist(c, `Contratou: ${item.nome} (contrato de ${item.duracaoTemporadas || 2} temporada(s)).`);
    }
    else if (item.forcaClube) {
      const clubeKey = c.clube.nome;
      c.investimentosClube = { ...(c.investimentosClube || {}), [clubeKey]: clampR(((c.investimentosClube || {})[clubeKey] || 0) + item.forcaClube, 0, 18) };
      c.posses = [...(c.posses || []), { ...item, clubeDono: clubeKey, compraId: Date.now() + Math.random() }];
      logHist(c, `Investiu no clube: ${item.nome} (+${item.forcaClube} de força pro ${c.clube.nome}).`);
    }
    else if (item.tipo === "acao") {
      const boostTorcida = item.id === "fundacaoSocial" ? 15 : item.id === "ajudaHospital" ? 10 : 6;
      const boostFama = item.id === "fundacaoSocial" ? 10 : 6;
      const boostSeg = item.id === "ajudaHospital" ? 0.18 : item.id === "abrigoAnimais" ? 0.12 : item.id === "fundacaoSocial" ? 0.15 : 0.06;
      setTorcidaClube(c, c.clube.nome, boostTorcida);
      c.acoesSociaisFeitas = (c.acoesSociaisFeitas || 0) + 1;
      c.fama = clamp(c.fama + boostFama, 0, 100);
      c.seguidores = Math.round((c.seguidores || 10000) * (1 + boostSeg));
      logHist(c, `${item.nome} — repercussão imediata na imagem.`);
    } else {
      c.posses = [...(c.posses || []), { ...item, compraId: Date.now() + Math.random() }];
      if (item.fama) c.fama = clamp(c.fama + item.fama, 0, 100);
      if (item.bonusAttr) { c.attrs = { ...c.attrs, [item.bonusAttr.id]: clamp(c.attrs[item.bonusAttr.id] + item.bonusAttr.valor, 1, 99) }; logHist(c, `Equipou ${item.nome} — ${item.bonusAttr.valor > 0 ? "+" : ""}${item.bonusAttr.valor} de ${item.bonusAttr.id} permanente.`); }
      logHist(c, `Comprou: ${item.nome}.`);
    }
    setCarreira(c);
  }
  function venderItem(compraId) {
    const c = { ...carreira };
    const item = (c.posses || []).find((p) => p.compraId === compraId);
    if (!item) return;
    const reembolso = Math.round(item.custo * 0.5);
    c.cofre += reembolso;
    c.extrato = [...c.extrato, { idade: c.idade, tipo: `Venda: ${item.nome}`, valor: reembolso }];
    c.posses = c.posses.filter((p) => p.compraId !== compraId);
    if (item.forcaClube) {
      const clubeKey = c.clube.nome;
      c.investimentosClube = { ...(c.investimentosClube || {}), [clubeKey]: clampR(((c.investimentosClube || {})[clubeKey] || 0) - item.forcaClube, 0, 18) };
      logHist(c, `Retirou investimento: ${item.nome} (-${item.forcaClube} de força do ${c.clube.nome}).`);
    } else if (item.bonusAttr) {
      c.attrs = { ...c.attrs, [item.bonusAttr.id]: clamp(c.attrs[item.bonusAttr.id] - item.bonusAttr.valor, 1, 99) };
      logHist(c, `Vendeu: ${item.nome} — perdeu o bônus de ${item.bonusAttr.id}.`);
    } else {
      logHist(c, `Vendeu: ${item.nome} (+$${formatarDinheiro(reembolso)}) — parou o gasto de manutenção.`);
    }
    setCarreira(c);
  }
  const PERFIS_INVESTIMENTO = {
    conservador: { label: "Renda fixa conservadora", desc: "Baixo risco, retorno pequeno e previsível.", tabela: [[0.1, 0.85], [0.3, 1.0], [0.85, 1.08], [1, 1.18]] },
    moderado: { label: "Fundo multimercado", desc: "Risco equilibrado, o clássico.", tabela: [[0.08, 0], [0.28, 0.5], [0.6, 1.2], [0.85, 2], [1, 3]] },
    arriscado: { label: "Startup de tecnologia esportiva", desc: "Alto risco, alto potencial de retorno.", tabela: [[0.25, 0], [0.45, 0.4], [0.65, 1.5], [0.85, 3], [1, 5]] },
    extremo: { label: "Criptomoeda de nicho", desc: "Risco extremo — pode zerar ou multiplicar muito.", tabela: [[0.4, 0], [0.55, 0.2], [0.72, 1], [0.9, 4], [1, 8]] },
  };
  function investir(valor, perfil = "moderado") {
    if (carreira.cofre < valor) return;
    const c = { ...carreira };
    c.cofre -= valor;
    const r = Math.random();
    const tabela = PERFIS_INVESTIMENTO[perfil].tabela;
    let mult = tabela[tabela.length - 1][1];
    for (const [teto, m] of tabela) { if (r < teto) { mult = m; break; } }
    const resultado = mult === 0 ? "Perdeu tudo — o investimento fracassou completamente." : mult < 1 ? "O mercado caiu, você recuperou só parte." : mult <= 1.3 ? "Retorno modesto, ligeiro lucro." : mult <= 2.5 ? "Ótimo negócio — multiplicou bem o investimento!" : "Investimento excepcional — multiplicou muito!";
    const retorno = Math.round(valor * mult);
    c.cofre += retorno;
    c.extrato = [...c.extrato, { idade: c.idade, tipo: `Investimento (${PERFIS_INVESTIMENTO[perfil].label})`, valor: retorno - valor }];
    logHist(c, `Investiu $${formatarDinheiro(valor)} em ${PERFIS_INVESTIMENTO[perfil].label}: ${resultado}`);
    setCarreira(c);
    setResultadoInvestimento({ resultado, valor, retorno });
  }

  function escolherDecisao(opt) {
    const c = { ...carreira };
    let efeito, extraStats = {};
    if (opt.risco) {
      const bonusBP = c.especialistaBP ? 6 : 0;
      const cSimulado = bonusBP ? { ...c, attrs: { ...c.attrs, finalizacao: clampR(c.attrs.finalizacao + bonusBP, 1, 99) } } : c;
      const acertou = calcularSucessoDecisivo(cSimulado, null, true);
      efeito = acertou ? opt.seAcerta : opt.seErra;
      if (acertou && opt.seAcerta.gols) extraStats.gols = opt.seAcerta.gols;
    } else {
      efeito = opt.efeito;
      if (opt.efeito.gols) extraStats.gols = opt.efeito.gols;
      if (opt.efeito.assist) extraStats.assist = opt.efeito.assist;
    }
    c.fama = clamp(c.fama + (efeito.fama || 0), 0, 100);
    let torcidaDelta = efeito.torcida || 0;
    if (torcidaDelta < 0 && c.staff?.segurancaParticular) torcidaDelta *= 0.5;
    if (torcidaDelta < 0 && c.staff?.psicologoEsportivo) torcidaDelta *= 0.7;
    if (torcidaDelta) setTorcidaClube(c, c.clube.nome, torcidaDelta);
    logHist(c, `${decisao.titulo}: ${efeito.txt}`);
    setDecisaoResultado({ txt: efeito.txt });
    setCarreira(c);
    setDecisao((d) => ({ ...d, extraStats, done: true }));
  }
  function resolverPenaltiDecisao(zona) {
    const c = { ...carreira };
    const gol = calcularSucessoDecisivo(c, null, true);
    if (gol) { c.fama = clamp(c.fama + 8, 0, 100); setTorcidaClube(c, c.clube.nome, 12); logHist(c, "Pênalti decisivo na final: CONVERTEU! Virou ídolo instantâneo."); }
    else { c.fama = clamp(c.fama - 3, 0, 100); setTorcidaClube(c, c.clube.nome, -10); logHist(c, "Pênalti decisivo na final: PERDEU! A torcida cobrou pesado."); }
    setCarreira(c);
    setDecisaoResultado({ zona, gol, tipo: gol ? "Gol" : Math.random() < 0.6 ? "Defesa" : "Pra fora" });
    setDecisao((d) => ({ ...d, extraStats: gol ? { gols: 1 } : {}, done: true }));
  }
  function resolverFaltaDecisao(zona) {
    const c = { ...carreira };
    const bonusBP = c.especialistaBP ? 4 : 0;
    const gol = calcularSucessoFalta(c.attrs.finalizacao + bonusBP, c.attrs.drible + bonusBP);
    const tipo = tipoResultadoFalta(gol, zona);
    if (gol) { c.fama = clamp(c.fama + 8, 0, 100); setTorcidaClube(c, c.clube.nome, 12); logHist(c, "Falta decisiva na final: NO ÂNGULO! Cobrança perfeita."); }
    else { c.fama = clamp(c.fama - 3, 0, 100); setTorcidaClube(c, c.clube.nome, -10); logHist(c, `Falta decisiva na final: ${tipo === "Barreira" ? "bateu na barreira" : tipo === "Trave" ? "acertou a trave" : tipo === "Defesa" ? "o goleiro defendeu" : "foi por cima do gol"}.`); }
    setCarreira(c);
    setDecisaoResultado({ zona, gol, tipo });
    setDecisao((d) => ({ ...d, extraStats: gol ? { gols: 1 } : {}, done: true }));
  }
  function resolverPasseDecisao(r, companheiro, cena) {
    const c = { ...carreira };
    if (r.gol) { c.fama = clamp(c.fama + 6, 0, 100); setTorcidaClube(c, c.clube.nome, 9); logHist(c, "Passe decisivo nos acréscimos: encontrou o companheiro livre — jogada que vale a vitória!"); }
    else { c.fama = clamp(c.fama - 2, 0, 100); setTorcidaClube(c, c.clube.nome, -6); logHist(c, "Passe decisivo nos acréscimos: interceptado — a defesa adversária afasta o perigo."); }
    setCarreira(c);
    setDecisaoResultado({ tipoPasse: true, r, companheiro, cena, gol: r.gol, txt: r.gol ? "Passe certeiro — companheiro livre pra decidir!" : "Interceptado! A defesa cortou o passe." });
    setDecisao((d) => ({ ...d, extraStats: r.gol ? { assist: 1 } : {}, done: true }));
  }
  function fecharDecisao() {
    const extra = decisao?.extraStats || {};
    setDecisao(null); setDecisaoResultado(null);
    resolverTemporada({ ...carreira }, extra);
  }

  /* Gera a lista jogo a jogo da liga (estilo "resultado por resultado" do site de referência) —
   distribui os totais já calculados da temporada (gols, assist) entre as partidas individuais,
   sem alterar nenhum número final: é só a apresentação jogo a jogo desses mesmos totais. */
/* Calendário round-robin de verdade: todo mundo joga com todo mundo, dois turnos (ida e volta) */
function gerarCalendarioLiga(clube, todosClubes, ligaAtual) {
  let times = todosClubes.filter((cl) => cl.liga === ligaAtual).map((cl) => ({ ...cl }));
  if (times.length % 2 !== 0) times.push({ nome: "Isento", forca: 40, cor: "#666" });
  const numTimes = times.length;
  const rodadasTurno = numTimes - 1;
  let calendario = [];
  let arr = [...times];
  for (let r = 0; r < rodadasTurno; r++) {
    let partidasRodada = [];
    for (let i = 0; i < numTimes / 2; i++) {
      let casa = arr[i], fora = arr[numTimes - 1 - i];
      if (r % 2 === 1) { const t = casa; casa = fora; fora = t; }
      if (casa.nome !== "Isento" && fora.nome !== "Isento") partidasRodada.push({ casa, fora });
    }
    calendario.push(partidasRodada);
    arr.splice(1, 0, arr.pop());
  }
  const returno = calendario.map((rodada) => rodada.map((p) => ({ casa: p.fora, fora: p.casa })));
  return [...calendario, ...returno];
}
/* Confronto: força de cada time (+ um empurrão se o jogador reforça aquele lado) + mando de campo, com Poisson pra variância real */
function simularPartidaLiga(casa, fora, clubeJogadorNome, forcaClubeJogador, ovrJogador) {
  let forcaCasa = casa.nome === clubeJogadorNome ? forcaClubeJogador + (ovrJogador - 70) * 0.25 : casa.forca;
  let forcaFora = fora.nome === clubeJogadorNome ? forcaClubeJogador + (ovrJogador - 70) * 0.25 : fora.forca;
  forcaCasa += 4; // vantagem de mando de campo
  const diferenca = forcaCasa - forcaFora;
  const golsCasa = poisson(clamp(1.35 + diferenca * 0.045, 0.25, 4));
  const golsFora = poisson(clamp(1.35 - diferenca * 0.045, 0.25, 4));
  return { golsCasa, golsFora };
}
function criarTabelaZerada(liga) {
  const tab = {};
  CLUBES.filter((x) => x.liga === liga).forEach((t) => { tab[t.nome] = { clube: t, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 }; });
  return tab;
}
function atualizarTabelaPartida(tab, casaNome, foraNome, gc, gf) {
  const nt = { ...tab, [casaNome]: { ...tab[casaNome] }, [foraNome]: { ...tab[foraNome] } };
  nt[casaNome].j++; nt[foraNome].j++;
  nt[casaNome].gp += gc; nt[casaNome].gc += gf;
  nt[foraNome].gp += gf; nt[foraNome].gc += gc;
  nt[casaNome].sg = nt[casaNome].gp - nt[casaNome].gc;
  nt[foraNome].sg = nt[foraNome].gp - nt[foraNome].gc;
  if (gc > gf) { nt[casaNome].pts += 3; nt[casaNome].v++; nt[foraNome].d++; }
  else if (gf > gc) { nt[foraNome].pts += 3; nt[foraNome].v++; nt[casaNome].d++; }
  else { nt[casaNome].pts += 1; nt[foraNome].pts += 1; nt[casaNome].e++; nt[foraNome].e++; }
  return nt;
}
/* Nota individual da partida — pesa contribuição direta, resultado do time,
   dificuldade do adversário e mando de campo. É o dado que destrava forma, clássicos e sequências. */
function notaDaPartida(c, { gols = 0, assist = 0, resultado, golsSofridos = 0, adversarioForca = 70, forcaClube = 70, forcaJogador = 70, casa = true }) {
  const goleiro = c.posicao === "GOL";
  let n = 6.2;
  // contribuição ofensiva
  n += gols * (goleiro ? 1.6 : 0.85) + assist * 0.5;
  // goleiro: jogo sem sofrer gol vale muito; levar muitos gols pesa
  if (goleiro) { if (golsSofridos === 0) n += 1.1; else n -= golsSofridos * 0.3; }
  else if (["ZAG", "LAT", "VOL"].includes(c.posicao) && golsSofridos === 0) n += 0.45;
  // resultado do time
  n += resultado === "V" ? 0.35 : resultado === "D" ? -0.3 : 0;
  // qualidade do jogador acima/abaixo do nível do time
  n += clamp((forcaJogador - forcaClube) * 0.02, -0.3, 0.4);
  // dificuldade do adversário: render bem contra time forte vale mais
  const dif = (adversarioForca - forcaClube) * 0.012;
  n += resultado === "D" ? Math.max(0, dif) : dif;
  if (!casa) n += 0.08;
  n += (Math.random() - 0.5) * 0.45;
  return +clamp(n, 4.5, 10).toFixed(2);
}
/* ===================== ANÁLISE DO JOGO A JOGO =====================
   Transforma a lista de partidas em leitura útil: forma recente, sequências,
   desempenho em clássicos, casa x fora e melhor/pior atuação. */
function agregarJogos(lista) {
  const base = { jogos: 0, v: 0, e: 0, d: 0, gols: 0, assist: 0, somaNota: 0 };
  const acc = (lista || []).reduce((a, j) => ({
    jogos: a.jogos + 1,
    v: a.v + (j.resultado === "V" ? 1 : 0), e: a.e + (j.resultado === "E" ? 1 : 0), d: a.d + (j.resultado === "D" ? 1 : 0),
    gols: a.gols + (j.golsMinha || 0), assist: a.assist + (j.assistMinha || 0),
    somaNota: a.somaNota + (j.nota || 0),
  }), base);
  return { ...acc, notaMedia: acc.jogos ? +(acc.somaNota / acc.jogos).toFixed(2) : 0, aproveitamento: acc.jogos ? Math.round(((acc.v * 3 + acc.e) / (acc.jogos * 3)) * 100) : 0 };
}
function analisarJogos(lista) {
  const jogos = (lista || []).filter(Boolean);
  if (!jogos.length) return null;
  const comNota = jogos.filter((j) => j.nota != null);
  const ordenados = [...comNota].sort((a, b) => b.nota - a.nota);
  // sequências correntes (a partir do fim)
  let seqSemPerder = 0, seqMarcando = 0, seqSemMarcar = 0;
  for (let i = jogos.length - 1; i >= 0; i--) { if (jogos[i].resultado !== "D") seqSemPerder++; else break; }
  for (let i = jogos.length - 1; i >= 0; i--) { if ((jogos[i].golsMinha || 0) > 0) seqMarcando++; else break; }
  for (let i = jogos.length - 1; i >= 0; i--) { if ((jogos[i].golsMinha || 0) === 0) seqSemMarcar++; else break; }
  return {
    total: agregarJogos(jogos),
    forma: agregarJogos(jogos.slice(-5)),
    casa: agregarJogos(jogos.filter((j) => j.casa)),
    fora: agregarJogos(jogos.filter((j) => j.casa === false)),
    classicos: agregarJogos(jogos.filter((j) => j.classico)),
    normais: agregarJogos(jogos.filter((j) => !j.classico)),
    melhor: ordenados[0] || null,
    pior: ordenados[ordenados.length - 1] || null,
    ultimos: jogos.slice(-10),
    seqSemPerder, seqMarcando, seqSemMarcar,
  };
}
/* Junta o jogo a jogo de todas as temporadas — base pra recordes e estatísticas de carreira */
function todosJogosCarreira(temporadas) {
  return temporadas.flatMap((t) => (t.jogosLista || []).map((j) => ({ ...j, temporadaLabel: t.temporadaLabel, clube: t.clube })));
}

/* Simula a rodada inteira da liga (todos os jogos ao mesmo tempo), extraindo o jogo do jogador à parte */
function simularRodadaAtual(c, ta, bonusGol = 0, bonusAssist = 0) {
  const rodada = ta.calendario[ta.rodadaAtual];
  let tabela = ta.tabela;
  const historico = [];
  let meuResultadoRodada = null;
  let golsRestantes = ta.golsRestantes, assistRestantes = ta.assistRestantes;
  const forcaJogador = calcOVR(c.attrs, c.posicao);
  const forcaClube = forcaEfetivaClube(c, c.clube);
  rodada.forEach((partida) => {
    const ehJogoDoJogador = partida.casa.nome === c.clube.nome || partida.fora.nome === c.clube.nome;
    let { golsCasa, golsFora } = simularPartidaLiga(partida.casa, partida.fora, c.clube.nome, forcaClube, forcaJogador);
    if (ehJogoDoJogador && bonusGol) { if (partida.casa.nome === c.clube.nome) golsCasa += bonusGol; else golsFora += bonusGol; }
    tabela = atualizarTabelaPartida(tabela, partida.casa.nome, partida.fora.nome, golsCasa, golsFora);
    historico.push({ texto: `${emojiClube(partida.casa.nome)} ${partida.casa.nome} ${golsCasa} x ${golsFora} ${partida.fora.nome} ${emojiClube(partida.fora.nome)}`, destaque: ehJogoDoJogador });
    if (ehJogoDoJogador) {
      const souCasa = partida.casa.nome === c.clube.nome;
      const meusGolsTime = souCasa ? golsCasa : golsFora;
      const golsAdvTime = souCasa ? golsFora : golsCasa;
      const adversarioObj = souCasa ? partida.fora : partida.casa;
      const ehClassico = !!(c.clube.estado && adversarioObj.estado === c.clube.estado) || Math.abs(adversarioObj.forca - forcaClube) <= 3;
      const postura = ta.postura || "normal";
      const post = POSTURAS_JOGO.find((x) => x.id === postura) || POSTURAS_JOGO[1];
      // efeito da semana de preparação, se houve
      const prepSem = PREPARACOES_SEMANA.find((x) => x.id === ta.preparacaoSemana)?.efeito || {};

      // ---- SUSPENSÃO: se está cumprindo, nem entra em campo ----
      const suspenso = (c.cartoes?.suspensoesRestantes || 0) > 0;
      if (suspenso) {
        c.cartoes = { ...c.cartoes, suspensoesRestantes: c.cartoes.suspensoesRestantes - 1 };
        meuResultadoRodada = {
          adversario: adversarioObj.nome, adversarioForca: adversarioObj.forca,
          golsMeu: meusGolsTime, golsAdv: golsAdvTime,
          resultado: meusGolsTime > golsAdvTime ? "V" : meusGolsTime === golsAdvTime ? "E" : "D",
          golsMinha: 0, assistMinha: 0, numero: ta.rodadaAtual + 1,
          casa: souCasa, competicao: "liga", classico: ehClassico,
          suspenso: true, nota: null,
        };
        return; // pula o resto do lance pra esta partida
      }

      // a postura mexe na chance de participar do gol
      let golsPessoais = golsRestantes > 0 && Math.random() < 0.42 * post.golMult * (prepSem.golMult || 1) ? Math.min(meusGolsTime, rand(1, Math.min(2, Math.max(1, golsRestantes)))) : 0;
      golsRestantes = Math.max(0, golsRestantes - golsPessoais);
      let assistPessoal = assistRestantes > 0 && Math.random() < 0.32 * post.assistMult * (prepSem.assistMult || 1) ? 1 : 0;
      assistRestantes = Math.max(0, assistRestantes - assistPessoal);
      golsPessoais += bonusGol; assistPessoal += bonusAssist;
      const resultado = meusGolsTime > golsAdvTime ? "V" : meusGolsTime === golsAdvTime ? "E" : "D";

      // ---- CARTÕES ----
      const cart = (() => {
        const base = sortearCartoes(c, { postura, classico: ehClassico, adversarioForca: adversarioObj.forca, forcaClube });
        // semana de descanso/estudo deixa você mais controlado em campo
        if ((prepSem.cartaoMult || 1) < 1 && (base.amarelo || base.vermelho) && Math.random() > (prepSem.cartaoMult || 1)) return { amarelo: false, vermelho: false, segundoAmarelo: false };
        return base;
      })();
      const susp = (cart.amarelo || cart.vermelho) ? aplicarCartao(c, cart) : { suspendeu: 0 };

      meuResultadoRodada = {
        adversario: adversarioObj.nome, adversarioForca: adversarioObj.forca,
        golsMeu: meusGolsTime, golsAdv: golsAdvTime, resultado,
        golsMinha: golsPessoais, assistMinha: assistPessoal, numero: ta.rodadaAtual + 1,
        casa: souCasa, competicao: "liga", classico: ehClassico, postura,
        amarelo: cart.amarelo, vermelho: cart.vermelho, segundoAmarelo: cart.segundoAmarelo,
        suspensaoGerada: susp.suspendeu, motivoSuspensao: susp.motivo,
        preparacao: ta.preparacaoSemana,
        nota: clamp(notaDaPartida(c, { gols: golsPessoais, assist: assistPessoal, resultado, golsSofridos: golsAdvTime, adversarioForca: adversarioObj.forca, forcaClube, forcaJogador, casa: souCasa }) + post.notaBonus + (prepSem.notaBonus || 0) - (cart.vermelho ? 1.2 : 0), 4.5, 10),
      };
    }
  });
  return { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes };
}
function resolverTemporada(c, extraStats) {
    const card = simularTemporada(c);
    if (extraStats.gols) card.gols += extraStats.gols;
    if (extraStats.assist) card.assist += extraStats.assist;
    c.anosDesdeCopa += 1;

    // Disputa de posição com o concorrente direto no elenco
    if (c.concorrente) {
      const notaConcorrente = clamp(6.0 + (c.concorrente.forca - 60) * 0.03 + (Math.random() - 0.5) * 0.8, 5.0, 9.5);
      const venceuDisputa = card.nota > notaConcorrente;
      card.concorrenteResultado = { nome: c.concorrente.nome, notaConcorrente: +notaConcorrente.toFixed(2), venceuDisputa };
      c.titularidade = clampR((c.titularidade ?? 100) + (venceuDisputa ? rand(5, 10) : -rand(8, 15)), 20, 100);
    }
    // Entrosamento cresce com o tempo de casa (e mais se treinou tático na temporada)
    c.entrosamento = clampR((c.entrosamento ?? 20) + rand(8, 14) + (c.treinoTaticoFeito ? 6 : 0), 0, 100);
    c.treinoTaticoFeito = false;
    // Moral do elenco reage ao desempenho coletivo da temporada
    c.elencoMoral = clampR((c.elencoMoral ?? 60) + (card.nota - 6.8) * 4 + (card.campeaoLiga ? 6 : 0), 0, 100);

    // ---- SELEÇÃO: convocação, competição do ano e números acumulados ----
    c.selecao = c.selecao || { jogos: 0, gols: 0, assist: 0, cleanSheets: 0, capitao: false, convocacoesSeguidas: 0, historico: [] };
    if (!c.tecnicoSelecao) c.tecnicoSelecao = gerarTecnicoSelecao(c.nacionalidade);
    const querCopa = c.anosDesdeCopa >= 4;
    const compSelecao = competicaoSelecaoDoAno(c.anosDesdeCopa, c.nacionalidade);
    const conv = avaliarConvocacao(c, mundo, temporadas[temporadas.length - 1], card.ovr, nome);
    let selecaoTemporadaAtual = null;
    c.selecaoTemporadaAtual = null;
    c.selecaoUltimaFila = conv.fila.slice(0, 6);
    c.selecaoMinhaPos = conv.minhaPos;

    if (querCopa) c.anosDesdeCopa = 0;
    if (querCopa && !conv.convocado) {
      card.copaResultado = { resultado: "Não convocado", titulo: false };
      c.selecao.convocacoesSeguidas = 0;
      logHist(c, `Ficou fora da lista final da Copa do Mundo — ${conv.fila[0]?.nome || "outro"} foi o escolhido na posição.`);
    } else if (!querCopa) {
      // temporada sem Copa: continental, eliminatórias ou amistosos
      if (conv.convocado) {
        const titular = conv.minhaPos <= 2;
        selecaoTemporadaAtual = simularSelecao(c, compSelecao, card.ovr, titular);
        c.selecaoTemporadaAtual = selecaoTemporadaAtual;
        c.selecao = {
          ...c.selecao,
          jogos: c.selecao.jogos + selecaoTemporadaAtual.jogos,
          gols: c.selecao.gols + selecaoTemporadaAtual.gols,
          assist: c.selecao.assist + selecaoTemporadaAtual.assist,
          cleanSheets: (c.selecao.cleanSheets || 0) + selecaoTemporadaAtual.cleanSheets,
          convocacoesSeguidas: (c.selecao.convocacoesSeguidas || 0) + 1,
          historico: [...(c.selecao.historico || []), { idade: c.idade, ...selecaoTemporadaAtual }],
        };
        // primeira convocação vira marco
        if (c.selecao.jogos === selecaoTemporadaAtual.jogos) {
          registrarMarco(c, "selecao", `Estreou pela seleção ${nacDe(c.nacionalidade)?.label} em ${compSelecao.nome}.`);
        }
        // capitania: veterano consolidado e querido pela comissão
        if (!c.selecao.capitao && c.selecao.jogos >= 35 && card.ovr >= 84 && c.idade >= 26) {
          c.selecao.capitao = true;
          registrarMarco(c, "selecao", `Recebeu a braçadeira de CAPITÃO da seleção ${nacDe(c.nacionalidade)?.label}.`);
          logHist(c, `🎖️ Virou capitão da seleção ${nacDe(c.nacionalidade)?.label}.`);
          c.fama = clamp(c.fama + 6, 0, 100);
        }
        if (selecaoTemporadaAtual.titulo) {
          c.titulosSelecao = [...(c.titulosSelecao || []), compSelecao.nome];
          c.titulos += 1;
          registrarMarco(c, "titulo", `CAMPEÃO DA ${compSelecao.nome.toUpperCase()} pela seleção!`, compSelecao.nome);
          c.fama = clamp(c.fama + 10, 0, 100);
        }
        logHist(c, `${compSelecao.icone} Seleção: ${selecaoTemporadaAtual.campanha} (${selecaoTemporadaAtual.jogos}J, ${selecaoTemporadaAtual.gols}g).`);
      } else {
        c.selecao.convocacoesSeguidas = 0;
      }
    }

    const fila = [];
    if (card.lesao) fila.push({ tipo: "lesao" });
    if (querCopa && !card.copaResultado) fila.push({ tipo: "copaDoMundo", faseIdx: 0, ramo: null, adversario: sortearAdversario(c, "copaDoMundo") });
    if (card.continentalPendente) fila.push({ tipo: "continental" });
    if (card.copaNacionalPendente) fila.push({ tipo: "copaNacional", faseIdx: 0, adversario: card.copaNacionalPendente.adversario });
    if (c.clube.estado && Math.random() < 0.85) fila.push({ tipo: "estadual", faseIdx: 0, adversario: sortearAdversario(c, "estadual") });
    if (c.idade <= 17 && c.clube.estado && !c.copinhaJogadaTemporada) { fila.push({ tipo: "copinha", faseIdx: 0, adversario: sortearAdversario(c, "copinha") }); c.copinhaJogadaTemporada = true; }
    if (card.ligaDecisiva) fila.push({ tipo: "ligaTitulo" });
    if (!card.ligaDecisiva && Math.random() < 0.3) fila.push({ tipo: "classico", adversario: sortearAdversario(c, "classico") });
    if (!card.ligaDecisiva && c.posicao !== "GOL" && Math.random() < 0.3) fila.push({ tipo: "falta", adversario: sortearAdversario(c, "classico") });
    if (!card.lesao && c.posicao !== "GOL" && Math.random() < 0.4) fila.push({ tipo: "golaco" });

    if (modoSimulacao === "jogoAJogo") {
      // Espalha os eventos decisivos ao longo do calendário — não resolve tudo de uma vez no início
      const calendario = gerarCalendarioLiga(c.clube, CLUBES, c.clube.liga);
      const tabela = criarTabelaZerada(c.clube.liga);
      const totalRodadas = calendario.length;
      const eventosAgendados = fila.map((item, i) => ({
        ...item,
        rodadaAlvo: clampR(Math.round(((i + 1) / (fila.length + 1)) * totalRodadas) + rand(-2, 2), 1, totalRodadas - 1),
      })).sort((a, b) => a.rodadaAlvo - b.rodadaAlvo);
      c.temporadaAndamento = {
        calendario, rodadaAtual: 0, tabela, historicoRodada: [], ultimoResultado: null, resultadosRodadas: [],
        eventosAgendados, cardOriginal: card,
        lanceRodada: rand(0, calendario.length - 1), lanceResolvido: false,
        golsRestantes: card.gols, assistRestantes: card.assist, logJogos: [],
      };
      setCarreira(c);
      return;
    }

    if (fila.length > 0) {
      setCompeticaoCtx({ c, card });
      setCompeticaoFila(fila);
      setCompeticaoIndice(0);
      setPendingCompeticao(fila[0]);
      return;
    }
    finalizarTemporada(c, card, []);
  }

  function resolverDecisaoLesao(opcao) {
    const { c, card } = competicaoCtx;
    if (opcao === "rapido") {
      card.jogos = Math.min(46, card.jogos + rand(4, 8));
      const recaiu = Math.random() < 0.35;
      if (recaiu) { card.jogos = Math.max(6, card.jogos - rand(8, 14)); logHist(c, "🤕 Lesão: recuperação precipitada — voltou rápido demais e sentiu a lesão de novo, perdeu ainda mais jogos."); setCompeticaoResultado({ titulo: "Recuperação precipitada", texto: "Voltou rápido demais e sentiu a lesão de novo — acabou perdendo ainda mais jogos.", icone: "🤕" }); }
      else { logHist(c, "💪 Lesão: arriscou a recuperação relâmpago e deu certo — voltou aos gramados bem mais cedo."); setCompeticaoResultado({ titulo: "Recuperação relâmpago", texto: "Arriscou antecipar a volta e deu certo — voltou aos gramados bem mais cedo que o previsto.", icone: "💪" }); }
    } else {
      logHist(c, "🩺 Lesão: seguiu o protocolo médico à risca — recuperação tranquila e sem sequelas.");
      setCompeticaoResultado({ titulo: "Protocolo médico seguido à risca", texto: "Recuperação tranquila e sem sequelas — voltou são e salvo, no tempo certo.", icone: "🩺" });
    }
    setCompeticaoCtx({ c, card });
  }
  function resolverGolaco(tipo) {
    const { c, card } = competicaoCtx;
    const chance = clamp((c.attrs.drible + c.attrs.finalizacao) / 200, 0.3, 0.85);
    const acertou = Math.random() < chance;
    const nomes = { bicicleta: "bicicleta", drible: "drible desconcertante no goleiro", cavadinha: "cavadinha de categoria" };
    if (acertou) {
      card.gols += 1;
      setTorcidaClube(c, c.clube.nome, 8); c.fama = clamp(c.fama + 6, 0, 100); c.calorMidia = clampR((c.calorMidia ?? 20) + 12, 0, 100);
      setCompeticaoResultado({ titulo: "Golaço da temporada!", texto: `Que jogada! Uma ${nomes[tipo]} que já viralizou — vai pra tabela de gols mais bonitos do ano.`, icone: "🎆" });
    } else {
      setCompeticaoResultado({ titulo: "Quase!", texto: `Tentou a ${nomes[tipo]}, mas não saiu dessa vez — a torcida ainda assim aplaudiu a tentativa.`, icone: "😅" });
    }
    setCompeticaoCtx({ c, card });
  }
  function resolverDecisaoCompeticao(zona) {
    const { c, card } = competicaoCtx;
    const chanceBase = clamp((c.attrs.finalizacao + calcOVR(c.attrs, c.posicao)) / 200, 0.3, 0.85);
    const decisaoOk = Math.random() < chanceBase;
    const item = pendingCompeticao;

    if (item.tipo === "continental") {
      const info = card.continentalPendente;
      const placar = gerarPlacar(decisaoOk);
      if (info.estagio === "quartas") {
        card.continental = { nome: info.nome, resultado: decisaoOk ? "Semifinal" : "Eliminado nas quartas", titulo: false, adversario: info.adversario, placar };
      } else if (info.estagio === "final") {
        card.continental = { nome: info.nome, resultado: decisaoOk ? "CAMPEÃO" : "Vice", titulo: decisaoOk, adversario: info.adversario, placar };
      } else {
        card.continental = { nome: info.nome, resultado: decisaoOk ? "Vice" : "Semifinal", titulo: false, adversario: info.adversario, placar };
      }
      const nomeEstagio = info.estagio === "final" ? "Final" : info.estagio === "quartas" ? "Quartas de Final" : "Semifinal";
      logHist(c, `${info.nome} — ${nomeEstagio} x ${info.adversario}: ${decisaoOk ? "vitória" : "derrota"} por ${placar}.`);
      setCompeticaoResultado({ titulo: `${info.nome} — ${nomeEstagio}`, texto: `${decisaoOk ? "Vitória" : "Derrota"} por ${placar} contra o ${info.adversario}. ${decisaoOk ? "Grande decisão sua na hora certa!" : "Não foi dessa vez."}`, icone: decisaoOk ? "🏆" : "😔", epico: info.estagio === "final", venceu: decisaoOk, nomeCompeticao: info.nome });
    } else if (item.tipo === "ligaTitulo") {
      if (card.posLiga === 2 && decisaoOk) { card.posLiga = 1; card.campeaoLiga = true; }
      else if (card.posLiga === 1 && !decisaoOk) { card.posLiga = 2; card.campeaoLiga = false; }
      setCompeticaoResultado({ titulo: `${card.ligaNome} — Rodada decisiva`, texto: card.campeaoLiga ? "Você entrou pra história — título na última rodada!" : "O título escapou por pouco.", icone: card.campeaoLiga ? "🏆" : "😔", epico: true, venceu: card.campeaoLiga, nomeCompeticao: card.ligaNome });
    } else if (item.tipo === "classico") {
      const torcidaDelta = decisaoOk ? rand(8, 14) : -rand(6, 12);
      const placar = gerarPlacar(decisaoOk);
      setTorcidaClube(c, c.clube.nome, torcidaDelta);
      c.fama = clamp(c.fama + (decisaoOk ? 4 : -1), 0, 100);
      card.classico = { venceu: decisaoOk, adversario: item.adversario, placar };
      logHist(c, `Clássico x ${item.adversario}: ${decisaoOk ? "vitória" : "derrota"} por ${placar}.`);
      setCompeticaoResultado({ titulo: "Clássico decisivo", texto: `${decisaoOk ? "Vitória" : "Derrota"} por ${placar} contra o ${item.adversario}. ${decisaoOk ? "Foi decisivo no clássico — a torcida vai lembrar disso pra sempre!" : "Não foi seu dia no clássico — a torcida cobrou pesado."}`, icone: decisaoOk ? "🔥" : "😔" });
    } else if (item.tipo === "falta") {
      if (decisaoOk) {
        card.gols += 1;
        setTorcidaClube(c, c.clube.nome, 5); c.fama = clamp(c.fama + 3, 0, 100);
        logHist(c, `⚡ Falta cobrada com categoria x ${item.adversario} — gol direto de bola parada.`);
        setCompeticaoResultado({ titulo: "Falta na entrada da área!", texto: `Barreira armada, você mandou no ângulo contra o ${item.adversario} — golaço de falta!`, icone: "⚡" });
      } else {
        logHist(c, `Falta cobrada x ${item.adversario}: a barreira ou o goleiro salvaram.`);
        setCompeticaoResultado({ titulo: "Falta na entrada da área", texto: `Bateu bem, mas a barreira desviou (ou o goleiro fez a defesa) contra o ${item.adversario}.`, icone: "😅" });
      }
    }
    setCompeticaoCtx({ c, card });
  }

  function baterFaseCopaMundo(zona) {
    const { c, card } = competicaoCtx;
    const nac = nacDe(c.nacionalidade);
    const decisaoOk = Math.random() < clamp((c.attrs.finalizacao + calcOVR(c.attrs, c.posicao)) / 200, 0.3, 0.85);
    const chance = clamp(chanceFaseCopaMundo(pendingCompeticao.faseIdx, nac.forcaSelecao, card.ovr, decisaoOk, pendingCompeticao.ramo) + bonusTraitsMataMata(c), 0.05, 0.97);
    const passou = Math.random() < chance;
    const tipo = passou ? "Gol" : Math.random() < 0.6 ? "Defesa" : "Pra fora";
    setCopaMundoTentativa({ zona, gol: passou, tipo });
  }
  function continuarFaseCopaMundo() {
    const { c, card } = competicaoCtx;
    const nac = nacDe(c.nacionalidade);
    const passou = copaMundoTentativa.gol;
    const faseIdx = pendingCompeticao.faseIdx;
    const ramo = pendingCompeticao.ramo;
    const adversario = pendingCompeticao.adversario;
    const placar = gerarPlacar(passou);
    setCopaMundoTentativa(null);

    if (ramo === "final") {
      card.copaResultado = passou ? { resultado: "CAMPEÃO DO MUNDO", titulo: true, adversario, placar } : { resultado: "Vice-campeão do Mundo", titulo: false, adversario, placar };
      logHist(c, `Copa do Mundo — Final x ${adversario}: ${passou ? "vitória" : "derrota"} por ${placar}${passou ? " — CAMPEÃO DO MUNDO!" : ""}.`);
      setCompeticaoResultado({
        titulo: passou ? "🏆 FINAL DA COPA DO MUNDO — CAMPEÃO!" : "Final da Copa do Mundo — Vice",
        texto: `${passou ? "Vitória" : "Derrota"} por ${placar} contra ${adversario}. ${passou ? `Glória eterna! ${nac.label} é CAMPEÃ DO MUNDO com você em campo!` : "Perdeu a final. Vice-campeão do mundo — dói, mas foi uma baita campanha."}`,
        icone: passou ? "🏆" : "🥈", epico: true, venceu: passou, nomeCompeticao: "Copa do Mundo",
      });
      setCompeticaoCtx({ c, card });
      return;
    }
    if (ramo === "terceiro") {
      card.copaResultado = passou ? { resultado: "3º lugar na Copa do Mundo", titulo: false, adversario, placar } : { resultado: "4º lugar na Copa do Mundo", titulo: false, adversario, placar };
      logHist(c, `Copa do Mundo — Disputa de 3º lugar x ${adversario}: ${passou ? "vitória" : "derrota"} por ${placar}.`);
      setCompeticaoResultado({
        titulo: passou ? "Disputa de 3º lugar — Vitória!" : "Disputa de 3º lugar — Derrota",
        texto: `${passou ? "Vitória" : "Derrota"} por ${placar} contra ${adversario}. ${passou ? "Fecha a Copa com uma medalha de bronze no peito." : "Fica em 4º lugar — sem medalha, mas campanha respeitável."}`,
        icone: passou ? "🥉" : "😔", epico: true, venceu: passou, nomeCompeticao: "Copa do Mundo",
      });
      setCompeticaoCtx({ c, card });
      return;
    }

    if (!passou) {
      if (faseIdx === FASES_COPA_MUNDO.length - 1) {
        // Perdeu a semifinal -> disputa de 3º lugar, a caminhada continua
        logHist(c, `Copa do Mundo — Semifinal x ${adversario}: derrota por ${placar}. Vai à disputa de 3º lugar.`);
        setPendingCompeticao({ tipo: "copaDoMundo", faseIdx: faseIdx + 1, ramo: "terceiro", adversario: sortearAdversario(c, "copaDoMundo") });
        return;
      }
      const f = FASES_COPA_MUNDO[faseIdx];
      card.copaResultado = { resultado: `Eliminado ${f.prep} ${f.label}`, titulo: false, adversario, placar };
      logHist(c, `Copa do Mundo — ${f.label} x ${adversario}: derrota por ${placar}. Eliminado ${f.prep} ${f.label}.`);
      setCompeticaoResultado({ titulo: "Copa do Mundo encerrada", texto: `Derrota por ${placar} contra ${adversario}. A caminhada de ${nac.label} parou ${f.prep} ${f.label}.`, icone: "😔", epico: true, venceu: false, nomeCompeticao: "Copa do Mundo" });
      setCompeticaoCtx({ c, card });
      return;
    }
    logHist(c, `Copa do Mundo — ${FASES_COPA_MUNDO[faseIdx].label} x ${adversario}: vitória por ${placar}. Classificado!`);

    if (faseIdx === FASES_COPA_MUNDO.length - 1) {
      // Venceu a semifinal -> vai pra grande final
      setPendingCompeticao({ tipo: "copaDoMundo", faseIdx: faseIdx + 1, ramo: "final", adversario: sortearAdversario(c, "copaDoMundo") });
      return;
    }
    setPendingCompeticao({ tipo: "copaDoMundo", faseIdx: faseIdx + 1, ramo: null, adversario: sortearAdversario(c, "copaDoMundo") });
  }
  function baterFaseGenerica(zona) {
    const { c, card } = competicaoCtx;
    const competicao = pendingCompeticao.tipo;
    const forca = forcaEfetivaClube(c, c.clube);
    const decisaoOk = Math.random() < clamp((c.attrs.finalizacao + calcOVR(c.attrs, c.posicao)) / 200, 0.3, 0.85);
    const dificuldadeBase = competicao === "estadual" ? 0 : competicao === "copinha" ? 4 : 12;
    const chance = clamp(chanceFaseGenerica(pendingCompeticao.faseIdx, forca, card.ovr, decisaoOk, dificuldadeBase) + bonusTraitsMataMata(c), 0.05, 0.97);
    const passou = Math.random() < chance;
    const tipo = passou ? "Gol" : Math.random() < 0.6 ? "Defesa" : "Pra fora";
    setCopaMundoTentativa({ zona, gol: passou, tipo });
  }
  function continuarFaseGenerica() {
    const { c, card } = competicaoCtx;
    const competicao = pendingCompeticao.tipo;
    const fases = FASES_POR_COMPETICAO[competicao];
    const passou = copaMundoTentativa.gol;
    const faseIdx = pendingCompeticao.faseIdx;
    const adversario = pendingCompeticao.adversario;
    const placar = gerarPlacar(passou);
    setCopaMundoTentativa(null);
    const nomeCompeticao = competicao === "estadual" ? (ESTADUAIS[c.clube.estado] || "Campeonato Estadual") : competicao === "copinha" ? "Copa São Paulo de Futebol Júnior" : "Copa Nacional";
    const campo = competicao === "estadual" ? "estadual" : competicao === "copinha" ? "copinhaCarreira" : "copaNacional";

    if (faseIdx >= fases.length) {
      card[campo] = { nome: nomeCompeticao, resultado: passou ? "CAMPEÃO" : "Vice", titulo: passou, adversario, placar };
      logHist(c, `${nomeCompeticao} — Final x ${adversario}: ${passou ? "vitória" : "derrota"} por ${placar}${passou ? " — CAMPEÃO!" : ""}.`);
      setCompeticaoResultado({ titulo: `${nomeCompeticao} — Final`, texto: `${passou ? "Vitória" : "Derrota"} por ${placar} contra o ${adversario}. ${passou ? "Você decidiu o título nos momentos finais!" : "Perdeu a final por pouco."}`, icone: passou ? "🏆" : "😔", epico: true, venceu: passou, nomeCompeticao });
      setCompeticaoCtx({ c, card });
      return;
    }
    if (!passou) {
      const f = fases[faseIdx];
      card[campo] = { nome: nomeCompeticao, resultado: `Eliminado ${f.prep} ${f.label}`, titulo: false, adversario, placar };
      logHist(c, `${nomeCompeticao} — ${f.label} x ${adversario}: derrota por ${placar}. Eliminado ${f.prep} ${f.label}.`);
      setCompeticaoResultado({ titulo: `${nomeCompeticao} encerrado`, texto: `Derrota por ${placar} contra o ${adversario}. A campanha parou ${f.prep} ${f.label}.`, icone: "😔", epico: true, venceu: false, nomeCompeticao });
      setCompeticaoCtx({ c, card });
      return;
    }
    logHist(c, `${nomeCompeticao} — ${fases[faseIdx].label} x ${adversario}: vitória por ${placar}. Classificado!`);
    setPendingCompeticao({ tipo: competicao, faseIdx: faseIdx + 1, adversario: sortearAdversario(c, competicao) });
  }
  function avancarFilaCompeticoes() {
    setCompeticaoResultado(null);
    if (carreira?.temporadaAndamento) {
      // Evento agendado dentro do jogo a jogo — a mutação já foi salva pela função que resolveu;
      // só libera a tela pra continuar as rodadas (o próximo clique em Avançar decide o resto).
      setPendingCompeticao(null);
      return;
    }
    const proxIndice = competicaoIndice + 1;
    if (proxIndice < competicaoFila.length) {
      setCompeticaoIndice(proxIndice);
      setPendingCompeticao(competicaoFila[proxIndice]);
    } else {
      setPendingCompeticao(null);
      finalizarTemporada(competicaoCtx.c, competicaoCtx.card, []);
    }
  }

  function finalizarTemporada(c, card, jogosLista = []) {
    const copa = card.copaResultado || null;
    if (copa) {
      const nac = nacDe(c.nacionalidade);
      c.pontosCopa = (c.pontosCopa || 0) + pontosCampanhaCopa(copa.resultado);
      if (copa.titulo) {
        c.copasDoMundo += 1; c.titulos += 1; c.fama = clamp(c.fama + 20, 0, 100);
        logHist(c, `CAMPEÃO DO MUNDO com ${nac.label}!`);
      } else if (copa.resultado === "Vice-campeão do Mundo") {
        c.fama = clamp(c.fama + 10, 0, 100);
        logHist(c, `Vice-campeão do Mundo com ${nac.label}.`);
      } else if (copa.resultado === "3º lugar na Copa do Mundo") {
        c.fama = clamp(c.fama + 6, 0, 100);
        logHist(c, `3º lugar na Copa do Mundo com ${nac.label}.`);
      } else if (copa.resultado === "4º lugar na Copa do Mundo") {
        c.fama = clamp(c.fama + 3, 0, 100);
        logHist(c, `4º lugar na Copa do Mundo com ${nac.label}.`);
      } else if (copa.resultado && copa.resultado !== "Não convocado") {
        logHist(c, `Copa do Mundo: ${copa.resultado} (${nac.label}).`);
      }
    }

    const titulosLista = [];
    if (card.campeaoLiga) titulosLista.push(`Campeão ${card.ligaNome}`);
    if (card.continental?.titulo) titulosLista.push(`Campeão da ${card.continental.nome}`);
    if (card.copaNacional?.titulo) titulosLista.push(`Campeão da Copa Nacional`);
    if (card.estadual?.titulo) titulosLista.push(`Campeão do ${card.estadual.nome}`);
    if (card.mundial) {
      if (card.mundial.titulo) { titulosLista.push("Campeão do Mundial de Clubes"); c.fama = clamp(c.fama + 15, 0, 100); c.seguidores = Math.round((c.seguidores || 10000) * 1.12); }
      logHist(c, `${card.mundial.resultado} pelo ${c.clube.nome}.`);
    }
    // Classificação pro Mundial de Clubes na próxima temporada: título de liga ou continental credenciam o clube
    c.elegivelMundial = !!(card.campeaoLiga || card.continental?.titulo || card.mundial?.titulo);
    c.titulos += titulosLista.length;
    if (titulosLista.length) {
      const clubeKey = c.clube.nome;
      c.titulosPorClube = { ...c.titulosPorClube, [clubeKey]: [...(c.titulosPorClube?.[clubeKey] || []), ...titulosLista] };
    }
    if (copa?.titulo) { const nac = nacDe(c.nacionalidade); c.titulosSelecao = [...(c.titulosSelecao || []), `Copa do Mundo (${nac.label})`]; }

    // O mundo avança junto: rivais rendem, evoluem, trocam de clube e se aposentam
    const mundoAtualizado = mundo ? simularTemporadaMundo(mundo) : null;
    if (mundoAtualizado) setMundo(mundoAtualizado);

    // Artilharia real da liga e disputa real da Bola de Ouro
    let rankingBO = [], artilhariaReal = [], meuPostoBO = null;
    if (mundoAtualizado) {
      const meuCardMundo = { clube: c.clube.nome, posicao: c.posicao, ovr: card.ovr, gols: card.gols, assist: card.assist, nota: card.nota, ligaMult: card.ligaMult };
      rankingBO = rankingBolaDeOuro(mundoAtualizado, meuCardMundo, nome, titulosLista.length);
      artilhariaReal = artilhariaLiga(mundoAtualizado, c.clube.liga, meuCardMundo, nome);
      meuPostoBO = rankingBO.find((x) => x.voce)?.pos ?? null;
      // substitui o artilheiro sorteado pelo artilheiro de verdade da liga
      if (artilhariaReal.length) {
        const topo = artilhariaReal[0];
        card.artilheiro = { nome: topo.voce ? "Você" : topo.nome, gols: topo.gols };
        card.jogadorArtilheiro = !!topo.voce;
      }
      // o rival vira o melhor colocado que não seja você
      const melhorRival = rankingBO.find((x) => !x.voce);
      if (melhorRival) c.rivalPosicao = melhorRival.nome;
    }

    const premios = avaliarPremios(card, c.posicao, copa?.titulo, nome, c.rivalPosicao, meuPostoBO);
    premios.forEach((p) => { if (p.nome === "BOLA DE OURO" && !p.doJogador) c.rivalBolasDeOuro = (c.rivalBolasDeOuro || 0) + 1; });
    premios.forEach((p) => { if (p.doJogador) { c.premiosIndividuais += 1; if (p.bolaDeOuro) { c.bolasDeOuro += 1; logHist(c, "Conquistou a BOLA DE OURO!"); } } });

    c.gols += card.gols; c.assist += card.assist; c.melhorEmCampo += card.melhorEmCampo;

    // ---- MARCOS E RECORDES ----
    const golsAntes = c.gols - card.gols;
    // estatísticas acumuladas no clube atual
    const clubeKeyStats = c.clube.nome;
    const antesClube = statsNoClube(c, clubeKeyStats);
    c.statsPorClube = {
      ...(c.statsPorClube || {}),
      [clubeKeyStats]: {
        gols: antesClube.gols + card.gols, assist: antesClube.assist + card.assist,
        jogos: antesClube.jogos + card.jogos, temporadas: antesClube.temporadas + 1,
        titulos: antesClube.titulos + titulosLista.length,
      },
    };
    // primeiro gol da carreira
    if (golsAntes === 0 && card.gols > 0) registrarMarco(c, "primeiroGol", `Marcou o primeiro gol como profissional pelo ${c.clube.nome}.`);
    // marcas redondas de gols
    marcasDeGolAtingidas(golsAntes, c.gols).forEach((m) => registrarMarco(c, "golRedondo", `Atingiu a marca de ${m} gols na carreira.`, `${m} gols`));
    // títulos e prêmios viram marcos
    titulosLista.forEach((t) => registrarMarco(c, "titulo", `${t} pelo ${c.clube.nome}.`, t));
    premios.filter((p) => p.doJogador).forEach((p) => registrarMarco(c, "premio", `Conquistou ${p.nome}.`, p.nome));
    // seleção
    if (card.copaResultado && card.copaResultado.resultado !== "Não convocado" && !(c.marcos || []).some((m) => m.tipo === "selecao")) {
      registrarMarco(c, "selecao", `Estreou pela seleção ${nacDe(c.nacionalidade).label} numa Copa do Mundo.`);
    }
    if (copa?.titulo) registrarMarco(c, "titulo", `CAMPEÃO DO MUNDO pela seleção ${nacDe(c.nacionalidade).label}!`, "Copa do Mundo");
    // lesão grave
    if (card.lesaoTipo && card.lesaoTipo.gravidade >= 3) registrarMarco(c, "lesao", `${card.lesaoTipo.nome} — ficou meses fora.`);
    // recorde de artilharia do clube
    c.recordesClube = c.recordesClube || {};
    if (!c.recordesClube[clubeKeyStats]) c.recordesClube[clubeKeyStats] = gerarRecordeClube(c.clube);
    const rec = c.recordesClube[clubeKeyStats];
    const golsNoClube = c.statsPorClube[clubeKeyStats].gols;
    if (!rec.quebrado && golsNoClube > rec.gols) {
      rec.quebrado = true; rec.idadeQuebra = c.idade;
      registrarMarco(c, "recorde", `Tornou-se o MAIOR ARTILHEIRO DA HISTÓRIA do ${clubeKeyStats}, com ${golsNoClube} gols!`, `${golsNoClube} gols`);
      logHist(c, `📜 Superou o recorde histórico de gols do ${clubeKeyStats} (${rec.gols}) — agora o maior artilheiro do clube.`);
      setTorcidaClube(c, clubeKeyStats, 15);
      c.fama = clamp(c.fama + 8, 0, 100);
    }
    const tierNum = (v) => (v >= 93 ? 3 : v >= 85 ? 2 : v >= 75 ? 1 : 0);
    const tierAntes = tierNum(c.picoOvr);
    c.picoOvr = Math.max(c.picoOvr, card.ovr);
    const subiuTier = tierNum(c.picoOvr) > tierAntes;
    c.forma = clamp((card.nota - 6.8) * 2 + (c.staff?.nutricionista ? 0.6 : 0) + (c.staff?.chefParticular ? 0.3 : 0), -4, 4);

    const persona = PERSONALIDADES.find((p) => p.id === c.personalidade) || PERSONALIDADES[3];
    { // Imortal deixa o declínio mais lento
      const freioDeclinio = multEfeitoInsignia(c, "declinio");
      c.attrs = evoluirAtributos(c.attrs, c.potencial, c.idade, persona, c.focoTreino, (c.staff?.psicologoEsportivo ? 0.85 : 1) * (freioDeclinio || 1));
    }
    // Líder Nato puxa o moral do grupo todo ano
    { const m = somaEfeitoInsignia(c, "moralAnual"); if (m) c.elencoMoral = clampR((c.elencoMoral ?? 60) + m, 0, 100); }
    // Ídolo Eterno estabelece um piso de torcida no clube atual
    { const piso = somaEfeitoInsignia(c, "pisoTorcida");
      if (piso && getTorcida(c, c.clube.nome) < piso) c.torcidaPorClube = { ...(c.torcidaPorClube || {}), [c.clube.nome]: piso }; }
    // Sequelas cobram o preço: depois dos 30, o corpo castigado perde velocidade e físico mais rápido
    if (c.idade >= 30 && (c.sequela || 0) > 0.1 && Math.random() < (c.sequela || 0)) {
      const alvo = Math.random() < 0.6 ? "velocidade" : "fisico";
      c.attrs = { ...c.attrs, [alvo]: clamp(c.attrs[alvo] - 1, 1, 99) };
      logHist(c, `As lesões antigas cobram o preço — perdeu 1 de ${alvo}.`);
    }
    atualizarTraits(c);
    c.anoNoClube += 1;

    setTorcidaClube(c, c.clube.nome, (card.nota - 6.6) * 6 + titulosLista.length * 6);
    c.fama = clamp(c.fama + (premios.filter((p) => p.doJogador).length * 5 + card.gols * 0.15) * (persona?.famaMult || 1) + (c.staff?.consultorImagem ? 1 : 0), 0, 100);
    // Lesão da temporada: registra tipo, sequela e perda de atributo
    let lesaoOcorrida = null;
    if (card.lesao && card.lesaoTipo) {
      lesaoOcorrida = aplicarLesao(c, card.lesaoTipo);
      logHist(c, `🩹 ${card.lesaoTipo.nome}${lesaoOcorrida.recaida ? " (recaída na mesma região)" : ""} — ${lesaoOcorrida.jogosFora} jogos fora${lesaoOcorrida.perda > 0 ? `, −${lesaoOcorrida.perda} de ${card.lesaoTipo.atributo}` : ""}.`);
    }
    c.desgaste = Math.max(0, (c.treinouPesado ? c.desgaste + 1 : c.desgaste - 0.5) - (c.staff?.personalTrainer ? 0.4 : 0));

    // ---- ESTILO DE VIDA COBRA (E PAGA) ----
    const ost = efeitosOstentacao(c);
    c.ostentacao = ost.nivel;
    // bens que ajudam ou atrapalham fisicamente
    const fisicoBens = (c.posses || []).reduce((s, p) => s + (p.efeitoFisico || 0), 0);
    c.desgaste = Math.max(0, c.desgaste + fisicoBens + ost.desgaste);
    // patrocinadores de luxo gostam de quem tem imagem de estrela
    if (ost.patrocinio > 0) c.relacaoPatrocinadores = clampR((c.relacaoPatrocinadores ?? 50) + Math.round(ost.patrocinio * 0.25), 0, 100);
    // mas o vestiário e a torcida cobram o exagero
    if (ost.elenco < 0) c.elencoMoral = clampR((c.elencoMoral ?? 60) + ost.elenco, 0, 100);
    if (ost.torcida < 0) setTorcidaClube(c, c.clube.nome, ost.torcida);
    if (ost.alerta && Math.random() < 0.4) logHist(c, `💸 ${ost.alerta}`);
    // Desgaste acumulado real: mais jogos, abordagem mais intensa e idade avançada cobram mais caro
    const fatorAbordagem = c.abordagem === "limite" ? 1.5 : c.abordagem === "dedicado" ? 1.0 : 0.8;
    const penalidadeIdade = 1 + Math.max(0, c.idade - 16) / 20;
    { // postura de jogo também cobra do corpo
      const postSeason = POSTURAS_JOGO.find((x) => x.id === (c.posturaPreferida || "normal")) || POSTURAS_JOGO[1];
      c.desgaste += ((card.jogos * fatorAbordagem) / 100) * penalidadeIdade * ((ROTINAS_FISICAS.find((r) => r.id === c.rotinaFisica) || ROTINAS_FISICAS[1]).desgasteMult) * postSeason.desgasteMult;
    }
    // zera o acúmulo de amarelos entre temporadas, mas guarda o histórico
    if (c.cartoes) c.cartoes = { ...c.cartoes, amarelosAcumulados: 0, suspensoesRestantes: 0 };
    // A energia reseta a cada temporada, mas o teto de preparação física pra pré-temporada seguinte
    // é penalizado pelo desgaste acumulado — jogar sempre no limite cobra o preço no condicionamento.
    c.energiaMax = clampR(100 - c.desgaste * 12, 55, 100);
    c.energia = c.energiaMax;
    rodarEventoClube(c);

    // manutenção anual dos bens + rendimento de imóveis comerciais
    const manutencaoTotal = (c.posses || []).reduce((s, p) => s + (p.manutencao || 0), 0);
    if (manutencaoTotal > 0) { c.cofre -= manutencaoTotal; c.extrato = [...c.extrato, { idade: c.idade, tipo: "Manutenção de bens", valor: -manutencaoTotal }]; }
    (c.posses || []).forEach((p) => {
      if (p.comercial) { const rendimento = rand(-8, 15); c.cofre += rendimento; c.extrato = [...c.extrato, { idade: c.idade, tipo: `${p.nome} (rendimento)`, valor: rendimento }]; }
    });

    // Equipe & estilo de vida: contratos temporários — cobram manutenção e vencem, precisando renovar
    if (c.staffContratos) {
      const staffAtualizado = { ...c.staff };
      const contratosAtualizados = {};
      let manutencaoStaff = 0;
      Object.entries(c.staffContratos).forEach(([id, contrato]) => {
        manutencaoStaff += contrato.manutencao || 0;
        const restantes = (contrato.restantes || 1) - 1;
        if (restantes <= 0) {
          delete staffAtualizado[id];
          const nomeItem = LOJA_ITENS.find((it) => it.id === id)?.nome || id;
          logHist(c, `Contrato de ${nomeItem} venceu — precisa renovar pra manter o efeito.`);
        } else {
          contratosAtualizados[id] = { ...contrato, restantes };
        }
      });
      if (manutencaoStaff > 0) { c.cofre -= manutencaoStaff; c.extrato = [...c.extrato, { idade: c.idade, tipo: "Manutenção da equipe", valor: -manutencaoStaff }]; }
      c.staff = staffAtualizado;
      c.staffContratos = contratosAtualizados;
    }

    // crescimento de seguidores: individuais valem mais que coletivos, sempre soma (nunca cai sozinho)
    let ganhoSeguidores = Math.max(0, (card.nota - 6.6)) * c.seguidores * 0.03;
    premios.forEach((p) => { if (p.doJogador) ganhoSeguidores += p.bolaDeOuro ? c.seguidores * 0.18 + 200000 : c.seguidores * 0.06 + 15000; });
    ganhoSeguidores += titulosLista.length * (c.seguidores * 0.02 + 5000);
    if (copa?.titulo) ganhoSeguidores += c.seguidores * 0.1 + 100000;
    const alvoSeguidores = seguidoresBase(card.ovr);
    if (alvoSeguidores > c.seguidores) ganhoSeguidores += (alvoSeguidores - c.seguidores) * 0.12;
    c.seguidores = Math.round(c.seguidores + ganhoSeguidores);
    c.ultimaMsgTipo = card.nota >= 7.3 ? "pos" : card.nota <= 6.3 ? "neg" : "neutro";
    c.treinouPesado = false; c.focoTreino = null;

    // salário da temporada vai pro cofre (usa contrato negociado, se houver, + bônus por gol)
    const metaSalarioMult = 1 + (c.expectativa?.nivelNegociacao || 0) * 0.08;
    const salarioBase = Math.round((c.contrato ? c.contrato.salario : salarioClube(c.clube, card.ovr)) * metaSalarioMult);
    const bonusGols = c.contrato ? card.gols * c.contrato.bonusGol : 0;
    const salario = salarioBase + bonusGols;
    c.cofre += salario;
    c.extrato = [...c.extrato, { idade: c.idade, tipo: bonusGols ? `Salário + bônus de gols` : "Salário", valor: salario, clube: c.clube.nome }];
    if (c.contrato) {
      c.contrato = { ...c.contrato, restantes: c.contrato.restantes - 1 };
      if (c.contrato.restantes <= 0) { logHist(c, `Contrato com o ${c.clube.nome} chegou ao fim — renovação automática nos mesmos moldes.`); c.contrato = { ...c.contrato, restantes: c.contrato.anos }; }
    }

    if (card.nota >= 7.0 && Math.random() < 0.4) {
      const cands = CLUBES.filter((x) => x.nome !== c.clube.nome && Math.abs(x.forca - card.ovr) <= 12 && !(c.clubesInteresse || []).includes(x.nome));
      if (cands.length) { const alvo = pick(cands); c.clubesInteresse = [...(c.clubesInteresse || []), alvo.nome].slice(-5); }
    }

    // Avalia a meta individual negociada com a diretoria e mexe na confiança do técnico
    const expectativa = c.expectativa || gerarMetaIndividual(c);
    const bateuMeta = avaliarMetaIndividual(expectativa, card, c.posicao);
    const riscoNegociado = expectativa.nivelNegociacao || 0;
    { const suavizador = c.contrato?.clausulaEstabilidade ? 0.6 : 1; c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + ((bateuMeta ? 8 + riscoNegociado * 3 : (-14 - riscoNegociado * 6) * suavizador) + (card.nota - 6.8) * 4), 0, 100); }

    // Cobrança da promessa feita pelo técnico no início da temporada
    let resultadoPromessa = null;
    if (c.promessaTecnico) {
      const def = promessaPorId(c.promessaTecnico.id);
      if (def) {
        const cumpriu = def.checa(card, c.promessaTecnico.meta);
        if (cumpriu) { def.recompensa(c); logHist(c, `Pacto com o técnico cumprido (${def.titulo}): ${def.textoOk}`); }
        else {
          def.punicao(c);
          // se a promessa dependia do técnico te dar minutos, a culpa é dele — e isso te dá respaldo
          if (def.quebraDoTecnico) { c.promessaQuebradaPeloTecnico = true; setTorcidaClube(c, c.clube.nome, 4); }
          logHist(c, `Pacto com o técnico não se cumpriu (${def.titulo}): ${def.textoFalha}`);
        }
        resultadoPromessa = { titulo: def.titulo, cumpriu, texto: cumpriu ? def.textoOk : def.textoFalha, culpaDoTecnico: !cumpriu && !!def.quebraDoTecnico };
      }
      c.promessaTecnico = null;
    }
    if (bateuMeta) {
      const bonusMeta = Math.round(salarioClube(c.clube, card.ovr) * (0.15 + riscoNegociado * 0.15));
      c.cofre += bonusMeta; c.extrato = [...c.extrato, { idade: c.idade, tipo: "Bônus por meta batida", valor: bonusMeta }];
      logHist(c, `Meta individual batida (+$${formatarDinheiro(bonusMeta)} de bônus): ${c.posicao === "GOL" ? `${expectativa.cleanSheets} jogos sem sofrer gol` : `${expectativa.gols} gols / ${expectativa.assist} assist.`}.`);
    } else {
      logHist(c, `Meta individual não batida — confiança do técnico caiu${riscoNegociado > 0 ? " (você tinha pedido mais)" : ""}.`);
    }

    // Empresário: comissão sobre o salário, efeito anual do estilo e vencimento do vínculo
    if (c.empresario) {
      const emp = empresarioPorId(c.empresario.id);
      const comissao = Math.round((salario || 0) * (emp.comissao || 0));
      if (comissao > 0) { c.cofre -= comissao; c.extrato = [...c.extrato, { idade: c.idade, tipo: `Comissão — ${emp.nome}`, valor: -comissao }]; }
      if (emp.efeitoAnual) emp.efeitoAnual(c);
      const restantes = (c.empresario.restantes || 1) - 1;
      if (restantes <= 0) { c.empresario = null; logHist(c, `O vínculo com ${emp.nome} chegou ao fim — você está sem empresário.`); }
      else c.empresario = { ...c.empresario, restantes };
    }

    // O elenco envelhece e evolui junto
    c.elenco = evoluirElenco(c.elenco, c.clube);
    if ((c.elenco || []).length < 14) c.elenco = gerarElenco(c.clube, mundoAtualizado || mundo, c.posicao);
    c.concorrente = sortearConcorrente(c.clube, c.elenco, c.posicao);

    // ---- VESTIÁRIO: parceria, apadrinhado e desafeto ----
    c.relacoes = c.relacoes || {};
    const eventosVestiario = aplicarEfeitosVestiario(c, card, c.elenco);
    eventosVestiario.forEach((ev) => {
      logHist(c, ev.texto);
      c.inbox = [noticiaDoMomento(c, "clube", TIPOS_RELACAO[ev.tipo]?.nome || "Vestiário", ev.texto, 1), ...(c.inbox || [])].slice(0, 60);
    });
    // se ficou sem relações (todos saíram), o grupo novo cria outras
    if (!c.relacoes.parceiro && !c.relacoes.pupilo && Math.random() < 0.5) {
      c.relacoes = { ...c.relacoes, ...gerarRelacoesVestiario(c.elenco, c.posicao, c.idade) };
    }

    // ---- AS LIGAS SE MEXEM: força oscila, times sobem e caem ----
    let movimentoLigas = null;
    {
      let estadoAtual = c.estadoClubes || estadoInicialClubes();

      // ---- PALMARÉS: credita os títulos da temporada ----
      // 1) o que VOCÊ ganhou vai pro seu clube
      if (card.campeaoLiga) estadoAtual = creditarTitulo(estadoAtual, c.clube.nome, "liga");
      if (card.copaNacional?.titulo) estadoAtual = creditarTitulo(estadoAtual, c.clube.nome, "copa");
      if (card.continental?.titulo) estadoAtual = creditarTitulo(estadoAtual, c.clube.nome, "continental");
      if (card.mundial?.titulo) estadoAtual = creditarTitulo(estadoAtual, c.clube.nome, "mundial");
      // 2) o resto do mundo também tem campeões — o Real segue somando Champions
      const titulosMundo = distribuirTitulosDoMundo(estadoAtual, c.clube.liga, {
        liga: !!card.campeaoLiga, copa: !!card.copaNacional?.titulo,
        continental: !!card.continental?.titulo, mundial: !!card.mundial?.titulo,
      });
      estadoAtual = titulosMundo.estado;
      c.campeoesDaTemporada = titulosMundo.campeoes;

      const giro = girarLigas(estadoAtual);
      c.estadoClubes = giro.estado;
      movimentoLigas = { promovidos: giro.promovidos, rebaixados: giro.rebaixados };
      // seu clube pode ter mudado de divisão ou de patamar
      const meuNovo = clubeAtual(giro.estado, c.clube.nome);
      if (meuNovo) {
        const mudouDivisao = meuNovo.liga !== c.clube.liga;
        c.clube = { ...c.clube, liga: meuNovo.liga, forca: meuNovo.forca };
        if (mudouDivisao) {
          const subiu = meuNovo.liga === "brasileirao";
          logHist(c, subiu ? `⬆️ O ${c.clube.nome} conquistou o ACESSO à elite!` : `⬇️ O ${c.clube.nome} foi REBAIXADO para a Série B.`);
          registrarMarco(c, subiu ? "titulo" : "lesao", subiu ? `Subiu com o ${c.clube.nome} para a primeira divisão.` : `Amargou o rebaixamento com o ${c.clube.nome}.`);
          setTorcidaClube(c, c.clube.nome, subiu ? 12 : -10);
        }
      }
    }

    // ---- O TÉCNICO PODE CAIR ----
    let trocaTecnico = null;
    if (c.tecnico) {
      const dest = avaliarPermanenciaTecnico(c, card, bateuMeta);
      if (dest?.saiu) {
        const antigo = c.tecnico;
        const novo = gerarTecnico(c.clube);
        c.tecnico = novo;
        // confiança recomeça, ajustada pelo quanto seu perfil combina com o novo estilo
        c.tecnicoConfianca = clampR(55 + encaixeNoEstilo(c) * 1.2, 20, 88);
        c.promessaTecnico = null; c.promessaQuebradaPeloTecnico = false;
        const motivoTxt = dest.motivo === "demitido" ? "foi demitido depois de uma temporada ruim" : dest.motivo === "assediado" ? "foi levado por um clube maior" : "encerrou o ciclo";
        trocaTecnico = { antigo: antigo.nome, novo: novo.nome, motivo: dest.motivo, estiloNovo: novo.estilo };
        logHist(c, `🔄 ${antigo.nome} ${motivoTxt}. ${novo.nome} assume o comando (${estiloTecnico(novo.estilo).nome}).`);
        registrarMarco(c, "transferencia", `${novo.nome} assumiu o comando do ${c.clube.nome} no lugar de ${antigo.nome}.`);
      } else if (dest) {
        c.tecnico = { ...c.tecnico, temporadas: dest.temporadas };
        // com o tempo, quem combina com o estilo do técnico ganha confiança
        c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + encaixeNoEstilo(c) * 0.35, 0, 100);
      }
    }

    // Copa do Mundo também entra nos números acumulados de seleção
    if (card.copaResultado && card.copaResultado.resultado !== "Não convocado") {
      const st = statsSelecao(c, card);
      if (st && !(c.selecao.historico || []).some((h) => h.idade === c.idade && h.comp === "copa")) {
        c.selecao = {
          ...c.selecao,
          jogos: c.selecao.jogos + st.jogos, gols: c.selecao.gols + st.gols,
          assist: c.selecao.assist + st.assist, cleanSheets: (c.selecao.cleanSheets || 0) + (st.cleanSheets || 0),
          convocacoesSeguidas: (c.selecao.convocacoesSeguidas || 0) + 1,
          historico: [...(c.selecao.historico || []), { idade: c.idade, comp: "copa", nomeComp: "Copa do Mundo", icone: "🌎", cor: "#D8B44A", campanha: st.campanha, titulo: st.titulo, jogos: st.jogos, gols: st.gols, assist: st.assist, cleanSheets: st.cleanSheets, nota: st.nota }],
        };
      }
    }

    // alimenta a insígnia "Jogador de Decisão": quanto você rende a mais em jogo grande
    {
      const todos = todosJogosCarreira([...temporadas, { jogosLista: jogosLista.length ? jogosLista : card.jogosLista, temporadaLabel: "", clube: c.clube.nome }]);
      const an = analisarJogos(todos);
      if (an && an.classicos.jogos >= 3) c.difClassico = +(an.classicos.notaMedia - an.normais.notaMedia).toFixed(2);
    }

    // ---- METAS DA DIRETORIA POR COMPETIÇÃO ----
    const balancoMetas = avaliarMetasCompeticao(c, card);
    if (balancoMetas.total > 0) {
      c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + balancoMetas.deltaDiretoria, 0, 100);
      if (balancoMetas.premio > 0) {
        c.cofre += balancoMetas.premio;
        c.extrato = [...c.extrato, { idade: c.idade, tipo: "Bônus por metas cumpridas", valor: balancoMetas.premio }];
      }
      const txt = balancoMetas.resultados.map((r) => `${r.cumprida ? "✅" : "❌"} ${r.texto}`).join(" · ");
      logHist(c, `Metas da diretoria: ${txt}${balancoMetas.premio ? ` (bônus de $${formatarDinheiro(balancoMetas.premio)})` : ""}`);
      c.inbox = [noticiaDoMomento(c, "clube",
        balancoMetas.cumpridas === balancoMetas.total ? "Diretoria satisfeita: todas as metas cumpridas" : balancoMetas.cumpridas === 0 ? "Diretoria cobra: nenhuma meta cumprida" : `Metas: ${balancoMetas.cumpridas} de ${balancoMetas.total} cumpridas`,
        txt, balancoMetas.cumpridas === 0 ? 3 : 1), ...(c.inbox || [])].slice(0, 60);
    }
    c.metasCompeticao = null;

    // ---- MEMÓRIA: confrontos, jogos memoráveis e apelido da torcida ----
    {
      const jogosDaTemporada = jogosLista.length ? jogosLista : (card.jogosLista || []);
      registrarConfrontos(c, jogosDaTemporada);
      const memoraveis = detectarJogosMemoraveis(c, jogosDaTemporada, {
        temporadaLabel: temporadaLabel(c.idade, ANO_INICIO), idade: c.idade, clube: c.clube.nome,
      });
      memoraveis.slice(0, 2).forEach((m) => {
        logHist(c, `⭐ Jogo memorável x ${m.adversario} (${m.golsMeu}-${m.golsAdv}): ${m.criterios.map((x) => x.label).join(", ")}.`);
      });
      // a torcida pode te batizar
      const novoApelido = avaliarApelido(c, temporadas);
      if (novoApelido) {
        c.apelido = novoApelido;
        logHist(c, `📣 A torcida do ${c.clube.nome} te batizou: "${novoApelido.nome}".`);
        registrarMarco(c, "recorde", `A torcida do ${c.clube.nome} passou a te chamar de "${novoApelido.nome}".`, novoApelido.nome);
        c.inbox = [noticiaDoMomento(c, "clube", `A torcida te batizou: ${novoApelido.nome}`, `O apelido pegou na arquibancada e já virou cântico. Poucos jogadores conquistam isso.`, 2), ...(c.inbox || [])].slice(0, 60);
      }
    }

    // gols em clássicos alimentam o marco secreto "Carrasco do rival"
    { const cls = (jogosLista.length ? jogosLista : (card.jogosLista || [])).filter((j) => j.classico);
      c.golsEmClassicos = (c.golsEmClassicos || 0) + cls.reduce((a2, j) => a2 + (j.golsMinha || 0), 0); }

    // ---- MARCOS ESPECIAIS (recompensas, cicatrizes e segredos) ----
    const marcosNovos = checarMarcosEspeciais(c, card, { postoBO: meuPostoBO });

    // ---- VALOR DE MERCADO ----
    const valorAtual = valorDeMercado(c, card.ovr, card);
    const valorAnterior = c.valorMercado ?? valorAtual;
    c.valorMercado = valorAtual;
    c.valorPico = Math.max(c.valorPico || 0, valorAtual);
    c.valorHistorico = [...(c.valorHistorico || []), { idade: c.idade, valor: valorAtual }];

    const registro = {
      idade: c.idade, temporadaLabel: temporadaLabel(c.idade, ANO_INICIO), clube: c.clube.nome, clubeObj: c.clube,
      ...card, copa, premios, titulosLista, torcidaFim: getTorcida(c, c.clube.nome), famaFim: c.fama, salario, expectativa, bateuMeta,
      jogosLista: jogosLista.length ? jogosLista : card.jogosLista,
      porCompeticao: dividirPorCompeticao(c, card),
      selecaoTemporada: c.selecaoTemporadaAtual || statsSelecao(c, card),
      selecaoAcumulado: c.selecao ? { ...c.selecao } : null,
      resultadoPromessa,
      rankingBO: rankingBO.slice(0, 10), artilhariaLiga: artilhariaReal.slice(0, 10), postoBO: meuPostoBO,
      trocaTecnico, movimentoLigas,
      valorMercado: valorAtual, valorAnterior,
    };
    setTemporadas((t) => [...t, registro]);
    // autosave: a virada de temporada é o ponto mais seguro pra gravar
    setTimeout(() => {
      const r = salvarLocal("auto", montarSave({
        stage: "carreira", nome, posicao, nacionalidade, personalidade, pernaDominante, clubeCoracao,
        potencial, origemId: c.origem || null, carreira: c,
        temporadas: [...temporadas, registro], mundo: mundoAtualizado || mundo, fim: null, aba, modoSimulacao,
      }));
      if (r.ok) { setTemSave(true); setAvisoSave({ erro: false, txt: "Progresso salvo automaticamente." }); setTimeout(() => setAvisoSave(null), 2500); }
    }, 0);

    // ---- INBOX: as notícias da temporada ----
    {
      const novas = gerarNoticias(c, registro, mundoAtualizado || mundo, nome).map((x) => ({ ...x, idade: c.idade, temporada: registro.temporadaLabel, clube: registro.clube, clubeObj: registro.clubeObj }));
      c.inbox = [...novas, ...(c.inbox || [])].slice(0, 60);
    }

    let ofertaCompra = null;
    if (c.emprestimo && c.clubeOrigemEmprestimo) {
      c.emprestimoAnosRestantes = (c.emprestimoAnosRestantes || 1) - 1;
      if (c.emprestimoAnosRestantes <= 0) {
        const foiBem = card.nota >= 7.2;
        if (foiBem && Math.random() < 0.5) {
          ofertaCompra = { clube: c.clube, origem: c.clubeOrigemEmprestimo };
        } else {
          logHist(c, `Fim do empréstimo — retornou ao ${c.clubeOrigemEmprestimo.nome}.`);
          c.clube = c.clubeOrigemEmprestimo; c.emprestimo = false; c.clubeOrigemEmprestimo = null; c.anoNoClube = 0;
        }
      } else {
        logHist(c, `Segue emprestado — mais ${c.emprestimoAnosRestantes} temporada(s) no ${c.clube.nome}.`);
      }
    }

    const destaque = card.nota >= 7.4 || premios.length > 0 || (card.gols >= 20 && card.ligaMult < 0.9);
    const ruim = card.nota <= 6.2;
    let proposta = null;
    // emprestado não recebe proposta de ninguém — o contrato é do clube de origem
    const podeNegociar = !c.emprestimo;
    if (!podeNegociar) proposta = null; // emprestado: ninguém pode fazer proposta
    else if (c.idade >= 33 && Math.random() < 0.55) proposta = { tipo: "aposentadoria", opcoes: [{ clube: pick(CLUBES.filter((x) => x.liga === "arabia" || x.liga === "mls")), tipo: "transfer" }], motivo: "Fim de carreira: dinheiro e ritmo leve chamam." };
    else if (destaque && c.anoNoClube >= 2 && Math.random() < 0.6) {
      const alvos = CLUBES.filter((x) => LIGAS[x.liga].mult > card.ligaMult + 0.02 && x.forca >= c.clube.forca - 2 && x.liga !== "arabia" && x.liga !== "mls");
      if (alvos.length) { const op1 = pick(alvos); const op2 = pick(alvos.filter((x) => x.nome !== op1.nome)); proposta = { tipo: "mercado", opcoes: op2 ? [{ clube: op1, tipo: "transfer" }, { clube: op2, tipo: "transfer" }] : [{ clube: op1, tipo: "transfer" }], motivo: "Sua temporada chamou atenção de ligas mais fortes." }; }
    } else if (ruim && c.anoNoClube >= 2 && Math.random() < 0.35) {
      const alvos = CLUBES.filter((x) => x.forca < c.clube.forca && x.liga !== "arabia" && x.liga !== "mls");
      if (alvos.length) proposta = { tipo: "mercado", opcoes: [{ clube: pick(alvos), tipo: "transfer" }], motivo: "Depois de uma temporada difícil, surge uma porta de saída." };
    }

    // ---- CLÁUSULA DE RESCISÃO ATIVADA ----
    // Se a sua multa ficou barata perto do seu valor de mercado, um clube pode simplesmente pagá-la.
    // O seu clube não tem como impedir — a decisão é só sua.
    let clausulaAtivada = null;
    if (c.contrato && c.contrato.multa > 0 && !proposta && !c.emprestimo) {
      const razao = valorAtual / Math.max(1, c.contrato.multa); // >1 = a multa virou pechincha
      let chance = razao >= 2.2 ? 0.6 : razao >= 1.5 ? 0.38 : razao >= 1.05 ? 0.18 : razao >= 0.75 ? 0.06 : 0.01;
      if (destaque) chance *= 1.35;
      if ((card.nota ?? 7) < 6.6) chance *= 0.4;
      if (c.idade > 31) chance *= 0.45;
      if (Math.random() < clamp(chance, 0, 0.72)) {
        const emp = c.empresario ? empresarioPorId(c.empresario.id) : EMPRESARIOS[0];
        const cands = CLUBES
          .filter((x) => x.nome !== c.clube.nome && x.liga !== "serieB")
          .map((clube) => ({ clube, score: scoreInteresseClube(c, clube, registro, emp) }))
          .filter((x) => x.score > 0.5 && x.clube.forca >= c.clube.forca - 2);
        const escolhido = sortearPorInteresse(cands, 1)[0];
        if (escolhido) {
          clausulaAtivada = { clube: escolhido.clube, valorPago: c.contrato.multa, valorMercado: valorAtual, pechincha: c.contrato.multa < valorAtual };
          c.inbox = [noticiaDoMomento(c, "mercado", `${escolhido.clube.nome} deposita sua multa rescisória`, `Foram $${formatarDinheiro(c.contrato.multa)} pagos à vista. O ${c.clube.nome} não pode impedir — a decisão é sua.`, 3), ...(c.inbox || [])].slice(0, 60);
        }
      }
    }

    // calor da mídia: decai naturalmente, mas risco de escândalo se ficar muito alto
    c.calorMidia = Math.max(0, (c.calorMidia ?? 20) - 8);
    if ((c.calorMidia ?? 0) >= 80 && Math.random() < 0.35) {
      setTorcidaClube(c, c.clube.nome, -6);
      c.fama = clamp(c.fama - 8, 0, 100);
      c.calorMidia = clampR(c.calorMidia - 30, 0, 100);
      logHist(c, "Escândalo estourou na imprensa por causa do excesso de exposição — fama e torcida sofreram o baque.");
    }

    // desbloqueio de cosméticos por marcos da carreira
    const statsCosmeticos = { titulos: c.titulos, bolasDeOuro: c.bolasDeOuro, premiosIndividuais: c.premiosIndividuais, picoOvr: c.picoOvr, fama: c.fama };
    COSMETICOS.forEach((item) => {
      if (!(c.cosmeticosDesbloqueados || []).includes(item.id) && item.requisito(statsCosmeticos)) {
        c.cosmeticosDesbloqueados = [...(c.cosmeticosDesbloqueados || []), item.id];
        aplicarEfeitoCosmetico(c, item);
        logHist(c, `Novo item desbloqueado: ${item.nome} — ${item.desc || ""}`);
      }
    });
    // bônus anuais recorrentes de cosméticos já desbloqueados (vestiário, torcida etc.)
    (c.cosmeticosDesbloqueados || []).forEach((id) => {
      const item = COSMETICOS.find((x) => x.id === id);
      if (item?.tecnicoBonusAnual) c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + item.tecnicoBonusAnual, 0, 100);
    });

    c.idade += 1;
    const aposentar = c.idade >= 35 && (c.idade >= 40 || Math.random() < (c.idade - 34) * 0.22);

    // Rivalidade da geração: reavaliada toda temporada conforme o OVR atual — muda de patamar, muda o nome no debate
    const bandaAntiga = poolRivalPorOvr(card.ovr === c.picoOvr ? card.ovr : Math.max(card.ovr, c.picoOvr - 5));
    const trocouBanda = !bandaAntiga.includes(c.rivalPosicao);
    if (trocouBanda || subiuTier || Math.random() < 0.35) {
      const novoRival = sortearRival(c.picoOvr, c.rivalPosicao);
      if (novoRival !== c.rivalPosicao) {
        c.rivalPosicao = novoRival; c.rivalBolasDeOuro = Math.max(0, Math.round((c.rivalBolasDeOuro || 0) * (subiuTier ? 0.5 : 0.8)));
        logHist(c, `${trocouBanda || subiuTier ? "Subindo de patamar, " : ""}${novoRival} vira o novo nome no debate do maior da geração.`);
      }
    }
    setCarreira(c);

    if (subiuTier) {
      setPendingTierUpgrade({ tier: tierInfo(c.picoOvr), registro, aposentar, proposta, ofertaCompra, clausulaAtivada, temporadasSnapshot: [...temporadas, registro] });
    }
    else setAwardsPopup({ registro, aposentar, proposta, ofertaCompra, clausulaAtivada, temporadasSnapshot: [...temporadas, registro], slide: 0 });
  }
  function simularMetadeDaTemporada() {
    const c = { ...carreira };
    let ta = c.temporadaAndamento;
    if (!ta) return;
    let logJogos = [...ta.logJogos];
    let resultadosRodadas = [...ta.resultadosRodadas];
    const restantes = ta.calendario.length - ta.rodadaAtual;
    const alvo = Math.min(ta.calendario.length, ta.rodadaAtual + Math.max(1, Math.round(restantes / 2)));
    while (ta.rodadaAtual < alvo) {
      // se bater num evento agendado, pausa o avanço rápido aqui pra você decidir
      if (ta.eventosAgendados?.[0] && ta.eventosAgendados[0].rodadaAlvo <= ta.rodadaAtual) break;
      if (ta.rodadaAtual === ta.lanceRodada && !ta.lanceResolvido) ta = { ...ta, lanceResolvido: true };
      const { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes } = simularRodadaAtual(c, ta);
      if (meuResultadoRodada) logJogos.push(meuResultadoRodada);
      resultadosRodadas.push(meuResultadoRodada ? meuResultadoRodada.resultado : "E");
      ta = { ...ta, rodadaAtual: ta.rodadaAtual + 1, tabela, historicoRodada: historico, ultimoResultado: meuResultadoRodada, golsRestantes, assistRestantes, logJogos, resultadosRodadas };
    }
    if (ta.rodadaAtual >= ta.calendario.length) {
      c.temporadaAndamento = null;
      finalizarTemporada(c, ta.cardOriginal, logJogos);
    } else {
      c.temporadaAndamento = ta;
      setCarreira(c);
    }
  }
  function simularRestoDaTemporada() {
    const c = { ...carreira };
    let ta = c.temporadaAndamento;
    if (!ta) return;
    let logJogos = [...ta.logJogos];
    let resultadosRodadas = [...ta.resultadosRodadas];
    while (ta.rodadaAtual < ta.calendario.length) {
      if (ta.eventosAgendados?.[0] && ta.eventosAgendados[0].rodadaAlvo <= ta.rodadaAtual) break;
      if (ta.rodadaAtual === ta.lanceRodada && !ta.lanceResolvido) ta = { ...ta, lanceResolvido: true };
      const { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes } = simularRodadaAtual(c, ta);
      if (meuResultadoRodada) logJogos.push(meuResultadoRodada);
      resultadosRodadas.push(meuResultadoRodada ? meuResultadoRodada.resultado : "E");
      ta = { ...ta, rodadaAtual: ta.rodadaAtual + 1, tabela, historicoRodada: historico, ultimoResultado: meuResultadoRodada, golsRestantes, assistRestantes, logJogos, resultadosRodadas };
    }
    if (ta.rodadaAtual >= ta.calendario.length) {
      c.temporadaAndamento = null;
      finalizarTemporada(c, ta.cardOriginal, logJogos);
    } else {
      c.temporadaAndamento = ta;
      setCarreira(c);
    }
  }
  function avancarUmJogo() {
    const c = { ...carreira };
    const ta = c.temporadaAndamento;
    if (!ta) return;
    // evento decisivo agendado pra essa rodada — pausa o jogo a jogo pra resolver ele primeiro
    if (ta.eventosAgendados?.[0] && ta.eventosAgendados[0].rodadaAlvo <= ta.rodadaAtual) {
      const [proximoEvento, ...resto] = ta.eventosAgendados;
      c.temporadaAndamento = { ...ta, eventosAgendados: resto };
      setCarreira(c);
      setCompeticaoCtx({ c, card: ta.cardOriginal });
      setPendingCompeticao(proximoEvento);
      return;
    }
    if (ta.rodadaAtual === ta.lanceRodada && !ta.lanceResolvido) {
      const jogoDoJogador = ta.calendario[ta.rodadaAtual].find((p) => p.casa.nome === c.clube.nome || p.fora.nome === c.clube.nome);
      const adversario = jogoDoJogador ? (jogoDoJogador.casa.nome === c.clube.nome ? jogoDoJogador.fora.nome : jogoDoJogador.casa.nome) : "adversário";
      const rTipo = Math.random();
      const tipoLance = rTipo < 0.22 ? "falta" : rTipo < 0.44 ? "passe" : "texto";
      const advObj = CLUBES.find((x) => x.nome === adversario);
      const contexto = gerarContextoLance(c, adversario, advObj?.forca);
      setPendingLanceJogo({ adversario, tipoLance, contexto });
      return;
    }

    const { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes } = simularRodadaAtual(c, ta);
    const proxRodada = ta.rodadaAtual + 1;
    const logJogos = meuResultadoRodada ? [...ta.logJogos, meuResultadoRodada] : ta.logJogos;
    const resultadosRodadas = [...ta.resultadosRodadas, meuResultadoRodada ? meuResultadoRodada.resultado : "E"];
    if (proxRodada >= ta.calendario.length) {
      c.temporadaAndamento = null;
      finalizarTemporada(c, ta.cardOriginal, logJogos);
    } else {
      c.temporadaAndamento = { ...ta, rodadaAtual: proxRodada, tabela, historicoRodada: historico, ultimoResultado: meuResultadoRodada, golsRestantes, assistRestantes, logJogos, resultadosRodadas };
      setCarreira(c);
    }
  }
  function resolverLanceJogo(opcao) {
    const c = { ...carreira };
    const ta = c.temporadaAndamento;
    const adversario = pendingLanceJogo.adversario;
    const ctx = pendingLanceJogo.contexto;
    const aj = ajustesDoContexto(ctx);
    let chance = clamp((c.attrs[opcao.attr] - 40) / 60, 0.15, 0.9) * aj.chanceMult;
    if (opcao.id === "passe") chance = clamp(chance + ((c.elencoMoral ?? 60) - 60) / 200, 0.1, 0.92);
    const sucesso = Math.random() < chance;
    const ehGol = !["passe", "sair", "contra"].includes(opcao.id);
    let bonusGol = 0, bonusAssist = 0;
    // Qualquer posição pode decidir um lance — o minigame já determinou se acertou.
    if (sucesso) { if (ehGol) bonusGol = 1; else bonusAssist = 1; c.minigamesAcertados = (c.minigamesAcertados || 0) + 1; }
    const { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes } = simularRodadaAtual(c, { ...ta, lanceResolvido: true }, bonusGol, bonusAssist);
    // O gol/assistência entra no CARD DA TEMPORADA — o total da carreira é somado
    // depois, em finalizarTemporada. Somar nos dois lugares causaria contagem dupla.
    if (bonusGol || bonusAssist) {
      ta.cardOriginal = { ...ta.cardOriginal, gols: (ta.cardOriginal.gols || 0) + bonusGol, assist: (ta.cardOriginal.assist || 0) + bonusAssist };
    }
    const proxRodada = ta.rodadaAtual + 1;
    const logJogos = meuResultadoRodada ? [...ta.logJogos, meuResultadoRodada] : ta.logJogos;
    const resultadosRodadas = [...ta.resultadosRodadas, meuResultadoRodada ? meuResultadoRodada.resultado : "E"];
    // quanto mais dramático o momento, maior o efeito na fama e na torcida
    if (sucesso) {
      c.fama = clamp(c.fama + Math.round(2 * aj.famaMult), 0, 100);
      setTorcidaClube(c, c.clube.nome, Math.round(3 * aj.torcidaMult));
    } else if (ctx?.peso >= 3) {
      setTorcidaClube(c, c.clube.nome, -2); // falhar num momento decisivo custa
    }
    setResultadoAcao({
      titulo: sucesso ? (ctx?.peso >= 3 ? "🌟 DECIDIU O JOGO!" : "🌟 Lance decisivo!") : (ctx?.peso >= 3 ? "😞 Perdeu a chance" : "Não foi dessa vez"),
      texto: (ctx ? ctx.texto + " " : "") + (sucesso ? opcao.sucesso(adversario) : opcao.falha(adversario)),
      icone: sucesso ? "⚡" : "😅",
    });
    if (proxRodada >= ta.calendario.length) {
      c.temporadaAndamento = null;
      finalizarTemporada(c, ta.cardOriginal, logJogos);
    } else {
      c.temporadaAndamento = { ...ta, rodadaAtual: proxRodada, tabela, historicoRodada: historico, ultimoResultado: meuResultadoRodada, lanceResolvido: true, golsRestantes, assistRestantes, logJogos, resultadosRodadas };
      setCarreira(c);
    }
    setPendingLanceJogo(null);
  }
  function finalizarLanceComBonus(bonusGol, bonusAssist, tituloResultado, textoResultado, iconeResultado) {
    const c = { ...carreira };
    const ta = c.temporadaAndamento;
    if (bonusGol || bonusAssist) {
      ta.cardOriginal = { ...ta.cardOriginal, gols: (ta.cardOriginal.gols || 0) + bonusGol, assist: (ta.cardOriginal.assist || 0) + bonusAssist };
    }
    const { tabela, historico, meuResultadoRodada, golsRestantes, assistRestantes } = simularRodadaAtual(c, { ...ta, lanceResolvido: true }, bonusGol, bonusAssist);
    const proxRodada = ta.rodadaAtual + 1;
    const logJogos = meuResultadoRodada ? [...ta.logJogos, meuResultadoRodada] : ta.logJogos;
    const resultadosRodadas = [...ta.resultadosRodadas, meuResultadoRodada ? meuResultadoRodada.resultado : "E"];
    setResultadoAcao({ titulo: tituloResultado, texto: textoResultado, icone: iconeResultado });
    if (proxRodada >= ta.calendario.length) {
      c.temporadaAndamento = null;
      finalizarTemporada(c, ta.cardOriginal, logJogos);
    } else {
      c.temporadaAndamento = { ...ta, rodadaAtual: proxRodada, tabela, historicoRodada: historico, ultimoResultado: meuResultadoRodada, lanceResolvido: true, golsRestantes, assistRestantes, logJogos, resultadosRodadas };
      setCarreira(c);
    }
    setPendingLanceJogo(null);
    setLanceMiniResultado(null);
  }
  function escolherZonaLanceFalta(zona) {
    const c = carreira;
    const bonusBP = c.especialistaBP ? 4 : 0;
    const gol = calcularSucessoFalta(c.attrs.finalizacao + bonusBP, c.attrs.drible + bonusBP);
    const tipo = tipoResultadoFalta(gol, zona);
    setLanceMiniResultado({ tipo: "falta", zona, gol, tipoResultado: tipo });
  }
  function continuarLanceFalta() {
    const adversario = pendingLanceJogo.adversario;
    const { gol } = lanceMiniResultado;
    finalizarLanceComBonus(gol ? 1 : 0, 0,
      gol ? "🌟 Lance decisivo!" : "Não foi dessa vez",
      gol ? `Cobrou a falta e balançou a rede contra o ${adversario}!` : `Cobrou a falta, mas não converteu contra o ${adversario}.`,
      gol ? "⚡" : "😅");
  }
  function escolherLancePasse(r, companheiro, cena) {
    setLanceMiniResultado({ tipo: "passe", r, companheiro, cena });
  }
  function continuarLancePasse() {
    const adversario = pendingLanceJogo.adversario;
    const { r } = lanceMiniResultado;
    finalizarLanceComBonus(0, r.gol ? 1 : 0,
      r.gol ? "🌟 Lance decisivo!" : "Não foi dessa vez",
      r.gol ? `Achou o companheiro livre contra o ${adversario} — assistência sua!` : `Tentou o passe, mas a defesa do ${adversario} interceptou.`,
      r.gol ? "⚡" : "😅");
  }

  function fecharTierUpgrade() {
    const { registro, aposentar, proposta, ofertaCompra, clausulaAtivada, temporadasSnapshot } = pendingTierUpgrade;
    setPendingTierUpgrade(null);
    setAwardsPopup({ registro, aposentar, proposta, ofertaCompra, clausulaAtivada, temporadasSnapshot, slide: 0 });
  }
  function avancarAwardsPopup() {
    if (awardsPopup.slide < 2) { setAwardsPopup((p) => ({ ...p, slide: p.slide + 1 })); return; }
    const { aposentar, proposta, ofertaCompra, clausulaAtivada, temporadasSnapshot } = awardsPopup;
    setAwardsPopup(null);
    if (aposentar) {
      const opcoesFimDeCarreira = [{ clube: pick(CLUBES.filter((x) => x.liga === "arabia" || x.liga === "mls")), tipo: "normal" }];
      setJanela({ tipo: "aposentadoria", opcoes: opcoesFimDeCarreira, temporadasSnapshot });
    }
    else if (clausulaAtivada) setJanela({ tipo: "clausula", clausula: clausulaAtivada });
    else if (ofertaCompra) setJanela({ tipo: "compraDefinitiva", ofertaCompra });
    else if (proposta) setJanela(proposta);
    else { setCarreira((c) => ({ ...c, empresarioUsado: {} })); setPosTemporada({ ok: true, ...gerarBloqueios() }); }
  }
  function acaoVestiario(tipo) {
    const c = { ...carreira };
    c.relacoes = { ...(c.relacoes || {}) };
    let texto = "", deltas = [];
    if (tipo === "treinarParceria" && c.relacoes.parceiro) {
      const g = rand(10, 20);
      c.relacoes.parceiro = { ...c.relacoes.parceiro, sintonia: clampR(c.relacoes.parceiro.sintonia + g, 0, 100) };
      c.energia = clampR((c.energia ?? 100) - 6, 0, 100);
      texto = `Você e ${c.relacoes.parceiro.nome} ficaram treinando tabelinha depois do treino. A sintonia subiu.`;
      deltas = [{ label: "Sintonia", valor: g }];
    } else if (tipo === "orientarPupilo" && c.relacoes.pupilo) {
      const j = (c.elenco || []).find((x) => x.id === c.relacoes.pupilo.id);
      if (j) j.ovr = clampR(j.ovr + rand(1, 2), 40, 96);
      c.elencoMoral = clampR((c.elencoMoral ?? 60) + 5, 0, 100);
      texto = `Você tirou um tempo pra orientar ${c.relacoes.pupilo.nome}. O garoto absorve tudo — e o grupo notou o gesto.`;
      deltas = [{ label: "Moral do elenco", valor: 5 }];
    } else if (tipo === "fazerAsPazes" && c.relacoes.desafeto) {
      const sucesso = Math.random() < 0.55;
      if (sucesso) {
        const q = rand(20, 35);
        c.relacoes.desafeto = { ...c.relacoes.desafeto, atrito: clampR(c.relacoes.desafeto.atrito - q, 0, 100) };
        c.elencoMoral = clampR((c.elencoMoral ?? 60) + 7, 0, 100);
        texto = `Você chamou ${c.relacoes.desafeto.nome} pra conversar e os dois enterraram o assunto. O vestiário agradece.`;
        deltas = [{ label: "Atrito", valor: -q }, { label: "Moral do elenco", valor: 7 }];
      } else {
        c.relacoes.desafeto = { ...c.relacoes.desafeto, atrito: clampR(c.relacoes.desafeto.atrito + 10, 0, 100) };
        texto = `A conversa com ${c.relacoes.desafeto.nome} azedou de novo. Ficou pior do que estava.`;
        deltas = [{ label: "Atrito", valor: 10 }];
      }
    } else if (tipo === "peitarDesafeto" && c.relacoes.desafeto) {
      c.relacoes.desafeto = { ...c.relacoes.desafeto, atrito: clampR(c.relacoes.desafeto.atrito + rand(12, 22), 0, 100) };
      c.elencoMoral = clampR((c.elencoMoral ?? 60) - 6, 0, 100);
      c.fama = clamp(c.fama + 3, 0, 100);
      texto = `Você bateu de frente com ${c.relacoes.desafeto.nome} na frente de todo mundo. Alguns respeitaram, o grupo racha um pouco mais.`;
      deltas = [{ label: "Moral do elenco", valor: -6 }, { label: "Fama", valor: 3 }];
    }
    if (!texto) return;
    logHist(c, texto);
    setCarreira(c);
    setVestiarioAberto(false);
    setResultadoAcao({ titulo: "Vestiário", texto, icone: "🚪", deltas });
  }
  function decidirClausula(aceitar) {
    const c = { ...carreira };
    const { clausula } = janela;
    if (aceitar) {
      logHist(c, `${clausula.clube.nome} pagou sua multa rescisória de $${formatarDinheiro(clausula.valorPago)} — você está de saída.`);
      registrarMarco(c, "transferencia", `${clausula.clube.nome} ativou sua cláusula de rescisão ($${formatarDinheiro(clausula.valorPago)}).`, clausula.clube.nome);
      setTorcidaClube(c, c.clube.nome, -8);
      setCarreira(c);
      setJanela({ tipo: "mercado", forcado: true, opcoes: [{ clube: clausula.clube, tipo: "transfer" }], motivo: `Cláusula ativada: o ${clausula.clube.nome} já depositou a multa.` });
      return;
    }
    // recusou: fica, e o clube reconhece a lealdade
    c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + 12, 0, 100);
    setTorcidaClube(c, c.clube.nome, 14);
    c.elencoMoral = clampR((c.elencoMoral ?? 60) + 6, 0, 100);
    logHist(c, `Recusou a proposta do ${clausula.clube.nome} e decidiu ficar no ${c.clube.nome}. A torcida não esqueceu.`);
    registrarMarco(c, "recorde", `Recusou o ${clausula.clube.nome} pra continuar no ${c.clube.nome}.`);
    c.inbox = [noticiaDoMomento(c, "clube", `Você fica no ${c.clube.nome}`, `A recusa à proposta do ${clausula.clube.nome} caiu como um manifesto de lealdade. A torcida te carrega nos braços.`, 3), ...(c.inbox || [])].slice(0, 60);
    setCarreira(c);
    setJanela(null);
    setPosTemporada({ ok: true, ...gerarBloqueios() });
  }
  function decidirCompraDefinitiva(aceitar) {
    const c = { ...carreira };
    const { ofertaCompra } = janela;
    if (aceitar) { logHist(c, `${ofertaCompra.clube.nome} pagou pela compra definitiva do seu passe.`); c.emprestimo = false; c.clubeOrigemEmprestimo = null; }
    else { logHist(c, `Recusou a compra definitiva — retornou ao ${ofertaCompra.origem.nome}.`); c.clube = ofertaCompra.origem; c.emprestimo = false; c.clubeOrigemEmprestimo = null; c.anoNoClube = 0; }
    setCarreira(c); setJanela(null); setPosTemporada({ ok: true, ...gerarBloqueios() });
  }

  function gerarBloqueios() {
    const bloqueiosTreino = {};
    const poolT = [...NUM_ATTRS];
    const nT = rand(0, 3);
    for (let i = 0; i < nT && poolT.length; i++) { const id = poolT.splice(rand(0, poolT.length - 1), 1)[0]; bloqueiosTreino[id] = 40 + rand(0, 60); }
    const acaoIds = ["patrocinio", "eventoTorcida", "social", "recuperacao", "preparador", "imagem", "capitania", "base", "folga", "noitada"];
    const bloqueiosAcao = {};
    const poolA = [...acaoIds];
    const nA = rand(1, 3);
    for (let i = 0; i < nA && poolA.length; i++) { const id = poolA.splice(rand(0, poolA.length - 1), 1)[0]; bloqueiosAcao[id] = 30 + rand(0, 50); }
    return { bloqueiosTreino, bloqueiosAcao };
  }
  function pagarDesbloqueio(c, custo, label) {
    if (!custo) return true;
    if (c.contrato?.estrela) return true; // status de estrela do time: maior tolerância, sem custo de desbloqueio
    if (c.cofre < custo) return false;
    c.cofre -= custo; c.extrato = [...c.extrato, { idade: c.idade, tipo: `Desbloqueio: ${label}`, valor: -custo }];
    return true;
  }
  function abrirDesafioTreino(attrId) {
    const custoDesbloqueio = posTemporada?.bloqueiosTreino?.[attrId];
    if (custoDesbloqueio && carreira.cofre < custoDesbloqueio) return;
    if ((carreira.energia ?? 100) < 15) return;
    // cada atributo treina com o minigame que faz sentido pra ele
    const minigamePorAttr = { finalizacao: "penalti", drible: "falta", passe: "passe" };
    setTreinoDesafio({ attrId, custoDesbloqueio, minigame: minigamePorAttr[attrId] || "timing" });
  }
  function resolverTreino(acerto) {
    const c = { ...carreira };
    const { attrId, custoDesbloqueio } = treinoDesafio;
    if (custoDesbloqueio) { c.cofre -= custoDesbloqueio; c.extrato = [...c.extrato, { idade: c.idade, tipo: `Desbloqueio: ${ATTR_SLOTS.find((s) => s.id === attrId).label}`, valor: -custoDesbloqueio }]; }
    c.energia = clampR((c.energia ?? 100) - 15, 0, 100);
    const ganho = acerto ? rand(2, 4) : rand(0, 1);
    c.attrs = { ...c.attrs, [attrId]: clampR(c.attrs[attrId] + ganho, 40, 99) };
    c.focoTreino = attrId;
    logHist(c, acerto ? `Treino de ${ATTR_SLOTS.find((s) => s.id === attrId).label}: sessão excelente!` : `Treino de ${ATTR_SLOTS.find((s) => s.id === attrId).label}: sessão modesta.`);
    setCarreira(c);
    setTreinoDesafio(null);
    setPosTemporada((p) => { const nb = { ...p?.bloqueiosTreino }; delete nb[attrId]; return { ...p, treinou: true, bloqueiosTreino: nb }; });
  }
  function descansar(tipo) {
    const c = { ...carreira };
    if (tipo === "ferias") { c.energia = clampR((c.energia ?? 100) + 40, 0, c.energiaMax ?? 100); logHist(c, "Tirou férias de fim de semana com a família — recarregou as energias."); }
    if (tipo === "casa") { c.energia = clampR((c.energia ?? 100) + 25, 0, c.energiaMax ?? 100); logHist(c, "Descansou em casa na pré-temporada."); }
    if (tipo === "regenerativo") { c.energia = clampR((c.energia ?? 100) + 15, 0, c.energiaMax ?? 100); c.desgaste = Math.max(0, c.desgaste - 2); logHist(c, "Fez trabalho regenerativo com a fisioterapia."); }
    setCarreira(c);
    setPosTemporada((p) => ({ ...p, descansou: true }));
  }
  function aprenderNovaPosicao(novaPos) {
    const c = { ...carreira };
    const jaSabe = (c.posicoesAprendidas || [c.posicao]).includes(novaPos);
    if (!jaSabe) {
      c.posicoesAprendidas = [...(c.posicoesAprendidas || [c.posicao]), novaPos];
      c.energia = clampR((c.energia ?? 100) - 25, 0, 100);
      logHist(c, `Aprendeu a jogar como ${POSICOES.find((p) => p.id === novaPos).label} — fica registrado pro resto da carreira.`);
    }
    c.posicao = novaPos;
    setCarreira(c);
    setPosTemporada((p) => ({ ...p, posicaoMudada: true }));
  }
  function jogarComoPosicao(pos) {
    const c = { ...carreira };
    c.posicao = pos;
    logHist(c, `Escalado como ${POSICOES.find((p) => p.id === pos).label} nessa temporada.`);
    setCarreira(c);
  }
  function treinoExtra(tipo) {
    const c = { ...carreira };
    if (tipo === "tatico") { setTorcidaClube(c, c.clube.nome, 3); c.fama = clamp(c.fama + 1, 0, 100); c.treinoTaticoFeito = true; logHist(c, "Treino tático — mais entrosado com o time."); }
    if (tipo === "mental") { c.forma = clamp(c.forma + 1, -4, 4); c.desgaste = Math.max(0, c.desgaste - 1); logHist(c, "Preparação mental — chegou mais leve pra temporada."); }
    if (tipo === "bolaParada") { c.especialistaBP = true; logHist(c, "Treino de bolas paradas — vai se sair melhor em cobranças decisivas."); }
    setCarreira(c);
    setPosTemporada((p) => ({ ...p, extraTreinoFeito: true }));
  }
  function treinoPesado() {
    const c = { ...carreira };
    c.treinouPesado = true;
    if (!c.focoTreino) c.focoTreino = "fisico";
    logHist(c, `Treino pesado focado em ${ATTR_SLOTS.find((s) => s.id === c.focoTreino).label}.`);
    setCarreira(c);
    setPosTemporada((p) => ({ ...p, treinou: true }));
  }
  function confirmarTrocaNumero(n) {
    const c = { ...carreira };
    c.camisaPorClube = { ...c.camisaPorClube, [c.clube.nome]: [...new Set([...(c.camisaPorClube?.[c.clube.nome] || []), n])] };
    const texto = `A diretoria aprovou: você passa a vestir a camisa ${n} no ${c.clube.nome}.`;
    logHist(c, texto); setCarreira(c);
    setPosTemporada((p) => ({ ...p, numeroFeito: true }));
    setPendingTrocaNumero(null);
    setResultadoAcao({ titulo: "Troca de número aprovada", texto, icone: "👕" });
  }
  function acaoComDesbloqueio(tipo, custo) {
    const c = { ...carreira };
    if (!pagarDesbloqueio(c, custo, tipo)) return;
    if (tipo === "noitada") {
      c.noitadasTemporada = (c.noitadasTemporada || 0) + 1;
      const excesso = c.noitadasTemporada > 1;
      const dFama = rand(3, 6), dEnergia = rand(8, 15), dTecnico = -(excesso ? rand(8, 14) : rand(2, 5));
      c.fama = clamp(c.fama + dFama, 0, 100);
      c.energia = clampR((c.energia ?? 100) + dEnergia, 0, c.energiaMax ?? 100);
      c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + dTecnico, 0, 100);
      const texto = excesso
        ? "Mais uma noitada — a diretoria já comentou, e o técnico não escondeu a insatisfação com o excesso de badalação."
        : "Uma night bem curtida — a fama sobe e a energia melhora, mas o técnico ficou de olho.";
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.noitada; return { ...p, noitadaFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Vida boêmia", texto, icone: "🎉", deltas: [{ label: "Fama", valor: dFama }, { label: "Energia", valor: dEnergia }, { label: "Confiança do técnico", valor: dTecnico }] });
      return;
    }
    if (tipo === "patrocinio") {
      const persona = PERSONALIDADES.find((x) => x.id === c.personalidade) || PERSONALIDADES[3];
      const disponiveis = patrocinadoresDisponiveis(c);
      const marca = pick(disponiveis.length ? disponiveis : OFERTAS_PATROCINIO.filter((p) => p.perfil === "neutro"));
      const valor = Math.round(c.fama * (persona?.famaMult || 1) * rand(8, 14) * (marca.valorMult || 1) * (c.staff?.consultorImagem ? 1.25 : 1));
      c.cofre += valor; c.extrato = [...c.extrato, { idade: c.idade, tipo: `Patrocínio (${marca.marca})`, valor }];
      c.fama = clamp(c.fama + 3, 0, 100);
      if (marca.bonusTorcida) setTorcidaClube(c, c.clube.nome, marca.bonusTorcida);
      const texto = `A ${marca.marca} topou um contrato de patrocínio: +$${formatarDinheiro(valor)} na conta.${marca.perfil === "luxo" ? " Marca de luxo — seu padrão de vida abriu essa porta." : marca.perfil === "familia" ? " Marca familiar — sua imagem limpa pesou na escolha." : ""}`;
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.patrocinio; return { ...p, patrocinioFeito: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Patrocínio fechado", texto, icone: "💼" }); return;
    }
    if (tipo === "eventoTorcida") {
      const ganho = rand(2, 5);
      setTorcidaClube(c, c.clube.nome, ganho); c.fama = clamp(c.fama + 2, 0, 100);
      const texto = `Você apareceu num evento com a torcida do ${c.clube.nome} — o carinho cresce aos poucos (+${ganho} na relação).`;
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.eventoTorcida; return { ...p, torcidaFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Evento com a torcida", texto, icone: "🎉" }); return;
    }
    if (tipo === "social") {
      const ganho = rand(2, 4);
      setTorcidaClube(c, c.clube.nome, ganho); c.fama = clamp(c.fama + 4, 0, 100); c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + 4, 0, 100);
      const texto = `A ação social ligada ao ${c.clube.nome} rendeu boa repercussão — melhora inclusive sua imagem junto à diretoria pra futuras renovações.`;
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.social; return { ...p, torcidaFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Ação social pelo clube", texto, icone: "❤️" }); return;
    }
    if (tipo === "recuperacao") {
      c.desgaste = Math.max(0, c.desgaste - 2); c.energia = clampR((c.energia ?? 100) + 30, 0, 100);
      const texto = "Sessão de recuperação física bem aproveitada — energia recarregada pra temporada.";
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.recuperacao; return { ...p, recuperou: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Recuperação física", texto, icone: "🧊" }); return;
    }
    if (tipo === "preparador") {
      c.staff = { ...c.staff, preparadorSazonal: true };
      const texto = "Contratou um preparador físico particular pra temporada — o desgaste vai acumular bem mais devagar.";
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.preparador; return { ...p, preparadorFeito: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Preparador físico particular", texto, icone: "🩺" }); return;
    }
    if (tipo === "imagem") {
      c.fama = clamp(c.fama + 8, 0, 100); c.staff = { ...c.staff, imagemInvestida: true };
      const texto = "Investiu em imagem pessoal — sua fama sobe e patrocinadores passam a te procurar mais, além de atrair mais seguidores.";
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.imagem; return { ...p, imagemFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Investimento em imagem pessoal", texto, icone: "📸" }); return;
    }
    if (tipo === "capitania") {
      const chance = clamp(((c.tecnicoConfianca ?? 60) + getTorcida(c, c.clube.nome)) / 180, 0.1, 0.9);
      const conseguiu = Math.random() < chance;
      let texto;
      if (conseguiu) { c.capitao = true; setTorcidaClube(c, c.clube.nome, 5); c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 5, 0, 100); texto = "O técnico e o elenco concordaram — você é o novo capitão!"; }
      else texto = "O técnico agradeceu o interesse, mas preferiu manter a braçadeira como está por enquanto.";
      logHist(c, `Pedido de capitania: ${texto}`); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.capitania; return { ...p, capitaniaFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Pedido da braçadeira", texto, icone: conseguiu ? "🎖️" : "😕" }); return;
    }
    if (tipo === "numero") {
      setAcoesPopupAberto(false);
      setPendingTrocaNumero({ bloqueados: gerarBloqueadosNumero() });
      return;
    }
    if (tipo === "diretoria") {
      setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.diretoria; return { ...p, diretoriaFeita: true, bloqueiosAcao: nb }; });
      setAcoesPopupAberto(false);
      setJanela({ tipo: "reuniaoDiretoria" });
      return;
    }
    if (tipo === "base") {
      const chance = clamp((calcOVR(c.attrs, c.posicao)) / 130, 0.4, 0.85);
      const conseguiu = Math.random() < chance;
      const acoesBase = ["ensinou um drible novo pra um garoto da base", "treinou cobranças de falta com um volante da base", "deu uma aula de posicionamento pros zagueiros juniores", "trocou ideia sobre finalização com os atacantes da base"];
      let texto;
      if (conseguiu) { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + rand(4, 8), 0, 100); c.fama = clamp(c.fama + 2, 0, 100); texto = `Você ${pick(acoesBase)} — a diretoria elogiou o gesto e sua relação com o clube melhora.`; }
      else texto = `Você passou a tarde treinando com a base, mas o clima estava corrido e passou meio despercebido.`;
      logHist(c, `Trabalho com a base: ${texto}`); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.base; return { ...p, baseFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Trabalho com a base", texto, icone: conseguiu ? "🌱" : "🌤️" }); return;
    }
    if (tipo === "folga") {
      c.energia = clampR((c.energia ?? 100) + 35, 0, 100);
      c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) - 6, 0, 100);
      setTorcidaClube(c, c.clube.nome, -3);
      c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 4, 0, 100);
      const texto = "Aproveitou o tempo com a família e voltou com a energia renovada — mas o técnico, a torcida e a diretoria notaram a ausência.";
      logHist(c, texto); setCarreira(c);
      setPosTemporada((p) => { const nb = { ...p.bloqueiosAcao }; delete nb.folga; return { ...p, folgaFeita: true, bloqueiosAcao: nb }; });
      setResultadoAcao({ titulo: "Folga para a família", texto, icone: "🏖️" }); return;
    }
    if (tipo === "contrato") {
      setAcoesPopupAberto(false);
      setNegociacaoContratoAtual(c.contrato || { anos: 2, salario: salarioClube(c.clube, calcOVR(c.attrs, c.posicao)), multa: salarioClube(c.clube, calcOVR(c.attrs, c.posicao)) * 4, bonusGol: 2 });
      return;
    }
  }
  function ajustarNegociacaoAtual(campo, delta) {
    setNegociacaoContratoAtual((n) => {
      if (campo === "salario") return { ...n, salario: Math.max(10, Math.round(n.salario * (1 + delta * 0.1))) };
      if (campo === "bonusGol") return { ...n, bonusGol: Math.max(0, n.bonusGol + delta) };
      if (campo === "anos") return { ...n, anos: clampR(n.anos + delta, 1, 6) };
      if (campo === "multa") return { ...n, multa: Math.max(Math.round(n.salario * 1.5), n.multa + Math.round(n.salario * delta * 0.5)) };
      if (campo === "estrela") return { ...n, estrela: !n.estrela };
      return n;
    });
  }
  function confirmarNegociacaoAtual() {
    const c = { ...carreira };
    const n = negociacaoContratoAtual;
    // quanto mais você pede, menor a chance da diretoria topar de primeira
    const pedeMuito = n.salario > salarioClube(c.clube, calcOVR(c.attrs, c.posicao)) * 1.3;
    const multaBaixaDemais = n.multa < salarioClube(c.clube, calcOVR(c.attrs, c.posicao)) * 3;
    let chance = clamp(((c.relacaoDiretoria ?? 40) + (c.tecnicoConfianca ?? 60)) / 200 - (pedeMuito ? 0.25 : 0) - (multaBaixaDemais ? 0.15 : 0) - (n.estrela ? 0.2 : 0), 0.1, 0.9);
    const aceitou = Math.random() < chance;
    let texto;
    if (aceitou) {
      c.contrato = { ...n, restantes: n.anos };
      texto = `A diretoria aceitou: ${n.anos} anos, $${formatarDinheiro(n.salario)}/ano, bônus de $${formatarDinheiro(n.bonusGol)}/gol, multa de $${formatarDinheiro(n.multa)}${n.estrela ? ", com status de estrela do time" : ""}.`;
    }
    else { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 5, 0, 100); texto = "A diretoria achou o pedido exagerado e recusou a renegociação por enquanto."; }
    logHist(c, `Negociação de contrato: ${texto}`);
    setCarreira(c);
    setNegociacaoContratoAtual(null);
    setPosTemporada((p) => ({ ...p, contratoNegociado: true }));
    setResultadoAcao({ titulo: "Negociação de contrato", texto, icone: aceitou ? "✍️" : "📄" });
  }
  function pedirAumentoSalarial() {
    const c = { ...carreira };
    setContratoMenuAberto(false);
    if (!c.contrato) { setResultadoAcao({ titulo: "Pedido de aumento", texto: "Você ainda não tem um contrato formal pra pedir aumento — negocie uma renovação primeiro.", icone: "📄" }); return; }
    const chance = clamp(((c.relacaoDiretoria ?? 40) + (c.tecnicoConfianca ?? 60)) / 220, 0.12, 0.85);
    const aceitou = Math.random() < chance;
    let texto;
    if (aceitou) {
      const aumento = rand(10, 22);
      c.contrato = { ...c.contrato, salario: Math.round(c.contrato.salario * (1 + aumento / 100)) };
      texto = `A diretoria topa o pedido — salário reajustado em ${aumento}%, agora $${formatarDinheiro(c.contrato.salario)}/ano.`;
    } else {
      c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 4, 0, 100);
      texto = "A diretoria recusou o pedido de aumento por enquanto — melhor tentar de novo depois de uma boa temporada.";
    }
    logHist(c, `Pedido de aumento salarial: ${texto}`);
    setCarreira(c);
    setResultadoAcao({ titulo: "Pedido de aumento salarial", texto, icone: aceitou ? "💰" : "📄" });
  }
  function negociarBonusRapido() {
    const c = { ...carreira };
    setContratoMenuAberto(false);
    if (!c.contrato) { setResultadoAcao({ titulo: "Bônus por desempenho", texto: "Você precisa de um contrato ativo pra negociar bônus.", icone: "📄" }); return; }
    const chance = clamp(((c.relacaoDiretoria ?? 40) + (c.tecnicoConfianca ?? 60)) / 200, 0.15, 0.85);
    const aceitou = Math.random() < chance;
    let texto;
    if (aceitou) {
      const extra = rand(1, 3);
      c.contrato = { ...c.contrato, bonusGol: (c.contrato.bonusGol || 0) + extra };
      texto = `Bônus por desempenho ampliado — agora $${formatarDinheiro(c.contrato.bonusGol)} por gol marcado.`;
    } else {
      c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 3, 0, 100);
      texto = "A diretoria não topou aumentar o bônus por gol dessa vez.";
    }
    logHist(c, `Negociação de bônus: ${texto}`);
    setCarreira(c);
    setResultadoAcao({ titulo: "Bônus por desempenho", texto, icone: aceitou ? "🎁" : "📄" });
  }
  function pedirClausulaEstabilidade() {
    const c = { ...carreira };
    setContratoMenuAberto(false);
    if (!c.contrato) { setResultadoAcao({ titulo: "Cláusula de estabilidade", texto: "Você precisa de um contrato ativo pra pedir essa cláusula.", icone: "📄" }); return; }
    if (c.contrato.clausulaEstabilidade) { setResultadoAcao({ titulo: "Cláusula de estabilidade", texto: "Você já tem essa cláusula no contrato atual.", icone: "🛡️" }); return; }
    const chance = clamp((c.relacaoDiretoria ?? 40) / 110, 0.15, 0.75);
    const aceitou = Math.random() < chance;
    let texto;
    if (aceitou) { c.contrato = { ...c.contrato, clausulaEstabilidade: true }; texto = "A diretoria aceitou incluir uma cláusula de estabilidade — quedas de rendimento agora pesam menos na confiança do técnico."; }
    else { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 3, 0, 100); texto = "A diretoria achou a exigência exagerada e recusou a cláusula de estabilidade."; }
    logHist(c, `Cláusula de estabilidade: ${texto}`);
    setCarreira(c);
    setResultadoAcao({ titulo: "Cláusula de estabilidade", texto, icone: aceitou ? "🛡️" : "📄" });
  }
  function rescindirContrato() {
    const c = { ...carreira };
    setContratoMenuAberto(false);
    if (!c.contrato) { setResultadoAcao({ titulo: "Rescisão de contrato", texto: "Você não tem um contrato ativo pra rescindir.", icone: "📄" }); return; }
    const multa = c.contrato.multa;
    if (c.cofre < multa) { setResultadoAcao({ titulo: "Rescisão de contrato", texto: `Você precisaria pagar $${formatarDinheiro(multa)} de multa rescisória, mas não tem esse valor no cofre.`, icone: "📄" }); return; }
    c.cofre -= multa;
    c.extrato = [...c.extrato, { idade: c.idade, tipo: "Multa rescisória", valor: -multa }];
    c.contrato = null;
    setTorcidaClube(c, c.clube.nome, -20);
    logHist(c, `Rescindiu o contrato com o ${c.clube.nome} pagando $${formatarDinheiro(multa)} de multa — virou agente livre.`);
    const alvos = CLUBES.filter((x) => x.nome !== c.clube.nome && x.forca <= c.clube.forca + 4 && x.liga !== "arabia" && x.liga !== "mls");
    const escolhidos = []; const pool = [...alvos];
    while (escolhidos.length < 3 && pool.length) escolhidos.push(pool.splice(rand(0, pool.length - 1), 1)[0]);
    setCarreira(c);
    setJanela({ tipo: "rescisao", opcoes: escolhidos.map((cl) => ({ clube: cl, tipo: "transfer" })) });
  }
  const LIMITE_ACOES_TECNICO = 2;
  /* Conversa sobre estar no banco — o técnico dá um motivo REAL (derivado do estado do jogo)
     e cada resposta abre um caminho diferente. Não consome ação de temporada. */
  function motivoDoBanco(c) {
    const ovr = calcOVR(c.attrs, c.posicao, c.papelTatico);
    const conc = c.concorrente;
    if ((c.energia ?? 100) < 55 || (c.desgaste || 0) > 2) return { id: "fisico", txt: "Sinceramente? Você chegou desgastado. Não vou te queimar num momento em que seu corpo pede descanso." };
    if ((c.tecnicoConfianca ?? 60) < 40) return { id: "disciplina", txt: "Não é técnico, é postura. Você e eu não estamos falando a mesma língua, e isso pesa na hora de escalar." };
    if (conc && (conc.forca ?? 0) >= ovr) return { id: "concorrencia", txt: `Não é contra você. Hoje o ${conc.nome} está rendendo mais na sua posição — a vaga se ganha no treino.` };
    if ((c.entrosamento ?? 20) < 40) return { id: "entrosamento", txt: "Você ainda está entrando no jeito do time. Preciso de gente encaixada no esquema pra rodar o que treinamos." };
    return { id: "tatico", txt: "É escolha tática. O jogo que quero jogar pede outro perfil na sua posição neste momento." };
  }
  function abrirConversaBanco() {
    setTecnicoMenuAberto(false);
    setConversaBanco({ motivo: motivoDoBanco(carreira), resposta: null });
  }
  function responderBanco(opcao) {
    const c = { ...carreira };
    const motivo = conversaBanco.motivo;
    let texto, dConf = 0, extra = "";
    if (opcao === "aceitar") {
      dConf = rand(5, 9);
      c.entrosamento = clampR((c.entrosamento ?? 20) + 8, 0, 100);
      texto = "Você aceitou a explicação e disse que vai brigar pela vaga no treino. O técnico respeitou a atitude.";
    } else if (opcao === "cobrar") {
      const temRespaldo = !!c.promessaQuebradaPeloTecnico || (c.tecnicoConfianca ?? 60) >= 70;
      dConf = temRespaldo ? rand(-2, 3) : -rand(7, 13);
      c.titularidade = clampR((c.titularidade ?? 100) + (temRespaldo ? 12 : -5), 0, 100);
      texto = temRespaldo
        ? "Você cobrou o que foi prometido — e dessa vez o técnico não teve como desconversar. Sua vaga ganhou força."
        : "Você bateu de frente sem respaldo. O técnico ouviu calado, mas anotou.";
      if (temRespaldo) { c.promessaQuebradaPeloTecnico = false; extra = " (respaldo usado)"; }
    } else if (opcao === "treinar") {
      dConf = rand(3, 6);
      c.energia = clampR((c.energia ?? 100) - 8, 0, 100);
      c.attrs = { ...c.attrs };
      const alvo = motivo.id === "fisico" ? "fisico" : motivo.id === "concorrencia" ? "velocidade" : "passe";
      c.attrs[alvo] = clamp(c.attrs[alvo] + 1, 1, 99);
      texto = `Você pediu trabalho extra pra resolver o ponto levantado. Custou energia, mas rendeu +1 de ${alvo}.`;
    } else if (opcao === "posicao") {
      const outras = POSICOES.filter((p) => p.id !== c.posicao && !(c.posicoesAprendidas || []).includes(p.id));
      if (outras.length) {
        const nova = pick(outras);
        c.posicoesAprendidas = [...(c.posicoesAprendidas || []), nova.id];
        dConf = rand(4, 8);
        texto = `O técnico topou te testar como ${nova.label}. Nova posição aprendida — mais caminhos pra entrar no time.`;
      } else { dConf = 2; texto = "Vocês conversaram sobre função, mas você já domina as posições que o time precisa."; }
    }
    c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + dConf, 0, 100);
    logHist(c, texto);
    setCarreira(c);
    setConversaBanco(null);
    setResultadoAcao({ titulo: "Conversa com o técnico", texto: texto + extra, icone: "🗣️", deltas: [{ label: "Confiança do técnico", valor: Math.round(dConf) }] });
  }
  function acaoTecnico(tipo) {
    const c = { ...carreira };
    if ((c.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO) return;
    c.tecnicoAcoesTemporada = (c.tecnicoAcoesTemporada || 0) + 1;
    let texto, dConfianca = 0, icone = "🧑‍💼";
    if (tipo === "conversar") {
      dConfianca = rand(3, 7);
      texto = "Uma conversa em particular alinhou expectativas — o técnico valorizou a postura.";
      icone = "🗣️";
    } else if (tipo === "elogiar") {
      dConfianca = rand(2, 5);
      c.fama = clamp(c.fama + 2, 0, 100);
      c.calorMidia = clampR((c.calorMidia ?? 20) + 4, 0, 100);
      texto = "Elogiou o trabalho do técnico na imprensa — a comissão técnica notou o gesto público.";
      icone = "👏";
    } else if (tipo === "esquema") {
      dConfianca = rand(5, 9);
      c.papelTatico = "padrao";
      texto = "Aceitou seguir à risca o esquema tático pedido pelo técnico, sem resistência.";
      icone = "📋";
    } else if (tipo === "cobrar") {
      dConfianca = -rand(6, 12);
      setTorcidaClube(c, c.clube.nome, rand(3, 6));
      texto = "Cobrou mudanças publicamente — a torcida gostou do gesto, mas o técnico não escondeu o incômodo.";
      icone = "📢";
    } else if (tipo === "trocarPapel") {
      const outros = PAPEIS_TATICOS.filter((p) => p.id !== (c.papelTatico || "padrao"));
      c.papelTatico = pick(outros).id;
      dConfianca = -rand(4, 9);
      texto = "Insistiu em jogar num esquema diferente do que o técnico pediu — a relação esfria um pouco.";
      icone = "🔄";
    } else if (tipo === "reclamar") {
      dConfianca = -rand(8, 15);
      c.fama = clamp(c.fama + 3, 0, 100);
      texto = "Reclamou abertamente da escalação — repercutiu nas redes, mas o técnico ficou de queixo caído.";
      icone = "😤";
    }
    c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + dConfianca, 0, 100);
    logHist(c, `${texto}`);
    setCarreira(c);
    setTecnicoMenuAberto(false);
    setResultadoAcao({ titulo: "Relação com o técnico", texto, icone, deltas: [{ label: "Confiança do técnico", valor: Math.round(dConfianca) }] });
  }
  function pedirDiretoria(opt) {
    const c = { ...carreira };
    const chance = clamp((c.relacaoDiretoria ?? 40) / 100, 0.15, 0.85);
    const aceitou = Math.random() < chance;
    let texto;
    if (aceitou) { opt.efeito(c); texto = `A diretoria aceitou: ${opt.label}.`; c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + 3, 0, 100); }
    else { texto = `A diretoria negou o pedido: ${opt.label}.`; c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 2, 0, 100); }
    logHist(c, `Reunião com a diretoria: ${texto}`);
    setCarreira(c);
    setJanela(null);
    setResultadoAcao({ titulo: "Reunião com a diretoria", texto, icone: aceitou ? "🏛️" : "📋" });
  }
  function contratarEmpresario(emp) {
    const c = { ...carreira };
    if (c.cofre < emp.custo) return;
    c.cofre -= emp.custo;
    if (emp.custo > 0) c.extrato = [...c.extrato, { idade: c.idade, tipo: `Contratou ${emp.nome}`, valor: -emp.custo }];
    c.empresario = { id: emp.id, restantes: emp.temporadas };
    logHist(c, `Assinou com ${emp.nome} — ${emp.resumo}.`);
    setCarreira(c);
    setEmpresarioMenuAberto(false);
    setResultadoAcao({ titulo: "Novo empresário", texto: `${emp.nome} agora cuida da sua carreira. ${emp.desc}`, icone: emp.icone });
  }
  function dispensarEmpresario() {
    const c = { ...carreira };
    const emp = empresarioPorId(c.empresario?.id);
    c.empresario = null;
    logHist(c, `Rompeu com ${emp.nome}.`);
    setCarreira(c);
    setEmpresarioMenuAberto(false);
  }
  // Carimba a notícia com o clube e a idade do momento — assim ela não "muda de time" depois
  function noticiaDoMomento(c, tipo, titulo, corpo, prioridade = 1) {
    return { ...noticia(tipo, titulo, corpo, prioridade), idade: c.idade, temporada: temporadaLabel(c.idade, ANO_INICIO), clube: c.clube?.nome, clubeObj: c.clube };
  }
  // ao abrir o jogo, descobre se existe carreira salva (pra mostrar "Continuar")
  useEffect(() => { setTemSave(existeAlgumSave()); }, []);

  /* ===================== SALVAR E CARREGAR ===================== */
  function estadoAtualParaSave() {
    return montarSave({
      stage, nome, posicao, nacionalidade, personalidade, pernaDominante, clubeCoracao,
      potencial, origemId: origem?.id || carreira?.origem || null,
      carreira, temporadas, mundo, fim, aba, modoSimulacao,
    });
  }
  function salvarJogo(slot) {
    if (!carreira && !fim) { setAvisoSave({ erro: true, txt: "Não há carreira pra salvar ainda." }); return; }
    const r = salvarLocal(slot, estadoAtualParaSave());
    setTemSave(existeAlgumSave());
    setAvisoSave(r.ok
      ? { erro: false, txt: slot === "auto" ? "Progresso salvo automaticamente." : `Carreira salva no espaço ${slot}.` }
      : { erro: true, txt: r.erro });
    setTimeout(() => setAvisoSave(null), 3500);
  }
  /* Repõe o jogo a partir de um save. Todo estado de interface é zerado de propósito:
     ninguém quer voltar com um popup pela metade aberto. */
  function aplicarSave(saveBruto) {
    if (!saveBruto) return;
    const save = normalizarSave(saveBruto); // completa campos que faltarem
    setNome(save.nome || "");
    setPosicao(save.posicao || null);
    setNacionalidade(save.nacionalidade || "BRA");
    setPersonalidade(save.personalidade || null);
    setPernaDominante(save.pernaDominante || "destro");
    setClubeCoracao(save.clubeCoracao || null);
    setPotencial(save.potencial || {});
    setOrigem(save.origemId ? ORIGENS.find((o) => o.id === save.origemId) || null : null);
    setCarreira(save.carreira || null);
    setTemporadas(save.temporadas || []);
    setMundo(save.mundo || null);
    setFim(save.fim || null);
    setAba(save.aba || "carreira");
    setModoSimulacao(save.modoSimulacao || "completa");
    // zera tudo que é transitório
    setDecisao(null); setDecisaoResultado(null); setJanela(null); setPosTemporada(null);
    setAwardsPopup(null); setPendingTierUpgrade(null); setPendingSponsor(null);
    setPendingAbordagem(false); setPendingColetiva(false); setPendingTecnico(null);
    setPendingExpectativa(null); setPendingLegendFollow(null); setPendingCompeticao(null);
    setPendingLanceJogo(null); setResultadoAcao(null); setPopupTemporada(null);
    setSavesAberto(false);
    setStage(save.fim ? "fim" : save.carreira ? "carreira" : "intro");
    setAvisoSave({ erro: false, txt: "Carreira carregada." });
    setTimeout(() => setAvisoSave(null), 3000);
  }
  function carregarJogo(slot) {
    const save = carregarLocal(slot);
    if (!save) { setAvisoSave({ erro: true, txt: "Esse espaço está vazio." }); return; }
    aplicarSave(save);
  }
  async function importarSaveDeArquivo(file) {
    try {
      const save = await lerArquivoSave(file);
      aplicarSave(save);
    } catch (e) {
      setAvisoSave({ erro: true, txt: e.message });
      setTimeout(() => setAvisoSave(null), 4000);
    }
  }
  function responderTorcedor(r) {
    const c = { ...carreira };
    const e = r.efeito || {};
    if (e.fama) c.fama = clamp(c.fama + e.fama, 0, 100);
    if (e.calorMidia) c.calorMidia = clampR((c.calorMidia ?? 20) + e.calorMidia, 0, 100);
    if (e.elenco) c.elencoMoral = clampR((c.elencoMoral ?? 60) + e.elenco, 0, 100);
    if (e.torcida) setTorcidaClube(c, c.clube.nome, e.torcida);
    if (e.seguidores) c.seguidores = Math.round((c.seguidores || 10000) * (1 + e.seguidores / 100));
    c.respostasFas = [...(c.respostasFas || []), respostaFa.id];
    const virouNoticia = Math.abs(e.calorMidia || 0) >= 12;
    logHist(c, `Respondeu ${respostaFa.autor}: "${r.texto}"`);
    if (virouNoticia) {
      c.inbox = [noticiaDoMomento(c, "critica", `Resposta de ${nome} a torcedor repercute`, `"${r.texto}" — a frase viralizou e dividiu opiniões nas redes.`, 2), ...(c.inbox || [])].slice(0, 60);
    }
    setCarreira(c);
    setRespostaFa(null);
    setResultadoAcao({
      titulo: virouNoticia ? "📰 Sua resposta virou notícia" : "💬 Você respondeu",
      texto: `"${r.texto}"${virouNoticia ? " — e a internet não perdoou: o assunto virou manchete." : ""}`,
      icone: r.icone,
      deltas: Object.entries(e).filter(([, v]) => v).map(([k, v]) => ({ label: { fama: "Fama", torcida: "Torcida", calorMidia: "Pressão da mídia", elenco: "Moral do elenco", seguidores: "Seguidores (%)" }[k] || k, valor: v })),
    });
  }
  function abrirTransferencias(tipo) {
    const c = { ...carreira };
    // ---- TRAVA DE EMPRÉSTIMO ----
    // Quem está emprestado não pertence ao clube onde joga: não pode negociar com ninguém.
    // A situação só se resolve quando o empréstimo acaba ou vira compra definitiva.
    if (c.emprestimo && tipo !== "empresario") {
      setResultadoAcao({
        titulo: "Você está emprestado",
        texto: `Seu contrato ainda é com o ${c.clubeOrigemEmprestimo?.nome || "clube de origem"}. Enquanto o empréstimo estiver em vigor, nenhuma negociação pode ser feita — nem por você, nem pelo seu empresário. Resta esperar o fim do vínculo ou o ${c.clube.nome} exercer a compra definitiva.`,
        icone: "🔒",
      });
      setPosTemporada(null);
      return;
    }
    if (tipo === "empresario") { setJanela({ tipo: "empresario" }); setPosTemporada(null); return; }
    if (tipo === "normal") { c.empresarioUsado = { ...c.empresarioUsado, normal: true }; setCarreira(c); setJanela({ tipo: "ligas", ligasSelecionadas: [] }); setPosTemporada(null); return; }
    if (tipo === "emprestimo") { c.empresarioUsado = { ...c.empresarioUsado, emprestimo: true }; setCarreira(c); setJanela({ tipo: "duracaoEmprestimo" }); setPosTemporada(null); return; }
    const ovr = calcOVR(c.attrs, c.posicao);
    let opcoes = [];
    if (tipo === "sair") {
      c.empresarioUsado = { ...c.empresarioUsado, sair: true };
      setTorcidaClube(c, c.clube.nome, -18);
      logHist(c, `Pediu para sair do ${c.clube.nome} — a torcida não gostou.`);
      const alvos = CLUBES.filter((x) => x.nome !== c.clube.nome && x.forca <= c.clube.forca + 2 && x.liga !== "arabia" && x.liga !== "mls");
      const escolhidos = []; const pool = [...alvos];
      while (escolhidos.length < 3 && pool.length) escolhidos.push(pool.splice(rand(0, pool.length - 1), 1)[0]);
      opcoes = escolhidos.map((cl) => ({ clube: cl, tipo: "transfer" }));
      setCarreira(c);
    } else if (tipo === "coracao" && c.clubeCoracao && c.idade >= 29) {
      const cc = CLUBES.find((x) => x.nome === c.clubeCoracao.nome);
      if (cc) opcoes = [{ clube: cc, tipo: "transfer" }];
    } else if (tipo === "tentadora") {
      const ricas = CLUBES.filter((x) => (x.liga === "arabia" || LIGAS[x.liga].mult >= 0.95) && x.nome !== c.clube.nome);
      const alvo = pick(ricas);
      opcoes = [{ clube: alvo, tipo: "transfer", tentadora: true, salarioMult: alvo.liga === "arabia" ? 4 : 2 }];
    }
    setJanela({ tipo, opcoes });
    setPosTemporada(null);
  }
  function toggleLigaSelecionada(key) {
    setJanela((j) => ({ ...j, ligasSelecionadas: j.ligasSelecionadas.includes(key) ? j.ligasSelecionadas.filter((x) => x !== key) : [...j.ligasSelecionadas, key] }));
  }
  function confirmarBuscaLigas() {
    const c = carreira;
    if (c.emprestimo) { setJanela(null); setResultadoAcao({ titulo: "Você está emprestado", texto: "Nenhum clube pode negociar com você enquanto o empréstimo estiver em vigor.", icone: "🔒" }); return; }
    const emp = c.empresario ? empresarioPorId(c.empresario.id) : EMPRESARIOS[0];
    const ultima = temporadas.length ? temporadas[temporadas.length - 1] : null;
    const ligasAlvo = janela.ligasSelecionadas.length ? janela.ligasSelecionadas : Object.keys(LIGAS);
    const cands = CLUBES
      .filter((x) => x.nome !== c.clube.nome && ligasAlvo.includes(x.liga))
      .map((clube) => ({ clube, score: scoreInteresseClube(c, clube, ultima, emp) }));
    let escolhidos = sortearPorInteresse(cands, emp.nOfertas ?? 3);
    // rede de segurança: se ninguém se interessou, aparecem opções modestas
    if (!escolhidos.length) {
      const modestos = CLUBES.filter((x) => x.nome !== c.clube.nome && ligasAlvo.includes(x.liga) && x.forca <= calcOVR(c.attrs, c.posicao))
        .map((clube) => ({ clube, score: 1 }));
      escolhidos = sortearPorInteresse(modestos, 2);
    }
    setJanela({
      tipo: "mercado",
      semInteresse: escolhidos.length === 0,
      opcoes: escolhidos.map((e) => ({ clube: e.clube, tipo: "transfer", interesse: e.score })),
    });
  }
  function escolherDuracaoEmprestimo(anos) {
    const c = carreira, ovr = calcOVR(c.attrs, c.posicao);
    const cands = CLUBES.filter((x) => x.nome !== c.clube.nome && Math.abs(x.forca - (ovr - 3)) <= 8 && x.liga !== "arabia" && x.liga !== "mls");
    const escolhidos = []; const pool = [...cands];
    while (escolhidos.length < 3 && pool.length) escolhidos.push(pool.splice(rand(0, pool.length - 1), 1)[0]);
    setJanela({ tipo: "emprestimo", opcoes: escolhidos.map((cl) => ({ clube: cl, tipo: "emprestimo", duracao: anos })) });
  }

  const ovrAtual = carreira ? calcOVR(carreira.attrs, carreira.posicao) : null;
  const ultima = temporadas[temporadas.length - 1];
  const posLigaAtual = carreira ? (ultima ? ultima.posLiga : Math.max(1, Math.round(CLUBES.filter((x) => x.liga === carreira.clube.liga).length / 2))) : 1;
  const tabelaLiga = useMemo(() => (carreira ? gerarTabelaLiga(carreira.clube, posLigaAtual) : []), [carreira?.clube?.nome, posLigaAtual, temporadas.length]);
  const tTorc = carreira ? tierTorcida(getTorcida(carreira, carreira.clube.nome)) : null;

  return (
    <div className="min-h-screen text-zinc-100 font-sans relative" style={{ background: "#0a0b0d" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 15% 0%, rgba(255,255,255,0.16) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 0%, rgba(255,255,255,0.16) 0%, transparent 60%),
          repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 26px),
          radial-gradient(ellipse 90% 50% at 50% 115%, rgba(20,255,150,0.10) 0%, transparent 60%),
          linear-gradient(180deg, #0d0f11 0%, #0a0b0d 55%, #08090a 100%)
        `,
      }} />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70" style={{ background: "radial-gradient(ellipse at top, rgba(20,255,150,0.08) 0%, transparent 45%), radial-gradient(ellipse at bottom right, rgba(34,211,238,0.08) 0%, transparent 55%)" }} />
      <style>{`
        /* ===== LAYOUT RESPONSIVO (CSS próprio, sem depender do build do Tailwind) ===== */
        .app-shell{width:100%;max-width:42rem;margin-left:auto;margin-right:auto;padding:2rem 1rem;}
        .stack{display:grid;gap:1rem;}
        .tab-grid{display:grid;gap:1rem;align-items:start;}
        .tab-grid-3{display:grid;gap:0.75rem;align-items:start;}
        .row-2,.row-3{display:grid;gap:0.75rem;align-items:start;}
        .span-full{grid-column:1/-1;}
        @media(min-width:640px){ .app-shell{padding-left:1.5rem;padding-right:1.5rem;} }
        @media(min-width:1024px){
          .app-shell{max-width:64rem;}
          .tab-grid,.tab-grid-3{grid-template-columns:repeat(2,minmax(0,1fr));}
          .row-2{grid-template-columns:repeat(2,minmax(0,1fr));}
          .row-3{grid-template-columns:repeat(3,minmax(0,1fr));}
        }
        @media(min-width:1280px){
          .app-shell{max-width:80rem;}
          .tab-grid,.tab-grid-3{grid-template-columns:repeat(3,minmax(0,1fr));}
          .tab-grid-2col{grid-template-columns:repeat(2,minmax(0,1fr));}
        }
        @media(min-width:1600px){ .app-shell{max-width:1560px;} }
        /* popups largos + listas em colunas dentro deles */
        .popup-largo{max-width:32rem;}
        .lista-cards{display:grid;gap:0.5rem;}
        @media(min-width:900px){
          .popup-largo{max-width:60rem;}
          .lista-cards{grid-template-columns:repeat(2,minmax(0,1fr));}
        }
        @media(min-width:1400px){
          .popup-largo{max-width:76rem;}
          .lista-cards{grid-template-columns:repeat(3,minmax(0,1fr));}
        }
        /* ===== LEGIBILIDADE: o texto base era pensado pra celular e ficava minúsculo no desktop ===== */
        .text-\\[8px\\]{font-size:9.5px;}
        .text-\\[9px\\]{font-size:10.5px;}
        .text-\\[10px\\]{font-size:11.5px;}
        .text-\\[11px\\]{font-size:12.5px;}
        @media(min-width:1024px){
          .text-\\[8px\\]{font-size:11px;}
          .text-\\[9px\\]{font-size:12px;}
          .text-\\[10px\\]{font-size:13px;}
          .text-\\[11px\\]{font-size:14px;}
          .text-xs{font-size:14px;}
          .text-sm{font-size:15.5px;}
          /* botões e itens de lista ganham respiro */
          .lista-cards > button{padding:0.85rem 1rem;}
        }
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;900&family=Oswald:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        :root{
          --bg-graphite:#111214; --bg-panel:rgba(24,26,29,0.62); --border-glass:rgba(255,255,255,0.08);
          --neon-green:#39FF88; --neon-cyan:#22D3EE; --gold:#D8B44A;
        }
        .display{font-family:'Unbounded',sans-serif;}
        .font-sport{font-family:'Rajdhani',sans-serif;}
        .font-stat{font-family:'Oswald',sans-serif;}
        body,.font-sans{font-family:'Rajdhani',ui-sans-serif,system-ui,sans-serif;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.95) translateY(8px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(18,168,118,0.5))}50%{filter:drop-shadow(0 0 18px rgba(110,231,249,0.8))}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes slideBar{from{left:0}to{left:calc(100% - 10px)}}
        @keyframes packShine{0%,100%{opacity:0.5;transform:scale(0.95)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes flashGol{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
        @keyframes textoGol{0%{opacity:0;transform:translate(-50%,-40%) scale(0.4)}55%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}75%{transform:translate(-50%,-50%) scale(0.98)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes confeteGol{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(90px) rotate(280deg)}}
        @keyframes pulaLado{0%{transform:translate(0,0) rotate(0deg)}35%{transform:translate(calc(var(--dx)*0.55),-18px) rotate(calc(var(--rot)*0.55))}100%{transform:translate(var(--dx),0) rotate(var(--rot))}}
        @keyframes ficaMeio{0%{transform:translate(0,0) scale(1)}40%{transform:translate(0,-9px) scale(1.05)}100%{transform:translate(0,0) scale(1)}}
        @keyframes barreiraPula{0%{transform:translateY(0)}45%{transform:translateY(-17px)}100%{transform:translateY(-14px)}}
        @keyframes miraPulsa{0%,100%{opacity:0.65;transform:translate(-50%,-50%) scale(0.9)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}}
        @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(160px) rotate(360deg);opacity:0}}
        @keyframes spin3dY{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}
        @keyframes sparkleTwinkle{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes stageEnter{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes scrambleFade{0%{opacity:0.3}100%{opacity:1}}
        @keyframes barFill{from{width:0%}}
        @keyframes neonPulse{0%,100%{box-shadow:0 0 6px rgba(57,255,136,0.35),0 0 0 1px rgba(57,255,136,0.15)}50%{box-shadow:0 0 18px rgba(57,255,136,0.65),0 0 0 1px rgba(57,255,136,0.3)}}
        @keyframes cyanPulse{0%,100%{box-shadow:0 0 6px rgba(34,211,238,0.35)}50%{box-shadow:0 0 18px rgba(34,211,238,0.65)}}
        .float-anim{animation:floatY 3.2s ease-in-out infinite}
        .glow-anim{animation:glowPulse 2.6s ease-in-out infinite}
        .glow-border{box-shadow:0 0 0 1px rgba(216,180,74,0.5),0 0 22px rgba(216,180,74,0.35)}
        .shimmer-bg{background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%);background-size:200% 100%;animation:shimmer 2.5s infinite}
        .glass{background:var(--bg-panel);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--border-glass);box-shadow:0 8px 30px rgba(0,0,0,0.35);}
        .glass-strong{background:rgba(16,17,20,0.78);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
        .bar-fill{transition:width 0.9s cubic-bezier(0.22,1,0.36,1);}
        .hud-btn{transition:all 0.3s ease;}
        .hud-btn:hover{transform:translateY(-2px);}
        .btn-primary{background:linear-gradient(90deg,#10b981,#34d399);color:#09090b;}
        .btn-primary:hover{filter:brightness(1.1);box-shadow:0 0 18px rgba(52,211,153,0.55);}
        .btn-ghost{background:rgba(24,26,29,0.62);border:1px solid rgba(255,255,255,0.2);color:#f4f4f5;}
        .btn-ghost:hover{border-color:rgba(34,211,238,0.7);box-shadow:0 0 14px rgba(34,211,238,0.35);}
        .btn-gold{background:linear-gradient(90deg,#D8B44A,#F5D77A);color:#09090b;}
        .btn-gold:hover{filter:brightness(1.1);box-shadow:0 0 18px rgba(216,180,74,0.55);}
        .logo-dot{background:linear-gradient(135deg,#34d399,#22d3ee);}
        .tab-active{border-color:#34d399 !important;color:#34d399 !important;text-shadow:0 0 12px rgba(52,211,153,0.5);}
        .opt-card{transition:all 0.3s ease;}
        .opt-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.35),0 0 14px rgba(34,211,238,0.25);}
        .opt-card:active{transform:translateY(0);}
        .shimmer-sweep{position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,0.10) 50%,transparent 65%);background-size:250% 250%;animation:shimmer 4s ease-in-out infinite;pointer-events:none;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:4px;}
      `}</style>
      <div className="relative z-10">
      <header className="sticky top-0 z-40 border-b border-white/10 px-6 py-4 flex items-center gap-2 glass-strong">
        <span className="w-3 h-3 logo-dot" style={{ clipPath: "polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)" }} />
        <span className="display font-bold text-sm tracking-wide">A JOIA</span>
        <span className="ml-auto text-[10px] text-zinc-500 uppercase tracking-widest font-sport">Simulador de carreira</span>
      </header>

      <main className="app-shell">
        <div key={stage} className="animate-[stageEnter_0.4s_ease-out]">

        {stage === "intro" && introFase === "splash" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
            <div className={`relative transition-all ease-in duration-500 ${zoomingIntro ? "scale-[9] opacity-0" : "scale-100 opacity-100"}`} style={{ perspective: "800px" }}>
              <div className="absolute" style={{ top: "-38px", left: "-50px", animation: "sparkleTwinkle 1.4s ease-in-out infinite" }}><Sparkle size={18} /></div>
              <div className="absolute" style={{ top: "-55px", left: "30px", animation: "sparkleTwinkle 1.4s ease-in-out infinite 0.3s" }}><Sparkle size={26} /></div>
              <div className="absolute" style={{ top: "-30px", right: "-55px", animation: "sparkleTwinkle 1.4s ease-in-out infinite 0.6s" }}><Sparkle size={16} /></div>
              <div className="absolute" style={{ bottom: "10px", left: "-70px", animation: "sparkleTwinkle 1.4s ease-in-out infinite 0.9s" }}><Sparkle size={14} /></div>
              <div className="absolute" style={{ bottom: "0px", right: "-60px", animation: "sparkleTwinkle 1.4s ease-in-out infinite 1.1s" }}><Sparkle size={20} /></div>
              <div style={{ animation: "spin3dY 1.1s linear infinite" }}>
                <Diamond size={160} />
              </div>
            </div>
          </div>
        )}

        {stage === "intro" && introFase === "form" && (
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-800 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-blue-950/40 p-6 text-center">
              <div className="absolute top-3 left-4 opacity-25 float-anim"><BallIcon size={26} /></div>
              <div className="absolute bottom-3 right-5 opacity-20 float-anim" style={{ animationDelay: "1s" }}><BallIcon size={20} /></div>
              <div className="absolute top-4 right-6 text-amber-400/30 text-xl float-anim" style={{ animationDelay: "0.5s" }}>🏆</div>
              <div className="flex justify-center mb-2 glow-anim"><Diamond size={72} /></div>
              <h1 className="display text-2xl font-black mb-1">A JOIA</h1>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">Escolha de onde seu craque vem, mostre serviço na peneira e comece a jornada rumo a se tornar A JOIA.</p>
              {temSave && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] text-zinc-500 mb-2">Você já tem uma carreira em andamento.</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => carregarJogo("auto")} className="text-xs font-bold text-emerald-400 border border-emerald-500/50 rounded-sm px-4 py-2 hover:bg-emerald-500/10">▶ Continuar carreira</button>
                    <button onClick={() => setSavesAberto(true)} className="text-xs text-zinc-400 border border-zinc-700 rounded-sm px-4 py-2 hover:border-zinc-500">💾 Ver saves</button>
                  </div>
                </div>
              )}
            </div>
            <Card>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do jogador" className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-4 py-2.5 text-sm mb-4 outline-none focus:border-emerald-500" />
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Posição</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSICOES.map((p) => <button key={p.id} onClick={() => setPosicao(p.id)} className={`opt-card px-2 py-2 text-xs rounded-sm border text-left ${posicao === p.id ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800"}`}><span className="font-mono font-bold">{p.id}</span><span className="block text-[9px] text-zinc-500 leading-tight">{p.label}</span></button>)}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Nacionalidade</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {NACIONALIDADES.map((n) => <button key={n.id} onClick={() => setNacionalidade(n.id)} className={`px-2 py-2 text-[11px] rounded-sm border font-bold ${nacionalidade === n.id ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-400"}`}>{n.id}</button>)}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Perna dominante</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPernaDominante("destro")} className={`opt-card px-3 py-2 text-xs rounded-sm border font-bold ${pernaDominante === "destro" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-400"}`}>🦵 Destro</button>
                  <button onClick={() => setPernaDominante("canhoto")} className={`opt-card px-3 py-2 text-xs rounded-sm border font-bold ${pernaDominante === "canhoto" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-400"}`}>🦵 Canhoto</button>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Personalidade (define sua curva de evolução)</div>
                <div className="grid gap-1.5">
                  {PERSONALIDADES.map((p) => {
                    const alturas = [0.5, 0.75, p.picoFim >= 28 ? 1 : 0.6, p.declinioApartir >= 32 ? 0.85 : 0.4, p.declinioApartir >= 32 ? 0.6 : 0.2];
                    const ativo = personalidade === p.id;
                    return (
                      <button key={p.id} onClick={() => setPersonalidade(p.id)} className={`opt-card text-left px-3 py-2.5 rounded-sm border transition-all ${ativo ? "scale-[1.01]" : ""}`} style={{ borderColor: ativo ? p.cor : "#27272a", background: ativo ? `${p.cor}18` : "transparent" }}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.icone}</span>
                          <div className="flex-1">
                            <span className="font-bold text-xs" style={{ color: ativo ? p.cor : "#e4e4e7" }}>{p.label}</span>
                            <span className="block text-[10px] text-zinc-500 mt-0.5">{p.desc}</span>
                          </div>
                          <div className="flex items-end gap-0.5 h-8 shrink-0">
                            {alturas.map((h, i) => <div key={i} className="w-1.5 rounded-full" style={{ height: `${h * 100}%`, background: ativo ? p.cor : "#3f3f46" }} />)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-zinc-400 mb-2">Clube do coração</div>
                <select value={clubeCoracao?.nome || ""} onChange={(e) => setClubeCoracao(CLUBES.find((c) => c.nome === e.target.value) || null)} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-xs outline-none">
                  <option value="">Nenhum (neutro)</option>
                  {CLUBES.filter((c) => c.liga !== "arabia" && c.liga !== "mls").map((c) => <option key={c.nome} value={c.nome}>{emojiClube(c.nome)} {c.nome}</option>)}
                </select>
              </div>
              <div className="mb-5">
                <div className="text-xs text-zinc-400 mb-2">De onde você vem <span className="text-zinc-600">(molda seu potencial e ganha um bônus)</span></div>
                <div className="grid gap-1.5">
                  {ORIGENS.map((o) => {
                    const ativo = origem?.id === o.id;
                    return (
                      <button key={o.id} onClick={() => setOrigem(o)} className={`opt-card text-left px-3 py-2.5 rounded-sm border transition-all ${ativo ? "scale-[1.01]" : ""}`} style={{ borderColor: ativo ? o.cor : "#27272a", background: ativo ? `${o.cor}18` : "transparent" }}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{o.icone}</span>
                          <div className="flex-1">
                            <span className="font-bold text-xs" style={{ color: ativo ? o.cor : "#e4e4e7" }}>{o.nome}</span>
                            <span className="block text-[10px] text-zinc-500 mt-0.5">{o.desc}</span>
                            {ativo && <span className="block text-[10px] mt-1" style={{ color: o.cor }}>🎁 {o.perk}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Button onClick={confirmarOrigem} disabled={!nome.trim() || !posicao || !personalidade || !origem}>Ir pra peneira</Button>
            </Card>
          </div>
        )}

        {stage === "teste" && (
          <Card className="text-center" accent="linear-gradient(90deg,#12A876,#3b82f6)">
            <h2 className="display text-lg font-bold mb-1">Teste de base</h2>
            {testeFase === "penalti" && (
              <>
                <p className="text-zinc-400 text-xs mb-4">Etapa 1/4 — 3 cobranças de pênalti pros olheiros.</p>
                {!testeTentativaAtual ? (
                  <GoalMini onPick={baterTesteBase} resultado={null} />
                ) : (
                  <>
                    <GoalMini onPick={() => {}} resultado={testeTentativaAtual} />
                    <p className="text-sm mb-3">{testeTentativaAtual.gol ? "⚽ GOL!" : testeTentativaAtual.tipo === "Defesa" ? "🧤 Defendeu!" : "❌ Pra fora!"}</p>
                    <Button variant="gold" onClick={continuarTesteBase}>Continuar</Button>
                  </>
                )}
                <div className="flex justify-center gap-2 mb-1 mt-3">{testeTentativas.map((t, i) => <span key={i} className={`text-xs px-2 py-1 rounded-sm ${t.gol ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{t.gol ? "GOL" : "Falhou"}</span>)}</div>
              </>
            )}
            {testeFase === "falta" && (
              <>
                <p className="text-zinc-400 text-xs mb-4">Etapa 2/4 — 3 cobranças de falta pros olheiros.</p>
                {!testeFaltaAtual ? (
                  <FreeKickMini onPick={baterTesteFalta} resultado={null} />
                ) : (
                  <>
                    <FreeKickMini onPick={() => {}} resultado={testeFaltaAtual} />
                    <p className="text-sm mb-3">{testeFaltaAtual.gol ? "⚽ GOL!" : testeFaltaAtual.tipo === "Barreira" ? "🧱 Na barreira!" : testeFaltaAtual.tipo === "Defesa" ? "🧤 Defendeu!" : testeFaltaAtual.tipo === "Trave" ? "🥅 Na trave!" : "❌ Pra fora!"}</p>
                    <Button variant="gold" onClick={continuarTesteFalta}>Continuar</Button>
                  </>
                )}
                <div className="flex justify-center gap-2 mb-1 mt-3">{testeFaltas.map((t, i) => <span key={i} className={`text-xs px-2 py-1 rounded-sm ${t.gol ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{t.gol ? "GOL" : "Falhou"}</span>)}</div>
              </>
            )}
            {testeFase === "passe" && (
              <>
                <p className="text-zinc-400 text-xs mb-4">Etapa 3/4 — 3 passes pros olheiros. Escolha o companheiro mais livre.</p>
                {!testePasseAtual ? (
                  <PasseMini atributoPasse={potencialFinal.passe} onResultado={resolverTestePasse} />
                ) : (
                  <>
                    <PasseMini atributoPasse={potencialFinal.passe} onResultado={() => {}} cenaForcada={testePasseAtual.cena} alvoForcado={testePasseAtual.companheiro} resultadoForcado={testePasseAtual.r} />
                    <p className="text-sm mb-3">{testePasseAtual.r.gol ? "✅ Passe certeiro!" : "🚫 Interceptado!"}</p>
                    <Button variant="gold" onClick={continuarTestePasse}>Continuar</Button>
                  </>
                )}
                <div className="flex justify-center gap-2 mb-1 mt-3">{testePasses.map((t, i) => <span key={i} className={`text-xs px-2 py-1 rounded-sm ${t.r.gol ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{t.r.gol ? "Certo" : "Cortado"}</span>)}</div>
              </>
            )}
            {testeFase === "reflexo" && (
              <div className="animate-[popIn_0.3s_ease-out]">
                <p className="text-zinc-400 text-xs mb-4">Etapa 4/4 — teste de reflexo. Clique em "Parar" quando o marcador estiver na zona verde.</p>
                <TimingBar onResult={(acerto) => baterTesteReflexo(acerto)} sweetMin={0.5 - clamp(potencialFinal.velocidade / 100 * 0.35 + 0.1, 0.15, 0.4) / 2} sweetMax={0.5 + clamp(potencialFinal.velocidade / 100 * 0.35 + 0.1, 0.15, 0.4) / 2} label="Parar" />
                <div className="flex justify-center gap-2 mb-1">{testeReflexo.map((t, i) => <span key={i} className={`text-xs px-2 py-1 rounded-sm ${t.acerto ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{t.acerto ? "Certo" : "Errou"}</span>)}</div>
              </div>
            )}
            {testeFase === "feito" && testeResultado && !clubeSelecionadoInicial && (
              <div className="animate-[popIn_0.3s_ease-out]">
                <p className="text-sm mb-4">{testeResultado.total}/12 de aproveitamento (pênalti {testeResultado.acertosPenalti}/3 · falta {testeResultado.acertosFalta}/3 · passe {testeResultado.acertosPasse}/3 · reflexo {testeResultado.acertosReflexo}/3) — <strong className="text-amber-400">{testeResultado.tier.label}</strong> de olho em você.</p>
                <div className="grid gap-2.5 mb-2">
                  {propostasIniciais.map((c) => (
                    <button key={c.nome} onClick={() => escolherClubeInicial(c)} className="opt-card text-left p-0 rounded-sm overflow-hidden border border-zinc-800 hover:border-emerald-500 transition-all">
                      <div className="h-1.5" style={{ background: c.cor }} />
                      <div className="p-3 flex items-center gap-3 bg-gradient-to-r from-zinc-900 to-zinc-900/40">
                        <ClubDot club={c} size={34} />
                        <div className="flex-1">
                          <div className="text-sm font-bold">{c.nome}</div>
                          <div className="text-[10px] text-zinc-500 mb-1">{LIGAS[c.liga].nome} · salário ${formatarDinheiro(salarioClube(c, ovrPotencial ? Math.round(ovrPotencial * 0.55) : 55))}/temporada</div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden w-full"><div className="h-full rounded-full" style={{ width: `${c.forca}%`, background: c.cor }} /></div>
                        </div>
                        <div className="text-lg font-mono font-black text-zinc-600">{c.forca}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {clubeSelecionadoInicial && !numeroEscolhidoInicial && (
              <div className="animate-[popIn_0.3s_ease-out]">
                <div className="flex items-center justify-center gap-2 mb-3"><ClubDot club={clubeSelecionadoInicial} size={28} /><span className="font-bold text-sm">{clubeSelecionadoInicial.nome}</span></div>
                <p className="text-xs text-zinc-400 mb-3">Escolha sua camisa (10 números livres):</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {Array.from({ length: 28 }, (_, i) => i + 1).filter((n) => !numerosBloqueados.has(n)).map((n) => (
                    <button key={n} onClick={() => confirmarNumeroInicial(n)} className="w-11 h-11 text-sm font-mono rounded-sm border border-zinc-700 hover:border-amber-400 hover:bg-amber-400/10">{n}</button>
                  ))}
                </div>
              </div>
            )}
            {clubeSelecionadoInicial && numeroEscolhidoInicial && !copinhaResultado && (
              <div className="text-center animate-[popIn_0.3s_ease-out]">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">Copa São Paulo de Futebol Júnior</div>
                <div className="display text-sm font-bold mb-3">{FASES_COPINHA[copinhaFaseIdx]}</div>
                {!copinhaTentativa ? (
                  <>
                    <p className="text-xs text-zinc-400 mb-3">Pênalti decisivo pela base do {clubeSelecionadoInicial.nome}. Perdeu, tá fora. Ganhou, passa de fase.</p>
                    <GoalMini onPick={baterPenaltiCopinha} resultado={null} />
                  </>
                ) : (
                  <>
                    <GoalMini onPick={() => {}} resultado={copinhaTentativa} />
                    <p className="text-sm mb-4">{copinhaTentativa.gol ? "Converteu! Classificado pra próxima fase." : copinhaTentativa.tipo === "Defesa" ? "O goleiro pegou! Eliminado da Copinha." : "Chutou pra fora! Eliminado da Copinha."}</p>
                    <Button variant="gold" onClick={continuarCopinha}>Continuar</Button>
                  </>
                )}
              </div>
            )}
            {copinhaResultado && (
              <div className="text-center mt-2 animate-[popIn_0.3s_ease-out]">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">Primeira competição — Copa São Paulo de Futebol Júnior</div>
                <div className="text-3xl mb-2">🏆</div>
                <p className="font-bold text-base text-amber-400 mb-1">{copinhaResultado.label}</p>
                <p className="text-xs text-zinc-400 mb-4">{copinhaResultado.texto}</p>
                <Button variant="gold" onClick={() => { iniciarCarreira(clubeSelecionadoInicial, numeroEscolhidoInicial); setClubeSelecionadoInicial(null); }}>Estrear no profissional</Button>
              </div>
            )}
          </Card>
        )}

        {stage === "carreira" && carreira && (
          <div className="grid gap-4">
            <div className="flex gap-1 border-b border-white/10 overflow-x-auto glass rounded-t-md px-1">
              {[["carreira", "🏟️ Carreira"], ["inbox", `📬 Notícias${(carreira.inbox || []).filter((x) => !x.lida).length ? ` (${(carreira.inbox || []).filter((x) => !x.lida).length})` : ""}`], ["estatisticas", "📊 Estatísticas"], ["mundo", "🌍 Mundo"], ["legado", "🏆 Legado"], ["vidaprivada", "🛍️ Vida Privada"], ["midia", "📱 Mídia & Redes"]].map(([id, label]) => (
                <button key={id} onClick={() => setAba(id)} className={`hud-btn px-3 py-2.5 text-xs font-sport font-semibold uppercase tracking-widest border-b-2 whitespace-nowrap ${aba === id ? "tab-active" : "border-transparent text-zinc-500 hover:text-zinc-200"}`}>{label}</button>
              ))}
            </div>

            <div key={aba} className="animate-[stageEnter_0.3s_ease-out] grid gap-4">
            {aba === "carreira" && (
              <div className="stack">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 span-full">
                  {[
                    ["Contrato", "✍️", () => setContratoMenuAberto(true)],
                    ["Empresário", "💼", () => setEmpresarioMenuAberto(true)],
                    ["Técnico", "🧑‍💼", () => setTecnicoMenuAberto(true)],
                    ["Corpo", "🏋️", () => setTreinoPopupAberto(true)],
                    ["Clube", "🏟️", () => setPopupClube(carreira.clube.nome)],
                    ["Salvar", "💾", () => setSavesAberto(true)],
                  ].map(([label, icone, onClick]) => (
                    <button key={label} onClick={onClick} className="opt-card shrink-0 px-3 py-1.5 text-[10px] font-sport font-bold uppercase tracking-wide rounded-md border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 whitespace-nowrap">{icone} {label}</button>
                  ))}
                </div>

                <Card className="border-amber-500/30 span-full">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setJogadorCardAberto(true)} className={`shrink-0 w-16 h-16 flex flex-col items-center justify-center hover:brightness-110 transition-all ${ovrAtual >= 93 ? "glow-anim" : ""}`} style={{ background: ovrHexGradiente(ovrAtual), clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                      <div className="font-stat font-black text-2xl text-zinc-950 leading-none">{ovrAtual}</div>
                      <div className="text-[7px] font-sport font-bold text-zinc-900 uppercase tracking-widest">OVR</div>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-cyan-400 text-xs">⚡</span>
                        <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full bar-fill" style={{ width: `${carreira.energia ?? 100}%`, background: (carreira.energia ?? 100) > 40 ? "linear-gradient(90deg,#22D3EE,#39FF88)" : "linear-gradient(90deg,#f59e0b,#ef4444)" }} /></div>
                        <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">{Math.round(carreira.energia ?? 100)}%</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {nome} · {carreira.clube.nome} · Idade {carreira.idade}
                        {carreira.apelido && <span className="text-amber-400"> · "{carreira.apelido.nome}"</span>}
                      </div>
                      {carreira.apelido && canticoDoApelido(carreira, nome) && (
                        <div className="text-[10px] text-amber-400/80 italic truncate">📣 "{canticoDoApelido(carreira, nome)}"</div>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-zinc-400">
                        <span title={carreira.clube.nome}>{emojiClube(carreira.clube.nome)}</span>
                        <span title={nacDe(carreira.nacionalidade).label}>🌎 {nacDe(carreira.nacionalidade).id}</span>
                        <span title={PERSONALIDADES.find((p) => p.id === carreira.personalidade)?.label}>{PERSONALIDADES.find((p) => p.id === carreira.personalidade)?.icone}</span>
                        <span title={carreira.pernaDominante === "canhoto" ? "Canhoto" : "Destro"}>🦵 {carreira.pernaDominante === "canhoto" ? "E" : "D"}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1 justify-end text-amber-400 font-stat font-bold text-sm">💰 ${formatarDinheiro(carreira.cofre)}</div>
                      <div className="text-[9px] text-zinc-500">{temporadaLabel(carreira.idade, ANO_INICIO)}</div>
                    </div>
                  </div>
                </Card>

                <div>
                <Button
                  disabled={!carreira.temporadaAndamento && !posTemporada?.ok && (janela || decisao || awardsPopup || pendingSponsor || pendingAbordagem || pendingExpectativa || pendingTecnico || pendingColetiva || pendingCompeticao || competicaoResultado || pendingLegendFollow || pendingTierUpgrade)}
                  onClick={() => {
                    if (carreira.temporadaAndamento) avancarUmJogo();
                    else if (posTemporada?.ok) { setModoSimulacao("jogoAJogo"); iniciarTemporada(); }
                    else jogarTemporada(null);
                  }}
                >
                  {carreira.temporadaAndamento
                    ? `▶ Avançar — rodada ${carreira.temporadaAndamento.rodadaAtual + 1}/${(carreira.temporadaAndamento.calendario || []).length}`
                    : posTemporada?.ok
                    ? "▶ Seguir para a temporada"
                    : "▶ Jogar temporada (idade " + carreira.idade + ")"}
                </Button>
                </div>

                {posTemporada?.ok && !janela && !awardsPopup && !carreira.temporadaAndamento && (
                  <Card className="border-2 border-emerald-400 glow-anim span-full" accent="linear-gradient(90deg,#12A876,#3b82f6,#12A876)">
                    <div className="text-center mb-3">
                      <div className="text-sm font-sport font-black uppercase tracking-widest text-emerald-400">🚦 Defina o rumo da temporada</div>
                      <p className="text-[10px] text-zinc-400 mt-1">Suas escolhas aqui valem pra temporada inteira — treine, cuide do corpo e resolva pendências antes de entrar em campo.</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Energia</span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${carreira.energia ?? 100}%`, background: (carreira.energia ?? 100) > 50 ? "#12A876" : "#D6483F" }} /></div>
                      <span className="text-[10px] font-mono text-zinc-400">{Math.round(carreira.energia ?? 100)}</span>
                      <span className="text-[10px] text-amber-400 font-bold">💰 ${formatarDinheiro(carreira.cofre)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button onClick={() => setTreinoPopupAberto(true)} className="p-3 border border-emerald-500/30 rounded-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-left">
                        <div className="text-lg mb-0.5">🏋️</div><div className="font-bold text-sm">Treino</div><div className="text-[10px] text-zinc-500">Minigames, treino pesado, especializado, versatilidade</div>
                      </button>
                      <button onClick={() => setAcoesPopupAberto(true)} className="p-3 border border-blue-500/30 rounded-sm bg-blue-500/5 hover:bg-blue-500/10 text-left">
                        <div className="text-lg mb-0.5">📋</div><div className="font-bold text-sm">Ações da carreira</div><div className="text-[10px] text-zinc-500">Patrocínio, torcida, diretoria, contrato e mais</div>
                      </button>
                    </div>
                    <button onClick={() => setCentralMedicaAberta(true)} className="w-full mb-3 p-2 border border-red-500/30 rounded-sm bg-red-500/5 hover:bg-red-500/10 text-left text-xs">🩺 Central médica <span className="text-zinc-500">(desgaste, risco de lesão{carreira.staff?.departamentoScout ? ", curva de evolução" : ""})</span></button>
                    <div className="border-t border-zinc-800 pt-3 grid gap-1.5">
                      <Button variant="ghost" onClick={() => abrirTransferencias("empresario")}>💼 Falar com o empresário</Button>
                      <p className="text-[10px] text-zinc-500 text-center">Quando terminar, use o botão ▶ logo acima pra seguir pra temporada.</p>
                    </div>
                  </Card>
                )}

                {carreira.temporadaAndamento && (
                  <div className="text-[10px] text-zinc-500 text-center -mt-1 mb-1">📋 Planejamento definido — treino em <span className="text-amber-400 font-bold">CORPO</span>, ações em <span className="text-amber-400 font-bold">CONTRATO</span>, logo ali em cima.</div>
                )}

                {carreira.temporadaAndamento && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <Button variant="ghost" onClick={simularMetadeDaTemporada}>⏭️ Simular metade da temporada</Button>
                    <Button variant="ghost" onClick={simularRestoDaTemporada}>⏩ Simular temporada inteira</Button>
                  </div>
                )}

                {carreira.temporadaAndamento && (
                  <>
                    <Card className="border-emerald-500/30">
                      {(() => {
                        const ta = carreira.temporadaAndamento;
                        const susp = carreira.cartoes?.suspensoesRestantes || 0;
                        const amAcum = carreira.cartoes?.amarelosAcumulados || 0;
                        const postAtual = ta.postura || "normal";
                        return (
                          <>
                            {(carreira.metasCompeticao || []).length > 0 && (
                              <div className="mb-3 pb-2.5 border-b border-zinc-800">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">🎯 O que a diretoria cobra nesta temporada</div>
                                <div className="grid gap-1">
                                  {(carreira.metasCompeticao || []).map((m, i) => {
                                    const rot = { liga: "🏆 Liga", copa: "🥇 Copa", continental: "🌍 Continental" }[m.comp] || m.comp;
                                    return (
                                      <div key={i} className="flex items-center gap-2 text-[10px]">
                                        <span className="text-zinc-500 w-20 shrink-0">{rot}</span>
                                        <span className="flex-1 text-zinc-300">{m.texto}</span>
                                        <span className="font-mono text-amber-400 text-[9px]">+${formatarDinheiro(m.bonus)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">📅 A semana antes do jogo</div>
                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                              {PREPARACOES_SEMANA.map((pr) => {
                                const ativa = ta.preparacaoSemana === pr.id;
                                const semEnergia = (carreira.energia ?? 100) + (pr.energia || 0) < 5;
                                return (
                                  <button key={pr.id} disabled={semEnergia}
                                    onClick={() => { const cc = { ...carreira }; const usado = aplicarPreparacaoSemana(cc, pr.id); cc.temporadaAndamento = { ...cc.temporadaAndamento, preparacaoSemana: pr.id }; setCarreira(cc); if (usado?._ganho) setAvisoSave({ erro: false, txt: `Ação de patrocinador rendeu $${formatarDinheiro(usado._ganho)}` }); if (usado?._subiuFisico) setAvisoSave({ erro: false, txt: "O trabalho pesado rendeu +1 de físico" }); setTimeout(() => setAvisoSave(null), 2600); }}
                                    className="text-left px-2 py-1.5 rounded-sm border transition-all disabled:opacity-30"
                                    style={{ borderColor: ativa ? pr.cor : "#27272a", background: ativa ? `${pr.cor}15` : "transparent" }}>
                                    <div className="text-[10px] font-bold" style={{ color: ativa ? pr.cor : "#e4e4e7" }}>{pr.icone} {pr.nome}</div>
                                    <div className="text-[9px] text-zinc-500 mt-0.5 leading-snug">{pr.desc}</div>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-[9px] text-zinc-500 uppercase tracking-widest">⚡ Como você entra em campo</div>
                              <div className="flex items-center gap-2 text-[9px]">
                                {amAcum > 0 && <span className="text-yellow-400">🟨 {amAcum}/{REGRAS_CARTAO.amarelosParaSuspender}</span>}
                                {susp > 0 && <span className="text-red-400 font-bold">🚫 suspenso ({susp} jogo{susp > 1 ? "s" : ""})</span>}
                              </div>
                            </div>
                            {susp > 0 ? (
                              <p className="text-[11px] text-red-400 border border-red-500/30 bg-red-500/5 rounded-sm px-2.5 py-2">
                                Você está suspenso e não entra em campo na próxima rodada. Cumpra a suspensão pra voltar.
                              </p>
                            ) : (
                              <div className="grid grid-cols-2 gap-1.5">
                                {POSTURAS_JOGO.map((po) => {
                                  const ativa = postAtual === po.id;
                                  return (
                                    <button key={po.id}
                                      onClick={() => setCarreira((cc) => ({ ...cc, posturaPreferida: po.id, temporadaAndamento: { ...cc.temporadaAndamento, postura: po.id } }))}
                                      className="text-left px-2.5 py-2 rounded-sm border transition-all"
                                      style={{ borderColor: ativa ? po.cor : "#27272a", background: ativa ? `${po.cor}15` : "transparent" }}>
                                      <div className="text-[11px] font-bold" style={{ color: ativa ? po.cor : "#e4e4e7" }}>{po.icone} {po.nome}</div>
                                      <div className="text-[9px] text-zinc-500 mt-0.5 leading-snug">{po.desc}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </Card>

                    <Card className="border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest">🗓️ Calendário da temporada — rodada {carreira.temporadaAndamento.rodadaAtual + 1}/{(carreira.temporadaAndamento.calendario || []).length}</div>
                        <button
                          onClick={() => {
                            const ano = ANO_INICIO + (carreira.idade - 16);
                            const janelaLiga = janelasPorLiga(carreira.clube.liga).find((j) => j.ligaPrincipal);
                            const datas = distribuirRodadasNaJanela(carreira.temporadaAndamento.calendario.length, janelaLiga, ano);
                            setCalendarioMesAberto(datas[carreira.temporadaAndamento.rodadaAtual]?.mes ?? janelaLiga.inicioMes);
                            setCalendarioAberto(true);
                          }}
                          className="text-[9px] text-amber-400 border border-amber-500/30 rounded-sm px-2 py-1 hover:bg-amber-500/10"
                        >📅 Ver calendário completo</button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(carreira.temporadaAndamento.calendario || []).map((_, i) => {
                          const jogada = i < carreira.temporadaAndamento.rodadaAtual;
                          const atual = i === carreira.temporadaAndamento.rodadaAtual;
                          const resultado = (carreira.temporadaAndamento.resultadosRodadas || [])[i];
                          const cor = !jogada ? "bg-zinc-800" : resultado === "V" ? "bg-emerald-500" : resultado === "D" ? "bg-red-500" : "bg-zinc-500";
                          return <div key={i} className={`w-3.5 h-3.5 rounded-sm ${cor} ${atual ? "border-2 border-amber-400" : ""}`} title={`Rodada ${i + 1}${resultado ? ` — ${resultado === "V" ? "Vitória" : resultado === "D" ? "Derrota" : "Empate"}` : ""}`} />;
                        })}
                      </div>
                    </Card>

                    {(carreira.temporadaAndamento.logJogos || []).length > 0 && (() => {
                      const an = analisarJogos(carreira.temporadaAndamento.logJogos);
                      if (!an) return null;
                      return (
                        <Card>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">📈 Sua forma</div>
                          <p className="text-[9px] text-zinc-600 mb-1.5">Clique num jogo pra ver a ficha completa da partida.</p>
                          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                            {an.ultimos.slice(-8).map((j, i) => (
                              <button key={i} onClick={() => setFichaJogo(j)} className="flex flex-col items-center hover:scale-110 transition-transform relative" title={`x ${j.adversario} — clique pra ver a ficha`}>
                                <div className={`w-9 h-9 rounded-sm flex items-center justify-center text-xs font-black relative ${j.suspenso ? "bg-zinc-800 text-zinc-600" : j.resultado === "V" ? "bg-emerald-500 text-zinc-900" : j.resultado === "D" ? "bg-red-500 text-white" : "bg-zinc-600 text-white"}`}>
                                  {j.suspenso ? "🚫" : j.resultado}
                                  {j.vermelho && <span className="absolute -top-1 -right-1 w-2.5 h-3.5 rounded-[2px] bg-red-600 border border-zinc-900" title="Cartão vermelho" />}
                                  {j.amarelo && !j.vermelho && <span className="absolute -top-1 -right-1 w-2.5 h-3.5 rounded-[2px] bg-yellow-400 border border-zinc-900" title="Cartão amarelo" />}
                                </div>
                                <span className="text-[9px] font-mono mt-0.5" style={{ color: j.suspenso ? "#52525b" : (j.nota || 0) >= 7.5 ? "#12A876" : (j.nota || 0) >= 6.5 ? "#a1a1aa" : "#D6483F" }}>{j.suspenso ? "—" : j.nota}</span>
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center mb-2">
                            <div><div className="font-mono text-sm font-bold" style={{ color: an.forma.notaMedia >= 7.2 ? "#12A876" : an.forma.notaMedia >= 6.5 ? "#D8B44A" : "#D6483F" }}>{an.forma.notaMedia}</div><div className="text-[8px] text-zinc-500 uppercase">Nota (últ. 5)</div></div>
                            <div><div className="font-mono text-sm font-bold">{an.total.gols}<span className="text-zinc-600">g</span> {an.total.assist}<span className="text-zinc-600">a</span></div><div className="text-[8px] text-zinc-500 uppercase">Na temporada</div></div>
                            <div><div className="font-mono text-sm font-bold">{an.total.aproveitamento}%</div><div className="text-[8px] text-zinc-500 uppercase">Aproveitamento</div></div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {an.seqMarcando >= 2 && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-400">🔥 {an.seqMarcando} jogos marcando</span>}
                            {an.seqSemMarcar >= 4 && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-red-500/15 text-red-400">❄️ {an.seqSemMarcar} jogos sem marcar</span>}
                            {an.seqSemPerder >= 4 && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-blue-500/15 text-blue-400">🛡️ {an.seqSemPerder} sem perder</span>}
                            {an.classicos.jogos > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-400">⚔️ Clássicos: nota {an.classicos.notaMedia}</span>}
                          </div>
                        </Card>
                      );
                    })()}

                    <Card>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">📅 Próximo Compromisso</div>
                      <div className="text-sm text-amber-300 font-bold mb-2">{(() => {
                        const jogo = carreira.temporadaAndamento.calendario[carreira.temporadaAndamento.rodadaAtual]?.find((p) => p.casa.nome === carreira.clube.nome || p.fora.nome === carreira.clube.nome);
                        if (!jogo) return "Folga nessa rodada";
                        const souCasa = jogo.casa.nome === carreira.clube.nome;
                        return `${souCasa ? "vs" : "x"} ${souCasa ? jogo.fora.nome : jogo.casa.nome}${souCasa ? " (casa)" : " (fora)"}`;
                      })()}</div>
                      <hr className="border-white/10 mb-2" />
                      <div className="text-xs text-zinc-400">Último jogo: {carreira.temporadaAndamento.ultimoResultado ? `${carreira.temporadaAndamento.ultimoResultado.golsMeu}x${carreira.temporadaAndamento.ultimoResultado.golsAdv} x ${carreira.temporadaAndamento.ultimoResultado.adversario}` : "—"}</div>
                      {carreira.temporadaAndamento.ultimoResultado && (carreira.temporadaAndamento.ultimoResultado.golsMinha > 0 || carreira.temporadaAndamento.ultimoResultado.assistMinha > 0) && (
                        <div className="text-[10px] text-emerald-400 mt-0.5">{carreira.temporadaAndamento.ultimoResultado.golsMinha > 0 ? `⚽${carreira.temporadaAndamento.ultimoResultado.golsMinha} ` : ""}{carreira.temporadaAndamento.ultimoResultado.assistMinha > 0 ? `🎯${carreira.temporadaAndamento.ultimoResultado.assistMinha}` : ""}</div>
                      )}
                    </Card>
                  </>
                )}

                <div className="row-3">

                <Card>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3">📊 Atributos do Atleta</div>
                  <AttrRadar attrs={carreira.attrs} baseline={60 + (LIGAS[carreira.clube.liga].mult - 0.85) * 30} />
                  <div className="mt-2">
                  <AttrBarDelta label="VEL" value={carreira.attrs.velocidade} anterior={carreira.attrsAnteriores?.velocidade} />
                  <AttrBarDelta label="FIN" value={carreira.attrs.finalizacao} anterior={carreira.attrsAnteriores?.finalizacao} posicao={carreira.posicao} />
                  <AttrBarDelta label="PAS" value={carreira.attrs.passe} anterior={carreira.attrsAnteriores?.passe} />
                  <AttrBarDelta label="DRI" value={carreira.attrs.drible} anterior={carreira.attrsAnteriores?.drible} posicao={carreira.posicao} />
                  <AttrBarDelta label="DEF" value={carreira.attrs.defesa} anterior={carreira.attrsAnteriores?.defesa} posicao={carreira.posicao} />
                  <AttrBarDelta label="FIS" value={carreira.attrs.fisico} anterior={carreira.attrsAnteriores?.fisico} />
                  </div>
                </Card>

                <div className="grid gap-3">
                {carreira.temporadaAndamento ? (
                  <>
                    {carreira.temporadaAndamento.historicoRodada.length > 0 && (
                      <Card>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">📰 Resultados da última rodada</div>
                        <div className="grid gap-1 max-h-40 overflow-y-auto pr-1">
                          {carreira.temporadaAndamento.historicoRodada.map((p, i) => (
                            <div key={i} className={`text-[11px] px-1.5 py-1 rounded-sm ${p.destaque ? "bg-amber-500/15 border border-amber-500/30 font-bold text-amber-300" : "text-zinc-400"}`}>{p.texto}</div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    <Card>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">📅 Próximo Compromisso</div>
                      <div className="text-sm text-amber-300 font-bold mb-2">{posTemporada?.ok ? "Pré-temporada" : pendingCompeticao ? "Competição em andamento" : "Rodada da liga"}</div>
                      <hr className="border-white/10 mb-2" />
                      <div className="text-xs text-zinc-400">Último jogo: {ultima ? `${ultima.jogos} jogos · nota ${ultima.nota}` : "—"}</div>
                    </Card>
                  </>
                )}
                </div>

                <div className="grid gap-3">
                <Card>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">📈 Desempenho & Finanças</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => setAba("estatisticas")} className="opt-card glass rounded-md px-1 py-2.5 border border-white/10 flex flex-col items-center gap-1">
                      <span className="text-base">⚽</span><span className="font-stat font-bold text-sm">{carreira.gols}</span><span className="text-[8px] text-zinc-500 uppercase">Gols</span>
                    </button>
                    <button onClick={() => setAba("estatisticas")} className="opt-card glass rounded-md px-1 py-2.5 border border-white/10 flex flex-col items-center gap-1">
                      <span className="text-base">🎯</span><span className="font-stat font-bold text-sm">{carreira.assist}</span><span className="text-[8px] text-zinc-500 uppercase">Assist.</span>
                    </button>
                    <button onClick={() => setAba("vidaprivada")} className="opt-card glass rounded-md px-1 py-2.5 border border-amber-500/20 flex flex-col items-center gap-1">
                      <span className="text-base">💰</span><span className="font-stat font-bold text-sm text-amber-400">${formatarDinheiro(carreira.cofre)}</span><span className="text-[8px] text-zinc-500 uppercase">Cofre</span>
                    </button>
                    <button onClick={() => setAba("vidaprivada")} className="opt-card glass rounded-md px-1 py-2.5 border border-white/10 flex flex-col items-center gap-1">
                      <span className="text-base">🧾</span><span className="font-stat font-bold text-sm">{(carreira.extrato || []).length}</span><span className="text-[8px] text-zinc-500 uppercase">Extrato</span>
                    </button>
                  </div>
                </Card>

                {carreira.temporadaAndamento && (
                    <Card>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">📊 Classificação atual</div>
                      <div className="grid gap-0.5">
                        {(() => {
                          const linhas = Object.values(carreira.temporadaAndamento.tabela).sort((a, b) => b.pts - a.pts || b.sg - a.sg).map((row, i) => ({ ...row, posicao: i + 1 }));
                          const minhaLinha = linhas.find((r) => r.clube.nome === carreira.clube.nome);
                          const topN = linhas.slice(0, 6);
                          const mostrar = topN.some((r) => r.clube.nome === carreira.clube.nome) ? topN : [...topN, minhaLinha];
                          return mostrar.map((row) => (
                            <div key={row.clube.nome} className={`flex items-center justify-between text-[11px] py-1 px-1.5 rounded-sm ${row.clube.nome === carreira.clube.nome ? "bg-emerald-500/10 border border-emerald-500/30" : ""}`}>
                              <span className="flex items-center gap-1.5 truncate"><span className="font-mono text-zinc-500 w-4">{row.posicao}º</span><ClubDot club={row.clube} size={14} /><span className={row.clube.nome === carreira.clube.nome ? "font-bold text-emerald-400" : "text-zinc-400"}>{row.clube.nome}{row.clube.nome === carreira.clube.nome ? " (você)" : ""}</span></span>
                              <span className="font-mono text-zinc-300">{row.pts}pts <span className="text-zinc-600">({row.j}j)</span></span>
                            </div>
                          ));
                        })()}
                      </div>
                    </Card>
                )}

                <button onClick={() => setDetalhesAbertos((v) => !v)} className="w-full flex items-center justify-between glass rounded-md px-4 py-2.5 text-[10px] text-zinc-400 uppercase tracking-widest font-sport font-bold border border-white/10 hover:border-amber-500/30">
                  <span>📂 Mais detalhes</span>
                  <span className="text-zinc-600 normal-case">{detalhesAbertos ? "recolher ▲" : "expandir ▼"}</span>
                </button>
                </div>

                </div>

                {detalhesAbertos && (
                  <>
                <div className="row-2">
                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2.5">📊 Como te enxergam no {carreira.clube.nome}</div>
                  <div className="grid gap-2">
                    {EIXOS_APROVACAO.map((e) => {
                      const val = Math.round(e.get(carreira, getTorcida));
                      const bom = e.inverso ? 100 - val : val;
                      const cor = bom >= 70 ? "#12A876" : bom >= 45 ? "#D8B44A" : "#D6483F";
                      return (
                        <div key={e.id}>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-zinc-400">{e.icone} {e.label}</span>
                            <span className="font-mono font-bold" style={{ color: cor }}>{val}{e.inverso ? " (alta = ruim)" : ""}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${val}%`, background: cor }} /></div>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const torc = getTorcida(carreira, carreira.clube.nome), elen = carreira.elencoMoral ?? 60;
                    const tec = carreira.tecnicoConfianca ?? 60, dir = carreira.relacaoDiretoria ?? 40, mid = carreira.calorMidia ?? 20;
                    const alertas = [];
                    if (torc >= 70 && elen <= 40) alertas.push("🎭 A torcida te idolatra, mas o vestiário te acha estrelinha — clima pesado no grupo.");
                    if (torc >= 70 && tec <= 40) alertas.push("⚔️ Você é queridinho da arquibancada e desafeto da comissão — o técnico está sob pressão pra te escalar.");
                    if (mid >= 65 && dir <= 35) alertas.push("🔥 Mídia em cima e diretoria fria: sua saída começa a ser ventilada nos bastidores.");
                    if (elen >= 75 && tec >= 70) alertas.push("👑 Vestiário e comissão do seu lado — você é referência dentro do clube.");
                    if (torc <= 30 && mid >= 60) alertas.push("📉 Torcida virada e imprensa cobrando: cada jogo ruim vira crise.");
                    return alertas.length ? (
                      <div className="border-t border-zinc-800 mt-3 pt-2.5 grid gap-1">
                        {alertas.map((a, i) => <p key={i} className="text-[10px] text-zinc-400 leading-snug">{a}</p>)}
                      </div>
                    ) : null;
                  })()}
                </Card>

                {(carreira.elenco || []).length > 0 && (() => {
                  const ovrMeu = calcOVR(carreira.attrs, carreira.posicao, carreira.papelTatico);
                  const esc = escalacaoProvavel(carreira.elenco, { nome, posicao: carreira.posicao, idade: carreira.idade, ovr: ovrMeu, titularidade: carreira.titularidade });
                  const linhas = [["Ataque", ["PD", "ATA", "PE"]], ["Meio", ["VOL", "MC", "MEI"]], ["Defesa", ["LD", "ZAG", "LE"]], ["Gol", ["GOL"]]];
                  const Jog = ({ j }) => (
                    <div className={`flex-1 min-w-0 rounded-sm px-1.5 py-1 text-center ${j.voce ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-zinc-900/60 border border-zinc-800"}`}>
                      <div className={`text-[9px] truncate ${j.voce ? "font-bold text-emerald-400" : "text-zinc-300"}`}>{j.voce ? "VOCÊ" : j.nome.split(" ")[0]}</div>
                      <div className="text-[8px] font-mono text-zinc-500">{j.ovr}{j.improvisado ? " ⚠️" : ""}</div>
                    </div>
                  );
                  return (
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">👥 Elenco do {carreira.clube.nome}</div>
                        <span className={`text-[10px] font-bold ${esc.voceTitular ? "text-emerald-400" : "text-red-400"}`}>{esc.voceTitular ? "✓ Titular" : "Reserva"}</span>
                      </div>
                      <div className="rounded-sm p-2 mb-2" style={{ background: "linear-gradient(180deg,#123a22,#0d2a19)" }}>
                        {linhas.map(([nomeLinha, posIds]) => {
                          const doSetor = esc.titulares.filter((j) => posIds.includes(j.vaga));
                          if (!doSetor.length) return null;
                          return <div key={nomeLinha} className="flex gap-1 mb-1 last:mb-0">{doSetor.map((j, i) => <Jog key={i} j={j} />)}</div>;
                        })}
                      </div>
                      {!esc.voceTitular && (() => {
                        const naSuaVaga = esc.titulares.find((j) => j.vaga === carreira.posicao);
                        return naSuaVaga ? <p className="text-[10px] text-amber-400 mb-2">⚠️ {naSuaVaga.nome} (OVR {naSuaVaga.ovr}) está na sua frente — você precisa de {Math.max(1, naSuaVaga.ovr - ovrMeu + 1)} de OVR ou mais titularidade pra assumir.</p> : null;
                      })()}
                      <button onClick={() => setElencoAberto(true)} className="w-full text-[10px] text-zinc-400 border border-zinc-800 rounded-sm py-1.5 hover:border-emerald-500">Ver elenco completo ({(carreira.elenco || []).length + 1} jogadores) →</button>
                    </Card>
                  );
                })()}

                {(carreira.inbox || []).filter((x) => !x.lida).length > 0 && (() => {
                  const naoLidas = (carreira.inbox || []).filter((x) => !x.lida);
                  const destaque = naoLidas[0];
                  const t = TIPOS_NOTICIA[destaque.tipo] || TIPOS_NOTICIA.mundo;
                  return (
                    <button onClick={() => setAba("inbox")} className="w-full text-left">
                      <Card accent={t.cor}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] uppercase tracking-widest" style={{ color: t.cor }}>📬 {naoLidas.length} {naoLidas.length === 1 ? "notícia nova" : "notícias novas"}</span>
                          <span className="text-[9px] text-zinc-600">ver todas →</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm">{t.icone}</span>
                          <div className="flex-1">
                            <div className="text-xs font-bold">{destaque.titulo}</div>
                            <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{destaque.corpo}</p>
                          </div>
                        </div>
                      </Card>
                    </button>
                  );
                })()}

                {(() => {
                  const ovrAg = calcOVR(carreira.attrs, carreira.posicao, carreira.papelTatico);
                  const val = valorDeMercado(carreira, ovrAg, ultima);
                  const fx = faixaValor(val);
                  const hist = [...(carreira.valorHistorico || []), { idade: carreira.idade, valor: val }];
                  const maxV = Math.max(...hist.map((h) => h.valor), 1);
                  const anterior = ultima?.valorMercado;
                  const varia = anterior ? Math.round(((val - anterior) / anterior) * 100) : null;
                  return (
                    <Card>
                      <div className="flex items-baseline justify-between mb-0.5">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">💰 Valor de mercado</div>
                        {varia != null && <span className={`text-[10px] font-mono ${varia > 0 ? "text-emerald-400" : varia < 0 ? "text-red-400" : "text-zinc-500"}`}>{varia > 0 ? "▲" : varia < 0 ? "▼" : "—"} {Math.abs(varia)}%</span>}
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="display text-2xl font-black" style={{ color: fx.cor }}>${formatarDinheiro(val)}</span>
                        <span className="text-[10px]" style={{ color: fx.cor }}>{fx.label}</span>
                      </div>
                      {hist.length > 1 && (
                        <div className="flex items-end gap-0.5 h-10 mb-1.5 mt-2">
                          {hist.slice(-16).map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm transition-all" title={`${h.idade} anos: $${formatarDinheiro(h.valor)}`}
                              style={{ height: `${Math.max(6, (h.valor / maxV) * 100)}%`, background: h.valor === maxV ? fx.cor : "#3f3f46" }} />
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between text-[9px] text-zinc-600">
                        <span>Pico da carreira: ${formatarDinheiro(Math.max(carreira.valorPico || 0, val))}</span>
                        {carreira.contrato && carreira.contrato.restantes <= 1 && <span className="text-amber-400">contrato acabando derruba seu preço</span>}
                      </div>
                    </Card>
                  );
                })()}

                {(carreira.relacoes && Object.keys(carreira.relacoes).length > 0) && (
                  <Card>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2.5">🚪 Vestiário</div>
                    <div className="grid gap-2">
                      {["parceiro", "pupilo", "desafeto"].filter((k) => carreira.relacoes[k]).map((k) => {
                        const t = TIPOS_RELACAO[k];
                        const r = carreira.relacoes[k];
                        const membro = (carreira.elenco || []).find((j) => j.id === r.id);
                        const barra = k === "parceiro" ? r.sintonia : k === "desafeto" ? r.atrito : null;
                        return (
                          <div key={k} className="border rounded-sm p-2.5" style={{ borderColor: `${t.cor}44`, background: `${t.cor}0d` }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold" style={{ color: t.cor }}>{t.icone} {r.nome}</span>
                              <span className="text-[9px] text-zinc-500">{membro ? `${membro.posicao} · ${membro.idade}a · OVR ${membro.ovr}` : "saiu do clube"}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mb-1.5">{t.desc(r)}</p>
                            {barra != null && (
                              <>
                                <div className="flex justify-between text-[9px] mb-0.5">
                                  <span className="text-zinc-600">{k === "parceiro" ? "Sintonia" : "Atrito"}</span>
                                  <span className="font-mono" style={{ color: t.cor }}>{Math.round(barra)}</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${barra}%`, background: t.cor }} /></div>
                              </>
                            )}
                            {k === "parceiro" && (() => { const b = bonusParceria(carreira); return (b.gols || b.assist) ? <p className="text-[9px] text-emerald-400 mt-1">+{b.gols} gols e +{b.assist} assistências por temporada graças à parceria</p> : null; })()}
                            {k === "pupilo" && membro && <p className="text-[9px] text-blue-400 mt-1">Evoluiu {membro.ovr - r.ovrInicial} de OVR sob sua asa ({r.temporadas || 0} temporada{(r.temporadas || 0) === 1 ? "" : "s"})</p>}
                            {k === "desafeto" && <p className="text-[9px] text-red-400 mt-1">−{Math.round(r.atrito * 0.07)} de moral do elenco por temporada</p>}
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setVestiarioAberto(true)} className="w-full text-[10px] text-zinc-400 border border-zinc-800 rounded-sm py-1.5 mt-2 hover:border-emerald-500">Trabalhar as relações →</button>
                  </Card>
                )}

                <Card id="painel-tecnico">
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">💪 Força do {carreira.clube.nome}</span><span className="font-bold text-zinc-200">{forcaEfetivaClube(carreira, carreira.clube)}{(carreira.investimentosClube?.[carreira.clube.nome] || 0) > 0 ? <span className="text-emerald-400"> (base {carreira.clube.forca} +{carreira.investimentosClube[carreira.clube.nome]})</span> : ""}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-blue-500" style={{ width: `${forcaEfetivaClube(carreira, carreira.clube)}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">Relação com a torcida do {carreira.clube.nome}</span><span className="font-bold" style={{ color: tTorc.cor }}>{tTorc.label} ({Math.round(getTorcida(carreira, carreira.clube.nome))})</span></div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full" style={{ width: `${getTorcida(carreira, carreira.clube.nome)}%`, background: tTorc.cor }} /></div>
                  {carreira.tecnico && (() => {
                    const est = estiloTecnico(carreira.tecnico.estilo);
                    const enc = encaixeNoEstilo(carreira);
                    return (
                      <div className="border rounded-sm p-2.5 mb-3" style={{ borderColor: `${est.cor}44`, background: `${est.cor}0d` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{carreira.tecnico.nome}</span>
                          <span className="text-[10px] font-bold" style={{ color: est.cor }}>{est.icone} {est.nome}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 italic mb-1.5">"{est.fala}"</p>
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-zinc-600">{carreira.tecnico.temporadas || 0} temporada(s) no comando · valoriza {est.valoriza.join(", ")}</span>
                        </div>
                        <div className="text-[10px] mt-1" style={{ color: enc > 3 ? "#12A876" : enc < -3 ? "#D6483F" : "#a1a1aa" }}>
                          {enc > 3 ? `✓ Seu perfil é exatamente o que ele quer (+${enc})` : enc < -3 ? `✗ Seu perfil não combina com o estilo dele (${enc})` : "○ Seu perfil não ajuda nem atrapalha no esquema dele"}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🧑‍💼 Confiança do técnico</span><span className="font-bold" style={{ color: statusNoTime(carreira.tecnicoConfianca ?? 60).cor }}>{statusNoTime(carreira.tecnicoConfianca ?? 60).label} ({Math.round(carreira.tecnicoConfianca ?? 60)})</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full" style={{ width: `${carreira.tecnicoConfianca ?? 60}%`, background: statusNoTime(carreira.tecnicoConfianca ?? 60).cor }} /></div>
                  {carreira.promessaTecnico && (() => {
                    const def = promessaPorId(carreira.promessaTecnico.id);
                    if (!def) return null;
                    return (
                      <div className="border border-amber-500/30 bg-amber-500/5 rounded-sm p-2.5 mb-3">
                        <div className="text-[9px] text-amber-400 uppercase tracking-widest mb-1">🤝 Pacto com o técnico — {def.titulo}</div>
                        <p className="text-[11px] text-zinc-300 italic mb-1">"{def.fala(carreira)}"</p>
                        <p className="text-[10px] text-zinc-500">Pra cumprir: {descreverMetaPromessa(carreira.promessaTecnico, carreira.posicao)}</p>
                      </div>
                    );
                  })()}
                  {carreira.promessaQuebradaPeloTecnico && (
                    <div className="border border-red-500/30 bg-red-500/5 rounded-sm p-2.5 mb-3">
                      <p className="text-[10px] text-red-300">⚠️ O técnico não honrou o que prometeu na temporada passada. Você tem respaldo pra cobrar — ou pra pedir pra sair sem a torcida virar contra.</p>
                    </div>
                  )}
                  {carreira.expectativa && (
                    <div className="border-t border-zinc-800 pt-3 mt-1">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">🎯 Meta da diretoria pra você</div>
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {carreira.posicao === "GOL" ? (
                          <div className="col-span-3 bg-zinc-950/40 rounded-sm p-2 text-center"><div className="font-mono text-lg font-bold">{carreira.expectativa.cleanSheets}</div><div className="text-[9px] text-zinc-500 uppercase">Jogos sem sofrer gol</div></div>
                        ) : (
                          <>
                            <div className="bg-zinc-950/40 rounded-sm p-2 text-center"><div className="font-mono text-lg font-bold">{carreira.expectativa.gols}</div><div className="text-[9px] text-zinc-500 uppercase">Gols</div></div>
                            <div className="bg-zinc-950/40 rounded-sm p-2 text-center"><div className="font-mono text-lg font-bold">{carreira.expectativa.assist}</div><div className="text-[9px] text-zinc-500 uppercase">Assist.</div></div>
                            <div className="bg-zinc-950/40 rounded-sm p-2 text-center"><div className="font-mono text-lg font-bold">{carreira.expectativa.jogos}</div><div className="text-[9px] text-zinc-500 uppercase">Jogos</div></div>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 mb-2">Pedir mais aumenta o bônus se bater a meta (e a cobrança se não bater). Pedir menos é mais seguro, mas rende menos.</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button onClick={() => negociarMeta(1)} className="p-1.5 border border-emerald-500/40 rounded-sm hover:bg-emerald-500/10 text-[10px]">📈 Mais</button>
                        <button onClick={() => negociarMeta(0)} className="p-1.5 border border-zinc-700 rounded-sm hover:bg-zinc-800 text-[10px]">➖ Padrão</button>
                        <button onClick={() => negociarMeta(-1)} className="p-1.5 border border-blue-500/40 rounded-sm hover:bg-blue-500/10 text-[10px]">📉 Menos</button>
                      </div>
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-400">💰 ${formatarDinheiro(carreira.cofre)} no cofre</div>
                </Card>

                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">⚙️ Status do atleta</div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🤝 Entrosamento com o elenco</span><span className="font-bold text-zinc-200">{Math.round(carreira.entrosamento ?? 20)}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${carreira.entrosamento ?? 20}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🥊 Disputa de posição {carreira.concorrente ? `(vs. ${carreira.concorrente.nome})` : ""}</span><span className="font-bold text-zinc-200">{Math.round(carreira.titularidade ?? 100)}% titularidade</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${carreira.titularidade ?? 100}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🧑‍🤝‍🧑 Moral do elenco</span><span className="font-bold text-zinc-200">{Math.round(carreira.elencoMoral ?? 60)}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-purple-500" style={{ width: `${carreira.elencoMoral ?? 60}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">💼 Relação com patrocinadores</span><span className="font-bold text-zinc-200">{Math.round(carreira.relacaoPatrocinadores ?? 50)}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-amber-500" style={{ width: `${carreira.relacaoPatrocinadores ?? 50}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🩺 Risco de lesão</span><span className="font-bold" style={{ color: riscoLesao(carreira.desgaste).cor }}>{riscoLesao(carreira.desgaste).label}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${clamp(((carreira.desgaste ?? 0) / 3) * 100, 4, 100)}%`, background: riscoLesao(carreira.desgaste).cor }} /></div>
                </Card>
                </div>

                <Card>
                  <button onClick={() => { setCalendarioMesAberto(janelasPorLiga(carreira.clube.liga)[0].inicioMes); setCalendarioAberto(true); }} className="w-full text-left">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-between"><span>🗓️ Calendário da temporada</span><span className="text-amber-400 text-[9px] normal-case">ver calendário completo →</span></div>
                  </button>
                  <div className="grid gap-1 text-[11px]">
                    {(carreira.clube.liga === "brasileirao" || carreira.clube.liga === "serieB") ? (
                      <>
                        {carreira.idade <= 18 && <div className="flex justify-between"><span className="text-zinc-400">🌟 Copa São Paulo (Copinha)</span><span className="text-zinc-500">janeiro</span></div>}
                        {carreira.clube.estado && <div className="flex justify-between"><span className="text-zinc-400">🗺️ {ESTADUAIS[carreira.clube.estado] || "Estadual"}</span><span className="text-zinc-500">jan–mar</span></div>}
                        <div className="flex justify-between"><span className="text-zinc-400">⚽ {LIGAS[carreira.clube.liga].nome}</span><span className="text-emerald-400">mar–dez</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400">🏆 Copa do Brasil</span><span className="text-zinc-500">fev–nov</span></div>
                        {LIGAS[carreira.clube.liga].continental === "Libertadores" && <div className="flex justify-between"><span className="text-zinc-400">🌎 Libertadores / Sul-Americana</span><span className="text-zinc-500">se classificar</span></div>}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between"><span className="text-zinc-400">🛡️ {(COMPS_PAIS[carreira.clube.liga] || {}).superCopa || "Supercopa"}</span><span className="text-zinc-500">agosto</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400">⚽ {LIGAS[carreira.clube.liga].nome}</span><span className="text-emerald-400">ago–mai</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400">🏆 {(COMPS_PAIS[carreira.clube.liga] || {}).copa || "Copa Nacional"}</span><span className="text-zinc-500">ago–mai</span></div>
                        {LIGAS[carreira.clube.liga].continental && <div className="flex justify-between"><span className="text-zinc-400">🌍 {LIGAS[carreira.clube.liga].continental}</span><span className="text-zinc-500">se classificar</span></div>}
                      </>
                    )}
                    {carreira.elegivelMundial && <div className="flex justify-between"><span className="text-zinc-400">🌐 Mundial de Clubes</span><span className="text-pink-400 font-bold">classificado!</span></div>}
                    <div className="flex justify-between"><span className="text-zinc-400">🌎 Copa do Mundo</span><span className={carreira.anosDesdeCopa === 3 ? "text-amber-400 font-bold" : "text-zinc-600"}>{carreira.anosDesdeCopa === 3 ? "ano de Copa!" : `em ${3 - (carreira.anosDesdeCopa ?? 0)} temporada(s)`}</span></div>
                  </div>
                </Card>

                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">🌎 Seleção {nacDe(carreira.nacionalidade).label}</div>
                  <div className="flex justify-between text-[11px]"><span className="text-zinc-400">Situação</span><span className="font-bold" style={{ color: statusSelecao(ovrAtual, carreira.idade, carreira.anosDesdeCopa).cor }}>{statusSelecao(ovrAtual, carreira.idade, carreira.anosDesdeCopa).label}</span></div>
                </Card>

                {carreira.contrato && (
                  <Card id="painel-contrato">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">✍️ Contrato com o {carreira.clube.nome}</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex justify-between"><span className="text-zinc-400">Restam</span><span className="font-bold text-zinc-200">{carreira.contrato.restantes} ano(s)</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400">Salário</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.salario)}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400">Multa</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.multa)}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400">Bônus/gol</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.bonusGol)}</span></div>
                    </div>
                  </Card>
                )}
                  </>
                )}

                {decisao && !decisao.done && (
                  <PopupOverlay>
                    <Card className="border-amber-500/40">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BallIcon size={14} />{decisao.titulo}</div>
                      <p className="text-sm mb-4">{decisao.texto}</p>
                      {decisao.mira === "penalti" ? <GoalMini onPick={resolverPenaltiDecisao} resultado={null} />
                        : decisao.mira === "falta" ? <FreeKickMini onPick={resolverFaltaDecisao} resultado={null} />
                        : decisao.mira === "passe" ? <PasseMini atributoPasse={carreira.attrs.passe} onResultado={resolverPasseDecisao} />
                        : <div className="grid gap-2">{decisao.opts.map((o, i) => <Button key={i} variant="ghost" onClick={() => escolherDecisao(o)}>{o.label}</Button>)}</div>}
                    </Card>
                  </PopupOverlay>
                )}
                {decisao && decisao.done && (
                  <PopupOverlay>
                    <Card className="border-amber-500/40">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">{decisao.titulo}</div>
                      {decisao.mira === "penalti" && decisaoResultado?.zona && <GoalMini onPick={() => {}} resultado={decisaoResultado} />}
                      {decisao.mira === "falta" && decisaoResultado?.zona && <FreeKickMini onPick={() => {}} resultado={decisaoResultado} />}
                      {decisao.mira === "passe" && decisaoResultado?.tipoPasse && (
                        <PasseMini atributoPasse={carreira.attrs.passe} onResultado={() => {}} cenaForcada={decisaoResultado.cena} alvoForcado={decisaoResultado.companheiro} resultadoForcado={decisaoResultado.r} />
                      )}
                      <p className="text-sm mb-4">{decisaoResultado?.txt || (decisaoResultado?.gol ? "GOL! A torcida explode." : "Isso vai repercutir na temporada.")}</p>
                      <Button onClick={fecharDecisao}>Seguir a temporada</Button>
                    </Card>
                  </PopupOverlay>
                )}

                {treinoDesafio && (
                  <PopupOverlay>
                    <Card className="text-center border-emerald-500/40">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">Treino de {ATTR_SLOTS.find((s) => s.id === treinoDesafio.attrId).label}</div>
                      {treinoDesafio.minigame === "penalti" ? (
                        <>
                          <p className="text-xs text-zinc-400 mb-2">Sessão de cobranças — converta pra afinar a finalização.</p>
                          <GoalMini resultado={treinoResultado} onPick={(zona) => {
                            const gol = Math.random() < clamp((carreira.attrs.finalizacao - 30) / 75 + somaEfeitoInsignia(carreira, "minigame"), 0.2, 0.95);
                            setTreinoResultado({ zona, gol });
                            setTimeout(() => { setTreinoResultado(null); resolverTreino(gol); }, 1400);
                          }} />
                        </>
                      ) : treinoDesafio.minigame === "falta" ? (
                        <>
                          <p className="text-xs text-zinc-400 mb-2">Sessão de bola parada — acertar afia a técnica.</p>
                          <FreeKickMini resultado={treinoResultado} onPick={(zona) => {
                            const gol = Math.random() < clamp((carreira.attrs.drible - 30) / 85 + somaEfeitoInsignia(carreira, "minigame"), 0.15, 0.9);
                            setTreinoResultado({ zona, gol, tipo: tipoResultadoFalta(gol, zona) });
                            setTimeout(() => { setTreinoResultado(null); resolverTreino(gol); }, 1500);
                          }} />
                        </>
                      ) : treinoDesafio.minigame === "passe" ? (
                        <>
                          <p className="text-xs text-zinc-400 mb-2">Treino de saída de bola — ache o companheiro livre.</p>
                          <PasseMini atributoPasse={carreira.attrs.passe} onResultado={(r) => { setTimeout(() => resolverTreino(r.gol), 1400); }} />
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-zinc-400 mb-3">Clique em "Parar" quando o marcador estiver na zona verde.</p>
                          <TimingBar onResult={(acerto) => resolverTreino(acerto)} duracao={1000} label="Parar" />
                        </>
                      )}
                    </Card>
                  </PopupOverlay>
                )}

                {pendingAbordagem && (
                  <PopupOverlay>
                    <Card className="border-blue-500/40">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Abordagem da temporada {temporadaLabel(carreira.idade, ANO_INICIO)}</div>
                      <p className="text-sm mb-4">Como você encara essa temporada?</p>
                      <div className="grid gap-2">
                        <button onClick={() => escolherAbordagem("dedicado")} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500">
                          <div className="font-bold text-sm">🧘 Dedicar-se ao longo do ano</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">Rendimento mais constante e se recupera melhor — mas joga um pouco menos.</div>
                        </button>
                        <button onClick={() => escolherAbordagem("limite")} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-red-500">
                          <div className="font-bold text-sm">🔥 Sempre no limite</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">Pede pra jogar todos os jogos do ano — mais números, mais risco de lesão.</div>
                        </button>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {pendingColetiva && (
                  <PopupOverlay>
                    <Card padded={false} className="border-amber-500/40 overflow-hidden">
                      <div className="relative h-20" style={{ background: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0%, transparent 8%), radial-gradient(circle at 55% 60%, rgba(255,255,255,0.28) 0%, transparent 6%), radial-gradient(circle at 80% 25%, rgba(255,255,255,0.3) 0%, transparent 7%), radial-gradient(circle at 35% 80%, rgba(255,255,255,0.2) 0%, transparent 6%), linear-gradient(180deg, #26210f 0%, #171308 100%)` }}>
                        <div className="absolute bottom-2 left-5 text-[10px] text-amber-400 uppercase tracking-widest font-sport font-bold">🎙️ Coletiva de Imprensa</div>
                      </div>
                      <div className="p-5">
                      <p className="text-sm mb-1">Os jornalistas esperam sua fala antes da temporada. Qual tom você usa?</p>
                      <p className="text-[10px] text-zinc-500 mb-3">Toda declaração tem preço — o que agrada um lado costuma irritar outro.</p>
                      <div className="grid gap-1.5">
                        {TONS_COLETIVA.map((t) => {
                          const rotulos = { torcida: "Torcida", elenco: "Elenco", tecnicoConfianca: "Técnico", diretoria: "Diretoria", calorMidia: "Pressão", fama: "Fama" };
                          const itens = Object.entries(t.efeito).filter(([, v]) => v);
                          return (
                            <button key={t.id} onClick={() => resolverColetiva(t)} className="text-left px-3 py-2.5 rounded-sm border border-zinc-800 hover:border-amber-500 transition-all">
                              <div className="text-xs font-bold">{t.icone} {t.label}</div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">{t.desc}</div>
                              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                                {itens.map(([k, v]) => {
                                  const ruim = k === "calorMidia" ? v > 0 : v < 0;
                                  return <span key={k} className={`text-[9px] font-mono ${ruim ? "text-red-400" : "text-emerald-400"}`}>{rotulos[k] || k} {v > 0 ? "+" : ""}{v}</span>;
                                })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {pendingTecnico && (
                  <PopupOverlay>
                    <Card className="border-blue-500/40">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">🧑‍💼 {pendingTecnico.titulo}</div>
                      <p className="text-sm mb-4">{pendingTecnico.texto}</p>
                      <div className="grid gap-2">{pendingTecnico.opts.map((o, i) => <Button key={i} variant="ghost" onClick={() => resolverPedidoTecnico(o)}>{o.label}</Button>)}</div>
                    </Card>
                  </PopupOverlay>
                )}

                {pendingCompeticao && !competicaoResultado && (
                  <PopupOverlay>
                    <Card className="border-amber-500/40 text-center">
                      <div className="text-3xl mb-2">{pendingCompeticao.tipo === "copaDoMundo" ? "🌎" : pendingCompeticao.tipo === "estadual" ? "🗺️" : pendingCompeticao.tipo === "copaNacional" ? "🇧🇷" : pendingCompeticao.tipo === "ligaTitulo" ? "🏆" : pendingCompeticao.tipo === "lesao" ? "🩹" : pendingCompeticao.tipo === "golaco" ? "🎇" : pendingCompeticao.tipo === "classico" ? "🔥" : pendingCompeticao.tipo === "falta" ? "⚡" : "⚽"}</div>
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">
                        {pendingCompeticao.tipo === "copaDoMundo" && `Copa do Mundo — ${labelFaseCopaMundo(pendingCompeticao)}${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "continental" && `${competicaoCtx?.card?.continentalPendente?.nome} — ${competicaoCtx?.card?.continentalPendente?.estagio === "final" ? "Final" : competicaoCtx?.card?.continentalPendente?.estagio === "quartas" ? "Quartas de Final" : "Semifinal"}${competicaoCtx?.card?.continentalPendente?.adversario ? ` x ${competicaoCtx.card.continentalPendente.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "copaNacional" && `Copa Nacional — ${labelFaseGenerica(pendingCompeticao)}${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "copinha" && `Copa São Paulo — ${labelFaseGenerica(pendingCompeticao)}${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "estadual" && `${ESTADUAIS[carreira.clube.estado] || "Campeonato Estadual"} — ${labelFaseGenerica(pendingCompeticao)}${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "ligaTitulo" && `${competicaoCtx?.card?.ligaNome} — Rodada decisiva`}
                        {pendingCompeticao.tipo === "lesao" && "Departamento médico"}
                        {pendingCompeticao.tipo === "golaco" && "Lance da temporada"}
                        {pendingCompeticao.tipo === "classico" && `Clássico decisivo${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                        {pendingCompeticao.tipo === "falta" && `Falta perigosa${pendingCompeticao.adversario ? ` x ${pendingCompeticao.adversario}` : ""}`}
                      </div>
                      <p className="text-xs text-zinc-400 mb-4">
                        {pendingCompeticao.tipo === "copaDoMundo" && `${nacDe(carreira.nacionalidade).label} entra em campo — ${labelFaseCopaMundo(pendingCompeticao)}. Escolha o canto e decida o lance.`}
                        {pendingCompeticao.tipo === "continental" && "Momento decisivo da eliminatória — tudo pode mudar com uma cobrança."}
                        {pendingCompeticao.tipo === "copaNacional" && `Mata-mata nacional — ${labelFaseGenerica(pendingCompeticao)}. Escolha o canto e decida o lance.`}
                        {pendingCompeticao.tipo === "copinha" && `Copa São Paulo pelo ${carreira.clube.nome} — ${labelFaseGenerica(pendingCompeticao)}. Escolha o canto e decida o lance.`}
                        {pendingCompeticao.tipo === "estadual" && `${carreira.clube.nome} disputa o estadual — ${labelFaseGenerica(pendingCompeticao)}. Escolha o canto e decida o lance.`}
                        {pendingCompeticao.tipo === "ligaTitulo" && "Último lance da última rodada — o título pode estar em jogo."}
                        {pendingCompeticao.tipo === "lesao" && "Você se lesionou durante a temporada. Como conduzir a recuperação?"}
                        {pendingCompeticao.tipo === "golaco" && "Espaço livre pra tentar algo diferente — vai encarar?"}
                        {pendingCompeticao.tipo === "classico" && "O maior clássico da temporada está embolado — sua torcida espera por você."}
                        {pendingCompeticao.tipo === "falta" && "Falta na entrada da área, barreira armada — escolha o canto e mande a bola no ângulo."}
                      </p>
                      {pendingCompeticao.tipo === "lesao" && (
                        <div className="grid gap-2">
                          <Button variant="ghost" onClick={() => resolverDecisaoLesao("rapido")}>⚡ Voltar rápido (arriscado)</Button>
                          <Button variant="ghost" onClick={() => resolverDecisaoLesao("protocolo")}>🩺 Seguir o protocolo médico (seguro)</Button>
                        </div>
                      )}
                      {pendingCompeticao.tipo === "golaco" && (
                        <div className="grid gap-2">
                          <Button variant="ghost" onClick={() => resolverGolaco("bicicleta")}>🤸 Bicicleta</Button>
                          <Button variant="ghost" onClick={() => resolverGolaco("drible")}>🌀 Driblar o goleiro</Button>
                          <Button variant="ghost" onClick={() => resolverGolaco("cavadinha")}>🎯 Cavadinha</Button>
                        </div>
                      )}
                      {pendingCompeticao.tipo === "copaDoMundo" && (
                        !copaMundoTentativa ? (
                          <GoalMini onPick={baterFaseCopaMundo} resultado={null} />
                        ) : (
                          <>
                            <GoalMini onPick={() => {}} resultado={copaMundoTentativa} />
                            <p className="text-sm mb-4">{copaMundoTentativa.gol ? "Aproveitou o momento! A seleção avança." : copaMundoTentativa.tipo === "Defesa" ? "O goleiro pegou — momento não aproveitado." : "Chutou pra fora — momento não aproveitado."}</p>
                            <Button variant="gold" onClick={continuarFaseCopaMundo}>Continuar</Button>
                          </>
                        )
                      )}
                      {["estadual", "copaNacional", "copinha"].includes(pendingCompeticao.tipo) && (
                        !copaMundoTentativa ? (
                          <GoalMini onPick={baterFaseGenerica} resultado={null} />
                        ) : (
                          <>
                            <GoalMini onPick={() => {}} resultado={copaMundoTentativa} />
                            <p className="text-sm mb-4">{copaMundoTentativa.gol ? "Aproveitou o momento! O time avança." : copaMundoTentativa.tipo === "Defesa" ? "O goleiro pegou — momento não aproveitado." : "Chutou pra fora — momento não aproveitado."}</p>
                            <Button variant="gold" onClick={continuarFaseGenerica}>Continuar</Button>
                          </>
                        )
                      )}
                      {!["lesao", "golaco", "copaDoMundo", "estadual", "copaNacional", "copinha"].includes(pendingCompeticao.tipo) && <GoalMini onPick={resolverDecisaoCompeticao} resultado={null} />}
                    </Card>
                  </PopupOverlay>
                )}
                {competicaoResultado && (
                  <PopupOverlay>
                    {competicaoResultado.epico ? (
                      <Card padded={false} className={`overflow-hidden text-center ${competicaoResultado.venceu ? "border-amber-400/60" : "border-zinc-600/60"}`}>
                        <div className="relative h-24" style={{
                          background: competicaoResultado.venceu
                            ? `radial-gradient(circle at 20% 30%, rgba(255,210,110,0.4) 0%, transparent 8%), radial-gradient(circle at 55% 55%, rgba(255,255,255,0.3) 0%, transparent 6%), radial-gradient(circle at 80% 30%, rgba(255,210,110,0.35) 0%, transparent 7%), linear-gradient(180deg, #3a2a08 0%, #1a1306 100%)`
                            : `linear-gradient(180deg, #232527 0%, #131415 100%)`,
                        }}>
                          <div className="absolute inset-0 flex items-center justify-center text-4xl">{competicaoResultado.icone}</div>
                          {competicaoResultado.venceu && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
                        </div>
                        <div className="p-5">
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-sport mb-1">📰 Edição especial · {competicaoResultado.nomeCompeticao}</div>
                          <div className={`display font-bold text-lg leading-tight mb-2 ${competicaoResultado.venceu ? "text-amber-400" : "text-zinc-400"}`}>{competicaoResultado.titulo}</div>
                          <p className="text-xs text-zinc-400 mb-3">{competicaoResultado.texto}</p>
                          <div className="grid grid-cols-2 gap-2 text-[10px] mb-4 border-t border-b border-white/10 py-2">
                            <div><div className="text-zinc-500 uppercase tracking-widest">Artilheiro do torneio</div><div className="font-bold text-zinc-200">{pick(RIVAIS_PREMIO)}</div></div>
                            <div><div className="text-zinc-500 uppercase tracking-widest">Melhor jogador</div><div className="font-bold text-zinc-200">{competicaoResultado.venceu ? (nome || "Você") : carreira.rivalPosicao}</div></div>
                          </div>
                          <Button onClick={avancarFilaCompeticoes}>Continuar</Button>
                        </div>
                      </Card>
                    ) : (
                      <Card className="border-emerald-500/40 text-center">
                        <div className="text-3xl mb-2">{competicaoResultado.icone}</div>
                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">{competicaoResultado.titulo}</div>
                        <p className="text-sm mb-4">{competicaoResultado.texto}</p>
                        <Button onClick={avancarFilaCompeticoes}>Continuar</Button>
                      </Card>
                    )}
                  </PopupOverlay>
                )}

                {pendingLegendFollow && (
                  <PopupOverlay>
                    <Card className="border-purple-500/40 text-center">
                      <div className="text-3xl mb-2">⭐</div>
                      <p className="text-sm mb-4"><strong>{pendingLegendFollow}</strong> começou a te seguir!</p>
                      <div className="grid gap-2">
                        <Button variant="gold" onClick={() => resolverLegendFollow(true)}>Seguir de volta</Button>
                        <Button variant="ghost" onClick={() => resolverLegendFollow(false)}>Ignorar por agora</Button>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {pendingSponsor && (
                  <PopupOverlay>
                    <Card className="border-emerald-500/40">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">💼 Proposta de patrocínio</div>
                      <div className="font-bold text-sm mb-1">{pendingSponsor.marca}</div>
                      <p className="text-sm mb-4">{pendingSponsor.texto}</p>
                      <div className="grid gap-2">
                        <Button variant="gold" onClick={() => resolverOfertaPatrocinio(true)}>Aceitar</Button>
                        <Button variant="ghost" onClick={() => resolverOfertaPatrocinio(false)}>Recusar, esperar algo melhor</Button>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {pendingTierUpgrade && (
                  <PopupOverlay>
                    <div className="text-center animate-[popIn_0.4s_ease-out]">
                      <div className="relative mx-auto mb-4" style={{ width: 140, height: 180 }}>
                        <div className="absolute inset-0 rounded-lg animate-[packShine_1.4s_ease-in-out_infinite]" style={{ background: `radial-gradient(circle, ${pendingTierUpgrade.tier.cor}88, transparent 70%)` }} />
                        <div className="absolute inset-2 rounded-lg border-2 flex items-center justify-center text-5xl" style={{ borderColor: pendingTierUpgrade.tier.cor, background: "linear-gradient(160deg,#18181b,#000)" }}>💎</div>
                      </div>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: pendingTierUpgrade.tier.cor }}>Sua joia evoluiu!</div>
                      <div className="display text-2xl font-black mb-4" style={{ color: pendingTierUpgrade.tier.cor }}>{pendingTierUpgrade.tier.label}</div>
                      <Button variant="gold" onClick={fecharTierUpgrade}>Revelar temporada</Button>
                    </div>
                  </PopupOverlay>
                )}
                {jogadorCardAberto && (
                  <PopupOverlay onClose={() => setJogadorCardAberto(false)}>
                    <div className="flex justify-center">
                      <JogadorCard attrs={carreira.attrs} posicao={posicao} papelTatico={PAPEIS_TATICOS.find((p) => p.id === (carreira.papelTatico || "padrao"))?.label} ovr={ovrAtual} />
                    </div>
                    <Card className="mt-2">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3">Atributos — evolução na temporada</div>
                      <AttrBarDelta label="VEL" value={carreira.attrs.velocidade} anterior={carreira.attrsAnteriores?.velocidade} />
                      <AttrBarDelta label="FIN" value={carreira.attrs.finalizacao} anterior={carreira.attrsAnteriores?.finalizacao} posicao={carreira.posicao} />
                      <AttrBarDelta label="PAS" value={carreira.attrs.passe} anterior={carreira.attrsAnteriores?.passe} />
                      <AttrBarDelta label="DRI" value={carreira.attrs.drible} anterior={carreira.attrsAnteriores?.drible} posicao={carreira.posicao} />
                      <AttrBarDelta label="DEF" value={carreira.attrs.defesa} anterior={carreira.attrsAnteriores?.defesa} posicao={carreira.posicao} />
                      <AttrBarDelta label="FIS" value={carreira.attrs.fisico} anterior={carreira.attrsAnteriores?.fisico} />
                    </Card>
                    <div className="mt-3"><Button variant="ghost" onClick={() => setJogadorCardAberto(false)}>Fechar</Button></div>
                  </PopupOverlay>
                )}

                {pendingLanceJogo && (
                  <PopupOverlay>
                    <Card className="border-amber-500/40 text-center">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">⚡ Lance-chave x {pendingLanceJogo.adversario}</div>
                      {pendingLanceJogo.contexto && (() => {
                        const ctx = pendingLanceJogo.contexto;
                        const aj = ajustesDoContexto(ctx);
                        const cor = ctx.peso >= 3 ? "#D6483F" : ctx.peso === 2 ? "#f59e0b" : "#a1a1aa";
                        return (
                          <div className="rounded-sm border px-3 py-2.5 mb-3 text-left" style={{ borderColor: `${cor}55`, background: `${cor}12` }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: cor }}>{aj.rotulo}</span>
                              <span className="font-stat font-black text-sm">{ctx.golsMeu} <span className="text-zinc-600">x</span> {ctx.golsAdv}</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 leading-snug">{ctx.texto}</p>
                            {ctx.peso >= 3 && <p className="text-[9px] mt-1.5" style={{ color: cor }}>Acertar aqui vale o dobro em fama e torcida — errar também pesa.</p>}
                          </div>
                        );
                      })()}
                      {pendingLanceJogo.tipoLance === "texto" && (
                        <>
                          <p className="text-xs text-zinc-400 mb-3">O que você faz?</p>
                          <div className="grid gap-1.5">
                            {(LANCES_POR_POSICAO[POS_GRUPO[carreira.posicao] || "MEI"]).map((op) => (
                              <Button key={op.id} variant="ghost" onClick={() => resolverLanceJogo(op)}>{op.label}</Button>
                            ))}
                          </div>
                        </>
                      )}
                      {pendingLanceJogo.tipoLance === "falta" && (
                        <>
                          <p className="text-xs text-zinc-400 mb-3">Falta na entrada da área no momento decisivo!</p>
                          {!lanceMiniResultado ? <FreeKickMini onPick={escolherZonaLanceFalta} resultado={null} /> : (
                            <>
                              <FreeKickMini onPick={() => {}} resultado={{ zona: lanceMiniResultado.zona, gol: lanceMiniResultado.gol, tipo: lanceMiniResultado.tipoResultado }} />
                              <p className="text-sm mb-3">{lanceMiniResultado.gol ? "⚽ GOL!" : lanceMiniResultado.tipoResultado === "Barreira" ? "🧱 Na barreira!" : lanceMiniResultado.tipoResultado === "Defesa" ? "🧤 Defendeu!" : lanceMiniResultado.tipoResultado === "Trave" ? "🥅 Na trave!" : "❌ Pra fora!"}</p>
                              <Button variant="gold" onClick={continuarLanceFalta}>Continuar</Button>
                            </>
                          )}
                        </>
                      )}
                      {pendingLanceJogo.tipoLance === "passe" && (
                        <>
                          <p className="text-xs text-zinc-400 mb-3">Contra-ataque no momento decisivo — encontre o companheiro livre!</p>
                          {!lanceMiniResultado ? <PasseMini atributoPasse={carreira.attrs.passe} onResultado={escolherLancePasse} /> : (
                            <>
                              <PasseMini atributoPasse={carreira.attrs.passe} onResultado={() => {}} cenaForcada={lanceMiniResultado.cena} alvoForcado={lanceMiniResultado.companheiro} resultadoForcado={lanceMiniResultado.r} />
                              <p className="text-sm mb-3">{lanceMiniResultado.r.gol ? "✅ Passe certeiro!" : "🚫 Interceptado!"}</p>
                              <Button variant="gold" onClick={continuarLancePasse}>Continuar</Button>
                            </>
                          )}
                        </>
                      )}
                    </Card>
                  </PopupOverlay>
                )}


                {awardsPopup && (
                  <PopupOverlay>
                    <Card className="border-amber-500/40" key={awardsPopup.slide}>
                      {awardsPopup.slide === 2 && (awardsPopup.registro.premios.some((p) => p.nome === "BOLA DE OURO" && p.doJogador) || awardsPopup.registro.titulosLista.length > 0) && <Confetti />}
                      <div className="flex justify-center gap-1 mb-3">{[0, 1, 2].map((i) => <div key={i} className={`h-1 w-8 rounded-full ${i <= awardsPopup.slide ? "bg-amber-400" : "bg-zinc-800"}`} />)}</div>
                      <div className="animate-[popIn_0.3s_ease-out]">
                        {awardsPopup.slide === 0 && (
                          <>
                            <div className="text-center mb-3 flex flex-col items-center gap-1"><TrophyIcon tipo={awardsPopup.registro.campeaoLiga ? "ouro" : "liga"} size={34} /><div className="text-[10px] text-amber-400 uppercase tracking-widest">Temporada {awardsPopup.registro.temporadaLabel}</div></div>
                            <div className="text-center text-sm mb-1">{awardsPopup.registro.clube}</div>
                            <div className="text-center display text-3xl font-black mb-2" style={{ color: awardsPopup.registro.campeaoLiga ? "#D8B44A" : "#12A876" }}>{awardsPopup.registro.posLiga}º</div>
                            <div className="text-center text-xs text-zinc-400 mb-3">n{awardsPopup.registro.ligaNome === "Premier League" ? "a" : "o"} {awardsPopup.registro.ligaNome}{awardsPopup.registro.campeaoLiga ? " — CAMPEÃO!" : ""}</div>
                            {awardsPopup.registro.continental && <div className="text-center text-xs text-zinc-400">{awardsPopup.registro.continental.nome}: <strong>{awardsPopup.registro.continental.resultado}</strong></div>}
                            {awardsPopup.registro.copaNacional && <div className="text-center text-xs text-zinc-400">Copa Nacional: <strong>{awardsPopup.registro.copaNacional.resultado}</strong></div>}
                            {awardsPopup.registro.estadual && <div className="text-center text-xs text-zinc-400">{awardsPopup.registro.estadual.nome}: <strong>{awardsPopup.registro.estadual.resultado}</strong></div>}
                            {awardsPopup.registro.copinhaCarreira && <div className="text-center text-xs text-zinc-400">{awardsPopup.registro.copinhaCarreira.nome}: <strong>{awardsPopup.registro.copinhaCarreira.resultado}</strong></div>}
                            {awardsPopup.registro.copa && <div className="text-center text-xs text-blue-400 mt-1">Copa do Mundo: <strong>{awardsPopup.registro.copa.resultado}</strong></div>}
                          </>
                        )}
                        {awardsPopup.slide === 1 && (
                          <>
                            <div className="text-center mb-3 flex flex-col items-center gap-1"><span className="text-3xl">⚽</span><div className="text-[10px] text-amber-400 uppercase tracking-widest">Artilharia e desempenho</div></div>
                            <div className="text-center text-sm mb-1">Artilheiro d{awardsPopup.registro.ligaNome === "Premier League" ? "a" : "o"} {awardsPopup.registro.ligaNome}</div>
                            <div className="text-center display text-2xl font-black mb-1" style={{ color: awardsPopup.registro.jogadorArtilheiro ? "#D8B44A" : "#e5e5e5" }}>{awardsPopup.registro.artilheiro.nome}</div>
                            <div className="text-center text-xs text-zinc-400 mb-3">{awardsPopup.registro.artilheiro.gols} gols{awardsPopup.registro.jogadorArtilheiro ? " 👑" : ""}</div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div><div className="font-mono text-lg font-bold">{awardsPopup.registro.jogos}</div><div className="text-[9px] text-zinc-500 uppercase">Jogos</div></div>
                              <div><div className="font-mono text-lg font-bold">{awardsPopup.registro.gols}</div><div className="text-[9px] text-zinc-500 uppercase">Gols</div></div>
                              <div><div className="font-mono text-lg font-bold">{awardsPopup.registro.nota}</div><div className="text-[9px] text-zinc-500 uppercase">Nota média</div></div>
                            </div>
                          </>
                        )}
                        {awardsPopup.slide === 2 && (
                          <>
                            <div className="text-center mb-3 flex flex-col items-center gap-1"><TrophyIcon tipo="ouro" size={30} /><div className="text-[10px] text-amber-400 uppercase tracking-widest">Premiações & finanças</div></div>
                            {awardsPopup.registro.premios.some((p) => p.nome === "BOLA DE OURO") && (
                              <div className="bg-zinc-950/40 rounded-sm p-2 mb-3">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 text-center">Shortlist da Bola de Ouro</div>
                                <div className="flex justify-center gap-3 text-[10px] text-zinc-400">
                                  <span>1️⃣ {awardsPopup.registro.premios.find((p) => p.nome === "BOLA DE OURO").vencedor}</span>
                                  <span>2️⃣ {carreira.rivalPosicao}</span>
                                  <span>3️⃣ {pick(RIVAIS_PREMIO)}</span>
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-zinc-300 space-y-2 mb-3">
                              {awardsPopup.registro.premios.length === 0 && <div className="text-zinc-500 text-center">Nenhuma premiação individual pra você nessa temporada.</div>}
                              {awardsPopup.registro.premios.map((p, i) => (
                                <div key={i} className={`flex items-start gap-2 ${p.doJogador ? "text-amber-400 font-bold" : ""}`}>
                                  <TrophyIcon tipo={p.bolaDeOuro ? "ouro" : p.nome.includes("Prata") ? "prata" : "bronze"} size={16} />
                                  <span>{p.nome}: <strong>{p.vencedor}</strong>{p.doJogador ? " — É VOCÊ!" : ""}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-center border-t border-zinc-800 pt-2 text-xs text-emerald-400">💰 Salário recebido: ${formatarDinheiro(awardsPopup.registro.salario)} · Cofre: ${formatarDinheiro(carreira.cofre)}</div>
                          </>
                        )}
                      </div>
                      <div className="mt-4"><Button onClick={avancarAwardsPopup}>{awardsPopup.slide < 2 ? "Próximo" : "Continuar"}</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {janela && (
                  <PopupOverlay>
                    <Card>
                      {janela.tipo === "empresario" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-3">💼 Reunião com o empresário</div>
                          <div className="grid gap-1.5 mb-4">
                            <button onClick={() => abrirTransferencias("normal")} disabled={carreira.empresarioUsado?.normal} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500 disabled:opacity-40"><div className="font-bold text-sm">Pedir transferência{carreira.empresarioUsado?.normal ? " (já pedido nessa temporada)" : ""}</div><div className="text-[11px] text-zinc-500">Escolher ligas e ver quem topa te contratar.</div></button>
                            <button onClick={() => abrirTransferencias("emprestimo")} disabled={carreira.empresarioUsado?.emprestimo} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500 disabled:opacity-40"><div className="font-bold text-sm">Pedir empréstimo{carreira.empresarioUsado?.emprestimo ? " (já pedido nessa temporada)" : ""}</div><div className="text-[11px] text-zinc-500">1 ou 2 temporadas fora, com opção de compra definitiva depois.</div></button>
                            <button onClick={() => abrirTransferencias("sair")} disabled={carreira.empresarioUsado?.sair} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-red-500 disabled:opacity-40"><div className="font-bold text-sm">Pedir para sair{carreira.empresarioUsado?.sair ? " (já pedido nessa temporada)" : ""}</div><div className="text-[11px] text-zinc-500 text-red-400/80">Perde moral com a torcida do {carreira.clube.nome}, mas força a saída — clubes de nível igual ou pior aparecem.</div></button>
                            {carreira.clubeCoracao && carreira.clube.nome !== carreira.clubeCoracao.nome && (
                              carreira.idade >= 29
                                ? <button onClick={() => abrirTransferencias("coracao")} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500"><div className="font-bold text-sm">Pedir clube do coração</div><div className="text-[11px] text-zinc-500">{carreira.clubeCoracao.nome}</div></button>
                                : <div className="p-3 border border-zinc-800 rounded-sm opacity-40"><div className="font-bold text-sm">🔒 Clube do coração</div><div className="text-[11px] text-zinc-500">Disponível a partir dos 29 anos.</div></div>
                            )}
                            {ovrAtual >= 84 && <button onClick={() => abrirTransferencias("tentadora")} className="text-left p-3 border border-amber-500/40 rounded-sm hover:border-amber-400 bg-amber-500/5"><div className="font-bold text-sm">✨ Proposta tentadora</div><div className="text-[11px] text-zinc-500">Uma chance de dinheiro alto batendo à porta.</div></button>}
                          </div>
                          {(carreira.clubesInteresse || []).length > 0 && (
                            <div className="border-t border-zinc-800 pt-3 mb-3">
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Clubes de olho em você</div>
                              <div className="flex flex-wrap gap-1.5">{carreira.clubesInteresse.map((nomeC, i) => { const cl = CLUBES.find((x) => x.nome === nomeC); return cl ? <span key={i} className="text-[10px] px-2 py-1 rounded-sm border border-zinc-800 flex items-center gap-1"><ClubDot club={cl} size={12} />{nomeC}</span> : null; })}</div>
                            </div>
                          )}
                          <Button variant="ghost" onClick={() => setJanela(null)}>Fechar</Button>
                        </>
                      )}
                      {janela.tipo === "reuniaoDiretoria" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">🏛️ Reunião com a diretoria</div>
                          <p className="text-xs text-zinc-500 mb-3">Escolha uma exigência pra levar à mesa — a diretoria pode aceitar ou não, dependendo da sua relação com o clube.</p>
                          <div className="grid gap-2">{PEDIDOS_DIRETORIA.map((opt, i) => <button key={i} onClick={() => pedirDiretoria(opt)} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-amber-500 text-sm capitalize">{opt.label}</button>)}</div>
                        </>
                      )}
                      {janela.tipo === "contrato" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ClubDot club={janela.opEscolhida.clube} size={20} />Negociação com o {janela.opEscolhida.clube.nome}</div>
                          <div className="grid gap-2 mb-2">
                            {janela.pacotes.map((p, i) => (
                              <button key={i} onClick={() => confirmarContrato(p)} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500">
                                <div className="font-bold text-sm mb-1">{p.label} · {p.anos} anos</div>
                                <div className="text-[11px] text-zinc-400 grid grid-cols-3 gap-1">
                                  <span>💰 ${formatarDinheiro(p.salario)}/ano</span>
                                  <span>⚖️ multa ${formatarDinheiro(p.multa)}</span>
                                  <span>⚽ +${formatarDinheiro(p.bonusGol)}/gol</span>
                                </div>
                              </button>
                            ))}
                          </div>
                          <Button variant="ghost" onClick={() => setJanela({ tipo: "empresario" })}>← Voltar</Button>
                        </>
                      )}
                      {janela.tipo === "ligas" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">Empresário — quais ligas buscar?</div>
                          <div className="grid gap-1.5 mb-4">
                            {ligasOrdenadas().map(([k, l]) => (
                              <button key={k} onClick={() => toggleLigaSelecionada(k)} className={`text-left px-3 py-2 text-xs rounded-sm border ${janela.ligasSelecionadas.includes(k) ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800"}`}>{l.nome}</button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="ghost" onClick={() => setJanela({ tipo: "empresario" })}>← Voltar</Button>
                            <Button onClick={confirmarBuscaLigas}>Buscar propostas</Button>
                          </div>
                        </>
                      )}
                      {janela.tipo === "duracaoEmprestimo" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">Empréstimo — por quanto tempo?</div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <Button variant="ghost" onClick={() => escolherDuracaoEmprestimo(1)}>1 temporada</Button>
                            <Button variant="ghost" onClick={() => escolherDuracaoEmprestimo(2)}>2 temporadas</Button>
                          </div>
                          <Button variant="ghost" onClick={() => setJanela({ tipo: "empresario" })}>← Voltar</Button>
                        </>
                      )}
                      {janela.tipo === "clausula" && (
                        <>
                          <div className="text-[10px] text-red-400 uppercase tracking-widest mb-2">⚡ Cláusula de rescisão ativada</div>
                          <div className="flex items-center gap-3 mb-3">
                            <ClubDot club={janela.clausula.clube} size={34} />
                            <div>
                              <div className="text-base font-bold">{janela.clausula.clube.nome}</div>
                              <div className="text-[10px] text-zinc-500">{LIGAS[janela.clausula.clube.liga].nome} · força {janela.clausula.clube.forca}</div>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                            O <strong>{janela.clausula.clube.nome}</strong> depositou os <strong className="text-amber-400">${formatarDinheiro(janela.clausula.valorPago)}</strong> da sua multa rescisória. O {carreira.clube.nome} <strong>não pode impedir</strong> — a decisão é só sua.
                          </p>
                          {janela.clausula.pechincha && (
                            <p className="text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/5 rounded-sm px-2 py-1.5 mb-3">
                              💡 Sua multa ({formatarDinheiro(janela.clausula.valorPago)}) está abaixo do seu valor de mercado (${formatarDinheiro(janela.clausula.valorMercado)}). Eles fizeram um ótimo negócio — e você deixou essa brecha na última negociação de contrato.
                            </p>
                          )}
                          <div className="grid gap-1.5">
                            <button onClick={() => decidirClausula(true)} className="text-left px-3 py-2.5 rounded-sm border border-emerald-500/40 hover:bg-emerald-500/10">
                              <div className="text-xs font-bold text-emerald-400">✈️ Aceitar e assinar com o {janela.clausula.clube.nome}</div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">Você escolhe o pacote de contrato na sequência. A torcida atual não vai gostar.</div>
                            </button>
                            <button onClick={() => decidirClausula(false)} className="text-left px-3 py-2.5 rounded-sm border border-blue-500/40 hover:bg-blue-500/10">
                              <div className="text-xs font-bold text-blue-400">🛡️ Recusar e ficar no {carreira.clube.nome}</div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">+14 torcida, +12 diretoria, +6 elenco. Vira gesto de lealdade e entra na sua história.</div>
                            </button>
                          </div>
                        </>
                      )}

                      {janela.tipo === "compraDefinitiva" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ClubDot club={janela.ofertaCompra.clube} size={20} />Oferta de compra definitiva</div>
                          <p className="text-sm mb-4">O {janela.ofertaCompra.clube.nome} quer bancar a compra definitiva do seu passe, encerrando o vínculo com o {janela.ofertaCompra.origem.nome}.</p>
                          <div className="grid gap-2"><Button variant="gold" onClick={() => decidirCompraDefinitiva(true)}>Aceitar e ficar</Button><Button variant="ghost" onClick={() => decidirCompraDefinitiva(false)}>Recusar e voltar ao {janela.ofertaCompra.origem.nome}</Button></div>
                        </>
                      )}
                      {janela.tipo === "numeroTransfer" && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ClubDot club={janela.opEscolhida.clube} size={20} />Escolha sua camisa no {janela.opEscolhida.clube.nome}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {Array.from({ length: 28 }, (_, i) => i + 1).filter((n) => !janela.bloqueados.has(n)).map((n) => (
                              <button key={n} onClick={() => confirmarNumeroTransfer(n)} className="w-10 h-10 text-sm font-mono rounded-sm border border-zinc-700 hover:border-amber-400 hover:bg-amber-400/10">{n}</button>
                            ))}
                          </div>
                        </>
                      )}
                      {(janela.tipo === "mercado" || janela.tipo === "emprestimo" || janela.tipo === "tentadora" || janela.tipo === "aposentadoria" || janela.tipo === "coracao" || janela.tipo === "sair" || janela.tipo === "rescisao") && (
                        <>
                          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">{janela.tipo === "tentadora" ? "Proposta tentadora" : janela.tipo === "coracao" ? "Clube do coração" : janela.tipo === "emprestimo" ? "Propostas de empréstimo" : janela.tipo === "aposentadoria" ? "Fim de carreira" : janela.tipo === "sair" ? "Propostas após pedido de saída" : janela.tipo === "rescisao" ? "Propostas após rescisão" : "Propostas de mercado"}</div>
                          <div className="grid gap-2 mb-2">
                            {janela.opcoes.map((op, i) => {
                              const sal = salarioClube(op.clube, ovrAtual) * (op.salarioMult || 1);
                              const nivelInt = op.interesse == null ? null : op.interesse >= 1.4 ? { l: "Prioridade máxima", c: "#12A876" } : op.interesse >= 0.8 ? { l: "Interesse forte", c: "#D8B44A" } : op.interesse >= 0.35 ? { l: "Sondagem", c: "#a1a1aa" } : { l: "Interesse discreto", c: "#71717a" };
                              return (
                                <button key={i} onClick={() => escolherOfertaTransferencia(op)} className="text-left p-3 border border-zinc-800 rounded-sm hover:border-emerald-500 flex items-center gap-3">
                                  <ClubDot club={op.clube} size={24} />
                                  <div className="flex-1">
                                    <div className="text-sm font-bold flex items-center gap-2">{op.clube.nome} {op.tentadora && <span className="text-[9px] bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded-sm">{op.salarioMult}x salário</span>}</div>
                                    <div className="text-[10px] text-zinc-500">{LIGAS[op.clube.liga].nome} · força {op.clube.forca} · salário ${formatarDinheiro(sal)}{op.tipo === "emprestimo" ? ` · empréstimo (${op.duracao}a)` : ""}</div>
                                    {op.tipo !== "emprestimo" && (() => {
                                      const vMeu = valorDeMercado(carreira, ovrAtual, ultima);
                                      // clube que te quer muito paga acima do valor de mercado
                                      const premio = op.interesse >= 1.4 ? 1.35 : op.interesse >= 0.8 ? 1.15 : 1;
                                      return <div className="text-[10px] text-amber-400/80">💰 Proposta de transferência: ${formatarDinheiro(Math.round(vMeu * premio))}</div>;
                                    })()}
                                    <div className="text-[10px] text-zinc-600">Torcida lá: {tierTorcida(getTorcida(carreira, op.clube.nome)).label}{nivelInt ? <> · <span style={{ color: nivelInt.c }}>{nivelInt.l}</span></> : null}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {janela.tipo !== "aposentadoria" && <Button variant="ghost" onClick={() => setJanela({ tipo: "empresario" })}>← Voltar</Button>}
                          <div className="mt-2"><Button variant="ghost" onClick={() => jogarTemporada(null)}>Recusar e ficar no {carreira.clube.nome}</Button></div>
                          {janela.tipo === "aposentadoria" && <div className="mt-2"><Button variant="ghost" onClick={() => { setFim({ nivel: veredito(carreira, janela.temporadasSnapshot), c: carreira }); setStage("fim"); }}>🚪 Pendurar as chuteiras (encerrar carreira)</Button></div>}
                        </>
                      )}
                    </Card>
                  </PopupOverlay>
                )}

                {centralMedicaAberta && (
                  <PopupOverlay onClose={() => setCentralMedicaAberta(false)}>
                    <Card padded={false} className="border-red-500/40 overflow-hidden">
                      <div className="relative h-20" style={{ background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 24px), radial-gradient(ellipse 70% 100% at 50% 100%, rgba(214,72,63,0.18) 0%, transparent 70%), linear-gradient(180deg, #1c2226 0%, #101315 100%)` }}>
                        <div className="absolute bottom-2 left-5 text-[10px] text-red-400 uppercase tracking-widest font-sport font-bold">🩺 Central Médica</div>
                      </div>
                      <div className="p-5">
                      {(() => { const f = nivelFragilidade(carreira); return (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Desgaste</div><div className="font-mono text-lg font-bold" style={{ color: carreira.desgaste > 1.5 ? "#D6483F" : "#12A876" }}>{(carreira.desgaste ?? 0).toFixed(1)}</div></div>
                          <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Energia</div><div className="font-mono text-lg font-bold">{Math.round(carreira.energia ?? 100)}%</div></div>
                          <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Condição</div><div className="font-bold text-[11px] leading-tight mt-1" style={{ color: f.cor }}>{f.label}</div></div>
                        </div>
                      ); })()}
                      <p className="text-xs text-zinc-400 mb-3">{nivelFragilidade(carreira).desc}</p>

                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">🏋️ Rotina física da temporada</div>
                      <div className="grid gap-1.5 mb-3">
                        {ROTINAS_FISICAS.map((r) => {
                          const ativa = (carreira.rotinaFisica || "equilibrada") === r.id;
                          return (
                            <button key={r.id} onClick={() => setCarreira((c) => ({ ...c, rotinaFisica: r.id }))} className="text-left px-3 py-2 rounded-sm border transition-all" style={{ borderColor: ativa ? r.cor : "#27272a", background: ativa ? `${r.cor}15` : "transparent" }}>
                              <div className="text-[11px] font-bold" style={{ color: ativa ? r.cor : "#e4e4e7" }}>{r.icone} {r.nome} {ativa && <span className="text-[9px]">✓ ativa</span>}</div>
                              <div className="text-[9px] text-zinc-500 mt-0.5">{r.desc}</div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Histórico de lesões</div>
                      <div className="max-h-36 overflow-y-auto space-y-1 mb-3">
                        {(carreira.lesoesHistorico || []).length === 0 && <p className="text-[11px] text-zinc-500">Nenhuma lesão registrada até agora.</p>}
                        {[...(carreira.lesoesHistorico || [])].reverse().map((l, i) => (
                          <div key={i} className="text-[11px] border-l-2 pl-2" style={{ borderColor: l.gravidade >= 3 ? "#D6483F" : l.gravidade === 2 ? "#f59e0b" : "#71717a" }}>
                            <span className="text-zinc-300">{l.idade}a — {l.nome}</span>
                            {l.recaida && <span className="text-red-400 text-[9px]"> · recaída</span>}
                            <span className="block text-[9px] text-zinc-600">{l.jogosFora} jogos fora{l.perdaAtributo > 0 ? ` · −${l.perdaAtributo} de ${l.atributo}` : ""}</span>
                          </div>
                        ))}
                      </div>
                      {(() => {
                        const regioes = {};
                        (carreira.lesoesHistorico || []).forEach((l) => { regioes[l.regiao] = (regioes[l.regiao] || 0) + 1; });
                        const criticas = Object.entries(regioes).filter(([, n]) => n >= 2);
                        return criticas.length ? (
                          <div className="text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/5 rounded-sm p-2 mb-3">
                            ⚠️ Regiões sensíveis: {criticas.map(([r, n]) => `${r} (${n}x)`).join(", ")} — risco elevado de nova lesão no mesmo lugar.
                          </div>
                        ) : null;
                      })()}
                      {carreira.staff?.departamentoScout ? (
                        <div className="border-t border-zinc-800 pt-3">
                          <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">🔎 Relatório do scout</div>
                          {(() => { const p = PERSONALIDADES.find((x) => x.id === carreira.personalidade); return <p className="text-[11px] text-zinc-400">Crescimento até os {p.picoFim} anos, platô até os {p.declinioApartir - 1}, declínio a partir dos {p.declinioApartir}.</p>; })()}
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-600 border-t border-zinc-800 pt-3">Contrate um departamento de scouts (Cofre → Staff) pra ver sua curva de crescimento com precisão.</p>
                      )}
                      <div className="mt-3"><Button onClick={() => setCentralMedicaAberta(false)}>Fechar</Button></div>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {treinoPopupAberto && !treinoDesafio && (
                  <PopupOverlay onClose={() => setTreinoPopupAberto(false)}>
                    <Card padded={false} className="border-emerald-500/40 overflow-hidden">
                      <div className="relative h-20 -mx-0" style={{ background: `radial-gradient(circle at 50% 100%, transparent 18%, rgba(255,255,255,0.05) 18.5%, rgba(255,255,255,0.05) 19%, transparent 19.5%), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 24px, transparent 24px, transparent 48px), linear-gradient(180deg, #1d5c33 0%, #123d21 100%)` }}>
                        <div className="absolute bottom-2 left-5 text-[10px] text-emerald-400 uppercase tracking-widest font-sport font-bold">🏋️ Centro de Treinamento</div>
                      </div>
                      <div className="p-5">
                      <div className="text-xs text-zinc-400 mb-1.5">Treinar atributo (minigame — custa 15 de energia)</div>
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {NUM_ATTRS.map((id) => {
                          const custo = posTemporada?.bloqueiosTreino?.[id];
                          return <button key={id} onClick={() => abrirDesafioTreino(id)} disabled={posTemporada?.treinou || (custo && carreira.cofre < custo) || (carreira.energia ?? 100) < 15} className={`px-1 py-1.5 text-[10px] rounded-sm border ${carreira.focoTreino === id ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800"} disabled:opacity-40`}>{custo ? `🔒 ${ATTR_SLOTS.find((s) => s.id === id).abrev}` : ATTR_SLOTS.find((s) => s.id === id).abrev}{custo ? <span className="block text-[8px] text-amber-400">${formatarDinheiro(custo)}</span> : null}</button>;
                        })}
                      </div>
                      <button onClick={treinoPesado} disabled={posTemporada?.treinou} className="w-full text-[10px] text-amber-400 border border-amber-500/30 rounded-sm py-1.5 disabled:opacity-40 mb-3">Treino PESADO (+evolução, +desgaste)</button>
                      {carreira.desgaste > 1.5 && <div className="text-[9px] text-red-400 mb-2">Desgaste alto — risco de lesão subindo.</div>}
                      <div className="text-xs text-zinc-400 mb-1">Treino especializado (1 por temporada)</div>
                      <div className="grid gap-1 mb-3">
                        <button onClick={() => treinoExtra("tatico")} disabled={posTemporada?.extraTreinoFeito} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-emerald-500 disabled:opacity-40 text-left">📋 Treino tático — entrosamento com o time</button>
                        <button onClick={() => treinoExtra("mental")} disabled={posTemporada?.extraTreinoFeito} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-emerald-500 disabled:opacity-40 text-left">🧘 Preparação mental — forma e recuperação</button>
                        <button onClick={() => treinoExtra("bolaParada")} disabled={posTemporada?.extraTreinoFeito} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-emerald-500 disabled:opacity-40 text-left">🎯 Cobranças de bola parada</button>
                      </div>
                      <div className="text-xs text-zinc-400 mb-1">Descanso (recupera energia)</div>
                      <div className="grid gap-1 mb-3">
                        <button onClick={() => descansar("ferias")} disabled={posTemporada?.descansou} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40 text-left">🏖️ Férias de fim de semana com a família (+40)</button>
                        <button onClick={() => descansar("casa")} disabled={posTemporada?.descansou} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40 text-left">🛋️ Descanso em casa (+25)</button>
                        <button onClick={() => descansar("regenerativo")} disabled={posTemporada?.descansou} className="px-2 py-1.5 text-[10px] rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40 text-left">💆 Trabalho regenerativo (+15, -desgaste)</button>
                      </div>
                      <div className="text-xs text-zinc-400 mb-1">Versatilidade <span className="text-zinc-600">(atual: {carreira.posicao})</span></div>
                      {(carreira.posicoesAprendidas || [carreira.posicao]).length > 1 && (
                        <select onChange={(e) => e.target.value && jogarComoPosicao(e.target.value)} value="" className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-2 py-1.5 text-[10px] outline-none mb-1.5">
                          <option value="">🔀 Jogar como... (já aprendidas)</option>
                          {(carreira.posicoesAprendidas || [carreira.posicao]).map((pid) => <option key={pid} value={pid}>{pid} — {POSICOES.find((p) => p.id === pid)?.label}</option>)}
                        </select>
                      )}
                      <select onChange={(e) => e.target.value && aprenderNovaPosicao(e.target.value)} disabled={(carreira.energia ?? 100) < 25} value="" className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-2 py-1.5 text-[10px] outline-none disabled:opacity-40 mb-3">
                        <option value="">📘 Aprender nova posição (-25 energia, uma vez só)</option>
                        {POSICOES.filter((p) => !(carreira.posicoesAprendidas || [carreira.posicao]).includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.id} — {p.label}</option>)}
                      </select>
                      <div className="text-xs text-zinc-400 mb-1">Função tática</div>
                      <select onChange={(e) => setCarreira((c) => ({ ...c, papelTatico: e.target.value }))} value={carreira.papelTatico || "padrao"} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-2 py-1.5 text-[10px] outline-none mb-3">
                        {PAPEIS_TATICOS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                      <p className="text-[9px] text-zinc-600 mb-3 -mt-2">{PAPEIS_TATICOS.find((p) => p.id === (carreira.papelTatico || "padrao"))?.desc}</p>
                      <Button variant="ghost" onClick={() => setTreinoPopupAberto(false)}>Fechar</Button>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {acoesPopupAberto && (
                  <PopupOverlay onClose={() => setAcoesPopupAberto(false)}>
                    <Card className="border-blue-500/40">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-3">📋 Ações da carreira</div>
                      <div className="grid gap-1.5">
                        {[
                          ["patrocinio", "💼 Buscar patrocínio", posTemporada.patrocinioFeito],
                          ["eventoTorcida", "🎉 Evento com a torcida", posTemporada.torcidaFeita],
                          ["social", "❤️ Ação social pelo clube", posTemporada.torcidaFeita],
                          ["recuperacao", "🧊 Recuperação física", posTemporada.recuperou],
                          ["preparador", "🩺 Preparador físico particular", posTemporada.preparadorFeito],
                          ["imagem", "📸 Investir em imagem pessoal", posTemporada.imagemFeita],
                          ["capitania", "🎗️ Pedir a braçadeira de capitão", posTemporada.capitaniaFeita],
                          ["numero", "👕 Pedir troca de número", posTemporada.numeroFeito],
                          ["contrato", "✍️ Negociar contrato atual", posTemporada.contratoNegociado],
                          ["diretoria", "🏛️ Reunião com a diretoria", posTemporada.diretoriaFeita],
                          ["base", "🌱 Trabalho com a base do clube", posTemporada.baseFeita],
                          ["folga", "🏖️ Pedir folga pra família", posTemporada.folgaFeita],
                          ["noitada", "🎉 Sair pra noitada", posTemporada.noitadaFeita],
                        ].map(([id, label, feito]) => {
                          const custo = posTemporada.bloqueiosAcao?.[id];
                          return <button key={id} onClick={() => acaoComDesbloqueio(id, custo)} disabled={feito || (custo && carreira.cofre < custo)} className="px-2 py-1.5 text-[11px] rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40 text-left">{custo ? "🔒 " : ""}{label}{custo ? <span className="text-amber-400 ml-1">${formatarDinheiro(custo)}</span> : ""}</button>;
                        })}
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setAcoesPopupAberto(false)}>Fechar</Button></div>

                {pendingTrocaNumero && (
                  <PopupOverlay onClose={() => setPendingTrocaNumero(null)}>
                    <Card className="border-blue-500/40">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">👕 Pedir troca de número no {carreira.clube.nome}</div>
                      <p className="text-xs text-zinc-400 mb-3">Números ocupados por titulares e estrelas do elenco não aparecem na lista — a diretoria não libera esses.</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 28 }, (_, i) => i + 1).filter((n) => !pendingTrocaNumero.bloqueados.has(n) && n !== (carreira.camisaPorClube?.[carreira.clube.nome] || []).slice(-1)[0]).map((n) => (
                          <button key={n} onClick={() => confirmarTrocaNumero(n)} className="w-10 h-10 text-sm font-mono rounded-sm border border-zinc-700 hover:border-blue-400 hover:bg-blue-400/10">{n}</button>
                        ))}
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setPendingTrocaNumero(null)}>Cancelar</Button></div>
                    </Card>
                  </PopupOverlay>
                )}
                    </Card>
                  </PopupOverlay>
                )}

                {resultadoAcao && (
                  <PopupOverlay onClose={() => setResultadoAcao(null)}>
                    <Card className="border-emerald-500/40 text-center">
                      <div className="text-3xl mb-2">{resultadoAcao.icone}</div>
                      <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">{resultadoAcao.titulo}</div>
                      <p className="text-sm mb-3">{resultadoAcao.texto}</p>
                      {resultadoAcao.deltas && resultadoAcao.deltas.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                          {resultadoAcao.deltas.map((d, i) => (
                            <span key={i} className={`text-[10px] font-bold font-stat px-2 py-1 rounded-full ${d.valor > 0 ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>{d.valor > 0 ? "+" : ""}{d.valor} {d.label}</span>
                          ))}
                        </div>
                      )}
                      <Button onClick={() => setResultadoAcao(null)}>Continuar</Button>
                    </Card>
                  </PopupOverlay>
                )}

                {vestiarioAberto && (
                  <PopupOverlay onClose={() => setVestiarioAberto(false)}>
                    <Card className="border-emerald-500/40">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-3">🚪 Trabalhar as relações do vestiário</div>
                      <div className="grid gap-1.5">
                        {carreira.relacoes?.parceiro && (
                          <button onClick={() => acaoVestiario("treinarParceria")} className="text-left px-3 py-2 text-xs rounded-sm border border-emerald-500/30 hover:bg-emerald-500/10">
                            🤝 Treinar tabelinha com {carreira.relacoes.parceiro.nome}
                            <span className="block text-[9px] text-zinc-500 mt-0.5">+10 a 20 de sintonia. Custa energia.</span>
                          </button>
                        )}
                        {carreira.relacoes?.pupilo && (
                          <button onClick={() => acaoVestiario("orientarPupilo")} className="text-left px-3 py-2 text-xs rounded-sm border border-blue-500/30 hover:bg-blue-500/10">
                            🌱 Orientar {carreira.relacoes.pupilo.nome}
                            <span className="block text-[9px] text-zinc-500 mt-0.5">O garoto evolui mais rápido e o grupo valoriza o gesto.</span>
                          </button>
                        )}
                        {carreira.relacoes?.desafeto && (
                          <>
                            <button onClick={() => acaoVestiario("fazerAsPazes")} className="text-left px-3 py-2 text-xs rounded-sm border border-amber-500/30 hover:bg-amber-500/10">
                              🕊️ Chamar {carreira.relacoes.desafeto.nome} pra conversar
                              <span className="block text-[9px] text-zinc-500 mt-0.5">55% de chance de resolver. Se der errado, piora.</span>
                            </button>
                            <button onClick={() => acaoVestiario("peitarDesafeto")} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 hover:bg-red-500/10">
                              ⚡ Peitar {carreira.relacoes.desafeto.nome} na frente do grupo
                              <span className="block text-[9px] text-zinc-500 mt-0.5">Ganha fama, racha o vestiário.</span>
                            </button>
                          </>
                        )}
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setVestiarioAberto(false)}>Fechar</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {elencoAberto && (() => {
                  const ovrMeu = calcOVR(carreira.attrs, carreira.posicao, carreira.papelTatico);
                  const esc = escalacaoProvavel(carreira.elenco, { nome, posicao: carreira.posicao, idade: carreira.idade, ovr: ovrMeu, titularidade: carreira.titularidade });
                  const idsTitulares = new Set(esc.titulares.map((j) => j.id));
                  const todos = [...(carreira.elenco || []), { id: "EU", nome, posicao: carreira.posicao, idade: carreira.idade, ovr: ovrMeu, voce: true }];
                  const setores = [["Goleiros", ["GOL"]], ["Defesa", ["ZAG", "LD", "LE"]], ["Meio-campo", ["VOL", "MC", "MEI"]], ["Ataque", ["PD", "PE", "SA", "ATA"]]];
                  const media = Math.round(todos.reduce((s, j) => s + j.ovr, 0) / todos.length);
                  const idadeMedia = (todos.reduce((s, j) => s + j.idade, 0) / todos.length).toFixed(1);
                  return (
                    <PopupOverlay onClose={() => setElencoAberto(false)}>
                      <Card className="border-emerald-500/40">
                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">👥 Elenco do {carreira.clube.nome}</div>
                        <div className="flex gap-3 text-[10px] text-zinc-500 mb-3">
                          <span>{todos.length} jogadores</span><span>OVR médio {media}</span><span>idade média {idadeMedia}</span>
                        </div>
                        <div className="max-h-[55vh] overflow-y-auto pr-1">
                          {setores.map(([setor, posIds]) => {
                            const doSetor = todos.filter((j) => posIds.includes(j.posicao)).sort((a, b) => b.ovr - a.ovr);
                            if (!doSetor.length) return null;
                            return (
                              <div key={setor} className="mb-2.5">
                                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">{setor}</div>
                                <div className="grid gap-0.5">
                                  {doSetor.map((j) => {
                                    const titular = idsTitulares.has(j.id);
                                    return (
                                      <div key={j.id} className={`flex items-center gap-2 text-[11px] px-2 py-1 rounded-sm ${j.voce ? "bg-emerald-500/15 border border-emerald-500/30" : ""}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${titular ? "bg-emerald-500" : "bg-zinc-700"}`} title={titular ? "Titular" : "Reserva"} />
                                        <span className={`flex-1 truncate ${j.voce ? "font-bold text-emerald-400" : "text-zinc-300"}`}>{j.voce ? `${nome} (você)` : j.nome}</span>
                                        <span className="text-[9px] text-zinc-600 w-8">{j.posicao}</span>
                                        <span className="text-[9px] text-zinc-600 w-8 text-right">{j.idade}a</span>
                                        <span className="font-mono text-[10px] w-7 text-right" style={{ color: j.ovr >= ovrMeu ? "#D6483F" : "#12A876" }}>{j.ovr}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-zinc-600 mt-2">🟢 titular provável · 🔴 OVR igual ou acima do seu</p>
                        <div className="mt-3"><Button variant="ghost" onClick={() => setElencoAberto(false)}>Fechar</Button></div>
                      </Card>
                    </PopupOverlay>
                  );
                })()}

                {empresarioMenuAberto && (() => {
                  const atual = carreira.empresario ? empresarioPorId(carreira.empresario.id) : null;
                  return (
                    <PopupOverlay largo onClose={() => setEmpresarioMenuAberto(false)}>
                      <Card className="border-blue-500/40">
                        <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-3">💼 Seu empresário</div>
                        {atual ? (
                          <div className="border rounded-sm p-3 mb-4" style={{ borderColor: `${atual.cor}55`, background: `${atual.cor}12` }}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold" style={{ color: atual.cor }}>{atual.icone} {atual.nome}</span>
                              <span className="text-[10px] font-mono text-zinc-400">{carreira.empresario.restantes} temp.</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1">{atual.desc}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">Comissão: {Math.round((atual.comissao || 0) * 100)}% do salário · {atual.resumo}</p>
                            <button onClick={dispensarEmpresario} className="text-[10px] text-red-400 border border-red-500/30 rounded-sm px-2 py-1 mt-2 hover:bg-red-500/10">Romper contrato</button>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500 mb-3">Você está sem empresário — o mercado te enxerga menos e as propostas são poucas.</p>
                        )}
                        <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">{atual ? "Trocar por" : "Contratar"}</div>
                        <div className="lista-cards">
                          {todosEmpresarios().filter((e) => e.id !== atual?.id).map((e) => {
                            const podePagar = carreira.cofre >= e.custo;
                            return (
                              <button key={e.id} onClick={() => contratarEmpresario(e)} disabled={!podePagar} className="text-left px-3 py-2.5 rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold" style={{ color: e.cor }}>{e.icone} {e.nome}</span>
                                  <span className="text-[10px] font-mono text-amber-400">{e.custo > 0 ? `$${formatarDinheiro(e.custo)}` : "grátis"}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5">{e.desc}</p>
                                <p className="text-[9px] text-zinc-600 mt-1">{e.resumo} · comissão {Math.round(e.comissao * 100)}% · {e.temporadas} temporadas</p>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 grid gap-1.5">
                          <Button variant="ghost" onClick={() => { setEmpresarioMenuAberto(false); abrirTransferencias("empresario"); }}>🔎 Sondar o mercado agora</Button>
                          <Button variant="ghost" onClick={() => setEmpresarioMenuAberto(false)}>Fechar</Button>
                        </div>
                      </Card>
                    </PopupOverlay>
                  );
                })()}

                {conversaBanco && (
                  <PopupOverlay onClose={() => setConversaBanco(null)}>
                    <Card className="border-amber-500/40">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-3">🪑 Conversa com o técnico</div>
                      <p className="text-[11px] text-zinc-500 mb-1">Você bateu na porta da sala dele e perguntou por que não está jogando.</p>
                      <div className="border-l-2 border-amber-500/50 pl-3 py-1 mb-4">
                        <p className="text-sm text-zinc-200 italic">"{conversaBanco.motivo.txt}"</p>
                      </div>
                      <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">Como você responde?</div>
                      <div className="grid gap-1.5">
                        <button onClick={() => responderBanco("aceitar")} className="text-left px-3 py-2 text-xs rounded-sm border border-emerald-500/30 hover:bg-emerald-500/10">🤝 Aceitar e brigar pela vaga no treino <span className="block text-[9px] text-zinc-500 mt-0.5">Ganho seguro de confiança e entrosamento.</span></button>
                        <button onClick={() => responderBanco("treinar")} className="text-left px-3 py-2 text-xs rounded-sm border border-blue-500/30 hover:bg-blue-500/10">🏋️ Pedir trabalho extra pra corrigir isso <span className="block text-[9px] text-zinc-500 mt-0.5">Custa energia, mas rende +1 num atributo ligado ao motivo.</span></button>
                        <button onClick={() => responderBanco("posicao")} className="text-left px-3 py-2 text-xs rounded-sm border border-purple-500/30 hover:bg-purple-500/10">🔄 Se oferecer pra jogar em outra posição <span className="block text-[9px] text-zinc-500 mt-0.5">Pode destravar uma posição nova no seu repertório.</span></button>
                        <button onClick={() => responderBanco("cobrar")} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 hover:bg-red-500/10">
                          😤 Cobrar o que foi prometido
                          <span className="block text-[9px] text-zinc-500 mt-0.5">
                            {carreira.promessaQuebradaPeloTecnico || (carreira.tecnicoConfianca ?? 60) >= 70
                              ? "Você tem respaldo — tende a dar certo."
                              : "Sem respaldo hoje, isso pode sair caro."}
                          </span>
                        </button>
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setConversaBanco(null)}>Deixar pra lá</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {tecnicoMenuAberto && (
                  <PopupOverlay onClose={() => setTecnicoMenuAberto(false)}>
                    <Card className="border-amber-500/40">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">🧑‍💼 Relação com o técnico do {carreira.clube.nome}</div>
                      <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">Confiança atual</span><span className="font-bold" style={{ color: statusNoTime(carreira.tecnicoConfianca ?? 60).cor }}>{statusNoTime(carreira.tecnicoConfianca ?? 60).label} ({Math.round(carreira.tecnicoConfianca ?? 60)})</span></div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4"><div className="h-full rounded-full" style={{ width: `${carreira.tecnicoConfianca ?? 60}%`, background: statusNoTime(carreira.tecnicoConfianca ?? 60).cor }} /></div>
                      <p className="text-[10px] text-zinc-600 mb-2">Até {LIMITE_ACOES_TECNICO} ações por temporada · usadas: {carreira.tecnicoAcoesTemporada || 0}/{LIMITE_ACOES_TECNICO}</p>
                      <button onClick={abrirConversaBanco} className="w-full text-left px-3 py-2.5 mb-3 text-xs rounded-sm border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10">
                        🪑 "Por que estou no banco?" <span className="block text-[9px] text-zinc-500 mt-0.5">Conversa franca — o técnico explica o motivo real e você decide como reagir. Não gasta ação.</span>
                      </button>
                      <div className="text-[9px] text-emerald-400 uppercase tracking-widest mb-1.5">Aproximam vocês</div>
                      <div className="grid gap-1.5 mb-3">
                        <button onClick={() => acaoTecnico("conversar")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-40">🗣️ Conversar em particular <span className="block text-[9px] text-zinc-500 mt-0.5">Alinha expectativas, ganho discreto e confiável.</span></button>
                        <button onClick={() => acaoTecnico("elogiar")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-40">👏 Elogiar publicamente o trabalho <span className="block text-[9px] text-zinc-500 mt-0.5">Rende também um pouco de fama, mas aumenta o calor da mídia.</span></button>
                        <button onClick={() => acaoTecnico("esquema")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-40">📋 Seguir à risca o esquema tático <span className="block text-[9px] text-zinc-500 mt-0.5">Maior ganho de confiança — assume o papel tático padrão do técnico.</span></button>
                      </div>
                      <div className="text-[9px] text-red-400 uppercase tracking-widest mb-1.5">Risco e recompensa</div>
                      <div className="grid gap-1.5">
                        <button onClick={() => acaoTecnico("cobrar")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 hover:bg-red-500/10 disabled:opacity-40">📢 Cobrar mudanças publicamente <span className="block text-[9px] text-zinc-500 mt-0.5">Agrada a torcida, mas incomoda o técnico.</span></button>
                        <button onClick={() => acaoTecnico("trocarPapel")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 hover:bg-red-500/10 disabled:opacity-40">🔄 Insistir num papel tático diferente <span className="block text-[9px] text-zinc-500 mt-0.5">Pode encaixar melhor no seu estilo, mas contraria o técnico.</span></button>
                        <button onClick={() => acaoTecnico("reclamar")} disabled={(carreira.tecnicoAcoesTemporada || 0) >= LIMITE_ACOES_TECNICO} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 hover:bg-red-500/10 disabled:opacity-40">😤 Reclamar da escalação <span className="block text-[9px] text-zinc-500 mt-0.5">Fama sobe com a repercussão, mas a confiança despenca.</span></button>
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setTecnicoMenuAberto(false)}>Fechar</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {contratoMenuAberto && (
                  <PopupOverlay onClose={() => setContratoMenuAberto(false)}>
                    <Card className="border-blue-500/40">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-3">✍️ Contrato com o {carreira.clube.nome}</div>
                      {carreira.contrato ? (
                        <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 bg-zinc-950/40 rounded-sm p-3">
                          <div className="flex justify-between"><span className="text-zinc-400">Restam</span><span className="font-bold text-zinc-200">{carreira.contrato.restantes} ano(s)</span></div>
                          <div className="flex justify-between"><span className="text-zinc-400">Salário</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.salario)}</span></div>
                          <div className="flex justify-between"><span className="text-zinc-400">Multa</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.multa)}</span></div>
                          <div className="flex justify-between"><span className="text-zinc-400">Bônus/gol</span><span className="font-mono text-zinc-200">${formatarDinheiro(carreira.contrato.bonusGol)}</span></div>
                          {carreira.contrato.clausulaEstabilidade && <div className="col-span-2 text-emerald-400">🛡️ Cláusula de estabilidade ativa</div>}
                          {(() => {
                            const v = valorDeMercado(carreira, calcOVR(carreira.attrs, carreira.posicao, carreira.papelTatico), ultima);
                            const razao = v / Math.max(1, carreira.contrato.multa);
                            if (razao < 0.8) return <div className="col-span-2 text-[10px] text-emerald-400">🔒 Multa bem acima do seu valor — praticamente ninguém vai pagá-la.</div>;
                            if (razao < 1.2) return <div className="col-span-2 text-[10px] text-zinc-500">⚖️ Multa próxima do seu valor de mercado.</div>;
                            return <div className="col-span-2 text-[10px] text-red-400">⚠️ Sua multa está barata perto do seu valor (${formatarDinheiro(v)}) — clubes podem simplesmente pagá-la e te levar.</div>;
                          })()}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 mb-4">Você ainda não tem um contrato formal registrado com o {carreira.clube.nome}.</p>
                      )}
                      <div className="grid gap-1.5">
                        <button onClick={() => { setContratoMenuAberto(false); setNegociacaoContratoAtual(carreira.contrato || { anos: 2, salario: salarioClube(carreira.clube, calcOVR(carreira.attrs, carreira.posicao)), multa: salarioClube(carreira.clube, calcOVR(carreira.attrs, carreira.posicao)) * 4, bonusGol: 2 }); }} className="text-left px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-blue-500">✍️ Negociar renovação completa <span className="block text-[9px] text-zinc-500 mt-0.5">Ajusta salário, bônus, multa, anos e status de estrela.</span></button>
                        <button onClick={pedirAumentoSalarial} disabled={!carreira.contrato} className="text-left px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-emerald-500 disabled:opacity-40">💰 Pedir aumento salarial <span className="block text-[9px] text-zinc-500 mt-0.5">Rápido, sem mexer no resto do contrato.</span></button>
                        <button onClick={negociarBonusRapido} disabled={!carreira.contrato} className="text-left px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-amber-500 disabled:opacity-40">🎁 Negociar bônus por gol/assistência <span className="block text-[9px] text-zinc-500 mt-0.5">Aumenta o valor extra por desempenho.</span></button>
                        <button onClick={pedirClausulaEstabilidade} disabled={!carreira.contrato || carreira.contrato?.clausulaEstabilidade} className="text-left px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-cyan-500 disabled:opacity-40">🛡️ Pedir cláusula de estabilidade <span className="block text-[9px] text-zinc-500 mt-0.5">Suaviza a queda de confiança do técnico em temporadas ruins.</span></button>
                        <button onClick={rescindirContrato} disabled={!carreira.contrato || carreira.cofre < (carreira.contrato?.multa || Infinity)} className="text-left px-3 py-2 text-xs rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40">✂️ Rescindir contrato (pagar multa){carreira.contrato ? ` — $${formatarDinheiro(carreira.contrato.multa)}` : ""} <span className="block text-[9px] text-red-400/70 mt-0.5">Vira agente livre na hora, mas a torcida não gosta.</span></button>
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setContratoMenuAberto(false)}>Fechar</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {negociacaoContratoAtual && (
                  <PopupOverlay onClose={() => setNegociacaoContratoAtual(null)}>
                    <Card padded={false} className="border-blue-500/40 overflow-hidden">
                      <div className="relative h-20" style={{ background: `repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 22px), radial-gradient(ellipse 60% 80% at 75% 30%, rgba(216,180,74,0.15) 0%, transparent 65%), linear-gradient(180deg, #182233 0%, #0d131d 100%)` }}>
                        <div className="absolute bottom-2 left-5 text-[10px] text-blue-400 uppercase tracking-widest font-sport font-bold">✍️ Escritório da Diretoria</div>
                      </div>
                      <div className="p-5">
                      <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-3">Negociar contrato com o {carreira.clube.nome}</div>
                      <div className="grid gap-3 mb-4">
                        <div className="flex items-center justify-between"><span className="text-xs text-zinc-400">Salário/ano</span><div className="flex items-center gap-2"><button onClick={() => ajustarNegociacaoAtual("salario", -1)} className="w-7 h-7 border border-zinc-700 rounded-sm">−</button><span className="font-mono text-sm w-16 text-center">${formatarDinheiro(negociacaoContratoAtual.salario)}</span><button onClick={() => ajustarNegociacaoAtual("salario", 1)} className="w-7 h-7 border border-zinc-700 rounded-sm">+</button></div></div>
                        <div className="flex items-center justify-between"><span className="text-xs text-zinc-400">Bônus por gol</span><div className="flex items-center gap-2"><button onClick={() => ajustarNegociacaoAtual("bonusGol", -1)} className="w-7 h-7 border border-zinc-700 rounded-sm">−</button><span className="font-mono text-sm w-16 text-center">${formatarDinheiro(negociacaoContratoAtual.bonusGol)}</span><button onClick={() => ajustarNegociacaoAtual("bonusGol", 1)} className="w-7 h-7 border border-zinc-700 rounded-sm">+</button></div></div>
                        <div className="flex items-center justify-between"><span className="text-xs text-zinc-400">Multa rescisória</span><div className="flex items-center gap-2"><button onClick={() => ajustarNegociacaoAtual("multa", -1)} className="w-7 h-7 border border-zinc-700 rounded-sm">−</button><span className="font-mono text-sm w-20 text-center">${formatarDinheiro(negociacaoContratoAtual.multa)}</span><button onClick={() => ajustarNegociacaoAtual("multa", 1)} className="w-7 h-7 border border-zinc-700 rounded-sm">+</button></div></div>
                        <button onClick={() => ajustarNegociacaoAtual("estrela", 0)} className={`w-full text-left px-3 py-2 rounded-sm border text-xs ${negociacaoContratoAtual.estrela ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-zinc-700 text-zinc-400"}`}>⭐ Status de estrela do time {negociacaoContratoAtual.estrela ? "(pedido)" : "(pedir)"} — maior tolerância a faltas em treino, mas a diretoria topa menos fácil</button>
                        <div className="flex items-center justify-between"><span className="text-xs text-zinc-400">Duração (anos)</span><div className="flex items-center gap-2"><button onClick={() => ajustarNegociacaoAtual("anos", -1)} className="w-7 h-7 border border-zinc-700 rounded-sm">−</button><span className="font-mono text-sm w-16 text-center">{negociacaoContratoAtual.anos}</span><button onClick={() => ajustarNegociacaoAtual("anos", 1)} className="w-7 h-7 border border-zinc-700 rounded-sm">+</button></div></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mb-3">Quanto mais você pede acima do seu valor de mercado, menor a chance da diretoria topar de primeira.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" onClick={() => setNegociacaoContratoAtual(null)}>Cancelar</Button>
                        <Button onClick={confirmarNegociacaoAtual}>Propor à diretoria</Button>
                      </div>
                      </div>
                    </Card>
                  </PopupOverlay>
                )}

                {ultima && (
                  <Card>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><ClubDot club={ultima.clubeObj} size={16} />{ultima.temporadaLabel} · {ultima.ligaNome}</span>
                      <span className="text-xs font-mono" style={{ color: tierInfo(ultima.ovr).cor }}>OVR {ultima.ovr}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center mb-3">
                      <div><div className="font-mono text-lg font-bold">{ultima.jogos}</div><div className="text-[9px] text-zinc-500 uppercase">Jogos</div></div>
                      {posicao === "GOL" ? <div><div className="font-mono text-lg font-bold">{ultima.cleanSheets}</div><div className="text-[9px] text-zinc-500 uppercase">CS</div></div> : <div><div className="font-mono text-lg font-bold">{ultima.gols}</div><div className="text-[9px] text-zinc-500 uppercase">Gols</div></div>}
                      <div><div className="font-mono text-lg font-bold">{ultima.assist}</div><div className="text-[9px] text-zinc-500 uppercase">Assist.</div></div>
                      <div><div className="font-mono text-lg font-bold">{ultima.melhorEmCampo}</div><div className="text-[9px] text-zinc-500 uppercase">Melhor em campo</div></div>
                    </div>
                    {posicao !== "GOL" && (
                      <div className="text-[10px] text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between">
                        <span>xG (esperado): <span className="font-mono text-zinc-300">{ultima.xG}</span> {ultima.gols > ultima.xG ? <span className="text-emerald-400">↑ acima do esperado</span> : ultima.gols < ultima.xG ? <span className="text-red-400">↓ abaixo do esperado</span> : ""}</span>
                        <span>Nota vs. média da posição: <span className="font-mono text-zinc-300">{ultima.notaMediaPosicao}</span> {ultima.nota > ultima.notaMediaPosicao ? "🔼" : "🔽"}</span>
                      </div>
                    )}
                    {ultima.passesTentados > 0 && (
                      <div className="text-[10px] text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between mt-2">
                        <span>Passes: <span className="font-mono text-zinc-300">{ultima.passesCompletos}/{ultima.passesTentados}</span> ({ultima.passeCerto}%)</span>
                        {ultima.desarmesTentados > 0 && <span>Desarmes: <span className="font-mono text-zinc-300">{ultima.desarmesCerteiros}/{ultima.desarmesTentados}</span></span>}
                      </div>
                    )}
                    {ultima.expectativa && <div className={`text-[10px] mt-2 ${ultima.bateuMeta ? "text-emerald-400" : "text-red-400"}`}>{ultima.bateuMeta ? "✓" : "✗"} Meta: {posicao === "GOL" ? `${ultima.expectativa.cleanSheets} jogos sem sofrer gol` : `${ultima.expectativa.gols}g / ${ultima.expectativa.assist}a`}</div>}
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Competições da temporada</div>
                      <div className="grid gap-1 text-[11px]">
                        <div className="flex justify-between"><span className="text-zinc-400">{ultima.ligaNome}</span><span className={`font-bold ${ultima.campeaoLiga ? "text-amber-400" : "text-zinc-300"}`}>{ultima.posLiga}º{ultima.campeaoLiga ? " · CAMPEÃO" : ""}</span></div>
                        {ultima.estadual && <div className="flex justify-between gap-2"><span className="text-zinc-400">{ultima.estadual.nome}</span><span className={`font-bold text-right ${ultima.estadual.titulo ? "text-amber-400" : "text-zinc-300"}`}>{ultima.estadual.resultado}{ultima.estadual.adversario ? <span className="block text-zinc-500 font-normal">x {ultima.estadual.adversario} ({ultima.estadual.placar})</span> : ""}</span></div>}
                        {ultima.copinhaCarreira && <div className="flex justify-between gap-2"><span className="text-zinc-400">{ultima.copinhaCarreira.nome}</span><span className={`font-bold text-right ${ultima.copinhaCarreira.titulo ? "text-amber-400" : "text-zinc-300"}`}>{ultima.copinhaCarreira.resultado}{ultima.copinhaCarreira.adversario ? <span className="block text-zinc-500 font-normal">x {ultima.copinhaCarreira.adversario} ({ultima.copinhaCarreira.placar})</span> : ""}</span></div>}
                        {ultima.copaNacional && <div className="flex justify-between gap-2"><span className="text-zinc-400">Copa Nacional</span><span className={`font-bold text-right ${ultima.copaNacional.titulo ? "text-amber-400" : "text-zinc-300"}`}>{ultima.copaNacional.resultado}{ultima.copaNacional.adversario ? <span className="block text-zinc-500 font-normal">x {ultima.copaNacional.adversario} ({ultima.copaNacional.placar})</span> : ""}</span></div>}
                        {ultima.continental && <div className="flex justify-between gap-2"><span className="text-zinc-400">{ultima.continental.nome}</span><span className={`font-bold text-right ${ultima.continental.titulo ? "text-amber-400" : "text-zinc-300"}`}>{ultima.continental.resultado}{ultima.continental.adversario ? <span className="block text-zinc-500 font-normal">x {ultima.continental.adversario} ({ultima.continental.placar})</span> : ""}</span></div>}
                        {ultima.copa && <div className="flex justify-between gap-2"><span className="text-zinc-400">Copa do Mundo</span><span className={`font-bold text-right ${ultima.copa.titulo ? "text-amber-400" : "text-zinc-300"}`}>{ultima.copa.resultado}{ultima.copa.adversario ? <span className="block text-zinc-500 font-normal">x {ultima.copa.adversario} ({ultima.copa.placar})</span> : ""}</span></div>}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {aba === "estatisticas" && (
              <div className="tab-grid">
                {carreira.cartoes && (
                  <Card>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2.5">🟨 Ficha disciplinar</div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div className="bg-zinc-950/40 rounded-sm p-2.5">
                        <div className="font-stat font-black text-xl text-yellow-400">{carreira.cartoes.amarelos || 0}</div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Amarelos</div>
                      </div>
                      <div className="bg-zinc-950/40 rounded-sm p-2.5">
                        <div className="font-stat font-black text-xl text-red-500">{carreira.cartoes.vermelhos || 0}</div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Vermelhos</div>
                      </div>
                      <div className="bg-zinc-950/40 rounded-sm p-2.5">
                        <div className="font-stat font-black text-xl">{carreira.cartoes.amarelosAcumulados || 0}<span className="text-zinc-600 text-sm">/{REGRAS_CARTAO.amarelosParaSuspender}</span></div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Pendurado</div>
                      </div>
                    </div>
                    {(carreira.cartoes.suspensoesRestantes || 0) > 0 && (
                      <p className="text-[10px] text-red-400 border border-red-500/30 bg-red-500/5 rounded-sm px-2 py-1.5">🚫 Suspenso por mais {carreira.cartoes.suspensoesRestantes} jogo(s)</p>
                    )}
                    {(carreira.cartoes.amarelosAcumulados || 0) === REGRAS_CARTAO.amarelosParaSuspender - 1 && (
                      <p className="text-[10px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/5 rounded-sm px-2 py-1.5">⚠️ Pendurado — o próximo amarelo te tira do jogo seguinte</p>
                    )}
                  </Card>
                )}

                <Card className="border-amber-500/30">
                  <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">🏅 Insígnias</div>
                  <p className="text-[10px] text-zinc-600 mb-3">Conquistadas por comportamento repetido. Cada uma evolui em três níveis — e o efeito aumenta junto.</p>
                  {(() => {
                    const conquistadas = TRAITS_DISPONIVEIS.map((t) => ({ t, nivel: nivelDaInsignia(carreira, t.id) })).filter((x) => x.nivel > 0);
                    const faltando = TRAITS_DISPONIVEIS.filter((t) => nivelDaInsignia(carreira, t.id) === 0);
                    return (
                      <>
                        {conquistadas.length === 0 && <p className="text-xs text-zinc-500 mb-3">Nenhuma insígnia ainda. Elas vêm de constância: manter atributo alto, ganhar títulos, render em jogo grande.</p>}
                        <div className="grid gap-1.5 mb-3">
                          {conquistadas.sort((a, b) => b.nivel - a.nivel).map(({ t, nivel }) => {
                            const niv = NIVEIS_INSIGNIA[nivel - 1];
                            return (
                              <div key={t.id} className="rounded-md px-2.5 py-2 border" style={{ borderColor: `${niv.cor}55`, background: `${niv.cor}12` }}>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{t.icone}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs" style={{ color: niv.cor }}>{t.nome}</span>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold" style={{ background: `${niv.cor}25`, color: niv.cor }}>{niv.nome}</span>
                                    </div>
                                    <span className="block text-[10px] text-zinc-400 mt-0.5">{t.efeito(nivel)}</span>
                                  </div>
                                  <div className="flex gap-0.5 shrink-0">
                                    {[1, 2, 3].map((n) => <span key={n} className="w-1.5 h-4 rounded-sm" style={{ background: n <= nivel ? niv.cor : "#3f3f46" }} />)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {faltando.length > 0 && (
                          <>
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">🔒 Ainda por conquistar</div>
                            <div className="grid gap-1">
                              {faltando.map((t) => (
                                <div key={t.id} className="flex items-center gap-2 text-[10px] text-zinc-600 px-2 py-1 border border-zinc-800 rounded-sm">
                                  <span className="opacity-50">{t.icone}</span>
                                  <span className="flex-1">{t.nome}</span>
                                  <span className="text-[9px] text-zinc-700 truncate max-w-[55%]">{t.desc(1)}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        <p className="text-[9px] text-zinc-600 mt-2">{conquistadas.length}/{TRAITS_DISPONIVEIS.length} insígnias · {conquistadas.filter((x) => x.nivel === 3).length} no ouro</p>
                      </>
                    );
                  })()}
                </Card>

                <Card>
                  <button onClick={() => setTabelaExpandida((v) => !v)} className="w-full flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                    <span>📊 {LIGAS[carreira.clube.liga].nome} — tabela</span>
                    <span className="text-zinc-600 normal-case">{tabelaExpandida ? "recolher ▲" : "ver tudo ▼"}</span>
                  </button>
                  {!tabelaExpandida ? (
                    <div className="flex items-center justify-between text-[11px] py-1.5 px-1.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30">
                      <span className="flex items-center gap-1.5 truncate"><span className="font-mono text-zinc-500 w-4">{tabelaLiga.find((r) => r.jogador)?.posicao}º</span><ClubDot club={carreira.clube} size={14} /><span className="font-bold text-emerald-400">{carreira.clube.nome} (você)</span></span>
                      <span className="font-mono text-zinc-500">de {tabelaLiga.length}</span>
                    </div>
                  ) : (
                    <div className="grid gap-0.5">
                      {tabelaLiga.map((row) => (
                        <div key={row.clube.nome} className={`flex items-center justify-between text-[11px] py-1 px-1.5 rounded-sm ${row.jogador ? "bg-emerald-500/10 border border-emerald-500/30" : ""}`}>
                          <span className="flex items-center gap-1.5 truncate"><span className="font-mono text-zinc-500 w-4">{row.posicao}º</span><ClubDot club={row.clube} size={14} /><span className={row.jogador ? "font-bold text-emerald-400" : "text-zinc-400"}>{row.clube.nome}{row.jogador ? " (você)" : ""}</span></span>
                          <span className="font-mono text-zinc-500">{row.jogador ? "—" : row.pontos}pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {ultima?.jogosLista && ultima.jogosLista.length > 0 && (() => {
                  const an = analisarJogos(ultima.jogosLista);
                  return (
                  <Card>
                    <button onClick={() => setJogosExpandido((v) => !v)} className="w-full flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                      <span>🗓️ Jogo a jogo — {ultima.ligaNome}</span>
                      <span className="text-zinc-600 normal-case">{jogosExpandido ? "recolher ▲" : "ver tudo ▼"}</span>
                    </button>
                    {an && (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] mb-2 pb-2 border-b border-zinc-800">
                        <div className="flex justify-between"><span className="text-zinc-500">🏠 Em casa</span><span className="font-mono">{an.casa.jogos}J · {an.casa.gols}g · nota {an.casa.notaMedia}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">✈️ Fora</span><span className="font-mono">{an.fora.jogos}J · {an.fora.gols}g · nota {an.fora.notaMedia}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">⚔️ Clássicos</span><span className="font-mono">{an.classicos.jogos}J · {an.classicos.gols}g · nota {an.classicos.notaMedia}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Demais jogos</span><span className="font-mono">{an.normais.jogos}J · {an.normais.gols}g · nota {an.normais.notaMedia}</span></div>
                        {an.melhor && <div className="col-span-2 text-emerald-400">⭐ Melhor atuação: x {an.melhor.adversario} ({an.melhor.golsMeu}-{an.melhor.golsAdv}) — nota {an.melhor.nota}</div>}
                        {an.pior && an.pior.nota < 6.3 && <div className="col-span-2 text-red-400">💤 Pior atuação: x {an.pior.adversario} ({an.pior.golsMeu}-{an.pior.golsAdv}) — nota {an.pior.nota}</div>}
                      </div>
                    )}
                    {!jogosExpandido ? (
                      <div className="text-[11px] text-zinc-400">{ultima.jogosLista.length} jogos disputados nessa temporada.</div>
                    ) : (
                      <div className="grid gap-0.5 max-h-72 overflow-y-auto pr-1">
                        {ultima.jogosLista.map((j) => (
                          <div key={j.numero} className="flex items-center justify-between text-[10px] py-1 px-1.5 rounded-sm hover:bg-white/5">
                            <span className="text-zinc-500 font-mono w-6">#{j.numero}</span>
                            <span className="text-zinc-600 w-3">{j.casa === false ? "✈️" : j.casa ? "🏠" : ""}</span>
                            <span className="flex-1 text-zinc-400 truncate">x {j.adversario}{j.classico ? <span className="text-amber-500"> ⚔️</span> : ""}</span>
                            <span className="font-mono text-zinc-200 mx-2">{j.golsMeu}x{j.golsAdv}</span>
                            {(j.golsMinha > 0 || j.assistMinha > 0) && <span className="text-zinc-600 text-[9px] mr-2">{j.golsMinha > 0 ? `⚽${j.golsMinha}` : ""}{j.assistMinha > 0 ? ` 🎯${j.assistMinha}` : ""}</span>}
                            {j.nota != null && <span className="font-mono text-[9px] mr-2 w-6 text-right" style={{ color: j.nota >= 7.5 ? "#12A876" : j.nota >= 6.5 ? "#a1a1aa" : "#D6483F" }}>{j.nota}</span>}
                            <span className={`font-bold w-4 text-center ${j.resultado === "V" ? "text-emerald-400" : j.resultado === "E" ? "text-zinc-400" : "text-red-400"}`}>{j.resultado}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                  );
                })()}

                <Card accent="linear-gradient(90deg,#3b82f6,#12A876)">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Ficha do atleta</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Posição atual</div><div className="text-sm font-bold">{POSICOES.find((p) => p.id === carreira.posicao)?.label}</div></div>
                    <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Nacionalidade</div><div className="text-sm font-bold">{nacDe(carreira.nacionalidade).label}</div></div>
                    <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Personalidade</div><div className="text-sm font-bold" style={{ color: PERSONALIDADES.find((p) => p.id === carreira.personalidade)?.cor }}>{PERSONALIDADES.find((p) => p.id === carreira.personalidade)?.icone} {PERSONALIDADES.find((p) => p.id === carreira.personalidade)?.label}</div></div>
                    <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Clube do coração</div><div className="text-sm font-bold">{carreira.clubeCoracao?.nome || "—"}</div></div>
                    <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Relação com a diretoria</div><div className="text-sm font-bold">{Math.round(carreira.relacaoDiretoria ?? 40)}/100</div></div>
                    <div className="bg-zinc-950/40 rounded-sm p-2 col-span-2"><div className="text-[9px] text-zinc-500 uppercase">Posições aprendidas</div><div className="text-sm font-bold">{(carreira.posicoesAprendidas || [carreira.posicao]).join(" · ")}</div></div>
                  </div>
                </Card>
                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Clubes <span className="text-zinc-600 normal-case">(clique pra ver todas as temporadas lá)</span></div>
                  <div className="grid gap-1.5">{Object.entries(carreira.torcidaPorClube).map(([nomeClube, v]) => { const t = tierTorcida(v); const cl = CLUBES.find((c) => c.nome === nomeClube); return (
                    <button key={nomeClube} onClick={() => setPopupClube(nomeClube)} className="flex justify-between items-center text-xs py-2 px-2 border border-zinc-800 rounded-sm hover:border-emerald-500 transition-all">
                      <span className="flex items-center gap-1.5">{cl && <ClubDot club={cl} size={16} />}{nomeClube}</span><span className="font-bold" style={{ color: t.cor }}>{t.label} ({Math.round(v)})</span>
                    </button>
                  ); })}</div>
                </Card>
                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Temporada a temporada <span className="text-zinc-600 normal-case">(clique pra ver os detalhes)</span></div>
                  <div className="grid gap-2 max-h-96 overflow-y-auto pr-1">
                    {[...temporadas].reverse().map((t, i) => (
                      <button key={i} onClick={() => setPopupTemporada(t)} className="text-left border border-zinc-800 rounded-sm p-3 hover:border-emerald-500 transition-all">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="display text-sm font-black flex items-center gap-1.5"><ClubDot club={t.clubeObj} size={14} />Temporada {t.temporadaLabel}</span>
                          <span className="text-[10px] text-zinc-500">{t.clube}</span>
                        </div>
                        <div className="text-xs font-bold text-zinc-200">
                          {posicao === "GOL" ? `Jogos sem sofrer gol: ${t.cleanSheets}` : `Gols: ${t.gols}`} · Assistências: {t.assist} · Melhor em campo: {t.melhorEmCampo}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">Títulos: {t.titulosLista.length ? t.titulosLista.join(", ") : "nenhum"}</div>
                        {t.premios.filter((p) => p.doJogador).length > 0 && <div className="text-[11px] text-amber-400 mt-0.5">Prêmios: {t.premios.filter((p) => p.doJogador).map((p) => p.nome).join(", ")}</div>}
                      </button>
                    ))}
                  </div>
                </Card>
                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrophyIcon tipo="bronze" size={14} />Todos os eventos da carreira</div>
                  <div className="flex gap-1 flex-wrap mb-2.5">
                    {CATEGORIAS_HISTORICO.map((cat) => (
                      <button key={cat.id} onClick={() => setFiltroHistorico(cat.id)} className={`opt-card px-2 py-1 text-[10px] rounded-sm border ${filtroHistorico === cat.id ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>{cat.label}</button>
                    ))}
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {(() => {
                      const eventos = [...(carreira.historico || [])].reverse().filter((h) => filtroHistorico === "todos" || categorizarEvento(h.txt) === filtroHistorico);
                      if (eventos.length === 0) return <p className="text-xs text-zinc-500">{(carreira.historico || []).length === 0 ? "Ainda sem eventos registrados." : "Nenhum evento nessa categoria ainda."}</p>;
                      return eventos.map((h, i) => {
                        const cat = categorizarEvento(h.txt);
                        const estilo = cat === "titulos" ? "bg-amber-400 text-zinc-950 border-amber-300 font-bold"
                          : cat === "confrontos" ? "bg-zinc-900/70 border-emerald-600 text-zinc-100 font-semibold"
                          : cat === "lesoes" ? "bg-orange-500/20 border-orange-500/60 text-orange-200"
                          : "bg-zinc-900/40 border-zinc-800 text-zinc-400";
                        return (
                          <div key={i} className={`text-[11px] rounded-lg border pl-2 pr-2 py-1.5 flex items-start gap-1.5 transition-all ${estilo}`}>
                            <span className="mt-0.5">{h.txt.includes("BOLA DE OURO") ? <TrophyIcon tipo="ouro" size={13} /> : h.txt.includes("MUNDO") ? <TrophyIcon tipo="mundo" size={13} /> : h.txt.includes("Campeão") ? <TrophyIcon tipo="liga" size={13} /> : h.txt.includes("Compr") ? "🏠" : h.txt.includes("mprest") || h.txt.includes("ransfer") ? "🔁" : h.txt.includes("atrocín") ? "💼" : "•"}</span>
                            <span><span className="opacity-70 font-mono mr-1">{h.idade}a</span>{h.txt}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </Card>
              </div>
            )}

            {aba === "inbox" && (
              <div className="grid gap-3">
                {(carreira.inbox || []).length === 0 ? (
                  <Card><p className="text-xs text-zinc-500">Nenhuma notícia ainda. Jogue uma temporada e o mundo vai começar a falar de você.</p></Card>
                ) : (
                  <>
                    <Card>
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">📬 Caixa de entrada</div>
                        {(carreira.inbox || []).some((x) => !x.lida) && (
                          <button onClick={() => setCarreira((cc) => ({ ...cc, inbox: (cc.inbox || []).map((x) => ({ ...x, lida: true })) }))} className="text-[10px] text-zinc-500 hover:text-zinc-300">marcar tudo como lido</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {["todas", ...Object.keys(TIPOS_NOTICIA)].filter((f) => f === "todas" || (carreira.inbox || []).some((x) => x.tipo === f)).map((f) => (
                          <button key={f} onClick={() => setInboxFiltro(f)} className={`px-2 py-1 text-[9px] rounded-sm border ${inboxFiltro === f ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>
                            {f === "todas" ? "Todas" : `${TIPOS_NOTICIA[f].icone} ${TIPOS_NOTICIA[f].label}`}
                          </button>
                        ))}
                      </div>
                    </Card>
                    <div className="grid gap-1.5">
                      {(carreira.inbox || []).filter((x) => inboxFiltro === "todas" || x.tipo === inboxFiltro).map((x) => {
                        const t = TIPOS_NOTICIA[x.tipo] || TIPOS_NOTICIA.mundo;
                        return (
                          <button key={x.id} onClick={() => { setCarreira((cc) => ({ ...cc, inbox: (cc.inbox || []).map((y) => (y.id === x.id ? { ...y, lida: true } : y)) })); setNoticiaAberta(x); }}
                            className={`text-left rounded-sm border p-2.5 transition-all ${x.lida ? "border-zinc-800/60 opacity-60" : "border-zinc-700"}`}
                            style={!x.lida && x.prioridade >= 3 ? { borderColor: `${t.cor}66`, background: `${t.cor}0d` } : {}}>
                            <div className="flex items-start gap-2">
                              <span className="text-sm shrink-0 mt-0.5">{t.icone}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className={`text-xs flex-1 ${x.lida ? "text-zinc-400" : "font-bold text-zinc-100"}`}>{x.titulo}</span>
                                  {!x.lida && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.cor }} />}
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{x.corpo}</p>
                                <div className="text-[9px] text-zinc-600 mt-1">{x.temporada} · {x.idade} anos{x.clube ? ` · ${x.clube}` : ""} · {t.label}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {aba === "mundo" && (
              <div className="tab-grid-3">
                {!mundo ? (
                  <Card><p className="text-xs text-zinc-500">O mundo será gerado quando sua carreira começar.</p></Card>
                ) : (() => {
                  const ovrAtual = calcOVR(carreira.attrs, carreira.posicao, carreira.papelTatico);
                  const meuCardMundo = ultima ? { clube: carreira.clube.nome, posicao: carreira.posicao, ovr: ultima.ovr, gols: ultima.gols, assist: ultima.assist, nota: ultima.nota, ligaMult: ultima.ligaMult } : null;
                  const bo = ultima?.rankingBO?.length ? ultima.rankingBO : rankingBolaDeOuro(mundo, meuCardMundo, nome, 0).slice(0, 10);
                  const art = ultima?.artilhariaLiga?.length ? ultima.artilhariaLiga : artilhariaLiga(mundo, carreira.clube.liga, meuCardMundo, nome).slice(0, 10);
                  const rankPos = rankingPorPosicao(mundo, carreira.posicao, ovrAtual, nome, carreira.clube.nome);
                  const meuRankPos = rankPos.find((x) => x.voce);
                  const rivalObj = mundo.jogadores.find((j) => j.nome === carreira.rivalPosicao && !j.aposentado);
                  const Linha = ({ x, campo, sufixo }) => (
                    <div className={`flex items-center gap-2 text-[11px] py-1 px-1.5 rounded-sm ${x.voce ? "bg-emerald-500/15 border border-emerald-500/30" : ""}`}>
                      <span className={`font-mono w-6 text-right ${x.pos <= 3 ? "text-amber-400 font-bold" : "text-zinc-600"}`}>{x.pos}º</span>
                      <span className={`flex-1 truncate ${x.voce ? "font-bold text-emerald-400" : "text-zinc-300"}`}>{x.voce ? "VOCÊ" : x.nome}</span>
                      <span className="text-[9px] text-zinc-600 truncate max-w-[80px]">{x.clube}</span>
                      <span className="font-mono text-zinc-200 w-10 text-right">{x[campo]}{sufixo}</span>
                    </div>
                  );
                  return (
                    <>
                      <Card>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">🌍 Seu lugar no mundo</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-zinc-950/40 rounded-sm p-2.5 text-center">
                            <div className="font-mono text-xl font-bold" style={{ color: meuRankPos && meuRankPos.pos <= 10 ? "#D8B44A" : "#e4e4e7" }}>{meuRankPos ? `${meuRankPos.pos}º` : "—"}</div>
                            <div className="text-[9px] text-zinc-500 uppercase">Melhor {POSICOES.find((p) => p.id === carreira.posicao)?.label} do mundo</div>
                          </div>
                          <div className="bg-zinc-950/40 rounded-sm p-2.5 text-center">
                            <div className="font-mono text-xl font-bold" style={{ color: ultima?.postoBO && ultima.postoBO <= 3 ? "#D8B44A" : "#e4e4e7" }}>{ultima?.postoBO ? `${ultima.postoBO}º` : "—"}</div>
                            <div className="text-[9px] text-zinc-500 uppercase">Na Bola de Ouro</div>
                          </div>
                        </div>
                        {rivalObj && (
                          <div className="border-t border-zinc-800 mt-3 pt-2.5">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">⚔️ Seu rival de geração</div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-zinc-200">{rivalObj.nome} <span className="text-zinc-500 font-normal">· {rivalObj.clubeNome}, {rivalObj.idade} anos</span></span>
                              <span className="font-mono" style={{ color: rivalObj.ovr > ovrAtual ? "#D6483F" : "#12A876" }}>OVR {rivalObj.ovr}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">Carreira dele: {rivalObj.carreira.gols} gols e {rivalObj.carreira.assist} assistências em {rivalObj.carreira.jogos} jogos · Bolas de Ouro: {carreira.rivalBolasDeOuro || 0}</div>
                            {(() => {
                              const vRival = valorMundo(rivalObj);
                              const vMeu = valorDeMercado(carreira, ovrAtual, ultima);
                              return <div className="text-[10px] mt-0.5">Valor de mercado: <span className="font-mono" style={{ color: vRival > vMeu ? "#D6483F" : "#12A876" }}>${formatarDinheiro(vRival)}</span> <span className="text-zinc-600">vs. seus ${formatarDinheiro(vMeu)}</span></div>;
                            })()}
                          </div>
                        )}
                      </Card>

                      <Card>
                        <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-2">🌎 Seleção {nacDe(carreira.nacionalidade)?.label}</div>
                        {(() => {
                          const sel = carreira.selecao || { jogos: 0, gols: 0, assist: 0, historico: [] };
                          const compAno = competicaoSelecaoDoAno(carreira.anosDesdeCopa ?? 0, carreira.nacionalidade);
                          const fila = carreira.selecaoUltimaFila || concorrentesSelecao(mundo, carreira.nacionalidade, carreira.posicao, ovrAtual, nome).slice(0, 6);
                          const minhaPos = fila.find((x) => x.voce)?.pos ?? carreira.selecaoMinhaPos;
                          const st = statusSelecao(ovrAtual, carreira.idade, carreira.anosDesdeCopa);
                          return (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold" style={{ color: st.cor }}>{st.label}</span>
                                {sel.capitao && <span className="text-[10px] text-amber-400">🎖️ Capitão</span>}
                              </div>
                              <div className="grid grid-cols-4 gap-2 text-center mb-3">
                                <div><div className="font-mono text-base font-bold">{sel.jogos}</div><div className="text-[8px] text-zinc-500 uppercase">Jogos</div></div>
                                <div><div className="font-mono text-base font-bold">{carreira.posicao === "GOL" ? (sel.cleanSheets || 0) : sel.gols}</div><div className="text-[8px] text-zinc-500 uppercase">{carreira.posicao === "GOL" ? "C. sheets" : "Gols"}</div></div>
                                <div><div className="font-mono text-base font-bold">{sel.assist}</div><div className="text-[8px] text-zinc-500 uppercase">Assist.</div></div>
                                <div><div className="font-mono text-base font-bold">{(carreira.titulosSelecao || []).length + (carreira.copasDoMundo || 0)}</div><div className="text-[8px] text-zinc-500 uppercase">Títulos</div></div>
                              </div>

                              <div className="border border-zinc-800 rounded-sm p-2 mb-2.5">
                                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Próximo compromisso</div>
                                <div className="text-[11px]" style={{ color: compAno.cor }}>{compAno.icone} {compAno.nome}</div>
                                {carreira.tecnicoSelecao && (
                                  <div className="text-[9px] text-zinc-500 mt-1">Técnico: {carreira.tecnicoSelecao.nome} ({estiloTecnico(carreira.tecnicoSelecao.estilo).nome})</div>
                                )}
                              </div>

                              <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Disputa pela vaga de {POSICOES.find((p) => p.id === carreira.posicao)?.label}</div>
                              <div className="grid gap-0.5 mb-2">
                                {fila.slice(0, 6).map((x, i) => (
                                  <div key={i} className={`flex items-center gap-2 text-[10px] px-1.5 py-0.5 rounded-sm ${x.voce ? "bg-cyan-500/15 border border-cyan-500/30" : ""}`}>
                                    <span className={`font-mono w-4 ${x.pos <= 2 ? "text-cyan-400" : "text-zinc-600"}`}>{x.pos}º</span>
                                    <span className={`flex-1 truncate ${x.voce ? "font-bold text-cyan-400" : "text-zinc-400"}`}>{x.voce ? "VOCÊ" : x.nome}</span>
                                    <span className="font-mono text-zinc-500">{x.ovr}</span>
                                  </div>
                                ))}
                              </div>
                              {minhaPos != null && <p className="text-[9px] text-zinc-600 mb-2">{minhaPos <= 2 ? "Você é titular na seleção." : minhaPos <= 4 ? "Você está no grupo, brigando por minutos." : "Você precisa render mais pra entrar na lista."}</p>}

                              {(sel.historico || []).length > 0 && (
                                <>
                                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1 border-t border-zinc-800 pt-2">Campanhas</div>
                                  <div className="grid gap-0.5 max-h-32 overflow-y-auto">
                                    {[...(sel.historico || [])].reverse().map((h, i) => (
                                      <div key={i} className="flex items-center gap-2 text-[10px]">
                                        <span className="font-mono text-zinc-600 w-7">{h.idade}a</span>
                                        <span className="flex-1 truncate" style={{ color: h.titulo ? "#D8B44A" : "#a1a1aa" }}>{h.icone} {h.campanha}</span>
                                        <span className="font-mono text-zinc-500">{h.jogos}J {h.gols}g</span>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </Card>

                      <Card>
                        <div className="flex gap-1 mb-3">
                          <button onClick={() => setMundoAba("bola")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${mundoAba === "bola" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-zinc-800 text-zinc-500"}`}>🥇 Bola de Ouro</button>
                          <button onClick={() => setMundoAba("art")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${mundoAba === "art" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-zinc-800 text-zinc-500"}`}>⚽ Artilharia</button>
                          <button onClick={() => setMundoAba("pos")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${mundoAba === "pos" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-zinc-800 text-zinc-500"}`}>📋 Por posição</button>
                        </div>
                        {mundoAba === "bola" && (
                          <>
                            <p className="text-[10px] text-zinc-600 mb-2">Disputa da última temporada — todos são jogadores reais deste mundo.</p>
                            {bo.length ? bo.map((x, i) => <Linha key={i} x={x} campo="ovr" sufixo="" />) : <p className="text-xs text-zinc-500">Jogue uma temporada pra ver a disputa.</p>}
                          </>
                        )}
                        {mundoAba === "art" && (
                          <>
                            <p className="text-[10px] text-zinc-600 mb-2">Artilharia d{LIGAS[carreira.clube.liga].nome === "Premier League" ? "a" : "o"} {LIGAS[carreira.clube.liga].nome} na última temporada.</p>
                            {art.length ? art.map((x, i) => <Linha key={i} x={x} campo="gols" sufixo="g" />) : <p className="text-xs text-zinc-500">Sem dados ainda.</p>}
                          </>
                        )}
                        {mundoAba === "pos" && (
                          <>
                            <p className="text-[10px] text-zinc-600 mb-2">Melhores {POSICOES.find((p) => p.id === carreira.posicao)?.label}s do mundo hoje, por OVR.</p>
                            {rankPos.slice(0, Math.max(10, (meuRankPos?.pos || 0) + 2)).slice(0, 15).map((x, i) => <Linha key={i} x={x} campo="ovr" sufixo="" />)}
                          </>
                        )}
                      </Card>

                      <Card>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">👴 Lendas em atividade</div>
                        <p className="text-[10px] text-zinc-600 mb-2">Os maiores números de carreira entre quem ainda joga.</p>
                        <div className="grid gap-1">
                          {mundo.jogadores.filter((j) => !j.aposentado && j.carreira.jogos > 0).sort((a, b) => (b.carreira.gols + b.carreira.assist) - (a.carreira.gols + a.carreira.assist)).slice(0, 6).map((j) => (
                            <div key={j.id} className="flex items-center justify-between text-[11px] py-1">
                              <span className="text-zinc-300 truncate flex-1">{j.nome} <span className="text-zinc-600">· {j.clubeNome}, {j.idade}a</span></span>
                              <span className="font-mono text-zinc-400">{j.carreira.gols}g {j.carreira.assist}a</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  );
                })()}
              </div>
            )}

            {aba === "legado" && (
              <div className="tab-grid tab-grid-2col">
                <Card accent="linear-gradient(90deg,#ef4444,#3b82f6)">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">⚔️ Rivalidade da geração</div>
                  <div className="flex items-center justify-around text-center">
                    <div><SilhuetaJogador size={40} cor="#D8B44A" /><div className="text-xs font-bold mt-1">{nome}</div><div className="font-mono text-2xl text-amber-400">{carreira.bolasDeOuro}</div><div className="text-[8px] text-zinc-500 uppercase">Bolas de Ouro</div></div>
                    <div className="text-zinc-600 text-xl font-black">×</div>
                    <div><SilhuetaJogador size={40} cor="#6b7280" /><div className="text-xs font-bold mt-1">{carreira.rivalPosicao}</div><div className="font-mono text-2xl text-zinc-400">{carreira.rivalBolasDeOuro || 0}</div><div className="text-[8px] text-zinc-500 uppercase">Bolas de Ouro</div></div>
                  </div>
                  <p className="text-[10px] text-zinc-500 text-center mt-3">{carreira.bolasDeOuro > (carreira.rivalBolasDeOuro || 0) ? `Por enquanto, você está ganhando o debate da geração.` : carreira.bolasDeOuro < (carreira.rivalBolasDeOuro || 0) ? `${carreira.rivalPosicao} está na frente no debate — hora de reagir.` : "Empatados no debate do maior da geração."}</p>
                </Card>
                <Card accent="linear-gradient(90deg,#D8B44A,#6EE7F9)">
                  <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><TrophyIcon tipo="ouro" size={16} />Estante de troféus</div>
                  {Object.keys(carreira.titulosPorClube || {}).length === 0 && carreira.bolasDeOuro === 0 && (carreira.titulosSelecao || []).length === 0 && <p className="text-xs text-zinc-500">Ainda sem títulos na prateleira — a temporada começou faz pouco.</p>}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {Array.from({ length: carreira.bolasDeOuro }).map((_, i) => (
                      <div key={`bo-${i}`} className="flex flex-col items-center bg-zinc-950/50 border border-amber-500/30 rounded-sm p-2"><TrophyIcon tipo="ouro" size={30} /><span className="text-[8px] text-amber-400 mt-1 text-center">Bola de Ouro</span></div>
                    ))}
                    {(carreira.titulosSelecao || []).map((t, i) => (
                      <div key={`sel-${i}`} className="flex flex-col items-center bg-zinc-950/50 border border-blue-500/30 rounded-sm p-2"><TrophyIcon tipo="mundo" size={30} /><span className="text-[8px] text-blue-400 mt-1 text-center">{t}</span></div>
                    ))}
                    {Object.entries(carreira.titulosPorClube || {}).flatMap(([clubeNome, lista]) => lista.map((tit, i) => (
                      <div key={`${clubeNome}-${i}`} className="flex flex-col items-center bg-zinc-950/50 border border-zinc-700 rounded-sm p-2"><TrophyIcon tipo={tit.includes("Champions") || tit.includes("Libertadores") ? "prata" : "bronze"} size={30} /><span className="text-[8px] text-zinc-400 mt-1 text-center leading-tight">{tit}<br /><span className="text-zinc-600">{clubeNome}</span></span></div>
                    )))}
                  </div>
                </Card>
                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">📖 Sua passagem por clube — clique pra ver detalhes</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(carreira.camisaPorClube || {}).map(([clubeNome, numeros]) => {
                      const cl = CLUBES.find((c) => c.nome === clubeNome);
                      const titulosClube = (carreira.titulosPorClube || {})[clubeNome] || [];
                      const listaNumeros = Array.isArray(numeros) ? numeros : [numeros];
                      return (
                        <button key={clubeNome} onClick={() => setPopupClube(clubeNome)} className={`opt-card flex flex-col items-center bg-zinc-950/40 border rounded-sm p-3 hover:border-emerald-500/50 transition-all ${clubeNome === carreira.clube.nome ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800"}`}>
                          <ClubDot club={cl || { nome: clubeNome, cor: "#333" }} size={40} />
                          <div className="text-xs font-bold mt-1.5">{clubeNome}{clubeNome === carreira.clube.nome ? <span className="text-emerald-400"> (atual)</span> : ""}</div>
                          <div className="text-[9px] text-zinc-500">Camisa{listaNumeros.length > 1 ? "s" : ""} {listaNumeros.join(", ")}</div>
                          <div className="text-[9px] mt-0.5 text-center leading-tight">{titulosClube.length ? <span className="text-amber-400">🏆 {titulosClube.length} título{titulosClube.length > 1 ? "s" : ""}</span> : <span className="text-zinc-600">sem títulos aqui</span>}</div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
                <Card>
                  <div className="flex gap-1 mb-3">
                    <button onClick={() => setAbaLegado("coletivos")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "coletivos" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>🏆 Coletivos</button>
                    <button onClick={() => setAbaLegado("individuais")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "individuais" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>🥇 Individuais</button>
                    <button onClick={() => setAbaLegado("competicoes")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "competicoes" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>📊 Por competição</button>
                    <button onClick={() => setAbaLegado("classicos")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "classicos" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>⚔️ Jogos grandes</button>
                    <button onClick={() => setAbaLegado("marcos")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "marcos" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>📜 Linha do tempo</button>
                    <button onClick={() => setAbaLegado("recordes")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "recordes" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>🎯 Recordes</button>
                    <button onClick={() => setAbaLegado("memoraveis")} className={`px-3 py-1.5 text-[11px] rounded-sm border ${abaLegado === "memoraveis" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 text-zinc-500"}`}>⭐ Jogos inesquecíveis</button>
                  </div>
                  {abaLegado === "memoraveis" && (() => {
                    const mem = carreira.jogosMemoraveis || [];
                    const conf = melhoresEPioresConfrontos(carreira);
                    return (
                      <>
                        <p className="text-[10px] text-zinc-600 mb-2.5">As partidas que ficaram — e como você se sai contra cada adversário.</p>
                        {mem.length === 0 ? <p className="text-xs text-zinc-500 mb-3">Nenhum jogo memorável ainda. Faça um hat-trick, decida um clássico ou tire uma nota 8.8.</p> : (
                          <div className="grid gap-1.5 mb-4 max-h-[42vh] overflow-y-auto pr-1">
                            {mem.map((m) => (
                              <div key={m.id} className="border border-amber-500/25 bg-amber-500/5 rounded-sm p-2.5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold">{m.casa === false ? "✈️" : "🏠"} x {m.adversario} {m.classico && <span className="text-amber-400">⚔️</span>}</span>
                                  <span className="font-stat font-black text-sm" style={{ color: m.golsMeu > m.golsAdv ? "#12A876" : m.golsMeu === m.golsAdv ? "#a1a1aa" : "#D6483F" }}>{m.golsMeu}×{m.golsAdv}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-1">
                                  {m.criterios.map((cr) => <span key={cr.id} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-400">{cr.icone} {cr.label}</span>)}
                                </div>
                                <div className="text-[9px] text-zinc-500">{m.temporadaLabel} · {m.clube} · {m.idade} anos · {m.golsMinha}G {m.assistMinha}A · nota {m.nota}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {conf.todos.length > 0 && (
                          <>
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5 border-t border-zinc-800 pt-2.5">⚔️ Contra quem você joga melhor</div>
                            <div className="grid gap-0.5">
                              {conf.todos.slice(0, 10).map((x) => (
                                <div key={x.nome} className="flex items-center gap-2 text-[10px] px-1.5 py-1 rounded-sm hover:bg-white/5">
                                  <span className="flex-1 truncate text-zinc-300">{x.nome}</span>
                                  <span className="font-mono text-zinc-600">{x.jogos}J</span>
                                  <span className="font-mono w-14 text-right"><span className="text-emerald-400">{x.v}</span>-<span className="text-zinc-500">{x.e}</span>-<span className="text-red-400">{x.d}</span></span>
                                  <span className="font-mono text-zinc-400 w-8 text-right">{x.gols}g</span>
                                  <span className="font-mono w-9 text-right" style={{ color: x.aproveitamento >= 60 ? "#12A876" : x.aproveitamento <= 35 ? "#D6483F" : "#a1a1aa" }}>{x.aproveitamento}%</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                  {abaLegado === "marcos" && (
                    <>
                      <p className="text-[10px] text-zinc-600 mb-2.5">Os momentos que definiram sua carreira, do primeiro dia até aqui.</p>
                      {(carreira.marcos || []).length === 0 ? <p className="text-xs text-zinc-500">Nenhum marco registrado ainda.</p> : (
                        <div className="grid gap-0 max-h-[55vh] overflow-y-auto pr-1">
                          {[...(carreira.marcos || [])].reverse().map((m, i) => {
                            const t = TIPOS_MARCO[m.tipo] || TIPOS_MARCO.recorde;
                            return (
                              <div key={i} className="flex gap-2.5 pb-3 relative">
                                <div className="flex flex-col items-center shrink-0">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0" style={{ background: `${t.cor}22`, border: `1px solid ${t.cor}66` }}>{t.icone}</div>
                                  {i < (carreira.marcos || []).length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "#27272a" }} />}
                                </div>
                                <div className="flex-1 -mt-0.5">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-[9px] font-mono text-zinc-600">{m.idade} anos</span>
                                    <span className="text-[8px] uppercase tracking-widest" style={{ color: t.cor }}>{t.label}</span>
                                  </div>
                                  <p className="text-[11px] text-zinc-300 leading-snug">{m.texto}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                  {abaLegado === "recordes" && (
                    <>
                      <p className="text-[10px] text-zinc-600 mb-2.5">Sua marca em cada clube — e quanto falta pra entrar na história deles.</p>
                      <div className="grid gap-2">
                        {Object.entries(carreira.statsPorClube || {}).length === 0 && <p className="text-xs text-zinc-500">Jogue uma temporada pra começar a construir seus números.</p>}
                        {Object.entries(carreira.statsPorClube || {}).sort((a, b) => b[1].gols - a[1].gols).map(([clubeNome, st]) => {
                          const rec = (carreira.recordesClube || {})[clubeNome];
                          const faltam = rec ? rec.gols - st.gols + 1 : null;
                          const pct = rec ? clamp((st.gols / Math.max(1, rec.gols + 1)) * 100, 0, 100) : 0;
                          const cl = CLUBES.find((x) => x.nome === clubeNome);
                          return (
                            <div key={clubeNome} className="border border-zinc-800 rounded-sm p-2.5">
                              <div className="flex items-center gap-2 mb-1.5">
                                <ClubDot club={cl} size={18} />
                                <span className="text-xs font-bold flex-1">{clubeNome}</span>
                                <span className="text-[10px] font-mono text-zinc-400">{st.temporadas} temp.</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 text-center mb-2">
                                <div><div className="font-mono text-sm font-bold">{st.jogos}</div><div className="text-[8px] text-zinc-500 uppercase">Jogos</div></div>
                                <div><div className="font-mono text-sm font-bold">{st.gols}</div><div className="text-[8px] text-zinc-500 uppercase">Gols</div></div>
                                <div><div className="font-mono text-sm font-bold">{st.assist}</div><div className="text-[8px] text-zinc-500 uppercase">Assist.</div></div>
                                <div><div className="font-mono text-sm font-bold">{st.titulos}</div><div className="text-[8px] text-zinc-500 uppercase">Títulos</div></div>
                              </div>
                              {rec && (rec.quebrado ? (
                                <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-sm px-2 py-1">
                                  📜 MAIOR ARTILHEIRO DA HISTÓRIA do clube — recorde quebrado aos {rec.idadeQuebra} anos
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
                                    <span>Recorde do clube: {rec.gols} gols</span>
                                    <span>{faltam > 0 ? `faltam ${faltam}` : "alcançado!"}</span>
                                  </div>
                                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? "#D8B44A" : "#12A876" }} /></div>
                                </>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                      {(() => {
                        const melhor = temporadas.reduce((a, t) => (!a || t.gols > a.gols ? t : a), null);
                        const maisAssist = temporadas.reduce((a, t) => (!a || t.assist > a.assist ? t : a), null);
                        const melhorNota = temporadas.reduce((a, t) => (!a || t.nota > a.nota ? t : a), null);
                        if (!melhor) return null;
                        return (
                          <div className="border-t border-zinc-800 mt-3 pt-2.5">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">Recordes pessoais</div>
                            <div className="grid gap-0.5 text-[10px] text-zinc-400">
                              <div>⚽ Mais gols numa temporada: <strong className="text-zinc-200">{melhor.gols}</strong> ({melhor.temporadaLabel}, {melhor.clube})</div>
                              <div>🎯 Mais assistências: <strong className="text-zinc-200">{maisAssist.assist}</strong> ({maisAssist.temporadaLabel})</div>
                              <div>⭐ Melhor nota de temporada: <strong className="text-zinc-200">{melhorNota.nota}</strong> ({melhorNota.temporadaLabel})</div>
                              {carreira.valorPico > 0 && <div>💰 Maior valor de mercado: <strong className="text-zinc-200">${formatarDinheiro(carreira.valorPico)}</strong></div>}
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                  {abaLegado === "classicos" && (() => {
                    const todos = todosJogosCarreira(temporadas);
                    const an = analisarJogos(todos);
                    if (!an) return <p className="text-xs text-zinc-500">Ainda não há partidas registradas. Jogue temporadas no modo jogo a jogo pra alimentar essa análise.</p>;
                    const Bloco = ({ titulo, d, cor }) => (
                      <div className="border border-zinc-800 rounded-sm p-2.5">
                        <div className="text-[10px] font-bold mb-1.5" style={{ color: cor }}>{titulo}</div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                          <span className="text-zinc-500">Jogos</span><span className="font-mono text-right">{d.jogos}</span>
                          <span className="text-zinc-500">V / E / D</span><span className="font-mono text-right">{d.v}/{d.e}/{d.d}</span>
                          <span className="text-zinc-500">Gols / Assist.</span><span className="font-mono text-right">{d.gols} / {d.assist}</span>
                          <span className="text-zinc-500">Aproveitamento</span><span className="font-mono text-right">{d.aproveitamento}%</span>
                          <span className="text-zinc-500">Nota média</span><span className="font-mono text-right font-bold" style={{ color: d.notaMedia >= 7.2 ? "#12A876" : d.notaMedia >= 6.5 ? "#D8B44A" : "#D6483F" }}>{d.notaMedia}</span>
                        </div>
                      </div>
                    );
                    const diff = an.classicos.jogos ? +(an.classicos.notaMedia - an.normais.notaMedia).toFixed(2) : 0;
                    return (
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Bloco titulo="⚔️ Clássicos e jogos grandes" d={an.classicos} cor="#D8B44A" />
                          <Bloco titulo="Demais partidas" d={an.normais} cor="#a1a1aa" />
                        </div>
                        {an.classicos.jogos >= 3 && (
                          <div className={`text-[11px] px-3 py-2 rounded-sm border ${diff >= 0.15 ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : diff <= -0.15 ? "border-red-500/30 bg-red-500/5 text-red-400" : "border-zinc-800 text-zinc-400"}`}>
                            {diff >= 0.15 ? `🦁 Jogador de decisão: você rende ${Math.abs(diff)} a mais nos jogos grandes.`
                              : diff <= -0.15 ? `😬 Você sente o peso dos jogos grandes: rende ${Math.abs(diff)} a menos neles.`
                              : "😐 Seu rendimento é praticamente o mesmo em jogos grandes e comuns."}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <Bloco titulo="🏠 Em casa" d={an.casa} cor="#12A876" />
                          <Bloco titulo="✈️ Fora de casa" d={an.fora} cor="#3b82f6" />
                        </div>
                        {an.melhor && (
                          <div className="text-[10px] text-zinc-400 border-t border-zinc-800 pt-2">
                            ⭐ Melhor atuação da carreira: <strong>x {an.melhor.adversario}</strong> ({an.melhor.golsMeu}-{an.melhor.golsAdv}) pelo {an.melhor.clube} em {an.melhor.temporadaLabel} — nota <strong className="text-emerald-400">{an.melhor.nota}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {abaLegado === "competicoes" && (() => {
                    const linhas = agregarPorCompeticao(temporadas);
                    if (!linhas.length) return <p className="text-xs text-zinc-500">Ainda não há temporadas registradas.</p>;
                    const clube = linhas.filter((l) => !l.selecao);
                    const selecao = linhas.filter((l) => l.selecao);
                    const totalClube = clube.reduce((a, l) => ({ jogos: a.jogos + l.jogos, gols: a.gols + l.gols, assist: a.assist + l.assist, cleanSheets: a.cleanSheets + l.cleanSheets }), { jogos: 0, gols: 0, assist: 0, cleanSheets: 0 });
                    const Linha = ({ l }) => (
                      <React.Fragment>
                        <span style={{ color: l.cor }} className="truncate">{l.icone} {l.nome}</span>
                        <span className="font-mono text-right text-zinc-300">{l.jogos}</span>
                        <span className="font-mono text-right text-zinc-300">{posicao === "GOL" ? l.cleanSheets : l.gols}</span>
                        <span className="font-mono text-right text-zinc-300">{l.assist}</span>
                        <span className="font-mono text-right text-zinc-400">{l.notaMedia}</span>
                      </React.Fragment>
                    );
                    return (
                      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 gap-y-1 text-[11px] items-center">
                        <span className="text-zinc-600 uppercase text-[8px]">Competição</span>
                        <span className="text-zinc-600 uppercase text-[8px] text-right">J</span>
                        <span className="text-zinc-600 uppercase text-[8px] text-right">{posicao === "GOL" ? "CS" : "G"}</span>
                        <span className="text-zinc-600 uppercase text-[8px] text-right">A</span>
                        <span className="text-zinc-600 uppercase text-[8px] text-right">Nota</span>
                        {clube.map((l) => <Linha key={l.nome} l={l} />)}
                        <span className="font-bold text-emerald-400 border-t border-zinc-800 pt-1 mt-0.5">Total por clubes</span>
                        <span className="font-mono text-right font-bold text-emerald-400 border-t border-zinc-800 pt-1 mt-0.5">{totalClube.jogos}</span>
                        <span className="font-mono text-right font-bold text-emerald-400 border-t border-zinc-800 pt-1 mt-0.5">{posicao === "GOL" ? totalClube.cleanSheets : totalClube.gols}</span>
                        <span className="font-mono text-right font-bold text-emerald-400 border-t border-zinc-800 pt-1 mt-0.5">{totalClube.assist}</span>
                        <span className="border-t border-zinc-800 pt-1 mt-0.5" />
                        {selecao.length > 0 && <span className="col-span-5 text-[8px] uppercase tracking-widest text-zinc-600 mt-1.5">Seleção</span>}
                        {selecao.map((l) => <Linha key={l.nome} l={l} />)}
                      </div>
                    );
                  })()}
                  {abaLegado === "coletivos" && (
                    <div className="grid gap-1.5">
                      {Object.keys(titulosColetivosAgrupados).length === 0 && <p className="text-xs text-zinc-500">Nenhum título coletivo ainda.</p>}
                      {Object.entries(titulosColetivosAgrupados).map(([nome, lista]) => (
                        <button key={nome} onClick={() => setPopupPremio({ nome, lista })} className="flex justify-between items-center text-xs px-3 py-2 border border-zinc-800 rounded-sm hover:border-emerald-500">
                          <span className="flex items-center gap-2"><TrophyIcon tipo="bronze" size={16} />{nome}</span><span className="font-mono text-zinc-500">×{lista.length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {abaLegado === "individuais" && (
                    <div className="grid gap-1.5">
                      {Object.keys(premiosIndividuaisAgrupados).length === 0 && <p className="text-xs text-zinc-500">Nenhum prêmio individual ainda.</p>}
                      {Object.entries(premiosIndividuaisAgrupados).map(([nome, lista]) => (
                        <button key={nome} onClick={() => setPopupPremio({ nome, lista })} className="flex justify-between items-center text-xs px-3 py-2 border border-zinc-800 rounded-sm hover:border-emerald-500">
                          <span className="flex items-center gap-2"><TrophyIcon tipo={nome.includes("OURO") ? "ouro" : nome.includes("Prata") ? "prata" : "bronze"} size={16} />{nome}</span><span className="font-mono text-zinc-500">×{lista.length}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>

                <Card>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">🎨 Itens de marco desbloqueados</div>
                  <p className="text-[10px] text-zinc-600 mb-3">Cada item carrega um efeito real — atributo, fama, torcida ou confiança do técnico.</p>
                  {(carreira.cosmeticosDesbloqueados || []).length === 0 && <p className="text-xs text-zinc-500 mb-2">Nenhum item desbloqueado ainda — conquiste títulos, prêmios e fama pra liberar.</p>}
                  <div className="grid gap-1.5 mb-3">
                    {COSMETICOS.filter((it) => (carreira.cosmeticosDesbloqueados || []).includes(it.id)).map((it) => (
                      <div key={it.id} className="text-[11px] px-2.5 py-1.5 border border-amber-500/30 rounded-sm bg-amber-500/5">
                        <div className="font-bold">{it.icone} {it.nome} <span className="text-zinc-500 font-normal">· {it.categoria}</span></div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{it.desc}</div>
                      </div>
                    ))}
                  </div>
                  {COSMETICOS.some((it) => !(carreira.cosmeticosDesbloqueados || []).includes(it.id)) && (
                    <>
                      <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">🔒 Ainda por vir</div>
                      <div className="grid gap-1">
                        {COSMETICOS.filter((it) => !(carreira.cosmeticosDesbloqueados || []).includes(it.id)).map((it) => (
                          <div key={it.id} className="text-[10px] px-2.5 py-1.5 border border-zinc-800 rounded-sm text-zinc-600">🔒 {it.nome}</div>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="text-[9px] text-zinc-600 mt-2">{(carreira.cosmeticosDesbloqueados || []).length}/{COSMETICOS.length} itens liberados</p>
                </Card>
              </div>
            )}

            {aba === "midia" && (
              <div className="tab-grid">
                <Card className="text-center" accent="linear-gradient(90deg,#833AB4,#E1306C,#FCAF45)">
                  <SilhuetaJogador size={64} cor="#E1306C" />
                  <div className="font-bold text-sm mt-2">@{nome.toLowerCase().replace(/\s+/g, "")}</div>
                  <div className="flex justify-center gap-6 mt-2 text-xs mb-3">
                    <div><div className="font-bold font-mono">{temporadas.length * 2 + 1}</div><div className="text-zinc-500">posts</div></div>
                    <div><div className="font-bold font-mono"><CountUp value={carreira.seguidores || 0} formatter={(v) => v.toLocaleString("pt-BR")} /></div><div className="text-zinc-500">seguidores</div></div>
                    <div><div className="font-bold font-mono">{Math.round(carreira.fama / 10)}</div><div className="text-zinc-500">seguindo</div></div>
                  </div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">Fama</span><span className="font-mono text-pink-400">{Math.round(carreira.fama)}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2"><div className="h-full rounded-full bg-pink-500" style={{ width: `${carreira.fama}%` }} /></div>
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">🔥 Calor da mídia</span><span className="font-mono" style={{ color: (carreira.calorMidia ?? 20) >= 80 ? "#D6483F" : (carreira.calorMidia ?? 20) >= 50 ? "#f59e0b" : "#12A876" }}>{Math.round(carreira.calorMidia ?? 20)}</span></div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${carreira.calorMidia ?? 20}%`, background: (carreira.calorMidia ?? 20) >= 80 ? "#D6483F" : (carreira.calorMidia ?? 20) >= 50 ? "#f59e0b" : "#12A876" }} /></div>
                  {(carreira.calorMidia ?? 20) >= 70 && <p className="text-[10px] text-red-400 mt-1">Muita exposição — risco de escândalo se continuar subindo.</p>}
                </Card>

                {ultima && (
                  <Card className={ultima.nota >= 7.3 ? "border-emerald-500/30" : ultima.nota <= 6.3 ? "border-red-500/30" : ""}>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Mensagens de torcedores</div>
                    <p className="text-[10px] text-zinc-600 mb-2.5">Você pode responder — mas cuidado: o que você escreve vira notícia.</p>
                    <div className="space-y-1.5">
                      {(ultima.nota >= 7.3 ? FAN_MSGS_POS : ultima.nota <= 6.3 ? FAN_MSGS_NEG : ["Temporada ok, vamos que vamos pro próximo ano."]).slice(0, 3).map((m, i) => {
                        const hater = ultima.nota <= 6.3;
                        const jaRespondi = (carreira.respostasFas || []).includes(`${ultima.temporadaLabel}_${i}`);
                        return (
                          <div key={i} className="bg-zinc-950/40 rounded-sm px-2.5 py-2">
                            <div className="text-[11px]"><span className="font-bold" style={{ color: hater ? "#D6483F" : "#12A876" }}>@torcedor{i + 1}: </span><span className="text-zinc-300">{m}</span></div>
                            {jaRespondi ? (
                              <div className="text-[10px] text-zinc-600 mt-1.5 pl-3 border-l border-zinc-800">✓ você já respondeu</div>
                            ) : (
                              <button onClick={() => setRespostaFa({ id: `${ultima.temporadaLabel}_${i}`, msg: m, hater, autor: `@torcedor${i + 1}` })}
                                className="text-[10px] mt-1.5 text-zinc-400 border border-zinc-700 rounded-sm px-2 py-1 hover:border-pink-500 hover:text-pink-400">
                                💬 Responder
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {respostaFa && (
                  <PopupOverlay onClose={() => setRespostaFa(null)}>
                    <Card className="border-pink-500/40">
                      <div className="text-[10px] text-pink-400 uppercase tracking-widest mb-2">💬 Responder {respostaFa.autor}</div>
                      <div className="bg-zinc-950/50 rounded-sm px-3 py-2 mb-3">
                        <span className="text-[11px] font-bold" style={{ color: respostaFa.hater ? "#D6483F" : "#12A876" }}>{respostaFa.autor}: </span>
                        <span className="text-[11px] text-zinc-300">{respostaFa.msg}</span>
                      </div>
                      <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">Como você responde?</div>
                      <div className="grid gap-1.5">
                        {(respostaFa.hater ? RESPOSTAS_HATER : RESPOSTAS_FA).map((r) => (
                          <button key={r.id} onClick={() => responderTorcedor(r)} className="text-left px-3 py-2.5 rounded-sm border transition-all" style={{ borderColor: `${r.cor}44` }}>
                            <div className="text-xs font-bold" style={{ color: r.cor }}>{r.icone} {r.label}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5 italic">"{r.texto}"</div>
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5">
                              {Object.entries(r.efeito).filter(([, v]) => v).map(([k, v]) => {
                                const rot = { fama: "Fama", torcida: "Torcida", calorMidia: "Pressão", elenco: "Elenco", seguidores: "Seguidores" }[k] || k;
                                const ruim = k === "calorMidia" ? v > 0 : v < 0;
                                return <span key={k} className={`text-[9px] font-mono ${ruim ? "text-red-400" : "text-emerald-400"}`}>{rot} {v > 0 ? "+" : ""}{k === "seguidores" ? `${v}%` : v}</span>;
                              })}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3"><Button variant="ghost" onClick={() => setRespostaFa(null)}>Deixar quieto</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                <Card className="border-pink-500/30">
                  <div className="text-[10px] text-pink-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">📱 O que postar essa temporada?</div>
                  <p className="text-[11px] text-zinc-500 mb-3">Cada post pesa de um jeito diferente — 1 por temporada.</p>
                  <div className="grid gap-1.5">
                    <button onClick={() => postarSocial("treino")} disabled={carreira.postSocialFeito} className="opt-card flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-pink-500 disabled:opacity-40 text-left gap-2">
                      <span>🏋️ Story do treino</span><span className="text-[9px] text-zinc-500 text-right">+fama, +calor (mais se já tiver alto)</span>
                    </button>
                    <button onClick={() => postarSocial("familia")} disabled={carreira.postSocialFeito} className="opt-card flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-pink-500 disabled:opacity-40 text-left gap-2">
                      <span>👨‍👩‍👧 Momento em família</span><span className="text-[9px] text-zinc-500 text-right">+energia, −fama</span>
                    </button>
                    <button onClick={() => postarSocial("resposta")} disabled={carreira.postSocialFeito} className="opt-card flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-pink-500 disabled:opacity-40 text-left gap-2">
                      <span>🎙️ Responder a crítica</span><span className="text-[9px] text-zinc-500 text-right">bom se calor baixo, ruim se já tá alto</span>
                    </button>
                    <button onClick={() => postarSocial("patrocinado")} disabled={carreira.postSocialFeito || carreira.fama < 35 || (carreira.seguidores || 0) < 200000} className="opt-card flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-pink-500 disabled:opacity-40 text-left gap-2">
                      <span>💰 Post patrocinado{(carreira.fama < 35 || (carreira.seguidores || 0) < 200000) ? " 🔒" : ""}</span><span className="text-[9px] text-zinc-500 text-right">{(carreira.fama < 35 || (carreira.seguidores || 0) < 200000) ? "precisa de mais fama/seguidores" : "+dinheiro, +calor"}</span>
                    </button>
                    <button onClick={() => postarSocial("elogio")} disabled={carreira.postSocialFeito} className="opt-card flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-pink-500 disabled:opacity-40 text-left gap-2">
                      <span>❤️ Elogiar o clube e a torcida</span><span className="text-[9px] text-zinc-500 text-right">+torcida, +diretoria</span>
                    </button>
                  </div>
                  {carreira.postSocialFeito && <p className="text-[10px] text-zinc-600 mt-2">Já postou essa temporada — na próxima tem mais.</p>}
                </Card>

                <Card className="border-red-500/30">
                  <div className="text-[10px] text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">⚔️ Rivalidade em alta — {carreira.rivalPosicao}</div>
                  <p className="text-[11px] text-zinc-500 mb-3">O rival muda conforme você troca de liga ou sobe de patamar — hoje, {carreira.rivalPosicao} é quem disputa os holofotes com você.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" onClick={provocarRival}>🔥 Provocar</Button>
                    <Button variant="ghost" onClick={amenizarRival}>🕊️ Amenizar</Button>
                  </div>
                </Card>

                <div className="grid gap-3">
                  {[...(carreira.historico || [])].reverse().slice(0, 8).map((h, i) => {
                    const likes = Math.round((carreira.seguidores || 10000) * (0.02 + Math.random() * 0.06));
                    const clubeComentou = Math.random() < 0.4;
                    const img = imagemPost(h.txt);
                    return (
                      <Card key={i} className="p-0 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800"><SilhuetaJogador size={22} cor="#E1306C" /><span className="text-xs font-bold">@{nome.toLowerCase().replace(/\s+/g, "")}</span></div>
                        <div className="h-28 flex items-center justify-center text-4xl" style={{ background: img.bg }}>{img.emoji}</div>
                        <div className="px-3 py-2">
                          <div className="text-xs">❤️ {likes.toLocaleString("pt-BR")} curtidas</div>
                          <div className="text-[11px] text-zinc-400 mt-0.5"><strong>@{nome.toLowerCase().replace(/\s+/g, "")}</strong> {h.txt}</div>
                          {clubeComentou && <div className="text-[10px] text-blue-400 mt-1">@{carreira.clube.nome.toLowerCase().replace(/\s+/g, "")} comentou: 🔥🔥🔥</div>}
                        </div>
                      </Card>
                    );
                  })}
                  {(carreira.historico || []).length === 0 && <p className="text-xs text-zinc-500 text-center">Nenhum post ainda — os destaques da carreira viram post automaticamente.</p>}
                </div>
              </div>
            )}

            {aba === "vidaprivada" && (
              <div className="tab-grid">
                <Card accent="linear-gradient(90deg,#12A876,#D8B44A)">
                  <div className="text-center mb-4"><div className="text-[10px] text-zinc-500 uppercase tracking-widest">Total acumulado</div><div className="display text-3xl font-black text-emerald-400">${formatarDinheiro(carreira.cofre)}</div></div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Extrato</div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {[...carreira.extrato].reverse().slice(0, 30).map((e, i) => (
                      <div key={i} className="flex justify-between text-xs border-b border-zinc-800/50 py-1">
                        <span className="text-zinc-400">{e.idade}a · {e.tipo}{e.clube ? ` (${e.clube})` : ""}</span>
                        <span className={`font-mono ${e.valor < 0 ? "text-red-400" : "text-emerald-400"}`}>{e.valor < 0 ? "-" : "+"}${formatarDinheiro(Math.abs(e.valor))}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {ultima && (() => {
                  const extratoTemporada = carreira.extrato.filter((e) => e.idade === ultima.idade);
                  const receitas = extratoTemporada.filter((e) => e.valor > 0).reduce((s, e) => s + e.valor, 0);
                  const despesas = extratoTemporada.filter((e) => e.valor < 0).reduce((s, e) => s + Math.abs(e.valor), 0);
                  return (
                    <Card>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">📑 Balanço da temporada {ultima.temporadaLabel}</div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Receitas</div><div className="font-mono text-emerald-400 font-bold">+${formatarDinheiro(receitas)}</div></div>
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="text-[9px] text-zinc-500 uppercase">Despesas</div><div className="font-mono text-red-400 font-bold">-${formatarDinheiro(despesas)}</div></div>
                      </div>
                      <div className="text-center text-xs">Saldo da temporada: <strong className={receitas - despesas >= 0 ? "text-emerald-400" : "text-red-400"}>{receitas - despesas >= 0 ? "+" : ""}${formatarDinheiro(receitas - despesas)}</strong></div>
                    </Card>
                  );
                })()}

                {(() => {
                  const ost = efeitosOstentacao(carreira);
                  const fisicoBens = (carreira.posses || []).reduce((s, p) => s + (p.efeitoFisico || 0), 0);
                  return (
                    <Card>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">💸 Padrão de vida</div>
                        <span className="text-xs font-bold" style={{ color: ost.cor }}>{ost.label}</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2.5">
                        <div className="h-full rounded-full transition-all" style={{ width: `${ost.nivel}%`, background: ost.cor }} />
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] mb-2">
                        <div className="flex justify-between"><span className="text-zinc-500">💼 Patrocinadores</span><span className="font-mono text-emerald-400">+{ost.patrocinio}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">👥 Elenco</span><span className={`font-mono ${ost.elenco < 0 ? "text-red-400" : "text-zinc-500"}`}>{ost.elenco || 0}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">📣 Torcida</span><span className={`font-mono ${ost.torcida < 0 ? "text-red-400" : "text-zinc-500"}`}>{ost.torcida || 0}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">🩺 Desgaste/ano</span><span className={`font-mono ${(ost.desgaste + fisicoBens) > 0 ? "text-red-400" : (ost.desgaste + fisicoBens) < 0 ? "text-emerald-400" : "text-zinc-500"}`}>{(ost.desgaste + fisicoBens) > 0 ? "+" : ""}{(ost.desgaste + fisicoBens).toFixed(2)}</span></div>
                      </div>
                      {ost.alerta && <p className="text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/5 rounded-sm px-2 py-1.5 mb-2">⚠️ {ost.alerta}</p>}
                      <p className="text-[9px] text-zinc-600">Joias, carros e luxo aumentam o padrão; ações sociais e investimento no clube reduzem. Um clube grande tolera mais ostentação que um clube pequeno.</p>
                      {(() => {
                        const disp = patrocinadoresDisponiveis(carreira);
                        const luxo = disp.filter((p) => p.perfil === "luxo"), fam = disp.filter((p) => p.perfil === "familia");
                        return (
                          <div className="border-t border-zinc-800 mt-2.5 pt-2">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Marcas de olho em você</div>
                            <div className="flex flex-wrap gap-1">
                              {disp.map((p) => <span key={p.marca} className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: p.perfil === "luxo" ? "#EC489922" : p.perfil === "familia" ? "#12A87622" : "#3f3f4644", color: p.perfil === "luxo" ? "#EC4899" : p.perfil === "familia" ? "#12A876" : "#a1a1aa" }}>{p.marca}</span>)}
                            </div>
                            {!luxo.length && <p className="text-[9px] text-zinc-600 mt-1">Marcas de luxo só procuram quem tem padrão de vida de estrela (45+).</p>}
                            {!fam.length && <p className="text-[9px] text-zinc-600 mt-1">Marcas familiares evitam quem ostenta demais ou vive em polêmica.</p>}
                          </div>
                        );
                      })()}
                    </Card>
                  );
                })()}

                {(carreira.posses || []).length > 0 && (() => {
                  const manutTotal = carreira.posses.reduce((a2, p) => a2 + (p.manutencao || 0), 0);
                  const valorTotal = carreira.posses.reduce((a2, p) => a2 + (p.custo || 0), 0);
                  return (
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">🛍️ Seus bens</div>
                        <span className="text-[10px] text-zinc-500">{carreira.posses.length} itens</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2.5">
                        <div className="bg-zinc-950/40 rounded-sm p-2 text-center">
                          <div className="font-mono text-sm font-bold text-amber-400">${formatarDinheiro(valorTotal)}</div>
                          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Patrimônio em bens</div>
                        </div>
                        <div className="bg-zinc-950/40 rounded-sm p-2 text-center">
                          <div className="font-mono text-sm font-bold text-red-400">${formatarDinheiro(manutTotal)}</div>
                          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Manutenção/ano</div>
                        </div>
                      </div>
                      <button onClick={() => setItensCompradosAberto(true)} className="w-full text-[11px] text-emerald-400 border border-emerald-500/40 rounded-sm py-2 hover:bg-emerald-500/10">
                        📦 Ver todos os itens comprados →
                      </button>
                    </Card>
                  );
                })()}

                {itensCompradosAberto && (
                  <PopupOverlay largo onClose={() => setItensCompradosAberto(false)}>
                    <Card className="border-emerald-500/40">
                      <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">📦 Itens comprados</div>
                      <p className="text-[10px] text-zinc-600 mb-3">Tudo que você adquiriu, organizado por categoria. A manutenção sai do cofre todo ano.</p>
                      {["Estrutura do Clube", "Imóveis", "Garagem", "Joias", "Luxo"].map((cat) => {
                        const itens = (carreira.posses || []).filter((p) => p.categoria === cat);
                        if (!itens.length) return null;
                        const totalCat = itens.reduce((a2, p) => a2 + (p.custo || 0), 0);
                        return (
                          <div key={cat} className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] text-zinc-600 uppercase tracking-widest">{cat}</span>
                              <span className="text-[9px] text-zinc-600">{itens.length} itens · ${formatarDinheiro(totalCat)}</span>
                            </div>
                            <div className="lista-cards">
                              {itens.map((p) => (
                                <div key={p.compraId} className="border border-zinc-800 rounded-sm px-3 py-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold">{p.icone} {p.nome}</div>
                                      <div className="text-[9px] text-zinc-500 mt-0.5">
                                        ${formatarDinheiro(p.custo)}
                                        {p.manutencao > 0 && <span> · manutenção ${formatarDinheiro(p.manutencao)}/ano</span>}
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {p.comercial && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-blue-500/15 text-blue-400">gera renda</span>}
                                        {p.clubeDono && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-400">🔒 {p.clubeDono}</span>}
                                        {p.efeitoFisico != null && <span className={`text-[8px] px-1.5 py-0.5 rounded-sm ${p.efeitoFisico < 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>🩺 {p.efeitoFisico < 0 ? "−" : "+"}{Math.abs(p.efeitoFisico)} desgaste</span>}
                                        {PESO_OSTENTACAO[p.categoria] > 0 && <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-pink-500/15 text-pink-400">💸 ostentação</span>}
                                      </div>
                                    </div>
                                    {p.categoria !== "Estrutura do Clube" && (
                                      <button onClick={() => venderItem(p.compraId)} className="text-[9px] text-red-400 border border-red-500/30 rounded-sm px-2 py-1 hover:bg-red-500/10 shrink-0">
                                        Vender<br />${formatarDinheiro(Math.round(p.custo * 0.5))}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-2"><Button variant="ghost" onClick={() => setItensCompradosAberto(false)}>Fechar</Button></div>
                    </Card>
                  </PopupOverlay>
                )}

                {Object.keys(carreira.staffContratos || {}).length > 0 && (
                  <Card>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">🧑‍💼 Equipe sob contrato</div>
                    <div className="grid gap-1.5">
                      {Object.entries(carreira.staffContratos).map(([id, contrato]) => {
                        const item = LOJA_ITENS.find((it) => it.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800">
                            <span>{item.icone} {item.nome} <span className="text-zinc-500">· manutenção ${formatarDinheiro(contrato.manutencao)}/ano</span></span>
                            <span className={`text-[10px] font-bold ${contrato.restantes <= 1 ? "text-red-400" : "text-emerald-400"}`}>{contrato.restantes} temp. restante(s)</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                <Card accent="linear-gradient(90deg,#3b82f6,#8b5cf6)">
                  <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">📈 Investimentos</div>
                  <p className="text-[11px] text-zinc-500 mb-2">Resultado é aleatório e depende do perfil de risco escolhido.</p>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {Object.entries(PERFIS_INVESTIMENTO).map(([id, p]) => (
                      <button key={id} onClick={() => setPerfilInvestimento(id)} className={`opt-card text-left px-2 py-1.5 rounded-sm border text-[10px] ${perfilInvestimento === id ? "border-blue-500 bg-blue-500/10" : "border-zinc-800"}`}>
                        <div className="font-bold">{p.label}</div>
                        <div className="text-zinc-500 text-[9px]">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[20, 50, 100].map((v) => <button key={v} onClick={() => investir(v, perfilInvestimento)} disabled={carreira.cofre < v} className="px-2 py-2 text-xs rounded-sm border border-zinc-800 hover:border-blue-500 disabled:opacity-40">Investir ${formatarDinheiro(v)}</button>)}
                  </div>
                </Card>

                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 mb-1">Categorias da loja</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Estrutura do Clube", "🏟️"], ["Garagem", "🚗"], ["Imóveis", "🏠"], ["Joias", "💎"],
                    ["Luxo", "🥂"], ["Ações Sociais", "🤝"], ["Staff", "🧑‍💼"],
                  ].map(([cat, icone]) => {
                    const itens = LOJA_ITENS.filter((it) => it.categoria === cat);
                    const possuidos = cat === "Staff"
                      ? itens.filter((it) => !!carreira.staff?.[it.id]).length
                      : cat === "Estrutura do Clube"
                      ? (carreira.posses || []).filter((p) => p.categoria === "Estrutura do Clube" && p.clubeDono === carreira.clube.nome).length
                      : 0;
                    return (
                      <button key={cat} onClick={() => setLojaCategoriaAberta(cat)} className="opt-card glass rounded-md px-3 py-3 text-left border border-white/10 hover:border-emerald-500/60">
                        <div className="text-xl mb-1">{icone}</div>
                        <div className="text-xs font-sport font-bold">{cat === "Staff" ? "Equipe & estilo de vida" : cat}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5">{itens.length} itens{possuidos ? ` · ${possuidos} ${cat === "Staff" ? "sob contrato" : "no " + carreira.clube.nome}` : ""}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {savesAberto && (
          <PopupOverlay onClose={() => setSavesAberto(false)}>
            <Card className="border-emerald-500/40">
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">💾 Carreiras salvas</div>
              <p className="text-[10px] text-zinc-600 mb-3">O jogo salva sozinho no fim de cada temporada. Use os espaços 1, 2 e 3 pra guardar momentos específicos.</p>
              <div className="grid gap-1.5 mb-3">
                {listarSaves().map(({ slot, existe, resumo }) => (
                  <div key={slot} className={`border rounded-sm p-2.5 ${existe ? "border-zinc-700" : "border-zinc-800 border-dashed"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold" style={{ color: slot === "auto" ? "#D8B44A" : "#e4e4e7" }}>
                        {slot === "auto" ? "⚡ Automático" : `💾 Espaço ${slot}`}
                      </span>
                      {existe && <span className="text-[9px] text-zinc-600">{formatarData(resumo.salvoEm)}</span>}
                    </div>
                    {existe ? (
                      <>
                        <div className="text-[11px] text-zinc-300">{resumo.nome} · {resumo.posicao} · {resumo.idade} anos</div>
                        <div className="text-[10px] text-zinc-500">{resumo.encerrada ? "Carreira encerrada" : resumo.clube} · {resumo.temporadas} temporada(s)</div>
                        <div className="flex gap-1.5 mt-2">
                          <button onClick={() => carregarJogo(slot)} className="flex-1 text-[10px] text-emerald-400 border border-emerald-500/40 rounded-sm py-1.5 hover:bg-emerald-500/10">Carregar</button>
                          {slot !== "auto" && <button onClick={() => salvarJogo(slot)} className="flex-1 text-[10px] text-blue-400 border border-blue-500/40 rounded-sm py-1.5 hover:bg-blue-500/10">Sobrescrever</button>}
                          <button onClick={() => { if (confirm("Apagar essa carreira salva?")) { apagarLocal(slot); setTemSave(existeAlgumSave()); setAvisoSave({ erro: false, txt: "Save apagado." }); setTimeout(() => setAvisoSave(null), 2000); } }} className="text-[10px] text-red-400 border border-red-500/30 rounded-sm px-2 py-1.5 hover:bg-red-500/10">Apagar</button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-600">vazio</span>
                        {slot !== "auto" && (carreira || fim) && <button onClick={() => salvarJogo(slot)} className="text-[10px] text-emerald-400 border border-emerald-500/40 rounded-sm px-3 py-1 hover:bg-emerald-500/10">Salvar aqui</button>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-2.5">
                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1.5">Backup em arquivo</div>
                <p className="text-[9px] text-zinc-600 mb-2">O save fica guardado no navegador. Se limpar os dados dele, some. Baixe um arquivo pra não perder.</p>
                <div className="flex gap-1.5">
                  <button onClick={() => { if (carreira || fim) baixarSave(estadoAtualParaSave()); }} disabled={!carreira && !fim} className="flex-1 text-[10px] text-zinc-300 border border-zinc-700 rounded-sm py-1.5 hover:border-emerald-500 disabled:opacity-40">⬇️ Baixar carreira</button>
                  <label className="flex-1 text-[10px] text-zinc-300 border border-zinc-700 rounded-sm py-1.5 hover:border-emerald-500 cursor-pointer text-center">
                    ⬆️ Carregar arquivo
                    <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importarSaveDeArquivo(f); e.target.value = ""; }} />
                  </label>
                </div>
              </div>
              <div className="mt-3"><Button variant="ghost" onClick={() => setSavesAberto(false)}>Fechar</Button></div>
            </Card>
          </PopupOverlay>
        )}

        {avisoSave && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-md text-xs font-bold animate-[popIn_0.2s_ease-out]"
            style={{ background: avisoSave.erro ? "#3b1213" : "#0d2a19", border: `1px solid ${avisoSave.erro ? "#D6483F" : "#12A876"}`, color: avisoSave.erro ? "#ff9d97" : "#39FF88" }}>
            {avisoSave.erro ? "⚠️ " : "💾 "}{avisoSave.txt}
          </div>
        )}

        {fichaJogo && carreira && (
          <PopupOverlay onClose={() => setFichaJogo(null)}>
            <FichaPartida jogo={fichaJogo} clubeNome={carreira.clube.nome} posicao={carreira.posicao} onClose={() => setFichaJogo(null)} />
          </PopupOverlay>
        )}

        {noticiaAberta && carreira && (
          <PopupOverlay onClose={() => setNoticiaAberta(null)}>
            <LeitorNoticia noticia={noticiaAberta} nome={nome} clube={noticiaAberta.clube || carreira.clube.nome} onClose={() => setNoticiaAberta(null)} />
          </PopupOverlay>
        )}

        {calendarioAberto && carreira && (
          <CalendarioTemporadaPopup carreira={carreira} mesAtual={calendarioMesAberto} setMesAtual={setCalendarioMesAberto} onClose={() => setCalendarioAberto(false)} onAbrirFicha={(j) => { setCalendarioAberto(false); setFichaJogo(j); }} />
        )}

        {lojaCategoriaAberta && (
          <PopupOverlay largo onClose={() => setLojaCategoriaAberta(null)}>
            <Card className="border-emerald-500/40">
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">{lojaCategoriaAberta === "Staff" ? "Equipe & estilo de vida" : lojaCategoriaAberta}</div>
              <p className="text-[10px] text-zinc-600 mb-3">
                {lojaCategoriaAberta === "Estrutura do Clube" ? "Compra única por clube — trava depois de adquirido, e some se você sair do clube."
                  : lojaCategoriaAberta === "Staff" ? "Contratos temporários — cobram manutenção anual e vencem, precisando renovar."
                  : "Itens da sua vida pessoal — compre quantas vezes fizer sentido."}
              </p>
              <div className="lista-cards">
                {LOJA_ITENS.filter((it) => it.categoria === lojaCategoriaAberta).map((item) => {
                  const contratoAtivo = item.tipo === "staff" ? carreira.staffContratos?.[item.id] : null;
                  const travadoEstrutura = item.categoria === "Estrutura do Clube" && (carreira.posses || []).some((p) => p.id === item.id && p.clubeDono === carreira.clube.nome);
                  const { custo, manutencao } = precoAjustado(item, carreira);
                  const desabilitado = travadoEstrutura || carreira.cofre < custo;
                  return (
                    <button key={item.id} onClick={() => comprarItem(item)} disabled={desabilitado} className="flex justify-between items-center px-3 py-2 text-xs rounded-sm border border-zinc-800 hover:border-emerald-500 disabled:opacity-40 text-left gap-2">
                      <span className="flex-1">
                        <span className="mr-1.5">{item.icone}</span>{item.nome}
                        {item.desc && <span className="block text-[9px] text-zinc-500 mt-0.5">{item.desc}</span>}
                        {item.efeitoFisico != null && <span className={`block text-[9px] mt-0.5 ${item.efeitoFisico < 0 ? "text-emerald-400" : "text-red-400"}`}>{item.efeitoFisico < 0 ? "🩺 reduz" : "🩺 aumenta"} o desgaste em {Math.abs(item.efeitoFisico)}/ano</span>}
                        {PESO_OSTENTACAO[item.categoria] > 0 && <span className="block text-[9px] text-pink-400/70 mt-0.5">💸 aumenta seu padrão de vida</span>}
                        {manutencao > 0 && <span className="block text-[9px] text-zinc-600 mt-0.5">manutenção ${formatarDinheiro(manutencao)}/ano{item.duracaoTemporadas ? ` · contrato de ${item.duracaoTemporadas} temporada(s)` : ""}</span>}
                        {contratoAtivo && <span className="block text-[9px] text-emerald-400 mt-0.5">✓ ativo — {contratoAtivo.restantes} temporada(s) restante(s) · clique pra renovar</span>}
                        {travadoEstrutura && <span className="block text-[9px] text-amber-400 mt-0.5">🔒 já construído no {carreira.clube.nome} — some se você for embora</span>}
                      </span>
                      <span className="font-mono text-amber-400 shrink-0">{travadoEstrutura ? "✓" : `$${formatarDinheiro(custo)}`}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3"><Button variant="ghost" onClick={() => setLojaCategoriaAberta(null)}>Fechar</Button></div>
            </Card>
          </PopupOverlay>
        )}

        {resultadoInvestimento && (
          <PopupOverlay onClose={() => setResultadoInvestimento(null)}>
            <Card className={resultadoInvestimento.retorno >= resultadoInvestimento.valor ? "border-emerald-500/40" : "border-red-500/40"}>
              <div className="text-center mb-3 text-3xl">{resultadoInvestimento.retorno === 0 ? "📉" : resultadoInvestimento.retorno >= resultadoInvestimento.valor * 2 ? "🚀" : resultadoInvestimento.retorno >= resultadoInvestimento.valor ? "📈" : "⚠️"}</div>
              <p className="text-sm text-center mb-3">{resultadoInvestimento.resultado}</p>
              <p className="text-center text-xs text-zinc-400 mb-4">Investiu ${formatarDinheiro(resultadoInvestimento.valor)} → recebeu <strong className={resultadoInvestimento.retorno >= resultadoInvestimento.valor ? "text-emerald-400" : "text-red-400"}>${formatarDinheiro(resultadoInvestimento.retorno)}</strong></p>
              <Button onClick={() => setResultadoInvestimento(null)}>Fechar</Button>
            </Card>
          </PopupOverlay>
        )}

        {popupPremio && (
          <PopupOverlay onClose={() => setPopupPremio(null)}>
            <Card className="border-amber-500/40">
              <div className="flex items-center gap-2 mb-3"><TrophyIcon tipo={popupPremio.nome.includes("OURO") ? "ouro" : "bronze"} size={24} /><span className="font-bold text-sm">{popupPremio.nome}</span></div>
              <div className="grid gap-1">
                {popupPremio.lista.map((x, i) => (
                  <div key={i} className="flex justify-between text-xs border-b border-zinc-800/50 py-1.5"><span className="font-mono text-zinc-400">{x.ano}</span><span>{x.clube}</span></div>
                ))}
              </div>
              <div className="mt-4"><Button onClick={() => setPopupPremio(null)}>Fechar</Button></div>
            </Card>
          </PopupOverlay>
        )}

        {popupClube && (() => {
          const cl = CLUBES.find((c) => c.nome === popupClube);
          const temporadasClube = temporadas.filter((t) => t.clube === popupClube);
          const t = tierTorcida(getTorcida(carreira, popupClube));
          const titulos = (carreira.titulosPorClube || {})[popupClube] || [];
          const golsTotais = temporadasClube.reduce((s, x) => s + x.gols, 0);
          const assistTotais = temporadasClube.reduce((s, x) => s + x.assist, 0);
          const numerosClube = Array.isArray(carreira.camisaPorClube?.[popupClube]) ? carreira.camisaPorClube[popupClube] : (carreira.camisaPorClube?.[popupClube] ? [carreira.camisaPorClube[popupClube]] : []);
          const numeroAtual = numerosClube[numerosClube.length - 1];
          const idadesClube = temporadasClube.map((tc) => tc.idade);
          const idadeMin = idadesClube.length ? Math.min(...idadesClube) : null;
          const idadeMax = idadesClube.length ? Math.max(...idadesClube) : null;
          const manchetesClube = idadeMin != null ? (carreira.historico || []).filter((h) => h.idade >= idadeMin && h.idade <= idadeMax + 1 && (h.txt.includes("Campeão") || h.txt.includes("BOLA DE OURO") || h.txt.includes("gols") || h.txt.includes("Clássico") || h.txt.includes("lesão") || h.txt.includes("Transferência") || h.txt.includes("Contrato"))).slice(-6).reverse() : [];
          const equipamentos = [...COSMETICOS.filter((it) => (carreira.cosmeticosDesbloqueados || []).includes(it.id)), ...LOJA_ITENS.filter((it) => it.bonusAttr && (carreira.posses || []).some((p) => p.id === it.id))];
          return (
            <PopupOverlay onClose={() => setPopupClube(null)}>
              <Card className="border-emerald-500/40">
                <div className="flex items-center gap-3 mb-3">
                  {cl && <ClubDot club={cl} size={28} />}
                  <div className="flex-1"><div className="font-bold text-sm">{popupClube}</div><div className="text-[10px] font-bold" style={{ color: t.cor }}>{t.label} com a torcida</div></div>
                </div>

                {numerosClube.length > 0 && (
                  <div className="flex items-center gap-3 mb-3 bg-zinc-950/40 rounded-sm p-3">
                    <svg width="46" height="50" viewBox="0 0 52 56" className="shrink-0">
                      <path d="M14 4 L2 14 L8 24 L14 20 L14 52 L38 52 L38 20 L44 24 L50 14 L38 4 L32 8 L20 8 Z" fill={cl?.cor || "#333"} stroke="#000" strokeOpacity="0.2" />
                      <text x="26" y="38" textAnchor="middle" fontSize="18" fontWeight="900" fill={cl?.escuro ? "#0a0a0a" : "#fff"}>{numeroAtual}</text>
                    </svg>
                    <div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Camisa{numerosClube.length > 1 ? "s que você usou" : ""}</div>
                      <div className="text-sm font-bold">{numerosClube.map((n, i) => <span key={i} className="font-mono mr-1.5">#{n}</span>)}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-mono text-lg font-bold">{temporadasClube.length}</div><div className="text-[8px] text-zinc-500 uppercase">Temporadas</div></div>
                  <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-mono text-lg font-bold">{golsTotais}</div><div className="text-[8px] text-zinc-500 uppercase">Gols</div></div>
                  <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-mono text-lg font-bold">{assistTotais}</div><div className="text-[8px] text-zinc-500 uppercase">Assist.</div></div>
                </div>

                {(() => {
                  const cl = CLUBES.find((x) => x.nome === popupClube);
                  if (!cl) return null;
                  const pal = palmaresDoClube(carreira?.estadoClubes, popupClube);
                  const nomes = nomeDosTitulos(cl.liga);
                  const inicial = palmaresInicialDe(cl);
                  const linhas = [
                    { k: "liga", icone: "🏆", cor: "#12A876" },
                    { k: "copa", icone: "🥇", cor: "#D8B44A" },
                    { k: "continental", icone: "🌍", cor: "#f59e0b" },
                    { k: "mundial", icone: "🌐", cor: "#EC4899" },
                  ].filter((l) => (pal[l.k] || 0) > 0);
                  const total = (pal.liga || 0) + (pal.copa || 0) + (pal.continental || 0) + (pal.mundial || 0);
                  return (
                    <div className="mb-4">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">🏛️ Sala de troféus do clube</div>
                      {total === 0 ? (
                        <p className="text-[11px] text-zinc-600 mb-3">O clube ainda não tem títulos de expressão. Uma página em branco pra você escrever.</p>
                      ) : (
                        <div className="grid gap-1 mb-2">
                          {linhas.map((l) => {
                            const ganhosNaSuaEra = (pal[l.k] || 0) - (inicial[l.k] || 0);
                            return (
                              <div key={l.k} className="flex items-center gap-2 text-[11px] px-2 py-1.5 rounded-sm bg-zinc-950/40">
                                <span>{l.icone}</span>
                                <span className="flex-1 text-zinc-300">{nomes[l.k]}</span>
                                <span className="font-mono font-bold" style={{ color: l.cor }}>{pal[l.k]}×</span>
                                {ganhosNaSuaEra > 0 && <span className="text-[9px] text-emerald-400">+{ganhosNaSuaEra} na sua era</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-[9px] text-zinc-600">{total} taça(s) na história do clube</p>
                    </div>
                  );
                })()}
                {(() => {
                  const conf = resumoConfronto(carreira, popupClube);
                  if (!conf) return null;
                  return (
                    <div className="mb-4">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">⚔️ Seu histórico contra o {popupClube}</div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-stat font-black text-base">{conf.jogos}</div><div className="text-[8px] text-zinc-500 uppercase">Jogos</div></div>
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-stat font-black text-base"><span className="text-emerald-400">{conf.v}</span>-<span className="text-zinc-400">{conf.e}</span>-<span className="text-red-400">{conf.d}</span></div><div className="text-[8px] text-zinc-500 uppercase">V-E-D</div></div>
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-stat font-black text-base">{conf.gols}</div><div className="text-[8px] text-zinc-500 uppercase">Gols</div></div>
                        <div className="bg-zinc-950/40 rounded-sm p-2"><div className="font-stat font-black text-base" style={{ color: conf.notaMedia >= 7.2 ? "#12A876" : conf.notaMedia >= 6.5 ? "#e4e4e7" : "#D6483F" }}>{conf.notaMedia}</div><div className="text-[8px] text-zinc-500 uppercase">Nota</div></div>
                      </div>
                      <p className="text-[10px] mt-1.5" style={{ color: conf.aproveitamento >= 60 ? "#12A876" : conf.aproveitamento <= 35 ? "#D6483F" : "#a1a1aa" }}>
                        {conf.aproveitamento >= 60 ? `🍗 Freguesia: ${conf.aproveitamento}% de aproveitamento contra eles.`
                          : conf.aproveitamento <= 35 ? `😖 Pedra no sapato: só ${conf.aproveitamento}% de aproveitamento.`
                          : `Equilibrado: ${conf.aproveitamento}% de aproveitamento.`}
                      </p>
                    </div>
                  );
                })()}
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">🏆 Feitos com essa camisa</div>
                {titulos.length === 0 ? <p className="text-[11px] text-zinc-500 mb-3">Nenhum título por aqui ainda.</p> : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {Object.entries(titulos.reduce((acc, tit) => { acc[tit] = (acc[tit] || 0) + 1; return acc; }, {})).map(([tit, qtd], i) => (
                      <div key={i} className="flex flex-col items-center bg-zinc-950/50 border border-amber-500/20 rounded-sm p-2">
                        <TrophyIcon tipo={tit.includes("Champions") || tit.includes("Libertadores") || tit.includes("Mundial") ? "prata" : "bronze"} size={28} />
                        <span className="text-[8px] text-zinc-400 mt-1 text-center leading-tight">{tit}</span>
                        <span className="text-[10px] font-bold text-amber-400 mt-0.5">{qtd}× campeão</span>
                      </div>
                    ))}
                  </div>
                )}

                {manchetesClube.length > 0 && (
                  <>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">📰 Principais manchetes por lá</div>
                    <div className="grid gap-1 mb-3">
                      {manchetesClube.map((h, i) => <div key={i} className="text-[11px] text-zinc-400 border-l-2 border-emerald-800 pl-2">{h.idade}a — {h.txt}</div>)}
                    </div>
                  </>
                )}

                {equipamentos.length > 0 && (
                  <>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">👟 Chuteiras & adereços da carreira</div>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {equipamentos.map((it) => <div key={it.id} className="text-[10px] px-2 py-1.5 border border-amber-500/20 rounded-sm bg-amber-500/5">{it.icone || "✨"} {it.nome}</div>)}
                    </div>
                  </>
                )}

                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">Temporadas (mesmo se saiu e voltou)</div>
                <div className="grid gap-1 max-h-56 overflow-y-auto pr-1">
                  {temporadasClube.map((tc, i) => (
                    <div key={i} className="flex justify-between text-[11px] border-b border-zinc-800/50 py-1">
                      <span>{tc.temporadaLabel}</span>
                      <span className="font-mono text-zinc-400">{posicao === "GOL" ? `${tc.cleanSheets} CS` : `${tc.gols}g ${tc.assist}a`} · {tc.nota}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4"><Button onClick={() => setPopupClube(null)}>Fechar</Button></div>
              </Card>
            </PopupOverlay>
          );
        })()}

        {popupTemporada && (
          <PopupOverlay onClose={() => setPopupTemporada(null)}>
            <Card className="border-emerald-500/40">
              <div className="flex items-center gap-1.5 mb-2"><ClubDot club={popupTemporada.clubeObj} size={20} /><span className="text-[10px] text-emerald-400 uppercase tracking-widest">Temporada {popupTemporada.temporadaLabel} · {popupTemporada.clube}</span></div>
              <div className="grid grid-cols-4 gap-2 text-center mb-3">
                <div><div className="font-mono text-lg font-bold">{popupTemporada.jogos}</div><div className="text-[9px] text-zinc-500 uppercase">Jogos</div></div>
                <div><div className="font-mono text-lg font-bold">{posicao === "GOL" ? popupTemporada.cleanSheets : popupTemporada.gols}</div><div className="text-[9px] text-zinc-500 uppercase">{posicao === "GOL" ? "CS" : "Gols"}</div></div>
                <div><div className="font-mono text-lg font-bold">{popupTemporada.assist}</div><div className="text-[9px] text-zinc-500 uppercase">Assist.</div></div>
                <div><div className="font-mono text-lg font-bold">{popupTemporada.nota}</div><div className="text-[9px] text-zinc-500 uppercase">Nota</div></div>
              </div>
              <div className="text-xs text-zinc-300 space-y-1.5 border-t border-zinc-800 pt-3">
                <div className="flex items-center gap-1.5"><TrophyIcon tipo={popupTemporada.campeaoLiga ? "ouro" : "liga"} size={14} />{popupTemporada.ligaNome}: <strong>{popupTemporada.posLiga}º lugar</strong>{popupTemporada.campeaoLiga ? " — CAMPEÃO" : ""}</div>
                {popupTemporada.continental && <div className="flex items-center gap-1.5"><TrophyIcon tipo={popupTemporada.continental.titulo ? "ouro" : "prata"} size={14} />{popupTemporada.continental.nome}: <strong>{popupTemporada.continental.resultado}</strong>{popupTemporada.continental.adversario ? ` (x ${popupTemporada.continental.adversario}, ${popupTemporada.continental.placar})` : ""}</div>}
                {popupTemporada.copaNacional && <div className="flex items-center gap-1.5"><TrophyIcon tipo="bronze" size={14} />Copa Nacional: <strong>{popupTemporada.copaNacional.resultado}</strong>{popupTemporada.copaNacional.adversario ? ` (x ${popupTemporada.copaNacional.adversario}, ${popupTemporada.copaNacional.placar})` : ""}</div>}
                {popupTemporada.estadual && <div className="flex items-center gap-1.5"><TrophyIcon tipo={popupTemporada.estadual.titulo ? "ouro" : "bronze"} size={14} />{popupTemporada.estadual.nome}: <strong>{popupTemporada.estadual.resultado}</strong>{popupTemporada.estadual.adversario ? ` (x ${popupTemporada.estadual.adversario}, ${popupTemporada.estadual.placar})` : ""}</div>}
                {popupTemporada.copinhaCarreira && <div className="flex items-center gap-1.5"><TrophyIcon tipo={popupTemporada.copinhaCarreira.titulo ? "ouro" : "bronze"} size={14} />{popupTemporada.copinhaCarreira.nome}: <strong>{popupTemporada.copinhaCarreira.resultado}</strong>{popupTemporada.copinhaCarreira.adversario ? ` (x ${popupTemporada.copinhaCarreira.adversario}, ${popupTemporada.copinhaCarreira.placar})` : ""}</div>}
                {popupTemporada.copa && <div className="flex items-center gap-1.5"><TrophyIcon tipo={popupTemporada.copa.titulo ? "ouro" : "prata"} size={14} />Copa do Mundo: <strong>{popupTemporada.copa.resultado}</strong>{popupTemporada.copa.adversario ? ` (x ${popupTemporada.copa.adversario}, ${popupTemporada.copa.placar})` : ""}</div>}
                <div>⚽ Artilheiro da liga: <strong>{popupTemporada.artilheiro.nome}</strong> ({popupTemporada.artilheiro.gols} gols)</div>
                {posicao !== "GOL" && <div>📊 xG esperado: <strong>{popupTemporada.xG}</strong> (fez {popupTemporada.gols}) · nota média da posição: <strong>{popupTemporada.notaMediaPosicao}</strong></div>}
                {popupTemporada.passesTentados > 0 && <div>🎯 Passes: <strong>{popupTemporada.passesCompletos}/{popupTemporada.passesTentados}</strong> ({popupTemporada.passeCerto}%){popupTemporada.desarmesTentados > 0 ? ` · Desarmes: ${popupTemporada.desarmesCerteiros}/${popupTemporada.desarmesTentados}` : ""}</div>}
                {popupTemporada.expectativa && <div className={popupTemporada.bateuMeta ? "text-emerald-400" : "text-red-400"}>{popupTemporada.bateuMeta ? "✓" : "✗"} Meta: {posicao === "GOL" ? `${popupTemporada.expectativa.cleanSheets} jogos sem sofrer gol` : `${popupTemporada.expectativa.gols}g / ${popupTemporada.expectativa.assist}a`}</div>}
                {popupTemporada.premios.length === 0 ? <div className="text-zinc-500">Nenhum prêmio individual anunciado.</div> : popupTemporada.premios.map((p, i) => <div key={i} className={p.doJogador ? "text-amber-400 font-bold" : ""}>🏅 {p.nome}: <strong>{p.vencedor}</strong></div>)}
                {popupTemporada.resultadoPromessa && (
                  <div className={`flex items-start gap-1.5 ${popupTemporada.resultadoPromessa.cumpriu ? "text-emerald-400" : popupTemporada.resultadoPromessa.culpaDoTecnico ? "text-amber-400" : "text-red-400"}`}>
                    <span>{popupTemporada.resultadoPromessa.cumpriu ? "🤝" : popupTemporada.resultadoPromessa.culpaDoTecnico ? "⚠️" : "✗"}</span>
                    <span>Pacto com o técnico ({popupTemporada.resultadoPromessa.titulo}): {popupTemporada.resultadoPromessa.texto}</span>
                  </div>
                )}
                {popupTemporada.trocaTecnico && (
                  <div className="flex items-start gap-1.5 text-amber-400">
                    <span>🔄</span>
                    <span>{popupTemporada.trocaTecnico.antigo} saiu ({popupTemporada.trocaTecnico.motivo === "demitido" ? "demitido" : popupTemporada.trocaTecnico.motivo === "assediado" ? "levado por clube maior" : "fim de ciclo"}) — {popupTemporada.trocaTecnico.novo} assumiu.</span>
                  </div>
                )}
                {popupTemporada.movimentoLigas?.promovidos?.length > 0 && (
                  <div className="flex items-start gap-1.5 text-zinc-500">
                    <span>🔀</span>
                    <span>Acesso: {popupTemporada.movimentoLigas.promovidos.join(", ")} · Rebaixados: {popupTemporada.movimentoLigas.rebaixados.join(", ")}</span>
                  </div>
                )}
                <div>💰 Salário da temporada: ${formatarDinheiro(popupTemporada.salario)}</div>
              </div>
              {(popupTemporada.porCompeticao?.length > 0 || popupTemporada.selecaoTemporada) && (
                <div className="border-t border-zinc-800 pt-3 mt-3">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">📊 Números por competição</div>
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 gap-y-1 text-[10px] items-center">
                    <span className="text-zinc-600 uppercase text-[8px]">Competição</span>
                    <span className="text-zinc-600 uppercase text-[8px] text-right">J</span>
                    <span className="text-zinc-600 uppercase text-[8px] text-right">{posicao === "GOL" ? "CS" : "G"}</span>
                    <span className="text-zinc-600 uppercase text-[8px] text-right">A</span>
                    <span className="text-zinc-600 uppercase text-[8px] text-right">Nota</span>
                    {(popupTemporada.porCompeticao || []).map((k) => (
                      <React.Fragment key={k.id}>
                        <span style={{ color: k.cor }}>{k.icone} {k.nome}</span>
                        <span className="font-mono text-right text-zinc-300">{k.jogos}</span>
                        <span className="font-mono text-right text-zinc-300">{posicao === "GOL" ? k.cleanSheets : k.gols}</span>
                        <span className="font-mono text-right text-zinc-300">{k.assist}</span>
                        <span className="font-mono text-right text-zinc-400">{k.nota}</span>
                      </React.Fragment>
                    ))}
                    {popupTemporada.selecaoTemporada && (
                      <React.Fragment>
                        <span className="col-span-5 border-t border-zinc-800/70 mt-1 pt-1 text-[8px] uppercase tracking-widest text-zinc-600">Seleção (à parte dos números de clube)</span>
                        <span style={{ color: popupTemporada.selecaoTemporada.cor }}>{popupTemporada.selecaoTemporada.icone} {popupTemporada.selecaoTemporada.nome}</span>
                        <span className="font-mono text-right text-zinc-300">{popupTemporada.selecaoTemporada.jogos}</span>
                        <span className="font-mono text-right text-zinc-300">{posicao === "GOL" ? popupTemporada.selecaoTemporada.cleanSheets : popupTemporada.selecaoTemporada.gols}</span>
                        <span className="font-mono text-right text-zinc-300">{popupTemporada.selecaoTemporada.assist}</span>
                        <span className="font-mono text-right text-zinc-400">{popupTemporada.selecaoTemporada.nota}</span>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-4"><Button onClick={() => setPopupTemporada(null)}>Fechar</Button></div>
            </Card>
          </PopupOverlay>
        )}

        {stage === "fim" && fim && (
          <div className="grid gap-4">
            <Card className="text-center" accent="linear-gradient(90deg,#D8B44A,#12A876,#3b82f6)">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Chuteiras no prego · {fim.c.idade} anos</div>
              <PlayerFutCard nome={nome} posicao={posicao} ovr={fim.c.picoOvr} clube="Aposentado" gols={fim.c.gols} assist={fim.c.assist} dinheiro={fim.c.cofre} attrs={fim.c.attrs} nacionalidade={fim.c.nacionalidade} />
              <div className="mt-5">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Veredito · Nível {fim.nivel.n} de 11</div>
                <div className="display text-2xl font-black text-amber-400 mb-2">{fim.nivel.label}</div>
                <p className="text-xs text-zinc-400">{fim.c.gols} gols · {fim.c.assist} assist. · {fim.c.titulos} títulos · {fim.c.copasDoMundo} Copa(s) · {fim.c.bolasDeOuro} Bola(s) de Ouro · pico {fim.c.picoOvr} · ${formatarDinheiro(fim.c.cofre)} acumulados</p>
              </div>
            </Card>

            <Card accent="linear-gradient(90deg,#D8B44A,#a855f7)">
              <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">🌅 E agora, o que você faz da vida?</div>
              {!caminhoPos ? (
                <>
                  <p className="text-[11px] text-zinc-500 mb-3">A bola parou, mas a vida continua. Escolha seu caminho fora das quatro linhas.</p>
                  <div className="grid gap-1.5">
                    {CAMINHOS_POS_CARREIRA.map((cam) => {
                      const podeSeguir = cam.requisito(fim.c, temporadas);
                      return (
                        <button key={cam.id} onClick={() => podeSeguir && setCaminhoPos(cam)} disabled={!podeSeguir}
                          className="text-left px-3 py-2.5 rounded-sm border transition-all disabled:opacity-40"
                          style={{ borderColor: podeSeguir ? `${cam.cor}55` : "#27272a" }}>
                          <div className="text-xs font-bold" style={{ color: podeSeguir ? cam.cor : "#71717a" }}>{cam.icone} {cam.nome}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{cam.desc}</div>
                          {!podeSeguir && <div className="text-[9px] text-red-400/70 mt-1">🔒 Requer: {cam.textoRequisito}</div>}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="animate-[popIn_0.35s_ease-out]">
                  <div className="text-center py-2">
                    <div className="text-3xl mb-1">{caminhoPos.icone}</div>
                    <div className="display text-lg font-black" style={{ color: caminhoPos.cor }}>{caminhoPos.nome}</div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed border-l-2 pl-3 my-3" style={{ borderColor: caminhoPos.cor }}>{caminhoPos.epilogo(fim.c, temporadas)}</p>
                  <button onClick={() => setCaminhoPos(null)} className="text-[10px] text-zinc-500 hover:text-zinc-300">← escolher outro caminho</button>
                </div>
              )}
            </Card>

            <Card accent="linear-gradient(90deg,#12A876,#3b82f6)">
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">📈 Curva de evolução (OVR por idade)</div>
              <CurvaEvolucao temporadas={temporadas} />
              <p className="text-[10px] text-zinc-500 mt-1">🟡 Pico: {fim.c.picoOvr} OVR</p>
            </Card>

            <Card>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">🎟️ Álbum de clubes <span className="text-zinc-600 normal-case">(clique pra reviver cada temporada)</span></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(fim.c.camisaPorClube || {}).map(([nomeClube, numero]) => {
                  const cl = CLUBES.find((c) => c.nome === nomeClube);
                  const tt = tierTorcida(fim.c.torcidaPorClube?.[nomeClube] ?? 40);
                  return (
                    <button key={nomeClube} onClick={() => setPopupClube(nomeClube)} className="text-left p-0 rounded-sm overflow-hidden border border-zinc-800 hover:border-emerald-500 transition-all">
                      <div className="h-1" style={{ background: cl?.cor || "#333" }} />
                      <div className="p-2.5 bg-zinc-950/40">
                        <div className="flex items-center gap-1.5 mb-1"><ClubDot club={cl} size={18} /><span className="text-xs font-bold truncate">{nomeClube}</span></div>
                        <div className="text-[9px] font-bold" style={{ color: tt.cor }}>{tt.label}</div>
                        <div className="text-[9px] text-zinc-500">Camisa{Array.isArray(numero) && numero.length > 1 ? "s" : ""} {Array.isArray(numero) ? numero.join(", ") : numero}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {(() => {
                const entries = Object.entries(fim.c.torcidaPorClube || {});
                if (!entries.length) return null;
                const maisQuerido = [...entries].sort((a, b) => b[1] - a[1])[0];
                const apagada = [...entries].sort((a, b) => a[1] - b[1])[0];
                return (
                  <div className="mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                    {maisQuerido && tierTorcida(maisQuerido[1]).label !== "Jogador esquecível" && <div>💛 Onde foi mais querido: <strong className="text-zinc-200">{maisQuerido[0]}</strong> ({tierTorcida(maisQuerido[1]).label})</div>}
                    {apagada && apagada[0] !== maisQuerido?.[0] && tierTorcida(apagada[1]).label !== "Ídolo" && tierTorcida(apagada[1]).label !== "Lenda Máxima" && <div>🌫️ Passagem mais apagada: <strong className="text-zinc-200">{apagada[0]}</strong> ({tierTorcida(apagada[1]).label})</div>}
                  </div>
                );
              })()}
            </Card>

            <Card>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-between"><span>📱 Últimos momentos nas redes</span><span className="text-zinc-600 normal-case">{(fim.c.seguidores || 0).toLocaleString("pt-BR")} seguidores</span></div>
              <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
                {[...(fim.c.historico || [])].reverse().slice(0, 6).map((h, i) => (
                  <div key={i} className="text-[11px] text-zinc-400 border-l-2 border-pink-800 pl-2"><span className="text-zinc-600 font-mono mr-1">{h.idade}a</span>{h.txt}</div>
                ))}
                {(fim.c.historico || []).length === 0 && <p className="text-xs text-zinc-500">Sem registros.</p>}
              </div>
            </Card>

            <Card>
              <button onClick={() => setResumoCarreiraAberto(true)} className="w-full text-left">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between"><span>Resumo geral da carreira</span><span className="text-amber-400 text-[9px] normal-case">ver linha do tempo →</span></div>
              </button>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                <div className="text-zinc-400">Temporadas jogadas</div><div className="text-right font-bold">{temporadas.length}</div>
                <div className="text-zinc-400">Clubes defendidos</div><div className="text-right font-bold">{Object.keys(fim.c.camisaPorClube || {}).length}</div>
                <div className="text-zinc-400">Prêmios individuais</div><div className="text-right font-bold">{fim.c.premiosIndividuais}</div>
                <div className="text-zinc-400">Personalidade</div><div className="text-right font-bold">{PERSONALIDADES.find((p) => p.id === fim.c.personalidade)?.label}</div>
                <div className="text-zinc-400">Torcida mais fiel</div><div className="text-right font-bold">{Object.entries(fim.c.torcidaPorClube || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}</div>
                <div className="text-zinc-400">Patrimônio final</div><div className="text-right font-bold">${formatarDinheiro(fim.c.cofre)}</div>
              </div>
            </Card>

            {resumoCarreiraAberto && (
              <PopupOverlay onClose={() => setResumoCarreiraAberto(false)}>
                <Card className="border-amber-500/40">
                  <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-3">📜 Linha do tempo da carreira</div>
                  {(fim.c.marcos || []).length > 0 && (
                    <div className="grid gap-1 max-h-[30vh] overflow-y-auto pr-1 mb-3 pb-3 border-b border-zinc-800">
                      {(fim.c.marcos || []).map((m, i) => {
                        const t = TIPOS_MARCO[m.tipo] || TIPOS_MARCO.recorde;
                        return (
                          <div key={i} className="flex items-start gap-2 text-[10px]">
                            <span className="shrink-0">{t.icone}</span>
                            <span className="font-mono text-zinc-600 shrink-0 w-8">{m.idade}a</span>
                            <span className="text-zinc-300 leading-snug">{m.texto}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="grid gap-1.5 max-h-[45vh] overflow-y-auto pr-1 mb-4">
                    {temporadas.map((t, i) => {
                      const clubeObj = CLUBES.find((c) => c.nome === t.clube);
                      const marcos = [];
                      if (t.campeaoLiga) marcos.push(`🏆 ${t.ligaNome}`);
                      if (t.continental?.titulo) marcos.push(`🏆 ${t.continental.nome}`);
                      if (t.copaNacional?.titulo) marcos.push("🏆 Copa Nacional");
                      if (t.mundial?.titulo) marcos.push("🏆 Mundial de Clubes");
                      if (t.premios?.some((p) => p.doJogador && p.bolaDeOuro)) marcos.push("🥇 Bola de Ouro");
                      return (
                        <div key={i} className="flex items-start gap-2 text-[11px] border-l-2 border-amber-700/40 pl-2 py-0.5">
                          <span className="font-mono text-zinc-600 shrink-0 w-16">{t.temporadaLabel}</span>
                          <ClubDot club={clubeObj} size={16} />
                          <div className="flex-1">
                            <span className="text-zinc-300">{t.clube}</span>
                            <span className="text-zinc-500"> · {posicao === "GOL" ? `${t.cleanSheets} CS` : `${t.gols}g ${t.assist}a`} · nota {t.nota}</span>
                            {marcos.length > 0 && <div className="text-amber-400 text-[10px] mt-0.5">{marcos.join(" · ")}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-zinc-800 pt-3">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Números gerais</div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <div className="text-zinc-400">Temporadas jogadas</div><div className="text-right font-bold">{temporadas.length}</div>
                      <div className="text-zinc-400">Clubes defendidos</div><div className="text-right font-bold">{Object.keys(fim.c.camisaPorClube || {}).length}</div>
                      <div className="text-zinc-400">Gols na carreira</div><div className="text-right font-bold">{fim.c.gols}</div>
                      <div className="text-zinc-400">Assistências</div><div className="text-right font-bold">{fim.c.assist}</div>
                      <div className="text-zinc-400">Títulos coletivos</div><div className="text-right font-bold">{fim.c.titulos}</div>
                      <div className="text-zinc-400">Prêmios individuais</div><div className="text-right font-bold">{fim.c.premiosIndividuais}</div>
                      <div className="text-zinc-400">Bolas de Ouro</div><div className="text-right font-bold">{fim.c.bolasDeOuro}</div>
                      <div className="text-zinc-400">Copas do Mundo</div><div className="text-right font-bold">{fim.c.copasDoMundo}</div>
                      <div className="text-zinc-400">Personalidade</div><div className="text-right font-bold">{PERSONALIDADES.find((p) => p.id === fim.c.personalidade)?.label}</div>
                      <div className="text-zinc-400">Torcida mais fiel</div><div className="text-right font-bold">{Object.entries(fim.c.torcidaPorClube || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}</div>
                      <div className="text-zinc-400">Patrimônio final</div><div className="text-right font-bold">${formatarDinheiro(fim.c.cofre)}</div>
                    </div>
                  </div>
                  <div className="mt-4"><Button variant="ghost" onClick={() => setResumoCarreiraAberto(false)}>Fechar</Button></div>
                </Card>
              </PopupOverlay>
            )}

            <Card>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">A escada dos 11 níveis</div>
              {NIVEIS.map((nv) => <div key={nv.n} className={`text-[11px] py-0.5 flex gap-2 ${nv.n === fim.nivel.n ? "text-amber-400 font-bold" : nv.n < fim.nivel.n ? "text-zinc-400" : "text-zinc-600"}`}><span className="font-mono w-5">{nv.n}</span>{nv.label}{nv.n === fim.nivel.n ? " ← você" : ""}</div>)}
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `A JOIA — Resumo de carreira\n\nJogador: ${nome}\nPosição: ${POSICOES.find((p) => p.id === posicao)?.label}\nPersonalidade: ${PERSONALIDADES.find((p) => p.id === fim.c.personalidade)?.label}\nAposentou aos: ${fim.c.idade} anos\n\nGols: ${fim.c.gols}\nAssistências: ${fim.c.assist}\nTítulos: ${fim.c.titulos}\nCopas do Mundo: ${fim.c.copasDoMundo}\nBolas de Ouro: ${fim.c.bolasDeOuro}\nPrêmios individuais: ${fim.c.premiosIndividuais}\nOVR de pico: ${fim.c.picoOvr}\nPatrimônio: $${formatarDinheiro(fim.c.cofre)}\n\nVeredito final: Nível ${fim.nivel.n}/11 — ${fim.nivel.label}\n\nTemporada a temporada:\n${temporadas.map((t) => `${t.temporadaLabel} · ${t.clube} · ${posicao === "GOL" ? t.cleanSheets + " CS" : t.gols + "g"} ${t.assist}a · nota ${t.nota}`).join("\n")}`
                )}`}
                download={`a-joia-${nome.replace(/\s+/g, "_")}.txt`}
                className="px-4 py-2.5 text-sm font-semibold uppercase tracking-wide rounded-sm text-center bg-zinc-800 border border-zinc-700 hover:border-emerald-500"
              >⬇ Baixar resumo</a>
              <Button onClick={() => { setStage("intro"); setIntroFase("splash"); setZoomingIntro(false); setPotencial({}); setRoubos({}); setOrigem(null); setTemporadas([]); setCarreira(null); setFim(null); setPosTemporada(null); setDecisao(null); setJanela(null); setAwardsPopup(null); setCopinhaResultado(null); setCopinhaFaseIdx(0); setCopinhaTentativa(null); setClubeSelecionadoInicial(null); setNumeroEscolhidoInicial(null); setTesteFase("penalti"); setTesteTentativas([]); setTesteTentativaAtual(null); setTesteFaltas([]); setTesteFaltaAtual(null); setTestePasses([]); setTestePasseAtual(null); setTesteReflexo([]); setTesteResultado(null); setCopaMundoTentativa(null); setModoSimulacao("completa"); setPendingLanceJogo(null); setConversaBanco(null); setEmpresarioMenuAberto(false); setMundo(null); setMundoAba("bola"); setCaminhoPos(null); setElencoAberto(false); setInboxFiltro("todas"); setVestiarioAberto(false); setAbaLegado("coletivos"); }}>Nova carreira</Button>
            </div>
          </div>
        )}

        </div>
      </main>
      </div>
    </div>
  );
}
