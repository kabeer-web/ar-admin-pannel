import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Matrix DB Linked ✅"))
  .catch(err => console.error("DB Link Failed ❌", err));

// Schema
const ARModelSchema = new mongoose.Schema({
  modelName: String,
  publicUrl: String,
  baseColor: String,
  exposure: Number,
  ownerId: String,
  createdAt: { type: Date, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// API Routes
app.get('/', (req, res) => res.send("Neural Backend Online 🚀"));

// SAVE CONFIG: Har baar naya unique record banayega
app.post('/api/save-config', async (req, res) => {
  try {
    const { publicUrl, baseColor, exposure, ownerId } = req.body;
    const newModel = new ARModel({
      modelName: `Neural_Project_${Date.now()}`, // Har sync ek naya project hai
      publicUrl,
      baseColor,
      exposure,
      ownerId: ownerId || "admin_1"
    });
    const saved = await newModel.save();
    res.json({ success: true, modelId: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CONFIG
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Data not found" });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Matrix Server on Port ${PORT} ⚡`));