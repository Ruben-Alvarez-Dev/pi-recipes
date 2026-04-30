---
description: Multi-step workflow for evaluating and selecting design patterns with structured analysis, branching code reasoning, and ADR documentation.
model: mimo-v2.5-pro
thinking: high
chain: analyze-problem -> evaluate-patterns -> document-decision -> wiki-entry
chainContext: full
boomerang: true
worktree: false
---

## Step: Problem Analysis
Tool: pi-sequential-thinking
Context: full

Analyze the design problem deeply:
1. Define the core problem and its context in the codebase
2. Identify the forces at play (constraints, requirements, trade-offs)
3. List 2-3 candidate patterns that could address the problem
4. For each candidate, note initial pros and cons

## Step: Pattern Evaluation
Tool: fenix-code-reasoning
Model: claude-sonnet-4-20250514
Context: summary

Evaluate each candidate pattern with branching analysis:
1. For each candidate pattern, create a branch of analysis
2. Evaluate: pros, cons, complexity, maintainability, testability
3. Score each on a 1-5 scale for: fit, simplicity, extensibility
4. Identify the clear winner with reasoning
5. If no clear winner, explore hybrid approaches

## Step: Document as ADR
Tool: pi-specdocs
Context: summary

Create an Architecture Decision Record using the ADR template:
- Context: what problem needed solving and what forces were at play
- Decision: which pattern was chosen and why it scored highest
- Alternatives: what was considered and why it was rejected
- Consequences: what this means for the codebase going forward
- Add cross-references to related specs and code locations

## Step: Update Codebase Wiki
Tool: pi-codebase-wiki
Context: summary

Update the codebase wiki with the pattern decision:
1. Record the chosen pattern and where it was applied
2. Note the problem it solves and any constraints
3. Link to the ADR created in the previous step