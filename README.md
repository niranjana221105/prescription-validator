# 💊 MediSafe — Smart Prescription Validator

An AI-driven **full stack** web application that scans doctor prescriptions using OCR, detects dangerous drug interactions and dosage anomalies, and generates real-time safety alerts — with special focus on paediatric safety.

---

## 🚀 How to Run

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Start the backend (Terminal 1)
```bash
npm run server
```
Expected output:
```
🚀 MediSafe server running on http://localhost:5000
```

### Step 3 — Start the frontend (Terminal 2)
```bash
npm run dev
```
Expected output:
```
➜  Local:   http://localhost:3001/
```

### Step 4 — Open in browser
```
http://localhost:3001
```

### Step 5 — Register an account
1. Click **Register**
2. Enter your name, email, password
3. Select role → **Doctor**
4. Click **Create Account** ✅

> **No database required to run.** The app works fully in offline mode using in-memory storage.

---

## 🗄️ Enable PostgreSQL (Optional — Persistent Storage)

By default the app runs without a database. To save data permanently across sessions:

### Prerequisites
- PostgreSQL 17 installed
- Service `postgresql-x64-17` running

### Step 1 — Create the database
```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```
```sql
CREATE DATABASE smart_prescription_db;
\q
```

### Step 2 — Set your password in `.env`
```env
PG_PASSWORD=your_actual_postgres_password
```

### Step 3 — Restart the backend
```bash
npm run server
```
Expected output:
```
✅ PostgreSQL connected
✅ Tables synced
🚀 MediSafe server running on http://localhost:5000
```

> Sequelize automatically creates all tables on first run — no manual SQL needed.

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000

# PostgreSQL connection
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=smart_prescription_db
PG_USER=postgres
PG_PASSWORD=your_postgres_password

JWT_SECRET=smartrx_super_secret_key_change_this_in_production
```

---

## 📜 NPM Scripts

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start frontend on port 3001 |
| `npm run server` | Start backend on port 5000 |
| `npm run dev:full` | Start both frontend and backend together |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

---

## ✅ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Register / Login — Doctor, Pharmacist, Admin roles |
| 📷 Live Scanner | Webcam prescription scanning with real-time OCR |
| 📤 Upload Prescription | Drag & drop image upload with OCR analysis |
| ✏️ Manual Entry | Type drug names and dosages directly |
| 👶 Paediatric Safety | Age-based dosage validation for children |
| 🏷️ Brand Name Resolution | Dolo→Paracetamol, Gelusil→Antacid, 130+ brands |
| 🔤 OCR Auto-Correction | Fixes "Tbuprofen"→"Ibuprofen", drops garbage text |
| ✏️ Edit / Delete Drugs | Fix or remove incorrectly detected drugs inline |
| 🔍 Drug Interaction Check | Detects dangerous drug combinations |
| 📊 Dashboard | Real-time stats, charts, and recent alerts |
| 📋 History | Searchable, filterable prescription history |
| 💾 Persistent Storage | PostgreSQL saves all data across sessions |
| 📡 Offline Mode | Works without PostgreSQL using in-memory fallback |

---

## 🗂️ Project Structure

```
smart-prescription-validator/
│
├── .env                              # Environment variables
├── package.json
├── vite.config.js                    # Vite + API proxy (3001 → 5000)
├── README.md
│
├── server/                           # ── BACKEND ──
│   ├── index.js                      # Express app entry + Sequelize sync
│   ├── db.js                         # PostgreSQL connection (Sequelize)
│   ├── middleware/
│   │   └── auth.js                   # JWT middleware + offline fallback
│   ├── models/
│   │   ├── User.js                   # users table
│   │   ├── Patient.js                # patients table
│   │   └── Prescription.js           # prescriptions table (JSONB)
│   └── routes/
│       ├── auth.js                   # /api/auth
│       ├── prescriptions.js          # /api/prescriptions
│       └── patients.js               # /api/patients
│
└── src/                              # ── FRONTEND ──
    ├── main.jsx
    ├── App.jsx                       # Router + auth guard + backend sync
    ├── context/
    │   └── AuthContext.jsx           # Global login/logout state
    ├── services/
    │   └── api.js                    # All API calls
    ├── pages/
    │   ├── Login.jsx                 # Sign In / Register
    │   ├── Dashboard.jsx             # Stats and charts
    │   ├── LiveScanner.jsx           # Webcam OCR
    │   ├── ManualEntry.jsx           # Manual drug input
    │   ├── UploadPrescription.jsx    # Image upload + OCR
    │   └── History.jsx               # Past prescriptions
    ├── components/
    │   ├── Sidebar.jsx               # Navigation + DB status indicator
    │   ├── ValidationResults.jsx     # Results with edit/delete
    │   ├── ManualDrugEntry.jsx       # Inline drug entry panel
    │   ├── AlertCard.jsx
    │   └── StatCard.jsx
    └── utils/
        ├── drugInteractionChecker.js # Core safety engine
        ├── drugDatabase.js           # 500+ drugs + brand mapping
        └── ocrProcessor.js           # OCR + validation
```

---

## 🏗️ Architecture

```
Browser — React (port 3001)
         │
         │  /api/* → Vite proxy
         ▼
Express Server (port 5000)
         │
         ├── /api/auth          JWT login / register
         ├── /api/prescriptions Save, list, stats, delete
         └── /api/patients      Patient records
                   │
                   ▼
         PostgreSQL (port 5432)
         smart_prescription_db
         Tables: users, prescriptions, patients
         ↕
         [In-memory fallback if PostgreSQL offline]
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### Prescriptions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/prescriptions` | Save prescription |
| GET | `/api/prescriptions` | List with filters |
| GET | `/api/prescriptions/stats` | Dashboard stats |
| GET | `/api/prescriptions/:id` | Single record |
| PUT | `/api/prescriptions/:id/notes` | Add notes |
| DELETE | `/api/prescriptions/:id` | Delete |

### Patients
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/patients` | Create patient |
| GET | `/api/patients` | List / search |
| GET | `/api/patients/:id` | Single patient |
| DELETE | `/api/patients/:id` | Delete |

---

## 🗃️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | STRING | Required |
| email | STRING | Unique |
| password | STRING | bcrypt hashed |
| role | ENUM | doctor / pharmacist / admin |
| hospital | STRING | Optional |
| isActive | BOOLEAN | Default true |

### `prescriptions`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| patientName | STRING | |
| patientAge | FLOAT | For age-based checks |
| source | ENUM | manual / upload / live-scan |
| drugs | JSONB | Array of drug objects |
| interactions | JSONB | Detected interactions |
| ageWarnings | JSONB | Paediatric warnings |
| alerts | TEXT[] | All alert messages |
| riskLevel | ENUM | safe / warning / critical / info |
| summary | TEXT | Analysis summary |
| rawText | TEXT | OCR extracted text |
| createdBy | UUID | → users.id |

### `patients`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | STRING | Required |
| age | FLOAT | |
| gender | ENUM | male / female / other |
| allergies | TEXT[] | |
| createdBy | UUID | → users.id |

---

## 🧠 Algorithms

| Algorithm | Purpose |
|---|---|
| **Levenshtein Distance** | OCR correction — "Tbuprofen"→"Ibuprofen" (distance ≤ 1 = auto-fix) |
| **Hash Map O(1) Lookup** | Drug names, brand mapping, interaction pairs, age rules |
| **Pairwise Comparison O(n²)** | Check every drug pair for interactions |
| **Rule-Based Classification** | Age bracket matching for paediatric safety |
| **LSTM Neural Network** | Tesseract.js OCR — reads text from prescription images |
| **Regex Pattern Matching** | Extract drug names + dosages from OCR text |

---

## 📊 Datasets

| Dataset | Size | Purpose |
|---|---|---|
| Generic drug names | ~250 drugs | Name validation, OCR correction |
| Brand → Generic mapping | ~130 brands | Dolo→Paracetamol, Gelusil→Antacid |
| Drug interaction pairs | ~60 pairs | Dangerous combination detection |
| Paediatric age rules | ~80 brackets / 25 drugs | Age-safe dosage checking |
| Adult dosage limits | 50+ drugs | Overdose / underdose detection |
| **Total** | **~570 entries** | Full prescription safety analysis |

---

## ⚕️ Safety Logic

### Risk Levels
| Level | Colour | Meaning |
|---|---|---|
| ✅ SAFE | Green | No issues detected |
| ⚠️ WARNING | Yellow | Potential concern — review recommended |
| 🚨 CRITICAL | Red | Dangerous — immediate review required |

### Paediatric Safety Examples
| Drug | Age | Result |
|---|---|---|
| Gelusil | 2 years | 🚨 CRITICAL — aluminium neurotoxicity, NOT safe under 6 |
| Dolo 650mg | 2 years | 🚨 CRITICAL — max safe dose is 250mg |
| Aspirin | 10 years | 🚨 CRITICAL — Reye's syndrome, banned under 16 |
| Codeine | 8 years | 🚨 CRITICAL — fatal respiratory depression, banned under 12 |
| Ibuprofen | 3 months | 🚨 CRITICAL — NOT recommended under 6 months |
| Unknown drug | Any child | ⚠️ WARNING — no paediatric data, do not assume safe |

### Critical Drug Interactions
| Combination | Risk |
|---|---|
| Warfarin + Aspirin / Ibuprofen | Fatal bleeding |
| Simvastatin + Amiodarone | Rhabdomyolysis |
| Tramadol + Fluoxetine | Serotonin syndrome |
| Domperidone + Clarithromycin | QT prolongation / cardiac arrest |
| Metronidazole + Alcohol | Disulfiram reaction |
| Digoxin + Amiodarone | Digoxin toxicity / arrhythmia |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.0 | Build tool |
| React Router | 6.20 | Routing |
| Tesseract.js | 5.0 | OCR (LSTM neural network) |
| Recharts | 2.10 | Charts |
| Lucide React | 0.294 | Icons |
| react-webcam | 7.2 | Camera |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express | 4.18 | REST API |
| PostgreSQL | 17 | Database |
| Sequelize | 6.37 | ORM (auto table sync) |
| pg | 8.21 | PostgreSQL driver |
| jsonwebtoken | 9.0 | JWT auth |
| bcryptjs | 3.0 | Password hashing |
| dotenv | 17.4 | Env variables |
| cors | 2.8 | Cross-origin |
| concurrently | 10.0 | Run both servers |

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| Port 3001 not working | Try `http://localhost:3000` |
| `npm not found` | Install Node.js from nodejs.org |
| PostgreSQL password error | Update `PG_PASSWORD` in `.env` |
| Login not working | Click **Register** first to create an account |
| Data lost on restart | Connect PostgreSQL for persistent storage |

---

## ⚠️ Clinical Disclaimer

This application is a **clinical decision support tool** only. It assists healthcare professionals but does **not replace** professional medical judgment. All alerts must be reviewed by a qualified doctor or pharmacist before any clinical action is taken.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👨‍💻 Built With

- **Language:** JavaScript (ES2022)
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 17 + Sequelize ORM
- **Auth:** JWT + bcrypt
- **OCR:** Tesseract.js (LSTM Neural Network)
- **Safety Data:** WHO Essential Medicines, BNF for Children, clinical pharmacology references
"# prescription-validator" 
