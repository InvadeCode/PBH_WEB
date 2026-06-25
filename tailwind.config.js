/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#6865fa',
          light: '#d4cefc',
          navy: '#010d54',
          yellow: '#ffcd00',
        },
        secondary: {
          lightBlue: '#b9d5ff',
          charcoal: '#302f2f',
          medBlue: '#2a97d9',
          lavender: '#af73dd',
          lime: '#93d435',
        }
      },
      fontFamily: {
        header: ['"Space Grotesk"', 'sans-serif'],
        body: ['Karla', 'sans-serif'],
        primary: ['"Space Grotesk"', 'sans-serif'],
        secondary: ['Karla', 'sans-serif'],
        carla: ['Karla', 'sans-serif'],
      },
      fontSize: {
        // Size 3: Body & Micro (16px) - Karla
        'xs': ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'base': ['1rem', { lineHeight: '1.65', letterSpacing: '0' }],
        'lg': ['1rem', { lineHeight: '1.65', letterSpacing: '0' }],
        
        // Size 2: Subheading (24px to 28px) - Karla
        'xl': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        '2xl': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        '3xl': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        '4xl': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0' }],

        // Size 1: Heading (40px to 72px) - Space Grotesk
        '5xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '6xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '7xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '8xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '9xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },

      boxShadow: {
        'flat-bold': '6px 6px 0px 0px #010d54',
        'flat-bold-hover': '2px 2px 0px 0px #010d54',
      }
    },
  },
  plugins: [],
}
