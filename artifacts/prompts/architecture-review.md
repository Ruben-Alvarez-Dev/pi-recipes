---
description: Comprehensive architecture analysis with codebase knowledge, visual diagrams, and specification documentation.
model: mimo-v2.5-pro
thinking: high
chain: gather-knowledge -> analyze -> visualize -> spec-docs
chainContext: full
boomerang: true
worktree: false
---

## Step: Codebase Knowledge
Tool: pi-codebase-wiki
Thinking: low
Context: full

Gather architecture context:
1. Query the codebase wiki for architecture decisions
2. Identify the main modules and their responsibilities
3. Map the dependency graph between components
4. Note any architectural patterns already in use

## Step: Architecture Analysis
Tool: pi-sequential-thinking
Context: summary

Perform deep architecture analysis:
1. Evaluate the current architecture against SOLID principles
2. Identify coupling and cohesion issues
3. Assess scalability and maintainability
4. Note any architectural drift from original design

## Step: Visual Diagrams
Tool: pi-mermaid
Context: summary

Create visual representations:
1. Draw a component diagram showing module relationships
2. Create a sequence diagram for the main data flow
3. Add an ER diagram if data models are relevant

## Step: Specification Documentation
Tool: pi-specdocs
Context: summary

Document findings as specifications:
1. Create an ADR for any architectural changes recommended
2. Write a PRD if new architectural components are needed
3. Cross-reference with existing documentation