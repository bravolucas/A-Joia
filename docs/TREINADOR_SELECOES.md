# Treinador: clubes e seleções

Implementação de novembro de 2026, baseada na versão atualizada do GitHub (`3db6e9a`).

## Emprego e ofertas

- Um único vínculo: clube **ou** seleção. O nome da equipe permanece no campo legado `clube`, acompanhado de `tipoEquipe` e, nas seleções, `selecao` (código do país). Isso conserva compatibilidade com salário, loja, histórico e saves existentes.
- As seleções aparecem nos mesmos cartões do mercado, com país, confederação, força, salário e indicação de vínculo exclusivo. Aceitar encerra o emprego anterior; não existe retorno automático ao clube.
- Seleções de diferentes nacionalidades podem contratar o técnico em qualquer ano. Exigência mínima: duas temporadas, OVR 48 e reputação 38. A força fica até OVR +17; seleções de força 85 ou mais exigem OVR 70. Reputação também precisa atender à exigência da federação.
- Até três ofertas de clubes e duas de seleções. Sorteio ponderado sem reposição, com penalização para clubes oferecidos recentemente e preferência por ligas diferentes. Os limites esportivos continuam valendo, inclusive quando o técnico vem de uma seleção.
- No início, clubes até OVR +18 e exigência até reputação +8. Exceção de ídolo máximo: carinho da torcida de pelo menos 90, quatro temporadas e dois títulos naquele clube. Clubes grandes mantêm o contrato de um ano para esse ídolo estreante. A validação também ocorre ao aceitar, não só na apresentação.

## Calendário rápido internacional

Uma única decisão de preparação, com convocação, renovação, entrosamento, observação e liderança, além de preparação de bola parada/recuperação. Não há compras e vendas de atletas da seleção.

- Eliminatórias em anos sem Copa: grupo resumido de quatro seleções da mesma confederação, ida e volta, duas vagas. O último fechamento antes da Copa determina a vaga. Não há uma tabela acumulada de três anos.
- Copa do Mundo em anos com resto 2 na divisão por quatro, condicionada à vaga. Ao assumir uma seleção nesse ano, herda-se um resultado de eliminatórias reproduzível daquele país; a oferta informa se existe vaga. Uma eliminação já registrada não é substituída.
- Eurocopa, Copa América e Copa das Nações da Oceania: ciclo de quatro anos com resto 0. Copa da Ásia: resto 3. Copa Africana e Copa Ouro: anos ímpares.
- Continentais: mata-mata resumido de oito equipes (quatro na Oceania), com países da própria confederação. Copa do Mundo reaproveita o modelo do jogo: grupo de quatro e mata-mata até a final.
- Sem vaga ou torneio no ano: amistosos de preparação, sem título inventado.
- As finais continuam usando as decisões e animações existentes. O resultado corrigido preserva os jogos da fase de grupos e atualiza os totais da seleção.

**Estes são formatos adaptados ao modo rápido**, não reproduções integrais dos regulamentos oficiais ou do calendário FIFA. O resumo da temporada informa essa adaptação.

## Taças e saves

O título consulta a seleção registrada no torneio, sem inferir o país pela nacionalidade do treinador. Isso corrige pop-up, vitrine, histórico profissional e museu, inclusive em saves antigos que anexaram a Copa a uma temporada de clube. A contagem é preservada; clube e seleção recebem somente as respectivas taças.

O museu atualiza a identificação da fonte já existente, sem duplicar a quantidade. Ofertas antigas são atualizadas uma única vez (versão 3). A escolha inicial ainda não confirmada é recalculada segundo os novos limites; trabalhos já iniciados são preservados. Convites antigos ainda abertos têm uma resposta compatível com vínculo exclusivo.

## Validação

Testes em `tests/selecoes-tecnico.test.mjs` e `tests/selecoes-tecnico.spec.mjs`: seis confederações; classificação/eliminação; mudança clube–seleção–clube; salário; preparação; final persistida; museu antigo; início por nível/ídolo; diversidade de clubes; oferta e pop-up em 390 e 1440 px. Testes existentes do treinador foram ajustados quando pressupunham a regra antiga de acumular seleção e clube ou de começar automaticamente no último clube do jogador.

Validação final: **296 testes de lógica**; **39 cenários direcionados de navegador** localmente; **180 cenários de navegador no CI**, todos aprovados. Publicação confirmada no commit `073a713`, [GitHub Pages](https://github.com/bravolucas/A-Joia/actions/runs/42492686184) e [validação geral](https://github.com/bravolucas/A-Joia/actions/runs/42492686115). A dependência de URL base dos testes novos foi corrigida após a primeira execução no CI, sem alteração adicional no jogo.
