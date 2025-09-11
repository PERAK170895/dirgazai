// Menambahkan referensi elemen
const form = document.getElementById("stokForm");
// Menambahkan referensi elemen
const tableBody = document.querySelector("#stokTable tbody"); // Menambahkan referensi untuk tbody

// Fungsi untuk memformat angka dengan tanda koma (ribuan)
function formatNumber(number) {
  return new Intl.NumberFormat("id-ID").format(number); // Format dengan locale Indonesia
}

// === Load Data Stok ===
async function loadStok() {
  const response = await fetch('http://localhost:3000/api/stok'); // Mengambil data dari backend
  const data = await response.json();

  if (data.error) {
    console.error(data.error);
    return;
  }

  renderStokTable(data); // Menampilkan data di tabel
}

// === Render Data ke Tabel ===
function renderStokTable(data) {
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum render ulang
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.kode_barang}</td>
      <td>${row.nama_barang}</td>
      <td>${formatNumber(row.stok_barang)}</td>
      <td>${formatNumber(row.harga_satuan)}</td>
    `;
    tableBody.appendChild(tr); // Tambahkan baris ke dalam tbody
  });
}

// === Load Data Saat Halaman Dimuat ===
document.addEventListener("DOMContentLoaded", loadStok);
