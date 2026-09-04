# 🏛️ Gogangs System Architecture & Flow Specification

This document provides a technical specification of the entire **Gogangs** video editing marketplace platform, covering infrastructure architecture, data flow, storage quota management, and user workflows.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client Layer [Frontend Client - React + Vite + Tailwind]
        AdminApp[Admin Dashboard & Management]
        EditorApp[Editor Workspace & Asset Manager]
        PublicApp[Landing Page & Public Portfolios]
    end

    subgraph CDN & Global Edge [Cloudflare Edge]
        CF_CDN[Cloudflare CDN / DNS]
        CF_R2[(Cloudflare R2 Object Storage<br/>Videos & Assets - $0 Egress)]
    end

    subgraph Backend Infrastructure [Render Node.js / Express Web Service]
        ExpressAPI[Express REST API]
        PresignedService[S3 Presigned URL Generator]
        QuotaEngine[1 GB Storage Quota Engine]
        KeepAliveCron[Uptime Keep-Alive Ping / Cron]
    end

    subgraph Database & Auth Layer [Supabase Cloud]
        SupaAuth[Supabase Auth - JWT]
        SupaDB[(PostgreSQL Database)]
        SupaRLS[Row Level Security Policies]
        SupaTriggers[Storage Calculation Triggers]
    end

    subgraph Payment Gateway
        StripeGateway[Stripe / Razorpay Billing]
    end

    AdminApp -->|HTTPS / API Calls| ExpressAPI
    EditorApp -->|HTTPS / API Calls| ExpressAPI
    AdminApp -->|Direct Supabase SDK / Auth| SupaAuth
    EditorApp -->|Direct Supabase SDK / Auth| SupaAuth

    ExpressAPI -->|Read / Write| SupaDB
    ExpressAPI -->|Generate Presigned PUT/DELETE| PresignedService
    PresignedService -.->|Sign Auth| CF_R2

    EditorApp -->|Direct Chunked Upload via Presigned URL| CF_R2
    AdminApp -->|Stream / Preview via CDN| CF_CDN
    CF_CDN --> CF_R2

    KeepAliveCron -->|Ping GET /api/health every 10m| ExpressAPI
    StripeGateway -->|Webhook: Subscription Updated| ExpressAPI
```

---

## 2. Infrastructure Components Breakdown

### 2.1 Frontend (SPA)
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS.
- **Hosting**: Vercel or Cloudflare Pages (Global edge CDN).
- **Authentication**: `@supabase/supabase-js` managing JWT sessions, refresh tokens, and role-based client routing.
- **Direct Uploads**: Uses `@aws-sdk/client-s3` (or direct `fetch` PUT) to upload video files directly to Cloudflare R2 via presigned URLs.

### 2.2 Backend API (Render Web Service)
- **Framework**: Node.js + Express 5 (ES Modules).
- **Hosting**: Render Free Web Service.
- **Keep-Alive Solution**: External HTTP cron (*UptimeRobot / Cron-Job.org / Supabase pg_cron*) pinging `/api/health` every 10 minutes to prevent the 15-minute free-tier spin-down.
- **Responsibilities**:
  - Issue Cloudflare R2 presigned upload/delete URLs.
  - Enforce the **1 GB storage quota limit** before issuing upload tokens.
  - Process Stripe/Razorpay billing webhooks for storage upgrades.
  - Handle admin-level batch tasks and aggregation endpoints.

### 2.3 Database & Realtime (Supabase PostgreSQL)
- **Engine**: Managed PostgreSQL 15.
- **Security**: Row Level Security (RLS) enabled on all tables.
- **Storage Metrics**: Database triggers compute `storage_used_bytes` automatically on insert/delete in the `editor_assets` table.

### 2.4 Object Storage (Cloudflare R2)
- **Format**: S3-compatible object storage.
- **Why R2**: **$0 Egress Fees** allows video streaming and reviewing without incurring high bandwidth bills.
- **Storage Structure**:
  ```
  bucket-name/
  ├── editors/{editor_id}/
  │   ├── portfolio/{file_id}.mp4
  │   └── subtasks/{subtask_id}/{file_id}.mp4
  ```

---

## 3. End-to-End User Workflows

### 3.1 Campaign & Subtask Creation Flow (Admin)
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Frontend as Admin UI
    participant Backend as Express / Supabase
    participant DB as PostgreSQL

    Admin->>Frontend: Clicks "New Project" / applies Template
    Admin->>Frontend: Fills title, client name, and subtasks
    Frontend->>Backend: POST /api/projects (Project + Subtasks)
    Backend->>DB: INSERT into projects & subtasks
    DB-->>Frontend: Returns created project with ID
    Frontend-->>Admin: Navigates to Project Detail Hub
```

### 3.2 Smart Assignment Flow (Admin)
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant UI as Assign Editors Screen
    participant Context as AppContext / API
    participant DB as PostgreSQL

    Admin->>UI: Selects subtask (e.g. "Thumbnail Design")
    UI->>Context: Filters verified editors
    Note over UI: System automatically flags "★ Recommended Match"<br/>for editors with matching skill
    Admin->>UI: Clicks "+ Assign" on Marcus Chen
    UI->>Context: assignEditors(projectId, subtaskId, [editorId])
    Context->>DB: UPDATE subtask_assignments
    UI-->>Admin: Updates sticky Assigned Team sidebar & shows toast
```

### 3.3 Video Upload & Direct Cloudflare R2 Submission Flow (Editor)
```mermaid
sequenceDiagram
    autonumber
    actor Editor
    participant Frontend as Editor Portal
    participant API as Express Server
    participant R2 as Cloudflare R2
    participant DB as Supabase DB

    Editor->>Frontend: Drops video file (e.g., 250 MB .mp4)
    Frontend->>API: POST /api/storage/presigned-upload-url (file_size: 250MB)
    API->>DB: Query editor's used storage + quota limit
    alt Storage limit exceeded (> 1 GB)
        API-->>Frontend: 403 Forbidden ("Quota Exceeded. Clean bucket or Upgrade")
        Frontend-->>Editor: Displays Clean Bucket / Upgrade Modal
    else Within Quota Limit
        API->>R2: Generate S3 Presigned PUT URL (Valid 15 mins)
        API-->>Frontend: Returns { uploadUrl, fileKey, publicUrl }
        Frontend->>R2: Direct HTTP PUT (File Stream with Progress Bar)
        R2-->>Frontend: 200 OK
        Frontend->>API: POST /api/storage/confirm-upload (fileKey, fileSize, subtaskId)
        API->>DB: INSERT into editor_assets & UPDATE subtask status = 'Ready for Review'
        DB-->>Frontend: Success Toast
        Frontend-->>Editor: Task moved to "In Review" tab
    end
```

### 3.4 Review, Feedback & Approval Flow (Admin)
```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant ReviewQueue as Admin Review Queue
    participant DB as Supabase DB
    actor Editor

    Admin->>ReviewQueue: Views pending deliverables
    Admin->>ReviewQueue: Clicks "View Deliverable" (Streams directly from R2)
    alt Approved
        Admin->>ReviewQueue: Clicks "Approve Task"
        ReviewQueue->>DB: UPDATE subtask status = 'Approved'
        DB-->>Editor: Realtime Toast: "Your edit was approved!"
    else Needs Revisions
        Admin->>ReviewQueue: Enters revision timestamp feedback & clicks "Send Back"
        ReviewQueue->>DB: UPDATE subtask status = 'Sent Back', feedback = '...'
        DB-->>Editor: Dashboard flags task in red with admin feedback notes
    end
```

### 3.5 1 GB Bucket Cleanup Flow (Editor)
```mermaid
sequenceDiagram
    autonumber
    actor Editor
    participant UI as Editor Storage Manager
    participant API as Express API
    participant R2 as Cloudflare R2
    participant DB as Supabase DB

    Editor->>UI: Opens "Storage & Cloud Assets" tab
    UI->>DB: GET /api/storage/my-assets (sorted by largest file)
    UI-->>Editor: Displays: "890 MB / 1024 MB Used (87%)"
    Editor->>UI: Selects 3 old raw draft videos (450 MB) -> clicks "Delete Selected"
    UI->>API: DELETE /api/storage/assets (ids: [1, 2, 3])
    API->>R2: DeleteObjects(fileKeys)
    API->>DB: DELETE from editor_assets
    DB->>DB: Trigger decrements storage_used_bytes by 450 MB
    DB-->>UI: Returns updated usage: "440 MB / 1024 MB (43%)"
    UI-->>Editor: Displays green storage bar + "450 MB freed up!"
```
