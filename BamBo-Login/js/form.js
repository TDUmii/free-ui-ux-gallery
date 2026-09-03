window.BambooApp.createFormController = function createFormController(showToast) {
  const { loginForm, username, password, signInButton } = window.BambooApp.elements;

  function setEnabled(enabled) {
    loginForm.setAttribute("aria-disabled", String(!enabled));
    loginForm.querySelectorAll("input, button").forEach(control => {
      control.disabled = !enabled || (control === signInButton && control.classList.contains("is-loading"));
    });
    loginForm.querySelectorAll("a").forEach(link => {
      link.setAttribute("aria-disabled", String(!enabled));
      link.tabIndex = enabled ? 0 : -1;
    });
  }

  function validateField(input, condition, errorId) {
    const isValid = condition(input.value.trim());
    input.setAttribute("aria-invalid", String(!isValid));
    document.querySelector(`#${errorId}`).classList.toggle("show", !isValid);
    return isValid;
  }

  [username, password].forEach(input => input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    document.querySelector(`#${input.id}Error`).classList.remove("show");
  }));

  username.addEventListener("blur", () => {
    if (!username.value.trim()) validateField(username, value => value.length > 0, "usernameError");
  });
  password.addEventListener("blur", () => {
    if (password.value.length > 0 && password.value.length < 6) {
      validateField(password, value => value.length >= 6, "passwordError");
    }
  });

  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const hasUsername = validateField(username, value => value.length > 0, "usernameError");
    const hasPassword = validateField(password, value => value.length >= 6, "passwordError");
    if (!hasUsername || !hasPassword) {
      (hasUsername ? password : username).focus();
      showToast("Panda cần bạn điền đủ thông tin nhé.");
      return;
    }

    signInButton.disabled = true;
    signInButton.classList.add("is-loading");
    setTimeout(() => {
      signInButton.disabled = document.body.classList.contains("lamp-off");
      signInButton.classList.remove("is-loading");
      showToast(`Chào mừng ${username.value.trim()} trở lại với Bamboo!`);
    }, 850);
  });

  document.querySelectorAll("[data-provider]").forEach(button => {
    button.addEventListener("click", () => showToast(`Đăng nhập bằng ${button.dataset.provider} đang ở chế độ demo.`));
  });
  document.querySelectorAll("[data-demo]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showToast(link.dataset.demo);
    });
  });

  return { setEnabled };
};
