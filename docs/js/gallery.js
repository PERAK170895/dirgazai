const SUPABASE_URL = 'https://<YOUR_SUPABASE_PROJECT>.supabase.co';
const SUPABASE_KEY = '<YOUR_SUPABASE_ANON_KEY>';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const gallery = document.getElementById('gallery');

async function loadImages() {
  const { data, error } = await supabase
    .storage
    .from('kenangan')
    .list('', { limit: 100, offset: 0 });

  if (error) {
    gallery.textContent = "Gagal mengambil gambar: " + error.message;
    return;
  }

  data.forEach(file => {
    const { data: urlData } = supabase
      .storage
      .from('kenangan')
      .getPublicUrl(file.name);

    const img = document.createElement('img');
    img.src = urlData.publicUrl;
    gallery.appendChild(img);
  });
}

loadImages();
