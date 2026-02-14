const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// Manual Config - No .env needed for now
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

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend live on port ${PORT}`));