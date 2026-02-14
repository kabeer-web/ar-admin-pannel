require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Setting up storage for 3D Models (.glb)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ar_models_store',
    resource_type: 'raw', // ZAROORI: .glb files ke liye 'raw' use hota hai
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload-model', upload.single('model'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File upload fail ho gayi!" });
    }
    // Cloudinary ka direct HTTPS link return karega
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;