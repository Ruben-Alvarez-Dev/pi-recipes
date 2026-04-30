# Pi Recipes — Spec-Driven Artifact Generation

## Purpose

Define the contract for generating Pi-compatible artifacts from YAML source data.

## Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   YAML   │────▶│ Validate │────▶│  Render  │────▶│  Deploy  │
│  Source  │     │  (Zod)   │     │ (.md)    │     │ (~/.pi/) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

## Artifacts

### 1. Chain Templates (→ `~/.pi/agent/prompts/`)

Rendered from Recipe YAML. Format: `pi-prompt-template-model` compatible markdown with frontmatter.

**Filename:** `<recipe-id>.md`

**Structure:**
```markdown
---
description: <recipe.description>
model: <model or fallback>
thinking: <level or fallback>
chain: <step IDs joined by " -> ">
chainContext: <context mode>
boomerang: <boolean>
worktree: <boolean>
---

## Step: <step.name>
<step.prompt>
```

### 2. Skills (→ `~/.pi/agent/skills/<skill-name>/SKILL.md`)

Generated from RouterRule YAML. The main artifact is the recipe-dispatcher skill.

**Filename:** `recipe-dispatcher/SKILL.md`

**Structure:**
```markdown
# Recipe Dispatcher

## When to Use
Route coding tasks to the optimal pre-configured recipe.

## Available Recipes
<table of recipe ID, name, archetype>

## Routing Rules
<ordered rules with patterns and conditions>

## Usage
When the user describes a task:
1. Extract keywords from the description
2. Match against routing rules (ordered by priority)
3. Invoke the matched recipe using /<recipe-id>
4. If no match, use /sequential-analysis as default

## Fallback
If no recipe matches, use sequential thinking as the default approach.
```

## Generator Requirements

### Input
- Path to `data/tools/` directory
- Path to `data/recipes/` directory
- Path to `data/router/` directory

### Output
- Path to `artifacts/prompts/` directory
- Path to `artifacts/skills/` directory

### Validation (Pre-generation)
1. Load and parse all YAML files
2. Validate against schemas (reject if invalid)
3. Resolve all cross-references (tool IDs, recipe IDs)
4. Report errors and warnings

### Rendering
1. Sort recipes by complexity (simple first)
2. Render each recipe to a chain template
3. Render router rules to dispatcher skill
4. Write all artifacts to output directories

### Deployment
1. Read artifact output directories
2. Copy chain templates to `~/.pi/agent/prompts/`
3. Copy skills to `~/.pi/agent/skills/`
4. Report what was created/updated/removed

## CLI Interface

```bash
# Validate all data files
npx tsx src/index.ts validate

# Generate artifacts from data
npx tsx src/index.ts generate

# Deploy artifacts to Pi
npx tsx src/index.ts deploy

# Full pipeline (validate + generate + deploy)
npx tsx src/index.ts pipeline

# Check status (what's deployed, what's changed)
npx tsx src/index.ts status
```

## Acceptance Criteria

- [ ] `validate` exits 0 if all YAML is valid, 1 otherwise
- [ ] `generate` produces valid Pi chain templates for every recipe
- [ ] `generate` produces a valid Pi skill for the router
- [ ] `deploy` copies artifacts to correct Pi directories
- [ ] `pipeline` runs the full sequence without errors
- [ ] Generated chain templates load in Pi without errors
- [ ] Idempotent: running `pipeline` twice produces the same output
