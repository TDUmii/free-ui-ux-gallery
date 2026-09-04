(() => {
  const authKey = "bamboo-demo-auth";
  if (sessionStorage.getItem(authKey) !== "admin") {
    window.location.replace("index.html");
    return;
  }

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  $$("svg:not(.progress-chart)").forEach(svg => {
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
  });
  const toast = $("#dashboardToast");
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  const sidebar = $("#sidebar");
  const scrim = $("#sidebarScrim");
  const menuButton = $("#menuButton");
  const mobileSidebar = window.matchMedia("(max-width: 900px)");

  function setSidebar(open) {
    sidebar.classList.toggle("is-open", open);
    scrim.classList.toggle("is-visible", open);
    document.body.classList.toggle("sidebar-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    sidebar.inert = mobileSidebar.matches && !open;
  }

  function syncSidebarMode() {
    if (!mobileSidebar.matches) sidebar.inert = false;
    else if (!sidebar.classList.contains("is-open")) sidebar.inert = true;
  }

  menuButton.addEventListener("click", () => setSidebar(true));
  $("#sidebarClose").addEventListener("click", () => setSidebar(false));
  scrim.addEventListener("click", () => setSidebar(false));
  mobileSidebar.addEventListener("change", syncSidebarMode);
  syncSidebarMode();

  $$(".nav-item").forEach(item => item.addEventListener("click", () => {
    $$(".nav-item").forEach(nav => nav.classList.toggle("is-active", nav === item));
    $("#pageTitle").textContent = item.dataset.view === "Tổng quan" ? "Chào buổi sáng, Admin." : item.dataset.view;
    setSidebar(false);
    if (item.dataset.view !== "Tổng quan") showToast(`${item.dataset.view} đang được minh hoạ trong bản dashboard demo.`);
  }));

  const notificationButton = $("#notificationButton");
  const notificationPanel = $("#notificationPanel");
  notificationButton.addEventListener("click", event => {
    event.stopPropagation();
    const willOpen = notificationPanel.hidden;
    notificationPanel.hidden = !willOpen;
    notificationButton.setAttribute("aria-expanded", String(willOpen));
  });
  notificationPanel.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", () => {
    notificationPanel.hidden = true;
    notificationButton.setAttribute("aria-expanded", "false");
  });

  $("[data-action='read-all']").addEventListener("click", () => {
    notificationButton.querySelector("span").hidden = true;
    notificationButton.setAttribute("aria-label", "Thông báo, không có thông báo mới");
    notificationPanel.querySelectorAll(".notice-dot").forEach(dot => dot.remove());
    showToast("Đã đánh dấu tất cả thông báo là đã đọc.");
  });

  const metricSets = {
    7: { projects: "6", reviews: "3", completed: "9", quality: "90" },
    30: { projects: "8", reviews: "5", completed: "24", quality: "92" },
    90: { projects: "14", reviews: "8", completed: "67", quality: "94" },
  };
  $$("[data-range]").forEach(button => button.addEventListener("click", () => {
    $$("[data-range]").forEach(item => item.classList.toggle("is-selected", item === button));
    Object.entries(metricSets[button.dataset.range]).forEach(([key, value]) => {
      const metric = $(`[data-metric='${key}']`);
      if (key === "quality") metric.innerHTML = `${value}<span>/100</span>`;
      else metric.textContent = value;
    });
    showToast(`Đã cập nhật dữ liệu mẫu cho ${button.textContent}.`);
  }));

  const search = $("#globalSearch");
  const statusFilter = $("#statusFilter");
  const rows = $$("#projectRows tr");
  const emptyProjects = $("#emptyProjects");

  function filterProjects() {
    const query = search.value.trim().toLowerCase();
    const status = statusFilter.value;
    let visible = 0;
    rows.forEach(row => {
      const matchesQuery = !query || row.dataset.search.includes(query);
      const matchesStatus = status === "all" || row.dataset.status === status;
      row.hidden = !(matchesQuery && matchesStatus);
      if (!row.hidden) visible += 1;
    });
    emptyProjects.hidden = visible > 0;
  }
  search.addEventListener("input", filterProjects);
  statusFilter.addEventListener("change", filterProjects);
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape") {
      setSidebar(false);
      notificationPanel.hidden = true;
      closeDialog();
    }
  });

  const tooltip = $("#chartTooltip");
  $$(".chart-points circle").forEach((point, index) => {
    point.setAttribute("tabindex", "0");
    point.setAttribute("role", "button");
    point.setAttribute("aria-label", `Tuần ${index + 1}: ${point.dataset.value} màn hình đã duyệt`);
    const show = () => {
      const svgRect = $(".progress-chart").getBoundingClientRect();
      tooltip.textContent = `${point.dataset.value} màn hình`;
      tooltip.style.left = `${(Number(point.getAttribute("cx")) / 760) * svgRect.width}px`;
      tooltip.style.top = `${(Number(point.getAttribute("cy")) / 250) * svgRect.height}px`;
      tooltip.hidden = false;
    };
    point.addEventListener("mouseenter", show);
    point.addEventListener("focus", show);
    point.addEventListener("mouseleave", () => { tooltip.hidden = true; });
    point.addEventListener("blur", () => { tooltip.hidden = true; });
  });

  const dialogBackdrop = $("#dialogBackdrop");
  const dashboardShell = $(".dashboard-shell");
  const projectName = $("#projectName");
  let dialogReturnFocus;

  function openDialog(trigger) {
    dialogReturnFocus = trigger;
    dialogBackdrop.hidden = false;
    dashboardShell.inert = true;
    document.body.classList.add("dialog-open");
    requestAnimationFrame(() => projectName.focus());
  }
  function closeDialog() {
    if (dialogBackdrop.hidden) return;
    dialogBackdrop.hidden = true;
    dashboardShell.inert = false;
    document.body.classList.remove("dialog-open");
    syncSidebarMode();
    projectName.value = "";
    dialogReturnFocus?.focus();
  }
  $$('[data-action="new-project"]').forEach(button => button.addEventListener("click", () => openDialog(button)));
  $("#dialogClose").addEventListener("click", closeDialog);
  $("#dialogCancel").addEventListener("click", closeDialog);
  dialogBackdrop.addEventListener("click", event => { if (event.target === dialogBackdrop) closeDialog(); });
  dialogBackdrop.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const controls = $$("#dialogBackdrop button, #dialogBackdrop input").filter(control => !control.disabled);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  $("#dialogCreate").addEventListener("click", () => {
    const name = projectName.value.trim();
    if (!name) {
      projectName.focus();
      showToast("Hãy nhập tên dự án trước khi tạo.");
      return;
    }
    closeDialog();
    showToast(`Đã tạo “${name}” trong bản demo.`);
  });

  $$("[data-review]").forEach(button => button.addEventListener("click", () => showToast(`Đang mở bản duyệt “${button.dataset.review}”.`)));
  $$('[data-action="weekly"], [data-action="all-reviews"], [data-action="all-projects"]').forEach(button => button.addEventListener("click", () => showToast("Nội dung chi tiết đang ở chế độ minh hoạ.")));
  $$(".row-menu").forEach(button => button.addEventListener("click", () => showToast(button.getAttribute("aria-label"))));

  $("#logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem(authKey);
    window.location.replace("index.html");
  });
})();
