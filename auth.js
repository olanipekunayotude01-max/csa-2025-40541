// Demo data only. Real systems must check passwords on a server, never in browser code.
const USERS = {
  student: [
    { id: "STU001", password: "student123", name: "Ayo Bello", cls: "SS2 A" },
    { id: "STU002", password: "student123", name: "Zainab Musa", cls: "SS2 A" }
  ],
  staff: [
    { id: "STF001", password: "staff123", name: "Mrs. Fatima Yusuf", role: "Mathematics Teacher" }
  ]
};

function setupLogin(role) {
  if (getSession(role)) { location.href = role + "-dashboard.html"; return; }
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("userId").value.trim().toUpperCase();
    const pw = document.getElementById("password").value;
    const user = USERS[role].find(u => u.id === id && u.password === pw);
    if (!user) { document.getElementById("error").textContent = "Invalid ID or password."; return; }
    sessionStorage.setItem("abd_" + role, JSON.stringify(user));
    location.href = role + "-dashboard.html";
  });
}

function getSession(role) {
  try { return JSON.parse(sessionStorage.getItem("abd_" + role)); } catch { return null; }
}

function requireAuth(role) {
  const user = getSession(role);
  if (!user) { location.href = role + "-login.html"; }
  return user;
}

function logout(role) {
  sessionStorage.removeItem("abd_" + role);
  location.href = role + "-login.html";
}

// Shared storage helpers (staff writes, students read)
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

function renderAnnouncements(el) {
  const list = load("abd_announcements", [
    { title: "Welcome back!", body: "Second term resumes on Monday. Be punctual.", date: "2026-11-16" }
  ]);
  el.innerHTML = list.length
    ? list.map(a => `<div class="ann"><b>${esc(a.title)}</b><br>${esc(a.body)}<br><small>${esc(a.date)}</small></div>`).join("")
    : '<p class="empty">No announcements.</p>';
}
