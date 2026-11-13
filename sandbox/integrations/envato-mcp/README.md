# Envato MCP

Lab notes. Status: **configured, NOT verified** (2026-11-13).

## What this tests

Whether the official Envato MCP server (`https://mcp.envato.com/mcp`) gives
our agents asset discovery and search for stock footage and promo assets,
with no new services or orchestration layers.

## Setup

Config is one entry in the repo-root `.mcp.json` (HTTP transport, no
credentials stored anywhere in the repo):

```json
{ "mcpServers": { "envato": { "type": "http", "url": "https://mcp.envato.com/mcp" } } }
```

Auth: **unconfirmed.** Remote HTTP MCP servers normally use OAuth, done
once per user, interactively:

1. Start Claude Code on your own machine in this repo and approve the
   project-scoped `envato` server when prompted.
2. Run `/mcp`, select `envato`, and complete the browser sign-in with the
   Envato account that holds the subscription.
3. Tokens are stored by Claude Code on that machine. Nothing goes in git.

If Envato turns out to require an API key or token instead, pass it by env
var expansion (`"headers": {"Authorization": "Bearer ${ENVATO_TOKEN}"}`),
never as a literal in `.mcp.json`. Confirm against Envato's own docs first.

## Why it isn't verified

This cloud session can't finish the sign-in (interactive browser OAuth),
the session proxy returns 403 for most MCP hosts, and a direct probe of the
endpoint was blocked by the auto-mode classifier. No tool list was
retrieved, so no tool names are documented here. Do not assume any.

## Verification checklist (run locally after sign-in)

1. `/mcp` shows `envato` connected and lists its tools. Record the real
   tool names below.
2. Search "multifamily apartment maintenance" / "property manager" /
   "apartment exterior drone" (VendorCall commercial footage).
3. Search "AI workshop" / "small business owner laptop" / "automation
   dashboard" (Get AI-Fluent promo assets).
4. Confirm results return preview URLs and license info, and whether
   download or license actions exist (see Cautions).

Tools found: _(fill in)_
Search results: _(fill in)_

## How Riker and existing agents should use it

Riker isn't defined anywhere in this repo, so these are generic rules.
Adjust once Riker's setup is known.

- It's a plain MCP tool, available to any agent that already has MCP
  access. No wrapper, no new agent, no routing layer.
- Use for **search and preview** only: find candidate assets, return titles,
  preview links, and licence notes to a human.
- Lane first: VendorCall assets show what we build (property teams,
  vendors, completed work). Get AI-Fluent assets show practical AI in real
  work. Never publish property names or locations in captions.
- **Do not download or license** assets without an explicit yes from JT.
  Licensing may spend subscription credits and ties a licence to a project.
- Hand back a short list (3 to 5) with why each fits, not raw result dumps.

## Cautions

- Verify licence terms (commercial use, ads, client work) before anything
  ships. Unverified.
- Stock footage showing identifiable real properties or people may conflict
  with the never-publish rule. Check each clip.
