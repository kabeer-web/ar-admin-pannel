import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI).then(() => console.log("Matrix DB Linked ✅"));

const ARModelSchema = new mongoose.Schema({
  modelName: String,
  publicUrl: String,
  baseColor: String,
  exposure: Number,
  ownerId: String,
  createdAt: { type: Date, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// --- ROUTES ---

// 1. Get All Models (Admin Dashboard ke liye)
app.get('/api/get-all-models', async (req, res) => {
  try {
    const models = await ARModel.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Save or Update Config
app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;
    if (id) {
      // Agar ID hai toh update karo
      const updated = await ARModel.findByIdAndUpdate(id, { baseColor, exposure }, { new: true });
      return res.json({ success: true, modelId: updated._id });
    }
    // Warna naya banao
    const newModel = new ARModel({
      modelName: `Neural_${Date.now()}`,
      publicUrl,
      baseColor,
      exposure,
      ownerId: "admin_1"
    });
    const saved = await newModel.save();
    res.json({ success: true, modelId: saved._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Delete Model
app.delete('/api/delete-model/:id', async (req, res) => {
  await ARModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 4. Get Single Config (AR View ke liye)
app.get('/api/get-config/:id', async (req, res) => {
  const config = await ARModel.findById(req.params.id);
  res.json(config);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Matrix Server Online ⚡`));