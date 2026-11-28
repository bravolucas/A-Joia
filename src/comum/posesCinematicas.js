// Biblioteca de poses; arquivos opcionais até a inclusão do pacote WebP.
export const POSES_CINEMATICAS = Object.freeze({
  apresentacao: ['apresentacao-camisa'],
  comemoracao: ['vitoria','vitoria-ajoelhado','corrida-comemoracao'],
  decepcao: ['derrota','frustracao-maos-cabeca'],
  despedida: ['despedida-chuteiras','aplausos'],
  gol: ['gol-deslizando','corrida-comemoracao'],
  treino: ['treino-concentracao'],
  recuperacao: ['reabilitacao'],
  treinador: ['treinador-prancheta'],
  gala: ['gala-neutro','gala-aceno','gala-confianca'],
  'premio-1': ['bola-ouro-a'],
  'premio-2': ['gala-segundo-lugar','gala-aplausos'],
  'premio-3': ['gala-aplausos','gala-gratidao'],
});
export function escolherPose(pose, arquivos, semente='') {
  const disponiveis=(POSES_CINEMATICAS[pose]||[]).filter(id=>typeof arquivos[id]==='string'&&arquivos[id]);
  if (!disponiveis.length) return null;
  const hash=[...String(semente)].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,7);
  return arquivos[disponiveis[hash%disponiveis.length]];
}
export const posePremiacao=pos=>[1,2,3].includes(pos)?'premio-'+pos:null;
