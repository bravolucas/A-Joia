// Janelas sobrepostas compartilham o bloqueio e só a última o libera.
const bloqueios = new WeakMap();
export function bloquearRolagem(elemento) {
  let estado = bloqueios.get(elemento);
  if (!estado) {
    estado = { quantidade: 0, anterior: elemento.style.overflow };
    bloqueios.set(elemento, estado);
    elemento.style.overflow = 'hidden';
  }
  estado.quantidade++;
  let liberado = false;
  return () => {
    if (liberado) return;
    liberado = true;
    if (--estado.quantidade === 0) {
      elemento.style.overflow = estado.anterior;
      bloqueios.delete(elemento);
    }
  };
}
