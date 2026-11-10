# Mais adversários internacionais

106 clubes reais adicionados como adversários: 58 sul-americanos e 48 europeus. O catálogo europeu extra passa de 114 para 162 clubes. Eles não entram na seleção de carreira, mercado, propostas ou copas nacionais.

Os oito países sul-americanos vizinhos agora têm classificação simulada separada, com entradas de Libertadores e Sul-Americana, em vez de disputar entre si cinco vagas de uma liga genérica. O catálogo europeu também varia por edição. Força e variação anual determinística participam dessa classificação: o save não muda o sorteio ao recarregar, o mesmo clube não recebe dois continentais na mesma edição e os favoritos seguem favorecidos. As vagas destes adversários são uma aproximação do universo do jogo, sem representar uma lista oficial fixa de classificados de 2026.

A fonte compartilhada atende campanhas interativas de jogador/treinador, simulação automática do treinador, momentos resumidos, modo completo e campeões do mundo histórico. O modo completo consulta a força cadastrada do adversário extra. Campanhas já sorteadas conservam seus participantes e resultados; o catálogo ampliado entra nas novas campanhas.

Referências para presença continental e diversidade de países: [manual CONMEBOL Libertadores 2026](https://cdn.conmebol.com/wp-content/uploads/2025/12/Manual-de-Clubes-CONMEBOL-Libertadores-2026-ESP.pdf), [grupos de 2026 — AFA](https://www.afa.com.ar/11190/posts/asi-quedaron-los-grupos-de-la-copa-libertadores-2026). Níveis de força são estimativas do jogo.

## Sul-americanos adicionados
- **Bolívia:** Bolívar, The Strongest, Always Ready, Jorge Wilstermann, Blooming, Oriente Petrolero, Nacional Potosí, Aurora.
- **Peru:** Universitario de Deportes, Alianza Lima, Sporting Cristal, Melgar, Cienciano, Cusco FC, Sport Huancayo, Deportivo Garcilaso.
- **Venezuela:** Deportivo Táchira, Caracas, Carabobo, Deportivo La Guaira, Monagas, Metropolitanos, Zamora, Universidad Central de Venezuela.
- **Uruguai:** Defensor Sporting, Danubio, Liverpool de Montevidéu, Montevideo Wanderers, Racing de Montevidéu, Cerro Largo.
- **Paraguai:** Libertad, Guaraní, Nacional de Asunción, Sportivo Luqueño, Sportivo Ameliano, Guairena.
- **Equador:** Emelec, El Nacional, Aucas, Universidad Católica de Quito, Deportivo Cuenca, Mushuc Runa.
- **Chile:** Palestino, Unión Española, Huachipato, Cobresal, Audax Italiano, Everton de Viña del Mar, Coquimbo Unido, Cobreloa.
- **Colômbia:** América de Cali, Deportivo Cali, Once Caldas, Independiente Medellín, Independiente Santa Fe, Deportes Tolima, Deportivo Pereira, Atlético Bucaramanga.

## Europeus adicionados

- **Bélgica:** Royal Antwerp, Genk, Union Saint-Gilloise, Standard Liège.
- **Áustria:** Austria Viena, LASK.
- **Suíça:** Servette, FC Zürich, Grasshopper.
- **Escócia:** Aberdeen, Hibernian, Dundee United.
- **Grécia:** Panathinaikos, Aris Thessaloniki.
- **Dinamarca:** Nordsjaelland, Aarhus.
- **Noruega:** Brann, Viking.
- **Suécia:** IFK Göteborg, AIK, Hammarby.
- **República Tcheca:** Baník Ostrava, Sigma Olomouc.
- **Polônia:** Jagiellonia Bialystok, Wisla Kraków.
- **Croácia:** Osijek.
- **Sérvia:** TSC Backa Topola.
- **Romênia:** Dinamo Bucareste, Rapid Bucareste.
- **Ucrânia:** Zorya Luhansk.
- **Hungria:** Újpest.
- **Eslováquia:** Zilina.
- **Eslovênia:** Koper.
- **Chipre:** AEK Larnaca, Apollon Limassol.
- **Bósnia:** Zeljeznicar.
- **Bielorrússia:** BATE Borisov, Dinamo Minsk.
- **Moldávia:** Dacia Buiucani.
- **Finlândia:** Inter Turku.
- **Irlanda:** Bohemians.
- **Malta:** Floriana, Hibernians Malta, Valletta.
- **Montenegro:** Buducnost Podgorica, Sutjeska, Decic.
- **Albânia:** Skenderbeu.

## Validação

Testes de catálogo, elegibilidade, países, rotação anual, deduplicação, campanhas de jogador/treinador, força do adversário no modo completo, progressão de dificuldade, interface e retomada. Validação integral do commit `ffd85b3`: **454 testes de lógica e 336 testes no navegador aprovados**, além do build de produção. [GitHub Actions](https://github.com/bravolucas/A-Joia/actions/runs/42868077049) e [publicação no GitHub Pages](https://github.com/bravolucas/A-Joia/actions/runs/42868076966) concluídos com sucesso.

Conferência pública em https://bravolucas.github.io/A-Joia/: JavaScript principal, CSS e módulo completo idênticos aos arquivos do build testado. Os 278 novos escudos estão no catálogo publicado (250 arquivos com URL própria HTTP 200 e 28 incorporados ao código); as 70 imagens do museu e miniaturas também retornaram HTTP 200.
