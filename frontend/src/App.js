import React, { useEffect, useState, useRef } from "react";
import ShortCard from "./components/ShortCard";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [tab, setTab] = useState("all"); // 'all' or 'saved'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const scrollTimeout = useRef(false);

  useEffect(() => {
    // Fetch all recipes
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error(err));

    // Fetch saved recipes (for demo: filter locally)
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => {
        const saved = data.filter((r) => r.saved); // assumes each recipe has a 'saved' boolean
        setSavedRecipes(saved);
      })
      .catch((err) => console.error(err));
  }, []);

  const currentList = tab === "all" ? recipes : savedRecipes;

  const goNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev < currentList.length - 1 ? prev + 1 : 0));
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : currentList.length - 1));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (scrollTimeout.current) return;

    if (e.deltaY > 10) goNext();
    else if (e.deltaY < -10) goPrev();

    scrollTimeout.current = true;
    setTimeout(() => (scrollTimeout.current = false), 250);
  };

  const handleTabClick = (selectedTab) => {
    setTab(selectedTab);
    setCurrentIndex(0);
  };

  return (
    <div
      onWheel={handleWheel}
      style={{
        background: "#fafafa",
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflow: "hidden",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, position: "fixed", top: 20, left: 20 }}>
        <button
          onClick={() => handleTabClick("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "12px 0 0 12px",
            border: "none",
            backgroundColor: tab === "all" ? "blue" : "lightgray",
            color: "white",
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => handleTabClick("saved")}
          style={{
            padding: "8px 16px",
            borderRadius: "0 12px 12px 0",
            border: "none",
            backgroundColor: tab === "saved" ? "red" : "lightgray",
            color: "white",
            cursor: "pointer",
          }}
        >
          Saved
        </button>
      </div>

      {/* Video list */}
      {currentList.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentList[currentIndex].id}
            style={{
              width: "100%",
              maxWidth: 520,
              height: "70vh",
              borderRadius: 16,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => {
              const offset = info.offset.y;
              const velocity = info.velocity.y;
              const swipeThreshold = 180;
              const velocityThreshold = 1000;

              if (offset < -swipeThreshold || velocity < -velocityThreshold) {
                setDirection(-1);
                goNext();
              } else if (offset > swipeThreshold || velocity > velocityThreshold) {
                setDirection(1);
                goPrev();
              }
            }}
            initial={{ opacity: 0, y: direction * 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: direction * (window.innerHeight + 200),
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <ShortCard
              recipe={currentList[currentIndex]}
              onNext={() => {
                setDirection(1);
                goNext();
              }}
              onPrev={() => {
                setDirection(-1);
                goPrev();
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <p>Loading recipes...</p>
      )}
    </div>
  );
}

export default App;
