# AU JRC Gate Security & Student Verification System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.x-blue)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue)](https://www.docker.com/)

A secure, data-privacy compliant Web Progressive Web App (PWA) built for security staff at **Arellano University – Jose Rizal Campus (AU JRC)** to scan student ID QR codes, verify enrollment status, check disciplinary flags, and maintain immutable entry logs with full offline caching capabilities.

---

## Table of Contents
1. [Project Overview & Goals](#1-project-overview--goals)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Directory Structure](#3-directory-structure)
4. [Setup & Prerequisites](#4-setup--prerequisites)
5. [Build, Test, and Run Instructions](#5-build-test-and-run-instructions)
6. [Deployment & Environment Variables](#6-deployment--environment-variables)
7. [Key Modules & Responsibilities](#7-key-modules--responsibilities)
8. [Architecture & Data Flow](#8-architecture--data-flow)
9. [Data Models & API Contracts](#9-data-models--api-contracts)
10. [Security, Compliance & Performance](#10-security-compliance--performance)
11. [Troubleshooting & Common Workflows](#11-troubleshooting--common-workflows)
12. [Contribution Guidelines](#12-contribution-guidelines)

---

## 1. Project Overview & Goals

The primary goal of this application is to modernize and secure physical entry points at **Arellano University – Jose Rizal Campus (AU JRC)** in Malabon.

### Key Objectives
* **Instant ID Verification:** Fast camera-based QR code reading for gate entry.
* **Data Privacy Compliance:** Full alignment with Republic Act No. 10173 (Data Privacy Act of 2012 / NPC guidelines) through strict data minimization.
* **Offline Resilience:** Uninterrupted gate entry logging during Wi-Fi or network dropouts using browser-side encrypted storage (`IndexedDB`) and automatic background synchronization.
* **Audit Trail Accountability:** Immutable event logs tracking guard actions, timestamps, and active disciplinary flags.

---

## 2. Tech Stack & Tooling

### Frontend (`/client`)
* **React 18 & Vite:** Ultra-fast UI component framework and bundler.
* **`html5-qrcode`:** Cross-platform web browser camera integration for instant barcode/QR decoding.
* **`idb` (IndexedDB Wrapper):** Browser-native transactional database for client-side offline log persistence.

### Backend (`/server`)
* **Node.js & Express:** Lightweight, high-throughput REST API backend framework.
* **`jsonwebtoken` (JWT):** Token-based authentication for guard devices and admin sessions.
* **`pg` (PostgreSQL Client):** Connection pooling and parameterized query driver for safe database operations.

### Database & Operations
* **PostgreSQL 15:** Relational database storing student indexes, violation histories, and entry logs.
* **Docker & Docker Compose:** Containerization orchestrator for identical development, testing, and production environments.

---

## 3. Directory Structure

```text
au-jrc-gate-app/
├── db/                        # Database scripts & migrations
│   ├── migrations/            # Version-controlled SQL schema definitions
│   │   ├── 01_students_table.sql
│   │   ├── 02_entry_logs.sql
│   │   ├── 03_violations_table.sql
│   │   └── 04_security_audit_logs.sql
│   └── seed.sql               # Mock student and violation datasets
├── server/                    # Node.js Express REST API backend
│   ├── config/                # Database pool connection setup
│   │   └── db.js
│   ├── middleware/            # Security & Role-Based Access Control (RBAC)
│   │   └── auth.js
│   ├── routes/                # API endpoints
│   │   └── scan.js
│   ├── .env                   # Local server configuration secrets
│   ├── .env.example           # Environment template for server keys
│   ├── package.json           # Backend npm dependencies
│   └── server.js              # Express app entrypoint
├── client/                    # React frontend Progressive Web App
│   ├── public/                # Static assets & web manifest
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/        # Camera & scanner UI components
│   │   │   └── QRScanner.jsx
│   │   ├── utils/             # Client-side IndexedDB helper routines
│   │   │   └── offlineDb.js
│   │   ├── App.jsx            # Parent UI wrapper
│   │   ├── index.css
│   │   └── main.jsx           # React DOM root entry point
│   ├── index.html             # React app entry point
│   ├── package.json           # Frontend npm dependencies
│   └── vite.config.js         # Vite development server & proxy setup
├── docker-compose.yml         # Container configuration file
└── README.md                  # Comprehensive project documentation


4. Setup & Prerequisites
Prerequisites

- Node.js: v18.x LTS or higher installed.
- Docker Desktop: Installed and running (Recommended).
- Or local PostgreSQL 15 if running without Docker containers.

5. Build, Test, and Run Instructions
Option A: Running with Docker (Recommended)
1. Open your terminal in the project root directory (au-jrc-gate-app).
2. Run Docker Compose:

Bash
docker compose up --build

3. Access services:

- Frontend Web App: http://localhost:3000
- Backend Health Check: http://localhost:5000/health

Option B: Running Locally (Without Docker)
1. Setup Database
Ensure PostgreSQL is active locally, then execute the migration files in order:

psql -U postgres -c "CREATE DATABASE au_jrc_gate;"
psql -U postgres -d au_jrc_gate -f db/migrations/01_students_table.sql
psql -U postgres -d au_jrc_gate -f db/migrations/02_entry_logs.sql
psql -U postgres -d au_jrc_gate -f db/migrations/03_violations_table.sql
psql -U postgres -d au_jrc_gate -f db/migrations/04_security_audit_logs.sql
psql -U postgres -d au_jrc_gate -f db/seed.sql

2. Start Backend API Server

cd server
npm install
npm run dev

3. Start Frontend App
In a new terminal tab:

cd client
npm install
npm run dev

6. Deployment & Environment Variables
Copy server/.env.example to server/.env and update the properties:

Variable           Description                           Example / Default Value

PORT               Node server listening port            5000
--------------
DATABASE_URL       PostgreSQL connection string   postgres://au_admin:secure_au_password_2026@localhost:5432/au_jrc_gate
--------------
JWT_SECRET         Secret key for signing guard tokens  au_jrc_super_secret_jwt_key_2026

Note: When running inside Docker containers, replace localhost in DATABASE_URL with the Docker service name (postgres).

7. Key Modules & Responsibilities

- server/middleware/auth.js: Enforces Role-Based Access Control (RBAC). Validates incoming JWT bearer tokens and rejects unauthorized requests

- server/routes/scan.js:
   - POST /verify: Evaluates student status (ACTIVE, SUSPENDED) and flags. Writes log entries inside transactional database blocks.
   - POST /sync: Receives arrays of pending logs saved locally by guard devices during network dropouts and flushes them to the server database.

- client/src/utils/offlineDb.js: Interacts with the browser's IndexedDB API for seamless queuing of scan logs when offline.
- client/src/components/QRScanner.jsx: Manages device video streams, renders feedback banners (Green = Allowed, Red = Flagged, Orange = Cached Offline), and handles network online/offline transitions.

8. Architecture & Data Flow

Online Scan Sequence
Guard Camera ---> Decodes QR Payload 
             ---> Sends POST /api/v1/scan/verify
             ---> Server queries Database (students & violations)
             ---> Server records immutable Entry Log & Audit Log
             ---> Returns ALLOWED or DENIED status back to Guard UI

Offline Scan & Re-Sync Sequence
Guard Camera ---> Decodes QR Payload 
             ---> Network Check: Offline
             ---> Saves log object into Client IndexedDB
             ---> Network Restored (Event listener triggered)
             ---> Reads queued logs from IndexedDB
             ---> Sends POST /api/v1/scan/sync to Server
             ---> Client clears IndexedDB queue upon 200 OK response

9. Data Models & API Contracts

Sample Verification Request (POST /api/v1/scan/verify)

{
  "student_id": "AU2026-JRC-0123",
  "gate_location": "Gov. Pascual Ave Gate 1",
  "scanned_at": "2026-08-19T08:30:00.000Z"
}

Sample Verification Response (200 OK)

{
  "status": "SUCCESS",
  "access": "ALLOWED",
  "student": {
    "student_id": "AU2026-JRC-0123",
    "full_name": "Juan Dela Cruz",
    "program": "BS Information Technology",
    "status": "ACTIVE"
  }
}

10. Security, Compliance & Performance

1. RA 10173 (Data Privacy Act) Compliance: Only necessary student verification metrics are returned. Sensitive personal records (address, phone numbers, family details) are completely excluded from API responses.
2. SQL Injection Mitigation: All database queries use strict parameterized placeholders ($1, $2).
3. Data Protection in Transit: TLS 1.3 encryption is enforced for production HTTP traffic.
4. Offline Resilience: IndexedDB caching ensures zero log data loss during network interruptions.

11. Troubleshooting & Common Workflows

- Issue: Scanner area displays a blank box or access error.
- Fix: Click the lock icon in the browser address bar $\rightarrow$ select Allow Camera access $\rightarrow$ refresh page. (Browsers require HTTPS or localhost to enable camera features).

Database Connection Error

- Issue: Server console logs ECONNREFUSED 127.0.0.1:5432.
- Fix: Verify PostgreSQL service is active or that your Docker container (au_jrc_db) is healthy via docker ps.

12. Contribution Guidelines

1. Branch Naming: Use feature-based names (feature/add-guard-logout, fix/scanner).
2. Commit Style: Write descriptive commit messages referencing affected modules.
3. SQL Migrations: Do not modify existing .sql files directly; append a new sequential migration script (e.g., 05_add_gate_column.sql) inside db/migrations/.