import { test, expect, describe } from 'vitest';
import { flatMeta } from './article';

describe('Article', () => {
	test('flat meta data with flatMeta', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: '2022-01-01',
				tags: ['test', 'article']
			}
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': '2022-01-01',
			'meta.tags': ['test', 'article']
		};
		expect(flatMeta(article)).toEqual(expected);
	});

	test('flat meta data with flatMeta keep Date', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: new Date('2022-01-01'),
				tags: ['test', 'article']
			}
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': new Date('2022-01-01'),
			'meta.tags': ['test', 'article']
		};
		expect(flatMeta(article)).toEqual(expected);
	});
});
