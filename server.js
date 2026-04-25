const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/analyze', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: image } },
          { type: "text", text: "Analiza este auto y responde SOLO JSON: {\"marca\":\"\",\"modelo\":\"\",\"año\":\"\",\"color\":\"\",\"ids\":[1,2,3],\"razon\":\"\"}." }
        ]
      }]
    });
    res.json(JSON.parse(response.content[0].text));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo`));
