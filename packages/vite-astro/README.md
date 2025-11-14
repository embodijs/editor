# @embodi/vite-astro-cms

Vite plugin for [embodi cms](https://embodi.site) that provides the `embodi:content` virtual module for adding CMS metadata to your Astro content collections.

## Installation

```bash
npm install --save-dev @embodi/vite-astro-cms
```

Add the plugin to your `astro.config.js`:

```ts
import { defineConfig } from "astro/config";
import viteEmbodiCms from "@embodi/vite-astro-cms";

export default defineConfig({
  vite: {
    plugins: [viteEmbodiCms()],
  },
});
```

**TypeScript setup:** The plugin automatically adds type definitions to your `tsconfig.json`. If you're using a custom TypeScript configuration or encountering type errors, ensure this is present:

```json
{
  "compilerOptions": {
    "types": ["@embodi/vite-astro-cms/client"]
  }
}
```

## Usage

Import from the `embodi:content` virtual module in your content config:

```ts
// src/content.config.ts
import { defineCollection, meta } from "embodi:content";
import { z } from "zod";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: meta(z.string(), {
      label: "Post Title",
      description: "The main heading for your blog post",
    }),
    coverImage: meta(z.string(), {
      type: "image",
      label: "Cover Image",
    }),
    publishDate: z.date(),
  }),
});

export const collections = { blog };
```

## The `meta()` Function

Use `meta()` to configure how fields appear in the CMS interface:

```ts
meta(schema, options);
```

**Options:**

- `type`: Field type in the CMS (e.g., `"image"` shows an upload area instead of a text input)
- `label`: Human-readable label for the field
- `description`: Help text shown in the CMS interface

**Example:**

```ts
coverImage: meta(z.string(), {
  type: "image",
  label: "Cover Image",
  description: "Upload a cover image for your post",
});
```

## Generating CMS Configuration

After defining your content collections, run:

```bash
npx @embodi/cli update
```

This generates CMS configuration files in `.embodi/` based on your schema. Commit these files to your repository so the CMS knows your content structure.

Run this command whenever you modify your content collections schema.

## Managing Content

Open your project in [app.embodi.site](https://app.embodi.site) to manage content through the CMS interface.
