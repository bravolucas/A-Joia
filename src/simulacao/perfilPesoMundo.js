/**
 * Auditoria somente leitura da composição JSON do estado mundial.
 * Mede bytes UTF-8 realmente serializados, inclusive nomes de propriedades.
 * Não altera o formato do save nem remove históricos.
 */
const medir = valor => Buffer.byteLength(valor, 'utf8');
const HISTORICOS = new Set([
  'historicoTemporadas', 'movimentos', 'premiacoesIndividuais',
  'titulosConquistados', 'porCompeticao', 'carreira',
]);

export function perfilPesoMundo(mundo) {
  if (!mundo || typeof mundo !== 'object' || Array.isArray(mundo) || !Array.isArray(mundo.jogadores)) {
    throw new TypeError('Esperado estado mundial com array jogadores.');
  }
  const inicio = performance.now();
  const json = JSON.stringify(mundo);
  if (typeof json !== 'string') throw new TypeError('Estado não serializável.');
  const totalBytes = medir(json);
  const serie = {ativos:{quantidade:0,bytes:0},aposentados:{quantidade:0,bytes:0}};
  const camposAtletas = Object.fromEntries([...HISTORICOS,'outrosCampos'].map(k=>[k,0]));
  let jogadoresBytes = 2, primeiroJogador = true;
  for (const jogador of mundo.jogadores) {
    const texto = JSON.stringify(jogador);
    if (texto === undefined) throw new TypeError('Jogador não serializável em JSON.');
    const tamanho = medir(texto);
    const grupo = jogador?.aposentado ? serie.aposentados : serie.ativos;
    grupo.quantidade++;
    grupo.bytes += tamanho + (primeiroJogador ? 0 : 1);
    jogadoresBytes += tamanho + (primeiroJogador ? 0 : 1);
    primeiroJogador = false;
    let subpartes = 0;
    if (jogador && typeof jogador === 'object' && !Array.isArray(jogador)) {
      for (const chave of HISTORICOS) {
        const valor = JSON.stringify(jogador[chave]);
        if (valor === undefined) continue;
        const bytes = medir(JSON.stringify(chave) + ':' + valor);
        camposAtletas[chave] += bytes;
        subpartes += bytes;
      }
    }
    camposAtletas.outrosCampos += tamanho - subpartes;
  }
  const estruturaJogadoresBytes = jogadoresBytes - serie.ativos.bytes - serie.aposentados.bytes;
  const outrosCamposBytes = totalBytes - jogadoresBytes;
  const propriedadesMundo = Object.entries(mundo).filter(([chave])=>chave!=='jogadores')
    .map(([chave,valor])=>{
      const serializado=JSON.stringify(valor);
      return {campo:chave,bytes:serializado===undefined?0:medir(JSON.stringify(chave)+':'+serializado)};
    }).filter(p=>p.bytes>0).sort((a,b)=>b.bytes-a.bytes);
  return {
    totalBytes,
    jogadores:{totalBytes:jogadoresBytes,...serie,estruturaBytes:estruturaJogadoresBytes,campos:camposAtletas},
    outrosCamposMundo:{totalBytes:outrosCamposBytes,propriedades:propriedadesMundo},
    tempoMedicaoMs:+(performance.now()-inicio).toFixed(2),
    observacoes:[
      'Tamanho medido é JSON UTF-8 do motor, não tamanho efetivo da gravação IndexedDB.',
      'Contagens de campos são projeções por propriedade e incluem sua chave, mas não vírgulas; outrosCampos absorve o restante.',
      'A parcela outrosCamposMundo inclui as chaves e delimitadores da raiz, além de todos os campos externos a jogadores.',
    ],
  };
}
