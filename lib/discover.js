import { existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';

function expandTilde(p) {
  if (p == null) return null;
  return p.replace(/^~/, homedir());
}

export const KNOWN_TOOLS = {
  claude: {
    name: 'Claude Code',
    paths: ['~/.claude/CLAUDE.md', '~/.claude/skills'],
    tags: ['reasoning', 'long-context', 'architecture', 'debugging'],
    costTier: 'high',
  },
  codex: {
    name: 'OpenAI Codex',
    paths: ['~/.codex/AGENTS.md', '~/.codex/skills'],
    tags: ['code', 'fast', 'refactoring'],
    costTier: 'medium',
  },
  kimi: {
    name: 'Kimi',
    paths: ['~/.kimi/AGENTS.md', '~/.kimi/skills', '~/.kimi-code/skills'],
    tags: ['code', 'fast', 'large-files', 'refactoring'],
    costTier: 'medium',
  },
  gemini: {
    name: 'Gemini CLI',
    paths: ['~/.gemini/GEMINI.md'],
    tags: ['general', 'multimodal'],
    costTier: 'medium',
  },
  cursor: {
    name: 'Cursor',
    paths: ['~/.cursor/rules', '~/.cursor/mcp.json'],
    tags: ['code', 'ui', 'rules'],
    costTier: 'medium',
  },
  kilocode: {
    name: 'Kilocode',
    paths: ['~/.kilocode/rules', '~/.kilocode/skills'],
    tags: ['code', 'vscode'],
    costTier: 'medium',
  },
  opencode: {
    name: 'OpenCode',
    paths: ['~/.config/opencode/opencode.jsonc'],
    tags: ['code', 'general'],
    costTier: 'low',
  },
  windsurf: {
    name: 'Windsurf',
    paths: ['~/.windsurf/rules.md', '~/.windsurf/mcp.json'],
    tags: ['code', 'ui'],
    costTier: 'medium',
  },
  cline: {
    name: 'Cline',
    paths: ['~/.cline/rules.md', '~/.cline/skills'],
    tags: ['code', 'vscode'],
    costTier: 'low',
  },
  roo: {
    name: 'Roo Code',
    paths: ['~/.roo/rules.md', '~/.roo/skills'],
    tags: ['code', 'vscode'],
    costTier: 'low',
  },
  zed: {
    name: 'Zed',
    paths: ['~/.config/zed/settings.json'],
    tags: ['code', 'editor'],
    costTier: 'low',
  },
  continue: {
    name: 'Continue.dev',
    paths: ['~/.continue/config.yaml'],
    tags: ['code', 'editor'],
    costTier: 'low',
  },
  aider: {
    name: 'Aider',
    paths: ['~/.aider.conf.yml'],
    tags: ['code', 'git', 'pair'],
    costTier: 'low',
  },
};

export function isToolInstalled(tool) {
  for (const raw of tool.paths) {
    const p = expandTilde(raw);
    if (p && existsSync(p)) {
      try {
        statSync(p);
        return true;
      } catch {
        // ignore
      }
    }
  }
  return false;
}

export function scanTools() {
  const result = {};
  for (const [id, tool] of Object.entries(KNOWN_TOOLS)) {
    result[id] = { ...tool, installed: isToolInstalled(tool) };
  }
  return result;
}
