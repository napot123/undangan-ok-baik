/**
 * Edu Fair & Career Day 2026
 * Data Management & Storage Layer
 */

const STORAGE_KEYS = {
    GUESTS: 'edufair_guests_2026',
    SETTINGS: 'edufair_settings_2026',
    BLAST_LOGS: 'edufair_blast_logs_2026',
    RSVP_LIST: 'edufair_rsvp_list_2026'
};

// Data Awal (Seed Data)
const DEFAULT_GUESTS = [
    {
        id: 1,
        nama_tamu: "Nur Noviana Sari",
        instansi: "Universitas Indonesia",
        kategori: "Universitas",
        no_whatsapp: "6282260060508",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 2,
        nama_tamu: "Dinda Nurrahma",
        instansi: "PT Telkom Indonesia (Persero) Tbk",
        kategori: "Perusahaan",
        no_whatsapp: "6282260060509",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 3,
        nama_tamu: "Yuni Arinta Putri",
        instansi: "Universitas Al Azhar Indonesia",
        kategori: "Universitas",
        no_whatsapp: "6281296159185",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 4,
        nama_tamu: "Nanang Suhariyadi",
        instansi: "Alumni Angkatan 2022 - Software Engineer",
        kategori: "Alumni",
        no_whatsapp: "6285676400755",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 5,
        nama_tamu: "Luqman",
        instansi: "PT Astra International Tbk",
        kategori: "Perusahaan",
        no_whatsapp: "6281385912277",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 6,
        nama_tamu: "Prof. Hendra Wijaya",
        instansi: "Universitas Bina Nusantara (BINUS)",
        kategori: "Universitas",
        no_whatsapp: "6281140023412",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 7,
        nama_tamu: "Nadia Putri",
        instansi: "Alumni Angkatan 2023 - UI/UX Designer",
        kategori: "Alumni",
        no_whatsapp: "6289631234567",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 8,
        nama_tamu: "Dr. Ir. Rian Pratama",
        instansi: "Institut Teknologi Bandung (ITB)",
        kategori: "Universitas",
        no_whatsapp: "6281234567890",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 9,
        nama_tamu: "Sarah Amanda",
        instansi: "PT Bank Central Asia Tbk (BCA)",
        kategori: "Perusahaan",
        no_whatsapp: "6281987654321",
        status_undangan: "Belum Dikirim"
    },
    {
        id: 10,
        nama_tamu: "Bagas Wicaksono",
        instansi: "Alumni Angkatan 2021 - Data Analyst",
        kategori: "Alumni",
        no_whatsapp: "6285712345678",
        status_undangan: "Belum Dikirim"
    }
];

const DEFAULT_SETTINGS = {
    nama_acara: "Edu Fair & Career Day 2026",
    tema_acara: "Membuka Gerbang Masa Depan: Eksplorasi Peluang Pendidikan Tinggi & Karier Global",
    tanggal: "2026-01-24",
    tanggal_format: "Sabtu, 24 Januari 2026",
    jam: "08.00 - 15.00 WIB",
    lokasi: "Grand Auditorium & Exhibition Hall SMK Telkom Jakarta",
    alamat_lengkap: "Jl. Daan Mogot KM. 11, Cengkareng, Jakarta Barat 11710",
    link_maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8668270560867!2d106.72620787586745!3d-6.148651060269383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7e51cfa8cf5%3A0x6b4c3bf5e55e880!2sSMK%20Telkom%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    maps_direct_url: "https://maps.google.com/?q=SMK+Telkom+Jakarta",
    deskripsi: "Ajang tahunan prestisius yang mempertemukan universitas terkemuka, perusahaan multinasional dan BUMN, serta alumni inspiratif bersama ribuan siswa dan pencari kerja muda dalam merancang masa depan cemerlang.",
    url_dasar: "", // diisi dinamis jika kosong
    wa_template: `Halo Bapak/Ibu perwakilan [NAMA_INSTANSI].

Kami mengundang Anda untuk menghadiri acara Edu Fair & Career Day 2026.

Silakan akses undangan resmi melalui link berikut:
[LINK_UNDANGAN]

Kami berharap kehadiran Anda dalam acara ini.

Terima kasih.`
};

const DEFAULT_RUNDOWN = [
    { jam: "08.00 - 08.45 WIB", agenda: "Registrasi Tamu Undangan, Welcome Drink & Networking Pagi", badge: "Registrasi" },
    { jam: "08.45 - 09.30 WIB", agenda: "Opening Ceremony, Sambutan Kepala Sekolah & Pembukaan Resmi", badge: "Seremonial" },
    { jam: "09.30 - 12.00 WIB", agenda: "Pameran Edukasi & Karier (Campus & Corporate Booth Exhibition Sesi I)", badge: "Expo" },
    { jam: "12.00 - 13.00 WIB", agenda: "Istirahat, Sholat, & VIP Executive Lunch", badge: "Break" },
    { jam: "13.00 - 14.15 WIB", agenda: "Career Talkshow: 'Skills of Tomorrow: AI, Tech & Future Industry'", badge: "Talkshow" },
    { jam: "14.15 - 15.00 WIB", agenda: "Penyerahan Piagam Penghargaan Kemitraan & Penutupan Acara", badge: "Closing" }
];

const DEFAULT_BENEFITS = [
    {
        icon: "booth",
        judul: "Fasilitas Booth VIP Eksklusif",
        deskripsi: "Stan pameran berukuran luas dilengkapi meja representatif, kursi eksekutif, instalasi listrik, dan koneksi internet stabil."
    },
    {
        icon: "audience",
        judul: "Akses 1.000+ Audiens Potensial",
        deskripsi: "Peluang interaksi langsung tatap muka dengan siswa kelas XII, calon mahasiswa, orang tua, dan alumni yang aktif mencari peluang."
    },
    {
        icon: "stage",
        judul: "Slot Presentasi Panggung Utama",
        deskripsi: "Kesempatan emas memaparkan profil universitas, program beasiswa, atau program karier perusahaan langsung di depan audiens umum."
    },
    {
        icon: "branding",
        judul: "Promosi & Publikasi Terpadu",
        deskripsi: "Penempatan logo pada backdrop megah, booklet e-katalog digital, dan publikasi media sosial resmi sekolah."
    },
    {
        icon: "database",
        judul: "Data Leads & Buku Tamu Digital",
        deskripsi: "Sistem absensi dan registrasi pengunjung booth terintegrasi untuk tindak lanjut seleksi atau rekrutmen pasca acara."
    },
    {
        icon: "hospitality",
        judul: "Executive Hospitality Service",
        deskripsi: "Layanan konsumsi VIP (welcome snack, coffee break, prasmanan siang) dan ruang tunggu khusus tamu terhormat."
    }
];

// Helper Storage Manager
const DataStore = {
    // Ambil Data Tamu
    getGuests() {
        const raw = localStorage.getItem(STORAGE_KEYS.GUESTS);
        if (!raw) {
            this.saveGuests(DEFAULT_GUESTS);
            return DEFAULT_GUESTS;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("Gagal parse tamu dari localStorage:", e);
            return DEFAULT_GUESTS;
        }
    },

    // Simpan Data Tamu
    saveGuests(guests) {
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
    },

    // Tambah Tamu Baru
    addGuest(guest) {
        const guests = this.getGuests();
        const nextId = guests.length > 0 ? Math.max(...guests.map(g => Number(g.id) || 0)) + 1 : 1;
        const newGuest = {
            id: nextId,
            nama_tamu: (guest.nama_tamu || "").trim(),
            instansi: (guest.instansi || "").trim(),
            kategori: guest.kategori || "Universitas",
            no_whatsapp: this.cleanPhoneNumber(guest.no_whatsapp),
            status_undangan: guest.status_undangan || "Belum Dikirim"
        };
        guests.push(newGuest);
        this.saveGuests(guests);
        return newGuest;
    },

    // Update Tamu
    updateGuest(id, updatedData) {
        const guests = this.getGuests();
        const index = guests.findIndex(g => String(g.id) === String(id));
        if (index !== -1) {
            guests[index] = {
                ...guests[index],
                ...updatedData,
                no_whatsapp: updatedData.no_whatsapp ? this.cleanPhoneNumber(updatedData.no_whatsapp) : guests[index].no_whatsapp
            };
            this.saveGuests(guests);
            return guests[index];
        }
        return null;
    },

    // Hapus Tamu
    deleteGuest(id) {
        const guests = this.getGuests();
        const filtered = guests.filter(g => String(g.id) !== String(id));
        this.saveGuests(filtered);
        return filtered;
    },

    // Ambil Pengaturan
    getSettings() {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!raw) {
            this.saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
        try {
            const data = JSON.parse(raw);
            return { ...DEFAULT_SETTINGS, ...data };
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    },

    // Simpan Pengaturan
    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Ambil Riwayat Pengiriman
    getBlastLogs() {
        const raw = localStorage.getItem(STORAGE_KEYS.BLAST_LOGS);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    },

    // Catat Riwayat Pengiriman
    logBlast(guest, linkUndangan) {
        const logs = this.getBlastLogs();
        const now = new Date();
        const timestamp = now.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const newLog = {
            id: Date.now(),
            tamu_id: guest.id,
            nama_tamu: guest.nama_tamu,
            instansi: guest.instansi,
            no_whatsapp: guest.no_whatsapp,
            link: linkUndangan,
            tanggal: timestamp,
            raw_date: now.toISOString(),
            status: "Dibuka untuk Pengiriman"
        };

        logs.unshift(newLog); // Tambah di awal
        localStorage.setItem(STORAGE_KEYS.BLAST_LOGS, JSON.stringify(logs));

        // Update juga status di Data Tamu
        this.updateGuest(guest.id, { status_undangan: "Dibuka untuk Pengiriman" });

        return newLog;
    },

    // Hapus Riwayat Pengiriman
    clearBlastLogs() {
        localStorage.removeItem(STORAGE_KEYS.BLAST_LOGS);
    },

    // Ambil Data RSVP
    getRSVPs() {
        const raw = localStorage.getItem(STORAGE_KEYS.RSVP_LIST);
        if (!raw) {
            // Seed 2 contoh awal untuk demonstrasi
            const sampleRSVP = [
                {
                    id: 1,
                    nama: "Nur Noviana Sari",
                    instansi: "Universitas Indonesia",
                    kategori: "Universitas",
                    status: "Hadir",
                    jumlah_orang: 2,
                    waktu: "15 Jan 2026, 10:30 WIB",
                    catatan: "Kami siap hadir dan mengisi booth expo."
                },
                {
                    id: 2,
                    nama: "Dinda Nurrahma",
                    instansi: "PT Telkom Indonesia (Persero) Tbk",
                    kategori: "Perusahaan",
                    status: "Hadir",
                    jumlah_orang: 3,
                    waktu: "16 Jan 2026, 14:15 WIB",
                    catatan: "Tim HR & Talent Acquisition kami akan hadir."
                }
            ];
            this.saveRSVPs(sampleRSVP);
            return sampleRSVP;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    },

    // Simpan RSVP Baru
    saveRSVP(rsvpData) {
        const rsvps = this.getRSVPs();
        const now = new Date();
        const timestamp = now.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';

        const newEntry = {
            id: Date.now(),
            nama: (rsvpData.nama || "").trim(),
            instansi: (rsvpData.instansi || "").trim(),
            kategori: rsvpData.kategori || "Tamu Undangan",
            status: rsvpData.status || "Hadir",
            jumlah_orang: parseInt(rsvpData.jumlah_orang, 10) || 1,
            waktu: timestamp,
            catatan: (rsvpData.catatan || "").trim()
        };

        // Cek jika sudah pernah RSVP dari instansi yang sama, update saja
        const existingIdx = rsvps.findIndex(r => 
            r.instansi.toLowerCase() === newEntry.instansi.toLowerCase() && 
            newEntry.instansi !== ""
        );

        if (existingIdx !== -1) {
            rsvps[existingIdx] = { ...rsvps[existingIdx], ...newEntry };
        } else {
            rsvps.unshift(newEntry);
        }

        this.saveRSVPs(rsvps);

        // Jika nama / instansi cocok di daftar tamu, update statusnya juga
        const guests = this.getGuests();
        const matchedGuest = guests.find(g => 
            g.instansi.toLowerCase() === newEntry.instansi.toLowerCase() ||
            g.nama_tamu.toLowerCase() === newEntry.nama.toLowerCase()
        );
        if (matchedGuest) {
            this.updateGuest(matchedGuest.id, { status_undangan: `RSVP ${newEntry.status}` });
        }

        return newEntry;
    },

    saveRSVPs(rsvps) {
        localStorage.setItem(STORAGE_KEYS.RSVP_LIST, JSON.stringify(rsvps));
    },

    // Pembersih Nomor WhatsApp (Hilangkan +, spasi, dash, dan konversi 08xx ke 628xx)
    cleanPhoneNumber(phone) {
        if (!phone) return "";
        let cleaned = String(phone).replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        } else if (!cleaned.startsWith('62') && cleaned.length > 5) {
            cleaned = '62' + cleaned;
        }
        return cleaned;
    },

    // Buat Link Undangan Personal
    generateInvitationLink(baseUrl, instansi, kategori, namaTamu = "") {
        let base = (baseUrl || "").trim();
        if (!base) {
            // Deteksi otomatis URL saat ini
            if (typeof window !== 'undefined') {
                const loc = window.location;
                const pathParts = loc.pathname.split('/');
                pathParts.pop(); // buang admin.html jika ada
                const dir = pathParts.join('/');
                base = `${loc.protocol}//${loc.host}${dir}/index.html`;
            } else {
                base = "index.html";
            }
        }
        
        // Buat URLSearchParams
        const params = new URLSearchParams();
        if (instansi) params.set('to', instansi);
        if (kategori) params.set('kategori', kategori);
        if (namaTamu) params.set('penerima', namaTamu);

        const separator = base.includes('?') ? '&' : '?';
        return `${base}${separator}${params.toString()}`;
    },

    // Buat Link WhatsApp wa.me
    generateWhatsAppLink(phone, template, instansi, linkUndangan, namaTamu = "", kategori = "") {
        const cleanedPhone = this.cleanPhoneNumber(phone);
        let message = template
            .replace(/\[NAMA_INSTANSI\]/g, instansi || "Bapak/Ibu")
            .replace(/\[NAMA_TAMU\]/g, namaTamu || instansi || "Bapak/Ibu")
            .replace(/\[KATEGORI\]/g, kategori || "Tamu Undangan")
            .replace(/\[LINK_UNDANGAN\]/g, linkUndangan);

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    },

    // Fallback Parser CSV jika PapaParse CDN belum terunduh
    parseCSVFallback(text) {
        if (!text || typeof text !== 'string') return [];
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) return [];

        // Deteksi delimiter (; atau ,)
        const firstLine = lines[0];
        const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';

        const parseLine = (line) => {
            const result = [];
            let cur = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"' || char === "'") {
                    inQuotes = !inQuotes;
                } else if (char === delimiter && !inQuotes) {
                    result.push(cur.trim());
                    cur = '';
                } else {
                    cur += char;
                }
            }
            result.push(cur.trim());
            return result;
        };

        const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = parseLine(lines[i]);
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });
            data.push(row);
        }
        return data;
    }
};

// Buat global DataStore tersedia di browser window
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
    window.DEFAULT_RUNDOWN = DEFAULT_RUNDOWN;
    window.DEFAULT_BENEFITS = DEFAULT_BENEFITS;
}

