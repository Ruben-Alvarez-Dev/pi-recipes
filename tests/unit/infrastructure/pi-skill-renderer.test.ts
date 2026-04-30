/**
 * Skill renderer tests — TDD.
 */

import { describe, it, expect } from 'vitest';
import { renderRouterSkill } from '../../../src/infrastructure/pi-skill-renderer.js';
import type { RouterRule } from '../../../src/domain/router-rule.js';

const mockRule1: RouterRule = {
  id: 'test-rule-1',
  pattern: '(think|analyze)',
  recipe: 'sequential-analysis',
  priority: 1,
  description: 'Matches thinking requests',
  category_hint: 'thinking',
  conditions: [],
  tags: ['thinking'],
};

const mockRule2: RouterRule = {
  id: 'test-rule-2',
  pattern: '(debug|fix)',
  recipe: 'deep-debugging',
  priority: 3,
  description: 'Matches debugging requests',
  category_hint: 'quality',
  model_override: 'claude-sonnet-4-20250514',
  conditions: [],
  tags: ['debugging'],
};

function makeConfig(overrides = {}) {
  return {
    rules: [mockRule1, mockRule2],
    categories: {
      thinking: {
        name: 'Thinking and Reasoning',
        description: 'Analytical tasks',
        default_recipe: 'sequential-analysis',
        keywords: ['think', 'analyze', 'reason'],
      },
      quality: {
        name: 'Code Quality',
        description: 'Quality tasks',
        default_recipe: 'code-review',
        keywords: ['review', 'debug', 'fix'],
      },
    },
    fallback_recipe: 'sequential-analysis',
    fallback_reason: 'Sequential thinking is the safest default',
    ...overrides,
  };
}

describe('renderRouterSkill', () => {
  it('renders a valid SKILL.md format', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('# Recipe Dispatcher');
    expect(skill).toContain('## When to Use');
    expect(skill).toContain('## Available Recipes');
    expect(skill).toContain('## Routing Rules');
    expect(skill).toContain('## Category Fallbacks');
    expect(skill).toContain('## Fallback');
  });

  it('includes all recipes in the table', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('| /sequential-analysis |');
    expect(skill).toContain('| /deep-debugging |');
  });

  it('sorts rules by priority (ascending)', () => {
    const skill = renderRouterSkill(makeConfig());
    const priority1Idx = skill.indexOf('[1]');
    const priority3Idx = skill.indexOf('[3]');

    expect(priority1Idx).toBeLessThan(priority3Idx);
  });

  it('includes pattern regex in rules', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('(think|analyze)');
    expect(skill).toContain('(debug|fix)');
  });

  it('includes description for rules', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('Matches thinking requests');
    expect(skill).toContain('Matches debugging requests');
  });

  it('includes category_hint when set', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('Category: thinking');
    expect(skill).toContain('Category: quality');
  });

  it('includes model_override when set', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('Model: claude-sonnet-4-20250514');
  });

  it('includes category fallbacks with defaults', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('Default: `/sequential-analysis`');
    expect(skill).toContain('Default: `/code-review`');
    expect(skill).toContain('Keywords: think, analyze, reason');
  });

  it('includes fallback recipe and reason', () => {
    const skill = renderRouterSkill(makeConfig());

    expect(skill).toContain('If no rule or category matches');
    expect(skill).toContain('/sequential-analysis');
    expect(skill).toContain('Sequential thinking is the safest default');
  });

  it('handles empty rules list', () => {
    const skill = renderRouterSkill(makeConfig({ rules: [] }));

    expect(skill).toContain('# Recipe Dispatcher');
    expect(skill).toContain('| Recipe | Type | Description |');
    // No recipes in table body (just header)
  });

  it('handles empty categories', () => {
    const skill = renderRouterSkill(makeConfig({ categories: {} }));

    expect(skill).toContain('# Recipe Dispatcher');
    expect(skill).toContain('## Category Fallbacks');
  });
});
