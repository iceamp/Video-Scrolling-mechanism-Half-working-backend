// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import recipes from "./recipes.js"; // your recipes file

let savedVideos = [];

app.get("/recipes", (req, res) => {
  res.json(recipes);
});

// Save a recipe
app.post("/api/save", (req, res) => {
  const { videoId, recipe } = req.body;
  if (!savedVideos.find(r => r.id === videoId)) {
    savedVideos.push(recipe);
  }
  res.json({ success: true, savedVideos });
});

// Get saved recipes
app.get("/api/saved", (req, res) => {
  res.json(savedVideos);
});

// Delete a saved recipe
app.delete("/api/save/:videoId", (req, res) => {
  const { videoId } = req.params;
  savedVideos = savedVideos.filter(r => r.id !== String(videoId));
  res.json({ success: true, savedVideos });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
