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
  const pwdInput = document.getElementById('loginPassword');
  const pwdReq = document.getElementById('loginPasswordReq');

  if (role === 'admin') {
    adminNotice.classList.remove('hidden');
    registerLink.classList.add('hidden');
    if (pwdInput) {
      pwdInput.setAttribute('required', 'required');
      pwdInput.placeholder = 'Enter your password';
    }
    if (pwdReq) pwdReq.classList.remove('hidden');
  } else {
    adminNotice.classList.add('hidden');
    registerLink.classList.remove('hidden');
    if (pwdInput) {
      pwdInput.removeAttribute('required');
      pwdInput.placeholder =
        role === 'citizen' || role === 'politician'
          ? 'Optional — email/mobile only, or with password'
          : 'Enter your password';
    }
    if (pwdReq) pwdReq.classList.add('hidden');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoginRoleChange);
} else {
  onLoginRoleChange();
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

  // After progress bar completes, redirect to the appropriate dashboard
  setTimeout(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      resetRegisterForm();
      showLogin();
    }
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
  // Kept for backward compatibility — no longer used with dropdown UI
}

// ================================================================
// FILE NAME DISPLAY & INLINE TYPE VALIDATION
// Called by onchange on file inputs
// ================================================================
function showFileName(inputId, labelId) {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  if (!input || !label) return;

  if (input.files.length === 0) {
    label.textContent = '';
    label.style.color = '#1a8a3a';
    return;
  }

  const file = input.files[0];

  // Determine allowed types based on which input this is
  const isPhoto   = inputId === 'p-profilePhoto';
  const photoTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const idTypes    = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const allowed    = isPhoto ? photoTypes : idTypes;
  const hint       = isPhoto ? 'JPG or PNG only' : 'PDF, JPG, or PNG only';

  if (!allowed.includes(file.type)) {
    label.textContent = '✖ Invalid file type — ' + hint;
    label.style.color = '#c0392b';
    input.value = '';   // clear the invalid selection
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
      const firstName       = document.getElementById('c-firstName').value.trim();
      const lastName        = document.getElementById('c-lastName').value.trim();
      const wardConfirm     = document.querySelector('input[name="wardConfirm"]:checked');
      const residentType    = document.querySelector('input[name="residentType"]:checked');

      if (!firstName || !lastName) {
        showErrorWithVoice(errId(1), 'Please enter your First Name and Last Name.', 'err-name-required');
        return false;
      }
      if (!wardConfirm) {
        showErrorWithVoice(errId(1), 'Please confirm whether you belong to this ward.', 'err-ward-required');
        return false;
      }
      if (!residentType) {
        showErrorWithVoice(errId(1), 'Please select your Residency Type.', 'err-resident-required');
        return false;
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
      const partyName    = document.getElementById('p-partyName').value.trim();
      const governmentId = document.getElementById('p-governmentId').value.trim();

      if (!jurisdiction || !wardNumber || !wardName || !position || !partyName || !governmentId) {
        showErrorWithVoice(errId(2), 'Please fill all required fields before proceeding.', 'err-fields-required');
        return false;
      }
      // Block submission if master data failed to load
      if (_masterData.failed) {
        showErrorWithVoice(errId(2), 'Jurisdiction data could not be loaded. Please refresh the page.', 'err-fields-required');
        return false;
      }
    }

    return true;
  }

  return true;
}

// ================================================================
// REGISTER — LOADING STATE HELPERS
// ================================================================
function setRegisterLoading(isLoading) {
  // Target the Register button in whichever step-3 panel is visible
  const btns = document.querySelectorAll(
    '#step3-citizen button.btn-primary, #step3-politician button.btn-primary'
  );
  btns.forEach(btn => {
    if (isLoading) {
      btn.disabled        = true;
      btn.dataset.origText = btn.textContent;
      btn.textContent     = 'Registering…';
      btn.style.opacity   = '0.75';
      btn.style.cursor    = 'not-allowed';
    } else {
      btn.disabled      = false;
      btn.textContent   = btn.dataset.origText || 'Register';
      btn.style.opacity = '';
      btn.style.cursor  = '';
    }
  });
}

// ================================================================
// REGISTER — BUILD REQUEST BODIES
// ================================================================
function buildCitizenPayload(captchaVal) {
  const firstName       = document.getElementById('c-firstName').value.trim();
  const lastName        = document.getElementById('c-lastName').value.trim();
  const mobile          = document.getElementById('c-mobile').value.trim();
  const email           = document.getElementById('c-email').value.trim();
  const gender          = document.getElementById('c-gender').value;
  const dob             = document.getElementById('c-dob').value;
  const residentType    = document.querySelector('input[name="residentType"]:checked');
  const isVoter         = document.querySelector('input[name="isVoter"]:checked');
  const password        = document.getElementById('c-password').value;

  const wardConfirm     = document.querySelector('input[name="wardConfirm"]:checked');
  const wardId          = wardConfirm && wardConfirm.value === 'yes' ? 1 : 2;
  const residenceTypeId = residentType ? parseInt(residentType.value, 10) : 1;

  return {
    firstName:         firstName,
    lastName:          lastName,
    mobileNo:          mobile,
    email:             email || '',
    gender:            gender,
    dateOfBirth:       dob,
    wardId:            wardId,
    residenceTypeId:   residenceTypeId,
    isVoterRegistered: isVoter ? isVoter.value === 'yes' : false,
    preferredLanguage: 'English',
    password:          password,
    captcha:           captchaVal,
  };
}

function buildPoliticianFormData(captchaVal) {
  const fd = new FormData();

  // Personal fields
  fd.append('firstName',   document.getElementById('p-firstName').value.trim());
  fd.append('lastName',    document.getElementById('p-lastName').value.trim());
  fd.append('mobileNo',    document.getElementById('p-mobile').value.trim());
  fd.append('email',       document.getElementById('p-email').value.trim() || '');
  fd.append('age',         document.getElementById('p-age').value.trim());
  fd.append('gender',      document.getElementById('p-gender').value);
  fd.append('address',     document.getElementById('p-address').value.trim());

  // Political fields
  fd.append('partyName',          document.getElementById('p-partyName').value.trim());
  fd.append('politicianRole',     document.getElementById('p-position').value);
  fd.append('governmentId',       document.getElementById('p-governmentId').value.trim());
  fd.append('jurisdictionTypeId', document.getElementById('p-jurisdiction').value);
  fd.append('wardNumber',         document.getElementById('p-wardNumber').value.trim());
  fd.append('wardName',           document.getElementById('p-wardName').value.trim());

  // Auth
  fd.append('password', document.getElementById('p-password').value);
  fd.append('captcha',  captchaVal);

  // Files — only append if a file was selected
  const profilePhotoInput = document.getElementById('p-profilePhoto');
  if (profilePhotoInput && profilePhotoInput.files.length > 0) {
    fd.append('profilePhoto', profilePhotoInput.files[0]);
  }
  const idProofInput = document.getElementById('p-idProof');
  if (idProofInput && idProofInput.files.length > 0) {
    fd.append('idProof', idProofInput.files[0]);
  }

  return fd;
}

function buildPoliticianPayload(captchaVal) {
  // Legacy — kept for reference, replaced by buildPoliticianFormData
  return buildPoliticianFormData(captchaVal);
}

// ================================================================
// SUBMIT REGISTRATION  (replaces the old demo-only version)
// ================================================================
async function submitRegistration() {
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

  // ---- Password validation ----
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

  // ---- Politician: file validation ----
  if (currentRole === 'politician') {
    const profilePhoto = document.getElementById('p-profilePhoto');
    if (!profilePhoto.files || profilePhoto.files.length === 0) {
      showErrorWithVoice(e3, 'Please upload your profile photo.', 'err-idproof-required');
      return;
    }
    const photoFile = profilePhoto.files[0];
    const photoAllowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!photoAllowed.includes(photoFile.type)) {
      showErrorWithVoice(e3, 'Profile photo must be JPG or PNG format.', 'err-idproof-type');
      return;
    }
    if (photoFile.size > 5 * 1024 * 1024) {
      showErrorWithVoice(e3, 'Profile photo must not exceed 5 MB.', 'err-idproof-size');
      return;
    }

    const idProof = document.getElementById('p-idProof');
    if (!idProof.files || idProof.files.length === 0) {
      showErrorWithVoice(e3, 'Please upload your ID proof document.', 'err-idproof-required');
      return;
    }
    const idFile = idProof.files[0];
    const idAllowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!idAllowed.includes(idFile.type)) {
      showErrorWithVoice(e3, 'ID proof must be PDF, JPG, or PNG format.', 'err-idproof-type');
      return;
    }
    if (idFile.size > 5 * 1024 * 1024) {
      showErrorWithVoice(e3, 'ID proof file must not exceed 5 MB.', 'err-idproof-size');
      return;
    }
  }

  // ---- Terms ----
  if (!terms) {
    showErrorWithVoice(e3, 'You must accept the Terms & Conditions to register.', 'err-terms-required');
    return;
  }

  // ---- Captcha ----
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

  // ---- All local checks passed — call API ----
  setRegisterLoading(true);

  try {
    const endpoint = currentRole === 'citizen'
      ? API_BASE + '/register-citizen'
      : API_BASE + '/register-politician';

    let fetchOptions;

    if (currentRole === 'politician') {
      // Politician uses multipart/form-data for file uploads
      // Do NOT set Content-Type — browser sets it automatically with boundary
      fetchOptions = {
        method: 'POST',
        body:   buildPoliticianFormData(regCaptchaVal),
      };
    } else {
      // Citizen uses JSON
      fetchOptions = {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(buildCitizenPayload(regCaptchaVal)),
      };
    }

    const response = await fetch(endpoint, fetchOptions);

    // Parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch (_) {
      throw new Error('Server returned an unexpected response. Please try again.');
    }

    if (!response.ok || !data.success) {
      // Backend returned failure — show message, keep form intact
      showError(e3, data.message || 'Registration failed. Please check your details and try again.');
      generateRegCaptcha();
      return;
    }

    // ---- Success ----
    generateRegCaptcha();   // refresh captcha for next use

    // Store session so dashboard knows who is logged in
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role',   data.role);

    // Use frontend path map — never trust backend redirectUrl for file-based routing
    const regRedirect = currentRole === 'politician'
      ? '../politician/politician-dashboard.html'
      : '../citizen/citizen-dashboard.html';

    showSuccess(data.message, regRedirect);

  } catch (err) {
    showError(
      e3,
      err.message || 'Unable to connect to the server. Please check your connection and try again.'
    );
    generateRegCaptcha();
  } finally {
    setRegisterLoading(false);
  }
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
  const canvas = document.getElementById('captchaCanvas');
  if (!canvas) return;

  // Match canvas internal resolution to its CSS display size
  // This prevents blurry/distorted rendering when CSS width:100% is applied
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = Math.round(rect.width  || 180) * dpr;
  canvas.height = Math.round(rect.height || 48)  * dpr;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (code === _captchaValue);
  _captchaValue = code;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.scale(dpr, dpr);
  const W2 = W / dpr;
  const H2 = H / dpr;

  // Background
  ctx.clearRect(0, 0, W2, H2);
  ctx.fillStyle = '#F9F9F9';
  ctx.fillRect(0, 0, W2, H2);

  // Noise lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(194,24,7,' + (0.08 + Math.random() * 0.12) + ')';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * W2, Math.random() * H2);
    ctx.lineTo(Math.random() * W2, Math.random() * H2);
    ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = 'rgba(0,0,0,' + (0.05 + Math.random() * 0.1) + ')';
    ctx.beginPath();
    ctx.arc(Math.random() * W2, Math.random() * H2, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw each character with slight rotation and offset
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
  const { canvasId, inputId } = _getRegCaptchaIds();
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Match canvas internal resolution to its CSS display size
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = Math.round(rect.width  || 180) * dpr;
  canvas.height = Math.round(rect.height || 48)  * dpr;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (code === _regCaptchaValue);
  _regCaptchaValue = code;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.scale(dpr, dpr);
  const W2 = W / dpr;
  const H2 = H / dpr;

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

  const inp = document.getElementById(inputId);
  if (inp) inp.value = '';
}

function validateRegCaptcha(userInput) {
  return userInput.trim().toLowerCase() === _regCaptchaValue.toLowerCase();
}

// Generate captcha on page load — defer to after first paint so
// getBoundingClientRect() returns the real rendered size
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
// API CONFIGURATION
// ================================================================
const API_BASE        = 'http://localhost:5079/api/auth';
const MASTER_API_BASE = 'http://localhost:5079/api/master';

// ================================================================
// MASTER DATA — loaded once on page load, used to populate dropdowns
// ================================================================
let _masterData = {
  jurisdictionTypes: [],   // { jurisdictionTypeId, jurisdictionTypeName }
  loaded:            false,
  failed:            false,
};

async function loadMasterData() {
  try {
    const jurisdictionRes = await fetch(MASTER_API_BASE + '/jurisdiction-types');

    if (!jurisdictionRes.ok) {
      throw new Error('Jurisdiction types endpoint failed.');
    }

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
  // ---- Politician: Jurisdiction Type dropdown ----
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
  // Show error hint and disable jurisdiction dropdown that failed to load (politician only)
  const hints = ['p-jurisdiction-hint'];
  hints.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  });

  const dropdowns = ['p-jurisdiction'];
  dropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = '<option value="">Unavailable — please refresh</option>';
      el.disabled  = true;
    }
  });
}

// Load master data as soon as the page is ready
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMasterData);
  } else {
    loadMasterData();
  }
})();

// ================================================================
// LOGIN LOADING STATE HELPERS
// ================================================================
function setLoginLoading(isLoading) {
  const btn = document.querySelector('#loginForm button[type="submit"]');
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn.textContent = 'Logging in…';
    btn.style.opacity = '0.75';
    btn.style.cursor  = 'not-allowed';
  } else {
    btn.disabled = false;
    btn.textContent = 'Login to Portal';
    btn.style.opacity = '';
    btn.style.cursor  = '';
  }
}

// ================================================================
// ROLE → REDIRECT URL MAP
// ================================================================
const ROLE_REDIRECT = {
  'Citizen':    '../citizen/citizen-dashboard.html',
  'Politician': '../politician/politician-dashboard.html',
  'Admin':      '../admin/admin-dashboard.html',
};

// ================================================================
// LOGIN FORM SUBMIT
// ================================================================
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearError('loginError');

  const role     = document.getElementById('loginRole').value;
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const captchaInput = document.getElementById('captchaInput').value.trim();

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

  // ---- Password: mandatory for Admin only (Citizen / Politician may omit) ----
  if (role === 'admin' && !String(password).trim()) {
    showError('loginError', 'Please enter your password.');
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

  // ---- Call backend API ----
  setLoginLoading(true);

  try {
    const response = await fetch(API_BASE + '/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        emailOrMobile: email,
        password:      password,
        captcha:       captchaInput
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (_) {
      throw new Error('Server returned an unexpected response. Please try again.');
    }

    if (!response.ok || !data.success) {
      showError('loginError', data.message || 'Login failed. Please check your credentials.');
      generateCaptcha();
      return;
    }

    // ---- Success — store session and redirect ----
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role',   data.role);

    // Always use frontend path map — backend redirectUrl uses server-relative paths
    const redirectUrl = ROLE_REDIRECT[data.role] || ROLE_REDIRECT['Citizen'];
    window.location.href = redirectUrl;

  } catch (err) {
    showError(
      'loginError',
      err.message || 'Unable to connect to the server. Please check your connection and try again.'
    );
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
   'c-dob', 'c-mobile', 'c-whatsapp', 'c-email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cGender = document.getElementById('c-gender');
  if (cGender) cGender.value = '';
  // Reset ward confirm and residency type radios
  document.querySelectorAll('input[name="wardConfirm"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="residentType"]').forEach(r => r.checked = false);
  // Reset voter radio
  document.querySelectorAll('input[name="isVoter"]').forEach(r => r.checked = false);
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
   'p-wardNumber', 'p-wardName', 'p-partyName', 'p-governmentId'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset politician dropdowns to first option
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
