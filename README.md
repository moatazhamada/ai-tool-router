# ai-tool-router

Pick the right AI tool for the job.

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
ai-tool-router list                    # Show registry with priorities
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

AI tools are becoming commodities. Claude is great at reasoning. Kimi is fast at code. Cursor is editor-integrated. Instead of defaulting to one expensive tool for everything, route tasks to the cheapest capable tool.

## Registry location

`~/.config/ai-tool-router/registry.json`

## License

MIT
