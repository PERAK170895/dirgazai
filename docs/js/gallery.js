const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');

// Ambil semua gambar dari backend
async function loadImages() {
  try {
    const res = await fetch('/api/kenangan');
    const result = await res.json();

    if (!result.success) {
      gallery.textContent = "Gagal mengambil gambar: " + result.error;
      return;
    }

    gallery.innerHTML = ''; // bersihkan dulu

    result.data.forEach(url => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('img-wrapper');

      const img = document.createElement('img');
      img.src = url;
      img.alt = "Kenangan";
      img.classList.add('thumb');

      // Ambil nama file dari URL
      const fileName = decodeURIComponent(url.split('/').pop());

      const delBtn = document.createElement('button');
      delBtn.textContent = "❌";
      delBtn.classList.add('delete-btn');
      delBtn.onclick = () => {
        if (confirm("Yakin hapus gambar ini?")) {
          deleteImage(fileName);
        }
      };

      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);
      gallery.appendChild(wrapper);
    });

  } catch (err) {
    gallery.textContent = "Error: " + err.message;
  }
}

// Upload gambar baru
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/kenangan/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await res.json();

  if (result.success) {
    alert("Upload berhasil!");
    loadImages(); // refresh galeri
  } else {
    alert("Upload gagal: " + result.error);
  }
}

// Hapus gambar
async function deleteImage(fileName) {
  const res = await fetch(`/api/kenangan/${encodeURIComponent(fileName)}`, { method: 'DELETE' });
  const result = await res.json();

  if (result.success) {
    alert("Gambar dihapus!");
    loadImages();
  } else {
    alert("Gagal hapus: " + result.error);
  }
}

// Event upload form
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (file) {
    await uploadImage(file);
    fileInput.value = ""; // reset input
  }
});

// Panggil saat halaman dibuka
loadImages();
