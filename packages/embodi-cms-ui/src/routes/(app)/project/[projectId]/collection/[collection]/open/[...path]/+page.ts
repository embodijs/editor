import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const { path, collection, projectId } = params;
	const index = path.lastIndexOf('.');
	const fileType = path.slice(index + 1);

	if (['yaml', 'yml', 'json'].includes(fileType)) {
		redirect(302, `/project/${projectId}/collection/${collection}/record/${path}`);
	} else if (['md', 'mdx'].includes(fileType)) {
		redirect(302, `/project/${projectId}/collection/${collection}/record/${path}`);
	}

	error(406, {
		type: 'File type not supported',
		message: 'The file type is currently not supported.'
	});
};
