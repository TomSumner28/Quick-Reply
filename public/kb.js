const fileList = document.getElementById('fileList');
const uploadForm = document.getElementById('uploadForm');
const modeToggle = document.getElementById('modeToggle');

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
      loadKnowledge();
    };
    li.appendChild(del);
    fileList.appendChild(li);
  });
}

uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  await fetch('/api/upload', { method: 'POST', body: formData });
  uploadForm.reset();
  loadKnowledge();
});

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

loadKnowledge();
