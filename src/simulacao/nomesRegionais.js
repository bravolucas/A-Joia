import { NOMES_MUNDO } from '../dados/data.js';

// Complementos regionais. A nacionalidade nunca implica automaticamente um nome brasileiro.
// Os grupos de referência são aproximações e devem evoluir para tabelas por região/idioma.
const ADICIONAIS = {
  HOL:[['Daan','Sem','Bram','Thijs','Jasper'],['De Jong','Van Dijk','Bakker','Visser','Smit']],
  BEL:[['Arthur','Noah','Louis','Mathis','Yanis'],['Peeters','Janssens','Dubois','Maes','Vermeulen']],
  URU:[['Federico','Nicolás','Agustín','Facundo','Sebastián'],['Pereira','Suárez','Bentancur','Rodríguez','Silveira']],
  COL:[['Juan','Santiago','Andrés','Sebastián','Camilo'],['Restrepo','Gómez','Quintero','Moreno','Cárdenas']],
  CRO:[['Luka','Ivan','Marko','Ante','Josip'],['Kovačić','Horvat','Babić','Marić','Jurić']],
  MAR:[['Youssef','Amine','Achraf','Hamza','Anas'],['El Amrani','Benali','Bennani','Alaoui','Idrissi']],
  JAP:[['Haruto','Ren','Yuto','Daiki','Takumi'],['Tanaka','Sato','Suzuki','Nakamura','Kobayashi']],
  EUA:[['Ethan','Noah','Liam','Aiden','Caleb'],['Johnson','Brown','Miller','Davis','Wilson']],
  MEX:[['Diego','Emiliano','Santiago','Luis','Carlos'],['Hernández','García','Ramírez','Flores','Vázquez']],
  SNE:[['Mamadou','Ibrahima','Cheikh','Moussa','Abdou'],['Diop','Ndiaye','Sarr','Fall','Ba']],
  SUI:[['Luca','Noah','Julian','Nico','Yann'],['Meier','Müller','Schmid','Frei','Bühler']],
  DIN:[['Mikkel','Emil','Oliver','Frederik','Magnus'],['Jensen','Nielsen','Hansen','Pedersen','Andersen']],
  COR:[['Min-jun','Ji-hoon','Seo-jun','Hyun-woo','Jae-hyun'],['Kim','Lee','Park','Choi','Jung']],
  NIG:[['Chinedu','Emeka','Tunde','Ifeanyi','Chukwuemeka'],['Okafor','Adeyemi','Ogunleye','Balogun','Nwosu']],
  CMR:[['André','Jean','Samuel','Fabrice','Christian'],['Moukoko','N'+'Koulou','Aboubakar','Mbia','Onana']],
  ALG:[['Riyad','Yacine','Sofiane','Ismaël','Youcef'],['Bennacer','Brahimi','Bentaleb','Belkacem','Mansouri']],
  POL:[['Jakub','Piotr','Kacper','Mateusz','Michał'],['Kowalski','Nowak','Wiśniewski','Zieliński','Wójcik']],
  SUE:[['Erik','Lukas','Oscar','Elias','Viktor'],['Andersson','Johansson','Karlsson','Nilsson','Lindberg']],
  NOR:[['Erik','Magnus','Sander','Emil','Jonas'],['Hansen','Johansen','Larsen','Solberg','Berg']],
  TUR:[['Emir','Arda','Kerem','Burak','Yusuf'],['Yılmaz','Demir','Kaya','Çelik','Şahin']],
  RUS:[['Dmitri','Ivan','Aleksandr','Nikita','Artem'],['Ivanov','Smirnov','Kuznetsov','Popov','Sokolov']],
  CHN:[['Wei','Jun','Hao','Ming','Jie'],['Wang','Li','Zhang','Liu','Chen']],
  EGI:[['Mohamed','Ahmed','Omar','Mostafa','Karim'],['Hassan','Mahmoud','Ibrahim','Sayed','Fathi']],
  GAN:[['Kwame','Kofi','Samuel','Emmanuel','Kojo'],['Mensah','Boateng','Asante','Owusu','Osei']],
  CAN:[['Liam','Noah','Ethan','Jacob','Nathan'],['Tremblay','Martin','Wilson','Roy','Campbell']],
  AUS:[['Jack','Oliver','Lachlan','William','Cooper'],['Smith','Brown','Taylor','Wilson','Thompson']],
  NZL:[['Liam','Oliver','Noah','Finn','Ariki'],['Wilson','Smith','Brown','Williams','Rangi']],
  GRE:[['Giorgos','Nikos','Dimitris','Kostas','Panagiotis'],['Papadopoulos','Nikolaou','Georgiou','Ioannou','Dimitriou']],
  SER:[['Luka','Nikola','Marko','Stefan','Dušan'],['Petrović','Jovanović','Nikolić','Marković','Stojanović']],
  IRN:[['Amir','Mehdi','Ali','Reza','Saeid'],['Hosseini','Mohammadi','Karimi','Rahimi','Ahmadi']],
  ISR:[['Noam','Daniel','Omer','Itay','Eitan'],['Cohen','Levi','Mizrahi','Peretz','Friedman']],
  AFS:[['Thabo','Sipho','Siyabonga','Lwazi','Kabelo'],['Dlamini','Ndlovu','Mokoena','Khumalo','Mthembu']],
};

const GRUPOS = {
  espanhol:['EQU','CRC','PAR','CHI','PER','BOL','HON','PAN','ELS'],
  ingles:['JAM','TRI','IRL','ESC','GAL'],
  frances:['CSC','RDC','TOG','HAI','TUN'],
  alemao:['AUT'],
  portugues:['ANG'],
  leste:['TCH','HUN','SVK','SLO','BOS','BUL','ROM'],
  arabe:['ARS','IRA','QAT','IRQ','KUW','EAU'],
};
const GRUPO_DADOS = {
  espanhol:'ESP', ingles:'ENG', frances:'FRA', alemao:'ALE',
  portugues:'POR', leste:'CRO', arabe:'MAR',
};
const REDE = Object.fromEntries(Object.entries(GRUPOS).flatMap(([grupo,codigos]) =>
  codigos.map(codigo => [codigo,GRUPO_DADOS[grupo]])));
const escolher=(lista,rng)=>lista[Math.min(lista.length-1,Math.floor(Math.max(0,Math.min(.999999999,rng()))*lista.length))];

/** Retorna a origem linguística de referência para nomes gerados.
 * Países com dados próprios têm prioridade; desconhecidos usam nomes internacionais neutros.
 */
export function origemNomes(nacionalidade) {
  if (NOMES_MUNDO[nacionalidade] || ADICIONAIS[nacionalidade]) return nacionalidade;
  return REDE[nacionalidade] || 'INT';
}
export function gerarNomeRegional(nacionalidade, rng=Math.random) {
  const codigo=origemNomes(nacionalidade);
  const original=NOMES_MUNDO[codigo];
  const adicional=ADICIONAIS[codigo];
  if (original) return `${escolher(original.pri,rng)} ${escolher(original.sob,rng)}`;
  if (adicional) return `${escolher(adicional[0],rng)} ${escolher(adicional[1],rng)}`;
  // Nunca usar o Brasil como fallback silencioso.
  return `${escolher(['Alex','Sam','Daniel','Adrian','Robin'],rng)} ${escolher(['Martin','Lee','Khan','Ali','Costa'],rng)}`;
}
