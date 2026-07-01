/* ============================================================
   CITIZEN CONNECT — Politician Login & Registration Logic
   ============================================================ */

'use strict';

// ================================================================
// API CONFIGURATION
// ================================================================
const API_BASE        = 'http://localhost:5079/api/auth';
const MASTER_API_BASE = 'http://localhost:5079/api/master';

// ================================================================
// STATE
// ================================================================
let currentStep = 1;

// ================================================================
// MASTER DATA — jurisdiction types
// ================================================================
let _masterData = {
  jurisdictionTypes: [],
  loaded:            false,
  failed:            false,
};

async function loadMasterData() {
  try {
    const jurisdictionRes = await fetch(MASTER_API_BASE + '/jurisdiction-types');
    if (!jurisdictionRes.ok) throw new Error('Jurisdiction types endpoint failed.');
    _masterData.jurisdictionTypes = await jurisdictionRes.json();
    _masterData.loaded            = true;
    _masterData.failed            = false;
    populateMasterDropdowns();
  } catch (err) {
    console.error('Failed to load master data:', err);
    _masterData.failed = true;
    showMasterDataError();
  }
}

function populateMasterDropdowns() {
  const pJurisdiction = document.getElementById('p-jurisdiction');
  if (pJurisdiction) {
    pJurisdiction.innerHTML = '<option value="">— Select Jurisdiction Type —</option>';
    _masterData.jurisdictionTypes.forEach(j => {
      const opt = document.createElement('option');
      opt.value       = j.jurisdictionTypeId;
      opt.textContent = j.jurisdictionTypeName;
      pJurisdiction.appendChild(opt);
    });
  }
}

function showMasterDataError() {
  const hint = document.getElementById('p-jurisdiction-hint');
  if (hint) hint.style.display = 'block';
  const dropdown = document.getElementById('p-jurisdiction');
  if (dropdown) {
    dropdown.innerHTML = '<option value="">Unavailable — please refresh</option>';
    dropdown.disabled  = true;
  }
}

(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMasterData);
  } else {
    loadMasterData();
  }
})();

// ================================================================
// VIEW SWITCHERS
// ================================================================
function showRegister() {
  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('registerCard').classList.remove('hidden');
  document.getElementById('successCard').classList.add('hidden');
  currentStep = 1;
  resetRegisterFormFields();
  showStepPanel(1);
  updateStepIndicator(1);
}

function showLogin() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('successCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
}

function showSuccess(apiMessage, redirectUrl) {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('loginCard').classList.add('hidden');
  const card = document.getElementById('successCard');
  card.classList.remove('hidden');

  const subEl = card.querySelector('.success-sub');
  if (subEl && apiMessage) subEl.textContent = apiMessage;

  setTimeout(() => {
    document.getElementById('progressBar').style.width = '100%';
  }, 100);

  setTimeout(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      resetRegisterFormFields();
      showLogin();
    }
  }, 4600);
}

// ================================================================
// STEP PANEL HELPERS
// ================================================================
function hideAllStepPanels() {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.add('hidden'));
}

function showStepPanel(step) {
  const panel = document.getElementById('step' + step);
  if (panel) {
    panel.classList.remove('hidden');
    panel.style.animation = 'none';
    panel.offsetHeight; // reflow
    panel.style.animation = '';
  }
}

// ================================================================
// STEP NAVIGATION
// ================================================================
function nextStep(from) {
  if (!validateStep(from)) return;
  const next = from + 1;
  hideAllStepPanels();
  showStepPanel(next);
  currentStep = next;
  updateStepIndicator(next);
  if (next === 3) generateRegCaptcha();
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
    if (i < active)        dot.classList.add('completed');
    else if (i === active) dot.classList.add('active');
    else                   dot.classList.add('inactive');
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('stepLine' + i);
    i < active ? line.classList.add('completed') : line.classList.remove('completed');
  }
}

// ================================================================
// FILE NAME DISPLAY & INLINE TYPE VALIDATION
// ================================================================
function showFileName(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (!input || !label) return;

  if (input.files.length === 0) { label.textContent = ''; label.style.color = '#1a8a3a'; return; }

  const file = input.files[0];
  const isPhoto    = inputId === 'p-profilePhoto';
  const photoTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const idTypes    = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowed    = isPhoto ? photoTypes : idTypes;
  const hint       = isPhoto ? 'JPG or PNG only' : 'PDF, JPG, or PNG only';

  if (!allowed.includes(file.type)) {
    label.textContent = '✖ Invalid file type — ' + hint;
    label.style.color = '#c0392b';
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    label.textContent = '✖ File too large — max 5 MB';
    label.style.color = '#c0392b';
    input.value = '';
    return;
  }
  label.textContent = '✔ ' + file.name;
  label.style.color = '#1a8a3a';
}

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

function showErrorWithVoice(id, englishMsg, voiceKey) {
  const lang   = (typeof window.voiceGetLang === 'function') ? window.voiceGetLang() : 'english';
  const hasKey = voiceKey && (typeof window.voiceValidationMsg === 'function');
  const displayMsg = (hasKey && lang !== 'english')
    ? window.voiceValidationMsg(voiceKey)
    : englishMsg;
  showError(id, displayMsg);
  if (typeof window.voiceWarn === 'function') {
    const spokenMsg = hasKey ? window.voiceValidationMsg(voiceKey) : englishMsg;
    window.voiceWarn(spokenMsg);
  }
}

// ================================================================
// VALIDATION
// ================================================================
function validateStep(step) {
  clearError('step' + step + 'Error');

  if (step === 1) {
    const firstName = document.getElementById('p-firstName').value.trim();
    const lastName  = document.getElementById('p-lastName').value.trim();
    const ageVal    = document.getElementById('p-age').value.trim();
    const age       = parseInt(ageVal, 10);
    const gender    = document.getElementById('p-gender').value;
    const mobile    = document.getElementById('p-mobile').value.trim();
    const email     = document.getElementById('p-email').value.trim();
    const address   = document.getElementById('p-address').value.trim();

    if (!firstName || !lastName || !ageVal || !gender || !mobile || !email || !address) {
      showErrorWithVoice('step1Error', 'Please fill all required fields before proceeding.', 'err-fields-required');
      return false;
    }
    if (isNaN(age) || age < 25) {
      showErrorWithVoice('step1Error', 'Age must be at least 25 years to register as a Politician.', 'err-age-invalid');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      showErrorWithVoice('step1Error', 'Mobile number must be exactly 10 digits.', 'err-mobile-invalid');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErrorWithVoice('step1Error', 'Please enter a valid email address.', 'err-email-invalid');
      return false;
    }
    return true;
  }

  if (step === 2) {
    const jurisdiction = document.getElementById('p-jurisdiction').value;
    const wardNumber   = document.getElementById('p-wardNumber').value.trim();
    const wardName     = document.getElementById('p-wardName').value.trim();
    const position     = document.getElementById('p-position').value;
    const partyName    = document.getElementById('p-partyName').value.trim();
    const governmentId = document.getElementById('p-governmentId').value.trim();

    if (!jurisdiction || !wardNumber || !wardName || !position || !partyName || !governmentId) {
      showErrorWithVoice('step2Error', 'Please fill all required fields before proceeding.', 'err-fields-required');
      return false;
    }
    if (_masterData.failed) {
      showErrorWithVoice('step2Error', 'Jurisdiction data could not be loaded. Please refresh the page.', 'err-fields-required');
      return false;
    }
    return true;
  }

  return true;
}

// ================================================================
// LOADING STATE
// ================================================================
function setRegisterLoading(isLoading) {
  const btn = document.querySelector('#step3 button.btn-primary');
  if (!btn) return;
  if (isLoading) {
    btn.disabled         = true;
    btn.dataset.origText = btn.textContent;
    btn.textContent      = 'Registering…';
    btn.style.opacity    = '0.75';
    btn.style.cursor     = 'not-allowed';
  } else {
    btn.disabled      = false;
    btn.textContent   = btn.dataset.origText || 'Register';
    btn.style.opacity = '';
    btn.style.cursor  = '';
  }
}

// ================================================================
// BUILD FORM DATA
// ================================================================
function buildPoliticianFormData(captchaVal) {
  const fd = new FormData();
  fd.append('firstName',          document.getElementById('p-firstName').value.trim());
  fd.append('lastName',           document.getElementById('p-lastName').value.trim());
  fd.append('mobileNo',           document.getElementById('p-mobile').value.trim());
  fd.append('email',              document.getElementById('p-email').value.trim() || '');
  fd.append('age',                document.getElementById('p-age').value.trim());
  fd.append('gender',             document.getElementById('p-gender').value);
  fd.append('address',            document.getElementById('p-address').value.trim());
  fd.append('partyName',          document.getElementById('p-partyName').value.trim());
  fd.append('politicianRole',     document.getElementById('p-position').value);
  fd.append('governmentId',       document.getElementById('p-governmentId').value.trim());
  fd.append('jurisdictionTypeId', document.getElementById('p-jurisdiction').value);
  fd.append('wardNumber',         document.getElementById('p-wardNumber').value.trim());
  fd.append('wardName',           document.getElementById('p-wardName').value.trim());
  fd.append('password',           document.getElementById('p-password').value);
  fd.append('captcha',            captchaVal);

  const profilePhotoInput = document.getElementById('p-profilePhoto');
  if (profilePhotoInput && profilePhotoInput.files.length > 0)
    fd.append('profilePhoto', profilePhotoInput.files[0]);

  const idProofInput = document.getElementById('p-idProof');
  if (idProofInput && idProofInput.files.length > 0)
    fd.append('idProof', idProofInput.files[0]);

  return fd;
}

// ================================================================
// SUBMIT REGISTRATION
// ================================================================
async function submitRegistration() {
  clearError('step3Error');

  const password = document.getElementById('p-password').value;
  const confirm  = document.getElementById('p-confirmPassword').value;
  const terms    = document.getElementById('p-acceptTerms').checked;

  if (!password || !confirm) {
    showErrorWithVoice('step3Error', 'Please fill all required fields before proceeding.', 'err-password-required');
    return;
  }
  if (password.length < 6) {
    showErrorWithVoice('step3Error', 'Password must be at least 6 characters long.', 'err-password-short');
    return;
  }
  if (password !== confirm) {
    showErrorWithVoice('step3Error', 'Passwords do not match. Please re-enter.', 'err-password-mismatch');
    return;
  }

  // File validation
  const profilePhoto = document.getElementById('p-profilePhoto');
  if (!profilePhoto.files || profilePhoto.files.length === 0) {
    showErrorWithVoice('step3Error', 'Please upload your profile photo.', 'err-idproof-required');
    return;
  }
  const photoFile = profilePhoto.files[0];
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photoFile.type)) {
    showErrorWithVoice('step3Error', 'Profile photo must be JPG or PNG format.', 'err-idproof-type');
    return;
  }
  if (photoFile.size > 5 * 1024 * 1024) {
    showErrorWithVoice('step3Error', 'Profile photo must not exceed 5 MB.', 'err-idproof-size');
    return;
  }

  const idProof = document.getElementById('p-idProof');
  if (!idProof.files || idProof.files.length === 0) {
    showErrorWithVoice('step3Error', 'Please upload your ID proof document.', 'err-idproof-required');
    return;
  }
  const idFile = idProof.files[0];
  if (!['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(idFile.type)) {
    showErrorWithVoice('step3Error', 'ID proof must be PDF, JPG, or PNG format.', 'err-idproof-type');
    return;
  }
  if (idFile.size > 5 * 1024 * 1024) {
    showErrorWithVoice('step3Error', 'ID proof file must not exceed 5 MB.', 'err-idproof-size');
    return;
  }

  if (!terms) {
    showErrorWithVoice('step3Error', 'You must accept the Terms & Conditions to register.', 'err-terms-required');
    return;
  }

  const regCaptchaInput = document.getElementById('regCaptchaInput');
  const regCaptchaVal   = regCaptchaInput ? regCaptchaInput.value.trim() : '';

  if (!regCaptchaVal) {
    showErrorWithVoice('step3Error', 'Please enter the captcha code to complete registration.', 'err-captcha-required');
    generateRegCaptcha();
    return;
  }
  if (!validateRegCaptcha(regCaptchaVal)) {
    showErrorWithVoice('step3Error', 'Invalid captcha. Please try again.', 'err-captcha-invalid');
    generateRegCaptcha();
    return;
  }

  setRegisterLoading(true);

  try {
    const response = await fetch(API_BASE + '/register-politician', {
      method: 'POST',
      body:   buildPoliticianFormData(regCaptchaVal),
    });

    let data;
    try { data = await response.json(); }
    catch (_) { throw new Error('Server returned an unexpected response. Please try again.'); }

    if (!response.ok || !data.success) {
      showError('step3Error', data.message || 'Registration failed. Please check your details and try again.');
      generateRegCaptcha();
      return;
    }

    generateRegCaptcha();
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role',   data.role);
    showSuccess(data.message, '../../../politician/politician-dashboard.html');

  } catch (err) {
    showError('step3Error', err.message || 'Unable to connect to the server. Please check your connection and try again.');
    generateRegCaptcha();
  } finally {
    setRegisterLoading(false);
  }
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

// ================================================================
// REGISTRATION CAPTCHA
// ================================================================
let _regCaptchaValue = '';

function generateRegCaptcha() {
  const canvas = document.getElementById('regCaptchaCanvas');
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
  } while (code === _regCaptchaValue);
  _regCaptchaValue = code;

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

  const inp = document.getElementById('regCaptchaInput');
  if (inp) inp.value = '';
}

function validateRegCaptcha(userInput) {
  return userInput.trim() === _regCaptchaValue;
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
// LOGIN FORM SUBMIT
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
    window.location.href = '../../../politician/politician-dashboard.html';

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

// ================================================================
// PASSWORD STRENGTH
// ================================================================
function checkStrength(val, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!val) { el.textContent = ''; el.style.color = ''; return; }

  let score = 0;
  if (val.length >= 6)          score++;
  if (val.length >= 10)         score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

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

document.addEventListener('DOMContentLoaded', function () {
  const pPwd = document.getElementById('p-password');
  if (pPwd) pPwd.addEventListener('input', function () { checkStrength(this.value, 'pwStrengthP'); });
});

// ================================================================
// RESET REGISTER FORM FIELDS
// ================================================================
function resetRegisterFormFields() {
  ['p-firstName', 'p-middleName', 'p-lastName', 'p-age', 'p-mobile', 'p-email', 'p-address',
   'p-wardNumber', 'p-wardName', 'p-partyName', 'p-governmentId'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const pJuris  = document.getElementById('p-jurisdiction');
  if (pJuris)  pJuris.value  = '';
  const pGender = document.getElementById('p-gender');
  if (pGender) pGender.value = '';
  const pPos    = document.getElementById('p-position');
  if (pPos)    pPos.value    = '';
  const pPwd    = document.getElementById('p-password');
  if (pPwd)    pPwd.value    = '';
  const pConf   = document.getElementById('p-confirmPassword');
  if (pConf)   pConf.value   = '';
  const pTerms  = document.getElementById('p-acceptTerms');
  if (pTerms)  pTerms.checked = false;

  const pProfilePhoto = document.getElementById('p-profilePhoto');
  if (pProfilePhoto) pProfilePhoto.value = '';
  const pProfilePhotoName = document.getElementById('p-profilePhoto-name');
  if (pProfilePhotoName) { pProfilePhotoName.textContent = ''; pProfilePhotoName.style.color = '#1a8a3a'; }
  const pIdProof = document.getElementById('p-idProof');
  if (pIdProof) pIdProof.value = '';
  const pIdProofName = document.getElementById('p-idProof-name');
  if (pIdProofName) { pIdProofName.textContent = ''; pIdProofName.style.color = '#1a8a3a'; }

  const pwStrP = document.getElementById('pwStrengthP');
  if (pwStrP) { pwStrP.textContent = ''; pwStrP.style.color = ''; }

  hideAllStepPanels();
  clearError('step1Error');
  clearError('step2Error');
  clearError('step3Error');
}

/* ================================================================
   PAGE-LEVEL OVERRIDES
   Loaded by both politician-login.html and politician-register.html.
   Each page overrides showRegister / showLogin as needed below.
================================================================ */

/* ---- politician-login.html: redirect "New Registration" to dedicated page ---- */
if (document.getElementById('registerCard') !== null &&
    document.getElementById('registerCard').children.length === 0) {
  /* loginCard is the active card — we are on politician-login.html */
  window.showRegister = function () {
    window.location.href = 'politician-register.html';
  };
  /* Expose captcha value for voice assistant */
  window.getLoginCaptcha = function () {
    return typeof _captchaValue !== 'undefined' ? _captchaValue : '';
  };
}

/* ---- politician-register.html: redirect "Already Registered" to login page ---- */
if (document.getElementById('loginCard') !== null &&
    document.getElementById('loginCard').children.length === 0) {
  /* registerCard is the active card — we are on politician-register.html */
  window.showLogin = function () {
    window.location.href = 'politician-login.html';
  };
  window.showRegister = function () {
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('successCard').classList.add('hidden');
    document.getElementById('registerCard').classList.remove('hidden');
  };
  window.getLoginCaptcha = function () { return ''; };

  /* Unlock registerFormBody when user picks Voice or Text in step1 */
  document.addEventListener('click', function unlockReg(e) {
    if (e.target && e.target.classList.contains('vg-start-btn')) {
      var step1 = document.getElementById('step1');
      if (step1 && step1.contains(e.target)) {
        var formBody = document.getElementById('registerFormBody');
        if (formBody) formBody.classList.add('unlocked');
        document.removeEventListener('click', unlockReg);
      }
    }
  });
}

// ================================================================
// REGISTER MODE SELECTION — unlock form + trigger existing voice/text flow
// ================================================================
function regSetMode(mode) {
  var btnVoice = document.getElementById('regBtnVoice');
  var btnText  = document.getElementById('regBtnText');
  if (btnVoice) btnVoice.classList.toggle('vg-start-btn--active', mode === 'voice');
  if (btnText)  btnText.classList.toggle('vg-start-btn--active',  mode === 'text');

  // Unlock the registration form body
  var formBody = document.getElementById('registerFormBody');
  if (formBody) formBody.classList.add('unlocked');

  if (mode === 'voice') {
    // Trigger the existing voice-assistant.js guide for politician step 1
    if (window.VoiceGuide && typeof window.VoiceGuide.start === 'function') {
      window.VoiceGuide.start('p1');
    }
    // Show standalone mic buttons (voice-assistant.js manages these)
    document.querySelectorAll('.vs-mic-btn').forEach(function(b) { b.style.display = ''; });
  } else {
    // Text mode: stop guide if running, hide mic buttons
    if (window.VoiceGuide && typeof window.VoiceGuide.stop === 'function') {
      window.VoiceGuide.stop();
    }
    document.querySelectorAll('.vs-mic-btn').forEach(function(b) { b.style.display = 'none'; });
  }
}

// ================================================================
// LOGIN VOICE — mode switching, mic fields, captcha speaker
// ================================================================

var _loginMode = null;
var _loginGuideRecog = null;
var _loginGuideActive = false;

function loginSetMode(mode) {
  _loginMode = mode;
  var btnVoice = document.getElementById('loginBtnVoice');
  var btnText  = document.getElementById('loginBtnText');
  btnVoice.classList.toggle('vg-start-btn--active', mode === 'voice');
  btnText.classList.toggle('vg-start-btn--active',  mode === 'text');

  // Unlock the form body on first selection
  var formBody = document.getElementById('loginFormBody');
  if (formBody) formBody.classList.add('unlocked');

  var mics = document.querySelectorAll('.login-mic');
  mics.forEach(function(b) {
    b.style.display = (mode === 'voice') ? '' : 'none';
  });

  if (mode === 'text') {
    loginStopGuide();
  } else if (mode === 'voice') {
    loginStartGuide();
  }
}

function loginStartGuide() {
  loginStopGuide();
  _loginGuideActive = true;
  _loginAskField(
    'loginEmail',
    'Please say your Email Address or Mobile Number.',
    'email-or-mobile',
    function() {
      if (!_loginGuideActive) return;
      _loginAskField(
        'loginPassword',
        'Please say your Password. Or say skip to leave it blank.',
        'password',
        function() {
          if (!_loginGuideActive) return;
          var code = (typeof window.getLoginCaptcha === 'function') ? window.getLoginCaptcha() : '';
          var spoken = code ? code.split('').join('  ') : '';
          var prompt = code
            ? 'Security verification. The captcha code is: ' + spoken + '. Please say the captcha.'
            : 'Please say the captcha code shown on screen.';
          _loginAskField('captchaInput', prompt, 'captcha', function() {
            if (!_loginGuideActive) return;
            _loginSpeak('All fields filled. Please click Login to Portal.');
          });
        }
      );
    }
  );
}

function loginStopGuide() {
  _loginGuideActive = false;
  if (_loginGuideRecog) {
    try { _loginGuideRecog.stop(); } catch(e) {}
    _loginGuideRecog = null;
  }
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  document.querySelectorAll('.vg-field-active').forEach(function(e) {
    e.classList.remove('vg-field-active');
  });
}

function _loginSpeak(text, onEnd) {
  var SS = window.speechSynthesis;
  if (!SS) { if (onEnd) onEnd(); return; }
  if (SS.speaking) SS.cancel();
  setTimeout(function() {
    var utt = new SpeechSynthesisUtterance(text);
    utt.lang  = 'en-IN'; utt.rate = 0.92; utt.pitch = 1.0;
    utt.onend   = function() { if (onEnd) onEnd(); };
    utt.onerror = function() { if (onEnd) onEnd(); };
    SS.speak(utt);
  }, 200);
}

function _loginHighlight(fieldId) {
  document.querySelectorAll('.vg-field-active').forEach(function(e) { e.classList.remove('vg-field-active'); });
  var inp = document.getElementById(fieldId);
  if (inp) {
    var fg = inp.closest('.form-group') || inp.parentElement;
    if (fg) fg.classList.add('vg-field-active');
    inp.focus();
  }
}

function _loginAskField(fieldId, prompt, type, onDone) {
  if (!_loginGuideActive) return;
  _loginHighlight(fieldId);
  _loginSpeak(prompt, function() {
    if (!_loginGuideActive) return;
    _loginListenField(fieldId, type, onDone, 1);
  });
}

function _loginListenField(fieldId, type, onDone, attempt) {
  if (!_loginGuideActive) return;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { if (onDone) onDone(); return; }

  var inp = document.getElementById(fieldId);
  var recog = new SR();
  recog.lang = 'en-IN'; recog.continuous = false;
  recog.interimResults = false; recog.maxAlternatives = 3;
  _loginGuideRecog = recog;

  var timer = setTimeout(function() {
    if (!_loginGuideActive) return;
    try { recog.stop(); } catch(e) {}
    if (attempt >= 3) { if (onDone) onDone(); return; }
    _loginSpeak('I did not hear you. Please try again.', function() {
      if (_loginGuideActive) _loginListenField(fieldId, type, onDone, attempt + 1);
    });
  }, 15000);

  recog.onresult = function(ev) {
    clearTimeout(timer);
    var t = ev.results[0][0].transcript.trim();
    _loginFillField(inp, type, t);
    inp.classList.add('vg-field-success');
    setTimeout(function() { inp.classList.remove('vg-field-success'); }, 1500);
    if (onDone) onDone();
  };

  recog.onerror = function(ev) {
    clearTimeout(timer);
    if (ev.error === 'no-speech' && attempt < 3) {
      _loginSpeak('I did not hear you. Please try again.', function() {
        if (_loginGuideActive) _loginListenField(fieldId, type, onDone, attempt + 1);
      });
    } else { if (onDone) onDone(); }
  };

  recog.onend = function() { _loginGuideRecog = null; };
  try { recog.start(); } catch(e) { clearTimeout(timer); if (onDone) onDone(); }
}

function _loginFillField(inp, type, transcript) {
  if (type === 'password') {
    if (transcript.toLowerCase() === 'skip') { inp.value = ''; return; }
    inp.value = transcript;
    return;
  }
  if (type === 'captcha') {
    inp.value = transcript.replace(/\s+/g, '').toUpperCase();
    return;
  }
  var digitsOnly = transcript.replace(/\D/g, '');
  if (digitsOnly.length >= 8) {
    inp.value = digitsOnly.slice(0, 10);
  } else {
    var t = transcript.toLowerCase()
      .replace(/\bat the rate\b|\bat\b/g, '@')
      .replace(/\bdot\b|\bpoint\b/g, '.')
      .replace(/\s+/g, '');
    inp.value = t;
  }
}

function loginMicField(fieldId, type, btn) {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  var statusEl = btn.querySelector('.vs-mic-status');
  btn.classList.add('vs-active');
  if (statusEl) statusEl.textContent = 'Listening\u2026';

  var inp = document.getElementById(fieldId);
  var recog = new SR();
  recog.lang = 'en-IN'; recog.continuous = false;
  recog.interimResults = false; recog.maxAlternatives = 3;

  recog.onresult = function(ev) {
    btn.classList.remove('vs-active');
    var t = ev.results[0][0].transcript.trim();
    _loginFillField(inp, type, t);
    inp.classList.add('vg-field-success');
    setTimeout(function() { inp.classList.remove('vg-field-success'); }, 1500);
    if (statusEl) { statusEl.textContent = 'Got it'; setTimeout(function() { statusEl.textContent = ''; }, 1500); }
  };
  recog.onerror = function() {
    btn.classList.remove('vs-active');
    if (statusEl) { statusEl.textContent = 'Try again'; setTimeout(function() { statusEl.textContent = ''; }, 1500); }
  };
  recog.onend = function() { btn.classList.remove('vs-active'); };
  try { recog.start(); } catch(e) { btn.classList.remove('vs-active'); }
}

function loginSpeakCaptcha(btn) {
  var code = (typeof window.getLoginCaptcha === 'function') ? window.getLoginCaptcha() : '';
  var statusEl = btn.querySelector('.vs-mic-status');
  if (!code) { if (statusEl) statusEl.textContent = 'Not ready'; setTimeout(function() { if(statusEl) statusEl.textContent=''; }, 1500); return; }
  var spoken = code.split('').join('  ');
  if (statusEl) statusEl.textContent = 'Reading\u2026';
  _loginSpeak('The captcha code is: ' + spoken, function() {
    if (statusEl) statusEl.textContent = '';
  });
}
