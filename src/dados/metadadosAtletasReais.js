/**
 * Metadados pontuais e verificáveis para nomes reais presentes na base do jogo.
 * A identidade é a combinação exata de nome + clube do catálogo inicial: um
 * homônimo jamais herda acidentalmente a nacionalidade ou idade de outro.
 *
 * Referência da idade: início da temporada do jogo, 01/07/2026.
 * O catálogo só afeta novas carreiras; não migra/sobrescreve saves antigos.
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
