import { EmbodiConfigSchema } from '$core/model/config';
import type { GitContent, GitFile } from '$core/model/content';
import * as v from 'valibot';
import { extractJsonFromGitFile } from './repo';

export const readEmbodiConfig = async (load: (path: string) => Promise<GitFile>) => {
	const config = await load('/.embodi/editor.json');

	const parsed = v.parse(EmbodiConfigSchema, config);
	return parsed;
};

export enum ValidataionsReturn {
	INVALID,
	VALID,
	MISSING
}

export const hasValidConfig = async (
	load: (path: string) => Promise<GitContent>
): Promise<ValidataionsReturn> => {
	try {
		const gitFile = await load('/.embodi/editor.json');
		if (Array.isArray(gitFile) || gitFile.type !== 'file') {
			return ValidataionsReturn.INVALID;
		}

		const config = extractJsonFromGitFile(gitFile);
		console.log(JSON.stringify(config));

		const result = v.safeParse(EmbodiConfigSchema, config);
		return result.success ? ValidataionsReturn.VALID : ValidataionsReturn.INVALID;
	} catch (error) {
		console.error('Error parsing config:', error);
		return ValidataionsReturn.MISSING;
	}
};
