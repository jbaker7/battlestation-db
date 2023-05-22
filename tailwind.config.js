module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require("@tailwindcss/typography"), 
    require("daisyui"), 
    require('@tailwindcss/line-clamp')
  ],
  theme: {
    extend: {
      colors: {
        'error-bg': "#362424",
      },
    },
  },
  daisyui: {
    themes: [
      {
        halloween2: {
          ...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
          
          "neutral": "#292929",
          "neutral-focus": "#343434",
          "neutral-content": "#777777",
        },
        mytheme: {
         // "primary": "#AEDB0A",
          "primary": "#A4CC14",
          "secondary": "#00e7fe",
          "accent": "#00aec6",
          "neutral": "#383838",
          "base-100": "#242424",
          "info": "#0ea5e9",
          "success": "#84cc16",
          "warning": "#f59e0b",
          "error": "#dc2626",
          "--error-bg": "#362424"
        },
        purple: {
          "primary": "#802bb1",
          "secondary": "#564f6f",
          "accent": "#4c495d",
          "neutral": "#d1d7e0",
          "base-100": "#181818",
          "info": "#60baaf",
          "success": "#84cc16",
          "warning": "#ec5822",
          "error": "#ac1b00",
                    },
      },
    ],
  },
};
