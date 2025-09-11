// === KONFIGURASI SUPABASE ===
const SUPABASE_URL = "https://ciashuymvwhmfuxqgqlr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpYXNodXltdndobWZ1eHFncWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTQyOTEsImV4cCI6MjA2MzAzMDI5MX0.CfmfbISXd_T941XE0j8pAMqrgCUFa9ocBhuQ3B6gUY8";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk mengambil data dari Supabase dan menampilkannya
async function fetchData(table) {
    try {
        let { data, error } = await supabase
            .from(table)
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
            alert('Terjadi kesalahan saat mengambil data.');
            return;
        }

        // Render data ke dalam tabel
        displayData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fungsi untuk menampilkan data di halaman
function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        dataContainer.innerHTML = '<p>Tidak ada data untuk ditampilkan.</p>';
        return;
    }

    // Membuat tabel dinamis
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Menambahkan header tabel
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Menambahkan isi tabel
    data.forEach((row) => {
        const tr = document.createElement('tr');
        Object.values(row).forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    dataContainer.appendChild(table);
}

// Event listener untuk tombol
document.getElementById('tabelStokBtn').addEventListener('click', () => {
    fetchData('stok'); // Ganti dengan nama tabel Anda
});

document.getElementById('tabelPemasukanBtn').addEventListener('click', () => {
    fetchData('users'); // Ganti dengan nama tabel Anda
});

document.getElementById('tabelPengeluaranBtn').addEventListener('click', () => {
    fetchData('pengeluaran'); // Ganti dengan nama tabel Anda
});
