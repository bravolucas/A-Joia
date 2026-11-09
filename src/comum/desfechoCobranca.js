// Uma única leitura do resultado para imagem, legenda e feedback.
export function desfechoCobranca(r){
 if(!r)return null;
 if(r.resultado==='gol'||r.gol===true)return 'gol';
 if(r.resultado==='defesa'||r.tipo==='Defesa')return 'defesa';
 return 'fora';
}
