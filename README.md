# 🛡️ RBAC & User Management System

A robust, production-ready Role-Based Access Control (RBAC) application demonstrating secure authentication and modern full-stack architecture.

## 🚀 Quick Start

```bash
docker-compose up
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## 🛠️ Tech Stack & Architecture

* **Backend:** NestJS, PostgreSQL, TypeORM.
* **Frontend:** Vue 3 (Composition API), TSX, Emotion CSS.
* **Auth:** JWT-based Secure Cookies (`httpOnly`, `SameSite: Lax`).
* **Authorization:** Strict server-side `PermissionsGuard` paired with a permission-aware UI.
