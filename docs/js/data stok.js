// Fungsi untuk membersihkan input, hanya ambil angka, kalau kosong jadi '0'
function cleanNumberInput(value) {
  const cleaned = value.replace(/\D/g, '');
  return cleaned === '' ? '0' : cleaned;
}

// Fungsi untuk menangani pengiriman data
async function sendData() {
  const namaWeb = document.getElementById('nama_web').value.trim();
  let telkomsel = document.getElementById('telkomsel').value;
  let xl = document.getElementById('xl').value;

  // Bersihkan input telkomsel dan xl dari non-digit
  telkomsel = cleanNumberInput(telkomsel);
  xl = cleanNumberInput(xl);

  // Validasi hanya namaWeb yang wajib
  if (!namaWeb) {
    alert("Kolom 'Nama Web' harus diisi!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/reques', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama_web: namaWeb,
        telkomsel: Number(telkomsel), // kirim sebagai angka
        xl: Number(xl),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Data berhasil dikirim!');

      // Kosongkan semua kolom input
      document.getElementById('nama_web').value = '';
      document.getElementById('telkomsel').value = '';
      document.getElementById('xl').value = '';

      getData(); // reload data setelah submit sukses
    } else {
      alert('Terjadi kesalahan: ' + data.error);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Terjadi kesalahan saat mengirim data.');
  }
}

// Fungsi untuk mengambil dan menampilkan data dari API
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/api/reques');
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data');
    }

    const data = await response.json();
    
    const table = document.getElementById('requesTable');
    table.innerHTML = `
      <tr>
        <th>Nama Web</th>
        <th>Telkomsel</th>
        <th>XL</th>
      </tr>
    `;
    
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `

      `;
      table.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Terjadi kesalahan saat mengambil data');
  }
}

// Fungsi untuk mengambil dan menampilkan data stok
async function getStokData() {
  try {
    const response = await fetch('http://localhost:3000/api/stok');
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data stok');
    }

    const data = await response.json();
    
    const table = document.getElementById('stokTable');
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';  // Kosongkan tabel sebelum menambah data

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `

      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching stok data:', error);
    alert('Terjadi kesalahan saat mengambil data stok');
  }
}

// Panggil fungsi getData dan getStokData ketika halaman dimuat
window.onload = function() {
  getData();   // Tabel Request
  getStokData();  // Tabel Stok
};
