/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta da marca: neutros em grafite-esverdeado (base #0E1512) e dourado da gema (#D8B44A).
        // Substitui o zinc (cinza puro) e o amber (laranja) padrão do Tailwind em todo o jogo.
        zinc: { 50: "#F7FBF9", 100: "#F1F6F3", 200: "#E1E6E3", 300: "#D1D6D4", 400: "#9CA4A1", 500: "#6C7470", 600: "#4D5552", 700: "#3A423E", 800: "#222926", 900: "#131A17", 950: "#0E1512" },
        amber: { 50: "#FFFBEE", 100: "#FFF2CF", 200: "#FEE49C", 300: "#F7D46F", 400: "#EBC557", 500: "#D5AF3E", 600: "#B28F1B", 700: "#8E6F00", 800: "#725800", 900: "#5D4800", 950: "#342700" },
      },
    },
  },
  plugins: [],
};
