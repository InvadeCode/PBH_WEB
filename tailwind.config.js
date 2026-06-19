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
          blueLight: '#b9d5ff',
          darkGrey: '#302f2f',
          blueMed: '#2a97d9',
          purple: '#af73dd',
          green: '#93d435',
          orange: '#ed7e18',
        }
      },
      fontFamily: {
        header: ['"Space Grotesk"', 'sans-serif'],
        body: ['Karla', 'Inter', 'sans-serif'],
        // Brand typography — map the classes used across the app to the official fonts.
        primary: ['"Space Grotesk"', 'sans-serif'],   // display / headings / labels
        secondary: ['Karla', 'Inter', 'sans-serif'],  // body copy
        carla: ['Karla', 'Inter', 'sans-serif'],      // legacy alias ("Carla" → Karla)
      },
      // ── 3-SIZE TYPE SYSTEM ──────────────────────────────────────────────
      // Every text-* utility collapses into exactly three sizes:
      //   Label (xs–sm) · Body (base–2xl) · Display (3xl–9xl)
      fontSize: {
        'xs':   ['0.8125rem', { lineHeight: '1.45' }],   // LABEL
        'sm':   ['0.8125rem', { lineHeight: '1.45' }],   // LABEL
        'base': ['1.125rem',  { lineHeight: '1.6' }],    // BODY
        'lg':   ['1.125rem',  { lineHeight: '1.6' }],    // BODY
        'xl':   ['1.125rem',  { lineHeight: '1.6' }],    // BODY
        '2xl':  ['1.125rem',  { lineHeight: '1.5' }],    // BODY
        '3xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }], // DISPLAY
        '4xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '5xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '6xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '7xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '8xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '9xl':  ['clamp(2.5rem, 5.2vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        'flat-bold': '6px 6px 0px 0px #010d54',
        'flat-bold-hover': '2px 2px 0px 0px #010d54',
      }
    },
  },
  plugins: [],
}
