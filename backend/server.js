require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // <--- Naya add karo
const path = require('path');    // <--- Naya add karo
const fs = require('fs');        // <--- Folder check karne ke liye

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. Uploads Folder Setup ---
// Agar 'uploads' folder nahi hai toh bana dega
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Laptop/Phone ko images access karne ki permission dena
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. Multer Storage Logic ---
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // File ka naam unique banana: time-filename.glb
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- 3. API Endpoint ---
app.post('/api/upload-model', upload.single('model'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Ye URL aapke phone mein load hoga
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  console.log("✅ File Saved at:", fileUrl);
  res.json({ url: fileUrl });
});

// Aapka purana /api/generate wala code yahan chalta rahega...
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    🚀 Backend is accessible on:
    Local:   http://localhost:${PORT}
    Network: http://YOUR_IP_HERE:${PORT}
    `);
});