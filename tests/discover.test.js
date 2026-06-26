import { describe, it } from 'node:test';
import assert from 'node:assert';
import { KNOWN_TOOLS, isToolInstalled, scanTools } from '../lib/discover.js';

describe('discover.js', () => {
  it('has known tools', () => {
    assert.ok(Object.keys(KNOWN_TOOLS).length > 0);
    assert.ok(KNOWN_TOOLS.claude);
  });

  it('isToolInstalled returns false for a tool with no paths', () => {
    assert.strictEqual(isToolInstalled({ paths: [] }), false);
  });

  it('scanTools returns installed status for each tool', () => {
    const tools = scanTools();
    assert.ok(tools.claude);
    assert.strictEqual(typeof tools.claude.installed, 'boolean');
  });
});
