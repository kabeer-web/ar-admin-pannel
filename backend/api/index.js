const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

// 1. UPDATED CORS: Allow your specific Vercel URL
app.use(cors({
  origin: ["https://ar-admin-pannel.vercel.app", "http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST"]
}));

app.use(express.json());

cloudinary.config({
  cloud_name: 'doa5h9wwi',
  api_key: '941973848597755',
  api_secret: 'iVyLxSaLmVpOXvD9xDhvjegWKdA'
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File missing" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "ar_models_store" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. UPDATED PORT: Uses environment port for hosting services
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
