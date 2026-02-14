require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Token direct setup
const HF_TOKEN = "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";

app.post('/api/generate', async (req, res) => {
    try {
        console.log("🚀 Sending request to NEW Router URL...");
        
        // Base64 clean karna
        const base64Image = req.body.image.split(',')[1];

        const response = await axios({
            method: 'post',
            // NAYI URL JO WO DEMAND KAR RAHE HAIN
            url: 'https://router.huggingface.co/hf-inference/models/openai/shap-e-img2img',
            headers: { 
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            // Naya Router format: data ke andar 'inputs' hona chahiye
            data: { inputs: base64Image }, 
            responseType: 'arraybuffer'
        });

        console.log("✅ 3D Model Received from Router!");
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
                return res.status(503).json({ error: "AI is warming up... wait 15s and try again!" });
            }
        }
        console.error("❌ Error Message:", error.message);
        res.status(500).json({ error: "Server error or busy. Try once more." });
    }
});

app.listen(5000, () => {
    console.log(`
    ====================================
    🔥 NEW ROUTER BACKEND IS LIVE
    URL: http://localhost:5000
    ====================================
    `);
});