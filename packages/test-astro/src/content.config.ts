import { glob, file } from "astro/loaders";
import { defineCollection, meta } from "embodi:content";
import { z } from "astro:content";

const blogsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
  description: "Collection of blog posts",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: meta(z.date(), {
        label: "Published at",
        description: "The date the blog post was published",
      }),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      image: z
        .object({
          url: image(),
          alt: z.string().optional(),
        })
        .optional(),
    }),
});

const simpleTestCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().default("Description"),
    pubDate: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const dataFile = defineCollection({
  loader: file("./src/content/data.yml"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      image: z
        .object({
          url: image(),
          alt: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = {
  blogs: blogsCollection,
  simpleTest: simpleTestCollection,
  // data: dataFile,
};
