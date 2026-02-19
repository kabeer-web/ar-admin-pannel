import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://beeraiadmin:aimannaz123@beeraichat.exgnszg.mongodb.net/MatrixDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI).then(() => console.log("DB Connected ✅"));

const ARModelSchema = new mongoose.Schema({
  publicUrl: String,
  exposure: { type: Number, default: 1 },
  lastUpdated: { type: Number, default: Date.now }
});

const ARModel = mongoose.model('ARModel', ARModelSchema);

app.get('/api/get-all-models', async (req, res) => {
  const models = await ARModel.find().sort({ lastUpdated: -1 });
  res.json(models);
});

app.post('/api/save-config', async (req, res) => {
  try {
    const { publicUrl, exposure } = req.body;
    const newModel = new ARModel({ publicUrl, exposure, lastUpdated: Date.now() });
    const saved = await newModel.save();
    res.json({ success: true, modelId: saved._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/get-config/:id', async (req, res) => {
  try {
    const config = await ARModel.findById(req.params.id);
    res.setHeader('Cache-Control', 'no-cache');
    res.json(config);
  } catch (err) { res.status(500).json({ error: "Not found" }); }
});

app.delete('/api/delete-model/:id', async (req, res) => {
  await ARModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(process.env.PORT || 5000, () => console.log("Server Running"));