const perfis = {
  'Real Zaragoza': ['Nayim', 'MEI', '1994/95', 'Marcou de longa distância no último minuto da prorrogação da final contra o Arsenal. O gol deu ao Zaragoza o título da Recopa Europeia.', 'https://www.realzaragoza.com/noticias/se-cumplen-24-anos-de-la-recopa-de-europa-del-real-zaragoza'],
  'Sporting Gijón': ['Quini', 'ATA', '1973/74', 'Foi o artilheiro da primeira divisão espanhola pelo Sporting, com 20 gols na edição.', 'https://assets.laliga.com/assets/2019/12/17/originals/9a0f7782c1b200e81776eeb7be0ee540.pdf'],
  Eibar: ['Jota Peleteiro', 'MEI', '2013/14', 'O Eibar registrou 11 gols em 35 partidas naquela temporada. Um deles, contra o Alavés em Ipurua, garantiu o primeiro acesso do clube à primeira divisão.', 'https://www.sdeibar.com/noticias/jota-peleteiro-vuelve-a-sd-eibar'],
  Cádiz: ['Mágico González', 'MEI', '1982/83', 'Marcou um dos gols na vitória por 3 a 1 sobre o Elche na última rodada, que garantiu o acesso do Cádiz à primeira divisão.', 'https://www.cadizcf.com/noticias/resena-historica-otra-vez-lejos-del-carranza'],
  Huesca: ['Cucho Hernández', 'ATA', '2017/18', 'Tinha 16 gols e seis assistências quando a liga registrou o primeiro acesso do Huesca à elite, confirmado com vitória sobre o Lugo na 40ª rodada.', 'https://www.laliga.com/noticias/sudamerica-protagonista-en-el-historico-ascenso-de-la-sd-huesca'],
  Granada: ['Antonio Puertas', 'MEI', '2018/19', 'Foi o artilheiro do Granada com dez gols na campanha de acesso à primeira divisão, segundo o clube.', 'https://www.granadacf.es/noticias/el-arquero-puertas-hace-historia-en-el-granada-cf'],
  Almería: ['Umar Sadiq', 'ATA', '2021/22', 'Marcou 18 gols pelo Almería na liga e um na Copa do Rei naquela temporada, segundo o balanço do clube.', 'https://www.udalmeriasad.com/noticias/sadiq-umar-se-marcha-traspasado-a-la-real-sociedad'],
  Tenerife: ['Juan Antonio Pizzi', 'ATA', '1995/96', 'Foi o artilheiro da primeira divisão espanhola com 31 gols pelo Tenerife, que terminou a edição em quinto lugar.', 'https://www.laliga.com/noticias/pizzi-la-mejor-inspiracion-del-valencia'],
  Albacete: ['José Luis Zalazar', 'MEI', '1990/91', 'Foi um dos destaques do Albacete de Benito Floro, campeão da segunda divisão na campanha do primeiro acesso do clube à elite.', 'https://www.albacetebalompie.es/el-inolvidable-queso-mecanico'],
  Burgos: ['Saúl Berjón', 'PE', '2020/21', 'Marcou o gol decisivo contra o Bilbao Athletic no playoff que levou o Burgos à segunda divisão em 2021.', 'https://www.burgoscf.es/noticias/adios-al-turu-el-heroe-de-almendralejo'],
  'CD Castellón': ['Jesús de Miguel', 'ATA', '2023/24', 'Foi eleito o melhor jogador do Grupo II da Primera Federación na campanha de acesso do Castellón à segunda divisão.', 'https://www.cdcastellon.com/de-miguel-pre-huesca/'],
  Eldense: ['Juanto Ortuño', 'ATA', '2022/23', 'Marcou aos 114 minutos contra o Real Madrid Castilla o gol que garantiu o acesso do Eldense à segunda divisão.', 'https://www.cdeldense.es/noticias/comunicado-oficial-juanto-ortuno'],
  Córdoba: ['Ulises Dávila', 'ATA', '2013/14', 'Marcou o gol de empate nos acréscimos contra o Las Palmas na volta da final dos playoffs. O Córdoba subiu pelo critério de gols fora.', 'https://www.laliga.com/noticias/uli-davila-firma-el-ascenso-del-cordoba'],
  Cartagena: ['Rubén Castro', 'ATA', '2020/21', 'Segundo o Cartagena, marcou 19 gols na campanha de permanência do clube na segunda divisão e terminou como quarto maior goleador da competição.', 'https://www.fccartagena.es/noticias/ruben-castro-seguira-agigantando-su-leyenda-en-el-fc-cartagena'],
  Mirandés: ['Joaquín Panichelli', 'ATA', '2024/25', 'Marcou pelo Mirandés na volta da final dos playoffs de acesso contra o Real Oviedo.', 'https://www.realoviedo.es/noticias/hemos-vuelto'],
  'Racing Ferrol': ['Joselu', 'ATA', '2018/19', 'Marcou os dois gols do Racing Ferrol nos confrontos com o Real Jaén. O clube conquistou o acesso à Segunda División B pelo critério de gols fora.', 'https://www.racingclubferrol.net/historia'],
  Girona: ['Artem Dovbyk', 'ATA', '2023/24', 'Foi o artilheiro da primeira divisão espanhola com 24 gols pelo Girona, a maior marca do clube em uma edição da elite até então.', 'https://www.gironafc.cat/es/noticias/dovbyk-pichichi-de-primera-division'],
  Mallorca: ["Samuel Eto'o", 'ATA', '2002/03', 'Marcou dois dos três gols do Mallorca no 3 a 0 contra o Recreativo de Huelva na final da Copa do Rei.', 'https://www.rcdmallorca.es/historia-del-rcd-mallorca'],
  'Real Oviedo': ['Santi Cazorla', 'MEI', '2024/25', 'Marcou de pênalti o gol de empate contra o Mirandés na partida que confirmou o retorno do Oviedo à primeira divisão.', 'https://www.realoviedo.es/noticias/hemos-vuelto'],
  'Real Valladolid': ['Shon Weissman', 'ATA', '2021/22', 'Marcou 20 gols na segunda divisão e abriu o placar contra o Huesca no último jogo da campanha do acesso.', 'https://www.realvalladolid.es/noticias/los-numeros-individuales-del-ascenso'],
  'Las Palmas': ['Jonathan Viera', 'MEI', '2014/15', 'O Las Palmas registrou sete gols em 21 jogos na campanha em que o clube subiu à primeira divisão.', 'https://www.udlaspalmas.es/noticias/jonathan-viera-traspasado-al-beijing-guoan'],
  'Leganés': ['Pablo Insua', 'ZAG', '2015/16', 'Marcou de cabeça contra o Mirandés na última rodada. O gol deu ao Leganés o primeiro acesso de sua história à primeira divisão.', 'https://www.cdleganes.com/historia'],
};

export const ACERVO_ATLETAS_HISTORICOS_ESPANHA = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, [nome, posicao, periodo, descricao, fonte]]) => [
    clube,
    Object.freeze([Object.freeze({nome, posicao, periodo, descricao, fonte, jogos: null, gols: null})]),
  ]),
));
