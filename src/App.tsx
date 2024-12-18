import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HelloReact from './HelloReact.tsx';
import TestWiktionaryAPI from './TestWiktionaryAPI.tsx';
import TestRandoAPI from './TestRandoAPI.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloReact/>}/>
        <Route path="/testWik" element={<TestWiktionaryAPI/>}/>
        <Route path="/testRando" element={<TestRandoAPI/>}/>
      </Routes>
    </Router>
  )
}

export default App
