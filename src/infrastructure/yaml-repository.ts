/**
 * YAML Repository — reads and validates YAML data files.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import yaml from 'js-yaml';
import { toolSchema, type ToolSchema } from '../schemas/tool.schema.js';
import { recipeSchema, type RecipeSchema } from '../schemas/recipe.schema.js';
import { routerRuleSchema, type RouterRuleSchema } from '../schemas/router-rule.schema.js';

export interface ValidationResult {
  valid: number;
  invalid: number;
  errors: Array<{ file: string; issues: string[] }>;
}

export function loadTools(dir: string): Array<{ file: string; data: ToolSchema }> {
  const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  const results: Array<{ file: string; data: ToolSchema }> = [];

  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const parsed = yaml.load(raw);
    const result = toolSchema.safeParse(parsed);
    if (result.success) {
      results.push({ file, data: result.data });
    }
  }

  return results;
}

export function loadRecipes(dir: string): Array<{ file: string; data: RecipeSchema }> {
  const results: Array<{ file: string; data: RecipeSchema }> = [];
  const dirs = [join(dir, 'simple'), join(dir, 'complex')];

  for (const subdir of dirs) {
    if (!readdirSync(subdir)) continue;
    const files = readdirSync(subdir).filter((f) => f.endsWith('.yaml'));

    for (const file of files) {
      const raw = readFileSync(join(subdir, file), 'utf-8');
      const parsed = yaml.load(raw);
      const result = recipeSchema.safeParse(parsed);
      if (result.success) {
        results.push({ file: `${subdir.split('/').pop()}/${file}`, data: result.data });
      }
    }
  }

  return results;
}

export function loadRouterRules(file: string): RouterRuleSchema[] {
  const raw = readFileSync(file, 'utf-8');
  const parsed = yaml.load(raw) as { rules: unknown[] };
  const results: RouterRuleSchema[] = [];

  for (const rule of parsed.rules) {
    const result = routerRuleSchema.safeParse(rule);
    if (result.success) {
      results.push(result.data);
    }
  }

  return results;
}

export function validateTools(dir: string): ValidationResult {
  const files = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  let valid = 0;
  let invalid = 0;
  const errors: ValidationResult['errors'] = [];

  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const parsed = yaml.load(raw);
    const result = toolSchema.safeParse(parsed);
    if (result.success) {
      valid++;
    } else {
      invalid++;
      errors.push({
        file,
        issues: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
    }
  }

  return { valid, invalid, errors };
}

export function validateRecipes(dir: string): ValidationResult {
  const results = validateTools(dir); // Reuse same logic for recipes dir structure
  // Actually, recipes have subdirs — handle differently
  let valid = 0;
  let invalid = 0;
  const errors: ValidationResult['errors'] = [];
  const dirs = [join(dir, 'simple'), join(dir, 'complex')];

  for (const subdir of dirs) {
    try {
      const files = readdirSync(subdir).filter((f) => f.endsWith('.yaml'));
      for (const file of files) {
        const raw = readFileSync(join(subdir, file), 'utf-8');
        const parsed = yaml.load(raw);
        const result = recipeSchema.safeParse(parsed);
        if (result.success) {
          valid++;
        } else {
          invalid++;
          errors.push({
            file: `${subdir.split('/').pop()}/${file}`,
            issues: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
          });
        }
      }
    } catch {
      // Subdir may not exist
    }
  }

  return { valid, invalid, errors };
}

export function writeArtifact(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}
