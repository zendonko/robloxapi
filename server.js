const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// Ваш API-ключ OpenRouter
const OPENROUTER_API_KEY = 'your-openrouter-api-key'; // Замените на ваш ключ
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Эндпоинт для обработки запросов от Roblox
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(OPENROUTER_URL, {
            model: 'gpt-3.5-turbo', // Или другой доступный модель
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const generatedText = response.data.choices[0].message.content;
        // Пример парсинга ответа (зависит от формата, возвращаемого нейросетью)
        const luck = parseInt(generatedText.match(/Luck: (\d+)/)?.[1] || 50);
        const name = generatedText.match(/Name: ([^\n]+)/)?.[1] || 'Mystery Item';
        const visual = generatedText.match(/Visual: ([^\n]+)/)?.[1] || 'Color: Blue, Texture: Metal, Shape: Cube';

        res.json({
            success: true,
            luck,
            name,
            visual
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
