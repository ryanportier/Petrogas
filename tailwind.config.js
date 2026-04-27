/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en uPNG - colores cálidos retro
        cream: {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f3ebe1',
          300: '#ede0d4',
          400: '#e6d5c7',
          500: '#d9c5b3', // Background principal
          600: '#c4ae96',
          700: '#a68a6d',
          800: '#856b53',
          900: '#5c4a39',
        },
        rust: {
          50: '#fef5f1',
          100: '#fce8df',
          200: '#f9d0bf',
          300: '#f5b89e',
          400: '#f29f7e',
          500: '#ee865d', // Naranja principal
          600: '#e86b3b',
          700: '#d14e1f',
          800: '#a33d18',
          900: '#7a2e12',
        },
        brown: {
          50: '#f7f3f0',
          100: '#e8ddd6',
          200: '#d4c3b5',
          300: '#bfa893',
          400: '#a98d72',
          500: '#8b6f53', // Marrón principal
          600: '#6f5640',
          700: '#53402f',
          800: '#3a2c21',
          900: '#251b14',
        },
        forest: {
          50: '#f3f5f0',
          100: '#e3e8dd',
          200: '#c9d3c1',
          300: '#aebca3',
          400: '#93a586',
          500: '#788e69',
          600: '#5f7151',
          700: '#48553d',
          800: '#343d2c',
          900: '#22281d',
        }
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
        pixel: ['var(--font-pixel)', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.75' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'pixel': '2px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
        'pixel-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.25)',
        'inner-pixel': 'inset 2px 2px 0px 0px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
