/**
 * Will You Go Out With Me? - Valentine Date Planner
 * Pure Vanilla JavaScript (No Frameworks, No External Dependencies)
 *
 * Features:
 * - 5-Step Instagram/TikTok Story Progression
 * - Evasive "No" Button with Safe Clamped Bounds & Fun Lines (Never covers text)
 * - Confetti Animation Engine
 * - Web Audio API Sound Synthesizer + Background Music
 * - Dynamic Date & Time Calculation
 * - Live Countdown Timer
 * - RFC-5545 .ics Calendar Generator & Google Calendar Sync
 * - Bilingual Support (English & Vietnamese)
 */

(function () {
  'use strict';

  // =========================================================================
  // BILINGUAL DICTIONARY (VI / EN)
  // =========================================================================
  let currentLang = 'vi'; // Default to Vietnamese per user preference

  const I18N = {
    en: {
      brand_title: "DATE PLANNER",
      lang_label: "VI",
      music_label: "Music",
      btn_back: "back",
      s1_title: "Will you go out with me?",
      s1_subtitle: "There is only one right answer.",
      btn_yes: "Yes!",
      btn_no: "No",
      s2_title: "Yay! When are you free?",
      opt_today: "Today",
      opt_tomorrow: "Tomorrow",
      opt_surprise: "Surprise me",
      opt_surprise_sub: "you choose",
      and_around: "and around...",
      time_morning: "Morning",
      time_afternoon: "Afternoon",
      time_evening: "Evening",
      time_night: "Late night",
      s3_title: "And where are we going?",
      act_coffee: "Coffee",
      act_coffee_sub: "the good little place",
      act_dinner: "Dinner",
      act_dinner_sub: "somewhere with candles",
      act_movie: "Movie night",
      act_movie_sub: "you pick, I'll allow it",
      act_walk: "A long walk",
      act_walk_sub: "until it gets cold",
      s4_title: "And then?",
      aft_dessert: "Dessert",
      aft_dessert_sub: "obviously",
      aft_stargazing: "Stargazing",
      aft_stargazing_sub: "if it stays clear",
      aft_drive: "A drive",
      aft_drive_sub: "windows down",
      aft_home: "Not going home",
      aft_home_sub: "not yet, anyway",
      s5_title: "It's a date!",
      date_pass: "DATE PASS",
      lbl_when: "WHEN",
      lbl_time: "TIME",
      lbl_where: "WHERE",
      lbl_bring: "BRING",
      lbl_then: "THEN",
      val_flowers: "Flowers 💐",
      starts_in: "STARTS IN",
      add_calendar: "Add to calendar",
      btn_share: "Share",
      adding_to_cal: "ADDING TO YOUR CALENDAR",
      modal_its_in: "It's in.",
      modal_counting: "I'll be counting down with you.",
      btn_see_you: "See you there 💖",
      saved_toast: "Saved - see you then 💖",
      copied_toast: "Date details copied to clipboard!",
      no_lines: [
        "No",
        "Think again...",
        "Are you sure?",
        "Really?",
        "Wrong button!",
        "Nice try ;)",
        "Still no?",
        "Not an option!",
        "Press Yes instead!"
      ],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      full_months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    vi: {
      brand_title: "LÊN KÈO HẸN HÒ",
      lang_label: "EN",
      music_label: "Nhạc",
      btn_back: "quay lại",
      s1_title: "Đi chơi với tớ nha?",
      s1_subtitle: "Chỉ có một câu trả lời đúng thôi nhé.",
      btn_yes: "Đồng ý!",
      btn_no: "Không",
      s2_title: "Yay! Cậu rảnh lúc nào nè?",
      opt_today: "Hôm nay",
      opt_tomorrow: "Ngày mai",
      opt_surprise: "Bất ngờ",
      opt_surprise_sub: "tuỳ cậu chọn",
      and_around: "vào khoảng tầm...",
      time_morning: "Buổi sáng",
      time_afternoon: "Buổi chiều",
      time_evening: "Buổi tối",
      time_night: "Đêm muộn",
      s3_title: "Tụi mình sẽ đi đâu?",
      act_coffee: "Cà phê",
      act_coffee_sub: "quán quen ấm cúng",
      act_dinner: "Ăn tối",
      act_dinner_sub: "nơi có ánh nến lung linh",
      act_movie: "Xem phim",
      act_movie_sub: "cậu chọn phim gì cũng được",
      act_walk: "Dạo phố",
      act_walk_sub: "cho tới khi se se lạnh",
      s4_title: "Sau đó thì sao?",
      aft_dessert: "Ăn đồ ngọt",
      aft_dessert_sub: "tất nhiên là phải có",
      aft_stargazing: "Ngắm sao đêm",
      aft_stargazing_sub: "nếu trời trong lành",
      aft_drive: "Vi vu hóng gió",
      aft_drive_sub: "hạ kính xe đón gió",
      aft_home: "Chưa về đâu",
      aft_home_sub: "vẫn còn sớm mà",
      s5_title: "Chốt kèo hẹn hò!",
      date_pass: "VÉ HẸN HÒ",
      lbl_when: "NGÀY",
      lbl_time: "GIỜ",
      lbl_where: "ĐỊA ĐIỂM",
      lbl_bring: "MANG THEO",
      lbl_then: "TIẾP THEO",
      val_flowers: "Hoa tươi 💐",
      starts_in: "BẮT ĐẦU TRONG",
      add_calendar: "Lưu vào lịch",
      btn_share: "Chia sẻ",
      adding_to_cal: "ĐANG LƯU VÀO LỊCH",
      modal_its_in: "Đã chốt kèo.",
      modal_counting: "Tớ sẽ đếm ngược từng giây chờ đến hẹn.",
      btn_see_you: "Hẹn gặp cậu nhé 💖",
      saved_toast: "Đã lưu - hẹn gặp cậu nhé 💖",
      copied_toast: "Đã sao chép chi tiết buổi hẹn!",
      no_lines: [
        "Không",
        "Nghĩ kĩ lại đi...",
        "Chắc chưa?",
        "Thật sao?",
        "Bấm nhầm nút rồi!",
        "Làm gì có cửa ;)",
        "Vẫn không à?",
        "Không có lựa chọn này!",
        "Bấm Đồng ý đi mà!"
      ],
      days: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
      months: ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"],
      full_months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    }
  };

  // =========================================================================
  // APP STATE
  // =========================================================================
  let currentStep = 1;
  let dodgeCount = 0;
  let targetDate = new Date();
  let countdownInterval = null;
  let audioMuted = true;

  const userChoices = {
    dayIndex: 2, // Default to Day 2 (e.g. Upcoming Saturday/Weekend)
    dayDate: null,
    dayText: '',
    timeKey: 'evening',
    timeText: '',
    timeFormatted: '19:00',
    activityKey: 'coffee',
    activityText: '',
    afterKey: 'stargazing',
    afterText: ''
  };

  // Calculated Days
  const calculatedDays = [];

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const storyCard = document.getElementById('storyCard');
  const step1 = document.getElementById('step1');
  const btnBack = document.getElementById('btnBack');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const buttonArena = document.getElementById('buttonArena');
  const yaasOverlay = document.getElementById('yaasOverlay');
  const langToggle = document.getElementById('langToggle');
  const langText = document.getElementById('langText');
  const soundToggle = document.getElementById('soundToggle');
  const bgAudio = document.getElementById('bgAudio');
  const heartsContainer = document.getElementById('heartsContainer');

  const stepViews = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4'),
    document.getElementById('step5')
  ];

  const barFills = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3'),
    document.getElementById('bar4'),
    document.getElementById('bar5')
  ];

  // Ticket elements
  const ticketWhen = document.getElementById('ticketWhen');
  const ticketTime = document.getElementById('ticketTime');
  const ticketWhere = document.getElementById('ticketWhere');
  const ticketBring = document.getElementById('ticketBring');
  const ticketThen = document.getElementById('ticketThen');
  const ticketStamp = document.getElementById('ticketStamp');
  const countdownTimer = document.getElementById('countdownTimer');
  const btnAddToCalendar = document.getElementById('btnAddToCalendar');
  const btnCalText = document.getElementById('btnCalText');
  const btnShare = document.getElementById('btnShare');
  const calModal = document.getElementById('calModal');
  const btnConfirmDate = document.getElementById('btnConfirmDate');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');
  const btnGoogleCal = document.getElementById('btnGoogleCal');
  const modalMonth = document.getElementById('modalMonth');
  const modalDateSummary = document.getElementById('modalDateSummary');
  const calendarPreviewGrid = document.getElementById('calendarPreviewGrid');
  const toastPill = document.getElementById('toastPill');
  const toastMsg = document.getElementById('toastMsg');

  // =========================================================================
  // WEB AUDIO API SYNTHESIZER (ZERO-LATENCY SOUND FX)
  // =========================================================================
  let audioCtx = null;

  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPopSound(pitch = 600, duration = 0.08) {
    if (audioMuted) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, audioCtx.currentTime + duration);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playWhooshSound() {
    if (audioMuted) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playJoyfulChime() {
    if (audioMuted) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  function playStampThud() {
    if (audioMuted) return;
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  // =========================================================================
  // BACKGROUND HEARTS GENERATOR
  // =========================================================================
  function spawnFloatingHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.3 ? '💖' : (Math.random() > 0.5 ? '🌸' : '💕');
    heart.style.left = `${Math.random() * 100}%`;
    const size = Math.random() * 16 + 14;
    heart.style.fontSize = `${size}px`;
    const duration = Math.random() * 5 + 6;
    heart.style.animationDuration = `${duration}s`;
    heart.style.opacity = (Math.random() * 0.4 + 0.3).toString();

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  setInterval(spawnFloatingHeart, 900);

  // =========================================================================
  // CANVAS CONFETTI EFFECT
  // =========================================================================
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff3366', '#ff7a9e', '#ffd166', '#06d6a0', '#118ab2', '#ffffff', '#ff4d79'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16 - 4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        isHeart: Math.random() > 0.6,
        alpha: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function renderConfetti() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravity
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - elapsed / 2200);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.isHeart) {
          ctx.font = `${p.size * 1.5}px sans-serif`;
          ctx.fillText('💖', -p.size / 2, p.size / 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      });

      if (elapsed < 2300) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    }

    renderConfetti();
  }

  // =========================================================================
  // DATES CALCULATION (Relative to Today)
  // =========================================================================
  function calculateDateOptions() {
    calculatedDays.length = 0;
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      calculatedDays.push(d);
    }
  }

  calculateDateOptions();

  // =========================================================================
  // BILINGUAL LOCALIZATION UPDATE
  // =========================================================================
  function applyLanguage(lang) {
    currentLang = lang;
    const dict = I18N[lang];

    // Update all static data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update Header buttons
    langText.textContent = dict.lang_label;

    // Update Dynamic Day Grid labels
    const d0 = calculatedDays[0];
    const d1 = calculatedDays[1];
    const d2 = calculatedDays[2];
    const d3 = calculatedDays[3];
    const d4 = calculatedDays[4];

    document.getElementById('labelDay0').textContent = `${dict.months[d0.getMonth()]} ${d0.getDate()}`;
    document.getElementById('labelDay1').textContent = `${dict.months[d1.getMonth()]} ${d1.getDate()}`;

    document.getElementById('labelDayName2').textContent = dict.days[d2.getDay()];
    document.getElementById('labelDay2').textContent = `${dict.months[d2.getMonth()]} ${d2.getDate()}`;

    document.getElementById('labelDayName3').textContent = dict.days[d3.getDay()];
    document.getElementById('labelDay3').textContent = `${dict.months[d3.getMonth()]} ${d3.getDate()}`;

    document.getElementById('labelDayName4').textContent = dict.days[d4.getDay()];
    document.getElementById('labelDay4').textContent = `${dict.months[d4.getMonth()]} ${d4.getDate()}`;

    // Update current evasive No button text if it was dodged
    if (dodgeCount > 0) {
      const lines = dict.no_lines;
      const idx = Math.min(dodgeCount, lines.length - 1);
      btnNo.textContent = lines[idx];
    } else {
      btnNo.textContent = dict.btn_no;
    }

    // Refresh ticket details in case selections changed
    updateTicketDetails();
  }

  // =========================================================================
  // STEP NAVIGATION & STORY PROGRESS BARS
  // =========================================================================
  function updateStoryProgress() {
    barFills.forEach((bar, idx) => {
      if (idx + 1 < currentStep) {
        bar.style.width = '100%';
      } else if (idx + 1 === currentStep) {
        bar.style.width = '100%';
      } else {
        bar.style.width = '0%';
      }
    });

    // Show or hide back button
    if (currentStep > 1 && currentStep < 5) {
      btnBack.classList.add('visible');
    } else {
      btnBack.classList.remove('visible');
    }
  }

  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 5) return;
    currentStep = stepNumber;

    stepViews.forEach((view, idx) => {
      if (idx + 1 === currentStep) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Extra safety: make sure btnNo is only displayed when on Step 1
    if (currentStep === 1) {
      btnNo.style.display = 'inline-flex';
    } else {
      btnNo.style.display = 'none';
    }

    updateStoryProgress();

    if (currentStep === 5) {
      updateTicketDetails();
      startLiveCountdown();
    }
  }

  // =========================================================================
  // STEP 1: EVASIVE NO BUTTON MECHANICS (NEVER COVERS TEXT)
  // =========================================================================
  function dodgeNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    dodgeCount++;
    playWhooshSound();

    // Ensure button is positioned absolutely inside step1 (so it auto-hides on other steps!)
    if (!btnNo.classList.contains('is-loose')) {
      btnNo.classList.add('is-loose');
      step1.appendChild(btnNo);
    }

    // Get coordinates of subtitle and step1
    const stepRect = step1.getBoundingClientRect();
    const subEl = step1.querySelector('.step-subtitle');
    const subRect = subEl.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // The button must strictly remain below the subtitle so it NEVER covers text!
    // Safe Y: below subtitle by at least 14px, up to step bottom - 20px
    const safeTop = (subRect.bottom - stepRect.top) + 16;
    const safeBottom = stepRect.height - btnRect.height - 18;

    // Safe X: 14px from left to step width - btn width - 14px
    const minX = 14;
    const maxX = Math.max(minX + 20, stepRect.width - btnRect.width - 20);

    // Pick random location in the arena
    let randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    let randomY = Math.floor(Math.random() * (safeBottom - safeTop + 1)) + safeTop;

    // Ensure it doesn't directly overlap the Yes button
    const yesRelLeft = yesRect.left - stepRect.left;
    const yesRelRight = yesRect.right - stepRect.left;
    const yesRelTop = yesRect.top - stepRect.top;
    const yesRelBottom = yesRect.bottom - stepRect.top;

    if (
      randomX + btnRect.width > yesRelLeft - 10 &&
      randomX < yesRelRight + 10 &&
      randomY + btnRect.height > yesRelTop - 8 &&
      randomY < yesRelBottom + 8
    ) {
      // If it collides with Yes, push to far left, far right, or below
      if (Math.random() > 0.5 && yesRelLeft - btnRect.width - 15 > minX) {
        randomX = minX + 5;
      } else if (yesRelRight + 15 < maxX) {
        randomX = maxX - 5;
      } else {
        randomY = Math.min(safeBottom, yesRelBottom + 12);
      }
    }

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    // Slight playful random tilt
    const tilt = (Math.random() - 0.5) * 14;
    btnNo.style.transform = `rotate(${tilt}deg) scale(0.92)`;

    // Change text from funny lines
    const dict = I18N[currentLang];
    const lines = dict.no_lines;
    const idx = Math.min(dodgeCount, lines.length - 1);
    btnNo.textContent = lines[idx];

    // Grow "Yes!" button scale
    const growFactor = Math.min(1.85, 1 + dodgeCount * 0.08);
    storyCard.style.setProperty('--grow', growFactor.toString());
    btnYes.style.transform = `scale(${growFactor})`;
  }

  // Attach evasive listeners: mouseenter, touchstart, click
  btnNo.addEventListener('mouseenter', dodgeNoButton);
  btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
  btnNo.addEventListener('click', (e) => {
    dodgeNoButton(e);
  });

  // Handle Yes Click
  btnYes.addEventListener('click', () => {
    playJoyfulChime();
    triggerConfetti();

    // Play bg music if user hasn't explicitly disabled
    if (audioMuted && bgAudio) {
      bgAudio.play().then(() => {
        audioMuted = false;
        soundToggle.classList.remove('muted');
      }).catch(() => {});
    }

    // Show YAAS! celebration overlay for 1.1s
    yaasOverlay.classList.add('visible');

    setTimeout(() => {
      yaasOverlay.classList.remove('visible');
      goToStep(2);
    }, 1100);
  });

  // Back Button Click
  btnBack.addEventListener('click', () => {
    playPopSound(450);
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  // =========================================================================
  // STEP 2: DATE & TIME SELECTION
  // =========================================================================
  const dayCards = document.querySelectorAll('.day-card');
  const timeCards = document.querySelectorAll('.time-card');

  function updateDaySelection(card) {
    dayCards.forEach((c) => c.classList.remove('selected'));
    card.classList.add('selected');
    playPopSound(520);

    const dayIndex = parseInt(card.getAttribute('data-day-index'), 10);
    userChoices.dayIndex = dayIndex;

    if (dayIndex >= 0 && dayIndex < 5) {
      userChoices.dayDate = calculatedDays[dayIndex];
    } else {
      // Surprise me: Upcoming Saturday (+3 or +4 days)
      const surpriseDate = new Date();
      surpriseDate.setDate(surpriseDate.getDate() + 3);
      userChoices.dayDate = surpriseDate;
    }
  }

  dayCards.forEach((card) => {
    card.addEventListener('click', () => {
      updateDaySelection(card);
    });
  });

  timeCards.forEach((card) => {
    card.addEventListener('click', () => {
      timeCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      playPopSound(580);

      const timeKey = card.getAttribute('data-time-key');
      userChoices.timeKey = timeKey;

      // Map timeKey to hour
      if (timeKey === 'morning') userChoices.timeFormatted = '10:30';
      if (timeKey === 'afternoon') userChoices.timeFormatted = '15:00';
      if (timeKey === 'evening') userChoices.timeFormatted = '19:00';
      if (timeKey === 'night') userChoices.timeFormatted = '21:30';

      // Auto-advance to Step 3 after 350ms
      setTimeout(() => {
        goToStep(3);
      }, 350);
    });
  });

  // =========================================================================
  // STEP 3: MAIN ACTIVITY SELECTION
  // =========================================================================
  const activityCards = document.querySelectorAll('#activityGrid .activity-card');

  activityCards.forEach((card) => {
    card.addEventListener('click', () => {
      activityCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      playPopSound(640);

      const key = card.getAttribute('data-activity-key');
      userChoices.activityKey = key;

      setTimeout(() => {
        goToStep(4);
      }, 350);
    });
  });

  // =========================================================================
  // STEP 4: AFTER-PLAN SELECTION
  // =========================================================================
  const afterCards = document.querySelectorAll('#afterGrid .activity-card');

  afterCards.forEach((card) => {
    card.addEventListener('click', () => {
      afterCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      playPopSound(700);

      const key = card.getAttribute('data-after-key');
      userChoices.afterKey = key;

      setTimeout(() => {
        goToStep(5);
      }, 350);
    });
  });

  // =========================================================================
  // STEP 5: TICKET PASS, LIVE COUNTDOWN & CALENDAR (.ICS / GOOGLE CALENDAR)
  // =========================================================================
  function getSelectedDateObject() {
    let d;
    if (userChoices.dayIndex >= 0 && userChoices.dayIndex < 5) {
      d = new Date(calculatedDays[userChoices.dayIndex]);
    } else {
      d = new Date();
      d.setDate(d.getDate() + 3);
    }

    const [hrs, mins] = userChoices.timeFormatted.split(':').map(Number);
    d.setHours(hrs || 19, mins || 0, 0, 0);
    return d;
  }

  function updateTicketDetails() {
    const dict = I18N[currentLang];
    const dateObj = getSelectedDateObject();
    targetDate = dateObj;

    // Format When
    const dayName = dict.days[dateObj.getDay()];
    const monthName = dict.months[dateObj.getMonth()];
    const dateNum = dateObj.getDate();

    if (currentLang === 'vi') {
      ticketWhen.textContent = `${dayName}, ${dateNum} ${monthName}`;
    } else {
      ticketWhen.textContent = `${dayName}, ${monthName} ${dateNum}`;
    }

    // Format Time
    const timeLabels = {
      morning: dict.time_morning,
      afternoon: dict.time_afternoon,
      evening: dict.time_evening,
      night: dict.time_night
    };
    const tName = timeLabels[userChoices.timeKey] || dict.time_evening;
    ticketTime.textContent = `${tName} · ${userChoices.timeFormatted}`;

    // Format Activity
    const actLabels = {
      coffee: dict.act_coffee,
      dinner: dict.act_dinner,
      movie: dict.act_movie,
      walk: dict.act_walk
    };
    ticketWhere.textContent = actLabels[userChoices.activityKey] || dict.act_coffee;

    // Bring
    ticketBring.textContent = dict.val_flowers;

    // Then
    const afterLabels = {
      dessert: dict.aft_dessert,
      stargazing: dict.aft_stargazing,
      drive: dict.aft_drive,
      stay: dict.aft_home
    };
    ticketThen.textContent = afterLabels[userChoices.afterKey] || dict.aft_stargazing;

    // Update Modal text
    modalMonth.textContent = `${dict.full_months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    modalDateSummary.textContent = `${ticketWhen.textContent}, ${userChoices.timeFormatted}`;

    renderMiniCalendar(dateObj);
  }

  // Mini Month Calendar Preview inside Modal
  function renderMiniCalendar(target) {
    if (!calendarPreviewGrid) return;
    calendarPreviewGrid.innerHTML = '';

    const dict = I18N[currentLang];
    const dayHeaders = currentLang === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    dayHeaders.forEach((h) => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell cal-header-cell';
      cell.textContent = h;
      calendarPreviewGrid.appendChild(cell);
    });

    const year = target.getFullYear();
    const month = target.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day-cell';
      empty.style.opacity = '0';
      calendarPreviewGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';
      cell.textContent = day.toString();

      if (day === target.getDate()) {
        cell.classList.add('highlight-day');
      }

      calendarPreviewGrid.appendChild(cell);
    }
  }

  // Live Countdown Timer
  function startLiveCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
      const now = new Date();
      const diffMs = targetDate - now;

      if (diffMs <= 0) {
        countdownTimer.textContent = currentLang === 'vi' ? 'HÔM NAY! 💖' : 'TODAY! 💖';
        return;
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      const pad = (n) => String(n).padStart(2, '0');
      countdownTimer.textContent = `${days}D ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  // Format date for RFC-5545 iCalendar UTC
  function formatIsoUtc(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  // Generate .ICS Calendar File
  function generateIcsBlob() {
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);
    endDate.setHours(endDate.getHours() + 3);

    const dict = I18N[currentLang];
    const summary = currentLang === 'vi' ? 'Hẹn hò lãng mạn 💖' : 'Date Night! 💖';
    const location = ticketWhere.textContent;
    const description = currentLang === 'vi'
      ? `Buổi hẹn hò đáng nhớ!\nĐịa điểm: ${location}\nTiếp theo: ${ticketThen.textContent}\nMang theo: Hoa tươi 💐`
      : `Special date night!\nActivity: ${location}\nAfter: ${ticketThen.textContent}\nBring: Flowers 💐`;

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Date Planner//Date Night//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:date-${Date.now()}@dateplanner.app`,
      `DTSTAMP:${formatIsoUtc(new Date())}`,
      `DTSTART:${formatIsoUtc(startDate)}`,
      `DTEND:${formatIsoUtc(endDate)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Date night starts in 1 hour!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  }

  // Download .ics file
  function triggerIcsDownload() {
    const blob = generateIcsBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'date-night.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Google Calendar URL Generator
  function getGoogleCalendarUrl() {
    const startDate = new Date(targetDate);
    const endDate = new Date(targetDate);
    endDate.setHours(endDate.getHours() + 3);

    const summary = currentLang === 'vi' ? 'Hẹn hò lãng mạn 💖' : 'Date Night! 💖';
    const location = ticketWhere.textContent;
    const details = currentLang === 'vi'
      ? `Buổi hẹn hò đáng nhớ! Tiếp theo: ${ticketThen.textContent} · Mang theo: Hoa tươi 💐`
      : `Special date night! After: ${ticketThen.textContent} · Bring: Flowers 💐`;

    const dates = `${formatIsoUtc(startDate)}/${formatIsoUtc(endDate)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(summary)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  }

  // Show Toast
  function showToast(text) {
    toastMsg.textContent = text;
    toastPill.classList.add('show');
    setTimeout(() => {
      toastPill.classList.remove('show');
    }, 2800);
  }

  // Handle "Add to Calendar"
  btnAddToCalendar.addEventListener('click', () => {
    playStampThud();
    triggerConfetti();

    // Rubber stamp animation
    ticketStamp.classList.add('stamped');

    // Button state update
    btnAddToCalendar.classList.add('saved');
    btnCalText.textContent = currentLang === 'vi' ? 'Đã thêm! 💖' : 'Added! 💖';

    // Download .ics
    triggerIcsDownload();

    // Prepare Google Calendar link
    btnGoogleCal.href = getGoogleCalendarUrl();

    // Open Modal after slight delay
    setTimeout(() => {
      calModal.classList.add('open');
    }, 450);

    // Toast
    const dict = I18N[currentLang];
    showToast(dict.saved_toast);
  });

  btnDownloadIcs.addEventListener('click', () => {
    playPopSound(600);
    triggerIcsDownload();
    showToast(currentLang === 'vi' ? 'Đã tải file .ics về máy!' : 'Downloaded .ics file!');
  });

  btnConfirmDate.addEventListener('click', () => {
    playPopSound(500);
    calModal.classList.remove('open');
  });

  // Close modal when tapping outside card
  calModal.addEventListener('click', (e) => {
    if (e.target === calModal) {
      calModal.classList.remove('open');
    }
  });

  // Share button
  btnShare.addEventListener('click', () => {
    playPopSound(540);
    const summaryText = `${ticketWhen.textContent} @ ${userChoices.timeFormatted} - ${ticketWhere.textContent} & ${ticketThen.textContent} 💖`;

    if (navigator.share) {
      navigator.share({
        title: 'Date Night Ticket 💖',
        text: summaryText,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        showToast(I18N[currentLang].copied_toast);
      }).catch(() => {
        showToast(summaryText);
      });
    } else {
      showToast(summaryText);
    }
  });

  // =========================================================================
  // LANGUAGE & SOUND TOGGLES
  // =========================================================================
  langToggle.addEventListener('click', () => {
    playPopSound(550);
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    applyLanguage(nextLang);
  });

  soundToggle.addEventListener('click', () => {
    initAudioCtx();
    audioMuted = !audioMuted;

    if (audioMuted) {
      soundToggle.classList.add('muted');
      if (bgAudio) bgAudio.pause();
    } else {
      soundToggle.classList.remove('muted');
      if (bgAudio) {
        bgAudio.play().catch(() => {});
      }
      playPopSound(720);
    }
  });

  // =========================================================================
  // INITIALIZE APP
  // =========================================================================
  function init() {
    // Select default cards in Step 2, 3, 4
    const defaultDayCard = document.querySelector('.day-card.selected') || dayCards[2];
    if (defaultDayCard) updateDaySelection(defaultDayCard);

    // Apply default language (Vietnamese)
    applyLanguage('vi');

    // Setup initial story progress
    updateStoryProgress();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
