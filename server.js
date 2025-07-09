const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let knowledgeBase = [];

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = path.join(__dirname, req.file.path);
  knowledgeBase.push(filePath);
  res.json({ status: 'success', path: filePath });
});

app.post('/api/ask', async (req, res) => {
  const { email, question } = req.body;
  if (!email || !question) {
    return res.status(400).json({ error: 'Email and question required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    let docsText = '';
    for (const file of knowledgeBase) {
      try {
        docsText += fs.readFileSync(file, 'utf8') + '\n';
      } catch (e) {
        console.error('Error reading', file, e);
      }
    }

    const prompt = `Documents:\n${docsText}\n\nQuestion from ${email}: ${question}`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ answer: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
