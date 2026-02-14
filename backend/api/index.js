require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ar_models_store',
    resource_type: 'raw', 
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage });

// Health check route (Testing ke liye)
app.get('/api/health', (req, res) => {
  res.json({ status: "Backend is running!" });
});

// Upload Endpoint
app.post('/api/upload-model', upload.single('model'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File nahi mili!" });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ZAROORI: Vercel ke liye server listen nahi karna, sirf export karna hai
module.exports = app;