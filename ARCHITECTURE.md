# Pi Recipes — Architecture Decision Record

## Overview

Pi Recipes is a spec-driven orchestration system for the Pi coding agent. It provides three layers:

1. **Tool Inventory** — Structured catalog of 48+ Pi extensions with use-case analysis
2. **Chain Recipes** — Multi-step workflows combining tools for archetypal tasks
3. **Intelligent Router** — Pattern-matching dispatcher that selects the right recipe

## Architectural Principles

| Principle | Application |
|-----------|-------------|
| **SOLID** | Each entity has a single responsibility; schemas are open for extension, closed for modification |
| **DDD** | Domain vocabulary (Tool, Recipe, Step, RouterRule) drives all data models |
| **Clean/Hexagonal** | Domain logic is framework-agnostic; Pi-specific rendering is an infrastructure concern |
| **DRY** | Single source of truth in YAML; Pi artifacts are generated, never hand-maintained |
| **Spec-Driven** | Every artifact has a spec before implementation; tests validate against specs |

## Domain Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                            │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │   Tool   │    │  Recipe  │    │RouterRule│                  │
│  │          │    │          │    │          │                  │
│  │ • id     │◄───│ • steps  │    │ • pattern│                  │
│  │ • name   │    │ • model  │    │ • recipe │                  │
│  │ • category│   │ • skill  │    │ • priority│                 │
│  │ • useCases│  │ • chain  │    │ • conditions│                │
│  │ • antiPatterns│ │         │    │          │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│                                                                 │
│  Value Objects: Category, UseCase, AntiPattern, Priority,       │
│                 ChainContext, ThinkingLevel, ModelSelector       │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                                                                 │
│  Use Cases:                                                     │
│  • AnalyzeTool       — Audit an extension's capabilities        │
│  • DesignRecipe      — Compose a multi-step workflow            │
│  • MatchRecipe       — Route a problem description to a recipe  │
│  • GenerateArtifacts — Render YAML → Pi chain templates + skills│
│  • ValidateInventory — Schema-check all data files              │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                            │
│                                                                 │
│  Adapters:                                                      │
│  • YamlRepository     — Read/write YAML data files              │
│  • ZodValidator       — Schema validation with Zod              │
│  • PiChainRenderer    — Generate Pi chain templates (markdown)  │
│  • PiSkillRenderer    — Generate Pi skills (SKILL.md)           │
│  • PiDeployer         — Copy artifacts to ~/.pi/agent/          │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
pi-recipes/
├── README.md                          # Project overview
├── ARCHITECTURE.md                    # This file
├── PLANNING.md                        # Phases, timeline, milestones
│
├── docs/                              # Documentation (spec-driven)
│   ├── glossary.md                    # Domain vocabulary
│   └── decisions/                     # Architecture Decision Records
│       ├── 001-yaml-as-source-of-truth.md
│       ├── 002-chain-templates-over-skills.md
│       └── 003-router-as-skill-not-code.md
│
├── src/                               # Application + Domain
│   ├── domain/                        # Domain entities + value objects
│   │   ├── tool.ts
│   │   ├── recipe.ts
│   │   ├── router-rule.ts
│   │   └── value-objects.ts
│   │
│   ├── application/                   # Use cases + services
│   │   ├── analyze-tool.ts
│   │   ├── design-recipe.ts
│   │   ├── match-recipe.ts
│   │   ├── generate-artifacts.ts
│   │   └── validate-inventory.ts
│   │
│   ├── infrastructure/                # Pi-specific adapters
│   │   ├── yaml-repository.ts
│   │   ├── zod-validator.ts
│   │   ├── pi-chain-renderer.ts
│   │   ├── pi-skill-renderer.ts
│   │   └── pi-deployer.ts
│   │
│   └── schemas/                       # Zod schemas (validation contracts)
│       ├── tool.schema.ts
│       ├── recipe.schema.ts
│       ├── router-rule.schema.ts
│       └── index.ts
│
├── data/                              # YAML source of truth
│   ├── tools/                         # One YAML file per tool
│   │   ├── pi-sequential-thinking.yaml
│   │   ├── pi-code-reasoning.yaml
│   │   ├── pi-memory.yaml
│   │   └── ...
│   │
│   ├── recipes/                       # One YAML file per recipe
│   │   ├── simple/                    # Single-tool recipes
│   │   │   ├── sequential-analysis.yaml
│   │   │   ├── code-review.yaml
│   │   │   └── ...
│   │   └── complex/                   # Multi-tool chained recipes
│   │       ├── design-pattern-eval.yaml
│   │       ├── algorithm-selection.yaml
│   │       ├── tdd-implementation.yaml
│   │       └── ...
│   │
│   └── router/                        # Routing rules
│       ├── patterns.yaml              # Problem pattern → recipe mapping
│       └── categories.yaml            # Category definitions
│
├── tests/                             # TDD — tests before implementation
│   ├── unit/
│   │   ├── schemas/
│   │   │   ├── tool.schema.test.ts
│   │   │   ├── recipe.schema.test.ts
│   │   │   └── router-rule.schema.test.ts
│   │   └── application/
│   │       ├── match-recipe.test.ts
│   │       └── generate-artifacts.test.ts
│   │
│   ├── integration/
│   │   ├── full-pipeline.test.ts      # YAML → validate → generate → deploy
│   │   └── router-matching.test.ts
│   │
│   └── fixtures/                      # Test data
│       ├── valid-tool.yaml
│       ├── invalid-tool.yaml
│       ├── valid-recipe.yaml
│       └── valid-router-rule.yaml
│
├── openspec/                         # SDD artifacts
│   ├── config.yaml                   # Project context + rules
│   ├── specs/                        # Main specs (source of truth)
│   │   ├── tool-inventory/spec.md
│   │   ├── recipe-system/spec.md
│   │   ├── router-dispatcher/spec.md
│   │   └── artifact-generation/spec.md
│   └── changes/archive/              # Archived change records
│
└── artifacts/                         # Generated output (not committed)
    ├── prompts/                       # Pi chain templates
    │   ├── sequential-analysis.md
    │   ├── design-pattern-eval.md
    │   └── ...
    └── skills/                        # Pi skills
        └── recipe-dispatcher/
            └── SKILL.md
```

## Key Decisions

### 1. YAML as Source of Truth

Tool inventory, recipe definitions, and router rules live in YAML. Pi artifacts (chain templates, skills) are **generated**, never hand-maintained. This ensures a single source of truth and schema validation.

### 2. Chain Templates over Pure Skills

Complex workflows use Pi's `pi-prompt-template-model` chain system (frontmatter `chain` field) rather than trying to cram everything into a single SKILL.md. Skills are for knowledge injection; chains are for orchestration.

### 3. Router as a Skill, Not Running Code

The dispatcher that decides "which recipe to use" is a SKILL.md file — it runs inside Pi's agent loop. It does NOT require a separate process or MCP server. It uses pattern matching heuristics documented in the skill.

### 4. Categories (Tool Taxonomy)

| Category | Description | Examples |
|----------|-------------|----------|
| `thinking` | Structured reasoning and analysis | sequential-thinking, code-reasoning |
| `memory` | Storage, recall, and learning | pi-memory, pi-session-recall, mypensieve |
| `orchestration` | Workflow management and delegation | babysitter-pi, pi-boomerang, pi-subagents |
| `planning` | Task decomposition and tracking | plannotator, pi-task, pi-taskplane-planner |
| `documentation` | Codebase documentation and specs | pi-specdocs, pi-codebase-wiki, pi-mermaid |
| `communication` | User interaction and messaging | whatsapp-pi, ask-user-question, pi-gateway |
| `security` | Guards, secrets, and access control | pi-guardrails, pi-secret-guard, secret-guardian |
| `quality` | Code quality and formatting | pi-show-diffs, pi-formatter, pi-lcm |
| `infrastructure` | Dev tools and system integration | pi-toolchain, lsp-pi, pi-devtools, cleo-os |
| `meta` | Meta-tools and agent configuration | pi-lens, pi-extension-manager, pi-persona |
