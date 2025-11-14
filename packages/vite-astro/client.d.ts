import type { BaseSchema, CollectionConfig } from "astro/content/config";

declare module "embodi:content" {
  type Definition = {
    type?: string;
    description?: string;
    label?: string;
  };

  const meta: <Z extends BaseSchema>(schema: Z, definition: Definition) => Z;

  function defineCollection<S extends BaseSchema>(
    config: CollectionConfig<S> & Definition,
  ): CollectionConfig<S>;

  export { defineCollection, meta };
}
