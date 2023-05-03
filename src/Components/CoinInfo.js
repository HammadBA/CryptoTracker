import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import { HistoricalChart } from "../config/api";
import { ThemeProvider } from "@emotion/react";
import { Box, CircularProgress, createTheme } from "@mui/material";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { chartDays } from "../config/data";
import SelectButton from "./SelectButton";

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios
      .get(HistoricalChart(coin.id, days, currency))
      .catch(function (error) {
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

    setHistoricalData(data.prices);
  };
  useEffect(() => {
    fetchHistoricalData();
  }, [currency, days]);

  const theme = createTheme({
    container: {
      width: { lg: "100%", md: "100%" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: { sm: 10, md: 15 },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={theme.container}>
        {!historicalData ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `${currency}`,
                    borderColor: "gold",
                    color: "white",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },

                scales: {
                  y: {
                    ticks: { color: "white" },
                  },
                  x: {
                    ticks: { color: "white" },
                  },
                },
              }}
            />

            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => setDays(day.value)}
                  selected={day.value === days}
                  sx={{
                    "&:hover": {
                      backgroundColor: "gold",
                      color: "black",
                    },
                  }}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CoinInfo;
