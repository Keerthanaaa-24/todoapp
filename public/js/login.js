// Toggle password 👁
const toggle = document.getElementById("togglePassword");
const password = document.getElementById("password");

toggle.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

// Handle login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
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

    // Save token
    localStorage.setItem("token", data.token);

    // Redirect
    window.location.href = "index.html";

  } catch (err) {
    document.getElementById("error").innerText = "Server error";
  }
});