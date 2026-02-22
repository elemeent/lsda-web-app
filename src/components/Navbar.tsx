import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const darkModeInitialStatus =
    JSON.parse(localStorage.getItem("darkMode") || "false") || false;

  const [isDarkMode, setIsDarkMode] = useState(darkModeInitialStatus);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
  });

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
          <Link to="/">
            <h2>LSDA Web App</h2>
          </Link>
          <ul>
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
