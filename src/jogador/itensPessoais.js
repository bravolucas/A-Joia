// Preços em milhares de euros, como o saldo e o salário do modo rápido.
const item=(id,nome,custo,foto,desc,extra={})=>({id,nome,custo,foto,categoria:'Pessoal',icone:'🎒',desc,...extra});
const luxo=(id,nome,custo,foto,fama=1,fotoExtra=null)=>item(id,nome,custo,foto,`+${fama} de fama na compra. Manutenção anual de 6% do preço; pode gerar cobrança da torcida.`,{categoria:'Estilo de vida',icone:'💎',luxo:true,fama,fotoExtra});
export const ITENS_PESSOAIS=[
 item('tenis-casual','Seu primeiro tênis especial',.15,5,'Uma conquista pequena para guardar. +1 de moral na compra.',{moral:1}),
 item('mala-viagem','Mala para a primeira viagem',.2,3,'Sua parceira nas concentrações. +1 de moral na compra.',{moral:1}),
 item('bicicleta-pessoal','Bicicleta para a cidade',.6,5,'Liberdade fora do CT. +2 de moral na compra.',{moral:2,fotoExtra:1}),
 item('roupas-pessoais','Um novo guarda-roupa',.5,3,'Sua identidade fora de campo. +1 de fama na compra.',{fama:1}),
 item('fone-pessoal','Fones para a concentração',.25,5,'Sua música antes dos jogos. +2 de moral na compra.',{moral:2}),
 item('celular-pessoal','Celular novo',.8,5,'Uma ligação para quem torce por você. +1 de moral na compra.',{moral:1}),
 item('videogame-pessoal','Videogame com os amigos',.65,5,'Uma pausa na rotina. +3 de moral na compra.',{moral:3}),
 item('notebook-pessoal','Notebook pessoal',1.3,5,'Estudo, filmes e conversa com a família. +2 de moral na compra.',{moral:2}),
 item('curso-idioma-pessoal','Curso de idioma',.9,5,'Um objetivo fora das quatro linhas. +2 de moral; não elimina sozinho a adaptação de clube.',{moral:2}),
 item('carro-popular','Primeiro carro',18,1,'Mobilidade sem ostentação. +3 de moral na compra.',{moral:3,fotoExtra:0}),
 item('viagem-familia','Férias com a família',3,0,'Um capítulo fora do estádio. +4 de moral na compra.',{moral:4}),
 item('colecao-camisas','Coleção pessoal de camisas',2.5,3,'Um canto para suas lembranças. +2 de moral na compra.',{moral:2}),
 item('studio-pessoal','Seu primeiro apartamento',160,0,'A chave de um lugar só seu. +4 de moral na compra.',{moral:4}),
 item('casa-familia','Uma casa para a família',300,0,'Retribua a quem começou ao seu lado. +5 de moral na compra.',{moral:5}),
 item('sala-cinema','Sala de cinema em casa',35,0,'Conforto entre temporadas. +3 de moral na compra.',{moral:3}),
 luxo('relogio-luxo','Relógio de coleção',450,3,1),
 luxo('carro-luxo','Esportivo dos sonhos',1200,1,2),
 luxo('roupas-grife','Coleção de alta-costura',700,3,1),
 luxo('casa-praia','Casa de praia',3000,2,2),
 luxo('cobertura-luxo','Cobertura com vista',6000,2,3),
 luxo('garagem-luxo','Garagem de colecionador',12000,1,3),
 luxo('helicoptero-luxo','Helicóptero particular',18000,4,3,2),
 luxo('ilha-luxo','Refúgio à beira-mar',35000,4,4),
 luxo('jato-luxo','Jato executivo',60000,4,4,3),
];
