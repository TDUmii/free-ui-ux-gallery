(() => {
  const storageKey = "bamboo-dashboard-state-v2";
  const seed = {
    projects: [
      { id: "pet-care", name: "Pet Care Mobile", type: "Ứng dụng di động", owner: "Minh Anh", team: ["MA", "LA", "+2"], status: "review", progress: 78, updated: "12 phút trước", color: "coral" },
      { id: "finly", name: "Finly Dashboard", type: "Web dashboard", owner: "Quỳnh Thảo", team: ["QT", "HN"], status: "progress", progress: 54, updated: "1 giờ trước", color: "green" },
      { id: "mori", name: "Mori Coffee", type: "Website thương hiệu", owner: "Yến Bình", team: ["YB", "DL", "+1"], status: "done", progress: 100, updated: "Hôm qua", color: "gold" },
      { id: "travel", name: "Travel Buddy", type: "Ứng dụng di động", owner: "Linh Nguyễn", team: ["LN", "AT"], status: "progress", progress: 63, updated: "Hôm qua", color: "blue" },
      { id: "mellow", name: "Mellow Banking", type: "Design system", owner: "Hà Nguyên", team: ["HN", "MA"], status: "review", progress: 86, updated: "2 ngày trước", color: "green" },
      { id: "seedling", name: "Seedling Learn", type: "Web dashboard", owner: "Lan Anh", team: ["LA", "QT"], status: "progress", progress: 41, updated: "3 ngày trước", color: "gold" },
      { id: "nook", name: "Nook Workspace", type: "Website thương hiệu", owner: "Đức Long", team: ["DL", "LN"], status: "done", progress: 100, updated: "4 ngày trước", color: "blue" },
      { id: "sprout", name: "Sprout Commerce", type: "Web dashboard", owner: "An Trần", team: ["AT", "YB"], status: "progress", progress: 35, updated: "5 ngày trước", color: "coral" },
    ],
    reviews: [
      { id: "r-pet", projectId: "pet-care", title: "Pet Care Mobile", scope: "Luồng đặt lịch", screens: 8, author: "Lan Anh", age: "12 phút trước", status: "pending" },
      { id: "r-finly", projectId: "finly", title: "Finly Dashboard", scope: "Biểu đồ doanh thu", screens: 4, author: "Quỳnh Thảo", age: "1 giờ trước", status: "pending" },
      { id: "r-travel", projectId: "travel", title: "Travel Buddy", scope: "Prototype vòng 2", screens: 12, author: "Linh Nguyễn", age: "3 giờ trước", status: "pending" },
      { id: "r-mellow", projectId: "mellow", title: "Mellow Banking", scope: "Token màu sắc", screens: 6, author: "Hà Nguyên", age: "Hôm qua", status: "pending" },
      { id: "r-seed", projectId: "seedling", title: "Seedling Learn", scope: "Luồng onboarding", screens: 5, author: "Lan Anh", age: "Hôm qua", status: "pending" },
    ],
    members: [
      { id: "m-ma", name: "Minh Anh", email: "minhanh@bamboo.demo", role: "Design Lead", initials: "MA", active: true, tasks: 6, color: "coral" },
      { id: "m-qt", name: "Quỳnh Thảo", email: "quynhthao@bamboo.demo", role: "Product Designer", initials: "QT", active: true, tasks: 4, color: "green" },
      { id: "m-la", name: "Lan Anh", email: "lananh@bamboo.demo", role: "UI Designer", initials: "LA", active: true, tasks: 5, color: "gold" },
      { id: "m-ln", name: "Linh Nguyễn", email: "linhnguyen@bamboo.demo", role: "UX Researcher", initials: "LN", active: true, tasks: 3, color: "blue" },
      { id: "m-hn", name: "Hà Nguyên", email: "hanguyen@bamboo.demo", role: "Product Designer", initials: "HN", active: false, tasks: 2, color: "green" },
      { id: "m-dl", name: "Đức Long", email: "duclong@bamboo.demo", role: "UI Designer", initials: "DL", active: true, tasks: 3, color: "coral" },
    ],
    library: [
      { id: "ui-input", name: "Field & Input", category: "Form", description: "Input, textarea và validation states.", token: "--control-height: 48px", uses: 12, favorite: true },
      { id: "ui-auth", name: "Auth Card", category: "Form", description: "Khung đăng nhập với lỗi và loading.", token: "--auth-radius: 16px", uses: 4, favorite: false },
      { id: "ui-sidebar", name: "App Sidebar", category: "Navigation", description: "Sidebar desktop và drawer mobile.", token: "--sidebar-width: 264px", uses: 8, favorite: true },
      { id: "ui-tabs", name: "Segmented Tabs", category: "Navigation", description: "Bộ lọc nhỏ gọn với trạng thái chọn.", token: "--tab-height: 34px", uses: 7, favorite: false },
      { id: "ui-toast", name: "Status Toast", category: "Feedback", description: "Phản hồi nhẹ, không chiếm focus.", token: "--toast-time: 2600ms", uses: 10, favorite: true },
      { id: "ui-empty", name: "Empty State", category: "Feedback", description: "Trạng thái trống có hướng hành động.", token: "--empty-space: 40px", uses: 5, favorite: false },
      { id: "ui-table", name: "Project Table", category: "Data", description: "Bảng responsive với trạng thái rõ ràng.", token: "--table-row: 66px", uses: 6, favorite: false },
      { id: "ui-metric", name: "Metric Strip", category: "Data", description: "Dãy KPI ưu tiên khả năng quét nhanh.", token: "--metric-gap: 24px", uses: 9, favorite: true },
    ],
    activity: [
      { id: "a-1", text: "Lan Anh gửi Pet Care Mobile để duyệt", time: "12 phút trước" },
      { id: "a-2", text: "Mori Coffee đã hoàn thành", time: "Hôm qua" },
    ],
    settings: { density: "comfortable", reviewNotifications: true, weeklyReport: true, soundFeedback: false },
    notificationsRead: false,
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || !Array.isArray(saved.projects) || !Array.isArray(saved.reviews)) return clone(seed);
      return { ...clone(seed), ...saved, settings: { ...seed.settings, ...(saved.settings || {}) } };
    } catch {
      return clone(seed);
    }
  }

  const store = {
    state: load(),
    save() { localStorage.setItem(storageKey, JSON.stringify(this.state)); },
    reset() { this.state = clone(seed); this.save(); return this.state; },
    id(prefix) { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`; },
    addActivity(text) { this.state.activity.unshift({ id: this.id("activity"), text, time: "Vừa xong" }); this.state.activity = this.state.activity.slice(0, 12); },
  };
  window.BambooDashboardStore = store;
})();
