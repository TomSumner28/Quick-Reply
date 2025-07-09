document.getElementById('askForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('inputText').value;
  const resEl = document.getElementById('response');
  resEl.textContent = 'Loading...';

  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  resEl.textContent = data.answer || data.error;
});

const kbModal = document.getElementById('kbModal');
const kbBtn = document.getElementById('kbBtn');
const closeKb = document.getElementById('closeKb');
const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');

async function loadKnowledge() {
  fileList.innerHTML = '';
  const res = await fetch('/api/knowledge');
  const files = await res.json();
  files.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.name + ' ';
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.onclick = async () => {
      await fetch(`/api/knowledge/${f.id}`, { method: 'DELETE' });
      li.remove();
    };
    li.appendChild(del);
    fileList.appendChild(li);
  });
}

kbBtn.onclick = () => {
  kbModal.classList.remove('hidden');
  loadKnowledge();
};
closeKb.onclick = () => kbModal.classList.add('hidden');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  await res.json();
  loadKnowledge();
});

const modeToggle = document.getElementById('modeToggle');
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
