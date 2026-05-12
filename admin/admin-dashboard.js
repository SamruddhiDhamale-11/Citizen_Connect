/* ============================================================
   CITIZEN CONNECT — Admin Dashboard Logic
   API Base: http://localhost:5026
   All module functions: Ward, Demographics, Department,
   Area, Officer, Facility, Institution
   ============================================================ */
'use strict';

const API = 'http://localhost:5026/api';
const currentWardId = 1;
let officerDataStore = [];

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) lucide.createIcons();

  const dateEl = document.getElementById('adminDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
});

/* ================================================================
   SIDEBAR TOGGLE
   ================================================================ */
function toggleSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburger');
  const isOpen    = sidebar.classList.contains('open');
  if (isOpen) {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/* ================================================================
   LOGOUT
   ================================================================ */
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
  }
}

/* ================================================================
   ACTIVE NAV
   ================================================================ */
function setActiveNav(name) {
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.classList.remove('active');
  });
  const target = document.getElementById('nav-' + name);
  if (target) target.classList.add('active');
}

/* ================================================================
   LOAD CONTENT — main router
   ================================================================ */
function loadContent(module, navEl) {
  setActiveNav(module);

  // Close mobile sidebar after nav
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) toggleSidebar();

  const content = document.getElementById('content');
  content.style.opacity = '0';
  content.style.transform = 'translateY(8px)';

  setTimeout(function () {
    renderModule(module, content);
    content.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
    if (window.lucide) lucide.createIcons();
  }, 100);
}

/* ================================================================
   MODULE RENDERER
   ================================================================ */
function renderModule(module, content) {
  switch (module) {

    case 'Ward':
      content.innerHTML =
        modHeader('Ward Management', 'Manage ward boundaries and jurisdiction data') +
        modForm('wardForm', [
          modInput('wardNumber',      'text', 'Ward Number',       true),
          modInput('wardName',        'text', 'Ward Name',         true),
          modInput('jurisdictionType','text', 'Jurisdiction Type', true),
        ], 'Save Ward') +
        modMsg('wardMsg') +
        modTable(['Ward No', 'Ward Name', 'Jurisdiction', 'Status', 'Action'], 'wardTable');
      attachWardForm();
      loadWards();
      break;

    case 'Demographics':
      content.innerHTML =
        modHeader('Demographics', 'Ward ' + currentWardId + ' — Population statistics') +
        '<div id="demoDisplay" class="mod-info-card"><div class="mod-loading">Loading...</div></div>' +
        modForm('demoForm', [
          modInput('totalPopulation',   'number', 'Total Population',  true),
          modInput('malePopulation',    'number', 'Male Population',   false),
          modInput('femalePopulation',  'number', 'Female Population', false),
          modInput('seniorPopulation',  'number', 'Senior Citizens',   false),
          modInput('childrenPopulation','number', 'Children',          false),
          modInput('surveyYear',        'number', 'Survey Year',       true),
        ], 'Save Demographics') +
        modMsg('demoMsg');
      loadDemographics();
      attachDemoForm();
      break;

    case 'Department':
      content.innerHTML =
        modHeader('Department', 'Ward ' + currentWardId + ' — Civic departments') +
        modForm('deptForm', [
          modInput('deptName', 'text', 'Department Name', true),
          modInput('deptDesc', 'text', 'Description',     false),
        ], 'Add Department') +
        modMsg('deptMsg') +
        modTable(['Name', 'Description', 'Status', 'Action'], 'deptTable');
      attachDeptForm();
      loadDepartments();
      break;

    case 'Area':
      content.innerHTML =
        modHeader('Area', 'Ward ' + currentWardId + ' — Geographic areas') +
        modForm('areaForm', [
          modInput('areaName', 'text',   'Area Name', true),
          modSelect('areaType', 'Area Type', [
            { value: 'Society', label: 'Society' },
            { value: 'Slum',    label: 'Slum'    },
            { value: 'Layout',  label: 'Layout'  },
          ]),
          modInput('pincode',  'number', 'Pincode',   true),
          modInput('roadName', 'text',   'Road Name', true),
        ], 'Add Area') +
        modMsg('areaMsg') +
        modTable(['Area Name', 'Type', 'Pincode', 'Road', 'Status', 'Action'], 'areaTable');
      attachAreaForm();
      loadAreas();
      break;

    case 'Officer':
      content.innerHTML =
        modHeader('Officer', 'Ward ' + currentWardId + ' — Field officers') +
        modForm('officerForm', [
          modInput('firstName',    'text',  'First Name',    true),
          modInput('middleName',   'text',  'Middle Name',   false),
          modInput('lastName',     'text',  'Last Name',     true),
          '<div class="mod-field"><label class="mod-label">Department</label>' +
            '<select id="deptDropdown" class="mod-input"><option value="">Select Department</option></select></div>',
          modInput('designation',   'text',  'Designation',   true),
          modInput('mobile',        'text',  'Mobile Number', true),
          modInput('email',         'email', 'Email',         true),
          modInput('responsibility','text',  'Responsibility',false),
          modInput('officeAddress', 'text',  'Office Address',false),
        ], 'Add Officer') +
        modMsg('officerMsg') +
        modTable([
          'Name','Department','Designation','Mobile','Email',
          'Responsibility','Office Address','Status','Action'
        ], 'officerTable');
      attachOfficerForm();
      loadOfficers();
      loadDeptDropdown();
      break;

    case 'Facility':
      content.innerHTML =
        modHeader('Facility', 'Ward ' + currentWardId + ' — Public facilities') +
        modForm('facilityForm', [
          modInput('facilityType',   'text', 'Facility Type (Street Light, Water, Garbage)', true),
          modInput('facilityStatus', 'text', 'Status (Good, Bad, Not Working)',              true),
          modInput('lastCheckedDate','date', 'Last Checked Date',                            false),
          '<div class="mod-field"><label class="mod-label">Remarks (optional)</label>' +
            '<textarea id="remarks" class="mod-input mod-textarea" placeholder="Remarks..."></textarea></div>',
        ], 'Add Facility') +
        modMsg('facilityMsg') +
        modTable(['Type','Status','Last Checked','Remarks','Active','Action'], 'facilityTable');
      attachFacilityForm();
      loadFacilities();
      break;

    case 'Institution':
      content.innerHTML =
        modHeader('Institution', 'Ward ' + currentWardId + ' — Schools, hospitals, civic bodies') +
        modForm('institutionForm', [
          modInput('instType',     'text',   'Institution Type (School, Hospital)', true),
          modInput('instName',     'text',   'Institution Name',                   true),
          modInput('instAddress',  'text',   'Address',                            true),
          modInput('instCapacity', 'number', 'Capacity',                           true),
          modInput('instContact',  'text',   'Contact Number',                     true),
        ], 'Add Institution') +
        modMsg('instMsg') +
        modTable(['Type','Name','Address','Capacity','Contact','Status','Action'], 'institutionTable');
      attachInstitutionForm();
      loadInstitutions();
      break;

    case 'SOP':
      content.innerHTML =
        modHeader('SOP', 'Standard Operating Procedures') +
        '<div class="mod-coming"><div class="mod-coming-icon">📄</div>' +
        '<div class="mod-coming-title">SOP Module</div>' +
        '<div class="mod-coming-sub">This module is under development.</div></div>';
      break;

    default:
      content.innerHTML =
        modHeader(module, '') +
        '<div class="mod-coming"><div class="mod-coming-icon">🔧</div>' +
        '<div class="mod-coming-title">' + module + '</div>' +
        '<div class="mod-coming-sub">UI coming soon.</div></div>';
  }
}

/* ================================================================
   HTML BUILDER HELPERS
   ================================================================ */
function modHeader(title, subtitle) {
  return '<div class="mod-header">' +
    '<h2 class="mod-title">' + title + '</h2>' +
    (subtitle ? '<p class="mod-subtitle">' + subtitle + '</p>' : '') +
    '</div>';
}

function modInput(id, type, label, required) {
  return '<div class="mod-field">' +
    '<label class="mod-label">' + label + (required ? ' <span class="mod-req">*</span>' : '') + '</label>' +
    '<input type="' + type + '" id="' + id + '" placeholder="' + label + '" ' +
    (required ? 'required' : '') + ' class="mod-input" /></div>';
}

function modSelect(id, label, options) {
  const opts = options.map(function (o) {
    return '<option value="' + o.value + '">' + o.label + '</option>';
  }).join('');
  return '<div class="mod-field"><label class="mod-label">' + label + '</label>' +
    '<select id="' + id + '" class="mod-input">' + opts + '</select></div>';
}

function modForm(formId, fields, btnLabel) {
  return '<div class="mod-form-card">' +
    '<form id="' + formId + '" class="mod-form" novalidate>' +
    '<div class="mod-fields-grid">' + fields.join('') + '</div>' +
    '<div class="mod-form-footer">' +
    '<button type="submit" class="mod-btn-primary">' + btnLabel + '</button>' +
    '</div></form></div>';
}

function modMsg(id) {
  return '<div id="' + id + '" class="mod-msg" style="display:none;"></div>';
}

function modTable(headers, tbodyId) {
  const ths = headers.map(function (h) {
    return '<th class="mod-th">' + h + '</th>';
  }).join('');
  return '<div class="mod-table-card"><div class="mod-table-scroll">' +
    '<table class="mod-table"><thead><tr>' + ths + '</tr></thead>' +
    '<tbody id="' + tbodyId + '"></tbody></table></div></div>';
}

/* ================================================================
   RENDER TABLE — shared by all modules
   ================================================================ */
function renderTable(tableId, data, columns, toggleFn) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="' + (columns.length + 2) +
      '" class="mod-empty-row">No records found.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(function (item) {
    const cells = columns.map(function (col) {
      const val = (item[col] !== undefined && item[col] !== null) ? item[col] : '—';
      return '<td class="mod-td">' + val + '</td>';
    }).join('');

    const statusCell = '<td class="mod-td mod-td-center">' +
      '<span class="mod-badge ' + (item.isActive ? 'mod-badge-active' : 'mod-badge-inactive') + '">' +
      (item.isActive ? 'Active' : 'Inactive') + '</span></td>';

    const actionCell = '<td class="mod-td mod-td-center">' +
      '<button onclick="' + toggleFn + '(' + item.id + ')" class="mod-toggle-btn ' +
      (item.isActive ? 'mod-toggle-off' : 'mod-toggle-on') + '">' +
      (item.isActive ? 'Deactivate' : 'Activate') + '</button></td>';

    return '<tr class="mod-tr">' + cells + statusCell + actionCell + '</tr>';
  }).join('');
}

/* ================================================================
   SHOW MESSAGE
   ================================================================ */
function showMsg(id, text, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'mod-msg ' + (isError ? 'mod-msg-error' : 'mod-msg-success');
  el.style.display = 'flex';
  setTimeout(function () { el.style.display = 'none'; }, 4000);
}

/* ================================================================
   WARD
   ================================================================ */
function attachWardForm() {
  const form = document.getElementById('wardForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardNumber:           document.getElementById('wardNumber').value,
      wardName:             document.getElementById('wardName').value,
      jurisdictionTypeName: document.getElementById('jurisdictionType').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Ward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('wardMsg', 'Ward added successfully!', false); form.reset(); loadWards(); }
      else         { showMsg('wardMsg', 'Error adding ward.', true); }
    } catch (err) { showMsg('wardMsg', 'Server error: ' + err.message, true); }
  });
}

async function loadWards() {
  try {
    const res  = await fetch(API + '/Ward');
    const data = await res.json();
    renderTable('wardTable',
      data.map(function (w) {
        return { id: w.wardId, wardNumber: w.wardNumber, wardName: w.wardName, jurisdictionTypeName: w.jurisdictionTypeName, isActive: w.isActive };
      }),
      ['wardNumber', 'wardName', 'jurisdictionTypeName'], 'toggleWard');
  } catch (err) { console.error('loadWards:', err); }
}

async function toggleWard(id) {
  try {
    const res = await fetch(API + '/Ward/toggle/' + id, { method: 'PATCH' });
    if (res.ok) loadWards();
    else console.error('toggleWard failed');
  } catch (err) { console.error('toggleWard:', err); }
}

/* ================================================================
   DEMOGRAPHICS
   ================================================================ */
async function loadDemographics() {
  try {
    const res     = await fetch(API + '/Demographics');
    const data    = await res.json();
    const ward    = data.find(function (d) { return d.wardId === currentWardId; });
    const display = document.getElementById('demoDisplay');
    if (!display) return;
    if (!ward) {
      display.innerHTML = '<p class="mod-info-empty">No data available for Ward ' + currentWardId + '.</p>';
      return;
    }
    display.innerHTML =
      '<div class="mod-info-grid">' +
      demoStat('Total Population', ward.totalPopulation) +
      demoStat('Male',             ward.malePopulation) +
      demoStat('Female',           ward.femalePopulation) +
      demoStat('Senior Citizens',  ward.seniorCitizenPopulation) +
      demoStat('Children',         ward.childrenPopulation) +
      demoStat('Survey Year',      ward.surveyYear) +
      '</div>';
  } catch (err) {
    const display = document.getElementById('demoDisplay');
    if (display) display.innerHTML = '<p class="mod-info-empty">Failed to load data.</p>';
  }
}

function demoStat(label, value) {
  return '<div class="mod-info-stat">' +
    '<div class="mod-info-val">' + (value !== undefined && value !== null ? value : '—') + '</div>' +
    '<div class="mod-info-label">' + label + '</div>' +
    '</div>';
}

function attachDemoForm() {
  const form = document.getElementById('demoForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:                  currentWardId,
      totalPopulation:         parseInt(document.getElementById('totalPopulation').value),
      malePopulation:          parseInt(document.getElementById('malePopulation').value   || 0),
      femalePopulation:        parseInt(document.getElementById('femalePopulation').value || 0),
      seniorCitizenPopulation: parseInt(document.getElementById('seniorPopulation').value || 0),
      childrenPopulation:      parseInt(document.getElementById('childrenPopulation').value || 0),
      surveyYear:              parseInt(document.getElementById('surveyYear').value)
    };
    try {
      const res = await fetch(API + '/Demographics', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('demoMsg', 'Demographics saved!', false); form.reset(); loadDemographics(); }
      else         { showMsg('demoMsg', 'Error saving demographics.', true); }
    } catch (err) { showMsg('demoMsg', 'Server error: ' + err.message, true); }
  });
}

/* ================================================================
   DEPARTMENT
   ================================================================ */
async function loadDepartments() {
  try {
    const res  = await fetch(API + '/Department/by-ward/' + currentWardId);
    const data = await res.json();
    renderTable('deptTable',
      data.map(function (d) {
        return { id: d.deptId, departmentName: d.departmentName, departmentDescription: d.departmentDescription, isActive: d.isActive };
      }),
      ['departmentName', 'departmentDescription'], 'toggleDepartment');
  } catch (err) { console.error('loadDepartments:', err); }
}

function attachDeptForm() {
  const form = document.getElementById('deptForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:                currentWardId,
      departmentName:        document.getElementById('deptName').value,
      departmentDescription: document.getElementById('deptDesc').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Department', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('deptMsg', 'Department added!', false); form.reset(); loadDepartments(); }
      else         { showMsg('deptMsg', 'Error adding department.', true); }
    } catch (err) { showMsg('deptMsg', 'Server error: ' + err.message, true); }
  });
}

async function toggleDepartment(id) {
  await fetch(API + '/Department/toggle/' + id, { method: 'PATCH' });
  loadDepartments();
}

/* ================================================================
   AREA
   ================================================================ */
async function loadAreas() {
  try {
    const res  = await fetch(API + '/Area/by-ward/' + currentWardId);
    const data = await res.json();
    renderTable('areaTable',
      data.map(function (a) {
        return { id: a.areaId, areaName: a.areaName, areaType: a.areaType, pincode: a.pincode, roadName: a.roadName, isActive: a.isActive };
      }),
      ['areaName', 'areaType', 'pincode', 'roadName'], 'toggleArea');
  } catch (err) { console.error('loadAreas:', err); }
}

function attachAreaForm() {
  const form = document.getElementById('areaForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:   currentWardId,
      areaName: document.getElementById('areaName').value,
      areaType: document.getElementById('areaType').value,
      pincode:  parseInt(document.getElementById('pincode').value),
      roadName: document.getElementById('roadName').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Area', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('areaMsg', 'Area added!', false); form.reset(); loadAreas(); }
      else         { showMsg('areaMsg', 'Error adding area.', true); }
    } catch (err) { showMsg('areaMsg', 'Server error: ' + err.message, true); }
  });
}

async function toggleArea(id) {
  try {
    const res = await fetch(API + '/Area/toggle/' + id, { method: 'PATCH' });
    if (res.ok) loadAreas();
    else console.error('toggleArea failed');
  } catch (err) { console.error('toggleArea:', err); }
}

/* ================================================================
   OFFICER
   ================================================================ */
async function loadDeptDropdown() {
  try {
    const res      = await fetch(API + '/Department/by-ward/' + currentWardId);
    const data     = await res.json();
    const dropdown = document.getElementById('deptDropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '<option value="">Select Department</option>' +
      data.map(function (d) {
        return '<option value="' + d.deptId + '">' + d.departmentName + '</option>';
      }).join('');
  } catch (err) { console.error('loadDeptDropdown:', err); }
}

async function loadOfficers() {
  try {
    const res  = await fetch(API + '/Officer/by-ward/' + currentWardId);
    const data = await res.json();
    officerDataStore = data;
    renderTable('officerTable',
      data.map(function (o) {
        return {
          id:             o.officerId,
          officerName:    [o.firstName, o.middleName, o.lastName].filter(Boolean).join(' '),
          designation:    o.designation,
          departmentName: 'Dept #' + o.deptId,
          mobileNumber:   o.mobileNumber,
          email:          o.email,
          responsibility: o.responsibility || '—',
          officeAddress:  o.officeAddress  || '—',
          isActive:       o.isActive
        };
      }),
      ['officerName','designation','departmentName','mobileNumber','email','responsibility','officeAddress'],
      'toggleOfficer');
  } catch (err) { console.error('loadOfficers:', err); }
}

function attachOfficerForm() {
  const form = document.getElementById('officerForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:         currentWardId,
      deptId:         parseInt(document.getElementById('deptDropdown').value),
      firstName:      document.getElementById('firstName').value,
      middleName:     document.getElementById('middleName').value,
      lastName:       document.getElementById('lastName').value,
      designation:    document.getElementById('designation').value,
      mobileNumber:   document.getElementById('mobile').value,
      email:          document.getElementById('email').value,
      responsibility: document.getElementById('responsibility').value,
      officeAddress:  document.getElementById('officeAddress').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Officer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('officerMsg', 'Officer added!', false); form.reset(); loadOfficers(); }
      else         { showMsg('officerMsg', 'Error adding officer.', true); }
    } catch (err) { showMsg('officerMsg', 'Server error: ' + err.message, true); }
  });
}

async function toggleOfficer(id) {
  await fetch(API + '/Officer/toggle/' + id, { method: 'PATCH' });
  loadOfficers();
}

/* ================================================================
   FACILITY
   ================================================================ */
async function loadFacilities() {
  try {
    const res  = await fetch(API + '/Facility/by-ward/' + currentWardId);
    const data = await res.json();
    renderTable('facilityTable',
      data.map(function (f) {
        return {
          id:              f.facilityId,
          facilityType:    f.facilityType,
          statusText:      f.status,
          lastCheckedDate: f.lastCheckedDate ? f.lastCheckedDate.split('T')[0] : '—',
          remarks:         f.remarks || '—',
          isActive:        f.isActive
        };
      }),
      ['facilityType','statusText','lastCheckedDate','remarks'], 'toggleFacility');
  } catch (err) { console.error('loadFacilities:', err); }
}

function attachFacilityForm() {
  const form = document.getElementById('facilityForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:          currentWardId,
      facilityType:    document.getElementById('facilityType').value,
      status:          document.getElementById('facilityStatus').value,
      lastCheckedDate: document.getElementById('lastCheckedDate').value || null,
      remarks:         document.getElementById('remarks').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Facility', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('facilityMsg', 'Facility added!', false); form.reset(); loadFacilities(); }
      else         { showMsg('facilityMsg', 'Error adding facility.', true); }
    } catch (err) { showMsg('facilityMsg', 'Server error: ' + err.message, true); }
  });
}

async function toggleFacility(id) {
  await fetch(API + '/Facility/toggle/' + id, { method: 'PATCH' });
  loadFacilities();
}

/* ================================================================
   INSTITUTION
   ================================================================ */
async function loadInstitutions() {
  try {
    const res  = await fetch(API + '/Institution/by-ward/' + currentWardId);
    const data = await res.json();
    renderTable('institutionTable',
      data.map(function (i) {
        return {
          id:              i.institutionId,
          institutionType: i.institutionType,
          name:            i.name,
          address:         i.address,
          capacity:        i.capacity,
          contactNo:       i.contactNo,
          isActive:        i.isActive
        };
      }),
      ['institutionType','name','address','capacity','contactNo'], 'toggleInstitution');
  } catch (err) { console.error('loadInstitutions:', err); }
}

function attachInstitutionForm() {
  const form = document.getElementById('institutionForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = {
      wardId:          currentWardId,
      institutionType: document.getElementById('instType').value,
      name:            document.getElementById('instName').value,
      address:         document.getElementById('instAddress').value,
      capacity:        parseInt(document.getElementById('instCapacity').value),
      contactNo:       document.getElementById('instContact').value,
      isActive: true
    };
    try {
      const res = await fetch(API + '/Institution', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (res.ok) { showMsg('instMsg', 'Institution added!', false); form.reset(); loadInstitutions(); }
      else         { showMsg('instMsg', 'Error adding institution.', true); }
    } catch (err) { showMsg('instMsg', 'Server error: ' + err.message, true); }
  });
}

async function toggleInstitution(id) {
  await fetch(API + '/Institution/toggle/' + id, { method: 'PATCH' });
  loadInstitutions();
}
