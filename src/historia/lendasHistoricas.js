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
export const lendasDe = nome => LENDAS_HISTORICAS[nome] || [];
