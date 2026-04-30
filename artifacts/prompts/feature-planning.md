---
description: End-to-end feature planning with interactive annotations, task management, sequential thinking, and specification docs.
model: mimo-v2.5-pro
thinking: medium
chain: annotate-plan -> task-breakdown -> think-through -> spec
chainContext: full
boomerang: false
worktree: false
---

## Step: Plan Annotation
Tool: plannotator
Context: full

Create and annotate the feature plan:
1. Define the feature scope and acceptance criteria
2. Break down into sub-tasks with estimates
3. Annotate dependencies and risks
4. Review with visual annotations

## Step: Task Management
Tool: pi-task
Context: summary

Create task cards for implementation:
1. Convert plan items into kanban tasks
2. Set initial status (backlog)
3. Add dependencies between tasks
4. Note blockers or risks

## Step: Implementation Thinking
Tool: pi-sequential-thinking
Context: summary

Think through the implementation approach:
1. Evaluate the task breakdown for completeness
2. Identify potential technical challenges
3. Propose solutions for each challenge
4. Suggest implementation order for optimal flow

## Step: Feature Specification
Tool: pi-specdocs
Context: summary

Generate feature specification:
1. Create a PRD with requirements and acceptance criteria
2. Document technical approach and architecture decisions
3. Add cross-references to task cards