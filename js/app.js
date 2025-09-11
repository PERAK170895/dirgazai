// Menambahkan referensi elemen
const form = document.getElementById("stokForm");
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
      <td>${row.nama_barang}</td>
      <td>${row.kode_barang}</td>
      <td>${formatNumber(row.stok_barang)}</td>
      <td>${formatNumber(row.harga_satuan)}</td>
    `;
    tableBody.appendChild(tr); // Tambahkan baris ke dalam tbody
  });
}

// === Tambah Data Baru ke Supabase ===
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Mencegah form untuk refresh halaman

  const namaBarang = document.getElementById("namaBarang").value;
  const kodeBarang = document.getElementById("kodeBarang").value;
  const stokBarang = document.getElementById("stokBarang").value;
  const hargaSatuan = document.getElementById("hargaSatuan").value;

  // Validasi input
  if (!namaBarang || !kodeBarang || !stokBarang || !hargaSatuan) {
    alert("Semua kolom harus diisi!");
    return;
  }

  // Insert data baru ke server
  const response = await fetch('http://localhost:3000/api/stok', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nama_barang: namaBarang,
      kode_barang: kodeBarang,
      stok_barang: stokBarang,
      harga_satuan: hargaSatuan,
    }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    return;
  }

  form.reset(); // Reset form setelah data berhasil ditambahkan
  loadStok(); // Reload data stok
});

// === Load Data Saat Halaman Dimuat ===
document.addEventListener("DOMContentLoaded", loadStok);
