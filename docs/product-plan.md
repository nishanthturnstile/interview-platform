# BU Interview Studio — final product plan

**19 November 2026 · Local proof of concept · First capability pack: Java backend**

## 1. Product outcome

An HR coordinator can take a vendor workbook and a folder of resumes, assign them to one client requirement, and spend the rest of intake resolving exceptions. A panelist can open an assigned interview, see what needs testing, conduct it in Teams or in the office, and sign feedback backed by the candidate’s actual work. A director can open a disputed decision and trace it to the question, answer or code that prompted it.

Each business unit (BU) sets its hiring standards. An opening records demand for a role and level. The unit of assessment is one candidate’s application. A batch groups applications for the same opening. Its members share a requirement and assessment standard, while each keeps their own appointments, evidence and outcome. An ad hoc interview uses the same workflow with one application and no batch.

**Success case.** A senior Java candidate meets the BU standard for coding, service design and troubleshooting. Their Azure production experience remains unverified. HR can arrange a short Azure follow-up for the Microsoft opening or consider another Java opening using the signed BU assessment. Neither action rewrites the original decision.

## 2. Ownership and access

Each active BU workspace has exactly one director. A director owns one active BU at a time. When ownership changes, transfer it in one step and retain the ownership history. HR coordinators and panelists can hold memberships in several BUs under one identity. The director can grant or revoke setup permission for an existing member. Record who granted it and when. The delegate can draft configuration. The director publishes standards and the BU’s role and skill requirements. A staff member serving two BUs switches context explicitly. Candidate search, downloads, worker jobs and reports all use that context.

| Role | Routine actions | Decisions and visibility |
| --- | --- | --- |
| Director | Define capability packs, nominate a setup delegate, approve shared question revisions with senior panelists. | Opens on exceptions. May inspect every assessment and decision in their BU, resolve disagreement and review any ordinary disposition. |
| HR | Own openings and batches, intake, resume corrections, panel roster, availability, scheduling, invitations and outcome tracking. | Confirms duplicate updates, screening disposition and bookings. Sees signed feedback and follow-up actions. May coordinate question maintenance. |
| Interview panelist | Maintain question content, prepare and conduct assigned rounds, review evidence and submit feedback. | Chooses questions, confirms observations and signs their assessment. Assigned L2 reviewers can inspect the L1 record. |
| Candidate | Receive joining instructions, format, reference-material rules and coding task. | Access limited to their own appointment and exercise. Private prompts, tests reserved for evaluation, other candidates and scorecards stay in staff views. |

For the synthetic POC, the staff demonstration has a role switcher. A candidate opens a separate link scoped to their round and exercise. The link provides no staff role controls. Rescheduling revokes the old link, and ending the session closes candidate access. Corporate identity, verified candidate access and real-data controls are prerequisites for use with actual applicants.

## 3. BU setup and demand intake

The director or setup delegate drafts a pack with the role family, levels, primary hiring skill, round responsibilities, essential competencies and rating anchors. HR maintains the eligible panel pool. A director can copy a starter Java pack and change it without changing another BU. HR selects the pack when opening a demand and adds client, role, level, headcount, primary skill, optional secondary skills and evidence the client wants.

| Initial Java pack | What the panel establishes | Example evidence |
| --- | --- | --- |
| L1 core | DSA, implementation, tests and core Java at the target level. | Candidate implements a solution, explains complexity, exercises a boundary case and discusses Java behavior. |
| L2 core | Microservices, design tradeoffs, troubleshooting and personal ownership in production. | Candidate explains a service failure, its diagnosis and how they verified the fix. |
| Opening-specific exposure | Azure, Angular, React, Python or reactive programming as the opening requires. | Candidate describes their own Azure deployment work. Record claimed, demonstrated, needs follow-up or unassessed, with a source. |

Client needs can be captured during a natural L1/L2 exchange. Schedule a separate follow-up only for a material unresolved question. Director and panelists define what constitutes meeting the BU bar at each level. For the first pack, two panelists independently score a synthetic answer and code sample against the proposed anchors. The director publishes the calibrated pack. HR uses its approved version for new openings.

HR may paste a client brief and review an extracted draft once for the entire batch. Adding a late candidate inherits the selected version. Editing the brief shows HR which pending interviews would change and lets them adopt the revision explicitly. Completed rounds keep their original brief, pack and question versions.

## 4. Candidate intake and automatic preparation

**Excel template.** Offer a downloadable .xlsx template with a sample row, column definitions and experience units. Allow HR to map vendor headings once per import. Manual entry uses the same fields and validation.

| Fields | Intake behavior |
| --- | --- |
| Name, email, phone, current company, vendor/source | Require name and email to create a record. Preserve phone as text. Allow missing company or phone and flag missing contact data when needed for scheduling. |
| Total IT experience, relevant IT experience, relevant skill | Collect both durations in years and months, store whole months and name the opening’s primary skill beside the relevant duration. Zero is a value. Unknown stays pending. Flag negative values, ambiguous units and relevant duration exceeding total. |
| Primary skill 1, primary skill 2, secondary skills | Preserve the candidate’s reported skills. Relate relevant experience to the hiring skill even when the ordering on the vendor sheet differs. |
| Resume filename, optional vendor reference | Attach uploaded PDF/DOCX files by exact unique filename within the import. Report missing, ambiguous and unreadable files. HR can attach or replace a resume later. |

1. **Preview.** Select BU and opening, optionally a batch. Preview valid, incomplete, invalid and duplicate rows with row numbers. HR can commit valid rows and download the exception rows for correction.
2. **Resolve identity.** Email is unique within each BU after trimming surrounding whitespace and case-folding. Preserve the entered address. Repeating an email within the file presents one conflict group. For an existing record, show field differences and offer skip, reuse for this opening, or update selected fields. Empty cells preserve existing values. A changed email or conflicting identity goes to HR for verification. Cross-BU matches reveal no candidate information.
3. **Commit once.** Enforce uniqueness at write time. If another import wins a race, return the affected row to review. Store relevant experience by skill and snapshot the confirmed value on the application. Updating a profile preserves the experience used for earlier bookings and decisions. Re-uploading the same sheet or retrying after interruption creates no second application for the same candidate and opening, no duplicate batch membership and no repeated preparation for identical inputs. Record importer, source row, accepted changes and resume version.
4. **Prepare in parallel.** After commit, create the HR checklist and director status immediately. Use available opening data to assemble the core guide while the worker extracts resume passages and employment dates. Enrich the guide with relevant claims, probes and available coding tasks when inputs arrive. Only activate work that has its prerequisites. An unreadable resume leaves the standard guide available and an HR action to replace it.
5. **Deliver by role.** HR gets missing fields, duplicate decisions and eligible panel choices. The assigned panelist gets a ready guide, relevant passages and suggested follow-ups. The director sees unresolved material exceptions with owner and next action. The candidate receives HR-confirmed logistics. Intake never sends an invitation or commits a hiring decision automatically.

**Timeline clarification.** Show the dated entries behind an apparent gap, overlap or succession of short engagements. Distinguish month-level dates from year-only dates, project assignments from employers and current roles from missing end dates. Offer a neutral prompt such as “Were these projects with one employer, and which involved hands-on Java?” Allow correction or dismissal. Exclude tenure patterns, personal reasons for leave and speculative credibility labels from competency scoring and shortlist rules.

## 5. Scheduling and conducting the interview

HR maintains approved panelists, skill and round coverage, confirmed total and relevant months, availability and pauses. Filter by BU, round authorization, configured experience rule, conflicts and availability. Explain exclusions and recheck when HR confirms, including manual assignment. Compare confirmed months in the opening’s primary skill only. A panelist needs at least as many relevant months as the candidate. For a Java candidate with eight years in IT and five in Java, a panelist with five Java years meets the experience threshold. A panelist with twelve IT years and four Java years falls short. HR confirms missing relevant durations before booking. Total IT experience remains available as background.

HR records the panelist, time, timezone, mode and Teams link or office room. Check overlapping local bookings atomically across all BUs served by that panelist. Show a busy slot without disclosing another BU’s interview details. Show that external availability was checked by HR. Preview the invitation with separate meeting and exercise details. Rescheduling preserves the guide and evidence, supersedes the old appointment and prompts HR to communicate the change. Handle cancellation, no-show, withdrawal and hold independently of technical assessment results.

| Moment | Virtual | In office |
| --- | --- | --- |
| Before | HR creates the Teams meeting using the normal company process and pastes the join link. Share the candidate exercise link separately. Tell candidates they are expected to keep their camera on and can contact HR for an accessibility or connectivity arrangement. | HR reserves a room and, for a coding round, a company laptop with the candidate view and runner tested. Provide the same task and resource rules as the virtual round. |
| During | Teams carries audio and video. Interviewer camera is optional. Candidate opens the scoped coding view alongside Teams. Panelist uses a private guide, marks questions asked, records short notes and sees saved code and run results. | Panelist works on their own device. Candidate uses the prepared laptop only when a task needs it. Discussion-only rounds need one panelist device. The two views can share a local network. |
| On interruption | Save notes and code. HR can reconnect or reschedule the remaining portion. Record a camera or connectivity issue as logistics. | If the laptop or runner fails, capture the candidate’s explained approach or written work, mark execution unverified and arrange a comparable coding follow-up where required. |
| After | Panelist completes feedback from notes and submitted code. | End the candidate session, clear its local access and retain submitted work in the application record. Notes and code support the same feedback flow. |

HR creates a distinct Teams meeting per candidate and round and assigns someone to admit the guest. Browser joining, identity verification and lobby behavior depend on tenant settings. A meeting link grants no automatic transcript access. Rehearse with an external email address and check guest admission under the company’s Teams settings. [Microsoft guest joining guide](https://support.microsoft.com/en-us/teams/meetings/join-a-meeting-without-an-account-in-microsoft-teams) · [Teams recording controls](https://learn.microsoft.com/en-us/microsoftteams/manage-meeting-recording-options)

**Virtual identity check.** HR includes advance notice of the camera check and screenshot in the invitation. At the start of the call the candidate shows government-issued photo ID to the camera. The assigned panelist checks the photo and name against the attendee and booking, manually captures the screenshot and attaches it to a restricted identity-check record with the verifier, time and result. A mismatch or unreadable image goes to HR for clarification or rescheduling. Only the assigned verifier and HR coordinator handling the identity check may open the image. Other authorized reviewers, including the director, see the check result. Keep the image out of AI inputs, interview feedback and ordinary exports. In development, rehearse with visibly fictional ID cards and synthetic screenshots only.

A remote candidate needs a reachable candidate workspace. For the local demonstration use two devices on a reachable test network and label that limitation. Validate company-approved external access before claiming remote pilot readiness.

## 6. Interview assistance, evidence and decisions

Import a BU’s existing question collection as reference material. Director and panelists curate by role, level, competency, expected time, acceptable approaches and rating anchors. HR can help source material. A reference document or generated variant enters the reusable core only after technical review. Use comparable core questions per pack version. Adaptive probes clarify the candidate’s actual answer or fill a coverage gap. Common core questions and anchored ratings follow established structured-interview practice. [OPM structured interview guidance](https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/)

During the session show the current question, time budget, uncovered competencies and up to two optional probes. For example, a panelist notes that a candidate retried failed requests. The assistant suggests asking how they prevented a duplicate payment when the first response was lost. Record the question actually asked, any hints, the candidate’s response and the source. A suggestion alone is never evidence.

The starter exercise permits the provided editor, Java runner and standard library. State the resource rules before the round. For Java exercises, provide an in-platform editor, explicit Run action, reviewed test cases, output, timestamped snapshots and final submission. Use an isolated executor with bounded time, memory and restricted network access. Persist code even when execution fails. Distinguish test failures from runner failures and attach the candidate’s explanation to the artifact.

| Decision point | System prepares | Accountable person |
| --- | --- | --- |
| Screen and schedule | Relevant claims, missing inputs and feasible panel choices. | HR confirms proceed, clarify or close, then books the round. |
| L1 completion | Editable feedback by competency with references to notes or code and unanswered questions. | The L1 panelist scores the actual answers and work, uses or edits AI suggestions at their discretion, and signs the round outcome (advance, hold or close) with a rationale. |
| L2 completion | Prior evidence, questions already asked and remaining gaps. Keep the L1 overall verdict collapsed by default. | The L2 panelist independently scores the candidate’s answers and work, considers optional AI suggestions, records BU capability and client exposure separately, and signs the BU outcome and gives a rationale. The available outcomes are meets the standard, falls below the standard and needs further evidence. |
| Final disposition | Concise summary of signed assessments, disagreement, missing evidence and possible next actions. | The signed L2 decision takes effect immediately and remains effective during any director review. The BU director may let it stand, discuss it privately with L2, or override it with a written justification. Record the director, timestamp, original and revised disposition, and reason. Preserve both panelists’ signed scores. HR sees the effective decision immediately and receives an action if an override affects a planned or completed client submission. Retain the history of HR actions and client outcomes. |

The human review step applies to screening as well as final selection. The reviewer can inspect the sources, correct the draft and choose a different outcome. OpenAI’s usage policy covers automated employment decisions without human review. [OpenAI usage policies applicable on the planning date](https://openai.com/policies/usage-policies/revisions/2025-10-29/)

Use four anchored levels (fundamentals missing, partial, meets, exceeds) plus **unassessed**. Each required competency needs an observed answer or artifact to support its rating. Missing evidence on an essential skill surfaces a follow-up or inconclusive result. The director sees the exact points of disagreement and can assign targeted reassessment. Preserve the model draft, reviewer edits, signed decision and dated amendments. Corrections to a source flag affected drafts and signed assessments for review.

An L1 close ends the application at L1. An L1 hold returns it to the named follow-up owner. Only an advance opens L2. When L2 needs further evidence, HR arranges the targeted follow-up and L2 signs a dated update.

The director’s landing view lists unresolved decisions, overdue feedback, blocked scheduling and missing essential evidence. Each entry has an owner and next action. From any application the director can open the BU conclusion, client-specific readiness, round feedback and original evidence. HR can link a signed assessment to a later opening after a panelist confirms level, version, age and applicability. New gaps become a new assessment task.

## 7. Implementation and offline operation

Use one local application, one relational database, local artifact storage and a persisted background worker. Prefer maintained open-source components with suitable licenses for workbook handling, editing, database access and isolated Java execution. Validate workbook compatibility during intake implementation and run the starter Java exercise when integrating the coding workspace. Teams is the existing meeting service and OpenAI is the requested hosted inference provider.

Keep OpenAI calls server-side behind a small interface. Use the Vercel AI SDK OpenAI provider for direct calls with a server-held key. [Vercel provider documentation](https://github.com/vercel/ai/blob/main/content/providers/01-ai-sdk-providers/03-openai.mdx)

Validate generated fields, evidence IDs and BU/application scope before displaying a draft. Send only necessary passages and role context. Document text and candidate answers are data and cannot instruct the worker to take actions. Store input versions and job status so a retry or late result cannot replace newer human work.

| Operating condition | User-visible behavior |
| --- | --- |
| Internet unavailable, local app reachable | Import, local scheduling, cached guides, manual notes, local coding and human feedback work. Pending AI jobs show their status. Teams and new hosted inference require connectivity. |
| Connection restored | Retry eligible pending jobs for current input versions. Show new drafts for review and preserve already signed feedback. |
| No recording or transcript | Panelist notes and code remain sufficient inputs for a draft. Mark gaps as unassessed. Capture permission and participant notice must precede any future recording feature. |

**Scope deferred until demonstrated demand.** Native video, a Teams bot, transcript import and live transcription, automatic corporate invites, candidate self-booking, several languages of code execution, interviewer certification ladders and analytics on client outcomes each add a distinct integration or operating process. Measure the first workflow before choosing among them. Keep the author, time and result of each round so basic contribution counts remain available.

## 8. Delivery sequence and release evidence

| Slice | What the team demonstrates to the BU | Pass condition |
| --- | --- | --- |
| 1. Standards and access | The director creates a BU with its own workspace, delegates setup to a panelist and publishes the panelist’s Java pack. | Two BUs have distinct directors and standards. A second director assignment to an occupied BU is rejected, as is assigning one director to a second active BU. One HR coordinator and one panelist can serve both through explicit memberships. Switching BU or opening a candidate view never exposes another BU’s data or private prompts. |
| 2. Intake | HR imports a batch with a valid row, duplicate, missing resume and changed phone, then creates an ad hoc interview. | Only accepted changes are committed. Retrying the file produces the same records. Fixing one resume updates only the relevant preparation. |
| 3. Preparation and booking | Queued work creates HR actions and a Java guide. HR selects an eligible panelist. | Equal primary-skill months pass the experience check. Missing or insufficient relevant months block booking regardless of total tenure. A competing booking for the shared panelist in another BU also blocks confirmation. |
| 4. Interview | On the test network, run the exercise alongside Teams and repeat it on an office laptop. | Rehearse the camera check with a mock ID and verify its screenshot stays outside scorecards and AI requests. Panelist sees actual code and execution results. Candidate sees only their exercise. Disconnect hosted AI and finish the round using the saved guide. |
| 5. Decision and reuse | L2 reviews L1, signs an independent assessment and sends one disputed competency to the director. | Every material feedback claim has a source. Missing Azure evidence leaves the Java conclusion intact. HR sees L2’s signed decision immediately. Only its BU director can override it. An empty justification is rejected and a valid override retains the original decision. |

**Pilot measures.** HR times active handling from receipt of a workbook through confirmed bookings. Panelists time preparation and feedback editing separately. Compare with the same BU’s manual baseline, grouped by batch size and round. Count duplicate applications after retries, required competencies with reviewed evidence, unsupported statements in sampled drafts, AI spend per completed interview and sessions finished despite an integration failure. Collect the denominator and sample size for each rate. Set time-saving targets after baseline measurement. Use observed errors and reviewer disagreement to revise questions before expanding to another BU.

## 9. Rehearsal and pilot readiness

Use AI-generated fictional openings, vendor sheets, resumes, employment histories and sample answers. Use visibly fictional ID props. Label seeded examples and distinguish them from scores and decisions made during the rehearsal. Reset synthetic records and attachments between runs.

HR and panelists rehearse both settings. An external test guest must join the Teams meeting, open the candidate workspace and run Java. Repeat the exercise on the reserved office laptop. HR owns joining instructions, accessibility arrangements and rescheduling. Record what worked on the actual devices and network before declaring the setup ready.

The POC uses synthetic data throughout. Before accepting real applicants, the BU owner and company privacy and IT teams approve candidate notice, identity-image access and retention, deletion and hosted AI settings. Verify access and deletion using synthetic attachments and derived drafts.
