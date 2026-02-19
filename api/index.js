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
  lastUpdated: { type: Number, default: Date.now } // Cache Buster for AR View
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// --- ROUTES ---

// 1. Get All Models (Library ke liye)
app.get('/api/get-all-models', async (req, res) => {
  try {
    const models = await ARModel.find().sort({ lastUpdated: -1 });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. SAVE OR UPDATE (Ye asli fix hai)
app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;

    // Agar ID hai toh UPDATE karo
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await ARModel.findByIdAndUpdate(
        id,
        { 
          baseColor, 
          exposure, 
          lastUpdated: Date.now() // Timestamp update ho raha hai taake cache clear ho
        },
        { new: true }
      );
      console.log("Model Updated Successfully:", id);
      return res.json({ success: true, modelId: updated._id });
    } 
    
    // Agar ID nahi hai toh NAYA banao
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor: baseColor || "#ffffff",
      exposure: exposure || 1,
      ownerId: "admin_1"
    });

    const saved = await newModel.save();
    console.log("New Model Created Successfully");
    res.json({ success: true, modelId: saved._id });

  } catch (err) {
    console.error("Save/Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Single Config (AR View ke liye - No Cache version)
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Data not found" });
    
    // Browser ko bolna ke ye data refresh kare
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});

// 4. Delete Model
app.delete('/api/delete-model/:id', async (req, res) => {
  try {
    await ARModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Matrix Server Online on Port ${PORT} ⚡`));