# Tasks: initial-implementation

## Phase 1: Foundation

- [x] 1.1 Write ARCHITECTURE.md with domain model and layer diagram
- [x] 1.2 Write PLANNING.md with phases, timeline, milestones
- [x] 1.3 Write 4 domain specs (tool-inventory, recipe-system, router-dispatcher, artifact-generation)
- [x] 1.4 Write 3 ADRs (YAML source of truth, chain templates, router as skill)
- [x] 1.5 Write glossary with domain vocabulary
- [x] 1.6 Write README with project overview

## Phase 2: TypeScript Project + Domain

- [x] 2.1 Bootstrap TypeScript project (strict ESM, vitest, zod, js-yaml, tsx)
- [x] 2.2 Define domain entities: Tool, Recipe, RecipeStep, RouterRule + value objects
- [x] 2.3 Define all enums: Category, ThinkingLevel, ChainContext, RecipeArchetype, RecipeComplexity, ConditionOperator
- [x] 2.4 Write toolSchema Zod schema with TDD (51 tests)
- [x] 2.5 Write recipeSchema Zod schema with TDD (53 tests)
- [x] 2.6 TypeScript clean build (`tsc --noEmit`)

## Phase 3: Tool Inventory

- [x] 3.1 Analyze and catalog 49 Pi extensions as YAML tool files
- [x] 3.2 Each tool has: id, name, npm, category, description, capabilities
- [x] 3.3 Each tool has ideal_use_cases with scenario, why, model_hint, recipe_hint
- [x] 3.4 Each tool has anti_patterns with scenario, why, alternative
- [x] 3.5 Cross-references validated (alternative, dependencies)
- [x] 3.6 All tool files pass schema validation

## Phase 4: Recipes

- [x] 4.1 Create 5 simple recipes (1 tool each): sequential-thinking, code-explanation, git-commit, search-file, yaml-validate
- [x] 4.2 Create 8 complex recipes (3-4 tools): deep-analysis, feature-implementation, bug-investigation, code-review, test-driven-development, refactoring-session, documentation-generation, security-audit
- [x] 4.3 All recipes pass schema validation
- [x] 4.4 All tool references resolve to valid tool IDs

## Phase 5: Router

- [x] 5.1 Create 13 routing rules with regex patterns in patterns.yaml
- [x] 5.2 Create 10 category fallback definitions in categories.yaml
- [x] 5.3 Fallback to sequential-analysis for unmatched patterns
- [x] 5.4 All rules pass schema validation
- [x] 5.5 No priority conflicts between rules

## Phase 6: Generator + CLI

- [x] 6.1 Implement YamlRepository (read/write YAML files)
- [x] 6.2 Implement PiChainRenderer (Recipe → Pi chain template)
- [x] 6.3 Implement PiSkillRenderer (RouterRules → SKILL.md)
- [x] 6.4 Implement CLI validate command (schema check all YAML)
- [x] 6.5 Implement CLI generate command (render all artifacts)
- [x] 6.6 Implement CLI deploy command (copy to ~/.pi/agent/)
- [x] 6.7 Implement CLI pipeline command (validate → generate → deploy)
- [x] 6.8 Implement CLI status command (show deployed state)
- [x] 6.9 Add 39 infrastructure tests (TDD)

## Phase 7: Deployment + Verification

- [x] 7.1 Run full pipeline — 13 chain templates generated
- [x] 7.2 Deploy recipe-dispatcher skill to ~/.pi/agent/skills/
- [x] 7.3 All 143 tests passing
- [x] 7.4 TypeScript clean build
- [x] 7.5 Pipeline idempotent (run twice, same output)

## Phase 8: SDD Compliance (retroactive)

- [ ] 8.1 Initialize openspec/ structure with config.yaml
- [ ] 8.2 Move existing specs to openspec/specs/ as main specs
- [ ] 8.3 Create change: initial-implementation with proposal, delta specs, design, tasks
- [ ] 8.4 Verify implementation against specs (sdd-verify)
- [ ] 8.5 Archive change (sdd-archive)
- [ ] 8.6 Commit and push SDD artifacts
