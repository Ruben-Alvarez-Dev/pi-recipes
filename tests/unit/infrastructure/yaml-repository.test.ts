/**
 * YAML repository tests — TDD.
 */

import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateTools,
  validateRecipes,
  loadTools,
  loadRouterRules,
  writeArtifact,
} from '../../../src/infrastructure/yaml-repository.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');
const FIXTURES = join(ROOT, 'data');
const TMP_DIR = join(__dirname, '..', '_tmp_test');

function setupTmpDir() {
  rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });
}

function cleanupTmpDir() {
  rmSync(TMP_DIR, { recursive: true, force: true });
}

describe('validateTools', () => {
  it('returns correct count for valid tools directory', () => {
    const result = validateTools(join(ROOT, 'data', 'tools'));

    expect(result.valid).toBe(49);
    expect(result.invalid).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('returns errors for invalid tool files', () => {
    setupTmpDir();
    writeFileSync(
      join(TMP_DIR, 'bad-tool.yaml'),
      'id: "bad-tool"\nname: "Bad"\nnpm: "x"\ncategory: imaginary\n',
    );

    const result = validateTools(TMP_DIR);

    expect(result.valid).toBe(0);
    expect(result.invalid).toBe(1);
    expect(result.errors[0].file).toBe('bad-tool.yaml');

    cleanupTmpDir();
  });

  it('returns zero counts for empty directory', () => {
    setupTmpDir();
    const result = validateTools(TMP_DIR);

    expect(result.valid).toBe(0);
    expect(result.invalid).toBe(0);
    cleanupTmpDir();
  });
});

describe('validateRecipes', () => {
  it('returns correct count for valid recipes directory', () => {
    const result = validateRecipes(join(ROOT, 'data', 'recipes'));

    expect(result.valid).toBe(13);
    expect(result.invalid).toBe(0);
  });

  it('handles missing subdirectories gracefully', () => {
    setupTmpDir();
    const result = validateRecipes(TMP_DIR);

    expect(result.valid).toBe(0);
    expect(result.invalid).toBe(0);
    cleanupTmpDir();
  });

  it('returns errors for invalid recipe files', () => {
    setupTmpDir();
    mkdirSync(join(TMP_DIR, 'simple'), { recursive: true });
    writeFileSync(
      join(TMP_DIR, 'simple', 'bad.yaml'),
      'id: "bad"\nname: "Bad"\ndescription: "x"\narchetype: analysis\ncomplexity: simple\nsteps: []\n',
    );

    const result = validateRecipes(TMP_DIR);

    expect(result.invalid).toBe(1);
    cleanupTmpDir();
  });
});

describe('loadTools', () => {
  it('loads valid tool data from directory', () => {
    const tools = loadTools(join(ROOT, 'data', 'tools'));

    expect(tools.length).toBe(49);
    expect(tools[0].data).toHaveProperty('id');
    expect(tools[0].data).toHaveProperty('category');
  });
});

describe('loadRouterRules', () => {
  it('loads rules from patterns YAML', () => {
    const rules = loadRouterRules(join(ROOT, 'data', 'router', 'patterns.yaml'));

    expect(rules.length).toBeGreaterThanOrEqual(1);
    expect(rules[0]).toHaveProperty('pattern');
    expect(rules[0]).toHaveProperty('recipe');
    expect(rules[0]).toHaveProperty('priority');
  });
});

describe('writeArtifact', () => {
  it('creates file and parent directories', () => {
    setupTmpDir();
    const filePath = join(TMP_DIR, 'nested', 'deep', 'test.md');

    writeArtifact(filePath, '# Hello');

    const { readFileSync } = require('node:fs');
    expect(readFileSync(filePath, 'utf-8')).toBe('# Hello');

    cleanupTmpDir();
  });

  it('overwrites existing file', () => {
    setupTmpDir();
    const filePath = join(TMP_DIR, 'test.md');

    writeArtifact(filePath, 'First');
    writeArtifact(filePath, 'Second');

    const { readFileSync } = require('node:fs');
    expect(readFileSync(filePath, 'utf-8')).toBe('Second');

    cleanupTmpDir();
  });
});
