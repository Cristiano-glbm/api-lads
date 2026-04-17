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
          header: '#5D3FD3',
          'header-deep': '#4C33CC',
          blue: '#2563EB',
          'blue-soft': '#EFF6FF',
          'blue-border': '#BFDBFE',
        },
        forum: {
          bg: '#F9FAFB',
          /** Barra superior ForumHome (Figma Inspect) */
          header: '#432DD7',
          primary: '#4F39F6',
          'primary-muted': '#6D28D9',
          ink: '#111827',
          muted: '#6B7280',
          'muted-light': '#9CA3AF',
          tag: '#EDE9FE',
          'tag-text': '#5B21B6',
          pinned: '#FFFBEB',
          'pinned-border': '#FDE68A',
          'pinned-label': '#E17100',
        },
      },
    },
  },
  plugins: [],
};
