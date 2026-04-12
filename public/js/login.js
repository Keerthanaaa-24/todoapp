// public/js/login.js

const toggle = document.getElementById("togglePassword");
const password = document.getElementById("password");

// SHOW/HIDE PASSWORD
toggle.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("error").innerText = data.message;
      return;
    }

    localStorage.setItem("token", data.token);

    window.location.href = "index.html";

  } catch (err) {
    document.getElementById("error").innerText = "Server error";
  }
});