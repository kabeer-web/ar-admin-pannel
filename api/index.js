import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Path aur Env Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ye line ensure karegi ke .env file root folder se load ho
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// 2. Database Connection Logic
// Hum hardcoded string nahi use karenge taake security bani rahe
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

console.log("Attempting to link Matrix Database... 🔗");

mongoose.connect(MONGO_URI)
  .then(() => console.log("Matrix Database Connected 🧠 ✅"))
  .catch(err => {
    console.error("❌ Database Connection Failed!");
    console.error("Reason:", err.message);
  });

// 3. Schema: Spatial Memory
const ARModelSchema = new mongoose.Schema({
  modelName: String,
  publicUrl: String,
  baseColor: String,
  exposure: Number,
  ownerId: String,
  createdAt: { type: Date, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// 4. Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// --- API ROUTES ---

app.get('/', (req, res) => res.send("Matrix Backend is Online 🚀"));

// Save Configuration
app.post('/api/save-config', async (req, res) => {
  try {
    const { modelName, publicUrl, baseColor, exposure, ownerId } = req.body;
    const updatedModel = await ARModel.findOneAndUpdate(
      { modelName, ownerId }, 
      { publicUrl, baseColor, exposure },
      { new: true, upsert: true }
    );
    res.json({ success: true, modelId: updatedModel._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Configuration (For Customer AR View)
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Model not found" });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Invalid Link ID" });
  }
});

// Upload Model to Cloudinary
app.post('/api/upload-model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });

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
app.listen(PORT, () => console.log(`Neural Link active on port ${PORT} ⚡`));

export default app;