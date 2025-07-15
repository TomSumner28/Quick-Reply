document.getElementById('askForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const question = document.getElementById('question').value;
  const resEl = document.getElementById('response');
  resEl.textContent = 'Loading...';

  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, question })
  });

  const data = await res.json();
  resEl.textContent = data.answer || data.error;
});

const kbModal = document.getElementById('kbModal');
const kbBtn = document.getElementById('kbBtn');
const closeKb = document.getElementById('closeKb');
const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');
const excelForm = document.getElementById('excelForm');
const metricsEl = document.getElementById('metricsData');

kbBtn.onclick = () => kbModal.classList.remove('hidden');
closeKb.onclick = () => kbModal.classList.add('hidden');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  const li = document.createElement('li');
  li.textContent = data.path || data.error;
  fileList.appendChild(li);
});

excelForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const file = document.getElementById('excelFile').files[0];
  if (!file) return;
  formData.append('file', file);
  const res = await fetch('/api/upload-excel', { method: 'POST', body: formData });
  await res.json();
  fetchMetrics();
});

async function fetchMetrics() {
  const res = await fetch('/api/metrics');
  const data = await res.json();
  metricsEl.textContent = JSON.stringify(data, null, 2);
}

fetchMetrics();

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
