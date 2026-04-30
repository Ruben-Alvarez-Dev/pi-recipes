---
description: Systematic debugging with memory recall, sequential hypothesis testing, and learned corrections.
model: mimo-v2.5-pro
thinking: high
chain: recall-context -> hypothesize -> fix-and-verify -> learn
chainContext: full
boomerang: true
worktree: false
---

## Step: Context Recall
Tool: pi-session-recall
Thinking: low
Context: full

Search for relevant debugging context:
1. Find previous sessions where this code was discussed
2. Check memory for known issues with this code
3. Look for similar bugs that were fixed before
4. Gather all available context about the failing behavior

## Step: Hypothesis Generation
Tool: pi-sequential-thinking
Context: summary

Generate and test debugging hypotheses:
1. List all possible causes ranked by likelihood
2. For each hypothesis, design a minimal test to confirm or deny
3. Execute tests systematically, eliminating hypotheses
4. When the root cause is found, verify by explaining the exact failure mechanism

## Step: Fix and Verify
Tool: fenix-code-reasoning
Model: claude-sonnet-4-20250514
Context: summary

Fix the bug with verification:
1. Propose the minimal fix that addresses root cause
2. Verify the fix doesn't introduce regressions
3. Add a test that specifically catches this bug
4. If the fix is complex, branch and explore alternatives

## Step: Learn from Debugging
Tool: pi-memory
Context: summary

Store debugging insights for future reference:
1. Record the bug pattern and its root cause
2. Note the fix approach that worked
3. Store any prevention strategies