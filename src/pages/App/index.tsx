import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "../TestWiktionary";
import TestRando from "../TestRando";
import GameMain from "../Game";
import NavBar from "../../components/NavBar";
import { ThemeContext } from "../../ThemeContext.tsx";
// import "./index.module.css";

function App() {
  const [theme, setTheme] = useState<string>((localStorage.getItem("theme") === 'dark' ? 'dark' : 'light'));
  function toggleTheme() {
    const newTheme = (theme === 'light' ? 'dark' : 'light');
    setTheme(newTheme);
    localStorage.setItem("theme",newTheme);
  };

  return (
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
  );
}

export default App;
