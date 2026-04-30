/**
 * Recipe Entity — a composable workflow that chains Pi tools.
 *
 * Domain Rules:
 * - id must be unique across all recipes
 * - steps[].tool must reference a valid tool id
 * - Simple recipes: exactly 1 step
 * - Complex recipes: 2+ steps
 * - Step ids must be unique within a recipe
 */

import type {
  ThinkingLevel,
  ChainContext,
  RecipeArchetype,
  RecipeComplexity,
  LoopConfig,
} from './value-objects.js';

export interface RecipeStep {
  /** Unique within recipe (kebab-case) */
  readonly id: string;
  /** Human-readable step name */
  readonly name: string;
  /** Tool id this step uses */
  readonly tool: string;
  /** Prompt/instructions for this step */
  readonly prompt: string;
  /** Step-specific model override */
  readonly model?: string;
  /** Step-specific thinking level */
  readonly thinking?: ThinkingLevel;
  /** Additional skill to inject */
  readonly skill?: string;
  /** How much context from previous steps */
  readonly chain_context?: ChainContext;
  /** Number of parallel instances */
  readonly parallel?: number;
  /** Conditional expression (skip if false) */
  readonly condition?: string;
  /** Loop configuration for iterative steps */
  readonly loop?: LoopConfig;
}

export interface Recipe {
  /** Unique identifier (kebab-case) */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** One-paragraph description */
  readonly description: string;
  /** Task archetype this recipe solves */
  readonly archetype: RecipeArchetype;
  /** Simple (1 tool) or complex (2+ tools) */
  readonly complexity: RecipeComplexity;
  /** Ordered steps in the workflow */
  readonly steps: readonly RecipeStep[];
  /** Override model for entire recipe */
  readonly model?: string;
  /** Override thinking level */
  readonly thinking?: ThinkingLevel;
  /** Collapse context after execution */
  readonly boomerang?: boolean;
  /** Run in separate git worktree */
  readonly worktree?: boolean;
  /** Searchable tags */
  readonly tags: readonly string[];
  /** Required tool ids or conditions */
  readonly prerequisites: readonly string[];
}
