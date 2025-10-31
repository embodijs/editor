import type { Provider } from '$/lib/db/schema';
import { JSONParseException } from '$core/error/data';
import { GitFileNotFoundException } from '$core/error/repo';
import { ProjectConfig, type NewProject, type Project } from '$core/model/project';
import type { GitRepo } from '$core/model/repo';
import type { GetGitFileContent } from '$core/types/external';
import * as v from 'valibot';

const generateId = (): string => {
	return `p_${crypto.randomUUID()}`;
};

export function projectToRepo(project: Project): GitRepo;
export function projectToRepo(project: Project, branch: string): Required<GitRepo>;
export function projectToRepo(project: Project, branch?: string): GitRepo | Required<GitRepo> {
	return {
		owner: project.owner,
		name: project.repo,
		branch
	} satisfies GitRepo;
}

export const generateProject = (data: NewProject, provider: Provider): Project => {
	const now = new Date();
	return {
		...data,
		id: generateId(),
		name: data.repo,
		description: null,
		provider,
		createdAt: now,
		updatedAt: now
	};
};

export const hasValidProjectConfig = async (
	load: GetGitFileContent<string | Buffer>
): Promise<boolean> => {
	const configPath = '.embodi/cms/config.json';
	const jsonString = await load(configPath);

	if (jsonString) {
		const config = JSON.parse(jsonString.toString());
		const result = v.safeParse(ProjectConfig, config);
		return result.success;
	}

	return false;
};

export const getProjectConfig = async (
	load: GetGitFileContent<string | Buffer>
): Promise<ProjectConfig> => {
	const configPath = '.embodi/cms/config.json';
	const jsonString = await load(configPath);
	if (!jsonString) {
		throw new GitFileNotFoundException();
	}
	try {
		const config = JSON.parse(jsonString.toString());
		return v.parse(ProjectConfig, config);
	} catch (error) {
		console.error(error);
		throw new JSONParseException(configPath);
	}
};
