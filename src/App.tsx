import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HelloReact from './HelloReact.tsx';
import TestWiktionaryAPI from './TestWiktionaryAPI.tsx';
import TestRandoAPI from './TestRandoAPI.tsx';
import GameMain from './GameMain.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloReact/>}/>
        <Route path="/testWik" element={<TestWiktionaryAPI/>}/>
        <Route path="/testRando" element={<TestRandoAPI/>}/>
        <Route path="/game" element={<GameMain/>}/>
      </Routes>
    </Router>
  )
}

export default App
