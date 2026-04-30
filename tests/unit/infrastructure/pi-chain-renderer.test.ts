/**
 * Chain template renderer tests — TDD.
 */

import { describe, it, expect } from 'vitest';
import { renderChainTemplate, renderRecipeFilename } from '../../../src/infrastructure/pi-chain-renderer.js';
import type { Recipe } from '../../../src/domain/recipe.js';

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 'test-recipe',
    name: 'Test Recipe',
    description: 'A test recipe',
    archetype: 'analysis',
    complexity: 'simple',
    steps: [
      {
        id: 'step1',
        name: 'First Step',
        tool: 'pi-sequential-thinking',
        prompt: 'Do something',
      },
    ],
    tags: [],
    prerequisites: [],
    ...overrides,
  } as Recipe;
}

describe('renderChainTemplate', () => {
  describe('simple recipe', () => {
    it('renders valid pi-prompt-template-model frontmatter', () => {
      const recipe = makeRecipe();
      const output = renderChainTemplate(recipe);

      expect(output).toContain('---');
      expect(output).toContain('description: A test recipe');
      expect(output).toContain('chain: step1');
      expect(output).toContain('chainContext: full');
      expect(output).toContain('boomerang: false');
      expect(output).toContain('worktree: false');
    });

    it('includes step body with tool name', () => {
      const recipe = makeRecipe();
      const output = renderChainTemplate(recipe);

      expect(output).toContain('## Step: First Step');
      expect(output).toContain('Tool: pi-sequential-thinking');
      expect(output).toContain('Do something');
    });

    it('defaults boomerang and worktree to false', () => {
      const recipe = makeRecipe();
      const output = renderChainTemplate(recipe);

      expect(output).toContain('boomerang: false');
      expect(output).toContain('worktree: false');
    });
  });

  describe('recipe with model and thinking', () => {
    it('includes model in frontmatter when set', () => {
      const recipe = makeRecipe({ model: 'claude-sonnet-4-20250514', thinking: 'high' });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('model: claude-sonnet-4-20250514');
      expect(output).toContain('thinking: high');
    });

    it('omits model and thinking from frontmatter when not set', () => {
      const recipe = makeRecipe({ model: undefined, thinking: undefined });
      const output = renderChainTemplate(recipe);

      expect(output).not.toContain('model:');
      expect(output).not.toContain('thinking:');
    });
  });

  describe('complex recipe with multiple steps', () => {
    it('chains step IDs in frontmatter', () => {
      const recipe = makeRecipe({
        complexity: 'complex',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step A' },
          { id: 'b', name: 'B', tool: 'tool2', prompt: 'Step B' },
          { id: 'c', name: 'C', tool: 'tool3', prompt: 'Step C' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('chain: a -> b -> c');
    });

    it('includes all step bodies', () => {
      const recipe = makeRecipe({
        complexity: 'complex',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step A' },
          { id: 'b', name: 'B', tool: 'tool2', prompt: 'Step B' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('## Step: A');
      expect(output).toContain('## Step: B');
      expect(output).toContain('Step A');
      expect(output).toContain('Step B');
    });
  });

  describe('step-level overrides', () => {
    it('shows step model when different from recipe model', () => {
      const recipe = makeRecipe({
        model: 'mimo-v2.5-pro',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', model: 'claude-sonnet-4-20250514' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Model: claude-sonnet-4-20250514');
    });

    it('shows step thinking when different from recipe thinking', () => {
      const recipe = makeRecipe({
        thinking: 'medium',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', thinking: 'high' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Thinking: high');
    });

    it('shows skill when set', () => {
      const recipe = makeRecipe({
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', skill: 'tool-router' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Skill: tool-router');
    });

    it('shows parallel when > 1', () => {
      const recipe = makeRecipe({
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', parallel: 3 },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Parallel: 3');
    });

    it('shows loop config when set', () => {
      const recipe = makeRecipe({
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', loop: { count: 5, converge: true, fresh: true } },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Loop: count: 5');
      expect(output).toContain('converge: true');
      expect(output).toContain('fresh: true');
    });

    it('shows condition when set', () => {
      const recipe = makeRecipe({
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'Step', condition: 'file_count > 5' },
        ],
      });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('Condition: file_count > 5');
    });
  });

  describe('chain context defaults', () => {
    it('first step gets full context by default', () => {
      const recipe = makeRecipe({
        complexity: 'complex',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'A' },
          { id: 'b', name: 'B', tool: 'tool2', prompt: 'B' },
        ],
      });
      const output = renderChainTemplate(recipe);

      // First step context
      const firstStepIdx = output.indexOf('## Step: A');
      const firstContextIdx = output.indexOf('Context:', firstStepIdx);
      const firstContextLine = output.substring(firstContextIdx, firstContextIdx + 20);
      expect(firstContextLine).toContain('full');
    });

    it('subsequent steps get summary context by default', () => {
      const recipe = makeRecipe({
        complexity: 'complex',
        steps: [
          { id: 'a', name: 'A', tool: 'tool1', prompt: 'A' },
          { id: 'b', name: 'B', tool: 'tool2', prompt: 'B' },
        ],
      });
      const output = renderChainTemplate(recipe);

      // Second step context
      const secondStepIdx = output.indexOf('## Step: B');
      const secondContextIdx = output.indexOf('Context:', secondStepIdx);
      const secondContextLine = output.substring(secondContextIdx, secondContextIdx + 20);
      expect(secondContextLine).toContain('summary');
    });
  });

  describe('boomerang and worktree', () => {
    it('sets boomerang to true when enabled', () => {
      const recipe = makeRecipe({ boomerang: true });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('boomerang: true');
    });

    it('sets worktree to true when enabled', () => {
      const recipe = makeRecipe({ worktree: true });
      const output = renderChainTemplate(recipe);

      expect(output).toContain('worktree: true');
    });
  });
});

describe('renderRecipeFilename', () => {
  it('returns recipe-id.md', () => {
    expect(renderRecipeFilename(makeRecipe())).toBe('test-recipe.md');
    expect(renderRecipeFilename(makeRecipe({ id: 'safe-refactor' }))).toBe('safe-refactor.md');
  });
});
