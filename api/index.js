import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Matrix Database Connected ✅"))
  .catch(err => console.error("Database Connection Failed! ❌", err));

// 2. Schema
const ARModelSchema = new mongoose.Schema({
  modelName: String,
  publicUrl: String,
  baseColor: String,
  exposure: Number,
  ownerId: String,
  createdAt: { type: Date, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// 3. API Routes
app.get('/', (req, res) => res.send("Neural Link Online 🚀"));

// SAVE CONFIG (Hamesha naya record create karega taake ID conflict na ho)
app.post('/api/save-config', async (req, res) => {
  try {
    const { publicUrl, baseColor, exposure, ownerId } = req.body;
    
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor,
      exposure,
      ownerId: ownerId || "admin_1"
    });

    const savedRecord = await newModel.save();
    console.log("New Sync Saved:", savedRecord._id);
    res.json({ success: true, modelId: savedRecord._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CONFIG (QR Scan ke baad ye call hoga)
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Model not found" });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Invalid Link ID" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ⚡`));