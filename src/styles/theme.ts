import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a73e8"
    },
    secondary: {
      main: "#6a1b9a"
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600
        }
      }
    }
  }
});
