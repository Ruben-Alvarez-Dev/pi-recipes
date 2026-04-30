/**
 * Pi Recipes — CLI entry point.
 *
 * Commands: validate | generate | deploy | pipeline | status
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { validateTools, validateRecipes, loadRecipes, loadRouterRules, writeArtifact } from './infrastructure/yaml-repository.js';
import { renderChainTemplate, renderRecipeFilename } from './infrastructure/pi-chain-renderer.js';
import { renderRouterSkill } from './infrastructure/pi-skill-renderer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const ARTIFACTS_DIR = join(__dirname, '..', 'artifacts');

const commands = ['validate', 'generate', 'deploy', 'pipeline', 'status'] as const;

const command = process.argv[2];

if (!command || !commands.includes(command as typeof commands[number])) {
  console.error(`Usage: pi-recipes <${commands.join(' | ')}>`);
  process.exit(1);
}

function cmdValidate(): boolean {
  console.log('Validating tool inventory...');
  const toolResults = validateTools(join(DATA_DIR, 'tools'));
  console.log(`  Tools: ${toolResults.valid} valid, ${toolResults.invalid} invalid`);
  for (const err of toolResults.errors) {
    console.error(`  FAIL ${err.file}: ${err.issues.join(', ')}`);
  }

  console.log('Validating recipes...');
  const recipeResults = validateRecipes(join(DATA_DIR, 'recipes'));
  console.log(`  Recipes: ${recipeResults.valid} valid, ${recipeResults.invalid} invalid`);
  for (const err of recipeResults.errors) {
    console.error(`  FAIL ${err.file}: ${err.issues.join(', ')}`);
  }

  const totalErrors = toolResults.invalid + recipeResults.invalid;
  console.log(`\nTotal: ${toolResults.valid + recipeResults.valid} valid, ${totalErrors} invalid`);
  return totalErrors === 0;
}

function cmdGenerate(): boolean {
  console.log('Generating chain templates...');
  const recipes = loadRecipes(join(DATA_DIR, 'recipes'));
  console.log(`  Loaded ${recipes.length} recipes`);

  const promptsDir = join(ARTIFACTS_DIR, 'prompts');
  for (const { file, data } of recipes) {
    const template = renderChainTemplate(data);
    const filename = renderRecipeFilename(data);
    writeArtifact(join(promptsDir, filename), template);
    console.log(`  Generated ${filename}`);
  }

  console.log('Generating router skill...');
  const rules = loadRouterRules(join(DATA_DIR, 'router', 'patterns.yaml'));
  const categoriesRaw = yaml.load(fs.readFileSync(join(DATA_DIR, 'router', 'categories.yaml'), 'utf-8')) as any;

  const skill = renderRouterSkill({
    rules: rules as any,
    categories: categoriesRaw.categories,
    fallback_recipe: categoriesRaw.fallback_recipe,
    fallback_reason: categoriesRaw.fallback_reason,
  });
  const skillsDir = join(ARTIFACTS_DIR, 'skills', 'recipe-dispatcher');
  writeArtifact(join(skillsDir, 'SKILL.md'), skill);
  console.log('  Generated recipe-dispatcher/SKILL.md');

  console.log(`\nDone: ${recipes.length} templates + 1 skill`);
  return true;
}

async function main() {
  switch (command) {
    case 'validate': {
      const ok = cmdValidate();
      process.exit(ok ? 0 : 1);
      break;
    }
    case 'generate': {
      const ok = cmdGenerate();
      process.exit(ok ? 0 : 1);
      break;
    }
    case 'deploy':
      console.log('Deploy: copies artifacts to ~/.pi/agent/ (requires implementation)');
      process.exit(0);
      break;
    case 'pipeline': {
      const ok = cmdValidate();
      if (!ok) {
        console.error('Validation failed — aborting pipeline');
        process.exit(1);
      }
      await cmdGenerate();
      console.log('Pipeline complete: validate -> generate');
      process.exit(0);
      break;
    }
    case 'status':
      console.log('Status: check deployed artifacts vs generated (requires implementation)');
      process.exit(0);
      break;
  }
}

main();
