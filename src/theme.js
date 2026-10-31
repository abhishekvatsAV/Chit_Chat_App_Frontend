import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#fff4d6",
      100: "#ffe6a3",
      200: "#ffd166",
      300: "#f4a261",
      400: "#e76f51",
      500: "#d1495b",
      600: "#b23a48",
      700: "#8f2d3e",
      800: "#632534",
      900: "#3d1f2b",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#101820",
        color: "white",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(209,73,91,.18), transparent 30%), radial-gradient(circle at 85% 80%, rgba(244,162,97,.12), transparent 35%)",
      },
    },
  },
  fonts: {
    heading: `'Work Sans', sans-serif`,
    body: `'Work Sans', sans-serif`,
  },
});

export default theme;
