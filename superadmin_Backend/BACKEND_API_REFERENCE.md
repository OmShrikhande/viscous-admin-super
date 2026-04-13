# Viscous Super Admin — Backend API Reference

> **Complete API specification for the Super Admin Dashboard backend.**
> Covers all endpoints from authentication to audit logs — **57 API endpoints** across **9 modules**.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack & Project Structure](#2-tech-stack--project-structure)
3. [Authentication & Middleware](#3-authentication--middleware)
4. [API Modules](#4-api-modules)
   - [4.1 Auth (2 endpoints)](#41-auth-module)
   - [4.2 Dashboard (4 endpoints)](#42-dashboard-module)
   - [4.3 Colleges (7 endpoints)](#43-colleges-module)
   - [4.4 Controllers/Admins (10 endpoints)](#44-controllersadmins-module)
   - [4.5 Users (4 endpoints)](#45-users-module)
   - [4.6 Billing — Plans (5 endpoints)](#46-billing--plans-module)
   - [4.7 Billing — Invoices (6 endpoints)](#47-billing--invoices-module)
   - [4.8 Reports (6 endpoints)](#48-reports--analytics-module)
   - [4.9 Settings (5 endpoints)](#49-settings-module)
   - [4.10 Logs/Audit (4 endpoints)](#410-logsaudit-module)
   - [4.11 Notifications (4 endpoints)](#411-notifications-module)
5. [Database Schema Overview](#5-database-schema-overview)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting & Security](#7-rate-limiting--security)

---

## 1. Architecture Overview

```
Client (React SPA)
    │
    ▼
API Gateway / Reverse Proxy (Nginx)
    │
    ▼
Node.js + Express.js Server
    │
    ├── Middleware Layer (auth, validation, rate-limit, logging)
    ├── Route Layer (route definitions per module)
    ├── Controller Layer (request/response handling)
    ├── Service Layer (business logic)
    ├── Repository/Model Layer (database queries)
    │
    ▼
Database: MongoDB (Mongoose ODM)  OR  PostgreSQL (Prisma/Sequelize)
    │
    ▼
Redis (session cache, rate limiting, token blacklist)
```

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **REST conventions** | Proper HTTP verbs (GET/POST/PUT/PATCH/DELETE), plural resource names, consistent URL patterns |
| **Stateless auth** | JWT access + refresh tokens, no server-side sessions |
| **Pagination** | Cursor-based or offset-based with `page`, `limit`, `total` in all list endpoints |
| **Filtering & Sorting** | Query params: `?status=active&sortBy=createdAt&order=desc` |
| **Validation** | Request body validation via Joi/Zod on every mutating endpoint |
| **Audit trail** | Every CUD operation writes to the `audit_logs` collection/table |
| **Soft deletes** | Colleges, admins use `deletedAt` field; permanent delete is a separate explicit action |
| **Response envelope** | All responses follow `{ success, message, data, meta }` structure |

---

## 2. Tech Stack & Project Structure

### Recommended Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 20+ | Server runtime |
| Framework | Express.js 4.x | HTTP framework |
| Database | MongoDB + Mongoose | Primary data store |
| Cache | Redis | Token blacklist, rate limiting, sessions |
| Auth | jsonwebtoken, bcryptjs | JWT auth, password hashing |
| Validation | Joi or Zod | Request validation schemas |
| File Storage | Multer + AWS S3 / local | Invoice PDFs, exports |
| Email | Nodemailer / SendGrid | Admin notifications |
| Logging | Winston + Morgan | Application + HTTP logging |
| Testing | Jest + Supertest | Unit + integration tests |

### Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   ├── redis.js              # Redis client
│   │   ├── env.js                # Environment variables
│   │   └── cors.js               # CORS configuration
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT verification, role check
│   │   ├── validate.js           # Request validation wrapper
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── auditLogger.js        # Auto-log CUD operations
│   │   └── asyncHandler.js       # Async/await error wrapper
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── college.routes.js
│   │   ├── admin.routes.js
│   │   ├── user.routes.js
│   │   ├── plan.routes.js
│   │   ├── invoice.routes.js
│   │   ├── report.routes.js
│   │   ├── setting.routes.js
│   │   ├── log.routes.js
│   │   └── notification.routes.js
│   │
│   ├── controllers/              # One controller per route file
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── college.controller.js
│   │   ├── admin.controller.js
│   │   ├── user.controller.js
│   │   ├── plan.controller.js
│   │   ├── invoice.controller.js
│   │   ├── report.controller.js
│   │   ├── setting.controller.js
│   │   ├── log.controller.js
│   │   └── notification.controller.js
│   │
│   ├── services/                 # Business logic layer
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── college.service.js
│   │   ├── admin.service.js
│   │   ├── user.service.js
│   │   ├── plan.service.js
│   │   ├── invoice.service.js
│   │   ├── report.service.js
│   │   ├── setting.service.js
│   │   ├── log.service.js
│   │   └── notification.service.js
│   │
│   ├── models/                   # Mongoose schemas / Prisma models
│   │   ├── SuperAdmin.js
│   │   ├── College.js
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Plan.js
│   │   ├── Invoice.js
│   │   ├── Setting.js
│   │   ├── AuditLog.js
│   │   └── Notification.js
│   │
│   ├── validators/               # Joi/Zod schemas per module
│   │   ├── auth.validator.js
│   │   ├── college.validator.js
│   │   ├── admin.validator.js
│   │   ├── plan.validator.js
│   │   ├── invoice.validator.js
│   │   └── setting.validator.js
│   │
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── ApiResponse.js        # Standard response builder
│   │   ├── tokenUtils.js         # JWT sign/verify helpers
│   │   ├── pdfGenerator.js       # Invoice PDF generation
│   │   ├── csvExporter.js        # Report CSV/Excel export
│   │   └── constants.js          # Shared constants
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 3. Authentication & Middleware

### JWT Token Strategy

| Token | Purpose | Expiry | Storage |
|-------|---------|--------|---------|
| **Access Token** | API authorization | 15 minutes | Memory / HttpOnly cookie |
| **Refresh Token** | Renew access token | 7 days | HttpOnly cookie + DB |

### Auth Middleware Pipeline

```
Request → rateLimiter → authenticate → authorize('super_admin') → validate(schema) → controller
```

### Standard Response Envelope

Every API returns this structure:

```json
{
  "success": true,
  "message": "Colleges fetched successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email is required" }
  ],
  "statusCode": 400
}
```

---

## 4. API Modules

> **Base URL:** `{{BASE_URL}}/api/v1`
>
> **Auth Header:** `Authorization: Bearer <access_token>` (on all endpoints except login)

---

### 4.1 Auth Module

> **No signup or reset password** — Super admin accounts are pre-seeded in the database.

#### `POST /api/v1/auth/login`

Authenticates the super admin and returns JWT tokens.

| Field | Details |
|-------|---------|
| **Method** | `POST` |
| **Auth** | None |
| **Rate Limit** | 5 requests / 15 min per IP |

**Request Body:**

```json
{
  "email": "admin@viscous.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `email` — required, valid email format
- `password` — required, min 6 characters

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Super Admin",
      "email": "admin@viscous.com",
      "role": "super_admin",
      "avatar": "https://storage.example.com/avatars/admin.png",
      "lastLogin": "2026-03-27T22:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `401` — Invalid email or password
- `423` — Account locked (too many failed attempts)
- `429` — Rate limit exceeded

**Backend Logic:**
1. Find super admin by email
2. Compare bcrypt-hashed password
3. Update `lastLogin` timestamp
4. Generate access + refresh tokens
5. Log `SUPER_ADMIN_LOGIN` to audit log
6. Set refresh token as HttpOnly cookie

---

#### `POST /api/v1/auth/logout`

Invalidates the current session and blacklists the refresh token.

| Field | Details |
|-------|---------|
| **Method** | `POST` |
| **Auth** | Required |

**Request Body:** None (reads token from cookie/header)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Backend Logic:**
1. Extract refresh token from cookie
2. Add refresh token to Redis blacklist (TTL = token expiry)
3. Clear HttpOnly cookie
4. Log `SUPER_ADMIN_LOGOUT` to audit log

---

### 4.2 Dashboard Module

#### `GET /api/v1/dashboard/metrics`

Returns all key system-wide metrics for the dashboard cards.

| Field | Details |
|-------|---------|
| **Method** | `GET` |
| **Auth** | Required |
| **Cache** | Redis, 60 seconds TTL |

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalColleges": 48,
    "activeColleges": 38,
    "inactiveColleges": 10,
    "totalAdmins": 142,
    "activeAdmins": 124,
    "inactiveAdmins": 18,
    "totalBuses": 312,
    "activeBuses": 289,
    "totalUsers": 8420,
    "activeUsers": 7650,
    "systemHealth": {
      "score": 98.7,
      "status": "healthy",
      "cpuUsage": 42.3,
      "memoryUsage": 67.8,
      "diskUsage": 34.5,
      "uptime": "45d 12h 30m"
    },
    "trends": {
      "collegeGrowth": "+6.7%",
      "adminGrowth": "+4.2%",
      "userGrowth": "+12.5%",
      "busGrowth": "+8.3%"
    }
  }
}
```

---

#### `GET /api/v1/dashboard/growth`

Returns time-series growth data for charts.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | `7months` | `7days`, `30days`, `7months`, `12months` |
| `metrics` | string | `all` | Comma-separated: `colleges,users,admins,buses` |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    { "date": "2026-01", "colleges": 35, "users": 5200, "admins": 98, "buses": 240 },
    { "date": "2026-02", "colleges": 37, "users": 5800, "admins": 102, "buses": 258 },
    { "date": "2026-03", "colleges": 48, "users": 8420, "admins": 124, "buses": 312 }
  ]
}
```

---

#### `GET /api/v1/dashboard/recent-activity`

Returns recent system-wide actions.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | `10` | Max items to return (1–50) |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "log_001",
      "action": "New college registered",
      "target": "IIT Delhi",
      "targetType": "college",
      "actor": "System",
      "type": "create",
      "timestamp": "2026-03-27T22:30:00Z"
    }
  ]
}
```

---

#### `GET /api/v1/dashboard/alerts`

Returns active system alerts/warnings.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `severity` | string | `all` | `error`, `warning`, `info`, `success` |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "alert_001",
      "severity": "error",
      "message": "3 colleges have expired plans",
      "category": "billing",
      "createdAt": "2026-03-27T23:50:00Z",
      "isRead": false,
      "actionUrl": "/billing?status=expired"
    }
  ]
}
```

---

### 4.3 Colleges Module

#### `GET /api/v1/colleges`

List all colleges with pagination, search, sorting, and filters.

| Field | Details |
|-------|---------|
| **Method** | `GET` |
| **Auth** | Required |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max 100) |
| `search` | string | — | Search by name, code, city |
| `status` | string | — | `active`, `inactive`, `suspended` |
| `plan` | string | — | `Basic`, `Professional`, `Enterprise` |
| `state` | string | — | Filter by state |
| `sortBy` | string | `createdAt` | `name`, `city`, `status`, `buses`, `users`, `createdAt` |
| `order` | string | `desc` | `asc` or `desc` |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Colleges fetched successfully",
  "data": [
    {
      "id": "col_001",
      "name": "IIT Delhi",
      "code": "IITD",
      "city": "New Delhi",
      "state": "Delhi",
      "address": "Hauz Khas, New Delhi 110016",
      "contactEmail": "admin@iitd.ac.in",
      "contactPhone": "+91-9876543210",
      "status": "active",
      "plan": {
        "id": "plan_003",
        "name": "Enterprise"
      },
      "stats": {
        "buses": 24,
        "controllers": 5,
        "users": 480
      },
      "createdAt": "2024-06-15T00:00:00Z",
      "updatedAt": "2026-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "totalPages": 5
  }
}
```

---

#### `GET /api/v1/colleges/:id`

Get detailed information for a single college including assigned controllers, buses, and plan.

**URL Params:** `id` — College ID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "col_001",
    "name": "IIT Delhi",
    "code": "IITD",
    "city": "New Delhi",
    "state": "Delhi",
    "address": "Hauz Khas, New Delhi 110016",
    "contactEmail": "admin@iitd.ac.in",
    "contactPhone": "+91-9876543210",
    "website": "https://iitd.ac.in",
    "status": "active",
    "plan": {
      "id": "plan_003",
      "name": "Enterprise",
      "price": 49999,
      "expiresAt": "2026-04-15T00:00:00Z",
      "maxBuses": 200,
      "maxUsers": 5000,
      "maxControllers": 20
    },
    "stats": {
      "totalBuses": 24,
      "activeBuses": 22,
      "totalControllers": 5,
      "activeControllers": 5,
      "totalUsers": 480,
      "activeUsers": 465
    },
    "controllers": [
      {
        "id": "adm_001",
        "name": "Rajesh Kumar",
        "email": "rajesh@iitd.ac.in",
        "role": "admin",
        "status": "active",
        "lastLogin": "2026-03-27T15:30:00Z"
      }
    ],
    "billingHistory": [
      {
        "invoiceId": "INV-2026-001",
        "amount": 49999,
        "status": "paid",
        "date": "2026-03-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-06-15T00:00:00Z",
    "updatedAt": "2026-03-20T10:00:00Z"
  }
}
```

**Error:** `404` — College not found

---

#### `POST /api/v1/colleges`

Create a new college.

**Request Body:**

```json
{
  "name": "Christ University",
  "code": "CU",
  "city": "Bangalore",
  "state": "Karnataka",
  "address": "Hosur Road, Bangalore 560029",
  "contactEmail": "admin@christuniversity.in",
  "contactPhone": "+91-9876543211",
  "website": "https://christuniversity.in",
  "planId": "plan_002",
  "status": "active"
}
```

**Validation Rules:**
- `name` — required, string, 2–200 chars, unique
- `code` — required, string, 2–10 chars, alphanumeric, unique
- `city` — required, string
- `state` — required, string
- `contactEmail` — required, valid email
- `planId` — required, must reference existing plan

**Success Response (201):**

```json
{
  "success": true,
  "message": "College created successfully",
  "data": { "id": "col_011", "name": "Christ University", "...": "..." }
}
```

**Backend Logic:**
1. Validate request body
2. Check unique constraints (name, code)
3. Verify `planId` exists
4. Create college record
5. Log `COLLEGE_CREATED` to audit log
6. Return created record

---

#### `PUT /api/v1/colleges/:id`

Update an existing college.

**Request Body:** Same fields as POST (all optional for partial update)

**Success Response (200):**

```json
{
  "success": true,
  "message": "College updated successfully",
  "data": { "id": "col_001", "...": "..." }
}
```

**Backend Logic:**
1. Validate body + check college exists
2. If `code` or `name` changed, check uniqueness
3. Update record, set `updatedAt`
4. Log `COLLEGE_UPDATED` to audit log with diff of changed fields

---

#### `PATCH /api/v1/colleges/:id/status`

Change college status (activate/deactivate/suspend).

**Request Body:**

```json
{
  "status": "suspended",
  "reason": "Non-payment of dues"
}
```

**Validation:** `status` must be one of `active`, `inactive`, `suspended`

**Success Response (200):**

```json
{
  "success": true,
  "message": "College status updated to suspended"
}
```

**Backend Logic:**
1. Update college status
2. If `suspended` → deactivate all controllers for that college
3. Log `COLLEGE_STATUS_CHANGED` with reason

---

#### `DELETE /api/v1/colleges/:id`

Soft-delete a college (sets `deletedAt`).

**Success Response (200):**

```json
{
  "success": true,
  "message": "College deleted successfully"
}
```

**Backend Logic:**
1. Set `deletedAt = now()`, `status = 'deleted'`
2. Deactivate all associated admins/controllers
3. Cancel active invoices
4. Log `COLLEGE_DELETED` to audit log

---

#### `GET /api/v1/colleges/:id/stats`

Get detailed statistics for a specific college.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "usersByRole": { "student": 420, "faculty": 35, "driver": 20, "staff": 5 },
    "busUtilization": 91.7,
    "activeRoutes": 18,
    "avgDailyTrips": 42,
    "lastMonthGrowth": "+5.2%"
  }
}
```

---

### 4.4 Controllers/Admins Module

> This module provides **full lifecycle control** over admins and controllers.

#### `GET /api/v1/admins`

List all admins/controllers with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `search` | string | — | Search by name, email |
| `status` | string | — | `active`, `inactive`, `suspended`, `revoked` |
| `role` | string | — | `admin`, `controller` |
| `collegeId` | string | — | Filter by college |
| `sortBy` | string | `createdAt` | `name`, `email`, `role`, `status`, `lastLogin`, `createdAt` |
| `order` | string | `desc` | `asc` or `desc` |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "adm_001",
      "name": "Rajesh Kumar",
      "email": "rajesh@iitd.ac.in",
      "role": "admin",
      "college": { "id": "col_001", "name": "IIT Delhi" },
      "status": "active",
      "permissions": ["manage_buses", "manage_users", "view_reports"],
      "lastLogin": "2026-03-27T15:30:00Z",
      "createdAt": "2024-06-15T00:00:00Z",
      "createdBy": "Super Admin"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 142, "totalPages": 15 }
}
```

---

#### `GET /api/v1/admins/:id`

Get detailed admin profile including permissions and audit history.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "adm_001",
    "name": "Rajesh Kumar",
    "email": "rajesh@iitd.ac.in",
    "phone": "+91-9876543210",
    "role": "admin",
    "college": { "id": "col_001", "name": "IIT Delhi" },
    "status": "active",
    "permissions": ["manage_buses", "manage_users", "view_reports"],
    "lastLogin": "2026-03-27T15:30:00Z",
    "loginHistory": [
      { "ip": "192.168.1.1", "userAgent": "Chrome/120", "timestamp": "2026-03-27T15:30:00Z" }
    ],
    "auditTrail": [
      { "action": "Admin Created", "by": "Super Admin", "timestamp": "2024-06-15T00:00:00Z" },
      { "action": "Permissions Updated", "by": "Super Admin", "timestamp": "2025-01-10T00:00:00Z" }
    ],
    "createdAt": "2024-06-15T00:00:00Z",
    "updatedAt": "2026-03-20T10:00:00Z"
  }
}
```

---

#### `POST /api/v1/admins`

Create a new admin/controller.

**Request Body:**

```json
{
  "name": "Priya Sharma",
  "email": "priya@nitw.ac.in",
  "phone": "+91-9876543212",
  "password": "TempPass@123",
  "role": "controller",
  "collegeId": "col_002",
  "permissions": ["manage_buses", "view_reports"]
}
```

**Validation Rules:**
- `name` — required, 2–100 chars
- `email` — required, valid email, unique
- `password` — required, min 8 chars, at least 1 uppercase, 1 number, 1 special char
- `role` — required, enum: `admin`, `controller`
- `collegeId` — required, must reference existing college
- `permissions` — required array, each must be from allowed list: `manage_buses`, `manage_users`, `view_reports`, `manage_billing`, `manage_settings`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": { "id": "adm_009", "name": "Priya Sharma", "...": "..." }
}
```

**Backend Logic:**
1. Validate body
2. Check email uniqueness
3. Hash password with bcrypt (salt rounds: 12)
4. Verify college exists and is active
5. Create admin record
6. Send welcome email with temp credentials
7. Log `ADMIN_CREATED` to audit log

---

#### `PUT /api/v1/admins/:id`

Update admin details (name, phone, college, role).

**Request Body:** Same fields as POST (all optional except `email` cannot be changed)

**Success (200):** Updated admin object

**Backend Logic:**
1. Validate + update
2. If role changed, recalculate permissions
3. Log `ADMIN_UPDATED` with field diff

---

#### `PATCH /api/v1/admins/:id/permissions`

Update admin permissions only.

**Request Body:**

```json
{
  "permissions": ["manage_buses", "manage_users", "view_reports", "manage_billing"]
}
```

**Success (200):**

```json
{ "success": true, "message": "Permissions updated successfully" }
```

**Backend Logic:**
1. Validate permissions against allowed list
2. Update permissions
3. Log `ADMIN_PERMISSIONS_UPDATED` with old → new diff

---

#### `PATCH /api/v1/admins/:id/activate`

Reactivate a suspended/inactive admin.

**Request Body:**

```json
{
  "reason": "Review complete, access restored"
}
```

**Success (200):**

```json
{ "success": true, "message": "Admin activated successfully" }
```

**Backend Logic:**
1. Set `status = 'active'`
2. Clear any suspension flags
3. Log `ADMIN_ACTIVATED` with reason

---

#### `PATCH /api/v1/admins/:id/deactivate`

Temporarily suspend an admin (they cannot log in until reactivated).

**Request Body:**

```json
{
  "reason": "Under investigation for policy violation",
  "notifyUser": true
}
```

**Success (200):**

```json
{ "success": true, "message": "Admin deactivated successfully" }
```

**Backend Logic:**
1. Set `status = 'suspended'`, `suspendedAt = now()`
2. Do NOT invalidate existing tokens (they'll expire naturally  — or optionally blacklist)
3. Prevent future logins
4. Send notification email if `notifyUser = true`
5. Log `ADMIN_DEACTIVATED` with reason

---

#### `PATCH /api/v1/admins/:id/revoke`

**Immediately revoke access** — invalidates all active sessions and tokens.

**Request Body:**

```json
{
  "reason": "Security breach detected"
}
```

**Success (200):**

```json
{ "success": true, "message": "Admin access revoked — all sessions terminated" }
```

**Backend Logic:**
1. Set `status = 'revoked'`, `revokedAt = now()`
2. **Blacklist all refresh tokens** for this admin in Redis
3. **Increment token version** in DB (invalidates all access tokens)
4. Clear all active sessions
5. Send immediate notice email
6. Log `ADMIN_ACCESS_REVOKED` with reason and IP

> ⚠️ This is the most critical admin action — immediate effect with no grace period.

---

#### `DELETE /api/v1/admins/:id`

Permanently delete an admin account.

**Query Params:**
- `permanent=true` — required to confirm permanent deletion

**Request Body:**

```json
{
  "reason": "Account no longer needed",
  "confirmEmail": "rajesh@iitd.ac.in"
}
```

**Validation:** `confirmEmail` must match the admin's email (double confirmation)

**Success (200):**

```json
{ "success": true, "message": "Admin permanently deleted" }
```

**Backend Logic:**
1. Verify `permanent=true` and `confirmEmail` matches
2. Revoke all tokens first (same as revoke flow)
3. Hard-delete admin record (or `deletedAt = now()` for audit trail)
4. Remove from all college associations
5. Log `ADMIN_PERMANENTLY_DELETED` with full admin snapshot

---

#### `GET /api/v1/admins/:id/audit`

Get audit trail history for a specific admin.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page |
| `limit` | number | `20` | Items per page |

**Success (200):**

```json
{
  "success": true,
  "data": [
    { "action": "Admin Created", "actor": "Super Admin", "timestamp": "2024-06-15T00:00:00Z", "details": "..." },
    { "action": "Permissions Updated", "actor": "Super Admin", "timestamp": "2025-01-10T00:00:00Z", "details": "Added manage_billing" }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

---

### 4.5 Users Module

> Users are **read-only** from the super admin perspective — the super admin can view and filter but not create/edit users directly.

#### `GET /api/v1/users`

List all platform users with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page |
| `limit` | number | `10` | Items per page |
| `search` | string | — | Name, email |
| `role` | string | — | `student`, `faculty`, `driver`, `staff` |
| `collegeId` | string | — | Filter by college |
| `status` | string | — | `active`, `inactive`, `suspended` |
| `sortBy` | string | `createdAt` | `name`, `role`, `college`, `lastActive`, `createdAt` |
| `order` | string | `desc` | `asc` or `desc` |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "usr_001",
      "name": "Arjun Verma",
      "email": "arjun@iitd.ac.in",
      "role": "student",
      "college": { "id": "col_001", "name": "IIT Delhi" },
      "status": "active",
      "lastActive": "2026-03-27T18:00:00Z",
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 8420, "totalPages": 842 }
}
```

---

#### `GET /api/v1/users/:id`

Get individual user details (read-only).

**Success (200):** Full user profile object

---

#### `GET /api/v1/users/stats`

Get user statistics overview.

**Success (200):**

```json
{
  "success": true,
  "data": {
    "total": 8420,
    "byRole": { "student": 7200, "faculty": 650, "driver": 380, "staff": 190 },
    "byStatus": { "active": 7650, "inactive": 520, "suspended": 250 },
    "newThisMonth": 320,
    "activeToday": 4200
  }
}
```

---

#### `PATCH /api/v1/users/:id/status`

Optional — change user status from super admin level.

**Request Body:**

```json
{
  "status": "suspended",
  "reason": "Policy violation reported"
}
```

**Success (200):** `{ "success": true, "message": "User status updated" }`

---

### 4.6 Billing — Plans Module

#### `GET /api/v1/plans`

List all subscription plans.

**Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "plan_001",
      "name": "Basic",
      "price": 9999,
      "currency": "INR",
      "duration": 30,
      "durationUnit": "days",
      "maxBuses": 15,
      "maxUsers": 300,
      "maxControllers": 3,
      "features": ["GPS Tracking", "Basic Reports", "Email Support"],
      "status": "active",
      "collegesOnPlan": 12,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `GET /api/v1/plans/:id`

Get plan details with list of colleges subscribed.

---

#### `POST /api/v1/plans`

Create a new subscription plan.

**Request Body:**

```json
{
  "name": "Premium",
  "price": 34999,
  "currency": "INR",
  "duration": 30,
  "durationUnit": "days",
  "maxBuses": 100,
  "maxUsers": 2000,
  "maxControllers": 12,
  "features": ["GPS Tracking", "Advanced Reports", "Priority Support", "Custom Alerts", "API Access"],
  "status": "active"
}
```

**Validation:**
- `name` — required, unique, 2–100 chars
- `price` — required, number, min 0
- `duration` — required, number, min 1
- `maxBuses` — required, number, min 1
- `maxUsers` — required, number, min 1
- `maxControllers` — required, number, min 1
- `features` — optional array of strings

**Success (201):** Created plan object

---

#### `PUT /api/v1/plans/:id`

Update plan details.

> ⚠️ Price changes do NOT affect existing active subscriptions — only new assignments.

**Success (200):** Updated plan object

---

#### `DELETE /api/v1/plans/:id`

Soft-delete a plan (cannot delete if colleges are actively subscribed).

**Error (409):**

```json
{ "success": false, "message": "Cannot delete plan — 12 colleges are actively subscribed" }
```

---

### 4.7 Billing — Invoices Module

#### `GET /api/v1/invoices`

List all invoices with filters.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page |
| `limit` | number | `10` | Items per page |
| `status` | string | — | `active`, `pending`, `expired`, `paid`, `overdue` |
| `collegeId` | string | — | Filter by college |
| `planId` | string | — | Filter by plan |
| `dateFrom` | date | — | Issued after this date |
| `dateTo` | date | — | Issued before this date |
| `sortBy` | string | `issuedDate` | `college`, `amount`, `status`, `issuedDate`, `dueDate` |

**Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "INV-2026-001",
      "college": { "id": "col_001", "name": "IIT Delhi" },
      "plan": { "id": "plan_003", "name": "Enterprise" },
      "amount": 49999,
      "currency": "INR",
      "status": "paid",
      "issuedDate": "2026-03-01T00:00:00Z",
      "dueDate": "2026-03-31T00:00:00Z",
      "paidDate": "2026-03-05T00:00:00Z",
      "invoiceNumber": "INV-2026-001"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 }
}
```

---

#### `GET /api/v1/invoices/:id`

Get invoice details.

---

#### `POST /api/v1/invoices`

Generate a new invoice for a college.

**Request Body:**

```json
{
  "collegeId": "col_001",
  "planId": "plan_003",
  "amount": 49999,
  "issuedDate": "2026-04-01",
  "dueDate": "2026-04-30",
  "notes": "April subscription"
}
```

**Success (201):** Created invoice with auto-generated invoice number

**Backend Logic:**
1. Validate college + plan exist
2. Generate sequential invoice number `INV-YYYY-NNN`
3. Create invoice record
4. Log `INVOICE_GENERATED` to audit

---

#### `PATCH /api/v1/invoices/:id/status`

Update invoice status.

**Request Body:**

```json
{
  "status": "paid",
  "paidDate": "2026-03-05",
  "paymentReference": "TXN-12345"
}
```

**Success (200):** Updated invoice

---

#### `GET /api/v1/invoices/:id/download`

Download invoice as PDF.

**Response:** PDF file with `Content-Type: application/pdf`

**Backend Logic:**
1. Fetch invoice data
2. Generate PDF using pdfkit/puppeteer
3. Stream PDF response

---

#### `POST /api/v1/colleges/:id/assign-plan`

Assign or change a plan for a college.

**Request Body:**

```json
{
  "planId": "plan_003",
  "startDate": "2026-04-01",
  "autoRenew": true,
  "generateInvoice": true
}
```

**Backend Logic:**
1. Validate plan exists
2. Check college isn't already on the same plan
3. Update college's plan reference
4. If `generateInvoice`, create new invoice
5. Log `PLAN_ASSIGNED` to audit

---

### 4.8 Reports & Analytics Module

#### `GET /api/v1/reports/system-usage`

Returns system usage data (API requests, logins, tracking events).

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | `7days` | `7days`, `30days`, `3months`, `12months` |
| `granularity` | string | `daily` | `hourly`, `daily`, `weekly`, `monthly` |

**Success (200):**

```json
{
  "success": true,
  "data": [
    { "date": "2026-03-27", "apiRequests": 5100, "logins": 420, "trackingEvents": 14000 }
  ]
}
```

---

#### `GET /api/v1/reports/growth`

Platform growth over time.

**Query Parameters:** Same as system-usage

---

#### `GET /api/v1/reports/revenue`

Revenue and billing analytics.

**Success (200):**

```json
{
  "success": true,
  "data": {
    "timeline": [
      { "month": "2026-01", "revenue": 280000, "expenses": 120000, "newSubscriptions": 5 }
    ],
    "totalRevenue": 2570000,
    "averageRevenuePerCollege": 53541,
    "planDistribution": [
      { "plan": "Enterprise", "colleges": 15, "revenue": 749985 },
      { "plan": "Professional", "colleges": 20, "revenue": 499980 },
      { "plan": "Basic", "colleges": 13, "revenue": 129987 }
    ]
  }
}
```

---

#### `GET /api/v1/reports/colleges`

College-specific analytics.

---

#### `GET /api/v1/reports/operational`

Operational metrics (uptime, response times, error rates).

**Success (200):**

```json
{
  "success": true,
  "data": {
    "uptime": 99.97,
    "avgResponseTime": "120ms",
    "errorRate": 0.03,
    "peakHour": "08:00-09:00",
    "totalApiCalls": 1250000
  }
}
```

---

#### `GET /api/v1/reports/export`

Export report data as CSV or Excel.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | `growth`, `revenue`, `colleges`, `usage`, `users` |
| `format` | string | `csv` or `xlsx` |
| `dateFrom` | date | Start date |
| `dateTo` | date | End date |

**Response:** File download with appropriate Content-Type

---

### 4.9 Settings Module

#### `GET /api/v1/settings`

Get all system-wide settings.

**Success (200):**

```json
{
  "success": true,
  "data": {
    "tracking": {
      "interval": 15,
      "unit": "seconds",
      "accuracyMode": "high",
      "dataRetentionDays": 90
    },
    "notifications": {
      "emailOnNewRegistration": true,
      "emailOnPlanExpiry": true,
      "emailOnSecurityAlert": true,
      "smsOnCriticalAlert": false,
      "dailyDigest": true,
      "digestTime": "09:00"
    },
    "features": {
      "liveTracking": true,
      "advancedAnalytics": true,
      "parentNotifications": true,
      "driverChat": false,
      "multiLanguage": false,
      "darkMode": true,
      "apiAccess": true,
      "webhooks": false
    },
    "security": {
      "maxLoginAttempts": 5,
      "lockoutDuration": 15,
      "sessionTimeout": 30,
      "enforcePasswordPolicy": true,
      "twoFactorEnabled": false
    },
    "updatedAt": "2026-03-27T16:00:00Z",
    "updatedBy": "Super Admin"
  }
}
```

---

#### `PUT /api/v1/settings`

Update all settings at once.

**Request Body:** Same structure as GET response `data` field

**Backend Logic:**
1. Validate all values
2. Deep merge with existing settings
3. Log `SETTINGS_UPDATED` with diff of changed fields

---

#### `PATCH /api/v1/settings/tracking`

Update only tracking settings.

**Request Body:**

```json
{
  "interval": 10,
  "accuracyMode": "high",
  "dataRetentionDays": 120
}
```

---

#### `PATCH /api/v1/settings/notifications`

Update only notification rules.

---

#### `PATCH /api/v1/settings/features`

Update only feature toggles.

**Request Body:**

```json
{
  "driverChat": true,
  "multiLanguage": true
}
```

**Backend Logic:**
1. Merge with existing feature flags
2. Log `FEATURE_TOGGLE_CHANGED` with `{ feature, oldValue, newValue }`

---

### 4.10 Logs/Audit Module

#### `GET /api/v1/logs`

List all audit logs with filtering and pagination.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page |
| `limit` | number | `20` | Items per page |
| `search` | string | — | Search action, target, details |
| `category` | string | — | `admin`, `security`, `billing`, `college`, `settings`, `system` |
| `actor` | string | — | `Super Admin`, `System` |
| `action` | string | — | Specific action name |
| `dateFrom` | datetime | — | Filter from date |
| `dateTo` | datetime | — | Filter to date |
| `sortBy` | string | `timestamp` | `timestamp`, `action`, `category` |
| `order` | string | `desc` | `asc` or `desc` |

**Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "log_001",
      "action": "Admin Created",
      "actor": {
        "id": "sa_001",
        "name": "Super Admin",
        "ip": "192.168.1.1"
      },
      "target": {
        "id": "adm_001",
        "name": "Rajesh Kumar",
        "type": "admin"
      },
      "details": "Created admin for IIT Delhi with permissions: manage_buses, manage_users",
      "category": "admin",
      "severity": "info",
      "metadata": {
        "changes": { "role": "admin", "college": "IIT Delhi" },
        "userAgent": "Chrome/120.0",
        "requestId": "req_abc123"
      },
      "timestamp": "2026-03-27T22:30:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1250, "totalPages": 63 }
}
```

---

#### `GET /api/v1/logs/:id`

Get individual log entry with full metadata.

---

#### `GET /api/v1/logs/stats`

Get log statistics.

**Success (200):**

```json
{
  "success": true,
  "data": {
    "totalLogs": 12500,
    "todayCount": 45,
    "byCategory": {
      "admin": 3200,
      "security": 1800,
      "billing": 2400,
      "college": 2100,
      "settings": 800,
      "system": 2200
    },
    "bySeverity": {
      "info": 9000,
      "warning": 2500,
      "error": 800,
      "critical": 200
    }
  }
}
```

---

#### `GET /api/v1/logs/export`

Export audit logs as CSV.

**Query Params:** Same filters as `GET /api/v1/logs` + `format=csv|xlsx`

**Response:** File download

---

### 4.11 Notifications Module

#### `GET /api/v1/notifications`

Get all notifications for the super admin.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page |
| `limit` | number | `20` | Items per page |
| `isRead` | boolean | — | Filter by read status |
| `type` | string | — | `alert`, `info`, `warning`, `billing`, `security` |

**Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_001",
      "type": "warning",
      "title": "Plan Expiry Warning",
      "message": "3 colleges have plans expiring within 7 days",
      "isRead": false,
      "actionUrl": "/billing?status=expiring",
      "createdAt": "2026-03-27T23:00:00Z"
    }
  ],
  "meta": { "unreadCount": 5, "page": 1, "limit": 20, "total": 45 }
}
```

---

#### `PATCH /api/v1/notifications/:id/read`

Mark a notification as read.

---

#### `PATCH /api/v1/notifications/read-all`

Mark all notifications as read.

---

#### `DELETE /api/v1/notifications/:id`

Delete a notification.

---

## 5. Database Schema Overview

### Collections/Tables

| Model | Key Fields | Relations |
|-------|-----------|-----------|
| **SuperAdmin** | `name`, `email`, `passwordHash`, `role`, `avatar`, `lastLogin`, `tokenVersion` | — |
| **College** | `name`, `code`, `city`, `state`, `address`, `contactEmail`, `contactPhone`, `website`, `status`, `planId`, `deletedAt` | → Plan, ← Admins, ← Users |
| **Admin** | `name`, `email`, `passwordHash`, `phone`, `role`, `collegeId`, `status`, `permissions[]`, `lastLogin`, `suspendedAt`, `revokedAt`, `deletedAt`, `tokenVersion` | → College |
| **User** | `name`, `email`, `role`, `collegeId`, `status`, `lastActive` | → College |
| **Plan** | `name`, `price`, `currency`, `duration`, `durationUnit`, `maxBuses`, `maxUsers`, `maxControllers`, `features[]`, `status`, `deletedAt` | ← Colleges, ← Invoices |
| **Invoice** | `invoiceNumber`, `collegeId`, `planId`, `amount`, `currency`, `status`, `issuedDate`, `dueDate`, `paidDate`, `paymentReference`, `notes` | → College, → Plan |
| **AuditLog** | `action`, `actorId`, `actorName`, `actorIp`, `targetId`, `targetName`, `targetType`, `details`, `category`, `severity`, `metadata`, `timestamp` | — (immutable) |
| **Setting** | `key`, `value` (JSON), `type`, `updatedAt`, `updatedBy` | — |
| **Notification** | `type`, `title`, `message`, `isRead`, `actionUrl`, `createdAt` | — |

### Indexes

```
colleges:     (status), (planId), (name: text, code: text, city: text)
admins:       (email: unique), (collegeId), (status), (role)
users:        (email: unique), (collegeId), (role), (status)
invoices:     (collegeId), (status), (issuedDate), (invoiceNumber: unique)
audit_logs:   (timestamp: -1), (category), (actorId), (targetId)
notifications: (isRead), (createdAt: -1)
```

---

## 6. Error Handling

### HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PUT, PATCH, DELETE |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE with no body |
| `400` | Bad Request | Validation failure |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate key, state conflict |
| `422` | Unprocessable | Business logic rejection |
| `423` | Locked | Account locked |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Error | Unexpected server error |

### Global Error Handler

```javascript
// errorHandler.js middleware
(err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || [],
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
```

---

## 7. Rate Limiting & Security

### Rate Limits

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| `POST /auth/login` | 5 requests | 15 minutes |
| `GET /*` (read) | 100 requests | 1 minute |
| `POST/PUT/DELETE` (write) | 30 requests | 1 minute |
| `GET /reports/export` | 5 requests | 5 minutes |

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### Additional Security Measures

- **CORS** — whitelist only the frontend domain
- **Helmet.js** — security headers
- **Input sanitization** — via express-mongo-sanitize / xss-clean
- **Request size limit** — `express.json({ limit: '10mb' })`
- **SQL/NoSQL injection** — parameterized queries, Mongoose sanitization
- **Password hashing** — bcrypt with 12 salt rounds
- **Token blacklist** — Redis set for revoked tokens
- **Audit logging** — every mutating action logged with IP, user agent, timestamp

---

## API Count Summary

| Module | Endpoints |
|--------|-----------|
| Auth | 2 |
| Dashboard | 4 |
| Colleges | 7 |
| Controllers/Admins | 10 |
| Users | 4 |
| Billing — Plans | 5 |
| Billing — Invoices | 6 |
| Reports | 6 |
| Settings | 5 |
| Logs/Audit | 4 |
| Notifications | 4 |
| **Total** | **57** |

---

> **Last updated:** March 28, 2026
> **Version:** 1.0.0
