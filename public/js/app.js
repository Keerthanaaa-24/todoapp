const API = "/api/tasks";

let currentTaskId = null;

/* ================= TOAST ================= */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toast-message");

  if (!toast || !msg) return;

  msg.innerText = message;

  toast.className = "toast";
  toast.classList.add("show", type);

  setTimeout(() => {
    hideToast();
  }, 3000);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("show");
}

/* ================= LOAD TASKS ================= */
async function loadTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  try {
    const res = await fetch(API);
    const tasks = await res.json();

    list.innerHTML = "";

    if (tasks.length === 0) {
      list.innerHTML = "<p style='color:#6b7280'>No tasks yet</p>";
      return;
    }

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-card";

      if (task.completed) div.classList.add("completed");

      div.innerHTML = `
        <div class="task-content">
          <h3>${task.title}</h3>
          <p>${task.description || ""}</p>
        </div>

        <div class="task-actions">
          <button class="edit" onclick="goEdit('${task._id}')">✏</button>
          <button class="delete" onclick="deleteTask('${task._id}')">🗑</button>
        </div>
      `;

      list.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

/* ================= NAV ================= */
function goEdit(id) {
  window.location.href = `edit.html?id=${id}`;
}

/* ================= DELETE ================= */
async function deleteTask(id) {
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });

    showToast("Task deleted", "error");
    loadTasks();

  } catch (err) {
    showToast("Delete failed", "error");
  }
}

/* ================= ADD ================= */
const addForm = document.getElementById("taskForm");

if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleInput.value,
          description: descInput.value
        })
      });

      showToast("Task added", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (err) {
      showToast("Add failed", "error");
    }
  });
}

/* ================= LOAD EDIT TASK ================= */
async function loadEditTask() {
  const params = new URLSearchParams(window.location.search);
  currentTaskId = params.get("id");

  if (!currentTaskId) return;

  try {
    const res = await fetch(`${API}/${currentTaskId}`);
    const task = await res.json();

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("completed").checked = task.completed;

  } catch (err) {
    showToast("Failed to load task", "error");
  }
}

/* ================= UPDATE ================= */
const editForm = document.getElementById("editForm");

if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentTaskId) {
      showToast("Task not found", "error");
      return;
    }

    try {
      await fetch(`${API}/${currentTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          completed: document.getElementById("completed").checked
        })
      });

      showToast("Task updated", "update");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

    } catch (err) {
      showToast("Update failed", "error");
    }
  });
}

/* ================= INIT ================= */
loadTasks();
loadEditTask();