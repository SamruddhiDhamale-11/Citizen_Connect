/* ============================================================
   CITIZEN CONNECT — Role-Based Application Logic
   Roles: Citizen | Politician | Admin (login only)
   ============================================================ */

'use strict';

// ---- State ----
let currentStep = 1;
let currentRole = ''; // 'citizen' | 'politician'

// ---- Step label maps per role ----
const STEP_LABELS = {
  citizen:    ['Name & Location', 'Personal Details', 'Security'],
  politician: ['Personal', 'Political', 'Verify'],
};

// ================================================================
// LOGIN — Role change handler
// ================================================================
function onLoginRoleChange() {
  const role = document.getElementById('loginRole').value;
  const adminNotice = document.getElementById('adminNotice');
  const registerLink = document.getElementById('registerLink');

  if (role === 'admin') {
    adminNotice.classList.remove('hidden');
    registerLink.classList.add('hidden');
  } else {
    adminNotice.classList.add('hidden');
    registerLink.classList.remove('hidden');
  }
}

// ================================================================
// VIEW SWITCHERS
// ================================================================
function showRegister() {
  // Must have a non-admin role selected on the login page first
  const loginRole = document.getElementById('loginRole').value;
  if (!loginRole) {
    showError('loginError', 'Please select a role before registering.');
    return;
  }
  if (loginRole === 'admin') {
    showError('loginError', 'Admin accounts cannot self-register.');
    return;
  }

  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('registerCard').classList.remove('hidden');
  document.getElementById('successCard').classList.add('hidden');

  // Carry the role over from login
  currentRole = loginRole;
  document.getElementById('regRole').value = loginRole;

  // Show the locked role banner, hide the dropdown
  const bannerIcon = { citizen: '👤', politician: '🏛️' };
  const bannerName = { citizen: 'Citizen', politician: 'Politician' };
  document.getElementById('roleBannerIcon').textContent = bannerIcon[loginRole] || '👤';
  document.getElementById('roleBannerName').textContent = bannerName[loginRole] || loginRole;
  document.getElementById('roleBanner').classList.remove('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');

  // Update step labels and show step 1
  if (STEP_LABELS[loginRole]) {
    STEP_LABELS[loginRole].forEach((label, i) => {
      const el = document.getElementById('stepLabel' + (i + 1));
      if (el) el.textContent = label;
    });
  }
  currentStep = 1;
  resetRegisterFormFields();
  showStepPanel(1);
  updateStepIndicator(1);
}

function showLogin() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('successCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
  // Reset banner state for next time
  document.getElementById('roleBanner').classList.add('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');
  currentRole = '';
}

function showSuccess() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('loginCard').classList.add('hidden');
  const card = document.getElementById('successCard');
  card.classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('progressBar').style.width = '100%';
  }, 100);

  setTimeout(() => {
    alert('Redirecting to dashboard... (Demo: no backend connected)');
    showLogin();
  }, 4600);
}

// ================================================================
// REGISTER — Role change handler
// Switches which step panels are visible and resets to step 1
// ================================================================
function onRoleChange() {
  const role = document.getElementById('regRole').value;
  currentRole = role;

  // Hide all step panels
  hideAllStepPanels();

  if (!role) {
    updateStepIndicator(1);
    return;
  }

  // Update step labels for the selected role
  if (STEP_LABELS[role]) {
    STEP_LABELS[role].forEach((label, i) => {
      const el = document.getElementById('stepLabel' + (i + 1));
      if (el) el.textContent = label;
    });
  }

  // Show step 1 for the selected role
  currentStep = 1;
  showStepPanel(1);
  updateStepIndicator(1);

  // Clear all errors
  ['step1Error-citizen', 'step1Error-politician',
   'step2Error-citizen', 'step2Error-politician',
   'step3Error-citizen', 'step3Error-politician'].forEach(id => clearError(id));
}

// ================================================================
// STEP PANEL HELPERS
// ================================================================
function hideAllStepPanels() {
  const panels = document.querySelectorAll('.step-panel');
  panels.forEach(p => p.classList.add('hidden'));
}

function showStepPanel(step) {
  if (!currentRole) return;
  const panelId = 'step' + step + '-' + currentRole;
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('hidden');
    // Re-trigger animation
    panel.style.animation = 'none';
    panel.offsetHeight; // reflow
    panel.style.animation = '';
  }
}

// ================================================================
// STEP NAVIGATION
// ================================================================
function nextStep(from) {
  if (!currentRole) {
    showError('step' + from + 'Error', 'Please select a role before proceeding.');
    return;
  }
  if (!validateStep(from)) return;

  const next = from + 1;
  hideAllStepPanels();
  showStepPanel(next);
  currentStep = next;
  updateStepIndicator(next);

  // Generate a fresh captcha whenever step 3 becomes visible
  if (next === 3) {
    generateRegCaptcha();
  }

  // Scroll card into view smoothly
  document.getElementById('registerCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(from) {
  const prev = from - 1;
  hideAllStepPanels();
  showStepPanel(prev);
  currentStep = prev;
  updateStepIndicator(prev);
  document.getElementById('registerCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStepIndicator(active) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById('stepDot' + i);
    dot.classList.remove('active', 'completed', 'inactive');
    if (i < active)       dot.classList.add('completed');
    else if (i === active) dot.classList.add('active');
    else                   dot.classList.add('inactive');
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('stepLine' + i);
    i < active ? line.classList.add('completed') : line.classList.remove('completed');
  }
}

// ================================================================
// WHATSAPP — sync from mobile when checkbox is checked
// ================================================================
function syncWhatsApp(checkbox) {
  const whatsapp = document.getElementById('c-whatsapp');
  const mobile   = document.getElementById('c-mobile');
  if (!whatsapp || !mobile) return;
  if (checkbox.checked) {
    whatsapp.value    = mobile.value;
    whatsapp.readOnly = true;
    whatsapp.style.background = '#F5F5F5';
    whatsapp.style.color      = '#7A7A7A';
    // Keep in sync if mobile changes while checkbox is ticked
    mobile._whatsappSync = function () {
      whatsapp.value = mobile.value;
    };
    mobile.addEventListener('input', mobile._whatsappSync);
  } else {
    whatsapp.readOnly = false;
    whatsapp.style.background = '';
    whatsapp.style.color      = '';
    if (mobile._whatsappSync) {
      mobile.removeEventListener('input', mobile._whatsappSync);
      delete mobile._whatsappSync;
    }
  }
}
function toggleOtherInput(radio) {
  const group = document.getElementById('otherResidentGroup');
  if (radio.value === 'other' && radio.checked) {
    group.classList.remove('hidden');
  } else {
    group.classList.add('hidden');
  }
}

// Also hide when another radio is selected
document.addEventListener('change', function (e) {
  if (e.target.name === 'residentType' && e.target.value !== 'other') {
    document.getElementById('otherResidentGroup').classList.add('hidden');
    document.getElementById('c-otherResident').value = '';
  }
});

// ================================================================
// VALIDATION
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

// Returns the correct error element ID for the current role + step
function errId(step) {
  return 'step' + step + 'Error-' + (currentRole || 'citizen');
}

/* Show a validation error in the UI and simultaneously speak it —
   both in the user's selected assistant language when one is active.
   voiceKey  — key into VALIDATION_MSGS in voice-guide.js.
   englishMsg — fallback text used when voice guide is not loaded.

   Logic:
   • If a non-English language is active (voiceGetLang returns hi/mr),
     the visible error text AND the spoken message are both localised.
   • If English is active (or guide was never started), the visible
     error text stays English and no voice is spoken (guide inactive). */
function showErrorWithVoice(id, englishMsg, voiceKey) {
  const lang   = (typeof window.voiceGetLang === 'function') ? window.voiceGetLang() : 'english';
  const hasKey = voiceKey && (typeof window.voiceValidationMsg === 'function');

  /* Determine the display text — localised when a non-English lang is set */
  const displayMsg = (hasKey && lang !== 'english')
    ? window.voiceValidationMsg(voiceKey)
    : englishMsg;

  showError(id, displayMsg);

  /* Speak the same localised message if the guide is active */
  if (typeof window.voiceWarn === 'function') {
    const spokenMsg = hasKey ? window.voiceValidationMsg(voiceKey) : englishMsg;
    window.voiceWarn(spokenMsg);
  }
}

function validateStep(step) {
  clearError(errId(step));

  // ---- STEP 1 ----
  if (step === 1) {
    if (currentRole === 'citizen') {
      const firstName    = document.getElementById('c-firstName').value.trim();
      const lastName     = document.getElementById('c-lastName').value.trim();
      const wardConfirm  = document.querySelector('input[name="wardConfirm"]:checked');
      const residentType = document.querySelector('input[name="residentType"]:checked');

      if (!firstName || !lastName) {
        showErrorWithVoice(errId(1), 'Please enter your First Name and Last Name.', 'err-name-required');
        return false;
      }
      if (!wardConfirm) {
        showErrorWithVoice(errId(1), 'Please confirm whether you belong to this ward.', 'err-ward-required');
        return false;
      }
      if (!residentType) {
        showErrorWithVoice(errId(1), 'Please select your residency type.', 'err-resident-required');
        return false;
      }
      if (residentType.value === 'other') {
        const otherText = document.getElementById('c-otherResident').value.trim();
        if (!otherText) {
          showErrorWithVoice(errId(1), 'Please specify your residency type.', 'err-resident-other');
          return false;
        }
      }
      // Voter registration question
      const isVoter = document.querySelector('input[name="isVoter"]:checked');
      if (!isVoter) {
        showErrorWithVoice(errId(1), 'Please indicate whether you are a registered voter.', 'err-voter-required');
        return false;
      }
    }

    if (currentRole === 'politician') {
      const firstName = document.getElementById('p-firstName').value.trim();
      const lastName  = document.getElementById('p-lastName').value.trim();
      const ageVal    = document.getElementById('p-age').value.trim();
      const age       = parseInt(ageVal, 10);
      const gender    = document.getElementById('p-gender').value;
      const mobile    = document.getElementById('p-mobile').value.trim();
      const email     = document.getElementById('p-email').value.trim();
      const address   = document.getElementById('p-address').value.trim();

      if (!firstName || !lastName || !ageVal || !gender || !mobile || !email || !address) {
        showErrorWithVoice(errId(1), 'Please fill all required fields before proceeding.', 'err-fields-required');
        return false;
      }
      if (isNaN(age) || age < 25) {
        showErrorWithVoice(errId(1), 'Age must be at least 25 years to register as a Politician.', 'err-age-invalid');
        return false;
      }
      if (!/^\d{10}$/.test(mobile)) {
        showErrorWithVoice(errId(1), 'Mobile number must be exactly 10 digits.', 'err-mobile-invalid');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErrorWithVoice(errId(1), 'Please enter a valid email address.', 'err-email-invalid');
        return false;
      }
    }

    return true;
  }

  // ---- STEP 2 ----
  if (step === 2) {
    if (currentRole === 'citizen') {
      const dob      = document.getElementById('c-dob').value;
      const gender   = document.getElementById('c-gender').value;
      const mobile   = document.getElementById('c-mobile').value.trim();
      const whatsapp = document.getElementById('c-whatsapp').value.trim();
      const email    = document.getElementById('c-email').value.trim();

      if (!dob || !gender || !mobile || !email) {
        showErrorWithVoice(errId(2), 'Please fill all required fields before proceeding.', 'err-fields-required');
        return false;
      }
      // DOB must be strictly before today
      if (dob) {
        const today   = new Date();
        today.setHours(0, 0, 0, 0);
        const dobDate = new Date(dob);
        if (dobDate >= today) {
          showErrorWithVoice(errId(2), 'Date of Birth must be earlier than today\'s date.', 'err-dob-invalid');
          return false;
        }
      }
      if (!/^\d{10}$/.test(mobile)) {
        showErrorWithVoice(errId(2), 'Mobile number must be exactly 10 digits.', 'err-mobile-invalid');
        return false;
      }
      // WhatsApp is optional but if filled must be 10 digits
      if (whatsapp && !/^\d{10}$/.test(whatsapp)) {
        showErrorWithVoice(errId(2), 'WhatsApp number must be exactly 10 digits.', 'err-whatsapp-invalid');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErrorWithVoice(errId(2), 'Please enter a valid email address.', 'err-email-invalid');
        return false;
      }
    }

    if (currentRole === 'politician') {
      const jurisdiction = document.getElementById('p-jurisdiction').value;
      const wardNumber   = document.getElementById('p-wardNumber').value.trim();
      const wardName     = document.getElementById('p-wardName').value.trim();
      const position     = document.getElementById('p-position').value;

      if (!jurisdiction || !wardNumber || !wardName || !position) {
        showErrorWithVoice(errId(2), 'Please fill all required fields before proceeding.', 'err-fields-required');
        return false;
      }
    }

    return true;
  }

  return true;
}

// ================================================================
// SUBMIT REGISTRATION
// ================================================================
function submitRegistration() {
  const e3 = errId(3);
  clearError(e3);

  if (!currentRole) {
    showErrorWithVoice(e3, 'Please select a role before registering.', 'err-fields-required');
    return;
  }

  const pwdId     = currentRole === 'citizen' ? 'c-password'        : 'p-password';
  const confirmId = currentRole === 'citizen' ? 'c-confirmPassword' : 'p-confirmPassword';
  const termsId   = currentRole === 'citizen' ? 'c-acceptTerms'     : 'p-acceptTerms';

  const password = document.getElementById(pwdId).value;
  const confirm  = document.getElementById(confirmId).value;
  const terms    = document.getElementById(termsId).checked;

  if (!password || !confirm) {
    showErrorWithVoice(e3, 'Please fill all required fields before proceeding.', 'err-password-required');
    return;
  }
  if (password.length < 6) {
    showErrorWithVoice(e3, 'Password must be at least 6 characters long.', 'err-password-short');
    return;
  }
  if (password !== confirm) {
    showErrorWithVoice(e3, 'Passwords do not match. Please re-enter.', 'err-password-mismatch');
    return;
  }

  // Politician: ID proof required
  if (currentRole === 'politician') {
    const idProof = document.getElementById('p-idProof');
    if (!idProof.files || idProof.files.length === 0) {
      showErrorWithVoice(e3, 'Please upload your ID proof document.', 'err-idproof-required');
      return;
    }
    const file = idProof.files[0];
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      showErrorWithVoice(e3, 'Invalid file type. Please upload a PDF, JPG, or PNG.', 'err-idproof-type');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showErrorWithVoice(e3, 'File size must not exceed 5 MB.', 'err-idproof-size');
      return;
    }
  }

  if (!terms) {
    showErrorWithVoice(e3, 'You must accept the Terms & Conditions to register.', 'err-terms-required');
    return;
  }

  // ---- Registration CAPTCHA check ----
  const { inputId: regCaptchaInputId } = _getRegCaptchaIds();
  const regCaptchaInput = document.getElementById(regCaptchaInputId);
  const regCaptchaVal   = regCaptchaInput ? regCaptchaInput.value.trim() : '';

  if (!regCaptchaVal) {
    showErrorWithVoice(e3, 'Please enter the captcha code to complete registration.', 'err-captcha-required');
    generateRegCaptcha();
    return;
  }
  if (!validateRegCaptcha(regCaptchaVal)) {
    showErrorWithVoice(e3, 'Invalid captcha. Please try again.', 'err-captcha-invalid');
    generateRegCaptcha();
    return;
  }

  // Refresh captcha after successful registration (for next use)
  generateRegCaptcha();

  showSuccess();
}

// ================================================================
// DOB — set max date to yesterday on page load (no future/today dates)
// ================================================================
(function setDobMaxDate() {
  function applyMax() {
    const dobInput = document.getElementById('c-dob');
    if (!dobInput) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm   = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd   = String(yesterday.getDate()).padStart(2, '0');
    dobInput.max = yyyy + '-' + mm + '-' + dd;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMax);
  } else {
    applyMax();
  }
})();
// ================================================================

let _captchaValue = '';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  // Ensure new code is always different from the last one
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (code === _captchaValue);
  _captchaValue = code;

  const canvas = document.getElementById('captchaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0, 0, W, H);

  // Noise lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(194,24,7,' + (0.08 + Math.random() * 0.12) + ')';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * W, Math.random() * H);
    ctx.lineTo(Math.random() * W, Math.random() * H);
    ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = 'rgba(0,0,0,' + (0.05 + Math.random() * 0.1) + ')';
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw each character with slight rotation and offset
  const fonts = ['bold 22px Inter', 'bold 20px Segoe UI', 'bold 21px Arial'];
  const colors = ['#C21807', '#1F1F1F', '#9B1405', '#4A4A4A'];
  const charW = W / code.length;

  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const x = charW * i + charW / 2;
    const y = H / 2 + 4;
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font      = fonts[Math.floor(Math.random() * fonts.length)];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  // Clear the input when captcha refreshes
  const inp = document.getElementById('captchaInput');
  if (inp) inp.value = '';
}

function validateCaptcha(userInput) {
  return userInput.trim().toLowerCase() === _captchaValue.toLowerCase();
}

// ================================================================
// REGISTRATION CAPTCHA — separate value so login captcha is unaffected
// Politician step 3 uses its own canvas/input IDs (regCaptchaCanvasP /
// regCaptchaInputP) to avoid duplicate-ID conflicts with citizen step 3.
// ================================================================
let _regCaptchaValue = '';

function _getRegCaptchaIds() {
  // Return the correct canvas/input IDs for the active role
  if (currentRole === 'politician') {
    return { canvasId: 'regCaptchaCanvasP', inputId: 'regCaptchaInputP' };
  }
  return { canvasId: 'regCaptchaCanvas', inputId: 'regCaptchaInput' };
}

function generateRegCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (code === _regCaptchaValue);
  _regCaptchaValue = code;

  const { canvasId, inputId } = _getRegCaptchaIds();
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(194,24,7,' + (0.08 + Math.random() * 0.12) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * W, Math.random() * H);
    ctx.lineTo(Math.random() * W, Math.random() * H);
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = 'rgba(0,0,0,' + (0.05 + Math.random() * 0.1) + ')';
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const fonts  = ['bold 22px Inter', 'bold 20px Segoe UI', 'bold 21px Arial'];
  const colors = ['#C21807', '#1F1F1F', '#9B1405', '#4A4A4A'];
  const charW  = W / code.length;

  for (let i = 0; i < code.length; i++) {
    ctx.save();
    ctx.translate(charW * i + charW / 2, H / 2 + 4);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font         = fonts[Math.floor(Math.random() * fonts.length)];
    ctx.fillStyle    = colors[Math.floor(Math.random() * colors.length)];
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  const inp = document.getElementById(inputId);
  if (inp) inp.value = '';
}

function validateRegCaptcha(userInput) {
  return userInput.trim().toLowerCase() === _regCaptchaValue.toLowerCase();
}

// Generate captcha on page load
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateCaptcha);
  } else {
    generateCaptcha();
  }
})();

// ================================================================
// LOGIN FORM SUBMIT
// ================================================================
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearError('loginError');

  const role          = document.getElementById('loginRole').value;
  const email         = document.getElementById('loginEmail').value.trim();
  const password      = document.getElementById('loginPassword').value;
  const captchaInput  = document.getElementById('captchaInput').value.trim();

  // ---- Role check ----
  if (!role) {
    showError('loginError', 'Please select a role before logging in.');
    return;
  }

  // ---- Email / Mobile check ----
  if (!email) {
    showError('loginError', 'Please enter your Email Address or Mobile Number.');
    return;
  }

  // ---- Captcha always required ----
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

  // ---- Password logic ----
  // CASE 1: Password provided → must be correct (demo: any non-empty value passes)
  // CASE 2: Password empty  → captcha-only login (already verified above)
  if (password) {
    // Demo mode: accept any password. In production, verify against backend.
    // If password were wrong: showError('loginError', 'Incorrect password.'); generateCaptcha(); return;
  }

  // ---- All checks passed — redirect ----
  if (role === 'citizen') {
    window.location.href = '../citizen/citizen-dashboard.html';
  } else if (role === 'politician') {
    window.location.href = '../politician/politician-dashboard.html';
  } else if (role === 'admin') {
    window.location.href = '../admin/admin-dashboard.html';
  } else {
    alert('Login successful! (Demo mode)');
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

// ================================================================
// PASSWORD STRENGTH — works for both citizen and politician fields
// ================================================================
function checkStrength(val, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!val) { el.textContent = ''; el.style.color = ''; return; }

  let score = 0;
  if (val.length >= 6)           score++;
  if (val.length >= 10)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;

  const levels = [
    { label: 'Very Weak',   color: '#c0392b' },
    { label: 'Weak',        color: '#e67e22' },
    { label: 'Fair',        color: '#d4a017' },
    { label: 'Strong',      color: '#27ae60' },
    { label: 'Very Strong', color: '#1a8a3a' },
  ];
  const level = levels[Math.min(score, 4)];
  el.textContent = 'Strength: ' + level.label;
  el.style.color = level.color;
}

document.getElementById('c-password').addEventListener('input', function () {
  checkStrength(this.value, 'pwStrength');
});
document.getElementById('p-password').addEventListener('input', function () {
  checkStrength(this.value, 'pwStrengthP');
});

// ================================================================
// RESET REGISTER FORM — fields only (called when entering register card)
// ================================================================
function resetRegisterFormFields() {
  // Clear citizen fields
  ['c-firstName', 'c-middleName', 'c-lastName',
   'c-dob', 'c-mobile', 'c-whatsapp', 'c-email', 'c-otherResident'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cGender = document.getElementById('c-gender');
  if (cGender) cGender.value = '';
  // Reset wardConfirm, residentType, and voter radios
  document.querySelectorAll('input[name="wardConfirm"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="residentType"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="isVoter"]').forEach(r => r.checked = false);
  document.getElementById('otherResidentGroup').classList.add('hidden');
  // Reset WhatsApp checkbox and readonly state
  const sameAsMobile = document.getElementById('c-sameAsMobile');
  if (sameAsMobile) {
    sameAsMobile.checked = false;
    syncWhatsApp(sameAsMobile);
  }
  const cPwd = document.getElementById('c-password');
  if (cPwd) cPwd.value = '';
  const cConf = document.getElementById('c-confirmPassword');
  if (cConf) cConf.value = '';
  const cTerms = document.getElementById('c-acceptTerms');
  if (cTerms) cTerms.checked = false;
  const pwStr = document.getElementById('pwStrength');
  if (pwStr) { pwStr.textContent = ''; pwStr.style.color = ''; }

  // Clear politician fields
  ['p-firstName', 'p-middleName', 'p-lastName', 'p-age', 'p-mobile', 'p-email', 'p-address',
   'p-wardNumber', 'p-wardName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const pJuris = document.getElementById('p-jurisdiction');
  if (pJuris) pJuris.value = '';
  const pGender = document.getElementById('p-gender');
  if (pGender) pGender.value = '';
  const pPos = document.getElementById('p-position');
  if (pPos) pPos.value = '';
  const pPwd = document.getElementById('p-password');
  if (pPwd) pPwd.value = '';
  const pConf = document.getElementById('p-confirmPassword');
  if (pConf) pConf.value = '';
  const pTerms = document.getElementById('p-acceptTerms');
  if (pTerms) pTerms.checked = false;
  const pIdProof = document.getElementById('p-idProof');
  if (pIdProof) pIdProof.value = '';
  const pwStrP = document.getElementById('pwStrengthP');
  if (pwStrP) { pwStrP.textContent = ''; pwStrP.style.color = ''; }

  // Hide all step panels
  hideAllStepPanels();

  // Clear all errors
  ['step1Error-citizen', 'step1Error-politician',
   'step2Error-citizen', 'step2Error-politician',
   'step3Error-citizen', 'step3Error-politician'].forEach(id => clearError(id));
}

// ================================================================
// RESET REGISTER FORM — full reset (called after success redirect)
// ================================================================
function resetRegisterForm() {
  currentRole = '';
  document.getElementById('regRole').value = '';
  document.getElementById('roleBanner').classList.add('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');

  // Reset step labels to defaults
  ['Personal', 'Details', 'Security'].forEach((label, i) => {
    const el = document.getElementById('stepLabel' + (i + 1));
    if (el) el.textContent = label;
  });

  resetRegisterFormFields();

  // Reset step indicator
  updateStepIndicator(1);

  // Reset progress bar
  const bar = document.getElementById('progressBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  setTimeout(() => { bar.style.transition = 'width 4s linear'; }, 50);

  // Reset voice assistant language so next session asks again
  if (typeof window.voiceResetLang === 'function') window.voiceResetLang();
}
