import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Matrix DB Linked ✅"))
  .catch(err => console.error("DB Link Failed ❌", err));

// --- SCHEMA DEFINITION ---
const ARModelSchema = new mongoose.Schema({
  modelName: String,
  publicUrl: String,
  baseColor: String,
  exposure: Number,
  ownerId: { type: String, default: "admin_1" },
  lastUpdated: { type: Number, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// --- API ROUTES ---

// 1. Get All Models (Library ke liye)
app.get('/api/get-all-models', async (req, res) => {
  try {
    // Fresh data ke liye hamesha sorted by update time
    const models = await ARModel.find().sort({ lastUpdated: -1 });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Save or Update Configuration (The Fixed Route)
app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;

    // Agar ID valid hai toh Atlas mein update maaro
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await ARModel.findByIdAndUpdate(
        id,
        { 
          $set: { 
            baseColor: baseColor, 
            exposure: exposure, 
            lastUpdated: Date.now() 
          } 
        },
        { new: true, upsert: false }
      );

      if (updated) {
        console.log("Database Updated ✅ ID:", updated._id);
        return res.json({ success: true, modelId: updated._id });
      }
    } 
    
    // Agar ID nahi hai ya valid nahi hai toh naya banao
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor: baseColor || "#ffffff",
      exposure: exposure || 1,
      lastUpdated: Date.now()
    });

    const saved = await newModel.save();
    console.log("New Entry Created in Atlas ✅");
    res.json({ success: true, modelId: saved._id });

  } catch (err) {
    console.error("Critical Save Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Single Config (AR View/Scanner ke liye)
app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Data not found" });
    
    // Browser cache kill karne ke liye headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Invalid Matrix ID" });
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

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    🚀 NEURAL CORE ONLINE
    📡 PORT: ${PORT}
    🔗 DB: Connected
  `);
});