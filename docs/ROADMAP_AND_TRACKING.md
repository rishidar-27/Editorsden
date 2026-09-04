# 📋 Gogangs Development Tracking & Roadmap Checklist

Use this markdown document to track progress as you implement, deploy, and scale the Gogangs platform.

---

## 🎯 Progress Dashboard

- [x] **Phase 0: Frontend Design System & Responsive UI Hub** *(Completed)*
- [x] **Phase 1: Supabase Database Client & Backend DB Integration** *(Completed & Integrated)*
- [x] **Phase 2: Cloudflare R2 Direct Upload & Presigned URL Engine** *(Completed & Integrated)*
- [x] **Phase 3: 1 GB Quota Engine & Editor Storage Cleanup Manager** *(Completed & Integrated)*
- [ ] **Phase 4: Stripe / Razorpay Tier Upgrades & Billing Webhooks** *(Next Up)*
- [ ] **Phase 5: Render Deployment & Always-On Keep-Alive Setup** *(Pending)*

---

## Phase 0: Frontend Design System & Screen Layouts (Completed)
- [x] Responsive Atomic UI system (`Button`, `Card`, `Badge`, `Modal`, `AvatarStack`, `EmptyState`, `ToastContainer`).
- [x] Admin Suite:
  - [x] Admin Dashboard (`/admin/dashboard`) with live KPI metrics, deadlines at risk, and activity stream.
  - [x] Projects Overview (`/admin/projects`) with progress bars, filters, and CSV export.
  - [x] Project Detail Hub (`/admin/projects/:id`) with 2-column layout, subtasks, and review modals.
  - [x] Smart Editor Assignment (`/admin/projects/:id/subtasks/:subtaskId/assign`) with skill match flags.
  - [x] Review Queue (`/admin/review`) with dynamic navbar badge count and live approval flow.
  - [x] Editor Directory & Reports (`/admin/editors`, `/admin/reports`) with search, filter, and export.
  - [x] Create Project (`/admin/projects/new`) with quick campaign templates.
- [x] Editor Suite:
  - [x] Editor Personal Dashboard (`/editor/dashboard`).
  - [x] Editor Tasks & Deliverable Submission Hub (`/editor/projects`).
  - [x] Editor Profile, Portfolio & Verification screens.
- [x] Public Landing Page & Shareable Public Portfolio (`/`, `/login`, `/editor/:id`).

---

## Phase 1: Supabase Database Migration & Auth (Target: Week 1)
- [ ] **1.1 Supabase Setup**:
  - [ ] Create Supabase project & execute SQL DDL from `docs/SUPABASE_R2_STORAGE_QUOTA_PLAN.md`.
  - [ ] Verify Row Level Security (RLS) policies and triggers.
- [ ] **1.2 Auth Integration**:
  - [ ] Implement Supabase Auth email/password login and sign-up in `src/screens/LoginPage.tsx`.
  - [ ] Replace in-memory `user` state with `supabase.auth.onAuthStateChange` session listener.
- [ ] **1.3 Data Fetching & Sync**:
  - [ ] Replace mock arrays in `src/context.tsx` with Supabase query hooks (`profiles`, `projects`, `subtasks`).
  - [ ] Enable Supabase Realtime channels for instant subtask status updates.

---

## Phase 2: Cloudflare R2 Upload Engine (Target: Week 2)
- [ ] **2.1 Cloudflare R2 Setup**:
  - [ ] Create R2 bucket (*e.g., `gogangs-media`*) and create API tokens with Object Read & Write permissions.
  - [ ] Set up a custom domain on Cloudflare (*e.g., `media.gogangs.com`*) for video caching.
- [ ] **2.2 Backend S3 Presigned URL Endpoint**:
  - [ ] Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` in `server/package.json`.
  - [ ] Create `POST /api/storage/presigned-upload-url` route verifying quota before signing.
  - [ ] Create `DELETE /api/storage/assets` route to delete files from R2.
- [ ] **2.3 Frontend Direct Uploader**:
  - [ ] Build drag-and-drop video dropzone component with upload progress percentage (`0% → 100%`).
  - [ ] On completion, record asset in Supabase `editor_assets` table.

---

## Phase 3: 1 GB Quota Engine & Storage Cleaner (Target: Week 3)
- [ ] **3.1 Quota Enforcement**:
  - [ ] Add pre-upload validation blocking uploads if `storage_used_bytes + incoming_file > storage_limit_bytes`.
  - [ ] Display modal: *"1 GB Storage Limit Reached — Clean bucket or Upgrade"*.
- [ ] **3.2 Editor Storage Manager UI**:
  - [ ] Create `<EditorStorageManager>` view showing storage meter (*Green / Amber / Red*).
  - [ ] Table of uploaded videos sorted by largest size with multi-select bulk delete.
  - [ ] Test trigger automatically reducing `storage_used_bytes` when rows are deleted.

---

## Phase 4: Monetization & Paid Storage Tiers (Target: Week 4)
- [ ] **4.1 Billing Provider Setup**:
  - [ ] Configure Stripe / Razorpay products:
    - Free Tier: 1 GB ($0/mo)
    - Pro Tier: 50 GB ($9/mo)
    - Studio Tier: 200 GB ($24/mo)
- [ ] **4.2 Webhook Integration**:
  - [ ] Implement `POST /api/webhooks/stripe` with signature verification.
  - [ ] Update `storage_limit_bytes` and `storage_tier` in Supabase upon subscription payment.

---

## Phase 5: Render Deployment & Always-On Setup (Target: Week 5)
- [ ] **5.1 Backend Deployment (Render)**:
  - [ ] Push code to GitHub and connect repository to Render Web Service.
  - [ ] Set environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `STRIPE_SECRET_KEY`).
- [ ] **5.2 Always-On Keep-Alive Configuration**:
  - [ ] Create a free monitor on **UptimeRobot** / **Cron-Job.org** targeting `https://your-api.onrender.com/api/health` every 10 minutes.
  - [ ] Verify Render service never enters sleep mode.
- [ ] **5.3 Frontend Deployment**:
  - [ ] Deploy Vite build to **Vercel** / **Cloudflare Pages** with custom domain.
  - [ ] Conduct end-to-end smoke testing.
