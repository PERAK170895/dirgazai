const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const previewContainer = document.getElementById('preview'); // optional

// Preview gambar sebelum upload
fileInput.addEventListener('change', () => {
  if (!fileInput.files.length) return;
  const file = fileInput.files[0];
  if (previewContainer) {
    previewContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '200px';
    img.style.marginTop = '10px';
    previewContainer.appendChild(img);
  }
});

// Upload via API Express
uploadBtn.addEventListener('click', async () => {
  if (!fileInput.files.length) {
    alert("Pilih file dulu!");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
  const res = await fetch('http://localhost:3000/api/kenangan/upload', {
  method: 'POST',
  body: formData
});


    const result = await res.json();

    if (res.ok) {
      status.textContent = "Upload berhasil!";
      if (previewContainer && result.url) {
        const link = document.createElement('a');
        link.href = result.url;
        link.target = '_blank';
        link.textContent = 'Lihat Gambar';
        previewContainer.appendChild(link);
      }
    } else {
      status.textContent = "Upload gagal: " + result.error;
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Upload gagal: " + err.message;
  }
});
