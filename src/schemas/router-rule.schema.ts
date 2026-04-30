/**
 * Router Rule Schema — Zod validation for router rule YAML data.
 *
 * Maps to the RouterRule domain entity defined in src/domain/router-rule.ts
 * Spec: specs/router-dispatcher.spec.md
 *
 * Business Rules:
 * - Priority: 1-100
 * - Pattern must be non-empty (regex or keyword string)
 * - Recipe must reference a valid recipe ID
 */

import { z } from 'zod';
import {
  CATEGORIES,
  RECIPE_COMPLEXITIES,
  CONDITION_OPERATORS,
} from '../domain/value-objects.js';

export const conditionSchema = z.object({
  field: z.string().min(1, 'Condition field cannot be empty'),
  operator: z.enum(CONDITION_OPERATORS),
  value: z.string(),
});

export const routerRuleSchema = z.object({
  id: z
    .string()
    .min(1, 'Rule ID cannot be empty')
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'Rule ID must be kebab-case'),
  pattern: z.string().min(1, 'Pattern cannot be empty'),
  recipe: z.string().min(1, 'Recipe reference cannot be empty'),
  priority: z.number().int().min(1).max(100),
  description: z.string().optional(),
  conditions: z.array(conditionSchema).default([]),
  category_hint: z.enum(CATEGORIES).optional(),
  complexity_hint: z.enum(RECIPE_COMPLEXITIES).optional(),
  model_override: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type RouterRuleSchema = z.infer<typeof routerRuleSchema>;
