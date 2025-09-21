// === fetchData dengan format ribuan ===
async function fetchData(url, tableId, columns) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';

    result.data.forEach(item => {
      const row = document.createElement('tr');
      columns.forEach(col => {
        const cell = document.createElement('td');
        let value = item[col] ?? '-';

        if (['stok_barang', 'harga_satuan', 'telkomsel', 'xl'].includes(col)) {
          const num = Number(value);
          if (!isNaN(num)) value = num.toLocaleString('id-ID');
        }

        cell.textContent = value;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(`Gagal mengambil data dari ${url}`, error);
  }
}

// === Convert tabel HTML ke CSV ===
function tableToCSV(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => {
      let text = cell.textContent;
      if (text.includes('"')) text = text.replace(/"/g, '""');
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        text = `"${text}"`;
      }
      return text;
    }).join(',');
  }).join('\n');
}

// === Fungsi download CSV ===
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// === Fungsi clean input angka ===
function cleanNumberInput(value) {
  const cleaned = value.replace(/\D/g, '');
  return cleaned === '' ? '0' : cleaned;
}

// === Fungsi kirim data Reques ===
async function sendData() {
  const namaWeb = document.getElementById('nama_web').value.trim();
  let telkomsel = cleanNumberInput(document.getElementById('telkomsel').value);
  let xl = cleanNumberInput(document.getElementById('xl').value);

  if (!namaWeb) return alert("Kolom 'Nama Web' harus diisi!");

  try {
    const response = await fetch('http://localhost:3000/api/reques', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_web: namaWeb, telkomsel: Number(telkomsel), xl: Number(xl) })
    });
    const result = await response.json();

    if (result.success) {
      alert('Data berhasil dikirim!');
      document.getElementById('nama_web').value = '';
      document.getElementById('telkomsel').value = '';
      document.getElementById('xl').value = '';
      fetchData('http://localhost:3000/api/reques', 'requesTable', ['nama_web','telkomsel','xl']);
    } else {
      alert('Terjadi kesalahan: ' + result.error);
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat mengirim data.');
  }
}

// === Jalankan setelah DOM siap ===
document.addEventListener('DOMContentLoaded', () => {
  // Tampilkan data stok & reques
  fetchData('http://localhost:3000/api/stok', 'stokTable', ['nama_barang','kode_barang','stok_barang','harga_satuan']);
  fetchData('http://localhost:3000/api/reques', 'requesTable', ['nama_web','telkomsel','xl']);

  // Tombol download CSV
  const stokBtn = document.getElementById('downloadStokCSV');
  if (stokBtn) stokBtn.addEventListener('click', () => {
    const table = document.getElementById('stokTable');
    downloadCSV(tableToCSV(table), 'Data stok barang.csv');
  });

  const requesBtn = document.getElementById('downloadRequesCSV');
  if (requesBtn) requesBtn.addEventListener('click', () => {
    const table = document.getElementById('requesTable');
    downloadCSV(tableToCSV(table), 'Data reques.csv');
  });
});
