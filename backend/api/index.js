require('dotenv').config(); // Environment variables load karne ke liye
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🛠️ CLOUDINARY CONFIGURATION
// Pehle .env se check karega, agar nahi mili toh manual keys use karega
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'doa5h9wwi',
  api_key: process.env.CLOUD_API_KEY || '941973848597755',
  api_secret: process.env.CLOUD_API_SECRET || 'iVyLxSaLmVpOXvD9xDhvjegWKdA'
});

// Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📤 UPLOAD ROUTE
app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File upload nahi hui!" });
    }

    console.log("📤 Uploading to Cloudinary:", req.file.originalname);

    // Cloudinary Stream Upload
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: "raw", // GLB files ke liye 'raw' zaroori hai
        folder: "ar_models_store",
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          console.error("❌ CLOUDINARY ERROR:", error.message);
          return res.status(500).json({ error: error.message });
        }
        
        console.log("✅ UPLOAD SUCCESS:", result.secure_url);
        // Frontend ko Secure URL bhej rahe hain
        res.json({ url: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Health check route
app.get('/', (req, res) => res.send("AR Backend is Running! 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`--- Server Started ---`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`☁️  Cloudinary: ${process.env.CLOUD_NAME || 'doa5h9wwi'}`);
  console.log(`----------------------`);
});