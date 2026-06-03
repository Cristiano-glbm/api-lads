/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        lads: {
          header: '#2563EB',
          'header-deep': '#1D4ED8',
          blue: '#2563EB',
          'blue-soft': '#0F172A',
          'blue-border': '#334155',
        },
        forum: {
          bg: '#020617',
          /** Barra superior ForumHome (Figma Inspect) */
          header: '#0F172A',
          primary: '#2563EB',
          'primary-muted': '#06B6D4',
          ink: '#FFFFFF',
          muted: '#CBD5E1',
          'muted-light': '#94A3B8',
          tag: '#1E293B',
          'tag-text': '#06B6D4',
          pinned: '#1E293B',
          'pinned-border': '#334155',
          'pinned-label': '#06B6D4',
        },
      },
    },
  },
  plugins: [],
};
