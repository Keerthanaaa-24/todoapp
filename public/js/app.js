const API = "http://localhost:5000/api/tasks";

let allTasks = [];
const token = localStorage.getItem("token");

// 🔐 Redirect if not logged in
if (!token && window.location.pathname.includes("index.html")) {
  window.location.href = "login.html";
}

// ================= LOAD TASKS =================
async function loadTasks() {
  try {
    const res = await fetch(API, {
      headers: { "Authorization": token }
    });

    const data = await res.json();
    allTasks = data.data || [];
    displayTasks(allTasks);

  } catch (err) {
    console.error("Load error:", err);
  }
}

// ================= DISPLAY =================
function displayTasks(tasks) {
  const list = document.getElementById("task-list");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";

    const days = getRemainingDays(task.dueDate);

    // 🎨 STATUS COLORS
    if (task.completed) {
      div.classList.add("done");
    } else if (days < 0) {
      div.classList.add("overdue");
    } else {
      div.classList.add("remaining");
    }

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ""}</p>
      <p>Priority: ${task.priority}</p>
      <p>${formatDue(task.dueDate)}</p>

      <button onclick="toggleComplete('${task._id}', ${task.completed})">
        ${task.completed ? "Undo" : "Done"}
      </button>

      <button onclick="editTask('${task._id}')">Edit</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;

    list.appendChild(div);
  });

  updateStats(tasks);
}

// ================= SEARCH =================
const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = allTasks.filter(task =>
      task.title.toLowerCase().includes(value) ||
      (task.description && task.description.toLowerCase().includes(value))
    );

    displayTasks(filtered);
  });
}

// ================= ADD TASK =================
const form = document.getElementById("taskForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value,
      pinned: document.getElementById("pinned")?.checked || false
    };

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(task)
      });

      window.location.href = "index.html";

    } catch (err) {
      console.error("Add error:", err);
    }
  });
}

// ================= DELETE =================
async function deleteTask(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": token }
    });

    loadTasks();

  } catch (err) {
    console.error("Delete error:", err);
  }
}

// ================= COMPLETE =================
async function toggleComplete(id, status) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ completed: !status })
    });

    loadTasks();

  } catch (err) {
    console.error("Update error:", err);
  }
}

// ================= EDIT =================
function editTask(id) {
  window.location.href = `edit.html?id=${id}`;
}

// ================= EDIT LOAD =================
const editForm = document.getElementById("editForm");

if (editForm) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`${API}/${id}`, {
    headers: { "Authorization": token }
  })
    .then(res => res.json())
    .then(data => {
      const t = data.data;

      document.getElementById("title").value = t.title;
      document.getElementById("description").value = t.description;
      document.getElementById("priority").value = t.priority;
      document.getElementById("dueDate").value = t.dueDate?.split("T")[0];
      document.getElementById("pinned").checked = t.pinned;
      document.getElementById("completed").checked = t.completed;
    });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value,
      pinned: document.getElementById("pinned").checked,
      completed: document.getElementById("completed").checked
    };

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(updated)
    });

    window.location.href = "index.html";
  });
}

// ================= HELPERS =================
function getRemainingDays(date) {
  if (!date) return 0;
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
}

function formatDue(date) {
  if (!date) return "No due date";
  const d = getRemainingDays(date);
  return d >= 0 ? `${d} days left` : `Overdue by ${Math.abs(d)} days`;
}

function updateStats(tasks) {
  const statsDiv = document.getElementById("stats");
  if (!statsDiv) return;

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => getRemainingDays(t.dueDate) < 0).length;

  statsDiv.innerHTML = `
    <p>Total: ${total} | Done: ${done} | Overdue: ${overdue}</p>
  `;
}

// ================= INIT =================
loadTasks();