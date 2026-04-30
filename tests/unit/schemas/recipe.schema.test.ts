/**
 * Recipe schema tests — TDD Red Phase.
 *
 * These tests define the contract for recipe YAML validation.
 * They should FAIL until the schema is implemented.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

import { recipeSchema } from '../../../src/schemas/recipe.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', '..', 'fixtures');

const validSimpleYaml = readFileSync(
  join(FIXTURES_DIR, 'valid-simple-recipe.yaml'),
  'utf-8',
);
const validSimpleData = yaml.load(validSimpleYaml);

const validComplexYaml = readFileSync(
  join(FIXTURES_DIR, 'valid-complex-recipe.yaml'),
  'utf-8',
);
const validComplexData = yaml.load(validComplexYaml);

describe('recipeSchema', () => {
  describe('valid simple recipe', () => {
    it('accepts a valid simple recipe fixture', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      expect(result.success).toBe(true);
    });

    it('marks complexity as simple', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.complexity).toBe('simple');
    });

    it('has exactly one step', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.steps).toHaveLength(1);
    });

    it('defaults boomerang to false', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.boomerang).toBe(false);
    });

    it('defaults worktree to false', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.worktree).toBe(false);
    });

    it('preserves tags', () => {
      const result = recipeSchema.safeParse(validSimpleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.tags).toEqual(['analysis', 'reasoning', 'thinking']);
    });
  });

  describe('valid complex recipe', () => {
    it('accepts a valid complex recipe fixture', () => {
      const result = recipeSchema.safeParse(validComplexData);
      expect(result.success).toBe(true);
    });

    it('marks complexity as complex', () => {
      const result = recipeSchema.safeParse(validComplexData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.complexity).toBe('complex');
    });

    it('has more than one step', () => {
      const result = recipeSchema.safeParse(validComplexData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.steps.length).toBeGreaterThanOrEqual(2);
    });

    it('preserves model override', () => {
      const result = recipeSchema.safeParse(validComplexData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.model).toBe('mimo-v2.5-pro');
    });

    it('preserves step-level overrides', () => {
      const result = recipeSchema.safeParse(validComplexData);
      if (!result.success) throw new Error('Should have parsed');
      const evalStep = result.data.steps[1];
      expect(evalStep.model).toBe('claude-sonnet-4-20250514');
      expect(evalStep.chain_context).toBe('summary');
    });

    it('boomerang is true', () => {
      const result = recipeSchema.safeParse(validComplexData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.boomerang).toBe(true);
    });
  });

  describe('invalid recipes', () => {
    it('rejects recipe with no steps', () => {
      const result = recipeSchema.safeParse({
        id: 'empty-recipe',
        name: 'Empty',
        description: 'No steps',
        archetype: 'analysis',
        complexity: 'simple',
        steps: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects recipe with invalid archetype', () => {
      const result = recipeSchema.safeParse({
        id: 'bad-arch',
        name: 'Bad Archetype',
        description: 'test',
        archetype: 'magic',
        complexity: 'simple',
        steps: [
          {
            id: 'step1',
            name: 'Step',
            tool: 'some-tool',
            prompt: 'Do something',
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('rejects recipe with duplicate step ids', () => {
      const result = recipeSchema.safeParse({
        id: 'dup-steps',
        name: 'Duplicate Steps',
        description: 'test',
        archetype: 'implementation',
        complexity: 'complex',
        steps: [
          { id: 'dup', name: 'First', tool: 'a', prompt: 'A' },
          { id: 'dup', name: 'Second', tool: 'b', prompt: 'B' },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('rejects simple recipe with 2+ steps', () => {
      const result = recipeSchema.safeParse({
        id: 'bad-simple',
        name: 'Bad Simple',
        description: 'test',
        archetype: 'analysis',
        complexity: 'simple',
        steps: [
          { id: 'a', name: 'A', tool: 'x', prompt: 'A' },
          { id: 'b', name: 'B', tool: 'y', prompt: 'B' },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('rejects complex recipe with 1 step', () => {
      const result = recipeSchema.safeParse({
        id: 'bad-complex',
        name: 'Bad Complex',
        description: 'test',
        archetype: 'analysis',
        complexity: 'complex',
        steps: [{ id: 'a', name: 'A', tool: 'x', prompt: 'A' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects step with empty prompt', () => {
      const result = recipeSchema.safeParse({
        id: 'empty-prompt',
        name: 'Empty Prompt',
        description: 'test',
        archetype: 'analysis',
        complexity: 'simple',
        steps: [{ id: 'a', name: 'A', tool: 'x', prompt: '' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects step with empty tool', () => {
      const result = recipeSchema.safeParse({
        id: 'empty-tool',
        name: 'Empty Tool',
        description: 'test',
        archetype: 'analysis',
        complexity: 'simple',
        steps: [{ id: 'a', name: 'A', tool: '', prompt: 'Do stuff' }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loop configuration', () => {
    it('accepts step with loop config', () => {
      const result = recipeSchema.safeParse({
        id: 'loop-recipe',
        name: 'Loop Recipe',
        description: 'test',
        archetype: 'optimization',
        complexity: 'simple',
        steps: [
          {
            id: 'iterate',
            name: 'Iterate',
            tool: 'pi-formatter',
            prompt: 'Format the code',
            loop: { count: 3, converge: true, fresh: true, rotate: false },
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('rejects loop count below 1', () => {
      const result = recipeSchema.safeParse({
        id: 'bad-loop',
        name: 'Bad Loop',
        description: 'test',
        archetype: 'optimization',
        complexity: 'simple',
        steps: [
          {
            id: 'iterate',
            name: 'Iterate',
            tool: 'pi-formatter',
            prompt: 'Format',
            loop: { count: 0 },
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('rejects loop count above 999', () => {
      const result = recipeSchema.safeParse({
        id: 'big-loop',
        name: 'Big Loop',
        description: 'test',
        archetype: 'optimization',
        complexity: 'simple',
        steps: [
          {
            id: 'iterate',
            name: 'Iterate',
            tool: 'pi-formatter',
            prompt: 'Format',
            loop: { count: 1000 },
          },
        ],
      });
      expect(result.success).toBe(false);
    });
  });
});
