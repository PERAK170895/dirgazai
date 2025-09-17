// === fetchData dengan format ribuan ===
async function fetchData(url, tableId, columns) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');
      columns.forEach(col => {
        const cell = document.createElement('td');
        let value = item[col] ?? '-';

        // Format angka untuk kolom tertentu
        if (['stok_barang', 'harga_satuan', 'telkomsel', 'xl'].includes(col)) {
          const num = Number(value);
          if (!isNaN(num)) {
            value = num.toLocaleString('id-ID'); // contoh: 10.000
          }
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
      if (text.includes('"')) {
        text = text.replace(/"/g, '""');
      }
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
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// === Jalankan setelah DOM siap ===
document.addEventListener('DOMContentLoaded', () => {
  fetchData('http://localhost:3000/api/stok', 'stokTable',
    ['nama_barang', 'kode_barang', 'stok_barang', 'harga_satuan']);
  fetchData('http://localhost:3000/api/reques', 'requesTable',
    ['nama_web', 'telkomsel', 'xl']);

  document.getElementById('downloadStokCSV').addEventListener('click', () => {
    const table = document.getElementById('stokTable');
    const csv = tableToCSV(table);
    downloadCSV(csv, 'Data stok barang.csv');
  });

  document.getElementById('downloadRequesCSV').addEventListener('click', () => {
    const table = document.getElementById('requesTable');
    const csv = tableToCSV(table);
    downloadCSV(csv, 'dana pesanan.csv');
  });
});
