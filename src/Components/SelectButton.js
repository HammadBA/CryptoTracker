import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import React from "react";

const SelectButton = ({ children, selected, onClick }) => {
  const theme = createTheme({
    button: {
      "&:hover": {
        backgroundColor: "gold",
        color: "black",
      },
      border: "1px solid white",
      borderRadius: 5,
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "gold" : "",
      color: selected ? "black" : "",
      fontWeight: selected ? 700 : 500,
      width: "18%",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div onClick={onClick} style={theme.button}>
        {children}
      </div>
    </ThemeProvider>
  );
};

export default SelectButton;
