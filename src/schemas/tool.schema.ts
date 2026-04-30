/**
 * Tool Schema — Zod validation for tool YAML data.
 *
 * Maps to the Tool domain entity defined in src/domain/tool.ts
 * Spec: specs/tool-inventory.spec.md
 */

import { z } from 'zod';
import {
  CATEGORIES,
  THINKING_LEVELS,
} from '../domain/value-objects.js';

export const useCaseSchema = z.object({
  scenario: z.string().min(1, 'Scenario cannot be empty'),
  why: z.string().min(1, 'Explanation cannot be empty'),
  model_hint: z.string().optional(),
  recipe_hint: z.string().optional(),
});

export const antiPatternSchema = z.object({
  scenario: z.string().min(1, 'Scenario cannot be empty'),
  why: z.string().min(1, 'Explanation cannot be empty'),
  alternative: z.string().min(1, 'Alternative cannot be empty'),
});

export const toolSchema = z.object({
  id: z
    .string()
    .min(1, 'Tool ID cannot be empty')
    .regex(
      /^[a-z0-9][a-z0-9._-]*$/,
      'Tool ID must be kebab-case and npm-safe',
    ),
  name: z.string().min(1, 'Tool name cannot be empty'),
  npm: z.string().min(1, 'npm specifier cannot be empty'),
  category: z.enum(CATEGORIES),
  description: z.string().min(1, 'Description cannot be empty'),
  capabilities: z.array(z.string()),
  ideal_use_cases: z.array(useCaseSchema).default([]),
  anti_patterns: z.array(antiPatternSchema).default([]),
  dependencies: z.array(z.string()).default([]),
  thinking_level: z.enum(THINKING_LEVELS).default('medium'),
  notes: z.string().default(''),
  version: z.string().default('latest'),
});

export type ToolSchema = z.infer<typeof toolSchema>;
