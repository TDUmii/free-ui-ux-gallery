window.BambooApp.createLampController = function createLampController({ form, panda, showToast }) {
  const { lampSwitch, cord, cordHandle, lampHint, formLock } = window.BambooApp.elements;
  let pullOrigin = null;
  let pullAmount = 0;
  let ignoreNextClick = false;
  let cordAnimation;
  let handleAnimation;

  function setLamp(on, options = {}) {
    document.body.classList.toggle("lamp-off", !on);
    lampSwitch.setAttribute("aria-pressed", String(on));
    lampSwitch.setAttribute("aria-label", on ? "Tắt đèn" : "Bật đèn");
    lampHint.textContent = on ? "Kéo dây để tắt đèn" : "Kéo dây để bật đèn";
    form.setEnabled(on);
    formLock.setAttribute("aria-hidden", String(on));
    formLock.tabIndex = on ? -1 : 0;
    if (!on) panda.sleep();
    else if (options.greet) panda.greet();
  }

  function renderPull(amount) {
    cord.style.transform = `translateX(-50%) scaleY(${1 + amount / 78})`;
    cordHandle.style.transform = `translateX(-50%) translateY(${amount}px)`;
  }

  function recoil(amount) {
    cordAnimation?.cancel();
    handleAnimation?.cancel();
    cord.style.transform = "";
    cordHandle.style.transform = "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stretch = 1 + amount / 78;
    const kick = Math.min(13, 5 + amount * .19);
    cordAnimation = cord.animate([
      { transform: `translateX(-50%) scaleY(${stretch})`, easing: "cubic-bezier(.12,.72,.18,1)" },
      { transform: `translateX(-50%) scaleY(${1 - kick / 78})`, offset: .31 },
      { transform: "translateX(-50%) scaleY(1.065)", offset: .52 },
      { transform: "translateX(-50%) scaleY(.972)", offset: .69 },
      { transform: "translateX(-50%) scaleY(1.012)", offset: .84 },
      { transform: "translateX(-50%) scaleY(1)" },
    ], { duration: 760, easing: "linear" });
    handleAnimation = cordHandle.animate([
      { transform: `translateX(-50%) translateY(${amount}px) scaleY(1.08)`, easing: "cubic-bezier(.12,.72,.18,1)" },
      { transform: `translateX(-50%) translateY(${-kick}px) scaleY(.92)`, offset: .31 },
      { transform: "translateX(-50%) translateY(5px) scaleY(1.03)", offset: .52 },
      { transform: "translateX(-50%) translateY(-2px) scaleY(.98)", offset: .69 },
      { transform: "translateX(-50%) translateY(1px)", offset: .84 },
      { transform: "translateX(-50%) translateY(0)" },
    ], { duration: 760, easing: "linear" });
  }

  function release(event) {
    if (pullOrigin === null) return;
    const distance = typeof event?.clientY === "number" ? event.clientY - pullOrigin : 0;
    const raw = Math.max(pullAmount, distance);
    const finalPull = Math.max(0, Math.min(48, raw <= 30 ? raw : 30 + (raw - 30) * .34));
    pullOrigin = null;
    recoil(finalPull);
    if (finalPull > 18) {
      const turningOn = document.body.classList.contains("lamp-off");
      setLamp(turningOn, { greet: turningOn });
      ignoreNextClick = true;
      setTimeout(() => { ignoreNextClick = false; }, 300);
    }
    pullAmount = 0;
  }

  lampSwitch.addEventListener("pointerdown", event => {
    cordAnimation?.cancel();
    handleAnimation?.cancel();
    pullOrigin = event.clientY;
    pullAmount = 0;
    renderPull(0);
    lampSwitch.setPointerCapture(event.pointerId);
  });
  lampSwitch.addEventListener("pointermove", event => {
    if (pullOrigin === null) return;
    const raw = Math.max(0, event.clientY - pullOrigin);
    pullAmount = Math.min(48, raw <= 30 ? raw : 30 + (raw - 30) * .34);
    renderPull(pullAmount);
  });
  lampSwitch.addEventListener("pointerup", release);
  lampSwitch.addEventListener("pointercancel", release);
  document.addEventListener("mouseup", release);
  document.addEventListener("touchend", event => {
    const touch = event.changedTouches?.[0];
    if (touch) release({ clientY: touch.clientY });
  }, { passive: true });
  lampSwitch.addEventListener("click", () => {
    if (ignoreNextClick) return void (ignoreNextClick = false);
    recoil(10);
    const turningOn = document.body.classList.contains("lamp-off");
    setLamp(turningOn, { greet: turningOn });
  });
  formLock.addEventListener("click", () => {
    showToast("Kéo núm dây xuống để bật đèn nhé!");
    lampSwitch.focus({ preventScroll: true });
    recoil(8);
  });

  setLamp(true);
  return { setLamp };
};
