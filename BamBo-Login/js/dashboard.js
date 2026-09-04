(() => {
  const authKey = "bamboo-demo-auth";
  if (sessionStorage.getItem(authKey) !== "admin") { window.location.replace("index.html"); return; }

  const store = window.BambooDashboardStore;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const icon = name => `<svg aria-hidden="true" focusable="false"><use href="#${name}"></use></svg>`;
  const statusMeta = {
    progress: { label: "Đang thiết kế", className: "progress" },
    review: { label: "Đang duyệt", className: "review" },
    done: { label: "Hoàn thành", className: "done" },
  };
  const viewMeta = {
    overview: { placeholder: "Tìm dự án..." },
    projects: { placeholder: "Tìm theo tên, loại hoặc người phụ trách..." },
    reviews: { placeholder: "Tìm bản duyệt hoặc tác giả..." },
    members: { placeholder: "Tìm thành viên hoặc vai trò..." },
    library: { placeholder: "Tìm component hoặc token..." },
    settings: { placeholder: "Tìm kiếm không áp dụng ở Cài đặt" },
  };
  const colors = ["coral", "green", "gold", "blue"];
  const roles = ["Design Lead", "Product Designer", "UX Researcher", "UI Designer"];
  const ui = { view: "overview", range: 30, projectFilter: "all", libraryFilter: "all", selectedProjectId: null };
  const toast = $("#dashboardToast");
  let toastTimer;
  let overlayReturnFocus = null;
  let resetArmed = false;
  let archiveArmed = false;

  function playTone() {
    if (!store.state.settings.soundFeedback) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 540;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
      oscillator.addEventListener("ended", () => context.close());
    } catch { /* Sound is optional when Web Audio is unavailable. */ }
  }

  function showToast(message, sound = true) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
    if (sound) playTone();
  }
  function save(message) { store.save(); renderAll(); if (message) showToast(message); }
  function initials(name) { return String(name).trim().split(/\s+/).slice(-2).map(part => part[0] || "").join("").toUpperCase(); }
  function normalize(value) { return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function currentQuery() { return normalize($("#globalSearch").value.trim()); }
  function matchesQuery(parts) { const query = currentQuery(); return !query || normalize(parts.join(" ")).includes(query); }
  function projectById(id) { return store.state.projects.find(project => project.id === id); }

  function renderNavCounts() {
    $("#projectNavCount").textContent = store.state.projects.length;
    $("#reviewNavCount").textContent = store.state.reviews.filter(review => review.status === "pending").length;
  }
  function teamStack(project) {
    return `<span class="avatar-stack">${project.team.map(member => member.startsWith("+") ? `<b>${escapeHTML(member)}</b>` : `<i>${escapeHTML(member)}</i>`).join("")}</span>`;
  }
  function projectRow(project) {
    const meta = statusMeta[project.status] || statusMeta.progress;
    const projectIcon = project.type === "Web dashboard" ? "i-grid" : project.type === "Website thương hiệu" ? "i-library" : "i-folder";
    return `<tr data-status="${meta.className}" data-search="${escapeHTML(normalize([project.name, project.type, project.owner].join(" ")))}">
      <td><span class="project-icon ${escapeHTML(project.color)}">${icon(projectIcon)}</span><span><strong>${escapeHTML(project.name)}</strong><small>${escapeHTML(project.type)}</small></span></td>
      <td>${teamStack(project)}</td><td><span class="progress-value"><i style="--value:${project.progress}%"></i></span><b class="percent">${project.progress}%</b></td>
      <td><span class="status ${meta.className}">${meta.label}</span></td><td>${escapeHTML(project.updated)}</td>
      <td><button class="icon-button row-menu" type="button" data-open-project="${escapeHTML(project.id)}" aria-label="Mở chi tiết ${escapeHTML(project.name)}">${icon("i-more")}</button></td></tr>`;
  }

  function renderOverview() {
    const pending = store.state.reviews.filter(review => review.status === "pending");
    const completed = store.state.projects.filter(project => project.status === "done").length;
    const active = store.state.projects.filter(project => project.status !== "done").length;
    const scale = ui.range === 7
      ? { projects: Math.max(1, active - 2), reviews: Math.max(0, pending.length - 1), completed: Math.max(1, Math.ceil(completed / 2)), quality: Math.max(80, 86 + completed * 2) }
      : ui.range === 90
        ? { projects: active + 6, reviews: pending.length + 3, completed: completed + 9, quality: Math.min(99, 90 + completed * 2) }
        : { projects: active, reviews: pending.length, completed, quality: Math.min(98, 88 + completed * 2) };
    $("[data-metric='projects']").textContent = scale.projects;
    $("[data-metric='reviews']").textContent = scale.reviews;
    $("[data-metric='completed']").textContent = scale.completed;
    $("[data-metric='quality']").innerHTML = `${scale.quality}<span>/100</span>`;
    $(".queue-count").textContent = pending.length;
    $(".review-list").innerHTML = pending.slice(0, 3).map((review, index) => `<button type="button" class="review-item" data-go-review="${escapeHTML(review.id)}"><span class="review-thumb ${colors[index % colors.length]}">${escapeHTML(initials(review.title))}</span><span><strong>${escapeHTML(review.title)}</strong><small>${escapeHTML(review.scope)} · ${review.screens} màn hình</small></span>${icon("i-arrow")}</button>`).join("") || `<p class="empty-projects">Không còn thiết kế nào chờ duyệt.</p>`;
    const status = $("#statusFilter").value;
    const visible = store.state.projects.filter(project => (status === "all" || project.status === status) && matchesQuery([project.name, project.type, project.owner]));
    $("#projectRows").innerHTML = visible.slice(0, 4).map(projectRow).join("");
    $("#emptyProjects").hidden = visible.length > 0;
  }

  function renderProjects() {
    const projects = store.state.projects.filter(project => (ui.projectFilter === "all" || project.status === ui.projectFilter) && matchesQuery([project.name, project.type, project.owner]));
    $("#projectResultCount").textContent = `${projects.length} dự án`;
    $("#projectCatalog").innerHTML = projects.map(project => {
      const meta = statusMeta[project.status] || statusMeta.progress;
      return `<article class="project-card"><div class="project-card-head"><span class="project-icon ${escapeHTML(project.color)}">${icon("i-folder")}</span><span class="status ${meta.className}">${meta.label}</span></div><h2>${escapeHTML(project.name)}</h2><p>${escapeHTML(project.type)} · Phụ trách ${escapeHTML(project.owner)}</p><div class="project-card-progress"><span><i style="--value:${project.progress}%"></i></span><b>${project.progress}%</b></div><div class="project-card-foot"><small>Cập nhật ${escapeHTML(project.updated)}</small><button class="project-card-open" type="button" data-open-project="${escapeHTML(project.id)}">Chi tiết ${icon("i-arrow")}</button></div></article>`;
    }).join("");
    $("#projectCatalogEmpty").hidden = projects.length > 0;
  }

  function renderReviews() {
    const reviews = store.state.reviews.filter(review => review.status === "pending" && matchesQuery([review.title, review.scope, review.author]));
    $("#pendingReviewCount").textContent = store.state.reviews.filter(review => review.status === "pending").length;
    $("#reviewBoard").innerHTML = reviews.map((review, index) => `<article class="review-card"><span class="review-thumb ${colors[index % colors.length]}">${escapeHTML(initials(review.title))}</span><div class="review-card-main"><h2>${escapeHTML(review.title)}</h2><p>${escapeHTML(review.scope)}</p><div class="review-card-meta"><span>${icon("i-users")}${escapeHTML(review.author)}</span><span>${icon("i-grid")}${review.screens} màn hình</span><span>${icon("i-clock")}${escapeHTML(review.age)}</span></div></div><div class="review-actions"><button class="changes-button" type="button" data-review-action="changes" data-review-id="${escapeHTML(review.id)}">Yêu cầu sửa</button><button class="approve-button" type="button" data-review-action="approve" data-review-id="${escapeHTML(review.id)}">Phê duyệt</button></div></article>`).join("");
    $("#reviewBoardEmpty").hidden = reviews.length > 0 || Boolean(currentQuery());
    $("#activityLog").innerHTML = store.state.activity.slice(0, 8).map(activity => `<div class="activity-entry"><span>${icon("i-check")}</span><p>${escapeHTML(activity.text)}</p><time>${escapeHTML(activity.time)}</time></div>`).join("");
  }

  function renderMembers() {
    const members = store.state.members.filter(member => matchesQuery([member.name, member.email, member.role]));
    const active = store.state.members.filter(member => member.active).length;
    const tasks = store.state.members.reduce((sum, member) => sum + member.tasks, 0);
    $("#teamSummary").innerHTML = `<div class="summary-item"><span>Thành viên</span><strong>${store.state.members.length}</strong></div><div class="summary-item"><span>Đang hoạt động</span><strong>${active}</strong></div><div class="summary-item"><span>Tổng tác vụ</span><strong>${tasks}</strong></div>`;
    $("#memberGrid").innerHTML = members.map(member => `<article class="member-card"><div class="member-top"><span class="member-avatar ${escapeHTML(member.color)}">${escapeHTML(member.initials)}</span><span class="member-identity"><strong>${escapeHTML(member.name)}</strong><small>${escapeHTML(member.email)}</small></span><i class="member-status${member.active ? "" : " is-away"}" role="img" aria-label="${member.active ? "Đang hoạt động" : "Đang tạm dừng"}"></i></div><div class="member-fields"><label>Vai trò<select data-member-role="${escapeHTML(member.id)}">${roles.map(role => `<option${role === member.role ? " selected" : ""}>${role}</option>`).join("")}</select></label><div class="member-load"><span>${member.tasks} tác vụ được giao</span><button class="member-toggle" type="button" data-member-toggle="${escapeHTML(member.id)}">${member.active ? "Tạm dừng" : "Kích hoạt"}</button></div></div></article>`).join("");
  }

  function renderLibrary() {
    const items = store.state.library.filter(item => (ui.libraryFilter === "all" || item.category === ui.libraryFilter) && matchesQuery([item.name, item.category, item.description, item.token]));
    $("#favoriteCount").textContent = store.state.library.filter(item => item.favorite).length;
    $("#libraryGrid").innerHTML = items.map(item => `<article class="library-card"><div class="library-card-head"><span class="library-kind">${escapeHTML(item.category)}</span><button class="icon-button favorite-button${item.favorite ? " is-favorite" : ""}" type="button" data-library-favorite="${escapeHTML(item.id)}" aria-label="${item.favorite ? "Bỏ lưu" : "Lưu"} ${escapeHTML(item.name)}" aria-pressed="${item.favorite}">${icon("i-heart")}</button></div><h2>${escapeHTML(item.name)}</h2><p>${escapeHTML(item.description)}</p><div class="token-box"><code>${escapeHTML(item.token)}</code><button type="button" data-copy-token="${escapeHTML(item.id)}" aria-label="Sao chép token ${escapeHTML(item.name)}">${icon("i-copy")}</button></div><div class="library-foot">Đang dùng trong ${item.uses} màn hình</div></article>`).join("");
    $("#libraryEmpty").hidden = items.length > 0;
  }

  function applySettings() {
    const settings = store.state.settings;
    document.body.classList.toggle("density-compact", settings.density === "compact");
    const form = $("#settingsForm");
    form.elements.density.value = settings.density;
    form.elements.reviewNotifications.checked = settings.reviewNotifications;
    form.elements.weeklyReport.checked = settings.weeklyReport;
    form.elements.soundFeedback.checked = settings.soundFeedback;
  }
  function renderNotificationState() {
    const read = store.state.notificationsRead;
    const badge = $("span", $("#notificationButton"));
    if (badge) badge.hidden = read;
    $("#notificationButton").setAttribute("aria-label", read ? "Thông báo, không có thông báo mới" : "Thông báo, 3 tin mới");
    $$(".notice-dot", $("#notificationPanel")).forEach(dot => { dot.hidden = read; });
  }
  function renderAll() { renderNavCounts(); renderOverview(); renderProjects(); renderReviews(); renderMembers(); renderLibrary(); applySettings(); renderNotificationState(); }

  function setView(view, updateHash = true) {
    if (!viewMeta[view]) view = "overview";
    ui.view = view;
    $$("[data-view-panel]").forEach(panel => { const active = panel.dataset.viewPanel === view; panel.hidden = !active; panel.classList.toggle("is-active", active); });
    $$("[data-view]").forEach(item => { const active = item.dataset.view === view; item.classList.toggle("is-active", active); if (active) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current"); });
    $("#globalSearch").placeholder = viewMeta[view].placeholder;
    $("#globalSearch").disabled = view === "settings";
    if (updateHash && window.location.hash !== `#${view}`) history.pushState(null, "", `#${view}`);
    setSidebar(false);
    renderAll();
    $("#dashboardMain").focus({ preventScroll: true });
  }

  const sidebar = $("#sidebar");
  const sidebarScrim = $("#sidebarScrim");
  const menuButton = $("#menuButton");
  const mobileSidebar = window.matchMedia("(max-width: 900px)");
  function setSidebar(open) { sidebar.classList.toggle("is-open", open); sidebarScrim.classList.toggle("is-visible", open); document.body.classList.toggle("sidebar-open", open); menuButton.setAttribute("aria-expanded", String(open)); sidebar.inert = mobileSidebar.matches && !open; }
  function syncSidebarMode() { sidebar.inert = mobileSidebar.matches && !sidebar.classList.contains("is-open"); }
  menuButton.addEventListener("click", () => setSidebar(true));
  $("#sidebarClose").addEventListener("click", () => setSidebar(false));
  sidebarScrim.addEventListener("click", () => setSidebar(false));
  mobileSidebar.addEventListener("change", syncSidebarMode);
  syncSidebarMode();

  const notificationButton = $("#notificationButton");
  const notificationPanel = $("#notificationPanel");
  notificationButton.addEventListener("click", event => { event.stopPropagation(); const open = notificationPanel.hidden; notificationPanel.hidden = !open; notificationButton.setAttribute("aria-expanded", String(open)); });
  notificationPanel.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", () => { notificationPanel.hidden = true; notificationButton.setAttribute("aria-expanded", "false"); });

  const dashboardShell = $(".dashboard-shell");
  function activeOverlay() { return [$("#dialogBackdrop"), $("#memberDialogBackdrop")].find(element => !element.hidden); }
  function openModal(backdrop, trigger, focusTarget) { closeDrawer(false); overlayReturnFocus = trigger; backdrop.hidden = false; dashboardShell.inert = true; document.body.classList.add("dialog-open"); requestAnimationFrame(() => focusTarget.focus()); }
  function closeModal(backdrop = activeOverlay(), restoreFocus = true) { if (!backdrop || backdrop.hidden) return; backdrop.hidden = true; dashboardShell.inert = false; document.body.classList.remove("dialog-open"); syncSidebarMode(); if (restoreFocus) overlayReturnFocus?.focus(); }
  function trapFocus(event, container) {
    if (event.key !== "Tab") return;
    const controls = $$("button, input, select, textarea, [tabindex]:not([tabindex='-1'])", container).filter(control => !control.disabled && !control.hidden);
    if (!controls.length) return;
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  $$(".dialog-backdrop").forEach(backdrop => { backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModal(backdrop); }); backdrop.addEventListener("keydown", event => trapFocus(event, backdrop)); });

  function openProjectDialog(trigger) {
    $("#projectOwner").innerHTML = store.state.members.filter(member => member.active).map(member => `<option>${escapeHTML(member.name)}</option>`).join("");
    $("#projectName").value = ""; $("#projectDialogError").textContent = "";
    openModal($("#dialogBackdrop"), trigger, $("#projectName"));
  }
  function createProject() {
    const name = $("#projectName").value.trim(); const error = $("#projectDialogError");
    if (!name) { error.textContent = "Nhập tên dự án để tiếp tục."; $("#projectName").focus(); return; }
    if (store.state.projects.some(project => normalize(project.name) === normalize(name))) { error.textContent = "Tên dự án này đã tồn tại."; $("#projectName").focus(); return; }
    const owner = $("#projectOwner").value || "Chưa phân công";
    const project = { id: store.id("project"), name, type: $("#projectType").value, owner, team: [initials(owner)], status: "progress", progress: 0, updated: "Vừa xong", color: colors[store.state.projects.length % colors.length] };
    store.state.projects.unshift(project); store.addActivity(`Đã tạo dự án ${name}`); closeModal($("#dialogBackdrop"), false); save(`Đã tạo dự án “${name}”.`); setView("projects"); openDrawer(project.id, null);
  }
  function openMemberDialog(trigger) { $("#memberName").value = ""; $("#memberEmail").value = ""; $("#memberDialogError").textContent = ""; openModal($("#memberDialogBackdrop"), trigger, $("#memberName")); }
  function createMember() {
    const name = $("#memberName").value.trim(); const emailInput = $("#memberEmail"); const email = emailInput.value.trim(); const error = $("#memberDialogError");
    if (!name) { error.textContent = "Nhập tên thành viên để tiếp tục."; $("#memberName").focus(); return; }
    if (!email || !emailInput.validity.valid) { error.textContent = "Nhập một địa chỉ email hợp lệ."; emailInput.focus(); return; }
    if (store.state.members.some(member => normalize(member.email) === normalize(email))) { error.textContent = "Email này đã có trong team."; emailInput.focus(); return; }
    const member = { id: store.id("member"), name, email, role: $("#memberRole").value, initials: initials(name), active: true, tasks: 0, color: colors[store.state.members.length % colors.length] };
    store.state.members.push(member); store.addActivity(`Đã thêm ${name} vào team`); closeModal($("#memberDialogBackdrop"), false); save(`Đã thêm ${name} vào team.`);
  }

  const drawer = $("#projectDrawer");
  const drawerScrim = $("#drawerScrim");
  function openDrawer(id, trigger) {
    const project = projectById(id); if (!project) return;
    ui.selectedProjectId = id; overlayReturnFocus = trigger;
    $("#drawerTitle").textContent = project.name; $("#drawerProjectName").value = project.name; $("#drawerProjectType").value = project.type; $("#drawerProjectStatus").value = project.status; $("#drawerProjectProgress").value = project.progress; $("#drawerProgressOutput").textContent = `${project.progress}%`;
    $("#drawerProjectMeta").innerHTML = `<strong>Phụ trách:</strong> ${escapeHTML(project.owner)}<br><strong>Thành viên:</strong> ${escapeHTML(project.team.join(", "))}<br><strong>Cập nhật:</strong> ${escapeHTML(project.updated)}`;
    archiveArmed = false; $("#archiveProjectButton").innerHTML = `${icon("i-archive")}Lưu trữ dự án`;
    dashboardShell.inert = true; drawer.inert = false; drawer.setAttribute("aria-hidden", "false"); drawer.classList.add("is-open"); drawerScrim.classList.add("is-visible"); document.body.classList.add("drawer-open"); requestAnimationFrame(() => $("#drawerProjectName").focus());
  }
  function closeDrawer(restoreFocus = true) { if (!drawer.classList.contains("is-open")) return; drawer.classList.remove("is-open"); drawerScrim.classList.remove("is-visible"); drawer.inert = true; drawer.setAttribute("aria-hidden", "true"); dashboardShell.inert = false; document.body.classList.remove("drawer-open"); ui.selectedProjectId = null; syncSidebarMode(); if (restoreFocus) overlayReturnFocus?.focus(); }
  drawerScrim.addEventListener("click", () => closeDrawer());
  drawer.addEventListener("keydown", event => trapFocus(event, drawer));
  $("#drawerClose").addEventListener("click", () => closeDrawer());
  $("#drawerProjectProgress").addEventListener("input", event => { $("#drawerProgressOutput").textContent = `${event.target.value}%`; });
  $("#projectEditForm").addEventListener("submit", event => {
    event.preventDefault(); const project = projectById(ui.selectedProjectId); if (!project) return;
    const name = $("#drawerProjectName").value.trim();
    if (!name) { $("#drawerProjectName").focus(); showToast("Tên dự án không được để trống."); return; }
    if (store.state.projects.some(item => item.id !== project.id && normalize(item.name) === normalize(name))) { $("#drawerProjectName").focus(); showToast("Tên dự án này đã tồn tại."); return; }
    project.name = name; project.type = $("#drawerProjectType").value; project.status = $("#drawerProjectStatus").value; project.progress = project.status === "done" ? 100 : Number($("#drawerProjectProgress").value); project.updated = "Vừa xong";
    store.addActivity(`Đã cập nhật ${project.name}`); save(`Đã lưu thay đổi cho “${project.name}”.`); closeDrawer();
  });
  $("#archiveProjectButton").addEventListener("click", event => {
    const project = projectById(ui.selectedProjectId); if (!project) return;
    if (!archiveArmed) { archiveArmed = true; event.currentTarget.textContent = "Nhấn lần nữa để xác nhận"; showToast("Dự án và lượt duyệt liên quan sẽ được lưu trữ.", false); return; }
    store.state.projects = store.state.projects.filter(item => item.id !== project.id); store.state.reviews = store.state.reviews.filter(review => review.projectId !== project.id); store.addActivity(`Đã lưu trữ ${project.name}`); closeDrawer(false); save(`Đã lưu trữ “${project.name}”.`);
  });

  function reviewAction(id, action) {
    const review = store.state.reviews.find(item => item.id === id); if (!review || review.status !== "pending") return;
    review.status = action === "approve" ? "approved" : "changes";
    const project = projectById(review.projectId);
    if (project) { project.status = action === "approve" ? "done" : "progress"; project.progress = action === "approve" ? 100 : Math.min(project.progress, 90); project.updated = "Vừa xong"; }
    const verb = action === "approve" ? "Đã phê duyệt" : "Đã yêu cầu chỉnh sửa";
    store.addActivity(`${verb} ${review.title}`); save(`${verb} “${review.title}”.`);
  }
  async function copyToken(id) {
    const item = store.state.library.find(entry => entry.id === id); if (!item) return;
    try { await navigator.clipboard.writeText(item.token); }
    catch { const input = document.createElement("textarea"); input.value = item.token; input.style.position = "fixed"; input.style.opacity = "0"; document.body.append(input); input.select(); document.execCommand("copy"); input.remove(); }
    showToast(`Đã sao chép token “${item.token}”.`, false);
  }

  document.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-view]"); if (viewButton) { event.preventDefault(); setView(viewButton.dataset.view); return; }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "new-project") { openProjectDialog(event.target.closest("button")); return; }
    if (action === "new-member") { openMemberDialog(event.target.closest("button")); return; }
    if (action === "all-projects") { setView("projects"); return; }
    if (action === "all-reviews") { setView("reviews"); return; }
    if (action === "weekly") { showToast("Báo cáo tuần: 31 màn hình đã duyệt, tiến độ đạt 82%.", false); return; }
    if (action === "read-all") { store.state.notificationsRead = true; save("Đã đánh dấu tất cả thông báo là đã đọc."); return; }
    const openProject = event.target.closest("[data-open-project]"); if (openProject) { openDrawer(openProject.dataset.openProject, openProject); return; }
    const goReview = event.target.closest("[data-go-review]"); if (goReview) { setView("reviews"); requestAnimationFrame(() => $("[data-review-id='" + CSS.escape(goReview.dataset.goReview) + "']")?.focus()); return; }
    const reviewButton = event.target.closest("[data-review-action]"); if (reviewButton) { reviewAction(reviewButton.dataset.reviewId, reviewButton.dataset.reviewAction); return; }
    const memberToggle = event.target.closest("[data-member-toggle]");
    if (memberToggle) { const member = store.state.members.find(item => item.id === memberToggle.dataset.memberToggle); if (member) { member.active = !member.active; store.addActivity(`${member.active ? "Đã kích hoạt" : "Đã tạm dừng"} ${member.name}`); save(`${member.name} hiện ${member.active ? "đang hoạt động" : "đã tạm dừng"}.`); } return; }
    const favorite = event.target.closest("[data-library-favorite]");
    if (favorite) { const item = store.state.library.find(entry => entry.id === favorite.dataset.libraryFavorite); if (item) { item.favorite = !item.favorite; save(item.favorite ? `Đã lưu “${item.name}”.` : `Đã bỏ lưu “${item.name}”.`); } return; }
    const copy = event.target.closest("[data-copy-token]"); if (copy) copyToken(copy.dataset.copyToken);
  });

  document.addEventListener("change", event => {
    const roleSelect = event.target.closest("[data-member-role]");
    if (roleSelect) { const member = store.state.members.find(item => item.id === roleSelect.dataset.memberRole); if (member) { member.role = roleSelect.value; store.addActivity(`Đã đổi vai trò của ${member.name} thành ${member.role}`); save(`Đã cập nhật vai trò của ${member.name}.`); } }
  });
  $$("[data-project-filter]").forEach(button => button.addEventListener("click", () => { ui.projectFilter = button.dataset.projectFilter; $$("[data-project-filter]").forEach(item => { const active = item === button; item.classList.toggle("is-selected", active); item.setAttribute("aria-pressed", String(active)); }); renderProjects(); }));
  $$("[data-library-filter]").forEach(button => button.addEventListener("click", () => { ui.libraryFilter = button.dataset.libraryFilter; $$("[data-library-filter]").forEach(item => { const active = item === button; item.classList.toggle("is-selected", active); item.setAttribute("aria-pressed", String(active)); }); renderLibrary(); }));
  $("#statusFilter").addEventListener("change", renderOverview);
  $("#globalSearch").addEventListener("input", () => { if (ui.view === "overview") renderOverview(); if (ui.view === "projects") renderProjects(); if (ui.view === "reviews") renderReviews(); if (ui.view === "members") renderMembers(); if (ui.view === "library") renderLibrary(); });
  $("#settingsForm").addEventListener("change", event => { const field = event.target; if (!field.name) return; store.state.settings[field.name] = field.type === "checkbox" ? field.checked : field.value; store.save(); applySettings(); showToast("Cài đặt đã được lưu trên thiết bị này.", false); });
  $("#resetDemoButton").addEventListener("click", event => {
    if (!resetArmed) { resetArmed = true; event.currentTarget.textContent = "Nhấn lần nữa để khôi phục"; showToast("Thao tác này sẽ thay thế mọi thay đổi demo cục bộ.", false); return; }
    store.reset(); resetArmed = false; event.currentTarget.innerHTML = `${icon("i-archive")}Khôi phục dữ liệu mẫu`; $("#globalSearch").value = ""; renderAll(); showToast("Đã khôi phục dữ liệu Bamboo ban đầu.", false);
  });

  $("#dialogClose").addEventListener("click", () => closeModal($("#dialogBackdrop")));
  $("#dialogCancel").addEventListener("click", () => closeModal($("#dialogBackdrop")));
  $("#dialogCreate").addEventListener("click", createProject);
  $("#memberDialogClose").addEventListener("click", () => closeModal($("#memberDialogBackdrop")));
  $("#memberDialogCancel").addEventListener("click", () => closeModal($("#memberDialogBackdrop")));
  $("#memberDialogCreate").addEventListener("click", createMember);
  $("#logoutButton").addEventListener("click", () => { sessionStorage.removeItem(authKey); window.location.replace("index.html"); });
  window.addEventListener("hashchange", () => setView(window.location.hash.slice(1) || "overview", false));
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); if (!$("#globalSearch").disabled) $("#globalSearch").focus(); }
    if (event.key === "Escape") { if (activeOverlay()) closeModal(); else if (drawer.classList.contains("is-open")) closeDrawer(); else { setSidebar(false); notificationPanel.hidden = true; notificationButton.setAttribute("aria-expanded", "false"); } }
  });
  $$("[data-range]").forEach(button => button.addEventListener("click", () => { ui.range = Number(button.dataset.range); $$("[data-range]").forEach(item => { const active = item === button; item.classList.toggle("is-selected", active); item.setAttribute("aria-pressed", String(active)); }); renderOverview(); showToast(`Đã chuyển dữ liệu sang phạm vi ${button.textContent}.`, false); }));

  const tooltip = $("#chartTooltip");
  $$(".chart-points circle").forEach((point, index) => {
    point.setAttribute("tabindex", "0"); point.setAttribute("role", "button"); point.setAttribute("aria-label", `Tuần ${index + 1}: ${point.dataset.value} màn hình đã duyệt`);
    const show = () => { const rect = $(".progress-chart").getBoundingClientRect(); tooltip.textContent = `${point.dataset.value} màn hình`; tooltip.style.left = `${(Number(point.getAttribute("cx")) / 760) * rect.width}px`; tooltip.style.top = `${(Number(point.getAttribute("cy")) / 250) * rect.height}px`; tooltip.hidden = false; };
    point.addEventListener("mouseenter", show); point.addEventListener("focus", show); point.addEventListener("mouseleave", () => { tooltip.hidden = true; }); point.addEventListener("blur", () => { tooltip.hidden = true; });
  });

  $("#dashboardMain").setAttribute("tabindex", "-1");
  $$("[data-project-filter], [data-library-filter], [data-range]").forEach(button => button.setAttribute("aria-pressed", String(button.classList.contains("is-selected"))));
  renderAll();
  setView(window.location.hash.slice(1) || "overview", false);
})();
