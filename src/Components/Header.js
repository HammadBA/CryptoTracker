import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      mode: "dark",
    },
  },

  title: {
    flex: 1,
    color: "white",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
});

const Header = () => {
  const history = useNavigate();

  const { currency, setCurrency } = CryptoState();

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ backgroundColor: "#0e1c26" }}>
        <AppBar color="transparent" position="static">
          <Container>
            <Toolbar>
              <Typography
                onClick={() => history("/CryptoTracker")}
                sx={theme.title}
                variant="h6"
              >
                Crypto Tracker
              </Typography>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                sx={{
                  width: 100,
                  height: 50,
                  marginLeft: 15,
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
              >
                <MenuItem value={"CAD"}>CAD</MenuItem>
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"EUR"}>EUR</MenuItem>
              </Select>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Header;
