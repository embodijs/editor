export const pathToArticleId = (path: string) => Buffer.from(path).toString('base64url');

export const articleIdToPath = (id: string) => Buffer.from(id, 'base64url').toString('utf8');
