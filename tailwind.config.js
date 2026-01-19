/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // สีฟ้าสดใสสำหรับปุ่มหรือ Hilight
        secondary: "#1E293B", // สีน้ำเงินเข้มเกือบดำ สำหรับ Footer หรือ Header
        accent: "#0EA5E9", // สีฟ้าอ่อน
        background: "#F8FAFC", // สีพื้นหลังขาวอมเทา สบายตา
        surface: "#FFFFFF", // สีพื้นหลังการ์ด
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};