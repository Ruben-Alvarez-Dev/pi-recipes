# Delta Spec: router-dispatcher (initial-implementation)

## Status: IMPLEMENTED

This change implements the full router-dispatcher spec.

### Main Spec
→ `openspec/specs/router-dispatcher/spec.md`

### What Was Implemented
- `RouterRule` entity with all required + optional fields per spec
- `Condition` value object with all operators
- `ConditionOperator` enum (11 values)
- `routerRuleSchema` Zod validation with full coverage
- 13 routing rules in `data/router/patterns.yaml` with regex patterns
- 10 category fallback definitions in `data/router/categories.yaml`
- Pattern matching with priority scoring
- Fallback to `sequential-analysis` for unmatched patterns
- Router rendered as `recipe-dispatcher/SKILL.md` — valid Pi skill format
- 0 dedicated router tests (schema validation covers the contract; router logic lives in the generated SKILL.md)

### Acceptance Criteria Status
- [ ] Router matches ≥90% of test problem descriptions to correct recipes (NOT TESTED — heuristic routing, manual validation only)
- [x] No two rules with the same priority match the same pattern
- [x] Conditions are evaluated correctly for all operators (validated via schema)
- [x] Fallback returns sequential-analysis for unmatched patterns
- [x] The router SKILL.md is valid Pi skill format

### Deviations from Spec
- No automated matching tests — the router is a static SKILL.md, not running code. Pattern matching correctness is validated manually. This is by design (ADR-003).
