/**
 * Inventário central de entidades históricas do jogo.
 * Importa as mesmas fontes de clubes e seleções usadas pela simulação;
 * nunca assume que um clube sem ficha tenha "zero" recordes.
 */
import {CLUBES,NACIONALIDADES} from './data.js';
import {CLUBES_REGIONAIS_EXTRAS} from '../competicoes/estaduaisRapidos.js';
import {CLUBES_EUROPEUS_EXTRAS} from '../competicoes/clubesEuropeusExtras.js';
import {CLUBES_SULAMERICANOS_EXTRAS} from '../competicoes/clubesInternacionais.js';
import {acervoClubeHistoricoDe} from './acervoClubesHistoricos.js';
import {acervoSelecaoHistoricoDe} from './acervoSelecoesHistoricas.js';

const normalizar=valor=>String(valor||'').trim().normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const conjuntos=[
 [CLUBES,'principal'],[CLUBES_REGIONAIS_EXTRAS,'estadual'],
 [CLUBES_SULAMERICANOS_EXTRAS,'continental_sul'],[CLUBES_EUROPEUS_EXTRAS,'continental_europa'],
];
const clubes=new Map();
for(const [lista,origem] of conjuntos)for(const item of lista){
 const nome=item?.nome,identidade=normalizar(nome);
 if(!identidade||clubes.has(identidade))continue;
 const acervo=acervoClubeHistoricoDe(nome);
 clubes.set(identidade,Object.freeze({
  tipo:'clube',nome,origem,
  cobertura:acervo?.atletas?.length?'parcial_documentado':'pendente_apuracao',
  atletasDocumentados:acervo?.atletas?.length||0,
  recordesDocumentados:acervo?.recordes?.length||0,
 }));
}
export const INVENTARIO_CLUBES_HISTORICOS=Object.freeze([...clubes.values()]);
export const INVENTARIO_SELECOES_HISTORICAS=Object.freeze(NACIONALIDADES.map(({id,label})=>{
 const acervo=acervoSelecaoHistoricoDe(label);
 return Object.freeze({
  tipo:'selecao',id,nome:label,cobertura:acervo?.cobertura||'pendente_apuracao',
  atletasDocumentados:acervo?.atletas?.length||0,
  titulosDocumentados:acervo?.titulos?.length||0,
 });
}));
export const TOTAL_ENTIDADES_HISTORICAS = Object.freeze({
 clubes:INVENTARIO_CLUBES_HISTORICOS.length,
 selecoes:INVENTARIO_SELECOES_HISTORICAS.length,
 clubesComAtletas:INVENTARIO_CLUBES_HISTORICOS.filter(x=>x.atletasDocumentados>0).length,
 selecoesComAtletas:INVENTARIO_SELECOES_HISTORICAS.filter(x=>x.atletasDocumentados>0).length,
});
export const coberturaHistoricaDe=(tipo,nome)=>tipo==='clube'
 ? clubes.get(normalizar(nome))||null
 : INVENTARIO_SELECOES_HISTORICAS.find(s=>s.id===nome||normalizar(s.nome)===normalizar(nome))||null;
