const WORKER_URL = '/api/remove-bg';

const uploadArea = document.getElementById('uploadArea');
const uploadInner = document.getElementById('uploadInner');
const fileInput = document.getElementById('fileInput');
const btnUpload = document.getElementById('btnUpload');
const resultSection = document.getElementById('resultSection');
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const originalImg = document.getElementById('originalImg');
const resultImg = document.getElementById('resultImg');
const btnDownload = document.getElementById('btnDownload');
const btnReset = document.getElementById('btnReset');
const btnRetry = document.getElementById('btnRetry');
const errorMsg = document.getElementById('errorMsg');

let resultBlob = null;

btnUpload.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('click', (e) => { if (e.target !== btnUpload) fileInput.click(); });

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

btnReset.addEventListener('click', reset);
btnRetry.addEventListener('click', reset);
btnDownload.addEventListener('click', () => {
  if (!resultBlob) return;
  const url = URL.createObjectURL(resultBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'background-removed.png';
  a.click();
  URL.revokeObjectURL(url);
});

function reset() {
  resultSection.style.display = 'none';
  errorSection.style.display = 'none';
  uploadArea.style.display = 'block';
  fileInput.value = '';
  resultBlob = null;
}

function showError(msg) {
  loadingSection.style.display = 'none';
  errorSection.style.display = 'block';
  errorMsg.textContent = msg;
}

async function handleFile(file) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    alert('Please upload a JPG, PNG, or WebP image.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be under 10MB.');
    return;
  }

  uploadArea.style.display = 'none';
  loadingSection.style.display = 'block';
  resultSection.style.display = 'none';
  errorSection.style.display = 'none';

  // Show original preview
  const originalUrl = URL.createObjectURL(file);
  originalImg.src = originalUrl;

  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const res = await fetch(WORKER_URL, { method: 'POST', body: formData });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `API error ${res.status}`);
    }
    resultBlob = await res.blob();
    const resultUrl = URL.createObjectURL(resultBlob);
    resultImg.src = resultUrl;

    loadingSection.style.display = 'none';
    resultSection.style.display = 'block';
  } catch (err) {
    showError(err.message || 'Failed to remove background. Please try again.');
  }
}
