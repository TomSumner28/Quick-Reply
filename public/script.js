document.getElementById('askForm').addEventListener('submit', async (e) => {
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

    const data = await res.json();
    if (!res.ok) {
      resEl.textContent = data.error || 'Error';
      return;
    }

    resEl.textContent = data.answer || data.error;
  } catch (err) {
    resEl.textContent = 'Failed to fetch response';
  }
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
