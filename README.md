# ai-tool-router

Pick the right AI tool for the job — and stop overpaying for tasks a cheaper
agent can handle.

## Install

```bash
npx ai-tool-router scan
```

Or install globally:

```bash
npm install -g ai-tool-router
ai-tool-router scan
```

## Commands

```bash
ai-tool-router scan                    # Detect installed AI tools
ai-tool-router list                    # Show registry with priorities, costs, and tags
ai-tool-router use "refactor a large function"  # Get a recommendation
ai-tool-router set kimi --priority=1 --plan="Daily code edits" --tags=code,fast
```

## Example

```text
$ ai-tool-router use "refactor a large function"
Task: refactor a large function
→ Primary: Kimi (Tag match for "refactor a large function")
→ Fallback: Claude Code
```

## Why

AI tools are becoming commodities. No single agent wins every task:

| Task type | Usually best | Why |
|-----------|--------------|-----|
| Deep reasoning, architecture | Claude | Long context, strong reasoning |
| Fast code edits, iterations | Kimi | Cheap, low latency |
| Editor-integrated work | Cursor / Cline | Can see the file tree and UI |
| Multi-step agentic workflows | Codex | Tool-calling built for autonomy |

Defaulting to one expensive tool for everything is wasteful. `ai-tool-router`
lets you match the tool to the task, so you spend less and move faster.

## How priorities work

The registry scores tools per task:

1. **Explicit rules** — task keywords that override everything else (e.g.,
   `refactor` → Kimi).
2. **Tag match** — the tool's tags overlap with words in the task.
3. **Priority** — your preferred default order.
4. **Cost** — when multiple tools match, cheaper ones rank higher.

You tune this with `ai-tool-router set`:

```bash
ai-tool-router set claude --priority=1 --cost=high --tags=reasoning,architecture
ai-tool-router set kimi --priority=2 --cost=low --tags=code,fast,refactor
ai-tool-router set cursor --priority=3 --cost=medium --tags=editor,ui
```

## Registry location

`~/.config/ai-tool-router/registry.json`

## Integration with omni-skills

`ai-tool-router` is intentionally separate from `omni-skills`. Omni Skills
unifies your skill store; this router tells you which agent to call for a given
task. You can use it standalone, or expose the registry to an omni-skills MCP
server so every agent sees the same tool preferences.

## License

MIT
