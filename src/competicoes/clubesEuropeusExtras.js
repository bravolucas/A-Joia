/** Real clubs from leagues outside the playable catalog; strength is a game estimate. */
const paises=[
 ['Bélgica',78,'Club Brugge','Anderlecht','Gent'],['Áustria',76,'Red Bull Salzburg','Sturm Graz','Rapid Viena'],['Suíça',75,'Young Boys','Basel','Lugano'],['Escócia',77,'Celtic','Rangers','Hearts'],['Grécia',77,'Olympiacos','PAOK','AEK Atenas'],['Dinamarca',75,'Copenhagen','Midtjylland','Brondby'],['Noruega',74,'Bodø/Glimt','Molde','Rosenborg'],['Suécia',72,'Malmö','Elfsborg','Djurgården'],['República Tcheca',76,'Slavia Praga','Sparta Praga','Viktoria Plzen'],['Polônia',70,'Lech Poznan','Legia Varsóvia','Raków'],['Croácia',74,'Dinamo Zagreb','Hajduk Split','Rijeka'],['Sérvia',73,'Estrela Vermelha','Partizan','Vojvodina'],['Romênia',69,'FCSB','CFR Cluj','Universitatea Craiova'],['Bulgária',68,'Ludogorets','Levski Sofia','CSKA Sofia'],['Ucrânia',74,'Shakhtar Donetsk','Dynamo Kyiv','Polissya'],['Hungria',69,'Ferencváros','Paks','Puskás Akadémia'],['Eslováquia',66,'Slovan Bratislava','Spartak Trnava','DAC Dunajska Streda'],['Eslovênia',65,'Olimpija Ljubljana','Maribor','Celje'],['Chipre',67,'Pafos','APOEL','Omonia'],['Israel',70,'Maccabi Tel Aviv','Maccabi Haifa','Hapoel Beer Sheva'],['Bósnia',63,'Zrinjski Mostar','Borac Banja Luka','Sarajevo'],['Azerbaijão',67,'Qarabag','Zira','Neftchi Baku'],['Armênia',61,'Noah','Pyunik','Ararat-Armenia'],['Geórgia',60,'Dinamo Tbilisi','Dila Gori','Iberia 1999'],['Moldávia',60,'Sheriff Tiraspol','Petrocub','Zimbru'],['Cazaquistão',62,'Kairat','Astana','Tobol'],['Finlândia',61,'HJK Helsinki','KuPS','Ilves'],['Islândia',59,'Vikingur Reykjavik','Breidablik','Valur'],['Irlanda',60,'Shamrock Rovers','St Patrick’s Athletic','Derry City'],['Irlanda do Norte',55,'Linfield','Larne','Glentoran'],['País de Gales',54,'The New Saints','Connah’s Quay','Bala Town'],['Luxemburgo',54,'Differdange','Dudelange','Progrès Niederkorn'],['Letônia',58,'RFS','Riga','Liepaja'],['Lituânia',56,'Zalgiris Vilnius','Panevezys','Suduva'],['Estônia',54,'Levadia Tallinn','Flora Tallinn','Paide'],['Albânia',57,'Egnatia','Partizani Tirana','Tirana'],['Kosovo',57,'Drita','Ballkani','Prishtina'],['Macedônia do Norte',56,'Shkendija','Vardar','Rabotnicki'],
];
const base=paises.flatMap(([pais,forca,...nomes])=>nomes.map((nome,i)=>({nome,pais,forca:forca-i*3,elenco:forca-i*3,liga:'europa-extra',extra:true,competicaoInternacional:['champions','europa','conference'][i]})));

const tradicionais=[
 ['Bélgica',74,'Royal Antwerp','Genk','Union Saint-Gilloise','Standard Liège'],
 ['Áustria',70,'Austria Viena','LASK'],['Suíça',70,'Servette','FC Zürich','Grasshopper'],
 ['Escócia',67,'Aberdeen','Hibernian','Dundee United'],['Grécia',75,'Panathinaikos','Aris Thessaloniki'],
 ['Dinamarca',67,'Nordsjaelland','Aarhus'],['Noruega',66,'Brann','Viking'],['Suécia',65,'IFK Göteborg','AIK','Hammarby'],
 ['República Tcheca',67,'Baník Ostrava','Sigma Olomouc'],['Polônia',66,'Jagiellonia Bialystok','Wisla Kraków'],
 ['Croácia',66,'Osijek'],['Sérvia',64,'TSC Backa Topola'],['Romênia',65,'Dinamo Bucareste','Rapid Bucareste'],
 ['Ucrânia',67,'Zorya Luhansk'],['Hungria',63,'Újpest'],['Eslováquia',62,'Zilina'],
 ['Eslovênia',61,'Koper'],['Chipre',65,'AEK Larnaca','Apollon Limassol'],['Bósnia',61,'Zeljeznicar'],
 ['Bielorrússia',62,'BATE Borisov','Dinamo Minsk'],['Moldávia',59,'Dacia Buiucani'],['Finlândia',59,'Inter Turku'],
 ['Irlanda',59,'Bohemians'],['Malta',54,'Floriana','Hibernians Malta','Valletta'],
 ['Montenegro',57,'Buducnost Podgorica','Sutjeska','Decic'],['Albânia',57,'Skenderbeu'],
];
export const CLUBES_EUROPEUS_EXTRAS=[...base.map(c=>({...c,naoJogavel:true})),...tradicionais.flatMap(([pais,forca,...nomes])=>nomes.map((nome,i)=>({nome,pais,forca:forca-i,elenco:forca-i,liga:'europa-extra',extra:true,naoJogavel:true,competicaoInternacional:['champions','europa','conference'][i%3]})))];
