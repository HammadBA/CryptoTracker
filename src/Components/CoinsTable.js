import axios from "axios";
import React, { useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { numberWithCommas } from "./Carousel";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteIcon from "@mui/icons-material/Delete";
import AliceCarousel from "react-alice-carousel";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
  progress: {
    "& .MuiLinearProgress-bar": {
      animationDuration: "8s",
    },
  },

  row: {
    cursor: "pointer",
    "&:hover": {
      background: "linear-gradient(90deg, #0e1c26 0%, #524175 100%)",
    },
    fontFamily: "Montserrat",
  },
  ulcolor: {
    "& .MuiPaginationItem-root": {
      color: "white",
    },
  },
  watchlistItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
  },
  watchlistBox: {
    background: "linear-gradient(30deg, #0e1c26 20%, #524175 100%)",
    height: 220,
    width: 200,
    padding: 3,
    margin: 3,
    borderRadius: 3,
  },
  icon: {
    cursor: "pointer",
    margin: 1,
    borderRadius: 5,
    "&:hover": {
      border: "1px solid white",
      color: "white",
    },
  },
  WatchListContainer: {
    marginTop: 10,
    padding: 5,
    borderTop: "1px solid white",
  },
});

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { currency, symbol } = CryptoState();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("Main");
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("Watchlist") || "[]")
  );

  const fetchCoins = async () => {
    SetLoading(true);
    const { data } = await axios
      .get(CoinList(currency))
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
    setCoins(data);
    SetLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("Watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    const Watchlist = JSON.parse(localStorage.getItem("Watchlist"));
    if (Watchlist) {
      setWatchlist(Watchlist);
    }
  }, []);

  const handleWatchlist = async (coin, e) => {
    e.stopPropagation();
    let w = watchlist;
    if (w.filter((e) => e.id === coin.id).length === 0) {
      setWatchlist([...watchlist, coin]);
    }

    return watchlist;
  };
  const WatchlistDelete = async (coin, e) => {
    // console.log("Old:" + watchlist);
    e.stopPropagation();
    let w = watchlist;
    if (w.filter((e) => e.id === coin.id).length > 0) {
      setWatchlist(watchlist.filter((c) => c !== coin));
    }

    return watchlist;
  };

  const history = useNavigate();

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        (coin.name.toLowerCase().includes(search) ||
          coin.symbol.toLowerCase().includes(search)) &&
        (filter === "Gainers"
          ? coin.price_change_percentage_24h >= 0 &&
            coins.sort(
              (a, b) =>
                parseFloat(b.price_change_percentage_24h) -
                parseFloat(a.price_change_percentage_24h)
            )
          : filter === "Main"
          ? coins.sort(
              (a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap)
            )
          : filter === "Losers"
          ? coin.price_change_percentage_24h <= 0 &&
            coins.sort(
              (a, b) =>
                parseFloat(a.price_change_percentage_24h) -
                parseFloat(b.price_change_percentage_24h)
            )
          : filter === "Volatile"
          ? Math.abs(coin.market_cap_change_percentage_24h) >= 1 &&
            coins.sort(
              (a, b) =>
                parseFloat(Math.abs(b.market_cap_change_percentage_24h)) -
                parseFloat(Math.abs(a.market_cap_change_percentage_24h))
            )
          : (console.log(coin),
            coins.sort(
              (a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap)
            )))
    );
  };

  const items = watchlist.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <ThemeProvider theme={theme}>
        <Box sx={theme.watchlistBox}>
          <Link style={theme.watchlistItems} to={`/coins/${coin.id}`}>
            <img
              src={coin?.image}
              alt={coin.name}
              height="80"
              style={{ marginBottom: 10 }}
            />
            <span>
              {coin?.symbol}{" "}
              <span style={{ color: profit > 0 ? "rgb(14,203,129)" : "red" }}>
                {profit && "+"}
                {coin?.price_change_percentage_24h?.toFixed(2)}{" "}
              </span>
            </span>

            <span style={{ fontSize: "22", fontWeight: "500" }}>
              {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
            </span>
          </Link>
          <DeleteIcon
            sx={theme.icon}
            onClick={(e) => WatchlistDelete(coin, e)}
          />
        </Box>
      </ThemeProvider>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        style={{ textAlign: "center", backgroundColor: "transparent" }}
      >
        {watchlist.length > 0 ? (
          <Box sx={theme.WatchListContainer}>
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              My Watchlist
            </Typography>
            <AliceCarousel
              mouseTracking
              infinite
              autoPlayInterval={1000}
              animationDuration={1500}
              disableDotsControls
              responsive={responsive}
              autoPlay
              disableButtonsControls
              items={items}
              paddingLeft={90}
            />
          </Box>
        ) : (
          <></>
        )}

        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices By Market Cap
        </Typography>

        <TextField
          label="Search For A Crypto Currency..."
          variant="outlined"
          fullWidth
          style={{ marginBottom: 20 }}
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            fieldset: { color: "#ffffff", borderColor: "white" },
          }}
          onChange={(e) => setSearch(e.target.value)}
        ></TextField>

        <Box p={3}>
          <Button
            onClick={(e) => {
              setFilter(e.target.value);
              console.log(`Changed to ${filter}`);
              handleSearch();
            }}
            value="Main"
            sx={theme.button}
          >
            Main List
          </Button>
          <Button
            onClick={(e) => {
              setFilter(e.target.value);
              console.log(`Changed to ${filter}`);
              handleSearch();
            }}
            value="Gainers"
            sx={theme.button}
          >
            Top Gainers
          </Button>
          <Button
            onClick={(e) => {
              setFilter(e.target.value);
              console.log(`Changed to ${filter}`);
              handleSearch();
            }}
            value="Losers"
          >
            Top Losers
          </Button>
          <Button
            onClick={(e) => {
              setFilter(e.target.value);
              console.log(`Changed to ${filter}`);
              handleSearch();
            }}
            value="Volatile"
          >
            Most Volatility
          </Button>
        </Box>

        <TableContainer>
          {loading ? (
            <>
              <Typography variant="h5" p={3}>
                One Moment
              </Typography>
              <LinearProgress
                style={{
                  backgroundColor: "#002855",
                }}
                sx={theme.progress}
              />
            </>
          ) : (
            <>
              <Table>
                <TableHead style={{ backgroundColor: "gold" }}>
                  <TableRow>
                    {[
                      "Coin",
                      "Price",
                      "24h Change",
                      "Market Cap",
                      "24h Volume",
                      " ",
                    ].map((head) => (
                      <TableCell
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontFamily: "Montserrat",
                        }}
                        key={head}
                        align={head === "Coin" ? "left" : "right"}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {handleSearch()
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map((row) => {
                      const profit = row.price_change_percentage_24h > 0;
                      return (
                        <TableRow
                          onClick={() => history(`/coins/${row.id}`)}
                          key={row.name}
                          sx={theme.row}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              display: "flex",
                              gap: 15,
                            }}
                          >
                            <img
                              src={row.image}
                              alt={row.name}
                              height="50"
                              style={{ marginBottom: 10 }}
                            />

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{
                                  textTransform: "uppercase",
                                  fontSize: 22,
                                  color: "white",
                                }}
                              >
                                {row.symbol}
                              </span>
                              <span style={{ color: "darkgrey" }}>
                                {row.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: "white",
                              fontWeight: 500,
                            }}
                          >
                            {symbol}{" "}
                            {numberWithCommas(row.current_price.toFixed(2))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: profit > 0 ? "rgb(14, 203, 129" : "red",
                              fontWeight: 500,
                            }}
                          >
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: "white",
                              fontWeight: 500,
                            }}
                          >
                            {symbol}{" "}
                            {numberWithCommas(
                              row.market_cap.toString().slice(0, -6)
                            )}
                            M
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: "white",
                              fontWeight: 500,
                            }}
                          >
                            {symbol}{" "}
                            {numberWithCommas(
                              row.total_volume.toString().slice(0, -6)
                            )}
                            M
                          </TableCell>

                          <AddTaskIcon
                            onClick={(e) => handleWatchlist(row, e)}
                            sx={theme.icon}
                          />
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </>
          )}
        </TableContainer>
        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          sx={theme.ulcolor}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
