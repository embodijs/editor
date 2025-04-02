import type { NewProject, Project } from '$core/model/project';

const generateId = (): string => {
	return `p_${crypto.randomUUID()}`;
};

export const generateProject = (data: NewProject): Project => {
	const now = new Date();
	return {
		...data,
		id: generateId(),
		name: data.repo,
		description: null,
		createdAt: now,
		updatedAt: now
	};
};
