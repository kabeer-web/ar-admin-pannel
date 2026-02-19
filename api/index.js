app.post('/api/save-config', async (req, res) => {
  try {
    const { id, publicUrl, baseColor, exposure } = req.body;

    // Check if we are updating an existing entry
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
        { new: true, upsert: false } // upsert false taake sirf existing update ho
      );

      if (updated) {
        console.log("Database Updated ✅ ID:", updated._id);
        return res.json({ success: true, modelId: updated._id });
      }
    } 
    
    // Agar ID nahi hai toh Naya entry banao
    const newModel = new ARModel({
      modelName: `Project_${Date.now()}`,
      publicUrl,
      baseColor: baseColor || "#ffffff",
      exposure: exposure || 1,
      ownerId: "admin_1",
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