/**
 * Recipe Schema — Zod validation for recipe YAML data.
 *
 * Maps to the Recipe domain entity defined in src/domain/recipe.ts
 * Spec: specs/recipe-system.spec.md
 *
 * Business Rules:
 * - Simple recipes: exactly 1 step
 * - Complex recipes: 2+ steps
 * - Step IDs must be unique within a recipe
 * - Loop count: 1-999
 */

import { z } from 'zod';
import {
  THINKING_LEVELS,
  CHAIN_CONTEXTS,
  RECIPE_ARCHETYPES,
  RECIPE_COMPLEXITIES,
} from '../domain/value-objects.js';

export const loopConfigSchema = z
  .object({
    count: z.number().int().min(1).max(999),
    converge: z.boolean().optional().default(false),
    fresh: z.boolean().optional().default(false),
    rotate: z.boolean().optional().default(false),
  })
  .optional();

export const recipeStepSchema = z.object({
  id: z
    .string()
    .min(1, 'Step ID cannot be empty')
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'Step ID must be kebab-case'),
  name: z.string().min(1, 'Step name cannot be empty'),
  tool: z.string().min(1, 'Tool reference cannot be empty'),
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  model: z.string().optional(),
  thinking: z.enum(THINKING_LEVELS).optional(),
  skill: z.string().optional(),
  chain_context: z.enum(CHAIN_CONTEXTS).optional(),
  parallel: z.number().int().positive().optional(),
  condition: z.string().optional(),
  loop: loopConfigSchema,
});

export const recipeSchema = z
  .object({
    id: z
      .string()
      .min(1, 'Recipe ID cannot be empty')
      .regex(
        /^[a-z0-9][a-z0-9-]*$/,
        'Recipe ID must be kebab-case',
      ),
    name: z.string().min(1, 'Recipe name cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    archetype: z.enum(RECIPE_ARCHETYPES),
    complexity: z.enum(RECIPE_COMPLEXITIES),
    steps: z.array(recipeStepSchema).min(1, 'Recipe must have at least one step'),
    model: z.string().optional(),
    thinking: z.enum(THINKING_LEVELS).optional(),
    boomerang: z.boolean().default(false),
    worktree: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.complexity === 'simple') return data.steps.length === 1;
      return true;
    },
    {
      message: 'Simple recipes must have exactly 1 step',
      path: ['complexity'],
    },
  )
  .refine(
    (data) => {
      if (data.complexity === 'complex') return data.steps.length >= 2;
      return true;
    },
    {
      message: 'Complex recipes must have 2 or more steps',
      path: ['complexity'],
    },
  )
  .refine(
    (data) => {
      const ids = data.steps.map((s) => s.id);
      return new Set(ids).size === ids.length;
    },
    {
      message: 'Step IDs must be unique within a recipe',
      path: ['steps'],
    },
  );

export type RecipeSchema = z.infer<typeof recipeSchema>;
export type RecipeStepSchema = z.infer<typeof recipeStepSchema>;
