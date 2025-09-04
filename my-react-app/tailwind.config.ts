    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          fontFamily: {
            yourCustomFont: ['YourCustomFont', 'Trirong'], // 'YourCustomFont' must match the font-family name from @font-face
            // You can also add other fallback fonts here
          },
        },
      },
      plugins: [],
    };


    