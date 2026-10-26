# 🛡️ LINKSHIELD

> **"Scan Smart. Click Safe."**

An enterprise-grade Cyber Security / SOC web application engineered specifically for **Suspicious Link Verification** powered by the **VirusTotal API v3**.

Designed for high-visibility cybersecurity exhibitions, hackathons, college demonstrations, and SOC portfolios.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Visual Identity & Design Philosophy](#-visual-identity--design-philosophy)
- [Technology Stack](#-technology-stack)
- [Architecture & Workflow](#-architecture--workflow)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [PDF Security Report Generation](#-pdf-security-report-generation)
- [Security & Architecture Standards](#-security--architecture-standards)
- [API Rate Limits & Caching](#-api-rate-limits--caching)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

In modern attack surfaces, malicious links represent the primary ingress vector for credential harvesting, drive-by malware delivery, session hijacking, and spear-phishing campaigns. 

**LinkShield** solves this by offering a zero-compromise URL verification engine. Rather than overwhelming operators with unrelated tools, LinkShield focuses exclusively on **suspicious link analysis**. It connects securely to **VirusTotal API v3**, aggregates multi-vendor consensus across leading security vendors, computes an authentic **0–100 Threat Score**, evaluates threat indicators, and compiles an executive-level downloadable PDF report.

---

## ⚡ Core Features

- **🔗 Suspicious Link Verification**: Validates HTTP/HTTPS schemes, sanitizes inputs, and queries VirusTotal API v3.
- **🛰️ Interactive Cyber Radar Scanner**: Features rotating concentric rings, dynamic radar sweep beam, synchronized progress percentage (0% → 100%), and terminal-style logs.
- **📟 SOC Terminal Telemetry**: Real-time ticker displaying progressive scan steps (`«Initializing Secure Scanner...»`, `«Connecting to VirusTotal...»`, `«Checking Security Vendors...»`, etc.).
- **🎯 Dynamic Threat Gauge (0–100)**: Animated circular SVG gauge color-coded by severity (Excellent / Good / Medium / High / Critical).
- **🛡️ 4-Tier Overall Verdict**: Clear status designation (🟢 `SAFE`, 🟡 `SUSPICIOUS`, 🔴 `MALICIOUS`, ⚪ `UNKNOWN`).
- **🚩 Detected Threat Indicators**: Highlights URL shorteners (bit.ly, tinyurl, etc.), unencrypted HTTP, negative reputation scores, redirect chains, and vendor blacklist flags.
- **🧠 Deterministic Security Intelligence**: Rule-based threat assessment, risk explanation, attack scenarios, and business/user impact derived strictly from telemetry (no fake AI claims).
- **📋 Dynamic Security Vendor Analysis**: Dynamically renders **every** vendor returned by VirusTotal (Google Safe Browsing, Kaspersky, Microsoft, Fortinet, Sophos, etc.) with search filtering and category tabs.
- **📊 Visual Analytics (Recharts)**: Interactive donut charts for vendor distribution and bar charts for category comparisons.
- **📄 Enterprise Multi-Page PDF Reports**: Backend-generated publication-ready security report created with PDFKit, complete with cover banner, threat gauge, vendor tables, and audit footers.
- **📜 Scan History & Reports Archive**: Local persistence allowing operators to search, filter, re-inspect previous scans, and export PDFs anytime.

---

## 🎨 Visual Identity & Design Philosophy

LinkShield follows a **Dark Futuristic SOC Dashboard** aesthetic:
- **Palette**: Deep Cyber Navy (`#030712`, `#060C1D`), Electric Cyan (`#00F5D4`), Neon Blue (`#3B82F6`), with status-driven accents:
  - 🟢 **Neon Green** (`#10B981`) = Safe
  - 🟡 **Amber Yellow** (`#F59E0B`) = Suspicious / Medium Risk
  - 🟠 **Vibrant Orange** (`#F97316`) = High Risk
  - 🔴 **Crimson Red** (`#EF4444`) = Malicious / Critical Risk
- **Glassmorphism**: Translucent backdrop blur panels with cyber corner accents and subtle cyan neon borders.
- **Animated Cyber Background**: Canvas-rendered drifting nodes, responsive connection mesh, moving cyber grid, and digital scanlines.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (v18)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **Motion & Interaction**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Visual Analytics**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js
- **Security & Headers**: Helmet & CORS
- **Rate Limiting**: Express Rate Limit
- **HTTP Client**: Axios
- **PDF Generation**: PDFKit
- **Environment**: Dotenv

---

## 🏗️ Architecture & Workflow

```
[ Operator Enters URL ]
          │
          ▼
[ Frontend Validation ] ──(Reject malformed/javascript:/data: schemes)
          │
          ▼  POST /api/scan
[ Express Backend Gateway ] ──(Check API Key & In-Memory Cache)
          │
          ▼  POST /api/v3/urls
[ VirusTotal API v3 ]
          │
          ▼  Poll GET /api/v3/analyses/{id}
[ Complete Analysis Retrieval ]
          │
          ▼  GET /api/v3/urls/{base64_id}
[ Enriched URL Resource (WHOIS, HTTP, Redirects) ]
          │
          ▼
[ Normalizer & Threat Score Engine (0-100) ]
          │
          ▼
[ Security Intelligence & Recommendations Generator ]
          │
          ▼  JSON Payload
[ React SOC Dashboard ] ──(Radar Animation ➜ Verdict ➜ Vendor Cards ➜ Charts)
          │
          ▼  GET /api/report/:id/pdf
[ PDFKit Enterprise SOC Report Generator ] ──(Download .pdf)
```

---

## 📁 Folder Structure

```
Linkshield/
├── backend/
│   ├── .env.example              # Sample environment template
│   ├── .gitignore                # Node and secret exclusions
│   ├── package.json              # Backend dependencies & scripts
│   └── src/
│       ├── app.js                # Express app setup, middleware, routes
│       ├── server.js             # HTTP server bootstrap & port listener
│       ├── config/
│       │   └── env.js            # Environment config & API key validation
│       ├── controllers/
│       │   ├── scanController.js # Submission, polling, normalized scans
│       │   └── reportController.js # PDF report streaming & generation
│       ├── middleware/
│       │   ├── errorHandler.js   # Production error handler (no leak)
│       │   └── rateLimiter.js    # IP rate limiter
│       ├── routes/
│       │   ├── healthRoutes.js   # Health check (GET /api/health)
│       │   ├── scanRoutes.js     # Scan endpoints (POST /api/scan)
│       │   └── reportRoutes.js   # PDF endpoints (GET/POST /api/report/pdf)
│       ├── services/
│       │   ├── virustotalService.js # VirusTotal v3 submission & polling
│       │   ├── normalizerService.js # Telemetry parser & threat scoring
│       │   ├── intelligenceService.js # Rule-based security insights
│       │   └── pdfService.js     # PDFKit multi-page report generator
│       ├── utils/
│       │   ├── cache.js          # In-memory scan cache
│       │   └── logger.js         # Structured SOC console logger
│       └── validators/
│           └── urlValidator.js   # Strict URL scheme validator
├── frontend/
│   ├── index.html                # HTML5 root with SEO metadata
│   ├── package.json              # Frontend dependencies
│   ├── postcss.config.js         # PostCSS config
│   ├── tailwind.config.js        # Cyber color tokens & keyframes
│   ├── vite.config.js            # Vite config with API proxy
│   └── src/
│       ├── main.jsx              # React DOM entry
│       ├── App.jsx               # Layout, theme, tabs orchestration
│       ├── index.css             # Cyber scrollbars, glows, scanlines
│       ├── api/
│       │   └── client.js         # Axios client with error handlers
│       ├── components/
│       │   ├── common/           # CyberBackground, Navbar, Sidebar, Toast, GlassCard
│       │   ├── scanner/          # URLScanner, RadarScanner, TerminalLogs, ProgressBar
│       │   ├── dashboard/        # ThreatGauge, VerdictCard, ThreatIndicators, URLDetails, etc.
│       │   ├── vendors/          # VendorAnalysis, VendorCard
│       │   ├── charts/           # SecurityCharts (Recharts Pie & Bar)
│       │   ├── reports/          # PDFButton
│       │   └── states/           # EmptyState, ErrorState
│       ├── hooks/                # useScan, useScanHistory
│       ├── pages/                # HomePage, ScanHistoryPage, ReportsPage, SettingsPage, AboutPage
│       └── utils/                # formatters, clipboard
├── package.json                  # Root runner script
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v24)
- **npm**: `v9.0.0` or higher
- A **VirusTotal API v3 Key** (free tier available at [virustotal.com](https://www.virustotal.com/gui/join-us))

---

## 🔑 Environment Configuration

LinkShield isolates your VirusTotal API key on the backend to guarantee zero exposure to client browsers.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` and paste your VirusTotal API key:
   ```env
   VIRUSTOTAL_API_KEY=your_actual_virustotal_api_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

> [!NOTE]
> If `VIRUSTOTAL_API_KEY` is not configured, LinkShield safely alerts the operator:
> *"VirusTotal API key not configured. Please add your API key in the .env file."*

---

## 🚀 Running the Application

You can run LinkShield using separate terminals for Backend and Frontend.

### Terminal 1: Backend Server

```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Terminal 2: Frontend Client

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📄 PDF Security Report Generation

LinkShield contains a built-in enterprise PDF generator built on **PDFKit**:
- **Cover Header**: LinkShield brand badge, target URL, and generation timestamp.
- **Threat Metric Cards**: Visual threat score bar, overall verdict pill, and vendor detection breakdown.
- **Executive Summary**: Comprehensive threat analysis and risk explanation.
- **Technical Specs**: Resolved domain, IP, protocol (HTTPS/HTTP), response code, and redirect hops.
- **Vendor Findings**: Table of flagged engines, categories, and detection results.
- **Security Directives**: Step-by-step mitigation actions.
- **Audit Footer**: Automatic page numbering (`Page X of Y`) and confidentiality notices.

---

## 🔒 Security & Architecture Standards

- **Zero Sensitive Exposure**: No API key is ever baked into frontend JavaScript bundles or sent in network payloads.
- **Input Sanitization**: Rejects dangerous schemes (`javascript:`, `data:`, `file:`, `ftp:`) before querying external APIs.
- **Hardened HTTP Headers**: Helmet protects the Express backend with security headers.
- **Rate Limiting**: IP-based rate limiting defends against denial-of-service and abuse.
- **Fail-Safe Data Handling**: Safe optional chaining ensures missing VirusTotal fields never crash the dashboard.

---

## ⏱️ API Rate Limits & Caching

The VirusTotal public API allows **4 requests per minute**. To ensure smooth operation during presentations and hackathons:
- LinkShield utilizes an intelligent **in-memory cache** with TTL for recent scan results.
- Duplicate scans within the TTL window resolve instantly without consuming API credits.
- An optional `forceRefresh` toggle allows operators to bypass cache when fresh telemetry is needed.

---

## 📸 Screenshots

*(Add visual assets to `/screenshots/`)*

- **Home Screen & Scanner**: `/screenshots/home.png`
- **Cyber Radar Scanning & Terminal**: `/screenshots/scanning.png`
- **SOC Threat Dashboard & Charts**: `/screenshots/results.png`
- **Enterprise PDF Report**: `/screenshots/report.png`

---

## 🔮 Future Improvements

- Custom corporate webhook alerts (Slack / Microsoft Teams / Discord) upon malicious link detection.
- Export scan telemetry to STIX/TAXII threat intelligence formats.
- Offline cached threat definitions for disconnected enterprise air-gapped demo environments.

---

<p align="center">
  <b>LINKSHIELD</b> • Scan Smart. Click Safe. • Enterprise Threat Intelligence
</p>
