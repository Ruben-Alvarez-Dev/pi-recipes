# ADR-003: Router as Skill, Not Running Code

## Status

Accepted

## Context

The router needs to map user requests to recipes. It could be:
1. A TypeScript service that runs as a separate process or MCP server
2. A SKILL.md file that provides routing instructions to Pi's agent

## Decision

The router is implemented as a SKILL.md file — a static set of routing rules that Pi's agent evaluates inline. No separate process, no MCP server, no runtime code.

## Rationale

- **Zero dependencies**: Works with Pi's built-in skill loading — no extra installation
- **Agent-native**: Pi's agent loop evaluates skills naturally — no external calls
- **Transparent**: The user can read and modify routing rules directly
- **Generatable**: Router rules from YAML are rendered to a SKILL.md by the generator
- **No latency**: No IPC, no HTTP, no process spawning — just markdown evaluation
- **Debuggable**: Pi's agent can explain why it chose a recipe based on the skill content

## Consequences

- Pattern matching is heuristic (keyword/regex), not ML-based
- Router rules must be compact enough to fit in agent context without bloating memory
- For complex matching, rules are prioritized and scored — the algorithm is documented in the skill
