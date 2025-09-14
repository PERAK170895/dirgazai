// Fungsi untuk menangani pengiriman data
async function sendData() {
  const namaWeb = document.getElementById('nama_web').value;
  const telkomsel = document.getElementById('telkomsel').value;
  const xl = document.getElementById('xl').value;

  // Validasi input
  if (!namaWeb || !telkomsel || !xl) {
    alert("Semua kolom harus diisi!");
    return;
  }

  const response = await fetch('http://localhost:3000/api/reques', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nama_web: namaWeb,
      telkomsel: telkomsel,
      xl: xl
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert('Data berhasil dikirim!');
    getData(); // Menampilkan data setelah pengiriman sukses
  } else {
    alert('Terjadi kesalahan: ' + data.error);
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
        <td>${item.nama_web}</td>
        <td>${item.telkomsel}</td>
        <td>${item.xl}</td>
      `;
      table.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Terjadi kesalahan saat mengambil data');
  }
}


// Panggil fungsi untuk mendapatkan data saat halaman dimuat
window.onload = getData;
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
        <td>${item.kode_barang}</td>
        <td>${item.nama_barang}</td>
        <td>${item.stok_barang}</td>
        <td>${item.harga_satuan}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching stok data:', error);
    alert('Terjadi kesalahan saat mengambil data stok');
  }
}

// Panggil fungsi getStokData ketika halaman dimuat
window.onload = function() {
  getData();   // Tabel Request
  getStokData();  // Tabel Stok
};
