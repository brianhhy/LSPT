/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}", // 프로젝트 구조에 따라 경로 조정
  ],
  theme: {
    extend: {
      backgroundImage:{
        'gradient-to-r': '#7F7FD5',
      }
    },
  },
  plugins: [],
};
