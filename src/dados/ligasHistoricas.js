/**
 * Campeões reais de ligas presentes no A JOIA (corte documental: 19/11/2026).
 * Sem preenchimento fictício: intervalos não documentados não são computados.
 * Na Europa, o ano refere-se ao encerramento (2026 = 2025/26).
 * Não misturar acervo da vida real com títulos surgidos na simulação.
 * Fontes e recortes ficam disponíveis para auditoria em cada competição.
 */
const DEFINICOES = {
  "Brasileirão": {
    "fonte": "https://www.rsssf.org/tablesb/brazchamp.html",
    "edicao": "ano",
    "cobertura": "recorte",
    "observacao": "Edições da competição organizada nacionalmente de 1971 a 2025. A unificação oficial de torneios anteriores requer tratamento separado.",
    "dados": "2025=Flamengo;2024=Botafogo;2023=Palmeiras;2022=Palmeiras;2021=Atlético-MG;2020=Flamengo;2019=Flamengo;2018=Palmeiras;2017=Corinthians;2016=Palmeiras;2015=Corinthians;2014=Cruzeiro;2013=Cruzeiro;2012=Fluminense;2011=Corinthians;2010=Fluminense;2009=Flamengo;2008=São Paulo;2007=São Paulo;2006=São Paulo;2005=Corinthians;2004=Santos;2003=Cruzeiro;2002=Santos;2001=Athletico-PR;2000=Vasco da Gama;1999=Corinthians;1998=Corinthians;1997=Vasco da Gama;1996=Grêmio;1995=Botafogo;1994=Palmeiras;1993=Palmeiras;1992=Flamengo;1991=São Paulo;1990=Corinthians;1989=Vasco da Gama;1988=Bahia;1987=Sport Recife;1986=São Paulo;1985=Coritiba;1984=Fluminense;1983=Flamengo;1982=Flamengo;1981=Grêmio;1980=Flamengo;1979=Internacional;1978=Guarani;1977=São Paulo;1976=Internacional;1975=Internacional;1974=Vasco da Gama;1973=Palmeiras;1972=Palmeiras;1971=Atlético-MG"
  },
  "Brasileirão Série B": {
    "fonte": "https://www.rsssfbrasil.com/historical.htm",
    "edicao": "ano",
    "cobertura": "recorte",
    "observacao": "Anos em que houve edição/campeão; períodos sem disputa ficam sem vencedor.",
    "dados": "2026=Novorizontino;2025=Coritiba;2024=Santos;2023=Vitória;2022=Cruzeiro;2021=Botafogo;2020=Chapecoense;2019=Bragantino;2018=Fortaleza;2017=América-MG;2016=Atlético-GO;2015=Botafogo;2014=Joinville;2013=Palmeiras;2012=Goiás;2011=Portuguesa;2010=Coritiba;2009=Vasco da Gama;2008=Corinthians;2007=Coritiba;2006=Atlético-MG;2005=Grêmio;2004=Brasiliense;2003=Palmeiras;2002=Criciúma;2001=Paysandu;2000=Paraná Clube;1999=Goiás;1998=Gama;1997=América-MG;1996=União São João;1995=Athletico-PR;1994=Juventude;1992=Paraná Clube;1991=Paysandu;1990=Sport Recife;1989=Bragantino;1988=Inter de Limeira;1985=Tuna Luso;1984=Uberlândia;1983=Juventus-SP;1982=Campo Grande-RJ;1981=Guarani;1980=Londrina;1972=Sampaio Corrêa;1971=Villa Nova-MG"
  },
  "Brasileirão Série C": {
    "fonte": "https://ge.globo.com/pr/futebol/brasileirao-serie-c/noticia/2026/10/24/maringa-conquista-o-titulo-da-serie-c-pela-primeira-vez-veja-todos-os-campeoes.ghtml",
    "edicao": "ano",
    "cobertura": "recorte",
    "dados": "2026=Maringá;2025=Ponte Preta;2024=Volta Redonda;2023=Amazonas;2022=Mirassol;2021=Ituano;2020=Vila Nova;2019=Náutico;2018=Operário-PR;2017=CSA;2016=Boa Esporte;2015=Vila Nova"
  },
  "Brasileirão Série D": {
    "fonte": "https://ge.globo.com/mg/triangulo-mineiro/futebol/brasileirao-serie-d/noticia/2026/09/13/minas-gerais-iguala-ceara-e-se-torna-estado-com-mais-titulos-da-serie-d-veja-todos-os-campeoes.ghtml",
    "edicao": "ano",
    "cobertura": "recorte",
    "dados": "2026=Uberlândia;2025=Barra-SC;2024=Retrô;2023=Ferroviário;2022=América-RN;2021=Aparecidense;2020=Mirassol;2019=Brusque;2018=Ferroviário;2017=Operário-PR;2016=Volta Redonda;2015=Botafogo-SP;2014=Tombense;2013=Botafogo-PB;2012=Sampaio Corrêa;2011=Tupi;2010=Guarany de Sobral;2009=São Raimundo-PA"
  },
  "Premier League": {
    "fonte": "https://www.premierleague.com/en/premier-league-explained",
    "edicao": "temporada",
    "cobertura": "completa",
    "dados": "2026=Arsenal;2025=Liverpool;2024=Manchester City;2023=Manchester City;2022=Manchester City;2021=Manchester City;2020=Liverpool;2019=Manchester City;2018=Manchester City;2017=Chelsea;2016=Leicester City;2015=Chelsea;2014=Manchester City;2013=Manchester United;2012=Manchester City;2011=Manchester United;2010=Chelsea;2009=Manchester United;2008=Manchester United;2007=Manchester United;2006=Chelsea;2005=Chelsea;2004=Arsenal;2003=Manchester United;2002=Arsenal;2001=Manchester United;2000=Manchester United;1999=Manchester United;1998=Arsenal;1997=Manchester United;1996=Manchester United;1995=Blackburn Rovers;1994=Manchester United;1993=Manchester United"
  },
  "Championship": {
    "fonte": "https://news.bet365.com/en-gb/article/efl-championship-list-of-winners/2024081916161780357",
    "edicao": "temporada",
    "cobertura": "completa",
    "observacao": "Considera a era denominada EFL Championship (a partir de 2004/05), sem misturar divisões anteriores.",
    "dados": "2026=Coventry City;2025=Leeds United;2024=Leicester City;2023=Burnley;2022=Fulham;2021=Norwich City;2020=Leeds United;2019=Norwich City;2018=Wolverhampton;2017=Newcastle;2016=Burnley;2015=Bournemouth;2014=Leicester City;2013=Cardiff City;2012=Reading;2011=QPR;2010=Newcastle;2009=Wolverhampton;2008=West Bromwich;2007=Sunderland;2006=Reading;2005=Sunderland"
  },
  "La Liga": {
    "fonte": "https://www.sport-histoire.fr/en/Sport/Football/Honours/La_Liga.php",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Barcelona;2025=Barcelona;2024=Real Madrid;2023=Barcelona;2022=Real Madrid;2021=Atlético de Madrid;2020=Real Madrid;2019=Barcelona;2018=Barcelona;2017=Real Madrid;2016=Barcelona;2015=Barcelona;2014=Atlético de Madrid;2013=Barcelona;2012=Real Madrid;2011=Barcelona;2010=Barcelona;2009=Barcelona;2008=Real Madrid;2007=Real Madrid;2006=Barcelona;2005=Barcelona;2004=Valencia;2003=Real Madrid;2002=Valencia;2001=Real Madrid;2000=Deportivo La Coruña"
  },
  "LaLiga 2": {
    "fonte": "https://www.rsssf.org/tabless/span2champ.html",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Racing Santander;2025=Levante;2024=Leganés;2023=Granada;2022=Almería;2021=Espanyol;2020=Huesca;2019=Osasuna;2018=Rayo Vallecano;2017=Levante;2016=Alavés;2015=Real Betis;2014=Eibar;2013=Elche;2012=Deportivo La Coruña;2011=Real Betis;2010=Real Sociedad;2009=Xerez;2008=Numancia;2007=Valladolid;2006=Recreativo de Huelva;2005=Cádiz;2004=Levante;2003=Real Murcia;2002=Atlético de Madrid;2001=Sevilla"
  },
  "Serie A": {
    "fonte": "https://www.reuters.com/sports/soccer/list-serie-champions-2026-05-03/",
    "edicao": "temporada",
    "cobertura": "recorte",
    "observacao": "2005 não recebeu campeão oficial após a anulação do título; não é preenchido artificialmente.",
    "dados": "2026=Inter de Milão;2025=Napoli;2024=Inter de Milão;2023=Napoli;2022=Milan;2021=Inter de Milão;2020=Juventus;2019=Juventus;2018=Juventus;2017=Juventus;2016=Juventus;2015=Juventus;2014=Juventus;2013=Juventus;2012=Juventus;2011=Milan;2010=Inter de Milão;2009=Inter de Milão;2008=Inter de Milão;2007=Inter de Milão;2006=Inter de Milão;2004=Milan;2003=Juventus;2002=Juventus;2001=Roma;2000=Lazio"
  },
  "Serie B (Itália)": {
    "fonte": "https://www.rsssf.org/tablesi/ital2champ.html",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Venezia;2025=Sassuolo;2024=Parma;2023=Frosinone;2022=Lecce;2021=Empoli;2020=Benevento;2019=Brescia;2018=Empoli;2017=SPAL;2016=Cagliari;2015=Carpi;2014=Palermo;2013=Sassuolo;2012=Pescara;2011=Atalanta;2010=Lecce;2009=Bari;2008=Chievo;2007=Juventus;2006=Atalanta;2005=Empoli;2004=Palermo;2003=Siena;2002=Como;2001=Torino"
  },
  "Bundesliga": {
    "fonte": "https://www.sport-histoire.fr/en/Sport/Football/Honours/Bundesliga.php",
    "edicao": "temporada",
    "cobertura": "recorte",
    "observacao": "Acervo da era Bundesliga, sem confundir os campeonatos alemães anteriores a 1963/64.",
    "dados": "2026=Bayern de Munique;2025=Bayern de Munique;2024=Leverkusen;2023=Bayern de Munique;2022=Bayern de Munique;2021=Bayern de Munique;2020=Bayern de Munique;2019=Bayern de Munique;2018=Bayern de Munique;2017=Bayern de Munique;2016=Bayern de Munique;2015=Bayern de Munique;2014=Bayern de Munique;2013=Bayern de Munique;2012=Borussia Dortmund;2011=Borussia Dortmund;2010=Bayern de Munique;2009=Wolfsburg;2008=Bayern de Munique;2007=Stuttgart;2006=Bayern de Munique;2005=Bayern de Munique;2004=Werder Bremen;2003=Bayern de Munique;2002=Borussia Dortmund;2001=Bayern de Munique;2000=Bayern de Munique"
  },
  "2. Bundesliga": {
    "fonte": "https://www.rsssf.org/tablesd/duit2champ.html",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Schalke 04;2025=FC Köln;2024=St. Pauli;2023=Heidenheim;2022=Schalke 04;2021=Bochum;2020=Arminia Bielefeld;2019=FC Köln;2018=Fortuna Düsseldorf;2017=Stuttgart;2016=Freiburg;2015=Ingolstadt;2014=FC Köln;2013=Hertha BSC;2012=Greuther Fürth;2011=Hertha BSC;2010=Kaiserslautern;2009=Freiburg;2008=Borussia Mönchengladbach;2007=Karlsruhe;2006=Bochum;2005=FC Köln;2004=Nürnberg;2003=Freiburg;2002=Hannover 96;2001=Nürnberg"
  },
  "Ligue 1": {
    "fonte": "https://www.sport-histoire.fr/en/Sport/Football/Honours/Ligue_1.php",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=PSG;2025=PSG;2024=PSG;2023=PSG;2022=PSG;2021=Lille;2020=PSG;2019=PSG;2018=PSG;2017=Monaco;2016=PSG;2015=PSG;2014=PSG;2013=PSG;2012=Montpellier;2011=Lille;2010=Marseille;2009=Bordeaux;2008=Lyon;2007=Lyon;2006=Lyon;2005=Lyon;2004=Lyon;2003=Lyon;2002=Lyon;2001=Nantes;2000=Monaco"
  },
  "Ligue 2": {
    "fonte": "https://www.fff.fr/476-palmares-ligue-2.html",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Troyes;2025=Lorient;2024=Auxerre;2023=Le Havre;2022=Toulouse;2021=Troyes;2020=Lorient;2019=Metz;2018=Reims;2017=Strasbourg;2016=Nancy;2015=Troyes;2014=Metz;2013=Monaco;2012=Bastia;2011=Evian;2010=Caen;2009=Lens;2008=Le Havre;2007=Metz;2006=Valenciennes;2005=Nancy;2004=Saint-Étienne;2003=Toulouse;2002=Ajaccio;2001=Sochaux;2000=Lille;1999=Saint-Étienne;1998=Nancy;1997=Châteauroux;1996=Caen;1995=Marseille;1994=Nice"
  },
  "Liga Portugal": {
    "fonte": "https://news.bet365.com/en-gb/article/primeira-liga-previous-winners-list/2024120511390479783",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Porto;2025=Sporting;2024=Sporting;2023=Benfica;2022=Porto;2021=Sporting;2020=Porto;2019=Benfica;2018=Porto;2017=Benfica;2016=Benfica;2015=Benfica;2014=Benfica;2013=Porto;2012=Porto;2011=Porto;2010=Benfica;2009=Porto;2008=Porto;2007=Porto;2006=Porto;2005=Benfica;2004=Porto;2003=Porto;2002=Sporting;2001=Boavista;2000=Sporting"
  },
  "Liga Portugal 2": {
    "fonte": "https://futebol.pt/recordes/segunda-liga-historia/",
    "edicao": "temporada",
    "cobertura": "completa",
    "observacao": "Início da Segunda Liga em 1990/91. A edição de 2019/20 não atribuiu título.",
    "dados": "2026=Marítimo;2025=Tondela;2024=Santa Clara;2023=Moreirense;2022=Rio Ave;2021=Estoril;2019=Paços de Ferreira;2018=Nacional;2017=Portimonense;2016=Porto B;2015=Tondela;2014=Moreirense;2013=Belenenses;2012=Estoril;2011=Gil Vicente;2010=Beira-Mar;2009=Olhanense;2008=Trofense;2007=Leixões;2006=Beira-Mar;2005=Paços de Ferreira;2004=Estoril;2003=Rio Ave;2002=Moreirense;2001=Santa Clara;2000=Paços de Ferreira;1999=Gil Vicente;1998=União de Leiria;1997=Campomaiorense;1996=Rio Ave;1995=Leça;1994=Tirsense;1993=Estrela da Amadora;1992=Espinho;1991=Paços de Ferreira"
  },
  "Eredivisie": {
    "fonte": "https://www.knvb.com/node/56",
    "edicao": "temporada",
    "cobertura": "completa",
    "observacao": "Não houve campeão em 2020 devido à pandemia. A era Eredivisie se inicia em 1956/57.",
    "dados": "2026=PSV;2025=PSV;2024=PSV;2023=Feyenoord;2022=Ajax;2021=Ajax;2019=Ajax;2018=PSV;2017=Feyenoord;2016=PSV;2015=PSV;2014=Ajax;2013=Ajax;2012=Ajax;2011=Ajax;2010=Twente;2009=AZ;2008=PSV;2007=PSV;2006=PSV;2005=PSV;2004=Ajax;2003=PSV;2002=Ajax;2001=PSV;2000=PSV;1999=Feyenoord;1998=Ajax;1997=PSV;1996=Ajax;1995=Ajax;1994=Ajax;1993=Feyenoord;1992=PSV;1991=PSV;1990=Ajax;1989=PSV;1988=PSV;1987=PSV;1986=PSV;1985=Ajax;1984=Feyenoord;1983=Ajax;1982=Ajax;1981=AZ;1980=Ajax;1979=Ajax;1978=PSV;1977=Ajax;1976=PSV;1975=PSV;1974=Feyenoord;1973=Ajax;1972=Ajax;1971=Feyenoord;1970=Ajax;1969=Feyenoord;1968=Ajax;1967=Ajax;1966=Ajax;1965=Feyenoord;1964=DWS;1963=PSV;1962=Feyenoord;1961=Feyenoord;1960=Ajax;1959=Sparta Rotterdam;1958=DOS;1957=Ajax"
  },
  "Süper Lig": {
    "fonte": "https://www.worldfootball.net/competition/co102/turkiye-super-lig/records-winners-list/",
    "edicao": "temporada",
    "cobertura": "recorte",
    "dados": "2026=Galatasaray;2025=Galatasaray;2024=Galatasaray;2023=Galatasaray;2022=Trabzonspor;2021=Beşiktaş;2020=Başakşehir;2019=Galatasaray;2018=Galatasaray;2017=Beşiktaş;2016=Beşiktaş;2015=Galatasaray;2014=Fenerbahçe;2013=Galatasaray;2012=Galatasaray;2011=Fenerbahçe;2010=Bursaspor;2009=Beşiktaş;2008=Galatasaray;2007=Fenerbahçe;2006=Galatasaray;2005=Fenerbahçe;2004=Fenerbahçe;2003=Beşiktaş;2002=Galatasaray;2001=Fenerbahçe;2000=Galatasaray"
  },
  "Liga Saudita": {
    "fonte": "https://www.sport-histoire.fr/en/Sport/Football/Honours/Saudi_Pro_League.php",
    "edicao": "temporada",
    "cobertura": "completa",
    "dados": "2026=Al-Nassr;2025=Al-Ittihad;2024=Al-Hilal;2023=Al-Ittihad;2022=Al-Hilal;2021=Al-Hilal;2020=Al-Hilal;2019=Al-Nassr;2018=Al-Hilal;2017=Al-Hilal;2016=Al-Ahli;2015=Al-Nassr;2014=Al-Nassr;2013=Al-Fateh;2012=Al-Shabab;2011=Al-Hilal;2010=Al-Hilal;2009=Al-Ittihad;2008=Al-Hilal;2007=Al-Ittihad;2006=Al-Shabab;2005=Al-Hilal;2004=Al-Shabab;2003=Al-Ittihad;2002=Al-Hilal;2001=Al-Ittihad;2000=Al-Ittihad;1999=Al-Ittihad;1998=Al-Hilal;1997=Al-Ittihad;1996=Al-Hilal;1995=Al-Nassr;1994=Al-Nassr;1993=Al-Shabab;1992=Al-Shabab;1991=Al-Shabab;1990=Al-Hilal;1989=Al-Nassr;1988=Al-Hilal;1987=Al-Ettifaq;1986=Al-Hilal;1985=Al-Hilal;1984=Al-Ahli;1983=Al-Ettifaq;1982=Al-Ittihad;1981=Al-Nassr;1980=Al-Nassr;1979=Al-Hilal;1978=Al-Ahli;1977=Al-Hilal"
  },
  "MLS": {
    "fonte": "https://www.transfermarkt.com/major-league-soccer/erfolge/pokalwettbewerb/MLS1",
    "edicao": "ano",
    "cobertura": "completa",
    "observacao": "Vencedor da MLS Cup, não do Supporters’ Shield. A edição 2026 está pendente.",
    "dados": "2025=Inter Miami;2024=LA Galaxy;2023=Columbus Crew;2022=LAFC;2021=New York City FC;2020=Columbus Crew;2019=Seattle Sounders;2018=Atlanta United;2017=Toronto FC;2016=Seattle Sounders;2015=Portland Timbers;2014=LA Galaxy;2013=Sporting Kansas City;2012=LA Galaxy;2011=LA Galaxy;2010=Colorado Rapids;2009=Real Salt Lake;2008=Columbus Crew;2007=Houston Dynamo;2006=Houston Dynamo;2005=LA Galaxy;2004=DC United;2003=San Jose Earthquakes;2002=LA Galaxy;2001=San Jose Earthquakes;2000=Kansas City Wizards;1999=DC United;1998=Chicago Fire;1997=DC United;1996=DC United"
  },
  "Liga Profesional": {
    "fonte": "https://www.afa.com.ar/es/posts/boca-se-corono-campeon-de-la-liga-2026",
    "edicao": "ano",
    "cobertura": "recorte",
    "observacao": "Em 2025 e 2026 a AFA reconheceu também o campeão da tabela anual (Rosario Central e Boca Juniors); Apertura e Clausura são troféus distintos, não computados aqui.",
    "dados": "2026=Boca Juniors;2025=Rosario Central;2024=Vélez Sarsfield;2023=River Plate;2022=Boca Juniors;2021=River Plate"
  }
};

function montar(nome,def) {
 const vistos=new Set();
 const registros=def.dados.split(';').map(linha=>{
  const separador=linha.indexOf('=');
  const ano=Number(linha.slice(0,separador));
  const clube=linha.slice(separador+1).trim();
  if(!Number.isInteger(ano)||ano<1850||ano>2026||!clube||vistos.has(ano))
   throw new Error('Registro inválido ou duplicado: '+nome+' / '+linha);
  vistos.add(ano);
  const edicao=def.edicao==='temporada' ? `${ano-1}/${String(ano).slice(-2)}` : String(ano);
  return Object.freeze({ano,edicao,campeoes:Object.freeze([Object.freeze({clube,quantidade:1})])});
 }).sort((a,b)=>b.ano-a.ano);
 const anos=registros.map(r=>r.ano);
 return Object.freeze({
  nome,fonte:def.fonte,cobertura:def.cobertura,observacao:def.observacao||'',
  primeiroAno:Math.min(...anos),ultimoAno:Math.max(...anos),
  edicoes:Object.freeze(registros),
 });
}
export const HISTORICO_LIGAS=Object.freeze(Object.fromEntries(
 Object.entries(DEFINICOES).map(([nome,def])=>[nome,montar(nome,def)])
));
export const edicoesLigasHistoricas=nome=>HISTORICO_LIGAS[nome]?.edicoes||[];
export const totalLigaHistorica=(nome,clube)=>
 edicoesLigasHistoricas(nome).reduce((s,e)=>s+e.campeoes
  .filter(c=>c.clube===clube).reduce((n,c)=>n+c.quantidade,0),0);
export const nomesLigasHistoricas=Object.freeze(Object.keys(HISTORICO_LIGAS));
