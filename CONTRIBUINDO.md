# Como mexer no projeto

## Onde fica cada coisa

Quer mudar | Vá em
--- | ---
Clubes, ligas, jogadores, itens da loja | `src/dados/data.js`
Como a temporada é simulada | `src/comum/lib.js` (`simularTemporada`)
Regras de mercado e transferências | `src/comum/lib.js` (`scoreInteresseClube`, `valorDeMercado`)
Mundo de jogadores rivais | `src/comum/lib.js` (`gerarMundoJogadores`, `simularTemporadaMundo`)
Lesões e desgaste | `src/comum/lib.js` (`TIPOS_LESAO`, `sortearLesao`)
Minigames (pênalti, falta, passe) | `src/comum/components.jsx` e `src/jogador/LancesCriativos.jsx`
Carreira do jogador (modo principal) | `src/jogador/ModoRapido.jsx` (telas) e `src/jogador/rapido.js` (regras)
Carreira de treinador | `src/treinador/`
Modo Carreira completo (jogo a jogo) | `src/completo/AJoiaGame.jsx`
Cores, fontes e layout responsivo | `src/index.css` e os `.css` ao lado de cada tela

## Adicionando um clube

Em `src/dados/data.js`, no array `CLUBES`:

```js
{ nome: "Nome do Clube", forca: 75, liga: "brasileirao", estado: "SP", cor: "#FF0000" }
```

`forca` vai de ~45 (times pequenos) a ~95 (gigantes europeus) e define nível do elenco,
salários e dificuldade das competições.

## Testando antes de commitar

```bash
npm test
npm run build
```

Se os testes passarem e compilar sem erro, a sintaxe e os imports estão certos. Vale abrir com `npm run dev`
e jogar uma temporada inteira, porque erro de lógica só aparece rodando.

## Um aviso sobre escopo

O erro mais chato que já apareceu nesse projeto foi uma variável usada numa função
e declarada em outra. Isso **passa na compilação** e só quebra quando o trecho executa.
Se algo travar de repente, abra o console do navegador (F12) — o erro costuma estar lá.
