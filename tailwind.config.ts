import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        cyan: { DEFAULT: '#00f2ff' },
        magenta: { DEFAULT: '#ff00c1' },
        emerald: { DEFAULT: '#00ff88' },
        bg: { DEFAULT: '#020617', 2: '#0a1628' },
      },
    },
  },
  plugins: [],
}

export default config
