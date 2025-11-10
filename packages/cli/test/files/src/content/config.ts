import { defineCollection, z } from "astro:content";

const cover_art = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    alt: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.date().optional(),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  cover_art,
  blog,
};
