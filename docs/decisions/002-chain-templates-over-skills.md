# ADR-002: Chain Templates Over Pure Skills for Orchestration

## Status

Accepted

## Context

Pi supports two mechanisms for agent behavior: skills (SKILL.md files) and prompt templates (chain templates via `pi-prompt-template-model`). We need to decide which to use for orchestrating multi-tool workflows.

## Decision

Complex workflows use Pi's chain template system (frontmatter `chain` field). Skills are reserved for knowledge injection and routing, not multi-step orchestration.

## Rationale

- **Chain templates** support model switching, thinking levels, skill injection, and context management natively
- **Skills** are flat instruction files — they can describe workflows but cannot execute them
- `pi-prompt-template-model` provides `chainContext`, `boomerang`, `loop`, `rotate`, `fresh`, `converge`, and `worktree` — all essential for recipes
- Chain templates can be invoked with a single slash command (`/recipe-name`)
- The router (a skill) DISPATCHES to chain templates — each has its proper responsibility

## Consequences

- Recipe rendering must produce valid `pi-prompt-template-model` frontmatter
- Depends on `pi-prompt-template-model` being installed in Pi
- Simple recipes (1 tool) can also be chain templates for consistency
