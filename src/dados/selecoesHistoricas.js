/**
 * Acervo real de campeões de seleções — independente de saves e simulações.
 * 2026: Espanha venceu a Copa do Mundo (FIFA, 19/07/2026).
 * AFCON 2025: Marrocos é o vencedor reconhecido por decisão da CAF de
 * 17/03/2026; recurso do Senegal no TAS pendente em 18/11/2026.
 * Edições são identificadas pelo ano oficial do torneio, não pelo ano civil da final.
 *
 * Fontes institucionais:
 * https://www.fifa.com/en/tournaments/mens/worldcup/articles/world-cup-champions-1982-2026-italy-argentina-germany-brazil-france-spain
 * https://www.uefa.com/uefaeuro/history/winners/
 * https://copaamerica.com/pt/noticias/todas-as-edicoes-conmebol-copa-america-campeoes-sedes-melhores-jogadores
 * https://www.cafonline.com/afcon2025/news/before-morocco-2025-the-champions-who-built-afcon-s-legacy/
 * https://www.cafonline.com/news/caf-appeal-board-media-statement/
 * https://www.the-afc.com/en/national/afc_asian_cup/news/the_continents_pride_and_joy%C2%A0.html
 * https://www.concacaf.com/news/jimenez-y-alvarez-guian-a-mexico-a-su-decimo-titulo-de-copa-oro
 * https://www.oceaniafootball.com/history-ofc-mens-nations-cup/
 */
const COPAS = {
 'Copa do Mundo': [
 [1930,'Uruguai'],[1934,'Itália'],[1938,'Itália'],[1950,'Uruguai'],
 [1954,'Alemanha'],[1958,'Brasil'],[1962,'Brasil'],[1966,'Inglaterra'],
 [1970,'Brasil'],[1974,'Alemanha'],[1978,'Argentina'],[1982,'Itália'],
 [1986,'Argentina'],[1990,'Alemanha'],[1994,'Brasil'],[1998,'França'],
 [2002,'Brasil'],[2006,'Itália'],[2010,'Espanha'],[2014,'Alemanha'],
 [2018,'França'],[2022,'Argentina'],[2026,'Espanha'],
 ],
 'Eurocopa': [
 [1960,'União Soviética'],[1964,'Espanha'],[1968,'Itália'],[1972,'Alemanha'],
 [1976,'Tchecoslováquia'],[1980,'Alemanha'],[1984,'França'],[1988,'Holanda'],
 [1992,'Dinamarca'],[1996,'Alemanha'],[2000,'França'],[2004,'Grécia'],
 [2008,'Espanha'],[2012,'Espanha'],[2016,'Portugal'],[2020,'Itália'],
 [2024,'Espanha'],
 ],
 'Copa América': [
 [1916,'Uruguai'],[1917,'Uruguai'],[1919,'Brasil'],[1920,'Uruguai'],
 [1921,'Argentina'],[1922,'Brasil'],[1923,'Uruguai'],[1924,'Uruguai'],
 [1925,'Argentina'],[1926,'Uruguai'],[1927,'Argentina'],[1929,'Argentina'],
 [1935,'Uruguai'],[1937,'Argentina'],[1939,'Peru'],[1941,'Argentina'],
 [1942,'Uruguai'],[1945,'Argentina'],[1946,'Argentina'],[1947,'Argentina'],
 [1949,'Brasil'],[1953,'Paraguai'],[1955,'Argentina'],[1956,'Uruguai'],
 [1957,'Argentina'],[1959,'Argentina','1959-I'],[1959,'Uruguai','1959-II'],
 [1963,'Bolívia'],[1967,'Uruguai'],[1975,'Peru'],[1979,'Paraguai'],
 [1983,'Uruguai'],[1987,'Uruguai'],[1989,'Brasil'],[1991,'Argentina'],
 [1993,'Argentina'],[1995,'Uruguai'],[1997,'Brasil'],[1999,'Brasil'],
 [2001,'Colômbia'],[2004,'Brasil'],[2007,'Brasil'],[2011,'Uruguai'],
 [2015,'Chile'],[2016,'Chile'],[2019,'Brasil'],[2021,'Argentina'],
 [2024,'Argentina'],
 ],
 'Copa Africana de Nações': [
 [1957,'Egito'],[1959,'Egito'],[1962,'Etiópia'],[1963,'Gana'],
 [1965,'Gana'],[1968,'RD Congo'],[1970,'Sudão'],[1972,'Congo'],
 [1974,'RD Congo'],[1976,'Marrocos'],[1978,'Gana'],[1980,'Nigéria'],
 [1982,'Gana'],[1984,'Camarões'],[1986,'Egito'],[1988,'Camarões'],
 [1990,'Argélia'],[1992,'Costa do Marfim'],[1994,'Nigéria'],
 [1996,'África do Sul'],[1998,'Egito'],[2000,'Camarões'],[2002,'Camarões'],
 [2004,'Tunísia'],[2006,'Egito'],[2008,'Egito'],[2010,'Egito'],
 [2012,'Zâmbia'],[2013,'Nigéria'],[2015,'Costa do Marfim'],
 [2017,'Camarões'],[2019,'Argélia'],[2021,'Senegal'],
 [2023,'Costa do Marfim'],[2025,'Marrocos'],
 ],
 'Copa da Ásia': [
 [1956,'Coreia do Sul'],[1960,'Coreia do Sul'],[1964,'Israel'],
 [1968,'Irã'],[1972,'Irã'],[1976,'Irã'],[1980,'Kuwait'],
 [1984,'Arábia Saudita'],[1988,'Arábia Saudita'],[1992,'Japão'],
 [1996,'Arábia Saudita'],[2000,'Japão'],[2004,'Japão'],
 [2007,'Iraque'],[2011,'Japão'],[2015,'Austrália'],
 [2019,'Catar'],[2023,'Catar'],
 ],
 'Copa Ouro': [
 [1991,'Estados Unidos'],[1993,'México'],[1996,'México'],
 [1998,'México'],[2000,'Canadá'],[2002,'Estados Unidos'],
 [2003,'México'],[2005,'Estados Unidos'],[2007,'Estados Unidos'],
 [2009,'México'],[2011,'México'],[2013,'Estados Unidos'],
 [2015,'México'],[2017,'Estados Unidos'],[2019,'México'],
 [2021,'Estados Unidos'],[2023,'México'],[2025,'México'],
 ],
 'Copa das Nações da Oceania': [
 [1973,'Nova Zelândia'],[1980,'Austrália'],[1996,'Austrália'],
 [1998,'Nova Zelândia'],[2000,'Austrália'],[2002,'Nova Zelândia'],
 [2004,'Austrália'],[2008,'Nova Zelândia'],[2012,'Taiti'],
 [2016,'Nova Zelândia'],[2024,'Nova Zelândia'],
 ],
};
const normalizar=s=>String(s||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/gi,'').toLocaleLowerCase('pt-BR');
const nomesSelecao={
 'Alemanha Ocidental':'Alemanha','Alemanha Federal':'Alemanha',
 'German Federal Republic':'Alemanha','West Germany':'Alemanha',
 'Netherlands':'Holanda','Países Baixos':'Holanda',
 'South Korea':'Coreia do Sul','Korea Republic':'Coreia do Sul',
 'United States':'Estados Unidos','United States of America':'Estados Unidos',
 'USA':'Estados Unidos','México':'México','Mexico':'México',
 'Saudi Arabia':'Arábia Saudita','Côte d’Ivoire':'Costa do Marfim',
 'Ivory Coast':'Costa do Marfim','Zaire':'RD Congo',
 'Democratic Republic of Congo':'RD Congo',
 'Soviet Union':'União Soviética','USSR':'União Soviética',
 'Czechoslovakia':'Tchecoslováquia','Czech Republic':'República Tcheca',
 'Iran':'Irã','South Africa':'África do Sul',
 'Cameroon':'Camarões','Morocco':'Marrocos','Cape Verde':'Cabo Verde',
 'Spain':'Espanha','Brazil':'Brasil','Argentina':'Argentina',
 'France':'França','England':'Inglaterra','Italy':'Itália',
 'Uruguay':'Uruguai','Germany':'Alemanha','Portugal':'Portugal',
 'Qatar':'Catar',
};
const nomes=new Map(Object.values(COPAS).flat().map(([,pais])=>[normalizar(pais),pais]));
for(const [apelido,oficial] of Object.entries(nomesSelecao))nomes.set(normalizar(apelido),oficial);
export const nomeSelecaoHistorica=valor=>nomes.get(normalizar(valor))||String(valor||'');
export const competicoesHistoricasSelecoes=Object.freeze(Object.keys(COPAS));
export const HISTORICO_SELECOES=Object.freeze(Object.fromEntries(
 Object.entries(COPAS).map(([nome,edicoes])=>{
  const registros=edicoes.map(([ano,pais,edicao])=>{
   const campeao=Object.freeze({clube:pais,quantidade:1});
   return Object.freeze({
    ano,edicao:edicao||String(ano),campeoes:Object.freeze([campeao]),
    ...(nome==='Copa Africana de Nações'&&ano===2025
     ?{nota:'Vencedor reconhecido pela CAF; recurso do Senegal pendente no TAS.'}:{})
   });
  }).sort((a,b)=>b.ano-a.ano||b.edicao.localeCompare(a.edicao));
  return [nome,Object.freeze(registros)];
 })
));
export const edicoesHistoricasSelecao=competicao=>HISTORICO_SELECOES[competicao]||[];
export const totalTitulosHistoricosSelecao=(competicao,pais)=>
 edicoesHistoricasSelecao(competicao).reduce((total,e)=>
  total+e.campeoes.filter(x=>nomeSelecaoHistorica(x.clube)===nomeSelecaoHistorica(pais)).reduce((n,x)=>n+x.quantidade,0),0);
export const historicoDaSelecao=pais=>competicoesHistoricasSelecoes.flatMap(nome=>
 edicoesHistoricasSelecao(nome).filter(e=>e.campeoes.some(x=>nomeSelecaoHistorica(x.clube)===nomeSelecaoHistorica(pais)))
 .map(e=>({ano:e.ano,edicao:e.edicao,competicao:nome,campeao:nomeSelecaoHistorica(pais),historica:true}))
).sort((a,b)=>b.ano-a.ano||a.competicao.localeCompare(b.competicao,'pt-BR'));
