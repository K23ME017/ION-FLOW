# Career and Skill-Gap Navigator

A modern, high-impact career progression web application featuring secure user authentication (Sign Up / Log In), comprehensive candidate data collection with automated resume parsing, real-time market analysis from SerpApi Google Jobs, skill-gap categorization, a Fast-Track course spotlight, and an active notification system for newest job postings and accredited certifications.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Authentication-First Flow**: Users begin by signing up or logging in. Once authenticated, the application collects their complete profile data (either via direct resume upload/parsing or interactive profile builder), stores it in MongoDB, and generates live, zero-hallucination market roadmaps via SerpApi Google Jobs.

- **Authentication Architecture**: Email and password authentication with secure password hashing (`bcryptjs` or standard PBKDF2/SHA-256), session tokens, and MongoDB user storage, with quick-login/demo prefill option for evaluation.
- **Data Collection & Resume Parser**: Seamlessly ingests resumes (PDF, TXT, DOCX, or text paste) to populate education, work history, projects, and skills with proficiency levels (*Beginner*, *Intermediate*, *Advanced*).
- **Zero Hallucination Policy**: Every job posting, qualification highlight, and apply link originates directly from live SerpApi Google Jobs queries.
- **Credentials & Environment**: Configured with provided MongoDB URI (`ionflow.qbiuzhi.mongodb.net`) and SerpApi key in `.env.local` and `.env`.
- **Backend Architecture**: Express API server mounted with Vite dev server and standalone production server, exposing `/api/auth/*`, `/api/user/*`, `/api/analyze-career`, and `/api/notifications`.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a dedicated career navigation portal where authenticated users manage their career profile, extract profile details directly from resumes, compare skills against live market demands from Google Jobs, identify the single highest-leverage fast-track skill, and receive notifications for newly posted jobs and accredited courses.
- **Target Audience / Persona**: Professionals, recent graduates, and career transitioners seeking tailored, verified guidance to land target roles.
- **Key Value**: Personalized user accounts, zero manual data entry with resume parsing, and verified market reality rather than speculative AI advice.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Authentication Gate (Sign Up & Log In)**:
   - Clean, elegant modal/page with tabbed toggle between **"Create Account"** and **"Welcome Back"**.
   - Sign-Up collects Full Name, Email, Password, and initial Target Role.
   - Instant guest/demo credential button for immediate evaluation.
   - On successful sign-in, user profile state is initialized in MongoDB and client session.
2. **Complete Data Collection & Resume Ingestion**:
   - Post-login onboarding screen with two frictionless paths:
     - **Option A (Fast Track)**: Drag & drop resume file (or paste text) $\rightarrow$ automated section parsing extracts Education, Experience, Projects, and Skills.
     - **Option B (Guided Builder)**: Step-by-step form to input Education, Experience, Projects, and interactive skill tags with proficiency pills (*Beginner*, *Intermediate*, *Advanced*).
   - Candidate reviews and confirms their complete profile data $\rightarrow$ saved to MongoDB.
3. **Career Analysis & Results Dashboard**:
   - **"Fast-Track to Getting Hired" Spotlight Card**: Positioned at the top with a distinct `⚡ Highest Hiring Impact` badge, highlighting the single missing skill that unlocks the most openings, verified learning link, impact score, and estimated hours.
   - **Market Gap Visualization**: Minimalist Recharts horizontal bar chart comparing the candidate's current capabilities against live market qualification frequencies.
   - **Skill Gap Categorization**: Three structured cards/tabs for *Mastered Skills*, *Needs Improvement*, and *Missing Critical Skills*.
   - **"Where to Apply" Live Job Grid**: Cards populated directly from SerpApi Google Jobs results with Job Title, Company, Location, qualification match snippets, and verified `Apply Now` buttons linking to `apply_options[0].link`.
   - **Action Plan Timeline**: Chronological vertical roadmap with prioritized bridge steps badged with `[Verified Requirement]` (blue) and `[AI Recommendation]` (purple).
4. **Notifications Center (Newest Jobs & Accredited Certifications)**:
   - Accessible via the top navigation alert bell with live badge indicator.
   - **"Newest Jobs to Apply" Tab**: Real-time matching postings fetched from Google Jobs with direct apply links and date posted stamps.
   - **"Certification Alerts" Tab**: Verified accredited certifications (AWS, Google Cloud, Meta, Coursera, Linux Foundation) mapped directly to user skill gaps.
   - In-app toggle to save jobs and mark alerts as read.

#### Visual Identity & Theme
- **Aesthetic Direction**: Approachable, modern, and uncluttered. Generous whitespace, rounded-2xl cards, and clear visual hierarchy.
- **Color Palette**:
  - Dominant Canvas: Soft neutral slate (`#F8FAFC` / `bg-slate-50`)
  - Primary Brand Accent: Deep confident royal blue (`#1E40AF` / `#2563EB`)
  - Structural Cards: Pure white (`#FFFFFF`) with subtle hairline border (`border-slate-200/80`) and soft elevation (`shadow-sm`)
  - Status Badges: Blue (`text-blue-700 bg-blue-50`), Amber (`text-amber-700 bg-amber-50`), Emerald (`text-emerald-700 bg-emerald-50`), Purple (`text-purple-700 bg-purple-50`)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit`
  - Body & Form Controls: `DM Sans` / `Public Sans`
  - Metrics & Numbers: Tabular numerals (`tabular-nums font-mono`)
- **Anti-Slop Discipline**: No decorative pulsing dots, no code-comment titles (`// 01`), unboxed metadata with `·` separators, and single-elevation card hierarchy.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Authenticated State as the Foundation**
  - *Chosen Approach*: Gate profile editing and analysis behind sign-up/login while storing all user resumes, profiles, roadmaps, and notifications under the user's MongoDB record. Provide a 1-click "Try Demo Account" button so evaluation is completely frictionless.
  - *Why*: Satisfies the explicit requirement to sign up/login first before collecting complete user data, while maintaining zero test friction.
- **Decision 2: Automated Resume Parsing with Pre-Filled Review**
  - *Chosen Approach*: Support file upload and plain-text paste; server-side extractor identifies contact info, education degrees, employment records, project titles, and tech stack tags; client renders them in interactive editable cards.
  - *Why*: Saves candidates 15+ minutes of manual data entry while ensuring 100% data fidelity.
- **Decision 3: Zero-Hallucination SerpApi Google Jobs Engine**
  - *Chosen Approach*: Directly query SerpApi's Google Jobs endpoint for the candidate's target role, parse the top 3-5 jobs, read `job_highlights.Qualifications`, calculate missing skill frequencies, and persist the roadmap.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             React 19 Frontend                               │
│                                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   Auth Modal / View     │  │        Notification Center Tray          │  │
│  │  (Sign Up / Log In)     │  │   (Newest Jobs & Certified Courses)      │  │
│  └───────────┬─────────────┘  └────────────────────▲─────────────────────┘  │
│              │ (onAuthSuccess)                     │                        │
│              ▼                                     │                        │
│  ┌─────────────────────────┐  ┌────────────────────┴─────────────────────┐  │
│  │ Resume Upload & Parser  │  │      Fast-Track Spotlight Card           │  │
│  │ + Comprehensive Profile │  │    (⚡ Highest Hiring Impact)             │  │
│  └───────────┬─────────────┘  └────────────────────▲─────────────────────┘  │
│              │                                     │                        │
│              ▼                        ┌────────────┴──────────────────────┐ │
│  ┌─────────────────────────┐          │ Recharts Skill Gap Bar Chart      │ │
│  │  State Store & API Client│          └───────────────────────────────────┘ │
│  └───────────┬─────────────┘  ┌───────────────────┬───────────────────────┐ │
│              │                │ "Where to Apply"  │ Action Plan Timeline  │ │
│              │                │ Live Job Grid     │ (Verified vs Rec)     │ │
│              │                └───────────────────┴───────────────────────┘ │
└──────────────┼──────────────────────────────────────────────────────────────┘
               │ HTTP JSON (/api/auth/*, /api/user/*, /api/analyze-career, /api/notifications)
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Express API Backend                               │
│                                                                             │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐  │
│  │  /api/auth/register   │ │ /api/user/parse-resume│ │/api/notifications  │  │
│  │  /api/auth/login      │ │ /api/user/profile    │ │- New jobs & certs  │  │
│  └───────────┬───────────┘ └──────────┬───────────┘ └─────────┬──────────┘  │
│              │                        │                       │             │
│              │ ┌──────────────────────┴───────────────┐       │             │
│              └─┤          /api/analyze-career         ├───────┘             │
│                │ - SerpApi Google Jobs live query     │                     │
│                │ - Extracts qualifications & gaps     │                     │
│                │ - Identifies #1 Fast-Track course    │                     │
│                │ - Generates alerts for newest jobs   │                     │
│                └──────────────────────┬───────────────┘                     │
└───────────────────────────────────────┼─────────────────────────────────────┘
                                        │
                                        ▼
             ┌───────────────────────────────────┬──────────────────┐
             │         MongoDB Database          │     SerpApi      │
             │ (User, Roadmap, Notification)     │   Google Jobs    │
             └───────────────────────────────────┴──────────────────┘
```

#### Data Schemas (`models/`)
1. **`User` Schema**:
   - `fullName`: String (required)
   - `email`: String (required, unique, indexed)
   - `passwordHash`: String (required)
   - `education`: String
   - `skills`: `[{ name: String, proficiency: 'Beginner' | 'Intermediate' | 'Advanced' }]`
   - `experience`: String
   - `projects`: `[{ title: String, description: String, technologies: [String] }]`
   - `careerInterests`: `[String]`
   - `targetRole`: String (required)
   - `rawResumeText`: String
   - `resumeParsedAt`: Date
   - `createdAt`: Date
   - `updatedAt`: Date
2. **`Roadmap` Schema**:
   - `userEmail`: String (indexed)
   - `targetRole`: String (required)
   - `verifiedSkillGaps`: `{ mastered: [String], needsImprovement: [String], missing: [String] }`
   - `marketSkillFrequencies`: `[{ skill: String, frequency: Number, percentage: Number }]`
   - `fastTrackCourse`: `{ skill: String, courseTitle: String, provider: String, url: String, estimatedHours: Number, hiringImpact: String, jobMatchesCount: Number }`
   - `recommendedCourses`: `[{ skill: String, title: String, provider: String, url: String, level: String }]`
   - `savedJobs`: `[{ title: String, company: String, location: String, via: String, applyLink: String, thumbnail: String, qualifications: [String], postedAt: String }]`
   - `createdAt`: Date
3. **`Notification` Schema**:
   - `userEmail`: String (indexed)
   - `type`: `'job_alert' | 'course_cert'`
   - `title`: String
   - `description`: String
   - `actionUrl`: String
   - `badge`: String
   - `isRead`: Boolean
   - `createdAt`: Date

---

### Implementation Steps
1. Install dependencies: `mongoose`, `recharts`, `bcryptjs`, and `@types/bcryptjs`.
2. Configure `.env.local` and `.env` with provided MongoDB URI and SerpApi credentials.
3. Build `lib/mongodb.ts` cached connection and Mongoose schemas: `models/User.ts`, `models/Roadmap.ts`, `models/Notification.ts`.
4. Implement API routes:
   - `POST /api/auth/register` & `POST /api/auth/login` (with demo account generator).
   - `POST /api/user/parse-resume`: intelligent section and skill extractor from text/files.
   - `POST /api/user/profile`: upsert candidate profile.
   - `POST /api/analyze-career`: SerpApi Google Jobs query, skill gap categorization, fast-track calculation, notification generation, and roadmap storage.
   - `GET /api/notifications` & `POST /api/notifications/read`.
5. Connect API server to Vite dev server and production runner.
6. Build frontend components:
   - Sign Up / Log In Modal with seamless Demo Account switch
   - Resume Upload & Data Collection Review Screen
   - Top Header with Notification Tray & User Account Dropdown
   - Fast-Track Spotlight Card with `⚡ Highest Hiring Impact` badge
   - Recharts horizontal gap comparison chart
   - "Where to Apply" Live Job Grid with verified apply buttons
   - Action Plan Timeline with `[Verified Requirement]` and `[AI Recommendation]` badges
7. Compile, lint, and verify the full workflow end-to-end.
