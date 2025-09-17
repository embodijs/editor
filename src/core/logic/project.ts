import type { NewProject, Project } from '$core/model/project';
import type { Provider } from '$core/model/repo';

const generateId = (): string => {
	return `p_${crypto.randomUUID()}`;
};

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
