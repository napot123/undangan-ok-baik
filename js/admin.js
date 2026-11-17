/**
 * Edu Fair & Career Day 2026
 * Script Halaman Admin (admin.js)
 * Kode bersih, modular, dan mudah dipahami siswa SMK RPL
 */

// Data sampel awal jika belum ada di localStorage
const DATA_TAMU_AWAL = [
    { id: 1, nama_tamu: "Nur Noviana Sari", instansi: "Universitas Indonesia", kategori: "Universitas", no_whatsapp: "6282260060508", status: "Belum Dikirim" },
    { id: 2, nama_tamu: "Dinda Nurrahma", instansi: "PT Telkom Indonesia (Persero) Tbk", kategori: "Perusahaan", no_whatsapp: "6282260060509", status: "Belum Dikirim" },
    { id: 3, nama_tamu: "Yuni Arinta Putri", instansi: "Universitas Al Azhar Indonesia", kategori: "Universitas", no_whatsapp: "6281296159185", status: "Belum Dikirim" },
    { id: 4, nama_tamu: "Nanang Suhariyadi", instansi: "Alumni Angkatan 2022 - Software Engineer", kategori: "Alumni", no_whatsapp: "6285676400755", status: "Belum Dikirim" },
    { id: 5, nama_tamu: "Luqman", instansi: "PT Astra International Tbk", kategori: "Perusahaan", no_whatsapp: "6281385912277", status: "Belum Dikirim" },
    { id: 6, nama_tamu: "Prof. Hendra Wijaya", instansi: "Universitas Bina Nusantara (BINUS)", kategori: "Universitas", no_whatsapp: "6281140023412", status: "Belum Dikirim" },
    { id: 7, nama_tamu: "Nadia Putri", instansi: "Alumni Angkatan 2023 - UI/UX Designer", kategori: "Alumni", no_whatsapp: "6289631234567", status: "Belum Dikirim" },
    { id: 8, nama_tamu: "Farid", instansi: "PT Mitra Sejahtera", kategori: "Perusahaan", no_whatsapp: "6281574463908", status: "Belum Dikirim" }
];

document.addEventListener('DOMContentLoaded', () => {
    initNavigasiSidebar();
    muatDataAwal();
    tampilkanDashboard();
    tampilkanDataTamu();
    aturFormTambahTamu();
    aturImportCsv();
    tampilkanGeneratorLink();
    tampilkanDataRsvp();
    aturModalEdit();
});

// ===================================================================
// 1. MANAJEMEN PENYIMPANAN DATA (LOCALSTORAGE)
// ===================================================================
function muatDataAwal() {
    let tamu = [];
    try {
        tamu = JSON.parse(localStorage.getItem('edufair_guests')) || [];
    } catch (e) {
        tamu = [];
    }

    if (tamu.length === 0) {
        localStorage.setItem('edufair_guests', JSON.stringify(DATA_TAMU_AWAL));
        tamu = DATA_TAMU_AWAL;
    } else {
        // Pastikan Farid (081574463908) selalu ada di daftar tamu
        const adaFarid = tamu.find(t => t.no_whatsapp === '6281574463908' || (t.nama_tamu && t.nama_tamu.toLowerCase().includes('farid')));
        if (!adaFarid) {
            const nextId = Math.max(...tamu.map(t => Number(t.id) || 0)) + 1;
            tamu.push({
                id: nextId,
                nama_tamu: "Farid",
                instansi: "PT Mitra Sejahtera",
                kategori: "Perusahaan",
                no_whatsapp: "6281574463908",
                status: "Belum Dikirim"
            });
            localStorage.setItem('edufair_guests', JSON.stringify(tamu));
        } else if (adaFarid.nama_tamu !== "Farid") {
            adaFarid.nama_tamu = "Farid";
            adaFarid.instansi = "PT Mitra Sejahtera";
            localStorage.setItem('edufair_guests', JSON.stringify(tamu));
        }
    }

    if (!localStorage.getItem('edufair_rsvps')) {
        const rsvpAwal = [
            { id: 1, nama: "Nur Noviana Sari", instansi: "Universitas Indonesia", kategori: "Universitas", status: "Hadir", waktu: "15 Jan 2026, 10:30 WIB" },
            { id: 2, nama: "Dinda Nurrahma", instansi: "PT Telkom Indonesia (Persero) Tbk", kategori: "Perusahaan", status: "Hadir", waktu: "16 Jan 2026, 14:15 WIB" }
        ];
        localStorage.setItem('edufair_rsvps', JSON.stringify(rsvpAwal));
    }
}

function ambilSemuaTamu() {
    try {
        return JSON.parse(localStorage.getItem('edufair_guests')) || [];
    } catch (e) {
        return [];
    }
}

function simpanSemuaTamu(data) {
    localStorage.setItem('edufair_guests', JSON.stringify(data));
}

function ambilSemuaRsvp() {
    try {
        return JSON.parse(localStorage.getItem('edufair_rsvps')) || [];
    } catch (e) {
        return [];
    }
}

// ===================================================================
// 2. NAVIGASI SIDEBAR MENU
// ===================================================================
function initNavigasiSidebar() {
    const links = document.querySelectorAll('.sidebar-link[data-view]');
    const views = document.querySelectorAll('.tab-view');
    const pageTitle = document.getElementById('adminPageTitle');
    const toggleBtn = document.getElementById('btnToggleSidebar');
    const sidebar = document.querySelector('.sidebar');

    const judulMenu = {
        'dashboard': 'Dashboard Overview',
        'data-tamu': 'Daftar Data Tamu',
        'tambah-tamu': 'Tambah Tamu Baru',
        'import-csv': 'Import Data dari CSV',
        'generator-link': 'Generator Link & Blast WhatsApp',
        'data-rsvp': 'Data Konfirmasi Kehadiran (RSVP)'
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewTarget = link.getAttribute('data-view');

            // Set link aktif
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Tampilkan view target
            views.forEach(v => {
                if (v.id === `view-${viewTarget}`) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });

            // Ganti judul topbar
            if (pageTitle && judulMenu[viewTarget]) {
                pageTitle.textContent = judulMenu[viewTarget];
            }

            // Refresh konten view yang aktif
            if (viewTarget === 'dashboard') tampilkanDashboard();
            if (viewTarget === 'data-tamu') tampilkanDataTamu();
            if (viewTarget === 'generator-link') tampilkanGeneratorLink();
            if (viewTarget === 'data-rsvp') tampilkanDataRsvp();

            // Tutup sidebar di mobile
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    });

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
}

// ===================================================================
// 3. DASHBOARD STATISTIK
// ===================================================================
function tampilkanDashboard() {
    const tamu = ambilSemuaTamu();
    const rsvp = ambilSemuaRsvp();

    // 1. Total Tamu
    const totalTamu = tamu.length;

    // 2. Undangan sudah dibuka untuk pengiriman WhatsApp
    const dibukaWa = tamu.filter(t => t.status && t.status.includes('Dibuka')).length;

    // 3. Tamu yang sudah konfirmasi hadir
    const rsvpHadir = rsvp.filter(r => r.status === 'Hadir').length;

    // 4. Tamu yang belum konfirmasi
    // Dihitung dari total tamu dikurangi yang sudah RSVP
    const sudahRsvpSet = new Set(rsvp.map(r => r.instansi.toLowerCase()));
    let belumKonfirmasi = 0;
    tamu.forEach(t => {
        if (!sudahRsvpSet.has(t.instansi.toLowerCase())) {
            belumKonfirmasi++;
        }
    });

    // Pasang angka ke elemen HTML
    document.getElementById('statTotalTamu').textContent = totalTamu;
    document.getElementById('statDibukaWa').textContent = dibukaWa;
    document.getElementById('statRsvpHadir').textContent = rsvpHadir;
    document.getElementById('statBelumKonfirmasi').textContent = belumKonfirmasi;

    // Ringkasan Aktivitas Terbaru di Dashboard
    const listAktivitas = document.getElementById('dashboardRecentList');
    if (listAktivitas) {
        listAktivitas.innerHTML = '';
        if (rsvp.length === 0) {
            listAktivitas.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Belum ada konfirmasi RSVP</td></tr>';
        } else {
            rsvp.slice(0, 5).forEach(r => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight:600; color:#ffffff;">${escapeHtml(r.instansi)}</td>
                    <td>${escapeHtml(r.nama)}</td>
                    <td><span class="badge ${r.status === 'Hadir' ? 'badge-hadir' : 'badge-tidakhadir'}">${escapeHtml(r.status)}</span></td>
                    <td style="color:#94a3b8; font-size:0.8rem;">${escapeHtml(r.waktu)}</td>
                `;
                listAktivitas.appendChild(tr);
            });
        }
    }
}

// ===================================================================
// 4. DATA TAMU (TABEL, SEARCH, EDIT, DELETE)
// ===================================================================
function tampilkanDataTamu() {
    const tbody = document.getElementById('tabelDataTamu');
    const searchInput = document.getElementById('searchTamu');
    if (!tbody) return;

    let tamu = ambilSemuaTamu();

    // Filter pencarian jika ada
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
        tamu = tamu.filter(t => 
            (t.nama_tamu && t.nama_tamu.toLowerCase().includes(query)) ||
            (t.instansi && t.instansi.toLowerCase().includes(query)) ||
            (t.kategori && t.kategori.toLowerCase().includes(query))
        );
    }

    tbody.innerHTML = '';

    if (tamu.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #94a3b8; padding: 24px;">
                    Tidak ada data tamu ditemukan.
                </td>
            </tr>
        `;
        return;
    }

    tamu.forEach((t, index) => {
        const tr = document.createElement('tr');
        
        let badgeStatus = 'badge-belum';
        if (t.status && t.status.includes('Dibuka')) badgeStatus = 'badge-dibuka';
        if (t.status && t.status.includes('Hadir')) badgeStatus = 'badge-hadir';

        tr.innerHTML = `
            <td>#${index + 1}</td>
            <td style="font-weight: 600; color: #ffffff;">${escapeHtml(t.nama_tamu)}</td>
            <td>${escapeHtml(t.instansi)}</td>
            <td><span class="badge badge-kategori">${escapeHtml(t.kategori)}</span></td>
            <td><code>${escapeHtml(t.no_whatsapp || '-')}</code></td>
            <td><span class="badge ${badgeStatus}">${escapeHtml(t.status || 'Belum Dikirim')}</span></td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn-sm-edit" onclick="bukaModalEdit(${t.id})">Edit</button>
                    <button type="button" class="btn-sm-delete" onclick="hapusTamu(${t.id})">Hapus</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (searchInput && !searchInput.dataset.listener) {
        searchInput.dataset.listener = 'true';
        searchInput.addEventListener('input', () => tampilkanDataTamu());
    }
}

function hapusTamu(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data tamu ini?")) {
        let tamu = ambilSemuaTamu();
        tamu = tamu.filter(t => t.id !== id);
        simpanSemuaTamu(tamu);
        tampilkanToast("Data tamu berhasil dihapus.");
        tampilkanDataTamu();
        tampilkanDashboard();
    }
}

// ===================================================================
// 5. TAMBAH TAMU
// ===================================================================
function aturFormTambahTamu() {
    const form = document.getElementById('formTambahTamu');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('tambahNama').value.trim();
        const instansi = document.getElementById('tambahInstansi').value.trim();
        const kategori = document.getElementById('tambahKategori').value;
        const noWa = bersihkanNoHp(document.getElementById('tambahWa').value.trim());

        if (!nama || !instansi) {
            tampilkanToast("Nama dan Instansi wajib diisi!");
            return;
        }

        const tamu = ambilSemuaTamu();
        const nextId = tamu.length > 0 ? Math.max(...tamu.map(t => Number(t.id) || 0)) + 1 : 1;

        const tamuBaru = {
            id: nextId,
            nama_tamu: nama,
            instansi: instansi,
            kategori: kategori,
            no_whatsapp: noWa,
            status: "Belum Dikirim"
        };

        tamu.push(tamuBaru);
        simpanSemuaTamu(tamu);

        form.reset();
        tampilkanToast("Tamu baru berhasil ditambahkan!");

        // Otomatis pindah ke view Data Tamu
        const linkDataTamu = document.querySelector('.sidebar-link[data-view="data-tamu"]');
        if (linkDataTamu) linkDataTamu.click();
    });
}

// ===================================================================
// 6. IMPORT CSV MENGGUNAKAN PAPAPARSE
// ===================================================================
function aturImportCsv() {
    const dropzone = document.getElementById('dropzoneCsv');
    const fileInput = document.getElementById('fileInputCsv');
    const previewContainer = document.getElementById('importPreviewContainer');
    const previewTbody = document.getElementById('tabelPreviewCsv');
    const btnSimpanImport = document.getElementById('btnSimpanImport');

    let hasilParse = [];

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            prosesFileCsv(e.target.files[0]);
        }
    });

    function prosesFileCsv(file) {
        if (!file.name.endsWith('.csv')) {
            tampilkanToast("File harus berformat .csv!");
            return;
        }

        // Baca file menggunakan PapaParse
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                hasilParse = [];
                const rows = results.data;

                rows.forEach((r, idx) => {
                    const id = r.id || r.ID || (idx + 1);
                    const nama = r.nama_tamu || r.nama || r['Nama Tamu'] || '';
                    const instansi = r.instansi || r.Instansi || '';
                    const kategori = r.kategori || r.Kategori || 'Universitas';
                    let wa = r.no_whatsapp || r.whatsapp || r.no_wa || '';

                    // Tangani notasi eksponensial Excel (misal: 6,28226E+12)
                    wa = String(wa).replace(',', '.');
                    if (wa.includes('E+') || wa.includes('e+')) {
                        try {
                            wa = Math.round(Number(wa)).toString();
                        } catch(e) {}
                    }
                    wa = bersihkanNoHp(wa);

                    if (nama || instansi) {
                        hasilParse.push({
                            id: id,
                            nama_tamu: String(nama).trim(),
                            instansi: String(instansi).trim(),
                            kategori: String(kategori).trim(),
                            no_whatsapp: wa,
                            status: "Belum Dikirim"
                        });
                    }
                });

                if (hasilParse.length === 0) {
                    tampilkanToast("Data di file CSV kosong atau kolom tidak cocok.");
                    return;
                }

                // Tampilkan Preview
                previewContainer.style.display = 'block';
                previewTbody.innerHTML = '';
                hasilParse.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight:600; color:#fff;">${escapeHtml(row.nama_tamu)}</td>
                        <td>${escapeHtml(row.instansi)}</td>
                        <td>${escapeHtml(row.kategori)}</td>
                        <td><code>${escapeHtml(row.no_whatsapp)}</code></td>
                    `;
                    previewTbody.appendChild(tr);
                });

                tampilkanToast(`Berhasil membaca ${hasilParse.length} data tamu dari CSV.`);
            },
            error: function(err) {
                tampilkanToast("Gagal membaca file CSV: " + err.message);
            }
        });
    }

    if (btnSimpanImport) {
        btnSimpanImport.addEventListener('click', () => {
            if (hasilParse.length === 0) {
                tampilkanToast("Tidak ada data untuk diimpor!");
                return;
            }

            const tamuLama = ambilSemuaTamu();
            let maxId = tamuLama.length > 0 ? Math.max(...tamuLama.map(t => Number(t.id) || 0)) : 0;

            const tamuBaruMapped = hasilParse.map(item => {
                maxId++;
                return { ...item, id: maxId };
            });

            const gabungan = tamuLama.concat(tamuBaruMapped);
            simpanSemuaTamu(gabungan);

            tampilkanToast(`Sukses! ${hasilParse.length} data CSV berhasil dimasukkan ke Data Tamu.`);
            previewContainer.style.display = 'none';
            hasilParse = [];

            // Arahkan ke Data Tamu
            const linkDataTamu = document.querySelector('.sidebar-link[data-view="data-tamu"]');
            if (linkDataTamu) linkDataTamu.click();
        });
    }
}

// ===================================================================
// 7. GENERATOR LINK & BLAST WHATSAPP
// ===================================================================
function tampilkanGeneratorLink() {
    const tbody = document.getElementById('tabelGeneratorLink');
    const inputBaseUrl = document.getElementById('genBaseUrl');
    if (!tbody) return;

    // Set URL dasar otomatis ke index.html saat ini
    if (inputBaseUrl && !inputBaseUrl.value) {
        const loc = window.location;
        const pathParts = loc.pathname.split('/');
        pathParts.pop(); // buang admin.html
        inputBaseUrl.value = `${loc.protocol}//${loc.host}${pathParts.join('/')}/index.html`;
    }

    const baseUrl = inputBaseUrl ? inputBaseUrl.value.trim() : 'index.html';
    const tamu = ambilSemuaTamu();

    tbody.innerHTML = '';

    if (tamu.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:20px;">Belum ada data tamu.</td></tr>`;
        return;
    }

    tamu.forEach((t, index) => {
        const tr = document.createElement('tr');

        // 1. Buat Link Personal menggunakan URLSearchParams
        const params = new URLSearchParams();
        params.set('to', t.instansi || t.nama_tamu);
        params.set('kategori', t.kategori || 'Universitas');
        const linkPersonal = `${baseUrl}?${params.toString()}`;

        // 2. Buat Template Pesan WhatsApp
        const pesanWa = `Halo Bapak/Ibu perwakilan ${t.instansi}.

Kami mengundang Anda untuk menghadiri acara Edu Fair & Career Day 2026.

Silakan akses undangan resmi melalui link berikut:
${linkPersonal}

Kami berharap kehadiran Anda dalam acara ini.

Terima kasih.`;

        const waUrl = `https://wa.me/${bersihkanNoHp(t.no_whatsapp)}?text=${encodeURIComponent(pesanWa)}`;

        tr.innerHTML = `
            <td>#${index + 1}</td>
            <td style="font-weight:600; color:#fff;">${escapeHtml(t.nama_tamu)}</td>
            <td>${escapeHtml(t.instansi)}</td>
            <td><span class="badge badge-kategori">${escapeHtml(t.kategori)}</span></td>
            <td><code>${escapeHtml(t.no_whatsapp || '-')}</code></td>
            <td>
                <div class="action-btns">
                    <button type="button" class="btn-sm-copy" onclick="salinLink('${escapeHtml(linkPersonal)}')">
                        Salin Link
                    </button>
                    <button type="button" class="btn-sm-wa" onclick="kirimWhatsApp(${t.id}, '${escapeHtml(encodeURIComponent(waUrl))}')">
                        Kirim WhatsApp
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (inputBaseUrl && !inputBaseUrl.dataset.listener) {
        inputBaseUrl.dataset.listener = 'true';
        inputBaseUrl.addEventListener('input', () => tampilkanGeneratorLink());
    }
}

function salinLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        tampilkanToast("Link undangan personal berhasil disalin!");
    }).catch(() => {
        prompt("Salin tautan ini:", link);
    });
}

function kirimWhatsApp(tamuId, encodedWaUrl) {
    const waUrl = decodeURIComponent(encodedWaUrl);

    // Update status tamu menjadi "Dibuka untuk Pengiriman"
    const tamu = ambilSemuaTamu();
    const index = tamu.findIndex(t => t.id === tamuId);
    if (index !== -1) {
        tamu[index].status = "Dibuka untuk Pengiriman";
        simpanSemuaTamu(tamu);
    }

    // Buka WhatsApp di tab baru
    window.open(waUrl, '_blank');
    tampilkanToast("WhatsApp dibuka! Status tercatat sebagai 'Dibuka untuk Pengiriman'.");

    tampilkanGeneratorLink();
    tampilkanDashboard();
}

// ===================================================================
// 8. DATA RSVP
// ===================================================================
function tampilkanDataRsvp() {
    const tbody = document.getElementById('tabelDataRsvp');
    if (!tbody) return;

    const rsvps = ambilSemuaRsvp();
    tbody.innerHTML = '';

    if (rsvps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">Belum ada tamu yang konfirmasi RSVP.</td></tr>`;
        return;
    }

    rsvps.forEach((r, idx) => {
        const tr = document.createElement('tr');
        const badgeClass = r.status === 'Hadir' ? 'badge-hadir' : 'badge-tidakhadir';
        tr.innerHTML = `
            <td>#${idx + 1}</td>
            <td style="font-weight:600; color:#fff;">${escapeHtml(r.nama)}</td>
            <td>${escapeHtml(r.instansi)}</td>
            <td><span class="badge ${badgeClass}">${escapeHtml(r.status)}</span></td>
            <td>${escapeHtml(r.waktu)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===================================================================
// 9. MODAL EDIT DATA TAMU
// ===================================================================
function aturModalEdit() {
    const modal = document.getElementById('modalEditTamu');
    const form = document.getElementById('formEditTamu');
    const btnTutup = document.getElementById('btnTutupModal');

    if (btnTutup && modal) {
        btnTutup.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = Number(document.getElementById('editId').value);
            const nama = document.getElementById('editNama').value.trim();
            const instansi = document.getElementById('editInstansi').value.trim();
            const kategori = document.getElementById('editKategori').value;
            const wa = bersihkanNoHp(document.getElementById('editWa').value.trim());

            const tamu = ambilSemuaTamu();
            const index = tamu.findIndex(t => t.id === id);
            if (index !== -1) {
                tamu[index].nama_tamu = nama;
                tamu[index].instansi = instansi;
                tamu[index].kategori = kategori;
                tamu[index].no_whatsapp = wa;
                simpanSemuaTamu(tamu);
                tampilkanToast("Data tamu berhasil diperbarui!");
            }

            modal.classList.remove('active');
            tampilkanDataTamu();
            tampilkanDashboard();
        });
    }
}

function bukaModalEdit(id) {
    const modal = document.getElementById('modalEditTamu');
    const tamu = ambilSemuaTamu();
    const target = tamu.find(t => t.id === id);

    if (!target || !modal) return;

    document.getElementById('editId').value = target.id;
    document.getElementById('editNama').value = target.nama_tamu || '';
    document.getElementById('editInstansi').value = target.instansi || '';
    document.getElementById('editKategori').value = target.kategori || 'Universitas';
    document.getElementById('editWa').value = target.no_whatsapp || '';

    modal.classList.add('active');
}

// ===================================================================
// 10. HELPER UTILITIES
// ===================================================================
function bersihkanNoHp(phone) {
    if (!phone) return "";
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
        clean = '62' + clean.substring(1);
    } else if (!clean.startsWith('62') && clean.length > 5) {
        clean = '62' + clean;
    }
    return clean;
}

function tampilkanToast(pesan) {
    let toast = document.getElementById('toastAdmin');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastAdmin';
        toast.className = 'toast-admin';
        document.body.appendChild(toast);
    }

    toast.textContent = pesan;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
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
