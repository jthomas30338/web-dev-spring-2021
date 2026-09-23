# CLAUDE.md

## What this repo is

A sandbox for exploring Claude Code's capabilities — integrations,
connectors, APIs, multi-agent workflows, and automation — not a
production application. There's no build, no deploy target, and no
package.json until an experiment actually needs one.

Originally this repo held the Vets In Tech (April 2021 cohort) web dev
course material. That's preserved under `archive/` for reference (JT is
using it as source material for an article on how AI has changed
learning to code) and should be left alone — no reorganizing it further
without being asked.

## Conventions

- New experiments go under `sandbox/<area>/<name>/`, matching the
  existing areas (`integrations/`, `workflows/`, `automations/`,
  `apis/`). Add a new area folder only if something genuinely doesn't
  fit the existing ones.
- Each experiment folder gets a short README: what it tests, how to run
  it, what was learned. Treat these as lab notes, not polished docs.
- Since there's no single app, expect each experiment to bring its own
  minimal tooling (its own `package.json`, requirements, etc.) rather
  than sharing a repo-wide toolchain.
- Keep experiments runnable/reproducible where possible — future
  sessions (and JT) should be able to open a folder and understand what
  it does without re-deriving context.
