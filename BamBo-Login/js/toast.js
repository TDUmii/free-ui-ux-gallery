window.BambooApp.createToast = function createToast() {
  const { toast } = window.BambooApp.elements;
  let timer;

  return function showToast(message) {
    clearTimeout(timer);
    toast.textContent = message;
    toast.classList.add("show");
    timer = setTimeout(() => toast.classList.remove("show"), 2400);
  };
};
