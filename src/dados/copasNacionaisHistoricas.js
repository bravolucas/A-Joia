/** Vencedores documentados das copas nacionais presentes no A JOIA — corte 19/11/2026.
 * O ano de ligas europeias representa a temporada encerrada; nas demais
 * competições, usar a edição registrada pela entidade organizadora.
 * Nunca criar vencedores para anos sem título (cancelamentos ou finais pendentes).
 * O acervo é informativo e não edita históricos simulados / saves existentes.
 */
const DEFINICOES = {
  "FA Cup": {
    "url": "https://www.footballhistory.org/tournament/fa-cup.html",
    "obs": "Anos são o encerramento da temporada (2026 equivale a 2025/26).",
    "dados": "2026=Manchester City;2025=Crystal Palace;2024=Manchester United;2023=Manchester City;2022=Liverpool;2021=Leicester City;2020=Arsenal;2019=Manchester City;2018=Chelsea;2017=Arsenal;2016=Manchester United;2015=Arsenal;2014=Arsenal;2013=Wigan Athletic;2012=Chelsea;2011=Manchester City;2010=Chelsea;2009=Chelsea;2008=Portsmouth;2007=Chelsea;2006=Liverpool;2005=Arsenal;2004=Manchester United;2003=Arsenal;2002=Arsenal;2001=Liverpool;2000=Chelsea"
  },
  "Copa del Rey": {
    "url": "https://www.laliga.com/noticias/palmares-copa-del-rey",
    "obs": "A edição 2019/20 é identificada por 2020, embora a final tenha sido disputada em 2021.",
    "dados": "2026=Real Sociedad;2025=Barcelona;2024=Athletic Bilbao;2023=Real Madrid;2022=Real Betis;2021=Barcelona;2020=Real Sociedad;2019=Valencia;2018=Barcelona;2017=Barcelona;2016=Barcelona;2015=Barcelona;2014=Real Madrid;2013=Atlético de Madrid;2012=Barcelona;2011=Real Madrid;2010=Sevilla;2009=Barcelona;2008=Valencia;2007=Sevilla;2006=Espanyol;2005=Real Betis;2004=Real Zaragoza;2003=Mallorca;2002=Deportivo La Coruña;2001=Real Zaragoza;2000=Espanyol"
  },
  "Coppa Italia": {
    "url": "https://www.worldfootball.net/competition/co27/italy-coppa-italia/records-winners-list/",
    "obs": "Torneio de copa italiana; não confundir com a Serie A.",
    "dados": "2026=Inter de Milão;2025=Bologna;2024=Juventus;2023=Inter de Milão;2022=Inter de Milão;2021=Juventus;2020=Napoli;2019=Lazio;2018=Juventus;2017=Juventus;2016=Juventus;2015=Juventus;2014=Napoli;2013=Lazio;2012=Napoli;2011=Inter de Milão;2010=Inter de Milão;2009=Lazio;2008=Roma;2007=Roma;2006=Inter de Milão;2005=Inter de Milão;2004=Lazio;2003=Milan;2002=Parma;2001=Fiorentina;2000=Lazio"
  },
  "DFB-Pokal": {
    "url": "https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger",
    "obs": "2026 equivale à temporada 2025/26; campeão da copa, não da Bundesliga.",
    "dados": "2026=Bayern de Munique;2025=Stuttgart;2024=Leverkusen;2023=RB Leipzig;2022=RB Leipzig;2021=Borussia Dortmund;2020=Bayern de Munique;2019=Bayern de Munique;2018=Eintracht Frankfurt;2017=Borussia Dortmund;2016=Bayern de Munique;2015=Wolfsburg;2014=Bayern de Munique;2013=Bayern de Munique;2012=Borussia Dortmund;2011=Schalke 04;2010=Bayern de Munique;2009=Werder Bremen;2008=Bayern de Munique;2007=Nürnberg;2006=Bayern de Munique;2005=Bayern de Munique;2004=Werder Bremen;2003=Bayern de Munique;2002=Schalke 04;2001=Schalke 04;2000=Bayern de Munique"
  },
  "Coupe de France": {
    "url": "https://www.fff.fr/473-palmares-de-la-coupe-de-france.html",
    "obs": "Competição organizada pela FFF; a final de 2026 foi vencida pelo Lens.",
    "dados": "2026=Lens;2025=PSG;2024=PSG;2023=Toulouse;2022=Nantes;2021=PSG;2020=PSG;2019=Rennes;2018=PSG;2017=PSG;2016=PSG;2015=PSG;2014=Guingamp;2013=Bordeaux;2012=Lyon;2011=Lille;2010=PSG;2009=Guingamp;2008=Lyon;2007=Sochaux;2006=PSG;2005=Auxerre;2004=PSG;2003=Auxerre;2002=Lorient;2001=Strasbourg;2000=Nantes"
  },
  "Taça de Portugal": {
    "url": "https://futebol.pt/recordes/taca-de-portugal-historia/",
    "obs": "Registra apenas a Taça de Portugal, não a Taça da Liga nem a Supertaça.",
    "dados": "2026=Torreense;2025=Sporting;2024=Porto;2023=Porto;2022=Porto;2021=Braga;2020=Porto;2019=Sporting;2018=Desportivo das Aves;2017=Benfica;2016=Braga;2015=Sporting;2014=Benfica;2013=Vitória de Guimarães;2012=Académica;2011=Porto;2010=Porto;2009=Porto;2008=Sporting;2007=Sporting;2006=Porto;2005=Vitória de Setúbal;2004=Benfica;2003=Porto;2002=Sporting;2001=Porto;2000=Porto"
  },
  "KNVB Beker": {
    "url": "https://www.knvb.com/dutch-football/mens-football/knvb-cup",
    "complementar": "https://nos.nl/artikel/2611146-az-overtuigend-naar-vijfde-bekerwinst-in-clubhistorie-5-1-zege-in-finale-tegen-nec",
    "obs": "Não houve campeão em 2020, quando a competição foi cancelada.",
    "dados": "2026=AZ;2025=Go Ahead Eagles;2024=Feyenoord;2023=PSV;2022=PSV;2021=Ajax;2019=Ajax;2018=Feyenoord;2017=Vitesse;2016=Feyenoord;2015=Groningen;2014=PEC Zwolle;2013=AZ;2012=PSV;2011=Twente;2010=Ajax;2009=Heerenveen;2008=Feyenoord;2007=Ajax;2006=Ajax;2005=PSV;2004=Utrecht;2003=Utrecht;2002=Ajax;2001=Twente;2000=Roda JC"
  },
  "Türkiye Kupası": {
    "url": "https://www.tff.org/default.aspx?pageID=411",
    "obs": "Os nomes comerciais históricos Fortis e Ziraat são aliases da mesma copa.",
    "dados": "2026=Trabzonspor;2025=Galatasaray;2024=Beşiktaş;2023=Fenerbahçe;2022=Sivasspor;2021=Beşiktaş;2020=Trabzonspor;2019=Galatasaray;2018=Akhisarspor;2017=Konyaspor;2016=Galatasaray;2015=Galatasaray;2014=Galatasaray;2013=Fenerbahçe;2012=Fenerbahçe;2011=Beşiktaş;2010=Trabzonspor;2009=Beşiktaş;2008=Kayserispor;2007=Beşiktaş;2006=Beşiktaş;2005=Galatasaray;2004=Trabzonspor;2003=Trabzonspor;2002=Kocaelispor;2001=Gençlerbirliği;2000=Galatasaray"
  },
  "King's Cup": {
    "url": "https://www.365scores.com/football/league/king's-cup-5501/history",
    "obs": "Copa do Rei Saudita. A competição foi descontinuada após 1990 e retomada em 2008; não confundir com a Crown Prince Cup.",
    "dados": "2026=Al-Hilal;2025=Al-Ittihad;2024=Al-Hilal;2023=Al-Hilal;2022=Al-Fayha;2021=Al-Faisaly;2020=Al-Hilal;2019=Al-Taawoun;2018=Al-Ittihad;2017=Al-Hilal;2016=Al-Ahli;2015=Al-Hilal;2014=Al-Shabab;2013=Al-Ittihad;2012=Al-Ahli;2011=Al-Ahli;2010=Al-Ittihad;2009=Al-Shabab;2008=Al-Shabab"
  },
  "US Open Cup": {
    "url": "https://www.rsssf.org/tablesu/usacuphist.html",
    "complementar": "https://www.ussoccer.com/stories/2026/10/usoc/match-recap-st-louis-city-vs-columbus-crew-open-cup-final",
    "obs": "Não houve competição em 2020 e 2021 por causa da pandemia.",
    "dados": "2026=St. Louis CITY SC;2025=Nashville SC;2024=LAFC;2023=Houston Dynamo;2022=Orlando City;2019=Atlanta United;2018=Houston Dynamo;2017=Sporting Kansas City;2016=FC Dallas;2015=Sporting Kansas City;2014=Seattle Sounders;2013=DC United;2012=Sporting Kansas City;2011=Seattle Sounders;2010=Seattle Sounders;2009=Seattle Sounders;2008=DC United;2007=New England Revolution;2006=Chicago Fire;2005=LA Galaxy;2004=Sporting Kansas City;2003=Chicago Fire;2002=Columbus Crew;2001=LA Galaxy;2000=Chicago Fire"
  },
  "Copa Argentina": {
    "url": "https://www.copaargentina.org/es/la-copa/17_Todos-los-ganadores-de-las-Copas-Nacionales.html",
    "obs": "Inclui 1969 e a fase moderna; a edição de 2026 segue sem campeão cadastrado em 19/11/2026. A edição chamada 2020 teve a decisão disputada em 2021.",
    "dados": "2025=Independiente Rivadavia;2024=Central Córdoba (SdE);2023=Estudiantes de La Plata;2022=Patronato;2020=Boca Juniors;2019=River Plate;2018=Rosario Central;2017=River Plate;2016=River Plate;2015=Boca Juniors;2014=Huracán;2013=Arsenal de Sarandí;2012=Boca Juniors;1969=Boca Juniors"
  }
};

const montar = (nome,def) => {
 const vistos=new Set();
 const edicoes=def.dados.split(';').map(par=>{
  const corte=par.indexOf('='),ano=Number(par.slice(0,corte)),clube=par.slice(corte+1).trim();
  if(!Number.isInteger(ano)||ano<1850||ano>2026||!clube||vistos.has(ano))
   throw new Error('Campeão inválido/duplicado: '+nome+' '+par);
  vistos.add(ano);
  const edicao=(['FA Cup','Copa del Rey','Coppa Italia','DFB-Pokal',
   'Coupe de France','Taça de Portugal','KNVB Beker','Türkiye Kupası',"King's Cup"].includes(nome))
   ? `${ano-1}/${String(ano).slice(-2)}` : String(ano);
  return Object.freeze({ano,edicao,campeoes:Object.freeze([Object.freeze({clube,quantidade:1})])});
 }).sort((a,b)=>b.ano-a.ano);
 return Object.freeze({
  nome,fonte:def.url,fontes:Object.freeze([def.url,...(def.complementar?[def.complementar]:[])]),
  cobertura:'recorte',nota:def.obs,primeiroAno:edicoes.at(-1).ano,ultimoAno:edicoes[0].ano,
  edicoes:Object.freeze(edicoes)
 });
};
export const HISTORICO_COPAS_NACIONAIS=Object.freeze(Object.fromEntries(
 Object.entries(DEFINICOES).map(([nome,def])=>[nome,montar(nome,def)])
));
export const nomesCopasNacionaisHistoricas=Object.freeze(Object.keys(HISTORICO_COPAS_NACIONAIS));
export const edicoesCopasNacionaisHistoricas=nome=>HISTORICO_COPAS_NACIONAIS[nome]?.edicoes||[];
export const totalCopaNacionalHistorica=(nome,clube)=>edicoesCopasNacionaisHistoricas(nome)
 .reduce((acc,e)=>acc+e.campeoes.filter(t=>t.clube===clube).reduce((a,t)=>a+t.quantidade,0),0);
