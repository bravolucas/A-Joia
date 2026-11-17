# Issue #84 — metadados verificados de jogadores reais (lote 1)

## Por que esta correção existe
O cadastro inicial de `JOGADORES_REAIS_BASE` tem 1.775 atletas de 66 clubes. Para atletas reais sem idade explícita, o motor sorteava 18–33 anos, inclusive para veteranos conhecidos; a ausência de `nac` fazia o jogo atribuir uma seleção conforme a liga, não conforme o atleta.

## Entrega incremental (18 jogadores)
O arquivo `src/dados/metadadosAtletasReais.js` acrescenta uma relação explícita, por **nome completo do cadastro + clube**, de 18 identidades verificadas: Messi, Cristiano Ronaldo, Neymar, Mbappé, Haaland, Salah, Kane, Bellingham, Yamal, Modrić, De Bruyne, Courtois, Valverde, Raphinha, Musiala, Bruno Fernandes, Lewandowski e Saka.

A idade parte da data de nascimento e do calendário da primeira temporada da carreira (`ANO_INICIO = 2026`, referência **01/07/2026**); não depende de seed. A seleção também deixa de ser sorteada para esses atletas.

O motor mantém o mesmo número e a mesma ordem de chamadas ao RNG no ramo de jogadores reais para reduzir o impacto na geração de outros atletas, preservando os cadastros e as funções de geração procedural.

**Limitação declarada:** os demais 1.757 atletas ainda não foram enriquecidos. Para eles, o código mantém temporariamente o comportamento legado (idade aleatória e, quando sem `nac`, nacionalidade baseada na liga). Não confundir a implementação incremental com uma correção completa da issue. Estender a base com evidências verificáveis, sem copiar atributos inventados nem atribuir dados de homônimos.

## Fontes usadas na primeira verificação
- UEFA — perfis oficiais de jogadores e informação de torneios: https://www.uefa.com/uefachampionsleague/clubs/players/ ; https://www.uefa.com/news-media/mediaservices/informationkits/
- UEFA — Messi, Ronaldo, Neymar, Mbappé e Haaland: https://www.uefa.com/uefachampionsleague/news/ 
- UEFA — Kane, Haaland, Salah e De Bruyne: https://www.uefa.com/uefachampionsleague/clubs/players/
- UEFA — Bellingham, Modrić, Courtois e Valverde: https://www.uefa.com/news-media/mediaservices/informationkits/
- FC Barcelona — ficha oficial de Yamal/Raphinha: https://www.fcbarcelona.com/en/football/first-team/players
- Manchester United — Bruno Fernandes: https://www.manutd.com/en/teams/mens-team/bruno-fernandes

## Compatibilidade e regressões
- A alteração se limita à construção de **carreiras novas**. Não migra nem reescreve jogadores, títulos ou histórico de saves antigos.
- Chave exata `nome+clube` evita que homônimos de clubes diferentes compartilhem nacionalidade ou idade.
- `jr.nac` explícito no cadastro base permanece prioritário.
- Testes `tests/metadados-atletas-reais.test.mjs` validam entradas reais, códigos de seleção, datas, determinismo e ausência de alteração do catálogo.

## Itens pendentes da issue #84
1. Enriquecer os dados da maioria dos atletas (início por clubes inteiros, com fontes confiáveis).
2. Remover de forma segura a nacionalidade inventada a partir da liga quando o dado ainda estiver ausente.
3. Conferir duplas de mesmo nome, atletas transferidos e jogadores que não estejam mais no clube do cadastro histórico.
4. Manter os testes integrais de simulação e navegador aprovados antes de integrar à `main`.
