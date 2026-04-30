# ADR-001: YAML as Single Source of Truth

## Status

Accepted

## Context

We need a structured way to define tools, recipes, and routing rules. The artifacts deployed to Pi are markdown files (chain templates and skills). We need to decide: do we maintain the markdown directly, or generate it from a structured source?

## Decision

All domain data (tools, recipes, router rules) is defined in YAML files. Pi artifacts (chain templates, skills) are generated from these YAML definitions, never hand-maintained.

## Rationale

- **Schema validation**: YAML can be validated against Zod schemas before generation
- **Cross-reference checking**: Tool IDs in recipes can be verified against the inventory
- **Idempotency**: Regenerating artifacts always produces consistent output
- **Single source of truth**: No divergence between "documentation" and "deployed code"
- **Testability**: YAML schemas can be unit tested; generation pipeline can be integration tested

## Consequences

- Added build step (generate artifacts before deploy)
- YAML must be the authoritative source — manual edits to generated markdown will be overwritten
- Need a validation pipeline to catch errors early
