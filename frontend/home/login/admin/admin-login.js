/* ============================================================
   CITIZEN CONNECT — Admin Login Logic
   Admin accounts are system-created. No self-registration.
   ============================================================ */

'use strict';

// ================================================================
// API CONFIGURATION
// ================================================================
const API_BASE = 'http://localhost:5079/api/auth';

// ================================================================
// ERROR HELPERS
// ================================================================
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('visible');
}

// ================================================================
// LOGIN CAPTCHA
// ================================================================
let _captchaValue = '';

function generateCaptcha() {
  const canvas = document.getElementById('captchaCanvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = Math.round(rect.width  || 180) * dpr;
  canvas.height = Math.round(rect.height || 48)  * dpr;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  } while (code === _captchaValue);
  _captchaValue = code;

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.scale(dpr, dpr);
  const W2 = W / dpr, H2 = H / dpr;

  ctx.clearRect(0, 0, W2, H2);
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0, 0, W2, H2);

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(194,24,7,' + (0.08 + Math.random() * 0.12) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * W2, Math.random() * H2);
    ctx.lineTo(Math.random() * W2, Math.random() * H2);
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = 'rgba(0,0,0,' + (0.05 + Math.random() * 0.1) + ')';
    ctx.beginPath();
    ctx.arc(Math.random() * W2, Math.random() * H2, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const fonts  = ['bold 22px Inter', 'bold 20px Segoe UI', 'bold 21px Arial'];
  const colors = ['#C21807', '#1F1F1F', '#9B1405', '#4A4A4A'];
  const charW  = W2 / code.length;

  for (let i = 0; i < code.length; i++) {
    ctx.save();
    ctx.translate(charW * i + charW / 2, H2 / 2 + 4);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font         = fonts[Math.floor(Math.random() * fonts.length)];
    ctx.fillStyle    = colors[Math.floor(Math.random() * colors.length)];
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  const inp = document.getElementById('captchaInput');
  if (inp) inp.value = '';
}

function validateCaptcha(userInput) {
  return userInput.trim() === _captchaValue;
}

// Generate captcha on load
(function () {
  function init() {
    requestAnimationFrame(function () {
      requestAnimationFrame(generateCaptcha);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ================================================================
// LOGIN LOADING STATE
// ================================================================
function setLoginLoading(isLoading) {
  const btn = document.querySelector('#loginForm button[type="submit"]');
  if (!btn) return;
  if (isLoading) {
    btn.disabled      = true;
    btn.textContent   = 'Logging in…';
    btn.style.opacity = '0.75';
    btn.style.cursor  = 'not-allowed';
  } else {
    btn.disabled      = false;
    btn.textContent   = 'Login to Portal';
    btn.style.opacity = '';
    btn.style.cursor  = '';
  }
}

// ================================================================
// LOGIN FORM SUBMIT
// ================================================================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearError('loginError');

  const email        = document.getElementById('loginEmail').value.trim();
  const password     = document.getElementById('loginPassword').value;
  const captchaInput = document.getElementById('captchaInput').value.trim();

  if (!email) {
    showError('loginError', 'Please enter your Email Address or Mobile Number.');
    return;
  }
  if (!String(password).trim()) {
    showError('loginError', 'Please enter your password.');
    return;
  }
  if (!captchaInput) {
    showError('loginError', 'Please enter the captcha code shown above.');
    generateCaptcha();
    return;
  }
  if (!validateCaptcha(captchaInput)) {
    showError('loginError', 'Invalid captcha. Please try again.');
    generateCaptcha();
    return;
  }

  setLoginLoading(true);

  try {
    const response = await fetch(API_BASE + '/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ emailOrMobile: email, password: password, captcha: captchaInput })
    });

    let data;
    try { data = await response.json(); }
    catch (_) { throw new Error('Server returned an unexpected response. Please try again.'); }

    if (!response.ok || !data.success) {
      showError('loginError', data.message || 'Login failed. Please check your credentials.');
      generateCaptcha();
      return;
    }

    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role',   data.role);
    window.location.href = '../../../admin/admin-dashboard.html';

  } catch (err) {
    showError('loginError', err.message || 'Unable to connect to the server. Please check your connection and try again.');
    generateCaptcha();
  } finally {
    setLoginLoading(false);
  }
});

// ================================================================
// PASSWORD TOGGLE
// ================================================================
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁';
  }
}
