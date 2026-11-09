const hash=s=>[...String(s)].reduce((n,v)=>Math.imul(n^v.charCodeAt(0),16777619)>>>0,2166136261);
export const PERFIS_ADVERSARIO=[
 {id:'pressao',nome:'Pressão alta',pista:'O rival adianta a marcação. Apoio e inversões ajudam a escapar.',atributos:{passe:.025,drible:.015,velocidade:.015,finalizacao:-.015},bons:['inverter','apoio-curto','atrair','contra','alternar','triangulos'],ruins:['chute-distancia','inicio-forte','ritmo-alto']},
 {id:'bloco',nome:'Bloco baixo',pista:'A área está protegida. Circular e trabalhar entre as linhas cria espaço.',atributos:{passe:.025,drible:.02,finalizacao:-.02,fisico:-.01},bons:['entrelinhas','triangulos','paciencia-area','amplitude','inverter'],ruins:['profundidade','transicao-rapida','segunda-bola']},
 {id:'velocidade',nome:'Ataque veloz',pista:'O rival acelera nas costas da defesa. Cobertura e leitura são importantes.',atributos:{defesa:.025,velocidade:.02,fisico:-.015},bons:['bloco-medio','linhas-juntas','segurar','apoio-curto'],ruins:['pressao-alta','marcacao-alta','cruzamentos']},
 {id:'aereo',nome:'Força aérea',pista:'O rival disputa cruzamentos. Passe pelo chão e posicionamento reduzem esse duelo.',atributos:{passe:.025,defesa:.015,fisico:-.025},bons:['apoio-curto','entrelinhas','triangulos','paciencia-area'],ruins:['cruzamentos','segunda-bola','bola-parada']}
];
export function perfilAdversario(nome,ano=2026){return PERFIS_ADVERSARIO[hash(`${nome}:${Math.floor(ano/3)}`)%PERFIS_ADVERSARIO.length];}
export function ajustePlanoAdversario(plano,perfil){return perfil?.bons?.includes(plano)?2:perfil?.ruins?.includes(plano)?-2:0;}
