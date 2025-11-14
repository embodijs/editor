# @embodi/vite-astro-cms

> If you used the plugin to create your embodi content config, please use the new command line interface for this `npx @embodi/cli init` or `npx @embodi/cli update`

Automatically generates CMS configuration from your Astro content collections. Part of [embodi cms](https://embodi.site).

## Installation

```bash
npm install --save-dev @embodi/vite-astro-cms
```

Add to your `astro.config.js`:

```ts
import { defineConfig } from "astro/config";
import viteEmbodiCms from "@embodi/vite-astro-cms";

export default defineConfig({
  vite: {
    plugins: [viteEmbodiCms()],
  },
});
```

## How it works

The plugin reads your Astro content collections schema and generates CMS configuration files in `./embodi/` during build. Commit these files to your repository so the CMS knows your content structure.

Then open your project in [app.embodi.site](https://app.embodi.site) to manage content through the CMS interface.
