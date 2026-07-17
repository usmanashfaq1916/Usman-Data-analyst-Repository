# UniConnect — Build Prompt (Revised)

> **What changed and why**: The original prompt asks for an entire EdTech startup (12 major systems, AI chatbot, admin panel, auth, two alternate databases, SEO pages, mobile roadmap) in one shot. No AI code generator will produce all of that coherently in a single pass — it'll produce shallow stubs for everything instead of a working product. This revision: (1) picks one tech stack instead of "X OR Y," (2) removes contradictions, (3) breaks the work into buildable phases with a clear MVP, (4) replaces vague asks ("high-quality animations," "modern") with concrete, testable specs, (5) adds the missing pieces an AI needs to actually execute — data shape, empty/error states, and acceptance criteria. Use Phase 1 as your first prompt; feed later phases in separately once Phase 1 works.

---

## Project Objective

Build **UniConnect**, a university admission portal for Pakistani students, as a working Next.js web app. Students should be able to search universities and programs, calculate their admission merit, and see admission deadlines — all from one place.

**Tagline:** "One Portal. Every Pakistani University."

---

## Tech Stack (fixed — do not offer alternatives)

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion (used sparingly — page transitions and card hover states only, not decoration for its own sake)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (email/password + Google OAuth)
- **Hosting target:** Vercel (Postgres via Neon or Supabase)

---

## Design System (concrete values, not descriptions)

| Token | Value |
|---|---|
| Primary (Navy) | `#0A1F44` |
| Secondary (Electric Blue) | `#0066FF` |
| Background | `#FFFFFF` / `#F5F6F8` |
| Success (admission open) | `#16A34A` |
| Warning (deadline near) | `#F97316` |
| Danger (deadline passed / closed) | `#DC2626` |
| Font | Inter (headings 600–700 weight, body 400) |
| Corner radius | `rounded-xl` (12px) on cards, `rounded-lg` on buttons/inputs |
| Card style | White surface, `shadow-sm`, 1px `#E5E7EB` border — skip glassmorphism/blur, it hurts text legibility on data-dense cards |

Build one shared `Button`, `Card`, `Badge`, and `Input` component and reuse them everywhere — don't restyle per-section.

---

## Phase 1 — MVP (build this first)

### 1. Data model (Prisma schema)

```prisma
model University {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  logoUrl       String?
  province      String
  city          String
  type          String   // "Public" | "Private"
  websiteUrl    String?
  admissionUrl  String?
  ranking       Int?
  createdAt     DateTime @default(now())
  programs      Program[]
  admissions    Admission[]
}

model Program {
  id            String   @id @default(cuid())
  universityId  String
  university    University @relation(fields: [universityId], references: [id])
  name          String     // e.g. "BS Computer Science"
  degreeLevel   String     // "BS" | "MS" | "MPhil" | "PhD"
  field         String     // "Computer Science" | "Engineering" | "Medical" | "Business" | "Law" | "Arts"
  minAggregate  Float?     // minimum merit % historically required, if known
}

model Admission {
  id            String   @id @default(cuid())
  universityId  String
  university    University @relation(fields: [universityId], references: [id])
  programId     String?
  openDate      DateTime
  closeDate     DateTime
  status        String   // "upcoming" | "open" | "closing_soon" | "closed"
}
```

Seed the database with **10 real Pakistani universities** (e.g. NUST, FAST-NUCES, COMSATS, LUMS, UET Lahore, Punjab University, Karachi University, IBA Karachi, GIKI, Bahria University) with real names, cities, and provinces, and 2–3 programs each. Use placeholder logos (initials-based avatar) rather than fake image URLs.

### 2. Pages

| Route | Purpose |
|---|---|
| `/` | Home: hero, search bar, admission alert ticker, 6 featured university cards |
| `/universities` | Full list with filters (province, city, type, degree level, field) |
| `/universities/[slug]` | Single university: programs, deadlines, official website + admission portal links |
| `/merit-calculator` | Merit aggregate calculator (see formula below) |
| `/admission-alerts` | List of admissions sorted by closing date, with progress bar per entry |

### 3. Merit calculator — exact formula

Use Pakistan's standard weighted aggregate (let the user pick which one applies, since it varies by program):

- **Engineering:** Matric 10% + Intermediate 40% + Entry Test 50%
- **Medical (MDCAT-based):** Matric 10% + Intermediate 40% + MDCAT 50%
- **General/Business:** Matric 20% + Intermediate 40% + Entry Test 40% (fallback if program has no specific formula)

Formula: `aggregate = (matricPct × w1) + (interPct × w2) × (testScorePct × w3)` — all inputs normalized to percentages before weighting.

Output: numeric aggregate + a plain-language band (`>75% High`, `60–75% Medium`, `<60% Low`) + a filtered list of seeded universities whose `minAggregate` is at or below the student's score.

### 4. Admission alert ticker

Pull the 5 admissions with the nearest `closeDate` that are still `open`, and render as an auto-scrolling ticker with a countdown (days remaining). No push notifications in Phase 1 — that's Phase 3.

### Acceptance criteria for Phase 1

- [ ] Search bar on `/` filters the seeded universities by name/city/program in real time
- [ ] `/universities` filters combine correctly (e.g. province=Punjab AND degreeLevel=BS)
- [ ] Merit calculator produces a numeric result and a recommendation list from real seed data, not hardcoded output
- [ ] Every university detail page links to its real official website and admission portal (use actual URLs, not placeholders)
- [ ] Site is responsive at 375px, 768px, and 1280px widths
- [ ] No console errors; Lighthouse performance score ≥ 85 on `/`

---

## Phase 2 — Accounts & Tracking (build after Phase 1 works)

- NextAuth email + Google login
- Student profile: education details, marks, saved universities
- Application tracker as a 6-stage pipeline (Started → Documents → Fee → Test Scheduled → Merit List → Confirmed), stored per student per university
- Scholarship model + `/scholarships` page with filters (need-based, merit-based, government, university, international)

## Phase 3 — AI Assistant & Admin (build last)

- **UniBot**: a chat panel that calls an LLM API with the student's saved profile (marks, saved universities) as context, so it can answer "where can I apply with 78%?" using real data instead of generic advice
- **Admin dashboard** (role-gated): CRUD for universities, programs, and admissions; publish announcements
- Push/email notifications for saved-university deadline reminders

*(Mobile app and university API integrations are out of scope — revisit only after Phases 1–3 are live and validated with real users.)*

---

## SEO (apply once Phase 1 pages exist — don't build empty SEO shells first)

Generate metadata per page from real data (university count, province name) rather than static copy:
- `/universities/[province]` — e.g. "Universities in Punjab | UniConnect"
- `/universities?field=computer-science` style query-based filtering is fine; only create separate static routes (`/computer-science-universities`) if you need them indexed independently.

---

## Notes for whoever builds this

- Don't implement glassmorphism, gradient blobs, or decorative animation until the functional pages above work — polish is cheap to add later, expensive to redo.
- Pick **one** database (Postgres/Prisma, as specified) — don't scaffold both Prisma and Firebase.
- If official websites or admission portal URLs aren't confirmed for a seeded university, mark the field `null` rather than inventing a plausible-looking URL.
