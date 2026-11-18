/**
 * Critérios da FIFA 2026 para classificação nos grupos do Mundial:
 * pontos gerais; pontos, saldo e gols no confronto direto entre empatados;
 * saldo e gols gerais; vitórias; desempate determinístico como último recurso
 * (fair play/ranking só quando disponíveis). Para melhores terceiros de
 * grupos distintos, usar pontos/saldo/gols gerais, sem confronto direto.
 */
const id=x=>x.nome??x.id;
const pontos=x=>x.pontos??x.p??0;
const golsPro=x=>x.golsPro??x.gp??0;
const golsContra=x=>x.golsContra??x.gc??0;
const numero=x=>Number(x)||0;

function confrontoEntre(empatados,jogos){
 const conjunto=new Set(empatados.map(id));
 const mapa=new Map(empatados.map(t=>[id(t),{pontos:0,pro:0,contra:0}]));
 for(const j of jogos||[]){
  const a=j.casa,b=j.fora;
  if(!conjunto.has(a)||!conjunto.has(b))continue;
  const gA=numero(j.golsCasa),gB=numero(j.golsFora);
  const x=mapa.get(a),y=mapa.get(b);
  x.pro+=gA;x.contra+=gB;y.pro+=gB;y.contra+=gA;
  if(gA>gB)x.pontos+=3;else if(gB>gA)y.pontos+=3;else{x.pontos++;y.pontos++;}
 }
 return mapa;
}
export function ordenarGrupoMundial48(linhas,jogos=[]){
 const classificacao=[...linhas];
 const conjuntos=new Map();
 for(const t of classificacao){const p=pontos(t);if(!conjuntos.has(p))conjuntos.set(p,[]);conjuntos.get(p).push(t);}
 const desempates=new Map();
 for(const empatados of conjuntos.values()){
  const mini=confrontoEntre(empatados,jogos);
  for(const t of empatados)desempates.set(id(t),mini.get(id(t)));
 }
 const comparar=(a,b)=>{
  const pontosDif=pontos(b)-pontos(a);
  if(pontosDif)return pontosDif;
  const mA=desempates.get(id(a)),mB=desempates.get(id(b));
  const minidif=mB.pontos-mA.pontos||(mB.pro-mB.contra)-(mA.pro-mA.contra)||mB.pro-mA.pro;
  if(minidif)return minidif;
  const saldoDif=(golsPro(b)-golsContra(b))-(golsPro(a)-golsContra(a));
  if(saldoDif)return saldoDif;
  return golsPro(b)-golsPro(a)||
   numero(b.vitorias??b.v)-numero(a.vitorias??a.v)||
   id(a).localeCompare(id(b));
 };
 return classificacao.sort(comparar);
}
