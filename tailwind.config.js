/** @type {import('tailwindcss').Config} */
export default {
  // CONFIGURACIÓN CRÍTICA: Rutas donde Tailwind debe buscar las clases
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}