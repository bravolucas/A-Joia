# Escalação posicional do treinador

A prévia inicial do PR #115 distribui por grandes setores (GOL/DEF/MEI/ATA). Esta etapa adicional oferece um núcleo puro que seleciona **onze vagas com posições exatas**, sem adaptar zagueiros para laterais arbitrariamente nem confundir ponta com centroavante.

## Esquemas
- **4-3-3:** usa exatamente a sequência de `FORMACAO_433` existente no Modo Jogador: GOL, LD, ZAG, ZAG, LE, VOL, MC, MEI, PD, ATA, PE.
- **4-4-2 (meio em losango):** GOL, LD, ZAG, ZAG, LE, VOL, MC, MC, MEI, ATA, ATA.
- **3-5-2:** GOL, ZAG, ZAG, ZAG, VOL, VOL, MC, MC, MEI, ATA, ATA.

Os 11 slots de cada esquema têm os mesmos totais por setor que os pesos de `FORMACOES_TECNICO`.

## Regras
`escalarOnzePosicionalTecnico(elenco,formacao)` é uma função de leitura que usa o matching `escalarVagasAptas`, já integrado ao repositório. Sem explicitação de `apto:true` não há posição secundária válida. A função não improvisa atletas, não acrescenta jogadores ao mundo, não atualiza o banco e não modifica o OVR. Suspensos, lesionados, aposentados ou indisponíveis não participam. Identidades repetidas são descartadas; o banco tem no máximo sete nomes e prioriza um goleiro reserva.

Vagas sem cobertura retornam `jogador:null`, nunca um avatar fictício. Saves legados com só o setor e sem posição não recebem uma posição técnica inventada.

## Limites e integração
O PR introduz **apenas o modelo de escalação posicional com testes**, para posterior integração à interface do PR #115 e ao motor de partidas do PR #114. Não afirma que a tela do usuário já usa as onze posições exatas. Não implementa substituições, desgaste por rodada nem a escalação histórica de partidas anteriores.

A issue #110 continua aberta até a ligação do motor, do painel e dos saves à definição posicional. A integração de novos componentes exige os seis testes gerais, auditoria dedicada e CI da main aprovada.
