import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "./pages/TestWiktionary/index.tsx";
import TestRando from "./pages/TestRando/index.tsx";
import GameMain from "./pages/Game/index.tsx";
import MyLists from "./pages/MyLists/index.tsx";
import NavBar from "./components/NavBar/index.tsx";

import CssBaseline from "@mui/material/CssBaseline";

import { ThemeContextProvider } from "./providers/ThemeContextProvider.tsx";
import { DictionaryContextProvider } from "./providers/DictionaryContextProvider.tsx";
import { HistoryContextProvider } from "./providers/HistoryContextProvider.tsx";
import History from "./pages/History/index.tsx";
import { AbortContextProvider } from "./providers/AbortContextProvider.tsx";

function ENGGameRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NavBar>
              <GameMain />
            </NavBar>
          }
        />
        <Route
          path="/mylists"
          element={
            <NavBar>
              <MyLists />
            </NavBar>
          }
        />
        <Route path="/history" element={<NavBar><History/></NavBar>}/>
        <Route path="/testWik" element={<TestWiktionary />} />
        <Route path="/testRando" element={<TestRando />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AbortContextProvider>
      <DictionaryContextProvider>
        <HistoryContextProvider>
          <CssBaseline />
          <ENGGameRoutes />
        </HistoryContextProvider>
      </DictionaryContextProvider>
      </AbortContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
