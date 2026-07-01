
/* ============================================================
   ADMIN DASHBOARD — admin-dashboard.js
   Citizen Connect · Admin Control Panel
   Complete implementation with localStorage, progress tracking,
   conditional visibility, confirmation modal, toast system.
   ============================================================ */
alert("THIS IS MY JS FILE");
'use strict';

/* ============================================================
   CONSTANTS
   ============================================================ */
var LS_KEY = 'adminAreaOverviewData';
var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var ADMIN_API_BASE = 'http://localhost:5079/api/admin';
var COMPLAINT_API_BASE = 'http://localhost:5079/api/Admin';
var API_ORIGIN = 'http://localhost:5079';
let adminComplaints = [];
let adminSuggestions = [];
let officers = [];
let departments = [];
let selectedOfficerId = null;
var activeComplaintId = null;
var activeSuggestionId = null;
var SUGGESTION_API_BASE = 'http://localhost:5079/api/Admin' + '/suggestions';
let suggestionStatuses = [];

const OFFICER_API_BASE =
  'http://localhost:5079/api/officers';

var adminComplaintsData = [];

const WARD_REPRESENTATIVE_API =
    "http://localhost:5079/api/WardRepresentative";


const DEPARTMENT_API_BASE =
  'http://localhost:5079/api/departments';
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
    {key:'totalHouses',     label:'Total Houses',                   type:'number',   placeholder:'e.g. 4230' },
    { key:'maleLiteracy',    label:'Male Literacy Rate (%)',         type:'text',     placeholder:'e.g. 88.5' },
    { key:'femaleLiteracy',  label:'Female Literacy Rate (%)',       type:'text',     placeholder:'e.g. 79.2' },
    { key:'overallLiteracy', label:'Overall Literacy Rate (%)',      type:'text',     placeholder:'e.g. 84.1' },
    {key:'SurveyYear',      label:'Survey Year',                    type:'number',   placeholder:'e.g. 2023'  }
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
    window.location.href = "../home/login/admin/admin-login.html";
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
  if(sectionId === "representatives"){
    loadRepresentativeData();
}

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadRepresentativeData() {

    const response = await fetch(
        `${WARD_REPRESENTATIVE_API}/ward/1`
    );

    if (!response.ok)
        return;

    const members = await response.json();

    const data = {

        members: members.map(function (m) {

            return {

                name: m.representativeName,

                role: m.designation,

                mobile: m.mobileNumber,

                email: m.email,

                address: m.address
            };

        })
    };

    lsSet("representatives", data);

    refreshMembersList(data.members);

    renderSectionPreview("representatives");
}

function renderRepresentativePreview(members) {

    var previewBody = document.getElementById("sdPreviewBody");

    if (!previewBody)
        return;

    var html = "";

    members.forEach(function (m, i) {

        html += `
            <div class="sd-preview-member-card">
                <div class="sd-preview-member-name">${m.representativeName}</div>
                <div>Role: ${m.designation}</div>
                <div>Mobile: ${m.mobileNumber}</div>
                <div>Email: ${m.email ?? ""}</div>
                <div>Address: ${m.address ?? ""}</div>
            </div>
        `;
    });

    previewBody.innerHTML = html;
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

    if (!data.members)
        data.members = [];

    data.members.push({
        name: "",
        role: "",
        mobile: "",
        email: "",
        address: ""
    });

    lsSet(currentSectionId, data);

    refreshMembersList(data.members);

    renderSectionPreview(currentSectionId);

    showToast("Member added.", "success");
}

function deleteMember(index) {

    if (!currentSectionId) return;

    var data = lsGet(currentSectionId);

    if (!data.members)
        return;

    data.members.splice(index, 1);

    lsSet(currentSectionId, data);

    refreshMembersList(data.members);

    renderSectionPreview(currentSectionId);

    showToast("Member deleted.", "success");
}

function updateMemberField(index, key, value) {

    if (!currentSectionId) return;

    var data = lsGet(currentSectionId);

    if (!data.members)
        data.members = [];

    data.members[index][key] = value;

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

    if (!currentSectionId)
        return null;

    return lsGet(currentSectionId);
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

async function submitSectionData() {

    console.log("submitSectionData called");

    console.log("currentSectionId =", currentSectionId);

    var data = collectFormData();

    console.log("data =", data);

    if (!currentSectionId){
        console.log("RETURN-1");
        return;
    }

    if (!data){
        console.log("RETURN-2");
        return;
    }

    if (currentSectionId === "representatives"){

        console.log("Inside representatives");

        await saveWardRepresentatives(data);

        console.log("API Finished");

        return;
    }

    console.log("Current section is:", currentSectionId);
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
   window.location.href = "../home/login/admin/admin-login.html";
    return false;
  }
  return true;
}

async function loadAdminComplaints() {
  var list = document.getElementById('adminComplaintsList');
  if (!list) return;

  list.innerHTML = '<div class="item-empty"><div class="item-empty-icon">&#x23F3;</div><div>Loading complaints...</div></div>';

  try {
    var response = await fetch('http://localhost:5079/api/Admin' + '/complaints');
    if (!response.ok) throw new Error('Failed to load complaints');
    var data = await response.json();
    adminComplaints = Array.isArray(data)
      ? data.map(mapAdminComplaintToCard)
      : [];
    renderAdminComplaints(adminComplaints);
    updateComplaintStatusCards(adminComplaints);
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

function updateComplaintStatusCards(complaints) {

    const pending =
        complaints.filter(x => x.status === "pending").length;

    const inProgress =
        complaints.filter(x => x.status === "inprogress").length;

    const resolved =
        complaints.filter(x => x.status === "resolved").length;

    const rejected =
        complaints.filter(x => x.status === "rejected").length;

    document.getElementById("pendingCount").textContent =
        pending;

    document.getElementById("inProgressCount").textContent =
        inProgress;

    document.getElementById("resolvedCount").textContent =
        resolved;

    document.getElementById("rejectedCount").textContent =
        rejected;

    document.getElementById("allCount").textContent =
        complaints.length;
}

function updateSuggestionSummaryCards(data) {

    let pending = 0;
    let underReview = 0;
    let approved = 0;
    let implemented = 0;
    let rejected = 0;

    data.forEach(function(item) {

        const status =
            (item.status || "")
            .toString()
            .trim()
            .toLowerCase();

        if (status === "pending") {
            pending++;
        }
        else if (status === "under review") {
            underReview++;
        }
        else if (status === "approved") {
            approved++;
        }
        else if (status === "implemented") {
            implemented++;
        }
        else if (status === "rejected") {
            rejected++;
        }

    });

    document.getElementById("suggestionPendingCount").textContent =
        pending;

    document.getElementById("suggestionReviewCount").textContent =
        underReview;

    document.getElementById("suggestionApprovedCount").textContent =
        approved;

    document.getElementById("suggestionImplementedCount").textContent =
        implemented;

    document.getElementById("suggestionRejectedCount").textContent =
        rejected;

    document.getElementById("suggestionAllCount").textContent =
        data.length;
}

function filterSuggestionByCard(status) {

    const dropdown =
        document.getElementById(
            "adminSuggestionStatusFilter"
        );

    if (dropdown) {
        dropdown.value = status;
    }

    filterAdminSuggestions(status);

    document
        .querySelectorAll(
            "#panel-suggestions-management .status-card"
        )
        .forEach(card =>
            card.classList.remove("active")
        );

    const activeCard =
        document.querySelector(
            '#panel-suggestions-management .status-card.' +
            (
                status === "pending"
                    ? "pending"
                    : status === "under review"
                    ? "progress"
                    : status === "approved"
                    ? "resolved"
                   : status === "implemented"
? "implemented"
: status === "rejected"
? "rejected"
: "all"
            )
        );

console.log("Selected Status =", status);
console.log("Active Card =", activeCard);

console.log(activeCard.className);

    if (activeCard) {
        activeCard.classList.add("active");
    }
}

function filterByStatusCard(status) {

    const dropdown =
        document.getElementById(
            "adminComplaintStatusFilter"
        );

    if (dropdown) {
        dropdown.value = status;
    }

    filterAdminComplaints(status);

    document
        .querySelectorAll(".status-card")
        .forEach(card =>
            card.classList.remove("active")
        );

    const activeCard =
        document.querySelector(
            '.status-card.' +
            (
                status === "pending"
                    ? "pending"
                    : status === "inprogress"
                    ? "progress"
                    : status === "resolved"
                    ? "resolved"
                    : status === "rejected"
                    ? "rejected"
                    : "all"
            )
        );

    if (activeCard) {
        activeCard.classList.add("active");
    }
}

let allSuggestions = [];

async function loadAdminSuggestions() {
    try {

        const response = await fetch(
            "http://localhost:5079/api/suggestions/admin"
        );

        const result = await response.json();

        console.log(result);

        allSuggestions = (result.data || []).map(function(s) {
    return {
        ...s,
        isAnonymous:
            s.isAnonymous === true ||
            s.isAnonymous === "true"
    };
});

        console.log(allSuggestions);

updateSuggestionSummaryCards(allSuggestions);

renderAdminSuggestions(allSuggestions);

    } catch (error) {

        console.error(
            "Error loading suggestions:",
            error
        );
    }
}

function getSuggestionStatusText(status) {

    switch(status) {

        case 1:
            return "Pending";

        case 2:
            return "Approved";

        case 3:
            return "Rejected";

        case 4:
            return "Completed";

        default:
            return "Unknown";
    }
}

function renderAdminSuggestions(data) {

  var list = document.getElementById('adminSuggestionsList');
  if (!list) return;
if (!data || data.length === 0) {

  list.innerHTML = `
    <div class="empty-state">
      No suggestions found.
    </div>
  `;

  return;
}
  let html = '';

  data.forEach(function(s) {

    html += `
      <div class="item-card"
           data-suggestion-id="${s.suggestionId}"
           onclick="openAdminSuggestionDetail('${s.suggestionId}')">

        <div class="item-card-top">

          <div>
            <div class="item-card-title">${s.title || 'No Title'}</div>

            <div class="item-card-cat">
              ${s.categoryName || 'General'} &nbsp;&nbsp;
              ${s.suggestionNumber || ('SUG-' + s.suggestionId)}
            </div>
          </div>

         <span class="status-pill ${getSuggestionStatusClass(s.status)}">
  ${s.status}
</span>

        </div>

       <div class="item-card-desc">
  ${s.description || '—'}
</div>

${
  s.images && s.images.length > 0
  ?
  `
  <div class="item-card-thumb-wrap">
      <img
          src="${s.images[0]}"
          alt="Suggestion Image"
          class="suggestion-list-image"
      />
  </div>
  `
  : ''
}

        <div class="item-card-footer">

          <div class="item-card-footer-meta">
           <span class="item-card-date">
  ${formatDateDMY(s.createdAt || s.createdDate)}
</span>
            <span class="item-card-date">
  ${s.isAnonymous
      ? 'Anonymous'
      : (s.citizenName || '—')}
</span>
            <span class="item-card-date">${s.address || '—'}</span>
            <span class="item-card-date">Votes: ${s.totalVotes || 0}</span>
          </div>

       <div class="complaint-actions">

  <div class="complaint-action-chip history-chip"
       onclick="event.stopPropagation(); openSuggestionHistoryPopup('${s.suggestionId}')">

      <i class="fa-solid fa-chart-line"></i>
      <span>Status History</span>

  </div>

</div>
        </div>

      </div>
    `;

  });

  list.innerHTML = html;
}

function openSuggestionHistoryPopup(suggestionId) {

  const suggestion = allSuggestions.find(function(s) {
    return String(s.suggestionId) === String(suggestionId);
  });

  if (!suggestion) return;

  const historyHtml = `

<div class="history-popup-card">

  <div class="history-popup-item">

    <div class="history-popup-label">
      <i class="fa-solid fa-lightbulb"></i>
      Suggestion
    </div>

    <div class="history-popup-value">
      ${escHtml(suggestion.title || '—')}
    </div>

  </div>

  <div class="history-popup-item">

    <div class="history-popup-label">
      <i class="fa-solid fa-chart-line"></i>
      Status Journey
    </div>

    <div id="suggestion-history-container">

      <div class="history-loading">
        Loading history...
      </div>

    </div>

  </div>

</div>
`;

  document.getElementById('modalTitle').textContent =
    'Suggestion Status History';

  document.getElementById('modalBody').innerHTML =
    historyHtml;

  document.getElementById('modalOverlay')
    .classList.remove('hidden');

  loadSuggestionHistoryInline(
    suggestionId,
    'suggestion-history-container'
  );
}

function getSuggestionStatusLabel(status) {

  if (status === null || status === undefined) return '';

  var s = String(status).toLowerCase().trim();

  if (s === '1') return 'Pending';
  if (s === '2') return 'Under Review';
  if (s === '3') return 'Approved';
  if (s === '4') return 'Implemented';
  if (s === 'pending') return 'Pending';
  if (s === 'approved') return 'Approved';
  if (s === 'rejected') return 'Rejected';

  return status;
}

function formatDateDMY(dateInput) {

  if (!dateInput) return '—';

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return '—';

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return day + ' ' + month + ' ' + year;
}

function viewSuggestion(id) {
    alert("View Suggestion ID: " + id);
}

async function updateSuggestionStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:5079/api/suggestions/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status,
                remarks: "",
                changedByUserId: 1
            })
        }); 

        const result = await response.json();

        if (result.success) {
            alert("Status updated successfully");

            // reload list
            loadAdminSuggestions();
        } else {
            alert("Failed to update");
        }

    } catch (error) {
        console.error(error);
        alert("Error updating suggestion");
    }
}

function filterAdminSuggestions(status) {

    if (status === "all") {
        renderAdminSuggestions(allSuggestions);
        return;
    }

    const filtered = allSuggestions.filter(function(s) {

        return String(s.status)
    .toLowerCase() === status.toLowerCase();
    });

    renderAdminSuggestions(filtered);
}

function searchAdminSuggestions(text) {
    const filtered = allSuggestions.filter(s =>
        (s.title && s.title.toLowerCase().includes(text.toLowerCase())) ||
        (s.description && s.description.toLowerCase().includes(text.toLowerCase()))
    );

    renderAdminSuggestions(filtered);
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
      complaintCategoryId:
    c.complaintCategoryId != null
        ? c.complaintCategoryId
        : c.ComplaintCategoryId,
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

function mapAdminSuggestionToCard(s) {
  return {
    suggestionId: s.suggestionId || s.SuggestionId,
    id: s.suggestionNumber || s.SuggestionNumber || ('SUG-' + (s.suggestionId || s.SuggestionId)),
    title: s.title || s.Title || '',
    category: (s.categoryName || s.CategoryName || '—'),
    desc: s.description || s.Description || '',
    citizen: s.citizenName || s.CitizenName || '—',
    date: formatComplaintDate(s.createdAt || s.CreatedAt),
    status: normalizeSuggestionStatus(s.status || s.Status),
    votes: s.totalVotes || s.TotalVotes || 0
  };
}

function normalizeSuggestionStatus(status) {

    if (!status)
        return "review";

    const s =
        String(status).toLowerCase();

    if (s === "pending")
        return "review";
      

    if (s === "under review")
        return "review";

    if (s === "approved")
        return "approved";

    if (s === "implemented")
        return "implemented";

    if (s === "rejected")
        return "rejected";

    return "review";
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
  adminComplaintsData = data;
  console.log(data[0]);
  var list = document.getElementById('adminComplaintsList');
  if (!list) return;
  
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon">&#x1F4CB;</div><div>No complaints found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function(c) {
    return '<div class="item-card" data-complaint-id="' + c.complaintId + '" data-status="' + c.status + '" data-title="' + escHtml(c.title).toLowerCase() + '" data-citizen="' + escHtml(c.citizen).toLowerCase() + '" onclick="openAdminComplaintDetail(event, ' + c.complaintId + ')">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(c.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(c.category) + ' &nbsp;&nbsp; ' + escHtml(c.id) + '</div></div>' +
        '<span class="status-pill ' + c.status + '">' + adminStatusLabel(c.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(c.desc || '—') + '</div>' +
      (c.imageUrl ? '<div class="item-card-thumb-wrap"><img class="complaint-card-thumb" src="' + escHtml(c.imageUrl) + '" alt="" /></div>' : '') +

  '<div class="item-card-footer">' +
  '<div class="item-card-footer-left">' +
    '<div class="item-card-footer-meta">' +
      '<span class="item-card-date">' + escHtml(c.date) + '</span>' +
      '<span class="item-card-date">' + escHtml(c.citizen) + '</span>' +
      '<span class="item-card-date">' + escHtml(c.location || '—') + '</span>' +

      '<span class="priority-pill ' + c.priority + '">' +
        escHtml(c.priority.toUpperCase()) +
      '</span>' +

    '</div>' +

  '</div>' +

'<div class="complaint-actions">' +

'<div class="complaint-action-chip officer-chip" onclick="event.stopPropagation(); openAssignedOfficerPopup(' + c.complaintId + ')">' +
  '<i class="fa-solid fa-address-card"></i>' +
  '<span>Assigned Officer</span>' +
'</div>' +

'<div class="complaint-action-chip history-chip" onclick="event.stopPropagation(); openComplaintHistoryPopup(' + c.complaintId + ')">' +
  '<i class="fa-solid fa-chart-line"></i>' +
  '<span>Status History</span>' +
'</div>' +

'</div>' +

'</div></div></div>'
  }).join('');
}

function openComplaintHistoryPopup(complaintId) {

  const complaint = adminComplaintsData.find(function(c) {
    return String(c.complaintId) === String(complaintId);
  });

  if (!complaint) return;

const historyHtml = `

<div class="history-popup-card">

  <div class="history-popup-item">

    <div class="history-popup-label">
      <i class="fa-solid fa-file-circle-exclamation"></i>
      Complaint
    </div>

    <div class="history-popup-value">
      ${escHtml(complaint.title || '—')}
    </div>

  </div>

  <div class="history-popup-item">

    <div class="history-popup-label">
      <i class="fa-solid fa-chart-line"></i>
      Status Journey
    </div>

    <div id="complaint-history-container">

      <div class="history-loading">
        Loading history...
      </div>

    </div>

  </div>

</div>
`;

  document.getElementById('modalTitle').textContent =
    'Complaint Status History';

  document.getElementById('modalBody').innerHTML =
    historyHtml;

  document.getElementById('modalOverlay')
    .classList.remove('hidden');

  loadComplaintHistoryInline(
    complaintId,
    'complaint-history-container'
  );
}

async function openAssignedOfficerPopup(complaintId) {

  try {

    const res = await fetch(
      'http://localhost:5079/api/Complaint/' + complaintId
    );

    if (!res.ok) return;

    const detail = await res.json();

    // ✅ CHECK if officer exists
    const isAssigned =
  detail.status &&
  detail.status.toLowerCase() === "assigned";

    let officerHtml = '';

    // =====================================================
    // CASE 1: NOT ASSIGNED
    // =====================================================
    if (!isAssigned) {

      officerHtml = `
        <div class="officer-popup-card">

          <div class="officer-popup-item">

            <div class="officer-popup-label">
              <i class="fa-solid fa-user-slash"></i>
              Officer Status
            </div>

            <div class="officer-popup-value">
              Not assigned to officer yet
            </div>

          </div>

        </div>
      `;
    }

    // =====================================================
    // CASE 2: ASSIGNED
    // =====================================================
    else {

      officerHtml = `
        <div class="officer-popup-card">

          <div class="officer-popup-item">
            <div class="officer-popup-label">
              <i class="fa-solid fa-id-badge"></i>
              Officer Name
            </div>

            <div class="officer-popup-value">
              ${escHtml(detail.officerName)}
            </div>
          </div>

          <div class="officer-popup-item">
            <div class="officer-popup-label">
              <i class="fa-solid fa-briefcase"></i>
              Designation
            </div>

            <div class="officer-popup-value">
              ${escHtml(detail.officerDesignation || '—')}
            </div>
          </div>

          <div class="officer-popup-item">
            <div class="officer-popup-label">
              <i class="fa-solid fa-phone"></i>
              Mobile Number
            </div>

            <div class="officer-popup-value">
              ${escHtml(detail.officerMobileNumber || '—')}
            </div>
          </div>

          <div class="officer-popup-item">
            <div class="officer-popup-label">
              <i class="fa-solid fa-envelope"></i>
              Email Address
            </div>

            <div class="officer-popup-value">
              ${escHtml(detail.officerEmail || '—')}
            </div>
          </div>

        </div>
      `;
    }

    document.getElementById('modalTitle').textContent =
      'Assigned Officer Details';

    document.getElementById('modalBody').innerHTML =
      officerHtml;

    document.getElementById('modalOverlay')
      .classList.remove('hidden');

  } catch (err) {
    console.error(err);
  }
}

function closeComplaintHistoryModal() {

  var modal =
    document.getElementById('complaintHistoryModal');

  if (modal) {
    modal.remove();
  }

}

async function loadComplaintHistoryInline(complaintId, containerId) {

  try {

   const res = await fetch(
  `http://localhost:5079/api/Admin/complaint-history/${complaintId}`
);

    const history = await res.json();
    console.log("COMPLAINT HISTORY API RESPONSE:", history);

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = renderStatusHistory(history, 'complaint');

  } catch (err) {
    console.error(err);
  }
}

function renderStatusHistory(history, type) {

if (!history || history.length === 0) {
  return `
    <div class="item-empty">
      <div class="item-empty-icon">📜</div>
      <div>No status history found</div>
    </div>
  `;
}

var createdEntry = history.find(function(h) {
  return !h.oldStatus;
});

var otherEntries = history.filter(function(h) {
  return h.oldStatus;
});

var orderedHistory = [];

if (createdEntry) {
  orderedHistory.push(createdEntry);
}

orderedHistory = orderedHistory.concat(otherEntries);

if (!createdEntry && orderedHistory.length > 0) {

  orderedHistory.unshift({
    oldStatus: null,
    newStatus: null,
    remarks: null,
    createdAt: orderedHistory[0].createdAt || orderedHistory[0].changedAt
  });

}

return orderedHistory.map(function(h){

var isCreated = !h.oldStatus || h.oldStatus === null || h.oldStatus === undefined || h.oldStatus === '';

var fromStatus = getComplaintStatusLabel(h.oldStatus);
var toStatus = getComplaintStatusLabel(h.newStatus);

var eventTitle = (!isCreated && fromStatus && toStatus)
  ? (fromStatus + ' → ' + toStatus)
  : null;


var createdLabel =
  isCreated
    ? (type === 'complaint' ? 'Complaint Created' : 'Suggestion Created')
    : null;

    return `
      <div class="history-item">

        <div class="history-dot"></div>

        <div class="history-content">

        ${isCreated
  ? `<div class="history-status created">${createdLabel}</div>`
  : `<div class="history-status">${eventTitle}</div>`
}

${h.assignedOfficerName
  ? `
    <div class="history-assigned-officer">
  <i class="fa-solid fa-user-check"></i>
  Assigned to:
  <span class="history-officer-name">
    ${h.assignedOfficerName}
  </span>
</div>
  `
  : ''
}

<div class="history-date">
  ${formatDate(h.createdAt || h.changedAt)}
</div>

          ${h.remarks
            ? `<div class="history-remarks">📝 ${h.remarks}</div>`
            : ''
          }

        </div>

      </div>
    `;
  }).join('');
}

function getComplaintStatusLabel(status) {

  if (!status) return '';

  var s = String(status).toLowerCase().trim();

  if (s === '1') return 'Pending';
  if (s === '2') return 'In Progress';
  if (s === '3') return 'Resolved';
  if (s === '4') return 'Rejected';

  if (s === 'pending') return 'Pending';
  if (s === 'inprogress') return 'In Progress';
  if (s === 'resolved') return 'Resolved';
  if (s === 'rejected') return 'Rejected';

  return status;
}

function closeHistoryModal() {
  var modal = document.getElementById('historyModal');

  if (modal) {
    modal.remove();
  }
}

function formatDate(dateString) {

  if (!dateString) return '—';

  var d = new Date(dateString);

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

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
  var visibleCount = 0;
  cards.forEach(function(card) {
    var statusMatch = status === 'all' || card.dataset.status === status;
    var searchMatch = !q ||
      (card.dataset.title || '').includes(q) ||
      (card.dataset.citizen || '').includes(q);
    if (statusMatch && searchMatch) {
  card.style.display = '';
  visibleCount++;
} else {
  card.style.display = 'none';
}
});
var list = document.getElementById('adminComplaintsList');

var emptyMsg = document.getElementById('complaintEmptyMessage');

if (emptyMsg) {
  emptyMsg.remove();
}

if (visibleCount === 0) {
  list.insertAdjacentHTML(
    'beforeend',
    '<div id="complaintEmptyMessage" class="item-empty">' +
      '<div class="item-empty-icon">&#x1F4CB;</div>' +
      '<div>No complaints found.</div>' +
    '</div>'
  );
}
}

async function openAdminComplaintDetail(event, complaintId) {
  if (event) event.stopPropagation();
  var complaint = adminComplaints.find(function(c) { return c.complaintId === complaintId; });
  console.log("COMPLAINT OBJECT", complaint);
  if (!complaint) return;

  activeComplaintId = complaintId;

window.currentComplaintCategoryId =
    complaint.complaintCategoryId;

  try {
    var detailRes = await fetch('http://localhost:5079/api/Complaint/' + encodeURIComponent(complaintId));
    if (detailRes.ok) {
      var detail = await detailRes.json();
      console.log("Officer Name =", detail.officerName);
console.log("Officer Designation =", detail.officerDesignation);
console.log("Officer Mobile =", detail.officerMobileNumber);
console.log("Officer Email =", detail.officerEmail);
console.log("FULL DETAIL =", detail);
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
  '<select id="adminStatusSelect"></select>' +
  '<div id="assignedOfficerBox" style="display:none;margin-top:10px;"></div>' +
      '<textarea id="adminStatusRemarks" placeholder="Remarks (optional)"></textarea>' +
      '<button type="button" class="btn-action btn-primary" onclick="submitAdminStatusUpdate()">Update Status</button>' +
    '</div>';

document.getElementById('modalTitle').textContent = 'Complaint Details';
document.getElementById('modalBody').innerHTML = bodyHtml;
document.getElementById('modalOverlay').classList.remove('hidden');
loadComplaintStatuses(complaint.status);
}

async function loadComplaintStatuses(selectedStatus) {
  try {
    var res = await fetch('http://localhost:5079/api/Admin/complaint-statuses');
    if (!res.ok) {
      console.error('Failed to load statuses');
      return;
    }

    var response = await res.json();
    var statuses = response.data || [];

    var select = document.getElementById('adminStatusSelect');
    if (!select) return;

    select.innerHTML = '';

    statuses.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.complaintStatusMasterId;
      opt.textContent = s.statusName;

      // auto-select current status
      if (s.statusName.toLowerCase() === (selectedStatus || '').toLowerCase()) {
        opt.selected = true;
      }

      select.appendChild(opt);
    });
    select.addEventListener('change', handleAssignedStatusChange);

  } catch (err) {
    console.error('Error loading complaint statuses:', err);
  }
}

async function handleAssignedStatusChange() {

    var select = document.getElementById('adminStatusSelect');
    var box = document.getElementById('assignedOfficerBox');

    if (!select || !box) return;

    var selectedText =
        select.options[select.selectedIndex].text;

    if (selectedText.toLowerCase() !== 'assigned') {
        box.style.display = 'none';
        box.innerHTML = '';
        return;
    }

    try {

        var res = await fetch(
            'http://localhost:5079/api/Admin/officer-by-category/' +
            window.currentComplaintCategoryId
        );

        var officers = await res.json();

        box.style.display = 'block';

        if (!officers || officers.length === 0) {
            box.innerHTML = 'No officers assigned';
            return;
        }

        var html = `
    <div class="modal-section-label">Assign Officer</div>
    <div class="assigned-officer-list">
`;

officers.forEach((o) => {

    const isOnlyOne = officers.length === 1;
    const checked = isOnlyOne ? 'checked' : '';

    html += `
        <label class="officer-card">

            <input type="radio"
                   name="assignedOfficer"
                   value="${o.officerId}"
                   ${checked} />

            <div class="officer-info">

                <div class="officer-top">
                    <div class="officer-name">${o.officerName}</div>

                    <div class="role-badge">
                        ${o.designation ? o.designation : 'Officer'}
                    </div>
                </div>

                <div class="selected-tick">✔</div>

            </div>
        </label>
    `;
});

html += `</div>`;
box.innerHTML = html;

    } catch (err) {

        console.error(err);

        box.style.display = 'block';
        box.innerHTML = 'Unable to load officer details';
    }

    setTimeout(() => {

    document.querySelectorAll('.officer-card').forEach(card => {

        card.addEventListener('click', function (e) {

            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });

    });

}, 0);
}

async function loadSuggestionStatuses() {

  try {

    const response = await fetch(
      'http://localhost:5079/api/admin/statuses'
    );

    const result = await response.json();

    console.log('Suggestion Statuses =', result);

    suggestionStatuses = result.data || [];

  } catch (error) {

    console.error(
      'Error loading suggestion statuses:',
      error
    );
  }
}

async function openAdminSuggestionDetail(suggestionId) {

    console.log("FUNCTION CALLED");
console.log("ID =", suggestionId);

var suggestion = allSuggestions.find(function(s) {
    return Number(s.suggestionId) === Number(suggestionId);
});

if (!suggestion) {
    console.error("Suggestion Not Found");
    return;
}

console.log("FULL SUGGESTION =", suggestion);
console.log("IMAGES =", suggestion.images);
console.log(JSON.stringify(suggestion, null, 2));

  var statusClass = '';

  const status = String(suggestion.status).toLowerCase();

  if (status === '1' || status === 'pending')
    statusClass = 'pending';

  else if (status === '2' || status === 'under review')
    statusClass = 'under review';
  else if (status === '3' || status === 'approved')
    statusClass = 'approved';
  else if (status === '4' || status === 'rejected')
    statusClass = 'rejected';

  else if (status === '5' || status === 'implemented')
    statusClass = 'implemented';

  var bodyHtml =

  '<div class="modal-section-label">Suggestion Number</div>' +
  '<div class="modal-value">' +
    escHtml(suggestion.suggestionNumber || '—') +
  '</div>' +

  '<div class="modal-section-label">Title</div>' +
  '<div class="modal-value">' +
    escHtml(suggestion.title || '—') +
  '</div>' +

  '<div class="modal-section-label">Category</div>' +
  '<div class="modal-value">' +
    escHtml(suggestion.categoryName || 'General') +
  '</div>' +

  '<div class="modal-section-label">Description</div>' +
  '<div class="modal-value">' +
    escHtml(suggestion.description || '—') +
  '</div>' +

'<div class="modal-section-label">Citizen</div>' +
'<div class="modal-value">' +
  escHtml(
    suggestion.isAnonymous
      ? 'Anonymous'
      : (suggestion.citizenName || '—')
  ) +
'</div>' +

  '<div class="modal-section-label">Address</div>' +
  '<div class="modal-value">' +
    escHtml(suggestion.address || '—') +
  '</div>' +

  '<div class="modal-section-label">Votes</div>' +
  '<div class="modal-value">' +
    escHtml(String(suggestion.totalVotes || 0)) +
  '</div>' +

 '<div class="modal-section-label">Status</div>' +
'<div class="modal-value">' +
  '<span class="status-pill ' + getSuggestionStatusClass(suggestion.status) + '">' +
    escHtml(suggestion.status || 'Unknown') +
  '</span>' +
'</div>' +

  '<div class="modal-section-label">Filed On</div>' +
  '<div class="modal-value">' +
    escHtml(formatComplaintDate(suggestion.createdAt)) +
  '</div>' +

'<div class="modal-section-label">Attachment</div>' +

(
    Array.isArray(suggestion.images) &&
    suggestion.images.length > 0

        ? `
            <div class="modal-value">

                <img
                    src="${suggestion.images[0]}"
                    alt="Suggestion Attachment"
                    class="complaint-detail-img"
                />

            </div>
          `

        : '<div class="modal-value">No image attached</div>'
) +

  '<div class="complaint-status-form">' +

    '<div class="modal-section-label">Update Status</div>' +

    '<select id="adminSuggestionStatusSelect">' +

  suggestionStatuses.map(function(statusItem) {

    return '<option value="' +
      statusItem.suggestionStatusMasterId + '"' +

      (
        String(statusItem.statusName).toLowerCase() ===
        String(suggestion.status).toLowerCase()

          ? ' selected'
          : ''
      ) +

      '>' +

      escHtml(statusItem.statusName) +

      '</option>';

  }).join('') +

'</select>' +

    '<textarea id="adminSuggestionRemarks" placeholder="Remarks (optional)"></textarea>' +

    '<button type="button" class="btn-action btn-primary" onclick="submitSuggestionStatusUpdate(' +
      suggestion.suggestionId +
    ')">' +
      'Update Status' +
    '</button>' +

  '</div>' 

  document.getElementById('modalTitle').textContent =
    'Suggestion Details';

  document.getElementById('modalBody').innerHTML =
    bodyHtml;

  document.getElementById('modalOverlay')
    .classList.remove('hidden');
}

async function loadSuggestionHistoryInline(suggestionId, containerId) {

  try {

    const res = await fetch(
      `http://localhost:5079/api/suggestions/history/${suggestionId}`
    );

    const result = await res.json();

    const history = result.data || [];

    const container = document.getElementById(containerId);

    if (!container) return;

    if (!history.length) {
      container.innerHTML = `<div class="modal-value">No history found</div>`;
      return;
    }

    container.innerHTML = history
  .filter(function(h) {

    // remove junk rows
    if (!h.oldStatus || !h.newStatus) return false;

    // remove same-to-same updates
    if (h.oldStatus === h.newStatus) return false;

    // remove meaningless labels
    if (String(h.remarks || '').toLowerCase().includes('status change')) return false;

    return true;
  })
  .sort(function(a, b) {
    return new Date(a.changedAt) - new Date(b.changedAt);
  })
.map(function(h) {

  return `

<div class="history-item">

  <div class="history-dot"></div>

  <div class="history-content">

    <div class="history-status">

      <span>
        ${getSuggestionStatusLabel(h.oldStatus)}
      </span>

     <span class="arrow">→</span>

      <span>
        ${getSuggestionStatusLabel(h.newStatus)}
      </span>

    </div>

    <div class="history-date">
      ${formatDate(h.changedAt)}
    </div>

    ${
      h.remarks && h.remarks.trim() !== ''
      ? `
      <div class="history-remarks">
  📝 ${escHtml(h.remarks)}
</div>
      `
      : ''
    }

  </div>

</div>

`;
})
  .join('');

  } catch (err) {
    console.error(err);
  }
}

function getSuggestionStatusClass(status) {

  if (!status)
    return 'status-unknown';

  status = String(status).toLowerCase();

  if (status === 'pending')
    return 'status-pending';

  if (status === 'under review')
    return 'status-review';

  if (status === 'approved')
    return 'status-approved';

  if (status === 'implemented')
    return 'status-implemented';

  if (status === 'rejected')
    return 'status-rejected';

  return 'status-unknown';
}

async function submitSuggestionStatusUpdate(suggestionId) {

    try {

        const statusId =
            document.getElementById(
                'adminSuggestionStatusSelect'
            ).value;

        const remarks =
            document.getElementById(
                'adminSuggestionRemarks'
            ).value;

        const response = await fetch(
            'http://localhost:5079/api/admin/suggestions/' +
            suggestionId +
            '/status',
            {
                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    suggestionId: suggestionId,

                    suggestionStatusMasterId:
                        parseInt(statusId),

                    remarks: remarks,

                    changedByUserId: 1
                })
            }
        );

        const result = await response.json();

        console.log(result);

        if (result.success) {

            alert('Suggestion status updated successfully');

            closeModal();

            await loadAdminSuggestions();

        } else {

            alert(result.message || 'Update failed');
        }

    } catch (error) {

        console.error(error);

        alert('Error updating suggestion status');
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

  var selectedOfficer =
    document.querySelector(
        'input[name="assignedOfficer"]:checked'
    );

var assignedOfficerId =
    selectedOfficer
        ? parseInt(selectedOfficer.value, 10)
        : null;

console.log(
    'Selected Officer Id:',
    assignedOfficerId
);

  try {
    var response = await fetch('http://localhost:5079/api/Admin' + '/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
  complaintId: activeComplaintId,
  complaintStatusMasterId: parseInt(newStatus, 10),
  assignedOfficerId: assignedOfficerId,
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
document.addEventListener('DOMContentLoaded', async function() {

  if (!requireAdminSession()) return;

  setDate();

  await loadDashboardSummary();

  recomputeAllSections();

  renderSectionCards();

  computeAreaProgress();

  syncAreaSummary();
});

window.onload = async function () {

    await loadDashboardSummary();

    await loadSuggestionStatuses();

    await loadAdminSuggestions();
};

var allCitizens = [];

async function loadDashboardSummary() {

    try {

        const response =
            await fetch(
                "http://localhost:5079/api/Dashboard/summary"
            );

        const data =
            await response.json();

        document.getElementById(
            "totalCitizensCount"
        ).textContent =
            data.totalCitizens || 0;

        document.getElementById(
            "openComplaintsCount"
        ).textContent =
            data.openComplaints || 0;

        document.getElementById(
            "resolvedComplaintsCount"
        ).textContent =
            data.resolvedComplaints || 0;

        document.getElementById(
            "totalStaffCount"
        ).textContent =
            data.totalStaff || 0;

        document.getElementById(
            "totalWardsCount"
        ).textContent =
            data.totalWards || 0;

        document.getElementById(
            "totalSuggestionsCount"
        ).textContent =
            data.totalSuggestions || 0;

    }
    catch (err) {

        console.error(
            "Dashboard Summary Error",
            err
        );
    }
}
/* LOAD CITIZENS */
async function loadCitizens() {
  try {
    const res = await fetch("http://localhost:5079/api/Admin/citizens");
    const data = await res.json();

    console.log("CITIZENS =", data);

    allCitizens = data.data || data || [];

    renderCitizens(allCitizens);

  } catch (err) {
    console.error("Error loading citizens", err);

    document.getElementById("citizenTableBody").innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:30px;">
          Failed to load citizens
        </td>
      </tr>
    `;
  }
}

/* RENDER TABLE */
function renderCitizens(list) {

  var tbody = document.getElementById("citizenTableBody");

  if (!list || list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:40px;">
          No citizens found
        </td>
      </tr>
    `;
    return;
  }

  var html = '';

  list.forEach((c, index) => {

    html += `
  <tr>

    <td>${index + 1}</td>

    <td>
      <div class="citizen-info">

        <div class="citizen-avatar">
          ${(c.firstName || 'C').charAt(0).toUpperCase()}
        </div>

        <div>
          <div class="citizen-name">
            ${c.firstName || ''} ${c.lastName || ''}
          </div>

          <div class="citizen-sub">
            Citizen
          </div>
        </div>

      </div>
    </td>

    <td>
      ${c.email || '-'}
    </td>

    <td>
      ${c.mobile || '-'}
    </td>

    <td>
      ${
        c.createdAt
          ? new Date(c.createdAt).toLocaleDateString()
          : '-'
      }
    </td>

    <td>
      <div class="citizen-actions">
        <button class="citizen-btn edit">
          ✏️
        </button>
      </div>
    </td>

  </tr>
`;
  });

  tbody.innerHTML = html;
}

/* SEARCH */
function searchCitizens(query) {

  query = query.toLowerCase().trim();

  var filtered = allCitizens.filter(c => {

    var fullName =
      `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();

    var email = (c.email || '').toLowerCase();

    var mobile = (c.mobile || '').toLowerCase();

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      mobile.includes(query)
    );
  });

  renderCitizens(filtered);
}

document.addEventListener("DOMContentLoaded", function () {
  loadCitizens();
});

function openOfficerModal() {

  selectedOfficerId = null;

  document.getElementById('officerModalTitle')
    .textContent = 'Add Officer';

  document.getElementById('saveOfficerBtn')
    .textContent = 'Save Officer';

  clearOfficerForm();

  document.getElementById('officerModalOverlay')
    .classList.remove('hidden');
}

/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeOfficerModal() {

  document.getElementById(
    'officerModalOverlay'
  ).classList.add('hidden');
}

/* ============================================================
   CLEAR FORM
   ============================================================ */

function clearOfficerForm() {

  [
    'officerFirstName',
    'officerLastName',
    'officerEmail',
    'officerMobile',
    'officerDesignation',
    'officerDepartment'
  ].forEach(function(id) {

    document.getElementById(id).value = '';

  });

  document.getElementById(
    'officerAvailability'
  ).value = 'true';
}

/* ============================================================
   LOAD OFFICERS
   ============================================================ */

async function loadOfficers() {

  try {

    const response =
      await fetch(OFFICER_API_BASE);

    if (!response.ok) {

      throw new Error(
        'Failed to load officers.'
      );
    }

    officers =
      await response.json();

    renderOfficerTable(officers);

  }
  catch(error) {

    console.error(error);

    showToast(
      'Unable to load officers.',
      'error'
    );
  }
}

function renderOfficerTable(data) {

  const tableBody =
    document.getElementById(
      'officerTableBody'
    );

  if (!tableBody) return;

  if (!data.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="staff-empty">
            <div class="staff-empty-icon">👮</div>
            <div class="staff-empty-title">
              No Officers Found
            </div>
          </div>
        </td>
      </tr>
    `;

    return;
  }

  let html = '';

 data.forEach(officer => {

  const statusClass = officer.isAvailable ? 'active' : 'inactive';
  const statusLabel = officer.isAvailable ? 'Available' : 'Unavailable';

  const categories = officer.categoryNames && officer.categoryNames.length
    ? officer.categoryNames.join(', ')
    : '—';

  html += `
    <tr>
      <td>${officer.fullName}</td>
      <td>${officer.email}</td>
      <td>${officer.mobileNumber}</td>
      <td>${officer.departmentName}</td>

      <!-- CATEGORY FIX -->
      <td>${categories}</td>

      <td>${officer.designation}</td>

      <td>
        <span class="staff-status ${statusClass}">
          ${statusLabel}
        </span>
      </td>
      <td>
        <div class="staff-actions">
          <button class="staff-btn edit"
            onclick="editOfficer(${officer.officerId})">✏️</button>

          <button class="staff-btn delete"
            onclick="deleteOfficer(${officer.officerId})">🗑️</button>
        </div>
      </td>
    </tr>
  `;
});

  tableBody.innerHTML = html;
}

/* ============================================================
   LOAD DEPARTMENTS
   ============================================================ */

async function loadDepartments() {

  try {

    const response =
      await fetch(DEPARTMENT_API_BASE);

    if (!response.ok) {

      throw new Error(
        'Failed to load departments.'
      );
    }

    departments =
      await response.json();

    renderDepartmentDropdowns();

  }
  catch(error) {

    console.error(error);
  }
}

/* ============================================================
   RENDER DEPARTMENTS
   ============================================================ */

function renderDepartmentDropdowns() {

  /* =====================================================
     FORM DROPDOWN
     ===================================================== */

  const departmentSelect =
    document.getElementById(
      'officerDepartment'
    );

  if (departmentSelect) {

    departmentSelect.innerHTML = `
      <option value="">
        Select Department
      </option>
    `;

    departments.forEach(department => {

      departmentSelect.innerHTML += `
        <option value="${department.departmentId}">
          ${department.departmentName}
        </option>
      `;
    });
  }

  /* =====================================================
     FILTER DROPDOWN
     ===================================================== */

  const filterSelect =
    document.getElementById(
      'departmentFilter'
    );

  if (filterSelect) {

    filterSelect.innerHTML = `
      <option value="all">
        All Departments
      </option>
    `;

    departments.forEach(department => {

      filterSelect.innerHTML += `
        <option value="${department.departmentName}">
          ${department.departmentName}
        </option>
      `;
    });
  }
}
/* ============================================================
   SAVE OFFICER
   ============================================================ */

async function saveOfficer() {

  try {

    const payload = {
      firstName: document.getElementById('officerFirstName').value,
      lastName: document.getElementById('officerLastName').value,
      email: document.getElementById('officerEmail').value,
      mobileNumber: document.getElementById('officerMobile').value,
      designation: document.getElementById('officerDesignation').value,

      departmentId: Number(
        document.getElementById('officerDepartment').value
      ),

      categoryId: Number(
        document.getElementById('officerCategory').value
      ),

      wardId: 1,   // only Shivaji Ward

      isAvailable:
        document.getElementById('officerAvailability').value === 'true'
};

    let response;

    if (selectedOfficerId) {

      response = await fetch(
        `${OFFICER_API_BASE}/${selectedOfficerId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

    } else {

      response = await fetch(
        OFFICER_API_BASE,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
    }

    // ✅ ERROR HANDLING (fixed)
    if (!response.ok) {

      let errorMessage = 'Failed to save officer.';

      try {
        const errorData = await response.json();
        errorMessage =
          errorData?.message ||
          errorData?.title ||
          JSON.stringify(errorData);
      } catch (e) {
  errorMessage = 'Server error while saving officer.';
}
      throw new Error(errorMessage);
    }

    // ✅ SUCCESS FLOW
    showToast('Officer saved successfully.', 'success');

    closeOfficerModal();
    loadOfficers();

    selectedOfficerId = null;

  } catch (error) {

    console.error(error);

    showToast(
      error.message || 'Unable to save officer.',
      'error'
    );
  }
}

/* ============================================================
   EDIT OFFICER
   ============================================================ */

async function editOfficer(id) {

  try {

    const response = await fetch(`${OFFICER_API_BASE}/${id}`);
    const officer = await response.json();

    selectedOfficerId = id;

    const names = officer.fullName.split(' ');

    document.getElementById('officerFirstName').value = names[0];
    document.getElementById('officerLastName').value = names.slice(1).join(' ');
    document.getElementById('officerEmail').value = officer.email;
    document.getElementById('officerMobile').value = officer.mobileNumber;
    document.getElementById('officerDesignation').value = officer.designation;
    document.getElementById('officerDepartment').value =
  officer.departmentId;

await loadCategoriesByDepartment(officer.departmentId);

document.getElementById('officerCategory').value =
  officer.categoryId;
  
    document.getElementById('officerAvailability').value = String(officer.isAvailable);

    document.getElementById('officerModalOverlay')
      .classList.remove('hidden');

  } catch (error) {

    console.error(error);

  }
}

/* ============================================================
   DELETE OFFICER
   ============================================================ */

function deleteOfficer(id) {

  showConfirm('Delete Officer', 'Are you sure?', async function() {

    try {

      const response = await fetch(
        `${OFFICER_API_BASE}/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Delete failed.');
      }

      showToast('Officer deleted.', 'success');
      loadOfficers();

    } catch (error) {

      console.error(error);

    }
  });
}

/* ============================================================
   SEARCH
   ============================================================ */

function searchOfficers() {
  applyOfficerFilters();
}

/* ============================================================
   FILTER
   ============================================================ */

function filterOfficers() {
  applyOfficerFilters();
}

/* ============================================================
   APPLY FILTERS
   ============================================================ */

function applyOfficerFilters() {    

  const search = document.getElementById('officerSearch').value.toLowerCase();
  const department = document.getElementById('departmentFilter').value;
  const status = document.getElementById('statusFilter').value;

  const filtered = officers.filter(officer => {

    const matchesSearch =
      officer.fullName.toLowerCase().includes(search);

    const matchesDepartment =
      department === 'all' || 
      officer.departmentName === department;

    const matchesStatus =
      status === 'all' ||
      String(officer.isAvailable) === status;

    return matchesSearch &&
           matchesDepartment &&
           matchesStatus;
  });

  renderOfficerTable(filtered);
}

/* ============================================================
   INIT
   ============================================================ */

window.addEventListener('load', () => {
  loadDepartments();
  loadOfficers();
});

document.addEventListener('change', function (e) {

  if (e.target.id === 'officerDepartment') {

    const departmentId = e.target.value;

    loadCategoriesByDepartment(departmentId);
  }

});

async function loadCategoriesByDepartment(departmentId) {
    try {
        console.log("STEP 1 - Department selected:", departmentId);

        const url = `${COMPLAINT_API_BASE}/categories/by-department/${departmentId}`;
        console.log("Calling API:", url);

        const response = await fetch(url);

        if (!response.ok) {
            console.error("API failed with status:", response.status);
            return;
        }

        const result = await response.json();

        console.log("STEP 1 - FILTERED CATEGORIES:", result);

        const dropdown = document.getElementById("officerCategory");
        dropdown.innerHTML = `<option value="">Select Category</option>`;

        result.data.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.complaintCategoryId;
            opt.textContent = c.categoryName;
            dropdown.appendChild(opt);
        });

    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

async function updateSuggestionStatus() {

    const request = {
        suggestionId: selectedSuggestionId,
        suggestionStatusMasterId:
            parseInt(
                document.getElementById("status").value
            ),
        remarks:
            document.getElementById("remarks").value
    };

    const response = await fetch(
        "http://localhost:5079/api/suggestions/status",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    );

    const result = await response.json();

    alert(result.message);
}


/* ============================================================
   WARD / VILLAGE MANAGEMENT
   Mirrors Area Overview Setup architecture exactly.
   Separate localStorage key, separate section metadata,
   separate form configs, separate panel + detail panel.
   ============================================================ */

var WS_KEY = 'adminWardSectionData';  // localStorage key

/* ---- WARD STATE ---- */
var currentWardSectionId = null;      // which ward section detail is open
var currentEditingEntryId = null;     // null = adding new entry, string = editing existing

/* ============================================================
   WARD SECTIONS METADATA
   ============================================================ */
var WARD_SECTIONS = [
  { id:'w-basic',        name:'Basic Ward Information',      icon:'&#x1F3D8;&#xFE0F;', desc:'Ward name, number, type, district, PIN code and boundary details.',      status:'empty', filled:0, total:10, lastUpdated:'—', lastSaved:'—' },
  { id:'w-contacts',     name:'Ward Administrative Contacts',icon:'&#x1F4DE;',          desc:'Ward officer, gram sevak, sarpanch and office contact details.',          status:'empty', filled:0, total:7,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-population',   name:'Population & Demographics',   icon:'&#x1F465;',          desc:'Total population, gender ratio, voter count and literacy rates.',         status:'empty', filled:0, total:9,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-elected',      name:'Elected Representatives',     icon:'&#x1F3DB;&#xFE0F;', desc:'Ward members, sarpanch, panch members and their contact details.',        status:'empty', filled:0, total:1,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-infrastructure',name:'Infrastructure Overview',    icon:'&#x1F3D7;&#xFE0F;', desc:'Roads, street lights, drainage and general civic infrastructure.',        status:'empty', filled:0, total:7,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-water',        name:'Water Supply',                icon:'&#x1F4A7;',          desc:'Water sources, tap connections, borewells and drinking water quality.',   status:'empty', filled:0, total:6,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-sanitation',   name:'Sanitation & Cleanliness',    icon:'&#x1F9F9;',          desc:'Toilets, garbage collection, drainage and waste management.',            status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-health',       name:'Health Facilities',           icon:'&#x1F3E5;',          desc:'Sub-centres, ASHA workers, PHC availability and emergency services.',     status:'empty', filled:0, total:6,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-education',    name:'Education Facilities',        icon:'&#x1F393;',          desc:'Schools, anganwadis, enrollment count and literacy support programs.',    status:'empty', filled:0, total:6,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-economy',      name:'Economy & Livelihoods',       icon:'&#x1F33E;',          desc:'Farmers, artisans, SHGs, primary occupations and income levels.',        status:'empty', filled:0, total:5,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-safety',       name:'Safety & Emergency',          icon:'&#x1F6A8;',          desc:'Police outpost, fire service availability and CCTV coverage.',           status:'empty', filled:0, total:4,  lastUpdated:'—', lastSaved:'—' },
  { id:'w-social',       name:'Social & Cultural Information',icon:'&#x1F3AD;',         desc:'Religious places, festivals, cultural halls and community events.',       status:'empty', filled:0, total:4,  lastUpdated:'—', lastSaved:'—' }
];

/* ============================================================
   WARD SECTION FORM CONFIGURATIONS
   ============================================================ */
var WARD_SECTION_FORMS = {
  'w-basic': { icon:'&#x1F3D8;&#xFE0F;', fields:[
    { key:'wardType',        label:'Ward / Village Type',            type:'select',   options:['Municipal Ward','Gram Panchayat','Nagar Panchayat','Village','Town','Revenue Village'] },
    { key:'wardName',        label:'Ward / Village Name',            type:'text',     placeholder:'e.g. Nehru Nagar Ward 7' },
    { key:'wardNumber',      label:'Ward Number',                    type:'text',     placeholder:'e.g. 7 or W-07' },
    { key:'parentAuthority', label:'Parent Authority / Municipality',type:'text',     placeholder:'e.g. Pune Municipal Corporation' },
    { key:'district',        label:'District',                       type:'text',     placeholder:'e.g. Pune' },
    { key:'taluka',          label:'Taluka / Tehsil',                type:'text',     placeholder:'e.g. Haveli' },
    { key:'state',           label:'State',                          type:'text',     placeholder:'e.g. Maharashtra' },
    { key:'pinCode',         label:'PIN Code',                       type:'text',     placeholder:'e.g. 411001' },
    { key:'geoArea',         label:'Geographical Area (sq km)',      type:'text',     placeholder:'e.g. 8.5' },
    { key:'wardDesc',        label:'Ward Description',               type:'textarea', placeholder:'Brief description of this ward or village...' }
  ]},
  'w-contacts': { icon:'&#x1F4DE;', fields:[
    { key:'wardOfficerName', label:'Ward Officer / Sarpanch Name',   type:'text',     placeholder:'e.g. Shri Ramesh Patil' },
    { key:'wardOfficerDesig',label:'Designation',                    type:'text',     placeholder:'e.g. Ward Officer / Sarpanch' },
    { key:'contactNumber',   label:'Contact Number',                 type:'text',     placeholder:'e.g. +91 98765 43210' },
    { key:'emailAddress',    label:'Email Address',                  type:'text',     placeholder:'e.g. wardofficer@gov.in' },
    { key:'gramSevak',       label:'Gram Sevak / Talathi Name',      type:'text',     placeholder:'e.g. Smt. Sunita Desai' },
    { key:'officeContact',   label:'Office Contact Number',          type:'text',     placeholder:'e.g. 020-12345678' },
    { key:'officeAddress',   label:'Office Address',                 type:'textarea', placeholder:'Full ward office address...' }
  ]},
  'w-population': { icon:'&#x1F465;', fields:[
    { key:'totalPop',        label:'Total Population',               type:'number',   placeholder:'e.g. 4500' },
    { key:'malePop',         label:'Male Population',                type:'number',   placeholder:'e.g. 2300' },
    { key:'femalePop',       label:'Female Population',              type:'number',   placeholder:'e.g. 2200' },
    { key:'childrenCount',   label:'Children Count (0–14)',          type:'number',   placeholder:'e.g. 900' },
    { key:'seniorCount',     label:'Senior Citizen Count (60+)',     type:'number',   placeholder:'e.g. 300' },
    { key:'totalVoters',     label:'Total Voters',                   type:'number',   placeholder:'e.g. 3100' },
    { key:'totalHouseholds', label:'Total Households',               type:'number',   placeholder:'e.g. 1100' },
    { key:'maleLiteracy',    label:'Male Literacy Rate (%)',         type:'text',     placeholder:'e.g. 88.5' },
    { key:'femaleLiteracy',  label:'Female Literacy Rate (%)',       type:'text',     placeholder:'e.g. 79.2' }
  ]},
  'w-elected': { icon:'&#x1F3DB;&#xFE0F;', fields:[
    { key:'members',         label:'Elected Representatives & Ward Members', type:'members' }
  ]},
  'w-infrastructure': { icon:'&#x1F3D7;&#xFE0F;', fields:[
    { key:'totalRoads',      label:'Total Roads (km)',               type:'text',     placeholder:'e.g. 12.5' },
    { key:'cementRoads',     label:'Cement / Paved Roads (km)',      type:'text',     placeholder:'e.g. 8' },
    { key:'roadCondition',   label:'Overall Road Condition',         type:'select',   options:['Good','Average','Poor'] },
    { key:'streetLights',    label:'Street Lights Count',            type:'number',   placeholder:'e.g. 120' },
    { key:'drainageSystem',  label:'Drainage System Available',      type:'select',   options:['Yes','No','Partial'] },
    { key:'publicTransport', label:'Public Transport Connectivity',  type:'select',   options:['Bus','Auto / Rickshaw','Both','None'] },
    { key:'infraRemarks',    label:'Infrastructure Remarks',         type:'textarea', placeholder:'Any additional infrastructure notes...' }
  ]},
  'w-water': { icon:'&#x1F4A7;', fields:[
    { key:'waterSource',     label:'Primary Water Source',           type:'select',   options:['Municipal Supply','Borewell','River','Dam / Canal','Mixed'] },
    { key:'tapConnections',  label:'Tap Connections Count',          type:'number',   placeholder:'e.g. 800' },
    { key:'borewells',       label:'Borewells Count',                type:'number',   placeholder:'e.g. 6' },
    { key:'waterTanks',      label:'Water Storage Tanks Count',      type:'number',   placeholder:'e.g. 2' },
    { key:'purifiedWater',   label:'Purified Drinking Water Supply', type:'select',   options:['Yes','No','Partial'] },
    { key:'waterAvailability',label:'Water Availability (hrs/day)',  type:'text',     placeholder:'e.g. 4 hours' }
  ]},
  'w-sanitation': { icon:'&#x1F9F9;', fields:[
    { key:'publicToilets',   label:'Public Toilets Count',           type:'number',   placeholder:'e.g. 8' },
    { key:'householdToilets',label:'Households with Toilet Count',   type:'number',   placeholder:'e.g. 950' },
    { key:'garbageCollection',label:'Garbage Collection Available',  type:'select',   options:['Yes','No','Partial'] },
    { key:'wasteManagement', label:'Waste Management System',        type:'select',   options:['Centralized','Decentralized','None','Under Development'] },
    { key:'openDefecation',  label:'Open Defecation Free (ODF)',     type:'select',   options:['Yes','No','In Progress'] }
  ]},
  'w-health': { icon:'&#x1F3E5;', fields:[
    { key:'subCentreAvail',  label:'Health Sub-Centre Available',    type:'select',   options:['Yes','No'] },
    { key:'phcAvail',        label:'PHC / Primary Health Centre',    type:'select',   options:['Yes','No'] },
    { key:'ashaCount',       label:'ASHA Workers Count',             type:'number',   placeholder:'e.g. 4' },
    { key:'doctorsCount',    label:'Doctors Count (local)',          type:'number',   placeholder:'e.g. 2' },
    { key:'ambulanceAvail',  label:'Ambulance / 108 Service Access', type:'select',   options:['Yes','No'] },
    { key:'healthCamps',     label:'Regular Health Camps Conducted', type:'select',   options:['Yes','No','Occasional'] }
  ]},
  'w-education': { icon:'&#x1F393;', fields:[
    { key:'totalSchools',    label:'Total Schools',                  type:'number',   placeholder:'e.g. 3' },
    { key:'govtSchools',     label:'Government Schools Count',       type:'number',   placeholder:'e.g. 2' },
    { key:'pvtSchools',      label:'Private Schools Count',          type:'number',   placeholder:'e.g. 1' },
    { key:'enrollment',      label:'Total Student Enrollment',       type:'number',   placeholder:'e.g. 620' },
    { key:'anganwadiAvail',  label:'Anganwadi Centre Available',     type:'select',   options:['Yes','No'] },
    { key:'anganwadiCount',  label:'Anganwadi Centres Count',        type:'number',   placeholder:'e.g. 2' }
  ]},
  'w-economy': { icon:'&#x1F33E;', fields:[
    { key:'primaryOccupation',label:'Primary Occupation',            type:'select',   options:['Agriculture','Labour','Trade / Business','Government Service','Mixed'] },
    { key:'totalFarmers',    label:'Farming Households Count',       type:'number',   placeholder:'e.g. 450' },
    { key:'majorCrops',      label:'Major Crops',                    type:'text',     placeholder:'e.g. Wheat, Onion, Sugarcane' },
    { key:'shgCount',        label:'Self-Help Groups (SHG) Count',   type:'number',   placeholder:'e.g. 8' },
    { key:'econRemarks',     label:'Economic Activity Notes',        type:'textarea', placeholder:'Other livelihood activities, industries...' }
  ]},
  'w-safety': { icon:'&#x1F6A8;', fields:[
    { key:'policeOutpost',   label:'Police Outpost / Station Nearby',type:'select',   options:['Yes','No'] },
    { key:'fireService',     label:'Fire Emergency Service Access',  type:'select',   options:['Yes','No'] },
    { key:'cctvSurveillance',label:'CCTV Surveillance Available',    type:'select',   options:['Yes','No','Partial'] },
    { key:'emergencyResponse',label:'Emergency Response Facility',   type:'select',   options:['Yes','No'] }
  ]},
  'w-social': { icon:'&#x1F3AD;', fields:[
    { key:'religiousPlaces', label:'Religious Places Count',         type:'number',   placeholder:'e.g. 5' },
    { key:'festivalsYearly', label:'Festivals Celebrated Yearly',    type:'number',   placeholder:'e.g. 4' },
    { key:'communityHall',   label:'Community / Gram Sabha Hall',    type:'select',   options:['Yes','No'] },
    { key:'socialRemarks',   label:'Cultural / Heritage Notes',      type:'textarea', placeholder:'Notable cultural sites, traditions...' }
  ]}
};

/* ============================================================
   WARD LOCALSTORAGE HELPERS
   ============================================================ */
function wsLoad() {
  try { var raw = localStorage.getItem(WS_KEY); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
}
function wsSave(store) {
  try { localStorage.setItem(WS_KEY, JSON.stringify(store)); } catch(e) {}
}
function wsGet(sectionId) { return wsLoad()[sectionId] || {}; }
function wsSet(sectionId, data) { var store = wsLoad(); store[sectionId] = data; wsSave(store); }
function wsDelete(sectionId) { var store = wsLoad(); delete store[sectionId]; wsSave(store); }
function wsClear() { try { localStorage.removeItem(WS_KEY); } catch(e) {} }

/* ============================================================
   RECOMPUTE ALL WARD SECTIONS FROM LOCALSTORAGE
   All sections now use entries[] — count entries for both custom
   and built-in sections.
   ============================================================ */
function recomputeAllWardSections() {
  WARD_SECTIONS.forEach(function(section) {
    recomputeSingleWardSection(section);
  });
}

/* ============================================================
   RECOMPUTE A SINGLE WARD SECTION from localStorage
   ============================================================ */
function recomputeSingleWardSection(section) {
  var data = wsGet(section.id);
  /* Migrate legacy flat-field data to entries[] on first recompute */
  data = migrateLegacyData(section.id, data);
  var entryCount = (data.entries || []).length;
  section.filled      = entryCount;
  section.total       = Math.max(entryCount, 1);
  section.lastUpdated = data._lastUpdated || '—';
  section.lastSaved   = data._lastSaved   || '—';
  if      (data._submitted)      section.status = 'completed';
  else if (entryCount === 0)     section.status = 'empty';
  else                           section.status = 'partial';
}

/* ============================================================
   MIGRATE LEGACY FLAT-FIELD DATA → entries[]
   Safe to call multiple times (idempotent — checks for entries key).
   ============================================================ */
function migrateLegacyData(sectionId, data) {
  if (!data || data.entries) return data; /* already migrated or empty */
  var formConfig = WARD_SECTION_FORMS[sectionId];
  if (!formConfig) return data;

  /* Collect any non-empty flat fields or members */
  var hasLegacyData = false;
  var entry = { _id: genEntryId(), _createdAt: (data._lastUpdated || '') };

  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      if (data.members && data.members.length > 0) {
        entry.members  = data.members;
        hasLegacyData  = true;
      }
    } else {
      if (data[field.key] && String(data[field.key]).trim()) {
        entry[field.key] = data[field.key];
        hasLegacyData    = true;
      }
    }
  });

  if (hasLegacyData) {
    /* Promote the legacy data to a single entry */
    data.entries = [entry];
    wsSet(sectionId, data);
  } else {
    /* No legacy data — initialise with empty entries array */
    data.entries = [];
  }
  return data;
}

/* ============================================================
   RENDER WARD SECTION CARDS  (identical to renderSectionCards)
   Always appends the "Add New Facility" card last.
   ============================================================ */
function renderWardSectionCards() {
  var grid = document.getElementById('wardSectionCardsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  /* --- built-in sections (from WARD_SECTIONS, no _custom flag) --- */
  WARD_SECTIONS.forEach(function(section) {
    if (!section._custom) {
      grid.appendChild(buildWardSectionCard(section, false));
    }
  });

  /* --- custom / user-created facilities (source of truth = localStorage) --- */
  loadWardFacilities().forEach(function(fac) {
    grid.appendChild(buildWardFacilityCard(fac));
  });

  /* --- always-last "Add New Facility" card --- */
  grid.appendChild(buildAddFacilityCard());
}

/* ============================================================
   WARD PROGRESS & SUMMARY SYNC
   ============================================================ */
function computeWardProgress() {
  var completed = 0, partial = 0, empty = 0;
  WARD_SECTIONS.forEach(function(s) {
    if (s.status === 'completed')  completed++;
    else if (s.status === 'partial') partial++;
    else empty++;
  });
  var set = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
  set('wardCompletedCount', completed);
  set('wardPartialCount',   partial);
  set('wardEmptyCount',     empty);
  syncWardSummary();
}

function syncWardSummary() {
  var data = wsGet('w-basic');
  var setText = function(id, val, fallback) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = (val && String(val).trim()) ? String(val).trim() : (fallback || 'Not Added');
  };
  setText('wardSummaryName',      data.wardName,        'Not Added');
  setText('wardSummaryType',      data.wardType,        'Not Added');
  setText('wardSummaryAuthority', data.parentAuthority, 'Not Added');
  var lastUpdated = data._lastUpdated
    ? data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
    : 'Not Updated';
  setText('wardSummaryLastUpdated', lastUpdated, 'Not Updated');

  var totalFields  = WARD_SECTIONS.reduce(function(a,s) { return a + s.total; }, 0);
  var filledFields = WARD_SECTIONS.reduce(function(a,s) { return a + s.filled; }, 0);
  var pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  var compEl = document.getElementById('wardCompletion');
  if (compEl) compEl.textContent = pct + '%';

  var badge = document.getElementById('wardStatusBadge');
  if (badge && badge.className.indexOf('published') === -1) {
    if (pct === 0)       { badge.className = 'area-status-badge draft';        badge.textContent = 'Draft'; }
    else if (pct === 100){ badge.className = 'area-status-badge completed';    badge.textContent = 'Completed'; }
    else                 { badge.className = 'area-status-badge in-progress';  badge.textContent = 'In Progress'; }
  }
}

/* ============================================================
   WARD PANEL — TOP ACTION BUTTONS
   ============================================================ */
function saveWardDraftTop()  { showToast('Ward overview draft saved.', 'success'); }
function updateWardInfo()    { showToast('Ward information updated.', 'success'); }

function publishWard() {
  var filledCount = WARD_SECTIONS.filter(function(s) { return s.status !== 'empty'; }).length;
  var minRequired = Math.ceil(WARD_SECTIONS.length * 0.4);
  if (filledCount < minRequired) {
    showToast('Not enough data to publish. Fill at least ' + minRequired + ' sections first.', 'warning');
    return;
  }
  var badge = document.getElementById('wardStatusBadge');
  if (badge) { badge.className = 'area-status-badge published'; badge.textContent = 'Published'; }
  showToast('Ward information published successfully!', 'success');
}

function resetWardData() {
  showConfirm(
    'Reset All Ward Data',
    'This will permanently clear all saved ward information across all sections. This action cannot be undone.',
    function() {
      wsClear();
      recomputeAllWardSections();
      renderWardSectionCards();
      computeWardProgress();
      syncWardSummary();
      var badge = document.getElementById('wardStatusBadge');
      if (badge) { badge.className = 'area-status-badge draft'; badge.textContent = 'Draft'; }
      showToast('All ward data has been reset.', 'info');
    }
  );
}

/* ============================================================
   WARD QUICK VIEW MODAL
   ============================================================ */
function wardQuickView(sectionId) {
  var section = WARD_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;

  var data       = wsGet(sectionId);
  data           = migrateLegacyData(sectionId, data);
  var entries    = data.entries || [];
  var entryCount = entries.length;
  var pct        = entryCount > 0 ? 100 : 0;
  if (section.status === 'completed') pct = 100;
  else if (section.status === 'partial') pct = Math.min(99, entryCount * 20);

  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'In Progress' : 'Not Started';

  /* Build a summary of what's in the entries */
  var entrySummaryHtml = '';
  if (entryCount === 0) {
    entrySummaryHtml = '<span class="qv-empty-tag">No entries yet — open the section to add data.</span>';
  } else {
    var formConfig = WARD_SECTION_FORMS[sectionId];
    entries.forEach(function(entry, idx) {
      var nonEmptyFields = [];
      if (formConfig) {
        formConfig.fields.forEach(function(f) {
          if (f.type === 'members') {
            if (entry.members && entry.members.length) {
              nonEmptyFields.push('Members (' + entry.members.length + ')');
            }
          } else if (entry[f.key] && String(entry[f.key]).trim()) {
            nonEmptyFields.push(f.label + ': ' + String(entry[f.key]).trim());
          }
        });
      }
      entrySummaryHtml +=
        '<div style="margin-bottom:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);">' +
          '<div style="font-size:0.76rem;font-weight:700;color:var(--text-muted);margin-bottom:5px;">Entry ' + (idx + 1) +
            (entry._updatedAt ? ' · Updated ' + escHtml(entry._updatedAt) : entry._createdAt ? ' · Added ' + escHtml(entry._createdAt) : '') +
          '</div>' +
          (nonEmptyFields.length
            ? nonEmptyFields.slice(0, 3).map(function(t) {
                return '<div style="font-size:0.78rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + escHtml(t) + '</div>';
              }).join('') + (nonEmptyFields.length > 3 ? '<div style="font-size:0.72rem;color:var(--text-muted);">+' + (nonEmptyFields.length - 3) + ' more fields…</div>' : '')
            : '<div style="font-size:0.76rem;color:var(--text-muted);font-style:italic;">Empty entry</div>') +
        '</div>';
    });
  }

  var bodyHtml =
    '<div class="modal-section-label">Status</div>' +
    '<div class="modal-value"><span class="section-card-status ' + section.status + '">' + statusLabel + '</span></div>' +
    '<div class="modal-section-label">Entries</div>' +
    '<div class="modal-value" style="font-size:1rem;font-weight:700;color:var(--red);">' + entryCount + ' ' + (entryCount === 1 ? 'entry' : 'entries') + ' saved</div>' +
    '<div class="modal-section-label">Last Updated</div>' +
    '<div class="modal-value">' + escHtml(section.lastUpdated) + (section.lastSaved && section.lastSaved !== '—' ? ' &middot; ' + escHtml(section.lastSaved) : '') + '</div>' +
    '<div class="modal-section-label">Saved Data</div>' +
    entrySummaryHtml;

  document.getElementById('wardModalTitle').textContent = section.name;
  document.getElementById('wardModalBody').innerHTML    = bodyHtml;
  document.getElementById('wardModalOverlay').classList.remove('hidden');
}

function closeWardModal() {
  document.getElementById('wardModalOverlay').classList.add('hidden');
}

/* ============================================================
   WARD SECTION DETAIL — OPEN
   ============================================================ */
async function openWardSection(sectionId) {
  var section = WARD_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;
  var formConfig = WARD_SECTION_FORMS[sectionId];
  if (!formConfig) { showToast('Form configuration not found.', 'warning'); return; }

  currentWardSectionId  = sectionId;
  currentEditingEntryId = null;         // always start in "add new" mode

  document.getElementById('wsdBreadcrumbName').textContent = section.name;
  document.getElementById('wsdTitle').textContent          = section.name;
  document.getElementById('wsdSubtitle').textContent       = section.desc;
  document.getElementById('wsdFormIcon').innerHTML         = formConfig.icon;

  refreshWsdBadge(section);
  refreshWsdProgress(section);

  var data = wsGet(sectionId);
  var lastSavedEl = document.getElementById('wsdLastSaved');
  if (lastSavedEl) {
    lastSavedEl.textContent = data._lastUpdated
      ? 'Last saved: ' + data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
      : 'Not saved yet';
  }

  renderWardSectionForm(sectionId, formConfig);
  renderWardSectionPreview(sectionId);

  showPanel('ward-section-detail', null);
  window.scrollTo({ top:0, behavior:'smooth' });
}

function closeWardSectionDetail() {
  currentWardSectionId = null;
  var navEl = document.querySelector('.nav-item[onclick*="ward-management"]');
  showPanel('ward-management', navEl);
  window.scrollTo({ top:0, behavior:'smooth' });
}

function refreshWsdBadge(section) {
  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'Partially Filled' : 'Empty';
  var badge = document.getElementById('wsdStatusBadge');
  if (badge) { badge.className = 'section-card-status ' + section.status; badge.textContent = statusLabel; }
}

function refreshWsdProgress(section) {
  var pct = section.total > 0 ? Math.round((section.filled / section.total) * 100) : 0;
  var fillEl = document.getElementById('wsdProgressFill');
  var pctEl  = document.getElementById('wsdProgressPct');
  if (fillEl) fillEl.style.width   = pct + '%';
  if (pctEl)  pctEl.textContent    = pct + '%';
}

/* ============================================================
   HELPERS
   ============================================================ */

/** Returns true when the current section is a custom facility. */
function isCustomFacilitySection(sectionId) {
  var s = WARD_SECTIONS.find(function(x) { return x.id === sectionId; });
  return !!(s && s._custom);
}

/** Generate a simple unique ID for entries. */
function genEntryId() {
  return 'e-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000);
}

/* ============================================================
   WARD SECTION — RENDER FORM
   Branches on _custom flag:
     custom  → multi-entry "Add / Edit Entry" form
     built-in → single-record form (unchanged behaviour)
   ============================================================ */
function renderWardSectionForm(sectionId, formConfig) {
  var formBody = document.getElementById('wsdFormBody');
  formBody.innerHTML = '';

  if (isCustomFacilitySection(sectionId)) {
    renderFacilityEntryForm(sectionId, formConfig, formBody);
  } else {
    renderBuiltInSectionForm(sectionId, formConfig, formBody);
  }
}

/* ---------- Built-in section form (unchanged single-record) ---------- */
function renderBuiltInSectionForm(sectionId, formConfig, formBody) {
  var data = wsGet(sectionId);

  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') {
      renderWardMembersSection(formBody, data.members || []);
      return;
    }
    var group = document.createElement('div');
    group.className = 'sd-field-group';
    var lbl = document.createElement('label');
    lbl.className   = 'sd-field-label';
    lbl.htmlFor     = 'wfield-' + field.key;
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
    input.id    = 'wfield-' + field.key;
    input.value = data[field.key] || '';
    group.appendChild(input);
    formBody.appendChild(group);
  });

  /* Inline action row */
  var actionRow = document.createElement('div');
  actionRow.className = 'wsd-form-action-row';

  var updateBtn = document.createElement('button');
  updateBtn.type      = 'button';
  updateBtn.className = 'btn-action btn-outline-red wsd-form-action-btn';
  updateBtn.innerHTML = '&#x270F;&#xFE0F; Update Information';
  updateBtn.onclick   = updateWardSectionData;

  var submitBtn = document.createElement('button');
  submitBtn.type      = 'button';
  submitBtn.className = 'btn-action btn-primary wsd-form-action-btn';
  submitBtn.innerHTML = '&#x2713; Submit';
  submitBtn.onclick   = submitWardSectionData;

  actionRow.appendChild(updateBtn);
  actionRow.appendChild(submitBtn);
  formBody.appendChild(actionRow);
}

/* ---------- Custom facility: multi-entry "Add / Edit Entry" form ---------- */
function renderFacilityEntryForm(sectionId, formConfig, formBody) {
  var data    = wsGet(sectionId);
  var entries = data.entries || [];

  /* --- Form card header --- */
  var formHeaderDiv = document.createElement('div');
  formHeaderDiv.className = 'fef-form-header';

  var isEditing = !!currentEditingEntryId;
  var editEntry = isEditing
    ? entries.find(function(e) { return e._id === currentEditingEntryId; })
    : null;

  var titleEl = document.createElement('div');
  titleEl.className = 'fef-form-title';
  titleEl.textContent = isEditing ? 'Edit Entry' : 'Add New Entry';
  formHeaderDiv.appendChild(titleEl);

  var countBadge = document.createElement('span');
  countBadge.className = 'fef-entry-count';
  countBadge.textContent = entries.length + (entries.length === 1 ? ' entry' : ' entries') + ' saved';
  formHeaderDiv.appendChild(countBadge);
  formBody.appendChild(formHeaderDiv);

  /* --- Fields --- */
  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') return; /* members not applicable to facilities */
    var group = document.createElement('div');
    group.className = 'sd-field-group';
    var lbl = document.createElement('label');
    lbl.className   = 'sd-field-label';
    lbl.htmlFor     = 'wfield-' + field.key;
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
    input.id    = 'wfield-' + field.key;
    /* Populate with editing entry values, or empty for new */
    input.value = (editEntry && editEntry[field.key] != null) ? editEntry[field.key] : '';
    group.appendChild(input);
    formBody.appendChild(group);
  });

  /* --- Action row --- */
  var actionRow = document.createElement('div');
  actionRow.className = 'wsd-form-action-row';

  if (isEditing) {
    var cancelBtn = document.createElement('button');
    cancelBtn.type      = 'button';
    cancelBtn.className = 'btn-action btn-ghost wsd-form-action-btn';
    cancelBtn.innerHTML = '&#x2715; Cancel Edit';
    cancelBtn.onclick   = function() {
      currentEditingEntryId = null;
      renderWardSectionForm(sectionId, WARD_SECTION_FORMS[sectionId]);
    };

    var saveEditBtn = document.createElement('button');
    saveEditBtn.type      = 'button';
    saveEditBtn.className = 'btn-action btn-primary wsd-form-action-btn';
    saveEditBtn.innerHTML = '&#x2713; Save Changes';
    saveEditBtn.onclick   = saveFacilityEntry;

    actionRow.appendChild(cancelBtn);
    actionRow.appendChild(saveEditBtn);
  } else {
    var draftBtn = document.createElement('button');
    draftBtn.type      = 'button';
    draftBtn.className = 'btn-action btn-ghost wsd-form-action-btn';
    draftBtn.innerHTML = '&#x1F4BE; Save Draft';
    draftBtn.onclick   = saveWardSectionDraft;

    var addBtn = document.createElement('button');
    addBtn.type      = 'button';
    addBtn.className = 'btn-action btn-primary wsd-form-action-btn';
    addBtn.innerHTML = '&#x2B; Add Entry';
    addBtn.onclick   = saveFacilityEntry;

    actionRow.appendChild(draftBtn);
    actionRow.appendChild(addBtn);
  }

  formBody.appendChild(actionRow);
}

/* ============================================================
   WARD MEMBERS (same dynamic-row pattern as area sections)
   ============================================================ */
function renderWardMembersSection(container, members) {
  var wrap = document.createElement('div');
  wrap.className = 'sd-members-section';
  var hdr = document.createElement('div');
  hdr.className = 'sd-members-header';
  var title = document.createElement('div');
  title.className   = 'sd-members-title';
  title.textContent = 'Ward Members & Representatives';
  hdr.appendChild(title);
  var addBtn = document.createElement('button');
  addBtn.className   = 'sd-btn-add-member';
  addBtn.textContent = '+ Add Member';
  addBtn.type        = 'button';
  addBtn.onclick     = addWardMember;
  hdr.appendChild(addBtn);
  wrap.appendChild(hdr);
  var list = document.createElement('div');
  list.className = 'sd-members-list';
  list.id        = 'wardMembersList';
  if (!members || members.length === 0) { list.appendChild(buildWardMembersEmpty()); }
  else { members.forEach(function(m, i) { list.appendChild(createWardMemberItem(m, i)); }); }
  wrap.appendChild(list);
  container.appendChild(wrap);
}

function buildWardMembersEmpty() {
  var el = document.createElement('div');
  el.className = 'sd-members-empty';
  el.innerHTML = '<div style="font-size:1.8rem;margin-bottom:8px;">&#x1F3DB;&#xFE0F;</div>No members added yet.<br><span style="font-size:0.78rem;">Click "+ Add Member" to start.</span>';
  return el;
}

function createWardMemberItem(member, idx) {
  var item = document.createElement('div');
  item.className     = 'sd-member-item';
  item.dataset.index = idx;
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
  delBtn.onclick   = (function(i) { return function() { deleteWardMember(i); }; })(idx);
  acts.appendChild(delBtn);
  hdr.appendChild(acts);
  item.appendChild(hdr);

  var fields = document.createElement('div');
  fields.className = 'sd-member-fields';
  var defs = [
    { key:'name',    label:'Member Name',        placeholder:'Full name' },
    { key:'role',    label:'Role / Designation', placeholder:'e.g. Ward Councillor / Panch' },
    { key:'mobile',  label:'Mobile Number',      placeholder:'e.g. +91 98765 43210' },
    { key:'email',   label:'Email Address',      placeholder:'e.g. member@gov.in' },
    { key:'address', label:'Address',            placeholder:'Residential address' }
  ];
  defs.forEach(function(fd) {
    var fw = document.createElement('div');
    fw.className = 'sd-member-field';
    var lbl = document.createElement('div');
    lbl.className   = 'sd-member-field-label';
    lbl.textContent = fd.label;
    fw.appendChild(lbl);
    var inp = document.createElement('input');
    inp.className   = 'sd-member-field-input';
    inp.type        = 'text';
    inp.placeholder = fd.placeholder;
    inp.value       = member[fd.key] || '';
    inp.oninput = (function(i, k) { return function() { updateWardMemberField(i, k, this.value); }; })(idx, fd.key);
    fw.appendChild(inp);
    fields.appendChild(fw);
  });
  item.appendChild(fields);
  return item;
}

function addWardMember() {
  if (!currentWardSectionId) return;
  var data = wsGet(currentWardSectionId);
  if (!data.members) data.members = [];
  data.members.push({ name:'', role:'', mobile:'', email:'', address:'' });
  wsSet(currentWardSectionId, data);
  refreshWardMembersList(data.members);
  showToast('Member row added.', 'info');
}

function deleteWardMember(idx) {
  if (!currentWardSectionId) return;
  showConfirm('Delete Member', 'Remove this member from the list?', function() {
    var data = wsGet(currentWardSectionId);
    if (!data.members) return;
    data.members.splice(idx, 1);
    wsSet(currentWardSectionId, data);
    refreshWardMembersList(data.members);
    renderWardSectionPreview(currentWardSectionId);
    syncWardSectionMeta(currentWardSectionId);
    showToast('Member deleted.', 'info');
  });
}

function updateWardMemberField(idx, key, value) {
  if (!currentWardSectionId) return;
  var data = wsGet(currentWardSectionId);
  if (!data.members || !data.members[idx]) return;
  data.members[idx][key] = value;
  var items = document.querySelectorAll('#wardMembersList .sd-member-item');
  if (items[idx] && key === 'name') {
    var titleEl = items[idx].querySelector('.sd-member-item-title');
    if (titleEl) titleEl.textContent = value.trim() || 'Member ' + (idx + 1);
  }
  wsSet(currentWardSectionId, data);
  renderWardSectionPreview(currentWardSectionId);
}

function refreshWardMembersList(members) {
  var list = document.getElementById('wardMembersList');
  if (!list) return;
  list.innerHTML = '';
  if (!members || members.length === 0) { list.appendChild(buildWardMembersEmpty()); }
  else { members.forEach(function(m, i) { list.appendChild(createWardMemberItem(m, i)); }); }
}

/* ============================================================
   WARD SECTION — COLLECT FORM DATA
   ============================================================ */
function collectWardFormData() {
  if (!currentWardSectionId) return null;
  var formConfig = WARD_SECTION_FORMS[currentWardSectionId];
  if (!formConfig) return null;
  var existing = wsGet(currentWardSectionId);
  var data = Object.assign({}, existing);
  formConfig.fields.forEach(function(field) {
    if (field.type !== 'members') {
      var input = document.getElementById('wfield-' + field.key);
      if (input) data[field.key] = input.value;
    }
  });
  return data;
}

/* Collect only the entry fields (no meta keys) */
function collectEntryFields() {
  var formConfig = WARD_SECTION_FORMS[currentWardSectionId];
  if (!formConfig) return {};
  var entry = {};
  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') return;
    var input = document.getElementById('wfield-' + field.key);
    if (input) entry[field.key] = input.value;
  });
  return entry;
}

/* ============================================================
   SAVE / UPDATE FACILITY ENTRY  (custom sections only)
   Handles both Add new entry and Edit existing entry.
   ============================================================ */
function saveFacilityEntry() {
  if (!currentWardSectionId) return;
  var fields  = collectEntryFields();
  var data    = wsGet(currentWardSectionId);
  var entries = data.entries ? data.entries.slice() : [];
  var ts      = nowTimestamp();

  if (currentEditingEntryId) {
    /* Update existing entry — find by _id and patch in-place */
    var idx = -1;
    for (var i = 0; i < entries.length; i++) {
      if (entries[i]._id === currentEditingEntryId) { idx = i; break; }
    }
    if (idx !== -1) {
      entries[idx] = Object.assign({}, entries[idx], fields, { _updatedAt: ts.full });
    }
    currentEditingEntryId = null;
    showToast('Entry updated successfully.', 'success');
  } else {
    /* Add new entry */
    fields._id        = genEntryId();
    fields._createdAt = ts.full;
    entries.push(fields);
    showToast('Entry added successfully.', 'success');
  }

  data.entries      = entries;
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  wsSet(currentWardSectionId, data);
  syncWardSectionMeta(currentWardSectionId);
  renderWardSectionPreview(currentWardSectionId);
  syncWardSummary();
  /* Re-render form in "add new" mode (cleared) */
  renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
}

/* ============================================================
   WARD SECTION — RENDER PREVIEW (right panel)
   Branches on _custom flag.
   ============================================================ */
function renderWardSectionPreview(sectionId) {
  var previewBody = document.getElementById('wsdPreviewBody');
  if (!previewBody) return;

  if (isCustomFacilitySection(sectionId)) {
    renderFacilityEntriesPreview(sectionId, previewBody);
  } else {
    renderBuiltInSectionPreview(sectionId, previewBody);
  }
}

/* ---------- Custom facility: list of entries ---------- */
function renderFacilityEntriesPreview(sectionId, previewBody) {
  var data    = wsGet(sectionId);
  var entries = data.entries || [];
  var config  = WARD_SECTION_FORMS[sectionId];

  if (!entries.length) {
    previewBody.innerHTML =
      '<div class="sd-preview-empty">' +
        '<div class="sd-preview-empty-icon">&#x1F4C4;</div>' +
        '<div style="font-weight:700;margin-bottom:6px;">No entries yet</div>' +
        '<div style="font-size:0.78rem;">Fill the form and click Add Entry to save your first record.</div>' +
      '</div>';
    return;
  }

  var html = '';
  if (data._lastUpdated) {
    html += '<div class="sd-preview-timestamp">&#x1F4C5; Last saved: ' +
      escHtml(data._lastUpdated) + (data._lastSaved ? ' at ' + escHtml(data._lastSaved) : '') + '</div>';
  }

  html += '<div class="fef-entries-list">';
  entries.forEach(function(entry, idx) {
    html += '<div class="fef-entry-card" data-entry-id="' + escHtml(entry._id) + '">';

    /* Entry header */
    html += '<div class="fef-entry-header">';
    html += '<span class="fef-entry-num">Entry ' + (idx + 1) + '</span>';
    if (entry._updatedAt) {
      html += '<span class="fef-entry-ts">Updated: ' + escHtml(entry._updatedAt) + '</span>';
    } else if (entry._createdAt) {
      html += '<span class="fef-entry-ts">Added: ' + escHtml(entry._createdAt) + '</span>';
    }
    html += '<div class="fef-entry-actions">';
    html += '<button class="fef-btn fef-btn-edit" onclick="editFacilityEntry(\'' + escHtml(entry._id) + '\')" title="Edit this entry">&#x270F;&#xFE0F; Edit</button>';
    html += '<button class="fef-btn fef-btn-delete" onclick="deleteFacilityEntry(\'' + escHtml(entry._id) + '\')" title="Delete this entry">&#x1F5D1;</button>';
    html += '</div>';
    html += '</div>';

    /* Entry fields */
    html += '<div class="fef-entry-fields">';
    if (config) {
      config.fields.forEach(function(field) {
        if (field.type === 'members') return;
        var val = entry[field.key];
        if (val && String(val).trim()) {
          html += '<div class="fef-entry-field">';
          html += '<span class="fef-field-label">' + escHtml(field.label) + '</span>';
          html += '<span class="fef-field-value">' + escHtml(val) + '</span>';
          html += '</div>';
        }
      });
    }
    html += '</div>';
    html += '</div>'; /* .fef-entry-card */
  });
  html += '</div>'; /* .fef-entries-list */

  previewBody.innerHTML = html;
}

/* ---------- Built-in section preview (unchanged) ---------- */
function renderBuiltInSectionPreview(sectionId, previewBody) {
  var data = wsGet(sectionId);
  var formConfig = WARD_SECTION_FORMS[sectionId];
  if (!formConfig) {
    previewBody.innerHTML = '<div class="sd-preview-empty"><div class="sd-preview-empty-icon">&#x1F4C4;</div>No configuration found.</div>';
    return;
  }
  var hasData = false;
  var html    = '';
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
        html += '<div class="sd-preview-label">Ward Members (' + members.length + ')</div>';
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
        html += '<div class="sd-preview-item">' +
          '<div class="sd-preview-label">'  + escHtml(field.label) + '</div>' +
          '<div class="sd-preview-value">'  + escHtml(val)         + '</div>' +
          '</div>';
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
   EDIT / DELETE individual facility entry
   ============================================================ */
function editFacilityEntry(entryId) {
  currentEditingEntryId = entryId;
  renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
  /* Scroll form into view */
  var formCard = document.querySelector('.sd-form-card');
  if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteFacilityEntry(entryId) {
  showConfirm('Delete Entry', 'Remove this entry? This cannot be undone.', function() {
    var data    = wsGet(currentWardSectionId);
    data.entries = (data.entries || []).filter(function(e) { return e._id !== entryId; });
    var ts = nowTimestamp();
    data._lastUpdated = ts.date;
    data._lastSaved   = ts.time;
    wsSet(currentWardSectionId, data);
    /* If we were editing the deleted entry, cancel edit mode */
    if (currentEditingEntryId === entryId) {
      currentEditingEntryId = null;
      renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
    }
    syncWardSectionMeta(currentWardSectionId);
    renderWardSectionPreview(currentWardSectionId);
    syncWardSummary();
    showToast('Entry deleted.', 'info');
  });
}

/* ============================================================
   WARD SECTION — SYNC META
   ============================================================ */
function syncWardSectionMeta(sectionId) {
  var section = WARD_SECTIONS.find(function(s) { return s.id === sectionId; });
  if (!section) return;
  var data = wsGet(sectionId);
  var formConfig = WARD_SECTION_FORMS[sectionId];
  if (!formConfig) return;

  var filled = 0, total = 0;

  if (isCustomFacilitySection(sectionId)) {
    /* For custom facilities: filled = number of entries, total = entries (no fixed total) */
    var entryCount = (data.entries || []).length;
    filled = entryCount;
    total  = Math.max(entryCount, 1); /* avoid 0/0 */
  } else {
    formConfig.fields.forEach(function(field) {
      if (field.type === 'members') {
        total++;
        if (data.members && data.members.length > 0) filled++;
      } else {
        total++;
        if (data[field.key] && String(data[field.key]).trim()) filled++;
      }
    });
  }

  section.filled      = filled;
  section.total       = total;
  section.lastUpdated = data._lastUpdated || '—';
  section.lastSaved   = data._lastSaved   || '—';
  if (data._submitted)     section.status = 'completed';
  else if (filled === 0)   section.status = 'empty';
  else                     section.status = 'partial';

  refreshWsdBadge(section);
  refreshWsdProgress(section);
  var lastSavedEl = document.getElementById('wsdLastSaved');
  if (lastSavedEl) {
    lastSavedEl.textContent = data._lastUpdated
      ? 'Last saved: ' + data._lastUpdated + (data._lastSaved ? ' at ' + data._lastSaved : '')
      : 'Not saved yet';
  }
  renderWardSectionCards();
  computeWardProgress();
}

/* ============================================================
   WARD SECTION DETAIL — ACTION BUTTONS
   ============================================================ */
function saveWardSectionDraft() {
  if (!currentWardSectionId) return;
  if (isCustomFacilitySection(currentWardSectionId)) {
    /* For custom: just stamp a timestamp (entries managed separately) */
    var data = wsGet(currentWardSectionId);
    var ts = nowTimestamp();
    data._lastUpdated = ts.date;
    data._lastSaved   = ts.time;
    wsSet(currentWardSectionId, data);
    syncWardSectionMeta(currentWardSectionId);
    renderWardSectionPreview(currentWardSectionId);
    syncWardSummary();
    showToast('Draft saved.', 'success');
    return;
  }
  /* Built-in: single-record save */
  var data = collectWardFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  wsSet(currentWardSectionId, data);
  syncWardSectionMeta(currentWardSectionId);
  renderWardSectionPreview(currentWardSectionId);
  syncWardSummary();
  showToast('Draft saved successfully.', 'success');
}

function submitWardSectionData() {
  if (!currentWardSectionId) return;
  if (isCustomFacilitySection(currentWardSectionId)) {
    /* Custom: mark all entries as submitted */
    var data = wsGet(currentWardSectionId);
    if (!(data.entries || []).length) {
      showToast('Add at least one entry before submitting.', 'warning');
      return;
    }
    var ts = nowTimestamp();
    data._lastUpdated = ts.date;
    data._lastSaved   = ts.time;
    data._submitted   = true;
    wsSet(currentWardSectionId, data);
    syncWardSectionMeta(currentWardSectionId);
    renderWardSectionPreview(currentWardSectionId);
    syncWardSummary();
    renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
    showToast('Section submitted and marked as Completed!', 'success');
    return;
  }
  /* Built-in */
  var data = collectWardFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  data._submitted   = true;
  wsSet(currentWardSectionId, data);
  syncWardSectionMeta(currentWardSectionId);
  renderWardSectionPreview(currentWardSectionId);
  syncWardSummary();
  renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
  showToast('Section submitted and marked as Completed!', 'success');
}

function updateWardSectionData() {
  if (!currentWardSectionId) return;
  if (isCustomFacilitySection(currentWardSectionId)) {
    /* Custom: stamp timestamp only (entries managed via saveFacilityEntry) */
    var data = wsGet(currentWardSectionId);
    var ts = nowTimestamp();
    data._lastUpdated = ts.date;
    data._lastSaved   = ts.time;
    wsSet(currentWardSectionId, data);
    syncWardSectionMeta(currentWardSectionId);
    renderWardSectionPreview(currentWardSectionId);
    syncWardSummary();
    showToast('Information updated.', 'success');
    return;
  }
  /* Built-in */
  var data = collectWardFormData();
  if (!data) return;
  var ts = nowTimestamp();
  data._lastUpdated = ts.date;
  data._lastSaved   = ts.time;
  wsSet(currentWardSectionId, data);
  syncWardSectionMeta(currentWardSectionId);
  renderWardSectionPreview(currentWardSectionId);
  syncWardSummary();
  renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
  showToast('Information updated successfully.', 'success');
}

function deleteWardSectionData() {
  if (!currentWardSectionId) return;
  var sectionName = (WARD_SECTIONS.find(function(s) { return s.id === currentWardSectionId; }) || {}).name || 'this section';
  showConfirm(
    'Delete Section Data',
    'Clear all saved data for "' + sectionName + '"? This cannot be undone.',
    function() {
      wsDelete(currentWardSectionId);
      currentEditingEntryId = null;
      syncWardSectionMeta(currentWardSectionId);
      renderWardSectionForm(currentWardSectionId, WARD_SECTION_FORMS[currentWardSectionId]);
      renderWardSectionPreview(currentWardSectionId);
      showToast('Section data deleted.', 'info');
    }
  );
}

function clearWardSectionForm() {
  if (!currentWardSectionId) return;
  if (isCustomFacilitySection(currentWardSectionId)) { return; }
  var formConfig = WARD_SECTION_FORMS[currentWardSectionId];
  if (!formConfig) return;
  formConfig.fields.forEach(function(field) {
    if (field.type === 'members') return;
    var input = document.getElementById('wfield-' + field.key);
    if (input) input.value = '';
  });
}

/* ============================================================
   INIT — hook into showPanel to load ward data on navigate
   ============================================================ */
(function initWardManagement() {
  var _origShowPanel = typeof showPanel === 'function' ? showPanel : null;
  if (!_origShowPanel) return;
  var _wrapped = function(panelId, navEl) {
    var result = _origShowPanel.call(this, panelId, navEl);
    if (panelId === 'ward-management') {
      recomputeAllWardSections();
      renderWardSectionCards();
      computeWardProgress();
    }
    return result;
  };
  /* Only wrap once — guard against double-patching from a previous session */
  if (!showPanel._wardWrapped) {
    _wrapped._wardWrapped = true;
    showPanel = _wrapped;
  }

  /* Escape key closes ward modal */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeWardModal();
  });

  /* On page load, if ward-management is somehow the active panel, initialise */
  document.addEventListener('DOMContentLoaded', function() {
    var activePanel = document.querySelector('.panel.active');
    if (activePanel && activePanel.id === 'panel-ward-management') {
      recomputeAllWardSections();
      renderWardSectionCards();
      computeWardProgress();
    }
  });
})();


/* ============================================================
   WARD SECTION CARD BUILDER  (extracted from renderWardSectionCards)
   ============================================================ */
function buildWardSectionCard(section, animate) {
  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'In Progress' : 'Not Started';
  var updatedText = (section.lastUpdated && section.lastUpdated !== '—')
    ? section.lastUpdated + (section.lastSaved && section.lastSaved !== '—' ? ' &middot; ' + section.lastSaved : '')
    : 'Not updated yet';

  var card = document.createElement('div');
  card.className = 'sc-card sc-card--' + section.status + (animate ? ' sc-card--new-facility' : '');
  card.innerHTML =
    '<div class="sc-card-body">' +
      '<div class="sc-card-top">' +
        '<div class="sc-card-icon-wrap sc-icon--' + section.status + '">' +
          '<span class="sc-card-icon">' + (section.icon || '&#x1F4C4;') + '</span>' +
        '</div>' +
        '<span class="sc-badge sc-badge--' + section.status + '">' + statusLabel + '</span>' +
      '</div>' +
      '<div class="sc-card-name">'    + escHtml(section.name) + '</div>' +
      '<div class="sc-card-desc">'    + escHtml(section.desc) + '</div>' +
      '<div class="sc-card-updated">&#x1F4C5; ' + updatedText + '</div>' +
    '</div>' +
    '<div class="sc-card-footer">' +
      '<button class="sc-btn sc-btn--primary" onclick="openWardSection(\'' + section.id + '\')">' +
        '&#x1F4C2; Open Section' +
      '</button>' +
      '<button class="sc-btn sc-btn--ghost" onclick="wardQuickView(\'' + section.id + '\')">' +
        '&#x1F441;&#xFE0F; Quick View' +
      '</button>' +
    '</div>';
  return card;
}

/* ============================================================
   ADD FACILITY CARD BUILDER
   ============================================================ */
function buildAddFacilityCard() {
  var card = document.createElement('div');
  card.className = 'sc-card sc-card--add';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', 'Add a new facility section');
  card.onclick = openFacilityModal;
  card.onkeydown = function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFacilityModal(); } };
  card.innerHTML =
    '<div class="sc-add-body">' +
      '<div class="sc-add-icon-wrap">&#x2795;</div>' +
      '<div class="sc-add-label">Add New Facility</div>' +
      '<div class="sc-add-hint">Create a custom section to track<br>any ward-specific facility or data</div>' +
    '</div>';
  return card;
}

/* ============================================================
   FACILITY ICON PICKER
   Returns an HTML entity / emoji based on facility name keywords.
   ============================================================ */
function getFacilityIcon(name) {
  if (!name) return '&#x1F3D7;&#xFE0F;';
  var n = name.toLowerCase();
  if (/bus\s*stop|bus\s*stand|bus\s*depot|transport/.test(n))          return '&#x1F68C;';
  if (/hospital|clinic|health\s*cent|dispensary|phc|medical/.test(n))  return '&#x1F3E5;';
  if (/school|college|university|vidyalay|education|anganwadi/.test(n)) return '&#x1F3EB;';
  if (/garden|park|ground|playground|maidan/.test(n))                   return '&#x1F333;';
  if (/water\s*tank|water|water\s*supply|borewell|well|pump/.test(n))         return '&#x1F4A7;';
  if (/road|highway|path|lane|street\s*road/.test(n))                   return '&#x1F6E3;&#xFE0F;';
  if (/street\s*light|lamp|light/.test(n))                              return '&#x1F4A1;';
  if (/community\s*hall|sabha|hall|auditorium|centre|center/.test(n))   return '&#x1F3E2;';
  if (/police|chowki|outpost/.test(n))                                   return '&#x1F46E;';
  if (/fire/.test(n))                                                    return '&#x1F692;';
  if (/market|bazaar|shop/.test(n))                                      return '&#x1F6D2;';
  if (/library|reading/.test(n))                                         return '&#x1F4DA;';
  if (/toilet|sanitation|washroom/.test(n))                              return '&#x1F6BB;';
  if (/drain|sewage|waste/.test(n))                                      return '&#x267B;&#xFE0F;';
  if (/electricity|power|solar|energy/.test(n))                          return '&#x26A1;';
  if (/temple|mosque|church|mandir|masjid|religious/.test(n))            return '&#x26EA;';
  if (/bank|atm|finance/.test(n))                                        return '&#x1F3E6;';
  if (/post\s*office|postal/.test(n))                                    return '&#x1F4EE;';
  if (/cremation|cemetery|burial/.test(n))                               return '&#x26B0;&#xFE0F;';
  if (/stadium|sports|gym/.test(n))                                      return '&#x1F3DF;&#xFE0F;';
  if (/bridge|flyover|overpass/.test(n))                                 return '&#x1F309;';
  return '&#x1F3D7;&#xFE0F;'; /* default: building construction */
}

/* ============================================================
   CUSTOM FACILITY CARD BUILDER  (matches built-in card style)
   NOTE: Does NOT mutate WARD_SECTIONS — that belongs only in
   createFacility() and rehydrateWardFacilities().
   ============================================================ */
function buildWardFacilityCard(fac) {
  /* Look up the runtime section — must already exist (injected by
     createFacility or rehydrateWardFacilities before this is called) */
  var section = WARD_SECTIONS.find(function(s) { return s.id === fac.id; });

  /* Safety fallback: if section somehow not in array yet, create a
     minimal one — but do NOT push it (caller is responsible for that) */
  if (!section) {
    section = {
      id:          fac.id,
      name:        fac.name,
      icon:        fac.icon || getFacilityIcon(fac.name),
      desc:        fac.desc || 'Custom facility section.',
      status:      'empty',
      filled:      0,
      total:       8,
      lastUpdated: '—',
      lastSaved:   '—',
      _custom:     true
    };
  }

  var statusLabel = section.status === 'completed' ? 'Completed'
    : section.status === 'partial' ? 'In Progress' : 'Not Started';
  var updatedText = (section.lastUpdated && section.lastUpdated !== '—')
    ? section.lastUpdated + (section.lastSaved && section.lastSaved !== '—' ? ' &middot; ' + section.lastSaved : '')
    : 'Not updated yet';

  var card = document.createElement('div');
  card.className = 'sc-card sc-card--' + section.status + ' sc-card--custom';
  card.dataset.facilityId = fac.id;

  card.innerHTML =
    '<div class="sc-card-body">' +
      '<div class="sc-card-top">' +
        '<div class="sc-card-icon-wrap sc-icon--' + section.status + '">' +
          '<span class="sc-card-icon">' + section.icon + '</span>' +
        '</div>' +
        '<span class="sc-badge sc-badge--' + section.status + '">' + statusLabel + '</span>' +
      '</div>' +
      '<div class="sc-card-name">'    + escHtml(section.name) + '</div>' +
      '<div class="sc-card-desc">'    + escHtml(section.desc || 'Custom facility section.') + '</div>' +
      '<div class="sc-card-updated">&#x1F4C5; ' + updatedText + '</div>' +
    '</div>' +
    '<div class="sc-card-footer">' +
      '<button class="sc-btn sc-btn--primary" onclick="openWardSection(\'' + section.id + '\')">' +
        '&#x1F4C2; Open Section' +
      '</button>' +
      '<button class="sc-btn sc-btn--ghost" onclick="wardQuickView(\'' + section.id + '\')">' +
        '&#x1F441;&#xFE0F; Quick View' +
      '</button>' +
    '</div>';

  /* Delete icon — top-right corner, built via DOM API (no quote-escaping issues) */
  var delBtn = document.createElement('button');
  delBtn.className = 'sc-card-delete';
  delBtn.setAttribute('aria-label', 'Delete ' + section.name);
  delBtn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<polyline points="3 6 5 6 21 6"/>' +
      '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>' +
      '<path d="M10 11v6"/>' +
      '<path d="M14 11v6"/>' +
      '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
    '</svg>';
  delBtn.addEventListener('click', (function(facId) {
    return function(e) { e.stopPropagation(); deleteFacility(facId); };
  })(fac.id));
  card.appendChild(delBtn);

  return card;
}

/* ============================================================
   FACILITY FORM CONFIG FACTORY  (single source of truth)
   ============================================================ */
function makeFacilityFormConfig(icon) {
  return {
    icon: icon || '&#x1F3D7;&#xFE0F;',
    fields: [
      { key:'facilityDetails',   label:'Facility Details',      type:'textarea', placeholder:'Describe this facility — capacity, current state, key information…' },
      { key:'location',          label:'Location / Address',    type:'text',     placeholder:'e.g. Near main market, Ward 7' },
      { key:'status',            label:'Operational Status',    type:'select',   options:['Operational','Planned','Under Construction','Renovation in Progress','Under Repair','Damaged','Temporarily Closed','Permanently Closed'] },
      { key:'capacity',          label:'Capacity / Coverage',   type:'text',     placeholder:'e.g. 500 persons, 2 acres' },
      { key:'establishmentYear', label:'Establishment Year',    type:'number',   placeholder:'e.g. 2005' },
      { key:'facilityCondition', label:'Facility Condition',    type:'select',   options:['Excellent','Good','Fair','Needs Repair','Critical'] },
      { key:'lastInspection',    label:'Last Inspection Date',  type:'text',     placeholder:'e.g. 12 Jan 2025' },
      { key:'remarks',           label:'Remarks / Notes',       type:'textarea', placeholder:'Any additional notes about this facility…' }
    ]
  };
}

/* ============================================================
   FACILITY LOCALSTORAGE  (list of custom facility metadata)
   ============================================================ */
var FACILITY_LS_KEY = 'adminWardFacilities';

function loadWardFacilities() {
  try {
    var raw = localStorage.getItem(FACILITY_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveWardFacilities(list) {
  try { localStorage.setItem(FACILITY_LS_KEY, JSON.stringify(list)); } catch(e) {}
}

/* ============================================================
   RECOMPUTE A SINGLE WARD SECTION from localStorage
   (used after injecting a custom section into WARD_SECTIONS)
   ============================================================ */
function recomputeSingleWardSection(section) {
  var data = wsGet(section.id);
  var formConfig = WARD_SECTION_FORMS[section.id];
  if (!formConfig) { section.total = 0; section.filled = 0; return; }
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
  if      (data._submitted)  section.status = 'completed';
  else if (filled === 0)     section.status = 'empty';
  else                       section.status = 'partial';
}

/* ============================================================
   RE-INJECT SAVED FACILITIES INTO WARD_SECTIONS on page load.
   Called once on DOMContentLoaded so openWardSection /
   wardQuickView / renderWardSectionCards all find them.
   ============================================================ */
function rehydrateWardFacilities() {
  loadWardFacilities().forEach(function(fac) {
    /* Skip if already in the runtime array (idempotent) */
    var already = WARD_SECTIONS.find(function(s) { return s.id === fac.id; });
    if (already) return;

    /* Resolve icon — upgrade legacy entries that only have the generic icon */
    var icon = (fac.icon && fac.icon !== '&#x1F3D7;&#xFE0F;')
      ? fac.icon
      : getFacilityIcon(fac.name);

    var section = {
      id:          fac.id,
      name:        fac.name,
      icon:        icon,
      desc:        fac.desc || 'Custom facility section.',
      status:      'empty',
      filled:      0,
      total:       8,
      lastUpdated: '—',
      lastSaved:   '—',
      _custom:     true
    };
    WARD_SECTIONS.push(section);
    WARD_SECTION_FORMS[fac.id] = makeFacilityFormConfig(icon);
    recomputeSingleWardSection(section);
  });
}

/* ============================================================
   FACILITY MODAL — OPEN / CLOSE
   ============================================================ */
function openFacilityModal() {
  /* Reset form */
  var nameEl = document.getElementById('facilityNameInput');
  var descEl = document.getElementById('facilityDescInput');
  if (nameEl) { nameEl.value = ''; nameEl.classList.remove('input-error'); }
  if (descEl)   descEl.value = '';

  var errEl = document.getElementById('facilityNameError');
  if (errEl) errEl.classList.add('hidden');

  updateFacilityCharCount('facilityNameInput', 'facilityCharCount',  80);
  updateFacilityCharCount('facilityDescInput', 'facilityDescCount', 200);

  document.getElementById('facilityModalOverlay').classList.remove('hidden');
  /* Auto-focus name field after animation */
  setTimeout(function() { if (nameEl) nameEl.focus(); }, 80);
}

function closeFacilityModal() {
  document.getElementById('facilityModalOverlay').classList.add('hidden');
}

/* ---- Character counter ---- */
function updateFacilityCharCount(inputId, counterId, max) {
  var el  = document.getElementById(inputId);
  var cnt = document.getElementById(counterId);
  if (!el || !cnt) return;
  var len = el.value.length;
  cnt.textContent = len + ' / ' + max;
  cnt.className   = 'facility-char-count' +
    (len >= max ? ' at-limit' : len >= max * 0.85 ? ' near-limit' : '');
}

/* Wire up live char-count updates (once, after DOM ready) */
document.addEventListener('DOMContentLoaded', function() {
  var nameEl = document.getElementById('facilityNameInput');
  var descEl = document.getElementById('facilityDescInput');
  if (nameEl) nameEl.addEventListener('input', function() {
    updateFacilityCharCount('facilityNameInput', 'facilityCharCount', 80);
    /* Clear error on type */
    var errEl = document.getElementById('facilityNameError');
    if (errEl && !errEl.classList.contains('hidden')) {
      errEl.classList.add('hidden');
      nameEl.classList.remove('input-error');
    }
  });
  if (descEl) descEl.addEventListener('input', function() {
    updateFacilityCharCount('facilityDescInput', 'facilityDescCount', 200);
  });
});

/* ============================================================
   CREATE FACILITY
   ============================================================ */
function createFacility() {
  var nameEl = document.getElementById('facilityNameInput');
  var descEl = document.getElementById('facilityDescInput');
  var errEl  = document.getElementById('facilityNameError');

  var name = (nameEl ? nameEl.value.trim() : '');
  var desc = (descEl ? descEl.value.trim() : '');

  /* Validate */
  if (!name) {
    if (nameEl) nameEl.classList.add('input-error');
    if (errEl)  errEl.classList.remove('hidden');
    if (nameEl) nameEl.focus();
    return;
  }

  /* Build unique id */
  var id   = 'wf-' + Date.now();
  var icon = getFacilityIcon(name);

  /* Persist metadata to localStorage FIRST */
  var facilities = loadWardFacilities();
  var newFac = {
    id:        id,
    name:      name,
    desc:      desc,
    icon:      icon,
    createdAt: new Date().toISOString()
  };
  facilities.push(newFac);
  saveWardFacilities(facilities);

  /* Close modal */
  closeFacilityModal();

  /* Inject into live WARD_SECTIONS runtime array (single authoritative push) */
  var section = {
    id:          id,
    name:        name,
    icon:        icon,
    desc:        desc || 'Custom facility section.',
    status:      'empty',
    filled:      0,
    total:       8,
    lastUpdated: '—',
    lastSaved:   '—',
    _custom:     true
  };
  WARD_SECTIONS.push(section);

  /* Inject form config */
  WARD_SECTION_FORMS[id] = makeFacilityFormConfig(icon);

  /* Single render pass — no direct DOM insert to avoid duplicate risk */
  renderWardSectionCards();

  /* Apply slide-in animation to the newly rendered card */
  var grid = document.getElementById('wardSectionCardsGrid');
  if (grid) {
    var newCard = grid.querySelector('[data-facility-id="' + id + '"]');
    if (newCard) newCard.classList.add('sc-card--new-facility');
  }

  showToast('"' + escHtml(name) + '" facility section created!', 'success');
}

/* ============================================================
   DELETE FACILITY
   ============================================================ */
function deleteFacility(id) {
  var section = WARD_SECTIONS.find(function(s) { return s.id === id; });
  var facName = section ? section.name : 'this facility';

  showConfirm(
    'Delete Facility',
    'Are you sure you want to delete "' + facName + '"? This action cannot be undone.',
    function() {
      /* 1. Remove from facilities list in localStorage */
      var facilities = loadWardFacilities().filter(function(f) { return f.id !== id; });
      saveWardFacilities(facilities);

      /* 2. Remove all section detail data from localStorage */
      wsDelete(id);

      /* 3. Remove from runtime WARD_SECTIONS array */
      WARD_SECTIONS = WARD_SECTIONS.filter(function(s) { return s.id !== id; });

      /* 4. Remove from form config map */
      delete WARD_SECTION_FORMS[id];

      /* 5. If user is currently inside this section's detail panel, go back.
            showPanel triggers the wrapper → renderWardSectionCards(),
            which is the correct final grid state. */
      if (currentWardSectionId === id) {
        currentWardSectionId = null;
        var navEl = document.querySelector('.nav-item[onclick*="ward-management"]');
        showPanel('ward-management', navEl);
        /* renderWardSectionCards already called by wrapper above — done */
        showToast('"' + escHtml(facName) + '" facility deleted.', 'info');
        return;
      }

      /* 6. Not in detail panel — animate card out then do a clean re-render */
      var grid = document.getElementById('wardSectionCardsGrid');
      var card = grid ? grid.querySelector('[data-facility-id="' + id + '"]') : null;

      if (card) {
        card.classList.add('sc-card--removing');
        setTimeout(function() {
          /* Full re-render guarantees no stale cards and add-card stays last */
          renderWardSectionCards();
        }, 320);
      } else {
        /* Card not found in DOM (edge case) — re-render immediately */
        renderWardSectionCards();
      }

      showToast('"' + escHtml(facName) + '" facility deleted.', 'info');
    }
  );
}

/* ============================================================
   ESCAPE KEY — also close facility modal
   ============================================================ */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFacilityModal();
});

/* ============================================================
   BOOT — rehydrate on page load so custom facilities survive refresh
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  rehydrateWardFacilities();
});


async function saveWardRepresentatives(data) {

    const payload = {

        wardId: 1,

        representatives: (data.members || []).map(function (m) {

            return {

                representativeName: m.name,

                designation: m.role,

                mobileNumber: m.mobile,

                email: m.email,

                address: m.address
            };

        })
    };

    console.log(payload);

    const response = await fetch(WARD_REPRESENTATIVE_API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
    });

    if (!response.ok) {

        const error = await response.text();

        throw new Error(error);
    }

    return await response.json();
}

async function loadWardRepresentatives() {

    const response = await fetch(
        `${WARD_REPRESENTATIVE_API}/ward/1`
    );

    if (!response.ok)
        return [];

    return await response.json();
}
