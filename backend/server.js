require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Token ko environment variable se le rahe hain (Security ke liye)
const HF_TOKEN = process.env.HF_TOKEN;

app.post('/api/generate', async (req, res) => {
    try {
        if (!HF_TOKEN) {
            return res.status(500).json({ error: "HF_TOKEN is missing in .env file!" });
        }

        console.log("🚀 Sending request to Hugging Face Router...");
        
        const base64Image = req.body.image.split(',')[1];

        const response = await axios({
            method: 'post',
            url: 'https://router.huggingface.co/hf-inference/models/openai/shap-e-img2img',
            headers: { 
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: { inputs: base64Image }, 
            responseType: 'arraybuffer'
        });

        console.log("✅ 3D Model Received!");
        const modelBase64 = Buffer.from(response.data, 'binary').toString('base64');
        
        res.json({ 
            status: 'succeeded', 
            model: `data:model/gltf-binary;base64,${modelBase64}` 
        });

    } catch (error) {
        if (error.response) {
            const errStr = Buffer.from(error.response.data).toString();
            console.error("❌ Detail:", errStr);
            
            if (errStr.includes("loading")) {
                return res.status(503).json({ error: "AI is warming up... wait 15s!" });
            }
        }
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: "Server error. Try again." });
    }
});

app.listen(5000, () => {
    console.log(`🔥 Backend Live: http://localhost:5000`);
});