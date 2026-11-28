import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {IDS_BIBLIOTECA} from '../src/comum/posesCinematicas.js';
const dir=fileURLToPath(new URL('../arte/jornada/personagens/',import.meta.url));
const errors=[];
const files=existsSync(dir)?readdirSync(dir):[];
for(const id of IDS_BIBLIOTECA){
 const file=id+'.webp';
 if(!files.includes(file)){errors.push(file+': ausente');continue;}
 const b=readFileSync(new URL('../arte/jornada/personagens/'+file,import.meta.url));
 if(b.length<30||b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP'||b.readUInt32LE(4)!==b.length-8){errors.push(file+': WebP inválido');continue;}
 let alpha=false,width=0,height=0,offset=12;
 while(offset+8<=b.length){
   const type=b.toString('ascii',offset,offset+4),size=b.readUInt32LE(offset+4),start=offset+8;
   if(start+size>b.length){errors.push(file+': bloco truncado');break;}
   if(type==='VP8X'&&size>=10){alpha=Boolean(b[start]&16);width=1+b.readUIntLE(start+4,3);height=1+b.readUIntLE(start+7,3);}
   offset=start+size+(size%2);
 }
 if(!alpha||width!==720||height!==768)errors.push(file+': esperado WebP RGBA de 720×768');
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(IDS_BIBLIOTECA.length+' recortes WebP conferidos.');
