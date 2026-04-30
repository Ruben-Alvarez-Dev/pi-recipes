/**
 * RouterRule Entity — maps problem patterns to recipes.
 *
 * Domain Rules:
 * - id must be unique across all rules
 * - pattern must be a valid regex or keyword string
 * - recipe must reference a valid recipe id
 * - priority must be between 1 and 100
 */

import type {
  Category,
  RecipeComplexity,
  Condition,
} from './value-objects.js';

export interface RouterRule {
  /** Unique identifier */
  readonly id: string;
  /** Regex or keyword pattern to match against user input */
  readonly pattern: string;
  /** Recipe id to invoke when matched */
  readonly recipe: string;
  /** Priority (1 = highest, 100 = lowest) */
  readonly priority: number;
  /** Human-readable description */
  readonly description?: string;
  /** Additional conditions that must be true */
  readonly conditions: readonly Condition[];
  /** Expected problem category */
  readonly category_hint?: Category;
  /** Expected recipe complexity */
  readonly complexity_hint?: RecipeComplexity;
  /** Override the recipe's default model */
  readonly model_override?: string;
  /** Searchable tags */
  readonly tags: readonly string[];
}
