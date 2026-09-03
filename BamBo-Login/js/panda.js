window.BambooApp.createPandaController = function createPandaController() {
  const { panda, password, passwordToggle, pupils } = window.BambooApp.elements;
  let passwordVisible = false;
  let passwordFocused = false;
  let greetingTimer;
  let wakeTimer;

  function syncExpression() {
    panda.classList.toggle("is-covering", passwordFocused && !passwordVisible);
    panda.classList.toggle("is-peeking", passwordFocused && passwordVisible);
  }

  function greet() {
    if (passwordFocused) return;
    clearTimeout(greetingTimer);
    clearTimeout(wakeTimer);
    panda.classList.remove("is-waving");
    document.body.classList.remove("lamp-waking");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panda.classList.add("is-waving");
      document.body.classList.add("lamp-waking");
    }));
    greetingTimer = setTimeout(() => panda.classList.remove("is-waving"), 1500);
    wakeTimer = setTimeout(() => document.body.classList.remove("lamp-waking"), 1000);
  }

  function sleep() {
    panda.classList.remove("is-waving");
    document.body.classList.remove("lamp-waking");
  }

  password.addEventListener("focus", () => {
    passwordFocused = true;
    syncExpression();
  });
  password.addEventListener("blur", () => {
    passwordFocused = false;
    syncExpression();
  });

  passwordToggle.addEventListener("pointerdown", event => event.preventDefault());
  passwordToggle.addEventListener("click", () => {
    passwordVisible = !passwordVisible;
    password.type = passwordVisible ? "text" : "password";
    passwordToggle.setAttribute("aria-pressed", String(passwordVisible));
    passwordToggle.setAttribute("aria-label", passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    password.focus();
    syncExpression();
  });

  document.addEventListener("pointermove", event => {
    if (document.body.classList.contains("lamp-off") || (passwordFocused && !passwordVisible)) return;
    pupils.forEach(pupil => {
      const eye = pupil.parentElement.getBoundingClientRect();
      const dx = event.clientX - (eye.left + eye.width / 2);
      const dy = event.clientY - (eye.top + eye.height / 2);
      const distance = Math.min(4, Math.hypot(dx, dy) / 55);
      const angle = Math.atan2(dy, dx);
      pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    });
  });

  function blink() {
    if (!document.body.classList.contains("lamp-off") && !panda.classList.contains("is-covering")) {
      panda.classList.add("is-blinking");
      setTimeout(() => panda.classList.remove("is-blinking"), 130);
    }
    setTimeout(blink, 2300 + Math.random() * 2600);
  }
  setTimeout(blink, 1800);

  return { greet, sleep };
};
