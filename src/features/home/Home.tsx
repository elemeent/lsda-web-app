import { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const [animalImage, setAnimalImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        // Fetch random cat image as a cute alternative to monkeys
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search",
        );
        const data = await response.json();
        if (data[0]?.url) {
          setAnimalImage(data[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch animal:", error);
        // Fallback to a placeholder
        setAnimalImage(
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, []);

  const refreshAnimal = () => {
    setLoading(true);
    const fetchAnimal = async () => {
      try {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search",
        );
        const data = await response.json();
        if (data[0]?.url) {
          setAnimalImage(data[0].url);
        }
      } catch (error) {
        console.error("Failed to fetch animal:", error);
        setAnimalImage(
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">🚀 Coming Soon!</h1>
        <p className="home-subtitle">
          Element's Master Workspace Under Construction
        </p>
        <p className="home-message">
          Element is currently crushing it on the backend. This page is being
          redesigned to impress. For now, enjoy this adorable animal! 🐾
        </p>

        {animalImage && (
          <img src={animalImage} alt="Cute animal" className="home-animal" />
        )}

        {loading ? (
          <div className="home-spinner" />
        ) : (
          <button onClick={refreshAnimal} className="home-refresh-button">
            Show Me Another! 🔄
          </button>
        )}

        <p className="home-footer">
          In the meantime, check out the{" "}
          <a href="/template-generator" className="home-footer-link">
            Template Generator
          </a>
          !
        </p>
      </div>
    </div>
  );
}

export default Home;
