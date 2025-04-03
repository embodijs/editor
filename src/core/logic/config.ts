import { ExternalEmbodiConfigSchema, type ExternalEmbodiConfig } from '$core/model/config';
import type { GitContent, GitFile } from '$core/model/content';
import * as v from 'valibot';
import { extractJsonFromGitFile } from './repo';
import type { GetGitContent } from '$core/types/external';

export enum ConfigValidationResult {
	INVALID,
	VALID,
	MISSING
}
export const loadEmbodiConfig = async (load: GetGitContent) => {
	const content = await load('/.embodi/editor.json');
	return content;
};

export const extractEmbodiConfig = (gitFile: GitFile): ExternalEmbodiConfig => {
	const config = extractJsonFromGitFile(gitFile);

	const parsed = v.parse(ExternalEmbodiConfigSchema, config);
	return parsed;
};

export const isGitFile = (file: GitContent): file is GitFile => {
	if (Array.isArray(file) || file.type !== 'file') {
		return false;
	}
	return true;
};

export const validateConfig = (gitFile: GitContent): boolean => {
	try {
		if (!isGitFile(gitFile)) {
			return false;
		}
		const config = extractJsonFromGitFile(gitFile);

		const result = v.safeParse(ExternalEmbodiConfigSchema, config);
		return result.success;
	} catch (error) {
		console.error('Error parsing config:', error);
		return false;
	}
};

export const extractCollectionsTitles = (config: ExternalEmbodiConfig): string[] => {
	return config.collections.map((collection) => collection.name);
};
