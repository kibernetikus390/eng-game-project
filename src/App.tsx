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
          path={import.meta.env.BASE_URL}
          element={
            <NavBar>
              <GameMain />
            </NavBar>
          }
        />
        <Route
          path={import.meta.env.BASE_URL+ "mylists"}
          element={
            <NavBar>
              <MyLists />
            </NavBar>
          }
        />
        <Route path={import.meta.env.BASE_URL+ "history"} element={<NavBar><History/></NavBar>}/>
        <Route path={import.meta.env.BASE_URL+ "testWik"} element={<TestWiktionary />} />
        <Route path={import.meta.env.BASE_URL+ "testRando"} element={<TestRando />} />
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
