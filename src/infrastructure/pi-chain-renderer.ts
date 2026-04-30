/**
 * Chain Template Renderer — converts Recipe YAML to Pi prompt templates.
 *
 * Spec: specs/recipe-system.spec.md (Rendering Contract)
 */

import type { Recipe, RecipeStep } from '../domain/recipe.js';

function renderModel(recipe: Recipe, step: RecipeStep): string {
  return step.model ?? recipe.model ?? '';
}

function renderThinking(recipe: Recipe, step: RecipeStep): string | undefined {
  return step.thinking ?? recipe.thinking;
}

function renderChainContext(step: RecipeStep, index: number): string {
  if (step.chain_context) {
    return step.chain_context;
  }
  // Default: first step gets full context, subsequent steps get summary
  return index === 0 ? 'full' : 'summary';
}

function renderLoop(step: RecipeStep): string {
  if (!step.loop) return '';
  const parts = [`count: ${step.loop.count}`];
  if (step.loop.converge) parts.push('converge: true');
  if (step.loop.fresh) parts.push('fresh: true');
  if (step.loop.rotate) parts.push('rotate: true');
  return parts.join(', ');
}

export function renderChainTemplate(recipe: Recipe): string {
  const model = recipe.model || '';
  const thinking = recipe.thinking;
  const chain = recipe.steps.map((s) => s.id).join(' -> ');
  const chainContext = recipe.steps[0]?.chain_context || 'full';
  const boomerang = recipe.boomerang ? 'true' : 'false';
  const worktree = recipe.worktree ? 'true' : 'false';

  // Build frontmatter
  const frontmatter: string[] = [
    '---',
    `description: ${recipe.description}`,
  ];

  if (model) frontmatter.push(`model: ${model}`);
  if (thinking) frontmatter.push(`thinking: ${thinking}`);
  frontmatter.push(`chain: ${chain}`);
  frontmatter.push(`chainContext: ${chainContext}`);
  frontmatter.push(`boomerang: ${boomerang}`);
  frontmatter.push(`worktree: ${worktree}`);
  frontmatter.push('---');

  // Build body
  const body: string[] = [];
  for (let i = 0; i < recipe.steps.length; i++) {
    const step = recipe.steps[i];
    const stepModel = renderModel(recipe, step);
    const stepThinking = renderThinking(recipe, step);
    const stepContext = renderChainContext(step, i);
    const stepLoop = renderLoop(step);

    body.push('');
    body.push(`## Step: ${step.name}`);
    body.push(`Tool: ${step.tool}`);
    if (stepModel && stepModel !== model) {
      body.push(`Model: ${stepModel}`);
    }
    if (stepThinking && stepThinking !== thinking) {
      body.push(`Thinking: ${stepThinking}`);
    }
    body.push(`Context: ${stepContext}`);
    if (step.skill) body.push(`Skill: ${step.skill}`);
    if (step.parallel && step.parallel > 1) body.push(`Parallel: ${step.parallel}`);
    if (step.condition) body.push(`Condition: ${step.condition}`);
    if (stepLoop) body.push(`Loop: ${stepLoop}`);
    body.push('');
    body.push(step.prompt.trim());
  }

  return [...frontmatter, ...body].join('\n');
}

export function renderRecipeFilename(recipe: Recipe): string {
  return `${recipe.id}.md`;
}
