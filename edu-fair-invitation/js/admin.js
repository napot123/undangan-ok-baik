/**
 * Edu Fair & Career Day 2026
 * Admin Dashboard Logic & Application State
 */

// Application State
const AdminState = {
    currentView: 'dashboard',
    guestSearchQuery: '',
    guestCategoryFilter: 'all',
    guestCurrentPage: 1,
    guestPageSize: 5,
    importedCsvData: [],
    categoryChartInstance: null,
    rsvpChartInstance: null
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDashboard();
    initGuestManagement();
    initCsvImport();
    initInvitationGenerator();
    initBlastLogs();
    initRsvpManagement();
    initSettingsForm();
    initModals();
});

// ===================================================================
// 1. NAVIGATION ROUTING
// ===================================================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link[data-view]');
    const mobileToggle = document.getElementById('mobileToggleBtn');
    const sidebar = document.querySelector('.admin-sidebar');
    const pageTitle = document.getElementById('pageBreadcrumbTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewTarget = link.getAttribute('data-view');
            switchView(viewTarget);

            // Tutup sidebar di mobile setelah klik
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    });

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Tombol Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Apakah Anda yakin ingin keluar dari Admin Dashboard?")) {
                showToast("Anda telah keluar.", "info");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 800);
            }
        });
    }
}

function switchView(viewName) {
    AdminState.currentView = viewName;

    // Update active nav link
    document.querySelectorAll('.sidebar-link[data-view]').forEach(l => {
        if (l.getAttribute('data-view') === viewName) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });

    // Update visible view
    document.querySelectorAll('.content-view').forEach(v => {
        if (v.id === `view-${viewName}`) {
            v.classList.add('active');
        } else {
            v.classList.remove('active');
        }
    });

    // Update breadcrumb title
    const titles = {
        dashboard: "Dashboard Overview",
        guests: "Kelola Data Tamu",
        import: "Import Tamu dari CSV",
        generator: "Generator Link & Blast WhatsApp",
        logs: "Riwayat Pengiriman Undangan",
        rsvp: "Data Konfirmasi Kehadiran (RSVP)",
        settings: "Pengaturan Informasi Acara"
    };
    const breadcrumb = document.getElementById('pageBreadcrumbTitle');
    if (breadcrumb && titles[viewName]) {
        breadcrumb.textContent = titles[viewName];
    }

    // Re-render relevant view
    if (viewName === 'dashboard') renderDashboardStats();
    if (viewName === 'guests') renderGuestTable();
    if (viewName === 'generator') renderGeneratorTable();
    if (viewName === 'logs') renderLogsTable();
    if (viewName === 'rsvp') renderRsvpTable();
    if (viewName === 'settings') populateSettingsForm();
}

// ===================================================================
// 2. DASHBOARD OVERVIEW & CHARTS
// ===================================================================
function initDashboard() {
    renderDashboardStats();
}

function renderDashboardStats() {
    const guests = DataStore.getGuests();
    const logs = DataStore.getBlastLogs();
    const rsvps = DataStore.getRSVPs();

    // 1. Statistik Angka
    const totalGuests = guests.length;
    const openedBlast = guests.filter(g => g.status_undangan && g.status_undangan.includes('Dibuka')).length;
    const notSent = guests.filter(g => !g.status_undangan || g.status_undangan === 'Belum Dikirim').length;
    const rsvpConfirmed = rsvps.filter(r => r.status === 'Hadir').length;

    const elTotal = document.getElementById('statTotalGuests');
    const elOpened = document.getElementById('statOpenedBlast');
    const elNotSent = document.getElementById('statNotSent');
    const elRsvp = document.getElementById('statConfirmedRSVP');

    if (elTotal) elTotal.textContent = totalGuests;
    if (elOpened) elOpened.textContent = openedBlast;
    if (elNotSent) elNotSent.textContent = notSent;
    if (elRsvp) elRsvp.textContent = rsvpConfirmed;

    // 2. Render Charts
    renderCharts(guests, rsvps);

    // 3. Render Aktivitas Terbaru (RSVP & Blast)
    renderRecentActivities(rsvps, logs, guests);
}

function renderCharts(guests, rsvps) {
    // Kategori Tamu
    const catCounts = {};
    guests.forEach(g => {
        const cat = g.kategori || 'Lainnya';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const catLabels = Object.keys(catCounts);
    const catData = Object.values(catCounts);

    // Status RSVP
    let hadirCount = 0;
    let tidakHadirCount = 0;
    let belumPastiCount = 0;
    rsvps.forEach(r => {
        if (r.status === 'Hadir') hadirCount++;
        else if (r.status === 'Tidak Hadir') tidakHadirCount++;
        else belumPastiCount++;
    });

    // Gunakan Chart.js jika tersedia di window
    if (typeof Chart !== 'undefined') {
        const ctxCat = document.getElementById('categoryChart');
        if (ctxCat) {
            if (AdminState.categoryChartInstance) {
                AdminState.categoryChartInstance.destroy();
            }
            AdminState.categoryChartInstance = new Chart(ctxCat, {
                type: 'doughnut',
                data: {
                    labels: catLabels.length > 0 ? catLabels : ['Belum ada data'],
                    datasets: [{
                        data: catData.length > 0 ? catData : [1],
                        backgroundColor: ['#d4af37', '#3b82f6', '#10b981', '#a855f7', '#f97316'],
                        borderColor: '#0c1836',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
                    }
                }
            });
        }

        const ctxRsvp = document.getElementById('rsvpChart');
        if (ctxRsvp) {
            if (AdminState.rsvpChartInstance) {
                AdminState.rsvpChartInstance.destroy();
            }
            AdminState.rsvpChartInstance = new Chart(ctxRsvp, {
                type: 'bar',
                data: {
                    labels: ['Hadir', 'Tidak Hadir', 'Belum Pasti'],
                    datasets: [{
                        label: 'Jumlah Tamu',
                        data: [hadirCount, tidakHadirCount, belumPastiCount],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, ticks: { color: '#94a3b8', stepSize: 1 } },
                        x: { ticks: { color: '#cbd5e1' } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } else {
        // Fallback jika offline dan Chart.js belum dicache
        const catCanvas = document.getElementById('categoryChart');
        if (catCanvas && catCanvas.parentElement) {
            catCanvas.parentElement.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #94a3b8;">
                    <p style="color: #ffffff; font-weight: 600; margin-bottom: 12px;">Distribusi Kategori:</p>
                    ${catLabels.map((lbl, idx) => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
                            <span>${lbl}</span>
                            <span style="font-weight:700; color:#d4af37;">${catData[idx]} Tamu</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

function renderRecentActivities(rsvps, logs, guests) {
    const listEl = document.getElementById('recentActivityList');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Ambil kombinasi aktivitas terbaru
    const combined = [];
    rsvps.slice(0, 3).forEach(r => {
        combined.push({
            type: 'rsvp',
            nama: r.instansi || r.nama,
            detail: `RSVP: ${r.status}`,
            waktu: r.waktu,
            badgeClass: r.status === 'Hadir' ? 'badge-success' : 'badge-danger'
        });
    });

    logs.slice(0, 3).forEach(l => {
        combined.push({
            type: 'blast',
            nama: l.instansi || l.nama_tamu,
            detail: 'Link WA Dibuka',
            waktu: l.tanggal,
            badgeClass: 'badge-info'
        });
    });

    if (combined.length === 0) {
        listEl.innerHTML = `<p style="color: #64748b; font-size: 0.88rem; text-align: center; padding: 12px;">Belum ada aktivitas tercatat.</p>`;
        return;
    }

    combined.slice(0, 5).forEach(item => {
        const row = document.createElement('div');
        row.className = 'activity-item';
        row.innerHTML = `
            <div>
                <div class="activity-name">${escapeHtml(item.nama)}</div>
                <div class="activity-sub">${escapeHtml(item.waktu)}</div>
            </div>
            <span class="badge ${item.badgeClass}">${escapeHtml(item.detail)}</span>
        `;
        listEl.appendChild(row);
    });
}

// ===================================================================
// 3. KELOLA DATA TAMU (CRUD, FILTER, SEARCH, PAGINATION)
// ===================================================================
function initGuestManagement() {
    const searchInput = document.getElementById('guestSearchInput');
    const categorySelect = document.getElementById('guestCategoryFilter');
    const addGuestBtn = document.getElementById('btnAddGuest');
    const exportCsvBtn = document.getElementById('btnExportGuestsCsv');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AdminState.guestSearchQuery = e.target.value.toLowerCase();
            AdminState.guestCurrentPage = 1;
            renderGuestTable();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            AdminState.guestCategoryFilter = e.target.value;
            AdminState.guestCurrentPage = 1;
            renderGuestTable();
        });
    }

    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', () => {
            openGuestModal('tambah');
        });
    }

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            exportGuestsToCsv();
        });
    }

    renderGuestTable();
}

function getFilteredGuests() {
    const guests = DataStore.getGuests();
    return guests.filter(g => {
        const query = AdminState.guestSearchQuery;
        const matchesSearch = !query || 
            (g.nama_tamu && g.nama_tamu.toLowerCase().includes(query)) ||
            (g.instansi && g.instansi.toLowerCase().includes(query)) ||
            (g.no_whatsapp && g.no_whatsapp.includes(query));

        const cat = AdminState.guestCategoryFilter;
        const matchesCategory = cat === 'all' || (g.kategori && g.kategori.toLowerCase() === cat.toLowerCase());

        return matchesSearch && matchesCategory;
    });
}

function renderGuestTable() {
    const tableBody = document.getElementById('guestTableBody');
    const countInfo = document.getElementById('guestCountInfo');
    const paginationControls = document.getElementById('guestPaginationControls');
    if (!tableBody) return;

    const filtered = getFilteredGuests();
    const total = filtered.length;

    // Hitung Pagination
    const totalPages = Math.ceil(total / AdminState.guestPageSize) || 1;
    if (AdminState.guestCurrentPage > totalPages) AdminState.guestCurrentPage = totalPages;

    const startIdx = (AdminState.guestCurrentPage - 1) * AdminState.guestPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + AdminState.guestPageSize);

    if (countInfo) {
        countInfo.textContent = `Menampilkan ${total === 0 ? 0 : startIdx + 1} - ${Math.min(startIdx + AdminState.guestPageSize, total)} dari ${total} tamu`;
    }

    tableBody.innerHTML = '';

    if (pageItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: #64748b;">
                    Tidak ada data tamu yang sesuai kriteria pencarian.
                </td>
            </tr>
        `;
        if (paginationControls) paginationControls.innerHTML = '';
        return;
    }

    pageItems.forEach(g => {
        const tr = document.createElement('tr');
        
        // Status Badge Style
        let badgeClass = 'badge-secondary';
        const st = g.status_undangan || 'Belum Dikirim';
        if (st.includes('Dibuka')) badgeClass = 'badge-info';
        else if (st.includes('Hadir')) badgeClass = 'badge-success';
        else if (st.includes('Tidak')) badgeClass = 'badge-danger';

        tr.innerHTML = `
            <td style="font-weight: 700; color: #94a3b8;">#${g.id}</td>
            <td style="font-weight: 600; color: #ffffff;">${escapeHtml(g.nama_tamu)}</td>
            <td>${escapeHtml(g.instansi)}</td>
            <td><span class="badge badge-secondary">${escapeHtml(g.kategori)}</span></td>
            <td><code>${escapeHtml(g.no_whatsapp || '-')}</code></td>
            <td><span class="badge ${badgeClass}">${escapeHtml(st)}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="Edit Data" onclick="openGuestModal('edit', ${g.id})">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="btn-icon delete" title="Hapus Data" onclick="confirmDeleteGuest(${g.id})">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Render Pagination Controls
    if (paginationControls) {
        paginationControls.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '&laquo; Prev';
        prevBtn.disabled = AdminState.guestCurrentPage <= 1;
        prevBtn.onclick = () => {
            AdminState.guestCurrentPage--;
            renderGuestTable();
        };
        paginationControls.appendChild(prevBtn);

        for (let p = 1; p <= totalPages; p++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${p === AdminState.guestCurrentPage ? 'active' : ''}`;
            pageBtn.textContent = p;
            pageBtn.onclick = () => {
                AdminState.guestCurrentPage = p;
                renderGuestTable();
            };
            paginationControls.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.disabled = AdminState.guestCurrentPage >= totalPages;
        nextBtn.onclick = () => {
            AdminState.guestCurrentPage++;
            renderGuestTable();
        };
        paginationControls.appendChild(nextBtn);
    }
}

// Modal Tambah / Edit Tamu
function openGuestModal(mode, guestId = null) {
    const modal = document.getElementById('guestFormModal');
    const titleEl = document.getElementById('guestModalTitle');
    const idInput = document.getElementById('guestFormId');
    const namaInput = document.getElementById('guestFormNama');
    const instansiInput = document.getElementById('guestFormInstansi');
    const kategoriInput = document.getElementById('guestFormKategori');
    const waInput = document.getElementById('guestFormWa');

    if (!modal) return;

    if (mode === 'edit' && guestId) {
        const guests = DataStore.getGuests();
        const guest = guests.find(g => String(g.id) === String(guestId));
        if (!guest) return;

        titleEl.textContent = "Edit Data Tamu";
        idInput.value = guest.id;
        namaInput.value = guest.nama_tamu || '';
        instansiInput.value = guest.instansi || '';
        kategoriInput.value = guest.kategori || 'Universitas';
        waInput.value = guest.no_whatsapp || '';
    } else {
        titleEl.textContent = "Tambah Tamu Baru";
        idInput.value = '';
        namaInput.value = '';
        instansiInput.value = '';
        kategoriInput.value = 'Universitas';
        waInput.value = '';
    }

    modal.classList.add('active');
}

function handleGuestFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('guestFormId').value;
    const nama_tamu = document.getElementById('guestFormNama').value.trim();
    const instansi = document.getElementById('guestFormInstansi').value.trim();
    const kategori = document.getElementById('guestFormKategori').value;
    const no_whatsapp = document.getElementById('guestFormWa').value.trim();

    if (!nama_tamu || !instansi) {
        showToast("Nama Tamu dan Instansi wajib diisi!", "error");
        return;
    }

    if (id) {
        // Mode Update
        DataStore.updateGuest(id, { nama_tamu, instansi, kategori, no_whatsapp });
        showToast("Data tamu berhasil diperbarui!", "success");
    } else {
        // Mode Tambah Baru
        DataStore.addGuest({ nama_tamu, instansi, kategori, no_whatsapp });
        showToast("Tamu baru berhasil ditambahkan!", "success");
    }

    closeModal('guestFormModal');
    renderGuestTable();
    renderDashboardStats();
}

function confirmDeleteGuest(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data tamu ini?")) {
        DataStore.deleteGuest(id);
        showToast("Data tamu berhasil dihapus.", "info");
        renderGuestTable();
        renderDashboardStats();
    }
}

function exportGuestsToCsv() {
    const guests = DataStore.getGuests();
    if (guests.length === 0) {
        showToast("Tidak ada data tamu untuk diekspor.", "error");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,id,nama_tamu,instansi,kategori,no_whatsapp,status_undangan\n";
    guests.forEach(g => {
        csvContent += `"${g.id}","${g.nama_tamu}","${g.instansi}","${g.kategori}","${g.no_whatsapp}","${g.status_undangan || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data-tamu-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("File CSV tamu berhasil diunduh!", "success");
}

// ===================================================================
// 4. IMPORT CSV MENGGUNAKAN PAPAPARSE
// ===================================================================
function initCsvImport() {
    const dropzone = document.getElementById('csvDropzone');
    const fileInput = document.getElementById('csvFileInput');
    const btnExecuteImport = document.getElementById('btnExecuteImport');
    const btnDownloadSample = document.getElementById('btnDownloadSampleCsv');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleCsvFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleCsvFile(e.target.files[0]);
        }
    });

    if (btnExecuteImport) {
        btnExecuteImport.addEventListener('click', () => {
            executeImportData();
        });
    }

    if (btnDownloadSample) {
        btnDownloadSample.addEventListener('click', () => {
            downloadSampleCsv();
        });
    }
}

function handleCsvFile(file) {
    if (!file.name.endsWith('.csv')) {
        showToast("Mohon pilih file berformat .csv!", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseAndPreviewCsv(text);
    };
    reader.readAsText(file);
}

function parseAndPreviewCsv(csvText) {
    let parsedRows = [];

    // Coba gunakan PapaParse jika tersedia
    if (typeof Papa !== 'undefined') {
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });
        parsedRows = parsed.data;
    } else {
        // Fallback jika PapaParse CDN terblokir
        parsedRows = DataStore.parseCSVFallback(csvText);
    }

    if (!parsedRows || parsedRows.length === 0) {
        showToast("File CSV kosong atau tidak memiliki format yang valid.", "error");
        return;
    }

    // Normalisasi kolom format: id, nama_tamu, instansi, kategori, no_whatsapp
    const normalized = [];
    parsedRows.forEach((row, index) => {
        // Cari key yang cocok tanpa case sensitivity
        let idVal = row.id || row.Id || row.ID || (index + 1);
        let namaVal = row.nama_tamu || row.nama || row.Nama || row['Nama Tamu'] || '';
        let instansiVal = row.instansi || row.Instansi || row.lembaga || '';
        let kategoriVal = row.kategori || row.Kategori || 'Universitas';
        let waVal = row.no_whatsapp || row.whatsapp || row.no_wa || row.wa || row.WhatsApp || '';

        // Tangani notasi eksponensial Excel (misal: 6,28226E+12)
        waVal = String(waVal).replace(',', '.');
        if (waVal.includes('E+') || waVal.includes('e+')) {
            try {
                waVal = Math.round(Number(waVal)).toString();
            } catch(e) {}
        }
        waVal = DataStore.cleanPhoneNumber(waVal);

        if (namaVal || instansiVal) {
            normalized.push({
                id: idVal,
                nama_tamu: String(namaVal).trim(),
                instansi: String(instansiVal).trim(),
                kategori: String(kategoriVal).trim() || 'Universitas',
                no_whatsapp: waVal,
                status_undangan: "Belum Dikirim"
            });
        }
    });

    AdminState.importedCsvData = normalized;

    // Tampilkan Area Preview
    renderCsvPreview(normalized);
}

function renderCsvPreview(dataList) {
    const previewContainer = document.getElementById('csvPreviewContainer');
    const previewTableBody = document.getElementById('csvPreviewTableBody');
    const rowCountEl = document.getElementById('csvRowCount');

    if (!previewContainer || !previewTableBody) return;

    previewContainer.style.display = 'block';
    if (rowCountEl) rowCountEl.textContent = `${dataList.length} baris data tamu terdeteksi siap diimpor.`;

    previewTableBody.innerHTML = '';
    dataList.slice(0, 10).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${escapeHtml(row.id)}</td>
            <td style="font-weight: 600; color: #ffffff;">${escapeHtml(row.nama_tamu)}</td>
            <td>${escapeHtml(row.instansi)}</td>
            <td><span class="badge badge-secondary">${escapeHtml(row.kategori)}</span></td>
            <td><code>${escapeHtml(row.no_whatsapp)}</code></td>
        `;
        previewTableBody.appendChild(tr);
    });
}

function executeImportData() {
    if (!AdminState.importedCsvData || AdminState.importedCsvData.length === 0) {
        showToast("Tidak ada data untuk diimpor.", "error");
        return;
    }

    const importMode = document.querySelector('input[name="importMode"]:checked')?.value || 'append';
    const currentGuests = DataStore.getGuests();

    let finalGuests = [];
    if (importMode === 'replace') {
        finalGuests = AdminState.importedCsvData;
    } else {
        // Append: gabungkan dan buat id unik
        let maxId = currentGuests.length > 0 ? Math.max(...currentGuests.map(g => Number(g.id) || 0)) : 0;
        const mappedNew = AdminState.importedCsvData.map(g => {
            maxId++;
            return { ...g, id: maxId };
        });
        finalGuests = currentGuests.concat(mappedNew);
    }

    DataStore.saveGuests(finalGuests);
    showToast(`Sukses! ${AdminState.importedCsvData.length} data tamu berhasil diimpor.`, "success");

    // Reset view
    AdminState.importedCsvData = [];
    const previewContainer = document.getElementById('csvPreviewContainer');
    if (previewContainer) previewContainer.style.display = 'none';

    // Beralih ke Data Tamu
    setTimeout(() => {
        switchView('guests');
    }, 600);
}

function downloadSampleCsv() {
    const sample = `id,nama_tamu,instansi,kategori,no_whatsapp
1,Nur Noviana Sari,Universitas Indonesia,Universitas,6282260060508
2,Dinda Nurrahma,PT Telkom Indonesia (Persero) Tbk,Perusahaan,6282260060509
3,Yuni Arinta Putri,Universitas Al Azhar Indonesia,Universitas,6281296159185
4,Nanang Suhariyadi,Alumni Angkatan 2022 - Software Engineer,Alumni,6285676400755
5,Luqman,PT Astra International Tbk,Perusahaan,6281385912277`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data-tamu.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Template data-tamu.csv berhasil diunduh!", "info");
}

// ===================================================================
// 5. GENERATOR UNDANGAN & BLAST WHATSAPP
// ===================================================================
function initInvitationGenerator() {
    const baseUrlInput = document.getElementById('generatorBaseUrl');
    const waTemplateInput = document.getElementById('generatorWaTemplate');
    const settings = DataStore.getSettings();

    // Auto set URL default jika belum diset
    if (baseUrlInput) {
        if (settings.url_dasar) {
            baseUrlInput.value = settings.url_dasar;
        } else {
            const loc = window.location;
            const pathParts = loc.pathname.split('/');
            pathParts.pop(); // buang admin.html
            const dir = pathParts.join('/');
            baseUrlInput.value = `${loc.protocol}//${loc.host}${dir}/index.html`;
        }

        baseUrlInput.addEventListener('input', () => {
            renderGeneratorTable();
        });
    }

    if (waTemplateInput && settings.wa_template) {
        waTemplateInput.value = settings.wa_template;
        waTemplateInput.addEventListener('input', () => {
            renderGeneratorTable();
        });
    }

    renderGeneratorTable();
}

function renderGeneratorTable() {
    const tableBody = document.getElementById('generatorTableBody');
    const baseUrlInput = document.getElementById('generatorBaseUrl');
    const waTemplateInput = document.getElementById('generatorWaTemplate');
    if (!tableBody) return;

    const guests = DataStore.getGuests();
    const baseUrl = baseUrlInput ? baseUrlInput.value.trim() : '';
    const template = waTemplateInput ? waTemplateInput.value : DataStore.getSettings().wa_template;

    tableBody.innerHTML = '';

    if (guests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">
                    Silakan unggah file data-tamu.csv terlebih dahulu.
                </td>
            </tr>
        `;
        return;
    }

    guests.forEach((g, idx) => {
        const tr = document.createElement('tr');
        
        // Buat Link Undangan Personal
        const linkUndangan = DataStore.generateInvitationLink(baseUrl, g.instansi, g.kategori, g.nama_tamu);
        
        // Buat Link WA
        const waLink = DataStore.generateWhatsAppLink(g.no_whatsapp, template, g.instansi, linkUndangan, g.nama_tamu, g.kategori);

        tr.innerHTML = `
            <td style="font-weight: 700; color: #94a3b8;">${idx + 1}</td>
            <td style="font-weight: 700; color: #ffffff;">${escapeHtml(g.nama_tamu)}</td>
            <td>${escapeHtml(g.instansi)}</td>
            <td><span class="badge badge-secondary">${escapeHtml(g.kategori)}</span></td>
            <td><code>${escapeHtml(g.no_whatsapp || '-')}</code></td>
            <td>
                <div class="table-actions">
                    <button class="btn-blast-wa" onclick="triggerWhatsAppBlast(${g.id}, '${escapeHtml(encodeURIComponent(waLink))}', '${escapeHtml(encodeURIComponent(linkUndangan))}')">
                        <svg style="width: 16px; height: 16px;" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.127-.52-1.832-.759-3.003-2.613-3.094-2.735-.091-.122-.744-.99-.744-1.888 0-.898.47-1.339.637-1.521.167-.183.364-.228.486-.228.121 0 .243.002.349.006.114.004.267-.043.418.321.156.375.532 1.299.578 1.392.046.092.076.2.015.321-.061.122-.091.198-.182.305-.091.107-.193.239-.275.322-.092.091-.188.19-.081.374.107.183.473.782 1.016 1.266.699.624 1.289.818 1.472.91.183.091.29.076.396-.046.107-.122.457-.533.578-.716.122-.183.244-.152.41-.091.167.061 1.063.502 1.246.593.182.091.304.137.349.213.046.076.046.442-.098.847z"/></svg>
                        <span>Kirim WA</span>
                    </button>
                    <button class="btn-icon" title="Salin Link Undangan" onclick="copyInvitationLink('${escapeHtml(linkUndangan)}')">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <a href="${escapeHtml(linkUndangan)}" target="_blank" class="btn-icon" title="Preview Undangan Personal">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </a>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function triggerWhatsAppBlast(guestId, encodedWaLink, encodedLinkUndangan) {
    const waLink = decodeURIComponent(encodedWaLink);
    const linkUndangan = decodeURIComponent(encodedLinkUndangan);
    const guests = DataStore.getGuests();
    const guest = guests.find(g => String(g.id) === String(guestId));

    if (!guest) return;

    // Catat ke Riwayat Pengiriman dengan status "Dibuka untuk Pengiriman"
    DataStore.logBlast(guest, linkUndangan);

    // Buka WhatsApp di tab baru
    window.open(waLink, '_blank');

    showToast(`WhatsApp untuk ${guest.nama_tamu} berhasil dibuka! Status dicatat.`, "success");

    // Re-render
    renderGeneratorTable();
    renderDashboardStats();
}

function copyInvitationLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showToast("Link undangan personal berhasil disalin ke clipboard!", "success");
    }).catch(() => {
        // Fallback
        prompt("Salin link undangan ini:", link);
    });
}

// ===================================================================
// 6. RIWAYAT PENGIRIMAN
// ===================================================================
function initBlastLogs() {
    const clearBtn = document.getElementById('btnClearLogs');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pengiriman?")) {
                DataStore.clearBlastLogs();
                renderLogsTable();
                showToast("Riwayat pengiriman berhasil dibersihkan.", "info");
            }
        });
    }

    renderLogsTable();
}

function renderLogsTable() {
    const tableBody = document.getElementById('logsTableBody');
    if (!tableBody) return;

    const logs = DataStore.getBlastLogs();
    tableBody.innerHTML = '';

    if (logs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">
                    Belum ada riwayat blast WhatsApp yang tercatat.
                </td>
            </tr>
        `;
        return;
    }

    logs.forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code style="color: #cbd5e1;">${escapeHtml(log.tanggal)}</code></td>
            <td style="font-weight: 600; color: #ffffff;">${escapeHtml(log.nama_tamu)}</td>
            <td>${escapeHtml(log.instansi)}</td>
            <td><code>${escapeHtml(log.no_whatsapp)}</code></td>
            <td>
                <a href="${escapeHtml(log.link)}" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 0.82rem;">
                    Buka Link ↗
                </a>
            </td>
            <td><span class="badge badge-info">${escapeHtml(log.status)}</span></td>
        `;
        tableBody.appendChild(tr);
    });
}

// ===================================================================
// 7. DATA RSVP MANAGEMENT
// ===================================================================
function initRsvpManagement() {
    const rsvpFilter = document.getElementById('rsvpStatusFilter');
    const exportBtn = document.getElementById('btnExportRsvpCsv');

    if (rsvpFilter) {
        rsvpFilter.addEventListener('change', () => {
            renderRsvpTable();
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportRsvpsToCsv();
        });
    }

    renderRsvpTable();
}

function renderRsvpTable() {
    const tableBody = document.getElementById('rsvpTableBody');
    const filterSelect = document.getElementById('rsvpStatusFilter');
    if (!tableBody) return;

    const filter = filterSelect ? filterSelect.value : 'all';
    let rsvps = DataStore.getRSVPs();

    if (filter !== 'all') {
        rsvps = rsvps.filter(r => r.status.toLowerCase() === filter.toLowerCase());
    }

    tableBody.innerHTML = '';

    if (rsvps.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">
                    Belum ada data konfirmasi RSVP yang cocok.
                </td>
            </tr>
        `;
        return;
    }

    rsvps.forEach(r => {
        const tr = document.createElement('tr');
        const badgeClass = r.status === 'Hadir' ? 'badge-success' : (r.status === 'Tidak Hadir' ? 'badge-danger' : 'badge-warning');
        tr.innerHTML = `
            <td style="font-weight: 600; color: #ffffff;">${escapeHtml(r.nama)}</td>
            <td>${escapeHtml(r.instansi)}</td>
            <td><span class="badge badge-secondary">${escapeHtml(r.kategori)}</span></td>
            <td><span class="badge ${badgeClass}">${escapeHtml(r.status)}</span></td>
            <td>${escapeHtml(r.waktu)}</td>
            <td style="font-size: 0.85rem; color: #cbd5e1; max-width: 200px;">${escapeHtml(r.catatan || '-')}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function exportRsvpsToCsv() {
    const rsvps = DataStore.getRSVPs();
    if (rsvps.length === 0) {
        showToast("Belum ada data RSVP untuk diekspor.", "error");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,id,nama,instansi,kategori,status,jumlah_orang,waktu,catatan\n";
    rsvps.forEach(r => {
        csvContent += `"${r.id}","${r.nama}","${r.instansi}","${r.kategori}","${r.status}","${r.jumlah_orang || 1}","${r.waktu}","${(r.catatan || '').replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.setAttribute("download", `rsvp-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Data RSVP berhasil diekspor ke CSV!", "success");
}

// ===================================================================
// 8. PENGATURAN INFORMASI ACARA
// ===================================================================
function initSettingsForm() {
    const form = document.getElementById('eventSettingsForm');
    const resetBtn = document.getElementById('btnResetSettings');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const settings = {
                nama_acara: document.getElementById('setNamaAcara').value.trim(),
                tema_acara: document.getElementById('setTemaAcara').value.trim(),
                tanggal: document.getElementById('setTanggal').value,
                tanggal_format: document.getElementById('setTanggalFormat').value.trim(),
                jam: document.getElementById('setJam').value.trim(),
                lokasi: document.getElementById('setLokasi').value.trim(),
                alamat_lengkap: document.getElementById('setAlamat').value.trim(),
                link_maps: document.getElementById('setLinkMaps').value.trim(),
                deskripsi: document.getElementById('setDeskripsi').value.trim(),
                wa_template: document.getElementById('setWaTemplate').value
            };

            DataStore.saveSettings(settings);
            showToast("Pengaturan acara berhasil disimpan!", "success");
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Kembalikan seluruh pengaturan acara ke nilai awal?")) {
                DataStore.saveSettings(DEFAULT_SETTINGS);
                populateSettingsForm();
                showToast("Pengaturan acara di-reset ke nilai default.", "info");
            }
        });
    }

    populateSettingsForm();
}

function populateSettingsForm() {
    const settings = DataStore.getSettings();
    if (!settings) return;

    const mapIds = {
        setNamaAcara: settings.nama_acara,
        setTemaAcara: settings.tema_acara,
        setTanggal: settings.tanggal,
        setTanggalFormat: settings.tanggal_format,
        setJam: settings.jam,
        setLokasi: settings.lokasi,
        setAlamat: settings.alamat_lengkap,
        setLinkMaps: settings.link_maps,
        setDeskripsi: settings.deskripsi,
        setWaTemplate: settings.wa_template
    };

    Object.keys(mapIds).forEach(id => {
        const el = document.getElementById(id);
        if (el && mapIds[id] !== undefined) {
            el.value = mapIds[id];
        }
    });
}

// ===================================================================
// 9. MODALS & TOAST UTILITIES
// ===================================================================
function initModals() {
    // Form modal submit
    const guestForm = document.getElementById('guestForm');
    if (guestForm) {
        guestForm.addEventListener('submit', handleGuestFormSubmit);
    }

    // Close modal on click background or close buttons
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.btn-close-modal, .btn-cancel-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
        });
    });
}

function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
}

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg style="width: 20px; height: 20px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' : 
              type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' :
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
        </svg>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
