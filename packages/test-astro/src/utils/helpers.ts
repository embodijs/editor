import { type CollectionEntry } from 'astro:content';

export function sortItemsByDateDesc(itemA: CollectionEntry<'blogs'>, itemB: CollectionEntry<'blogs'>) {
    return new Date(itemB.data.pubDate).getTime() - new Date(itemA.data.pubDate).getTime();
}

export function createSlugFromTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
}

export function getAllTags(posts: CollectionEntry<'blogs'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: createSlugFromTitle(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blogs'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blogs'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => createSlugFromTitle(tag)).includes(tagId));
    return filteredPosts;
}

export const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`;