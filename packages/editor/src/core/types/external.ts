import type { GitContent } from '$core/model/content';

export type GetGitContent = (path: string) => Promise<GitContent>;
export type GetGitFileContent<T = string> = (path: string) => Promise<T>;
