const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { analyzeEmail } = require("./geminiService");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.post("/api/analyze-text", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await analyzeEmail(text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze text" });
  }
});

app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    const result = await analyzeEmail(
      "Analyze this email image",
      req.file.buffer,
      req.file.mimetype
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
