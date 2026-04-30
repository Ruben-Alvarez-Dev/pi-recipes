# Pi Recipes

Spec-driven orchestration system for the Pi coding agent. Analyzes 48+ extensions, chains them into reusable recipes, and dispatches the right workflow for any task — without loading everything into memory.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tool      │     │   Recipe    │     │   Router    │
│  Inventory  │────▶│  System     │────▶│ Dispatcher  │
│  (48 tools) │     │  (chains)   │     │  (skill)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
              ┌────────────────────┐
              │  YAML → Generator  │
              │  → Pi Artifacts    │
              └────────────────────┘
```

## Layers

| Layer | Purpose | Format |
|-------|---------|--------|
| **Data** | Source of truth for tools, recipes, rules | YAML |
| **Domain** | Entities, value objects, validation | TypeScript + Zod |
| **Application** | Use cases (validate, generate, deploy) | TypeScript |
| **Infrastructure** | Pi-specific rendering and deployment | TypeScript |
| **Artifacts** | Deployed Pi chain templates and skills | Markdown |

## Quick Start

```bash
# Validate all data
npm run validate

# Generate Pi artifacts from YAML
npm run generate

# Deploy to ~/.pi/agent/
npm run deploy

# Full pipeline
npm run pipeline
```

## Project Structure

```
pi-recipes/
├── src/            # Domain + Application + Infrastructure
├── data/           # YAML source of truth (tools, recipes, router)
├── openspec/       # SDD — specs, changes, archive
├── tests/          # TDD — tests first, always
├── docs/           # Architecture, glossary, ADRs
└── artifacts/      # Generated output (not committed)
```

## Principles

- **Spec-Driven**: Every artifact has a spec before implementation
- **TDD**: Tests before code, always
- **DRY**: YAML is source of truth; artifacts are generated
- **SOLID + DDD + Clean Architecture**: Domain logic is framework-agnostic
- **Conventional Commits**: English, 2-4 sentences, organic

## License

MIT
