
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Ваш API-ключ OpenRouter
const OPENROUTER_API_KEY = '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'; // Замените на ваш ключ
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Эндпоинт для обработки запросов от Roblox
app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(OPENROUTER_URL, {
            model: 'deepseek/deepseek-r1-0528:free', // Или другой доступный модель
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const generatedText = response.data.choices[0].message.content;
        console.log('OpenRouter response:', generatedText);

        // Парсинг ответа
        const luck = parseInt(generatedText.match(/Luck: (\d+)/)?.[1] || 50);
        const name = generatedText.match(/Name: ([^\n]+)/)?.[1] || 'Mystery Item';
        const visual = generatedText.match(/Visual: ([^\n]+)/)?.[1] || 'Color: Blue, Texture: Metal, Shape: Cube';

        console.log('Parsed response:', { luck, name, visual });

        res.json({
            success: true,
            luck,
            name,
            visual
        });
    } catch (error) {
        console.error('Error in /generate:', error.message);
        if (error.response) {
            console.error('OpenRouter response:', error.response.data);
            res.status(500).json({ success: false, error: error.response.data.message || 'OpenRouter API error' });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
