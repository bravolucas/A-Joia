/**
 * A JOIA — Acervo histórico lote 21 · 24/11/2026.
 * Evidências: história oficial do Al-Ettifaq, Saudipedia, Gaziantep FK e TFF.
 * Distingue Gaziantep FK de Gaziantepspor: são entidades diferentes.
 */
const FONTES={
 ettifaq:'https://ettifaq.com/club-history/',
 ettifaqAtletas:'https://saudipedia.com/en/al-ettifaq-club',
 gaz:'https://gaziantepfk.org/kulubumuz/kulup-tarihcesi',
 gazAtletas:'https://www.tff.org/Resources/TFF/Documents/LIGLER/2019-2020/TakimListe2/SL/GAZIANTEP-FUTBOL-KULUBU.pdf',
 gazMaxim:'https://h.aa.com.tr/tr/futbol/gaziantep-fknin-kaptani-maxim-3-kulvarda-kulup-tarihine-gecti/3590448',
};
const DADOS={
 'Al-Ettifaq':{
  atletas:[
   ['Saleh Al-Khalifa','MC','anos 1980',null,null,'ettifaqAtletas','Meio-campista da geração histórica de títulos nacionais e regionais do clube.'],
   ['Khalil Al-Zayani','ZAG','até 1971',null,null,'ettifaqAtletas','Ex-defensor do Al-Ettifaq, mais tarde treinador de conquistas históricas.'],
  ],
  marcos:[
   [1983,'Primeiro título do campeonato saudita','ettifaq','Campeão da liga saudita na temporada 1982/83.'],
   [1985,'Campeão da Copa do Rei Saudita','ettifaq','Conquista da King’s Cup de 1985.'],
   [1987,'Bicampeão saudita','ettifaq','Segundo título da liga nacional, na temporada 1986/87.'],
   [1988,'Títulos regionais e árabes','ettifaq','Conquistas do Golfo e da competição árabe de clubes em 1988.'],
  ],
  tecnicos:[['Khalil Al-Zayani','1980–1984; 1986–1990','ettifaqAtletas','Técnico do clube nos títulos da liga de 1983 e 1987.']],
 },
 'Gaziantep':{
  atletas:[
   ['Alexandru Maxim','MEI','2020–',null,null,'gazMaxim','Meio-campista romeno contratado inicialmente por empréstimo em 2020; tornou-se capitão.'],
   ['Olarenwaju Kayode','ATA','2019–2020',null,null,'gazAtletas','Atacante relacionado na equipe que disputou a primeira temporada do Gaziantep FK na Süper Lig.'],
  ],
  marcos:[
   [1988,'Fundação do antecessor Sankospor','gaz','O clube hoje conhecido como Gaziantep FK tem origem no Sankospor, criado em 1988.'],
   [2019,'Primeira participação na Süper Lig','gaz','Estreou na primeira divisão turca na temporada 2019/20, quando adotou a identidade Gaziantep FK.'],
  ],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte ausente no lote 21: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE21=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
