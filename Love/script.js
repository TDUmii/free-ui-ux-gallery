/* ==========================================================================
   VALENTINE'S LOVE LETTER — INTERACTIVE LOGIC & PIXEL ART
   Khớp 100% video mẫu: Bắn cung, Mèo pixel 15x14, Né nút NO & Mưa trái tim
   ========================================================================== */

(function () {
  'use strict';

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = motionQuery.matches;
  let ambientHeartTimer = null;

  const updateMotionPreference = () => {
    reducedMotion = motionQuery.matches;
    if (reducedMotion) {
      clearInterval(ambientHeartTimer);
      ambientHeartTimer = null;
      if (typeof heartRainActive !== 'undefined') heartRainActive = false;
    } else if (ambientBg) {
      initAmbientHearts();
    }
    if (typeof drawPixelCat === 'function') drawPixelCat();
  };

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', updateMotionPreference);
  } else {
    motionQuery.addListener(updateMotionPreference);
  }

  // --- BỘ TỔNG HỢP ÂM THANH VUI NHỘN (Web Audio API Procedural) ---
  class SoundSynth {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }

    // Tiếng gảy đàn hạc pentatonic vui tai khi kéo dây cung
    playBowPull(ratio = 0.5) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
      const noteIdx = Math.min(notes.length - 1, Math.floor(ratio * notes.length));
      const freq = notes[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.1);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    }

    // Tiếng mũi tên vút bay vèo vui nhộn
    playBowRelease() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(1300, t + 0.14);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);

      // Lớp gió lướt
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, t);
      filter.frequency.exponentialRampToValueAtTime(2400, t + 0.08);
      filter.frequency.exponentialRampToValueAtTime(350, t + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    }

    // Chuỗi chuông thần tiên lấp lánh khi mũi tên trúng phong bì
    playHit() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const sparkleNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
      sparkleNotes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.035);

        gain.gain.setValueAtTime(0.13, t + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.035 + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + i * 0.035);
        osc.stop(t + i * 0.035 + 0.38);
      });
    }

    // Âm thanh hoạt hình vui nhộn khi nút NO né tránh
    playDodge() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const r = Math.random();

      if (r < 0.35) {
        // Lò xo hoạt hình "Boing~"
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(820, t + 0.07);
        osc.frequency.exponentialRampToValueAtTime(520, t + 0.16);

        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      } else if (r < 0.7) {
        // Bong bóng đôi "Bloop-pop!"
        [580, 960].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.045);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t + idx * 0.045 + 0.06);

          gain.gain.setValueAtTime(0.14, t + idx * 0.045);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.045 + 0.07);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.045);
          osc.stop(t + idx * 0.045 + 0.07);
        });
      } else {
        // Huýt sáo trêu đùa "Whoop!"
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(1250, t + 0.11);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.11);
      }
    }

    // Giai điệu chiến thắng & ăn mừng lãng mạn rộn ràng
    playCelebrate() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const melody = [
        { f: 392.00, d: 0.11, o: 0.00 }, // G4
        { f: 523.25, d: 0.11, o: 0.10 }, // C5
        { f: 659.25, d: 0.11, o: 0.20 }, // E5
        { f: 783.99, d: 0.18, o: 0.30 }, // G5
        { f: 659.25, d: 0.10, o: 0.48 }, // E5
        { f: 783.99, d: 0.26, o: 0.58 }, // G5
        { f: 880.00, d: 0.12, o: 0.86 }, // A5
        { f: 987.77, d: 0.14, o: 0.98 }, // B5
        { f: 1046.5, d: 0.65, o: 1.12 }  // C6
      ];

      melody.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t + note.o);

        gain.gain.setValueAtTime(0.18, t + note.o);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.o + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + note.o);
        osc.stop(t + note.o + note.d);
      });

      // Hợp âm đệm ngân nga ở nốt cuối (C5 + E5 + G5 + C6)
      [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 1.12);

        gain.gain.setValueAtTime(0.11, t + 1.12);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.12 + 0.75);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + 1.12);
        osc.stop(t + 1.12 + 0.75);
      });
    }

    // Tiếng kêu "Meo meo~" cực dễ thương của mèo con
    playPurr() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(430, t);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.11);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.3);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    }
  }

  const sound = new SoundSynth();

  // --- TỪ ĐIỂN ĐA NGÔN NGỮ (VIỆT & ANH) ---
  const I18N = {
    vi: {
      pageTitle: 'Thư Tình Valentine ❤️',
      navBrand: 'Thư Tình',
      soundOn: 'Âm thanh',
      soundOff: 'Đã tắt',
      replay: 'Chơi lại',
      langBtn: 'VI',
      milestone: 'Chúc mừng 1 tháng',
      instruction: 'Kéo và thả để bắn mũi tên tình yêu',
      shooting: 'Đang bắn mũi tên tình yêu! ❤️',
      windowTitle: 'TÌNH YÊU',
      question: 'Kỷ niệm 1 tháng bên nhau ♡ Vẫn<br>yêu anh chứ?',
      yes: 'CÓ ❤️',
      no: 'KHÔNG',
      noDodges: ['KHÔNG', 'Hông bé ơi 😜', 'Đố bắt được 💨', 'Còn lâu nhá 😋', 'Bấm CÓ đi nè 💕', 'Chịu thua chưa? 💖'],
      celebration: 'Yayyy! Yêu nhiều lắm luôn ♡',
      letterP1: 'Một tháng tân hôn, cả ',
      letterBadge: 'cuộc đời',
      letterP2: ' để đi cùng nhau. Chúc mừng ngày kỷ niệm, tình yêu của anh ❤️',
      restartBtn: '↺ Chơi lại lần nữa',
      footer: 'Được tạo với tất cả tình yêu 💖 Thư Tình Valentine'
    },
    en: {
      pageTitle: "Valentine's Love Letter ❤️",
      navBrand: 'Love Letter',
      soundOn: 'Sound',
      soundOff: 'Muted',
      replay: 'Reset',
      langBtn: 'EN',
      milestone: 'Happy 1 Month',
      instruction: "Aim and release to shoot Cupid's arrow",
      shooting: "Shooting Cupid's Arrow! ❤️",
      windowTitle: 'LOVE',
      question: 'Happy 1 month, my love ♡ Still<br>love me?',
      yes: 'YES',
      no: 'NO',
      noDodges: ['NO', 'No way 😜', 'Too fast 💨', 'Try again 😋', 'Click YES 💕', 'Give up? 💖'],
      celebration: 'Yayyy! I love you ♡',
      letterP1: 'One month of marriage, a ',
      letterBadge: 'lifetime',
      letterP2: ' to go. Happy anniversary, my love ❤️',
      restartBtn: '↺ Once More',
      footer: 'Made with love 💖 Valentine Letter'
    }
  };

  // Mặc định là Tiếng Việt
  let currentLang = 'vi';

  // --- PHẦN TỬ DOM ---
  const stageBow = document.getElementById('stageBow');
  const stageLoveWindow = document.getElementById('stageLoveWindow');
  const envelope = document.getElementById('envelope');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const heartSeal = document.getElementById('heartSeal');
  const cupidArrow = document.getElementById('cupidArrow');
  const bowStringPath = document.getElementById('bowStringPath');
  const aimHandle = document.getElementById('aimHandle');
  const instructionText = document.getElementById('instructionText');
  const ambientBg = document.getElementById('ambientBg');
  const celebrationCanvas = document.getElementById('celebrationCanvas');
  const catCanvas = document.getElementById('catCanvas');
  const catWrapper = document.getElementById('catWrapper');
  const windowBody = document.getElementById('windowBody');
  const loveQuestion = document.getElementById('loveQuestion');
  const buttonsArea = document.getElementById('buttonsArea');
  const yesDashedWrapper = document.getElementById('yesDashedWrapper');
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const letterBox = document.getElementById('letterBox');
  const letterText = document.getElementById('letterText');
  const btnRestart = document.getElementById('btnRestart');
  const btnSound = document.getElementById('btnSound');
  const soundIcon = document.getElementById('soundIcon');
  const soundText = document.getElementById('soundText');
  const btnReplay = document.getElementById('btnReplay');
  const btnLang = document.getElementById('btnLang');
  const langFlag = document.getElementById('langFlag');
  const langText = document.getElementById('langText');
  const navTitleText = document.getElementById('navTitleText');
  const replayText = document.getElementById('replayText');
  const milestoneTitle = document.getElementById('milestoneTitle');
  const windowTitleText = document.getElementById('windowTitleText');
  const footerText = document.getElementById('footerText');

  // --- BIẾN TRẠNG THÁI ---
  let isDragging = false;
  let dragStartY = 0;
  let pullDistance = 0;
  const MAX_PULL = 45;
  let isArrowFired = false;
  let yesScale = 1.0;
  let dodgeCount = 0;
  let catState = 'idle'; // 'idle' | 'happy'
  let heartRainActive = false;
  let heartRainParticles = [];

  // --- HÀM CHUYỂN ĐỔI NGÔN NGỮ ---
  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.classList.remove('lang-vi', 'lang-en');
    document.body.classList.add(`lang-${lang}`);

    const t = I18N[lang];
    document.title = t.pageTitle;
    if (navTitleText) navTitleText.textContent = t.navBrand;
    if (langFlag) langFlag.textContent = '🌐';
    if (langText) langText.textContent = t.langBtn;
    if (btnLang) btnLang.title = lang === 'vi' ? 'Đổi sang Tiếng Anh (L) / Switch to English' : 'Switch to Vietnamese (L) / Đổi sang Tiếng Việt';
    if (soundText) soundText.textContent = sound.isMuted ? t.soundOff : t.soundOn;
    if (replayText) replayText.textContent = t.replay;
    if (milestoneTitle) milestoneTitle.textContent = t.milestone;

    if (instructionText) {
      if (!isArrowFired) {
        instructionText.innerHTML = `${t.instruction} <span class="pixel-heart">❤️</span>`;
      } else {
        instructionText.textContent = t.shooting;
      }
    }

    if (windowTitleText) windowTitleText.textContent = t.windowTitle;

    if (loveQuestion) {
      if (catState === 'happy') {
        loveQuestion.textContent = t.celebration;
      } else {
        loveQuestion.innerHTML = t.question;
      }
    }

    if (yesBtn) yesBtn.textContent = t.yes;
    if (noBtn) {
      if (dodgeCount > 0) {
        const dodges = t.noDodges;
        const dodgeIdx = Math.min(dodgeCount - 1, dodges.length - 1);
        noBtn.textContent = dodges[dodgeIdx % dodges.length];
      } else {
        noBtn.textContent = t.no;
      }
    }
    if (btnRestart) btnRestart.textContent = t.restartBtn;
    if (footerText) footerText.innerHTML = t.footer;

    if (letterBox && letterBox.style.display === 'block') {
      letterText.innerHTML = `${t.letterP1}<span class="badge-blue">${t.letterBadge}</span>${t.letterP2}`;
    }

    try {
      localStorage.setItem('love_letter_lang', lang);
    } catch (_) {}
  }

  // --- TRÁI TIM NỀN TRÔI LƠ LỬNG ---
  function initAmbientHearts() {
    ambientBg.innerHTML = '';
    clearInterval(ambientHeartTimer);
    ambientHeartTimer = null;
    if (reducedMotion) return;
    const heartSymbols = ['❤️', '💖', '💕', '🌸', '✨'];
    
    function spawnDrifter() {
      if (document.hidden) return;
      const el = document.createElement('span');
      el.className = 'ambient-heart';
      el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      el.style.left = Math.random() * 92 + 4 + '%';
      el.style.fontSize = (Math.random() * 16 + 12) + 'px';
      el.style.animationDuration = (Math.random() * 5 + 5) + 's';
      ambientBg.appendChild(el);

      el.addEventListener('animationend', () => {
        el.remove();
      });
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(spawnDrifter, i * 500);
    }
    ambientHeartTimer = setInterval(spawnDrifter, 1200);
  }

  // --- CƠ CHẾ KÉO VÀ BẮN CUNG CUPID (Cung cong hướng lên phong bì) ---
  function updateBowVisual(pullY) {
    // Dây cung căng xuống dưới từ tọa độ gốc y=65
    const stringY = 65 + pullY;
    bowStringPath.setAttribute('d', `M 30 65 Q 120 ${stringY} 210 65`);
    aimHandle.setAttribute('aria-valuenow', String(Math.round(pullY)));

    // Mũi tên tụt xuống cùng dây cung
    cupidArrow.style.transform = `translateY(${pullY}px)`;
  }

  function fireArrow() {
    if (isArrowFired) return;
    isArrowFired = true;

    sound.playBowRelease();

    // Dây cung bật thẳng lại vị trí nghỉ
    bowStringPath.setAttribute('d', 'M 30 65 Q 120 65 210 65');
    aimHandle.style.display = 'none';
    instructionText.textContent = I18N[currentLang].shooting;

    // Tính khoảng cách từ đầu mũi tên lên dấu sáp trái tim
    const arrowRect = cupidArrow.getBoundingClientRect();
    const sealRect = heartSeal.getBoundingClientRect();
    const flightDistance = arrowRect.top - sealRect.top + 10;

    // Mũi tên lao vút lên trên hướng về phong bì
    cupidArrow.style.transition = reducedMotion ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.8, 0.4, 1)';
    cupidArrow.style.transform = `translateY(-${flightDistance}px)`;

    setTimeout(() => {
      // Âm thanh và hiệu ứng trúng đích
      sound.playHit();
      envelope.style.animation = reducedMotion ? 'none' : 'hopHeart 0.3s ease';
      heartSeal.style.transform = 'scale(1.35)';

      // Chùm tia sáng trái tim bùng nổ từ dấu sáp
      createImpactBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2);

      // Mở nắp phong bì
      setTimeout(() => {
        envelope.classList.add('opened');
      }, reducedMotion ? 0 : 150);

      // Chuyển sang Cảnh 2: Cửa sổ LOVE
      setTimeout(() => {
        transitionToLoveWindow();
      }, reducedMotion ? 0 : 550);

    }, reducedMotion ? 0 : 320);
  }

  function createImpactBurst(x, y) {
    if (reducedMotion) return;
    const symbols = ['❤️', '✨', '💖', '⭐'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.position = 'fixed';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.fontSize = '18px';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '100';
      p.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)';
      document.body.appendChild(p);

      const angle = (Math.PI * 2 * i) / 12;
      const dist = Math.random() * 55 + 35;
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.2)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 650);
    }
  }

  // Sự kiện kéo thả chuột và cảm ứng trên trạm bắn cung
  aimHandle.addEventListener('pointerdown', (e) => {
    sound.init();
    if (isArrowFired) return;
    isDragging = true;
    dragStartY = e.clientY;
    aimHandle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  aimHandle.addEventListener('keydown', (e) => {
    if (isArrowFired) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      pullDistance = Math.min(MAX_PULL, pullDistance + 5);
      updateBowVisual(pullDistance);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      pullDistance = Math.max(0, pullDistance - 5);
      updateBowVisual(pullDistance);
    } else if (e.key === 'Home') {
      e.preventDefault();
      pullDistance = 0;
      updateBowVisual(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      pullDistance = MAX_PULL;
      updateBowVisual(MAX_PULL);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fireArrow();
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging || isArrowFired) return;
    const deltaY = e.clientY - dragStartY;
    pullDistance = Math.max(0, Math.min(MAX_PULL, deltaY));
    updateBowVisual(pullDistance);

    if (pullDistance > 8 && pullDistance % 12 < 3) {
      sound.playBowPull(pullDistance / MAX_PULL);
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (pullDistance >= 18) {
      fireArrow();
    } else {
      pullDistance = 0;
      updateBowVisual(0);
    }
  });

  window.addEventListener('pointercancel', () => {
    if (!isDragging) return;
    isDragging = false;
    pullDistance = 0;
    updateBowVisual(0);
  });

  // Chạm/nhấp trực tiếp vào phong bì hoặc tay cầm để bắn nhanh
  envelopeContainer.addEventListener('click', () => {
    if (!isArrowFired) fireArrow();
  });
  aimHandle.addEventListener('click', () => {
    if (!isArrowFired && pullDistance < 8) fireArrow();
  });

  // --- CHUYỂN SANG CẢNH 2 (CỬA SỔ RETRO LOVE) ---
  function transitionToLoveWindow() {
    stageBow.classList.remove('active');
    stageLoveWindow.classList.add('active');
    stageLoveWindow.style.display = 'flex';

    yesScale = 1.0;
    dodgeCount = 0;
    yesDashedWrapper.style.transform = 'scale(1)';
    noBtn.style.position = 'static';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.display = 'inline-flex';
    noBtn.textContent = I18N[currentLang].no;
    loveQuestion.innerHTML = I18N[currentLang].question;
    yesBtn.textContent = I18N[currentLang].yes;
    buttonsArea.style.display = 'flex';
    letterBox.style.display = 'none';
    letterText.innerHTML = '';
    catState = 'idle';
  }

  // --- VẼ MÈO PIXEL ÔM TIM CHUẨN 100% VIDEO (15x14 MATRIX) ---
  const catCtx = catCanvas.getContext('2d');

  const C_BLACK = '#1a1824';
  const C_WHITE = '#ffffff';
  const C_PUPIL = '#110f17';
  const C_PINK = '#ff9ebb';
  const C_NOSE = '#f06292';
  const C_HEART = '#e23b4e';
  const C_HEART_LIGHT = '#ff6077';

  // 15 cột x 14 dòng chuẩn xác theo cat_clean_2.png
  const catGrid = [
    [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [1,1,1,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,1,1,1,1,1,1,1,2,2,2,2],
    [2,3,3,2,1,1,1,1,1,1,1,2,3,3,2],
    [2,3,3,2,1,1,1,1,1,1,1,2,3,3,2],
    [4,4,1,1,1,1,1,5,1,1,1,1,1,4,4],
    [4,4,1,1,1,1,1,5,1,1,1,1,1,4,4],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,6,6,6,6,6,1,1,1,1,1],
    [1,1,1,1,6,6,6,6,6,6,6,1,1,1,1],
    [1,1,1,1,6,6,6,6,6,6,6,1,1,1,1],
    [1,1,1,1,1,6,6,6,6,6,1,1,1,1,1]
  ];

  let blinkTimer = 0;
  let isBlinking = false;
  let heartBeatPhase = 0;

  function drawPixelCat() {
    catCtx.clearRect(0, 0, catCanvas.width, catCanvas.height);

    const pixelSize = 9;
    const startX = Math.round((catCanvas.width - 15 * pixelSize) / 2);
    const startY = Math.round((catCanvas.height - 14 * pixelSize) / 2);

    blinkTimer++;
    if (blinkTimer > 180 && !isBlinking) {
      isBlinking = true;
      setTimeout(() => {
        isBlinking = false;
        blinkTimer = 0;
      }, 140);
    }

    if (!reducedMotion) heartBeatPhase += 0.08;
    const heartScale = catState === 'happy' ? 1.0 + Math.sin(heartBeatPhase * 2) * 0.15 : 1.0 + Math.sin(heartBeatPhase) * 0.08;

    for (let r = 0; r < catGrid.length; r++) {
      for (let c = 0; c < catGrid[r].length; c++) {
        const val = catGrid[r][c];
        if (val === 0) continue;

        let fill = C_BLACK;
        if (val === 4) fill = C_PINK;
        else if (val === 5) fill = C_NOSE;
        else if (val === 2) {
          fill = (isBlinking || catState === 'happy') ? C_BLACK : C_WHITE;
        } else if (val === 3) {
          fill = (isBlinking || catState === 'happy') ? C_BLACK : C_PUPIL;
        } else if (val === 6) {
          // Trái tim sẽ vẽ riêng để tạo nhịp đập
          continue;
        }

        catCtx.fillStyle = fill;
        catCtx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
      }
    }

    // Mắt cười tít ^ ^ và trái tim nhỏ trên trán khi bấm YES (cat_happy.png)
    if (catState === 'happy') {
      catCtx.strokeStyle = '#ffffff';
      catCtx.lineWidth = 3;
      catCtx.beginPath();
      // Mắt trái
      catCtx.moveTo(startX + 1 * pixelSize, startY + 6 * pixelSize);
      catCtx.lineTo(startX + 2 * pixelSize, startY + 4.5 * pixelSize);
      catCtx.lineTo(startX + 3.5 * pixelSize, startY + 6 * pixelSize);
      // Mắt phải
      catCtx.moveTo(startX + 11.5 * pixelSize, startY + 6 * pixelSize);
      catCtx.lineTo(startX + 13 * pixelSize, startY + 4.5 * pixelSize);
      catCtx.lineTo(startX + 14 * pixelSize, startY + 6 * pixelSize);
      catCtx.stroke();

      // Trái tim nhỏ trên trán (khớp cat_happy.png)
      catCtx.fillStyle = '#ff3366';
      catCtx.fillRect(startX + 6 * pixelSize, startY + 1 * pixelSize, 3 * pixelSize, 2.5 * pixelSize);
    }

    // Vẽ trái tim đỏ đập phập phồng trước ngực
    catCtx.save();
    const hCenterX = startX + 7.5 * pixelSize;
    const hCenterY = startY + 12 * pixelSize;
    catCtx.translate(hCenterX, hCenterY);
    catCtx.scale(heartScale, heartScale);
    catCtx.translate(-hCenterX, -hCenterY);

    for (let r = 9; r <= 13; r++) {
      for (let c = 4; c <= 10; c++) {
        if (catGrid[r] && catGrid[r][c] === 6) {
          catCtx.fillStyle = (r === 10 && c === 5) ? C_HEART_LIGHT : C_HEART;
          catCtx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    catCtx.restore();

    if (!reducedMotion) requestAnimationFrame(drawPixelCat);
  }

  if (reducedMotion) drawPixelCat();
  else requestAnimationFrame(drawPixelCat);

  // --- CƠ CHẾ NÉ TRÁNH NÚT "NO" (BAY XUNG QUANH, KHÔNG MẤT ĐI, KHÔNG CHE CHỮ) ---
  let lastDodgeTime = 0;

  function dodgeNoButton() {
    const now = Date.now();
    if (now - lastDodgeTime < 130) return;
    lastDodgeTime = now;

    dodgeCount++;
    sound.playDodge();

    // Rung chú mèo biểu cảm nhẹ
    catCanvas.style.transform = 'scale(1.08)';
    setTimeout(() => {
      catCanvas.style.transform = 'scale(1)';
    }, 150);

    // Kích thước của window-body và nút
    const bodyW = windowBody.clientWidth;
    const bodyH = windowBody.clientHeight;
    const btnW = noBtn.offsetWidth || 76;
    const btnH = noBtn.offsetHeight || 44;

    // GIỚI HẠN AN TOÀN TUYỆT ĐỐI:
    // 1. Phía trên: BẮT BUỘC nằm dưới dòng chữ tình yêu (loveQuestion) để TUYỆT ĐỐI KHÔNG CHE CHỮ
    const questionRect = loveQuestion.getBoundingClientRect();
    const bodyRect = windowBody.getBoundingClientRect();
    const questionBottom = Math.max(76, (questionRect.bottom - bodyRect.top) + 12);
    const minY = Math.round(questionBottom);

    // 2. Phía dưới: Không vượt quá đáy cửa sổ (lề an toàn 14px)
    const maxY = Math.round(bodyH - btnH - 14);

    // 3. Hai bên: Giữ lề an toàn 14px để luôn nhìn thấy rõ và không bị khuất mép
    const minX = 14;
    const maxX = Math.round(bodyW - btnW - 14);

    // Các vị trí bay xung quanh cửa sổ (hai bên cánh chú mèo, tầng lửng, và các góc)
    const candidateSpots = [
      // Bên trái chú mèo (tầng giữa)
      { x: minX, y: Math.min(maxY, Math.max(minY, Math.round(bodyH * 0.38))) },
      // Bên phải chú mèo (tầng giữa)
      { x: maxX, y: Math.min(maxY, Math.max(minY, Math.round(bodyH * 0.38))) },
      // Bên trái chú mèo (tầng dưới)
      { x: minX, y: Math.min(maxY, Math.max(minY, Math.round(bodyH * 0.60))) },
      // Bên phải chú mèo (tầng dưới)
      { x: maxX, y: Math.min(maxY, Math.max(minY, Math.round(bodyH * 0.60))) },
      // Góc dưới bên trái
      { x: minX + 4, y: maxY },
      // Góc dưới bên phải
      { x: maxX - 4, y: maxY },
      // Dưới dòng chữ, chếch sang tai trái chú mèo
      { x: minX + 10, y: minY + 6 },
      // Dưới dòng chữ, chếch sang tai phải chú mèo
      { x: maxX - 10, y: minY + 6 }
    ];

    // Lấy vị trí hiện tại của noBtn trong windowBody
    const currentBtnRect = noBtn.getBoundingClientRect();
    const curX = currentBtnRect.left - bodyRect.left;
    const curY = currentBtnRect.top - bodyRect.top;

    // Lọc các điểm ở xa vị trí hiện tại (> 80px) để nút bay rõ rệt sang góc khác
    const farSpots = candidateSpots.filter(spot => {
      return Math.hypot(spot.x - curX, spot.y - curY) > 80;
    });

    const targetSpot = (farSpots.length > 0)
      ? farSpots[Math.floor(Math.random() * farSpots.length)]
      : candidateSpots[Math.floor(Math.random() * candidateSpots.length)];

    // Giữ nguyên nút hiển thị, không ẩn đi, chỉ thay đổi tọa độ
    noBtn.style.display = 'inline-flex';
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${Math.round(targetSpot.x)}px`;
    noBtn.style.top = `${Math.round(targetSpot.y)}px`;
    noBtn.style.zIndex = '35';

    // Đổi chữ trêu đùa theo ngôn ngữ đang chọn
    const dodges = I18N[currentLang].noDodges;
    const dodgeIdx = Math.min(dodgeCount - 1, dodges.length - 1);
    noBtn.textContent = dodges[dodgeIdx % dodges.length];

    // Nút YES to thêm +8% mỗi lần né
    yesScale += 0.08;
    yesDashedWrapper.style.transform = `scale(${yesScale})`;
  }

  // Chặn tuyệt đối hành vi click/tap vào nút NO và né tránh tức thì
  ['mouseenter', 'mouseover', 'pointerenter', 'pointerover'].forEach(evt => {
    noBtn.addEventListener(evt, (e) => {
      dodgeNoButton();
    });
  });

  ['mousedown', 'pointerdown', 'touchstart', 'click'].forEach(evt => {
    noBtn.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dodgeNoButton();
      return false;
    }, { passive: false });
  });

  // Tự động né trước khi con trỏ hoặc ngón tay đến gần trong phạm vi 45px
  windowBody.addEventListener('pointermove', (e) => {
    if (buttonsArea.style.display === 'none' || noBtn.style.display === 'none') return;
    const btnRect = noBtn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < 45) {
      dodgeNoButton();
    }
  });

  // --- BẤM NÚT "YES": ĂN MỪNG & MƯA TRÁI TIM ---
  yesBtn.addEventListener('click', () => {
    sound.playCelebrate();
    sound.playPurr();

    loveQuestion.textContent = I18N[currentLang].celebration;
    loveQuestion.style.color = '#e23b4e';

    catState = 'happy';
    catWrapper.classList.add('happy');
    if (reducedMotion) drawPixelCat();

    buttonsArea.style.display = 'none';
    noBtn.style.display = 'none';

    startHeartRain();

    letterBox.style.display = 'block';
    startTypewriterLetter();
  });

  // Hiệu ứng máy đánh chữ (Typewriter)
  function startTypewriterLetter() {
    letterText.innerHTML = '';

    const langData = I18N[currentLang];
    const p1 = langData.letterP1;
    const p2Word = langData.letterBadge;
    const p3 = langData.letterP2;

    let currentText = '';
    let i = 0;

    function typePart1() {
      if (i < p1.length) {
        currentText += p1[i];
        letterText.innerHTML = currentText;
        i++;
        setTimeout(typePart1, 38);
      } else {
        currentText += `<span class="badge-blue">${p2Word}</span>`;
        letterText.innerHTML = currentText;
        sound.playHit();
        i = 0;
        setTimeout(typePart3, 250);
      }
    }

    function typePart3() {
      if (i < p3.length) {
        currentText += p3[i];
        letterText.innerHTML = currentText;
        i++;
        setTimeout(typePart3, 40);
      }
    }

    typePart1();
  }

  // --- MƯA TRÁI TIM TOÀN MÀN HÌNH ---
  function resizeCelebrationCanvas() {
    celebrationCanvas.width = window.innerWidth;
    celebrationCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCelebrationCanvas);

  function startHeartRain() {
    heartRainActive = true;
    resizeCelebrationCanvas();
    heartRainParticles = [];

    const colors = ['#e23b4e', '#ff6b8b', '#ff9ebb', '#ffd15e', '#b388ff', '#5ea8ff', '#ff80ab'];
    for (let i = 0; i < 60; i++) {
      heartRainParticles.push({
        x: Math.random() * celebrationCanvas.width,
        y: -Math.random() * celebrationCanvas.height * 0.7 - 20,
        size: Math.random() * 14 + 10,
        speedY: Math.random() * 2.8 + 2.2,
        speedX: (Math.random() - 0.5) * 1.6,
        rotation: Math.random() * 0.4 - 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.65
      });
    }

    requestAnimationFrame(renderHeartRain);
  }

  function renderHeartRain() {
    if (!heartRainActive) return;
    const ctx = celebrationCanvas.getContext('2d');
    ctx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

    for (let i = 0; i < heartRainParticles.length; i++) {
      const p = heartRainParticles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) * p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > celebrationCanvas.height + 25) {
        p.y = -25;
        p.x = Math.random() * celebrationCanvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      const s = p.size / 2;
      ctx.beginPath();
      // Điểm nhọn ở dưới (0, s * 0.9)
      ctx.moveTo(0, s * 0.9);
      // Tai trái ở trên
      ctx.bezierCurveTo(-s * 1.3, s * 0.2, -s * 1.3, -s * 0.8, 0, -s * 0.35);
      // Tai phải ở trên
      ctx.bezierCurveTo(s * 1.3, -s * 0.8, s * 1.3, s * 0.2, 0, s * 0.9);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderHeartRain);
  }

  // --- CÀI ĐẶT LẠI VÀ CHƠI LẠI (RESET) ---
  function resetAll() {
    isArrowFired = false;
    isDragging = false;
    pullDistance = 0;
    heartRainActive = false;

    const ctx = celebrationCanvas.getContext('2d');
    ctx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

    updateBowVisual(0);
    cupidArrow.style.transition = 'none';
    cupidArrow.style.transform = 'translateY(0)';
    aimHandle.style.display = 'grid';

    envelope.classList.remove('opened');
    heartSeal.style.transform = 'scale(1)';

    stageLoveWindow.classList.remove('active');
    stageLoveWindow.style.display = 'none';
    stageBow.classList.add('active');

    catState = 'idle';
    catWrapper.classList.remove('happy');
    loveQuestion.style.color = '#3b2b30';

    yesScale = 1.0;
    dodgeCount = 0;
    buttonsArea.style.display = 'flex';
    yesDashedWrapper.style.transform = 'scale(1)';
    noBtn.style.position = 'static';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.display = 'inline-flex';
    letterBox.style.display = 'none';
    letterText.innerHTML = '';

    if (reducedMotion) drawPixelCat();

    setLanguage(currentLang);
  }

  btnRestart.addEventListener('click', resetAll);
  btnReplay.addEventListener('click', resetAll);

  // Bật / tắt âm thanh
  btnSound.addEventListener('click', () => {
    const isMuted = sound.toggleMute();
    if (isMuted) {
      soundIcon.textContent = '🔇';
      soundText.textContent = I18N[currentLang].soundOff;
    } else {
      soundIcon.textContent = '🔊';
      soundText.textContent = I18N[currentLang].soundOn;
      sound.playPurr();
    }
  });

  // Nút chuyển đổi ngôn ngữ Việt / Anh
  if (btnLang) {
    btnLang.addEventListener('click', () => {
      sound.playPurr();
      const nextLang = currentLang === 'vi' ? 'en' : 'vi';
      setLanguage(nextLang);
    });
  }

  // Phím tắt bàn phím
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      btnSound.click();
    } else if (e.key === 'r' || e.key === 'R') {
      resetAll();
    } else if (e.key === 'l' || e.key === 'L') {
      if (btnLang) btnLang.click();
    } else if (e.key === ' ' && !isArrowFired && stageBow.classList.contains('active')) {
      e.preventDefault();
      fireArrow();
    }
  });

  // Khởi chạy ban đầu
  initAmbientHearts();
  resizeCelebrationCanvas();

  let savedLang = 'vi';
  try {
    savedLang = localStorage.getItem('love_letter_lang') || 'vi';
  } catch (_) {}
  setLanguage(savedLang === 'en' ? 'en' : 'vi');

})();
