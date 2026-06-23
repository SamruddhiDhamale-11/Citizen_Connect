  /* ============================================================
    CITIZEN CONNECT — Dashboard Logic
    ============================================================ */
  "use strict";

  const CITIZEN_API_BASE   = "http://localhost:5079/api/citizen";
  const COMPLAINT_API_BASE = "http://localhost:5079/api/Complaint";

  const SUGGESTION_API_BASE = "http://localhost:5079/api/suggestions";
  const DEPARTMENT_API_BASE = "http://localhost:5079/api/departments";

  const citizenProfile = { citizenId: null, wardId: null, wardDisplay: "" };
  let map;
let marker;
let wardBoundaryLayer;
let wardBoundaryGeoJson;

let selectedLatitude = null;
let selectedLongitude = null;

  let complaintData = [];
  let suggestionData = [];

  // ---- Init ----
  document.addEventListener(
      "DOMContentLoaded",
      async function () {
    if (!requireCitizenSession()) return;

    setDate();
    setupCharCounters();
    // loadComplaintCategories();

  if (selectedDeptId) {
      loadComplaintCategoriesByDepartment(selectedDeptId);
  }
    loadComplaintLocalities();
    loadSuggestionCategories();
    await loadDepartments();
    

    loadCitizenProfile().then(async function () {

      await loadCitizenComplaints();

      await loadCitizenSuggestions();
  });

  });

  function requireCitizenSession() {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    if (!userId || role !== "Citizen") {
      window.location.href = "../home/login/citizen/citizen-login.html";
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

    window.currentCitizenProfile = profile;

    const wardField = document.getElementById("complaintWard");
    if (wardField) wardField.value = ward;

    setText("greetName", firstName);
    setText("userAvatar", initials);
    setText("userName", fullName);
    setText("userRole", wardLine);
    setText("profileAvatar", initials);
    setText("profileName", fullName);
    setText("profileRoleBadge", wardLine);
   const fullNameInput =
    document.getElementById("profileFullName");

if (fullNameInput)
    fullNameInput.value = fullName;

const mobileInput =
    document.getElementById("profileMobile");

if (mobileInput)
    mobileInput.value = profile.mobileNo || "";

const emailInput =
    document.getElementById("profileEmail");

if (emailInput)
    emailInput.value = email === "—" ? "" : email;
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

  async function updateProfile() {

    const citizenId =
        localStorage.getItem("citizenId");

    if (!citizenId) {
        alert("Citizen not found.");
        return;
    }

    const fullName =
        document.getElementById("profileFullName").value.trim();

    const mobileNo =
        document.getElementById("profileMobile").value.trim();

    const email =
        document.getElementById("profileEmail").value.trim();

    const parts =
        fullName.split(" ");

    const firstName =
        parts[0] || "";

    const lastName =
        parts.length > 1
            ? parts[parts.length - 1]
            : "";

    const middleName =
        parts.length > 2
            ? parts.slice(1, -1).join(" ")
            : "";

    const payload = {
        firstName,
        middleName,
        lastName,
        mobileNo,
        whatsappNo: mobileNo,
        email
    };

    try {

        const response =
            await fetch(
                CITIZEN_API_BASE +
                "/profile/" +
                citizenId,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(payload)
                });

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Update failed");
        }

        alert(
            "Profile updated successfully");

        await loadCitizenProfile();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to update profile");
    }
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
      complaintData = list;
      renderComplaints(list);
      const statComplaints =
    document.getElementById("statComplaints");

if (statComplaints) {
    statComplaints.textContent = list.length;
}
      updateComplaintStats(list);
    } catch (_) {
      renderComplaints([]);
      updateComplaintStats([]);
      renderRecentActivity();
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

          suggestionId:
              s.suggestionId,

          id:
              s.suggestionNumber,

          title:
              s.title,

          category:
              s.categoryName || "",

          desc:
              s.description,

          imageUrl:
              s.imageUrl,

          benefit:
              s.expectedBenefit,

          date:
              formatDate(
                  new Date(
                      s.createdDate
                  )
              ),

          status:
              normalizeSuggestionStatus(
                  s.statusName
              ),

          remark:
              s.latestRemark || "",

          scope:
              s.scope || "Ward"
      };
  });

      renderSuggestions(mapped);
      renderRecentActivity();

      const statSuggestions =
    document.getElementById("statSuggestions");

if (statSuggestions) {
    statSuggestions.textContent = mapped.length;
}

const civicScore =
    document.getElementById("civicScore");

if (civicScore) {
    civicScore.textContent =
        (complaintData.length * 10) +
        (mapped.length * 5);
}


    } catch (err) {
      console.error(err);
      renderSuggestions([]);
    }
  }

  function renderRecentActivity() {

    const container =
        document.getElementById("recentActivityList");

    if (!container) return;

    let activities = [];

    complaintData.forEach(c => {
        activities.push({
            type: "complaint",
            title: c.title,
            status: c.status,
            date: c.createdAt || c.date || ""
        });
    });

    suggestionData.forEach(s => {
        activities.push({
            type: "suggestion",
            title: s.title,
            status: s.status,
            date: s.createdAt || s.date || ""
        });
    });

    activities.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    activities = activities.slice(0, 5);

    container.innerHTML = activities.map(item => `
        <div class="activity-item">
            <div class="activity-dot ${item.type}"></div>

            <div class="activity-body">
                <div class="activity-title">
                    ${item.title}
                </div>

                <div class="activity-meta">
                    ${item.status}
                </div>
            </div>
        </div>
    `).join("");
}

  async function viewSuggestionHistory(suggestionId)
  {
      try
      {
          const response =
              await fetch(
                  `http://localhost:5079/api/suggestions/history/${suggestionId}`
              );

          const result = await response.json();

          const history = result.data || [];

          const body =
              document.getElementById(
                  "suggestionHistoryBody"
              );

          body.innerHTML =
              history.map(h => `

                  <div class="history-item">

                      <div class="history-dot"></div>

                      <div class="history-content">

                          <div class="history-status">

                              ${h.oldStatus}

                              <span class="arrow">→</span>

                              ${h.newStatus}

                          </div>

                          <div class="history-date">

                              ${new Date(
                                  h.changedAt
                              ).toLocaleDateString()}

                          </div>

                          <div class="history-remarks">

                              ${h.remarks || ""}

                          </div>

                      </div>

                  </div>

              `).join("");

          document
              .getElementById(
                  "suggestionHistoryModal"
              )
              .classList
              .remove("hidden");
      }
      catch (e)
      {
          console.error(e);
      }
  }

  function closeSuggestionHistory() { 
    document .getElementById( "suggestionHistoryModal" ) .classList .add("hidden"); 
  }

  function normalizeSuggestionStatus(status)
  {
      if (!status)
          return "pending";

      const s =
          String(status).toLowerCase();

      if (s === "pending")
          return "pending";

      if (s === "under review")
          return "pending";

      if (s === "approved")
          return "approved";

      if (s === "implemented")
          return "implemented";

      if (s === "rejected")
          return "rejected";

      return "pending";
  }

  function mapApiComplaintToCard(c) {
    return {
      id: c.complaintNumber || ("CMP-" + c.complaintId),
      title: c.title || "",
      category: c.categoryName || "",
      desc: c.description || "",
      imageUrl: c.imageUrl, 
      officerName: c.officerName,
      officerMobile: c.officerMobileNumber,
      officerEmail: c.officerEmail,
      officerDesignation: c.officerDesignation,
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

  async function loadComplaintCategoriesByDepartment(departmentId)
  {
      try
      {
          const response = await fetch(
              `http://localhost:5079/api/Admin/categories/by-department/${departmentId}`
          );

          const result = await response.json();

          const select =
              document.getElementById("complaintCategory");

          if (!select) return;

          select.innerHTML =
              '<option value="">-- Select Category --</option>';

          result.data.forEach(category =>
          {
              select.innerHTML += `
                  <option value="${category.complaintCategoryId}">
                      ${category.categoryName}
                  </option>
              `;
          });
      }
      catch(error)
      {
          console.error(error);
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

  async function loadSuggestionCategoriesByDepartment(departmentId)
  {
      const select =
          document.getElementById(
              "suggestionCategory"
          );

      if (!select) return;

      try
      {
          const response = await fetch(
              `${SUGGESTION_API_BASE}/categories/by-department/${departmentId}`
          );

          const categories =
              await response.json();

          select.innerHTML =
              '<option value="">— Select Category —</option>';

          categories.forEach(cat =>
          {
              select.innerHTML += `
                  <option value="${cat.suggestionCategoryId}">
                      ${cat.categoryName}
                  </option>
              `;
          });
      }
      catch(error)
      {
          console.error(error);
      }
  }

  async function loadDepartments() {

      try {

          const response = await fetch(
              DEPARTMENT_API_BASE
          );

          if (!response.ok) {
              throw new Error("Failed to load departments");
          }

        let data = await response.json();

  data.push({
      departmentId: 99999,
      departmentName: "Other Department",
      description: "Department not listed above",
      iconName: "other",
      themeColor: "gray"
  });

          DEPT_CARDS = data.map(function (d) {

      return {
          id: d.departmentId,
          name: d.departmentName,
          description: d.description || "",
          iconName: d.iconName || "civic",
          theme: d.themeColor || "gray"
      };

  });

          renderDeptGrid(
      "deptGrid",
      "selectDepartment"
  );

  renderDeptGrid(
      "suggDeptGrid",
      "selectSuggDepartment"
  );
      }
      catch (err) {

          console.error(
              "Department Load Error",
              err
          );
      }
  }

  function getDepartmentTheme(name) {

      const themes = {

          "Roads & Potholes": "orange",
          "Water Supply & Leakage": "blue",
          "Garbage & Sanitation": "green",
          "Streetlights & Electricity": "yellow",
          "Drainage & Sewage": "teal",
          "Public Electricity Issues": "amber",
          "Illegal Construction & Encroachment": "red",
          "Traffic & Parking Issues": "purple",
          "Noise Pollution": "indigo",
          "Other Civic Issues": "gray",
          "Waterlogging & Flooding": "cyan",
          "Public Safety & Security": "darkblue",
          "Parks & Public Spaces": "emerald",
          "Animal & Stray Dog Issues": "brown",
          "Government Property Damage": "slate",
          "Air Pollution": "sky"

      };

      return themes[name] || "gray";
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
    window.location.href = "../home/login/citizen/citizen-login.html";
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
const cat = catSelect.value;

const priority =
    document.getElementById("complaintPriority").value;

const title =
    document.getElementById("complaintTitle").value.trim();

const desc =
    document.getElementById("complaintDesc").value.trim();

const location =
    document.getElementById("complaintAddress").value.trim();

const latitude =
    document.getElementById("latitude").value.trim();

const longitude =
    document.getElementById("longitude").value.trim();

if (!cat || !priority || !title || !desc || !location) {
    errEl.textContent =
        "Please fill all required fields before submitting.";
    errEl.classList.remove("hidden");
    return;
}

if (!latitude || !longitude) {
    errEl.textContent =
        "Please select location on map.";
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
        "Unable to verify your profile. Please log in again.";
    errEl.classList.remove("hidden");
    return;
}

const fileInput =
    document.getElementById("complaintFile");

if (
    fileInput &&
    fileInput.files &&
    fileInput.files.length > 0
) {
    const file = fileInput.files[0];

    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    if (!allowed.includes(file.type)) {
        errEl.textContent =
            "Attachment must be JPG or PNG format only (max 5 MB).";
        errEl.classList.remove("hidden");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        errEl.textContent =
            "Attachment must not exceed 5 MB.";
        errEl.classList.remove("hidden");
        return;
    }
}

const form =
    document.getElementById("complaintForm");

const submitBtn =
    form
        ? form.querySelector('button[type="submit"]')
        : null;

if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
}

const fd = new FormData();

fd.append("CitizenId", citizenId);
fd.append("WardId", wardId);
fd.append("ComplaintCategoryId", cat);
fd.append("Title", title);

const categoryName =
    catSelect.options[
        catSelect.selectedIndex
    ].text;

fd.append("CategoryName", categoryName);
fd.append("Description", desc);
fd.append("Address", location);

fd.append("Latitude", latitude);
fd.append("Longitude", longitude);

fd.append("Priority", priority);

fd.append(
    "IsAnonymous",
    document.getElementById("complaintAnon").checked
        ? "true"
        : "false"
);

if (
    fileInput &&
    fileInput.files &&
    fileInput.files.length > 0
) {
    fd.append(
        "Files",
        fileInput.files[0]
    );
}

console.log("Latitude:", latitude);
console.log("Longitude:", longitude);

try {
    const response = await fetch(
        COMPLAINT_API_BASE + "/create",
        {
            method: "POST",
            body: fd
        }
    );

    const result =
        await response.json();

    if (!response.ok) {

    showToast(
        "Error",
        result.message ||
        "Complaint submission failed."
    );

    return;
}

    resetComplaintForm();

    await loadCitizenComplaints();

    const complaintNumber =
        result.complaintNumber ||
        result.ComplaintNumber ||
        "";

    showToast(
        "",
        "Complaint submitted successfully! ID: " +
        complaintNumber
    );

    showPanel(
        "mycomplaints",
        document.querySelector(
            "[onclick*=mycomplaints]"
        )
    );
}
catch (err) {
    console.error(err);

    errEl.textContent =
        err.message ||
        "Unable to submit complaint.";

    errEl.classList.remove("hidden");
}
finally {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
            "Submit Complaint";
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
    if (selectedDeptId) {
      loadComplaintCategoriesByDepartment(selectedDeptId);
  }
  }

  // ---- Submit Suggestion ----

  // ---- Submit Suggestion (correct implementation below) ----


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

      const errEl =
          document.getElementById(
              "suggestionError"
          );

      errEl.classList.add("hidden");

      const citizenId =
          localStorage.getItem("citizenId") ||
          citizenProfile.citizenId;

      const wardId =
          citizenProfile.wardId;

      const categoryId =
          document.getElementById(
              "suggestionCategory"
          ).value;

      const title =
          document.getElementById(
              "suggestionTitle"
          ).value.trim();

      const description =
          document.getElementById(
              "suggestionDesc"
          ).value.trim();

      const benefit =
          document.getElementById(
              "suggestionBenefit"
          ).value.trim();

      const scope =
          document.getElementById(
              "suggestionScope"
          ).value;

      if (
      !categoryId ||
      !scope ||
      !title ||
      !description ||
      !benefit
  ) {
          errEl.textContent =
              "Please fill all required fields.";

          errEl.classList.remove(
              "hidden"
          );

          return;
      }

      let benefitScope = 0;

      if (scope === "ward")
          benefitScope = 1;

      if (scope === "city")
          benefitScope = 2;

      const formData =
          new FormData();

      formData.append(
          "CitizenId",
          citizenId
      );

      formData.append(
          "WardId",
          wardId
      );

      formData.append(
          "SuggestionCategoryId",
          categoryId
      );

      formData.append(
          "Title",
          title
      );

      formData.append(
          "Description",
          description
      );

      formData.append(
          "ExpectedBenefit",
          benefit
      );

      formData.append(
          "BenefitScope",
          benefitScope
      );

      formData.append(
          "IsAnonymous",
          document.getElementById(
              "suggestionAnon"
          ).checked
      );

      const file =
          document.getElementById(
              "suggestionFile"
          ).files[0];

      if (file) {
          formData.append(
              "Attachment",
              file
          );
      }

      try {

          const response =
              await fetch(
                  "http://localhost:5079/api/suggestions",
                  {
                      method: "POST",
                      body: formData
                  }
              );

          const result =
              await response.json();

          if (!response.ok) {
              throw new Error(
                  result.message
              );
          }

          resetSuggestionForm();

          await loadCitizenSuggestions();

          showToast(
      "",
      "Suggestion submitted successfully"
  );

          showPanel(
              "mysuggestions",
              document.querySelector(
                  "[onclick*=mysuggestions]"
              )
          );

      }
      catch (err) {

          errEl.textContent =
              err.message;

          errEl.classList.remove(
              "hidden"
          );
      }
  }

  // ---- Reset form ----
  function resetForm(formId, errId) {
    if (formId === "complaintForm") {
      resetComplaintForm();
      return;
    }
    if (formId === "suggestionForm") {
      resetSuggestionForm();
      return;
    }
    const formEl = document.getElementById(formId);
    if (formEl) formEl.reset();
    const errEl = document.getElementById(errId);
    if (errEl) errEl.classList.add("hidden");
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
        '<div class="item-card-desc">' +
escHtml(c.desc) +
'</div>' +

(c.imageUrl ?
'<div class="suggestion-image">' +
'<img src="' + c.imageUrl + '" alt="Complaint">' +
'</div>'
: '') +
          '<div class="item-card-footer">' +

        '<span class="item-card-date"> ' + c.date + '</span>' +

       '<span class="item-card-location">' + escHtml(c.location) + '</span>' +

        '<span class="priority-pill ' + c.priority + ' complaint-priority">' +
          c.priority.toUpperCase() +
      '</span>' +

      (
          c.status === "inprogress" ||
          c.status === "resolved"
      ?
      '<button class="btn-outline officer-btn" ' +
      'onclick="showOfficerDetails(\'' + c.id + '\')">' +
      '👮 View Officer' +
      '</button>'
      : ''
      ) +

  '</div>'+
      '</div>';
    }).join("");
  }

  // ---- Render suggestions ----
  function renderSuggestions(data) {

      const list =
          document.getElementById("suggestionsList");

      if (!list) return;

      if (!data.length) {

          list.innerHTML =
              `<div class="item-empty">
                  <div class="item-empty-icon"></div>
                  <div>No suggestions found.</div>
              </div>`;

          return;
      }

      list.innerHTML =
          data.map(function (s) {

              return `
                  <div class="item-card"
                      data-status="${s.status}"
                      data-title="${s.title.toLowerCase()}">

                      <div class="item-card-top">

                          <div>

                              <div class="item-card-title">
                                  ${escHtml(s.title)}
                              </div>

                              <div class="item-card-cat">
                                  ${escHtml(s.category)}
                                  &nbsp;&nbsp;
                                  ${escHtml(s.id)}
                              </div>

                          </div>

                          <span class="status-pill ${s.status}">
                              ${statusLabel(s.status)}
                          </span>

                      </div>

                      <div class="item-card-desc">
                          ${escHtml(s.desc)}
                      </div>
  ${s.imageUrl ? `
  <div class="suggestion-image">

      <img
          src="${s.imageUrl}"
          alt="Suggestion">

  </div>
  ` : ''}
                
                    

                      <div class="item-card-footer">

                          <span class="item-card-date">
                              ${s.date}
                          </span>

                          <span class="item-card-date">
                              Scope: ${escHtml(s.scope)}
                          </span>

                          <button
                              type="button"
                              class="btn-outline"
                              onclick="viewSuggestionHistory(${s.suggestionId})">

                              Status History

                          </button>

                      </div>

                  </div>
              `;

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
    const map = {
      pending: "Pending",
      inprogress: "In Progress",
      resolved: "Resolved",
      review: "Under Review",
      approved: "Approved",
      implemented: "Implemented",
      rejected: "Rejected"
    };

    return map[s] || s;
  }

  function updateSuggestionStats(suggestions) {

      const statSuggestions =
          document.getElementById("statSuggestions");

      if (statSuggestions) {
          statSuggestions.textContent =
              suggestions.length;
      }
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

  function showOfficerDetails(complaintId)
  {
      const complaint =
          complaintData.find(
              x => x.id === complaintId
          );

      if (!complaint)
      {
          alert("Officer details not available.");
          return;
      }

      document.getElementById("officerName").textContent =
          complaint.officerName || "Not Assigned";

      document.getElementById("officerDesignation").textContent =
          complaint.officerDesignation || "-";

      document.getElementById("officerMobile").textContent =
          complaint.officerMobile || "-";

      document.getElementById("officerEmail").textContent =
          complaint.officerEmail || "-";

      document.getElementById("officerModal")
          .classList.remove("hidden");
  }

  function closeOfficerModal()
  {
      document.getElementById("officerModal")
          .classList.add("hidden");
  }

  /* ================================================================
    DEPARTMENT SELECTION DASHBOARD — SHARED CONFIG
    ================================================================ */

  /**
   * Single source of truth for all 16 department cards.
   * Each entry provides the data needed to render a card in ANY panel
   * (complaint or suggestion) without duplicating HTML.
   */
  let DEPT_CARDS = [];

  /**
   * Builds and injects the 16 department cards into a target grid element.
   * Icons are cloned from the complaint panel's existing rendered cards
   * so there is zero SVG duplication.
   *
   * @param {string} gridId        - id of the <div class="dept-grid"> to populate
   * @param {string} onclickFn     - JS function name to call on card click
   */

  function getDepartmentIcon(iconName) {

      const icons = {

          road: "🛣️",          // Roads
          water: "💧",         // Water Supply
          garbage: "♻️",       // Garbage
          streetlight: "💡",   // Street Light
          drainage: "🚰",      // Drainage
          electricity: "⚡",   // Electricity
          building: "🏗️",      // Construction
          traffic: "🚦",       // Traffic
          noise: "📢",         // Noise
          civic: "🏛️",         // Civic Issues
          flood: "🌊",         // Flooding
          security: "👮",      // Public Safety
          park: "🌳",          // Parks
          animal: "🐕",        // Stray Animals
          property: "🏢",      // Government Property
          air: "🏭",          // Air Pollution
          smartcity: "🌐",      // Smart City
          other: "📋"
          
      };

      return icons[iconName] || "📝";
  }

  function renderDeptGrid(gridId, onclickFn) {
    const targetGrid = document.getElementById(gridId);
    if (!targetGrid) return;

    // Source cards already rendered in the complaint panel — clone their icons
    
    targetGrid.innerHTML = "";

    DEPT_CARDS.forEach(function (dept, index) {
      const escapedName = dept.name.replace(/&/g, "&amp;");
      const jsName      = dept.name.replace(/'/g, "\\'");

      const delay = ((index + 1) * 0.02).toFixed(2);

      const card = document.createElement("div");
      card.className = "dept-card dept-card--" + dept.theme;
      card.dataset.deptId   = dept.id;
      card.dataset.deptName = escapedName;
      card.setAttribute("onclick", onclickFn + "(" + dept.id + ",'" + jsName + "')");
      card.style.animationDelay = delay + "s";

      card.innerHTML =
        '<div class="dept-card-inner">' +
        '<div class="dept-card-icon-wrap">' +
  getDepartmentIcon(dept.iconName) +
  '</div>' +
          '<div class="dept-card-name">' + escapedName + '</div>' +
          '<div class="dept-card-arrow">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="m9 18 6-6-6-6"/>' +
            '</svg>' +
          '</div>' +
        '</div>';

      targetGrid.appendChild(card);
    });
  }

  /* ================================================================
    COMPLAINT DEPARTMENT FLOW
    ================================================================ */

  /** Currently selected department state — complaint */
  let selectedDeptId   = null;
  let selectedDeptName = "";

  /**
   * Called when user clicks a department card in the complaint panel.
   */
  function selectDepartment(deptId, deptName) {

      selectedDeptId = deptId;
      selectedDeptName = deptName;

      document.querySelectorAll("#deptGrid .dept-card")
          .forEach(card => card.classList.remove("selected"));

      const clickedCard =
          document.querySelector(
              '#deptGrid .dept-card[data-dept-id="' + deptId + '"]'
          );

      if (clickedCard)
          clickedCard.classList.add("selected");

      loadComplaintCategoriesByDepartment(deptId);

      setTimeout(() => {
          showComplaintForm(deptId, deptName);
      }, 200);
  }

  /**
   * Transitions from department selection to the complaint form.
   */
  function showComplaintForm(deptId, deptName) {

      document.getElementById("dept-selection-view")
          .classList.add("hidden");

      document.getElementById("complaint-form-view")
          .classList.remove("hidden");

      document.getElementById("selectedDeptNameDisplay")
          .textContent = deptName;

      loadComplaintCategoriesByDepartment(deptId);

      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
  }

  /**
   * Pre-fills the complaint category dropdown based on the selected department.
   */
  function prefillDepartmentField(deptId, deptName) {
    const catSelect = document.getElementById("complaintCategory");
    if (!catSelect) return;

    let matched = false;
    const opts = catSelect.options;
    for (let i = 0; i < opts.length; i++) {
      const optText = opts[i].text.toLowerCase();
      const deptLow = deptName.toLowerCase().replace(/&amp;/g, "&");
      if (optText.includes(deptLow.split(" ")[0]) || deptLow.includes(optText.split(" ")[0])) {
        catSelect.value = opts[i].value;
        matched = true;
        break;
      }
    }

    let note = document.getElementById("deptPreSelectNote");
    if (!note) {
      note = document.createElement("div");
      note.id = "deptPreSelectNote";
      note.className = "dept-preselect-note";
      catSelect.parentNode.appendChild(note);
    }

    if (matched) {
      catSelect.classList.add("readonly-input");
      catSelect.setAttribute("data-dept-locked", "true");
      note.textContent = "";
  } else {
      note.textContent = "";
  }
  }

  /**
   * Goes back to the complaint department selection view.
   */
  function changeDepartment() {
    document.getElementById("complaint-form-view").classList.add("hidden");
    document.getElementById("dept-selection-view").classList.remove("hidden");

    const catSelect = document.getElementById("complaintCategory");
    if (catSelect) {
      catSelect.classList.remove("readonly-input");
      catSelect.removeAttribute("data-dept-locked");
    }
    const note = document.getElementById("deptPreSelectNote");
    if (note) note.textContent = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Filters complaint department cards by search query.
   */
  function filterDepartments(query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll("#deptGrid .dept-card");
    let visible = 0;

    cards.forEach(function (card) {
      const name = (card.dataset.deptName || "").toLowerCase().replace(/&amp;/g, "&");
      const show = !q || name.includes(q);
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    const noResults = document.getElementById("deptNoResults");
    const termEl    = document.getElementById("deptSearchTerm");
    if (noResults) {
      if (visible === 0 && q) {
        if (termEl) termEl.textContent = query;
        noResults.classList.remove("hidden");
      } else {
        noResults.classList.add("hidden");
      }
    }
  }

  /* ================================================================
    SUGGESTION DEPARTMENT FLOW
    ================================================================ */

  /** Currently selected department state — suggestion */
  let selectedSuggDeptId   = null;
  let selectedSuggDeptName = "";

  /**
   * Called when user clicks a department card in the suggestion panel.
   */
  function selectSuggDepartment(deptId, deptName) {
    selectedSuggDeptId   = deptId;
    selectedSuggDeptName = deptName;

    document.querySelectorAll("#suggDeptGrid .dept-card").forEach(function (card) {
      card.classList.remove("selected");
    });
    const clickedCard = document.querySelector('#suggDeptGrid .dept-card[data-dept-id="' + deptId + '"]');
    if (clickedCard) clickedCard.classList.add("selected");

    setTimeout(function () {
      showSuggestionForm(deptId, deptName);
    }, 180);
  }

  /**
   * Transitions from department selection to the suggestion form.
   */
  function showSuggestionForm(deptId, deptName) {

    document.getElementById("sugg-selection-view")
        .classList.add("hidden");

    document.getElementById("suggestion-form-view")
        .classList.remove("hidden");

    const nameDisplay =
        document.getElementById(
            "selectedSuggDeptNameDisplay"
        );

    if (nameDisplay)
        nameDisplay.textContent = deptName;

    prefillSuggDepartmentField(
        deptId,
        deptName
    );

  loadSuggestionCategoriesByDepartment(deptId);

    loadSuggestionCategoriesByDepartment(
        deptId
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
  }

  /**
   * Pre-fills the suggestion category dropdown based on the selected department.
   */
  function prefillSuggDepartmentField(deptId, deptName) {
    const catSelect = document.getElementById("suggestionCategory");
    if (!catSelect) return;

    let matched = false;
    const opts = catSelect.options;
    for (let i = 0; i < opts.length; i++) {
      const optText = opts[i].text.toLowerCase();
      const deptLow = deptName.toLowerCase().replace(/&amp;/g, "&");
      if (optText.includes(deptLow.split(" ")[0]) || deptLow.includes(optText.split(" ")[0])) {
        catSelect.value = opts[i].value;
        matched = true;
        break;
      }
    }

    let note = document.getElementById("suggDeptPreSelectNote");
    if (!note) {
      note = document.createElement("div");
      note.id = "suggDeptPreSelectNote";
      note.className = "dept-preselect-note";
      catSelect.parentNode.appendChild(note);
    }

    if (matched) {
      catSelect.classList.add("readonly-input");
      catSelect.setAttribute("data-dept-locked", "true");
      note.textContent = "";
  } else {
      note.textContent = "";
  }
  }

  /**
   * Goes back to the suggestion department selection view.
   */
  function changeSuggDepartment() {
    document.getElementById("suggestion-form-view").classList.add("hidden");
    document.getElementById("sugg-selection-view").classList.remove("hidden");

    const catSelect = document.getElementById("suggestionCategory");
    if (catSelect) {
      catSelect.classList.remove("readonly-input");
      catSelect.removeAttribute("data-dept-locked");
    }
    const note = document.getElementById("suggDeptPreSelectNote");
    if (note) note.textContent = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * Filters suggestion department cards by search query.
   */
  function filterSuggDepartments(query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll("#suggDeptGrid .dept-card");
    let visible = 0;

    cards.forEach(function (card) {
      const name = (card.dataset.deptName || "").toLowerCase().replace(/&amp;/g, "&");
      const show = !q || name.includes(q);
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    const noResults = document.getElementById("suggDeptNoResults");
    const termEl    = document.getElementById("suggDeptSearchTerm");
    if (noResults) {
      if (visible === 0 && q) {
        if (termEl) termEl.textContent = query;
        noResults.classList.remove("hidden");
      } else {
        noResults.classList.add("hidden");
      }
    }
  }

  /* ================================================================
    PANEL SWITCHING — handles both complaint + suggestion dept reset
    ================================================================ */
  function showPanel(name, clickedEl) {
    // Reset complaint dept step
    if (name === "complaint") {
      const deptView = document.getElementById("dept-selection-view");
      const formView = document.getElementById("complaint-form-view");
      if (deptView) deptView.classList.remove("hidden");
      if (formView) formView.classList.add("hidden");
      selectedDeptId   = null;
      selectedDeptName = "";
      document.querySelectorAll("#deptGrid .dept-card").forEach(function (c) { c.classList.remove("selected"); });
      const si = document.getElementById("deptSearchInput");
      if (si) { si.value = ""; filterDepartments(""); }
    }

    // Reset suggestion dept step
    if (name === "suggestion") {
      const sv = document.getElementById("sugg-selection-view");
      const fv = document.getElementById("suggestion-form-view");
      if (sv) sv.classList.remove("hidden");
      if (fv) fv.classList.add("hidden");
      selectedSuggDeptId   = null;
      selectedSuggDeptName = "";
      document.querySelectorAll("#suggDeptGrid .dept-card").forEach(function (c) { c.classList.remove("selected"); });
      const ssi = document.getElementById("suggDeptSearchInput");
      if (ssi) { ssi.value = ""; filterSuggDepartments(""); }
    }

    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
    document.querySelectorAll(".nav-item").forEach(function (n) { n.classList.remove("active"); });
    const panel = document.getElementById("panel-" + name);
    if (panel) panel.classList.add("active");
    if (clickedEl) clickedEl.classList.add("active");
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return false;
  }

  /* Initialise the suggestion dept grid once DOM is ready */
  document.addEventListener("DOMContentLoaded", function () {

      requestAnimationFrame(function () {

          renderDeptGrid(
              "suggDeptGrid",
              "selectSuggDepartment"
          );

      });

  });

 async function loadComplaintLocalities() {

    const ddl =
        document.getElementById(
            "complaintLocality"
        );

    const response =
        await fetch(
            "http://localhost:5079/api/localities"
        );

    const data =
        await response.json();

    ddl.innerHTML =
        '<option value="">Select Locality</option>';

    data.forEach(function(item){

        ddl.innerHTML +=
        `<option
            value="${item.localityId}"
            data-pincode="${item.pincode || ''}">
            ${item.localityName}
        </option>`;
    });

    // NEW CODE
    ddl.addEventListener(
        "change",
        function() {

            const selectedOption =
                ddl.options[
                    ddl.selectedIndex
                ];

            const pincode =
                selectedOption.getAttribute(
                    "data-pincode"
                );

            document.getElementById(
                "complaintPincode"
            ).value =
                pincode || "";
        }
    );
}


 function openMapModal() {

    document
        .getElementById("mapModal")
        .classList
        .remove("hidden");

    setTimeout(() => {

        if (!map) {

            map = L.map("complaintMap")
                .setView([18.5204, 73.8567], 13);

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap"
                }
            ).addTo(map);
            loadWardBoundary();

           map.on("click", function (e) {

    const clickedPoint =
        turf.point([
            e.latlng.lng,
            e.latlng.lat
        ]);

    const isInside =
        turf.booleanPointInPolygon(
            clickedPoint,
            wardBoundaryGeoJson
        );

    if (!isInside) {

        showToast(
    "Invalid Location...",
    "Selected location is outside Ward Boundary."
);

        return;
    }

    selectedLatitude =
        e.latlng.lat;

    selectedLongitude =
        e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker =
        L.marker(e.latlng)
            .addTo(map);
});
        }

        map.invalidateSize();

    }, 200);
}

async function loadWardBoundary() {

    try {

        const wardId =
            citizenProfile.wardId;

        const response =
            await fetch(
                `https://localhost:7286/api/WardBoundary/${wardId}`
            );

        const geoJson =
            await response.json();

            wardBoundaryGeoJson =
    geoJson;

        if (wardBoundaryLayer) {
            map.removeLayer(
                wardBoundaryLayer
            );
        }

        wardBoundaryLayer =
            L.geoJSON(
                geoJson,
                {
                    style: {
                        color: "#003366",
                        weight: 4,
                        fillColor: "#003366",
                        fillOpacity: 0.30
                    }
                }
            ).addTo(map);

        map.fitBounds(
            wardBoundaryLayer.getBounds()
        );

    }
    catch(error) {

        console.error(
            "Ward Boundary Error:",
            error
        );
    }
}

function initMap() {

    if(map)
        return;

    map = L.map("complaintMap")
        .setView(
            [18.5204,73.8567],
            13
        );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ).addTo(map);

    map.on("click", function(e){

        selectedLatitude =
            e.latlng.lat;

        selectedLongitude =
            e.latlng.lng;

        if(marker)
            map.removeLayer(marker);

        marker =
            L.marker(e.latlng)
            .addTo(map);
    });
}

async function loadLocalityPincode() {

    const localityId =
        document.getElementById(
            "complaintLocality"
        ).value;

    const pincodeBox =
        document.getElementById(
            "complaintPincode"
        );

    if (!localityId) {
        pincodeBox.value = "";
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE}/localities/${localityId}`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load locality."
            );
        }

        const locality =
            await response.json();

        pincodeBox.value =
            locality.pincode || "";

    }
    catch (error) {

        console.error(
            "Pincode Load Error:",
            error
        );

        pincodeBox.value = "";
    }
}
function saveMapLocation() {

    if (
        selectedLatitude === null ||
        selectedLongitude === null
    ) {
        alert(
            "Please select location on map"
        );
        return;
    }

    document
        .getElementById("latitude")
        .value =
        selectedLatitude.toFixed(6);

    document
        .getElementById("longitude")
        .value =
        selectedLongitude.toFixed(6);

        const locationMsg =
    document.getElementById(
        "selectedLocationText"
    );

locationMsg.innerHTML =
    "✅ Location selected successfully";

locationMsg.classList.remove(
    "hidden"
);

showToast(
    "Location Selected",
    "Complaint location has been captured."
);

    closeMapModal();
}

function closeMapModal(){

    document
        .getElementById("mapModal")
        .classList
        .add("hidden");
}

  window.selectDepartment       = selectDepartment;
  window.changeDepartment       = changeDepartment;
  window.filterDepartments      = filterDepartments;
  window.selectSuggDepartment   = selectSuggDepartment;
  window.changeSuggDepartment   = changeSuggDepartment;
  window.filterSuggDepartments  = filterSuggDepartments;
  window.showPanel              = showPanel;

  // ================================================================

  window.logout            = logout;
  window.toggleSidebar     = toggleSidebar;
  window.closeSidebar      = closeSidebar;
  window.submitComplaint   = submitComplaint;
  window.submitSuggestion  = submitSuggestion;
  window.filterItems       = filterItems;
  window.searchItems       = searchItems;
  window.showOfficerDetails = showOfficerDetails;
  window.closeOfficerModal  = closeOfficerModal;
  window.resetForm          = resetForm;
  window.showFileName       = showFileName;
  window.closeSuggestionHistory = closeSuggestionHistory;
  window.viewSuggestionHistory  = viewSuggestionHistory;
  window.updateProfile = updateProfile;
