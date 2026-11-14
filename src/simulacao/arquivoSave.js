import LZString from 'lz-string';
const MARCA='ajoia-arquivo-lz1';
/** Compacta apenas o arquivo crescente. A carreira e os saves antigos continuam JSON. */
export function serializarCarreira(valor){
 return JSON.stringify(valor,(chave,v)=>((chave==='universo'&&v?.versao)||(chave==='mundo'&&v?.jogadores)||(chave==='historiaFutebol'&&v?.atletas))?{formato:MARCA,dados:LZString.compressToUTF16(JSON.stringify(v))}:v);
}
export function lerCarreira(texto){
 return JSON.parse(texto,(chave,v)=>{
  if(v?.formato!==MARCA)return v;
  const texto=LZString.decompressFromUTF16(v.dados);
  if(!texto)throw new Error('O arquivo do mundo está corrompido.');
  return JSON.parse(texto);
 });
}
