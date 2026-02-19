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

// 1. Get All Models
app.get('/api/get-all-models', async (req, res) => {
  try {
    const models = await ARModel.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. SAVE OR UPDATE (The Core Fix)
app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;

    // Check agar id exist karti hai to UPDATE karo
    if (id && id !== "pending") {
      const updated = await ARModel.findByIdAndUpdate(
        id,
        { baseColor, exposure }, // Editing mein sirf ye badalte hain
        { new: true }
      );
      console.log("Updated Model:", id);
      return res.json({ success: true, modelId: updated._id });
    } 
    
    // Warna Naya Banao
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor,
      exposure,
      ownerId: "admin_1"
    });
    const saved = await newModel.save();
    console.log("New Model Created");
    res.json({ success: true, modelId: saved._id });

  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Delete
app.delete('/api/delete-model/:id', async (req, res) => {
  await ARModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 4. Single Config for AR View
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    res.json(config);
  } catch (err) { res.status(404).json({ error: "Not found" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server Active ⚡`));