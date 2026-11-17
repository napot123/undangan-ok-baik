/**
 * Edu Fair & Career Day 2026
 * Public Invitation JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Komponen
    initEventData();
    initUrlParameters();
    initCountdown();
    initCoverModal();
    initAudioController();
    initRundownAndBenefits();
    initRsvpForm();
    initRsvpFeed();
});

// 1. Sinkronisasi Data Acara dari LocalStorage / DataStore
function initEventData() {
    if (typeof DataStore === 'undefined') return;
    const settings = DataStore.getSettings();

    // Judul & Tema
    const heroTitle = document.getElementById('heroTitle');
    const heroTheme = document.getElementById('heroTheme');
    const heroDate = document.getElementById('heroDate');
    const heroTime = document.getElementById('heroTime');
    const heroLocation = document.getElementById('heroLocation');
    const venueName = document.getElementById('venueName');
    const venueAddress = document.getElementById('venueAddress');
    const mapIframe = document.getElementById('mapIframe');
    const mapDirectionsBtn = document.getElementById('mapDirectionsBtn');

    if (heroTitle && settings.nama_acara) {
        // highlight 2026 in gold
        const titleParts = settings.nama_acara.split('2026');
        if (titleParts.length > 1) {
            heroTitle.innerHTML = `${titleParts[0]}<span class="text-gold">2026</span>${titleParts[1]}`;
        } else {
            heroTitle.textContent = settings.nama_acara;
        }
    }

    if (heroTheme && settings.tema_acara) {
        heroTheme.textContent = `"${settings.tema_acara}"`;
    }

    if (heroDate && settings.tanggal_format) {
        heroDate.textContent = settings.tanggal_format;
    }

    if (heroTime && settings.jam) {
        heroTime.textContent = settings.jam;
    }

    if (heroLocation && settings.lokasi) {
        heroLocation.textContent = settings.lokasi;
    }

    if (venueName && settings.lokasi) {
        venueName.textContent = settings.lokasi;
    }

    if (venueAddress && settings.alamat_lengkap) {
        venueAddress.textContent = settings.alamat_lengkap;
    }

    if (mapIframe && settings.link_maps) {
        mapIframe.src = settings.link_maps;
    }

    if (mapDirectionsBtn && settings.maps_direct_url) {
        mapDirectionsBtn.href = settings.maps_direct_url;
    }
}

// 2. Baca URL Query Parameters menggunakan URLSearchParams
function initUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Parameter 'to' untuk Nama Instansi / Tamu
    const toParam = urlParams.get('to') || urlParams.get('nama') || '';
    
    // Parameter 'kategori' untuk Kategori Tamu
    const kategoriParam = urlParams.get('kategori') || urlParams.get('category') || '';
    
    // Parameter 'penerima' untuk Kontak Personal PIC
    const penerimaParam = urlParams.get('penerima') || '';

    // Ambil Elemen Tampilan
    const coverRecipientName = document.getElementById('coverRecipientName');
    const coverRecipientCategory = document.getElementById('coverRecipientCategory');
    const heroGuestName = document.getElementById('heroGuestName');
    const heroGuestContact = document.getElementById('heroGuestContact');
    const heroGuestCategory = document.getElementById('heroGuestCategory');

    // Field Form RSVP
    const rsvpNameInput = document.getElementById('rsvpNama');
    const rsvpInstansiInput = document.getElementById('rsvpInstansi');
    const rsvpKategoriSelect = document.getElementById('rsvpKategori');

    if (toParam) {
        const decodedTo = decodeURIComponent(toParam);
        if (coverRecipientName) coverRecipientName.textContent = decodedTo;
        if (heroGuestName) heroGuestName.textContent = decodedTo;
        if (rsvpInstansiInput) rsvpInstansiInput.value = decodedTo;
    } else {
        const defaultName = "Bapak/Ibu Mitra & Tamu Kehormatan";
        if (coverRecipientName) coverRecipientName.textContent = defaultName;
        if (heroGuestName) heroGuestName.textContent = defaultName;
    }

    if (penerimaParam) {
        const decodedPenerima = decodeURIComponent(penerimaParam);
        if (heroGuestContact) {
            heroGuestContact.textContent = `U.p. ${decodedPenerima}`;
            heroGuestContact.style.display = 'block';
        }
        if (rsvpNameInput) rsvpNameInput.value = decodedPenerima;
    }

    if (kategoriParam) {
        const decodedKategori = decodeURIComponent(kategoriParam);
        if (coverRecipientCategory) coverRecipientCategory.textContent = decodedKategori;
        if (heroGuestCategory) heroGuestCategory.textContent = decodedKategori;

        // Auto select di form RSVP
        if (rsvpKategoriSelect) {
            for (let i = 0; i < rsvpKategoriSelect.options.length; i++) {
                if (rsvpKategoriSelect.options[i].value.toLowerCase() === decodedKategori.toLowerCase()) {
                    rsvpKategoriSelect.selectedIndex = i;
                    break;
                }
            }
        }
    } else {
        if (coverRecipientCategory) coverRecipientCategory.textContent = "Tamu Undangan";
        if (heroGuestCategory) heroGuestCategory.textContent = "Tamu Undangan";
    }
}

// 3. Countdown Timer Menuju Hari Acara
function initCountdown() {
    let eventDateStr = "2026-01-24T08:00:00";
    if (typeof DataStore !== 'undefined') {
        const settings = DataStore.getSettings();
        if (settings.tanggal) {
            eventDateStr = `${settings.tanggal}T08:00:00`;
        }
    }

    const targetDate = new Date(eventDateStr).getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// 4. Modal Cover & Pembuka Undangan (Envelope effect)
function initCoverModal() {
    const coverOverlay = document.getElementById('coverOverlay');
    const openBtn = document.getElementById('openInvitationBtn');

    if (openBtn && coverOverlay) {
        openBtn.addEventListener('click', () => {
            coverOverlay.classList.add('opened');
            // Play ambient sound jika audio controller aktif
            if (window.audioController) {
                window.audioController.play();
            }
        });
    }
}

// 5. Audio Controller (Synthesized Ambient Music with Web Audio API)
function initAudioController() {
    const audioBtn = document.getElementById('audioToggleBtn');
    if (!audioBtn) return;

    let isPlaying = false;
    let audioCtx = null;
    let synthTimer = null;

    // Web Audio Synthesizer chord progression (G gentle ambient pad)
    function playAmbientChords() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const chords = [
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [196.00, 246.94, 293.66, 392.00]  // G6
        ];
        let currentChordIdx = 0;

        function triggerChord() {
            if (!isPlaying || !audioCtx) return;
            const now = audioCtx.currentTime;
            const chord = chords[currentChordIdx];

            chord.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                // Soft attack and gentle release
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + 4.8);
            });

            currentChordIdx = (currentChordIdx + 1) % chords.length;
            synthTimer = setTimeout(triggerChord, 4500);
        }

        triggerChord();
    }

    function stopAmbientChords() {
        if (synthTimer) clearTimeout(synthTimer);
        if (audioCtx && audioCtx.state === 'running') {
            audioCtx.suspend();
        }
    }

    const controller = {
        play() {
            isPlaying = true;
            audioBtn.classList.add('playing');
            playAmbientChords();
        },
        pause() {
            isPlaying = false;
            audioBtn.classList.remove('playing');
            stopAmbientChords();
        },
        toggle() {
            if (isPlaying) {
                this.pause();
                showToast("Musik latar dimatikan", "info");
            } else {
                this.play();
                showToast("Musik latar dimainkan", "info");
            }
        }
    };

    window.audioController = controller;

    audioBtn.addEventListener('click', () => {
        controller.toggle();
    });
}

// 6. Tampilkan Rundown & Benefit Booth
function initRundownAndBenefits() {
    // Render Rundown
    const rundownContainer = document.getElementById('rundownContainer');
    if (rundownContainer && typeof DEFAULT_RUNDOWN !== 'undefined') {
        rundownContainer.innerHTML = '';
        DEFAULT_RUNDOWN.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'timeline-item';
            itemEl.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-time">${escapeHtml(item.jam)}</div>
                    <div class="timeline-agenda">${escapeHtml(item.agenda)}</div>
                    <span class="timeline-badge">${escapeHtml(item.badge)}</span>
                </div>
            `;
            rundownContainer.appendChild(itemEl);
        });
    }

    // Render Benefit Cards
    const benefitsContainer = document.getElementById('benefitsContainer');
    if (benefitsContainer && typeof DEFAULT_BENEFITS !== 'undefined') {
        benefitsContainer.innerHTML = '';
        
        const iconSvgs = {
            booth: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
            audience: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
            stage: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`,
            branding: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`,
            database: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>`,
            hospitality: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`
        };

        DEFAULT_BENEFITS.forEach(item => {
            const card = document.createElement('div');
            card.className = 'benefit-card';
            card.innerHTML = `
                <div class="benefit-icon-wrapper">
                    ${iconSvgs[item.icon] || iconSvgs.booth}
                </div>
                <h4 class="benefit-title">${escapeHtml(item.judul)}</h4>
                <p class="benefit-desc">${escapeHtml(item.deskripsi)}</p>
            `;
            benefitsContainer.appendChild(card);
        });
    }
}

// 7. Form RSVP Interaktif
function initRsvpForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccessCard = document.getElementById('rsvpSuccessCard');
    const rsvpSuccessDetails = document.getElementById('rsvpSuccessDetails');
    const resetRsvpBtn = document.getElementById('resetRsvpBtn');

    if (!rsvpForm) return;

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('rsvpNama').value.trim();
        const instansi = document.getElementById('rsvpInstansi').value.trim();
        const kategori = document.getElementById('rsvpKategori').value;
        const jumlahOrang = document.getElementById('rsvpJumlah').value;
        const catatan = document.getElementById('rsvpCatatan').value.trim();

        // Ambil status radio terpilih
        const selectedRadio = document.querySelector('input[name="kehadiran"]:checked');
        const status = selectedRadio ? selectedRadio.value : 'Hadir';

        if (!nama || !instansi) {
            showToast("Mohon lengkapi Nama dan Instansi Anda.", "error");
            return;
        }

        // Simpan data melalui DataStore
        const newRsvp = DataStore.saveRSVP({
            nama,
            instansi,
            kategori,
            status,
            jumlah_orang: jumlahOrang,
            catatan
        });

        // Tampilkan State Sukses
        rsvpForm.style.display = 'none';
        if (rsvpSuccessCard) {
            rsvpSuccessCard.classList.add('active');
            if (rsvpSuccessDetails) {
                rsvpSuccessDetails.innerHTML = `
                    <div style="background: rgba(7, 13, 30, 0.6); padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.3);">
                        <p style="color: var(--gold-300); font-size: 0.85rem; text-transform: uppercase;">Status Konfirmasi Kehadiran</p>
                        <h3 style="color: #ffffff; font-size: 1.4rem; margin: 6px 0;">${escapeHtml(instansi)}</h3>
                        <p style="color: var(--slate-300); font-size: 0.95rem;">Perwakilan: <strong>${escapeHtml(nama)}</strong> (${escapeHtml(kategori)})</p>
                        <div style="display: inline-block; margin-top: 10px; padding: 6px 18px; border-radius: 99px; font-weight: 700; ${status === 'Hadir' ? 'background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981;' : 'background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444;'}">
                            ${status === 'Hadir' ? '✓ Dikonfirmasi Hadir' : '✕ Tidak Dapat Hadir'}
                        </div>
                    </div>
                `;
            }
        }

        showToast("Konfirmasi kehadiran Anda berhasil dikirim!", "success");

        // Refresh feed ucapan
        initRsvpFeed();
    });

    if (resetRsvpBtn) {
        resetRsvpBtn.addEventListener('click', () => {
            rsvpForm.style.display = 'block';
            if (rsvpSuccessCard) rsvpSuccessCard.classList.remove('active');
        });
    }
}

// 8. Feed Daftar Konfirmasi RSVP Terbaru
function initRsvpFeed() {
    const feedContainer = document.getElementById('rsvpFeedList');
    if (!feedContainer || typeof DataStore === 'undefined') return;

    const rsvps = DataStore.getRSVPs();
    if (rsvps.length === 0) {
        feedContainer.innerHTML = `<p style="color: var(--slate-500); font-size: 0.88rem; text-align: center; padding: 10px;">Belum ada konfirmasi kehadiran.</p>`;
        return;
    }

    feedContainer.innerHTML = '';
    rsvps.slice(0, 10).forEach(r => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        const badgeClass = r.status === 'Hadir' ? 'badge-hadir' : 'badge-tidakhadir';
        item.innerHTML = `
            <div class="feed-item-header">
                <span class="feed-item-name">${escapeHtml(r.instansi || r.nama)}</span>
                <span class="feed-item-badge ${badgeClass}">${escapeHtml(r.status)}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--slate-400); margin-bottom: 4px;">
                ${escapeHtml(r.nama)} • ${escapeHtml(r.kategori)} • ${escapeHtml(r.waktu)}
            </div>
            ${r.catatan ? `<div class="feed-item-msg">"${escapeHtml(r.catatan)}"</div>` : ''}
        `;
        feedContainer.appendChild(item);
    });
}

// 9. Toast Notification Helper
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

// XSS Protection Helper
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
