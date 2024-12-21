import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "../TestWiktionary";
import TestRando from "../TestRando";
import GameMain from "../Game";
import NavBar from "../../components/NavBar";
import { ThemeContext } from "../../ThemeContext.tsx";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [theme, setTheme] = useState<string>(initDarkMode());
  function toggleTheme() {
    const newTheme = (theme === 'light' ? 'dark' : 'light');
    setTheme(newTheme);
    localStorage.setItem("theme",newTheme);
  };

  function initDarkMode() {
    const isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    if(storedTheme == undefined) {
      return isSystemDarkMode ? "dark" : "light";
    }
    return storedTheme;
  }

  return (
    <ThemeProvider theme={theme==="light"?lightTheme:darkTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <NavBar>
          <Router>
            <Routes>
              <Route path="/" element={<GameMain />} />
              <Route path="/testWik" element={<TestWiktionary />} />
              <Route path="/testRando" element={<TestRando />} />
            </Routes>
          </Router>
        </NavBar>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
