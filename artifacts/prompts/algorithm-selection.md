---
description: Systematic evaluation of algorithmic approaches with branching analysis, complexity assessment, and implementation recommendation.
model: mimo-v2.5-pro
thinking: high
chain: define-problem -> branch-analysis -> recommend
chainContext: full
boomerang: true
worktree: false
---

## Step: Problem Definition
Tool: pi-sequential-thinking
Context: full

Define the algorithmic problem precisely:
1. State the problem in formal terms (input, output, constraints)
2. Identify the data characteristics (size, distribution, mutability)
3. Determine the performance requirements (time, space, latency)
4. Note any edge cases or special conditions

## Step: Algorithm Branching Analysis
Tool: fenix-code-reasoning
Model: claude-sonnet-4-20250514
Context: summary

Explore multiple algorithmic approaches in parallel branches:
1. Branch 1: Naive/brute-force approach (baseline)
2. Branch 2: Optimal approach (best known solution)
3. Branch 3: Pragmatic approach (best balance of simplicity and performance)
For each branch evaluate:
- Time complexity (best, average, worst)
- Space complexity
- Implementation complexity
- Real-world performance considerations

## Step: Recommendation
Tool: pi-sequential-thinking
Context: summary

Synthesize the analysis into a clear recommendation:
1. Compare all branches side by side
2. Select the best approach based on the problem constraints
3. Provide implementation pseudocode or description
4. Note any gotchas or common mistakes