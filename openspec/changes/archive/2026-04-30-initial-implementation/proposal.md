# Change Proposal: initial-implementation

## Intent

Build a spec-driven Pi agent orchestration system that catalogs Pi extensions as tools, composes chain recipes from those tools, and provides an intelligent router to dispatch tasks to the right recipe. This is the foundational implementation — the entire v0.1 of pi-recipes.

## Scope

### In Scope
- 4 domain specs: tool inventory, recipe system, router dispatcher, artifact generation
- 3 architecture decision records (YAML source of truth, chain templates, router as skill)
- TypeScript project with strict ESM, Zod validation, Vitest testing
- Domain entities: Tool, Recipe, RecipeStep, RouterRule + value objects
- Zod schemas with full test coverage (TDD)
- 49 YAML tool inventory files analyzing all registered Pi extensions
- 13 chain recipes (5 simple + 8 complex) covering major task archetypes
- 13 pattern-based routing rules + 10 category fallback definitions
- Artifact generator: validate, generate, deploy, pipeline, status CLI commands
- Chain renderer, skill renderer, YAML repository infrastructure
- Deployed artifacts: 13 chain templates + 1 router skill to ~/.pi/agent/

### Out of Scope
- Dynamic recipe discovery at runtime
- ML-based routing (pattern matching is heuristic only)
- Pi extension installation/management
- Recipe marketplace or sharing
- Interactive TUI for recipe browsing

## Approach

1. **Spec-first**: Write domain specs before any code (tool-inventory, recipe-system, router-dispatcher, artifact-generation)
2. **ADR-driven**: Document architectural decisions before implementing (YAML as source, chains over skills, router as SKILL.md)
3. **TDD mandatory**: All code has tests first — 143 tests total
4. **Hexagonal architecture**: Domain → Application → Infrastructure separation
5. **YAML as source of truth**: All data (tools, recipes, router rules) in YAML; Pi artifacts are generated, never hand-maintained
6. **Pipeline**: validate → generate → deploy as a single CLI workflow

## Risks

| Risk | Mitigation |
|------|-----------|
| Pi frontmatter format undocumented | Reverse-engineered from existing pi-prompt-template-model chains |
| @cleocode/cleo-os requires Node ≥24 | Not used in core system; noted as future dependency |
| Router pattern matching too simplistic | Regex-based with priority scoring; extensible YAML rules |
| 49 tool files too many to maintain | Schema validation + CLI validate command |

## Rollback Plan

If any component fails validation:
1. Domain entities/schemas are pure TypeScript — delete and re-write
2. YAML data files are independent — remove problematic files
3. Generated artifacts are in ~/.pi/agent/ — delete to revert
4. CLI is a single entry point — revert commit

## References

- ADR-001: YAML as Source of Truth
- ADR-002: Chain Templates over Skills
- ADR-003: Router as Skill, Not Running Code
- pi-prompt-template-model chain system (Pi documentation)
