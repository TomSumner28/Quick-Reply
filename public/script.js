const askForm = document.getElementById('askForm');
if (askForm) {
  askForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('inputText').value;
    const resEl = document.getElementById('response');
    resEl.textContent = 'Loading...';

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        let message = 'Error';
        try {
          const data = await res.json();
          message = data.error || message;
        } catch (e) {
          message = await res.text();
        }
        resEl.textContent = message;
        return;
      }

      const data = await res.json();
      resEl.textContent = data.answer || 'No response';
    } catch (err) {
      resEl.textContent = 'Failed to fetch response';
    }
  });
}


const modeToggle = document.getElementById('modeToggle');
if (modeToggle) {
  modeToggle.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('light')) {
      body.classList.remove('light');
      body.classList.add('dark');
      modeToggle.textContent = 'Light Mode';
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
      modeToggle.textContent = 'Dark Mode';
    }
  });
}

// Knowledge page functionality
const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');

async function loadFiles() {
  if (!fileList) return;
  fileList.innerHTML = '';
  try {
    const res = await fetch('/api/knowledge');
    const data = await res.json();
    data.files.forEach((name) => {
      const li = document.createElement('li');
      li.textContent = name;
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        await fetch(`/api/knowledge/${encodeURIComponent(name)}`, { method: 'DELETE' });
        loadFiles();
      });
      li.appendChild(del);
      fileList.appendChild(li);
    });
  } catch (err) {
    fileList.textContent = 'Failed to load files';
  }
}

if (uploadForm) {
  loadFiles();
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('fileInput');
    if (!input.files.length) return;
    const fd = new FormData();
    fd.append('file', input.files[0]);
    await fetch('/api/knowledge', { method: 'POST', body: fd });
    input.value = '';
    loadFiles();
  });
}
