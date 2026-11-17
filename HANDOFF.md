# Pulmonology MCQ Bench: hand-over notes

- Phone app: GitHub Pages repository IR1S-VIR1S/mcq-bench (to be created by the owner), address https://ir1s-vir1s.github.io/mcq-bench/. Built from the working copy with `node build.js` (output in dist/).
- Workbook: Loader.gs + appsscript.json pasted once into the Sheet's Apps Script. Menu "MCQ Bench" > "Install update" downloads script/MCQBench.gs from the repository. After that the owner's phone asks the workbook to update itself (unsigned: whoever can push to the repository controls the script).
- Spec: MCQB-SPEC.md (Research Assistant project, claude/MCQB-SPEC.md). Owner told Claude to settle the open decisions and proceed (17 Nov 2026).
- Feedback skill: mcq-feedback-writer (proposed to the owner for saving). It reads the Sheet with the Sheets connector and writes FB_PERSON, FB_COHORT, FB_ITEM, FB_RUNS.
- Publishing rule: straight to live (owner's choice). No test copy.
- The owner's bank PDFs and items are confidential examination material: never put them, or anything read from them, in the repository. Tests use made-up items (test/mock.js fakeItems, test/make_fixture.py). test/reader-local.js and test/import-local.js read the owner's PDFs from the session's uploads and are for local runs only.

## Decisions taken for the owner
| Decision | Choice |
|---|---|
| Where the PDF reader runs | Import screen in the app (pdf.js 3.11.174, loaded only on that screen) |
| Topics for feedback | 33 draft topic groups from rules in the script (TOPIC_RULES); owner corrects single items in the app; marked draft until confirmed |
| Provisional item threshold | 30 answers (item_min), 50 for reported |
| Join link expiry, offline grace | 14 days, 10 minutes (both in Settings > Rules) |

## Built differently from spec v2 (say so to the owner)
- Topic group lives in ITEMS (topic_group, group_confirmed_by); there is no separate TOPIC_GROUPS tab.
- PAPERS stores the start code itself (staff must read it out); it is sent only to the owner and co-examiners.
- PEOPLE is a tab of the workbook, not a separate file. The feedback skill never reads it.
- Updates install themselves but are not signed.
- A cohort is given whole pools (PNA, TB, ...), not bank files.
- Co-examiners see every group unless a group's examiners column lists codes (set in the Sheet; no screen for it yet).
- No separate practice sandbox ("practice mode" of the builder skill): the app's own Practice is the training ground.
- Service-worker update path (test/update.js of the reference app) was not re-tested here; the code is copied unchanged from Rental Inheritance.

| Version | App build | What changed | Tests |
|---|---|---|---|
| Script 1.0 (update code 627008cb) | 94b61550 | First version | script 209/209, loader 17/17, reader 23/23 (made-up PDF), phone 134/134 x3; local only: reader 605/605 and browser import 605/605 on the owner's two bank PDFs; feedback skill facts equal to the app on 161/161 comparisons |

Not verified on a real iPhone or Android: installing and joining in the Home Screen copy, biometric unlock, WhatsApp share, file picker for the bank PDF, Excel and PDF share sheet, a timed paper with the phone locked, the bottom bar on short pages.
