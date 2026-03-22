import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#E85A1A',
          light:   '#F07040',
          dark:    '#C44810',
        },
        crimson: {
          DEFAULT: '#C8174F',
          light:   '#E03068',
          dark:    '#A01040',
        },
        // legacy aliases so old classes don't break
        primary: {
          DEFAULT: '#E85A1A',
          dark:    '#C44810',
          light:   '#F07040',
        },
        accent: {
          DEFAULT: '#E85A1A',
          dark:    '#C44810',
          light:   '#F07040',
        },
        surface: {
          DEFAULT: '#F9F7F5',
          light:   '#FFFFFF',
        },
        text: {
          DEFAULT: '#1C1C1C',
          muted:   '#6B7280',
          dark:    '#111111',
        },
      },
      fontFamily: {
        sans:    ['Verdana', 'Geneva', 'Tahoma', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
