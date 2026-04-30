# Pi Recipes — Spec-Driven Tool Inventory System

## Purpose

Define the contract for how Pi extensions are catalogued, validated, and queried.

## Domain Entities

### Tool

A Pi extension package with analyzed capabilities and use cases.

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (kebab-case, npm package name safe) |
| `name` | `string` | Human-readable name |
| `npm` | `string` | Full npm package specifier |
| `category` | `Category` | Primary classification |
| `description` | `string` | One-paragraph description of what the extension does |
| `capabilities` | `string[]` | List of distinct capabilities the extension provides |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `ideal_use_cases` | `UseCase[]` | `[]` | Scenarios where this tool excels |
| `anti_patterns` | `AntiPattern[]` | `[]` | Scenarios where this tool should NOT be used |
| `dependencies` | `string[]` | `[]` | Other extensions this one depends on |
| `thinking_level` | `ThinkingLevel` | `"medium"` | Recommended thinking level for this tool |
| `notes` | `string` | `""` | Additional context or caveats |
| `version` | `string` | `"latest"` | Pinned version if needed |

### UseCase

| Field | Type | Description |
|-------|------|-------------|
| `scenario` | `string` | Description of the scenario |
| `why` | `string` | Why this tool is ideal for this scenario |
| `model_hint` | `string` | Recommended model (e.g., "mimo-v2.5-pro", "claude-sonnet-4") |
| `recipe_hint` | `string` | ID of a recipe that uses this tool for this scenario |

### AntiPattern

| Field | Type | Description |
|-------|------|-------------|
| `scenario` | `string` | Description of the anti-pattern |
| `why` | `string` | Why this tool is wrong for this scenario |
| `alternative` | `string` | ID of the tool that should be used instead |

### Category (Enum)

```
thinking | memory | orchestration | planning | documentation |
communication | security | quality | infrastructure | meta
```

### ThinkingLevel (Enum)

```
off | minimal | low | medium | high | xhigh
```

## Validation Rules

1. `id` must be unique across all tools
2. `npm` must be a valid npm package specifier
3. `category` must be a valid Category enum value
4. `ideal_use_cases[].model_hint` must be a known model identifier
5. `anti_patterns[].alternative` must reference a valid tool `id`
6. `dependencies[]` must reference valid tool `id`s
7. `thinking_level` must be a valid ThinkingLevel enum value

## Acceptance Criteria

- [ ] Every tool YAML file passes schema validation
- [ ] All cross-references (`alternative`, `dependencies`) resolve to existing tool IDs
- [ ] No duplicate tool IDs
- [ ] Every tool has at least one ideal_use_case OR a note explaining why it has none
