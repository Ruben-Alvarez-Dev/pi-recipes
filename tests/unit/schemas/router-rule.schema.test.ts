/**
 * Router rule schema tests — TDD Red Phase.
 *
 * These tests define the contract for router rule YAML validation.
 * They should FAIL until the schema is implemented.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

import { routerRuleSchema } from '../../../src/schemas/router-rule.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', '..', 'fixtures');

const validRuleYaml = readFileSync(
  join(FIXTURES_DIR, 'valid-router-rule.yaml'),
  'utf-8',
);
const validRuleData = yaml.load(validRuleYaml);

describe('routerRuleSchema', () => {
  describe('valid router rule', () => {
    it('accepts a valid router rule fixture', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      expect(result.success).toBe(true);
    });

    it('preserves priority', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.priority).toBe(1);
    });

    it('preserves pattern', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.pattern).toBe(
        '(think|analyze|reason|evaluate|compare)',
      );
    });

    it('defaults conditions to empty array', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.conditions).toEqual([]);
    });

    it('defaults tags to empty array', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.tags).toEqual(['thinking', 'analysis']);
    });

    it('preserves category_hint', () => {
      const result = routerRuleSchema.safeParse(validRuleData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.category_hint).toBe('thinking');
    });
  });

  describe('invalid router rules', () => {
    it('rejects empty id', () => {
      const result = routerRuleSchema.safeParse({
        id: '',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty pattern', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: '',
        recipe: 'some-recipe',
        priority: 1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty recipe reference', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: 'test',
        recipe: '',
        priority: 1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects priority below 1', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects priority above 100', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 101,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid category_hint', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 1,
        category_hint: 'nonexistent',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid complexity_hint', () => {
      const result = routerRuleSchema.safeParse({
        id: 'test-rule',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 1,
        complexity_hint: 'medium',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('conditions', () => {
    it('accepts valid conditions', () => {
      const result = routerRuleSchema.safeParse({
        id: 'conditional-rule',
        pattern: 'refactor',
        recipe: 'safe-refactor',
        priority: 1,
        conditions: [
          { field: 'file_count', operator: 'gt', value: '5' },
          { field: 'language', operator: 'eq', value: 'typescript' },
        ],
      });
      expect(result.success).toBe(true);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.conditions).toHaveLength(2);
    });

    it('rejects invalid condition operator', () => {
      const result = routerRuleSchema.safeParse({
        id: 'bad-operator',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 1,
        conditions: [{ field: 'x', operator: 'between', value: '1,10' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects condition with empty field', () => {
      const result = routerRuleSchema.safeParse({
        id: 'empty-field',
        pattern: 'test',
        recipe: 'some-recipe',
        priority: 1,
        conditions: [{ field: '', operator: 'eq', value: 'test' }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('minimal valid rule', () => {
    it('accepts a rule with only required fields', () => {
      const minimal = {
        id: 'minimal-rule',
        pattern: 'hello',
        recipe: 'greeting',
        priority: 50,
      };
      const result = routerRuleSchema.safeParse(minimal);
      expect(result.success).toBe(true);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.description).toBeUndefined();
      expect(result.data.conditions).toEqual([]);
      expect(result.data.tags).toEqual([]);
      expect(result.data.category_hint).toBeUndefined();
      expect(result.data.complexity_hint).toBeUndefined();
      expect(result.data.model_override).toBeUndefined();
    });
  });
});
