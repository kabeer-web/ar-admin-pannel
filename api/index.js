const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// Match these EXACTLY with your Vercel Environment Variable Keys
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    // Use resource_type: "auto" or "raw" for .glb files
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "ar_models_store" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Cloudinary Error: " + error.message });
        }
        res.json({ url: result.secure_url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Server Crash:", err);
    res.status(500).json({ error: "Server Crash: " + err.message });
  }
});

module.exports = app;