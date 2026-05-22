/* ============================================================
   CITIZEN CONNECT — Dashboard Logic
   ============================================================ */
"use strict";

const CITIZEN_API_BASE   = "http://localhost:5079/api/citizen";
const COMPLAINT_API_BASE = "http://localhost:5079/api/Complaint";

const SUGGESTION_API_BASE = "http://localhost:5079/api/suggestions";

const citizenProfile = { citizenId: null, wardId: null, wardDisplay: "" };


// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  if (!requireCitizenSession()) return;
  setDate();
  setupCharCounters();
  loadComplaintCategories();

  loadSuggestionCategories();
  loadCitizenProfile().then(function () {
    return loadCitizenComplaints();
  });
  loadCitizenSuggestions();

  loadCitizenProfile().then(function () {
    return loadCitizenComplaints();
  });
  renderSuggestions(SUGGESTIONS);

});

function requireCitizenSession() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  if (!userId || role !== "Citizen") {
    window.location.href = "../login/login.html";
    return false;
  }
  return true;
}

async function loadCitizenProfile() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const response = await fetch(CITIZEN_API_BASE + "/profile/" + encodeURIComponent(userId));
    let data;
    try {
      data = await response.json();
    } catch (_) {
      throw new Error("Could not read profile response.");
    }

    if (!response.ok || !data.success) {
      applyCitizenProfileFallback();
      return;
    }

    applyCitizenProfile(data);
    if (data.citizenId != null) {
      localStorage.setItem("citizenId", String(data.citizenId));
    }
  } catch (_) {
    applyCitizenProfileFallback();
  }
}

function applyCitizenProfile(profile) {
  const firstName = profile.firstName || "Citizen";
  const fullName = profile.fullName || firstName;
  const initials = profile.initials || "?";
  const wardLine = "Citizen · " + (profile.wardDisplay || "Ward —");
  const mobile = formatMobile(profile.mobileNo);
  const email = profile.email || "—";
  const ward = profile.wardDisplay || "—";
  const residency = profile.residenceTypeName || "—";
  const registered = formatProfileDate(profile.registeredAt);

  citizenProfile.citizenId = profile.citizenId != null ? profile.citizenId : null;
  citizenProfile.wardId = profile.wardId != null ? profile.wardId : null;
  citizenProfile.wardDisplay = profile.wardDisplay || "";

  const wardField = document.getElementById("complaintWard");
  if (wardField) wardField.value = ward;

  setText("greetName", firstName);
  setText("userAvatar", initials);
  setText("userName", fullName);
  setText("userRole", wardLine);
  setText("profileAvatar", initials);
  setText("profileName", fullName);
  setText("profileRoleBadge", wardLine);
  setText("profileFullName", fullName);
  setText("profileMobile", mobile);
  setText("profileEmail", email);
  setText("profileWard", ward);
  setText("profileResidency", residency);
  setText("profileRegistered", registered);
}

function applyCitizenProfileFallback() {
  citizenProfile.citizenId = null;
  citizenProfile.wardId = null;
  citizenProfile.wardDisplay = "";
  setText("greetName", "Citizen");
  setText("userAvatar", "?");
  setText("userName", "Citizen");
  setText("userRole", "Citizen");
  setText("profileAvatar", "?");
  setText("profileName", "Citizen");
  setText("profileRoleBadge", "Citizen");
  setText("profileFullName", "—");
  setText("profileMobile", "—");
  setText("profileEmail", "—");
  setText("profileWard", "—");
  setText("profileResidency", "—");
  setText("profileRegistered", "—");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatMobile(mobile) {
  if (!mobile) return "—";
  const digits = String(mobile).replace(/\D/g, "");
  if (digits.length === 10) {
    return "+91 " + digits.slice(0, 5) + " " + digits.slice(5);
  }
  return mobile;
}

function formatProfileDate(isoOrDate) {
  if (!isoOrDate) return "—";
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

async function loadCitizenComplaints() {
  const citizenId = localStorage.getItem("citizenId") || citizenProfile.citizenId;
  if (!citizenId) {
    renderComplaints([]);
    updateComplaintStats([]);
    return;
  }

  try {
    const response = await fetch(
      COMPLAINT_API_BASE + "/citizen/" + encodeURIComponent(citizenId)
    );
    if (!response.ok) throw new Error("Failed to load complaints");

    const data = await response.json();
    const list = Array.isArray(data)
      ? data.map(mapApiComplaintToCard)
      : [];
    renderComplaints(list);
    updateComplaintStats(list);
  } catch (_) {
    renderComplaints([]);
    updateComplaintStats([]);
  }
}


async function loadCitizenSuggestions() {
  const citizenId =
    localStorage.getItem("citizenId") ||
    citizenProfile.citizenId;

  if (!citizenId) {
    renderSuggestions([]);
    return;
  }

  try {
    const response = await fetch(
      SUGGESTION_API_BASE + "/my/" + citizenId
    );

    if (!response.ok) throw new Error("Failed to load suggestions");

    const data = await response.json();

    // backend returns: { success: true, data: [...] }
    const list = data.data || [];

    // map API → UI format
    const mapped = list.map(function (s) {
      return {
        id: s.suggestionNumber,
        title: s.title,
        category: s.categoryName || "",   // if not returned, ok
        desc: s.description,
        benefit: s.expectedBenefit,
        date: formatDate(new Date(s.createdDate)),
        status: normalizeSuggestionStatus(s.status),
        scope: s.scope || "Ward"
      };
    });

    renderSuggestions(mapped);

  } catch (err) {
    console.error(err);
    renderSuggestions([]);
  }
}

function normalizeSuggestionStatus(status) {
  if (status === null || status === undefined) return "review";

  // if backend sends number (enum)
  if (typeof status === "number") {
    if (status === 0) return "review";
    if (status === 1) return "accepted";
    if (status === 2) return "rejected";
    return "review";
  }

  // if backend sends string
  const s = String(status).toLowerCase();

  if (s === "pending") return "review";
  if (s === "approved") return "accepted";
  if (s === "rejected") return "rejected";

  return s;
}

function mapApiComplaintToCard(c) {
  return {
    id: c.complaintNumber || ("CMP-" + c.complaintId),
    title: c.title || "",
    category: c.categoryName || "",
    desc: c.description || "",
    location: c.address || "",
    date: formatDate(new Date(c.createdAt)),
    status: normalizeComplaintStatus(c.status),
    priority: (c.priority || "medium").toLowerCase()
  };
}

function normalizeComplaintStatus(status) {
  if (!status) return "pending";
  const s = String(status).toLowerCase().replace(/\s+/g, "");
  if (s === "inprogress") return "inprogress";
  if (s === "pending") return "pending";
  if (s === "resolved") return "resolved";
  if (s === "rejected") return "rejected";
  return s;
}

function updateComplaintStats(complaints) {
  const total = complaints.length;
  const resolved = complaints.filter(function (c) {
    return c.status === "resolved";
  }).length;
  const pending = complaints.filter(function (c) {
    return c.status === "pending" || c.status === "inprogress";
  }).length;

  const statComplaints = document.getElementById("statComplaints");
  const statResolved = document.getElementById("statResolved");
  if (statComplaints) statComplaints.textContent = total;
  if (statResolved) statResolved.textContent = resolved;

  const pendingBadge = document.querySelector("#panel-overview .stat-badge.pending");
  if (pendingBadge) {
    pendingBadge.textContent = pending + (pending === 1 ? " Pending" : " Pending");
  }
}

async function loadComplaintCategories() {
  const select = document.getElementById("complaintCategory");
  if (!select) return;

  const placeholder = '<option value="">— Select Category —</option>';

  try {
    const response = await fetch(COMPLAINT_API_BASE + "/categories");
    if (!response.ok) throw new Error("Categories request failed");

    const categories = await response.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      select.innerHTML = placeholder +
        '<option value="" disabled>— No categories available —</option>';
      return;
    }

    let html = placeholder;
    categories.forEach(function (cat) {
      const id = cat.complaintCategoryId;
      const name = cat.categoryName;
      if (id == null || !name) return;
      html += '<option value="' + escAttr(String(id)) + '">' + escHtml(name) + "</option>";
    });
    select.innerHTML = html;
  } catch (_) {
    select.innerHTML = placeholder +
      '<option value="" disabled>— Could not load categories —</option>';
  }
}

async function loadSuggestionCategories() {
  const select = document.getElementById("suggestionCategory");

  if (!select) return;

  const placeholder =
    '<option value="">— Select Category —</option>';

  try {

    const response = await fetch(
      SUGGESTION_API_BASE + "/categories"
    );

    if (!response.ok)
      throw new Error("Failed to load categories");

    const categories = await response.json();

    if (!Array.isArray(categories) || categories.length === 0) {

      select.innerHTML =
        placeholder +
        '<option disabled>No categories found</option>';

      return;
    }

    let html = placeholder;

    categories.forEach(function (cat) {

      const id =
        cat.suggestionCategoryId;

      const name =
        cat.categoryName;

      if (id == null || !name) return;

      html +=
        '<option value="' +
        escAttr(String(id)) +
        '">' +
        escHtml(name) +
        '</option>';
    });

    select.innerHTML = html;

  } catch (err) {

    select.innerHTML =
      placeholder +
      '<option disabled>Could not load categories</option>';

    console.error(err);
  }
}


function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setDate() {
  const el = document.getElementById("pageDate");
  if (el) {
    const d = new Date();
    el.textContent = d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
}

// ---- Panel switching ----
function showPanel(name, clickedEl) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const panel = document.getElementById("panel-" + name);
  if (panel) panel.classList.add("active");
  if (clickedEl) clickedEl.classList.add("active");
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
  return false;
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  if (sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
  if (hamburger) hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

// ---- Logout ----
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("citizenId");
    window.location.href = "../login/login.html";
  }
}

// ---- Char counters ----
function setupCharCounters() {
  const pairs = [
    ["complaintTitle", "complaintTitleCount"],
    ["complaintDesc", "complaintDescCount"],
    ["suggestionTitle", "suggestionTitleCount"],
    ["suggestionDesc", "suggestionDescCount"],
    ["suggestionBenefit", "suggestionBenefitCount"],
  ];
  pairs.forEach(function (pair) {
    const el = document.getElementById(pair[0]);
    const counter = document.getElementById(pair[1]);
    if (el && counter) {
      el.addEventListener("input", function () { counter.textContent = el.value.length; });
    }
  });
}

// ---- File name display ----
function showFileName(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (input && input.files && input.files[0]) {
    display.textContent = " " + input.files[0].name;
    display.classList.remove("hidden");
  }
}

// ---- Submit Complaint ----
async function submitComplaint(e) {
  e.preventDefault();
  const errEl = document.getElementById("complaintError");
  errEl.classList.add("hidden");

  const catSelect = document.getElementById("complaintCategory");
  const cat       = catSelect.value;
  const priority = document.getElementById("complaintPriority").value;
  const title    = document.getElementById("complaintTitle").value.trim();
  const desc     = document.getElementById("complaintDesc").value.trim();
  const location = document.getElementById("complaintLocation").value.trim();

  if (!cat || !priority || !title || !desc || !location) {
    errEl.textContent = "Please fill all required fields before submitting.";
    errEl.classList.remove("hidden");
    return;
  }

  const citizenId = localStorage.getItem("citizenId") || citizenProfile.citizenId;
  const wardId = citizenProfile.wardId;
  if (!citizenId || !wardId) {
    errEl.textContent = "Unable to verify your profile. Please log in again.";
    errEl.classList.remove("hidden");
    return;
  }

  const fileInput = document.getElementById("complaintFile");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      errEl.textContent = "Attachment must be JPG or PNG format only (max 5 MB).";
      errEl.classList.remove("hidden");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errEl.textContent = "Attachment must not exceed 5 MB.";
      errEl.classList.remove("hidden");
      return;
    }
  }

  const form = document.getElementById("complaintForm");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";
  }

  const fd = new FormData();
  fd.append("CitizenId", citizenId);
  fd.append("WardId", wardId);
  fd.append("ComplaintCategoryId", cat);
  fd.append("Title", title);
  fd.append("Description", desc);
  fd.append("Address", location);
  fd.append("Latitude", "0");
  fd.append("Longitude", "0");
  fd.append("Priority", priority);
  fd.append("IsAnonymous", document.getElementById("complaintAnon").checked ? "true" : "false");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    fd.append("Files", fileInput.files[0]);
  }

  try {
    const response = await fetch(COMPLAINT_API_BASE + "/create", {
      method: "POST",
      body: fd
    });

    let result;
    try {
      result = await response.json();
    } catch (_) {
      throw new Error("Server returned an unexpected response.");
    }

    if (!response.ok) {
      throw new Error(result.message || "Complaint submission failed. Please try again.");
    }

    resetComplaintForm();
    await loadCitizenComplaints();

    const complaintNumber = result.complaintNumber || result.ComplaintNumber || "";
    showToast("", "Complaint submitted successfully! ID: " + complaintNumber);
    showPanel("mycomplaints", document.querySelector("[onclick*=mycomplaints]"));
  } catch (err) {
    errEl.textContent = err.message || "Unable to submit complaint. Please try again.";
    errEl.classList.remove("hidden");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Complaint";
    }
  }
}

function resetComplaintForm() {
  const form = document.getElementById("complaintForm");
  if (form) form.reset();
  document.getElementById("complaintTitleCount").textContent = "0";
  document.getElementById("complaintDescCount").textContent = "0";
  const fileNameEl = document.getElementById("complaintFileName");
  if (fileNameEl) fileNameEl.classList.add("hidden");
  const errEl = document.getElementById("complaintError");
  if (errEl) errEl.classList.add("hidden");
  const wardField = document.getElementById("complaintWard");
  if (wardField) wardField.value = citizenProfile.wardDisplay || "—";
  loadComplaintCategories();
}

// ---- Submit Suggestion ----
function submitSuggestion(e) {
  e.preventDefault();
  const errEl = document.getElementById("suggestionError");
  errEl.classList.add("hidden");

  const cat     = document.getElementById("suggestionCategory").value;
  const scope   = document.getElementById("suggestionScope").value;
  const title   = document.getElementById("suggestionTitle").value.trim();
  const desc    = document.getElementById("suggestionDesc").value.trim();
  const benefit = document.getElementById("suggestionBenefit").value.trim();

  if (!cat || !scope || !title || !desc || !benefit) {
    errEl.textContent = "Please fill all required fields before submitting.";
    errEl.classList.remove("hidden");
    return;
  }

  const fileInput = document.getElementById("complaintFile");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      errEl.textContent = "Attachment must be JPG or PNG format only (max 5 MB).";
      errEl.classList.remove("hidden");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errEl.textContent = "Attachment must not exceed 5 MB.";
      errEl.classList.remove("hidden");
      return;
    }
  }

  const form = document.getElementById("complaintForm");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";
  }

  const fd = new FormData();
  fd.append("CitizenId", citizenId);
  fd.append("WardId", wardId);
  fd.append("ComplaintCategoryId", cat);
  fd.append("Title", title);
  fd.append("Description", desc);
  fd.append("Address", location);
  fd.append("Latitude", "0");
  fd.append("Longitude", "0");
  fd.append("Priority", priority);
  fd.append("IsAnonymous", document.getElementById("complaintAnon").checked ? "true" : "false");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    fd.append("Files", fileInput.files[0]);
  }

  try {
    const response = await fetch(COMPLAINT_API_BASE + "/create", {
      method: "POST",
      body: fd
    });

    let result;
    try {
      result = await response.json();
    } catch (_) {
      throw new Error("Server returned an unexpected response.");
    }

    if (!response.ok) {
      throw new Error(result.message || "Complaint submission failed. Please try again.");
    }

    resetComplaintForm();
    await loadCitizenComplaints();

    const complaintNumber = result.complaintNumber || result.ComplaintNumber || "";
    showToast("", "Complaint submitted successfully! ID: " + complaintNumber);
    showPanel("mycomplaints", document.querySelector("[onclick*=mycomplaints]"));
  } catch (err) {
    errEl.textContent = err.message || "Unable to submit complaint. Please try again.";
    errEl.classList.remove("hidden");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Complaint";
    }
  }
}

function resetComplaintForm() {
  const form = document.getElementById("complaintForm");
  if (form) form.reset();
  document.getElementById("complaintTitleCount").textContent = "0";
  document.getElementById("complaintDescCount").textContent = "0";
  const fileNameEl = document.getElementById("complaintFileName");
  if (fileNameEl) fileNameEl.classList.add("hidden");
  const errEl = document.getElementById("complaintError");
  if (errEl) errEl.classList.add("hidden");
  loadComplaintCategories();
}

function resetSuggestionForm() {

  const form =
    document.getElementById("suggestionForm");

  if (form)
    form.reset();

  document.getElementById(
    "suggestionTitleCount"
  ).textContent = "0";

  document.getElementById(
    "suggestionDescCount"
  ).textContent = "0";

  document.getElementById(
    "suggestionBenefitCount"
  ).textContent = "0";

  const fileNameEl =
    document.getElementById(
      "suggestionFileName"
    );

  if (fileNameEl)
    fileNameEl.classList.add("hidden");

  const errEl =
    document.getElementById(
      "suggestionError"
    );

  if (errEl)
    errEl.classList.add("hidden");

  loadSuggestionCategories();
}

// ---- Submit Suggestion ----
// function submitSuggestion(e) {
//   e.preventDefault();
//   const errEl = document.getElementById("suggestionError");
//   errEl.classList.add("hidden");

//   const cat     = document.getElementById("suggestionCategory").value;
//   const scope   = document.getElementById("suggestionScope").value;
//   const title   = document.getElementById("suggestionTitle").value.trim();
//   const desc    = document.getElementById("suggestionDesc").value.trim();
//   const benefit = document.getElementById("suggestionBenefit").value.trim();

//   if (!cat || !scope || !title || !desc || !benefit) {
//     errEl.textContent = "Please fill all required fields before submitting.";
//     errEl.classList.remove("hidden");
//     return;
//   }

//   const newId = "SUG-00" + (SUGGESTIONS.length + 1);
//   SUGGESTIONS.unshift({ id: newId, title: title, category: cat, desc: desc, benefit: benefit, date: formatDate(new Date()), status: "review", scope: scope });
//   renderSuggestions(SUGGESTIONS);

//   document.getElementById("suggestionForm").reset();
//   document.getElementById("suggestionTitleCount").textContent = "0";
//   document.getElementById("suggestionDescCount").textContent = "0";
//   document.getElementById("suggestionBenefitCount").textContent = "0";
//   document.getElementById("suggestionFileName").classList.add("hidden");

//   showToast("", "Suggestion submitted successfully! ID: " + newId);
//   showPanel("mysuggestions", document.querySelector("[onclick*=mysuggestions]"));
// }

// ---- Submit Suggestion ----
async function submitSuggestion(e) {
  e.preventDefault();

  const errEl = document.getElementById("suggestionError");
  errEl.classList.add("hidden");

  const categoryId =
    document.getElementById("suggestionCategory").value;

  const scope =
    document.getElementById("suggestionScope").value;

  const title =
    document.getElementById("suggestionTitle").value.trim();

  const desc =
    document.getElementById("suggestionDesc").value.trim();

  const benefit =
    document.getElementById("suggestionBenefit").value.trim();

  // Validation
  if (!categoryId || !scope || !title || !desc || !benefit) {
    errEl.textContent =
      "Please fill all required fields.";

    errEl.classList.remove("hidden");
    return;
  }

  const citizenId =
    localStorage.getItem("citizenId") ||
    citizenProfile.citizenId;

  const wardId =
    citizenProfile.wardId;

  if (!citizenId || !wardId) {
    errEl.textContent =
      "Citizen profile not found. Please login again.";

    errEl.classList.remove("hidden");
    return;
  }

  // Convert scope string to enum number
  let benefitScope = 0;

  if (scope === "street") {
    benefitScope = 0;
  }
  else if (scope === "ward") {
    benefitScope = 1;
  }
  else if (scope === "city") {
    benefitScope = 2;
  }

  // Create request object
  const requestBody = {
    citizenId: parseInt(citizenId),
    wardId: parseInt(wardId),
    suggestionCategoryId: parseInt(categoryId),
    title: title,
    description: desc,
    expectedBenefit: benefit,
    benefitScope: benefitScope,
    isAnonymous: false
  };

  try {

    const response = await fetch(
      "http://localhost:5079/api/suggestions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(requestBody)
      });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Suggestion submission failed."
      );
    }

    // Success
    document.getElementById("suggestionForm").reset();

    document.getElementById(
      "suggestionTitleCount"
    ).textContent = "0";

    document.getElementById(
      "suggestionDescCount"
    ).textContent = "0";

    document.getElementById(
      "suggestionBenefitCount"
    ).textContent = "0";

    document.getElementById(
      "suggestionFileName"
    ).classList.add("hidden");

    showToast(
      "✅",
      "Suggestion submitted successfully!"
    );

    showPanel(
      "mysuggestions",
      document.querySelector(
        "[onclick*=mysuggestions]"
      )
    );

  } catch (err) {

    errEl.textContent =
      err.message ||
      "Unable to submit suggestion.";

    errEl.classList.remove("hidden");
  }
}

// ---- Reset form ----
function resetForm(formId, errId) {
  if (formId === "complaintForm") {
    resetComplaintForm();
    return;
  }
  document.getElementById(formId).reset();
  document.getElementById(errId).classList.add("hidden");
  ["complaintTitleCount","complaintDescCount","suggestionTitleCount","suggestionDescCount","suggestionBenefitCount"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "0";
  });
  ["complaintFileName","suggestionFileName"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

// ---- Render complaints ----
function renderComplaints(data) {
  const list = document.getElementById("complaintsList");
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon"></div><div>No complaints found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function (c) {
    return '<div class="item-card" data-status="' + c.status + '" data-title="' + c.title.toLowerCase() + '">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(c.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(c.category) + ' &nbsp;&nbsp; ' + escHtml(c.id) + '</div></div>' +
        '<span class="status-pill ' + c.status + '">' + statusLabel(c.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(c.desc) + '</div>' +
      '<div class="item-card-footer">' +
        '<span class="item-card-date"> ' + c.date + '</span>' +
        '<span class="item-card-date"> ' + escHtml(c.location) + '</span>' +
        '<span class="priority-pill ' + c.priority + '">' + c.priority.toUpperCase() + '</span>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Render suggestions ----
function renderSuggestions(data) {
  const list = document.getElementById("suggestionsList");
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon"></div><div>No suggestions found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function (s) {
    return '<div class="item-card" data-status="' + s.status + '" data-title="' + s.title.toLowerCase() + '">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(s.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(s.category) + ' &nbsp;&nbsp; ' + escHtml(s.id) + '</div></div>' +
        '<span class="status-pill ' + s.status + '">' + statusLabel(s.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(s.desc) + '</div>' +
      '<div class="item-card-footer">' +
        '<span class="item-card-date"> ' + s.date + '</span>' +
        '<span class="item-card-date"> Scope: ' + escHtml(s.scope) + '</span>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Filter ----
function filterItems(type, status) {
  const listId = type === "complaint" ? "complaintsList" : "suggestionsList";
  const cards = document.querySelectorAll("#" + listId + " .item-card");
  cards.forEach(function (card) {
    const match = status === "all" || card.dataset.status === status;
    card.style.display = match ? "" : "none";
  });
}

// ---- Search ----
function searchItems(type, query) {
  const listId = type === "complaint" ? "complaintsList" : "suggestionsList";
  const cards = document.querySelectorAll("#" + listId + " .item-card");
  const q = query.toLowerCase();
  cards.forEach(function (card) {
    const match = !q || (card.dataset.title || "").includes(q);
    card.style.display = match ? "" : "none";
  });
}

// ---- Helpers ----
function statusLabel(s) {
  const map = { pending: "Pending", inprogress: "In Progress", resolved: "Resolved", review: "Under Review", accepted: "Accepted", implemented: "Implemented", rejected: "Not Accepted" };
  return map[s] || s;
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function showToast(icon, msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastIcon").textContent = icon;
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(function () { toast.classList.add("hidden"); }, 4000);
}
