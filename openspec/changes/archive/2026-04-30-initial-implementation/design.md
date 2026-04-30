# Design: initial-implementation

## Architecture

Clean/Hexagonal Architecture with three layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                            │
│                                                                 │
│  Entities: Tool, Recipe, RecipeStep, RouterRule                 │
│  Value Objects: Category, UseCase, AntiPattern, Priority,       │
│                 ChainContext, ThinkingLevel, ModelSelector       │
│  Enums: Category (10), ThinkingLevel (6), ChainContext (3),     │
│         RecipeArchetype (13), RecipeComplexity (2),             │
│         ConditionOperator (11)                                  │
└─────────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SCHEMA LAYER (Zod)                            │
│                                                                 │
│  toolSchema — validates Tool YAML (51 tests)                    │
│  recipeSchema — validates Recipe YAML (53 tests)                │
│  routerRuleSchema — validates RouterRule YAML (part of 53)      │
│  patternsSchema — validates patterns.yaml collection            │
│  categoriesSchema — validates categories.yaml collection        │
└─────────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                           │
│                                                                 │
│  YamlRepository — reads/writes YAML data files                  │
│  PiChainRenderer — renders Recipe → Pi chain template (.md)     │
│  PiSkillRenderer — renders RouterRules → SKILL.md              │
│  CLI (index.ts) — validate, generate, deploy, pipeline, status │
└─────────────────────────────────────────────────────────────────┘
```

## Key Decisions

### ADR-001: YAML as Source of Truth
All data (tools, recipes, routing rules) lives in YAML files under `data/`. Pi-compatible artifacts (chain templates, skills) are **generated**, never hand-maintained. This ensures a single source of truth and makes the system schema-validatable.

**Rationale**: Hand-maintaining Pi artifacts is error-prone and doesn't scale. YAML + generation = validation + consistency.

### ADR-002: Chain Templates over Custom Skills
The recipe system uses `pi-prompt-template-model`'s native chain/frontmatter system instead of building a custom recipe engine. Each recipe renders to a `.md` file with YAML frontmatter that Pi natively understands.

**Rationale**: Pi already has a chain system. Building a custom one would duplicate functionality and add complexity. We compose chains, not invent them.

### ADR-003: Router as SKILL.md, Not Running Code
The router is a static SKILL.md file with routing rules embedded as markdown tables and instructions. It's NOT a running application — it's a prompt that Pi follows to select recipes.

**Rationale**: Zero dependencies, agent-native, debuggable by reading the file. The router runs inside Pi's context, not as a separate process.

## File Structure

```
pi-recipes/
├── openspec/                          # SDD artifacts
│   ├── config.yaml                    # Project context + rules
│   ├── specs/                         # Main specs (source of truth)
│   │   ├── tool-inventory/spec.md
│   │   ├── recipe-system/spec.md
│   │   ├── router-dispatcher/spec.md
│   │   └── artifact-generation/spec.md
│   └── changes/                       # Change artifacts
├── src/
│   ├── domain/                        # Domain entities + types
│   │   ├── types.ts                   # All interfaces + enums
│   │   └── constants.ts               # Category/ThinkingLevel mappings
│   ├── schemas/                       # Zod validation schemas
│   │   ├── tool-schema.ts
│   │   └── recipe-schema.ts
│   ├── application/                   # Use cases (empty — CLI is thin)
│   ├── infrastructure/                # Adapters
│   │   ├── chain-renderer.ts          # Recipe → Pi chain template
│   │   ├── skill-renderer.ts          # Rules → SKILL.md
│   │   └── yaml-repository.ts         # YAML file I/O
│   └── index.ts                       # CLI entry point
├── data/
│   ├── tools/                         # 49 tool YAML files
│   ├── recipes/
│   │   ├── simple/                    # 5 simple recipes (1 tool)
│   │   └── complex/                   # 8 complex recipes (2-4 tools)
│   └── router/
│       ├── patterns.yaml              # 13 routing rules
│       └── categories.yaml            # 10 category definitions
├── tests/                             # 7 test suites, 143 tests
│   ├── tool-schema.test.ts            # 51 tests
│   ├── recipe-schema.test.ts          # 53 tests
│   ├── chain-renderer.test.ts         # 18 tests
│   ├── skill-renderer.test.ts         # 11 tests
│   └── yaml-repository.test.ts        # 10 tests
└── docs/
    ├── glossary.md                    # Domain vocabulary
    └── decisions/                     # 3 ADRs
```

## Dependencies

| Package | Purpose | Why |
|---------|---------|-----|
| `zod` | Schema validation | Type-safe runtime validation, great error messages |
| `js-yaml` | YAML parsing | Lightweight, well-tested, ESM compatible |
| `typescript` | Language | Strict mode, ESM, latest features |
| `vitest` | Testing | Fast, ESM-native, compatible with Zod |
| `tsx` | TypeScript execution | Run CLI without pre-compilation |

## Data Flow

```
1. YAML files (data/) ──[read]──▶ YamlRepository
2. YamlRepository ──[validate]──▶ Zod schemas
3. Validated data ──[render]──▶ PiChainRenderer / PiSkillRenderer
4. Rendered artifacts ──[write]──▶ artifacts/ directory
5. Artifacts ──[deploy]──▶ ~/.pi/agent/prompts/ + ~/.pi/agent/skills/
```

## Test Strategy

- **Domain schemas**: 104 tests — every field, every validation rule, edge cases
- **Chain renderer**: 18 tests — frontmatter generation, step rendering, special cases
- **Skill renderer**: 11 tests — routing table, usage instructions, fallback
- **YAML repository**: 10 tests — file I/O, glob patterns, error handling
- **Total**: 143 tests, all passing
- **Coverage**: Domain entities and schemas have near-complete coverage; infrastructure has focused coverage on rendering logic
