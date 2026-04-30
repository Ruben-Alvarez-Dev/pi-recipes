# Pi Recipes — Spec-Driven Recipe System

## Purpose

Define the contract for multi-step workflow recipes that chain Pi tools for archetypal tasks.

## Domain Entities

### Recipe

A composable workflow that chains one or more Pi tools to accomplish a specific task archetype.

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (kebab-case) |
| `name` | `string` | Human-readable name |
| `description` | `string` | One-paragraph description of what this recipe accomplishes |
| `archetype` | `RecipeArchetype` | The task archetype this recipe solves |
| `complexity` | `RecipeComplexity` | Simple (1 tool) or complex (2+ tools) |
| `steps` | `RecipeStep[]` | Ordered steps in the workflow |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `model` | `string` | Inherit from step | Override model for entire recipe |
| `thinking` | `ThinkingLevel` | Inherit from step | Override thinking level |
| `boomerang` | `boolean` | `false` | Collapse context after execution |
| `worktree` | `boolean` | `false` | Run in separate git worktree |
| `tags` | `string[]` | `[]` | Searchable tags |
| `prerequisites` | `string[]` | `[]` | Required tool IDs or conditions |

### RecipeStep

A single step within a recipe, mapping to one Pi tool invocation.

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique within recipe (kebab-case) |
| `name` | `string` | Human-readable step name |
| `tool` | `string` | Tool ID this step uses |
| `prompt` | `string` | The prompt/instructions for this step |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `model` | `string` | Recipe model | Step-specific model override |
| `thinking` | `ThinkingLevel` | Recipe thinking | Step-specific thinking level |
| `skill` | `string` | `""` | Additional skill to inject for this step |
| `chain_context` | `ChainContext` | `"full"` | How much context from previous steps |
| `parallel` | `number` | `1` | Number of parallel instances |
| `condition` | `string` | `""` | Conditional expression (skip if false) |
| `loop` | `LoopConfig` | `null` | Loop configuration for iterative steps |

### LoopConfig

| Field | Type | Description |
|-------|------|-------------|
| `count` | `number` | Number of iterations (1-999) |
| `converge` | `boolean` | Stop early if no changes detected |
| `fresh` | `boolean` | Collapse context between iterations |
| `rotate` | `boolean` | Cycle through model list |

### ChainContext (Enum)

```
full | summary | none
```

### RecipeArchetype (Enum)

```
analysis | design | implementation | testing | debugging |
refactoring | documentation | planning | review | security |
optimization | research | deployment | monitoring
```

### RecipeComplexity (Enum)

```
simple | complex
```

## Validation Rules

1. `id` must be unique across all recipes
2. `steps[].tool` must reference a valid tool ID from the inventory
3. `steps[].model` must be a known model identifier
4. `steps[].skill` must reference an existing skill name
5. `prerequisites[]` must reference valid tool IDs
6. Simple recipes must have exactly 1 step
7. Complex recipes must have 2+ steps
8. Step IDs must be unique within a recipe
9. Loop count must be between 1 and 999

## Rendering Contract

When rendered to a Pi chain template (markdown), the output must be a valid `pi-prompt-template-model` frontmatter + body:

```markdown
---
description: <recipe.description>
model: <recipe.model or step.model>
thinking: <recipe.thinking or step.thinking>
chain: <step1.id> -> <step2.id> -> ...
chainContext: <chain_context>
boomerang: <recipe.boomerang>
---

## Step: <step1.name>
<step1.prompt>

## Step: <step2.name>
<step2.prompt>
```

## Acceptance Criteria

- [ ] Every recipe YAML passes schema validation
- [ ] All tool references resolve to existing tool IDs
- [ ] Simple recipes render to valid Pi prompt templates
- [ ] Complex recipes render to valid Pi chain templates
- [ ] Rendered templates are loadable by Pi without errors
