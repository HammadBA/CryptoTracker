import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import HomePage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import { Box, createTheme, ThemeProvider } from "@mui/system";
import "./App.css";

const theme = createTheme({
  App: {
    background:
      "linear-gradient(30deg, rgba(244,67,105,1) 0%, rgba(62,59,146,1) 100%)",
    color: "white",
    minHeight: "100vh",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={theme.App}>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
