# f2e-skills - Agent Guide

Alibaba front-end coding standards as Claude Code skills.

## Core principles

- Code produced by Claude MUST comply with mandatory (强制) rules by default.
- Recommended (推荐) rules should be followed unless there's a clear reason not to.
- When queried, provide the original f2e-spec rule number for traceability.
- All skills share common assumptions: 2-space indentation, UTF-8, single quotes (JS), double quotes (JSX).

## Repo structure

```
.
└── skills/
    ├── f2e-markup/          # HTML + CSS
    ├── f2e-javascript/      # JavaScript + TypeScript
    ├── f2e-react/           # React (components, hooks, JSX)
    ├── f2e-node/            # Node.js (server-side)
    └── f2e-engineering/     # Git, API, docs, changelog
```

## Scope by skill

- **f2e-markup**: HTML5 structure, semantics, attributes; CSS formatting, values, selectors; Sass/Less conventions.
- **f2e-javascript**: ES6+ coding style, language features, naming; TypeScript-specific type rules. This is the base for f2e-react and f2e-node.
- **f2e-react**: JSX formatting, component structure, props, state, refs, hooks, accessibility.
- **f2e-node**: Server-side coding style, security (mandatory), async patterns, best practices.
- **f2e-engineering**: Conventional commits, HTTP JSON API design, Chinese documentation typography, changelog format.

## Updating skills

1. Read the existing `SKILL.md` first.
2. Keep skills as decision guides with distilled rules, not full spec copies.
3. Rule numbers must align with the original f2e-spec for traceability.
4. Add new rules under the appropriate mandatory/recommended section.
5. Maintain the S-P-O (Scope-Process-Output) structure.
