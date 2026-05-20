
/* ============================================================
   ADMIN DASHBOARD — admin-dashboard.js
   Citizen Connect · Admin Control Panel
   Complete implementation with localStorage, progress tracking,
   conditional visibility, confirmation modal, toast system.
   ============================================================ */

'use strict';

/* ============================================================
   CONSTANTS
   ============================================================ */
var LS_KEY = 'adminAreaOverviewData';
var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var ADMIN_API_BASE = 'http://localhost:5079/api/admin';
var COMPLAINT_API_BASE = 'http://localhost:5079/api/Complaint';
var API_ORIGIN = 'http://localhost:5079';
var adminComplaints = [];
var activeComplaintId = null;

/* ============================================================
   GLOBAL STATE
   ============================================================ */
var currentSectionId  = null;   // which section detail is open
var confirmCallback   = null;   // pending confirm action

/* ============================================================
   AREA SECTIONS METADATA
   (filled/total/status are recomputed from localStorage on load)
   ============================================================ */
var AREA_SECTIONS = [
  { id:'basic-info',        name:'Basic Area Information',       icon:'&#x1F4CD;', desc:'Name, type, district, PIN code and geographic details.',                  status:'empty', filled:0, total:12, lastUpdated:'—', lastSaved:'—' },
  { id:'admin-contacts',    name:'Administrative Contacts',      icon:'&#x1F4DE;', desc:'Key officials, ward officers and office contact details.',                 status:'empty', filled:0, total:7,  lastUpdated:'—', lastSaved:'—' },
  { id:'population',        name:'Population & Demographics',    icon:'&#x1F465;', desc:'Population count, gender split, age groups and literacy rates.',          status:'empty', filled:0, total:9,  lastUpdated:'—', lastSaved:'—' },
  { id:'representatives',   name:'Representatives & Members',    icon:'&#x1F3DB;&#xFE0F;', desc:'Elected representatives, ward members and their contacts.',       status:'empty', filled:0, total:1,  lastUpdated:'—', lastSaved:'—' },
  { id:'education',         name:'Education Facilities',         icon:'&#x1F393;', desc:'Schools, colleges, anganwadis and student enrollment data.',              status:'empty', filled:0, total:8,  lastUpdated:'—', lastSaved:'—' },
  { id:'health',            name:'Health Facilities',            icon:'&#x1F3E5;', desc:'Hospitals, PHCs, doctors, ASHA workers and emergency services.',          status:'empty', filled:0, total:8,  lastUpdated:'—', lastSaved:'—' },
  { id:'agriculture',       name:'Agriculture & Rural Economy',  icon:'&#x1F33E;', desc:'Farmers, crops, irrigation and agricultural land details.',               status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—', ruralOnly:true },
  { id:'electricity',       name:'Electricity & Energy',         icon:'&#x26A1;',  desc:'Power connections, street lights and renewable energy projects.',         status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—' },
  { id:'water',             name:'Water Supply',                 icon:'&#x1F4A7;', desc:'Water tanks, tap connections, borewells and purified water access.',      status:'empty', filled:0, total:6,  lastUpdated:'—', lastSaved:'—' },
  { id:'roads',             name:'Roads & Transport',            icon:'&#x1F6E3;&#xFE0F;', desc:'Road network, public transport and infrastructure condition.',    status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—' },
  { id:'sanitation',        name:'Sanitation & Cleanliness',     icon:'&#x1F9F9;', desc:'Toilets, garbage collection, drainage and waste management.',            status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—' },
  { id:'animal-husbandry',  name:'Animal Husbandry',             icon:'&#x1F404;', desc:'Livestock, veterinary clinics and dairy farm infrastructure.',            status:'empty', filled:0, total:4,  lastUpdated:'—', lastSaved:'—', ruralOnly:true },
  { id:'public-facilities', name:'Public Facilities',            icon:'&#x1F3DB;&#xFE0F;', desc:'Public amenities and community infrastructure.',                  status:'empty', filled:0, total:6,  lastUpdated:'—', lastSaved:'—' },
  { id:'safety',            name:'Safety & Emergency',           icon:'&#x1F6A8;', desc:'Police, fire services, CCTV and emergency response facilities.',          status:'empty', filled:0, total:4,  lastUpdated:'—', lastSaved:'—' },
  { id:'social-cultural',   name:'Social & Cultural Information',icon:'&#x1F3AD;', desc:'Religious places, festivals, cultural halls and heritage sites.',         status:'empty', filled:0, total:4,  lastUpdated:'—', lastSaved:'—' }
];

/* ============================================================
   SECTION FORM CONFIGURATIONS
   ============================================================ */
var SECTION_FORMS = {
  'basic-info': { icon:'&#x1F4CD;', fields:[
    { key:'areaType',        label:'Area Type',                      type:'select',   options:['Municipal Ward','Gram Panchayat','Nagar Panchayat','Municipal Corporation','Village','Town'] },
    { key:'areaName',        label:'Area Name',                      type:'text',     placeholder:'e.g. Nehru Nagar' },
    { key:'parentAuthority', label:'Parent Authority Name',          type:'text',     placeholder:'e.g. District Collectorate, Pune' },
    { key:'district',        label:'District',                       type:'text',     placeholder:'e.g. Pune' },
    { key:'taluka',          label:'Taluka / Tehsil',                type:'text',     placeholder:'e.g. Haveli' },
    { key:'state',           label:'State',                          type:'text',     placeholder:'e.g. Maharashtra' },
    { key:'pinCode',         label:'PIN Code',                       type:'text',     placeholder:'e.g. 411001' },
    { key:'surveyYear',      label:'Survey Year',                    type:'number',   placeholder:'e.g. 2024' },
    { key:'totalWards',      label:'Total Wards',                    type:'number',   placeholder:'e.g. 12' },
    { key:'totalHouses',     label:'Total Houses',                   type:'number',   placeholder:'e.g. 4230' },
    { key:'geoArea',         label:'Geographical Area (sq km)',      type:'text',     placeholder:'e.g. 18.5' },
    { key:'areaDesc',        label:'Area Description',               type:'textarea', placeholder:'Brief description of the area...' }
  ]},
  'admin-contacts': { icon:'&#x1F4DE;', fields:[
    { key:'headName',        label:'Head Authority Name',            type:'text',     placeholder:'e.g. Shri Ramesh Patil' },
    { key:'designation',     label:'Designation',                    type:'text',     placeholder:'e.g. Ward Officer' },
    { key:'contactNumber',   label:'Contact Number',                 type:'text',     placeholder:'e.g. +91 98765 43210' },
    { key:'emailAddress',    label:'Email Address',                  type:'text',     placeholder:'e.g. officer@gov.in' },
    { key:'gramSevak',       label:'Gram Sevak / Officer Name',      type:'text',     placeholder:'e.g. Smt. Sunita Desai' },
    { key:'officeContact',   label:'Office Contact Number',          type:'text',     placeholder:'e.g. 020-12345678' },
    { key:'officeAddress',   label:'Office Address',                 type:'textarea', placeholder:'Full office address...' }
  ]},
  'population': { icon:'&#x1F465;', fields:[
    { key:'totalPop',        label:'Total Population',               type:'number',   placeholder:'e.g. 18450' },
    { key:'malePop',         label:'Male Population',                type:'number',   placeholder:'e.g. 9200' },
    { key:'femalePop',       label:'Female Population',              type:'number',   placeholder:'e.g. 9250' },
    { key:'childrenCount',   label:'Children Count (0–14)',          type:'number',   placeholder:'e.g. 3800' },
    { key:'seniorCount',     label:'Senior Citizen Count (60+)',     type:'number',   placeholder:'e.g. 1200' },
    { key:'totalVoters',     label:'Total Voters',                   type:'number',   placeholder:'e.g. 12400' },
    { key:'maleLiteracy',    label:'Male Literacy Rate (%)',         type:'text',     placeholder:'e.g. 88.5' },
    { key:'femaleLiteracy',  label:'Female Literacy Rate (%)',       type:'text',     placeholder:'e.g. 79.2' },
    { key:'overallLiteracy', label:'Overall Literacy Rate (%)',      type:'text',     placeholder:'e.g. 84.1' }
  ]},
  'representatives': { icon:'&#x1F3DB;&#xFE0F;', fields:[
    { key:'members', label:'Representatives & Members', type:'members' }
  ]},
  'education': { icon:'&#x1F393;', fields:[
    { key:'totalSchools',    label:'Total Schools',                  type:'number',   placeholder:'e.g. 14' },
    { key:'govtSchools',     label:'Government Schools Count',       type:'number',   placeholder:'e.g. 8' },
    { key:'pvtSchools',      label:'Private Schools Count',          type:'number',   placeholder:'e.g. 6' },
    { key:'collegesAvail',   label:'Colleges Available',             type:'select',   options:['Yes','No'] },
    { key:'totalColleges',   label:'Total Colleges',                 type:'number',   placeholder:'e.g. 3' },
    { key:'enrollment',      label:'Student Enrollment',             type:'number',   placeholder:'e.g. 4200' },
    { key:'anganwadiAvail',  label:'Anganwadi Available',            type:'select',   options:['Yes','No'] },
    { key:'anganwadiCount',  label:'Anganwadi Centers Count',        type:'number',   placeholder:'e.g. 12' }
  ]},
  'health': { icon:'&#x1F3E5;', fields:[
    { key:'hospitalsAvail',  label:'Hospitals Available',            type:'select',   options:['Yes','No'] },
    { key:'totalHospitals',  label:'Total Hospitals',                type:'number',   placeholder:'e.g. 4' },
    { key:'phcAvail',        label:'PHC Available',                  type:'select',   options:['Yes','No'] },
    { key:'doctorsCount',    label:'Doctors Count',                  type:'number',   placeholder:'e.g. 12' },
    { key:'nursesCount',     label:'Nurses Count',                   type:'number',   placeholder:'e.g. 28' },
    { key:'ashaCount',       label:'ASHA Workers Count',             type:'number',   placeholder:'e.g. 18' },
    { key:'ambulanceAvail',  label:'Ambulance Service Available',    type:'select',   options:['Yes','No'] },
    { key:'emergencyFacility',label:'Emergency Health Facility',     type:'select',   options:['Yes','No'] }
  ]},
  'agriculture': { icon:'&#x1F33E;', fields:[
    { key:'totalFarmers',    label:'Total Farmers',                  type:'number',   placeholder:'e.g. 1200' },
    { key:'majorCrops',      label:'Major Crops',                    type:'text',     placeholder:'e.g. Wheat, Sugarcane, Onion' },
    { key:'irrigationAvail', label:'Irrigation Facility Available',  type:'select',   options:['Yes','No','Partial'] },
    { key:'agriSupportAvail',label:'Agriculture Support Center',     type:'select',   options:['Yes','No'] },
    { key:'agriLandArea',    label:'Agricultural Land Area (ha)',    type:'text',     placeholder:'e.g. 850.5' }
  ]},
  'electricity': { icon:'&#x26A1;', fields:[
    { key:'electricConnections',label:'Electricity Connections',     type:'number',   placeholder:'e.g. 3800' },
    { key:'streetLights',    label:'Street Lights Count',            type:'number',   placeholder:'e.g. 420' },
    { key:'solarInstalled',  label:'Solar Lights Installed',         type:'select',   options:['Yes','No'] },
    { key:'solarCount',      label:'Solar Lights Count',             type:'number',   placeholder:'e.g. 80' },
    { key:'renewableProjects',label:'Renewable Energy Projects',     type:'textarea', placeholder:'Describe any renewable energy projects...' }
  ]},
  'water': { icon:'&#x1F4A7;', fields:[
    { key:'waterTanks',      label:'Water Tanks Count',              type:'number',   placeholder:'e.g. 6' },
    { key:'tapConnections',  label:'Tap Connections Count',          type:'number',   placeholder:'e.g. 3200' },
    { key:'borewells',       label:'Borewells Count',                type:'number',   placeholder:'e.g. 24' },
    { key:'wells',           label:'Wells Count',                    type:'number',   placeholder:'e.g. 12' },
    { key:'purifiedWater',   label:'Purified Drinking Water',        type:'select',   options:['Yes','No','Partial'] },
    { key:'waterPlants',     label:'Water Plants Count',             type:'number',   placeholder:'e.g. 2' }
  ]},
  'roads': { icon:'&#x1F6E3;&#xFE0F;', fields:[
    { key:'totalRoads',      label:'Total Roads (km)',               type:'text',     placeholder:'e.g. 42.5' },
    { key:'cementRoads',     label:'Cement Roads Count',             type:'number',   placeholder:'e.g. 18' },
    { key:'publicTransport', label:'Public Transport Available',     type:'select',   options:['Yes','No'] },
    { key:'busStops',        label:'Bus Stops Count',                type:'number',   placeholder:'e.g. 8' },
    { key:'roadCondition',   label:'Internal Road Condition',        type:'select',   options:['Good','Average','Poor'] }
  ]},
  'sanitation': { icon:'&#x1F9F9;', fields:[
    { key:'publicToilets',   label:'Public Toilets Count',           type:'number',   placeholder:'e.g. 14' },
    { key:'garbageCollection',label:'Garbage Collection Available',  type:'select',   options:['Yes','No','Partial'] },
    { key:'drainageSystem',  label:'Drainage System Available',      type:'select',   options:['Yes','No','Partial'] },
    { key:'householdToilets',label:'Household Toilets Count',        type:'number',   placeholder:'e.g. 3800' },
    { key:'wasteManagement', label:'Waste Management System',        type:'select',   options:['Centralized','Decentralized','None','Under Development'] }
  ]},
  'animal-husbandry': { icon:'&#x1F404;', fields:[
    { key:'livestockCount',  label:'Livestock Count',                type:'number',   placeholder:'e.g. 2400' },
    { key:'vetClinic',       label:'Veterinary Clinic Available',    type:'select',   options:['Yes','No'] },
    { key:'dairyFarms',      label:'Dairy Farms Count',              type:'number',   placeholder:'e.g. 8' },
    { key:'animalVaccination',label:'Animal Vaccination Facility',   type:'select',   options:['Yes','No','Partial'] }
  ]},
  'public-facilities': { icon:'&#x1F3DB;&#xFE0F;', fields:[
    { key:'communityHall',   label:'Community Hall Available',       type:'select',   options:['Yes','No'] },
    { key:'playgrounds',     label:'Playgrounds Count',              type:'number',   placeholder:'e.g. 4' },
    { key:'gardens',         label:'Gardens Count',                  type:'number',   placeholder:'e.g. 3' },
    { key:'library',         label:'Library Facility Available',     type:'select',   options:['Yes','No'] },
    { key:'marketArea',      label:'Market Area Available',          type:'select',   options:['Yes','No'] },
    { key:'shoppingArea',    label:'Shopping Area Available',        type:'select',   options:['Yes','No'] }
  ]},
  'safety': { icon:'&#x1F6A8;', fields:[
    { key:'policeStation',   label:'Police Station Nearby',          type:'select',   options:['Yes','No'] },
    { key:'fireService',     label:'Fire Emergency Service',         type:'select',   options:['Yes','No'] },
    { key:'cctvSurveillance',label:'CCTV Surveillance Available',    type:'select',   options:['Yes','No','Partial'] },
    { key:'emergencyResponse',label:'Emergency Response Facility',   type:'select',   options:['Yes','No'] }
  ]},
  'social-cultural': { icon:'&#x1F3AD;', fields:[
    { key:'religiousPlaces', label:'Religious Places Count',         type:'number',   placeholder:'e.g. 12' },
    { key:'festivalsYearly', label:'Festivals Organized Yearly',     type:'number',   placeholder:'e.g. 6' },
    { key:'culturalHall',    label:'Cultural Hall Available',        type:'select',   options:['Yes','No'] },
    { key:'tourismPlaces',   label:'Tourism / Historical Places',    type:'select',   options:['Yes','No'] }
  ]}
};

/* ============================================================
   LOCALSTORAGE HELPERS
   ============================================================ */
function lsLoad() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function lsSave(store) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch(e) {}
}

function lsGet(sectionId) {
  return lsLoad()[sectionId] || {};
}

function lsSet(sectionId, data) {
  var store = lsLoad();
  store[sectionId] = data;
  lsSave(store);
}

function lsDelete(sectionId) {
  var store = lsLoad();
  delete store[sectionId];
  lsSave(store);
}

function lsClear() {
  try { localStorage.removeItem(LS_KEY); } catch(e) {}
}

/* ============================================================
   TIMESTAMP HELPERS
   ============================================================ */
function nowTimestamp() {
  var d = new Date();
  var date = d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  var h = d.getHours(), m = d.getMinutes();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  var time = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  return { date: date, time: time, full: date + ' at ' + time };
}

/* ============================================================
   CONDITIONAL VISIBILITY — rural-only sections
   Sections with ruralOnly:true are hidden unless areaType is
   Village, Gram Panchayat, or Town.
   ============================================================ */
var RURAL_TYPES = ['Village', 'Gram Panchayat', 'Town'];

function isRuralArea() {
  var basicData = lsGet('basic-info');
  return RURAL_TYPES.indexOf(basicData.areaType || '') !== -1;
}

function getSectionsToShow() {
  var rural = isRuralArea();
  return AREA_SECTIONS.filter(function(s) {
    return !s.ruralOnly || rural;
  });
}

/* ============================================================
   RECOMPUTE SECTION STATS FROM LOCALSTORAGE
   Called on init and after every save/delete.
   ============================================================ */
function recomputeAllSections() {
  AREA_SECTIONS.forEach(function(section) {
    var data = lsGet(section.id);
    var formConfig = SECTION_FORMS[section.id];
    if (!formConfig) return;

    var filled = 0, total = 0;
    formConfig.fields.forEach(function(field) {
      if (field.type === 'members') {
        total++;
        if (data.members && data.members.length > 0) filled++;
      } else {
        total++;
        if (data[field.key] && String(data[field.key]).trim() !== '') filled++;
      }
    });

    section.filled = filled;
    section.total  = total;
    section.lastUpdated = data._lastUpdated || '—';
    section.lastSaved   = data._lastSaved   || '—';

    if (data._submitted) {
      section.status = 'completed';
    } else if (filled === 0) {
      section.status = 'empty';
    } else {
      section.status = 'partial';
    }
  });
}

/* ============================================================
   PANEL NAVIGATION
   ============================================================ */
function showPanel(panelId, navEl) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('panel-' + panelId);
  if (target) target.classList.add('active');
  if (navEl) navEl.classList.add('active');
  if (panelId === 'complaints-management') {
    loadAdminComplaints();
  }
  closeSidebar();
  return false;
}

/* ============================================================
   SIDEBAR TOGGLE
   ============================================================ */
function toggleSidebar() {
  var sidebar   = document.getElementById('sidebar');
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  hamburger.classList.toggle('open');
  overlay.classList[sidebar.classList.contains('open') ? 'add' : 'remove']('visible');
}

function closeSidebar() {
  var sidebar   = document.getElementById('sidebar');
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('visible');
}

/* ============================================================
   DATE DISPLAY
   ============================================================ */
function setDate() {
  var el = document.getElementById('pageDate');
  if (!el) return;
  var now = new Date();
  el.textContent = DAYS[now.getDay()] + ', ' + now.getDate() + ' ' + MONTHS[now.getMonth()] + ' ' + now.getFullYear();
}

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   type: 'success' | 'warning' | 'error' | 'info'
   ============================================================ */
function showToast(msg, type) {
  var toast    = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastIcon= document.getElementById('toastIcon');
  var icons    = { success:'\u2705', warning:'\u26A0\uFE0F', error:'\u274C', info:'\u2139\uFE0F' };
  var t        = type || 'success';

  toastMsg.textContent  = msg || 'Done.';
  toastIcon.textContent = icons[t] || icons.success;

  toast.className = 'toast toast-' + t;
  toast.classList.remove('hidden');
  toast.style.animation = 'none';
  void toast.offsetWidth;
  toast.style.animation = '';

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function() { toast.classList.add('hidden'); }, 3400);
}

/* ============================================================
   CONFIRMATION MODAL
   ============================================================ */
function showConfirm(title, message, onConfirm) {
  document.getElementById('confirmTitle').textContent   = title;
  document.getElementById('confirmMessage').textContent = message;
  confirmCallback = onConfirm;
  document.getElementById('confirmOverlay').classList.remove('hidden');
}

function confirmYes() {
  document.getElementById('confirmOverlay').classList.add('hidden');
  if (typeof confirmCallback === 'function') confirmCallback();
  confirmCallback = null;
}

function confirmNo() {
  document.getElementById('confirmOverlay').classList.add('hidden');
  confirmCallback = null;
}

/* ============================================================
   QUICK VIEW MODAL
   ============================================================ */
function quickView(sectionId) {
  var section = AREA_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;

  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'Partially Filled' : 'Empty';
  var pct = section.total > 0 ? Math.round((section.filled / section.total) * 100) : 0;

  var data = lsGet(sectionId);
  var formConfig = SECTION_FORMS[sectionId];
  var filledFields = [], missingFields = [];

  if (formConfig) {
    formConfig.fields.forEach(function(f) {
      if (f.type === 'members') {
        var m = data.members || [];
        if (m.length > 0) filledFields.push('Members (' + m.length + ' added)');
        else missingFields.push('Representatives & Members');
      } else {
        if (data[f.key] && String(data[f.key]).trim()) filledFields.push(f.label);
        else missingFields.push(f.label);
      }
    });
  }

  var filledHtml = filledFields.length
    ? filledFields.map(function(f) { return '<span class="qv-tag filled">\u2705 ' + escHtml(f) + '</span>'; }).join('')
    : '<span class="qv-empty-tag">None filled yet</span>';

  var missingHtml = missingFields.length
    ? missingFields.map(function(f) { return '<span class="qv-tag missing">\u274C ' + escHtml(f) + '</span>'; }).join('')
    : '<span class="qv-empty-tag">All fields filled</span>';

  var bodyHtml =
    '<div class="modal-section-label">Status</div>' +
    '<div class="modal-value"><span class="section-card-status ' + section.status + '">' + statusLabel + '</span></div>' +

    '<div class="modal-section-label">Completion</div>' +
    '<div class="qv-progress-wrap">' +
      '<div class="qv-progress-track"><div class="qv-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="qv-progress-pct">' + pct + '%</span>' +
    '</div>' +
    '<div class="modal-value" style="margin-top:6px;font-size:0.8rem;">' + section.filled + ' of ' + section.total + ' fields filled</div>' +

    '<div class="modal-section-label">Last Updated</div>' +
    '<div class="modal-value">' + escHtml(section.lastUpdated) + (section.lastSaved && section.lastSaved !== '—' ? ' &middot; ' + escHtml(section.lastSaved) : '') + '</div>' +

    '<div class="modal-section-label">Filled Fields</div>' +
    '<div class="qv-tags">' + filledHtml + '</div>' +

    '<div class="modal-section-label">Missing Fields</div>' +
    '<div class="qv-tags">' + missingHtml + '</div>';

  document.getElementById('modalTitle').textContent = section.name;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

/* ============================================================
   AREA OVERVIEW: RENDER SECTION CARDS  (clean minimal design)
   ============================================================ */
function renderSectionCards() {
  var grid = document.getElementById('sectionCardsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  var sections = getSectionsToShow();

  if (sections.length === 0) {
    grid.innerHTML =
      '<div class="sc-empty-state">' +
        '<div class="sc-empty-icon">&#x1F4CB;</div>' +
        '<div class="sc-empty-text">No sections available for the selected area type.</div>' +
      '</div>';
    return;
  }

  sections.forEach(function(section) {
    var statusLabel = section.status === 'completed' ? 'Completed'
      : section.status === 'partial' ? 'In Progress' : 'Not Started';

    var updatedText = (section.lastUpdated && section.lastUpdated !== '—')
      ? section.lastUpdated + (section.lastSaved && section.lastSaved !== '—' ? ' &middot; ' + section.lastSaved : '')
      : 'Not updated yet';

    var card = document.createElement('div');
    card.className = 'sc-card sc-card--' + section.status;

    card.innerHTML =
      '<div class="sc-card-body">' +
        '<div class="sc-card-top">' +
          '<div class="sc-card-icon-wrap sc-icon--' + section.status + '">' +
            '<span class="sc-card-icon">' + (section.icon || '&#x1F4C4;') + '</span>' +
          '</div>' +
          '<span class="sc-badge sc-badge--' + section.status + '">' + statusLabel + '</span>' +
        '</div>' +
        '<div class="sc-card-name">' + escHtml(section.name) + '</div>' +
        '<div class="sc-card-desc">' + escHtml(section.desc) + '</div>' +
        '<div class="sc-card-updated">&#x1F4C5; ' + updatedText + '</div>' +
      '</div>' +
      '<div class="sc-card-footer">' +
        '<button class="sc-btn sc-btn--primary" onclick="openSection(\'' + section.id + '\')">' +
          '&#x1F4C2; Open Section' +
        '</button>' +
        '<button class="sc-btn sc-btn--ghost" onclick="quickView(\'' + section.id + '\')">' +
          '&#x1F441;&#xFE0F; Quick View' +
        '</button>' +
      '</div>';

    grid.appendChild(card);
  });
}

/* ============================================================
   AREA OVERVIEW: COMPUTE GLOBAL PROGRESS
   ============================================================ */
function computeAreaProgress() {
  var sections  = getSectionsToShow();
  var completed = 0, partial = 0, empty = 0;
  sections.forEach(function(s) {
    if (s.status === 'completed') completed++;
    else if (s.status === 'partial') partial++;
    else empty++;
  });

  var totalFields  = sections.reduce(function(a, s) { return a + s.total; }, 0);
  var filledFields = sections.reduce(function(a, s) { return a + s.filled; }, 0);
  var pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
  set('completedCount', completed);
  set('partialCount',   partial);
  set('emptyCount',     empty);

  setTimeout(function() {
    var fillEl = document.getElementById('globalProgressFill');
    var pctEl  = document.getElementById('globalProgressPct');
    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl)  pctEl.textContent  = pct + '%';
    // sync summary card — keeps completion % and status badge current
    syncAreaSummary();
  }, 80);
}

/* ============================================================
   AREA OVERVIEW: TOP ACTION BUTTONS
   ============================================================ */
function saveDraft() {
  showToast('Area overview draft saved.', 'success');
}

function publishArea() {
  var sections = getSectionsToShow();
  var filledCount = sections.filter(function(s) { return s.status !== 'empty'; }).length;
  var minRequired = Math.ceil(sections.length * 0.4); // at least 40% sections must have data

  if (filledCount < minRequired) {
    showToast('Not enough data to publish. Please fill at least ' + minRequired + ' sections first.', 'warning');
    return;
  }

  var badge = document.getElementById('areaStatusBadge');
  if (badge) { badge.className = 'area-status-badge published'; badge.textContent = 'Published'; }
  showToast('Area information published successfully!', 'success');
}

function updateInfo() {
  showToast('Area information updated.', 'success');
}

function resetAreaData() {
  showConfirm(
    'Reset All Area Data',
    'This will permanently clear all saved area information across all sections. This action cannot be undone.',
    function() {
      lsClear();
      recomputeAllSections();
      renderSectionCards();
      computeAreaProgress();
      syncAreaSummary();                      // reset summary to placeholders
      var badge = document.getElementById('areaStatusBadge');
      if (badge) { badge.className = 'area-status-badge draft'; badge.textContent = 'Draft'; }
      showToast('All area data has been reset.', 'info');
    }
  );
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  showConfirm('Logout', 'Are you sure you want to logout?', function() {
    window.location.href = '../login/login.html';
  });
}

/* ============================================================
   UTILITY: HTML ESCAPE
   ============================================================ */
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    confirmNo();
  }
});

/* ============================================================
   SECTION DETAIL — OPEN
   ============================================================ */
function openSection(sectionId) {
  var section = AREA_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;
  var formConfig = SECTION_FORMS[sectionId];
  if (!formConfig) { showToast('Form configuration not found.', 'warning'); return; }

  currentSectionId = sectionId;

  // Header
  document.getElementById('sdBreadcrumbName').textContent = section.name;
  document.getElementById('sdTitle').textContent          = section.name;
  document.getElementById('sdSubtitle').textContent       = section.desc;
  document.getElementById('sdFormIcon').innerHTML         = formConfig.icon;

  // Status badge
  refreshSdBadge(section);

  // Progress
  refreshSdProgress(section);

  // Last saved info
  var data = lsGet(sectionId);
  var lastSavedEl = document.getElementById('sdLastSaved');
  if (lastSavedEl) {
    lastSavedEl.textContent = data._lastUpdated
      ? 'Last saved: ' + data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
      : 'Not saved yet';
  }

  // Render form (loads saved values)
  renderSectionForm(sectionId, formConfig);

  // Render preview
  renderSectionPreview(sectionId);

  // Navigate
  showPanel('section-detail', null);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- CLOSE SECTION DETAIL ---- */
function closeSectionDetail() {
  currentSectionId = null;
  var navEl = document.querySelector('.nav-item[onclick*="area-overview"]');
  showPanel('area-overview', navEl);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- REFRESH BADGE IN DETAIL HEADER ---- */
function refreshSdBadge(section) {
  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'Partially Filled' : 'Empty';
  var badge = document.getElementById('sdStatusBadge');
  if (badge) { badge.className = 'section-card-status ' + section.status; badge.textContent = statusLabel; }
}

/* ---- REFRESH PROGRESS IN DETAIL HEADER ---- */
function refreshSdProgress(section) {
  var pct = section.total > 0 ? Math.round((section.filled / section.total) * 100) : 0;
  var fillEl = document.getElementById('sdProgressFill');
  var pctEl  = document.getElementById('sdProgressPct');
  if (fillEl) fillEl.style.width = pct + '%';
  if (pctEl)  pctEl.textContent  = pct + '%';
}

/* ============================================================
   SECTION DETAIL — RENDER FORM
   ============================================================ */
function renderSectionForm(sectionId, formConfig) {
  var formBody = document.getElementById('sdFormBody');
  formBody.innerHTML = '';
  var data = lsGet(sectionId);

  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      renderMembersSection(formBody, data.members || []);
      return;
    }

    var group = document.createElement('div');
    group.className = 'sd-field-group';

    var lbl = document.createElement('label');
    lbl.className   = 'sd-field-label';
    lbl.htmlFor     = 'field-' + field.key;
    lbl.textContent = field.label;
    group.appendChild(lbl);

    var input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'sd-select';
      var blank = document.createElement('option');
      blank.value = ''; blank.textContent = '— Select —';
      input.appendChild(blank);
      (field.options || []).forEach(function(opt) {
        var o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        input.appendChild(o);
      });
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className   = 'sd-textarea';
      input.placeholder = field.placeholder || '';
      input.rows        = 3;
    } else {
      input = document.createElement('input');
      input.className   = 'sd-input';
      input.type        = field.type === 'number' ? 'number' : 'text';
      input.placeholder = field.placeholder || '';
    }

    input.id    = 'field-' + field.key;
    input.value = data[field.key] || '';
    group.appendChild(input);
    formBody.appendChild(group);
  });
}

/* ============================================================
   SECTION DETAIL — MEMBERS (Dynamic Rows)
   ============================================================ */
function renderMembersSection(container, members) {
  var wrap = document.createElement('div');
  wrap.className = 'sd-members-section';

  var hdr = document.createElement('div');
  hdr.className = 'sd-members-header';

  var title = document.createElement('div');
  title.className   = 'sd-members-title';
  title.textContent = 'Representatives & Members';
  hdr.appendChild(title);

  var addBtn = document.createElement('button');
  addBtn.className   = 'sd-btn-add-member';
  addBtn.textContent = '+ Add Member';
  addBtn.type        = 'button';
  addBtn.onclick     = addMember;
  hdr.appendChild(addBtn);
  wrap.appendChild(hdr);

  var list = document.createElement('div');
  list.className = 'sd-members-list';
  list.id        = 'membersList';

  if (!members || members.length === 0) {
    list.appendChild(buildMembersEmpty());
  } else {
    members.forEach(function(m, i) { list.appendChild(createMemberItem(m, i)); });
  }

  wrap.appendChild(list);
  container.appendChild(wrap);
}

function buildMembersEmpty() {
  var el = document.createElement('div');
  el.className = 'sd-members-empty';
  el.innerHTML = '<div style="font-size:1.8rem;margin-bottom:8px;">&#x1F465;</div>No members added yet.<br><span style="font-size:0.78rem;">Click "+ Add Member" to start.</span>';
  return el;
}

function createMemberItem(member, idx) {
  var item = document.createElement('div');
  item.className      = 'sd-member-item';
  item.dataset.index  = idx;

  var hdr = document.createElement('div');
  hdr.className = 'sd-member-item-header';

  var nameDisplay = document.createElement('div');
  nameDisplay.className   = 'sd-member-item-title';
  nameDisplay.textContent = (member.name && member.name.trim()) ? member.name : 'Member ' + (idx + 1);
  hdr.appendChild(nameDisplay);

  var acts = document.createElement('div');
  acts.className = 'sd-member-item-actions';

  var delBtn = document.createElement('button');
  delBtn.className = 'sd-btn-icon sd-btn-icon-del';
  delBtn.innerHTML = '&#x1F5D1;';
  delBtn.title     = 'Delete member';
  delBtn.type      = 'button';
  delBtn.onclick   = (function(i) { return function() { deleteMember(i); }; })(idx);
  acts.appendChild(delBtn);
  hdr.appendChild(acts);
  item.appendChild(hdr);

  var fields = document.createElement('div');
  fields.className = 'sd-member-fields';

  var memberFieldDefs = [
    { key:'name',    label:'Member Name',        placeholder:'Full name' },
    { key:'role',    label:'Role / Designation', placeholder:'e.g. Ward Councillor' },
    { key:'mobile',  label:'Mobile Number',      placeholder:'e.g. +91 98765 43210' },
    { key:'email',   label:'Email Address',      placeholder:'e.g. member@gov.in' },
    { key:'address', label:'Address',            placeholder:'Residential address' }
  ];

  memberFieldDefs.forEach(function(fd) {
    var fieldWrap = document.createElement('div');
    fieldWrap.className = 'sd-member-field';

    var lbl = document.createElement('div');
    lbl.className   = 'sd-member-field-label';
    lbl.textContent = fd.label;
    fieldWrap.appendChild(lbl);

    var inp = document.createElement('input');
    inp.className   = 'sd-member-field-input';
    inp.type        = 'text';
    inp.placeholder = fd.placeholder;
    inp.value       = member[fd.key] || '';
    inp.oninput     = (function(i, k) {
      return function() { updateMemberField(i, k, this.value); };
    })(idx, fd.key);
    fieldWrap.appendChild(inp);
    fields.appendChild(fieldWrap);
  });

  item.appendChild(fields);
  return item;
}

function addMember() {
  if (!currentSectionId) return;
  var data = lsGet(currentSectionId);
  if (!data.members) data.members = [];
  data.members.push({ name:'', role:'', mobile:'', email:'', address:'' });
  lsSet(currentSectionId, data);
  refreshMembersList(data.members);
  showToast('Member row added.', 'info');
}

function deleteMember(idx) {
  if (!currentSectionId) return;
  showConfirm('Delete Member', 'Remove this member from the list?', function() {
    var data = lsGet(currentSectionId);
    if (!data.members) return;
    data.members.splice(idx, 1);
    lsSet(currentSectionId, data);
    refreshMembersList(data.members);
    renderSectionPreview(currentSectionId);
    syncSectionMeta(currentSectionId);
    showToast('Member deleted.', 'info');
  });
}

function updateMemberField(idx, key, value) {
  if (!currentSectionId) return;
  var data = lsGet(currentSectionId);
  if (!data.members || !data.members[idx]) return;
  data.members[idx][key] = value;

  // Update the item title live
  var items = document.querySelectorAll('#membersList .sd-member-item');
  if (items[idx]) {
    var titleEl = items[idx].querySelector('.sd-member-item-title');
    if (titleEl && key === 'name') {
      titleEl.textContent = value.trim() || 'Member ' + (idx + 1);
    }
  }

  lsSet(currentSectionId, data);
  renderSectionPreview(currentSectionId);
}

function refreshMembersList(members) {
  var list = document.getElementById('membersList');
  if (!list) return;
  list.innerHTML = '';
  if (!members || members.length === 0) {
    list.appendChild(buildMembersEmpty());
  } else {
    members.forEach(function(m, i) { list.appendChild(createMemberItem(m, i)); });
  }
}

/* ============================================================
   SECTION DETAIL — RENDER PREVIEW (right panel)
   ============================================================ */
function renderSectionPreview(sectionId) {
  var previewBody = document.getElementById('sdPreviewBody');
  if (!previewBody) return;

  var data       = lsGet(sectionId);
  var formConfig = SECTION_FORMS[sectionId];
  if (!formConfig) {
    previewBody.innerHTML = '<div class="sd-preview-empty"><div class="sd-preview-empty-icon">&#x1F4C4;</div>No configuration found.</div>';
    return;
  }

  var hasData = false;
  var html    = '';

  // Last saved timestamp at top
  if (data._lastUpdated) {
    html += '<div class="sd-preview-timestamp">&#x1F4C5; Saved: ' + escHtml(data._lastUpdated) +
      (data._lastSaved ? ' at ' + escHtml(data._lastSaved) : '') + '</div>';
    hasData = true;
  }

  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      var members = data.members || [];
      if (members.length > 0) {
        hasData = true;
        html += '<div class="sd-preview-item">';
        html += '<div class="sd-preview-label">Representatives &amp; Members (' + members.length + ')</div>';
        html += '<div class="sd-preview-members">';
        members.forEach(function(m, i) {
          html += '<div class="sd-preview-member-card">';
          html += '<div class="sd-preview-member-name">' + escHtml(m.name || 'Member ' + (i + 1)) + '</div>';
          if (m.role)    html += '<div class="sd-preview-member-detail"><strong>Role:</strong> '    + escHtml(m.role)    + '</div>';
          if (m.mobile)  html += '<div class="sd-preview-member-detail"><strong>Mobile:</strong> '  + escHtml(m.mobile)  + '</div>';
          if (m.email)   html += '<div class="sd-preview-member-detail"><strong>Email:</strong> '   + escHtml(m.email)   + '</div>';
          if (m.address) html += '<div class="sd-preview-member-detail"><strong>Address:</strong> ' + escHtml(m.address) + '</div>';
          html += '</div>';
        });
        html += '</div></div>';
      }
    } else {
      var val = data[field.key];
      if (val && String(val).trim()) {
        hasData = true;
        html += '<div class="sd-preview-item">';
        html += '<div class="sd-preview-label">' + escHtml(field.label) + '</div>';
        html += '<div class="sd-preview-value">'  + escHtml(val)         + '</div>';
        html += '</div>';
      }
    }
  });

  if (!hasData) {
    previewBody.innerHTML =
      '<div class="sd-preview-empty">' +
        '<div class="sd-preview-empty-icon">&#x1F4C4;</div>' +
        '<div style="font-weight:700;margin-bottom:6px;">No information added yet</div>' +
        '<div style="font-size:0.78rem;">Fill the form on the left and click Save Draft or Submit.</div>' +
      '</div>';
  } else {
    previewBody.innerHTML = html;
  }
}

/* ============================================================
   SECTION DETAIL — COLLECT FORM DATA
   ============================================================ */
function collectFormData() {
  if (!currentSectionId) return null;
  var formConfig = SECTION_FORMS[currentSectionId];
  if (!formConfig) return null;

  var existing = lsGet(currentSectionId);
  var data = Object.assign({}, existing);

  formConfig.fields.forEach(function(field) {
    if (field.type !== 'members') {
      var input = document.getElementById('field-' + field.key);
      if (input) data[field.key] = input.value;
    }
  });

  return data;
}

/* ============================================================
   SECTION DETAIL — SYNC META (filled/total/status)
   ============================================================ */
function syncSectionMeta(sectionId) {
  var section    = AREA_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;
  var data       = lsGet(sectionId);
  var formConfig = SECTION_FORMS[sectionId];
  if (!formConfig) return;

  var filled = 0, total = 0;
  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      total++;
      if (data.members && data.members.length > 0) filled++;
    } else {
      total++;
      if (data[field.key] && String(data[field.key]).trim()) filled++;
    }
  });

  section.filled      = filled;
  section.total       = total;
  section.lastUpdated = data._lastUpdated || '—';
  section.lastSaved   = data._lastSaved   || '—';

  if (data._submitted) {
    section.status = 'completed';
  } else if (filled === 0) {
    section.status = 'empty';
  } else {
    section.status = 'partial';
  }

  // Update detail header
  refreshSdBadge(section);
  refreshSdProgress(section);

  var lastSavedEl = document.getElementById('sdLastSaved');
  if (lastSavedEl) {
    lastSavedEl.textContent = data._lastUpdated
      ? 'Last saved: ' + data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
      : 'Not saved yet';
  }

  // Refresh overview
  renderSectionCards();
  computeAreaProgress();
}

/* ============================================================
   SECTION DETAIL — ACTION BUTTONS
   ============================================================ */
function saveSectionDraft() {
  if (!currentSectionId) return;
  var data = collectFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  // keep _submitted flag if already submitted
  lsSet(currentSectionId, data);
  syncSectionMeta(currentSectionId);
  renderSectionPreview(currentSectionId);
  syncAreaSummary();                          // refresh top summary
  showToast('Draft saved successfully.', 'success');
  // Save Draft does NOT clear the form — values stay in inputs
}

function submitSectionData() {
  if (!currentSectionId) return;
  var data = collectFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  data._submitted   = true;
  lsSet(currentSectionId, data);
  syncSectionMeta(currentSectionId);
  renderSectionPreview(currentSectionId);
  syncAreaSummary();                          // refresh top summary
  clearSectionForm();                         // reset form inputs after submit
  showToast('Section submitted and marked as Completed!', 'success');
}

function updateSectionData() {
  if (!currentSectionId) return;
  var data = collectFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  lsSet(currentSectionId, data);
  syncSectionMeta(currentSectionId);
  renderSectionPreview(currentSectionId);
  syncAreaSummary();                          // refresh top summary
  clearSectionForm();                         // reset form inputs after update
  showToast('Section data updated successfully.', 'success');
}

function deleteSectionData() {
  if (!currentSectionId) return;
  var sectionName = (AREA_SECTIONS.find(function(s) { return s.id === currentSectionId; }) || {}).name || 'this section';
  showConfirm(
    'Delete Section Data',
    'Clear all saved data for "' + sectionName + '"? This cannot be undone.',
    function() {
      lsDelete(currentSectionId);
      syncSectionMeta(currentSectionId);
      renderSectionForm(currentSectionId, SECTION_FORMS[currentSectionId]);
      renderSectionPreview(currentSectionId);
      showToast('Section data deleted.', 'info');
    }
  );
}

/* ============================================================
   AREA SUMMARY SYNC
   Reads basic-info from localStorage and populates the six
   summary fields in the Area Overview top card.
   Called after every save / submit / update / init.
   ============================================================ */
function syncAreaSummary() {
  var data = lsGet('basic-info');

  /* helpers */
  var setText = function(id, val, fallback) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = (val && String(val).trim()) ? String(val).trim() : (fallback || 'Not Added');
  };

  /* Area Name */
  setText('areaName', data.areaName, 'Not Added');

  /* Area Type */
  setText('areaType', data.areaType, 'Not Added');

  /* Parent Authority */
  setText('areaAuthority', data.parentAuthority, 'Not Added');

  /* Last Updated — use the section's own timestamp */
  var lastUpdated = data._lastUpdated
    ? data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
    : 'Not Updated';
  setText('areaLastUpdated', lastUpdated, 'Not Updated');

  /* Completion % — computed from all visible sections */
  var sections     = getSectionsToShow();
  var totalFields  = sections.reduce(function(a, s) { return a + s.total; }, 0);
  var filledFields = sections.reduce(function(a, s) { return a + s.filled; }, 0);
  var pct          = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  var areaEl = document.getElementById('areaCompletion');
  if (areaEl) areaEl.textContent = pct + '%';

  /* Area Status badge — derive from global completion + publish state */
  var badge = document.getElementById('areaStatusBadge');
  if (badge) {
    /* Only change status if it hasn't been manually set to Published */
    var currentClass = badge.className;
    if (currentClass.indexOf('published') === -1) {
      if (pct === 0) {
        badge.className   = 'area-status-badge draft';
        badge.textContent = 'Draft';
      } else if (pct === 100) {
        badge.className   = 'area-status-badge completed';
        badge.textContent = 'Completed';
      } else {
        badge.className   = 'area-status-badge in-progress';
        badge.textContent = 'In Progress';
      }
    }
  }
}

/* ============================================================
   CLEAR SECTION FORM
   Resets all visible form inputs to empty after Submit / Update.
   Does NOT touch localStorage — saved data is preserved.
   ============================================================ */
function clearSectionForm() {
  if (!currentSectionId) return;
  var formConfig = SECTION_FORMS[currentSectionId];
  if (!formConfig) return;

  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      /* Members: clear the live input fields but keep the stored data.
         The stored members remain visible in the preview panel.
         Re-render the members list from storage so inputs show empty
         only if the user explicitly adds a new row next time. */
      return; // member rows are managed separately; don't wipe them
    }
    var input = document.getElementById('field-' + field.key);
    if (input) input.value = '';
  });
}

/* ============================================================
   COMPLAINTS MANAGEMENT
   ============================================================ */
function requireAdminSession() {
  var userId = localStorage.getItem('userId');
  var role = localStorage.getItem('role');
  if (!userId || role !== 'Admin') {
    window.location.href = '../login/login.html';
    return false;
  }
  return true;
}

async function loadAdminComplaints() {
  var list = document.getElementById('adminComplaintsList');
  if (!list) return;

  list.innerHTML = '<div class="item-empty"><div class="item-empty-icon">&#x23F3;</div><div>Loading complaints...</div></div>';

  try {
    var response = await fetch(ADMIN_API_BASE + '/complaints');
    if (!response.ok) throw new Error('Failed to load complaints');
    var data = await response.json();
    adminComplaints = Array.isArray(data)
      ? data.map(mapAdminComplaintToCard)
      : [];
    renderAdminComplaints(adminComplaints);
    var statusFilter = document.getElementById('adminComplaintStatusFilter');
    var searchInput = document.getElementById('adminComplaintSearch');
    if (statusFilter && statusFilter.value !== 'all') {
      filterAdminComplaints(statusFilter.value);
    }
    if (searchInput && searchInput.value.trim()) {
      searchAdminComplaints(searchInput.value);
    }
  } catch (_) {
    adminComplaints = [];
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon">&#x1F4CB;</div><div>Unable to load complaints. Please ensure the server is running.</div></div>';
  }
}

function pickComplaintField(obj, camelKey, pascalKey) {
  var val = obj[camelKey];
  if (val === undefined || val === null) val = obj[pascalKey];
  return val === undefined || val === null ? '' : val;
}

function mapAdminComplaintToCard(c) {
  var rawImages = c.images || c.Images || [];
  if (!Array.isArray(rawImages)) rawImages = [];
  var imagePath = pickComplaintField(c, 'imageUrl', 'ImageUrl') || rawImages[0] || '';
  var images = rawImages.length
    ? rawImages.map(resolveComplaintImageUrl).filter(Boolean)
    : (imagePath ? [resolveComplaintImageUrl(imagePath)] : []);

  return {
    complaintId: c.complaintId != null ? c.complaintId : c.ComplaintId,
    id: pickComplaintField(c, 'complaintNumber', 'ComplaintNumber') || ('CMP-' + (c.complaintId || c.ComplaintId)),
    title: pickComplaintField(c, 'title', 'Title'),
    category: pickComplaintField(c, 'categoryName', 'CategoryName'),
    desc: pickComplaintField(c, 'description', 'Description'),
    location: pickComplaintField(c, 'address', 'Address'),
    citizen: pickComplaintField(c, 'citizenName', 'CitizenName') || '—',
    date: formatComplaintDate(c.createdAt || c.CreatedAt),
    status: normalizeAdminComplaintStatus(c.status || c.Status),
    priority: (pickComplaintField(c, 'priority', 'Priority') || 'medium').toLowerCase(),
    imageUrl: images[0] || '',
    images: images
  };
}

function resolveComplaintImageUrl(path) {
  if (!path) return '';
  var p = String(path).trim();
  if (p.indexOf('http://') === 0 || p.indexOf('https://') === 0) return p;
  if (p.charAt(0) !== '/') p = '/' + p;
  return API_ORIGIN + p;
}

function normalizeAdminComplaintStatus(status) {
  if (!status) return 'pending';
  var s = String(status).toLowerCase().replace(/\s+/g, '');
  if (s === 'inprogress') return 'inprogress';
  if (s === 'pending') return 'pending';
  if (s === 'resolved') return 'resolved';
  if (s === 'rejected') return 'rejected';
  return s;
}

function adminStatusLabel(s) {
  var map = { pending: 'Pending', inprogress: 'In Progress', resolved: 'Resolved', rejected: 'Rejected' };
  return map[s] || s;
}

function formatComplaintDate(isoOrDate) {
  if (!isoOrDate) return '—';
  var d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildComplaintImagesHtml(complaint) {
  var urls = complaint.images && complaint.images.length
    ? complaint.images
    : (complaint.imageUrl ? [complaint.imageUrl] : []);
  if (!urls.length) {
    return '<div class="modal-value">No image attached</div>';
  }
  return urls.map(function(url) {
    return '<img class="complaint-detail-img" src="' + escHtml(url) + '" alt="Complaint attachment" />';
  }).join('');
}

function renderAdminComplaints(data) {
  var list = document.getElementById('adminComplaintsList');
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon">&#x1F4CB;</div><div>No complaints found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function(c) {
    return '<div class="item-card" data-complaint-id="' + c.complaintId + '" data-status="' + c.status + '" data-title="' + escHtml(c.title).toLowerCase() + '" data-citizen="' + escHtml(c.citizen).toLowerCase() + '" onclick="openAdminComplaintDetail(' + c.complaintId + ')">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(c.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(c.category) + ' &nbsp;&nbsp; ' + escHtml(c.id) + '</div></div>' +
        '<span class="status-pill ' + c.status + '">' + adminStatusLabel(c.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(c.desc || '—') + '</div>' +
      (c.imageUrl ? '<div class="item-card-thumb-wrap"><img class="complaint-card-thumb" src="' + escHtml(c.imageUrl) + '" alt="" /></div>' : '') +
      '<div class="item-card-footer">' +
        '<span class="item-card-date">' + escHtml(c.date) + '</span>' +
        '<span class="item-card-date">' + escHtml(c.citizen) + '</span>' +
        '<span class="item-card-date">' + escHtml(c.location || '—') + '</span>' +
        '<span class="priority-pill ' + c.priority + '">' + escHtml(c.priority.toUpperCase()) + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function filterAdminComplaints(status) {
  applyAdminComplaintFilters();
}

function searchAdminComplaints(query) {
  applyAdminComplaintFilters();
}

function applyAdminComplaintFilters() {
  var statusEl = document.getElementById('adminComplaintStatusFilter');
  var searchEl = document.getElementById('adminComplaintSearch');
  var status = statusEl ? statusEl.value : 'all';
  var q = searchEl ? searchEl.value.toLowerCase().trim() : '';
  var cards = document.querySelectorAll('#adminComplaintsList .item-card');
  cards.forEach(function(card) {
    var statusMatch = status === 'all' || card.dataset.status === status;
    var searchMatch = !q ||
      (card.dataset.title || '').includes(q) ||
      (card.dataset.citizen || '').includes(q);
    card.style.display = statusMatch && searchMatch ? '' : 'none';
  });
}

async function openAdminComplaintDetail(complaintId) {
  var complaint = adminComplaints.find(function(c) { return c.complaintId === complaintId; });
  if (!complaint) return;

  activeComplaintId = complaintId;

  try {
    var detailRes = await fetch(COMPLAINT_API_BASE + '/' + encodeURIComponent(complaintId));
    if (detailRes.ok) {
      var detail = await detailRes.json();
      complaint.desc = pickComplaintField(detail, 'description', 'Description') || complaint.desc;
      complaint.location = pickComplaintField(detail, 'address', 'Address') || complaint.location;
      complaint.citizen = pickComplaintField(detail, 'citizenName', 'CitizenName') || complaint.citizen;
      var detailImages = detail.images || detail.Images || [];
      if (Array.isArray(detailImages) && detailImages.length) {
        complaint.images = detailImages.map(resolveComplaintImageUrl).filter(Boolean);
        complaint.imageUrl = complaint.images[0] || complaint.imageUrl;
      }
    }
  } catch (_) { /* use list data */ }

  var imageHtml = buildComplaintImagesHtml(complaint);

  var bodyHtml =
    '<div class="modal-section-label">Complaint Number</div>' +
    '<div class="modal-value">' + escHtml(complaint.id) + '</div>' +
    '<div class="modal-section-label">Title</div>' +
    '<div class="modal-value">' + escHtml(complaint.title) + '</div>' +
    '<div class="modal-section-label">Category</div>' +
    '<div class="modal-value">' + escHtml(complaint.category) + '</div>' +
    '<div class="modal-section-label">Description</div>' +
    '<div class="modal-value">' + escHtml(complaint.desc || '—') + '</div>' +
    '<div class="modal-section-label">Citizen</div>' +
    '<div class="modal-value">' + escHtml(complaint.citizen) + '</div>' +
    '<div class="modal-section-label">Address</div>' +
    '<div class="modal-value">' + escHtml(complaint.location || '—') + '</div>' +
    '<div class="modal-section-label">Priority</div>' +
    '<div class="modal-value">' + escHtml(complaint.priority.toUpperCase()) + '</div>' +
    '<div class="modal-section-label">Status</div>' +
    '<div class="modal-value"><span class="status-pill ' + complaint.status + '">' + adminStatusLabel(complaint.status) + '</span></div>' +
    '<div class="modal-section-label">Filed On</div>' +
    '<div class="modal-value">' + escHtml(complaint.date) + '</div>' +
    '<div class="modal-section-label">Attachment</div>' +
    imageHtml +
    '<div class="complaint-status-form">' +
      '<div class="modal-section-label">Update Status</div>' +
      '<select id="adminStatusSelect">' +
        '<option value="Pending"' + (complaint.status === 'pending' ? ' selected' : '') + '>Pending</option>' +
        '<option value="InProgress"' + (complaint.status === 'inprogress' ? ' selected' : '') + '>In Progress</option>' +
        '<option value="Resolved"' + (complaint.status === 'resolved' ? ' selected' : '') + '>Resolved</option>' +
        '<option value="Rejected"' + (complaint.status === 'rejected' ? ' selected' : '') + '>Rejected</option>' +
      '</select>' +
      '<textarea id="adminStatusRemarks" placeholder="Remarks (optional)"></textarea>' +
      '<button type="button" class="btn-action btn-primary" onclick="submitAdminStatusUpdate()">Update Status</button>' +
    '</div>' +
    '<div class="modal-section-label">Status History</div>' +
    '<div class="complaint-history-list" id="adminComplaintHistory"><div class="modal-value">Loading history...</div></div>';

  document.getElementById('modalTitle').textContent = 'Complaint Details';
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalOverlay').classList.remove('hidden');
  loadAdminComplaintHistory(complaintId);
}

async function loadAdminComplaintHistory(complaintId) {
  var container = document.getElementById('adminComplaintHistory');
  if (!container) return;

  try {
    var response = await fetch(ADMIN_API_BASE + '/complaint-history/' + encodeURIComponent(complaintId));
    if (!response.ok) throw new Error('History unavailable');
    var data = await response.json();
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<div class="modal-value">No status history yet.</div>';
      return;
    }
    container.innerHTML = data.map(function(h) {
      return '<div class="complaint-history-item">' +
        '<strong>' + escHtml(h.oldStatus || '—') + ' → ' + escHtml(h.newStatus || '—') + '</strong><br>' +
        escHtml(h.changedBy || 'System') + ' · ' + formatComplaintDate(h.changedAt) +
        (h.remarks ? '<br><span>' + escHtml(h.remarks) + '</span>' : '') +
      '</div>';
    }).join('');
  } catch (_) {
    container.innerHTML = '<div class="modal-value">Unable to load history.</div>';
  }
}

async function submitAdminStatusUpdate() {
  if (!activeComplaintId) return;

  var userId = localStorage.getItem('userId');
  if (!userId) {
    showToast('Please log in again to update status.', 'warning');
    return;
  }

  var statusEl = document.getElementById('adminStatusSelect');
  var remarksEl = document.getElementById('adminStatusRemarks');
  var newStatus = statusEl ? statusEl.value : 'Pending';
  var remarks = remarksEl ? remarksEl.value.trim() : '';

  try {
    var response = await fetch(ADMIN_API_BASE + '/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintId: activeComplaintId,
        newStatus: newStatus,
        changedByUserId: parseInt(userId, 10),
        remarks: remarks || null
      })
    });

    if (!response.ok) throw new Error('Update failed');
    var msg = await response.text();
    showToast(msg || 'Complaint status updated.', 'success');
    closeModal();
    await loadAdminComplaints();
  } catch (_) {
    showToast('Unable to update complaint status.', 'error');
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  if (!requireAdminSession()) return;
  setDate();
  recomputeAllSections();
  renderSectionCards();
  computeAreaProgress();
  syncAreaSummary();
});
