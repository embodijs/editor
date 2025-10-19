import { Article } from '$core/model/article';
import type { MetaInputField } from '$core/model/collection';
import { convertMetaFiledsToValibotSchmea } from './collection';
import { isRecord, removeEmpty } from '$lib/helpers/object';
import * as v from 'valibot';
import matter from 'gray-matter';
import {
	GitCommitRef,
	GitTreeType,
	NewGitTree,
	type GitBlobRef,
	type GitRefResult,
	type GitTreeResponse,
	type NewGitBlob,
	type NewGitCommit
} from '$core/model/repo';
import type { GetGitFileContent } from '$core/types/external';

export const pathToFileId = (path: string) => Buffer.from(path).toString('base64url');

export const fileIdToPath = (id: string) => Buffer.from(id, 'base64url').toString('utf8');

export const flatMeta = (
	meta: Record<string, unknown>,
	parentKey: string = ''
): Record<string, unknown> => {
	return Object.entries(meta).reduce((acc, [key, value]) => {
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			!(value instanceof Date)
		) {
			return { ...acc, ...flatMeta(value as Record<string, unknown>, `${parentKey}${key}.`) };
		}
		return { ...acc, [`${parentKey}${key}`]: value };
	}, {});
};

const validateUnflatedMeta = (meta: Record<string, unknown>): Record<string, unknown> => {
	return Object.fromEntries(
		Object.entries(meta).map(([key, value]) => {
			if (isRecord(value) && !(value instanceof Date)) {
				return [key, unflatMeta(value as Record<string, unknown>)];
			}
			return [key, value];
		})
	);
};

export const unflatMeta = (meta: Record<string, unknown>): Record<string, unknown> => {
	const unflated = Object.entries(meta).reduce(
		(acc, [key, value]) => {
			const [parentKey, ...childKey] = key.split('.');
			if (childKey.length === 0) {
				return {
					...acc,
					[key]: value
				};
			}
			if (!acc[parentKey]) {
				acc[parentKey] = {};
			}
			//Join the sub keys to do validation for the hole object after reduce loop
			(acc[parentKey] as Record<string, unknown>)[childKey.join('.')] = value;
			return acc;
		},
		{} as Record<string, unknown>
	);
	return validateUnflatedMeta(unflated);
};

export const generateArticleFormSchema = (fields: MetaInputField[]) => {
	const metaSchema = convertMetaFiledsToValibotSchmea(fields);
	return v.object({
		...Article.entries,
		meta: metaSchema
	});
};

export const combineFrontmatterAndString = (frontmatter: Record<string, unknown>, text: string) => {
	return {
		...frontmatter,
		text
	};
};

export const getArticle = async (path: string, load: GetGitFileContent<string | Buffer>) => {
	const fileContent = await load(path);
	if (!fileContent) {
		throw new Error('File not found');
	}

	const { data, content } = matter(fileContent);
	return { meta: data, content };
};

export const slugify = (str: string) => {
	return str
		.normalize('NFD') // Decompose accented characters
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '') // Keep only alphanumeric, spaces, hyphens
		.replace(/[\s-]+/g, '-') // Replace spaces/hyphens with single hyphen
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const hasInlineHeadline = (content: string) => {
	return content.trim().startsWith('# ');
};

export const getInlineHeadline = (content: string) => {
	const [headline] = content.trim().split('\n');
	return headline.slice(2).trim();
};

export const generateArticleFileName = (article: Article) => {
	if (hasInlineHeadline(article.markdown)) {
		const headline = getInlineHeadline(article.markdown);
		return `${slugify(headline)}.md`;
	} else if (typeof article.meta.title === 'string') {
		return `${slugify(article.meta.title)}.md`;
	}

	throw new Error('Article has no title!');
};

export const saveArticle = async (
	article: Article,
	filePath: string,
	server: {
		commit: (commit: NewGitCommit) => Promise<GitRefResult>;
		getCommit: () => Promise<GitCommitRef>;
		storeTree: (tree: NewGitTree[], base: string) => Promise<GitTreeResponse>;
		storeBlob: (blob: NewGitBlob) => Promise<GitBlobRef>;
	}
) => {
	const markdownFileContent = matter.stringify(article.markdown, removeEmpty(article.meta));
	const fileRefsPromise = Promise.all(
		article.files.map(async (file) => {
			const blobRef = await server.storeBlob({
				content: file.base64.split(',')[1],
				encoding: 'base64'
			});
			return {
				path: file.absolutePath,
				sha: blobRef.sha
			};
		})
	);
	const [parentCommit, fileRefs] = await Promise.all([server.getCommit(), fileRefsPromise]);
	const treeElements: NewGitTree[] = fileRefs.map((blobRef) => ({
		mode: '100644',
		type: GitTreeType.BLOB,
		sha: blobRef.sha,
		path: blobRef.path
	}));
	treeElements.push({
		mode: '100644',
		type: GitTreeType.BLOB,
		content: markdownFileContent,
		path: filePath
	});
	const tree = await server.storeTree(treeElements, parentCommit.sha);
	const commit = await server.commit({
		message: `Update article ${filePath}`,
		parents: [parentCommit.sha],
		tree: tree.sha
	});
	return commit;
};
