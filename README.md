# Citizen Connect — Smart Governance Portal

## Project Structure

```
/
├── index.html                        ← Entry point (redirects to login/login.html)
│
├── login/
│   ├── login.html                    ← Login + Registration page (all roles)
│   ├── login.css                     ← Login/registration styles
│   └── login.js                      ← Login, registration, CAPTCHA, voice validation logic
│
├── citizen/
│   ├── citizen-dashboard.html        ← Citizen dashboard
│   ├── citizen-dashboard.css         ← Citizen dashboard styles
│   └── citizen-dashboard.js          ← Citizen dashboard logic (complaints, suggestions, profile)
│
├── politician/
│   ├── politician-dashboard.html     ← Politician analytics dashboard
│   ├── politician-dashboard.css      ← Politician dashboard styles
│   └── politician-dashboard.js       ← Politician dashboard logic (charts, ward data)
│
├── admin/
│   ├── admin-dashboard.html          ← Admin management dashboard
│   ├── admin-dashboard.css           ← Admin dashboard styles
│   └── admin-dashboard.js            ← Admin dashboard logic (CRUD modules)
│
└── shared/
    └── voice-assistant.js            ← Multilingual voice assistant (EN/HI/MR)
                                         CAPTCHA, validation messages, speech synthesis
```

## Navigation Flow

```
index.html
    └── login/login.html  (login + registration)
            ├── citizen/citizen-dashboard.html
            ├── politician/politician-dashboard.html
            └── admin/admin-dashboard.html
                    └── (logout) → login/login.html
```

## Original Files (kept for compatibility)

The original root-level files (`app.js`, `style.css`, `dashboard.html`, etc.) are
preserved unchanged. The new structured files in the module folders are the
canonical versions going forward.
