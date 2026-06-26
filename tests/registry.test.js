import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  loadRegistry,
  saveRegistry,
  listTools,
  setTool,
  suggestTool,
  markUsed,
} from '../lib/registry.js';

const TEST_REGISTRY = {
  tools: {
    claude: {
      installed: true,
      name: 'Claude Code',
      tags: ['reasoning'],
      costTier: 'high',
      priority: 2,
      plan: '',
      lastUsed: null,
    },
    kimi: {
      installed: true,
      name: 'Kimi',
      tags: ['code', 'fast'],
      costTier: 'medium',
      priority: 1,
      plan: '',
      lastUsed: null,
    },
  },
  rules: [],
};

describe('registry.js', () => {
  beforeEach(() => {
    saveRegistry(TEST_REGISTRY);
  });

  it('loads a saved registry', () => {
    const r = loadRegistry();
    assert.strictEqual(r.tools.kimi.priority, 1);
  });

  it('lists tools', () => {
    const tools = listTools(loadRegistry());
    assert.strictEqual(tools.length, 2);
  });

  it('suggests by priority when no task match', () => {
    const r = loadRegistry();
    const s = suggestTool(r, 'do something generic');
    assert.strictEqual(s.primary, 'kimi');
  });

  it('suggests by tag match', () => {
    const r = loadRegistry();
    const s = suggestTool(r, 'deep reasoning task');
    assert.strictEqual(s.primary, 'claude');
  });

  it('updates a tool', () => {
    const r = loadRegistry();
    setTool(r, 'kimi', { priority: 5, plan: 'Daily driver' });
    const updated = loadRegistry();
    assert.strictEqual(updated.tools.kimi.priority, 5);
    assert.strictEqual(updated.tools.kimi.plan, 'Daily driver');
  });

  it('throws when setting unknown tool', () => {
    assert.throws(() => setTool(loadRegistry(), 'unknown', { priority: 1 }), /Unknown tool/);
  });

  it('marks tool as used', () => {
    const r = loadRegistry();
    markUsed(r, 'kimi');
    const updated = loadRegistry();
    assert.ok(updated.tools.kimi.lastUsed);
  });
});
