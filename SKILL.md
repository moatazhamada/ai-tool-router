---
name: ai-tool-router
description: Pick the right AI tool for the task. Scan installed agents, remember their plans and costs, and suggest which to use next or in what order.
license: MIT
---

# AI Tool Router

You have Claude, Codex, Kimi, Gemini, Cursor, and more installed. Each one is good at different things and costs a different amount. This tool removes the guesswork.

## What it does

- **Scan** your system for installed AI coding agents.
- **Remember** each tool's strengths, cost tier, and your personal priority.
- **Suggest** the best tool for a task, plus a fallback.

## Usage

```bash
# Detect installed tools
ai-tool-router scan

# See your registry
ai-tool-router list

# Get a recommendation
ai-tool-router use "refactor a large function"

# Tune priorities
ai-tool-router set kimi --priority=1 --plan="Daily code edits" --tags=code,fast
```

## Why this matters

No single AI tool wins every task. Claude is great at reasoning. Kimi is fast at code. Cursor is tightly integrated into an editor. Paying premium prices for average work is wasteful. This router lets you match the tool to the task.

## Integration

Use it standalone, or keep the registry in sync with `omni-skills` so every AI agent you use knows the same tool preferences.
