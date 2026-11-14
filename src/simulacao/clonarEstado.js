/** Copia os dados JSON da carreira sem serializar e reler milhares de atletas.
 * O arquivo é imutável: cada fechamento cria novos mapas e novas linhas. */
export function clonarEstado(valor){
 const ativos=new WeakSet();
 function copiar(v,chave='',emArray=false){
  if(chave==='universo'&&v?.versao)return v;
  if(v===null)return null;
  const tipo=typeof v;
  if(tipo==='number')return Number.isFinite(v)?(v===0?0:v):null;
  if(tipo==='string'||tipo==='boolean')return v;
  if(tipo==='undefined'||tipo==='function'||tipo==='symbol')return emArray?null:undefined;
  if(tipo==='bigint')throw new TypeError('A carreira precisa conter somente dados JSON.');
  if(typeof v.toJSON==='function')return copiar(v.toJSON(chave),chave,emArray);
  if(ativos.has(v))throw new TypeError('A carreira não pode conter referências circulares.');
  ativos.add(v);
  let resultado;
  if(Array.isArray(v))resultado=Array.from(v,x=>copiar(x,'',true));
  else{
   resultado={};
   for(const key of Object.keys(v)){
    const item=copiar(v[key],key);if(item===undefined)continue;
    if(key==='__proto__')Object.defineProperty(resultado,key,{value:item,enumerable:true,writable:true,configurable:true});
    else resultado[key]=item;
   }
  }
  ativos.delete(v);return resultado;
 }
 return copiar(valor);
}
