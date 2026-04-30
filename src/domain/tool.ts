/**
 * Tool Entity — represents an analyzed Pi extension in the inventory.
 *
 * Domain Rules:
 * - id must be unique across all tools
 * - category must be a valid Category
 * - anti_patterns[].alternative must reference a valid tool id
 * - dependencies[] must reference valid tool ids
 */

import type {
  Category,
  ThinkingLevel,
  UseCase,
  AntiPattern,
} from './value-objects.js';

export interface Tool {
  /** Unique identifier (kebab-case, npm-safe) */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** Full npm package specifier */
  readonly npm: string;
  /** Primary classification */
  readonly category: Category;
  /** One-paragraph description */
  readonly description: string;
  /** Distinct capabilities this extension provides */
  readonly capabilities: readonly string[];
  /** Scenarios where this tool excels */
  readonly ideal_use_cases: readonly UseCase[];
  /** Scenarios where this tool should NOT be used */
  readonly anti_patterns: readonly AntiPattern[];
  /** Other extensions this one depends on */
  readonly dependencies: readonly string[];
  /** Recommended thinking level */
  readonly thinking_level: ThinkingLevel;
  /** Additional context or caveats */
  readonly notes: string;
  /** Pinned version (default: "latest") */
  readonly version: string;
}
