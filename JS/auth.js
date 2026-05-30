// auth.js — Wanderlust auth with DB integration

const tabs = document.querySelectorAll(".auth-tab");
const forms = document.querySelectorAll(".auth-form");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    forms.forEach(f => f.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// Check URL param for default tab
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("mode") === "signup") {
  tabs.forEach(t => t.classList.remove("active"));
  forms.forEach(f => f.classList.remove("active"));
  document.querySelector('[data-target="signup-form"]').classList.add("active");
  document.getElementById("signup-form").classList.add("active");
}

function showMsg(formId, msg, isError = true) {
  let el = document.getElementById(formId + '-msg');
  if (!el) {
    el = document.createElement('p');
    el.id = formId + '-msg';
    el.style.cssText = `font-size:0.82rem;margin-top:10px;padding:10px 14px;border-radius:4px;`;
    document.getElementById(formId).appendChild(el);
  }
  el.textContent = msg;
  el.style.background = isError ? 'rgba(184,92,56,0.08)' : 'rgba(60,160,80,0.08)';
  el.style.color = isError ? 'var(--accent)' : '#2a7a3b';
  el.style.border = isError ? '1px solid rgba(184,92,56,0.2)' : '1px solid rgba(60,160,80,0.2)';
}

// Sign In
document.querySelector('#signin-form .auth-submit').addEventListener('click', () => {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  if (!email || !password) return showMsg('signin-form', 'Please fill in all fields.');
  const result = DB.loginUser({ email, password });
  if (!result.ok) return showMsg('signin-form', result.msg);
  showMsg('signin-form', 'Welcome back, ' + result.user.name + '! Redirecting…', false);
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
});

// Sign Up
document.querySelector('#signup-form .auth-submit').addEventListener('click', () => {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  if (!name || !email || !password || !confirm) return showMsg('signup-form', 'Please fill in all fields.');
  if (password.length < 6) return showMsg('signup-form', 'Password must be at least 6 characters.');
  if (password !== confirm) return showMsg('signup-form', 'Passwords do not match.');
  const result = DB.registerUser({ name, email, password });
  if (!result.ok) return showMsg('signup-form', result.msg);
  showMsg('signup-form', 'Account created! Redirecting…', false);
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
});