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
const PI_HOME = process.env.HOME ? `${process.env.HOME}/.pi/agent` : '/root/.pi/agent';

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

function cmdGenerate(): void {
  console.log('Generating chain templates...');
  const recipes = loadRecipes(join(DATA_DIR, 'recipes'));
  console.log(`  Loaded ${recipes.length} recipes`);

  const promptsDir = join(ARTIFACTS_DIR, 'prompts');
  for (const { data } of recipes) {
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
}

function cmdDeploy(): void {
  console.log('Deploying artifacts to Pi...');
  const srcPrompts = join(ARTIFACTS_DIR, 'prompts');
  const dstPrompts = join(PI_HOME, 'prompts');
  const srcSkills = join(ARTIFACTS_DIR, 'skills');
  const dstSkills = join(PI_HOME, 'skills');

  // Deploy prompt templates
  fs.mkdirSync(dstPrompts, { recursive: true });
  const promptFiles = fs.readdirSync(srcPrompts).filter(f => f.endsWith('.md'));
  for (const file of promptFiles) {
    const src = join(srcPrompts, file);
    const dst = join(dstPrompts, file);
    fs.copyFileSync(src, dst);
    console.log(`  [prompt]  ${file}`);
  }

  // Deploy skills
  const skillDirs = fs.readdirSync(srcSkills);
  for (const skillDir of skillDirs) {
    const srcSkillPath = join(srcSkills, skillDir);
    const dstSkillPath = join(dstSkills, skillDir);
    if (fs.statSync(srcSkillPath).isDirectory()) {
      fs.mkdirSync(dstSkillPath, { recursive: true });
      const files = fs.readdirSync(srcSkillPath);
      for (const file of files) {
        const src = join(srcSkillPath, file);
        const dst = join(dstSkillPath, file);
        fs.copyFileSync(src, dst);
      }
      console.log(`  [skill]   ${skillDir}/`);
    }
  }

  console.log(`\nDeployed ${promptFiles.length} prompts + ${skillDirs.length} skills to ${PI_HOME}`);
}

function cmdStatus(): void {
  console.log('Pi Recipes Status');
  console.log('');

  // Check if artifacts exist
  const promptsDir = join(ARTIFACTS_DIR, 'prompts');
  const skillsDir = join(ARTIFACTS_DIR, 'skills');
  const promptsExist = fs.existsSync(promptsDir);
  const skillsExist = fs.existsSync(skillsDir);

  console.log('Artifacts:');
  if (promptsExist) {
    const prompts = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
    console.log(`  Prompts:  ${prompts.length} generated`);
    for (const p of prompts) console.log(`    - ${p}`);
  } else {
    console.log('  Prompts:  not generated (run `pi-recipes generate`)');
  }

  if (skillsExist) {
    const skills = fs.readdirSync(skillsDir);
    console.log(`  Skills:   ${skills.length} generated`);
    for (const s of skills) console.log(`    - ${s}/`);
  } else {
    console.log('  Skills:   not generated (run `pi-recipes generate`)');
  }

  // Check if deployed
  console.log('');
  console.log(`Deploy target: ${PI_HOME}`);
  const deployedPrompts = join(PI_HOME, 'prompts');
  if (fs.existsSync(deployedPrompts)) {
    const deployed = fs.readdirSync(deployedPrompts).filter(f => f.endsWith('.md'));
    console.log(`  Prompts:  ${deployed.length} deployed`);
  } else {
    console.log('  Prompts:  not deployed');
  }

  const recipeDispatcher = join(PI_HOME, 'skills', 'recipe-dispatcher', 'SKILL.md');
  if (fs.existsSync(recipeDispatcher)) {
    console.log('  Router:   deployed');
  } else {
    console.log('  Router:   not deployed');
  }
}

async function main() {
  switch (command) {
    case 'validate': {
      const ok = cmdValidate();
      process.exit(ok ? 0 : 1);
      break;
    }
    case 'generate':
      cmdGenerate();
      process.exit(0);
      break;
    case 'deploy':
      cmdDeploy();
      process.exit(0);
      break;
    case 'pipeline': {
      const ok = cmdValidate();
      if (!ok) {
        console.error('Validation failed — aborting pipeline');
        process.exit(1);
      }
      cmdGenerate();
      cmdDeploy();
      console.log('\nPipeline complete: validate -> generate -> deploy');
      process.exit(0);
      break;
    }
    case 'status':
      cmdStatus();
      process.exit(0);
      break;
  }
}

main();
