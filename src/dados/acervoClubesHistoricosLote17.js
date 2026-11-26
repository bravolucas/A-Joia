/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 17 (24/11/2026)
 * Fontes institucionais: UEFA, TFF e AFC.
 * Marcos e jogadores confirmados; números totais de carreira permanecem null.
 * Atenção: Gençlerbirliği e Gençlerbirligi são variantes de grafia; chave exata do jogo.
 */
const FONTES={
 konya:'https://www.uefa.com/uefaeuropaleague/news/023a-0e97322bc29e-64554362198c-1000--club-facts-konyaspor/',
 konyaFirst:'https://www.uefa.com/uefaeuropaleague/news/023f-0e980e4c01a9-6cbdcfe105c6-1000--vitoria-sc-v-konyaspor-background/',
 koca:'https://www.tff.org/Resources/Tamsaha/246/112-113/',
 kocaCup:'https://www.tff.org/Default.aspx?pageID=411',
 genc:'https://www.uefa.com/uefaeuropaleague/news/019b-0e6acfcb2da7-53d3cec55089-1000--daems-decisive-for-genclerbirligi/',
 gencEnd:'https://www.uefa.com/uefaeuropaleague/news/019b-0e6ad2125d14-7deed4e6838c-1000--benitez-breathes-sigh-of-relief/',
 gencTech:'https://www.uefa.com/uefaeuropaleague/news/019b-0e6c0f295dd6-c3101a089b70-1000--yanal-praises-resilient-genclerbirligi/',
 nassr:'https://www.the-afc.com/en/club/fifa_club_world_cup/news/al_nassrs_unique_run_to_the_global_stage.html',
 nassrIcon:'https://www.the-afc.com/en/more/news/asian_icons_majed_abdullah_saudi_arabia.html',
};
const DADOS={
 'Konyaspor':{
  atletas:[
   ['Musa Araz','MEI','2016–2018',null,null,'konyaFirst','Marcou na vitória por 2 a 1 contra o Vitória SC na Europa League 2017/18.'],
   ['Deni Milošević','MEI','2016–2021',null,null,'konyaFirst','Marcou na primeira vitória europeia do Konyaspor, diante do Vitória SC.'],
  ],
  marcos:[
   [2017,'Campeão da Copa da Turquia','konya','Conquistou a Copa da Turquia de 2016/17.'],
   [2017,'Primeira vitória europeia','konyaFirst','Venceu o Vitória SC por 2 a 1 na fase de grupos da Europa League de 2017/18.'],
  ],
 },
 'Kocaelispor':{
  atletas:[
   ['Cihan Haspolatlı','MEI','2001–2002',null,null,'koca','Marcou um dos quatro gols na final da Copa da Turquia de 2001/02.'],
   ['Zdravko Lazarov','ATA','2000–2003',null,null,'koca','Marcou na vitória por 4 a 0 sobre o Beşiktaş na decisão da Copa de 2002.'],
  ],
  marcos:[
   [1997,'Campeão da Copa da Turquia','kocaCup','Primeiro dos dois títulos de Copa conquistados pelo Kocaelispor.'],
   [2002,'Bicampeão da Copa da Turquia','koca','Superou o Beşiktaş por 4 a 0 na decisão da temporada 2001/02.'],
  ],
  tecnicos:[['Hikmet Karaman','2001–2002','koca','Comandou o Kocaelispor na conquista da Copa da Turquia de 2001/02.']],
 },
 'Gençlerbirliği':{
  atletas:[['Filip Daems','ZAG','2001–2005',null,null,'genc','Autor do gol de pênalti na vitória por 1 a 0 sobre o Valencia na Copa UEFA de 2003/04.']],
  marcos:[[2004,'Oitavas de final da Copa UEFA','gencEnd','Venceu o Valencia por 1 a 0 na ida das oitavas; eliminado na volta pela regra do gol de prata.']],
  tecnicos:[['Ersun Yanal','2002–2004','gencTech','Treinador durante a campanha europeia de 2003/04.']],
 },
 'Al-Nassr':{
  atletas:[['Majed Abdullah','ATA','1977–1998',null,null,'nassrIcon','Atacante histórico que participou da conquista da Recopa Asiática de 1998.']],
  marcos:[
   [1998,'Campeão da Recopa Asiática','nassr','Conquistou a Asian Cup Winners’ Cup de 1997/98.'],
   [1998,'Campeão da Supercopa Asiática','nassr','Venceu a Asian Super Cup de 1998 e obteve vaga no Mundial de Clubes.'],
   [2000,'Participante do primeiro Mundial de Clubes da FIFA','nassr','Representante asiático na edição inaugural do Mundial de Clubes, disputada no Brasil.'],
  ],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte ausente do lote 17: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE17=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
