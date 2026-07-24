# 🌐 Como publicar o jogo com um link

## Passo 1 — Deixe o repositório público

No repositório: **Settings** → role até o fim → **Change visibility** → **Make public**.

Sem isso o GitHub Pages não funciona no plano gratuito.

## Passo 2 — Suba os arquivos novos

Você precisa subir dois arquivos que não existiam antes:

- `vite.config.js` (substitui o antigo)
- `.github/workflows/deploy.yml` (arquivo novo, dentro de pastas novas)

⚠️ **Atenção:** arrastar pastas que começam com ponto (`.github`) pelo site do GitHub
às vezes não funciona. Se der problema, faça assim pelo site:

1. Clique em **Add file** → **Create new file**
2. No campo do nome, digite exatamente: `.github/workflows/deploy.yml`
   (o GitHub cria as pastas sozinho conforme você digita as barras)
3. Cole o conteúdo do arquivo `deploy.yml` que está no projeto
4. Clique em **Commit changes**

## Passo 3 — Ligue o GitHub Pages

No repositório: **Settings** → menu lateral **Pages** → em **Source**, escolha
**GitHub Actions**.

## Passo 4 — Espere a mágica

Vá na aba **Actions** do repositório. Você vai ver a tarefa "Publicar no GitHub Pages" rodando.
Leva uns 2 minutos. Quando ficar verde ✅, seu jogo está no ar em:

```
https://bravolucas.github.io/A-Joia/
```

Esse é o link que você pode mandar pra qualquer pessoa.

## Daqui pra frente

Toda vez que você subir uma mudança pro GitHub, o site se atualiza sozinho em ~2 minutos.

---

## Se o repositório tiver outro nome

Abra o `vite.config.js` e troque `/A-Joia/` pelo nome certo, respeitando maiúsculas e minúsculas.

## Se a página abrir em branco

Quase sempre é o nome do repositório diferente do que está no `vite.config.js`.
Abra o console do navegador (F12) — se aparecer erro 404 procurando arquivos, é isso.
