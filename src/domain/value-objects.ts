/**
 * Value Objects — immutable domain primitives for the Pi Recipes system.
 *
 * These are NOT classes with behavior — they are branded type aliases
 * validated by Zod schemas. This keeps the domain layer thin and
 * framework-agnostic.
 */

// ─── Enums ────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'thinking',
  'memory',
  'orchestration',
  'planning',
  'documentation',
  'communication',
  'security',
  'quality',
  'infrastructure',
  'meta',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const THINKING_LEVELS = [
  'off',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
] as const;

export type ThinkingLevel = (typeof THINKING_LEVELS)[number];

export const CHAIN_CONTEXTS = ['full', 'summary', 'none'] as const;

export type ChainContext = (typeof CHAIN_CONTEXTS)[number];

export const RECIPE_ARCHETYPES = [
  'analysis',
  'design',
  'implementation',
  'testing',
  'debugging',
  'refactoring',
  'documentation',
  'planning',
  'review',
  'security',
  'optimization',
  'research',
  'deployment',
  'monitoring',
] as const;

export type RecipeArchetype = (typeof RECIPE_ARCHETYPES)[number];

export const RECIPE_COMPLEXITIES = ['simple', 'complex'] as const;

export type RecipeComplexity = (typeof RECIPE_COMPLEXITIES)[number];

export const CONDITION_OPERATORS = [
  'eq',
  'neq',
  'contains',
  'not_contains',
  'gt',
  'lt',
  'gte',
  'lte',
  'regex',
  'exists',
  'not_exists',
] as const;

export type ConditionOperator = (typeof CONDITION_OPERATORS)[number];

// ─── Constants ────────────────────────────────────────────────────────

export const KNOWN_MODELS = [
  'mimo-v2.5-pro',
  'mimo-v2.5-omni',
  'mimo-v2-pro',
  'mimo-v2-omni',
  'claude-sonnet-4-20250514',
  'claude-opus-4-20250514',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'o3',
  'o4-mini',
  'deepseek-r1',
  'deepseek-v3',
  'qwen3-coder',
] as const;

export type KnownModel = (typeof KNOWN_MODELS)[number];

export const PI_HOME = process.env.HOME
  ? `${process.env.HOME}/.pi/agent`
  : '/root/.pi/agent';

export const ARTIFACT_DIRS = {
  prompts: `${PI_HOME}/prompts`,
  skills: `${PI_HOME}/skills`,
} as const;

// ─── Types (validated by Zod, used as domain contracts) ───────────────

export interface UseCase {
  scenario: string;
  why: string;
  model_hint?: KnownModel | string;
  recipe_hint?: string;
}

export interface AntiPattern {
  scenario: string;
  why: string;
  alternative: string;
}

export interface LoopConfig {
  count: number;
  converge?: boolean;
  fresh?: boolean;
  rotate?: boolean;
}

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: string;
}
