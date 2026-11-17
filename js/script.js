/**
 * Edu Fair & Career Day 2026
 * Script Halaman Undangan Publik (script.js)
 * Menggunakan Vanilla JavaScript murni & URLSearchParams
 */

document.addEventListener('DOMContentLoaded', () => {
    bacaParameterUrl();
    mulaiCountdown();
    aturBukaUndangan();
    tanganiFormRsvp();
});

// 1. Membaca Parameter URL menggunakan URLSearchParams
function bacaParameterUrl() {
    // Membaca query parameter seperti ?nama=Farid&instansi=PT+Mitra+Sejahtera&kategori=Perusahaan
    const urlParams = new URLSearchParams(window.location.search);
    
    // Parameter nama tamu & instansi
    const namaParam = urlParams.get('nama') || '';
    const toParam = urlParams.get('to') || '';
    const instansiParam = urlParams.get('instansi') || '';
    const kategoriParam = urlParams.get('kategori') || '';

    // Ambil elemen HTML target
    const coverNama = document.getElementById('coverNamaTamu');
    const coverInstansi = document.getElementById('coverInstansiTamu');
    const coverKategori = document.getElementById('coverKategoriTamu');
    
    const heroNama = document.getElementById('heroNamaInstansi');
    const heroInstansi = document.getElementById('heroInstansiTamu');
    const heroKategori = document.getElementById('heroKategoriTamu');

    // Field di formulir RSVP
    const inputNama = document.getElementById('rsvpNama');
    const inputInstansi = document.getElementById('rsvpInstansi');
    const selectKategori = document.getElementById('rsvpKategori');

    // Tentukan Nama Tamu (prioritaskan 'nama', fallback ke 'to')
    let namaTamu = namaParam || toParam || '';
    let namaInstansi = instansiParam || '';

    // Jika parameter to diisi tapi bukan nama tamu, atau nama dan instansi
    if (namaTamu) {
        const decodedNama = decodeURIComponent(namaTamu);
        if (coverNama) coverNama.textContent = decodedNama;
        if (heroNama) heroNama.textContent = decodedNama;
        if (inputNama) inputNama.value = decodedNama;
    } else {
        const defaultName = "Bapak/Ibu Tamu Undangan";
        if (coverNama) coverNama.textContent = defaultName;
        if (heroNama) heroNama.textContent = defaultName;
    }

    // Tampilkan Nama Instansi di bawah Nama Tamu jika ada
    if (namaInstansi) {
        const decodedInstansi = decodeURIComponent(namaInstansi);
        if (coverInstansi) {
            coverInstansi.textContent = decodedInstansi;
            coverInstansi.style.display = 'block';
        }
        if (heroInstansi) {
            heroInstansi.textContent = decodedInstansi;
            heroInstansi.style.display = 'block';
        }
        if (inputInstansi) inputInstansi.value = decodedInstansi;
    } else {
        if (coverInstansi) coverInstansi.style.display = 'none';
        if (heroInstansi) heroInstansi.style.display = 'none';
    }

    // Jika ada parameter 'kategori', ganti teks & pilih kategori di formulir
    if (kategoriParam) {
        const decodedKategori = decodeURIComponent(kategoriParam);
        if (coverKategori) coverKategori.textContent = decodedKategori;
        if (heroKategori) heroKategori.textContent = decodedKategori;

        if (selectKategori) {
            for (let i = 0; i < selectKategori.options.length; i++) {
                if (selectKategori.options[i].value.toLowerCase() === decodedKategori.toLowerCase()) {
                    selectKategori.selectedIndex = i;
                    break;
                }
            }
        }
    } else {
        if (coverKategori) coverKategori.textContent = "Tamu Undangan";
        if (heroKategori) heroKategori.textContent = "Tamu Undangan";
    }
}

// 2. Countdown Menuju Hari Acara (24 Januari 2026 08:00 WIB)
function mulaiCountdown() {
    const tanggalAcara = new Date('2026-01-24T08:00:00').getTime();

    const hariEl = document.getElementById('cdHari');
    const jamEl = document.getElementById('cdJam');
    const menitEl = document.getElementById('cdMenit');
    const detikEl = document.getElementById('cdDetik');

    function perbaruiTimer() {
        const sekarang = new Date().getTime();
        const selisih = tanggalAcara - sekarang;

        if (selisih <= 0) {
            if (hariEl) hariEl.textContent = '00';
            if (jamEl) jamEl.textContent = '00';
            if (menitEl) menitEl.textContent = '00';
            if (detikEl) detikEl.textContent = '00';
            return;
        }

        const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((selisih % 1000) / 1000);

        if (hariEl) hariEl.textContent = String(hari).padStart(2, '0');
        if (jamEl) jamEl.textContent = String(jam).padStart(2, '0');
        if (menitEl) menitEl.textContent = String(menit).padStart(2, '0');
        if (detikEl) detikEl.textContent = String(detik).padStart(2, '0');
    }

    perbaruiTimer();
    setInterval(perbaruiTimer, 1000);
}

// 3. Tombol Buka Undangan (Menghilangkan Cover)
function aturBukaUndangan() {
    const cover = document.getElementById('coverOverlay');
    const btnBuka = document.getElementById('btnBukaUndangan');

    if (btnBuka && cover) {
        btnBuka.addEventListener('click', () => {
            cover.classList.add('opened');
        });
    }
}

// 4. Form RSVP - Simpan ke LocalStorage
function tanganiFormRsvp() {
    const form = document.getElementById('formRsvp');
    const successCard = document.getElementById('rsvpSuccess');
    const successNama = document.getElementById('successNama');
    const successStatus = document.getElementById('successStatus');
    const btnReset = document.getElementById('btnResetRsvp');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('rsvpNama').value.trim();
        const instansi = document.getElementById('rsvpInstansi').value.trim();
        const kategori = document.getElementById('rsvpKategori').value;
        const status = document.querySelector('input[name="kehadiran"]:checked')?.value || 'Hadir';
        const pesan = document.getElementById('rsvpPesan').value.trim();

        if (!nama || !instansi) {
            tampilkanToast("Mohon isi Nama dan Nama Instansi!");
            return;
        }

        // Catat waktu sekarang
        const sekarang = new Date();
        const waktuStr = sekarang.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';

        const dataBaru = {
            id: Date.now(),
            nama: nama,
            instansi: instansi,
            kategori: kategori,
            status: status,
            waktu: waktuStr,
            pesan: pesan
        };

        // Ambil data RSVP lama dari localStorage
        let daftarRsvp = [];
        try {
            daftarRsvp = JSON.parse(localStorage.getItem('edufair_rsvps')) || [];
        } catch (err) {
            daftarRsvp = [];
        }

        // Cek jika sudah pernah RSVP dengan instansi yang sama, update saja
        const indexLama = daftarRsvp.findIndex(r => r.instansi.toLowerCase() === instansi.toLowerCase());
        if (indexLama !== -1) {
            daftarRsvp[indexLama] = dataBaru;
        } else {
            daftarRsvp.unshift(dataBaru);
        }

        // Simpan kembali ke localStorage
        localStorage.setItem('edufair_rsvps', JSON.stringify(daftarRsvp));

        // Tampilkan kartu sukses
        form.style.display = 'none';
        if (successCard) {
            successCard.classList.add('active');
            if (successNama) successNama.textContent = `${nama} (${instansi})`;
            if (successStatus) {
                successStatus.textContent = status === 'Hadir' ? '✓ Dikonfirmasi Hadir' : '✕ Tidak Dapat Hadir';
                successStatus.style.color = status === 'Hadir' ? '#10b981' : '#ef4444';
            }
        }

        tampilkanToast("Terima kasih! Konfirmasi kehadiran Anda berhasil disimpan.");
    });

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            form.style.display = 'block';
            if (successCard) successCard.classList.remove('active');
        });
    }
}

// 5. Notifikasi Toast Sederhana
function tampilkanToast(pesan) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-box';
        document.body.appendChild(toast);
    }

    toast.textContent = pesan;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

