import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { scanTools } from './discover.js';

export const REGISTRY_DIR = join(homedir(), '.config/ai-tool-router');
export const REGISTRY_PATH = join(REGISTRY_DIR, 'registry.json');

const COST_ORDER = { low: 0, medium: 1, high: 2 };

export function loadRegistry() {
  if (!existsSync(REGISTRY_PATH)) {
    return { tools: {}, rules: [] };
  }
  try {
    return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
  } catch {
    return { tools: {}, rules: [] };
  }
}

export function saveRegistry(registry) {
  mkdirSync(dirname(REGISTRY_PATH), { recursive: true });
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n');
}

export function scanAndMerge() {
  const discovered = scanTools();
  const registry = loadRegistry();

  for (const [id, tool] of Object.entries(discovered)) {
    const existing = registry.tools[id] || {};
    registry.tools[id] = {
      installed: tool.installed,
      name: tool.name,
      tags: tool.tags,
      costTier: tool.costTier,
      priority: existing.priority ?? null,
      plan: existing.plan ?? '',
      lastUsed: existing.lastUsed ?? null,
    };
  }

  saveRegistry(registry);
  return registry;
}

export function listTools(registry) {
  return Object.entries(registry.tools).map(([id, tool]) => ({ id, ...tool }));
}

export function setTool(registry, id, updates) {
  if (!registry.tools[id]) {
    throw new Error(`Unknown tool: ${id}. Run scan first.`);
  }
  if (updates.priority != null) {
    const p = Number(updates.priority);
    if (!Number.isFinite(p) || p < 1) {
      throw new Error('priority must be a positive number');
    }
    registry.tools[id].priority = p;
  }
  if (updates.plan != null) {
    registry.tools[id].plan = updates.plan;
  }
  if (updates.tags != null) {
    registry.tools[id].tags = updates.tags;
  }
  if (updates.costTier != null) {
    registry.tools[id].costTier = updates.costTier;
  }
  saveRegistry(registry);
}

export function suggestTool(registry, task) {
  const installed = listTools(registry).filter((t) => t.installed);
  if (installed.length === 0) {
    return { primary: null, fallback: null, reason: 'No AI tools detected.' };
  }

  const taskWords = task.toLowerCase().split(/\W+/).filter(Boolean);
  const taskTags = new Set(taskWords);

  // Match explicit rules first.
  for (const rule of registry.rules || []) {
    if (task.toLowerCase().includes(rule.task.toLowerCase())) {
      const prefer = rule.prefer?.filter((id) => registry.tools[id]?.installed).slice(0, 2) || [];
      if (prefer.length > 0) {
        return {
          primary: prefer[0],
          fallback: prefer[1] || rule.fallback || null,
          reason: `Matched rule for "${rule.task}"`,
        };
      }
    }
  }

  // Score by tag overlap, priority, then cost.
  const scored = installed.map((tool) => {
    const tagScore = tool.tags.filter((tag) => taskTags.has(tag.toLowerCase())).length;
    const priority = tool.priority ?? Number.MAX_SAFE_INTEGER;
    const cost = COST_ORDER[tool.costTier] ?? 99;
    return { ...tool, score: tagScore, priority, cost };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.cost - b.cost;
  });

  return {
    primary: scored[0].id,
    fallback: scored[1]?.id || null,
    reason: scored[0].score > 0
      ? `Tag match for "${task}"`
      : 'Best priority/cost fit',
  };
}

export function markUsed(registry, id) {
  if (registry.tools[id]) {
    registry.tools[id].lastUsed = new Date().toISOString();
    saveRegistry(registry);
  }
}
