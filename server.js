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

/* ===============================
   ROUTE STOK BARANG
================================ */
// GET semua stok
app.get('/api/stok', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stok')
      .select('*')
      .order('kode_barang', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tambah stok
app.post('/api/stok', async (req, res) => {
  const { nama_barang, kode_barang, stok_barang, harga_satuan } = req.body;
  if (!nama_barang || !kode_barang || !stok_barang || !harga_satuan) {
    return res.status(400).json({ success: false, error: 'Semua kolom harus diisi' });
  }

  try {
    const { data, error } = await supabase
      .from('stok')
      .insert([{ nama_barang, kode_barang, stok_barang, harga_satuan }])
      .select();
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update stok
app.put('/api/stok/:kode_barang', async (req, res) => {
  const { kode_barang } = req.params;
  const { nama_barang, stok_barang, harga_satuan } = req.body;

  try {
    const { data, error } = await supabase
      .from('stok')
      .update({ nama_barang, stok_barang, harga_satuan })
      .eq('kode_barang', kode_barang)
      .select();
    if (error) throw error;
    res.json({ success: true, message: 'Data berhasil diupdate', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Hapus stok
app.delete('/api/stok/:kode_barang', async (req, res) => {
  const { kode_barang } = req.params;
  try {
    const { data, error } = await supabase
      .from('stok')
      .delete()
      .eq('kode_barang', kode_barang)
      .select();
    if (error) throw error;
    res.json({ success: true, message: 'Data berhasil dihapus', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===============================
   ROUTE REQUES
================================ */
// GET semua reques
app.get('/api/reques', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reques')
      .select('*')
      .order('nama_web', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tambah reques
app.post('/api/reques', async (req, res) => {
  const { nama_web, telkomsel, xl } = req.body;
  if (!nama_web) {
    return res.status(400).json({ success: false, error: 'Kolom nama_web harus diisi' });
  }

  try {
    const { data, error } = await supabase
      .from('reques')
      .insert([{ nama_web, telkomsel, xl }])
      .select();
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update reques
app.put('/api/reques/:nama_web', async (req, res) => {
  const { nama_web } = req.params;
  const { telkomsel, xl } = req.body;

  try {
    const { data, error } = await supabase
      .from('reques')
      .update({ telkomsel, xl })
      .eq('nama_web', nama_web)
      .select();
    if (error) throw error;
    res.json({ success: true, message: 'Data berhasil diupdate', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Hapus reques
app.delete('/api/reques/:nama_web', async (req, res) => {
  const { nama_web } = req.params;

  try {
    const { data, error } = await supabase
      .from('reques')
      .delete()
      .eq('nama_web', nama_web)
      .select();
    if (error) throw error;
    res.json({ success: true, message: 'Data berhasil dihapus', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===============================
   ROUTE UPLOAD GAMBAR KE BUCKET
================================ */
// Upload
app.post('/api/kenangan/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'File tidak ditemukan' });

    const { originalname, buffer, mimetype } = req.file;
    const fileName = `${Date.now()}_${originalname}`;

    const { error } = await supabase
      .storage
      .from('kenangan')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimetype,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('kenangan').getPublicUrl(fileName);

    res.json({ success: true, message: 'Upload berhasil', url: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ambil semua gambar
app.get('/api/kenangan', async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from('kenangan').list('', { limit: 100 });
    if (error) throw error;

    const urls = data.map(file =>
      supabase.storage.from('kenangan').getPublicUrl(file.name).data.publicUrl
    );

    res.json({ success: true, data: urls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Hapus gambar
app.delete('/api/kenangan/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    const { error } = await supabase.storage.from('kenangan').remove([fileName]);
    if (error) throw error;
    res.json({ success: true, message: 'Gambar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ===============================
   RUN SERVER
================================ */
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
