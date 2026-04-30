# Pi Recipes — Project Plan

## Objective

Build a spec-driven orchestration system that makes Pi intelligently select and chain tools for any coding task — without loading everything into memory.

## Phases

### Phase 1: Foundation (Current)

**Goal:** Project structure, architecture, and domain specs.

| Task | Deliverable | TDD? |
|------|-------------|------|
| Repository setup | Git repo + GitHub remote | — |
| Architecture document | `ARCHITECTURE.md` | — |
| Planning document | `PLANNING.md` | — |
| Glossary | `docs/glossary.md` | — |
| Domain specs | `specs/*.spec.md` (4 files) | — |
| ADRs | `docs/decisions/*.md` | — |

### Phase 2: Schemas & Validation

**Goal:** Zod schemas with full test coverage.

**TDD approach:** Write failing tests → implement schemas → tests pass.

| Task | Deliverable | Tests |
|------|-------------|-------|
| Tool schema | `src/schemas/tool.schema.ts` | `tests/unit/schemas/tool.schema.test.ts` |
| Recipe schema | `src/schemas/recipe.schema.ts` | `tests/unit/schemas/recipe.schema.test.ts` |
| RouterRule schema | `src/schemas/router-rule.schema.ts` | `tests/unit/schemas/router-rule.schema.test.ts` |
| Validation service | `src/application/validate-inventory.ts` | `tests/unit/application/validate.test.ts` |
| Test fixtures | `tests/fixtures/*.yaml` (8 files) | — |

### Phase 3: Tool Inventory

**Goal:** Analyze and document all 48 extensions.

**Batched approach:** 6-8 tools per batch, one commit per batch.

| Batch | Category | Tools | Estimated |
|-------|----------|-------|-----------|
| 1 | Core Infrastructure | pi-toolchain, lsp-pi, pi-devtools, pi-lens, pi-extension-manager, pi-formatter, pi-structured-return, pi-processes | 8 |
| 2 | Thinking & Reasoning | pi-sequential-thinking, pi-code-reasoning, @feniix/pi-code-reasoning, pi-rewind-hook | 4 |
| 3 | Memory & Learning | pi-memory, pi-session-recall, pi-learn, mypensieve, pi-token-burden | 5 |
| 4 | Orchestration | babysitter-pi, pi-boomerang, pi-subagents, pi-ralph-wiggum, super-pi, @0xkobold/pi-orchestration | 6 |
| 5 | Planning & Documentation | plannotator, pi-task, pi-specdocs, pi-codebase-wiki, pi-mermaid, pi-taskplane-planner, pi-prompt-template-model | 7 |
| 6 | Security & Quality | pi-guardrails, pi-secret-guard, secret-guardian, pi-show-diffs, pi-gitnexus, pi-lcm | 6 |
| 7 | Communication & Meta | whatsapp-pi, pi-gateway, pi-persona, ask-user-question, pi-vcc, pi-computer-use, pi-synthetic, pi-ollama, pi-kobold, pi-statusline, @cleocode/cleo-os | 12 |

Each tool YAML includes:
```yaml
id: string
name: string
npm: string
category: Category
description: string
capabilities: string[]
ideal_use_cases:
  - scenario: string
    why: string
    model_hint: string
anti_patterns:
  - scenario: string
    why: string
    alternative: string
dependencies: string[]
thinking_level: off | minimal | low | medium | high | xhigh
notes: string
```

### Phase 4: Recipe System

**Goal:** Define recipes for archetypal tasks.

**Simple recipes** (1 tool, configured optimally):
- Sequential analysis
- Code review
- Memory recall
- Quick documentation
- Git status check

**Complex recipes** (3+ tools, chained):
- Design pattern evaluation (sequential-thinking → code-reasoning → specdocs → wiki)
- Algorithm selection (sequential-thinking → code-reasoning → benchmark)
- TDD implementation (plannotator → sequential-thinking → code-reasoning → test → specdocs)
- Refactoring with safety (sequential-thinking → show-diffs → guardrails → specdocs)
- Deep debugging (sequential-thinking → memory → code-reasoning → learn)
- Architecture review (sequential-thinking → code-reasoning → mermaid → specdocs → wiki)
- Feature planning (plannotator → task → sequential-thinking → specdocs)
- Security audit (guardrails → secret-guard → show-diffs → specdocs)

### Phase 5: Router

**Goal:** Intelligent dispatch from problem description to recipe.

The router is a SKILL.md that uses heuristic pattern matching:
- Keyword extraction from user request
- Category weighting
- Complexity estimation (simple → simple recipe, complex → complex recipe)
- Model hint selection

### Phase 6: Artifact Generation

**Goal:** TypeScript pipeline that generates Pi artifacts from YAML.

```
YAML data → Validate (Zod) → Render (Markdown) → Deploy (~/.pi/agent/)
```

### Phase 7: Deployment & Integration

**Goal:** Automated deploy pipeline.

- `npm run generate` — Validate + render all artifacts
- `npm run deploy` — Copy to `~/.pi/agent/prompts/` and `~/.pi/agent/skills/`
- CI: Validate all YAML on push

## Commit Convention

- **Language:** English
- **Format:** Conventional commits, 2-4 sentences
- **Examples:**
  - `feat(schemas): add tool schema with category enum and use-case validation`
  - `docs(adr): document YAML as single source of truth decision`
  - `test(schemas): add failing tests for recipe step validation`
  - `data(tools): analyze batch 1 — core infrastructure tools`

## Quality Gates

Each phase has a clear "done" definition:
- Phase 2: All schema tests pass, 100% coverage on validation logic
- Phase 3: Every tool YAML validates against schema
- Phase 4: Every recipe YAML validates, renders to valid Pi chain template
- Phase 5: Router matches ≥90% of test problem descriptions correctly
- Phase 6: Full pipeline runs end-to-end (YAML → deploy)
