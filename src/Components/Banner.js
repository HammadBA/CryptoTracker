import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
import Carousel from "./Carousel";

const theme = createTheme({
  bannerConent: {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    paddingTop: "25px",
    justifyContent: "space-around",
  },
  tagline: {
    height: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Banner = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={theme.banner}>
        <Container sx={theme.bannerConent}>
          <Box sx={theme.tagline}>
            <Typography
              sx={{
                marginBottom: "15px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
                textAlign: "center",
              }}
              variant="h2"
            >
              Crypto Dashboard
            </Typography>
            <Typography
              sx={{
                color: "darkgrey",
                textTransform: "capitalize",
                fontFamily: "Montserrat",
                textAlign: "center",
              }}
              variant="subtitle2"
            >
              Get all the info regarding your favourite crypto currency
            </Typography>
          </Box>
          <Carousel />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Banner;
