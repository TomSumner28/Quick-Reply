require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/knowledge', (req, res) => {
  res.sendFile('knowledge.html', { root: path.join(__dirname, 'public') });
});

let knowledgeBase = [];

function loadExistingFiles() {
  knowledgeBase = [];
  const files = fs.readdirSync(uploadDir);
  for (const file of files) {
    const match = file.match(/^\d+_(.+)$/);
    const name = match ? match[1] : file;
    knowledgeBase.push({ path: path.join(uploadDir, file), name });
  }
}

loadExistingFiles();

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = req.file.path;
  knowledgeBase.push({ path: filePath, name: req.file.originalname });
  res.json({
    status: 'success',
    file: { id: knowledgeBase.length - 1, name: req.file.originalname }
  });
});

app.get('/api/knowledge', (req, res) => {
  const files = knowledgeBase.map((f, i) => ({ id: i, name: f.name }));
  res.json(files);
});

app.delete('/api/knowledge/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const file = knowledgeBase[id];
  if (!file) {
    return res.status(404).json({ error: 'Not found' });
  }
  fs.unlink(file.path, () => {});
  knowledgeBase.splice(id, 1);
  res.json({ status: 'deleted' });
});

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
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    let docsText = '';
    for (const file of knowledgeBase) {
      try {
        docsText += fs.readFileSync(file.path, 'utf8') + '\n';
      } catch (e) {
        console.error('Error reading', file.path, e);
      }
    }

    const prompt = `You are an assistant for The Reward Collection (www.therewardcollection.com).\n` +
      `Use the following knowledge base documents when relevant:\n${docsText}\n\n` +
      `User input: ${text}\n` +
      `If the input is an email, craft a professional reply. Otherwise, answer the question.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ answer: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to process question' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
