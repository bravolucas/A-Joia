// Efeitos originais A JOIA em Bodymovin/Lottie. Sem fontes nem imagens externas.
import fs from 'node:fs';
const estatico=k=>({a:0,k});
const keyframes=(inicio,fim,t0=0,t1=65)=>({a:1,k:[{t:t0,s:inicio,e:fim,i:{x:[.65],y:[1]},o:{x:[.2],y:[0]}},{t:t1,s:fim}]});
function particula(i,nome){
 const ang=i*Math.PI/6,dist=nome==='gol'?90:75;
 const pos=[120+Math.cos(ang)*dist,120+Math.sin(ang)*dist];
 return {ddd:0,ind:i+1,ty:4,nm:`Faísca ${i+1}`,sr:1,ks:{o:{a:1,k:[{t:0,s:[0],e:[95],i:{x:[.6],y:[1]},o:{x:[.2],y:[0]}},{t:8,s:[95],e:[0],i:{x:[.6],y:[1]},o:{x:[.2],y:[0]}},{t:80,s:[0]}]},r:keyframes([0],[i%2?110:-110]),p:keyframes([120,120,0],[...pos,0]),a:estatico([0,0,0]),s:estatico([100,100,100])},shapes:[{ty:'gr',it:[{ty:'rc',d:1,s:estatico([i%2?4:7,i%2?12:5]),p:estatico([0,0]),r:estatico(1),nm:'Brilho'},{ty:'fl',c:estatico(nome==='contrato'?[.3,.85,.65,1]:[.94,.79,.43,1]),o:estatico(100),r:1},{ty:'tr',p:estatico([0,0]),a:estatico([0,0]),s:estatico([100,100]),r:estatico(0),o:estatico(100),sk:estatico(0),sa:estatico(0)}]}],ip:0,op:90,st:0,bm:0};
}
for(const nome of ['gol','taca','contrato']){
 const dados={v:'5.7.4',fr:60,ip:0,op:90,w:240,h:240,nm:`A JOIA · ${nome}`,ddd:0,assets:[],layers:Array.from({length:12},(_,i)=>particula(i,nome)),markers:[]};
 fs.writeFileSync(`arte/animacoes/${nome}.json`,JSON.stringify(dados)+'\n');
}
console.log('3 animações originais geradas.');
