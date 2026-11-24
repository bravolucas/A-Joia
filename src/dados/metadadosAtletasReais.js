/**
 * Metadados pontuais e verificáveis para nomes reais presentes na base do jogo.
 * A identidade é a combinação exata de nome + clube do catálogo inicial: um
 * homônimo jamais herda acidentalmente a nacionalidade ou idade de outro.
 *
 * Referência da idade: início da temporada do jogo, 01/07/2026.
 * Os metadados corrigem novos elencos. Uma migração separada e restrita
 * corrige erros conhecidos de nacionalidade em saves antigos, sem mexer em partidas.
 * Para atletas ainda não verificados, mantém-se o comportamento legado.
 *
 * Referências primárias consultadas:
 * UEFA - https://www.uefa.com/uefachampionsleague/clubs/players/
 * UEFA - https://www.uefa.com/news-media/mediaservices/informationkits/
 * FC Barcelona - https://www.fcbarcelona.com/en/football/first-team/players
 * Manchester United - https://www.manutd.com/en/teams/mens-team
 *
 * TODO(issue #84): estender a cobertura aos demais atletas do catálogo
 * somente mediante validação documental, sem inferir nacionalidade do clube.
 */

const REGISTROS = [
  // Palmeiras (2026): nascido em Quibdó, Colômbia. Fontes: Palmeiras / Federação Colombiana.
  // https://www.palmeiras.com.br/noticias/palmeiras-contrata-colombiano-jhon-arias-do-wolverhampton-ing/
  // https://fcf.com.co/wp-content/uploads/2025/09/Guia-de-medios-Clasificados-a-la-Copa-Mundial-de-la-FIFA-2026.pdf
  ['Jhon Arias', 'Palmeiras', 'COL', '1997-09-21'],
  ['Lionel Messi', 'Inter Miami', 'ARG', '1987-06-24'],
  ['Cristiano Ronaldo', 'Al-Nassr', 'POR', '1985-02-05'],
  ['Neymar Jr', 'Santos', 'BRA', '1992-02-05'],
  ['Kylian Mbappé', 'Real Madrid', 'FRA', '1998-12-20'],
  ['Erling Haaland', 'Manchester City', 'NOR', '2000-07-21'],
  ['Mohamed Salah', 'Liverpool', 'EGI', '1992-06-15'],
  ['Harry Kane', 'Bayern de Munique', 'ENG', '1993-07-28'],
  ['Jude Bellingham', 'Real Madrid', 'ENG', '2003-06-29'],
  ['Lamine Yamal', 'Barcelona', 'ESP', '2007-07-13'],
  ['Luka Modrić', 'Milan', 'CRO', '1985-09-09'],
  ['Kevin De Bruyne', 'Napoli', 'BEL', '1991-06-28'],
  ['Thibaut Courtois', 'Real Madrid', 'BEL', '1992-05-11'],
  ['Federico Valverde', 'Real Madrid', 'URU', '1998-07-22'],
  ['Raphinha', 'Barcelona', 'BRA', '1996-12-14'],
  ['Jamal Musiala', 'Bayern de Munique', 'ALE', '2003-02-26'],
  ['Bruno Fernandes', 'Manchester United', 'POR', '1994-09-08'],
  ['Lewandowski', 'Barcelona', 'POL', '1988-08-21'],
  ['Bukayo Saka', 'Arsenal', 'ENG', '2001-09-05'],

  // Lote 2 — nascimentos e seleções conferidos em documentos oficiais.
  ['Antoine Griezmann', 'Atlético de Madrid', 'FRA', '1991-03-21'],
  ['Phil Foden', 'Manchester City', 'ENG', '2000-05-28'],
  ['Kenan Yildiz', 'Juventus', 'TUR', '2005-05-04'],
  ['Dušan Vlahović', 'Juventus', 'SER', '2000-01-28'],
  ['Virgil van Dijk', 'Liverpool', 'HOL', '1991-07-08'],
  ['Trent Alexander-Arnold', 'Real Madrid', 'ENG', '1998-10-07'],
  ['Alisson', 'Liverpool', 'BRA', '1992-10-02'],
  ['Manuel Neuer', 'Bayern de Munique', 'ALE', '1986-03-27'],
  ['Rúben Dias', 'Manchester City', 'POR', '1997-05-14'],
  ['Pedri', 'Barcelona', 'ESP', '2002-11-25'],
  ['Gavi', 'Barcelona', 'ESP', '2004-08-05'],
  ['Gabriel Martinelli', 'Arsenal', 'BRA', '2001-06-18'],
  ['Gabriel Magalhães', 'Arsenal', 'BRA', '1997-12-19'],
  ['Enzo Fernández', 'Chelsea', 'ARG', '2001-01-17'],
  ['Cole Palmer', 'Chelsea', 'ENG', '2002-05-06'],
  ['Florian Wirtz', 'Liverpool', 'ALE', '2003-05-03'],
  ['Ousmane Dembélé', 'PSG', 'FRA', '1997-05-15'],
  ['Rodrygo', 'Real Madrid', 'BRA', '2001-01-09'],
  ['Gianluigi Donnarumma', 'Manchester City', 'ITA', '1999-02-25'],
  ['Rúben Neves', 'Al-Hilal', 'POR', '1997-03-13'],
  ['Bernardo Silva', 'Manchester City', 'POR', '1994-08-10'],

  // Lote 3 — identidades verificadas com referência documental por atleta.
  ['Aurélien Tchouaméni', 'Real Madrid', 'FRA', '2000-01-27'],
  ['Arda Güler', 'Real Madrid', 'TUR', '2005-02-25'],
  ['Éder Militão', 'Real Madrid', 'BRA', '1998-01-18'],
  ['Dean Huijsen', 'Real Madrid', 'ESP', '2005-04-14'],
  ['Brahim Díaz', 'Real Madrid', 'MAR', '1999-08-03'],
  ['Frenkie de Jong', 'Barcelona', 'HOL', '1997-05-12'],
  ['Jules Koundé', 'Barcelona', 'FRA', '1998-11-12'],
  ['Alejandro Balde', 'Barcelona', 'ESP', '2003-10-18'],
  ['Dani Olmo', 'Barcelona', 'ESP', '1998-05-07'],
  ['Ferran Torres', 'Barcelona', 'ESP', '2000-02-29'],
  ['Omar Marmoush', 'Manchester City', 'EGI', '1999-02-07'],
  ['Alexander Isak', 'Liverpool', 'SUE', '1999-09-21'],
  ['Dominik Szoboszlai', 'Liverpool', 'HUN', '2000-10-25'],
  ['Alexis Mac Allister', 'Liverpool', 'ARG', '1998-12-24'],
  ['Cody Gakpo', 'Liverpool', 'HOL', '1999-05-07'],
  ['Nuno Mendes', 'PSG', 'POR', '2002-06-19'],
  ['Vitinha', 'PSG', 'POR', '2000-02-13'],
  ['João Neves', 'PSG', 'POR', '2004-09-27'],
  ['Joshua Kimmich', 'Bayern de Munique', 'ALE', '1995-02-08'],
  ['Michael Olise', 'Bayern de Munique', 'FRA', '2001-12-12'],
  ['Luis Díaz', 'Bayern de Munique', 'COL', '1997-01-13'],
  ['Alphonso Davies', 'Bayern de Munique', 'CAN', '2000-11-02'],
];

const chave = (nome, clube) => `${nome}\u0000${clube}`;
const REGISTROS_POR_IDENTIDADE = new Map(
  REGISTROS.map(([nome, clube, nac, nascimento]) => [
    chave(nome, clube), Object.freeze({ nac, nascimento }),
  ]),
);

/** Dados identificáveis apenas por correspondência exata e não ambígua. */
export function metadadosAtletaReal(nome, clube) {
  return REGISTROS_POR_IDENTIDADE.get(chave(nome, clube)) ?? null;
}

/** Idade em anos completos em 1º de julho do ano inicial da carreira. */
export function idadeAtletaReal(nascimento, anoInicio = 2026) {
  if (typeof nascimento !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(nascimento) ||
      !Number.isInteger(anoInicio)) return null;
  const [ano, mes, dia] = nascimento.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  if (data.getUTCFullYear() !== ano || data.getUTCMonth() + 1 !== mes ||
      data.getUTCDate() !== dia) return null;
  const idade = anoInicio - ano - (mes > 7 || (mes === 7 && dia > 1) ? 1 : 0);
  return idade >= 0 && idade <= 100 ? idade : null;
}

/** Auxílio à auditoria: verifica cobertura, sem alterar o estado do jogo. */
export const totalMetadadosAtletasReais = REGISTROS_POR_IDENTIDADE.size;
