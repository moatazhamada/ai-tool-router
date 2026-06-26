#!/usr/bin/env node

import { loadRegistry, saveRegistry, scanAndMerge, listTools, setTool, suggestTool, markUsed } from './lib/registry.js';

function showHelp() {
  console.log(`Usage: ai-tool-router <command> [args]

Commands:
  scan                      Detect installed AI tools and update registry.
  list                      Show all known tools and their priorities.
  use <task>                Suggest the best tool for a task.
  set <tool> [options]      Update a tool's priority, plan, tags, or cost tier.

Set options:
  --priority=N              Lower number = higher priority.
  --plan="text"             When and why to use this tool.
  --tags=a,b,c              Comma-separated capability tags.
  --cost-tier=low|medium|high

Examples:
  ai-tool-router scan
  ai-tool-router use "refactor a large function"
  ai-tool-router set kimi --priority=1 --plan="Daily code edits" --tags=code,fast
`);
}

function parseSetArgs(argv) {
  const updates = {};
  const priorityArg = argv.find((a) => a.startsWith('--priority='));
  if (priorityArg) updates.priority = priorityArg.split('=')[1];

  const planArg = argv.find((a) => a.startsWith('--plan='));
  if (planArg) updates.plan = planArg.split('=')[1];

  const tagsArg = argv.find((a) => a.startsWith('--tags='));
  if (tagsArg) updates.tags = tagsArg.split('=')[1].split(',').map((t) => t.trim()).filter(Boolean);

  const costArg = argv.find((a) => a.startsWith('--cost-tier='));
  if (costArg) updates.costTier = costArg.split('=')[1];

  return updates;
}

function formatTool(tool) {
  const flags = [];
  if (tool.installed) flags.push('installed');
  else flags.push('not installed');
  if (tool.priority) flags.push(`priority:${tool.priority}`);
  if (tool.costTier) flags.push(`cost:${tool.costTier}`);
  const plan = tool.plan ? ` — ${tool.plan}` : '';
  return `  ${tool.id}: ${tool.name} [${flags.join(', ')}]${plan}`;
}

async function main() {
  const cmd = process.argv[2];
  const rest = process.argv.slice(3);

  switch (cmd) {
    case 'scan': {
      const registry = scanAndMerge();
      const installed = listTools(registry).filter((t) => t.installed);
      console.log(`Scanned ${Object.keys(registry.tools).length} tools.`);
      console.log(`${installed.length} installed:`);
      for (const tool of installed) {
        console.log(`  ${tool.id}: ${tool.name}`);
      }
      break;
    }

    case 'list': {
      const registry = loadRegistry();
      const tools = listTools(registry).sort((a, b) => {
        const pa = a.priority ?? Number.MAX_SAFE_INTEGER;
        const pb = b.priority ?? Number.MAX_SAFE_INTEGER;
        if (pa !== pb) return pa - pb;
        return a.name.localeCompare(b.name);
      });
      console.log('Known tools:');
      for (const tool of tools) {
        console.log(formatTool(tool));
      }
      break;
    }

    case 'use': {
      const task = rest.filter((a) => !a.startsWith('--')).join(' ');
      if (!task) {
        console.error('Usage: ai-tool-router use <task>');
        process.exit(1);
      }
      const registry = loadRegistry();
      const suggestion = suggestTool(registry, task);
      if (!suggestion.primary) {
        console.log(suggestion.reason);
        break;
      }
      const primary = registry.tools[suggestion.primary];
      const fallback = suggestion.fallback ? registry.tools[suggestion.fallback] : null;
      console.log(`Task: ${task}`);
      console.log(`→ Primary: ${primary.name} (${suggestion.reason})`);
      if (fallback) {
        console.log(`→ Fallback: ${fallback.name}`);
      }
      markUsed(registry, suggestion.primary);
      break;
    }

    case 'set': {
      const id = rest[0];
      if (!id) {
        console.error('Usage: ai-tool-router set <tool> [options]');
        process.exit(1);
      }
      const updates = parseSetArgs(rest);
      if (Object.keys(updates).length === 0) {
        console.error('No options provided. Use --priority, --plan, --tags, or --cost-tier.');
        process.exit(1);
      }
      const registry = loadRegistry();
      setTool(registry, id, updates);
      console.log(`Updated ${id}.`);
      break;
    }

    case 'help':
    case '-h':
    case '--help':
    default:
      showHelp();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
