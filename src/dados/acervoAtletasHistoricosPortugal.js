// As contagens de jogo, mês ou edição ficam na descrição com o recorte da fonte.
const liga = 'https://www.ligaportugal.pt/';
const perfis = {
  'Académico Viseu': ['André Clóvis', 'ATA', '2025/26', 'Eleito melhor jogador e artilheiro da Liga Portugal 2 na edição 2025/26. Também integrou o onze do ano da competição.', liga + 'news/28078/andre-clovis-fecha-o-onze-do-ano-da-liga-portugal-2-meu-super'],
  Chaves: ['Platiny', 'ATA', '2018/19', 'Marcou o gol de empate aos 90+6 no 4 a 4 do Chaves com o Feirense pela primeira divisão.', liga + 'video/33136/golo%21-gd-chaves-platiny-aos-90%27%2B6%27-cd-feirense-4-4-gd-chaves'],
  Feirense: ['Zé Ricardo', 'VOL', '2025/26', 'Os torcedores elegeram um gol do brasileiro pelo Feirense como o Gol do Ano da Liga Portugal 2 nos Liga Portugal Awards de 2026.', liga + 'noticias/28167/william-gomes-e-ze-ricardo-marcaram-os-golos-do-ano'],
  Leixões: ['Paulité', 'ATA', '2025/26', 'Marcou o único gol e foi escolhido como melhor em campo na vitória do Leixões sobre o Felgueiras pela segunda divisão em janeiro de 2026.', liga + 'news/26553/genio-de-paulite-devolve-leixoes-sc-as-vitorias'],
  Penafiel: ['Zé Leite', 'ATA', '2024/25', 'Eleito melhor jogador e melhor atacante da Liga Portugal 2 em agosto de 2024 pelo Penafiel.', liga + 'news/12667/ze-leite%3A-%22o-mais-importante-e-estarmos-focados-no-nosso-caminho%22'],
  Torreense: ['Welthon', 'ATA', '2023/24', 'Eleito pelos treinadores como melhor atacante da Liga Portugal 2 em agosto e setembro de 2023 pelo Torreense.', liga + 'news/11856/welthon-%22bisa%22-como-continente-avancado-do-mes-da-liga-portugal-sabseg'],
  'Estrela da Amadora': ['Kikas', 'ATA', '2024/25', 'Recebeu o prêmio de melhor em campo na vitória por 2 a 1 sobre o Moreirense, a primeira do Estrela da Amadora na Liga Portugal Betclic 2024/25.', liga + 'news/12530/estrela-amadora-estreia-se-a-vencer'],
  Famalicão: ['Simon Banza', 'ATA', '2021/22', 'Marcou seu 14º gol na primeira divisão de 2021/22 na vitória por 3 a 2 sobre o B SAD, pela penúltima rodada.', 'https://zerozero.football/noticias/assim-claro-que-vamos-ter-saudades/365467'],
  Boavista: ['Erwin Sánchez', 'MEI', '2000/01', 'O meio-campista boliviano integrou o Boavista campeão português em 2000/01 sob o comando de Jaime Pacheco.', 'https://ar.uefa.com/news-media/news/0254-0d7b3a94893b-7fb0fb67041c-1000--boavista-appoint-from-within/'],
  'Vitória de Guimarães': ['Jota Silva', 'PE', '2023/24', 'Em março de 2024, recebeu os prêmios de melhor jogador e melhor atacante do mês da primeira divisão após quatro gols em quatro partidas pelo Vitória.', liga + 'news/11827/%22foi-um-mes-em-cheio%22'],
  Braga: ['Ricardo Horta', 'ATA', 'fevereiro de 2025', 'No balanço publicado em fevereiro de 2025, a Liga Portugal registrou 410 jogos e 134 gols pelo Braga. Naquela data, Horta liderava os dois totais históricos do clube.', liga + 'news/23810/ricardo-horta-no-trono-dos-guerreiros-do-minho'],
  'Casa Pia': ['Clayton Silva', 'ATA', '2023/24', 'Marcou o gol de empate do Casa Pia no segundo tempo do confronto contra o Sporting na primeira divisão, em agosto de 2023.', liga + 'news/11070/com-lotacao-esgotada-em-rio-maior-sporting-vence-o-casa-pia-ac'],
  'Rio Ave': ['Clayton Silva', 'ATA', '2024/25', 'Eleito pelos treinadores o melhor atacante da primeira divisão de janeiro de 2025 pelo Rio Ave.', liga + 'news/23996/%22este-foi-um-premio-muito-procurado%22'],
  Moreirense: ['André Luís', 'ATA', '2022/23', 'Marcou o gol de empate no 4 a 1 sobre o B SAD pela segunda divisão, iniciando a virada do Moreirense na 21ª rodada.', liga + 'news/9705/moreirense-fc-regressa-as-vitorias-com-reviravolta'],
  'Gil Vicente': ['Fran Navarro', 'ATA', '2021/22', 'A Liga Portugal registrou 16 gols em 34 partidas na primeira divisão de 2021/22 pelo Gil Vicente.', liga + 'player/77888/francisco-navarro/20212022/162'],
  Arouca: ['Rafa Mujica', 'ATA', '2023/24', 'Marcou 20 gols na primeira divisão e integrou o onze do ano escolhido pelos capitães e treinadores da competição.', liga + 'news/12081/mujica-com-lugar-no-onze-do-ano'],
  'Santa Clara': ['Gabriel Silva', 'ATA', '2025/26', 'Marcou de falta o gol do 1 a 0 sobre o AVS em março de 2026, pela 26ª rodada da primeira divisão.', liga + 'video/67684/golo%21-santa-clara-gabriel-silva-aos-68%27-afs-0-1-santa-clara'],
  Nacional: ['Chuchu Ramírez', 'ATA', '2023/24', 'Eleito pelos treinadores o melhor atacante do mês da Liga Portugal 2 pelo Nacional.', liga + 'news/11945/chuchu-ramirez-eleito-continente-avancado-do-mes-da-liga-portugal-sabseg'],
  Estoril: ['Cassiano', 'ATA', '2023/24', 'Marcou sete gols na primeira divisão pelo Estoril na edição 2023/24, segundo o balanço da Liga Portugal.', liga + 'news/23912/o-melhor-cassiano-de-sempre'],
  AVS: ['Nenê', 'ATA', '2023/24', 'Foi o artilheiro da Liga Portugal 2 e integrou o onze do ano da competição pelo AVS.', liga + 'news/12093/nene-no-onze-do-ano'],
  Tondela: ['Roberto', 'ATA', '2024/25', 'Marcou nos acréscimos o segundo gol do Tondela sobre a União de Leiria na última rodada da campanha do título da segunda divisão.', liga + 'video/63581/golo%21-cd-tondela-roberto-aos-90%27%2B4%27-u.-leiria-0-2-cd-tondela'],
  Marítimo: ['Joel Tagueu', 'ATA', '2020/21', 'Marcou o único gol da vitória do Marítimo sobre o Braga na 30ª rodada da primeira divisão.', 'https://csmaritimo.vsports.pt/vod/67438/m/7260/csm/d7f473a096d1e89f6245aaa28551b243'],
  Alverca: ['Anthony Carter', 'ATA', '2024/25', 'Eleito melhor jogador e melhor atacante de dezembro de 2024 na Liga Portugal 2 pelo Alverca.', liga + 'news/23606/anthony-carter-e-tambem-jogador-do-mes-da-liga-portugal-2-meu-super'],
};

export const ACERVO_ATLETAS_HISTORICOS_PORTUGAL = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, [nome, posicao, periodo, descricao, fonte]]) => [
    clube,
    Object.freeze([Object.freeze({nome, posicao, periodo, descricao, fonte, jogos: null, gols: null})]),
  ]),
));
