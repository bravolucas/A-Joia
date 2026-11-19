// Preços em milhares de euros, como o saldo e o salário do modo rápido.
// Itens da vida do atleta: rotina, recuperação, adaptação e família. Itens antigos sem relação
// com a profissão saem da vitrine (descontinuado), mas continuam com quem já os comprou.
const item=(id,nome,custo,foto,desc,extra={})=>({id,nome,custo,foto,categoria:'Vida pessoal',icone:'🏠',desc,...extra});
const fora=(id,nome,custo,foto,desc,extra={})=>item(id,nome,custo,foto,desc,{...extra,descontinuado:true});
const luxo=(id,nome,custo,foto,fama=1,fotoExtra=null)=>item(id,nome,custo,foto,`+${fama} de fama na compra. Manutenção anual de 6% do preço; pode gerar cobrança da torcida em clube pequeno.`,{categoria:'Estilo de vida',icone:'💎',luxo:true,fama,fotoExtra});
export const ITENS_PESSOAIS=[
 item('tenis-casual','Chuteira de treino nova',.15,5,'Um par extra para o dia a dia no CT. +1 de moral na compra.',{moral:1,categoria:'Treino',icone:'👟'}),
 item('kit-sono','Rotina de sono de atleta',3,5,'Colchão adequado, quarto escuro e monitor de sono. Risco de lesão 3% menor.',{lesaoMult:.97,categoria:'Saúde',icone:'😴'}),
 item('recuperacao-casa','Recuperação em casa',25,5,'Botas de compressão e banheira de gelo após os jogos. Risco de lesão 5% menor.',{lesaoMult:.95,categoria:'Saúde',icone:'🧊'}),
 item('chef-particular','Chef com cardápio de atleta',80,5,'Alimentação planejada o ano todo. Declínio físico 5% mais lento.',{declinio:.95,categoria:'Saúde',icone:'🥗'}),
 item('academia-casa','Academia em casa',45,5,'Treino complementar sem depender do CT. Evolução 2% mais rápida.',{evolucao:1.02,categoria:'Treino',icone:'🏋️'}),
 item('curso-idioma-pessoal','Curso de idioma',.9,5,'Aulas do idioma local. Reduz em 50% a queda de rendimento da primeira temporada num clube de outro país. +2 de moral.',{moral:2,adaptacao:.5,categoria:'Adaptação',icone:'🗣️'}),
 item('consultoria-adaptacao','Consultoria de adaptação cultural',40,5,'Moradia, documentos, escola e rotina resolvidos ao chegar. Reduz em 30% a queda de rendimento no primeiro ano fora do país.',{adaptacao:.3,categoria:'Adaptação',icone:'🧭'}),
 item('familia-perto','Família morando perto',120,0,'Passagens e moradia para os seus. Reduz em 30% a queda do primeiro ano fora e dá +3 de moral.',{moral:3,adaptacao:.3,categoria:'Adaptação',icone:'👨‍👩‍👧'}),
 item('carro-popular','Primeiro carro',18,1,'Para ir ao CT sem depender de ninguém. +3 de moral na compra.',{moral:3,fotoExtra:0}),
 item('viagem-familia','Férias com a família',3,0,'Descanso de verdade entre temporadas. +4 de moral na compra.',{moral:4}),
 item('colecao-camisas','Coleção pessoal de camisas',2.5,3,'Camisas trocadas com adversários e da sua carreira. +2 de moral na compra.',{moral:2}),
 item('studio-pessoal','Seu primeiro apartamento',160,0,'A chave de um lugar só seu perto do clube. +4 de moral na compra.',{moral:4}),
 item('casa-familia','Uma casa para a família',300,0,'Retribua a quem começou ao seu lado. +5 de moral na compra.',{moral:5}),
 item('sala-cinema','Sala de cinema em casa',35,0,'Conforto para descansar entre jogos. +3 de moral na compra.',{moral:3}),
 fora('mala-viagem','Mala para a primeira viagem',.2,3,'Sua parceira nas concentrações. +1 de moral na compra.',{moral:1}),
 fora('bicicleta-pessoal','Bicicleta para a cidade',.6,5,'Liberdade fora do CT. +2 de moral na compra.',{moral:2,fotoExtra:1}),
 fora('roupas-pessoais','Um novo guarda-roupa',.5,3,'Sua identidade fora de campo. +1 de fama na compra.',{fama:1}),
 fora('fone-pessoal','Fones para a concentração',.25,5,'Sua música antes dos jogos. +2 de moral na compra.',{moral:2}),
 fora('celular-pessoal','Celular novo',.8,5,'Uma ligação para quem torce por você. +1 de moral na compra.',{moral:1}),
 fora('videogame-pessoal','Videogame com os amigos',.65,5,'Uma pausa na rotina. +3 de moral na compra.',{moral:3}),
 fora('notebook-pessoal','Notebook pessoal',1.3,5,'Estudo, filmes e conversa com a família. +2 de moral na compra.',{moral:2}),
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
