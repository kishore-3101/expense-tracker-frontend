const BASE = "https://expense-tracker-vgy9.onrender.com";

if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

function switchTab(tab) {
    const isLogin = tab === "login";

    document.getElementById("loginForm").style.display    = isLogin ? "flex" : "none";
    document.getElementById("registerForm").style.display = isLogin ? "none" : "flex";

    document.getElementById("loginTab").classList.toggle("active", isLogin);
    document.getElementById("registerTab").classList.toggle("active", !isLogin);

    document.getElementById("authTitle").textContent = isLogin ? "Sign In" : "Create Account";

    document.getElementById("authSwitch").innerHTML = isLogin
        ? `Don't have an account? <a onclick="switchTab('register')">Register</a>`
        : `Already have an account? <a onclick="switchTab('login')">Sign In</a>`;
}

// ── Login ──
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const msg = document.getElementById("loginMsg");
    msg.textContent = "Signing in...";
    msg.className = "auth-msg";

    try {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email:    document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = "Invalid email or password.";
            msg.className = "auth-msg error";
            return;
        }

        localStorage.setItem("token", data.token);
        window.location.href = "index.html";

    } catch (err) {
        msg.textContent = "Server error. Try again.";
        msg.className = "auth-msg error";
    }
});

// ── Register ──
document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const msg = document.getElementById("registerMsg");

    const password  = document.getElementById("registerPassword").value;
    const password2 = document.getElementById("registerPassword2").value;

    if (password !== password2) {
        msg.textContent = "Passwords do not match.";
        msg.className = "auth-msg error";
        return;
    }

    msg.textContent = "Creating account...";
    msg.className = "auth-msg";

    try {
        const res = await fetch(`${BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name:     document.getElementById("registerName").value,
                email:    document.getElementById("registerEmail").value,
                password: password
            })
        });

        const text = await res.text();

        if (!res.ok) {
            msg.textContent = text || "Registration failed.";
            msg.className = "auth-msg error";
            return;
        }

        msg.textContent = "Account created! Please sign in.";
        msg.className = "auth-msg success";
        setTimeout(() => switchTab("login"), 1200);

    } catch (err) {
        msg.textContent = "Server error. Try again.";
        msg.className = "auth-msg error";
    }
});