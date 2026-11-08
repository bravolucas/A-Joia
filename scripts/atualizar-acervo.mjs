// Reexportação opcional dos originais já creditados. Uso: node scripts/atualizar-acervo.mjs /caminho/Football-Career
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { svgDaTaca, competicaoDoTitulo } from '../src/comum/tacas.js';
import { TACAS_MUSEU } from '../src/museu/museu.js';
import { slugCompeticao, resolverImagemCompeticao } from '../src/comum/arteCompeticoes.js';
const fontes={
'brasileirao':'brazil/brasileirao.png','brasileirao-serie-b':'brazil/brasileirao-b.png','copa-do-brasil':'brazil/copa-do-brasil.png','libertadores':'conmebol/libertadores.png','copa-sul-americana':'conmebol/sudamericana.png','copa-america':'conmebol/copa-america.png','champions-league':'europe/champions-league.png','europa-league':'europe/europa-league.png','eurocopa':'europe/euro.png','copa-do-mundo':'world/fifa-world-cup.png','mundial-de-clubes':'world/club-world-cup.png','copa-do-rei':'spain/copa-del-rey.png','la-liga':'spain/laliga.png','supercopa-de-espana':'spain/supercopa.png','serie-a':'italy/serie-a.png','serie-b-italia':'italy/serie-b.png','coppa-italia':'italy/coppa-italia.png','supercoppa-italiana':'italy/supercoppa.png','bundesliga':'germany/bundesliga.png','2-bundesliga':'germany/bundesliga-2.png','dfb-pokal':'germany/dfb-pokal.png','supercopa-da-alemanha':'germany/supercup.png','ligue-1':'france/ligue-1.png','ligue-2':'france/ligue-2.png','copa-da-franca':'france/coupe-de-france.png','trophee-des-champions':'france/trophee-des-champions.png','premier-league':'england/premier-league.png','fa-cup':'england/fa-cup.png','championship':'england/championship.png','community-shield':'england/community-shield.png','liga-portugal':'portugal/primeira-liga.png','taca-de-portugal':'portugal/taca-de-portugal.png','eredivisie':'netherlands/eredivisie.png','knvb-beker':'netherlands/knvb-beker.png','liga-profesional':'argentina/liga-profesional.png','copa-argentina':'argentina/copa-argentina.png','supercopa-argentina':'argentina/supercopa.png','super-lig':'turkey/super-lig.png','liga-saudita':'saudi/saudi-pro-league.png','mls':'usa/mls.png','us-open-cup':'usa/us-open-cup.png','copa-da-asia':'asia/asian-cup.png','bota-de-ouro':'awards/golden-boot.png','bola-de-ouro':'awards/ballon-dor.png'};
const base=process.argv[2];
if(base){for(const [nome,arquivo] of Object.entries(fontes)){
 const criacao=path.join('arte/originais/tacas',`${nome}.webp`);
 const input=fs.existsSync(criacao)?criacao:path.join(base,'public/trophies',arquivo);
 if(!fs.existsSync(input))throw Error(`Original ausente: ${arquivo}`);
 const r=spawnSync('magick',[input,'-trim','+repage','-resize','900x900>','-strip','-quality','88',`arte/competicoes/${nome}.webp`],{stdio:'inherit'});
 if(r.status!==0)throw Error(`Falha na exportação de ${nome}`);
}}
const arquivos=Object.fromEntries(fs.readdirSync('arte/competicoes').filter(f=>/\.(svg|webp)$/.test(f)).map(f=>[f.replace(/\.(svg|webp)$/,''),f]));
const originais=fs.existsSync('arte/competicoes/acervo.json') ? JSON.parse(fs.readFileSync('arte/competicoes/acervo.json','utf8')).ilustracoesOriginais || [] : [];
for(const t of TACAS_MUSEU){if(resolverImagemCompeticao(t.nome,arquivos))continue;
 const slug=slugCompeticao(t.nome);const svg=svgDaTaca(competicaoDoTitulo(t.nome).tipo,t.nome).replaceAll('__ID__',`acervo-${slug}`);
 fs.writeFileSync(`arte/competicoes/${slug}.svg`,svg);if(!originais.includes(t.nome))originais.push(t.nome);
}
fs.writeFileSync('arte/competicoes/acervo.json',JSON.stringify({fonteRaster:'Football-Career/public/trophies',exportacao:'WebP, fundo transparente, maior lado até 900 px; sem ampliação artificial',arquivos:fontes,ilustracoesOriginais:originais,recriacoesIluminadas:['brasileirao','copa-do-brasil','libertadores'],originaisRecriados:'arte/originais/tacas/'},null,2)+'\n');
console.log(`Acervo atualizado: ${Object.keys(fontes).length} exportações raster; ${originais.length} ilustrações originais.`);
