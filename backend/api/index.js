const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ar_models_store',
    resource_type: 'raw', // Mandatory for .glb
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage });

app.post('/api/upload-model', upload.single('model'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vercel handles the port, we just export the app
module.exports = app;