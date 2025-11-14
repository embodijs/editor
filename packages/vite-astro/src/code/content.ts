import type { BaseSchema, CollectionConfig } from "astro/content/config";
import { defineCollection as astroCollection } from "astro:content";

type Definition = {
  type?: string;
  description?: string;
  label?: string;
};

export const meta = <Z extends BaseSchema>(
  schema: Z,
  definition: Definition,
): Z => {
  if ("meta" in schema && typeof schema.meta === "function") {
    return schema.meta(definition);
  } else {
    return schema.describe(JSON.stringify(definition));
  }
};

export function defineCollection<S extends BaseSchema>(
  config: CollectionConfig<S> & Definition,
): CollectionConfig<S> {
  return astroCollection(config as CollectionConfig<S>);
}
