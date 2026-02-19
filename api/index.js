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
  createdAt: { type: Date, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

// Get All Models
app.get('/api/get-all-models', async (req, res) => {
  try {
    const models = await ARModel.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Save or Update
app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await ARModel.findByIdAndUpdate(
        id,
        { baseColor, exposure },
        { new: true }
      );
      return res.json({ success: true, modelId: updated._id });
    } 
    
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor: baseColor || "#ffffff",
      exposure: exposure || 1
    });
    const saved = await newModel.save();
    res.json({ success: true, modelId: saved._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete
app.delete('/api/delete-model/:id', async (req, res) => {
  try {
    await ARModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Single
app.get('/api/get-config/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "Invalid ID" });
    const config = await ARModel.findById(req.params.id);
    if (!config) return res.status(404).json({ error: "Not Found" });
    res.json(config);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server Active ⚡`));