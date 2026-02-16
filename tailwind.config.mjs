/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--bg-primary)',
          primaryHeader: 'var(--bg-primary-header)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          input: 'var(--bg-input)',
          hoverDark: 'var(--bg-hover-dark)',
          hoverLight: 'var(--bg-hover-light)',
          hoverDanger: 'var(--bg-hover-danger)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          light: 'var(--text-light)',
        },
        border: {
          light: 'var(--border-light)',
          secondary: 'var(--border-secondary)',
          primary: 'var(--border-primary)',
        },
        status: {
          danger: 'var(--danger)',
          success: 'var(--success)',
          warning: 'var(--warning)',
        },
      },
    },
  },
  plugins: [],
};
