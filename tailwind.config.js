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
        body: ['Inter', 'sans-serif'],
        // Brand typography — map the classes used across the app to the official fonts.
        primary: ['"Space Grotesk"', 'sans-serif'],   // display / headings / labels
        secondary: ['Inter', 'sans-serif'],  // body copy
        carla: ['Inter', 'sans-serif'],      // legacy alias
      },

      boxShadow: {
        'flat-bold': '6px 6px 0px 0px #010d54',
        'flat-bold-hover': '2px 2px 0px 0px #010d54',
      }
    },
  },
  plugins: [],
}
