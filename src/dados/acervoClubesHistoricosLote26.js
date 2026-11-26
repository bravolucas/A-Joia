/**
 * A JOIA — Acervo histórico lote 26 · 24/11/2026.
 * Fontes: federação turca (TFF), imprensa Anadolu e páginas históricas dos clubes.
 * Não atribuir estatísticas individuais sem fonte explícita.
 */
const FONTES={
 kocaTff:'https://www.tff.org/Resources/Tamsaha/246/110-111/',
 kocaCopas:'https://mobile.aa.com.tr/tr/futbol/kocaelispor-59-yasini-super-lige-yukselmenin-mutluluguyla-kutluyor/3547129',
 kocaAcesso:'https://www.tff.org/default.aspx?ftxtID=47540&pageID=287',
 genHistoria:'https://www.genclerbirligi.org.tr/en/tarihimiz',
 genTitulos:'https://genclerbirligi.org.tr/en/kupalarimiz',
};
const fonte=id=>{if(!FONTES[id])throw new Error('Fonte lote 26 ausente: '+id);return FONTES[id]};
const atleta=(nome,posicao,periodo,descricao,src)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:fonte(src)});
const marco=(ano,titulo,descricao,src)=>Object.freeze({ano,titulo,descricao,fonte:fonte(src)});
const tecnico=(nome,periodo,descricao,src)=>Object.freeze({nome,periodo,descricao,fonte:fonte(src)});
export const ACERVO_CLUBES_LOTE26=Object.freeze({
 'Kocaelispor':Object.freeze({
  clube:'Kocaelispor',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Fahrudin Ömerović','GOL','1992–1993','Goleiro do elenco lembrado pela campanha da Süper Lig de 1992/93.','kocaTff'),
   atleta('Saffet Sancaklı','ATA','1992–1993','Atacante da equipe que disputou as primeiras colocações da Süper Lig em 1992/93.','kocaTff'),
   atleta('Faruk Yiğit','ATA','1992–1993','Atacante citado no retrospecto da TFF sobre a campanha histórica de 1992/93.','kocaTff'),
  ]),
  recordes:Object.freeze([]),
  marcos:Object.freeze([
   marco(1966,'Fundação do Kocaelispor','Criado em Kocaeli em 24 de abril de 1966 após união de três clubes da cidade.','kocaTff'),
   marco(1980,'Primeiro acesso à elite turca','Terminou líder do grupo na temporada 1979/80 e garantiu a vaga na primeira divisão.','kocaTff'),
   marco(1997,'Primeira Copa da Turquia','Conquistou a Copa da Turquia 1996/97 após superar o Trabzonspor na decisão.','kocaCopas'),
   marco(2002,'Segunda Copa da Turquia','Foi campeão da Copa da Turquia 2001/02 após vencer a decisão contra o Beşiktaş.','kocaCopas'),
   marco(2025,'Campeão da segunda divisão e retorno à elite','Conquistou o título da Trendyol 1. Lig 2024/25 e voltou à Süper Lig após 16 anos.','kocaAcesso'),
  ]),
  tecnicos:Object.freeze([tecnico('Güvenç Kurtar','1991–1992','Treinador do retorno à primeira divisão em 1991/92.','kocaTff')]),
 }),
 'Gençlerbirliği':Object.freeze({
  clube:'Gençlerbirliği',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Hasan Polat','MC','década de 1940','Um dos principais atletas na conquista do campeonato turco de 1941, segundo a história oficial.','genHistoria'),
  ]),
  recordes:Object.freeze([]),
  marcos:Object.freeze([
   marco(1923,'Fundação em Ancara','Criado em 14 de março de 1923 por alunos do Ankara Sultanisi.','genHistoria'),
   marco(1941,'Campeonato Turco anterior à liga nacional','Conquistou o Campeonato Turco de Futebol de 1941, competição anterior à atual Süper Lig.','genTitulos'),
   marco(1946,'Segundo Campeonato Turco pré-liga nacional','Conquistou novamente o Campeonato Turco de Futebol em 1946.','genTitulos'),
   marco(1987,'Primeira Copa da Turquia','Superou o Eskişehirspor e conquistou a Copa da Turquia de 1986/87.','genTitulos'),
   marco(2001,'Segunda Copa da Turquia','Empatou por 2 a 2 com o Fenerbahçe e venceu a decisão por 4 a 1 nos pênaltis.','genTitulos'),
   marco(2004,'Campanha europeia de destaque','Eliminou Blackburn, Sporting e Parma na Copa UEFA 2003/04; caiu diante do Valencia.','genTitulos'),
  ]),
  tecnicos:Object.freeze([tecnico('Ersun Yanal','2002–2004','Liderou a equipe na histórica campanha da Copa UEFA 2003/04.','genHistoria')]),
 }),
});
