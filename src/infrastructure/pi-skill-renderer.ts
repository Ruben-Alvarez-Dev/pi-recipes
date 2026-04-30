/**
 * Skill Renderer — converts router rules to a Pi SKILL.md dispatcher.
 *
 * Spec: specs/router-dispatcher.spec.md
 */

import type { RouterRule } from '../domain/router-rule.js';
import type { Category } from '../domain/value-objects.js';

interface CategoryDef {
  name: string;
  description: string;
  default_recipe: string;
  keywords: string[];
}

interface RouterConfig {
  rules: RouterRule[];
  categories: Record<string, CategoryDef>;
  fallback_recipe: string;
  fallback_reason: string;
}

export function renderRouterSkill(config: RouterConfig): string {
  const lines: string[] = [];

  // Header
  lines.push('# Recipe Dispatcher');
  lines.push('');
  lines.push('Intelligent router that selects the optimal recipe for any coding task.');
  lines.push('');
  lines.push('## When to Use');
  lines.push('Route coding tasks to the optimal pre-configured recipe instead of ad-hoc tool selection.');
  lines.push('');

  // Available Recipes
  lines.push('## Available Recipes');
  lines.push('');
  lines.push('| Recipe | Type | Description |');
  lines.push('|--------|------|-------------|');

  const recipes = new Map<string, { description: string; type: string }>();
  for (const rule of config.rules) {
    if (!recipes.has(rule.recipe)) {
      recipes.set(rule.recipe, {
        description: rule.description || rule.pattern,
        type: rule.complexity_hint || 'auto',
      });
    }
  }
  for (const [id, info] of recipes) {
    lines.push(`| /${id} | ${info.type} | ${info.description} |`);
  }
  lines.push('');

  // Routing Rules
  lines.push('## Routing Rules');
  lines.push('');
  lines.push('When the user describes a task:');
  lines.push('1. Extract keywords from the description');
  lines.push('2. Match against routing rules (ordered by priority, lowest number first)');
  lines.push('3. Invoke the matched recipe using `/<recipe-id>`');
  lines.push('4. If no match, use `/${config.fallback_recipe}` as default');
  lines.push('');
  lines.push('### Pattern Rules (ordered by priority)');
  lines.push('');

  const sortedRules = [...config.rules].sort((a, b) => a.priority - b.priority);
  for (const rule of sortedRules) {
    lines.push(`- **[${rule.priority}]** \`${rule.pattern}\` → \`/${rule.recipe}\``);
    if (rule.description) {
      lines.push(`  - ${rule.description}`);
    }
    if (rule.category_hint) {
      lines.push(`  - Category: ${rule.category_hint}`);
    }
    if (rule.model_override) {
      lines.push(`  - Model: ${rule.model_override}`);
    }
  }
  lines.push('');

  // Categories
  lines.push('## Category Fallbacks');
  lines.push('');
  lines.push('When no pattern matches, the router falls back to category-based matching:');
  lines.push('');

  for (const [cat, def] of Object.entries(config.categories)) {
    lines.push(`- **${cat}**: ${def.description}`);
    lines.push(`  - Default: \`/${def.default_recipe}\``);
    lines.push(`  - Keywords: ${def.keywords.join(', ')}`);
    lines.push('');
  }

  // Fallback
  lines.push('## Fallback');
  lines.push('');
  lines.push(`If no rule or category matches, use \`/${config.fallback_recipe}\`.`);
  lines.push(`Reason: ${config.fallback_reason}`);

  return lines.join('\n');
}
