import colors from "tailwindcss/colors"
import { createThemes } from "tw-colors"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    createThemes({
      light: {
        background: colors.slate[50],
        backgroundLight: colors.slate[100],
        foreground: colors.slate[950],
        primary: colors.blue[600],
        primaryLight: colors.blue[800],
      },
      dark: {
        background: colors.slate[950],
        backgroundLight: colors.slate[700],
        foreground: colors.slate[50],
        primary: colors.pink[600],
        primaryLight: colors.pink[800],
      },
    }),
  ],
}
