require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

const knowledge = new Map();

function loadFile(file) {
  try {
    const content = fs.readFileSync(path.join(uploadsDir, file), 'utf8');
    knowledge.set(file, content);
  } catch (e) {
    console.error('Failed to load', file, e);
  }
}

fs.readdirSync(uploadsDir).forEach(loadFile);

app.post('/api/ask', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const openai = new OpenAI({ apiKey });
    let docs = Array.from(knowledge.values()).join('\n\n');
    docs = docs.slice(0, 2000);
    const messages = [
      { role: 'system', content: 'You are a helpful assistant for The Reward Collection. Use the provided documents and information from www.therewardcollection.com when relevant.' },
    ];
    if (docs) {
      messages.push({ role: 'system', content: `Company documents:\n${docs}` });
    }
    messages.push({
      role: 'user',
      content:
        `The following text may be an email or a general question. ` +
        `If it is an email, craft a polite and professional reply. ` +
        `Otherwise, provide an answer to the question.\n\nText: ${text}`
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to process question' });
  }
});

app.get('/api/knowledge', (req, res) => {
  res.json({ files: Array.from(knowledge.keys()) });
});

app.post('/api/knowledge', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File required' });
  loadFile(req.file.filename);
  res.json({ success: true });
});

app.delete('/api/knowledge/:name', (req, res) => {
  const name = req.params.name;
  if (!knowledge.has(name)) return res.status(404).json({ error: 'Not found' });
  knowledge.delete(name);
  fs.unlink(path.join(uploadsDir, name), (err) => {
    if (err) console.error('Failed to delete', name, err);
  });
  res.json({ success: true });
});

app.get('/knowledge.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'knowledge.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
