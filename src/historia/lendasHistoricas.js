/**
 * Lendas anteriores ao save (história real), exibidas no palco de ídolos
 * como "Hall da fama". Somente nomes amplamente reconhecidos; sem números,
 * para não inventar estatísticas.
 */
export const LENDAS_HISTORICAS = {
  // Brasil
  'Flamengo': ['Zico', 'Júnior', 'Leandro', 'Adílio'],
  'Corinthians': ['Sócrates', 'Rivellino', 'Marcelinho Carioca', 'Cássio'],
  'Palmeiras': ['Ademir da Guia', 'Marcos', 'Evair', 'Dudu'],
  'São Paulo': ['Rogério Ceni', 'Raí', 'Serginho Chulapa', 'Müller'],
  'Santos': ['Pelé', 'Pepe', 'Coutinho', 'Neymar'],
  'Vasco da Gama': ['Roberto Dinamite', 'Romário', 'Edmundo', 'Juninho Pernambucano'],
  'Fluminense': ['Castilho', 'Rivellino', 'Fred', 'Assis'],
  'Botafogo': ['Garrincha', 'Nílton Santos', 'Jairzinho', 'Didi'],
  'Grêmio': ['Renato Gaúcho', 'Everaldo', 'Danrlei', 'Tarciso'],
  'Internacional': ['Falcão', 'Valdomiro', 'Fernandão', 'D\'Alessandro'],
  'Atlético-MG': ['Reinaldo', 'Dadá Maravilha', 'Victor', 'Hulk'],
  'Cruzeiro': ['Tostão', 'Dirceu Lopes', 'Fábio', 'Alex'],
  'Bahia': ['Bobô', 'Charles', 'Beijoca'],
  'Sport Recife': ['Magrão', 'Leonardo', 'Durval'],
  'Athletico-PR': ['Sicupira', 'Kléberson', 'Alex Mineiro'],
  // Galerias oficiais dos clubes (consulta 2026-11-24).
  // https://fortaleza1918.com.br/lendas-tricolores-ribamar-assis-paraiba-everton-maranguape-e-leandro-lima-sao-homenageados/
  'Fortaleza': ['Rinaldo', 'Clodoaldo', 'Dude', 'Salvino', 'Pedro Basílio', 'Marcelo Boeck', 'Erandir', 'Tangerina', 'Expedito', 'Caetano', 'Ribamar', 'Assis Paraíba', 'Éverton Maranguape', 'Leandro Lima'],
  // https://midia.cearasc.com/idolos/
  'Ceará': ['Gildo', 'Sérgio Alves', 'Mota', 'Magno Alves', 'Mitotônio', 'Da Costa', 'Carlito', 'Ivan Roriz', 'Adílson', 'Marco Aurélio'],
  // https://oldsite.coritiba.com.br/NoticiaEMBED/26120
  'Coritiba': ['Dirceu Krüger', 'Alex', 'Jairo', 'Capitão Hidalgo', 'Toby'],
  // Seleção editorial de ídolos, fontes consultadas em 2026-11-24 (sem ordem de mérito).
  // https://www-prod.correio24horas.com.br/ec-vitoria/so-idolos-qual-seria-a-selecao-de-todos-os-tempos-do-vitoria-0519
  // https://ge.globo.com/ba/futebol/times/vitoria/noticia/dida-ou-viafara-marinho-ou-bebeto-pet-ou-escudero-vote-em-quem-jogou-mais-no-vitoria.ghtml
  "Vitória": ["Dida","Bebeto","Petkovic","Ramon Menezes","André Catimba","Mário Sérgio","Osni","Detinho"],
  // https://www.maisgoias.com.br/esportes/futebol/futebol-goiano/goias-esporte-clube/memorias-que-nascem-verde-e-branco-goias-homenageia-idolos-em-seus-83-anos/
  "Goiás": ["Harlei","Araújo","Dill","Dimba","Ernando","Aloísio","Túlio Maravilha","Rafael Tolói","Josué","Paulo Baier","Uidemar","Amaral","Paghetti"],
  // https://avai.com.br/clube/historia/
  "Avaí": ["Adolfinho","Loló","Fateco","Veneza","Procópio","Zenon","Beck","Braulio","Felipinho","Saul Oliveira","Nizeta","Marquinhos Santos","Adilson Heleno","Cavallazzi","Evando"],
  // https://meutigrao.com.br/quem-e-o-maior-idolo-da-historia-do-criciuma/
  // https://www.criciuma.com.br/m/noticias/tigre-contrata-grizzo-para-trabalhar-na-base
  "Criciúma": ["Alexandre","Sarandí","Wilsão","Roberto Cavalo","Itá","Paulo Baier","Vanderlei Mior","Soares","Grizzo","Jairo Lenzi"],
  // https://www.paysandu.com.br/noticias/6578/apos-18-anos-da-vitoria-em-la-bombonera-paysandu-lanca-programa-para-homenagear-idolos
  // https://ge.globo.com/pa/futebol/times/paysandu/noticia/demorou-a-carregar-ai-paysandu-reune-cinco-dos-maiores-idolos-da-historia-do-clube-na-mesma-foto.ghtml
  "Paysandu": ["Quarentinha","Beto","Vandick","Robgol","Zé Augusto","Ronaldo"],
  // https://clubedoremo.com.br/loja/copo-oficial-clube-do-remo-idolos
  "Remo": ["Bira","Alcino","Biro-Biro","Agnaldo","Mesquita","Luiz Müller"],
  // Hall da fama: seleção editorial parcial, sem ordem de mérito; fontes consultadas em 2026-11-24.
  // https://chapecoense.com/2017/10/11/chapetv-estreia-no-canal-premiere/
  // https://chapecoense.com/2017/12/21/alem-das-quatro-linhas-a-preparacao-de-goleiros/
  "Chapecoense": ["Janga","Índio","Xu","Luis Carlos","Madruga","Nivaldo","Rodolpho"],
  // https://www.americafc.com.br/2022/04/30/coelhaocentoedeca-nacao-americana-elege-a-selecao-do-coelhao-110-anos/utm_sourcerssutm_mediumrssutm_campaigncoelhaocentoedeca-nacao-americana-elege-a-selecao-do-coelhao-110-anos
  "América-MG": ["Jair Bala","Milagres","Danilo","Wellington Paulo","Ricardo Evaristo","Ronaldo Luiz","Gilberto Silva","Juca Show","Palhinha","Richarlison","Satyro Taboada"],
  // https://gazetabragantina.com.br/2021/01/09/clube-atletico-bragantino-comemorou-93-anos/
  // https://www.redbullbragantino.com/br-pt/noticias/idolo-mauro-silva-completa-53-anos
  "Bragantino": ["Wilsinho","Gil Baiano","Mauro Silva","Alberto Félix","Mazinho Oliveira","Pintado","João Santos"],
  // https://www.juventude.com.br/index.php/blog/idolo-lauro-retorna-ao-juventude
  // https://www.juventude.com.br/blog/ate-breve-caja-voce-fez-historia
  "Juventude": ["Lauro","Renato Cajá"],
  // https://pontepreta.com.br/nossa-historia/
  "Ponte Preta": ["Dicá","Bruninho","Ciasca","Manfrini","Carlos","Marco Aurélio","Luís Fabiano","Washington"],
  // https://guaranifc.com.br/destaque/especial-107-anos-idolos/
  // https://guaranifc.com.br/destaque/guarani-promove-acao-com-ex-jogadores-em-homenagem-aos-45-anos-do-titulo-brasileiro/
  "Guarani": ["Careca","Neto","Amoroso","Fumagalli","Zenon","Bozó"],
  // https://ge.globo.com/pe/futebol/times/nautico/noticia/2024/10/21/paulo-sergio-se-junta-a-kieza-bizu-e-bita-na-historia-do-nautico-entenda.ghtml
  // https://ge.globo.com/pe/futebol/times/nautico/noticia/2023/04/24/nautico-lanca-novo-uniforme-listrado-com-tributo-a-idolo-bizu.ghtml
  "Náutico": ["Bita","Kuki","Bizu","Mauri","Kieza"],
  // https://ge.globo.com/pe/futebol/times/santa-cruz/noticia/2014/02/com-carisma-e-talento-grandes-idolos-fizeram-historia-no-santa-cruz.html
  "Santa Cruz": ["Ramon","Givanildo","Nunes","Luciano"],
  // https://ge.globo.com/google/amp/al/arquivo/futebol/times/crb/noticia/2023/09/20/quem-e-quem-veja-quais-idolos-o-crb-homenageou-em-sua-arte-de-comemoracao-aos-111-anos.ghtml
  // https://ge.globo.com/al/arquivo/futebol/times/crb/noticia/2019/06/24/fanatico-nao-apaixonado-walney-anota-tudo-se-dedica-ao-crb-e-escala-ate-o-time-dos-sonhos.ghtml
  "CRB": ["Joãozinho Paulista","Silva","Aloísio Chulapa","Miguel Rosas"],
  // https://ge.globo.com/google/amp/al/futebol/times/csa/noticia/2026/09/07/csa-completa-113-anos-entre-a-forca-da-historia-e-a-necessidade-de-reconstrucao.ghtml
  "CSA": ["Jacozinho","Dida","Flávio","Paranhos","Catanha","Wilson","Lino","Peu","Adriano Gabiru","Felipão"],
  // https://ge.globo.com/rj/serra-lagos-norte/futebol/brasileirao-serie-d/noticia/2022/08/20/romarinho-idolo-da-portuguesa-rj-fala-da-expectativa-pelo-tao-sonhado-acesso-na-serie-d.ghtml
  "Portuguesa-RJ": ["Romarinho"],
  // Seleção histórica parcial de ídolos e destaques, sem ordem de mérito. Consulta: 2026-11-24.
  // Novorizontino: somente a entidade fundada em 2010, não o extinto Grêmio Esportivo Novorizontino.
  // https://ge.globo.com/sp/tem-esporte/futebol/times/novorizontino/noticia/2026/11/09/novorizontino-que-subiu-a-serie-a-nao-e-o-mesmo-que-fez-historia-nos-anos-1990-entenda-as-diferencas.ghtml
  // https://ge.globo.com/sp/tem-esporte/futebol/times/novorizontino/noticia/2026/08/30/emprestado-pelo-palmeiras-romulo-bate-novos-recordes-no-novorizontino-e-vive-ano-mais-artilheiro.ghtml
  // https://ge.globo.com/se/futebol/times/confianca/noticia/2026/10/12/com-sete-acessos-na-carreira-sergipano-cleo-silva-e-o-novo-reforco-do-confianca.ghtml
  "Novorizontino": ["Cléo Silva","Reverson","Rômulo","Guilherme Queiroz"],
  // https://ge.globo.com/sp/tem-esporte/futebol/times/mirassol/noticia/2025/11/09/de-clube-amador-a-sensacao-do-brasil-mirassol-completa-100-anos-em-meio-a-conto-de-fadas.ghtml
  "Mirassol": ["Xuxa","Camilo"],
  // https://www.maisgoias.com.br/esportes/futebol/futebol-goiano/vila-nova/consciencia-negra-relembre-jogadores-que-fizeram-historia-no-vila-nova/
  // https://brasilescola.uol.com.br/educacao-fisica/vila-nova-futebol-clube.htm
  "Vila Nova": ["Guilherme","Bé","Alan Mineiro","Túlio Maravilha","Wando","Max","Tim"],
  // https://atleticogoianiense.com.br/historia.html
  // https://www.atleticogoianiense.com.br/o-clube/historia.html
  "Atlético-GO": ["Goiano","Baltazar","Lino","Júlio César (Imperador)","Valdeir","Rodrigo Ayres"],
  // https://museudofutebol.org.br/crfb/acervo/761287/
  // https://ge.globo.com/pr/futebol/times/londrina/noticia/tri-em-1970-idolo-na-alemanha-e-campeao-no-flamengo-ge-lista-as-principais-revelacoes-do-londrina.ghtml
  "Londrina": ["Carlos Alberto Garcia","Gauchinho","Ado","Elber","Everton","Márcio Alcântara","Zetti","Germano"],
  // https://figueirense.com.br/institucional/historia/
  // https://ge.globo.com/sc/futebol/times/figueirense/noticia/2025/06/12/figueirense-104-anos-genilson-relembra-passagem-no-clube-mais-importante-da-carreira.ghtml
  "Figueirense": ["Fernandes","Calico","Albeneir","Pinga","Casagrande","Genilson","Wilson"],
  // https://ge.globo.com/sp/ribeirao-preto-e-regiao/futebol/times/ferroviaria/noticia/quiz-eles-jogaram-pela-ferroviaria-nestes-70-anos-consegue-dizer-quem-sao.ghtml
  // https://ferroviariasaf.com/2023/02/28/ferroviaria-e-superada-pelo-palmeiras-no-allianz-parque/
  "Ferroviária": ["Bazzani","Dudu (Olegário Toloi de Oliveira)","Téia","Baiano","Mauro Pastor","Vica"],
  // https://botafogofutebolsa.com.br/halldafama/
  "Botafogo-SP": ["Sócrates","Raí","Zé Mário"],
  // Galeria parcial de ídolos e destaques históricos, sem ordem de mérito. Consulta: 2026-11-24.
  // https://www.abcfc.com.br/historia/craques/jorginho
  // https://abcfc.com.br/historia/craques/alberi
  // https://novo.abcfc.com.br/historia
  // https://ge.globo.com/google/amp/rn/futebol/times/abc/noticia/2026/08/17/wallyson-ressurge-no-abc-e-faz-historia-com-gol-do-acesso-a-serie-c.ghtml
  "ABC": ["Jorginho","Alberi","Wallyson","Xixico","Dequinha"],
  // https://www.americadenatalsaf.com.br/mecao
  "América-RN": ["Gilvandro","Escala","Aluísio Guerreiro","Pedrada","Marinho Chagas","Hélcio Jacaré","Baíca","Marinho Apolônio","Severo Dias","Moura","Paulinho Kobayashi","Max","Wallace Pernambucano","Souza"],
  // https://www.sampaiocorreafc.com.br/sempre-na-historia/
  // https://imirante.com/esporte/sao-luis/2023/03/25/de-xodo-da-torcida-a-goleiro-idolo-eles-fizeram-historia-no-sampaio-correa
  "Sampaio Corrêa": ["Pimentinha","Juca Baleia","Eloir","Gabriel Poveda"],
  // https://ge.globo.com/pb/futebol/times/botafogo-pb/noticia/da-idolatria-ao-adeus-prematuro-ha-50-anos-morria-nininho-o-fiapo-de-ouro-do-botafogo-pb.ghtml
  // https://ge.globo.com/pb/noticia/2013/11/idolos-do-passado-do-botafogo-pb-torcem-pelo-titulo-do-clube-na-serie-d.html
  "Botafogo-PB": ["Nininho","Chico Matemático","Ramiro Sousa","Fernando","Lúcio Surubim","Magno","Dentinho"],
  // https://ge.globo.com/se/futebol/times/confianca/noticia/2026/04/29/artilheiro-campeao-e-idolo-audair-relembra-trajetoria-no-confianca.ghtml
  // https://ge.globo.com/se/futebol/times/confianca/80-anos/noticia/2016/05/paredao-exemplo-vencedor-inumeras-definicoes-para-o-idolo-fabio.html
  // https://ge.globo.com/se/noticia/2025/04/23/idolo-do-confianca-kivel-revisita-trajetoria-no-futebol-sergipano-em-entrevista-ao-zyb-podcast.ghtml
  // https://www.futebolnaveia.com.br/top-5-idolos-do-futebol-confianca/
  // https://ge.globo.com/se/futebol/times/confianca/noticia/2013/04/valdson-vibra-por-fazer-parte-de-mais-um-momento-historico-do-confianca.html
  "Confiança": ["Audair","Fábio","Leandro Kível","Lima Sergipano","Valdson"],
  // https://ge.globo.com/pb/futebol/times/campinense/noticia/2023/04/14/campinense-homenageia-idolos-com-painel-grafitado-no-renatao.ghtml
  // https://ge.globo.com/pb/campinense-100-anos/noticia/2015/03/em-meio-campanha-do-tri-de-1962-campinense-vive-crise-politica-interna.html
  // https://ge.globo.com/pb/noticia/2012/05/novo-reforco-do-campinense-izaias-quer-ter-o-mesmo-sucesso-de-seu-pai.html
  "Campinense": ["Pantera","Zé Lima","Araponga","Marquinhos Marabá","Assis Paraíba","Chiclets","Gabriel Cabelo de Fogo","Pedrinho Cangula"],
  // https://trezefc.com.br/perguntas-frequentes/
  "Treze": ["Adelino","Mário Buchudo"],
  // https://ge.globo.com/mt/futebol/times/cuiaba/noticia/2023/12/22/com-54percent-dos-votos-boge-e-eleito-pela-torcida-como-o-maior-idolo-da-historia-do-cuiaba.ghtml
  "Cuiabá": ["Bogé","Walter","Anderson Conceição","Fernando"],
  // https://ge.globo.com/pr/futebol/times/operario-pr/noticia/2025/11/13/operario-pr-anuncia-renovacao-com-volante-indio.ghtml
  // https://ge.globo.com/google/amp/pr/futebol/times/operario-pr/noticia/2026/03/02/operario-pr-anuncia-o-retorno-do-atacante-felipe-augusto-ate-2027.ghtml
  "Operário-PR": ["Índio","Felipe Augusto"],
  // https://gauchazh.clicrbs.com.br/pioneiro/esportes/noticia/2020/09/historias-de-torcedor-um-grena-apaixonado-por-incentivo-do-cunhado-14226100.html
  // https://gauchazh.clicrbs.com.br/pioneiro/esportes/noticia/2020/06/historias-de-torcedor-amor-pelo-caxias-desde-os-tempos-da-baixada-rubra-12528450.html
  // https://www.correiobraziliense.com.br/esportes/2023/08/amp/5115497-idolo-do-caxias-rs-brasiliense-washington-lamenta-duelo-com-ceilandia.html
  // https://gauchazh.clicrbs.com.br/pioneiro/esportes/noticia/2026/09/centenario-50-anos-jogos-historicos-numeros-e-curiosidades-do-estadio-do-caxias-cmtnbj5q101yh011jw9460l3l.html
  "Caxias": ["Délmer","Gil Baiano","Washington (Coração Valente)","Caçapava"],
  // https://ituanofc.com/clube/
  "Ituano": ["Mica","Bolognesi","Django","Jenildo","Romeu","Vinicius Bergantin","Juninho Paulista"],
  // https://saobernardofc.com/historia.php
  "São Bernardo": ["Zé Forte","Ney Mineiro","Raul","Rodrigo Souza","Eduardo Diniz","Daniel Luiz Flumignan"],
  // Galeria histórica parcial de ídolos e destaques, sem ranking ou estatísticas; consulta 2026-11-24.
  // https://ge.globo.com/mg/zona-da-mata-centro-oeste/futebol/noticia/2024/06/18/artilheiro-das-4-divisoes-do-brasileiro-ex-corinthians-e-cruzeiro-se-torna-maior-goleador-da-historia-do-athletic.ghtml
  "Athletic Club": ["Jonathas"],
  // https://diariodegoias.com.br/morre-nelson-parrila-ex-jogador-do-anapolis-e-um-dos-principais-na-historia-de-goias/43263/
  // https://especiais.opopular.com.br/goianao/2020/anapolis
  // https://portal6.com.br/2025/04/01/jogador-do-anapolis-entra-para-historia-quebrando-tabu-de-44-anos/
  "Anápolis": ["Nelson Parrila","Divino","Zé Amaro","Igor Cássio"],
  // https://ge.globo.com/am/futebol/times/amazonas-fc/noticia/2026/04/03/idolo-do-amazonas-sassa-reencontra-a-onca-e-abre-o-coracao-tenho-uma-historia-muito-bonita.ghtml
  "Amazonas FC": ["Sassá"],
  // https://ge.globo.com/sc/futebol/times/barra-sc/noticia/2026/07/22/idolo-de-titulos-ineditos-goleiro-deixa-o-barra-para-atuar-no-futebol-europeu.ghtml
  "Barra-SC": ["Ewerton"],
  // https://www.futebolnaveia.com.br/top-5-idolos-do-futebol-brusque/
  // https://omunicipio.com.br/futebol/palmito-vice-1990-voltou-brusque-campeao-1992-copa-sc/
  "Brusque": ["Palmito","Rafael Xavier","Polaco","Mineiro","Thiago Alagoano"],
  // https://ge.globo.com/ce/futebol/times/floresta/noticia/2023/12/23/desde-2020-no-floresta-o-volante-joedson-almeida-projeta-2024-chegaremos-firmes.ghtml
  // https://www.vavel.com/br/futebol/2021/06/01/1073262-artilheiro-historico-flavio-torres-marca-o-primeiro-gol-do-floresta-na-serie-c.html
  "Floresta": ["Joedson Almeida","Flávio Torres"],
  // https://interdelimeira.com/nossa-historia/
  // https://memoriadainter.com.br/2022/01/06/kita-completaria-64-anos-hoje/
  "Inter de Limeira": ["Kita","Tato","Paulinho","Camargo","João Batista"],
  // https://ge.globo.com/se/futebol/times/itabaiana/noticia/da-arquibancada-a-diretoria-historias-pesquisas-e-emocoes-de-um-tricolor.ghtml
  // https://ge.globo.com/google/amp/se/futebol/times/itabaiana/noticia/2025/09/10/itabaiana-divulga-nota-de-pesar-por-falecimento-de-horacio-um-dos-maiores-idolos-da-historia-do-clube.ghtml
  "Itabaiana": ["Horácio","Marcelo","Esmerino","Aílton","Paulo Preto","Amaúte","Gustinho","Bené","Zequinha","Nilson Hora","Tatica"],
  // https://futebolmaranhenseantigo.blogspot.com/2025/08/riba-o-maior-artilheiro-do-maranhao.html
  // https://futebolmaranhenseantigo.blogspot.com/2013/07/hiltinho-historia-de-um-goleador-e.html
  // https://futebolmaranhenseantigo.blogspot.com/2014/04/trofeu-maior-idolo-dos-clubes.html
  "Maranhão": ["Riba","Hiltinho","Bacabal"],
  // https://maringapost.com.br/2026/07/27/adversario-do-maringa-na-serie-c-tem-no-elenco-antigos-conhecidos-da-torcida-tricolor/
  // https://gmconline.com.br/noticias/se-o-mfc-precisar-de-mim-sera-um-prazer-voltar-diz-leo-maringa-2/
  // https://ge.globo.com/google/amp/am/futebol/noticia/2026/10/29/campeao-da-serie-c-amazonense-negueba-exalta-talentos-do-estado-e-manda-recado-nunca-desistam.ghtml
  "Maringá": ["Dheimison","Léo Maringá","Negueba"],
  // https://www.futebolinterior.com.br/quem-e-bruno-barra-capitao-e-maior-idolo-da-historia-do-volta-redonda/
  // https://www.futebolnaveia.com.br/top-5-idolos-do-futebol-volta-redonda/
  "Volta Redonda": ["Bruno Barra","Túlio Maravilha","Humberto","Darci","Valtinho","Betinho"],
  // https://www.futebolnaveia.com.br/top-5-idolos-do-futebol-ypiranga/
  "Ypiranga-RS": ["Marimba","Mujica","Paulo Ferro","Pedruca","Paulo Gaúcho"],
  // Galeria parcial: ídolos e destaques com trajetória documentada; sem ranking, consulta 2026-11-24.
  // https://web.arapiraca.al.gov.br/2024/04/centenario-esporte-promove-encontro-de-idolos-da-historia-do-asa-de-arapiraca/
  // https://ge.globo.com/al/arquivo/futebol/times/asa/noticia/2023/09/25/asa-completa-71-anos-e-didira-revela-quais-sao-os-seus-idolos-alvinegros.ghtml
  "ASA": ["Freitas","Didira","Jota Guerreiro"],
  // https://www.correiobraziliense.com.br/esportes/2026/08/7480779-mens-gem-para-voce-idolos-do-gama-incentivam-o-time-no-jogo-do-acesso.html
  "Gama": ["Romualdo","Lindomar","Emerson","Rochinha"],
  // https://www.goiatuba.esp.br/historia.html
  // https://www.goiasinterior.com.br/conteudo/editorias/esporte/relembrando-a-historia-do-azulao-do-sul.html
  "Goiatuba": ["Marola"],
  // https://ge.globo.com/am/noticia/2013/01/nacional-am-completa-100-anos-e-quer-voltar-aos-tempos-aureos.html
  // https://aca.org.br/nacional-futebol-clube/
  "Nacional-AM": ["Pepeta","Robson Garanha","Procópio","Luís Florêncio","Borrachinha","Paulo Galvão","Careca","Bendelack","Reis"],
  // https://ge.globo.com/mg/triangulo-mineiro/noticia/2013/11/idolo-do-uberlandia-e-homenageado-e-compara-time-de-84-com-atual-cruzeiro.html
  // https://ge.globo.com/google/amp/mg/triangulo-mineiro/noticia/oito-times-que-fizeram-historia-no-triangulo-mineiro-e-alto-paranaiba.ghtml
  "Uberlândia": ["Maurinho","Dirceu Lopes"],
  // https://www.fpf-pe.com.br/pt/noticias/view.php?q=9740
  "Retrô": ["Franklin Mascote"],
  // https://www.dm.com.br/esportes/alex-henrique-maior-artilheiro-da-aparecidense-quer-cravar-o-seu-nome-na-historia-do-clube/
  "Aparecidense": ["Alex Henrique"],
  // https://www.ferroviario.com.br/2023/04/10/ferrao-emplaca-o-17o-artilheiro-de-cearense-com-ciel/
  // https://almanaquedoferrao.wordpress.com/recordistas/
  "Ferroviário": ["Pacoti","Edson Cariús","Ciel"],
  // https://ge.globo.com/mg/zona-da-mata-centro-oeste/futebol/campeonato-mineiro/noticia/2023/02/28/se-cuida-hulk-com-5-gols-em-4-jogos-atacante-reserva-do-tombense-luta-pela-artilharia-do-mineiro.ghtml
  "Tombense": ["Daniel Amorim"],
  // https://ge.globo.com/ro/futebol/noticia/2025/03/07/luan-viana-destaque-do-porto-velho-em-2024-retorna-ao-clube.ghtml
  "Porto Velho": ["Luan Viana"],
  // https://ge.globo.com/am/futebol/times/manaus/noticia/autor-de-gol-a-la-ibra-hamilton-deixa-manaus-fc-e-vai-de-graca-para-o-futebol-arabe.ghtml
  "Manaus": ["Hamilton","Jonathan","Negueba","Bruno Saúl"],
  // https://ge.globo.com/pa/futebol/times/aguia-de-maraba/noticia/2025/07/10/aguia-divulga-mensagem-de-despedida-para-axel-lopes-nosso-maior-idolo.ghtml
  // https://ge.globo.com/pa/futebol/times/aguia-de-maraba/noticia/2023/11/07/maior-artilheiro-da-serie-d-aleilson-esta-de-volta-ao-aguia-de-maraba.ghtml
  "Águia de Marabá": ["Axel Lopes","Aleílson"],
  // https://ge.globo.com/pi/futebol/times/altos/noticia/2023/07/19/altos-10-anos-relembre-jogadores-marcantes-do-jacare-nesta-decada-de-existencia-do-clube.ghtml
  "Altos": ["Manoel","Esquerdinha","Gênesis","Joelson","Betinho"],
  // https://jornaldebeltrao.com.br/geral/beltrao/conheca-marquinhos-cambalhota-autor-do-primeiro-gol-do-paranaense/
  // https://www.tribunapr.com.br/esportes/artilheiro-com-faro-e-fome-de-gol/
  "Cianorte": ["Marquinhos Cambalhota","Giancarlo"],
  // https://gauchazh.clicrbs.com.br/esportes/gauchao/noticia/2021/02/com-goleiro-fabio-como-destaque-sao-jose-busca-voos-mais-altos-no-gauchao-2021-ckli641lg001c015q18q04mju.html
  "São José-RS": ["Fábio"],
  // https://www.correiobraziliense.com.br/app/noticia/superesportes/2009/04/07/interna_superesportes%2C96326/iranildo-completa-200-jogos-com-a-camisa-do-brasiliense.shtml
  "Brasiliense": ["Iranildo"],
  // Argentina e Uruguai
  'Boca Juniors': ['Diego Maradona', 'Juan Román Riquelme', 'Martín Palermo', 'Carlos Tevez'],
  'River Plate': ['Alfredo Di Stéfano', 'Enzo Francescoli', 'Ángel Labruna', 'Ariel Ortega'],
  'Independiente': ['Ricardo Bochini', 'Daniel Bertoni', 'Sergio Agüero'],
  'Racing Club': ['Diego Milito', 'Roberto Perfumo', 'Lisandro López'],
  'Peñarol': ['Alberto Spencer', 'Fernando Morena', 'Pedro Rocha'],
  'Nacional de Montevidéu': ['Atilio García', 'Luis Suárez', 'Héctor Scarone'],
  // Argentina — galeria parcial de ídolos e destaques, sem ranking; consulta 2026-11-24.
  // https://contenidos2.sanlorenzo.com.ar/futbol-profesional/jugadores-historicos
  "San Lorenzo": ["José Francisco Sanfilippo","Roberto Telch","Rodolfo Fischer"],
  // https://estudiantesdelaplata.com/historia/
  // https://www.tycsports.com/liga-profesional-de-futbol/los-idolos-de-estudiantes-que-seran-eternos-en-el-nuevo-estadio-20191121.html
  "Estudiantes de La Plata": ["Alberto Zozaya","Juan Ramón Verón","Felipe Ribaudo","Marcos Conigliaro","Eduardo Flores","Juan Sebastián Verón","Carlos Bilardo","Alejandro Sabella"],
  // https://www.clubtalleres.com.ar/el-curioso-caso-de-los-idolos-de-talleres-quienes-son-los-unicos-3-que-nacieron-en-cordoba/
  "Talleres": ["Daniel Willington","José Daniel Valencia","Humberto Bravo","José Alfredo Zelaya","Julián Maidana","Luis Galván","Mario Bevilacqua","Héctor Baley","Miguel Antonio Romero","Diego Garay"],
  // https://argentinosjuniors.com.ar/semillero-del-mundo/
  "Argentinos Juniors": ["Diego Maradona","Claudio Borghi","Sergio Batista","Fernando Redondo","Juan Román Riquelme"],
  // https://www.velez.ar/club/historia
  // https://velez.com.ar/junta-historica/notas/2020/04/09/210431_la-estatua-del-idolo-eterno
  "Vélez Sarsfield": ["Carlos Bianchi","José Luis Chilavert","Omar Asad","Christian Bassedas","José Flores","Roberto Trotta","Marcelo Gómez","Raúl Cardozo"],
  // https://www.lanus.gob.ar/noticias/3636-se-inauguro-el-paseo-de-los-idolos-del-club-atletico-lanus
  "Lanús": ["José Sand","Lautaro Acosta","Armando González","Hugo Morales","Diego Valeri","Gilmar Villagrán","Ángel Silva","Bernardo Acosta","José Nazionale","Gabriel Schurrer"],
  // https://rosario.com.ar/estfut/rcentral.htm
  "Rosario Central": ["Aldo Pedro Poy","Omar Palma","Mario Kempes"],
  // https://diarioimagen.com.ar/chongui-saldana-elegido-por-los-hinchas-entre-los-mejores-22-jugadores-de-la-historia-de-newells/
  // https://esporteemidia.com/2023/12/os-10-melhores-jogadores-da-historia-do-newells-old-boys.html
  // https://radiografica.org.ar/2021/06/27/newells-1987-88-el-unico-equipo-campeon-con-todos-jugadores-surgidos-en-el-club/
  "Newell's Old Boys": ["Gerardo Martino","Norberto Scoponi","Maxi Rodríguez","Ignacio Scocco","Américo Gallego","Santiago Santamaría","Mario Zanabria","Juan Manuel Llop","Víctor Ramos","Julio César Saldaña"],
  // https://www.eldestapeweb.com/deportes/huracan/quienes-son-los-maximos-idolos-de-huracan-en-la-historia-2026128105553
  // https://cahuracan.com/noticias/los-mejores-momentos-del-bautismo-de-la-pena-miguel-brindisi
  "Huracán": ["René Houseman","Miguel Ángel Brindisi","Carlos Babington","Roque Avallay","Omar Larrosa","Herminio Masantonio"],
  // https://belgrano.com.ar/historia/
  "Belgrano": ["Luis Fabián Artime","Luis Ernesto Sosa"],
  // https://www.vavel.com/ar/data/defensa-y-justicia/bio
  "Defensa y Justicia": ["Néstor Omar Benítez","Jorge Galleguillo"],
  // https://clubgodoycruz.com.ar/los-idolos-vuelven-a-casa-figuras-historicas-diran-presente-en-la-inauguracion-del-feliciano-gambarte/
  "Godoy Cruz": ["Daniel Oldrá","Alejandro Abaurre","Diego Villar","David Ramírez","Nelson Ibáñez","Diego Pozo","Miguel Ángel Pasqualetto","Alberto Cepeda","Héctor Pedone"],
  // https://deportv.gob.ar/futbol/editar-garrafa-sanchez-nid%3A513
  // https://www.afa.com.ar/regla/posts/garrafa
  "Banfield": ["José Luis Garrafa Sánchez","Eliseo Mouriño","Gustavo Albella","Félix Orte","Javier Sanguinetti"],
  // https://www.gimnasia.org.ar/merecido-reconocimiento-a-griguol/
  // https://www.gimnasia.org.ar/el-club/historia/
  "Gimnasia La Plata": ["Guillermo Barros Schelotto","Gustavo Barros Schelotto","Mariano Messera","Sebastián Romero","Roberto Sosa","Andrés Yllana","Jorge San Esteban","Pedro Troglio"],
  // https://catigre.com.ar/club/historia/
  "Tigre": ["Bernabé Ferreyra","Daniel Islas","Martín Galmarini","Alexis Ferrero","Juan Carlos Blengio","Diego Castaño","Román Martínez","Martín Morel","Leandro Lázzaro"],
  // https://cap.org.ar/2021/02/daniel-vega-dice-adios-y-nace-la-leyenda/
  // https://cap.org.ar/2020/05/los-maximos-goleadores-calamares/
  // https://cap.org.ar/2020/05/platense115-un-aniversario-distinto-pero-lleno-de-emociones-y-solidaridad/
  // https://cap.org.ar/2017/07/el-pueblo-de-platense-agradecio-a-sus-idolos/
  "Platense": ["Daniel Vega","Vicente Sayago","José Luis Petti","Marcelo Espina","Alejandro Alfaro Moreno","Felipe Bellini","Rolando Cristante","Oscar López Turitich"],
  // Demais clubes sul-americanos — seleção editorial parcial, sem ranking; consulta 2026-11-24.
  // https://futbolete.com/ohnacional-com/mayores-idolos-de-atletico-nacional-en-su-historia/775538/
  // https://balonlatino.net/mejores-jugadores-historia-atletico-nacional/
  "Atlético Nacional": ["René Higuita","Andrés Escobar","Víctor Aristizábal","Humberto Álvarez","Alexis Henríquez","Franco Armani"],
  // https://www.winsports.co/futbol-colombiano/noticias/junior-vs-millonarios-un-partido-con-idolos-que-marcaron-historia-343327
  "Millonarios": ["Alfredo Di Stéfano","Willington Ortiz","Arnoldo Iguarán","David Mackalister Silva"],
  // https://www.elespectador.com/deportes/futbol-colombiano/junior-fc/el-11-historico-del-junior-de-barranquilla-los-100-anos-del-cuadro-tiburon/?outputType=amp
  // https://www.winsports.co/futbol-colombiano/noticias/junior-vs-millonarios-un-partido-con-idolos-que-marcaron-historia-343327
  "Junior de Barranquilla": ["Carlos Valderrama","Sebastián Viera","Giovanni Hernández","Teófilo Gutiérrez","Carlos Bacca"],
  // https://chile.as.com/chile/2016/01/07/album/1452202339_640187.html
  // https://www.colo-colo.com/los-fichajes-que-se-convirtieron-en-leyenda-en-colo-colo/
  // https://www.24horas.cl/deportes/futbol-nacional/la-formacion-ideal-con-jugadores-que-defendieron-a-la-uc-y-colo-colo-2315154
  "Colo-Colo": ["David Arellano","Guillermo Subiabre","Alfonso Domínguez","Arturo Torres","Marcelo Barticciotto","Esteban Paredes","Elson Beyruth","Marcelo Espina"],
  // https://www.udechile.cl/noticias/especial-aniversario-los-jugadores-que-rompieron-records-y-dejaron-su-marca-en-el-romantico-viajero
  "Universidad de Chile": ["Leonel Sánchez","Carlos Campos","Marcelo Salas"],
  // https://cruzados.cl/cruzados-historicos/nestor-gorosito/
  // https://www.alairelibre.cl/futbol/cruzalbos-siete-futbolistas-que-jugaron-en-colo-colo-y-universidad-catolica/
  "Universidad Católica": ["Néstor Gorosito","Alberto Acosta","José Pedro Fuenzalida"],
  // https://www.clubolimpia.com.py/historia
  // https://www.abc.com.py/deportes/futbol/olimpia/2026/07/25/olimpia-celebra-124-anos-de-historia-con-homenaje-a-ever-almeida-y-la-mira-puesta-en-el-clausura/
  "Olimpia": ["Éver Almeida","Raúl Vicente Amarilla","Gabriel González","Adriano Samaniego","Mauro Caballero","Miguel Ángel Benítez","Roque Santa Cruz","Alicio Solalinde","Carlos Kiese","Virginio Cáceres"],
  // https://www.ultimahora.com/los-idolos-cerristas-invitados-la-inauguracion-la-nueva-olla-n1102613
  // https://www.lanacion.com.py/futboledicion-impresa/2019/02/17/aquel-triunfo-con-campeonato-del-72/
  // https://www.rdn.com.py/2017/08/18/borran-a-olimpistas-del-festejo-de-la-nueva-olla/
  "Cerro Porteño": ["Saturnino Arrúa","Julio Dos Santos","Roberto Fernández","Francisco Arce","Juan Manuel Battaglia","Juvencio Osorio","Santiago Salcedo","Justo Jacquet"],
  // https://www.primicias.ec/noticias/jugada/eldeportequequeremos/liga-quito-fundacion-historia-jugadores-aniversario/
  // https://www.primicias.ec/noticias/jugada/eldeportequequeremos/jugadores-titulos-liga-quito-historia//
  "LDU de Quito": ["Patricio Urrutia","Néicer Reasco","Franklin Salas","Damián Manso","Alexander Domínguez","Paúl Ambrosi","Epifanio Brizuela","Héctor Morales","César Mantilla"],
  // https://www.expreso.ec/deportes/independiente-del-valle-jugadores-historicos-de-la-gloria-rayada-267025.html
  // https://www.teleamazonas.com/junior-sornoza-referente-independiente-valle/
  "Independiente del Valle": ["Junior Sornoza","Richard Schunke","Librado Azcona","Jorge Pinos","Arturo Mina","Alán Franco","Luis Segovia","Jefferson Orejuela","Luis Fernando León","Jonny Uchuari"],
  // https://especiales.eluniverso.com/barcelona-sporting-club/idolos-idolo/
  "Barcelona de Guayaquil": ["Washington Muñoz","Alberto Spencer","Galo Vásquez","Jimmy Montanero","Carlos Luis Morales","Clímaco Cañarte"],
  // Europa
  'Real Madrid': ['Alfredo Di Stéfano', 'Cristiano Ronaldo', 'Raúl', 'Iker Casillas'],
  'Barcelona': ['Lionel Messi', 'Johan Cruyff', 'Xavi', 'Andrés Iniesta'],
  'Atlético de Madrid': ['Luis Aragonés', 'Fernando Torres', 'Koke', 'Antoine Griezmann'],
  'Manchester United': ['Bobby Charlton', 'George Best', 'Ryan Giggs', 'Eric Cantona'],
  'Liverpool': ['Kenny Dalglish', 'Steven Gerrard', 'Ian Rush', 'Mohamed Salah'],
  'Arsenal': ['Thierry Henry', 'Dennis Bergkamp', 'Tony Adams', 'Ian Wright'],
  'Chelsea': ['Frank Lampard', 'John Terry', 'Didier Drogba', 'Petr Čech'],
  'Manchester City': ['Sergio Agüero', 'Vincent Kompany', 'David Silva', 'Kevin De Bruyne'],
  'Tottenham': ['Jimmy Greaves', 'Harry Kane', 'Glenn Hoddle'],
  'Bayern de Munique': ['Franz Beckenbauer', 'Gerd Müller', 'Thomas Müller', 'Philipp Lahm'],
  'Borussia Dortmund': ['Marco Reus', 'Michael Zorc', 'Jürgen Kohler'],
  'Juventus': ['Alessandro Del Piero', 'Gianluigi Buffon', 'Michel Platini', 'Roberto Baggio'],
  'Milan': ['Paolo Maldini', 'Marco van Basten', 'Franco Baresi', 'Kaká'],
  'Inter de Milão': ['Javier Zanetti', 'Giuseppe Meazza', 'Ronaldo', 'Diego Milito'],
  'Roma': ['Francesco Totti', 'Daniele De Rossi', 'Bruno Conti'],
  'Napoli': ['Diego Maradona', 'Marek Hamšík', 'Dries Mertens'],
  'PSG': ['Raí', 'Zlatan Ibrahimović', 'Kylian Mbappé', 'Pauleta'],
  'Benfica': ['Eusébio', 'Rui Costa', 'Mário Coluna'],
  'Porto': ['Fernando Gomes', 'Vítor Baía', 'Deco'],
  'Sporting': ['Cristiano Ronaldo', 'Luís Figo', 'Fernando Peyroteo'],
  'Ajax': ['Johan Cruyff', 'Marco van Basten', 'Frank Rijkaard'],
  // Inglaterra — seleção editorial parcial de ídolos e destaques; consulta 2026-11-24.
  // https://www.leedsunited.com/en/news/billy-bremner-25-years-since-a-legend-passed
  // https://lufcarchive.com/history.html
  // https://lufchistory.com/
  "Leeds United": ["Billy Bremner","John Charles","Peter Lorimer","Jack Charlton","Norman Hunter","Eddie Gray","Allan Clarke","Johnny Giles"],
  // https://www.coventrycity-mad.co.uk/news/tmnw/george_hudson_amongst_those_attending_legends_day_915019/index.shtml
  "Coventry City": ["Steve Ogrizovic","George Hudson","Dave Bennett","Willie Carr","Micky Gynn"],
  // https://www.sunderlandafc.news/club/legends/
  "Sunderland": ["Charlie Hurley","Kevin Phillips","Bobby Gurney","Charlie Buchan"],
  // https://therealefl.co.uk/english-football-teams/hull-city/
  // https://tigerbase.hullcity.com/tigers-plyr-records.php
  "Hull City": ["Chris Chilton","Ken Wagstaff","Dean Windass","Jock Davidson"],
  // https://www.evertonresults.com/legends.htm
  // https://efcheritagesociety.com/efcheritagesociety-com-page_idcat3/dixie-dean-memorial-awards/
  // https://www.evertonfc.com/news/2025/february/11/goodison-s-most-memorable-merseyside-derbies/
  "Everton": ["Dixie Dean","Neville Southall","Alan Ball","Brian Labone","Joe Mercer","Graeme Sharp","Kevin Ratcliffe","Colin Harvey","Alex Young","Howard Kendall"],
  // https://www.cpfc.co.uk/hospitality/legendaryhosts/
  // https://www.tottenhamhotspur.com/news/994542/legends-on-legends-crystal-palace
  "Crystal Palace": ["Ian Wright","Mark Bright","Jim Cannon","Geoff Thomas","Nigel Martyn","Alan Pardew"],
  // https://www.fulhamfc.com/club/history/history-of-fulham-football-club
  // https://www.fulhamfc.com/club/history/honours
  "Fulham": ["Johnny Haynes","George Cohen","Gordon Davies","Tony Macedo","Jim Langley","Alan Mullery","Graham Leggat","Rodney Marsh"],
  // https://www.brightonandhovealbion.com/media-article/bhafc-125-year-anniversary-wall
  "Brighton": ["Tommy Cook","Peter Ward","Bobby Zamora","Glenn Murray","Lewis Dunk","Pascal Groß"],
  // https://www.avfc.co.uk/news/2025/march/17/Legacy-Numbers--Shaw--Fashanu--Hardy-and-Saward/
  // https://shop.avfc.co.uk/en/aston-villa-1990-blackout-shirt/p-1292709049288156%2Bz-985-1274953860
  // https://next.avfc.co.uk/news/2026/july/16/news-tradenation-provide-special-day-for-lions-clubs/
  "Aston Villa": ["Paul McGrath","Peter Withe","Gordon Cowans","Gary Shaw","David Platt","Tony Daley"],
  // https://www.newcastleunited.com/en/hall-of-fame
  // https://www.newcastleunited.com/en/news/alan-shearer-names-his-greatest-xi
  "Newcastle": ["Alan Shearer","Jackie Milburn","Malcolm Macdonald","Peter Beardsley","Shay Given","Bob Moncur","Kevin Keegan","Chris Waddle"],
  // https://www.nottinghamforest.co.uk/club-information/history/club-information-history-of-nottingham-forest
  // https://livepreview.nottinghamforest.co.uk/news/2025/july/30/legends-tours-with-ian-storey-moore-on-sale-now/
  // https://livepreview.nottinghamforest.co.uk/news/2025/november/25/special-souvenir-edition-programme-for-malmo/
  "Nottingham Forest": ["John Robertson","John McGovern","Stuart Pearce","Martin O'Neill","Frank Clark","Ian Storey-Moore","Viv Anderson","Garry Birtles"],
  // https://www.afcb.co.uk/news/2025/november/03/junior-cherries-day-october-2025/
  // https://www.afcb.co.uk/news/2025/march/17/Information-points-drops-united-home/
  "Bournemouth": ["Steve Fletcher","Ted MacDougall"],
  // https://www.brentfordfc.com/en/news/new-additions-to-brentford-fc-hall-of-fame_70938
  // https://www.brentfordfc.com/en/news/article/wall-of-fame-created-at-griffin-park-_69961
  "Brentford": ["Jim Towers","George Francis","Kevin O'Connor","Ken Coote","Jamie Bates","Marcus Gayle","Jackie Graham","Terry Evans"],
  // https://prideofanglia.com/page.php?page=hallOfFameSummary
  // https://www.prideofanglia.com/page.php?page=hallOfFame
  "Ipswich Town": ["Mick Mills","John Wark","Ray Crawford","Ted Phillips","Kevin O'Callaghan","David Linighan","Doug Millward"],
  // Inglaterra — segunda divisão do jogo; seleção editorial parcial, consulta 2026-11-24.
  // https://www.southamptonfc.com/en/news/article/saints-launch-legacy-numbers
  "Southampton": ["Matt Le Tissier","Mick Channon","Terry Paine"],
  // https://en.wikipedia.org/wiki/Norwich_City_F.C._Hall_of_Fame
  "Norwich City": ["Kevin Keelan","Darren Huckerby","Iwan Roberts"],
  // https://www.sheffieldunited.news/club/legends/
  "Sheffield United": ["Tony Currie","Jimmy Hagan","Joe Shaw"],
  // https://www.boro.news/club/legends/
  "Middlesbrough": ["Juninho Paulista","Wilf Mannion","Brian Clough"],
  // https://www.westbromnews.co.uk/2025/09/09/tony-brown-and-bob-taylor-top-10-west-brom-legends-every-fan-should-know
  "West Bromwich Albion": ["Jeff Astle","Tony Brown","Bryan Robson","John Wile"],
  // https://toby393.substack.com/p/millwalls-prodigal-sons-of-the-last
  "Millwall": ["Neil Harris","Tim Cahill","Steve Morison","Tony Craig"],
  // https://brfpa.co.uk/
  "Blackburn Rovers": ["Alan Shearer","Brad Friedel","Bryan Douglas","Derek Fazackerley","Simon Garner"],
  // https://www.bristolcitysupporters.org/heritage/
  "Bristol City": ["John Atyeo","Gerry Gow","Bob Taylor","Scott Murray","Louis Carey"],
  // https://therealefl.co.uk/category/championship/watford-football-club/
  "Watford": ["Luther Blissett","John Barnes","Tony Coton"],
  // https://www.swanseacity.com/history/players-past
  "Swansea City": ["Ivor Allchurch","Cliff Jones","Alan Curtis"],
  // https://therealefl.co.uk/category/clubs/championship/stoke-city/
  "Stoke City": ["Stanley Matthews","Gordon Banks","George Eastham"],
  // https://www.bbc.co.uk/sport/football/26194543
  "Preston North End": ["Tom Finney"],
  // https://vitalfootball.co.uk/wednesday-legends/
  "Sheffield Wednesday": ["David Hirst","Chris Waddle","Roland Nilsson","John Sheridan"],
  // https://www.derbycounty.news/club/legends/
  "Derby County": ["Steve Bloomer","Kevin Hector","Craig Bryson"],
  // https://www.portsmouthfc.news/club/legends/
  "Portsmouth": ["Jimmy Dickinson","David James","Duggie Reid"],
  // https://vitalfootball.co.uk/luton-town-your-5-best-ever-forwards-revealed/
  "Luton Town": ["Mick Harford","Brian Stein"],
  // https://www.molineux.news/club/legends/
  "Wolves": ["Billy Wright","Steve Bull","Derek Parkin","Derek Dougan","Bert Williams"],
  // https://www.whufc.com/en/the-club/history/honours-and-records/awards
  "West Ham": ["Bobby Moore","Geoff Hurst","Martin Peters","Billy Bonds","Trevor Brooking","Mark Noble"],
  // https://www.leicestercity.news/club/legends/
  "Leicester City": ["Jamie Vardy","Gary Lineker","Graham Cross"],
  // https://www.tottenhamhotspur.com/news/995329/legends-on-legends-burnley
  "Burnley": ["Jimmy McIlroy","Jimmy Adamson"],
  // https://informationbirmingham.com/birmingham-city-fc
  "Birmingham City": ["Trevor Francis","Joe Bradford","Gil Merrick"],
  // https://www.bwfc.co.uk/news/2020/september/one-town-nat-lofthouse---a-northern-powerhouse
  "Bolton Wanderers": ["Nat Lofthouse"],
  // https://www.cardiffcityfc.co.uk/club/club-history
  "Cardiff City": ["Fred Keenor","Phil Dwyer"],
  // https://cafcmuseum.net/history/
  "Charlton Athletic": ["Sam Bartram","Derek Hales","Mike Flanagan","Keith Peacock","Colin Powell","Clive Mendonca"],
  // https://the72.co.uk/guide/lincoln-city-fc-club-records/
  "Lincoln City": ["Grant Brown","Andy Graver","Gordon Hobson","Allan Hall"],
  // https://www.qpr.co.uk/news/2024/february/24/stan-bowles-rip/
  "Queens Park Rangers": ["Stan Bowles","Rodney Marsh","Les Ferdinand"],
  // https://upthetown.uk/legends
  "Wrexham": ["Arfon Griffiths","Dixie McNeil","Tommy Bamford"],
  // Espanha — primeira divisão do jogo; seleção editorial parcial, sem ordem de mérito; consulta 2026-11-24.
  // https://www.realracingclub.es/noticias/la-leyenda-esta-de-nuevo-en-casa
  // https://www.realracingclub.es/noticias/el-partido-solidario-de-leyendas-racinguistas-reune-en-las-instalaciones-a-mas-de-500-aficionados
  "Racing Santander": ["Pedro Munitis","José Ceballos","Gonzalo Colsa","Quique Setién","Salva Ballesta","Nikola Žigić"],
  // https://museo.levanteud.com/recuerdos/
  // https://www.laliga.com/noticias/vota-por-tu-jugador-historico-del-levante-ud
  "Levante": ["José Luis Morales","Sergio Ballesteros","Juanfran García","Félix Ettien","Vicente Iborra","Gustavo Munúa"],
  // https://www.rcdeportivo.es/es/protagonistas-jugadores-legendarios
  // https://dxtcampeon.elidealgallego.com/deportivo/depor/2026-05-22/una-charla-con-cinco-leyendas-del-deportivo-no-podemos-ser-miedosos-y-no-lo-vamos-a-ser-857226.html
  "Deportivo La Coruña": ["Fran","Bebeto","Mauro Silva","Donato","Francisco Liaño","Jacques Songo'o","Juan Carlos Valerón","Manuel Pablo"],
  // https://www.malagacf.com/noticias/gracias-duda
  // https://www.malagacf.com/noticias/500-veces-como-mcf-en-la-rosaleda
  // https://www.malagacf.com/noticias/convocatoria-del-malaga-cf-leyendas-y-de-afe
  "Málaga": ["Duda","Darío Silva","Julio César Dely Valdés","Basti","Jesús Gámez","Vicente Valcarce","Catanha"],
  // https://www.laliga.com/noticias/jugadores-historicos-valencia-cf
  // https://www.laliga.com/noticias/vota-por-tu-jugador-historico-del-valencia-cf
  // https://www.penyesvalenciacf.com/de-leyenda/
  "Valencia": ["Mario Kempes","Mundo","Gaizka Mendieta","David Albelda","Rubén Baraja","Santiago Cañizares","Claudio López","Miguel Ángel Angulo","Vicente Rodríguez"],
  // https://www.laliga.com/noticias/jugadores-historicos-real-betis
  // https://en.realbetisbalompie.es/news/current_news/historia-la-foto-de-la-memoria-22970
  "Real Betis": ["Joaquín Sánchez","Rafael Gordillo","José Ramón Esnaola","Julio Cardeñosa","Luis del Sol","Rogelio Sosa"],
  // https://www.laliga.com/noticias/jugadores-historicos-sevilla-fc
  "Sevilla": ["Jesús Navas","Juan Arza","Frédéric Kanouté","Luís Fabiano","Andrés Palop","Manolo Jiménez","Antonio Puerta","Biri Biri","Pablo Blanco"],
  // https://www.laliga.com/es-US/noticias/jugadores-historicos-real-sociedad
  // https://www.laliga.com/noticias/luis-miguel-arconada-elegido-jugador-historico-de-la-real-sociedad
  "Real Sociedad": ["Luis Arconada","Jesús María Zamora","Alberto Górriz","Xabi Prieto","Jon Andoni Larrañaga","Roberto López Ufarte","Xabi Alonso","Darko Kovačević"],
  // https://villarrealcf.es/centenario/el-partido-de-las-leyendas/
  // https://villarrealcf.es/es/bruno-trigueros-y-mario-grandes-amigos-y-leyendas-del-villarreal/
  "Villarreal": ["Bruno Soriano","Marcos Senna","Santi Cazorla","Juan Román Riquelme","Diego Forlán","Gerard Moreno","Joan Capdevila","Manu Trigueros","Mario Gaspar"],
  // https://www.athletic-club.eus/noticias/2021/01/20/zarra-centenario-de-un-mito/
  // https://www.athletic-club.eus/noticias/2023/01/14/iker-muniain-en-el-podio-de-partidos-disputados-con-el-athletic-club/
  // https://www.laliga.com/noticias/jose-angel-iribar-elegido-jugador-historico-del-athletic-club
  "Athletic Bilbao": ["Telmo Zarra","José Ángel Iribar","Pichichi","Agustín Gaínza","Txetxu Rojo","Julen Guerrero","Iker Muniain","Joseba Etxeberria","Aritz Aduriz"],
  // https://www.laliga.com/noticias/iago-aspas-elegido-jugador-historico-del-rc-celta
  // https://www.laliga.com/noticias/vota-por-tu-jugador-historico-del-rc-celta
  // https://as.com/futbol/2016/12/16/album/1481882071_777933.html
  "Celta Vigo": ["Iago Aspas","Aleksandr Mostovoi","Gustavo López","Vladimir Gudelj","Pahiño","Hugo Mallo"],
  // https://www.osasuna.es/osasuna-y-lkn-homenajean-la-historia-del-club-con-un-mural-en-el-sadar
  "Osasuna": ["Patxi Puñal","Jan Urban","Seve Goiburu","Sabino Andonegui","Pablo García","Javad Nekounam","Oier Sanjurjo","Roberto Torres"],
  // https://www.laliga.com/noticias/miguel-angel-sanchez-michel-elegido-jugador-historico-del-rayo-vallecano
  // https://www.laliga.com/noticias/vota-por-tu-jugador-historico-del-rayo-vallecano
  "Rayo Vallecano": ["Míchel (Miguel Ángel Sánchez)","Jesús Diego Cota","Jon Pérez Bolo","Piti","José María De Quintana"],
  // https://www.getafecf.com/jugadores-centenarios
  // https://www.laliga.com/noticias/jugadores-historicos-getafe-cf
  // https://www.laliga.com/noticias/vota-por-tu-jugador-historico-del-getafe-cf
  "Getafe": ["Javi Casquero","Jaime Gavilán","Jaime Mata","Pedro León","Cata Díaz","Djené Dakonam","David Soria"],
  // https://www.laliga.com/es-DE/noticias/jugadores-historicos-del-deportivo-alaves
  // https://www.laliga.com/es-US/noticias/javier-moreno-elegido-jugador-historico-del-deportivo-alaves
  "Alavés": ["Javi Moreno","Manu García","Fernando Pacheco","Jordi Cruyff","Cosmin Contra","Antonio Karmona","Martín Herrera"],
  // https://www.rcdespanyol.com/es/noticia/una-nueva-fase-culminada/3415
  // https://www.laliga.com/es-DE/noticias/jugadores-historicos-rcd-espanyol
  "Espanyol": ["Raúl Tamudo","Rafa Marañón","Thomas N'Kono","Ricardo Zamora","Dani Jarque","Dani Solsona","Mauricio Pochettino"],
  // https://www.elchecf.es/noticias/equipo-los-400-de-nino
  // https://www.elchecf.es/noticias/reportaje-nino-sigue-haciendo-historia
  // https://fcmagazin.com/elx-cf/tots-els-jugadors-de-la-historia-de-lelx-abast/
  "Elche": ["Nino","César Rodríguez","Tomeu Llompart","Vicente Iborra (histórico)","Miguel Quirant","Cayetano Ré","Rubén Cano"],
  // Espanha — segunda divisão do jogo; seleção editorial parcial de ídolos e destaques históricos, sem ranking. Consulta: 2026-11-24.
  // https://www.realzaragoza.com/los-magnificos
  "Real Zaragoza": ["Marcelino","Carlos Lapetra","Canario","Eleuterio Santos","Juan Manuel Villa","Severino Reija","Paco Santamaría"],
  // https://www.lavozdeasturias.es/amp/noticia/sporting1905/2026/05/02/7-criterios-entrar-paseo-fama-sporting-48-placas-futbolistas-elegidos/00031777717547944973641.htm
  // https://as.com/futbol/2016/11/24/primera/1480021307_978105.html
  // https://www.lavozdeasturias.es/noticia/sporting1905/2018/07/22/30-jugadores-valiosos-historia-sporting/00031532252613331144517.htm
  "Sporting Gijón": ["Quini","Joaquín Alonso","Enzo Ferrero","Cundi","Antonio Maceda","Juan Carlos Ablanedo","Churruca","David Villa"],
  // https://www.transfermarkt.es/sd-eibar/rekordspieler/verein/1533
  // https://www.laligaennumeros.es/2015/07/numeros-de-la-sd-eibar-en-primera.html
  "Eibar": ["Mikel Arruabarrena","Ander Capa"],
  // https://www.cadizcf.com/historia
  // https://www.cadizcf.com/noticias/respeto-y-carino-en-el-homenaje-a-la-memoria-cadista
  "Cádiz": ["Mágico González","Pepe Mejías","Juan José Jiménez","Chico Linares","Carmelo Navarro","Jesús Amarillo"],
  // https://www.sdhuesca.es/noticias/camacho-se-marcha-una-leyenda
  "Huesca": ["Juanjo Camacho"],
  // https://www.granadacf.es/noticias/candi-el-presidente-de-la-etapa-deportiva-mas-gloriosa-del-granada-cf
  // https://www.granadacf.es/noticias/los-historicos-granadinos-ya-tienen-su-puerta
  "Granada": ["Enrique Porta","José Aguirre Suárez","Ladislao Mazurkiewicz","Julio Montero Castillo","Thomas Parits","Manuel Lucena"],
  // https://www.udalmeriasad.com/noticias/corona-se-convierte-en-el-jugador-del-almeria-con-mas-partidos-en-primera-division
  // https://www.udalmeriasad.com/noticias/luis-suarez-maximo-goleador-del-campeonato-con-27-goles
  "Almería": ["Corona","José Ortiz Bernal","Fernando Soriano","Leonardo Ulloa","Luis Suárez"],
  // https://www.clubdeportivotenerife.es/noticias/cifras-nombres-y-hechos-de-un-siglo-de-tinerfenismo
  // https://www.clubdeportivotenerife.es/noticias/mellot-se-convierte-en-el-extranjero-con-mas-partidos-con-el-cd-tenerife
  // https://www.clubdeportivotenerife.es/noticias/un-olimpo-distinto-al-de-laliga
  "Tenerife": ["Juan Antonio Pizzi","Nino","Antonio Pedrero","Julito","Rommel Fernández","Fernando Redondo","Toño Hernández","Felipe Miñambres","Suso Santana"],
  // https://www.albacetebalompie.es/noticias/el-club-quiso-reconocer-a-sus-leyendas
  // https://www.albacetebalompie.es/noticias/antonio-y-stuani-en-la-delantera
  "Albacete": ["José Luis Zalazar","Catali","Luis Gabelo Conejo","Antonio López Alfaro","Porro","Monroy","Cristhian Stuani"],
  // https://www.burgoscf.es/noticias/gracias-eternas-aitor
  // https://www.burgoscf.es/noticias/el-burgos-cf-y-unai-elgezabal-separan-sus-caminos
  "Burgos": ["Aitor Córdoba","Unai Elgezabal"],
  // https://www.cdcastellon.com/el-cd-castellon-homenajeara-a-los-unicos-tres-futbolistas-que-han-ascendido-en-dos-ocasiones-a-primera-division/
  // https://castellonplaza.com/castellonplaza/las-leyendas-del-castellon-recuerdan-su-paso-por-el-club
  "CD Castellón": ["Juan Bautista Planelles","José Ignacio Viña","Pepín Ferrer","Vicente del Bosque","Gaizka Mendieta","Manolo Clares"],
  // https://www.cdeldense.es/historia
  "Eldense": ["Andrés Sirvent (Mondonguito)"],
  // https://www.cordobacf.com/historia
  "Córdoba": ["Juanín","Miralles","Benegas","Simonet","Mingorance","Paz","Homar"],
  // https://www.playerhistory.com/es/club/5147-fc-cartagena
  // https://mexpedia.org/index.php?title=F._C._Cartagena
  "Cartagena": ["Mariano Sánchez","Toché"],
  // https://www.cdmirandes.com/noticias/gracias-pablo
  "Mirandés": ["Pablo Infante"],
  // https://www.racingclubferrol.net/noticias/o-noso-legado
  "Racing Ferrol": ["Alberto","Pazolo","Pablo Rodríguez","Sueiro","Manu","Manel","David Pérez"],
  // https://www.gironafc.cat/es/noticias/200-partits-de-stuani
  // https://www.gironafc.cat/es/noticias/ya-tenemos-capitanes
  "Girona": ["Cristhian Stuani","Àlex Granell","Eloi Amagat","Aday Benítez","Pedro Alcalá"],
  // https://www.laliga.com/noticias/cinco-cosas-que-quiza-no-sabias-del-rcd-mallorca
  // https://www.laliga.com/noticias/samuel-etoo-elegido-jugador-historico-del-rcd-mallorca
  "Mallorca": ["Samuel Eto'o","Dani Güiza","Miquel Àngel Nadal","Javier Olaizola","Paco Soler","Ariel Ibagaza","Juan Arango","Carlos Roa"],
  // https://www.realoviedo.es/club
  // https://www.realoviedo.es/noticias/hace-85-anos-jugaba-por-ultima-vez-la-segunda-delantera-electrica
  "Real Oviedo": ["Isidro Lángara","Herrerita","Emilín","Casuco","Gallart","Marianín","Robert Prosinečki","Peter Dubovský"],
  // https://www.realvalladolid.es/noticias/leyendas-para-respetar-la-historia
  // https://www.realvalladolid.es/noticias/doblete-historico-para-marcos
  // https://www.realvalladolid.es/noticias/centenario-del-nacimiento-de-una-leyenda-blanquivioleta
  "Real Valladolid": ["Alberto Marcos","Luis Mariano Minguela","Pepe Moré","Eusebio Sacristán","Onésimo Sánchez","Paco Lesmes","Juan Carlos Rodríguez"],
  // https://www.udlaspalmas.es/historia
  // https://www.udlaspalmas.es/noticias/jonathan-viera-36-anos-despues-un-jugador-de-la-ud-las-palmas-titular-con-espana
  "Las Palmas": ["Germán Dévora","Tonono","Juan Guedes","Paco Castellano","Martín Marrero","Jonathan Viera"],
  // https://www.cdleganes.com/historia
  // https://fundacion.cdleganes.com/club/historia/leyendas/mantovani
  "Leganés": ["Martín Mantovani","Benjamín Moreno","Catanha","Samuel Eto'o","Javier Eraso","Alberto Martín"],
  // Itália — primeira divisão do jogo; seleção editorial parcial de ídolos e destaques, sem ranking. Consulta: 2026-11-24.
  // https://www.sassuolocalcio.it/club/la-nostra-storia/serie-a/
  "Sassuolo": ["Domenico Berardi","Francesco Magnanelli"],
  // https://www.calciofrosinone.it/2024/02/14/frosinone-giocatori-record-presenze/
  // https://www.transfermarkt.it/frosinone-calcio/rekordspieler/verein/8970
  "Frosinone": ["Mirko Gori","Federico Dionisi","Francesco Bardi"],
  // https://en.veneziafc.it/club/history
  "Venezia": ["Valentino Mazzola","Ezio Loik","Filippo Maniero","Álvaro Recoba"],
  // https://www.udinese.it/Apps/WebObjects/Udinese.woa/wa/viewSection?id=39251&lang=esp
  // https://www.udinese.it/news/societa/ludinese-presente-pagnacco-per-lintitolazione-dello-stadio-a-pietro-zampa
  "Udinese": ["Antonio Di Natale","Zico","Valerio Bertotto","Pietro Zampa","Oliver Bierhoff","Márcio Amoroso","Alexis Sánchez","Samir Handanović","Abel Balbo","Néstor Sensini"],
  // https://www.torinofc.it/news/11/11/2013/i-100-di-sempre-sul-guerin-sportivo_3734
  // https://en.wikipedia.org/wiki/Torino_FC_Hall_of_Fame
  "Torino": ["Valentino Mazzola","Paolo Pulici","Giorgio Ferrini","Gigi Meroni","Virgilio Maroso","Adolfo Baloncieri","Claudio Sala","Valerio Bacigalupo"],
  // https://www.bolognafc.it/en/history-2/
  // https://www.bolognafc.it/presentata-la-maglia-away-con-i-nomi-dei-cento-giocatori-piu-presenti/
  // https://www.bolognafc.it/il-bologna-in-libreria/
  "Bologna": ["Angelo Schiavio","Giacomo Bulgarelli","Ezio Pascutti","Harald Nielsen","Helmut Haller","Giuseppe Savoldi","Giuseppe Signori","Marco Di Vaio","Roberto Baggio","Cesarino Cervellati"],
  // https://alefiorentina.it/hall-of-fame-viola/
  "Fiorentina": ["Giancarlo Antognoni","Kurt Hamrin","Gabriel Batistuta","Francesco Toldo","Giovanni Galli","Daniel Bertoni","Luca Toni","Mario Pizziolo"],
  // https://en.legaseriea.it/serie-a/news/de-roon-a-true-atalanta-icon
  // https://www.calcioatalanta.it/category/bacheca-del-tifoso/miti/
  "Atalanta": ["Marten de Roon","Gianpaolo Bellini","Glenn Strömberg","Valter Bonacina","Cristiano Doni"],
  // https://www.sslazio.it/en/club/leggende
  // https://www.ansa.it/sito/notizie/sport/calcio/2021/06/18/libri-le-leggende-lazio-raccontate-da-patrizia-de-rossi_6af988da-2387-47c6-bc64-18e8d3247347.html
  "Lazio": ["Silvio Piola","Giorgio Chinaglia","Alessandro Nesta","Ciro Immobile","Bruno Giordano","Giuseppe Signori","Paolo Di Canio","Miroslav Klose","Bob Lovati"],
  // https://www.newtoncompton.com/index.php/libro/genoa-capitani-e-bandiere
  // https://www.sportmemory.it/copertina/il-genoa-ritorna/
  // https://www.theguardian.com/sport/the-gentleman-ultra/2024/nov/27/nostalgic-serie-a-five-a-side-teams-picking-a-lineup-for-genoa
  "Genoa": ["Renzo De Vecchi","Giovanni De Prà","Roberto Pruzzo","Diego Milito","Tomáš Skuhravý","Gennaro Ruotolo","Fosco Becattini","Felice Levratto","Gianluca Signorini"],
  // https://www.legab.it/news/i-giocatori-iconici-che-hanno-indossato-la-maglia-del-cagliari
  // https://www.esquire.com/it/sport/calcio/a45260194/cagliari-squadra/
  "Cagliari": ["Gigi Riva","Daniele Conti","Mario Brugnera","Nené (Claudio Olinto de Carvalho)","Luigi Piras","Diego López","David Suazo","Andrea Cossu"],
  // https://comofootball.com/en/como-x-adidas-launch-exclusive-legends-collection/
  // https://comofootball.com/como-legends-marco-cassetti/
  "Como": ["Gigi Meroni","Stefano Borgonovo","Marco Cassetti"],
  // https://www.parmacalcio1913.com/en/legends/
  // https://www.legab.it/news/parma-la-top-11-degli-ultimi-30-anni
  // https://sport.sky.it/calcio/parma-tanzi-campioni
  "Parma": ["Gianluigi Buffon","Fabio Cannavaro","Lilian Thuram","Gianfranco Zola","Hernán Crespo","Enrico Chiesa","Tomas Brolin","Alessandro Melli","Alberto Gilardino"],
  // https://oo.uslecce.it/storia
  // https://nucleilecce.it/u-s-lecce
  // https://sport.sky.it/calcio/lecce-giocatori-famosi-storia
  // https://it.wikipedia.org/wiki/Statistiche_e_record_dell%27Unione_Sportiva_Lecce
  "Lecce": ["Michele Lorusso","Pedro Pasculli","Antonio Conte","Mirko Vučinić","Guillermo Giacomazzi"],
  // https://ilmonzasiamonoi.it/storia/monza-hall-of-fame/
  "Monza": ["Sergio Magni","Marco Bolis","Francesco Copreni","Roberto Fontanini","Dany Mota"],
  // Itália — segunda divisão do cadastro do jogo; seleção editorial parcial, sem ordem de mérito; consulta 2026-11-24.
  // Brescia: galeria do Brescia Calcio histórico, não de eventual entidade sucessora.
  // https://www.sampdoria.it/en/history-en/
  // https://www.sampdoria.it/legends/
  "Sampdoria": ["Roberto Mancini","Gianluca Vialli","Gianluca Pagliuca","Pietro Vierchowod","Attilio Lombardo","Toninho Cerezo","Moreno Mannini","Luca Pellegrini","Fausto Pari","Trevor Francis"],
  // https://www.palermofc.com/it/news/hall-of-fame-ecco-gli-11-1-scelti-dai-tifosi-rosanero
  "Palermo": ["Stefano Sorrentino","Federico Balzaretti","Andrea Barzagli","Fabio Grosso","Eugenio Corini","Josip Iličić","Javier Pastore","Lamberto Zauli","Paulo Dybala","Fabrizio Miccoli","Luca Toni"],
  // https://www.legab.it/news/buon-compleanno-bari
  // https://www.legab.it/seriebkt/ultime-news/i-giocatori-iconici-che-hanno-vestito-la-maglia-del-bari
  "Bari": ["Jean-François Gillet","Giovanni Loseto","Igor Protti","Sandro Tovalieri","Antonio Cassano","Phil Masinga","Mirco Antenucci","Valerio Di Cesare"],
  // https://sport.sky.it/calcio/cremonese-giocatori-famosi-storia
  // https://uscremonese.it/abbonamenti-2024-25-chiusura-a-quota-6mila-313/
  "Cremonese": ["Gianluca Vialli","Enrico Chiesa","Attilio Lombardo","Erminio Favalli"],
  // https://www.speziacalcio.com/it/primati.12100.html
  // https://www.spezia1906.com/2025/05/07/altri-tre-pezzi-di-storia-nella-hof-bonanni-un-premio-per-tutti-noi/
  "Spezia": ["Osvaldo Motto","Giampaolo Bonanni","Gianni Zennaro"],
  // https://www.calciocatanzaro.it/miti/massimo-palanca/
  // https://www.catanzaroclub79.it/storia/
  "Catanzaro": ["Massimo Palanca","Angelo Mammì","Renzo Rossi"],
  // https://www.legab.it/news/gli-attaccanti-piu-iconici-del-brescia
  // https://www.guerinsportivo.it/news/il-cuoio/2025/06/11-8194069/addio_brescia_ecco_un_undici_ideale
  "Brescia": ["Roberto Baggio","Luca Toni","Dario Hübner","Andrea Pirlo","Gheorghe Hagi","Igli Tare"],
  // https://www.legab.it/news/i-calciatori-iconici-che-hanno-vestito-la-maglia-del-modena
  "Modena": ["Renato Braglia","Alfredo Mazzoni"],
  // https://www.calcioweb.eu/squadre/salernitana/storia/
  // https://sport.sky.it/calcio/serie-a/salernitana-giocatori-famosi-storia
  "Salernitana": ["Marco Di Vaio","Agostino Di Bartolomei","Gennaro Gattuso","David Di Michele","Arturo Di Napoli","Salvatore Fresi"],
  // https://reggianacalcio.it/2026/09/04/third-kit-26-27-ac-reggiana-e-la-storia-che-non-si-dimentica-con-il-professore-aldo-catalani/
  // https://reggianacalcio.it/2025/06/27/paolo-rozzio-e-granata-per-la-decima-stagione/
  "Reggiana": ["Aldo Catalani","Paolo Rozzio"],
  // https://www.cesenafc.com/it/society/history
  "Cesena": ["Walter Schachner","Massimo Agostini","Agatino Cuttone","Dario Hübner","Davor Jozić","Giuseppe Piraccini","Pierluigi Cera"],
  // https://vocedimantova.it/sport/calcio-serie-c-guccione-verso-la-quarta-stagione-di-fila-nel-mantova-un-evento/
  // https://vocedimantova.it/sport/calcio-serie-b-mantova-6-stagioni-di-fila-per-panizzi-solo-in-24-prima-di-lui/
  "Mantova": ["Manuel Spinale","Gaetano Caridi","Gabriele Graziani","Pierangelo Avanzi"],
  // https://www.ascittadella.it/notizie/capitan-iori-fa-200/
  // https://www.ascittadella.it/notizie/coralli-nella-storia/
  // https://www.mattinopadova.it/sport/iori-sono-303-presenze-in-maglia-granata-storia-di-questo-club-qqugul97
  "Cittadella": ["Manuel Iori","Claudio Coralli","Joachim De Gasperi","Alberto Marchesan","Andrea Pierobon"],
  // https://hellasverona.it/news/12-maggio-1985-hellas-verona-campione-ditalia-video
  // https://hellasverona.it/news/veronacamp40ne-lhellas-verona-e-gli-eroi-dello-scudetto-ospiti-a-montecitorio
  "Verona": ["Preben Elkjær","Hans-Peter Briegel","Roberto Tricella","Claudio Garella","Giuseppe Galderisi","Pietro Fanna","Domenico Volpati","Antonio Di Gennaro"],
  // https://www.legab.it/news/i-calciatori-iconici-che-hanno-vestito-la-maglia-del-pisa
  // https://news.bet365.it/it-it/article/pisa-i-giocatori-piu-famosi-della-storia-del-club-simeone-dunga-kieft-berggreen-vieri-allegri/2025050613524067553
  "Pisa": ["Fabrizio Barontini","Piero Gionfantini","Klaus Berggreen"],
  // Alemanha — seleção editorial parcial de ídolos e destaques, sem ranking. Consulta: 2026-11-24.
  // https://schalke04.de/verein/tradition/schalke-legenden/jahrhundertelf/
  // https://schalke04.de/inside/legenden-elf-des-ruhrgebiets/
  "Schalke 04": ["Ernst Kuzorra","Fritz Szepan","Klaus Fischer","Olaf Thon","Klaus Fichtel","Stan Libuda"],
  // https://www.scp07.de/Teams/Profis/News-Profis/200.-Pflichtspiel.html
  "Paderborn": ["Markus Krösche","Jörg Bräuer","Markus Mrugalla","Christian Strohdiek","Lukas Kruse","Daniel Brückner","Sven Michel"],
  // https://www.scfreiburg.com/verein/historie/sc-geschichte/2025-heute/
  "Freiburg": ["Christian Günter","Andreas Zeyer","Nils Petersen","Vincenzo Grifo"],
  // https://www.worldfootball.net/teams/te24/tsg-hoffenheim/records-all-time-appearances/
  "Hoffenheim": ["Oliver Baumann","Andrej Kramarić","Sebastian Rudy","Sejad Salihović"],
  // https://www.fc-union-berlin.de/de-e/alle-neuigkeiten/budenzeit-fuer-die-traditionself-Nuzuvz
  "Union Berlin": ["Torsten Mattuschka","Karim Benyamina","Daniel Göhlert","Christian Stuff","Christopher Quiring"],
  // https://www.vfb.de/de/vfb/aktuell/neues/club/2025/kader-der-vfb-legenden-beim-beckenbauer-cup/
  // https://www.vfb.de/de/vfb/verein/traditionself/legende/
  // https://www.vfb.de/en/vfb/latest/news/club/2023/markenbotschafter-/
  // https://www.merkur.de/sport/fussball/legendaere-spieler-vfb-stuttgart-allgoewer-bobic-balakov-buchwald-elber-schlienz-sigurvinsson-zr-92693448.html
  "Stuttgart": ["Karl Allgöwer","Guido Buchwald","Krassimir Balakov","Fredi Bobic","Giovane Élber","Cacau","Hansi Müller","Timo Hildebrand"],
  // https://profis.eintracht.de/news/adlerticker-die-eintracht-news-des-tages-freitag-2-oktober-2026-179580/
  "Eintracht Frankfurt": ["Jürgen Grabowski","Bernd Hölzenbein","Jay-Jay Okocha","Tony Yeboah","Alexander Meier","Makoto Hasebe","Karl-Heinz Körbel","Sebastian Rode"],
  // https://rbleipzig.com/de/news/orban-poulsen-gulacsi-kampl-forsberg-champions-league-rekord-rbl-manchester-city
  // https://rbleipzig.com/en/match-news/match-preview-champions-league-rb-leipzig-rc-lens-24-november-2026
  "RB Leipzig": ["Yussuf Poulsen","Willi Orbán","Emil Forsberg","Péter Gulácsi","Kevin Kampl","Christopher Nkunku"],
  // https://www.bayer04.de/en-us/page/history/honorary-captains
  // https://www.bayer04.de/de-de/page/historie/bundesliga-allstars
  "Leverkusen": ["Ulf Kirsten","Rüdiger Vollborn","Bernd Schneider","Carsten Ramelow","Simon Rolfes","Stefan Kießling","Lars Bender","Jens Nowotny","Lúcio","Zé Roberto","Michael Ballack"],
  // https://www.bundesliga.com/en/bundesliga/news/borussia-monchengladbach-bundesliga-club-by-club-historical-guide-heynckes-netzer-24134
  "Borussia Mönchengladbach": ["Günter Netzer","Jupp Heynckes","Berti Vogts","Rainer Bonhof","Allan Simonsen","Wolfgang Kleff"],
  // https://www.werder.de/news/maenner/2022-2023/pizarro-abschiedsspiel-kader-230922/
  // https://www.werder.de/news/maenner/2024-2025/spielbericht-legenden-21062025
  "Werder Bremen": ["Claudio Pizarro","Aílton","Johan Micoud","Marco Bode","Dieter Eilts","Torsten Frings","Naldo","Per Mertesacker","Dieter Burdenski"],
  // https://www.fsv05.de/datrek/rekges.html
  "Mainz 05": ["Nikolče Noveski","Stephan Kuhnert","Niko Bungert","Elkin Soto"],
  // https://www.augsburger-allgemeine.de/sport/fc-augsburg/dieser-spieler-absolvierte-die-meisten-spiele-fuer-den-fc-augsburg-110165842
  "Augsburg": ["Helmut Haller","Daniel Baier"],
  // https://fc.de/club/ueber-den-fc/historie-und-erfolge/clubgeschichte
  "FC Köln": ["Hans Schäfer","Wolfgang Overath","Wolfgang Weber","Heinz Flohe","Hannes Löhr","Dieter Müller","Pierre Littbarski","Toni Schumacher","Lukas Podolski","Jonas Hector"],
  // https://www.bundesliga.com/en/bundesliga/news/hamburger-sv-bundesliga-club-by-club-historical-guide-keegan-seeler-24135
  // https://www.hsv.de/unser-hsv/historie/hsv-rekordspieler
  "Hamburger SV": ["Uwe Seeler","Manfred Kaltz","Horst Hrubesch","Felix Magath","Rudi Kargus","Peter Nogly","Jimmy Hartwig","Horst Schnoor"],
  // https://sv07elversberg.de/sve-verabschiedet-sich-zum-saisonende-von-acht-spielern/
  // https://sv07elversberg.de/u21-startet-in-die-neue-saarlandliga-saison-samstag-gegen-den-fc-rastpfuhl/
  "Elversberg": ["Kevin Koffi","Lukas Kohler"],
  // Alemanha — segunda divisão do cadastro; seleção editorial parcial, sem ranking. Consulta: 2026-11-24.
  // https://www.aktehertha.com/en/key-figures/
  "Hertha Berlim": ["Michael Preetz","Erich Beer"],
  // https://www.f95.de/aktuell/news/u23/109/3523-ralf-beckers-gab-fortunas-wall-of-fame-in-auftrag/
  // https://www.f95.de/news/33576-gemeinsamer-heimspielbesuch-gegen-preu-en-munster
  // https://www.f95.de/news/34427
  "Fortuna Düsseldorf": ["Klaus Allofs","Thomas Allofs","Toni Turek","Gerd Zewe","Andreas Lambertz","Egon Köhnen","Dieter Brei","Wilfried Woyke","Benno Beiroth"],
  // https://fck.de/blog/in-gedenken-an-die-legendaeren-walter-brueder/
  "Kaiserslautern": ["Fritz Walter","Ottmar Walter"],
  // https://www.fcn.de/news/artikel/legenden-die-besten-club-spieler-aller-zeiten/
  // https://www.fcn.de/news/artikel/neue-bloecke-im-easycredit-stadion/
  // https://www.fcn.de/news/artikel/24-legenden-in-einem-buch/
  // https://www.fcn.de/news/artikel/die-legende-lebt-3/
  "Nürnberg": ["Max Morlock","Heiner Stuhlfauth","Andreas Köpke","Hans Sutor","Heinz Strehl","Marek Mintal","Raphael Schäfer","Andreas Wolf","Dieter Eckstein"],
  // https://www.sv98.de/was-macht-eigentlich/
  // https://www.transfermarkt.de/sv-darmstadt-98/rekordspieler/verein/105
  "Darmstadt 98": ["Aytaç Sulu","Peter Cestonaro"],
  // https://www.ksc.de/profis/saison/news/show/article/waehlt-bis-donnerstag-eure-ksc-legenden/
  "Karlsruher SC": ["Oliver Kahn","Artur Beier","Michael Harforth","Edgar Schmitt"],
  // https://www.hannover96.de/newscenter/news/details/28876-ihr-habt-gewaehlt-das-ist-unsere-125-jahre-mannschaft.html
  // https://www.hannover96.de/newscenter/news/details/32795-ron-robert-zieler-hans-siemensmeyer-und-die-329-das-grosse-doppel-interview-zum-rekordspiel.html
  "Hannover 96": ["Robert Enke","Hans Siemensmeyer","Ron-Robert Zieler"],
  // https://1.fc-magdeburg.de/news/verein/fcm-legende-feiert-geburtstag
  // https://1.fc-magdeburg.de/news/verein/fcm-trauert-um-joachim-streich
  "Magdeburg": ["Joachim Streich","Jürgen Sparwasser"],
  // https://www.kleeblatt-chronik.de/v3/chronik/legenden.php
  // https://www.kleeblatt-chronik.de/v3/chronik/rekordspieler.php
  "Greuther Fürth": ["Max Appis","Karl Schmidt","Karl Mai","Hans Nöth","Karl Höger"],
  // https://www.eintracht.com/eintracht/chronik/uebersicht
  // https://www.eintracht.com/eintracht/chronik/geschichte-von-frueher
  // https://www.eintracht.com/news/artikel/ruhe-in-frieden-peter-kaack
  "Eintracht Braunschweig": ["Lothar Ulsaß","Horst Wolter","Jürgen Moll","Joachim Bäse","Klaus Gerwien","Walter Schmidt","Danilo Popivoda","Peter Kaack"],
  // https://scpreussen-muenster.de/news/preussen-legende-fiffi-gerritzen-in-die-westfaelische-ehrengalerie-aufgenommen/
  // https://scpreussen-muenster.de/news/289-spiele-mehmet-kara-neuer-rekordspieler-des-sc-preussen/
  "Preußen Münster": ["Felix Gerritzen","Mehmet Kara","Karl Heinz Krekeler"],
  // https://www.ssvulm1846-fussball.de/verein/trauer-um-walter-kubanczyk/
  "SSV Ulm": ["Walter Kubanczyk"],
  // https://www.vfl-wolfsburg.de/newsdetails/news-detail/detail/news/edeltechniker-und-halbes-duo
  // https://www.vfl-wolfsburg.de/newsdetails/news-detail/detail/news/treff-der-legenden
  // https://www.bild.de/sport/fussball/bundesliga-erkennen-sie-diese-legende-er-war-lange-nicht-zu-sehen-68c5755d2c41ed57328f8458
  "Wolfsburg": ["Grafite","Edin Džeko","Naldo","Andrea Barzagli","Josué","Diego Benaglio","Roy Präger"],
  // https://www.fc-heidenheim.de/fch-traditionsmannschaft
  // https://www.fc-heidenheim.de/news/detail/die-fch-traditionsmannschaft-holt-den-ersten-sieg?cHash=de9d9dfff95d1c1e1cedcdabfc5c4d7e
  "Heidenheim": ["Marc Schnatterer","Robert Strauß","Tim Göhlert","Ingo Feistle","Alper Bagceci","Bastian Heidecker"],
  // https://www.tuttostpauli.com/associazionismo/due-ita-traditionsmannschaft-fc-st-pauli-die-seele-des-vereins-la-squadra-delle-leggende-1554
  // https://www.ndr.de/sport/fussball/FC-St-Pauli-Club-Legende-Trulsen-muss-gehen%2Ctrulsen106.html
  // https://www.sportbuzzer.de/fussball/zweite-bundesliga/25-ehemalige-spieler-des-fc-st-pauli-und-was-aus-ihnen-wurde-53E366B3652BB4C72BD25E244A.html
  "St. Pauli": ["André Trulsen","Klaus Thomforde","Dirk Dammann","Werner Pokropp","Walter Frosch","Ivan Klasnić","Holger Stanislawski"],
  // França — primeira divisão do cadastro; seleção editorial parcial de ídolos e destaques históricos, sem ranking. Consulta: 2026-11-24.
  // https://www.fclorient.bzh/lhistoire-du-club/
  // https://www.fclorient.bzh/jeremy-morel-dans-le-coeur-des-supporters-lorientais/
  // https://www.lequipe.fr/Football/Actualites/Gameiro-keita-darcheville-koscielny-notre-onze-de-l-histoire-du-fc-lorient-pour-ses-cent-ans/1664636
  "Lorient": ["Fabien Audard","Jérémy Morel","Vincent Le Goff","Jean-Claude Darcheville","Ulrich Le Pen","Bakari Koné","Kevin Gameiro","Laurent Koscielny"],
  // https://www.estac.fr/paroles-danciens-avec-benjamin-nivet/
  "Troyes": ["Benjamin Nivet"],
  // https://www.toulousefc.com/equipes/equipe-professionnelle
  // https://www.toulousefc.com/play/blog/2024/05/daniel-congre-met-un-terme-a-sa-carriere
  "Toulouse": ["Alberto Márcico","Christophe Revault","Daniel Congré"],
  // https://en.wikipedia.org/wiki/RC_Strasbourg_Alsace
  // https://fr.wikipedia.org/wiki/Liste_des_joueurs_du_Racing_Club_de_Strasbourg
  "Strasbourg": ["Jacky Duguépéroux","Roger Jouve","Ivan Hašek","Aleksandr Mostovoi","José Luis Chilavert","Alexander Vencel"],
  // https://www.staderennais.com/actualites/125-ans/votre-onze-de-legende
  // https://www.staderennais.com/actualites/cest-pour-eux-un-club-a-part
  // https://histoire.staderennais.com/
  "Rennes": ["Petr Čech","Romain Danzé","Kader Mangane","Benjamin André","Benjamin Bourigeaud","Sylvain Wiltord","Olivier Monterrubio","Alexander Frei"],
  // https://www.rclens.fr/fr/news/match-des-heros-rclens-unicef-bollaert-delelis-20230422
  "Lens": ["Éric Sikora","Guillaume Warmuz","Tony Vairelles","Frédéric Déhu","Vladimír Šmicer","Jean-Guy Wallemme","Daniel Moreira","Vitorino Hilton"],
  // https://www.ogcnice.org/grandsjoueurs
  "Nice": ["Joaquín Valle","Jean Luciano","Antoine Bonifaci","Pancho González","Joseph Ujlaki","Vic Nurenberg","Georges Lamia","Charly Loubet"],
  // https://www.losc.fr/joueurs-les-plus-capes-de-lhistoire-du-losc
  // https://lepetitlillois.com/encyclopedie-losc-tout-savoir/
  "Lille": ["Marceau Somerlinck","Rio Mavuba","André Strappe","Jean Baratte","Florent Balmont","Franck Béria","Mathieu Debuchy","Grégory Tafforeau","Jonathan David"],
  // https://www.lyonfoot.com/article/14818/qui-sont-les-legendes-de-l-ol-l-after-foot-tranche-et-laisse-du-beau-monde-dehors
  // https://gone-stats.fr/onze-de-legende/
  "Lyon": ["Juninho Pernambucano","Fleury Di Nallo","Bernard Lacombe","Serge Chiesa","Grégory Coupet","Sidney Govou","Sonny Anderson","Karim Benzema","Alexandre Lacazette","Cris"],
  // https://billetterie.om.fr/fr/histoire
  "Marseille": ["Jean-Pierre Papin","Éric Di Meco","Franck Sauzée","Jean Boyer","Édouard Crut"],
  // https://www.asmonaco.com/fr/news/onnis-cossou-falcao-quels-sont-les-meilleurs-buteurs-de-l-histoire-de-l-as-monaco
  // https://www.asmonaco.com/fr/club/histoire/ettori-petit-amoros-quels-sont-les-joueurs-les-plus-capes-de-l-histoire-de-l-as-monaco
  // https://www.asmonaco.com/fr/news/deux-legendes-de-las-monaco-au-coup-denvoi
  // https://www.asmonaco.com/fr/news/rafael-marquez-une-legende-mexicaine-sur-le-rocher
  // https://www.asmonaco.com/fr/joueurs/michel-hidalgo
  // https://www.asmonaco.com/fr/news/willy-sagnol-la-legende-munichoise-revelee-en-principaute
  "Monaco": ["Delio Onnis","Jean-Luc Ettori","Manuel Amoros","Radamel Falcao","Rui Barros","John Collins","Rafael Márquez","Michel Hidalgo","Marcelo Gallardo"],
  // https://www.aja.fr/histoire/
  // https://www.aja.fr/bruno-martini-est-decede/
  // https://www.aja.fr/djibril-cisse-annonce-son-jubile-le-27-mai-2025-a-auxerre/
  "Auxerre": ["Djibril Cissé","Bruno Martini","Andrzej Szarmach","Christophe Cocard","Cédric Hengbart"],
  // https://angers-sco.fr/club/histoire/
  "Angers": ["Raymond Kopa","Jonathan Kodjia"],
  // https://ligue1.com/en/articles/l1_article_2966-
  "Le Havre": ["Jean-Michel Lesage"],
  // https://www.lequipe.fr/Football/Article/Quels-joueurs-du-brest-2024-dans-l-equipe-type-de-l-histoire-du-stade-brestois/1469048
  // https://footballski.fr/drago-vabec-le-mythe-du-stade-brestois
  "Brest": ["Drago Vabec","Yvon Le Roux","David Ginola","Pierre Lees-Melou","Roberto Cabañas","Paul Le Guen"],
  // https://parisfc.fr/equipe-pro/julien-lopez-parisien-jusquen-2026/
  "Paris FC": ["Vincent Demarconnay","Lamri Laachi","Julien Lopez"],
  // https://www.lemansfc.fr/index.php?actu=3560&section=actualites-contenu
  // https://lemansfc.fr/index.php?actu=3004&section=actualites-contenu
  "Le Mans": ["Grégory Cerdan","Laurent Bonnart","Frédéric Thomas","Grafite","Gervinho","Romaric","Daisuke Matsui","Yohann Pelé"],
  // França — segunda divisão do cadastro; seleção editorial parcial, sem ordem de mérito. Consulta: 2026-11-24.
  // https://www.asse.fr/fr/actualites/toute-la-noblesse-d-une-vieille-dame-de-legende-ac34645
  "Saint-Étienne": ["Robert Herbin","Hervé Revelli","Salif Keita","Rachid Mekhloufi","Ivan Ćurković","Dominique Rocheteau","Michel Platini","Jean-Michel Larqué","Loïc Perrin","Ľubomír Moravčík"],
  // https://girondins.com/fr/club/legends
  // https://www.girondins.com/fr/news/34421/un-joyeux-anniversaire-a-jean-tigana
  // https://www.girondins.com/fr/news/22795/julien-bee-et-laurent-brun-parlent-de-lescure-et-les-girondins
  // https://www.girondins.com/fr/news/32912/decouvrez-le-programme-des-matches-des-140-ans
  "Bordeaux": ["Alain Giresse","Jean Tigana","Dominique Dropsy","Zinedine Zidane","Pedro Pauleta","Cédric Carrasso","Marouane Chamakh"],
  // https://www.fcmetz.com/historique/histoire-du-club
  // https://www.estrepublicain.fr/sport/2022/04/01/elisez-votre-onze-de-legende-du-fc-metz-de-1932-a-nos-jours
  "Metz": ["Sylvain Kastendeuch","Robert Pirès","Philippe Hinschberger","Michel Ettorre","Philippe Gaillot","Jules Bocandé","Nico Braun","Bernard Zénier","Frédéric Meyrieu"],
  // https://www.smcaen.fr/node/274
  // https://www.ouest-france.fr/sport/football/sm-caen/
  // https://www.smcaen.fr/2019-2020/actualites/retrospective/il-etait-une-fois-luc-borrelli
  "Caen": ["Luc Borrelli","Nicolas Seube","Franck Dumas","Fabrice Divert","Xavier Gravelaine","Anthony Deroin","Yvan Lebourgeois","Stéphane Paille","N'Golo Kanté"],
  // https://www.eaguingamp.com/le-club/
  // https://cdt22.media.tourinsoft.eu/upload/guide-du-patrimoine-guingamp-2017-4.pdf
  // https://www.guingamp.fr/
  "Guingamp": ["Didier Drogba","Florent Malouda","Stéphane Guivarc'h","Coco Michel","Stéphane Carnot","Andrzej Szarmach","Vincent Candela"],
  // https://ac-ajaccio.corsica/club/storia/i-ghjucadori
  "Ajaccio": ["Albert Vannucci","Jean-Jean Marcialis","Dominique Baratelli","José Cau","Michel Albaladejo","David Terrier","Stéphane Trévisan","Alain Mistre"],
  // https://www.clermontfoot.com/match-des-legendes-tous-les-joueurs-presents
  // https://www.clermontfoot.com/johan-gastien-lame-du-club-tire-sa-reverence
  // https://www.clermontfoot.com/yohann-magnin-quitte-le-club-apres-16-annees-en-rouge-bleu
  "Clermont Foot": ["Eugène Ekobo","Cédric Bockhorni","Rémy Dugimont","Johan Gastien","Yohann Magnin","Jonathan Iglesias","Mohamed Bayo"],
  // https://sc-bastia.corsica/pages/histoire-du-club
  // https://www.football-the-story.com/blog/sc-bastia
  "Bastia": ["Claude Papi","Dragan Džajić","Charles Orlanducci","Johnny Rep","Jacques Zimako","François Félix","Roger Milla"],
  // https://rodezaveyronfootball.com/2022/08/ligue-2-bkt-apres-15-ans-au-raf-pierre-bardy-sen-va/
  "Rodez": ["Pierre Bardy","Freddy Castanier"],
  // https://www.football-the-story.com/blog/stade-lavallois
  // https://www.unfp.org/2023/12/disparition-de-michel-le-milinaire/
  // https://fr.wikipedia.org/wiki/Stade_lavallois_Mayenne_Football_Club
  "Laval": ["Raymond Keruzoré","Patrick Delamontagne","François Omam-Biyik","Michel Le Milinaire","Jacques Ferrette","Maurice Gaumer"],
  // https://www.paureinedessports.com/foot-pau-fc
  // https://fr.wikipedia.org/wiki/Pau_Football_Club
  "Pau FC": ["Paul Escudé","Joël Lopez"],
  // https://www.football-the-story.com/amiens-sc
  "Amiens": ["Paul Imiéla","Jean-Paul Abalo","Régis Gurtner","Georges Taisne","Urbain Wallet"],
  // https://www.usldunkerque.com/lusl-dunkerque-et-jocelyn-blanchard-ont-dun-commun-accord-mis-fin-a-leur-collaboration/
  // https://www.usldunkerque.com/dimitri-boudaud-prolonge-avec-lusld/
  // https://www.usldunkerque.com/embleme-du-football-dunkerquois-alex-dupont-nest-plus/
  // https://www.usldunkerque.com/alain-fairise-une-legende-dunkerquoise-nous-quitte/
  // https://www.usldunkerque.com/demba-thiam-nest-plus-maritime/
  // https://quatretroistrois.fr/dunkerque-les-10-meilleurs-joueurs-de-lhistoire-du-club/
  "Dunkerque": ["Jocelyn Blanchard","Dimitri Boudaud","Alex Dupont","Alain Fairise","Demba Thiam","Jean-Claude Garnier"],
  // https://fcmartigues.com/histoire-du-club/
  "Martigues": ["Henri Canet","Patrick Dho","Ali Benarbia","Patrick Blondeau","Éric Cantona"],
  // https://www.redstar.fr/les-grands-noms/
  "Red Star": ["Lucien Gamblin","Marcel Dantheny","Marcel Domergue","Marcel Langiller","Maurice Meyer","Nestor Combin","Paul Nicolas","Philippe Bonnardel"],
  // https://www.stade-de-reims.com/entrez-dans-la-legende/
  // https://www.lemonde.fr/sport/article/2025/05/24/au-stade-de-reims-un-heritage-lourd-a-porter-qui-refait-timidement-surface-a-l-occasion-de-la-finale-de-la-coupe-de-france-contre-le-psg_6608218_3242.html
  "Reims": ["Raymond Kopa","Just Fontaine","Roger Piantoni","Robert Jonquet","Armand Penverne"],
  // https://www.fcnantes.com/articles/article2809.php?num=10252
  // https://www.lequipe.fr/Football/Actualites/Nantes-honore-ses-legendes-avant-le-match-face-a-l-om/1518065
  "Nantes": ["Maxime Bossis","Henri Michel","Mickaël Landreau","Didier Deschamps","Marcel Desailly","Christian Karembeu","Vahid Halilhodžić","Japhet N'Doram","Patrice Loko","Loïc Amisse","Jean-Paul Bertrand-Demanes","Reynald Pedros"],
  // Portugal — primeira divisão do cadastro; seleção editorial parcial de ídolos e destaques, sem ranking. Consulta: 2026-11-24.
  // Estrela e Académico: nesta etapa, referências das entidades pós-refundação.
  // https://www.abola.pt/noticias/vem-ai-o-fc-porto-mas-o-misticismo-do-fontelo-pode-dar-noite-a-antiga-2026082821144651220
  // https://academicodeviseu.pt/noticia.php?n=46
  "Académico Viseu": ["Fernando Ferreira"],
  // https://estrelamadora.pt/miguel-lopes-encerra-a-sua-historia-no-estrela-da-amadora/
  "Estrela da Amadora": ["Miguel Lopes"],
  // https://www.fcfamalicao.pt/noticias/empate-com-rio-ave-na-apresentacao-2018-2019/
  "Famalicão": ["Vitor Lima"],
  // https://www.record.pt/multimedia/fotogalerias/detalhe/o-onze-centenario-do-v-guimaraes-raphinha-e-rui-vitoria-numa-lista-com-o-historico-neno
  "Vitória de Guimarães": ["Neno","Ricardo Pereira","Geromel","Edmond Tapsoba","Dimas","Pedro Mendes","N'Dinga","Pedro Barbosa","Vítor Paneira","Raphinha","Paulinho Cascavel"],
  // https://www.transfermarkt.com.br/sc-braga/rekordspieler/verein/1075
  "Braga": ["Alan","Barroso","Vandinho"],
  // https://casapiaac.pt/palmares
  "Casa Pia": ["Cândido de Oliveira","José Maria Gralha","António Pinho","António Lopes"],
  // https://rioavefc.pt/noticias/futebol/tarantini-a-beira-dos-300/
  "Rio Ave": ["Tarantini","Niquinha","Gama"],
  // https://www.zerozero.pt/noticias/recordista-fabio-pacheco-e-o-novo-lider-em-presencas-na-liga-pelo-moreirense/347499
  // https://moreirensefc.pt/maracas-chega-aos-100-jogos-pelo-moreirense/
  "Moreirense": ["Fábio Pacheco","Jorge Duarte","Maracás"],
  // https://www.abola.pt/noticias/ruben-fernandes-alcanca-300-jogos-na-liga-e-aproxima-se-de-marca-historica-pelo-gil-vicente-2024100715512099524
  // https://www.record.pt/futebol/futebol-nacional/liga-betclic/gil-vicente/detalhe/carlitos-inesquecivel
  "Gil Vicente": ["Paulo Jorge","Casquilha","Tuck","José Lemos","Rúben Fernandes","Carlitos"],
  // https://www.zerozero.pt/noticias/se-o-capitao-esgaio-marca-o-arouca-e-feliz/1098834
  // https://www.rtp.pt/noticias/futebol-nacional/david-simao-anuncia-saida-do-arouca_d1711452
  "Arouca": ["David Simão","Nuno Coelho","André Bukia","Tiago Esgaio"],
  // https://cdsantaclara.com/oficial-marco-pereira/
  // https://cdsantaclara.com/anderson-carvalho-completa-100-jogos-pelo-santa-clara/
  "Santa Clara": ["Figueiredo","Marco Pereira","Anderson Carvalho","Lincoln"],
  // https://www.cdnacional.pt/cd-nacional-de-luto-por-maurilio-freitas/
  // https://www.cdnacional.pt/obrigado-capitao-joao-aurelio/
  // https://www.cdnacional.pt/o-adeus-de-ruben-micael/
  "Nacional": ["Maurílio Freitas","João Aurélio","Rúben Micael"],
  // https://www.cascais.pt/pessoa/marco-silva
  // https://www.record.pt/futebol/futebol-nacional/liga-betclic/estoril/detalhe/estoril-despede-se-do-capitao-joaozinho
  // https://www.estorilpraia.pt/blog/capitao-joao-carvalho-atinge-marca-dos-100-jogos-pelo-estoril-praia
  "Estoril": ["Marco Silva","Joãozinho","João Carvalho"],
  // https://www.record.pt/futebol/futebol-nacional/liga-betclic/maritimo/detalhe/maritimo-comercializa-video-com-historial
  // https://www.record.pt/futebol/futebol-nacional/liga-betclic/maritimo/amp/alma-e-mistica-madeirenses-personificadas-no-maritimo
  // https://en.wikipedia.org/wiki/C.S._Mar%C3%ADtimo_statistics_and_records
  "Marítimo": ["Carlos Jorge","Arnaldo Carvalho","Eduardo Luís","Ewerton","João Luís","Briguel","Luís Olim","Eusébio Sousa"],
  // https://fairplay.pt/futebol/futebolnacional/fc-alverca-elenco-sonho-19992000/
  // https://www.record.pt/futebol/futebol-nacional/liga-betclic/benfica/detalhe/alverca-de-olhos-colocados-no-benfica-e-sporting
  "Alverca": ["Cajú","Nélson Veríssimo","Abel Silva","Nélson Morais"],
  // Seleções
  'Brasil': ['Pelé', 'Garrincha', 'Ronaldo', 'Romário'],
  'Argentina': ['Diego Maradona', 'Lionel Messi', 'Mario Kempes', 'Gabriel Batistuta'],
  'Uruguai': ['Obdulio Varela', 'Enzo Francescoli', 'Luis Suárez'],
  'França': ['Zinedine Zidane', 'Michel Platini', 'Thierry Henry', 'Kylian Mbappé'],
  'Alemanha': ['Franz Beckenbauer', 'Gerd Müller', 'Miroslav Klose', 'Lothar Matthäus'],
  'Itália': ['Paolo Maldini', 'Roberto Baggio', 'Gianluigi Buffon', 'Paolo Rossi'],
  'Espanha': ['Iker Casillas', 'Xavi', 'Andrés Iniesta', 'David Villa'],
  'Inglaterra': ['Bobby Moore', 'Bobby Charlton', 'Harry Kane', 'Gary Lineker'],
  'Holanda': ['Johan Cruyff', 'Marco van Basten', 'Ruud Gullit'],
  'Portugal': ['Cristiano Ronaldo', 'Eusébio', 'Luís Figo'],
};
// Nomes alternativos existentes no cadastro das divisões alemãs: uma única galeria por identidade.
const ALIASES_LENDAS = Object.freeze({ 'Hamburgo': 'Hamburger SV', 'Köln': 'FC Köln' });
export const lendasDe = nome => LENDAS_HISTORICAS[Object.hasOwn(ALIASES_LENDAS, nome) ? ALIASES_LENDAS[nome] : nome] || [];
