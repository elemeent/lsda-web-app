import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import TemplateGenerator from "./features/template-generator/TemplateGenerator";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router basename="/lsda-web-app/">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template-generator" element={<TemplateGenerator />} />
      </Routes>
      <footer className="py-6 text-center font-mono text-[0.65rem] tracking-widest text-navy-700 select-none">
        made with <span className="text-red-500">♥</span> by element
      </footer>
    </Router>
  );
}

export default App;
