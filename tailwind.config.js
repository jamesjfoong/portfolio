/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit', // Just In Time: optimize build time by only compiling the styles that are used
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
