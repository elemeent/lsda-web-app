import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode was previously saved
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      const darkMode = JSON.parse(saved);
      setIsDarkMode(darkMode);
      document.documentElement.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light",
      );
    }
  }, []);

  const toggleDarkMode = () => {
    const newState = !isDarkMode;
    setIsDarkMode(newState);
    localStorage.setItem("darkMode", JSON.stringify(newState));
    document.documentElement.setAttribute(
      "data-theme",
      newState ? "dark" : "light",
    );
  };

  return (
    <>
      <nav>
        <div className="nav-content">
          <h2>LSDA Web App</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/template-generator">Template Generator</Link>
            </li>
          </ul>
        </div>
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
