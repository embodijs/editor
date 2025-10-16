# Space Ahead ✨ - An Astro v5 Personal Blog Template

A minimal space-inspired personal blog template, created by Siddhesh Thadeshwar.

![Space Ahead ✨](/space-ahead-preview.jpeg)

See the [demo](https://djsiddz.github.io/space-ahead) to know more.

## 🆕 Real-like Demo

View **Mumbai Stories** - [Samay Anand's Blog](https://djsiddz.github.io/samay-anand)! 🏏 | Source Code [here](https://github.com/djsiddz/samay-anand).

## Theme Features

- ✅ Tailwind CSS
- ✅ Mobile-first responsive layout
- ✅ Dark and light color mode
- ✅ Custom About, Contact & 404 pages
- ✅ Hero section with short bio
- ✅ Blog content collection
- ✅ Pagination support
- ✅ Tags support for blog posts
- ✅ Subscription form (only UI)
- ✅ View transitions (via swup.js)
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown support

### Future Scope (Based on requests)

- ⏹️ MDX support via @astrojs/mdx integration
- ⏹️ SEO-friendly with canonical URLs and OpenGraph data
- ⏹️ New Portfolio/Projects content collection

## Template Integrations

- Tailwind v4 via Vite Plugin as per latest Astro docs
- Swup.js for View Transitions
- RSS: [@astrojs/rss](https://docs.astro.build/en/guides/rss/)
- Sitemap: [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

## How to use this template

### Getting Started

1. [Create a new repo](https://github.com/new?template_name=space-ahead&template_owner=djsiddz) using this template.
2. Clone to repo to your local computer using `git clone <your-repo-url>`. Then `cd <your-repo-name>`.
3. Setup `pnpm` and use `pnpm install` and then `pnpm dev`.
4. Use the `src/site.config.ts` file to setup the template to your liking.
5. Update any content on homepage (`src/pages/index.astro`), about (`src/pages/about.astro`), and contact (`src/pages/contact.astro`).
6. Replace the template posts under (`src/content/blogs/*.md`) with your blog posts, using the same format, with the post metadata.
7. Check the [Astro Deployment guide](https://docs.astro.build/en/guides/deploy/) to know specific steps on deploying this on your preferred provider platform.

### Project Structure

You'll see the following folders and files:

```text
├── public/----------------- Contains the site logo (replace with your own).
├── src/--------------------
│   ├── assets/------------- Contains svg icons for theme toggle component.
│   │   └── images/--------- Contains default images for homepage and blog posts.
│   ├── components/--------- All Astro/Preact components in this theme.
│   ├── content/------------ Content Collections folder.
│   │   └── blogs/---------- All the blog posts in *.md files.
│   ├── icons/-------------- All Astro icon components.
│   ├── layouts/------------ Shared Layout component.
│   ├── pages/-------------- Various Astro pages, dynamic pages for blogs, tags; a custom 404 page.
│   ├── styles/------------- Contains `global.css`, `fonts.css` and `animate.css`.
│   ├── utils/-------------- Contains helper functions.
│   ├── content.config.ts--- Content collections definitions.
│   ├── env.d.ts------------ Contains helper functions.
│   └── site.config.ts------ Manage your site information and content here.
├── astro.config.mjs-------- Astro configuration file.
├── changelog.md------------ Detailed Changelog for this theme.
├── LICENSE----------------- Theme License.
├── package.json------------ Dependencies and metadata about this template.
├── README.md--------------- 📍 You are here.
└── tsconfig.json----------- Typescript configuration file.
```

#### Notes

- Read & consult [Astro's documentation](https://docs.astro.build/) for up-to-date information and making changes to this template.
- The `src/components` directory is where we like to put any Astro or Preact components.
- The `src/content/` directory contains "collections" of related Markdown (and MDX) documents. Use getCollection() to retrieve posts from `src/content/blogs/`, and type-check your frontmatter using an optional schema. See Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) docs to learn more.

## Credits and Support Info

### Support Info

- I provide **paid service** for customizing and setup any of my Astro templates for your projects and startups. Contact me on [Contra](https://contra.com/siddhesht) to know more.
- Please feel free to create issues for any bugs or feature requests on this theme.

### Credits

- Generated Space Ahead ✨ logo and images for demo blog content using Microsoft Designer.
- Homepage illustration by <a href="https://icons8.com/illustrations/author/ARh4OKrFtdfC">Pixeltrue Ouch!</a>
- Inspired from these amazing Astro templates - [Dante](https://github.com/JustGoodUI/dante-astro-theme) & [Chiri](https://github.com/the3ash/astro-chiri). Please do check them out.

## License

[GNU GPL v3](/LICENSE)
