import { isAuthorized } from '$/lib/server/guards';
import { articleIdToPath } from '$core/logic/article';
import { getArticle } from '$core/logic/content';
import { createInternalGitUser } from '$core/logic/user';
import { getFileContent } from '$services/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	isAuthorized(locals);
	const path = articleIdToPath(params.articleId);
	const user = createInternalGitUser(locals);
	const { currentProject } = await parent();
	const { meta, content } = await getArticle(path, (path: string) =>
		getFileContent(
			path,
			{
				owner: currentProject.owner,
				name: currentProject.repo
			},
			user
		)
	);
	return {
		article: {
			meta,
			content
		}
	};
};
