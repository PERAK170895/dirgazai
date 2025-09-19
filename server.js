const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

// Memuat variabel dari .env
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // untuk serve HTML/CSS/JS

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// === Multer untuk upload file ===
const upload = multer({ storage: multer.memoryStorage() });

// === Route Stok Barang ===
app.get('/api/stok', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stok')
      .select('nama_barang, kode_barang, stok_barang, harga_satuan')
      .order('kode_barang', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});

app.post('/api/stok', async (req, res) => {
  const { nama_barang, kode_barang, stok_barang, harga_satuan } = req.body;
  if (!nama_barang || !kode_barang || !stok_barang || !harga_satuan)
    return res.status(400).json({ error: 'Semua kolom harus diisi' });

  try {
    const { data, error } = await supabase
      .from('stok')
      .insert([{ nama_barang, kode_barang, stok_barang, harga_satuan }]);
    if (error) throw error;
    res.status(201).json({ message: 'Data berhasil ditambahkan', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambah data' });
  }
});

app.delete('/api/stok/:kode_barang', async (req, res) => {
  const { kode_barang } = req.params;
  try {
    const { data, error } = await supabase
      .from('stok')
      .delete()
      .eq('kode_barang', kode_barang);
    if (error) throw error;
    res.json({ message: 'Data berhasil dihapus', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data' });
  }
});

// === Route Reques ===
app.get('/api/reques', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reques')
      .select('nama_web, telkomsel, xl')
      .order('nama_web', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});

app.post('/api/reques', async (req, res) => {
  const { nama_web, telkomsel, xl } = req.body;
  if (!nama_web) return res.status(400).json({ error: 'Kolom nama_web harus diisi' });

  try {
    const { data, error } = await supabase
      .from('reques')
      .insert([{ nama_web, telkomsel, xl }]);
    if (error) throw error;
    res.status(201).json({ message: 'Data berhasil ditambahkan', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambah data reques' });
  }
});

// === Route Upload Gambar ke Bucket "kenangan" ===
app.post('/api/kenangan/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File tidak ditemukan' });

    const { originalname, buffer } = req.file;
    const fileName = `${Date.now()}_${originalname}`;

    const { data, error } = await supabase
      .storage
      .from('kenangan')
      .upload(fileName, buffer, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('kenangan').getPublicUrl(fileName);

    res.json({ message: 'Upload berhasil', url: urlData.publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal upload gambar: ' + err.message });
  }
});

// === Route Ambil Semua Gambar dari Bucket "kenangan" ===
app.get('/api/kenangan', async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from('kenangan').list('', { limit: 100 });
    if (error) throw error;

    const urls = data.map(file =>
      supabase.storage.from('kenangan').getPublicUrl(file.name).data.publicUrl
    );

    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil daftar gambar: ' + err.message });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
