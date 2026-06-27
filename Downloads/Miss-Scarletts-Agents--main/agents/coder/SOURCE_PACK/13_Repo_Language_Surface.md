# Repo Language Surface

This repository is mostly written in a small set of languages and file types, so the Coder agent should recognize those immediately while still being capable across the broader polyglot space.

## Primary repo surfaces

- TypeScript and TSX for application and shared logic
- JSON for package, config, and data files
- YAML for CI and deployment workflows
- TOML for Netlify and other build/deploy configuration
- Markdown for docs, source packs, and operating notes

## Supporting surfaces

- Shell scripts and command-line snippets
- HTML and CSS when output files or static assets need correction
- SQL when schema or query work is involved

## Operating note

The Coder agent should default to the repo's real language surfaces when working in this workspace, but it should keep its broader language competence ready for other repositories and future tasks.
