// GANTI DENGAN URL WEB APP LU DARI TAHAP 2
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVUdKHEEWFd4iFBKwH_lcyOMlbIUhS1kCyWl5ByO6YsQdbDjPTJjazo8D6K0W8Sr_g/exec';  

let myChart;
let myLineChart; // Variabel baru untuk grafik tren harian
let rowToDelete = null;

// Set default month filter ke bulan ini (YYYY-MM)
const today = new Date();
const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
document.getElementById('monthFilter').value = currentMonthStr;

// Event Listener Filter Bulan
document.getElementById('monthFilter').addEventListener('change', () => {
  loadData();
});

function switchTab(tabId, btnElement) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('text-slate-900');
    btn.classList.add('text-slate-400');
  });
  if(btnElement) {
    btnElement.classList.remove('text-slate-400');
    btnElement.classList.add('text-slate-900');
  }
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

// Fitur Modal Delete
function openModal(rowNum) {
  rowToDelete = rowNum;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeModal() {
  rowToDelete = null;
  document.getElementById('deleteModal').classList.add('hidden');
}

// Action Hapus (Eksekusi)
document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if(!rowToDelete) return;
  closeModal();
  
  // Tampilkan loading di list
  document.getElementById('historyList').innerHTML = '<li class="text-center text-slate-400 text-sm py-10"><i class="fa-solid fa-circle-notch fa-spin"></i> Menghapus...</li>';
  
  try {
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'delete', rowNumber: rowToDelete }) });
    loadData();
  } catch(e) { alert('Gagal menghapus data.'); loadData(); }
});

// Action Masuk Mode Edit
function editData(rowNum, jenis, kategori, nominal, catatan) {
  // Masukkan data ke form
  document.getElementById('rowId').value = rowNum;
  document.getElementById('jenis').value = jenis;
  document.getElementById('kategori').value = kategori;
  document.getElementById('nominal').value = nominal;
  document.getElementById('catatan').value = catatan !== '-' ? catatan : '';
  
  // Ubah UI Form ke Mode Edit
  document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen-to-square mr-2 text-amber-500"></i> Edit Transaksi';
  document.getElementById('btnSubmit').innerText = 'Update Data';
  document.getElementById('btnSubmit').classList.replace('bg-slate-900', 'bg-amber-500');
  document.getElementById('btnSubmit').classList.replace('hover:bg-slate-800', 'hover:bg-amber-600');
  document.getElementById('btnCancelEdit').classList.remove('hidden');
  document.getElementById('editModeBadge').classList.remove('hidden');

  // Pindah ke tab input
  switchTab('tab-input', document.querySelector('.nav-btn'));
}

// Batal Edit
document.getElementById('btnCancelEdit').addEventListener('click', resetForm);

function resetForm() {
  document.getElementById('trackerForm').reset();
  document.getElementById('rowId').value = '';
  document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen-nib mr-2 text-slate-400"></i> Catat Transaksi';
  document.getElementById('btnSubmit').innerText = 'Simpan Data';
  document.getElementById('btnSubmit').classList.replace('bg-amber-500', 'bg-slate-900');
  document.getElementById('btnSubmit').classList.replace('hover:bg-amber-600', 'hover:bg-slate-800');
  document.getElementById('btnCancelEdit').classList.add('hidden');
  document.getElementById('editModeBadge').classList.add('hidden');
}

// Load Data (Dengan Parameter Filter Bulan)
async function loadData() {
  try {
    const filterVal = document.getElementById('monthFilter').value; // format: YYYY-MM
    let fetchUrl = SCRIPT_URL;
    
    if (filterVal) {
      const year = filterVal.split('-')[0];
      const month = parseInt(filterVal.split('-')[1]) - 1; // JS month mulai dari 0
      fetchUrl += `?month=${month}&year=${year}`;
    }

    const response = await fetch(fetchUrl);
    const result = await response.json();
    
    document.getElementById('sisaSaldo').innerText = formatRupiah(result.saldo || 0).replace('Rp', 'IDR ');
    document.getElementById('totalPemasukan').innerText = formatRupiah(result.totalPemasukan || 0).replace('Rp', 'IDR ');
    document.getElementById('totalPengeluaran').innerText = formatRupiah(result.totalPengeluaran || 0).replace('Rp', 'IDR ');

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (result.history.length === 0) {
      historyList.innerHTML = '<li class="text-center text-slate-400 text-sm py-10">Data kosong.</li>';
    } else {
      result.history.forEach(item => {
        const isOut = item.jenis === 'Pengeluaran';
        const iconStyle = isOut ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500';
        const iconType = isOut ? 'fa-arrow-down' : 'fa-arrow-up';
        const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const note = item.catatan || '-';

        // Ditambahkan tombol Edit (Pensil) dan Hapus (Tempat Sampah)
        historyList.innerHTML += `
          <li class="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center ${iconStyle} flex-shrink-0">
                <i class="fa-solid ${iconType} text-xs"></i>
              </div>
              <div class="w-32 sm:w-48 overflow-hidden">
                <p class="text-sm font-semibold text-slate-800 truncate">${item.kategori}</p>
                <p class="text-[11px] text-slate-400 truncate">${dateStr} • ${note}</p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-1">
              <span class="text-sm font-bold ${isOut ? 'text-slate-800' : 'text-emerald-500'}">
                ${isOut ? '-' : '+'}${formatRupiah(item.nominal).replace('Rp', '')}
              </span>
              <div class="flex space-x-3 text-slate-300">
                <button onclick="editData('${item.rowNumber}', '${item.jenis}', '${item.kategori}', '${item.nominal}', '${note}')" class="hover:text-amber-500 transition-colors"><i class="fa-solid fa-pen text-[11px]"></i></button>
                <button onclick="openModal('${item.rowNumber}')" class="hover:text-rose-500 transition-colors"><i class="fa-solid fa-trash text-[11px]"></i></button>
              </div>
            </div>
          </li>
        `;
      });
    }

    // --- 1. RENDER DOUGHNUT CHART (DISTRIBUSI KATEGORI) ---
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();
    
    const chartLabels = Object.keys(result.chart || {});
    const chartData = Object.values(result.chart || {});

    if (chartData.length === 0) {
      document.getElementById('noChartData').classList.remove('hidden');
    } else {
      document.getElementById('noChartData').classList.add('hidden');
      myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartLabels,
          datasets: [{ data: chartData, backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'], borderWidth: 2, borderColor: '#ffffff', hoverOffset: 5 }]
        },
        options: { cutout: '70%', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { family: "'Inter', sans-serif", size: 11 } } } } }
      });
    }

    // --- 2. RENDER LINE CHART (TREN PENGELUARAN HARIAN) ---
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    if (myLineChart) myLineChart.destroy();
    
    if (Object.keys(result.dailyData || {}).length === 0) {
      document.getElementById('noLineChartData').classList.remove('hidden');
      document.getElementById('lineChart').style.display = 'none';
    } else {
      document.getElementById('noLineChartData').classList.add('hidden');
      document.getElementById('lineChart').style.display = 'block';

      // Cari tahu jumlah hari dalam bulan yang difilter
      const filterVal = document.getElementById('monthFilter').value || currentMonthStr;
      const year = parseInt(filterVal.split('-')[0]);
      const month = parseInt(filterVal.split('-')[1]); 
      const daysInMonth = new Date(year, month, 0).getDate();

      const labels = [];
      const lineData = [];
      
      // Bikin array tanggal dari 1 sampai akhir bulan
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(i.toString());
        lineData.push(result.dailyData[i] || 0); // Kalau ga ada pengeluaran di tgl itu, isi 0
      }

      myLineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Pengeluaran',
            data: lineData,
            borderColor: '#0f172a',
            backgroundColor: 'rgba(15, 23, 42, 0.08)', // Efek warna di bawah garis
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Bikin garisnya melengkung halus
            pointRadius: 1, // Titik kecil
            pointHoverRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }, // Sembunyiin legend biar bersih
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ' IDR ' + context.parsed.y.toLocaleString('id-ID');
                }
              }
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              ticks: { display: false }, // Sembunyiin angka nominal di kiri biar bersih
              grid: { display: false } 
            },
            x: { 
              grid: { display: false }, 
              ticks: { font: { family: "'Inter', sans-serif", size: 9 }, maxTicksLimit: 10 } 
            }
          }
        }
      });
    }

  } catch (e) { 
    console.log(e);
  }
}

// Handle Submit Form (Add / Edit)
document.getElementById('trackerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('status');
  const btn = document.getElementById('btnSubmit');
  
  const rowId = document.getElementById('rowId').value;
  const isEdit = rowId !== '';
  
  statusEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-1"></i> Menyimpan...';
  statusEl.className = 'mt-4 text-center text-xs font-semibold text-slate-500 block';
  btn.disabled = true; btn.classList.add('opacity-50');

  const payload = {
    action: isEdit ? 'edit' : 'add',
    rowNumber: rowId,
    jenis: document.getElementById('jenis').value,
    kategori: document.getElementById('kategori').value,
    nominal: document.getElementById('nominal').value,
    catatan: document.getElementById('catatan').value
  };

  try {
    await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) });
    statusEl.innerHTML = '<i class="fa-solid fa-check mr-1"></i> ' + (isEdit ? 'Diperbarui!' : 'Tersimpan!');
    statusEl.className = 'mt-4 text-center text-xs font-semibold text-emerald-500 block';
    
    resetForm();
    loadData(); 
    
    setTimeout(() => { statusEl.classList.add('hidden'); btn.disabled = false; btn.classList.remove('opacity-50'); }, 2000);
  } catch (err) {
    statusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1"></i> Gagal!';
    statusEl.className = 'mt-4 text-center text-xs font-semibold text-rose-500 block';
    btn.disabled = false; btn.classList.remove('opacity-50');
  }
});

loadData();