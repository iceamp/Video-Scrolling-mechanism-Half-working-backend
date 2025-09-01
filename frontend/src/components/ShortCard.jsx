import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ShortCard({ recipe, onPrev, onNext }) {
  const [likedSaved, setLikedSaved] = useState(false);

  // Check if this video is already saved
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/saved");
        if (res.data.includes(recipe?.id)) {
          setLikedSaved(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaved();
  }, [recipe?.id]);

  const toggleSave = async () => {
    console.log("Saving recipe ID:", recipe?.id);

  if (!recipe?.id) {
    console.error("No recipe id found!");
    return;
  }

  try {
    if (!likedSaved) {
      const res = await axios.post("http://localhost:5000/api/save", { videoId: recipe.id });
      if (res.data.success) setLikedSaved(true);
    } else {
      const res = await axios.delete(`http://localhost:5000/api/save/${recipe.id}`);
      if (res.data.success) setLikedSaved(false);
    }
  } catch (err) {
    console.error("Error saving video:", err);
  }
};



  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        borderRadius: 16,
        border: "1px solid #ddd",
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ background: "#000", height: "70vh" }}>
        <video
          src={recipe?.videoUrl}
          poster={recipe?.thumbnail}
          controls
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: 12, display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{recipe?.title || "Untitled"}</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button
  onClick={() => toggleSave(recipe.id)}
  style={{
    flex: "0 0 auto",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #ccc",
    background: recipe.saved ? "#ffeaea" : "#fff",
    cursor: "pointer",
  }}
  title="Save"
>
  {recipe.saved ? "♥ Saved" : "♡ Save"}
</button>


          <button
            onClick={onPrev || (() => console.log("prev"))}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
            title="Previous"
          >
            ↑
          </button>
          <button
            onClick={onNext || (() => console.log("next"))}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
            title="Next"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
