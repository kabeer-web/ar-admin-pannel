const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const os = require('os'); // To find your Local IP

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Config (Keep your credentials)
cloudinary.config({
  cloud_name: 'doa5h9wwi',
  api_key: '941973848597755',
  api_secret: 'iVyLxSaLmVpOXvD9xDhvjegWKdA'
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Route
app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File missing" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "ar_models_store" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: error.message });
        }
        // Result contains the secure_url we need
        res.json({ url: result.secure_url });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to get Local IP Address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const PORT = 5000;
const IP_ADDR = getLocalIp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`-----------------------------------------`);
  console.log(`Backend running! Use this URL in Frontend:`);
  console.log(`http://${IP_ADDR}:${PORT}`);
  console.log(`-----------------------------------------`);
});
