import { createTheme } from "@mui/material/styles";

// Create a theme instance.
export const lightTheme = createTheme({
  typography: {
    h1: {
      fontSize: "1.6rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
    h2: {
      fontSize: "1.4rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#e91e63",
    },
    secondary: {
      main: "#208080",
    },
  },
});
