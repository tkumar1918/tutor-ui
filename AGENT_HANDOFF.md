# 🔄 Frontend Agent Handoff

## 📍 LATEST SUMMARY (READ THIS FIRST!)
**Updated:** 2026-06-03
**From:** Frontend Agent
**To:** Backend Agent

> **Same-origin API via nginx reverse proxy** (per your earlier rec). The browser was making baked-in `localhost:8080` calls on deploy because Vite bakes `VITE_API_BASE_URL` at build time. Fix in three parts: (1) `VITE_API_BASE_URL=/api` everywhere — bundle is now host-agnostic. (2) Finished the earlier `/api/v1/` → `/v1/` rename in `auth` + `courses` (the partial commit `99b1865` had missed them). (3) Added an nginx `location /api/` block proxying to `http://backend:8080`; frontend container joins your `tutor-api_default` network as external so `backend` resolves. **One small coupling ask for you below.** Deployed and verified on `92.4.81.1`: `GET /api/v1/courses` via the proxy returns 200; SPA still serves at `/`.

---

## 📜 Full History (Frontend → Backend)

### Frontend → Backend (2026-06-03) — round 8
**From:** Frontend Agent

**Round: same-origin API, nginx reverse proxy, shared docker network**

**Symptom on the deployed instance:** the SPA was issuing requests to `http://localhost:8080/...` from the user's browser (which obviously can't see the server's localhost). Root cause: `VITE_API_BASE_URL=http://localhost:8080` was baked into the bundle at build time — fine for local dev, broken everywhere else.

**Fix shape (matches your suggestion of "swap baseURL → /api, drop /api from code"):**

1. **`VITE_API_BASE_URL=/api`** in `.env.example`, `docker-compose.yml`, and the Dockerfile `ARG` default. Bundle now hits whatever origin served it, on `/api/*`.

2. **Code paths:** the existing commit `99b1865` had renamed `/api/v1/...` → `/v1/...` in `me`, `tutors`, `enrollments`, `tutoring-requests`, `tutor-applications` — but missed `auth` and `courses`. Finished both. `grep -rn "api/v1" src/` now returns empty.

3. **nginx reverse proxy** ([nginx.conf](nginx.conf)):
   ```nginx
   location /api/ {
     proxy_pass http://backend:8080;
     proxy_http_version 1.1;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
   Browser hits `/api/v1/courses` (same origin) → nginx forwards to `http://backend:8080/api/v1/courses` (your contract unchanged).

4. **Shared docker network** ([docker-compose.yml](docker-compose.yml)) — frontend joins your `tutor-api_default` as an external network so `backend` resolves via docker DNS:
   ```yaml
   networks:
     - default
     - tutor-api_default
   networks:
     tutor-api_default:
       external: true
   ```

**Verified on `92.4.81.1`:**
| Test | Result |
|---|---|
| `GET http://localhost:3000/api/v1/courses` | 200 (public, proxied through to backend) |
| `POST http://localhost:3000/api/v1/auth/login` (bad creds) | 401 (request reached auth controller) |
| `GET http://localhost:3000/` | 200 (SPA still serves) |
| `tutor-ui` container | healthy on `:3000` |

**Ask for you (small): consider promoting the shared network to an explicitly-named external network.** Right now I'm grabbing `tutor-api_default` (the auto-generated name from your compose project). That's brittle — if the backend repo dir ever renames or your compose project name changes, my proxy breaks. The clean version is a one-line addition on both sides:

```yaml
# both repos' docker-compose.yml
networks:
  tutor-net:
    external: true
```

with `docker network create tutor-net` run once on the box. Until you adopt it, I'm pinned to your network's auto-name. **Not urgent** — current setup works.

**No other open asks.** Backend contract untouched.

---

### Frontend → Backend (2026-06-02) — round 7
**From:** Frontend Agentx

**Round: healthcheck hotfix + remote deploy**

**Bug:** `tutor-ui` container had been sitting `Up N hours (unhealthy)` even though it was serving requests fine on the published port. Root cause was the healthcheck command:
- Dockerfile / compose ran `wget -q -O - http://localhost/`
- BusyBox `wget` (bundled in `nginx:alpine`) tries IPv6 first when resolving `localhost`
- nginx's default `listen 80;` binds IPv4 only (`0.0.0.0:80`), not `[::]:80`
- → `::1` connection refused, no fallback to IPv4, exit 1 → unhealthy forever

**Fix:** swap `http://localhost/` → `http://127.0.0.1/` in both healthchecks. Inline comment in each file explains the why so future-me doesn't "clean it up". Commit `780389c`.

**Remote deploy** to `ubuntu@92.4.81.1` (instance has both `~/tutor/tutor-api` and `~/tutor/tutor-ui` checked out):
- `git pull --ff-only origin dev` → fast-forward `c00a726..780389c`
- `docker compose up -d --build` → image rebuilt, container recreated
- Verified: `tutor-ui` reports `Up N seconds (healthy)` within first interval; health log shows the SPA HTML being returned correctly

**Current remote state:**
| Container | Status | Port |
|---|---|---|
| `tutor-ui` | healthy | `0.0.0.0:3000->80` |
| `tutor-api` | healthy | `0.0.0.0:8080->8080` |

**Note for backend:** the frontend port on the instance is `3000`, not the canonical Vite `5173`. If you have any cross-repo docs referencing the published frontend port, that's the value to use.

**No outstanding asks for backend.**

---

### Frontend → Backend (2026-06-02) — round 6
**From:** Frontend Agent

**Round: Docker + docker-compose**

Containerized the frontend, with a compose file matching the pattern you established in the backend round 4 (each repo self-contained, two terminals = full stack).

**Files added:**
- [Dockerfile](Dockerfile) — multi-stage. `node:22-alpine` builds the SPA, `nginx:1.27-alpine` serves it. Final image ~75 MB. Uses `npm install --no-audit --no-fund` instead of `npm ci` because the lockfile is host-platform (glibc) and doesn't list every musl-only `@emnapi/*` fallback; lockfile still pins versions, just non-strictly. Inline comment explains.
- [nginx.conf](nginx.conf) — SPA `try_files` fallback, 1-year cache on hashed `/assets/*`, no-cache on `index.html`, gzip on text content. (Sanity-tested: `try_files` fallback responses inherit the `Cache-Control` from `location = /index.html` — nginx is well-behaved.)
- [.dockerignore](.dockerignore) — keeps `node_modules`, `dist`, `.git`, `.claude`, markdown, `.env*` (except example) out of build context.
- [docker-compose.yml](docker-compose.yml) — frontend service only, port `5173:80` (matches Vite dev port for muscle memory), `VITE_API_BASE_URL` via `${VAR:-http://localhost:8080}` so `.env` can override without touching the file. Healthcheck duplicated from Dockerfile for compose-level visibility.
- [.env.example](.env.example) — enriched with a comment explaining Vite bakes the URL at build time (rebuild image to change).
- [.gitignore](.gitignore) — added `.env` / `.env.*` (with `!.env.example` exception).

**Local full-stack flow** (matches your suggestion exactly):
```bash
# Terminal 1
cd tutor-api && docker compose up --build
# Terminal 2
cd tutor-ui && docker compose up --build
```

**Build arg gotcha noted:** since Vite bakes `VITE_API_BASE_URL` at build time, one image = one API URL. The default `http://localhost:8080` works for "browser on host hits backend on host:8080" (the standard local-dev case). For staging/prod, either rebuild per env or switch to a reverse-proxy / runtime-config pattern. Documented in the Dockerfile and .env.example.

**Smoke test:** `docker compose up --build` succeeded, container reports healthy, both `/` and SPA-fallback paths (`/courses`, etc.) return 200.

**Repo also went onto GitHub this round:** `git init` + `main` + `dev` branches; remote is `https://github.com/tkumar1918/tutor-ui` (public). Working on `dev`. Two prior commits on `dev` ahead of `main`: the Dockerfile work and a `.claude/settings.json` allowlist expansion.

**No outstanding asks for backend.**

---

### Frontend → Backend (2026-06-01) — round 5
**From:** Frontend Agent

**Round: route renames + label cleanup**

Adopted the route-rename suggestions from your round 3 handoff. Mapping applied:

| Old | New |
|---|---|
| `/my` | `/dashboard` |
| `/me`, `/me/edit` | `/profile`, `/profile/edit` |
| `/me/apply-tutor` | `/become-a-tutor` |
| `/my-courses` | `/teaching` |
| `/my-enrollments` | `/learning` |
| `/my-requests` | `/requests` (not `/inbox/sent` — explained below) |
| `/tutor-inbox` | `/inbox` |
| `/tutor-profile/edit`, `/admin/*` | unchanged |

**Why not `/inbox/sent` for the student outgoing requests:** `/inbox` is tutor-only (gated by `RequireTutor`). Nesting the student's outgoing under it would imply the inbox is a shared concept; it isn't. Flat `/requests` is clearer.

**Label tweak for symmetry:** the Dashboard "Enrolled" tab is now "Learning" so it pairs cleanly with "Teaching".

**Result:**
- Top nav (admin+tutor): `Courses · Tutors · Dashboard · Admin`
- Dashboard sub-nav: `Profile · Teaching · Inbox · Learning · Requests`
- Admin sub-nav: `Applications · Enrollments · Requests`

**Implementation:** all paths live in [src/routes/paths.ts](src/routes/paths.ts), so the rename was a single-file change. `router.tsx`, guard wrappers, nav definitions, redirect components — none of those needed edits because they all reference `paths.X`. Backend API URLs (`/v1/me/*`, `/v1/courses/mine`, etc.) were not touched.

**Verified:** `tsc -b --force`, `eslint .`, `vite build` — all clean.

**No outstanding asks for backend.**

---

### Frontend → Backend (2026-06-01) — round 4
**From:** Frontend Agent

**Round: two-tier nav (sections)**

The previous round's dropdowns (`My ▾`, `Admin ▾`) became plain links pointing at `/my` and `/admin`. Those routes are thin redirects (`MySectionRedirect`, `AdminSectionRedirect`) that resolve to the first sensible child for the user.

Below the top header, a new `SectionSubNav` component renders when the current path is in either section. Style is underlined tabs:
- **My** tabs (gated by role): Profile · My courses (tutor) · Inbox (tutor) · My enrollments · My requests
- **Admin** tabs (admin only): Applications · All enrollments · All requests

Top-level `My` and `Admin` highlight whenever any of their child paths are active (prefix-matched). Notification counts (`/me/notifications`) appear on the top label and on the specific child tab — same source, double-rendered for visibility.

**Files:**
- New: [src/components/common/count-badge.tsx](src/components/common/count-badge.tsx) (extracted; was inline in NavBar)
- New: [src/components/layout/section-sub-nav.tsx](src/components/layout/section-sub-nav.tsx)
- New: [src/routes/section-redirects.tsx](src/routes/section-redirects.tsx) — `MySectionRedirect`, `AdminSectionRedirect`
- Modified: [src/components/layout/app-shell.tsx](src/components/layout/app-shell.tsx) — mounts `<SectionSubNav />` between header and main
- Modified: [src/components/layout/nav-bar.tsx](src/components/layout/nav-bar.tsx) — dropdowns gone; plain section links with prefix-aware active state
- Modified: [src/routes/router.tsx](src/routes/router.tsx) — `/my` under `RequireAuth`, `/admin` under `RequireAdmin`
- Modified: [src/routes/paths.ts](src/routes/paths.ts) — `mySection: '/my'`, `adminSection: '/admin'`

**No outstanding asks for backend.**

---

### Frontend → Backend (2026-06-01) — round 3
**From:** Frontend Agent

**Round: notification badges + nav decluttering**

**`/me/notifications` integration:**
- `NotificationCountsResponse { tutorPendingRequests, adminPendingApplications }` added to types
- `getNotificationCounts()` in `features/me/api.ts`
- `useNotificationCounts()` hook in `features/me/hooks.ts` — `enabled: !!token`, `staleTime: 30_000`
- `qk.me.notifications()` query key under the existing `me` namespace
- Invalidations added:
  - `useRespondToTutoringRequest` → drops tutor pending count after accept/reject
  - `useReviewApplication` → drops admin pending count after approve/reject
  - `useApplyForTutor` was already invalidating `qk.me.all` (covers notifications)

**Nav badges:**
- `CountBadge` component (small primary-colored pill, "99+" cap)
- Badges render on **Inbox** inside `My ▾` and **Applications** inside `Admin ▾`
- Each dropdown trigger shows an aggregate count of its children's badges, so users see pending work without opening the menu
- Copy in CountBadge uses `aria-label="N pending"` — matches the "counts go down when item leaves PENDING" semantics; no "mark as read" affordance anywhere

**Independent UX cleanup (not driven by a backend round):**
- Nav was 9 inline chips for admin+tutor users (Courses · Tutors · My courses · Inbox · My enrollments · My requests · All enrollments · Applications · All requests)
- Collapsed to: `Courses · Tutors · My ▾ · Admin ▾` — public links flat, personal under `My ▾`, admin under `Admin ▾`
- Dropdown trigger highlights when one of its children is active
- New `NavGroup` component in `nav-bar.tsx` is the only structural addition; visibility logic moved from per-item to per-group

**Verification:**
- `tsc -b --force`, `eslint .`, `vite build` — all clean
- `GET /v1/me/notifications` unauthed returns 401 (interceptor handles)

**No outstanding asks for backend this round.**

---

### Frontend → Backend (2026-06-01) — round 2
**From:** Frontend Agent
**Round: integrate qualifications/yearsOfExperience + full tutoring-request feature**

**Tutor profile (new fields, ends-to-ends):**
- `qualifications` (optional, ≤500 chars) and `yearsOfExperience` (0–60, required on apply, optional on update) added to `TutorProfileResponse`, `TutorApplicationRequest`, `TutorUpdateRequest`
- `tutorProfileSchema` (shared zod schema) extended with both fields
- `TutorForm` now renders: bio textarea → qualifications textarea → 3-column row (expertise / yearsOfExperience / hourlyRate)
- `ApplyTutorPage` simplified to reuse `TutorForm` directly (was previously a near-duplicate form)
- Detail page, MePage tutor card, and admin ApplicationCard all surface the two new fields

**New feature: `tutoring-requests`** ([src/features/tutoring-requests/](src/features/tutoring-requests/))
- `api.ts`: createTutoringRequest, listMyTutoringRequests, listIncomingTutoringRequests, listAllTutoringRequests, getTutoringRequest, respondToTutoringRequest, cancelTutoringRequest
- `hooks.ts`: paired `useXxx` for each, with token-gating on private queries and cache invalidation on mutations
- `schemas.ts`: createRequestSchema (subject + message) and respondRequestSchema (status ACCEPTED|REJECTED + optional tutorReply)
- `request-card.tsx`: reusable card with `perspective` prop (student / tutor / admin) — controls headline framing
- `request-status-badge.tsx`: PENDING/ACCEPTED/REJECTED/CANCELLED badge variants
- `request-session-dialog.tsx`: opened from TutorDetailPage (only when authed AND not self)
- `respond-dialog.tsx`: accept/reject with optional `tutorReply`
- Pages: `MyRequestsPage` (student, cancel button on PENDING only), `TutorInboxPage` (tutor, accept/reject buttons on PENDING only — handles 404 "not a tutor" and 422 "pending approval" as distinct empty states per backend note), `AdminRequestsPage` (filters: studentId + tutorId + status, no row actions)

**Routes + nav:**
- Added paths: `/my-requests` (auth), `/tutor-inbox` (tutor), `/admin/tutoring-requests` (admin)
- NavBar grew: `Inbox` (tutor), `My requests` (auth), `All requests` (admin)

**Self-request prevention:** TutorDetailPage hides the `Request session` button when `me.user.id === tutor.userId`. (Backend already blocks with 422, but we don't even let it get attempted.)

**Verification:**
- `tsc -b --force`, `eslint .`, `vite build` — all clean
- Smoke: `/tutoring-requests/mine` and `/tutoring-requests/incoming` return 401 `MISSING_TOKEN` when unauthed (interceptor handles it)
- Existing seeded data (alice→ada PENDING, grace→linus ACCEPTED, dave→ada REJECTED) will populate the inboxes on first login

**No outstanding asks for backend this round.**

---

### Frontend → Backend (prior, undocumented — caught up)
**From:** Frontend Agent

These rounds happened during the conversation before the handoff workflow was followed. Documenting here so the historical context survives.

- **Major refactor for v2 spec:** removed `students` feature entirely, removed admin tutor CRUD (replaced by application flow), renamed `MeResponse` → `CurrentUserResponse`, switched auth from single `role` to `authorities[]` (helpers `isAdmin`/`isTutor`), added `/me` + `/me/edit` + `/me/apply-tutor` pages, added `/admin/tutor-applications` (as expandable cards, not table), added `/courses/mine` ("My courses") and `/enrollments/mine` ("My enrollments") and `/courses/{id}/enrollments` ("Students" section on course detail).
- **Async cache fix:** logout now also calls `qc.clear()` so the next user doesn't see the previous session's data.
- **UX:** "Already enrolled" badge on course detail (replaces Enroll button when there's a matching `/enrollments/mine` row).
- **`hourlyRate` → `hourlyRateCents` migration:** form keeps dollars (UX), converts to cents at the boundary; `formatHourlyRate(cents)` divides by 100.
- **401 discriminators:** axios interceptor switches on `code` (`INVALID_CREDENTIALS` → silent inline alert in login form; `TOKEN_EXPIRED` / `TOKEN_VERSION_MISMATCH` → toast + redirect; `MISSING_TOKEN` / `INVALID_TOKEN` → silent redirect). 403 emits a toast and stays on page.
- **PII hardening:** dropped all tutor-email displays after backend removed `email` from `TutorProfileResponse`.
- **Workflow gap acknowledged:** I was not updating `AGENT_HANDOFF.md` after each round — switching to that going forward.
