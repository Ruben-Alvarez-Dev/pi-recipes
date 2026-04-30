---
description: Full test-driven development cycle with planning, sequential thinking, code reasoning, test execution, and spec documentation.
model: mimo-v2.5-pro
thinking: high
chain: plan -> think-implementation -> implement-and-test -> document
chainContext: full
boomerang: false
worktree: false
---

## Step: Test Planning
Tool: plannotator
Thinking: medium
Context: full

Plan the TDD approach for the feature:
1. Break the feature into testable units
2. Define the test cases for each unit (happy path, edge cases, errors)
3. Order tests from simplest to most complex
4. Identify any test infrastructure needed

## Step: Implementation Thinking
Tool: pi-sequential-thinking
Context: summary

Think through the implementation strategy:
1. Review the test plan and identify implementation order
2. For each test, think about what code makes it pass
3. Identify shared abstractions and helper code
4. Plan the refactoring steps after initial implementation

## Step: Code and Test
Tool: fenix-code-reasoning
Model: claude-sonnet-4-20250514
Context: summary
Loop: count: 10, converge: true, fresh: true

Implement following TDD cycle:
1. Write the FIRST failing test
2. Write the MINIMUM code to make it pass
3. Refactor while keeping tests green
4. Move to the next test
5. If a test reveals a design issue, branch and explore alternatives

## Step: Document Implementation
Tool: pi-specdocs
Context: summary

Document the implementation:
1. Create an implementation plan documenting what was built
2. Note any design decisions made during TDD
3. Record test coverage and any untested edge cases