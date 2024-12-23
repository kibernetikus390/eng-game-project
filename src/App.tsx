import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "./pages/TestWiktionary/index.tsx";
import TestRando from "./pages/TestRando/index.tsx";
import GameMain from "./pages/Game/index.tsx";
import MyLists from "./pages/MyLists/index.tsx";
import NavBar from "./components/NavBar/index.tsx";

import CssBaseline from "@mui/material/CssBaseline";

import { ThemeContextProvider } from "./providers/ThemeContextProvider.tsx";
import { DictionaryContextProvider } from "./providers/DictionaryContextProvider.tsx";

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
        <Route path="/testWik" element={<TestWiktionary />} />
        <Route path="/testRando" element={<TestRando />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <DictionaryContextProvider>
        <CssBaseline />
        <ENGGameRoutes />
      </DictionaryContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
