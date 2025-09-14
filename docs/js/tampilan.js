const form = document.getElementById("REQUES");
const tableBody = document.querySelector("#stokTable tbody");

// Fungsi untuk memformat angka dengan tanda koma (ribuan)
function formatNumber(number) {
  return new Intl.NumberFormat("id-ID").format(number); // Format dengan locale Indonesia
}

// === Fungsi untuk memuat data Reques dari API ===
async function loadReques() {
  try {
    const response = await fetch('http://localhost:3000/api/reques'); // URL API backend untuk mengambil data
    const data = await response.json();

    console.log(data); // Cek data yang diterima dari API

    if (data.error) {
      console.error(data.error);
      return;
    }

    renderRequesTable(data); // Menampilkan data di tabel
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// === Fungsi untuk merender data ke dalam tabel ===
function renderRequesTable(data) {
  tableBody.innerHTML = ""; // Kosongkan tabel sebelum merender ulang

  data.forEach(row => { // Iterasi data yang didapat
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.nama_web}</td>
      <td>${formatNumber(row.telkomsel)}</td>
      <td>${formatNumber(row.xl)}</td>
    `;
    tableBody.appendChild(tr); // Menambahkan baris ke dalam tbody
  });
}

// === Fungsi untuk menambah data baru ke API ===
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Mencegah form refresh halaman

  const namaWeb = document.getElementById("namaweb").value;
  const telkomsel = document.getElementById("telkomsel").value;
  const xl = document.getElementById("xl").value;

  // Validasi input
  if (!namaWeb || !telkomsel || !xl) {
    alert("Semua kolom harus diisi!");
    return;
  }

  // Kirim data ke server
  const response = await fetch('http://localhost:3000/api/reques', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nama_web: namaWeb,
      telkomsel: telkomsel,
      xl: xl,
    }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    return;
  }

  form.reset(); // Reset form setelah data berhasil ditambahkan
  loadReques(); // Muat ulang data
});

// === Load Data Saat Halaman Dimuat ===
document.addEventListener("DOMContentLoaded", loadReques);
