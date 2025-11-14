declare module "astro:content" {
  export const z: import("astro/zod").z;
  export function defineCollection<
    S extends import("astro/content/config").BaseSchema,
  >(
    config: import("astro/content/config").CollectionConfig<S>,
  ): import("astro/content/config").CollectionConfig<S>;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
