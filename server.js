require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/ask', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const openai = new OpenAI({ apiKey });
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant. If the user text looks like an email, craft a polite and professional reply. Otherwise answer the question.'
      },
      { role: 'user', content: text }
    ];
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
