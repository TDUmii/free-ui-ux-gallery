/**
 * ==========================================================================
 * 401 COW ERROR PAGE - JAVASCRIPT CONTROLLER
 * Handles animation replay, Web Audio procedural sounds, and interactions.
 * ==========================================================================
 */

(function () {
  'use strict';

  // DOM Elements
  const sceneWrapper = document.getElementById('sceneWrapper');
  const sceneContainer = document.getElementById('sceneContainer');
  const btnReplay = document.getElementById('btnReplay');
  const btnSound = document.getElementById('btnSound');
  const btnHome = document.getElementById('btnHome');
  const cowStuck = document.getElementById('cowStuck');
  const soundText = document.getElementById('soundText');
  const iconSoundOff = document.querySelector('.icon-sound-off');
  const iconSoundOn = document.querySelector('.icon-sound-on');
  const toastMessage = document.getElementById('toastMessage');

  // Preloaded Audio Elements for Authentic Moo Sounds
  const sndAppear = document.getElementById('sndAppear') || new Audio('assets/audio/moo_appear.mp3');
  const sndFall = document.getElementById('sndFall') || new Audio('assets/audio/moo_fall.mp3');
  const sndClick = document.getElementById('sndClick') || new Audio('assets/audio/moo_click.mp3');

  // Audio State & Web Audio Context
  let audioCtx = null;
  let isSoundEnabled = true;
  let soundTimers = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Helper: Play HTML5 audio element with fallback to procedural synthesizer
   */
  function playAudioFile(audioEl, fallbackSynthFn) {
    if (!isSoundEnabled || reducedMotion.matches) return;
    if (audioEl) {
      audioEl.currentTime = 0;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (typeof fallbackSynthFn === 'function') {
            fallbackSynthFn();
          }
        });
        return;
      }
    }
    if (typeof fallbackSynthFn === 'function') {
      fallbackSynthFn();
    }
  }

  /**
   * Initialize Web Audio Context (lazy init on user interaction to comply with browser autoplay policies)
   */
  function initAudioContext() {
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

  /**
   * Sound Generator: Footstep tap
   */
  function playFootstepSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  /**
   * Sound Generator: Dive slide whoosh
   */
  function playDiveSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  /**
   * Sound Generator: Button launch pop
   */
  function playPopSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  /**
   * Sound Generator: Button landing thud
   */
  function playLandSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  /**
   * Sound Generator: Cute synthesized "Moo"
   */
  function playMooSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Vocal tract pitch contour for cute cow moo
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.linearRampToValueAtTime(220, now + 0.2);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.65);

    osc2.frequency.setValueAtTime(360, now);
    osc2.frequency.linearRampToValueAtTime(440, now + 0.2);
    osc2.frequency.exponentialRampToValueAtTime(280, now + 0.65);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // Filter to soften the sawtooth
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  }

  /**
   * Schedule animation sound effects synchronized with timeline
   */
  function scheduleAnimationSounds() {
    // Clear previous scheduled sound timers
    soundTimers.forEach(t => clearTimeout(t));
    soundTimers = [];

    if (!isSoundEnabled) return;

    // 1. Cow enters screen from the left at ~450ms -> Real Moo Entrance!
    soundTimers.push(setTimeout(() => {
      playAudioFile(sndAppear, playMooSound);
    }, 450));

    // 2. Footsteps across screen (550ms to 2250ms)
    const stepTimes = [550, 850, 1150, 1450, 1750, 2050];
    stepTimes.forEach(t => {
      soundTimers.push(setTimeout(playFootstepSound, t));
    });

    // 3. Cow hits hole rim and plunges at 2450ms -> Real Falling Moo + slide whoosh!
    soundTimers.push(setTimeout(() => {
      playAudioFile(sndFall, playMooSound);
      playDiveSound();
    }, 2450));

    // 4. Button ejection pop from stuck cow at 2900ms
    soundTimers.push(setTimeout(playPopSound, 2900));

    // 5. Button touchdown at 3550ms
    soundTimers.push(setTimeout(playLandSound, 3550));
  }

  /**
   * Show a temporary toast notification
   */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2400);
  }

  /**
   * Replay the full animation sequence cleanly
   */
  function replayAnimation() {
    initAudioContext();

    // Re-trigger CSS animations on key elements cleanly
    const animatedElements = sceneContainer.querySelectorAll(
      '.error-code, .error-message, .btn-home, .cow-walking, .cow-stuck'
    );

    animatedElements.forEach(el => {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });

    // Re-schedule sounds
    scheduleAnimationSounds();
    showToast('Phát lại hoạt cảnh 🐮✨');
  }

  /**
   * Toggle Sound On / Off
   */
  function toggleSound() {
    initAudioContext();
    isSoundEnabled = !isSoundEnabled;

    if (isSoundEnabled) {
      soundText.textContent = 'Sound On';
      iconSoundOff.style.display = 'none';
      iconSoundOn.style.display = 'inline-block';
      showToast('Đã bật âm thanh hiệu ứng 🔊');
      playAudioFile(sndClick, playPopSound);
      scheduleAnimationSounds();
    } else {
      soundText.textContent = 'Sound Off';
      iconSoundOff.style.display = 'inline-block';
      iconSoundOn.style.display = 'none';
      showToast('Đã tắt âm thanh 🔇');
      soundTimers.forEach(t => clearTimeout(t));
      soundTimers = [];
      [sndAppear, sndFall, sndClick].forEach(snd => {
        if (snd) {
          snd.pause();
          snd.currentTime = 0;
        }
      });
    }
  }

  /**
   * Stuck Cow Click Event: panic kick and wiggle
   */
  let isPanicking = false;
  function onCowClick() {
    initAudioContext();
    if (isPanicking) return;
    isPanicking = true;

    cowStuck.classList.add('panicking');
    playAudioFile(sndClick, playMooSound);
    showToast('🐮 Moo-oo! Kẹt rồi, bấm "Go Home" để cứu em với!');

    setTimeout(() => {
      cowStuck.classList.remove('panicking');
      isPanicking = false;
    }, 1200);
  }

  /**
   * Go Home Button Click Handler
   */
  function onBtnHomeClick(e) {
    e.preventDefault();
    initAudioContext();
    playPopSound();
    showToast('Đang chuyển hướng về trang chủ... 🚀');
    
    // Simulate navigation after slight delay
    setTimeout(() => {
      window.location.href = window.location.origin || '/';
    }, 600);
  }

  /**
   * Unlock audio on first user gesture (satisfies browser autoplay security policy)
   */
  function unlockAudioOnFirstGesture() {
    initAudioContext();
    [sndAppear, sndFall, sndClick].forEach(snd => {
      if (snd) {
        snd.load();
      }
    });
    window.removeEventListener('pointerdown', unlockAudioOnFirstGesture);
    window.removeEventListener('keydown', unlockAudioOnFirstGesture);
  }

  /**
   * Setup Event Listeners
   */
  function initEvents() {
    // Unlock Web Audio & preload sounds on first user interaction
    window.addEventListener('pointerdown', unlockAudioOnFirstGesture, { once: true });
    window.addEventListener('keydown', unlockAudioOnFirstGesture, { once: true });

    // Replay Button
    if (btnReplay) {
      btnReplay.addEventListener('click', replayAnimation);
    }

    // Sound Toggle Button
    if (btnSound) {
      btnSound.addEventListener('click', toggleSound);
    }

    // Stuck Cow Interaction
    if (cowStuck) {
      cowStuck.addEventListener('click', onCowClick);
      cowStuck.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCowClick();
        }
      });
    }

    // Go Home Button
    if (btnHome) {
      btnHome.addEventListener('click', onBtnHomeClick);
    }

    // Keyboard Shortcuts: 'R' to replay, 'M' to mute/unmute
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'r' || e.key === 'R') {
        replayAnimation();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      }
    });

    // Schedule initial sounds if sound is enabled
    scheduleAnimationSounds();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }
})();
