---
description: Protected multi-step refactoring with sequential analysis, diff preview, guardrails, and spec documentation.
model: mimo-v2.5-pro
thinking: high
chain: analyze -> review-diffs -> guard-check -> document
chainContext: full
boomerang: false
worktree: false
---

## Step: Refactoring Analysis
Tool: pi-sequential-thinking
Context: full

Analyze the refactoring opportunity:
1. Identify the code smell or improvement opportunity
2. Define the target state (what should the code look like after)
3. Assess the blast radius (what else depends on this code)
4. Plan the refactoring in safe, reversible steps

## Step: Diff Review
Tool: pi-show-diffs
Context: summary

Review each proposed change:
1. Show the diff for each file that will be modified
2. Verify no unintended changes are included
3. Check that the change achieves the stated goal
4. Approve or reject each change individually

## Step: Safety Check
Tool: pi-guardrails
Context: summary

Verify safety of the refactoring:
1. Check that no protected files are being modified
2. Verify no secrets or credentials are exposed
3. Ensure the changes don't break any imports or dependencies

## Step: Document Changes
Tool: pi-specdocs
Context: summary

Document the refactoring:
1. Create an ADR explaining why the refactoring was needed
2. Document the before/after state
3. Note any risks or follow-up work needed