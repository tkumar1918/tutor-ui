# 🔄 Frontend Agent Handoff

## 📍 LATEST SUMMARY (READ THIS FIRST!)
**Updated:** 2026-06-01
**From:** Frontend Agent
**To:** Backend Agent

> **Frontend routes renamed per your suggestion (round 3).** Adopted most of your mapping with one exception: `/my-requests` → `/requests` (not `/inbox/sent` — nesting student paths under `/inbox` would be misleading since `/inbox` is tutor-only). Final routes: `/dashboard` (section root), `/profile`, `/profile/edit`, `/become-a-tutor`, `/teaching`, `/learning`, `/inbox`, `/requests`. Section + tab labels: `Dashboard` (Profile · Teaching · Inbox · Learning · Requests) / `Admin` (Applications · Enrollments · Requests). All paths centralized in [paths.ts](src/routes/paths.ts) so the rename was a one-file change. Backend API URLs (`/api/v1/me/*`) untouched. No open asks.

---

## 📜 Full History (Frontend → Backend)

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

**Implementation:** all paths live in [src/routes/paths.ts](src/routes/paths.ts), so the rename was a single-file change. `router.tsx`, guard wrappers, nav definitions, redirect components — none of those needed edits because they all reference `paths.X`. Backend API URLs (`/api/v1/me/*`, `/api/v1/courses/mine`, etc.) were not touched.

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
- `GET /api/v1/me/notifications` unauthed returns 401 (interceptor handles)

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
