import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "../TestWiktionary";
import TestRando from "../TestRando";
import GameMain from "../Game";
import MyLists from "../MyLists";
import NavBar from "../../components/NavBar";
import { ThemeContext } from "../../ThemeContext.tsx";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#222222"
    },
    // primary: {
    //   main: '#111111',
    // },
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
  
  useEffect(()=>{
    // let testList = localStorage.getItem("TOEIC 600");
    let listArr:string[] = [];
    // if(testList === null){
      listArr = ["accommodate","accounting","actually","additional","administration","advance","advertising","afford","analyst","annual","appear","applicant","appreciate","architect","assess","attend","attract","benefit","budget","cater","colleague","compare","complicated","concern","conference","consumer","contract","current","decide","delay","delighted","department","designate","develop","donate","eliminate","encourage","enroll","estate","exceed","except","executive","exhibit","expect","expertise","explain","facility","fail","familiar","feature","fee","figure","frequent","further","handle","identification","improve","include","inquire","instantly","insurance","invest","invite","invoice","involve","luggage","manufacture","miss","notice","offer","owe","participate","passenger","plenty","preservation","previous","proceed","promote","prosperous","provide","publicity","recommend","refund","remind","remove","replacement","representative","reservation","responsible","result","review","severe","shipment","shortage","store","survey","transportation","voucher","workplace","workshop",];
    // } else {
    //   listArr = JSON.parse(testList);
    // }
    localStorage.setItem("TOEIC 600",JSON.stringify(listArr));
    localStorage.setItem("MyLists", JSON.stringify(["TOEIC 600"]));
  },[]);

  return (
    <ThemeProvider theme={theme==="light"?lightTheme:darkTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={{theme, toggleTheme}}>
            <Router>
              <Routes>
                <Route path="/" element={<NavBar><GameMain /></NavBar>} />
                <Route path="/mylists" element={<NavBar><MyLists /></NavBar>} />
                <Route path="/testWik" element={<TestWiktionary />} />
                <Route path="/testRando" element={<TestRando />} />
              </Routes>
            </Router>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
