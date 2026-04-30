# Glossary

| Term | Definition |
|------|-----------|
| **Artifact** | A generated file deployed to Pi's agent directory (chain template or skill) |
| **AntiPattern** | A scenario where a tool should NOT be used, with explanation and alternative |
| **Category** | A classification for Pi extensions (thinking, memory, orchestration, etc.) |
| **Chain Template** | A `pi-prompt-template-model` markdown file with frontmatter that defines a multi-step workflow |
| **ChainContext** | How much context from previous steps flows to the next step (`full`, `summary`, `none`) |
| **Complexity** | Recipe complexity: `simple` (1 tool) or `complex` (2+ tools chained) |
| **Condition** | A boolean expression evaluated during router matching (field + operator + value) |
| **Frontmatter** | YAML block at the top of a markdown file, delimited by `---`, used by `pi-prompt-template-model` |
| **Inventory** | The complete catalog of analyzed Pi extensions in YAML format |
| **LoopConfig** | Configuration for iterative recipe steps (count, converge, fresh, rotate) |
| **Model Hint** | A suggested AI model for a specific use case or recipe |
| **Recipe** | A composable workflow definition that chains Pi tools for a specific task archetype |
| **RecipeStep** | A single step within a recipe, mapping to one tool invocation |
| **RecipeArchetype** | The type of task a recipe solves (analysis, design, implementation, etc.) |
| **RouterRule** | A heuristic rule that maps problem patterns to recipes |
| **Skill** | A SKILL.md file in `~/.pi/agent/skills/` that provides instructions to Pi's agent |
| **ThinkingLevel** | AI reasoning intensity: `off`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| **Tool** | A Pi extension package with analyzed capabilities and use cases |
| **UseCase** | A scenario where a tool excels, with explanation and model recommendation |
| **YAML** | The source-of-truth format for all data definitions (tools, recipes, router rules) |
