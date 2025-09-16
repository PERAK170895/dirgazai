const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Memuat variabel dari .env
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk parsing JSON request body

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Route untuk root (/)
app.get('/', (req, res) => {
  res.send('Selamat datang di API Stok Barang!');
});

// Route untuk mengambil data stok
app.get('/api/stok', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stok')
      .select('nama_barang, kode_barang, stok_barang, harga_satuan')
      .order('kode_barang', { ascending: true });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});

// Route untuk menambahkan data stok
app.post('/api/stok', async (req, res) => {
  const { nama_barang, kode_barang, stok_barang, harga_satuan } = req.body;

  if (!nama_barang || !kode_barang || !stok_barang || !harga_satuan) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    const { data, error } = await supabase
      .from('stok')
      .insert([{ nama_barang, kode_barang, stok_barang, harga_satuan }]);

    if (error) throw error;

    res.status(201).json({ message: 'Data berhasil ditambahkan', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambah data' });
  }
});

// Route untuk menghapus data stok berdasarkan ID
app.delete('/api/stok/:kode_barang', async (req, res) => {
  const { kode_barang } = req.params;  // Mengambil kode_barang dari URL parameter
  console.log("Menghapus data dengan kode_barang:", kode_barang);  // Debugging kode_barang

  try {
    const { data, error } = await supabase
      .from('stok')
      .delete()
      .eq('kode_barang', kode_barang);  // Menghapus data berdasarkan kode_barang

    if (error) throw error;

    res.status(200).json({ message: 'Data berhasil dihapus', data });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data' });
  }
});

// === Route untuk mengelola data "reques" ===

// Route untuk mengambil data reques
// Route untuk mengambil data reques
app.get('/api/reques', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reques')  // Pastikan nama tabel sesuai
      .select('nama_web, telkomsel, xl')  // Pastikan kolom sesuai
      .order('nama_web', { ascending: true });

    if (error) throw error;

    res.json(data);  // Mengirim data sebagai response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});


// Route untuk menambahkan data reques
app.post('/api/reques', async (req, res) => {
  const { nama_web, telkomsel, xl } = req.body;

  if (!nama_web || !telkomsel || !xl) {
    return res.status(400).json({ error: 'Semua kolom harus diisi' });
  }

  try {
    const { data, error } = await supabase
      .from('reques')  // Menyesuaikan dengan nama tabel di Supabase
      .insert([{ nama_web, telkomsel, xl }]);

    if (error) throw error;

    res.status(201).json({ message: 'Data berhasil ditambahkan', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambah data reques' });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
