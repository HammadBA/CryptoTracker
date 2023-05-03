import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import { SingleCoin } from "../config/api";
import {
  Box,
  LinearProgress,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import CoinInfo from "../Components/CoinInfo";
import parse from "html-react-parser";
import { numberWithCommas } from "../Components/Carousel";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    });
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = createTheme({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
      width: "100%",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 10,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontWeight: "bold",
      padding: 10,
      paddingTop: 0,
      textAlign: "justify",
      fontFamily: "Montserrat",
    },
    progress: {
      "& .MuiLinearProgress-bar": {
        animationDuration: "8s",
      },
    },
    marketData: {
      alignSelf: "start",

      width: "100%",
      display: "flex",
      justifyContent: { md: "space-around" },
      flexDirection: { xs: "column", md: "column", lg: "row" },
      alignItems: { xs: "start", sm: "center" },
    },
  });

  if (!coin)
    return (
      <ThemeProvider theme={theme}>
        <LinearProgress
          style={{
            backgroundColor: "#002855",
          }}
          sx={theme.progress}
        />
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={theme.container}>
        <Box sx={theme.sidebar}>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h3" sx={theme.heading}>
            {coin?.name}
          </Typography>
          <Typography variant="subtitle1" sx={theme.description}>
            {parse(coin?.description.en.split(".").slice(0, 4) + ". ")}
          </Typography>

          <Box sx={theme.marketData}>
            <span style={{ display: "flex", height: 100 }}>
              <Typography variant="h5" sx={theme.heading}>
                Rank:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {" "}
                {coin?.market_cap_rank}
              </Typography>
            </span>

            <span style={{ display: "flex", height: 100 }}>
              <Typography variant="h5" sx={theme.heading}>
                Current Price:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </span>

            <span style={{ display: "flex", height: 100 }}>
              <Typography variant="h5" sx={theme.heading}>
                Market Cap:{" "}
              </Typography>
              &nbsp;&nbsp;
              <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, 6)
                )}
                M
              </Typography>
            </span>
          </Box>
        </Box>
        <CoinInfo coin={coin} />
      </Box>
    </ThemeProvider>
  );
};

export default CoinPage;
