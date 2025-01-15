/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Raleway", "serif"], 
    },
    extend: {
      //colors used in the project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E"
      },
      backgroundImage: {
        'loginbg-img': "url('./src/assets/images/login.jpg')",
        'signupbg-img': "url('./src/assets/images/signup.jpg')"
      },
    },
  },
  plugins: [],
}

