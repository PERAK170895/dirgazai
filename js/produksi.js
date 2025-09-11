// === KONFIGURASI SUPABASE ===
const SUPABASE_URL = "https://ciashuymvwhmfuxqgqlr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpYXNodXltdndobWZ1eHFncWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTQyOTEsImV4cCI6MjA2MzAzMDI5MX0.CfmfbISXd_T941XE0j8pAMqrgCUFa9ocBhuQ3B6gUY8";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("resultForm");
const tableBody = document.querySelector("#resultTable tbody");

// === Set max tanggal ke hari ini ===
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();

  // Ambil hari di zona Asia/Jakarta
  const formatter = new Intl.DateTimeFormat("sv-SE", { // sv-SE = format YYYY-MM-DD
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(now);
  const yyyy = parts.find(p => p.type === "year").value;
  const mm = parts.find(p => p.type === "month").value;
  const dd = parts.find(p => p.type === "day").value;

  const todayJakarta = `${yyyy}-${mm}-${dd}`;

  document.getElementById("tanggal").setAttribute("max", todayJakarta);
  document.getElementById("tanggal").value = todayJakarta; // auto set default hari ini
});



// === Load Data ===
async function loadData() {
  const { data, error } = await supabase
    .from("result")
    .select("*")
    .order("id", { ascending: true });

  if (error) return console.error(error);

  await renumber(data);
  renderTable(data);
}

// === Rapikan Periode (berurutan) ===
async function renumber(data) {
  for (let i = 0; i < data.length; i++) {
    const expectedPeriode = String(i + 1).padStart(3, "0");
    if (data[i].periode !== expectedPeriode) {
      await supabase.from("result").update({ periode: expectedPeriode }).eq("id", data[i].id);
    }
  }
}

// === Render ke Tabel ===
function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(row => {
    const dayName = new Date(row.tanggal).toLocaleDateString("id-ID", { weekday: "long" });
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dayName}</td>
      <td>${row.tanggal}</td>
      <td>${row.periode}</td>
      <td>${row.resul}</td>
      <td><button onclick="deleteRow(${row.id})">CANCEl</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// === Tambah Data Baru ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const resul = document.getElementById("resul").value;

  // Validasi resul: angka 4 digit
  if (!/^\d{4}$/.test(resul)) {
    alert("Result harus berupa angka 4 digit (contoh: 0007, 1234)");
    return;
  }

// Validasi tanggal: hanya boleh tanggal hari ini atau tanggal masa lalu
const today = new Date();
today.setHours(0,0,0,0); // reset jam ke 00:00

const pickedDate = new Date(tanggal);
pickedDate.setHours(0,0,0,0); // reset jam ke 00:00

if (pickedDate.getTime() > today.getTime()) {
  alert("Tanggal tidak boleh melebihi hari ini");
  return;
}


  // Hitung periode baru
  const { count } = await supabase.from("result").select("id", { count: "exact" });
  const periodeBaru = String(count + 1).padStart(3, "0");

  const { error } = await supabase.from("result").insert([
    { tanggal, periode: periodeBaru, resul }
  ]);
  if (error) return console.error(error);

  form.reset();
  loadData();
});

// === Hapus Data ===
async function deleteRow(id) {
  const { error } = await supabase.from("result").delete().eq("id", id);
  if (error) return console.error(error);
  loadData();
}

// === Realtime Update ===
supabase
  .channel("public:result")
  .on("postgres_changes", { event: "*", schema: "public", table: "result" }, () => {
    loadData();
  })
  .subscribe();

// === Load awal ===
loadData();
// === JAM REALTIME ===
// === JAM REALTIME FIX GMT+7 (WIB) ===
function updateClock() {
  const clock = document.getElementById("clock");

  const now = new Date();

  // Format dengan timezone Asia/Jakarta
  const hari = new Intl.DateTimeFormat("id-ID", { 
    weekday: "long", 
    timeZone: "Asia/Jakarta" 
  }).format(now);

  const tanggal = new Intl.DateTimeFormat("id-ID", { 
    day: "numeric", 
    month: "long", 
    year: "numeric", 
    timeZone: "Asia/Jakarta" 
  }).format(now);

  const waktu = new Intl.DateTimeFormat("id-ID", { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: false,
    timeZone: "Asia/Jakarta" 
  }).format(now);

  clock.textContent = `${hari}, ${tanggal} ${waktu}`;
}

setInterval(updateClock, 1000);
updateClock(); // panggil pertama kali


// === LOGOUT ===
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Anda telah logout!");
  // contoh redirect (bisa diarahkan ke halaman login)
  window.location.href = "login.html";
});
// === PROFIL USER LOGIN ===
async function tampilkanProfil() {
  // Ambil user_id dari localStorage (disimpan saat login)
  const loggedUserId = localStorage.getItem("user_id");
  if (!loggedUserId) return;

  const { data, error } = await supabase
    .from("users")
    .select("username, fullname")
    .eq("id", loggedUserId)
    .single();

  if (error) return console.error("Error fetch user:", error);

  // Tampilkan di header
  document.querySelector(".profile span").textContent = `👤 ${data.username} | ${data.fullname}`;
}

// Panggil saat page load
document.addEventListener("DOMContentLoaded", tampilkanProfil);

// === LOGOUT DENGAN HAPUS SESSION ===
document.getElementById("logoutBtn").addEventListener("click", async () => {
  localStorage.removeItem("user_id"); // hapus session login
  alert("Anda telah logout!");
  window.location.href = "login.html"; // redirect ke halaman login
});

// === SIDEBAR MENU TOGGLE (opsional) ===
// Misal setiap menu-btn punya submenu, bisa toggle
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const submenu = btn.nextElementSibling;
    if (submenu) {
      submenu.classList.toggle("show");
    }
  });
});
