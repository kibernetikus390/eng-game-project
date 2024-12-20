import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestWiktionary from "../TestWiktionary/index.tsx";
import TestRando from "../TestRando/index.tsx";
import GameMain from "../Game/index.tsx";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<GameMain />} />
        <Route path="/testWik" element={<TestWiktionary />} />
        <Route path="/testRando" element={<TestRando />} />
      </Routes>
    </Router>
  );
}

export default App;
