/**
 * Domain index — re-exports all domain types.
 *
 * Application and infrastructure layers import from here,
 * never from individual domain files.
 */

export type { Tool } from './tool.js';
export type { Recipe, RecipeStep } from './recipe.js';
export type { RouterRule } from './router-rule.js';

export {
  CATEGORIES,
  THINKING_LEVELS,
  CHAIN_CONTEXTS,
  RECIPE_ARCHETYPES,
  RECIPE_COMPLEXITIES,
  CONDITION_OPERATORS,
  KNOWN_MODELS,
  PI_HOME,
  ARTIFACT_DIRS,
} from './value-objects.js';

export type {
  Category,
  ThinkingLevel,
  ChainContext,
  RecipeArchetype,
  RecipeComplexity,
  ConditionOperator,
  KnownModel,
  UseCase,
  AntiPattern,
  LoopConfig,
  Condition,
} from './value-objects.js';
