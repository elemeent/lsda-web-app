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
    </Router>
  );
}

export default App;
