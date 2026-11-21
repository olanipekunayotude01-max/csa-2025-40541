const staff = requireAuth("staff");
document.getElementById("who").textContent = staff.name + " · " + staff.role;

const stuSelect = document.getElementById("stu");
stuSelect.innerHTML = USERS.student.map(s => `<option value="${s.id}">${esc(s.name)} (${s.id})</option>`).join("");

function nameOf(id) { const s = USERS.student.find(u => u.id === id); return s ? s.name : id; }

function renderScores() {
  const scores = load("abd_scores", []);
  document.getElementById("scores").innerHTML = scores.length
    ? scores.map((r, i) => `<tr><td>${esc(nameOf(r.studentId))}</td><td>${esc(r.subject)}</td><td>${r.score}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeScore(${i})">Delete</button></td></tr>`).join("")
    : '<tr><td colspan="4" class="empty">No scores recorded yet.</td></tr>';
}

function removeScore(i) {
  const scores = load("abd_scores", []);
  scores.splice(i, 1); save("abd_scores", scores); renderScores();
}

document.getElementById("scoreForm").addEventListener("submit", e => {
  e.preventDefault();
  const scores = load("abd_scores", []);
  scores.push({ studentId: stuSelect.value, subject: document.getElementById("subject").value.trim(), score: Number(document.getElementById("score").value) });
  save("abd_scores", scores); renderScores(); e.target.reset();
});

document.getElementById("annForm").addEventListener("submit", e => {
  e.preventDefault();
  const list = load("abd_announcements", []);
  list.unshift({ title: document.getElementById("annTitle").value.trim(), body: document.getElementById("annBody").value.trim(), date: new Date().toISOString().slice(0, 10) });
  save("abd_announcements", list); renderAnnouncements(document.getElementById("announcements")); e.target.reset();
});

renderScores();
renderAnnouncements(document.getElementById("announcements"));
