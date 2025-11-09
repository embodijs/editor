# @embodi/cli

Official CLI tool for [EmbodiCMS](https://embodi.site) - automatically generates CMS configuration from your Astro content collections.

## Quick Start

Run directly with npx - no installation needed:

```bash
npx @embodi/cli init
```

## Commands

### `init`

Creates the CMS configuration file from your Astro content collections:

```bash
npx @embodi/cli init
```

This parses your `src/content/config.ts` and generates `.embodi/cms/config.json`.

**After running init:**

1. Commit the generated `.embodi/cms/config.json` file
2. Push to your main branch
3. Connect your repository in [EmbodiCMS](https://embodi.site)

### `update`

Updates the CMS configuration after you've modified your Astro content collections:

```bash
npx @embodi/cli update
```

Run this whenever you add, remove, or modify content collections in your Astro project.

### `--help`

Show all available commands and options:

```bash
npx @embodi/cli --help
```

## Requirements

- Astro project with content collections
- Node.js 18+ or Bun

## How It Works

The CLI reads your existing Astro content collection schemas (Zod definitions) and generates a configuration file that EmbodiCMS uses to create editing interfaces - no duplicate configuration needed.
