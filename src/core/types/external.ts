import type { GitContent } from '$core/model/content';

export type GetGitContent = (path: string) => Promise<GitContent>;
