/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonPink: '#FF2A7A',
        darkBg: '#0B0F19',
        panelBg: '#111827',
        borderGlow: 'rgba(255, 42, 122, 0.15)',
      },
      boxShadow: {
        glow: '0 0 15px rgba(255, 42, 122, 0.4)',
        panelGlow: '0 0 25px rgba(255, 42, 122, 0.1)',
        insetGlow: 'inset 0 0 12px rgba(255, 42, 122, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
