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
        cell.textContent = item[col] ?? '-';
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(`Gagal mengambil data dari ${url}`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData('http://localhost:3000/api/stok', 'stokTable', ['nama_barang', 'kode_barang', 'stok_barang', 'harga_satuan']);
  fetchData('http://localhost:3000/api/reques', 'requesTable', ['nama_web', 'telkomsel', 'xl']);
});
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
        cell.textContent = item[col] ?? '-';
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(`Gagal mengambil data dari ${url}`, error);
  }
}

// Convert tabel HTML ke CSV string
function tableToCSV(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => {
      // Escape quotes and commas
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

// Fungsi untuk download CSV file
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

document.addEventListener('DOMContentLoaded', () => {
  fetchData('http://localhost:3000/api/stok', 'stokTable', ['nama_barang', 'kode_barang', 'stok_barang', 'harga_satuan']);
  fetchData('http://localhost:3000/api/reques', 'requesTable', ['nama_web', 'telkomsel', 'xl']);

  // Event tombol download CSV stok
  document.getElementById('downloadStokCSV').addEventListener('click', () => {
    const table = document.getElementById('stokTable');
    const csv = tableToCSV(table);
    downloadCSV(csv, 'stok_barang.csv');
  });

  // Event tombol download CSV reques
  document.getElementById('downloadRequesCSV').addEventListener('click', () => {
    const table = document.getElementById('requesTable');
    const csv = tableToCSV(table);
    downloadCSV(csv, 'reques.csv');
  });
});
