import type { GitRepoMeta, GitRepoMetaMinimal, GitRepoOverview } from '$core/model/repo';
import type { InternalGitUser } from '$core/model/user';
import { graphql } from '$lib/gql';
import { type GetReposQuery } from '$lib/gql/graphql';
import { createGraphqlClient, generateRestBase, getClient } from './github';

const GET_REPOS = graphql(`
	query GetRepos($amount: Int!) {
		viewer {
			repositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					...RepositoryFields
				}
			}
			organizations(first: $amount, orderBy: { field: LOGIN, direction: DESC }) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					name
					repositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							...RepositoryFields
						}
					}
				}
			}
		}
	}

	fragment RepositoryFields on Repository {
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
`);

export const getRepoMetaFromGitbub = async (
	user: InternalGitUser,
	owner: string,
	name: string
): Promise<GitRepoMeta> => {
	const client = getClient();
	const { data } = await client.request('GET /repos/{owner}/{repo}', {
		owner,
		repo: name,
		...generateRestBase(user)
	});

	return {
		name: data.name,
		owner: data.owner.login,
		fullName: data.full_name,
		private: data.private,
		hasPages: data.has_pages,
		id: data.id.toString(),
		url: data.html_url,
		description: data.description ?? undefined
	};
};

export const getRepoPagesFromGithub = async (
	user: InternalGitUser,
	owner: string,
	name: string
) => {
	const client = getClient();
	const { data } = await client.request('GET /repos/{owner}/{repo}/pages', {
		owner,
		repo: name,
		...generateRestBase(user)
	});

	return {
		url: {
			url: data.html_url,
			cname: data.cname,
			verified: data.protected_domain_state === 'verified'
		},
		buildType: data.build_type,
		public: data.public,
		httpsEnforced: data.https_enforced
	};
};

const transformGitResultToMinimal = (
	repo: NonNullable<GetReposQuery['viewer']['repositories']['nodes']>[number] | null
): GitRepoMetaMinimal | null => {
	if (
		repo != null &&
		(repo.hasEmbodiConfigTs ||
			repo.hasEmbodiConfigJs ||
			repo.hasAstroConfigJs ||
			repo.hasAstroConfigTs ||
			repo.hasAstroConfigMjs)
	) {
		return {
			id: repo.id,
			description: repo.description ?? undefined,
			owner: repo.owner.login,
			name: repo.name,
			fullName: repo.nameWithOwner,
			private: repo.isPrivate
		};
	}

	return null;
};

const extractRepoPageRef = (repo: GetReposQuery['viewer']['repositories']) => {
	if (!repo.pageInfo.hasNextPage) {
		return null;
	}
	return repo.pageInfo.endCursor;
};

const createRepoOverview = (
	repoNode: GetReposQuery['viewer']['repositories'],
	owner: string
): GitRepoOverview => {
	const pageRef = extractRepoPageRef(repoNode);
	const transformedRepos = (repoNode.nodes ?? [])
		.map((repo) => {
			if (!repo) {
				return null;
			}
			return transformGitResultToMinimal(repo);
		})
		.filter((value) => value !== null);
	return {
		owner,
		pageRef,
		repos: transformedRepos
	};
};

const transformOrgReposToOverviews = (response: GetReposQuery) => {};

export const getReposFromGithub = async (
	user: InternalGitUser,
	amount: number = 20
): Promise<GitRepoOverview[]> => {
	const github = createGraphqlClient(user.token);
	const response = await github.request(GET_REPOS, {
		amount
	});

	const orgs = response.viewer.organizations.nodes;
	const transformedOrgs = (orgs ?? [])
		.map((org) => {
			if (!org) {
				return null;
			}
			return createRepoOverview(org.repositories, org.name ?? '');
		})
		.filter((value) => value !== null && value.repos.length > 0);

	return [createRepoOverview(response.viewer.repositories, user.username), ...transformedOrgs];
};
