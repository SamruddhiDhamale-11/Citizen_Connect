    # 🏛️ Citizen Connect

    A full-stack civic engagement platform that lets citizens report complaints and submit suggestions to their local government, while politicians and admins manage and resolve them.

    ---

    ## Table of Contents

    1. [Project Overview](#1-project-overview)
    2. [Tech Stack](#2-tech-stack)
    3. [Folder Structure](#3-folder-structure)
    4. [Navigation Flow](#4-navigation-flow)
    5. [Feature Mapping (File-Wise)](#5-feature-mapping-file-wise)
    6. [Voice Assistant System](#6-voice-assistant-system)
    7. [API Overview](#7-api-overview)
    8. [Database Structure](#8-database-structure)
    9. [Key Rules and Restrictions](#9-key-rules-and-restrictions)
    10. [How to Run the Project](#10-how-to-run-the-project)
    11. [Troubleshooting](#11-troubleshooting)

    ---

    ## 1. Project Overview

    ### What is Citizen Connect?

    Citizen Connect is a web-based civic platform that bridges the gap between citizens and their local government representatives. Citizens can register, file complaints about local issues (potholes, broken streetlights, garbage, etc.), and submit improvement suggestions — all through a guided, multilingual interface.

    ### What Problem Does It Solve?

    Most citizens have no easy way to report local problems or reach their ward representative. Citizen Connect provides a structured, trackable system where:
    - Every complaint gets a unique ID and a status trail
    - Politicians can see issues in their jurisdiction
    - Admins can update statuses and maintain accountability

    ### Three Main Modules

    | Module | Who Uses It | What They Can Do |
    |---|---|---|
    | **Citizen** | Registered residents | Register, file complaints, submit suggestions, track status |
    | **Politician** | Elected representatives | Register with jurisdiction details, view ward-level issues |
    | **Admin** | System administrator | Login with fixed credentials, view all complaints, update statuses |

    ### System Architecture

    ```
    Browser (HTML/CSS/JS)
            │
            │  HTTP fetch() calls
            ▼
    ASP.NET Core Web API  (port 5000 / 7000)
            │
            │  Entity Framework Core
            ▼
    SQL Server Database
            │
            │  wwwroot/uploads/
            ▼
    File System (profile photos, ID proofs, complaint images)
    ```

    The frontend is plain HTML/CSS/JavaScript — no framework. It talks to the backend via REST API calls. The backend is ASP.NET Core 8 with EF Core handling all database operations.

    ---

    ## 2. Tech Stack

    ### Frontend

    | Technology | Purpose |
    |---|---|
    | HTML5 | Page structure and forms |
    | CSS3 | Styling, responsive layout |
    | Vanilla JavaScript (ES6+) | Form logic, API calls, DOM manipulation |
    | Web Speech API | Voice recognition and text-to-speech |
    | Canvas API | CAPTCHA rendering |
    | `fetch()` | HTTP requests to backend |

    ### Backend

    | Technology | Purpose |
    |---|---|
    | ASP.NET Core 8 | Web API framework |
    | C# | Primary language |
    | Entity Framework Core 8 | ORM — database access |
    | Swashbuckle (Swagger) | Auto-generated API documentation |
    | BCrypt.Net-Next | Password hashing (dependency present) |
    | Serilog | Structured logging |
    | FluentValidation | Input validation |
    | AutoMapper | DTO ↔ Entity mapping |

    ### Database

    | Technology | Purpose |
    |---|---|
    | Microsoft SQL Server | Primary relational database |
    | EF Core Migrations | Schema versioning and updates |

    ### Other Services

    | Service | Purpose |
    |---|---|
    | Web Speech API (browser-native) | Voice input for registration forms |
    | SpeechSynthesis API (browser-native) | Text-to-speech prompts |
    | `wwwroot/uploads/` | Local file storage for photos and documents |
    | Live Server (VS Code extension) | Serves the frontend during development |

    ---

    ## 3. Folder Structure

    ```
    project-root/
    ├── frontend/                        ← All UI files (open with Live Server)
    │   ├── index.html                   ← Entry point — redirects to login
    │   ├── login/                       ← Login + Registration pages
    │   │   ├── login.html               ← Main HTML for login and register forms
    │   │   ├── login.js                 ← All form logic, validation, API calls
    │   │   └── login.css                ← Styles for login/register UI
    │   ├── citizen/                     ← Citizen dashboard (post-login)
    │   │   ├── citizen-dashboard.html   ← Dashboard layout and panels
    │   │   ├── citizen-dashboard.js     ← Complaint/suggestion submit + render logic
    │   │   └── citizen-dashboard.css    ← Dashboard styles
    │   ├── politician/                  ← Politician dashboard (post-login)
    │   │   ├── politician-dashboard.html
    │   │   ├── politician-dashboard.js
    │   │   └── politician-dashboard.css
    │   ├── admin/                       ← Admin dashboard (post-login)
    │   │   ├── admin-dashboard.html
    │   │   ├── admin-dashboard.js       ← Complaint list, status update logic
    │   │   └── admin-dashboard.css
    │   └── shared/                      ← Shared utilities used across pages
    │       └── voice-assistant.js       ← Full voice guide system (all languages)
    │
    └── backend/
        └── CitizenConnect.API/          ← ASP.NET Core 8 Web API project
            ├── Program.cs               ← App entry point, DI setup, middleware
            ├── appsettings.json         ← DB connection string, app config
            ├── appsettings.Development.json  ← Dev-only overrides
            ├── Controllers/             ← HTTP endpoint handlers
            │   ├── AuthController.cs    ← /api/auth — login, register
            │   ├── ComplaintController.cs ← /api/complaint — CRUD
            │   ├── AdminController.cs   ← /api/admin — admin operations
            │   └── MasterController.cs  ← /api/master — dropdown data
            ├── Domain/                  ← Core business models (no dependencies)
            │   ├── Common/
            │   │   └── BaseEntity.cs    ← Shared fields: CreatedAt, UpdatedAt
            │   ├── Entities/            ← Database table models
            │   │   ├── User.cs          ← All users (citizen + politician)
            │   │   ├── Citizen.cs       ← Citizen-specific profile data
            │   │   ├── Politician.cs    ← Politician-specific profile data
            │   │   ├── Complaint.cs     ← Complaint record
            │   │   ├── ComplaintCategory.cs  ← Category lookup table
            │   │   ├── ComplaintImage.cs     ← Uploaded images per complaint
            │   │   ├── ComplaintStatusHistory.cs ← Audit trail of status changes
            │   │   ├── Ward.cs          ← Ward/constituency data
            │   │   ├── JurisdictionType.cs   ← Municipal/State/Central etc.
            │   │   ├── ResidenceType.cs      ← Resident/Working/Business etc.
            │   │   └── Role.cs          ← Admin/Citizen/Politician roles
            │   └── Enums/
            │       └── ComplaintStatus.cs    ← Pending/InProgress/Resolved/Rejected
            ├── DTOs/                    ← Data Transfer Objects (API request/response shapes)
            │   ├── Auth/
            │   │   ├── LoginRequestDto.cs
            │   │   ├── RegisterCitizenDto.cs
            │   │   ├── RegisterPoliticianDto.cs
            │   │   └── AuthResponseDto.cs
            │   ├── Complaint/
            │   │   ├── CreateComplaintDto.cs
            │   │   ├── ComplaintResponseDto.cs
            │   │   └── ComplaintDetailsDto.cs
            │   └── Admin/
            │       ├── UpdateComplaintStatusDto.cs
            │       └── ComplaintStatusHistoryDto.cs
            ├── Interfaces/
            │   └── Services/            ← Interface + implementation in same folder
            │       ├── IAuthService.cs       ← Auth contract
            │       ├── AuthService.cs        ← Auth business logic
            │       ├── IComplaintService.cs  ← Complaint contract
            │       ├── ComplaintService.cs   ← Complaint business logic
            │       ├── IAdminService.cs      ← Admin contract
            │       └── AdminService.cs       ← Admin business logic
            ├── Infrastructure/
            │   └── Data/
            │       └── ApplicationDbContext.cs  ← EF Core DB context, table config
            ├── Migrations/              ← EF Core migration history
            │   ├── 20260512_InitialCreate.*
            │   ├── 20260514_AddComplaintModule.*
            │   ├── 20260514_AddComplaintStatusHistory.*
            │   ├── 20260518_UpdatePoliticianRegistrationFields.*
            │   ├── 20260518_MakePoliticianWardIdNullable.*
            │   └── ApplicationDbContextModelSnapshot.cs
            ├── Properties/
            │   └── launchSettings.json  ← Dev server ports and profiles
            └── wwwroot/
                └── uploads/             ← Uploaded files (served as static files)
                    ├── complaints/      ← Images attached to complaints
                    ├── idproofs/        ← Politician ID proof documents
                    └── politicians/     ← Politician profile photos
    ```

    ### What Each Folder Does

    | Folder | Contains | Why It Exists |
    |---|---|---|
    | `frontend/login/` | Login + multi-step registration UI | Entry point for all users |
    | `frontend/citizen/` | Citizen dashboard | Post-login home for citizens |
    | `frontend/politician/` | Politician dashboard | Post-login home for politicians |
    | `frontend/admin/` | Admin dashboard | Complaint management for admin |
    | `frontend/shared/` | `voice-assistant.js` | Reusable voice guide across all registration forms |
    | `Controllers/` | API route handlers | Receives HTTP requests, calls services, returns responses |
    | `Domain/Entities/` | C# model classes | Maps directly to database tables via EF Core |
    | `Domain/Enums/` | Enum definitions | Type-safe status values |
    | `DTOs/` | Request/response shapes | Decouples API surface from internal models |
    | `Interfaces/Services/` | Business logic | Keeps controllers thin; all real work happens here |
    | `Infrastructure/Data/` | `ApplicationDbContext` | Single EF Core entry point for all DB operations |
    | `Migrations/` | Schema change history | Lets EF Core create/update the database automatically |
    | `wwwroot/uploads/` | Uploaded files | Served as static files via `app.UseStaticFiles()` |

    ---

    ## 4. Navigation Flow

    ### 4.1 Login Flow

    ```
    User opens login.html
            │
            ▼
    Selects role from dropdown (Citizen / Politician / Admin)
    [login.html — role dropdown]
            │
            ▼
    Enters email/mobile + password → clicks Login
    [login.js → submitLogin()]
            │
            ▼
    POST /api/auth/login
    [AuthController.cs → Login()]
            │
            ▼
    AuthService.cs → LoginAsync()
    - Admin: checks hardcoded credentials (admin@citizenconnect.gov / Admin@CC2026)
    - Citizen/Politician: queries Users table by email or mobile
    - Verifies password
    - Updates LastLoginAt
            │
            ▼
    Returns AuthResponseDto { success, userId, role, redirectUrl }
            │
            ▼
    login.js stores userId + role in localStorage
            │
            ▼
    Redirects to role-specific dashboard:
    - Citizen   → citizen/citizen-dashboard.html
    - Politician → politician/politician-dashboard.html
    - Admin     → admin/admin-dashboard.html
    ```

    ---

    ### 4.2 Citizen Registration Flow

    ```
    User clicks "Register" on login page
    [login.js → showRegister()]
            │
            ▼
    Role is locked to "Citizen" — 3-step form appears
    [login.html — step panels: step1-citizen, step2-citizen, step3-citizen]

    STEP 1 — Name & Location
    Fields: First Name, Last Name, Ward Confirm (radio), Residency Type (radio), Voter Status (radio)
    Voice: voice-assistant.js → startGuide("c1") fills fields via speech
    Validation: login.js → validateStep(1)
    Next: login.js → nextStep(1)

    STEP 2 — Personal Details
    Fields: Date of Birth, Gender, Mobile, WhatsApp, Email
    Voice: voice-assistant.js → startGuide("c2")
    Validation: login.js → validateStep(2)
    Next: login.js → nextStep(2)

    STEP 3 — Security
    Fields: Password, Confirm Password, CAPTCHA, Accept Terms
    CAPTCHA: login.js → generateRegCaptcha() draws on <canvas>
    Submit: login.js → submitRegistration()
            │
            ▼
    POST /api/auth/register-citizen  (JSON body)
    [AuthController.cs → RegisterCitizen()]
            │
            ▼
    AuthService.cs → RegisterCitizenAsync()
    1. Checks for duplicate email/mobile
    2. Validates WardId and ResidenceTypeId exist in DB
    3. Creates User record (RoleId = 2)
    4. Creates Citizen record linked to User
            │
            ▼
    Returns { success: true, userId, role: "Citizen" }
            │
            ▼
    login.js → showSuccess() → progress bar → redirect to citizen-dashboard.html
    ```

    ---

    ### 4.3 Politician Registration Flow

    ```
    User selects "Politician" role → clicks Register
    [login.js → showRegister()]

    STEP 1 — Personal Info
    Fields: First Name, Last Name, Age, Gender, Mobile, Email, Address
    Voice: voice-assistant.js → startGuide("p1")
    Validation: Age must be ≥ 25

    STEP 2 — Political Details
    Fields: Jurisdiction Type (dropdown from API), Ward Number, Ward Name,
            Position (MLA/MP/Corporator/Mayor/Sarpanch/Councillor), Party Name, Government ID
    Jurisdiction dropdown: populated via GET /api/master/jurisdiction-types
    Voice: voice-assistant.js → startGuide("p2")

    STEP 3 — Verify
    Fields: Profile Photo (JPG/PNG, max 5MB), ID Proof (PDF/JPG/PNG, max 5MB),
            Password, Confirm Password, CAPTCHA, Accept Terms
    Submit: login.js → submitRegistration() → buildPoliticianFormData()
            │
            ▼
    POST /api/auth/register-politician  (multipart/form-data)
    [AuthController.cs → RegisterPolitician()]
            │
            ▼
    AuthService.cs → RegisterPoliticianAsync()
    1. Checks for duplicate email/mobile
    2. Validates JurisdictionTypeId exists
    3. Saves profile photo → wwwroot/uploads/politicians/
    4. Saves ID proof → wwwroot/uploads/idproofs/
    5. Creates User record (RoleId = 3)
    6. Creates Politician record linked to User
            │
            ▼
    Redirects to politician-dashboard.html
    ```

    ---

    ### 4.4 Citizen Complaint Flow

    ```
    Citizen logs in → citizen-dashboard.html loads
    [citizen-dashboard.js → DOMContentLoaded]
            │
            ▼
    Clicks "File Complaint" in sidebar
    [citizen-dashboard.js → showPanel("complaint")]
            │
            ▼
    Fills form: Category, Priority, Title, Description, Location, optional image
    [citizen-dashboard.html — #complaintForm]
            │
            ▼
    Clicks Submit
    [citizen-dashboard.js → submitComplaint()]
    (currently adds to local demo array — API integration point ready)
            │
            ▼
    Complaint appears in "My Complaints" panel with status "Pending"
    [citizen-dashboard.js → renderComplaints()]

    Note: The backend API endpoint POST /api/complaint/create is fully built
    and ready. The dashboard currently uses demo data. Connecting them requires
    calling the API with the citizen's stored userId.
    ```

    ---

    ### 4.5 Admin Flow

    ```
    Admin logs in with:
    Email: admin@citizenconnect.gov
    Password: Admin@CC2026
    [AuthService.cs — hardcoded admin check]
            │
            ▼
    Redirected to admin-dashboard.html
            │
            ▼
    Dashboard loads all complaints
    GET /api/admin/complaints
    [AdminController.cs → GetAllComplaints()]
    [AdminService.cs → GetAllComplaintsAsync()]
            │
            ▼
    Admin selects a complaint → updates status
    PUT /api/admin/update-status  { complaintId, newStatus, remarks, changedByUserId }
    [AdminController.cs → UpdateComplaintStatus()]
    [AdminService.cs → UpdateComplaintStatusAsync()]
    → Creates a ComplaintStatusHistory record (full audit trail)
            │
            ▼
    Admin views history of any complaint
    GET /api/admin/complaint-history/{complaintId}
    [AdminController.cs → GetComplaintHistory()]
    ```

    ---

    ## 5. Feature Mapping (File-Wise)

    | Feature | Frontend File(s) | Backend File(s) | Description |
    |---|---|---|---|
    | Login | `login/login.html`, `login/login.js` | `AuthController.cs`, `AuthService.cs` | Role-based login with redirect |
    | Citizen Registration | `login/login.html`, `login/login.js` | `AuthController.cs`, `AuthService.cs`, `RegisterCitizenDto.cs` | 3-step form with validation |
    | Politician Registration | `login/login.html`, `login/login.js` | `AuthController.cs`, `AuthService.cs`, `RegisterPoliticianDto.cs` | 3-step form with file uploads |
    | CAPTCHA | `login/login.js` (Canvas API) | N/A | Client-side canvas CAPTCHA |
    | Voice Guide | `shared/voice-assistant.js` | N/A | Speech recognition + TTS for form filling |
    | Citizen Dashboard | `citizen/citizen-dashboard.html`, `citizen/citizen-dashboard.js` | N/A (demo data) | View/filter complaints and suggestions |
    | File a Complaint | `citizen/citizen-dashboard.js` | `ComplaintController.cs`, `ComplaintService.cs`, `CreateComplaintDto.cs` | Submit complaint with optional image |
    | Submit Suggestion | `citizen/citizen-dashboard.js` | N/A (demo data) | Submit improvement suggestions |
    | Politician Dashboard | `politician/politician-dashboard.html`, `politician/politician-dashboard.js` | N/A | View ward-level issues |
    | Admin Dashboard | `admin/admin-dashboard.html`, `admin/admin-dashboard.js` | `AdminController.cs`, `AdminService.cs` | View all complaints, update statuses |
    | Complaint Status Update | `admin/admin-dashboard.js` | `AdminController.cs`, `AdminService.cs`, `UpdateComplaintStatusDto.cs` | Status change with audit history |
    | Complaint History | `admin/admin-dashboard.js` | `AdminController.cs`, `AdminService.cs`, `ComplaintStatusHistoryDto.cs` | Full audit trail per complaint |
    | Ward Dropdown | `login/login.js` | `MasterController.cs` | Loads wards from DB for citizen form |
    | Jurisdiction Dropdown | `login/login.js` | `MasterController.cs` | Loads jurisdiction types for politician form |
    | Residence Type Dropdown | `login/login.js` | `MasterController.cs` | Loads residence types for citizen form |
    | File Upload (Politician) | `login/login.js` | `AuthService.cs` | Profile photo + ID proof saved to `wwwroot/uploads/` |
    | File Upload (Complaint) | `citizen/citizen-dashboard.js` | `ComplaintService.cs` | Complaint images saved to `wwwroot/uploads/complaints/` |
    | DB Schema | N/A | `ApplicationDbContext.cs`, `Migrations/` | EF Core manages all table creation |

    ---

    ## 6. Voice Assistant System

    **File:** `frontend/shared/voice-assistant.js`

    This is a self-contained voice guide module. It uses the browser's built-in Web Speech API — no external library or API key needed.

    ### How It Works

    1. A "Start Voice Guide" button is injected into each registration step panel automatically when the page loads.
    2. When clicked, the guide first asks the user to choose a language.
    3. After language selection, it reads each form field's prompt aloud and listens for the user's spoken response.
    4. The spoken text is parsed and filled into the correct form field automatically.
    5. If no answer is heard within 15 seconds, the question is repeated.

    ### Supported Languages

    | Language | Speech Recognition Tag | TTS Tag |
    |---|---|---|
    | English | `en-IN` | `en-IN` |
    | Hindi | `hi-IN` | `hi-IN` |
    | Marathi | `mr-IN` | `mr-IN` (falls back to `hi-IN` voice if no Marathi voice is installed) |

    ### Field Types Handled

    | Field Type | How It Works |
    |---|---|
    | Text (name, address) | Spoken text is trimmed and placed directly into the input |
    | Phone number | Digits are accumulated across multiple utterances until 10 digits are collected |
    | Email | Spoken words like "rahul at gmail dot com" are converted to `rahul@gmail.com` |
    | Radio button | Spoken word is matched against a list of accepted labels per option |
    | Select/Dropdown | Spoken word is matched against option labels (including Hindi/Marathi variants) |
    | Date of Birth | Skipped by voice — user must use the date picker manually |

    ### Ward Number Formatting

    When the user says a ward number (e.g., "ward number five" or "वार्ड पाच"), the voice module extracts the numeric portion and fills the `p-wardNumber` field.

    ### Jurisdiction Selection Logic

    The jurisdiction dropdown is populated live from `GET /api/master/jurisdiction-types`. The voice guide calls `refreshJurisdictionOptions()` at runtime to read the current dropdown options and match the user's spoken text against them dynamically — no hardcoded jurisdiction values exist in the voice module.

    ### "Same as Mobile" Logic

    On the WhatsApp field, if the user says "same as mobile" (or Hindi/Marathi equivalents), the voice guide checks the `c-sameAsMobile` checkbox and copies the mobile number automatically.

    ### Public API (used by login.js)

    ```javascript
    window.VoiceGuide.start("c1")   // Start guide for citizen step 1
    window.VoiceGuide.start("c2")   // Start guide for citizen step 2
    window.VoiceGuide.start("p1")   // Start guide for politician step 1
    window.VoiceGuide.start("p2")   // Start guide for politician step 2
    window.VoiceGuide.stop()        // Stop the guide
    window.voiceGetLang()           // Returns "english" | "hindi" | "marathi"
    window.voiceResetLang()         // Resets language to English (called on form reset)
    window.voiceWarn(message)       // Speaks a validation error aloud
    ```

    ---

    ## 7. API Overview

    Base URL (development): `http://localhost:5000/api` or `http://localhost:7000/api`

    Swagger UI: `http://localhost:{port}/swagger`

    ---

    ### Auth Endpoints

    #### POST `/api/auth/login`
    Login for all roles.

    **Request body (JSON):**
    ```json
    {
    "emailOrMobile": "citizen@example.com",
    "password": "yourpassword"
    }
    ```
    **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "userId": 5,
    "role": "Citizen",
    "redirectUrl": "../citizen/citizen-dashboard.html"
    }
    ```

    ---

    #### POST `/api/auth/register-citizen`
    Register a new citizen account.

    **Request body (JSON):**
    ```json
    {
    "firstName": "Rahul",
    "lastName": "Sharma",
    "mobileNo": "9876543210",
    "email": "rahul@example.com",
    "gender": "male",
    "dateOfBirth": "1995-06-15",
    "wardId": 1,
    "residenceTypeId": 1,
    "isVoterRegistered": true,
    "preferredLanguage": "English",
    "password": "Pass@123"
    }
    ```
    **Response:** `{ "success": true, "userId": 12, "role": "Citizen" }`

    ---

    #### POST `/api/auth/register-politician`
    Register a new politician. Uses `multipart/form-data` because it includes file uploads.

    **Form fields:** `firstName`, `lastName`, `mobileNo`, `email`, `age`, `gender`, `address`, `partyName`, `politicianRole`, `governmentId`, `jurisdictionTypeId`, `wardNumber`, `wardName`, `password`

    **Files:** `profilePhoto` (JPG/PNG), `idProof` (PDF/JPG/PNG)

    **Response:** `{ "success": true, "userId": 8, "role": "Politician" }`

    ---

    ### Complaint Endpoints

    #### POST `/api/complaint/create`
    Submit a new complaint. Uses `multipart/form-data`.

    **Form fields:** `citizenId`, `wardId`, `complaintCategoryId`, `title`, `description`, `address`, `latitude`, `longitude`, `priority`, `isAnonymous`

    **Files:** `files[]` (optional images)

    **Response:**
    ```json
    {
    "complaintId": 3,
    "complaintNumber": "CC-20260519143022",
    "title": "Broken streetlight",
    "priority": "High",
    "status": "Pending",
    "createdAt": "2026-05-19T14:30:22Z"
    }
    ```

    ---

    #### GET `/api/complaint/citizen/{citizenId}`
    Get all complaints filed by a specific citizen.

    **Response:** Array of `ComplaintResponseDto`

    ---

    #### GET `/api/complaint/{complaintId}`
    Get full details of a single complaint including images.

    **Response:** `ComplaintDetailsDto` with image paths

    ---

    #### GET `/api/complaint/categories`
    Get all active complaint categories for the dropdown.

    **Response:** `[{ "complaintCategoryId": 1, "categoryName": "Roads & Potholes" }, ...]`

    ---

    ### Admin Endpoints

    #### GET `/api/admin/complaints`
    Get all complaints in the system (admin only).

    **Response:** Array of all complaints with citizen and category info

    ---

    #### PUT `/api/admin/update-status`
    Update the status of a complaint and record the change in history.

    **Request body (JSON):**
    ```json
    {
    "complaintId": 3,
    "newStatus": "InProgress",
    "remarks": "Team dispatched",
    "changedByUserId": 1
    }
    ```

    ---

    #### GET `/api/admin/complaint-history/{complaintId}`
    Get the full status change history for a complaint.

    **Response:** Array of `ComplaintStatusHistoryDto` ordered by date

    ---

    ### Master Data Endpoints

    #### GET `/api/master/wards`
    Returns all wards for the citizen registration dropdown.

    **Response:** `[{ "wardId": 1, "wardName": "Ward A", "wardNumber": "01" }, ...]`

    #### GET `/api/master/residence-types`
    Returns all residence types for the citizen registration dropdown.

    #### GET `/api/master/jurisdiction-types`
    Returns all jurisdiction types for the politician registration dropdown.

    ---

    ## 8. Database Structure

    ### Tables and Their Purpose

    | Table | Maps To | Purpose |
    |---|---|---|
    | `Users` | `User.cs` | All registered users (citizens + politicians). Stores name, mobile, email, password hash, role |
    | `Roles` | `Role.cs` | Lookup: Admin (1), Citizen (2), Politician (3) |
    | `Citizens` | `Citizen.cs` | Citizen-specific data: DOB, ward, residence type, voter status |
    | `Politicians` | `Politician.cs` | Politician-specific data: party, role, jurisdiction, ward, ID proof paths |
    | `Wards` | `Ward.cs` | Ward/constituency data: name, number, area, pincode, coordinates |
    | `JurisdictionTypes` | `JurisdictionType.cs` | Types like Municipal, State, Central |
    | `ResidenceTypes` | `ResidenceType.cs` | Types like Resident, Working Here, Business Owner |
    | `Complaints` | `Complaint.cs` | Complaint records with status, priority, location, category |
    | `ComplaintCategories` | `ComplaintCategory.cs` | Lookup: Roads, Electricity, Garbage, etc. |
    | `ComplaintImages` | `ComplaintImage.cs` | File paths for images attached to complaints |
    | `ComplaintStatusHistories` | `ComplaintStatusHistory.cs` | Audit trail: who changed what status and when |

    ### Key Relationships

    ```
    Roles ──────────────── Users (one role → many users)
    Users ──────────────── Citizens (one-to-one)
    Users ──────────────── Politicians (one-to-one)
    Wards ──────────────── Citizens (one ward → many citizens)
    Wards ──────────────── Complaints (one ward → many complaints)
    JurisdictionTypes ──── Wards (one jurisdiction → many wards)
    JurisdictionTypes ──── Politicians (one jurisdiction → many politicians)
    ResidenceTypes ─────── Citizens (one type → many citizens)
    Citizens ───────────── Complaints (one citizen → many complaints)
    ComplaintCategories ── Complaints (one category → many complaints)
    Complaints ─────────── ComplaintImages (one complaint → many images)
    Complaints ─────────── ComplaintStatusHistories (one complaint → many history records)
    Users ──────────────── ComplaintStatusHistories (who made the change)
    ```

    ### Important Constraints

    - `Users.Email` — unique index (no two accounts with same email)
    - `Users.MobileNo` — unique index (no two accounts with same mobile)
    - `Complaints.ComplaintNumber` — unique index (format: `CC-yyyyMMddHHmmss`)
    - `Politician.WardId` — nullable (politicians enter ward as free text, not from dropdown)
    - All foreign keys use `OnDelete(DeleteBehavior.NoAction)` — no cascade deletes
    - `Complaint.Status` is stored as an integer enum: Pending=1, InProgress=2, Resolved=3, Rejected=4

    ### BaseEntity (inherited by all entities)

    ```csharp
    public class BaseEntity {
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    ```

    Every table automatically has `CreatedAt` and `UpdatedAt` columns.

    ---

    ## 9. Key Rules and Restrictions

    ### Do NOT Modify

    | What | Why |
    |---|---|
    | Admin credentials in `AuthService.cs` | Hardcoded as `admin@citizenconnect.gov` / `Admin@CC2026`. Changing them breaks admin login. |
    | `OnDelete(DeleteBehavior.NoAction)` in `ApplicationDbContext.cs` | Prevents cascade delete errors in SQL Server with multiple FK paths. Do not change to `Cascade`. |
    | CORS origins in `Program.cs` | Only `localhost:5500` and `localhost:5501` are whitelisted. Adding other origins requires explicit changes here. |
    | `RoleId` values (1=Admin, 2=Citizen, 3=Politician) | These are seeded/assumed throughout the codebase. Changing them breaks role assignment. |
    | `ComplaintStatus` enum integer values | Stored as integers in the DB. Reordering them corrupts existing records. |
    | `wwwroot/uploads/` folder structure | File paths are stored in the DB as `/uploads/politicians/filename.jpg`. Renaming folders breaks image loading. |
    | `voice-assistant.js` field ID references | The voice guide targets specific HTML element IDs (e.g., `c-firstName`, `p-jurisdiction`). Renaming those IDs in HTML breaks voice autofill. |

    ### Important Safety Rules

    - Passwords are currently stored as plain text in `PasswordHash`. BCrypt.Net is installed — hashing should be added before production deployment.
    - The CAPTCHA is client-side only. It prevents accidental double-submits but is not a security measure against bots.
    - File uploads are not virus-scanned. Only MIME type and size are validated on the frontend.
    - There is no JWT authentication on API endpoints. All endpoints are currently open. Auth middleware should be added before production.
    - Do not delete migration files. EF Core needs the full history to apply incremental updates.

    ---

    ## 10. How to Run the Project

    ### Prerequisites

    - [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
    - [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express edition is fine)
    - [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)
    - [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code (to serve the frontend)

    ---

    ### Step 1 — Configure the Database Connection

    Open `backend/CitizenConnect.API/appsettings.json` and update the connection string:

    ```json
    {
    "ConnectionStrings": {
        "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=CitizenConnectDB;Trusted_Connection=True;TrustServerCertificate=True;"
    }
    }
    ```

    Replace `YOUR_SERVER_NAME` with your SQL Server instance name (e.g., `localhost`, `.\SQLEXPRESS`, or `(localdb)\MSSQLLocalDB`).

    ---

    ### Step 2 — Run Database Migrations

    Open a terminal in the `backend/CitizenConnect.API/` folder and run:

    ```bash
    dotnet ef database update
    ```

    This creates the `CitizenConnectDB` database and all tables automatically. You should see output ending with `Done.`

    If `dotnet ef` is not found, install it first:
    ```bash
    dotnet tool install --global dotnet-ef
    ```

    ---

    ### Step 3 — Start the Backend

    In the same folder, run:

    ```bash
    dotnet run
    ```

    Or open `CitizenConnect.API.slnx` in Visual Studio and press **F5**.

    The API will start on one of these URLs (check the terminal output):
    - `http://localhost:5000`
    - `https://localhost:7000`

    Verify it's running by opening: `http://localhost:5000/swagger`

    ---

    ### Step 4 — Check the API Base URL in the Frontend

    Open `frontend/login/login.js` and find the `API_BASE` constant near the top. Make sure it matches the port your backend is running on:

    ```javascript
    const API_BASE = 'http://localhost:5000/api/auth';
    ```

    ---

    ### Step 5 — Start the Frontend

    In VS Code, right-click `frontend/login/login.html` and select **"Open with Live Server"**.

    The app will open at `http://127.0.0.1:5500/frontend/login/login.html`.

    ---

    ### Step 6 — Seed Master Data (Required)

    The wards, residence types, and jurisdiction types tables need initial data. Run these SQL scripts against your `CitizenConnectDB` database in SQL Server Management Studio or Azure Data Studio:

    ```sql
    -- Roles
    INSERT INTO Roles (RoleName, CreatedAt) VALUES ('Admin', GETUTCDATE());
    INSERT INTO Roles (RoleName, CreatedAt) VALUES ('Citizen', GETUTCDATE());
    INSERT INTO Roles (RoleName, CreatedAt) VALUES ('Politician', GETUTCDATE());

    -- Jurisdiction Types
    INSERT INTO JurisdictionTypes (JurisdictionTypeName, CreatedAt) VALUES ('Municipal Corporation', GETUTCDATE());
    INSERT INTO JurisdictionTypes (JurisdictionTypeName, CreatedAt) VALUES ('State Legislature', GETUTCDATE());
    INSERT INTO JurisdictionTypes (JurisdictionTypeName, CreatedAt) VALUES ('Parliament', GETUTCDATE());

    -- Residence Types
    INSERT INTO ResidenceTypes (ResidenceTypeName, CreatedAt) VALUES ('Resident', GETUTCDATE());
    INSERT INTO ResidenceTypes (ResidenceTypeName, CreatedAt) VALUES ('Working Here', GETUTCDATE());
    INSERT INTO ResidenceTypes (ResidenceTypeName, CreatedAt) VALUES ('Business Owner', GETUTCDATE());
    INSERT INTO ResidenceTypes (ResidenceTypeName, CreatedAt) VALUES ('Property Owner', GETUTCDATE());
    INSERT INTO ResidenceTypes (ResidenceTypeName, CreatedAt) VALUES ('Other', GETUTCDATE());

    -- Sample Ward
    INSERT INTO Wards (WardNumber, WardName, AreaName, Pincode, JurisdictionTypeId, Latitude, Longitude, CreatedAt)
    VALUES ('01', 'Ward 1 - City Center', 'City Center', '411001', 1, 18.5204, 73.8567, GETUTCDATE());

    -- Complaint Categories
    INSERT INTO ComplaintCategories (CategoryName, IsActive, CreatedAt) VALUES ('Roads & Potholes', 1, GETUTCDATE());
    INSERT INTO ComplaintCategories (CategoryName, IsActive, CreatedAt) VALUES ('Electricity / Streetlights', 1, GETUTCDATE());
    INSERT INTO ComplaintCategories (CategoryName, IsActive, CreatedAt) VALUES ('Garbage & Sanitation', 1, GETUTCDATE());
    INSERT INTO ComplaintCategories (CategoryName, IsActive, CreatedAt) VALUES ('Water Supply', 1, GETUTCDATE());
    INSERT INTO ComplaintCategories (CategoryName, IsActive, CreatedAt) VALUES ('Public Safety & Security', 1, GETUTCDATE());
    ```

    ---

    ### Default Admin Login

    ```
    Email:    admin@citizenconnect.gov
    Password: Admin@CC2026
    ```

    ---

    ## 11. Troubleshooting

    ### Backend won't start — port already in use

    **Error:** `Failed to bind to address http://0.0.0.0:5000: address already in use`

    **Fix:** Find and kill the process using that port:
    ```bash
    # Find the process
    netstat -ano | findstr :5000

    # Kill it (replace 1234 with the actual PID)
    taskkill /PID 1234 /F
    ```

    Or change the port in `backend/CitizenConnect.API/Properties/launchSettings.json`:
    ```json
    "applicationUrl": "http://localhost:5001"
    ```
    Then update `API_BASE` in `login.js` to match.

    ---

    ### Migration errors

    **Error:** `No database provider has been configured`

    **Fix:** Make sure the connection string in `appsettings.json` is correct and SQL Server is running.

    **Error:** `There is already an object named 'Users' in the database`

    **Fix:** The database already has tables from a previous migration. Either drop the database and re-run, or check if migrations are out of sync:
    ```bash
    dotnet ef migrations list
    ```

    **Error:** `dotnet ef` command not found

    **Fix:**
    ```bash
    dotnet tool install --global dotnet-ef --version 8.*
    ```

    ---

    ### Frontend shows "Unable to connect to server"

    - Confirm the backend is running (`dotnet run` output shows the URL)
    - Check `API_BASE` in `login.js` matches the backend port exactly
    - Check the browser console (F12) for CORS errors
    - If you see a CORS error, make sure you're opening the frontend via Live Server (port 5500 or 5501), not by double-clicking the HTML file (which uses `file://` protocol and is blocked by CORS)

    ---

    ### Voice recognition not working

    - Voice recognition requires a browser that supports the Web Speech API. Use **Google Chrome** or **Microsoft Edge** — Firefox does not support it.
    - The page must be served over `http://` or `https://` — `file://` protocol blocks microphone access.
    - If the browser asks for microphone permission, click **Allow**.
    - On Windows, check that the microphone is not muted in system settings.
    - Hindi and Marathi TTS quality depends on which voices are installed on your OS. On Windows, install additional language packs via Settings → Time & Language → Language.

    ---

    ### Complaint images not displaying

    - Check that `app.UseStaticFiles()` is present in `Program.cs` (it is, by default).
    - The image path stored in the DB looks like `/uploads/complaints/filename.jpg`. The full URL would be `http://localhost:5000/uploads/complaints/filename.jpg`.
    - Make sure the `wwwroot/uploads/` folder exists and the backend process has write permission to it.

    ---

    ### Registration fails with "Invalid Ward or Residence Type"

    The master data tables (Wards, ResidenceTypes) are empty. Run the seed SQL scripts from [Step 6](#step-6--seed-master-data-required) above.

    ---

    ### Login redirects to wrong page

    Check `localStorage` in the browser (F12 → Application → Local Storage). If `userId` or `role` has a stale value from a previous session, clear it:
    ```javascript
    localStorage.clear()
    ```
    Then log in again.

    ---

    *README generated for Citizen Connect — Full Stack Civic Platform*
    *Backend: ASP.NET Core 8 | Frontend: Vanilla JS | Database: SQL Server*
