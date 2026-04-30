# Recipe Dispatcher

Intelligent router that selects the optimal recipe for any coding task.

## When to Use
Route coding tasks to the optimal pre-configured recipe instead of ad-hoc tool selection.

## Available Recipes

| Recipe | Type | Description |
|--------|------|-------------|
| /sequential-analysis | auto | Matches analysis and reasoning requests |
| /design-pattern-eval | auto | Matches design pattern evaluation requests |
| /algorithm-selection | auto | Matches algorithm selection and analysis requests |
| /deep-debugging | auto | Matches debugging and error fixing requests |
| /safe-refactor | auto | Matches refactoring and code improvement requests |
| /code-review | auto | Matches code review requests |
| /architecture-review | auto | Matches architecture review and visualization requests |
| /feature-planning | auto | Matches feature planning and task management requests |
| /quick-docs | auto | Matches documentation generation requests |
| /security-audit | auto | Matches security audit and scanning requests |
| /memory-recall | auto | Matches memory recall and session history requests |
| /context-audit | auto | Matches context and token optimization requests |

## Routing Rules

When the user describes a task:
1. Extract keywords from the description
2. Match against routing rules (ordered by priority, lowest number first)
3. Invoke the matched recipe using `/<recipe-id>`
4. If no match, use `/${config.fallback_recipe}` as default

### Pattern Rules (ordered by priority)

- **[1]** `(think|analyze|reason|evaluate|compare|weigh|assess)` → `/sequential-analysis`
  - Matches analysis and reasoning requests
  - Category: thinking
- **[2]** `(design pattern|architectural pattern|which pattern|pattern for)` → `/design-pattern-eval`
  - Matches design pattern evaluation requests
  - Category: thinking
- **[2]** `(algorithm|data structure|complexity|big-o|time complexity|space complexity)` → `/algorithm-selection`
  - Matches algorithm selection and analysis requests
  - Category: thinking
- **[3]** `(debug|fix|error|crash|broken|failing|bug|issue|not working|wrong)` → `/deep-debugging`
  - Matches debugging and error fixing requests
  - Category: quality
- **[4]** `(refactor|clean up|improve|simplify|restructure|reorganize)` → `/safe-refactor`
  - Matches refactoring and code improvement requests
  - Category: quality
- **[5]** `(review|code review|pr review|look at this code|check this)` → `/code-review`
  - Matches code review requests
  - Category: quality
- **[6]** `(architecture|system design|codebase structure|module layout|component diagram)` → `/architecture-review`
  - Matches architecture review and visualization requests
  - Category: documentation
- **[7]** `(plan|roadmap|task|milestone|feature plan|sprint|backlog)` → `/feature-planning`
  - Matches feature planning and task management requests
  - Category: planning
- **[8]** `(document|spec|prd|adr|readme|specification|api doc)` → `/quick-docs`
  - Matches documentation generation requests
  - Category: documentation
- **[9]** `(security|vulnerability|secret|credential|audit|owasp|injection|xss)` → `/security-audit`
  - Matches security audit and scanning requests
  - Category: security
- **[10]** `(remember|recall|previous session|what did we|earlier|before|history)` → `/memory-recall`
  - Matches memory recall and session history requests
  - Category: memory
- **[11]** `(context|token|budget|memory usage|too long|running out)` → `/context-audit`
  - Matches context and token optimization requests
  - Category: meta

## Category Fallbacks

When no pattern matches, the router falls back to category-based matching:

- **thinking**: Analytical tasks requiring structured thought
  - Default: `/sequential-analysis`
  - Keywords: think, analyze, reason, evaluate, compare, design, algorithm, complexity

- **memory**: Retrieving information from past sessions
  - Default: `/memory-recall`
  - Keywords: remember, recall, previous, earlier, history, session

- **planning**: Task decomposition and project planning
  - Default: `/feature-planning`
  - Keywords: plan, task, roadmap, milestone, sprint, backlog

- **documentation**: Creating and maintaining documentation
  - Default: `/quick-docs`
  - Keywords: document, spec, prd, adr, readme

- **security**: Security audits and vulnerability scanning
  - Default: `/security-audit`
  - Keywords: security, vulnerability, secret, credential, audit

- **quality**: Code review, refactoring, and improvement
  - Default: `/code-review`
  - Keywords: review, refactor, clean, improve, debug, fix

- **infrastructure**: Development environment and tooling
  - Default: `/sequential-analysis`
  - Keywords: setup, install, configure, tool, environment

- **communication**: Messaging and user interaction
  - Default: `/sequential-analysis`
  - Keywords: message, notify, ask, question

- **meta**: Agent configuration and optimization
  - Default: `/context-audit`
  - Keywords: config, extension, model, token, context

## Fallback

If no rule or category matches, use `/sequential-analysis`.
Reason: Sequential thinking is the safest default for any unknown task type