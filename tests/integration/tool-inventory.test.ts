/**
 * Integration test — validate ALL tool YAML files against the tool schema.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { toolSchema } from '../../src/schemas/tool.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = join(__dirname, '..', '..', 'data', 'tools');

const toolFiles = readdirSync(TOOLS_DIR)
  .filter((f) => f.endsWith('.yaml'))
  .sort();

describe('Tool Inventory Validation', () => {
  it(`has tool YAML files in ${TOOLS_DIR}`, () => {
    expect(toolFiles.length).toBeGreaterThanOrEqual(48);
  });

  it('has unique tool IDs', () => {
    const ids = toolFiles.map((f) => f.replace('.yaml', ''));
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const file of toolFiles) {
    it(`${file} validates against toolSchema`, () => {
      const raw = readFileSync(join(TOOLS_DIR, file), 'utf-8');
      const data = yaml.load(raw);
      const result = toolSchema.safeParse(data);
      expect(result.success, `${file}: ${result.success === false ? JSON.stringify(result.error.issues.map(i => i.message)) : ''}`).toBe(true);
    });
  }

  it('every tool has at least one capability', () => {
    for (const file of toolFiles) {
      const raw = readFileSync(join(TOOLS_DIR, file), 'utf-8');
      const data = yaml.load(raw);
      const result = toolSchema.safeParse(data);
      if (result.success) {
        expect(result.data.capabilities.length, `${file} has no capabilities`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('covers all 10 categories', () => {
    const categories = new Set<string>();
    for (const file of toolFiles) {
      const raw = readFileSync(join(TOOLS_DIR, file), 'utf-8');
      const data = yaml.load(raw);
      const result = toolSchema.safeParse(data);
      if (result.success) {
        categories.add(result.data.category);
      }
    }
    const expected = ['thinking', 'memory', 'orchestration', 'planning', 'documentation', 'communication', 'security', 'quality', 'infrastructure', 'meta'];
    for (const cat of expected) {
      expect(categories.has(cat), `Missing category: ${cat}`).toBe(true);
    }
  });
});
