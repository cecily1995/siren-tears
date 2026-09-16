import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFFFF',
        pearl: '#FFFFFF',
        sand: '#D9C9AE',
        sandLight: '#E8DDC7',
        ocean: '#7E94A0',
        oceanDeep: '#5E737F',
        gold: '#A78656',
        goldLight: '#C3A57A',
        charcoal: '#26231F',
        ash: '#5C564E'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest: '0.32em',
        editorial: '0.18em'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      animation: {
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 1.4s ease-out forwards',
        'kenburns': 'kenburns 18s ease-in-out infinite alternate',
        'shimmer': 'shimmer 8s linear infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        kenburns: {
          '0%': { transform: 'scale(1.04) translate(0, 0)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};

export default config;
