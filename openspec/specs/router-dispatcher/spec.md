# Pi Recipes — Spec-Driven Router Dispatcher

## Purpose

Define the contract for the pattern-matching dispatcher that selects the optimal recipe for a given problem description.

## Domain Entity

### RouterRule

A heuristic rule that maps problem patterns to recipes.

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `pattern` | `string` | Regex or keyword pattern to match against user input |
| `recipe` | `string` | Recipe ID to invoke when matched |
| `priority` | `number` | Priority (1 = highest). Lower wins ties. |

#### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `description` | `string` | `""` | Human-readable description of when this rule applies |
| `conditions` | `Condition[]` | `[]` | Additional conditions that must be true |
| `category_hint` | `Category` | `null` | Expected problem category |
| `complexity_hint` | `RecipeComplexity` | `null` | Expected recipe complexity |
| `model_override` | `string` | `null` | Override the recipe's default model |
| `tags` | `string[]` | `[]` | Additional searchable tags |

### Condition

| Field | Type | Description |
|-------|------|-------------|
| `field` | `string` | Context field to check (e.g., "file_count", "error_present", "language") |
| `operator` | `ConditionOperator` | Comparison operator |
| `value` | `string` | Value to compare against |

### ConditionOperator (Enum)

```
eq | neq | contains | not_contains | gt | lt | gte | lte | regex | exists | not_exists
```

## Matching Algorithm

```
1. Extract keywords from user input
2. Score each rule:
   a. Pattern match: +100 if regex matches
   b. Keyword overlap: +10 per matching keyword
   c. Category match: +20 if context category matches rule category_hint
   d. Conditions: +50 if all conditions pass
3. Sort by score DESC, then priority ASC
4. Return top rule's recipe ID
5. If no rule scores > 0, return null (no match)
```

## Router Categories

The router maintains a mapping of problem types to expected categories:

| Problem Type | Expected Category | Example Keywords |
|-------------|-------------------|-----------------|
| "I need to think through this" | thinking | think, analyze, reason, evaluate, compare |
| "I can't remember what we did" | memory | remember, recall, context, history, previous |
| "Break this into smaller tasks" | planning | plan, task, step, milestone, roadmap |
| "Document this code" | documentation | document, explain, comment, readme, spec |
| "Something is broken" | quality | debug, fix, error, crash, broken, failing |
| "Make this code better" | quality | refactor, clean, optimize, improve, simplify |
| "Check for vulnerabilities" | security | security, vulnerability, secret, credential, audit |
| "Set up my environment" | infrastructure | setup, install, configure, tool, environment |

## Fallback Behavior

When no rule matches:
1. The router suggests using `sequential-thinking` as the default recipe
2. It logs the unmatched pattern for future rule creation
3. It recommends the user describe their task differently

## Validation Rules

1. `id` must be unique across all rules
2. `pattern` must be a valid regex (or simple keyword string)
3. `recipe` must reference a valid recipe ID
4. `priority` must be between 1 and 100
5. `conditions[].operator` must be a valid ConditionOperator

## Acceptance Criteria

- [ ] Router matches ≥90% of test problem descriptions to correct recipes
- [ ] No two rules with the same priority match the same pattern
- [ ] Conditions are evaluated correctly for all operators
- [ ] Fallback returns null for truly unmatched patterns
- [ ] The router SKILL.md is valid Pi skill format
