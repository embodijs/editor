import type { GitContent } from '$core/model/content';
import type { BaseGitRepo, GitRepo } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { graphql } from '$lib/gql';
import { createGithubClient } from './github';

const GET_REPO_CONTENT = graphql(`
	query GetRepoContent($owner: String!, $name: String!, $path: String!) {
		repository(owner: $owner, name: $name) {
			object(expression: $path) {
				... on Tree {
					entries {
						name
						type
						object {
							... on Blob {
								text
							}
						}
					}
				}
			}
		}
	}
`);

const GET_REPO = graphql(`
	query GetRepo($amount: Int!) {
		viewer {
			repositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {
				nodes {
					id
					url
					description
					owner {
						login
					}
					name
					nameWithOwner
					isPrivate
					viewerPermission
					defaultBranchRef {
						name
					}

					# Check root directory files using the actual branch
					hasEmbodiConfigTs: object(expression: "HEAD:.embodi.ts") {
						id
					}
					hasEmbodiConfigJs: object(expression: "HEAD:.embodi.js") {
						id
					}
					hasAstroConfigJs: object(expression: "HEAD:astro.config.js") {
						id
					}
					hasAstroConfigTs: object(expression: "HEAD:astro.config.ts") {
						id
					}
					hasAstroConfigMjs: object(expression: "HEAD:astro.config.mjs") {
						id
					}
				}
			}
		}
	}
`);

export const getGitHubRepositories = async (
	user: InternalGitUser,
	amount: number = 20
): Promise<GitRepo[]> => {
	const github = createGithubClient(user);
	const response = await github.request(GET_REPO, {
		amount
	});

	const repositories = response.viewer.repositories.nodes;
	if (!repositories) {
		throw new Error('Not found');
	}

	return repositories.reduce((acc: GitRepo[], repo) => {
		if (
			repo != null &&
			(repo.hasEmbodiConfigTs ||
				repo.hasEmbdoiConfigJs ||
				repo.hasAstroConfigJs ||
				repo.hasAstroConfigTs ||
				repo.hasAstroConfigMjs)
		) {
			acc.push({
				id: repo.id,
				url: repo.url,
				description: repo.description ?? undefined,
				owner: repo.owner.login,
				name: repo.name,
				sufficientAccessRights: ['ADMIN', 'WRITE'].includes(repo.viewerPermission ?? ''),
				fullName: repo.nameWithOwner,
				private: repo.isPrivate
			});
		}
		return acc;
	}, [] as GitRepo[]);
};

export const getRepoContentFromGithub = async (
	path: string,
	repo: BaseGitRepo,
	user: InternalGitUser
): Promise<GitContent> => {
	const github = createGithubClient(user);
	const response = await github.request(GET_REPO_CONTENT, {
		owner: repo.owner,
		name: repo.name,
		path: `HEAD:${path}`
	});

	const repository = response.repository;
	if (!repository?.object) {
		throw new Error('Not found');
	}

	const treeObject = repository.object;
	if ('entries' in treeObject && treeObject.entries) {
		return treeObject.entries
			.filter((entry) => entry.type === 'blob' || entry.type === 'tree')
			.map(convertGithubContentToGitContent);
	} else if ('text' in treeObject && treeObject.text) {
		return convertGithubContentToGitFile(treeObject);
	}
	throw new Error('Invalid content type');
};
