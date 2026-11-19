# BU Interview Studio — implementation plan

**Delivery target:** A locally hosted, synthetic-data proof of concept covering intake through final BU decision. All work packages and acceptance checks below are planned.

The implementation target is one repeatable hiring journey. HR imports a batch for a Java opening, resolves duplicate rows, and books eligible panelists. L1 and L2 conduct and sign their rounds. A director traces the decision to evidence and, when justified, overrides it. The same application supports an ad hoc interview, an office laptop and a Teams guest.

The [product plan](./product-plan.md) defines hiring behavior, the [architecture](./architecture.md) defines services and data boundaries, and the [design system](./design-system.md) defines component behavior, tokens and accessibility. This plan gives each requirement a delivery point and a way to verify it.

## 1. Delivery order

| Milestone | Depends on | Demonstrable result | Primary reviewer |
| --- | --- | --- | --- |
| M1 · Workspace foundation | Start here | Running application shell, first database migration and repeatable development commands | Engineering |
| M2 · BU setup and demand | M1 | Two directors publish independent BU standards. HR creates an opening and can group applications into a batch. | Director and HR |
| M3 · Intake and preparation | M2 | A workbook and resumes produce applications, reviewed exceptions and usable interview guides | HR and panelist |
| M4 · Booking and session access | M3 screened application | HR books across a shared panel pool. Candidates receive round-scoped access. | HR |
| M5 · Interview execution | M4 booking and M3 guide | A candidate completes an exercise while the panelist records observed evidence | L1 panelist |
| M6 · Evaluation and decisions | M5 | Signed L1/L2 assessments, director review, justified override and HR follow-up | L2 panelist and director |
| M7 · Recovery and rehearsal | M1–M6 | A second person can reset, run, interrupt, restore and repeat the full synthetic journey | Engineering and BU reviewers |

**First working increment.** Start the pnpm workspace, serve the Next.js shell and apply the first PostgreSQL migration. Build BU setup on that foundation. Introduce object storage with question-bank uploads, the worker with brief preparation, ExcelJS with intake, and the isolated Java runtime with the candidate’s Run action. Each integration is validated through its first product workflow.

## 2. Shared acceptance fixture

Use the same fictional case from the first import test to the director demonstration. Add only the records needed by the current milestone. Use AI-generated fictional inputs where helpful, label seeded examples and keep reviewer-approved expected outcomes separate from model output. Extend the deterministic reset as the journey grows.

| Fixture | Expected behavior |
| --- | --- |
| Java BU and a second BU, each with its own director; one shared HR user and panelist | Switching context changes visible records and permissions. A conflict in another BU reveals only that the panelist is busy. |
| Java opening with Azure exposure, second Java opening, batch and ad hoc application | Both intake paths use the same Java standard. A later opening can reuse signed evidence while recording its own client gaps. |
| Candidate with 96 total IT months and 60 Java months; panelists with 60 and 48 Java months | The first panelist meets the experience rule. The second remains ineligible even with greater total tenure. An unknown duration requires confirmation. |
| Vendor workbook with case/space variants of an email, changed phone, empty cell, missing resume and ambiguous units | HR sees a row-level preview, makes a field-level duplicate decision and commits valid rows. Replaying the file preserves the accepted result. |
| Text PDF, DOCX, unreadable scan, ambiguous timeline, mock ID and reviewed Java exercise | Extraction yields traceable passages or an owned exception. ID bytes stay restricted. Mark the exercise with expected outputs and distinguish a wrong answer from an unavailable runner. |
| Signed L1 advance, L2 meets the BU standard, Azure unassessed, recorded client submission | A director override preserves both scores and creates a new HR action. An unrelated BU cannot inspect the record. |

## 3. Work packages and acceptance

### M1 · Establish the workspace and application shell

The [M1 workspace foundation plan](./m1-workspace-foundation.md) details the repository layout, build sequence, database privileges and milestone acceptance checks.

1. Create one pnpm TypeScript workspace for the Next.js App Router web entry point, the worker entry point and shared server-side rules. Pin Biome, commit biome.json and the lockfile, and provide development, type-check, lint, test and production build commands.
2. Start PostgreSQL with a persistent Compose volume. Set up pg, Drizzle migrations, separate migration/runtime credentials and local configuration with example variable names. Make clean start, restart and synthetic reset reproducible; keep reset an explicit command.
3. Apply the design-system CSS once. Use Radix-based shadcn/ui, Tailwind, Lucide and locally bundled assets. Render the staff shell and a separate candidate layout in light and dark themes. Add shared components as their screens arrive.

**Exit evidence:** From the documented commands, the app starts, applies its migration, renders both shells and preserves data through restart. Check build, type checking, keyboard focus and theme contrast. Only the app and database are needed for this increment.

### M2 · Build BU ownership, standards and openings

1. Model staff identity, BU membership, director ownership history and scoped setup grants. Enforce one director per active BU and one active BU per director. Implement an atomic transfer and auditable grant/revocation. Restrict the seeded role switcher to the internal staff surface.
2. Apply transaction-local BU context, row-level policies and BU-scoped foreign keys to reads, writes and jobs. Cover direct resource requests as well as navigation. With a reused database connection, verify that the previous request’s BU context cannot leak.
3. With the first question-bank upload, start authenticated SeaweedFS in Compose. Use the S3 client with a local endpoint and scoped credentials. Store ownership, classification, generated key, checksum and lifecycle in PostgreSQL. Reserve, bound, upload, verify and mark ready; reconcile interrupted uploads. Authorize every download and revoke reads on deletion while tracking eventual byte removal. Separate the documents and identity-image buckets.
4. Implement pack copying, reference import, panelist curation and director publication. Only technically reviewed questions enter the versioned core. Calibrate the starter pack on a synthetic answer and code sample: L1 owns DSA, implementation and core Java; L2 owns service design, troubleshooting and production ownership.
5. Build the opening form with client, role, level, headcount, hiring skill, secondary skills, client exposure and an optional batch. HR can enter the brief manually. Introduce Graphile Worker for pasted-brief extraction using server-side OpenAI via Vercel AI SDK and Zod. Enqueue with the business transaction, persist status, allow HR to edit and confirm, and preserve manual entry through outages. Build web and worker from the same image with separate start commands.
6. Version the opening independently of its BU pack. HR chooses whether pending interviews adopt a revision; completed interviews retain their versions. At M3 the same opening can receive a batch member or an individual application.

**Exit evidence:** A delegate drafts but cannot publish. The director publishes, HR opens a demand and a second BU can publish a different standard. Revoke a grant and retry the write. Interrupt a document upload and restart a brief job; recover without exposing another BU’s files or losing HR’s edit.

### M3 · Deliver intake, preparation and exceptions

1. Implement manual entry and a downloadable XLSX template using one validation model. Include contact and source fields, current company, both durations, primary and secondary skills and resume filename. Require name and email and preserve phone numbers as text. Label units, normalize both durations to months, distinguish zero from missing and flag negative or impossible values. Include template instructions and a sample row. Map vendor headings, preview valid and exception rows, and support partial commit and exception export.
2. Group within-file duplicates, preserve the entered email and offer skip, reuse or update selected fields. Route changed addresses and uncertain matches to HR. Trim and case-fold email and enforce uniqueness within the BU, enforce candidate/opening uniqueness at write time and show field differences before updating a duplicate. Preserve prior values for blank cells. Audit importer, source row and accepted edits. Snapshot relevant skill and months on each application. Concurrent conflicts return to HR for review.
3. Commit accepted application rows, batch memberships and preparation jobs atomically. Enforce row, expanded-file and parse-time limits. Link resumes by unique filename within an import. Upload a replacement as a new version. Use PDF.js and Mammoth to extract passages with page or paragraph locators. An unreadable or ambiguous document creates a specific HR action. Changing one resume queues only affected work.
4. Assemble the published core guide immediately, then enrich it with requirement details, passage-linked claims, code tasks and suggested probes. Reuse the M2 inference boundary. Supply only task-relevant passages and verify evidence ownership and excerpts. Treat uploaded content as data; generated drafts cannot trigger workflow transitions. Represent dates and short engagements as neutral clarification prompts.
5. Track task, input versions, prompt version, model, cost and current status. Bound retries and enforce unique results. Show a saved guide during an outage, expire stale prompts and prevent late output from replacing newer work. Deliver the HR checklist, assigned panelist guide and director exception entry as the visible output of preparation.
6. Let HR screen each application with proceed, clarify or close. Record the human decision and follow-up owner; only proceed makes the application bookable. Intake and preparation never issue an invitation. Exclude timeline observations from eligibility and scores. Make the guide accessible to the assigned panelist once M4 assigns the round.

**Exit evidence:** Round-trip the template and exception export through ExcelJS during intake development, including leading zeros, ambiguous headings and formula cells. Add a late batch member and an ad hoc application; verify their opening versions. Import the shared fixture twice, interrupt it once, then run a competing import. Verify candidate/application counts and accepted fields. Replace a resume while its first job is running and reconnect AI after a manual edit. Only the appropriate current draft is available for review; the original evidence remains traceable.

### M4 · Book qualified panelists and issue candidate access

1. Build the HR panel directory for BU membership, approved scope, confirmed total and skill-specific months, availability, pauses and conflicts. Return an explanation for each ineligible or blocked assignment and revalidate when HR confirms.
2. Store timezone, meeting mode, panelist, round, interval, room or Teams link. Enforce non-overlapping active bookings for a global panelist across BUs with a PostgreSQL exclusion constraint. Invitation preview distinguishes the meeting and exercise links. HR records the external availability check, supplies a distinct Teams link per candidate and round, assigns guest admission and handles delivery. Introduce HTTPS ingress for secure sessions; keep staff demo controls internal.
3. Issue an expiring, round-scoped candidate grant and exchange its secret for a secure session cookie. Keep only the secret hash; scrub it from the address and logs. Authorize every candidate request. End or reschedule the round to revoke already-open sessions.
4. Implement reschedule, cancellation, no-show, withdrawal and hold with owner and next action. Preserve work across rescheduling. Provide HR’s guest admission, camera/ID notice and accessibility instructions for virtual rounds and laptop/room details for office rounds.

**Exit evidence:** Submit competing overlapping bookings from separate BU sessions at the same time. Exactly one confirms; adjacent slots can both confirm. Attempt an ineligible manual assignment. Reschedule and verify the old browser session loses read and write access while the new appointment retains its guide.

### M5 · Conduct the interview and retain evidence

1. Build the private panelist guide with current question, timing, remaining coverage and up to two optional AI probes based on recorded notes. Capture the question actually asked, hints, observed response and evidence links. Keep private prompts out of candidate responses and views.
2. Build the virtual identity-check workflow with visible notice, manual verifier action, result, time and restricted screenshot. A mismatch routes to HR. Verify that only the assigned verifier and handling HR coordinator can retrieve bytes; director and other authorized reviewers see the result.
3. Implement the Run backend with self-hosted Piston and a pinned Java runtime in its dedicated Linux VM. Restrict ingress to the backend, deny candidate network egress and access to application data or secrets, and bound compile/run time, memory, output and process count. Run a reviewed exercise through the application with the runtime preinstalled and internet disconnected.
4. Integrate CodeMirror as the candidate’s single-writer Java editor. Implement revision-aware autosave, visible save acknowledgments, in-tab retry on disconnect, read-only polling by the panelist, Run and Submit. Tie each run to an immutable source, exercise and runtime revision. Compare against trusted expected outputs on the application side.
5. Present observed compile/test results and runner failures distinctly. Retain notes, code and selected submission during interruption. For office coding provide the same task and resource rules on the supplied laptop; for virtual coding run the workspace alongside Teams.

**Exit evidence:** Exercise compilation errors, wrong answers, timeouts and output limits through Run. Run revision A, edit B and submit B. The panelist can identify exactly which revision ran. Stop the runner and disconnect hosted AI during the round. Saved evidence remains usable. Check keyboard entry and exit from the editor, save announcements, and candidate inability to retrieve hidden expectations or staff data.

### M6 · Sign assessments, resolve exceptions and reuse evidence

1. Build the four anchored levels and **unassessed** per competency. Link observations to notes or code. Generate editable evidence-backed feedback; retain AI draft, reviewer changes and signed submission separately. Missing essential evidence produces a visible follow-up or inconclusive outcome.
2. Implement L1 advance, hold and close. Only advance opens L2. Show L2 prior questions, evidence and gaps, with the L1 verdict initially collapsed. L2 independently scores and signs meets standard, falls below standard or needs further evidence. A targeted follow-up produces a dated update.
3. Extend the M3 exception view with blocked bookings, overdue scorecards, missing essential evidence and L1/L2 disagreement. Each entry has an owner, next action and evidence drill-down. Store per-client exposure as claimed, demonstrated, needs follow-up or unassessed. L2’s signature takes effect immediately and remains effective during review. An override requires the owning director, current decision revision and written justification. Commit the revised disposition, audit entry and any affected HR follow-up together.
4. Let HR record client submission and subsequent outcomes. Enable same-BU evidence reuse on another opening after a panelist checks level, age, rubric version and applicability. New client-specific gaps belong to the new application. Source corrections flag affected assessments for review.

**Exit evidence:** Complete the fixture through L2 and client submission, then perform an override. Reject a blank reason, stale revision or wrong-BU actor. From the director brief, open the original L1 note and submitted code. Exercise L1 hold and close without opening L2, and L2 follow-up with a dated amendment. Verify both signed scores, the prior client action and the effective disposition after restart.

### M7 · Prove recovery and rehearse the complete release

1. Restore PostgreSQL, SeaweedFS metadata and objects to a consistent recovery point. Follow a signed scorecard to its original file and verify its checksum. Test immediate access revocation on deletion plus eventual byte removal.
2. Exercise the whole journey with two independent staff sessions and a candidate session. Use deterministic provider responses in regression tests; separately run synthetic samples through the configured OpenAI model to measure unsupported claims, source accuracy, latency and cost. Capture actual findings before pinning the deployment model.
3. Use the completed product for the synthetic pilot rehearsal. An external guest joins the company Teams meeting, opens the approved candidate endpoint and runs Java. Repeat on the office laptop. Record guest admission, ID handling, network reachability, runner results and any recovery action.
4. Collect structured job/run identifiers, queue age, extraction exceptions, stale drafts, Java latency and AI cost. Verify ordinary logs exclude resume text, code, keys, tokens and ID images. Have HR and panelists measure active handling, preparation and editing time against a comparable manual exercise; record sample sizes before setting improvement targets.

**Exit evidence:** Engineering can repeat the reset, rehearsal and restore from a clean environment. HR, panelists and director can each complete their part using the documented four-role workflow. Record each scenario’s environment, build revision, expected and observed results, owner and outstanding defect.

## 4. Verification during delivery

| Check | Execution point | Scope |
| --- | --- | --- |
| Static and unit | Each implementation change | Biome, type check, Vitest and build. Cover experience math, email normalization, state transitions, version selection and effective decisions. |
| Service integration | Each change to persistence, files, jobs or the runner | Real PostgreSQL constraints/RLS with non-owner credentials, transaction rollback, concurrent writes, worker retries, SeaweedFS access and interrupted uploads. Exercise execution limits through the implemented Run path in M5. |
| Role journeys | As each milestone becomes usable | Playwright fixtures for the four roles. Include direct endpoint denials, expired grants, cross-BU contention and ordinary happy paths. Preserve synthetic-only traces for failures. |
| Design-system acceptance | First representative screen in each milestone and again on the integrated journey | Check computed contrast, focus-visible, keyboard and dialog focus restoration in light/dark themes. Check table overflow at 320 CSS px, text zoom, reduced motion and screen-reader feedback. Distinguish saved, pending and failed states using text as well as color. |
| Business acceptance | M3, M5 and M7 reviews | HR reviews import corrections, a panelist inspects the exact run used as evidence, and the director follows a justified override back to the original observations. |

## 5. Coverage by source

| Source obligation | Delivery and verification |
| --- | --- |
| Product §§1–3 · BU scope, four roles, published standards, batch and ad hoc demand | M2 creates ownership and versioned openings; M3 creates applications; M4–M6 enforce assigned-round access. |
| Product §4 · Vendor intake, identity resolution, parallel preparation and HR screening | M3 validates manual and workbook intake against the same rules, then hands a screened application to M4. |
| Product §§5–6 · Two interview modes, ID handling, evidence, scores and final decision | M4 schedules; M5 captures actual work; M6 signs, overrides and reuses evidence. |
| Product §§7–9 and architecture §§8–9 · Offline operation, release measures and pilot readiness | M2–M6 exercise local fallback as each feature lands; M7 verifies integrated recovery, guest access and measured outcomes. |
| Architecture §§1–7 · Service placement, libraries, access, retries and isolation | M1 owns the shell/database; M2 introduces scoped storage, workers and AI; M3 applies idempotency to bulk intake; M5 isolates execution; M6 preserves historical decisions. |
| Design system §§1–6 · Shared tokens, components, role patterns and accessibility | M1 installs the theme; M2–M6 validate each pattern in its actual workflow using the checks in section 4. |

## 6. Completion boundary

The POC is ready for BU demonstration when the local end-to-end journey and recovery checks pass using synthetic data, including worker interruption and restore. Record the external Teams guest and office-laptop journeys against the working application when assessing pilot readiness. Record observed failures and their owners until the affected scenario passes.

Real-applicant rollout is a separate release decision. It requires corporate staff identity through OIDC, approved external candidate access, and company approval and verification of notice, retention, deletion, restricted identity-image access and hosted AI handling. Native video, transcription, calendar synchronization and candidate self-booking remain outside this build.
