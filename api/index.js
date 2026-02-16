const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'doa5h9wwi',
  api_key: '941973848597755',
  api_secret: 'iVyLxSaLmVpOXvD9xDhvjegWKdA'
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API Route
app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received by the server." });
    }

    // Uploading to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "ar_models_store" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Cloudinary: " + error.message });
        }
        res.json({ url: result.secure_url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("General Server Error:", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// IMPORTANT: Vercel serverless function needs this
module.exports = app;