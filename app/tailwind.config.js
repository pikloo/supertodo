/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/*.html', './src/**/*.{html,js}'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
				primary: ['Montserrat', 'Arial', 'sans-serif'],
			},
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        warn: "rgb(var(--color-warn) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        transparent: "transparent",
        current: "currentColor",
      },
    },
  },
  plugins: [],
}

