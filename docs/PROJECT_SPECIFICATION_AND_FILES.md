# 📁 Gogangs File-by-File Technical Specification

This document details every directory and source file in the Gogangs repository, detailing its purpose, UI components, state bindings, props, and design system elements.

---

## 1. Directory Tree Overview

```
Gogangs-main/
├── docs/                                # Technical Documentation & Architecture
│   ├── ARCHITECTURE_AND_FLOW.md         # System architecture, sequence diagrams, flows
│   ├── PROJECT_SPECIFICATION_AND_FILES.md # File-by-file breakdown (This document)
│   ├── SUPABASE_R2_STORAGE_QUOTA_PLAN.md # PostgreSQL DDL, R2 S3 SDK, Quota engine
│   └── ROADMAP_AND_TRACKING.md          # Task breakdown & progress checklist
├── server/                              # Node.js Express Backend API
│   ├── index.js                         # Express server, REST endpoints, CORS, Health check
│   └── data.js                          # Initial seed data for editors, campaigns, deliverables
├── src/                                 # Frontend Application (React + TypeScript)
│   ├── assets/                          # Static image assets (logos, icons)
│   ├── components/                      # Reusable UI & Layout Components
│   │   ├── ui.tsx                       # Atomic Design System (Button, Card, Badge, Modal, etc.)
│   │   ├── TopNav.tsx                   # Main global navigation with dynamic review badges
│   │   └── Logo.tsx                     # Brand SVG/PNG logo component
│   ├── screens/                         # Application Pages / Route Views
│   │   ├── LandingPage.tsx              # Public marketing homepage
│   │   ├── LoginPage.tsx                # Auth portal (Sign in / Sign up)
│   │   ├── PublicPortfolioPage.tsx      # Publicly shareable creator portfolio view
│   │   ├── AdminDashboard.tsx           # Admin overview metrics, deadlines at risk, live feed
│   │   ├── ProjectsOverview.tsx         # Admin campaigns list with progress bars & filters
│   │   ├── ProjectDetail.tsx            # Admin project hub (2-column layout, subtasks, review modal)
│   │   ├── CreateProject.tsx            # Admin new project creator with preset campaign templates
│   │   ├── AssignEditors.tsx            # Admin smart editor matcher & assignment workbench
│   │   ├── ReviewQueue.tsx              # Admin deliverable review hub (stream, approve, send back)
│   │   ├── EditorManagement.tsx         # Admin editor directory, verification toggles, CSV export
│   │   ├── Reports.tsx                  # Admin engagement, capacity & skill analytics
│   │   ├── EditorDashboard.tsx          # Editor personal overview, active tasks, status pills
│   │   ├── EditorProjects.tsx           # Editor task hub with deliverable submission modal
│   │   ├── EditorProfile.tsx            # Editor profile editor (bio, skills, software, availability)
│   │   ├── EditorPortfolio.tsx          # Editor video portfolio manager
│   │   └── EditorVerification.tsx       # Editor identity and proof of work verification portal
│   ├── App.tsx                          # Root router, path matching, route guards
│   ├── context.tsx                      # AppProvider state store (editors, projects, auth, toasts)
│   ├── data.ts                          # Client seed mock data & constants
│   ├── types.ts                         # Complete TypeScript type definitions
│   ├── main.tsx                         # DOM entry point
│   └── index.css                        # Tailwind CSS imports & global theme variables
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # TypeScript root configuration
├── tailwind.config.js                   # Tailwind theme, typography, color palette
└── vite.config.ts                       # Vite bundler configuration & path aliases
```

---

## 2. File-by-File Detailed Breakdown

### 2.1 Core Application & Routing

#### `src/App.tsx`
- **Purpose**: Client-side router handling URL path matching, authentication guards, and layout wrapping.
- **Key Responsibilities**:
  - Distinguishes between **Public routes** (`/`, `/login`, `/editor/:id`), **Admin routes** (`/admin/*`), and **Editor routes** (`/editor/*`).
  - Renders `<TopNav>` with role-specific navigation items.
  - Hosts global `<ToastContainer>` for floating notifications.
- **Route Matching Logic**:
  - `/admin/projects/:id` -> `<ProjectDetail projectId={id} />`
  - `/admin/projects/:id/subtasks/:subtaskId/assign` -> `<AssignEditors />`
  - `/admin/editor/:id` -> `<EditorDetail />`

#### `src/context.tsx`
- **Purpose**: Global state management layer providing unified reactive access across the entire app.
- **State Provided**:
  - `user`: Current session (`{ type: 'admin' }` or `{ type: 'editor', editorId: string }`).
  - `editors`: Array of `Editor` profiles.
  - `projects`: Array of `Project` campaigns with embedded `Subtask[]`.
  - `activity`: Global audit trail event log (`ActivityEvent[]`).
  - `toasts`: Dynamic notification queue.
- **Key Methods**:
  - `login(email, password)`: Validates credentials and sets active user state.
  - `updateSubtask(projectId, subtaskId, updates)`: Updates deliverable state and emits live activity events.
  - `assignEditors(projectId, subtaskId, editorIds)`: Updates assigned creators.
  - `setVerificationStatus(editorId, status, feedback)`: Toggles verified/pending state.

#### `src/types.ts`
- **Purpose**: Strict TypeScript domain models ensuring type safety.
- **Key Types**:
  - `VerificationStatus`: `'Pending' | 'Verified' | 'Rejected'`
  - `ProjectStatus`: `'Assigned' | 'In Progress' | 'Ready for Review' | 'Approved' | 'Sent Back'`
  - `TaskType`: `'Reels Editing' | 'YouTube Editing' | 'Podcast Editing' | 'Motion Graphics' | 'Commercial Ads' | 'Corporate Videos' | 'Wedding Videos' | 'Color Grading' | 'Thumbnail Design'`
  - `Editor`: Complete profile object including skills, software, portfolio items, and metrics.
  - `Subtask`: Individual deliverable within a campaign with deadline, status, deliverable link, and assigned editor IDs.
  - `Project`: Campaign object containing client metadata and subtasks.

---

### 2.2 Reusable UI Components (`src/components/`)

#### `src/components/ui.tsx`
Contains the modular Atomic Design System:
- `<Button>`: Variants (`primary`, `secondary`, `outline`, `ghost`, `destructive`), sizes (`sm`, `md`, `lg`).
- `<Card>`: Rounded container with subtle borders, elevation shadows, and hover elevation.
- `<Badge>`: Color-coded status indicator dots (`verified`, `pending`, `rejected`, `info`, `overdue`, `urgent`).
- `<Avatar>` & `<AvatarStack>`: Profile images with overlapping stacks for multi-editor deliverables.
- `<Modal>`: Accessible backdrop overlay with entrance animation and close handlers.
- `<Input>` & `<Textarea>`: Form inputs with focus rings and label support.
- `<EmptyState>`: Standardized placeholder for zero-data states with icons and action buttons.
- `<ToastContainer>`: Fixed bottom-right toast notification stack.

#### `src/components/TopNav.tsx`
- **Purpose**: Sticky header navigation bar across both Admin and Editor personas.
- **Features**:
  - **Dynamic Badge**: Automatically calculates live count of subtasks where `status === 'Ready for Review'` and highlights the badge in amber.
  - Role switcher and public profile preview dropdown.
  - Search trigger with `⌘K` keyboard shortcut indicator.

---

### 2.3 Admin Screen Suite (`src/screens/`)

#### `src/screens/AdminDashboard.tsx`
- **Purpose**: Executive cockpit for platform administrators.
- **Components**:
  - **5 Top Metric Cards**: Live total, verified, pending, active, and inactive editor counts.
  - **Deadlines at Risk Widget**: Real-time listing of near-due subtasks with danger/warning indicators.
  - **Live Activity Feed**: Real-time audit log of submissions, verifications, and approvals.
  - **Community Skill Distribution**: Interactive visual bar charts of in-demand skills.

#### `src/screens/ProjectsOverview.tsx`
- **Purpose**: Campaign directory and status hub.
- **Components**:
  - 4 KPI cards for active campaigns, total deliverables, and review counts.
  - Filter tabs (`All`, `Ready for Review`, `In Progress`, `Completed`).
  - Campaign Cards showing progress percentages, deliverable previews, and assigned editor avatar stacks.
  - CSV Export generator.

#### `src/screens/ProjectDetail.tsx`
- **Purpose**: Central command center for a single campaign.
- **Components**:
  - **Header & Progress Bar**: Real-time percentage completion gauge.
  - **Main Column**: Subtask list with type icons, deadline countdowns, deliverable links, and direct review buttons.
  - **Sidebar**: Client metadata, cloud assets drive link, assigned editor roster.
  - **Built-in Modals**: "Add Subtask" modal and "Review Deliverable" modal.

#### `src/screens/AssignEditors.tsx`
- **Purpose**: High-efficiency editor matching and assignment interface.
- **Components**:
  - **Smart Matcher**: Automatically highlights editors with matching skill tags as "★ Recommended Match".
  - **Editor Cards**: Displays rating, experience, software tools, and active workload (`🟢 Available now` vs `🟡 1 active task`).
  - **Sticky Assigned Team Sidebar**: Live tray of assigned creators with instant removal and confirmation buttons.

#### `src/screens/ReviewQueue.tsx`
- **Purpose**: Triage station for all submitted video deliverables.
- **Components**:
  - Live filter tabs (`All`, `Ready for Review`, `Returned`).
  - Submission cards with direct links to Cloudflare R2 / Drive video files.
  - One-click **"Approve Task"** and **"Request Revisions"** modal with feedback notes.

#### `src/screens/EditorManagement.tsx` & `src/screens/Reports.tsx`
- **Purpose**: Directory management, verification approval, and capacity reports.
- **Components**: Multi-filter table, bulk selection, CSV export, and kebab actions.

---

### 2.4 Editor Screen Suite (`src/screens/`)

#### `src/screens/EditorDashboard.tsx`
- **Purpose**: Personalized workspace for video editors.
- **Components**:
  - Gradient hero welcome banner with active task count.
  - 4 status metric cards (Verification status, Active tasks, In review, Approved).
  - List of current assigned tasks with deadline indicators.
  - Creator profile snippet with software stack preview.

#### `src/screens/EditorProjects.tsx`
- **Purpose**: Dedicated deliverable execution hub.
- **Components**:
  - Task filter pills (`All`, `In Progress`, `Assigned`, `In Review`, `Revisions`, `Approved`).
  - Task cards showing project client, required format, and revision instructions.
  - **"Submit Deliverable" Modal**: Allows editors to submit their cloud video link, transitioning status to "Ready for Review".

#### `src/screens/EditorPortfolio.tsx` & `src/screens/EditorProfile.tsx`
- **Purpose**: Showcase past video work, rates, skills, and software proficiencies.

---

### 2.5 Backend API (`server/index.js`)
- **Endpoints**:
  - `GET /api/health`: Health check for keep-alive bots.
  - `GET /api/editors`: List editors with search & status filters.
  - `POST /api/editors`: Register new editor.
  - `GET /api/projects`: List all campaigns with nested subtasks.
  - `POST /api/projects`: Create new campaign.
  - `PUT /api/projects/:projectId/subtasks/:subtaskId`: Update subtask status & feedback.
  - `GET /api/review-queue`: Returns all subtasks awaiting admin review.
  - `GET /api/dashboard/stats`: Aggregated metrics.
