# Como mexer no projeto

## Onde fica cada coisa

Quer mudar | Vá em
--- | ---
Clubes, ligas, jogadores, itens da loja | `src/data.js`
Como a temporada é simulada | `src/lib.js` (`simularTemporada`)
Regras de mercado e transferências | `src/lib.js` (`scoreInteresseClube`, `valorDeMercado`)
Mundo de jogadores rivais | `src/lib.js` (`gerarMundoJogadores`, `simularTemporadaMundo`)
Lesões e desgaste | `src/lib.js` (`TIPOS_LESAO`, `sortearLesao`)
Minigames (pênalti, falta, passe) | `src/components.jsx`
Telas, abas e popups | `src/AJoiaGame.jsx`
Cores, fontes e layout responsivo | bloco `<style>` dentro de `AJoiaGame.jsx`

## Adicionando um clube

Em `src/data.js`, no array `CLUBES`:

```js
{ nome: "Nome do Clube", forca: 75, liga: "brasileirao", estado: "SP", cor: "#FF0000" }
```

`forca` vai de ~45 (times pequenos) a ~95 (gigantes europeus) e define nível do elenco,
salários e dificuldade das competições.

## Testando antes de commitar

```bash
npm run build
```

Se compilar sem erro, a sintaxe e os imports estão certos. Vale abrir com `npm run dev`
e jogar uma temporada inteira, porque erro de lógica só aparece rodando.

## Um aviso sobre escopo

O erro mais chato que já apareceu nesse projeto foi uma variável usada numa função
e declarada em outra. Isso **passa na compilação** e só quebra quando o trecho executa.
Se algo travar de repente, abra o console do navegador (F12) — o erro costuma estar lá.
