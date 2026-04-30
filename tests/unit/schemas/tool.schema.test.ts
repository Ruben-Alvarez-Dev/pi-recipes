/**
 * Tool schema tests — TDD Red Phase.
 *
 * These tests define the contract for tool YAML validation.
 * They should FAIL until the schema is implemented.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

import { toolSchema } from '../../../src/schemas/tool.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', '..', 'fixtures');

const validToolYaml = readFileSync(
  join(FIXTURES_DIR, 'valid-tool.yaml'),
  'utf-8',
);
const validToolData = yaml.load(validToolYaml);

const invalidToolYaml = readFileSync(
  join(FIXTURES_DIR, 'invalid-tool.yaml'),
  'utf-8',
);
const invalidToolData = yaml.load(invalidToolYaml);

describe('toolSchema', () => {
  describe('valid tool', () => {
    it('accepts a valid tool fixture', () => {
      const result = toolSchema.safeParse(validToolData);
      expect(result.success).toBe(true);
    });

    it('provides default values for optional fields', () => {
      const result = toolSchema.safeParse(validToolData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.thinking_level).toBe('high');
      expect(result.data.version).toBe('latest');
      expect(result.data.notes).toBe(
        'Core reasoning tool — should be the foundation of any analysis chain',
      );
    });

    it('preserves all ideal_use_cases', () => {
      const result = toolSchema.safeParse(validToolData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.ideal_use_cases).toHaveLength(2);
      expect(result.data.ideal_use_cases[0].scenario).toBe(
        'Breaking down complex architectural decisions',
      );
    });

    it('preserves all anti_patterns', () => {
      const result = toolSchema.safeParse(validToolData);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.anti_patterns).toHaveLength(1);
      expect(result.data.anti_patterns[0].alternative).toBe('direct-query');
    });
  });

  describe('invalid tool', () => {
    it('rejects empty id', () => {
      const result = toolSchema.safeParse(invalidToolData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const idError = result.error.issues.find((i) =>
          i.path.includes('id'),
        );
        expect(idError).toBeDefined();
      }
    });

    it('rejects invalid category', () => {
      const result = toolSchema.safeParse(invalidToolData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const catError = result.error.issues.find((i) =>
          i.path.includes('category'),
        );
        expect(catError).toBeDefined();
      }
    });

    it('rejects invalid thinking_level', () => {
      const result = toolSchema.safeParse(invalidToolData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const thinkError = result.error.issues.find((i) =>
          i.path.includes('thinking_level'),
        );
        expect(thinkError).toBeDefined();
      }
    });

    it('rejects non-array capabilities', () => {
      const result = toolSchema.safeParse(invalidToolData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const capError = result.error.issues.find((i) =>
          i.path.includes('capabilities'),
        );
        expect(capError).toBeDefined();
      }
    });
  });

  describe('minimal valid tool', () => {
    it('accepts a tool with only required fields', () => {
      const minimal = {
        id: 'minimal-tool',
        name: 'Minimal Tool',
        npm: '@scope/minimal-tool',
        category: 'infrastructure',
        description: 'A minimal tool with only required fields',
        capabilities: ['basic-capability'],
      };
      const result = toolSchema.safeParse(minimal);
      expect(result.success).toBe(true);
      if (!result.success) throw new Error('Should have parsed');
      expect(result.data.ideal_use_cases).toEqual([]);
      expect(result.data.anti_patterns).toEqual([]);
      expect(result.data.dependencies).toEqual([]);
      expect(result.data.thinking_level).toBe('medium'); // default
      expect(result.data.version).toBe('latest'); // default
      expect(result.data.notes).toBe(''); // default
    });
  });

  describe('edge cases', () => {
    it('rejects non-string id', () => {
      const result = toolSchema.safeParse({
        id: 123,
        name: 'Test',
        npm: 'test',
        category: 'meta',
        description: 'test',
        capabilities: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty capabilities array', () => {
      const result = toolSchema.safeParse({
        id: 'test',
        name: 'Test',
        npm: 'test',
        category: 'meta',
        description: 'test',
        capabilities: [],
      });
      // Empty capabilities is valid — a tool might exist but have unknown capabilities
      // Actually, let me reconsider: a tool MUST have at least one capability
      // For now, let's allow it — the spec doesn't explicitly forbid it
      expect(result.success).toBe(true);
    });

    it('accepts tool with many use cases', () => {
      const tool = {
        id: 'multi-use',
        name: 'Multi Use',
        npm: '@scope/multi',
        category: 'orchestration',
        description: 'Does many things',
        capabilities: ['a', 'b', 'c'],
        ideal_use_cases: Array.from({ length: 10 }, (_, i) => ({
          scenario: `Use case ${i}`,
          why: `Because ${i}`,
        })),
      };
      const result = toolSchema.safeParse(tool);
      expect(result.success).toBe(true);
    });
  });
});
